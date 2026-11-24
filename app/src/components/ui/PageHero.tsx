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
  /** "tall" gives the hero more presence on long-form pages; "full" takes full viewport height (100dvh). */
  height?: "default" | "tall" | "full";
  /** "normal" renders a contained, normally-sized image banner instead of full-bleed. */
  size?: "full" | "normal";
  /** Extra classes applied to the hero content container (e.g. to shift it upward). */
  contentClassName?: string;
  /** Extra classes applied to the hero image (e.g. to zoom in). */
  imageClassName?: string;
  /** Optional video shown on mobile instead of the still image. */
  mobileVideo?: string;
  /** Optional image shown on mobile instead of the still image (e.g. an animated GIF). */
  mobileImage?: string;
  /** Inline styles applied to the hero image (e.g. to zoom in). */
  imageStyle?: React.CSSProperties;
  /** When "top", the eyebrow is rendered as a top label instead of inline above the title. */
  eyebrowPosition?: "inline" | "top";
  /** Overrides the headline size/scale classes. Use when the title needs to fit a narrower content column. */
  titleClassName?: string;
  /** When true, the eyebrow, title and lead are hidden on phones (shown from sm up). */
  hideOnMobile?: boolean;
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
  mobileVideo,
  mobileImage,
  eyebrowPosition = "inline",
  titleClassName,
  hideOnMobile = false,
}: PageHeroProps) {
  const isCentered = align === "center";
  const isNormal = size === "normal";
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mobileVideo) return;
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [mobileVideo]);

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
      gsap.fromTo(
        items,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DURATION.slow,
          ease: EASE.expo,
          stagger: 0.1,
          delay: 0.12,
          immediateRender: false,
          clearProps: "all",
        },
      );
    }, section);

    return () => ctx.revert();
  }, [isNormal]);

  const content = (
    <>
      {eyebrowPosition === "inline" && (
        <p data-hero-item className={`font-sans text-[10px] font-medium uppercase tracking-[0.34em] text-white/70 md:text-[11px] ${hideOnMobile ? "hidden sm:block" : ""}`}>
          {eyebrow}
        </p>
      )}

      <h1
        data-hero-item
        className={`mt-5 max-w-4xl font-serif font-light leading-[1.04] tracking-normal text-white ${hideOnMobile ? "hidden sm:block" : ""} ${
          titleClassName ?? "text-[2.5rem] sm:text-6xl md:text-7xl lg:text-[5rem]"
        }`}
      >
        {title}
      </h1>

      {lead && (
        <p
          data-hero-item
          className={`mt-7 font-sans text-sm font-light leading-relaxed text-white/80 md:text-base max-w-2xl ${hideOnMobile ? "hidden sm:block" : ""}`}
        >
          {lead}
        </p>
      )}

      {(primaryCta || secondaryCta) && (
        <div data-hero-item className="mt-[55vh] flex flex-col items-center gap-4 sm:mt-10 sm:flex-row justify-start">
          {primaryCta && (
            <Link
              href={primaryCta.href}
              className="group inline-flex w-auto min-h-[30px] scale-[0.85] origin-center items-center justify-center gap-2 bg-[var(--color-wild-orange)] px-2.5 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-[#0C1617] transition-colors hover:bg-[var(--color-wild-orange-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:min-h-[44px] sm:scale-100 sm:w-auto sm:px-7 sm:py-4 sm:text-[11px]"
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
              className="inline-flex min-h-[30px] w-auto scale-[0.85] origin-center items-center justify-center border-b border-white/40 pb-1 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[44px] sm:scale-100 sm:w-auto sm:text-[11px]"
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
      data-theme-surface="dark"
      className={`relative isolate overflow-hidden ${
        isNormal
          ? "min-h-[560px] md:min-h-[740px] flex flex-col justify-center items-center"
          : `flex flex-col justify-center overflow-hidden ${
              height === "full"
                ? "min-h-screen min-h-[100dvh]"
                : height === "tall"
                ? "min-h-[88vh] md:min-h-[92vh]"
                : "min-h-[78vh] md:min-h-[86vh]"
            }`
      }`}
    >
      {isNormal ? (
        // Normal size: contained image banner, centred, modest height.
        <div className="mx-auto w-full max-w-[1180px] h-[520px] md:h-[720px] rounded-[1rem] overflow-hidden relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            preload={priority}
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
          <div ref={imageRef} className={`absolute inset-0 will-change-transform ${mobileVideo || mobileImage ? "hidden sm:block" : ""}`}>
            <Image
              src={image}
              alt={imageAlt}
              fill
              preload={priority}
              sizes="100vw"
              className={`object-cover object-center ${imageClassName ?? ""}`}
            style={imageStyle}
            />
          </div>

          {mobileImage && (
            <div className="absolute inset-0 sm:hidden">
              <Image src={mobileImage} alt={imageAlt} fill preload={priority} sizes="100vw" className="object-cover object-center" />
            </div>
          )}

          {mobileVideo && (
            <video
              ref={videoRef}
              src={mobileVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover sm:hidden"
              aria-hidden="true"
            />
          )}

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
               className={`absolute top-6 z-10 ${isCentered ? "inset-x-0 text-center" : "left-5 md:left-10"} ${hideOnMobile ? "hidden sm:block" : ""}`}
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
                  <span className="mt-1 block font-sans text-[10px] uppercase tracking-[0.3em] text-white/70">
                    {item.label}
                  </span>
                </p>
              ))}
            </div>
          )}

          <div
            ref={contentRef}
            className={`relative z-10 mx-auto w-full max-w-[1240px] px-5 pb-20 pt-48 sm:pt-36 md:px-10 md:pb-24 md:pt-44 ${isCentered ? "text-center" : "text-left"} ${contentClassName ?? ""}`}
          >
            {content}
          </div>
        </>
      )}

      {footer && <div className="contents">{footer}</div>}

      {scrollCue && !isNormal && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit flex-col items-center gap-2"
        >
          <span className="font-sans text-[9px] uppercase tracking-[0.34em] text-white/60">Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-white/20">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-4 bg-[var(--color-wild-orange)]" />
          </span>
        </div>
      )}
    </section>
  );
}
