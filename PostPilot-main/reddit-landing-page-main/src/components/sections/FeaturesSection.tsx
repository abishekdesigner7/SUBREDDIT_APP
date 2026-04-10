"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiImage, FiCheckCircle, FiClock, FiZap } from "react-icons/fi";

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 56 }}
        >
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: "#FF4500" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>Features</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-space)", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: 1.1, maxWidth: 520,
          }}>
            Everything you need to <span style={{ color: "var(--orange)" }}>own Reddit.</span>
          </h2>
        </motion.div>

        {/* Bento grid: 2-col top, 3-col bottom */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: 14 }}>

          {/* 1 — Smart Scheduling (wide, spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
            style={{ gridColumn: "span 2" }}
          >
            <BentoCard
              icon={FiCalendar}
              title="Smart Scheduling"
              desc="Queue posts days or weeks out. Set exact times to hit peak subreddit traffic — PostPilot handles the rest."
              preview={<SchedulingPreview />}
            />
          </motion.div>

          {/* 2 — Image Upload (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.07 }}
          >
            <BentoCard
              icon={FiImage}
              title="Image Upload"
              desc="Attach images to any post. Uploads go straight to secure cloud storage and are linked automatically."
              preview={<ImagePreview />}
            />
          </motion.div>

          {/* 3 — Auto-Publish (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.12 }}
          >
            <BentoCard
              icon={FiZap}
              title="Auto-Publish"
              desc="Set it and forget it. PostPilot checks every minute and publishes your posts right on time."
              preview={<AutoPublishPreview />}
            />
          </motion.div>

          {/* 4 — Reddit OAuth (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.17 }}
          >
            <BentoCard
              icon={FiCheckCircle}
              title="Reddit OAuth"
              desc="Connect your Reddit account securely. Posts go out from your real account — no shared credentials."
              preview={<OAuthPreview />}
            />
          </motion.div>

          {/* 5 — Multi Post Types (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: 0.22 }}
          >
            <BentoCard
              icon={FiClock}
              title="Text, Link & Image"
              desc="Schedule any Reddit post type — text posts, link posts, or image posts. Full control over every submission."
              preview={<PostTypesPreview />}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Bento card shell ──────────────────────────────────────── */
function BentoCard({
  icon: Icon, title, desc, preview,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  preview: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: 18, padding: "28px 28px 24px", height: "100%",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column",
        transition: "border-color 0.3s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,69,0,0.25)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
    >
      {/* Glow corner */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: 200, height: 200,
        background: "radial-gradient(circle at top left, rgba(255,69,0,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 11, background: "#FF4500",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", marginBottom: 16, flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <h3 style={{
        fontFamily: "var(--font-space)", fontSize: "1rem", fontWeight: 700,
        color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em",
      }}>{title}</h3>
      <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.68 }}>{desc}</p>
      {preview}
    </motion.div>
  );
}

/* ── Preview components ────────────────────────────────────── */

function SchedulingPreview() {
  const days = [
    { day: "MON", date: "24", active: false, hasDot: false },
    { day: "TUE", date: "25", active: false, hasDot: true },
    { day: "WED", date: "26", active: true,  hasDot: false },
    { day: "THU", date: "27", active: false, hasDot: false },
    { day: "FRI", date: "28", active: false, hasDot: true },
    { day: "SAT", date: "29", active: false, hasDot: false },
    { day: "SUN", date: "30", active: false, hasDot: false },
  ];
  const posts = [
    { time: "9:00 AM",  sub: "r/entrepreneur",  title: "New product launch 🚀",    status: "Posted",    statusColor: "#22c55e", highlight: false },
    { time: "2:00 PM",  sub: "r/photography",   title: "Behind the scenes thread", status: "Posting…",  statusColor: "#FF4500", highlight: true  },
    { time: "6:30 PM",  sub: "r/smallbusiness", title: "Weekly community update",  status: "Scheduled", statusColor: "#3b82f6", highlight: false },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {/* Day strip */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {days.map(c => (
          <div key={c.day} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            padding: "8px 4px", borderRadius: 10,
            background: c.active ? "var(--orange)" : "var(--glass)",
            border: c.active ? "none" : "1px solid var(--border)", gap: 4,
          }}>
            <span style={{ fontSize: "0.55rem", fontWeight: 700, color: c.active ? "rgba(255,255,255,0.9)" : "var(--text-muted)", letterSpacing: "0.06em" }}>{c.day}</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, color: c.active ? "#fff" : "var(--text-primary)", fontFamily: "var(--font-space)" }}>{c.date}</span>
            {c.hasDot && !c.active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--orange)" }} />}
            {!c.hasDot && !c.active && <div style={{ width: 4, height: 4 }} />}
          </div>
        ))}
      </div>
      {/* Post rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {posts.map((post, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: post.highlight ? "var(--orange-glow)" : "var(--glass)",
            border: `1px solid ${post.highlight ? "rgba(255,69,0,0.2)" : "var(--border)"}`,
            borderRadius: 12, padding: "10px 14px",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 8, flexShrink: 0,
              background: post.highlight ? "rgba(255,120,0,0.2)" : "rgba(255,69,0,0.1)",
              border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FiImage size={14} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: 500 }}>{post.sub}</span>
                <span style={{ width: 2, height: 2, borderRadius: "50%", background: "var(--border)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{post.time}</span>
              </div>
            </div>
            <div style={{
              fontSize: "0.6rem", fontWeight: 700,
              color: i === 2 ? "rgba(255,255,255,0.4)" : post.statusColor,
              background: i === 2 ? "rgba(255,255,255,0.05)" : `${post.statusColor}18`,
              border: `1px solid ${i === 2 ? "rgba(255,255,255,0.08)" : post.statusColor + "35"}`,
              padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap", flexShrink: 0,
            }}>{post.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImagePreview() {
  const cells = [
    { selected: false, accent: true  },
    { selected: false, accent: false },
    { selected: true,  accent: false },
    { selected: false, accent: false },
    { selected: false, accent: true  },
    { selected: false, accent: false },
  ];
  return (
    <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          aspectRatio: "1", borderRadius: 10,
          background: c.selected ? "rgba(34,197,94,0.1)" : c.accent ? "var(--orange-glow)" : "var(--glass)",
          border: c.selected ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 4,
          position: "relative",
        }}>
          {c.selected ? (
            <>
              <FiImage size={16} color="rgba(34,197,94,0.5)" />
              <div style={{
                position: "absolute", top: 6, right: 6,
                width: 16, height: 16, borderRadius: "50%",
                background: "#22c55e",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 900, lineHeight: 1 }}>✓</span>
              </div>
            </>
          ) : (
            <FiImage size={16} color="rgba(255,255,255,0.3)" />
          )}
        </div>
      ))}
    </div>
  );
}

function AutoPublishPreview() {
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Pulse indicator */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: 12, padding: "12px 14px",
      }}>
        <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
          <div style={{
            position: "absolute", inset: -3, borderRadius: "50%",
            border: "2px solid rgba(34,197,94,0.4)",
            animation: "none",
          }} />
        </div>
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#22c55e" }}>Scheduler running</span>
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "rgba(255,255,255,0.35)" }}>every 60s</span>
      </div>

      {/* Recent publishes */}
      {[
        { title: "r/startups post", time: "2 min ago", ok: true },
        { title: "r/webdev thread", time: "1h ago",    ok: true },
        { title: "r/design post",   time: "3h ago",    ok: true },
      ].map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--glass)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "9px 12px",
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FiCheckCircle size={11} color="#22c55e" />
          </div>
          <span style={{ flex: 1, fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
          <span style={{ fontSize: "0.63rem", color: "var(--text-muted)", flexShrink: 0 }}>{item.time}</span>
        </div>
      ))}
    </div>
  );
}

function OAuthPreview() {
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Reddit connect button mock */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.25)",
        borderRadius: 12, padding: "13px 16px",
      }}>
        {/* Reddit alien icon simple */}
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: "#FF4500",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 900, color: "#fff" }}>R</span>
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FF4500" }}>Continue with Reddit</span>
      </div>

      {/* Scopes granted */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          "Identity verified",
          "Submit posts",
          "Read subreddits",
        ].map((scope, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--glass)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "7px 11px",
          }}>
            <FiCheckCircle size={12} color="#22c55e" />
            <span style={{ fontSize: "0.72rem", color: "var(--text-secondary)", fontWeight: 500 }}>{scope}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostTypesPreview() {
  const types = [
    { label: "Text Post",  tag: "self",  active: true  },
    { label: "Link Post",  tag: "link",  active: false },
    { label: "Image Post", tag: "image", active: false },
  ];
  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
      {types.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: t.active ? "var(--orange-glow)" : "var(--glass)",
          border: `1px solid ${t.active ? "rgba(255,69,0,0.25)" : "var(--border)"}`,
          borderRadius: 10, padding: "10px 14px",
        }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: t.active ? "var(--text-primary)" : "var(--text-secondary)" }}>{t.label}</span>
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em",
            color: t.active ? "#FF4500" : "rgba(255,255,255,0.3)",
            background: t.active ? "rgba(255,69,0,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${t.active ? "rgba(255,69,0,0.3)" : "rgba(255,255,255,0.08)"}`,
            padding: "3px 9px", borderRadius: 999, textTransform: "uppercase",
          }}>{t.tag}</span>
        </div>
      ))}
    </div>
  );
}
