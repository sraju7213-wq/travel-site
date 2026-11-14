import { notFound } from "next/navigation";
import CtaZoom from "@/components/CtaZoom";
import PageShell from "@/components/PageShell";
import PillarsTabs from "@/components/PillarsTabs";
import HouseboatCollection from "@/components/houseboats/HouseboatCollection";
import HouseboatDiscover from "@/components/houseboats/HouseboatDiscover";
import HouseboatHero from "@/components/houseboats/HouseboatHero";
import HouseboatJourneys from "@/components/houseboats/HouseboatJourneys";
import HouseboatNotes from "@/components/houseboats/HouseboatNotes";
import HouseboatStay from "@/components/houseboats/HouseboatStay";
import { BRAND } from "@/data/brandConfig";
import { getAllPackages, getServiceBySlug } from "@/data/catalogue";
import { HOUSEBOAT_PILLARS } from "@/data/houseboats";

interface HouseboatsPageProps {
  params: Promise<Record<string, never>>;
}

export async function generateMetadata({ params }: HouseboatsPageProps) {
  await params;
  const svc = getServiceBySlug("kashmir-houseboat-booking");
  if (!svc) {
    return { title: `Service not found — ${BRAND.name}` };
  }
  return {
    title: `${svc.title} — ${BRAND.name}`,
    description:
      "Booking access to carved cedar houseboats on Dal and Nagin Lake in Srinagar — two to seven bedrooms, private ensuite facilities, veranda and sundeck, deluxe and A-class options.",
    openGraph: {
      title: "Houseboats on Dal Lake, Srinagar",
      description: svc.summary,
      type: "website",
    },
  };
}

export default async function HouseboatsPage({ params }: HouseboatsPageProps) {
  await params;
  const svc = getServiceBySlug("kashmir-houseboat-booking");
  if (!svc) {
    notFound();
  }

  // Kashmir routes that a houseboat stay can be stitched onto.
  const kashmirPackages = getAllPackages().filter((pkg) => pkg.region.includes("Kashmir"));
  const preferredOrder = ["kashmir-package-7-day", "kashmir-package-4-day", "kashmir-mini-adventure"];
  const kashmirHighlights = [
    ...preferredOrder
      .map((id) => kashmirPackages.find((pkg) => pkg.id === id))
      .filter((pkg): pkg is NonNullable<typeof pkg> => Boolean(pkg)),
    ...kashmirPackages.filter((pkg) => !preferredOrder.includes(pkg.id)),
  ].slice(0, 3);

  return (
    <PageShell mainClassName="">
      <HouseboatHero />

      <HouseboatDiscover />

      <HouseboatCollection />

      <HouseboatJourneys packages={kashmirHighlights} />

      <PillarsTabs
        pillars={HOUSEBOAT_PILLARS}
        id="houseboat-details"
        eyebrow="Inside the stay"
        heading={
          <>
            Cedar, water <span className="text-white/60">and the craft around it</span>
          </>
        }
        intro="Five angles on a houseboat stay, each taken from the printed record rather than from us."
        tabListLabel="Houseboat stay details"
      />

      <HouseboatStay flags={svc.content_flags} />

      <HouseboatNotes />

      <CtaZoom
        image="/images/services/houseboats.jpg"
        imageAlt="A shikara crossing Dal Lake in Srinagar towards the carved houseboats moored along the far shore"
        eyebrow="Plan your stay"
        title={
          <>
            Ready to take
            <br className="hidden sm:block" /> to the water?
          </>
        }
        body="Tell us your dates, your party and how you would like to spend the nights on the lake. We’ll confirm what is actually available."
        ctaLabel="Enquire now"
        ctaHref="/enquiry?service=houseboats"
      />
    </PageShell>
  );
}
