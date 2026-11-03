"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
const HeroVideoShuffler = dynamic(() => import("@/components/HeroVideoShuffler"), {
  ssr: false,
  loading: () => null,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  // Magnetic hover effect on the circular Discover button
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;
    setMagneticOffset({ x: deltaX, y: deltaY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  const handleDiscoverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("discover") || document.getElementById("heritage-details");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hero entrance animation & scroll-driven parallax fade
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const targets = [kickerRef.current, titleRef.current, buttonRef.current].filter(
      Boolean,
    ) as HTMLElement[];

    targets.forEach((el) => {
      el.style.willChange = "opacity, transform";
    });

    const ctx = gsap.context(() => {
      // 1. Entrance animation
      gsap.fromTo(
        targets,
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.18,
          onComplete: () => {
            targets.forEach((el) => {
              el.style.willChange = "auto";
            });
          },
        },
      );

      // 2. Scroll-driven parallax fade-out (Wilderness Destinations style)
      if (contentRef.current && sectionRef.current) {
        gsap.to(contentRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 30%",
            scrub: 0.8,
          },
          y: -90,
          opacity: 0.15,
          scale: 0.96,
          ease: "none",
        });
      }
    }, sectionRef);

    return () => {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      });
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-end overflow-hidden bg-black"
      aria-label="India and Nepal — specialist travel since 1927"
    >
      {/* 5-Second Seamless Non-Repeating Shuffled Video Experience with Right-Side Place Details */}
      <HeroVideoShuffler />

      {/* Centered Composition: Title + Discover Button pinned above bottom */}
      <div
        ref={contentRef}
        className="relative z-20 w-full flex flex-col items-center justify-end text-center px-4 max-w-7xl mx-auto pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] sm:pb-12 md:pb-16"
      >
        {/* Main Title with 'Welcome to' */}
        <div className="mb-5 sm:mb-9 text-center">
          <span
            ref={kickerRef}
            className="font-serif italic font-light text-lg sm:text-2xl md:text-3xl text-white/75 tracking-wide mb-1.5 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            Welcome to
          </span>
          <h1
            ref={titleRef}
            className="hero-title text-white font-serif font-light drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            India &amp; Nepal
          </h1>
        </div>

        {/* Horizontal Line with Centered Discover Button directly beneath title */}
        <div className="w-full flex items-center justify-center px-2 sm:px-8 md:px-16">
          {/* Left Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40" />

          {/* Centered Discover Button with magnetic cursor pull & subtle pulse */}
          <div className="relative mx-3 sm:mx-6 shrink-0 flex items-center justify-center">
            {/* Subtle background pulse ring */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-[106px] w-[106px] rounded-full border border-[var(--color-wild-orange,#ff6e00)]/40 animate-ping opacity-25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-[116px] w-[116px] rounded-full border border-white/10"
            />

            <Link
              ref={buttonRef}
              href="#discover"
              onClick={handleDiscoverClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                transition: magneticOffset.x === 0 ? "transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)" : "none",
              }}
              aria-label="Discover more — scroll to heritage details"
              className="group flex h-[90px] w-[90px] shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/50 bg-black/45 backdrop-blur-md text-white transition-colors duration-500 ease-out hover:scale-105 hover:border-[var(--color-wild-orange,#ff6e00)] hover:bg-[var(--color-wild-orange,#ff6e00)] hover:shadow-[0_0_35px_rgba(255,110,0,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange,#ff6e00)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            >
              <span className="font-accent text-[0.55rem] sm:text-[0.65rem] md:text-[0.7rem] font-semibold uppercase leading-none tracking-[0.18em] sm:tracking-[0.26em] text-white/90 transition-colors group-hover:text-white">
                Discover
              </span>
              <svg
                aria-hidden="true"
                className="mt-1 h-3.5 w-3.5 text-white/70 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          {/* Right Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40" />
        </div>
      </div>
    </section>
  );
}
