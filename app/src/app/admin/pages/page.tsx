export const instant = false;
import Link from "next/link";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsStatusBadge from "@/components/cms/CmsStatusBadge";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC";

export default async function PagesAdmin() {
  const { supabase } = await requireCmsAdminPage();
  const { data, error } = await supabase.from("cms_documents").select("id,title,slug,status,updated_at").eq("type", "page").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div><h1 className="cms-page-title">Pages</h1><p className="cms-page-subtitle">Build pages from reusable sections. Publish when they are ready.</p></div>
        <Link href="/admin/pages/new" className="cms-btn cms-btn-primary">New page</Link>
      </header>
      {data?.length ? (
        <div className="cms-card-grid">
          {data.map((page) => (
            <article key={page.id} className="cms-card" style={{ padding: 18, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <h2 className="cms-section-title">{page.title}</h2>
                <CmsStatusBadge status={page.status} />
              </div>
              <p className="cms-help">/pages/{page.slug}</p>
              <p className="cms-help">Updated {formatDate(page.updated_at)}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <Link href={`/admin/pages/${page.id}`} className="cms-btn cms-btn-primary cms-btn-sm">Edit</Link>
                <a href={`/api/admin/preview?documentId=${page.id}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">Preview</a>
              </div>
            </article>
          ))}
        </div>
      ) : <div className="cms-card cms-empty">No pages yet. Create one to get started.</div>}
    </div>
  );
}
