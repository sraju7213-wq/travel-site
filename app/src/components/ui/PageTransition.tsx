"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PageTransition
 * --------------
 * The "page open" animation.
 *
 * Mounted from `app/template.tsx`, which Next.js remounts on every navigation,
 * so this component is the natural place to stage a fresh page entrance:
 *
 *  1. A brand-coloured curtain sweeps down over the viewport and lifts away,
 *     masking the swap between the outgoing and incoming route.
 *  2. The incoming content settles into place beneath it.
 *  3. ScrollTrigger is refreshed once the curtain has cleared, so any
 *     scroll-linked animation on the new page measures the correct geometry
 *     rather than the pre-transition layout.
 *
 * IMPORTANT — the animation is CSS-driven, not GSAP-driven, and the content is
 * never hidden. A JS timeline that has to run before the page becomes visible
 * is a single point of failure: if the requestAnimationFrame ticker is
 * throttled (a background tab, a slow phone, a dropped frame) the page stays
 * blank. The curtain is decorative and starts hidden, so the worst case is a
 * missing flourish, not a missing page.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Refresh triggers once the curtain has cleared so scroll-linked
    // animations on the new page measure the settled layout.
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="page-transition-curtain pointer-events-none fixed inset-0 z-[90] bg-[#0C1617]"
      />
      <div ref={contentRef} className="page-transition-content">
        {children}
      </div>
    </>
  );
}
