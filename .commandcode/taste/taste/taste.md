# Taste
- Never claim a build, lint, or test result unless the command was actually executed against the real code; state explicitly when a check could not be run (e.g. missing `node_modules`). Confidence: 0.9
- Retains unresolved `content_flags` / uncertain values rather than silently changing them; flag uncertainties instead of guessing. Confidence: 0.85
- Keeps audit, plan, and QA docs current and annotates stale findings so later automated or IDE runs don't act on outdated "missing route/image" defects. Confidence: 0.8
- Refuses to ship filters or controls whose underlying data is unverified (e.g. category-level activity mapping applied to every record, difficulty, price); removes such filters rather than exposing false information. Confidence: 0.85
- Requires that every public factual claim (especially impact, guide, group-size, hotel, and service promises) be traceable to an approved source; rewrites reference-site vocabulary into original language and lists unresolved image/quality issues rather than concealing them. Confidence: 0.85
- Requires UI to never claim a submission/subscription was delivered when no real backend succeeded: unconfigured integrations must be gated off (or plainly labelled "not sent"), and success states require a confirmed server response. Confidence: 0.9
- Keeps secrets server-side only (no `NEXT_PUBLIC_` for API keys), validates on the server regardless of client validation, and checks the built client bundle for leaked env values. Confidence: 0.85
- Expects verification to cover every failure path (unconfigured, validation error, honeypot, duplicate, upstream failure), often via a throwaway local mock upstream, and cleans up test env files/artifacts afterwards. Confidence: 0.8
- Prefers one consolidated, documented design system: no mixed old/new token names after a rename, and the design doc must be reconciled to match the actual implementation (e.g. `globals.css`). Confidence: 0.8
