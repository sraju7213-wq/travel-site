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
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.${ext}?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2`;
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
const GLORIOUS_GOA_STOPOVER_GALLERY = localPackageGallery("glorious-goa-stopover", "Glorious Goa Stopover", 10);
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
      { src: pexels("6576275"), caption: "Hillside monastery in the Leh landscape" },
      { src: pexels("38071987"), caption: "Buddhist temple near Leh" },
      { src: pexels("40476209"), caption: "Sand dunes in the Nubra valley" },
      { src: pexels("23476457"), caption: "Desert dunes near Nubra" },
      { src: pexels("31346681"), caption: "Monastery above the Ladakh valley" },
    ],
  },
  "kathmandu-stopover": {
    primary: pexels("20988035"),
    gallery: [
      { src: pexels("36927764"), caption: "Nepalese temple with prayer flags" },
      { src: pexels("35618769"), caption: "Swayambhunath stupa and prayer flags, Kathmandu" },
      { src: pexels("14367175"), caption: "Temple square in Kathmandu" },
      { src: pexels("36373100"), caption: "Kathmandu temple street" },
      { src: pexels("28867843"), caption: "Hillside monastery near Kathmandu" },
      { src: pexels("30954090"), caption: "Kathmandu cityscape reflected in water" },
    ],
  },
  "kathmandu-pokhara": {
    primary: pexels("28277464"),
    gallery: [
      { src: pexels("39045766"), caption: "Boudhanath Stupa with prayer flags, Kathmandu" },
      { src: pexels("32132398"), caption: "Himalayan peaks above Pokhara" },
      { src: pexels("29230409"), caption: "Lake and mountain peaks near Pokhara" },
      { src: pexels("36236710"), caption: "Boats on a Pokhara lake" },
      { src: pexels("30495788"), caption: "Lakeside town below the Himalaya" },
      { src: pexels("14989387"), caption: "Mountain reflections on a still lake" },
    ],
  },
  "discover-ladakh": {
    primary: pexels("27593915"),
    galleryOverride: [...DISCOVER_LADAKH_GALLERY,
      { src: pexels("14477905"), caption: "Pangong Lake and the shoreline" },
      { src: pexels("18014641"), caption: "Turquoise water at Pangong Lake" },
    ],
  },

  // ── Images of India ────────────────────────────────────────────────────
  "golden-triangle": {
    primary: pexels("11521892"),
    gallery: [
      { src: pexels("39605929"), caption: "Amber Fort, Jaipur, Rajasthan" },
      { src: pexels("14094276"), caption: "Red Fort, Delhi" },
      { src: pexels("30378592"), caption: "India Gate, New Delhi" },
      { src: pexels("9529227"), caption: "Fatehpur Sikri sandstone palace" },
      { src: pexels("17911339"), caption: "Hawa Mahal in Jaipur" },
      { src: pexels("16139382"), caption: "India Gate in New Delhi" },
    ],
  },
  "glorious-goa-stopover": {
    primary: GLORIOUS_GOA_STOPOVER_GALLERY[0].src,
    galleryOverride: GLORIOUS_GOA_STOPOVER_GALLERY,
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
      { src: pexels("12750077"), caption: "Shikara boats on Dal Lake" },
      { src: pexels("16930780"), caption: "Mughal garden in Srinagar" },
      { src: pexels("35672511"), caption: "Snow-fed stream near Gulmarg" },
    ],
  },
  "kashmir-package-4-day": {
    primary: pexels("29251278"),
    gallery: [
      { src: pexels("25786562"), caption: "Dal Lake, Srinagar" },
      { src: pexels("18453079"), caption: "Kashmir valley and the Srinagar surrounds" },
      { src: pexels("13827306"), caption: "Houseboat on Dal Lake, Srinagar" },
      { src: pexels("19267288"), caption: "Garden pavilion in Srinagar" },
      { src: pexels("15961864"), caption: "Boats on the lake at dusk" },
      { src: pexels("11685351"), caption: "Mughal garden courtyard in Srinagar" },
    ],
  },
  "delhi-to-kathmandu": {
    primary: pexels("15832951"),
    gallery: [
      { src: pexels("34741303"), caption: "Varanasi ghats at golden hour" },
      { src: pexels("38532251"), caption: "Boudhanath Stupa, Kathmandu" },
      { src: pexels("38263405"), caption: "Agra Fort sandstone architecture" },
      { src: pexels("38857186"), caption: "Boat ride on the Ganges at Varanasi" },
      { src: pexels("34741292"), caption: "Boats along the Varanasi ghats" },
      { src: pexels("789750"), caption: "India Gate, New Delhi" },
    ],
  },
  "heritage-tour-india": {
    primary: pexels("35130760"),
    gallery: [
      { src: pexels("15774210"), caption: "Mehrangarh Fort, Jodhpur, Rajasthan" },
      { src: pexels("28749617"), caption: "Taj Mahal, Agra" },
      { src: pexels("21382502"), caption: "City Palace and Lake Pichola, Udaipur" },
      { src: pexels("797824"), caption: "Jaisalmer fort rising above the desert" },
      { src: pexels("28428787"), caption: "Sandstone fort in Rajasthan" },
      { src: pexels("41109602"), caption: "Stone passage through an old fort" },
    ],
  },

  // ── India Tours ────────────────────────────────────────────────────────
  "north-india-highlights": {
    primary: pexels("12446195"),
    gallery: [
      { src: pexels("15534251"), caption: "Udaipur lakeside city, Rajasthan" },
      { src: pexels("34971547"), caption: "Dal Lake shores, Srinagar, Kashmir" },
      { src: pexels("29232390"), caption: "Lamayuru Monastery near Leh, Ladakh" },
      { src: pexels("19149591"), caption: "Hawa Mahal, Jaipur" },
      { src: pexels("11024977"), caption: "Snow-covered slopes at Gulmarg" },
      { src: pexels("12141330"), caption: "Turquoise mountain river in Pahalgam" },
    ],
  },
  "india-nepal-combination": {
    primary: pexels("16753416"),
    gallery: [
      { src: pexels("36754808"), caption: "Ganga Aarti ceremony on the Varanasi ghats" },
      { src: pexels("37786606"), caption: "Boudhanath Stupa, Kathmandu" },
      { src: pexels("39567970"), caption: "City Palace overlooking Lake Pichola, Udaipur" },
      { src: pexels("19867576"), caption: "Red Fort, Delhi" },
      { src: pexels("25109764"), caption: "Hawa Mahal in Jaipur" },
      { src: pexels("36526508"), caption: "Temple courtyard in Kathmandu" },
    ],
  },
  "south-india-highlight": {
    primary: SOUTH_INDIA_HIGHLIGHT_GALLERY[0].src,
    galleryOverride: SOUTH_INDIA_HIGHLIGHT_GALLERY,
  },

  // ── Himalayan Expeditions ──────────────────────────────────────────────
  "markha-valley": {
    primary: pexels("30743691"),
    gallery: [
      { src: pexels("5014921"), caption: "Namgyal Tsemo Monastery above Leh" },
      { src: pexels("18563694"), caption: "Himalayan mountain range on the Markha route" },
      { src: pexels("17033858"), caption: "Glacier on the high Ladakh trail" },
      { src: pexels("20468084"), caption: "Prayer flags beside the mountain path" },
      { src: pexels("28486584"), caption: "Village in the Ladakh highlands" },
      { src: pexels("18646449"), caption: "Rocky mountain route through the valley" },
    ],
  },
  "kashmir-zanskar-ladakh-trek": {
    primary: pexels("18646446"),
    gallery: [
      { src: pexels("18002548"), caption: "Suru Valley landscape, Ladakh" },
      { src: pexels("17812152"), caption: "Lamayuru Monastery, Ladakh" },
      { src: pexels("17851168"), caption: "Alpine lake in the Zanskar range" },
      { src: pexels("23476484"), caption: "Mountain road on the Zanskar route" },
      { src: pexels("29494222"), caption: "River valley below the trekking route" },
      { src: pexels("34293906"), caption: "Confluence of mountain rivers in Ladakh" },
    ],
  },
  "kashmir-combinations-little-tibet": {
    primary: KASHMIR_COMBINATIONS_LITTLE_TIBET_GALLERY[0].src,
    galleryOverride: KASHMIR_COMBINATIONS_LITTLE_TIBET_GALLERY,
  },

  // ── Mini Trek in Kashmir ───────────────────────────────────────────────
  "kashmir-mini-adventure": {
    primary: pexels("14487300"),
    gallery: [
      { src: pexels("20718134"), caption: "Hiker beside an alpine lake in the Kashmir Himalaya" },
      { src: pexels("27497828"), caption: "Gulmarg meadow and mountain wildflowers" },
      { src: pexels("30314244"), caption: "Mountain lake reflecting the peaks" },
      { src: pexels("31539358"), caption: "Alpine lake bordered by flowers" },
      { src: pexels("18479132"), caption: "Village and fields in the Kashmir valley" },
      { src: pexels("30209447"), caption: "Stream through a Himalayan meadow" },
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
    primary: pexels("20046905"),
    gallery: [
      { src: pexels("2609459"), caption: "Himalayan mountain trail in Nepal" },
      { src: pexels("13409974"), caption: "Greater one-horned rhino, Chitwan" },
      { src: pexels("32651302"), caption: "White-water rafting on a Himalayan river" },
      { src: pexels("37263498"), caption: "Backpackers on an Annapurna trail" },
      { src: pexels("39008292"), caption: "Trekkers resting below Himalayan peaks" },
      { src: pexels("38351536"), caption: "Wildlife in the Nepalese grasslands" },
    ],
  },
  "trisuli-rafting": {
    primary: pexels("39606971"),
    gallery: [
      { src: pexels("36564701"), caption: "Boudhanath Stupa, Kathmandu gateway to Trisuli" },
      { src: pexels("19751469"), caption: "Raft on a mountain river" },
      { src: pexels("12328763"), caption: "Rafting through white water" },
      { src: pexels("2828471"), caption: "Raft navigating a rapid" },
      { src: pexels("16304344"), caption: "Rafters paddling through rapids" },
      { src: pexels("34627106"), caption: "Close view of rapids on the river" },
    ],
  },
  "nepal-mini-trek-4-day": {
    primary: pexels("26926327"),
    gallery: [
      { src: pexels("5011391"), caption: "Himalayan peaks above the Nepal trekking trails" },
      { src: pexels("40285696"), caption: "Himalayan peak above the trail" },
      { src: pexels("41042401"), caption: "Sunrise over the mountain range" },
      { src: pexels("34729832"), caption: "Mountain ridge on the Nepal trek" },
      { src: pexels("14136902"), caption: "Hillside village on the trek route" },
      { src: pexels("41154920"), caption: "Forest path in the Nepal foothills" },
    ],
  },
  "nepal-wildlife-safari": {
    primary: "/images/packages/nepal-wildlife-safari/nepal-wildlife-safari-01.jpg",
    galleryOverride: [...NEPAL_WILDLIFE_SAFARI_GALLERY,
      { src: pexels("19984413"), caption: "Elephant in a forest clearing" },
      { src: pexels("20046912"), caption: "Elephant on a forest track" },
    ],
  },
  "nepal-mini-trek-7-day": {
    primary: NEPAL_MINI_TREK_7_DAY_GALLERY[0].src,
    galleryOverride: [...NEPAL_MINI_TREK_7_DAY_GALLERY,
      { src: pexels("34744875"), caption: "Sunrise on a Himalayan peak" },
      { src: pexels("417173"), caption: "Snow-covered mountain above the clouds" },
    ],
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
