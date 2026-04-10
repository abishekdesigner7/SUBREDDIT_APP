"use client";

import { motion } from "framer-motion";

type Tab = "upcoming" | "published";

interface Props {
  activeTab: Tab;
  onChange: (t: Tab) => void;
  upcomingCount: number;
  publishedCount: number;
}

export default function TabBar({ activeTab, onChange, upcomingCount, publishedCount }: Props) {
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: upcomingCount },
    { id: "published", label: "Published", count: publishedCount },
  ];

  return (
    <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", gap: 4 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "13px 20px", position: "relative",
          display: "flex", alignItems: "center", gap: 8,
          fontSize: "0.88rem", fontWeight: 600,
          color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.35)",
          transition: "color 0.2s",
        }}>
          {tab.label}
          <span style={{
            background: activeTab === tab.id && tab.id === "upcoming" && tab.count > 0
              ? "rgba(255,69,0,0.15)" : "rgba(255,255,255,0.07)",
            color: activeTab === tab.id && tab.id === "upcoming" && tab.count > 0
              ? "#FF4500" : "rgba(255,255,255,0.4)",
            borderRadius: 999, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700,
          }}>{tab.count}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="tab-underline" style={{
              position: "absolute", bottom: -1, left: 0, right: 0,
              height: 2, background: "#FF4500", borderRadius: 99,
            }} />
          )}
        </button>
      ))}
    </div>
  );
}
