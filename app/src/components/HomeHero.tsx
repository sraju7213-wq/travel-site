"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_VIDEOS, HeroVideo } from "@/data/heroVideos";
import type { CmsSection } from "@/types/cms";
import { safeCmsHref } from "@/lib/safeCmsHref";
import HeroVideoShuffler from "@/components/HeroVideoShuffler";
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomeHero({ section }: { section?: CmsSection }) {
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
      // NOTE: the entrance is a `fromTo` with `immediateRender: false` rather
      // than a `gsap.set({opacity: 0})` pre-hide. A pre-hide leaves the hero
      // headline invisible whenever the rAF ticker is throttled — a background
      // tab, a slow phone, a dropped frame — and the copy never comes back.
      // With `fromTo` the content is visible by default and only animates if
      // the ticker actually runs.
      const tl = gsap.timeline({ delay: 0.15 });
      targets.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            immediateRender: false,
            willChange: "transform, opacity",
          },
          i * 0.12,
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
          // Only take over once the visitor has actually started scrolling, so
          // the entrance animation is never interrupted at rest.
          if (prog <= 0.001) return;
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

  const backgroundType = section?.backgroundType ?? "video";
  const heroImages = [...(section?.images ?? [])].filter((image) => image.visible !== false && image.url).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const heroImage = section?.image || section?.backgroundImage || heroImages[0]?.url || "";
  const heroVideos = Array.isArray(section?.videos) ? section.videos as HeroVideo[] : undefined;
  const showImage = backgroundType !== "color" && (backgroundType === "image" || Boolean(heroImage));
  const showVideo = !showImage && backgroundType !== "color";
  const textAlign = section?.textAlign === "center" ? "text-center" : section?.textAlign === "right" ? "text-right" : "text-left";
  const focalPoint = `${((section?.focalPoint?.x ?? 0.5) * 100).toFixed(0)}% ${((section?.focalPoint?.y ?? 0.5) * 100).toFixed(0)}%`;
  const backgroundPosition = section?.backgroundPosition || focalPoint;

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden section-hero ${textAlign}`}
      style={{ minHeight: section?.height || undefined, backgroundColor: section?.backgroundColor || undefined }}
      aria-label={section?.imageAlt || `${section?.heading ?? "India Nepal Travel Center"} homepage hero`}
    >
      {/* CMS-controlled image or existing CMS-video experience */}
      {showImage && heroImage ? (
        <img src={heroImage} alt={section?.imageAlt ?? heroImages[0]?.alt ?? section?.heading ?? ""} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focalPoint, backgroundPosition }} />
      ) : showVideo ? <HeroVideoShuffler onVideoChange={handleVideoChange} videos={heroVideos} /> : null}
      {section?.overlay !== undefined ? <div aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: section.overlay }} /> : null}
      {/* Centered Composition: Title + Discover Button */}
      <div
        ref={contentRef}
        className={`relative z-20 w-full flex flex-col items-center justify-center ${textAlign} px-4 max-w-7xl mx-auto pt-16 md:pt-20 pb-8 md:pb-12`}
      >
        {/* Main Title with 'Welcome to' */}
        <div className="mb-5 sm:mb-9 text-center w-full">
          <span
            ref={kickerRef}
            className="font-serif italic font-light text-lg sm:text-2xl md:text-3xl text-white/75 tracking-wide mb-1.5 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
          >
            {section?.eyebrow ?? "Welcome to"}
          </span>
          <h1
            ref={titleRef}
            className="hero-title text-white font-serif font-light drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]"
          >
            {section?.heading ?? <><span className="block">India Nepal</span><span className="block">Travel Center</span></>}
          </h1>
          {section?.subheading && <p className="mx-auto mt-3 max-w-3xl text-base font-serif text-white/80 sm:text-xl">{section.subheading}</p>}
          {section?.description && <p className="mx-auto mt-3 max-w-3xl text-sm font-sans text-white/70">{section.description}</p>}
        </div>

        {/* Horizontal Line with Centered Discover Button directly beneath title */}
        <div className="w-full flex items-center justify-center px-2 sm:px-8 md:px-16">
          {/* Left Line */}
          <div className="relative h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40">
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

            {section?.ctaPrimary?.visible === false ? null : <Link
              ref={buttonRef}
              href={safeCmsHref(section?.ctaPrimary?.href ?? "/journeys")}
              target={section?.ctaPrimary?.target === "_blank" ? "_blank" : undefined}
              rel={section?.ctaPrimary?.target === "_blank" ? "noopener noreferrer" : undefined}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                transition: magneticOffset.x === 0 ? "transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)" : "none",
              }}
              aria-label={section?.ctaPrimary?.label ?? "Discover more — open the journeys page"}
              className="group flex h-[90px] w-[90px] shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/50 bg-black/45 backdrop-blur-md text-white transition-colors duration-500 ease-out hover:scale-105 hover:border-blue-500 hover:bg-blue-500 hover:shadow-[0_0_35px_rgba(59,130,246,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
            >
              <span className="font-accent text-[0.45rem] sm:text-[0.52rem] md:text-[0.58rem] font-semibold uppercase leading-none tracking-[0.16em] sm:tracking-[0.22em] text-white/90 transition-colors group-hover:text-white">
                {section?.ctaPrimary?.label ?? "Discover"}
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
            </Link>}
          </div>
          {/* Right Line */}
          <div className="relative h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40">
            {/* Location & Experience Info — Text only, below right-side line */}
            {showVideo && <div
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
            </div>}
          </div>
        </div>
        {section?.ctaSecondary?.visible !== false && section?.ctaSecondary?.label && <Link href={safeCmsHref(section.ctaSecondary.href)} target={section.ctaSecondary.target === "_blank" ? "_blank" : undefined} rel={section.ctaSecondary.target === "_blank" ? "noopener noreferrer" : undefined} className="mt-4 inline-flex min-h-11 items-center rounded-button border border-white/35 px-5 py-2 text-sm">{section.ctaSecondary.label}</Link>}
      </div>
    </section>
  );
}