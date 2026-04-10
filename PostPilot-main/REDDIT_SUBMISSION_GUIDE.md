# Reddit API Resubmission Guide for PostPilot

This guide contains everything you need to resubmit your Reddit API access request and get **approved** this time.

---

## ⚠️ BEFORE YOU RESUBMIT

Make sure these are done first:

1. ✅ **Privacy Policy page is live** at `https://your-vercel-domain.vercel.app/privacy`
2. ✅ **Terms of Service page is live** at `https://your-vercel-domain.vercel.app/terms`
3. ✅ **Footer links work** — click "Privacy Policy" and "Terms of Service" in the footer and confirm they load
4. ✅ **Push latest code to GitHub** — Reddit may visit your repo
5. ✅ **User-Agent updated** — The backend now uses `web:PostPilot:v1.0.0 (by /u/hellokarmio)`

---

## 📝 Application Description (Copy-Paste This)

Use this text when Reddit asks "Describe your application":

```
PostPilot is a web-based content scheduling platform for Reddit that helps individual content creators and small businesses plan and publish their Reddit posts at optimal times.

HOW IT WORKS:
- Users authenticate with Reddit via the official OAuth 2.0 flow (authorization code grant with permanent duration).
- Users compose posts (text or image) in our dashboard, select a target subreddit, and choose a future publish time.
- Our backend worker checks for due posts every 60 seconds and submits them to Reddit using the user's own OAuth token.
- Images are uploaded to AWS S3 and submitted as link posts.

ANTI-SPAM SAFEGUARDS:
- We enforce a minimum 10-minute gap between consecutive posts per user to prevent spam and protect user accounts from Reddit's built-in rate limiting.
- Subscription tiers limit the number of posts per month (Free: 10, Pro: 100, Business: unlimited).
- All posts are submitted under the user's own Reddit identity — we never use shared or service accounts.
- We do not support automated commenting, voting, or any form of engagement manipulation.

DATA HANDLING (Reddit Responsible Builder Policy Compliance):
- We store only the user's Reddit username, OAuth access token, and refresh token.
- We NEVER store Reddit passwords.
- If a user deletes content on Reddit, we promptly remove any cached copies.
- When a user disconnects their Reddit account or deletes their PostPilot account, all associated tokens and data are permanently deleted.
- We do not sell, license, or redistribute any Reddit user data.

OAUTH SCOPES REQUESTED:
- identity: To identify the connected Reddit user.
- submit: To submit posts on behalf of the user at their scheduled time.
- mysubreddits: To show the user a list of their subscribed subreddits for targeting.
- read: To fetch subreddit metadata.

TECH STACK:
- Frontend: Next.js 15, hosted on Vercel
- Backend: Node.js / Express, hosted on AWS EC2
- Database: MongoDB Atlas (encrypted at rest, TLS in transit)
- Media Storage: AWS S3 (server-side encryption)
- Payments: Stripe

LIVE APPLICATION: [Replace with your Vercel URL]
PRIVACY POLICY: [Replace with your Vercel URL]/privacy  
TERMS OF SERVICE: [Replace with your Vercel URL]/terms
SOURCE CODE: https://github.com/hellokarmio

This is a commercial application. We charge a subscription fee for advanced scheduling features via Stripe.
```

---

## 🔧 Reddit App Dashboard Settings

Go to https://www.reddit.com/prefs/apps and make sure:

| Setting | Value |
|---|---|
| **App type** | `web app` |
| **Name** | `PostPilot` |
| **Description** | Use the text above |
| **About URL** | Your Vercel landing page URL |
| **Redirect URI** | Your EC2 backend URL + `/api/auth/reddit/callback` |
| **Permissions** | identity, submit, mysubreddits, read |

---

## 📧 If They Ask Follow-Up Questions

### "How will you handle user data?"
```
We store the minimum data required: Reddit username, OAuth tokens, and scheduled post content. All data is encrypted (MongoDB Atlas with TLS, AWS S3 with SSE). We comply with Reddit's data deletion requirements — when a user disconnects Reddit or deletes their account, all tokens are permanently destroyed. We never sell or share user data. Full details at [your-url]/privacy
```

### "Is this commercial?"
```
Yes. PostPilot is a commercial SaaS application. We offer a free tier (10 posts/month) and paid tiers ($19/mo and $49/mo) processed through Stripe. No Reddit data is monetized — revenue comes solely from subscription fees for the scheduling feature.
```

### "How do you prevent spam/abuse?"
```
PostPilot has multiple anti-spam layers:
1. A hard-coded 10-minute minimum gap between any two posts by the same user.
2. Monthly post limits per subscription tier (Free: 10, Pro: 100).
3. Each post uses the user's own OAuth token — no shared accounts.
4. We explicitly prohibit spam, harassment, and vote manipulation in our Terms of Service ([your-url]/terms).
5. Accounts violating our Acceptable Use Policy are terminated immediately.
```

---

## 🚀 Resubmission Steps

1. Go to https://www.reddit.com/prefs/apps
2. Click "edit" on your existing app
3. Update the description with the text above
4. Make sure "About URL" points to your live Vercel page
5. Save changes
6. Go to https://support.reddithelp.com/hc/en-us/requests/new and submit a new request:
   - Category: "I am a developer and want API access"
   - Include your app's client ID
   - Paste the full Application Description from above
   - Link to your Privacy Policy and Terms of Service

---

## 💡 Pro Tips

- **Be patient** — Reddit reviews can take 3-7 business days
- **Don't resubmit multiple times** — it can flag your account
- **Reply to the rejection email** with the updated information instead of creating a brand new ticket
- **Keep the app set to "web app"** (not "script" or "installed app")
