# Design System — India Nepal Travel Organisation

## Brand direction
Premium, editorial travel. Destination-led, calm outdoors palette, strong readable headings, generous whitespace, clean cards, subtle motion. Not a generic booking marketplace or brochure-converted layout.

## Color tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--color-forest` | `#16271A` | Primary — navigation, primary buttons, headings accents |
| `--color-forest-soft` | `#1F3A2E` | Secondary forest surfaces |
| `--color-ivory` | `#F6F2E9` | Main page background |
| `--color-ivory-soft` | `#FAF7EF` | Card backgrounds, section alternation |
| `--color-charcoal` | `#252824` | Body text, primary headings |
| `--color-charcoal-soft` | `#4A4E48` | Secondary text, captions |
| `--color-brass` | `#B18A51` | Accent — sparing details, active states, small badges |
| `--color-brass-soft` | `#D9C7A8` | Accent backgrounds, subtle borders |
| `--color-border` | `#E2DDCE` | Hairlines, dividers |
| `--color-focus` | `#B18A51` | Keyboard focus ring |

All colors are exposed as Tailwind v4 CSS variables in `src/app/globals.css` and consumed via `theme()` / arbitrary values (`bg-forest`, `text-forest`, etc.).

## Typography
- Headings: Inter (sans-serif), strong display style, sentence case, tracking-tight.
- Body: Inter, comfortable leading (1.6), charcoal.
- Small/captions: Inter, tracking-wide uppercase where appropriate.

Font scale (rem):
- Display: 3rem / 3.25 (hero)
- H1: 2.25rem / 2.75
- H2: 1.875rem / 2.25
- H3: 1.5rem / 2
- Body: 1rem / 1.6
- Small: 0.875rem / 1.4
- Caption: 0.75rem / 1.25

Inter is loaded via `next/font/google` with variable `--font-inter`.

## Spacing scale
4px base unit: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

## Radii
- Card: 12px (`rounded-xl`)
- Button: 10px (`rounded-lg`)
- Pill/badge: 9999px (`rounded-full`)
- Image: 8px (`rounded-lg`)

## Shadows
- Card hover: `0 10px 25px -5px rgba(22, 39, 26, 0.08)`
- Subtle: `0 4px 6px -1px rgba(0,0,0,0.04)`

## Grid
- 12-column responsive grid.
- Container max-width: 1200px (`max-w-7xl`), gutters 24px mobile, 32px tablet, 48px desktop.

## Image aspect ratios
- Hero: 16:9 (cover)
- Package card: 4:3 (cover)
- Destination gallery: 3:2 (cover)
- Small thumbnail: 1:1 (cover)

## Component variants
- Button: `primary` (forest fill, white text), `secondary` (transparent, forest border, forest text), `outline` (border, charcoal text).
- Card: `package` (image top, ivory surface, forest title, brass accent), `service` (full-bleed image, overlay text).
- Badge: `difficulty` (only where verified), `category` (small, brass outline), `duration` (charcoal text).

## States
- Hover: slight lift + brass tint on cards; buttons shift to forest-soft.
- Focus: visible 2px brass ring (`ring-2 ring-brass`), offset 2px.
- Active: 95% scale.
- Disabled: opacity 50%, no pointer events.

## Mobile navigation
- Hamburger toggle opens a full-height drawer from the right.
- Links full-width, 48px touch targets.
- Background ivory, forest text, brass active indicator.

## Motion rules
- Respect `prefers-reduced-motion`: disable entrance/hop motion.
- Subtle hover transitions (150–200ms ease-out).
- Entrance fade-up on package cards (staggered, 60–100ms).
- No scroll-jacking, no parallax, no layout-shift animation.

## Accessibility
- Contrast: charcoal on ivory ≥ 7:1; white on forest ≥ 7:1.
- Focus visible on all interactive elements.
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Form labels visible; errors announced via `aria-describedby`.
- Alt text on all images; decorative images empty `alt`.

## Page hierarchy
1. Home (`/`)
2. Explore Tours / Catalogue (`/explore`)
3. Category page (`/explore/[category]`)
4. Package detail (`/packages/[slug]`)
5. Kashmir Houseboats (`/houseboats`)
6. Tailor-made / Enquiry (`/enquiry`)
7. About (`/about`)
8. Contact (`/contact`)

## Reusable components
- `SiteHeader` — logo, nav, mobile toggle, enquiry CTA
- `MobileNav` — drawer menu
- `PackageCard` — image, title, region, duration, verified difficulty badge, summary, "View itinerary"
- `PackageGrid` — responsive card grid
- `FilterPanel` — category, region, duration, activity, difficulty (verified only)
- `SearchInput` — package name/code search
- `ItineraryTimeline` — day-by-day vertical timeline
- `InclusionsExclusions` — two-column lists
- `EnquiryForm` — contact fields, package prefill, validation, success/error
- `HeroSection` — editorial hero, headline, primary action
- `CategoryTile` — category shortcut with image
- `HouseboatFeature` — houseboat service entry
- `SiteFooter` — links, enquiry CTA, legal
