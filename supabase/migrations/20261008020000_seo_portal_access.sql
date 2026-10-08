begin;

create table if not exists public.seo_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  full_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_seo_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.seo_users
    where user_id = auth.uid()
      and status = 'active'
  );
$$;

revoke all on function public.is_seo_user() from public;
grant execute on function public.is_seo_user() to authenticated;

drop trigger if exists trg_seo_users_updated_at on public.seo_users;
create trigger trg_seo_users_updated_at
before update on public.seo_users
for each row execute function public.set_updated_at();

alter table public.seo_users enable row level security;

drop policy if exists "SEO users can read their access record" on public.seo_users;
create policy "SEO users can read their access record"
on public.seo_users for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_admin_user()));

drop policy if exists "Admin users can create SEO access" on public.seo_users;
create policy "Admin users can create SEO access"
on public.seo_users for insert to authenticated
with check ((select public.is_admin_user()));

drop policy if exists "Admin users can update SEO access" on public.seo_users;
create policy "Admin users can update SEO access"
on public.seo_users for update to authenticated
using ((select public.is_admin_user()))
with check ((select public.is_admin_user()));

drop policy if exists "Admin users can delete SEO access" on public.seo_users;
create policy "Admin users can delete SEO access"
on public.seo_users for delete to authenticated
using ((select public.is_admin_user()));

revoke all on table public.seo_users from anon, authenticated;
grant select, insert, update, delete on table public.seo_users to authenticated;

drop policy if exists "Admin users can read blog posts" on public.blog_posts;
create policy "Blog editors can read blog posts"
on public.blog_posts for select to authenticated
using ((select public.is_admin_user()) or (select public.is_seo_user()));

drop policy if exists "Admin users can create blog posts" on public.blog_posts;
create policy "Blog editors can create blog posts"
on public.blog_posts for insert to authenticated
with check ((select public.is_admin_user()) or (select public.is_seo_user()));

drop policy if exists "Admin users can update blog posts" on public.blog_posts;
create policy "Blog editors can update blog posts"
on public.blog_posts for update to authenticated
using ((select public.is_admin_user()) or (select public.is_seo_user()))
with check ((select public.is_admin_user()) or (select public.is_seo_user()));

drop policy if exists "Admin users can delete blog posts" on public.blog_posts;
create policy "Blog editors can delete blog posts"
on public.blog_posts for delete to authenticated
using ((select public.is_admin_user()) or (select public.is_seo_user()));

drop policy if exists "Admin users can read blog revisions" on public.blog_post_revisions;
create policy "Blog editors can read blog revisions"
on public.blog_post_revisions for select to authenticated
using ((select public.is_admin_user()) or (select public.is_seo_user()));

drop policy if exists "Admin users can upload blog media" on storage.objects;
create policy "Blog editors can upload blog media"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'blog-media'
  and ((select public.is_admin_user()) or (select public.is_seo_user()))
);

drop policy if exists "Admin users can update blog media" on storage.objects;
create policy "Blog editors can update blog media"
on storage.objects for update to authenticated
using (
  bucket_id = 'blog-media'
  and ((select public.is_admin_user()) or (select public.is_seo_user()))
)
with check (
  bucket_id = 'blog-media'
  and ((select public.is_admin_user()) or (select public.is_seo_user()))
);

drop policy if exists "Admin users can delete blog media" on storage.objects;
create policy "Blog editors can delete blog media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'blog-media'
  and ((select public.is_admin_user()) or (select public.is_seo_user()))
);

commit;
