# Victoria transit strike travel update — November 24, 2026

## Brief and scope

- Reader: Greater Victoria and Westshore residents, including students who take transit to a driving lesson or appointment.
- Question: What does the announced November 27 bus suspension cover, and how should I plan my journey?
- Location: Victoria Regional Transit System, with Langford/Westshore relevance and interregional exceptions.
- Outcome: Distinguish the affected service from exceptions, check official alerts, and confirm an outbound and return travel plan.
- Article: `src/data/victoriaTransitStrikePost.tsx`; `/blog/victoria-transit-strike-november-27-2026/`.
- Inventory/overlap: Inspected the September 5 article audit as historical context, current source and merged public CMS inventory (23 active posts). No existing transit strike article found. November 2–6 roadwork coverage serves a different dated event; retain it.
- Original contribution: A whole-journey/transfer check and five-step backup plan, with a short lesson/appointment coordination section. No invented traffic, taxi-price, appointment-cancellation or school-service claims.
- Responsible organization/byline: Shanaya's Driving School. No named author, instructor reviewer or external endorsement claimed.
- Review required: Editorial/source and rendering checks. This is a transit announcement and logistical planning article, with no practical driving instruction, licence interpretation, or insurance advice requiring subject review.
- Business context: COMPANY_KNOWLEDGE.md and existing contact route inspected. No new price, pickup guarantee, promotion or credential claims.
- Evidence gap: The dynamic alerts page requires JavaScript and its live individual alerts were not verified through web text retrieval. The dated November 20 official announcements were opened and read; targeted searches found no superseding cancellation. The article directs readers to check alerts and does not claim to be a live feed.
- Next step: Publish after technical checks under the user's explicit instruction to post the blog.
- Maintenance: Recheck official announcements November 26 and before travel on November 27; update the article if the action changes, and check restoration on November 28. These are editorial reminders, not an automated schedule.

## Claim log

Checked November 24, 2026. Event dates below are local British Columbia dates.

| Claim | Inspected source | Evidence/effective date and treatment |
| --- | --- | --- |
| Planned suspension, service exceptions and restoration date | https://www.bctransit.com/unifor-local-333-to-commence-strike-action-on-friday-november-27-2026-11-20/ | November 20 notice concerning November 27–28. Paraphrased with exceptions and conditional travel recheck; no blanket “no buses” claim. |
| Union announcement, membership, contract expiry and arbitration position | https://www.unifor.org/news/all-news/victoria-transit-workers-walk-job-november-27-bc-transit-refuses-arbitration | November 20 statement. Bargaining assertions expressly attributed to the union; employer position separately attributed. No quotations copied. |
| Current travel-update destination | https://alerts.bctransit.com/victoria/ | Official link from the BC Transit notice; JS shell observed, not a verified current trip feed. |
| School contact destination | `/contact`; COMPANY_KNOWLEDGE.md | Existing route. Ask to discuss individual bookings; no promised availability or policy exception. |
| Visual | `public/blog/victoria-transit-strike-november-27-2026.webp` | Original text/calendar artwork made for the article. No third-party photo, transit logo, or representation of an actual event. |

The supplied social screenshot is a research lead, not publication evidence or an image reused in the article. Its arbitration wording is attributed rather than adopted as the school's own finding. The article explains exceptions missing from the screenshot.

## Verification and publication

- Current state: **live confirmed**, November 24, 2026: https://www.shanayasdrivingschool.com/blog/victoria-transit-strike-november-27-2026/.
- Page quality: **Ready** for this dated announcement. Official source checking, metadata and mobile/desktop rendering checks passed; no instructor review is claimed or required for the logistical scope.
- Intent satisfaction: **Ready**. The article answers the service-scope question early, names exceptions and offers a whole-trip planning checklist.
- Source files are the maintained article; this note does not duplicate a separate Markdown article body.

Validation: targeted ESLint passed; all 114 tests in 17 files passed. Production build generated 93 routes and 24 blog posts. Chromium at 390 and 1440px confirmed the article heading, canonical, title, publication schema, exceptions, contact link, blog-index card and loaded cover image; no horizontal overflow or JavaScript errors. Mobile article and desktop listing were visually inspected. The original cover was adjusted to match the listing aspect ratio. Evidence is in `tmp/transit-blog-20261124/`.

Publication verification: published through the existing `public_html` deployment branch, release `048d6ce4` (build/source commit `d49ef505`). After host propagation, the canonical article HTML, blog index, sitemap, cover image, main JavaScript and CSS all matched the local build byte-for-byte. The article and its sitemap entry were present without a cache-busting query. See `tmp/transit-blog-20261124/live-results.json`. No indexing or ranking claim, social-media post, instructor review or automated monitoring is implied.

## Expanded news update and generated cover — November 24, 2026

Owner requested more detail, confirmed-news framing, tables/images and an optimised generated cover. Retained the same article URL and actual publication date. Reopened the November 20 employer and union statements and searched for a superseding announcement; no cancellation was established by the inspected sources. The article confirms the announcement, not a future outcome.

Additional source inspected: https://www.bctransit.com/bc-transit-advising-customers-of-rolling-strikes-as-early-as-november-17-2026-11-16/ (November 16, 2026). It supports the distinction between staged job action and the dated one-day announcement, office access/fare-product effects, and missing local connections beyond interregional drop-off points. Picket locations come from the November 20 employer notice. Union claims remain expressly attributed. No claim that tests, schools or other appointments are cancelled.

Changes: a service-status table with semantic headers and caption, picket/office-access detail, a short announcement timeline, expanded trip coordination guidance, and a primary-source list. The table contains text rather than an image and fits narrow screens. The generated cover appears in the body and blog listings, with three responsive WebP sizes, explicit dimensions, lazy loading and descriptive AI-image alt text. Social metadata uses the same descriptive alt. Other posts retain their existing image fallbacks. Generation prompt, provenance, file paths and measured sizes are in `VICTORIA_TRANSIT_COVER_PROMPT.md`.

Expansion status: **implemented locally**; prior live verification above covers the original shorter version only. Page quality: **Ready** for the dated news scope. Intent satisfaction: **Ready**: the service table, source attribution, timeline and whole-trip checklist answer the central reader need. Targeted ESLint passed; 114 tests in 17 files passed; the production build generated 93 routes and 24 posts. Chromium checks at 320, 390, 768 and 1440px found no horizontal overflow or JavaScript errors, confirmed responsive image selection, semantic table headers, metadata, article schema, contact route and blog listing. Mobile table/cover and desktop listing screenshots were visually inspected. Evidence: `tmp/transit-blog-expanded-20261124/`. Expanded-version live verification remains pending deployment. Editorial scope remains transit news and trip logistics; no driving-instruction or licence-eligibility review is claimed.
