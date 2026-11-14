"use client";

import type { ReactNode } from "react";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";

export interface SectionHeadingProps {
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Heading content — may contain inline markup. */
  title: ReactNode;
  /** Supporting paragraph placed beside or below the heading. */
  intro?: string;
  /** Optional trailing action (usually a "view all" link). */
  action?: ReactNode;
  className?: string;
  /** Heading alignment. */
  align?: "left" | "center";
}

/**
 * SectionHeading
 * --------------
 * The standard section opener used across the marketing pages: a rule and
 * eyebrow, a masked word-by-word serif heading, an optional standfirst and an
 * optional trailing action.
 *
 * Keeping this in one component means every section opens with the same
 * rhythm — the reader learns the pattern once and it never feels arbitrary.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  className = "",
  align = "left",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:pb-9 ${className}`}
    >
      <div className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
        {eyebrow && (
          <Reveal as="p" variant="fade-up" className="mb-4 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-wild-orange)]">
            {!isCentered && <span className="h-px w-10 bg-[var(--color-wild-orange)]" />}
            {eyebrow}
            {isCentered && <span className="h-px w-10 bg-[var(--color-wild-orange)]" />}
          </Reveal>
        )}

        <SplitText
          as="h2"
          className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl"
        >
          {title}
        </SplitText>
      </div>

      {(intro || action) && (
        <div
          className={`flex flex-col gap-5 ${
            isCentered ? "items-center text-center" : "md:items-end"
          } ${isCentered ? "" : "md:text-right"}`}
        >
          {intro && (
            <Reveal
              as="p"
              variant="fade-up"
              delay={0.12}
              className="max-w-sm text-sm leading-relaxed text-white/55"
            >
              {intro}
            </Reveal>
          )}
          {action && (
            <Reveal as="div" variant="fade-up" delay={0.2}>
              {action}
            </Reveal>
          )}
        </div>
      )}
    </div>
  );
}
