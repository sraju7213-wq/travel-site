import { HOUSEBOAT_ALONGSIDE, HOUSEBOAT_INCLUDED } from "@/data/houseboats";

interface HouseboatStayProps {
  /** Transcription caveats recorded against the brochure entry. */
  flags: string[];
}

/**
 * Two-column "what is included / what to confirm" module — the reference
 * site's transparency pattern, applied to the brochure record.
 */
export default function HouseboatStay({ flags }: HouseboatStayProps) {
  return (
    <section
      id="houseboat-stay"
      className="section-darker relative scroll-mt-24 border-b border-white/5 py-16 md:py-24"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="mb-12 max-w-3xl">
          <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
            <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
            Package logistics
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
            What the stay includes,
            <span className="block text-white/55">and what we confirm first</span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Included */}
          <div className="border border-white/10 bg-[#132325] p-7 shadow-xl md:p-9">
            <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[var(--color-wild-orange)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                Described in the brochure
              </h3>
            </div>
            <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {HOUSEBOAT_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-wild-orange)]" />
                  <span className="font-sans text-sm font-light leading-relaxed text-white/75">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-5">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Arranged alongside the houseboats
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {HOUSEBOAT_ALONGSIDE.map((item) => (
                  <li
                    key={item}
                    className="border border-white/15 px-3 py-1.5 font-sans text-[11px] font-light text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-sans text-xs font-light leading-relaxed text-white/50">
                These are arranged separately from the houseboat stay — mention them in your enquiry and we
                will place them alongside the nights on the water.
              </p>
            </div>
          </div>

          {/* Confirm before booking */}
          <div className="space-y-6">
            <div className="border border-[var(--color-wild-orange)]/35 bg-[var(--color-wild-orange)]/[0.07] p-7">
              <h3 className="font-serif text-xl font-light text-white">Confirm before you book</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                Nothing on this page is a live availability check. The grade assigned to a houseboat is the
                responsibility of the Kashmir Government, and every booking is confirmed with the operator
                before it is made.
              </p>
              {flags.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-[var(--color-wild-orange)]/20 pt-4">
                  {flags.map((flag) => (
                    <li key={flag} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-wild-orange)]" />
                      <span className="font-sans text-xs font-light leading-relaxed text-white/60">{flag}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-white/10 bg-[#0d2a2d] p-7">
              <h3 className="font-serif text-xl font-light text-white">A service, not a package</h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                This page describes the houseboat booking service only. It is not a numbered tour package,
                and no fixed departure dates or prices are published here. Enquire with your preferred
                dates and party size and we will confirm what is actually available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
