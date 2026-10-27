# Modernization Plan — India Nepal Travel Website

**Sources:** `docs/baseline-audit.md`, `docs/reference-site-analysis.md`, `travel_packages_catalog.json`, `india-nepal-travel-web-app-brief.md`
**Stack (preserved):** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, CSS variables
**Status:** Phases 0–8 complete; Phase 9 sign-off pending.
**Constraint:** Do not invent package details, prices, reviews, ratings, availability, awards, or booking functionality. Flag conflicting source details for review.

---

## Design system (implemented — matches reference-site visual language)

- Colors: wild-orange `#ff6e00` (primary), hover `#e56300`; wild-dark `#123438` / wild-darker `#221f20` (dark sections); wild-black `#000` (nav); wild-sand `#817162` (nav labels); wild-cream `#eeebe5`; wild-accent `#b6a28f` (circular borders); borders `#E2DDCE`.
- Typography: serif (Georgia/system-ui fallback) for headings; sans (Inter/system-ui) for UI, buttons, body; Geist Mono retained.
- Buttons: `btn-primary` (orange), `btn-primary-dark` (dark bg), `btn-ghost-dark` (ghost on dark), `btn-tertiary` (orange border).
- Nav: fixed blur header `#000/40`, centered logo, "Menu" left, search + "Enquire Now" right; mobile right-slide dark panel with accordion categories.
- Radii: card 12px, button 10px, pill, circle. Focus: 2px orange ring + 2px offset.

---

## Completed work

### Phase 3 — Design foundation & core navigation (done)
- `globals.css` tokens + component classes; `SiteHeader`, `MobileNav`, `SiteFooter` restyled.
- Acceptance: logo preserved; desktop nav + mobile drawer 320–1440px, keyboard accessible; focus visible; contrast compliant; reduced motion respected; no horizontal overflow; lint + build pass; existing routes unchanged.

### Phase 4 — Homepage redesign (done)
- Rhythm: cinematic hero → dark editorial section → destination carousel → signature journeys → circular experience carousel → tabbed pillars → final CTA → footer.
- All copy source-grounded; no invented testimonials/awards/prices; all CTAs link to real routes; responsive images/lazy placeholders.

### Phase 5 — Catalogue, destinations, filters (done)
- Search by name/code; filters category/region/duration/activity/sort; result count; reset; empty state; URL query state; no difficulty filter until verified; mobile drawer.

### Phase 6 — Package detail, itinerary, experience pages (done)
- `/packages/[slug]` template: breadcrumbs, dark hero, package identity, overview, highlights, day-by-day itinerary timeline, inclusions/exclusions, related journeys, enquiry prefill, not-found state, unique metadata.

### Phase 7 — Enquiry & custom journey (done)
- `/enquiry` package prefill from `?package=`; custom trip option; validation + accessible errors + loading + truthful success/error; no "sent" claim without backend; no API keys in client bundle; integration boundary documented.

### Phase 8 — Visual polish & accessibility (done)
- Checked at standard breakpoints; overflow, focus, contrast, alt text addressed; all pages use new palette; build + lint clean.

---

## Remaining launch blockers (unchanged)

| Blocker | Detail |
|---------|--------|
| Photography assets | None exist in `public/`; `[Image TODO]` placeholders used throughout. Required: 27 package images, 1 houseboat image, hero + destination tile imagery. Owner-supplied or licensed only; record source/licence. |
| Enquiry backend | No endpoint configured; dev `setTimeout` placeholder shows truthful "no message was actually sent". Configure real endpoint + `ENQUIRY_API_URL`/`ENQUIRY_API_KEY` env vars before launch. |

---

## Data discrepancies requiring operator confirmation

C-1 through C-7 from baseline audit remain flagged internally, not silently corrected (difficulty badges hidden because `difficultyVerified` is false everywhere).

---

## Next step: Phase 9 — test, fix, sign-off

- `npm run lint` and `npm run build` pass.
- Verify homepage, nav, filters, category routes, ≥3 package detail pages, not-found, enquiry validation/error/success.
- Console errors, failed network, missing images, horizontal overflow checked.
- Write `docs/qa-report.md` with truthful results.
