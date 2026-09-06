# Driving lesson costs article: editorial record

- Title: How Much Do Driving Lessons Cost in Victoria, BC in 2026?
- Route: `/blog/driving-lessons-cost-victoria-bc-2026/`
- Reader: Victoria learners and parents comparing lesson prices and planning spending.
- Purpose: Show why tailored instruction can be worth the investment, make the hourly price and current discount easy to find, and help the reader choose a suitable next step.
- Scope: A pricing and purchasing guide. The existing `/pricing/` page remains the catalogue entry point. This article does not teach driving manoeuvres or determine licensing eligibility.
- Responsible organization: Shanaya’s Driving School. No named author or subject reviewer is claimed.
- Original contribution: A value-focused explanation, verified review excerpts, standard-versus-discounted budget examples, purchasing guidance and five decision-focused FAQs.
- Next step: Call the school about current discounts and free-trial availability, or send a lesson enquiry.

## Evidence checked September 6, 2026

| Claim | Evidence | Handling |
| --- | --- | --- |
| $89 CAD per hour | Owner’s explicit instruction in this conversation; corroborated by [live pricing](https://www.shanayasdrivingschool.com/pricing/) | Stated naturally in the first cost section after the value explanation; scoped to Shanaya’s, not a citywide average |
| Current 30% promotion; April 2026 offer up to 50%; later 40% promotion; monthly/festival promotions and free trials | Owner’s explicit instructions in this conversation | Current and historical offers are distinguished; readers must call to confirm eligibility, dates, availability and final price |
| Base prices exclude GST | [Live school FAQ](https://www.shanayasdrivingschool.com/faq/), pricing and `src/data/siteFaqs.ts` | Before-GST wording appears adjacent to every calculated amount; no tax-inclusive total or tax-rate claim |
| Lesson-time vehicle/instructor and pickup inclusions | [Live school FAQ](https://www.shanayasdrivingschool.com/faq/) and `src/data/siteFaqs.ts` | Described with service-area and scheduling conditions |
| Discounted lesson budgets | Original arithmetic: $89 × 70%, then × 1, 5 and 10 hours | Clearly illustrative and conditional on the 30% promotion applying to every selected hour; not presented as package quotes or required lesson counts |
| Separate lesson, bundle and test-related costs | Live pricing and FAQ; local course catalogue | Links to current offerings; no copied temporary promotion, competitor rate or package-price guarantee |
| School-selection checks | [ICBC: choosing your driving school](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school), inspected licensing and written-services guidance | One source-linked paragraph; no claim of ICBC endorsement |
| Cancellation and package conditions | Existing policy route and live FAQ | Links to full terms without restating time thresholds, which differ in some existing summaries |
| Student experience and value | Exact excerpts from Vanessa Nicdao and Divya Pandya in `reviews.md`, linked to the school’s Google reviews page | Review wording is unchanged and identified as individual experience; no review or aggregate-rating schema is added |

## Maintenance and publication

Recheck the article when the hourly rate, current 30% promotion, free-trial availability, GST treatment, lesson duration or inclusions change, and before presenting it as a later-year pricing guide. No reminders have been scheduled. The metadata records September 5, 2026 as the intended publication date and September 6 as the substantive revision date; revise the publication date if deployment occurs later.

The article is implemented locally. Deployment is a separate action; the historical article audit remains an accurate snapshot of the site before this addition.

## Validation

- Rendered article content: approximately **1,395 words including all five FAQ answers**; the browser reports 1,163 words while collapsed answers are hidden.
- Production build passed, including metadata consistency and sitemap coverage checks; nine blog posts are now pre-rendered locally.
- Author tests: **11 passed**. Updated the attribution check to honour the already-supported organization byline without inventing a named author.
- ESLint passed for the new article, blog registry, attribution tests and article template.
- Verified static article HTML, canonical URL, persuasive search description, social metadata, `BlogPosting`, `BreadcrumbList`, `LocalBusiness` and matching FAQ structured data, organization author, absence of a claimed reviewer, blog-index link and sitemap entry.
- The FAQ markup is generated from the same five answers shown in the accessible `<details>` dropdowns. Google removed FAQ rich results from Search in May 2026, so this implementation does not promise a visible FAQ snippet.
- Review and aggregate-rating schema are deliberately omitted because these are the school’s own reviews displayed on the school’s website; Google excludes self-serving `LocalBusiness` and `Organization` review markup from review rich results.
- Chrome preview checked at 1440, 390 and 320 pixels. The revised opening was rechecked at 390 pixels: the value hook and first section appear before the first price mention, with no horizontal page overflow or JavaScript errors. The budget table scrolls inside its own container.
- All five unique in-article internal destinations and both external ICBC resources returned HTTP 200. No JavaScript runtime errors occurred.
- Page quality: clear offer conditions, exact review excerpts, original budget calculations, authoritative external resources and no unsupported personal attribution. Intent satisfaction: direct price and discount answer, a concrete value case, social proof and prominent phone/enquiry actions.
- Status: **Ready locally; not deployed to the live website.**
