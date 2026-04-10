import express from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/checkout', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    let priceId;
    if (plan === 'pro') priceId = process.env.STRIPE_PRO_PRICE_ID;
    else if (plan === 'business') priceId = process.env.STRIPE_BUSINESS_PRICE_ID;
    else return res.status(400).json({ message: 'Invalid plan selected' });

    // req.user comes from JWT payload which uses 'id' not '_id'
    const userId = req.user.id;

    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/#pricing`,
      client_reference_id: userId,
      metadata: { plan },
    };

    // Only set customer_email if available (Reddit OAuth users may not have email)
    if (req.user.email) sessionParams.customer_email = req.user.email;

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Secure Webhook Endpoint
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const plan = session.metadata?.plan || 'pro';

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        subscriptionStatus: 'active',
        plan: plan === 'business' ? 'business' : 'pro',
      });
      console.log(`✅ Stripe Webhook: Activated '${plan}' subscription for User ${userId}`);
    }
  }

  res.sendStatus(200);
});

export default router;
