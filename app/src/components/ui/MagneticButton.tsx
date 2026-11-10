"use client";

import { useCallback, useEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * MagneticButton
 * --------------
 * A pointer-reactive wrapper. The element leans toward the cursor while it is
 * nearby and settles back on exit — the interaction that makes an interface
 * feel like it is made of something physical rather than painted on glass.
 *
 * The pull is deliberately subtle (a third of the cursor's offset at most) so
 * the control never drifts away from the pointer and stays easy to hit. The
 * inner `label` moves slightly further than the shell, which produces a
 * parallax between the button's surface and its text.
 *
 * @example
 * <MagneticButton as={Link} href="/explore">
 *   Explore journeys
 * </MagneticButton>
 */
export interface MagneticButtonProps {
  children: ReactNode;
  as?: ElementType;
  href?: string;
  className?: string;
  /** How strongly the element is pulled toward the cursor. 0.4 = subtle. */
  strength?: number;
  /** How far the pointer must be from the element for it to react, in px. */
  radius?: number;
  onClick?: React.MouseEventHandler;
  ariaLabel?: string;
}

export default function MagneticButton({
  children,
  as: Tag = "button",
  href,
  className = "",
  strength = 0.34,
  radius = 90,
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const shellRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const label = labelRef.current;
    if (!shell || !label) return undefined;

    if (prefersReducedMotion()) return undefined;

    const xTo = gsap.quickTo(shell, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(shell, "y", { duration: 0.5, ease: "power3.out" });
    const labelXTo = gsap.quickTo(label, "x", { duration: 0.7, ease: "power3.out" });
    const labelYTo = gsap.quickTo(label, "y", { duration: 0.7, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy);

      // Outside the influence radius the element rests at its origin.
      if (distance > radius + Math.max(rect.width, rect.height) / 2) {
        xTo(0);
        yTo(0);
        labelXTo(0);
        labelYTo(0);
        return;
      }

      const falloff = 1 - Math.min(distance / (radius * 2), 1);
      const pull = strength * falloff;

      xTo(dx * pull);
      yTo(dy * pull);
      labelXTo(dx * pull * 0.45);
      labelYTo(dy * pull * 0.45);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      labelXTo(0);
      labelYTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([shell, label]);
    };
  }, [strength, radius]);

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      onClick?.(event);
    },
    [onClick]
  );

  return (
    <Tag
      ref={shellRef}
      href={href}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`will-change-transform ${className}`}
    >
      <span ref={labelRef} className="inline-flex will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
