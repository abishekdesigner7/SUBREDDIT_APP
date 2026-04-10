"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiPlus, FiCheckCircle, FiLoader } from "react-icons/fi";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ConnectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        setUser(userData);
      } catch (e) {}
    }
  }, [router]);

  async function handleConnect() {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      if (!userData.id) throw new Error("User ID not found");

      // Grab the OAuth URL from our backend
      const data = await apiFetch(`/auth/reddit?userId=${userData.id}`);
      
      if (data && data.url) {
        // Redirect the entire window to Reddit
        window.location.href = data.url;
      } else {
        throw new Error("Failed to get authorization URL");
      }
    } catch (err: any) {
      toast.error(err.message || "Connection failed");
      setLoading(false);
    }
  }

  if (!user) return null;

  const isConnected = !!user.reddit?.username;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: 100 }}>
        <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 24px" }}>
          {/* Back button */}
          <Link href="/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "rgba(255,255,255,0.4)", textDecoration: "none",
            fontSize: "0.85rem", fontWeight: 600, marginBottom: 24,
            transition: "color 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >
            <FiArrowLeft size={16} /> Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "40px 32px",
              textAlign: "center"
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "rgba(255,69,0,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
              color: "#FF4500",
              border: "1.5px solid rgba(255,69,0,0.2)"
            }}>
              <svg width="32" height="32" viewBox="0 0 20 20" fill="currentColor">
                <path d="M16.67 10c0-.92-.75-1.67-1.67-1.67-.46 0-.87.18-1.17.48A8.14 8.14 0 0 0 10 7.5c-.6 0-1.14.07-1.63.2l.9-2.83 2.5.53c.04.65.58 1.16 1.23 1.16.69 0 1.25-.56 1.25-1.25S13.69 4.06 13 4.06c-.5 0-.93.3-1.14.73l-2.8-.59a.31.31 0 0 0-.36.22L7.6 7.77c-.58.12-1.17.32-1.69.6a1.67 1.67 0 1 0-1.84 2.71c-.02.14-.03.28-.03.42 0 2.14 2.19 3.88 4.88 3.88s4.88-1.74 4.88-3.88c0-.14-.01-.27-.03-.4.57-.3.97-.9.97-1.58l.03-.52zm-10 1.04a.83.83 0 1 1 1.66 0 .83.83 0 0 1-1.66 0zm4.79 2.2c-.6.6-1.75.65-2.08.65-.34 0-1.49-.05-2.09-.64a.22.22 0 0 1 .32-.32c.38.38 1.2.51 1.77.51.58 0 1.4-.13 1.77-.51a.22.22 0 0 1 .31.31zm-.13-1.37a.83.83 0 1 1 0-1.66.83.83 0 0 1 0 1.66z" />
              </svg>
            </div>

            <h1 style={{
              fontFamily: "var(--font-space)", fontSize: "1.75rem",
              fontWeight: 800, color: "#fff", marginBottom: 12,
              letterSpacing: "-0.02em"
            }}>
              {isConnected ? "Reddit Connected" : "Connect Reddit"}
            </h1>
            
            <p style={{
              fontSize: "0.95rem", color: "rgba(255,255,255,0.45)",
              lineHeight: 1.6, marginBottom: 32
            }}>
              {isConnected 
                ? `You are connected as u/${user.reddit.username}. You can now start scheduling posts.`
                : "Authorize PostPilot to schedule and publish posts on your behalf to your favorite subreddits."}
            </p>

            {isConnected ? (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                background: "rgba(34,197,94,0.1)", color: "#22c55e",
                padding: "14px", borderRadius: 12, fontWeight: 700,
                border: "1px solid rgba(34,197,94,0.2)"
              }}>
                <FiCheckCircle size={20} />
                Connected correctly
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConnect}
                disabled={loading}
                style={{
                  width: "100%", padding: "16px",
                  background: "#FF4500", color: "#fff",
                  border: "none", borderRadius: 14,
                  fontSize: "1rem", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  boxShadow: "0 8px 30px rgba(255,69,0,0.35)",
                  transition: "background 0.2s"
                }}
              >
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <FiLoader size={20} />
                  </motion.div>
                ) : (
                  <>
                    <FiPlus size={20} /> Connect Account
                  </>
                )}
              </motion.button>
            )}

            {!isConnected && (
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)", marginTop: 24 }}>
                You'll be redirected to Reddit to authorize the application.
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
