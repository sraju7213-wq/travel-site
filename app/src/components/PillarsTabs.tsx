"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PILLARS, type Pillar } from "@/data/siteContent";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface PillarsTabsProps {
  /** Panels to show. Defaults to the site-wide "why travel with us" pillars. */
  pillars?: Pillar[];
  /** Anchor id for the section. */
  id?: string;
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Section heading. */
  heading?: React.ReactNode;
  /** Short standfirst beside the heading. */
  intro?: string;
  /** Accessible label for the tab list. */
  tabListLabel?: string;
}

export default function PillarsTabs({
  pillars = PILLARS,
  id = "why-us",
  eyebrow = "Why travel with us",
  heading,
  intro = "Local knowledge, considered journeys, and the freedom to travel at your own pace.",
  tabListLabel = "Pillars of our expeditions",
}: PillarsTabsProps) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabListRef = useRef<HTMLDivElement>(null);
  // 1 = moving forward (content enters from the right), -1 = moving back.
  const directionRef = useRef(1);
  const total = pillars.length;
  const currentPillar: Pillar | undefined = pillars[active];

  const selectTab = useCallback(
    (index: number, focus = false, direction?: 1 | -1) => {
      if (index === active) return;
      directionRef.current = direction ?? (index > active ? 1 : -1);
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
    let direction: 1 | -1 = 1;
    if (e.key === "ArrowRight") {
      direction = 1;
      next = active === total - 1 ? 0 : active + 1;
    } else if (e.key === "ArrowLeft") {
      direction = -1;
      next = active === 0 ? total - 1 : active - 1;
    } else if (e.key === "Home") {
      direction = -1;
      next = 0;
    } else if (e.key === "End") {
      direction = 1;
      next = total - 1;
    }

    if (next === null) return;
    e.preventDefault();
    selectTab(next, true, direction);
  };

  // Scroll-triggered entrance animation via Intersection Observer
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    // `fromTo` with `immediateRender: false` means the section stays visible
    // until the scroll trigger actually plays. A pre-hidden inline style would
    // leave the whole block blank whenever the observer never fires.
    gsap.fromTo(
      section,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
        },
      },
    );
  }, []);

  // The panel content slides in from the side the user is travelling towards.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (prefersReducedMotion()) return;

    const direction = directionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        { opacity: 0, x: direction * 44, y: 12 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: DURATION.base,
          ease: EASE.expo,
          immediateRender: false,
        }
      );

      // The photograph lifts out from beneath a curtain as the panel settles.
      const frame = panel.querySelector<HTMLElement>("[data-pillar-image]");
      if (frame) {
        // Curtain opens from the side the panel is arriving from.
        const hiddenEdge = direction === 1 ? "0% 100% 0% 0%" : "0% 0% 0% 100%";
        gsap.fromTo(
          frame,
          { clipPath: `inset(${hiddenEdge})`, scale: 1.06 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: DURATION.cinematic,
            ease: EASE.expo,
          }
        );
      }
    }, panel);

    return () => ctx.revert();
  }, [active]);

  if (!currentPillar) return null;

  return (
    <section
      ref={sectionRef}
      id={id}
      className="section-pillars relative scroll-mt-24 overflow-hidden border-y border-white/10 py-16 md:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-1/4 h-[34rem] w-[34rem] rounded-full border border-white/[0.05]" />
      <div className="relative mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:pb-9">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-wild-orange)]"><span className="h-px w-10 bg-[var(--color-wild-orange)]" />{eyebrow}</p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              {heading ?? (
                <>
                  A different way to discover <span className="text-white/60">India &amp; Nepal</span>
                </>
              )}
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/55">{intro}</p>
        </div>

        {/* Pillar tabs */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-label={tabListLabel}
          onKeyDown={onKeyDown}
          className="scrollbar-hide -mx-5 flex gap-7 overflow-x-auto border-b border-white/10 px-5 md:mx-0 md:mt-2 md:gap-9 md:px-0"
        >
          {pillars.map((pillar, i) => {
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
                className={`relative shrink-0 pb-4 pt-5 text-[10px] font-sans font-medium uppercase tracking-[0.2em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-[#221F20] ${
                  isActive ? "text-white" : "text-white/60 hover:text-white/85"
                }`}
              >
                <span className="mr-2 text-[9px] text-[var(--color-wild-orange)]">0{i + 1}</span>
                {pillar.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-[var(--color-wild-orange)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active pillar */}
        <div
          key={currentPillar.key}
          ref={panelRef}
          role="tabpanel"
          id="pillars-panel"
          aria-labelledby={`pillar-tab-${currentPillar.key}`}
          className="mt-7 grid items-center gap-8 md:mt-9 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16"
        >
          <div
            data-pillar-image
            className="group relative aspect-[16/10] overflow-hidden bg-[#0C1617] will-change-transform"
          >
            <Image
              src={currentPillar.image}
              alt={currentPillar.title}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
              <div>
                <p className="text-[9px] font-sans uppercase tracking-[0.25em] text-white/70">{currentPillar.regionTag}</p>
                <p className="mt-1 font-serif text-2xl font-light text-white sm:text-3xl">{currentPillar.title}</p>
              </div>
              <span className="hidden font-serif text-4xl font-light text-white/60 sm:block">0{active + 1}</span>
            </div>
          </div>

          <div className="py-1">
            <p className="flex items-center gap-3 text-[10px] font-sans uppercase tracking-[0.22em] text-[var(--color-wild-orange)]"><span className="h-px w-7 bg-[var(--color-wild-orange)]" />{currentPillar.regionTag}</p>
            <h3 className="mt-4 font-serif text-3xl font-light leading-[1.1] text-white md:text-4xl">
              {currentPillar.tagline}
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65">
              {currentPillar.body}
            </p>

            {currentPillar.highlights && currentPillar.highlights.length > 0 && (
              <ul className="mt-6 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {currentPillar.highlights.slice(0, 4).map((h, i) => (
                  <li
                    key={h.title}
                    className="group/highlight min-h-[104px] bg-[var(--color-section-pillars)] p-4 transition-colors duration-300 hover:bg-white/[0.06]"
                  >
                    <p className="text-[9px] font-sans uppercase tracking-[0.18em] text-[var(--color-wild-orange)]">0{i + 1}</p>
                    <p className="mt-2 text-xs font-medium text-white">{h.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/70">{h.detail}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <Link href={currentPillar.href} className="group inline-flex min-h-[44px] items-center gap-4 border-b border-white/35 pb-2 text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)]">
                {currentPillar.linkLabel}
                <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/enquiry"
                className="inline-flex min-h-[44px] items-center text-[10px] font-sans uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white"
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
