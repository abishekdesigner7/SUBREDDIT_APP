"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import CelebrationOverlay from "@/components/ui/CelebrationOverlay";
import {
  FiFileText, FiImage, FiLink2, FiCalendar, FiClock,
  FiArrowRight, FiArrowLeft, FiUpload, FiX, FiSend, FiChevronDown, FiLoader
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Post, getPost, getPosts, savePost, generateId } from "@/lib/posts";
import { apiFetch } from "@/lib/api";

interface Props {
  editId?: string;
  step: number;
  onStepChange: (s: number) => void;
}

type FormData = Omit<Post, "id" | "status" | "createdAt">;

const POST_TYPES: { type: FormData["postType"]; icon: React.ElementType; label: string; desc: string }[] = [
  { type: "text", icon: FiFileText, label: "Text", desc: "Write a post" },
  { type: "image", icon: FiImage, label: "Image", desc: "Upload media" },
  { type: "link", icon: FiLink2, label: "Link", desc: "Share a URL" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
  padding: "11px 14px", color: "#fff",
  fontSize: "0.92rem", outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{label}</span>
        {optional && (
          <span style={{
            fontSize: "0.63rem", fontWeight: 600, color: "rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.05)", borderRadius: 999, padding: "2px 8px",
          }}>optional</span>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ScheduleForm({ editId, step, onStepChange }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [dragOver, setDragOver] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const handleCelebrationDone = useCallback(() => {
    setShowCelebration(false);
    router.push("/dashboard");
  }, [router]);
  const [targetType, setTargetType] = useState<"subreddit" | "user">("subreddit");
  const [activeTimeField, setActiveTimeField] = useState<"hour" | "minute" | null>(null);

  const [form, setForm] = useState<FormData>({
    subreddit: "",
    date: "",
    time: "",
    title: "",
    body: "",
    imageUrl: "",
    linkUrl: "",
    postType: "text",
    flair: "",
    tags: { nsfw: false, spoiler: false, brandAffiliate: false },
  });

  useEffect(() => {
    if (editId) {
      getPost(editId).then((post) => {
        if (post) {
          const { id: _id, status: _s, createdAt: _c, _id: __id, ...rest } = post;
          setForm(rest);
        }
      });
    }
  }, [editId]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(255,69,0,0.5)";
  }
  function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
  }

  function validateStep1() {
    const e: typeof errors = {};
    const cleaned = form.subreddit.replace(/^(r\/|u\/)/, "").trim();
    if (!cleaned) e.subreddit = targetType === "subreddit" ? "Subreddit is required" : "Username is required";
    else if (!/^[A-Za-z0-9_-]{2,}$/.test(cleaned)) e.subreddit = "Invalid name format";
    if (!form.date) e.date = "Date is required";
    if (!form.time) e.time = "Time is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (form.postType === "link" && !form.linkUrl.trim()) e.linkUrl = "Link URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    onStepChange(step + 1);
  }

  async function handlePublish() {
    let userObj: any = {};
    if (typeof window !== "undefined") {
      try {
        userObj = JSON.parse(localStorage.getItem("user") || "{}");
      } catch {}
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must log in or sign up before scheduling a post!");
      router.push("/login");
      return;
    }

    const isTrialExpired = userObj.subscriptionStatus === 'trialing' && new Date() > new Date(userObj.trialEndsAt);
    if (!userObj.subscriptionStatus || ['none', 'canceled', 'past_due'].includes(userObj.subscriptionStatus) || isTrialExpired) {
      toast.error("You need an active plan or free trial to schedule posts. Please upgrade!");
      router.push("/");
      return;
    }

    setPublishing(true);

    try {
      // 10-minute gap check
      const existingPosts = await getPosts();
      const scheduledPosts = existingPosts.filter(p => p.status === "scheduled" && p.id !== editId);
      
      const newTime = new Date(`${form.date}T${form.time}`).getTime();
      
      for (const p of scheduledPosts) {
        const pTime = new Date(`${p.date}T${p.time}`).getTime();
        const diffMins = Math.abs(newTime - pTime) / (1000 * 60);
        
        if (diffMins < 10) {
          toast.error("⚠️ Strict 10-minute gap required between posts.");
          setPublishing(false);
          return;
        }
      }

      const prefix = targetType === "subreddit" ? "r/" : "u/";
      const cleanedSub = form.subreddit.replace(/^(r\/|u\/)/, "").trim();
      const finalTarget = prefix + cleanedSub;

      // Build scheduledTime as a proper ISO string in the user's local timezone
      // so the backend stores the correct UTC time regardless of server location
      const localDate = new Date(`${form.date}T${form.time}`);
      const scheduledTimeISO = localDate.toISOString();

      await savePost({
        ...form,
        subreddit: finalTarget,
        id: editId || generateId(),
        _id: editId,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        scheduledTime: scheduledTimeISO,
      } as any, !!editId);
      setShowCelebration(true);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while scheduling.");
      setPublishing(false);
    }
  }

  const handleImageFile = async (file: File) => {
    if (!file) return;
    
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.error("Please log in or sign up before uploading images!");
      router.push("/login");
      return;
    }

    setUploadingImage(true);
    try {
      const data = await apiFetch("/upload/presign", {
        method: "POST",
        body: JSON.stringify({ fileType: file.type }),
      });
      
      await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      set("imageUrl", data.publicUrl);
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const subDisplay = form.subreddit
    ? (form.subreddit.startsWith("r/") || form.subreddit.startsWith("u/") ? form.subreddit : `${targetType === "subreddit" ? "r/" : "u/"}${form.subreddit}`)
    : (targetType === "subreddit" ? "r/..." : "u/...");

  const formatAmPm = (timeStr: string) => {
    if (!timeStr) return "—";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Post type selector */}
            <Field label="Post type">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {POST_TYPES.map(({ type, icon: Icon, label, desc }) => (
                  <button key={type} onClick={() => set("postType", type)} style={{
                    background: form.postType === type ? "rgba(255,69,0,0.07)" : "rgba(255,255,255,0.03)",
                    border: form.postType === type ? "1.5px solid rgba(255,69,0,0.45)" : "1.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "14px 10px", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    transition: "all 0.2s",
                  }}>
                    <Icon size={20} color={form.postType === type ? "#FF4500" : "rgba(255,255,255,0.4)"} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: form.postType === type ? "#fff" : "rgba(255,255,255,0.5)" }}>{label}</span>
                    <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{desc}</span>
                  </button>
                ))}
              </div>
            </Field>

            {/* Target Area */}
            <Field label="Target">
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {/* Target Type Toggle */}
                <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 4, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <button type="button" onClick={() => setTargetType("subreddit")} style={{
                    padding: "8px 12px", border: "none", borderRadius: 7, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    background: targetType === "subreddit" ? "#FF4500" : "transparent",
                    color: targetType === "subreddit" ? "#fff" : "rgba(255,255,255,0.4)"
                  }}>r/ Community</button>
                  <button type="button" onClick={() => setTargetType("user")} style={{
                    padding: "8px 12px", border: "none", borderRadius: 7, fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    background: targetType === "user" ? "#FF4500" : "transparent",
                    color: targetType === "user" ? "#fff" : "rgba(255,255,255,0.4)"
                  }}>u/ Profile</button>
                </div>

                {/* Input */}
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.92rem", color: "rgba(255,255,255,0.35)", pointerEvents: "none", fontWeight: 600 }}>
                    {targetType === "subreddit" ? "r/" : "u/"}
                  </span>
                  <input
                    value={form.subreddit.replace(/^(r\/|u\/)/, "")}
                    onChange={e => set("subreddit", e.target.value)}
                    onFocus={focusStyle} onBlur={blurStyle}
                    placeholder={targetType === "subreddit" ? "entrepreneur" : "username"}
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
                </div>
              </div>
              {errors.subreddit && <span style={{ fontSize: "0.72rem", color: "#FF4500" }}>{errors.subreddit}</span>}
            </Field>

            {/* Date + Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Date">
                <div style={{ position: "relative" }}>
                  <FiCalendar size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                    onFocus={focusStyle} onBlur={blurStyle}
                    style={{ ...inputStyle, paddingLeft: 34, colorScheme: "dark" }}
                  />
                </div>
                {errors.date && <span style={{ fontSize: "0.72rem", color: "#FF4500" }}>{errors.date}</span>}
              </Field>
              <Field label="Time">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Hour Custom Select */}
                  <div style={{ position: "relative", flex: 1 }}>
                    <div
                      onClick={() => setActiveTimeField(activeTimeField === "hour" ? null : "hour")}
                      style={{
                        ...inputStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                        borderColor: activeTimeField === "hour" ? "rgba(255,69,0,0.5)" : "rgba(255,255,255,0.1)",
                        background: activeTimeField === "hour" ? "rgba(255,69,0,0.04)" : "rgba(255,255,255,0.04)",
                      }}
                    >
                      <FiClock size={14} color={activeTimeField === "hour" ? "#FF4500" : "rgba(255,255,255,0.4)"} />
                      <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                        {form.time ? formatAmPm(form.time).split(":")[0].padStart(2, "0") : "12"}
                      </span>
                      <FiChevronDown size={14} style={{ marginLeft: "auto", opacity: 0.3, transform: activeTimeField === "hour" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>

                    <AnimatePresence>
                      {activeTimeField === "hour" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          style={{
                            position: "absolute", top: "110%", left: 0, right: 0, zIndex: 100,
                            background: "#121212", border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            maxHeight: 180, overflowY: "auto", padding: 6,
                          }}
                        >
                          {Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i).map(h => {
                            const hStr = String(h).padStart(2, "0");
                            const currentH = form.time ? formatAmPm(form.time).split(":")[0].padStart(2, "0") : "12";
                            const isSelected = hStr === currentH;
                            return (
                              <div
                                key={h}
                                onClick={() => {
                                  const m = form.time ? form.time.split(":")[1] : "00";
                                  const isPm = form.time ? parseInt(form.time.split(":")[0]) >= 12 : false;
                                  let newH = h;
                                  if (isPm && newH < 12) newH += 12;
                                  if (!isPm && newH === 12) newH = 0;
                                  set("time", `${String(newH).padStart(2, "0")}:${m}`);
                                  setActiveTimeField(null);
                                }}
                                style={{
                                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                                  fontSize: "0.85rem", fontWeight: isSelected ? 800 : 500,
                                  color: isSelected ? "#FF4500" : "rgba(255,255,255,0.6)",
                                  background: isSelected ? "rgba(255,69,0,0.1)" : "transparent",
                                  transition: "all 0.15s",
                                }}
                              >
                                {hStr}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 800 }}>:</span>

                  {/* Minute Custom Select */}
                  <div style={{ position: "relative", flex: 1 }}>
                    <div
                      onClick={() => setActiveTimeField(activeTimeField === "minute" ? null : "minute")}
                      style={{
                        ...inputStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                        borderColor: activeTimeField === "minute" ? "rgba(255,69,0,0.5)" : "rgba(255,255,255,0.1)",
                        background: activeTimeField === "minute" ? "rgba(255,69,0,0.04)" : "rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                        {form.time ? form.time.split(":")[1] : "00"}
                      </span>
                      <FiChevronDown size={14} style={{ marginLeft: "auto", opacity: 0.3, transform: activeTimeField === "minute" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </div>

                    <AnimatePresence>
                      {activeTimeField === "minute" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          style={{
                            position: "absolute", top: "110%", left: 0, right: 0, zIndex: 100,
                            background: "#121212", border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            maxHeight: 180, overflowY: "auto", padding: 6,
                          }}
                        >
                          {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map(m => {
                            const currentM = form.time ? form.time.split(":")[1] : "00";
                            const isSelected = m === currentM;
                            return (
                              <div
                                key={m}
                                onClick={() => {
                                  let hStr = form.time ? form.time.split(":")[0] : "12";
                                  set("time", `${hStr}:${m}`);
                                  setActiveTimeField(null);
                                }}
                                style={{
                                  padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                                  fontSize: "0.85rem", fontWeight: isSelected ? 800 : 500,
                                  color: isSelected ? "#FF4500" : "rgba(255,255,255,0.6)",
                                  background: isSelected ? "rgba(255,69,0,0.1)" : "transparent",
                                  transition: "all 0.15s",
                                }}
                              >
                                {m}
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AM/PM Polish Toggle */}
                  <div style={{
                    display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4,
                    border: "1px solid rgba(255,255,255,0.08)", minWidth: 100
                  }}>
                    {(["AM", "PM"] as const).map(p => {
                      const currentAmPm = form.time ? (parseInt(form.time.split(":")[0], 10) >= 12 ? "PM" : "AM") : "AM";
                      const active = currentAmPm === p;
                      return (
                        <button
                          key={p} type="button"
                          onClick={() => {
                            let hStr = form.time ? form.time.split(":")[0] : "12";
                            const mStr = form.time ? form.time.split(":")[1] : "00";
                            let h = parseInt(hStr, 10);
                            if (p === "PM" && h < 12) h += 12;
                            if (p === "AM" && h >= 12) h -= 12;
                            set("time", `${String(h).padStart(2, "0")}:${mStr}`);
                          }}
                          style={{
                            flex: 1, padding: "8px 0", border: "none", borderRadius: 8, fontSize: "0.75rem",
                            fontWeight: 800, cursor: "pointer", transition: "all 0.25s",
                            background: active ? "#FF4500" : "transparent",
                            color: active ? "#fff" : "rgba(255,255,255,0.3)",
                            boxShadow: active ? "0 4px 12px rgba(255,69,0,0.3)" : "none",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {errors.time && <span style={{ fontSize: "0.72rem", color: "#FF4500", marginTop: 6, display: "block" }}>{errors.time}</span>}
              </Field>
            </div>

            {/* Tags & Flair dropdown */}
            <div style={{ marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setTagsOpen(o => !o)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: tagsOpen ? "rgba(255,69,0,0.06)" : "rgba(255,255,255,0.04)",
                  border: tagsOpen ? "1px solid rgba(255,69,0,0.35)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: tagsOpen ? "10px 10px 0 0" : 10,
                  padding: "11px 14px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                    Add tags & flair
                  </span>
                  <span style={{
                    fontSize: "0.63rem", fontWeight: 600, color: "rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.05)", borderRadius: 999, padding: "2px 8px",
                  }}>optional</span>
                  {/* Active tag pills */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {form.tags.nsfw && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 999, padding: "1px 7px" }}>NSFW</span>}
                    {form.tags.spoiler && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 999, padding: "1px 7px" }}>Spoiler</span>}
                    {form.tags.brandAffiliate && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#60a5fa", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 999, padding: "1px 7px" }}>Affiliate</span>}
                    {form.flair && <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 999, padding: "1px 7px" }}>{form.flair}</span>}
                  </div>
                </div>
                <motion.div animate={{ rotate: tagsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FiChevronDown size={16} color="rgba(255,255,255,0.4)" />
                </motion.div>
              </button>

              <AnimatePresence>
                {tagsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      border: "1px solid rgba(255,69,0,0.35)", borderTop: "none",
                      borderRadius: "0 0 10px 10px",
                      background: "rgba(255,255,255,0.02)",
                    }}>
                      {/* Toggle rows */}
                      {([
                        { key: "nsfw", label: "Not Safe for Work", desc: "Marks this post as NSFW", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
                        { key: "spoiler", label: "Spoiler", desc: "Hides post content behind a warning", color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
                        { key: "brandAffiliate", label: "Brand Affiliate", desc: "Discloses brand partnership", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)" },
                      ] as const).map((tag, i, arr) => {
                        const on = form.tags[tag.key as keyof typeof form.tags];
                        return (
                          <div key={tag.key} style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "13px 16px",
                            borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{
                                width: 8, height: 8, borderRadius: "50%",
                                background: on ? tag.color : "rgba(255,255,255,0.15)",
                                transition: "background 0.2s",
                              }} />
                              <div>
                                <div style={{ fontSize: "0.84rem", fontWeight: 600, color: on ? "#fff" : "rgba(255,255,255,0.55)" }}>{tag.label}</div>
                                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{tag.desc}</div>
                              </div>
                            </div>
                            {/* Toggle switch */}
                            <button
                              type="button"
                              onClick={() => setForm(prev => ({ ...prev, tags: { ...prev.tags, [tag.key]: !prev.tags[tag.key as keyof typeof prev.tags] } }))}
                              style={{
                                width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer",
                                background: on ? tag.bg : "rgba(255,255,255,0.08)",
                                outline: on ? `1px solid ${tag.border}` : "1px solid rgba(255,255,255,0.1)",
                                position: "relative", transition: "all 0.25s", flexShrink: 0,
                              }}
                            >
                              <motion.div
                                animate={{ x: on ? 22 : 2 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                style={{
                                  position: "absolute", top: 3, width: 18, height: 18, borderRadius: "50%",
                                  background: on ? tag.color : "rgba(255,255,255,0.35)",
                                  boxShadow: on ? `0 0 6px ${tag.color}80` : "none",
                                }}
                              />
                            </button>
                          </div>
                        );
                      })}

                      {/* Flair text input */}
                      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>Post flair</div>
                        <input
                          value={form.flair}
                          onChange={e => set("flair", e.target.value)}
                          onFocus={focusStyle} onBlur={blurStyle}
                          placeholder="e.g. Discussion, AMA, News"
                          style={{ ...inputStyle, fontSize: "0.85rem", padding: "9px 12px" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Title */}
            <Field label="Post title">
              <div style={{ position: "relative" }}>
                <input
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                  onFocus={focusStyle} onBlur={blurStyle}
                  maxLength={300}
                  placeholder="An engaging title that gets clicks..."
                  style={inputStyle}
                />
                <span style={{
                  position: "absolute", right: 10, bottom: -18,
                  fontSize: "0.65rem", color: "rgba(255,255,255,0.25)",
                }}>{form.title.length}/300</span>
              </div>
              {errors.title && <span style={{ fontSize: "0.72rem", color: "#FF4500", marginTop: 20, display: "block" }}>{errors.title}</span>}
            </Field>

            {/* Body text */}
            <Field label="Body text" optional>
              <textarea
                value={form.body}
                onChange={e => set("body", e.target.value)}
                onFocus={focusStyle as React.FocusEventHandler<HTMLTextAreaElement>}
                onBlur={blurStyle as React.FocusEventHandler<HTMLTextAreaElement>}
                placeholder="Share your thoughts, story, or details..."
                rows={4}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.7, fontFamily: "inherit", fontSize: "0.88rem" }}
              />
            </Field>

            {/* Image upload */}
            {form.postType === "image" && (
              <Field label="Image">
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { if (e.target.files?.[0]) handleImageFile(e.target.files[0]); }}
                />
                {form.imageUrl ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#fff", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Image selected</div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>Click remove to change</div>
                    </div>
                    <button onClick={() => set("imageUrl", "")} style={{
                      display: "flex", alignItems: "center", gap: 5,
                      background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)",
                      borderRadius: 7, padding: "5px 10px", cursor: "pointer",
                      color: "rgba(255,100,100,0.8)", fontSize: "0.72rem", fontWeight: 600, flexShrink: 0,
                    }}>
                      <FiX size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploadingImage && fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]); }}
                    style={{
                      border: `1.5px dashed ${dragOver ? "rgba(255,69,0,0.6)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: 10, padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 14,
                      cursor: uploadingImage ? "not-allowed" : "pointer", transition: "all 0.2s",
                      background: dragOver ? "rgba(255,69,0,0.04)" : "rgba(255,255,255,0.01)",
                      opacity: uploadingImage ? 0.7 : 1,
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: "rgba(255,69,0,0.1)", border: "1.5px solid rgba(255,69,0,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {uploadingImage ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                          <FiLoader size={16} color="#FF4500" />
                        </motion.div>
                      ) : (
                        <FiUpload size={16} color="#FF4500" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "rgba(255,255,255,0.65)", marginBottom: 2 }}>
                        {uploadingImage ? "Uploading to AWS S3..." : <span>Drop image or <span style={{ color: "#FF4500" }}>browse</span></span>}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.28)" }}>PNG, JPG, GIF — up to 20MB</div>
                    </div>
                  </div>
                )}
              </Field>
            )}

            {/* Link URL */}
            {form.postType === "link" && (
              <Field label="Link URL">
                <div style={{ position: "relative" }}>
                  <FiLink2 size={14} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input type="url" value={form.linkUrl} onChange={e => set("linkUrl", e.target.value)}
                    onFocus={focusStyle} onBlur={blurStyle}
                    placeholder="https://example.com/article"
                    style={{ ...inputStyle, paddingLeft: 34 }}
                  />
                </div>
                {errors.linkUrl && <span style={{ fontSize: "0.72rem", color: "#FF4500" }}>{errors.linkUrl}</span>}
              </Field>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Section label */}
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Post preview</div>

            {/* Reddit-style post card */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14, overflow: "hidden", marginBottom: 16,
            }}>
              {/* Card top bar */}
              <div style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                {/* Subreddit */}
                <span style={{
                  background: "#FF4500", borderRadius: 999, padding: "3px 10px",
                  fontSize: "0.73rem", fontWeight: 800, color: "#fff",
                }}>{subDisplay}</span>
                {/* Posted by */}
                <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>· Posted by <span style={{ color: "rgba(255,255,255,0.55)" }}>u/you</span></span>
                {/* Scheduled time */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <FiCalendar size={11} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{form.date || "—"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <FiClock size={11} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>{formatAmPm(form.time)}</span>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 16px 14px" }}>
                {/* Tag pills row */}
                <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                  {form.tags.nsfw && <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 4, padding: "2px 7px" }}>NSFW</span>}
                  {form.tags.spoiler && <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 4, padding: "2px 7px" }}>Spoiler</span>}
                  {form.tags.brandAffiliate && <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#60a5fa", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 4, padding: "2px 7px" }}>Brand Affiliate</span>}
                  {form.flair && <span style={{ fontSize: "0.62rem", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.22)", borderRadius: 4, padding: "2px 7px" }}>{form.flair}</span>}
                  <span style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, padding: "2px 7px", textTransform: "capitalize" }}>{form.postType}</span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "var(--font-space)", fontSize: "1rem", fontWeight: 700,
                  color: "#fff", lineHeight: 1.45, marginBottom: 10,
                }}>
                  {form.title || <span style={{ color: "rgba(255,255,255,0.2)", fontStyle: "italic", fontWeight: 400 }}>No title entered</span>}
                </h3>

                {/* Image preview */}
                {form.imageUrl && (
                  <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 10, background: "rgba(0,0,0,0.3)" }}>
                    <img src={form.imageUrl} alt="preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                  </div>
                )}

                {/* Body text */}
                {form.body && (
                  <p style={{ fontSize: "0.84rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 0 }}>
                    {form.body}
                  </p>
                )}

                {/* Link */}
                {form.linkUrl && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "9px 12px", marginTop: 4,
                  }}>
                    <FiLink2 size={13} color="#FF4500" />
                    <span style={{ fontSize: "0.78rem", color: "#FF4500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{form.linkUrl}</span>
                  </div>
                )}
              </div>

              {/* Reddit action bar */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 16px", display: "flex", gap: 4 }}>
                {[
                  { icon: "↑", label: "Upvote" },
                  { icon: "↓", label: "Downvote" },
                  { icon: "💬", label: "Comment" },
                  { icon: "⤴", label: "Share" },
                ].map(a => (
                  <div key={a.label} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "5px 10px", borderRadius: 6,
                    color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", fontWeight: 600,
                    background: "rgba(255,255,255,0.03)",
                  }}>
                    <span style={{ fontSize: "0.8rem" }}>{a.icon}</span> {a.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule summary strip */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20,
            }}>
              {[
                { label: "Subreddit", value: subDisplay, color: "#FF4500" },
                { label: "Scheduled", value: form.date && form.time ? `${form.date} · ${formatAmPm(form.time)}` : "Not set", color: "#fff" },
                { label: "Post type", value: form.postType, color: "rgba(255,255,255,0.6)" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10, padding: "10px 12px",
                }}>
                  <div style={{ fontSize: "0.62rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: s.color, textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Publish button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={publishing}
              style={{
                width: "100%", padding: "14px 24px",
                background: publishing ? "rgba(255,69,0,0.5)" : "#FF4500",
                color: "#fff", fontWeight: 700, fontSize: "0.95rem",
                border: "none", borderRadius: 12, cursor: publishing ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                boxShadow: "0 8px 28px rgba(255,69,0,0.35)",
                transition: "background 0.2s",
              }}
            >
              <FiSend size={16} />
              {publishing ? "Scheduling…" : "Schedule Post"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
        {step > 1 ? (
          <button onClick={() => onStepChange(step - 1)} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "10px 20px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.88rem",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
          >
            <FiArrowLeft size={15} /> Back
          </button>
        ) : <div />}

        {step < 3 && (
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#FF4500", border: "none",
              borderRadius: 10, padding: "10px 24px", cursor: "pointer",
              color: "#fff", fontWeight: 700, fontSize: "0.88rem",
              boxShadow: "0 4px 16px rgba(255,69,0,0.3)",
            }}
          >
            Continue <FiArrowRight size={15} />
          </motion.button>
        )}
      </div>

      <CelebrationOverlay show={showCelebration} variant="scheduled" onDone={handleCelebrationDone} />
    </div>
  );
}
