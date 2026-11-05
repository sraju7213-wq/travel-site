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
 * Editorial block matching Wilderness Destinations TextPlusTwoImageModule
 * with opposing dual-image scroll parallax.
 */
export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = sectionRef.current;
      if (!trigger) return;

      // Image 1 shifts up as you scroll down
      if (img1Ref.current) {
        gsap.fromTo(
          img1Ref.current,
          { y: 25 },
          {
            y: -25,
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

      // Image 2 shifts down as you scroll down (opposing parallax)
      if (img2Ref.current) {
        gsap.fromTo(
          img2Ref.current,
          { y: -20 },
          {
            y: 30,
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

      // Text reveal
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
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
    <section ref={sectionRef} className="section-impact py-16 md:py-24" id="impact">
<div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
          {/* Dual-image with opposing scroll parallax — moved right of the copy on desktop */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:order-2">
            <div
              ref={img1Ref}
              className="relative aspect-[4/5] max-h-[360px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.03] will-change-transform"
            >
              <Image
                src="/images/destinations/jodhpur-fort.jpg"
                alt="Jodhpur blue city and Mehrangarh Fort"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
            <div
              ref={img2Ref}
              className="relative mt-8 aspect-[4/5] max-h-[360px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.03] will-change-transform"
            >
              <Image
                src="/images/destinations/nepal-collage.jpg"
                alt="A montage of Nepalese temples, prayer flags and mountain landscapes"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Editorial content — first in the visual order on desktop */}
          <div ref={textRef} className="lg:order-1">
            <p className="subtitle-large mb-4 text-brass font-accent">Curated Regional Programmes</p>
            <h2 className="text-h2 mb-5 text-white font-serif font-light leading-tight">
              Special-Interest &amp; Student Expeditions
            </h2>
            <p className="font-serif italic font-light text-xl md:text-2xl leading-relaxed text-brass-soft/90 mb-4">
              &ldquo;Escorted specialist journeys for clubs, botanical groups, yoga retreats, and academic institutions across India and Nepal.&rdquo;
            </p>
            <p className="mb-8 font-sans font-light text-base leading-relaxed text-white/75">
              All special-interest programmes are escorted by qualified team leaders. Every itinerary is drawn directly from our brochure archives and shaped with meticulous care around your travel season, party size and regional interests.
            </p>
            <Link
              href="/about"
              className="btn-ghost-dark group inline-flex items-center gap-2 hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] transition-all"
            >
              <span>Read about us</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
