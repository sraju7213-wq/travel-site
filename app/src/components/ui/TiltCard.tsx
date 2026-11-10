"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * TiltCard
 * --------
 * A subtle 3D tilt that follows the pointer, plus a light sweep across the
 * surface. Used for the destination and experience cards so photographs feel
 * like they sit behind glass rather than on the page.
 *
 * The tilt is capped at a few degrees — enough to read as depth, not enough to
 * look gimmicky or to make the card feel like it is about to fall over.
 *
 * @example
 * <TiltCard className="overflow-hidden rounded-xl">
 *   <PhotoFrame ... />
 * </TiltCard>
 */
export interface TiltCardProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Maximum tilt in degrees on each axis. */
  maxTilt?: number;
  /** How much the surface lifts toward the viewer on hover, as a scale. */
  hoverScale?: number;
  /** Draw a soft highlight that follows the pointer. */
  spotlight?: boolean;
}

export default function TiltCard({
  children,
  as: Tag = "div",
  className = "",
  maxTilt = 5,
  hoverScale = 1.012,
  spotlight = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return undefined;

    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
      const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
      const scaleTo = gsap.quickTo(card, "scale", { duration: 0.6, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;

        rotateXTo((0.5 - py) * maxTilt * 2);
        rotateYTo((px - 0.5) * maxTilt * 2);
        scaleTo(hoverScale);

        if (glow) {
          gsap.set(glow, {
            "--mx": `${px * 100}%`,
            "--my": `${py * 100}%`,
            opacity: 1,
          });
        }
      };

      const onEnter = () => {
        scaleTo(hoverScale);
        if (glow) gsap.to(glow, { opacity: 1, duration: 0.4 });
      };

      const onLeave = () => {
        rotateXTo(0);
        rotateYTo(0);
        scaleTo(1);
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);

      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      };
    }, card);

    return () => ctx.revert();
  }, [maxTilt, hoverScale, spotlight]);

  return (
    <Tag
      ref={cardRef}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", perspective: "1100px" }}
    >
      {children}
      {spotlight && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.14), transparent 68%)",
          }}
        />
      )}
    </Tag>
  );
}
