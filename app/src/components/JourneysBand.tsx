"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Full-bleed journeys band with Wilderness Destinations scroll-driven parallax */
export default function JourneysBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current;
      if (!trigger) return;

      if (imageWrapperRef.current) {
        // Parallax image scrub
        gsap.fromTo(
          imageWrapperRef.current,
          { yPercent: -12, scale: 1.12 },
          {
            yPercent: 12,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }

      if (textRef.current) {
        // Subtle text reveal
        gsap.fromTo(
          textRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 75%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[420px] sm:min-h-[480px] md:min-h-[540px] lg:min-h-[600px] items-center overflow-hidden section-journeys"
    >
      {/* Parallax Image Container */}
      <div
        ref={imageWrapperRef}
        className="absolute -top-[20%] left-0 h-[140%] w-full will-change-transform"
      >
        <Image
          src="/images/destinations/indian-rhino-forest.jpg"
          alt="Indian rhinoceros grazing in a lush forest landscape"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 py-16 md:px-8 md:py-24">
        <div ref={textRef} className="max-w-2xl">
          <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-brass">
            Private journeys, thoughtfully made
          </p>
          <h2 className="mb-3 font-display text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            The wild, on your terms.
          </h2>
          <p className="mb-6 max-w-lg font-sans text-sm leading-relaxed text-white/80 md:text-base">
            Wild places. Deeper encounters. A journey shaped around you.
          </p>
          <Link
            href="/explore"
            className="btn-ghost-dark group inline-flex items-center gap-2 hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] transition-all"
          >
            <span>Plan your journey</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
