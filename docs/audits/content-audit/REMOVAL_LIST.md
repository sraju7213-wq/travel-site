# Frontend finalisation — content removal list

Audit date: 2026-11-26. Source of truth: `C:/Users/pc/Desktop/Preview Brouchure.pdf` (10 scanned pages; rendered and visually inspected, not OCR-only). Rules: `docs/planning/CONTENT_ACCURACY_RULES.md`.

Page reference note: PDF image `page-NN.png` corresponds to printed folio `NN-1` for images 02–09. This report uses PDF image numbers so findings can be re-checked against the rendered files.

## Verdict

The frontend is **not content-final**. There are 121 site-level findings (43 REMOVE, 35 REPLACE-WITH-NEUTRAL, 43 KEEP-WITH-CONFIRMATION), 61 field-level catalogue findings, and 7 catalogue-level issues. No public copy has been changed in this audit; nothing below has been applied.

The highest-risk problem is not the brochure conflicts themselves — it is that internal editorial notes, build-status messages, test CRM data and unresolved grade/duration conflicts are currently **rendered to visitors**.

## P0 — remove/suppress before calling the frontend final

| File:line | Current text | Why it must go | Action |
|---|---|---|---|
| `app/src/components/package/PackageWorkspace.tsx:139` | (see source line) | Internal transcription-note block rendered on all flagged package pages | REMOVE / SUPPRESS |
| `app/src/components/package/PackageWorkspace.tsx:147` | • {flag} | Verbatim content_flags rendered to visitors | REMOVE / SUPPRESS |
| `app/src/components/houseboats/HouseboatStay.tsx:87` | {flag} | Houseboat pre-publication confirmation note rendered to visitors | REMOVE / SUPPRESS |
| `app/src/components/InclusionsExclusions.tsx:86` | (see source line) | Brochure code/source page exposed in public inclusions panel | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:254` | Mentioned in the brochure&apos;s founders passage as supervising specialist tours. | Internal 'mentioned in the brochure' editorial note about a person | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:269` | Listed in the brochure&apos;s team profiles. | Internal source note presented as biography | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:284` | Listed in the brochure&apos;s team profiles. | Internal source note presented as biography | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:303` | &mdash; Baktoo family archives | Fabricated quotation attribution to 'Baktoo family archives' | REMOVE / SUPPRESS |
| `app/src/components/journeys/CoverflowSwiper.tsx:363` | {pkg.difficulty} | Raw conflicted difficulty string rendered as a badge | REMOVE / SUPPRESS |
| `app/src/components/PackageCard.tsx:133` | {cleanDifficulty} | Conflicted difficulty label only partially cleaned | REMOVE / SUPPRESS |
| `app/src/components/journeys/PosterRail.tsx:16` | (see source line) | Letter-to-word grade mapping function | REMOVE / SUPPRESS |
| `app/src/components/journeys/TrendingJourneys.tsx:15` | (see source line) | Letter-to-word grade mapping function | REMOVE / SUPPRESS |
| `app/src/components/EnquiryForm.tsx:400` | Online Intake System Pending Activation | Build-status notice rendered publicly | REMOVE / SUPPRESS |
| `app/src/components/EnquiryForm.tsx:403` | Online enquiry submission is currently inactive while backend intake systems are being finalized. Form inputs are disabled so that no personal cont... | Internal implementation note rendered publicly | REMOVE / SUPPRESS |
| `app/src/components/EnquiryForm.tsx:416` | Encrypted transmission directly to reservations desk | Unverified 'encrypted transmission directly to reservations desk' claim | REMOVE / SUPPRESS |
| `app/src/app/contact/page.tsx:134` | Online enquiry system: configuration pending | Build-status system-state copy rendered publicly | REMOVE / SUPPRESS |
| `app/src/app/contact/page.tsx:139` | The submission backend is being finalised. Until it is connected, please use the enquiry form and we will reply by email. | Internal backend-finalisation note plus reply promise | REMOVE / SUPPRESS |
| `app/src/app/privacy/page.tsx:67` | Submissions are transmitted securely over TLS 1.3 / HTTPS to our Next.js API handler (/api/enquiry). When the backend database is configured, recor... | Specific TLS/HTTPS technical claim not verified against implementation | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:47` | Sample Initial Data (Brochure-grounded) | Declares sample/test enquiry data | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:53` | name: "Eleanor Vance", email: "eleanor.vance@gmail.com", phone: "+44 7700 900123" | Fabricated enquiry identity | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:969` | 27 verified packages & 1 houseboat service synchronized directly from brochure catalogue archives. | Unresolved 27-count advertised as verified | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:1034` | 100% Brochure Verified | Unverifiable '100% Brochure Verified' claim | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:1419` | All 27 verified brochure itineraries synchronized with public exploration routes | Unresolved 27-count advertised as verified | REMOVE / SUPPRESS |
| `app/src/app/admin/page.tsx:1677` | 27 / 27 Verified | Unresolved 27-count advertised as fully verified | REMOVE / SUPPRESS |
| `app/src/data/siteContent.ts:228` | Accredited wildlife trackers and regional specialists interpret native flora and fauna. | Invents accreditation/certification of wildlife guides | REMOVE / SUPPRESS |
| `app/src/data/siteContent.ts:256` | Handpicked Heritage Havelis, Palace Hotels & Boutique Stays | Invents hotel categories and a 'handpicked' claim | REMOVE / SUPPRESS |
| `app/src/data/siteContent.ts:303` | Comfortable air-conditioned vehicles and vetted professional drivers for all road routes. | Invents vehicle amenity and driver vetting claims | REMOVE / SUPPRESS |
| `app/src/data/siteContent.ts:304` | Seamless airport greetings and station transfer logistics handled without stress. | Invents arrival/departure inclusions for every package | REMOVE / SUPPRESS |
| `app/src/components/HomeHero.tsx:152` | {currentVideo.coordinates} | Exact GPS coordinates not in brochure | REMOVE / SUPPRESS |
| `app/src/components/HomeHero.tsx:155` | {currentVideo.location} &bull; {currentVideo.altitude.split("/")[0].trim()} | Exact altitudes not in brochure | REMOVE / SUPPRESS |
| `app/src/components/houseboats/HouseboatHero.tsx:26` | meta={[{ value: "34.0837° N, 74.7973° E", label: "Dal & Nigeen Lakes, Srinagar" }]} | Exact coordinates not in brochure | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:86` | Guaranteed departures* | Guaranteed-departure sales claim pending confirmation | REMOVE / SUPPRESS |
| `app/src/app/about/page.tsx:372` | Every journey can be tailored to your dates, party size and interests. All tours are guaranteed to depart with a small group of up to 15, or as a s... | Explicit guaranteed-departure promise | REMOVE / SUPPRESS |

### P0 group notes

- **Internal notes on package pages:** `PackageWorkspace.tsx:139-152` prints a 'Brochure transcription note' followed by every `content_flags` entry. Verified live on `/packages/kathmandu-pokhara`. This must be removed from the public component and kept only in an internal register.
- **Internal notes on houseboats:** `HouseboatStay.tsx:82-91` prints the service's 'Confirm ... before publishing' instruction. Same treatment.
- **Source references:** `InclusionsExclusions.tsx:84-89` prints 'Brochure Reference: <code> · Page <n>' on package pages; remove from public UI.
- **Grade conflicts:** `PosterRail.tsx:16-24` and `TrendingJourneys.tsx:15-23` convert letter grades into word badges. Rule 8 forbids mapping C/D to Easy/Moderate/Demanding/Strenuous without client confirmation. Suppress all grade badges for MTK21, NA23, HE25 and HE27, and suppress raw conflict strings such as 'Easy badge; Grade D also printed' everywhere.
- **Backend status:** the enquiry form, contact page and admin page currently expose build-state copy and claims about encrypted/active transmission. With backend work about to start, strip all status/implementation wording from public UI; keep a single neutral 'enquire' affordance until a real destination exists.
- **Test data:** `admin/page.tsx` ships sample names, emails, phone numbers and '27 verified' claims. Remove from the frontend bundle even though the route is key-gated.
- **Invented specifics:** GPS coordinates/altitudes (`heroVideos.ts`, `HomeHero`, `HouseboatHero`, `contact/page.tsx`), guide accreditation, vehicle/driver claims and hotel categories are not brochure facts. Remove or replace with neutral, source-supported wording only after approval.

## P1 — withhold disputed package facts until the client confirms

21 catalogue records carry `content_flags`: 20 packages plus the houseboat service. Their internal notes must not be displayed publicly, and the disputed fields listed below should be hidden from cards, badges, hero labels, sidebar and enquiry preselection until confirmed.

| Record | Code | Title | Printed duration | Difficulty field | Flags |
|---|---|---|---|---|---|
| `kathmandu-pokhara` | S05 | Kathmandu–Pokhara | 3 nights / 4 days per contents and itinerary | — | 1 |
| `golden-triangle` | II7 | Golden Triangle | 3 nights / 4 days | — | 1 |
| `glimpses-of-kerala` | II9 | Glimpses of Kerala | 5 nights / 6 days | — | 1 |
| `kashmir-package-7-day` | II10 | Kashmir Package | 6 nights / 7 days | — | 1 |
| `kashmir-package-4-day` | II11 | Kashmir Package | 3 nights / 4 days | — | 1 |
| `delhi-to-kathmandu` | II12 | Delhi to Kathmandu | 7 nights / 8 days | — | 2 |
| `north-india-highlights` | IT14 | North India Highlights | 18 nights / 19 days | — | 1 |
| `india-nepal-combination` | IT15 | India Nepal Combination Tour | 15 nights / 16 days | — | 2 |
| `south-india-highlight` | IT16 | South India Highlight | 13 nights / 14 days | — | 1 |
| `markha-valley` | HE17 | Markha Valley | 9 nights / 10 days | Demanding (as printed) | 1 |
| `kashmir-zanskar-ladakh-trek` | HE18 | Kashmir, Zanskar and Ladakh Trek | 24-day round trip; 15-day trek (as printed) | Strenuous (as printed) | 2 |
| `kashmir-combinations-little-tibet` | HE19 | Kashmir Combinations: Little Tibet | 19-day round trip; 7-day trek (as printed) | Moderate (as printed) | 2 |
| `kashmir-mini-adventure` | MTK20 | Kashmir Mini Adventure | 6 nights / 7 days | Demanding (as printed) | 1 |
| `vale-of-kashmir-trek` | MTK21 | Vale of Kashmir Trek | 7 days / 6 nights | Moderate / Grade C (as printed in body text) | 1 |
| `kashmir-ski` | KS22 | Kashmir Ski | 6 nights / 7 days | — | 1 |
| `himalayan-combination-nepal` | NA23 | Himalayan Combination HC | 20-day round trip | Moderate badge; body text also says Grade D | 2 |
| `trisuli-rafting` | NA24 | Trisuli Rafting | Day trip; no fixed duration printed | Easy (as printed) | 1 |
| `nepal-mini-trek-4-day` | HE25 | 4 Day Nepal Mini Trek | 3 nights / 4 days | Easy badge; Grade D also printed | 2 |
| `nepal-wildlife-safari` | NA26 | Nepal Wildlife Safari | 3 nights / 4 days | Easy (as printed) | 1 |
| `nepal-mini-trek-7-day` | HE27 | 7 Day Nepal Mini Trek | 6 nights / 7 days | Easy badge; Grade D also printed | 1 |
| `kashmir-houseboat-booking` | — | Houseboat Booking Service for Kashmir | — | — | 1 |

Field-level detail (61 records) is in `claims-register.json` under `catalog_findings`; the highest-frequency issues are:

- **27 journeys/packages count advertised as verified** — `app/admin/page.tsx:969 ('27 verified packages'), :1419 ('All 27 verified brochure itineraries'), :1677 ('27 / 27 Verified'); travel_packages_catalog.json:4 (package_count: 27). Client-side password gate at admin/page.tsx:201,425 only.`. Action: WITHHOLD the count from all public/admin UI until the client confirms the final catalogue and resolves the KS22 Kashmir Ski vs Himalaya Enfield Motorbike Tour contents discrepancy; use non-numeric copy.
- **difficultyVerified=false does not suppress grade badges** — `data/catalogue.ts:27-28 computes difficultyVerified (false for 7 of 10 graded packages) but no component consumes it; PackageCard.tsx:32-33,131-134,170-172; PackageHero.tsx:96; CoverflowSwiper.tsx:361-364 render grade labels unconditionally.`. Action: Gate every grade badge on difficultyVerified/client confirmation; suppress all unqualified or conflicted grade labels.
- **Letter grades (Grade C/D) mapped to word grades** — `components/journeys/PosterRail.tsx:16-24 and components/journeys/TrendingJourneys.tsx:15-23 verdict() maps strings containing 'easy'/'moderate'/'demanding' to 'Easy going'/'Moderate'/'Demanding'; PosterRail is used at journeys/page.tsx:65-72 for NA23/HE25/HE27.`. Action: Remove the verdict() mapping; do not present any word grade for MTK21/NA23/HE25/HE27 until the client supplies the letter-to-word grading scale.
- **Internal content_flags exposed verbatim on public pages** — `PackageWorkspace.tsx:139-152 (20 packages); HouseboatStay.tsx:82-91 via houseboats/page.tsx:77 (1 service).`. Action: Remove content_flags from public rendering and keep them only in the internal FACTS_TO_CONFIRM register.
- **Internal source-page reference shown in inclusions panel** — `InclusionsExclusions.tsx:84-89 renders 'Brochure Reference: <code> · Page <n>' on all 27 package pages.`. Action: Remove the brochure code and sourcePage from the public panel; keep them in content data only.
- **Derived 'nights' and day counts presented as package facts** — `PackageSidebar.tsx:122-123 and CoverflowSwiper.tsx:358 render '<first token of duration> nights'; PackageWorkspace.tsx:19,29 and InteractiveItinerary.tsx:135 derive a day count from itinerary.length; SearchAndFilters.tsx:33-39 turns nights into day counts for filters/sorting.`. Action: Remove all derived nights/day labels and the duration filter bucket logic; display only verbatim, confirmed duration strings.
- **Stale flag count in current-state checklist** — `docs/audits/current-state-checklist.md states 'Packages with content_flags: 19'; travel_packages_catalog.json contains 20 flagged packages.`. Action: Correct the internal register to 20; do not publish the count.

## What is safe to keep as source-supported (subject to the rules)

- The 1927 heritage claim *as historical family operations* (brochure page image 02), not as a present-tense guarantee of current assets.
- The distinct historical names 'India Nepal Travel Organisation' and 'India Nepal Travel Centre' when explicitly described as historical/brochure-derived; do not merge or standardise them.
- Grade definitions (Easy/Moderate/Demanding/Strenuous with km and altitude ranges) only when presented as the brochure's own printed definitions, never as an interpretation of Grade C/D.
- Houseboat description: two to seven bedrooms, private ensuite facilities, carved walnut/Kashmir carpets, veranda, sundeck, Kashmir Government classification passed on as issued (brochure page image 03).
- Package routes and itinerary steps that have no flag, while preserving printed spelling and codes exactly.

## Client confirmations required before anything can be re-added

See `facts-to-confirm.md`. The blocking items are company/brand hierarchy, the two conflicting contact blocks on page 10, legacy 2014 deposit/cancellation/insurance terms, the unqualified `$` amounts, the 27-package count vs the Enfield/KS22 mismatch, all grade letter/word conflicts, disputed day counts, and current fleet/office/guide claims.

## Approval gate

No public content has been edited. Confirm which groups to action (P0 only, P0 + P1, or a narrower list) and I will apply the removals, then run lint/typecheck/build and re-check the affected routes. Confirmations in `facts-to-confirm.md` stay open regardless — a missing fact is safer than a guessed one.

## Applied — 2026-11-26 (P0 + P1)

The approved P0 removals and P1 withholdings have been applied. No client-confirmed replacement facts were invented; claims were suppressed or reduced to neutral, source-supported wording.

- Removed internal `content_flags` from public package/houseboat rendering and from the client view-model payload (`catalogue.ts`, `PackageWorkspace.tsx`, `HouseboatStay.tsx`).
- Removed the brochure source reference/inclusions panel metadata (`InclusionsExclusions.tsx`).
- Removed internal people notes and the invented "Baktoo family archives" attribution (`about/page.tsx`).
- Removed build-status copy and the unverified "encrypted/direct transmission" claim (`EnquiryForm.tsx`, `contact/page.tsx`, `privacy/page.tsx`).
- Removed sample CRM records, "27 verified"/"100% Brochure Verified" claims and "Encrypted Session" from `admin/page.tsx`.
- Removed GPS/altitude display from the home hero, contact hero, houseboat hero and video modal subtitle.
- Neutralised unsupported guide/hotel/transport promises in `siteContent.ts`; removed "guaranteed departures" sales copy from `about/page.tsx` and the package sidebar.
- Suppressed all withheld package fields via `catalogue.ts` helpers: disputed durations, grade badges/letter-to-word mappings, derived nights/day counts, and partial/reconstructed day-by-day itineraries. Withheld records are keyed by their real record IDs, not brochure codes.
- Removed all numeric journey counts from the public catalogue/filters/orbit hero; duration filtering ignores redacted values.

Verification: `npm run typecheck`, `npm run lint` and `npm run build` all pass. Every route was re-fetched over HTTP and checked for the removed strings in both visible HTML and the full response (no matches). Confirmations in `facts-to-confirm.md` remain open; nothing has been re-added.
