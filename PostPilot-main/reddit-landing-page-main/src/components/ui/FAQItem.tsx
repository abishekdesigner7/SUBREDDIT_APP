"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        paddingBottom: open ? 0 : 0,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "22px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: 16,
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: open ? "#FF4500" : "var(--text-primary)",
            textAlign: "left",
            lineHeight: 1.4,
            transition: "color 0.2s",
            fontFamily: "var(--font-space), sans-serif",
          }}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            color: open ? "#FF4500" : "#555",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontSize: "0.92rem",
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                paddingBottom: 22,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
