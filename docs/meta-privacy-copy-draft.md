# Meta measurement disclosure: draft and working notes

Prepared 2026-10-18. **Draft only — not inserted into the public policy or forms.** The integration remains disabled. The wording below describes the planned enabled integration and must be reconciled with the business's actual consent, retention and withdrawal arrangements before use.

## Focused brief

- Reader/question: prospective students in Victoria/B.C.; what enquiry information would be shared with Meta and why?
- Outcome/scope: explain measurement and lead-stage feedback in plain language, alongside the existing privacy policy and the relevant form.
- Overlap: update `/policies/privacy-policy`, rather than create another public policy. The article audit is a dated September 5 snapshot and does not establish live policy coverage.
- Original contribution: name the actual recipient, fields and uses in the implemented conversion integration. No testimonials, student outcomes or licensing claims are involved.
- Responsible organisation: Shanaya's Driving School. Business confirmation of the actual practices and appropriate privacy review remain outstanding. No reviewer or review date is claimed.
- Next step: confirm the measurement permission/withdrawal model, minor/guardian handling, retention and any international processing details; then align policy, forms and technical controls before activation.
- Maintenance: recheck at activation, whenever the recipient/data/uses change, or when the consent and retention model changes. No scheduled task was created.

## Findings in the current local policy

`src/data/policies.ts` has an October 6, 2026 effective date for the privacy policy. `COMPANY_KNOWLEDGE.md` and the older Meta plan still mention March 16, 2026; these summaries are not the current implemented date.

The policy lists technical data, website analytics and referral tracking, but does not explicitly identify Meta, contact matching, enquiry-stage reporting or advertising optimisation. Its Disclosure section limits disclosure to listed necessary purposes; a new Meta paragraph must be reconciled with that sentence. Its general voluntary-provision/continued-use language is not evidence that a particular person's data-sharing permission has been obtained. Existing marketing-contact checkboxes are not used by this implementation as proof of measurement consent.

This is a focused local review of the affected sections, not a full legal or live-page review.

## Proposed policy subsection for the enabled service

### Advertising measurement with Meta

We use Meta's advertising measurement tools to understand which advertisements lead to enquiries and bookings and to improve our advertising. For these purposes, we may share enquiry and booking-stage information, event identifiers and timestamps, and available browser or ad-click identifiers with Meta. For website enquiries, this may include the enquiry page address, IP address and browser information.

We convert email addresses and telephone numbers into hashed matching values before sending them through our server integration. Meta uses these values to match events to its users; hashing does not make this matching anonymous. For enquiries submitted through a Facebook or Instagram Instant Form, we may also use the Meta lead identifier to report later enquiry stages.

Our server integration does not send driving-assessment answers, dates of birth, licence details, hiring applications or payment-card details to Meta. You can contact us at book@drivingschoolbc.ca with questions about this use of your information.

## Proposed nearby website-form notice

When advertising measurement is enabled, Shanaya's Driving School may share hashed email or telephone matching values and enquiry-stage and browser information with Meta to measure and improve advertising. Read our Privacy Policy for the details.

Link “Privacy Policy” to `/policies/privacy-policy`. This notice is explanatory copy, not a substitute for deciding and implementing the appropriate permission mechanism. It must appear before submission if used; it has not been inserted into any form.

## Proposed Meta Instant Form disclosure

Shanaya's Driving School uses the contact information you submit to respond to your enquiry. We may also share hashed contact matching values, the Meta lead identifier and later enquiry stages with Meta to measure and improve our advertising. Read our Privacy Policy for more information or contact book@drivingschoolbc.ca with questions.

Use the confirmed canonical policy URL in Meta's required policy link field. Any consent choice must be separate from a promise to receive marketing messages and must match the implemented data-sharing controls. The actual Meta form has not been inspected or changed.

## Evidence log

| Claim or decision | Inspected evidence | Checked / applicable date | Gap |
| --- | --- | --- | --- |
| Current policy coverage and effective date | `src/data/policies.ts`, privacy policy: Uses, Consent, Disclosure, Tracking, Retention, Children and Contact sections | Checked 2026-10-18; source effective date October 6, 2026 | Live publication not inspected; company summary date differs |
| Planned fields, hashing and exclusions | `supabase/functions/_shared/metaConversions.ts`, enqueue migration, frontend tracking helper and worker | Checked 2026-10-18; local implementation only | Real deployment/Meta payload not verified; independent GTM tags not inspected |
| Permission model needs a specific review | [B.C. PIPA](https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/03063_01), Parts 3–6 and sections 34–35 | Checked 2026-10-18; page states current to October 6, 2026 | Application to this school's implementation, minors and actual permission records not assessed by a qualified reviewer |
| Contact mailbox | `COMPANY_KNOWLEDGE.md`, recorded owner instruction dated August 24, 2026; existing policy contact section | Inspected 2026-10-18 | No fresh deliverability test performed |
| Matching is supported by Meta identifiers rather than anonymous aggregation | [Meta's Parameter Builder](https://github.com/facebook/capi-param-builder/blob/main/nodejs/README.md) and the local payload builder | Checked 2026-10-18 | Meta Business Tools Terms page redirected to login; exact current terms not inspected |

## Handoff status

- Page quality: **Draft awaiting evidence/review**. Accurate to the planned local server payload; actual business practices, permission/withdrawal model, minor/guardian treatment, third-party processing and retention require confirmation. Existing policy wording must be reconciled.
- Intent satisfaction: **Draft awaiting evidence/review**. The proposed paragraphs explain recipient, purpose and fields, but cannot yet explain an approved consent/withdrawal process.
- Publication state: **draft only**, this file inspected 2026-10-18. Public policy, effective dates and form text were not changed. No mobile rendering or live-link check was performed for this draft.
