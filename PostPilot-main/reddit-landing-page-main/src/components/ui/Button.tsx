"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-[#FF4500] text-white hover:bg-[#CC3700] border border-transparent",
  ghost:
    "bg-transparent text-[#FF4500] hover:bg-[rgba(255,69,0,0.08)] border border-transparent",
  outline:
    "bg-transparent text-white hover:bg-white/5 border border-white/20 hover:border-white/40",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer ${styles[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;

  const MotionTag = motion.button;

  if (href) {
    return (
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ display: fullWidth ? "block" : "inline-block" }}
      >
        <Link href={href} className={base}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <MotionTag
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={base}
    >
      {children}
    </MotionTag>
  );
}
