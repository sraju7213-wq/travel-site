"use client";

import { useState } from "react";
import { HOUSEBOAT_NOTES } from "@/data/houseboats";

/**
 * Practical notes, answered strictly from the brochure record.
 * Uses the same disclosure pattern as the itinerary accordion.
 */
export default function HouseboatNotes() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-signature relative border-b border-white/5 py-16 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Before you book
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              The practical
              <span className="block text-white/55">questions</span>
            </h2>
            <p className="mt-6 max-w-sm font-sans text-sm font-light leading-relaxed text-white/60">
              Answers taken from the houseboat brochure entry, with nothing added that the printed record
              does not support.
            </p>
          </div>

          <div className="space-y-2.5">
            {HOUSEBOAT_NOTES.map((note, index) => {
              const isOpen = openIndex === index;
              const panelId = `houseboat-note-panel-${index}`;
              const buttonId = `houseboat-note-trigger-${index}`;

              return (
                <div
                  key={note.question}
                  className={`overflow-hidden border transition-colors duration-200 ${
                    isOpen
                      ? "border-[var(--color-wild-orange)]/45 bg-white/[0.04]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-wild-orange)]"
                  >
                    <span className="flex items-start gap-4">
                      <span className="mt-0.5 font-mono text-[11px] text-[var(--color-wild-orange)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-serif text-base font-light text-white md:text-lg">
                        {note.question}
                      </span>
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`shrink-0 text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                    className="border-t border-white/10 px-5 pb-5 pt-4 animate-fade-in"
                  >
                    <p className="pl-9 font-sans text-sm font-light leading-relaxed text-white/70">
                      {note.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
