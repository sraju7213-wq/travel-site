"use client";

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
    <section className="px-4 py-16 md:px-8 lg:px-12 border-t border-wild-border-light">
      <div className="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-charcoal mb-12 uppercase">
          What&rsquo;s included
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-wild-orange mb-2">
              Included
            </h3>
            <div className="rounded-image border border-wild-border-light bg-wild-dark p-6 text-wild-white">
              {inclusions.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2 text-white/80 leading-relaxed font-display">
                  {inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/70 leading-relaxed font-display">
                  Inclusions are specified per package in the brochure and have not yet been
                  structured for display. Please enquire for details.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-wild-orange mb-2">
              Not included
            </h3>
            <div className="rounded-image border border-wild-border-light bg-wild-dark p-6 text-wild-white">
              {exclusions.length > 0 ? (
                <ul className="list-disc pl-6 space-y-2 text-white/80 leading-relaxed font-display">
                  {exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/70 leading-relaxed font-display">
                  Exclusions are specified per package in the brochure and have not yet been
                  structured for display. Please enquire for details.
                </p>
              )}
            </div>
          </div>
        </div>

        {!hasData && (
          <p className="mt-12 text-sm font-display text-charcoal-soft leading-relaxed">
            These lists come from the package-specific brochure text and are not shown until
            transcribed. Enquire for current inclusions and exclusions.
          </p>
        )}
      </div>
    </section>
  );
}
