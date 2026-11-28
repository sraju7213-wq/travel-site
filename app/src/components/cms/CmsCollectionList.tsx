import Link from "next/link";

const formatDate = (value: string) =>
  value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC" : "—";

function tone(status: string) {
  if (status === "published") return "cms-badge-success";
  if (status === "archived") return "cms-badge-neutral";
  return "cms-badge-warning";
}

export default function CmsCollectionList({ title, items, newHref, basePath }: { title: string; items: Array<{ id: string; title: string; slug: string; status: string; updated_at: string }>; newHref: string; basePath: string }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 className="cms-page-title">{title}</h1>
          <p className="cms-page-subtitle">Published items can be reused across homepage sections and pages.</p>
        </div>
        <Link href={newHref} className="cms-btn cms-btn-primary">Add new</Link>
      </header>

      <div className="cms-card" style={{ overflow: "hidden" }}>
        {items.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="cms-table">
              <thead><tr><th>Title</th><th>Web address</th><th>Status</th><th>Updated</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><strong style={{ fontWeight: 600 }}>{item.title}</strong></td>
                    <td className="cms-help">/{item.slug}</td>
                    <td><span className={`cms-badge ${tone(item.status)}`}>{item.status}</span></td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(item.updated_at)}</td>
                    <td style={{ textAlign: "right" }}><Link href={`${basePath}/${item.id}`} className="cms-btn cms-btn-secondary cms-btn-sm">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="cms-empty">No items yet. Add one to get started.</p>}
      </div>
    </div>
  );
}
