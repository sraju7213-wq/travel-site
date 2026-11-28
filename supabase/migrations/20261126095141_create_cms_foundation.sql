-- CMS foundation: additive content, publishing, media and audit infrastructure.
-- Existing enquiry/newsletter records are preserved. Their overly broad read/update
-- policies are replaced with administrator-only access.

begin;

create schema if not exists private;

create table public.cms_admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.cms_documents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'package', 'destination', 'page', 'homepage', 'settings', 'theme',
    'testimonial', 'faq', 'banner'
  )),
  slug text not null check (
    char_length(slug) between 1 and 160
    and slug ~ '^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$'
  ),
  title text not null check (char_length(btrim(title)) > 0),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'unpublished', 'archived')
  ),
  draft_data jsonb not null default '{}'::jsonb check (jsonb_typeof(draft_data) = 'object'),
  published_data jsonb check (published_data is null or jsonb_typeof(published_data) = 'object'),
  published_slug text check (
    published_slug is null or published_slug ~ '^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$'
  ),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug)
);

create unique index cms_documents_published_url_idx
  on public.cms_documents (type, published_slug)
  where published_slug is not null;
create index cms_documents_public_listing_idx
  on public.cms_documents (type, status, sort_order, title)
  where status = 'published';
create index cms_documents_updated_idx
  on public.cms_documents (updated_at desc);
create index cms_documents_published_category_idx
  on public.cms_documents ((published_data ->> 'category'))
  where type = 'package' and status = 'published';
create index cms_documents_published_destination_idx
  on public.cms_documents ((published_data ->> 'destination'))
  where type = 'package' and status = 'published';

create table public.cms_document_revisions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.cms_documents(id) on delete cascade,
  title text not null,
  slug text not null,
  status text not null,
  draft_data jsonb not null,
  published_data jsonb,
  published_slug text,
  action text not null,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index cms_document_revisions_document_idx
  on public.cms_document_revisions (document_id, created_at desc);

create table public.cms_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index cms_audit_log_created_idx on public.cms_audit_log (created_at desc);
create index cms_audit_log_entity_idx
  on public.cms_audit_log (entity_type, entity_id, created_at desc);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'website-media',
  storage_path text not null unique,
  public_url text not null unique,
  name text not null check (char_length(btrim(name)) > 0),
  folder text not null default '/' ,
  kind text not null check (kind in ('image', 'video', 'file')),
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text not null default '',
  caption text not null default '',
  variants jsonb not null default '[]'::jsonb check (jsonb_typeof(variants) = 'array'),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index media_assets_library_idx on public.media_assets (folder, kind, name);
create index media_assets_updated_idx on public.media_assets (updated_at desc);

create table public.media_references (
  id uuid primary key default gen_random_uuid(),
  media_id uuid not null references public.media_assets(id) on delete restrict,
  document_id uuid not null references public.cms_documents(id) on delete cascade,
  field_path text not null,
  content_state text not null check (content_state in ('draft', 'published')),
  unique (media_id, document_id, field_path, content_state)
);

create index media_references_media_idx on public.media_references (media_id, document_id);
create index media_references_document_idx on public.media_references (document_id);

create table public.cms_redirects (
  id uuid primary key default gen_random_uuid(),
  source_path text not null unique check (source_path ~ '^/' and source_path !~ '^//'),
  destination_path text not null check (destination_path ~ '^/' and destination_path !~ '^//'),
  status_code integer not null default 301 check (status_code in (301, 302, 307, 308)),
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cms_redirects_active_source_idx
  on public.cms_redirects (source_path) where is_active;

-- Authorization helper deliberately lives outside exposed API schemas. It never
-- trusts user-editable user_metadata.
create or replace function private.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cms_admin_users
    where user_id = (select auth.uid())
      and role = 'admin'
      and is_active = true
  );
$$;

revoke all on function private.is_cms_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_cms_admin() to anon, authenticated;

create or replace function private.cms_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.cms_capture_document_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.cms_document_revisions (
    document_id, title, slug, status, draft_data, published_data,
    published_slug, action, changed_by
  ) values (
    old.id, old.title, old.slug, old.status, old.draft_data, old.published_data,
    old.published_slug,
    case
      when old.status is distinct from new.status then 'status:' || new.status
      when old.published_data is distinct from new.published_data then 'publish'
      else 'save'
    end,
    new.updated_by
  );
  return new;
end;
$$;

revoke all on function private.cms_capture_document_revision() from public;

create trigger cms_documents_set_updated_at
before update on public.cms_documents
for each row execute function private.cms_set_updated_at();

create trigger cms_documents_capture_revision
after update on public.cms_documents
for each row execute function private.cms_capture_document_revision();

create trigger media_assets_set_updated_at
before update on public.media_assets
for each row execute function private.cms_set_updated_at();

create trigger cms_redirects_set_updated_at
before update on public.cms_redirects
for each row execute function private.cms_set_updated_at();

-- Lock down every exposed table before granting only the required operations.
alter table public.cms_admin_users enable row level security;
alter table public.cms_documents enable row level security;
alter table public.cms_document_revisions enable row level security;
alter table public.cms_audit_log enable row level security;
alter table public.media_assets enable row level security;
alter table public.media_references enable row level security;
alter table public.cms_redirects enable row level security;

revoke all on public.cms_admin_users from anon, authenticated;
revoke all on public.cms_documents from anon, authenticated;
revoke all on public.cms_document_revisions from anon, authenticated;
revoke all on public.cms_audit_log from anon, authenticated;
revoke all on public.media_assets from anon, authenticated;
revoke all on public.media_references from anon, authenticated;
revoke all on public.cms_redirects from anon, authenticated;

grant select on public.cms_admin_users to authenticated;
grant select on public.cms_documents to anon, authenticated;
grant insert, update, delete on public.cms_documents to authenticated;
grant select on public.cms_document_revisions to authenticated;
grant select, insert on public.cms_audit_log to authenticated;
grant select, insert, update, delete on public.media_assets to authenticated;
grant select, insert, delete on public.media_references to authenticated;
grant select on public.cms_redirects to anon, authenticated;
grant insert, update, delete on public.cms_redirects to authenticated;
grant usage, select on sequence public.cms_audit_log_id_seq to authenticated;

create policy "Administrators can read their CMS role"
on public.cms_admin_users for select to authenticated
using (user_id = (select auth.uid()) or (select private.is_cms_admin()));

create policy "Public published content and administrator drafts are readable"
on public.cms_documents for select to anon, authenticated
using (
  (status = 'published' and published_data is not null)
  or (select private.is_cms_admin())
);

create policy "Administrators create CMS documents"
on public.cms_documents for insert to authenticated
with check ((select private.is_cms_admin()));

create policy "Administrators update CMS documents"
on public.cms_documents for update to authenticated
using ((select private.is_cms_admin()))
with check ((select private.is_cms_admin()));

create policy "Administrators delete CMS documents"
on public.cms_documents for delete to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators read CMS revisions"
on public.cms_document_revisions for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators read CMS audit activity"
on public.cms_audit_log for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators record CMS audit activity"
on public.cms_audit_log for insert to authenticated
with check (
  (select private.is_cms_admin())
  and actor_id = (select auth.uid())
);

create policy "Administrators read media metadata"
on public.media_assets for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators create media metadata"
on public.media_assets for insert to authenticated
with check ((select private.is_cms_admin()));

create policy "Administrators update media metadata"
on public.media_assets for update to authenticated
using ((select private.is_cms_admin()))
with check ((select private.is_cms_admin()));

create policy "Administrators delete unused media metadata"
on public.media_assets for delete to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators read media references"
on public.media_references for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators create media references"
on public.media_references for insert to authenticated
with check ((select private.is_cms_admin()));

create policy "Administrators delete media references"
on public.media_references for delete to authenticated
using ((select private.is_cms_admin()));

create policy "Public reads active redirects and administrators read all"
on public.cms_redirects for select to anon, authenticated
using (is_active or (select private.is_cms_admin()));

create policy "Administrators create redirects"
on public.cms_redirects for insert to authenticated
with check ((select private.is_cms_admin()));

create policy "Administrators update redirects"
on public.cms_redirects for update to authenticated
using ((select private.is_cms_admin()))
with check ((select private.is_cms_admin()));

create policy "Administrators delete redirects"
on public.cms_redirects for delete to authenticated
using ((select private.is_cms_admin()));

-- Replace the legacy permissive enquiry/newsletter policies without dropping
-- tables or records. Public form submission remains available.
drop policy if exists "Allow public insert to enquiries" on public.enquiries;
drop policy if exists "Allow select to authenticated and anon" on public.enquiries;
drop policy if exists "Allow update to authenticated and service_role" on public.enquiries;
drop policy if exists "Allow public insert to newsletters" on public.newsletters;
drop policy if exists "Allow select to newsletters" on public.newsletters;

revoke select, update, delete on public.enquiries from anon;
revoke select, update, delete on public.newsletters from anon;
revoke select, update, delete on public.enquiries from authenticated;
revoke select, update, delete on public.newsletters from authenticated;
grant insert on public.enquiries to anon, authenticated;
grant insert on public.newsletters to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select, update, delete on public.newsletters to authenticated;

create policy "Visitors can submit enquiries"
on public.enquiries for insert to anon, authenticated
with check (true);

create policy "Administrators read enquiries"
on public.enquiries for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators update enquiries"
on public.enquiries for update to authenticated
using ((select private.is_cms_admin()))
with check ((select private.is_cms_admin()));

create policy "Administrators delete enquiries"
on public.enquiries for delete to authenticated
using ((select private.is_cms_admin()));

create policy "Visitors can subscribe to newsletters"
on public.newsletters for insert to anon, authenticated
with check (true);

create policy "Administrators read newsletters"
on public.newsletters for select to authenticated
using ((select private.is_cms_admin()));

create policy "Administrators update newsletters"
on public.newsletters for update to authenticated
using ((select private.is_cms_admin()))
with check ((select private.is_cms_admin()));

create policy "Administrators delete newsletters"
on public.newsletters for delete to authenticated
using ((select private.is_cms_admin()));

-- Public downloads use the public bucket URL; listing and all mutations require
-- a verified CMS administrator JWT.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media', 'website-media', true, 104857600,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Administrators list website media objects"
on storage.objects for select to authenticated
using (bucket_id = 'website-media' and (select private.is_cms_admin()));

create policy "Administrators upload website media objects"
on storage.objects for insert to authenticated
with check (bucket_id = 'website-media' and (select private.is_cms_admin()));

create policy "Administrators replace website media objects"
on storage.objects for update to authenticated
using (bucket_id = 'website-media' and (select private.is_cms_admin()))
with check (bucket_id = 'website-media' and (select private.is_cms_admin()));

create policy "Administrators delete website media objects"
on storage.objects for delete to authenticated
using (bucket_id = 'website-media' and (select private.is_cms_admin()));

-- The connected project had exactly one Auth user when this migration was
-- approved. Bootstrap that user only; new environments do not auto-grant access.
insert into public.cms_admin_users (user_id, role)
select id, 'admin' from auth.users
where (select count(*) from auth.users) = 1
on conflict (user_id) do update set role = 'admin', is_active = true;

commit;
