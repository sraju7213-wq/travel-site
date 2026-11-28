"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

type NavItem = { href: string; label: string; icon: string; developer?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "grid" }] },
  {
    label: "Website",
    items: [
      { href: "/admin/homepage", label: "Website Builder", icon: "layout" },
      { href: "/admin/pages", label: "Pages", icon: "file" },
      { href: "/admin/destinations", label: "Destinations", icon: "pin" },
      { href: "/admin/packages", label: "Tour Packages", icon: "bag" },
      { href: "/admin/media", label: "Media Library", icon: "image" },
    ],
  },
  {
    label: "Business",
    items: [
      { href: "/admin/operations", label: "Enquiries", icon: "mail" },
      { href: "/admin/testimonials", label: "Testimonials", icon: "quote" },
      { href: "/admin/faqs", label: "FAQs", icon: "help" },
      { href: "/admin/banners", label: "Promotions", icon: "megaphone" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Website Settings", icon: "settings" },
      { href: "/admin/theme", label: "Appearance & Theme", icon: "palette", developer: true },
      { href: "/admin/users", label: "Users & Permissions", icon: "users", developer: true },
      { href: "/admin/drafts", label: "Drafts & History", icon: "history" },
    ],
  },
];

const PATHS: Record<string, string> = {
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  layout: "M3 4h18v16H3zM3 9h18M9 9v11",
  file: "M6 3h8l4 4v14H6zM14 3v5h4M9 13h6M9 17h6",
  pin: "M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bag: "M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  quote: "M7 7h5v5H7zM14 12h3v5h-3zM10 12c0 3-2 5-5 5",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 4 2c-.9.7-1.5 1.2-1.5 2.5M12 17h.01",
  megaphone: "M4 10v4h3l8 5V5L7 10zM18 9a4 4 0 0 1 0 6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-4l-.3 3.1a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.3 3.1h4l.3-3.1a7 7 0 0 0 1.7-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z",
  palette: "M12 21a9 9 0 1 1 0-18c5 0 9 3.6 9 8 0 2.2-1.8 4-4 4h-1.5a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 21zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01M17.5 10.5h.01",
  users: "M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l4 2",
};

function NavIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? PATHS.grid} />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavList({ role, pathname, onNavigate }: { role: "admin" | "developer"; pathname: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV.map((group) => [group.label, group.items.some((item) => isActive(pathname, item.href))])),
  );

  return (
    <nav aria-label="CMS navigation" className="cms-nav">
      {NAV.map((group) => {
        const items = group.items.filter((item) => !item.developer || role === "developer");
        if (!items.length) return null;
        const expanded = open[group.label] !== false || items.some((item) => isActive(pathname, item.href));
        return (
          <div key={group.label} className="cms-nav-group">
            <button type="button" className="cms-nav-group-label" aria-expanded={expanded} onClick={() => setOpen((current) => ({ ...current, [group.label]: !expanded }))}>
              <span>{group.label}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={expanded ? "cms-chevron is-open" : "cms-chevron"}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {expanded && (
              <div className="cms-nav-items">
                {items.map((item) => (
                  <Link key={item.href} href={item.href} onClick={onNavigate} className={isActive(pathname, item.href) ? "cms-nav-link is-active" : "cms-nav-link"} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                    <NavIcon name={item.icon} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function AdminShell({ role, children }: { role: "admin" | "developer"; children: ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("cms-theme");
    if (saved === "dark" || saved === "light") queueMicrotask(() => setTheme(saved));
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    window.localStorage.setItem("cms-theme", next);
  }

  return (
    <div className="cms-ui cms-shell" data-theme={theme}>
      <aside className={menuOpen ? "cms-sidebar is-open" : "cms-sidebar"}>
        <div className="cms-sidebar-brand">
          <Link href="/admin" onClick={() => setMenuOpen(false)}>
            <span className="cms-brand-mark">KS</span>
            <span><strong>Website CMS</strong><small>Content manager</small></span>
          </Link>
          <button type="button" className="cms-icon-btn cms-sidebar-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <NavList role={role} pathname={pathname} onNavigate={() => setMenuOpen(false)} />
        <div className="cms-sidebar-footer">
          <span className="cms-badge cms-badge-neutral">{role === "developer" ? "Developer" : "Administrator"}</span>
          <form action="/api/admin/auth/logout" method="post"><button type="submit" className="cms-btn cms-btn-ghost cms-btn-sm">Sign out</button></form>
        </div>
      </aside>

      {menuOpen && <button type="button" aria-label="Close menu" className="cms-scrim" onClick={() => setMenuOpen(false)} />}

      <div className="cms-main">
        <header className="cms-topbar">
          <button type="button" className="cms-icon-btn cms-menu-toggle" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
          <div className="cms-topbar-title">Website management</div>
          <div className="cms-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="cms-btn cms-btn-ghost cms-btn-sm">View website</a>
            <button type="button" className="cms-icon-btn" aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"} onClick={toggleTheme}>
              {theme === "light" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              )}
            </button>
          </div>
        </header>
        <div className="cms-content">{children}</div>
      </div>
    </div>
  );
}
