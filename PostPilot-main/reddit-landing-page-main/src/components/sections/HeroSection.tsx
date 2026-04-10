"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiPlay, FiMaximize2 } from "react-icons/fi";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <section style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: "120px 48px 80px",
      overflow: "hidden",
      background: "var(--bg-base)",
    }}>
      {/* Subtle top orange glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 800, height: 280,
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,69,0,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Two-column layout */}
      <div style={{
        maxWidth: 1200, width: "100%", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 64, alignItems: "center", position: "relative", zIndex: 2,
      }} className="hero-grid">

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-space)",
              fontSize: "clamp(2.4rem, 4vw, 3.8rem)",
              fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.04em",
              color: "var(--text-primary)", marginBottom: 20, textAlign: "left",
            }}>
            Schedule Reddit posts.{" "}
            <span style={{
              color: "var(--orange)",
            }}>Grow on autopilot.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "1rem", color: "var(--text-secondary)",
              lineHeight: 1.75, marginBottom: 36, maxWidth: 420, textAlign: "left",
            }}>
            Built for creators, brands, and power users.
            Write your post, pick a time, and let PostPilot publish it automatically — no manual effort needed.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
            <Link href="/schedule" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "14px 28px", background: "var(--orange)",
              color: "#fff", fontWeight: 700, fontSize: "0.95rem",
              borderRadius: 12, textDecoration: "none",
              boxShadow: "0 6px 24px rgba(255,69,0,0.35)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(255,69,0,0.5)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(255,69,0,0.35)"; }}
            >Start scheduling <FiArrowRight size={15} /></Link>

            <Link href="#how-it-works" style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "14px 28px", background: "transparent",
              color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.95rem",
              borderRadius: 12, textDecoration: "none",
              border: "1px solid var(--border)", transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >See how it works</Link>
          </motion.div>

          {/* Checkmarks */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.45 }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {["No credit card required", "Posts while you sleep", "Cancel anytime"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <FiCheck size={13} color="var(--green)" />
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Video box */}
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          style={{ position: "relative" }}>
          <div style={{
            position: "absolute", inset: -24,
            background: "radial-gradient(ellipse, var(--orange-glow) 0%, transparent 70%)",
            filter: "blur(24px)", pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{
            position: "relative", zIndex: 1, borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
            aspectRatio: "16/9", minHeight: 340,
            background: "var(--bg-card)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 16,
            overflow: "hidden",
          }}>
            {/* Top bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px",
            }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>⚡ Get started in 2 mins</span>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: "var(--glass)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <FiMaximize2 size={13} color="var(--text-muted)" />
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "var(--orange)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 0 16px var(--orange-glow), 0 8px 32px rgba(255,69,0,0.4)",
              cursor: "pointer",
            }}>
              <FiPlay size={28} color="#fff" style={{ marginLeft: 4 }} />
            </motion.div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>Watch product demo</p>
            <div style={{
              position: "absolute", bottom: 16, right: 16,
              background: "var(--blur-bg)", backdropFilter: "blur(8px)",
              borderRadius: 8, padding: "5px 12px",
              fontSize: "0.72rem", fontWeight: 600, color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}>2:14</div>
          </div>
        </motion.div>
      </div>


      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
