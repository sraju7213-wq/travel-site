# Image sources

Complete reference for every image rendered on the website, with the Pexels
photo-page URL used for licence verification.

> **Scope note.** Most package thumbnails, package detail galleries, package
> heroes, destination cards, experience cards, pillar panels, navigation imagery
> and content-card imagery use Pexels photography; client-supplied package photo
> batches are documented in §2. **Page-level hero banners were deliberately left
> on their original local brochure assets** — see §9a for the full list.

## Licensing

Pexels replacement photography is sourced from <https://www.pexels.com/> and is
used under the [Pexels License](https://www.pexels.com/license/). Client-supplied
package photographs are copied unchanged and recorded in §2. Pexels images are free to use
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
https://images.pexels.com/photos/{PHOTO_ID}/pexels-photo-{PHOTO_ID}.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop&dpr=2
```

`w=1200&h=800&fit=crop` produces a 3:2 landscape crop suited to the card and hero frames (without `fit=crop` Pexels returns a square image);
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
| 25786562 | Dal Lake, Srinagar | https://www.pexels.com/photo/dal-lake-in-india-25786562/ |
| 26926327 | Nepal mountain and foothill trails | https://www.pexels.com/photo/26926327/ |
| 27442817 | Portrait placeholder — Indian man | https://www.pexels.com/photo/27442817/ |
| 27593915 | Pangong Lake, Ladakh | https://www.pexels.com/photo/27593915/ |
| 28277464 | Pokhara lakeside | https://www.pexels.com/photo/28277464/ |
| 28355680 | Goa beach and the Arabian Sea coastline | https://www.pexels.com/photo/28355680/ |
| 29251278 | Srinagar, Kashmir | https://www.pexels.com/photo/29251278/ |
| 29676602 | Gulmarg mountain landscape | https://www.pexels.com/photo/serene-mountain-landscape-in-gulmarg-29676602/ |
| 30378592 | India Gate, New Delhi | https://www.pexels.com/photo/30378592/ |
| 30778230 | Kerala backwaters | https://www.pexels.com/photo/30778230/ |
| 32132398 | Himalayan mountain range | https://www.pexels.com/photo/32132398/ |
| 32651303 | White-water rafting | https://www.pexels.com/photo/32651303/ |
| 33885308 | Indian people and community | https://www.pexels.com/photo/33885308/ |
| 34971547 | Kashmir beauty — Dal Lake shores | https://www.pexels.com/photo/34971547/ |
| 35130760 | Jaisalmer Fort, Rajasthan | https://www.pexels.com/photo/35130760/ |
| 35672518 | Gulmarg snowy meadow, Kashmir | https://www.pexels.com/photo/35672518/ |
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
| 417173 | Snow-covered mountain above the clouds | https://www.pexels.com/photo/417173/ |
| 789750 | India Gate, New Delhi | https://www.pexels.com/photo/789750/ |
| 797824 | Jaisalmer fort rising above the desert | https://www.pexels.com/photo/797824/ |
| 2828471 | Raft navigating a rapid | https://www.pexels.com/photo/2828471/ |
| 6576275 | Hillside monastery in the Leh landscape | https://www.pexels.com/photo/6576275/ |
| 9529227 | Fatehpur Sikri sandstone palace | https://www.pexels.com/photo/9529227/ |
| 11024977 | Snow-covered slopes at Gulmarg | https://www.pexels.com/photo/11024977/ |
| 11685351 | Mughal garden courtyard in Srinagar | https://www.pexels.com/photo/11685351/ |
| 12141330 | Turquoise mountain river in Pahalgam | https://www.pexels.com/photo/12141330/ |
| 12328763 | Rafting through white water | https://www.pexels.com/photo/12328763/ |
| 12750077 | Shikara boats on Dal Lake | https://www.pexels.com/photo/12750077/ |
| 13827306 | Houseboat on Dal Lake, Srinagar | https://www.pexels.com/photo/13827306/ |
| 14136902 | Hillside village on the trek route | https://www.pexels.com/photo/14136902/ |
| 14367175 | Temple square in Kathmandu | https://www.pexels.com/photo/14367175/ |
| 14477905 | Pangong Lake and the shoreline | https://www.pexels.com/photo/14477905/ |
| 14989387 | Mountain reflections on a still lake | https://www.pexels.com/photo/14989387/ |
| 15961864 | Boats on the lake at dusk | https://www.pexels.com/photo/15961864/ |
| 16139382 | India Gate in New Delhi | https://www.pexels.com/photo/16139382/ |
| 16304344 | Rafters paddling through rapids | https://www.pexels.com/photo/16304344/ |
| 16930780 | Mughal garden in Srinagar | https://www.pexels.com/photo/16930780/ |
| 17033858 | Glacier on the high Ladakh trail | https://www.pexels.com/photo/17033858/ |
| 17851168 | Alpine lake in the Zanskar range | https://www.pexels.com/photo/17851168/ |
| 17911339 | Hawa Mahal in Jaipur | https://www.pexels.com/photo/17911339/ |
| 18014641 | Turquoise water at Pangong Lake | https://www.pexels.com/photo/18014641/ |
| 18479132 | Village and fields in the Kashmir valley | https://www.pexels.com/photo/18479132/ |
| 18646449 | Rocky mountain route through the valley | https://www.pexels.com/photo/18646449/ |
| 19149591 | Hawa Mahal, Jaipur | https://www.pexels.com/photo/19149591/ |
| 19267288 | Garden pavilion in Srinagar | https://www.pexels.com/photo/19267288/ |
| 19751469 | Raft on a mountain river | https://www.pexels.com/photo/19751469/ |
| 19867576 | Red Fort, Delhi | https://www.pexels.com/photo/19867576/ |
| 19984413 | Elephant in a forest clearing | https://www.pexels.com/photo/19984413/ |
| 20046912 | Elephant on a forest track | https://www.pexels.com/photo/20046912/ |
| 20468084 | Prayer flags beside the mountain path | https://www.pexels.com/photo/20468084/ |
| 23476457 | Desert dunes near Nubra | https://www.pexels.com/photo/23476457/ |
| 23476484 | Mountain road on the Zanskar route | https://www.pexels.com/photo/23476484/ |
| 25109764 | Hawa Mahal in Jaipur | https://www.pexels.com/photo/25109764/ |
| 28428787 | Sandstone fort in Rajasthan | https://www.pexels.com/photo/28428787/ |
| 28486584 | Village in the Ladakh highlands | https://www.pexels.com/photo/28486584/ |
| 28867843 | Hillside monastery near Kathmandu | https://www.pexels.com/photo/28867843/ |
| 29230409 | Lake and mountain peaks near Pokhara | https://www.pexels.com/photo/29230409/ |
| 29494222 | River valley below the trekking route | https://www.pexels.com/photo/29494222/ |
| 30209447 | Stream through a Himalayan meadow | https://www.pexels.com/photo/30209447/ |
| 30314244 | Mountain lake reflecting the peaks | https://www.pexels.com/photo/30314244/ |
| 30495788 | Lakeside town below the Himalaya | https://www.pexels.com/photo/30495788/ |
| 30954090 | Kathmandu cityscape reflected in water | https://www.pexels.com/photo/30954090/ |
| 31346681 | Monastery above the Ladakh valley | https://www.pexels.com/photo/31346681/ |
| 31539358 | Alpine lake bordered by flowers | https://www.pexels.com/photo/31539358/ |
| 34293906 | Confluence of mountain rivers in Ladakh | https://www.pexels.com/photo/34293906/ |
| 34627106 | Close view of rapids on the river | https://www.pexels.com/photo/34627106/ |
| 34729832 | Mountain ridge on the Nepal trek | https://www.pexels.com/photo/34729832/ |
| 34741292 | Boats along the Varanasi ghats | https://www.pexels.com/photo/34741292/ |
| 34744875 | Sunrise on a Himalayan peak | https://www.pexels.com/photo/34744875/ |
| 35672511 | Snow-fed stream near Gulmarg | https://www.pexels.com/photo/35672511/ |
| 36236710 | Boats on a Pokhara lake | https://www.pexels.com/photo/36236710/ |
| 36373100 | Kathmandu temple street | https://www.pexels.com/photo/36373100/ |
| 36526508 | Temple courtyard in Kathmandu | https://www.pexels.com/photo/36526508/ |
| 37263498 | Backpackers on an Annapurna trail | https://www.pexels.com/photo/37263498/ |
| 38071987 | Buddhist temple near Leh | https://www.pexels.com/photo/38071987/ |
| 38263405 | Agra Fort sandstone architecture | https://www.pexels.com/photo/38263405/ |
| 38351536 | Wildlife in the Nepalese grasslands | https://www.pexels.com/photo/38351536/ |
| 38857186 | Boat ride on the Ganges at Varanasi | https://www.pexels.com/photo/38857186/ |
| 39008292 | Trekkers resting below Himalayan peaks | https://www.pexels.com/photo/39008292/ |
| 40285696 | Himalayan peak above the trail | https://www.pexels.com/photo/40285696/ |
| 40476209 | Sand dunes in the Nubra valley | https://www.pexels.com/photo/40476209/ |
| 41042401 | Sunrise over the mountain range | https://www.pexels.com/photo/41042401/ |
| 41109602 | Stone passage through an old fort | https://www.pexels.com/photo/41109602/ |
| 41154920 | Forest path in the Nepal foothills | https://www.pexels.com/photo/41154920/ |
| 35618769 | Swayambhunath Stupa and prayer flags, Kathmandu | https://www.pexels.com/photo/35618769/ |
| 39045766 | Boudhanath Stupa with prayer flags, Kathmandu | https://www.pexels.com/photo/39045766/ |
| 15832951 | Taj Mahal at golden sunset, Agra | https://www.pexels.com/photo/15832951/ |
| 28749617 | Taj Mahal under blue sky, Agra | https://www.pexels.com/photo/28749617/ |
| 12446195 | Taj Mahal at sunrise with reflection, Agra | https://www.pexels.com/photo/12446195/ |
| 16753416 | Taj Mahal reflected at sunset, Agra | https://www.pexels.com/photo/16753416/ |
| 34741303 | Varanasi ghats at golden hour | https://www.pexels.com/photo/34741303/ |
| 38532251 | Boudhanath Stupa, Kathmandu | https://www.pexels.com/photo/38532251/ |
| 37786606 | Boudhanath Stupa under a clear sky, Kathmandu | https://www.pexels.com/photo/37786606/ |
| 36564701 | Visitors at Boudhanath Stupa, Kathmandu | https://www.pexels.com/photo/36564701/ |
| 21382502 | City Palace across Lake Pichola, Udaipur | https://www.pexels.com/photo/21382502/ |
| 39567970 | City Palace overlooking Lake Pichola, Udaipur | https://www.pexels.com/photo/39567970/ |
| 29232390 | Lamayuru Monastery, Leh, Ladakh | https://www.pexels.com/photo/29232390/ |
| 30743691 | Thiksey Monastery, Ladakh | https://www.pexels.com/photo/30743691/ |
| 5014921 | Namgyal Tsemo Monastery above Leh | https://www.pexels.com/photo/5014921/ |
| 17812152 | Lamayuru Monastery in the Zanskar landscape | https://www.pexels.com/photo/17812152/ |
| 18646446 | Rangdum village, Zanskar valley | https://www.pexels.com/photo/18646446/ |
| 18002548 | Suru valley landscape, Ladakh | https://www.pexels.com/photo/18002548/ |
| 20718134 | Hiker beside an alpine lake in Ganderbal, Kashmir | https://www.pexels.com/photo/20718134/ |
| 27497828 | Gulmarg meadow and mountain wildflowers | https://www.pexels.com/photo/27497828/ |
| 20046905 | Himalaya Mountains with hikers, Nepal | https://www.pexels.com/photo/20046905/ |
| 2609459 | Himalayan mountain trail, Nepal | https://www.pexels.com/photo/2609459/ |
| 5011391 | Hikers on a snowy Himalayan trail, Nepal | https://www.pexels.com/photo/5011391/ |
| 32651302 | White-water rafting through rapids | https://www.pexels.com/photo/32651302/ |
| 39606971 | Group white-water rafting adventure | https://www.pexels.com/photo/39606971/ |

---

## 2. Travel package thumbnails and galleries

Source of truth: `app/src/data/catalogue.ts` → `PACKAGE_IMAGES`.
The primary image drives package cards, the in-season carousel, the poster rail,
the orbit hero, the coverflow swiper, the enquiry form card, the related-package
sidebar and the admin package picker. Gallery images drive the detail-page
gallery and its lightbox.

| Package | Primary image | Gallery images | Pexels source pages |
|---|---|---|---|
| delhi-stopover | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/delhi-stopover/`) | — |
| bombay-stopover | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/bombay-stopover/`) | — |
| discover-leh | 38087449 Leh and the Ladakh mountain landscape | 38087450 Nubra Valley, Ladakh · 6576275 Hillside monastery in the Leh landscape · 38071987 Buddhist temple near Leh · 40476209 Sand dunes in the Nubra valley · 23476457 Desert dunes near Nubra · 31346681 Monastery above the Ladakh valley | [/38087449/](https://www.pexels.com/photo/38087449/) · [/38087450/](https://www.pexels.com/photo/38087450/) · [/6576275/](https://www.pexels.com/photo/6576275/) · [/38071987/](https://www.pexels.com/photo/38071987/) · [/40476209/](https://www.pexels.com/photo/40476209/) · [/23476457/](https://www.pexels.com/photo/23476457/) · [/31346681/](https://www.pexels.com/photo/31346681/) |
| kathmandu-stopover | 20988035 Kathmandu cityscape and temples | 36927764 Nepalese temple with prayer flags · 35618769 Swayambhunath Stupa and prayer flags, Kathmandu · 14367175 Temple square in Kathmandu · 36373100 Kathmandu temple street · 28867843 Hillside monastery near Kathmandu · 30954090 Kathmandu cityscape reflected in water | [/20988035/](https://www.pexels.com/photo/20988035/) · [/36927764/](https://www.pexels.com/photo/36927764/) · [/35618769/](https://www.pexels.com/photo/35618769/) · [/14367175/](https://www.pexels.com/photo/14367175/) · [/36373100/](https://www.pexels.com/photo/36373100/) · [/28867843/](https://www.pexels.com/photo/28867843/) · [/30954090/](https://www.pexels.com/photo/30954090/) |
| kathmandu-pokhara | 28277464 Pokhara lakeside | 39045766 Boudhanath Stupa with prayer flags, Kathmandu · 32132398 Himalayan mountain range · 29230409 Lake and mountain peaks near Pokhara · 36236710 Boats on a Pokhara lake · 30495788 Lakeside town below the Himalaya · 14989387 Mountain reflections on a still lake | [/28277464/](https://www.pexels.com/photo/28277464/) · [/39045766/](https://www.pexels.com/photo/39045766/) · [/32132398/](https://www.pexels.com/photo/32132398/) · [/29230409/](https://www.pexels.com/photo/29230409/) · [/36236710/](https://www.pexels.com/photo/36236710/) · [/30495788/](https://www.pexels.com/photo/30495788/) · [/14989387/](https://www.pexels.com/photo/14989387/) |
| discover-ladakh | 27593915 Pangong Lake, Ladakh | client-supplied local photos (`images/packages/discover-ladakh/`) · 14477905 Pangong Lake and the shoreline · 18014641 Turquoise water at Pangong Lake | [/27593915/](https://www.pexels.com/photo/27593915/) · [/14477905/](https://www.pexels.com/photo/14477905/) · [/18014641/](https://www.pexels.com/photo/18014641/) |
| golden-triangle | 11521892 Taj Mahal, Agra | 39605929 Amber Fort, Jaipur, Rajasthan · 14094276 Red Fort, Delhi · 30378592 India Gate, New Delhi · 9529227 Fatehpur Sikri sandstone palace · 17911339 Hawa Mahal in Jaipur · 16139382 India Gate in New Delhi | [/11521892/](https://www.pexels.com/photo/11521892/) · [/39605929/](https://www.pexels.com/photo/39605929/) · [/14094276/](https://www.pexels.com/photo/14094276/) · [/30378592/](https://www.pexels.com/photo/30378592/) · [/9529227/](https://www.pexels.com/photo/9529227/) · [/17911339/](https://www.pexels.com/photo/17911339/) · [/16139382/](https://www.pexels.com/photo/16139382/) |
| glorious-goa-stopover | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/glorious-goa-stopover/`) | — |
| glimpses-of-kerala | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/glimpses-of-kerala/`) | — |
| kashmir-package-7-day | 40348598 Dal Lake and houseboats, Srinagar | 35672518 Gulmarg snowy meadow, Kashmir · 16252950 Sonamarg valley, Kashmir · 13927123 Pahalgam and the Lidder River, Kashmir · 12750077 Shikara boats on Dal Lake · 16930780 Mughal garden in Srinagar · 35672511 Snow-fed stream near Gulmarg | [/40348598/](https://www.pexels.com/photo/40348598/) · [/35672518/](https://www.pexels.com/photo/35672518/) · [/16252950/](https://www.pexels.com/photo/16252950/) · [/13927123/](https://www.pexels.com/photo/13927123/) · [/12750077/](https://www.pexels.com/photo/12750077/) · [/16930780/](https://www.pexels.com/photo/16930780/) · [/35672511/](https://www.pexels.com/photo/35672511/) |
| kashmir-package-4-day | 29251278 Srinagar, Kashmir | 25786562 Dal Lake, Srinagar · 18453079 Kashmir valley and the Srinagar surrounds · 13827306 Houseboat on Dal Lake, Srinagar · 19267288 Garden pavilion in Srinagar · 15961864 Boats on the lake at dusk · 11685351 Mughal garden courtyard in Srinagar | [/29251278/](https://www.pexels.com/photo/29251278/) · [/25786562/](https://www.pexels.com/photo/25786562/) · [/18453079/](https://www.pexels.com/photo/18453079/) · [/13827306/](https://www.pexels.com/photo/13827306/) · [/19267288/](https://www.pexels.com/photo/19267288/) · [/15961864/](https://www.pexels.com/photo/15961864/) · [/11685351/](https://www.pexels.com/photo/11685351/) |
| delhi-to-kathmandu | 15832951 Taj Mahal at golden sunset, Agra | 34741303 Varanasi ghats at golden hour · 38532251 Boudhanath Stupa, Kathmandu · 38263405 Agra Fort sandstone architecture · 38857186 Boat ride on the Ganges at Varanasi · 34741292 Boats along the Varanasi ghats · 789750 India Gate, New Delhi | [/15832951/](https://www.pexels.com/photo/15832951/) · [/34741303/](https://www.pexels.com/photo/34741303/) · [/38532251/](https://www.pexels.com/photo/38532251/) · [/38263405/](https://www.pexels.com/photo/38263405/) · [/38857186/](https://www.pexels.com/photo/38857186/) · [/34741292/](https://www.pexels.com/photo/34741292/) · [/789750/](https://www.pexels.com/photo/789750/) |
| heritage-tour-india | 35130760 Jaisalmer Fort, Rajasthan | 15774210 Mehrangarh Fort, Jodhpur · 28749617 Taj Mahal under blue sky, Agra · 21382502 City Palace across Lake Pichola, Udaipur · 797824 Jaisalmer fort rising above the desert · 28428787 Sandstone fort in Rajasthan · 41109602 Stone passage through an old fort | [/35130760/](https://www.pexels.com/photo/35130760/) · [/15774210/](https://www.pexels.com/photo/15774210/) · [/28749617/](https://www.pexels.com/photo/28749617/) · [/21382502/](https://www.pexels.com/photo/21382502/) · [/797824/](https://www.pexels.com/photo/797824/) · [/28428787/](https://www.pexels.com/photo/28428787/) · [/41109602/](https://www.pexels.com/photo/41109602/) |
| north-india-highlights | 12446195 Taj Mahal at sunrise with reflection, Agra | 15534251 Udaipur lakeside city, Rajasthan · 34971547 Kashmir beauty — Dal Lake shores · 29232390 Lamayuru Monastery, Leh, Ladakh · 19149591 Hawa Mahal, Jaipur · 11024977 Snow-covered slopes at Gulmarg · 12141330 Turquoise mountain river in Pahalgam | [/12446195/](https://www.pexels.com/photo/12446195/) · [/15534251/](https://www.pexels.com/photo/15534251/) · [/34971547/](https://www.pexels.com/photo/34971547/) · [/29232390/](https://www.pexels.com/photo/29232390/) · [/19149591/](https://www.pexels.com/photo/19149591/) · [/11024977/](https://www.pexels.com/photo/11024977/) · [/12141330/](https://www.pexels.com/photo/12141330/) |
| india-nepal-combination | 16753416 Taj Mahal reflected at sunset, Agra | 36754808 Ganga Aarti ceremony on the Varanasi ghats · 37786606 Boudhanath Stupa under a clear sky, Kathmandu · 39567970 City Palace overlooking Lake Pichola, Udaipur · 19867576 Red Fort, Delhi · 25109764 Hawa Mahal in Jaipur · 36526508 Temple courtyard in Kathmandu | [/16753416/](https://www.pexels.com/photo/16753416/) · [/36754808/](https://www.pexels.com/photo/36754808/) · [/37786606/](https://www.pexels.com/photo/37786606/) · [/39567970/](https://www.pexels.com/photo/39567970/) · [/19867576/](https://www.pexels.com/photo/19867576/) · [/25109764/](https://www.pexels.com/photo/25109764/) · [/36526508/](https://www.pexels.com/photo/36526508/) |
| south-india-highlight | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/south-india-highlight/`) | — |
| markha-valley | 30743691 Thiksey Monastery, Ladakh | 5014921 Namgyal Tsemo Monastery above Leh · 18563694 Himalaya mountain range · 17033858 Glacier on the high Ladakh trail · 20468084 Prayer flags beside the mountain path · 28486584 Village in the Ladakh highlands · 18646449 Rocky mountain route through the valley | [/30743691/](https://www.pexels.com/photo/30743691/) · [/5014921/](https://www.pexels.com/photo/5014921/) · [/18563694/](https://www.pexels.com/photo/18563694/) · [/17033858/](https://www.pexels.com/photo/17033858/) · [/20468084/](https://www.pexels.com/photo/20468084/) · [/28486584/](https://www.pexels.com/photo/28486584/) · [/18646449/](https://www.pexels.com/photo/18646449/) |
| kashmir-zanskar-ladakh-trek | 18646446 Rangdum village, Zanskar valley | 18002548 Suru valley landscape, Ladakh · 17812152 Lamayuru Monastery in the Zanskar landscape · 17851168 Alpine lake in the Zanskar range · 23476484 Mountain road on the Zanskar route · 29494222 River valley below the trekking route · 34293906 Confluence of mountain rivers in Ladakh | [/18646446/](https://www.pexels.com/photo/18646446/) · [/18002548/](https://www.pexels.com/photo/18002548/) · [/17812152/](https://www.pexels.com/photo/17812152/) · [/17851168/](https://www.pexels.com/photo/17851168/) · [/23476484/](https://www.pexels.com/photo/23476484/) · [/29494222/](https://www.pexels.com/photo/29494222/) · [/34293906/](https://www.pexels.com/photo/34293906/) |
| kashmir-combinations-little-tibet | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/kashmir-combinations-little-tibet/`) | — |
| kashmir-mini-adventure | 14487300 Sonamarg glacier approach, Kashmir | 20718134 Hiker beside an alpine lake in Ganderbal, Kashmir · 27497828 Gulmarg meadow and mountain wildflowers · 30314244 Mountain lake reflecting the peaks · 31539358 Alpine lake bordered by flowers · 18479132 Village and fields in the Kashmir valley · 30209447 Stream through a Himalayan meadow | [/14487300/](https://www.pexels.com/photo/14487300/) · [/20718134/](https://www.pexels.com/photo/20718134/) · [/27497828/](https://www.pexels.com/photo/27497828/) · [/30314244/](https://www.pexels.com/photo/30314244/) · [/31539358/](https://www.pexels.com/photo/31539358/) · [/18479132/](https://www.pexels.com/photo/18479132/) · [/30209447/](https://www.pexels.com/photo/30209447/) |
| vale-of-kashmir-trek | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/vale-of-kashmir-trek/`) | — |
| kashmir-ski | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/kashmir-ski/`) | — |
| himalayan-combination-nepal | 20046905 Himalaya Mountains with hikers, Nepal | 2609459 Himalayan mountain trail, Nepal · 13409974 Greater one-horned rhinoceros in water · 32651302 White-water rafting through rapids · 37263498 Backpackers on an Annapurna trail · 39008292 Trekkers resting below Himalayan peaks · 38351536 Wildlife in the Nepalese grasslands | [/20046905/](https://www.pexels.com/photo/20046905/) · [/2609459/](https://www.pexels.com/photo/2609459/) · [/13409974/](https://www.pexels.com/photo/13409974/) · [/32651302/](https://www.pexels.com/photo/32651302/) · [/37263498/](https://www.pexels.com/photo/37263498/) · [/39008292/](https://www.pexels.com/photo/39008292/) · [/38351536/](https://www.pexels.com/photo/38351536/) |
| trisuli-rafting | 39606971 Group white-water rafting adventure | 36564701 Visitors at Boudhanath Stupa, Kathmandu · 19751469 Raft on a mountain river · 12328763 Rafting through white water · 2828471 Raft navigating a rapid · 16304344 Rafters paddling through rapids · 34627106 Close view of rapids on the river | [/39606971/](https://www.pexels.com/photo/39606971/) · [/36564701/](https://www.pexels.com/photo/36564701/) · [/19751469/](https://www.pexels.com/photo/19751469/) · [/12328763/](https://www.pexels.com/photo/12328763/) · [/2828471/](https://www.pexels.com/photo/2828471/) · [/16304344/](https://www.pexels.com/photo/16304344/) · [/34627106/](https://www.pexels.com/photo/34627106/) |
| nepal-mini-trek-4-day | 26926327 Nepal mountain and foothill trails | 5011391 Hikers on a snowy Himalayan trail, Nepal · 40285696 Himalayan peak above the trail · 41042401 Sunrise over the mountain range · 34729832 Mountain ridge on the Nepal trek · 14136902 Hillside village on the trek route · 41154920 Forest path in the Nepal foothills | [/26926327/](https://www.pexels.com/photo/26926327/) · [/5011391/](https://www.pexels.com/photo/5011391/) · [/40285696/](https://www.pexels.com/photo/40285696/) · [/41042401/](https://www.pexels.com/photo/41042401/) · [/34729832/](https://www.pexels.com/photo/34729832/) · [/14136902/](https://www.pexels.com/photo/14136902/) · [/41154920/](https://www.pexels.com/photo/41154920/) |
| nepal-wildlife-safari | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/nepal-wildlife-safari/`) · 19984413 Elephant in a forest clearing · 20046912 Elephant on a forest track | [/19984413/](https://www.pexels.com/photo/19984413/) · [/20046912/](https://www.pexels.com/photo/20046912/) |
| nepal-mini-trek-7-day | Client-supplied local photo (see §2b–2d) | client-supplied local photos (`images/packages/nepal-mini-trek-7-day/`) · 34744875 Sunrise on a Himalayan peak · 417173 Snow-covered mountain above the clouds | [/34744875/](https://www.pexels.com/photo/34744875/) · [/417173/](https://www.pexels.com/photo/417173/) |

`discover-ladakh`, `nepal-mini-trek-7-day`, `nepal-wildlife-safari` and the eight
packages in §2d use `galleryOverride` in `data/catalogue.ts` to replace the full
detail-page gallery with client-supplied local photography. Nepal Wildlife
Safari and the §2d packages use the first local photo as their primary image.
Discover Ladakh keeps its Pexels primary to preserve the Pangong Lake view; the
7 Day Nepal Mini Trek uses the first client-supplied photo on cards and heroes.

### Package image rules

All package imagery follows four rules, enforced by
`npm run check:images` (`app/scripts/check-package-images.mjs`):

1. No photo ID or local gallery is shared by two packages.
2. Every package has a primary image and a gallery; places named in a package's
   highlights are represented where suitable verified photography exists.
3. Every served image is landscape — Pexels URLs force a 3:2 crop via
   `w=1200&h=800&fit=crop`, and all local assets are checked for width greater than height.
4. New photography is visually reviewed (sharpness, framing, relevance) before
   it is added to the catalogue; the automated check cannot assess taste.
5. Every package carries more than six images. Packages naming fewer places use
   additional distinct photos of the same places from different angles; no photo
   ID is repeated anywhere.

### 2a. Discover Ladakh client-supplied gallery

Source folder supplied by the client: `C:\Users\pc\Downloads\gg\Discover ladakh`.
Files were copied unchanged; the descriptive captions below are visual
descriptions only, not brochure or itinerary claims.

| File | Original | Caption |
|---|---|---|
| `images/packages/discover-ladakh/discover-ladakh-01.jpg` | `26002.jpg` | High mountain valley and sandy riverbed |
| `images/packages/discover-ladakh/discover-ladakh-02.jpg` | `26003.jpg` | Mountain road through the high-altitude landscape |
| `images/packages/discover-ladakh/discover-ladakh-03.jpg` | `26004.jpg` | Rider on a rocky hillside trail |
| `images/packages/discover-ladakh/discover-ladakh-04.jpg` | `26005.jpg` | White stupas beside the mountain road |
| `images/packages/discover-ladakh/discover-ladakh-05.jpg` | `26006.jpg` | White building complex on a rocky ridge |

### 2b. 7 Day Nepal Mini Trek client-supplied gallery

Source folder supplied by the client: `C:\Users\pc\Downloads\gg\Nepal 7 days trek`.
Seven files across the client-supplied batches were centre-cropped to 3:2 landscape; captions are visual descriptions only.

| File | Original | Caption |
|---|---|---|
| `images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-01.jpg` | `25995.jpg` | Mountain peak above a hillside settlement |
| `images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-02.jpg` | `25996.jpg` | Trekker with poles facing snowy peaks |
| `images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-03.jpg` | `25997.jpg` | Hikers raising trekking poles above the ridgeline |
| `images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-04.jpg` | `25998.jpg` | Prayer flags and a monastery below snowy peaks |
| `images/packages/nepal-mini-trek-7-day/nepal-mini-trek-7-day-05.jpg` | `25999.jpg` | Sunlit summit above a sea of clouds |

### 2c. Nepal Wildlife Safari client-supplied images

Source folder supplied by the client: `C:\Users\pc\Downloads\gg\wild life nepal`.
Files were copied unchanged; captions are visual descriptions only. File 01 is
also the package's primary image (cards, hero, carousel and enquiry card).

| File | Original | Caption |
|---|---|---|
| `images/packages/nepal-wildlife-safari/nepal-wildlife-safari-01.jpg` | `25987.jpg` | Trekkers passing prayer flags on a stone trail |
| `images/packages/nepal-wildlife-safari/nepal-wildlife-safari-02.jpg` | `25988.jpg` | Town and mountain ridges seen through prayer flags |
| `images/packages/nepal-wildlife-safari/nepal-wildlife-safari-03.jpg` | `25989.jpg` | Golden shrine below snow-covered mountains |
| `images/packages/nepal-wildlife-safari/nepal-wildlife-safari-04.jpg` | `25990.jpg` | Mountain peak above a hillside settlement |
| `images/packages/nepal-wildlife-safari/nepal-wildlife-safari-05.jpg` | `25991.jpg` | Nepal flag against snowy mountain slopes |

### 2d. Additional client-supplied package image batches

Source folders supplied by the client:
`C:\Users\pc\Downloads\india nepal travel..1\Download` and
`C:\Users\pc\Downloads\indian nepal travel 2\Download` (Goa batch).
Files were copied unchanged into package-named folders and numbered in original
filename order. Photo 01 is also the package's primary image on cards, heroes,
carousels and enquiry cards. Gallery captions are neutral sequence labels, not
brochure or itinerary claims.

| Package | Source folder | Photos | Local folder |
|---|---|---:|---|
| `bombay-stopover` | `Bombay` | 12 | `images/packages/bombay-stopover/` |
| `delhi-stopover` | `Delhi` | 12 | `images/packages/delhi-stopover/` |
| `glimpses-of-kerala` | `Glimpses of Kerala` | 7 | `images/packages/glimpses-of-kerala/` |
| `glorious-goa-stopover` | `Glorious goa stopover` | 10 | `images/packages/glorious-goa-stopover/` |
| `kashmir-combinations-little-tibet` | `Kashmir combination little tibet` | 14 | `images/packages/kashmir-combinations-little-tibet/` |
| `kashmir-ski` | `Kashmir ski` | 8 | `images/packages/kashmir-ski/` |
| `south-india-highlight` | `South Indian highlights` | 28 | `images/packages/south-india-highlight/` |
| `vale-of-kashmir-trek` | `Valley of kashmir trek` | 11 | `images/packages/vale-of-kashmir-trek/` |

The complete original-to-output filename and dimension mapping is recorded in
[`app/public/images/SOURCES.md`](../app/public/images/SOURCES.md).

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
| Full-bleed hero banner | H.B. Perfume Garden houseboat on Dal Lake (user-supplied) | local | pp/public/images/services/houseboat-hero.jpg | components/houseboats/HouseboatHero.tsx |

> The Houseboats page hero (components/houseboats/HouseboatHero.tsx) is now sourced from
> a user-supplied photo: images/services/houseboat-hero.jpg (H.B. Perfume Garden
> houseboat on Dal Lake in the morning mist). The closing CTA banner remains on its
> original local asset — see §9.

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
