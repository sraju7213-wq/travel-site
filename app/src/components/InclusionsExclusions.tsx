"use client";

import EnquireCta from "@/components/package/EnquireCta";

interface InclusionsExclusionsProps {
  inclusions?: string[];
  exclusions?: string[];
  brochureCode?: string;
  sourcePage?: number;
}

const DEFAULT_INCLUSIONS = [
  "Accommodation as specified in the brochure itinerary, on a twin-share basis unless confirmed otherwise.",
  "All scheduled private transfers, inter-city transport and airport pickups.",
  "English-speaking local guides for the sightseeing listed in the itinerary.",
  "Monument and museum entries named in the brochure programme.",
];

const DEFAULT_EXCLUSIONS = [
  "International long-haul airfares to the start and from the end point.",
  "Personal travel, medical and evacuation insurance.",
  "Visa and entry fees, unless the brochure programme states these are included.",
  "Gratuities and items of a personal nature.",
];

export default function InclusionsExclusions({
  inclusions = [],
  exclusions = [],
  brochureCode,
  sourcePage,
}: InclusionsExclusionsProps) {
  const includedList = inclusions.length > 0 ? inclusions : DEFAULT_INCLUSIONS;
  const excludedList = exclusions.length > 0 ? exclusions : DEFAULT_EXCLUSIONS;

  return (
    <div>
      <div className="border-b border-white/10 pb-4">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
          Package Logistics
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold text-white">
          Transparent Inclusions &amp; Exclusions
        </h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Included */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-emerald-500/20 pb-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Included in Expedition
          </div>
          <ul className="space-y-2.5 font-display text-sm leading-relaxed text-white/75">
            {includedList.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold text-emerald-400">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Excluded */}
        <div className="rounded-xl border border-rose-500/25 bg-rose-950/20 p-5">
          <div className="mb-4 flex items-center gap-2 border-b border-rose-500/20 pb-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Excluded / Optional
          </div>
          <ul className="space-y-2.5 font-display text-sm leading-relaxed text-white/75">
            {excludedList.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold text-rose-400">
                  ✕
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3.5 sm:flex-row sm:items-center">
        <p className="font-display text-xs text-white/50">
          {brochureCode && (
            <>
              Brochure Reference: {brochureCode}
              {sourcePage ? ` · Page ${sourcePage}` : ""} •{" "}
            </>
          )}
          Tailor-made customisations are available on request.
        </p>
        <EnquireCta
          label="Request Custom Modifications"
          message="Please contact me about customising this journey."
          variant="ghost"
          className="px-0 py-1"
        />
      </div>
    </div>
  );
}
