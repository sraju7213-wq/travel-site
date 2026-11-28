"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CmsHomepageData, CmsSection, CmsStatus } from "@/types/cms";
import CmsSectionBuilder from "@/components/cms/CmsSectionBuilder";
import CmsSeoFields from "@/components/cms/CmsSeoFields";
import CmsWorkflow from "@/components/cms/CmsWorkflow";

type Props = {
  document: { id: string; status: CmsStatus; draft_data: CmsHomepageData; updated_at: string | null; updated_by: string | null };
  availablePackages: Array<{ slug: string; title: string }>;
  availableDestinations: Array<{ slug: string; title: string }>;
  developer?: boolean;
};

export default function HomepageBuilder({ document, availablePackages, availableDestinations, developer = false }: Props) {
  const router = useRouter();
  const [data, setData] = useState<CmsHomepageData>({ ...document.draft_data, sections: document.draft_data?.sections ?? [] });
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const baseline = useRef(JSON.stringify({ ...document.draft_data, sections: document.draft_data?.sections ?? [] }));
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setDirty(JSON.stringify(data) !== baseline.current); }, [data]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/cms/documents/${document.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Homepage", slug: "home", data }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Save failed.");
      baseline.current = JSON.stringify(data);
      setDirty(false);
      setMessage({ text: "Draft saved. Preview it, then publish when you are happy.", tone: "success" });
      router.refresh();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Save failed.", tone: "error" });
    } finally { setBusy(false); }
  }

  async function publish() {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/cms/documents/${document.id}/action`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish" }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Publish failed.");
      setMessage({ text: "Homepage published. It is now live on the website.", tone: "success" });
      router.refresh();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Publish failed.", tone: "error" });
    } finally { setBusy(false); }
  }

  const hero = (data.sections ?? []).find((section) => section.type === "hero");
  const previewUrl = `/api/admin/preview?documentId=${document.id}`;

  return (
    <form onSubmit={save} style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 className="cms-page-title">Website Builder</h1>
          <p className="cms-page-subtitle">Edit the words, photos and order of your home page sections. Save a draft, preview it, then publish.</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 12 }}>
            <span className={document.status === "published" ? "cms-badge cms-badge-success" : "cms-badge cms-badge-warning"}>{document.status === "published" ? "Published" : "Not published"}</span>
            {dirty ? <span className="cms-badge cms-badge-info">Unsaved changes</span> : <span className="cms-badge cms-badge-neutral">All changes saved</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="submit" disabled={busy} className="cms-btn cms-btn-secondary">Save draft</button>
          <a href={previewUrl} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary">Preview</a>
          <button type="button" disabled={busy} onClick={publish} className="cms-btn cms-btn-primary">Publish</button>
        </div>
      </header>

      {message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

      <div className="cms-builder-layout">
        <div style={{ display: "grid", gap: 18, minWidth: 0 }}>
          {hero && <p className="cms-help">Your hero section is first in the list. Select it to change its headline and image.</p>}

          <CmsSectionBuilder sections={(data.sections ?? []) as CmsSection[]} onChange={(sections) => setData((current) => ({ ...current, sections }))} availablePackages={availablePackages} availableDestinations={availableDestinations} developer={developer} />

          <div className="cms-inset">
            <h2 className="cms-section-title">Search and social settings</h2>
            <p className="cms-help" style={{ marginBottom: 12 }}>How this page appears in search results and when shared.</p>
            <CmsSeoFields seo={data.seo ?? {}} onChange={(seo) => setData((current) => ({ ...current, seo }))} developer={developer} />
          </div>

          <details className="cms-card" style={{ padding: 14 }}>
            <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--cms-accent)" }}>More actions — duplicate, unpublish, version history</summary>
            <div style={{ marginTop: 12 }}><CmsWorkflow document={{ id: document.id, status: document.status, updatedAt: document.updated_at ?? undefined, updatedBy: document.updated_by ?? undefined }} publicPath="/" allowDelete={false} /></div>
          </details>

          <p className="cms-help">The site-wide footer is edited in <a href="/admin/settings#footer" style={{ color: "var(--cms-accent)", fontWeight: 600 }}>Website Settings</a>.</p>
          <button type="submit" disabled={busy} className="cms-btn cms-btn-primary">Save draft</button>
        </div>

        <aside className="cms-card cms-preview-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "14px 16px", borderBottom: "1px solid var(--cms-border)" }}>
            <strong style={{ fontSize: 14 }}>Website preview</strong>
            <button type="button" className="cms-btn cms-btn-ghost cms-btn-sm" onClick={() => setPreviewKey((key) => key + 1)}>Refresh</button>
          </div>
          <iframe key={previewKey} src={previewUrl} title="Homepage draft preview" className="cms-preview-frame" loading="lazy" referrerPolicy="no-referrer" />
          <p className="cms-help" style={{ padding: "12px 16px" }}>Shows the last saved draft. Save your changes to see them here, or open the full preview in a new tab.</p>
        </aside>
      </div>
    </form>
  );
}
