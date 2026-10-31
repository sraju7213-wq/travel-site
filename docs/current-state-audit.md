# Current-State Audit — India Nepal Travel Website

**Date:** 2026-10-30  
**Commit:** `54cb488c` — "Initial commit: India & Nepal travel site"  
**Checkout:** `D:/ks world Adventure site/app` (repo root `D:/ks world Adventure site`)  
**Purpose:** Record confirmed facts about the live checkout before any redesign. Separates confirmed code facts, observed reference patterns, and items needing owner confirmation. No UI redesign is performed in this phase.

---

## Confirmed current code facts

### Stack & tooling (verified live)

| Item | Fact |
|------|------|
| Framework | Next.js 16.4.3 (Turbopack), React 19.3.0, App Router, TypeScript 5 strict |
| Styling | Tailwind CSS v4 (`@tailwindcss/turbopack`), CSS variables in `src/app/globals.css` |
| Package manager | npm; `package-lock.json` present; `node_modules` installed |
| Scripts | `dev`, `build`, `start`, `lint` only — **no test script** |
| Lint | ESLint 9 with `eslint-config-next`; `scripts/` tooling excluded from lint |
| Git | Initialized on `main`, one commit (`54cb488`), working tree has uncommitted restyle changes |
| AGENTS.md | Present; warns Next.js 16 breaking APIs |

### Lint/build (re-run fresh on this checkout)

| Command | Result |
|---------|--------|
| `npm run lint` | Pass — 0 errors, 0 warnings |
| `npm run build` | Pass — 13 routes (11 pages + 2 API routes), TypeScript clean, ~14s |

### Route tree (all present, build passes)

| Route | File | Status |
|-------|------|--------|
| `/` | `src/app/page.tsx` | Static, 200 |
| `/_not-found` | `src/app/not-found.tsx` | Static, 404 |
| `/about` | `src/app/about/page.tsx` | Static, 200 |
| `/contact` | `src/app/contact/page.tsx` | Static, 200 |
| `/enquiry` | `src/app/enquiry/page.tsx` | Dynamic SSR, 200 |
| `/api/enquiry` | `src/app/api/enquiry/route.ts` | Dynamic POST, 503 when unconfigured |
| `/api/newsletter` | `src/app/api/newsletter/route.ts` | Dynamic POST, 503 when unconfigured |
| `/explore` | `src/app/explore/page.tsx` | Static, 200 |
| `/explore/[category]` | `src/app/explore/[category]/page.tsx` | Partial prerender, dynamic segment |
| `/houseboats` | `src/app/houseboats/page.tsx` | Static, 200 |
| `/packages/[slug]` | `src/app/packages/[slug]/page.tsx` | Partial prerender, 200 real slugs / 404 invalid |

### Data layer (single source of truth)

- `src/data/travel_packages_catalog.json` — 27 packages + 1 service (`kashmir-houseboat-booking`)
- `src/data/catalogue.ts` — typed accessors: `getAllPackages`, `getPackageBySlug`, `getPackageByCode`, `getPackagesByCategory`, `getAllServices`, `getServiceBySlug`, `getCategories`, `getAllRegions`, `getAllDurations`, `searchPackages`
- `src/data/siteContent.ts` — editorial/homepage content (destinations, experiences, pillars, stats, promises, nav categories, footer columns)
- `src/types/travel.ts` — `TravelPackage`, `AdditionalService`, `TravelCatalogue`, view models

### Package / service counts (verified from JSON)

| Category | Count |
|----------|-------|
| Stopovers | 6 |
| Images of India | 7 |
| India Tours | 3 |
| Himalayan Expeditions | 3 |
| Mini Trek in Kashmir | 3 |
| Nepal Adventure | 5 |
| **Total packages** | **27** |
| Additional services | 1 (Kashmir houseboat booking) |
| Packages with `content_flags` | 19 |

### Palette actually used in `globals.css` (verified)

| Token | CSS var | Value | Role |
|-------|---------|-------|------|
| background | `--color-background` | `#F6F2E9` | Page background |
| foreground | `--color-foreground` | `#252824` | Default text |
| forest | `--color-forest` | `#16271A` | Primary nav, primary buttons |
| forest-soft | `--color-forest-soft` | `#1F3A2E` | Secondary forest surfaces |
| ivory | `--color-ivory` | `#F6F2E9` | Main page background |
| ivory-soft | `--color-ivory-soft` | `#FAF7EF` | Card backgrounds |
| charcoal | `--color-charcoal` | `#252824` | Body text, headings |
| charcoal-soft | `--color-charcoal-soft` | `#4A4E48` | Secondary text, captions |
| brass | `--color-brass` | `#B18A51` | Accent, badges |
| brass-soft | `--color-brass-soft` | `#D9C7A8` | Accent backgrounds, borders |
| brass-ink | `--color-brass-ink` | `#7A5420` | Text/focus on light surfaces |
| border | `--color-border` | `#E2DDCE` | Hairlines |
| focus | `--color-focus` | `#7A5420` | Keyboard focus ring |
| brass-hover | `--color-brass-hover` | `#8A5F26` | Brass hover |
| white | `--color-white` | `#ffffff` | White surfaces |

Typography: serif (Georgia stack) headings; sans (Inter) UI/body/buttons; Geist Mono. Radii: card 12px, button 10px, image 8px. `@media (prefers-reduced-motion: reduce)` implemented.

### Component inventory (verified files present)

`SiteHeader`, `MobileNav`, `SiteFooter`, `PackageCard`, `PackageGrid`, `SearchAndFilters`, `EnquiryForm`, `NewsletterSection`, `HomeHero`, `DiscoverSection`, `DestinationCarousel`, `JourneysBand`, `ExperienceCarousel`, `PillarsTabs`, `ImpactSection`, `PromiseCards`, `CtaZoom`, `BrandMark`, `PageShell`, `Container`, `MegaMenu`, `ItineraryTimeline`, `InclusionsExclusions`.

### Functional controls (verified via code + live browser)

- **Search/filter**: `SearchAndFilters` — query by name/code, filters category/region/duration/sort, active-filter pills, reset, URL query state, back/forward sync, mobile drawer with focus trap + Escape, empty state. `difficulty` filter is deliberately absent because `difficultyVerified` is false for every package.
- **Catalogue**: `/explore` lists all 27 packages; `/explore/[category]` filters by category (spaces encoded).
- **Package detail**: `/packages/[slug]` — breadcrumbs, hero, identity, overview, highlights, itinerary timeline, package-specific inclusions/exclusions, related journeys, enquiry prefill, not-found state, unique metadata per slug.
- **Enquiry form**: client-side validation, accessible errors, loading state, truthful "nothing was transmitted" when backend unconfigured, package prefill from `?package=`, custom-trip option, no success claim without confirmed server response. No `NEXT_PUBLIC_` env values in client bundle.
- **Newsletter**: hidden on homepage when `NEWSLETTER_API_URL` unset; `/api/newsletter` returns 503.
- **Navigation**: fixed header with logo (centered), Menu (left), search + Enquire Now (right); mega menu desktop; right-slide mobile drawer; all links resolve to real routes.
- **Images**: all `next/image` refs resolve to existing files under `public/images/` (28/28 on home return HTTP 200 via direct fetch). Houseboat image `/images/services/kashmir-houseboat.jpg` is **missing**; houseboats page falls back to `kashmir-shikara.jpg`.

---

## Observed reference design patterns (reference-site analysis, not copied)

Source: `docs/reference-site-analysis.md` (Wilderness Destinations, reviewed states noted as verified/unverified). Observed facts separated from suggestions; no branding/copy/imagery/code copied.

| Observed pattern | Status | Relevance to this site |
|------------------|--------|------------------------|
| Grouped nav (Destinations / Experiences / Journeys / About) + persistent "Enquire now" | Observed | Matches existing `SiteHeader`/`MobileNav`/`SiteFooter` structure |
| Cinematic hero + short brand promise | Observed | Matches existing homepage hero |
| Destination tiles image + summary + link | Observed | Matches existing destination carousel |
| Detail page: hero, meta, itinerary day-by-day, highlights, recurring enquiry | Observed | Matches existing `/packages/[slug]` template |
| Filterable catalogue with counts + clear all + empty state | Observed | Matches existing `SearchAndFilters` |
| Enquiry with package context + custom trip option | Observed | Matches existing `/enquiry` flow |
| Awards / testimonials / aggregate ratings | Observed | **Deliberately not copied** — no verified awards/reviews for this business |
| Pricing / instant booking | Observed | **Deliberately not implemented** — no verified prices |

---

## Items needing owner confirmation (not silently changed)

### Data discrepancies (26 `content_flags` in `travel_packages_catalog.json`)

Per `docs/current-state-checklist.md` (C-1…C-7) plus 7 additional flags from partial brochure scans. Examples:
- Kathmandu–Pokhara duration conflict between card/contents/itinerary
- Golden Triangle code casing ambiguous (`ii7` vs `II7`)
- Vale of Kashmir Trek duration conflict (card vs itinerary)
- Nepal difficulty grade conflicts (badge vs Grade D wording)
- Kashmir Ski vs contents-page "Himalaya Enfield Motorbike Tour" mismatch
- Nepal packages missing from contents page
- Package-specific inclusions/exclusions must not be blindly replaced with generic panel

`difficultyVerified` is false for every package → no difficulty badge/filter shown publicly.

### Launch blockers (operator decisions)

1. **Enquiry backend** — `ENQUIRY_API_URL` / `ENQUIRY_API_KEY` not configured; route returns 503, UI states nothing transmitted.
2. **Newsletter backend** — `NEWSLETTER_API_URL` / `NEWSLETTER_API_KEY` not configured; section hidden entirely.
3. **Contact details** — none supplied; do not invent phone/email/address.
4. **Privacy notice & consent wording** — not approved; `/privacy` route does not exist.
5. **Business name wording** — "India Nepal Travel Centre" vs "India Nepal Travel Organisation" unconfirmed per context.
6. **Photography licensing** — all crops derived from `Brochure.pdf`; owner review/licensing required before launch.

### Asset gaps

- `/images/services/kashmir-houseboat.jpg` missing (fallback `kashmir-shikara.jpg` used)
- Many crops flagged low-resolution / extreme aspect ratio in `docs/asset-inventory.md` (61 files present vs 59 documented)
- No favicon / social share (Open Graph / Twitter card) images
- Image source/licence notes in `public/images/SOURCES.md`

---

## Corrected stale references

The following obsolete `gggg.pdf` references were corrected to `Brochure.pdf` (the actual file at repo root, 33 MB, 8 pages):

- `app/src/data/travel_packages_catalog.json` line 2: `source_document` → `Brochure.pdf`
- `travel_packages_catalog.json` (root) line 2: `source_document` → `Brochure.pdf`
- `india-nepal-travel-web-app-brief.md` line 200: build prompt → `Brochure.pdf`

Stale "missing route / missing image" claims:
- `docs/baseline-audit.md` is annotated as **partly stale** — it originally listed `/packages/[slug]`, `/enquiry`, `/about`, `/contact`, `/houseboats` as missing and all 27 package images as missing. All routes now exist and build; all 27 package images are present. The document header states it is superseded by `docs/current-state-checklist.md`.
- `docs/qa-report.md` updated to current checkout (dated 2026-10-30, commit `54cb488c`).
- `docs/current-state-checklist.md` is the authoritative current state (reconciled 2026-10-28).

---

## Basis for later-phase decisions

All implementation decisions in later phases must be based on this live source:
- Stack preserved: Next.js 16 + Tailwind v4 + TypeScript strict; no framework swap.
- `catalogue.ts` accessors + `travel_packages_catalog.json` remain the single typed source of truth; package titles, codes, durations, categories come from data, not hardcoded JSX.
- Existing working components reused; no competing design system introduced.
- Current URLs preserved (`/`, `/explore`, `/explore/[category]`); new pages added without breaking existing routes.
- No invented prices, availability, ratings, testimonials, contact details, or season information; uncertain values stay behind internal `content_flags`.
