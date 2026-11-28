"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCES, type Experience } from "@/data/siteContent";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ExperienceCircleImage({ src, alt }: { src: string; alt: string }) {
  const circleRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const el = circleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      rx: -(y / (rect.height / 2)) * 8,
      ry: (x / (rect.width / 2)) * 8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      ref={circleRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(600px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: tilt.rx === 0 ? "transform 0.5s ease-out" : "none",
      }}
      className="relative z-20 shrink-0 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-2xl bg-[#1a1c1d] sm:-mr-24 md:-mr-32 lg:-mr-36 -mb-16 sm:mb-0 will-change-transform group/circle"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 240px, (max-width: 1024px) 360px, 400px"
        className="object-cover transition-transform duration-[900ms] ease-out group-hover/circle:scale-110"
      />
      {/* A warm wash lifts on hover so the circle feels lit from within. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,110,0,0.18),transparent_65%)] opacity-0 transition-opacity duration-700 group-hover/circle:opacity-100"
      />
      {/* Subtle ring border around circle */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none transition-colors duration-500 group-hover/circle:border-[var(--color-wild-orange,#ff6e00)]" />
    </div>
  );
}

export default function ExperienceCarousel({ experiences = EXPERIENCES }: { experiences?: Experience[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  // Duplicating experiences ensures a 100% seamless infinite scroll loop with no visual jump
  const duplicatedExperiences = [...experiences, ...experiences];

  // The track drifts a little slower than the raw marquee speed and eases to
  // a stop when the visitor hovers, so the motion never fights the pointer.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.slow,
          ease: EASE.expo,
          immediateRender: false,
          scrollTrigger: {
            trigger: track,
            start: "top 92%",
            once: true,
          },
        }
      );
    }, track);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-experiences py-12 md:py-16 overflow-hidden relative" id="experiences">

      {/* Parent container with scroll-container-fix to suppress scrollbars & isolate horizontal overflow */}
      <div
        role="region"
        aria-label="Curated experiences — scroll to browse"
        tabIndex={0}
        className="scroll-container-fix relative w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-wild-orange,#ff6e00)]"
      >
        {/* Subtle left & right edge gradient vignettes for seamless entry & exit */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 z-20 bg-gradient-to-r from-[var(--color-wild-darker,#221f20)] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 z-20 bg-gradient-to-l from-[var(--color-wild-darker,#221f20)] to-transparent"
        />

        {/* Continuous Horizontal Auto-Scroll Track (GPU hardware-accelerated linear infinite) */}
        <ul
          ref={trackRef}
          className="animate-slow-scroll flex gap-10 py-8 will-change-transform select-none md:gap-16"
        >
          {duplicatedExperiences.map((exp, i) => {
            const ctaLabel = exp.title.toLowerCase().includes("experience")
              ? exp.title.toUpperCase()
              : `${exp.title.toUpperCase()} EXPERIENCES`;

            return (
              <li
                key={`${exp.title}-${i}`}
                className="group shrink-0 w-[88vw] max-w-[420px] sm:w-[700px] sm:max-w-[700px] md:w-[780px] md:max-w-[780px] lg:w-[860px] lg:max-w-[860px]"
              >
                <article className="relative flex flex-col sm:flex-row items-center w-full transition-all duration-500 ease-out">
                  {/* 1. Large Circular Image overlapping the box with 3D tilt */}
                  <ExperienceCircleImage src={exp.image} alt={exp.title} />

                  {/* 2. Deep Forest Teal Content Box */}
                  <div className="relative z-10 flex-1 w-full bg-[#0d2a2d] text-white pt-20 pb-8 px-6 sm:py-10 sm:pr-8 sm:pl-28 md:py-12 md:pr-12 md:pl-36 lg:py-14 lg:pr-14 lg:pl-44 min-h-[360px] sm:min-h-[380px] md:min-h-[420px] flex flex-col justify-between rounded-sm shadow-xl border border-white/5 transition-colors duration-300 group-hover:border-white/15">
                    {/* A warm edge glow traces the card as the pointer passes. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(520px circle at 50% 0%, rgba(255,110,0,0.13), transparent 70%)",
                      }}
                    />
                    <div className="relative">
                      {/* Title */}
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-light text-white leading-[1.15] mb-4">
                        {exp.title}
                      </h3>

                      {/* Description */}
                      <p className="font-sans font-light text-sm md:text-base leading-relaxed text-[#9ab3b7] max-w-[420px] mb-8">
                        {exp.description}
                      </p>

                      {/* CTA with orange circular arrow icon */}
                      <Link
                        href={exp.href}
                        className="group/cta inline-flex min-h-[44px] items-center gap-3.5 text-xs md:text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-[var(--color-wild-orange,#ff6e00)] text-[var(--color-wild-orange,#ff6e00)] transition-all duration-300 group-hover/cta:bg-[var(--color-wild-orange,#ff6e00)] group-hover/cta:text-white group-hover/cta:shadow-[0_0_15px_rgba(255,110,0,0.5)]">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover/cta:translate-x-0.5"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span className="transition-colors group-hover/cta:text-[var(--color-wild-orange,#ff6e00)]">
                          {ctaLabel}
                        </span>
                      </Link>
                    </div>

                    {/* Location Pin Footer */}
                    <div className="relative mt-8 flex items-center gap-2 pt-4 text-xs text-[#8ca5a9]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 fill-none stroke-current stroke-[1.8] text-[#8ca5a9] shrink-0"
                      >
                        <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10Z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                      <span className="font-sans font-light tracking-wide">{exp.locations}</span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
