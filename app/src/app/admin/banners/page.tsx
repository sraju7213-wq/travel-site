export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsCollectionList from "@/components/cms/CmsCollectionList";

export default async function BannersAdmin() { const { supabase } = await requireCmsAdminPage(); const { data, error } = await supabase.from("cms_documents").select("id,title,slug,status,updated_at").eq("type", "banner").order("updated_at", { ascending: false }); if (error) throw new Error(error.message); return <CmsCollectionList title="Promotional banners" items={data ?? []} newHref="/admin/banners/new" basePath="/admin/banners" />; }
