"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal
 * ------------
 * A reusable GSAP ScrollTrigger reveal primitive for the India &amp; Nepal travel site.
 *
 * Wraps content and animates it into view as it enters the viewport. Built on
 * `gsap.context` so every ScrollTrigger instance is automatically cleaned up
 * when the component unmounts (critical for Next.js App Router client
 * components that can be remounted during navigation).
 *
 * Respects `prefers-reduced-motion: reduce` — animation is skipped entirely
 * and content is shown immediately so users with vestibular disorders aren't
 * subjected to motion.
 *
 * @example
 * <ScrollReveal duration={0.8} stagger={0.2} start="top 80%">
 *   <h2 className="text-h2">Discover India and Nepal</h2>
 *   <p className="lead-editorial">...</p>
 * </ScrollReveal>
 */

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Duration of each reveal animation in seconds. */
  duration?: number;
  /** Stagger (delay) between child reveals in seconds. */
  stagger?: number;
  /** ScrollTrigger start position, e.g. "top 85%". */
  start?: string;
  /** ScrollTrigger end position, e.g. "bottom 20%". */
  end?: string;
  /** GSAP ease string. */
  ease?: string;
  /** Initial vertical offset (px) elements animate from. */
  y?: number;
  /** Initial opacity elements animate from. */
  opacity?: number;
  /** When true, each direct child is revealed individually with stagger. */
  staggerChildren?: boolean;
  /** When true, the reveal only plays once on first enter (default). When false,
   * the animation replays when scrolling back up. */
  once?: boolean;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function ScrollReveal({
  children,
  className,
  duration = 0.8,
  stagger = 0.15,
  start = "top 85%",
  end = "bottom 10%",
  ease = "power2.out",
  y = 30,
  opacity = 0,
  staggerChildren = true,
  once = true,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No-op on server / during SSR.
    if (typeof window === "undefined") {
      return undefined;
    }

    // Honor the user's motion preference — skip JS animation entirely.
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const targets = staggerChildren
        ? gsap.utils.toArray(":scope > *", container)
        : [container];

      gsap.from(targets, {
        scrollTrigger: {
          trigger: container,
          start,
          end,
          toggleActions: once ? "play none none none" : "play none none reverse",
          once,
          // Prevent the same element from re-triggering while already animating.
          fastScrollEnd: true,
        },
        y,
        opacity,
        duration,
        ease,
        stagger: staggerChildren ? stagger : 0,
        // `immediateRender: true` (the `gsap.from` default) hides content the
        // instant the effect runs, then animates it in — no layout shift.
      });
    }, containerRef);

    return () => {
      // Revert kills every ScrollTrigger/animation created in this context.
      ctx.revert();
    };
  }, [duration, stagger, start, end, ease, y, opacity, staggerChildren, once]);

  return <div ref={containerRef} className={className}>
    {children}
  </div>;
}
