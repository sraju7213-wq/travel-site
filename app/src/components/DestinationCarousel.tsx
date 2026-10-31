"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DESTINATIONS } from "@/data/siteContent";

/**
 * Destination board — country tabs above a horizontal, scroll-snapping card carousel.
 */
export default function DestinationCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    card.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
    setActive(index);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let best = Number.POSITIVE_INFINITY;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cardCenter = card.offsetLeft + card.clientWidth / 2;
          const distance = Math.abs(cardCenter - trackCenter);
          if (distance < best) {
            best = distance;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="section-cream py-20 md:py-28 scroll-mt-24" id="destinations">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-brass-ink">Eight regions</p>
          <h2 className="text-h2 mb-6 text-charcoal">Destinations we operate in</h2>
          <p className="font-display text-lg leading-relaxed text-charcoal-soft">
            We operate across eight regions of India and Nepal, each selected for the journeys it
            makes possible — sightseeing, trekking, rafting, wildlife and houseboat stays.
          </p>
        </div>

        {/* Jump-to links for each destination */}
        <div
          role="group"
          aria-label="Jump to a destination"
          className="mb-10 flex flex-wrap justify-center gap-x-2 gap-y-3 border-y border-border py-5"
        >
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.name}
              type="button"
              aria-pressed={active === i}
              onClick={() => scrollToIndex(i)}
              className={`rounded-button px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 ${
                active === i
                  ? "bg-brass text-white shadow-[0_6px_16px_rgba(255,110,0,0.35)] scale-105"
                  : "bg-white/70 text-charcoal-soft hover:bg-white hover:text-brass"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Card carousel */}
      <ul
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Destinations carousel — scroll horizontally to see all eight regions"
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass md:px-8 after:content-[''] after:w-[30vw] after:shrink-0"
      >
        {DESTINATIONS.map((d, i) => (
          <li
            key={d.name}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="w-[86vw] shrink-0 snap-center sm:w-[400px] lg:w-[460px]"
          >
            <Link
              href={d.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-ivory-soft"
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-[1rem] bg-charcoal shadow-lg transition-all duration-500 group-hover:shadow-2xl">
                <Image
                  src={d.image}
                  alt={`${d.name} — ${d.tagline}`}
                  fill
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 400px, 86vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 via-40% to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                <span className="absolute inset-0 flex flex-col items-center justify-start gap-2.5 p-7 text-center">
                  <span className="text-xs font-display font-medium uppercase tracking-[0.25em] text-white/90 drop-shadow-md">
                    {d.tagline}
                  </span>
                  <span className="font-serif text-3xl uppercase leading-tight tracking-[0.14em] text-white drop-shadow-lg transition-transform duration-500 group-hover:scale-105 sm:text-4xl">
                    {d.name}
                  </span>
                </span>
              </span>
              <span className="mt-4 block font-display text-sm leading-relaxed text-charcoal-soft line-clamp-2">
                {d.blurb}
              </span>
              <span className="btn-tertiary mt-5 inline-flex">Enquire now</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-6 flex max-w-[1400px] items-center justify-center gap-4 px-4 md:px-8">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous destination"
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span
          aria-live="polite"
          className="text-xs font-display tabular-nums tracking-[0.3em] text-charcoal-soft"
        >
          {String(active + 1).padStart(2, "0")} / {String(DESTINATIONS.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(DESTINATIONS.length - 1, active + 1))}
          disabled={active === DESTINATIONS.length - 1}
          aria-label="Next destination"
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

