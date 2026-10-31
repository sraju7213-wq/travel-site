# Phase 0 — Repository Baseline Audit

> **Reconciled 2026-10-28 (Phase 0).** This document records the *original* pre-implementation baseline and is now partly stale. Current reality: git is initialized on `main`; `node_modules` is installed; all 8 routes exist and build; 27/27 package images are present (only the houseboat image is missing). See `docs/current-state-checklist.md` for the authoritative current state. Do not treat the "missing route/image" lines below as live defects.

**Date:** 2026-10-27  
**Repo root:** `D:/ks world Adventure site` (app lives in `app/`)  
**Constraint honored:** No files modified in Phase 0.

## Stack & tooling

| Item | Finding |
|------|---------|
| Framework | Next.js 16.4.3, React 19.3.0, App Router |
| Styling | Tailwind CSS v4 (`@tailwindcss/turbopack`), CSS variables in `src/app/globals.css` |
| Language | TypeScript 5, strict mode, `@/*` path alias |
| Package manager | npm (package-lock.json present, node_modules installed) |
| Scripts | `dev`, `build`, `start`, `lint` only — **no test script** |
| Lint | ESLint 9 with `eslint-config-next` |
| Build output | `.next/` present (prior build ran) |
| Git | **Not initialized** — no repository history to preserve |
| AGENTS.md | Present; warns Next.js 16 has breaking APIs — read `node_modules/next/dist/docs/` before coding |

## Existing routes (App Router)

| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | Exists — homepage with hero, category tiles, featured packages, houseboat feature, tailor-made CTA |
| `/explore` | `src/app/explore/page.tsx` | Exists — searchable/filterable catalogue |
| `/explore/[category]` | `src/app/explore/[category]/page.tsx` | Exists — category-filtered catalogue |
| `/packages/[slug]` | — | **Referenced by PackageCard but does not exist** (broken link) |
| `/enquiry` | — | **Referenced in header/footer/CTAs but does not exist** |
| `/about` | — | **Referenced but does not exist** |
| `/contact` | — | **Referenced but does not exist** |
| `/houseboats` | — | **Referenced but does not exist** |

All navigation/CTA links point to routes that have no pages. These are the highest-impact broken behaviors.

## Components

| Component | File | Notes |
|-----------|------|-------|
| `SiteHeader` | `src/components/SiteHeader.tsx` | Sticky header, logo, desktop nav, mobile toggle, enquiry CTA |
| `MobileNav` | `src/components/MobileNav.tsx` | Full-height ivory drawer, body-scroll lock on open |
| `SiteFooter` | `src/components/SiteFooter.tsx` | Charcoal footer, link groups, enquiry CTA |
| `PackageCard` | `src/components/PackageCard.tsx` | Image + title + summary + duration + difficulty badge + "View itinerary"; references non-existent `/images/packages/${slug}.jpg` |
| `PackageGrid` | `src/components/PackageGrid.tsx` | Responsive 1–3 column grid, empty state |
| `SearchAndFilters` | `src/components/SearchAndFilters.tsx` | Client search + category/region/duration/activity/difficulty/sort filters, URL query state, filter pills, reset |

## Data layer

- `src/data/travel_packages_catalog.json` — 27 package records + 1 Kashmir houseboat booking service
- `src/data/catalogue.ts` — typed accessors: `getAllPackages`, `getPackageBySlug`, `getPackageByCode`, `getPackagesByCategory`, `getAllServices`, `getServiceBySlug`, `getCategories`, `getAllRegions`, `getAllDurations`, `searchPackages`
- `src/types/travel.ts` — `TravelPackage`, `AdditionalService`, `TravelCatalogue`, view models with computed `slug`, `difficultyVerified`, `hasReviewFlags`, `multiCountry`

### Data quality findings (from `travel_packages_catalog.json`)

| # | Issue | Packages affected |
|---|-------|-------------------|
| 1 | No `difficulty` is verified — every graded package carries "(as printed)" or conflicts | HE17, HE18, HE19, MTK20, MTK21, NA23, NA24, HE25, NA26, HE27 |
| 2 | Kathmandu–Pokhara duration conflicts between card/contents/itinerary | S05 |
| 3 | Golden Triangle code casing ambiguous (`ii7` vs `II7`) | II7 |
| 4 | Vale of Kashmir Trek duration conflicts (card vs itinerary) | MTK21 |
| 5 | Himalayan Combination / Nepal mini-trek badge vs Grade D conflict | NA23, HE25, HE27 |
| 6 | Contents page lists "Himalaya Enfield Motorbike Tour" but card is Kashmir Ski | KS22 |
| 7 | Nepal packages missing from contents page | NA23–NA27 |
| 8 | Generic inclusions/exclusions panel must not be auto-applied to every package | all (esp. IT14, IT15, IT16) |

`difficultyVerified` is `false` for every package (all difficulties are null or flagged). Per the brief, difficulty badges/filters must not be shown unless verified.

## Brand / design system

`docs/design-system.md` and `src/app/globals.css` define a coherent starting system:

- Forest `#16271A`, ivory `#F6F2E9`, charcoal `#252824`, brass `#B18A51`
- Inter (headings + body), Geist Mono
- Radii, shadows, spacing scale, image aspect ratios (hero 16:9, card 4:3, destination 3:2)
- Component variants and motion/reduced-motion rules
- Accessibility rules (contrast, focus, semantic HTML, alt text)

This is usable as the foundation; no competing design system exists.

## Assets

`public/` contains only `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — **no photography**. Two image references exist in code but the files do not exist:
- `/images/packages/${pkg.slug}.jpg` (27 package cards)
- `/images/services/kashmir-houseboat.jpg` (houseboat feature)

**Action needed:** create an image asset TODO/inventory; do not ship broken `` tags or hotlink reference-site imagery. Owner-approved or licensed India/Nepal photography is required before launch.

## Existing brand assets

- Logo mark: inline `IN` monogram in a forest square, wordmark "India Nepal Travel" — present in header/footer, should be preserved.
- Brochure: `Brochure.pdf` (33 MB, 8 pages) at repo root — factual source for package details.
- Briefs: `india-nepal-travel-web-app-brief.md`, `travel-webapp-ide-free-model-prompt.md` at repo root.

## Missing / unfinished work

1. Package detail pages (`/packages/[slug]`) — referenced, not built.
2. Enquiry flow — referenced throughout, no page, no form, no backend integration.
3. `/about`, `/contact`, `/houseboats` pages — linked, not built.
4. No test suite, no accessibility tooling, no Lighthouse config.
5. Images missing entirely.
6. No content-review flag mechanism exposed to editors; internal warnings live only in JSON `content_flags`.

## Highest-impact issues (Phase 0 baseline)

| Severity | Issue | Evidence |
|----------|-------|----------|
| P0 | Package cards link to `/packages/[slug]` which does not exist | `PackageCard.tsx:69,78` |
| P0 | Header/footer link to `/enquiry`, `/about`, `/contact`, `/houseboats` which do not exist | `SiteHeader.tsx:10-13,47`; `SiteFooter.tsx:6-10` |
| P0 | All 27 package images (`/images/packages/*.jpg`) missing | `PackageCard.tsx:36` |
| P0 | Houseboat image missing | `page.tsx:85` |
| P1 | Difficulty shown as unverified "as printed" on 10 packages | catalogue data |
| P1 | No enquiry backend/integration boundary defined | no route/page exists |
| P2 | No test suite or CI check beyond lint/build | `package.json` scripts |

## Preservation guidance

- Keep Next.js 16 + Tailwind v4 + TypeScript stack; do not swap framework.
- Keep `src/data/catalogue.ts` accessors and `travel_packages_catalog.json` as the single typed source of truth.
- Keep existing `IN` logo/wordmark and brand color tokens from `globals.css` / `design-system.md`.
- Keep existing working components (`PackageCard`, `PackageGrid`, `SearchAndFilters`, `SiteHeader`, `MobileNav`, `SiteFooter`) and reuse them in the redesign.
- Preserve current URLs `/`, `/explore`, `/explore/[category]`; add missing pages without breaking existing routes.

## Readiness for Phase 1

The audit is complete. Next: study https://www.wildernessdestinations.com/ at desktop and mobile, then write `docs/reference-site-analysis.md` (observed facts separated from suggestions), followed by `docs/modernization-plan.md`, then implement.