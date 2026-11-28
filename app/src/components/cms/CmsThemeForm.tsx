"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CmsStatus, CmsTheme } from "@/types/cms";
import { DEFAULT_CMS_THEME, THEME_PRESETS } from "@/lib/cmsDefaults";
import CmsWorkflow from "@/components/cms/CmsWorkflow";

const COLOR_FIELDS = [
  ["primary", "Primary brand colour"], ["secondary", "Secondary brand colour"], ["accent", "Accent colour"],
  ["background", "Page background"], ["foreground", "Body text"], ["cardBackground", "Card background"],
  ["cardBorder", "Card border"], ["buttonBackground", "Button background"], ["buttonText", "Button text"],
  ["buttonHover", "Button hover"], ["headerBackground", "Header background"], ["footerBackground", "Footer background"],
] as const;

const QUICK_COLOURS = ["#16271A", "#1F3A2E", "#176B4B", "#B18A51", "#D49368", "#F6F2E9", "#FFFFFF", "#252824", "#0C1617", "#11191F"];

const FONT_OPTIONS = [
  { value: "serif", label: "Editorial serif", hint: "Warm, classic headings", stack: "var(--font-serif), Georgia, serif" },
  { value: "sans", label: "Modern sans", hint: "Clean and contemporary", stack: "var(--font-sans), system-ui, sans-serif" },
  { value: "display", label: "Display capitals", hint: "Elegant uppercase accents", stack: "var(--font-accent), Georgia, serif" },
  { value: "inter", label: "Inter", hint: "Neutral and highly readable", stack: "var(--font-inter), system-ui, sans-serif" },
  { value: "mono", label: "Monospace", hint: "Technical, fixed width", stack: "var(--font-mono), monospace" },
  { value: "system", label: "System default", hint: "Uses the visitor's device font", stack: "system-ui, sans-serif" },
] as const;

function fontStack(value: string | undefined) {
  return FONT_OPTIONS.find((option) => option.value === value)?.stack ?? "var(--font-sans), system-ui, sans-serif";
}

function toHex(value: string) {
  const raw = String(value ?? "").trim();
  if (/^#[\da-f]{6}$/i.test(raw)) return raw;
  if (/^#[\da-f]{3}$/i.test(raw)) return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  const rgba = raw.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgba) return `#${rgba.slice(1, 4).map((part) => Number(part).toString(16).padStart(2, "0")).join("")}`;
  return "#000000";
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="cms-color-field">
      <span className="cms-label">{label}</span>
      <div className="cms-color-row">
        <input type="color" value={toHex(value)} onChange={(event) => onChange(event.target.value)} aria-label={`${label} colour picker`} className="cms-color-swatch" />
        <input className="cms-input" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${label} value`} />
      </div>
      <div className="cms-quick-colours" aria-label={`Suggested colours for ${label}`}>
        {QUICK_COLOURS.map((colour) => <button key={colour} type="button" className={colour.toLowerCase() === toHex(value).toLowerCase() ? "cms-quick-swatch is-active" : "cms-quick-swatch"} style={{ backgroundColor: colour }} title={colour} aria-label={`Use ${colour}`} onClick={() => onChange(colour)} />)}
      </div>
    </div>
  );
}

function FontPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <span className="cms-label">{label}</span>
      <div className="cms-font-list">
        {FONT_OPTIONS.map((option) => (
          <button key={option.value} type="button" className={value === option.value ? "cms-font-option is-active" : "cms-font-option"} onClick={() => onChange(option.value)} aria-pressed={value === option.value}>
            <span className="cms-font-sample" style={{ fontFamily: option.stack }}>Travel beautifully</span>
            <span><strong>{option.label}</strong><small>{option.hint}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CmsThemeForm({ document }: { document: { id: string; status: CmsStatus; draft_data: Partial<CmsTheme>; updated_at: string | null; updated_by: string | null } }) {
  const initial = document.draft_data;
  const [theme, setTheme] = useState<CmsTheme>({
    ...DEFAULT_CMS_THEME, ...initial,
    colors: { ...DEFAULT_CMS_THEME.colors, ...initial.colors },
    typography: { ...DEFAULT_CMS_THEME.typography, ...initial.typography },
    buttons: { ...DEFAULT_CMS_THEME.buttons, ...initial.buttons },
    borderRadius: { ...DEFAULT_CMS_THEME.borderRadius, ...initial.borderRadius },
  });
  const [tab, setTab] = useState<"colours" | "typography" | "layout" | "preview">("colours");
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const c = theme.colors;

  function setColor(key: string, value: string) { setTheme((current) => ({ ...current, colors: { ...current.colors, [key]: value } })); }
  function setTypography(patch: Record<string, unknown>) { setTheme((current) => ({ ...current, typography: { ...current.typography, ...patch } })); }
  function setLayout(patch: Partial<CmsTheme>) { setTheme((current) => ({ ...current, ...patch })); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/cms/documents/${document.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: "Theme & appearance", slug: "global", data: theme }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setMessage({ text: "Theme draft saved. Publish it to apply the changes to the website.", tone: "success" });
      router.refresh();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Save failed.", tone: "error" });
    } finally { setBusy(false); }
  }

  function applyPreset(id: string) {
    const preset = THEME_PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setTheme((current) => ({
      ...current, ...structuredClone(preset.values), preset: id,
      colors: { ...current.colors, ...preset.values.colors },
      typography: { ...current.typography, ...preset.values.typography },
      buttons: { ...current.buttons, ...preset.values.buttons },
      borderRadius: { ...current.borderRadius, ...preset.values.borderRadius },
    }));
    setMessage({ text: `${preset.name} applied. Save and publish to make it live.`, tone: "success" });
  }

  const previewStyle = {
    backgroundColor: String(c.background ?? ""),
    color: String(c.foreground ?? ""),
    fontFamily: fontStack(theme.typography.bodyFont),
    "--pv-primary": String(c.primary ?? ""),
    "--pv-accent": String(c.accent ?? ""),
    "--pv-card": String(c.cardBackground ?? ""),
    "--pv-card-border": String(c.cardBorder ?? ""),
    "--pv-button": String(c.buttonBackground ?? ""),
    "--pv-button-text": String(c.buttonText ?? ""),
    "--pv-header": String(c.headerBackground ?? ""),
    "--pv-footer": String(c.footerBackground ?? ""),
    "--pv-card-radius": String(theme.borderRadius?.card ?? "0px"),
    "--pv-button-radius": theme.buttons?.style === "pill" ? "9999px" : String(theme.borderRadius?.button ?? "0px"),
    "--pv-container": String(theme.containerWidth ?? "1240px"),
  } as CSSProperties;

  return (
    <form onSubmit={save} style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
        <div>
          <h1 className="cms-page-title">Appearance &amp; theme</h1>
          <p className="cms-page-subtitle">Choose colours, fonts and shapes. Changes go live only after you publish.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={document.status === "published" ? "cms-badge cms-badge-success" : "cms-badge cms-badge-warning"}>{document.status === "published" ? "Live theme published" : "Draft not published"}</span>
          <button type="submit" disabled={busy} className="cms-btn cms-btn-primary">{busy ? "Saving…" : "Save draft"}</button>
        </div>
      </header>

      {message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

      <div className="cms-tabs" role="tablist" aria-label="Theme settings">
        {([["colours", "Colours"], ["typography", "Typography"], ["layout", "Shapes & layout"], ["preview", "Preview"]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "cms-tab is-active" : "cms-tab"} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === "colours" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Start with a preset</h2>
            <p className="cms-help" style={{ marginBottom: 14 }}>Pick a look, then fine-tune any colour below.</p>
            <div className="cms-preset-grid">
              {THEME_PRESETS.map((preset) => {
                const p = preset.values;
                return (
                  <button type="button" key={preset.id} className={theme.preset === preset.id ? "cms-preset-card is-active" : "cms-preset-card"} onClick={() => applyPreset(preset.id)}>
                    <span className="cms-preset-strip" style={{ background: `linear-gradient(90deg, ${p.colors?.primary ?? "#16271A"} 0 33%, ${p.colors?.accent ?? "#D49368"} 33% 66%, ${p.colors?.background ?? "#0C1617"} 66% 100%)` }} />
                    <strong>{preset.name}</strong>
                    <small>{preset.description}</small>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Website colours</h2>
            <p className="cms-help" style={{ marginBottom: 16 }}>Click a swatch to open the colour picker, or type a value if you have one.</p>
            <div className="cms-field-grid">
              {COLOR_FIELDS.map(([key, label]) => <ColorField key={key} label={label} value={String(c[key] ?? "")} onChange={(value) => setColor(key, value)} />)}
            </div>
          </section>
        </div>
      )}

      {tab === "typography" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Heading font</h2>
            <FontPicker label="Choose a heading style" value={String(theme.typography.headingFont ?? "serif")} onChange={(value) => setTypography({ headingFont: value })} />
          </section>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Body font</h2>
            <FontPicker label="Choose a body style" value={String(theme.typography.bodyFont ?? "sans")} onChange={(value) => setTypography({ bodyFont: value })} />
          </section>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Text size</h2>
            <div className="cms-field-grid">
              <label><span className="cms-label">Heading size</span><input className="cms-input" value={String(theme.typography.headingSize ?? "")} onChange={(e) => setTypography({ headingSize: e.target.value })} placeholder="3rem" /></label>
              <label><span className="cms-label">Body size</span><input className="cms-input" value={String(theme.typography.bodySize ?? "")} onChange={(e) => setTypography({ bodySize: e.target.value })} placeholder="1rem" /></label>
            </div>
            <p className="cms-help" style={{ marginTop: 10 }}>Use a size such as <code>3rem</code> or <code>18px</code>.</p>
          </section>
        </div>
      )}

      {tab === "layout" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Buttons &amp; cards</h2>
            <div className="cms-field-grid">
              <label><span className="cms-label">Button shape</span><select className="cms-input" value={theme.buttons?.style ?? "square"} onChange={(e) => setLayout({ buttons: { ...theme.buttons, style: e.target.value as "square" | "rounded" | "pill" } })}><option value="square">Square corners</option><option value="rounded">Softly rounded</option><option value="pill">Fully rounded</option></select></label>
              <label><span className="cms-label">Card style</span><select className="cms-input" value={theme.cardStyle ?? "bordered"} onChange={(e) => setLayout({ cardStyle: e.target.value as CmsTheme["cardStyle"] })}><option value="flat">Flat</option><option value="bordered">Bordered</option><option value="elevated">Elevated</option></select></label>
              <label><span className="cms-label">Button border width</span><input className="cms-input" value={theme.buttons?.borderWidth ?? ""} onChange={(e) => setLayout({ buttons: { ...theme.buttons, borderWidth: e.target.value } })} placeholder="1px" /></label>
              <label><span className="cms-label">Content width</span><input className="cms-input" value={theme.containerWidth ?? ""} onChange={(e) => setLayout({ containerWidth: e.target.value })} placeholder="1240px" /></label>
            </div>
          </section>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Corner rounding</h2>
            <div className="cms-field-grid">
              {([["card", "Cards"], ["button", "Buttons"], ["image", "Images"]] as const).map(([key, label]) => <label key={key}><span className="cms-label">{label}</span><input className="cms-input" value={String(theme.borderRadius?.[key] ?? "")} onChange={(e) => setLayout({ borderRadius: { ...theme.borderRadius, [key]: e.target.value } })} placeholder="0px" /></label>)}
            </div>
          </section>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Header options</h2>
            <div style={{ display: "grid", gap: 10 }}>
              <label className="cms-check"><input type="checkbox" checked={theme.headerAppearance?.sticky !== false} onChange={(e) => setLayout({ headerAppearance: { ...theme.headerAppearance, sticky: e.target.checked } })} /> Keep the header visible while scrolling</label>
              <label className="cms-check"><input type="checkbox" checked={theme.headerAppearance?.transparent !== false} onChange={(e) => setLayout({ headerAppearance: { ...theme.headerAppearance, transparent: e.target.checked } })} /> Transparent header until the page is scrolled</label>
            </div>
          </section>
        </div>
      )}

      {tab === "preview" && (
        <section className="cms-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <div><h2 className="cms-section-title">Live design preview</h2><p className="cms-help">An example of how your choices will look on the website.</p></div>
            <button type="button" disabled className="cms-btn cms-btn-secondary cms-btn-sm">Full preview after saving</button>
          </div>
          <div className="cms-theme-preview" style={previewStyle}>
            <div className="pv-header" style={{ backgroundColor: "var(--pv-header)" }}><strong>Your travel brand</strong><span>Home · Journeys · About · Contact</span></div>
            <div className="pv-hero">
              <p className="pv-eyebrow">Explore India &amp; Nepal</p>
              <h3 style={{ fontFamily: fontStack(theme.typography.headingFont), fontSize: `min(${theme.typography.headingSize || "3rem"}, 3rem)` }}>Journeys made for you</h3>
              <p>Discover tailor-made experiences across Himalayan valleys, heritage cities and wild landscapes.</p>
              <button type="button" style={{ backgroundColor: "var(--pv-button)", color: "var(--pv-button-text)", borderRadius: "var(--pv-button-radius)" }}>Explore journeys</button>
            </div>
            <div className="pv-cards">
              {["Himalayan treks", "Cultural journeys", "Wildlife & nature"].map((title) => <div key={title} className="pv-card" style={{ backgroundColor: "var(--pv-card)", borderColor: "var(--pv-card-border)", borderRadius: "var(--pv-card-radius)" }}><span style={{ color: "var(--pv-accent)" }}>✦</span><strong>{title}</strong><small>Thoughtfully planned, beautifully delivered.</small></div>)}
            </div>
            <div className="pv-footer" style={{ backgroundColor: "var(--pv-footer)" }}>© Your travel brand · All rights reserved</div>
          </div>
        </section>
      )}

      <details className="cms-card" style={{ padding: 14 }}>
        <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--cms-accent)" }}>Publishing &amp; version history</summary>
        <div style={{ marginTop: 12 }}><CmsWorkflow document={{ id: document.id, status: document.status, updatedAt: document.updated_at ?? undefined, updatedBy: document.updated_by ?? undefined }} allowDelete={false} /></div>
      </details>

      <button type="submit" disabled={busy} className="cms-btn cms-btn-primary">Save theme draft</button>
    </form>
  );
}
