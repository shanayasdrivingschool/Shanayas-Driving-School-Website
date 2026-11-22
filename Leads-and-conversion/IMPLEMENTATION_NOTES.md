# Callback landing-page redesign — 2026-11-23

## Scope and brief

- Reader and intent: paid-search visitors to the seven existing landing experiences; general lessons, nearby service, prices, road-test preparation, beginners, nervous/refresher drivers and Class 5/7 training.
- Location and outcome: Greater Victoria; request a free callback or call to discuss suitable lessons, availability and booking terms.
- Scope and overlap: apply the supplied eight-part layout to the shared template and legacy beginner alias. Retain distinct H1s, FAQs, ad-group mappings, routes, catalogue prices and functional course/booking destinations. No new organic articles or location pages.
- Original contribution: a three-field callback form, intent-matched comparison cards, three readable student-review excerpts, compact service-area information, accessible FAQ controls and a mobile callback bar that disappears while the form is visible.
- Responsibility: Shanaya’s Driving School. No author, instructor reviewer or new credential is asserted.
- Evidence gaps: current individual instructor credentials, authenticated instructor/vehicle photography, exact test-day preparation duration and supported test centres, current aggregate Google rating and callback response commitment are not independently established. User confirmed in this conversation that no additional data exists beyond the portal. Use existing catalogue and portal information, omit unsupported specifics and make no response-time promise.
- Maintenance: recheck catalogue prices/offers, credentials, pickup availability and rating before a new campaign launch and whenever business records change. No review or publication date is added to public pages.

## Claim log

| Claim / location | Source inspected | Evidence / conditions | Checked on / effective date | Remaining gap |
| --- | --- | --- | --- | --- |
| Prices, durations and product inclusions | `src/data/courseCatalog.ts`, `src/data/coursePricing.ts`; historical owner directions in `Leads-and-conversion/IMPLEMENTATION_NOTES.md` and `COMPANY_KNOWLEDGE.md` | Existing catalogue: preparation $133.50 / 90 minutes; mock evaluation $120 / 60 minutes or $150 / 90 minutes; test-day package $250 with separate $89 / 60-minute practice lessons. CAD before GST, standard-area prices. Cards calculate from existing catalogue. | Inspected 2026-11-23; underlying offer direction recorded 2026-10-14 | No new owner price verification. Preserve portal values as requested. The package has no documented fixed warm-up duration or test-centre coverage; confirm during enquiry. |
| Beginner catalogue discount | Same catalogue and historical offer direction | Catalogue calculation retains 30% discount and standard-area/non-combination conditions. No countdown or invented expiry. | Inspected 2026-11-23; historical instruction 2026-10-14 | Active campaign dates are not independently verified. |
| Review text and attribution | `SEO Blogs Data/reviews.md`, `src/data/googleReviews.ts`, `src/data/beginnerCourseLanding.ts` | Three reviews per page from existing configuration. Complete-sentence excerpts for Yogita Bang, Alexis Dumaresq, Alfred Taban and Vanessa Nicdao matched to saved customer text; retain real names and source links, distinguish Vanessa’s parent account, state individual-outcome limits. Raw snapshots unchanged. | Local inspection 2026-11-23 | Review URLs and aggregate not freshly checked against Google. |
| 4.9 / 40 reviews in hero | Existing `beginnerCourseLanding.ts` and October implementation notes | Display explicitly says checked October 14, 2026. Earlier raw snapshot’s 5.0 / 37 is superseded only by the dated October record, not treated as current verification. | Local inspection 2026-11-23; historical live check 2026-10-14 | No new live review count claimed. |
| ICBC credential terminology | https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school | Current page distinguishes licensing from recommendation/endorsement and advises checking each instructor’s licence. Its dynamically loaded directory entry was not available in retrieved page text. | Opened 2026-11-23 | Do not use the prompt’s “ICBC-certified” claim. Link to existing school-licensing page; no new individual credential assertion. |
| Supportive teaching, feedback, dual-control vehicle and service areas | Portal catalogue, `COMPANY_KNOWLEDGE.md`, `src/data/serviceLocations.ts`, existing paid configuration and saved customer accounts | Retain school’s recorded service descriptions; pickup and test-day coverage confirmed per enquiry. Keep the six existing Greater Victoria chips; near-me page retains wider listed areas. | Inspected 2026-11-23 | Portal records do not independently verify current vehicle equipment or instructor status. No new practical driving instructions, safety procedure or subject review supplied. |
| Free callback and contact details | User’s supplied redesign brief; portal company knowledge | Free telephone enquiry, two required contact fields and optional callback preference. Phone and email retained. Success confirms request receipt, not a booking; no response deadline. | 2026-11-23 instruction and inspection | No callback SLA supplied. |
| Instructor / vehicle photographs | Existing public assets and `COMPANY_KNOWLEDGE.md` caution about stock team imagery | No inspected image was established as an approved authentic instructor/vehicle photo. `paidLandingPhotos` has null slots and neutral icon fallbacks. | 2026-11-23 | Replace only with approved authentic photography. No public developer placeholder text. |

## Implementation and integration

- Section order: hero/form → three reviews → three intent-specific offers → instructor/vehicle → three steps → FAQ/service areas → final callback/call → footer.
- The form uses the existing `submitFreeTrialLead` service with `lesson_plan_request`, student-assessment storage, captcha and existing attribution. Callback time is stored in the existing `note` field, already exposed in notifications/admin payloads. No migration or change to existing lead-service work was needed.
- Existing `form_start`, `lead_submit`, `click_to_call`, `landing_view` and `assessment_cta_click` names are retained for configured tag-manager triggers. CTA payload labels now identify callbacks. Only successful stored leads emit `lead_submit`; phone and CTA clicks do not. No personal information is added to analytics payloads.
- Qualified-lead/paid-booking events and genuine phone-call tracking were not invented or inferred from clicks. Existing CRM/Meta work in this checkout was left intact. Live GA4/Google Ads, call-duration tracking, production CRM delivery and ad Final URLs remain unverified.
- Form state survives callback-button navigation and failures. In-flight submission lock and a stable lead ID guard rapid duplicate submissions/retries; the success state removes the submit action. Backend idempotency across page reloads is not newly implemented or claimed.
- Existing metadata/FAQ rendering uses the shared config. Build generation now creates all seven `/lp/` documents with `noindex, follow`, matching canonical URLs, callback copy and FAQs. The older beginner alias uses the paid beginner canonical. Paid pages remain outside organic sitemap/nav generation.
- Existing checkout/course pages and pricing rules are unchanged. Product details links continue to booking-capable course pages.

## Verification and readiness

- Targeted ESLint: passed for the five changed/new landing source and test files.
- Vitest: 9 tests passed across configuration and rendered callback behaviour. Covers all seven page structures, route/product/review references, intent-specific offers and prices, attribution and callback-note payloads, duplicate submission lock, successful conversion timing, failed-request/captcha handling, preserved fields and retry ID, CTA focus, and call-event separation. The lead service and captcha were mocked; this is not production CRM verification.
- Production build and postbuild: passed; 89 static routes generated, including all seven paid routes. Existing large-chunk warning remains.
- Browser QA: 28 page/viewport combinations (all seven pages at 320, 390, 768 and 1440 CSS pixels) passed: one visible H1, seven main sections plus footer, one callback form, no horizontal overflow, no runtime page errors, and noindex metadata. Road-test form-state preservation, sticky-bar return/hide behaviour and FAQ expansion passed at each viewport. Desktop and mobile screenshots inspected; final road-test, beginner and near-me captures are saved in `tmp/landing-redesign/`.
- Local links: all 17 unique internal destinations returned HTTP 200 and rendered the expected page heading. The legacy beginner alias also rendered the new form and canonical pointing to `/lp/beginner-driving-lessons/` (18 route checks total). Existing Google review/map links retained, not freshly verified externally.
- All browser QA blocked external traffic to avoid sending test leads or analytics to production. No live booking, call, lead delivery or advertising conversion was claimed.
- TypeScript project-wide check still reports existing errors in `blogHtml.ts`, `Cart.tsx`, `Index.tsx`, `PolicyDetail.tsx`, `ReferralTerms.tsx` and `SeoBlogs.tsx`; no errors were reported for the landing files. These unrelated issues are outside this edit.
- Source diff whitespace check passed. Research CSVs, raw reviews, catalogue prices and existing lead/CRM changes were preserved.

Publication state: **implemented locally**, inspected 2026-11-23; no deployment performed.

Page quality: **Draft awaiting evidence/review** — implementation can be completed and tested with portal data, but current credentials/vehicle claims, active promotional terms and any required instructor review are not newly verified. Authentic photos are unavailable; neutral fallbacks are used.

Intent satisfaction: **Ready** for the requested callback structure — all seven intents retain separate headlines, offers and FAQs, with responsive rendering and local navigation checked. This usability judgment does not override the separate evidence/review limitations above.

---

# Historical implementation record

The following October 14 record describes the prior assessment-based design. Its prices/source checks remain dated historical records; its layout, CTA and verification status do not describe the November callback redesign above.

# Paid landing page implementation notes

Checked and implemented locally on 2026-10-14.

## Scope and brief

- Reader: people arriving from the 12 paid-search ad groups documented in this folder.
- Main question: whether Shanaya's offers a lesson option that fits the visitor's goal, area, timing, and licence stage.
- Location: Greater Victoria, with the wider listed service area shown only on the local-intent page.
- Intended outcome: request a free 30-minute assessment or call the school; no payment or unconfirmed booking is represented as complete.
- Coverage: seven landing experiences map the 12 ad groups to distinct intent clusters. The previous beginner landing URL remains as an alias for the new beginner experience.
- Organic overlap: the pages use `/lp/` routes and `noindex, nofollow` metadata so they do not compete with maintained organic pages.
- Original contribution: intent-specific copy and fields, live catalogue-backed price cards, explicit offer terms, separate marketing consent, first-party attribution fields, and conversion events.
- Responsible organization: Shanaya's Driving School. No individual author or reviewer is asserted.
- Required review: the owner should re-confirm the current free-assessment campaign terms; an appropriately qualified instructor should review practical-driving statements if the pages are to be treated as fully reviewed content.
- Next step: configure the Google Ads Final URLs, confirm tag-manager triggers and CRM field handling in the live environment, and complete a production submission test using a clearly identified test lead.
- Suggested maintenance: re-check prices, offer terms, service areas, credentials, review excerpts, links, and tracking before launch and whenever the corresponding business record changes.

## Implemented changes

- Added seven data-driven `/lp/` pages for general lessons, near-me, price, road-test preparation, beginner, nervous-driver, and ICBC-intent traffic.
- Added a compact paid-traffic header and footer, above-the-fold lead form, trust strip, live price/package cards, benefits, booking steps, Google-review excerpts, service-area details, FAQs, final CTA, click-to-call actions, and a mobile sticky CTA.
- Added paid-attribution capture for `gclid`, UTM values, landing-page ID, and ad-group hints, together with landing-view, CTA-click, form-start, call-click, and server-confirmed lead-submit events.
- Kept the existing landing-page image and did not create, edit, or replace any picture.
- Reworked the existing beginner landing component as an alias to the shared implementation.
- Added route-aware SEO metadata and FAQ structured data while keeping paid landing pages out of search indexing.
- Extended the lead payload with goal, timing, area, licence class, road-test date, marketing-consent state, attribution, and a stable client lead ID.
- Updated the beginner-page comparison order on 2026-10-14 to show the Beginner's Driving Course first with a 30% limited-time offer, the Road Test Package second, and a custom-class selector third.
- Added an accessible five-class progress indicator and matching client/server checkout calculations that unlock 30% off five or more eligible custom 90-minute classes in one standard-area booking.
- Refreshed the beginner-page feedback section from the live Google listing, added reviewer profile photos with initial fallbacks, and linked each displayed excerpt to its corresponding full Google review.
- Condensed the hero lead form into four required fields across two desktop rows. Email, pickup area, licence class, road-test date, marketing consent, and the complete offer/privacy terms remain available in accessible collapsed sections.

## Claim and evidence log

| Public claim or content | Evidence inspected | Check date | Limitation or follow-up |
| --- | --- | --- | --- |
| School name, phone number, address, service areas, school and instructor licensing statements | `COMPANY_KNOWLEDGE.md` and its cited local business-record summaries | 2026-10-14 | Historical/source summaries were inspected locally; current external credential status was not independently re-verified in this task. |
| Course/package names, prices, durations, inclusions, and GST treatment | `src/data/coursePricing.ts`, `src/data/packageCatalog.ts`, and current product-page data | 2026-10-14 | Prices are rendered from the maintained catalogue. Availability and purchase-specific terms remain subject to confirmation. |
| Free 30-minute assessment with no package obligation | Existing beginner landing implementation, company knowledge, and the supplied conversion specifications | 2026-10-14 | Owner should confirm this remains the active offer before campaign launch. The page does not claim instant booking or guaranteed availability. |
| 30% off the Beginner's Driving Course and five-or-more custom classes | Owner instruction supplied in the working conversation | 2026-10-14 | Implemented as a limited-time offer for eligible standard-area bookings, before GST and not combined with another promotion. The owner should remove or revise the database discount and checkout rule when the offer ends. |
| Dual-control training vehicle and practical lesson descriptions | Company knowledge and existing maintained site content | 2026-10-14 | No new instructor review was recorded. Practical content remains pending appropriate subject review if required for publication readiness. |
| Student feedback, 4.9 rating, and 40-review count | Live Google Maps listing fetched with Apify run `NRsXZPDve12ls1cWy` (dataset `ajKEBPgsyAlN79RPv`); exact review URLs and public reviewer-photo URLs from the same result | 2026-10-14 | Displayed quotations are short, contiguous excerpts from individual reviews and link to the full Google text. Individual experiences do not promise the same result. The aggregate can change and should be re-checked before each campaign. |
| Privacy, cancellation, terms, contact, pricing, course, and package destinations | Local route definitions and linked application data | 2026-10-14 | Links were checked in the local build; production publication and live destinations remain unverified. |

The research and suggestion files in this folder were treated as planning inputs, not as independent proof of factual claims.

## Verification and status

- Targeted Vitest coverage for the paid landing configuration: passed locally.
- Targeted ESLint for changed source files: passed locally.
- Production build and static SEO generation: passed locally; 76 static routes were generated by the existing post-build process.
- Desktop and 390 x 844 mobile browser checks: completed locally for the beginner page, with responsive checks also covering local-intent and road-test variants. The mobile sticky CTA was checked both while the form was visible and after it left the viewport.
- TypeScript-only check: not clean because of pre-existing errors in unrelated files (`blogHtml.ts`, `Cart.tsx`, `Index.tsx`, `PolicyDetail.tsx`, `ReferralTerms.tsx`, and `SeoBlogs.tsx`). The production build and targeted checks did not report errors in the changed landing-page files.
- Existing page/hero pictures remain unchanged. Public reviewer profile photos were added later at the user's explicit request, with text-initial fallbacks if Google does not serve an image.

Page quality and intent satisfaction: **Needs revision** until the current offer/credential details and any required instructor review are confirmed. The local implementation answers each paid-search intent and avoids unsupported guarantees.

Publication state: **implemented locally**. Deployment, live analytics delivery, CRM receipt, and indexing state have not been claimed or verified.
