import Link from "next/link";
import Image from "next/image";
import type { PackageViewModel } from "@/types/travel";
import { getPackageCardImage } from "@/data/catalogue";
import { cleanDuration, placeLine } from "@/lib/packageDisplay";

interface PosterRailProps {
  packages: PackageViewModel[];
  heading: string;
  kicker?: string;
  intro?: string;
  actionHref?: string;
  id: string;
}

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
 * PosterRail
 * ----------
 * A curated collection of tall poster cards. Each card keeps its details on
 * the poster and reveals a call to action on hover, with the collection
 * header shared with the season showcase above it.
 */
export default function PosterRail({
  packages,
  heading,
  kicker,
  intro,
  actionHref,
  id,
}: PosterRailProps) {
  return (
    <section className="jy-showcase" aria-labelledby={id}>
      <div className="jy-head">
        <div className="jy-head-main">
          {kicker && (
            <span className="jy-kicker">
              <span className="jy-kicker-line" aria-hidden="true" />
              {kicker}
            </span>
          )}
          <h2 id={id} className="jy-head-title">
            {heading}
          </h2>
        </div>
        {(intro || actionHref) && (
          <div className="jy-head-side">
            {intro && <p className="jy-head-intro">{intro}</p>}
            {actionHref && (
              <Link href={actionHref} className="jy-head-link">
                Explore collection <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="jy-rail">
        {packages.map((pkg, index) => {
          const badge = verdict(pkg);
          return (
            <article className="jy-rail-card group" key={pkg.id}>
              <Link href={`/packages/${pkg.slug}`} aria-label={`${pkg.title} — view journey`}>
                <div className="jy-rail-poster" data-tilt>
                  <Image
                    src={getPackageCardImage(pkg.slug)}
                    alt={pkg.title}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 80vw"
                    quality={75}
                    className="jy-rail-img"
                  />
                  <span className="jy-rail-shade" aria-hidden="true" />
                  <span className="jy-rail-glare" aria-hidden="true" />
                  <span className="jy-rail-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="jy-rail-chip">{cleanDuration(pkg.duration)}</span>
                  <span className="jy-rail-go" aria-hidden="true">
                    ↗
                  </span>
                </div>
                <div className="jy-rail-body">
                  <h3 className="jy-rail-title">{pkg.title}</h3>
                  <div className="jy-rail-meta">
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/65">
                      {placeLine(pkg)}
                    </span>
                    {badge && (
                      <span className={`jy-pill jy-pill--${badge.tone} shrink-0`}>
                        {badge.label}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
