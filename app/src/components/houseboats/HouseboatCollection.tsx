"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOUSEBOAT_CARDS } from "@/data/houseboats";

/**
 * Horizontally scrolling collection, modelled on the reference site's
 * destination carousel: snap scrolling, arrow controls and edge fades.
 */
export default function HouseboatCollection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft < maxScroll - 8);

    const cards = Array.from(track.querySelectorAll("li"));
    if (cards.length === 0) return;
    const trackLeft = track.getBoundingClientRect().left;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    updateControls();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls);
    return () => {
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    };
  }, [updateControls]);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const amount = card ? card.clientWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section
      id="houseboat-collection"
      className="section-journeys scroll-mt-24 overflow-hidden border-b border-white/5 py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Choose your base on the water
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              Ways to take <span className="text-white/55">to the lake</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] tracking-[0.18em] text-white/45">
              {String(activeIndex + 1).padStart(2, "0")} / {String(HOUSEBOAT_CARDS.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canScrollLeft}
                aria-label="Previous houseboat card"
                className="flex h-10 w-10 items-center justify-center rounded-none border border-white/15 text-white/80 transition hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canScrollRight}
                aria-label="Next houseboat card"
                className="flex h-10 w-10 items-center justify-center rounded-none border border-white/15 text-white/80 transition hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Track */}
      <div className="relative mt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--color-section-journeys)] to-transparent md:w-32"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--color-section-journeys)] to-transparent md:w-32"
        />

        <ul
          ref={trackRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 md:px-10"
          aria-label="Houseboat experiences — scroll horizontally"
        >
          {HOUSEBOAT_CARDS.map((card) => (
            <li
              key={card.title}
              className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[420px] sm:max-w-[420px]"
            >
              <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#0C1617] transition-colors duration-300 hover:border-[var(--color-wild-orange)]/60">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, 420px"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />
                  <span className="absolute left-4 top-4 border border-white/25 bg-black/50 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                    {card.tag}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-2xl font-light leading-snug text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 font-sans text-sm font-light leading-relaxed text-white/60">
                    {card.blurb}
                  </p>
                  <Link
                    href="/enquiry?service=houseboats"
                    className="group/link mt-6 inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-none border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover/link:bg-[var(--color-wild-orange)] group-hover/link:text-white">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Enquire
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
