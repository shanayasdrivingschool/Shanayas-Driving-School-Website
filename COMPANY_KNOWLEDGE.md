# Shanaya's Driving School - AI Training Knowledge Base

This document summarizes company data currently published or embedded in the website codebase.

## 1. Core Company Identity

- Company name: Shanaya's Driving School
- Business type: Driving school / driver education company
- Primary market: British Columbia, Canada
- Core positioning: Professional driving lessons designed to build confidence, hazard awareness, and real-world driving skills
- Instruction style: Calm, supportive, practical, confidence-building, road-test focused
- Verified status language: ICBC's general directory lists the school in Langford for Class 5 and 7 driver training. Do not call the school, its instructors, or ordinary lessons ICBC-approved, ICBC-aligned, government-approved, recommended, or endorsed. Verify individual instructor and vehicle claims from current records before publishing them.
- Mascot / brand character referenced on the site: Ruley

## 2. Public Contact Information

- Primary email: book@drivingschoolbc.ca
- Primary phone: +1 (250) 542-3673
- Public vanity phone label: 250-LICENSE
- WhatsApp: https://wa.me/12505423673
- Facebook: https://www.facebook.com/drivingschoolvictoria
- Instagram: https://www.instagram.com/drivingschoolvictoria
- Main office address: Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1
- Office note on contact page: By appointment - Free parking available
- Likely public site URL from backend defaults: https://www.drivingschoolbc.ca

## 3. Service Areas

The site defines these service locations:

- Langford, BC
- Victoria, BC
- Colwood, BC
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
- Lesson + Road Test Prep + Rental
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
- Lesson + Road Test Prep + Rental: $350 for 2 x 60-minute lessons or $450 for 2 x 90-minute lessons; car included
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

- Privacy Policy effective date: March 16, 2026
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

- The office address is mostly shown as Langford, BC V9B 4G1, but Google Maps embeds in the site use "Victoria, BC V9B 4G2". This should be manually reconciled before treating one version as final truth.
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
- No public business hours were found in the codebase.
- No founder, ownership, or incorporation details were found in the codebase.

## 11. Recommended Safe AI Summary

Use this short summary if another AI needs a clean company introduction:

"ICBC's general directory lists SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd, Langford, telephone (250) 542-3673, for Class 5 and 7 driver training. The directory listing is not an ICBC recommendation or endorsement. The website catalogue describes lesson, knowledge-study, road-test preparation, newcomer, defensive-driving, refresher, and package options across listed B.C. locations; availability must be confirmed. As checked July 21, 2026, no matching Shanaya entry appeared in ICBC's separate approved-GLP-course directory."

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
