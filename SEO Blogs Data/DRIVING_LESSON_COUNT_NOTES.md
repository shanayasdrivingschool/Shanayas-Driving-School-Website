# Driving lesson count article: editorial record

## Brief

- Reader: Learners and parents planning paid instruction before a Class 7 road test in Victoria, British Columbia.
- Target question: How many driving lessons do you need before a Victoria driving test?
- Title: How Many Driving Lessons Do You Need Before a Victoria Driving Test?
- Proposed route: `/blog/how-many-driving-lessons-before-victoria-driving-test/`.
- Outcome: Understand the difference between lesson count, instruction hours and supervised practice; choose a next step based on current skills and access to practice.
- Scope: Lesson planning for the first passenger-vehicle road test. Experienced-driver and retest examples do not determine individual licensing eligibility. No commercial-licence guidance or prediction of a pass.
- Overlap: Link to the existing cost article for pricing and the existing Victoria road-test guides for detailed preparation. Keep this article focused on how to plan instruction.
- Original contribution: A learner-situation comparison, lesson-duration arithmetic, questions to request a meaningful assessment and a simple progress-based booking plan. Numerical examples are calculations, not observed averages or recommended lesson totals.
- Responsible organization: Shanaya’s Driving School. No individual author or instructor review is claimed.
- Next step: Contact the school with experience, practice access and test timing to discuss suitable instruction; confirm availability directly.
- Review needed: Qualified instructor review of the learner-planning recommendations and readiness discussion before publication, under CONTENT_RULES.md section 2.
- Maintenance: Recheck ICBC Class 7 preparation guidance, practice recommendations, linked services and City of Victoria speed-limit information before publication and when those sources change. Do not apply this article to Class 5 transition eligibility.

## Evidence inspected September 6, 2026

| Claim and location | Source or record | Supporting evidence and conditions | Gaps or handling |
| --- | --- | --- | --- |
| No universal paid lesson count in the published Class 7 preparation guidance; opening and requirements section | [ICBC: Get your N](https://www.icbc.com/driver-licensing/new-drivers/Get-your-N) | Page and downloaded public HTML inspected. The embedded page content recommends practice with a qualified supervisor and says to consider a training course; it lists learner-stage conditions without a fixed paid-lesson total. | Describe the published guidance precisely; do not claim a legal opinion or extend this to commercial training or individual restrictions. |
| At least 60 hours of practice; practice-hours section | [Learn to Drive Smart, chapter 9](https://www.icbc.com/assets/en/40I9m5k2Tqnf7aNs5kqPHj/drivers9.pdf), printed p. 139 | Recommends at least 60 practice hours while preparing for Class 7. This is practice guidance, not 60 purchased lessons. | Avoid importing other time-sensitive licensing details from the manual. |
| Approved course hours differ from a universal lesson requirement | [ICBC: New drivers or riders](https://www.icbc.com/driver-licensing/driver-training/New-drivers-or-riders) | Distinguishes in-car lessons from approved GLP courses; approved courses include at least 16 classroom hours, 12 on-road hours and four flexible hours. | No claim that Shanaya’s offers an approved GLP course; no course-benefit or time-reduction claim. |
| Competencies discussed with an instructor | [ICBC: Road Test Skills Explainer](https://www.icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf) | Observation, space margin, speed, steering and communication; specific feedback can be grouped by these areas. | Discussion guide is editorial synthesis and still needs qualified instructor review. No invented pass mark. |
| Local speed changes | [City of Victoria: Lower Speed Limits](https://www.victoria.ca/getting-around/driving/lower-speed-limits) | Local-street reductions completed December 2025; most major streets moving to 40 km/h in 2026, with exceptions. | Scope to the City of Victoria; do not claim rollout completed or identify an official test route. |
| Test-route confidentiality | [ICBC: Book a road test](https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test) | ICBC says it does not make its test routes available externally. | Preparation examples are not route predictions. |
| Written lesson details and school selection | [ICBC: Choosing your driving school](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school) | Recommends checking school/instructor licensing and requesting written service and policy details, including hours and fees. | No ICBC endorsement claim. |
| Lesson-duration examples | Original arithmetic | Five × 60 minutes = five hours; five × 90 minutes = 7.5 hours; ten × 90 minutes = 15 hours. | Illustrative quantities only, not readiness estimates or school package quotations. |
| Contact and related content | COMPANY_KNOWLEDGE.md, src/App.tsx, src/data/blogPosts.tsx | Existing contact route, phone and related article destinations. | No new pricing, discount, pickup or availability promises. |
| Short quotation about professional instruction | [Learn to Drive Smart, chapter 9](https://www.icbc.com/assets/en/40I9m5k2Tqnf7aNs5kqPHj/drivers9.pdf#page=1), printed p. 135 | Exact 13-word quotation inspected in the official manual. | Visible source attribution links to the relevant PDF page. |
| Short quotation about the potential value of one or two lessons | [ICBC road-test tips, July 21, 2022](https://www.icbc.com/about-icbc/newsroom/2022-jul-21) | Exact 14-word quotation from the first tip, inspected September 6, 2026. | Historical source date shown; adjacent text explains that this is not a two-lesson preparation promise for beginners. |
| Learner quotation about a clear plan | [Supplied reviews](reviews.md), Harriet’s review; existing `googleReviewsUrl` in `src/data/beginnerCourseLanding.ts` | Exact 12-word excerpt from the end of the review, with an ellipsis marking omitted text. | Linked to the school’s Google reviews, not presented as an individual-review permalink or a freshly verified live review. Individual experience is distinguished from promised results; no review schema added. |

## Status

**Draft awaiting evidence/review — qualified instructor review remains outstanding.** Article implementation is complete locally. Instructor review has not occurred, and no named reviewer is shown. Publication dates in local article metadata are provisional until deployment; set the actual first-publication date when publishing. No deployment or review reminder has been scheduled.

## Implementation and checks

- Website source: [drivingLessonCountPost.tsx](../src/data/drivingLessonCountPost.tsx). Registered in the blog data, static SEO generator and sitemap; the blog index includes the new entry.
- Reader copy: [HOW_MANY_DRIVING_LESSONS_VICTORIA.md](HOW_MANY_DRIVING_LESSONS_VICTORIA.md), exported from the article body. Keep this review copy in sync if the website source changes.
- Revised to 1,353 words including the title, organization byline, headings, table caption, quotation attributions and all FAQs. Markdown syntax and destination URLs are excluded from this reader-facing count. Nine H2 headings, two supporting H3 headings and three accessible FAQ dropdowns remain. The existing article template provides the H1 and table of contents.
- Search title: `How Many Driving Lessons Before a Victoria Road Test?` (53 characters).
- Meta description: `Plan driving lessons before your Victoria, BC road test. Understand ICBC’s practice guidance, lesson lengths and how to assess your readiness.` (142 characters).
- Production build passed, including the generator’s metadata and sitemap consistency checks: 67 routes and nine blog posts pre-rendered. Existing bundle-size and Browserslist-data warnings remain.
- ESLint passed for the new article and blog registry. All 11 existing author/attribution tests passed.
- Static HTML checks passed for title, description, canonical URL, BlogPosting headline and organization attribution, and matching visible/structured FAQ answers. No reviewer is claimed.
- All six unique in-body internal destinations returned HTTP 200 locally with generated page content. External sources were opened and inspected during research; the legacy Tuning Up PDF URL failed, so the article links to ICBC’s working guide landing page.
- Chrome checks at 1440, 390 and 320 pixels found no page-wide horizontal overflow or JavaScript runtime errors. The comparison table scrolls in its own container on mobile; FAQ expansion works. Desktop and mobile screenshots were visually inspected.
- Page quality: scoped and sourced official claims, original planning examples and three short attributed quotations. No invented lesson averages, pass guarantees, credentials, testimonials or author review. Qualified instructor review remains needed for the planning/readiness synthesis.
- Intent satisfaction: answers the lesson-count question directly, explains the 60-hour recommendation and instruction-time arithmetic, and gives readers a concrete way to discuss and revise a lesson plan. Pricing and detailed test preparation are linked as separate topics.

## Engagement revision, September 6, 2026

Reworked the opening around the reader’s budget and lesson-package dilemma, shortened repetitive explanations and FAQs, and made the headings and closing invitation more conversational. Added three brief quotations distributed across the article, each with a visible clickable attribution. The Markdown review copy was regenerated from the website content. The user’s under-1,500-word limit includes all article text, including quotations and FAQs.

Revision validation: production build and article ESLint passed. Generated HTML includes all three quotations with clickable attributions, and FAQ structured data matches the revised visible answers. Chrome checks passed again at 1440, 390 and 320 pixels with no horizontal page overflow or runtime errors; the quotation styling was visually inspected on mobile. Existing author tests were not rerun for this copy-only revision. Instructor review and deployment remain outstanding.

## Contextual links revision, September 6, 2026

Added contextual links to beginner driving lessons, the Road Test Prep Course and Mock Test Evaluation, alongside the existing cost guide, preparation guide and contact links. Added an explicit “Read our Google reviews” link next to the learner quotation using the existing school Google Maps review URL. Internal links stay within the website; Google reviews open in a new tab with noopener/noreferrer. No new availability, pricing or official test-route claims were added.

Both article copies are synchronized at 1,353 words, including title, byline, headings, captions and FAQs. Production build and article ESLint passed. All six internal destinations have generated HTML and returned HTTP 200 in the local preview; the Google review URL and anchor were checked against the existing shared value. The unchanged layout was not re-reviewed for this link edit.
