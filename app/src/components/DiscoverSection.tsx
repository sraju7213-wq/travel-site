import { STATS } from "@/data/siteContent";

function StatIcon({ label }: { label: string }) {
  const common = {
    "aria-hidden": true,
    viewBox: "0 0 24 24",
    className: "h-6 w-6 fill-none stroke-current stroke-[1.6]",
  } as const;

  switch (label) {
    case "Founding heritage":
    case "Specialist travel":
      return (
        <svg {...common}>
          <path d="M12 2L3 7l9 5 9-5-9-5Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 12v10M3 7v10l9 5 9-5V7" strokeLinecap="round" strokeLinejoin="round" />
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
          <circle cx="12" cy="12" r="10" strokeLinecap="round" />
          <line x1="12" y1="2" x2="12" y2="22" strokeLinecap="round" />
          <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" />
        </svg>
      );
    case "Quotas":
    case "Travellers":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
        </svg>
      );
    case "Publication":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

/**
 * Historical statistics and founding heritage band starting with "Since 1927".
 * Serves as the landing anchor for the hero "Discover" action.
 */
export default function DiscoverSection() {
  return (
    <section id="discover" className="section-discover relative overflow-hidden py-10 md:py-14 border-b border-white/5">
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-start gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/15 text-brass bg-white/5 transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white hover:scale-105"
              >
                <StatIcon label={stat.label} />
              </span>
              <dt className="font-serif text-2xl md:text-3xl font-light text-white tracking-tight">
                {stat.value}
              </dt>
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
