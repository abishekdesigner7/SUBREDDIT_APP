import express from 'express';
import { auth } from '../middleware/auth.js';
import { refreshRedditToken, getSubscribedSubreddits } from '../services/redditService.js';

const router = express.Router();

router.get('/subreddits', auth, async (req, res) => {
  try {
    const accessToken = await refreshRedditToken(req.user.id);
    const subreddits = await getSubscribedSubreddits(accessToken);
    res.json(subreddits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
