import type { CmsSeo } from "@/types/cms";
import MediaPicker from "@/components/cms/MediaPicker";

export default function CmsSeoFields({ seo, onChange, developer = false }: { seo: CmsSeo; onChange: (seo: CmsSeo) => void; developer?: boolean }) {
  function set<K extends keyof CmsSeo>(key: K, value: CmsSeo[K]) { onChange({ ...seo, [key]: value }); }
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">{developer ? "SEO & social sharing" : "Search listing"}</legend>
      <div className="cms-field-grid">
        <label><span className="cms-label">Search title</span><input className="cms-input" value={seo.title ?? ""} onChange={(e) => set("title", e.target.value)} /></label>
        <label className="cms-field-wide"><span className="cms-label">Search description</span><textarea className="cms-input" rows={3} value={seo.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} /></label>
      </div>
      {developer && (
        <div className="cms-field-grid" style={{ marginTop: 14 }}>
          <label className="cms-field-wide"><span className="cms-label">Canonical URL</span><input className="cms-input" value={seo.canonicalUrl ?? ""} onChange={(e) => set("canonicalUrl", e.target.value)} placeholder="/packages/example or https://…" /></label>
          <label><span className="cms-label">Open Graph title</span><input className="cms-input" value={seo.openGraphTitle ?? ""} onChange={(e) => set("openGraphTitle", e.target.value)} /></label>
          <label><span className="cms-label">Open Graph description</span><input className="cms-input" value={seo.openGraphDescription ?? ""} onChange={(e) => set("openGraphDescription", e.target.value)} /></label>
          <label><span className="cms-label">Social image alt text</span><input className="cms-input" value={seo.socialImageAlt ?? ""} onChange={(e) => set("socialImageAlt", e.target.value)} /></label>
          <div><MediaPicker label="Social sharing image" value={seo.socialImage} onChange={(asset) => set("socialImage", asset?.publicUrl ?? "")} /></div>
          <label className="cms-field-wide"><span className="cms-label">Keywords (comma separated)</span><input className="cms-input" value={(seo.keywords ?? []).join(", ")} onChange={(e) => set("keywords", e.target.value.split(",").map((value) => value.trim()).filter(Boolean))} /></label>
        </div>
      )}
      {developer && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 12 }}>
          <label className="cms-check"><input type="checkbox" checked={seo.noIndex === true} onChange={(e) => set("noIndex", e.target.checked)} /> No index</label>
          <label className="cms-check"><input type="checkbox" checked={seo.noFollow === true} onChange={(e) => set("noFollow", e.target.checked)} /> No follow links</label>
          <label className="cms-check"><input type="checkbox" checked={seo.includeInSitemap !== false} onChange={(e) => set("includeInSitemap", e.target.checked)} /> Include in sitemap</label>
        </div>
      )}
    </fieldset>
  );
}
