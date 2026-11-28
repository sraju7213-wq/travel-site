export const instant = false;
import Link from "next/link";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsStatusBadge from "@/components/cms/CmsStatusBadge";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC";

export default async function DestinationsAdmin() {
  const { supabase } = await requireCmsAdminPage();
  const { data, error } = await supabase.from("cms_documents").select("id,title,slug,status,draft_data,updated_at").eq("type", "destination").order("sort_order").order("title");
  if (error) throw new Error(error.message);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div><h1 className="cms-page-title">Destinations</h1><p className="cms-page-subtitle">Manage places, photos, location details and how they appear on the website.</p></div>
        <Link href="/admin/destinations/new" className="cms-btn cms-btn-primary">Add destination</Link>
      </header>
      {data?.length ? (
        <div className="cms-card-grid">
          {data.map((item) => (
            <article key={item.id} className="cms-card" style={{ padding: 18, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <h2 className="cms-section-title">{item.title}</h2>
                <CmsStatusBadge status={item.status} />
              </div>
              <p className="cms-help">/destinations/{item.slug}</p>
              <p className="cms-help" style={{ lineHeight: 1.5 }}>{String(item.draft_data?.description ?? item.draft_data?.shortDescription ?? "No description yet.")}</p>
              <p className="cms-help">Updated {formatDate(item.updated_at)}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <Link href={`/admin/destinations/${item.id}`} className="cms-btn cms-btn-primary cms-btn-sm">Edit</Link>
                <a href={`/api/admin/preview?documentId=${item.id}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">Preview</a>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="cms-card cms-empty">No destinations yet. Add one to get started.</div>}
    </div>
  );
}
