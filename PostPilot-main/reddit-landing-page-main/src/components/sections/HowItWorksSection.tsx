"use client";

import { motion } from "framer-motion";
import { FiLink, FiEdit3, FiSend, FiShield } from "react-icons/fi";

const steps = [
  { icon: FiLink, number: "01", title: "Connect Your Reddit Account", desc: "Link your Reddit profile securely via OAuth in under 30 seconds. No passwords stored — ever.", detail: "Works with any Reddit account", cta: "Connect", ctaHref: "/schedule" },
  { icon: FiEdit3, number: "02", title: "Create & Queue Your Posts", desc: "Write your post, upload images, pick a subreddit, and set a publish time. Done in under a minute.", detail: "Supports images, text & links", cta: "Schedule", ctaHref: "/schedule" },
  { icon: FiSend, number: "03", title: "Auto-Publish on Schedule", desc: "PostPilot checks every 60 seconds and publishes your post at exactly the time you set.", detail: "Runs automatically in the background", cta: "Publish", ctaHref: "/dashboard" },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{
      padding: "100px 24px",
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} style={{ marginBottom: 72 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: "var(--orange)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>How it works</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-space)", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 14,
          }}>
            Up and running in <span style={{ color: "var(--orange)" }}>3 simple steps.</span>
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 440, lineHeight: 1.7 }}>
            No technical setup. Get your first post scheduled in under 5 minutes.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, position: "relative" }}>
          {steps.map((step, i) => (
            <motion.div key={step.number}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: i * 0.12 }}
              style={{ position: "relative", padding: "0 16px 0 0", display: "flex", flexDirection: "column", alignItems: "flex-start" }}
            >
              {/* Step label */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                <span style={{
                  fontFamily: "var(--font-space)", fontSize: "3rem", fontWeight: 900,
                  color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.04em",
                }}>
                  Step
                </span>
                <span style={{
                  fontFamily: "var(--font-space)", fontSize: "3rem", fontWeight: 900,
                  color: "var(--orange)", lineHeight: 1, letterSpacing: "-0.04em",
                }}>
                  {i + 1}
                </span>
              </div>

              {/* Icon + connector row */}
              <div style={{ display: "flex", alignItems: "center", width: "100%", marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                  background: "var(--orange-glow)", border: "1.5px solid var(--orange)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <step.icon size={22} color="var(--orange)" />
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, marginLeft: 14,
                    background: "linear-gradient(90deg, var(--orange-glow) 0%, transparent 100%)",
                  }} />
                )}
              </div>

              <h3 style={{ fontFamily: "var(--font-space)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.3, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.72, marginBottom: 20, flex: 1 }}>{step.desc}</p>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--green-glow)", border: "1px solid var(--green)", borderRadius: 999, padding: "4px 10px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.7rem", color: "var(--green)", fontWeight: 600 }}>{step.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginTop: 80, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}
        >
          <FiShield size={18} color="var(--green)" />
          <span style={{ fontFamily: "var(--font-space)", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Secure OAuth</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Reddit OAuth only. No passwords ever stored. Fully compliant with Reddit's API terms.</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}
        >
          {[
            { label: "OAuth 2.0 Authentication", sub: "We use Reddit's official OAuth 2.0 flow — your credentials never touch our servers.", icon: "🔐" },
            { label: "Zero Password Storage", sub: "No passwords are ever saved. Tokens are encrypted and scoped to read/write only.", icon: "🛡️" },
            { label: "Reddit API Compliant", sub: "Built fully within Reddit's API terms of service. No scraping, no grey areas.", icon: "✅" },
          ].map((t, i) => (
            <motion.div key={t.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "20px 22px",
                background: "var(--green-glow)", border: "1px solid var(--green)",
                borderRadius: 16,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                background: "var(--green-glow)", border: "1.5px solid var(--green)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
              }}>
                {t.icon}
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 5 }}>{t.label}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{t.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
