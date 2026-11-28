"use client";

import { useState, type CSSProperties, type MouseEvent } from "react";
import type { CmsCta, CmsMedia, CmsSection, CmsSectionType } from "@/types/cms";
import MediaPicker from "@/components/cms/MediaPicker";

export const SECTION_TYPES: Array<{ type: CmsSectionType; label: string }> = [
  { type: "hero", label: "Hero banner" }, { type: "image-text", label: "Image and text" }, { type: "full-width-image", label: "Full-width image" }, { type: "package-grid", label: "Package grid" }, { type: "destination-grid", label: "Destination grid" }, { type: "testimonials", label: "Testimonials" }, { type: "statistics", label: "Statistics" }, { type: "faq", label: "FAQ" }, { type: "image-gallery", label: "Image gallery" }, { type: "promotional-banner", label: "Promotional banner" }, { type: "cta", label: "CTA section" },
];
const clone = <T,>(value: T): T => structuredClone(value);
function newSection(type: CmsSectionType): CmsSection { return { id: `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, type, visible: true, eyebrow: "", heading: "", subheading: "", description: "", image: "", imageAlt: "", backgroundImage: "", backgroundPosition: "center", backgroundColor: "", layout: "two-column", height: "", textAlign: "left", overlay: 0.35, focalPoint: { x: 0.5, y: 0.5 }, backgroundType: "image", ctaPrimary: { label: "", href: "", visible: true }, ctaSecondary: { label: "", href: "", visible: true }, packages: [], destinations: [], stats: [], faqs: [], testimonials: [], items: [], images: [] }; }

type Props = {
  sections: CmsSection[];
  onChange: (sections: CmsSection[]) => void;
  availablePackages?: Array<{ slug: string; title: string }>;
  availableDestinations?: Array<{ slug: string; title: string }>;
  developer?: boolean;
};

export default function CmsSectionBuilder({ sections, onChange, availablePackages = [], availableDestinations = [], developer = false }: Props) {
  const [newType, setNewType] = useState<CmsSectionType>("image-text");
  const [dragged, setDragged] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"basic" | "advanced">("basic");

  function update(index: number, patch: Partial<CmsSection>) { const next = clone(sections); next[index] = { ...next[index], ...patch }; onChange(next); }
  function move(index: number, target: number) { if (target < 0 || target >= sections.length || index === target) return; const next = [...sections]; const [item] = next.splice(index, 1); next.splice(target, 0, item); onChange(next); }
  function duplicate(index: number) { const copy = clone(sections[index]); copy.id = `${copy.id}-copy-${Date.now()}`; onChange([...sections.slice(0, index + 1), copy, ...sections.slice(index + 1)]); setSelectedId(copy.id); }
  function add() { const section = newSection(newType); onChange([...sections, section]); setSelectedId(section.id); setTab("basic"); }

  return (
    <div className="space-y-3">
      <div className="cms-section-toolbar">
        <label className="cms-help" htmlFor="new-section-type">Add a section</label>
        <select id="new-section-type" aria-label="New section type" value={newType} onChange={(e) => setNewType(e.target.value as CmsSectionType)} className="cms-input" style={{ width: "auto", minWidth: 200 }}>
          {SECTION_TYPES.map((section) => <option key={section.type} value={section.type}>{section.label}</option>)}
        </select>
        <button type="button" onClick={add} className="cms-btn cms-btn-primary cms-btn-sm">Add section</button>
        <span className="cms-help" style={{ marginLeft: "auto" }}>Drag to reorder, or use the arrow buttons.</span>
      </div>

      {sections.map((section, index) => {
        const label = SECTION_TYPES.find((item) => item.type === section.type)?.label ?? section.type;
        const selected = selectedId === section.id;
        const thumb = section.image || section.backgroundImage || (section.type === "image-gallery" ? section.images?.[0]?.url : "") || "";
        return (
          <article
            key={section.id}
            draggable
            onDragStart={() => setDragged(index)}
            onDragOver={(e) => { e.preventDefault(); setOver(index); }}
            onDragLeave={() => setOver(null)}
            onDragEnd={() => { setDragged(null); setOver(null); }}
            onDrop={() => { if (dragged !== null) move(dragged, index); setDragged(null); setOver(null); }}
            className={`cms-card cms-section-card${selected ? " is-selected" : ""}${over === index && dragged !== null && dragged !== index ? " is-drop-target" : ""}${section.visible === false ? " is-hidden" : ""}`}
          >
            <div className="cms-section-header" onClick={() => { setSelectedId(selected ? null : section.id); setTab("basic"); }}>
              <span className="cms-drag-handle" aria-hidden="true">⋮⋮</span>
              {thumb ? <img src={thumb} alt="" className="cms-section-thumb" /> : <span className="cms-section-thumb cms-section-thumb-empty">No image</span>}
              <div style={{ minWidth: 0, flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{index + 1}. {label}</strong>
                <p className="cms-help" style={{ marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{section.heading || "Untitled section"}</p>
              </div>
              <span className={section.visible === false ? "cms-badge cms-badge-neutral" : "cms-badge cms-badge-success"}>{section.visible === false ? "Hidden" : "Visible"}</span>
              <div className="cms-section-actions" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="cms-icon-btn" aria-label={`Move section ${index + 1} up`} disabled={index === 0} onClick={() => move(index, index - 1)}><span aria-hidden="true">↑</span></button>
                <button type="button" className="cms-icon-btn" aria-label={`Move section ${index + 1} down`} disabled={index === sections.length - 1} onClick={() => move(index, index + 1)}><span aria-hidden="true">↓</span></button>
                <button type="button" className="cms-icon-btn" aria-label={section.visible === false ? "Show section" : "Hide section"} onClick={() => update(index, { visible: section.visible === false })}><span aria-hidden="true">{section.visible === false ? "◉" : "◎"}</span></button>
                <button type="button" className="cms-icon-btn" aria-label="Duplicate section" onClick={() => duplicate(index)}><span aria-hidden="true">⧉</span></button>
                <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove section" onClick={() => { if (window.confirm("Remove this section?")) { onChange(sections.filter((_, i) => i !== index)); if (selected) setSelectedId(null); } }}><span aria-hidden="true">×</span></button>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={selected ? "cms-chevron is-open" : "cms-chevron"} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </div>

            {selected && (
              <div className="cms-section-body">
                <div className="cms-tabs" role="tablist" aria-label="Section settings">
                  <button type="button" role="tab" aria-selected={tab === "basic"} className={tab === "basic" ? "cms-tab is-active" : "cms-tab"} onClick={() => setTab("basic")}>Basic settings</button>
                  <button type="button" role="tab" aria-selected={tab === "advanced"} className={tab === "advanced" ? "cms-tab is-active" : "cms-tab"} onClick={() => setTab("advanced")}>Advanced settings</button>
                </div>

                {tab === "basic" ? (
                  <div style={{ display: "grid", gap: 18 }}>
                    <div className="cms-field-grid">
                      <label><span className="cms-label">Eyebrow</span><input className="cms-input" value={section.eyebrow ?? ""} onChange={(e) => update(index, { eyebrow: e.target.value })} /></label>
                      <label><span className="cms-label">Heading</span><input className="cms-input" value={section.heading ?? ""} onChange={(e) => update(index, { heading: e.target.value })} /></label>
                      <label className="cms-field-wide"><span className="cms-label">Subheading</span><input className="cms-input" value={section.subheading ?? ""} onChange={(e) => update(index, { subheading: e.target.value })} /></label>
                      <label className="cms-field-wide"><span className="cms-label">Description</span><textarea className="cms-input" rows={3} value={section.description ?? ""} onChange={(e) => update(index, { description: e.target.value })} /></label>
                    </div>

                    <div className="cms-field-grid">
                      <div>
                        <MediaPicker label="Section image" value={section.image} onChange={(asset) => update(index, { image: asset?.publicUrl ?? "", imageAlt: asset?.altText || section.imageAlt })} />
                        <label style={{ marginTop: 8, display: "block" }}><span className="cms-label">Image alt text</span><input className="cms-input" value={section.imageAlt ?? ""} onChange={(e) => update(index, { imageAlt: e.target.value })} /></label>
                      </div>
                      <FocalPicker section={section} onChange={(focalPoint) => update(index, { focalPoint })} disabled={!developer} />
                    </div>

                    <CtaEditor label="Primary button" cta={section.ctaPrimary ?? {}} onChange={(cta) => update(index, { ctaPrimary: cta })} developer={developer} />
                    <CtaEditor label="Secondary button" cta={section.ctaSecondary ?? {}} onChange={(cta) => update(index, { ctaSecondary: cta })} developer={developer} />

                    {section.type === "package-grid" && <div className="cms-inset"><h3 className="cms-section-title">Featured packages</h3><div className="cms-check-grid">{availablePackages.map((pkg) => <label key={pkg.slug} className="cms-check"><input type="checkbox" checked={(section.packages ?? []).includes(pkg.slug)} onChange={(e) => update(index, { packages: e.target.checked ? [...(section.packages ?? []), pkg.slug] : (section.packages ?? []).filter((slug) => slug !== pkg.slug) })} /> {pkg.title}</label>)}</div></div>}
                    {section.type === "destination-grid" && <div className="cms-inset"><h3 className="cms-section-title">Destination highlights</h3><div className="cms-check-grid">{availableDestinations.map((destination) => <label key={destination.slug} className="cms-check"><input type="checkbox" checked={(section.destinations ?? []).includes(destination.slug)} onChange={(e) => update(index, { destinations: e.target.checked ? [...(section.destinations ?? []), destination.slug] : (section.destinations ?? []).filter((slug) => slug !== destination.slug) })} /> {destination.title}</label>)}</div><p className="cms-help" style={{ marginTop: 8 }}>Leave all unchecked to use published destinations.</p></div>}
                    {section.type === "statistics" && <ListEditor title="Statistics" items={(section.stats ?? []).map((stat) => ({ ...stat }))} onChange={(items) => update(index, { stats: items.map((item) => ({ value: String(item.value ?? item.text ?? ""), label: String(item.label ?? item.title ?? ""), note: String(item.note ?? ""), visible: item.visible !== false })) })} fields={["value", "label", "note"]} />}
                    {section.type === "faq" && <FaqEditor section={section} onChange={(patch) => update(index, patch)} />}
                    {section.type === "testimonials" && <TestimonialEditor section={section} onChange={(patch) => update(index, patch)} />}
                    {section.type === "image-gallery" && <GalleryEditor images={section.images ?? []} onChange={(images) => update(index, { images })} />}
                    {!["statistics", "faq", "testimonials", "image-gallery"].includes(section.type) && <ListEditor title="Optional items" items={section.items ?? []} onChange={(items) => update(index, { items })} />}
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 18 }}>
                    {!developer && <p className="cms-notice cms-notice-warning">Layout, background and image-position controls are available to developers.</p>}
                    <div className="cms-field-grid">
                      <label><span className="cms-label">Layout</span><select className="cms-input" disabled={!developer} value={section.layout ?? "two-column"} onChange={(e) => update(index, { layout: e.target.value })}><option value="left">Image left</option><option value="right">Image right</option><option value="center">Centered</option><option value="full">Full width</option><option value="two-column">Two columns</option><option value="three-column">Three columns</option><option value="four-column">Four columns</option></select></label>
                      <label><span className="cms-label">Text alignment</span><select className="cms-input" disabled={!developer} value={section.textAlign ?? "left"} onChange={(e) => update(index, { textAlign: e.target.value as CmsSection["textAlign"] })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
                      <label><span className="cms-label">Height</span><input className="cms-input" disabled={!developer} value={section.height ?? ""} placeholder="e.g. 600px, 80vh" onChange={(e) => update(index, { height: e.target.value })} /></label>
                      <label><span className="cms-label">Background colour</span><input className="cms-input" disabled={!developer} value={section.backgroundColor ?? ""} placeholder="#000000 or var(--…)" onChange={(e) => update(index, { backgroundColor: e.target.value })} /></label>
                      <label className="cms-field-wide"><span className="cms-label">Background position</span><input className="cms-input" disabled={!developer} value={section.backgroundPosition ?? "center"} onChange={(e) => update(index, { backgroundPosition: e.target.value })} /></label>
                      <label className="cms-field-wide"><span className="cms-label">Overlay opacity (0–1)</span><input className="cms-input" type="number" min={0} max={1} step={0.01} disabled={!developer} value={section.overlay ?? 0} onChange={(e) => update(index, { overlay: Number(e.target.value) })} /></label>
                      {section.type === "package-grid" && <label><span className="cms-label">Package limit</span><input className="cms-input" type="number" min={0} disabled={!developer} value={section.packageLimit ?? 0} onChange={(e) => update(index, { packageLimit: Number(e.target.value) })} /></label>}
                      {section.type === "destination-grid" && <label><span className="cms-label">Destination limit</span><input className="cms-input" type="number" min={0} disabled={!developer} value={section.destinationLimit ?? 0} onChange={(e) => update(index, { destinationLimit: Number(e.target.value) })} /></label>}
                    </div>
                    {developer && <div><MediaPicker label="Background image" value={section.backgroundImage} onChange={(asset) => update(index, { backgroundImage: asset?.publicUrl ?? "" })} /></div>}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}

      {!sections.length && <div className="cms-empty">No sections yet. Add one above to start building this page.</div>}
    </div>
  );
}

function FocalPicker({ section, onChange, disabled }: { section: CmsSection; onChange: (point: { x: number; y: number }) => void; disabled?: boolean }) {
  const image = section.image || section.backgroundImage || section.images?.[0]?.url || "";
  const point = section.focalPoint ?? { x: 0.5, y: 0.5 };
  function pick(event: MouseEvent<HTMLDivElement>) {
    if (disabled || !image) return;
    const rect = event.currentTarget.getBoundingClientRect();
    onChange({ x: Math.min(1, Math.max(0, Number(((event.clientX - rect.left) / rect.width).toFixed(2)))), y: Math.min(1, Math.max(0, Number(((event.clientY - rect.top) / rect.height).toFixed(2)))) });
  }
  return (
    <div>
      <span className="cms-label">Image focus point</span>
      <div className="cms-focal-picker" onClick={pick} style={image ? { backgroundImage: `url(${image})` } : undefined} aria-label="Click the image to choose its focus point">
        {!image && <span className="cms-help">Add an image to set its focus</span>}
        <span className="cms-focal-dot" style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` } as CSSProperties} />
      </div>
      <p className="cms-help" style={{ marginTop: 6 }}>{disabled ? "Available to developers." : "Click the picture to choose what stays in frame on smaller screens."}</p>
    </div>
  );
}

function CtaEditor({ label, cta, onChange, developer = false }: { label: string; cta: CmsCta; onChange: (cta: CmsCta) => void; developer?: boolean }) {
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">{label}</legend>
      <div className="cms-field-grid">
        <label><span className="cms-label">Button text</span><input className="cms-input" aria-label={`${label} label`} value={cta.label ?? ""} onChange={(e) => onChange({ ...cta, label: e.target.value })} placeholder="e.g. Explore journeys" /></label>
        <label><span className="cms-label">Link</span><input className="cms-input" aria-label={`${label} destination`} value={cta.href ?? ""} onChange={(e) => onChange({ ...cta, href: e.target.value })} placeholder="/packages" /></label>
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        <label className="cms-check"><input type="checkbox" checked={cta.visible !== false} onChange={(e) => onChange({ ...cta, visible: e.target.checked })} /> Show this button</label>
        {developer && <label className="cms-check"><input type="checkbox" checked={cta.target === "_blank"} onChange={(e) => onChange({ ...cta, target: e.target.checked ? "_blank" : "_self" })} /> Open in a new tab</label>}
      </div>
    </fieldset>
  );
}

function ListEditor({ title, items, onChange, fields = ["title", "text"] }: { title: string; items: Array<Record<string, unknown>>; onChange: (items: Array<Record<string, unknown>>) => void; fields?: string[] }) {
  function move(index: number, target: number) { if (target < 0 || target >= items.length) return; const next = [...items]; const [item] = next.splice(index, 1); next.splice(target, 0, item); onChange(next); }
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">{title}</legend>
      {items.map((item, index) => (
        <div key={index} className="cms-repeat-row">
          {fields.map((field) => <input key={field} className="cms-input" aria-label={`${title} ${field}`} value={String(item[field] ?? "")} onChange={(e) => { const next = clone(items); next[index] = { ...next[index], [field]: e.target.value }; onChange(next); }} placeholder={field} />)}
          <div className="cms-row-actions">
            <button type="button" className="cms-icon-btn" aria-label={`Move ${title} item up`} onClick={() => move(index, index - 1)}><span aria-hidden="true">↑</span></button>
            <button type="button" className="cms-icon-btn" aria-label={`Move ${title} item down`} onClick={() => move(index, index + 1)}><span aria-hidden="true">↓</span></button>
            <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove item" onClick={() => onChange(items.filter((_, i) => i !== index))}><span aria-hidden="true">×</span></button>
          </div>
        </div>
      ))}
      <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => onChange([...items, { title: "", text: "", value: "", label: "", note: "", visible: true }])}>Add item</button>
    </fieldset>
  );
}

function FaqEditor({ section, onChange }: { section: CmsSection; onChange: (patch: Partial<CmsSection>) => void }) {
  const items = section.faqs ?? [];
  function move(index: number, target: number) { if (target < 0 || target >= items.length) return; const next = clone(items); const [item] = next.splice(index, 1); next.splice(target, 0, item); onChange({ faqs: next }); }
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">Frequently asked questions</legend>
      {items.map((item, index) => (
        <div key={index} className="cms-repeat-row">
          <input className="cms-input" value={item.question} onChange={(e) => { const next = clone(items); next[index].question = e.target.value; onChange({ faqs: next }); }} placeholder="Question" />
          <textarea className="cms-input" value={item.answer} onChange={(e) => { const next = clone(items); next[index].answer = e.target.value; onChange({ faqs: next }); }} placeholder="Answer" rows={2} />
          <div className="cms-row-actions">
            <button type="button" className="cms-icon-btn" aria-label="Move FAQ up" onClick={() => move(index, index - 1)}><span aria-hidden="true">↑</span></button>
            <button type="button" className="cms-icon-btn" aria-label="Move FAQ down" onClick={() => move(index, index + 1)}><span aria-hidden="true">↓</span></button>
            <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove FAQ" onClick={() => onChange({ faqs: items.filter((_, i) => i !== index) })}><span aria-hidden="true">×</span></button>
          </div>
        </div>
      ))}
      <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => onChange({ faqs: [...items, { question: "", answer: "", visible: true }] })}>Add FAQ</button>
    </fieldset>
  );
}

function TestimonialEditor({ section, onChange }: { section: CmsSection; onChange: (patch: Partial<CmsSection>) => void }) {
  const items = section.testimonials ?? [];
  function move(index: number, target: number) { if (target < 0 || target >= items.length) return; const next = clone(items); const [item] = next.splice(index, 1); next.splice(target, 0, item); onChange({ testimonials: next }); }
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">Client reviews</legend>
      {items.map((item, index) => (
        <div key={item.id ?? index} className="cms-repeat-row">
          <input className="cms-input" value={item.name} onChange={(e) => { const next = clone(items); next[index].name = e.target.value; onChange({ testimonials: next }); }} placeholder="Client name" />
          <input className="cms-input" value={item.role ?? ""} onChange={(e) => { const next = clone(items); next[index].role = e.target.value; onChange({ testimonials: next }); }} placeholder="Role / location" />
          <textarea className="cms-input" value={item.quote} onChange={(e) => { const next = clone(items); next[index].quote = e.target.value; onChange({ testimonials: next }); }} placeholder="Review" rows={2} />
          <div className="cms-row-actions">
            <button type="button" className="cms-icon-btn" aria-label="Move review up" onClick={() => move(index, index - 1)}><span aria-hidden="true">↑</span></button>
            <button type="button" className="cms-icon-btn" aria-label="Move review down" onClick={() => move(index, index + 1)}><span aria-hidden="true">↓</span></button>
            <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove review" onClick={() => onChange({ testimonials: items.filter((_, i) => i !== index) })}><span aria-hidden="true">×</span></button>
          </div>
        </div>
      ))}
      <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => onChange({ testimonials: [...items, { name: "", quote: "", visible: true }] })}>Add testimonial</button>
    </fieldset>
  );
}

function GalleryEditor({ images, onChange }: { images: CmsMedia[]; onChange: (images: CmsMedia[]) => void }) {
  function move(index: number, target: number) { if (target < 0 || target >= images.length) return; const next = [...images]; const [item] = next.splice(index, 1); next.splice(target, 0, item); onChange(next); }
  return (
    <fieldset className="cms-inset">
      <legend className="cms-section-title">Image gallery</legend>
      {images.map((image, index) => (
        <div key={index} className="cms-repeat-row">
          <img src={image.url} alt={image.alt ?? ""} className="cms-gallery-thumb" />
          <input className="cms-input" value={image.alt ?? ""} onChange={(e) => { const next = clone(images); next[index].alt = e.target.value; onChange(next); }} placeholder="Alt text" />
          <input className="cms-input" value={image.caption ?? ""} onChange={(e) => { const next = clone(images); next[index].caption = e.target.value; onChange(next); }} placeholder="Caption" />
          <div className="cms-row-actions">
            <button type="button" className="cms-icon-btn" aria-label="Move image up" onClick={() => move(index, index - 1)}><span aria-hidden="true">↑</span></button>
            <button type="button" className="cms-icon-btn" aria-label="Move image down" onClick={() => move(index, index + 1)}><span aria-hidden="true">↓</span></button>
            <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove image" onClick={() => onChange(images.filter((_, i) => i !== index))}><span aria-hidden="true">×</span></button>
          </div>
        </div>
      ))}
      <MediaPicker label="Add image" onChange={(asset) => asset && onChange([...images, { id: asset.id, url: asset.publicUrl, alt: asset.altText, caption: asset.caption, order: images.length, visible: true }])} />
    </fieldset>
  );
}
