export const BRAND_ORIGIN = "https://www.shanayasdrivingschool.com";
export const BRAND_NAME = "Shanaya's Driving School";
export const BRANCH_PHONE = "250-542-3673";
export const BRANCH_TEL = "tel:+12505423673";
export const BRANCH_EMAIL = "book@drivingschoolbc.ca";
export const BRANCH_HOURS = "9:00 AM–9:00 PM, Monday to Sunday";
export const ICBC_BOOKING_URL = "https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test";
export const ICBC_LOCATOR_URL = "https://www.icbc.com/locators/driver-licensing-office";
export const ICBC_GLP_URL = "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes";

export type BranchLocation = {
  id: "langford" | "victoria-james-bay";
  label: string;
  footerLabel: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  subheadline: string;
  street: string;
  city: string;
  postalCode: string;
  coordinates: { latitude: number; longitude: number };
  mapUrl: string;
  whyTitle: string;
  benefits: { title: string; text: string }[];
  pickupTitle: string;
  pickupText: string;
  areas: string[];
  packagesText: string;
  packages: { title: string; text: string }[];
  faqs: { question: string; answer: string; source?: { label: string; href: string } }[];
};

// Branch operations, addresses, hours and services confirmed by the owner on
// 2026-11-23. Coordinates are the place pins in the supplied Google Maps links.
export const branchLocations: BranchLocation[] = [
  {
    id: "langford",
    label: "Langford Campus (Westshore)",
    footerLabel: "Langford Office",
    path: "/locations/langford/",
    title: "Langford Driving School, BC | Shanaya's Westshore",
    description: "Learn with Shanaya's Langford Campus at Unit 124, 2770 Leigh Rd. Class 7 and Class 5 test prep, dual-control cars and Westshore pickup. Call today.",
    h1: "Driving lessons in Langford, BC — built for the Westshore",
    subheadline: "Start close to home at our Langford Campus. Build skills for neighbourhood streets, roundabouts and Highway 1 with automatic dual-control vehicles and door-to-door pickup across the Westshore.",
    street: "Unit 124, 2770 Leigh Rd",
    city: "Langford",
    postalCode: "V9B 4G1",
    coordinates: { latitude: 48.451471, longitude: -123.5181913 },
    mapUrl: "https://maps.app.goo.gl/dAwuQFZEFyyi8jt17",
    whyTitle: "Why learn with Shanaya's Driving School in Langford?",
    benefits: [
      { title: "Prepare for Westshore journeys", text: "Work towards the driving you need around Goldstream Avenue, Millstream Village and Westhills, with lessons focused on your current skills and everyday destinations." },
      { title: "Build highway and roundabout confidence", text: "Discuss lane changes, merging and roundabouts as lesson goals. Your instructor chooses suitable practice locations and introduces more demanding traffic as your skills develop." },
      { title: "Get focused ICBC test preparation", text: "Prepare for a Class 7 road test or a Class 5 road test where required, with feedback on observation, vehicle control, parking and decision-making. We teach transferable skills rather than promise an examiner's route." },
      { title: "Make lessons easier to fit into your day", text: "Learn in an automatic dual-control vehicle and arrange door-to-door pickup. Both beginners and returning drivers can discuss a lesson plan with our Westshore team." },
    ],
    pickupTitle: "Neighbourhoods and door-to-door pickup in the Westshore",
    pickupText: "Our Langford Campus serves Westshore learners from Leigh Road, with door-to-door pickup in the areas below. Tell us your address and preferred lesson time so we can confirm the meeting arrangements and any applicable travel charges before booking.",
    areas: ["Langford", "Goldstream Avenue", "Millstream Village", "Westhills", "Colwood", "View Royal", "Metchosin", "Sooke"],
    packagesText: "Choose a lesson plan around your starting point, not a fixed promise of test readiness. Call or email our Langford team for current lesson durations, package inclusions and a full quote in Canadian dollars, including taxes and any pickup charges.",
    packages: [
      { title: "Class 7 learner and novice support", text: "Knowledge-test study support for the L stage, beginner driving lessons and preparation for the Class 7 road test, with practice goals suited to your experience." },
      { title: "Road-test preparation", text: "Focused preparation for your booked test, including Class 5 preparation when ICBC requires that test. Discuss your remaining practice needs before choosing a package." },
      { title: "Westshore confidence lessons", text: "Refresh parking, local-road or highway skills for the trips you want to make around Langford and neighbouring communities." },
    ],
    faqs: [
      { question: "Where is your Langford branch, and is it separate from James Bay?", answer: "Our Langford Campus (Westshore) is at Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1, Canada. It is a separate physical branch from our Victoria Campus in James Bay. Both use 250-542-3673 and book@drivingschoolbc.ca, so mention Langford when contacting us." },
      { question: "Do you offer pickup in Colwood, Westhills and Sooke?", answer: "Yes. Our Westshore pickup areas include Colwood, Westhills, View Royal, Metchosin and Sooke, as well as Langford, Goldstream Avenue and Millstream Village. Give us your address and preferred time so we can confirm the pickup point, schedule and any travel charge." },
      { question: "Will I practise the exact ICBC test route around Langford or Colwood?", answer: "We can help with local driving and road-test preparation, but we do not promise an official or exact test route. ICBC does not make its routes available outside ICBC. Tell us the office shown on your appointment so we can plan relevant preparation without treating a practice route as your exam route.", source: { label: "ICBC road-test booking and route information", href: ICBC_BOOKING_URL } },
      { question: "Can I book Class 7 or Class 5 preparation at the Langford Campus?", answer: "Yes. We offer Class 7 learner and novice support and Class 5 road-test preparation where that test is required. Confirm your individual licensing requirements with ICBC, then call 250-542-3673 or email us with your licence stage, goals and test date if booked.", source: { label: "ICBC Graduated Licensing Program changes", href: ICBC_GLP_URL } },
    ],
  },
  {
    id: "victoria-james-bay",
    label: "Victoria Campus (James Bay)",
    footerLabel: "Victoria Office",
    path: "/locations/victoria-james-bay/",
    title: "James Bay Driving School, Victoria BC | Shanaya's",
    description: "Visit Shanaya's Victoria Campus at 503 Niagara St, James Bay. Downtown confidence, parking and road-test prep with local pickup. Call to book.",
    h1: "Driving lessons in James Bay, Victoria, BC",
    subheadline: "Build confidence for city driving from our Victoria Campus at 503 Niagara Street. Practise downtown traffic, parking and everyday journeys in an automatic dual-control vehicle, with door-to-door pickup across our Victoria service areas.",
    street: "503 Niagara St",
    city: "Victoria",
    postalCode: "V8V 2G4",
    coordinates: { latitude: 48.4136212, longitude: -123.3754353 },
    mapUrl: "https://maps.app.goo.gl/vF3YEBfLAFXMs7hc6",
    whyTitle: "Why learn with Shanaya's Driving School in Victoria?",
    benefits: [
      { title: "Learn for everyday city journeys", text: "Focus on the skills you want for James Bay, Downtown Victoria and Fairfield, including observation, intersections and sharing busy streets with other road users." },
      { title: "Give parking the attention it needs", text: "Work on parallel parking and low-speed vehicle control as part of your lesson goals. Build useful skills for reaching shops, work and appointments around Victoria." },
      { title: "Prepare for your McKenzie Avenue appointment", text: "If your ICBC appointment is at the Victoria/McKenzie office, tell us when booking. We can discuss preparation for the driving demands of your test, without claiming an official route or a guaranteed result." },
      { title: "Start from a convenient local pickup", text: "Arrange door-to-door pickup in James Bay and our listed Victoria areas. Learn in an automatic dual-control vehicle, with a plan for beginner, refresher or confidence work." },
    ],
    pickupTitle: "Neighbourhoods and door-to-door pickup in Victoria",
    pickupText: "Our Victoria Campus is in James Bay, in Victoria, British Columbia, Canada. We offer door-to-door pickup in the neighbourhoods and areas below, including the Beacon Hill Park area. Share your exact address and available times; we will confirm a suitable pickup point and any applicable travel charges.",
    areas: ["James Bay", "Beacon Hill Park area", "Downtown Victoria", "Fairfield", "Oak Bay", "Fernwood", "Esquimalt", "Saanich"],
    packagesText: "Choose support for the driving you actually need: a first lesson, more parking practice, confidence in downtown traffic or preparation for a booked road test. Call or email the Victoria team to compare lesson durations, inclusions and total prices in Canadian dollars before you commit.",
    packages: [
      { title: "Class 7 learner and novice support", text: "Start with knowledge-test study support for the L stage, then build driving skills and prepare for the Class 7 road test as appropriate to your licence and experience." },
      { title: "Victoria road-test preparation", text: "Discuss your confirmed testing office and date, including a Victoria/McKenzie appointment. Class 5 preparation is available for drivers who are required to take that test." },
      { title: "City and highway confidence", text: "Focus on parallel parking, downtown journeys or highway confidence, whether you are learning for the first time or returning after a break." },
    ],
    faqs: [
      { question: "Where is your Victoria Campus?", answer: "Our Victoria Campus (James Bay) is at 503 Niagara St, Victoria, BC V8V 2G4, Canada. This is our James Bay branch in British Columbia, separate from our Langford Campus on Leigh Road. Mention Victoria or James Bay when using our shared phone number or email." },
      { question: "Can you pick me up in James Bay or near Beacon Hill Park?", answer: "Yes. Door-to-door pickup is available in James Bay and the Beacon Hill Park area, with additional coverage in Downtown Victoria, Fairfield, Oak Bay, Fernwood, Esquimalt and Saanich. Give us your exact address and preferred time to confirm a suitable pickup point and any travel charge." },
      { question: "Can I prepare with you for an ICBC test at Victoria/McKenzie Avenue?", answer: "Yes. Tell us that your confirmed appointment is at the Victoria/McKenzie office and share the test class and date. We can discuss a preparation plan from James Bay. Your school lesson and ICBC appointment are separate bookings; confirm the test location and arrival instructions with ICBC.", source: { label: "Find your ICBC driver licensing office", href: ICBC_LOCATOR_URL } },
      { question: "Will lessons cover parallel parking, downtown traffic and the McKenzie test route?", answer: "Parallel parking, city traffic and road-test preparation can be lesson goals. We select practice according to your skills and current conditions. ICBC does not share official routes outside ICBC, so we prepare driving skills rather than promise the route you will take on test day.", source: { label: "ICBC road-test booking and route information", href: ICBC_BOOKING_URL } },
    ],
  },
];

export const branchByPath = (path: string) => branchLocations.find((branch) => branch.path.replace(/\/$/, "") === path.replace(/\/$/, ""));
export const branchAddress = (branch: BranchLocation) => `${branch.street}, ${branch.city}, BC ${branch.postalCode}, Canada`;
export const branchId = (branch: BranchLocation) => `${BRAND_ORIGIN}${branch.path}#driving-school`;

export const buildBranchSchema = (branch: BranchLocation) => ({
  "@type": "LocalBusiness",
  "@id": branchId(branch),
  name: BRAND_NAME,
  alternateName: `${BRAND_NAME} — ${branch.label}`,
  description: branch.description,
  url: `${BRAND_ORIGIN}${branch.path}`,
  mainEntityOfPage: { "@id": `${BRAND_ORIGIN}${branch.path}#webpage` },
  telephone: "+1-250-542-3673",
  email: BRANCH_EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: branch.street,
    addressLocality: branch.city,
    addressRegion: "BC",
    postalCode: branch.postalCode,
    addressCountry: "CA",
  },
  geo: { "@type": "GeoCoordinates", ...branch.coordinates },
  openingHoursSpecification: [{
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => `https://schema.org/${day}`),
    opens: "09:00",
    closes: "21:00",
  }],
  hasMap: branch.mapUrl,
  areaServed: branch.areas.map(area => `${area}, British Columbia, Canada`),
  parentOrganization: { "@id": `${BRAND_ORIGIN}/#organization` },
});

export const buildBranchGraph = (path?: string, socialProfiles: string[] = []) => {
  const current = path ? branchByPath(path) : undefined;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BRAND_ORIGIN}/#organization`,
        name: BRAND_NAME,
        url: `${BRAND_ORIGIN}/`,
        telephone: "+1-250-542-3673",
        email: BRANCH_EMAIL,
        logo: `${BRAND_ORIGIN}/logos/Driving%20School%20Logo%20Horizontal.png`,
        ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
        subOrganization: branchLocations.map(branch => ({ "@id": branchId(branch) })),
      },
      ...(current ? [current] : branchLocations).map(buildBranchSchema),
      ...(current ? [{
        "@type": "WebPage",
        "@id": `${BRAND_ORIGIN}${current.path}#webpage`,
        url: `${BRAND_ORIGIN}${current.path}`,
        name: current.title,
        inLanguage: "en-CA",
        mainEntity: { "@id": branchId(current) },
        publisher: { "@id": `${BRAND_ORIGIN}/#organization` },
      }] : []),
    ],
  };
};
