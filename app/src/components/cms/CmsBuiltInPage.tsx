import CmsSectionRenderer from "@/components/cms/CmsSectionRenderer";
import { getCmsPage, getPublishedDestinations, getPublishedPackages } from "@/lib/cmsDocuments";
import type { CmsDocument, CmsPageData } from "@/types/cms";

export async function getCmsBuiltIn(slug: string, preview = false): Promise<CmsDocument<CmsPageData> | null> { return getCmsPage(slug, preview); }
export function hasCmsSections(page: CmsDocument<CmsPageData> | null, preview = false): boolean { const data = preview ? page?.draftData : page?.publishedData ?? page?.draftData; return Boolean(data?.sections?.length); }
export async function renderCmsBuiltIn(page: CmsDocument<CmsPageData>, preview = false) { const [packages, destinations] = await Promise.all([getPublishedPackages(preview), getPublishedDestinations(preview)]); const data = preview ? page.draftData : page.publishedData ?? page.draftData; return data.sections.map((section) => <CmsSectionRenderer key={section.id} section={section} packages={packages} destinations={destinations} />); }
