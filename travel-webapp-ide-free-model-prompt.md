# Build a Premium India–Nepal Travel Website — IDE Agent Prompt

## Your role
Act as a practical senior frontend engineer and product designer. **Build and test the working website in this repository**; do not stop after giving advice, a plan, or mockup code. This prompt is written for a free/small coding model: work in small verifiable steps, conserve context, avoid unnecessary dependencies, and keep reports concise.

## Read these project sources first
1. `india-nepal-travel-web-app-brief.md` — requirements, source audit and design direction.
2. `travel_packages_catalog.json` — structured source data for all **27 tour packages** and the separate Kashmir houseboat service.
3. `gggg.pdf` — original 8-page brochure, if present in the repository, for checking unclear source details.

If a source file is missing, inspect the repository and continue with available material. Do not invent its contents.

## Main goal
Create a modern, premium, polished, **mobile-first and desktop-friendly** travel website for India Nepal Travel Organisation. It should feel like an editorial travel brand: inspiring destination photography, strong typography, careful spacing, easy discovery, clear itineraries, and simple enquiry actions. Do not recreate the brochure page-for-page and do not produce only a static landing page.

## Step 1 — Inspect before editing
- Inspect the repository structure, package scripts, framework, routing, styles, reusable components and current git diff if available.
- Run the existing app or checks where practical to understand its current state.
- Keep working code and conventions. Do not replace the framework, rewrite configuration, or delete files without a clear reason.
- If the repo is empty, use a simple maintainable stack: Next.js + TypeScript + Tailwind CSS if available in the environment; otherwise use the least-complex supported React setup.
- Write a short checklist into your working notes, then proceed immediately. Do not stop to ask for approval unless a genuine blocker makes implementation impossible.

## Core pages and features
1. **Home:** destination-led hero, concise value proposition, trip finder/search, category shortcuts, featured experiences, Kashmir houseboat feature, tailor-made trip CTA and footer.
2. **Explore tours:** complete catalogue, responsive package cards, search, useful filters, sorting, result count and empty/reset state.
3. **Category pages:** Stopovers; Images of India; India Tours; Himalayan Expeditions; Mini Trek in Kashmir; Nepal Adventure. Preserve original categories in data unless the business explicitly approves a rename.
4. **Package detail pages:** title/code, region, duration, verified activity/difficulty facts, overview, highlights, readable day-by-day itinerary, package-specific inclusions/exclusions, relevant practical notes, related trips and enquiry CTA.
5. **Kashmir houseboat service:** separate service page, not an extra numbered package. Show only brochure-supported information and make enquiries easy.
6. **Plan a trip / enquiry:** traveller contact fields, selected package or custom trip, dates/flexible dates, party size, message, validation and clear result states.
7. **About and Contact:** use only grounded information from the brochure/current project. Do not fabricate phone numbers, emails, addresses, testimonials or company claims.

## Visual direction
- Primary forest green: `#16271A`.
- Warm ivory/stone backgrounds, charcoal text, restrained muted brass/saffron accents.
- Inter or Manrope-style readable typography; confident headings and comfortable body text. Avoid condensed all-caps for long text.
- Editorial travel photography with consistent crops, generous whitespace, restrained borders, rounded cards, and subtle transitions.
- Aim for calm, trustworthy, contemporary and premium—not a generic travel template or dense brochure layout.
- Avoid excessive gradients, glassmorphism, glowing borders, oversized animation, fake review stars and decorative elements that reduce readability.
- Prefer real assets already in the project. If assets are missing, create a tidy asset/config integration point and use clearly identified placeholders; do not pretend an unverified remote image is a real approved asset.

## Data and content rules — important
- Use `travel_packages_catalog.json` as the source of truth for package cards and pages. Do not repeat package content in hardcoded JSX. Build reusable components and data-driven routes.
- Include all 27 package records exactly once in the appropriate category. Keep Kashmir houseboat booking as a separate service.
- Preserve brochure codes; do not silently normalize questionable codes.
- Do not invent prices, live availability, hotel names, departure schedules, operating seasons, ratings, reviews, testimonials, booking terms, or contact details.
- Unknown values should remain absent/null or show a neutral “Details to be confirmed” only when useful to customers. Do not expose internal editorial warnings on public pages.
- Retain internal content-review flags for uncertain data. Never silently “fix” contradictions from the brochure.
- Important items to flag for operator confirmation:
  - Kathmandu–Pokhara duration appears inconsistent.
  - Golden Triangle code appears as `ii7`; confirm official casing.
  - Vale of Kashmir Trek duration conflicts with itinerary/card label.
  - Himalayan Combination and Nepal mini-trek grades conflict between badge/body text.
  - 4 Day Nepal Mini Trek itinerary appears to repeat/contain a sequence error.
  - Contents page mentions an Enfield motorbike tour while the actual card shows Kashmir Ski; Nepal packages are missing from the contents page.
  - Generic inclusions/exclusions must not be applied to every package unless the data supports it.
- Keep the organisation's legacy category names in data. If displaying friendlier navigation labels, make that mapping explicit and do not alter source records.

## Functional behaviour required
- Search packages by title, destination, region and meaningful keywords.
- Functional filters for category, region/destination, duration range and activity. Show difficulty filters/badges only when the grade is verified; do not mix conflicting scales into one filter.
- Sorting by title and shortest/longest duration. Do not add price filters when prices are unavailable.
- Mobile filters must work in a drawer/sheet and be easy to reset. Avoid horizontal overflow at 320px widths.
- Package cards must open the correct detail page. Deep links and browser back/forward should work.
- Itinerary must be scannable: vertical timeline on wide screens, readable compact sections/accordions on narrow screens.
- Enquiry actions should prefill the selected package. Forms need labels, required-field validation and accessible success/error feedback. **Do not show “sent successfully” unless a real backend/API actually confirms submission.** If no backend is configured, implement a clearly documented integration point and truthful demo state.
- Navigation, menu, search, filters, accordions, reset buttons and CTAs must all work. Do not leave dead decorative controls.

## Responsive, accessibility, SEO and performance
- Test mobile (~320–390px), tablet and desktop layouts.
- Use semantic HTML, proper heading order, form labels, keyboard navigation, visible focus states, accessible contrast and sensible tap targets (aim for 44px).
- Respect `prefers-reduced-motion`; no scroll hijacking or required parallax.
- Include unique page titles/descriptions and Open Graph metadata for public package pages. Add structured data only if supported by the actual content; never fabricate offers, review ratings or prices.
- Use descriptive alt text, responsive image sizes, lazy-load below-the-fold imagery and avoid layout shifts.
- Handle missing/invalid data gracefully with empty, loading or error states when needed.
- Avoid adding libraries for small tasks. Reuse installed dependencies where sensible.

## Work method for a free IDE model
Work through the following stages **in this order**. Keep each stage small enough to verify before moving on:

### Phase A — Audit and base structure
- Inspect project and data schema.
- Identify existing routes/components and map package IDs/slugs.
- Create or tidy shared layout, design tokens and global responsive styles.
- Keep a short task checklist; do not dump long reasoning into chat.

### Phase B — Data-driven core
- Build typed package/service data access and reusable `PackageCard`, `PackageGrid`, `SearchAndFilters`, `DurationLabel`, `Itinerary`, `InclusionsExclusions`, `EnquiryForm` and navigation/footer components as appropriate.
- Validate that all 27 records are included once and that unknown values stay unknown.

### Phase C — Main user journey
- Implement the homepage, catalogue, category pages and dynamic package details.
- Connect search, filters, sorting, related trips and enquiry prefill.
- Add the separate houseboat service page and enquiry path.

### Phase D — Polish
- Check mobile and desktop spacing, image crops, typographic hierarchy, focus states, empty states, form errors, loading states, and the consistency of every category/detail page.
- Remove duplicate content, placeholder links that look functional, unnecessary visual effects and inconsistent component variants.

### Phase E — Verify and report
- Run the project's existing lint, typecheck, test and build commands where available.
- Fix failures introduced by your changes. Inspect representative routes and at least one small-screen layout.
- Verify filters and card/detail routing; search for console errors, broken paths and horizontal overflow.
- Give a concise final report: files/features changed, commands run and results, known limitations, and client confirmations still required. Do not claim any check passed unless you ran it.

## Rules for efficient execution
- Implement changes directly; do not merely return a plan or a tutorial.
- Prefer a few coherent patches over rewriting the whole app.
- Avoid repeated full-file dumps in chat. Explain only decisions that affect implementation.
- After each major phase, run the cheapest relevant check and fix errors before continuing.
- If a command fails, inspect the error and try a reasonable correction; do not repeat the same failed command blindly.
- If tool/context limits are reached, finish the current coherent unit, leave clear TODOs in the repository, and report exact progress.
- If subagents are supported, delegate only independent audits (content QA, responsive/accessibility review). Do not depend on subagents; continue yourself if unavailable.
- Do not install packages or run destructive commands without a concrete need. Preserve existing user changes.

## Definition of done
- [ ] All 27 brochure packages are shown once and grouped correctly.
- [ ] Kashmir houseboat booking is a separate service.
- [ ] Homepage, catalogue, categories, package details, houseboat page and enquiry journey are implemented.
- [ ] Search, filters, sort, navigation, related links and mobile controls function.
- [ ] No invented commercial/current facts are shown.
- [ ] Conflicting brochure content is flagged internally for confirmation.
- [ ] Responsive layouts work without horizontal scrolling at phone widths.
- [ ] Keyboard focus, labels, contrast and reduced-motion behaviour are addressed.
- [ ] SEO metadata and image alt text are present.
- [ ] Available project checks have been run and actual results are reported.

**Start now:** inspect the repository and source files, then implement Phase A and continue through the phases without waiting for approval. Prioritise a complete, coherent, polished working experience over unnecessary effects or overengineering.
