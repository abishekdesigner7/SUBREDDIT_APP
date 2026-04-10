import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { exchangeCodeForToken } from '../services/redditService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const user = await User.create({ email, password, name, subscriptionStatus: 'trialing', trialEndsAt });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, subscriptionStatus: user.subscriptionStatus, trialEndsAt: user.trialEndsAt } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { 
      id: user._id, email: user.email, name: user.name, reddit: user.reddit,
      subscriptionStatus: user.subscriptionStatus, trialEndsAt: user.trialEndsAt 
    }});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/reddit', (req, res) => {
  const { userId } = req.query;

  // If userId is passed (connect flow), verify the JWT belongs to that user
  if (userId) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Auth token required to connect account' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id !== userId) return res.status(403).json({ message: 'Unauthorized' });
    } catch {
      return res.status(401).json({ message: 'Invalid auth token' });
    }
  }

  const state = userId || 'login';
  const scope = 'submit identity mysubreddits read';
  const url = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${process.env.REDDIT_REDIRECT_URI}&duration=permanent&scope=${scope}`;
  res.json({ url });
});

router.get('/reddit/callback', async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  try {
    const { code, state } = req.query;
    
    // Exchange code for tokens
    const { accessToken, refreshToken, expiresIn, username } = await exchangeCodeForToken(code);
    
    let user;
    if (state && state !== 'login') {
      // Connect flow: Link to existing user
      user = await User.findById(state);
      if (!user) throw new Error('User not found');
    } else {
      // Login/Signup flow: Find by reddit username
      user = await User.findOne({ 'reddit.username': username });
      
      if (!user) {
        // Registration: Create new user
        const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        user = await User.create({ 
          name: username, 
          subscriptionStatus: 'trialing', 
          trialEndsAt 
        });
      }
    }
    
    // Update Reddit details
    user.reddit = {
      accessToken,
      refreshToken,
      tokenExpiresAt: new Date(Date.now() + (expiresIn - 100) * 1000),
      username,
    };
    
    await user.save();

    // Generate login token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Prepare user payload for frontend
    const userJson = JSON.stringify({ 
      id: user._id, 
      name: user.name, 
      reddit: user.reddit,
      subscriptionStatus: user.subscriptionStatus, 
      trialEndsAt: user.trialEndsAt 
    });

    res.redirect(`${clientUrl}/auth-callback?token=${token}&user=${encodeURIComponent(userJson)}`);
  } catch (err) {
    res.redirect(`${clientUrl}/dashboard?error=auth_failed&message=${encodeURIComponent(err.message)}`);
  }
});

export default router;
