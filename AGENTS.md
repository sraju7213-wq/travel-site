# KS World Adventure — AI Assistant Context

## Project

India/Nepal travel organisation site ("KS World Adventure"). Built from the organisation's own brochure (27 tour packages + 1 Kashmir houseboat service), not placeholder copy.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript strict
- Tailwind v4 + CSS custom properties (brand tokens in `app/src/app/globals.css`)
- GSAP for motion
- Supabase (enquiry + newsletter forms, server-side API routes)
- Brand palette: forest `#16271A` · brass `#B18A51` · ivory `#F6F2E9` · charcoal `#252824`

## Repository layout

```
travel-site-main/
├── app/                          # the Next.js application (all shippable code)
│   ├── src/
│   │   ├── app/                  # routes: /, /about, /contact, /enquiry, /explore,
│   │   │                         #   /explore/[category], /houseboats, /journeys,
│   │   │                         #   /packages/[slug], /privacy, /admin, /api/*
│   │   ├── components/           # UI, grouped by feature + components/ui
│   │   ├── data/                 # content + catalogue (travel_packages_catalog.json is canonical)
│   │   ├── hooks/                # client-side React hooks
│   │   ├── lib/                  # pure helpers, validation, Supabase client
│   │   └── types/                # shared TypeScript types
│   ├── public/
│   │   ├── images/<category>/    # served rasters (see images/SOURCES.md)
│   │   └── logo.png
│   ├── scripts/                  # audit / contrast tooling
│   ├── next.config.ts · tsconfig.json · eslint.config.mjs
│   └── package.json
├── assets/
│   └── source-images/            # original photography, NOT served, local archive only (gitignored)
├── docs/
│   ├── briefs/                   # product briefs and build prompts
│   ├── design/                   # design system + audit + reference analysis
│   ├── audits/                   # accessibility, security, asset, QA, launch-readiness
│   ├── planning/                 # modernization + clean-code plans, phase sign-off
│   └── evidence/                 # brochure OCR/text extracts and audit screenshots
├── package.json                  # root script forwards into app/
├── .gitignore
├── README.md                     # project overview, quick start, repo map, env vars
├── CONTRIBUTING.md               # how to contribute
├── ARCHITECTURE.md               # system architecture overview
├── CHANGELOG.md                  # release history
└── AGENTS.md                     # this file
```

## Conventions

- **Routes** only in `app/src/app`. Reusable UI in `app/src/components` and `app/src/components/ui`. No business logic in page files — put it in `app/src/lib`.
- **Content** → `app/src/data`. Package facts come from `travel_packages_catalog.json` via `data/catalogue.ts` accessors. Never retype package details into JSX.
- **Served images** → `app/public/images/<category>/`, lowercase-hyphenated names. Every file must be listed in `app/public/images/SOURCES.md`.
- **Raw/original media** → `assets/source-images/`, kebab-case. Local-only (gitignored). Don't reference from code.
- **Documents** → `docs/<briefs|design|audits|planning|evidence>/`. Nothing markdown at repo root except README.md.
- **Generated output** → `app/.next`, `app/tsconfig.tsbuildinfo`: regenerable, gitignored, delete with `npm run clean`.

## Commands (run from repo root)

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Turbopack (http://localhost:3000) |
| `npm run build` | Install app deps + production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run clean` | Delete `.next` and TS build cache |
| `npm run audit:a11y` | axe-core + responsive audit against running dev server |
| `npm run check:contrast` | Brand palette contrast ratios |

## Environment

Server-side only unless prefixed `NEXT_PUBLIC_`. No `.env` committed; set in Vercel or local `app/.env.local`:

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin-only server code |
| `ENQUIRY_API_URL` / `ENQUIRY_API_KEY` | `/api/enquiry` |
| `NEWSLETTER_API_URL` / `NEWSLETTER_API_KEY` | `/api/newsletter` |

With enquiry/newsletter vars unset, those routes answer `503 not_configured`.

## Important notes

- `app/AGENTS.md` contains Next.js 16 agent rules (re-added by `next dev`). Read `node_modules/next/dist/docs/` before writing code — Next 16 has breaking changes.
- `docs/audits/current-state-checklist.md` is the authoritative status document.
- No test suite exists yet. Do not invent contact details or pricing.
- `.gitignore` ignores `assets/source-images/`, `*.pdf`, `*.psd` — large binaries must be optimised into `app/public/images` first.