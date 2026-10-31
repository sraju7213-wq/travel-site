# Launch Readiness Checklist

**Updated:** 2026-10-28 (Phase 6)

Everything below needs an operator decision or an operator-supplied asset. Items are
grouped by owner. Nothing here can be invented by the developer — where a value is
missing, the site states that plainly instead of filling the gap.

## Operator — contact and company details
- [ ] Direct phone number(s) for India Nepal Travel Centre / India Nepal Travel Organisation.
- [ ] Contact email address.
- [ ] Office addresses (Delhi, Kashmir, Ladakh) if they should be published.
- [ ] Business hours / timezone for contact.
- [ ] Confirmation of the wording "India Nepal Travel Centre" vs "India Nepal Travel Organisation" as the public-facing name in each context.
- [ ] Whether agents and sub-agents "in all parts of India and Nepal" should be published, and how to list them.

## Operator — enquiry intake
- [ ] Endpoint URL for enquiry delivery (set as `ENQUIRY_API_URL`).
- [ ] Shared secret / API key (set as `ENQUIRY_API_KEY`; server-side only, never `NEXT_PUBLIC_`).
- [ ] The payload shape the endpoint expects — the current route sends JSON with: enquiryType, packageSlug, packageTitle, packageCode, fullName, email, phone, preferredContact, travelDate, datesFlexible, travellers, message, submittedAt.
- [ ] Which field of the enquiry should become a CRM/email notification, and to which address.
- [ ] Rate-limiting or spam policy for the public endpoint.

## Operator — newsletter
- [ ] Mailing-list provider endpoint (set as `NEWSLETTER_API_URL`).
- [ ] Provider API key (set as `NEWSLETTER_API_KEY`).
- [ ] Confirmation of whether the newsletter section should appear on the homepage at all. It is currently hidden because no list is connected.

## Operator — privacy and consent
- [ ] Full privacy notice text (covering what is collected, how long it is retained, who processes it, and how a visitor requests deletion).
- [ ] Approved consent wording to replace the current neutral line: "I agree that India Nepal Travel Organisation may contact me about this enquiry."
- [ ] Position on the newsletter consent wording.
- [ ] Whether a cookie/consent notice is required for the regions the site will serve.
- [ ] Where the privacy notice should live (a `/privacy` route does not exist yet).

## Operator — catalogue confirmation
- [ ] Resolve the 26 open `content_flags` in `travel_packages_catalog.json` (see `docs/current-state-checklist.md`).
- [ ] Confirm the duration label for every package where the brochure card and itinerary disagree.
- [ ] Confirm the official casing for the Golden Triangle brochure code (`ii7` vs `II7`).
- [ ] Confirm which journey the contents page meant by the "Himalaya Enfield Motorbike Tour" (the card shows Kashmir Ski).
- [ ] Confirm departure months and seasons before any seasonal claim is published (currently the brochure mentions departures only for a few Nepal and skiing packages, and the site does not publish them).

## Developer — imagery
- [ ] Re-crop the extreme-aspect package images before launch (listed in `docs/asset-inventory.md`).
- [ ] Generate `public/images/services/kashmir-houseboat.jpg`, or approve the current `kashmir-shikara.jpg` stand-in.
- [ ] Favicon and social share image (Open Graph/Twitter card).
- [ ] Confirm licence and source for every image in `public/images/` (currently all cropped from `Brochure.pdf`).

## Developer — quality
- [ ] No automated test suite exists. Add one before launch if the site will be maintained in-house.
- [ ] Run an accessibility audit (axe or Lighthouse) — accessibility was addressed semantically but not tool-verified.
- [ ] Run the site at 320px width and confirm no horizontal overflow.
- [ ] Check browser back/forward behaviour on `/explore` with filters applied.

## Environment variables summary
| Variable | Used by | Purpose |
|---|---|---|
| `ENQUIRY_API_URL` | `app/src/app/api/enquiry/route.ts` | Operator enquiry endpoint. When unset, the route returns 503 and the UI states nothing was sent. |
| `ENQUIRY_API_KEY` | `app/src/app/api/enquiry/route.ts` | Sent as a bearer token to the endpoint. Server-side only. |
| `NEWSLETTER_API_URL` | `app/src/app/api/newsletter/route.ts`, `app/src/app/page.tsx` | Mailing-list endpoint. When unset, the newsletter section is hidden entirely. |
| `NEWSLETTER_API_KEY` | `app/src/app/api/newsletter/route.ts` | Bearer token for the mailing list. Server-side only. |

None of these variables use the `NEXT_PUBLIC_` prefix, so none of them can reach the
browser bundle.

Note on rebuilds: the homepage is statically prerendered, so `NEWSLETTER_API_URL` is read
at build time — a rebuild is required after adding it. `/enquiry` is server-rendered on
demand, so `ENQUIRY_API_URL` takes effect without a rebuild.
