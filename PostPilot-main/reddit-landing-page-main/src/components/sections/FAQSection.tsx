"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { FAQS } from "@/lib/constants";

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" style={{
      padding: "100px 24px",
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} style={{ marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: "var(--orange)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>FAQ</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-space)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 14 }}>
            Got questions?
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Quick answers to what creators ask us most.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <motion.div key={faq.question} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: i * 0.04 }}>
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  background: open === i ? "var(--bg-card)" : "var(--bg-base)",
                  border: open === i ? "1px solid var(--orange)" : "1px solid var(--border)",
                  borderRadius: 14, overflow: "hidden",
                  transition: "background 0.2s, border-color 0.2s", cursor: "pointer",
                }}
                onMouseEnter={e => {
                  if (open !== i) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                }}
                onMouseLeave={e => {
                  if (open !== i) (e.currentTarget as HTMLElement).style.background = "var(--bg-base)";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
                  <span style={{
                    fontSize: "0.95rem", fontWeight: 600,
                    color: open === i ? "var(--text-primary)" : "var(--text-secondary)",
                    lineHeight: 1.4, textAlign: "left", fontFamily: "var(--font-space)",
                    transition: "color 0.2s",
                  }}>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: open === i ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginLeft: 16,
                      background: "var(--text-primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--orange)",
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    <FiChevronDown size={16} strokeWidth={4} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0, y: 8 }} animate={{ height: "auto", opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: 8 }} transition={{ duration: 0.28, ease: "easeOut" }} style={{ overflow: "hidden" }}>
                      <div style={{
                        padding: "18px 24px 22px",
                        fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.75,
                        borderTop: "1px solid var(--border)",
                      }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
