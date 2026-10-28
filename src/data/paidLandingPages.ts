import { googleReviews } from "@/data/googleReviews";

export type PaidLandingPageId =
  | "victoria"
  | "near-me"
  | "pricing"
  | "road-test"
  | "beginner"
  | "confidence"
  | "icbc";

export type PaidLandingGoal = "beginner" | "road-test" | "refresher" | "general";
export type PaidLandingOptionalField = "testDate" | "licenceClass" | "serviceArea";

export type PaidLandingProduct = {
  kind: "course" | "package";
  id: string;
};

export type PaidLandingFaq = {
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

export type PaidLandingTestimonial = {
  id: string;
  quote: string | null;
  name: string;
  source: string;
  publishedLabel?: string;
  publishedAtDate?: string;
  stars?: number;
  avatarUrl?: string;
  reviewUrl?: string;
};

export type PaidLandingPageConfig = {
  id: PaidLandingPageId;
  path: string;
  aliases?: string[];
  adGroupNames: string[];
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    noindex: boolean;
  };
  hero: {
    eyebrow: string;
    h1: string;
    subhead: string;
    proofPoints: string[];
    /* The current beginner-page asset is intentionally reused. The conversion
       recommendations' requested photo replacements are outside this change. */
    imageAsset?: string;
    priceHighlights?: { label: string; detail: string }[];
  };
  conversion: {
    primaryCta: string;
    formHeading: string;
    defaultGoal: PaidLandingGoal;
    optionalFields: PaidLandingOptionalField[];
    offerTerms: string;
    thankYouCopy: string;
  };
  products: PaidLandingProduct[];
  benefits: { title: string; body: string }[];
  faqs: PaidLandingFaq[];
  testimonialIds: string[];
  serviceAreas: string[];
  serviceAreaIntro: string;
  analytics: { contentGroup: string; funnel: string };
};

const sharedOfferTerms =
  "The 30-minute driving assessment is free, with no obligation to purchase a package. Availability varies by area and time, and your appointment is confirmed by our team after we contact you.";

const sharedAreas = ["Victoria", "Langford", "Colwood", "Saanich", "View Royal", "Sidney"];
const coreLandingProducts: PaidLandingProduct[] = [
  { kind: "course", id: "beginner-driving-course" },
  { kind: "course", id: "lesson-road-test-prep-course" },
  { kind: "course", id: "make-your-own-class" },
];

export const paidLandingTestimonials: PaidLandingTestimonial[] = googleReviews;

export const paidLandingPages: PaidLandingPageConfig[] = [
  {
    id: "victoria",
    path: "/lp/driving-lessons-victoria",
    adGroupNames: ["Driving Lessons Victoria", "Victoria Driving Lessons", "Generic Driving Lessons"],
    seo: {
      title: "Driving Lessons in Victoria, BC",
      description:
        "Compare driving lesson options in Victoria and request a free assessment with Shanaya's Driving School.",
      canonicalPath: "/lp/driving-lessons-victoria",
      noindex: true,
    },
    hero: {
      eyebrow: "Driving instruction across Greater Victoria",
      h1: "Driving Lessons in Victoria, BC",
      subhead:
        "Build safe driving habits with patient instruction and lesson options matched to your experience.",
      proofPoints: ["ICBC-licensed instructors", "Dual-control training vehicles", "Genuine student reviews"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Request Lesson Availability",
      formHeading: "Find the Right Driving Lesson Plan",
      defaultGoal: "general",
      optionalFields: ["serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your request and will contact you to discuss your goals and available lesson times.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "A plan matched to your starting point", body: "Begin with an assessment so the next lesson focuses on the skills you actually need." },
      { title: "Practice in a dual-control vehicle", body: "Train in a school vehicle equipped so your instructor can intervene when needed." },
      { title: "Clear options before you pay", body: "Review the lesson length, price, inclusions and applicable policies before confirming a booking." },
    ],
    faqs: [
      { question: "What does a lesson cost?", answer: "Standard-area lessons are $89 CAD for 60 minutes or $133.50 CAD for 90 minutes, before GST. Package and fixed-course prices vary by inclusions." },
      { question: "Do you teach Class 7 and Class 5 drivers?", answer: "ICBC's general directory lists Shanaya's Driving School in Langford for Class 5 and 7 driver training. The listing is not ICBC approval or endorsement." },
      { question: "Where can lessons start?", answer: "Pickup and lesson-start arrangements depend on your address, preferred time and instructor availability. Add your area to the form so the team can confirm it." },
      { question: "What happens after I submit the form?", answer: "The team contacts you to confirm your goals, assessment availability and the terms that apply before anything is booked." },
    ],
    testimonialIds: ["yogita-bang", "alfred-taban", "alexis-dumaresq"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Tell us where you would like your lesson to start. Pickup availability is confirmed for your address and time.",
    analytics: { contentGroup: "paid-landing-victoria", funnel: "lesson-enquiry" },
  },
  {
    id: "near-me",
    path: "/lp/driving-school-near-me",
    adGroupNames: ["Near Me intent", "Driving School Near Me", "Driving Lessons & Classes Near Me"],
    seo: {
      title: "Driving Lessons Near You in Greater Victoria",
      description:
        "Check lesson coverage in Victoria, Langford, Colwood, Saanich and nearby communities served by Shanaya's Driving School.",
      canonicalPath: "/lp/driving-school-near-me",
      noindex: true,
    },
    hero: {
      eyebrow: "Local lesson coverage",
      h1: "Driving Lessons Near You in Greater Victoria",
      subhead: "Find driving instruction in Victoria, Langford, Colwood, Saanich and nearby communities we serve.",
      proofPoints: ["Area-specific availability", "Pickup options confirmed before booking", "Tap-to-call support"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Check Lessons in My Area",
      formHeading: "Request Lessons in Your Area",
      defaultGoal: "general",
      optionalFields: ["serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your request and will confirm whether your preferred area and time are available.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Start near familiar roads", body: "Tell us your pickup area so the team can check the right instructor route and availability." },
      { title: "Choose the right lesson type", body: "Use a custom lesson, beginner course or structured package according to your current goal." },
      { title: "No assumed availability", body: "The form requests a time; it does not claim a slot is booked until the team confirms it." },
    ],
    faqs: [
      { question: "Do you pick students up?", answer: "Pickup and drop-off are offered, but the exact address and time must be confirmed with the team before booking." },
      { question: "Do you serve Langford and Colwood?", answer: "Both Langford and Colwood are listed service areas. Availability still depends on the requested address, time and instructor schedule." },
      { question: "Are weekend lessons available?", answer: "Weekend and evening requests can be discussed. Submit your preferred timing and the team will confirm what is available rather than promising a slot online." },
      { question: "How far ahead should I book?", answer: "Availability changes, so request your preferred start window as early as practical. The form lets you say whether you want to start within 7 days, within 30 days or are still researching." },
    ],
    testimonialIds: ["yogita-bang", "alfred-taban", "vanessa-nicdao"],
    serviceAreas: [...sharedAreas, "Metchosin", "Sooke", "Duncan", "Salt Spring Island"],
    serviceAreaIntro: "These are listed service areas. Pickup, timing and the applicable location price are confirmed before booking.",
    analytics: { contentGroup: "paid-landing-near-me", funnel: "local-lesson-enquiry" },
  },
  {
    id: "pricing",
    path: "/lp/driving-lesson-prices",
    adGroupNames: ["Affordable / Driving Lesson Prices"],
    seo: {
      title: "Driving Lesson Prices in Victoria",
      description:
        "Compare current Victoria driving lesson rates, course inclusions and package options before requesting availability.",
      canonicalPath: "/lp/driving-lesson-prices",
      noindex: true,
    },
    hero: {
      eyebrow: "Prices in Canadian dollars",
      h1: "Driving Lesson Prices & Packages in Victoria",
      subhead: "Compare what is included, choose a lesson plan that fits your goals, and request current availability.",
      proofPoints: ["Published lesson lengths", "Prices shown before GST", "Itemized terms before payment"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
      priceHighlights: [
        { label: "$89 CAD", detail: "60-minute standard-area lesson + GST" },
        { label: "$133.50 CAD", detail: "90-minute standard-area lesson + GST" },
      ],
    },
    conversion: {
      primaryCta: "View Options & Request Availability",
      formHeading: "Ask About a Lesson Plan",
      defaultGoal: "general",
      optionalFields: ["serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your request and will contact you with the applicable availability, price and booking terms.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Compare equal units", body: "Every option shows its lesson length, standard-area price and the service included." },
      { title: "Know the final terms", body: "Tax, location pricing and any purchase-specific conditions are shown before payment." },
      { title: "Choose for your goal", body: "Compare beginner, refresher and road-test preparation options without assuming one plan fits everyone." },
    ],
    faqs: [
      { question: "Do prices include tax?", answer: "The prices shown on this page are in Canadian dollars and are before GST." },
      { question: "Is the first assessment free?", answer: "The 30-minute driving assessment is free and does not require a package purchase. The team must confirm the appointment time and area." },
      { question: "Do you offer instalments?", answer: "The site lists 4-, 6-, 8- and 12-month installment options with different requirements. Eligibility and the written schedule must be confirmed before payment.", link: { label: "Review payment plan options", href: "/payment-plan-options" } },
      { question: "What if I cancel?", answer: "Cancellation, late-notice and rescheduling conditions depend on the current school policy and your accepted booking terms.", link: { label: "Read the cancellation policy", href: "/policies/cancellation-and-rescheduling" } },
    ],
    testimonialIds: ["yogita-bang", "alexis-dumaresq", "vanessa-nicdao"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Victoria, Langford, Colwood and Sidney use standard pricing. Other listed areas may use regional or island pricing.",
    analytics: { contentGroup: "paid-landing-pricing", funnel: "price-enquiry" },
  },
  {
    id: "road-test",
    path: "/lp/icbc-road-test-preparation",
    adGroupNames: ["Road Test Preparation"],
    seo: {
      title: "ICBC Road Test Preparation in Victoria",
      description:
        "Request focused road-test preparation, mock evaluation or test-day vehicle options in Victoria without pass guarantees.",
      canonicalPath: "/lp/icbc-road-test-preparation",
      noindex: true,
    },
    hero: {
      eyebrow: "Class 7 and Class 5 preparation",
      h1: "ICBC Road Test Preparation in Victoria",
      subhead: "Practise road-test skills with a lesson plan based on your current driving and test timeline.",
      proofPoints: ["Focused practice options", "Mock evaluation available", "No pass guarantees"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Plan My Road Test Preparation",
      formHeading: "Tell Us About Your Road Test",
      defaultGoal: "road-test",
      optionalFields: ["testDate", "licenceClass", "serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your road-test preparation request and will contact you to discuss timing and suitable options.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Focus on observed weak areas", body: "Use feedback from an assessment or mock evaluation to decide what to practise next." },
      { title: "Plan around your test date", body: "Share the date if you have one so the team can explain realistic scheduling options." },
      { title: "Separate training from the ICBC test", body: "Shanaya's is an independent school and cannot guarantee or determine your official result." },
    ],
    faqs: [
      { question: "How many lessons do I need before my test?", answer: "There is no universal lesson count. Your current skills, practice between lessons and remaining weak areas matter more than a fixed number." },
      { question: "Can I use a school vehicle on test day?", answer: "The Road Test Package includes road-test preparation and a test-day vehicle, subject to booking availability and the written terms shown before payment." },
      { question: "What is a mock test evaluation?", answer: "It is a school-provided practice evaluation with feedback. It is not an official ICBC test and does not guarantee the official result." },
      { question: "What if my test is soon?", answer: "Add the date to the form. The team will confirm what can be scheduled without implying that a short timeline guarantees readiness." },
    ],
    testimonialIds: ["alfred-taban", "yogita-bang", "alexis-dumaresq"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Road-test preparation availability depends on your location, requested date and instructor schedule.",
    analytics: { contentGroup: "paid-landing-road-test", funnel: "road-test-enquiry" },
  },
  {
    id: "beginner",
    path: "/lp/beginner-driving-lessons",
    aliases: ["/beginner-driving-lessons-victoria"],
    adGroupNames: ["Beginner Driving Lessons"],
    seo: {
      title: "Beginner Driving Lessons in Victoria, BC",
      description:
        "Start beginner driving lessons in Victoria with a free assessment, dual-control training vehicle and clear lesson options.",
      canonicalPath: "/lp/beginner-driving-lessons",
      noindex: true,
    },
    hero: {
      eyebrow: "Beginner driving instruction · Greater Victoria",
      h1: "Beginner Driving Lessons in Victoria, BC",
      subhead:
        "Learn with a patient, ICBC-licensed driving instructor. Build safe driving habits at your pace with structured lessons in Greater Victoria.",
      proofPoints: ["ICBC-licensed instructors", "Dual-control training vehicles", "Genuine student reviews"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Request My Assessment",
      formHeading: "Find the Right Beginner Lesson Plan",
      defaultGoal: "beginner",
      optionalFields: ["licenceClass", "serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your assessment request and will contact you to discuss your experience and available times.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Start from your actual experience", body: "Tell us whether you are completely new or have practised before, then begin at an appropriate level." },
      { title: "Build skills in a clear order", body: "Structured options cover car control, road awareness, safe habits and focused practice." },
      { title: "Choose before you commit", body: "Use the free assessment to discuss fit and receive a recommendation without an obligation to buy a package." },
    ],
    faqs: [
      { question: "Can I start with no driving experience?", answer: "Yes. Beginner options start with basic vehicle control and progress according to your experience and demonstrated skills." },
      { question: "Is the training vehicle dual-controlled?", answer: "Yes. In-car lessons use dual-control training vehicles so the instructor can intervene when needed." },
      { question: "How long are beginner lessons?", answer: "The current Beginner's Driving Course includes 10 lessons of 90 minutes. Single 60- and 90-minute options are also listed; confirm the selected duration before payment." },
      { question: "Can a parent request information or purchase lessons?", answer: "A parent can submit an enquiry or purchase for a learner. The team will confirm the learner's valid licence, service details and applicable consent before in-car training." },
      { question: "What licence do I need?", answer: "You must hold a valid licence that permits the planned in-car training and carry it during each practical lesson. The team confirms the applicable requirement before booking." },
      { question: "How does the 30% limited-time offer work?", answer: "The Beginner's Driving Course is currently shown at 30% off for eligible standard-area bookings. You can also unlock 30% off custom 90-minute classes by selecting at least five in the same booking. Prices are before GST, and the offer cannot be combined with another promotion." },
    ],
    testimonialIds: ["yogita-bang", "alexis-dumaresq", "vanessa-nicdao"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Beginner lesson pickup and start locations are confirmed for your address and preferred time.",
    analytics: { contentGroup: "paid-landing-beginner", funnel: "beginner-assessment" },
  },
  {
    id: "confidence",
    path: "/lp/nervous-driver-lessons",
    adGroupNames: ["Nervous & Refresher Drivers"],
    seo: {
      title: "Nervous Driver Lessons in Victoria",
      description:
        "Request patient refresher driving lessons in Victoria with practice focused on the situations you want to improve.",
      canonicalPath: "/lp/nervous-driver-lessons",
      noindex: true,
    },
    hero: {
      eyebrow: "Supportive refresher instruction",
      h1: "Patient Lessons for Nervous & Returning Drivers",
      subhead: "Practise at your pace with supportive coaching focused on the situations that feel difficult.",
      proofPoints: ["Calm, respectful instruction", "Dual-control training vehicles", "Skill-focused lesson options"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Talk About My Driving Goals",
      formHeading: "Tell Us What You Want to Practise",
      defaultGoal: "refresher",
      optionalFields: ["serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your request and will contact you to discuss a comfortable starting point and available times.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Name the situation, not a label", body: "Tell us whether parking, busier roads, lane changes or returning after a break is the main concern." },
      { title: "Progress at a suitable pace", body: "The assessment helps identify a reasonable first environment and the next skill to practise." },
      { title: "Get concrete feedback", body: "Ask what is going well, what needs more practice and what a useful next lesson would cover." },
    ],
    faqs: [
      { question: "What if I have not driven for years?", answer: "A refresher option can begin with an assessment of current habits and focus on the skills or traffic situations that need attention." },
      { question: "Can we focus on parking?", answer: "Yes. Parking can be selected as a lesson focus, and a dedicated Parking Course is also listed." },
      { question: "Can you accommodate nervous drivers?", answer: "The school offers confidence and refresher options with a supportive approach. Tell the team what situations concern you so they can discuss an appropriate starting point." },
      { question: "How is my level assessed?", answer: "The free assessment is used to discuss your experience, observe current skills and explain suitable options. It is not an official ICBC test." },
    ],
    testimonialIds: ["alexis-dumaresq", "yogita-bang", "alfred-taban"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Availability for refresher lessons depends on your pickup area and preferred time.",
    analytics: { contentGroup: "paid-landing-confidence", funnel: "confidence-enquiry" },
  },
  {
    id: "icbc",
    path: "/lp/icbc-driving-lessons",
    adGroupNames: ["ICBC Driving Lessons", "Specific Driving Training"],
    seo: {
      title: "ICBC-Focused Driving Lessons in Victoria",
      description:
        "Request Class 7 or Class 5 driving lessons in Victoria focused on B.C. road rules and your current training needs.",
      canonicalPath: "/lp/icbc-driving-lessons",
      noindex: true,
    },
    hero: {
      eyebrow: "Independent Class 5 and 7 instruction",
      h1: "ICBC-Focused Driving Lessons in Victoria",
      subhead: "Learn B.C. driving rules and practise safe road habits with an ICBC-licensed instructor.",
      proofPoints: ["Class 5 and 7 training", "Independent driving school", "No ICBC endorsement claim"],
      imageAsset: "/landing/driving-lessons-saanich.webp",
    },
    conversion: {
      primaryCta: "Find My Training Plan",
      formHeading: "Request a Class 5 or 7 Lesson Plan",
      defaultGoal: "general",
      optionalFields: ["licenceClass", "serviceArea"],
      offerTerms: sharedOfferTerms,
      thankYouCopy: "We received your request and will contact you to discuss your licence class, goals and available training options.",
    },
    products: [...coreLandingProducts],
    benefits: [
      { title: "Match training to your licence stage", body: "Share your Class 7 or Class 5 status so the team can discuss a relevant option." },
      { title: "Practise specific driving skills", body: "Use a focused lesson for observation, road positioning, parking or another identified area." },
      { title: "Understand the school's role", body: "Shanaya's provides private instruction. ICBC operates the official licence tests and does not endorse this page." },
    ],
    faqs: [
      { question: "Does ICBC operate Shanaya's Driving School?", answer: "No. Shanaya's is an independent driving school. Its directory listing is a licensing record, not ICBC approval, recommendation or endorsement." },
      { question: "Do you teach Class 7 and Class 5 drivers?", answer: "ICBC's general directory lists the school in Langford for Class 5 and 7 driver training. The team confirms the appropriate training for your current licence before booking." },
      { question: "Can we practise a specific skill?", answer: "Yes. A custom-focus lesson can address an identified area such as parking, lane changes, observation or road positioning, subject to a safe and appropriate lesson plan." },
      { question: "Is road-test preparation included?", answer: "Road-test preparation is available as a separate course and in selected packages. Confirm the exact inclusions and price before purchase." },
    ],
    testimonialIds: ["yogita-bang", "alfred-taban", "vanessa-nicdao"],
    serviceAreas: sharedAreas,
    serviceAreaIntro: "Class 5 and 7 lesson availability is confirmed for your area, licence stage and preferred time.",
    analytics: { contentGroup: "paid-landing-icbc", funnel: "licence-training-enquiry" },
  },
];

export const paidLandingPagesById = Object.fromEntries(
  paidLandingPages.map((page) => [page.id, page]),
) as Record<PaidLandingPageId, PaidLandingPageConfig>;

export const paidLandingPagesByPath = Object.fromEntries(
  paidLandingPages.flatMap((page) => [page.path, ...(page.aliases ?? [])].map((path) => [path, page])),
) as Record<string, PaidLandingPageConfig>;

export const paidLandingTestimonialsById = Object.fromEntries(
  paidLandingTestimonials.flatMap((testimonial) => [
    [testimonial.id, testimonial],
    [testimonial.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), testimonial],
  ]),
) as Record<string, PaidLandingTestimonial>;

export const AD_GROUP_TO_PAID_LANDING_PAGE: Record<string, PaidLandingPageId> = Object.fromEntries(
  paidLandingPages.flatMap((page) => page.adGroupNames.map((adGroup) => [adGroup, page.id])),
) as Record<string, PaidLandingPageId>;
