export default function CmsStatusBadge({ status }: { status?: string | null }) {
  const value = status || "draft";
  const tone = value === "published" ? "cms-badge-success" : value === "archived" ? "cms-badge-neutral" : value === "unpublished" ? "cms-badge-warning" : "cms-badge-info";
  const label = value.charAt(0).toUpperCase() + value.slice(1);
  return <span className={`cms-badge ${tone}`}>{label}</span>;
}
