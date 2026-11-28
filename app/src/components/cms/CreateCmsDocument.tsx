"use client";

import { useState, type FormEvent } from "react";
import type { CmsDocumentType } from "@/types/cms";
import { slugify } from "@/lib/sharedSlug";

export default function CreateCmsDocument({ type, titleLabel, defaultData, redirectTo, developer = false }: { type: CmsDocumentType; titleLabel: string; defaultData: Record<string, unknown>; redirectTo: string; developer?: boolean }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const cleanSlug = slugify(slug || title);
    try {
      const response = await fetch("/api/cms/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, title, slug: cleanSlug, data: { ...defaultData, title, name: title, slug: cleanSlug, id: cleanSlug } }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Unable to create content.");
      window.location.href = redirectTo.replace("{id}", result.document.id);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create content."); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="cms-card" style={{ maxWidth: 660, padding: 22, display: "grid", gap: 16 }}>
      <label><span className="cms-label">{titleLabel}</span><input required className="cms-input" value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }} placeholder="Enter a clear name" /></label>
      {developer ? (
        <label><span className="cms-label">Unique URL slug</span><input required className="cms-input" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="my-new-page" /></label>
      ) : (
        <p className="cms-help">The web address is created automatically from the name.</p>
      )}
      <p className="cms-help">This creates a draft. Nothing is published until you choose Publish.</p>
      {error && <p role="alert" className="cms-notice cms-notice-error">{error}</p>}
      <div><button disabled={busy} className="cms-btn cms-btn-primary">{busy ? "Creating…" : "Create draft"}</button></div>
    </form>
  );
}
