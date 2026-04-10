"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Button from "./Button";

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  highlight: boolean;
  badge: string;
  features: string[];
  cta: string;
  ctaVariant: "primary" | "outline";
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  highlight,
  badge,
  features,
  cta,
  ctaVariant,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "relative",
        background: highlight ? "var(--bg-raised)" : "var(--bg-card)",
        border: highlight ? "2px solid #FF4500" : "1px solid var(--border)",
        borderRadius: 20,
        padding: "36px 28px",
        boxShadow: highlight ? "0 0 40px rgba(255,69,0,0.15)" : "none",
        transform: highlight ? "scale(1.03)" : "scale(1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FF4500",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.1em",
            padding: "4px 14px",
            borderRadius: 999,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#FF4500",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 8,
          }}
        >
          {name}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
          <span
            style={{
              fontSize: price === "Free" ? "2.5rem" : "3rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1,
              fontFamily: "var(--font-space), sans-serif",
            }}
          >
            {price}
          </span>
          {period && (
            <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{period}</span>
          )}
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{description}</p>
      </div>

      <ul style={{ listStyle: "none", marginBottom: 32, flex: 1 }}>
        {features.map((feature) => (
          <li
            key={feature}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              marginBottom: 12,
              fontSize: "0.88rem",
              color: "var(--text-secondary)",
            }}
          >
            <FiCheck
              size={16}
              style={{ color: "#FF4500", flexShrink: 0, marginTop: 2 }}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Button variant={ctaVariant} fullWidth href="#" size="md">
        {cta}
      </Button>
    </motion.div>
  );
}
