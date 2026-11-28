"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_COLUMNS } from "@/data/siteContent";
import BrandMark from "./BrandMark";
import { useCms } from "@/components/cms/CmsProvider";
import { safeCmsHref } from "@/lib/safeCmsHref";

export default function SiteFooter() {
  const [openColumn, setOpenColumn] = useState<number | null>(null);
  const { settings, theme } = useCms();
  const footer = settings.footer;
  const contact = settings.contact;
  const cmsColumns = (settings.navigation.footerColumns ?? []).filter((column) => column.visible !== false).map((column) => ({ ...column, links: column.links.filter((link) => link.visible !== false) }));
  const columns = cmsColumns.length ? cmsColumns : FOOTER_COLUMNS;
  const social = settings.social.filter((item) => item.visible !== false && item.url);
  const phone = contact.phone || contact.phoneMobile || contact.phoneLandline || "";
  const whatsapp = contact.whatsapp ? `https://wa.me/${String(contact.whatsapp).replace(/\D/g, "")}` : "";
  if (footer.visible === false) return null;

  return <footer className="mt-auto border-t border-white/10 bg-[var(--cms-footer-background,#0C1617)] text-white" style={{ backgroundColor: String(theme.footerAppearance?.background ?? theme.colors.footerBackground ?? "var(--cms-footer-background,#0C1617)") }}>
    <div aria-hidden="true" className="h-px w-full bg-gradient-to-r from-transparent via-wild-orange/60 to-transparent" />
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_2.4fr] lg:gap-10">
        <div className="max-w-sm"><BrandMark variant="footer" className="mb-4" /><p className="text-xs font-sans font-light leading-relaxed text-white/70 md:text-sm">{String(footer.description ?? "")}</p>
          <address className="mt-4 space-y-1 text-xs not-italic text-white/60">{contact.bookingDeskName && <p>{String(contact.bookingDeskName)}</p>}{contact.address && <p>{String(contact.address)}</p>}{phone && <p><a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a></p>}{contact.email && <p><a href={`mailto:${contact.email}`}>{String(contact.email)}</a></p>}{whatsapp && <p><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {String(contact.whatsapp)}</a></p>}</address>
          {footer.showSocial !== false && social.length > 0 && <nav aria-label="Social media" className="mt-4 flex flex-wrap gap-3 text-xs">{social.map((item) => <a key={`${item.platform}-${item.url}`} href={safeCmsHref(item.url)} target="_blank" rel="noopener noreferrer" className="rounded border border-white/15 px-2 py-1 hover:text-wild-orange">{item.label || item.platform}</a>)}</nav>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">{columns.map((col, i) => { const isOpen = openColumn === i; const panelId = `footer-${i}`; return <div key={col.title}><h2><button type="button" onClick={() => setOpenColumn(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId} className="flex min-h-[44px] w-full items-center justify-between border-b border-white/10 py-3 text-left text-[11px] font-accent font-semibold uppercase tracking-[0.24em] text-white/90 lg:hidden">{col.title}<span aria-hidden="true" className={`text-base text-wild-orange transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span></button><span className="hidden border-b border-white/10 pb-3 text-[11px] font-accent font-semibold uppercase tracking-[0.24em] text-white/90 lg:block">{col.title}</span></h2><ul id={panelId} className={`mt-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out lg:mt-4 ${isOpen ? "block" : "hidden"} lg:block`}>{col.links.map((link) => <li key={`${col.title}-${link.label}`}><Link href={safeCmsHref(link.href)} className="inline-flex min-h-[44px] items-center text-sm font-sans text-white/70 transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange lg:min-h-0">{link.label}</Link></li>)}</ul></div>; })}</div>
      </div>
      {(settings.trustBadges?.length ?? 0) > 0 && <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">{settings.trustBadges?.filter((badge) => badge.visible !== false).map((badge) => <span key={badge.title} className="rounded border border-white/10 px-2 py-1 text-xs text-white/60" title={badge.description}>{badge.title}</span>)}</div>}
      <div className="mt-8 border-t border-white/10 pt-4"><p className="text-center font-sans text-[11px] text-white/45">{String(footer.copyright ?? "")}{footer.credit ? <> {" · "}<a href={safeCmsHref(String(footer.creditHref ?? "#"))} target="_blank" rel="noopener noreferrer" className="font-medium text-white/70 underline-offset-4 hover:text-wild-orange hover:underline">{String(footer.credit)}</a></> : null}</p></div>
    </div>
  </footer>;
}
