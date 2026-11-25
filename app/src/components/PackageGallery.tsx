"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";
import type { GalleryImage } from "@/data/catalogue";

interface PackageGalleryProps {
  images: GalleryImage[];
  title: string;
  /** Optional controlled lightbox state (lets a parent header open the gallery). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type Point = { x: number; y: number };
type Gesture = {
  startX: number;
  startY: number;
  startDistance: number;
  startZoom: number;
  startPan: Point;
  pointers: number;
  dragged: boolean;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const SWIPE_THRESHOLD = 48;

const subscribeToDocument = () => () => {};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path
        d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="viewer-spinner" aria-hidden="true" />
  );
}

export default function PackageGallery({ images, title, open, onOpenChange }: PackageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // The lightbox is portalled to body: an animated ancestor would otherwise
  // become the containing block for position: fixed and push it off-screen.
  const portalTarget = useSyncExternalStore(
    subscribeToDocument,
    () => (typeof document === "undefined" ? null : document.body),
    () => null,
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previewTriggerRef = useRef<HTMLButtonElement>(null);
  const thumbRailRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<Gesture | null>(null);
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
  const wasOpenRef = useRef(false);

  const isControlled = typeof open === "boolean";
  const lightboxOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const count = images.length;
  const current = images[activeIndex] ?? images[0];

  useBodyOverflowLock(lightboxOpen);

  const setLightboxOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      const next = (index + count) % count;
      setActiveIndex(next);
      setZoom(MIN_ZOOM);
      setPan({ x: 0, y: 0 });
      setLoading(true);
      setFailedSrc(null);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  const changeZoom = useCallback((delta: number) => {
    setZoom((prev) => {
      const next = clamp(Number((prev + delta).toFixed(2)), MIN_ZOOM, MAX_ZOOM);
      if (next === MIN_ZOOM) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Keyboard navigation, zoom shortcuts and a focus trap while the dialog is open.
  useEffect(() => {
    if (!lightboxOpen || !current) return;

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          setLightboxOpen(false);
          break;
        case "ArrowRight":
          event.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          goPrev();
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(count - 1);
          break;
        case "+":
        case "=":
          event.preventDefault();
          changeZoom(0.5);
          break;
        case "-":
          event.preventDefault();
          changeZoom(-0.5);
          break;
        case "0":
          event.preventDefault();
          resetView();
          break;
        case "Tab": {
          const focusables = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>(
              'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
            ) ?? [],
          ).filter((el) => el.offsetParent !== null);
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
          break;
        }
        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, current, count, goNext, goPrev, goTo, changeZoom, resetView, setLightboxOpen]);

  // Move focus into the dialog on open and back to its trigger on close.
  useEffect(() => {
    if (!lightboxOpen) {
      if (wasOpenRef.current) previewTriggerRef.current?.focus();
      wasOpenRef.current = false;
      return;
    }
    wasOpenRef.current = true;
    const frame = requestAnimationFrame(() => {
      dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [lightboxOpen]);

  // Keep the selected thumbnail visible in the rail on every platform.
  useEffect(() => {
    const rail = thumbRailRef.current;
    const active = rail?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    if (!rail || !active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    active.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [activeIndex]);

  const pointerPosition = (event: ReactPointerEvent): Point => ({ x: event.clientX, y: event.clientY });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const point = pointerPosition(event);
    pointersRef.current.set(event.pointerId, point);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Synthetic or already-released pointers still navigate correctly.
    }
    const points = Array.from(pointersRef.current.values());
    gestureRef.current = {
      startX: point.x,
      startY: point.y,
      startDistance: points.length > 1 ? distance(points[0], points[1]) : 0,
      startZoom: zoom,
      startPan: pan,
      pointers: points.length,
      dragged: false,
    };
    if (zoom > MIN_ZOOM) setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || !pointersRef.current.has(event.pointerId)) return;
    pointersRef.current.set(event.pointerId, pointerPosition(event));
    const points = Array.from(pointersRef.current.values());

    if (points.length > 1 && gesture.pointers > 1) {
      const scale = distance(points[0], points[1]) / Math.max(gesture.startDistance, 1);
      setZoom(clamp(Number((gesture.startZoom * scale).toFixed(2)), MIN_ZOOM, MAX_ZOOM));
      gesture.dragged = true;
      return;
    }

    if (zoom > MIN_ZOOM) {
      const dx = points[0].x - gesture.startX;
      const dy = points[0].y - gesture.startY;
      const rect = stageRef.current?.getBoundingClientRect();
      const limitX = ((rect?.width ?? 0) * (zoom - 1)) / 2;
      const limitY = ((rect?.height ?? 0) * (zoom - 1)) / 2;
      setPan({
        x: clamp(gesture.startPan.x + dx, -limitX, limitX),
        y: clamp(gesture.startPan.y + dy, -limitY, limitY),
      });
      gesture.dragged = true;
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    pointersRef.current.delete(event.pointerId);
    setDragging(false);
    if (!gesture) return;

    const point = pointerPosition(event);
    const dx = point.x - gesture.startX;
    const dy = point.y - gesture.startY;

    if (gesture.pointers === 1 && zoom === MIN_ZOOM && !gesture.dragged) {
      const now = Date.now();
      const last = lastTapRef.current;
      if (now - last.time < 320 && distance(point, { x: last.x, y: last.y }) < 32) {
        setZoom(2.5);
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        return;
      }
      lastTapRef.current = { time: now, x: point.x, y: point.y };
    }

    if (gesture.pointers === 1 && zoom === MIN_ZOOM && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) goNext();
      else goPrev();
      lastTapRef.current = { time: 0, x: 0, y: 0 };
    }
    gestureRef.current = null;
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await dialogRef.current?.requestFullscreen?.();
    } catch {
      // Fullscreen is optional — the fixed dialog remains fully usable.
    }
  };

  const retryImage = () => {
    setFailedSrc(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  if (!images || count === 0) return null;

  const imageNode = (source: string, caption: string, mode: "preview" | "lightbox") => {
    const failed = failedSrc === source;
    return (
      <>
        <Image
          key={`${source}-${reloadKey}`}
          src={source}
          alt={caption || title}
          fill
          preload={mode === "preview" && activeIndex === 0}
          loading={mode === "lightbox" ? "eager" : undefined}
          quality={mode === "lightbox" ? 90 : undefined}
          sizes={mode === "lightbox" ? "100vw" : "(min-width: 1024px) 66vw, 100vw"}
          className={mode === "lightbox" ? "object-contain" : "object-cover transition-[transform,opacity] duration-700 ease-out animate-photo-enter"}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailedSrc(source);
          }}
        />
        {loading && !failed && (
          <div className="absolute inset-0 grid place-items-center bg-white/[0.03]" aria-hidden="true">
            <Spinner />
          </div>
        )}
        {failed && (
          <div className="absolute inset-0 grid place-items-center bg-black/60 px-6 text-center">
            <div>
              <p className="font-display text-sm text-white/70">This photo could not be loaded.</p>
              <button
                type="button"
                onClick={retryImage}
                className="mt-3 min-h-11 rounded-full border border-brass/60 px-5 font-display text-xs uppercase tracking-wider text-brass transition hover:bg-brass hover:text-[#0C1617] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

        const dialog = lightboxOpen && current ? (
        <div
          ref={dialogRef}
          data-theme-surface="dark"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — full-screen photography`}
          className="viewer-dialog fixed inset-0 z-[85] flex flex-col bg-[#050A0B] animate-viewer-enter"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-white sm:px-6 sm:py-4">
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold sm:text-lg">{title}</p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums tracking-widest text-white/55">
                {activeIndex + 1} / {count}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {count > 1 && (
                <>
                  <button type="button" onClick={() => changeZoom(-0.5)} disabled={zoom === MIN_ZOOM} aria-label="Zoom out" className="viewer-tool hidden sm:flex">&minus;</button>
                  <button type="button" onClick={() => changeZoom(0.5)} disabled={zoom === MAX_ZOOM} aria-label="Zoom in" className="viewer-tool hidden sm:flex">+</button>
                  <button type="button" onClick={resetView} aria-label="Reset zoom" className="viewer-tool hidden font-mono text-xs sm:flex">1:1</button>
                </>
              )}
              <button type="button" onClick={toggleFullscreen} aria-label="Toggle native fullscreen" className="viewer-tool hidden sm:flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                data-autofocus
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full view"
                className="viewer-tool text-xl leading-none"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="viewer-stage relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 py-3 sm:px-6 sm:py-6">
            <div
              ref={stageRef}
              className="relative h-full w-full max-w-6xl select-none"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transition: dragging ? "none" : "transform 220ms cubic-bezier(0.16,1,0.3,1)",
                cursor: zoom > MIN_ZOOM ? (dragging ? "grabbing" : "grab") : "zoom-in",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={() => (zoom > MIN_ZOOM ? resetView() : setZoom(2.5))}
            >
              {imageNode(current.src, current.caption, "lightbox")}
            </div>

            {count > 1 && (
              <>
                <button type="button" onClick={goPrev} aria-label="Previous photo" className="viewer-stage-nav left-2 sm:left-5">
                  <Chevron direction="left" />
                </button>
                <button type="button" onClick={goNext} aria-label="Next photo" className="viewer-stage-nav right-2 sm:right-5">
                  <Chevron direction="right" />
                </button>
              </>
            )}
          </div>

          <div className="border-t border-white/10 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-center sm:px-6">
            <p className="mx-auto max-w-3xl font-display text-xs leading-relaxed text-white/75 sm:text-sm">{current.caption}</p>
            <p className="mt-1 font-display text-[10px] uppercase tracking-[0.16em] text-white/35">
              Pinch or double-tap to zoom · swipe to browse · Esc to close
            </p>
            {/* Explicit thumbnail dimensions prevent fill-image layers escaping the scroll clip in Chromium. */}
            <div className="mx-auto mt-3 flex max-w-2xl snap-x snap-mandatory gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Go to photo ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={`h-11 w-16 shrink-0 snap-center overflow-hidden rounded border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    index === activeIndex ? "border-brass" : "border-white/15 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={image.src} alt="" width={64} height={44} sizes="64px" loading="lazy" className="block h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {`Photo ${activeIndex + 1} of ${count}. ${current.caption}`}
          </p>
        </div>
      ) : null;

  return (
    <div data-theme-surface="dark" className="overflow-hidden rounded-xl border border-white/10 bg-[#0C1617]">
      {/* Preview — tap anywhere to open the full viewer */}
      <div className="group relative h-64 w-full overflow-hidden sm:h-80 lg:h-[26rem]">
        <button
          ref={previewTriggerRef}
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open full-screen gallery for ${title}, ${count} photos`}
          className="absolute inset-0 z-10 h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass"
        />
        <div className="viewer-preview relative h-full w-full">{imageNode(current.src, current.caption, "preview")}</div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 text-white sm:inset-x-5 sm:bottom-4">
          <span className="max-w-[75%] rounded-md border border-white/10 bg-black/65 px-3 py-2 font-display text-[11px] font-medium leading-snug backdrop-blur-sm sm:text-xs">
            {current.caption}
          </span>
          <span className="shrink-0 rounded-md bg-black/65 px-2.5 py-1.5 font-mono text-[11px] tabular-nums text-white/70 backdrop-blur-sm">
            {activeIndex + 1}/{count}
          </span>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous photo"
              className="viewer-nav absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:left-4"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next photo"
              className="viewer-nav absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:right-4"
            >
              <Chevron direction="right" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail filmstrip — scroll-snap, swipeable, with 48px+ targets.
          Explicit image dimensions keep thumbnail layers inside the scroll clip. */}
      <div
        ref={thumbRailRef}
        className="viewer-filmstrip flex snap-x snap-mandatory gap-2 overflow-x-auto border-t border-white/10 bg-[#0C1617] p-3"
        role="group"
        aria-label="Choose a photo"
      >
        {images.map((image, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={image.src}
              data-index={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photo ${index + 1} of ${count}: ${image.caption}`}
              aria-current={selected}
              className={`relative h-14 w-20 shrink-0 snap-center overflow-hidden rounded-md border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:h-16 sm:w-24 ${
                selected ? "border-brass" : "border-white/10 opacity-70 hover:border-brass/70 hover:opacity-100"
              }`}
            >
              <Image src={image.src} alt="" width={96} height={64} sizes="96px" loading="lazy" className="block h-full w-full object-cover" />
              <span className="absolute bottom-0.5 right-1 rounded bg-black/70 px-1 font-mono text-[9px] tabular-nums text-white/80">
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>

      <p className="border-t border-white/10 px-4 py-2.5 text-center font-display text-[11px] tracking-wide text-white/45">
        Swipe, use the arrows or the arrow keys to explore · tap a photo to expand
      </p>

      {portalTarget && dialog ? createPortal(dialog, portalTarget) : null}
    </div>
  );
}
