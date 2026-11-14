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

export function getPackageGallery(pkg: TravelPackage): GalleryImage[] {
  const images: GalleryImage[] = [
    {
      src: `/images/packages/${slugify(pkg.id)}.jpg`,
      caption: `${pkg.title} — Primary route view`,
    },
  ];

  const regionStr = (pkg.region ?? []).map((r: string) => r.toLowerCase()).join(" ");
  const catStr = pkg.category.toLowerCase();

  if (regionStr.includes("kashmir") || catStr.includes("kashmir")) {
    images.push({
      src: "/images/experiences/kashmir-boat-shikara.jpg",
      caption: "Tranquil Dal Lake waters beneath snow-capped Himalayan peaks",
    });
    images.push({
      src: "/images/destinations/kashmir-dal-lake-fruit-boat.jpg",
      caption: "Floating vegetable markets and authentic shikara life in Srinagar",
    });
    images.push({
      src: "/images/services/kashmir-houseboat.jpg",
      caption: "Cedarwood carved houseboat stay on the waters of Dal Lake",
    });
  }

  if (regionStr.includes("ladakh") || regionStr.includes("leh") || catStr.includes("himalayan")) {
    images.push({
      src: "/images/destinations/ladakh-key-monastery.jpg",
      caption: "Ancient cliffside Tibetan Buddhist monastery in winter",
    });
    images.push({
      src: "/images/hero/hero-pangong.jpg",
      caption: "Pangong Tso high-altitude lake surrounded by mountains",
    });
    images.push({
      src: "/images/experiences/himalayan-trekking-nubra.jpg",
      caption: "High mountain pass trekking route across the Nubra Valley",
    });
  }

  if (regionStr.includes("nepal") || catStr.includes("nepal")) {
    images.push({
      src: "/images/destinations/nepal-boudhanath-dusk.jpg",
      caption: "Sacred Boudhanath Stupa adorned with prayer flags at dusk",
    });
    images.push({
      src: "/images/destinations/indian-rhino-forest.jpg",
      caption: "Greater one-horned rhino grazing in Chitwan subtropical forest",
    });
    images.push({
      src: "/images/experiences/river-rafting-gulsitara.jpg",
      caption: "Whitewater rafting crew cutting through Trisuli river rapids",
    });
  }

  if (regionStr.includes("rajasthan") || pkg.title.toLowerCase().includes("golden triangle") || catStr.includes("images of india")) {
    images.push({
      src: "/images/destinations/taj-mahal.jpg",
      caption: "The majestic white marble dome of the Taj Mahal in Agra",
    });
    images.push({
      src: "/images/destinations/rajasthan-desert-camels.jpg",
      caption: "Desert safari and sunset camel trail in royal Rajasthan",
    });
    images.push({
      src: "/images/packages/delhi-stopover.jpg",
      caption: "Grand perspective of Rajpath and India Gate in Delhi",
    });
  }

  if (regionStr.includes("kerala") || regionStr.includes("south india")) {
    images.push({
      src: "/images/experiences/alleppey-backwaters-houseboat.jpg",
      caption: "Traditional thatched kettuvallam cruising palm-fringed backwaters",
    });
    images.push({
      src: "/images/destinations/kerala-backwaters.jpg",
      caption: "Tropical waterways and village life of God's Own Country",
    });
  }

  if (regionStr.includes("goa")) {
    images.push({
      src: "/images/destinations/goa-coast-rocks.jpg",
      caption: "Golden sand beaches and coastal rocky coves of Goa",
    });
  }

  if (regionStr.includes("varanasi")) {
    images.push({
      src: "/images/destinations/varanasi-ganges-boating.jpg",
      caption: "Dawn rowboats passing sacred stone bathing ghats along the Ganges",
    });
  }

  // Filter unique sources
  const seen = new Set<string>();
  return images.filter((img) => {
    if (seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
