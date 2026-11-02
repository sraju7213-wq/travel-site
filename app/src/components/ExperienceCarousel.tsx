"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { EXPERIENCES } from "@/data/siteContent";

/**
 * Experience carousel — circular image cards on a dark panel, with a
 * counter and circular previous/next controls.
 */
export default function ExperienceCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: reduce ? "auto" : "smooth",
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
    <section className="section-darker py-12 md:py-16" id="experiences">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <p className="subtitle-large mb-4 text-brass font-accent">Curated Brochure Expeditions</p>
          <h2 className="text-h2 mb-5 text-white font-serif font-light">Iconic Subcontinent Experiences</h2>
          <p className="font-sans font-light text-base md:text-lg leading-relaxed text-white/75">
            Himalayan trekking, whitewater rafting, heritage houseboat stays, wildlife safaris and cultural immersions
            drawn directly from our 1927 heritage archives.
          </p>
        </div>
      </div>

      <ul
        ref={trackRef}
        tabIndex={0}
        role="group"
        aria-label="Experiences carousel — scroll horizontally to see all experiences"
        className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 pt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass md:px-8"
      >
        {EXPERIENCES.map((exp, i) => (
          <li
            key={exp.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="group flex w-[260px] shrink-0 snap-center flex-col items-center sm:w-[260px]"
          >
            <div className="relative mb-4 pt-1">
              <div className="relative h-[180px] w-[180px] overflow-hidden rounded-full bg-forest border-2 border-white/10 shadow-[0_0_0_8px_var(--color-charcoal)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_5px_var(--color-brass),0_0_0_10px_var(--color-charcoal)]">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  quality={90}
                  sizes="(min-width: 640px) 500px, 320px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
              </div>
              <span className="absolute -bottom-1 left-1/2 inline-flex max-w-[260px] -translate-x-1/2 items-center gap-1.5 truncate whitespace-nowrap rounded-pill bg-charcoal px-3 py-1 text-[0.65rem] font-accent uppercase tracking-[0.2em] text-brass-soft border border-white/10 shadow-sm">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
                {exp.locations}
              </span>
            </div>

            <h3 className="mb-2 text-center font-serif text-2xl font-light text-white tracking-wide">
              {exp.title}
            </h3>
            <p className="mb-4 max-w-xs text-center font-sans font-light text-xs leading-relaxed text-white/70">
              {exp.description}
            </p>
            <Link
              href={exp.href}
              className="inline-flex items-center gap-1.5 text-xs font-accent font-semibold uppercase tracking-[0.22em] text-brass transition-all duration-300 hover:text-white hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              {exp.title} <span aria-hidden="true">&rarr;</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous experience"
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span
          aria-live="polite"
          className="text-xs font-display tabular-nums tracking-[0.3em] text-white/80"
        >
          {String(active + 1).padStart(2, "0")} / {String(EXPERIENCES.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(EXPERIENCES.length - 1, active + 1))}
          disabled={active === EXPERIENCES.length - 1}
          aria-label="Next experience"
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

