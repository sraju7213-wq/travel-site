import { createRequire } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const typescript = require(resolve(appRoot, "node_modules/typescript"));
const NodeModule = require("node:module");
const originalResolveFilename = NodeModule._resolveFilename;
NodeModule._resolveFilename = function (request, ...args) {
  if (request.startsWith("@/")) request = resolve(appRoot, "src", request.slice(2));
  return originalResolveFilename.call(this, request, ...args);
};
require.extensions[".ts"] = (module, filename) => {
  const source = readFileSync(filename, "utf8");
  const output = typescript.transpileModule(source, { compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  module._compile(output, filename);
};

const { getAllPackages, getPackageGallery, getPackageCardImage, slugify, loadCatalogue } = require(resolve(appRoot, "src/data/catalogue.ts"));
const { DESTINATIONS, FOOTER_COLUMNS } = require(resolve(appRoot, "src/data/siteContent.ts"));
const { BRAND } = require(resolve(appRoot, "src/data/brandConfig.ts"));
const { HERO_VIDEOS } = require(resolve(appRoot, "src/data/heroVideos.ts"));
const { EXPERIENCES, PILLARS, STATS } = require(resolve(appRoot, "src/data/siteContent.ts"));
const { HEADER_LINKS, NAV_GROUPS, DRAWER_UTILITY_LINKS } = require(resolve(appRoot, "src/lib/navigation.ts"));
const { DEFAULT_CMS_SETTINGS, DEFAULT_CMS_THEME } = require(resolve(appRoot, "src/lib/cmsDefaults.ts"));

const rawCatalogue = loadCatalogue();
const rawById = new Map(rawCatalogue.packages.map((pkg) => [pkg.id, pkg]));
const packages = getAllPackages();
const destinations = DESTINATIONS.map((destination) => {
  const slug = slugify(destination.name);
  return {
    name: destination.name,
    slug,
    tagline: destination.tagline,
    shortDescription: destination.blurb,
    description: destination.blurb,
    region: destination.name,
    country: "",
    parentSlug: null,
    heroImage: destination.image,
    image: destination.image,
    imageAlt: destination.name,
    imagePosition: destination.imagePosition ?? "",
    focalPoint: { x: 0.5, y: 0.5 },
    gallery: [{ url: destination.image, alt: destination.name, caption: destination.tagline, order: 0, visible: true }],
    highlights: [],
    relatedPackages: [],
    location: {},
    featured: false,
    href: `/destinations/${slug}`,
    seo: { title: destination.name, metaDescription: destination.blurb, includeInSitemap: true },
  };
});

const packageRows = packages.map((pkg, index) => {
  const raw = rawById.get(pkg.id) ?? {};
  const gallery = getPackageGallery(pkg).map((image, imageIndex) => ({
    id: `${pkg.slug}-image-${imageIndex + 1}`,
    url: image.src,
    alt: pkg.title,
    caption: image.caption,
    order: imageIndex,
    visible: true,
    role: imageIndex === 0 ? "hero" : "gallery",
  }));
  const primary = gallery[0]?.url ?? getPackageCardImage(pkg.slug);
  const itinerary = (pkg.itinerary ?? []).map((day, dayIndex) => ({
    ...day,
    id: `${pkg.slug}-day-${dayIndex + 1}`,
    day: day.day ?? dayIndex + 1,
    title: day.title ?? `Day ${dayIndex + 1}`,
    location: day.location ?? "",
    description: day.description ?? "",
    activities: day.activities ?? day.stops ?? [],
    meals: day.meals ?? "",
    accommodation: day.accommodation ?? "",
    images: day.images ?? [],
    notes: day.notes ?? day.transfers ?? "",
    visible: day.visible !== false,
    stops: day.stops ?? [],
    transfers: day.transfers ?? "",
  }));
  const data = {
    ...raw,
    ...pkg,
    id: pkg.id,
    slug: pkg.slug,
    title: pkg.title,
    name: pkg.title,
    category: pkg.category,
    brochure_code: pkg.brochure_code,
    destination: pkg.primaryRegion,
    destinationSlug: "",
    region: pkg.region,
    regionName: pkg.primaryRegion,
    summary: pkg.summary,
    shortDescription: pkg.summary,
    fullDescription: "",
    duration: pkg.duration,
    durationDays: null,
    durationNights: null,
    difficulty: pkg.difficulty,
    tourType: pkg.category,
    bestSeason: "",
    featured: false,
    status: "published",
    source_page: pkg.source_page,
    content_flags: raw.content_flags ?? [],
    highlights: pkg.highlights ?? [],
    itinerary,
    itineraryVisible: true,
    inclusions: pkg.inclusions ?? raw.inclusions ?? [],
    exclusions: pkg.exclusions ?? raw.exclusions ?? [],
    inclusionsVisible: true,
    exclusionsVisible: true,
    pricing: { basePrice: null, currency: "", priceBasis: "per_person", childPrice: null, childAge: "", seasonalPricing: [], customPricingNotes: "", startingPriceDisplay: "", showPricing: false, showStartingPrice: false, taxesAndFeesNote: "" },
    pricePerPerson: null,
    currency: "",
    heroImage: primary,
    thumbnail: primary,
    coverImage: primary,
    media: gallery,
    gallery,
    additionalImages: [],
    startingPoint: "",
    endingPoint: "",
    transportation: "",
    accommodationDetails: "",
    importantInformation: "",
    cancellationPolicy: "",
    faqs: [],
    relatedPackages: [],
    seo: { title: pkg.title, metaDescription: pkg.summary, includeInSitemap: true },
  };
  return { type: "package", slug: pkg.slug, title: pkg.title, data, sortOrder: index };
});

const navigation = {
  headerLinks: HEADER_LINKS.map((link) => ({ ...link, visible: true })),
  groups: NAV_GROUPS.map((group) => ({ ...group, visible: true, links: group.links.map((link) => ({ ...link, visible: true })) })),
  footerColumns: FOOTER_COLUMNS.map((column) => ({ ...column, visible: true, links: column.links.map((link) => ({ ...link, visible: true })) })),
  drawerUtilityLinks: DRAWER_UTILITY_LINKS.map((link) => ({ ...link, visible: true })),
  headerCta: { label: "Enquire", href: "/enquiry", visible: true },
};
const settings = {
  ...DEFAULT_CMS_SETTINGS,
  branding: { ...DEFAULT_CMS_SETTINGS.branding, name: BRAND.name, operatorName: BRAND.operatorName, tagline: BRAND.tagline, headerLogo: "/logo.png", footerLogo: "/logo.png", headerLogoAlt: BRAND.name, footerLogoAlt: BRAND.name },
  contact: { ...DEFAULT_CMS_SETTINGS.contact },
  navigation,
  footer: { ...DEFAULT_CMS_SETTINGS.footer, description: `${BRAND.name} presents bespoke expeditions across India and Nepal, operated in association with ${BRAND.operatorName}.`, copyright: `© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.`, credit: "Designed and developed by Raju Sheikh", creditHref: "https://rsporfolio.vercel.app/", showSocial: true, visible: true },
  announcement: { visible: false, text: "", href: "", ctaLabel: "" },
  trustBadges: [],
  social: [],
  seo: { ...DEFAULT_CMS_SETTINGS.seo, siteName: BRAND.name },
};
const hero = {
  id: "hero", type: "hero", visible: true, eyebrow: "Welcome to", heading: "India Nepal Travel Center", subheading: "", description: "", image: "", backgroundImage: "", imageAlt: "", backgroundType: "video", backgroundPosition: "center", backgroundColor: "", overlay: 0, height: "", textAlign: "center", focalPoint: { x: 0.5, y: 0.5 }, images: [], videos: HERO_VIDEOS,
  ctaPrimary: { label: "Discover", href: "/journeys", visible: true, target: "_self" }, ctaSecondary: { label: "", href: "", visible: false, target: "_self" },
};
const homepage = { sections: [
  hero,
  { id: "statistics", type: "statistics", visible: true, variant: "discover", stats: STATS, heading: "", subheading: "", description: "" },
  { id: "destinations", type: "destination-grid", visible: true, variant: "destinations", destinations: destinations.map((destination) => destination.slug), destinationLimit: 0 },
  { id: "experiences", type: "image-text", visible: true, variant: "experiences", items: EXPERIENCES.map((item) => ({ ...item, text: item.description })) },
  { id: "why-us", type: "image-text", visible: true, variant: "pillars", eyebrow: "Why travel with us", heading: "A different way to discover India & Nepal", subheading: "Local knowledge, considered journeys, and the freedom to travel at your own pace.", items: PILLARS.map((item) => ({ ...item, text: item.body, href: item.href, linkLabel: item.linkLabel })) },
  { id: "impact", type: "image-text", visible: true, variant: "impact", eyebrow: "Curated regional programmes", heading: "Travel deeper. Learn along the way.", subheading: "Special-interest and student expeditions across India and Nepal.", description: "All special-interest programmes are escorted by qualified team leaders. Every itinerary is drawn directly from our brochure archives and shaped with meticulous care around your travel season, party size and regional interests.", image: "", images: [], ctaPrimary: { label: "Discover our approach", href: "/about", visible: true } },
  { id: "cta", type: "cta", visible: true, eyebrow: "Plan your journey", heading: "India & Nepal, your way.", description: "Tell us what you want to discover. We’ll help shape the journey.", image: "/images/orbit/kashmir-shikara-peaks.jpg", imageAlt: "A shikara on Dal Lake beneath the forested and snow-capped Kashmir mountains", ctaPrimary: { label: "Enquire now", href: "/enquiry", visible: true } },
], seo: {} };

function sqlString(value) { return `'${String(value).replace(/'/g, "''")}'`; }
function insertDocument(row) {
  const json = JSON.stringify(row.data);
  return `INSERT INTO public.cms_documents (type, slug, title, status, draft_data, published_data, published_slug, sort_order, published_at)\nVALUES (${sqlString(row.type)}, ${sqlString(row.slug)}, ${sqlString(row.title)}, 'published', ${sqlString(json)}::jsonb, ${sqlString(json)}::jsonb, ${sqlString(row.slug)}, ${row.sortOrder ?? 0}, now())\nON CONFLICT (type, slug) DO NOTHING;`;
}

const output = [
  "-- Generated from the preserved brochure/source catalogue. No new facts or prices.",
  "begin;",
  ...packageRows.map(insertDocument),
  ...destinations.map((data, index) => insertDocument({ type: "destination", slug: data.slug, title: data.name, data, sortOrder: index })),
  insertDocument({ type: "homepage", slug: "home", title: "Homepage", data: homepage }),
  insertDocument({ type: "settings", slug: "global", title: "Website settings", data: settings }),
  insertDocument({ type: "theme", slug: "global", title: "Theme & appearance", data: DEFAULT_CMS_THEME }),
  "commit;",
].join("\n\n");

const destinationArg = process.argv[2];
if (!destinationArg) throw new Error("Output migration path is required.");
writeFileSync(resolve(destinationArg), output + "\n");
console.log(`Wrote ${packageRows.length} packages, ${destinations.length} destinations, homepage, settings, and theme to ${destinationArg}`);
