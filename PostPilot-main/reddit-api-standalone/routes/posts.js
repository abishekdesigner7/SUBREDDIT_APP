import express from 'express';
import { auth } from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// ── CREATE ────────────────────────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isTrialExpired = user.subscriptionStatus === 'trialing' && new Date() > new Date(user.trialEndsAt);
    if (['none', 'canceled', 'past_due'].includes(user.subscriptionStatus) || isTrialExpired) {
      return res.status(403).json({ message: 'You must upgrade or start a trial to schedule posts.' });
    }

    const { date, time, title, subreddit, postType } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!subreddit?.trim()) return res.status(400).json({ message: 'Subreddit is required' });
    if (!date) return res.status(400).json({ message: 'Date is required' });
    if (!time) return res.status(400).json({ message: 'Time is required' });

    // Use frontend-computed scheduledTime (already in correct UTC) if provided
    // Otherwise fall back to building from date+time (assumes server timezone)
    const scheduledTime = req.body.scheduledTime
      ? new Date(req.body.scheduledTime)
      : new Date(`${date}T${time}`);
    if (isNaN(scheduledTime.getTime())) return res.status(400).json({ message: 'Invalid date or time' });

    // Strip frontend-only fields before saving
    const { id: _id, createdAt: _c, scheduledTime: _st, ...postData } = req.body;

    const post = await Post.create({
      ...postData,
      userId: req.user.id,
      scheduledTime,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── READ ALL ──────────────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({ scheduledTime: 1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── UPDATE ────────────────────────────────────────────────────
router.put('/:id', auth, async (req, res) => {
  try {
    const { date, time } = req.body;
    const scheduledTime = req.body.scheduledTime
      ? new Date(req.body.scheduledTime)
      : new Date(`${date}T${time}`);
    if (isNaN(scheduledTime.getTime())) return res.status(400).json({ message: 'Invalid date or time' });

    const { id: _id, createdAt: _c, userId: _u, scheduledTime: _st, ...updateData } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { ...updateData, scheduledTime } },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ── DELETE ONE ────────────────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE ALL ────────────────────────────────────────────────
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ userId: req.user.id });
    res.json({ message: 'All posts deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
