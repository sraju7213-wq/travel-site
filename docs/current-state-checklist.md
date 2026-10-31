# Current-State Checklist — India Nepal Travel Website

**Reconciled:** 2026-10-28 (Phase 0). Source of truth for the current clone; supersedes stale "missing route/image" findings in `docs/baseline-audit.md`.

## Stack & tooling (actual)
- Next.js 16.4.3, React 19.3.0, App Router, TypeScript 5 strict, Tailwind v4 (`@tailwindcss/turbopack`), CSS variables
- npm; `node_modules` installed; `.next/` present; git initialized on `main` (commit `54cb488`)
- Scripts: `dev`, `build`, `start`, `lint` only — no test script
- AGENTS.md warns Next.js 16 breaking APIs; read `node_modules/next/dist/docs/` before coding

## Implemented routes (all present, build passes)
| Route | File | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | 200 |
| `/explore` | `src/app/explore/page.tsx` | 200 |
| `/explore/[category]` | `src/app/explore/[category]/page.tsx` | 200 |
| `/packages/[slug]` | `src/app/packages/[slug]/page.tsx` | 200 (real slugs), 404 (invalid) |
| `/enquiry` | `src/app/enquiry/page.tsx` | 200 |
| `/about` | `src/app/about/page.tsx` | 200 |
| `/contact` | `src/app/contact/page.tsx` | 200 |
| `/houseboats` | `src/app/houseboats/page.tsx` | 200 |

## Source-of-truth files
- `app/src/data/travel_packages_catalog.json` — 27 packages + 1 Kashmir houseboat service
- `app/src/data/catalogue.ts` — typed accessors
- `app/src/data/siteContent.ts` — editorial/homepage content
- `app/public/images/manifest.json` — image crop manifest
- `app/public/images/SOURCES.md` — image source/licence notes

## Package/service counts
- Packages: 27 (Stopovers 6, Images of India 7, India Tours 3, Himalayan Expeditions 3, Mini Trek in Kashmir 3, Nepal Adventure 5)
- Services: 1 (Kashmir houseboat booking)
- Packages with `content_flags`: 19

## Image status
- 27/27 package images present at `/images/packages/<slug>.jpg`
- 21 static image refs in code; 0 missing
- Houseboat image `/images/services/kashmir-houseboat.jpg` — MISSING (houseboats page uses `kashmir-shikara.jpg`)
- Quality risk: many crops flagged low-resolution/extreme aspect ratio in `docs/asset-inventory.md` (asset-inventory claims 59 rasters; actual count 61 files)
- No favicons/social share images defined

## Uncertain data (content_flags — retained, not silently changed)
C-1 S05 Kathmandu–Pokhara duration conflict; C-2 II7 code casing; C-3 MTK21 Vale of Kashmir Trek duration; C-4 NA23/HE25/HE27 grade conflict; C-5 KS22 contents vs card; C-6 NA23–NA27 missing from contents; C-7 IT14/IT15/IT16 inclusions/exclusions must stay package-specific.
- `difficultyVerified` is false for every package (no difficulty badge/filter shown)
- Phase 5 added 7 further flags where the brochure scan is partial (I12 Days 3/6, I15 Day 11, HE19 day count, NA25 duplicate stage, NA23 anchor days only, HE18 trek length, I10 six printed days vs seven).

## Programme data (Phase 5)
- All 27 packages now carry a brochure-transcribed `itinerary` (day-by-day programme).
- 7 packages carry package-scoped `inclusions`; 2 carry `exclusions`. The generic brochure panel is deliberately not applied to packages whose flags forbid it.
- Transcribed via `app/scripts/add_brochure_itineraries.py` (idempotent); root `travel_packages_catalog.json` mirrors `app/src/data/travel_packages_catalog.json`.

## Real gaps (not stale findings)
1. Enquiry endpoint not configured — `/api/enquiry` returns 503 `not_configured` and the UI states plainly that nothing was transmitted. Configure `ENQUIRY_API_URL` / `ENQUIRY_API_KEY` (server-side only).
2. Newsletter list not configured — the newsletter section is hidden from the homepage entirely and `/api/newsletter` returns 503.
3. Privacy notice and final consent wording not yet approved by the operator (see `docs/launch-readiness.md`).
4. Houseboat image missing
5. Image quality/resolution (low-res crops)
6. No test suite / accessibility tooling / Lighthouse
7. No contact details supplied (do not invent)

## Enquiry / newsletter integration (Phase 6)
- `app/src/app/api/enquiry/route.ts` — POST only. Server-side validation, honeypot, duplicate `submissionId` rejection (10-min window), package resolved server-side, bearer token from `ENQUIRY_API_KEY`. Success only on upstream 2xx.
- `app/src/app/api/newsletter/route.ts` — same pattern with `NEWSLETTER_API_URL` / `NEWSLETTER_API_KEY`.
- `app/src/lib/enquiryValidation.ts` — shared client/server validation (no env access).
- `app/src/components/EnquiryForm.tsx` — client form; journey select over all 27 packages plus tailor-made; date/flexible-dates, traveller count, consent checkbox; no success state without a confirmed server response.
- Verified by direct HTTP: 200 (mock upstream), 400 (validation + honeypot), 409 (duplicate), 502 (upstream down), 503 (unconfigured). 0 env values in the client bundle.

## Actual checks run
- `npm run lint` — pass, 0 errors, 0 warnings
- `npm run build` — pass, 13 routes (11 pages + `/api/enquiry` + `/api/newsletter`)
- Dev server `http://localhost:3000` — running; `/`, `/about`, `/contact`, `/enquiry`, `/explore`, `/packages/[slug]`, `/houseboats` return 200; `/packages/no-such-package` returns 404 with the designed not-found page
- API checks: `/api/enquiry` → 200 / 400 (validation) / 400 (honeypot) / 409 (duplicate) / 502 (upstream down) / 503 (unconfigured); `/api/newsletter` → 200 / 503
- No TypeScript errors (build includes tsc)

## Notes
- `docs/baseline-audit.md`, `docs/modernization-plan.md`, `docs/qa-report.md` contained stale "missing route/image" findings; annotated/refreshed 2026-10-28.
- Prompt file corrected: `gggg.pdf` → `Brochure.pdf`.
