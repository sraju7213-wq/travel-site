import { getAllPackages, pexels } from "./catalogue";
import type { PackageViewModel } from "@/types/travel";

/**
 * Places featured in the Journeys hero.
 *
 * Every entry is backed by the printed brochure catalogue — `match` lists the
 * region strings the catalogue actually uses, and the journey count is derived
 * from the live catalogue rather than typed by hand.
 */
export interface PlaceFeature {
  name: string;
  image: string;
  alt: string;
  blurb: string;
  /** Country the place belongs to. */
  country: "India" | "Nepal";
  match: string[];
}

export const PLACE_FEATURES: PlaceFeature[] = [
  {
    name: "Kashmir",
    image: pexels("40348598"),
    alt: "Houseboats on Dal Lake, Srinagar",
    blurb: "Shikara mornings on Dal Lake, Mughal gardens and Himalayan passes.",
    country: "India",
    match: [
      "Kashmir",
      "Srinagar",
      "Gulmarg",
      "Pahalgam",
      "Sonamarg",
      "Shivapuri",
      "Aru",
      "Lidderwat",
    ],
  },
  {
    name: "Ladakh",
    image: pexels("38087449"),
    alt: "Monastery above the Indus in Ladakh",
    blurb: "Buddhist monasteries, the cold desert of Nubra and the shore of Pangong.",
    country: "India",
    match: [
      "Ladakh",
      "Leh",
      "Nubra",
      "Pangong",
      "Zanskar",
      "Markha",
      "Simaltar",
      "Chowki",
    ],
  },
  {
    name: "Nepal",
    image: pexels("20988035"),
    alt: "Trail through the Nepali Himalaya",
    blurb: "Kathmandu's temple squares, Annapurna trails and the jungle of Chitwan.",
    country: "Nepal",
    match: ["Nepal", "Kathmandu", "Pokhara", "Chitwan", "Nagarkot", "Trisuli", "Sundarijal"],
  },
  {
    name: "Rajasthan",
    image: pexels("39605929"),
    alt: "Camel caravan crossing the Thar desert",
    blurb: "Forts, palaces and desert camps from Jaipur to Jaisalmer and Udaipur.",
    country: "India",
    match: ["Rajasthan", "Jaipur", "Jodhpur", "Jaisalmer", "Udaipur", "Bikaner", "Mandawa"],
  },
  {
    name: "Kerala",
    image: pexels("30778230"),
    alt: "Houseboat on the Kerala backwaters",
    blurb: "Kettuvallam houseboats, hill stations and the tea slopes of Munnar.",
    country: "India",
    match: [
      "Kerala",
      "Cochin",
      "Kochi",
      "Alleppey",
      "Munnar",
      "Thekkady",
      "Periyar",
      "Kovalam",
      "Varkala",
      "Trivandrum",
      "Tamil Nadu",
      "Madurai",
      "Rameshwaram",
      "Kanyakumari",
    ],
  },
  {
    name: "Himalaya",
    image: pexels("35672518"),
    alt: "Snow trail across a high Himalayan pass",
    blurb: "Glacier camps and alpine meadows on the Markha, Zanskar and Nepal trails.",
    country: "India",
    match: [
      "Himalaya",
      "Himalayan",
      "Markha",
      "Chowki",
      "Phisling",
      "Gangabal",
      "Kolahoi",
      "Vishansar",
      "Sundarijal",
      "Nagarkot",
    ],
  },
  {
    name: "Agra",
    image: pexels("11521892"),
    alt: "The Taj Mahal in Agra",
    blurb: "Mughal landmarks on the classic Delhi–Agra–Jaipur circuit.",
    country: "India",
    match: ["Agra"],
  },
  {
    name: "Goa",
    image: pexels("28355680"),
    alt: "Goa coastline at golden hour",
    blurb: "A relaxed coast stay with Panjim's old town and the beaches beyond.",
    country: "India",
    match: ["Goa", "Panjim"],
  },
  {
    name: "Varanasi",
    image: pexels("40967314"),
    alt: "Ghat steps along the Ganges at Varanasi",
    blurb: "Boating on the Ganges and the ghats of the oldest living city.",
    country: "India",
    match: ["Varanasi"],
  },
  {
    name: "Kathmandu",
    image: pexels("20988035"),
    alt: "Boudhanath stupa at dusk in Kathmandu",
    blurb: "Historic squares, stupas and Buddhist heritage in the Nepali capital.",
    country: "Nepal",
    match: ["Kathmandu"],
  },
];

export interface ResolvedPlace extends PlaceFeature {
  /** How many catalogue journeys pass through this place. */
  journeys: number;
  /** Link into the filtered catalogue. */
  href: string;
}

/** Catalogue journeys that pass through a place, keyed by place name. */
export function getJourneysByPlace(packages: PackageViewModel[] = getAllPackages()): Record<string, PackageViewModel[]> {
  const grouped: Record<string, PackageViewModel[]> = {};
  for (const place of PLACE_FEATURES) {
    grouped[place.name] = packages.filter((pkg) =>
      pkg.region.some((region) =>
        place.match.some((needle) => region.toLowerCase().includes(needle.toLowerCase())),
      ),
    );
  }
  return grouped;
}

export function getPlaces(packages: PackageViewModel[] = getAllPackages()): ResolvedPlace[] {
  return PLACE_FEATURES.map((place) => {
    const journeys = packages.filter((pkg) =>
      pkg.region.some((region) =>
        place.match.some((needle) => region.toLowerCase().includes(needle.toLowerCase())),
      ),
    ).length;
    return {
      ...place,
      journeys,
      href: `/journeys?q=${encodeURIComponent(place.name)}#catalogue`,
    };
  });
}
