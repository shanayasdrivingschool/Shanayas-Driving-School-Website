# Student service policy implementation notes

**Prepared:** October 6, 2026  
**Publication state:** Implemented locally; publication unverified

## Brief

- **Reader:** A prospective or enrolled Shanaya's Driving School student, or the student's parent or guardian.
- **Question:** What service, fee, lesson, licence, passenger, cancellation, refund, and road-test rules apply before training and payment?
- **Location:** British Columbia, with the school's office in Langford and services in the listed service areas.
- **Outcome:** Provide a concise general school policy following the supplied sample's disclosure topics, while preserving the school's verified rules and separating school bookings from ICBC appointments.
- **Scope:** Public policy data, policy discovery, installment-charge disclosure, checkout acknowledgement, and acceptance metadata.
- **Overlap:** The consolidated policy summarizes and links conceptually to the detailed Cancellation & Rescheduling Policy, In-Vehicle Passenger Policy, and Terms & Conditions.
- **Evidence gap:** The exact actual practice-driving minutes promised for each 60- and 90-minute in-car lesson are not established in the available business records. The public policy requires this value in the purchase-specific written statement and instructs students not to pay until it is supplied; it does not invent a number.
- **Original contribution:** A consolidated, versioned student policy adapted to Shanaya's current service model, prices, passenger practice, and direct-ICBC road-test booking workflow.
- **Responsible organization:** Shanaya's Driving School.
- **Required review:** Owner confirmation of actual practice-driving minutes and legal/operational review before the policy is treated as fully compliant.
- **Next step:** Add the confirmed practice-driving minutes to each applicable checkout line item or purchase-specific service statement, and ensure the student receives a durable copy before payment.
- **Maintenance:** Recheck prices, fees, cancellation rules, office address, and ICBC road-test cancellation terms whenever those underlying records change.

## Claim log

| Claim and location | Source | Evidence and conditions | Checked on | Gap or required review |
| --- | --- | --- | --- | --- |
| Written pre-payment disclosures required | B.C. Motor Vehicle Act Regulations, Division 27, section 27.06(2) | Requires school identity, fees, extra charges, occupants and reasons, actual practice time, actual lesson fee, and refund policy before training and payment | October 6, 2026 | Legal review recommended |
| Itemized statement and payment receipt | B.C. Motor Vehicle Act Regulations, Division 27, section 27.06(3) | Requires a written itemized statement of services or rental charges and a receipt for each payment | October 6, 2026 | Confirm operational delivery and retention |
| Valid licence required for practical training | B.C. Motor Vehicle Act Regulations, Division 27, section 27.08(5) | Practical training must not be provided to a person who does not have a driver's licence | October 6, 2026 | Confirm procedures for non-B.C. licences |
| School-policy sample topics | `Sample School Policy.docx` supplied in this project | Covers fees and duration, cancellation, payment/refunds, licence presentation, vehicle occupants, and road-test booking consent | October 6, 2026 | Sample placeholders and school-specific rules were not copied as facts |
| ICBC policy-statement guidance | ICBC Choosing your driving school | Advises students to request training hours and types, fees, refund policies, receipts, and a permission form if the school uses licence information to book a road test | October 6, 2026 | None for the general guidance |
| ICBC road-test cancellation | ICBC Book a road test | As checked, ICBC requests 48 hours' notice and states a $25 cancellation fee may apply without it | October 6, 2026 | Time-sensitive; recheck before future updates |
| Current lesson rates and service-area tiers | `src/data/coursePricing.ts` and `COMPANY_KNOWLEDGE.md` | Standard/regional: $89 per 60 minutes and $133.50 per 90 minutes; Salt Spring Island: $109 and $163.50 | October 6, 2026 | Confirm tax presentation and any later price changes |
| School cancellation and refund rules | `src/data/policies.ts` | Existing 24-hour, 2-to-24-hour, under-2-hour, credit, withdrawal, and administration-fee terms retained | October 6, 2026 | Legal/consumer-contract review not established |
| Installment charges and recovery costs | `src/data/policies.ts` | Undisclosed late-payment surcharges and unspecified recovery-cost language were removed; any such charge must be stated by amount or calculation method in the written agreement before enrolment | October 6, 2026 | Confirm the payment schedule shown to each student and obtain legal review of enforcement terms |
| School identity and address | `COMPANY_KNOWLEDGE.md`, footer, and current schema | Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1 | October 6, 2026 | Confirm against current school licence and registered-office record |

## Readiness

- **Page quality:** Draft awaiting evidence/review. The structure and available facts are implemented, but exact practice-driving minutes and legal/operational review remain unresolved.
- **Intent satisfaction:** The consolidated policy answers the sample's main disclosure topics and directs the student to purchase-specific terms.
- **Publication state:** Implemented locally. A successful build does not establish deployment or operational delivery of a durable written statement.
