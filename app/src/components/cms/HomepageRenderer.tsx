import CmsSectionRenderer from "@/components/cms/CmsSectionRenderer";
import HomeHero from "@/components/HomeHero";
import DiscoverSection from "@/components/DiscoverSection";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import PillarsTabs from "@/components/PillarsTabs";
import ImpactSection from "@/components/ImpactSection";
import type { CmsDestination, CmsListItem, CmsSection } from "@/types/cms";
import type { PackageViewModel } from "@/types/travel";
import type { Destination, Experience, Pillar } from "@/data/siteContent";

function toDestination(destination: CmsDestination): Destination { return { name: destination.name, tagline: destination.tagline ?? destination.shortDescription ?? "", image: destination.heroImage || destination.image || "", blurb: destination.shortDescription || destination.tagline || destination.description || "", href: typeof destination.href === "string" ? destination.href : `/destinations/${destination.slug ?? ""}`, imagePosition: destination.imagePosition }; }
function itemText(item: CmsListItem): string { return item.text ?? item.title ?? item.label ?? item.value ?? ""; }

export default async function HomepageRenderer({ sections, packages, destinations }: { sections: CmsSection[]; packages: PackageViewModel[]; destinations: CmsDestination[] }) {
  const publicDestinations = destinations.map(toDestination);
  return <>{sections.filter((section) => section.visible !== false).map((section) => {
    if (section.type === "hero") return <HomeHero key={section.id} section={section} />;
    if (section.type === "statistics" && section.variant === "discover") return <DiscoverSection key={section.id} stats={(section.stats ?? []).map((stat) => ({ value: stat.value, label: stat.label, note: stat.note ?? "" }))} />;
    if (section.type === "destination-grid" && section.variant === "destinations") return <DestinationCarousel key={section.id} destinations={publicDestinations} />;
    if (section.type === "image-text" && section.variant === "experiences") { const experiences: Experience[] = (section.items ?? []).map((item) => ({ title: item.title ?? itemText(item), image: typeof item.image === "string" ? item.image : "", description: typeof item.description === "string" ? item.description : item.text ?? "", locations: typeof item.locations === "string" ? item.locations : "", href: typeof item.href === "string" ? item.href : "/journeys" })); return <ExperienceCarousel key={section.id} experiences={experiences} />; }
    if (section.type === "image-text" && section.variant === "pillars") { const pillars = (section.items ?? []).map((item, index) => ({ key: typeof item.id === "string" ? item.id : `pillar-${index}`, label: item.label ?? item.title ?? "", title: item.title ?? "", image: typeof item.image === "string" ? item.image : "", body: item.text ?? "", href: typeof item.href === "string" ? item.href : "/journeys", linkLabel: typeof item.linkLabel === "string" ? item.linkLabel : "", tagline: typeof item.tagline === "string" ? item.tagline : undefined, statBadge: typeof item.statBadge === "string" ? item.statBadge : undefined, statLabel: typeof item.statLabel === "string" ? item.statLabel : undefined, regionTag: typeof item.regionTag === "string" ? item.regionTag : undefined, highlights: Array.isArray(item.highlights) ? item.highlights as Pillar["highlights"] : undefined })); return <PillarsTabs key={section.id} id={section.id} pillars={pillars} eyebrow={section.eyebrow} heading={section.heading} intro={section.subheading ?? section.description} />; }
    if (section.type === "image-text" && section.variant === "impact") return <ImpactSection key={section.id} section={section} />;
    return <CmsSectionRenderer key={section.id} section={section} packages={packages} destinations={destinations} />;
  })}</>;
}
