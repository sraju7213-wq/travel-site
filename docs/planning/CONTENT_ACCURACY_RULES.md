# India Nepal Travel Center — Content Accuracy Rules

**Purpose:** This file is the mandatory content-governance rulebook for anyone editing the India Nepal Travel Center website, including developers, AI coding agents, designers, copywriters and SEO editors.

**Primary client source:** `Preview Brouchure(1).pdf` — the 10-page client-provided brochure reviewed for this project.

**Non-negotiable principle:** The brochure is the primary source of truth for factual website content. The website must not contain invented, inferred, embellished, silently corrected or externally researched business/package facts. If the brochure is unclear, contradictory, incomplete or appears outdated, do not guess. Record the issue and request written client confirmation.

---

## 1. Source-of-truth hierarchy

Use this hierarchy for all factual decisions:

1. **Latest written client approval or correction** that explicitly supersedes the brochure.
2. **The client brochure** (`Preview Brouchure(1).pdf`) for facts not superseded by an approved update.
3. Existing website content only as material to audit, not as proof that a claim is true.
4. General knowledge, search results, competitor websites, stock-image captions and AI-generated content are **not** sources for client-specific facts.

If two client sources conflict, do not choose one silently. Record both versions and ask the client which is current. Record the date and exact wording of the approval when it is received.

### 1.1 What counts as a factual claim

Treat all of the following as facts that require source support:

- Company/legal/trading names, founding year, ownership, people, job titles and biographies.
- Office addresses, phone numbers, email addresses, websites, operating locations and agent networks.
- Package names, codes, destinations, route order, trip duration, nights, dates, departures, group sizes and minimum participants.
- Itinerary day labels, activities, transport, accommodation, altitude, distances and difficulty grades.
- Prices, deposits, payment currencies, cancellation/refund terms, surcharges and amendment fees.
- Inclusions, exclusions, meals, hotels, guides, permits, equipment, insurance and safety arrangements.
- Availability, current services, claims such as "best", "largest", "official", "guaranteed", "fully insured" or "award-winning".
- Testimonials, ratings, customer numbers, years of experience, certifications and partnerships.
- SEO titles/descriptions, structured data, image captions and alt text when they make factual claims.

A claim is not safe merely because it already appears on the live website.

---

## 2. Absolute content rules

### 2.1 Do not invent or infer

- Do not make up package duration to fill an empty field.
- Do not infer nights from the number of itinerary days.
- Do not infer a route, travel time, distance, altitude, hotel category, meal plan or transport mode.
- Do not infer that an activity is included because it is mentioned in descriptive copy.
- Do not infer a package's difficulty grade from another package or from a code such as "Grade C" or "Grade D".
- Do not convert `$` to AUD, USD, INR or another currency unless the client confirms the currency.
- Do not calculate or publish prices, taxes, discounts, deposits or fees from incomplete terms.
- Do not invent contact details, legal details, office locations, opening hours, response times or booking guarantees.
- Do not create testimonials, customer reviews, star ratings, travel statistics or awards.
- Do not use a competitor's facts to fill gaps in the client's content.
- Do not let an AI model "complete" a truncated or unclear itinerary.

### 2.2 Do not silently correct the brochure

Preserve names, package codes, day labels, numbers, route names and factual meaning. If a spelling or transcription looks wrong, add it to the confirmation register. A purely typographical change may be made only when it cannot alter a proper noun, place name, route, number, date, measurement or meaning. When uncertain, preserve the source wording and flag it.

### 2.3 Editorial rewriting is allowed within limits

You may improve grammar, readability, sentence flow, headings and formatting, provided that:

- The factual meaning remains unchanged.
- No new promise, amenity, activity, qualification or superlative is introduced.
- No limitation, exclusion, caveat or condition is removed.
- The copy remains faithful to the brochure's level of certainty.
- Any condensed copy can be traced back to its source text.

For every rewritten paragraph, keep a source-page reference in the content data or internal audit record. Do not show internal source references to customers unless the design has a legitimate editorial reason.

### 2.4 Unresolved information must not appear as confirmed public content

When a fact is unclear or contradictory:

1. Do not select a version yourself.
2. Do not publish a guessed replacement.
3. Remove or temporarily suppress the disputed public-facing claim if it could mislead a visitor.
4. Preserve the disputed versions in the internal `FACTS_TO_CONFIRM` register.
5. Ask the client for an explicit answer.
6. Publish the corrected information only after approval.

Do not display internal notes such as "OCR unclear", "developer to confirm", "brochure scan issue", "placeholder", "reconstructed itinerary" or "client to provide" on the public website.

---

## 3. Required content record and traceability

For each package, destination, company profile, contact record and booking-policy section, maintain an internal source record with:

- `recordId` — stable identifier used by the project.
- `displayName` — exact source name, where available.
- `sourceDocument` — `Preview Brouchure(1).pdf` unless superseded.
- `sourcePage` — page number from the brochure (1–10).
- `sourceText` — exact or faithfully transcribed source wording.
- `websiteText` — published text after permitted editorial formatting.
- `verificationStatus` — `source-supported`, `client-confirmed`, `needs-confirmation`, or `withheld`.
- `notes` — internal-only uncertainty or implementation notes.

Do not expose internal-only fields or notes to visitors. Source references may be stored in JSON/TS/MD content data, CMS metadata or a separate audit file.

### 3.1 Status definitions

- **source-supported:** faithfully supported by the brochure, with no known conflict.
- **client-confirmed:** explicitly reconfirmed or updated by the client in writing.
- **needs-confirmation:** incomplete, contradictory, ambiguous, potentially outdated or inconsistent with another source.
- **withheld:** not displayed publicly until confirmation is received.

A package can contain both supported fields and fields that need confirmation. Do not withhold the entire package if only one specific detail is disputed and the rest can be shown accurately. Suppress only the affected claim, unless the inconsistency makes the whole package misleading.

---

## 4. Brochure page map

Use the brochure's printed page numbers, not PDF viewer page offsets:

| Brochure page | Main content | Website content covered |
|---|---|---|
| 1 | Cover, brand name and positioning words | Brand identity and cover-level description |
| 2 | Welcome/company introduction, About Our Tour, Stop Overs and Images of India, accommodation, special-interest programmes, contents, grades, founders and team biographies | About, heritage, operating model, group-size statements, accommodation copy, special-interest services, team profiles, grade explanation |
| 3 | Stop Overs S01–S06 and Kashmir houseboat information | Stopover package pages and houseboat service content |
| 4 | India image tours ii7–ii9 | Golden Triangle, Glorious Goa Stopover, Glimpses of Kerala |
| 5 | India image tours ii10–ii13 | Kashmir packages, Delhi to Kathmandu, Heritage Tour of India |
| 6 | India Tours IT14–IT16 | North India Highlights, India Nepal Combination Tour, South India Highlight |
| 7 | Himalayan Expeditions HE17–HE19 | Markha Valley, Kashmir/Zanskar/Ladakh Trek, Kashmir Combinations "Little Tibet" |
| 8 | Mini Trek in Kashmir MTK20, MTK21 and Kashmir Ski KS22 | Kashmir Mini Adventure, Vale of Kashmir Trek, Kashmir Ski |
| 9 | Nepal Adventure NA23, NA24, HE25, NA26 and HE27 | Himalayan Combination, Trisuli Rafting, Nepal Mini Treks, Nepal Wildlife Safari |
| 10 | Booking conditions and booking form | Booking, amendments, payment, cancellation, documentation, changes, tour costs, luggage, insurance, health, surcharges, complaints, advice, liability, deposit and contact details |

---

## 5. Package source inventory

The following inventory is a navigation/reference index, **not permission to fill missing fields by inference**. Keep package labels and codes exactly as printed unless the client approves a correction.

| Brochure page | Printed name / code | Duration or grade as printed | Accuracy note |
|---|---|---|---|
| 3 | Delhi — S01 | 2 nights / 3 days | Source itinerary is Day 1–Day 3. |
| 3 | Bombay — S02; itinerary title "Magic Mumbai" | 3 nights / 4 days | Preserve both printed wording and code; do not silently rename. |
| 3 | Discover Leh — S03 | 3 nights / 4 days | Source itinerary is Day 1–Day 4. |
| 3 | Kathmandu — S04 | 3 nights / 4 days | Source itinerary is Day 1–Day 4. |
| 3 | Kathmandu Pokhara — S05 | 4 days / 3 nights | Keep the printed order/name as approved by client. |
| 3 | Discover Ladakh — S06 | Described as a 5-day expedition | No nights count should be inferred. |
| 4 | Golden Triangle — ii7 | 4 days / 3 nights | Itinerary has combined Day 03–04 wording; preserve source structure until checked. |
| 4 | Glorious Goa Stopover — ii8 | 5 days / 4 nights | Source contains Day 1–Day 5 descriptions. |
| 4 | Glimpses of Kerala — ii9 | 6 days / 5 nights | Source includes itinerary and highlights. |
| 5 | Kashmir Package — ii10 | 7 days / 6 nights | **Conflict:** visible itinerary is numbered Day 01–Day 06 only. Do not invent Day 7. |
| 5 | Kashmir Package — ii11 | 4 days / 3 nights | Source itinerary is Day 1–Day 4. |
| 5 | Delhi to Kathmandu — ii12 | No separate duration badge visible | Itinerary is numbered Day 1–Day 8. Do not create a formal duration label without confirmation. |
| 5 | Heritage Tour of India — HTi13 | No separate duration badge visible | Itinerary is numbered Day 01–Day 15. Confirm whether to display "15 days" before adding it as a package-duration field. |
| 6 | North India Highlights — IT14 | 18 nights / 19 days | Preserve source route and Day 1–Day 19 itinerary. |
| 6 | India Nepal Combination Tour — IT15 | 15 nights / 16 days | Preserve source route and Day 1–Day 16 itinerary. |
| 6 | South India Highlight — IT16 | 13 nights / 14 days | Preserve exact singular/plural naming unless client approves style correction. |
| 7 | Markha Valley — HE17 | 9 nights / 10 days; Demanding | Grade explanation is on brochure page 2. |
| 7 | Kashmir, Zanskar and Ladakh Trek — HE18 | "24 day round trip" / "24 day trek" wording appears | Duration wording and some day transitions need client confirmation. Do not tidy into a new claim. |
| 7 | Kashmir Combinations "Little Tibet" — HE19 | "19 day round trip"; 7 day trek | Itinerary's day-by-day sequence should be preserved exactly pending review. |
| 8 | Kashmir Mini Adventure — MTK20 | 6 nights / 7 days; Demanding badge | Source itinerary is Day 01–Day 07. |
| 8 | Vale of Kashmir Trek — MTK21 | 6 nights / 7 days; Grade C shown in text | Preserve the distinction between the badge and printed grade wording; confirm if they are equivalent. |
| 8 | Kashmir Ski — KS22 | 7 days / 6 nights | Contents page instead lists "Himalaya Enfield Motorbike Tour" for this section. **Major discrepancy.** |
| 9 | Himalayan Combination HC — NA23 | 20-day round trip; 8-day trek, 3-day rafting, 4-day jungle safari; Moderate | Package title/abbreviation and combined itinerary should be checked against client's intended name. |
| 9 | Trisuli Rafting — NA24 | Easy; departures October–March; minimum 2 persons | Additional 2- and 3-day white-water trips are mentioned. No base trip duration is stated. |
| 9 | 4 Day Nepal Mini Trek NM1 — HE25 | 4 days / 3 nights; Grade D | Itinerary contains repeated/unclear place sequence. Do not repair route names or order without approval. |
| 9 | Nepal Wildlife Safari — NA26 | 3 nights / 4 days; Easy | Source includes Chitwan accommodation/meals and safari details; preserve precise scope. |
| 9 | 7 Day Nepal Mini Trek NM2 — HE27 | 7 days / 6 nights; Grade D | Place names and itinerary sequence require careful transcription and client confirmation where ambiguous. |

**Important:** The brochure's printed contents on page 2 lists "Himalaya Enfield Motorbike Tour" for the mini-trek section, while page 8 visibly presents "Kashmir Ski" with code KS22. Do not invent an Enfield package page or assume KS22 is the intended replacement. Ask the client whether the motorbike tour is missing, withdrawn or replaced.

---

## 6. Company, heritage and team content rules

### 6.1 Company name and founding history

- Page 2 says: "Established in 1927, India Nepal Travel Organisation...".
- The cover and booking form use "INDIA NEPAL TRAVEL CENTRE".
- Page 2 also describes the Baktoo family and its tourism history since 1927.

**Do not standardise the legal or trading name yourself.** Ask the client to confirm the exact legal entity name, customer-facing trading name and preferred spelling ("Centre" or "Organisation"). "Since 1927" is supported by the brochure, but the current legal entity and continuity of operation should be confirmed before making a formal legal claim.

### 6.2 Family and team biographies

The brochure page 2 contains profiles for Sultan Baktoo, Farook Baktoo, Imtiaz Ahmad and Hashim. It also refers to Yusuf Baktoo in the founders paragraph, but no corresponding Yusuf profile is shown in that section.

- Do not invent biographies, current job titles, current employment status or family relationships.
- Keep historic statements in their historic context.
- Ask the client to confirm that each person is still associated with the business and that biography details remain current.
- Ask whether Yusuf Baktoo should have a profile or whether the reference should be changed.

### 6.3 Offices, fleet, agents and operating claims

Page 2 mentions offices in Delhi, Kashmir and Ladakh, hotels, a fleet of cars in Delhi, houseboats in Kashmir, and agents/sub-agents in India and Nepal. These may describe the brochure's original operating arrangement.

Do not automatically present them as current capabilities. Obtain client confirmation before publishing present-tense claims such as "we operate", "our fleet", "our offices" or "our agents".

### 6.4 Group size and departures

Page 2 says tours are guaranteed to depart, can be enjoyed by a small group of up to 15 or by a solo traveller, and that itineraries are outlines which may change. Treat these as source statements that require confirmation of current applicability before putting them into booking promises or prominent sales copy.

---

## 7. Grades and accommodation

### 7.1 Grade descriptions on brochure page 2

Transcribe carefully and preserve the source's thresholds:

- **Easy:** Suitable for beginners; relaxed walks or good paths; 6–12 km per day; up to 2,500 m altitude.
- **Moderate:** Requires reasonable fitness; some steep ascents and descents; 6–12 km per day; up to 4,200 m altitude.
- **Demanding:** For experienced hill-walkers; challenging terrain and longer days; 10–15 km per day; up to 4,500 m altitude.
- **Strenuous:** For very experienced trekkers; difficult terrain, high passes and possible rope use; 10–15 km per day; up to 5,000 m altitude.

Do not convert these into medical or safety guarantees. If a package carries a letter grade (for example Grade C or Grade D), do not map it to Easy/Moderate/Demanding/Strenuous unless the client provides that mapping.

### 7.2 Accommodation

Page 2 says accommodation is carefully selected and uses well-serviced, centrally located hotels; some properties are selected for ambience/history and others for environmental considerations and special inclusions. It asks travellers to advise of particular requirements.

Do not turn this into a specific hotel-star rating, named hotel list, room guarantee, universal amenity promise or package-specific inclusion unless that package's own source text supports it.

---

## 8. Booking conditions and legal/policy content

Brochure page 10 includes booking, amendments, payment, cancellation/refunds, documentation, possible changes and delays, items not included, tour costs, luggage, insurance, health, surcharges, dissatisfaction, advice to travellers and liability.

**Treat the page 10 material as legacy policy wording until the client confirms it is current.** It has no visible revision date and contains currency/financial/legal terms that should not be casually reworded.

In particular:

- A deposit of `$200 per person` appears. Do not assign a currency or publish the amount without client confirmation.
- A `$25 per amendment` charge appears. Confirm amount, currency and applicability.
- Cancellation percentages and time bands appear. Do not simplify, reorder or recalculate them.
- Payment timing refers to the balance being due no later than 8 weeks before departure and mentions exchange rates as at 1 September 2014. Confirm current payment timing and whether the historical exchange-rate reference remains applicable.
- The page discusses visa, insurance, baggage over 20 kg, meals, laundry, porterage, drinks, souvenirs and other personal expenses as exclusions. Do not assume every item applies identically to every package; package-specific inclusion boxes may differ.
- Insurance wording describes insurance as a condition of booking and mentions a possible policy offer. Do not claim the company provides, includes or underwrites insurance.
- Changes, delays, surcharges, complaints and liability are legal/policy subjects. Do not rewrite their legal effect. Obtain approved current wording and legal review where appropriate.
- The page includes personal-document and health/training advice. Do not convert it into medical or immigration advice.

Until the client reconfirms the terms, either withhold them from the public booking flow or show only a clearly labelled "Please contact us for current booking conditions" message approved by the client. Do not present old terms as current.

---

## 9. Contact information and identity mismatch

The brochure page 10 booking form includes:

- `indianepaltravel@yahoo.com.au`
- `www.indianepaltravel.com`
- Contact block labelled "ASIAN BAZAAR"
- `68 Beauchamp St, Wiley Park, NSW 2195`
- `0409 555 129`
- `02 9579 0044`
- `asianbazaar@live.com.au`
- `www.asianbazaar.org`
- `www.exportofindia.com`

This is not a clean, single-brand contact record. It contains India Nepal Travel Centre branding alongside an Asian Bazaar contact block and multiple web/email identities.

**Do not copy all of these into the current website automatically.** Ask the client to confirm which details belong to India Nepal Travel Center, which are current, which should be shown publicly and which are unrelated/legacy details. Do not invent an Indian office address or phone number to replace them.

---

## 10. Images, maps and visual claims

- Use images only as visual illustrations unless the client confirms they depict the actual hotel, vehicle, guide, property, activity or trip being sold.
- Do not label stock photography as "our houseboat", "our hotel", "our team", "our vehicle" or an actual package location unless verified.
- Do not infer exact location from a photograph alone.
- Use descriptive, truthful alt text. Do not stuff keywords or make unsupported claims in alt text.
- Maps must follow the brochure itinerary or client-approved route. Do not add stops, borders, roads, distances, travel times or transport modes based on a guess.
- If a source photograph's identity or location is uncertain, use neutral alt text or flag it for verification.

---

## 11. Website-wide audit coverage

Audit **every route and every content surface**, not only the homepage:

- Homepage hero, headings, cards, counters, highlights and footer.
- All destination pages and destination filters.
- All journey/package catalogue cards and individual detail pages.
- Itinerary timelines, route maps and day-by-day descriptions.
- Inclusions/exclusions, accommodation, difficulty, duration and group-size labels.
- About, heritage, founder, team and company-history pages.
- Houseboat/service pages and special-interest programme pages.
- Contact page, contact widgets, header/footer contact details and social profiles.
- Enquiry form defaults, confirmation pages, automated emails and WhatsApp messages.
- Booking conditions, terms, privacy notice and other legal/policy pages.
- SEO title/description, Open Graph metadata, JSON-LD/schema, sitemap labels and image alt text.
- Hidden, mobile-only, modal, dropdown, tooltip and client-side rendered content.

An inaccurate fact in metadata or an automated email is still an inaccurate fact.

---

## 12. Required audit and correction workflow

1. Locate and read the complete brochure, including page images. Do not rely only on imperfect OCR or extracted text.
2. Inventory all website routes and all locations where content is stored or generated.
3. Extract each factual claim currently published.
4. Match each claim to a brochure page or an approved client update.
5. Classify it as `source-supported`, `client-confirmed`, `needs-confirmation` or `withheld`.
6. Fix claims that clearly conflict with the source and have an unambiguous source value.
7. Suppress disputed or unsupported public claims; do not fabricate replacements.
8. Keep existing visual design, interaction, routing, SEO architecture and business logic unless a change is required to correct content or prevent a misleading user journey.
9. Add source traceability to the internal content records or audit documents.
10. Produce an unresolved questions list for the client.
11. Test every affected page on desktop and mobile and check all enquiry links.
12. Report exactly what was changed, withheld and left pending. Do not claim full accuracy while any unresolved fact remains.

---

## 13. Acceptance criteria

The content correction is complete only when:

- Every public factual claim has a source reference or written client approval.
- No package duration, route, day, grade, activity, inclusion or exclusion has been invented.
- All brochure conflicts are recorded and not silently resolved.
- No internal editorial note, placeholder, OCR uncertainty or developer comment is visible to visitors.
- No unconfirmed historical booking term or contact detail is presented as current.
- Package-specific enquiry links carry the correct package identity, or do not claim a package is selected.
- All page titles, descriptions, schema and alt text are consistent with approved content.
- The 27-package count is not advertised unless the client confirms the final product catalogue, including the missing/mismatched Enfield Motorbike Tour entry.
- An audit report lists all remaining client questions and withheld claims.

**Final rule:** A missing fact is safer than a fabricated fact. Ask for approval; never guess.