"use client";

import { motion } from "framer-motion";
import {
  FiCalendar,
  FiGrid,
  FiImage,
  FiBarChart2,
  FiClock,
  FiShield,
} from "react-icons/fi";

const icons: Record<string, React.ReactNode> = {
  calendar: <FiCalendar size={22} />,
  grid: <FiGrid size={22} />,
  image: <FiImage size={22} />,
  "bar-chart": <FiBarChart2 size={22} />,
  clock: <FiClock size={22} />,
  shield: <FiShield size={22} />,
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(255,69,0,0.4)" }}
      transition={{ duration: 0.2 }}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,69,0,0.15)",
        borderRadius: "16px",
        padding: "28px",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(255,69,0,0.1)",
          border: "1px solid rgba(255,69,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FF4500",
          marginBottom: 20,
        }}
      >
        {icons[icon]}
      </div>
      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: 10,
          fontFamily: "var(--font-space), sans-serif",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.92rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
        {description}
      </p>
    </motion.div>
  );
}
