import cron from 'node-cron';
import Post from '../models/Post.js';
import { refreshRedditToken, submitToReddit } from '../services/redditService.js';

export function startScheduler() {
  console.log('🚀 Standalone API: Cron scheduler started (running every 60s)');

  cron.schedule('* * * * *', async () => {
    const duePosts = await Post.find({
      status: 'scheduled'
    });

    const now = new Date();
    const postsToPublish = duePosts.filter(post => {
      const scheduledAt = post.scheduledTime || new Date(`${post.date}T${post.time}`);
      return scheduledAt <= now;
    });

    if (postsToPublish.length === 0) return;

    console.log(`⏰ Found ${postsToPublish.length} posts due for publishing...`);

    for (const post of postsToPublish) {
      try {
        post.status = 'processing';
        await post.save();

        const token = await refreshRedditToken(post.userId);

        // Reddit Profile vs Subreddit logic
        let targetSr = post.subreddit;
        if (targetSr.startsWith('u/')) {
          targetSr = 'u_' + targetSr.replace(/^u\//, '');
        } else {
          targetSr = targetSr.replace(/^r\//, '');
        }

        const postId = await submitToReddit(token, {
          sr: targetSr,
          title: post.title,
          kind: post.postType === 'text' ? 'self' : post.postType === 'link' ? 'link' : post.imageUrl ? 'link' : 'self',
          text: post.postType === 'text' ? (post.body || '') : undefined,
          url: post.postType !== 'text' ? (post.imageUrl || post.linkUrl) : undefined,
        });
        
        post.redditPostIds = [{ sr: post.subreddit, postId }];

        post.status = 'published';
        await post.save();
        console.log(`✅ Successfully published post: ${post.title}`);
      } catch (err) {
        console.error(`❌ Failed to publish post ${post._id}:`, err.message);
        post.status = 'failed';
        post.error = err.message;
        await post.save();
      }
    }
  });
}
