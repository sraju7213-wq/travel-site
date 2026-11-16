# Image sources

Complete reference for every image rendered on the website, with the Pexels
photo-page URL used for licence verification.

> **Scope note.** Package thumbnails, package detail galleries, package heroes,
> destination cards, experience cards, pillar panels, navigation imagery and
> content-card imagery were replaced with Pexels photography. **Page-level hero
> banners were deliberately left on their original local brochure assets** — see
> §9a for the full list.

## Licensing

All replacement photography is sourced **exclusively from Pexels**
(<https://www.pexels.com/>) and is used under the
[Pexels License](https://www.pexels.com/license/). Pexels images are free to use
but are **not** public domain — they remain the copyright of their respective
photographers, and the Pexels License conditions (including the restriction on
selling unmodified copies, building a competing stock-photo service, and implying
endorsement) apply. Attribution is not required by the licence but every source
page is recorded below so provenance can be checked at any time.

Images are delivered from the official Pexels CDN (`images.pexels.com`) through
Next.js Image optimisation. `images.pexels.com` is the only remote host allowed
in `app/next.config.ts`.

### CDN URL pattern

```
https://images.pexels.com/photos/{PHOTO_ID}/pexels-photo-{PHOTO_ID}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=2
```

`w=1200&h=800` produces a 3:2 crop suited to the card and hero frames;
`dpr=2` keeps the source crisp on retina displays. Full-bleed CSS backgrounds
use the same CDN with `w=2400` and no forced crop.

---

## 1. Photo ID reference

| Photo ID | Subject | Pexels source page |
|---|---|---|
| 10701431 | Gulmarg ski slopes and snow-covered hills | https://www.pexels.com/photo/10701431/ |
| 11521892 | Taj Mahal, Agra | https://www.pexels.com/photo/11521892/ |
| 11800909 | Portrait placeholder — Indian man | https://www.pexels.com/photo/11800909/ |
| 13927123 | Pahalgam and the Lidder River, Kashmir | https://www.pexels.com/photo/13927123/ |
| 13409974 | Greater one-horned rhinoceros in water | https://www.pexels.com/photo/13409974/ |
| 13971395 | Kerala tropical coastline | https://www.pexels.com/photo/13971395/ |
| 14094276 | Red Fort, Delhi | https://www.pexels.com/photo/14094276/ |
| 14487300 | Sonamarg glacier approach, Kashmir | https://www.pexels.com/photo/14487300/ |
| 15534251 | Udaipur lakeside city, Rajasthan | https://www.pexels.com/photo/15534251/ |
| 15774210 | Mehrangarh Fort, Jodhpur | https://www.pexels.com/photo/15774210/ |
| 16252950 | Sonamarg valley, Kashmir | https://www.pexels.com/photo/16252950/ |
| 17397822 | Udaipur City Palace and Lake Pichola | https://www.pexels.com/photo/17397822/ |
| 17545322 | Alleppey backwaters houseboat, Kerala | https://www.pexels.com/photo/17545322/ |
| 18453079 | Kashmir valley and the Srinagar surrounds | https://www.pexels.com/photo/18453079/ |
| 18563694 | Himalaya mountain range | https://www.pexels.com/photo/18563694/ |
| 19528132 | Old Delhi street life and historic lanes | https://www.pexels.com/photo/19528132/ |
| 20988035 | Kathmandu cityscape and temples | https://www.pexels.com/photo/20988035/ |
| 24428857 | Indian village life | https://www.pexels.com/photo/24428857/ |
| 26926327 | Nepal mountain and foothill trails | https://www.pexels.com/photo/26926327/ |
| 27442817 | Portrait placeholder — Indian man | https://www.pexels.com/photo/27442817/ |
| 27593915 | Pangong Lake, Ladakh | https://www.pexels.com/photo/27593915/ |
| 28277464 | Pokhara lakeside | https://www.pexels.com/photo/28277464/ |
| 28355680 | Goa beach and the Arabian Sea coastline | https://www.pexels.com/photo/28355680/ |
| 29251278 | Srinagar, Kashmir | https://www.pexels.com/photo/29251278/ |
| 30378592 | India Gate, New Delhi | https://www.pexels.com/photo/30378592/ |
| 30778230 | Kerala backwaters | https://www.pexels.com/photo/30778230/ |
| 32132398 | Himalayan mountain range | https://www.pexels.com/photo/32132398/ |
| 32651303 | White-water rafting | https://www.pexels.com/photo/32651303/ |
| 33885308 | Indian people and community | https://www.pexels.com/photo/33885308/ |
| 34971547 | Kashmir beauty — Dal Lake shores | https://www.pexels.com/photo/34971547/ |
| 35130760 | Jaisalmer Fort, Rajasthan | https://www.pexels.com/photo/35130760/ |
| 35672518 | Gulmarg snowy meadow, Kashmir | https://www.pexels.com/photo/35672518/ |
| 35916755 | Goa beaches | https://www.pexels.com/photo/35916755/ |
| 36754808 | Ganga Aarti ceremony on the Varanasi ghats | https://www.pexels.com/photo/36754808/ |
| 36874536 | Gateway of India, Mumbai | https://www.pexels.com/photo/36874536/ |
| 36927764 | Nepalese temple with prayer flags | https://www.pexels.com/photo/36927764/ |
| 36982207 | Munnar tea gardens, Kerala | https://www.pexels.com/photo/36982207/ |
| 38087449 | Leh and the Ladakh mountain landscape | https://www.pexels.com/photo/38087449/ |
| 38087450 | Nubra Valley, Ladakh | https://www.pexels.com/photo/38087450/ |
| 3822669 | Namaste greeting | https://www.pexels.com/photo/3822669/ |
| 39605929 | Amber Fort, Jaipur, Rajasthan | https://www.pexels.com/photo/39605929/ |
| 40348598 | Dal Lake and houseboats, Srinagar | https://www.pexels.com/photo/40348598/ |
| 40967314 | Varanasi Ganga ghats at dawn | https://www.pexels.com/photo/40967314/ |
| 5774277 | Indian road / private transfer route | https://www.pexels.com/photo/5774277/ |
| 7089664 | Portrait placeholder — Indian man | https://www.pexels.com/photo/7089664/ |
| 37654954 | Greater one-horned rhinoceros in grassland | https://www.pexels.com/photo/37654954/ |

---

## 2. Travel package thumbnails and galleries

Source of truth: `app/src/data/catalogue.ts` → `PACKAGE_PEXELS_IMAGES`.
The primary image drives package cards, the in-season carousel, the poster rail,
the orbit hero, the coverflow swiper, the enquiry form card, the related-package
sidebar and the admin package picker. Gallery images drive the detail-page
gallery and its lightbox.

| Package | Primary image | Gallery images | Pexels source pages |
|---|---|---|---|
| delhi-stopover | 14094276 Red Fort | 30378592 India Gate · 19528132 Old Delhi | [/14094276/](https://www.pexels.com/photo/14094276/) · [/30378592/](https://www.pexels.com/photo/30378592/) · [/19528132/](https://www.pexels.com/photo/19528132/) |
| bombay-stopover | 36874536 Gateway of India | 28355680 Arabian Sea coast | [/36874536/](https://www.pexels.com/photo/36874536/) · [/28355680/](https://www.pexels.com/photo/28355680/) |
| discover-leh | 38087449 Leh / Ladakh | 38087450 Nubra Valley | [/38087449/](https://www.pexels.com/photo/38087449/) · [/38087450/](https://www.pexels.com/photo/38087450/) |
| kathmandu-stopover | 20988035 Kathmandu | 36927764 Nepal temple · 32132398 Himalayas | [/20988035/](https://www.pexels.com/photo/20988035/) · [/36927764/](https://www.pexels.com/photo/36927764/) · [/32132398/](https://www.pexels.com/photo/32132398/) |
| kathmandu-pokhara | 28277464 Pokhara | 20988035 Kathmandu · 32132398 Himalayas | [/28277464/](https://www.pexels.com/photo/28277464/) · [/20988035/](https://www.pexels.com/photo/20988035/) · [/32132398/](https://www.pexels.com/photo/32132398/) |
| discover-ladakh | 27593915 Pangong Lake | 38087450 Nubra Valley · 38087449 Leh / Ladakh | [/27593915/](https://www.pexels.com/photo/27593915/) · [/38087450/](https://www.pexels.com/photo/38087450/) · [/38087449/](https://www.pexels.com/photo/38087449/) |
| golden-triangle | 11521892 Taj Mahal | 39605929 Amber Fort · 14094276 Red Fort · 30378592 India Gate | [/11521892/](https://www.pexels.com/photo/11521892/) · [/39605929/](https://www.pexels.com/photo/39605929/) · [/14094276/](https://www.pexels.com/photo/14094276/) · [/30378592/](https://www.pexels.com/photo/30378592/) |
| glorious-goa-stopover | 28355680 Goa beach | 35916755 Goa beaches | [/28355680/](https://www.pexels.com/photo/28355680/) · [/35916755/](https://www.pexels.com/photo/35916755/) |
| glimpses-of-kerala | 30778230 Kerala backwaters | 17545322 Alleppey houseboat · 36982207 Munnar tea gardens | [/30778230/](https://www.pexels.com/photo/30778230/) · [/17545322/](https://www.pexels.com/photo/17545322/) · [/36982207/](https://www.pexels.com/photo/36982207/) |
| kashmir-package-7-day | 40348598 Dal Lake | 35672518 Gulmarg · 16252950 Sonamarg · 13927123 Pahalgam | [/40348598/](https://www.pexels.com/photo/40348598/) · [/35672518/](https://www.pexels.com/photo/35672518/) · [/16252950/](https://www.pexels.com/photo/16252950/) · [/13927123/](https://www.pexels.com/photo/13927123/) |
| kashmir-package-4-day | 29251278 Srinagar | 18453079 Kashmir valley · 40348598 Dal Lake | [/29251278/](https://www.pexels.com/photo/29251278/) · [/18453079/](https://www.pexels.com/photo/18453079/) · [/40348598/](https://www.pexels.com/photo/40348598/) |
| delhi-to-kathmandu | 11521892 Taj Mahal | 40967314 Varanasi ghats · 20988035 Kathmandu | [/11521892/](https://www.pexels.com/photo/11521892/) · [/40967314/](https://www.pexels.com/photo/40967314/) · [/20988035/](https://www.pexels.com/photo/20988035/) |
| heritage-tour-india | 35130760 Jaisalmer Fort | 39605929 Amber Fort · 11521892 Taj Mahal · 17397822 Udaipur City Palace | [/35130760/](https://www.pexels.com/photo/35130760/) · [/39605929/](https://www.pexels.com/photo/39605929/) · [/11521892/](https://www.pexels.com/photo/11521892/) · [/17397822/](https://www.pexels.com/photo/17397822/) |
| north-india-highlights | 11521892 Taj Mahal | 15534251 Udaipur · 40348598 Dal Lake · 27593915 Pangong Lake | [/11521892/](https://www.pexels.com/photo/11521892/) · [/15534251/](https://www.pexels.com/photo/15534251/) · [/40348598/](https://www.pexels.com/photo/40348598/) · [/27593915/](https://www.pexels.com/photo/27593915/) |
| india-nepal-combination | 11521892 Taj Mahal | 40967314 Varanasi ghats · 20988035 Kathmandu · 17397822 Udaipur City Palace | [/11521892/](https://www.pexels.com/photo/11521892/) · [/40967314/](https://www.pexels.com/photo/40967314/) · [/20988035/](https://www.pexels.com/photo/20988035/) · [/17397822/](https://www.pexels.com/photo/17397822/) |
| south-india-highlight | 36982207 Munnar tea gardens | 17545322 Alleppey houseboat · 13971395 Kerala coast | [/36982207/](https://www.pexels.com/photo/36982207/) · [/17545322/](https://www.pexels.com/photo/17545322/) · [/13971395/](https://www.pexels.com/photo/13971395/) |
| markha-valley | 38087449 Leh / Ladakh | 38087450 Nubra Valley · 27593915 Pangong Lake | [/38087449/](https://www.pexels.com/photo/38087449/) · [/38087450/](https://www.pexels.com/photo/38087450/) · [/27593915/](https://www.pexels.com/photo/27593915/) |
| kashmir-zanskar-ladakh-trek | 27593915 Pangong Lake | 40348598 Dal Lake · 38087449 Ladakh mountains | [/27593915/](https://www.pexels.com/photo/27593915/) · [/40348598/](https://www.pexels.com/photo/40348598/) · [/38087449/](https://www.pexels.com/photo/38087449/) |
| kashmir-combinations-little-tibet | 13927123 Pahalgam | 40348598 Dal Lake · 38087449 Ladakh mountains | [/13927123/](https://www.pexels.com/photo/13927123/) · [/40348598/](https://www.pexels.com/photo/40348598/) · [/38087449/](https://www.pexels.com/photo/38087449/) |
| kashmir-mini-adventure | 16252950 Sonamarg | 18453079 Kashmir valley · 35672518 Gulmarg | [/16252950/](https://www.pexels.com/photo/16252950/) · [/18453079/](https://www.pexels.com/photo/18453079/) · [/35672518/](https://www.pexels.com/photo/35672518/) |
| vale-of-kashmir-trek | 13927123 Pahalgam | 18453079 Lidder Valley · 14487300 Sonamarg | [/13927123/](https://www.pexels.com/photo/13927123/) · [/18453079/](https://www.pexels.com/photo/18453079/) · [/14487300/](https://www.pexels.com/photo/14487300/) |
| kashmir-ski | 35672518 Gulmarg snowy | 10701431 Gulmarg ski slopes | [/35672518/](https://www.pexels.com/photo/35672518/) · [/10701431/](https://www.pexels.com/photo/10701431/) |
| himalayan-combination-nepal | 28277464 Pokhara | 32132398 Himalayas · 13409974 Rhinoceros | [/28277464/](https://www.pexels.com/photo/28277464/) · [/32132398/](https://www.pexels.com/photo/32132398/) · [/13409974/](https://www.pexels.com/photo/13409974/) |
| trisuli-rafting | 32132398 Himalayas | 20988035 Kathmandu | [/32132398/](https://www.pexels.com/photo/32132398/) · [/20988035/](https://www.pexels.com/photo/20988035/) |
| nepal-mini-trek-4-day | 26926327 Nepal mountain | 20988035 Kathmandu Valley | [/26926327/](https://www.pexels.com/photo/26926327/) · [/20988035/](https://www.pexels.com/photo/20988035/) |
| nepal-wildlife-safari | 37654954 Rhinoceros | 36927764 Nepal temple · 13409974 Rhino in the sal forest | [/37654954/](https://www.pexels.com/photo/37654954/) · [/36927764/](https://www.pexels.com/photo/36927764/) · [/13409974/](https://www.pexels.com/photo/13409974/) |
| nepal-mini-trek-7-day | 32132398 Himalayas | 20988035 Kathmandu Valley · 28277464 Pokhara | [/32132398/](https://www.pexels.com/photo/32132398/) · [/20988035/](https://www.pexels.com/photo/20988035/) · [/28277464/](https://www.pexels.com/photo/28277464/) |

---

## 3. Homepage and marketing sections

### Destination carousel and place cards

| Section / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Homepage — destination carousel: Ladakh | Leh / Ladakh landscape | 38087449 | [/38087449/](https://www.pexels.com/photo/38087449/) | `data/siteContent.ts` |
| Homepage — destination carousel: Kashmir | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `data/siteContent.ts` |
| Homepage — destination carousel: Nepal | Kathmandu temples | 20988035 | [/20988035/](https://www.pexels.com/photo/20988035/) | `data/siteContent.ts` |
| Homepage — destination carousel: Rajasthan | Amber Fort | 39605929 | [/39605929/](https://www.pexels.com/photo/39605929/) | `data/siteContent.ts` |
| Homepage — destination carousel: Goa | Goa beach | 28355680 | [/28355680/](https://www.pexels.com/photo/28355680/) | `data/siteContent.ts` |
| Homepage — destination carousel: Kerala | Kerala backwaters | 30778230 | [/30778230/](https://www.pexels.com/photo/30778230/) | `data/siteContent.ts` |
| Homepage — destination carousel: Agra & the Taj | Taj Mahal | 11521892 | [/11521892/](https://www.pexels.com/photo/11521892/) | `data/siteContent.ts` |
| Homepage — destination carousel: Varanasi | Varanasi Ganga ghats | 40967314 | [/40967314/](https://www.pexels.com/photo/40967314/) | `data/siteContent.ts` |
| Journeys hero — place card: Kashmir | Dal Lake | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `data/places.ts` |
| Journeys hero — place card: Ladakh | Ladakh mountains | 38087449 | [/38087449/](https://www.pexels.com/photo/38087449/) | `data/places.ts` |
| Journeys hero — place card: Nepal | Kathmandu | 20988035 | [/20988035/](https://www.pexels.com/photo/20988035/) | `data/places.ts` |
| Journeys hero — place card: Rajasthan | Amber Fort | 39605929 | [/39605929/](https://www.pexels.com/photo/39605929/) | `data/places.ts` |
| Journeys hero — place card: Kerala | Kerala backwaters | 30778230 | [/30778230/](https://www.pexels.com/photo/30778230/) | `data/places.ts` |
| Journeys hero — place card: Himalaya | Gulmarg snowy meadow | 35672518 | [/35672518/](https://www.pexels.com/photo/35672518/) | `data/places.ts` |
| Journeys hero — place card: Agra | Taj Mahal | 11521892 | [/11521892/](https://www.pexels.com/photo/11521892/) | `data/places.ts` |
| Journeys hero — place card: Goa | Goa beach | 28355680 | [/28355680/](https://www.pexels.com/photo/28355680/) | `data/places.ts` |
| Journeys hero — place card: Varanasi | Varanasi ghats | 40967314 | [/40967314/](https://www.pexels.com/photo/40967314/) | `data/places.ts` |
| Journeys hero — place card: Kathmandu | Kathmandu temples | 20988035 | [/20988035/](https://www.pexels.com/photo/20988035/) | `data/places.ts` |

### Experience cards

| Section / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Homepage — experience card: Himalayan trekking | Himalayan mountain range | 32132398 | [/32132398/](https://www.pexels.com/photo/32132398/) | `data/siteContent.ts` |
| Homepage — experience card: Kashmir houseboats | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `data/siteContent.ts` |
| Homepage — experience card: River rafting | White-water rafting | 32651303 | [/32651303/](https://www.pexels.com/photo/32651303/) | `data/siteContent.ts` |
| Homepage — experience card: Wildlife & safaris | Greater one-horned rhino in grassland | 37654954 | [/37654954/](https://www.pexels.com/photo/37654954/) | `data/siteContent.ts` |
| Homepage — experience card: Backwaters & houseboats | Alleppey backwaters houseboat | 17545322 | [/17545322/](https://www.pexels.com/photo/17545322/) | `data/siteContent.ts` |
| Homepage — experience card: Temples & monuments | Taj Mahal | 11521892 | [/11521892/](https://www.pexels.com/photo/11521892/) | `data/siteContent.ts` |
| Homepage — experience card: Village & culture | Indian village life | 24428857 | [/24428857/](https://www.pexels.com/photo/24428857/) | `data/siteContent.ts` |

### "Why travel with us" pillar tabs

| Section / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Pillar — Destinations | Pokhara lakeside | 28277464 | [/28277464/](https://www.pexels.com/photo/28277464/) | `data/siteContent.ts` |
| Pillar — Wildlife | Greater one-horned rhino | 13409974 | [/13409974/](https://www.pexels.com/photo/13409974/) | `data/siteContent.ts` |
| Pillar — Guides | Himalaya mountain range | 18563694 | [/18563694/](https://www.pexels.com/photo/18563694/) | `data/siteContent.ts` |
| Pillar — Accommodation | Udaipur City Palace (heritage stay) | 17397822 | [/17397822/](https://www.pexels.com/photo/17397822/) | `data/siteContent.ts` |
| Pillar — Culture | Indian culture and ceremony | 36754808 | [/36754808/](https://www.pexels.com/photo/36754808/) | `data/siteContent.ts` |
| Pillar — Travel | Indian road / private transfer route | 5774277 | [/5774277/](https://www.pexels.com/photo/5774277/) | `data/siteContent.ts` |
| Pillar — Impact | Indian community | 33885308 | [/33885308/](https://www.pexels.com/photo/33885308/) | `data/siteContent.ts` |

### Other homepage sections

| Section / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| "Travel deeper" parallax image 1 (Rajasthan) | Mehrangarh Fort, Jodhpur | 15774210 | [/15774210/](https://www.pexels.com/photo/15774210/) | `components/ImpactSection.tsx` |
| "Travel deeper" parallax image 2 (Nepal) | Himalayan mountain range | 32132398 | [/32132398/](https://www.pexels.com/photo/32132398/) | `components/ImpactSection.tsx` |
| Journeys parallax band | Greater one-horned rhino in grassland | 37654954 | [/37654954/](https://www.pexels.com/photo/37654954/) | `components/JourneysBand.tsx` |

> The Journeys hero orbit backdrop (`app/journeys/journeys.css`) is a **page hero**
> and was deliberately left on its original local asset — see §9.

---

## 4. Package detail and category pages

| Page / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Package detail — hero background | Per-package primary image | see §2 | see §2 | `components/package/PackageHero.tsx` |
| Package detail — gallery + lightbox | Per-package gallery images | see §2 | see §2 | `components/package/PackageGallery.tsx` |
| Package detail — related package sidebar | Related packages' primary images | see §2 | see §2 | `components/package/PackageSidebar.tsx` |

> Category page heroes are **page heroes** and were deliberately left on their
> original local assets — see §9.

---

## 5. Houseboats page

| Section / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Collection card — Cedar houseboats | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `data/houseboats.ts` |
| Collection card — Sunrise from the roof | Kashmir lake shores | 34971547 | [/34971547/](https://www.pexels.com/photo/34971547/) | `data/houseboats.ts` |
| Collection card — The floating market | Srinagar | 29251278 | [/29251278/](https://www.pexels.com/photo/29251278/) | `data/houseboats.ts` |
| Collection card — Crafts of the valley | Indian village life | 24428857 | [/24428857/](https://www.pexels.com/photo/24428857/) | `data/houseboats.ts` |
| Collection card — Gulmarg & Pahalgam | Gulmarg snowy meadow | 35672518 | [/35672518/](https://www.pexels.com/photo/35672518/) | `data/houseboats.ts` |
| Pillar tab — The houseboat | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `data/houseboats.ts` |
| Pillar tab — On the lake | Kashmir lake shores | 34971547 | [/34971547/](https://www.pexels.com/photo/34971547/) | `data/houseboats.ts` |
| Pillar tab — The floating market | Srinagar | 29251278 | [/29251278/](https://www.pexels.com/photo/29251278/) | `data/houseboats.ts` |
| Pillar tab — Crafts & culture | Indian village life | 24428857 | [/24428857/](https://www.pexels.com/photo/24428857/) | `data/houseboats.ts` |
| Pillar tab — Beyond the lake | Gulmarg snowy meadow | 35672518 | [/35672518/](https://www.pexels.com/photo/35672518/) | `data/houseboats.ts` |
| Full-bleed journeys band | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `components/houseboats/HouseboatJourneys.tsx` |
| Discover portrait plate | Srinagar | 29251278 | [/29251278/](https://www.pexels.com/photo/29251278/) | `components/houseboats/HouseboatDiscover.tsx` |
| Closing CTA | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `app/houseboats/page.tsx` |

> The Houseboats page hero (`components/houseboats/HouseboatHero.tsx`) and the
> closing CTA banner are **page heroes** and were deliberately left on their
> original local assets — see §9.

---

## 6. About, contact and enquiry pages

| Page / component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| About — India card | Amber Fort, Jaipur | 39605929 | [/39605929/](https://www.pexels.com/photo/39605929/) | `app/about/page.tsx` |
| About — Nepal card | Kathmandu temples | 20988035 | [/20988035/](https://www.pexels.com/photo/20988035/) | `app/about/page.tsx` |
| About — founder quote mark | Namaste greeting | 3822669 | [/3822669/](https://www.pexels.com/photo/3822669/) | `app/about/page.tsx` |
| About — team portrait 1 (Yousuf Baktoo) | Portrait placeholder | 7089664 | [/7089664/](https://www.pexels.com/photo/7089664/) | `app/about/page.tsx` |
| About — team portrait 2 (Imtiaz Baktoo) | Portrait placeholder | 11800909 | [/11800909/](https://www.pexels.com/photo/11800909/) | `app/about/page.tsx` |
| About — team portrait 3 (Hashim Baktoo) | Portrait placeholder | 27442817 | [/27442817/](https://www.pexels.com/photo/27442817/) | `app/about/page.tsx` |
| Enquiry — journey card fallback | Pangong Lake | 27593915 | [/27593915/](https://www.pexels.com/photo/27593915/) | `components/EnquiryForm.tsx` |
| Enquiry — journey card (selected) | Per-package primary image | see §2 | see §2 | `components/EnquiryForm.tsx` |

> The About and Contact page heroes, and the full-bleed closing CTA banners on
> About / Contact / Journeys / Houseboats, are **page heroes** and were
> deliberately left on their original local assets — see §9.

---

## 7. Navigation

| Component | Subject | Photo ID | Pexels source page | Code location |
|---|---|---|---|---|
| Mega menu — Stopovers | Red Fort, Delhi | 14094276 | [/14094276/](https://www.pexels.com/photo/14094276/) | `components/MegaMenu.tsx` |
| Mega menu — Images of India | Taj Mahal | 11521892 | [/11521892/](https://www.pexels.com/photo/11521892/) | `components/MegaMenu.tsx` |
| Mega menu — India Tours | Taj Mahal | 11521892 | [/11521892/](https://www.pexels.com/photo/11521892/) | `components/MegaMenu.tsx` |
| Mega menu — Mini Trek in Kashmir | Gulmarg snowy meadow | 35672518 | [/35672518/](https://www.pexels.com/photo/35672518/) | `components/MegaMenu.tsx` |
| Mega menu — Himalayan Expeditions | Ladakh mountain landscape | 38087449 | [/38087449/](https://www.pexels.com/photo/38087449/) | `components/MegaMenu.tsx` |
| Mega menu — Nepal Adventure | Pokhara lakeside | 28277464 | [/28277464/](https://www.pexels.com/photo/28277464/) | `components/MegaMenu.tsx` |
| Mega menu — Kashmir Houseboats entry | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `components/MegaMenu.tsx` |
| Mega menu — Houseboats promo panel | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `components/MegaMenu.tsx` |
| Mega menu — heritage promo panel | Rajput palace architecture | 39605929 | [/39605929/](https://www.pexels.com/photo/39605929/) | `components/MegaMenu.tsx` |
| Mega menu — contact promo panel | Srinagar | 29251278 | [/29251278/](https://www.pexels.com/photo/29251278/) | `components/MegaMenu.tsx` |
| Mobile nav — Kashmir houseboats | Dal Lake houseboats | 40348598 | [/40348598/](https://www.pexels.com/photo/40348598/) | `components/MobileNav.tsx` |

---

## 8. Homepage hero video posters

The homepage hero cycles 25 Pexels videos. Poster frames are served from
`images.pexels.com/videos/...` and each entry already records its own Pexels
video page in `app/src/data/heroVideos.ts` (`pexelsUrl`). These were already
Pexels-sourced, destination-accurate, and are unchanged by this audit.

| Video title | Location | Pexels video page |
|---|---|---|
| Lamayuru Monastery (Moonland) | Ladakh | https://www.pexels.com/video/lamayuru-monastery-or-gompa-is-a-tibetan-style-buddhist-monastery-in-lamayuru-village-in-ladakh-north-india-19079016/ |
| India Gate Monument | New Delhi | https://www.pexels.com/video/footage-of-india-gate-on-a-hazy-day-6583582/ |
| Dal Lake & Snow-Covered Mountains | Srinagar | https://www.pexels.com/video/in-the-heart-of-kashmir-where-snow-covered-mountains-and-dal-lake-meet-nature-s-beauty-sings-in-harmony-26244070/ |
| Taj Mahal via Grand Archway | Agra | https://www.pexels.com/video/taj-mahal-view-through-grand-archway-40047157/ |
| Alleppey Backwaters & Kettuvallam Cruise | Kerala | https://www.pexels.com/video/serene-kerala-backwaters-houseboat-tour-35559173/ |
| Jaisalmer Fort in Golden Twilight | Rajasthan | https://www.pexels.com/video/jaisalmer-fort-in-golden-twilight-37092098/ |
| Swayambhunath Stupa & Prayer Flags | Kathmandu | https://www.pexels.com/video/swayambhunath-stupa-with-prayer-flags-in-kathmandu-35847747/ |
| Varanasi Ghats & Ganges Boating | Varanasi | https://www.pexels.com/video/tranquil-scene-at-varanasi-ghats-on-the-ganges-36954691/ |
| Rangdum Village in Zanskar Valley | Ladakh | https://www.pexels.com/video/rangdum-village-in-zanskar-valley-19022223/ |
| Alpine Conifers & Mountain Meadows | Gulmarg | https://www.pexels.com/video/drone-footage-of-gulmarg-10760752/ |
| Qutub Minar Victory Minaret | New Delhi | https://www.pexels.com/video/qutub-minar-15415939/ |
| Mehrangarh Fort Panoramic Ramparts | Jodhpur | https://www.pexels.com/video/aerial-view-of-majestic-mehrangarh-fort-in-jodhpur-31031043/ |
| Tropical Coastal Palm Shores & Sunset | Goa | https://www.pexels.com/video/scenic-drone-view-of-tropical-sunset-beach-30664191/ |
| Hawa Mahal (Palace of the Winds) | Jaipur | https://www.pexels.com/video/the-hawa-mahal-palace-in-jaipur-india-19003054/ |
| Glacial Rapids & River Valley | Kashmir Valley | https://www.pexels.com/video/flowing-water-with-sound-18094682/ |
| Humayun's Tomb Red Sandstone Facade | New Delhi | https://www.pexels.com/video/humayun-s-tomb-facade-6161097/ |
| Taj Mahal Marble Domes & Minarets | Agra | https://www.pexels.com/video/taj-mahal-iconic-beauty-of-islamic-architecture-30276170/ |
| Snowmobiles Across High Winter Passes | Gulmarg | https://www.pexels.com/video/people-riding-snowmobiles-13254447/ |
| Auto-Rickshaw Journey Through Streets | Old Delhi | https://www.pexels.com/video/auto-rickshaw-journey-through-busy-indian-streets-34162594/ |
| Misty Mountain Peaks on a Rainy Day | Northern Himalaya | https://www.pexels.com/video/drone-footage-of-a-foggy-mountain-area-on-a-rainy-day-15756886/ |
| Parliament House & Central Vista | New Delhi | https://www.pexels.com/video/indian-parliament-building-complex-in-new-delhi-india-20794147/ |
| Connaught Place Classical Colonades | New Delhi | https://www.pexels.com/video/connaught-place-20038088/ |
| Humayun's Tomb Mughal Charbagh | New Delhi | https://www.pexels.com/video/scenic-view-of-humayun-s-tomb-in-new-delhi-39635917/ |

---

## 9. Retained images

### 9a. Page heroes — restored to their original local assets

Page-level hero surfaces (the full-bleed banner at the top of each page and the
full-height closing CTA bands) were deliberately **left on their original local
brochure assets**. They were briefly swapped to Pexels during the audit and then
restored on request, because the hero treatment is part of the established
visual identity of the site.

| Page / section | Local asset | Source |
|---|---|---|
| About — page hero | `/images/destinations/about-hero.jpg` | Cropped from `Brochure.pdf` — see `app/public/images/SOURCES.md` |
| Contact — page hero | `/images/destinations/contact.jpg` | Cropped from `Brochure.pdf` — see `app/public/images/SOURCES.md` |
| Houseboats — page hero | `/images/services/houseboats.jpg` | Cropped from `Brochure.pdf` — see `app/public/images/SOURCES.md` |
| Journeys — hero orbit backdrop (CSS) | `/images/misty-mountain-valley.jpg` | Cropped from `Brochure.pdf` — see `app/public/images/SOURCES.md` |
| Category pages — Nepal Adventure hero | `/images/destinations/nepal-boudhanath-dusk.jpg` | Cropped from `Brochure.pdf` |
| Category pages — Kashmir / Houseboats hero | `/images/destinations/kashmir-shikara.jpg` | Cropped from `Brochure.pdf` |
| Category pages — Himalayan / Trek / Ladakh hero | `/images/destinations/ladakh-key-monastery.jpg` | Cropped from `Brochure.pdf` |
| Category pages — Kerala / South India hero | `/images/destinations/kerala-backwaters.jpg` | Cropped from `Brochure.pdf` |
| Category pages — Wildlife / Safari hero | `/images/destinations/rhino.jpg` | Cropped from `Brochure.pdf` |
| Category pages — default hero | `/images/destinations/taj-mahal.jpg` | Cropped from `Brochure.pdf` |
| About — closing CTA band | `/images/destinations/kashmir-shikara.jpg` | Cropped from `Brochure.pdf` |
| Contact — closing CTA band | `/images/destinations/kashmir-shikara.jpg` | Cropped from `Brochure.pdf` |
| Journeys — closing CTA band | `/images/destinations/kashmir-shikara.jpg` | Cropped from `Brochure.pdf` |
| Houseboats — closing CTA band | `/images/services/houseboats.jpg` | Cropped from `Brochure.pdf` |

### 9b. Archival portraits of named individuals — no Pexels equivalent exists

Two images are deliberately **not** replaced. Both are archival portraits of
named individuals lifted from the organisation's own brochure, and substituting
an unrelated stock photograph of a different person would misattribute an
identity. They remain in place and keep their original local paths.

| Image | Subject | Why retained | Source |
|---|---|---|---|
| `/images/destinations/sultan-baktoo.jpg` | Sultan Baktoo, founding member | Archival portrait of a real, named individual. Pexels cannot supply a photograph of this person; a stock substitute would falsely caption them. | Cropped from `Brochure.pdf` p1 — see `app/public/images/SOURCES.md` |
| `/images/destinations/farook-baktoo.jpg` | Farook Baktoo, Director & expedition leader | Archival portrait of a real, named individual. Same reasoning as above. | Cropped from `Brochure.pdf` p1 — see `app/public/images/SOURCES.md` |

### 9c. Outstanding asset requests

- **Original team photographs.** Three leadership portraits referenced by the
  About page (`yousuf-baktoo.jpg`, `imtiaz-baktoo.jpg`, `hashim-baktoo.jpg`)
  did not exist in the repository and were rendering as broken images. Generic
  Pexels portraits have been substituted as clearly-labelled placeholders
  (alt text reads *"Portrait placeholder … original photograph not yet
  supplied"*). Supply the real photographs to replace them.
- **`greeting-lady.jpg`** and the `images/orbit/*` set are no longer referenced
  by any component. They can be deleted from `app/public/images/` once the
  archive retention decision is made.
