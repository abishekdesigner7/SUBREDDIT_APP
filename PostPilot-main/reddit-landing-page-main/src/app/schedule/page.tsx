"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import StepIndicator from "@/components/schedule/StepIndicator";
import ScheduleForm from "@/components/schedule/ScheduleForm";

function ScheduleContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit") ?? undefined;
  const [step, setStep] = useState(1);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: 88 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 36 }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 3, height: 16, borderRadius: 99, background: "#FF4500" }} />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {editId ? "Edit Post" : "New Post"}
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-space)", fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 8,
            }}>
              {editId ? "Edit your " : "Schedule a "}
              <span style={{ color: "#FF4500" }}>Reddit post.</span>
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Fill in the details below — your post will go live automatically at the scheduled time.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <StepIndicator currentStep={step} />
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: 20, padding: "32px 32px 28px",
              boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
            }}>
              <ScheduleForm editId={editId} step={step} onStepChange={setStep} />
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div style={{ background: "var(--bg-base)", minHeight: "100vh" }} />}>
      <ScheduleContent />
    </Suspense>
  );
}
