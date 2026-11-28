import type { CmsItineraryDay, CmsListItem, CmsMedia, CmsPackageFaq, CmsPackagePricing, CmsSeo, CmsStatus } from "@/types/cms";

export interface TravelPackage {
  id: string;
  title: string;
  category: string;
  brochure_code: string;
  duration: string;
  difficulty: string | null;
  region: string[];
  summary: string;
  highlights: string[];
  source_page: number;
  content_flags: string[];
  /** Structured day-by-day itinerary, transcribed per package when available. */
  itinerary?: CmsItineraryDay[];
  /** Package-specific inclusions (never a blindly-applied generic panel). */
  inclusions?: Array<string | CmsListItem>;
  /** Package-specific exclusions (never a blindly-applied generic panel). */
  exclusions?: Array<string | CmsListItem>;
}

/** CMS-controlled fields added to every package without changing brochure source data. */
export interface PackageCmsFields {
  name?: string;
  shortDescription?: string;
  fullDescription?: string;
  destination?: string;
  destinationSlug?: string;
  regionName?: string;
  durationDays?: number | null;
  durationNights?: number | null;
  tourType?: string;
  bestSeason?: string;
  featured?: boolean;
  status?: CmsStatus;
  pricing?: CmsPackagePricing;
  media?: CmsMedia[];
  heroImage?: CmsMedia | string | null;
  thumbnail?: CmsMedia | string | null;
  coverImage?: CmsMedia | string | null;
  gallery?: CmsMedia[];
  additionalImages?: CmsMedia[];
  itineraryVisible?: boolean;
  inclusionsVisible?: boolean;
  exclusionsVisible?: boolean;
  startingPoint?: string;
  endingPoint?: string;
  transportation?: string;
  accommodationDetails?: string;
  importantInformation?: string;
  cancellationPolicy?: string;
  faqs?: CmsPackageFaq[];
  relatedPackages?: string[];
  seo?: CmsSeo;
  [key: string]: unknown;
}

export interface AdditionalService {
  id: string;
  title: string;
  type: string;
  source_page: number;
  summary: string;
  features: string[];
  content_flags: string[];
}

export interface TravelCatalogue {
  source_document: string;
  source_pages: number;
  package_count: number;
  note: string;
  packages: TravelPackage[];
  additional_services: AdditionalService[];
}

// Computed view-model fields derived from the raw record, never inventing data.
export interface PackageViewModel extends TravelPackage, PackageCmsFields {
  slug: string;
  difficultyLabel: string | null;
  difficultyVerified: boolean;
  hasReviewFlags: boolean;
  multiCountry: boolean;
  primaryRegion: string;
  secondaryRegions: string[];
}

export interface ServiceViewModel extends AdditionalService {
  slug: string;
}

export const CATEGORIES = [
  "Stopovers",
  "Images of India",
  "India Tours",
  "Himalayan Expeditions",
  "Mini Trek in Kashmir",
  "Nepal Adventure",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const ACTIVITIES = [
  "city stopover",
  "culture",
  "trekking",
  "skiing",
  "rafting",
  "wildlife",
  "houseboat/backwaters",
] as const;

export type Activity = (typeof ACTIVITIES)[number];
