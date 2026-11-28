import Link from "next/link";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { getPublishedDestinations } from "@/lib/cmsDocuments";

export const metadata: Metadata = { title: "Destinations", description: "Explore published destinations across India and Nepal." };

export default async function DestinationsPage() { const { isEnabled: preview } = await draftMode(); const destinations = await getPublishedDestinations(preview); const topLevel = destinations.filter((destination) => !destination.parentSlug); return <PageShell><Container className="py-16"><h1 className="font-serif text-4xl">Destinations</h1><p className="mt-3 text-white/60">Hierarchical regions and destinations managed in the CMS.</p><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{topLevel.map((destination) => { const slug = destination.slug ?? ""; const children = destinations.filter((item) => item.parentSlug === slug); const image = destination.heroImage || destination.image; return <article key={slug} className="overflow-hidden rounded-xl border border-white/10">{image && <img src={image} alt={destination.imageAlt ?? destination.name} className="aspect-[3/2] w-full object-cover" />}<div className="p-5"><h2 className="font-serif text-2xl">{destination.name}</h2><p className="mt-2 text-sm text-white/60">{destination.shortDescription || destination.tagline || destination.description}</p><Link href={`/destinations/${slug}`} className="mt-4 inline-block text-sm text-[#e5b99b]">Explore destination</Link>{children.length > 0 && <p className="mt-3 text-xs text-white/50">{children.length} child destination{children.length === 1 ? "" : "s"}</p>}</div></article>; })}</div></Container></PageShell>; }
