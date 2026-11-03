"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { PILLARS, Pillar } from "@/data/siteContent";

/**
 * Handcrafted minimalist SVG icons matching the luxury subcontinent aesthetic
 */
function PillarIcon({ id, className = "h-4 w-4" }: { id: string; className?: string }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    className: `${className} fill-none stroke-current stroke-[1.6] shrink-0`,
  } as const;

  switch (id) {
    case "destinations":
      // Compass / Map pin
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" strokeLinecap="round" />
          <polygon
            points="12 6 15 12 12 18 9 12 12 6"
            fill="currentColor"
            fillOpacity="0.25"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "wildlife":
      // Wildlife tracker / Paw / Nature
      return (
        <svg {...common}>
          <path
            d="M12 13c-2.5 0-4 1.5-4 3.5 0 1.5 1.5 2.5 4 2.5s4-1 4-2.5c0-2-1.5-3.5-4-3.5Z"
            fill="currentColor"
            fillOpacity="0.25"
          />
          <circle cx="7.5" cy="10" r="1.5" />
          <circle cx="16.5" cy="10" r="1.5" />
          <circle cx="10" cy="7" r="1.5" />
          <circle cx="14" cy="7" r="1.5" />
        </svg>
      );
    case "guides":
      // Trekker mountain & summit flag
      return (
        <svg {...common}>
          <path d="m3 20 6-11 4 7 3-5 5 9H3Z" strokeLinejoin="round" />
          <line x1="9" y1="9" x2="9" y2="4" strokeLinecap="round" />
          <path d="M9 4l3 2-3 2" strokeLinejoin="round" />
        </svg>
      );
    case "architecture":
      // Heritage palace arch / pavilion
      return (
        <svg {...common}>
          <path d="M4 21V10l8-6 8 6v11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21v-5a3 3 0 0 1 6 0v5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 4v2" strokeLinecap="round" />
        </svg>
      );
    case "culture":
      // Sacred lotus / radiant tradition
      return (
        <svg {...common}>
          <path
            d="M12 4c1 4 4 6 7 7-3 1-5 4-5 8 0-4-2-7-5-8 3-1 4-4 3-7Z"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.2"
          />
          <path d="M12 12c-2.5 2.5-4 5-4 8 3-1 6-2 8-2 0-3-1.5-5.5-4-6Z" strokeLinejoin="round" />
        </svg>
      );
    case "travel":
      // Seamless route / compass transit
      return (
        <svg {...common}>
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="6" r="3" />
          <path d="M8.5 16.5c3-2 6-4 7-8" strokeLinecap="round" strokeDasharray="2 2" />
          <path d="M9 19h9a2 2 0 0 0 2-2V9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "impact":
      // Community stewardship / leaf & hand
      return (
        <svg {...common}>
          <path
            d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9-4 0-7.5 2.6-8.7 6.5A9 9 0 0 0 12 21Z"
            strokeLinejoin="round"
          />
          <path d="M12 3v18" strokeLinecap="round" />
          <path d="M12 12l5-5" strokeLinecap="round" />
          <path d="M12 16l4-4" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export default function PillarsTabs() {
  const [active, setActive] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabListRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  const total = PILLARS.length;
  const currentPillar: Pillar = PILLARS[active];

  const selectTab = useCallback(
    (index: number, focus = false) => {
      if (index === active) return;
      setIsChanging(true);
      setActive(index);
      setTimeout(() => setIsChanging(false), 350);

      if (focus && tabRefs.current[index]) {
        tabRefs.current[index]?.focus();
      }

      // Ensure tab is scrolled smoothly into view inside container on small screens
      const tabEl = tabRefs.current[index];
      const listEl = tabListRef.current;
      if (tabEl && listEl) {
        const offset = tabEl.offsetLeft - listEl.offsetWidth / 2 + tabEl.offsetWidth / 2;
        listEl.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
      }
    },
    [active]
  );

  const prevPillar = () => {
    const prev = active === 0 ? total - 1 : active - 1;
    selectTab(prev, true);
  };

  const nextPillar = () => {
    const next = active === total - 1 ? 0 : active + 1;
    selectTab(next, true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === total - 1 ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? total - 1 : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;

    if (next === null) return;
    e.preventDefault();
    selectTab(next, true);
  };

  // Subtle interactive 3D perspective tilt on the hero image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = imageCardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setCardTilt({
      rx: -(y / (rect.height / 2)) * 5,
      ry: (x / (rect.width / 2)) * 5,
    });
  };

  const handleMouseLeave = () => {
    setCardTilt({ rx: 0, ry: 0 });
  };

  return (
    <section
      id="why-us"
      aria-label="Why Travel With Us"
      className="relative overflow-hidden bg-[#0A1314] text-white py-18 md:py-28 border-t border-white/10"
    >
      {/* 1. Ambient Lighting & Subtle Radial Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-5xl rounded-full bg-[radial-gradient(ellipse_at_top,rgba(255,110,0,0.12),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-10 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(18,52,56,0.35),transparent_70%)] blur-3xl"
      />

      {/* 2. Faint Watermark Typography matching Destination & Experience Carousels */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 select-none overflow-hidden text-center opacity-[0.03] z-0"
      >
        <span className="font-serif text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] uppercase font-light tracking-[0.2em] leading-none whitespace-nowrap">
          EXPEDITIONS
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange,#ff6e00)] animate-pulse"
            />
            <p className="subtitle-large text-brass font-accent tracking-[0.35em] text-xs sm:text-sm">
              Why Travel With Us
            </p>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange,#ff6e00)] animate-pulse"
            />
          </div>

          <h2 className="text-h2 text-white font-serif font-light leading-tight">
            The Pillars of Our Expeditions
          </h2>

          <p className="mt-4 font-serif italic font-light text-base md:text-lg leading-relaxed text-brass-soft/90 max-w-2xl mx-auto">
            Nearly a century of unhurried craftsmanship, authentic regional kinship, and private itineraries tailored
            around your pace.
          </p>
        </div>

        {/* 3. Luxury Tab Navigation Bar */}
        <div className="relative mb-12 flex items-center justify-center">
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Pillars of Our Expeditions"
            onKeyDown={onKeyDown}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth p-1.5 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.5)] max-w-full"
          >
            {PILLARS.map((p, i) => {
              const isActive = active === i;
              return (
                <button
                  key={p.key}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`pillar-tab-${p.key}`}
                  aria-selected={isActive}
                  aria-controls={`pillar-panel-${p.key}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(i)}
                  className={`group relative flex items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-2.5 text-[11px] font-accent font-semibold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange,#ff6e00)] shrink-0 ${
                    isActive
                      ? "bg-[var(--color-wild-orange,#ff6e00)] text-white shadow-[0_6px_20px_rgba(255,110,0,0.45)] scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-widest transition-opacity ${
                      isActive ? "text-white/90" : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    0{i + 1}
                  </span>

                  <PillarIcon
                    id={p.key}
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />

                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Pillar Showcase Display Panel */}
        <div
          role="tabpanel"
          id={`pillar-panel-${currentPillar.key}`}
          aria-labelledby={`pillar-tab-${currentPillar.key}`}
          className={`transition-all duration-500 ease-out ${
            isChanging ? "opacity-30 translate-y-3" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {/* Left: Cinematic Card with 3D Tilt & Glass Attributes */}
            <div
              ref={imageCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.rx}deg) rotateY(${cardTilt.ry}deg)`,
                transition: cardTilt.rx === 0 ? "transform 0.6s ease-out" : "none",
              }}
              className="group relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[480px] w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-forest shadow-2xl transition-all duration-500 will-change-transform"
            >
              <Image
                key={currentPillar.key}
                src={currentPillar.image}
                alt={currentPillar.title}
                fill
                priority={false}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-106 animate-fadeIn"
              />

              {/* Cinematic Vignette */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none transition-opacity duration-500 group-hover:opacity-90"
              />

              {/* Top Floating Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-white/90">
                <span className="h-2 w-2 rounded-full bg-[var(--color-wild-orange,#ff6e00)] animate-pulse" />
                <span>
                  Expedition Pillar 0{active + 1} / 0{total}
                </span>
              </div>

              {/* Bottom Glass Plaque with Metadata */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 rounded-[1.15rem] border border-white/15 bg-black/65 backdrop-blur-md p-4 sm:p-5 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                  <div>
                    <span className="font-mono text-xs font-semibold text-[var(--color-wild-orange,#ff6e00)] uppercase tracking-wider block">
                      {currentPillar.statBadge || "Verified Quality"}
                    </span>
                    <span className="font-serif text-sm sm:text-base text-white/90 font-light">
                      {currentPillar.statLabel || "Subcontinent Specialists"}
                    </span>
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 font-accent text-[10px] tracking-wider uppercase text-brass-soft">
                    {currentPillar.regionTag || "India & Nepal"}
                  </span>
                </div>

                <p className="font-serif italic text-xs sm:text-sm text-white/75 font-light leading-snug">
                  &ldquo;{currentPillar.tagline || currentPillar.title}&rdquo;
                </p>
              </div>
            </div>

            {/* Right: Editorial Narrative & Feature Highlights */}
            <div className="flex flex-col justify-center">
              {/* Pillar Index & Eyebrow */}
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--color-wild-orange,#ff6e00)]">
                  Pillar 0{active + 1}
                </span>
                <span aria-hidden="true" className="h-px w-6 bg-[var(--color-wild-orange,#ff6e00)]" />
                <span className="font-accent text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  {currentPillar.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-h3 text-white font-serif font-light leading-tight mb-4">
                {currentPillar.title}
              </h3>

              {/* Narrative Body */}
              <p className="font-sans font-light text-base md:text-lg leading-relaxed text-white/80 mb-6">
                {currentPillar.body}
              </p>

              {/* Highlights Micro-Grid */}
              {currentPillar.highlights && currentPillar.highlights.length > 0 && (
                <div className="mb-8 space-y-3.5 border-t border-b border-white/10 py-5">
                  {currentPillar.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-wild-orange,#ff6e00)]/15 border border-[var(--color-wild-orange,#ff6e00)]/40 text-[var(--color-wild-orange,#ff6e00)] text-xs mt-0.5">
                        ✓
                      </span>
                      <div>
                        <strong className="font-medium text-white text-sm block">
                          {h.title}
                        </strong>
                        <span className="font-sans font-light text-xs sm:text-sm text-white/70 leading-relaxed">
                          {h.detail}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons & Step Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={currentPillar.href}
                    className="btn-primary group inline-flex items-center gap-2"
                  >
                    <span>{currentPillar.linkLabel}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>

                  <Link
                    href="/enquiry"
                    className="btn-ghost-dark inline-flex items-center gap-2"
                  >
                    <span>Tailor An Itinerary</span>
                  </Link>
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center gap-3 pt-2 sm:pt-0">
                  <span className="font-mono text-xs text-white/40 tracking-widest">
                    0{active + 1} / 0{total}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={prevPillar}
                      aria-label="Previous pillar"
                      className="circular-btn w-9 h-9 text-xs"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={nextPillar}
                      aria-label="Next pillar"
                      className="circular-btn w-9 h-9 text-xs"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Bottom Progress Indicator Bar */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-[11px] text-white/60">
              Pillar Exploration
            </span>
            <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[var(--color-wild-orange,#ff6e00)] transition-all duration-500 ease-out"
                style={{ width: `${((active + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/60">Press</span>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">←</kbd>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80">→</kbd>
            <span className="text-[11px] text-white/60">to navigate pillars</span>
          </div>
        </div>
      </div>
    </section>
  );
}
