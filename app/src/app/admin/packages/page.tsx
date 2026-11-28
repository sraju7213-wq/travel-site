export const instant = false;
import Link from "next/link";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsStatusBadge from "@/components/cms/CmsStatusBadge";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC";

export default async function PackagesAdmin() {
  const { supabase } = await requireCmsAdminPage();
  const { data, error } = await supabase.from("cms_documents").select("id,title,slug,status,draft_data,updated_at").eq("type", "package").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div><h1 className="cms-page-title">Tour packages</h1><p className="cms-page-subtitle">Create journeys, manage drafts and publish them when ready.</p></div>
        <Link href="/admin/packages/new" className="cms-btn cms-btn-primary">Add new package</Link>
      </header>
      <div className="cms-card" style={{ overflow: "hidden" }}>
        {data?.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="cms-table">
              <thead><tr><th>Package</th><th>Category</th><th>Status</th><th>Updated</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td><strong style={{ fontWeight: 600 }}>{item.title}</strong><span className="cms-help" style={{ display: "block" }}>/packages/{item.slug}</span></td>
                    <td>{String(item.draft_data?.category ?? "")}</td>
                    <td><CmsStatusBadge status={item.status} /></td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(item.updated_at)}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <Link href={`/admin/packages/${item.id}`} className="cms-btn cms-btn-primary cms-btn-sm">Edit</Link>
                        <a href={`/api/admin/preview?documentId=${item.id}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">Preview</a>
                        {item.status === "published" && <a href={`/packages/${item.slug}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-ghost cms-btn-sm">View</a>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="cms-empty">No packages yet. Add one to get started.</p>}
      </div>
    </div>
  );
}
