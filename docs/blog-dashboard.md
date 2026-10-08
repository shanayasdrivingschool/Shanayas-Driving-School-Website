# SEO Studio blog dashboard and publishing workflow

The blog workspace is a separate portal at `/seo/blogs`. It is intentionally absent from the business admin navigation and has its own login at `/seo/login`.

## What it includes

- CMS records protected by a dedicated `seo_users` role and Supabase row-level security. Business administrators may also enter the SEO portal, but SEO users cannot enter the business admin or read its tables.
- Draft, review, approval, scheduling, archive, readiness, and publication-reporting states.
- Structured content blocks for paragraphs, H2-H6 headings, lists, quotations, and callouts.
- Cover-image upload support through the `blog-media` Supabase Storage bucket, including alt text, caption, and credit fields.
- SEO title, meta description, canonical path, robots, and Open Graph fields with previews.
- Generated `BlogPosting`/`Article`, `FAQPage`, and `BreadcrumbList` JSON-LD previews.
- Visible FAQ editing and private editorial annotations.
- The project editorial brief, authorship, real-review record, maintenance trigger, readiness, and publication state.
- Validation for slugs, heading hierarchy, metadata, image alt text, FAQ consistency, required review, and scheduling.
- Automatic database snapshots before each update or deletion.
- A generated import of all 19 articles in the current code-authored inventory. Each keeps its existing slug, metadata, article body, links, lists, tables, FAQs, author and reviewer attribution where present.
- A protected published snapshot for imported articles. Opening a current article creates an editable draft state; saving it does not replace the preserved public version.
- A private draft preview inside SEO Studio, protected by the SEO route guard and clearly labelled as non-public.
- Stable-URL protection: the slug of an imported current article is locked in both the interface and database trigger. Current articles also cannot be deleted through the blog-editor policy; they can be revised without losing the preserved version.
- An explicit Publish/Republish action. It is available only after the article is Approved, marked Ready, has no validation errors, has a cover image, and has no unresolved annotations.
- A separate `public_blog_posts` table containing only public snapshots. Draft briefs, private annotations, account ids, and unsaved revisions are never exposed to anonymous readers.
- Public blog rendering that merges published CMS snapshots over the code-authored fallback inventory. A republished existing slug replaces its public version; a newly published slug appears on the blog index and route without overwriting source files.
- Runtime SEO metadata, schema, FAQs, related posts, and heading navigation for CMS publications.
- Static-build integration: the production generator loads the public snapshots, pre-renders new or updated articles, and reconciles blog entries in the built sitemap.
- A public `blog-sitemap` Edge Function for immediate sitemap discovery between static deployments.

## Publication boundary

Saving and sending for review never changes the public article. Publish copies the reviewed working record into an immutable public snapshot, updates the live public table, and retains the previous version in `blog_post_revisions`. Later edits again remain private until Republish is confirmed. The public renderer falls back to the code-authored inventory if the publication API is temporarily unavailable.

The Scheduled workflow value records editorial intent but does not publish automatically yet. Use the explicit Publish action after review. Static HTML and the primary sitemap are refreshed by the next site deployment; the public page and the Edge Function blog sitemap read the new snapshot immediately.

## Database setup

Apply the four `2026100801...` through `2026100804...` migrations to the intended Supabase project before using the screen. They create the blog tables, revision history, media bucket, dedicated SEO role, blog-only access policies, current-article import, public snapshots, and guarded publish function.

The current-article migration is generated from `activeBlogPosts` by `scripts/generate-blog-cms-import.mjs`. Regenerate it only when intentionally refreshing the pre-launch import snapshot:

```bash
node scripts/generate-blog-cms-import.mjs
```

The generated migration uses `on conflict (slug) do nothing`, so it cannot silently overwrite a CMS article that already has the same stable URL.

For a linked Supabase CLI project, the command is:

```bash
supabase db push
```

That changes the connected Supabase project, so confirm the linked project before running it.

Deploy the public blog sitemap function once:

```bash
supabase functions deploy blog-sitemap --no-verify-jwt
```

`public/robots.txt` already advertises that endpoint alongside the primary sitemap.

## Granting access to an SEO team member

First create the person's account in Supabase Authentication. Then use the Supabase SQL editor to grant only SEO access:

```sql
insert into public.seo_users (user_id, email, full_name)
select id, email, 'SEO team member'
from auth.users
where email = 'person@example.com'
on conflict (user_id) do update
set email = excluded.email,
    full_name = excluded.full_name,
    status = 'active';
```

Do not add that person to `admin_users`. Their account will be able to use `/seo/blogs` and `blog-media`, but row-level security will continue to deny access to invoices, orders, leads, affiliates, commissions, payouts, and other business-admin records.

## Remaining enhancements

1. Add revision browsing and one-click restoration in the editor.
2. Add automatic scheduled publishing with a server-side scheduler.
3. Optionally trigger the static deployment workflow immediately after Publish instead of waiting for the next deployment.
