import { getAllPackages } from "./catalogue";
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
 * Resolve the marquee ids against the live catalogue. Unknown ids are
 * dropped, so editing the list never breaks the build.
 */
export function getHeroJourneys(): PackageViewModel[] {
  const byId = new Map(getAllPackages().map((pkg) => [pkg.id, pkg]));
  return HERO_JOURNEY_IDS.map((id) => byId.get(id)).filter(
    (pkg): pkg is PackageViewModel => Boolean(pkg),
  );
}
