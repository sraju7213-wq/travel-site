# Reference Site Analysis — Wilderness Destinations

**Source:** https://www.wildernessdestinations.com/  
**Reviewed states:** homepage, `/africa` (destinations), `/experiences`, `/africa/tours/botswana-wildest-regions` (tour detail), `/contact`  
**Method:** Fetched via reader/markdown conversion; interactive JS states (mega-menu open/close, mobile drawer) not directly observable and marked unverified.  
**Rule observed:** Observed facts separated from suggestions. No branding, copy, imagery, code, or proprietary assets copied.

---

## 1. Information architecture (observed)

Top-level navigation (from `SiteNavigationElement` schema and visible page):
- Destinations → `/africa` (country landing pages under `/africa/[country]`)
- Camps → `/camps`
- Experiences → `/experiences` (grouped by Safari, Wellness, Culture & Impact, Photography)
- Journeys → `/africa/tours`
- Exclusive offers → `/exclusive-offers`
- Impact → `/impact`
- Journal → `/journal`
- About → `/about` (with sub-pages: Awards, Press Room, Contact, Careers)
- Prominent "Enquire now" action recurring in header, section footers, and contact page

Expanded/footer navigation groups links by: company (About, Impact, Awards, Press Room, Contact, Careers), destination safaris by country, safari types (Family, Couples, Seniors, Solo, Walking, Birding, Gorilla Trekking, Safari & Beach), journeys/camps/services, planning, store, legal.

**Unverified:** mega-menu behaviour, exact mobile drawer structure, whether navigation is sticky, whether "Enquire now" is in the global header at all breakpoints.

## 2. Homepage sequence (observed)

1. Cinematic hero: large landscape photo (lion in grassland), short brand promise ("Discover Earth's ultimate, untamed places"), mission statement since 1983.
2. "Our destinations are vast..." — destination/region intro with country tiles (Botswana, Zambia, Rwanda, Namibia, Zimbabwe, Kenya, South Africa, Tanzania), each with image + short paragraph + "Enquire now" on some.
3. Stat blocks: Camps (55+), Countries, Private (2.2M hectares), Bespoke (tailor-made DMC), Community — each image-led with one-line summary.
4. Tailor-made journeys section → "Explore our safari journeys".
5. Experiences section: image-led topics (Game Drives, Mokoro, Hot air ballooning, Star Bed Safaris, Guided Walking Safaris, Hides, Conservation Experiences), each with applicable countries, title, short description, "Learn more"-style link.
6. "Travel with Purpose / Why travel with Wilderness" — editorial blocks (Wildlife, Guides, Architecture, Culture, Travel, Impact) each with image, heading, short body, internal link.
7. Awards/recognition section ("Renowned worldwide") with named awards and property names.
8. Testimonials ("Guest Experiences") with Trustpilot logo, 4.8-star / 134 review aggregate, named guest quotes with star ratings.
9. Final CTA "Let's plan your next journey / Ready?" — "Contact our Travel Designers", "Enquire now".
10. Newsletter signup (first name, surname, email, country of residence) + detailed footer.

## 3. Tour detail page structure (observed — `/africa/tours/botswana-wildest-regions`)

- Hero image (16:9 landscape), title, destination tags.
- Meta summary list: nights, camps, from price per person.
- Destinations list.
- Travel designer / expert intro (named person, role, short quote, photo).
- Image gallery carousel with per-image captions (camp name / activity).
- Accommodation summary table: Days | Camps | Experiences (date ranges per camp).
- Highlights bullet list.
- "Your Itinerary": day-by-day sections, each with Day N, locations, transport mode + duration, narrative, camp detail (nights, room type), selected experiences with "Learn more" links.
- Recurring "Enquire now" CTA at page bottom.
- Schema: TouristTrip offer, Organization, price currency USD.

**Unverified:** whether inclusions/exclusions are listed on this page (not visible in extracted content), mobile layout specifics.

## 4. Experiences page (observed — `/experiences`)

- Hero + intro.
- Experience categories: Safari, Wellness, Culture & Impact, Photography (each image + short description + "See all" link).
- Individual experience topics (Game Drives, Mokoro, Hot Air Ballooning, Star Beds, Guided Walking Safaris, Hides, Conservation Experiences), each with: image, title, short description, applicable destination countries, detail link.
- "Browse all" with filters: Destination (country → sub-region with counts), Experience Type, Suitable for (trip type/audience). Counts shown next to each filter option. "Filter" button. "Clear all".

## 5. Contact page (observed — `/contact`)

- Regional offices listed with name, phone, opening hours, time zone (Johannesburg, Cape Town, Maun, Gaborone, Tanzania).
- Email routing by purpose: booking enquiries, partnerships, media & PR, marketing collaborations, whistleblowing.
- Emergency after-hours mobile.
- WhatsApp chatbot number.
- Recurring "Enquire now" CTA + newsletter signup at bottom.
- Schema: Organization with contactPoints (telephone, hours, address, language).

## 6. Visual language & page rhythm (observed)

- Large landscape photography is the primary emotional hook; one strong image per section/topic.
- Dark forest/charcoal section transitions alternate with lighter sections.
- Uppercase eyebrow labels, larger editorial headings, controlled text widths.
- Sections use varied layouts (full-width image, two-column image/text, stat blocks, table, timeline) — not one repeated card grid.
- Enquiry CTAs recur at useful points (hero, section footers, detail page bottom).
- Full site links to deeper content (destination sub-pages, camp pages, experience pages, journal).

## 7. Content & conversion patterns (observed)

- Every tour card links to a real detail page.
- Detail pages show nights, camps, destinations, price-from, itinerary day-by-day, accommodation, selected experiences.
- "Enquire now" is the primary conversion; no instant booking/price checkout visible on detail pages (price shown as "from" only).
- Newsletter signup recurring.
- Trust signals used: awards, testimonials with aggregate rating, named travel designers, regional office phone numbers with hours.

---

## 8. Adaptation map for India–Nepal travel site

| Reference pattern | Why it works | Adaptation for India/Nepal site | Files/pages likely affected |
|---|---|---|---|
| Grouped navigation: Destinations / Experiences / Journeys / About + persistent Enquire | Gives visitors multiple exploration paths and a constant conversion route | Destinations: Kashmir, Ladakh, North India, South India, Nepal. Tours & Packages: Stopovers, India Tours, Himalayan Expeditions, Kashmir Mini Treks, Nepal Adventures. Experiences: trekking, rafting, houseboat, heritage, wildlife, culture (only where data supports). Plan Your Trip / custom journey. About. Footer grouping by company/destinations/categories/legal. | `src/components/SiteHeader.tsx`, `src/components/MobileNav.tsx`, `src/components/SiteFooter.tsx`, new route files |
| Cinematic hero + short brand promise | Immediate emotional hook, sets positioning | Hero with Kashmir/Ladakh/Himalaya or India/Nepal landscape image, truthful headline based on brochure (est. 1927, tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries, Kashmir houseboats), two actions: Explore journeys / Plan a trip | `src/app/page.tsx` hero |
| Destination tiles with image + summary + link | Scannable destination discovery | Tiles per real region backed by package data, each linking to `/destinations/[slug]` or category page | `src/app/page.tsx`, new `/destinations` routes |
| Stat blocks (camps, countries, private access, bespoke, community) | Quick credibility scan | Replace with verified operator facts only (established 1927 per brochure; tailor-made and small-group; Himalayan trekking; houseboats). Do NOT copy "55+ camps", "2.2M hectares", private access, or community claims. | `src/app/page.tsx` |
| Experiences as image-led topics with countries + link | Activity-based discovery alternative to destinations | Experience pages only for categories with real package/destination support: trekking (Himalayan Expeditions, Kashmir Mini Trek, Nepal Adventure), rafting (Trisuli), houseboat/backwaters (Kashmir, Kerala), heritage/culture (Rajasthan, Golden Triangle), wildlife (Periyar, Chitwan), skiing (Gulmarg Jan–Mar). | `/experiences` and `/experiences/[slug]` if data supports |
| Detail page: hero, meta (nights/camps/destinations), expert intro, gallery, itinerary day-by-day, highlights, recurring enquiry | Complete scannable itinerary + conversion | Reusable `/packages/[slug]` template: breadcrumbs, hero, title/package code/duration/difficulty(only if verified), overview, highlights, day-by-day itinerary timeline, inclusions/exclusions separated, related packages, enquiry CTA carrying package identity | `src/app/packages/[slug]/page.tsx` |
| Filterable catalogue with counts + clear all + empty state | Helps narrow large inventory | Search by name/code; filters: category, region, duration, activity; difficulty only where verified; result count; reset; functional empty state; URL query state | `src/components/SearchAndFilters.tsx`, `src/app/explore/page.tsx` |
| Enquiry flow with package context + custom trip option | Connects inspiration to action without fake booking | Enquiry prefilled from package page; custom itinerary option for non-package travellers; name, contact, dates, travellers, open text; validation, loading, truthful success/error; no instant booking claim | `/enquiry` page + `EnquiryForm` component |
| Regional contact details + purpose-routed email | Trust + correct routing | Only if business supplies verified phone/email/address. Otherwise do not invent; provide enquiry form with documented integration boundary | `/contact` page |
| Newsletter signup + detailed footer | Secondary conversion + legal | Footer with real links only; newsletter only if email service configured; social links only when supplied | `src/components/SiteFooter.tsx` |
| Awards/testimonials aggregate | Credibility | Do NOT copy. No verified awards/review counts exist for this business. Use genuine operator expertise, itinerary detail, inclusions/exclusions, guide/transport info where confirmed instead. | n/a — intentionally omitted |

## 9. Patterns to deliberately NOT copy

- Wilderness brand identity (name, logo, "WE ARE WILDERNESS", conservation voice).
- Conservation/impact claims ("doubling wilderness by 2030", "Educate, Empower, Protect", 2.2M hectares).
- Review stars / aggregate ratings / Trustpilot integration (4.8★, 134 reviews).
- Award names and property names.
- Pricing ("From USD 14,469 per person") — this business has no verified prices.
- Instant booking or availability messaging.
- Specific camp/lodge names, vehicle types, flight arrangements unless confirmed in brochure.

## 10. Unverified reference states

- Mega-menu open/close behaviour and keyboard handling at desktop.
- Mobile drawer structure and nested sections.
- Whether global header "Enquire now" persists at all breakpoints.
- Detail-page inclusions/exclusions section presence.
- Mobile layout of catalogue filters and itinerary page.
- Filter URL query persistence behaviour.
- Exact breakpoints and spacing scale used.

These should be treated as design-direction inputs, not specifications to replicate.

---

**Next:** Use this with `docs/baseline-audit.md` and the brochure/catalogue to write `docs/modernization-plan.md`.