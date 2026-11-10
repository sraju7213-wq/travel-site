"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

export interface PageHeroMeta {
  label: string;
  value: string;
}

interface PageHeroProps {
  image: string;
  imageAlt: string;
  /** Small uppercase line above the title. */
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  /** Coordinate-style motif, shown top-left on wide screens. */
  meta?: PageHeroMeta[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Left-align the text block instead of centring it. */
  align?: "center" | "left";
  /** Show the scrolling cue at the foot of the hero. */
  scrollCue?: boolean;
  /** Optional element pinned to the bottom of the hero (e.g. a stat strip). */
  footer?: React.ReactNode;
  priority?: boolean;
  /** "tall" gives the hero more presence on long-form pages. */
  height?: "default" | "tall";
  /** "normal" renders a contained, normally-sized image banner instead of full-bleed. */
  size?: "full" | "normal";
  /** Extra classes applied to the hero content container (e.g. to shift it upward). */
  contentClassName?: string;
  /** Extra classes applied to the hero image (e.g. to zoom in). */
  imageClassName?: string;
  /** Inline styles applied to the hero image (e.g. to zoom in). */
  imageStyle?: React.CSSProperties;
  /** When "top", the eyebrow is rendered as a top label instead of inline above the title. */
  eyebrowPosition?: "inline" | "top";
}

/**
 * Cinematic page hero: full-bleed photograph, oversized serif title and a
 * restrained pair of actions — the rhythm used across the marketing pages.
 */
export default function PageHero({
  image,
  imageAlt,
  eyebrow,
  title,
  lead,
  meta,
  primaryCta,
  secondaryCta,
  align = "center",
  scrollCue = false,
  footer,
  priority = true,
  height = "default",
  size = "full",
  contentClassName,
  imageClassName,
  imageStyle,
  eyebrowPosition = "inline",
}: PageHeroProps) {
  const isCentered = align === "center";
  const isNormal = size === "normal";
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageEl = imageRef.current;
    const content = contentRef.current;
    if (!section || !imageEl || !content || prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const items = content.querySelectorAll<HTMLElement>("[data-hero-item]");
      // Only animate scale on full-bleed heroes; normal heroes use a static contained image.
      if (!isNormal) {
        gsap.fromTo(imageEl, { scale: 1.12, clipPath: "inset(0% 0% 0% 0%)" }, {
          scale: 1,
          duration: DURATION.cinematic,
          ease: EASE.expo,
        });
      }
      gsap.from(items, {
        y: 28,
        opacity: 0,
        duration: DURATION.slow,
        ease: EASE.expo,
        stagger: 0.1,
        delay: 0.12,
        clearProps: "all",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const content = (
    <>
      {eyebrowPosition === "inline" && (
        <p data-hero-item className="font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-white/70 md:text-[11px]">
          {eyebrow}
        </p>
      )}

      <h1
        data-hero-item
        className={`mt-5 font-serif text-[2.5rem] font-light leading-[1.04] tracking-normal text-white sm:text-6xl md:text-7xl lg:text-[5rem] max-w-4xl`}
      >
        {title}
      </h1>

      {lead && (
        <p
          data-hero-item
          className={`mt-7 font-sans text-sm font-light leading-relaxed text-white/80 md:text-base max-w-2xl`}
        >
          {lead}
        </p>
      )}

      {(primaryCta || secondaryCta) && (
        <div data-hero-item className="mt-10 flex flex-col items-center gap-4 sm:flex-row justify-start">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="group inline-flex w-full items-center justify-center gap-4 bg-[var(--color-wild-orange)] px-7 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[var(--color-wild-orange-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:w-auto"
            >
              <span>{primaryCta.label}</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex w-full items-center justify-center border-b border-white/40 pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </>
  );

  return (
    <section
      ref={sectionRef}
      className={`relative isolate overflow-hidden ${
        isNormal
          ? "min-h-[560px] md:min-h-[740px] flex flex-col justify-center items-center"
          : `flex flex-col justify-center overflow-hidden ${height === "tall" ? "min-h-[88vh] md:min-h-[92vh]" : "min-h-[78vh] md:min-h-[86vh]"}`
      }`}
    >
      {isNormal ? (
        // Normal size: contained image banner, centred, modest height.
        <div className="mx-auto w-full max-w-[1180px] h-[520px] md:h-[720px] rounded-[1rem] overflow-hidden relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 1280px) 100vw, 1180px"
            className={`object-cover object-center ${imageClassName ?? ""}`}
            style={imageStyle}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#071213]/60 via-transparent to-[#071213]/40" />
          <div
            ref={contentRef}
            className={`absolute left-0 bottom-0 z-10 w-full p-6 md:p-10 pt-12 pb-12 ${isCentered ? "text-center" : "text-left"} ${contentClassName ?? ""}`}
          >
            {content}
          </div>
        </div>
      ) : (
        <>
          <div ref={imageRef} className="absolute inset-0 will-change-transform">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority={priority}
              sizes="100vw"
              className={`object-cover object-center ${imageClassName ?? ""}`}
            style={imageStyle}
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.6)_100%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#071213] via-transparent to-black/40"
           />

           {eyebrowPosition === "top" && (
             <div
               className={`absolute top-6 z-10 ${isCentered ? "inset-x-0 text-center" : "left-5 md:left-10"}`}
             >
               <p className="font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-white/70 md:text-[11px]">
                 {eyebrow}
               </p>
             </div>
           )}

          {meta && meta.length > 0 && (
            <div className="absolute left-5 top-28 z-10 hidden md:left-10 md:block">
              {meta.map((item) => (
                <p key={item.label} className="font-mono text-[11px] tracking-[0.22em] text-white/60">
                  {item.value}
                  <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {item.label}
                  </span>
                </p>
              ))}
            </div>
          )}

          <div
            ref={contentRef}
            className={`relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-20 pt-36 md:px-10 md:pb-24 md:pt-44 ${isCentered ? "text-center" : "text-left"} ${contentClassName ?? ""}`}
          >
            {content}
          </div>
        </>
      )}

      {footer && <div className="relative z-10">{footer}</div>}

      {scrollCue && !isNormal && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit flex-col items-center gap-2"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-white/45">Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/20">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-4 bg-[var(--color-wild-orange)]" />
          </span>
        </div>
      )}
    </section>
  );
}
