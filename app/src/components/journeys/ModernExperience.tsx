"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import CtaZoom from "@/components/CtaZoom";
import PackageGrid from "@/components/PackageGrid";
import CardViewSwitcher, { type CardViewMode } from "@/components/ui/CardViewSwitcher";
import type { ResolvedPlace } from "@/data/places";
import type { PackageViewModel } from "@/types/travel";
import CoverflowSwiper from "./CoverflowSwiper";
import "./modern.css";

interface ModernExperienceProps {
  places: ResolvedPlace[];
  /** Catalogue journeys grouped by place name. */
  journeysByPlace: Record<string, PackageViewModel[]>;
}

/**
 * ModernExperience
 * ----------------
 * Cinematic alternative to the Orbit hero: a full-bleed scenic backdrop that
 * crossfades to the selected destination, an editorial headline block on the
 * left, and a horizontal rail of destination cards on the right.
 *
 * Selecting a card promotes it to the featured slot: it widens, its copy
 * unfolds, the headline block re-writes to that destination and the backdrop
 * transitions to its photograph. The expansion is CSS-driven (flex-grow +
 * grid-template-rows) rather than a carousel, so no extra dependency is needed.
 */
export default function ModernExperience({ places, journeysByPlace }: ModernExperienceProps) {
  const [active, setActive] = useState(0);
  const [viewMode, setViewMode] = useState<CardViewMode>("grid");
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const current = places[active];
  const currentJourneys = journeysByPlace[current?.name] ?? [];

  // Keep the expanded card inside the rail viewport.
  useEffect(() => {
    const card = cardRefs.current[active];
    const rail = railRef.current;
    if (!card || !rail) return;
    const cardBox = card.getBoundingClientRect();
    const railBox = rail.getBoundingClientRect();
    if (cardBox.right > railBox.right - 8) {
      rail.scrollBy({ left: cardBox.right - railBox.right + 24, behavior: "smooth" });
    } else if (cardBox.left < railBox.left + 8) {
      rail.scrollBy({ left: cardBox.left - railBox.left - 24, behavior: "smooth" });
    }
  }, [active]);

  const select = useCallback(
    (index: number) => {
      setActive((index + places.length) % places.length);
    },
    [places.length],
  );

  const move = useCallback(
    (delta: number) => {
      setActive((index) => (index + delta + places.length) % places.length);
    },
    [places.length],
  );

  const onRailTouchStart = useCallback((event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
    touchCurrentX.current = event.touches[0].clientX;
    isDragging.current = false;
  }, []);

  const onRailTouchMove = useCallback((event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchCurrentX.current = event.touches[0].clientX;
    const deltaX = touchCurrentX.current - touchStartX.current;
    const deltaY = (event.touches[0].clientY - (touchStartY.current ?? 0));
    // Only engage drag if horizontal dominates and exceeds threshold
    if (!isDragging.current && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      // Dampen the offset so it feels resistance
      setDragOffset(deltaX * 0.35);
    }
  }, []);

  const onRailTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) {
        setDragOffset(0);
        isDragging.current = false;
        return;
      }
      const deltaX = event.changedTouches[0].clientX - touchStartX.current;
      const deltaY = event.changedTouches[0].clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;
      touchCurrentX.current = null;
      isDragging.current = false;
      setDragOffset(0);
      // Only treat it as a horizontal swipe when horizontal travel dominates,
      // so vertical page scrolling is never hijacked.
      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      // Swipe left advances, swipe right goes back.
      move(deltaX < 0 ? 1 : -1);
    },
    [move],
  );

  if (!current) return null;

  return (
    <>
      <section className="md-hero" aria-labelledby="md-title">
        <div className="md-hero__bg" aria-hidden="true">
          {places.map((place, index) => {
            // Only the active slide and its neighbours need a full-size image.
            // Distant slides keep a 16px placeholder in the srcset; when they
            // become active the browser upgrades from the same srcset, so the
            // crossfade still works without downloading every backdrop up front.
            const distance = Math.abs(index - active);
            const near = distance <= 1 || distance >= places.length - 1;
            return (
              <Image
                key={place.name}
                src={place.image}
                alt=""
                fill
                sizes={near ? "100vw" : "16px"}
                quality={75}
                className="md-hero__bg-img"
                data-active={index === active}
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
              />
            );
          })}
        </div>
        <div className="md-hero__veil" aria-hidden="true" />

        <div className="md-hero__inner">
          <div className="md-hero__copy">
            <p className="md-eyebrow">
              {current.country} &middot; {current.journeys}{" "}
              {current.journeys === 1 ? "journey" : "journeys"}
            </p>
            <h1 id="md-title" className="md-title">
              {current.name}
            </h1>
            <p className="md-sub">{current.blurb}</p>

            <div className="md-actions">
              <a href="#modern-catalogue" className="md-btn md-btn--primary">
                Explore destination
              </a>
              <button
                type="button"
                className="md-btn md-btn--ghost"
                onClick={() => move(1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <span className="sr-only">Show next destination</span>
              </button>
            </div>
          </div>

          <div className="md-hero__rail">
            <div
              ref={railRef}
              className="md-cards"
              role="group"
              aria-label="Featured destinations"
              onTouchStart={onRailTouchStart}
              onTouchMove={onRailTouchMove}
              onTouchEnd={onRailTouchEnd}
              onKeyDown={(event) => {
                // Only handles arrows when the rail itself holds focus — a card
                // button handles its own arrows and stops propagation.
                if (event.target !== event.currentTarget) return;
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  move(1);
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  move(-1);
                }
              }}
              style={{
                transform: dragOffset !== 0 ? `translateX(${dragOffset}px)` : undefined,
                transition: dragOffset !== 0 ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {places.map((place, index) => {
                const isActive = index === active;
                return (
                  <article
                    key={place.name}
                    className="md-card"
                    data-active={isActive}
                  >
                    <Image
                      src={place.image}
                      alt={place.alt}
                      fill
                      sizes="(min-width: 768px) 22vw, 46vw"
                      quality={75}
                      className="md-card__img"
                      loading={index < 4 ? "eager" : "lazy"}
                    />
                    <span className="md-card__veil" aria-hidden="true" />

                    <button
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      type="button"
                      className="md-card__hit"
                      aria-label={`Feature ${place.name} — ${place.journeys} ${
                        place.journeys === 1 ? "journey" : "journeys"
                      }`}
                      aria-pressed={isActive}
                      aria-current={isActive ? "true" : undefined}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => select(index)}
                      onKeyDown={(event) => {
                        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
                        event.preventDefault();
                        event.stopPropagation();
                        const next =
                          (index + (event.key === "ArrowRight" ? 1 : -1) + places.length) %
                          places.length;
                        select(next);
                        cardRefs.current[next]?.focus();
                      }}
                    />

                    <div className="md-card__body">
                      <p className="md-card__country">{place.country}</p>
                      <h2 className="md-card__title">{place.name}</h2>
                      <div className="md-card__more" aria-hidden={!isActive}>
                        <div>
                          <p className="md-card__blurb">{place.blurb}</p>
                          <a
                            href="#modern-catalogue"
                            className="md-card__cta"
                            tabIndex={isActive ? 0 : -1}
                            aria-hidden={!isActive}
                          >
                            View {place.name} journeys
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="md-swipe-hint" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 6l-6 6 6 6" />
              </svg>
              Swipe to explore
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </p>

            <div className="md-controls">
              <button
                type="button"
                className="md-arrow"
                onClick={() => move(-1)}
                aria-label="Previous destination"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button
                type="button"
                className="md-arrow"
                onClick={() => move(1)}
                aria-label="Next destination"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <span className="md-progress" aria-hidden="true">
                <span
                  className="md-progress__fill"
                  style={{ width: `${((active + 1) / places.length) * 100}%` }}
                />
              </span>
              <span className="md-counter" aria-hidden="true">
                {String(active + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="modern-catalogue"
        className="md-catalogue scroll-mt-20"
        aria-labelledby="md-catalogue-h"
      >
        <div className="md-catalogue__head">
          <p className="md-eyebrow">The journeys</p>
          <h2 id="md-catalogue-h" className="md-catalogue__title">
            {current.name} itineraries
          </h2>
          <p className="md-catalogue__count">
            {currentJourneys.length} from the printed brochure
          </p>
        </div>

        <div className="mx-auto mb-6 flex w-full max-w-[96rem] justify-end">
          <CardViewSwitcher
            mode={viewMode}
            onChange={setViewMode}
            label="Journey card view"
          />
        </div>

        {viewMode === "coverflow" ? (
          <CoverflowSwiper packages={currentJourneys} />
        ) : (
          <PackageGrid packages={currentJourneys} />
        )}
      </section>

      <CtaZoom
        image={current.image}
        imageAlt={current.alt}
        eyebrow={`${current.name} — ${current.journeys} ${
          current.journeys === 1 ? "journey" : "journeys"
        }`}
        title={
          <>
            {current.name},
            <br className="hidden sm:block" /> your way.
          </>
        }
        body={current.blurb}
        ctaLabel="Enquire now"
        ctaHref="/enquiry"
        hideOnMobile
      />
    </>
  );
}
