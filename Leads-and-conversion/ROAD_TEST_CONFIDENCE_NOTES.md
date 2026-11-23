# Owner clarifications incorporated — November 23, 2026

This update supersedes the earlier unresolved licence-class, expiry, unsuccessful-test and preparation-duration notes below. Source: the owner's explicit reply during the landing-page implementation task, checked November 23, 2026.

- Road Test Confidence covers Class 5 and Class 7 road-test preparation.
- There is no package expiry date. Conditional extra support still ends on passing or after the fourth covered attempt, consistent with the supplied schedule.
- An unsuccessful test means the student fails an ICBC road test. The next included lesson block follows that result within the existing limit; no no-show or cancelled appointment is represented as a failed test.
- The separate $250 CAD + GST Road Test Package includes one hour of preparation plus the test-day car. This does not change either Confidence package's price or allowance. Updated the shared catalogue, landing offer/FAQs, road-test variant and conflicting general FAQ.
- Test-centre and vehicle availability remain subject to confirmation. Written programme-specific purchase/refund and any lesson-completion conditions are not defined by this clarification; they remain questions to resolve before a purchase is accepted, not invented public terms.
- Owner confirmed that Confidence prices should remain in the package section, without a hero price summary. Preserve that exception to the general hero-rate change.

Publication of these clarifications: **implemented locally**. No deployment in this task. The earlier audit confirmed the previous offer page live; that does not establish publication of these edits. See `IMPLEMENTATION_NOTES.md` for final shared validation.

---

# Road Test Confidence landing page — working brief

Date: 2026-11-23. Responsible organization: Shanaya’s Driving School.

## Brief

- Reader: Greater Victoria learners and parents considering structured road-test preparation with defined support if another test attempt is needed.
- Question/outcome: What do the $1,999 and $2,599 packages include, when do additional lessons become available, and which option includes the test-day car? Enable an informed callback enquiry.
- Route/title: `/lp/road-test-confidence/`; Road Test Confidence Packages in Victoria.
- Scope/overlap: distinct conditional-support offer, not a duplicate of ordinary `/lp/icbc-road-test-preparation/` lessons or the existing $250 test-day package. Retain existing packages and prices.
- Original contribution: side-by-side inclusion comparison, visible initial/conditional hour split, 10 + 5 + 3 + 2 progression, package-specific callback context, concise FAQs. Shared review and media components retained.
- Evidence: owner-supplied attachment `c9ed6155-a6cb-4490-839e-76e2e2f0fc44/Pasted text.txt`, inspected 2026-11-23. Business context/catalogue/policies and prior landing implementation notes inspected; no existing offer with these names/prices found. Historical article audit inspected as a dated planning snapshot.
- Required review/gaps: owner definition of qualifying attempts, eligible licence classes/test centres, expiry, required lesson completion before covered tests, and programme-specific cancellation/refund handling. Asked while proceeding with independent implementation. No practical driving instruction is being added; no instructor review is claimed.
- Next step: callback, then clarify eligibility, scheduling and written terms before payment. No checkout product or purchase commitment created.
- Maintenance: recheck when owner terms, price, financing availability or coverage change; check conditions before publication. Existing Google aggregate remains explicitly dated November 23, 2026; no new review refresh in this task.

## Claim log

| Claim | Inspected evidence | Checked / effective | Limits |
| --- | --- | --- | --- |
| $1,999 / $2,599 + GST; CAD; initial 10 × 90 minutes | Owner attachment; Canadian business context | 2026-11-23; supplied for this offer, no separate effective date | Not substituted for existing catalogue products; no discount or all-in price claim |
| 5, then 3, then 2 additional 90-minute lessons after successive unsuccessful qualifying tests | Owner attachment | 2026-11-23 | Conditional, stops on passing or after fourth covered attempt; eligibility/expiry details unresolved |
| 15 initial + 15 conditional = up to 30 hours | Arithmetic from supplied schedule: (10+5+3+2) × 1.5 | 2026-11-23 | Never describes 30 hours as unconditional or as a typical readiness requirement |
| Plus includes school vehicle for up to four covered tests; base excludes test-day vehicle | Owner attachment | 2026-11-23 | Conditional repeat uses, scheduling/area rules; no ICBC fees included |
| Road tests booked with ICBC and testing fees separate | ICBC Book a road test, https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test | 2026-11-23 | No fee amount, wait period or eligibility rule invented |
| Financing may be available, eligibility and terms vary | Owner attachment; existing payment-intent supports Klarna/Afterpay; Stripe provider documentation inspected | 2026-11-23 | Existing standalone payment-plan page describes a different schedule; do not import that schedule, promise approval, quote instalment amounts or assume live payment-method activation |
| Reviews and school photos | Existing shared components, saved reviews and prior documented 2026-11-23 Google snapshot | Historical verification reused | Not claimed as testimonials from this new programme; no new identities/results asserted |

Initial publication state: implemented locally when built; no deployment requested for this new offer. Editorial status pending material programme conditions above.

## Financing correction from primary-source review

- Inspected Stripe’s [Afterpay documentation](https://docs.stripe.com/payments/afterpay-clearpay) on 2026-11-23: Canada Pay in 4 range is CAD $1–$2,000. The Plus price exceeds this before tax; the base price exceeds it with the school’s GST charge. Removed the supplied Afterpay suggestion from this offer’s public copy rather than implying it is available for either full package payment. No split-payment workaround is proposed.
- Inspected [Klarna documentation](https://docs.stripe.com/payments/klarna) on 2026-11-23: Canadian instalment options depend on amount and eligibility. The page says “including Klarna where available,” with approval and terms qualifications, and uses enquiry rather than checkout. Merchant activation/current approval is not claimed. Klarna’s direct consumer help URL returned a robot/JavaScript gate and was not treated as inspected supporting content.

## Implemented copy and conversion review

- Built `/lp/road-test-confidence/` as an eighth paid landing configuration in the existing shared template. Existing seven campaign mappings remain unchanged; no Google Ads account changes were made and no ad group was invented for the new offer.
- Replaced the broad “one package, one price” line with a road-test-specific headline and visible starting price, because the source actually offers two packages. The hero shows 15 initial hours plus up to 15 conditional hours and identifies test-day car/ICBC-fee exclusions. No pass guarantee, guaranteed readiness or unconditional 30-hour entitlement is implied.
- Put the two-package comparison immediately after the hero for this offer, ahead of the full review carousel. Kept the shared callback/call controls, no inline form, review carousel, training-car carousel, photo/video gallery, FAQs, policy links and mobile action bar. Other paid pages retain their order.
- Retained one primary conversion action: callback. Package buttons pass the exact selected package into the popup and CRM enquiry note. No payment is collected, and no purchase or unavailable checkout product is implied. Successful submissions retain the requested “You’ll receive a call shortly” message and call link.
- Added the 10 + 5 + 3 + 2 lesson progression, including 15 / 7.5 / 4.5 / 3 hours, separate initial and conditional allowances, four-attempt cap and end-on-passing condition. The same offer data supplies UI and static HTML. Condensed the supplied FAQs into eight decision-focused answers without removing the important car/fee, first-pass, additional-training, financing and purchase-term qualifications.
- Existing school cancellation policies remain linked, without inventing new programme-specific refunds, forfeitures or expiry terms. No free assessment is promised by the callback button.
- Content records: `src/data/roadTestConfidence.ts`, new configuration in `src/data/paidLandingPages.ts`, and `src/components/RoadTestConfidenceOffer.tsx`. Existing shared review text is unchanged. No separate public Markdown draft is maintained.

## Verification and status — 2026-11-23

- Targeted ESLint passed. All 19 landing tests passed, including package-price/allowance consistency, original seven-page behaviour and selected-package serialization through a mocked submission/success flow.
- Production build passed and generated 92 routes in the current working tree (includes separate existing branch-page work). Confirmed the new static document contains both prices, the four-stage schedule, the correct canonical and noindex directive, and corrected financing copy.
- Real Chromium checks passed at 320, 390, 768 and 1440px: no initial form, two price cards before reviews, conditional copy, both package callback triggers, required name/phone/email and optional notes, bounded dialog, stage totals, review and car carousel navigation, gallery present with deferred MP4 source, and no horizontal overflow or page errors. Mobile hero/pricing and desktop hero/stage screenshots were visually inspected. External requests were blocked and no production lead was submitted.
- Page quality: **Draft awaiting evidence/review** for eligibility, expiry, qualifying-attempt and written purchase conditions. Intent satisfaction: **Ready** for comparing the supplied two offers and requesting a callback; complete purchase eligibility still depends on those business rules. No new instructor/subject review is claimed.
- Publication state: **implemented locally**, inspected 2026-11-23. Preview: `http://127.0.0.1:4173/lp/road-test-confidence/`. No push, deployment, live publication or Google Ads Final URL change performed for this new offer.

## Hero simplification — 2026-11-23
Owner requested removal of the pictured hero block. Removed the “Packages from $1,999” line, initial/conditional hours summary and “Compare the two packages” anchor from `src/pages/PaidLandingPage.tsx`. Package cards retain their prices and terms. No new factual claim introduced. Updated the existing callback test to check the price in the package section.

Focused verification: 26 landing-page tests passed; production preview rebuilt; browser checks at 390 and 1440px confirmed the block is absent, both package prices and hero callback remain, and there is no horizontal overflow. Page quality: **Ready** for this limited removal. Intent satisfaction: **Ready** for the requested hero simplification. Publication: **implemented locally**, preview `http://127.0.0.1:4177/lp/road-test-confidence/`; no live publication performed or verified.

## Package-section paragraph removal — 2026-11-23
Removed the owner-highlighted paragraph below the package cards, beginning “Start with 15 hours” and ending “before you enrol”, from `src/components/RoadTestConfidenceOffer.tsx`. This focused deletion introduces no claims; the package cards, staged support explanation and FAQs retain the underlying terms. Production preview rebuilt and checked at 390/1440px: paragraph absent, prices/callback present, no horizontal overflow. Page quality and intent satisfaction: **Ready** for this limited requested edit. Publication: **implemented locally**, not live confirmed.

## Instalment-panel emphasis — 2026-11-23
Made the existing payment-options section a contrasting navy panel with a larger white heading, more spacing and a prominent white callback button. Preserved the exact financing copy, provider conditions and `confidence-instalments` tracking action. UI/UX skill guidance applied for readable contrast and touch targets; no financial offer or claim changed. Build and targeted ESLint passed. Browser checks at 320/390/1440px confirmed no overflow, readable terms, a button at least 52px high, callback opening and the existing CTA event. Visually inspected mobile and desktop panel screenshots. Page quality/intent satisfaction: **Ready** for this scoped visual edit. Publication: **implemented locally**, not live confirmed; preview remains on port 4177.

## Remove “Your next step” — 2026-11-23
Removed the owner-highlighted heading, callback explanation and policy link below the retest stages in `RoadTestConfidenceOffer.tsx`. No new factual claims introduced. Source inspection and whitespace check passed; production preview rebuilt successfully. Page quality/intent satisfaction: **Ready** for this focused deletion. Publication: **implemented locally**, not live confirmed.
