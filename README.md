# KS World Adventure — India Nepal Travel Site

Production Next.js 16 site for **India Nepal Travel Organisation**, trading as
**KS World Adventure**. Built from the organisation's own brochure (27 tour
packages + one Kashmir houseboat service), not from placeholder copy.

- **Framework:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict
- **Styling:** Tailwind v4 + CSS custom properties (brand tokens in `globals.css`)
- **Motion:** GSAP
- **Data / forms:** Supabase (enquiry + newsletter), server-side API routes
- **Brand palette:** forest `#16271A` · brass `#B18A51` · ivory `#F6F2E9` · charcoal `#252824`

---

## Quick start

```bash
npm install          # installs app/ dependencies through the root scripts
npm run dev          # http://localhost:3000
```

Root scripts proxy into `app/` so you never have to `cd`:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Install + production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run clean` | Delete `.next` and the TS build cache |
| `npm run audit:a11y` | axe-core + responsive audit against the running dev server |
| `npm run check:contrast` | Brand palette contrast ratios |

Full commands live in `app/package.json`; the root file only forwards to them.

---

## Repository map

```
travel-site-main/
├── app/                          # the Next.js application (all shippable code)
│   ├── src/
│   │   ├── app/                  # routes: /, /about, /contact, /enquiry, /explore,
│   │   │                         #   /explore/[category], /houseboats, /journeys,
│   │   │                         #   /packages/[slug], /privacy, /admin, /api/*
│   │   ├── components/           # UI, grouped by feature (houseboats/, journeys/, package/, ui/)
│   │   ├── data/                 # content + catalogue — travel_packages_catalog.json is canonical
│   │   ├── hooks/                # client-side React hooks
│   │   ├── lib/                  # pure helpers, validation, Supabase client
│   │   └── types/                # shared TypeScript types
│   ├── public/
│   │   ├── images/               # brochure-derived rasters (see images/SOURCES.md)
│   │   └── logo.png
│   ├── scripts/                  # repeatable audit / contrast tooling
│   ├── next.config.ts · tsconfig.json · eslint.config.mjs
│   └── package.json
├── assets/
│   └── source-images/            # original photography, NOT served, local archive only
├── docs/
│   ├── briefs/                   # product briefs and build prompts
│   ├── design/                   # design system + design-system audit + reference analysis
│   ├── audits/                   # accessibility, security, asset, QA, launch-readiness
│   ├── planning/                 # modernization + clean-code plans, phase sign-off
│   └── evidence/                 # brochure OCR/text extracts and audit screenshots
├── package.json                  # root script forwards
├── .gitignore
└── README.md
```

`docs/README.md` is the index for every document, with what each one is for and
which are still current.

---

## Where things go (keep it this way)

- **Code** → `app/src`. Routes only in `app/src/app`; reusable UI in
  `app/src/components` and `components/ui`; no business logic in page files that
  belongs in `app/src/lib`.
- **Content** → `app/src/data`. Package facts come from
  `data/travel_packages_catalog.json` and are read through `data/catalogue.ts`
  accessors. Never retype package details into JSX.
- **Served images** → `app/public/images/<category>/`, lowercase-hyphenated names.
  Every file must be listed in `app/public/images/SOURCES.md`.
- **Raw/original media** → `assets/source-images/`, kebab-case. This folder is
  local-only (gitignored) because the optimized, served copies already live in
  `app/public`. Don't reference it from code.
- **Documents** → `docs/<briefs|design|audits|planning|evidence>/`. Nothing
  markdown should sit at the repo root except this README.
- **Generated output** → `app/.next`, `app/tsconfig.tsbuildinfo`: regenerable,
  gitignored, delete with `npm run clean`.

---

## Environment

Server-side only unless prefixed `NEXT_PUBLIC_`. Nothing is committed — there is
no `.env` in the repo; set these in Vercel (or a local `app/.env.local`):

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-only server code |
| `ENQUIRY_API_URL` / `ENQUIRY_API_KEY` | `/api/enquiry` |
| `NEWSLETTER_API_URL` / `NEWSLETTER_API_KEY` | `/api/newsletter` |

With the enquiry/newsletter variables unset those routes answer `503
not_configured` and the UI says plainly that nothing was sent.

---

## Known state

- `docs/audits/current-state-checklist.md` is the authoritative status document;
  older audits are kept for history and are annotated where stale.
- The brochure photo-extraction and itinerary-transcription scripts were not
  included in this checkout. Provenance lives in `app/public/images/SOURCES.md`;
  footage of the brochure text is in `docs/evidence/`.
- Accessibility baseline: `docs/audits/a11y-audit.json` (regenerate with
  `npm run audit:a11y` against a running dev server).
