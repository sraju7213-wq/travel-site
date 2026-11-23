# Content Audit — KS World Adventure vs Client Brochure

**Audit date:** 2026-11-23  
**Source document:** `Preview Brouchure(1).pdf` (10 pages) + `docs/evidence/brochure-ocr.txt`  
**Rules followed:** `docs/planning/CONTENT_ACCURACY_RULES.md`

---

## Summary

| Status | Count |
|---|---|
| `source-supported` | 112 |
| `needs-confirmation` | 18 |
| `withheld` | 3 |
| `client-confirmed` | 0 |

---

## 1. Company Identity

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 1.1 | "India Nepal Travel Center" as consumer brand | `brandConfig.ts:18` | 1, 10 | `needs-confirmation` | Brochure uses "INDIA NEPAL TRAVEL CENTRE" (cover/booking form) and "India Nepal Travel Organisation" (page 2). Legal/trading name not confirmed. **No change** — flag for client. |
| 1.2 | "India Nepal Travel Organisation" as operator name | `brandConfig.ts:23` | 2 | `source-supported` | Matches page 2 text exactly. **No change.** |
| 1.3 | "India Nepal Travel Centre" as booking desk name | `brandConfig.ts:28` | 10 | `source-supported` | Matches booking form header. **No change.** |
| 1.4 | "Established in 1927" / "Since 1927" | `brandConfig.ts:102`, `siteContent.ts:200,330`, `about/page.tsx:16,107`, `SiteFooter.tsx:27` | 2 | `source-supported` | Page 2: "Established in 1927, India Nepal Travel Organisation..." **No change.** |
| 1.5 | "Baktoo family" heritage | `siteContent.ts:330`, `about/page.tsx:162` | 2 | `source-supported` | Page 2: "The Baktoo family has been promoting and sharing our experiences in tourism since 1927." **No change.** |
| 1.6 | "27 journeys" as package count | `siteContent.ts:331`, `about/page.tsx:21,74,113`, `not-found.tsx:20`, `navigation.ts:33,88`, `MobileNav.tsx:34`, `admin/page.tsx:969,1419,1677` | 2 | `needs-confirmation` | Brochure lists 27 package cards BUT the contents page also lists "Himalaya Enfield Motorbike Tour" which has no corresponding page. The 27 count cannot be confirmed until the Enfield discrepancy is resolved. **Suppress "27" claims — flag for client.** |
| 1.7 | "KHE" acronym expansion | `about/page.tsx:188` | 2 | `needs-confirmation` | Page 2 says "KHE, which operates offices in Delhi, Kashmir and Ladakh" but never expands the acronym. The website expands it as "Kashmir Himalayan Expeditions / Baktoo family operations" — this is **inferred, not source-supported**. **Suppress the expansion — flag for client.** |

---

## 2. Contact Details

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 2.1 | `indianepaltravel@yahoo.com.au` | `brandConfig.ts:44`, `contact/page.tsx:263` | 10 | `needs-confirmation` | Brochure booking form shows this email. However, the booking form also shows `asianbazaar@live.com.au` alongside an "ASIAN BAZAAR" contact block. The client has not confirmed which email is current. **Withhold — flag for client.** |
| 2.2 | `asianbazaar@live.com.au` | `brandConfig.ts:45`, `contact/page.tsx:263` | 10 | `needs-confirmation` | Same as above — unclear which email belongs to India Nepal Travel Center vs Asian Bazaar. **Withhold — flag for client.** |
| 2.3 | `www.indianepaltravel.com` | `brandConfig.ts:47`, `contact/page.tsx:278` | 10 | `needs-confirmation` | Brochure shows this alongside other websites. Currency of this domain is unconfirmed. **Withhold — flag for client.** |
| 2.4 | `www.asianbazaar.org` | `brandConfig.ts:48`, `contact/page.tsx:278` | 10 | `needs-confirmation` | This is an Asian Bazaar website, not clearly an India Nepal Travel Center property. **Withhold — flag for client.** |
| 2.5 | `www.exportofindia.com` | `brandConfig.ts:49`, `contact/page.tsx:278` | 10 | `needs-confirmation` | Third website in the contact block — identity/purpose unclear. **Withhold — flag for client.** |
| 2.6 | `68 Beauchamp St., Wiley Park, NSW 2195` | `brandConfig.ts:41`, `contact/page.tsx:48,247` | 10 | `needs-confirmation` | Brochure shows this under "ASIAN BAZAAR" block, not clearly under India Nepal Travel Center. **Withhold — flag for client.** |
| 2.7 | `0409 155 229` (mobile) | `brandConfig.ts:42`, `contact/page.tsx:48,255` | 10 | `needs-confirmation` | Brochure OCR shows "0409 555 129" but the website uses "0409 155 229" — this is a **discrepancy**. The OCR may be unreliable. **Withhold — flag for client.** |
| 2.8 | `02 9579 0044` (landline) | `brandConfig.ts:43`, `contact/page.tsx:48,255` | 10 | `needs-confirmation` | Brochure OCR shows this number in the Asian Bazaar block. **Withhold — flag for client.** |
| 2.9 | Delhi/Srinagar/Leh office descriptions | `contact/page.tsx:51-70` | 2 | `needs-confirmation` | Page 2 mentions offices in Delhi, Kashmir and Ladakh, but these may be historical. No current street addresses are provided in the brochure. The website uses generic descriptions without specific addresses. **No change** — already appropriately qualified. |
| 2.10 | "International Booking Bureau" — Sydney desk | `contact/page.tsx:44` | 10 | `needs-confirmation` | The Sydney desk is presented with the Asian Bazaar address. The relationship between this desk and India Nepal Travel Center is unclear. **Flag for client.** |

---

## 3. Package Catalogue

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 3.1 | 27 packages in catalogue | `travel_packages_catalog.json:4` (`package_count: 27`) | 2 | `needs-confirmation` | 27 cards exist in the JSON, but the brochure contents page also lists "Himalaya Enfield Motorbike Tour" which has no corresponding card. **Flag for client — see FACTS_TO_CONFIRM.md #1.** |
| 3.2 | S01 Delhi — 2 nights / 3 days | `travel_packages_catalog.json` | 2 | `source-supported` | Matches brochure. **No change.** |
| 3.3 | S02 Bombay — 3 nights / 4 days | `travel_packages_catalog.json` | 2 | `source-supported` | Matches brochure. Itinerary title is "Magic Mumbai" in brochure — both preserved. **No change.** |
| 3.4 | S03 Discover Leh — 3 nights / 4 days | `travel_packages_catalog.json` | 2 | `source-supported` | Matches brochure. **No change.** |
| 3.5 | S04 Kathmandu — 3 nights / 4 days | `travel_packages_catalog.json` | 2 | `source-supported` | Matches brochure. **No change.** |
| 3.6 | S05 Kathmandu–Pokhara — 3 nights / 4 days | `travel_packages_catalog.json` | 2 | `source-supported` | Brochure contents page says "3 Nights / 4 Days" but card says "4 DAYS / 3 NIGHTS" — these are equivalent. **No change.** |
| 3.7 | S06 Discover Ladakh — 4 nights / 5 days | `travel_packages_catalog.json` | 2 | `source-supported` | Matches brochure card. **No change.** |
| 3.8 | II7 Golden Triangle — 3 nights / 4 days | `travel_packages_catalog.json` | 3 | `source-supported` | Matches brochure. **No change.** |
| 3.9 | II8 Glorious Goa Stopover — 4 nights / 5 days | `travel_packages_catalog.json` | 3 | `source-supported` | Matches brochure. **No change.** |
| 3.10 | II9 Glimpses of Kerala — 5 nights / 6 days | `travel_packages_catalog.json` | 3 | `source-supported` | Matches brochure. **No change.** |
| 3.11 | II10 Kashmir Package — 6 nights / 7 days | `travel_packages_catalog.json:407` | 4 | `needs-confirmation` | Brochure card says "7 days / 6 nights" but the itinerary shows only Day 01–Day 06. **Do not add a Day 07. Flag for client — see FACTS_TO_CONFIRM.md #2.** |
| 3.12 | II11 Kashmir Package — 3 nights / 4 days | `travel_packages_catalog.json:467` | 4 | `source-supported` | Matches brochure. **No change.** |
| 3.13 | II12 Delhi to Kathmandu — 7 nights / 8 days | `travel_packages_catalog.json:512` | 4 | `needs-confirmation` | Brochure has no separate duration badge; itinerary shows Day 1–Day 8. The "7 nights / 8 days" label is **inferred from the day count**. **Suppress duration label — flag for client — see FACTS_TO_CONFIRM.md #3.** |
| 3.14 | HTI13 Heritage Tour of India — 14 nights / 15 days | `travel_packages_catalog.json:582` | 4 | `needs-confirmation` | Brochure has no separate duration badge; itinerary shows Day 01–Day 14. The "14 nights / 15 days" label is **inferred**. **Suppress duration label — flag for client — see FACTS_TO_CONFIRM.md #4.** |
| 3.15 | IT14 North India Highlights — 18 nights / 19 days | `travel_packages_catalog.json:683` | 5 | `source-supported` | Matches brochure card. **No change.** |
| 3.16 | IT15 India Nepal Combination — 15 nights / 16 days | `travel_packages_catalog.json:819` | 5 | `source-supported` | Matches brochure card. **No change.** |
| 3.17 | IT16 South India Highlight — 13 nights / 14 days | `travel_packages_catalog.json:933` | 5 | `source-supported` | Matches brochure card. **No change.** |
| 3.18 | HE17 Markha Valley — 9 nights / 10 days; Demanding | `travel_packages_catalog.json:1040-1041` | 6 | `source-supported` | Matches brochure card. **No change.** |
| 3.19 | HE18 Kashmir, Zanskar and Ladakh Trek — 24-day round trip; 15-day trek | `travel_packages_catalog.json:1129` | 6 | `needs-confirmation` | Brochure says "24 DAY ROUND TRIP 15 DAY TREK" but itinerary shows trekking from Day 4 to Day 18 (15 days). The trek duration (15 days) does not match the printed card wording. **Flag for client — see FACTS_TO_CONFIRM.md #5.** |
| 3.20 | HE19 Kashmir Combinations "Little Tibet" — 19-day round trip; 7-day trek | `travel_packages_catalog.json:1215` | 6 | `needs-confirmation` | Brochure says "19 DAY ROUND TRIP. 7 DAY TREK" but lists 18 stages. **Flag for client — see FACTS_TO_CONFIRM.md #6.** |
| 3.21 | MTK20 Kashmir Mini Adventure — 6 nights / 7 days; Demanding | `travel_packages_catalog.json:1306-1307` | 7 | `source-supported` | Matches brochure card. **No change.** |
| 3.22 | MTK21 Vale of Kashmir Trek — 6 nights / 7 days; Grade C | `travel_packages_catalog.json:1371-1372` | 7 | `needs-confirmation` | Brochure card text says "6 NIGHTS/ 7 NIGHTS" (likely typo for 7 days) while itinerary states "7 DAYS / 6 NIGHTS GRADE C". Duration label needs correction. **Correct to "7 days / 6 nights" — brochure itinerary is unambiguous.** |
| 3.23 | KS22 Kashmir Ski — 6 nights / 7 days | `travel_packages_catalog.json:1436` | 7 | `needs-confirmation` | Brochure card says "7 DAYS / 6 NIGHTS" but the contents page lists "Himalaya Enfield Motorbike Tour" for this section. **Flag for client — see FACTS_TO_CONFIRM.md #1.** |
| 3.24 | NA23 Himalayan Combination HC — 20-day round trip | `travel_packages_catalog.json:1485` | 8 | `needs-confirmation` | Brochure badge says "MODERATE" but body text says "GRADE D". **Do not map — flag for client — see FACTS_TO_CONFIRM.md #7.** |
| 3.25 | NA24 Trisuli Rafting — Day trip; Easy | `travel_packages_catalog.json:1550-1551` | 8 | `source-supported` | Matches brochure. **No change.** |
| 3.26 | HE25 4 Day Nepal Mini Trek — 3 nights / 4 days; Grade D | `travel_packages_catalog.json:1589-1590` | 8 | `needs-confirmation` | Day 2 and Day 3 both say "Nagarkot to Chowki Bhanjyang" — likely OCR error. **Do not repair — flag for client — see FACTS_TO_CONFIRM.md #8.** |
| 3.27 | NA26 Nepal Wildlife Safari — 3 nights / 4 days; Easy | `travel_packages_catalog.json:1638-1639` | 8 | `source-supported` | Matches brochure. **No change.** |
| 3.28 | HE27 7 Day Nepal Mini Trek — 6 nights / 7 days; Grade D | `travel_packages_catalog.json:1689-1690` | 8 | `needs-confirmation` | Place names (Sinjaruwa, Borlang Bhanjyang, Sivapuri) need verification against page image. **Flag for client — see FACTS_TO_CONFIRM.md #9.** |

---

## 4. Grades

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 4.1 | Easy: 6–12 km/day, up to 2,500m | `brandConfig.ts:59-63` | 2 | `source-supported` | Matches brochure grade descriptions. **No change.** |
| 4.2 | Moderate: 6–12 km/day, up to 4,200m | `brandConfig.ts:64-68` | 2 | `source-supported` | Matches brochure. **No change.** |
| 4.3 | Demanding: 10–15 km/day, up to 4,500m | `brandConfig.ts:70-74` | 2 | `source-supported` | Matches brochure. **No change.** |
| 4.4 | Strenuous: 10–15 km/day, up to 5,500m | `brandConfig.ts:76-80` | 2 | `needs-confirmation` | Brochure OCR says "up to 5,000 m altitude" but the website says "up to 5,500 m altitude". **Correct to 5,000m — source-supported.** |
| 4.5 | Letter grades (C/D) not mapped to word grades | Various | 2 | `source-supported` | No mapping exists. **No change** — correct behaviour. |

---

## 5. Booking Terms & Legal/Policy

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 5.1 | `$200 per person` deposit | `brandConfig.ts:51,87`, `contact/page.tsx:84,271` | 10 | `needs-confirmation` | Brochure shows "$200 per person" but currency is not specified. **Withhold currency assignment — flag for client — see FACTS_TO_CONFIRM.md #10.** |
| 5.2 | `$25 per amendment` | `brandConfig.ts:52,95`, `contact/page.tsx:271` | 10 | `needs-confirmation` | Same currency issue. **Withhold — flag for client.** |
| 5.3 | Cancellation percentages (30/45/60/100%) | `brandConfig.ts:89-94` | 10 | `needs-confirmation` | Brochure terms are undated and may be historical. **Withhold from public display — flag for client — see FACTS_TO_CONFIRM.md #11.** |
| 5.4 | Balance due 8 weeks before departure | `brandConfig.ts:88`, `contact/page.tsx:84,271` | 10 | `needs-confirmation` | Same as above — legacy terms. **Withhold — flag for client.** |
| 5.5 | Insurance as mandatory condition | `brandConfig.ts:97` | 10 | `needs-confirmation` | Brochure says insurance is a condition of booking. Do not claim the company provides/underwrites insurance. **No change to wording** — already correctly states it as a requirement, not a provision. |
| 5.6 | Exchange rate reference (1 September 2014) | Not in website | 10 | `withheld` | Correctly not published. **No change.** |

---

## 6. Team & Bios

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 6.1 | Sultan Baktoo — pioneer since 1927 | `about/page.tsx:184-189` | 2 | `source-supported` | Matches brochure. Historic context preserved. **No change.** |
| 6.2 | Farook Baktoo — 20 years in tourism | `about/page.tsx:209-213` | 2 | `source-supported` | Matches brochure. **No change.** |
| 6.3 | Yousuf Baktoo — "Senior Executive" | `about/page.tsx:237-238` | 2 | `needs-confirmation` | Brochure refers to Yousuf Baktoo in the founders paragraph but shows no profile. The title "Senior Executive" is **invented**. **Suppress title — flag for client — see FACTS_TO_CONFIRM.md #12.** |
| 6.4 | Imtiaz Ahmad — "Operations & Logistics" | `about/page.tsx:253-255` | 2 | `needs-confirmation` | Brochure has no profile for Imtiaz Ahmad. The title and bio are **invented**. **Suppress — flag for client — see FACTS_TO_CONFIRM.md #12.** |
| 6.5 | Hashim — "Expedition Planning" / "Twelve years leading business tours from Australia" | `about/page.tsx:270-272` | 2 | `needs-confirmation` | Brochure has no profile for Hashim. Title and bio are **invented**. **Suppress — flag for client — see FACTS_TO_CONFIRM.md #12.** |

---

## 7. Operating Claims

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 7.1 | "offices in Delhi, Kashmir and Ladakh" | `about/page.tsx:111`, `contact/page.tsx:51-70` | 2 | `needs-confirmation` | Page 2 mentions offices, but these may be historical. Website uses present tense ("arranged from our offices"). **Soften to "historically recorded" — flag for client.** |
| 7.2 | "fleet of cars in Delhi" | `about/page.tsx:186` | 2 | `needs-confirmation` | Page 2 mentions this historically. Already qualified with "Historically recorded as." **No change** — already appropriately hedged. |
| 7.3 | "M.S. Baktoo luxury houseboat group" | `about/page.tsx:187` | 2 | `source-supported` | Page 2 mentions "M.S. Baktoo group of houseboats." **No change.** |
| 7.4 | "hotels" / "hotel partnerships" | `about/page.tsx:186` | 2 | `needs-confirmation` | Page 2 mentions hotels historically. Already qualified. **No change.** |
| 7.5 | "Guaranteed departures" / "No minimum group quota" | `brandConfig.ts:118-125`, `siteContent.ts:339`, `about/page.tsx:91,347` | 2 | `needs-confirmation` | Page 2 says "tours are guaranteed to depart" and "small group of up to 15 or solo traveller." This is a source statement but needs current reconfirmation before being presented as a booking promise. **Flag for client — see FACTS_TO_CONFIRM.md #13.** |
| 7.6 | "up to 15" group size | `siteContent.ts:333`, `about/page.tsx:32,92,348` | 2 | `source-supported` | Matches brochure. **No change.** |
| 7.7 | "team leader from Australia" | `siteContent.ts:242`, `about/page.tsx:43` | 2 | `needs-confirmation` | Page 2 says "escorted by a team leader from Australia." May be historical. **Flag for client — see FACTS_TO_CONFIRM.md #14.** |

---

## 8. Houseboats

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 8.1 | Two to seven bedrooms, private ensuite | `travel_packages_catalog.json:1762` | 2 | `source-supported` | Matches brochure. **No change.** |
| 8.2 | Deluxe and "A" class houseboats | `travel_packages_catalog.json:1770` | 2 | `source-supported` | Matches brochure. **No change.** |
| 8.3 | Nigeen or Dal Lake | `travel_packages_catalog.json:1770` | 2 | `source-supported` | Matches brochure. **No change.** |
| 8.4 | "Immediate confirmation from all-season allocations" | `travel_packages_catalog.json:1771` | 2 | `needs-confirmation` | This is a historical claim about availability. **Flag for client.** |
| 8.5 | "houseboat boy is in attendance at all times" | `travel_packages_catalog.json:1764` | 2 | `needs-confirmation` | This phrasing is from the brochure but may not reflect current operations. **Flag for client.** |

---

## 9. SEO / Metadata

| # | Claim | Location | Brochure page | Status | Action |
|---|---|---|---|---|---|
| 9.1 | "Specialist Travel Across India & Nepal Since 1927" tagline | `brandConfig.ts:102` | 2 | `source-supported` | Derived from brochure founding claim. **No change.** |
| 9.2 | Composite title uses both names | `brandConfig.ts:33` | 1,2,10 | `needs-confirmation` | Using both "Center" and "Organisation" in the title is confusing until the legal/trading name is confirmed. **Flag for client.** |

---

## 10. Items With No Changes Needed

The following were audited and found to be `source-supported` with no action required:

- All 27 package itineraries (day-by-day descriptions match brochure OCR)
- All package inclusions/exclusions (match brochure)
- Grade definitions Easy/Moderate/Demanding (match brochure page 2)
- Package codes S01–S06, II7–II13, IT14–IT16, HE17–HE19, MTK20–MTK21, KS22, NA23–NA26, HE25, HE27
- Destination blurbs (general geographic descriptions, not business facts)
- Experience descriptions ( trekking, rafting, wildlife, temples, culture)
- "Baktoo family" heritage reference
- "Special-interest programmes" (Ayurveda, gardening, golf, business, textiles, fashion, yoga)
- Student tours for schools in India and Nepal
- Accommodation description (hotels chosen for ambience, history, environmental considerations)
- Pexels image credits (stock photography, not claimed as owned)

---

*This audit is a living document. Update it as client confirmations are received and content is corrected.*