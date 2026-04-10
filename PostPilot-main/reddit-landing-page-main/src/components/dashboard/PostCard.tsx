"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiClock, FiFileText, FiImage, FiLink2, FiEdit2, FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { Post } from "@/lib/posts";

interface Props {
  post: Post;
  onEdit?: () => void;
  onDelete?: () => void;
}

const typeIcon = { text: FiFileText, image: FiImage, link: FiLink2 };

function formatDate(d: string) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return new Date(+y, +m - 1, +day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PostCard({ post, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const TypeIcon = typeIcon[post.postType] ?? FiFileText;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
          <span style={{
            background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.22)",
            borderRadius: 999, padding: "3px 10px", fontSize: "0.75rem", fontWeight: 700, color: "#FF4500",
            whiteSpace: "nowrap",
          }}>{post.subreddit}</span>
          {post.flair && (
            <span style={{
              background: "rgba(255,196,0,0.07)", border: "1px solid rgba(255,196,0,0.18)",
              borderRadius: 999, padding: "3px 8px", fontSize: "0.68rem", fontWeight: 600, color: "#ffc400",
              whiteSpace: "nowrap",
            }}>{post.flair}</span>
          )}
        </div>
        <span style={{
          fontSize: "0.65rem", fontWeight: 700, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0,
          background: post.status === "published" ? "rgba(34,197,94,0.1)" :
                      post.status === "failed" ? "rgba(239,68,68,0.1)" :
                      post.status === "processing" ? "rgba(167,139,250,0.1)" :
                      post.status === "queued" ? "rgba(96,165,250,0.1)" :
                      "rgba(255,196,0,0.1)",
          border: post.status === "published" ? "1px solid rgba(34,197,94,0.25)" :
                  post.status === "failed" ? "1px solid rgba(239,68,68,0.25)" :
                  post.status === "processing" ? "1px solid rgba(167,139,250,0.25)" :
                  post.status === "queued" ? "1px solid rgba(96,165,250,0.25)" :
                  "1px solid rgba(255,196,0,0.22)",
          color: post.status === "published" ? "#22c55e" :
                 post.status === "failed" ? "#ef4444" :
                 post.status === "processing" ? "#a78bfa" :
                 post.status === "queued" ? "#60a5fa" :
                 "#ffc400",
        }}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-space)", fontSize: "0.95rem", fontWeight: 700, color: "#fff",
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 10, lineHeight: 1.4,
      }}>{post.title}</h3>

      {/* Image thumbnail */}
      {post.imageUrl && (
        <div style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden", maxHeight: 140 }}>
          <img src={post.imageUrl} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { icon: FiCalendar, text: formatDate(post.date) },
          { icon: FiClock, text: post.time || "—" },
          { icon: TypeIcon, text: post.postType },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Icon size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{text}</span>
          </div>
        ))}
      </div>

      {/* Published stats */}
      {post.status === "published" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {["↑ 42 upvotes", "💬 8 comments", "👁 1.2K views"].map(stat => (
            <span key={stat} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 8, padding: "4px 10px", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)",
            }}>{stat}</span>
          ))}
        </div>
      )}

      {/* Actions (scheduled only) */}
      {post.status === "scheduled" && (
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onEdit} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", fontWeight: 600,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <FiEdit2 size={13} /> Edit
          </button>
          <button onClick={() => setConfirmDelete(true)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,80,80,0.04)", border: "1px solid rgba(255,80,80,0.15)",
            borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            color: "rgba(255,80,80,0.6)", fontSize: "0.78rem", fontWeight: 600,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)"; e.currentTarget.style.color = "rgba(255,80,80,1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "rgba(255,80,80,0.6)"; }}
          >
            <FiTrash2 size={13} /> Delete
          </button>
        </div>
      )}

      {/* Delete confirmation overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "absolute", inset: 0, borderRadius: 16,
              background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,80,80,0.12)", border: "1.5px solid rgba(255,80,80,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FiAlertTriangle size={18} color="rgba(255,80,80,0.9)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", marginBottom: 4 }}>Delete this post?</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>This action cannot be undone.</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setConfirmDelete(false)} style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "rgba(255,255,255,0.6)",
                fontWeight: 600, fontSize: "0.8rem",
              }}>Cancel</button>
              <button onClick={() => { setConfirmDelete(false); onDelete?.(); }} style={{
                background: "rgba(255,60,60,0.9)", border: "none",
                borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#fff",
                fontWeight: 700, fontSize: "0.8rem",
              }}>Delete</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
