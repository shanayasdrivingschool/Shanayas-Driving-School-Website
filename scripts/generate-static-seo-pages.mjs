import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../public_html");
const sourceIndexPath = path.join(distDir, "index.html");

const siteOrigin = "https://www.drivingschoolbc.ca";
const siteName = "Shanaya's Driving School";
const defaultImage = `${siteOrigin}/logos/For%20Social%20Media.jpg`;
const defaultDescription =
  "ICBC-aligned driving lessons, road test prep, knowledge test support, and confidence-building training in Langford, Victoria, and across Greater Victoria.";

const optionalEnvUrl = (value) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

const socialProfileUrls = [
  "https://www.facebook.com/drivingschoolvictoria",
  "https://www.instagram.com/drivingschoolvictoria",
  optionalEnvUrl(process.env.VITE_X_PROFILE_URL),
  optionalEnvUrl(process.env.VITE_LINKEDIN_PROFILE_URL),
  optionalEnvUrl(process.env.VITE_YOUTUBE_CHANNEL_URL),
].filter(Boolean);

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "DrivingSchool"],
  "@id": `${siteOrigin}/#localbusiness`,
  name: siteName,
  url: `${siteOrigin}/`,
  image: defaultImage,
  logo: `${siteOrigin}/logos/Driving%20School%20Logo%20Horizontal.png`,
  description: defaultDescription,
  telephone: "+1-250-542-3673",
  email: "book@drivingschoolbc.ca",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2770 Leigh Rd",
    addressLocality: "Victoria",
    addressRegion: "BC",
    postalCode: "V9B 4G1",
    addressCountry: "CA",
  },
  areaServed: [
    "Victoria, BC",
    "Langford, BC",
    "Colwood, BC",
    "Sidney, BC",
    "Metchosin, BC",
    "Sooke, BC",
    "Duncan, BC",
    "Salt Spring Island, BC",
  ],
  sameAs: socialProfileUrls,
};

const landingPages = [
  {
    path: "/driving-lessons/",
    title: "ICBC Driving Lessons Victoria BC | Shanaya's Driving School",
    description:
      "Beginner driving lessons in Victoria, Langford, and Greater Victoria with ICBC-aligned coaching, dual-control vehicles, and calm instructor support.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do beginners need any experience before booking?",
        answer: "No. Beginner lessons can start with basic vehicle control and progress at the student's pace.",
      },
      {
        question: "Are lessons aligned with ICBC road test expectations?",
        answer: "Yes. Lessons build the observation, control, parking, and road judgment habits ICBC examiners expect to see.",
      },
    ],
  },
  {
    path: "/driving-lessons-langford/",
    title: "Driving Lessons in Langford, BC | Shanaya's Driving School",
    description:
      "Langford driving school offering lessons across the Westshore, BC with ICBC-aligned coaching, dual-control cars, and lessons that start from our Leigh Rd office.",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do lessons start close to Langford?",
        answer:
          "Yes. Our main training hub is at 2770 Leigh Rd, Victoria, and lessons can begin from the Westshore so you practise on familiar local roads.",
      },
      {
        question: "Will I practise Langford's roundabouts?",
        answer:
          "Yes. Langford has many roundabouts, so entering, choosing the right lane, signalling, and exiting them safely is a core part of local lessons.",
      },
      {
        question: "Do lessons cover the Trans-Canada Highway merges?",
        answer:
          "Yes. Once you are ready, lessons include highway on-ramps, merging, and lane changes at Westshore speeds so you feel confident on Highway 1.",
      },
    ],
  },
  {
    path: "/driving-lessons-colwood/",
    title: "Driving Lessons in Colwood, BC | Shanaya's Driving School",
    description:
      "Driving lessons in Colwood and the Westshore, BC with ICBC-aligned coaching, dual-control cars, and practice on Sooke Road, the Colwood interchange, and Royal Bay.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do lessons cover the Colwood interchange and highway merging?",
        answer:
          "Yes. Once you are ready, lessons include on-ramps, merging, and lane changes around the Colwood interchange so you feel confident in Westshore commuter traffic.",
      },
      {
        question: "Will I practise Royal Bay's roundabouts?",
        answer:
          "Yes. Royal Bay and the wider Westshore have several roundabouts, so entering, choosing the right lane, signalling, and exiting them safely is part of local lessons.",
      },
      {
        question: "Where do lessons start for Colwood learners?",
        answer:
          "Our training hub is nearby at 2770 Leigh Rd, Victoria, and lessons can begin from the Westshore so you practise on familiar Colwood roads.",
      },
    ],
  },
  {
    path: "/driving-lessons-saanich/",
    title: "Driving Lessons in Saanich, BC | Shanaya's Driving School",
    description:
      "Driving lessons in Saanich, BC with ICBC-aligned coaching and dual-control cars. Practice Douglas, Blanshard, McKenzie, and the routes near the Saanich test centre.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do lessons cover the McKenzie interchange and highway merging?",
        answer:
          "Yes. Once you are ready, lessons include on-ramps, merging, and lane changes at the McKenzie interchange on Highway 1 so you feel confident in Saanich traffic.",
      },
      {
        question: "Are lessons useful for the Victoria-area road test?",
        answer:
          "Yes. Many local road test routes run through Saanich, so practising here builds confidence on the roads, intersections, and parking you are likely to see on test day.",
      },
      {
        question: "Do you teach nervous or first-time drivers in Saanich?",
        answer:
          "Yes. Lessons are paced around each student, so nervous beginners can build control on quiet streets before moving into busier Saanich arterials.",
      },
    ],
  },
  {
    path: "/driving-lessons-view-royal/",
    title: "Driving Lessons in View Royal, BC | Shanaya's Driving School",
    description:
      "Driving lessons in View Royal and the Westshore, BC with ICBC-aligned coaching, dual-control cars, and practice on Highway 1 and the Old Island Highway.",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do lessons cover Highway 1 merging in View Royal?",
        answer:
          "Yes. Once you are ready, lessons include on-ramps, merging, and lane changes on Highway 1 and the Old Island Highway so you feel confident in View Royal's connector traffic.",
      },
      {
        question: "Are lessons available near the Victoria General Hospital area?",
        answer:
          "Yes. Lessons cover the busier roads around the hospital and the Island Highway corridor, as well as quieter streets nearby for building early confidence.",
      },
      {
        question: "Where do lessons start for View Royal learners?",
        answer:
          "Our training hub is nearby at 2770 Leigh Rd, Victoria, and lessons can begin from the Westshore so you practise on familiar View Royal roads.",
      },
    ],
  },
  {
    path: "/nervous-driver-lessons-victoria/",
    title: "Nervous Driver Lessons in Victoria, BC | Shanaya's Driving School",
    description:
      "Calm, patient driving lessons for nervous drivers in Victoria, BC. Judgment-free coaching, dual-control cars, and lessons paced to build confidence at your speed.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "I get really anxious driving. Can you still help?",
        answer:
          "Yes. Many of our students start out very nervous. Lessons are paced slowly, begin on quiet streets, and move forward only when you feel ready, so you build confidence without pressure.",
      },
      {
        question: "Can you help me drive again after a long break or a collision?",
        answer:
          "Yes. We regularly work with returning drivers and those rebuilding confidence after a scare. Lessons rebuild core skills step by step in a calm, dual-control car.",
      },
      {
        question: "Do I have to go on busy roads or highways right away?",
        answer:
          "No. You set the pace. We stay on comfortable streets until you are ready, then introduce busier Victoria roads, roundabouts, and highways gradually.",
      },
    ],
  },
  {
    path: "/defensive-driving/",
    title: "Defensive Driving Course in Victoria, BC | Shanaya's Driving School",
    description:
      "Defensive driving course in Victoria and Langford focused on hazard perception, safe spacing, traffic awareness, and confident decision-making.",
    image: "https://media-blog.zutobi.com/wp-content/uploads/sites/2/2021/06/14165940/WHAT-IS-DEFENSIVE-DRIVING-scaled.jpg",
    faqs: [
      {
        question: "Is defensive driving only for experienced drivers?",
        answer: "No. Learners can start defensive habits early once they understand basic vehicle control.",
      },
      {
        question: "Can defensive driving help with road test readiness?",
        answer: "Yes. Strong observation, spacing, and judgment are important parts of a confident road test.",
      },
    ],
  },
  {
    path: "/road-test-prep/",
    title: "ICBC Road Test Preparation in BC | Shanaya's Driving School",
    description:
      "ICBC road test preparation across Vancouver Island, with mock tests, parking practice, and examiner-style feedback. Find road test prep near your test centre.",
    image: "https://www.easydriversed.com/wp-content/uploads/2025/01/the-road-test-process.jpg",
    faqs: [
      {
        question: "Which areas do you offer road test prep in?",
        answer:
          "Road test preparation is available across our Vancouver Island service areas, including Victoria, Langford, and the Westshore, based on instructor scheduling.",
      },
      {
        question: "Can I take a mock road test before my ICBC appointment?",
        answer: "Yes. Mock evaluations are available to identify weak spots before the real road test.",
      },
      {
        question: "Do you help with parking practice?",
        answer: "Yes. Parking, backing, low-speed control, and observation habits can all be included.",
      },
    ],
  },
  {
    path: "/road-test-prep-victoria/",
    title: "Road Test Prep in Victoria, BC | Shanaya's Driving School",
    description:
      "ICBC road test preparation in Victoria, BC. Practice the Saanich and Victoria test-centre routes with mock tests, parking drills, and examiner-style feedback before test day.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Do you practise on the actual Victoria test routes?",
        answer:
          "Yes. Prep focuses on the Saanich and Victoria test-centre routes and the local conditions examiners look for, so test day feels familiar.",
      },
      {
        question: "Can I take a mock road test first?",
        answer:
          "Yes. A mock evaluation with examiner-style feedback is the best way to see exactly what to improve before your ICBC appointment.",
      },
      {
        question: "Can I use a school car for the Victoria road test?",
        answer:
          "Instructor-approved road test vehicle support may be available when booked in advance and paired with the right preparation.",
      },
    ],
  },
  {
    path: "/mock-road-test-victoria/",
    title: "Mock Road Test in Victoria, BC | Shanaya's Driving School",
    description:
      "Book a mock ICBC road test in Victoria, BC. A full practice run on the real Saanich and Victoria routes with examiner-style scoring and feedback before your test.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "What is a mock road test?",
        answer:
          "A mock road test is a full practice run of the ICBC road test on real Victoria and Saanich routes, scored the way an examiner would, followed by feedback on what to improve.",
      },
      {
        question: "How is it different from a lesson?",
        answer:
          "A lesson teaches and practises skills. A mock test evaluates you under test-style conditions with examiner-style scoring, so you get an honest picture of your readiness.",
      },
      {
        question: "When should I book my mock test?",
        answer:
          "Most students book one to two weeks before their ICBC appointment, so there is still time to fix anything the mock test reveals.",
      },
      {
        question: "Can I use the car for the real road test?",
        answer:
          "Instructor-approved road test vehicle support may be available when booked in advance, so you can test in a familiar car.",
      },
    ],
  },
  {
    path: "/road-test-vehicle/",
    title: "ICBC Road Test Car Rental in Victoria | Shanaya's Driving School",
    description:
      "Book an instructor-approved road test vehicle rental in Victoria or Langford and arrive at your ICBC road test in a familiar training car.",
    image: "https://th.bing.com/th/id/R.938bd1619651dfafcc414b34125030cc?rik=YGc%2fiHscOQkg8A&riu=http%3a%2f%2fdualcontrolvehiclehire.co.uk%2fassets%2fimages%2fdual-internal-1266x949.jpeg&ehk=sBzyh82TS%2fru%2fNH3cCjSrvjtlhpolkb8a0RbECqzZ6o%3d&risl=&pid=ImgRaw&r=0",
    faqs: [
      {
        question: "Can I rent the vehicle without a lesson?",
        answer: "Availability depends on scheduling and readiness. A warm-up or prep lesson is recommended before the appointment.",
      },
      {
        question: "Is the car suitable for an ICBC road test?",
        answer: "The rental option is built around instructor-approved training vehicles used for student lessons and test-day support.",
      },
    ],
  },
  {
    path: "/intensive-driving-course/",
    title: "Intensive Driving Course in Victoria, BC | Shanaya's Driving School",
    description:
      "Intensive driving course support in Victoria and Langford for learners who want focused lessons, faster progress, and structured road test preparation.",
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Can an intensive course guarantee a road test pass?",
        answer: "No course can guarantee a pass, but focused practice can improve readiness, consistency, and confidence.",
      },
      {
        question: "How many lessons do I need?",
        answer: "That depends on current skill level, test timeline, and how much supervised practice happens outside lessons.",
      },
    ],
  },
  {
    path: "/pricing/",
    title: "Driving Lesson Prices in Victoria, BC | Shanaya's Driving School",
    description:
      "Driving lessons in Victoria and Langford start at $89 for 60 minutes and $133.50 for 90 minutes. Compare course, package, road test prep, and payment plan pricing across Greater Victoria.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Where can I see current package options?",
        answer: "The packages page lists structured lesson bundles, and the courses page lists individual training options.",
      },
      {
        question: "Do prices vary by location?",
        answer: "Some service areas may have different pricing tiers or availability. Confirm the final amount during booking.",
      },
    ],
  },
  {
    path: "/faq/",
    title: "Driving Test & Lesson FAQ for BC | Shanaya's Driving School",
    description:
      "Answers to common BC driving lesson, ICBC road test, learner licence, vehicle rental, booking, pricing, and preparation questions.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "How many driving lessons do I need?",
        answer:
          "It depends on experience, confidence, outside practice, and road test timeline. Beginners usually need a structured sequence, while experienced drivers may need targeted prep.",
      },
      {
        question: "Can I prepare for the ICBC knowledge test?",
        answer: "Yes. Knowledge test preparation is available for students who want help with road signs, rules, and practice questions.",
      },
      {
        question: "Can I use a school vehicle for the road test?",
        answer: "Road test vehicle support may be available when scheduled in advance and paired with the right preparation.",
      },
      {
        question: "Do you offer payment plans?",
        answer: "Payment plan options may be available for eligible students and approved programs.",
      },
    ],
  },
  {
    path: "/icbc-approved-driving-school/",
    title: "ICBC-Approved Driving School in Victoria, BC | Shanaya's",
    description:
      "Looking for an ICBC-approved driving school in Victoria or Langford? Shanaya's is a licensed BC driving school with ICBC-licensed instructors teaching the ICBC curriculum in dual-control cars.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Is Shanaya's Driving School ICBC-approved?",
        answer:
          "Yes. We are a licensed BC driving school and our instructors hold ICBC driving-instructor licences. In BC, that licensing is what \"ICBC-approved\" refers to.",
      },
      {
        question: "How is a licensed school different from practising with family?",
        answer:
          "A licensed school gives you a trained instructor, a structured ICBC-aligned curriculum, and a dual-control car for safety. Lessons target the exact habits examiners score, which builds readiness faster than informal practice.",
      },
      {
        question: "Does learning with a licensed school guarantee I will pass?",
        answer:
          "No school can guarantee a pass, but learning with ICBC-licensed instructors means your lessons match the standards examiners actually assess, which improves your consistency and readiness on test day.",
      },
      {
        question: "Which areas do you serve?",
        answer:
          "We teach across Victoria, Langford, Colwood, Saanich, View Royal, Sidney, and nearby communities, with pick-up and drop-off available depending on scheduling.",
      },
    ],
  },
  {
    path: "/bc-graduated-licensing-program/",
    title: "BC Graduated Licensing Program (GLP) Explained | Shanaya's",
    description:
      "How BC's Graduated Licensing Program works, from the Learner (L) and Novice (N) stages to your full Class 5 licence: the wait times, road tests, and restrictions at each step.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "How long does the BC Graduated Licensing Program take?",
        answer:
          "At minimum about three years: 12 months in the Learner (L) stage and 24 months in the Novice (N) stage, plus the time to pass each road test. The Novice stage can be shortened by six months with an ICBC-approved GLP course.",
      },
      {
        question: "What is the difference between an L and an N in BC?",
        answer:
          "The Learner (L) stage requires a qualified supervisor in the front seat at all times. The Novice (N) stage lets you drive alone, but with a one-passenger limit unless a supervisor or immediate family is present. Both require zero alcohol and no electronic devices.",
      },
      {
        question: "How old do you have to be to start the GLP?",
        answer:
          "You can apply for your Learner's licence at 16. If you are under 19, you need consent from a parent or legal guardian.",
      },
      {
        question: "How many road tests are in the GLP?",
        answer:
          "Traditionally two: the Class 7 road test to reach Novice, and the Class 5 road test to reach a full licence. As of summer 2026, ICBC is removing the second (Class 5) road test for Novice drivers with a clean record, replacing it with a 12-month restriction period. The knowledge test and the Class 7 road test still apply. Check icbc.com for the current requirement.",
      },
    ],
  },
  {
    path: "/driving-instructor-victoria/",
    title: "Driving Instructor in Victoria BC | Shanaya's Driving School",
    description:
      "Looking for a driving instructor in Victoria or Langford? Shanaya's ICBC-licensed instructors give patient, one-on-one lessons in dual-control cars, with pick-up and drop-off across Greater Victoria.",
    image: "https://smallbusiness-production.s3.amazonaws.com/uploads/2021/09/Driving-instructor-pic.jpg",
    faqs: [
      {
        question: "Are your driving instructors licensed?",
        answer:
          "Yes. Every instructor holds a valid ICBC driving-instructor licence and teaches in an insured, dual-control vehicle.",
      },
      {
        question: "Can I request a patient instructor for nervous driving?",
        answer:
          "Yes. Many of our students start out anxious. Our instructors keep lessons calm and judgment-free, starting on quiet streets and building up only when you feel ready.",
      },
      {
        question: "Do you offer lessons in languages other than English?",
        answer:
          "Multi-language instruction is available so you can learn in the language you are most comfortable with. Contact us to confirm availability for your preferred language.",
      },
      {
        question: "Will the same instructor teach all my lessons?",
        answer:
          "We aim to keep you with a consistent instructor throughout your training so each lesson builds on the last, subject to scheduling.",
      },
      {
        question: "Which areas do your instructors cover?",
        answer:
          "Victoria, Langford, Colwood, Saanich, View Royal, Sidney, and nearby communities, with pick-up and drop-off available depending on scheduling.",
      },
    ],
  },
  {
    path: "/driver-education-training/",
    title: "Driver Education & Training in Victoria, BC | Shanaya's",
    description:
      "Driver education and training in Victoria, Langford, and Greater Victoria. In BC that means ICBC-aligned knowledge test prep and in-car driving lessons through a licensed driving school.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    faqs: [
      {
        question: "Is driver education the same as driving lessons in BC?",
        answer:
          "Effectively, yes. In BC the practical driver training is delivered as professional driving lessons, and the driver education knowledge is the material on the ICBC knowledge test. We cover both.",
      },
      {
        question: "Do you offer drivers ed or driver training?",
        answer:
          "Yes. We provide the full path: knowledge-test preparation for the education side and in-car lessons for the training side, all with ICBC-licensed instructors in dual-control cars.",
      },
      {
        question: "Is there a mandatory classroom driver's ed course in BC?",
        answer:
          "No. BC uses the Graduated Licensing Program instead of a required classroom course. You pass the knowledge test, build supervised driving experience, and pass the road test. An ICBC-approved driver-training course is optional and can shorten the Novice stage by six months.",
      },
      {
        question: "Where do you offer driver education and training?",
        answer:
          "Across Victoria, Langford, Colwood, Saanich, View Royal, Sidney, and nearby communities, with pick-up and drop-off available depending on scheduling.",
      },
    ],
  },
];

const publicPages = [
  {
    path: "/",
    title: "Driving Lessons Victoria BC | Shanaya's Driving School",
    description: defaultDescription,
  },
  {
    path: "/courses/",
    title: "Driving Courses in Victoria & Langford, BC | Shanaya's Driving School",
    description:
      "Browse beginner lessons, ICBC road test prep, parking practice, defensive driving, refresher training, and newcomer driving support.",
  },
  {
    path: "/packages/",
    title: "Driving Lesson Packages in Greater Victoria | Shanaya's Driving School",
    description:
      "Compare structured driving lesson packages for new drivers, road test preparation, confidence building, and flexible training plans.",
  },
  {
    path: "/about/",
    title: "About Shanaya's Driving School | Victoria & Langford Driving Lessons",
    description:
      "Learn about Shanaya's Driving School, our supportive training approach, ICBC-aligned lessons, and student-first driving instruction.",
  },
  {
    path: "/contact/",
    title: "Contact Shanaya's Driving School | Book Driving Lessons in BC",
    description:
      "Contact Shanaya's Driving School to book driving lessons, ask about packages, or get help choosing the right training plan.",
  },
  {
    path: "/apply/",
    title: "Book Driving Lessons | Shanaya's Driving School",
    description:
      "Start your driving lesson booking with Shanaya's Driving School and get matched with training that fits your goals and schedule.",
  },
  {
    path: "/newcomers-guide/",
    title: "BC Driver's Licence Guide for Newcomers | Shanaya's Driving School",
    description:
      "A practical guide for newcomers learning BC licensing rules, ICBC requirements, road tests, and local driving expectations.",
  },
  {
    path: "/knowledge-test-practice/",
    title: "ICBC Knowledge Test Practice | Shanaya's Driving School",
    description:
      "Practice ICBC-style learner licence questions and build confidence before your British Columbia knowledge test.",
  },
  {
    path: "/blog/",
    title: "Driving Tips & Road Test Resources | Shanaya's Driving School",
    description:
      "Read practical driving tips, ICBC road test guidance, defensive driving advice, and newcomer resources for BC drivers.",
  },
  {
    path: "/payment-plan-options/",
    title: "Driving Lesson Payment Plans | Shanaya's Driving School",
    description:
      "Explore installment options for eligible driving lesson packages with clear monthly payment choices and predictable scheduling.",
  },
  {
    path: "/courses/beginner-driving-course/",
    title: "Beginner's Driving Course in Victoria & Langford, BC | Shanaya's Driving School",
    description: "Perfect for first-time drivers, covering essential car control, traffic rules, and safe driving habits.",
  },
  {
    path: "/courses/knowledge-test-prep-course/",
    title: "Knowledge Test Prep Course | Shanaya's Driving School",
    description: "Build confidence for the knowledge test by learning road signs, traffic rules, and exam-style practice questions.",
  },
  {
    path: "/courses/parking-course/",
    title: "Parking Course | Shanaya's Driving School",
    description: "Dedicated parking practice for parallel parking, stall parking, and low-speed vehicle control.",
  },
  {
    path: "/courses/make-your-own-class/",
    title: "Make Your Own Class | Shanaya's Driving School",
    description: "Choose your own lesson focus based on the area where you want the most support.",
  },
  {
    path: "/courses/lesson-road-test-prep-course/",
    title: "Lesson + Road Test Prep + Rental | Shanaya's Driving School",
    description: "Two focused lessons, road test preparation, and a rental car for your road test.",
  },
  {
    path: "/courses/road-test-prep-course/",
    title: "Road Test Prep Course | Shanaya's Driving School",
    description: "Get focused practice on test routes, key maneuvers, and ICBC road test standards to improve your chances of passing.",
  },
  {
    path: "/courses/defensive-driving-course/",
    title: "Defensive Driving Course | Shanaya's Driving School",
    description:
      "Focused on defensive driving techniques, hazard perception, and proactive strategies to reduce risk in complex traffic conditions.",
  },
  {
    path: "/courses/new-to-canada/",
    title: "New to Canada Driving Course | Shanaya's Driving School",
    description: "Helpful for drivers adjusting to local road rules, driving culture, and test expectations in Canada.",
  },
  {
    path: "/courses/refresher-driving-course/",
    title: "Refresher Driving Course | Shanaya's Driving School",
    description:
      "Ideal for licensed drivers returning after a break or preparing to re-test, focused on rebuilding confidence and refreshing core driving skills.",
  },
  {
    path: "/courses/mock-test-evaluation/",
    title: "Mock Test Evaluation | Shanaya's Driving School",
    description: "A realistic road test simulation with feedback on what to improve before test day.",
  },
  {
    path: "/courses/confidence-booster-course/",
    title: "Confidence Booster Course | Shanaya's Driving School",
    description: "Perfect for drivers with basic skills who need a confidence boost to feel comfortable and safe on the road.",
  },
  {
    path: "/courses/advanced-driving-course/",
    title: "Advanced Driving Course | Shanaya's Driving School",
    description:
      "Designed for experienced drivers to refine skills and apply advanced driving techniques for safer, more controlled driving.",
  },
  {
    path: "/courses/winter-driving-course/",
    title: "Winter Driving Course | Shanaya's Driving School",
    description: "Learn essential winter driving skills for icy and low-visibility conditions.",
  },
  {
    path: "/courses/seniors-driving-course/",
    title: "Enhanced Road Assessment | Shanaya's Driving School",
    description:
      "Tailored for senior drivers, focusing on safe habits, awareness, reaction time, and refreshing important road rules.",
  },
  {
    path: "/packages/fresh-start/",
    title: "Fresh Start Driving Package | Shanaya's Driving School",
    description:
      "A beginner-friendly package focused on essential driving skills, vehicle control, parking techniques, and road test preparation.",
  },
  {
    path: "/packages/skill-builder/",
    title: "Skill Builder Driving Package | Shanaya's Driving School",
    description:
      "A focused package for drivers with some experience, designed to sharpen key skills, build road confidence, and prepare for the ICBC road test.",
  },
  {
    path: "/packages/final-lap/",
    title: "Final Lap Driving Package | Shanaya's Driving School",
    description:
      "For drivers with foundational experience who want to refine driving skills, improve confidence, and prepare for more advanced driving scenarios.",
  },
  {
    path: "/extras/car-rental/",
    title: "Car Rental for Road Test Day | Shanaya's Driving School",
    description: "Book an instructor-approved training car for road test day when you want to test in a familiar vehicle.",
  },
  {
    path: "/blog/how-to-pass-driving-test-victoria-bc/",
    title: "How to Pass Your Driving Test in Victoria, BC | Shanaya's Driving School",
    description:
      "A step-by-step guide to passing your ICBC driving test in Victoria, BC: what to bring, the vehicle check, how examiners score the drive, and what happens after.",
    type: "article",
  },
  {
    path: "/blog/icbc-road-test-tips-victoria/",
    title: "ICBC Road Test Tips: Victoria, BC | Shanaya's Driving School",
    description:
      "Local ICBC road test tips for Victoria and Saanich: the test routes, the manoeuvres examiners score, common mistakes to avoid, and how to stay calm on test day.",
    type: "article",
  },
  {
    path: "/blog/pass-road-test/",
    title: "How to Pass Your Road Test on the First Try | Shanaya's Driving School",
    description:
      "Practical tips and common mistakes to avoid so you can walk out of ICBC with your licence in hand.",
    type: "article",
  },
  {
    path: "/blog/defensive-driving/",
    title: "Defensive Driving: Skills That Keep You Safe | Shanaya's Driving School",
    description:
      "Learn the core defensive driving habits our instructors teach every student, from hazard scanning to safe following distances.",
    type: "article",
  },
  {
    path: "/blog/newcomers-guide-bc/",
    title: "New to BC? Driving Rules Newcomers Should Know | Shanaya's Driving School",
    description:
      "New to British Columbia? Learn the road rules and habits that catch newcomers off guard, from right turns on red and 30 km/h school zones to winter tires and strict distracted-driving laws.",
    type: "article",
  },
];

const pages = [...publicPages, ...landingPages];

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const setTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

const setMetaName = (html, name, content) => {
  const tag = `<meta name="${name}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\s+name=["']${escapeRegExp(name)}["'][^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
};

const setMetaProperty = (html, property, content) => {
  const tag = `<meta property="${property}" content="${escapeHtml(content)}" />`;
  const pattern = new RegExp(`<meta\\s+property=["']${escapeRegExp(property)}["'][^>]*>`, "i");

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
};

const setCanonical = (html, href) => {
  const tag = `<link rel="canonical" href="${escapeHtml(href)}" />`;
  const pattern = /<link\s+rel=["']canonical["'][^>]*>/i;

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
};

const setHreflang = (html, hreflang, href) => {
  const tag = `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}" />`;
  const pattern = new RegExp(
    `<link\\s+rel=["']alternate["'][^>]*hreflang=["']${escapeRegExp(hreflang)}["'][^>]*>`,
    "i",
  );

  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }

  return html.replace("</head>", `    ${tag}\n  </head>`);
};

const setHreflangLinks = (html, href) =>
  ["en-ca", "x-default"].reduce((currentHtml, hreflang) => setHreflang(currentHtml, hreflang, href), html);

const removeJsonLd = (html, id) =>
  html.replace(new RegExp(`\\s*<script\\s+id=["']${escapeRegExp(id)}["']\\s+type=["']application/ld\\+json["']>[\\s\\S]*?<\\/script>`, "i"), "");

const buildFaqSchema = (faqs) => {
  if (!faqs?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

const insertJsonLd = (html, id, data) => {
  if (!data) {
    return removeJsonLd(html, id);
  }

  const script = `    <script id="${id}" type="application/ld+json">${JSON.stringify(data)}</script>`;
  return removeJsonLd(html, id).replace("</head>", () => `${script}\n  </head>`);
};

const setFallbackContent = (html, page) => {
  const heading = page.title.split(" | ")[0];

  return html
    .replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${escapeHtml(heading)}</h1>`)
    .replace(
      /<p>\s*Shanaya's Driving School provides[\s\S]*?<\/p>/i,
      () => `<p>${escapeHtml(page.description)}</p>`,
    );
};

const renderPageHtml = (template, page) => {
  const canonical = `${siteOrigin}${page.path}`;
  const image = page.image ?? defaultImage;
  const type = page.type ?? "website";
  let html = template;

  html = setTitle(html, page.title);
  html = setCanonical(html, canonical);
  html = setHreflangLinks(html, canonical);
  html = setMetaName(html, "description", page.description);
  html = setMetaName(html, "robots", "index, follow");
  html = setMetaName(html, "author", siteName);
  html = setMetaName(html, "twitter:card", "summary_large_image");
  html = setMetaName(html, "twitter:title", page.title);
  html = setMetaName(html, "twitter:description", page.description);
  html = setMetaName(html, "twitter:image", image);
  html = setMetaName(html, "twitter:image:alt", `${siteName} branded social preview`);
  html = setMetaProperty(html, "og:type", type);
  html = setMetaProperty(html, "og:locale", "en_CA");
  html = setMetaProperty(html, "og:site_name", siteName);
  html = setMetaProperty(html, "og:url", canonical);
  html = setMetaProperty(html, "og:title", page.title);
  html = setMetaProperty(html, "og:description", page.description);
  html = setMetaProperty(html, "og:image", image);
  html = setMetaProperty(html, "og:image:alt", `${siteName} branded social preview`);
  html = insertJsonLd(html, "local-business-schema", localBusinessSchema);
  html = insertJsonLd(html, "faq-schema", buildFaqSchema(page.faqs));
  html = setFallbackContent(html, page);

  // The hero poster is the LCP element on the homepage only. Strip its preload
  // from every other route so those pages don't fetch an image they never use.
  if (page.path !== "/") {
    html = html.replace(
      /\s*<link rel="preload" as="image" href="\/Misc\/hero-video-poster\.webp"[^>]*>/i,
      "",
    );
  }

  return html;
};

const writeRouteHtml = async (page, html) => {
  const routePath = page.path === "/" ? sourceIndexPath : path.join(distDir, page.path, "index.html");

  await mkdir(path.dirname(routePath), { recursive: true });
  await writeFile(routePath, html);
};

const template = await readFile(sourceIndexPath, "utf8");

for (const page of pages) {
  await writeRouteHtml(page, renderPageHtml(template, page));
}

console.log(`Generated static SEO HTML for ${pages.length} routes.`);
