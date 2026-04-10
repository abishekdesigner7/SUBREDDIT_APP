import axios from 'axios';
import User from '../models/User.js';

const REDDIT_TOKEN_URL = 'https://www.reddit.com/api/v1/access_token';
const REDDIT_SUBMIT_URL = 'https://oauth.reddit.com/api/submit';
const USER_AGENT = 'web:PostPilot:v1.0.0 (by /u/hellokarmio)';

function getBasicAuthHeader() {
  return 'Basic ' + Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
}

export async function exchangeCodeForToken(code) {
  const response = await axios.post(REDDIT_TOKEN_URL, new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDDIT_REDIRECT_URI,
  }).toString(), {
    headers: {
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
  });

  const { access_token, refresh_token, expires_in } = response.data;
  
  // Also get the username
  const userResponse = await axios.get('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'User-Agent': USER_AGENT,
    },
  });

  return {
    accessToken: access_token,
    refreshToken: refresh_token,
    expiresIn: expires_in,
    username: userResponse.data.name,
  };
}

export async function refreshRedditToken(userId) {
  const user = await User.findById(userId);
  if (!user?.reddit?.refreshToken) throw new Error('Reddit not connected');

  // Check expiry with 60s buffer
  if (user.reddit.tokenExpiresAt && user.reddit.tokenExpiresAt > new Date(Date.now() + 60000)) {
    return user.reddit.accessToken;
  }

  const response = await axios.post(REDDIT_TOKEN_URL, new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: user.reddit.refreshToken,
  }).toString(), {
    headers: {
      Authorization: getBasicAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
  });

  const { access_token, expires_in } = response.data;
  user.reddit.accessToken = access_token;
  user.reddit.tokenExpiresAt = new Date(Date.now() + (expires_in - 100) * 1000);
  await user.save();

  return access_token;
}

export async function submitToReddit(accessToken, { sr, title, kind = 'self', text, url }) {
  const params = { sr, kind, title, resubmit: 'true' };
  if (kind === 'self') params.text = text || '';
  if (kind === 'link') params.url = url || '';

  const response = await axios.post(REDDIT_SUBMIT_URL, new URLSearchParams(params).toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
  });

  if (response.data.json?.errors?.length) {
    throw new Error(`Reddit API Error: ${JSON.stringify(response.data.json.errors)}`);
  }

  return response.data.json.data.id;
}

export async function getSubscribedSubreddits(accessToken) {
  const response = await axios.get('https://oauth.reddit.com/subreddits/mine/subscriber', {
    params: { limit: 100 },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': USER_AGENT,
    },
  });

  return response.data.data.children.map(c => ({
    name: c.data.display_name,
    title: c.data.title,
    subscribers: c.data.subscribers,
    icon: c.data.icon_img || c.data.community_icon,
  }));
}
