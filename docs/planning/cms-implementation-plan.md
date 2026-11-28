# Travel Website CMS Implementation Plan

**Status:** In progress  
**Started:** 2026-11-26  
**Remote project:** `vvmlthlguleysyhmkcfx` (migration/application approved by the user; no code deployment or git push approved)

## Baseline findings

- Next.js 16.4.6 / React 19.3 application under `app/`; TypeScript strict and Tailwind v4.
- The existing admin is an enquiry operations dashboard with browser-only password gating and read-only static package/destination views.
- Packages and editorial content currently originate in `app/src/data/`; Supabase contains only `enquiries` and `newsletters`.
- Existing enquiry RLS permits anonymous reads. This must be tightened without blocking public form submissions.
- Existing uncommitted public-site changes are user work and must be preserved.
- No Docker/local Supabase stack and no existing automated test suite. Remote schema changes require the explicit approval recorded above.

## Architecture

### Single content store

`public.cms_documents` is the shared content aggregate for packages, destinations, pages, homepage, settings, theme, testimonials, FAQs and promotional banners. Each row contains independently editable `draft_data` and public `published_data`, plus lifecycle state, slug and authorship metadata. Structured TypeScript contracts define each document type; package itinerary, pricing, media, inclusion and section arrays remain structured JSON rather than disconnected key/value storage.

Supporting tables:

- `cms_document_revisions` — automatic previous-state snapshots and restore source.
- `cms_audit_log` — important administrative actions and actors.
- `media_assets` — centralized Storage metadata, alt text, captions, dimensions, size and responsive variants.
- `media_references` — draft/published usage locations for safe deletion.
- `cms_redirects` — published slug-change redirects.
- `cms_admin_users` — server-side role records linked to Supabase Auth.

Existing enquiry/newsletter tables remain intact.

### Security

- Supabase Auth PKCE sessions through `@supabase/ssr`.
- Server-side administrator verification on every protected route/API.
- RLS and grants on every exposed table; no authorization through editable user metadata.
- Public reads expose published content only; administrators can read drafts.
- Public media downloads through the `website-media` bucket; upload/list/replace/delete require administrator policies.
- Upload route validates type, signatures and size; images are compressed and responsive variants generated.
- No arbitrary HTML/code editor.

### Content workflow

Saving updates only `draft_data`. Publishing copies the draft and slug to their public counterparts. Unpublish/archive hide public content while preserving records. Every update creates a revision; restore is itself a new draft revision. Preview uses authenticated Next.js Draft Mode. Administrative actions write audit records and revalidate public routes.

### Public-site integration

Static catalogue/editorial files are migration seeds and an explicit unconfigured-CMS fallback only. Once configured, public accessors use published database records and draft records only in authenticated preview. Packages, destinations, homepage sections, CMS pages, navigation/footer/contact settings, theme tokens, metadata, sitemap and redirects consume this same store.

## Delivery phases

1. **Foundation:** schema/RLS/storage migration; seed current catalogue and site content; preserve existing records; bootstrap the approved existing Auth user.
2. **Application infrastructure:** typed CMS contracts, Supabase server/browser clients, auth guard, admin APIs, workflow actions, revisions, redirects and media services.
3. **Admin experience:** protected shell, quick-action dashboard, full package/destination editors, reusable homepage/page section builder, media picker/library, settings/theme/SEO/history interfaces and existing enquiry operations.
4. **Public frontend:** dynamic content adapters and renderers, preview banner, package/destination/page metadata, sitemap and redirect handling.
5. **Verification:** database/RLS checks, API authorization tests, complete package/homepage/destination draft-preview-publish-edit-unpublish-republish flows, media usage protection, lint/typecheck/build and mobile/tablet/desktop audits.

## Completion constraints

- No fabricated package facts, testimonials, prices, contact details, difficulty labels or legal terms.
- No remote code deployment, git commit or git push without separate explicit approval.
- No attractive-but-inert controls: every exposed control must call a real persistent operation or be omitted.
