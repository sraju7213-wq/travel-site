/**
 * Navigation — single source of truth for every menu in the product.
 *
 * The desktop header dropdowns, the mobile drawer and the footer all read from
 * this module, so a link can never point somewhere that does not exist.
 * Everything here is derived from `siteContent` / `brandConfig`; no new copy or
 * contact details are invented.
 */

import { BRAND } from "@/data/brandConfig";
import { DESTINATIONS, EXPERIENCES } from "@/data/siteContent";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  image?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  /** Short line shown under the group heading in the desktop dropdown. */
  note: string;
  links: NavLink[];
}

/** Journey categories, as published in the brochure catalogue. */
export const JOURNEY_CATEGORIES: NavLink[] = [
  {
    label: "All journeys",
    href: "/journeys",
    description: "The full 27-package catalogue, filterable by region, duration and activity.",
  },
  {
    label: "Stopovers",
    href: "/journeys?category=Stopovers#catalogue",
    description: "Short city breaks — Delhi, Bombay, Leh and Kathmandu.",
  },
  {
    label: "Images of India",
    href: "/journeys?category=Images%20of%20India#catalogue",
    description: "Golden Triangle, Goa, Kerala backwaters and Kashmir circuits.",
  },
  {
    label: "India tours",
    href: "/journeys?category=India%20Tours#catalogue",
    description: "Comprehensive North and South India highlight circuits.",
  },
  {
    label: "Himalayan expeditions",
    href: "/journeys?category=Himalayan%20Expeditions#catalogue",
    description: "High-altitude trekking in Markha Valley and Zanskar.",
  },
  {
    label: "Mini trek in Kashmir",
    href: "/journeys?category=Mini%20Trek%20in%20Kashmir#catalogue",
    description: "Alpine lake trails, pine meadows and Gulmarg skiing.",
  },
  {
    label: "Nepal adventure",
    href: "/journeys?category=Nepal%20Adventure#catalogue",
    description: "Trekking, Trisuli rafting and Chitwan wildlife.",
  },
];

export const DESTINATION_LINKS: NavLink[] = DESTINATIONS.map((d) => ({
  label: d.name,
  href: d.href,
  description: d.tagline,
  image: d.image,
}));

export const EXPERIENCE_LINKS: NavLink[] = EXPERIENCES.map((e) => ({
  label: e.title,
  href: e.href,
  description: e.locations,
  image: e.image,
}));

/**
 * Groups rendered inside the mobile drawer and as desktop dropdown panels.
 * `id` is used for the panel/region ids, so it must stay stable.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: "destinations",
    label: "Destinations",
    note: "Eight regions we operate in",
    links: DESTINATION_LINKS,
  },
  {
    id: "journeys",
    label: "Journeys",
    note: "27 brochure itineraries",
    links: JOURNEY_CATEGORIES,
  },
  {
    id: "experiences",
    label: "Experiences",
    note: "Trekking, safaris, rafting and houseboats",
    links: EXPERIENCE_LINKS,
  },
  {
    id: "company",
    label: "Company",
    note: "Heritage, houseboats and enquiries",
    links: [
      { label: "Our heritage", href: "/about", description: "The Baktoo family, since 1927" },
      {
        label: "Kashmir houseboats",
        href: "/houseboats",
        description: "Shikara nights on Dal Lake",
        image: "/images/destinations/kashmir-shikara.jpg",
      },
      { label: "Contact", href: "/contact", description: "Reach the booking desk" },
      { label: "Plan your trip", href: "/enquiry", description: "Tell us your dates and interests" },
      { label: "Privacy notice", href: "/privacy", description: "How we handle your details" },
    ],
  },
];

/**
 * Top-level items rendered in the desktop header bar.
 * `group` names the dropdown panel that opens under the item; without it the
 * item is a plain link.
 */
export interface HeaderLink extends NavLink {
  group?: string;
}

export const HEADER_LINKS: HeaderLink[] = [
  { label: "Journeys", href: "/journeys", group: "journeys" },
  { label: "Destinations", href: "/journeys#catalogue", group: "destinations" },
  { label: "Experiences", href: "/journeys#catalogue", group: "experiences" },
  { label: "Houseboats", href: "/houseboats" },
  { label: "Heritage", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Links shown in the sticky footer of the mobile drawer. */
export const DRAWER_UTILITY_LINKS: NavLink[] = [
  { label: "Plan your trip", href: "/enquiry" },
  { label: "All journeys", href: "/journeys" },
  { label: "Kashmir houseboats", href: "/houseboats" },
  { label: "Contact", href: "/contact" },
];

/**
 * Canonical booking-desk contact details, taken from the brochure
 * (`BRAND.bookingOffice`). Never hard-code a phone number or email in a
 * component — use these so the header, drawer and contact page agree.
 */
export const CONTACT = {
  phoneMobile: BRAND.bookingOffice.phoneMobile,
  phoneLandline: BRAND.bookingOffice.phoneLandline,
  email: BRAND.bookingOffice.email,
  address: BRAND.bookingOffice.address,
  phoneMobileHref: `tel:${BRAND.bookingOffice.phoneMobile.replace(/\s+/g, "")}`,
  phoneLandlineHref: `tel:${BRAND.bookingOffice.phoneLandline.replace(/\s+/g, "")}`,
  emailHref: `mailto:${BRAND.bookingOffice.email}`,
} as const;
