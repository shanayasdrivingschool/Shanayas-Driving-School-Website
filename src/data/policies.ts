export type PolicyInstallmentPlan = {
  duration: string;
  frequency: string;
  requirement: string;
};

export type PolicyContentSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  /**
   * Visual tone for the section's bullet list. `warning` renders cautionary
   * (red / alert) markers; anything else renders neutral markers. Defaults to
   * neutral so definitions, contact details, and ordinary lists never look like
   * warnings.
   */
  tone?: 'neutral' | 'warning';
};

export type SitePolicy = {
  id: string;
  label: string;
  href: string;
  effectiveDate: string;
  cardDescription: string;
  intro: string;
  highlights: string[];
  sections: PolicyContentSection[];
  installmentPlans?: PolicyInstallmentPlan[];
};

const installmentPlans: PolicyInstallmentPlan[] = [
  { duration: '4-month plan', frequency: 'Monthly', requirement: 'Standard enrolment' },
  { duration: '6-month plan', frequency: 'Monthly', requirement: 'Standard enrolment' },
  { duration: '8-month plan', frequency: 'Monthly', requirement: 'Verification required' },
  { duration: '12-month plan', frequency: 'Monthly', requirement: 'Verification required' },
];

const allSitePolicies: SitePolicy[] = [
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    href: '/policies/privacy-policy',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'How we collect, use, store, disclose, and protect personal information across the website, bookings, and Ruley Rewards referrals.',
    intro:
      'Effective Date: April 1, 2026. Shanaya\'s Driving School ("Company", "we", "our", or "us") respects the privacy of individuals who interact with our website, services, and programs, including the Ruley Rewards Referral Program. By accessing our website, enrolling in driving services, participating in referral programs, or otherwise interacting with the Company, you consent to the practices described in this Privacy Policy.',
    highlights: ['PIPA and CASL compliance', 'Bookings, referral, and website data', 'Consent, access, and correction rights'],
    sections: [
      {
        title: 'Definitions',
        paragraphs: [
          'For the purposes of this Privacy Policy, "Personal Information" means any information that identifies or can reasonably be used to identify an individual.',
        ],
        bullets: [
          'Name',
          'Email address',
          'Phone number',
          'Mailing address',
          'IP address',
          'Referral identifiers',
          'Payment records',
          'Course enrolment details',
          'Communications with the Company',
        ],
        note: 'Personal information does not include aggregated or anonymized data that cannot reasonably identify an individual.',
      },
      {
        title: 'Information We Collect',
        paragraphs: [
          'We may collect personal information directly from individuals when they register for driving lessons, create accounts on our website, submit forms or inquiries, participate in the Ruley Rewards Referral Program, contact us by phone, email, or online messaging, subscribe to newsletters or promotional communications, or interact with our website or referral links.',
          'The types of information we may collect include identity information, contact information, referral program information, transaction information, and technical data.',
        ],
        bullets: [
          'Identity information, including full name, date of birth, and age verification information.',
          'Contact information, including email address, phone number, and mailing address.',
          'Referral program information, including referral links used, referral activity and conversions, and commission eligibility data.',
          'Transaction information, including purchased packages, payment confirmation, and refund or cancellation records.',
          'Technical data, including IP address, browser type, device information, and website interaction data.',
        ],
      },
      {
        title: 'How We Use Personal Information',
        paragraphs: [
          'We collect and use personal information for legitimate business purposes and will not use it for purposes beyond those reasonably required to provide services unless consent is obtained or permitted by law.',
        ],
        bullets: [
          'Administering driving lesson bookings.',
          'Processing payments and enrolments.',
          'Operating the Ruley Rewards Referral Program.',
          'Verifying referral eligibility.',
          'Issuing referral commissions.',
          'Communicating with students and participants.',
          'Providing customer support.',
          'Preventing fraud or misuse of services.',
          'Maintaining security of our systems.',
          'Improving website functionality and user experience.',
          'Complying with legal and regulatory obligations.',
        ],
      },
      {
        title: 'Referral Program Data',
        paragraphs: [
          'Participants in the Ruley Rewards Program may generate referral links that track activity. Information collected through referral tracking is used solely to verify legitimate referrals, calculate commissions, prevent referral fraud, and maintain the integrity of the program.',
          'Internal tracking records maintained by the Company are considered final and authoritative for referral attribution.',
        ],
        bullets: [
          'Referral link identifiers',
          'Click timestamps',
          'Referral source pages',
          'Conversion events',
          'Purchase confirmations',
        ],
      },
      {
        title: 'Consent',
        paragraphs: [
          'Where required by law, the Company will obtain consent before collecting or using personal information. By voluntarily providing personal information, individuals consent to its collection and use as described in this Privacy Policy.',
          'Participants may withdraw consent at any time, subject to legal, contractual, or operational limitations. Withdrawal of consent may limit our ability to provide services.',
        ],
        bullets: [
          'Website forms',
          'Account registrations',
          'Service agreements',
          'Referral program participation',
          'Written or electronic communication',
        ],
      },
      {
        title: 'Protection of Personal Information',
        paragraphs: [
          'The Company implements reasonable administrative, technical, and physical safeguards to protect personal information from unauthorized access, loss, theft, misuse, alteration, and disclosure.',
          'While reasonable safeguards are implemented, no system can guarantee absolute security.',
        ],
        bullets: [
          'Secure servers',
          'Encrypted communications',
          'Restricted employee access',
          'Authentication controls',
          'Monitoring for suspicious activity',
        ],
      },
      {
        title: 'Disclosure of Information',
        paragraphs: [
          'The Company does not sell personal information. Personal information may be disclosed only where necessary to process payments, provide services, operate website infrastructure, administer referral program tracking, comply with legal obligations, or respond to lawful government requests.',
          'Third-party service providers may include payment processors, cloud hosting providers, website analytics services, and referral tracking systems.',
        ],
        note: 'All third parties are expected to maintain appropriate privacy protections.',
      },
      {
        title: 'Anti-Spam Compliance',
        paragraphs: [
          'The Company complies with the Canada Anti-Spam Legislation (CASL). Commercial electronic messages may be sent only where express consent has been obtained, implied consent exists under applicable law, or the message relates to an existing business relationship.',
          'Recipients may unsubscribe from communications at any time. Participants in the referral program must also comply with CASL when promoting referral links, and the Company is not responsible for CASL violations committed by referral participants.',
        ],
      },
      {
        title: 'Retention of Personal Information',
        paragraphs: [
          'Personal information will be retained only for as long as necessary to provide services, administer programs, maintain business records, and comply with legal obligations.',
          'When personal information is no longer required, it will be securely deleted or anonymized.',
        ],
      },
      {
        title: 'Access and Correction Rights',
        paragraphs: [
          'Individuals have the right to request access to their personal information held by the Company and may also request correction of inaccurate or outdated information.',
          'Requests may be submitted by contacting the Company using the information provided in this policy. The Company may require identity verification before granting access to personal data.',
        ],
      },
      {
        title: 'Cookies and Website Tracking',
        paragraphs: [
          'Our website may use cookies or similar technologies to improve user experience, analyze website traffic, remember user preferences, and maintain referral link tracking.',
          'Users may disable cookies in their browser settings; however, some website functionality may be affected.',
        ],
      },
      {
        title: 'Children and Minor Participants',
        paragraphs: [
          'The Company does not knowingly collect personal information from individuals under sixteen (16) years of age without parent or legal guardian consent.',
          'Where a participant under nineteen (19) participates in the Ruley Rewards Program, parental or guardian consent may be required in accordance with applicable laws.',
        ],
      },
      {
        title: 'Limitation of Liability',
        paragraphs: [
          'The Company shall not be responsible for damages arising from unauthorized access to personal information where reasonable security safeguards have been implemented.',
          'Users are responsible for maintaining the confidentiality of their own account credentials.',
        ],
      },
      {
        title: 'Changes to this Privacy Policy',
        paragraphs: [
          'The Company may update this Privacy Policy from time to time. Updated versions will be posted on the website and will become effective upon publication.',
          'Continued use of our services constitutes acceptance of the revised Privacy Policy.',
        ],
      },
      {
        title: 'Contact Information',
        paragraphs: [
          'Questions or requests regarding this Privacy Policy may be directed to Shanaya\'s Driving School using the contact details below.',
        ],
        bullets: [
          '2770 Leigh Rd, Victoria, BC V9B 4G1',
          'book@drivingschoolbc.ca',
          '+1 (250) 542-3673',
        ],
        note: 'By using our website, services, or referral program, individuals confirm that they have read, understood, and agree to this Privacy Policy.',
      },
    ],
  },
  {
    id: 'installment-policy',
    label: 'Installment Policy',
    href: '/policies/installment-policy',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'Rules for approved installment plans, payment schedules, delinquency handling, and recovery terms.',
    intro:
      'This policy governs the installment facilities offered for professional driver training programs and sets out the payment, participation, delinquency, and recovery terms that apply once a student enrolls under an approved plan.',
    highlights: ['4 approved installment options', 'Fixed monthly payment schedules', 'Binding payment obligations'],
    installmentPlans,
    sections: [
      {
        title: 'Policy overview',
        paragraphs: [
          'To support access to driver training, the school may offer structured installment payment options for approved students and programs.',
          'By selecting an installment plan, the student enters into a binding financial agreement and accepts the obligations attached to the full course fee.',
        ],
      },
      {
        title: 'Authorized plans',
        paragraphs: [
          'Installment plans are offered only in the approved durations listed by the school at the time of registration.',
          'All plans remain subject to identity verification, internal review, and confirmation through the individual payment schedule issued at enrolment.',
        ],
        note: 'Specific payment amounts and due dates are confirmed during registration and may differ by package or course selection.',
      },
      {
        title: 'Missed payments and delinquency',
        tone: 'warning',
        paragraphs: [
          'Students remain responsible for paying every scheduled installment on time. Missing a payment may trigger operational and administrative consequences.',
        ],
        bullets: [
          'Immediate pause on scheduled driving lessons or access to additional bookings.',
          'Late payment surcharges or administrative follow-up on the unpaid balance.',
          'Restriction of access to the scheduling system until the account is brought current.',
          'Escalation to collections or formal recovery procedures if the balance remains unpaid.',
        ],
      },
      {
        title: 'Attendance and withdrawal',
        paragraphs: [
          'Installment enrolment applies to the full course commitment, not a pay-as-you-go arrangement for each lesson attended.',
          'Stopping attendance, delaying booking activity, or voluntarily withdrawing does not automatically reduce the outstanding balance owed under the approved agreement.',
        ],
      },
      {
        title: 'Recovery and enforcement',
        tone: 'warning',
        paragraphs: [
          'The school reserves the right to pursue available legal and administrative remedies to recover overdue balances.',
        ],
        bullets: [
          'Engagement of collection support where necessary.',
          'Recovery of additional administrative or legal costs connected to enforcement.',
          'Reporting or documentation required to support internal or external collection steps.',
        ],
      },
    ],
  },
  {
    id: 'in-vehicle-passenger-policy',
    label: 'In-Vehicle Passenger Policy',
    href: '/policies/in-vehicle-passenger-policy',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'Why driving lessons are conducted one-on-one between the student and certified instructor, with no ride-along passengers, and how we keep parents informed.',
    intro:
      'At Shanaya\'s Driving School, every lesson is carefully designed to provide students with a safe, professional, and distraction-free learning environment. Our goal is not only to help students pass their road test, but also to develop the confidence, judgment, and defensive driving skills needed to become safe, responsible drivers for life.',
    highlights: ['One-on-one instruction only', 'Distraction-free vehicle environment', 'Parents updated before and after lessons'],
    sections: [
      {
        title: 'Our In-Vehicle Passenger Policy',
        paragraphs: [
          'To ensure the highest quality of instruction, all driving lessons are conducted exclusively between the student and the certified driving instructor. Parents, guardians, family members, friends, or other passengers are not permitted to ride along during scheduled driving lessons.',
          'This policy is applied consistently to every student and is an important part of our teaching philosophy.',
        ],
      },
      {
        title: 'Why We Follow This Policy',
        paragraphs: [
          'Learning to drive requires concentration, clear communication, and the ability for students to make decisions independently. Experience has shown that students often learn more effectively and gain confidence more quickly when they are able to focus solely on the instructor\'s guidance without the added pressure or distraction of having family members or other passengers in the vehicle.',
        ],
      },
      {
        title: 'Maintaining a Focused Learning Environment',
        paragraphs: [
          'While we greatly value the support and encouragement of parents and guardians, the presence of additional passengers, even with the best intentions, can unintentionally affect a student\'s learning experience.',
          'Parents or visitors may naturally ask questions during the lesson, offer suggestions, provide praise or encouragement, or attempt to motivate the student while they are driving. Although these interactions come from a place of care and support, they can unintentionally divide the student\'s attention at moments when their full concentration should be on the road and the instructor\'s guidance.',
          'Driving is a complex skill that requires students to process traffic conditions, hazards, vehicle control, and instructor feedback simultaneously. Receiving instruction or commentary from multiple people at once can create confusion, increase pressure, and make it more difficult for the student to develop sound decision-making skills.',
          'Our instructors use a structured coaching method that includes carefully timed instruction, observation, and constructive feedback. Maintaining one clear source of instruction allows students to better absorb new skills, build confidence, and make independent driving decisions without unnecessary distractions.',
          'Parents and guardians remain an essential part of the learning process. We encourage questions and discussions before or after each lesson, when we can provide our full attention, review the student\'s progress, address concerns, and offer personalized recommendations for at-home practice. This approach ensures that both the student and their family receive the greatest benefit from each professional driving lesson.',
        ],
      },
      {
        title: 'What One-on-One Instruction Allows',
        paragraphs: [
          'A one-on-one learning environment allows the instructor to:',
        ],
        bullets: [
          'Provide individualized coaching and immediate feedback.',
          'Minimize distractions inside the vehicle.',
          'Build the student\'s confidence and independent decision-making skills.',
          'Maintain consistent teaching methods throughout each lesson.',
          'Create a calm, supportive, and professional learning environment.',
          'Focus entirely on the student\'s progress, safety, and specific learning needs.',
        ],
        note: 'Every student learns differently. By eliminating unnecessary distractions, we can better adapt each lesson to the student\'s pace, helping them develop safe driving habits that will benefit them well beyond their road test.',
      },
      {
        title: 'Parent & Guardian Communication',
        paragraphs: [
          'We understand that parents and guardians play an important role in a new driver\'s success and appreciate the trust you place in us.',
          'Although ride-alongs are not permitted, we are committed to keeping families informed. We are happy to discuss your child\'s progress before or after lessons, answer questions, and provide recommendations for practice between professional driving sessions.',
          'Our objective is to work as a team with both students and parents while maintaining an environment that allows every student to learn with confidence and independence.',
        ],
      },
      {
        title: 'Safety & Professional Standards',
        paragraphs: [
          'Safety is our highest priority. Conducting lessons with only the instructor and student helps maintain a focused environment where the instructor can effectively observe, coach, and respond to changing road conditions without unnecessary distractions.',
          'This policy is part of our commitment to providing consistent, professional, and high-quality driver education for every student.',
          'We appreciate your understanding, cooperation, and support. By following this policy, we are able to deliver the best possible learning experience and help every student become a safe, confident, and responsible driver.',
        ],
      },
    ],
  },
  {
    id: 'cookie-policy',
    label: 'Cookie Policy',
    href: '/policies/cookie-policy',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'How referral cookies, analytics, and browser storage are used on the website.',
    intro:
      'This Cookie Policy explains how the website uses cookies or similar browser storage technologies to support core site functionality, referral attribution, analytics, and security-related features.',
    highlights: ['Referral attribution', 'Site functionality', 'Cookie controls'],
    sections: [
      {
        title: 'Why cookies are used',
        paragraphs: [
          'Cookies help the website remember useful information between visits, support smoother user interactions, and maintain essential functionality such as referral attribution or session-related behaviour.',
          'Some cookies may also support analytics, anti-spam checks, or other tools used to measure site usage and protect the website from abuse.',
        ],
      },
      {
        title: 'Referral and campaign tracking',
        paragraphs: [
          'When a visitor arrives through a referral link, the site may store that referral code for a limited time so valid affiliate or refer-a-friend activity can be credited correctly.',
          'Referral storage does not guarantee a payout by itself; credited purchases remain subject to validation, payment success, and fraud review.',
        ],
      },
      {
        title: 'Managing cookies',
        paragraphs: [
          'Most browsers allow you to review, restrict, or delete cookies through browser settings. You may also clear stored referral or site data from your browser at any time.',
          'Disabling some cookies may reduce site functionality, interfere with form behaviour, or prevent referrals from being attributed correctly.',
        ],
      },
      {
        title: 'Third-party tools',
        paragraphs: [
          'Some features on the website may rely on trusted third-party services used for analytics, form processing, spam prevention, hosting, or service operations.',
          'Those services may use their own cookies or similar technologies in accordance with their own policies.',
        ],
      },
    ],
  },
  {
    id: 'promotions-and-discounts',
    label: 'Promotions & Discounts Policy',
    href: '/policies/promotions-and-discounts',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'Who qualifies for discounts, coupon codes, and promotional offers — and why promotional pricing applies to self-funded students only, not to enrolments paid by a third-party organization.',
    intro:
      'Effective Date: April 1, 2026. This Promotions & Discounts Policy governs all discounts, coupon codes, seasonal or promotional offers, bundle pricing, and referral credits offered by Shanaya\'s Driving School. It explains who qualifies for promotional pricing and the conditions that apply to every offer.',
    highlights: ['Self-funded students only', 'Excludes sponsored enrolments', 'No retroactive discounts'],
    sections: [
      {
        title: 'Definitions',
        paragraphs: [
          'These terms are used throughout this policy to describe who a promotion applies to.',
        ],
        bullets: [
          '"Self-Funded Student" means an individual who personally pays for their own lessons or packages.',
          '"Sponsored" or "Third-Party-Funded Enrolment" means any enrolment where lesson fees are paid, invoiced, reimbursed, or otherwise funded by a party other than the student.',
          'Third parties include, but are not limited to, government agencies, insurers, employers, non-profit organizations, settlement or employment programs, funding bodies, and any organization arranging payment on a student\'s behalf.',
        ],
      },
      {
        title: 'Who Discounts Apply To',
        paragraphs: [
          'Promotions and discounts are available only to Self-Funded Students who pay for their own driver training.',
          'They do not apply to Sponsored or Third-Party-Funded Enrolments. Where a third party pays for a student\'s training, the standard published rate applies, because funding is arranged directly with the funding organization.',
        ],
      },
      {
        title: 'Promotional Pricing & Sponsored Enrolment',
        paragraphs: [
          'Advertised promotional pricing reflects a benefit offered to individuals paying for their own lessons. Sponsored enrolments are billed at the standard published rate and are quoted or invoiced directly to the funding organization.',
        ],
        bullets: [
          'Promotional codes and discounts cannot be combined with, or applied on top of, third-party funding.',
          'Discounts are not applied retroactively to enrolments booked before an offer began.',
          'Only one promotional offer may apply to an eligible enrolment unless the school states otherwise in writing.',
        ],
      },
      {
        title: 'Reclassification and Reversal',
        paragraphs: [
          'Eligibility is determined by who ultimately pays for the training.',
          'If an enrolment booked as self-funded is later paid, invoiced, or reimbursed by a third party, any discount already applied may be reversed and the balance adjusted to the standard published rate.',
        ],
      },
      {
        title: 'Eligibility and Changes',
        paragraphs: [
          'Shanaya\'s Driving School reserves the right to determine eligibility for any promotion, to verify the source of payment, and to withdraw, change, or limit any offer at any time.',
          'Where this policy and a specific promotion\'s stated terms differ, the specific promotion\'s terms apply to that offer.',
        ],
      },
      {
        title: 'Contact Information',
        paragraphs: [
          'Questions about promotional eligibility or this policy may be directed to Shanaya\'s Driving School using the details below.',
        ],
        bullets: [
          '2770 Leigh Rd, Victoria, BC V9B 4G1',
          'book@drivingschoolbc.ca',
          '+1 (250) 542-3673',
        ],
      },
    ],
  },
  {
    id: 'cancellation-and-rescheduling',
    label: 'Cancellation & Rescheduling Policy',
    href: '/policies/cancellation-and-rescheduling',
    effectiveDate: 'April 1, 2026',
    cardDescription: 'How to cancel or reschedule a booked lesson/package, how much notice is required, what happens to your fee at each notice level, when a refund is available, and how credits are applied.',
    intro:
      'Effective Date: April 1, 2026. This policy explains what happens when a booked lesson/package is cancelled, rescheduled, missed, or withdrawn from. It applies to every booking made with Shanaya\'s Driving School, however it was booked and however it was paid for. Please read it before you book, and read it together with our Terms & Conditions, Installment Policy, and Promotions & Discounts Policy.',
    highlights: ['Cancellations are rescheduled or credited', '24 hours notice to reschedule free of charge', 'Refunds only for a valid reason'],
    sections: [
      {
        title: '1. Scope',
        paragraphs: [
          'This policy governs the cancellation and rescheduling of a lesson/package by you, and sets out what the school does when it cancels. It applies from the moment a booking is confirmed, whether or not payment has been completed.',
          'It does not govern the purchase, pricing, or payment of a lesson/package. Those are dealt with in the Terms & Conditions, the Installment Policy, and the Promotions & Discounts Policy.',
          'This policy is separate from ICBC\'s own rules. Cancelling, rescheduling, or missing a road test booked with ICBC is governed by ICBC, and any fee ICBC charges for that is separate from anything under this policy.',
        ],
      },
      {
        title: '2. Definitions',
        paragraphs: [
          'The following terms are used throughout this policy.',
        ],
        bullets: [
          '"Lesson/package" means anything you have booked with the school: a single driving lesson, any course, any package, the Road Test Package, a Mock Test Evaluation, an Enhanced Road Assessment, or any other lesson or program we offer.',
          '"Package" means several lessons bought together as one booking, usually at a lower total price than the same lessons bought separately.',
          '"Fee" means the amount payable for the lesson/package.',
          '"Standard published price" means the price shown on our website for that lesson or course on its own, before any discount, promotion, or coupon.',
          '"Notice" means telling the school you wish to cancel or reschedule, given through one of the channels in section 6.',
          '"Office hours" means Monday to Friday, 8:30 a.m. to 4:30 p.m. Pacific time, excluding statutory holidays.',
          '"Credit" means an amount held on your account and put towards a future booking.',
          '"Retained" means an amount kept by the school and not carried forward or returned.',
          '"Withdrawing" means ending a package altogether, rather than moving or cancelling a single lesson within it.',
        ],
      },
      {
        title: '3. Rescheduling, credits, and refunds',
        paragraphs: [
          'Where you cancel a booked lesson/package, it is settled by rescheduling and, where this policy provides for it, by credit held on your account. Section 10 sets out the one case in which a cancellation is not rescheduled at all.',
          'Credits are not paid out in cash, cannot be exchanged for cash, and cannot be transferred to another person.',
          'A refund is available only where you withdraw from a package for a valid reason, and only where that package was paid for in full. Amounts paid under an instalment plan are not refundable. Section 16 sets out what counts as a valid reason and how a refund is worked out.',
        ],
        note: 'By booking a lesson/package you accept that a cancellation is settled by rescheduling and credit, except where section 16 applies.',
        tone: 'warning',
      },
      {
        title: '4. Notice levels at a glance',
        paragraphs: [
          'How much of your fee carries forward to the rescheduled lesson/package depends on one thing: how much notice the school receives before the scheduled start time.',
        ],
        bullets: [
          'At least 24 hours notice: the lesson/package is rescheduled at no charge and the full fee carries forward.',
          'Between 2 and 24 hours notice: the lesson/package is rescheduled, half the fee is retained, and half carries forward as credit.',
          'Less than 2 hours notice, or no notice at all: the full fee is retained and the lesson/package is not rescheduled.',
          'Cancelled by the school: the lesson/package is rescheduled at no charge and the full fee carries forward.',
        ],
        note: 'Sections 6 and 7 explain how the notice period is calculated. Sections 8 to 14 set out each level in full. This summary is a guide only; where it differs from the detailed sections, the detailed sections apply.',
      },
      {
        title: '5. Changing your mind about the time, rather than cancelling',
        paragraphs: [
          'Moving a booking to a different time is treated in exactly the same way as cancelling it. The notice levels in sections 8 to 10 apply whether you are cancelling outright or asking for a different time.',
          'This is because the effect on the school is the same: a time slot that was reserved for you can no longer be offered to anyone else at short notice.',
        ],
      },
      {
        title: '6. How to give notice',
        paragraphs: [
          'Notice must be given to the school directly, through one of the channels below. Notice given any other way, including to any individual rather than to the school, does not count as notice under this policy.',
        ],
        bullets: [
          'Telephone: +1 (250) 542-3673',
          'WhatsApp: +1 (250) 542-3673',
          'Email: book@drivingschoolbc.ca',
        ],
        note: 'To help us act on your notice quickly, please include your full name, the date and time of the booking you are cancelling, and whether you would like to reschedule. Keep a record of when you sent your notice.',
      },
      {
        title: '7. When notice is received',
        paragraphs: [
          'Notice takes effect when it is received by the school, not when it is sent. This is the single most important thing to understand about this policy, because your notice level is measured from that moment.',
          'The office is staffed during office hours only, and notice is received, reviewed, and acted on only during those hours.',
          'Notice sent outside office hours, including in the evening, on a weekend, or on a statutory holiday, is treated as received at 8:30 a.m. on the next weekday. Your notice period is then measured from that time to the scheduled start time of the lesson/package.',
        ],
        bullets: [
          'A message sent Tuesday at 2:00 p.m. is received Tuesday at 2:00 p.m.',
          'A message sent Tuesday at 8:00 p.m. is received Wednesday at 8:30 a.m.',
          'A message sent at any time on Saturday is received the following Monday at 8:30 a.m.',
        ],
        note: 'Plan your cancellations around office hours. Where the timing of a notice is in question, the received timestamp on the call, message, or email is what applies.',
        tone: 'warning',
      },
      {
        title: '8. Notice of at least 24 hours',
        paragraphs: [
          'Where the school receives your notice at least 24 hours before the scheduled start time, the lesson/package is rescheduled to another available time at no additional charge.',
          'No part of the fee is retained, and the full value carries forward to the rescheduled booking.',
        ],
      },
      {
        title: '9. Notice between 2 and 24 hours',
        paragraphs: [
          'Where the school receives your notice between 2 and 24 hours before the scheduled start time, the lesson/package is rescheduled to another available time on the following basis.',
        ],
        bullets: [
          'Half of the fee is retained by the school as a late-notice charge.',
          'The remaining half is held as a credit and applied to the cost of your rescheduled lesson/package.',
        ],
        note: 'The credited half is not lost. It remains on your account and reduces the amount payable for the rescheduled lesson/package. Contact the office at any time to confirm your current credit balance.',
        tone: 'warning',
      },
      {
        title: '10. Notice within the last 2 hours, or no notice',
        paragraphs: [
          'Where the school receives your notice less than 2 hours before the scheduled start time, the lesson/package is treated as delivered.',
        ],
        bullets: [
          'The full fee is retained.',
          'The lesson/package is not rescheduled and no credit carries forward.',
          'A lesson/package missed without any notice is treated in the same way as notice given inside the last 2 hours.',
        ],
        note: 'By this point the time has been reserved for you and can no longer be offered to another student.',
        tone: 'warning',
      },
      {
        title: '11. Late arrival and shortened lessons',
        paragraphs: [
          'A lesson runs from its scheduled start time to its scheduled finish time. If you are not ready at the agreed meeting point at the scheduled start time, the lesson is treated as having started, and time lost at the beginning is not added to the end.',
          'Where a lesson is shortened because you arrive late, are not ready, or ask to finish early, the full fee still applies and no part of it is retained, credited, or refunded on account of the shortened time.',
          'If you know you will be late, contact the school as soon as possible. We will tell you whether the lesson can still go ahead in the time remaining.',
        ],
        tone: 'warning',
      },
      {
        title: '12. Rescheduling, and availability',
        paragraphs: [
          'All rescheduled times are subject to availability. Rescheduling does not guarantee a particular day, time, or location, and the school cannot hold a slot open indefinitely while a new time is agreed.',
          'A rescheduled lesson/package is itself a booking, and this policy applies to it again in full. Cancelling a rescheduled booking is treated the same way as cancelling the original.',
          'Where a booking is rescheduled repeatedly, the school may ask you to confirm a firm date before further bookings are accepted.',
        ],
      },
      {
        title: '13. Repeated late cancellations and missed lessons',
        paragraphs: [
          'Occasional changes are understandable and this policy is designed to accommodate them. A pattern of late cancellations or missed lessons is different, because each one takes a slot that another student could have used.',
          'Where late cancellations or missed lessons happen repeatedly, the school may decline to accept further bookings, may require payment in advance for future bookings, or may end a package. Any amount already retained under this policy is not returned.',
        ],
        tone: 'warning',
      },
      {
        title: '14. Cancellations made by the school',
        paragraphs: [
          'Where the school cancels a lesson/package, including for reasons beyond our control such as unsafe road or weather conditions, vehicle availability, or an operational disruption, the lesson/package is rescheduled at no charge to you.',
          'No part of the fee is retained in these circumstances, and no notice period applies to a cancellation made by the school.',
          'The school will give you as much notice as the circumstances allow, using the contact details you provided when booking. Please keep those details current, because a cancellation notice sent to an out-of-date number or address is still treated as given.',
        ],
      },
      {
        title: '15. Weather, road conditions, and safety',
        paragraphs: [
          'Driving conditions on Vancouver Island change quickly, and safety comes before schedule. The school may cancel or shorten a lesson where conditions make it unsafe to drive, and where we do, section 14 applies.',
          'If you believe conditions are unsafe, contact the school rather than simply not attending. Where we agree conditions are unsafe, the booking is treated as cancelled by the school. Where a lesson could reasonably have gone ahead, the ordinary notice levels in sections 8 to 10 apply.',
        ],
      },
      {
        title: '16. Withdrawing from a package, and refunds',
        paragraphs: [
          'Withdrawing from a package altogether is different from cancelling a single lesson. A refund of what is left over is available only where you withdraw for a valid reason, and the school decides whether a reason is valid.',
          'A valid reason is a genuine change in your circumstances that stops you continuing, such as moving away from our service area or a medical condition that prevents you driving. The school may ask you for evidence, and may decline a refund where evidence is not provided.',
          'Wanting a different instructor without giving a valid reason is not enough on its own. Simply not liking an instructor, changing your mind, deciding not to learn to drive for now, or a concern you have not first raised with the school, are not valid reasons and do not qualify for a refund.',
          'A genuine safety or security concern is different. Raise it with the school as soon as it arises so that it can be looked into and, where appropriate, a different arrangement made. Concerns of that kind are dealt with directly rather than through this policy.',
        ],
        bullets: [
          'The lessons you have already taken are charged at our standard published price, not at the discounted package rate.',
          'Whatever is left of what you paid is then refunded to your original method of payment.',
          'Amounts paid under an instalment plan are not refundable. Where a package was bought on an instalment plan, no refund arises under this section, and section 18 applies instead.',
          'The notice levels in sections 8 to 10 still apply to any lesson already booked at the time you withdraw.',
          'Where the amount already used exceeds what you have paid, no refund is due and the balance remains payable.',
        ],
        note: 'A package discount applies to a completed package. If you withdraw partway through, the discount is removed from the lessons you have already taken, those lessons are charged at the standard published price, and the remainder is refunded where the package was paid for in full. Amounts paid under an instalment plan are not refundable. Request a withdrawal in writing to book@drivingschoolbc.ca so the date is on record.',
        tone: 'warning',
      },
      {
        title: '17. How credits and refunds are worked out',
        paragraphs: [
          'A credit is held on your account. The next time you book, the credit is taken off the amount you owe. Credits are personal to you and cannot be given or sold to anyone else.',
          'Every amount under this policy is worked out from our standard published price, not from any discounted, promotional, or coupon price you paid.',
          'If you cancel one lesson out of a package, only that lesson is affected. The amount retained or credited is worked out from the price of that one lesson, not from the price of the whole package, and the rest of your lessons stay as they are.',
          'Refunds are returned to the original method of payment. How long a refund takes to appear depends on your bank or payment provider and is outside the school\'s control.',
        ],
      },
      {
        title: '18. Payment plans and instalments',
        paragraphs: [
          'Cancelling or rescheduling a lesson does not pause, reduce, or delay an instalment schedule. Instalments continue as agreed while the booking is rescheduled and the credit is held on your account.',
          'Amounts you have already paid under an instalment plan are not refundable. Withdrawing from a package does not return instalments already collected, and does not by itself end the plan.',
          'Where you withdraw from a package under section 16, the amount owed is recalculated using the standard published price of the lessons already taken. Where that recalculated amount is more than you have paid so far, the difference remains payable.',
          'Instalment terms themselves, including what happens to the outstanding balance on withdrawal, are set out in the Installment Policy.',
        ],
      },
      {
        title: '19. Road test bookings and the test-day vehicle',
        paragraphs: [
          'The Road Test Package includes the use of our vehicle on the day of your test. If you cancel the Road Test Package, the vehicle booking is cancelled with it, and the notice levels in sections 8 to 10 apply to the package as booked.',
          'Your road test appointment with ICBC is a separate booking that you hold with ICBC. Cancelling with us does not cancel your ICBC appointment, and cancelling your ICBC appointment does not cancel your booking with us. You must do both.',
          'Any fee ICBC charges for a late cancellation, a missed road test, or a rebooking is payable by you to ICBC and is not covered, credited, or refunded under this policy.',
        ],
        tone: 'warning',
      },
      {
        title: '20. Discounts, promotions, and coupons',
        paragraphs: [
          'A discount, promotion, or coupon reduces what you pay at the time of booking. It does not reduce the standard published price used to work out any amount under this policy.',
          'Where a booking made with a promotional code is cancelled, the school is not obliged to reinstate that code, and a promotion that has expired or been withdrawn cannot be reapplied to a rescheduled booking.',
          'Eligibility for promotions is set out in the Promotions & Discounts Policy.',
        ],
      },
      {
        title: '21. Records and disputes',
        paragraphs: [
          'The school keeps a record of bookings, cancellations, notices received, amounts retained, credits held, and refunds issued. Where there is a question about what happened, that record is what the school relies on.',
          'If you believe something has been recorded incorrectly, contact the school with the date and time of the booking and the details of the notice you gave, and we will review the record with you.',
        ],
      },
      {
        title: '22. Discretion and changes to this policy',
        paragraphs: [
          'The application of this policy, and of all school policies, is at the discretion of the school. The school may vary how this policy is applied in an individual case, and doing so does not set a precedent for any other booking or for any other student.',
          'The school may update this policy from time to time. The version published on this page at the time of your booking is the version that applies to that booking.',
        ],
      },
      {
        title: '23. Contact',
        paragraphs: [
          'For any question about a cancellation, a reschedule, a credit balance, or a withdrawal, contact the school directly.',
        ],
        bullets: [
          'book@drivingschoolbc.ca',
          '+1 (250) 542-3673',
        ],
      },
    ],
  },
  {
    id: 'terms-and-conditions',
    label: 'Terms & Conditions',
    href: '/policies/terms-and-conditions',
    effectiveDate: 'August 13, 2026',
    cardDescription: 'The general terms that apply when using the website, booking services, or submitting forms.',
    intro:
      'These Terms & Conditions describe the general rules that apply when using the website, submitting leads, booking lessons, purchasing packages, or participating in referral-based programs connected to Shanaya\'s Driving School.',
    highlights: ['Website use', 'Booking and payment terms', 'Attendance and conduct'],
    sections: [
      {
        title: 'Website and service use',
        paragraphs: [
          'By using this website, you agree to use it only for lawful purposes and to provide accurate information when submitting forms, referrals, or booking requests.',
          'The school may update pages, offers, policies, pricing, or availability at any time without guaranteeing uninterrupted access to every feature.',
        ],
      },
      {
        title: 'Bookings, pricing, and payments',
        paragraphs: [
          'Lesson, package, and promotional pricing displayed on the site may change over time and remains subject to confirmation at the time of booking or approval.',
          'Installment plans, discounts, and referral payouts are governed by the separate policy rules that apply to those services. Promotions and discounts apply to self-funded students only and do not apply to enrolments paid by a third-party organization, as set out in the Promotions & Discounts Policy.',
        ],
      },
      {
        title: 'Lesson cancellations and rescheduling',
        paragraphs: [
          'Cancelling or rescheduling a booked lesson is governed by the separate Cancellation & Rescheduling Policy, which sets out the notice periods that apply and what is refunded or rescheduled at each one.',
        ],
      },
      {
        title: 'Attendance and conduct',
        paragraphs: [
          'Students are expected to follow lesson scheduling, attendance, and conduct rules communicated by the school or instructor.',
          'Repeated no-shows, misuse of the website, abusive conduct, or submission of false information may result in refusal of service, cancellation, or removal from certain programs.',
        ],
      },
      {
        title: 'Liability and updates',
        paragraphs: [
          'The website content is provided for general information and operational use. While the school aims for accuracy, some information may change and may require direct confirmation before purchase or enrolment.',
          'Continued use of the website after policy or content updates means you accept the latest published terms displayed on the site.',
        ],
      },
    ],
  },
];

export const sitePolicies = allSitePolicies.filter((policy) => policy.id !== 'cookie-policy');

export const policyLinks = sitePolicies.map((policy) => ({
  id: policy.id,
  label: policy.label,
  href: policy.href,
}));



