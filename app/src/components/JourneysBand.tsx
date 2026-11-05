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
      className="relative isolate flex min-h-[420px] items-center overflow-hidden section-journeys md:min-h-[500px]"
    >
      {/* Parallax Image Container */}
      <div
        ref={imageWrapperRef}
        className="absolute -top-[15%] left-0 h-[130%] w-full will-change-transform"
      >
        <Image
          src="/images/destinations/indian-rhino-forest.jpg"
          alt="Indian rhinoceros grazing in a lush forest landscape"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[center_65%]"
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

<div className="relative z-10 mx-auto w-full max-w-[1100px] px-4 py-16 md:px-8 md:py-20">
        <div ref={textRef} className="max-w-2xl">
          <p className="subtitle-large mb-4 text-brass font-accent">Private &amp; Custom Expeditions</p>
          <h2 className="text-h2 mb-5 text-white font-serif font-light leading-tight">
            Tailor-Made Itineraries For Every Traveller
          </h2>
          <p className="font-serif italic font-light text-xl md:text-2xl text-brass-soft/90 mb-4 leading-relaxed">
            &ldquo;Untamed scenery, ancient cultures and private wildlife explorations waiting to be uncovered.&rdquo;
          </p>
          <p className="mb-6 font-sans font-light text-xs sm:text-sm leading-relaxed text-white/80">
            Every journey can be custom-tailored to suit your dates, private party and personal pace across the subcontinent.
          </p>
          <Link
            href="/explore"
            className="btn-ghost-dark group inline-flex items-center gap-2 hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] transition-all"
          >
            <span>Explore our journeys</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
