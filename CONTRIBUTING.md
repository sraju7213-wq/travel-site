# Contributing to KS World Adventure

Thank you for contributing! This is a production Next.js 16 travel site for the India/Nepal organisation KS World Adventure.

## Before you start

1. Read [`AGENTS.md`](AGENTS.md) for stack, layout, conventions, and commands.
2. Read [`docs/planning/CONTENT_ACCURACY_RULES.md`](docs/planning/CONTENT_ACCURACY_RULES.md) for the mandatory content governance rules — **the brochure is the sole source of truth for factual content; never invent, infer or guess**. When auditing or correcting content against the brochure, also follow the 7-phase workflow in [`docs/planning/CONTENT_CORRECTION_AGENT_PROMPT.md`](docs/planning/CONTENT_CORRECTION_AGENT_PROMPT.md).
3. Read [`docs/audits/current-state-checklist.md`](docs/audits/current-state-checklist.md) for the authoritative project status.
4. Run `npm run dev` and verify the site loads at `http://localhost:3000`.

## Content accuracy — mandatory rules

This project publishes factual travel content sourced from a client brochure. The following rules apply to **every** contribution, whether code, copy, or data:

- **Never invent or infer facts.** Package durations, routes, nights, grades, prices, contact details, hotel names, meal plans, transport modes, altitudes, distances, difficulty grades, testimonials — all must come from the brochure or written client approval. If the source is unclear, **suppress the claim and flag it** — do not guess.
- **Never silently correct the brochure.** Preserve names, package codes, day labels, numbers and route names exactly. Flag apparent typos; do not fix them without client approval.
- **Never convert currency.** `$` stays `$` until the client confirms the currency.
- **Never present legacy booking terms as current.** Brochure page 10 terms (deposit, cancellation, insurance, liability) are unconfirmed until the client reconfirms.
- **Never invent contact details.** The brochure has multiple conflicting contact blocks (India Nepal Travel Centre vs Asian Bazaar). Do not pick one or invent details.
- **Never standardise the company name.** "India Nepal Travel Organisation" vs "India Nepal Travel Centre" needs client confirmation.
- **Never map letter grades (C/D) to word grades** (Easy/Moderate/Demanding/Strenuous) without client confirmation.
- **Never display internal notes** like "OCR unclear", "placeholder", "to confirm" on the public website.
- **Never claim the 27-package count** as final — the Enfield Motorbike Tour discrepancy is unresolved.

Every factual claim must be classified as `source-supported`, `client-confirmed`, `needs-confirmation`, or `withheld`. See the full rulebook for the status definitions, brochure page map, package inventory, and audit workflow.

## Making changes

1. **Create a branch** from `main` with a descriptive name (e.g. `fix/enquiry-validation`, `feature/package-grid`).
2. **Make your change** following the conventions in `AGENTS.md`:
   - Routes only in `app/src/app`
   - Reusable UI in `app/src/components` and `app/src/components/ui`
   - Content/data in `app/src/data`
   - Raw images in `assets/source-images/` (kebab-case, gitignored)
   - Served images in `app/public/images/<category>/` with an entry in `app/public/images/SOURCES.md`
3. **Never retype package details into JSX** — use `data/catalogue.ts` accessors over `travel_packages_catalog.json`.
4. **Do not invent contact details, pricing, or availability.** Content comes from the organisation's brochure only. See the [content accuracy rules](docs/planning/CONTENT_ACCURACY_RULES.md) for the full governance framework — when in doubt, suppress the claim and ask; never guess.

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