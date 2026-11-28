"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CmsCta, CmsSettings, CmsStatus } from "@/types/cms";
import { DEFAULT_CMS_SETTINGS } from "@/lib/cmsDefaults";
import MediaPicker from "@/components/cms/MediaPicker";
import CmsSeoFields from "@/components/cms/CmsSeoFields";
import CmsWorkflow from "@/components/cms/CmsWorkflow";

type NavLink = CmsCta & { description?: string; image?: string; visible?: boolean; group?: string };
type NavGroup = NonNullable<CmsSettings["navigation"]["groups"]>[number];
type FooterColumn = NonNullable<CmsSettings["navigation"]["footerColumns"]>[number];
const clone = <T,>(value: T): T => structuredClone(value);

function Field({ label, value, onChange, placeholder, wide = false }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; wide?: boolean }) {
  return <label className={wide ? "cms-field-wide" : undefined}><span className="cms-label">{label}</span><input className="cms-input" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="cms-check"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /> {label}</label>;
}

function RowActions({ onUp, onDown, onRemove }: { onUp: () => void; onDown: () => void; onRemove: () => void }) {
  return <div className="cms-row-actions">
    <button type="button" className="cms-icon-btn" aria-label="Move up" title="Move up" onClick={onUp}><span aria-hidden="true">↑</span></button>
    <button type="button" className="cms-icon-btn" aria-label="Move down" title="Move down" onClick={onDown}><span aria-hidden="true">↓</span></button>
    <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove" title="Remove" onClick={onRemove}><span aria-hidden="true">×</span></button>
  </div>;
}

function move<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export default function CmsSettingsForm({ document, developer = false }: { document: { id: string; status: CmsStatus; draft_data: Partial<CmsSettings>; updated_at: string | null; updated_by: string | null }; developer?: boolean }) {
  const initial = document.draft_data;
  const [settings, setSettings] = useState<CmsSettings>({
    ...DEFAULT_CMS_SETTINGS, ...initial,
    branding: { ...DEFAULT_CMS_SETTINGS.branding, ...initial.branding },
    contact: { ...DEFAULT_CMS_SETTINGS.contact, ...initial.contact },
    navigation: { ...DEFAULT_CMS_SETTINGS.navigation, ...initial.navigation },
    footer: { ...DEFAULT_CMS_SETTINGS.footer, ...initial.footer },
    announcement: { ...DEFAULT_CMS_SETTINGS.announcement, ...initial.announcement },
    social: initial.social ?? [],
    seo: { ...DEFAULT_CMS_SETTINGS.seo, ...initial.seo },
  });
  const [tab, setTab] = useState<"general" | "navigation" | "footer" | "promotion">("general");
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  function set<K extends keyof CmsSettings>(key: K, value: CmsSettings[K]) { setSettings((current) => ({ ...current, [key]: value })); }
  function setBranding(key: string, value: unknown) { set("branding", { ...settings.branding, [key]: value }); }
  function setContact(key: string, value: unknown) { set("contact", { ...settings.contact, [key]: value }); }
  function setNav(key: string, value: unknown) { set("navigation", { ...settings.navigation, [key]: value }); }

  function updateNav(key: string, items: unknown[], index: number, patch: Record<string, unknown>) {
    const next = clone(items) as Record<string, unknown>[];
    next[index] = { ...next[index], ...patch };
    setNav(key, next);
  }
  function updateGroup(index: number, patch: Partial<NavGroup>, groups: NavGroup[]) {
    const next = clone(groups);
    next[index] = { ...next[index], ...patch };
    setNav("groups", next);
  }
  function updateGroupLink(index: number, linkIndex: number, patch: Record<string, unknown>, groups: NavGroup[]) {
    const next = clone(groups);
    next[index].links[linkIndex] = { ...next[index].links[linkIndex], ...patch };
    setNav("groups", next);
  }
  function updateFooterColumn(index: number, patch: Partial<FooterColumn>, columns: FooterColumn[]) {
    const next = clone(columns);
    next[index] = { ...next[index], ...patch };
    setNav("footerColumns", next);
  }
  function updateFooterLink(index: number, linkIndex: number, patch: Record<string, unknown>, columns: FooterColumn[]) {
    const next = clone(columns);
    next[index].links[linkIndex] = { ...next[index].links[linkIndex], ...patch };
    setNav("footerColumns", next);
  }
  function setFooter(key: string, value: unknown) { set("footer", { ...settings.footer, [key]: value }); }
  function setAnnouncement(key: string, value: unknown) { set("announcement", { ...settings.announcement, [key]: value }); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage(null);
    try {
      const response = await fetch(`/api/cms/documents/${document.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: settings.branding.name, slug: "global", data: settings }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setMessage({ text: "Website settings saved. Publish them to update the live website.", tone: "success" });
      router.refresh();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Save failed.", tone: "error" });
    } finally { setBusy(false); }
  }

  const nav = settings.navigation;
  const headerLinks = (nav.headerLinks ?? []) as NavLink[];
  const groups = nav.groups ?? [];
  const footerColumns = nav.footerColumns ?? [];
  const tabs: Array<{ id: typeof tab; label: string }> = [
    { id: "general", label: "General" },
    ...(developer ? [{ id: "navigation" as const, label: "Navigation" }] : []),
    { id: "footer", label: "Footer" },
    { id: "promotion", label: "Promotion & SEO" },
  ];

  return (
    <form onSubmit={save} style={{ display: "grid", gap: 20 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>
        <div>
          <h1 className="cms-page-title">Website settings</h1>
          <p className="cms-page-subtitle">Manage the name, contact details, navigation and search information for your website.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={document.status === "published" ? "cms-badge cms-badge-success" : "cms-badge cms-badge-warning"}>{document.status === "published" ? "Settings published" : "Draft not published"}</span>
          <button type="submit" disabled={busy} className="cms-btn cms-btn-primary">{busy ? "Saving…" : "Save draft"}</button>
        </div>
      </header>

      {message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

      <div className="cms-tabs" role="tablist" aria-label="Website settings sections">
        {tabs.map((item) => <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "cms-tab is-active" : "cms-tab"} onClick={() => setTab(item.id)}>{item.label}</button>)}
      </div>

      {tab === "general" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Branding</h2>
            <div className="cms-field-grid" style={{ marginTop: 14 }}>
              <Field label="Website name" value={String(settings.branding.name ?? "")} onChange={(value) => setBranding("name", value)} />
              <Field label="Short name" value={String(settings.branding.shortName ?? "")} onChange={(value) => setBranding("shortName", value)} />
              <Field label="Tagline" value={String(settings.branding.tagline ?? "")} onChange={(value) => setBranding("tagline", value)} wide />
              {developer && <>
                <Field label="Operator name" value={String(settings.branding.operatorName ?? "")} onChange={(value) => setBranding("operatorName", value)} />
                <Field label="Header logo alt text" value={String(settings.branding.headerLogoAlt ?? "")} onChange={(value) => setBranding("headerLogoAlt", value)} />
                <Field label="Footer logo alt text" value={String(settings.branding.footerLogoAlt ?? "")} onChange={(value) => setBranding("footerLogoAlt", value)} />
              </>}
            </div>
            <div className="cms-field-grid" style={{ marginTop: 18 }}>
              <MediaPicker label="Header logo" value={String(settings.branding.headerLogo ?? "")} onChange={(asset) => setBranding("headerLogo", asset?.publicUrl ?? "")} />
              <MediaPicker label="Footer logo" value={String(settings.branding.footerLogo ?? "")} onChange={(asset) => setBranding("footerLogo", asset?.publicUrl ?? "")} />
              {developer && <>
                <MediaPicker label="Favicon" value={String(settings.branding.favicon ?? "")} onChange={(asset) => setBranding("favicon", asset?.publicUrl ?? "")} />
                <MediaPicker label="Social sharing image" value={String(settings.branding.socialImage ?? "")} onChange={(asset) => setBranding("socialImage", asset?.publicUrl ?? "")} />
              </>}
            </div>
          </section>

          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Contact information</h2>
            <p className="cms-help" style={{ margin: "6px 0 14px" }}>These details appear in the header, footer and contact page.</p>
            <div className="cms-field-grid">
              <Field label="Booking desk" value={String(settings.contact.bookingDeskName ?? "")} onChange={(value) => setContact("bookingDeskName", value)} />
              <Field label="Primary phone" value={String(settings.contact.phone ?? "")} onChange={(value) => setContact("phone", value)} />
              <Field label="Mobile phone" value={String(settings.contact.phoneMobile ?? "")} onChange={(value) => setContact("phoneMobile", value)} />
              <Field label="Landline" value={String(settings.contact.phoneLandline ?? "")} onChange={(value) => setContact("phoneLandline", value)} />
              <Field label="WhatsApp number" value={String(settings.contact.whatsapp ?? "")} onChange={(value) => setContact("whatsapp", value)} />
              <Field label="Email address" value={String(settings.contact.email ?? "")} onChange={(value) => setContact("email", value)} />
              <Field label="Alternate email" value={String(settings.contact.alternateEmail ?? "")} onChange={(value) => setContact("alternateEmail", value)} />
              <Field label="Opening hours" value={String(settings.contact.hours ?? "")} onChange={(value) => setContact("hours", value)} />
              <Field label="Map URL" value={String(settings.contact.mapUrl ?? "")} onChange={(value) => setContact("mapUrl", value)} />
              <Field label="Address" value={String(settings.contact.address ?? "")} onChange={(value) => setContact("address", value)} wide />
            </div>
          </section>

          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Social media links</h2>
            <p className="cms-help" style={{ margin: "6px 0 14px" }}>Add the profiles you want visitors to see. Hidden links stay saved but are not displayed.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {settings.social.map((social, index) => (
                <div key={index} className="cms-repeat-row">
                  <input className="cms-input" value={social.platform} onChange={(event) => { const next = clone(settings.social); next[index] = { ...next[index], platform: event.target.value }; set("social", next); }} placeholder="Platform" aria-label="Platform" />
                  <input className="cms-input" value={social.label ?? ""} onChange={(event) => { const next = clone(settings.social); next[index] = { ...next[index], label: event.target.value }; set("social", next); }} placeholder="Label" aria-label="Label" />
                  <input className="cms-input" value={social.url} onChange={(event) => { const next = clone(settings.social); next[index] = { ...next[index], url: event.target.value }; set("social", next); }} placeholder="https://…" aria-label="URL" />
                  <Check label="Visible" checked={social.visible !== false} onChange={(checked) => { const next = clone(settings.social); next[index] = { ...next[index], visible: checked }; set("social", next); }} />
                  <RowActions onUp={() => set("social", move(settings.social, index, -1))} onDown={() => set("social", move(settings.social, index, 1))} onRemove={() => set("social", settings.social.filter((_, i) => i !== index))} />
                </div>
              ))}
              {!settings.social.length && <p className="cms-empty">No social links yet.</p>}
            </div>
            <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 12 }} onClick={() => set("social", [...settings.social, { platform: "", url: "", label: "", visible: true }])}>Add social link</button>
          </section>
        </div>
      )}

      {tab === "navigation" && developer && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Header menu</h2>
            <p className="cms-help" style={{ margin: "6px 0 14px" }}>The order here is the order visitors see.</p>
            <div style={{ display: "grid", gap: 10 }}>
              {headerLinks.map((link, index) => (
                <div key={index} className="cms-repeat-row">
                  <input className="cms-input" value={link.label ?? ""} onChange={(e) => updateNav("headerLinks", headerLinks, index, { label: e.target.value })} placeholder="Label" aria-label="Link label" />
                  <input className="cms-input" value={link.href ?? ""} onChange={(e) => updateNav("headerLinks", headerLinks, index, { href: e.target.value })} placeholder="/journeys" aria-label="Link destination" />
                  <input className="cms-input" value={link.group ?? ""} onChange={(e) => updateNav("headerLinks", headerLinks, index, { group: e.target.value })} placeholder="Dropdown group id" aria-label="Dropdown group id" />
                  <Check label="Visible" checked={link.visible !== false} onChange={(checked) => updateNav("headerLinks", headerLinks, index, { visible: checked })} />
                  <RowActions onUp={() => setNav("headerLinks", move(headerLinks, index, -1))} onDown={() => setNav("headerLinks", move(headerLinks, index, 1))} onRemove={() => setNav("headerLinks", headerLinks.filter((_, i) => i !== index))} />
                </div>
              ))}
              {!headerLinks.length && <p className="cms-empty">No header links yet.</p>}
            </div>
            <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 12 }} onClick={() => setNav("headerLinks", [...headerLinks, { label: "", href: "", visible: true }])}>Add header link</button>

            <h3 className="cms-section-title" style={{ marginTop: 24 }}>Header button</h3>
            <div className="cms-field-grid" style={{ marginTop: 12 }}>
              <Field label="Button text" value={String(nav.headerCta?.label ?? "")} onChange={(value) => setNav("headerCta", { ...(nav.headerCta ?? {}), label: value })} />
              <Field label="Button link" value={String(nav.headerCta?.href ?? "")} onChange={(value) => setNav("headerCta", { ...(nav.headerCta ?? {}), href: value })} />
            </div>
          </section>

          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Dropdown groups</h2>
            <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
              {groups.map((group, index) => (
                <fieldset key={group.id ?? index} className="cms-inset">
                  <legend className="cms-section-title">Group {index + 1}</legend>
                  <div className="cms-field-grid">
                    <Field label="Stable id" value={group.id} onChange={(value) => updateGroup(index, { id: value }, groups)} />
                    <Field label="Label" value={group.label} onChange={(value) => updateGroup(index, { label: value }, groups)} />
                    <Field label="Note" value={group.note ?? ""} onChange={(value) => updateGroup(index, { note: value }, groups)} />
                    <Check label="Visible" checked={group.visible !== false} onChange={(checked) => updateGroup(index, { visible: checked }, groups)} />
                  </div>
                  <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                    {group.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="cms-repeat-row">
                        <input className="cms-input" value={link.label ?? ""} onChange={(e) => updateGroupLink(index, linkIndex, { label: e.target.value }, groups)} placeholder="Link label" aria-label="Link label" />
                        <input className="cms-input" value={link.href ?? ""} onChange={(e) => updateGroupLink(index, linkIndex, { href: e.target.value }, groups)} placeholder="URL" aria-label="URL" />
                        <input className="cms-input" value={link.description ?? ""} onChange={(e) => updateGroupLink(index, linkIndex, { description: e.target.value }, groups)} placeholder="Description" aria-label="Description" />
                        <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove link" onClick={() => updateGroup(index, { links: group.links.filter((_, i) => i !== linkIndex) }, groups)}><span aria-hidden="true">×</span></button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => updateGroup(index, { links: [...group.links, { label: "", href: "" }] }, groups)}>Add link</button>
                    <button type="button" className="cms-btn cms-btn-danger cms-btn-sm" onClick={() => setNav("groups", groups.filter((_, i) => i !== index))}>Remove group</button>
                  </div>
                </fieldset>
              ))}
              {!groups.length && <p className="cms-empty">No dropdown groups yet.</p>}
            </div>
            <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 12 }} onClick={() => setNav("groups", [...groups, { id: `group-${Date.now()}`, label: "", note: "", links: [] }])}>Add dropdown group</button>
          </section>
        </div>
      )}

      {tab === "footer" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Footer content</h2>
            <div className="cms-field-grid" style={{ marginTop: 14 }}>
              <Field label="Footer description" value={String(settings.footer.description ?? "")} onChange={(value) => setFooter("description", value)} wide />
              <Field label="Copyright text" value={String(settings.footer.copyright ?? "")} onChange={(value) => setFooter("copyright", value)} />
              <Field label="Developed-by credit" value={String(settings.footer.credit ?? "")} onChange={(value) => setFooter("credit", value)} />
              <Field label="Credit link" value={String(settings.footer.creditHref ?? "")} onChange={(value) => setFooter("creditHref", value)} />
              <Check label="Show social links in the footer" checked={settings.footer.showSocial !== false} onChange={(checked) => setFooter("showSocial", checked)} />
            </div>
          </section>
          {developer && (
            <section className="cms-card" style={{ padding: 20 }}>
              <h2 className="cms-section-title">Footer columns</h2>
              <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                {footerColumns.map((column, index) => (
                  <fieldset key={index} className="cms-inset">
                    <legend className="cms-section-title">Column {index + 1}</legend>
                    <Field label="Column title" value={column.title} onChange={(value) => updateFooterColumn(index, { title: value }, footerColumns)} />
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      {column.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="cms-repeat-row">
                          <input className="cms-input" value={link.label ?? ""} onChange={(e) => updateFooterLink(index, linkIndex, { label: e.target.value }, footerColumns)} placeholder="Label" aria-label="Link label" />
                          <input className="cms-input" value={link.href ?? ""} onChange={(e) => updateFooterLink(index, linkIndex, { href: e.target.value }, footerColumns)} placeholder="URL" aria-label="URL" />
                          <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove link" onClick={() => updateFooterColumn(index, { links: column.links.filter((_, i) => i !== linkIndex) }, footerColumns)}><span aria-hidden="true">×</span></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => updateFooterColumn(index, { links: [...column.links, { label: "", href: "" }] }, footerColumns)}>Add link</button>
                      <button type="button" className="cms-btn cms-btn-danger cms-btn-sm" onClick={() => setNav("footerColumns", footerColumns.filter((_, i) => i !== index))}>Remove column</button>
                    </div>
                  </fieldset>
                ))}
                {!footerColumns.length && <p className="cms-empty">No footer columns yet.</p>}
              </div>
              <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 12 }} onClick={() => setNav("footerColumns", [...footerColumns, { title: "", links: [] }])}>Add footer column</button>
            </section>
          )}
        </div>
      )}

      {tab === "promotion" && (
        <div style={{ display: "grid", gap: 18 }}>
          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Promotional announcement</h2>
            <div style={{ margin: "12px 0 14px" }}><Check label="Show a site-wide announcement" checked={settings.announcement.visible === true} onChange={(checked) => setAnnouncement("visible", checked)} /></div>
            <div className="cms-field-grid">
              <Field label="Announcement text" value={String(settings.announcement.text ?? "")} onChange={(value) => setAnnouncement("text", value)} wide />
              <Field label="Link" value={String(settings.announcement.href ?? "")} onChange={(value) => setAnnouncement("href", value)} />
              <Field label="Button label" value={String(settings.announcement.ctaLabel ?? "")} onChange={(value) => setAnnouncement("ctaLabel", value)} />
            </div>
          </section>

          {developer && (
            <section className="cms-card" style={{ padding: 20 }}>
              <h2 className="cms-section-title">Trust badges</h2>
              <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                {(settings.trustBadges ?? []).map((badge, index) => (
                  <div key={index} className="cms-repeat-row">
                    <input className="cms-input" value={badge.title} onChange={(e) => patchBadge(index, { title: e.target.value }, settings, set)} placeholder="Badge title" aria-label="Badge title" />
                    <input className="cms-input" value={badge.description ?? ""} onChange={(e) => patchBadge(index, { description: e.target.value }, settings, set)} placeholder="Description" aria-label="Description" />
                    <Check label="Visible" checked={badge.visible !== false} onChange={(checked) => patchBadge(index, { visible: checked }, settings, set)} />
                    <button type="button" className="cms-icon-btn cms-icon-btn-danger" aria-label="Remove badge" onClick={() => set("trustBadges", (settings.trustBadges ?? []).filter((_, i) => i !== index))}><span aria-hidden="true">×</span></button>
                  </div>
                ))}
                {!settings.trustBadges?.length && <p className="cms-empty">No trust badges yet.</p>}
              </div>
              <button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" style={{ marginTop: 12 }} onClick={() => set("trustBadges", [...(settings.trustBadges ?? []), { title: "", description: "", visible: true }])}>Add trust badge</button>
            </section>
          )}

          <section className="cms-card" style={{ padding: 20 }}>
            <h2 className="cms-section-title">Search &amp; social sharing</h2>
            {developer && (
              <div className="cms-field-grid" style={{ marginTop: 14 }}>
                <Field label="Website URL" value={String(settings.siteUrl ?? settings.seo?.siteUrl ?? "")} onChange={(value) => { set("siteUrl", value); set("seo", { ...settings.seo, siteUrl: value }); }} />
                <Field label="Site name" value={String(settings.seo?.siteName ?? settings.branding.name)} onChange={(value) => set("seo", { ...settings.seo, siteName: value })} />
              </div>
            )}
            <div style={{ marginTop: 14 }}><CmsSeoFields seo={settings.seo ?? {}} onChange={(seo) => set("seo", seo)} developer={developer} /></div>
          </section>
        </div>
      )}

      <details className="cms-card" style={{ padding: 14 }}>
        <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--cms-accent)" }}>Publishing &amp; version history</summary>
        <div style={{ marginTop: 12 }}>
          <CmsWorkflow document={{ id: document.id, status: document.status, updatedAt: document.updated_at ?? undefined, updatedBy: document.updated_by ?? undefined }} allowDelete={false} />
        </div>
      </details>

      <button type="submit" disabled={busy} className="cms-btn cms-btn-primary">Save draft</button>
    </form>
  );
}

function patchBadge(index: number, patch: Record<string, unknown>, settings: CmsSettings, set: <K extends keyof CmsSettings>(key: K, value: CmsSettings[K]) => void) {
  const next = clone(settings.trustBadges ?? []);
  next[index] = { ...next[index], ...patch };
  set("trustBadges", next);
}
