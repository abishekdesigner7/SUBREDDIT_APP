"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showCelebration, setShowCelebration] = useState(false);

  const handleDone = useCallback(() => {
    setShowCelebration(false);
    router.push("/schedule");
  }, [router]);

  useEffect(() => {
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", userJson);
        setShowCelebration(true);
      } catch (err) {
        console.error("Failed to save auth data", err);
        router.push("/login");
      }
    } else {
      const error = searchParams.get("error");
      if (error) {
        router.push("/login");
      }
    }
  }, [searchParams, router]);

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 20, color: "#fff"
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <FiLoader size={48} color="#FF4500" />
      </motion.div>
      <h2 style={{ fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "1.2rem" }}>
        Finalizing authentication...
      </h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
        Please wait while we set up your session.
      </p>

      <CelebrationOverlay show={showCelebration} variant="reddit" onDone={handleDone} />
    </div>
  );
}
