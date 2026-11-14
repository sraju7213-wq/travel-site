import { getAllPackages } from "./catalogue";

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
  match: string[];
}

export const PLACE_FEATURES: PlaceFeature[] = [
  {
    name: "Kashmir",
    image: "/images/destinations/dal-lake.jpg",
    alt: "Houseboats on Dal Lake, Srinagar",
    blurb: "Shikara mornings on Dal Lake, Mughal gardens and Himalayan passes.",
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
    image: "/images/destinations/ladakh-monastery.jpg",
    alt: "Monastery above the Indus in Ladakh",
    blurb: "Buddhist monasteries, the cold desert of Nubra and the shore of Pangong.",
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
    image: "/images/destinations/nepal-trek.jpg",
    alt: "Trail through the Nepali Himalaya",
    blurb: "Kathmandu's temple squares, Annapurna trails and the jungle of Chitwan.",
    match: ["Nepal", "Kathmandu", "Pokhara", "Chitwan", "Nagarkot", "Trisuli", "Sundarijal"],
  },
  {
    name: "Rajasthan",
    image: "/images/destinations/rajasthan-desert-camels.jpg",
    alt: "Camel caravan crossing the Thar desert",
    blurb: "Forts, palaces and desert camps from Jaipur to Jaisalmer and Udaipur.",
    match: ["Rajasthan", "Jaipur", "Jodhpur", "Jaisalmer", "Udaipur", "Bikaner", "Mandawa"],
  },
  {
    name: "Kerala",
    image: "/images/destinations/kerala-backwaters.jpg",
    alt: "Houseboat on the Kerala backwaters",
    blurb: "Kettuvallam houseboats, hill stations and the tea slopes of Munnar.",
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
    image: "/images/destinations/snow-trek.jpg",
    alt: "Snow trail across a high Himalayan pass",
    blurb: "Glacier camps and alpine meadows on the Markha, Zanskar and Nepal trails.",
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
    image: "/images/destinations/taj-mahal.jpg",
    alt: "The Taj Mahal in Agra",
    blurb: "Mughal landmarks on the classic Delhi–Agra–Jaipur circuit.",
    match: ["Agra"],
  },
  {
    name: "Goa",
    image: "/images/destinations/goa-beach.jpg",
    alt: "Goa coastline at golden hour",
    blurb: "A relaxed coast stay with Panjim's old town and the beaches beyond.",
    match: ["Goa", "Panjim"],
  },
  {
    name: "Varanasi",
    image: "/images/destinations/varanasi-ghat.jpg",
    alt: "Ghat steps along the Ganges at Varanasi",
    blurb: "Boating on the Ganges and the ghats of the oldest living city.",
    match: ["Varanasi"],
  },
  {
    name: "Kathmandu",
    image: "/images/destinations/kathmandu-stupa.jpg",
    alt: "Boudhanath stupa at dusk in Kathmandu",
    blurb: "Historic squares, stupas and Buddhist heritage in the Nepali capital.",
    match: ["Kathmandu"],
  },
];

export interface ResolvedPlace extends PlaceFeature {
  /** How many catalogue journeys pass through this place. */
  journeys: number;
  /** Link into the filtered catalogue. */
  href: string;
}

export function getPlaces(): ResolvedPlace[] {
  const packages = getAllPackages();
  return PLACE_FEATURES.map((place) => {
    const journeys = packages.filter((pkg) =>
      pkg.region.some((region) =>
        place.match.some((needle) => region.toLowerCase().includes(needle.toLowerCase())),
      ),
    ).length;
    return {
      ...place,
      journeys,
      href: `/explore?q=${encodeURIComponent(place.name)}`,
    };
  });
}
