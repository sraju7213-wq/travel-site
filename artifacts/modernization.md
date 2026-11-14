# Modernization & Anti-AI-Slop Plan — India Nepal Travel Organisation

Source: `india-nepal-travel-web-app-brief.md`, `docs/baseline-audit.md`,
`docs/reference-site-analysis.md`, `travel_packages_catalog.json`.
Repo root: `D:/ks world Adventure site`. Stack (kept): Next.js 16 App Router,
React 19, TypeScript strict, Tailwind v4/Turbopack, CSS variables.

## Verdict

The site is a brochure skeleton with broken links, fake image refs, empty
content shells, no data-driven detail pages, an unconnected enquiry form and
no photography. It also reads like a generic AI travel template because
brief/general flow, vague labels, unverified badges, decorative motion and
placeholder copy run everywhere. The anti-slop fix is not a coat of paint;
it is replacing invented detail with verified, sourced, per-item data and
tying every UI element to a real route.

## P0 defects (must land first)

1. **Package cards link to `/packages/[slug]` which does not exist.**
   Fix: build the data-driven package page (brief §5). This unlocks the whole
   catalogue.
2. **Header/footer link to `/enquiry`, `/about`, `/contact`, `/houseboats`
   which do not exist.** Fix: create the four pages.
3. **All 27 `src="` package images are broken references; the files do not
   exist.** Do not hotlink the reference site and do not ship `alt=""`.
   Fix: explicit `[Image TODO: title]` placeholders until owner-supplied or
   licensed photography is recorded. Add asset inventory + source/licence
   column before launch (brief §10).
4. **Houseboat page references a missing hero image.** Replace with a
   placeholder + asset TODO; the service must remain a separate page, not a
   28th package.
5. **Difficulty is never verified.** All graded packages carry
   `difficulty="… (as printed)"` or a badge/Grade D conflict, so
   `difficultyVerified` is `false` for every record. Fix: keep unverified
   grades hidden from UI (no badge, no filter) until the operator confirms.

## Data-first content model

- Treat `travel_packages_catalog.json` as the single source of truth.
- Each package record keeps: stable `id`/`slug` (never brochure code), title,
  category, code, description, overview, destinations, duration (normalized to
  nights/days with a source note), activity tags, verified difficulty only,
  hero/gallery with `alt` + rights/source, per-day itinerary, per-package
  inclusions/exclusions (no generic panel applied blindly; IT14/IT15/IT16
  must keep their own wording), departures/season/minimum only when operator
  confirmed, related package IDs, SEO title/desc + social image, enquiry
  routing fields, and `status: draft | needs review | approved | published`.
- Unknown fields stay `null` or flagged for review; do not fill with generic
  text just to make cards look complete.
- `content_flags` are internal editorial warnings; they must never render to
  visitors. Surface a review flag in data/CMS for every uncertain field.

## Hard anti-slop rules

- No prices, no reviews/ratings, no availability, no awards, no testimonials,
  no made-up departure schedules, no generic placeholder copy.
- Brief/general beauty statements do not appear on cards or detail pages.
- One strong image per card with consistent crop, meaningful `alt`, original
  source/licence. No low-res crops, no repeated stock fills.
- One rule per card: photo, title, destination/region, duration, verified
  difficulty (if any), one concise description, “View itinerary” link.
- Difficulty badge + filter only when `difficultyVerified` (currently never).
- Motion: subtle reveal/hover only; `prefers-reduced-motion` respected;
  no scroll-jacking, no parallax that harms mobile.
- Brand warmth: deep forest `#16271A`, ivory `#F6F2E9`, charcoal,
  muted brass/saffron sparingly. Use clean cards, 12–18px radii,
  generous whitespace. Do not copy the reference site’s names, claims or
  imagery.

## Routes to build (additive; preserve `/`, `/explore`, `/explore/[category]`)

| Route | File | Status |
|---|---|---|
| `/` | `src/app/page.tsx` | existing homepage → redesigned |
| `/explore` | `src/app/explore/page.tsx` | existing catalogue → enhanced |
| `/explore/[category]` | `src/app/explore/[category]/page.tsx` | existing → enhanced |
| `/packages/[slug]` | new file | NEW |
| `/enquiry` | new file | NEW |
| `/about` | new file | NEW |
| `/contact` | new file | NEW |
| `/houseboats` | new file | NEW |

## IA (customer-facing)

- Home: cinematic hero, editorially grounded intro, destination tiles,
  signature journeys, browse-by-experience, why-plan, bespoke enquiry,
  final CTA, footer.
- Explore Tours + category pages: searchable/filterable catalogue.
- Package detail: breadcrumbs, hero, identity, overview, highlights,
  day-by-day timeline (vertical desktop / compact mobile), included/not
  included, practical notes, related, enquiry CTA with package prefilled.
- Kashmir Houseboats: separate service page with verified options only.
- Tailor-made Trips: custom enquiry panel.
- About / Contact / Plan Your Trip: only with real, business-confirmed copy.

## Enquiry flow

- Prefill from `?package=`; custom trip option separate.
- Fields: name, preferred contact, email/phone per business needs, dates,
  travellers, message.
- Validation, accessible errors, loading state, truthful success/error.
- Real endpoint if configured; otherwise explicit integration boundary with
  a dev-safe fallback. Never claim “sent” without backend confirmation.

## Image strategy

- No photography in `public/`. Create an asset TODO/inventory.
- Required assets: 27 package images, 1 houseboat image, homepage hero,
  destination tiles.
- Prefer owner-approved or licensed imagery; record source/licence per asset.
- Responsive sizes, modern formats, lazy loading below fold, explicit
  dimensions, meaningful alt.

## Phase layout

- **Phase 3** — design foundation + core navigation (header, drawer,
  footer, primitives). Acceptance: 320–1440px, keyboard accessible,
  focus visible, reduced-motion, no horizontal overflow, lint + build pass.
- **Phase 4** — homepage redesign with source-grounded copy and real links.
- **Phase 5** — catalogue, destinations, filters (drawer mobile; no
  difficulty filter until verified).
- **Phase 6** — package detail, itinerary, inclusions/exclusions, related.
- **Phase 7** — enquiry + custom journey, truthful states, backend boundary.
- **Phase 8** — visual polish + accessibility across widths.
- **Phase 9** — tests, QA, sign-off.

## Risks & mitigations

- No images: placeholder inventory; owner photography before launch.
- Difficulty never verified: hide until confirmed.
- Conflicting catalogue data: preserve, flag, never silently correct.
- No enquiry backend: documented boundary + dev fallback.
- No contact details supplied: don’t invent; minimal or omitted contact page.
- No git history: incremental, reviewable changes; no rollback via git.

## Immediate next steps (this session)

1. Build `/packages/[slug]` with breadcrumbs, identity, overview/highlights,
   itinerary placeholder, inclusions/exclusions placeholder, related trips,
   enquiry CTA.
2. Build `/enquiry`, `/about`, `/contact`, `/houseboats`.
3. Point cards/navigation at real routes; delete broken image refs.
4. Add reusable primitives (Buttons, Links, Forms, EnquiryForm, Itinerary,
   InclusionsExclusions).
5. Identify real imagery assets or an asset inventory before launch.
6. Re-run lint and build; record results, then go further into Phase 4+.
