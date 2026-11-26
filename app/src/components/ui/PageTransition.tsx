"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PageTransition
 * --------------
 * Mounted from `app/template.tsx`, which Next.js remounts on every navigation.
 *
 * The old full-screen curtain swept for over a second and made every route
 * change feel heavy. The modern treatment is a short, subtle lift of the
 * incoming content — no hiding layer, no staged reveal. Content is visible
 * immediately and the animation is CSS-driven, so a throttled rAF ticker can
 * only cost the flourish, never the page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh scroll-linked triggers after the settle so they measure the
    // final layout. 240ms matches the CSS animation below.
    const timer = window.setTimeout(() => {
      // Drop the settle animation once it has played out. A filled-forwards
      // transform — even an identity one — makes this wrapper the containing
      // block for every `position: fixed` descendant (e.g. the mobile filter
      // drawer), pinning them to the page instead of the viewport.
      if (contentRef.current) contentRef.current.style.animation = "none";
      ScrollTrigger.refresh();
    }, 240);
    return () => window.clearTimeout(timer);
  }, []);

  return <div ref={contentRef} className="page-transition-content">{children}</div>;
}
