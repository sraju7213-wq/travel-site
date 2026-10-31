# Modernization Plan — India Nepal Travel Website

**Sources:** `docs/baseline-audit.md`, `docs/reference-site-analysis.md`, `travel_packages_catalog.json`, `india-nepal-travel-web-app-brief.md`
**Stack (preserved):** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, CSS variables
**Status:** Phases 0–8 complete; Phase 9 sign-off pending.
**Constraint:** Do not invent package details, prices, reviews, ratings, availability, awards, or booking functionality. Flag conflicting source details for review.

---

## Design system (implemented — India Nepal Travel brand)
- Colors: forest `#16271A` (primary), brass `#B18A51` (accent, hover `#9A7342`), ivory `#F6F2E9`, ivory-soft `#FAF7EF`, charcoal `#252824`, charcoal-soft `#4A4E48`, brass-soft `#D9C7A8`, border `#E2DDCE`. Reference-site orange (`#ff6e00`) is intentionally not used.
- Typography: serif (Georgia stack) for headings; sans (Inter) for UI, buttons, body; Geist Mono retained.
- Buttons: `btn-primary` (brass), `btn-primary-dark` (forest), `btn-ghost-dark` (ghost on dark), `btn-tertiary` (brass outline).
- Nav: fixed blur header `black/40`, centered logo, "Menu" left, search + "Enquire Now" right; mobile right-slide dark panel with accordion categories.
- Radii: card 12px, button 10px, pill, circle. Focus: 2px brass ring + 2px offset.

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

## Remaining launch blockers (reconciled 2026-10-28)
- Photography quality: 27/27 package images now present (cropped from `Brochure.pdf`), but many are low-resolution/extreme-aspect per `docs/asset-inventory.md`; houseboat image `/images/services/kashmir-houseboat.jpg` is still missing. Owner review/licensing of crops still required before launch.
- Enquiry backend: no endpoint configured; dev `setTimeout` placeholder shows truthful "no message was actually sent". Configure real endpoint + `ENQUIRY_API_URL`/`ENQUIRY_API_KEY` env vars before launch.


---

## Data discrepancies requiring operator confirmation

C-1 through C-7 from baseline audit remain flagged internally, not silently corrected (difficulty badges hidden because `difficultyVerified` is false everywhere).

---

## Next step: Phase 9 — test, fix, sign-off

- `npm run lint` and `npm run build` pass.
- Verify homepage, nav, filters, category routes, ≥3 package detail pages, not-found, enquiry validation/error/success.
- Console errors, failed network, missing images, horizontal overflow checked.
- Write `docs/qa-report.md` with truthful results.
