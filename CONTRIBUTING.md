# Contributing to KS World Adventure

Thank you for contributing! This is a production Next.js 16 travel site for the India/Nepal organisation KS World Adventure.

## Before you start

1. Read [`AGENTS.md`](AGENTS.md) for stack, layout, conventions, and commands.
2. Read [`docs/audits/current-state-checklist.md`](docs/audits/current-state-checklist.md) for the authoritative project status.
3. Run `npm run dev` and verify the site loads at `http://localhost:3000`.

## Making changes

1. **Create a branch** from `main` with a descriptive name (e.g. `fix/enquiry-validation`, `feature/package-grid`).
2. **Make your change** following the conventions in `AGENTS.md`:
   - Routes only in `app/src/app`
   - Reusable UI in `app/src/components` and `app/src/components/ui`
   - Content/data in `app/src/data`
   - Raw images in `assets/source-images/` (kebab-case, gitignored)
   - Served images in `app/public/images/<category>/` with an entry in `app/public/images/SOURCES.md`
3. **Never retype package details into JSX** — use `data/catalogue.ts` accessors over `travel_packages_catalog.json`.
4. **Do not invent contact details, pricing, or availability.** Content comes from the organisation's brochure only.

## Verification

Before opening a PR, run from the repo root:

```bash
npm run typecheck   # tsc --noEmit — must have zero errors
npm run lint        # ESLint — must have zero errors/warnings
npm run build       # production build — must pass
```

If you touched images or routes, also verify the affected pages return 200 in dev.

## Pull requests

- Keep PRs small and focused on one change.
- Include a clear description of what changed and why.
- Reference any related issue or design decision.
- Do not commit secrets (`.env*`) or build output (`.next/`, `node_modules/`).

## Docs

Project documentation lives in `docs/`:
- `docs/briefs/` — product briefs and build prompts
- `docs/design/` — design system + audit + reference analysis
- `docs/audits/` — accessibility, security, QA, launch-readiness
- `docs/planning/` — modernization + clean-code plans, phase sign-off
- `docs/evidence/` — brochure extracts and audit screenshots (traceability only)