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
  | "faq";

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
    title: "Beginner Driving Lessons in Victoria, BC | Shanaya's Driving School",
    metaDescription:
      "Beginner driving lessons in Victoria, Langford, and Greater Victoria with ICBC-aligned coaching, dual-control vehicles, and calm instructor support.",
    eyebrow: "Beginner driving lessons",
    h1: "Driving lessons in Victoria, BC",
    heroDescription:
      "Learn safe vehicle control, road awareness, and everyday driving habits with structured beginner lessons across Victoria and Langford.",
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
      "Driving lessons in Langford and the Westshore, BC with ICBC-aligned coaching, dual-control cars, and lessons that start from our Langford office on Leigh Rd.",
    eyebrow: "Langford driving lessons",
    h1: "Driving lessons in Langford, BC",
    heroDescription:
      "Learn to drive with confidence across Langford and the Westshore, with calm, ICBC-aligned instruction on roundabouts, Goldstream Avenue traffic, highway merges, and parking from our local Langford hub.",
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
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
      "Shanaya's Driving School is based right in Langford. Our main office and primary training hub sits at Unit 124, 2770 Leigh Rd in the heart of the Westshore, so lessons for Langford learners can start close to home on the roads you already drive every day.",
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
        question: "Do lessons start from your Langford office?",
        answer:
          "Yes. Our main training hub is at Unit 124, 2770 Leigh Rd in Langford, and lessons can begin from the Westshore so you practise on familiar local roads.",
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
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
      "Shanaya's Driving School teaches new and returning drivers across Colwood and the Westshore. Our main training hub is just up the road in Langford at Unit 124, 2770 Leigh Rd, so Colwood learners can start close to home on the roads they drive every day.",
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
          "Our training hub is in nearby Langford at Unit 124, 2770 Leigh Rd, and lessons can begin from the Westshore so you practise on familiar Colwood roads.",
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
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
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
      "Shanaya's Driving School teaches new and returning drivers across View Royal, the gateway between Victoria and the Westshore. Our main training hub is minutes away in Langford at Unit 124, 2770 Leigh Rd, so View Royal learners can start close to home on the roads they drive every day.",
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
          "Our training hub is in nearby Langford at Unit 124, 2770 Leigh Rd, and lessons can begin from the Westshore so you practise on familiar View Royal roads.",
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
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://media-blog.zutobi.com/wp-content/uploads/sites/2/2021/06/14165940/WHAT-IS-DEFENSIVE-DRIVING-scaled.jpg",
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
    heroImage:
      "https://www.easydriversed.com/wp-content/uploads/2025/01/the-road-test-process.jpg",
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
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
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
    heroImage:
      "https://th.bing.com/th/id/R.938bd1619651dfafcc414b34125030cc?rik=YGc%2fiHscOQkg8A&riu=http%3a%2f%2fdualcontrolvehiclehire.co.uk%2fassets%2fimages%2fdual-internal-1266x949.jpeg&ehk=sBzyh82TS%2fru%2fNH3cCjSrvjtlhpolkb8a0RbECqzZ6o%3d&risl=&pid=ImgRaw&r=0",
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
    heroImage:
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
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
      "View driving lesson pricing options for Victoria, Langford, and Greater Victoria, including courses, packages, road test prep, and payment plan support.",
    eyebrow: "Pricing",
    h1: "Driving lesson prices in Victoria, BC",
    heroDescription:
      "Compare lesson, package, road test prep, and payment plan options before choosing your training path.",
    heroImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
    targetKeyword: "driving lesson prices Victoria BC",
    intro: [
      "Driving lesson pricing depends on the student's goals, service area, course type, and whether the student chooses individual lessons or a structured package. Shanaya's Driving School keeps pricing options clear so families can compare beginner lessons, road test preparation, parking practice, and bundled training plans.",
      "Many students start with a package because it creates a complete training path. Others book a specific course when they only need a focused skill, such as road test prep, defensive driving, parking, or a refresher session. Payment plan options may also be available for eligible students and approved programs.",
      "The best value is usually the plan that matches the student's actual stage. A beginner needs enough repetition to build safe habits, while a near-ready student may only need targeted feedback before an ICBC appointment.",
    ],
    sections: [
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
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
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
];

export const seoLandingPagesById = Object.fromEntries(
  seoLandingPages.map((page) => [page.id, page]),
) as Record<SeoLandingPageId, SeoLandingPage>;

export const seoLandingPagesByPath = Object.fromEntries(
  seoLandingPages.map((page) => [page.path, page]),
) as Record<string, SeoLandingPage>;
