import Image from "next/image";
import Link from "next/link";
import { STATS } from "@/data/siteContent";

/** Editorial block: dark panel, portrait image, and a row of stat callouts. */
export default function DiscoverSection() {
  return (
    <section id="discover" className="section-dark relative overflow-hidden py-12 md:py-16">
      <p
        aria-hidden="true"
        data-watermark="#Indianepal"
        className="watermark-text pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[13vw] uppercase leading-none tracking-[0.05em] text-white/[0.04] select-none"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="subtitle-large mb-4 text-brass font-accent">Specialist Travel Since 1927</p>
            <h2 className="text-h2 mb-6 text-white font-serif font-light">
              Discover India and Nepal
            </h2>
            <p className="mb-4 font-serif italic font-light text-lg sm:text-xl leading-relaxed text-brass-soft/90">
              &ldquo;Specialist expeditions for discerning travellers, with direct operator hubs across Delhi, Kashmir, Ladakh and Kathmandu.&rdquo;
            </p>
            <p className="mb-6 font-sans font-light text-sm leading-relaxed text-white/75">
              Our journeys depart with guaranteed departures for small private groups or solo travellers, crafted as bespoke templates tailored to your season, dates and regional interests.
            </p>
            <Link href="/about" className="btn-ghost-dark">
              Learn more about us <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="group relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11] max-h-[380px] overflow-hidden rounded-[1rem] border border-white/10 shadow-2xl transition-all duration-500">
            <Image
              src="/images/destinations/boats-blue-water.jpg"
              alt="Traditional boats sailing on blue waters against snow-capped Himalayan mountains"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <dl className="mt-10 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/15 text-brass bg-white/5 transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white hover:scale-105"
              >
                <StatIcon label={stat.label} />
              </span>
              <dt className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight">{stat.value}</dt>
              <dd className="font-sans text-xs text-white/75">
                <span className="block font-accent text-[11px] font-semibold uppercase tracking-[0.22em] text-brass mb-1">
                  {stat.label}
                </span>
                <span className="font-sans text-xs font-light text-white/60 leading-relaxed block">
                  {stat.note}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function StatIcon({ label }: { label: string }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    className: "h-6 w-6 fill-none stroke-current stroke-[1.6]",
  } as const;

  switch (label) {
    case "Specialist travel":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" strokeLinejoin="round" />
        </svg>
      );
    case "Journeys":
      return (
        <svg {...common}>
          <path d="M4 19 9 5l2 8 2-5 7 11H4Z" strokeLinejoin="round" />
        </svg>
      );
    case "Countries":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        </svg>
      );
    case "Travellers":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5M16 11a2.5 2.5 0 1 0 0-5M18 14c2 .8 3 2.4 3 5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 3v18M4 12h16" strokeLinecap="round" />
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
