import Link from "next/link";
import Image from "next/image";
import { cleanDuration, placeLine } from "@/lib/packageDisplay";
import { getPackageCardImage } from "@/data/catalogue";
import type { PackageViewModel } from "@/types/travel";

interface CoverflowProps {
  packages: PackageViewModel[];
}

/**
 * A "verdict" label derived from the journey's own difficulty rating in the
 * brochure — nothing invented, only the printed grade.
 */
function verdict(pkg: PackageViewModel): { label: string; tone: string } | null {
  const raw = pkg.difficulty?.toLowerCase() ?? "";
  if (!raw) return null;
  if (raw.includes("easy")) return { label: "Easy going", tone: "go" };
  if (raw.includes("moderate")) return { label: "Moderate", tone: "timepass" };
  if (raw.includes("demanding") || raw.includes("strenuous")) {
    return { label: "Demanding", tone: "skip" };
  }
  return { label: pkg.difficulty?.split("(")[0].trim() ?? "Open level", tone: "muted" };
}

/**
 * TrendingJourneys
 * ---------------
 * Poster-style carousel modelled on reelipse.com's coverflow: a row of tall
 * 2:3 cards that reveal their details on hover, with a stroke-out rank number.
 */
export default function TrendingJourneys({ packages }: CoverflowProps) {
  return (
    <div className="jy-coverflow">
      <div
        className="jy-coverflow-track"
        role="region"
        aria-label="Trending journeys"
        tabIndex={0}
      >
        {/* Primary set */}
        {packages.map((pkg, index) => {
          const badge = verdict(pkg);
          return (
            <div key={`${pkg.id}-primary`} className="jy-coverflow-slide">
              <article className="jy-coverflow-card" data-tilt>
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="jy-coverflow-poster"
                  aria-label={`${pkg.title} — ${placeLine(pkg)}`}
                >
                  <Image
                    src={getPackageCardImage(pkg.slug)}
                    alt={pkg.title}
                    fill
                    sizes="(min-width: 768px) 450px, 80vw"
                    quality={75}
                    className="object-cover"
                  />
                </Link>
                <span className="jy-coverflow-veil" aria-hidden="true" />
                <span className="jy-coverflow-sheen" aria-hidden="true" />
                <div className="jy-coverflow-info">
                  <span className="jy-coverflow-rank" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-2.5">
                    <h3 className="jy-coverflow-title">{pkg.title}</h3>
                    <div className="jy-coverflow-meta">
                      <span className="font-mono text-[0.8125rem] text-white/70">
                        {placeLine(pkg)} · {cleanDuration(pkg.duration)}
                      </span>
                      {badge && (
                        <span className={`jy-pill jy-pill--${badge.tone}`}>{badge.label}</span>
                      )}
                    </div>
                    <p className="jy-coverflow-summary">{pkg.summary}</p>
                    <div className="jy-coverflow-actions">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2.5 font-sans text-sm font-medium text-[#0C1617] transition-colors hover:bg-[var(--color-wild-orange-hover)]"
                      >
                        View itinerary
                      </Link>
                      <Link
                        href={`/enquiry?package=${pkg.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:border-white"
                      >
                        Enquire about this
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}

        {/* Duplicate set for 50% infinite translation loop */}
        {packages.map((pkg, index) => {
          const badge = verdict(pkg);
          return (
            <div
              key={`${pkg.id}-duplicate`}
              className="jy-coverflow-slide"
              aria-hidden="true"
            >
              <article className="jy-coverflow-card" data-tilt>
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="jy-coverflow-poster"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Image
                    src={getPackageCardImage(pkg.slug)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 450px, 80vw"
                    quality={75}
                    className="object-cover"
                  />
                </Link>
                <span className="jy-coverflow-veil" aria-hidden="true" />
                <span className="jy-coverflow-sheen" aria-hidden="true" />
                <div className="jy-coverflow-info">
                  <span className="jy-coverflow-rank" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-2.5">
                    <h3 className="jy-coverflow-title">{pkg.title}</h3>
                    <div className="jy-coverflow-meta">
                      <span className="font-mono text-[0.8125rem] text-white/70">
                        {placeLine(pkg)} · {cleanDuration(pkg.duration)}
                      </span>
                      {badge && (
                        <span className={`jy-pill jy-pill--${badge.tone}`}>{badge.label}</span>
                      )}
                    </div>
                    <p className="jy-coverflow-summary">{pkg.summary}</p>
                    <div className="jy-coverflow-actions">
                      <Link
                        href={`/packages/${pkg.slug}`}
                        tabIndex={-1}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2.5 font-sans text-sm font-medium text-[#0C1617] transition-colors hover:bg-[var(--color-wild-orange-hover)]"
                      >
                        View itinerary
                      </Link>
                      <Link
                        href={`/enquiry?package=${pkg.slug}`}
                        tabIndex={-1}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:border-white"
                      >
                        Enquire about this
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
