import Image from "next/image";
import Link from "next/link";
import { STATS } from "@/data/siteContent";

/** The reference site's editorial block: dark panel, portrait image, and a row of stat callouts. */
export default function DiscoverSection() {
  return (
    <section id="discover" className="section-dark relative overflow-hidden py-20 md:py-28">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[13vw] uppercase leading-none tracking-[0.05em] text-white/[0.04] select-none"
      >
        #Indianepal
      </p>

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="subtitle-large mb-5 text-wild-orange">We are a travel organisation</p>
            <h2 className="text-h2 mb-6 text-wild-white">
              Discover Earth&rsquo;s most untamed places
            </h2>
            <p className="mb-5 font-display text-lg leading-relaxed text-white/80">
              As specialist travel operators for India and Nepal, we are custodians of some of the
              most significant journeys on the subcontinent — the high passes of Ladakh, the
              backwaters of Kerala, the temples of Varanasi and the glacier trails of the Nepali
              Himalaya.
            </p>
            <p className="mb-8 font-display text-lg leading-relaxed text-white/80">
              Our destinations are vast, remote and untamed. We arrange intimate encounters and
              journeys that stay with you long after you return.
            </p>
            <Link href="/about" className="btn-ghost-dark">
              Learn more about us <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-image border border-white/10 sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image
              src="/images/destinations/markha-valley.jpg"
              alt="Snowbound Himalayan ranges above the Markha valley"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <dl className="mt-16 grid gap-8 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-3">
              <span
                aria-hidden="true"
                className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/15 text-wild-orange"
              >
                <StatIcon label={stat.label} />
              </span>
              <dt className="text-h4 font-serif text-wild-white">{stat.value}</dt>
              <dd className="text-sm font-display text-white/75">
                <span className="block font-semibold uppercase tracking-[0.15em] text-white">
                  {stat.label}
                </span>
                {stat.note}
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
