# Coding Agent Prompt — Audit and Correct All Website Facts Against the Client Brochure

You are working on the **India Nepal Travel Center** website. Your task is to audit and correct every factual detail and item of information across the entire project using the client's brochure as the source of truth.

## Mandatory reference files

1. Read and follow `CONTENT_ACCURACY_RULES.md` from the project root before editing any content.
2. Use the client's 10-page source brochure: `Preview Brouchure(1).pdf`.
3. If the PDF is not present in the repository, search likely project locations such as the root, `docs/`, `public/` and `assets/`. If it still cannot be found, **do not edit or guess factual content**. Produce a short blocker report asking the user to add the exact client brochure, then stop factual corrections.
4. Inspect the rendered page images as well as extracted text. The brochure is scanned and OCR/text extraction may be incomplete or wrong. Never rely on OCR alone for numbers, names, route sequences, codes or legal terms.

## Main objective

Make all published website facts consistent with the client brochure or an explicit written client update. Remove unsupported or inaccurate facts. Do not invent replacement details. The goal is factual accuracy, not a redesign.

## Critical constraints

- Do not invent, infer, embellish, silently correct or externally research client-specific facts.
- Do not treat existing website text as proof.
- Do not use Google, competitor sites, AI-generated content or general knowledge to fill brochure gaps.
- Preserve all factual meaning, package names, codes, place names, route order, durations, day numbers, grades, inclusion/exclusion distinctions and policy conditions.
- Do not calculate nights from days or derive duration from itinerary numbering.
- Do not silently choose between conflicting brochure sections.
- Do not make a legal interpretation of booking, cancellation, insurance, liability, privacy or payment language.
- Do not invent phone numbers, emails, addresses, testimonials, ratings, staff roles, opening times, company registrations, prices, hotel names, availability or service guarantees.
- Do not add "best", "leading", "No. 1", "fully insured", "guaranteed", "official", "award-winning" or similar claims unless explicitly supported and approved.
- Do not expose internal notes, TODOs, OCR warnings, source audit comments or client questions in the public UI.
- Do not redesign the site, change its visual identity, replace its framework, alter APIs, change the CMS/database schema, delete working features or modify deployment configuration unless strictly necessary for the content corrections. Preserve the current design and functionality.

## Phase 1 — Inventory the project before editing

1. Inspect the full repository structure and identify the framework, routing approach, data/content sources, CMS/backend, component structure and test/build commands.
2. Enumerate all routes, including dynamic package routes and query-parameter filtered routes.
3. Search all files for factual content and content-generation sources, including:
   - Homepage copy, headings, stats, labels and featured cards.
   - Package catalogues, detail pages, itinerary arrays, route maps, duration labels, grades and inclusion/exclusion lists.
   - Destination pages, destination filters and experience categories.
   - About, heritage, founder and team profiles.
   - Contact details in header, footer, forms, modals and widgets.
   - Houseboat and special-interest programme pages.
   - Booking conditions, terms, privacy notices and policy pages.
   - Enquiry form defaults, confirmation messages, email templates and WhatsApp links.
   - SEO metadata, Open Graph data, JSON-LD/schema, sitemap and image alt text.
4. Do not change content yet. Build a factual-claims inventory with each claim's current value, file/route location and proposed source match.

## Phase 2 — Compare every claim with the brochure

Use `CONTENT_ACCURACY_RULES.md` and its page map/package inventory. Check the actual brochure page images for any ambiguous text.

For each factual claim, classify it as:

- `source-supported` — directly supported by the brochure and not contradicted.
- `client-confirmed` — supported by a newer written client approval.
- `needs-confirmation` — ambiguous, contradictory, incomplete, unclear or potentially outdated.
- `withheld` — must not be displayed publicly until confirmation.

Record exact source page numbers and preserve the exact brochure wording in the internal audit record. For edited customer-facing wording, record both the source wording and the edited version.

## Phase 3 — Pay special attention to these known conflicts

These issues are already known from the supplied brochure. Do not "solve" them by guessing:

1. **Brand name:** page 2 says "India Nepal Travel Organisation"; the cover/booking form say "India Nepal Travel Centre". Confirm legal name and trading name before standardising.
2. **Mini-trek contents mismatch:** page 2 lists "Himalaya Enfield Motorbike Tour" in the mini-trek section, but page 8 shows "Kashmir Ski" with code KS22. Do not invent the motorbike tour or assume KS22 is its replacement. Flag the missing/mismatched package.
3. **Kashmir package ii10:** labelled 7 days / 6 nights, but the displayed itinerary has only Day 01–Day 06. Do not add a Day 07.
4. **Delhi to Kathmandu ii12:** itinerary has Day 1–Day 8 but no separate duration badge. Do not automatically create a duration field.
5. **Heritage Tour of India HTi13:** itinerary has Day 01–Day 15 but no separate duration badge. Do not add a duration label unless confirmed.
6. **HE18:** "24 day round trip" / "24 day trek" wording and some sequence details require confirmation. Do not silently repair or reformat the duration.
7. **HE25 / 4 Day Nepal Mini Trek NM1:** the itinerary contains a repeated/unclear place sequence. Do not reorder or rename places.
8. **HE27 / 7 Day Nepal Mini Trek NM2:** verify spelling and route order against the page image; flag ambiguous place names rather than guessing.
9. **Founders:** the page 2 founders paragraph refers to Yusuf Baktoo, but no corresponding profile is visible in that section. Do not invent a profile or remove the reference without approval.
10. **Team profiles:** confirm that Sultan Baktoo, Farook Baktoo, Imtiaz Ahmad and Hashim are currently associated with the business and that their biographies/roles remain current before presenting them as current staff.
11. **Operating claims:** offices in Delhi/Kashmir/Ladakh, car fleet, hotels, houseboats, agents/sub-agents and other operating claims may be historic. Do not present as current without reconfirmation.
12. **Booking terms on page 10:** they have no visible revision date and include `$200` deposit, `$25` amendment fee, cancellation percentages, 8-week payment timing and a reference to exchange rates as at 1 September 2014. Treat as legacy/unconfirmed. Do not publish as current without written approval.
13. **Currency:** the `$` symbol appears but the currency is not unambiguously specified. Do not label it AUD, USD or INR.
14. **Contact block:** page 10 combines India Nepal Travel Centre branding with "Asian Bazaar", an Australian address/phone and multiple email/web addresses. Do not copy these into the website until the client identifies the correct current business contacts.
15. **Package total:** do not advertise "27 journeys" as a confirmed product count until the client confirms the final catalogue and resolves the missing/mismatched Enfield entry.

Also review every other package, route, date, number, grade, activity, inclusion and exclusion. The known list above is not exhaustive.

## Phase 4 — Correct the content safely

After creating the audit, make corrections under these rules:

### A. Unambiguous source-supported corrections

- Correct a website fact when the brochure clearly supplies the replacement value and no other brochure section conflicts with it.
- Keep package codes and names exactly as printed unless the client has approved a rename.
- Correct obvious website typos only where the source is unambiguous and the change cannot alter a proper noun, number, route or meaning.
- Ensure the same approved value is used consistently across cards, details, forms, metadata, structured data and automated messages.

### B. Ambiguous or contradictory content

- Do not choose a value.
- Suppress the disputed public claim if leaving it visible would mislead visitors.
- Where practical, retain the package page with verified content, but remove only the disputed duration/route/grade/inclusion field.
- If the package itself cannot be described accurately without the disputed detail, temporarily unpublish or mark it unavailable internally. Never show an internal "needs confirmation" note to customers.
- Add the issue to `docs/content-audit/FACTS_TO_CONFIRM.md` with the brochure page and both conflicting versions.

### C. Content architecture

If the project uses structured data for packages, keep one canonical package record and reuse it across card, detail, enquiry and metadata surfaces. Avoid duplicated hard-coded facts that can drift apart.

Where practical, attach internal source metadata such as `sourceDocument`, `sourcePage`, `verificationStatus` and `sourceNotes`. Keep this metadata out of the public UI and API responses unless explicitly intended.

Do not perform a large refactor just to introduce source metadata. Follow the project's current architecture and make the smallest safe change.

### D. Contact/legal/policy content

- Remove visible placeholders, fabricated contacts and unrelated contact details.
- Do not replace them with guessed details.
- If the correct contact cannot be confirmed, use an already verified contact channel only; otherwise hide the unsupported channel and record the issue.
- Do not publish the page 10 booking terms as current until the client confirms them. Do not rewrite legal meaning. If no approved current terms exist, use a neutral, client-approved message such as asking visitors to request the current booking conditions; do not invent the message if client approval is required by project policy.
- Do not make claims about encryption, secure storage, privacy compliance, database configuration or data retention unless verified from the actual implementation and approved policy text.

### E. Enquiry forms and journeys

- If a visitor selects a package, pass that package's canonical ID/name into the enquiry form.
- Never show a default "tailor-made trip" selection when the visitor came from a specific package unless the visitor changes it.
- If a package has been withheld, it must not be offered as an active enquiry option.
- Do not claim an enquiry is a confirmed booking.
- Do not invent response times, availability or booking confirmation guarantees.
- Preserve existing validation, spam protection, submission backend and success/error handling.

## Phase 5 — Produce required audit files

Create the following files (create `docs/content-audit/` if needed):

1. `docs/content-audit/CONTENT_AUDIT.md`
   - Every route/surface audited.
   - Existing claim, current location, brochure page, status and action taken.
   - Include items corrected, withheld and unchanged.
2. `docs/content-audit/FACTS_TO_CONFIRM.md`
   - Numbered questions for the client.
   - Exact conflicting source values and page numbers.
   - No speculative suggested answer. A suggested answer may be included only as a clearly labelled option, never as a fact.
3. `docs/content-audit/PACKAGE_SOURCE_REGISTER.md`
   - Full package inventory with printed names, codes, brochure page, source duration/grade wording, and any issue.
4. Keep `CONTENT_ACCURACY_RULES.md` in the project root and do not weaken or delete its rules.

If files already exist, update them carefully rather than overwriting useful audit history.

## Phase 6 — Search again for leftovers

After edits, run project-wide searches for:

- Every previous inaccurate value and spelling variant.
- `TODO`, `TBD`, `Owner to provide`, `placeholder`, `OCR`, `reconstructed`, `confirm`, sample emails, example phone numbers and dummy addresses.
- Unsupported numbers, prices, durations, route names, grade labels and claims.
- Old contact details and incorrect package IDs.

Do not remove legitimate internal TODOs from audit files. Ensure none leak into public-facing pages, metadata, forms or emails.

## Phase 7 — Test the site

1. Run the available lint, type-check, unit/integration tests and production build.
2. Fix issues introduced by your content changes; do not make unrelated refactors.
3. Visit every affected page/route, including dynamic package routes and filters.
4. Verify all package cards open the correct detail page.
5. Verify package-specific enquiry preselection.
6. Verify navigation, maps, itinerary interactions, filters and forms still work.
7. Check desktop and mobile layout, especially long itinerary text and missing/withheld fields.
8. Ensure no empty labels, broken cards, `undefined`, `null`, placeholder text or internal notes appear.
9. Check page title/description/schema/alt text for factual consistency.
10. If a required test cannot be run, say so. Never claim it passed.

## Final response format

When finished, provide:

1. **Files changed** — list important modified files.
2. **Facts corrected** — only facts with clear brochure support or written client approval.
3. **Facts withheld** — information removed from public display because it is unclear or conflicting.
4. **Client confirmations required** — link or path to `FACTS_TO_CONFIRM.md` and summarise the blockers.
5. **Validation** — exact build/test commands run and pass/fail status.
6. **Remaining risk** — clearly state any content that cannot yet be called accurate.

Do not say "all website information is now accurate" while any client confirmation remains outstanding.

**Start with an audit, then correct. Do not make bulk replacements before mapping the facts to the brochure. Accuracy takes priority over completeness and aesthetics.**