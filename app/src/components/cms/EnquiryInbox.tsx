"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Enquiry = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  preferred_contact: string | null;
  package_slug: string | null;
  package_title: string | null;
  enquiry_type: string | null;
  travel_date: string | null;
  travellers: string | null;
  message: string | null;
  status: string | null;
  notes: string | null;
  submission_id: string | null;
  created_at: string | null;
};

const STATUSES = ["New", "In Review", "Quoted", "Confirmed", "Archived"];

const formatDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";

function statusTone(status?: string | null) {
  if (status === "New") return "cms-badge-info";
  if (status === "Confirmed") return "cms-badge-success";
  if (status === "Quoted") return "cms-badge-warning";
  if (status === "Archived") return "cms-badge-neutral";
  return "cms-badge-neutral";
}

function initials(name?: string | null) {
  return (name || "?").split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return <div className="cms-detail-item"><span className="cms-detail-label">{label}</span><span className="cms-detail-value">{value || "Not specified"}</span></div>;
}

export default function EnquiryInbox({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enquiries.filter((item) => {
      if (status !== "All" && item.status !== status) return false;
      if (!q) return true;
      return [item.full_name, item.email, item.package_title, item.submission_id].some((value) => value?.toLowerCase().includes(q));
    });
  }, [enquiries, query, status]);

  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function open(enquiry: Enquiry) { setSelected(enquiry); setNotes(enquiry.notes ?? ""); setMessage(null); }

  async function patch(id: string, changes: { status?: string; notes?: string }) {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/enquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...changes }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Update failed.");
      setEnquiries((current) => current.map((item) => item.id === id ? { ...item, ...result.enquiry } : item));
      if (selected?.id === id) setSelected((current) => current ? { ...current, ...result.enquiry } : current);
      setMessage({ text: "Enquiry updated.", tone: "success" });
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "Update failed.", tone: "error" });
    } finally { setBusy(false); }
  }

  function exportCsv() {
    const columns = ["submission_id", "created_at", "full_name", "email", "phone", "package_title", "enquiry_type", "travel_date", "travellers", "status", "message", "notes"] as const;
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const rows = [columns.join(","), ...filtered.map((item) => columns.map((column) => escape(String(item[column] ?? ""))).join(","))];
    const url = URL.createObjectURL(new Blob([rows.join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "enquiries.csv"; link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 className="cms-page-title">Enquiries</h1>
          <p className="cms-page-subtitle">Travel requests sent through the website. Update their status and add notes for your team.</p>
        </div>
        <button type="button" onClick={exportCsv} className="cms-btn cms-btn-secondary cms-btn-sm" disabled={!filtered.length}>Export CSV</button>
      </header>

      {!selected && message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

      <div className="cms-card" style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 14 }}>
        <input className="cms-input" style={{ maxWidth: 320 }} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email or package" aria-label="Search enquiries" />
        <select className="cms-input" style={{ maxWidth: 180 }} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <span className="cms-help" style={{ marginLeft: "auto", alignSelf: "center" }}>{filtered.length} of {enquiries.length} enquiries</span>
      </div>

      <div className="cms-card cms-enquiry-table">
        {filtered.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="cms-table">
              <thead><tr><th>Enquirer</th><th>Package</th><th>Received</th><th>Status</th><th><span className="cms-sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className={selected?.id === item.id ? "is-selected" : ""}>
                    <td><strong style={{ fontWeight: 600 }}>{item.full_name || "Unnamed enquiry"}</strong><span className="cms-help" style={{ display: "block" }}>{item.email}</span></td>
                    <td>{item.package_title || "General enquiry"}</td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(item.created_at)}</td>
                    <td><span className={`cms-badge ${statusTone(item.status)}`}>{item.status || "New"}</span></td>
                    <td style={{ textAlign: "right" }}><button type="button" className="cms-btn cms-btn-secondary cms-btn-sm" onClick={() => open(item)} aria-label={`Open enquiry from ${item.full_name || "unknown sender"}`}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="cms-empty">No enquiries match your filters.</p>}
      </div>

      {selected && (
        <div className="cms-drawer-root">
          <button type="button" className="cms-drawer-scrim" aria-label="Close enquiry" onClick={() => setSelected(null)} />
          <aside className="cms-drawer" role="dialog" aria-modal="true" aria-labelledby="enquiry-drawer-title">
            <div className="cms-drawer-header">
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <span className="cms-avatar" aria-hidden="true">{initials(selected.full_name)}</span>
                <div style={{ minWidth: 0 }}>
                  <p className="cms-help" style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10, fontWeight: 700 }}>Enquiry details</p>
                  <h2 id="enquiry-drawer-title" className="cms-drawer-title">{selected.full_name || "Unnamed enquiry"}</h2>
                </div>
              </div>
              <button ref={closeRef} type="button" className="cms-icon-btn" aria-label="Close enquiry" onClick={() => setSelected(null)}><span aria-hidden="true">×</span></button>
            </div>

            <div className="cms-drawer-body">
              {message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

              <div className="cms-drawer-hero">
                <span className={`cms-badge ${statusTone(selected.status)}`}>{selected.status || "New"}</span>
                {selected.submission_id && <span className="cms-drawer-ref">Ref {selected.submission_id}</span>}
              </div>

              <section className="cms-detail-section">
                <h3 className="cms-detail-heading">At a glance</h3>
                <div className="cms-detail-grid">
                  <DetailItem label="Received" value={formatDate(selected.created_at)} />
                  <DetailItem label="Package" value={selected.package_title || "General enquiry"} />
                  <DetailItem label="Type" value={selected.enquiry_type || "Enquiry"} />
                  <DetailItem label="Travel date" value={selected.travel_date} />
                  <DetailItem label="Travellers" value={selected.travellers} />
                  <DetailItem label="Preferred contact" value={selected.preferred_contact} />
                </div>
              </section>

              <section className="cms-detail-section">
                <h3 className="cms-detail-heading">Contact</h3>
                <div className="cms-detail-contact">
                  {selected.email && <a className="cms-contact-link" href={`mailto:${selected.email}`}><span aria-hidden="true">✉</span>{selected.email}</a>}
                  {selected.phone && <a className="cms-contact-link" href={`tel:${selected.phone}`}><span aria-hidden="true">☎</span>{selected.phone}</a>}
                  {!selected.email && !selected.phone && <p className="cms-help">No contact details were provided.</p>}
                </div>
              </section>

              {selected.message && (
                <section className="cms-detail-section">
                  <h3 className="cms-detail-heading">Message from the traveller</h3>
                  <blockquote className="cms-message-quote">{selected.message}</blockquote>
                </section>
              )}

              <section className="cms-detail-section">
                <label htmlFor="enquiry-notes" className="cms-detail-heading">Internal notes</label>
                <p className="cms-help" style={{ marginBottom: 8 }}>Only your team sees these notes.</p>
                <textarea id="enquiry-notes" className="cms-input" rows={5} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add a note for your team" />
                <button type="button" disabled={busy || notes === (selected.notes ?? "")} onClick={() => void patch(selected.id, { notes })} className="cms-btn cms-btn-primary cms-btn-sm" style={{ marginTop: 10 }}>Save notes</button>
              </section>
            </div>

            <div className="cms-drawer-footer">
              <div style={{ flex: 1 }}>
                <label htmlFor="enquiry-status" className="cms-label" style={{ marginBottom: 4 }}>Status — saves automatically</label>
                <select id="enquiry-status" className="cms-input" value={selected.status ?? "New"} disabled={busy} onChange={(e) => void patch(selected.id, { status: e.target.value })}>
                  {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <button type="button" className="cms-btn cms-btn-secondary" onClick={() => setSelected(null)}>Done</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
