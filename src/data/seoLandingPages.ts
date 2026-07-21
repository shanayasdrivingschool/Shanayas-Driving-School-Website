export type SeoLandingPageId =
  | "driving-lessons"
  | "driving-lessons-langford"
  | "driving-lessons-colwood"
  | "driving-lessons-saanich"
  | "driving-lessons-view-royal"
  | "nervous-driver-lessons-victoria"
  | "defensive-driving"
  | "road-test-prep"
  | "road-test-prep-victoria"
  | "mock-road-test-victoria"
  | "road-test-vehicle"
  | "intensive-driving-course"
  | "pricing"
  | "faq"
  | "icbc-approved-driving-school"
  | "bc-graduated-licensing-program"
  | "driving-instructor-victoria"
  | "driver-education-training";

export type SeoLandingPageSection = {
  title: string;
  body: string;
  bullets?: string[];
};

export type SeoLandingPageFaq = {
  question: string;
  answer: string;
};

export type SeoLandingPageTestimonial = {
  quote: string;
  name: string;
  location: string;
};

export type SeoLandingPageRelatedLink = {
  label: string;
  href: string;
  description?: string;
};

export type SeoLandingPage = {
  id: SeoLandingPageId;
  path: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  heroImage: string;
  targetKeyword: string;
  intro: string[];
  sections: SeoLandingPageSection[];
  serviceAreaTitle?: string;
  serviceAreas?: string[];
  faqs?: SeoLandingPageFaq[];
  testimonial?: SeoLandingPageTestimonial;
  relatedLinks?: SeoLandingPageRelatedLink[];
  relatedLinksTitle?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    id: "driving-lessons",
    path: "/driving-lessons",
    title: "ICBC Driving Lessons Victoria BC | Shanaya's Driving School",
    metaDescription:
      "Beginner driving lessons in Victoria, Langford, and Greater Victoria with ICBC-aligned coaching, dual-control vehicles, and calm instructor support.",
    eyebrow: "Beginner driving lessons",
    h1: "ICBC driving lessons in Victoria, BC",
    heroDescription:
      "Learn safe vehicle control, road awareness, and everyday driving habits with structured, ICBC-aligned beginner lessons across Victoria and Langford.",
    heroImage: "/landing/driving-lessons.webp",
    targetKeyword: "driving lessons Victoria BC",
    intro: [
      "Shanaya's Driving School helps new drivers build confidence from the first lesson. Our beginner driving lessons are designed for students who want a clear plan, patient coaching, and practical experience on real roads in Victoria, Langford, and nearby communities.",
      "Each session focuses on the skills that matter for safe daily driving: smooth steering, braking, lane position, mirrors, shoulder checks, intersections, parking, speed control, and decision-making around other road users. Lessons are paced around the student, so nervous beginners can develop control before moving into busier routes.",
      "Training follows ICBC expectations while staying practical. The goal is not only to pass a road test, but to become a safer and more confident driver after the test is over.",
    ],
    sections: [
      {
        title: "What beginner lessons cover",
        body:
          "Students start with fundamentals and progress into real traffic as confidence improves. Instructors explain each skill clearly, demonstrate what to look for, and give direct feedback after each practice segment.",
        bullets: [
          "Vehicle setup, steering control, braking, and acceleration",
          "Observation habits, mirror use, shoulder checks, and blind spot awareness",
          "Turns, intersections, lane changes, parking, and residential road practice",
        ],
      },
      {
        title: "Who this page is for",
        body:
          "This program is a fit for first-time drivers, students preparing for their N road test, and families looking for professional support before a learner spends more time driving independently.",
      },
      {
        title: "Local lesson areas",
        body:
          "Lessons are available in Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan, and Salt Spring Island depending on scheduling and service availability.",
      },
    ],
    faqs: [
      {
        question: "Do beginners need any experience before booking?",
        answer:
          "No. Beginner lessons can start with basic vehicle control and progress at the student's pace.",
      },
      {
        question: "Are lessons aligned with ICBC road test expectations?",
        answer:
          "Yes. Lessons build the observation, control, parking, and road judgment habits ICBC examiners expect to see.",
      },
    ],
  },
  {
    id: "driving-lessons-langford",
    path: "/driving-lessons-langford",
    title: "Driving Lessons in Langford, BC | Shanaya's Driving School",
    metaDescription:
      "Langford driving school offering lessons across the Westshore, BC with ICBC-aligned coaching, dual-control cars, and lessons that start from our Leigh Rd office.",
    eyebrow: "Langford driving lessons",
    h1: "Driving lessons in Langford, BC",
    heroDescription:
      "Learn to drive with confidence across Langford and the Westshore, with calm, ICBC-aligned instruction on roundabouts, Goldstream Avenue traffic, highway merges, and parking from our local Langford hub.",
    heroImage: "/landing/driving-lessons-langford.webp",
    targetKeyword: "driving lessons Langford BC",
    testimonial: {
      quote:
        "I started as a nervous beginner, and my instructor made every lesson calm, clear, and easy to follow.",
      name: "Alyssa P.",
      location: "Student · Langford",
    },
    serviceAreaTitle: "Langford and the Westshore",
    serviceAreas: ["Langford", "Colwood", "View Royal", "Metchosin", "Sooke", "Victoria", "Sidney"],
    intro: [
      "Shanaya's Driving School serves Langford and the Westshore. Our main office and training hub at 2770 Leigh Rd sits in the heart of Greater Victoria, so lessons for Langford learners can start close to home on the roads you already drive every day.",
      "Langford driving has its own character: a growing number of roundabouts, busy stretches of Goldstream Avenue and Veterans Memorial Parkway, Trans-Canada Highway merges, and hilly routes around Bear Mountain. Our lessons build the skills these roads demand: smooth roundabout entries and exits, confident highway merging, hill starts, lane discipline, and calm decisions in Westshore traffic.",
      "Every lesson follows ICBC road test expectations while staying practical for daily driving. Whether you are a first-time learner working toward your N or a newer driver who wants to feel in control around the Westshore, we pace the training around you in a patient, dual-control car.",
    ],
    sections: [
      {
        title: "What Langford lessons cover",
        body:
          "Students start with the fundamentals and build toward the specific situations Langford drivers face most. Instructors demonstrate each skill, then give direct feedback after every practice segment.",
        bullets: [
          "Roundabout approach, lane choice, signalling, and safe exits",
          "Trans-Canada Highway on-ramps, merging, and lane changes",
          "Hill starts, grades, and parking around Bear Mountain and Westshore lots",
        ],
      },
      {
        title: "Local routes and practice areas",
        body:
          "Lessons use real Langford and Westshore roads: Goldstream Avenue, Veterans Memorial Parkway, and Jacklin Road for traffic practice, quieter Happy Valley and residential streets for beginners, and large commercial lots near Millstream and Costco for parking and low-speed control.",
      },
      {
        title: "Starting from our Langford hub",
        body:
          "Because our office is in Langford, lessons can begin right in the Westshore with flexible pickup across Langford, Colwood, View Royal, and Metchosin. You practise on the same local roads you drive daily, which builds confidence faster than an unfamiliar training route.",
      },
    ],
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
    id: "driving-lessons-colwood",
    path: "/driving-lessons-colwood",
    title: "Driving Lessons in Colwood, BC | Shanaya's Driving School",
    metaDescription:
      "Driving lessons in Colwood and the Westshore, BC with ICBC-aligned coaching, dual-control cars, and practice on Sooke Road, the Colwood interchange, and Royal Bay.",
    eyebrow: "Colwood driving lessons",
    h1: "Driving lessons in Colwood, BC",
    heroDescription:
      "Learn to drive with confidence across Colwood and the Westshore, with calm, ICBC-aligned instruction on Sooke Road, the Colwood interchange, Ocean Boulevard, and Royal Bay's newer streets.",
    heroImage: "/landing/driving-lessons-colwood.webp",
    targetKeyword: "driving lessons Colwood BC",
    testimonial: {
      quote:
        "Scheduling was flexible and the coaching style was patient. I improved every week and felt fully prepared.",
      name: "Daniel M.",
      location: "Student · Colwood",
    },
    serviceAreaTitle: "Colwood and the Westshore",
    serviceAreas: ["Colwood", "Langford", "View Royal", "Royal Bay", "Metchosin", "Esquimalt", "Victoria"],
    intro: [
      "Shanaya's Driving School teaches new and returning drivers across Colwood and the Westshore. Our main training hub is just up the road at 2770 Leigh Rd in Greater Victoria, so Colwood learners can start close to home on the roads they drive every day.",
      "Colwood driving has its own challenges: the busy Colwood interchange and the daily Colwood Crawl where the highways meet, Sooke Road and the Old Island Highway, Ocean Boulevard along Esquimalt Lagoon, the newer roundabouts and residential streets in Royal Bay, and the hills around Triangle Mountain. Our lessons build the skills these roads demand, from confident highway merging to smooth roundabout entries, hill starts, and calm decisions in commuter traffic.",
      "Every lesson follows ICBC road test expectations while staying practical for daily driving. Whether you are a first-time learner working toward your N or a driver who wants to feel more in control around the Westshore, we pace the training around you in a patient, dual-control car.",
    ],
    sections: [
      {
        title: "What Colwood lessons cover",
        body:
          "Students start with the fundamentals and build toward the situations Colwood drivers face most. Instructors demonstrate each skill, then give direct feedback after every practice segment.",
        bullets: [
          "Highway merging and lane changes around the Colwood interchange",
          "Roundabout approach, lane choice, and safe exits in Royal Bay",
          "Hill starts, grades, and parking around Triangle Mountain and local lots",
        ],
      },
      {
        title: "Local routes and practice areas",
        body:
          "Lessons use real Colwood and Westshore roads: Sooke Road and the Old Island Highway for traffic practice, Ocean Boulevard and quieter residential streets for beginners, Royal Bay's newer streets and roundabouts, and larger commercial lots for parking and low-speed control.",
      },
      {
        title: "Starting from our Westshore hub",
        body:
          "Because our office is minutes away in Langford, lessons can begin right in the Westshore with flexible pickup across Colwood, Langford, View Royal, and Metchosin. You practise on the same local roads you drive daily, which builds confidence faster than an unfamiliar training route.",
      },
    ],
    relatedLinksTitle: "Explore more driving lessons",
    relatedLinks: [
      {
        label: "Driving lessons in Langford",
        href: "/driving-lessons-langford",
        description: "Our main training hub, minutes from Colwood in the Westshore.",
      },
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description: "Get ready for your ICBC road test on local Saanich and Victoria routes.",
      },
    ],
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
    id: "driving-lessons-saanich",
    path: "/driving-lessons-saanich",
    title: "Driving Lessons in Saanich, BC | Shanaya's Driving School",
    metaDescription:
      "Driving lessons in Saanich, BC with ICBC-aligned coaching and dual-control cars. Practice Douglas, Blanshard, McKenzie, and the routes near the Saanich test centre.",
    eyebrow: "Saanich driving lessons",
    h1: "Driving lessons in Saanich, BC",
    heroDescription:
      "Learn to drive with confidence across Saanich and Greater Victoria, with calm, ICBC-aligned instruction on busy arterials like Douglas, Blanshard, and McKenzie, plus the local routes near the Saanich road test centre.",
    heroImage: "/landing/driving-lessons-saanich.webp",
    targetKeyword: "driving lessons Saanich BC",
    testimonial: {
      quote:
        "Every lesson had a clear goal. I never felt rushed, and my confidence improved faster than I expected.",
      name: "Ethan R.",
      location: "Student · Sidney",
    },
    serviceAreaTitle: "Saanich and Greater Victoria",
    serviceAreas: ["Saanich", "Victoria", "Oak Bay", "Esquimalt", "View Royal", "Central Saanich", "Sidney"],
    intro: [
      "Shanaya's Driving School teaches new and returning drivers across Saanich, the largest community in Greater Victoria. From quiet residential streets in Gordon Head and Cordova Bay to the busy arterials that connect the region, Saanich is where many local drivers do most of their everyday driving, and where a lot of the Victoria-area road test routes run.",
      "Saanich driving means confident work on Douglas Street, Blanshard Street, Quadra, Shelbourne, and McKenzie Avenue, smooth merging at the McKenzie interchange on Highway 1, and steady awareness around University of Victoria traffic, cyclists, and school zones. Our lessons build these exact skills, along with lane discipline, roundabouts, and calm decisions in steady arterial traffic.",
      "Every lesson follows ICBC road test expectations while staying practical for daily driving. Whether you are a first-time learner working toward your N or a driver who wants to feel more in control on Saanich's busier roads, we pace the training around you in a patient, dual-control car.",
    ],
    sections: [
      {
        title: "What Saanich lessons cover",
        body:
          "Students start with the fundamentals and build toward the situations Saanich drivers face most. Instructors demonstrate each skill, then give direct feedback after every practice segment.",
        bullets: [
          "Busy arterial driving on Douglas, Blanshard, Quadra, and Shelbourne",
          "Merging and lane changes at the McKenzie interchange on Highway 1",
          "Cyclist and pedestrian awareness around UVic and school zones",
        ],
      },
      {
        title: "Local routes and practice areas",
        body:
          "Lessons use real Saanich roads: arterials like McKenzie, Tillicum, and Cedar Hill for traffic practice, quieter streets in Gordon Head and Broadmead for beginners, and large commercial lots near Uptown for parking and low-speed control. Many of these are the same roads used on local road test routes.",
      },
      {
        title: "Close to the road test routes",
        body:
          "Saanich sits right next to the Victoria-area road test routes, so lessons can build confidence on the exact intersections, lane changes, and parking spots that matter on test day. It is a strong base whether you are learning to drive or preparing for your ICBC appointment.",
      },
    ],
    relatedLinksTitle: "Explore more driving lessons",
    relatedLinks: [
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description: "Get ready for your ICBC road test on local Saanich and Victoria routes.",
      },
      {
        label: "Driving lessons in Langford",
        href: "/driving-lessons-langford",
        description: "Beginner and refresher lessons from our Westshore training hub.",
      },
    ],
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
    id: "driving-lessons-view-royal",
    path: "/driving-lessons-view-royal",
    title: "Driving Lessons in View Royal, BC | Shanaya's Driving School",
    metaDescription:
      "Driving lessons in View Royal and the Westshore, BC with ICBC-aligned coaching, dual-control cars, and practice on Highway 1 and the Old Island Highway.",
    eyebrow: "View Royal driving lessons",
    h1: "Driving lessons in View Royal, BC",
    heroDescription:
      "Learn to drive with confidence across View Royal and the Westshore, with calm, ICBC-aligned instruction on Highway 1, the Old Island Highway, the Helmcken interchange, and quieter streets near Thetis Lake.",
    heroImage: "/landing/driving-lessons-view-royal.webp",
    targetKeyword: "driving lessons View Royal BC",
    testimonial: {
      quote:
        "My instructor was patient in busy traffic and helped me stay calm when lane changes felt stressful.",
      name: "Noah C.",
      location: "Student · Westshore",
    },
    serviceAreaTitle: "View Royal and the Westshore",
    serviceAreas: ["View Royal", "Langford", "Colwood", "Esquimalt", "Victoria", "Saanich", "Metchosin"],
    intro: [
      "Shanaya's Driving School teaches new and returning drivers across View Royal, the gateway between Victoria and the Westshore. Our main training hub is minutes away at 2770 Leigh Rd in Greater Victoria, so View Royal learners can start close to home on the roads they drive every day.",
      "View Royal driving means confident work on the Trans-Canada Highway and the Old Island Highway, smooth merging at the Helmcken Road interchange, and steady awareness around the Victoria General Hospital area and the Galloping Goose Trail crossings. Our lessons build these exact skills, along with lane changes, roundabouts, hill starts, and calm decisions in connector traffic.",
      "Every lesson follows ICBC road test expectations while staying practical for daily driving. Whether you are a first-time learner working toward your N or a driver who wants to feel more in control on View Royal's busier roads, we pace the training around you in a patient, dual-control car.",
    ],
    sections: [
      {
        title: "What View Royal lessons cover",
        body:
          "Students start with the fundamentals and build toward the situations View Royal drivers face most. Instructors demonstrate each skill, then give direct feedback after every practice segment.",
        bullets: [
          "Highway merging and lane changes on Highway 1 and the Old Island Highway",
          "Traffic awareness around the Victoria General Hospital area",
          "Cyclist and pedestrian awareness at Galloping Goose Trail crossings",
        ],
      },
      {
        title: "Local routes and practice areas",
        body:
          "Lessons use real View Royal roads: the Island Highway and Admirals, Helmcken, and Burnside for traffic practice, quieter streets near Thetis Lake and Portage Inlet for beginners, and larger commercial lots for parking and low-speed control.",
      },
      {
        title: "Starting from our Westshore hub",
        body:
          "Because our office is minutes away in Langford, lessons can begin right in the Westshore with flexible pickup across View Royal, Langford, Colwood, and Esquimalt. You practise on the same local roads you drive daily, which builds confidence faster than an unfamiliar training route.",
      },
    ],
    relatedLinksTitle: "Explore more driving lessons",
    relatedLinks: [
      {
        label: "Driving lessons in Langford",
        href: "/driving-lessons-langford",
        description: "Our main training hub, minutes from View Royal in the Westshore.",
      },
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description: "Get ready for your ICBC road test on local Saanich and Victoria routes.",
      },
    ],
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
    id: "nervous-driver-lessons-victoria",
    path: "/nervous-driver-lessons-victoria",
    title: "Nervous Driver Lessons in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Calm, patient driving lessons for nervous drivers in Victoria, BC. Judgment-free coaching, dual-control cars, and lessons paced to build confidence at your speed.",
    eyebrow: "Nervous driver lessons",
    h1: "Nervous driver lessons in Victoria, BC",
    heroDescription:
      "Anxious about driving? Learn at your own pace across Victoria with calm, patient, judgment-free instruction in a dual-control car, building real confidence one lesson at a time.",
    heroImage: "/landing/nervous-driver-lessons-victoria.webp",
    targetKeyword: "nervous driver lessons Victoria BC",
    testimonial: {
      quote:
        "I started as a nervous beginner, and my instructor made every lesson calm, clear, and easy to follow.",
      name: "Alyssa P.",
      location: "Student · Langford",
    },
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Saanich", "Oak Bay", "Esquimalt", "Langford", "Colwood", "Sidney"],
    intro: [
      "Feeling anxious behind the wheel is far more common than most people think, and it is completely normal. Shanaya's Driving School helps nervous drivers across Victoria build calm, steady confidence at a pace that feels comfortable, without pressure or judgment.",
      "Whether you are a first-time learner who feels overwhelmed, a licensed driver returning after years away, or someone who lost confidence after a scare or a collision, our instructors start where you are. Early lessons focus on quiet, low-traffic streets, and we only move into busier Victoria roads once you feel ready.",
      "Every lesson is in a calm, dual-control car, so there is always a second set of controls for reassurance. The goal is not just to pass a test, but to help you feel genuinely safe and in control every time you drive.",
    ],
    sections: [
      {
        title: "How we help nervous drivers",
        body:
          "Nervous drivers do best with patience, clear explanations, and small wins that build on each other. Instructors keep the pressure low and mark progress at every step.",
        bullets: [
          "Start on quiet streets and progress only when you feel ready",
          "Calm, judgment-free coaching with clear, simple instructions",
          "Dual-control car for a reassuring second set of controls",
        ],
      },
      {
        title: "Who this is for",
        body:
          "Nervous driver lessons suit first-time learners who feel overwhelmed, drivers returning to the road after a long break, anyone rebuilding confidence after a collision or a scare, and students who feel anxious about the ICBC road test.",
      },
      {
        title: "Building confidence at your pace",
        body:
          "There is no set timeline. Some drivers need a few sessions to settle in, while others build up gradually over several weeks. We adjust every lesson to your comfort level and the situations that make you most anxious, from busy intersections to highways and parking.",
      },
    ],
    primaryCtaLabel: "Book a calm first lesson",
    relatedLinksTitle: "Explore related lessons",
    relatedLinks: [
      {
        label: "Confidence Booster Course",
        href: "/courses/confidence-booster-course",
        description: "A focused course to help anxious drivers feel comfortable and in control.",
      },
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description: "Calm, structured preparation for your ICBC road test.",
      },
    ],
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
    id: "defensive-driving",
    path: "/defensive-driving",
    title: "Defensive Driving Course in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Defensive driving course in Victoria and Langford focused on hazard perception, safe spacing, traffic awareness, and confident decision-making.",
    eyebrow: "Defensive driving",
    h1: "Defensive driving course in Victoria",
    heroDescription:
      "Strengthen hazard awareness, following distance, scanning, and decision-making for safer everyday driving in BC traffic.",
    heroImage: "/landing/defensive-driving.webp",
    targetKeyword: "defensive driving course Victoria",
    intro: [
      "Defensive driving is the skill of seeing risk early and creating enough time to respond safely. Shanaya's Driving School teaches defensive driving to learners, returning drivers, and licensed drivers who want to feel more in control in busy Victoria and Langford traffic.",
      "The course focuses on real road habits: scanning far enough ahead, managing space, identifying escape options, reading intersections, anticipating other drivers, and making smooth decisions under pressure. Students practice in conditions that match everyday driving rather than only quiet practice routes.",
      "For many students, defensive driving also improves road test performance. Examiners look for safe observation, good judgment, and consistent control. Defensive habits support all three.",
    ],
    sections: [
      {
        title: "Skills taught in defensive driving",
        body:
          "The course builds proactive driving habits that reduce risk in traffic. Students learn how to spot hazards before they become urgent and how to maintain control when road conditions change.",
        bullets: [
          "Hazard scanning and 12 to 15 second visual lead time",
          "Safe following distance, lane positioning, and speed choice",
          "Intersection judgment, merging, lane changes, and space management",
        ],
      },
      {
        title: "Best fit",
        body:
          "Defensive driving is useful for learners who already know the basics, drivers who feel anxious in traffic, and anyone who wants safer habits before commuting, highway driving, or an ICBC road test.",
      },
      {
        title: "Local driving conditions",
        body:
          "Lessons can include residential roads, multi-lane traffic, school zones, complex intersections, parking lots, and local routes around Victoria, Langford, and the Westshore.",
      },
    ],
    faqs: [
      {
        question: "Is defensive driving only for experienced drivers?",
        answer:
          "No. Learners can start defensive habits early once they understand basic vehicle control.",
      },
      {
        question: "Can defensive driving help with road test readiness?",
        answer:
          "Yes. Strong observation, spacing, and judgment are important parts of a confident road test.",
      },
    ],
  },
  {
    id: "road-test-prep",
    path: "/road-test-prep",
    title: "ICBC Road Test Preparation in BC | Shanaya's Driving School",
    metaDescription:
      "ICBC road test preparation across Vancouver Island, with mock tests, parking practice, and examiner-style feedback. Find road test prep near your test centre.",
    eyebrow: "Road test prep",
    h1: "ICBC road test preparation in BC",
    heroDescription:
      "Get road-test ready across our Vancouver Island service areas, with mock tests, examiner-style feedback, and a clear readiness plan before your ICBC appointment.",
    heroImage: "/landing/road-test-prep.webp",
    targetKeyword: "road test preparation BC",
    serviceAreaTitle: "Vancouver Island communities",
    serviceAreas: ["Victoria", "Langford", "Saanich", "Colwood", "Sidney", "Sooke", "Duncan"],
    intro: [
      "Road test preparation is for drivers who can already handle a car but want sharper control, cleaner observations, and a clear picture of what ICBC examiners expect. Shanaya's Driving School coaches road test readiness across our Vancouver Island service areas, from the first mock test to a test-day plan.",
      "Every ICBC road test is scored the same way, wherever you take it. Lessons target the habits that most often cost marks, such as missed shoulder checks, speed drift, weak lane positioning, rolling stops, late scanning, and parking errors, with direct feedback and repetition until each one is consistent.",
      "Because routes and conditions differ by community, we also run prep on the local roads near your test centre. Choose your area below for location-specific road test preparation.",
    ],
    sections: [
      {
        title: "What road test prep includes",
        body:
          "Road test lessons focus on the habits ICBC assesses and the road situations where students most often feel uncertain.",
        bullets: [
          "Mock road test practice with instructor feedback",
          "Parking, lane changes, turns, speed control, and observation checks",
          "Review of common ICBC road test mistakes and how to avoid them",
        ],
      },
      {
        title: "When to book",
        body:
          "Book road test prep once you can drive independently but still want polish, confidence, or a final readiness check before your ICBC appointment.",
      },
      {
        title: "Prep near your test centre",
        body:
          "ICBC road tests run from different centres across Vancouver Island, each with its own routes and conditions. We tailor practice to the roads near your appointment. See the area pages below for location-specific prep.",
      },
    ],
    relatedLinksTitle: "Find road test prep near you",
    relatedLinks: [
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description:
          "Practice the Saanich and Victoria test-centre routes, downtown one-ways, and hills.",
      },
    ],
    faqs: [
      {
        question: "Which areas do you offer road test prep in?",
        answer:
          "Road test preparation is available across our Vancouver Island service areas, including Victoria, Langford, and the Westshore, based on instructor scheduling.",
      },
      {
        question: "Can I take a mock road test before my ICBC appointment?",
        answer:
          "Yes. Mock evaluations are available to identify weak spots before the real road test.",
      },
      {
        question: "Do you help with parking practice?",
        answer:
          "Yes. Parking, backing, low-speed control, and observation habits can all be included.",
      },
    ],
  },
  {
    id: "road-test-prep-victoria",
    path: "/road-test-prep-victoria",
    title: "Road Test Prep in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "ICBC road test preparation in Victoria, BC. Practice the Saanich and Victoria test-centre routes with mock tests, parking drills, and examiner-style feedback before test day.",
    eyebrow: "Victoria road test prep",
    h1: "Road test prep in Victoria, BC",
    heroDescription:
      "Get ready for your ICBC road test on the Victoria and Saanich routes examiners actually use, with mock tests, parking practice, and calm, examiner-style feedback tuned to local roads.",
    heroImage: "/landing/road-test-prep-victoria.webp",
    targetKeyword: "road test prep Victoria BC",
    testimonial: {
      quote:
        "Road test preparation was structured and practical. The mock routes helped me pass with confidence.",
      name: "Rahim K.",
      location: "Student · Victoria",
    },
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Saanich", "Oak Bay", "Esquimalt", "Langford", "Colwood", "Sidney"],
    intro: [
      "Shanaya's Driving School prepares Victoria drivers for the ICBC road test on the exact roads examiners use. We focus on the Saanich and Victoria test-centre routes, so nothing on test day feels unfamiliar. The intersections, lane markings, and parking spots are ones you have already practised.",
      "Victoria's road test asks a lot of you: downtown one-way streets, the busy Douglas and Blanshard corridors, steep residential hills, heavy pedestrian and cyclist traffic, and parallel parking on real streets. Our prep builds the exact habits examiners score: clean observation and shoulder checks, smooth lane changes, correct speed for each zone, hill parking, and confident parallel and stall parking.",
      "Whether you are booked for your Class 7 (N) or Class 5 road test, we tailor the prep to your stage. A mock test first shows exactly where you stand, then targeted lessons close the gaps before your ICBC appointment.",
    ],
    sections: [
      {
        title: "What Victoria road test prep includes",
        body:
          "Prep is built around what examiners actually score. Instructors run test-style routes, point out habits that cost marks, and give direct feedback after each attempt so improvements stick before test day.",
        bullets: [
          "Mock road test on Victoria and Saanich routes with examiner-style scoring",
          "Parallel parking, stall parking, hill parking, and reversing drills",
          "Observation, shoulder checks, lane changes, and intersection judgment",
        ],
      },
      {
        title: "Local test routes and conditions",
        body:
          "Practice covers the roads that make Victoria's test distinct: downtown one-way grids, the Douglas and Blanshard corridors, Saanich hills, school and playground zones, roundabouts, and streets with steady cyclist and pedestrian traffic.",
      },
      {
        title: "Getting test-day ready",
        body:
          "Start with a mock evaluation to identify weak spots, then book focused lessons close to your test date. If you want to arrive in a familiar car, instructor-approved road test vehicle support may be available when scheduled in advance.",
      },
    ],
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
    id: "mock-road-test-victoria",
    path: "/mock-road-test-victoria",
    title: "Mock Road Test in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Book a mock ICBC road test in Victoria, BC. A full practice run on the real Saanich and Victoria routes with examiner-style scoring and feedback before your test.",
    eyebrow: "Mock road test",
    h1: "Mock road test in Victoria, BC",
    heroDescription:
      "See exactly where you stand before test day. Our mock ICBC road test runs the real Saanich and Victoria routes, scored the way an examiner would, with clear feedback on what to fix.",
    heroImage: "/landing/mock-road-test-victoria.webp",
    targetKeyword: "mock road test Victoria BC",
    testimonial: {
      quote:
        "Road test preparation was structured and practical. The mock routes helped me pass with confidence.",
      name: "Rahim K.",
      location: "Student · Victoria",
    },
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Saanich", "Oak Bay", "Esquimalt", "Langford", "Colwood", "Sidney"],
    intro: [
      "A mock road test is the closest thing to the real ICBC exam before you sit it. Shanaya's Driving School runs full practice tests on the actual Saanich and Victoria test-centre routes, scored the way an examiner scores, so you know exactly where you stand before test day.",
      "Your instructor plays the role of the examiner: giving directions, watching your observation, speed, positioning, lane changes, and parking, and noting every point that would cost a mark. Afterward you get a clear debrief on what you did well and what to fix, with no surprises left for the real appointment.",
      "It is the fastest way to turn nervous guessing into a confident plan. Many students book a mock test a week or two before their ICBC road test to confirm they are ready, or to pinpoint the last few habits to polish.",
    ],
    sections: [
      {
        title: "What the mock road test covers",
        body:
          "The session mirrors a real ICBC road test from start to finish, then ends with feedback you can act on right away.",
        bullets: [
          "A full test-style drive on the Saanich and Victoria routes",
          "Examiner-style scoring of observation, speed, lane changes, and parking",
          "A clear debrief on exactly what to fix before test day",
        ],
      },
      {
        title: "When to book a mock test",
        body:
          "Book a mock road test once you can drive independently and want to confirm your readiness, usually one to two weeks before your ICBC appointment. It is also useful if you have failed before and want to know precisely what went wrong.",
      },
      {
        title: "Mock test or full road test prep?",
        body:
          "A mock test is a single evaluation that tells you where you stand. If it uncovers gaps, road test preparation lessons close them before your appointment. Many students do a mock test first, then a few targeted prep lessons.",
      },
    ],
    relatedLinksTitle: "Related road test services",
    relatedLinks: [
      {
        label: "Mock Test Evaluation",
        href: "/courses/mock-test-evaluation",
        description: "The mock road test session with examiner-style feedback, ready to book.",
      },
      {
        label: "Road test prep in Victoria",
        href: "/road-test-prep-victoria",
        description: "Targeted lessons to close any gaps the mock test reveals.",
      },
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
    ],
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
    primaryCtaLabel: "Book a mock test",
  },
  {
    id: "road-test-vehicle",
    path: "/road-test-vehicle",
    title: "ICBC Road Test Car Rental in Victoria | Shanaya's Driving School",
    metaDescription:
      "Book an instructor-approved road test vehicle rental in Victoria or Langford and arrive at your ICBC road test in a familiar training car.",
    eyebrow: "Road test vehicle",
    h1: "ICBC road test car rental in Victoria",
    heroDescription:
      "Use a familiar instructor-approved vehicle for road test day and keep your final preparation simple.",
    heroImage: "/landing/road-test-vehicle.webp",
    targetKeyword: "ICBC road test car rental Victoria",
    intro: [
      "A road test vehicle rental helps students avoid last-minute stress around car availability, insurance, mechanical readiness, or unfamiliar controls. Shanaya's Driving School offers an instructor-approved vehicle option for eligible road test bookings in Victoria, Langford, and nearby service areas.",
      "Using a familiar training car can make test day more predictable. Students know the mirror setup, vehicle size, braking feel, blind spots, steering response, and parking reference points. That consistency can help reduce nerves when the examiner gets in the vehicle.",
      "This service is best paired with a warm-up lesson or road test preparation session. The instructor can review the final details, confirm the student is ready, and make sure the test-day logistics are clear before the appointment.",
    ],
    sections: [
      {
        title: "What the rental supports",
        body:
          "The vehicle rental is intended to keep the test-day process simple and consistent for students who do not have a suitable vehicle or prefer to test in the car they trained in.",
        bullets: [
          "Instructor-approved vehicle for road test day",
          "Familiar controls, mirrors, visibility, and parking reference points",
          "Scheduling coordinated around the selected service area and appointment time",
        ],
      },
      {
        title: "Best fit",
        body:
          "Road test vehicle support is useful for students without access to a reliable test-ready vehicle, newcomers still arranging transportation, and learners who want consistency from lesson to test day.",
      },
      {
        title: "Plan ahead",
        body:
          "Availability depends on instructor schedule and road test timing, so students should request vehicle support as early as possible after booking their ICBC appointment.",
      },
    ],
    faqs: [
      {
        question: "Can I rent the vehicle without a lesson?",
        answer:
          "Availability depends on scheduling and readiness. A warm-up or prep lesson is recommended before the appointment.",
      },
      {
        question: "Is the car suitable for an ICBC road test?",
        answer:
          "The rental option is built around instructor-approved training vehicles used for student lessons and test-day support.",
      },
    ],
  },
  {
    id: "intensive-driving-course",
    path: "/intensive-driving-course",
    title: "Intensive Driving Course in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Intensive driving course support in Victoria and Langford for learners who want focused lessons, faster progress, and structured road test preparation.",
    eyebrow: "Intensive training",
    h1: "Intensive driving course in Victoria",
    heroDescription:
      "Build momentum with a focused lesson plan for learners who want consistent practice over a shorter training window.",
    heroImage: "/landing/intensive-driving-course.webp",
    targetKeyword: "intensive driving course Victoria",
    intro: [
      "An intensive driving course is for students who want steady progress through a concentrated lesson plan. Instead of spreading practice over a long period, students work through core skills, weak areas, and road test preparation with more consistent scheduling.",
      "Shanaya's Driving School builds intensive plans around the student's current level. A beginner may need fundamentals, quiet-road control, parking, and gradual exposure to traffic. A more experienced learner may need road test refinement, mock evaluations, route practice, and specific correction of repeated mistakes.",
      "The value of intensive training is structure. Students know what to practice, why it matters, and what comes next. That keeps each lesson connected to the last one and helps confidence build faster.",
    ],
    sections: [
      {
        title: "How intensive lessons work",
        body:
          "The plan starts with an assessment of the student's driving level and goals. From there, the instructor recommends a sequence of lessons that balances skill development, confidence, and test readiness.",
        bullets: [
          "Assessment-based lesson planning",
          "Focused practice on weak areas and high-value road test skills",
          "Consistent feedback so each lesson builds on the previous session",
        ],
      },
      {
        title: "Best fit",
        body:
          "This approach works well for learners with a target road test date, newcomers adapting to BC roads, students returning after a break, or beginners who want a clear path instead of occasional practice.",
      },
      {
        title: "Booking expectations",
        body:
          "Intensive scheduling depends on instructor availability, location, and student readiness. Early booking gives the school more room to build a practical lesson sequence.",
      },
    ],
    faqs: [
      {
        question: "Can an intensive course guarantee a road test pass?",
        answer:
          "No course can guarantee a pass, but focused practice can improve readiness, consistency, and confidence.",
      },
      {
        question: "How many lessons do I need?",
        answer:
          "That depends on current skill level, test timeline, and how much supervised practice happens outside lessons.",
      },
    ],
  },
  {
    id: "pricing",
    path: "/pricing",
    title: "Driving Lesson Prices in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Driving lesson pricing for Victoria and Langford: $89 for 60 minutes, $133.50 for 90. Compare courses, packages, road test prep, and payment plans.",
    eyebrow: "Pricing",
    h1: "Driving lesson prices in Victoria, BC",
    heroDescription:
      "Compare lesson, package, road test prep, and payment plan options before choosing your training path.",
    heroImage: "/landing/pricing.webp",
    targetKeyword: "driving lesson prices Victoria BC",
    intro: [
      "Individual driving lessons in Victoria and Langford start at $89 for 60 minutes and $133.50 for 90 minutes, with packages bundling several courses at a combined rate. Driving lesson pricing depends on your goals, service area, course type, and whether you choose single lessons or a structured package, and Shanaya's Driving School keeps every option clear so you can compare lessons, road test prep, parking practice, and bundled plans.",
      "Many students start with a package because it creates a complete training path. Others book a specific course when they only need a focused skill, such as road test prep, defensive driving, parking, or a refresher session. Payment plan options may also be available for eligible students and approved programs.",
      "The best value is usually the plan that matches the student's actual stage. A beginner needs enough repetition to build safe habits, while a near-ready student may only need targeted feedback before an ICBC appointment.",
    ],
    sections: [
      {
        title: "What driving lessons cost",
        body:
          "Individual lessons in our standard service areas start at $89 for 60 minutes and $133.50 for 90 minutes. Island bookings on Salt Spring are $109 and $163.50. Packages combine several courses at one rate, so the per-lesson cost works out lower than booking sessions individually.",
        bullets: [
          "60-minute lesson: $89 in Victoria, Langford, Colwood, and Sidney",
          "90-minute lesson: $133.50 in Victoria, Langford, Colwood, and Sidney",
          "Salt Spring Island: $109 for 60 minutes and $163.50 for 90 minutes",
        ],
      },
      {
        title: "Pricing factors",
        body:
          "Lesson prices can vary by package, duration, service area, and training type. Students should confirm current rates at booking because availability and promotions may change.",
        bullets: [
          "Single courses for focused skill development",
          "Packages for structured beginner-to-test preparation",
          "Road test vehicle support and optional extras where available",
        ],
      },
      {
        title: "Payment flexibility",
        body:
          "Eligible students can review payment plan options before enrolling. Installment availability depends on the selected program and approval requirements.",
      },
      {
        title: "Choosing the right plan",
        body:
          "If you are unsure which option fits, contact the school with your current licence stage, driving experience, test timeline, and preferred location.",
      },
    ],
    primaryCtaLabel: "View packages",
    secondaryCtaLabel: "Ask about pricing",
    faqs: [
      {
        question: "Where can I see current package options?",
        answer:
          "The packages page lists structured lesson bundles, and the courses page lists individual training options.",
      },
      {
        question: "Do prices vary by location?",
        answer:
          "Some service areas may have different pricing tiers or availability. Confirm the final amount during booking.",
      },
    ],
  },
  {
    id: "faq",
    path: "/faq",
    title: "Driving Test & Lesson FAQ for BC | Shanaya's Driving School",
    metaDescription:
      "Answers to common BC driving lesson, ICBC road test, learner licence, vehicle rental, booking, pricing, and preparation questions.",
    eyebrow: "FAQ",
    h1: "Driving test and lesson questions in BC",
    heroDescription:
      "Get clear answers before booking lessons, preparing for a road test, or choosing a training package.",
    heroImage: "/landing/faq.webp",
    targetKeyword: "driving test BC questions",
    intro: [
      "Learning to drive comes with practical questions about lessons, ICBC road tests, vehicle use, pricing, scheduling, and readiness. This FAQ gives students and families a single place to review the basics before contacting Shanaya's Driving School.",
      "The answers below are general guidance for learners in British Columbia. Individual needs can vary based on licence stage, prior driving experience, comfort level, service location, and test timeline.",
      "For the best recommendation, contact the school with your current licence stage, preferred training area, and whether you are preparing for a knowledge test, first lesson, road test, or refresher session.",
    ],
    sections: [
      {
        title: "Before booking",
        body:
          "Students should know their licence stage, general availability, and training goal. If you are unsure, the school can help choose between beginner lessons, road test prep, defensive driving, or a package.",
      },
      {
        title: "Road test preparation",
        body:
          "Road test prep is best for students who can already drive but want targeted feedback on observations, parking, lane changes, intersections, and examiner-style expectations.",
      },
      {
        title: "Service areas",
        body:
          "Service availability can include Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan, and Salt Spring Island depending on instructor scheduling.",
      },
    ],
    faqs: [
      {
        question: "How many driving lessons do I need?",
        answer:
          "It depends on experience, confidence, outside practice, and road test timeline. Beginners usually need a structured sequence, while experienced drivers may need targeted prep.",
      },
      {
        question: "Can I prepare for the ICBC knowledge test?",
        answer:
          "Yes. Knowledge test preparation is available for students who want help with road signs, rules, and practice questions.",
      },
      {
        question: "Can I use a school vehicle for the road test?",
        answer:
          "Road test vehicle support may be available when scheduled in advance and paired with the right preparation.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "Payment plan options may be available for eligible students and approved programs.",
      },
    ],
  },
  {
    id: "icbc-approved-driving-school",
    path: "/icbc-approved-driving-school",
    title: "ICBC-Approved Driving School in Victoria, BC | Shanaya's",
    metaDescription:
      "Looking for an ICBC-approved driving school in Victoria or Langford? Shanaya's is a licensed BC driving school with ICBC-licensed instructors teaching the ICBC curriculum in dual-control cars.",
    eyebrow: "ICBC-approved driving school",
    h1: "An ICBC-licensed driving school in Victoria & Langford",
    heroDescription:
      "Shanaya's Driving School is a licensed BC driving school with ICBC-licensed instructors, teaching to ICBC road-safety standards across Victoria, Langford, and Greater Victoria.",
    heroImage: "/landing/icbc-approved-driving-school.webp",
    targetKeyword: "ICBC approved driving schools",
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Langford", "Colwood", "Saanich", "View Royal", "Sidney", "Sooke"],
    intro: [
      "When people search for an \"ICBC-approved driving school,\" what they usually want is straightforward: a legitimate school ICBC recognises, with properly licensed instructors and lessons that match the standards examiners actually test. Shanaya's Driving School fits that description across Victoria, Langford, and Greater Victoria.",
      "In British Columbia, driving schools and instructors are regulated by ICBC. We operate as a licensed BC driving school, our instructors hold ICBC driving-instructor licences, and every lesson is taught in an insured, dual-control vehicle built for safe, structured learning. That is the real difference between learning with a professional school and practising with a friend or family member.",
      "Our lessons follow the ICBC curriculum and road-test standards, so the observation habits, positioning, and decision-making you build in lessons are the same ones an examiner looks for on test day.",
    ],
    sections: [
      {
        title: "What \"ICBC-approved\" actually means",
        body:
          "ICBC's official term is \"licensed.\" ICBC licenses both driving schools and individual instructors in BC, and only licensed schools can legally charge for in-car instruction. When a school describes itself as \"ICBC-approved,\" that licensing is what it points to.",
        bullets: [
          "Licensed BC driving school, operating legally for paid instruction",
          "Instructors hold ICBC driving-instructor licences",
          "Lessons taught in insured, dual-control training vehicles",
        ],
      },
      {
        title: "Why it matters who you learn with",
        body:
          "A licensed school gives you more than a car. You get a structured curriculum, an instructor trained to teach, dual controls for safety, and lessons designed around the exact standards ICBC examiners score. That combination builds safer habits faster and reduces test-day surprises.",
      },
      {
        title: "Trained to ICBC road-test standards",
        body:
          "Every lesson maps to what ICBC assesses: observation and shoulder checks, speed control for each zone, lane positioning, intersections, parking, and calm decisions in traffic. We coach these deliberately, with direct feedback, so your everyday driving and your road-test performance improve together.",
        bullets: [
          "ICBC-aligned lesson structure from beginner to road-test ready",
          "Mock road tests scored the way an examiner would",
          "Knowledge-test support and Class 5 / Class 7 preparation",
        ],
      },
    ],
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
    relatedLinksTitle: "Start with the right lessons",
    relatedLinks: [
      {
        label: "ICBC driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Driving lessons in Langford",
        href: "/driving-lessons-langford",
        description: "Lessons from our Westshore training area.",
      },
      {
        label: "ICBC road test preparation",
        href: "/road-test-prep",
        description: "Mock tests and examiner-style feedback before your ICBC appointment.",
      },
    ],
    primaryCtaLabel: "Book a lesson",
  },
  {
    id: "bc-graduated-licensing-program",
    path: "/bc-graduated-licensing-program",
    title: "BC Graduated Licensing Program (GLP) Explained | Shanaya's",
    metaDescription:
      "How BC's Graduated Licensing Program works, and what changes on October 19, 2026 when ICBC replaces the second road test with a Driving Record Assessment.",
    eyebrow: "Graduated licensing",
    h1: "The BC Graduated Licensing Program (GLP), explained",
    heroDescription:
      "New drivers in British Columbia earn a full licence in stages. Here is a clear walkthrough of the Learner (L) and Novice (N) stages, the wait times, and what changes on October 19, 2026.",
    heroImage: "/landing/bc-graduated-licensing-program.webp",
    targetKeyword: "BC graduated licensing program explained",
    intro: [
      "British Columbia uses a Graduated Licensing Program (GLP) for new drivers. Instead of one test for a full licence, you move through two supervised stages, Learner and Novice, that gradually give you more freedom as you gain experience.",
      "The GLP is changing on October 19, 2026. ICBC is removing the second road test and replacing it with a Driving Record Assessment, adding a 12-month restricted Class 5 stage, and creating a shorter path for drivers aged 25 and older. The rules below describe the program as it works today, with each upcoming change flagged where it applies.",
      "Below is a plain-language breakdown of every stage, what you need to move up, and the restrictions you follow along the way.",
    ],
    sections: [
      {
        title: "The stages at a glance",
        body:
          "The GLP has two learning stages before a full licence. You must spend a minimum amount of time in each stage and pass a road test to move to the next one. From October 19, 2026 there is also a fourth step: a restricted Class 5 that lasts 12 months before your licence becomes fully unrestricted.",
        bullets: [
          "Stage 1: Learner (Class 7L), minimum 12 months, dropping to 9 months for drivers 25 and older on October 19, 2026",
          "Stage 2: Novice (Class 7N), minimum 24 months, dropping to 12 months for drivers 25 and older on October 19, 2026",
          "Class 5 licence after completing the Novice stage",
          "From October 19, 2026: a 12-month restricted Class 5 stage before your full, unrestricted licence",
        ],
      },
      {
        title: "Stage 1: Learner's licence (Class 7L)",
        body:
          "You start by passing the ICBC knowledge test and a vision screening. Once you have your L, you can practise driving while supervised, and you must hold it for at least 12 months before your first road test. From October 19, 2026, drivers aged 25 and older only need to hold the L for 9 months.",
        bullets: [
          "Pass the ICBC knowledge test and a vision screening to qualify",
          "A supervisor 25 or older with a valid Class 5 licence must sit in the front seat at all times, dropping to 22 or older on October 19, 2026",
          "Zero blood alcohol, and no electronic devices, even hands-free",
          "Display an \"L\" sign on the back of the vehicle",
          "Hold the L for a minimum of 12 months before the Class 7 road test, or 9 months if you are 25 or older from October 19, 2026",
        ],
      },
      {
        title: "Stage 2: Novice licence (Class 7N)",
        body:
          "After 12 months as a Learner, you take the Class 7 road test. Pass it and you move to the Novice stage, where you can drive on your own with a few restrictions. You must hold the N for at least 24 months. From October 19, 2026, drivers aged 25 and older only need 12 months, and this remains the only road test in the program.",
        bullets: [
          "Drive unsupervised, but carry only one passenger unless a supervisor 25 or older is present or the passengers are immediate family",
          "Zero blood alcohol, and no electronic devices",
          "Display an \"N\" sign on the back of the vehicle",
          "Hold the N for a minimum of 24 months as a safe driver, or 12 months if you are 25 or older from October 19, 2026",
        ],
      },
      {
        title: "What changes on October 19, 2026",
        body:
          "The Province and ICBC announced the biggest update to the GLP in 25 years. The headline change is that the second road test disappears and is replaced by a Driving Record Assessment: an in-office check of your record rather than a drive with an examiner. Second road tests booked on or after October 19, 2026 will be cancelled, and ICBC will email affected drivers.",
        bullets: [
          "The second road test is replaced by a Driving Record Assessment",
          "Passing it gives you a Class 5 with a 12-month zero alcohol and drug restriction, not an unrestricted licence",
          "Drivers 25 and older move to a 9-month Learner stage and a 12-month Novice stage",
          "For drivers under 25 the 12-month Learner and 24-month Novice timelines do not change",
          "The minimum supervisor age drops from 25 to 22, and the age of consent to apply drops from 19 to 18",
          "Convictions for excessive speed or electronic device use can restart your Novice period",
        ],
      },
      {
        title: "Full licence (Class 5)",
        body:
          "Until October 19, 2026, you reach a full Class 5 licence by holding your N for the required time as a safe driver and passing the Class 5 road test. After that date the road test is replaced by the Driving Record Assessment, and you first receive a Class 5 carrying a 12-month zero alcohol and drug restriction. Once those 12 months pass without incident, the restriction lifts and your licence is fully unrestricted.",
      },
      {
        title: "Can you finish the GLP faster?",
        body:
          "Completing an ICBC-approved GLP driver-training course cuts the Novice stage from 24 months to 18. From October 19, 2026 this becomes the only remaining shortcut in the program, and ICBC requires the course to be completed during the Learner stage, so starting it early matters. Drivers 25 and older get a shorter path automatically from that date. Strong road test preparation also helps you pass on the first attempt, so you are not waiting weeks to rebook after a fail.",
      },
      {
        title: "How lessons help you move through the GLP",
        body:
          "Structured lessons build the exact habits ICBC examiners score at each road test, so you pass on schedule instead of losing months to a retest. Shanaya's Driving School coaches learners at every GLP stage across Victoria, Langford, and Greater Victoria, from your first supervised drive to full Class 5 readiness.",
      },
    ],
    faqs: [
      {
        question: "How long does the BC Graduated Licensing Program take?",
        answer:
          "For drivers under 25, at minimum about three years: 12 months in the Learner (L) stage and 24 months in the Novice (N) stage, plus the time to pass the road test. The Novice stage can be shortened by six months with an ICBC-approved GLP course. From October 19, 2026, drivers 25 and older need only 9 months as a Learner and 12 months as a Novice.",
      },
      {
        question: "What is the difference between an L and an N in BC?",
        answer:
          "The Learner (L) stage requires a qualified supervisor in the front seat at all times. The Novice (N) stage lets you drive alone, but with a one-passenger limit unless a supervisor or immediate family is present. Both require zero alcohol and no electronic devices.",
      },
      {
        question: "How old do you have to be to start the GLP?",
        answer:
          "You can apply for your Learner's licence at 16. If you are under 19, you need consent from a parent or legal guardian. From October 19, 2026 the age of consent drops to 18, so 18-year-olds can apply independently.",
      },
      {
        question: "How many road tests are in the GLP?",
        answer:
          "Until October 19, 2026 there are two: the Class 7 road test to reach Novice, and the Class 5 road test to reach a full licence. From that date the second road test is removed and replaced by a Driving Record Assessment, an in-office check of your driving record, leaving the Class 7 road test as the only road test in the program.",
      },
      {
        question: "What is the Driving Record Assessment?",
        answer:
          "From October 19, 2026 it replaces the second road test. Instead of driving with an examiner, ICBC checks that you have completed the required safe driving period with no prohibitions or suspensions and no convictions for excessive speed or electronic device use. Passing it gives you a Class 5 with a 12-month zero alcohol and drug restriction.",
      },
    ],
    relatedLinksTitle: "Get ready for each stage",
    relatedLinks: [
      {
        label: "What changes on October 19, 2026",
        href: "/blog/bc-glp-changes-2026",
        description: "The second road test is being removed. Here is what it means for you.",
      },
      {
        label: "ICBC knowledge test practice",
        href: "/knowledge-test-practice",
        description: "Practice questions to pass the test for your L.",
      },
      {
        label: "ICBC driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Build the skills for your Class 7 road test.",
      },
      {
        label: "ICBC road test preparation",
        href: "/road-test-prep",
        description: "Mock tests and prep before your Class 7 road test.",
      },
    ],
    primaryCtaLabel: "Book a lesson",
  },
  {
    id: "driving-instructor-victoria",
    path: "/driving-instructor-victoria",
    title: "Driving Instructor in Victoria BC | Shanaya's Driving School",
    metaDescription:
      "Looking for a driving instructor in Victoria or Langford? Shanaya's ICBC-licensed instructors give patient, one-on-one lessons in dual-control cars, with pick-up and drop-off across Greater Victoria.",
    eyebrow: "Driving instructors",
    h1: "Find a driving instructor in Victoria, BC",
    heroDescription:
      "Learn with a patient, ICBC-licensed driving instructor across Victoria, Langford, and Greater Victoria, in a dual-control car, at a pace that fits how you learn.",
    heroImage: "/landing/driving-instructor-victoria.webp",
    targetKeyword: "driving instructor Victoria",
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Langford", "Colwood", "Saanich", "View Royal", "Oak Bay", "Sidney"],
    intro: [
      "The right driving instructor is the difference between dreading lessons and actually looking forward to them. Shanaya's Driving School pairs learners across Victoria, Langford, and Greater Victoria with patient, ICBC-licensed instructors who teach at a pace that suits you, whether you have never driven before or you are polishing up for a road test.",
      "Every one of our instructors holds an ICBC driving-instructor licence, teaches in an insured dual-control car, and coaches to the standards ICBC examiners actually score. Lessons are one-on-one, so your instructor's full attention is on your driving, your questions, and the specific habits you want to improve.",
      "Because we are a local school, your instructor knows the Victoria and Westshore roads you will actually drive, from downtown one-ways to Langford's roundabouts and the routes near your test centre.",
    ],
    sections: [
      {
        title: "What to look for in a driving instructor",
        body:
          "Not all instruction is equal. Before you book with anyone, it is worth checking a few things that separate a professional instructor from a casual one.",
        bullets: [
          "A valid ICBC driving-instructor licence, not just a driver's licence",
          "A dual-control vehicle for safety during lessons",
          "Patience and clear feedback, backed by real student reviews",
          "Lessons structured around ICBC road-test standards",
        ],
      },
      {
        title: "Our instructors",
        body:
          "Shanaya's instructors are licensed, experienced, and genuinely patient, the quality our students mention most. They explain each skill clearly, demonstrate what to look for, and give direct, encouraging feedback after every practice segment, so you always know what to work on next.",
        bullets: [
          "ICBC-licensed and experienced with learners at every level",
          "Calm, judgment-free coaching, including for nervous drivers",
          "Multi-language instruction available for a comfortable learning experience",
        ],
      },
      {
        title: "Lessons matched to how you learn",
        body:
          "Whether you are a first-time teen driver, an adult starting from scratch, a newcomer adjusting to BC roads, or a licensed driver preparing to re-test, your instructor tailors each lesson to your stage and the situations that challenge you most.",
      },
      {
        title: "Where your instructor meets you",
        body:
          "Lessons run across Victoria, Langford, Colwood, Saanich, View Royal, and nearby communities, with pick-up and drop-off available from home, work, or school depending on scheduling, so you practise on the roads you already drive.",
      },
    ],
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
    relatedLinksTitle: "Book your first lesson",
    relatedLinks: [
      {
        label: "ICBC driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Beginner-friendly, ICBC-aligned lessons across Greater Victoria.",
      },
      {
        label: "Nervous driver lessons",
        href: "/nervous-driver-lessons-victoria",
        description: "Calm, patient coaching to rebuild confidence.",
      },
      {
        label: "Driving lesson prices",
        href: "/pricing",
        description: "See lesson and package pricing before you book.",
      },
    ],
    primaryCtaLabel: "Book a lesson",
  },
  {
    id: "driver-education-training",
    path: "/driver-education-training",
    title: "Driver Education & Training in Victoria, BC | Shanaya's",
    metaDescription:
      "Driver education and training in Victoria, Langford, and Greater Victoria. In BC that means ICBC-aligned knowledge test prep and in-car driving lessons through a licensed driving school.",
    eyebrow: "Driver education & training",
    h1: "Driver education and training in Victoria, BC",
    heroDescription:
      "In BC, driver education and training means ICBC knowledge-test prep plus in-car lessons with a licensed driving school. Shanaya's covers both across Victoria, Langford, and Greater Victoria.",
    heroImage: "/landing/driver-education-training.webp",
    targetKeyword: "driver education and training",
    serviceAreaTitle: "Victoria and Greater Victoria",
    serviceAreas: ["Victoria", "Langford", "Colwood", "Saanich", "View Royal", "Sidney", "Sooke"],
    intro: [
      "\"Driver education\" and \"driver training\" are the North American terms for everything involved in learning to drive: the road-rules knowledge and the hands-on, in-car skills. In British Columbia, that is delivered through the Graduated Licensing Program, an ICBC knowledge test, and professional driving lessons, rather than a single mandatory classroom course.",
      "Shanaya's Driving School provides both halves across Victoria, Langford, and Greater Victoria. Our ICBC-licensed instructors cover the rules and signs you need for the knowledge test, then build the practical driving skills examiners score, all in insured, dual-control cars.",
      "So whether you searched for driver education, driver training, or drivers ed, this is the same thing: a structured path from your first lesson to a full BC licence, taught by a licensed local school.",
    ],
    sections: [
      {
        title: "Driver education: the knowledge side",
        body:
          "The education half is the road-rules knowledge every BC driver needs, the material tested on the ICBC knowledge test. We help you learn the signs, right-of-way rules, and safe-driving decisions, and you can practise with real ICBC-style questions before you write the test.",
        bullets: [
          "Road signs, traffic rules, and right-of-way explained clearly",
          "ICBC-style practice questions to prepare for the knowledge test",
          "The material tied to real road situations, not just memorising",
        ],
      },
      {
        title: "Driver training: the in-car side",
        body:
          "The training half is hands-on driving with a licensed instructor. Lessons progress from basic vehicle control to real Victoria and Westshore traffic, building the exact habits ICBC examiners look for on the road test.",
        bullets: [
          "One-on-one, in-car lessons in a dual-control vehicle",
          "Beginner fundamentals through road-test-ready skills",
          "Mock road tests and examiner-style feedback",
        ],
      },
      {
        title: "Is there a classroom driver's ed course in BC?",
        body:
          "Unlike some places, BC does not require a classroom driver's education course to get licensed. Instead, new drivers move through the Graduated Licensing Program: pass the knowledge test for a Learner (L) licence, build supervised experience, then pass the road test. Professional lessons are the fastest, safest way to gain that experience, and completing an ICBC-approved driver-training course can also shorten the Novice stage by six months.",
      },
      {
        title: "Who driver education and training is for",
        body:
          "New teen drivers starting the GLP, adults learning from scratch, newcomers adjusting to BC roads, and licensed drivers refreshing their skills or preparing to re-test all benefit from structured education and training tailored to their stage.",
      },
      {
        title: "Driver education and training near you",
        body:
          "Lessons run across Victoria, Langford, Colwood, Saanich, View Royal, and nearby communities, with pick-up and drop-off available from home, work, or school, so your training happens on the roads you actually drive.",
      },
    ],
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
    relatedLinksTitle: "Start your driver education and training",
    relatedLinks: [
      {
        label: "ICBC knowledge test practice",
        href: "/knowledge-test-practice",
        description: "Prepare for the education side, the ICBC knowledge test.",
      },
      {
        label: "ICBC driving lessons in Victoria",
        href: "/driving-lessons",
        description: "The in-car training side, from beginner to road-test ready.",
      },
      {
        label: "BC Graduated Licensing Program",
        href: "/bc-graduated-licensing-program",
        description: "How the BC licensing stages work.",
      },
    ],
    primaryCtaLabel: "Book a lesson",
  },
];

export const seoLandingPagesById = Object.fromEntries(
  seoLandingPages.map((page) => [page.id, page]),
) as Record<SeoLandingPageId, SeoLandingPage>;

export const seoLandingPagesByPath = Object.fromEntries(
  seoLandingPages.map((page) => [page.path, page]),
) as Record<string, SeoLandingPage>;
