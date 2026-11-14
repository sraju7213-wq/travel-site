"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
 *  2. The incoming content rises into place beneath it.
 *  3. ScrollTrigger is refreshed once the curtain has cleared, so any
 *     scroll-linked animation on the new page measures the correct geometry
 *     rather than the pre-transition layout.
 *
 * The curtain is purely decorative and hidden from assistive technology.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    const content = contentRef.current;

    if (prefersReducedMotion()) {
      // Still refresh triggers — the page must behave identically.
      ScrollTrigger.refresh();
      return undefined;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.inOut },
        onComplete: () => ScrollTrigger.refresh(),
      });

      if (curtain) {
        tl.set(curtain, { scaleY: 0, transformOrigin: "top center" })
          .to(curtain, {
            scaleY: 1,
            duration: 0.42,
            ease: "power3.in",
          })
          .to(curtain, {
            scaleY: 0,
            transformOrigin: "bottom center",
            duration: 0.62,
            ease: "power4.out",
          });
      }

      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, ease: EASE.expo },
          curtain ? "-=0.34" : 0
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] origin-top scale-y-0 bg-[#0C1617]"
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
}
