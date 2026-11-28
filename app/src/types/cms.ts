export type CmsDocumentType =
  | "package"
  | "destination"
  | "page"
  | "homepage"
  | "settings"
  | "theme"
  | "testimonial"
  | "faq"
  | "banner";

export type CmsStatus = "draft" | "published" | "unpublished" | "archived";

export interface CmsDocument<T = Record<string, unknown>> {
  id: string;
  type: CmsDocumentType;
  slug: string;
  title: string;
  status: CmsStatus;
  draftData: T;
  publishedData: T | null;
  publishedSlug: string | null;
  sortOrder: number;
  createdBy: string | null;
  updatedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsSeo {
  title?: string;
  metaDescription?: string;
  slug?: string;
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  socialImage?: string;
  socialImageAlt?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  includeInSitemap?: boolean;
  keywords?: string[];
}

export interface CmsCta {
  label?: string;
  href?: string;
  visible?: boolean;
  target?: "_self" | "_blank";
}

export interface CmsMedia {
  id?: string;
  url: string;
  alt?: string;
  caption?: string;
  title?: string;
  role?: "hero" | "thumbnail" | "gallery" | "additional" | "background";
  order?: number;
  visible?: boolean;
  focalPoint?: { x: number; y: number };
  width?: number;
  height?: number;
  variants?: Array<{ url: string; width: number; height?: number; format?: string }>;
}

export interface CmsListItem {
  id?: string;
  text?: string;
  value?: string;
  title?: string;
  label?: string;
  visible?: boolean;
  order?: number;
  [key: string]: unknown;
}

export interface CmsItineraryDay {
  id?: string;
  day?: number | string;
  title?: string;
  location?: string;
  description?: string;
  activities?: string[];
  meals?: string;
  accommodation?: string;
  images?: CmsMedia[];
  notes?: string;
  visible?: boolean;
  stops?: string[];
  transfers?: string;
}

export interface CmsSeasonalPrice {
  id?: string;
  label: string;
  startDate?: string;
  endDate?: string;
  price?: number | null;
  childPrice?: number | null;
  notes?: string;
  visible?: boolean;
}

export interface CmsPackagePricing {
  basePrice?: number | null;
  currency?: string;
  priceBasis?: "per_person" | "per_group" | string;
  childPrice?: number | null;
  childAge?: string;
  seasonalPricing?: CmsSeasonalPrice[];
  customPricingNotes?: string;
  startingPriceDisplay?: string;
  showPricing?: boolean;
  showStartingPrice?: boolean;
  taxesAndFeesNote?: string;
}

export interface CmsPackageFaq {
  id?: string;
  question: string;
  answer: string;
  visible?: boolean;
}

export interface CmsPackage {
  id: string;
  slug?: string;
  title: string;
  name?: string;
  category: string;
  destination?: string;
  destinationSlug?: string;
  region: string[];
  regionName?: string;
  brochure_code: string;
  summary: string;
  shortDescription?: string;
  fullDescription?: string;
  duration: string;
  durationDays?: number | null;
  durationNights?: number | null;
  difficulty: string | null;
  tourType?: string;
  bestSeason?: string;
  featured?: boolean;
  status?: CmsStatus;
  source_page?: number;
  content_flags?: string[];
  highlights?: string[];
  itinerary?: CmsItineraryDay[];
  itineraryVisible?: boolean;
  inclusions?: Array<string | CmsListItem>;
  exclusions?: Array<string | CmsListItem>;
  inclusionsVisible?: boolean;
  exclusionsVisible?: boolean;
  inclusionItemsVisible?: boolean;
  exclusionItemsVisible?: boolean;
  pricing?: CmsPackagePricing;
  media?: CmsMedia[];
  heroImage?: CmsMedia | string | null;
  thumbnail?: CmsMedia | string | null;
  coverImage?: CmsMedia | string | null;
  gallery?: CmsMedia[];
  additionalImages?: CmsMedia[];
  startingPoint?: string;
  endingPoint?: string;
  transportation?: string;
  accommodationDetails?: string;
  importantInformation?: string;
  cancellationPolicy?: string;
  faqs?: CmsPackageFaq[];
  relatedPackages?: string[];
  seo?: CmsSeo;
  pricePerPerson?: number | null;
  currency?: string;
  [key: string]: unknown;
}

export type CmsSectionType =
  | "hero"
  | "image-text"
  | "full-width-image"
  | "package-grid"
  | "destination-grid"
  | "testimonials"
  | "statistics"
  | "faq"
  | "image-gallery"
  | "promotional-banner"
  | "cta";

export interface CmsSection {
  id: string;
  type: CmsSectionType;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundColor?: string;
  layout?: "left" | "right" | "center" | "full" | "two-column" | "three-column" | "four-column" | string;
  height?: string;
  textAlign?: "left" | "center" | "right";
  overlay?: number;
  focalPoint?: { x: number; y: number };
  backgroundType?: "image" | "video" | "color";
  ctaPrimary?: CmsCta;
  ctaSecondary?: CmsCta;
  packages?: string[];
  packageLimit?: number;
  destinations?: string[];
  destinationLimit?: number;
  stats?: Array<{ value: string; label: string; note?: string; visible?: boolean }>;
  faqs?: Array<{ question: string; answer: string; visible?: boolean }>;
  testimonials?: Array<{
    id?: string;
    name: string;
    role?: string;
    location?: string;
    quote: string;
    image?: string;
    imageAlt?: string;
    visible?: boolean;
    rating?: number | null;
  }>;
  items?: CmsListItem[];
  images?: CmsMedia[];
  itemsVisible?: boolean;
  /** Existing component variant retained for backwards-compatible layouts. */
  variant?: string;
  [key: string]: unknown;
}

export interface CmsHomepageData {
  sections: CmsSection[];
  seo?: CmsSeo;
  [key: string]: unknown;
}

export interface CmsPageData {
  sections: CmsSection[];
  seo?: CmsSeo;
  template?: string;
  parentSlug?: string;
  [key: string]: unknown;
}

export interface CmsDestination {
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  shortDescription?: string;
  region?: string;
  parentSlug?: string | null;
  country?: string;
  image?: string;
  heroImage?: string;
  imageAlt?: string;
  imagePosition?: string;
  focalPoint?: { x: number; y: number };
  gallery?: CmsMedia[];
  highlights?: Array<string | CmsListItem>;
  relatedPackages?: string[];
  location?: Record<string, unknown>;
  featured?: boolean;
  seo?: CmsSeo;
  [key: string]: unknown;
}

export interface CmsSocialLink {
  platform: string;
  url: string;
  label?: string;
  visible?: boolean;
}

export interface CmsSettings {
  branding: {
    name: string;
    shortName?: string;
    operatorName?: string;
    tagline?: string;
    headerLogo?: string;
    footerLogo?: string;
    headerLogoAlt?: string;
    footerLogoAlt?: string;
    favicon?: string;
    socialImage?: string;
    [key: string]: unknown;
  };
  contact: {
    phone?: string;
    phoneMobile?: string;
    phoneLandline?: string;
    whatsapp?: string;
    email?: string;
    alternateEmail?: string;
    address?: string;
    bookingDeskName?: string;
    hours?: string;
    mapUrl?: string;
    [key: string]: unknown;
  };
  social: CmsSocialLink[];
  navigation: {
    headerLinks?: Array<CmsCta & { group?: string; visible?: boolean; children?: CmsCta[] }>;
    groups?: Array<{ id: string; label: string; note?: string; links: Array<CmsCta & { description?: string; image?: string; visible?: boolean }>; visible?: boolean }>;
    footerColumns?: Array<{ title: string; links: Array<CmsCta & { visible?: boolean }>; visible?: boolean }>;
    drawerUtilityLinks?: CmsCta[];
    headerCta?: CmsCta;
    [key: string]: unknown;
  };
  footer: {
    description?: string;
    copyright?: string;
    credit?: string;
    creditHref?: string;
    showSocial?: boolean;
    visible?: boolean;
    [key: string]: unknown;
  };
  announcement: {
    visible?: boolean;
    text?: string;
    href?: string;
    ctaLabel?: string;
    [key: string]: unknown;
  };
  trustBadges?: Array<{ title: string; description?: string; visible?: boolean }>;
  seo?: CmsSeo & { siteUrl?: string; siteName?: string; locale?: string };
  siteUrl?: string;
  [key: string]: unknown;
}

export interface CmsTheme {
  preset?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    cardBackground?: string;
    cardBorder?: string;
    buttonBackground?: string;
    buttonText?: string;
    buttonHover?: string;
    headerBackground?: string;
    footerBackground?: string;
    [key: string]: unknown;
  };
  typography: {
    headingFont?: string;
    bodyFont?: string;
    headingSize?: string;
    bodySize?: string;
    fontWeight?: string;
    [key: string]: unknown;
  };
  buttons?: { style?: "square" | "rounded" | "pill"; borderWidth?: string; [key: string]: unknown };
  borderRadius?: { card?: string; button?: string; image?: string; [key: string]: unknown };
  cardStyle?: "flat" | "bordered" | "elevated";
  containerWidth?: string;
  headerAppearance?: { sticky?: boolean; transparent?: boolean; [key: string]: unknown };
  footerAppearance?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CmsMediaAsset {
  id: string;
  bucketId: string;
  storagePath: string;
  publicUrl: string;
  name: string;
  folder: string;
  kind: "image" | "video" | "file";
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string;
  variants: Array<{ url: string; width: number; height?: number; format?: string }>;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CmsRevision {
  id: string;
  documentId: string;
  title: string;
  slug: string;
  status: CmsStatus;
  draftData: Record<string, unknown>;
  publishedData: Record<string, unknown> | null;
  publishedSlug: string | null;
  action: string;
  changedBy: string | null;
  createdAt: string;
}

export interface CmsAuditEntry {
  id: number;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}
