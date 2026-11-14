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

export interface PillarHighlight {
  title: string;
  detail: string;
}

export interface Pillar {
  key: string;
  label: string;
  title: string;
  image: string;
  body: string;
  href: string;
  linkLabel: string;
  tagline?: string;
  statBadge?: string;
  statLabel?: string;
  regionTag?: string;
  highlights?: PillarHighlight[];
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
    image: "/images/destinations/ladakh-key-monastery.jpg",
    blurb:
      "High passes, Buddhist monasteries and the cold desert of the Nubra valley. A journey of wide skies and empty roads, from Leh to the shore of Pangong.",
    href: "/explore?region=Ladakh",
  },
  {
    name: "Kashmir",
    tagline: "Srinagar, Gulmarg & Sonamarg",
    image: "/images/destinations/kashmir-dal-lake-fruit-boat.jpg",
    blurb:
      "Shikara on Dal Lake, meadow walks in Gulmarg and the meadows of Sonamarg, with houseboat nights on the water.",
    href: "/explore?region=Kashmir",
  },
  {
    name: "Nepal",
    tagline: "Kathmandu, Pokhara & Chitwan",
    image: "/images/destinations/nepal-boudhanath-dusk.jpg",
    blurb:
      "Stupas and temple squares in the Kathmandu valley, the peaks that ring Pokhara, and the rhino herds of Chitwan.",
    href: "/explore?region=Nepal",
  },
  {
    name: "Rajasthan",
    tagline: "Jaipur, Jodhpur, Udaipur & Jaisalmer",
    image: "/images/destinations/rajasthan-desert-camels.jpg",
    blurb:
      "Forts, stepwells and desert camps across the Thar. A heritage route built around the great Rajput strongholds.",
    href: "/explore?q=heritage",
  },
  {
    name: "Goa",
    tagline: "Panjim & the Konkan coast",
    image: "/images/destinations/goa-coast-rocks.jpg",
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
    image: "/images/destinations/varanasi-ganges-boating.jpg",
    blurb:
      "Dawn on the ghats, the cremation banks and the old lanes of Kashi, with Sarnath and Bodh Gaya nearby.",
    href: "/explore?region=Varanasi",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    title: "Himalayan trekking",
    image: "/images/experiences/himalayan-trekking-nubra.jpg",
    description:
      "Walk the Markha, Zanskar and Vale of Kashmir trails, camping by the glacier and crossing high passes.",
    locations: "Ladakh, Kashmir",
    href: "/explore?activity=trekking",
  },
  {
    title: "Kashmir houseboats",
    image: "/images/experiences/kashmir-boat-shikara.jpg",
    description:
      "A night aboard a houseboat on Dal Lake, with a shikara to the floating gardens and Srinagar's shrines.",
    locations: "Kashmir",
    href: "/houseboats",
  },
  {
    title: "River rafting",
    image: "/images/experiences/river-rafting-gulsitara.jpg",
    description:
      "Whitewater rafting on the Trisuli with rafting equipment and an experienced English-speaking guide.",
    locations: "Nepal",
    href: "/explore?activity=rafting",
  },
  {
    title: "Wildlife & safaris",
    image: "/images/experiences/wildlife-safari-kanha.jpg",
    description:
      "Jungle safaris in Chitwan on foot and by boat, tracking rhino through the sal forest and the Terai.",
    locations: "Nepal, Kerala",
    href: "/explore?activity=wildlife",
  },
  {
    title: "Backwaters & houseboats",
    image: "/images/experiences/alleppey-backwaters-houseboat.jpg",
    description:
      "Kettuvallam houseboats through the Kerala backwaters, rice barges and the thatched villages of Alleppey.",
    locations: "Kerala",
    href: "/explore?activity=houseboat%2Fbackwaters",
  },
  {
    title: "Temples & monuments",
    image: "/images/destinations/taj-mahal.jpg",
    description:
      "The Taj Mahal, Amber Fort, Swayambhunath and the ghats of Varanasi, as listed in the brochure itineraries.",
    locations: "Agra, Jaipur, Varanasi",
    href: "/explore?q=heritage",
  },
  {
    title: "Village & culture",
    image: "/images/experiences/village-and-culture.jpg",
    description:
      "Special-interest programmes for clubs, schools and groups, arranged on request.",
    locations: "India, Nepal",
    href: "/explore?activity=culture",
  },
];

export const PILLARS: Pillar[] = [
  {
    key: "destinations",
    label: "Destinations",
    title: "Iconic Destinations",
    image: "/images/destinations/pokhara-lake.jpg",
    tagline: "Unrivalled Subcontinent Heritage Across Two Himalayan Nations",
    statBadge: "Since 1927",
    statLabel: "Pioneer Operator",
    regionTag: "India & Nepal",
    body:
      "A specialist operator for India and Nepal since 1927. Each destination opens a whole new world of landscapes, cultures, sights and sounds for you to discover, from the Himalaya to the backwaters.",
    href: "/explore",
    linkLabel: "Discover India & Nepal",
    highlights: [
      { title: "Specialist Route Design", detail: "Custom itineraries spanning high Himalayan passes down to tranquil backwaters." },
      { title: "No Minimum Group Quotas", detail: "Itineraries operate for solo adventurers, couples, or private parties at your own pace." },
      { title: "Brochure-Verified Catalogues", detail: "Every route is rooted in verified itineraries refined across four generations." },
    ],
  },
  {
    key: "wildlife",
    label: "Wildlife",
    title: "Best Wildlife Experiences",
    image: "/images/destinations/rhino.jpg",
    tagline: "Rare Habitat Encounters Guided by Resident Naturalists",
    statBadge: "Protected Reserves",
    statLabel: "Resident Trackers",
    regionTag: "Chitwan, Periyar & Terai",
    body:
      "Wildlife journeys reach Chitwan, Periyar and the Terai, with resident naturalists, elephant and jeep safaris, nature walks and canoe trips among the programme options.",
    href: "/explore?activity=wildlife",
    linkLabel: "Explore wildlife journeys",
    highlights: [
      { title: "Diverse Safari Formats", detail: "Jeep safaris, jungle nature walks, and tranquil river canoe expeditions across reserves." },
      { title: "Resident Naturalists", detail: "Accredited wildlife trackers and regional specialists interpret native flora and fauna." },
      { title: "Low-Impact Field Ethos", detail: "Respectful, ethical observation in premier national parks and protected habitats." },
    ],
  },
  {
    key: "guides",
    label: "Guides",
    title: "Guides & Dedicated Support",
    image: "/images/destinations/vale-trek.jpg",
    tagline: "Experienced Field Crews & Dedicated Expedition Leaders",
    statBadge: "100% Escorted",
    statLabel: "Mountain Field Crews",
    regionTag: "Himalayas & High Passes",
    body:
      "Trekking itineraries in our catalogue are escorted by experienced English-speaking guides and support crews. Special-interest tours are led by a team leader from Australia who specialises in a particular area.",
    href: "/explore",
    linkLabel: "See trekking journeys",
    highlights: [
      { title: "English-Speaking Guides", detail: "Seasoned mountain leaders fluent in regional trails, local dialects, and high-altitude safety." },
      { title: "Dedicated Support Crews", detail: "Full camp staff, porter crews, and kitchen teams accompanying every trekking stage." },
      { title: "Specialist Tour Leaders", detail: "Specialist itineraries accompanied by experienced leaders dedicated to the field." },
    ],
  },
  {
    key: "architecture",
    label: "Accommodation",
    title: "Character & Heritage Accommodation",
    image: "/images/destinations/jodhpur-fort.jpg",
    tagline: "Handpicked Heritage Havelis, Palace Hotels & Boutique Stays",
    statBadge: "Handpicked",
    statLabel: "Historic Character",
    regionTag: "Centrally Located Stays",
    body:
      "All accommodation is carefully selected: well serviced and centrally located, chosen for ambience, comfort, architecture and history, from deluxe categories to family-run establishments.",
    href: "/explore?category=India%20Tours",
    linkLabel: "See India tours",
    highlights: [
      { title: "Historic Character & Ambience", detail: "Properties chosen for distinct architecture, history, and authentic sense of place." },
      { title: "Centrally Located Stays", detail: "Well-serviced hotels located near key sights to eliminate unnecessary transit delays." },
      { title: "Family-Run Hospitality", detail: "Warmth, character, and attentive service across vetted boutique and deluxe categories." },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    title: "Living Cultural Exploration",
    image: "/images/destinations/kashmir-shikara.jpg",
    tagline: "Living Sacred Ceremonies, Monasteries & Ancient Ways",
    statBadge: "Authentic Access",
    statLabel: "Living Traditions",
    regionTag: "Varanasi to Ladakh",
    body:
      "From dawn on the ghats of Varanasi to Buddhist monasteries in Ladakh, each place honours its own traditions. Special-interest programmes can be arranged for clubs, schools and groups on request.",
    href: "/explore?activity=culture",
    linkLabel: "Explore cultural journeys",
    highlights: [
      { title: "Sacred Rituals & Monasteries", detail: "Dawn ceremonies on the Ganges ghats, serene Ladakh gompas, and floating Dal Lake markets." },
      { title: "Living Traditions", detail: "Insightful cultural exchanges honouring regional customs and local communities." },
      { title: "Special-Interest Programmes", detail: "Tailored arrangements for photography societies, study groups, and special clubs." },
    ],
  },
  {
    key: "travel",
    label: "Travel",
    title: "Seamless, Trusted Travel",
    image: "/images/destinations/himalaya-horses.jpg",
    tagline: "Private Road Transfers & Complete Peace of Mind",
    statBadge: "Seamless",
    statLabel: "Private Road Transit",
    regionTag: "Door-to-Door Pacing",
    body:
      "Road transfers, accommodation and sightseeing are planned around your dates and party, with arrival and departure transfers included in the package inclusions.",
    href: "/enquiry",
    linkLabel: "Talk to a travel designer",
    highlights: [
      { title: "Private Chauffeur Transfers", detail: "Comfortable air-conditioned vehicles and vetted professional drivers for all road routes." },
      { title: "Arrival & Departure Inclusions", detail: "Seamless airport greetings and station transfer logistics handled without stress." },
      { title: "Individual Tailor-Made Pacing", detail: "Flexible itineraries adapted to your specific dates, travel party, and desired rhythm." },
    ],
  },
  {
    key: "impact",
    label: "Impact",
    title: "Programmes & Heritage Stewardship",
    image: "/images/destinations/nepal-trek.jpg",
    tagline: "Pioneering Educational Expeditions & Local Community Ties",
    statBadge: "Community First",
    statLabel: "Shared Stewardship",
    regionTag: "Subcontinent Wide",
    body:
      "Escorted student tours run for schools in both India and Nepal, and special-interest programmes can be arranged for clubs, schools and groups.",
    href: "/about",
    linkLabel: "Read about our heritage",
    highlights: [
      { title: "Escorted Student Expeditions", detail: "Curated educational journeys fostering global empathy and outdoor experiential learning." },
      { title: "Direct Community Investment", detail: "Direct engagement supporting regional guides, boatmen, local artisans, and family lodges." },
      { title: "Centuries of Local Kinship", detail: "Rooted in four generations of family hospitality and regional stewardship since 1927." },
    ],
  },
];

export const STATS: Stat[] = [
  { value: "Since 1927", label: "Founding heritage", note: "Baktoo family regional tourism pioneer" },
  { value: "27", label: "Journeys", note: "In the brochure catalogue" },
  { value: "Two", label: "Countries", note: "India and the Nepali Himalaya" },
  { value: "Up to 15", label: "Travellers", note: "Per group, or a solo itinerary" },
  { value: "Flexible", label: "Every itinerary", note: "Planned around your dates" },
];

export const PROMISES: Promise[] = [
  {
    title: "Small groups, or solo departures",
    body:
      "Our tours run without minimum group quotas, accommodating small private parties of up to 15 travellers or bespoke solo departures, subject to seasonal weather safety and high-pass access.",
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
      { label: "Privacy Notice", href: "/privacy" },
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
