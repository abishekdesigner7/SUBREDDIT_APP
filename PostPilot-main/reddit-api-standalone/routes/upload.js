import express from 'express';
import { auth } from '../middleware/auth.js';
import { getPresignedUrl } from '../services/s3Service.js';

const router = express.Router();

router.post('/presign', auth, async (req, res) => {
  try {
    const { fileType } = req.body;
    const data = await getPresignedUrl(fileType);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
