import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadSiteContent } from "./load-site-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../public_html");
const sourceIndexPath = path.join(distDir, "index.html");

const siteOrigin = "https://www.drivingschoolbc.ca";
const siteName = "Shanaya's Driving School";
const defaultImage = `${siteOrigin}/logos/For%20Social%20Media.jpg`;
const defaultDescription =
  "Class 5 and 7 driving lessons, road-test preparation, knowledge-test support, and confidence-building training in Langford, Victoria, and listed B.C. service areas.";

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
    // Keep in sync with localBusinessJsonLd in src/components/SeoManager.tsx.
    streetAddress: "Unit 124, 2770 Leigh Rd",
    addressLocality: "Langford",
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
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons-langford.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons-colwood.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons-saanich.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons-view-royal.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/nervous-driver-lessons-victoria.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/defensive-driving.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/road-test-prep.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/road-test-prep-victoria.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/mock-road-test-victoria.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/road-test-vehicle.webp",
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
    image: "https://www.drivingschoolbc.ca/landing/intensive-driving-course.webp",
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
      "Driving lesson pricing for Victoria and Langford: $89 for 60 minutes, $133.50 for 90. Compare courses, packages, road test prep, and payment plans.",
    image: "https://www.drivingschoolbc.ca/landing/pricing.webp",
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
    title: "BC Knowledge Test, Road Test & Lesson FAQ | Shanaya's",
    description:
      "Verified answers about B.C. Class 7 knowledge and road tests, L and N restrictions, fees, lessons, school licensing, rentals and booking.",
    image: "https://www.drivingschoolbc.ca/landing/faq.webp",
    faqs: [
      {
        question: "What is on the B.C. Class 7 knowledge test, and what does it cost?",
        answer:
          "ICBC's passenger-vehicle knowledge test has 50 multiple-choice questions. You need 40 correct answers to pass, have up to 45 minutes and pay $15 for each attempt. Those figures apply to the online and in-person test options described by ICBC.",
      },
      {
        question: "Does passing the online knowledge test let me start driving?",
        answer:
          "No. An online pass is a test result, not a learner's licence. ICBC says the result is valid for one year. You must still visit a driver licensing office with the required primary and secondary identification, pass the vision screening, complete the photo and consent steps that apply to you, and pay the separate $10 Class 7 learner-licence fee before driving.",
      },
      {
        question: "When can I take the Class 7 road test, how long is it and what are the fees?",
        answer:
          "Under the rules in effect on July 21, 2026, a Class 7 learner may take the road test after holding the L for at least 12 months and staying driving-prohibition-free. ICBC says the test and feedback take about 35 minutes. The current fee is $35 for each attempt, plus $75 for the five-year novice licence if you pass.",
      },
      {
        question: "What should I bring to a Class 7 road-test appointment?",
        answer:
          "Bring your current learner's licence, one accepted primary ID and one accepted secondary ID, payment, required corrective lenses, and a qualified supervisor. Bring a safe, reliable, properly insured vehicle with a Canadian plate, its registration and insurance papers, and the plate number. Bring an approved-course Declaration of Completion if it applies. A car-share vehicle may require a new original authorization letter for each attempt when you are not the named member.",
      },
      {
        question: "Why might ICBC refuse the vehicle before a road test?",
        answer:
          "ICBC may cancel the test if the vehicle is unsafe or does not meet legal requirements. Its published common reasons include cracked or illegally tinted glass, safety-related warning lights, damaged seatbelts, lights or horn that do not work, unsafe tires, doors or windows that do not operate, unsafe or illegal modifications, a hazardous interior, too little fuel or battery charge, or an outstanding serious safety recall. Check ICBC's current vehicle list before the appointment.",
      },
      {
        question: "What skills does ICBC assess, and can a school provide the test route?",
        answer:
          "ICBC's Road Test Skills Explainer groups the criteria under observation, space margin, speed, steering and communication. ICBC states that it does not make road-test routes available outside ICBC, so Shanaya's does not claim to provide an official or exact route. Practise transferable skills across varied legal road conditions instead of memorizing streets.",
      },
      {
        question: "What are ICBC's cancellation notice and road-test retest waits?",
        answer:
          "Give ICBC at least 48 hours' notice when cancelling or rescheduling a road test to avoid the current $25 cancellation fee. After an unsuccessful Class 7 attempt, ICBC's minimum waits are 14 days after the first attempt, 30 days after the second and 60 days after a third or later attempt. A new test fee applies each time.",
      },
      {
        question: "What are the current Class 7 learner (L) restrictions?",
        answer:
          "Display the official L sign. Drive only from 5 a.m. to midnight with a supervisor who is at least 25, holds a valid Class 1, 2, 3, 4 or 5 licence and sits beside you. You may carry that supervisor plus one other passenger. You must have zero alcohol and zero drugs in your blood while driving and may not use hand-held or hands-free electronic devices. Follow any additional restriction printed on your licence.",
      },
      {
        question: "What are the current novice (N) restrictions?",
        answer:
          "Display the official N sign, have zero alcohol and zero drugs in your blood while driving, and do not use hand-held or hands-free electronic devices. The usual limit is one passenger; the passenger limit does not apply when a qualified supervisor age 25 or older is seated beside you or when the additional passengers are immediate family. Follow every restriction printed on your licence.",
      },
      {
        question: "What changes to B.C.'s GLP on October 19, 2026?",
        answer:
          "The first Class 7 learner-to-novice road test remains. From October 19, 2026, the minimum learner period is nine months for drivers age 25 or older and remains 12 months for drivers under 25. Eligible novice drivers move toward Class 5 through a Driving Record Assessment instead of the second road test, followed by 12 months with specified Class 5 or Class 5/6 restrictions. Age, start date and driving record affect the transition, so check ICBC's change page for your case.",
      },
      {
        question: "Are professional lessons required, and who conducts the official tests?",
        answer:
          "Professional lessons are optional for the standard Class 7 path. A learner may prepare through legal supervised practice and ICBC's free materials. ICBC—not Shanaya's—administers the official knowledge and road tests, decides eligibility and issues licences. A lesson or practice assessment cannot guarantee a pass.",
      },
      {
        question: "Is Shanaya's an ICBC-approved school or an approved GLP course provider?",
        answer:
          "Use the terms carefully. ICBC's general driving-school directory lists SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd, Langford, for Class 5 and Class 7 driver training. That supports the school's licensed status but is not an endorsement. As checked July 21, 2026, Shanaya's did not appear in ICBC's separate directory of schools offering an approved GLP course, so this page does not describe its lessons as an ICBC-approved course.",
      },
      {
        question: "How many professional lessons do I need?",
        answer:
          "There is no fixed professional-lesson count for the standard Class 7 road-test path. ICBC recommends at least 60 hours of total practice before the Class 7 road test, but supervised practice can make up those hours. Choose any paid instruction based on observed skill gaps, legal practice available outside lessons and readiness—not a promised number of sessions or a guaranteed result.",
      },
      {
        question: "What lesson prices are shown in Shanaya's current catalogue?",
        answer:
          "The catalogue's base rates before GST are $89 for 60 minutes and $133.50 for 90 minutes in the standard and regional service tiers. Salt Spring Island rates are $109 for 60 minutes and $163.50 for 90 minutes. Packages, fixed-price courses, discounts and add-ons can differ, so review the itemized checkout total before paying.",
      },
      {
        question: "What road-test vehicle options and prices are listed?",
        answer:
          "The current catalogue shows a stand-alone road-test-day vehicle option at $250 and a combined lesson, road-test preparation and rental course at $350 for its 60-minute format or $450 for its 90-minute format. Prices are before GST. Booking is subject to service-area, instructor and vehicle availability and written terms, and it does not guarantee that ICBC will accept the vehicle; the examiner applies ICBC's test-day vehicle rules.",
      },
      {
        question: "Where are lessons offered, and what payment or cancellation terms apply?",
        answer:
          "The catalogue lists Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan and Salt Spring Island, all subject to instructor scheduling and routing. Checkout currently requests the full displayed total; Affirm or Afterpay/Clearpay may appear only for eligible transactions. No general school cancellation, refund or no-show rule is stated here as verified fact. Before paying, obtain written terms for your lesson or vehicle booking and written confirmation of any alternative payment arrangement.",
      },
    ],
  },
  {
    path: "/icbc-approved-driving-school/",
    title: "Licensed Driving School in Langford, BC | Shanaya's",
    description:
      "Verify Shanaya's Driving School's Langford listing for Class 5 and 7 driver training, and learn why a licensed school is not the same as an ICBC-approved GLP course.",
    image: "https://www.drivingschoolbc.ca/landing/driving-lessons-langford.webp",
    faqs: [
      {
        question: "Is Shanaya's Driving School ICBC-approved?",
        answer:
          "That is not the claim made here. ICBC's general directory listed SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd in Langford for Class 5 and 7 driver training when checked July 21, 2026. The permitted description used here is \"licensed as a driver training school under the Motor Vehicle Act.\" ICBC says its list is not a recommendation or endorsement.",
      },
      {
        question: "Does Shanaya's offer an ICBC-approved GLP course?",
        answer:
          "Shanaya's did not appear under the exact business name, address or telephone in ICBC's separate approved-GLP school directory when checked July 21, 2026. Do not assume an ordinary lesson has GLP-course approval or qualifies for a GLP benefit; verify the current ICBC directory and the specific course before enrolling.",
      },
      {
        question: "What do Classes 5 and 7 in the directory mean for this page?",
        answer:
          "They are the two entries shown in the record's driver-training field. That field supports the scope recorded for the school, but it does not by itself verify a particular instructor's current licence, a vehicle, a curriculum or an approved GLP course.",
      },
      {
        question: "Is a school mock test an official ICBC road test?",
        answer:
          "No. A lesson, mock test or practice assessment provided by a private school is coaching only. It is not administered by ICBC, does not produce an official ICBC score and cannot determine whether ICBC will issue a licence.",
      },
      {
        question: "How can I verify a school or course before paying?",
        answer:
          "Use ICBC's general school directory, match the exact business identifiers, and ask to see the current school and instructor credentials relevant to your booking. If a GLP-approved course is advertised, also find the school in ICBC's separate approved-GLP directory and confirm that the specific course is the approved offering.",
      },
    ],
  },
  {
    path: "/bc-graduated-licensing-program/",
    title: "B.C. GLP Rules Before and After October 19, 2026 | Shanaya's",
    description:
      "Compare B.C. GLP stages, restrictions and minimum timelines before and from October 19, 2026, including the DRA and restricted Class 5 year.",
    image: "https://www.drivingschoolbc.ca/landing/bc-graduated-licensing-program.webp",
    faqs: [
      {
        question: "What is the minimum GLP time from October 19, 2026?",
        answer:
          "Assuming immediate transitions, no reset and every condition is met: 48 months for a driver under 25, 42 months for an under-25 driver who qualifies for the approved-course reduction, or 33 months under the new age-25-or-older path. Each total includes the final 12 months with Class 5 restriction 55 and excludes appointment, processing and pre-L time.",
      },
      {
        question: "What is the difference between an L and an N in B.C.?",
        answer:
          "A Class 7L driver must drive with a qualified supervisor seated beside them and follow the L passenger, sign, midnight-to-5 a.m., zero-alcohol-and-drug and electronic-device rules. A Class 7N driver may drive alone but follows the applicable N sign, passenger, zero-alcohol-and-drug and electronic-device rules.",
      },
      {
        question: "How many road tests are in the B.C. GLP?",
        answer:
          "Through October 18, 2026, there are two: a Class 7 road test for the N and a Class 5 road test to exit GLP. From October 19, the Class 7 road test remains, but the second road test is replaced by a DRA criteria check followed by 12 months with Class 5 restriction 55.",
      },
      {
        question: "Is the Driving Record Assessment another test?",
        answer:
          "No. It is ICBC's review of whether the driver has the required uninterrupted non-Learner experience and no specified prohibitions, suspensions, excessive-speed conviction, electronic-device conviction or relevant Criminal Code driving sanction during that period.",
      },
      {
        question: "Do N drivers age 25 or older need an N sign after October 19?",
        answer:
          "Under the rules effective October 19, the N-sign and one-passenger restrictions apply only to Class 7 drivers under 25. A Class 7 driver age 25 or older still follows the zero-alcohol-and-drug and new-driver electronic-device prohibitions.",
      },
      {
        question: "What is restriction 55 on the new Class 5 licence?",
        answer:
          "It requires zero blood alcohol and zero blood drug content while driving for 12 compliant months. It expires automatically, but a specified prohibition or suspension restarts the 12-month period from the date the driver may lawfully drive again.",
      },
      {
        question: "Do regular lessons qualify for the six-month GLP reduction?",
        answer:
          "No. The reduction requires a specific ICBC-approved 32-hour Class 7 GLP course and the other eligibility conditions. Shanaya's was listed in ICBC's general driver-training directory, but its name, phone and Leigh Road address were not found in ICBC's separate approved-GLP-course list when checked July 21, 2026.",
      },
      {
        question: "What happens to a Class 5 road test scheduled for October 19 or later?",
        answer:
          "ICBC says second-road-test appointments scheduled to occur on or after October 19, 2026 will be cancelled and affected drivers will receive an email with next steps. A one-time automatic upgrade is only for drivers ICBC confirms are eligible; follow your ICBC notice.",
      },
      {
        question: "What are the current Class 7 and Class 5 road-test fees?",
        answer:
          "ICBC's fee page listed $35 for a Class 7 road test and $50 for a Class 5 road test when checked July 21, 2026, with licence fees separate. This guide does not state a future DRA fee; check ICBC before your appointment.",
      },
    ],
  },
  {
    path: "/driving-instructor-victoria/",
    title: "Driving Instructor in Victoria BC | Shanaya's Driving School",
    description:
      "Looking for a driving instructor in Victoria or Langford? Shanaya's ICBC-licensed instructors give patient, one-on-one lessons in dual-control cars, with pick-up and drop-off across Greater Victoria.",
    image: "https://www.drivingschoolbc.ca/landing/driving-instructor-victoria.webp",
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
    title: "B.C. Driver Education Options & Requirements | Shanaya's",
    description:
      "Compare free ICBC self-study, supervised practice, optional private lessons and the separately approved 32-hour GLP course under B.C.'s 2026 rules.",
    image: "https://www.drivingschoolbc.ca/landing/driver-education-training.webp",
    faqs: [
      {
        question: "What are the four driver-education options for a new B.C. driver?",
        answer:
          "They are free self-study with ICBC materials, legal practice with a qualified supervisor, optional ordinary lessons from a licensed school, and a separate ICBC-approved 32-hour GLP course. Each serves a different purpose.",
      },
      {
        question: "Are paid driving lessons required for the standard Class 7 path?",
        answer:
          "No. ICBC's standard path requires the official tests, the applicable waiting periods and compliance with licence conditions, including supervised practice while driving as an L. Ordinary professional lessons are an optional source of instruction.",
      },
      {
        question: "Does ICBC require 60 hours of professional lessons?",
        answer:
          "No. ICBC's Tuning Up for Drivers guide says a supervisor should plan to spend about 60 hours helping a new driver prepare for the Class 7 road test. That is preparation guidance, not a statutory minimum or a requirement to buy 60 lesson hours.",
      },
      {
        question: "Are ordinary lessons the same as an ICBC-approved GLP course?",
        answer:
          "No. An ordinary lesson may be offered by a licensed school, but the GLP course and the school offering it require separate ICBC approval. Only the specific approved course can support the conditional course benefit.",
      },
      {
        question: "How many hours are in an approved Class 7 GLP course?",
        answer:
          "At least 32 hours: 16 hours of classroom theory, 12 hours of individual on-road instruction and 4 discretionary hours. ICBC says it must be completed within 365 days while the student has a Class 7L, and the possible six-month N-stage reduction has additional driving-record conditions.",
      },
      {
        question: "What is the Class 7 path through October 18, 2026?",
        answer:
          "The sequence is L after the knowledge and vision tests, at least 12 months of supervised Learner practice, the Class 7 road test for an N, then the applicable N-stage period and a Class 5 road test to exit GLP. The current N minimum is 24 months, potentially 18 months for a driver who qualifies for the approved-course reduction.",
      },
      {
        question: "What changes to driver licensing on October 19, 2026?",
        answer:
          "The Class 7 road test remains, but a Driving Record Assessment replaces the second road test. An eligible driver then has a Class 5 licence with restriction 55 for 12 compliant months. Minimum periods vary by age, record and approved-course eligibility, so confirm your individual transition with ICBC.",
      },
      {
        question: "Is Shanaya's listed for an ICBC-approved GLP course?",
        answer:
          "No matching entry was found under Shanaya's exact name, Leigh Road address or telephone in ICBC's separate approved-GLP directory when checked July 21, 2026. ICBC's general directory did list SHANAYA'S DRIVING SCHOOL in Langford for Class 5 and 7 driver training; that is a licensing record, not ICBC endorsement or GLP-course approval.",
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
      "Learn about Shanaya's Driving School, its Langford Class 5 and 7 directory listing, supportive training approach, and student-first instruction.",
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
    title: "Moving to B.C.: Exchange or Get a B.C. Driver's Licence | Shanaya's",
    description:
      "Choose the correct ICBC path to exchange a valid licence or start B.C.'s Class 7 process, with document, experience, deadline, fee and source details.",
  },
  {
    path: "/knowledge-test-practice/",
    title: "Independent B.C. Class 7 Knowledge Test Practice | Shanaya's",
    description:
      "Use an independent 20-question Class 7 study bank, then verify every rule with ICBC's official guide and practice test.",
  },
  {
    path: "/knowledge-test-guide/",
    title: "B.C. Class 7 Knowledge Test: Online & In-Person Guide | Shanaya's",
    description:
      "Current Class 7 guide to ICBC's online and in-person B.C. knowledge test: eligibility, 50 questions, fees, study sources, ID and licence steps.",
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
    path: "/blog/bc-glp-changes-2026/",
    title: "B.C. GLP Changes: What Starts October 19, 2026",
    description:
      "A sourced guide to B.C.'s October 19, 2026 GLP changes: the Driving Record Assessment, age-based timelines, restricted Class 5 stage and transition rules.",
    type: "article",
    image: `${siteOrigin}/landing/bc-graduated-licensing-program.webp`,
    article: {
      headline: "B.C. GLP Changes on October 19, 2026: Second Road Test, DRA and New Timelines",
      section: "ICBC Updates",
      datePublished: "2026-07-21",
      dateModified: "2026-07-21",
    },
  },
  {
    path: "/blog/how-to-pass-driving-test-victoria-bc/",
    title: "Class 7 Road Test Victoria: Preparation Guide",
    description:
      "Prepare for a B.C. Class 7 road test in Victoria with verified ICBC eligibility, practice, booking, fee, vehicle and test-day information.",
    type: "article",
    image: `${siteOrigin}/blog/how-to-pass-driving-test-victoria-bc.webp`,
    article: {
      headline: "B.C. Class 7 Road Test: Victoria Preparation Guide",
      section: "Road Test Guide",
      datePublished: "2026-07-05",
      dateModified: "2026-07-21",
    },
  },
  {
    path: "/blog/icbc-road-test-tips-victoria/",
    title: "Class 7 Road Test Tips for Victoria, B.C.",
    description:
      "Apply ICBC's Class 7 road-test skills across Greater Victoria hills, one-way streets, roundabouts and cyclist traffic without relying on route claims.",
    type: "article",
    image: `${siteOrigin}/blog/icbc-road-test-tips-victoria.webp`,
    article: {
      headline: "Class 7 Road Test Tips for Victoria Driving Conditions",
      section: "Road Test Tips",
      datePublished: "2026-07-05",
      dateModified: "2026-07-21",
    },
  },
  {
    path: "/blog/pass-road-test/",
    title: "B.C. Class 7 Road Test Checklist",
    description:
      "A source-checked Class 7 checklist for eligibility, practice, booking, ID, vehicle readiness, fees, test day, results and novice restrictions.",
    type: "article",
    image: `${siteOrigin}/blog/road-test-tips.webp`,
    article: {
      headline: "B.C. Class 7 Road Test: Readiness and Test-Day Checklist",
      section: "Road Test Checklist",
      datePublished: "2026-03-01",
      dateModified: "2026-07-21",
    },
  },
  {
    path: "/blog/defensive-driving/",
    title: "Defensive Driving in B.C.: Practical Guide",
    description:
      "Use ICBC's See–Think–Do method to scan, manage space, choose a safe speed and respond calmly to common driving risks in B.C.",
    type: "article",
    image: `${siteOrigin}/blog/what-is-defensive-driving.webp`,
    article: {
      headline: "Defensive Driving in B.C.: A Practical Risk-Management Guide",
      section: "Driving Skills",
      datePublished: "2026-02-20",
      dateModified: "2026-07-21",
    },
  },
  {
    path: "/blog/newcomers-guide-bc/",
    title: "Moving to B.C.: Licence Deadlines & 5 Road Rules",
    description:
      "A source-checked overview of B.C.'s 90-day licence deadline, newcomer licensing paths, vehicle deadline, and five road rules for passenger drivers.",
    type: "article",
    image: `${siteOrigin}/blog/newcomers-guide-bc.webp`,
    article: {
      headline: "Moving to B.C.: Licence Deadlines and Five Road Rules to Check",
      section: "Newcomer Resources",
      datePublished: "2026-02-10",
      dateModified: "2026-07-21",
    },
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

/* Mirrors buildArticleJsonLd in src/components/SeoManager.tsx. Keep the two in
   sync: this one serves crawlers that never execute the React bundle. */
const buildArticleSchema = (page, canonical, image) => {
  if (!page.article) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: page.article.headline,
    description: page.description,
    image,
    datePublished: page.article.datePublished,
    dateModified: page.article.dateModified,
    articleSection: page.article.section,
    inLanguage: "en-CA",
    author: {
      "@type": "Organization",
      name: siteName,
      url: `${siteOrigin}/about/`,
    },
    publisher: { "@id": `${siteOrigin}/#localbusiness` },
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

const fallbackPattern = /(<main id="seo-fallback">)([\s\S]*?)(<\/main>)/i;

const blogNavPattern = /<nav aria-label="Driving tips and guides">[\s\S]*?<\/nav>/i;

/* index.html hardcodes the blog links in the #seo-fallback nav, so a new post
   silently never appears there. Rebuild that nav from blogPosts instead: this
   nav ships on every page and is the main internal link source for crawlers
   that don't run JS. */
const setBlogNav = (html, blogContent) => {
  if (!blogNavPattern.test(html)) {
    throw new Error('Could not find the "Driving tips and guides" nav in index.html');
  }

  const links = [
    `<a href="${siteOrigin}/blog/">Driving tips and road test resources</a>`,
    ...[...blogContent.entries()]
      .sort((a, b) => (a[1].datePublished < b[1].datePublished ? 1 : -1))
      .map(
        ([slug, post]) =>
          `<a href="${siteOrigin}/blog/${slug}/">${escapeHtml(post.title)}</a>`,
      ),
  ];

  return html.replace(
    blogNavPattern,
    () =>
      `<nav aria-label="Driving tips and guides">\n          ${links.join("\n          ")}\n        </nav>`,
  );
};

const para = (text) => `<p>${escapeHtml(text)}</p>`;
const list = (items) =>
  items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";

/* Replaces the generic #seo-fallback boilerplate with real page content built
   from the same data src/ renders. Keeps the site-wide <nav> blocks, which are
   the only internal links a non-JS crawler ever sees. This changes nothing a
   visitor sees: the fallback is display:none and React replaces #root on mount. */
const replaceFallback = (html, page, buildBody) => {
  const match = html.match(fallbackPattern);

  if (!match) {
    throw new Error(`Could not find #seo-fallback block while rendering ${page.path}`);
  }

  const navs = match[2].match(/<nav[\s\S]*<\/nav>/i)?.[0] ?? "";

  return html.replace(
    fallbackPattern,
    () => `${match[1]}\n        ${buildBody()}\n        ${navs}\n      ${match[3]}`,
  );
};

const buildLandingBody = (landing) => {
  const parts = [`<h1>${escapeHtml(landing.h1)}</h1>`, para(landing.heroDescription)];

  landing.intro.forEach((text) => parts.push(para(text)));

  landing.sections.forEach((section) => {
    parts.push(`<section><h2>${escapeHtml(section.title)}</h2>`);
    parts.push(para(section.body));
    parts.push(list(section.bullets ?? []));
    parts.push(`</section>`);
  });

  if (landing.serviceAreas.length) {
    parts.push(`<section><h2>${escapeHtml(landing.serviceAreaTitle ?? "Service areas")}</h2>`);
    parts.push(list(landing.serviceAreas));
    parts.push(`</section>`);
  }

  if (landing.testimonial) {
    const { quote, name, location } = landing.testimonial;
    parts.push(
      `<blockquote><p>${escapeHtml(quote)}</p><cite>${escapeHtml(`${name}, ${location}`)}</cite></blockquote>`,
    );
  }

  if (landing.faqs.length) {
    parts.push(`<section><h2>Frequently asked questions</h2>`);
    landing.faqs.forEach((faq) => {
      parts.push(`<h3>${escapeHtml(faq.question)}</h3>`);
      parts.push(para(faq.answer));
    });
    parts.push(`</section>`);
  }

  if (landing.lastReviewed || landing.officialSources.length) {
    parts.push(`<section><h2>Official sources and review note</h2>`);
    parts.push(
      para(
        "Prepared by Shanaya's Driving School, an independent driving school. Confirm current licensing requirements with ICBC.",
      ),
    );
    if (landing.editorialNote) {
      parts.push(para(landing.editorialNote));
    }
    if (landing.lastReviewed) {
      parts.push(para(`Information checked: ${landing.lastReviewed}`));
    }
    if (landing.officialSources.length) {
      parts.push(`<ul>`);
      landing.officialSources.forEach((source) => {
        parts.push(
          `<li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`,
        );
      });
      parts.push(`</ul>`);
    }
    parts.push(`</section>`);
  }

  if (landing.relatedLinks.length) {
    parts.push(`<section><h2>${escapeHtml(landing.relatedLinksTitle ?? "Related pages")}</h2><ul>`);
    landing.relatedLinks.forEach((link) => {
      const href = `${siteOrigin}${link.href.replace(/\/?$/, "/")}`;
      const description = link.description ? ` — ${link.description}` : "";
      parts.push(
        `<li><a href="${escapeHtml(href)}">${escapeHtml(link.label)}</a>${escapeHtml(description)}</li>`,
      );
    });
    parts.push(`</ul></section>`);
  }

  return parts.filter(Boolean).join("\n        ");
};

/* The /blog/ index is a bespoke React page with no backing data object, so its
   fallback would otherwise carry no links to any article at all. */
const buildBlogIndexBody = (page, blogContent) => {
  const posts = [...blogContent.entries()].sort((a, b) =>
    a[1].datePublished < b[1].datePublished ? 1 : -1,
  );

  const parts = [
    `<h1>${escapeHtml(page.title.split(" | ")[0])}</h1>`,
    para(page.description),
    `<ul>`,
  ];

  posts.forEach(([slug, post]) => {
    parts.push(
      `<li><article><h2><a href="${siteOrigin}/blog/${slug}/">${escapeHtml(post.title)}</a></h2>` +
        `${para(post.description)}` +
        `${para(`${post.category} · Updated ${post.date} · ${post.readTime}`)}</article></li>`,
    );
  });

  parts.push(`</ul>`);

  return parts.join("\n        ");
};

/* /knowledge-test-guide is a bespoke React resource rather than a data-backed
   landing page. Keep a substantive, source-linked fallback for crawlers and
   no-JavaScript visitors instead of the generic title/description fallback. */
const buildKnowledgeTestGuideBody = (page) => {
  const sources = [
    ["ICBC online knowledge test", "https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test"],
    ["ICBC Get your L", "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L"],
    ["ICBC Learn to Drive Smart", "https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"],
    ["ICBC official practice knowledge test", "https://www.icbc.com/driver-licensing/new-drivers/practice-knowledge-test"],
    ["ICBC accepted identification", "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID"],
    ["ICBC knowledge-test appointments", "https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-knowledge-test-and-other-services"],
    ["ICBC driver licensing fees", "https://www.icbc.com/driver-licensing/visit-dl-office/Fees"],
    ["B.C. government October 2026 GLP announcement", "https://news.gov.bc.ca/releases/2026PSSG0061-000847"],
  ];

  return [
    `<article>`,
    `<h1>B.C. Class 7 Knowledge Test: Online and In-Person Guide</h1>`,
    para(page.description),
    para("Prepared and maintained by Shanaya's Driving School, an independent driving school. This is not an ICBC publication. Information checked against the linked official sources on July 21, 2026."),
    `<section><h2>Current Class 7 test facts</h2>`,
    list([
      "You must be at least 16 and a B.C. resident to apply.",
      "The passenger-vehicle test has 50 multiple-choice questions; 40 correct answers (80%) are required to pass.",
      "The maximum time is 45 minutes and each attempt costs $15.",
      "Online and in-person tests are available in 12 languages.",
    ]),
    para("As of July 21, 2026, applicants under 19 need parent or legal guardian consent. The B.C. government says the threshold will change to under 18 on October 19, 2026; confirm ICBC's current instructions when applying."),
    `</section>`,
    `<section><h2>Study with official materials</h2>`,
    para("Read ICBC's Learn to Drive Smart guide first, then use ICBC's official practice knowledge test. Private practice questions should only supplement these sources."),
    `</section>`,
    `<section><h2>Online workflow</h2>`,
    list([
      "Register with an email address, accepted primary ID and a Visa, Mastercard or American Express card for the $15 fee.",
      "Use a desktop or laptop with a keyboard, pointing device, webcam and stable connection while physically in Canada or the United States.",
      "Start within 72 hours and complete the 45-minute test in one session without talking, study materials or another electronic device.",
      "After a failure or disqualification, ICBC permits another online attempt after 24 hours with a new registration and fee. Three online disqualifications prevent online testing for six months; in-person testing remains available.",
    ]),
    `</section>`,
    `<section><h2>In-person workflow</h2>`,
    para("Use ICBC's office finder and appointment instructions. Bring one accepted primary and one secondary ID, applicable consent, payment for the $15 test and $10 Class 7 photo learner-licence fees, and corrective lenses if required for vision screening."),
    `</section>`,
    `<section><h2>An online pass is not a licence</h2>`,
    para("You cannot drive until ICBC issues your learner's licence. After an online pass, visit a driver licensing office with the same primary ID used online plus secondary ID, the pass-confirmation email, applicable consent, corrective lenses and the licence fee. Complete the vision, identity, photo and issuance steps. The online result is valid for one year."),
    `</section>`,
    `<section><h2>Official sources</h2><ul>`,
    ...sources.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`),
    `</ul></section>`,
    para("For corrections, email book@drivingschoolbc.ca."),
    `</article>`,
  ].join("\n        ");
};

/* The newcomer guide is also a bespoke React resource. This fallback keeps its
   actual decision path and source links available without JavaScript. */
const buildNewcomersGuideBody = (page) => {
  const sources = [
    ["ICBC: moving from within Canada", "https://www.icbc.com/driver-licensing/moving-bc/Moving-from-within-canada"],
    ["ICBC: moving from outside Canada", "https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country"],
    ["ICBC: proving driving experience", "https://www.icbc.com/driver-licensing/moving-bc/Proving-your-driving-experience"],
    ["ICBC: accepted identification", "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID"],
    ["ICBC: moving to B.C. with a vehicle", "https://www.icbc.com/insurance/moving-travelling/moving-BC"],
    ["ICBC: driver licensing fees", "https://www.icbc.com/driver-licensing/visit-dl-office/Fees"],
    ["ICBC: October 2026 GLP changes", "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"],
    ["ICBC: licensed driving-school directory", "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school"],
    ["ICBC: approved GLP schools", "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools"],
  ];

  return [
    `<article>`,
    `<h1>Moving to B.C.: Exchange or Get a B.C. Driver's Licence</h1>`,
    para(page.description),
    para("Prepared and maintained by Shanaya's Driving School, an independent driving school. ICBC decides each applicant's exchange, testing and licence eligibility. Information checked July 21, 2026."),
    `<section><h2>Choose the path that matches your current licence</h2>`,
    list([
      "Valid licence from another Canadian province or territory: apply to exchange it and bring the records ICBC requests.",
      "Valid licence from an exchange jurisdiction: some eligible passenger licences can be exchanged without knowledge and road tests.",
      "Valid licence from a non-exchange jurisdiction: ICBC generally requires a vision screening, knowledge test and road test.",
      "Never licensed: begin the Class 7 learner process.",
    ]),
    para("ICBC considers the licence's validity and class, the issuing jurisdiction and the full-privilege driving experience you can prove. Do not rely on a static country list."),
    `</section>`,
    `<section><h2>The general 90-day deadline and exceptions</h2>`,
    para("After moving to B.C., you generally have 90 days to exchange a valid out-of-province licence. The home-jurisdiction licence must remain valid."),
    list([
      "A tourist visiting for up to six months.",
      "An eligible full-time student enrolled at a designated B.C. institution.",
      "A person ordinarily resident outside B.C.",
      "A Seasonal Agricultural Worker Program permit holder, for up to 12 months on a valid home licence.",
    ]),
    para("Confirm an exception with ICBC rather than inferring it from a general study or work permit."),
    `</section>`,
    `<section><h2>Documents and driving experience</h2>`,
    list([
      "One accepted primary and one accepted secondary ID.",
      "The current valid driver's licence, which must be surrendered when a B.C. licence is issued.",
      "Original proof of full-privilege driving experience.",
      "An ICBC-approved translation with the source document when ICBC requires one.",
    ]),
    para("At least two years of provable full-privilege, non-learner experience is required for a GLP exemption. ICBC determines the credit and licence stage. A personal vehicle brought to B.C. generally must be registered, licensed and insured here within 30 days."),
    `</section>`,
    `<section><h2>Current first-time Class 7 fees</h2>`,
    list([
      "$15 for each Class 7 knowledge-test attempt.",
      "$10 for the Class 7 photo learner licence after qualification.",
      "$35 for each Class 7 road-test attempt.",
      "$75 for the first five-year novice licence when issued.",
    ]),
    para("Fees were checked July 21, 2026 and can change. Passing the online knowledge test is not a licence; ICBC must complete the identity, vision and issuance steps before the applicant may drive."),
    `</section>`,
    `<section><h2>October 19, 2026 GLP transition</h2>`,
    para("The first Class 7 road test remains. For eligible novice drivers, a Driving Record Assessment replaces the second road test. The resulting Class 5 carries restriction 55 for 12 months. Age-based minimum periods, record criteria and transition rules apply, so confirm the individual path with ICBC."),
    `</section>`,
    `<section><h2>Licensed school and approved GLP course are different</h2>`,
    para("ICBC's general directory lists Shanaya's for Class 5 and 7 driver training. That confirms ordinary school licensing; it is not an endorsement. As checked July 21, 2026, Shanaya's was not listed in ICBC's separate approved-GLP-school directory. Ordinary lessons do not create the approved-course time reduction."),
    `</section>`,
    `<section><h2>Official sources</h2><ul>`,
    ...sources.map(([label, href]) => `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`),
    `</ul></section>`,
    para("For corrections, email book@drivingschoolbc.ca."),
    `</article>`,
  ].join("\n        ");
};

const buildProductBody = (product) => {
  const parts = [`<h1>${escapeHtml(product.h1)}</h1>`, para(product.description)];

  if (product.meta?.length) {
    parts.push(list(product.meta));
  }
  if (product.detail) {
    parts.push(para(product.detail));
  }
  (product.paragraphs ?? []).forEach((text) => parts.push(para(text)));

  if (product.bullets?.length) {
    parts.push(`<section><h2>${escapeHtml(product.bulletsTitle)}</h2>`);
    parts.push(list(product.bullets));
    parts.push(`</section>`);
  }

  (product.outlineSections ?? []).forEach((section) => {
    parts.push(`<section><h2>${escapeHtml(section.title)}</h2>`);
    parts.push(list(section.objectives ?? []));
    parts.push(`</section>`);
  });

  return parts.filter(Boolean).join("\n        ");
};

const buildBlogBody = (post) => {
  const byline = [
    `By ${post.author}`,
    `Updated ${post.date}`,
    post.readTime,
    post.category,
  ].join(" · ");

  return [
    `<article>`,
    `<h1>${escapeHtml(post.title)}</h1>`,
    para(post.description),
    para(byline),
    post.html,
    `</article>`,
  ].join("\n        ");
};

const renderPageHtml = (template, page, content) => {
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
  html = insertJsonLd(html, "article-schema", buildArticleSchema(page, canonical, image));

  const blogSlug = page.path.match(/^\/blog\/([^/]+)\/$/)?.[1];
  const post = blogSlug ? content.blogPosts.get(blogSlug) : undefined;

  if (blogSlug && !post) {
    throw new Error(`No rendered content for blog post "${blogSlug}" — is it in src/data/blogPosts.tsx?`);
  }

  const landing = content.landingPages.get(page.path);
  const product = content.products.get(page.path);

  html = setBlogNav(html, content.blogPosts);

  if (page.path === "/blog/") {
    html = replaceFallback(html, page, () => buildBlogIndexBody(page, content.blogPosts));
  } else if (page.path === "/newcomers-guide/") {
    html = replaceFallback(html, page, () => buildNewcomersGuideBody(page));
  } else if (page.path === "/knowledge-test-guide/") {
    html = replaceFallback(html, page, () => buildKnowledgeTestGuideBody(page));
  } else if (post) {
    html = replaceFallback(html, page, () => buildBlogBody(post));
  } else if (landing) {
    html = replaceFallback(html, page, () => buildLandingBody(landing));
  } else if (product) {
    html = replaceFallback(html, page, () => buildProductBody(product));
  } else {
    html = setFallbackContent(html, page);
  }

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
const content = await loadSiteContent();
const { blogPosts: blogContent, landingPages: landingContent } = content;

/* The page entries above duplicate metadata that already lives in src/, and the
   two have silently drifted before. Fail the build rather than ship a page whose
   crawler HTML disagrees with what React renders for the same URL. */
const assertMetadataInSync = () => {
  const problems = [];
  const compare = (label, source, expected, actual) => {
    for (const [field, want] of Object.entries(expected)) {
      if (JSON.stringify(actual[field]) !== JSON.stringify(want)) {
        problems.push(
          `  ${label} → ${field}\n    generator: ${JSON.stringify(actual[field])}\n    ${source}: ${JSON.stringify(want)}`,
        );
      }
    }
  };

  for (const page of pages) {
    const slug = page.path.match(/^\/blog\/([^/]+)\/$/)?.[1];
    const post = slug && blogContent.get(slug);

    if (post) {
      compare(
        slug,
        "blogPosts",
        {
          title: post.seoTitle ?? `${post.title} | ${siteName}`,
          description: post.description,
          "article.headline": post.title,
          "article.datePublished": post.datePublished,
          "article.dateModified": post.dateModified,
          "article.section": post.category,
        },
        {
          title: page.title,
          description: page.description,
          "article.headline": page.article?.headline,
          "article.datePublished": page.article?.datePublished,
          "article.dateModified": page.article?.dateModified,
          "article.section": page.article?.section,
        },
      );
      continue;
    }

    const landing = landingContent.get(page.path);
    if (landing) {
      compare(
        page.path,
        "seoLandingPages",
        { title: landing.title, description: landing.description, faqs: landing.faqs },
        { title: page.title, description: page.description, faqs: page.faqs ?? [] },
      );
    }
  }

  if (problems.length) {
    throw new Error(`Page metadata is out of sync with src/data/:\n${problems.join("\n")}`);
  }
};

assertMetadataInSync();

for (const page of pages) {
  await writeRouteHtml(page, renderPageHtml(template, page, content));
}

console.log(
  `Generated static SEO HTML for ${pages.length} routes (${blogContent.size} blog posts pre-rendered).`,
);
