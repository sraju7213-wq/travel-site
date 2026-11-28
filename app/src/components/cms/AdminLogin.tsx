"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      const next = searchParams.get("next");
      router.replace(next?.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
      <div>
        <label htmlFor="email" className="cms-label">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required disabled={busy} className="cms-input" />
      </div>
      <div>
        <label htmlFor="password" className="cms-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required disabled={busy} className="cms-input" />
      </div>
      {error && <p role="alert" className="cms-notice cms-notice-error">{error}</p>}
      <button disabled={busy} type="submit" className="cms-btn cms-btn-primary" style={{ width: "100%", padding: "12px 16px" }}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="cms-help" style={{ textAlign: "center" }}>Access is limited to authorised team members. There is no public registration.</p>
    </form>
  );
}
