export const instant = false;
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsSettingsForm from "@/components/cms/CmsSettingsForm";
import type { CmsSettings, CmsStatus } from "@/types/cms";

export default async function SettingsAdmin() { const { supabase, role } = await requireCmsAdminPage(); const { data, error } = await supabase.from("cms_documents").select("*").eq("type", "settings").eq("slug", "global").maybeSingle(); if (error) throw new Error(error.message); if (!data) return <p>Website settings have not been seeded. Apply the included CMS migration.</p>; return <CmsSettingsForm document={{ id: data.id, status: data.status as CmsStatus, draft_data: data.draft_data as Partial<CmsSettings>, updated_at: data.updated_at, updated_by: data.updated_by }} developer={role === "developer"} />; }
