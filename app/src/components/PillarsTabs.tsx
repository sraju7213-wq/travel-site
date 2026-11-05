"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PILLARS, type Pillar } from "@/data/siteContent";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function PillarsTabs() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabListRef = useRef<HTMLDivElement>(null);
  const total = PILLARS.length;
  const currentPillar: Pillar = PILLARS[active];

  const selectTab = useCallback(
    (index: number, focus = false) => {
      if (index === active) return;
      setActive(index);

      if (focus) {
        tabRefs.current[index]?.focus();
      }

      const tabEl = tabRefs.current[index];
      const listEl = tabListRef.current;
      if (tabEl && listEl) {
        const offset = tabEl.offsetLeft - listEl.offsetWidth / 2 + tabEl.offsetWidth / 2;
        listEl.scrollTo({
          left: Math.max(0, offset),
          behavior:
            typeof window !== "undefined" &&
            window.matchMedia(REDUCED_MOTION_QUERY).matches
              ? "auto"
              : "smooth",
        });
      }
    },
    [active],
  );

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
  // Scroll-triggered entrance animation via Intersection Observer
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const section = sectionRef.current;
    if (!section) return;

    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);


  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="section-pillars scroll-mt-24 border-y border-white/10 py-14 md:py-20"
    >
<div className="mx-auto max-w-[1100px] px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="subtitle-large mb-4 font-accent text-brass">Why Travel With Us</p>
          <h2 className="text-h2 font-serif font-light leading-tight text-white">
            The Pillars of Our Expeditions
          </h2>
        </div>

        {/* Pillar tabs */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Pillars of our expeditions"
          onKeyDown={onKeyDown}
          className="scrollbar-hide mt-8 flex gap-7 overflow-x-auto border-b border-white/10 md:mt-10 md:gap-10"
        >
          {PILLARS.map((pillar, i) => {
            const isActive = active === i;
            return (
              <button
                key={pillar.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`pillar-tab-${pillar.key}`}
                aria-selected={isActive}
                aria-controls="pillars-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(i)}
                className={`relative shrink-0 pb-4 text-[11px] font-accent uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-[#221F20] ${
                  isActive ? "text-white" : "text-white/55 hover:text-white/85"
                }`}
              >
                {pillar.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px bg-brass"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active pillar */}
        <div
          key={currentPillar.key}
          role="tabpanel"
          id="pillars-panel"
          aria-labelledby={`pillar-tab-${currentPillar.key}`}
          className="mt-8 grid animate-fadeIn items-start gap-8 md:mt-10 lg:grid-cols-2 lg:gap-12"
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0C1617]">
            <Image
              src={currentPillar.image}
              alt={currentPillar.title}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="text-[11px] font-accent uppercase tracking-[0.22em] text-brass">
              {currentPillar.regionTag}
            </p>
            <h3 className="mt-3 font-serif text-2xl font-light leading-[1.12] text-white md:text-3xl lg:text-4xl">
              {currentPillar.title}
            </h3>
            <p className="mt-3 max-w-xl font-serif text-base italic leading-relaxed text-white/65 md:text-lg">
              {currentPillar.tagline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              {currentPillar.body}
            </p>

            {currentPillar.highlights && currentPillar.highlights.length > 0 && (
              <ul className="mt-6 border-t border-white/10">
                {currentPillar.highlights.map((h) => (
                  <li
                    key={h.title}
                    className="grid gap-1 border-b border-white/10 py-3 sm:grid-cols-[minmax(0,190px)_1fr] sm:gap-6"
                  >
                    <p className="text-sm font-medium text-white">{h.title}</p>
                    <p className="text-sm leading-relaxed text-white/60">{h.detail}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Link href={currentPillar.href} className="btn-tertiary">
                {currentPillar.linkLabel}
              </Link>
              <Link
                href="/enquiry"
                className="text-[11px] font-accent uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
              >
                Tailor an itinerary <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
