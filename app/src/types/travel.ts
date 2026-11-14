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
  itinerary?: Array<{
    day?: number | string;
    title?: string;
    description?: string;
    stops?: string[];
    transfers?: string;
  }>;
  /** Package-specific inclusions (never a blindly-applied generic panel). */
  inclusions?: string[];
  /** Package-specific exclusions (never a blindly-applied generic panel). */
  exclusions?: string[];
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
export interface PackageViewModel extends TravelPackage {
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
