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
 * Per-package Pexels image mapping. Every package gets destination-specific
 * photography sourced from Pexels. Primary images are used on package cards;
 * gallery images appear on package detail pages.
 *
 * Photo IDs were selected by searching Pexels for each destination and
 * attraction named in the package itinerary, then verifying the image loads.
 */
const PACKAGE_PEXELS_IMAGES: Record<string, { primary: string; gallery: GalleryImage[] }> = {
  // ── Stopovers ──────────────────────────────────────────────────────────
  "delhi-stopover": {
    primary: pexels("14094276"),
    gallery: [
      { src: pexels("30378592"), caption: "India Gate war memorial arch in New Delhi" },
      { src: pexels("19528132"), caption: "Old Delhi street life and historic lanes" },
    ],
  },
  "bombay-stopover": {
    primary: pexels("36874536"),
    gallery: [
      { src: pexels("28355680"), caption: "Coastal Arabian Sea shoreline near Mumbai" },
    ],
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
    gallery: [
      { src: pexels("38087450"), caption: "Nubra Valley, Ladakh high desert" },
      { src: pexels("38087449"), caption: "Leh and Ladakh mountain landscape" },
    ],
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
    primary: pexels("30778230"),
    gallery: [
      { src: pexels("17545322"), caption: "Alleppey backwaters houseboat, Kerala" },
      { src: pexels("36982207"), caption: "Munnar tea gardens, Kerala hill country" },
    ],
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
    primary: pexels("36982207"),
    gallery: [
      { src: pexels("17545322"), caption: "Alleppey backwaters houseboat, Kerala" },
      { src: pexels("13971395"), caption: "Kerala tropical coastline" },
    ],
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
    primary: pexels("13927123"),
    gallery: [
      { src: pexels("40348598"), caption: "Dal Lake shikara, Srinagar, Kashmir" },
      { src: pexels("38087449"), caption: "Leh and Ladakh mountain landscape" },
    ],
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
    primary: pexels("13927123"),
    gallery: [
      { src: pexels("18453079"), caption: "Lidder Valley and Pahalgam meadows" },
      { src: pexels("14487300"), caption: "Sonamarg glacier approach, Kashmir" },
    ],
  },
  "kashmir-ski": {
    primary: pexels("35672518"),
    gallery: [
      { src: pexels("10701431"), caption: "Gulmarg ski slopes and snow-covered hills" },
    ],
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
    primary: pexels("37654954"),
    gallery: [
      { src: pexels("36927764"), caption: "Nepalese temple, Chitwan region" },
      { src: pexels("13409974"), caption: "Greater one-horned rhino in the sal forest" },
    ],
  },
  "nepal-mini-trek-7-day": {
    primary: pexels("32132398"),
    gallery: [
      { src: pexels("20988035"), caption: "Kathmandu Valley trekking route" },
      { src: pexels("28277464"), caption: "Pokhara lakeside and mountain views" },
    ],
  },
};

/**
 * Returns the gallery images for a package. Uses per-package Pexels
 * destination photography; falls back to the local brochure image only
 * when no Pexels mapping exists for the package ID.
 */
export function getPackageGallery(pkg: TravelPackage): GalleryImage[] {
  const mapping = PACKAGE_PEXELS_IMAGES[pkg.id];

  const primarySrc = mapping?.primary ?? `/images/packages/${slugify(pkg.id)}.jpg`;
  const galleryImages = mapping?.gallery ?? [];

  const images: GalleryImage[] = [
    {
      src: primarySrc,
      caption: `${pkg.title} — Primary route view`,
    },
    ...galleryImages,
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
 * Returns the primary Pexels image URL for a package card thumbnail.
 * Falls back to the local brochure image when no mapping exists.
 */
export function getPackageCardImage(slug: string): string {
  return PACKAGE_PEXELS_IMAGES[slug]?.primary ?? `/images/packages/${slug}.jpg`;
}
