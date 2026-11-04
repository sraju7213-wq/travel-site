# Design-System Audit — implementation invariants

**Date:** 2026-11-04
**Scope:** public UI in `app/src` (admin dashboard excluded), `globals.css`, `app/docs/design-system.md`
**Method:** static review of tokens, typography, loading order, chrome, motion, radii, color. No browser/render testing was run; contrast values are WCAG 2 relative-luminance computations.

**Verdict:** the repo contains **two design systems** — a documented light/brass one and a shipped dark/orange one. The documentation is not describing the product, the token layer contradicts itself, and several mechanical invariants (FOUT, transition property lists, loading priority, contrast of the primary accent) are violated. Overall: **not shippable as a system**; most of it is fixable with token work, not redesign.

---

## 1. Token architecture — FAIL

The documented palette and the code palette are different products.

| | `app/docs/design-system.md` | shipped code (`globals.css`) |
|---|---|---|
| Accent | brass `#B18A51` | orange `#ff6e00` (48 occurrences) |
| Surface | ivory `#F6F2E9` | near-black `#0C1617` / `#132325` |
| Body text | charcoal `#252824` | `#F5F2EB` on dark |
| Dark mode | "`prefers-color-scheme` overrides background/foreground" | no `prefers-color-scheme` block exists |
| Fonts | Inter | Plus Jakarta Sans + Cinzel + Georgia + Geist Mono |

- `app/docs/design-system.md:6-10` explicitly says "Reference-site orange (`#ff6e00`) is intentionally not used". The code uses it as the primary brand color.
- `app/src/app/globals.css:3-15` declares a light `:root` (forest `#16271A`, brass `#B18A51`, ivory background). `app/src/app/globals.css:17-64` immediately overrides the same names in `@theme inline` (forest `#123438`, brass `#ff6e00`, charcoal `#221f20`). Two palettes, one namespace.
- No primitive layer. There are no surface, border, or text-scale tokens; components hardcode hex:

| Value | Uses (public surface) | Meaning |
|---|---|---|
| `#132325` | 30 | raised surface |
| `#0C1617` | 14 | base surface |
| `#221f20` / `#f5f2eb` | 5 / 3 | dark/light text |
| `#a58f79`, `#0d2a2d`, `#9ab3b7`, `#728d92`, `#1a1c1d`, `#101f21`, `#ffa24d`, `#e56300` | 1–3 each | one-off surfaces, body copy, hover |

  Examples: `PageShell.tsx:15`, `layout.tsx:59`, `PackageCard.tsx:14`, `ExperienceCarousel.tsx:109,117,142`, `DestinationCarousel.tsx:111`.
- No semantic group. Status colors are raw Tailwind (`emerald`, `amber`) at call sites: `EnquiryForm.tsx:376,392`, `contact/page.tsx:42-43`.
- Dead tokens: `rounded-card`, `rounded-circle` are used **0 times**; `--shadow-card`, `--shadow-subtle`, `--shadow-card-elevated` are defined at `globals.css:61-63` and used **0 times** (components use `shadow-xl`/`shadow-2xl`). The documented radius/shadow system is decorative.
- Fallback duplication: `var(--color-wild-orange,#ff6e00)` is repeated ~48 times, so changing the token does not change the fallback. Both values must be edited.

**Fix:** one palette, three layers, no hex in components.

```css
@theme {
  /* surfaces (elevation) */
  --color-surface-base:    #0C1617;
  --color-surface-raised:  #132325;
  --color-surface-sunken:  #0A1314;
  --color-surface-overlay: #101F21;
  --color-surface-sand:    #A58F79;

  /* text */
  --color-text-primary:   #F5F2EB;
  --color-text-secondary: #C9C4B8;
  --color-text-muted:     #8C877D;
  --color-text-inverse:   #221F20;

  /* borders */
  --color-border-subtle:   rgb(255 255 255 / 0.06);
  --color-border-default:  rgb(255 255 255 / 0.10);
  --color-border-emphasis: rgb(255 255 255 / 0.25);

  /* brand (one accent) */
  --color-brand:       #FF6E00;
  --color-brand-hover: #E56300;
  --color-brand-ink:   #221F20;   /* text on brand — see §7 */

  /* semantic */
  --color-success: #34D399;
  --color-warning: #FBBF24;
  --color-danger:  #FB7185;
}
```

Delete the light `:root` block or make it the actual documented theme. Do not keep both.

---

## 2. Typography — FAIL

**The display face never paints.** Cormorant Garamond is loaded (`layout.tsx:6-12`) with 5 weights × 2 styles (plain/italic = up to 10 WOFF2 files), declared as `--font-serif` (`globals.css:48`) — and then every heading is forced to Georgia:

- `globals.css:68-73` — `h1..h6 { font-family: Georgia, ... }` and `.font-serif { font-family: Georgia, ... }`.

Only Cinzel (`.font-accent`) is actually applied. So the site downloads a 10-file serif family for nothing and the "display font" is a system font. This is both a loading-order waste and an identity failure.

**Four families is too many.** Plus Jakarta Sans (5 weights), Cormorant (5×2), Cinzel (5), Geist Mono (variable). The hierarchy only needs display + body (+ mono for real data).

**FOUT is guaranteed.** All four fonts use `display: "swap"` (`layout.tsx:11,18,25,31`). Per this design system, swap *is* the pop: display text paints in Georgia/fallback, then reflows to the webfont. There is:
- no `fonts-pending` gate, no `document.fonts.ready` logic (`grep` finds no `document.fonts`),
- no `size-adjust`/`ascent-override` fallback metrics (`grep` finds none),
- no brand-mark/title visibility gate.

The nav labels, buttons and eyebrows all use `.font-accent` (Cinzel) — the most swap-visible text on the site.

**Docs vs code:** `design-system.md:33-36` says Inter via `next/font` with `--font-inter`; no Inter exists. `:39-46` lists a clamp scale that does not match `globals.css` (`text-h2` documented `1.75 → 3.5rem`, implemented `3 → 4.5rem`).

**Decorative mono:** `PillarsTabs.tsx:268,361` uses `font-mono` for "01"–"06" index microtext. That is the trend-slop pattern the system forbids — mono earns its place only for values that align in a column. (Gallery counters correctly use `tabular-nums`.)

**Fix**
1. Pick the serif: either delete Cormorant and document Georgia, or apply Cormorant to `h1–h4`/`.font-serif` and delete the Georgia override. Do not load both.
2. Drop Cormorant's italic set and 600/700 if unused; drop Geist Mono unless real tabular data ships.
3. Replace `display:"swap"` on the display/accent faces with the gate: inline `<head>` script adds `fonts-pending` (title/wordmark `opacity:0`), `document.fonts.load()` for each critical face, swap to `fonts-ready` + 500ms fade, 2.5s reveal fallback.
4. Add tuned fallback metrics for body (`size-adjust`, `ascent-override`) so any body swap shifts nothing.
5. Add `text-wrap: balance` to `.text-h1/.text-h2/.hero-title`.

---

## 3. Loading order — PARTIAL

Good: next/font self-hosts (no Google stylesheet); hero poster is `priority`; images use `fill` + `aspect` boxes; most below-fold images are lazy by default.

Problems:

- **Font preload is wasted on an unused family** (§2). Ten Cormorant files may be preloaded while the 1927 wordmark is set in Cinzel.
- **Both hero videos preload `auto`** — `HeroVideoShuffler.tsx:191,211`. Two full video streams race the LCP poster, which itself is `priority` (`:176`). Set layer B to `preload="none"` (or `metadata`) until the first crossfade.
- **`priority` is spread beyond the LCP set** (10 `priority` props, several explicitly `false`): `BrandMark.tsx:21` and the hero poster are correct; the rest are not all above the fold — `DestinationCarousel.tsx:197` sets `priority={i === active}`, so every slide becomes high-priority as it activates; `PackageGallery.tsx:59` prioritises a gallery image that sits below the package hero; `EnquiryForm.tsx:287` prioritises the summary card while the form is the primary content.
- **CLS risk from the swap** (§2): fallback Georgia vs Cinzel/Cormorant metrics differ; every uppercase label can reflow.

**Fix:** `priority` only on the first viewport's hero (one image), `fetchpriority="high"` explicit; `preload="none"` on the second video layer; remove priority from gallery/carousel non-first images.

---

## 4. Chrome stability — PASS (with one exception)

- Header is fixed with constant heights (`SiteHeader.tsx:84,89`: 72px mobile / 88px desktop); the 2px progress bar is absolutely positioned and never changes chrome height.
- No dynamic status text lives in persistent chrome; transient text (search counts, form banners) sits in the content flow where growth is acceptable.
- Exception: the header CTA shrinks to 36px on small screens (`SiteHeader.tsx:147`, `max-sm:h-[36px]`), under the 44px touch target — not a chrome-stability bug, but a control invariant.
- If status text is ever added to the header, it must get `white-space:nowrap; overflow:hidden; text-overflow:ellipsis` and a reserved height.

---

## 5. Motion — FAIL

- **71 `transition-all` instances** (64 in public components/pages, 7 in `globals.css:91,100,105,110,137,141,209`). Every one animates unbounded properties (layout, paint) and most animate nothing beyond colors/shadows.
- **No duration scale.** Utilities in use: `duration-100/150/200/300/500/700` (+ `1000` for hero fades), plus GSAP 1s/1.1s/1.2s and a 95s marquee. The system's own guidance is ~150ms micro, 200–250ms larger, ease-out — the code has six competing numbers and no token.
- **Layout-property animation:** `ScrollProgressBar.tsx:39` animates `width`; `MobileNav.tsx:283` and `SiteFooter.tsx:56` animate `max-height`. Use `transform: scaleX()` and a grid-template-rows/fixed-height technique respectively.
- **Reduced motion is mostly honored** (`globals.css:229-236`; GSAP guards in `HomeHero:53`, `ScrollReveal:78`, `CtaZoom:26`, `ImpactSection:25`, `JourneysBand:21`) — except the autoplaying hero video (§3) and `scrollIntoView({behavior:"smooth"})` calls (`HomeHero.tsx:46`, `InteractiveItinerary.tsx:77`, `PillarsTabs.tsx:138`).
- **Docs contradiction:** `design-system.md:89-93` says "No scroll-jacking, no parallax"; the implementation runs GSAP scrub parallax in `HomeHero.tsx:84-95`, `CtaZoom.tsx:31-65`, `ImpactSection.tsx:30-62`, `JourneysBand.tsx:26-41`.

**Fix:** add `--duration-fast:150ms`, `--duration-base:200ms`, `--duration-slow:300ms`, `--ease-out`, replace every `transition-all` with explicit lists (`transition-[transform,opacity]`, `transition-colors`, `transition-shadow`), and gate smooth scroll on reduced-motion.

---

## 6. Radii & nesting — PARTIAL

- No child-larger-than-parent violation found in the public surface; the common card pattern (`rounded-[1.25rem]` + 24px padding + `rounded-button` child) is fine.
- The scale itself is ad hoc and bypasses the tokens: `rounded-card` used 0 times; 40 arbitrary radii — `rounded-[1.25rem]` ×19, `rounded-[1rem]` ×10, `rounded-[0.875rem]` ×4, `rounded-[0.75rem]` ×3, `rounded-[1.5rem]` ×3, `rounded-[1.15rem]` ×1 — alongside `rounded-xl/2xl/lg` utilities.
- Documented "card 12px" (`design-system.md:52`) vs implemented 20px (1.25rem).

**Fix:** define 3 radii — control 10px, card 20px, sheet 24px, media 12px — and replace arbitrary values; use concentric math (`child = parent − gap`) where a rounded child sits inside a padded parent.

---

## 7. Color & contrast — FAIL

- **Primary CTA text fails WCAG.** White on brand orange `#ff6e00` is **≈2.8:1** (needs 4.5:1; 3:1 even for large text). It ships on `.btn-primary` (`globals.css:91`), the selected category chips (`SearchAndFilters.tsx:192,208`), the active pillar tab (`PillarsTabs.tsx:263`), the destination CTA (`DestinationCarousel.tsx:283`) and the header hover state text switch. Charcoal `#221F20` on the same orange is **≈5.8:1** — use `--color-brand-ink` or darken the accent.
- **Light-theme remnants make text invisible.** `text-charcoal`/`text-charcoal-soft` on the dark shell: `EnquiryForm.tsx:268,271`, `SearchAndFilters.tsx:316,333`, `PackageGallery.tsx:39`, `packages/[slug]/page.tsx:70,89`, `houseboats/page.tsx:36`, `not-found.tsx:18,19`. Root cause is §1 (two palettes).
- **No semantic tokens** for success/warning/error; status color is inline Tailwind.
- Interactive states mostly gain contrast (hover lightens text or fills background) — good; but the header's hover-to-forest-on-orange and the primary-button hover keep the same failing white-on-orange pair.
- APCA note: for decisions, run these pairs through APCA (white-on-orange will read worse than 2.8:1 suggests); keep WCAG 4.5/3:1 as the gate.

---

## 8. Documentation drift (summary)

`app/docs/design-system.md` describes a product that does not exist:

| Doc claim | Reality |
|---|---|
| Brass accent, orange "not used" (`:6-10`) | orange `#ff6e00` is the primary accent (48×) |
| Inter loaded as `--font-inter` (`:36`) | Plus Jakarta Sans; no Inter |
| Type-scale clamps (`:39-46`) | different clamps in `globals.css:161-207` |
| Card radius 12px (`:52`) | 20px (`rounded-[1.25rem]`) |
| Shadows `shadow-card` (`:60-61`) | defined, never used |
| Dark mode via `prefers-color-scheme` (`:30`) | no dark-mode block, no `color-scheme` |
| "No parallax" (`:93`) | GSAP scrub parallax in 4 components |
| Mobile nav ivory/forest (`:84-87`) | black/white drawer |
| Components `FilterPanel`, `SearchInput`, `ItineraryTimeline`, `HeroSection`, `CategoryTile`, `HouseboatFeature` (`:112-125`) | none of those names exist; actual: `SearchAndFilters`, `HomeHero`, `InteractiveItinerary`, etc. |

Docs should either be rewritten to describe the shipped dark/orange system or the code should be migrated back to the documented brass/ivory one. Shipping both is the core defect.

---

## 9. Remediation order

**P0 — identity and correctness (half a day)**
1. Decide the direction (dark/orange vs light/brass) and rewrite `design-system.md` to match.
2. Resolve the Cormorant/Georgia contradiction: apply or remove the font.
3. Add the font gate for display/accent text (no swap-pop on titles/wordmark/buttons).
4. Add `--color-brand-ink` and fix white-on-orange buttons/chips (≈5.8:1 with `#221F20`).
5. Remove `priority` from gallery/carousel non-hero images; set second hero video `preload="none"`.

**P1 — tokens (1–2 days)**
6. Collapse `:root` + `@theme` into one palette; add surface/border/text/semantic tokens from §1.
7. Replace the top repeated hexes (`#132325` ×30, `#0C1617` ×14, `#a58f79`, `#0d2a2d`, `#9ab3b7`, `#728d92`); delete `var(--x,#hex)` fallbacks.
8. Delete or adopt dead tokens (`rounded-card`, `rounded-circle`, `shadow-card*`).

**P2 — mechanics (1–2 days)**
9. Replace 71 `transition-all` with explicit property lists; introduce duration tokens and normalize to 150/200/300ms.
10. Replace width/max-height animations with transform/grid techniques.
11. Consolidate radii to four tokens; replace arbitrary values; add `text-wrap: balance` to headings.

**P3 — cleanup**
12. Remove decorative mono from `PillarsTabs`; drop unused font weights; re-run the loading-order checklist against real network traces.

---

## Passes

- Fonts self-hosted (no Google stylesheet round-trip) — only the face choice/gating is wrong.
- Reduced-motion honored in all GSAP components and globally in CSS (video and smooth-scroll exceptions noted).
- Chrome (header) holds constant height; no status text in chrome.
- Gallery counters use `tabular-nums`; numerals are spelled as numerals in copy.
- No nested-radius inversions found; concentric card pattern is sound where it is used.
- `poweredByHeader` off; images served through `next/image` AVIF/WebP with `sizes`.

---

*Static audit only. Contrast ratios are WCAG 2.1 relative-luminance calculations; APCA values should be confirmed in-browser before final color decisions. No render or network-performance trace was captured (no dev server was started).*
