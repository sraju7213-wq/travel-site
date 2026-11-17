import Image from "next/image";
import Link from "next/link";
import type { PackageViewModel } from "@/types/travel";
import { pexels } from "@/data/catalogue";

interface HouseboatJourneysProps {
  packages: PackageViewModel[];
}

/**
 * Full-bleed media band pairing the houseboat stay with the Kashmir routes
 * it slots into — the reference site's "journeys" module.
 */
export default function HouseboatJourneys({ packages }: HouseboatJourneysProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/5">
      <Image
        src={pexels("40348598")}
        alt="Houseboats moored on Dal Lake in Srinagar, Kashmir"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,19,0.9)_0%,rgba(7,18,19,0.55)_45%,rgba(7,18,19,0.35)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#071213] via-transparent to-[#071213]/60"
      />

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-20 md:px-10 md:py-28">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
            <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
            Stay a little longer
          </p>
          <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
            Add a night on the water
            <span className="block text-white/60">to any Kashmir route</span>
          </h2>
          <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-white/75 md:text-base">
            Houseboats are booked separately from the numbered tours, so they can be stitched onto a
            Kashmir itinerary — or taken on their own. Tell us which journey you are on and we will place
            the nights on the lake alongside it.
          </p>
          <Link
            href="/journeys?region=Kashmir#catalogue"
            className="group mt-9 inline-flex min-h-[44px] items-center gap-4 border-b border-white/35 pb-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Explore Kashmir journeys
            <span aria-hidden="true" className="text-base transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>

        {packages.length > 0 && (
          <ul className="mt-14 grid gap-px border border-white/15 bg-white/15 sm:grid-cols-3">
            {packages.map((pkg) => (
              <li key={pkg.id} className="bg-[#0C1617]/85 backdrop-blur-sm">
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="group flex h-full flex-col p-6 transition-colors duration-300 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-wild-orange)]"
                >
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-wild-orange)]">
                    {pkg.category}
                  </span>
                  <span className="mt-2 font-serif text-xl font-light leading-snug text-white transition-colors group-hover:text-[var(--color-wild-orange)]">
                    {pkg.title}
                  </span>
                  <span className="mt-3 font-sans text-xs font-light text-white/70">
                    {pkg.region.filter((r) => r !== "India" && r !== "Nepal").join(" · ") || pkg.primaryRegion}
                  </span>
                  <span className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-sans text-[10px] uppercase tracking-[0.18em] text-white/60">
                    <span>{pkg.duration}</span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-wild-orange)]"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
