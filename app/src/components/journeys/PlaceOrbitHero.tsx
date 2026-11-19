"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cleanDuration, placeLine } from "@/lib/packageDisplay";
import { getAllPackages, getPackageCardImage } from "@/data/catalogue";
import type { ResolvedPlace } from "@/data/places";
import type { PackageViewModel } from "@/types/travel";

const allPackages = getAllPackages();

interface PlaceOrbitHeroProps {
  /** Quick-filter chips under the search field. */
  places: ResolvedPlace[];
  /** Marquee journeys orbiting the headline — each card opens its itinerary. */
  journeys: PackageViewModel[];
}

interface OrbitCard {
  el: HTMLAnchorElement;
  tilt: HTMLElement;
  shade: HTMLElement;
  index: number;
  lift: number;
  rx: number;
  ry: number;
  trx: number;
  try_: number;
  depth: number;
  z: string;
  op: string;
  shadeOp: string;
}

/**
 * PlaceOrbitHero
 * --------------
 * A draggable ring of journey cards orbiting a centred headline — the
 * same interaction model the reelipse.com landing page uses for posters.
 * Every card carries the package name on the poster and opens that package's
 * itinerary page directly.
 *
 * Cards travel on an ellipse, scale with depth, dim as they recede, and
 * respond to pointer position with a real 3D tilt plus a foil/glare highlight.
 * The ring auto-spins until the visitor grabs it; reduced-motion visitors get
 * a static, readable layout instead.
 */
export default function PlaceOrbitHero({ places, journeys }: PlaceOrbitHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<OrbitCard[]>([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const ring = ringRef.current;
    const core = coreRef.current;
    if (!section || !ring || !core) return undefined;

    const allCards: OrbitCard[] = [];
    ring.querySelectorAll<HTMLAnchorElement>("[data-orbit-card]").forEach((el, index) => {
      allCards.push({
        el,
        tilt: el.querySelector<HTMLElement>("[data-orbit-tilt]") as HTMLElement,
        shade: el.querySelector<HTMLElement>("[data-orbit-shade]") as HTMLElement,
        index,
        lift: 0,
        rx: 0,
        ry: 0,
        trx: 0,
        try_: 0,
        depth: 0,
        z: "",
        op: "",
        shadeOp: "",
      });
    });
    cardsRef.current = allCards;
    if (allCards.length === 0) return undefined;

    let activeCards: OrbitCard[] = allCards;

    const reduced = prefersReducedMotion();

    const state = {
      phase: 0,
      tilt: -0.1,
      velocity: 0,
      dragging: false,
      dragX: 0,
      dragStartY: 0,
      dragTime: 0,
      dragMoved: 0,
      dragSign: -1,
      targetX: 0,
      targetY: 0,
      pointerX: 0,
      pointerY: 0,
      spin: reduced ? 0 : 0.13,
      scrollScale: 1,
      paused: false,
      visible: true,
      last: 0,
      hot: null as OrbitCard | null,
    };

    const metrics = {
      width: 0,
      height: 0,
      cx: 0,
      baseCy: 0,
      cy: 0,
      rx: 0,
      ry: 0,
      top: 0,
    };

    const clamp = (min: number, max: number, value: number) =>
      Math.min(max, Math.max(min, value));

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const coreRect = core.getBoundingClientRect();
      const stageRect = ring.parentElement?.getBoundingClientRect() ?? rect;
      metrics.width = rect.width;
      metrics.height = rect.height;
      metrics.top = rect.top + window.scrollY;
      metrics.cx = stageRect.left - rect.left + stageRect.width / 2;
      metrics.baseCy = coreRect.top + coreRect.height / 2 - rect.top;
      // Phone: lift the ring slightly so the lowest card never reaches the
      // hint/pause row pinned to the bottom of the stage.
      if (metrics.width < 768) {
        metrics.baseCy -= metrics.height * 0.035;
      }
      metrics.cy = metrics.baseCy;

      // Card density by device breakpoint:
      // Phone (< 768px): 6 cards on a tighter ellipse — a denser ring that still
      //   leaves every card clear of its neighbours (5 on very short viewports).
      // Tablet (768px - 1024px): medium density (8 cards) — balanced ring without crowding
      // Desktop (>= 1024px): full catalogue density
      const phoneCount = metrics.height < 640 ? 8 : 9;
      const targetCount =
        metrics.width < 768
          ? Math.min(phoneCount, allCards.length)
          : metrics.width < 1024
            ? Math.min(8, allCards.length)
            : allCards.length;

      activeCards = allCards.slice(0, targetCount);

      allCards.forEach((card, i) => {
        if (i < targetCount) {
          card.index = i;
          // Inline display wins over the per-index `hidden md:block` /
          // `hidden lg:block` classes, so measure() is the single source of
          // truth for how many cards the ring shows.
          card.el.style.display = "block";
          card.el.style.pointerEvents = "";
        } else {
          card.el.style.display = "none";
          card.el.style.pointerEvents = "none";
          card.el.style.opacity = "0";
        }
      });

      if (metrics.width < 768) {
        // Phone: large ellipse scaled to screen height so cards orbit well
        // clear of the centred search box instead of sitting under it.
        metrics.rx = Math.max(200, Math.min(290, metrics.height * 0.34));
        metrics.ry = Math.max(220, Math.min(340, metrics.height * 0.42));
      } else if (metrics.width < 1024) {
        // Tablet: medium radius for 8 cards
        metrics.rx = Math.max(220, Math.min(360, stageRect.width * 0.5));
        metrics.ry = Math.max(160, Math.min(300, metrics.height * 0.36));
      } else {
        // Desktop: wide cinematic spread
        metrics.rx = Math.max(280, stageRect.width * 0.52);
        metrics.ry = Math.max(180, metrics.height * 0.4);
      }
    };

    const render = () => {
      const ringTilt = state.tilt + state.pointerX * 0.07;
      const cosTilt = Math.cos(ringTilt);
      const sinTilt = Math.sin(ringTilt);

      activeCards.forEach((card) => {
        const angle = state.phase + (card.index / activeCards.length) * Math.PI * 2;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const radiusX = metrics.rx * cos * state.scrollScale;
        const radiusY = metrics.ry * sin * state.scrollScale;

        const x = metrics.cx + radiusX * cosTilt - radiusY * sinTilt;
        const y = metrics.cy + radiusX * sinTilt + radiusY * cosTilt;

        const depth = (sin + 1) / 2;
        card.depth = depth;

        const isHot = state.hot === card;
        card.lift += ((isHot ? 1 : 0) - card.lift) * 0.18;

        const maxDepthScale = metrics.width < 768 ? 0.36 : 0.62;
        let scale = (metrics.width < 768 ? 0.7 : 0.5) + depth * maxDepthScale;
        scale += (Math.max(scale, 1) * 1.15 - scale) * card.lift;

        const yaw = -cos * 24 * (1 - card.lift);

        card.el.style.transform = `perspective(1400px) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)}) rotateY(${yaw.toFixed(1)}deg) rotateZ(${(ringTilt * 20 * (1 - card.lift)).toFixed(2)}deg)`;

        const zIndex = card.lift > 0.02 ? 900 : 10 + Math.round(depth * 60);
        if (zIndex.toString() !== card.z) {
          card.el.style.zIndex = String(zIndex);
          card.z = String(zIndex);
        }

        const opacity = Math.min(1, (0.35 + depth * 0.65) * (1 - card.lift * 0.15));
        if (opacity.toFixed(2) !== card.op) {
          // Dim the poster (tilt) with depth, but keep the card container
          // (and its caption/name) fully opaque so the name stays readable.
          card.tilt.style.opacity = opacity.toFixed(2);
          card.el.style.opacity = "1";
          card.op = opacity.toFixed(2);
        }

        const shade = Math.min(0.85, (1 - depth) * 0.75) * (1 - card.lift);
        if (shade.toFixed(2) !== card.shadeOp) {
          card.shade.style.opacity = shade.toFixed(2);
          card.shadeOp = shade.toFixed(2);
        }

        const targetRx = isHot ? card.trx : 0;
        const targetRy = isHot ? card.try_ : 0;
        card.rx += (targetRx - card.rx) * 0.18;
        card.ry += (targetRy - card.ry) * 0.18;
        if (card.lift > 0.001 || Math.abs(card.rx) > 0.05 || Math.abs(card.ry) > 0.05) {
          card.tilt.style.transform = `rotateX(${card.rx.toFixed(2)}deg) rotateY(${card.ry.toFixed(2)}deg)`;
        }
      });
    };

    let frame = 0;
    const tick = (time: number) => {
      frame = 0;
      const delta = Math.min(0.05, (time - state.last) / 1000);
      state.last = time;

      if (!state.paused && !state.dragging) {
        state.phase -= state.spin * delta;
      }
      if (!state.dragging) {
        state.velocity *= Math.exp(-delta * 1.4);
      }
      state.phase -= state.velocity * delta;

      state.pointerX += (state.targetX - state.pointerX) * 0.12;
      state.pointerY += (state.targetY - state.pointerY) * 0.12;

      const scrollProgress = clamp(
        0,
        1,
        (window.scrollY - metrics.top) / Math.max(1, metrics.height),
      );
      const scale = 1 + scrollProgress * 0.8;
      state.scrollScale = scale;
      metrics.cy = metrics.baseCy - scrollProgress * metrics.height * 0.2 + state.pointerY * 10;

      render();

      if (state.visible && !document.hidden) {
        frame = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (!frame && state.visible && !document.hidden) {
        state.last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    // Pointer interaction: hovering a card tilts it, dragging spins the ring.
    allCards.forEach((card) => {
      card.el.addEventListener("pointerenter", () => {
        if (state.dragging) return;
        if (state.hot && state.hot !== card) {
          state.hot.el.classList.remove("is-hot");
        }
        state.hot = card;
        card.el.classList.add("is-hot");
      });

      card.el.addEventListener("pointerleave", () => {
        if (state.hot === card) {
          state.hot = null;
          card.el.classList.remove("is-hot");
          card.trx = 0;
          card.try_ = 0;
        }
      });

      card.el.addEventListener("pointermove", (event) => {
        const rect = card.tilt.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        card.try_ = (px - 0.5) * 26;
        card.trx = -(py - 0.5) * 26;
        card.tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    });

    section.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("a, button")) return;
      const rect = section.getBoundingClientRect();
      state.dragging = true;
      state.dragX = event.clientX;
      state.dragStartY = event.clientY;
      state.dragTime = performance.now();
      state.dragMoved = 0;
      state.dragSign = event.clientY - rect.top > metrics.cy ? -1 : 1;
      state.velocity *= 0.2;
    });

    const onPointerMove = (event: PointerEvent) => {
      if (!state.dragging) return;
      const now = performance.now();
      const dx = event.clientX - state.dragX;
      const elapsed = Math.max(1, now - state.dragTime) / 1000;
      state.dragX = event.clientX;
      state.dragTime = now;
      state.dragMoved += Math.abs(dx);

      const delta = (state.dragSign * dx) / (metrics.rx * 0.85);
      state.phase += delta;
      state.velocity = state.velocity * 0.6 - (delta / elapsed) * 0.4;

      if (state.dragMoved > 6) {
        hintRef.current?.classList.add("is-gone");
      }
    };

    const onPointerUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      state.velocity = clamp(-7, 7, state.velocity);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    pauseRef.current?.addEventListener("click", () => {
      state.paused = !state.paused;
      setPaused(state.paused);
      pauseRef.current?.setAttribute("aria-pressed", String(state.paused));
      if (pauseRef.current) {
        pauseRef.current.textContent = state.paused ? "Play motion" : "Pause motion";
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible) start();
      },
      { threshold: 0.01 },
    );
    observer.observe(section);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(section);
    resizeObserver.observe(core);

    measure();
    render();
    start();

    if (!reduced) {
      gsap.fromTo(
        activeCards.map((card) => card.el),
        { opacity: 0, scale: 0.7 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
          delay: 0.2,
          stagger: { each: 0.05, from: "random" },
          immediateRender: false,
        },
      );
    }

    const hideHint = window.setTimeout(() => hintRef.current?.classList.add("is-gone"), 14000);

    return () => {
      window.clearTimeout(hideHint);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [places, journeys]);

  return (
    <section
      ref={sectionRef}
      id="jy-hero"
      className="jy-orbit scroll-mt-20"
      aria-labelledby="jy-hero-title"
    >
      <div className="jy-orbit-stage">
        <div ref={ringRef} className="jy-orbit-ring" aria-hidden="true">
          {journeys.map((pkg, index) => {
            const densityClass =
              index >= 8
                ? "hidden lg:block"
                : index >= 5
                  ? "hidden md:block"
                  : "";
            return (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.slug}`}
                data-orbit-card
                className={`jy-orbit-card ${densityClass}`}
                aria-label={`${pkg.title} — ${cleanDuration(pkg.duration)}, ${placeLine(pkg)}. Open the itinerary.`}
              >
              <span className="jy-orbit-tilt" data-orbit-tilt>
                <Image
                  src={getPackageCardImage(pkg.slug)}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 450px, 320px"
                  quality={90}
                  className="object-cover"
                />
                <span className="jy-orbit-veil" aria-hidden="true" />
                <span className="jy-orbit-top" aria-hidden="true">
                  <span className="jy-orbit-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="jy-orbit-days">{cleanDuration(pkg.duration)}</span>
                </span>
                <span className="jy-orbit-label">
                  <span className="jy-orbit-name">{pkg.title}</span>
                  <span className="jy-orbit-sub">{placeLine(pkg)}</span>
                  <span className="jy-orbit-cta" aria-hidden="true">
                    View journey<span aria-hidden="true">&nbsp;&rarr;</span>
                  </span>
                </span>
                <span className="jy-orbit-foil" />
                <span className="jy-orbit-glare" />
                <span className="jy-orbit-shade" data-orbit-shade />
              </span>
              <span className="jy-orbit-caption">
                <span className="jy-orbit-caption-title">{pkg.title}</span>
                <span className="jy-orbit-caption-meta">
                  <span>{pkg.category}</span>
                  <span>{cleanDuration(pkg.duration)}</span>
                </span>
              </span>
            </Link>
            );
          })}
        </div>

        <div ref={coreRef} className="jy-orbit-core">
          <h1
            id="jy-hero-title"
            className="mb-4 font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-[var(--color-wild-orange)]"
          >
            Find your journey
          </h1>

          {/* Search field — the reelipse-style primary action */}
          <form
            className="mt-5 flex w-full max-w-[17.5rem] items-center gap-2.5 rounded-full bg-[var(--color-wild-orange)] px-4 py-2 text-left font-medium text-[#0C1617] shadow-[0_0_40px_-14px_var(--color-wild-orange)] transition-colors hover:bg-[var(--color-wild-orange-hover)] sm:mt-7 sm:max-w-lg sm:gap-3 sm:px-6 sm:py-4 sm:text-base sm:shadow-[0_0_60px_-10px_var(--color-wild-orange)]"
            action="/journeys#catalogue"
            method="get"
            role="search"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
              className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <label htmlFor="jy-search" className="sr-only">
              Search journeys by place or interest
            </label>
            <input
              id="jy-search"
              name="q"
              type="search"
              placeholder="Search any journey, place or interest"
              className="min-h-[44px] min-w-0 flex-1 bg-transparent py-1 font-sans text-base text-[#0C1617] placeholder:text-[#0C1617]/70 focus:outline-none sm:py-2"
            />
            <kbd className="hidden rounded bg-[#0C1617]/15 px-2 py-0.5 font-sans text-sm sm:inline">
              /
            </kbd>
          </form>

          <div className="mt-5 hidden flex-wrap justify-center gap-2 md:flex">
            {places.slice(0, 4).map((place) => (
              <Link key={place.name} href={place.href} className="jy-chip">
                {place.name}
              </Link>
            ))}
            <Link href="#catalogue" className="jy-chip">
              All {allPackages.length} journeys
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex items-center justify-between px-4 md:px-8">
        <p ref={hintRef} className="jy-orbit-hint">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="hidden [@media(pointer:fine)]:inline">Drag to spin the orbit</span>
          <span className="[@media(pointer:fine)]:hidden">Swipe to spin the orbit</span>
        </p>
        <button
          ref={pauseRef}
          type="button"
          className="jy-orbit-pause pointer-events-auto"
          aria-pressed={paused}
        >
          {paused ? "Play motion" : "Pause motion"}
        </button>
      </div>
    </section>
  );
}
