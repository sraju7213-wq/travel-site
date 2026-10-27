"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { EXPERIENCES } from "@/data/siteContent";

/**
 * Experience carousel — circular image cards on the reference's dark panel, with a
 * `01 / 07` counter and circular previous/next controls.
 */
export default function ExperienceCarousel() {
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
    <section className="section-darker py-20 md:py-28" id="experiences">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-wild-orange">Our experiences</p>
          <h2 className="text-h2 mb-6 text-wild-white">Experience real, raw nature</h2>
          <p className="font-display text-lg leading-relaxed text-white/75">
            Travelling is about more than the places you visit. With us you will trek, raft, float,
            sail, ride and discover a world of adventures.
          </p>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-6 md:px-8"
      >
        {EXPERIENCES.map((exp, i) => (
          <li
            key={exp.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="flex w-[315px] shrink-0 snap-center flex-col items-center sm:w-[304px]"
          >
            <div className="relative mb-6">
              <div className="relative h-[245px] w-[245px] overflow-hidden rounded-full bg-wild-dark shadow-[0_0_0_10px_var(--color-wild-darker)]">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="245px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-black/20" />
              </div>
              <span className="absolute -bottom-1 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-pill bg-wild-black px-3 py-1 text-[0.65rem] font-display uppercase tracking-[0.15em] text-white/80">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3 fill-none stroke-current stroke-[2]"
                >
                  <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
                {exp.locations}
              </span>
            </div>

            <h3 className="mb-3 text-center font-serif text-2xl font-bold text-wild-white">
              {exp.title}
            </h3>
            <p className="mb-5 max-w-xs text-center font-display text-sm leading-relaxed text-white/75">
              {exp.description}
            </p>
            <Link
              href={exp.href}
              className="inline-flex items-center gap-1 text-xs font-display font-semibold uppercase tracking-[0.2em] text-wild-accent transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
            >
              {exp.title} <span aria-hidden="true">→</span>
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
          className="btn-large-circle disabled:cursor-not-allowed disabled:opacity-35"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-xs font-display tabular-nums tracking-[0.3em] text-white/80">
          {String(active + 1).padStart(2, "0")} / {String(EXPERIENCES.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(EXPERIENCES.length - 1, active + 1))}
          disabled={active === EXPERIENCES.length - 1}
          aria-label="Next experience"
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
