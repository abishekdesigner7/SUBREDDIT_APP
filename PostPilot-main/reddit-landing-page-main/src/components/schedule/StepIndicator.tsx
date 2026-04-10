"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

const STEPS = ["Schedule", "Content", "Review"];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = currentStep > step;
        const active = currentStep === step;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <motion.div
                animate={{ scale: active ? 1.12 : 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: done ? "rgba(255,69,0,0.15)" : active ? "#FF4500" : "rgba(255,255,255,0.04)",
                  border: done ? "1.5px solid rgba(255,69,0,0.4)" : active ? "none" : "1.5px solid rgba(255,255,255,0.1)",
                  boxShadow: active ? "0 0 0 4px rgba(255,69,0,0.2)" : "none",
                  fontSize: "0.82rem", fontWeight: 800,
                  color: done ? "#FF4500" : active ? "#fff" : "rgba(255,255,255,0.3)",
                }}
              >
                {done ? <FiCheck size={15} /> : step}
              </motion.div>
              <span style={{
                fontSize: "0.68rem", fontWeight: 600,
                color: active ? "#fff" : done ? "rgba(255,69,0,0.8)" : "rgba(255,255,255,0.3)",
                whiteSpace: "nowrap",
              }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, margin: "0 10px", marginBottom: 22,
                background: done ? "rgba(255,69,0,0.4)" : "rgba(255,255,255,0.08)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
