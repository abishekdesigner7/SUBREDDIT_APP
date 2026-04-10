"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
import { SITE_NAME } from "@/lib/constants";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputBase: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
    padding: "12px 14px 12px 40px", color: "#fff",
    fontSize: "0.92rem", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
  };

  function focus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(255,69,0,0.5)";
  }
  function blur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  }

  async function handleRedditLogin() {
    setLoading(true);
    setError("");
    try {
      // Just fetch the OAuth URL directly for login
      const data = await apiFetch("/auth/reddit");
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to get authorization URL");
      }
    } catch (err: any) {
      setError(err.message || "Connection failed");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(255,69,0,0.08) 0%, transparent 60%)",
    }}>
      {/* Back to Home Link (Top Left) */}
      <div style={{ position: "absolute", top: 24, left: 32 }}>
        <Link href="/" style={{ 
          fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.4)", 
          textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)", transition: "all 0.2s"
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
        >
          <FiArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 40, textAlign: "center" }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, #FF4500 0%, #d93d00 100%)",
            borderRadius: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-space)", fontWeight: 900, color: "#fff", fontSize: "1.2rem",
            boxShadow: "0 4px 18px rgba(255,69,0,0.45)",
          }}>P</div>
          <span style={{
            fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "1.15rem",
            color: "#fff", letterSpacing: "-0.02em",
          }}>{SITE_NAME}</span>
        </Link>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "36px 32px",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-space)", fontSize: "1.7rem",
            fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 8,
          }}>Welcome back</h1>
          <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
            Sign in to your PostPilot account
          </p>
        </div>

        {/* Reddit Login button */}
        <button 
          onClick={handleRedditLogin}
          disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "#FF4500", border: "none", borderRadius: 12,
            padding: "16px 20px", cursor: loading ? "not-allowed" : "pointer", marginBottom: 24,
            color: "#fff", fontWeight: 700, fontSize: "1rem",
            boxShadow: "0 8px 24px rgba(255,69,0,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#d93d00"; }}
          onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#FF4500"; }}
        >
          {loading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <FiLoader size={20} />
            </motion.div>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="#fff">
                <circle cx="10" cy="10" r="10" fill="#FF4500" />
                <path d="M16.67 10c0-.92-.75-1.67-1.67-1.67-.46 0-.87.18-1.17.48A8.14 8.14 0 0 0 10 7.5c-.6 0-1.14.07-1.63.2l.9-2.83 2.5.53c.04.65.58 1.16 1.23 1.16.69 0 1.25-.56 1.25-1.25S13.69 4.06 13 4.06c-.5 0-.93.3-1.14.73l-2.8-.59a.31.31 0 0 0-.36.22L7.6 7.77c-.58.12-1.17.32-1.69.6a1.67 1.67 0 1 0-1.84 2.71c-.02.14-.03.28-.03.42 0 2.14 2.19 3.88 4.88 3.88s4.88-1.74 4.88-3.88c0-.14-.01-.27-.03-.4.57-.3.97-.9.97-1.58l.03-.52zm-10 1.04a.83.83 0 1 1 1.66 0 .83.83 0 0 1-1.66 0zm4.79 2.2c-.6.6-1.75.65-2.08.65-.34 0-1.49-.05-2.09-.64a.22.22 0 0 1 .32-.32c.38.38 1.2.51 1.77.51.58 0 1.4-.13 1.77-.51a.22.22 0 0 1 .31.31zm-.13-1.37a.83.83 0 1 1 0-1.66.83.83 0 0 1 0 1.66z" fill="#fff" />
              </svg>
              Continue with Reddit
            </>
          )}
        </button>

        {/* Disclaimer */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12, padding: "16px",
          border: "1px solid rgba(255,255,255,0.05)",
          marginBottom: 20
        }}>
          <p style={{ 
            fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", 
            lineHeight: 1.5, textAlign: "center", margin: 0 
          }}>
            🔒 <strong>Privacy First:</strong> We only use your account to publish posts you schedule. We will <strong>never</strong> post, vote, or comment without your explicit permission.
          </p>
        </div>

        {error && (
          <p style={{ fontSize: "0.85rem", color: "#FF4500", textAlign: "center", marginBottom: 16 }}>{error}</p>
        )}
      </motion.div>

      {/* Back to home */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginTop: 28 }}>
        <Link href="/" style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          ← Back to home
        </Link>
      </motion.div>
    </div>
  );
}
