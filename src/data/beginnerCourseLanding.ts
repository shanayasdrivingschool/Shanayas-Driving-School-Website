/* Content for the beginner course landing page at /beginner-driving-lessons-victoria.
 *
 * RULES FOR EDITING — read before changing anything in here:
 *  1. Every claim on this page has to be something the school can evidence. Per
 *     COMPANY_KNOWLEDGE.md, individual instructor claims must be verified before
 *     they ship, and nothing here may call the school, its instructors or its
 *     lessons ICBC-approved, ICBC-aligned, government-approved or endorsed.
 *  2. `reviews` and `googleReviewsUrl` gate the review section. While the list is
 *     empty the section does not render at all. Only ever paste real review text
 *     and the reviewer's name as it appears publicly — an invented testimonial is
 *     a fabricated trust signal, it is what search quality raters look for, and
 *     Canada's Competition Act treats false testimonials as deceptive marketing.
 *  3. `rating` and `reviewCount` must match what the linked Google profile shows
 *     on `ratingCheckedOn`. Ratings move, so re-check the date when you edit them.
 *  4. The free assessment drive is a real offer the school makes. If it stops
 *     being free, change `freeTrial` here rather than leaving stale copy live.
 */

export type BeginnerLandingReview = {
  /* Verbatim review text, as the reviewer wrote it. */
  quote: string;
  /* The reviewer's public display name. */
  name: string;
  /* e.g. "Google review, March 2026". Say where a reader can go and check. */
  source: string;
};

export type BeginnerLandingFaq = {
  question: string;
  /* Plain text on purpose: this string is also the FAQPage schema answer. Any
     link belongs in `link` below, not inline. */
  answer: string;
  link?: { label: string; href: string };
};

export type BeginnerLandingSellingPoint = {
  title: string;
  body: string;
  /* An official page a reader can check the claim against, where one exists. */
  evidenceHref?: string;
};

/* The free assessment drive offered in the hero. Duration stays null until the
   owner confirms it; the copy reads correctly either way, and stating a length
   we cannot honour would be a false offer. */
export const freeTrial = {
  /* Confirmed by a customer review on 2026-08-02 ("a free 30 minute trial lesson"). */
  durationMinutes: 30 as number | null,
};

export const beginnerLandingPhone = {
  display: "(250) 542-3673",
  href: "tel:+12505423673",
};

/* Same number as the footer's WhatsApp link. The prefilled text means the visitor
   does not have to compose anything, and a WhatsApp message reaches the school
   immediately, unlike a form submission sitting in the leads table. */
export const beginnerLandingWhatsApp = {
  href: "https://wa.me/12505423673?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%2030-minute%20assessment%20drive.",
  label: "Message on WhatsApp",
};

/* Real Google reviews supplied by the owner on 2026-08-02. Quotes are verbatim and
   names are exactly as they appear publicly on the profile. Do not edit the wording
   of a quote: a tidied-up review is no longer the reviewer's words.

   rating/reviewCount reflect the 27 five-star reviews supplied. Re-check them against
   the live profile before each campaign, since ratings move. */
/* Reviews tab of the Google Business Profile. The !9m1!1b1 segment is what opens
   straight onto reviews; the ?entry= and g_ep= params were session tracking and
   are deliberately stripped. */
export const googleReviewsUrl =
  "https://www.google.com/maps/place/Shanaya's+Driving+School/@48.4514745,-123.5207662,17z/data=!4m8!3m7!1s0x548f0dbc0a227e83:0xf890ce589bc36216!8m2!3d48.451471!4d-123.5181913!9m1!1b1!16s%2Fg%2F11nk25xtf2";
export const rating: number | null = 5.0;
export const reviewCount: number | null = 27;
export const ratingCheckedOn = "August 2, 2026";

export const reviews: BeginnerLandingReview[] = [
  {
    quote:
      "I took a trial lesson and had a great experience. The instructor was patient, knowledgeable, and made me feel comfortable even though I was nervous. He explained the rules clearly and gave helpful feedback.",
    name: "Yogita Bang",
    source: "Google review",
  },
  {
    quote:
      "My daughter has been extremely nervous behind the wheel since obtaining her L. She recently had a free 30 minute trial lesson and returned home with so much confidence after being on roads within traffic. Her instructor Azy was kind and patient, which made her feel very comfortable.",
    name: "Angela",
    source: "Google review",
  },
  {
    quote:
      "I had my first driving lesson with Azhar today, and it was a great experience! I was really nervous before the lesson, but Azhar made me feel comfortable and confident right away. He is incredibly patient, calm, and explains everything clearly.",
    name: "Umu mamad",
    source: "Google review",
  },
  {
    quote:
      "My son started with little experience, driving only on narrow residential streets. Thanks to Azy for his excellent guidance and encouragement, he can now drive confidently on the highway.",
    name: "Vanessa Nicdao",
    source: "Google review",
  },
  {
    quote:
      "I previously took a class with another instructor who was extremely rude, and it left me with a terrible experience. I'm absolutely delighted and highly recommend this academy if you're planning to take your road test.",
    name: "Lauren Valoyes",
    source: "Google review",
  },
  {
    quote:
      "I've started feeling so much more confident behind the wheel. The instructor is very knowledgeable and calm, which makes every lesson feel comfortable and stress-free. I've tried a few other driving schools in Victoria and had the opposite experience.",
    name: "Alexis Dumaresq",
    source: "Google review",
  },
  {
    quote:
      "I was definitely anxious at the beginning of the lesson, but Azy's patient and thorough teaching style helped me gain confidence as the lesson went on. Previous instructors never covered those basics.",
    name: "rebecca mushata",
    source: "Google review",
  },
  {
    quote:
      "My first lesson with them is great. I was nervous for the first 10 minutes then I got comfortable with my instructor. He made me feel comfortable, talked me through everything. Now I'm feeling confident to drive.",
    name: "Caseydean Henry",
    source: "Google review",
  },
];

/* Only claims already evidenced in COMPANY_KNOWLEDGE.md, plus the ICBC instructor
   licensing requirement the site's own FAQ already cites and links. */
export const sellingPoints: BeginnerLandingSellingPoint[] = [
  {
    title: "Instructors licensed by ICBC",
    body: "Driving instructors in B.C. hold an ICBC instructor licence, which is separate from the school's own licence. Ask to see it before any first lesson, with us or anyone else.",
    evidenceHref: "https://www.icbc.com/driver-licensing/driver-training",
  },
  {
    title: "Dual-control vehicles",
    body: "Every lesson car has a second set of pedals, so your instructor can step in instantly while you build confidence at your own pace.",
  },
  {
    title: "Pick-up and drop-off",
    body: "We collect you and drop you back, so your lesson time is spent driving rather than getting to a meeting point.",
  },
  {
    title: "Flexible scheduling",
    body: "Lessons are arranged around work, school and shift patterns, including evenings and weekends where an instructor is available.",
  },
  {
    title: "Multi-language support",
    body: "Instruction is available in more than one language. Tell us what you are most comfortable in and we will match you where we can.",
  },
  {
    title: "Structured plans and progress tracking",
    body: "Each lesson has a goal and you get feedback on where you are against what a road test asks for, rather than just hours behind the wheel.",
  },
];

/* What the Beginner's Driving Course actually covers, taken from courseCatalog.ts
   so this page cannot drift from the product it sells. */
export const courseFacts = {
  covers: ["Basic car control", "Traffic rules", "Safe driving habits", "Road awareness"],
};

export const faqs: BeginnerLandingFaq[] = [
  {
    question: "Are there any hidden fees?",
    answer:
      "No. Our per-lesson rates are published in full on the pricing page, and we confirm the total cost with you before you book anything paid. The assessment drive is free, and there is no charge for asking questions before you decide.",
  },
  {
    question: "I have never driven before. Will I be judged?",
    answer:
      "No. Beginners are who this course is built for, and stalling, kerbing a wheel or forgetting a mirror on your first day is completely normal. Instructors coach, they do not grade you, and nothing you do in a lesson is reported to ICBC.",
  },
  {
    question: "Are the packages flexible?",
    answer:
      "Yes. The Beginner's Driving Course runs as 10 lessons of 90 minutes, and you can also book single lessons or move to another package if your needs change. Talk to us and we will put together what fits rather than pushing a fixed bundle.",
  },
  {
    question: "Is the timing flexible?",
    answer:
      "Yes. We schedule around work, school and shift patterns, including evenings and weekends where an instructor is available. Availability varies by area, so ask about your preferred times when you book.",
  },
  {
    question: "Do I need my own car for lessons?",
    answer:
      "No. Lessons use our dual-control vehicles. If you want to use our car for the road test itself, that is arranged separately through the road test package.",
  },
  {
    question: "Do I need a learner's licence before my first lesson?",
    answer:
      "Yes. To drive on a B.C. road you need at least a valid Class 7L learner's licence, which means passing ICBC's knowledge test first. You cannot start in-car lessons without it, so book that early. Bring the licence to every lesson, bring glasses or contacts if you need them to drive, and wear flat shoes you can feel the pedals through.",
    link: { label: "How to get your learner's licence", href: "/knowledge-test-guide" },
  },
  {
    question: "What does the first lesson actually look like?",
    answer:
      "We pick you up, then start somewhere quiet rather than in traffic. Before the car moves you will set the seat, mirrors and head restraint, and find the pedals and controls. From there it is moving off, stopping smoothly and steering, nothing more. Quiet residential streets on day one, not arterials, and your instructor has a second set of pedals throughout, so there is no situation you can get stuck in alone.",
  },
  {
    question: "How many lessons will I need?",
    answer:
      "It depends on how much you practise between lessons. ICBC recommends at least 60 hours of supervised practice before a Class 7 road test, and paid lessons are meant to sit alongside that rather than replace it. The 10-lesson course covers the full beginner syllabus; some people book extra lessons before their test, and some do not need to.",
    link: { label: "See our per-lesson rates", href: "/pricing" },
  },
  {
    question: "Will this guarantee I pass my road test?",
    answer:
      "No, and be wary of anyone who promises that. Your result depends on the driving you demonstrate on the day. What lessons do is give you structured practice and honest feedback against the skills ICBC publishes.",
  },
];

/* ---------------------------------------------------------------------------
   Sections below drive the conversion layout. Same rule as everything else in
   this file: only claims the school can evidence. Note there is deliberately no
   "sessions delivered" or "average rating" counter here — we have no figure to
   stand behind, and an invented one is the single easiest thing for a competitor
   or a search quality rater to disprove.
   ------------------------------------------------------------------------- */

export type BeginnerLandingNeed = {
  number: string;
  title: string;
  /* Revealed on expand. The title states the situation; this says what actually
     happens in a lesson because of it. There is deliberately no summary line as
     well — it only restated this one. */
  response: string;
};

export const helpsWith: BeginnerLandingNeed[] = [
  {
    number: "01",
    title: "You have never driven at all",
    response: "Lesson one is cockpit drill and low-speed control only. You will not be asked onto a main road on day one, and your instructor can stop the car at any moment.",
  },
  {
    number: "02",
    title: "Traffic makes you anxious",
    response: "We add one pressure at a time: quiet streets, then a signalled intersection, then an arterial off-peak. You decide when to step up.",
  },
  {
    number: "03",
    title: "Your road test is coming up",
    response: "Observation, space margin, speed, steering and communication are scored separately, so you learn which one is costing you marks.",
  },
];

export const alsoIdealFor = [
  {
    title: "New to Canada",
    body: "Licensed elsewhere and adjusting to B.C. rules, signage and the graduated licensing system.",
  },
  {
    title: "Returning after a break",
    body: "You drove years ago and want your confidence back before driving alone again.",
  },
];

/* Four facts a reader can check, used instead of the invented volume counters a
   template of this shape usually carries. */
export const quickFacts = [
  { value: "Free", label: "assessment drive" },
  { value: "10 × 90 min", label: "beginner lessons" },
  { value: "Dual-control", label: "every lesson car" },
  { value: "ICBC-licensed", label: "instructors" },
];

export type BeginnerLandingStep = { step: string; title: string; body: string };

export const journeySteps: BeginnerLandingStep[] = [
  {
    step: "Step 1",
    title: "Book your free trial",
    body: "Leave your name and phone number, or call us. We arrange a time that fits around work or school, including evenings and weekends where an instructor is free.",
  },
  {
    step: "Step 2",
    title: "Your assessment drive",
    body: "An instructor picks you up and assesses where you actually are. You will drive. At the end you get an honest view of what your road test needs and roughly how many lessons that means.",
  },
  {
    step: "Step 3",
    title: "Structured lessons",
    body: "Ten 90-minute lessons covering car control, traffic rules, road awareness and safe habits. Each one has a goal and ends with feedback against what ICBC assesses.",
  },
  {
    step: "Step 4",
    title: "Ready for the test",
    body: "We tell you honestly when you are ready rather than when your package runs out, and you can add mock-test practice or use our car on test day.",
  },
];

export const bookingFacts = [
  { title: "Same-day where possible", body: "Call before noon and we will tell you honestly what is free today." },
  { title: "Flexible scheduling", body: "Evenings and weekends where an instructor is available in your area." },
  { title: "We come to you", body: "Pick-up and drop-off across Victoria, Langford and the Westshore." },
  { title: "No payment to enquire", body: "The assessment drive is free and nothing is taken on this page." },
];

/* Areas map to the location landing pages where one exists, so these chips are
   real navigation rather than decorative text. */
export const serviceAreaLinks: { name: string; href?: string }[] = [
  { name: "Victoria", href: "/driving-lessons" },
  { name: "Langford", href: "/driving-lessons-langford" },
  { name: "Colwood", href: "/driving-lessons-colwood" },
  { name: "Saanich", href: "/driving-lessons-saanich" },
  { name: "View Royal", href: "/driving-lessons-view-royal" },
  { name: "Sidney" },
  { name: "Metchosin" },
  { name: "Sooke" },
];
