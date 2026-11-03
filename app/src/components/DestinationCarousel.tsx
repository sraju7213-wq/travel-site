"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DESTINATIONS } from "@/data/siteContent";

/**
 * Our Luxury Safari Destinations
 * Faithful recreation of the Wilderness Destinations (https://www.wildernessdestinations.com/)
 * safari country hero slider with warm safari sand palette, giant watermark typography,
 * cinematic full-bleed central destination card, 3D card tilt, and smooth scroll/slide transitions.
 */
export default function DestinationCarousel() {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const touchStartX = useRef<number | null>(null);

  const total = DESTINATIONS.length;
  const current = DESTINATIONS[active];
  const prevIndex = (active - 1 + total) % total;
  const nextIndex = (active + 1) % total;
  const prevDest = DESTINATIONS[prevIndex];
  const nextDest = DESTINATIONS[nextIndex];

  const goTo = useCallback(
    (index: number) => {
      if (index === active || isAnimating) return;
      setIsAnimating(true);
      setActive(index);
      setTimeout(() => setIsAnimating(false), 600);
    },
    [active, isAnimating]
  );

  const prev = useCallback(() => {
    goTo(prevIndex);
  }, [goTo, prevIndex]);

  const next = useCallback(() => {
    goTo(nextIndex);
  }, [goTo, nextIndex]);

  // Subtle scroll parallax effect on the watermark typography
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    touchStartX.current = null;
  };

  // Subtle 3D tilt on card hover
  const handleCardMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardTilt({
      rx: -(y / (rect.height / 2)) * 4,
      ry: (x / (rect.width / 2)) * 4,
    });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ rx: 0, ry: 0 });
  };

  const parallaxOffset = (scrollY * 0.04) % 40;

  return (
    <section
      ref={sectionRef}
      id="destinations"
      aria-label="Our Luxury Safari Destinations"
      className="relative overflow-hidden bg-[#a58f79] py-16 md:py-24 select-none transition-colors duration-700"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Ghosted Background Typography Parallax (Left & Right Watermarks) */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-6 md:px-12 overflow-hidden z-0"
        aria-hidden="true"
      >
        {/* Left Ghost Text (Previous destination) */}
        <button
          type="button"
          tabIndex={-1}
          onClick={prev}
          style={{ transform: `translateX(-${parallaxOffset}px)` }}
          className="pointer-events-auto cursor-pointer font-serif text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] xl:text-[14rem] font-light leading-none tracking-[0.2em] uppercase text-white/20 hover:text-white/35 transition-all duration-700 opacity-60 hover:opacity-100 max-w-[28vw] break-words text-left"
        >
          {prevDest.name.slice(0, 5)}
        </button>

        {/* Right Ghost Text (Next destination) */}
        <button
          type="button"
          tabIndex={-1}
          onClick={next}
          style={{ transform: `translateX(${parallaxOffset}px)` }}
          className="pointer-events-auto cursor-pointer font-serif text-[4.5rem] sm:text-[7rem] md:text-[9rem] lg:text-[12rem] xl:text-[14rem] font-light leading-none tracking-[0.2em] uppercase text-white/20 hover:text-white/35 transition-all duration-700 opacity-60 hover:opacity-100 max-w-[28vw] break-words text-right"
        >
          {nextDest.name.slice(0, 5)}
        </button>
      </div>

      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-6 md:px-8">
        {/* 2. Top Navigation Tabs Bar */}
        <nav
          aria-label="Destination regions"
          className="scrollbar-hide mb-8 sm:mb-12 flex items-center justify-start sm:justify-center gap-x-5 sm:gap-x-8 md:gap-x-10 overflow-x-auto pb-3 border-b border-white/20"
        >
          {DESTINATIONS.map((d, i) => {
            const isActive = active === i;
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => goTo(i)}
                className={`relative shrink-0 pb-3 text-[11px] sm:text-xs font-accent uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "font-bold text-white scale-105"
                    : "font-normal text-white/60 hover:text-white"
                }`}
              >
                {d.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Center Hero Destination Card with 3D tilt */}
        <div className="relative mx-auto w-full max-w-[1020px]">
          <Link
            ref={cardRef}
            href={current.href}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
              transition: cardTilt.rx === 0 ? "transform 0.6s ease-out" : "none",
            }}
            aria-label={`Explore ${current.name} destination`}
            className="group block relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[2.1/1] w-full overflow-hidden shadow-2xl transition-all duration-700 will-change-transform"
          >
            {/* Active Image with smooth crossfade & scale */}
            {DESTINATIONS.map((dest, i) => (
              <div
                key={dest.name}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  active === i ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={dest.image}
                  alt={`${dest.name} — ${dest.tagline}`}
                  fill
                  priority={i === active}
                  sizes="(min-width: 1200px) 1020px, 95vw"
                  className={`object-cover transition-transform duration-1000 ease-out ${
                    active === i ? "scale-100 group-hover:scale-105" : "scale-105"
                  }`}
                />
              </div>
            ))}

            {/* Subtle cinematic vignette */}
            <div
              className="absolute inset-0 z-20 bg-black/25 transition-opacity duration-500 group-hover:bg-black/35"
              aria-hidden="true"
            />

            {/* Giant Centered Serif Country Name */}
            <div className="absolute inset-0 z-30 flex items-center justify-center p-6 text-center">
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light uppercase tracking-[0.28em] text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-700 transform group-hover:scale-[1.02]">
                {current.name}
              </h2>
            </div>
          </Link>

          {/* 4. Bottom Info & Action Bar */}
          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left: Editorial blurb */}
            <div className="max-w-xl">
              <p
                key={current.name}
                className="font-sans font-light text-sm sm:text-base leading-relaxed text-white/95 animate-fadeIn"
              >
                {current.blurb}
              </p>
            </div>

            {/* Right: Thin arrow navigation & bold Wilderness Orange button */}
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              {/* Thin arrow navigation */}
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous destination"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] hover:bg-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next destination"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white hover:border-[var(--color-wild-orange,#ff6e00)] hover:text-[var(--color-wild-orange,#ff6e00)] hover:bg-black/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <svg
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

              {/* Solid Wilderness Orange CTA Button */}
              <Link
                href={current.href}
                className="inline-flex items-center justify-center bg-[var(--color-wild-orange,#ff6e00)] hover:bg-[#e56300] text-white font-accent text-xs font-semibold uppercase tracking-[0.24em] px-8 py-3.5 shadow-md hover:shadow-[0_8px_24px_rgba(255,110,0,0.5)] transition-all duration-300 active:scale-95 cursor-pointer min-w-[140px] text-center"
              >
                {current.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
