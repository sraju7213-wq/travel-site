"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface WorkflowDocument {
  id: string;
  status: "draft" | "published" | "unpublished" | "archived";
  updatedAt?: string;
  updated_by?: string;
  updatedAtLabel?: string;
  updatedBy?: string | null;
}

/** Fixed locale + UTC so server HTML and the hydrated client render match. */
function formatTimestamp(value?: string | null): string {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return `${new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}

async function action(id: string, name: string, createRedirect?: boolean) {  const response = await fetch(`/api/cms/documents/${id}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: name, createRedirect }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || `Unable to ${name}.`) as Error & { code?: string; oldPath?: string; newPath?: string };
    error.code = result.code; error.oldPath = result.oldPath; error.newPath = result.newPath;
    throw error;
  }
  return result;
}

export default function CmsWorkflow({ document, publicPath, allowDelete = true }: { document: WorkflowDocument; publicPath?: string; allowDelete?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Array<{ id: string; createdAt?: string; created_at?: string; action: string; title: string; slug: string }> | null>(null);

  async function run(name: string, createRedirect?: boolean) {
    setBusy(name); setMessage("");
    try { await action(document.id, name, createRedirect); setMessage(name === "publish" ? "Published. Public pages were revalidated." : `${name.replaceAll("_", " ")} completed.`); router.refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Action failed."); }
    finally { setBusy(null); }
  }

  async function publish() {
    setBusy("publish"); setMessage("");
    try { await action(document.id, "publish"); setMessage("Published. Public pages were revalidated."); router.refresh(); }
    catch (error) {
      const e = error as Error & { code?: string; oldPath?: string; newPath?: string };
      if (e.code === "redirect_required" && window.confirm(`${e.message}\n\nCreate a 301 redirect from ${e.oldPath} to ${e.newPath}?`)) {
        try { await action(document.id, "publish", true); setMessage("Published with a redirect from the previous public URL."); router.refresh(); }
        catch (retryError) { setMessage(retryError instanceof Error ? retryError.message : "Publish failed."); }
      } else if (e.code !== "redirect_required") setMessage(e.message);
      // No redirect choice means no publication was applied.
      else setMessage("Not published. Choose the redirect option to proceed.");
    } finally { setBusy(null); }
  }

  async function duplicate() {
    setBusy("duplicate"); setMessage("");
    try { const response = await fetch(`/api/cms/documents/${document.id}/action`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "duplicate" }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setMessage("Draft copy created."); router.refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Duplicate failed."); }
    finally { setBusy(null); }
  }

  async function remove() {
    if (!window.confirm("Permanently delete this content? This cannot be undone. Archive is recommended instead.")) return;
    setBusy("delete"); setMessage("");
    try { const response = await fetch(`/api/cms/documents/${document.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: true }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.push("/admin"); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Delete failed."); setBusy(null); }
  }

  async function showHistory() {
    const response = await fetch(`/api/cms/documents/${document.id}/revisions`); const result = await response.json(); setHistory(result.revisions ?? []);
  }

  async function restore(revisionId: string) {
    if (!window.confirm("Restore this version as a draft? Current public content will remain unchanged until you publish.")) return;
    const response = await fetch(`/api/cms/revisions/${revisionId}/restore`, { method: "POST" }); const result = await response.json(); if (!response.ok) setMessage(result.error || "Restore failed."); else { setMessage(result.message); router.refresh(); }
  }

  const statusTone = document.status === "published" ? "cms-badge-success" : document.status === "archived" ? "cms-badge-neutral" : "cms-badge-warning";
  return <section className="cms-card" style={{ padding: 18 }} aria-label="Publishing controls">
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className={`cms-badge ${statusTone}`}>{document.status}</span>
        <span className="cms-help">Last updated {document.updatedAt ? formatTimestamp(document.updatedAt) : document.updatedAtLabel ?? "unknown"}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" disabled={!!busy} onClick={publish} className="cms-btn cms-btn-primary cms-btn-sm">{busy === "publish" ? "Publishing…" : document.status === "published" ? "Publish latest draft" : "Publish"}</button>
        <a href={`/api/admin/preview?documentId=${document.id}`} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">Preview</a>
        {publicPath && <a href={publicPath} target="_blank" rel="noreferrer" className="cms-btn cms-btn-secondary cms-btn-sm">View live</a>}
      </div>
    </div>

    <div className="cms-divider" style={{ margin: "14px 0" }} />

    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {document.status === "published" && <button type="button" disabled={!!busy} onClick={() => run("unpublish")} className="cms-btn cms-btn-secondary cms-btn-sm">Unpublish</button>}
      {document.status !== "archived" ? <button type="button" disabled={!!busy} onClick={() => run("archive")} className="cms-btn cms-btn-secondary cms-btn-sm">Archive</button> : <button type="button" disabled={!!busy} onClick={() => run("restore_archive")} className="cms-btn cms-btn-secondary cms-btn-sm">Restore from archive</button>}
      <button type="button" disabled={!!busy} onClick={duplicate} className="cms-btn cms-btn-secondary cms-btn-sm">Duplicate</button>
      <button type="button" onClick={showHistory} className="cms-btn cms-btn-ghost cms-btn-sm">Version history</button>
      {allowDelete && <button type="button" disabled={!!busy} onClick={remove} className="cms-btn cms-btn-danger cms-btn-sm">Delete</button>}
    </div>

    <p className="cms-help" style={{ marginTop: 10 }}>Updated by {document.updatedBy ?? document.updated_by ?? "not recorded"}</p>
    {message && <p role="status" className="cms-notice cms-notice-warning" style={{ marginTop: 12 }}>{message}</p>}
    {history && <div className="cms-inset" style={{ marginTop: 14, maxHeight: 280, overflow: "auto" }}><h3 className="cms-section-title">Previous versions</h3>{history.length ? <ul style={{ marginTop: 10 }}>{history.map((revision) => <li key={revision.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "8px 0", borderTop: "1px solid var(--cms-border)", fontSize: 12 }}><span>{revision.title} · {revision.action} · {formatTimestamp(revision.createdAt ?? revision.created_at)}</span><button type="button" onClick={() => restore(revision.id)} className="cms-btn cms-btn-secondary cms-btn-sm">Restore</button></li>)}</ul> : <p className="cms-help" style={{ marginTop: 8 }}>No previous versions yet.</p>}</div>}
  </section>;
}
