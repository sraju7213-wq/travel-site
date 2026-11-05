"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_VIDEOS, HeroVideo } from "@/data/heroVideos";
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
  const geoRef = useRef<HTMLDivElement>(null);
  const placeRef = useRef<HTMLDivElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [currentVideo, setCurrentVideo] = useState<HeroVideo>(HERO_VIDEOS[0]);

  const handleVideoChange = useCallback((v: HeroVideo) => {
    setCurrentVideo(v);
  }, []);
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
    const discoverSection = document.getElementById("discover");
    if (discoverSection) {
      discoverSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Hero entrance animation & scroll-driven parallax fade
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets: HTMLElement[] = [];
    if (kickerRef.current) targets.push(kickerRef.current);
    if (titleRef.current) targets.push(titleRef.current);
    if (buttonRef.current) targets.push(buttonRef.current);
    if (geoRef.current) targets.push(geoRef.current);
    if (placeRef.current) targets.push(placeRef.current);
    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 18, willChange: "transform, opacity" });
      });

      const tl = gsap.timeline({ delay: 0.15 });
      targets.forEach((el, i) => {
        tl.to(
          el,
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          i * 0.12
        );
      });

      // Scroll-driven fade out when leaving hero
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const prog = Math.min(Math.max(self.progress, 0), 1);
          targets.forEach((el) => {
            gsap.set(el, { opacity: 1 - prog * 1.1, y: prog * -30 });
          });
        },
      });
    }, section);

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
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden section-hero"
      aria-label="KS World Adventure — specialist travel since 1927"
    >
      {/* 5-Second Seamless Non-Repeating Shuffled Video Experience */}
      <HeroVideoShuffler onVideoChange={handleVideoChange} />
      {/* Centered Composition: Title + Discover Button */}
      <div
        ref={contentRef}
        className="relative z-20 w-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto pt-16 md:pt-20 pb-8 md:pb-12"
      >
        {/* Main Title with 'Welcome to' */}
        <div className="mb-5 sm:mb-9 text-center w-full">
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
            <span className="block">KS World</span>
            <span className="block">Adventure</span>
          </h1>
        </div>

        {/* Horizontal Line with Centered Discover Button directly beneath title */}
        <div className="w-full flex items-center justify-center px-2 sm:px-8 md:px-16">
          {/* Left Line */}
          <div className="relative h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40">
            {/* Geo Location Codes & Information — Text only, below left-side line */}
            <div
              ref={geoRef}
              className="hidden sm:block absolute top-3.5 left-2 md:left-4 text-left pointer-events-none max-w-[280px]"
            >
              <div className="flex items-center justify-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse shrink-0" />
                <span className="font-accent text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-soft drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Geo Coordinates
                </span>
              </div>
              <p className="mt-1 font-mono text-sm sm:text-base font-light tracking-wide text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {currentVideo.coordinates}
              </p>
              <p className="mt-0.5 font-sans text-xs sm:text-sm font-light text-white/75 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {currentVideo.location} &bull; {currentVideo.altitude.split("/")[0].trim()}
              </p>
            </div>
          </div>

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
              <span className="font-accent text-[0.45rem] sm:text-[0.52rem] md:text-[0.58rem] font-semibold uppercase leading-none tracking-[0.16em] sm:tracking-[0.22em] text-white/90 transition-colors group-hover:text-white">
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
          <div className="relative h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40">
            {/* Location & Experience Info — Text only, below right-side line */}
            <div
              ref={placeRef}
              className="hidden sm:block absolute top-3.5 right-2 md:right-4 text-right pointer-events-none max-w-[280px]"
            >
              <div className="flex items-center justify-end gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse shrink-0" />
                <span className="font-accent text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-brass-soft drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  {currentVideo.region}
                </span>
              </div>
              <h2 className="mt-1 font-serif text-sm sm:text-base font-light tracking-wide text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {currentVideo.title}
              </h2>
              <p className="mt-0.5 font-sans text-xs sm:text-sm font-light text-white/75 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {currentVideo.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}