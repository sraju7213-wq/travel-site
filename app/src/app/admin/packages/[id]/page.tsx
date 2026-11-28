export const instant = false;
import { notFound } from "next/navigation";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import PackageEditor from "@/components/cms/PackageEditor";
import type { PackageViewModel } from "@/types/travel";
import type { CmsStatus } from "@/types/cms";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, role } = await requireCmsAdminPage();
  const [{ data, error }, { data: packages }] = await Promise.all([
    supabase.from("cms_documents").select("*").eq("id", id).eq("type", "package").maybeSingle(),
    supabase.from("cms_documents").select("slug,title").eq("type", "package").neq("status", "archived"),
  ]);
  if (error) throw new Error(error.message); if (!data) notFound();
  return <PackageEditor document={{ id: data.id, slug: data.slug, title: data.title, status: data.status as CmsStatus, draft_data: data.draft_data as PackageViewModel, updated_at: data.updated_at, updated_by: data.updated_by, published_slug: data.published_slug }} availablePackages={(packages ?? []).map((pkg) => ({ slug: pkg.slug, title: pkg.title }))} developer={role === "developer"} />;
}
