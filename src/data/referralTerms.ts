export type ReferralTermsEntry = {
  id?: string;
  text: string;
  bullets?: string[];
};

export type ReferralTermsSection = {
  id: string;
  number: number;
  title: string;
  entries: ReferralTermsEntry[];
};

export const REFERRAL_TERMS_PATH = "/affiliate/terms-and-conditions";
export const REFERRAL_TERMS_EFFECTIVE_DATE_LABEL = "March 16, 2026";
export const REFERRAL_TERMS_VERSION = "2026-03-16";

export const referralTermsIntro = [
  "These Terms and Conditions (\"Terms\") govern participation in the Ruley Rewards Referral Program (the \"Program\") operated by Shanaya's Driving School (\"Company\", \"we\", \"our\", or \"us\"). By registering for or participating in the Program, the participant (\"Participant\", \"you\", or \"your\") agrees to be legally bound by these Terms.",
  "These Terms are intended to comply with applicable laws of British Columbia, Canada, including but not limited to the Business Practices and Consumer Protection Act (BPCPA), Personal Information Protection Act (PIPA), Canada Anti-Spam Legislation (CASL), and the Competition Act (Canada).",
];

export const referralTermsSections: ReferralTermsSection[] = [
  {
    id: "eligibility",
    number: 1,
    title: "Eligibility",
    entries: [
      { id: "1.1", text: "Participation in the Program is open to individuals who are at least sixteen (16) years of age." },
      { id: "1.2", text: "Individuals under the age of nineteen (19) must provide parent or legal guardian consent prior to participating in the Program." },
      { id: "1.3", text: "Shanaya's Driving School reserves the right, at its sole discretion, to approve, deny, suspend, or terminate participation in the Program at any time." },
    ],
  },
  {
    id: "referral-qualification",
    number: 2,
    title: "Referral Qualification",
    entries: [
      {
        id: "2.1",
        text: "A referral qualifies for commission only if all of the following conditions are met:",
        bullets: [
          "The referred individual uses the Participant's unique referral link.",
          "The referred individual is a new customer who has never previously purchased services from Shanaya's Driving School.",
          "The referred individual purchases and fully pays for an eligible driving package.",
        ],
      },
      {
        id: "2.2",
        text: "Partial payments, deposits, or installment payments do not qualify for referral commission until the entire package price has been received by the Company.",
      },
      {
        id: "2.3",
        text: "Shanaya's Driving School reserves the right to determine which services or packages qualify for referral commission.",
      },
    ],
  },
  {
    id: "referral-attribution",
    number: 3,
    title: "Referral Attribution",
    entries: [
      { id: "3.1", text: "Referrals will be credited to the Participant whose referral link was first validly recorded by the Company's referral tracking system." },
      { id: "3.2", text: "If multiple participants refer the same customer, only the first valid referral recorded in the system shall be eligible for commission." },
      { id: "3.3", text: "Referrals remain valid for fifteen (15) days from the first recorded click on the referral link." },
      { id: "3.4", text: "If the referred customer does not complete a purchase within this period, the referral will expire." },
      { id: "3.5", text: "Shanaya's Driving School's internal system records shall be considered final and binding in determining referral attribution." },
    ],
  },
  {
    id: "commission-structure",
    number: 4,
    title: "Commission Structure",
    entries: [
      { id: "4.1", text: "Participants shall earn a base commission of five percent (5%) of the total paid value of an eligible package purchased through their referral link." },
      { id: "4.2", text: "Additional commission tiers of six percent (6%) and seven percent (7%) may be unlocked based on the number of successful paid referrals within a rolling twelve (12) month period." },
      { id: "4.3", text: "The Company reserves the right to modify commission rates, tiers, or bonus structures at its sole discretion." },
      { id: "4.4", text: "Shanaya's Driving School may also apply maximum commission limits or promotional caps where necessary to maintain program integrity." },
    ],
  },
  {
    id: "payment-terms",
    number: 5,
    title: "Payment Terms",
    entries: [
      { id: "5.1", text: "Referral commissions become eligible for payment thirty (30) days after the referred package has been fully paid." },
      { id: "5.2", text: "This verification period allows the Company to review refunds, cancellations, fraud, and payment validity." },
      { id: "5.3", text: "Commissions are generally processed monthly on or around the fifteenth (15th) day of each calendar month." },
      { id: "5.4", text: "Payments may be issued via bank transfer, Interac e-Transfer, or applied as credit toward driving lessons at Shanaya's Driving School." },
    ],
  },
  {
    id: "minimum-payout-threshold",
    number: 6,
    title: "Minimum Payout Threshold",
    entries: [
      { id: "6.1", text: "Referral earnings must reach a minimum balance of fifty dollars ($50 CAD) before payment is issued." },
      { id: "6.2", text: "Earnings below the minimum payout threshold will roll over to the next payout cycle until the threshold is reached." },
    ],
  },
  {
    id: "refunds-and-cancellations",
    number: 7,
    title: "Refunds and Cancellations",
    entries: [
      { id: "7.1", text: "Customers may request cancellation within twenty-four (24) hours of purchase. If the cancellation request is approved, a non-refundable administrative processing fee of one hundred dollars ($100 CAD) will be charged, and no referral commission will be paid on that sale." },
      { id: "7.2", text: "Shanaya's Driving School reserves the right to review all cancellation requests and determine eligibility according to internal policies." },
      { id: "7.3", text: "If a referred purchase is cancelled, refunded, disputed, reversed, or otherwise invalidated for any reason, the associated referral commission shall be voided or recovered and may be deducted from future payouts or requested to be repaid upon demand." },
    ],
  },
  {
    id: "marketing-guidelines",
    number: 8,
    title: "Marketing Guidelines",
    entries: [
      { id: "8.1", text: "Participants must promote the Program truthfully, responsibly, and in compliance with applicable laws." },
      {
        id: "8.2",
        text: "Participants must not:",
        bullets: [
          "Misrepresent services, pricing, licensing outcomes, or guarantees.",
          "Impersonate employees, instructors, or official representatives of Shanaya's Driving School.",
          "Create misleading advertisements or unauthorized paid promotions representing the Company.",
          "Use spam or deceptive marketing tactics.",
        ],
      },
      { id: "8.3", text: "Shanaya's Driving School reserves the right to require removal of any promotional content that violates these guidelines." },
    ],
  },
  {
    id: "anti-spam-compliance",
    number: 9,
    title: "Compliance with Anti-Spam Laws",
    entries: [
      { id: "9.1", text: "Participants must comply with the Canada Anti-Spam Legislation (CASL) when promoting the Program." },
      { id: "9.2", text: "Participants must not send unsolicited commercial electronic messages, including emails, text messages, or social media messages, without proper consent as required under CASL." },
      { id: "9.3", text: "The Company shall not be responsible for any violations of the Canada Anti-Spam Legislation (CASL) committed by Participants." },
    ],
  },
  {
    id: "fraud-and-misuse",
    number: 10,
    title: "Fraud and Misuse",
    entries: [
      { id: "10.1", text: "Participants shall not engage in activities that manipulate or exploit the referral system." },
      {
        id: "10.2",
        text: "Prohibited activities include but are not limited to:",
        bullets: [
          "Self-referrals",
          "Duplicate accounts",
          "Fake registrations",
          "Artificial referral generation",
          "Manipulation of referral tracking systems",
          "Coordinated referral abuse",
        ],
      },
      { id: "10.3", text: "Shanaya's Driving School reserves the right to withhold commissions, suspend accounts, or permanently remove participants where fraudulent activity is suspected." },
    ],
  },
  {
    id: "account-termination",
    number: 11,
    title: "Account Termination",
    entries: [
      {
        id: "11.1",
        text: "Shanaya's Driving School may suspend or terminate participation if a Participant:",
        bullets: [
          "violates these Terms",
          "engages in fraudulent activity",
          "misuses the referral program",
          "harms the reputation or business interests of the Company.",
        ],
      },
      { id: "11.2", text: "Upon termination, any pending or unpaid commissions may be forfeited." },
    ],
  },
  {
    id: "program-changes",
    number: 12,
    title: "Program Changes",
    entries: [
      { id: "12.1", text: "Shanaya's Driving School reserves the right to modify, suspend, or terminate the referral program at any time without prior notice." },
      {
        id: "12.2",
        text: "This may include changes to:",
        bullets: [
          "commission percentages",
          "bonus structures",
          "eligibility rules",
          "referral validity periods",
        ],
      },
      { id: "12.3", text: "Continued participation following updates constitutes acceptance of revised Terms." },
    ],
  },
  {
    id: "privacy-and-personal-information",
    number: 13,
    title: "Privacy and Personal Information",
    entries: [
      { id: "13.1", text: "Participation in the Program may require the collection of personal information including contact details and referral tracking data." },
      { id: "13.2", text: "Personal information will be collected, used, and stored in accordance with the Personal Information Protection Act (PIPA) of British Columbia." },
      {
        id: "13.3",
        text: "Information will be used solely for purposes including:",
        bullets: [
          "administering the referral program",
          "verifying referrals",
          "processing payments",
          "communicating with participants.",
        ],
      },
      { id: "13.4", text: "Participants must not misuse personal information of referred individuals." },
    ],
  },
  {
    id: "tax-responsibility",
    number: 14,
    title: "Tax Responsibility",
    entries: [
      { id: "14.1", text: "Participants are solely responsible for reporting and paying any taxes applicable to referral earnings under Canadian tax laws." },
      { id: "14.2", text: "The Company shall not be responsible for withholding or remitting taxes related to Participant earnings." },
    ],
  },
  {
    id: "limitation-of-liability",
    number: 15,
    title: "Limitation of Liability",
    entries: [
      {
        id: "15.1",
        text: "Shanaya's Driving School shall not be liable for lost commissions resulting from:",
        bullets: [
          "incorrect referral link sharing",
          "technical errors",
          "system outages",
          "events beyond reasonable control.",
        ],
      },
      { id: "15.2", text: "Participation in the Program is undertaken at the Participant's own risk." },
    ],
  },
  {
    id: "independent-participation",
    number: 16,
    title: "Independent Participation",
    entries: [
      { id: "16.1", text: "Participation in the Program does not create any employment, partnership, agency, franchise, or joint venture relationship between the Participant and Shanaya's Driving School." },
      { id: "16.2", text: "Participants act solely as independent referrers and may not represent themselves as employees, instructors, or official representatives of the Company." },
      { id: "16.3", text: "Participants have no authority to bind the Company to any agreement or obligation." },
    ],
  },
  {
    id: "conduct-and-online-communications",
    number: 17,
    title: "Conduct and Online Communications",
    entries: [
      { id: "17.1", text: "Participants must maintain professional conduct when promoting Shanaya's Driving School." },
      { id: "17.2", text: "Participants must not publish or distribute false, misleading, defamatory, or malicious statements about the Company, its staff, or services." },
      {
        id: "17.3",
        text: "Nothing in this clause prevents lawful or honest reviews; however, knowingly false statements intended to harm the Company may result in:",
        bullets: [
          "termination from the Program",
          "cancellation of unpaid commissions",
          "legal action where reputational or financial harm occurs.",
        ],
      },
    ],
  },
  {
    id: "dispute-resolution",
    number: 18,
    title: "Dispute Resolution",
    entries: [
      { id: "18.1", text: "In the event of a dispute relating to the Program, the parties agree to first attempt resolution through good-faith negotiation." },
      { id: "18.2", text: "Participants agree that disputes relating to the Program shall not be brought as individual lawsuits against the Company, and participation in the Program constitutes agreement to resolve disputes through negotiation or alternative dispute resolution methods permitted under the laws of British Columbia." },
    ],
  },
  {
    id: "governing-law",
    number: 19,
    title: "Governing Law",
    entries: [
      { id: "19.1", text: "These Terms shall be governed by and interpreted in accordance with the laws of the Province of British Columbia and the federal laws of Canada applicable therein." },
    ],
  },
];

export const referralTermsClosing =
  "By participating in the Ruley Rewards Program, the Participant confirms that they have read, understood, and agree to these Terms and Conditions.";


