"use client";

import { motion } from "framer-motion";
import { FiCheck, FiCalendar, FiFileText, FiEye } from "react-icons/fi";

const STEPS = [
  { label: "Schedule", icon: FiCalendar },
  { label: "Content",  icon: FiFileText },
  { label: "Review",   icon: FiEye },
];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* Step row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {STEPS.map(({ label, icon: Icon }, i) => {
          const step = i + 1;
          const done   = currentStep > step;
          const active = currentStep === step;

          return (
            <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              {/* Circle */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.div
                  animate={{ scale: active ? 1.08 : 1 }}
                  transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
                  style={{
                    width: 44, height: 44, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                    background: done
                      ? "linear-gradient(135deg, #FF4500 0%, #d93d00 100%)"
                      : active
                      ? "linear-gradient(135deg, #FF4500 0%, #ff6a35 100%)"
                      : "var(--bg-raised)",
                    border: done || active
                      ? "none"
                      : "1.5px solid var(--border)",
                    boxShadow: active
                      ? "0 0 0 6px rgba(255,69,0,0.15), 0 4px 20px rgba(255,69,0,0.4)"
                      : done
                      ? "0 4px 14px rgba(255,69,0,0.3)"
                      : "none",
                    color: done || active ? "#fff" : "var(--text-muted)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Pulse ring for active */}
                  {active && (
                    <motion.div
                      animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                      style={{
                        position: "absolute", inset: 0, borderRadius: "50%",
                        border: "2px solid rgba(255,69,0,0.5)",
                      }}
                    />
                  )}
                  {done ? <FiCheck size={18} strokeWidth={2.5} /> : <Icon size={17} />}
                </motion.div>

                {/* Label */}
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: active ? "var(--text-primary)" : done ? "#FF4500" : "var(--text-muted)",
                  transition: "color 0.3s",
                }}>{label}</span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 12px", marginBottom: 26,
                  borderRadius: 99,
                  background: "var(--border)",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(90deg, #FF4500, #ff6a35)",
                      borderRadius: 99,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
