export const instant = false;
import Link from "next/link";
import { requireCmsAdminPage } from "@/lib/supabaseServer";
import PreviewBanner from "@/components/cms/PreviewBanner";

const formatDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC" : "—";

function StatCard({ label, value, note, tone = "neutral" }: { label: string; value: number | string; note?: string; tone?: "neutral" | "accent" | "warning" }) {
  return (
    <div className="cms-card" style={{ padding: "20px" }}>
      <p style={{ fontSize: 13, color: "var(--cms-muted)" }}>{label}</p>
      <p style={{ marginTop: 8, fontSize: 30, fontWeight: 650, letterSpacing: "-0.02em", color: tone === "accent" ? "var(--cms-accent)" : "var(--cms-text)" }}>{value}</p>
      {note && <p className="cms-help" style={{ marginTop: 4 }}>{note}</p>}
    </div>
  );
}

export default async function AdminDashboard() {
  const { supabase, role } = await requireCmsAdminPage();

  const [allEnquiries, newEnquiries, packages, destinations, recentEnquiries, activity, homepage] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "New"),
    supabase.from("cms_documents").select("id", { count: "exact", head: true }).eq("type", "package").eq("status", "published"),
    supabase.from("cms_documents").select("id", { count: "exact", head: true }).eq("type", "destination").eq("status", "published"),
    supabase.from("enquiries").select("id, full_name, email, package_title, status, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("cms_documents").select("id, title, type, status, updated_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("cms_documents").select("status, updated_at").eq("type", "homepage").eq("slug", "home").maybeSingle(),
  ]);

  const published = homepage.data?.status === "published";

  return (
    <div style={{ display: "grid", gap: 28 }}>
      <PreviewBanner />
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 className="cms-page-title">Dashboard</h1>
          <p className="cms-page-subtitle">Welcome back. Here is what is happening on your website.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={published ? "cms-badge cms-badge-success" : "cms-badge cms-badge-warning"}>
            {published ? "Website published" : "Changes not published"}
          </span>
          <Link href="/" target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">View website</Link>
        </div>
      </header>

      {!published && (
        <div className="cms-notice cms-notice-warning">
          Your homepage has unpublished changes. <Link href="/admin/homepage" style={{ textDecoration: "underline", fontWeight: 600 }}>Open Website Builder</Link> to preview and publish them.
        </div>
      )}

      <section aria-label="Website summary" style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        <StatCard label="Total enquiries" value={allEnquiries.count ?? 0} />
        <StatCard label="New enquiries" value={newEnquiries.count ?? 0} tone={(newEnquiries.count ?? 0) > 0 ? "accent" : "neutral"} note={(newEnquiries.count ?? 0) > 0 ? "Waiting for a reply" : "All caught up"} />
        <StatCard label="Published tour packages" value={packages.count ?? 0} />
        <StatCard label="Total destinations" value={destinations.count ?? 0} />
      </section>

      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="cms-section-title" style={{ marginBottom: 12 }}>Quick actions</h2>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <Link href="/admin/packages/new" className="cms-card" style={{ padding: 18, textDecoration: "none", color: "var(--cms-text)" }}>
            <strong style={{ display: "block", fontSize: 14 }}>Add a tour package</strong>
            <span className="cms-help" style={{ display: "block", marginTop: 4 }}>Create a draft journey and publish it when ready.</span>
          </Link>
          <Link href="/admin/destinations/new" className="cms-card" style={{ padding: 18, textDecoration: "none", color: "var(--cms-text)" }}>
            <strong style={{ display: "block", fontSize: 14 }}>Add a destination</strong>
            <span className="cms-help" style={{ display: "block", marginTop: 4 }}>Describe a place and add its photos.</span>
          </Link>
          <Link href="/admin/pages/new" className="cms-card" style={{ padding: 18, textDecoration: "none", color: "var(--cms-text)" }}>
            <strong style={{ display: "block", fontSize: 14 }}>Add a page</strong>
            <span className="cms-help" style={{ display: "block", marginTop: 4 }}>Build a new page from reusable sections.</span>
          </Link>
        </div>
      </section>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 1fr)" }}>
        <section className="cms-card" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--cms-border)" }}>
            <h2 className="cms-section-title">Recent enquiries</h2>
            <Link href="/admin/operations" style={{ fontSize: 13, color: "var(--cms-accent)", fontWeight: 600, textDecoration: "none" }}>View all</Link>
          </div>
          {recentEnquiries.data?.length ? (
            <div style={{ overflowX: "auto" }}>
              <table className="cms-table">
                <thead><tr><th>Name</th><th>Package</th><th>Status</th><th>Received</th></tr></thead>
                <tbody>
                  {recentEnquiries.data.map((item) => (
                    <tr key={item.id}>
                      <td><strong style={{ fontWeight: 600 }}>{item.full_name || "—"}</strong><span className="cms-help" style={{ display: "block" }}>{item.email}</span></td>
                      <td>{item.package_title || "General enquiry"}</td>
                      <td><span className={item.status === "New" ? "cms-badge cms-badge-info" : "cms-badge cms-badge-neutral"}>{item.status || "New"}</span></td>
                      <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(item.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="cms-empty">No enquiries yet.</p>}
        </section>

        <section className="cms-card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--cms-border)" }}>
            <h2 className="cms-section-title">Recent website activity</h2>
          </div>
          {activity.data?.length ? (
            <ul style={{ listStyle: "none", margin: 0, padding: "6px 20px 14px" }}>
              {activity.data.map((item) => (
                <li key={item.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--cms-border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                    <span className="cms-badge cms-badge-neutral">{item.status}</span>
                  </div>
                  <p className="cms-help" style={{ marginTop: 3 }}>{item.type} · {formatDate(item.updated_at)}</p>
                </li>
              ))}
            </ul>
          ) : <p className="cms-empty">No changes recorded yet.</p>}
        </section>
      </div>

      <p className="cms-help">Signed in as {role === "developer" ? "developer" : "administrator"}.{role === "developer" && <> Need to change who can access the CMS? <Link href="/admin/users" style={{ textDecoration: "underline" }}>Users &amp; permissions</Link>.</>}</p>
    </div>
  );
}
