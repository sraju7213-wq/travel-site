"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LEADING_NUMBER = /^(\D*)(\d+(?:\.\d+)?)([\s\S]*)$/;

/**
 * StatValue
 * ---------
 * Renders a statistic, counting the numeric part up when it scrolls into view.
 *
 * Handles the mixed formats the heritage figures use — "Since 1927",
 * "Up to 15", "27" — by pulling out the leading number and animating only
 * that, while keeping the surrounding words ("Since", "Up to") static.
 *
 * Values with no number at all ("Two", "Flexible") simply wipe in behind a
 * mask, which keeps the row visually consistent.
 */
export interface StatValueProps {
  value: string;
  className?: string;
  duration?: number;
}

export default function StatValue({ value, className = "", duration = DURATION.slow }: StatValueProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  const match = value.match(LEADING_NUMBER);
  const prefix = match ? match[1] : "";
  const numberText = match ? match[2] : "";
  const suffix = match ? match[3] : "";
  const numericValue = match ? parseFloat(numberText) : null;
  const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;

  useEffect(() => {
    const host = hostRef.current;
    const number = numberRef.current;
    if (!host) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      if (numericValue !== null && number) {
        const counter = { n: 0 };
        gsap.to(counter, {
          n: numericValue,
          duration,
          ease: EASE.expo,
          snap: { n: 1 / 10 ** decimals },
          scrollTrigger: { trigger: host, start: "top 94%", once: true },
          onUpdate: () => {
            number.textContent = counter.n.toFixed(decimals);
          },
        });
      } else {
        // Non-numeric figure: a masked wipe keeps the row rhythm intact.
        gsap.fromTo(
          host,
          { clipPath: "inset(0% 0% 100% 0%)", y: 8 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration,
            ease: EASE.expo,
            scrollTrigger: { trigger: host, start: "top 94%", once: true },
          }
        );
      }
    }, host);

    return () => ctx.revert();
  }, [numericValue, decimals, duration]);

  if (numericValue !== null) {
    return (
      <span ref={hostRef} className={className}>
        {prefix}
        <span ref={numberRef}>{numberText}</span>
        {suffix}
      </span>
    );
  }

  return (
    <span ref={hostRef} className={className} style={{ display: "inline-block" }}>
      {value}
    </span>
  );
}
