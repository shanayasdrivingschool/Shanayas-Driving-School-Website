/* The /faq hub. Answers are plain strings with inline `[label](href)` links so
   the same source renders three ways without a second copy of the text:
   React (Link / anchor), the static crawler HTML (real <a href>), and FAQPage
   schema (link syntax stripped, see faqAnswerToPlainText).

   Links replace the old "official sources" list at the bottom of the page. Every
   ICBC citation now sits in the sentence it supports, and internal links point at
   the page that carries the detail.

   House style for answer copy: lead with the direct answer, keep sentences short,
   use contractions, and no em dashes. Say the unhelpful truth plainly where there
   is one rather than dressing it up.

   Two review dates, because they mean different things: the original ICBC rule
   set was checked on FAQ_LAST_REVIEWED, and the answers added later, plus every
   fee amount, on FAQ_EXPANDED_REVIEWED. */

export type FaqCategoryId =
  | "knowledge-test"
  | "road-test"
  | "licence-rules"
  | "lessons"
  | "schools"
  | "pricing-booking"
  | "other-licences";

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  description: string;
};

export type SiteFaq = {
  /* Doubles as the accordion value and the in-page anchor, so an answer can link
     to another answer with [label](#id) and support can share /faq#id. */
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
  /* Extra search terms only, never rendered. Covers the words people type that
     the answer itself does not use ("learners", "rebook", "afterpay"). */
  keywords?: string[];
};

export const FAQ_LAST_REVIEWED = "July 21, 2026";
export const FAQ_EXPANDED_REVIEWED = "July 31, 2026";

export const faqPageSeo = {
  title: "BC Knowledge Test, Road Test & Lesson FAQ",
  description:
    "Search verified answers about B.C. Class 7 knowledge and road tests, L and N restrictions, GLP changes, instructors, insurance, lesson prices and booking.",
  image: "/landing/faq.webp",
  eyebrow: "B.C. driving FAQ",
  h1: "B.C. knowledge test, road test and lesson answers",
  heroDescription:
    "Search for what you need, or browse by topic. Every ICBC rule links to the official page it came from, and anything about the school links to our current catalogue.",
  intro: [
    "There are two kinds of answer on this page, and we keep them apart. Some come from ICBC and RoadSafetyBC, who run the tests and decide who gets a licence. The rest come from our own catalogue. A driving school can't issue a licence, pick your test route or promise you a pass, so we don't pretend otherwise.",
    "Every rule and figure here was checked against the official page it links to. Requirements and fees do change, so open the link before you rely on an amount or a deadline.",
    "School prices are catalogue amounts before GST. Course, instructor, vehicle and service-area availability all depend on the date you want. Our lesson cancellation terms are published in full, and turn on how much notice you give: 24 hours or more, inside 24 hours, or inside an hour.",
  ],
};

export const faqCategories: FaqCategory[] = [
  {
    id: "knowledge-test",
    label: "Knowledge test",
    description: "The written test, what it costs, the languages it comes in, and what a pass actually gets you.",
  },
  {
    id: "road-test",
    label: "Road test",
    description: "Booking, waits, what to bring, the vehicle check, what's assessed, and retests.",
  },
  {
    id: "licence-rules",
    label: "L & N rules",
    description: "Learner and novice restrictions, insurance, and what changes on October 19, 2026.",
  },
  {
    id: "lessons",
    label: "Lessons & practice",
    description: "What lessons cover, how many you need, and training for particular situations.",
  },
  {
    id: "schools",
    label: "Schools & instructors",
    description: "Licensing, checking an instructor, complaints, reviews and accessibility.",
  },
  {
    id: "pricing-booking",
    label: "Pricing & booking",
    description: "Rates, road-test vehicles, service areas, pickup and payment.",
  },
  {
    id: "other-licences",
    label: "Newcomers & other licences",
    description: "Licence exchange, Class 4 and ride-hailing, and medical fitness.",
  },
];

export const siteFaqs: SiteFaq[] = [
  /* ─────────────  Knowledge test  ───────────── */
  {
    id: "knowledge-test-format",
    category: "knowledge-test",
    question: "What is on the B.C. Class 7 knowledge test, and what does it cost?",
    answer:
      "It's 50 multiple-choice questions. You need 40 right to pass, you get up to 45 minutes, and each attempt costs $15. That fee is set in law by B.C.'s [Motor Vehicle Fees Regulation](https://www.bclaws.gov.bc.ca/civix/document/id/loo61/loo61/334_91), so you can check it at the source instead of trusting somebody's summary. The format is the same whether you take [ICBC's test](https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test) online or at an office. Our [knowledge-test guide](/knowledge-test-guide) walks through both, and the [practice questions](/knowledge-test-practice) use the same style.",
    keywords: ["written test", "theory test", "50 questions", "pass mark", "$15", "learners test"],
  },
  {
    id: "online-pass-not-a-licence",
    category: "knowledge-test",
    question: "How do I get my L, and does passing the online knowledge test let me start driving?",
    answer:
      "Passing online gets you a result, not a licence, so no, you still can't drive. ICBC keeps that result valid for one year. To actually get your L, go to a driver licensing office with [one primary and one secondary piece of ID](https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID), pass the vision screening, do the photo and whichever consent steps apply to you, and pay the $10 learner's licence (photo) fee set by the [Motor Vehicle Fees Regulation](https://www.bclaws.gov.bc.ca/civix/document/id/loo61/loo61/334_91). If you're under 19 you currently need a parent or guardian to consent, and that threshold drops to under 18 on October 19, 2026. ICBC lists the full sequence on [get your learner's (L) licence](https://www.icbc.com/driver-licensing/new-drivers/Get-your-L).",
    keywords: ["online pass", "L licence", "get my L", "ID", "identification", "vision screening", "$10", "consent", "parent"],
  },
  {
    id: "knowledge-test-online-and-languages",
    category: "knowledge-test",
    question: "Can I take the knowledge test online, and is it available in other languages?",
    answer:
      "Yes to both. ICBC offers the Class 7 knowledge test in 12 languages: English, Arabic, Croatian, French, Farsi, Traditional Chinese, Simplified Chinese, Punjabi, Russian, Spanish, Ukrainian and Vietnamese. For the [online version](https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test) you'll need a desktop or laptop with a keyboard, a mouse or trackpad, and a working webcam. Phones and tablets won't work, and you have to be physically in Canada or the United States. If that doesn't suit you, take it at a driver licensing office instead. Our [knowledge-test guide](/knowledge-test-guide) compares the two.",
    keywords: ["language", "punjabi", "hindi", "chinese", "farsi", "spanish", "translated", "phone", "tablet", "webcam", "remote"],
  },
  {
    id: "knowledge-test-retake",
    category: "knowledge-test",
    question: "How soon can I retake a failed knowledge test?",
    answer:
      "After 24 hours. You register again and pay another $15 each time, and you can switch to an in-person test at a driver licensing office if you'd rather. Don't confuse this with the road test, where the waits are far longer: see [how long you wait after a failed road test](#cancellation-and-retest-waits). Check current amounts on [ICBC's fees page](https://www.icbc.com/driver-licensing/visit-dl-office/Fees) before you pay.",
    keywords: ["failed", "fail", "retake", "resit", "24 hours", "try again", "second attempt"],
  },

  /* ─────────────  Road test  ───────────── */
  {
    id: "road-test-timing-and-fees",
    category: "road-test",
    question: "When can I take the Class 7 road test, how long is it and what are the fees?",
    answer:
      "Once you've held your L for at least 12 months and stayed free of driving prohibitions, under the rules in effect on July 21, 2026. ICBC says the test and the feedback afterwards take about 35 minutes. Each attempt costs $35, and if you pass there's a further $75 for a licence issued for more than four years. Both amounts are set in the [Motor Vehicle Fees Regulation](https://www.bclaws.gov.bc.ca/civix/document/id/loo61/loo61/334_91) and also appear on [ICBC's fees page](https://www.icbc.com/driver-licensing/visit-dl-office/Fees) and [get your novice (N) licence](https://www.icbc.com/driver-licensing/new-drivers/Get-your-N). If you'd like structured preparation first, see [road-test preparation](/road-test-prep).",
    keywords: ["12 months", "eligible", "how long", "$35", "$75", "N licence", "booking"],
  },
  {
    id: "book-reschedule-or-cancel-road-test",
    category: "road-test",
    question: "How do I book, reschedule or cancel an ICBC road test?",
    answer:
      "You do all three yourself on [ICBC's road-test booking page](https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test), for Class 5, 6, 7 and 8. ICBC says phoning won't get you times the website doesn't show, so there's no advantage to calling. Give at least 48 hours' notice to cancel or reschedule, or you'll be charged $25. One thing worth being clear about: we can't book, hold or move an ICBC appointment for you. That booking is between you and ICBC. Once your date is confirmed, book a [school road-test vehicle](/road-test-vehicle) separately if you need one.",
    keywords: ["appointment", "schedule", "rebook", "change date", "48 hours", "$25", "no show"],
  },
  {
    id: "road-test-waits-and-standby",
    category: "road-test",
    question: "How long are road-test waits in Victoria, and can I get an earlier or standby appointment?",
    answer:
      "Nobody can give you a reliable number, and you should be wary of anyone who does. ICBC doesn't publish wait times by office, and availability shifts daily. ICBC's own advice is to book well ahead, since offices get busy through spring and summer, and to keep checking the [booking system](https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test), because earlier dates open up whenever somebody cancels. There's also a standby road test if your schedule is flexible and you're willing to wait at a driver licensing office, though ICBC warns you might wait a long time or not be seen that day. Either way, wait until your ICBC date is confirmed before you book a lesson or a vehicle.",
    keywords: ["wait time", "how long to wait", "sooner", "cancellation list", "standby", "walk in", "busy", "backlog"],
  },
  {
    id: "road-test-what-to-bring",
    category: "road-test",
    question: "What should I bring to a Class 7 road-test appointment?",
    answer:
      "Your current learner's licence, one accepted primary ID and one accepted secondary ID, payment, any corrective lenses you're required to wear, and a qualified supervisor. You'll also need a safe, reliable, properly insured vehicle with a Canadian plate, along with its registration and insurance papers and the plate number. Bring an approved-course Declaration of Completion if you have one. If you're using a car-share vehicle and you're not the named member, you may need a fresh original authorization letter for every attempt. ICBC lists the lot on [prepare for your road-test appointment](https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment) and [accepted identification](https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID). No suitable car? See [road-test vehicle options](/road-test-vehicle).",
    keywords: ["documents", "checklist", "what to take", "insurance", "registration", "car share", "Evo", "Modo"],
  },
  {
    id: "vehicle-refused-at-road-test",
    category: "road-test",
    question: "What standards must my vehicle meet, and why might ICBC refuse it?",
    answer:
      "It has to be safe, legal and properly insured, and the examiner checks before the test starts. ICBC's published list of common reasons for cancelling includes cracked or illegally tinted glass, safety-related warning lights, damaged seatbelts, lights or a horn that don't work, unsafe tires, doors or windows that don't operate, unsafe or illegal modifications, a hazardous interior, too little fuel or battery charge, and an outstanding serious safety recall. Check [ICBC's current vehicle requirements](https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment) before the appointment, or use a [school road-test vehicle](/road-test-vehicle). No school can promise ICBC will accept a car. The examiner applies ICBC's rules on the day.",
    keywords: ["vehicle rejected", "cancelled", "tint", "check engine light", "tires", "recall", "requirements", "standards"],
  },
  {
    id: "road-test-skills-assessed",
    category: "road-test",
    question: "What skills does ICBC assess, and can a school provide the test route?",
    answer:
      "[ICBC's Road Test Skills Explainer](https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf) groups everything under five headings: observation, space margin, speed, steering and communication. On routes, ICBC states it doesn't make them available outside ICBC, so we don't claim to know yours and you should be suspicious of any school that does. Practise transferable skills across varied legal road conditions rather than memorising particular streets. A [mock road test](/mock-road-test-victoria) is one way to rehearse under test-like conditions.",
    keywords: ["marking", "scoring", "route", "secret route", "what they look for", "examiner", "criteria"],
  },
  {
    id: "common-road-test-mistakes",
    category: "road-test",
    question: "What are the most common reasons people fail a road test?",
    answer:
      "Honestly, nobody can tell you precisely. ICBC doesn't publish pass or fail statistics by office or by error type, so any ranked list of \"top Victoria fail reasons\" you find online is somebody's guess dressed up as data. What ICBC does publish is what examiners assess, in the [Road Test Skills Explainer](https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf): observation, space margin, speed, steering and communication. The errors that end a test early are the safety-critical ones, such as failing to yield, entering an intersection unsafely, or making the examiner intervene. The dependable way to find your own weak spots is a [mock test evaluation](/courses/mock-test-evaluation) under test-like conditions, not a generic list.",
    keywords: ["fail", "failure", "mistakes", "why do people fail", "pass rate", "statistics", "instant fail"],
  },
  {
    id: "cancellation-and-retest-waits",
    category: "road-test",
    question: "How long must I wait before retaking a failed road test?",
    answer:
      "14 days after your first attempt, 30 days after the second, and 60 days after a third or later one. You pay the test fee again each time. Separately, if you need to cancel or reschedule, give ICBC at least 48 hours' notice or you'll be charged $25 on top of the test fee for the missed test, which is how the [Motor Vehicle Fees Regulation](https://www.bclaws.gov.bc.ca/civix/document/id/loo61/loo61/334_91) sets it out. Manage the appointment on [ICBC's booking page](https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test). The [knowledge-test wait](#knowledge-test-retake) is much shorter.",
    keywords: ["failed", "fail", "retake", "rebook", "reschedule", "no show", "$25", "wait time", "14 days", "30 days"],
  },

  /* ─────────────  L & N rules  ───────────── */
  {
    id: "learner-l-restrictions",
    category: "licence-rules",
    question: "Can I drive alone with my L, and who is allowed to supervise me?",
    answer:
      "No, never. You need a supervisor beside you every time you drive. Display the official L sign, and drive only between 5 a.m. and midnight with someone who's at least 25 and holds a valid Class 1, 2, 3, 4 or 5 licence in the passenger seat. You can carry that supervisor plus one other passenger. Zero alcohol and zero drugs in your blood while driving, and no hand-held or hands-free devices. Follow any extra restriction printed on your licence. These rules hold through October 18, 2026. From October 19 the minimum supervisor age drops to 22 with an unrestricted Class 5, and you'll be able to carry extra passengers as long as everyone besides the supervisor is immediate family. See [the October 19, 2026 changes](#glp-changes-october-2026) and [ICBC's get your L page](https://www.icbc.com/driver-licensing/new-drivers/Get-your-L).",
    keywords: ["L sign", "supervisor", "passengers", "curfew", "midnight", "phone", "learners rules", "drive alone", "by myself"],
  },
  {
    id: "novice-n-restrictions",
    category: "licence-rules",
    question: "What are the N restrictions, and how long does the whole GLP process take?",
    answer:
      "On an N: display the official N sign, keep zero alcohol and zero drugs in your blood while driving, and don't use hand-held or hands-free devices. You're normally limited to one passenger, though that limit lifts when a qualified supervisor aged 25 or older is sitting beside you, or when the extra passengers are immediate family. Follow every restriction printed on your licence. On timing, the current path is at least 12 months as a learner before your first road test, then at least 24 months as a novice before you can move to a full Class 5. That's roughly three years at minimum, and longer if you fail an attempt or pick up a prohibition. Both stages change on October 19, 2026, so see [the changes](#glp-changes-october-2026) and [ICBC's get your N page](https://www.icbc.com/driver-licensing/new-drivers/Get-your-N).",
    keywords: ["N sign", "passengers", "one passenger", "family", "phone", "novice rules", "how long", "3 years", "timeline", "full licence"],
  },
  {
    id: "glp-changes-october-2026",
    category: "licence-rules",
    question: "What changes to B.C.'s GLP and the Class 5 process on October 19, 2026?",
    answer:
      "The first Class 7 learner-to-novice road test stays. From October 19, 2026 the minimum learner period drops to nine months if you're 25 or older, and stays at 12 months if you're under 25. Eligible novice drivers then move toward Class 5 through a Driving Record Assessment instead of a second road test. ICBC says that needs at least 24 months of safe driving if you're under 25, or 18 months if you completed an approved GLP course during the learner phase, and at least 12 months if you're 25 or older. You'll also need no excessive-speed convictions, no electronic-device violations, and no prohibitions or suspensions, followed by a 12-month restriction period. Your age, start date and driving record all change the picture, so check [ICBC's Graduated Licensing Program changes](https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes) page for your own case. Our [B.C. GLP explainer](/bc-graduated-licensing-program) and [what changes in 2026](/blog/bc-glp-changes-2026) cover the stages in plain language.",
    keywords: ["GLP", "2026 changes", "new rules", "Class 5", "Driving Record Assessment", "second road test", "full licence"],
  },
  {
    id: "approved-glp-course-benefit",
    category: "licence-rules",
    question: "Can an ICBC-approved GLP course shorten the path to a full Class 5 licence?",
    answer:
      "Yes for eligible drivers, but only a course with specific ICBC approval counts. Ordinary lessons don't. ICBC says completing an approved GLP course can take six months off the novice stage, and you may also earn two grade-11 high-school credits. You have to finish it within one year while you're still in the learner stage, and keep a clean record with no at-fault crashes, violations or prohibitions. Under the [October 19, 2026 changes](#glp-changes-october-2026), the same credit shows up as 18 months of safe driving instead of 24 for drivers under 25. To be straight with you: Shanaya's doesn't offer an ICBC-approved GLP course at the moment, so our lessons don't carry this credit. If the credit matters to you, find a school that does in [ICBC's approved-GLP directory](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools). Our lessons are still professional instruction toward the same road test. They just won't shorten a licensing stage.",
    keywords: ["approved course", "GLP course", "6 months", "credit", "shorten", "faster", "high school credits", "grade 11"],
  },
  {
    id: "insurance-for-learner-and-novice",
    category: "licence-rules",
    question: "How does ICBC insurance work for learner and novice drivers?",
    answer:
      "A learner drives on the vehicle owner's Autoplan policy, and ICBC requires any household member or employee who becomes a learner to be listed on it. Skip that step and the owner can face an Unlisted Driver Accident Premium. ICBC says a learner premium of roughly $130 to $230 a year applies depending on where you live, and it's charged once to cover every learner using the car rather than per learner. Learners have no driver factor, so listing one doesn't change your Basic premium, and a crash caused during the learner stage doesn't go on the learner's own driving record. Learner-stage time doesn't count as driving experience toward later discounts. Adding or removing listed drivers is free. See [ICBC on listing a learner](https://www.icbc.com/insurance/costs/drivers-experience-crash-history/learner), and confirm your own policy with your Autoplan broker.",
    keywords: ["insurance", "autoplan", "premium", "listed driver", "parents car", "cost to insure", "unlisted", "broker"],
  },

  /* ─────────────  Lessons & practice  ───────────── */
  {
    id: "are-lessons-required",
    category: "lessons",
    question: "Are professional lessons required, and who conducts the official tests?",
    answer:
      "No, they're optional for the standard Class 7 path. You can prepare through legal supervised practice and ICBC's free materials. On who does what: ICBC, not Shanaya's, administers the official knowledge and road tests, decides eligibility and issues licences. That also means no lesson or practice assessment can guarantee you a pass, and you should treat any school that claims otherwise with suspicion. ICBC's guidance on [choosing a driving school](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school) explains what to check, and our [course list](/courses) shows what paid instruction covers.",
    keywords: ["mandatory", "do I need lessons", "required", "guarantee", "who tests me"],
  },
  {
    id: "licence-before-first-lesson",
    category: "lessons",
    question: "Do I need a learner's licence before my first in-car lesson?",
    answer:
      "Yes. You need a valid licence for the class of vehicle to drive on a public road in B.C., so a Class 7 student needs the L in hand before any in-car lesson. We can't legally put an unlicensed driver behind the wheel on a road, so please don't book hoping we'll make an exception. Bring the physical licence to every lesson. If you don't have it yet, start with the [knowledge-test guide](/knowledge-test-guide) and [practice questions](/knowledge-test-practice), or the in-class [Knowledge Test Prep Course](/courses/knowledge-test-prep-course), then get your L through [ICBC](https://www.icbc.com/driver-licensing/new-drivers/Get-your-L).",
    keywords: ["before lesson", "no licence", "first lesson", "start lessons", "prerequisite", "unlicensed"],
  },
  {
    id: "how-many-lessons",
    category: "lessons",
    question: "How many lessons or practice hours do I need before my road test?",
    answer:
      "There's no fixed number for the standard Class 7 path. ICBC recommends at least 60 hours of total practice before the road test, and supervised practice with a qualified supervisor counts toward that, so you don't need paid lessons to reach 60. Choose paid instruction based on the gaps someone has actually seen in your driving, how much legal practice you can get on your own, and whether you feel ready. Not on a promised number of sessions or a guaranteed result. [Lesson packages](/packages) group hours if you'd rather work to a set plan.",
    keywords: ["how many hours", "60 hours", "practice hours", "beginner", "how long to learn", "how many lessons"],
  },
  {
    id: "what-lessons-cover",
    category: "lessons",
    question: "What skills do lessons cover, and what is included in a lesson?",
    answer:
      "A lesson is in-car instruction with a licensed instructor in a dual-control school car, for the time you book: 60 or 90 minutes in the current catalogue. Dual controls give the instructor their own brake, which is what makes it safe to practise in traffic sooner than you otherwise could. Each course outline lists what it covers. The [Beginner's Driving Course](/courses/beginner-driving-course) handles basic car control, traffic rules, safe driving habits and road awareness. The [Parking Course](/courses/parking-course) covers parallel and stall parking and low-speed control. The [Road Test Prep Course](/courses/road-test-prep-course) targets test-day skills. All of it maps onto the five areas [ICBC assesses](#road-test-skills-assessed): observation, space margin, speed, steering and communication. Get the inclusions, vehicle, instructor and pickup arrangement in writing before you pay, and see [pricing](/pricing) for current rates.",
    keywords: ["what do you teach", "curriculum", "syllabus", "included", "what happens", "lesson content", "60 minutes", "90 minutes"],
  },
  {
    id: "tailored-lessons",
    category: "lessons",
    question: "Can adult learners, anxious drivers, late starters or seniors get tailored lessons?",
    answer:
      "Yes, and there are programs built for exactly these situations rather than one beginner track for everyone. [Nervous-driver lessons](/nervous-driver-lessons-victoria) and the [Confidence Booster Course](/courses/confidence-booster-course) are paced for anxious or hesitant drivers. The [Refresher Driving Course](/courses/refresher-driving-course) suits licensed drivers coming back after a break. The [Enhanced Road Assessment](/courses/seniors-driving-course) program supports senior drivers reviewing habits, awareness and road rules. Starting late really isn't a problem: there's no upper age limit on learning to drive, and from October 19, 2026 drivers aged 25 and over get a [shorter nine-month learner stage](#glp-changes-october-2026). Tell us what's going on when you book so we can match the plan and the instructor to it.",
    keywords: ["adult", "anxious", "nervous", "scared", "late starter", "older", "senior", "elderly", "mature", "phobia", "confidence"],
  },
  {
    id: "teen-drivers-parents",
    category: "lessons",
    question: "What should parents know before booking lessons for a teen driver?",
    answer:
      "Five things. First, your teen needs [the L in hand before any in-car lesson](#licence-before-first-lesson), and under-19 applicants currently need a parent or guardian to consent. That threshold drops to under 18 on October 19, 2026. Second, [L restrictions](#learner-l-restrictions) apply to your practice at home too: 5 a.m. to midnight, a supervisor aged 25 or older beside them, one other passenger, zero alcohol and drugs, no devices. Third, list them on your [Autoplan policy](#insurance-for-learner-and-novice). ICBC requires it for household learners, and the upside is that a learner-stage crash doesn't go on your teen's record. Fourth, ICBC recommends 60 hours of practice and you can supervise most of it yourself, so paid lessons are best spent on the specific things you're not confident coaching. Fifth, you can't ride along. Our [in-vehicle passenger policy](/policies/in-vehicle-passenger-policy) keeps every lesson one-on-one so your teen makes decisions independently, and the instructor updates you before and after instead. One more thing worth knowing: no school can call its lessons an [ICBC-approved course](#approved-glp-course-benefit) unless it appears in ICBC's approved-GLP directory.",
    keywords: ["teen", "teenager", "my son", "my daughter", "16", "17", "parent", "guardian", "high school", "consent", "ride along", "sit in", "watch"],
  },
  {
    id: "mock-test-worth-it",
    category: "lessons",
    question: "Is a mock road test or pre-test lesson worth it?",
    answer:
      "It depends on what you still can't do reliably. A [Mock Test Evaluation](/courses/mock-test-evaluation) is a single 60-minute simulation with feedback and an improvement plan, and a [mock road test in Victoria](/mock-road-test-victoria) rehearses under test-like conditions. It's worth it if nobody but a family supervisor has ever assessed you, or if you've already failed once and don't know why. It's worth much less if you already know your weak spot and simply need more hours behind the wheel. Two limits worth stating plainly: a mock test is private instruction, not an official ICBC test or an official score, and since [ICBC doesn't release its routes](#road-test-skills-assessed), no school can rehearse the exact route you'll drive.",
    keywords: ["mock test", "practice test", "worth it", "pre-test", "simulation", "dry run", "before my test"],
  },
  {
    id: "defensive-driving-and-hazard-perception",
    category: "lessons",
    question: "Do lessons include defensive driving and hazard perception?",
    answer:
      "Hazard awareness runs through ordinary instruction, and there's also a dedicated [Defensive Driving Course](/courses/defensive-driving-course): five 90-minute in-car classes on hazard perception, risk reduction, defensive techniques and traffic awareness. Our [defensive driving page](/defensive-driving) explains the approach, and the [Advanced Driving Course](/courses/advanced-driving-course) and [Winter Driving Course](/courses/winter-driving-course) extend it into complex traffic and low-grip conditions. Worth knowing before you book: these are safety programs, not ICBC test requirements, and finishing one won't shorten a licensing stage. Only an [approved GLP course](#approved-glp-course-benefit) does that.",
    keywords: ["defensive", "hazard perception", "anticipation", "safety", "advanced", "winter", "risk"],
  },
  {
    id: "highway-and-night-lessons",
    category: "lessons",
    question: "When should I start highway-driving or night-driving lessons?",
    answer:
      "Once your basic control is steady in ordinary traffic: steering, braking, lane position, mirrors and shoulder checks. That way the new challenge is the environment rather than the fundamentals. There's one hard legal limit on night practice: an [L holder can only drive between 5 a.m. and midnight](#learner-l-restrictions), so genuinely late-night driving has to wait until you hold an N. ICBC's advice is to spread those 60 practice hours across varied legal conditions instead of one familiar route, and highway speeds, merging, and dusk or wet-weather visibility are exactly what that means in practice. The [Advanced Driving Course](/courses/advanced-driving-course) and [Winter Driving Course](/courses/winter-driving-course) cover higher-speed and low-visibility work. Ask for these conditions specifically when you book, since they depend on scheduling and daylight.",
    keywords: ["highway", "freeway", "motorway", "night", "dark", "merging", "when to start", "rain"],
  },

  /* ─────────────  Schools & instructors  ───────────── */
  {
    id: "licensed-school-versus-approved-course",
    category: "schools",
    question: "Is Shanaya's an ICBC-approved school or an approved GLP course provider?",
    answer:
      "Those are two different things, and the difference matters. ICBC's [general driving-school directory](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school) lists SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd, Langford, for Class 5 and Class 7 driver training. That confirms we're licensed. It isn't an endorsement, and ICBC says as much about its own list. Separately, we don't currently offer an ICBC-approved GLP course, and we didn't appear in [ICBC's directory of schools that do](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools) when it was checked on July 21, 2026. So we don't describe our lessons as an ICBC-approved course, and they don't carry the [approved-course credit](#approved-glp-course-benefit). [How to verify a licensed driving school](/icbc-approved-driving-school) explains it all in full.",
    keywords: ["ICBC approved", "licensed", "accredited", "certified", "GLP course", "directory"],
  },
  {
    id: "instructor-licensing-and-complaints",
    category: "schools",
    question: "Are driving instructors licensed, and how do I verify or complain about one?",
    answer:
      "Yes. Instructors are licensed by ICBC, separately from the school's own licence. ICBC's published requirements include being at least 19, holding a valid driver's licence, having three years of driving experience for the relevant class, and carrying fewer than 10 points on your record over the past two years. Instructor licences expire on the last day of the 24th month after they're issued. Every school and instructor has to follow ICBC's Driving School Code of Conduct, and ICBC reviews, investigates and resolves driver-training complaints. To check someone: ask your instructor to show their current ICBC instructor licence before the lesson, and look up the school through [ICBC's driver-training pages](https://www.icbc.com/driver-licensing/driver-training). To complain: raise it with the school first, then go to ICBC's driver-training team. Don't take advertising as proof of anything, because a [school licence isn't an instructor credential](#licensed-school-versus-approved-course).",
    keywords: ["instructor licence", "qualified", "credentials", "verify", "complaint", "report", "code of conduct", "unsafe instructor"],
  },
  {
    id: "choosing-a-school-and-reviews",
    category: "schools",
    question: "How do I choose a reputable driving school and evaluate its reviews?",
    answer:
      "Start with the records rather than the marketing. Confirm the school in [ICBC's driving-school directory](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school) by exact business name, address, phone number and training classes. If you specifically want the approved-course credit, check the [approved-GLP directory](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools) separately, because the two lists aren't the same. Then ask for the written cancellation, refund and no-show terms, the total price including GST, and whether the vehicle and instructor are actually confirmed for your date. On reviews: skip the star count and read the three-star and negative ones, looking for specifics about scheduling, vehicle condition and refunds. Be sceptical of any school advertising a pass rate, an ICBC endorsement, or knowledge of the test route, because [ICBC doesn't release routes](#road-test-skills-assessed) and B.C. regulations restrict claiming ICBC approval.",
    keywords: ["reputable", "best school", "reviews", "google reviews", "ratings", "scam", "how to choose", "compare"],
  },
  {
    id: "female-and-multilingual-instructors",
    category: "schools",
    question: "Do you offer female instructors or instruction in other languages?",
    answer:
      "Lessons are available in English, Hindi, Urdu and Punjabi. Tell us which you'd prefer when you book and we'll match you with an instructor who speaks it, subject to that instructor being free on your date. On the other half of the question: we don't currently have any female instructors on the team. If that matters to you, it's better to know now than on lesson day. Two related things that might help: the [ICBC knowledge test comes in 12 languages](#knowledge-test-online-and-languages), including Punjabi, so the written stage doesn't depend on your instructor at all, and the [New to Canada course](/courses/new-to-canada) is built for drivers adjusting to local road rules and test expectations.",
    keywords: ["female", "woman", "lady instructor", "male", "language", "punjabi", "hindi", "urdu", "english", "mandarin", "translator", "multilingual", "gender"],
  },
  {
    id: "accessible-and-adaptive-driving",
    category: "schools",
    question: "Are accessible or adaptive driving options available for drivers with disabilities?",
    answer:
      "The official route runs through driver rehabilitation rather than an ordinary driving school. Driver rehabilitation specialists, who are occupational therapists working alongside licensed instructors and RoadSafetyBC, assess your driving and recommend adaptive equipment and vehicle modifications for physical, cognitive or visual impairments. Common adaptations include hand controls, a left-foot accelerator and a turn-signal extension. RoadSafetyBC can then add a licence restriction for the device you were assessed for. Start at [RoadSafetyBC's driver medical fitness pages](https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/medical-fitness). As for what we can offer: our cars are standard dual-control training vehicles. Dual controls give the instructor a second brake, but they aren't adaptive equipment, so we can't supply hand controls, a left-foot accelerator or similar modifications. If you need an accessibility accommodation, [contact us](/contact) before booking and we'll tell you honestly whether we can support it.",
    keywords: ["disability", "disabled", "adaptive", "hand controls", "wheelchair", "accessible", "mobility", "impairment", "deaf", "occupational therapist"],
  },

  /* ─────────────  Pricing & booking  ───────────── */
  {
    id: "lesson-prices",
    category: "pricing-booking",
    question: "How much do driving lessons cost in Victoria, and what is included?",
    answer:
      "Base rates before GST are $89 for 60 minutes and $133.50 for 90 minutes in the standard and regional tiers, which cover Victoria and the surrounding communities. Salt Spring Island is $109 for 60 minutes and $163.50 for 90 minutes. That price covers in-car instruction with a licensed instructor in a dual-control school car for the time you book, plus [free door-to-door pickup and drop-off](#how-to-book-and-pickup) inside the service area. See [what a lesson covers](#what-lessons-cover) for the detail. Packages, fixed-price courses, discounts and add-ons work out differently, so check the itemised total at checkout before you pay. Current amounts live on the [pricing page](/pricing) and in [lesson packages](/packages). ICBC's test fees are separate and go to ICBC, not to us.",
    keywords: ["cost", "how much", "hourly rate", "$89", "$133.50", "GST", "Salt Spring", "price", "included"],
  },
  {
    id: "road-test-vehicle-options",
    category: "pricing-booking",
    question: "Can I use or rent a driving-school car for my ICBC road test?",
    answer:
      "Yes. The current catalogue has a stand-alone [road-test-day vehicle](/road-test-vehicle) at $250 for a dual-control school car, and a combined lesson, road-test preparation and rental course at $350 in its 60-minute format or $450 in its 90-minute one. Prices are before GST. Book the vehicle only once your [ICBC appointment is confirmed](#book-reschedule-or-cancel-road-test), since availability depends on service area, instructor, vehicle and the written terms. And booking our car doesn't guarantee ICBC will accept it. The examiner applies [ICBC's test-day vehicle rules](#vehicle-refused-at-road-test) on the day.",
    keywords: ["rent a car", "car rental", "borrow a car", "$250", "$350", "$450", "use your car", "school car"],
  },
  {
    id: "how-to-book-and-pickup",
    category: "pricing-booking",
    question: "How do I book a lesson, and is pickup and drop-off available around Victoria?",
    answer:
      "Book online through the [booking form](/apply), or [get in touch](/contact) with your licence stage, preferred dates and location. You can also add a specific [course](/courses) or [package](/packages) to the cart and check out. Pickup and drop-off are free and door to door anywhere in our listed service areas. There's no separate pickup charge, so we can collect you from home, work or school and drop you back afterwards. Give us the address when you book, since scheduling and routing still decide which times we can offer. This is separate from your [ICBC road-test appointment](#book-reschedule-or-cancel-road-test), which you book yourself with ICBC.",
    keywords: ["book", "booking", "how do I sign up", "pick up", "pickup", "drop off", "door to door", "free", "home", "work", "school", "where do we meet"],
  },
  {
    id: "cancel-or-reschedule-a-lesson",
    category: "pricing-booking",
    question: "What happens if I cancel or reschedule a driving lesson?",
    answer:
      "Lessons and packages are rescheduled, and the notice window decides how much of the fee carries forward. With 24 hours' notice or more, we reschedule at no charge and the full fee carries forward. Inside 24 hours but more than 2 hours out, we reschedule, half the fee is retained as a late-notice charge, and the other half is credited to your rescheduled booking. Inside 2 hours, or with no notice at all, the full fee is retained and the booking isn't rescheduled. If we cancel, your lesson/package is rescheduled at no charge. Notice counts from when it reaches us, and the office is staffed Monday to Friday, 8:30 a.m. to 4:30 p.m., so anything sent outside those hours is treated as arriving at 8:30 a.m. the next weekday. Withdrawing from a package altogether is different: a refund of the balance is available where you withdraw for a valid reason, such as moving away from our service area, in which case the lessons you've already taken are charged at full price rather than the discounted package rate. The full wording is in our [cancellation and rescheduling policy](/policies/cancellation-and-rescheduling). This is our own policy and is separate from [ICBC's road-test cancellation rules](#book-reschedule-or-cancel-road-test).",
    keywords: ["cancel", "cancellation", "reschedule", "change my lesson", "24 hours", "credit", "late cancellation", "miss a lesson", "no show"],
  },
  {
    id: "service-areas-and-payment",
    category: "pricing-booking",
    question: "Where are lessons offered, and what payment or cancellation terms apply?",
    answer:
      "We cover Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan and Salt Spring Island, all subject to instructor scheduling and routing. Checkout asks for the full displayed total, and Affirm or Afterpay/Clearpay appear only for eligible transactions, which you can read about in [payment plan options](/payment-plan-options) and the [installment policy](/policies/installment-policy). Cancelling with at least 24 hours' notice means a free reschedule with the full fee carried forward; inside 24 hours half the fee is retained and half is credited to the rescheduled booking; inside 2 hours the full fee is retained, as set out in our [cancellation and rescheduling policy](/policies/cancellation-and-rescheduling). [Contact us](/contact) to check availability in your area.",
    keywords: ["service area", "credit", "cancel a lesson", "afterpay", "affirm", "clearpay", "installments", "Saanich", "areas"],
  },

  /* ─────────────  Newcomers & other licences  ───────────── */
  {
    id: "newcomers-licence-exchange",
    category: "other-licences",
    question: "Can newcomers or foreign-licence holders exchange a licence or prepare for a B.C. road test?",
    answer:
      "It depends where your licence is from. A valid licence from another Canadian province or territory is exchanged directly: see [ICBC on moving from within Canada](https://www.icbc.com/driver-licensing/moving-bc/Moving-from-within-canada). Some foreign licences can be exchanged without a knowledge or road test while others require testing, so check [ICBC's moving from another country page](https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country) for the current exchange list rather than an older country list you find elsewhere. Either way, bring accepted ID, your current licence, the fees, and any [driving-experience record](https://www.icbc.com/driver-licensing/moving-bc/Proving-your-driving-experience) ICBC asks for, because an incomplete record can change which licence stage ICBC issues you. Our [newcomers guide](/newcomers-guide) walks through both paths, and the [New to Canada course](/courses/new-to-canada) covers local road rules and test expectations if you do need to test.",
    keywords: ["newcomer", "immigrant", "foreign licence", "international", "exchange", "transfer", "another country", "moved here", "expat"],
  },
  {
    id: "class-4-and-rideshare",
    category: "other-licences",
    question: "Do you offer Class 4 Restricted or Uber and Lyft test preparation?",
    answer:
      "No, we don't. Shanaya's teaches Class 5 and Class 7 only, which matches ICBC's directory record for the school, so Class 4 Restricted training and ride-hailing test prep aren't things we can help with. Here's what you need to know anyway. For ride-hailing in B.C., ICBC says you need a Class 1, 2 or 4 commercial licence issued in B.C. Passing your test in a vehicle that seats up to 10 including the driver gives you the restricted Class 4, which is the minimum for ride-hailing, and the ride-hailing company is responsible for confirming you meet Passenger Transportation Board requirements. Start with [ICBC's commercial driver's licence page](https://www.icbc.com/driver-licensing/types-licences/Get-your-commercial-driver-licence) and its [ride-hailing requirements](https://www.icbc.com/insurance/commercial/ride-hailing), then use the [ICBC directory](https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school) to find a school listed for Class 4.",
    keywords: ["class 4", "uber", "lyft", "rideshare", "ride hailing", "taxi", "commercial", "class 1", "class 2", "professional"],
  },
  {
    id: "medical-and-health-requirements",
    category: "other-licences",
    question: "What health or medical requirements apply to driving tests?",
    answer:
      "Vision screening is part of getting your L, and you have to wear any corrective lenses recorded on your licence at the road test. Beyond that, medical fitness is RoadSafetyBC's responsibility rather than a driving school's. A Driver's Medical Examination Report completed by your doctor or nurse is the main assessment tool. Drivers take a medical exam at 80, at 85 and every two years after that, and anyone with a reported condition that might affect their driving can be asked to complete one as often as RoadSafetyBC decides. That report doesn't include a driving test, though RoadSafetyBC may separately require an [Enhanced Road Assessment](https://www.icbc.com/driver-licensing/re-exam/Enhanced-Road-Assessments) for Class 5 or 7 drivers, which ICBC examiners run at no charge. As of July 31, 2026 there are no pandemic-era health screening requirements published for road-test appointments, so just follow the current instructions on [ICBC's prepare for your road test page](https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment). The details live on [RoadSafetyBC's driver medical fitness pages](https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/medical-fitness).",
    keywords: ["medical", "health", "covid", "mask", "vision", "eyesight", "glasses", "condition", "epilepsy", "diabetes", "80", "seniors test", "ERA"],
  },
];

export type FaqRelatedLink = {
  label: string;
  href: string;
  description: string;
};

export const faqRelatedLinks: FaqRelatedLink[] = [
  {
    label: "Class 7 knowledge-test guide",
    href: "/knowledge-test-guide",
    description: "Compare the official online and in-person workflows, and what happens after a pass.",
  },
  {
    label: "Class 7 road-test checklist",
    href: "/blog/pass-road-test",
    description: "Eligibility, practice, documents, vehicle checks, fees and test-day steps.",
  },
  {
    label: "B.C. GLP explainer",
    href: "/bc-graduated-licensing-program",
    description: "The current stages, and the transition beginning October 19, 2026.",
  },
  {
    label: "Newcomers' licensing guide",
    href: "/newcomers-guide",
    description: "Exchange a valid licence or start B.C.'s Class 7 process, with documents and deadlines.",
  },
  {
    label: "Current catalogue pricing",
    href: "/pricing",
    description: "Rates, packages and location-dependent totals, before you book.",
  },
  {
    label: "How to verify a licensed driving school",
    href: "/icbc-approved-driving-school",
    description: "The difference between a licensed school and an approved GLP course.",
  },
];

export const faqsByCategory = (categoryId: FaqCategoryId): SiteFaq[] =>
  siteFaqs.filter((faq) => faq.category === categoryId);
