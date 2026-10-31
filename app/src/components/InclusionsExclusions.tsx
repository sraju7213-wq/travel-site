import React from "react";

interface InclusionsExclusionsProps {
  inclusions?: string[];
  exclusions?: string[];
}

export default function InclusionsExclusions({
  inclusions = [],
  exclusions = [],
}: InclusionsExclusionsProps) {
  return (
    <section className="border-t border-white/10 bg-[#0C1617] py-16 md:py-24" id="inclusions">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="subtitle-large mb-2 text-brass">Package Logistics</p>
          <h2 className="text-h3 font-serif text-white">What&rsquo;s Included &amp; Excluded</h2>
          <p className="font-display text-sm text-white/70 mt-1">
            Drawn specifically for this journey from the brochure catalogue.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Inclusions Card */}
          <div className="rounded-[1.25rem] border border-white/10 bg-[#132325] p-7 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-brass text-sm font-bold shadow-sm">
                ✓
              </span>
              <h3 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-white">
                What Is Included
              </h3>
            </div>
            {inclusions.length > 0 ? (
              <ul className="space-y-3 font-display text-sm leading-relaxed text-white/75">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brass font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-display text-sm leading-relaxed text-white/70">
                Twin-share accommodation, transfers and scheduled sightseeing as specified in the brochure. Direct enquiry confirms individual inclusions.
              </p>
            )}
          </div>

          {/* Exclusions Card */}
          <div className="rounded-[1.25rem] border border-white/10 bg-[#132325] p-7 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/70 text-sm font-bold border border-white/10">
                ✕
              </span>
              <h3 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-white/80">
                What Is Excluded
              </h3>
            </div>
            {exclusions.length > 0 ? (
              <ul className="space-y-3 font-display text-sm leading-relaxed text-white/75">
                {exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brass-ink font-bold shrink-0 mt-0.5">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-display text-sm leading-relaxed text-white/70">
                International flights, personal travel insurance, visa fees and items of a personal nature unless specifically noted.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
