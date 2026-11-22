# New Road Test Confidence offer — 2026-11-23

- Added `/lp/road-test-confidence/` using the shared paid landing layout, callback popup, reviews, car carousel and multi-item gallery. Existing seven routes and ad-group mappings remain unchanged. The new page compares the supplied $1,999 / $2,599 CAD + GST packages, makes the initial/conditional hours visible and carries package selection into callback notes.
- Copy, claim log, business-rule questions and verification: [Road Test Confidence notes](ROAD_TEST_CONFIDENCE_NOTES.md). Removed Afterpay from this offer after checking Stripe’s Canadian transaction limit; financing remains conditional. No checkout product or purchase flow created.
- Targeted lint, 19 landing tests, build/static metadata checks and four responsive browser checks passed. Publication: **implemented locally**, not pushed/deployed. Page quality: **Draft awaiting evidence/review** for material programme conditions; intent satisfaction: **Ready** for comparison and enquiry, with purchase eligibility still requiring confirmation.

---

# Shared landing-page release — live confirmed 2026-11-23

- Published the approved universal changes to all seven `/lp/` routes: `driving-lessons-victoria`, `driving-school-near-me`, `driving-lesson-prices`, `icbc-road-test-preparation`, `beginner-driving-lessons`, `nervous-driver-lessons`, and `icbc-driving-lessons`; the legacy `/beginner-driving-lessons-victoria/` alias shares the same implementation.
- Includes the callback popup (required name/phone/email, optional notes, requested success message and call option), removal of the instructor placeholder, twelve-review swipe carousel, two-photo car carousel, responsive multi-item photo/video gallery, compressed/lazy media and landing-page performance changes.
- Source commit `0b110fa7`; committed build `7389f875` on `main`; deployment commit `16073c87` on `public_html`. Both branches were pushed successfully. Built in an isolated checkout to exclude unrelated service/branch-page changes in the shared working tree. No content pages were removed; retired files were fingerprinted JS/CSS bundles. No CRM/customer CSVs or unrelated drafts were committed.
- Validation: full suite passed (84 tests across 14 files); production build generated 89 static routes. Sixteen release-browser checks passed locally, then the same sixteen passed on `https://www.shanayasdrivingschool.com` at 390px and 1440px: all seven pages plus alias, popup fields, no initial inline form, removed instructor placeholder, review/car carousel navigation, responsive end gallery, deferred video source and no page overflow. The live road-test HTML referenced the exact release entry bundle. External analytics/CRM requests were blocked during browser QA and no form was submitted. Submission/success handling was covered by mocked tests; this was not a new production CRM-delivery test.
- Google Ads campaign settings were not accessed or modified; this release verifies the repository's seven paid landing destinations and legacy alias, not every ad/keyword Final URL in the account.
- Limited-release page quality and intent satisfaction: **Ready** for consistent shared behaviour across these landing pages. Publication state: **live confirmed**, inspected 2026-11-23. Earlier broader conversion recommendations and factual/subject-review limitations still apply.

---

# Multi-item gallery layout correction — 2026-11-23

- Owner requested multiple gallery items visible together. Updated the shared `LandingMediaGallery.tsx` to show both photos and the video side by side at desktop widths (1024px+), two items on tablets (640–1023px), and one item plus a preview of the next on phones. Individual media cards replace the large single-image frame; full photo framing remains intact.
- Carousel arrows/selectors remain where scrolling is available and disappear when all three items fit. Selectors use the actual number of carousel views. Video keyboard access and pause behaviour now follow whether the video is visible, rather than whether its index equals the selected view. Tap-to-play loading, native controls, original assets and all other page content remain unchanged.
- Checks: targeted ESLint, all 16 landing tests, production build and 89-route generation passed. Chromium checks covered all seven pages at 320, 390, 768 and 1440px (28 combinations), verifying visible-item counts, the mobile preview, arrows/selectors/keyboard and no overflow. Focused checks verified mobile touch swipes and deferred video loading, playback and pausing at all four widths. Desktop and phone screenshots were visually inspected. No external requests or production submissions were made.
- Limited-edit page quality: **Ready**. Intent satisfaction: **Ready** for the requested multi-item layout. Publication: **implemented locally**, inspected 2026-11-23. Source and `public_html` rebuilt; not pushed or deployed. Earlier broader review limitations remain unchanged.

---

# Owner-supplied end-of-page photo/video gallery — 2026-11-23

- Added `LandingMediaGallery.tsx` to the shared paid landing template after the FAQs/service areas and before the final callback CTA. All seven landing routes and the legacy beginner alias share it. The existing two-photo car gallery remains separate.
- Owner-selected sources: `WhatsApp Image 2026-07-14 at 21.34.35 (7).jpeg`, `WhatsApp Image 2026-07-14 at 21.34.35 (8).jpeg`, and `WhatsApp Video 2026-07-14 at 21.34.35.mp4`. Evidence/authorization: explicit owner request in this conversation, inspected 2026-11-23. Both photos and extracted video frames were visually inspected. Originals remain unchanged; filename dates are not asserted as verified capture dates. Neutral heading and alt text describe visible content without identifying people or asserting lesson/test outcomes. No new service, price, credential or review claims were added.
- Added content-hashed WebP photo variants in `public/gallery/`, responsive sources based on the contained image size, explicit dimensions, lazy loading and asynchronous decoding. The two source JPEGs total 687,348 bytes; combined 480px copies total 76,998 bytes (about 89% smaller), and combined 960px copies total 297,608 bytes. Full portrait/landscape framing is preserved without cropping people.
- Video: 6.625 seconds, 1024 × 576 H.264 with original AAC audio. Retained the 1,192,393-byte source because the trial re-encode was larger; no video-size reduction is claimed. The 49,430-byte WebP poster loads separately. The MP4 source is assigned only after pressing Play, with native controls, inline playback and no autoplay. Playback pauses when changing slides, leaving the gallery viewport or hiding the browser tab. Audio was not transcribed; no captions or full media accessibility certification are claimed.
- Navigation includes touch swiping, mouse dragging, visible previous/next arrows, three item selectors, a live counter and keyboard arrows. Button navigation respects reduced motion. Native video seek/control interactions remain separate from carousel gestures.
- Validation: targeted ESLint, 16 landing tests, production build and generation of 89 static routes passed. Real Chromium checks passed on all seven routes at 320, 390, 768 and 1440 pixels (28 combinations): placement before the final CTA, image loading, arrows/selectors/keyboard and no horizontal page overflow. Focused checks at all four widths verified actual touch swipe/mouse drag, no MP4 requests before Play, actual playback, native controls, keyboard handling and pause when leaving the slide or gallery. Mobile and desktop screenshots were visually inspected. External traffic was blocked during QA; no production lead was submitted. Earlier Lighthouse scores were not rerun and do not establish this revision's score.
- Limited-edit page quality: **Ready**. Intent satisfaction: **Ready** for the requested end-of-page gallery. Publication state: **implemented locally**, inspected 2026-11-23; source and `public_html` build updated, no push or deployment performed. Earlier broader CRO findings and factual-review limitations remain unchanged.

---

# Owner-supplied training-car gallery — 2026-11-23

- Replaced the vehicle placeholder in the shared landing-page template with two owner-selected photographs: `WhatsApp Image 2026-07-14 at 21.34.35 (6).jpeg` (parked close-up, first) and `WhatsApp Image 2026-07-14 at 21.34.35 (5).jpeg` (street view, second). Authorization/source: the owner's explicit request in this conversation on 2026-11-23. Both originals were visually inspected and remain unchanged. The filename date is not asserted as a verified capture date.
- `VehicleGallery.tsx` uses the existing Embla dependency for touch swiping and mouse dragging, with visible previous/next arrows, two photo selectors, a live photo counter, keyboard arrows, accessible labels and reduced-motion support for button navigation. No automatic advance. The gallery fills the existing right column on desktop and stacks below the text on mobile; the instructor tile remains removed.
- Added content-hashed WebP copies at 480, 960 and 1280 pixels in `public/vehicles/`, with responsive sources, explicit dimensions, lazy loading and asynchronous decoding. Total source JPEG size: 750,552 bytes; combined 480px variants: 68,862 bytes; combined 960px variants: 288,360 bytes; combined 1280px variants: 486,348 bytes. Original photographic content is retained; the display uses a consistent 16:9 frame. Exported copies omit EXIF metadata. Alt text describes the pictured branded car and setting without adding credential or test-result claims.
- Checks: targeted lint, all 16 landing tests, production build and 89-route static generation passed. Real-browser checks passed on all seven routes at 320, 390, 768 and 1440 pixels (28 combinations): both images load, arrow endpoint states, photo selectors, keyboard, actual touch swipes, mouse dragging and no horizontal page overflow. Desktop images and mobile framing were visually inspected. External traffic was blocked during QA. The legacy beginner alias shares the same component.
- Limited-edit page quality: **Ready**. Intent satisfaction: **Ready** for the two-photo swipeable gallery. Publication state: **implemented locally**, inspected 2026-11-23; no push or deployment performed. Earlier conversion recommendations and broader factual-review limitations remain unchanged.

---

# Conversion-focused review — 2026-11-23

- Scope: inspected all seven local built landing pages at 390 × 844 and 1440 × 844, including package-triggered callback dialogs. This was a recommendation review; no production UI, offers or form fields were changed. Existing callback popup, call alternative and swiping requirements are retained. No current Google Ads/GA4 conversion report or live deployment was inspected, so proposed improvements are hypotheses, not measured drop-offs or promised conversion lifts.
- Evidence: browser inventory/screenshots in `tmp/landing-redesign/conversion-review.json` and `cro-*`; shared `PaidLandingPage.tsx`, `PaidLandingReviews.tsx`, landing configuration, existing analytics event definitions, prior project conversion plan and company/editorial guidance. Existing Google snapshot `google-reviews-2026-11-23.json` was inspected for relevant learner accounts; raw saved reviews were preserved. No new rating refresh was performed in this review.
- Observed: at 390px, the pricing section starts 1,266px down on the price/road-test/general/near-me/ICBC pages, 1,292px on beginner and 1,275px on confidence. The review section occupies 733px ahead of pricing. Three stacked price cards occupy about 1,805–2,007px. At 1440px, pricing starts 1,374–1,426px down. Three desktop hero proof points are hidden on mobile. All seven pages show the same first review (Amy Christy), independent of search intent.
- Observed: package “Check Availability” buttons open the page-generic callback dialog. The clicked product ID appears in the CTA tracking location, but is not retained in the form heading or lead submission; only the page-level goal is sent. The page does not display a live availability calendar. Name, telephone and email are required; notes are optional. The modal settles to full opacity after its opening animation; a mid-animation screenshot was not treated as a rendering fault.
- Highest-priority recommendations: put the relevant price/offer immediately after the hero (especially on the prices page), retaining a compact rating near the hero and the swipe carousel further down; preserve the selected package in the callback dialog and CRM lead; describe clearly that the callback is free and no payment is required; show one concise mobile trust line instead of hiding all hero proof points.
- Additional recommendations: prioritise relevant verified review excerpts by audience (Amy/Yogita for anxiety, Alfred for a first lesson, Danica for test preparation), while retaining attribution and individual-outcome limits; simplify mobile package cards and identify which need each option serves without unsupported popularity badges; use a compact offer summary in the desktop hero's empty space without reinstating an inline form; remove the remaining vehicle-icon placeholder tile until an approved authentic photo is available; keep “No pass guarantees” in relevant explanatory/FAQ copy rather than as a checkmarked hero selling point. Keep material price and availability conditions readable beside their offer.
- Intent-specific recommendations: prices—price/duration/tax information first; road test—distinguish practice, mock evaluation and test-day vehicle service; beginner—explain the first lesson and compare one lesson versus the beginner course; nervous/returning drivers—show the available single-lesson option before larger commitments and foreground calm-teaching reviews; near-me—make the service-area answer prominent without promising pickup for an unconfirmed address.
- Measurement recommendation: keep existing landing/CTA/form-start/saved-lead/call-click events; add anonymous validation/submission-error and package-context diagnostics, then reconcile qualified enquiries and paid bookings with the CRM. Do not treat phone-link clicks as completed calls or saved leads as paid customers. Confirm actual Google Ads conversion configuration before changing bidding goals. Test one major change at a time against cost per qualified enquiry and paid booking, with submission rate as a diagnostic; historical 23-click figures in the previous plan are not a current baseline.
- External sources inspected 2026-11-23: [Google Ads landing-page guidance](https://support.google.com/google-ads/answer/6238826?hl=en) supports matching the offer to ad/search intent; [mobile guidance](https://support.google.com/google-ads/answer/7323900) supports accessible information and fewer form steps; [lead-quality guidance](https://support.google.com/google-ads/answer/13489421?hl=en) supports connecting lead stages to meaningful business outcomes. No numerical conversion-uplift claim is made.
- Limited-review page quality: **Needs revision** for offer hierarchy and product-context clarity. Intent satisfaction: **Needs revision**, especially for visitors explicitly seeking prices. Recommendations are review-ready; current publication state remains **implemented locally / live publication unverified**. This is not a full-page factual or subject-matter review.

---

# Landing-page asset and responsive optimization — 2026-11-23

- Scope: all seven paid landing routes and the legacy beginner alias. No review quotations, business claims, prices, callback fields or conversion events were changed in this optimization.
- Compressed the twelve displayed reviewer avatars from the existing Google snapshot into local, content-hashed WebP assets at 44px and 64px (the originals are only 64px, so no enlargement). Total originals: 36,900 bytes; 44px variants: 11,274 bytes; 64px variants: 13,400 bytes — 69.4% and 63.7% smaller respectively. `src/data/reviewImages.ts` maps review IDs to responsive `srcset` assets. Explicit dimensions, lazy loading, asynchronous decoding and initial fallbacks remain. Source attribution/review links and the original snapshot remain intact. Enlarged side-by-side comparisons and real displayed avatars were visually inspected.
- Added a local variable-weight Inter font for landing pages, with Latin and other Unicode subsets, `font-display: swap`, and a preload for the 48,256-byte Latin subset. Source: `@fontsource-variable/inter` 5.3.0; SIL Open Font License copied to `public/fonts/Inter-OFL.txt`. The static generator removes the Google Fonts stylesheet/preconnects only on paid landing routes and their alias. Other pages retain their existing font loading. Font/image filenames carry content hashes for safe cache invalidation. Added Apache text-response compression and font caching in `public/.htaccess`; actual host support remains unverified until deployment.
- Deferred the homepage, blog SEO data, header search catalogue and CRM submission client until their respective route or interaction needs them. Landing metadata still comes from the existing configuration; blog article metadata/schema remains verified. Search results load on typing and ignore stale query results. The callback continues to submit through the real lead serializer with error/retry handling. No added runtime dependency or package-lock change.
- Local initial first-party JavaScript decoded size fell from 1,441,891 to 932,868 bytes (35.3%). This compares the recorded local request samples, not production transfer or field speed. Removing the unnecessary blog query also avoids an initial Supabase connection on the landing pages.
- Landing pages now use native 100% root text sizing and no inherited 1.1 page zoom. This preserves 16px form text and 44px carousel controls, with readable mobile text and the existing safe-area-aware callback bar. Call labels do not wrap. Darkened the service-area footnote after the contrast audit found 4.47:1 against its light-grey card.
- Validation: 18 targeted tests and targeted ESLint passed; production build completed and generated 89 static routes. Forty built route/viewport checks covered all seven pages plus the alias at 320, 390, 768, 1440 and 1920 pixels: loaded local fonts/photos, no initial blog/CRM chunks, correct control/field sizes, modal bounds and no horizontal overflow. Another 28 carousel checks covered arrows, dots, keyboard, touch swiping, mouse dragging and vertical scrolling. Twenty-one callback checks plus a mocked HTTP submission verified email/notes serialization, confirmation, call link, retained state and a single conversion. Home/blog/landing/policy navigation, blog schema, deferred header search and the error page were checked. No production lead or analytics event was sent.
- Final Lighthouse audits on the generated road-test landing page scored **100 performance / 100 accessibility / 100 best practices** for both mobile and desktop. Simulated LCP: 0.9s for both; total blocking time: 60ms mobile, 50ms desktop; CLS: 0. The audits used local Chromium and blocked analytics/CRM hosts; these are not live-site scores or a full accessibility certification. Results and audit scope are saved in `landing-optimization-2026-11-23.json`.
- Local optimized preview: `http://127.0.0.1:4173/lp/icbc-road-test-preparation/`. The trailing slash matters: Vite preview otherwise serves the generic SPA entry instead of the generated route HTML. Production Apache directory handling has not been rechecked in this local task. Mobile/desktop hero and review screenshots were visually inspected.
- Limited-edit page quality and intent satisfaction: **Ready** for the requested asset and responsive optimization. Publication state: **implemented locally**, inspected 2026-11-23; no deployment performed. Existing full-page editorial/subject-review limitations remain outside this focused change.

---

# Swipeable Google review carousel and fresh snapshot — 2026-11-23

This focused revision supersedes the static review columns and historical aggregate described below.

- Replaced the three static reviews with a shared carousel on all seven paid landing pages and the legacy beginner alias. Twelve selected recent five-star written reviews appear newest first, with one/two/three visible on phone/tablet/desktop. Touch swiping, mouse dragging, visible Previous/Next buttons, position dots, a group counter and keyboard arrow navigation are available. No automatic advance. Button/dot navigation respects reduced motion; vertical page scrolling remains available over the slides.
- Kept the owner-requested “5-Star Rated by Learners” headline and adjacent selection/individual-experience wording. Reviewer names, photos with initials as fallback, actual publication month and direct Google review links accompany the excerpts. The overall Google score is shown separately as **4.9/5 from 52 reviews**, checked **November 23, 2026** (Asia/Karachi).
- Current evidence: [Google listing](https://www.google.com/maps/search/?api=1&query=Shanaya%27s%20Driving%20School&query_place_id=ChIJg34iCrwNj1QRFmLDm1jOkPg), fetched through [Apify run](https://console.apify.com/actors/Xb8osYTtOjlsgI6k9/runs/1GCI4laxaa2qTYJ9s), [dataset](https://console.apify.com/storage/datasets/6FfejNVslHpp11QGE). Matched name, 2770 Leigh Rd #124, Langford address, place ID and CID to the existing school listing. Raw scraper UTC timestamp begins 2026-11-22T22:26:06.709Z, which is November 23 in the task timezone. Run succeeded, 52 records returned; actual reported charge US$0.03125.
- Raw evidence saved without changing review text or owner replies in `google-reviews-2026-11-23.json`. It includes 50 five-star, one four-star and one one-star review, including rating-only records. The saved `SEO Blogs Data/reviews.md` is unchanged. The fetched aggregate comes from the listing’s `totalScore`/`reviewsCount`, not a newly calculated score.
- Claim/excerpt log: `src/data/googleReviews.ts` maps each public excerpt to its exact reviewer, Google review ID, source URL and publication timestamp; the raw JSON holds full surrounding customer text separately from owner replies. All twelve displayed excerpts were checked as verbatim substrings of the fetched customer text (HTML line breaks decoded); the shortened Salma excerpt marks its cut with an ellipsis. No owner reply was used as testimony. Selected names: Amy Christy, Enoch Teye mensah, Dallas Leck, Komal Rash, SHUBAM SHARMA, Tesamae Padon, Grace Wahl, Salma Baid, Danica Rabosa, Lovejeet Multani, Kayley L and Carls Jr. Nicole’s conditional account and test-pass assertions were not selected for brief carousel excerpts. Teaching/confidence excerpts do not claim typical outcomes, credentials or current trial availability. All lower ratings remain in the complete source, with a public link to all Google reviews.
- Existing Yogita, Alexis, Alfred and Vanessa excerpts retained in configuration were also checked against the newly fetched customer text. No pricing, service, credential or safety claim was newly verified in this focused review update.
- Validation: all 10 landing-page tests passed, targeted ESLint passed, production build passed and generated 89 static routes. Real Chromium checks passed for all seven routes at 320, 390, 768 and 1440 pixels (28 combinations): actual slide movement using arrows/dots/keyboard, correct responsive grouping, endpoint button state, rating/date, direct review URLs and no horizontal page overflow. Actual touch gestures at 320/390 and mouse dragging at 1440 worked; vertical touch scrolling remained available. Desktop/mobile carousel screenshots were visually inspected. The built preview at port 4173 also passed animated carousel navigation and callback-dialog open/required-fields/close checks. All external traffic was blocked during local browser QA; no live lead or analytics request was sent.
- Limited-edit page quality: **Ready**. Intent satisfaction: **Ready** for review navigation and a fresh Google review snapshot. Publication state: **implemented locally**, inspected 2026-11-23; deployment not performed. This is a saved snapshot, not an automatic live review feed. Refresh from the source when maintaining reviews; it does not establish a new full-page factual or subject review.

---

# Review layout and instructor-tile edit — 2026-11-23

- Removed the instructor placeholder tile from all seven shared landing pages. The instructional text and existing vehicle tile remain; the vehicle tile is centred at a compact width.
- Review heading is now “5-Star Rated by Learners”, per owner instruction. The adjacent sentence explicitly identifies these as selected five-star Google review excerpts, not a claim that the school’s aggregate score is 5.0. Only records with `stars === 5` are displayed. The separate historically dated 4.9/40 aggregate is unchanged.
- Replaced filled review cards with open columns, thin dividers, larger quotation text, reviewer names, existing Google profile images with initial fallbacks, and direct review links. Reviews stack with horizontal dividers on mobile. No quotation text or reviewer attribution changed.
- Evidence inspected: existing `paidLandingTestimonialsById` configuration and its saved `googleReviews.ts` records from the 2026-10-14 snapshot, plus the quotation checks recorded below. This task did not perform a new live rating or review-count check.
- Verification: targeted ESLint and production build passed; 89 static routes generated. Browser checks passed for all seven pages at 390 and 1440 pixels (14 checks): heading, three five-star review excerpts, avatar failure fallbacks, removed instructor tile and no horizontal overflow. Desktop/mobile review screenshots and the remaining vehicle section were visually inspected. External requests were blocked during QA.
- Limited-edit page quality: **Ready**. Intent satisfaction: **Ready** for the requested layout and headline edit. This is not a new full-page factual or instructor review. Publication state: **implemented locally**, inspected 2026-11-23; no deployment performed.

---

# Callback popup correction — 2026-11-23

This focused revision supersedes the inline-form design and response-time limitation below.

- Owner instruction in this conversation: show a Request a Callback button and a call button; open the form only on request; collect name, phone, email and optional notes; after submission say the visitor will receive a call shortly and provide a call button.
- Implemented in the shared `PaidLandingPage.tsx` template for all seven paid pages and the legacy beginner alias. The hero has no inline form. Header, hero, pricing, final and mobile callback buttons open the same accessible Radix dialog.
- Three fields are required: full name, phone number and email address. Notes are optional. Preferred callback time was removed. Email and notes use the existing lead-service fields; no schema change. Conversion tracking records that email was provided without including personal values.
- The same form state and lead ID survive closing/reopening, failed requests and pending submissions. Success remains visible on reopening and cannot be submitted again during the same page session. Keyboard focus returns to the button that opened the popup. Dialog height is bounded by the dynamic viewport and scrolls on smaller screens; the mobile CTA bar is hidden while it is open.
- Success copy: “Thank you! You’ll receive a call shortly. If you’d prefer to speak to us now, use the call button below.” Evidence: explicit owner direction received 2026-11-23. This supersedes the earlier instruction to avoid a response-time promise; no exact number of minutes is invented.
- Static fallback now explains that Request a Callback opens the enquiry form. Existing pricing, reviews, credentials and other public claims were not revised in this focused change.
- Validation: targeted lint and all 10 landing tests passed; production build and 89-route static generation passed. Browser checks passed for all seven routes at 320, 390 and 1440 pixels: no inline form, correct required/optional fields, visible hero actions, dialog bounds, preserved inputs, Escape/close, and hidden mobile bar while the popup is open. A separate 390 × 450 check passed for scrolling, keyboard focus containment and restoration to the opening button. The real lead serializer was exercised against a mocked HTTP success with captcha stubbed: email/notes payload, single successful conversion and success call link verified. No production lead or analytics request was sent. Screenshots inspected for desktop hero, mobile form and success state. Limited-edit page quality and intent satisfaction: **Ready** for this interaction and owner-supplied copy; this does not constitute a new full-page factual or instructor review. Publication state: **implemented locally**, 2026-11-23; no deployment performed.

---

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
