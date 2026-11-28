"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type CmsUserView = {
  id: string;
  email: string;
  role: "admin" | "developer";
  isActive: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
};

const formatDate = (value?: string | null) =>
  value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) + " UTC" : "Never";

function initials(email: string) {
  return email.split("@")[0]?.slice(0, 2).toUpperCase() || "?";
}

export default function UsersManager({ initialUsers, currentUserId }: { initialUsers: CmsUserView[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [drawer, setDrawer] = useState<"create" | "password" | null>(null);
  const [target, setTarget] = useState<CmsUserView | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "developer">("admin");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const sorted = useMemo(() => [...users].sort((a, b) => a.email.localeCompare(b.email)), [users]);

  useEffect(() => {
    if (!drawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [drawer]);

  function close() { setDrawer(null); setTarget(null); setPassword(""); setEmail(""); setRole("admin"); }
  function openCreate() { setMessage(null); setTarget(null); setEmail(""); setPassword(""); setRole("admin"); setDrawer("create"); }
  function openPassword(user: CmsUserView) { setMessage(null); setTarget(user); setPassword(""); setDrawer("password"); }

  async function request(body: Record<string, unknown>, method: "POST" | "PATCH" | "DELETE", success: string) {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/users", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The request could not be completed.");
      setMessage({ text: success, tone: "success" });
      return result;
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : "The request could not be completed.", tone: "error" });
      return null;
    } finally { setBusy(false); }
  }

  async function createUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await request({ email, password, role }, "POST", `${email} can now sign in.`);
    if (result?.user) {
      setUsers((current) => [...current, { id: result.user.id, email: result.user.email, role: result.user.role, isActive: true, createdAt: new Date().toISOString(), lastSignInAt: null }]);
      close();
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!target) return;
    const result = await request({ userId: target.id, password }, "PATCH", `Password updated for ${target.email}.`);
    if (result) close();
  }

  async function patchUser(user: CmsUserView, changes: { role?: "admin" | "developer"; isActive?: boolean }) {
    const result = await request({ userId: user.id, ...changes }, "PATCH", "Access updated.");
    if (result) setUsers((current) => current.map((item) => item.id === user.id ? { ...item, ...changes } : item));
  }

  async function removeUser(user: CmsUserView) {
    if (!window.confirm(`Remove ${user.email} from the website CMS? Their sign-in will be deleted.`)) return;
    const result = await request({ userId: user.id }, "DELETE", `${user.email} was removed.`);
    if (result) setUsers((current) => current.filter((item) => item.id !== user.id));
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 className="cms-page-title">Users &amp; permissions</h1>
          <p className="cms-page-subtitle">Add team members, change their role and remove access. Only developers can manage accounts.</p>
        </div>
        <button type="button" onClick={openCreate} className="cms-btn cms-btn-primary">Add user</button>
      </header>

      {message && !drawer && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}

      <div className="cms-card" style={{ overflow: "hidden" }}>
        {sorted.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="cms-table cms-users-table">
              <thead><tr><th>User</th><th>Role</th><th>Access</th><th>Added</th><th>Last sign in</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
              <tbody>
                {sorted.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="cms-avatar" style={{ width: 32, height: 32, borderRadius: 9, fontSize: 11 }} aria-hidden="true">{initials(user.email)}</span>
                        <span><strong style={{ fontWeight: 600 }}>{user.email}</strong>{user.id === currentUserId && <span className="cms-help" style={{ display: "block" }}>You</span>}</span>
                      </div>
                    </td>
                    <td>{user.id === currentUserId ? <span className={user.role === "developer" ? "cms-badge cms-badge-warning" : "cms-badge cms-badge-info"}>{user.role === "developer" ? "Developer" : "Administrator"}</span> : <select className="cms-input" style={{ minWidth: 140, padding: "6px 8px", fontSize: 13 }} value={user.role} disabled={busy} onChange={(e) => void patchUser(user, { role: e.target.value as "admin" | "developer" })}><option value="admin">Administrator</option><option value="developer">Developer</option></select>}</td>
                    <td><label className="cms-check"><input type="checkbox" checked={user.isActive} disabled={busy || user.id === currentUserId} onChange={(e) => void patchUser(user, { isActive: e.target.checked })} /> {user.isActive ? "Active" : "Disabled"}</label></td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(user.createdAt)}</td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--cms-muted)" }}>{formatDate(user.lastSignInAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                        <button type="button" className="cms-btn cms-btn-ghost cms-btn-sm" title="Reset password" disabled={busy} onClick={() => openPassword(user)}>Reset</button>
                        <button type="button" className="cms-btn cms-btn-danger cms-btn-sm" title="Remove user" disabled={busy || user.id === currentUserId} onClick={() => void removeUser(user)}>Remove</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="cms-empty">No CMS users found.</p>}
      </div>

      {drawer && (
        <div className="cms-drawer-root">
          <button type="button" className="cms-drawer-scrim" aria-label="Close" onClick={close} />
          <aside className="cms-drawer" role="dialog" aria-modal="true" aria-labelledby="user-drawer-title">
            <div className="cms-drawer-header">
              <div>
                <p className="cms-help" style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10, fontWeight: 700 }}>User access</p>
                <h2 id="user-drawer-title" className="cms-drawer-title">{drawer === "create" ? "Add a team member" : "Reset password"}</h2>
              </div>
              <button ref={closeRef} type="button" className="cms-icon-btn" aria-label="Close" onClick={close}><span aria-hidden="true">×</span></button>
            </div>
            <form onSubmit={drawer === "create" ? createUser : resetPassword} style={{ display: "contents" }}>
              <div className="cms-drawer-body">
                {message && <p role="status" className={message.tone === "success" ? "cms-notice cms-notice-success" : "cms-notice cms-notice-error"}>{message.text}</p>}
                {drawer === "create" ? (
                  <>
                    <div><label htmlFor="new-user-email" className="cms-label">Email address</label><input id="new-user-email" className="cms-input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" /><p className="cms-help" style={{ marginTop: 6 }}>This is the username they will use to sign in.</p></div>
                    <div><label htmlFor="new-user-password" className="cms-label">Password</label><input id="new-user-password" className="cms-input" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
                    <div><label htmlFor="new-user-role" className="cms-label">Role</label><select id="new-user-role" className="cms-input" value={role} onChange={(e) => setRole(e.target.value as "admin" | "developer")}><option value="admin">Administrator — manages content</option><option value="developer">Developer — full access including appearance</option></select></div>
                  </>
                ) : (
                  <>
                    <p className="cms-help">Set a new password for <strong>{target?.email}</strong>. Share it with them securely.</p>
                    <div><label htmlFor="reset-password" className="cms-label">New password</label><input id="reset-password" className="cms-input" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></div>
                  </>
                )}
              </div>
              <div className="cms-drawer-footer">
                <button type="button" className="cms-btn cms-btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" disabled={busy} className="cms-btn cms-btn-primary" style={{ marginLeft: "auto" }}>{busy ? "Saving…" : drawer === "create" ? "Create user" : "Update password"}</button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
