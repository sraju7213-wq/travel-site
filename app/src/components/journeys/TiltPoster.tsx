"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

interface TiltPosterProps {
  children?: React.ReactNode;
  className?: string;
  /** "strong" keeps the card flat; "soft" lifts it a little on hover. */
  strength?: "soft" | "strong";
}

/**
 * TiltPoster
 * ----------
 * The reelipse.com poster hover: the card rotates toward the pointer with a
 * real 3D perspective, lifts slightly and picks up a spotlight that follows
 * the cursor via the `--gx` / `--gy` custom properties.
 *
 * Implemented with a single delegated pointer listener (the same approach
 * reelipse uses) so dozens of cards cost one listener, not dozens.
 */
export default function TiltPoster({ children, className = "", strength = "soft" }: TiltPosterProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    let current: HTMLElement | null = null;
    let queued = false;
    let pending: PointerEvent | null = null;

    const reset = (element: HTMLElement) => {
      element.classList.remove("is-hot");
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "expo.out",
      });
    };

    const apply = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-tilt]") ?? null;

      if (element !== current) {
        if (current) reset(current);
        current = element;
      }
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const sx = (event.clientX - rect.left) / rect.width - 0.5;
      const sy = (event.clientY - rect.top) / rect.height - 0.5;

      element.classList.add("is-hot");
      element.style.setProperty("--gx", `${((sx + 0.5) * 100).toFixed(1)}%`);
      element.style.setProperty("--gy", `${((sy + 0.5) * 100).toFixed(1)}%`);

      const amount = strength === "strong" ? 10 : 14;

      gsap.to(element, {
        rotateY: sx * amount,
        rotateX: -sy * amount,
        y: strength === "strong" ? 0 : -6,
        scale: strength === "strong" ? 1.015 : 1.03,
        transformPerspective: 800,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pending = event;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (pending) apply(pending);
      });
    };

    const onPointerLeave = () => {
      if (current) reset(current);
      current = null;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [strength]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
