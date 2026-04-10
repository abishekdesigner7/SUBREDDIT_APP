"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut, FiUser, FiArrowLeft } from "react-icons/fi";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const clickLockRef = useRef(false);
  const clickLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  function handleNavClick(e: React.MouseEvent, href: string, label: string) {
    // Immediately set the target link and lock the observer for 1s
    setActiveLink(label);
    setMenuOpen(false);
    clickLockRef.current = true;
    if (clickLockTimer.current) clearTimeout(clickLockTimer.current);
    clickLockTimer.current = setTimeout(() => { clickLockRef.current = false; }, 1000);

    if (!isHome) {
      e.preventDefault();
      const sectionId = href.replace("#", "");
      sessionStorage.setItem("scrollTo", sectionId);
      router.push("/");
    }
  }

  // After arriving on home page, scroll to the stored section
  useEffect(() => {
    if (!isHome) return;
    const sectionId = sessionStorage.getItem("scrollTo");
    if (!sectionId) return;
    sessionStorage.removeItem("scrollTo");
    const attempt = (tries: number) => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 100);
      }
    };
    setTimeout(() => attempt(10), 100);
  }, [isHome]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace("#", ""));
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !clickLockRef.current) {
            setActiveLink(NAV_LINKS.find(l => l.href === `#${id}`)?.label ?? "");
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          height: 64,
          display: "flex", alignItems: "center",
          padding: "0 32px",
          justifyContent: "space-between",
          background: scrolled ? "var(--blur-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "all 0.35s ease",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div whileHover={{ scale: 1.05 }} style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #FF4500 0%, #d93d00 100%)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-space)", fontWeight: 900, color: "#fff", fontSize: "1.1rem",
            boxShadow: "0 4px 14px rgba(255,69,0,0.45)",
          }}>P</motion.div>
          <span style={{
            fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "1.05rem",
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}>{SITE_NAME}</span>
        </Link>

        {!isHome && (
          <Link href="/" style={{ 
            fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.45)", 
            textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            marginLeft: 8, transition: "all 0.2s",
            padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)"
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
          className="desktop-only"
          >
            <FiArrowLeft size={14} /> Back to Home
          </Link>
        )}

        {/* Nav links */}
        <div style={{ display: "flex", gap: 8 }} className="desktop-only">
          {NAV_LINKS.map(l => {
            const isActive = activeLink === l.label;
            return (
              <Link
                key={l.label}
                href={isHome ? l.href : `/${l.href}`}
                onClick={e => handleNavClick(e, l.href, l.label)}
                style={{
                  fontSize: "0.88rem", fontWeight: 600,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  textDecoration: "none",
                  padding: "8px 20px", borderRadius: 8,
                  transition: "color 0.2s",
                  position: "relative",
                  display: "inline-block",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
                onMouseLeave={e => {
                  if (!isActive)
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    style={{
                      position: "absolute", bottom: 2, left: 12, right: 12,
                      height: 2, borderRadius: 99, background: "#FF4500",
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA buttons / User Profile */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }} className="desktop-only">
          <ThemeToggle />
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>{user.name}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Trial Plan</div>
              </div>
              <div style={{ position: "relative", group: "true" } as any}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #FF4500 0%, #d93d00 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", fontWeight: 800, color: "#fff",
                  boxShadow: "0 4px 12px rgba(255,69,0,0.3)",
                  cursor: "pointer",
                  border: "2px solid rgba(255,255,255,0.1)"
                }}
                onClick={() => {
                  if (confirm("Log out of your account?")) handleLogout();
                }}
                title="Click to logout"
                >
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn-login" style={{
                fontSize: "0.85rem", fontWeight: 600,
                color: "var(--orange)", textDecoration: "none",
                padding: "8px 18px", borderRadius: 8,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >Log in</Link>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href={isHome ? "#pricing" : "/#pricing"} style={{
                  fontSize: "0.85rem", fontWeight: 700,
                  color: "#fff", textDecoration: "none",
                  padding: "11px 24px", borderRadius: 10,
                  background: "var(--orange)",
                  boxShadow: "0 4px 16px var(--orange-glow)",
                  transition: "all 0.2s",
                  display: "block",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--orange-dim)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 22px var(--orange-glow)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--orange)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px var(--orange-glow)";
                  }}
                >Start free trial</Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-only" style={{
          background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none",
        }}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
              background: "rgba(10,10,10,0.97)", backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              padding: "16px 24px 24px",
              display: "flex", flexDirection: "column", gap: 4,
            }}
          >
            {!isHome && (
              <Link href="/" onClick={() => setMenuOpen(false)} style={{
                fontSize: "0.9rem", fontWeight: 600, color: "#FF4500",
                textDecoration: "none", padding: "12px 0",
                borderBottom: "1px solid rgba(255,69,0,0.2)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <FiArrowLeft size={16} /> Back to Home
              </Link>
            )}
            {NAV_LINKS.map(l => (
              <Link key={l.label} href={isHome ? l.href : `/${l.href}`} onClick={e => handleNavClick(e, l.href, l.label)} style={{
                fontSize: "1rem", fontWeight: 500, color: "rgba(255,255,255,0.75)",
                textDecoration: "none", padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>{l.label}</Link>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
              {user ? (
                <Link href="/schedule" onClick={() => setMenuOpen(false)} style={{
                  textAlign: "center", padding: "12px", borderRadius: 12,
                  background: "#FF4500", color: "#fff",
                  textDecoration: "none", fontSize: "0.9rem", fontWeight: 700,
                }}>Go to scheduler</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="btn-login" style={{
                    textAlign: "center", padding: "12px",
                    borderRadius: 12, color: "var(--orange)",
                    textDecoration: "none", fontSize: "0.9rem", fontWeight: 600,
                  }}>Log in</Link>
                  <Link href={isHome ? "#pricing" : "/#pricing"} onClick={() => setMenuOpen(false)} style={{
                    textAlign: "center", padding: "12px", borderRadius: 12,
                    background: "#FF4500", color: "#fff",
                    textDecoration: "none", fontSize: "0.9rem", fontWeight: 700,
                  }}>Start free trial</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
}
