# Security Audit — KS World Adventure (India & Nepal travel site)

**Date:** 2026-11-04
**Target:** `D:\ks world Adventure site` (Next.js 16.4.3 app in `app/`)
**Repository:** https://github.com/sraju7213-wq/travel-site — **public**
**Method:** Source review (`app/src`, `next.config.ts`, env layout, git history), dependency audit (`npm audit`), and one read-only REST probe against the project's Supabase instance. No write operations or exploitation were performed. The deployed URL recorded in `PHASE9_SIGNOFF.md` (`india-nepal-travel.vercel.app`) returns 404, so no live HTTP testing was possible.

**Overall risk: CRITICAL** — enquiry PII is readable without authentication, and the admin gate is publicly bypassable.

---

## Executive summary

1. The Supabase anon key (public by design, embedded in the client bundle and in the public repo) can **read every enquiry row**. A read-only probe returned `content-range: */7` for `enquiries`, and the same result for `full_name`, `email`, `phone`, and `message` columns. That is a confirmed unauthenticated PII disclosure.
2. The `/admin` dashboard authenticates **entirely in the browser** against a hardcoded password committed to a **public GitHub repository**. The gate is bypassable by reading source or by setting one `sessionStorage` key. The dashboard then reads and writes PII using the same public anon client.
3. No security headers are configured (no CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

Everything below is ordered by exploitability.

---

## Findings

### C1 — Unauthenticated read of enquiry PII via Supabase anon key (Critical)

**Evidence**

- `app/src/lib/supabaseClient.ts:3-6` hardcodes the Supabase URL and anon key as fallbacks.
- The same key is shipped to every browser (it is `NEXT_PUBLIC_` and used by `app/src/app/admin/page.tsx:11`).
- Read-only request, made with that key and no other auth:

  ```
  GET /rest/v1/enquiries?select=email&limit=0
  Prefer: count=exact
  → 206  content-range: */7
  ```

  Repeated for `full_name`, `phone`, `message` — same `*/7`. The `newsletters` probe returned an empty result; that is indistinguishable from RLS filtering an empty table, so only `enquiries` exposure is confirmed.

**Impact:** Names, emails, phone numbers, travel dates, party sizes and free-text messages of all travel enquiries are readable by anyone who opens DevTools, clones the public repo, or hits the REST endpoint. This is a GDPR/UK-GDPR personal-data breach exposure, not a theoretical one.

**Cause:** Row Level Security is either disabled on `enquiries` or has a permissive `anon` SELECT policy. Nothing in the repo configures RLS.

**Fix**

```sql
alter table public.enquiries enable row level security;
alter table public.newsletters enable row level security;

-- No anon SELECT/UPDATE/DELETE. Inserts only through a server route using the service role,
-- or a narrow anon INSERT policy if direct client inserts are ever required:
-- create policy "anon can insert enquiries" on public.enquiries
--   for insert to anon with check (true);  -- tighten checks in production
```

Then remove anon access from every read path and verify with the same probe (expect `*/0` or 401). Rotate the anon key once RLS is verified, on the assumption the current key has been scraped.

---

### C2 — Admin authentication is client-side, hardcoded, and public (Critical)

**Evidence**

- `app/src/app/admin/page.tsx:201` — `const ADMIN_PASSWORD = "…"` (plaintext, in the client bundle).
- `app/src/app/admin/page.tsx:373-380` — "logged in" is `sessionStorage.getItem("admin_auth_token") === "raju_authenticated"`.
- `app/src/app/admin/page.tsx:425-431` — password compared in the browser.
- The password is present in git history across several commits and the repository is public (`private=false`).
- Admin reads/writes go through the public anon client (`page.tsx:453, 510, 525`), so the "login" protects nothing: the data is reachable without it.

**Impact:** Any visitor can open `/admin`, view source, and obtain working credentials; or skip the form entirely by setting `sessionStorage.admin_auth_token`. Combined with C1, admin login is cosmetic.

**Fix**

1. Delete the client-side password; move auth server-side.
2. Use a real identity provider: Supabase Auth (email/password or magic link) or an equivalent, with `httpOnly`, `Secure`, `SameSite=Lax` cookies — never `sessionStorage` flags.
3. Protect `/admin` (and its data APIs) with middleware/server checks; admin reads/writes must run in server code with the service-role key and an authorization check, not the anon client.
4. Rotate the exposed password; assume it is compromised permanently even after removal (public history).
5. Optionally purge from history (filter-repo/BFG + force push), but treat rotation as mandatory, purging as cosmetic.

---

### H1 — Write access via anon likely open; not verified (High)

The anon role can `SELECT` `enquiries`. Whether `INSERT`/`UPDATE`/`DELETE` are also permitted was **not tested** (write tests were out of scope). Given no RLS configuration exists in the repo, assume all grants are open until proven otherwise.

**Impact if open:** anyone can alter enquiry status/notes, delete records, or forge enquiries; `updateEnquiryStatus`/`saveEnquiryNotes` in the admin UI would be callable directly through PostgREST.

**Fix:** Inspect `select * from pg_policies where schemaname='public';` and table grants. Revoke `update, delete` from `anon`/`authenticated`; keep writes server-only. Re-test with a filtered UPDATE against a non-existent UUID only after confirming policies.

---

### H2 — Missing security headers (Medium)

`app/next.config.ts` has no `headers()` block. `poweredByHeader: false` is set (good), but there is no CSP, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or HSTS. The site is clickjackable and has no XSS blast-radius reduction.

**Fix (example)**

```ts
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https://images.pexels.com https://*.cloudflarestream.com; frame-src https://maps.google.com https://*.cloudflarestream.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'" },
    ],
  }];
}
```

Prefer a nonce-based CSP (Next middleware) rather than `'unsafe-inline'` for scripts; GSAP and the maps/video embeds are the constraints to check.

---

### M1 — Unauthenticated, unthrottled newsletter write endpoint (Medium)

`app/src/app/api/newsletter/route.ts` — `POST` has no rate limiting, no CSRF/origin check, and performs an **upsert on `email`**, so a request can overwrite the name/country/consent of an existing subscriber. The endpoint is not referenced by any UI (`grep` found no client caller), so it is dead public attack surface.

**Fix:** delete the route if unused, or add auth + rate limiting + double opt-in; replace `upsert` with `insert ... on conflict do nothing` unless an authenticated update path is intended.

---

### M2 — Rate limiting and dedupe are per-instance and spoofable (Medium)

`app/src/app/api/enquiry/route.ts:11-47`

- `seenSubmissions` and `rateLimitMap` are process memory. On Vercel/serverless they reset per instance and do not coordinate, so limits are easily bypassed by concurrency.
- Both maps are unbounded between expiry sweeps (keyed by attacker-supplied `submissionId`/IP) — memory-pressure vector.
- Client IP is taken from the first `x-forwarded-for` entry (`:60-63`); trust depends on the hosting proxy. Prefer the platform-provided client IP and do not trust attacker-supplied XFF chains.
- `submissionId` is not format-checked or length-capped (`:106`); dedupe keys can be arbitrarily large strings.

**Fix:** move rate limiting to a shared store (Upstash Redis/Vercel KV), cap map sizes and key lengths, validate `submissionId` as a UUID, and key limits on a trusted IP plus a per-email counter.

---

### M3 — CSV formula injection in admin export (Medium)

`app/src/app/admin/page.tsx:338-357` quotes and doubles quotes but does not neutralise cells beginning with `=`, `+`, `-`, or `@`. Enquiry messages are attacker-controlled and are exported into a spreadsheet.

**Impact:** an enquiry containing `=HYPERLINK(...)` or `=cmd|...` can execute when staff open the CSV in Excel/LibreOffice (formula injection; mitigation bypassable only by that app's warnings).

**Fix:** prefix risky cells with `'` or a tab before quoting:

```ts
const safe = (v: string) => (/^[=+\-@]/.test(v) ? `'${v}` : v);
```

Also strip control characters.

---

### M4 — Server "admin" client silently falls back to anon (Medium)

`app/src/lib/supabaseClient.ts:15-20` returns the anon client when `SUPABASE_SERVICE_ROLE_KEY` is missing. `app/.env.local` does not define it, so local (and possibly production) writes run as `anon`, relying on permissive RLS to function.

`isSupabaseConfigured` (`:8-11`) is always `true` because of the hardcoded fallbacks, so the UI reports "Concierge Intake Active" and the privacy notice claims PostgreSQL storage even when no service-role path exists.

**Fix:** fail closed in server code (`if (!serviceRoleKey) throw`), remove hardcoded URL/key fallbacks, and make the "configured" flag reflect a real, tested backend connection.

---

### M5 — Admin writes ignore Supabase errors (Low/Medium)

`app/src/app/admin/page.tsx:509-513, 524-528` await `update()` but discard `{ error }` (try/catch never fires on RLS denials). The UI applies optimistic state and shows success while the write fails.

**Fix:** check `error` and roll back optimistic state; surface failures.

---

### M6 — Admin page is public, indexable, and linked from the public footer (Low)

`app/src/app/admin/page.tsx` has no `robots` metadata, no `robots.txt`, and `app/src/components/SiteFooter.tsx:82` links "Admin Portal". Search engines can index `/admin`; the login page advertises itself.

**Fix:** add `robots.txt` disallow for `/admin`, `metadata.robots = { index: false }` (via a server layout for the route), and drop the footer link.

---

### M7 — Privacy notice overstates technical safeguards (Low)

`app/src/app/privacy/page.tsx:67` states submissions are stored in a "secure PostgreSQL database … hosted on Supabase" and access is restricted to authenticated operators. Given C1/C2 and the missing service-role key, the "restricted access" claim is not currently true.

**Fix:** make the notice conditional on actual configuration, and only claim what is implemented.

---

### L1 — `target="_blank"` without `rel` (Low)

`app/src/components/EnquiryForm.tsx:724` opens `/privacy` in a new tab without `rel="noopener noreferrer"`. Modern browsers imply `noopener`, but add it for consistency; internal link could simply open in the same tab.

---

### L2 — Newsletter logs the full error object (Low)

`app/src/app/api/newsletter/route.ts:51` logs the raw error. PostgREST errors can include request hints; log `error.code`/`message` only, as the enquiry route already does.

---

### L3 — Minor information exposure (Info)

- `app/src/app/api/enquiry/route.ts:145` returns the inserted row `id` to the client; omit it.
- The anon JWT expires in 2036 (`exp` 2109008614) — long-lived; rotate after RLS is enforced.
- Honeypot rejection returns a distinct generic 400; acceptable.

---

## Passes / good practice observed

- **No SQL injection surface:** Supabase builder APIs are parameterised; no raw SQL in app code.
- **No DOM XSS sinks:** no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or `new Function` in `app/src`; React escaping covers admin-rendered message text.
- **No SSRF:** the only server-side outbound fetch uses env-configured URLs with fixed timeouts, not request input.
- **Secrets hygiene in git:** `.env*` is ignored at both roots. Every JWT-shaped string in every revision was decoded: the only one is the `anon`-role key. No service-role key, cloud key, or private key exists in the working tree or history (the password in C2 is the sole credential leak).
- **Response hygiene:** generic error bodies; database errors are logged by code/name, not echoed.
- **Validation:** shared allow-list validation with length caps for every field on both client and server; honeypot on both forms; payload `Content-Length` cap; 10 s upstream timeout; `poweredByHeader` disabled; image remote pattern restricted to `images.pexels.com`.
- **Dependencies:** `npm audit` — **0 production vulnerabilities**; 16 moderate advisories are dev-only (eslint/minimatch DoS), not shipped to runtime. Next 16.4.3, React 19.3.0 and Supabase JS have no current advisories.

---

## Remediation order

1. **Enable RLS and revoke anon reads** on `enquiries` and `newsletters` (C1). Re-run the probe; expect no rows.
2. **Replace admin auth** with server-side sessions and service-role data access (C2); rotate the password now.
3. **Verify INSERT/UPDATE/DELETE policies** (H1).
4. **Add security headers** (H2).
5. Remove or lock down the newsletter endpoint (M1); add shared rate limiting and UUID validation (M2).
6. Sanitise CSV export (M3); fail-closed Supabase admin client (M4); surface write errors (M5).
7. De-index admin (M6); correct the privacy notice (M7); small fixes (L1-L3).

---

*Read-only probe only: the audit did not read or reproduce any row content, and made no writes. The deployed URL from the repo docs was unreachable (404), so all checks were against the local checkout and the Supabase REST API.*
