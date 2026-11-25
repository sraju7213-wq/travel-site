"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { placeLine } from "@/lib/packageDisplay";
import { getPackageCardImage } from "@/data/catalogue";
import type { PackageViewModel } from "@/types/travel";
import "./coverflow.css";

const SWIPE_THRESHOLD = 40;
const DRAG_SLOP = 8;

interface DragState {
  active: boolean;
  pointerId: number;
  startX: number;
  currentX: number;
  pendingX: number;
  frame: number;
}

interface CoverflowSwiperProps {
  packages: PackageViewModel[];
}

export default function CoverflowSwiper({ packages }: CoverflowSwiperProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [compact, setCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: -1,
    startX: 0,
    currentX: 0,
    pendingX: 0,
    frame: 0,
  });
  const suppressClickRef = useRef(false);
  const wheelTimeoutRef = useRef<number | null>(null);

  // Phones show a shallower stack: fewer 3D layers and fewer images in flight.
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(
    () => () => {
      const drag = dragRef.current;
      if (drag.frame) cancelAnimationFrame(drag.frame);
      if (wheelTimeoutRef.current !== null) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
    },
    [],
  );

  // Derive safe index — clamps if the packages list shrinks
  const safeIndex = Math.min(activeIndex, Math.max(0, packages.length - 1));

  const goTo = useCallback(
    (index: number) => {
      if (packages.length === 0) return;
      const next = Math.max(0, Math.min(packages.length - 1, index));
      setActiveIndex(next);
    },
    [packages.length],
  );

  const prev = useCallback(() => goTo(safeIndex - 1), [safeIndex, goTo]);
  const next = useCallback(() => goTo(safeIndex + 1), [safeIndex, goTo]);

  // Pointer movement writes ONE transform on the stage inside a rAF. Mutating
  // an inherited custom property instead invalidates style on every card (and
  // all of its text) each frame; a single compositor transform does not.
  const queueDrag = useCallback((delta: number) => {
    const drag = dragRef.current;
    drag.pendingX = delta;
    if (drag.frame) return;
    drag.frame = requestAnimationFrame(() => {
      drag.frame = 0;
      if (stageRef.current) {
        stageRef.current.style.transform = `translate3d(${drag.pendingX * 0.5}px, 0, 0)`;
      }
    });
  }, []);

  const endDrag = useCallback(
    (commit: boolean) => {
      const drag = dragRef.current;
      if (!drag.active) return;
      drag.active = false;
      if (drag.frame) {
        cancelAnimationFrame(drag.frame);
        drag.frame = 0;
      }
      containerRef.current?.classList.remove("cf-dragging");
      stageRef.current?.style.removeProperty("transform");

      const delta = drag.currentX - drag.startX;
      if (Math.abs(delta) > DRAG_SLOP) {
        // A drag must never fire a link that happened to sit under the pointer.
        suppressClickRef.current = true;
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
      if (!commit || Math.abs(delta) < SWIPE_THRESHOLD) return;
      if (delta < 0) next();
      else prev();
    },
    [next, prev],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("a, button")) return;
    const drag = dragRef.current;
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.currentX = event.clientX;
    drag.pendingX = 0;
    containerRef.current?.classList.add("cf-dragging");
    // Pointer capture keeps a drag alive outside the viewport; touch-action:
    // pan-y still lets the browser own vertical page scrolling.
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active || event.pointerId !== drag.pointerId) return;
    drag.currentX = event.clientX;
    queueDrag(event.clientX - drag.startX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endDrag(true);
  };

  const handlePointerCancel = () => endDrag(false);

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (Math.abs(delta) < 25) return;

    if (wheelTimeoutRef.current !== null) return;
    if (delta > 0) {
      next();
    } else {
      prev();
    }

    wheelTimeoutRef.current = window.setTimeout(() => {
      wheelTimeoutRef.current = null;
    }, 280);
  };

  if (!packages || packages.length === 0) {
    return null;
  }

  // Only cards in this window are mounted. Keeping the window tight is the
  // cheapest way to cut both 3D layers and image work on phones.
  const visibleRange = compact ? 1 : 3;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D Itinerary Coverflow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClickCapture={handleClickCapture}
      className="group/swiper cf-viewport relative w-full select-none py-6 outline-none cursor-grab active:cursor-grabbing overflow-hidden"
    >
      <div
        ref={stageRef}
        className="cf-stage relative mx-auto flex items-center justify-center min-h-[580px] sm:min-h-[640px] md:min-h-[680px] w-full"
      >
        {packages.map((pkg, i) => {
          const offset = i - safeIndex;
          if (Math.abs(offset) > visibleRange) {
            return null;
          }

          const isActive = offset === 0;

          const rotateY =
            offset === 0
              ? 0
              : offset < 0
                ? Math.min(38 + Math.abs(offset) * 4, 60)
                : -Math.min(38 + Math.abs(offset) * 4, 60);
          const translateZ = -Math.abs(offset) * 220;
          const scale = isActive ? 1 : Math.max(0.72, 1 - Math.abs(offset) * 0.08);
          const zIndex = 20 - Math.abs(offset);
          const opacity = Math.max(0.12, 1 - Math.abs(offset) * 0.22);

          const stepPercent = offset * 45;

          return (
            <div
              key={pkg.id}
              onClick={() => {
                if (!isActive) goTo(i);
              }}
              aria-hidden={!isActive}
              data-near={Math.abs(offset) <= 1}
              style={{
                transform: `translate3d(${stepPercent}%, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className={`cf-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[330px] md:w-[370px] ${
                isActive
                  ? "pointer-events-auto cursor-default"
                  : "pointer-events-auto cursor-pointer hover:opacity-90"
              }`}
            >
              {/* Card Container */}
              <article
                className={`relative aspect-[2/3] overflow-hidden rounded-[18px] bg-[#121B20] shadow-[0_28px_60px_-20px_rgba(0,0,0,0.95)] border transition-colors duration-300 ${
                  isActive
                    ? "border-[var(--color-wild-orange)]/60 ring-1 ring-white/20"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                {/* Poster Image */}
                <div className="absolute inset-0">
                  <Image
                    src={getPackageCardImage(pkg.slug)}
                    alt={pkg.title}
                    fill
                    sizes={compact ? "280px" : "(min-width: 768px) 370px, 280px"}
                    quality={compact ? 60 : 75}
                    loading={isActive ? "eager" : "lazy"}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Dark Cinematic Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[#090E10] via-[#090E10]/80 via-50% to-transparent transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-85"
                  }`}
                  aria-hidden="true"
                />

                {/* Ambient warmth + sheen share one layer. Their effective
                    alphas are baked into the stops so the look is unchanged. */}
                <div
                  className="cf-card-glow absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top right, transparent, rgba(255, 255, 255, 0.03), transparent), radial-gradient(120% 70% at 50% 100%, rgba(212, 147, 104, 0.0875), transparent 60%)",
                  }}
                  aria-hidden="true"
                />

                {/* Card Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-6 text-white pointer-events-none">
                  {/* Top Rank Badge & Category Tag */}
                  <div className="flex items-start justify-between">
                    <span
                      className="font-serif text-4xl sm:text-5xl font-bold tracking-tighter"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: "1.5px var(--color-wild-orange)",
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 shadow-sm">
                      {pkg.category}
                    </span>
                  </div>

                  {/* Bottom Itinerary Information */}
                  <div className="grid gap-2.5">
                    {/* Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl font-light leading-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] line-clamp-2">
                      {pkg.title}
                    </h3>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px]">
                      {/* Destination */}
                      <span className="inline-flex items-center gap-1 font-sans text-white/80">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-[var(--color-wild-orange)]"
                          aria-hidden="true"
                        >
                          <path d="M12 21s-8-7.5-8-12a8 8 0 1 1 16 0c0 4.5-8 12-8 12z" />
                          <circle cx="12" cy="9" r="2.5" />
                        </svg>
                        <span className="truncate max-w-[150px] sm:max-w-[180px]">
                          {placeLine(pkg)}
                        </span>
                      </span>

                      <span className="text-white/30">·</span>

                      {/* Duration */}
                      <span className="inline-flex items-center gap-1 font-mono text-white/70">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-brass"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{pkg.duration.split(" ")[0]} nights</span>
                      </span>

                      {pkg.difficulty && (
                        <span className="inline-flex items-center gap-1 font-sans text-xs text-white/70">
                          {pkg.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Excerpt Summary */}
                    <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-[0.875rem] leading-relaxed text-white/80">
                      {pkg.summary}
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-2 grid gap-2 pointer-events-auto">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2.5 font-sans text-xs sm:text-sm font-semibold text-[#0C1617] shadow-[0_8px_20px_-6px_rgba(212,147,104,0.6)] transition-all hover:bg-[var(--color-wild-orange-hover)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span>View Itinerary</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>

                      <Link
                        href={`/enquiry?package=${pkg.slug}`}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-[#0C1617]/70 px-4 py-2 font-sans text-xs sm:text-sm font-medium text-white transition-all hover:border-white/50 hover:bg-white/10 active:scale-[0.98]"
                      >
                        Enquire About This
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 px-4 sm:px-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={prev}
            disabled={safeIndex === 0}
            aria-label="Previous journey"
            data-theme-control="light"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#101b1d]/90 text-white transition-all hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] shadow-lg backdrop-blur-md"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-medium text-white/80 tracking-widest">
              <span className="text-[var(--color-wild-orange)] font-bold">
                {String(safeIndex + 1).padStart(2, "0")}
              </span>{" "}
              / {String(packages.length).padStart(2, "0")}
            </span>

            <div className="h-1.5 w-36 sm:w-52 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brass to-[var(--color-wild-orange)] transition-all duration-300"
                style={{
                  width: `${((safeIndex + 1) / packages.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={safeIndex === packages.length - 1}
            aria-label="Next journey"
            data-theme-control="light"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#101b1d]/90 text-white transition-all hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] hover:bg-white/10 disabled:opacity-25 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] shadow-lg backdrop-blur-md"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {packages.length > 1 && packages.length <= 30 && (
          <div
            className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 max-w-full scrollbar-hide"
            role="tablist"
            aria-label="Jump to journey"
          >
            {packages.map((pkg, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Jump to journey ${idx + 1}: ${pkg.title}`}
                  onClick={() => goTo(idx)}
                  className={`flex h-11 min-w-[28px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] ${
                    isSelected ? "w-7" : "w-2"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`block rounded-full transition-all ${
                      isSelected
                        ? "h-2 w-7 bg-[var(--color-wild-orange)] shadow-[0_0_8px_rgba(212,147,104,0.7)]"
                        : "h-2 w-2 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

        <p data-theme-surface="light" className="flex items-center gap-2 font-sans text-[11px] tracking-wider text-white/60">
          <span>Swipe, drag or use</span>
          <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-[10px] font-mono text-white/70">
            ←
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-[10px] font-mono text-white/70">
            →
          </kbd>
          <span>to explore</span>
        </p>
      </div>
    </div>
  );
}
