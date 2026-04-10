"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr",
          gap: 48,
          padding: "60px 32px 48px",
        }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 34, height: 34, background: "linear-gradient(135deg,var(--orange),var(--orange-dim))",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-space)", fontWeight: 900, color: "#fff", fontSize: "1rem",
              }}>P</div>
              <span style={{ fontFamily: "var(--font-space)", fontWeight: 700, color: "var(--text-primary)" }}>{SITE_NAME}</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 240, marginBottom: 24 }}>
              The Reddit scheduler built for creators who post at scale.
            </p>
          </div>

          {/* Product */ }
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Product</p>
            {["Features", "How It Works", "Pricing", "FAQ"].map(item => (
              <Link key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} style={{
                display: "block", fontSize: "0.85rem", color: "var(--text-secondary)",
                textDecoration: "none", marginBottom: 10, transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--orange)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
              >{item}</Link>
            ))}
          </div>

          {/* Company */ }
          <div>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Company</p>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{
                display: "block", fontSize: "0.85rem", color: "var(--text-secondary)",
                textDecoration: "none", marginBottom: 10, transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--orange)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
              >{item.label}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 32px 28px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            © 2026 {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
