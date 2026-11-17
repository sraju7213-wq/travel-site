import { redirect } from "next/navigation";
import type { Metadata } from "next";

/**
 * Legacy collection route.
 *
 * The catalogue now lives at `/journeys`, which understands the `category`
 * query parameter. Keeping a second, near-identical catalogue page would mean
 * two copies of the same content to maintain and two URLs for the same
 * journeys, so this route redirects to the canonical one.
 */
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = decodeURIComponent((await params).category ?? "");
  return {
    title: `${category} Journeys`,
    description: `Browse ${category} journeys across India and Nepal from the printed brochure catalogue.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const category = decodeURIComponent((await params).category ?? "");
  redirect(`/journeys?category=${encodeURIComponent(category)}#catalogue`);
}
