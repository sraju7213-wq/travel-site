import type { TravelCatalogue, TravelPackage, PackageViewModel, ServiceViewModel } from "@/types/travel";
import catalogueJson from "./travel_packages_catalog.json";

export const CATALOGUE_SOURCE = "/data/travel_packages_catalog.json";

const CATALOGUE: TravelCatalogue = catalogueJson as TravelCatalogue;

export function loadCatalogue(): TravelCatalogue {
  return CATALOGUE;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function toPackageViewModel(pkg: TravelCatalogue["packages"][number]): PackageViewModel {
  const regions = pkg.region;
  const primaryRegion = regions[0] ?? "";
  const secondaryRegions = regions.slice(1);

  return {
    ...pkg,
    slug: slugify(pkg.id),
    difficultyLabel: pkg.difficulty ?? null,
    difficultyVerified: !!pkg.difficulty && !pkg.difficulty.includes("as printed") && !pkg.difficulty.includes("conflict"),
    hasReviewFlags: pkg.content_flags.length > 0,
    multiCountry: regions.some((r) => r === "Nepal") && regions.some((r) => r === "India"),
    primaryRegion,
    secondaryRegions,
  };
}

export function toServiceViewModel(svc: TravelCatalogue["additional_services"][number]): ServiceViewModel {
  return { ...svc, slug: slugify(svc.id) };
}

export function getAllPackages(): PackageViewModel[] {
  return loadCatalogue().packages.map(toPackageViewModel);
}

export function getPackageBySlug(slug: string): PackageViewModel | undefined {
  return getAllPackages().find((p) => p.slug === slug);
}

export function getPackageByCode(code: string): PackageViewModel | undefined {
  return getAllPackages().find((p) => p.brochure_code.toLowerCase() === code.toLowerCase());
}

export function getPackagesByCategory(category: string): PackageViewModel[] {
  return getAllPackages().filter((p) => p.category === category);
}

export function getAllServices(): ServiceViewModel[] {
  return loadCatalogue().additional_services.map(toServiceViewModel);
}

export function getServiceBySlug(slug: string): ServiceViewModel | undefined {
  return getAllServices().find((s) => s.slug === slug);
}

export function getCategories(): { key: string; label: string; count: number }[] {
  const packages = getAllPackages();
  const counts = new Map<string, number>();
  for (const p of packages) {
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return (
    [
      "Stopovers",
      "Images of India",
      "India Tours",
      "Himalayan Expeditions",
      "Mini Trek in Kashmir",
      "Nepal Adventure",
    ] as const
  ).map((key) => ({ key, label: key, count: counts.get(key) ?? 0 }));
}

export function getAllRegions(): string[] {
  const regions = new Set<string>();
  for (const p of getAllPackages()) {
    for (const r of p.region) {
      regions.add(r);
    }
  }
  return Array.from(regions).sort();
}

export function getAllDurations(): string[] {
  return Array.from(new Set(getAllPackages().map((p) => p.duration))).sort();
}

export function searchPackages(query: string): PackageViewModel[] {
  const q = query.toLowerCase();
  return getAllPackages().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.brochure_code.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.region.some((r) => r.toLowerCase().includes(q)) ||
      p.highlights.some((h) => h.toLowerCase().includes(q)),
  );
}

export interface GalleryImage {
  src: string;
  caption: string;
}

/**
 * Pexels photos that are published as PNG rather than JPEG on the CDN.
 * Verified by loading each candidate — a `.jpeg` request for these returns 404.
 */
const PEXELS_PNG_PHOTO_IDS = new Set(["15774210"]);

/**
 * Builds a Pexels CDN URL from a photo ID.
 * All images are sourced from Pexels (https://www.pexels.com/) under the Pexels License.
 * Source page URLs are documented in docs/image-sources.md.
 */
export function pexels(photoId: string): string {
  const ext = PEXELS_PNG_PHOTO_IDS.has(photoId) ? "png" : "jpeg";
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.${ext}?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2`;
}

/**
 * Per-package image mapping. Most packages use destination-specific Pexels
 * photography; client-supplied local galleries replace the primary image and
 * the complete detail-page gallery where noted. Primary images are used on
 * package cards and heroes, while gallery images appear on package detail pages.
 */
/**
 * Client-supplied photography for the Discover Ladakh detail-page gallery.
 * `galleryOverride` replaces the whole gallery so none of the older Pexels
 * photos remain; the package card and hero keep using `primary` as before.
 */
const DISCOVER_LADAKH_GALLERY: GalleryImage[] = [
  { src: "/images/packages/discover-ladakh/discover-ladakh-01.jpg", caption: "High mountain valley and sandy riverbed" },
  { src: "/images/packages/discover-ladakh/discover-ladakh-02.jpg", caption: "Mountain road through the high-altitude landscape" },
  { src: "/images/packages/discover-ladakh/discover-ladakh-03.jpg", caption: "Rider on a rocky hillside trail" },
  { src: "/images/packages/discover-ladakh/discover-ladakh-04.jpg", caption: "White stupas beside the mountain road" },
  { src: "/images/packages/discover-ladakh/discover-ladakh-05.jpg", caption: "White building complex on a rocky ridge" },
];

/** Client-supplied photography for the Nepal Wildlife Safari image and gallery. */
const NEPAL_WILDLIFE_SAFARI_GALLERY: GalleryImage[] = [
  { src: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-01.jpg", caption: "Trekkers passing prayer flags on a stone trail" },
  { src: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-02.jpg", caption: "Town and mountain ridges seen through prayer flags" },
  { src: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-03.jpg", caption: "Golden shrine below snow-covered mountains" },
  { src: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-04.jpg", caption: "Mountain peak above a hillside settlement" },
  { src: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-05.jpg", caption: "Nepal flag against snowy mountain slopes" },
];

/** Client-supplied photography for the 7 Day Nepal Mini Trek detail-page gallery. */
const NEPAL_MINI_TREK_7_DAY_GALLERY: GalleryImage[] = [
  { src: "/images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-01.jpg", caption: "Mountain peak above a hillside settlement" },
  { src: "/images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-02.jpg", caption: "Trekker with poles facing snowy peaks" },
  { src: "/images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-03.jpg", caption: "Hikers raising trekking poles above the ridgeline" },
  { src: "/images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-04.jpg", caption: "Prayer flags and a monastery below snowy peaks" },
  { src: "/images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-05.jpg", caption: "Sunlit summit above a sea of clouds" },
];

/** Builds an ordered gallery from a client-supplied package image folder. */
function localPackageGallery(slug: string, title: string, count: number): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/images/packages/${slug}/${slug}-${String(index + 1).padStart(2, "0")}.jpg`,
    caption: `${title} — Photo ${index + 1}`,
  }));
}

const BOMBAY_STOPOVER_GALLERY = localPackageGallery("bombay-stopover", "Bombay", 12);
const DELHI_STOPOVER_GALLERY = localPackageGallery("delhi-stopover", "Delhi", 12);
const GLIMPSES_OF_KERALA_GALLERY = localPackageGallery("glimpses-of-kerala", "Glimpses of Kerala", 7);
const KASHMIR_COMBINATIONS_LITTLE_TIBET_GALLERY = localPackageGallery(
  "kashmir-combinations-little-tibet",
  "Kashmir Combinations: Little Tibet",
  14,
);
const KASHMIR_SKI_GALLERY = localPackageGallery("kashmir-ski", "Kashmir Ski", 8);
const SOUTH_INDIA_HIGHLIGHT_GALLERY = localPackageGallery("south-india-highlight", "South India Highlight", 28);
const VALE_OF_KASHMIR_TREK_GALLERY = localPackageGallery("vale-of-kashmir-trek", "Vale of Kashmir Trek", 11);

const PACKAGE_IMAGES: Record<
  string,
  { primary: string; gallery?: GalleryImage[]; galleryOverride?: GalleryImage[] }
> = {
  // ── Stopovers ──────────────────────────────────────────────────────────
  "delhi-stopover": {
    primary: DELHI_STOPOVER_GALLERY[0].src,
    galleryOverride: DELHI_STOPOVER_GALLERY,
  },
  "bombay-stopover": {
    primary: BOMBAY_STOPOVER_GALLERY[0].src,
    galleryOverride: BOMBAY_STOPOVER_GALLERY,
  },
  "discover-leh": {
    primary: pexels("38087449"),
    gallery: [
      { src: pexels("38087450"), caption: "Nubra Valley dunes and village, Ladakh" },
    ],
  },
  "kathmandu-stopover": {
    primary: pexels("20988035"),
    gallery: [
      { src: pexels("36927764"), caption: "Nepalese temple with prayer flags" },
      { src: pexels("32132398"), caption: "Himalayan mountain range near Kathmandu" },
    ],
  },
  "kathmandu-pokhara": {
    primary: pexels("28277464"),
    gallery: [
      { src: pexels("20988035"), caption: "Kathmandu cityscape and temples" },
      { src: pexels("32132398"), caption: "Himalayan peaks above Pokhara" },
    ],
  },
  "discover-ladakh": {
    primary: pexels("27593915"),
    galleryOverride: DISCOVER_LADAKH_GALLERY,
  },

  // ── Images of India ────────────────────────────────────────────────────
  "golden-triangle": {
    primary: pexels("11521892"),
    gallery: [
      { src: pexels("39605929"), caption: "Amber Fort, Jaipur, Rajasthan" },
      { src: pexels("14094276"), caption: "Red Fort, Delhi" },
      { src: pexels("30378592"), caption: "India Gate, New Delhi" },
    ],
  },
  "glorious-goa-stopover": {
    primary: pexels("28355680"),
    gallery: [
      { src: pexels("35916755"), caption: "Goa beach and Arabian Sea coastline" },
    ],
  },
  "glimpses-of-kerala": {
    primary: GLIMPSES_OF_KERALA_GALLERY[0].src,
    galleryOverride: GLIMPSES_OF_KERALA_GALLERY,
  },
  "kashmir-package-7-day": {
    primary: pexels("40348598"),
    gallery: [
      { src: pexels("35672518"), caption: "Gulmarg snowy meadow, Kashmir" },
      { src: pexels("16252950"), caption: "Sonamarg valley, Kashmir" },
      { src: pexels("13927123"), caption: "Pahalgam and Lidder River, Kashmir" },
    ],
  },
  "kashmir-package-4-day": {
    primary: pexels("29251278"),
    gallery: [
      { src: pexels("18453079"), caption: "Kashmir valley and Srinagar surrounds" },
      { src: pexels("40348598"), caption: "Dal Lake and houseboats, Srinagar" },
    ],
  },
  "delhi-to-kathmandu": {
    primary: pexels("11521892"),
    gallery: [
      { src: pexels("40967314"), caption: "Varanasi Ganga ghats at dawn" },
      { src: pexels("20988035"), caption: "Kathmandu temples and stupas" },
    ],
  },
  "heritage-tour-india": {
    primary: pexels("35130760"),
    gallery: [
      { src: pexels("39605929"), caption: "Amber Fort, Jaipur, Rajasthan" },
      { src: pexels("11521892"), caption: "Taj Mahal, Agra" },
      { src: pexels("17397822"), caption: "Udaipur City Palace and Lake Pichola" },
    ],
  },

  // ── India Tours ────────────────────────────────────────────────────────
  "north-india-highlights": {
    primary: pexels("11521892"),
    gallery: [
      { src: pexels("15534251"), caption: "Udaipur lakeside city, Rajasthan" },
      { src: pexels("40348598"), caption: "Dal Lake houseboats, Srinagar, Kashmir" },
      { src: pexels("27593915"), caption: "Pangong Lake, Ladakh" },
    ],
  },
  "india-nepal-combination": {
    primary: pexels("11521892"),
    gallery: [
      { src: pexels("40967314"), caption: "Varanasi Ganga ghats" },
      { src: pexels("20988035"), caption: "Kathmandu heritage sites" },
      { src: pexels("17397822"), caption: "Udaipur City Palace, Rajasthan" },
    ],
  },
  "south-india-highlight": {
    primary: SOUTH_INDIA_HIGHLIGHT_GALLERY[0].src,
    galleryOverride: SOUTH_INDIA_HIGHLIGHT_GALLERY,
  },

  // ── Himalayan Expeditions ──────────────────────────────────────────────
  "markha-valley": {
    primary: pexels("38087449"),
    gallery: [
      { src: pexels("38087450"), caption: "Nubra Valley trekking route, Ladakh" },
      { src: pexels("27593915"), caption: "Pangong Lake, high-altitude Ladakh" },
    ],
  },
  "kashmir-zanskar-ladakh-trek": {
    primary: pexels("27593915"),
    gallery: [
      { src: pexels("40348598"), caption: "Dal Lake, Srinagar, Kashmir" },
      { src: pexels("38087449"), caption: "Ladakh mountain passes and monasteries" },
    ],
  },
  "kashmir-combinations-little-tibet": {
    primary: KASHMIR_COMBINATIONS_LITTLE_TIBET_GALLERY[0].src,
    galleryOverride: KASHMIR_COMBINATIONS_LITTLE_TIBET_GALLERY,
  },

  // ── Mini Trek in Kashmir ───────────────────────────────────────────────
  "kashmir-mini-adventure": {
    primary: pexels("16252950"),
    gallery: [
      { src: pexels("18453079"), caption: "Kashmir alpine valley and peaks" },
      { src: pexels("35672518"), caption: "Gulmarg meadow and mountains" },
    ],
  },
  "vale-of-kashmir-trek": {
    primary: VALE_OF_KASHMIR_TREK_GALLERY[0].src,
    galleryOverride: VALE_OF_KASHMIR_TREK_GALLERY,
  },
  "kashmir-ski": {
    primary: KASHMIR_SKI_GALLERY[0].src,
    galleryOverride: KASHMIR_SKI_GALLERY,
  },

  // ── Nepal Adventure ────────────────────────────────────────────────────
  "himalayan-combination-nepal": {
    primary: pexels("28277464"),
    gallery: [
      { src: pexels("32132398"), caption: "Himalayan range near Pokhara, Nepal" },
      { src: pexels("13409974"), caption: "Greater one-horned rhino, Chitwan" },
    ],
  },
  "trisuli-rafting": {
    primary: pexels("32132398"),
    gallery: [
      { src: pexels("20988035"), caption: "Kathmandu, gateway to Trisuli rafting" },
    ],
  },
  "nepal-mini-trek-4-day": {
    primary: pexels("26926327"),
    gallery: [
      { src: pexels("20988035"), caption: "Kathmandu Valley foothill trails" },
    ],
  },
  "nepal-wildlife-safari": {
    primary: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-01.jpg",
    galleryOverride: NEPAL_WILDLIFE_SAFARI_GALLERY,
  },
  "nepal-mini-trek-7-day": {
    primary: pexels("32132398"),
    galleryOverride: NEPAL_MINI_TREK_7_DAY_GALLERY,
  },
};

/**
 * Returns the gallery images for a package. A `galleryOverride` supplies the
 * complete gallery (used for user-supplied photography); otherwise the mapped
 * primary photo is prepended to the per-package gallery. Falls back to the
 * local package image only when no mapping exists for the package ID.
 */
export function getPackageGallery(pkg: TravelPackage): GalleryImage[] {
  const mapping = PACKAGE_IMAGES[pkg.id];

  const primarySrc = mapping?.primary ?? `/images/packages/${slugify(pkg.id)}.jpg`;
  const images: GalleryImage[] =
    mapping?.galleryOverride ??
    [
      {
        src: primarySrc,
        caption: `${pkg.title} — Primary route view`,
      },
      ...(mapping?.gallery ?? []),
    ];

  // Filter unique sources
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}

/**
 * Returns the primary image URL for a package card thumbnail.
 * Falls back to the local package image when no mapping exists.
 */
export function getPackageCardImage(slug: string): string {
  return PACKAGE_IMAGES[slug]?.primary ?? `/images/packages/${slug}.jpg`;
}
