import { courseCatalogById } from "@/data/courseCatalog";
import { createCourseLocationPricing, formatCoursePrice, STANDARD_SIXTY_MINUTE_RATE, STANDARD_NINETY_MINUTE_RATE } from "@/data/coursePricing";
import { paidLandingPagesById, type PaidLandingPageConfig, type PaidLandingPageId, type PaidLandingFaq } from "@/data/paidLandingPages";
import { featuredGoogleReviews } from "@/data/googleReviews";

type Choice = { title: string; body: string; price?: string; duration?: string };
export type PaidLandingVariant = {
  id: string;
  pageId: PaidLandingPageId;
  adGroup: string;
  provisional?: boolean;
  heading: string;
  subhead: string;
  intro: string;
  choicesHeading: string;
  choices: Choice[];
  reviewNames: string[];
  steps: { title: string; body: string }[];
  faqs: PaidLandingFaq[];
  finalHeading: string;
  finalCopy: string;
  notesPlaceholder: string;
  showAreas?: boolean;
  showRates?: boolean;
};
const policyLink = { label: "Read lesson and booking terms", href: "/policies/student-service-and-road-test-policy" };
const cost: PaidLandingFaq = { question: "What does a lesson cost?", answer: "Standard-area rates are $89 CAD for 60 minutes and $133.50 CAD for 90 minutes, before GST. Courses, packages and eligible promotions can have different prices. We confirm your lesson length, practice-driving time, location price and total before payment.", link: policyLink };
const licence: PaidLandingFaq = { question: "Can I start if I have never driven?", answer: "Yes. Tell us you are starting from the beginning so we can discuss a suitable first lesson. You must have a valid licence that permits the training; we check it before your first in-car lesson.", link: policyLink };
const pickup: PaidLandingFaq = { question: "Can my lesson start near home?", answer: "Tell us your neighbourhood and preferred timing. Pickup and drop-off arrangements depend on your address and the instructor’s schedule; the team confirms them before booking." };
const booking: PaidLandingFaq = { question: "Does requesting a callback book a lesson?", answer: "No. It is a free enquiry. We call to discuss your goals, available times and prices, and you decide whether to book. No payment is taken in the callback form." };
const local: PaidLandingFaq = { question: "Where is the school based?", answer: "Our Langford Campus is at Unit 124, 2770 Leigh Road. Our Victoria James Bay Branch is at 503 Niagara Street. Confirm the meeting or pickup arrangement for your lesson before travelling." };
const reviews = ["Amy Christy", "SHUBAM SHARMA", "Grace Wahl"];
const steps = [
  { title: "Tell us your starting point", body: "Request a callback and share your experience, lesson area and what you want to work on." },
  { title: "Compare your options", body: "Discuss a suitable lesson length, instructor availability and the total price." },
  { title: "Confirm your lesson", body: "Review your lesson details and booking terms, then choose whether to book." },
];
const beginner: Choice = { title: "Your first lessons", body: "Start with a patient instructor and an introduction suited to your experience. Discuss a first lesson before choosing a larger course." };
const skills: Choice = { title: "Build a specific skill", body: "Focus your lesson on a challenge such as parking, lane changes or intersections. Tell us what you would like to practise." };
const prep: Choice = { title: "Prepare for your road test", body: "Work on areas that need practice and discuss your test timeline. School preparation is separate from your ICBC test." };
const sixty: Choice = { title: "60-minute lesson", price: formatCoursePrice(STANDARD_SIXTY_MINUTE_RATE), duration: "Standard-area rate · CAD + GST", body: "Discuss a focused session around your current goal. Confirm the lesson plan and practice-driving time before booking." };
const ninety: Choice = { title: "90-minute lesson", price: formatCoursePrice(STANDARD_NINETY_MINUTE_RATE), duration: "Standard-area rate · CAD + GST", body: "Discuss a longer session for the areas you want to practise. This is the standard rate before any eligible package or course discount." };

const firstLesson: Choice = { ...sixty, title: "Your first driving lesson", body: "Start with one lesson before choosing a larger course. Discuss your licence, experience and an appropriate introduction with your instructor." };
const refresher: Choice = { ...ninety, title: "A lesson after a break", body: "Revisit the driving situations you want to practise. Discuss your current licence and experience before booking." };
const courseChoice: Choice = { title: "A structured beginner course", price: "Ask for a course quote", body: "Compare a course with individual lessons. Your quote confirms the lesson count, duration, any eligible discount and total before payment." };

export const paidLandingVariants: PaidLandingVariant[] = [
  {
    id: "victoria-confidence", pageId: "victoria", adGroup: "Victoria Driving Lessons",
    heading: "Driving Lessons in Victoria, Built Around Your Confidence",
    subhead: "From your first time behind the wheel to road-test preparation, get practical Class 5 and Class 7 lessons with calm, clear guidance.",
    intro: "Start with where you are today. Tell us what feels comfortable, what needs practice and when you would like to begin. We’ll help you compare the next steps.",
    choicesHeading: "Find your starting point", choices: [beginner, skills, prep], reviewNames: reviews, steps,
    faqs: [cost, licence, pickup, booking], finalHeading: "Find a lesson that fits your next step.",
    finalCopy: "Tell us your experience and preferred area. We’ll talk through lesson options and availability.",
    notesPlaceholder: "Your experience, neighbourhood or preferred lesson timing",
  },
  {
    id: "specific-skills", pageId: "icbc", adGroup: "Specific Driving Training",
    heading: "Need Help With Parking, Merging or Intersections?",
    subhead: "Choose targeted driving practice in Greater Victoria. Tell us which situations you find challenging and discuss a lesson focused on those skills.",
    intro: "You can enquire about one skill without choosing a full beginner programme. Your instructor can help plan appropriate practice for your experience.",
    choicesHeading: "What would you like to work on?",
    choices: [
      { title: "Parking and vehicle control", body: "Discuss focused practice for the parking manoeuvres and vehicle-control skills you find difficult." },
      { title: "Lane changes and merging", body: "Tell us about your experience and the situations you want to work towards with instructor support." },
      { title: "Intersections and turns", body: "Request a lesson focused on the intersections, turns or other situations you would like to practise." },
    ], reviewNames: ["Dallas Leck", "SHUBAM SHARMA", "Grace Wahl"],
    steps: [{ title: "Choose your focus", body: "Use a lesson option below or describe your challenge in the callback notes." }, { title: "Discuss a suitable lesson", body: "Share your experience and licence stage so we can discuss the right practice and lesson length." }, { title: "Practise with feedback", body: "Work with your instructor and discuss what to practise next." }],
    faqs: [{ question: "Can I book practice for just one skill?", answer: "Yes. Tell us the skill you want to focus on. We will discuss a suitable lesson and any related areas your instructor needs to assess." }, { question: "Is this an ICBC assessment?", answer: "No. These are private driving lessons. An instructor’s feedback is separate from an official ICBC test or result." }, cost, booking],
    finalHeading: "Let’s work on the skill you need next.", finalCopy: "Request a callback with your preferred focus, or call to discuss a lesson.", notesPlaceholder: "The skill you want to practise, your experience and preferred timing",
  },
  {
    id: "road-test-plan", pageId: "road-test", adGroup: "Road Test Preparation",
    heading: "Your ICBC Road Test Is Coming Up. Prepare With a Clear Plan.",
    subhead: "Get focused Class 5 or Class 7 practice, feedback and test-day vehicle options in Greater Victoria. Start with your test date and what you want to improve.",
    intro: "Preparing for a test is different from starting from scratch. Tell us your licence class, test date and centre so we can discuss suitable practice and available test-day support.",
    choicesHeading: "Choose the support you need before test day",
    choices: [{ ...prep, price: createCourseLocationPricing(courseCatalogById["road-test-prep-course"]).standard.label, duration: "90-minute lesson · CAD + GST" }, { title: "Mock test evaluation", price: createCourseLocationPricing(courseCatalogById["mock-test-evaluation"]).standard.label, duration: `60 minutes · CAD + GST. Or ${createCourseLocationPricing(courseCatalogById["mock-test-evaluation"], 90).standard.label} + GST for 90 minutes.`, body: "Ask for a practice evaluation and feedback to help identify areas to work on. It is not an official ICBC test or a prediction of your result." }, { title: "Test-day school vehicle", body: "Includes one hour of preparation and the school car for your ICBC road test. Confirm vehicle availability for your date and centre. Additional lessons are priced separately.", price: createCourseLocationPricing(courseCatalogById["lesson-road-test-prep-course"]).standard.label, duration: "1 hour of preparation + test-day car · CAD + GST" }],
    reviewNames: ["Amy Christy", "Dallas Leck", "Tesamae Padon"],
    steps: [{ title: "Share your test details", body: "Include your test date, class and centre in the optional notes, or tell us during the callback." }, { title: "Discuss your preparation", body: "Review lesson options, feedback needs and any test-day vehicle arrangements." }, { title: "Confirm the details", body: "Book your chosen school services separately from your ICBC test appointment." }],
    faqs: [{ question: "My test is soon. Can you help?", answer: "Send us your date and test centre so we can check instructor and vehicle availability. A callback request does not reserve a slot." }, { question: "Do you teach official test routes or guarantee a pass?", answer: "No. Lessons focus on driving skills and areas needing practice. ICBC sets the test and determines the result; no route or pass is guaranteed." }, { question: "What is included with the test-day vehicle?", answer: "The $250 CAD package includes one hour of preparation and the school car for your ICBC road test, before GST. Extra lessons and ICBC test fees are separate. Confirm your date, test centre, vehicle availability and itemised total before payment.", link: policyLink }, booking],
    finalHeading: "Make your next practice session count.", finalCopy: "Share your test date and the areas you want to improve. We’ll confirm the support available.", notesPlaceholder: "Test date, Class 5 or 7, test centre and areas you want to practise",
  },
  {
    id: "nervous-refresher", pageId: "confidence", adGroup: "Nervous & Refresher Drivers",
    heading: "Nervous About Driving? You Can Start at Your Own Pace.",
    subhead: "Patient driving lessons for beginners and returning drivers in Greater Victoria. Talk through what feels difficult and take the next step with support.",
    intro: "You do not need to arrive feeling confident. Tell us about your concerns or time away from driving so we can discuss a manageable starting point.",
    choicesHeading: "Support for where you are today",
    choices: [{ ...sixty, title: "One lesson at your pace", body: "Talk about your comfort level and discuss a suitable starting point. You can begin with an individual lesson before considering a course." }, refresher, skills],
    reviewNames: reviews,
    steps: [{ title: "Tell us what feels difficult", body: "Share as much or as little as you want in the optional notes or during your callback." }, { title: "Choose a starting point", body: "Discuss a suitable lesson, your current experience and preferred timing." }, { title: "Build with feedback", body: "Practise with your instructor and review your next steps together." }],
    faqs: [{ question: "Can I enquire if I feel very nervous?", answer: "Yes. Tell us what concerns you so we can discuss how a lesson could be structured around your experience and comfort level." }, { question: "Can I return after years without driving?", answer: "You can enquire about refresher lessons. Tell us how long it has been and your current licence status so we can discuss suitable training." }, licence, cost],
    finalHeading: "Start with a conversation, at your pace.", finalCopy: "Ask about a first or refresher lesson. There is no payment required to enquire.", notesPlaceholder: "Anything you want us to know about your comfort level or time away from driving",
  },
  {
    id: "nearby-lessons", pageId: "near-me", adGroup: "Near Me intent",
    heading: "Driving Lessons Near You in Greater Victoria",
    subhead: "Tell us your neighbourhood and preferred timing. We’ll check lesson availability and pickup options for your address.",
    intro: "Start with the practical details: where you are, when you can learn and what you want to practise. Pickup and location pricing are confirmed before booking.",
    choicesHeading: "Plan a lesson around your location", showAreas: true,
    choices: [firstLesson, refresher, prep],
    reviewNames: ["Grace Wahl", "SHUBAM SHARMA", "Amy Christy"], steps, faqs: [pickup, local, cost, booking],
    finalHeading: "Find out what’s available near you.", finalCopy: "Send your neighbourhood and preferred timing with your callback request.", notesPlaceholder: "Neighbourhood, pickup area and preferred days or times",
  },
  {
    id: "general-lessons", pageId: "victoria", adGroup: "Generic Driving Lessons",
    heading: "Learn to Drive With Calm, Practical Instruction",
    subhead: "Driving lessons for beginners, returning drivers and road-test preparation in Victoria and Langford. Get clear feedback and a next step that fits your experience.",
    intro: "Not sure which course to choose? Start with a conversation about your experience. You can discuss an individual lesson before considering a larger package.",
    choicesHeading: "Choose the kind of support you need", choices: [beginner, { title: "Refresh your driving", body: "Returning after a break? Discuss your current experience and the situations you want to practise." }, prep],
    showRates: true, reviewNames: ["SHUBAM SHARMA", "Grace Wahl", "Dallas Leck"], steps, faqs: [cost, licence, pickup, booking],
    finalHeading: "Let’s find your next step behind the wheel.", finalCopy: "Talk to our team about your goals, lesson options and available times.", notesPlaceholder: "New driver, returning driver or road-test preparation? Tell us what you need.",
  },
  {
    id: "local-school", pageId: "near-me", adGroup: "Driving School Near Me",
    heading: "Looking for a Driving School Near You?",
    subhead: "Get to know Shanaya’s Driving School: local lesson options, patient instruction and clear booking details in Greater Victoria.",
    intro: "Choosing a school starts with knowing who you’ll learn with and what you’re booking. Read learner experiences, see our training vehicle and ask about your lesson area.",
    choicesHeading: "Choose the lesson support you need", showAreas: true,
    choices: [firstLesson, refresher, prep],
    reviewNames: ["SHUBAM SHARMA", "Grace Wahl", "Dallas Leck"], steps,
    faqs: [local, pickup, { question: "Where can I read learner reviews?", answer: "The review links on this page open the original Google reviews. The carousel contains selected five-star experiences; the full Google listing includes the wider feedback. Individual results vary." }, cost],
    finalHeading: "Get to know your local driving school.", finalCopy: "Call us or request a callback to discuss your area, instructor and lesson options.", notesPlaceholder: "Your neighbourhood and what you would like to know before choosing a school",
  },
  {
    id: "victoria-next-step", pageId: "victoria", adGroup: "Driving Lessons Victoria",
    heading: "Victoria Driving Lessons That Focus on Your Next Step",
    subhead: "One-to-one driving instruction for first lessons, specific skills and road-test preparation. Tell us what you want to work on next.",
    intro: "Your next lesson should have a purpose. Whether you are learning the basics or preparing for a test, discuss your starting point and get feedback on where to focus.",
    choicesHeading: "Where would you like to go next?", choices: [beginner, skills, prep], reviewNames: ["Tesamae Padon", "Dallas Leck", "Grace Wahl"], steps,
    faqs: [pickup, { question: "Do I have to buy a package?", answer: "You can enquire about an individual lesson as well as a course or package. Discuss your goal and compare the options before deciding." }, cost, booking],
    finalHeading: "Choose a practical next step.", finalCopy: "Share your goal and preferred lesson area. We’ll help you compare available options.", notesPlaceholder: "Your next driving goal, experience and preferred area",
  },
  {
    id: "lesson-options-nearby", pageId: "near-me", adGroup: "Driving Lessons & Classes Near Me",
    heading: "Find Driving Lessons and Training Options Near You",
    subhead: "Compare beginner lessons, targeted practice and refresher or road-test preparation in Greater Victoria. Start with the kind of help you need.",
    intro: "Looking for a class can mean different things. These options focus on in-car training; tell us your goal so we can discuss the format that fits.",
    choicesHeading: "Choose a lesson direction", choices: [beginner, skills, { title: "Refresh or prepare for a test", body: "Discuss a return to driving or focused preparation for an upcoming road test." }], showAreas: true,
    reviewNames: ["Komal Rash", "Grace Wahl", "Dallas Leck"], steps,
    faqs: [{ question: "Are these classroom courses?", answer: "The options on this page are for in-car driving lessons. If you need knowledge-test study support, tell us during your callback so we can explain the separate options." }, { question: "Does this mean an ICBC-approved GLP course?", answer: "No. This page describes private Class 5 and Class 7 driving lessons. It does not advertise an ICBC-approved GLP course or any licensing-time credit." }, pickup, cost],
    finalHeading: "Find the lesson option that fits.", finalCopy: "Tell us your experience, area and preferred focus. We’ll explain the available choices.", notesPlaceholder: "Lesson type, experience, neighbourhood and preferred timing",
  },
  {
    id: "lesson-prices", pageId: "pricing", adGroup: "Affordable / Driving Lesson Prices", provisional: true,
    heading: "Driving Lesson Prices in Victoria, Explained Up Front",
    subhead: "Compare lesson lengths and standard rates, then confirm what is included and the total before choosing your lesson.",
    intro: "Compare time and inclusions as well as the price. These are standard-area rates before GST; courses, packages and eligible offers can be priced differently.",
    choicesHeading: "Start with a clear price comparison", showRates: true,
    choices: [sixty, ninety, { title: "Course or package", price: "Compare your options", body: "Ask for a quote showing the number and length of lessons, any test-day services, applicable discounts, tax and total." }], reviewNames: ["Dallas Leck", "SHUBAM SHARMA", "Grace Wahl"], steps,
    faqs: [cost, { question: "Are discounts included in these rates?", answer: "No. These are standard lesson rates before any eligible course or package promotion. Discounts apply only to eligible self-funded bookings, not sponsored or third-party-funded enrolments. Ask which current offers apply to your chosen services and location; your itemised quote confirms the final price." }, { question: "Can I ask about payment options?", answer: "Yes. Ask about the options available for your selected booking. Any instalment or third-party payment arrangement has its own terms and eligibility; it is not guaranteed." }, booking],
    finalHeading: "Know your lesson price before you book.", finalCopy: "Request a callback to compare lesson lengths, inclusions and the price for your location.", notesPlaceholder: "Preferred lesson length, location and any package or payment questions",
  },
  {
    id: "first-lesson", pageId: "beginner", adGroup: "Beginner", provisional: true,
    heading: "Never Driven Before? Start With a Patient Instructor.",
    subhead: "Take your first step with beginner driving lessons in Greater Victoria. Get clear explanations and support suited to your starting point.",
    intro: "You do not need driving experience to enquire. Start by discussing a first lesson, what you would like help with and the licence you hold. A larger course can be considered after you understand your options.",
    choicesHeading: "A starting point for first-time drivers",
    choices: [firstLesson, { ...ninety, title: "A longer first lesson" }, courseChoice],
    reviewNames: ["Komal Rash", "SHUBAM SHARMA", "Grace Wahl"], steps,
    faqs: [licence, { question: "How many lessons will I need?", answer: "There is no fixed number that suits everyone. Your starting point, practice and progress affect the plan. Discuss your progress with your instructor before choosing more lessons." }, cost, booking],
    finalHeading: "Your first lesson can start with a simple conversation.", finalCopy: "Tell us you are new to driving. We’ll explain lesson options and what to arrange before you begin.", notesPlaceholder: "Your licence stage, first-lesson questions and preferred area",
  },
];

/** Explicit opt-in only. Unrecognised or cross-family variants leave the control unchanged. */
export const getPaidLandingVariant = (pageId: PaidLandingPageId, search: string) => {
  const id = new URLSearchParams(search).get("variant");
  return paidLandingVariants.find((variant) => variant.id === id && variant.pageId === pageId);
};
export const getVariantReviews = (variant: PaidLandingVariant) => [
  ...variant.reviewNames.flatMap((name) => featuredGoogleReviews.filter((review) => review.name === name)),
  ...featuredGoogleReviews.filter((review) => !variant.reviewNames.includes(review.name)),
];
export const applyPaidLandingVariant = (base: PaidLandingPageConfig, variant?: PaidLandingVariant): PaidLandingPageConfig => variant ? {
  ...base,
  seo: { ...base.seo, title: variant.heading, description: variant.subhead },
  hero: { ...base.hero, h1: variant.heading, subhead: variant.subhead },
  conversion: { ...base.conversion, formDescription: variant.finalCopy },
  pricingHeading: variant.choicesHeading,
  faqs: variant.faqs,
  finalHeading: variant.finalHeading,
} : base;
export const getPaidLandingVariantUrl = (variant: PaidLandingVariant) => `${paidLandingPagesById[variant.pageId].path}?variant=${variant.id}`;

/** Retain every featured review while placing relevant learner experiences first. */
export const getControlReviews = (pageId: PaidLandingPageId) => {
  const firstReviewer: Record<PaidLandingPageId, string> = {
    victoria: "SHUBAM SHARMA", "near-me": "Grace Wahl", pricing: "Dallas Leck",
    "road-test": "Danica Rabosa", beginner: "Komal Rash", confidence: "Amy Christy",
    icbc: "Dallas Leck", "road-test-confidence": "Danica Rabosa",
  };
  return [...featuredGoogleReviews.filter((review) => review.name === firstReviewer[pageId]),
    ...featuredGoogleReviews.filter((review) => review.name !== firstReviewer[pageId])];
};
