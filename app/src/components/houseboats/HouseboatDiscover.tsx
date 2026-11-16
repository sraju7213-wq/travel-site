import Image from "next/image";
import { HOUSEBOAT_STATS } from "@/data/houseboats";
import { pexels } from "@/data/catalogue";

/**
 * Reference-site "Discover" band: an editorial column paired with a tall
 * portrait plate, closed by a row of stat callouts.
 */
export default function HouseboatDiscover() {
  return (
    <section className="section-discover relative overflow-hidden border-b border-white/5 py-16 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[32rem] w-[32rem] rounded-full border border-white/[0.04]"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* Editorial column */}
          <div>
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              The houseboat experience
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl lg:text-[3.4rem]">
              A hotel that floats,
              <span className="block text-white/55">moored at the water&rsquo;s edge</span>
            </h2>
            <p className="mt-7 max-w-xl font-sans text-sm font-light leading-relaxed text-white/75 md:text-base">
              Dal Lake is ringed by houseboats — carved wooden vessels built to be lived in rather than
              sailed. The brochure describes bedrooms with private ensuite facilities, living and dining
              rooms finished with carved walnut and Kashmir carpets, a veranda at the front facing the
              water, a sundeck on the roof, and a houseboat boy in attendance at all times.
            </p>
            <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-white/60">
              This is a booking service rather than a numbered tour package: a houseboat can be taken on
              its own or added to the Kashmir routes that run through Srinagar.
            </p>

            {/* Stat callouts */}
            <dl className="mt-11 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {HOUSEBOAT_STATS.map((stat) => (
                <div key={stat.label} className="border-t border-white/10 pt-4">
                  <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                    {stat.label}
                  </dt>
                  <dd>
                    <span className="mt-2 block font-serif text-2xl font-light leading-tight text-white md:text-[1.7rem]">
                      {stat.value}
                    </span>
                    <span className="mt-2 block font-sans text-xs font-light leading-relaxed text-white/55">
                      {stat.note}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Portrait plate */}
          <figure className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#0C1617] shadow-2xl">
              <Image
                src={pexels("29251278")}
                alt="Shikaras crossing the still blue water of Dal Lake below snow-dusted Himalayan ridges"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-6">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-white/75">
                  Dal Lake, Srinagar
                </span>
                <span className="font-serif text-3xl font-light text-white/70">1927</span>
              </figcaption>
            </div>
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 h-full w-full border border-white/10"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
