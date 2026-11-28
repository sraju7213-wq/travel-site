export const instant = false;
import Link from "next/link";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import CmsStatusBadge from "@/components/cms/CmsStatusBadge";

const formatDate = (value: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC";

function editHref(type: string, id: string) {
  if (type === "package") return `/admin/packages/${id}`;
  if (type === "destination") return `/admin/destinations/${id}`;
  if (type === "homepage") return "/admin/homepage";
  if (type === "page") return `/admin/pages/${id}`;
  if (type === "testimonial") return `/admin/testimonials/${id}`;
  if (type === "faq") return `/admin/faqs/${id}`;
  if (type === "banner") return `/admin/banners/${id}`;
  return "/admin";
}

export default async function DraftsPage() {
  const { supabase } = await requireCmsAdminPage();
  const { data, error } = await supabase.from("cms_documents").select("id,type,title,slug,status,updated_at,updated_by").neq("status", "published").order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header>
        <h1 className="cms-page-title">Drafts &amp; unpublished content</h1>
        <p className="cms-page-subtitle">Published content is unaffected while you edit drafts.</p>
      </header>
      <div className="cms-card" style={{ overflow: "hidden" }}>
        {data?.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="cms-table">
              <thead><tr><th>Content</th><th>Type</th><th>Status</th><th>Updated</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td><Link href={editHref(item.type, item.id)} style={{ fontWeight: 600, textDecoration: "none" }}>{item.title}</Link><span className="cms-help" style={{ display: "block" }}>/{item.slug}</span></td>
                    <td className="cms-help">{item.type}</td>
                    <td><CmsStatusBadge status={item.status} /></td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(item.updated_at)}</td>
                    <td style={{ textAlign: "right" }}><a href={`/api/admin/preview?documentId=${item.id}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">Preview</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="cms-empty">No drafts or unpublished content.</p>}
      </div>
    </div>
  );
}
