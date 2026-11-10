"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SplitText
 * ---------
 * Reveals a headline word-by-word behind a clipping mask — the signature
 * editorial entrance used across the marketing pages.
 *
 * Each word is wrapped in an `overflow:hidden` span and travels up from
 * 100% below the baseline. The mask means the word appears to be wiped into
 * existence rather than simply fading, which is what gives the big serif
 * headings their sense of physical weight.
 *
 * Works with plain strings and with React nodes that contain inline markup
 * (`<span>`, `<em>`, `<br/>`) — the markup is preserved, only the text
 * inside it is split.
 *
 * @example
 * <SplitText as="h1" className="hero-title">
 *   India &amp; <span className="text-white/60">Nepal</span>
 * </SplitText>
 */
export interface SplitTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Words per second is irrelevant — this is the gap between words, in seconds. */
  stagger?: number;
  duration?: number;
  delay?: number;
  start?: string;
  ease?: string;
  /** Animate immediately on mount rather than waiting for scroll. */
  immediate?: boolean;
  /** Play once (default) or on every pass. */
  once?: boolean;
}

export default function SplitText({
  children,
  as: Tag = "span",
  className,
  stagger = 0.055,
  duration = DURATION.slow,
  delay = 0,
  start = "top 88%",
  ease = EASE.expo,
  immediate = false,
  once = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      // Collect the leaf elements that contain visible text, skipping anything
      // already hidden from assistive technology.
      const leaves = Array.from(
        container.querySelectorAll<HTMLElement>("*")
      ).filter((el) => {
        if (el.closest("[aria-hidden='true']")) return false;
        const hasText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.nodeValue ?? "").trim().length > 0
        );
        return hasText;
      });

      // Fall back to the container itself when the content is a bare string.
      const textHosts = leaves.length > 0 ? leaves : [container];

      const words: HTMLElement[] = [];

      textHosts.forEach((host) => {
        const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        let current = walker.nextNode();
        while (current) {
          nodes.push(current as Text);
          current = walker.nextNode();
        }

        nodes.forEach((node) => {
          const value = node.nodeValue ?? "";
          if (!value.trim()) return;

          const fragment = document.createDocumentFragment();
          const pieces = value.split(/(\s+)/);

          pieces.forEach((piece) => {
            if (!piece) return;
            if (!piece.trim()) {
              fragment.appendChild(document.createTextNode(" "));
              return;
            }

            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "bottom";
            // A touch of padding prevents descenders (g, y, p) being clipped.
            mask.style.paddingBottom = "0.12em";
            mask.style.marginBottom = "-0.12em";

            const word = document.createElement("span");
            word.style.display = "inline-block";
            word.style.willChange = "transform";
            word.textContent = piece;

            mask.appendChild(word);
            fragment.appendChild(mask);
            words.push(word);
          });

          node.parentNode?.replaceChild(fragment, node);
        });
      });

      if (words.length === 0) return;

      const trigger = immediate
        ? undefined
        : {
            trigger: container,
            start,
            once,
            toggleActions: once ? ("play none none none" as const) : ("play none none reverse" as const),
          };

      gsap.from(words, {
        yPercent: 118,
        duration,
        delay,
        ease,
        stagger,
        ...(trigger ? { scrollTrigger: trigger } : { delay: delay || 0.2 }),
      });
    }, container);

    return () => ctx.revert();
  }, [stagger, duration, delay, start, ease, immediate, once]);

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  );
}
