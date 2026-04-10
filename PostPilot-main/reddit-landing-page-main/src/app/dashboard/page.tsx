"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FiPlus, FiInbox, FiLink, FiCheckCircle, FiCalendar, FiImage, FiClock, FiTrash2, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import TabBar from "@/components/dashboard/TabBar";
import PostCard from "@/components/dashboard/PostCard";
import { usePosts } from "@/lib/usePosts";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { posts, loading, removePost, clearAll } = usePosts();
  const [activeTab, setActiveTab] = useState<"upcoming" | "published">("upcoming");
  const [confirmClear, setConfirmClear] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);

      // Handle query params from Reddit OAuth redirect
      const connected = searchParams.get("reddit_connected");
      const error = searchParams.get("error");

      if (connected === "true") {
        toast.success("Reddit account connected successfully!");
        // Clean up URL
        router.replace("/dashboard");
      } else if (error === "auth_failed") {
        toast.error("Failed to connect Reddit account.");
        router.replace("/dashboard");
      }
    }
  }, [searchParams, router]);

  const upcoming = posts
    .filter(p => ["scheduled", "queued", "processing", "failed"].includes(p.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const published = posts
    .filter(p => p.status === "published")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const activeList = activeTab === "upcoming" ? upcoming : published;

  const formatAmPm = (timeStr: string) => {
    if (!timeStr) return "—";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const currentWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + i + 1); // Start from Monday
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: d.getDate().toString(),
      isToday: d.toDateString() === new Date().toDateString(),
      fullDate: d.toISOString().split('T')[0]
    };
  });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#0a0a0a", paddingTop: 88 }}>
        {/* Header */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 3, height: 16, borderRadius: 99, background: "#FF4500" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase" }}>Dashboard</span>
                </div>
                <h1 style={{
                  fontFamily: "var(--font-space)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                  fontWeight: 800, letterSpacing: "-0.035em", color: "#fff", lineHeight: 1.1,
                }}>
                  Your <span style={{ color: "#FF4500" }}>Posts.</span>
                </h1>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button 
                onClick={() => setConfirmClear(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 18px",
                  background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)",
                  color: "rgba(255,80,80,0.9)", fontWeight: 600, fontSize: "0.85rem", borderRadius: 12,
                  cursor: "pointer", transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,80,80,0.4)"; e.currentTarget.style.background = "rgba(255,80,80,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,80,80,0.2)"; e.currentTarget.style.background = "rgba(255,80,80,0.1)"; }}
              >
                Clear All
              </button>
              
              {user?.reddit?.username ? (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 18px",
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22c55e", fontWeight: 600, fontSize: "0.85rem", borderRadius: 12,
                }}>
                  <FiCheckCircle size={15} /> u/{user.reddit.username}
                </div>
              ) : (
                <Link href="/connect" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 18px",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.85rem", borderRadius: 12,
                  textDecoration: "none", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; }}
                >
                  <FiLink size={15} /> Connect Reddit
                </Link>
              )}
              
              <Link href="/schedule" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 22px", background: "#FF4500", color: "#fff",
                fontWeight: 700, fontSize: "0.88rem", borderRadius: 12,
                textDecoration: "none", boxShadow: "0 4px 18px rgba(255,69,0,0.3)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(255,69,0,0.45)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 18px rgba(255,69,0,0.3)"; }}
              >
                <FiPlus size={16} /> New Post
              </Link>
              </div>
            </div>

            <TabBar
              activeTab={activeTab}
              onChange={setActiveTab}
              upcomingCount={upcoming.length}
              publishedCount={published.length}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
          {/* Summary strip */}
          {(upcoming.length > 0 || published.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}
            >
              {[
                { label: "Scheduled", value: upcoming.length, color: "#ffc400", bg: "rgba(255,196,0,0.08)", border: "rgba(255,196,0,0.2)" },
                { label: "Published", value: published.length, color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
                { label: "Total posts", value: posts.length, color: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
              ].map(s => (
                <div key={s.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: 10, padding: "8px 16px",
                }}>
                  <span style={{ fontFamily: "var(--font-space)", fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.value}</span>
                  <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{s.label}</span>
                </div>
              ))}
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {activeList.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{ textAlign: "center", padding: "80px 24px" }}
              >
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <FiInbox size={28} color="rgba(255,255,255,0.25)" />
                </div>
                <h3 style={{ fontFamily: "var(--font-space)", fontSize: "1.1rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                  {activeTab === "upcoming" ? "No scheduled posts yet" : "Nothing published yet"}
                </h3>
                <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.3)", marginBottom: 24, lineHeight: 1.6 }}>
                  {activeTab === "upcoming"
                    ? "Schedule your first post and it will appear here."
                    : "Once a post goes live, it will show up here."}
                </p>
                {activeTab === "upcoming" && (
                  <Link href="/schedule" style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 20px", background: "#FF4500", color: "#fff",
                    fontWeight: 700, fontSize: "0.88rem", borderRadius: 10,
                    textDecoration: "none", boxShadow: "0 4px 16px rgba(255,69,0,0.3)",
                  }}>
                    <FiPlus size={15} /> Schedule a post
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ 
                  display: activeTab === "upcoming" ? "block" : "grid",
                  gridTemplateColumns: activeTab === "upcoming" ? "none" : "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 16 
                }}
              >
                {activeTab === "upcoming" && (
                  <div style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 24, padding: "32px", marginBottom: 32
                  }}>
                    {/* Mini calendar day strip */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
                      {currentWeek.map(c => (
                        <div key={c.day} style={{
                          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                          padding: "12px 6px", borderRadius: 14,
                          background: c.isToday ? "#FF4500" : "rgba(255,255,255,0.04)",
                          border: c.isToday ? "none" : "1px solid rgba(255,255,255,0.08)",
                          gap: 6,
                        }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: c.isToday ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>{c.day}</span>
                          <span style={{ fontSize: "1rem", fontWeight: 800, color: c.isToday ? "#fff" : "rgba(255,255,255,0.8)", fontFamily: "var(--font-space)" }}>{c.date}</span>
                          {upcoming.some(p => p.date === c.fullDate) && !c.isToday && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF4500" }} />}
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {upcoming.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 16,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            borderRadius: 16, padding: "14px 20px",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={e => e.currentTarget.style.border = "1px solid rgba(255,69,0,0.3)"}
                          onMouseLeave={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"}
                        >
                          <div style={{
                            width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                            background: post.imageUrl ? `url(${post.imageUrl})` : "rgba(255,69,0,0.1)",
                            backgroundSize: "cover", backgroundPosition: "center",
                            border: "1px solid rgba(255,255,255,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {!post.imageUrl && <FiImage size={20} color="rgba(255,255,255,0.2)" />}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#fff", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {post.title}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: "0.75rem", color: "#FF4500", fontWeight: 600 }}>r/{post.subreddit.replace(/^r\//, "")}</span>
                              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.4)" }}>
                                <FiClock size={12} />
                                <span style={{ fontSize: "0.75rem" }}>{formatAmPm(post.time)}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <span style={{
                              fontSize: "0.68rem", fontWeight: 700,
                              color: post.status === "failed" ? "#ef4444" : post.status === "processing" ? "#FF4500" : "#3b82f6",
                              background: post.status === "failed" ? "rgba(239,68,68,0.1)" : post.status === "processing" ? "rgba(255,69,0,0.1)" : "rgba(59,130,246,0.1)",
                              padding: "4px 12px", borderRadius: 99,
                            }}>{post.status.toUpperCase()}</span>

                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => router.push(`/schedule?edit=${post.id}`)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: 8 }}>
                                <FiEdit2 size={16} />
                              </button>
                              <button onClick={() => removePost(post.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", padding: 8 }}>
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {activeList.map(post => (
                    activeTab === "published" ? (
                      <PostCard
                        key={post.id}
                        post={post}
                        onEdit={() => router.push(`/schedule?edit=${post.id}`)}
                        onDelete={() => removePost(post.id)}
                      />
                    ) : null
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clear All Data Overlay */}
        <AnimatePresence>
          {confirmClear && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{
                position: "fixed", inset: 0, zIndex: 999,
                background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
              }}
            >
              <div style={{
                background: "rgba(20,20,20,1)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20, padding: 32, maxWidth: 400, width: "100%", textAlign: "center",
              }}>
                <h3 style={{ fontFamily: "var(--font-space)", fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: 12 }}>
                  Clear all data?
                </h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 28 }}>
                  This will permanently delete all your scheduled and published posts. This action cannot be reversed.
                </p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setConfirmClear(false)} style={{
                    flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                    color: "rgba(255,255,255,0.7)", fontWeight: 600, cursor: "pointer",
                  }}>Cancel</button>
                  <button onClick={() => { setConfirmClear(false); clearAll(); }} style={{
                    flex: 1, padding: "12px", background: "#ef4444",
                    border: "none", borderRadius: 10,
                    color: "#fff", fontWeight: 700, cursor: "pointer",
                  }}>Yes, Clear Everything</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
