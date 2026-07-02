# On-Page SEO — Findings

**Scope:** 38 pre-rendered HTML pages (deployed `public_html/`), verified against live site.
**Category score: 88/100** — one of the strongest areas of the site.

## What works
- **Unique, intent-matched title tags on all 38 pages.** Location + service + brand pattern, e.g. `Beginner Driving Lessons in Victoria, BC | Shanaya's Driving School`. Lengths are within display limits.
- **Unique meta descriptions on all 38 pages** (range 76–154 chars). No duplication, all action/benefit oriented.
- **Exactly one `<h1>` per page** (verified across all pages).
- **Self-referencing canonical on every page**, all pointing to the correct `https://www.drivingschoolbc.ca/...` trailing-slash URL.
- **`robots` meta = `index, follow` on every page** — no accidental noindex.
- **hreflang present** (`en-ca` + `x-default`) — appropriate for a single-language BC business.
- **Complete Open Graph + Twitter Card** tags (title, description, url, image, image:alt, `summary_large_image`).
- **Clean URL structure** — lowercase, hyphenated, logical hierarchy (`/courses/*`, `/packages/*`), trailing-slash consistent.

## Findings

| # | Title | Severity | Evidence | Fix |
|---|-------|----------|----------|-----|
| 1 | Title/URL mismatch on seniors course | Low | `/courses/seniors-driving-course/` has `<title>Enhanced Road Assessment \| ...`. Slug says "seniors driving course", title says "Enhanced Road Assessment" — keyword/intent split. | Align title with the target query, e.g. `Seniors Driving Course & Enhanced Road Assessment (ERA) in Victoria, BC \| ...`. |
| 2 | A few meta descriptions too short | Low | `winter-driving-course` 76, `make-your-own-class` 79, `mock-test-evaluation` 82, `lesson-road-test-prep-course` 86 chars — leaving ~50+ chars of SERP real estate unused. | Expand to ~120–155 chars with location + benefit. |
| 3 | Two pages orphaned from sitemap | Medium | `/courses/lesson-road-test-prep-course/` and `/courses/make-your-own-class/` are pre-rendered and internally linkable but absent from `sitemap.xml` (36 URLs vs 38 pages). | Add both to the sitemap, or intentionally `noindex` if they are not meant to rank. |
| 4 | Internal linking depends on JS render | Medium | The static HTML fallback exposes only ~7 nav links; the full header/footer/related-links mesh is client-rendered. Non-JS crawlers see a shallow link graph. | Ensure the static fallback (and/or SSR) includes the primary nav + footer links so the crawlable link graph matches the rendered one. (See technical.md / geo.md for the root SPA-rendering issue.) |
| 5 | Titles omit brand-differentiating modifiers on course pages | Low | Course titles are generic (`Parking Course \| Shanaya's Driving School`) with no location. Course pages could capture "…in Victoria/Langford" long-tail. | Add city modifier to high-value course titles where length allows. |

## Quick wins
- Add the 2 orphan course pages to `sitemap.xml`.
- Expand the 4 short meta descriptions.
- Fix the seniors-course title/keyword alignment.
