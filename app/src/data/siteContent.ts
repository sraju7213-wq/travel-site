/**
 * Editorial content for the marketing surface of the site.
 *
 * Every claim here is grounded in the organisation's own brochure or in the
 * brochure-derived catalogue. Nothing about awards, reviews, ratings, prices or
 * availability is stated, because none of that is verified.
 */

export interface Destination {
  name: string;
  tagline: string;
  image: string;
  blurb: string;
  href: string;
}

export interface Experience {
  title: string;
  image: string;
  description: string;
  locations: string;
  href: string;
}

export interface Pillar {
  key: string;
  label: string;
  title: string;
  image: string;
  body: string;
  href: string;
  linkLabel: string;
}

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export interface Promise {
  title: string;
  body: string;
}

export const DESTINATIONS: Destination[] = [
  {
    name: "Ladakh",
    tagline: "Leh, Nubra Valley & Pangong",
    image: "/images/destinations/ladakh-monastery.jpg",
    blurb:
      "High passes, Buddhist monasteries and the cold desert of the Nubra valley. A journey of wide skies and empty roads, from Leh to the shore of Pangong.",
    href: "/explore?region=Ladakh",
  },
  {
    name: "Kashmir",
    tagline: "Srinagar, Gulmarg & Sonamarg",
    image: "/images/destinations/kashmir-shikara.jpg",
    blurb:
      "Shikara on Dal Lake, meadow walks in Gulmarg and the meadows of Sonamarg, with houseboat nights on the water.",
    href: "/explore?region=Kashmir",
  },
  {
    name: "Nepal",
    tagline: "Kathmandu, Pokhara & Chitwan",
    image: "/images/destinations/swayambhu-stupa.jpg",
    blurb:
      "Stupas and temple squares in the Kathmandu valley, the peaks that ring Pokhara, and the rhino herds of Chitwan.",
    href: "/explore?region=Nepal",
  },
  {
    name: "Rajasthan",
    tagline: "Jaipur, Jodhpur, Udaipur & Jaisalmer",
    image: "/images/destinations/jodhpur-fort.jpg",
    blurb:
      "Forts, stepwells and desert camps across the Thar. A heritage route built around the great Rajput strongholds.",
    href: "/explore?q=heritage",
  },
  {
    name: "Goa",
    tagline: "Panjim & the Konkan coast",
    image: "/images/destinations/goa-beach.jpg",
    blurb:
      "Portuguese-era Panjim, long beaches and the churches and villages of the Konkan interior.",
    href: "/explore?region=Goa",
  },
  {
    name: "Kerala",
    tagline: "Backwaters, Thekkady & Munnar",
    image: "/images/destinations/kerala-backwaters.jpg",
    blurb:
      "A houseboat on the backwaters, tea country in Munnar and elephant country in Thekkady.",
    href: "/explore?region=Kerala",
  },
  {
    name: "Agra & the Taj",
    tagline: "The Golden Triangle",
    image: "/images/destinations/taj-mahal.jpg",
    blurb:
      "The Taj Mahal at Agra, Fatehpur Sikri and the palaces of Jaipur, with Delhi at either end.",
    href: "/explore?q=golden%20triangle",
  },
  {
    name: "Varanasi",
    tagline: "The Ganges ghats",
    image: "/images/destinations/varanasi-ghat.jpg",
    blurb:
      "Dawn on the ghats, the cremation banks and the old lanes of Kashi, with Sarnath and Bodh Gaya nearby.",
    href: "/explore?region=Varanasi",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    title: "Himalayan trekking",
    image: "/images/destinations/vale-trek.jpg",
    description:
      "Walk the Markha, Zanskar and Vale of Kashmir trails, camping by the glacier and crossing high passes.",
    locations: "Ladakh, Kashmir",
    href: "/explore?activity=trekking",
  },
  {
    title: "Kashmir houseboats",
    image: "/images/destinations/dal-lake.jpg",
    description:
      "A night aboard a houseboat on Dal Lake, with a shikara to the floating gardens and Srinagar's shrines.",
    locations: "Kashmir",
    href: "/houseboats",
  },
  {
    title: "River rafting",
    image: "/images/destinations/rafting.jpg",
    description:
      "Grade II and III rapids on the Trisuli, with an English-speaking river guide and full safety equipment.",
    locations: "Nepal",
    href: "/explore?activity=rafting",
  },
  {
    title: "Wildlife & safaris",
    image: "/images/destinations/rhino.jpg",
    description:
      "Jungle safaris in Chitwan on foot and by boat, tracking rhino through the sal forest and the Terai.",
    locations: "Nepal, Kerala",
    href: "/explore?activity=wildlife",
  },
  {
    title: "Backwaters & houseboats",
    image: "/images/destinations/kerala-backwaters.jpg",
    description:
      "Kettuvallam houseboats through the Kerala backwaters, rice barges and the thatched villages of Alleppey.",
    locations: "Kerala",
    href: "/explore?activity=houseboat%2Fbackwaters",
  },
  {
    title: "Temples & monuments",
    image: "/images/destinations/taj-mahal.jpg",
    description:
      "The Taj Mahal, Amber Fort, Swayambhunath and the ghats of Varanasi, with a guide at each stop.",
    locations: "Agra, Jaipur, Varanasi",
    href: "/explore?q=heritage",
  },
  {
    title: "Village & culture",
    image: "/images/destinations/nepal-collage.jpg",
    description:
      "Special-interest programmes with schools and community groups, arranged around the interests you name.",
    locations: "India, Nepal",
    href: "/explore?activity=culture",
  },
];

export const PILLARS: Pillar[] = [
  {
    key: "destinations",
    label: "Destinations",
    title: "Iconic destinations",
    image: "/images/destinations/pokhara-lake.jpg",
    body:
      "By being among the first in a place, we have access to some of Earth's most significant wild places. Each destination opens a whole new world of landscapes, cultures, sights and sounds for you to discover.",
    href: "/explore",
    linkLabel: "Discover India & Nepal",
  },
  {
    key: "wildlife",
    label: "Wildlife",
    title: "Best wildlife experiences",
    image: "/images/destinations/rhino.jpg",
    body:
      "Meet guides with an uncommon ability for understanding, finding and explaining wildlife. Chitwan's rhino and elephant herds, Periyar's elephants and the birdlife of the Terai are all reached on foot, by boat and by vehicle.",
    href: "/explore?activity=wildlife",
    linkLabel: "Explore wildlife journeys",
  },
  {
    key: "guides",
    label: "Guides",
    title: "Guides who know the ground",
    image: "/images/destinations/vale-trek.jpg",
    body:
      "Our guides are hired locally and stay with an itinerary from its first day to its last, so you are always walking with someone who knows the trail, the weather and the village.",
    href: "/explore",
    linkLabel: "Meet our travel designers",
  },
  {
    key: "architecture",
    label: "Architecture",
    title: "Hotels chosen with care",
    image: "/images/destinations/jodhpur-fort.jpg",
    body:
      "All our accommodation is carefully selected. Hotels are well serviced and centrally located, with properties chosen for their ambience and creation of comfort, their architecture and their history.",
    href: "/explore?category=India%20Tours",
    linkLabel: "See India tours",
  },
  {
    key: "culture",
    label: "Culture",
    title: "Cultural exploration",
    image: "/images/destinations/kashmir-shikara.jpg",
    body:
      "From dawn on the ghats of Varanasi to Buddhist monasteries in Ladakh, each place honours its own traditions. Special-interest programmes can be arranged for your club, school, social or special-interest group.",
    href: "/explore?activity=culture",
    linkLabel: "Explore cultural journeys",
  },
  {
    key: "travel",
    label: "Travel",
    title: "Seamless, trusted travel",
    image: "/images/destinations/himalaya-horses.jpg",
    body:
      "Flights, road transfers, permits and accommodation are planned around your dates and party, with a local contact on the ground for every leg of the journey.",
    href: "/enquiry",
    linkLabel: "Talk to a travel designer",
  },
  {
    key: "impact",
    label: "Impact",
    title: "Travel that stays local",
    image: "/images/destinations/nepal-trek.jpg",
    body:
      "We hire locally and run escorted student tours and community programmes across India and Nepal, keeping the value of your journey inside the places you visit.",
    href: "/about",
    linkLabel: "Read about us",
  },
];

export const STATS: Stat[] = [
  { value: "Since 1927", label: "Specialist travel", note: "Operators for India and Nepal" },
  { value: "27", label: "Journeys", note: "In the brochure catalogue" },
  { value: "Two", label: "Countries", note: "India and the Nepali Himalaya" },
  { value: "Up to 15", label: "Travellers", note: "Per group, or a solo itinerary" },
  { value: "Tailor-made", label: "Every itinerary", note: "Shaped around your dates" },
];

export const PROMISES: Promise[] = [
  {
    title: "Small groups, or solo",
    body:
      "Our tours are guaranteed to depart and can be enjoyed by a small group of up to 15 travellers, or as a solo traveller on the same itinerary.",
  },
  {
    title: "Hotels chosen for comfort",
    body:
      "All our accommodation has been carefully selected — well serviced, centrally located, with properties chosen for ambience, comfort, architecture and history.",
  },
  {
    title: "Real experience, real value",
    body:
      "Detailed information is available on request. Every tour runs with real experiences and an opportunity to take in selected areas of India and Nepal.",
  },
];

export const NAV_CATEGORIES = [
  {
    label: "Destinations",
    items: DESTINATIONS.map((d) => ({ label: d.name, href: d.href })),
  },
  {
    label: "Journeys",
    items: [
      { label: "All journeys", href: "/explore" },
      { label: "Stopovers", href: "/explore?category=Stopovers" },
      { label: "Images of India", href: "/explore?category=Images%20of%20India" },
      { label: "India tours", href: "/explore?category=India%20Tours" },
      { label: "Himalayan expeditions", href: "/explore?category=Himalayan%20Expeditions" },
      { label: "Mini trek in Kashmir", href: "/explore?category=Mini%20Trek%20in%20Kashmir" },
      { label: "Nepal adventure", href: "/explore?category=Nepal%20Adventure" },
    ],
  },
  {
    label: "Experiences",
    items: EXPERIENCES.map((e) => ({ label: e.title, href: e.href })),
  },
  {
    label: "Company",
    items: [
      { label: "About us", href: "/about" },
      { label: "Kashmir houseboats", href: "/houseboats" },
      { label: "Plan your trip", href: "/enquiry" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Plan your trip", href: "/enquiry" },
      { label: "Kashmir houseboats", href: "/houseboats" },
    ],
  },
  {
    title: "Destinations",
    links: DESTINATIONS.map((d) => ({ label: d.name, href: d.href })),
  },
  {
    title: "Journeys & experiences",
    links: [
      { label: "All journeys", href: "/explore" },
      { label: "Himalayan trekking", href: "/explore?activity=trekking" },
      { label: "Wildlife safaris", href: "/explore?activity=wildlife" },
      { label: "River rafting", href: "/explore?activity=rafting" },
      { label: "Kashmir houseboats", href: "/houseboats" },
      { label: "Cultural journeys", href: "/explore?activity=culture" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Tailor-made itineraries", href: "/enquiry" },
      { label: "Small-group journeys", href: "/explore?category=Stopovers" },
      { label: "Special-interest groups", href: "/enquiry" },
      { label: "Houseboat booking service", href: "/houseboats" },
    ],
  },
];
