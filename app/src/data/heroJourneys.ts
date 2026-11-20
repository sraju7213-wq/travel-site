import { getAllPackages, getPackageCardImage, pexels } from "./catalogue";
import type { PackageViewModel } from "@/types/travel";

/**
 * Marquee journeys orbiting the /journeys hero ring.
 *
 * Curated for visual variety across the six brochure categories — every card
 * links straight to its itinerary page. Keep ids in brochure order within
 * each category so the ring mixes regions as it spins.
 */
export const HERO_JOURNEY_IDS = [
  // Phone marquee (first 6: Kashmir, Agra/Taj, Kerala, Ladakh, Nepal, Rajasthan fort)
  "kashmir-package-7-day",
  "golden-triangle",
  "glimpses-of-kerala",
  "discover-ladakh",
  "himalayan-combination-nepal",
  "heritage-tour-india",
  // Tablet additions (next 2: Markha trek, Goa coast)
  "markha-valley",
  "glorious-goa-stopover",
  // Desktop additions (next 4: Varanasi Ganges, Vale trek, Nepal mini-trek, Delhi heritage)
  "north-india-highlights",
  "vale-of-kashmir-trek",
  "nepal-mini-trek-7-day",
  "delhi-stopover",
] as const;

/**
 * Per-journey poster overrides for the Orbit ring.
 *
 * The ring is a curated subset of the catalogue, so a journey can want a
 * hero-specific photo even when its card image is set elsewhere. Keyed by
 * package id; anything absent falls back to the package card image.
 */
export const HERO_JOURNEY_IMAGES: Record<string, string> = {
  // Kashmir: Dal Lake houseboats read better on the ring than the generic card.
  "kashmir-package-7-day": pexels("25786562"),
};

/**
 * Poster for one ring card: the curated override when present, otherwise the
 * same package card image the rest of the site uses.
 */
export function getHeroJourneyImage(pkg: PackageViewModel): string {
  return HERO_JOURNEY_IMAGES[pkg.id] ?? getPackageCardImage(pkg.slug);
}

/**
 * Resolve the marquee ids against the live catalogue. Unknown ids are
 * dropped, so editing the list never breaks the build.
 */
export function getHeroJourneys(): PackageViewModel[] {
  const byId = new Map(getAllPackages().map((pkg) => [pkg.id, pkg]));
  return HERO_JOURNEY_IDS.map((id) => byId.get(id)).filter(
    (pkg): pkg is PackageViewModel => Boolean(pkg),
  );
}
