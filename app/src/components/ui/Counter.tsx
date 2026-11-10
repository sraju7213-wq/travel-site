"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Counter
 * -------
 * Counts a number up when it scrolls into view. Used for the heritage
 * statistics on the homepage so the figures arrive with weight instead of
 * simply appearing.
 *
 * The value is rendered server-side at its final number, so the number is
 * always present for search engines and screen readers — the animation only
 * affects what the eye sees.
 */
export interface CounterProps {
  /** The number to count to. */
  value: number;
  /** Number of decimal places to show. */
  decimals?: number;
  /** Prefix rendered before the number, e.g. "₹". */
  prefix?: string;
  /** Suffix rendered after the number, e.g. "+" or " yrs". */
  suffix?: string;
  className?: string;
  /** Seconds the count takes. */
  duration?: number;
}

export default function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  duration = 1.8,
}: CounterProps) {
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const counter = { n: 0 };

      gsap.to(counter, {
        n: value,
        duration,
        ease: EASE.expo,
        snap: { n: 1 / 10 ** decimals },
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.n.toFixed(decimals)}${suffix}`;
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, decimals, prefix, suffix, duration]);

  return (
    <span ref={valueRef} className={className}>
      {`${prefix}${value.toFixed(decimals)}${suffix}`}
    </span>
  );
}
