"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Reveal
 * ------
 * The house scroll-reveal primitive. One component covers every entrance style
 * the product needs so timing, easing and reduced-motion behaviour stay
 * consistent instead of being re-tuned per section.
 *
 * Variants
 *  - `fade-up`   default: rises 28px into place
 *  - `mask`      clip-path curtain: the element is uncovered from the bottom
 *  - `scale`     grows from 92% with a soft overshoot
 *  - `blur`      resolves from a 10px blur
 *  - `slide-x`   travels in horizontally
 *
 * Children are revealed individually when `stagger` is greater than zero; each
 * direct child animates in sequence. Descendants can opt into the same
 * treatment by adding `data-reveal` — useful when a card contains a heading
 * and body that should not move as one rigid block.
 *
 * @example
 * <Reveal variant="mask" as="section">
 *   <h2 data-reveal>India &amp; Nepal</h2>
 * </Reveal>
 */
export type RevealVariant = "fade-up" | "mask" | "scale" | "blur" | "slide-x";

export interface RevealProps {
  children: ReactNode;
  /** Element or component to render. Defaults to `div`. */
  as?: ElementType;
  className?: string;
  variant?: RevealVariant;
  /** Duration of the tween in seconds. */
  duration?: number;
  /** Delay between successive children, in seconds. */
  stagger?: number;
  /** Extra delay before the reveal starts, in seconds. */
  delay?: number;
  /** ScrollTrigger start position. Defaults to "top 85%". */
  start?: string;
  /** GSAP ease. Defaults to the house `expo` curve. */
  ease?: string;
  /** Replay the animation when scrolling back up. */
  replay?: boolean;
  /** Animate only when the element first enters the viewport. Default true. */
  once?: boolean;
  /** Distance travelled in pixels for the `fade-up` / `blur` / `slide-x` variants. */
  distance?: number;
}

const VARIANT_FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { y: 28, opacity: 0 },
  mask: { clipPath: "inset(0% 0% 100% 0%)", y: 14 },
  scale: { scale: 0.92, opacity: 0 },
  blur: { filter: "blur(10px)", opacity: 0, y: 18 },
  "slide-x": { x: -36, opacity: 0 },
};


export default function Reveal({
  children,
  as: Tag = "div",
  className,
  variant = "fade-up",
  duration = DURATION.base,
  stagger = 0,
  delay = 0,
  start = "top 85%",
  ease = EASE.expo,
  replay = false,
  once = true,
  distance = 28,
}: RevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const from = { ...VARIANT_FROM[variant] };
      const shouldPlayOnce = replay ? false : once;

      // `fade-up`, `blur` and `slide-x` share a distance token.
      if (variant === "fade-up") from.y = distance;
      if (variant === "blur") from.y = distance * 0.65;
      if (variant === "slide-x") from.x = -distance * 1.3;

      // Explicitly marked descendants take precedence; otherwise stagger direct
      // children only when requested, or reveal the container as a whole.
      const marked = gsap.utils.toArray<HTMLElement>("[data-reveal]", container);
      const direct = gsap.utils.toArray<HTMLElement>(":scope > *", container);
      const targets = marked.length > 0
        ? marked
        : stagger > 0 && direct.length > 0
          ? direct
          : [container];

      // `fromTo` with `immediateRender: false` keeps the content visible until
      // the reveal actually plays. `gsap.from()` hides it immediately, which
      // leaves the section blank whenever the ticker is throttled.
      const to: gsap.TweenVars = { opacity: 1, duration, delay, ease, immediateRender: false };
      if (variant === "fade-up") to.y = 0;
      if (variant === "blur") {
        to.y = 0;
        to.filter = "blur(0px)";
      }
      if (variant === "scale") to.scale = 1;
      if (variant === "slide-x") to.x = 0;
      if (variant === "mask") {
        to.y = 0;
        to.clipPath = "inset(0% 0% 0% 0%)";
      }
      if (targets.length > 1) to.stagger = stagger;
      to.clearProps = "filter";
      to.scrollTrigger = {
        trigger: container,
        start,
        once: shouldPlayOnce,
        toggleActions: shouldPlayOnce ? "play none none none" : "play none none reverse",
      };

      gsap.fromTo(targets, from, to);
    }, container);

    return () => ctx.revert();
  }, [variant, duration, stagger, delay, start, ease, once, replay, distance]);

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}
