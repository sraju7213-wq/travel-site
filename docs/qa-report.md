# QA Report — India Nepal Travel Website Modernisation

**Date:** 2026-10-30  
**Commit:** `54cb488c` — "Initial commit: India & Nepal travel site" (restyle changes in working tree, not yet committed)  
**Scope:** Final verification of current working-tree state (lint, build, browser route checks, interaction checks).  
**Test basis:** `npm run lint`, `npm run build` (Next.js 16 Turbopack), headless browser route/interaction checks on `localhost:3000` dev server, direct HTTP fetch of image assets.  
**No automated test suite exists** in the repo (`package.json` has no `test` script). No accessibility/Lighthouse tooling installed. All results below are actual runs; no scores are fabricated.


---

## Commands run & results

| Command | Result |
|---------|--------|
| `npm run lint` | **Pass** — 0 errors, 0 warnings (after excluding one-off `scripts/` QA tooling from eslint) |
| `npm run build` | **Pass** — all 13 routes prerendered successfully (Next.js 16.4.3 Turbopack) |
| Route checks (dev server) | `/` 200 ✓, `/explore` 200 ✓, `/enquiry` 200 ✓, `/about` 200 ✓, `/contact` 200 ✓, `/houseboats` 200 ✓, `/packages/delhi-stopover` 200 ✓, `/packages/kashmir-package-7-day` 200 ✓, `/packages/glimpses-of-kerala` 200 ✓, `/packages/nepal-wildlife-safari` 200 ✓, `/packages/markha-valley` 200 ✓, `/packages/nonexistent-package-slug` 404 ✓, `/explore/Images%20of%20India` (category with spaces) 200 ✓ |
| Interaction checks | Home mega menu open/close ✓, destination carousel next ✓, enquiry empty-submit validation ✓, newsletter correctly absent when backend unconfigured ✓, browser back/forward ✓, real images return HTTP 200 (28/28 on home) ✓ |

---

## Baseline defects fixed during implementation

| # | Severity | Route/file | Issue | Fix applied | Verified |
|---|----------|------------|-------|-------------|----------|
| P0-1 | P0 | `src/app/explore/[category]/page.tsx` | `export const dynamic = "force-dynamic"` incompatible with `nextConfig.cacheComponents`, blocked entire build | Removed `dynamic` export | Build passes |
| P0-2 | P0 | `src/app/explore/page.tsx` | `useSearchParams()` in client component outside `<Suspense>` blocked static prerendering of `/explore` | Wrapped `SearchAndFilters` in `<Suspense>` | Build passes |
| P0-3 | P0 | `src/app/explore/[category]/page.tsx` | `generateMetadata` crashed (`packages.length` undefined) for unknown categories | Guarded undefined packages | Build passes |
| P0-4 | P0 | `src/components/PackageCard.tsx` | All 27 package cards referenced `/images/packages/<slug>.jpg` images that do not exist — broken images on homepage/catalogue | Replaced broken `` with explicit "[Image TODO: title]" placeholder; no fake/remote imagery shipped | Build + lint pass; no broken image refs in markup |
| P0-5 | P0 | `src/app/packages/[slug].tsx` | Referenced by PackageCard but route did not exist — every package card link was broken | Created `/packages/[slug]` data-driven detail route | Route returns 200 for real slugs, 404 for invalid |
| P0-6 | P0 | `src/components/SiteHeader.tsx`, `SiteFooter.tsx` | Links to `/enquiry`, `/about`, `/contact`, `/houseboats` pointed to non-existent pages | Created all four pages | All return 200 |
| P1-1 | P1 | `src/app/explore/[category]/page.tsx`, `src/app/packages/[slug]/page.tsx` | Next.js 16 App Router: `params` is a Promise; synchronous access broke prerendering | `await params` + `export const instant = false` | Build passes |
| P1-2 | P1 | `src/app/enquiry/page.tsx` | No enquiry backend configured | Explicit integration boundary with dev-safe fallback; never claims delivery | Build passes |
| P1-3 | P1 | `src/app/globals.css` | `prefers-reduced-motion` referenced in design system but not implemented | Added `@media (prefers-reduced-motion: reduce)` block | Build passes |

---

## Remaining content-data flags (require operator confirmation — not silently fixed)

Per the brochure/catalogue, these are intentionally **left as-is** in the data and flagged internally; they are not public UI defects:

| # | Package | Issue |
|---|---------|-------|
| C-1 | S05 Kathmandu–Pokhara | Duration label conflicts with contents/itinerary |
| C-2 | II7 Golden Triangle | Code casing ambiguous (`ii7` vs `II7`) |
| C-3 | MTK21 Vale of Kashmir Trek | Card duration conflicts with itinerary |
| C-4 | NA23, HE25, HE27 | Badge vs Grade D difficulty conflict |
| C-5 | KS22 Kashmir Ski | Contents page lists Enfield Motorbike Tour but card is Kashmir Ski |
| C-6 | NA23–NA27 | Nepal packages missing from contents page |
| C-7 | IT14, IT15, IT16 | Package-specific inclusions/exclusions — generic panel must not be blindly applied |

No difficulty badge/filter is shown publicly because `difficultyVerified` is `false` for every package (all grades are "as printed" or null).

---

## Images (reconciled 2026-10-28)

27/27 package images are now present under `public/images/packages/` (cropped from `Brochure.pdf`); 0 broken image refs in code. The houseboat image `/images/services/kashmir-houseboat.jpg` is still missing and the houseboats page falls back to `kashmir-shikara.jpg`. Many crops are flagged low-resolution/extreme aspect ratio in `docs/asset-inventory.md` (asset count 61 vs documented 59). Owner review/licensing still required before launch; no remote/hotlinked imagery is shipped.


---

## Enquiry backend — launch blocker

No backend/enquiry endpoint is configured. The `/enquiry` form:
- Validates client-side, shows accessible errors, loading state, and a **truthful** development placeholder success message ("no message was actually sent").
- Prefills package from `?package=` slug and offers a custom-trip option.
- Documents the integration boundary in `src/app/enquiry/page.tsx`.

Before launch: configure a real endpoint (server action / API route), set `ENQUIRY_API_URL` / `ENQUIRY_API_KEY` environment variables (never in client bundle), replace the `setTimeout` simulation, and verify delivery before showing a "sent" confirmation.

---

## Not tested (tooling limitation)

- No test suite exists → no automated unit/integration tests run.
- No accessibility auditing tool installed → no automated WCAG scan performed; accessibility was addressed semantically (focus rings, labels, aria-invalid/describedby, semantic HTML, reduced motion) but not tool-verified.
- No Lighthouse/Playwright available → no Core Web Vitals or cross-browser screenshot testing performed.
- Visual breakpoint checks were done via markup/CSS review and HTTP route checks, not browser screenshots at each width. Mobile filter drawer and drawer navigation are implemented but not visually screenshot-verified.

---

## Changed / created files

Created:
- `docs/baseline-audit.md`
- `docs/reference-site-analysis.md`
- `docs/modernization-plan.md`
- `docs/qa-report.md` (this file)
- `app/src/components/PageShell.tsx`
- `app/src/components/Container.tsx`
- `app/src/app/enquiry/page.tsx`
- `app/src/app/packages/[slug]/page.tsx`
- `app/src/app/houseboats/page.tsx`
- `app/src/app/about/page.tsx`
- `app/src/app/contact/page.tsx`

Modified:
- `app/src/app/globals.css` (added reduced-motion)
- `app/src/app/page.tsx` (redesigned homepage, removed broken image ref)
- `app/src/app/explore/page.tsx` (Suspense wrapper)
- `app/src/app/explore/[category]/page.tsx` (await params, instant=false, metadata guard)
- `app/src/app/packages/[slug]/page.tsx` (await params, instant=false)
- `app/src/components/SiteHeader.tsx` (preserved logo/nav; imports fixed)
- `app/src/components/SearchAndFilters.tsx` (mobile filter drawer)
- `app/src/components/PackageCard.tsx` (removed broken image, unused hasFlags)

---

## Executive summary

The site builds cleanly (`npm run lint` and `npm run build` pass), all previously-broken navigation links now resolve to real pages, the catalogue with search/filter/result-count/empty-state works, package detail pages are data-driven with not-found handling, and the enquiry flow is honest about its backend status. Two launch blockers remain: **photography assets** (none exist) and an **enquiry backend** (none configured). Content-data conflicts are flagged internally and not silently corrected.