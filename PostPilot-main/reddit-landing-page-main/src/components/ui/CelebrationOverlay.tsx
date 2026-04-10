"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Variant = "reddit" | "payment" | "scheduled";

interface Props {
  show: boolean;
  variant: Variant;
  onDone: () => void;
}

const CONFIG = {
  reddit: {
    emoji: "🎉",
    title: "Reddit Connected!",
    sub: "Your account is linked and ready to post.",
    accent: "#FF4500",
    glow: "rgba(255,69,0,0.15)",
    particles: ["🟠", "⚡", "🔥", "✨", "🟠", "⚡"],
  },
  payment: {
    emoji: "💳",
    title: "Payment Successful!",
    sub: "Your subscription is now active. Welcome to Pro.",
    accent: "#22c55e",
    glow: "rgba(34,197,94,0.15)",
    particles: ["💚", "✨", "⭐", "💚", "✨", "⭐"],
  },
  scheduled: {
    emoji: "🚀",
    title: "Post Scheduled!",
    sub: "Your post is queued and will go live on time.",
    accent: "#3b82f6",
    glow: "rgba(59,130,246,0.15)",
    particles: ["🔵", "✨", "⭐", "🔵", "✨", "⭐"],
  },
};

// Generate deterministic particle positions to avoid hydration mismatch
function getParticles(count: number) {
  const positions = [
    { x: -120, y: -80,  delay: 0    },
    { x:  120, y: -60,  delay: 0.05 },
    { x: -80,  y:  100, delay: 0.1  },
    { x:  100, y:  90,  delay: 0.08 },
    { x:  40,  y: -110, delay: 0.03 },
    { x: -50,  y:  60,  delay: 0.12 },
    { x:  150, y:  20,  delay: 0.06 },
    { x: -140, y:  30,  delay: 0.09 },
  ];
  return positions.slice(0, count);
}

export default function CelebrationOverlay({ show, variant, onDone }: Props) {
  const cfg = CONFIG[variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (show) {
      timerRef.current = setTimeout(onDone, 2800);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [show, onDone]);

  const particles = getParticles(8);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onDone}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
            cursor: "pointer",
          }}
        >
          {/* Card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 24 }}
            animate={{ scale: 1,   opacity: 1, y: 0  }}
            exit={{   scale: 0.85, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              background: "#141414",
              border: `1px solid ${cfg.accent}30`,
              borderRadius: 24,
              padding: "44px 48px 36px",
              textAlign: "center",
              maxWidth: 380,
              width: "90%",
              boxShadow: `0 0 60px ${cfg.glow}, 0 24px 64px rgba(0,0,0,0.5)`,
              overflow: "hidden",
            }}
          >
            {/* Glow blob behind */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 200, height: 200, borderRadius: "50%",
              background: cfg.glow,
              filter: "blur(40px)",
              pointerEvents: "none",
            }} />

            {/* Floating particles */}
            {particles.map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0, 1.2, 1, 0],
                }}
                transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  fontSize: "1.1rem", pointerEvents: "none",
                  display: "inline-block",
                }}
              >
                {cfg.particles[i % cfg.particles.length]}
              </motion.span>
            ))}

            {/* Emoji icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1,  rotate: 0   }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: `${cfg.accent}18`,
                border: `1.5px solid ${cfg.accent}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", margin: "0 auto 20px",
                position: "relative", zIndex: 1,
              }}
            >
              {cfg.emoji}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ delay: 0.18, duration: 0.4 }}
              style={{
                fontFamily: "var(--font-space)", fontSize: "1.4rem",
                fontWeight: 800, color: "#fff",
                letterSpacing: "-0.03em", marginBottom: 10,
                position: "relative", zIndex: 1,
              }}
            >
              {cfg.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1,  y: 0 }}
              transition={{ delay: 0.26, duration: 0.4 }}
              style={{
                fontSize: "0.88rem", color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6, marginBottom: 28,
                position: "relative", zIndex: 1,
              }}
            >
              {cfg.sub}
            </motion.p>

            {/* Progress bar auto-closing */}
            <motion.div
              style={{
                position: "absolute", bottom: 0, left: 0,
                height: 3, background: cfg.accent,
                borderRadius: "0 0 24px 24px",
              }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 2.8, ease: "linear" }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", position: "relative", zIndex: 1 }}
            >
              tap anywhere to dismiss
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
