interface InclusionsExclusionsProps {
  inclusions?: string[];
  exclusions?: string[];
}

export default function InclusionsExclusions({
  inclusions = [],
  exclusions = [],
}: InclusionsExclusionsProps) {
  const hasData = inclusions.length > 0 || exclusions.length > 0;

  return (
    <section className="border-t border-border bg-ivory-soft/30 py-16 md:py-24" id="inclusions">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="subtitle-large mb-2 text-brass">Package Logistics</p>
          <h2 className="text-h3 font-serif text-charcoal">What&rsquo;s Included &amp; Excluded</h2>
          <p className="font-display text-sm text-charcoal-soft mt-1">
            Drawn specifically for this journey from the brochure catalogue.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Inclusions Card */}
          <div className="rounded-[1.25rem] border border-border/80 bg-white p-7 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-brass text-sm font-bold shadow-sm">
                ✓
              </span>
              <h3 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal">
                What Is Included
              </h3>
            </div>
            {inclusions.length > 0 ? (
              <ul className="space-y-3 font-display text-sm leading-relaxed text-charcoal-soft">
                {inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-brass font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                Twin-share accommodation, transfers and scheduled sightseeing as specified in the brochure. Direct enquiry confirms individual inclusions.
              </p>
            )}
          </div>

          {/* Exclusions Card */}
          <div className="rounded-[1.25rem] border border-border/80 bg-white p-7 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ivory-soft text-charcoal-soft text-sm font-bold border border-border">
                ✕
              </span>
              <h3 className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal-soft">
                Not Included
              </h3>
            </div>
            {exclusions.length > 0 ? (
              <ul className="space-y-3 font-display text-sm leading-relaxed text-charcoal-soft">
                {exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 opacity-80">
                    <span className="text-charcoal-soft/60 shrink-0 mt-0.5 font-bold">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                International airfares, visa fees, personal travel insurance, and optional monument photography permits unless explicitly noted.
              </p>
            )}
          </div>
        </div>

        {!hasData && (
          <p className="mt-10 font-display text-sm leading-relaxed text-charcoal-soft">
            We do not publish a generic inclusions panel, because the brochure sets these lists per
            package. Enquire for the inclusions and exclusions that apply to your journey.
          </p>
        )}
      </div>
    </section>
  );
}
