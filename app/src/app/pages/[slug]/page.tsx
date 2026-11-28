export const instant = false;
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import CmsSectionRenderer from "@/components/cms/CmsSectionRenderer";
import { getCmsPage, getPublishedDestinations, getPublishedPackages } from "@/lib/cmsDocuments";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const { isEnabled: preview } = await draftMode(); const page = await getCmsPage(slug, preview); if (!page) return { title: "Page not found" }; const data = preview ? page.draftData : page.publishedData ?? page.draftData; const seo = data.seo ?? {}; return { title: seo.title || page.title, description: seo.metaDescription, alternates: { canonical: seo.canonicalUrl || `/pages/${slug}` }, openGraph: { title: seo.openGraphTitle || page.title, description: seo.openGraphDescription, images: seo.socialImage ? [{ url: seo.socialImage, alt: seo.socialImageAlt }] : undefined }, robots: { index: seo.noIndex !== true, follow: seo.noFollow !== true } }; }

export default async function CmsPublicPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const { isEnabled: preview } = await draftMode(); const [page, packages, destinations] = await Promise.all([getCmsPage(slug, preview), getPublishedPackages(preview), getPublishedDestinations(preview)]); if (!page) notFound(); const data = preview ? page.draftData : page.publishedData ?? page.draftData; return <PageShell mainClassName="">{data.sections.map((section) => <CmsSectionRenderer key={section.id} section={section} packages={packages} destinations={destinations} />)}{!data.sections.length && <Container className="py-16"><h1 className="font-serif text-4xl">{page.title}</h1><p className="mt-4 text-white/60">No visible sections have been added.</p></Container>}</PageShell>; }
