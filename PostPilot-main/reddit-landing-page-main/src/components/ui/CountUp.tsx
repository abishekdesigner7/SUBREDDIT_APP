"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({ end, duration = 2, decimals = 0, prefix = "", suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const startVal = 0;

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now: number) {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const current = startVal + (end - startVal) * easeOut(progress);
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}
