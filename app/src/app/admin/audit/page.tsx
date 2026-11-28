export const instant = false;
import { CmsAuthError, requireCmsDeveloper } from "@/lib/supabaseServer";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC";

export default async function AuditPage() {
  let context;
  try {
    context = await requireCmsDeveloper();
  } catch (error) {
    if (error instanceof CmsAuthError) return <div className="rounded-xl border border-white/10 p-6"><h1 className="font-serif text-2xl">Developer access only</h1><p className="mt-2 text-sm text-white/60">The audit log is reserved for the developer.</p></div>;
    throw error;
  }
  const { supabase } = context;
  const { data, error } = await supabase.from("cms_audit_log").select("*").order("created_at", { ascending: false }).limit(250);
  if (error) throw new Error(error.message);
  return <div><h1 className="font-serif text-3xl">Administrative audit log</h1><p className="mt-2 text-sm text-white/55">Authorized changes are recorded with actor, action, entity, and time. Audit records cannot be edited in the CMS.</p><div className="mt-6 overflow-x-auto rounded-xl border border-white/10"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-white/5 text-xs uppercase"><tr><th className="p-3">Time</th><th className="p-3">Action</th><th className="p-3">Entity</th><th className="p-3">Actor</th></tr></thead><tbody>{data?.map((entry) => <tr key={entry.id} className="border-t border-white/10"><td className="p-3 whitespace-nowrap">{formatDate(entry.created_at)}</td><td className="p-3">{entry.action}</td><td className="p-3">{entry.entity_type} · {entry.entity_id ?? "—"}</td><td className="p-3">{entry.actor_id ?? "System"}</td></tr>)}</tbody></table></div></div>;
}
