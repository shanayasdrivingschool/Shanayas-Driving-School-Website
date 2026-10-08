begin;

-- Public copies are deliberately separated from editorial records. Anonymous
-- visitors can read only the reviewed snapshot, never briefs, annotations,
-- account ids, or an editor's in-progress changes.
create table if not exists public.public_blog_posts (
  blog_post_id uuid primary key references public.blog_posts(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  published_at timestamptz not null,
  updated_at timestamptz not null default now(),
  published_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_public_blog_posts_published
  on public.public_blog_posts (published_at desc);

alter table public.public_blog_posts enable row level security;

drop policy if exists "Anyone can read published blog posts" on public.public_blog_posts;
create policy "Anyone can read published blog posts"
on public.public_blog_posts for select to anon, authenticated
using (true);

revoke all on table public.public_blog_posts from anon, authenticated;
grant select on table public.public_blog_posts to anon, authenticated;

create or replace function public.publish_blog_post(target_post_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  post public.blog_posts%rowtype;
  first_published_at timestamptz;
  revision_at timestamptz := now();
  public_snapshot jsonb;
begin
  if not ((select public.is_admin_user()) or (select public.is_seo_user())) then
    raise exception 'You do not have permission to publish blog posts.';
  end if;

  select * into post
  from public.blog_posts
  where id = target_post_id
  for update;

  if not found then
    raise exception 'Blog post not found.';
  end if;

  if post.status not in ('approved', 'published') then
    raise exception 'Move the article to Approved before publishing.';
  end if;

  if post.readiness <> 'ready' then
    raise exception 'Mark the article Ready before publishing.';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(post.annotations) annotation
    where coalesce((annotation ->> 'resolved')::boolean, false) = false
  ) then
    raise exception 'Resolve every editorial annotation before publishing.';
  end if;

  if btrim(post.title) = '' or btrim(post.slug) = '' or btrim(post.category) = ''
    or btrim(post.excerpt) = '' or jsonb_array_length(post.content_blocks) = 0
    or btrim(post.meta_description) = '' or btrim(post.author_name) = '' then
    raise exception 'Required article, metadata, or authorship fields are incomplete.';
  end if;

  if btrim(post.cover_image_url) = '' or btrim(post.cover_image_alt) = '' then
    raise exception 'A cover image and alternative text are required before publishing.';
  end if;

  if post.review_required and (
    btrim(post.reviewer_name) = '' or btrim(post.review_scope) = '' or post.reviewed_at is null
  ) then
    raise exception 'The required reviewer, scope, and actual review date must be recorded.';
  end if;

  first_published_at := coalesce(post.published_at, revision_at);
  public_snapshot := jsonb_build_object(
    'slug', post.slug,
    'title', post.title,
    'category', post.category,
    'excerpt', post.excerpt,
    'contentBlocks', post.content_blocks,
    'coverImageUrl', post.cover_image_url,
    'coverImageAlt', post.cover_image_alt,
    'coverImageCaption', post.cover_image_caption,
    'coverImageCredit', post.cover_image_credit,
    'seoTitle', post.seo_title,
    'metaDescription', post.meta_description,
    'canonicalPath', coalesce(nullif(btrim(post.canonical_path), ''), '/blog/' || post.slug || '/'),
    'ogTitle', coalesce(nullif(btrim(post.og_title), ''), post.title),
    'ogDescription', coalesce(nullif(btrim(post.og_description), ''), post.meta_description),
    'ogImageUrl', coalesce(nullif(btrim(post.og_image_url), ''), post.cover_image_url),
    'robots', post.robots,
    'schemaType', post.schema_type,
    'breadcrumbSchemaEnabled', post.breadcrumb_schema_enabled,
    'faqSchemaEnabled', post.faq_schema_enabled,
    'faqs', post.faqs,
    'relatedSlugs', post.related_slugs,
    'authorName', post.author_name,
    'reviewerName', post.reviewer_name,
    'reviewScope', post.review_scope,
    'reviewedAt', post.reviewed_at,
    'datePublished', first_published_at,
    'dateModified', revision_at
  );

  insert into public.public_blog_posts (
    blog_post_id, slug, snapshot, published_at, updated_at, published_by
  ) values (
    post.id, post.slug, public_snapshot, first_published_at, revision_at, auth.uid()
  )
  on conflict (blog_post_id) do update set
    slug = excluded.slug,
    snapshot = excluded.snapshot,
    published_at = excluded.published_at,
    updated_at = excluded.updated_at,
    published_by = excluded.published_by;

  update public.blog_posts set
    status = 'published',
    publication_state = 'live_confirmed',
    published_at = first_published_at,
    published_snapshot = public_snapshot,
    published_revision_at = revision_at,
    updated_by = auth.uid()
  where id = post.id;

  return public_snapshot;
end;
$$;

revoke all on function public.publish_blog_post(uuid) from public, anon;
grant execute on function public.publish_blog_post(uuid) to authenticated;

-- Seed the public table with the code-authored versions imported by the prior
-- migration. This preserves every currently live article on first rollout.
insert into public.public_blog_posts (
  blog_post_id, slug, snapshot, published_at, updated_at, published_by
)
select
  id,
  slug,
  published_snapshot,
  coalesce(published_at, created_at),
  coalesce(published_revision_at, updated_at),
  updated_by
from public.blog_posts
where published_snapshot is not null
on conflict (blog_post_id) do nothing;

commit;
