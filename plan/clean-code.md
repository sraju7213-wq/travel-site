# Clean Code Plan — India Nepal Travel Organisation (KS World Adventure)

Scope: `app/` (Next.js 16 App Router, React 19, TS strict, Tailwind v4).
Goal: make the codebase read like a top-down narrative, lint/typecheck clean,
testable, and free of the smells currently flagged by ESLint/React rules.
Companion to `plan/modernization.md` (product/content) and `docs/baseline-audit.md`.

## 0. Baseline (measured)

- `npm run typecheck` (`tsc --noEmit`): **passes**.
- `npm run lint`: **22 problems — 10 errors, 12 warnings** (see §1).
- Tests: **none** (`src/` has no `*.test.*` / `*.spec.*`).
- Largest source files:
  - `src/app/admin/page.tsx` — 2132 lines
  - `src/components/EnquiryForm.tsx` — 746
  - `src/components/ExpeditionGlobe3D.tsx` — 623
  - `src/components/MegaMenu.tsx` — 616
  - `src/app/about/page.tsx` — 551
  - `src/components/SearchAndFilters.tsx` — 464
  - `src/components/MobileNav.tsx` — 402
- Inline SVGs duplicated across components; hex colors hardcoded (`#0C1617`,
  `#132325`, `#1a2a2c`, `#F6F2E9`, `#16271A`); magic pixel values.
- React anti-pattern: `setState` called synchronously inside `useEffect` in
  5 components (cascading renders).
- Unused state/props/imports in 7 components.
- `<img>` instead of `next/image` in 2 components.
- Unescaped `"` entities in MegaMenu.

## 1. Lint debt (must be zero before any merge)

Errors (10):
1. `ExpeditionGlobe3D.tsx:190` — `setSelectedHub` in effect (derive from
   `activeHubId` via state initializer or memo instead).
2. `ExpeditionGlobe3D.tsx:226` — `setFpsBudgetOk(false)` in effect (move FPS
   probe into a lazy initializer / event handler).
3. `HeroVideoShuffler.tsx:43` — 4× `setState` in effect (initialize playlist
   in `useState(() => generateShuffledPlaylist())`).
4. `MegaMenu.tsx:74` — `setIsOpen(true)` in effect (derive open state from
   prop; drop the mirror state).
5. `MobileNav.tsx:110` — `setMounted/setRecentSlugs/setPins` in effect (use
   `useSyncExternalStore` or lazy initializers).
6. `MobileNav.tsx:117` — `setIsOpen(true)` in effect (same as MegaMenu).
7. `MegaMenu.tsx:356,405` — 4× unescaped `"` (use `&quot;` or curly quotes).

Warnings (12):
8. `Expedition3DSection.tsx:7` — unused `WaypointHub`.
9. `ExpeditionGlobe3D.tsx:182-184` — unused `isInteractive/setIsInteractive`,
   `isDragging`, `fpsBudgetOk`.
10. `MobileNav.tsx:6,7` — unused `NAV_CATEGORIES`, `isPinned`.
11. `MobileNav.tsx:181` — unused `handlePinToggle`.
12. `PackageCard.tsx:13` — unused `isHovered`.
13. `SearchAndFilters.tsx:452` — unused `onChange`.
14. `MegaMenu.tsx:478`, `MobileNav.tsx:237` — `<img>` → `<Image />`.

Acceptance: `npm run lint` prints 0 problems; `npm run typecheck` passes.

## 2. Principles applied (Uncle Bob / clean-code skill)

- **Small functions** (< ~20 lines), **do one thing**, one level of abstraction.
- **Meaningful names**; no `d`, `tmp`, `data` without context.
- **No side effects**; functions return values instead of mutating globals.
- **No comments for bad code** — rewrite; keep only legal/informative/TODO.
- **Formatting**: newspaper metaphor (high-level first), vertical density.
- **Law of Demeter**: no `a.getB().getC().do()` chains.
- **No null returns** where avoidable; explicit `null` only at boundaries.
- **SRP classes/components**: one responsibility per module.
- **F.I.R.S.T. tests** once a test runner is added.

## 3. Work packets (ordered, each independently reviewable)

### P0 — Make CI green (no behavior change)
- Fix all 10 lint errors by removing synchronous setState-in-effect (use lazy
  `useState` initializers or derived state). Do not change rendered output.
- Remove unused vars/imports (or wire them up if they were intended to be used;
  decide per site, don't blanket-delete).
- Replace `<img>` with `next/image` in MegaMenu/MobileNav, or justify with an
  eslint-disable + comment if the image is truly dynamic.
- Escape entities in MegaMenu.
Acceptance: lint 0, typecheck 0, build passes, manual smoke of nav/mega-menu/
mobile-nav/globe/hero-shuffler.

### P1 — De-duplicate inline SVGs
- Create `src/components/icons/` (or `src/lib/icons.tsx`) exporting named
  icon components (`IconPin`, `IconClock`, `IconMapPin`, …) with `size`,
  `className`, `aria-hidden` props.
- Replace inline `<svg>` blocks in PackageCard, MegaMenu, MobileNav, and
  SiteHeader/Footer with these.
- Delete now-unused SVG markup.
Acceptance: no duplicated `<svg viewBox="0 0 24 24"` blocks; bundle size
unchanged or smaller.

### P2 — Extract magic values into tokens/constants
- Move repeated hex colors (`#0C1617`, `#132325`, `#1a2a2c`, `#F6F2E9`,
  `#16271A`, brass) into Tailwind v4 theme tokens in `globals.css` /
  `tailwind.config` (already partially there: `brass`). Add `surface`,
  `surface-deep`, `ivory`, `forest`.
- Move magic pixel values (radii `1rem`, `0.5rem`, durations `300ms`/`500ms`/
  `700ms`) into named classes or CSS variables.
- Replace hardcoded `pkg.duration.split(" ")[0]` parsing with a typed
  `durationNights` field on `PackageViewModel` (see §4).
Acceptance: grep for raw hex in components returns only `globals.css`.

### P3 — Break up god files
- `admin/page.tsx` (2132): split into `AdminShell`, `AdminTable`,
  `AdminFilters`, `AdminForm`, `admin/lib/*` helpers. Target < 300 lines each.
- `EnquiryForm.tsx` (746): split validation (`enquiryValidation.ts` already
  exists), submission (`useEnquirySubmit` hook), and presentational sections.
- `ExpeditionGlobe3D.tsx` (623): extract `useGlobeScene`, `HubMarkers`,
  `FpsProbe` (and delete the dead `isInteractive`/`isDragging` code).
- `MegaMenu.tsx` (616): extract `MegaMenuColumn`, `MegaMenuPanel`.
- `SearchAndFilters.tsx` (464): extract `FilterDrawer`, `FilterChip`,
  `useFilterState`.
- `MobileNav.tsx` (402): extract `MobileNavSection`, `PinnedSlugs`.
Acceptance: no component file > 350 lines; each extracted piece has a single
responsibility; lint/typecheck still green.

### P4 — Data model hygiene
- `PackageViewModel`: add typed `durationNights: number | null` and
  `brochureCode: string` (rename `brochure_code`), remove `any`. Keep a
  migration note for the JSON catalog.
- Stop reading `pkg.duration.split(" ")[0]` in JSX; render from the typed field.
- `content_flags` must never reach the client: filter in the data loader
  (`catalogue.ts` / `siteContent.ts`), not in components.
- Difficulty: render badge only when `difficultyVerified` (already in plan);
  remove the color switch's silent fallback for unverified grades.
Acceptance: `grep "split(\" \")" src` returns nothing; no `content_flags`
reference in components.

### P5 — Component contracts & naming
- Rename vague props: `pkg` → keep but type as `PackageViewModel` (already);
  avoid `data`, `item`, `value` in new code.
- Props interfaces named `XProps` and exported when reused.
- Event handlers named `handleX` / `onX` consistently (already mostly).
- Remove `suppressHydrationWarning` where it masks a real mismatch; fix the
  underlying cause.
Acceptance: code review checklist (§7) passes on touched files.

### P6 — Introduce tests (F.I.R.S.T.)
- Add a test runner. Given Next 16 + React 19, prefer Vitest + RTL (or the
  Next experimental testing guide). Add `test` script to `package.json`.
- First targets (pure logic, highest value, lowest cost):
  - `enquiryValidation.ts` (all validation branches + edge cases).
  - `menuStorage.ts` (localStorage read/write, SSR guards).
  - `catalogue.ts` (filtering, slug lookup, content_flags stripping).
  - `useBodyOverflowLock.ts` hook.
- Add one smoke test per route (`/`, `/explore`, `/packages/[slug]`,
  `/enquiry`, `/about`, `/contact`, `/houseboats`) rendering without crash.
Acceptance: `npm test` runs; ≥ 1 critical-path module at 80%+ coverage;
CI gate on PRs.

### P7 — Accessibility & performance hygiene
- Replace `setMounted`-gated rendering with `useSyncExternalStore` to avoid
  hydration flicker; keep SSR output stable.
- Add `loading="lazy"` + explicit dimensions to all `<Image>` (already on
  PackageCard; audit the rest).
- Keyboard: every interactive element reachable; focus-visible rings
  (already on PackageCard link) standardized via a primitive.
- `prefers-reduced-motion`: gate GSAP/scroll animations (audit
  `ScrollReveal`, `ScrollProgressBar`, `CtaZoom`).
Acceptance: Lighthouse accessibility ≥ 95 on `/`, `/explore`, one package page.

### P8 — Folder structure & exports
- Co-locate component + its hook + its types in a folder when > 2 files:
  `components/mega-menu/{index.tsx, MegaMenuColumn.tsx, useMegaMenu.ts}`.
- Barrel `index.ts` only where it reduces import noise; avoid circular deps.
- Move shared types from `src/types/travel.ts` splits if it grows > 200 lines.
- Keep `src/lib/` for framework-agnostic utilities only.

## 4. Data model changes (cross-ref modernization plan)

```ts
// src/types/travel.ts
export interface PackageViewModel {
  id: string;
  slug: string;
  title: string;
  category: PackageCategory;
  brochureCode: string;          // was brochure_code
  summary: string;
  durationNights: number | null; // replaces duration.split(" ")[0]
  durationLabel: string;         // "14 nights / 15 days"
  primaryRegion: string;
  secondaryRegions: string[];
  difficulty: VerifiedDifficulty | null; // null when !difficultyVerified
  difficultyVerified: boolean;
  highlights: string[];
  // ...
}
```

## 5. Verification gates (run on every PR)

1. `npm run typecheck` — 0 errors.
2. `npm run lint` — 0 problems.
3. `npm run build` — success, no warnings promoted to errors.
4. `npm test` — all green (once P6 lands).
5. Manual smoke: 320 / 768 / 1024 / 1440 px, keyboard-only navigation,
   reduced-motion, no horizontal overflow.

## 6. Out of scope (do not touch in this plan)

- Visual redesign / copy (owned by `plan/modernization.md`).
- Asset photography (owned by asset inventory).
- Backend enquiry endpoint (boundary documented; not implemented here).
- Migrating off Next.js/Tailwind (stack is fixed).

## 7. Review checklist (per PR)

- [ ] Function < 20 lines and does one thing?
- [ ] Name intention-revealing and searchable?
- [ ] No new `any`, `ts-ignore`, `eslint-disable` without justification?
- [ ] No synchronous `setState` in `useEffect`?
- [ ] No new inline SVG duplicates?
- [ ] No raw hex colors in components?
- [ ] Tests added/updated for changed logic?
- [ ] Lint + typecheck + build green?

## 8. Sequencing & owners

| Phase | Effort | Depends on | Owner |
|---|---|---|---|
| P0 lint debt | 0.5d | — | any |
| P1 icons | 0.5d | P0 | any |
| P2 tokens | 0.5d | P0 | design+dev |
| P3 god files | 2d | P0,P1 | dev |
| P4 data model | 1d | P3 | dev |
| P5 contracts | 0.5d | P3 | dev |
| P6 tests | 1.5d | P4 | dev |
| P7 a11y/perf | 1d | P3 | dev |
| P8 structure | 0.5d | P3 | dev |

Total ≈ 8 days. Ship P0+P1+P2 first (1.5 days) for an immediate quality
win; P3–P8 can land incrementally behind feature flags if needed.

## 9. Immediate next steps (this session)

1. Land P0: fix the 10 lint errors without changing output.
2. Land P1: extract icon components.
3. Add Vitest + first `enquiryValidation` tests (P6 seed).
4. Re-run lint/typecheck/build and record results in `docs/current-state-audit.md`.

---
Maintainer note: keep this plan in sync with `plan/modernization.md`; when a
phase lands, move its checkbox to the audit doc rather than deleting it here.
