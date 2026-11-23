# Shanaya's Driving School - AI Training Knowledge Base

This document summarizes company data currently published or embedded in the website codebase.

## 1. Core Company Identity

- Company name: Shanaya's Driving School
- Business type: Driving school / driver education company
- Primary market: British Columbia, Canada
- Core positioning: Professional driving lessons designed to build confidence, hazard awareness, and real-world driving skills
- Instruction style: Calm, supportive, practical, confidence-building, road-test focused
- Verified status language: ICBC's general directory lists the school in Langford for Class 5 and 7 driver training. Do not call the school, its instructors, or ordinary lessons ICBC-approved, ICBC-aligned, government-approved, recommended, or endorsed. Verify individual instructor and vehicle claims from current records before publishing them.
- Road test vehicle exception (owner direction, 2026-07-29): the rental/test-day car is described on the site as an "ICBC-approved vehicle", replacing the previous "instructor-approved" wording. This is a vehicle claim, not a school or lesson claim, so the rule above still bars ICBC-approved for the school, instructors, lessons, and GLP course. Keep current evidence that the car meets ICBC road test vehicle requirements on file; if that cannot be shown, fall back to "meets ICBC road test vehicle requirements".
- Mascot / brand character referenced on the site: Ruley

## 2. Public Contact Information

### Current physical branches — owner confirmation November 23, 2026

Both branches operate under Shanaya's Driving School, share **250-542-3673** and **book@drivingschoolbc.ca**, and operate **9:00 AM–9:00 PM Monday to Sunday**. This dated instruction supersedes the older single-office summary and the note that hours were not known.

| Branch | Exact address | Branch page | Maps |
| --- | --- | --- | --- |
| Langford Campus (Westshore) | Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1, Canada | /locations/langford/ | https://maps.app.goo.gl/dAwuQFZEFyyi8jt17 |
| Victoria Campus (James Bay) | 503 Niagara St, Victoria, BC V8V 2G4, Canada | /locations/victoria-james-bay/ | https://maps.app.goo.gl/vF3YEBfLAFXMs7hc6 |

Owner-confirmed shared services: Class 7 learner/novice preparation, Class 5 road-test preparation where required, automatic dual-control vehicles, highway/downtown confidence lessons and door-to-door student pickup. Confirm individual scheduling and any travel charges when booking. Branch-specific service areas and Maps place-pin coordinates are recorded in `src/data/branchLocations.ts` and `SEO Blogs Data/BRANCH_LOCATION_PAGES_NOTES.md`. The two offices are physical branches, not two names for one address. Shared contact details do not merge their identity.

The new branch URLs are implemented locally; this record does not establish deployment. The original Langford shorthand address below remains equivalent to its exact branch address; it does not describe James Bay.

- Primary email: book@drivingschoolbc.ca
- Primary phone: +1 (250) 542-3673
- Public vanity phone label: 250-LICENSE
- WhatsApp: https://wa.me/12505423673
- Facebook: https://www.facebook.com/drivingschoolvictoria
- Instagram: https://www.instagram.com/drivingschoolvictoria
- Main office address: 124-2770 Leigh Rd, Langford, BC V9B 4G1
- Office note on contact page: By appointment - Free parking available
- Primary domain: https://www.shanayasdrivingschool.com (canonical host; .htaccess 301s every other host to it)
- Secondary/parked domain: drivingschoolbc.ca — redirects to the primary, must not be published as a site address or used in schema, canonicals or sitemaps
- Domain change (owner direction, 2026-07-30): the primary domain moved to shanayasdrivingschool.com and the published contact mailbox moved to info@shanayasdrivingschool.com, replacing book@drivingschoolbc.ca
- Mailbox reverted (owner direction, 2026-08-24): the published contact mailbox is book@drivingschoolbc.ca again, replacing info@shanayasdrivingschool.com everywhere it appeared. This reverses only the mailbox half of the 2026-07-30 change; the primary domain remains shanayasdrivingschool.com. Note the published mailbox is therefore on the parked domain while the website is on the primary one, so drivingschoolbc.ca MX records must stay live even though its web traffic 301s away

## 3. Service Areas

The site defines these service locations:

- Langford, BC
- Victoria, BC
- Colwood, BC
- Saanich, BC
- View Royal, BC
- Sidney, BC
- Metchosin, BC
- Sooke, BC
- Duncan, BC
- Salt Spring Island, BC

Pricing tiers used by the website:

- Standard: Langford, Victoria, Colwood, Sidney
- Regional: Metchosin, Sooke, Duncan
- Island: Salt Spring Island

## 4. Brand Promise and Operating Approach

- Helps new drivers and learners build confidence, safe habits, and real driving independence
- Offers practical road training tied to BC / ICBC expectations
- Uses dual-control vehicles
- Offers pick-up and drop-off
- Mentions flexible scheduling
- Mentions multi-language support
- Emphasizes progress tracking and structured lesson plans

## 5. Public Programs and Packages

### Flagship packages

- Fresh Start
  - Beginner-focused package
  - Includes knowledge test prep, beginner lessons, parking practice, and 1 custom class
- Skill Builder
  - For drivers with some experience
  - Includes defensive driving, refresher training, newcomer support, parking, road test prep, mock evaluation, and a custom lesson
- Final Lap
  - For learners nearing their road test
  - Includes confidence work, refresher sessions, advanced driving, road test prep, and mock evaluation

### Public course catalog

- Beginner's Driving Course
- Knowledge Test Prep Course
- Parking Course
- Make Your Own Class
- Road Test Package
- Road Test Prep Course
- New to Canada
- Defensive Driving Course
- Refresher Driving Course
- Mock Test Evaluation
- Confidence Booster Course
- Advanced Driving Course
- Winter Driving Course
- Enhanced Road Assessment

## 6. Pricing Model

Base lesson rates defined in code:

- Standard 60 min: $89 CAD
- Standard 90 min: $133.50 CAD
- Island 60 min: $109 CAD
- Island 90 min: $163.50 CAD
- Regional pricing currently matches standard pricing
- Knowledge Test Prep Course is fixed at $300 CAD

### Package totals

- Fresh Start: $2,169 standard/regional, $2,589 island
- Skill Builder: $2,225 standard/regional, $2,725 island
- Final Lap: $2,358.50 standard/regional, $2,888.50 island

### Course prices

- Beginner's Driving Course: $1,335 standard/regional, $1,635 island
- Knowledge Test Prep Course: $300 all tiers
- Parking Course: $400.50 standard/regional, $490.50 island
- Make Your Own Class: $133.50 standard/regional, $163.50 island
- Road Test Package: $250 base all tiers (one hour of road-test preparation + our car on test day; duration confirmed by owner November 23, 2026), plus $89 per optional 60-minute lesson, up to 10 lessons. Base price and copy live in `src/data/courseCatalog.ts`, not the `courses` table, which cannot represent the add-on model
- Road Test Prep Course: $133.50 standard/regional, $163.50 island
- New to Canada: $400.50 standard/regional, $490.50 island
- Defensive Driving Course: $667.50 standard/regional, $817.50 island
- Refresher Driving Course: $267 standard/regional, $327 island
- Mock Test Evaluation: $120 for 60 minutes or $150 for 90 minutes
- Confidence Booster Course: $1,068 standard/regional, $1,308 island
- Advanced Driving Course: $667.50 standard/regional, $817.50 island
- Winter Driving Course: $133.50 standard/regional, $163.50 island
- Enhanced Road Assessment: $133.50 standard/regional, $163.50 island

## 7. Public Policies and Legal Pages

Public policy links exposed in the footer:

- Privacy Policy
- Installment Policy
- Terms & Conditions
- Ruley Rewards Program Terms

Key policy details currently in code:

- All school policies and Ruley Rewards terms are effective April 1, 2026 (owner confirmation, November 19, 2026). This supersedes older effective-date labels in the site and source drafts.
- Student Safety Policy SDS-SAF-001 v1.0: adoption confirmed by owner on November 19, 2026, effective April 1, 2026. This confirmation does not establish a legal or instructor review.
- Installment plans listed: 4-month, 6-month, 8-month, 12-month
- Privacy policy references PIPA and CASL compliance
- Referral terms reference British Columbia and Canadian law, including BPCPA, PIPA, CASL, and the Competition Act

## 8. Referral Program: Ruley Rewards Program

- Program name: Ruley Rewards Program
- Participation model: unique referral link per participant
- Referral qualification: purchase must be a new customer and the package must be fully paid
- Base commission: 5%
- Higher tiers mentioned in legal terms: 6% and 7%
- Legal attribution window in referral terms: 15 days from first recorded click
- Cookie duration shown in affiliate UI/constants: 30 days
- Monthly payouts mentioned
- Legal payment timing: eligible 30 days after full payment, generally processed around the 15th of the month

Payout methods mentioned across the codebase:

- Interac e-Transfer
- Lesson credit
- Bank transfer
- PayPal

## 9. Careers / Hiring Data

Open positions listed on the careers page:

- Driving Instructor
- Office Administrator
- Sub-Contractor

Shared careers details:

- Location used for openings: Victoria, BC
- Careers contact email: book@drivingschoolbc.ca
- Hiring page emphasizes supportive team culture, flexible scheduling, modern training vehicles, and inclusive hiring

## 10. Data Quality Notes

These are important if you plan to train another AI on this company:

- Owner-confirmed canonical address as of October 6, 2026: 124-2770 Leigh Rd, Langford, BC V9B 4G1. Website copy, structured data, and map embeds should use this version consistently.
- The affiliate program minimum payout conflicts:
  - `src/lib/affiliateProgram.ts` says $100
  - `src/data/referralTerms.ts` says $50
- Affiliate payout methods conflict:
  - Legal terms mention Interac e-Transfer or lesson credit
  - Affiliate signup UI also shows bank transfer and PayPal
- Affiliate age rules conflict:
  - Referral terms say participation is open to people age 16+
  - Signup UI accepts ages 13-100 and requires guardian consent for minors
- The About page contains named team members with stock-photo style content. Treat those names as website marketing content unless independently verified.
- Historical note: no public business hours had been found. Superseded by the November 23, 2026 owner confirmation in section 2.
- No founder, ownership, or incorporation details were found in the codebase.

## 11. Recommended Safe AI Summary

Use this short summary if another AI needs a clean company introduction:

"ICBC's general directory lists SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd, Langford, BC V9B 4G1, telephone (250) 542-3673, for Class 5 and 7 driver training. The directory listing is not an ICBC recommendation or endorsement. The website catalogue describes lesson, knowledge-study, road-test preparation, newcomer, defensive-driving, refresher, and package options across listed B.C. locations; availability must be confirmed. As checked July 21, 2026, no matching Shanaya entry appeared in ICBC's separate approved-GLP-course directory."

## 12. Source Files

- `src/components/SiteFooter.tsx`
- `src/pages/Contact.tsx`
- `src/pages/About.tsx`
- `src/pages/Index.tsx`
- `src/data/serviceLocations.ts`
- `src/data/courseCatalog.ts`
- `src/data/coursePricing.ts`
- `src/data/packageCatalog.ts`
- `src/data/policies.ts`
- `src/data/referralTerms.ts`
- `src/pages/AffiliateSignup.tsx`
- `src/lib/affiliateProgram.ts`
- `src/pages/Careers.tsx`

## 13. Road Test Confidence — owner clarification November 23, 2026

- Eligible training: Class 5 and Class 7 road-test preparation.
- The package has no expiry date. Conditional support still ends on passing or after the fourth covered attempt; no unlimited training is promised.
- An unsuccessful test means the student fails an ICBC road test. The next included block follows that result within the existing 10 + 5 + 3 + 2 lesson schedule.
- The separate $250 CAD + GST test-day package includes one hour of preparation plus the school car. Optional additional lessons remain separately priced.
- Source: explicit owner reply in the landing-page improvement task on November 23, 2026. No blanket test-centre or vehicle availability was confirmed; coordinate those with the team. Programme-specific written cancellation/refund and any lesson-completion conditions are not defined by this clarification.
