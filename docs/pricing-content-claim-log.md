# Pricing page claim log

Checked: October 8, 2026

| Public claim | Evidence inspected | Status |
| --- | --- | --- |
| A standard 60-minute lesson is $89 CAD before GST. | `src/data/coursePricing.ts`, `src/data/policies.ts`, and the live Admin Courses inventory. | Supported. |
| A 30% reduction from $89 is $62.30 CAD. | Calculation: $89 × 0.70 = $62.30. The user selected Option A in the October 8, 2026 task instruction. | Supported as qualified promotional pricing; not presented as an unconditional rate. |
| Promotional pricing is limited to eligible self-funded students and normally cannot be combined. | `src/data/policies.ts`, Promotions & Discounts Policy, effective October 6, 2026. | Supported. |
| Pickup and drop-off depend on location, instructor, lesson and schedule. | `src/pages/Index.tsx` and current service-area copy. | Supported. |
| The promotion is automatically available in checkout. | Live Admin Coupons showed no coupon records and Admin Courses showed no discounted courses on October 8, 2026. | Not claimed. The page tells students to confirm applicability and the final itemised amount. |
| A fixed expiry date for the 30% promotion. | No dated expiry was supplied or found. | Not claimed and omitted from structured data. |

The page uses the canonical URL `https://www.shanayasdrivingschool.com/pricing/`. The `Service` and `AggregateOffer` structured data mirrors the visible qualified rates and does not promise ranking, indexing or citation by an AI system.
