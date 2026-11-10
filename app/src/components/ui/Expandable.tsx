"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";

/**
 * Expandable
 * ----------
 * The house "element opens" animation — used wherever content expands in
 * place: itinerary accordion rows, footer link groups, FAQ entries and the
 * package workspace tabs.
 *
 * Height is measured and animated with GSAP rather than CSS `grid-template-rows`
 * so the easing curve matches the rest of the product, and the content is
 * revealed with a soft fade-and-lift as the panel grows.
 *
 * The trigger keeps full keyboard and screen-reader semantics: `aria-expanded`
 * reflects state and `aria-controls` points at the panel.
 */
export interface ExpandableProps {
  /** Unique id for the panel — used to wire `aria-controls`. */
  panelId: string;
  /** The visible control. */
  trigger: ReactNode;
  /** The content revealed when open. */
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the trigger is activated. */
  onOpenChange?: (open: boolean) => void;
  className?: string;
  panelClassName?: string;
  /** Duration of the expand animation in seconds. */
  duration?: number;
}

export default function Expandable({
  panelId,
  trigger,
  children,
  open,
  onOpenChange,
  className = "",
  panelClassName = "",
  duration = 0.55,
}: ExpandableProps) {
  const isControlled = typeof open === "boolean";
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = isControlled ? Boolean(open) : uncontrolledOpen;

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }, [isOpen, isControlled, onOpenChange]);

  useEffect(() => {
    const panel = panelRef.current;
    const content = contentRef.current;
    if (!panel || !content) return undefined;

    if (prefersReducedMotion()) {
      // Snap to the correct state without animating.
      gsap.set(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      gsap.set(content, { y: isOpen ? 0 : 8 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      if (firstRender.current) {
        // Initial state — no animation on the very first paint.
        gsap.set(panel, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
        gsap.set(content, { y: isOpen ? 0 : 8 });
        firstRender.current = false;
        return;
      }

      const tween = gsap.timeline({
        defaults: { duration, ease: EASE.inOut },
        onComplete: () => {
          // Release the fixed height so long content can reflow freely.
          if (isOpen) gsap.set(panel, { height: "auto" });
        },
      });

      if (isOpen) {
        tween
          .set(panel, { height: 0, opacity: 0 })
          .to(panel, { height: content.scrollHeight, opacity: 1 })
          .to(content, { y: 0, duration: duration * 0.8 }, "<0.1");
      } else {
        tween
          .to(content, { y: 8, duration: duration * 0.6 })
          .to(panel, { height: 0, opacity: 0 }, "<0.15");
      }
    }, panel);

    return () => ctx.revert();
  }, [isOpen, duration]);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full cursor-pointer text-left"
      >
        {trigger}
      </button>

      <div
        id={panelId}
        role="region"
        ref={panelRef}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`overflow-hidden ${panelClassName}`}
        style={{ height: 0, opacity: 0 }}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
}
