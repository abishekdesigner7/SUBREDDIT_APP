import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subreddit: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  body: { type: String },
  imageUrl: { type: String },
  linkUrl: { type: String },
  postType: { type: String, enum: ['text', 'image', 'link'], default: 'text' },
  flair: { type: String },
  tags: {
    nsfw: { type: Boolean, default: false },
    spoiler: { type: Boolean, default: false },
    brandAffiliate: { type: Boolean, default: false }
  },
  status: { type: String, enum: ['scheduled', 'published', 'queued', 'processing', 'failed'], default: 'scheduled' },
  redditPostIds: [{ sr: String, postId: String }], // Track post IDs for each subreddit
  error: String,
  scheduledTime: { type: Date } 
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
