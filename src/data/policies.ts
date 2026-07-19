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
};

export type SitePolicy = {
  id: string;
  label: string;
  href: string;
  cardDescription: string;
  intro: string;
  highlights: string[];
  sections: PolicyContentSection[];
  installmentPlans?: PolicyInstallmentPlan[];
};

const installmentPlans: PolicyInstallmentPlan[] = [
  { duration: '4-month plan', frequency: 'Monthly', requirement: 'Standard enrollment' },
  { duration: '6-month plan', frequency: 'Monthly', requirement: 'Standard enrollment' },
  { duration: '8-month plan', frequency: 'Monthly', requirement: 'Verification required' },
  { duration: '12-month plan', frequency: 'Monthly', requirement: 'Verification required' },
];

const allSitePolicies: SitePolicy[] = [
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    href: '/policies/privacy-policy',
    cardDescription: 'How we collect, use, store, disclose, and protect personal information across the website, bookings, and Ruley Rewards referrals.',
    intro:
      'Effective Date: March 16, 2026. Shanaya\'s Driving School ("Company", "we", "our", or "us") respects the privacy of individuals who interact with our website, services, and programs, including the Ruley Rewards Referral Program. By accessing our website, enrolling in driving services, participating in referral programs, or otherwise interacting with the Company, you consent to the practices described in this Privacy Policy.',
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
          'Course enrollment details',
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
          'Processing payments and enrollments.',
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
          'All plans remain subject to identity verification, internal review, and confirmation through the individual payment schedule issued at enrollment.',
        ],
        note: 'Specific payment amounts and due dates are confirmed during registration and may differ by package or course selection.',
      },
      {
        title: 'Missed payments and delinquency',
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
          'Installment enrollment applies to the full course commitment, not a pay-as-you-go arrangement for each lesson attended.',
          'Stopping attendance, delaying booking activity, or voluntarily withdrawing does not automatically reduce the outstanding balance owed under the approved agreement.',
        ],
      },
      {
        title: 'Recovery and enforcement',
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
    cardDescription: 'How referral cookies, analytics, and browser storage are used on the website.',
    intro:
      'This Cookie Policy explains how the website uses cookies or similar browser storage technologies to support core site functionality, referral attribution, analytics, and security-related features.',
    highlights: ['Referral attribution', 'Site functionality', 'Cookie controls'],
    sections: [
      {
        title: 'Why cookies are used',
        paragraphs: [
          'Cookies help the website remember useful information between visits, support smoother user interactions, and maintain essential functionality such as referral attribution or session-related behavior.',
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
          'Disabling some cookies may reduce site functionality, interfere with form behavior, or prevent referrals from being attributed correctly.',
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
    id: 'terms-and-conditions',
    label: 'Terms & Conditions',
    href: '/policies/terms-and-conditions',
    cardDescription: 'The general terms that apply when using the website, booking services, or submitting forms.',
    intro:
      'These Terms & Conditions describe the general rules that apply when using the website, submitting leads, booking lessons, purchasing packages, or participating in referral-based programs connected to Shanaya\'s Driving School.',
    highlights: ['Website use', 'Booking and payment terms', 'Operational rules'],
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
          'Installment plans, discounts, and referral payouts are governed by the separate policy rules that apply to those services.',
        ],
      },
      {
        title: 'Cancellations, attendance, and conduct',
        paragraphs: [
          'Students are expected to follow lesson scheduling, attendance, and conduct rules communicated by the school or instructor.',
          'Repeated no-shows, misuse of the website, abusive conduct, or submission of false information may result in refusal of service, cancellation, or removal from certain programs.',
        ],
      },
      {
        title: 'Liability and updates',
        paragraphs: [
          'The website content is provided for general information and operational use. While the school aims for accuracy, some information may change and may require direct confirmation before purchase or enrollment.',
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



