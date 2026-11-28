export const instant = false;
import { CmsAuthError, requireCmsDeveloper } from "@/lib/supabaseServer";
import CmsThemeForm from "@/components/cms/CmsThemeForm";
import type { CmsStatus, CmsTheme } from "@/types/cms";

export default async function ThemeAdmin() {
  let context;
  try {
    context = await requireCmsDeveloper();
  } catch (error) {
    if (error instanceof CmsAuthError) return <div className="rounded-xl border border-white/10 p-6"><h1 className="font-serif text-2xl">Developer access only</h1><p className="mt-2 text-sm text-white/60">Theme and appearance controls are reserved for the developer.</p></div>;
    throw error;
  }
  const { supabase } = context;
  const { data, error } = await supabase.from("cms_documents").select("*").eq("type", "theme").eq("slug", "global").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return <p>Theme defaults have not been seeded. Apply the included CMS migration.</p>;
  return <CmsThemeForm document={{ id: data.id, status: data.status as CmsStatus, draft_data: data.draft_data as Partial<CmsTheme>, updated_at: data.updated_at, updated_by: data.updated_by }} />;
}
