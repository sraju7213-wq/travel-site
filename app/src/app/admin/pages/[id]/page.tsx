export const instant = false;
import { notFound } from "next/navigation";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsPageEditor from "@/components/cms/CmsPageEditor";
import type { CmsPageData, CmsStatus } from "@/types/cms";

export default async function EditCmsPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase, role } = await requireCmsAdminPage(); const [{ data }, { data: packages }, { data: destinations }] = await Promise.all([supabase.from("cms_documents").select("*").eq("id", id).eq("type", "page").maybeSingle(), supabase.from("cms_documents").select("slug,title").eq("type", "package").eq("status", "published"), supabase.from("cms_documents").select("slug,title").eq("type", "destination").eq("status", "published")]); if (!data) notFound(); return <CmsPageEditor document={{ id: data.id, slug: data.slug, title: data.title, status: data.status as CmsStatus, draft_data: data.draft_data as CmsPageData, updated_at: data.updated_at, updated_by: data.updated_by, published_slug: data.published_slug }} availablePackages={(packages ?? []).map((pkg) => ({ slug: pkg.slug, title: pkg.title }))} availableDestinations={(destinations ?? []).map((destination) => ({ slug: destination.slug, title: destination.title }))} developer={role === "developer"} />; }
