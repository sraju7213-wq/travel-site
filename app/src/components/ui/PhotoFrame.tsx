"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PhotoFrame
 * ----------
 * The house photograph treatment. Every image in the product gets the same
 * three-part behaviour so photography never sits flat on the page:
 *
 *  1. **Reveal** — the frame is uncovered by a clip-path curtain that lifts
 *     from the bottom, while the photograph itself drifts from 1.12 scale
 *     down to its natural size. This reads as the lens settling, not as a
 *     rectangle appearing.
 *  2. **Drift** — a slow, scrubbed parallax keeps the image moving against
 *     the page as you scroll, giving the layout depth.
 *  3. **Hover** — a gentle push-in and a vignette lift on pointer hover.
 *
 * @example
 * <PhotoFrame src="/images/destinations/kashmir-shikara.jpg" alt="Shikaras on Dal Lake" ratio="16/10" />
 */
export interface PhotoFrameProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio, e.g. "16/10" or "4/5". */
  ratio?: string;
  className?: string;
  /** Extra classes for the `<Image>` element itself. */
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Set false to skip the curtain reveal (e.g. for above-the-fold heroes). */
  reveal?: boolean;
  /** Set false to skip the scroll parallax. */
  parallax?: boolean;
  /** Set false to disable the hover push-in. */
  hoverZoom?: boolean;
  /** Extra overlay rendered above the image (captions, badges, gradients). */
  overlay?: ReactNode;
  /** Renders the photograph with a duotone wash toward the brand orange. */
  duotone?: boolean;
  /** Accessible caption announced alongside the image. */
  caption?: string;
}

export default function PhotoFrame({
  src,
  alt,
  ratio = "16/10",
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
  quality = 82,
  reveal = true,
  parallax = true,
  hoverZoom = true,
  overlay,
  duotone = false,
  caption,
}: PhotoFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const image = imageRef.current;
    if (!frame || !image) return undefined;
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      if (reveal) {
        gsap.fromTo(
          frame,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: DURATION.cinematic,
            ease: EASE.expo,
            scrollTrigger: {
              trigger: frame,
              start: "top 92%",
              once: true,
            },
          }
        );

        // The photograph settles from a slight over-scale as the curtain lifts.
        gsap.fromTo(
          image,
          { scale: 1.12 },
          {
            scale: 1,
            duration: DURATION.cinematic + 0.4,
            ease: EASE.expo,
            scrollTrigger: {
              trigger: frame,
              start: "top 92%",
              once: true,
            },
          }
        );
      }

      if (parallax) {
        gsap.fromTo(
          image,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          }
        );
      }
    }, frame);

    return () => ctx.revert();
  }, [reveal, parallax]);

  return (
    <div
      ref={frameRef}
      className={`group/photo relative overflow-hidden bg-[#0C1617] will-change-transform ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div
        ref={imageRef}
        className="absolute -inset-[8%] h-[116%] will-change-transform"
        style={{ transform: "scale(1.02)" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={quality}
          className={`object-cover transition-[transform,filter] duration-[900ms] ease-out ${
            hoverZoom ? "group-hover/photo:scale-[1.06]" : ""
          } ${duotone ? "group-hover/photo:brightness-110" : ""} ${imageClassName}`}
        />
      </div>

      {duotone && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,110,0,0.18) 0%, rgba(12,22,23,0.42) 100%)",
          }}
        />
      )}

      {overlay}

      {caption && <span className="sr-only">{caption}</span>}
    </div>
  );
}
