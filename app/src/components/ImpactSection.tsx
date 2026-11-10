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
    <section ref={sectionRef} className="section-impact relative overflow-hidden py-20 md:py-28" id="impact">
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 top-0 h-[34rem] w-[34rem] rounded-full border border-white/[0.06]" />
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="relative grid grid-cols-2 items-start gap-4 sm:gap-6 lg:order-2">
            <div
              ref={img1Ref}
              className="group relative mt-10 aspect-[4/5] overflow-hidden bg-charcoal shadow-2xl sm:mt-16"
            >
              <Image
                src="/images/destinations/jodhpur-fort.jpg"
                alt="Jodhpur blue city and Mehrangarh Fort"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 bg-black/45 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">Rajasthan · India</span>
            </div>
            <div
              ref={img2Ref}
              className="group relative aspect-[4/5] overflow-hidden bg-charcoal shadow-2xl"
            >
              <Image
                src="/images/destinations/nepal-collage.jpg"
                alt="A montage of Nepalese temples, prayer flags and mountain landscapes"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute bottom-4 left-4 bg-black/45 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-sm">Nepal · Himalaya</span>
            </div>
            <div aria-hidden="true" className="absolute -bottom-7 left-1/2 z-10 hidden -translate-x-1/2 border border-white/20 bg-[var(--color-section-impact)] px-5 py-3 font-serif text-sm italic text-white/75 sm:block">Journeys with purpose</div>
          </div>

          <div ref={textRef} className="relative lg:order-1">
            <p className="mb-6 flex items-center gap-4 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--color-wild-orange)]"><span className="h-px w-10 bg-[var(--color-wild-orange)]" />Curated regional programmes</p>
            <h2 className="mb-7 max-w-xl font-serif text-4xl font-light leading-[1.08] tracking-normal text-white sm:text-5xl lg:text-[3.65rem]">
              Travel deeper.<br /><span className="text-white/65">Learn along the way.</span>
            </h2>
            <p className="mb-5 max-w-lg font-serif text-xl font-light italic leading-relaxed text-white/85 md:text-2xl">
              Special-interest and student expeditions across India and Nepal.
            </p>
            <p className="mb-9 max-w-lg font-sans text-base font-light leading-7 text-white/65">
              All special-interest programmes are escorted by qualified team leaders. Every itinerary is drawn directly from our brochure archives and shaped with meticulous care around your travel season, party size and regional interests.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-5 border-b border-white/35 pb-3 font-sans text-xs font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)]"
            >
              <span>Discover our approach</span>
              <span aria-hidden="true" className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
