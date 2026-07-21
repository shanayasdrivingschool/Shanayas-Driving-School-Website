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

export type SeoLandingPageSource = {
  label: string;
  href: string;
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
  lastReviewed?: string;
  editorialNote?: string;
  officialSources?: SeoLandingPageSource[];
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
    title: "BC Knowledge Test, Road Test & Lesson FAQ | Shanaya's",
    metaDescription:
      "Verified answers about B.C. Class 7 knowledge and road tests, L and N restrictions, fees, lessons, school licensing, rentals and booking.",
    eyebrow: "B.C. driving FAQ",
    h1: "B.C. knowledge test, road test and lesson FAQ",
    heroDescription:
      "Compare current ICBC licensing facts with clearly labelled Shanaya's lesson, pricing, vehicle and service information.",
    heroImage: "/landing/faq.webp",
    targetKeyword: "BC driving test FAQ",
    serviceAreaTitle: "Service areas shown in the current catalogue",
    serviceAreas: [
      "Victoria",
      "Langford",
      "Colwood",
      "Sidney",
      "Metchosin",
      "Sooke",
      "Duncan",
      "Salt Spring Island",
    ],
    intro: [
      "This FAQ separates facts published by ICBC from information in Shanaya's Driving School's own catalogue. ICBC administers knowledge tests, road tests and driver licensing; a driving school cannot issue a licence, choose a test route or guarantee a result.",
      "The ICBC figures and rules below were checked on July 21, 2026. Requirements and fees can change, so each regulatory answer points back to the official sources listed on this page.",
      "School prices are catalogue amounts before GST. Course, instructor, vehicle and service-area availability must be confirmed for the requested date, and students should obtain the applicable booking, cancellation and refund terms in writing before paying.",
    ],
    sections: [
      {
        title: "Official licensing facts",
        body:
          "Use ICBC for eligibility, restrictions, fees, identification, appointments and test-day requirements. The answers below summarize the linked official material as of the review date.",
        bullets: [
          "ICBC books and administers the official knowledge and road tests",
          "ICBC does not publish its road-test routes outside ICBC",
          "Professional lessons are optional for the standard Class 7 road-test path",
        ],
      },
      {
        title: "Licensed school is not an approved course",
        body:
          "ICBC's general directory lists SHANAYA'S DRIVING SCHOOL at 124-2770 Leigh Rd, Langford, for Class 5 and Class 7 driver training. The school was not found in ICBC's separate approved GLP course directory on the review date.",
        bullets: [
          "The general directory supports the school's licensed status",
          "A directory listing is not an ICBC recommendation or endorsement",
          "This page does not represent Shanaya's lessons as an ICBC-approved GLP course",
        ],
      },
      {
        title: "Catalogue prices and written terms",
        body:
          "The current catalogue shows base lesson and road-test vehicle options, while checkout calculates the final total. Confirm GST, inclusions, pickup area, instructor and vehicle availability, and the terms that apply if either party changes the booking.",
        bullets: [
          "$89 for 60 minutes and $133.50 for 90 minutes before GST at standard and regional rates",
          "$109 for 60 minutes and $163.50 for 90 minutes before GST for Salt Spring Island",
          "Checkout currently requests full payment; eligible third-party financing may appear",
        ],
      },
    ],
    primaryCtaLabel: "Check lesson availability",
    secondaryCtaLabel: "Review current courses",
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
    relatedLinksTitle: "Official-process guides and school information",
    relatedLinks: [
      {
        label: "Class 7 knowledge-test guide",
        href: "/knowledge-test-guide",
        description: "Compare the official online and in-person workflows and what happens after a pass.",
      },
      {
        label: "Class 7 road-test checklist",
        href: "/blog/pass-road-test",
        description: "Review eligibility, practice, documents, vehicle checks, fees and test-day steps.",
      },
      {
        label: "B.C. GLP explainer",
        href: "/bc-graduated-licensing-program",
        description: "Check the current stages and the transition beginning October 19, 2026.",
      },
      {
        label: "Current catalogue pricing",
        href: "/pricing",
        description: "Review catalogue rates, packages and location-dependent totals before booking.",
      },
      {
        label: "How to verify a licensed driving school",
        href: "/icbc-approved-driving-school",
        description: "Understand the difference between a licensed school and an approved GLP course.",
      },
    ],
    lastReviewed: "July 21, 2026",
    editorialNote:
      "ICBC rules and fees were checked against the linked official pages. Shanaya's prices, service areas, checkout wording and vehicle options were checked against this site's current catalogue. The school-directory statement was checked by exact business name, address and telephone against ICBC's general directory and its separate approved GLP course list. This page makes no pass-rate, confidential-route or individual-credential claim.",
    officialSources: [
      {
        label: "ICBC — take the online knowledge test",
        href: "https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test",
      },
      {
        label: "ICBC — get your learner's (L) licence",
        href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L",
      },
      {
        label: "ICBC — accepted identification",
        href: "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID",
      },
      {
        label: "ICBC — get your novice (N) licence",
        href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-N",
      },
      {
        label: "ICBC — book, cancel or reschedule a road test",
        href: "https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test",
      },
      {
        label: "ICBC — prepare for your road-test appointment",
        href: "https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment",
      },
      {
        label: "ICBC — driver licensing fees",
        href: "https://www.icbc.com/driver-licensing/visit-dl-office/Fees",
      },
      {
        label: "ICBC — Road Test Skills Explainer",
        href: "https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf",
      },
      {
        label: "ICBC — Graduated Licensing Program changes",
        href: "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes",
      },
      {
        label: "ICBC — choosing and finding a licensed driving school",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school",
      },
      {
        label: "ICBC — schools offering an approved GLP course",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools",
      },
    ],
  },
  {
    id: "icbc-approved-driving-school",
    path: "/icbc-approved-driving-school",
    title: "Licensed Driving School in Langford, BC | Shanaya's",
    metaDescription:
      "Verify Shanaya's Driving School's Langford listing for Class 5 and 7 driver training, and learn why a licensed school is not the same as an ICBC-approved GLP course.",
    eyebrow: "B.C.-licensed driving school",
    h1: "Licensed driving school in Langford, BC",
    heroDescription:
      "ICBC's public directory lists SHANAYA'S DRIVING SCHOOL in Langford for Class 5 and 7 driver training. This page explains exactly what that record does, and does not, verify.",
    heroImage: "/landing/driving-lessons-langford.webp",
    targetKeyword: "licensed driving school Langford BC",
    serviceAreaTitle: "Verified directory location",
    serviceAreas: ["Langford, BC"],
    intro: [
      "This page keeps its legacy web address because some people search for an \"ICBC-approved driving school.\" That phrase is not an accurate description of an ordinary licensed driving school. The wording permitted for the verified status here is \"licensed as a driver training school under the Motor Vehicle Act.\"",
      "When checked on July 21, 2026, ICBC's general driving-school directory showed this exact record: SHANAYA'S DRIVING SCHOOL, 124-2770 LEIGH RD, LANGFORD BC V9B 4G1, telephone (250) 542-3673, with driver training classes 5 and 7. ICBC states that its school list is not intended as a recommendation or endorsement.",
      "The general directory and ICBC's separate list of schools offering an approved Graduated Licensing Program (GLP) course serve different purposes. An exact-name, address and telephone check did not find Shanaya's in the approved-GLP directory on July 21, 2026, so this page does not represent the school or its ordinary lessons as ICBC-approved.",
    ],
    sections: [
      {
        title: "What the directory record verifies",
        body:
          "The ICBC directory record identifies the school, its listed Langford address and telephone number, and Class 5 and 7 under the driver-training field. It supports the statement that Shanaya's is licensed as a driver training school under the Motor Vehicle Act; it does not establish ICBC endorsement or approval of every lesson, claim, instructor or vehicle.",
        bullets: [
          "Business name: SHANAYA'S DRIVING SCHOOL",
          "Directory address: 124-2770 LEIGH RD, LANGFORD BC V9B 4G1",
          "Telephone: (250) 542-3673; driver training: Classes 5 and 7",
        ],
      },
      {
        title: "Licensed school versus approved course",
        body:
          "A school licence and an approved GLP course are not interchangeable. ICBC maintains a separate approved-GLP directory. Only a qualifying course with specific ICBC approval may be described as a \"driver education course approved by ICBC.\" Shanaya's did not appear in that separate directory under the exact identifiers checked on July 21, 2026.",
        bullets: [
          "A general directory listing is evidence of the school's listed licensing status",
          "An approved GLP course has a separate approval and directory listing",
          "Recheck both official directories because listings and approvals can change",
        ],
      },
      {
        title: "Advertising rule and verification checklist",
        body:
          "Section 27.10(2)(e) of the B.C. Motor Vehicle Act Regulations prohibits a school or instructor from stating or implying that the school or its employees are approved, supervised, recommended or endorsed by ICBC or government, subject to the exact permitted licensing and approved-course wording in that section. Before paying, verify the current records and ask for any credential or course designation relevant to the service you want.",
        bullets: [
          "Search the general ICBC directory and match the exact business name, address, telephone and training classes",
          "If you want GLP course benefits, confirm the school and the specific course in ICBC's separate approved-GLP directory before enrolling",
          "Ask to see current school and individual-instructor credentials instead of assuming them from advertising",
          "Treat any lesson, mock test or practice assessment as private instruction, not an official ICBC test or official score",
        ],
      },
    ],
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
    relatedLinksTitle: "Related information",
    relatedLinks: [
      {
        label: "Review driving lesson options",
        href: "/driving-lessons",
        description: "Read the current lesson information and confirm availability and terms before booking.",
      },
      {
        label: "Langford lesson information",
        href: "/driving-lessons-langford",
        description: "See the separate Langford service page; the verified directory address is 124-2770 Leigh Rd.",
      },
      {
        label: "B.C. graduated licensing guide",
        href: "/bc-graduated-licensing-program",
        description: "Review the licence stages and follow the linked official sources for current requirements.",
      },
    ],
    primaryCtaLabel: "Request lesson information",
    lastReviewed: "July 21, 2026",
    editorialNote:
      "The school record was checked by exact name, address and telephone against ICBC's general directory, and the same identifiers were checked against ICBC's separate approved-GLP directory. The advertising language was checked against section 27.10 of the B.C. Motor Vehicle Act Regulations. No current individual-instructor credential, training vehicle, GLP approval, pass rate, road-test route or scoring claim is made here. Recheck the official directories because records can change.",
    officialSources: [
      {
        label: "ICBC - choosing your driving school and school directory",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school",
      },
      {
        label: "ICBC - schools offering an approved GLP course",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools",
      },
      {
        label: "B.C. Motor Vehicle Act Regulations - Division 27, Driver Training",
        href: "https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/26_58_08",
      },
      {
        label: "ICBC - training options for new drivers",
        href: "https://www.icbc.com/driver-licensing/driver-training/New-drivers-or-riders",
      },
    ],
  },
  {
    id: "bc-graduated-licensing-program",
    path: "/bc-graduated-licensing-program",
    title: "B.C. GLP Rules Before and After October 19, 2026 | Shanaya's",
    metaDescription:
      "Compare B.C. GLP stages, restrictions and minimum timelines before and from October 19, 2026, including the DRA and restricted Class 5 year.",
    eyebrow: "Independent B.C. licensing guide",
    h1: "Which B.C. GLP rules apply before and after October 19, 2026?",
    heroDescription:
      "Use this decision guide to separate the rules in force through October 18, 2026 from the new Learner, Novice, Driving Record Assessment and restricted Class 5 sequence that starts October 19.",
    heroImage: "/landing/bc-graduated-licensing-program.webp",
    targetKeyword: "B.C. graduated licensing program rules 2026",
    intro: [
      "British Columbia's Graduated Licensing Program starts with a supervised Class 7L Learner stage. Passing the Class 7 road test leads to a Class 7 Novice licence, which may be driven without a supervisor but carries novice restrictions.",
      "The date matters. Through October 18, 2026, an eligible Novice driver takes a second road test to obtain an unrestricted Class 5 licence. From October 19, that second road test is replaced by a Driving Record Assessment, and an eligible driver first receives a Class 5 licence with restriction 55 for 12 compliant months.",
      "The time figures below are statutory minimums, not promised completion dates. Prohibitions, suspensions or specified convictions can restart a qualifying period, while appointment and licence-processing time can make the real path longer.",
    ],
    sections: [
      {
        title: "Decision 1: Will you leave the N stage before October 19?",
        body:
          "If you are eligible and take the Class 5 road test before October 19, the current model applies: passing produces an unrestricted Class 5 licence. If your second road-test appointment is scheduled to occur on or after October 19, ICBC says it will cancel the appointment, email you and provide next steps. From that date, use the DRA path instead.",
        bullets: [
          "Through October 18: Class 7L -> Class 7 road test -> Class 7N -> Class 5 road test -> unrestricted Class 5",
          "From October 19: Class 7L -> Class 7 road test -> Class 7N -> DRA criteria check -> Class 5 with restriction 55 -> Class 5 without restriction 55",
          "A one-time automatic upgrade on October 19 applies only to Class 7 drivers ICBC confirms are eligible; follow the ICBC letter rather than assuming an automatic upgrade",
        ],
      },
      {
        title: "Rules through October 18: the complete Class 7L stage",
        body:
          "A person may apply for an L at age 16. Under the current model, an applicant under 19 needs parent or legal-guardian consent. After passing the knowledge and vision tests, the Learner must wait at least 12 months before taking the Class 7 road test.",
        bullets: [
          "Drive only with a qualified supervisor age 25 or older who holds a valid Class 1, 2, 3, 4 or 5 licence and sits beside you in the front passenger seat",
          "Carry no more than one passenger in addition to the supervisor",
          "Display the red L sign on the rear of the vehicle",
          "Have zero alcohol and zero drugs in your blood while driving",
          "Do not use a cellphone or other electronic device, including hands-free devices, except to call 911 in an emergency",
          "Do not drive between midnight and 5 a.m.",
        ],
      },
      {
        title: "Rules through October 18: the Class 7N stage and exit test",
        body:
          "Passing the Class 7 road test moves a Learner into the Novice stage. The current minimum is 24 months without a driving prohibition, or 18 months for someone who qualifies for the approved-GLP-course reduction. An eligible Novice driver can then take the Class 5 road test; ICBC currently lists a $35 Class 7 road-test fee and a $50 Class 5 road-test fee, separate from licence fees.",
        bullets: [
          "Display the green N sign on the rear of the vehicle",
          "Have zero alcohol and zero drugs in your blood while driving",
          "Do not use a cellphone or other electronic device, including hands-free devices, except to call 911 in an emergency",
          "Carry only one passenger unless all additional passengers are immediate family or a qualified supervisor age 25 or older with a valid Class 1-5 licence is seated beside you",
          "The Novice may drive alone; the supervisor exception changes the passenger limit rather than making supervision mandatory",
        ],
      },
      {
        title: "Decision 2: minimum path from October 19, 2026",
        body:
          "The new model retains the Class 7 road test but replaces the second road test with a DRA and adds a 12-month restricted Class 5 period. These totals assume each transition happens as soon as eligible, no qualifying period restarts and the driver meets every condition; they exclude time before the L is issued and administrative or appointment delays.",
        bullets: [
          "Under 25 without the course reduction: 12 months L + 24 months N + 12 months restricted Class 5 = 48 months minimum",
          "Under 25 with a qualifying approved-course reduction: 12 months L + 18 months N + 12 months restricted Class 5 = 42 months minimum",
          "Age 25 or older under the new age-based rules: 9 months L + 12 months N + 12 months restricted Class 5 = 33 months minimum",
        ],
      },
      {
        title: "What changes for L and N drivers on October 19",
        body:
          "The core zero-alcohol-and-drug and electronic-device prohibitions remain for Class 7 drivers. Other conditions change by age and stage, so do not apply the age-25 rule to every GLP restriction.",
        bullets: [
          "An L driver age 25 or older has a 9-month minimum; the under-25 L minimum remains 12 months",
          "The minimum qualified-supervisor age becomes 22, but the supervisor must hold a Class 5 without restriction 55 and be legally able to drive",
          "An L driver may carry more than one passenger when every passenger other than the supervisor is immediate family",
          "The N-sign and one-passenger restrictions apply only to Class 7 drivers under 25; a Class 7 driver age 25 or older remains subject to zero alcohol and drugs and the new-driver electronic-device prohibition",
          "Parent or legal-guardian consent is required only for applicants under 18, rather than under 19",
        ],
      },
      {
        title: "How the Driving Record Assessment works",
        body:
          "The DRA is an ICBC review of whether a Class 7 driver meets published record and experience criteria; it is not an in-car test and should not be described as something a driver passes. From October 19, an eligible driver visits a driver licensing office to request the upgrade.",
        bullets: [
          "Required non-Learner driving: 24 months if under 25, 18 months if under 25 and eligible for the approved-course reduction, or 12 months if age 25 or older",
          "That period must not be interrupted by specified driving prohibitions or suspensions",
          "The period must not include a conviction for excessive speeding under Motor Vehicle Act section 148 or prohibited electronic-device use under section 214.2",
          "Relevant Criminal Code driving sanctions also disqualify the period under the regulation",
          "If a disqualifying event occurs, the required clean period starts again under the applicable rule; confirm the date shown by ICBC",
        ],
      },
      {
        title: "Restriction 55 after meeting the DRA criteria",
        body:
          "The first Class 5 licence issued through the new DRA path carries restriction 55: zero blood alcohol and zero blood drug content while driving. The expiry date appears on the back of the licence and the restriction expires automatically after 12 compliant months. A specified prohibition or suspension during that year restarts the 12-month period from the date the person may lawfully drive again.",
      },
      {
        title: "Approved GLP course versus ordinary driving lessons",
        body:
          "A licensed driving school and an ICBC-approved GLP course are different designations. For a Class 7 passenger-vehicle course, ICBC requires 16 hours of theory, 12 hours of individual on-road instruction and 4 discretionary hours: 32 hours total. To qualify for the possible six-month N-stage reduction, ICBC says the student must complete the approved course from start to finish within 365 days while holding a Class 7L and have no at-fault crashes, driving violations or prohibitions during the first 18 months of the N stage.",
        bullets: [
          "Ordinary lessons may help a learner practise but do not themselves qualify for the six-month reduction",
          "ICBC's general directory lists Shanaya's Driving School for Class 5 and 7 driver training",
          "Shanaya's name, phone number and Leigh Road address were not found in ICBC's separate approved-GLP-course list when checked July 21, 2026",
          "Do not enrol on the assumption that Shanaya's lessons earn the GLP reduction; verify the specific school and course in ICBC's approved list before paying",
        ],
      },
    ],
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
    lastReviewed: "July 21, 2026",
    editorialNote:
      "This independent educational summary was checked against ICBC, B.C. government and Order in Council 350/2026 sources. It is not ICBC advice or legal advice; transitional eligibility depends on the individual record, age and ICBC notice, so confirm your own status directly with ICBC.",
    officialSources: [
      {
        label: "B.C. Order in Council 350/2026",
        href: "https://www.bclaws.gov.bc.ca/civix/document/id/oic/oic_cur/0350_2026",
      },
      {
        label: "ICBC: changes to the Graduated Licensing Program",
        href: "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes",
      },
      {
        label: "B.C. government: GLP changes and model timelines",
        href: "https://news.gov.bc.ca/releases/2026PSSG0061-000847",
      },
      {
        label: "ICBC: current Class 7L requirements",
        href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L",
      },
      {
        label: "ICBC: current Class 7N requirements",
        href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-N",
      },
      {
        label: "ICBC: future guidance for Class 7L drivers",
        href: "https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7l-licence",
      },
      {
        label: "ICBC: future guidance for Class 7 drivers under 25",
        href: "https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7-licence-and-youre-under-25",
      },
      {
        label: "ICBC: conditional one-time automatic upgrade",
        href: "https://icbc.com/driver-licensing/new-drivers/you-may-be-eligible-for-an-automatic-upgrade",
      },
      {
        label: "ICBC: driver licensing fees",
        href: "https://www.icbc.com/driver-licensing/visit-dl-office/Fees",
      },
      {
        label: "ICBC: approved GLP course requirements",
        href: "https://partners.icbc.com/driver-training/driving-schools/teach-approved-course",
      },
      {
        label: "ICBC: approved GLP schools",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools",
      },
      {
        label: "ICBC: choose and verify a driving school",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school",
      },
    ],
    relatedLinksTitle: "Get ready for each stage",
    relatedLinks: [
      {
        label: "What changes on October 19, 2026",
        href: "/blog/bc-glp-changes-2026",
        description: "Read the dated update and transition examples behind the new model.",
      },
      {
        label: "Independent knowledge test practice",
        href: "/knowledge-test-practice",
        description: "Use unofficial practice to supplement ICBC's official guide and practice test.",
      },
      {
        label: "Driving lessons in Victoria",
        href: "/driving-lessons",
        description: "Review optional in-car lesson choices; ordinary lessons are not an approved GLP course.",
      },
      {
        label: "Road test preparation",
        href: "/road-test-prep",
        description: "Review preparation options for the Class 7 road test.",
      },
    ],
    primaryCtaLabel: "View lesson options",
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
    title: "B.C. Driver Education Options & Requirements | Shanaya's",
    metaDescription:
      "Compare free ICBC self-study, supervised practice, optional private lessons and the separately approved 32-hour GLP course under B.C.'s 2026 rules.",
    eyebrow: "Independent B.C. driver-education guide",
    h1: "Four driver-education options in B.C.",
    heroDescription:
      "Separate what ICBC requires from what it recommends and what you may choose to buy, with a date-specific note about the licensing changes beginning October 19, 2026.",
    heroImage: "/landing/driver-education-training.webp",
    targetKeyword: "B.C. driver education options",
    serviceAreaTitle: "Verified directory location",
    serviceAreas: ["Langford, BC"],
    intro: [
      "ICBC administers B.C. driver licensing, including the official knowledge and road tests. A private driving school can provide education or practice, but it cannot issue a licence, conduct an official ICBC road test or promise a licensing result.",
      "For a new Class 7 driver, four different activities are often called driver education: free study using ICBC materials, legal practice with a qualified supervisor, optional ordinary lessons from a licensed school, and a separately approved 32-hour GLP course. They are not interchangeable, and only the last option can carry the approved-course benefit when every condition is met.",
      "When checked July 21, 2026, ICBC's general directory listed SHANAYA'S DRIVING SCHOOL at 124-2770 LEIGH RD, LANGFORD BC V9B 4G1, telephone (250) 542-3673, for Class 5 and 7 driver training. The same identifiers did not match an entry in ICBC's separate approved-GLP school list, so this page does not state or imply that Shanaya's offers an ICBC-approved GLP course.",
    ],
    sections: [
      {
        title: "Option 1: use ICBC's free study materials",
        body:
          "ICBC publishes Learn to Drive Smart and an official practice knowledge test. These are the primary study sources for the Class 7 knowledge test and are available without buying a lesson or course. The official test and licence still have their own eligibility, identification and fee requirements.",
        bullets: [
          "Start with the current ICBC guide rather than relying on an unofficial summary",
          "Use ICBC's practice test to check your understanding; a practice result is not an official pass",
          "Confirm current test arrangements, identification and fees directly with ICBC",
        ],
      },
      {
        title: "Option 2: practise legally with a qualified supervisor",
        body:
          "A Class 7L learner builds driving experience with a qualified supervisor while obeying every restriction printed on the licence. Through October 18, 2026, the Learner stage lasts at least 12 months, and the supervisor must meet ICBC's current qualification rules and sit beside the learner. ICBC's Tuning Up for Drivers guide says a supervisor should plan to spend about 60 hours helping a new driver prepare for the Class 7 road test.",
        bullets: [
          "The approximately 60 hours is official preparation guidance, not a statutory minimum",
          "It is not a requirement to purchase 60 hours of professional lessons",
          "Only legal, supervised practice counts as driving practice during the L stage",
        ],
      },
      {
        title: "Option 3: add ordinary private lessons if useful",
        body:
          "ICBC describes in-car-only lessons and lessons combined with classroom instruction as choices. Paid lessons from a licensed school are optional on the standard Class 7 path; they do not replace the required ICBC tests, the Learner waiting period or legal supervised practice. Ordinary lessons also do not qualify for an approved-course benefit merely because the school is licensed.",
        bullets: [
          "Choose lesson content and frequency according to the learner's needs rather than a promised outcome",
          "Ask to see the current school and individual-instructor credentials relevant to the booking",
          "Treat a private mock test or assessment as coaching, not an official ICBC test or score",
        ],
      },
      {
        title: "Option 4: verify a specific ICBC-approved GLP course",
        body:
          "A Class 7 passenger-vehicle GLP course must be specifically approved by ICBC and total at least 32 hours: 16 hours of classroom theory, 12 hours of individual on-road instruction and 4 discretionary hours. ICBC says the course must be completed within 365 days while the student holds a Class 7L. A possible six-month reduction in the N stage is conditional on completing the approved course and having no at-fault crashes, driving violations or prohibitions during the first 18 months of the N stage.",
        bullets: [
          "Verify the school in ICBC's separate approved-GLP directory before paying for this benefit",
          "Confirm that the offering is the approved course, not a bundle of ordinary lessons",
          "Shanaya's did not have a matching entry in that approved-course list when checked July 21, 2026",
        ],
      },
      {
        title: "Current Class 7 path through October 18, 2026",
        body:
          "Under the rules in force through October 18, a new driver obtains an L by meeting ICBC's eligibility requirements and passing the knowledge and vision tests, practises as a supervised Learner for at least 12 months, and passes the Class 7 road test to receive an N. The current N-stage minimum is 24 months without a driving prohibition, or potentially 18 months for a driver who qualifies for the approved-course reduction, before the Class 5 road test used to exit GLP.",
      },
      {
        title: "What changes on October 19, 2026",
        body:
          "The Class 7 road test remains, but the second road test is replaced by a Driving Record Assessment. Under the new model, an eligible driver receives a Class 5 licence with restriction 55 for 12 compliant months before that restriction expires. The published minimum non-Learner driving period is 24 months for a driver under 25, 18 months for an under-25 driver who qualifies through an approved GLP course, or 12 months for a driver age 25 or older. ICBC also reduces the L-stage minimum to nine months for drivers age 25 or older; individual transition cases should follow ICBC's notice and current guidance.",
      },
    ],
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
    relatedLinksTitle: "Check the official path before choosing training",
    relatedLinks: [
      {
        label: "Independent knowledge-test practice",
        href: "/knowledge-test-practice",
        description: "Use this unofficial study aid only as a supplement to ICBC's guide and practice test.",
      },
      {
        label: "Review ordinary lesson information",
        href: "/driving-lessons",
        description: "Compare current private-lesson information without treating it as an approved GLP course.",
      },
      {
        label: "B.C. licensing rules before and after October 19",
        href: "/bc-graduated-licensing-program",
        description: "Read the detailed, date-specific GLP decision guide and its official sources.",
      },
    ],
    primaryCtaLabel: "Request lesson information",
    lastReviewed: "July 21, 2026",
    editorialNote:
      "This independent guide separates official licensing requirements, ICBC preparation guidance, optional private lessons and a specifically approved GLP course. ICBC pages and directories were checked July 21, 2026. The Shanaya's record was matched by exact business name, Leigh Road address and telephone in the general directory, and the same identifiers were checked against the separate approved-GLP list. No current individual-instructor credential, vehicle, curriculum, course approval, service-area, road-test route, score, pass-rate or outcome claim is made. Confirm changing rules and your own eligibility directly with ICBC.",
    officialSources: [
      {
        label: "ICBC - Learn to Drive Smart",
        href: "https://www.icbc.com/driver-licensing/driving-guides/Learn-to-drive-smart",
      },
      {
        label: "ICBC - official practice knowledge test",
        href: "https://www.icbc.com/driver-licensing/new-drivers/practice-knowledge-test",
      },
      {
        label: "ICBC - current Class 7L requirements",
        href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L",
      },
      {
        label: "ICBC - Tuning Up for Drivers",
        href: "https://www.icbc.com/driver-licensing/documents/tuneup-complete.pdf",
      },
      {
        label: "ICBC - training options for new drivers",
        href: "https://www.icbc.com/driver-licensing/driver-training/New-drivers-or-riders",
      },
      {
        label: "ICBC - approved GLP course requirements",
        href: "https://partners.icbc.com/driver-training/driving-schools/teach-approved-course",
      },
      {
        label: "ICBC - Graduated Licensing Program changes",
        href: "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes",
      },
      {
        label: "ICBC - choosing a driving school and general directory",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school",
      },
      {
        label: "ICBC - schools offering an approved GLP course",
        href: "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools",
      },
    ],
  },
];

export const seoLandingPagesById = Object.fromEntries(
  seoLandingPages.map((page) => [page.id, page]),
) as Record<SeoLandingPageId, SeoLandingPage>;

export const seoLandingPagesByPath = Object.fromEntries(
  seoLandingPages.map((page) => [page.path, page]),
) as Record<string, SeoLandingPage>;
