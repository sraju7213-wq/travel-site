# Architecture — KS World Adventure

## Overview

Production Next.js 16 travel site for the India/Nepal organisation KS World Adventure. Content is sourced from the organisation's brochure (27 tour packages + 1 Kashmir houseboat service), transcribed into a single JSON catalogue.

## Layer diagram

```
┌─────────────────────────────────────────┐
│  Browser (React 19, Next.js App Router) │
└──────────────┬──────────────────────────┘
               │ Server Components / API Routes
┌──────────────▼──────────────────────────┐
│  app/src/app/   (routes + route handlers) │
│  app/src/components/  (feature + ui)     │
└──────────────┬──────────────────────────┘
               │ data accessors
┌──────────────▼──────────────────────────┐
│  app/src/data/   (catalogue, content)    │
│  app/src/lib/    (validation, supabase)  │
└──────────────┬──────────────────────────┘
               │ server-side only
┌──────────────▼──────────────────────────┐
│  Supabase (enquiry + newsletter forms)   │
└─────────────────────────────────────────┘
```

## Directory responsibilities

| Layer | Path | Responsibility |
|---|---|---|
| Routing | `app/src/app/` | Next.js App Router routes (`/`), dynamic segments (`/packages/[slug]`), API routes (`/api/enquiry`, `/api/newsletter`) |
| UI components | `app/src/components/` | Feature components (houseboats, journeys, package) + shared `ui/` primitives |
| Data | `app/src/data/` | Canonical catalogue (`travel_packages_catalog.json`), typed accessors (`catalogue.ts`), editorial content (`siteContent.ts`) |
| Lib | `app/src/lib/` | Pure helpers, client/server validation, Supabase client, motion config |
| Types | `app/src/types/` | Shared TypeScript types (`travel.ts`) |
| Static | `app/public/images/` | Optimised, served rasters (category subfolders) |
| Raw media | `assets/source-images/` | Original photography, local-only, gitignored |

## Data flow

1. Pages import catalogue data via `app/src/data/catalogue.ts` accessors, never by importing the JSON directly in components.
2. Form submissions POST to `/api/enquiry` or `/api/newsletter` (server-only route handlers).
3. Route handlers validate server-side (`app/src/lib/enquiryValidation.ts`), call upstream APIs with bearer tokens from env vars, return `503 not_configured` when vars are unset.
4. Client bundles contain zero env values.

## Security boundaries

- `.env*` is gitignored; no secrets committed.
- `NEXT_PUBLIC_*` vars are the only client-exposed variables.
- `SUPABASE_SERVICE_ROLE_KEY` is server-side only (admin routes).
- Honeypot field and duplicate `submissionId` rejection (10-min window) on enquiry.
- Route handlers answer `503` when upstream is unconfigured; UI states plainly that nothing was sent.

## Styling

- Tailwind v4 with CSS custom properties for brand tokens in `app/src/app/globals.css`.
- GSAP for motion; `app/src/lib/motion.ts` centralises animation config.
- No business logic or data fetching inside presentational components.