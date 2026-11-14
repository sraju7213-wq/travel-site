# Changelog

All notable changes to the KS World Adventure travel site are documented here.

## [Unreleased]

### Reorganisation
- Consolidated duplicate docs from repo root into `docs/` (briefs, planning, sign-off)
- Removed root-level duplicate `travel_packages_catalog.json` (canonical copy lives in `app/src/data/`)
- Moved root images into `assets/source-images/` with kebab-case names (gitignored local archive)
- Removed redundant `plan/` and `artifacts/` directories (duplicated `docs/planning/` and `docs/evidence/`)
- Added `AGENTS.md`, `CONTRIBUTING.md`, `ARCHITECTURE.md`, `CHANGELOG.md` at repo root
- Updated `README.md` repo map and house rules

## [0.1.0] — 2026-10-28

### Added
- Next.js 16 App Router site with 13 routes (11 pages + 2 API routes)
- 27 tour packages + 1 Kashmir houseboat service from brochure
- Enquiry and newsletter API routes with server-side validation
- GSAP motion system, Tailwind v4 brand tokens
- Accessibility audit, security audit, QA report, launch-readiness docs
- Design system documentation and reference site analysis
