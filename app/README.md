# app — Next.js application

The shippable site. Everything else at the repo root is documentation, source
media, or script forwarding.

## Run it

From the repository root (preferred — the scripts forward into this folder):

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

Or from inside `app/` directly: `npm install && npm run dev`.

## Layout

| Path | Contents |
|---|---|
| `src/app/` | App Router routes, layouts, and server API routes |
| `src/components/` | UI; feature folders (`houseboats/`, `journeys/`, `package/`) plus `ui/` primitives |
| `src/data/` | Content and the canonical `travel_packages_catalog.json` |
| `src/lib/` | Pure helpers: validation, itinerary shaping, Supabase client, motion config |
| `src/hooks/` | Client hooks |
| `src/types/` | Shared types |
| `public/images/` | Served, optimized rasters — see `public/images/SOURCES.md` for provenance |
| `scripts/` | Audit and contrast tooling (`npm run audit:a11y`, `npm run check:contrast`) |

## Conventions

- Package facts come from `src/data/travel_packages_catalog.json` through the
  accessors in `src/data/catalogue.ts`. Don't hardcode package copy in JSX.
- Server secrets stay server-side: only `NEXT_PUBLIC_*` may reach the browser.
- Documents, briefs, and audits live in the repo root's `docs/` folder, not here.
- Build output (`.next/`) and `tsconfig.tsbuildinfo` are regenerable and
  gitignored; clear them with `npm run clean` from the root.
