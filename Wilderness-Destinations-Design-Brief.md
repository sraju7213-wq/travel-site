# Wilderness Destinations — Design Brief

**Source:** https://www.wildernessdestinations.com/ (homepage, fetched 2026-10-27)
**Tech:** Nuxt 3 (SSR), Tailwind CSS, Nuxt Image, Vue 3. Brand identity: "Wilderness" — luxury safari / conservation travel, est. 1983, 55+ camps across 8 African countries.

---

## 1. Brand Colors (exact, observed)

| Role | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Primary brand orange** | `#ff6e00` | 255, 110, 0 | Primary buttons, carousel nav icons, pagination dots, Trustpilot link, "Enquire now" hover |
| Primary hover (dark) | `#e56300` | 229, 99, 0 | Primary button `:focus` |
| Secondary brand orange | `#c64b00` | 198, 75, 0 | Enquiry button variant (wildernesstrust), footer links, `.embeded-html p a` |
| Navigation background | `#000` | 0, 0, 0 | Header / mobile overlay |
| Nav semi-transparent | `rgba(0,0,0,0.4)` | — | Scrolled/blurred nav-inner (backdrop-blur) |
| Dark section background | `#123438` | 18, 52, 56 | "Discover" (WE ARE WILDERNESS), "Impact" sections |
| Darker section background | `#221f20` | 34, 31, 32 | "Experiences", "Why travel with Wilderness" tabs |
| Card image overlay | `bg-black/20` | — | Country card image tint |
| Body text (light bg) | `white` / `white/75` | — | White at 75% opacity for body copy |
| Muted body text | `#817162` | 129, 113, 98 | `darkSand` — secondary labels, locations |
| Light cream background | `#eeebe5` | 238, 235, 229 | Newsletter section, open mobile nav |
| White panel | `#ffffff` | 255, 255, 255 | Awards section, testimonial cards |
| Testimonial name/stars | `#123438` | 18, 52, 56 | Testimonial author name and star rating |
| Border/divider | `white/10`, `white/25`, `black/10` | — | Nav links, tab separators, category borders |
| Accent border (large-circle) | `#b6a28f` | 182, 162, 143 | Large circle button border / stroke |

**Color CSS variables used inline:** `--experience-bg-color` maps to section bg (`#221f20`).

---

## 2. Typography

**Font families (self-hosted, `/fonts/`):**

| Family | Weights | CSS name | Use |
|--------|---------|----------|-----|
| **Athelas** | 400 (Regular) | `Athelas, Georgia, "Times New Roman", Baskerville, ui-serif, system-ui, -apple-system` | Serif headings (hero, h1–h6, quotes) |
| **Atyp Display Light** | 300/400 | `Atyp Display Light` | Body copy (`text-default`, `text-large`) |
| **Atyp Display Regular** | 400 | `Atyp Display Regular` | Small labels, testimonial authors |
| **Atyp Display Medium** | 500 | `Atyp Display Medium` | Subtitles, buttons (`btn`), small uppercase nav |

**Font scale (from CSS, responsive):**

| Class | Mobile | sm (640px) | lg (1024px) | xl (1441px) | Line-height | Letter-spacing |
|-------|--------|------------|-------------|-------------|-------------|----------------|
| `hero-title` (h1) | 32px | 56px | 72px | 96px | 35 / 65 / 104 | 0.4em |
| `text-h1` | 56px | 88px | — | — | 64 / 96 | — |
| `text-h2` | 48px | 56px | — | — | 56 / 64 | — |
| `text-h3` | 40px | 48px | — | — | 48 / 56 | — |
| `text-h4` | 32px | 40px | — | — | 40 / 48 | — |
| `text-h5/h6` | 24px | — | — | — | 32 | — |
| `subtitle-large` | 14px | — | — | — | 20px | 0.4em (uppercase) |
| `text-default` | 16px | — | — | — | 24px | 0.025em |
| `text-small` | 14px | — | — | — | 24px | — |
| `text-tiny` | 12px | — | — | — | 20px | — |
| `text-large` | 20px | — | — | — | 24px | — |
| Nav menu items | text-xs (~12px), leading 18px, tracking 2.4px, uppercase | | | | | |

**Headings are serif (Athelas); body/buttons/subtitles are sans-serif (Atyp Display).** All caps used for subtitles, nav, buttons.

---

## 3. Layout Structure

**Global container:** `.container` with max-width, `px-6` base, `sm:px-[124px]` on wide sections; `md:max-w-full` on hero content. Breakpoints: sm 640px, md 768px (used as `md2:`), lg 1024px, xl 1441px.

**Page shell:** `<div id="scroll-area" class="md:w-screen md:h-screen ...">` — full-screen scroll area on desktop; `<main class="main-container">`.

### Header / Navigation
- **Desktop nav** (`hidden md:block`): `nav-inner` with `backdrop-filter: blur(4px)`, `bg-black/40` → solid `#000` on scroll/hover (`.backgroundOnScroll`). 3-column grid: `justify-self-start` hamburger "Menu" button | centered logo (208×44 SVG) | right: search icon + **"Enquire Now"** primary button.
- **Logo:** `/media/egnh4b1a/logo.svg`, `!fill-white`.
- **Mobile nav** (`fixed block md:hidden`, `h-[92px]`): hamburger top-left; clicking opens a full-height right-side modal panel (`fixed modal right-0 top-0 h-screen bg-darkBrown w-0 → width animates`) with accordion category sections (Destinations, Camps, Regions, Experiences, Journeys, Exclusive offers, Impact, Journal, About Wilderness) + country sub-links + secondary links (About, Impact, Awards, Press Room, Contact, Careers, etc.).
- **Desktop mega menu:** clicking "Menu" opens an absolute black overlay panel (`bg-black`, `z-[20]`) with grid columns: main nav items (each `w-[288px]`, `text-darkSand`, `border-b border-white/10`, tracking `2.4px`, uppercase) plus country sub-columns with images + `bg-darkGreen` tertiary buttons.

### Sections (in DOM order)
1. **LargeHeroCenterText** — full-screen hero (`h-screen`, `bg-greyBlue`, `bg-gradient-to-t from-black to-transparent`, `overflow-hidden`).
2. **Discover** (`TextWithPortraitImageModule`) — `background-color:#123438`, text-white, left text / right image (flex-col md:flex-row).
3. **Our Luxury Safari Destinations** — centered heading + intro + country button tabs, then a horizontal card carousel (`flicking-camera`, `card-panel`) with image + overlay name + tertiary button.
4. **Journeys** (`FullBleedMediaModule`) — full-bleed media, "Tailor-made itineraries for every traveller".
5. **Experiences** (`ExperiencesCarouselModule`) — `background-color:#221f20`, carousel of circular experience cards, `01 / 07` pagination, prev/next image-carousel buttons.
6. **Why travel with Wilderness?** (`TabsModule`) — `background-color:#221f20`, tab pills: Wildlife / Guides / architecture / Culture / TRAVEL / impact; tab panels swap `ImageVideoInfoBlockModule` content (absolute, opacity-transitioned).
7. **Awards** (`CardListingCarouselModule`) — `background-color:#ffffff`, text-black, carousel of award cards (`w-1/4`, image `h-[184px]`, title, short text), `09` count, prev/next.
8. **Impact** (`TextPlusTwoImageModule`) — `background-color:#123438`, two images + text block.
9. **Guest Experiences / Testimonials** — Trustpilot logo + 4.8-star / 134 reviews, `grid grid-cols-1 md:grid-cols-3 gap-6`, testimonial cards (`bg-white rounded-[1rem] p-6`), star rating ★★★★★ in `#123438`.
10. **CTA Zoom** (`CtaZoomModule`) — full-height image background ("lion-footer.webp"), radial-gradient outlined logo watermark, "Ready?" heading, "Enquire now" primary button.
11. **Newsletter** — `background-color:#eeebe5` inner (`#ffffff` section), 3-col grid: heading, form (first name, surname, email, country select), submit button.
12. **Footer** — dark background, 4 accordion columns (About / Destinations / Journeys & Experiences / Services), social icons (Instagram, Facebook, TikTok, YouTube, X), copyright "©2026 Wilderness. All rights reserved."

### Cards & grids
- **Country cards:** `card-panel` `w-full h-full max-w-[1000px]`; image `card-image` with `bg-black/20` overlay; `country-name` absolute centered `text-white uppercase hero-title`; tertiary dark button below.
- **Experience cards:** `experience-panel w-[315px] sm:w-[304px]`; `circle-container w-[245px] h-[245px]` rounded-full with `shadow-[0_0_0_10px_var(--experienceBgColor)]`; h4 title, description `text-white/75`, tertiary dark link, location pill with map-pin icon.
- **Award cards:** `w-1/4`, `img-container h-[184px] sm:h-[196px] md:h-[162px]`, title h6, short text `text-small opacity-50`.
- **Testimonial cards:** `bg-white rounded-[1rem] p-6 md:p-10`, h6 title, quote `text-small opacity-75`, author `text-tiny font-atypDisplayRegular text-[#123438] tracking-widest`, stars `text-[#123438]`.
- **Stat callouts (Discover section):** 4 items (Camps, Countries, Private, Bespoke, Community) — 60×60px icon + h5 + `text-sm font-atypDisplayRegular text-white/75`, `sm:min-w-[33.33%] md:min-w-[20%]`.

---

## 4. Navigation Style & Mobile Behavior

- Desktop: fixed top bar, black semi-transparent with backdrop blur; solidifies to `#000` on scroll. Logo centered, "Menu" hamburger left, search + CTA right. Mega menu opens as full black overlay with 3-column grid of categories; countries shown with thumbnail images + dark green buttons.
- Mobile: fixed short bar (`h-[92px]`), hamburger triggers a right-slide full-height dark brown modal panel with accordion categories (chevron toggle, `max-h-0 → sm:!max-h-max`), country list, then secondary footer-like links. Search input inside mobile panel.
- All nav text: `font-atypDisplay`, `text-xs`, `uppercase`, `tracking-[2.4px]`, `text-darkSand` → `text-white` on hover/active.
- Active state indicators: `text-white/75`, orange underline accents, `large-circle` buttons (62×62px) for accordion chevrons.

---

## 5. Hero Composition

- **Media:** full-screen background image `hero-image-lion.jpg` (responsive WebP, breakpoints 764/1440/1024/1536/∞ px; `object-cover`), radial-gradient black vignette overlay (`hero-gradiated`), gradient `bg-gradient-to-t from-black to-transparent` over `bg-greyBlue`.
- **Text block:** centered (`items-center justify-center`), `z-20`:
  - Subtitle: "Welcome to" — `subtitle-large text-stoneGrey text-center`
  - H1: "Wilderness" — `hero-title text-white uppercase text-center`, style color white
  - Description: `text-white text-center text-small m-auto sm:hidden w-[287px]` — "Since 1983, Wilderness has existed for one reason…"
  - Coordinates: `19.2228° S, 22.7779° E` (small, top area)
- **CTA:** circular play button `w-[106px] h-[106px] akarmi rounded-full border-2 border-white/50` (video trigger). No primary CTA button directly in hero; CTAs appear in sections below ("Plan your safari" primary, "Explore our safari journeys" tertiary dark).

---

## 6. Distinctive Components

| Component | Key classes / traits |
|-----------|---------------------|
| **Primary button** | `.btn.primary` — `bg-[#ff6e00]`, white text, hover opacity 0.8; `padding:1rem`, uppercase, 0.875rem, letter-spacing 0.2em |
| **Dark primary** | `.btn.primary.dark` — white text; hover swaps to white bg / `#ff6e00` text |
| **Tertiary (ghost) dark** | `.btn.tertiarys.dark` — transparent, white text, hover `text-vibrantOrange` (`#ff6e00`) |
| **Secondary** | `.btn.secondary` — white bg, `#ff6e00` 1px border, hover `#ff6e00` text |
| **Pagination dots** | `.btn.pagination` — 48×48 circular, `#cecece` border, `#ff6e00` fill on active |
| **Large circle** | `.btn.large-circle` — 90×90, `#b6a28f` border, hover fills `#ff6e00` |
| **Links** | `.embeded-html p a` — `#c64b00`, underline; Trustpilot link `text-[#FF6E00] underline` |
| **Image treatment** | `vue-responsive-image` (object-fit cover), `data-srcset` lazy loading, WebP with fallbacks |
| **Video hero** | Akarmi circular play button overlay (106×106) |
| **Testimonials** | Trustpilot widget branding, 4.8★ / 134 reviews, 3-col grid on desktop |
| **Newsletter form** | 3-col grid, outlined inputs (`border-black/25` → `focus:border-black/75`), country dropdown with flag sprite, submit as tertiary icon button |
| **Footer** | Accordion columns on mobile, chevron `large-circle` buttons, social icon row (rounded, `bg-white/50`), copyright |

---

## 7. Notable Images (media CDN: `/media/<hash>/<name>?rmode=crop&...`)

- Hero: `hero-image-lion.jpg` (Vumbura Plains, Botswana lions)
- Discover: `wilderness-home-wildlife-cheetah-intro.jpg`
- Footer CTA: `lion-footer.webp`
- Country cards: leopard Chitabe (Botswana), Busanga Plains (Zambia), Magashi Peninsula (Rwanda), Serra Cafema dunes (Namibia), Zimbabwe hero, Mara giraffes (Kenya), Cape Town hike (South Africa), Tanzania hero
- Experience circles: mokoro, hot-air balloon, star beds, walking safari, hides, rhino tracking
- Awards: CNT, Men's Journal, World Travel Awards, Elite Traveler, T+L, Town & Country, Wanderlust logos

---

## 8. Recommendations for Restyling the Local Site

1. Adopt the exact color tokens above as CSS custom properties (`--wild-orange: #ff6e00`, `--wild-dark: #123438`, `--wild-darker: #221f20`, `--wild-black: #000`, `--wild-sand: #817162`, `--wild-cream: #eeebe5`).
2. Stack: serif display (Athelas/Georgia) for headings; sans-serif Atyp Display for UI/buttons/body.
3. Reproduce the 6-section rhythm: hero → portrait/text → country carousel → full-bleed journeys → circular experience carousel → tabbed pillars → awards → impact → testimonials → CTA zoom → newsletter → footer.
4. Mobile: fixed short header + right-slide dark overlay nav with accordion categories; desktop: fixed blur header with inline 3-col mega menu.
5. Buttons: primary orange `#ff6e00`, tertiary ghost with orange hover, large circular navigation accents.
