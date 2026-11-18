# Health, illness prevention and fitness-to-drive policy

Prepared: November 19, 2026. Responsible organization: Shanaya's Driving School.

## Brief and scope

- Readers: students, guardians, instructors and staff in Greater Victoria, B.C. Question: when illness or impairment affects a lesson, what happens to safety, rescheduling, fees, accommodation and health information? Outcome: accessible policy text and contact path.
- Existing cancellation and safety policies overlap but do not answer the illness exception. This page adds the supplied SDS-HS-002 v1.1 text, plus readable navigation, relevant public-source links and contact links. Source PDF is preserved.
- Owner instructed that this policy be added like the live safety policy, with April 1, 2026 as its effective date. This is the adoption/date record; the source PDF remains marked draft. No legal, instructor or operational review was supplied or inferred.
- Source schedules A/B are displayed as acknowledgement text. Blank signatures, the internal incident log and legal reference notes are not public forms.
- Original source clause 19.4 said the policy took effect on formal approval; it now states the owner-confirmed effective date. Clause 7.6 identifies the B.C. Motor Vehicle Act Regulations accurately instead of calling them an ICBC regulation. All other numbered clauses are transcribed with whitespace normalization only.
- Recheck annually and on material changes to applicable law, public-health guidance or school procedures. No review date has been fabricated.

## Claim and conflict log

| Claim | Inspected evidence | Checked / effective | Remaining gap |
| --- | --- | --- | --- |
| School rules for fitness, symptoms, privacy, cancellations, accommodation and review | `docs/Shanayas_Driving_School_Health_Illness_Policy_DRAFT.pdf`, sections 1–19 | 2026-11-19 / owner-directed 2026-04-01 | Owner adoption/date instruction does not independently verify implementation or legal review |
| One sudden short-notice illness reschedule ordinarily without extra fee | PDF clause 7.2; existing `src/data/policies.ts` sections 4, 9 and 10 | 2026-11-19 / 2026-04-01 | Existing cancellation page was clarified to show the exception; operational handling remains unverified |
| 48 hours after suspected norovirus symptoms stop | https://www.bccdc.ca/health-info/diseases-conditions/norovirus | 2026-11-19 / current source page | Source context applies to norovirus; not all gastrointestinal illness |
| Respiratory return threshold | PDF clause 4.2 labels 24 hours fever-free as a school standard; https://www.bccdc.ca/health-info/diseases-conditions/covid-19/if-you-have-covid-19 supports staying home until improving and fever-free | 2026-11-19 / school date 2026-04-01 | No claim that 24 hours is universal ICBC guidance |
| Written fee/refund disclosure | https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/26_58_08#section27.06 | 2026-11-19 / consolidated text current 2026-11-10 | Operational delivery still unverified |
| Employee sick-note limitation | https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96113_01#section49.2 and https://www2.gov.bc.ca/gov/content/employment-business/employment-standards-advice/employment-standards/forms-resources/igm/esr-part-7-02-section-45-034 | 2026-11-19 / subject to current Act and regulation | No case-specific employment determination |

## Readiness

- Page quality: **Draft awaiting evidence/review** for legal and operational review and qualified instructor review of fitness/safe-stop instructions; none was claimed.
- Intent satisfaction: **Ready** for reading the owner-adopted illness policy and its cancellation exception, subject to final rendered/link checks.
- Publication state: **implemented locally** as of November 19, 2026, pending deployment and live verification.

## Release verification, November 19, 2026

- Isolated release from source commit `f93ef998` kept unrelated workspace edits out of the build.
- Ten test files passed (44 tests). Production build generated 78 routes and 307 files, added only the health-policy page, and removed no existing content pages. Targeted lint and diff checks passed.
- Production preview passed mobile (390 × 844) and desktop (1440 × 1000) browser checks: 22 sections, readable title/date, reachable contents, no horizontal overflow, cancellation exception and no runtime errors. Mobile rendering was visually inspected.
- Published source/build commit `1f1c8a53` and deployment branch commit `675b5166` to origin.
- **Publication state: live confirmed** at https://www.shanayasdrivingschool.com/policies/health-and-illness-policy/ on November 19, 2026. Checked the live HTML for April 1, 2026, all 70 numbered clauses and the acknowledgements; the live policy index links it and the cancellation page shows the illness exception. The newly created directory URL briefly served the site's fallback page during propagation, then returned the correct page on repeated direct retrieval.
- Intent satisfaction: **Ready** for the reader seeking the live school policy and exception. Page-quality status remains **Draft awaiting evidence/review** for legal, instructor and operational review that was not evidenced; deployment does not establish those reviews.
