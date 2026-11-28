export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsCollectionList from "@/components/cms/CmsCollectionList";

export default async function FaqsAdmin() { const { supabase } = await requireCmsAdminPage(); const { data, error } = await supabase.from("cms_documents").select("id,title,slug,status,updated_at").eq("type", "faq").order("updated_at", { ascending: false }); if (error) throw new Error(error.message); return <CmsCollectionList title="FAQs" items={data ?? []} newHref="/admin/faqs/new" basePath="/admin/faqs" />; }
