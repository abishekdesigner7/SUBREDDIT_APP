"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiCheckCircle, FiLoader } from "react-icons/fi";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      router.push("/dashboard");
      return;
    }
    // Small delay so the page renders first, then pop the celebration
    const t = setTimeout(() => setShowCelebration(true), 400);
    return () => clearTimeout(t);
  }, [sessionId, router]);

  const handleDone = useCallback(() => setShowCelebration(false), []);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 24, padding: "48px 32px", textAlign: "center", maxWidth: 480, width: "100%",
        }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: "50%", background: "rgba(34,197,94,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px",
        }}>
          <FiCheckCircle size={40} color="#22c55e" />
        </div>

        <h1 style={{ fontFamily: "var(--font-space)", fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
          Payment Successful!
        </h1>

        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
          Your subscription is now active. You're all set to start scheduling posts.
        </p>

        <Link href="/dashboard" style={{
          display: "inline-flex", background: "#FF4500", color: "#fff", textDecoration: "none",
          fontWeight: 700, padding: "14px 28px", borderRadius: 12, transition: "background 0.2s"
        }}>
          Go to Dashboard
        </Link>
      </motion.div>

      <CelebrationOverlay show={showCelebration} variant="payment" onDone={handleDone} />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Suspense fallback={<div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}><FiLoader className="animate-spin" size={24} color="#FF4500" /></div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
