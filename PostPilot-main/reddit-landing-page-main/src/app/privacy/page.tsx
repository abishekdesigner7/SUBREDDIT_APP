import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PostPilot",
  description:
    "Learn how PostPilot handles your data. We respect your privacy and comply with Reddit's Responsible Builder Policy.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Last updated: April 8, 2026
          </p>
        </div>

        {/* Introduction */}
        <div style={sectionStyle}>
          <p style={pStyle}>
            PostPilot (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            operates the PostPilot web application (the &quot;Service&quot;). This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our Service. We are committed to
            protecting your privacy and complying with Reddit&apos;s{" "}
            <a
              href="https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--orange)", textDecoration: "underline" }}
            >
              Responsible Builder Policy
            </a>
            , the{" "}
            <a
              href="https://www.redditinc.com/policies/developer-terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--orange)", textDecoration: "underline" }}
            >
              Reddit Developer Terms
            </a>
            , and the{" "}
            <a
              href="https://www.redditinc.com/policies/data-api-terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--orange)", textDecoration: "underline" }}
            >
              Reddit Data API Terms
            </a>
            .
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Information We Collect</h2>
          <p style={pStyle}>
            We collect only the minimum information required to provide the
            Service:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Reddit Account Data:
              </strong>{" "}
              When you connect your Reddit account via OAuth 2.0, we receive your
              Reddit username, an access token, and a refresh token. We{" "}
              <strong style={{ color: "var(--text-primary)" }}>never</strong>{" "}
              receive or store your Reddit password.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Account Credentials:
              </strong>{" "}
              If you create a PostPilot account with email and password, your
              password is securely hashed using bcrypt before storage. We never
              store plaintext passwords.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Scheduled Post Content:
              </strong>{" "}
              Post titles, target subreddits, scheduled times, and uploaded media
              (images) are stored to fulfill the scheduling service.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Subscription Data:
              </strong>{" "}
              Payment processing is handled entirely by{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Stripe
              </a>
              . We do not store credit card numbers or full billing details on
              our servers.
            </li>
          </ul>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>2. How We Use Your Information</h2>
          <p style={pStyle}>We use the collected information solely to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              Authenticate your identity and manage your session.
            </li>
            <li style={liStyle}>
              Submit scheduled posts to Reddit on your behalf at your chosen
              time.
            </li>
            <li style={liStyle}>
              Store and serve your uploaded media via AWS S3 for inclusion in
              Reddit posts.
            </li>
            <li style={liStyle}>
              Manage your subscription status and grant access to paid features.
            </li>
          </ul>
          <p style={pStyle}>
            We do <strong style={{ color: "var(--text-primary)" }}>not</strong>{" "}
            use your data for advertising, sell it to third parties, or share it
            with anyone outside of the services required to operate PostPilot
            (MongoDB Atlas for database, AWS S3 for media storage, and Stripe for
            payments).
          </p>
        </div>

        {/* Section 3: Reddit Data Compliance */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>3. Reddit Data Compliance</h2>
          <p style={pStyle}>
            In accordance with Reddit&apos;s Responsible Builder Policy and Data
            API Terms:
          </p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Data Deletion:
              </strong>{" "}
              If a user deletes their Reddit content, we will promptly remove any
              locally cached copies of that content from our systems.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Minimal Data Retention:
              </strong>{" "}
              We only retain Reddit tokens for as long as the user&apos;s account
              is active. When a user disconnects their Reddit account or deletes
              their PostPilot account, all associated Reddit tokens are
              permanently deleted.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                No Data Resale:
              </strong>{" "}
              We do not sell, license, or commercially redistribute any Reddit
              user data.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Rate Limiting:
              </strong>{" "}
              PostPilot enforces a minimum 10-minute gap between scheduled posts
              per user to comply with Reddit&apos;s API rate limits and prevent
              spam.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                OAuth Scope:
              </strong>{" "}
              We request only the minimum necessary OAuth scopes: <code style={{ background: "var(--bg-raised)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85rem" }}>identity</code>,{" "}
              <code style={{ background: "var(--bg-raised)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85rem" }}>submit</code>,{" "}
              <code style={{ background: "var(--bg-raised)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85rem" }}>mysubreddits</code>, and{" "}
              <code style={{ background: "var(--bg-raised)", padding: "2px 6px", borderRadius: 4, fontSize: "0.85rem" }}>read</code>.
            </li>
          </ul>
        </div>

        {/* Section 4: Data Storage & Security */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>4. Data Storage &amp; Security</h2>
          <ul style={ulStyle}>
            <li style={liStyle}>
              All data is stored on <strong style={{ color: "var(--text-primary)" }}>MongoDB Atlas</strong> with TLS
              encryption in transit and encryption at rest.
            </li>
            <li style={liStyle}>
              Uploaded media is stored on <strong style={{ color: "var(--text-primary)" }}>AWS S3</strong> with
              server-side encryption (SSE-S3).
            </li>
            <li style={liStyle}>
              Our backend API is hosted on <strong style={{ color: "var(--text-primary)" }}>AWS EC2</strong> and
              communicates exclusively over HTTPS.
            </li>
            <li style={liStyle}>
              Authentication tokens (JWT) are signed with a secret key and expire
              after 7 days.
            </li>
          </ul>
        </div>

        {/* Section 5: Third-Party Services */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Third-Party Services</h2>
          <p style={pStyle}>PostPilot integrates with the following services:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>Reddit API</strong> — for
              authentication and post submission.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>Stripe</strong> — for
              payment processing. See{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Stripe&apos;s Privacy Policy
              </a>
              .
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>AWS (S3, EC2)</strong>{" "}
              — for media hosting and application infrastructure.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>MongoDB Atlas</strong>{" "}
              — for database hosting.
            </li>
          </ul>
        </div>

        {/* Section 6: Your Rights */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Your Rights</h2>
          <p style={pStyle}>You have the right to:</p>
          <ul style={ulStyle}>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Access your data:
              </strong>{" "}
              View all stored data in your PostPilot dashboard.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Delete your account:
              </strong>{" "}
              Request complete deletion of all your data by contacting us.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Revoke Reddit access:
              </strong>{" "}
              Disconnect your Reddit account at any time via{" "}
              <a
                href="https://www.reddit.com/prefs/apps"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--orange)", textDecoration: "underline" }}
              >
                Reddit&apos;s app preferences
              </a>
              .
            </li>
            <li style={liStyle}>
              <strong style={{ color: "var(--text-primary)" }}>
                Export your data:
              </strong>{" "}
              Request a copy of all data we store about you.
            </li>
          </ul>
        </div>

        {/* Section 7: Contact */}
        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Contact Us</h2>
          <p style={pStyle}>
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
