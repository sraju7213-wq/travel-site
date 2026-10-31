# Design System — India Nepal Travel Organisation

## Brand direction
Premium, editorial travel. Destination-led, calm outdoors palette, strong readable serif headings, generous whitespace, clean cards, subtle motion. Not a generic booking marketplace or brochure-converted layout.

## Brand accent (design recommendation — not brand-approved)
- Core: deep forest `#16271A`, charcoal `#252824`, ivory `#F6F2E9`.
- Accent: restrained brass `#B18A51` (hover `#9A7342`) for sparing details, active states, small badges and focus rings.
- Reference-site orange (`#ff6e00`) is intentionally not used; the India Nepal Travel accent stays brass/earth.
- **Brand approval pending:** this palette is documented as a design recommendation only. Do not claim it is approved brand until the organisation confirms.

## Color tokens
| Token | CSS var | Value | Usage |
|-------|---------|-------|-------|
| `background` | `--color-background` | `#F6F2E9` | Page background (flips in dark mode) |
| `foreground` | `--color-foreground` | `#252824` | Default text (flips in dark mode) |
| `forest` | `--color-forest` | `#16271A` | Primary — navigation, primary buttons, heading accents |
| `forest-soft` | `--color-forest-soft` | `#1F3A2E` | Secondary forest surfaces |
| `ivory` | `--color-ivory` | `#F6F2E9` | Main page background |
| `ivory-soft` | `--color-ivory-soft` | `#FAF7EF` | Card backgrounds, section alternation |
| `charcoal` | `--color-charcoal` | `#252824` | Body text, primary headings |
| `charcoal-soft` | `--color-charcoal-soft` | `#4A4E48` | Secondary text, captions |
| `brass` | `--color-brass` | `#B18A51` | Accent — sparing details, active states, small badges |
| `brass-soft` | `--color-brass-soft` | `#D9C7A8` | Accent backgrounds, subtle borders |
| `brass-hover` | `--color-brass-hover` | `#9A7342` | Brass hover state |
| `border` | `--color-border` | `#E2DDCE` | Hairlines, dividers |
| `focus` | `--color-focus` | `#B18A51` | Keyboard focus ring |
| `white` | `--color-white` | `#ffffff` | White surfaces/text |

All colors are exposed as Tailwind v4 CSS variables in `src/app/globals.css` and consumed via utilities (`bg-forest`, `text-forest`, etc.). Dark mode (`prefers-color-scheme: dark`) overrides only `background`/`foreground`.

## Typography
- Headings: serif display (Georgia / Times New Roman stack), uppercase or wide-tracked where used by the editorial layout.
- Body and UI: Inter (`--font-display`), comfortable leading (1.6), charcoal.
- Small/captions: Inter, tracking-wide uppercase where appropriate.
- Inter is loaded via `next/font/google` with variable `--font-inter`; Geist Mono via `--font-geist-mono`.

Type scale (clamp-based classes defined in `globals.css`):
- `.hero-title`: serif, clamp(2rem, 1.2rem + 5.2vw, 6rem), uppercase, letter-spacing 0.22em (0.1em on mobile).
- `.text-h2`: serif, clamp(1.75rem, 1.1rem + 3.2vw, 3.5rem).
- `.text-h3`: serif, clamp(1.5rem, 1.1rem + 2.1vw, 3rem).
- `.text-h4`: serif, clamp(1.25rem, 1rem + 1.4vw, 2.5rem).
- `.subtitle-large`: sans, 0.875rem, tracked uppercase (0.4em).
- `.text-default`: sans, 1rem, leading 1.5rem.
- `.text-tiny`: sans, 0.75rem, leading 1.25rem.
- No `.text-h1` exists; `.hero-title` covers display. `font-serif`/`font-display` utilities available.

## Spacing scale
4px base unit: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 (Tailwind defaults).

## Radii
- Card: 12px (`rounded-card`).
- Button: 10px (`rounded-button`).
- Pill/badge: 9999px (`rounded-pill`).
- Circle: 9999px (`rounded-circle`).
- Image: 8px (`rounded-image`).
- Components may use `rounded-card` for cards; image radius canonical is `rounded-image`.

## Shadows
- Card hover: `0 10px 25px -5px rgba(22, 39, 26, 0.08)` (`shadow-card`).
- Subtle: `0 4px 6px -1px rgba(0,0,0,0.04)` (`shadow-subtle`).

## Grid
- 12-column responsive grid.
- Container max-width: 1280px (`max-w-7xl`), gutters 16px mobile, 32px tablet, 48px desktop.

## Image aspect ratios
- Hero: 16:9 (cover)
- Package card: 4:3 (cover)
- Destination gallery: 3:2 (cover)
- Small thumbnail: 1:1 (cover)

## Component variants
- Button: `primary` (brass fill, white text), `primary-dark` (forest fill), `ghost-dark` (ghost on dark), `tertiary` (brass outline).
- Card: `package` (image top, ivory surface, forest title, brass accent), `service` (full-bleed image, overlay text).
- Badge: `difficulty` (only where verified), `category` (small, brass outline), `duration` (charcoal text).

## States
- Hover: slight lift + brass tint on cards; buttons shift to forest-soft/brass-hover.
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
