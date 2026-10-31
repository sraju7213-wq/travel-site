"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryImage } from "@/data/catalogue";

interface PackageGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function PackageGallery({ images, title }: PackageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
  }, [lightboxOpen, images.length]);

  if (!images || images.length === 0) return null;
  const current = images[activeIndex] ?? images[0];

  return (
    <section className="mb-14" aria-label="Journey photography gallery">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="subtitle-large mb-1 text-brass">Journey Gallery</p>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Visual Highlights</h2>
        </div>
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="inline-flex items-center gap-2 rounded-button border border-border bg-white px-3.5 py-1.5 text-xs font-display font-semibold uppercase tracking-wider text-charcoal transition-all hover:border-brass hover:text-brass shadow-sm cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-current stroke-2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Full View ({images.length} Photos)
        </button>
      </div>

      {/* Main Feature Display */}
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] border border-border/80 bg-charcoal shadow-2xl">
        <Image
          src={current.src}
          alt={current.caption || title}
          fill
          priority
          sizes="(min-width: 1280px) 1100px, 100vw"
          className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Previous / Next Overlays */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brass hover:border-brass hover:scale-110 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current stroke-[2.5]">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brass hover:border-brass hover:scale-110 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="stroke-current stroke-[2.5]">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {/* Caption Banner */}
        <div className="absolute inset-x-6 bottom-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 text-white">
          <p className="font-display text-sm font-medium text-white/90 drop-shadow-md max-w-xl">
            {current.caption}
          </p>
          <span className="rounded-pill bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-display tabular-nums tracking-widest text-white/80 border border-white/10 shrink-0">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Interactive Thumbnail Selector Strip */}
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={img.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Show photo ${idx + 1}`}
                className={`group relative aspect-[4/3] overflow-hidden rounded-[0.75rem] border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-brass shadow-md scale-102 ring-2 ring-brass/30"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-white/40"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photography lightbox"
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 backdrop-blur-lg animate-fade-in"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-white">
            <p className="font-serif text-lg font-bold truncate max-w-md">{title}</p>
            <div className="flex items-center gap-4">
              <span className="text-xs font-display tabular-nums tracking-widest text-white/70">
                {activeIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close full view"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-brass hover:border-brass cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex-1 flex items-center justify-center p-4 md:p-10">
            <div className="relative h-full w-full max-w-5xl max-h-[80vh]">
              <Image
                src={current.src}
                alt={current.caption}
                fill
                quality={95}
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
                  className="absolute left-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brass hover:border-brass cursor-pointer"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  aria-label="Next image"
                  className="absolute right-6 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-brass hover:border-brass cursor-pointer"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>

          {/* Lightbox Caption Footer */}
          <div className="border-t border-white/10 px-6 py-4 text-center text-white/80 font-display text-sm">
            {current.caption}
          </div>
        </div>
      )}
    </section>
  );
}
