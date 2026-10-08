# SEO Studio blog dashboard

The first-phase blog workspace is a separate portal at `/seo/blogs`. It is intentionally absent from the business admin navigation and has its own login at `/seo/login`.

## What this phase includes

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

## Safety boundary

The dashboard does **not** publish in this phase. Blog records are SEO-role protected, the public blog still reads its existing code-authored inventory, and no dashboard action changes the sitemap or triggers deployment. The UI states this boundary beside every editor. Imported articles retain a `published_snapshot`; draft saves update the working copy only.

## Database setup

Apply the three `2026100801...`, `2026100802...`, and `2026100803...` migrations to the intended Supabase project before using the screen. They create the blog tables, revision history, media bucket, dedicated SEO role, blog-only access policies, and current-article import.

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

## Next implementation phase

The remaining publishing phase should:

1. Render approved CMS blocks on the public blog while preserving the current code-authored posts.
2. Add revision browsing and restoration.
3. Add explicit pre-publication approval and a server-side publish operation.
4. Update sitemap/static output and trigger the existing deployment pipeline only after approval.
5. Switch the public renderer from the preserved code-authored version to the approved CMS publication snapshot only after parity checks pass.
