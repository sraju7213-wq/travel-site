# Documentation index

Everything written about this project lives under `docs/`. The application code
and its own README live in `app/`.

## Start here

| Document | Status | What it is |
|---|---|---|
| [`audits/current-state-checklist.md`](audits/current-state-checklist.md) | **Authoritative** | Current state of the build, what is done, what is genuinely missing |
| [`briefs/india-nepal-travel-web-app-brief.md`](briefs/india-nepal-travel-web-app-brief.md) | Source | Original product brief: audience, structure, design direction |
| [`design/design-system.md`](design/design-system.md) | Reference | Brand tokens, type scale, component rules |
| [`planning/modernization-plan.md`](planning/modernization-plan.md) | Reference | Phased plan and completion status |

## briefs/

Requirements and prompts the build was produced from.

| File | What it is |
|---|---|
| [`india-nepal-travel-web-app-brief.md`](briefs/india-nepal-travel-web-app-brief.md) | Full product brief: content inventory, routes, flows, design direction |
| [`travel-webapp-ide-free-model-prompt.md`](briefs/travel-webapp-ide-free-model-prompt.md) | Condensed build prompt for an IDE agent |
| [`wilderness-destinations-design-brief.md`](briefs/wilderness-destinations-design-brief.md) | Teardown of the reference site (colours, type, layout patterns) |

## design/

| File | What it is |
|---|---|
| [`design-system.md`](design/design-system.md) | The design system as documented (note: the audit below records where code drifted) |
| [`design-system-audit.md`](design/design-system-audit.md) | Documented system vs shipped implementation, with the drift called out |
| [`reference-site-analysis.md`](design/reference-site-analysis.md) | How the reference site is built, and what not to copy |

## audits/

| File | What it is |
|---|---|
| [`a11y-audit.json`](audits/a11y-audit.json) | axe-core results per route and width, plus overflow findings (machine-readable) |
| [`asset-inventory.md`](audits/asset-inventory.md) | Every image asset, its crop, and its quality flags |
| [`baseline-audit.md`](audits/baseline-audit.md) | Phase 0 baseline — **partly stale**, header explains what changed |
| [`current-state-audit.md`](audits/current-state-audit.md) | Snapshot audit with corrected stale references |
| [`current-state-checklist.md`](audits/current-state-checklist.md) | **Authoritative** status checklist |
| [`launch-readiness.md`](audits/launch-readiness.md) | What must be true before going live |
| [`qa-report.md`](audits/qa-report.md) | Build/typecheck/lint/route QA results |
| [`security-audit.md`](audits/security-audit.md) | Secrets, API routes, headers, dependency findings |

## planning/

| File | What it is |
|---|---|
| [`modernization-plan.md`](planning/modernization-plan.md) | Product/content modernization phases and status |
| [`modernization.md`](planning/modernization.md) | Anti-slop review of content and interaction decisions |
| [`clean-code.md`](planning/clean-code.md) | Code-quality plan: file sizes, lint debt, refactor order |
| [`phase9-signoff.md`](planning/phase9-signoff.md) | Phase 9 visual/a11y refresh sign-off record |

## evidence/

Raw material kept for traceability — not part of the build.

| Path | What it is |
|---|---|
| `evidence/brochure.txt` | Text layer pulled from the source brochure |
| `evidence/brochure-ocr.txt` | Full OCR transcription of the brochure |
| `evidence/image-list.txt` | Raw extractor output (UTF-16) listing brochure crops |
| `evidence/screenshots/` | Audit evidence: asset contact sheet, crop probes, homepage capture |

## House rules

- One document per question. If a newer audit supersedes an old one, annotate the
  old one's header instead of deleting it — the history is the audit trail.
- Reference other docs by relative link so the index stays clickable.
- Diagrams and screenshots go in `evidence/`, not next to the prose.
