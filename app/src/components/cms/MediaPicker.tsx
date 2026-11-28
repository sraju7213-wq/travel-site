"use client";

import { useEffect, useState } from "react";
import type { CmsMediaAsset } from "@/types/cms";

interface MediaPickerProps {
  value?: string;
  label?: string;
  kind?: "image" | "video";
  onChange: (asset: CmsMediaAsset | null) => void;
}

export default function MediaPicker({ value, label = "Media", kind = "image", onChange }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<CmsMediaAsset[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch(`/api/cms/media?kind=${kind}&q=${encodeURIComponent(query)}`);
    const result = await response.json(); if (response.ok) setAssets(result.assets ?? []); else setError(result.error);
  }
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [open, kind]); // eslint-disable-line react-hooks/exhaustive-deps

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true); setError("");
    const data = new FormData(); data.set("file", file); data.set("name", file.name); data.set("folder", kind === "image" ? "/images" : "/videos");
    try { const response = await fetch("/api/cms/media", { method: "POST", body: data }); const result = await response.json(); if (!response.ok) throw new Error(result.error); onChange(result.asset); setOpen(false); }
    catch (err) { setError(err instanceof Error ? err.message : "Upload failed."); }
    finally { setBusy(false); }
  }

  return <div className="space-y-2">
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{label}</span>
      <button type="button" onClick={() => setOpen(true)} className="rounded border border-white/15 px-3 py-2 text-xs">Choose or upload</button>
      {value && <button type="button" onClick={() => onChange(null)} className="text-xs text-red-200">Remove</button>}
    </div>
    {value && kind === "image" && <img src={value} alt="" className="max-h-32 rounded border border-white/10 object-contain" />}
    {value && kind === "video" && <video src={value} controls className="max-h-32 rounded border border-white/10" />}
    {open && <div role="dialog" aria-modal="true" aria-label={`Select ${label}`} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"><div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-white/15 bg-[#0e1718] p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h3 className="font-serif text-xl">Media library</h3><button type="button" onClick={() => setOpen(false)} className="rounded border border-white/15 px-3 py-1">Close</button></div><div className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]"><input aria-label="Search media" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void load(); } }} className="rounded border border-white/15 bg-black/30 px-3 py-2" placeholder="Search media" /><button type="button" onClick={() => void load()} className="rounded border border-white/15 px-3">Search</button></div><label className="mb-4 block rounded border border-dashed border-white/20 p-4 text-sm">Upload new {kind}<input type="file" accept={kind === "image" ? "image/jpeg,image/png,image/webp,image/avif,image/gif" : "video/mp4,video/webm,video/quicktime"} disabled={busy} onChange={(e) => void upload(e.target.files?.[0])} className="mt-2 block w-full" /></label>{error && <p role="alert" className="mb-3 text-sm text-red-200">{error}</p>}<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{assets.map((asset) => <button type="button" key={asset.id} onClick={() => { onChange(asset); setOpen(false); }} className="overflow-hidden rounded border border-white/10 text-left hover:border-[#d49368]">{asset.kind === "image" ? <img src={asset.publicUrl || (asset as unknown as { public_url?: string }).public_url} alt={asset.altText} className="h-32 w-full object-cover" /> : <div className="flex h-32 items-center justify-center bg-black/30">Video</div>}<span className="block p-2 text-xs">{asset.name}<span className="mt-1 block text-white/45">{asset.width ? `${asset.width}×${asset.height}` : ""} · {asset.folder}</span></span></button>)}</div>{!assets.length && <p className="text-sm text-white/50">No matching media yet.</p>}</div></div>}
  </div>;
}
