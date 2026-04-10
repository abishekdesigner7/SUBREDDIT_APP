"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiCheck, FiZap, FiLoader } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { toast } from "react-hot-toast";

const plans = [
  {
    name: "Starter", price: "Free", period: "", tagline: "Try it out, no risk.",
    highlight: false,
    features: ["10 scheduled posts/month", "3 subreddits", "5 image uploads", "Basic analytics", "Community support"],
    cta: "Get started free", ctaPrimary: false,
  },
  {
    name: "Pro", price: "$19", period: "/mo", tagline: "For serious creators.",
    highlight: true,
    features: ["100 scheduled posts/month", "20 subreddits", "100 image uploads", "Text, image & link posts", "Priority email support", "7-day free trial"],
    cta: "Purchase", ctaPrimary: true,
  },
  {
    name: "Business", price: "$49", period: "/mo", tagline: "For agencies & teams.",
    highlight: false,
    features: ["Unlimited posts", "Unlimited subreddits", "Unlimited images", "Analytics + CSV export", "Team collaboration", "Priority support"],
    cta: "Purchase", ctaPrimary: false,
  },
];

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setIsLoggedIn(true);
      try {
        const parsed = JSON.parse(stored);
        setUserPlan(parsed.plan || "starter");
      } catch {}
    }
  }, []);

  const handleCheckout = async (planName: string) => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    if (planName === "Starter") {
      window.location.href = "/schedule";
      return;
    }
    
    try {
      setLoadingPlan(planName.toLowerCase());
      const res = await apiFetch("/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ plan: planName.toLowerCase() }),
      });
      
      if (res && res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Failed to initialize checkout.");
        setLoadingPlan(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to Stripe.");
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" style={{ padding: "100px 24px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }} style={{ marginBottom: 64 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: "var(--orange)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Pricing</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-space)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.035em", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 12 }}>
            Simple, transparent pricing.
          </h2>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>Start free. Upgrade when you grow.</p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "stretch" }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={!plan.highlight ? "pricing-card-border" : ""}
              style={{
                position: "relative", display: "flex", flexDirection: "column",
                background: plan.highlight ? "var(--orange-glow)" : "var(--bg-card)",
                border: plan.highlight ? "2px solid var(--orange)" : "1px solid var(--border)",
                borderRadius: 20, padding: "36px 28px",
                boxShadow: plan.highlight ? "0 0 80px var(--orange-glow), inset 0 0 40px var(--orange-glow)" : "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                if (!plan.highlight) {
                  el.style.border = "1px solid var(--orange)";
                  el.style.boxShadow = "0 16px 48px var(--orange-glow)";
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                if (!plan.highlight) {
                  el.style.border = "1px solid var(--border)";
                  el.style.boxShadow = "none";
                }
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                  background: "var(--orange)", color: "#fff",
                  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em",
                  textTransform: "uppercase", padding: "5px 16px", borderRadius: 999,
                  display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                }}>
                  <FiZap size={10} /> Most popular
                </div>
              )}

              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 800, color: plan.highlight ? "var(--orange)" : "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-space)", fontWeight: 800, fontSize: plan.price === "Free" ? "2.4rem" : "2.8rem", color: "var(--text-primary)", lineHeight: 1, letterSpacing: "-0.04em" }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{plan.tagline}</p>
              </div>

              <ul style={{ listStyle: "none", marginBottom: 28, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 11 }}>
                    <FiCheck size={14} color="var(--green)" style={{ flexShrink: 0, marginTop: 2 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {(() => {
                const isCurrentPlan = isLoggedIn && userPlan === plan.name.toLowerCase();
                return (
                  <button
                    onClick={() => !isCurrentPlan && handleCheckout(plan.name)}
                    disabled={loadingPlan === plan.name.toLowerCase() || isCurrentPlan}
                    className={!isCurrentPlan && !plan.ctaPrimary ? "pricing-cta-outline" : ""}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", padding: "12px 20px", borderRadius: 12,
                      cursor: isCurrentPlan ? "default" : loadingPlan ? "not-allowed" : "pointer",
                      border: isCurrentPlan ? "none" : plan.ctaPrimary ? "none" : undefined,
                      fontWeight: 700, fontSize: "0.88rem", transition: "all 0.2s",
                      background: isCurrentPlan ? "#22c55e" : plan.ctaPrimary ? "var(--orange)" : undefined,
                      color: isCurrentPlan ? "#fff" : plan.ctaPrimary ? "#fff" : undefined,
                      boxShadow: isCurrentPlan ? "0 4px 16px rgba(34,197,94,0.3)" : plan.ctaPrimary ? "0 4px 20px var(--orange-glow)" : "none",
                    }}
                    onMouseEnter={e => {
                      if (loadingPlan || isCurrentPlan) return;
                      const el = e.currentTarget as HTMLElement;
                      if (plan.ctaPrimary) { el.style.background = "var(--orange-dim)"; el.style.boxShadow = "0 6px 28px var(--orange-glow)"; }
                    }}
                    onMouseLeave={e => {
                      if (loadingPlan || isCurrentPlan) return;
                      const el = e.currentTarget as HTMLElement;
                      if (plan.ctaPrimary) { el.style.background = "var(--orange)"; el.style.boxShadow = "0 4px 20px var(--orange-glow)"; }
                    }}
                  >
                    {isCurrentPlan ? "Current Plan" : loadingPlan === plan.name.toLowerCase() ? <FiLoader className="animate-spin" /> : (plan.name === "Starter" && isLoggedIn ? "Go to scheduler" : plan.cta)}
                  </button>
                );
              })()}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
