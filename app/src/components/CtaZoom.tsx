"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** 
 * Wilderness Destinations CtaZoomModule recreation:
 * Full-height closing call to action with a smooth scroll-driven image zoom
 * and floating monogram watermark.
 */
export default function CtaZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current;
      if (!trigger) return;

      // 1. Scroll-driven zoom effect on the background image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.25 },
          {
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

      // 2. Parallax floating effect on the giant watermark monogram
      if (watermarkRef.current) {
        gsap.fromTo(
          watermarkRef.current,
          { scale: 0.9, yPercent: -10, opacity: 0.15 },
          {
            scale: 1.08,
            yPercent: 10,
            opacity: 0.28,
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

      // 3. Staggered text entrance
      if (textRef.current) {
        const textElements = textRef.current.children;
        gsap.fromTo(
          textElements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.14,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 70%",
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
      className="relative isolate flex min-h-[440px] items-center justify-center overflow-hidden section-cta md:min-h-[520px]"
    >
      {/* Zooming background image wrapper */}
      <div
        ref={imageRef}
        className="absolute inset-0 h-full w-full will-change-transform"
      >
        <Image
          src="/images/destinations/kashmir-shikara.jpg"
          alt="A shikara boat carrying flowers across Dal Lake in Kashmir"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"
      />

      {/* Floating Monogram Watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          ref={watermarkRef}
          className="watermark-outline select-none font-serif text-[32vw] font-bold leading-none tracking-[0.1em] will-change-transform"
        >
          IN
        </span>
      </div>

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center md:px-8 md:py-20"
      >
        <p className="subtitle-large mb-4 text-brass-soft font-accent">Plan Your Expedition</p>
        <h2 className="text-h2 mb-5 text-white font-serif font-light leading-tight">
          Enquire About a Tailor-Made Journey
        </h2>
        <p className="font-serif italic font-light text-xl md:text-2xl text-white/95 mb-3 leading-relaxed">
          &ldquo;Tell us your travel season, group size and preferred regions &mdash; we will curate your bespoke itinerary.&rdquo;
        </p>
        <p className="mb-8 font-sans font-light text-xs sm:text-sm leading-relaxed text-white/70">
          Direct regional arrangements across India and Nepal since 1927.
        </p>
        <div>
          <Link
            href="/enquiry"
            className="group btn-ghost-dark inline-flex items-center gap-2 hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] hover:shadow-[0_0_25px_rgba(255,110,0,0.35)] transition-all duration-300"
          >
            <span>Enquire now</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
