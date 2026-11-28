export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import HomepageBuilder from "@/components/cms/HomepageBuilder";
import type { CmsHomepageData, CmsStatus } from "@/types/cms";

export default async function HomepageAdmin() {
  const { supabase, role } = await requireCmsAdminPage(); const [{ data, error }, { data: packages }, { data: destinations }] = await Promise.all([supabase.from("cms_documents").select("*").eq("type", "homepage").eq("slug", "home").maybeSingle(), supabase.from("cms_documents").select("slug,title").eq("type", "package").neq("status", "archived"), supabase.from("cms_documents").select("slug,title").eq("type", "destination").neq("status", "archived")]); if (error) throw new Error(error.message);
  if (!data) return <div className="rounded-xl border border-amber-300/30 bg-amber-300/5 p-6"><h1 className="font-serif text-2xl">Homepage content has not been seeded</h1><p className="mt-2 text-sm">Apply the included CMS seed migration before editing. No separate client-side content store will be created.</p></div>;
  return <HomepageBuilder document={{ id: data.id, status: data.status as CmsStatus, draft_data: data.draft_data as CmsHomepageData, updated_at: data.updated_at, updated_by: data.updated_by }} availablePackages={(packages ?? []).map((pkg) => ({ slug: pkg.slug, title: pkg.title }))} availableDestinations={(destinations ?? []).map((destination) => ({ slug: destination.slug, title: destination.title }))} developer={role === "developer"} />;
}
