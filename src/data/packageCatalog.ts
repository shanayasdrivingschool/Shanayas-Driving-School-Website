import { courseCatalogById } from "@/data/courseCatalog";
import { createPackageLocationPricing } from "@/data/coursePricing";
import { type ProductLocationPricingMap, type ProductOutlineSection } from "@/data/productTypes";

export type PackageCatalogItem = {
  id: string;
  title: string;
  description: string;
  heroDescription: string;
  overview: string[];
  outlineSections: ProductOutlineSection[];
  includedCourseIds: string[];
  outcomes: string[];
  pricing: ProductLocationPricingMap;
  image: string;
  cta: string;
  popular?: boolean;
};

const freshStartIncludedCourseIds = [
  "knowledge-test-prep-course",
  "beginner-driving-course",
  "parking-course",
  "make-your-own-class",
];

const skillBuilderIncludedCourseIds = [
  "defensive-driving-course",
  "refresher-driving-course",
  "new-to-canada",
  "parking-course",
  "road-test-prep-course",
  "lesson-road-test-prep-course",
  "mock-test-evaluation",
  "make-your-own-class",
];

const finalLapIncludedCourseIds = [
  "confidence-booster-course",
  "refresher-driving-course",
  "advanced-driving-course",
  "road-test-prep-course",
  "lesson-road-test-prep-course",
  "mock-test-evaluation",
];

const getIncludedCourses = (courseIds: string[]) => courseIds.map((courseId) => courseCatalogById[courseId]);

export const packageCatalog: PackageCatalogItem[] = [
  {
    id: "fresh-start",
    title: "Fresh Start",
    description: "A beginner-friendly package focused on essential driving skills, including vehicle control, parking techniques, and step-by-step preparation for the road test.",
    heroDescription:
      "Fresh Start provides new drivers with a structured foundation through knowledge test preparation, guided lesson progression, focused parking practice, and a flexible session tailored to reinforce key skill areas.",
    overview: [
      "Knowledge test preparation included",
      "10x90min beginner driving lessons",
      "Parking practice plus 1 custom class",
    ],
    outlineSections: [
      {
        title: "Knowledge Test Prep Course",
        objectives: [
          "Study the key road signs, traffic rules, and right-of-way concepts needed for the learner stage.",
          "Use practice questions and guided review to improve recall, understanding, and test confidence.",
          "Connect knowledge-test material to real road situations so the rules make practical sense.",
        ],
      },
      {
        title: "Beginner's Driving Course",
        objectives: [
          "Learn the basics of vehicle control, steering, mirror checks, and smooth lane positioning from the start.",
          "Build confidence with speed control, simple intersections, and calm decision-making on beginner-friendly routes.",
          "Create a strong driving foundation before moving into more advanced traffic situations and maneuvers.",
        ],
      },
      {
        title: "Parking Course",
        objectives: [
          "Practice stall parking, parallel parking, and backing techniques with step-by-step guidance.",
          "Improve low-speed control, steering accuracy, and spacing awareness in tighter spaces.",
          "Build consistent parking habits that feel more confident and road-test ready.",
        ],
      },
    ],
    includedCourseIds: freshStartIncludedCourseIds,
    outcomes: [
      "Start from scratch with a guided lesson flow instead of guessing what to practice first.",
      "Cover both Knowledge-test readiness and driving fundamentals in one package plan.",
      "Finish with refined parking control and lasting confidence and consistency behind the wheel. ",
    ],
    pricing: createPackageLocationPricing("Fresh Start", getIncludedCourses(freshStartIncludedCourseIds)),
    image: "https://www.driving-schools.com/uploads/images/schools/car-15.jpg",
    cta: "Ask About Fresh Start",
    popular: true,
  },
  {
    id: "skill-builder",
    title: "Skill Builder",
    description: "A focused package for drivers with some experience, designed to sharpen key skills, build road confidence, and prepare thoroughly for the ICBC road test.",
    heroDescription:
      "Skill Builder is for learners with prior experience seeking a focused, structured approach. It blends advanced parking, refreshers, defensive driving techniques, and road test preparation to build confidence and control.",
    overview: [
      "Road test readiness with precision parking support",
      "Defensive driving and structured refreshers",
      "Mock road test with newcomer-focused coaching",
    ],
    outlineSections: [
      {
        title: "Defensive Driving Course",
        objectives: [
          "Develop stronger hazard awareness and earlier decision-making in active traffic.",
          "Practice defensive habits that reduce risk in busy, changing road conditions.",
          "Improve anticipation, spacing, and safe responses around other drivers.",
        ],
      },
      {
        title: "Refresher Driving Course",
        objectives: [
          "Rebuild confidence after time away from driving or after inconsistent practice.",
          "Refresh core skills like lane changes, turns, observations, and vehicle control.",
          "Use guided repetition to restore smoother, more reliable day-to-day driving.",
        ],
      },
      {
        title: "New to Canada",
        objectives: [
          "Learn local road rules, signs, and driving expectations used across British Columbia.",
          "Adjust to Canadian traffic flow, right-of-way habits, and test-day standards.",
          "Build comfort driving in a new system with structured guidance and real-road practice.",
        ],
      },
      {
        title: "Parking Course",
        objectives: [
          "Practice parallel parking, stall parking, and backing with clear step-by-step coaching.",
          "Improve spacing, steering timing, and low-speed control in tighter environments.",
          "Build parking confidence that carries directly into road-test scenarios.",
        ],
      },
      {
        title: "Road Test Prep Course",
        objectives: [
          "Practice common ICBC test routes, standards, and scoring expectations.",
          "Reinforce lane positioning, shoulder checks, speed control, and intersection judgment.",
          "Strengthen road-test consistency so mistakes are reduced before the official booking.",
        ],
      },
      {
        title: "Lesson + Road Test Prep + Rental",
        objectives: [
          "Combine two focused driving lessons with targeted road test preparation and a rental car for exam day.",
          "Warm up key maneuvers, observations, and control habits that need the most attention.",
          "Use instructor feedback to tighten performance and feel more prepared for the ICBC test.",
        ],
      },
      {
        title: "Mock Test Evaluation",
        objectives: [
          "Complete a realistic mock road test with instructor scoring and feedback.",
          "Identify the habits most likely to cost marks on the actual ICBC exam.",
          "Turn the evaluation into a focused final plan for last-stage improvement.",
        ],
      },
    ],
    includedCourseIds: skillBuilderIncludedCourseIds,
    outcomes: [
      "Improve multiple weak areas without committing to a single-focus lesson plan.",
      "Blend everyday driving confidence with test-ready coaching in one structured track.",
      "Receive clear, professional feedback to determine whether you’re ready for the road test or would benefit from additional practice.",
    ],
    pricing: createPackageLocationPricing("Skill Builder", getIncludedCourses(skillBuilderIncludedCourseIds)),
    image: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1800&q=80",
    cta: "Ask About Skill Builder",
  },
  {
    id: "final-lap",
    title: "Final Lap",
    description: "For drivers with foundational experience who want to refine driving skills, improve confidence, and prepare for more advanced driving scenarios.",
    heroDescription:
      "Final Lap is for students closing in on their road test and wanting sharper final reps, realistic feedback, and focused confidence work instead of broad beginner instruction.",
    overview: [
      "Final road test readiness",
      "Mock evaluation with confidence building",
      "Advanced lessons leading up to test day",
    ],
    outlineSections: [
      {
        title: "Confidence Booster Course",
        objectives: [
          "Build calmer, more consistent decision-making in the situations that create the most stress.",
          "Reduce hesitation with guided repetition on turns, lane changes, and busier routes.",
          "Develop steadier confidence so test-day driving feels more controlled and predictable.",
        ],
      },
      {
        title: "Refresher Driving Course",
        objectives: [
          "Revisit core driving habits that may still feel inconsistent before the road test.",
          "Refresh vehicle control, observations, and everyday road skills through structured repetition.",
          "Restore consistency so final practice feels smoother, calmer, and more reliable.",
        ],
      },
      {
        title: "Advanced Driving Course",
        objectives: [
          "Refine higher-level control, awareness, and judgment in more demanding traffic conditions.",
          "Practice cleaner timing, positioning, and responses in complex road environments.",
          "Strengthen advanced habits that support safer and more polished driving overall.",
        ],
      },
      {
        title: "Road Test Prep Course",
        objectives: [
          "Practice ICBC-style routes, standards, and the maneuvers most likely to be assessed.",
          "Reinforce lane positioning, shoulder checks, speed control, and clean intersection work.",
          "Turn weak spots into a focused final practice plan before test day arrives.",
        ],
      },
      {
        title: "Lesson + Road Test Prep + Rental",
        objectives: [
          "Combine two focused driving lessons with targeted road test preparation and a rental car for exam day.",
          "Warm up key maneuvers, observations, and route habits that still need tightening.",
          "Use instructor feedback to sharpen control and readiness before the official test.",
        ],
      },
      {
        title: "Mock Test Evaluation",
        objectives: [
          "Complete a realistic road test simulation with instructor scoring and direct feedback.",
          "Identify avoidable mistakes before they appear on the actual exam.",
          "Use the evaluation to measure readiness and target the final areas for improvement.",
        ],
      },
    ],
    includedCourseIds: finalLapIncludedCourseIds,
    outcomes: [
      "Move from almost-ready to test-ready with a cleaner final practice block.",
      "Use mock feedback to avoid repeating the same mistakes on the real route.",
      "Walk into road-test day with stronger advanced control and calmer decision-making.",
    ],
    pricing: createPackageLocationPricing("Final Lap", getIncludedCourses(finalLapIncludedCourseIds)),
    image: "https://tests.ca/img/licence/british-columbia-drivers-licence.jpg",
    cta: "Ask About Final Lap",
  },
];

export const packageCatalogById = Object.fromEntries(packageCatalog.map((pkg) => [pkg.id, pkg])) as Record<string, PackageCatalogItem>;

export const getPackageIncludedCourses = (packageId: string) => {
  const pkg = packageCatalogById[packageId];
  if (!pkg) return [];

  return pkg.includedCourseIds
    .map((courseId) => courseCatalogById[courseId])
    .filter((course) => Boolean(course));
};
