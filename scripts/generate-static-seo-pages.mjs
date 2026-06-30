import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "../dist");
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
    title: "Beginner Driving Lessons in Victoria, BC | Shanaya's Driving School",
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
    title: "Road Test Preparation in BC | Shanaya's Driving School",
    description:
      "ICBC road test preparation in Victoria and Langford with mock routes, parking practice, examiner-style feedback, and test-day confidence coaching.",
    image: "https://www.easydriversed.com/wp-content/uploads/2025/01/the-road-test-process.jpg",
    faqs: [
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
      "View driving lesson pricing options for Victoria, Langford, and Greater Victoria, including courses, packages, road test prep, and payment plan support.",
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
    title: "Lesson + Road Test Prep Course | Shanaya's Driving School",
    description: "A combined lesson built to sharpen driving and prepare you for road test expectations.",
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
    title: "A Newcomer's Guide to Driving in BC | Shanaya's Driving School",
    description:
      "Moving to British Columbia? Learn about getting your BC driver's licence and staying road-legal.",
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
