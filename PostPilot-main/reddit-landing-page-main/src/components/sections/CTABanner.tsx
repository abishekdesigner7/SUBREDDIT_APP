"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";


export default function CTABanner() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <section style={{
      padding: "80px 24px", position: "relative", overflow: "hidden", zIndex: 1,
      borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}
        style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <h2 style={{
          fontFamily: "var(--font-space)", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
          fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)",
          lineHeight: 1.2, marginBottom: 14,
        }}>
          Ready to schedule your first post?{" "}
          <span style={{ color: "var(--orange)" }}>Get started free.</span>
        </h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: 40, lineHeight: 1.6 }}>
          No credit card required. Connect your Reddit account and schedule your first post in under 2 minutes.
        </p>

        <Link href={isLoggedIn ? "/schedule" : "/login"} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 32px", background: "var(--orange)", color: "#fff",
          fontWeight: 700, fontSize: "0.95rem", borderRadius: 14,
          textDecoration: "none", boxShadow: "0 8px 28px var(--orange-glow)",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px var(--orange-glow)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px var(--orange-glow)"; }}
        >
          {isLoggedIn ? "Schedule a post" : "Get started free"} <FiArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
