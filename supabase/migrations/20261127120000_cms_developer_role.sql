-- Role split: everyday client admins vs developers.
-- `admin`   = client editor (content, media, publishing)
-- `developer` = client editor plus theme, advanced SEO, redirect and audit controls

alter table public.cms_admin_users drop constraint if exists cms_admin_users_role_check;
alter table public.cms_admin_users add constraint cms_admin_users_role_check check (role in ('admin', 'developer'));

create or replace function private.is_cms_admin()
returns boolean
language sql
stable security definer
set search_path to ''
as $function$
  select exists (
    select 1 from public.cms_admin_users
    where user_id = (select auth.uid())
      and role in ('admin', 'developer')
      and is_active = true
  );
$function$;

create or replace function private.is_cms_developer()
returns boolean
language sql
stable security definer
set search_path to ''
as $function$
  select exists (
    select 1 from public.cms_admin_users
    where user_id = (select auth.uid())
      and role = 'developer'
      and is_active = true
  );
$function$;

grant execute on function private.is_cms_developer() to anon, authenticated;

-- Theme changes are developer-only at the database layer as well as in the UI.
drop policy if exists "Administrators update CMS documents" on public.cms_documents;
create policy "Administrators update CMS documents"
  on public.cms_documents for update to authenticated
  using (private.is_cms_admin() and (type <> 'theme' or private.is_cms_developer()))
  with check (private.is_cms_admin() and (type <> 'theme' or private.is_cms_developer()));

drop policy if exists "Administrators create CMS documents" on public.cms_documents;
create policy "Administrators create CMS documents"
  on public.cms_documents for insert to authenticated
  with check (private.is_cms_admin() and (type <> 'theme' or private.is_cms_developer()));

drop policy if exists "Administrators delete CMS documents" on public.cms_documents;
create policy "Administrators delete CMS documents"
  on public.cms_documents for delete to authenticated
  using (private.is_cms_admin() and (type <> 'theme' or private.is_cms_developer()));

-- The site owner is the developer. Other accounts stay client admins.
update public.cms_admin_users
set role = 'developer'
where user_id in (select id from auth.users where lower(email) = 'raju@gmail.com');
