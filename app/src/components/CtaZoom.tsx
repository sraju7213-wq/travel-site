"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** 
 * Wilderness Destinations CtaZoomModule recreation:
 * Full-height closing call to action with a smooth scroll-driven image zoom
 * and floating monogram watermark.
 */
interface CtaZoomProps {
  image?: string;
  imageAlt?: string;
  eyebrow?: string;
  /** Heading. Supports a line break between the two halves. */
  title?: React.ReactNode;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sectionClassName?: string;
  contentClassName?: string;
}

export default function CtaZoom({
  image = "/images/destinations/kashmir-shikara.jpg",
  imageAlt = "A shikara boat carrying flowers across Dal Lake in Kashmir",
  eyebrow = "Plan your journey",
  title = (
    <>
      India &amp; Nepal,<br className="hidden sm:block" /> your way.
    </>
  ),
  body = "Tell us what you want to discover. We’ll help shape the journey.",
  ctaLabel = "Enquire now",
  ctaHref = "/enquiry",
  sectionClassName = "",
  contentClassName = "",
}: CtaZoomProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

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

      // 2. Staggered text entrance
      if (textRef.current) {
        const textElements = textRef.current.children;
        gsap.fromTo(
          textElements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: DURATION.slow,
            ease: EASE.expo,
            immediateRender: false,
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
      className={`relative isolate flex min-h-[380px] items-center justify-center overflow-hidden section-cta md:min-h-[440px] ${sectionClassName}`}
    >
      {/* Zooming background image wrapper */}
      <div
        ref={imageRef}
        className="absolute inset-0 h-full w-full will-change-transform group/cta-photo"
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,19,0.56)_0%,rgba(7,18,19,0.16)_50%,rgba(7,18,19,0.46)_100%),linear-gradient(0deg,rgba(0,0,0,0.66)_0%,rgba(0,0,0,0.12)_62%,rgba(7,18,19,0.18)_100%)]"
      />

      {/* Content */}
      <div
        ref={textRef}
        className={`relative z-10 mx-auto max-w-2xl px-5 py-14 text-center md:px-8 md:py-16 ${contentClassName}`}
      >
        <p className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-wild-orange)]">{eyebrow}</p>
        <h2 className="mb-4 font-serif text-4xl font-light leading-[1.08] tracking-normal text-white sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mb-7 max-w-md font-sans text-sm leading-relaxed text-white/75">
          {body}
        </p>
        <div>
          <Link
            href={ctaHref}
            className="enquire-fill group inline-flex min-h-[44px] items-center gap-4 px-6 py-3.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#123438]"
          >
            <span>{ctaLabel}</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
