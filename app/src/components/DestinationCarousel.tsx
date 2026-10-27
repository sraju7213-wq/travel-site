"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { DESTINATIONS } from "@/data/siteContent";

/**
 * Destination board — country tabs above a horizontal, scroll-snapping card carousel,
 * mirroring the reference site's destination module.
 */
export default function DestinationCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActive(index);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const trackLeft = track.scrollLeft;
        let nearest = 0;
        let best = Number.POSITIVE_INFINITY;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const distance = Math.abs(card.offsetLeft - track.offsetLeft - trackLeft);
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
    <section className="section-cream py-20 md:py-28" id="destinations">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-wild-orange">Our destinations are vast</p>
          <h2 className="text-h2 mb-6 text-charcoal">Our luxury travel destinations</h2>
          <p className="font-display text-lg leading-relaxed text-charcoal-soft">
            We operate across eight regions of India and Nepal, each chosen for the journeys it
            makes possible — private access, unhurried encounters and a full immersion in nature
            and local culture.
          </p>
        </div>

        {/* Country tabs */}
        <div
          role="tablist"
          aria-label="Destinations"
          className="mb-10 flex flex-wrap justify-center gap-x-2 gap-y-3 border-y border-border py-5"
        >
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.name}
              role="tab"
              type="button"
              aria-selected={active === i}
              onClick={() => scrollToIndex(i)}
              className={`rounded-button px-4 py-2 text-xs font-display font-semibold uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2 ${
                active === i
                  ? "bg-wild-orange text-wild-white"
                  : "bg-transparent text-charcoal-soft hover:text-wild-orange"
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
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-8"
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
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-4 focus-visible:ring-offset-wild-cream"
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-image bg-wild-darker">
                <Image
                  src={d.image}
                  alt={d.tagline}
                  fill
                  sizes="(min-width: 1024px) 460px, (min-width: 640px) 400px, 86vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <span className="text-xs font-display uppercase tracking-[0.3em] text-white/80">
                    {d.tagline}
                  </span>
                  <span className="font-serif text-3xl uppercase leading-tight tracking-[0.12em] text-white sm:text-4xl">
                    {d.name}
                  </span>
                </span>
              </span>
              <span className="mt-4 block font-display text-sm leading-relaxed text-charcoal-soft">
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
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-35"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-xs font-display tabular-nums tracking-[0.3em] text-charcoal-soft">
          {String(active + 1).padStart(2, "0")} / {String(DESTINATIONS.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(DESTINATIONS.length - 1, active + 1))}
          disabled={active === DESTINATIONS.length - 1}
          aria-label="Next destination"
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-35"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
