export const SITE_NAME = "PostPilot";

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export const FEATURES = [
  {
    icon: "calendar",
    title: "Smart Post Scheduling",
    description:
      "Queue posts days or weeks in advance. Set exact publish times and PostPilot handles the rest automatically.",
  },
  {
    icon: "image",
    title: "Image Upload",
    description:
      "Attach images to any post. Files are uploaded securely to cloud storage and linked to your post automatically at publish time.",
  },
  {
    icon: "zap",
    title: "Auto-Publish",
    description:
      "PostPilot checks every 60 seconds and publishes your posts at exactly the time you set — no manual action needed.",
  },
  {
    icon: "shield",
    title: "Reddit OAuth",
    description:
      "Connect your Reddit account securely via official OAuth 2.0. No passwords stored. Posts go out from your real account.",
  },
  {
    icon: "file-text",
    title: "Text, Image & Link Posts",
    description:
      "Schedule any Reddit post type — text posts, image posts, or link posts. Full control over every submission.",
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Connect Your Reddit Account",
    description:
      "Link your Reddit profile securely via OAuth. No passwords stored. Takes under 30 seconds to get started.",
  },
  {
    number: "02",
    title: "Create and Queue Your Posts",
    description:
      "Write your post, upload your images, pick your target subreddit, and choose a publish time. That's it.",
  },
  {
    number: "03",
    title: "Watch Your Content Go Live",
    description:
      "Sit back while PostPilot publishes your posts at exactly the right time. Track everything from your dashboard.",
  },
];

export const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for getting started",
    highlight: false,
    badge: "",
    features: [
      "10 scheduled posts/month",
      "3 subreddits",
      "5 image uploads",
      "Basic analytics",
      "Community support",
      "Reddit OAuth (secure)",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious creators & promoters",
    highlight: true,
    badge: "MOST POPULAR",
    features: [
      "100 scheduled posts/month",
      "20 subreddits",
      "100 image uploads",
      "Advanced analytics",
      "Priority email support",
      "Optimal timing engine",
      "Post performance tracking",
    ],
    cta: "Start Free Trial",
    ctaVariant: "primary" as const,
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "For agencies & power users",
    highlight: false,
    badge: "",
    features: [
      "Unlimited scheduled posts",
      "Unlimited subreddits",
      "Unlimited image uploads",
      "Advanced analytics + export",
      "Priority support",
      "Optimal timing engine",
      "Team collaboration",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
  },
];

export const FAQS = [
  {
    question: "Is it safe to connect my Reddit account?",
    answer:
      "Yes. PostPilot uses Reddit's official OAuth 2.0 authentication. We never store your password — only a secure access token that lets us post on your behalf. You can revoke access at any time from your Reddit account settings under 'Authorized Apps'.",
  },
  {
    question: "Can I schedule posts to multiple subreddits?",
    answer:
      "Yes. You can schedule posts to any subreddit you're a member of. Each post targets one subreddit, and you can queue as many posts as your plan allows — across as many different communities as you like.",
  },
  {
    question: "What types of posts can I schedule?",
    answer:
      "PostPilot supports all three Reddit post types: text posts, link posts, and image posts. When scheduling, just pick the type that fits your content and fill in the relevant fields.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "You can upload any image file that Reddit accepts — JPG and PNG are the most reliable formats. Images are stored securely in the cloud and linked to your post automatically when it publishes.",
  },
  {
    question: "Does it work for NSFW subreddits?",
    answer:
      "Yes. You can mark a post as NSFW when creating it and PostPilot will tag it correctly when submitting to Reddit. You still need to meet the subreddit's own account age and karma requirements to post there.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Starter plan is completely free — no credit card required. You get 10 scheduled posts per month to try out the full scheduling workflow. Upgrade to Pro or Business when you need more volume.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes. You can cancel at any time through your Stripe billing portal. Your plan stays active until the end of the current billing period and you won't be charged again after that.",
  },
];

export const TRUST_BADGES = [
  { text: "No credit card required" },
  { text: "500+ users worldwide" },
  { text: "Posts on time, every time" },
];
