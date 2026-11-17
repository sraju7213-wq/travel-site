/**
 * Editorial content for the Kashmir houseboats page.
 *
 * Every line here is transcribed from the printed brochure record for the
 * houseboat booking service (brochure page 2) or from the Baktoo-family
 * heritage claim in `brandConfig`. Nothing about inventory, prices, grading,
 * availability or cancellation is asserted — those are confirmed on enquiry.
 */

import type { Pillar } from "./siteContent";
import { pexels } from "./catalogue";

export interface HouseboatStat {
  value: string;
  label: string;
  note: string;
}

export interface HouseboatCard {
  title: string;
  image: string;
  alt: string;
  blurb: string;
  tag: string;
}

export interface HouseboatNote {
  question: string;
  answer: string;
}

/** Stat callouts, modelled on the reference site's "Discover" band. */
export const HOUSEBOAT_STATS: HouseboatStat[] = [
  {
    value: "1927",
    label: "Heritage",
    note: "The year the Baktoo family began operating treks and houseboat hospitality in Kashmir and Northern India.",
  },
  {
    value: "2–7",
    label: "Bedrooms",
    note: "Houseboats described from two to seven bedrooms, each with private ensuite facilities.",
  },
  {
    value: "Deluxe & A-class",
    label: "Classification",
    note: "Grades are assigned by the Kashmir Government, and are passed on as issued.",
  },
  {
    value: "Dal & Nigeen",
    label: "Lakes",
    note: "Booking access to houseboats on both of Srinagar's lakes.",
  },
];

/** The four ways of taking to the water, as a horizontally scrolling collection. */
export const HOUSEBOAT_CARDS: HouseboatCard[] = [
  {
    title: "Cedar houseboats",
    image: pexels("40348598"),
    alt: "Carved wooden houseboats moored along the shore of Dal Lake beneath snow-covered peaks",
    blurb:
      "Carved walnut furniture, Kashmir carpets, and a veranda that opens straight onto the lake.",
    tag: "Dal & Nigeen Lake",
  },
  {
    title: "Sunrise from the roof",
    image: pexels("34971547"),
    alt: "A shikara with a red canopy crossing Dal Lake with snow-covered mountains behind",
    blurb:
      "A sundeck above, a shikara below. The lake is at its quietest before the market boats push out.",
    tag: "First light",
  },
  {
    title: "The floating market",
    image: pexels("29251278"),
    alt: "A vendor selling vegetables from a shikara amid the floating market of Dal Lake",
    blurb:
      "Shikara crossings to the vegetable boats that still trade from the water, moored among the houseboats.",
    tag: "Daily",
  },
  {
    title: "Crafts of the valley",
    image: pexels("24428857"),
    alt: "A Kashmiri woman in mirror-work traditional dress, part of the valley's craft traditions",
    blurb:
      "Wood carving, carpet making and papier-mâché — the crafts that furnish the houseboat rooms, arranged as visits alongside the stay.",
    tag: "Wood · carpet · papier-mâché",
  },
  {
    title: "Gulmarg & Pahalgam",
    image: pexels("35672518"),
    alt: "Snow-dusted Himalayan peaks rising above a wide high valley of golden grass",
    blurb:
      "The mountain resorts are arranged alongside the houseboat stay — not instead of it.",
    tag: "Beyond the lake",
  },
];

/** What the brochure describes as part of the stay itself. */
export const HOUSEBOAT_INCLUDED: string[] = [
  "Private ensuite facilities in every bedroom.",
  "A veranda at the front with lake view, and a sundeck on the roof.",
  "A houseboat boy in attendance at all times.",
  "Living and dining rooms with intricately carved walnut furniture and Kashmir carpets.",
  "An extensive menu with a choice of Western, Indian or Kashmiri cuisine.",
  "Houseboats from two to seven bedrooms, on Dal or Nigeen Lake.",
  "Deluxe and “A” class options, classified by the Kashmir Government.",
  "Bookings for groups and individuals, with sole use of a houseboat available.",
];

/** Separate experiences the brochure lists alongside the houseboats. */
export const HOUSEBOAT_ALONGSIDE: string[] = [
  "Wood carving",
  "Carpet making",
  "Papier-mâché making",
  "Trips to the mountain resorts of Gulmarg and Pahalgam",
];

/** Practical questions answered strictly from the brochure record. */
export const HOUSEBOAT_NOTES: HouseboatNote[] = [
  {
    question: "Is a houseboat stay part of a numbered tour package?",
    answer:
      "No. Houseboats are arranged as a separate booking service, so they can be added to a Kashmir route or taken on their own. Tell us which journey you are on and we will place the nights alongside it.",
  },
  {
    question: "How are the houseboats classified?",
    answer:
      "The brochure records Deluxe and “A” class houseboats on Nigeen or Dal Lake, with the classification of houseboats the responsibility of the Kashmir Government. We pass the grade on as issued rather than rate a boat ourselves.",
  },
  {
    question: "How many rooms can we take?",
    answer:
      "Houseboats vary in size from two to seven bedrooms, each with private ensuite facilities. Bookings can be made for groups and individuals, and sole use of a houseboat can be hired.",
  },
  {
    question: "What is included in the stay?",
    answer:
      "A houseboat boy in attendance at all times, a veranda at the front with lake view, a sundeck on the roof, living and dining rooms with carved walnut furniture and Kashmir carpets, and an extensive menu with a choice of Western, Indian or Kashmiri cuisine.",
  },
  {
    question: "What has to be confirmed before booking?",
    answer:
      "Inventory, classification, prices, terms, cancellation policy, contact details and current availability must be confirmed with the operator. The brochure records that immediate confirmation can be given from all-season allocations; current options are confirmed on enquiry.",
  },
];

/** Tabbed editorial panels, modelled on the reference site's "Why travel with us" module. */
export const HOUSEBOAT_PILLARS: Pillar[] = [
  {
    key: "houseboat",
    label: "The houseboat",
    title: "Cedar, carved and moored",
    image: pexels("40348598"),
    tagline: "A veranda on the water, a sundeck above it",
    regionTag: "Dal & Nigeen Lake",
    body:
      "A Kashmir houseboat is a carved wooden vessel built to be lived in. The brochure describes bedrooms with private ensuite facilities, living and dining rooms finished with intricately carved walnut furniture and Kashmir carpets, a front veranda facing the lake, a roof sundeck, and a houseboat boy in attendance at all times.",
    href: "/enquiry",
    linkLabel: "Enquire about houseboats",
    highlights: [
      { title: "Two to seven bedrooms", detail: "Every bedroom described with private ensuite facilities." },
      { title: "Veranda and sundeck", detail: "Lake views at the front, open sky on the roof." },
      { title: "A houseboat boy", detail: "In attendance at all times throughout the stay." },
      { title: "Carved walnut & carpets", detail: "In the living and dining rooms, as the brochure records." },
    ],
  },
  {
    key: "lake",
    label: "On the lake",
    title: "Shikara crossings at first light",
    image: pexels("34971547"),
    tagline: "The market boats are already moving",
    regionTag: "Dal Lake",
    body:
      "Dal and Nigeen are crossed in shikaras — narrow wooden boats with a canopy, worked by a single oarsman. The lake surface is the houseboat's forecourt: from a veranda you watch the vegetable boats and the visitors' shikaras thread between the moored houseboats, with the snow line of the surrounding ranges above the water.",
    href: "/enquiry",
    linkLabel: "Plan a stay on the lake",
    highlights: [
      { title: "Shikara rides", detail: "The standard way across the lake and between houseboats." },
      { title: "Floating gardens", detail: "Lakeside vegetable gardens seen from the water." },
      { title: "Sunrise and dusk", detail: "The quietest hours on the water, before and after the market." },
      { title: "Snow-line views", detail: "Ranges rising above both lakes, in every season." },
    ],
  },
  {
    key: "market",
    label: "The floating market",
    title: "Vegetables that arrive by boat",
    image: pexels("29251278"),
    tagline: "Traders who never leave the water",
    regionTag: "Dal Lake",
    body:
      "The lake still carries its own market. Growers on the shore load their shikaras at the water's edge and work their way out to sell directly to the houseboats and to the kitchens of Srinagar. A short crossing takes you alongside the boats themselves — the closest thing in Kashmir to a market you sail through.",
    href: "/enquiry",
    linkLabel: "Ask about a shikara crossing",
    highlights: [
      { title: "Morning traders", detail: "Boats out and working the lake from first light." },
      { title: "Lake vegetables", detail: "Produce grown in the lakeside gardens, sold on the water." },
      { title: "Shikara company", detail: "Travel with a local oarsman rather than by road." },
      { title: "Off the beaten route", detail: "A market no visitor reaches by car." },
    ],
  },
  {
    key: "crafts",
    label: "Crafts & culture",
    title: "Walnut, carpet and papier-mâché",
    image: pexels("24428857"),
    tagline: "The crafts the houseboat rooms are furnished with",
    regionTag: "Kashmir Valley",
    body:
      "The brochure lists wood carving, carpet making and papier-mâché making among the experiences that sit alongside the houseboat stay. They explain the houseboat interiors directly: the carved walnut screens and furniture, the floor carpets and the papier-mâché work are made in the valley's workshops, many of them within a short drive of the lakes.",
    href: "/enquiry",
    linkLabel: "Arrange a craft visit",
    highlights: [
      { title: "Wood carving", detail: "Carved walnut screens, doors and furniture." },
      { title: "Carpet making", detail: "The Kashmir carpets that furnish houseboat rooms." },
      { title: "Papier-mâché", detail: "An old valley craft, worked in small workshops." },
      { title: "The valley beyond", detail: "Workshop visits arranged separately from the stay." },
    ],
  },
  {
    key: "resorts",
    label: "Beyond the lake",
    title: "Gulmarg and Pahalgam",
    image: pexels("35672518"),
    tagline: "Two mountain resorts, one route",
    regionTag: "Gulmarg & Pahalgam",
    body:
      "The same brochure that lists the houseboats also lists trips to the mountain resorts of Gulmarg and Pahalgam. They are arranged separately from the houseboat stay — the standard pairing is a few nights moored on the lake, then the road north into the meadows and the pine slopes beyond it.",
    href: "/journeys?region=Kashmir#catalogue",
    linkLabel: "See Kashmir journeys",
    highlights: [
      { title: "Gulmarg", detail: "Meadows and pine slopes, as the brochure records them." },
      { title: "Pahalgam", detail: "A valley base on the Lidder, reached by road from Srinagar." },
      { title: "Srinagar between", detail: "The houseboat stop sits between the two resorts." },
      { title: "Seamless by road", detail: "The resorts are arranged alongside the stay, not separately." },
    ],
  },
];
