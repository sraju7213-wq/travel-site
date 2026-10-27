# India Nepal Travel Organisation — Responsive Web App Brief

## 1. Executive direction

Transform the eight-page brochure into a polished, responsive travel website for **India Nepal Travel Organisation**. The brochure states that the organisation was established in 1927 and describes specialist travel across India and Nepal, including tailor-made arrangements, small-group tours, Himalayan trekking, cultural itineraries and Kashmir houseboats. Treat those as brochure-sourced claims; verify current company details before launch.

**Do not reproduce the brochure layout page-for-page.** Build a data-driven discovery and enquiry experience: visitors should be able to find a trip, compare duration and activity level, understand the itinerary, see exactly what is included, and enquire easily from mobile or desktop.

The source contains **27 numbered/standalone package cards** across six brochure categories, plus a separate Kashmir houseboat booking service. A machine-readable starter index is provided in `travel_packages_catalog.json`.

## 2. Package inventory from the brochure

### Stopovers — page 2 (6 packages)

| Package | Code | Duration from brochure | Main idea |
|---|---|---|---|
| Delhi | S01 | 2 nights / 3 days | Capital landmarks, historic sites and city sightseeing |
| Bombay | S02 | 3 nights / 4 days | Mumbai sightseeing, Elephanta Caves and Bollywood |
| Discover Leh | S03 | 3 nights / 4 days | Leh arrival/rest and local sightseeing |
| Kathmandu | S04 | 3 nights / 4 days | Kathmandu temples, squares and cultural sights |
| Kathmandu–Pokhara | S05 | Conflicting labels; likely 3 nights / 4 days based on contents and itinerary | Kathmandu–Pokhara combination |
| Discover Ladakh | S06 | 4 nights / 5 days | Leh, Nubra Valley, Turtuk and Pangong |

Page 2 also has a **Kashmir houseboat booking service**. Treat this as a service landing page or featured experience, not a numbered package.

### Images of India — pages 3–4 (7 packages)

| Package | Code | Duration from brochure | Main idea |
|---|---|---|---|
| Golden Triangle | Printed as `ii7`; confirm official casing | 3 nights / 4 days | Delhi, Agra and Jaipur |
| Glorious Goa Stopover | II8 | 4 nights / 5 days | Goa/Panjim and leisure time |
| Glimpses of Kerala | II9 | 5 nights / 6 days | Kovalam, Periyar and Cochin/backwaters |
| Kashmir Package | II10 | 6 nights / 7 days | Srinagar, houseboat, Gulmarg, Sonamarg and Pahalgam options |
| Kashmir Package | II11 | 3 nights / 4 days | Short Srinagar-based visit with optional excursion |
| Delhi to Kathmandu | II12 | 7 nights / 8 days | Delhi, Agra, Varanasi and Kathmandu |
| Heritage Tour of India | HTI13 | 14 nights / 15 days | Rajasthan heritage circuit and Agra |

### India Tours — page 5 (3 packages)

| Package | Code | Duration | Main idea |
|---|---|---|---|
| North India Highlights | IT14 | 18 nights / 19 days | Delhi, Agra, Jaipur, Udaipur, Srinagar and Leh |
| India Nepal Combination Tour | IT15 | 15 nights / 16 days | India city circuit ending in Kathmandu |
| South India Highlight | IT16 | 13 nights / 14 days | Kerala and Tamil Nadu: Kochi, Munnar, Thekkady, Alleppey, Varkala, Kovalam, Kanyakumari, Rameshwaram and Madurai |

### Himalayan Expeditions — page 6 (3 packages)

| Package | Code | Duration | Difficulty printed |
|---|---|---|---|
| Markha Valley | HE17 | 9 nights / 10 days | Demanding |
| Kashmir, Zanskar and Ladakh Trek | HE18 | 24-day round trip; 15-day trek | Strenuous |
| Kashmir Combinations: “Little Tibet” | HE19 | 19-day round trip; 7-day trek | Moderate |

### Mini Trek in Kashmir — page 7 (3 packages)

| Package | Code | Duration | Difficulty printed |
|---|---|---|---|
| Kashmir Mini Adventure | MTK20 | 6 nights / 7 days | Demanding |
| Vale of Kashmir Trek | MTK21 | Itinerary indicates 6 nights / 7 days; card label conflicts | Moderate / Grade C in body text |
| Kashmir Ski | KS22 | 6 nights / 7 days | No clear grade shown; January–March season is stated |

### Nepal Adventure — page 8 (5 packages)

| Package | Code | Duration | Difficulty/availability printed |
|---|---|---|---|
| Himalayan Combination HC | NA23 | 20-day round trip | Moderate badge, while body also says Grade D |
| Trisuli Rafting | NA24 | Day trip; no fixed duration printed | Easy; daily departures October–March and minimum 2 persons stated |
| 4 Day Nepal Mini Trek | HE25 | 3 nights / 4 days | Easy badge, while body says Grade D |
| Nepal Wildlife Safari | NA26 | 3 nights / 4 days | Easy |
| 7 Day Nepal Mini Trek | HE27 | 6 nights / 7 days | Easy badge, while body says Grade D |

## 3. Content QA — resolve before public launch

1. **Contents page mismatch:** the page 1 contents list says “Himalaya Enfield Motorbike Tour” where page 7 actually shows “Kashmir Ski” (code KS22). The Nepal Adventure packages on page 8 are also missing from the contents list. Confirm whether any tour is missing or whether the contents page is outdated.
2. **Kathmandu–Pokhara duration:** page 1 and the itinerary imply 3 nights / 4 days, while the card label appears different. Confirm the sellable duration.
3. **Vale of Kashmir Trek duration:** the card's printed duration appears to conflict with the itinerary's 7 days / 6 nights. Correct the label.
4. **Difficulty grading:** Himalayan Combination HC and both Nepal mini treks have badges/body text that conflict (Moderate/Easy badge versus Grade D). Confirm the operator's intended scale and explain it consistently.
5. **Golden Triangle code:** the code is visually printed as `ii7`; confirm whether the official code is `II7` before normalising it.
6. **Package-specific inclusions and exclusions:** the brochure reuses a generic panel mentioning 3–4-star twin-share accommodation, daily breakfast, hotel/houseboat taxes, transfers and vehicle/coach sightseeing. It must not automatically be applied to every package. Some itineraries have package-specific inclusions/exclusions, and some wording is incomplete.
7. **Itinerary errors:** the 4-day Nepal Mini Trek appears to repeat a route/day in its itinerary. Validate the sequence with the trip operator.
8. **Current operating details:** seasonality, departures, group minimums, lodges, transport, equipment and trek difficulty may be old. Confirm before displaying them as current facts.
9. **Unspecified commercial information:** the brochure has no clear prices, booking terms, cancellation policy, live availability or complete enquiry contact details. Do not invent them; make the site enquiry-led until real data is supplied.
10. **Houseboats:** verify available houseboats/room counts, classification, price, policies, photos and current inventory before accepting bookings.

Use a review flag in data/CMS for every uncertain field. Keep internal content warnings out of public UI.

## 4. Recommended information architecture

- **Home** — strong destination-led hero, trip finder, categories, selected experiences, houseboat feature and a custom-trip CTA.
- **Explore Tours** — all packages in a searchable/filterable catalogue.
- **Category pages** — Stopovers; India Getaways (based on “Images of India”); India Tours; Himalayan Expeditions; Kashmir Treks & Ski; Nepal Adventure.
- **Package detail** — overview, key facts, itinerary timeline, inclusions, exclusions, route/region, practical notes and enquiry CTA.
- **Kashmir Houseboats** — dedicated service page with verified options and enquiry form.
- **Tailor-made Trips** — custom enquiry for travellers who want to combine itineraries.
- **About** — organisation history, local expertise, team/founders and operating approach, with all claims verified.
- **Contact / Plan Your Trip** — working enquiry form, direct contact options and privacy/consent copy.

Keep legacy brochure category names in the data, but use clearer customer-facing labels in navigation if the business approves them.

## 5. Visual direction

Aim for **premium, editorial, modern travel**, with a calm outdoors palette rather than a generic booking marketplace.

- Primary: deep forest green `#16271A`.
- Backgrounds: warm ivory/cream and restrained pale stone.
- Text: near-black/charcoal.
- Accent: muted brass/saffron used sparingly for details, not as a large block colour.
- Typography: a clean sans-serif such as Inter or Manrope; use a strong but readable display style for headings. Avoid the brochure's condensed all-caps typography for paragraph copy.
- Photography: large, authentic destination imagery; use consistent crops, a single strong image per card, and meaningful alt text. Avoid low-resolution crops or repeated generic stock photos.
- Shapes: clean cards, restrained borders, consistent 12–18px radii, generous whitespace and clear hierarchy.
- Motion: subtle reveal/hover transitions only; respect reduced-motion settings. No scroll hijacking or parallax that harms mobile usability.

### Package card

Each card should show: photo, package title, destination/region, duration, difficulty only where verified, one concise description and a clear “View itinerary” link. Use consistent card heights and a clear focus/hover state. Don't show empty rating stars, fake badges, fabricated prices or made-up “best seller” labels.

### Package details page

1. Breadcrumbs.
2. Destination image/gallery.
3. Title, region, duration, trip type and verified difficulty.
4. Short overview and key highlights.
5. Day-by-day itinerary as a readable vertical timeline or mobile accordions.
6. Included / not included in clearly separated lists sourced per package.
7. Any verified departure/season/fitness notes.
8. Enquiry module with package name prefilled.
9. Related trips based on region/category, not arbitrary popularity claims.

## 6. Mobile and desktop behaviour

- Build mobile-first; support phone widths around 320px through tablet and large desktop.
- Mobile: single-column cards, filters in a drawer/sheet, itinerary in accordions, clear tap targets (about 44px minimum), short paragraphs, and a sticky “Enquire about this trip” action that does not obscure content.
- Desktop: responsive multi-column catalogue, optional filter sidebar, spacious package detail layout with itinerary and enquiry panel arranged side by side where it improves scanning.
- Keep navigation usable by keyboard and touch. Avoid tiny body text, long unbroken itinerary paragraphs, horizontal overflow and text embedded in images.

## 7. Search and filters

Support filters backed by real package data:
- Category / trip type
- Destination or region
- Duration range
- Difficulty (only where the grading is verified)
- Activity: culture, city stopover, trekking, skiing, rafting, wildlife, houseboat/backwaters
- Multi-country indicator where relevant

Provide sort options such as title and shortest/longest duration. Do **not** add a price filter while no prices exist. Make filters work on both mobile and desktop and show a useful empty state with a clear reset action.

## 8. Content/data model

Build the site from package records rather than hand-coded package pages. A package record should support:

- stable internal `id`/slug (never rely on brochure code as the database key)
- title, category, brochure code, short description, full overview
- destinations/regions, duration fields, activity tags
- difficulty label, difficulty scale and verification status
- hero/gallery assets with alt text and image rights/source
- itinerary days with title, description, stops and optional transfer notes
- inclusions, exclusions, meals/accommodation notes
- departures/season/minimum group only when operator-confirmed
- related package IDs
- SEO title/description and social image
- enquiry routing fields
- content status: draft / needs review / approved / published
- internal editorial warnings that must never be shown to visitors

Keep unknown information null or flagged for review. Do not fill missing fields with generic text just to make every card look complete.

## 9. Recommended implementation

Suggested default: **Next.js + TypeScript + Tailwind CSS** with a reusable design system and data-driven routing. A well-structured React SPA can work, but SEO is important for destination and itinerary pages, so prefer server-rendered/static pages where practical.

Build components such as `SiteHeader`, `MobileNav`, `HeroSearch`, `CategoryTile`, `PackageCard`, `FilterPanel`, `DurationBadge`, `DifficultyBadge`, `ItineraryTimeline`, `InclusionsExclusions`, `EnquiryForm`, `HouseboatFeature` and `SiteFooter`.

Technical requirements:
- Use semantic HTML and accessible labels.
- Make search/filter state functional, not decorative.
- Use responsive image sizes, modern image formats and lazy-load below-the-fold imagery.
- Generate unique page titles, descriptions, canonical URLs and Open Graph metadata.
- Add appropriate structured data only when the content supports it; do not fabricate reviews, ratings, prices or offers.
- Use an accessible form with validation, success/error states and a real configured destination for submissions. If no backend is connected yet, clearly implement a development placeholder rather than showing a false “sent” confirmation.
- Use a lightweight, maintainable animation library only if needed; avoid excessive dependencies.
- Add empty, loading and error states where data is fetched.
- Test at mobile, tablet and desktop widths; keyboard navigation; filter combinations; deep links; and slow-network image loading.

## 10. Build acceptance checklist

- All 27 packages appear exactly once in the appropriate category.
- Houseboat booking is represented as a separate service, not an accidental 28th tour package.
- Package cards, filters and detail pages use a shared data model.
- No prices, reviews, availability, contact details or facts are invented.
- Conflicting brochure data is flagged for review and not silently corrected.
- Every itinerary can be scanned on mobile without excessive scrolling through unbroken paragraphs.
- All buttons/forms have real behaviour; no decorative or dead controls.
- Visual hierarchy, image treatment, typography, spacing, badges and buttons remain consistent across the site.
- No horizontal overflow, clipped content, inaccessible contrast, broken images or layout shifts.
- SEO metadata and accessible image text are present on public pages.

## 11. Ready-to-use build prompt for a coding agent

> Act as a senior product designer and senior full-stack engineer. Build a complete, production-quality, mobile-first website for India Nepal Travel Organisation using the package inventory in `travel_packages_catalog.json` and the source brochure `gggg.pdf` if it is available in the project. Do not merely create a landing-page mockup: implement the catalogue, category browsing, filters, package-detail pages, day-by-day itineraries, inclusions/exclusions, Kashmir houseboat service page and enquiry flow.
>
> Before coding, inspect the current repository, identify its framework and existing conventions, and make a short implementation plan. Reuse sound existing code; do not overwrite working configuration unnecessarily. If subagents are available, delegate independent work such as content audit, responsive UI review and SEO/accessibility review, then integrate their findings.
>
> Design direction: premium editorial travel, deep forest green `#16271A`, warm ivory/stone backgrounds, charcoal text, restrained brass/saffron accent, readable Inter/Manrope typography, high-quality destination photography, generous whitespace, clean cards and subtle motion. The result must feel contemporary and trustworthy, not like a brochure converted into HTML or a generic travel template.
>
> Implement responsive navigation; homepage hero and trip finder; category landing pages; a searchable/filterable catalogue; consistent package cards; detail pages with overview, facts, highlights, itinerary timeline, package-specific inclusions/exclusions and enquiry CTA; a houseboat service page; tailor-made trip enquiry; about and contact pages. Package titles, codes, durations, categories and copy must come from data files, not repeated hardcoded JSX.
>
> Include all 27 package records. Preserve official brochure codes unless confirmed otherwise. Put uncertain source values behind internal review flags. Specifically flag the Kathmandu–Pokhara duration, the `II7` code casing, Vale of Kashmir Trek duration, inconsistent Nepal difficulty grades, the 4-day Nepal Mini Trek duplicated itinerary sequence, the contents-page Kashmir Ski versus Enfield Motorbike Tour mismatch, missing Nepal entries in the contents page, and any unclear package-specific inclusions/exclusions. Never invent prices, live availability, hotel names, ratings, testimonials, contact details or current season information.
>
> Make filters genuinely functional for category, region, duration, activity and verified difficulty. Use accessible mobile filter controls, readable itinerary accordions, a sticky mobile enquiry action, desktop layouts that use space well, keyboard navigation, visible focus states, reduced-motion support, optimised images and unique metadata for each package page.
>
> Build enquiry forms with validation and clear loading/success/error states. Do not show a successful submission unless a real backend or email/API integration confirms it. If credentials or contact routing are missing, add a clear integration point and document the setup needed.
>
> After implementation, run the available lint/build/tests, fix errors, inspect representative mobile/tablet/desktop routes, and report what was implemented, what passed, and all unresolved client confirmations. Do not claim completion for untested behaviour. Prioritise polish and consistency across every page over adding unnecessary animation or decorative effects.
