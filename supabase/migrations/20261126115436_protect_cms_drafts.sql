-- Do not expose unsaved draft_data on published rows to anonymous/non-admin reads.
drop policy if exists "Public published content and administrator drafts are readable" on public.cms_documents;

create policy "CMS administrators read all document states"
on public.cms_documents for select to authenticated
using ((select private.is_cms_admin()));

revoke select on public.cms_documents from anon, authenticated;
grant select on public.cms_documents to authenticated;

create or replace view public.public_cms_documents
with (security_invoker = false)
as
select
  id, type, slug, title, status, published_data, published_slug,
  sort_order, created_by, updated_by, published_at, created_at, updated_at
from public.cms_documents
where status = 'published' and published_data is not null;

revoke all on public.public_cms_documents from public, anon, authenticated;
grant select on public.public_cms_documents to anon, authenticated;
