import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — PostPilot",
  description:
    "Read PostPilot's Terms of Service. Use of our platform is subject to compliance with Reddit's API policies and community guidelines.",
};

export default function TermsOfServicePage() {
  const sectionStyle: React.CSSProperties = {
    marginBottom: 48,
  };
  const h2Style: React.CSSProperties = {
    fontFamily: "var(--font-space), sans-serif",
    fontSize: "1.35rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid var(--border)",
  };
  const pStyle: React.CSSProperties = {
    fontSize: "0.92rem",
    color: "var(--text-secondary)",
    lineHeight: 1.85,
    marginBottom: 14,
  };
  const ulStyle: React.CSSProperties = {
    paddingLeft: 24,
    marginBottom: 14,
  };
  const liStyle: React.CSSProperties = {
    fontSize: "0.92rem",
    color: "var(--text-secondary)",
    lineHeight: 1.85,
    marginBottom: 6,
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          maxWidth: 780,
          margin: "0 auto",
          padding: "120px 32px 80px",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "var(--orange)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 12,
            }}
          >
            Legal
          </p>
          <h1
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Terms of Service
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Last updated: April 8, 2026
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Acceptance of Terms</h2>
          <p style={pStyle}>
            By accessing or using PostPilot (&quot;the Service&quot;), you agree
            to be bound by these Terms of Service (&quot;Terms&quot;). If you do
            not agree to these Terms, you may not use the Service.
          </p>
        </div>

        {/* Section 2: Description of Service */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Description of Service</h2>
          <p style={pStyle}>
            PostPilot is a productivity tool that allows users to schedule Reddit
            posts in advance. The Service connects to Reddit via the official
            Reddit OAuth 2.0 API and submits posts on behalf of users at their
            specified times. PostPilot is designed to help content creators manage
            their Reddit presence efficiently while maintaining compliance with
            Reddit&apos;s platform rules.
          </p>
        </div>

        {/* Section 3: User Accounts */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>3. User Accounts</h2>
          <p style={pStyle}>
            To use the Service, you must create an account and connect your
            Reddit account via OAuth. You are responsible for:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              Maintaining the confidentiality of your account credentials.
            </li>
            <li style={liStyle}>
              All activity that occurs under your account.
            </li>
            <li style={liStyle}>
              Ensuring your use of PostPilot complies with Reddit&apos;s{" "}
              <a
                href="https://www.redditinc.com/policies/content-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Content Policy
              </a>{" "}
              and all applicable subreddit rules.
            </li>
          </ul>
        </div>

        {/* Section 4: Acceptable Use */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Acceptable Use Policy</h2>
          <p style={pStyle}>
            You agree <strong style={{ color: "var(--text-primary)" }}>not</strong>{" "}
            to use PostPilot for:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>Spam:</strong>{" "}
              Mass-posting identical or near-identical content across subreddits.
              PostPilot enforces a minimum 10-minute gap between posts to protect
              your account and prevent spam.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Harassment or Abuse:
              </strong>{" "}
              Posting content that harasses, bullies, or threatens other users.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Vote Manipulation:
              </strong>{" "}
              Using the Service in any way that artificially inflates or deflates
              votes.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Evading Bans:
              </strong>{" "}
              Using PostPilot to post in subreddits from which you have been
              banned.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Illegal Content:
              </strong>{" "}
              Posting content that violates any applicable laws or regulations.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Automated Engagement:
              </strong>{" "}
              Using the Service for automated commenting, voting, or any
              interaction beyond post submission.
            </li>
          </ul>
          <p style={pStyle}>
            Violation of this policy will result in immediate account termination
            without refund.
          </p>
        </div>

        {/* Section 5: Reddit API Compliance */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Reddit API Compliance</h2>
          <p style={pStyle}>PostPilot operates in strict compliance with:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <a
                href="https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Reddit Responsible Builder Policy
              </a>
            </li>
            <li style={liStyle}>
              <a
                href="https://www.redditinc.com/policies/developer-terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Reddit Developer Terms
              </a>
            </li>
            <li style={liStyle}>
              <a
                href="https://www.redditinc.com/policies/data-api-terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Reddit Data API Terms
              </a>
            </li>
          </ul>
          <p style={pStyle}>
            Users are also responsible for ensuring their own compliance with
            Reddit&apos;s rules. PostPilot is a tool — the content you schedule
            and the subreddits you target are your responsibility.
          </p>
        </div>

        {/* Section 6: Spam Protection */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Built-In Spam Protection</h2>
          <p style={pStyle}>
            To protect users and maintain platform integrity, PostPilot includes
            the following safeguards:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                10-Minute Post Gap:
              </strong>{" "}
              A mandatory minimum gap of 10 minutes between consecutive posts to
              prevent spam flagging by Reddit.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Per-User Rate Limits:
              </strong>{" "}
              Each subscription tier has defined limits on posts per month.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Authenticated Access Only:
              </strong>{" "}
              All requests to Reddit are made using the user&apos;s own OAuth
              token, never from a shared account.
            </li>
          </ul>
        </div>

        {/* Section 7: Payment & Subscriptions */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Payment &amp; Subscriptions</h2>
          <p style={pStyle}>
            PostPilot offers paid subscription plans processed through Stripe. By
            subscribing:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              You authorize recurring billing at the rate displayed at checkout.
            </li>
            <li style={liStyle}>
              You may cancel at any time. Your plan remains active until the end
              of the current billing period.
            </li>
            <li style={liStyle}>
              Refunds are available within 7 days of the initial purchase if no
              posts have been published using the Service.
            </li>
          </ul>
        </div>

        {/* Section 8: Intellectual Property */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Intellectual Property</h2>
          <p style={pStyle}>
            You retain full ownership of all content you create and schedule
            through PostPilot. We do not claim any rights to content posted to
            Reddit via our Service. PostPilot&apos;s brand, code, and design are
            the property of their respective owners.
          </p>
        </div>

        {/* Section 9: Disclaimers */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Disclaimers &amp; Limitations</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>
              PostPilot is provided &quot;as is&quot; without warranty of any
              kind.
            </li>
            <li style={liStyle}>
              We are not responsible for Reddit banning or restricting your
              account due to your content or posting patterns.
            </li>
            <li style={liStyle}>
              We do not guarantee post delivery if Reddit&apos;s API
              experiences downtime or changes.
            </li>
            <li style={liStyle}>
              Our total liability to you shall not exceed the amount you paid for
              the Service in the 30 days preceding the claim.
            </li>
          </ul>
        </div>

        {/* Section 10: Account Termination */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>10. Termination</h2>
          <p style={pStyle}>
            We may suspend or terminate your account at any time if you violate
            these Terms, Reddit&apos;s policies, or if we are required to do so
            by law. Upon termination, all your data (including scheduled posts,
            Reddit tokens, and uploaded media) will be permanently deleted within
            30 days.
          </p>
        </div>

        {/* Section 11: Changes */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>11. Changes to These Terms</h2>
          <p style={pStyle}>
            We may update these Terms at any time. Continued use of the Service
            after changes constitutes acceptance of the updated Terms. Material
            changes will be communicated via the Service or to your email address
            on file.
          </p>
        </div>

        {/* Section 12: Contact */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>12. Contact Us</h2>
          <p style={pStyle}>
            For any questions regarding these Terms, please contact us at{" "}
            <a
              href="mailto:support@postpilot.app"
              style={{ color: "var(--orange)", textDecoration: "underline" }}
            >
              support@postpilot.app
            </a>{" "}
            or open an issue on our{" "}
            <a
              href="https://github.com/hellokarmio"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--orange)", textDecoration: "underline" }}
            >
              GitHub
            </a>
            .
          </p>
        </div>

        {/* Back link */}
        <div
          style={{
            paddingTop: 32,
            borderTop: "1px solid var(--border)",
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: "0.88rem",
              color: "var(--orange)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
