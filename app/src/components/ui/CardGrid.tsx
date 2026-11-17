"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CardGridProps {
  children: ReactNode;
  className?: string;
  /** Seconds between each card's entrance. */
  stagger?: number;
  /** Duration of each card's entrance. */
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
  /** Distance each card rises, in pixels. */
  distance?: number;
}

/**
 * CardGrid
 * --------
 * Reveals a grid of cards as it scrolls into view, one card after another.
 *
 * Cards are pulled in with `ScrollTrigger.batch` so that only the cards
 * actually on screen animate — scrolling fast through a long catalogue does
 * not queue hundreds of tweens, and cards further down the page still get
 * their entrance when they arrive.
 *
 * @example
 * <CardGrid className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
 *   <PackageCard pkg={pkg} />
 * </CardGrid>
 */
export default function CardGrid({
  children,
  className = "",
  stagger = 0.09,
  duration = DURATION.base,
  start = "top 88%",
  distance = 34,
}: CardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const cards = Array.from(container.children) as HTMLElement[];
      if (cards.length === 0) return;

      gsap.set(cards, { willChange: "transform, opacity" });

      ScrollTrigger.batch(cards, {
        start,
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: distance },
            {
              opacity: 1,
              y: 0,
              duration,
              ease: EASE.expo,
              stagger: stagger,
              overwrite: true,
              immediateRender: false,
              onComplete: () => {
                gsap.set(batch, { willChange: "auto" });
              },
            }
          );
        },
      });
    }, container);

    return () => ctx.revert();
  }, [stagger, duration, start, distance]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
