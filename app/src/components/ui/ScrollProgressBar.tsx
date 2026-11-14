"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const current = (window.scrollY / totalHeight) * 100;
            setProgress(Math.min(100, Math.max(0, current)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden z-50"
    >
      <div
        className="h-full bg-gradient-to-r from-[var(--color-wild-orange,#ff6e00)] via-[#ffa24d] to-[var(--color-wild-orange,#ff6e00)] transition-[width] duration-150 ease-out shadow-[0_0_8px_rgba(255,110,0,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

