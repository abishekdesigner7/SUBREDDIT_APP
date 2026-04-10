import './config/env.js';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { startScheduler } from './scheduler/index.js';

// ── Route imports ─────────────────────────────────────────
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import uploadRoutes from './routes/upload.js';
import stripeRoutes from './routes/stripe.js';
import redditRoutes from './routes/reddit.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000', 
  credentials: true 
}));

// Stripe Webhook (MUST be before express.json)
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Mount routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/reddit', redditRoutes);

/**
 * ─── Database & Server Boot ───────────────────────────────
 */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Standalone API: MongoDB connected');

    // Start background scheduler
    startScheduler();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🌐 Standalone API running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
    });
  })
  .catch((err) => {
    console.error('❌ Standalone API: MongoDB connection error:', err.message);
    process.exit(1);
  });
