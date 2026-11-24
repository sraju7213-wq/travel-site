"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";
import type { GalleryImage } from "@/data/catalogue";

interface PackageGalleryProps {
  images: GalleryImage[];
  title: string;
  /** Optional controlled lightbox state (lets a parent header open the gallery). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PackageGallery({ images, title, open, onOpenChange }: PackageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = typeof open === "boolean";
  const lightboxOpen = isControlled ? Boolean(open) : uncontrolledOpen;

  useBodyOverflowLock(lightboxOpen);

  const setLightboxOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) return null;
  const current = images[activeIndex] ?? images[0];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0C1617]">
      {/* Primary preview */}
      <div className="group relative h-60 w-full overflow-hidden sm:h-72">
        <Image
          src={current.src}
          alt={current.caption || title}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover transition-[transform,opacity] duration-700 ease-out animate-photo-enter"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between gap-3 text-xs text-white/80">
          <span className="rounded border border-white/10 bg-black/60 px-3 py-1 font-display font-medium backdrop-blur-sm">
            {current.caption}
          </span>
          <span className="shrink-0 rounded bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white/60 backdrop-blur-sm">
            {images.length} Curated Photo{images.length === 1 ? "" : "s"}
          </span>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Compact thumbnail strip */}
      <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 bg-[#0C1617] p-3 scrollbar-hide">
        {images.map((img, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show photo ${idx + 1}: ${img.caption}`}
              aria-current={isSelected}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                isSelected ? "border-brass" : "border-white/10 hover:border-brass/60"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          );
        })}
      </div>

      {/* Full-screen lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — full-screen photography`}
          className="fixed inset-0 z-[85] flex flex-col bg-black/95 backdrop-blur-lg animate-lightbox-enter"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-white">
            <p className="truncate font-serif text-lg font-bold">{title}</p>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs tabular-nums tracking-widest text-white/70">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full view"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center p-4 md:p-10">
            <div className="relative h-full w-full max-w-5xl max-h-[80vh] animate-scale-in">
              <Image
                src={current.src}
                alt={current.caption}
                fill
                quality={90}
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>

          <div className="border-t border-white/10 px-6 py-4 text-center font-display text-sm text-white/80">
            {current.caption}
          </div>
        </div>
      )}
    </div>
  );
}
