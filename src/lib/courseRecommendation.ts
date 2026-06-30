import { courseCatalogById, type CourseCatalogItem } from "@/data/courseCatalog";

export type CourseQuizAnswers = {
  stage:
    | "brand-new"
    | "some-practice"
    | "test-ready"
    | "licensed-rusty"
    | "experienced-upgrading"
    | "mixed-needs";
  licenceStatus: "none" | "learner" | "novice" | "full" | "international";
  primaryGoal:
    | "start-learning"
    | "pass-knowledge-test"
    | "pass-road-test"
    | "build-confidence"
    | "refresh-skills"
    | "advanced-technique";
  practiceFrequency: "none-yet" | "once-in-a-while" | "weekly" | "regularly";
  roadTestTimeline: "within-30-days" | "within-90-days" | "not-booked-yet" | "not-applicable";
  confidenceLevel: "very-nervous" | "needs-repetition" | "mostly-confident";
  primaryChallenge:
    | "parking"
    | "road-rules"
    | "test-routes"
    | "mock-test-feedback"
    | "traffic-anxiety"
    | "hazard-awareness"
    | "winter-weather"
    | "canadian-rules"
    | "precision-control"
    ;
  challengeAreas: Array<
    | "parking"
    | "road-rules"
    | "test-routes"
    | "mock-test-feedback"
    | "traffic-anxiety"
    | "hazard-awareness"
    | "winter-weather"
    | "canadian-rules"
    | "precision-control"
  >;
  lessonPreference:
    | "structured-program"
    | "targeted-improvement"
    | "test-focused"
    | "custom-single-focus";
  specialSituations: Array<
    "new-to-canada" | "senior-driver" | "want-custom-focus" | "returning-after-break"
  >;
};

type ScoredCourse = {
  score: number;
  reasons: string[];
};

export type CourseRecommendationResult = {
  pathwayTitle: string;
  summary: string;
  primaryRecommendations: Array<CourseCatalogItem & { reasons: string[]; score: number }>;
  supportRecommendations: Array<CourseCatalogItem & { reasons: string[]; score: number }>;
};

const scoreCourse = (
  scoreBoard: Record<string, ScoredCourse>,
  courseId: string,
  points: number,
  reason: string,
) => {
  const course = scoreBoard[courseId];
  if (!course) return;
  course.score += points;
  if (!course.reasons.includes(reason)) {
    course.reasons.push(reason);
  }
};

const ensureCourse = (
  scoreBoard: Record<string, ScoredCourse>,
  mustInclude: string[],
  courseId: string,
  minimumScore: number,
  reason: string,
) => {
  const course = scoreBoard[courseId];
  if (!course) return;
  if (course.score < minimumScore) {
    course.score = minimumScore;
  }
  if (!course.reasons.includes(reason)) {
    course.reasons.push(reason);
  }
  if (!mustInclude.includes(courseId)) {
    mustInclude.push(courseId);
  }
};

const profileSummaryMap: Record<CourseQuizAnswers["stage"], string> = {
  "brand-new": "You are starting from the basics and need a strong foundation first.",
  "some-practice": "You already have some seat time and need targeted practice in the right areas.",
  "test-ready": "You are close to test day and need focused preparation instead of general lessons.",
  "licensed-rusty": "You have driving history but need confidence and habit-building again.",
  "experienced-upgrading": "You already drive and want sharper control for tougher situations.",
  "mixed-needs": "Your answers point to a mix of goals, so a more custom set of lessons fits best.",
};

const pathwayTitleMap: Partial<Record<CourseQuizAnswers["primaryGoal"], string>> = {
  "start-learning": "Foundation Course Path",
  "pass-knowledge-test": "Knowledge Test Path",
  "pass-road-test": "Road Test Readiness Path",
  "build-confidence": "Confidence Building Path",
  "refresh-skills": "Skill Refresh Path",
  "advanced-technique": "Advanced Skills Path",
};

export const getCourseRecommendations = (answers: CourseQuizAnswers): CourseRecommendationResult => {
  const scoreBoard = Object.fromEntries(
    Object.keys(courseCatalogById).map((courseId) => [courseId, { score: 0, reasons: [] as string[] }]),
  ) as Record<string, ScoredCourse>;
  const mustInclude: string[] = [];

  switch (answers.stage) {
    case "brand-new":
      scoreCourse(scoreBoard, "beginner-driving-course", 6, "You are at the beginner stage.");
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 4, "You need help with the early learner stage.");
      scoreCourse(scoreBoard, "parking-course", 3, "Parking practice is useful early in training.");
      scoreCourse(scoreBoard, "confidence-booster-course", 2, "Extra guided practice can reduce early nerves.");
      break;
    case "some-practice":
      scoreCourse(scoreBoard, "parking-course", 3, "You need focused skill-building rather than full beginner training.");
      scoreCourse(scoreBoard, "confidence-booster-course", 3, "More guided repetition will help you settle in.");
      scoreCourse(scoreBoard, "refresher-driving-course", 2, "A targeted review can tighten up current skills.");
      break;
    case "test-ready":
      scoreCourse(scoreBoard, "road-test-prep-course", 6, "You are preparing specifically for the road test.");
      scoreCourse(scoreBoard, "lesson-road-test-prep-course", 4, "A focused prep lesson fits your current stage.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 4, "A readiness check is important before test day.");
      break;
    case "licensed-rusty":
      scoreCourse(scoreBoard, "refresher-driving-course", 6, "You need to rebuild consistency after time away.");
      scoreCourse(scoreBoard, "confidence-booster-course", 4, "Confidence support matches your current stage.");
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "A stronger awareness routine will help you settle back in.");
      break;
    case "experienced-upgrading":
      scoreCourse(scoreBoard, "advanced-driving-course", 6, "You want sharper control beyond the basics.");
      scoreCourse(scoreBoard, "defensive-driving-course", 4, "Advanced drivers still benefit from stronger hazard strategy.");
      scoreCourse(scoreBoard, "winter-driving-course", 1, "Special-condition training can round out your skill set.");
      break;
    case "mixed-needs":
      scoreCourse(scoreBoard, "make-your-own-class", 6, "Your answers point to a custom focus lesson.");
      scoreCourse(scoreBoard, "refresher-driving-course", 2, "A review lesson can help connect your mixed goals.");
      scoreCourse(scoreBoard, "road-test-prep-course", 2, "Some of your answers still point toward test-focused support.");
      break;
  }

  switch (answers.licenceStatus) {
    case "none":
      scoreCourse(scoreBoard, "beginner-driving-course", 5, "You are still before the full learner stage.");
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 5, "Knowledge prep fits students without a licence yet.");
      scoreCourse(scoreBoard, "parking-course", 2, "Early parking practice helps build control.");
      break;
    case "learner":
      scoreCourse(scoreBoard, "beginner-driving-course", 3, "Learner drivers benefit from structured foundation lessons.");
      scoreCourse(scoreBoard, "parking-course", 2, "Parking is a common learner weak spot.");
      break;
    case "novice":
      scoreCourse(scoreBoard, "road-test-prep-course", 3, "Novice drivers are often preparing for their next test stage.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 2, "A mock test can uncover last-mile gaps.");
      scoreCourse(scoreBoard, "confidence-booster-course", 2, "Extra guided practice can smooth out nerves.");
      break;
    case "full":
      scoreCourse(scoreBoard, "refresher-driving-course", 2, "A licensed driver may need a focused refresh.");
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "Defensive habits add value after licensing too.");
      break;
    case "international":
      scoreCourse(scoreBoard, "new-to-canada", 5, "Drivers new to Canada often need local rule adjustment.");
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "Traffic pattern review can help with adaptation.");
      scoreCourse(scoreBoard, "refresher-driving-course", 2, "A local refresher can bridge experience gaps.");
      break;
  }

  switch (answers.primaryGoal) {
    case "start-learning":
      scoreCourse(scoreBoard, "beginner-driving-course", 5, "Your main goal is to build driving basics.");
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 4, "Early learning often includes knowledge test support.");
      scoreCourse(scoreBoard, "parking-course", 3, "Parking is part of a strong beginner base.");
      break;
    case "pass-knowledge-test":
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 6, "Your main target is the knowledge test.");
      scoreCourse(scoreBoard, "beginner-driving-course", 2, "Core beginner coaching supports the same stage.");
      break;
    case "pass-road-test":
      scoreCourse(scoreBoard, "road-test-prep-course", 6, "Your main target is the road test.");
      scoreCourse(scoreBoard, "lesson-road-test-prep-course", 4, "A combined prep lesson fits that goal.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 4, "A mock evaluation helps before test day.");
      scoreCourse(scoreBoard, "parking-course", 2, "Parking still matters for road test success.");
      break;
    case "build-confidence":
      scoreCourse(scoreBoard, "confidence-booster-course", 6, "Confidence is your main priority.");
      scoreCourse(scoreBoard, "refresher-driving-course", 4, "A refresher pairs well with confidence work.");
      break;
    case "refresh-skills":
      scoreCourse(scoreBoard, "refresher-driving-course", 6, "You want to refresh existing skills.");
      scoreCourse(scoreBoard, "defensive-driving-course", 3, "Defensive habits strengthen refreshed driving.");
      scoreCourse(scoreBoard, "parking-course", 2, "Refreshing parking often helps licensed drivers too.");
      break;
    case "advanced-technique":
      scoreCourse(scoreBoard, "advanced-driving-course", 6, "You want higher-level technique training.");
      scoreCourse(scoreBoard, "defensive-driving-course", 4, "Advanced control benefits from stronger hazard strategy.");
      break;
  }

  switch (answers.practiceFrequency) {
    case "none-yet":
      scoreCourse(scoreBoard, "beginner-driving-course", 4, "You are not practicing yet, so a structured foundation is important.");
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 2, "Early-stage students often need rules support too.");
      scoreCourse(scoreBoard, "confidence-booster-course", 2, "Extra guided support helps when practice is still minimal.");
      break;
    case "once-in-a-while":
      scoreCourse(scoreBoard, "confidence-booster-course", 3, "You need more repetition between limited practice sessions.");
      scoreCourse(scoreBoard, "refresher-driving-course", 3, "Occasional practice often benefits from structured review.");
      break;
    case "weekly":
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "Regular weekly practice can support more skill-focused coaching.");
      scoreCourse(scoreBoard, "road-test-prep-course", 2, "You have enough practice rhythm to benefit from targeted prep.");
      break;
    case "regularly":
      scoreCourse(scoreBoard, "advanced-driving-course", 3, "Frequent practice suggests readiness for higher-level coaching.");
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "Regular drivers can benefit from sharper awareness training.");
      break;
  }

  switch (answers.roadTestTimeline) {
    case "within-30-days":
      scoreCourse(scoreBoard, "road-test-prep-course", 4, "Your test is soon, so route-specific prep matters.");
      scoreCourse(scoreBoard, "lesson-road-test-prep-course", 4, "A last-mile prep lesson fits a near-term test.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 3, "A timed mock test is valuable before a near test.");
      break;
    case "within-90-days":
      scoreCourse(scoreBoard, "road-test-prep-course", 3, "You are within a realistic road test prep window.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 2, "A readiness check will help before test day.");
      break;
    case "not-booked-yet":
      scoreCourse(scoreBoard, "road-test-prep-course", 2, "Prep can still start before booking the test.");
      break;
    case "not-applicable":
      break;
  }

  switch (answers.confidenceLevel) {
    case "very-nervous":
      scoreCourse(scoreBoard, "confidence-booster-course", 5, "You said confidence is currently low.");
      scoreCourse(scoreBoard, "refresher-driving-course", 3, "A calmer review format will help rebuild comfort.");
      scoreCourse(scoreBoard, "beginner-driving-course", 2, "Extra basics support is still useful while confidence is low.");
      break;
    case "needs-repetition":
      scoreCourse(scoreBoard, "confidence-booster-course", 2, "More repetition should help settle your driving.");
      scoreCourse(scoreBoard, "parking-course", 1, "Focused drills can help where repetition is needed.");
      break;
    case "mostly-confident":
      scoreCourse(scoreBoard, "defensive-driving-course", 1, "You may be ready for more skill-focused coaching.");
      scoreCourse(scoreBoard, "advanced-driving-course", 1, "Confidence can support higher-level training.");
      break;
  }

  switch (answers.primaryChallenge) {
    case "parking":
      scoreCourse(scoreBoard, "parking-course", 8, "Parking is the main area you want to improve.");
      break;
    case "road-rules":
      scoreCourse(scoreBoard, "knowledge-test-prep-course", 7, "Road rules and signs are your top priority.");
      break;
    case "test-routes":
      scoreCourse(scoreBoard, "road-test-prep-course", 7, "Road test route practice is your main focus.");
      scoreCourse(scoreBoard, "lesson-road-test-prep-course", 4, "A focused prep lesson supports your top need.");
      break;
    case "mock-test-feedback":
      scoreCourse(scoreBoard, "mock-test-evaluation", 7, "You want a realistic feedback session before the real test.");
      break;
    case "traffic-anxiety":
      scoreCourse(scoreBoard, "confidence-booster-course", 7, "Calmer confidence in traffic is your main need.");
      scoreCourse(scoreBoard, "refresher-driving-course", 3, "A review course can support that confidence work.");
      break;
    case "hazard-awareness":
      scoreCourse(scoreBoard, "defensive-driving-course", 7, "Hazard awareness is your highest-priority skill gap.");
      break;
    case "winter-weather":
      scoreCourse(scoreBoard, "winter-driving-course", 8, "Winter conditions are the main situation you want to handle better.");
      break;
    case "canadian-rules":
      scoreCourse(scoreBoard, "new-to-canada", 8, "Canadian driving rules are your top adjustment need.");
      break;
    case "precision-control":
      scoreCourse(scoreBoard, "advanced-driving-course", 6, "Precision control is the biggest skill upgrade you want.");
      break;
  }

  answers.challengeAreas.forEach((challenge) => {
    switch (challenge) {
      case "parking":
        scoreCourse(scoreBoard, "parking-course", 6, "You specifically want parking support.");
        break;
      case "road-rules":
        scoreCourse(scoreBoard, "knowledge-test-prep-course", 5, "You want help with rules and signs.");
        break;
      case "test-routes":
        scoreCourse(scoreBoard, "road-test-prep-course", 5, "You want targeted road test route practice.");
        scoreCourse(scoreBoard, "lesson-road-test-prep-course", 3, "A prep lesson can sharpen those routes.");
        break;
      case "mock-test-feedback":
        scoreCourse(scoreBoard, "mock-test-evaluation", 5, "You want direct feedback before the real test.");
        break;
      case "traffic-anxiety":
        scoreCourse(scoreBoard, "confidence-booster-course", 5, "You want help feeling calmer in traffic.");
        scoreCourse(scoreBoard, "refresher-driving-course", 3, "A review-focused lesson can lower anxiety.");
        break;
      case "hazard-awareness":
        scoreCourse(scoreBoard, "defensive-driving-course", 5, "Hazard awareness is a defensive driving need.");
        break;
      case "winter-weather":
        scoreCourse(scoreBoard, "winter-driving-course", 6, "You want help with winter road conditions.");
        break;
      case "canadian-rules":
        scoreCourse(scoreBoard, "new-to-canada", 6, "You want support with Canadian road rules.");
        break;
      case "precision-control":
        scoreCourse(scoreBoard, "advanced-driving-course", 4, "You want more precise control and technique.");
        break;
    }
  });

  switch (answers.lessonPreference) {
    case "structured-program":
      scoreCourse(scoreBoard, "beginner-driving-course", 3, "You prefer a fuller structured learning path.");
      scoreCourse(scoreBoard, "confidence-booster-course", 2, "A structured program often includes guided repetition.");
      break;
    case "targeted-improvement":
      scoreCourse(scoreBoard, "parking-course", 2, "You prefer focused lessons on specific weak areas.");
      scoreCourse(scoreBoard, "defensive-driving-course", 2, "Targeted improvement fits skill-specific coaching.");
      scoreCourse(scoreBoard, "refresher-driving-course", 2, "A review-style course fits that preference.");
      break;
    case "test-focused":
      scoreCourse(scoreBoard, "road-test-prep-course", 3, "You want lessons centered on test performance.");
      scoreCourse(scoreBoard, "lesson-road-test-prep-course", 3, "A combined prep lesson matches that preference.");
      scoreCourse(scoreBoard, "mock-test-evaluation", 2, "Mock testing supports a test-focused lesson plan.");
      break;
    case "custom-single-focus":
      scoreCourse(scoreBoard, "make-your-own-class", 6, "You prefer a custom lesson focused on one need.");
      break;
  }

  answers.specialSituations.forEach((situation) => {
    switch (situation) {
      case "new-to-canada":
        scoreCourse(scoreBoard, "new-to-canada", 5, "You identified as new to driving in Canada.");
        scoreCourse(scoreBoard, "defensive-driving-course", 2, "Local traffic awareness can help during that adjustment.");
        break;
      case "senior-driver":
        scoreCourse(scoreBoard, "seniors-driving-course", 6, "You want support tailored for senior drivers.");
        scoreCourse(scoreBoard, "refresher-driving-course", 2, "A review course pairs well with senior support.");
        break;
      case "want-custom-focus":
        scoreCourse(scoreBoard, "make-your-own-class", 5, "You want a custom lesson built around one focus area.");
        break;
      case "returning-after-break":
        scoreCourse(scoreBoard, "refresher-driving-course", 4, "You are coming back after time away from driving.");
        scoreCourse(scoreBoard, "confidence-booster-course", 2, "Confidence support often helps returning drivers.");
        break;
    }
  });

  if (answers.stage === "brand-new" || answers.primaryGoal === "start-learning" || answers.licenceStatus === "none") {
    ensureCourse(scoreBoard, mustInclude, "beginner-driving-course", 7, "A foundation course is essential for your current stage.");
  }

  if (answers.primaryGoal === "pass-knowledge-test" || answers.primaryChallenge === "road-rules" || answers.challengeAreas.includes("road-rules")) {
    ensureCourse(scoreBoard, mustInclude, "knowledge-test-prep-course", 7, "A rules-focused course matches your stated need.");
  }

  if (
    answers.primaryGoal === "pass-road-test" ||
    answers.roadTestTimeline === "within-30-days" ||
    answers.roadTestTimeline === "within-90-days" ||
    answers.primaryChallenge === "test-routes" ||
    answers.challengeAreas.includes("test-routes")
  ) {
    ensureCourse(scoreBoard, mustInclude, "road-test-prep-course", 8, "Road test prep should be part of your recommendation.");
    ensureCourse(scoreBoard, mustInclude, "mock-test-evaluation", 6, "A mock evaluation fits a road-test-focused student.");
  }

  if (
    answers.primaryGoal === "build-confidence" ||
    answers.primaryGoal === "refresh-skills" ||
    answers.confidenceLevel === "very-nervous" ||
    answers.specialSituations.includes("returning-after-break")
  ) {
    ensureCourse(scoreBoard, mustInclude, "confidence-booster-course", 5, "Confidence support is part of your stated need.");
  }

  if (
    answers.specialSituations.includes("new-to-canada") ||
    answers.licenceStatus === "international" ||
    answers.primaryChallenge === "canadian-rules" ||
    answers.challengeAreas.includes("canadian-rules")
  ) {
    ensureCourse(scoreBoard, mustInclude, "new-to-canada", 7, "Your answers show a need for local Canadian driving guidance.");
  }

  if (answers.primaryChallenge === "winter-weather" || answers.challengeAreas.includes("winter-weather")) {
    ensureCourse(scoreBoard, mustInclude, "winter-driving-course", 7, "Winter conditions are one of your focus areas.");
  }

  if (answers.specialSituations.includes("senior-driver")) {
    ensureCourse(scoreBoard, mustInclude, "seniors-driving-course", 7, "You asked for guidance tailored to senior drivers.");
  }

  if (answers.specialSituations.includes("want-custom-focus") || answers.challengeAreas.length >= 3) {
    ensureCourse(scoreBoard, mustInclude, "make-your-own-class", 5, "A custom lesson can target your mixed needs efficiently.");
  }

  const rankedIds = Object.entries(scoreBoard)
    .sort(([, a], [, b]) => b.score - a.score || a.reasons.length - b.reasons.length)
    .map(([courseId]) => courseId);

  const selectedIds: string[] = [];
  const pickCourse = (courseId: string) => {
    if (!selectedIds.includes(courseId)) {
      selectedIds.push(courseId);
    }
  };

  mustInclude.forEach(pickCourse);
  rankedIds.filter((courseId) => scoreBoard[courseId].score >= 4).forEach((courseId) => {
    if (selectedIds.length < 4) {
      pickCourse(courseId);
    }
  });
  rankedIds.forEach((courseId) => {
    if (selectedIds.length < 4 && scoreBoard[courseId].score > 0) {
      pickCourse(courseId);
    }
  });

  const primaryIds = selectedIds.slice(0, 4);
  const supportIds = rankedIds
    .filter((courseId) => !primaryIds.includes(courseId) && scoreBoard[courseId].score >= 3)
    .slice(0, 2);

  const toRecommendation = (courseId: string) => ({
    ...courseCatalogById[courseId],
    reasons: scoreBoard[courseId].reasons.slice(0, 2),
    score: scoreBoard[courseId].score,
  });

  const pathwayTitle = pathwayTitleMap[answers.primaryGoal] ?? "Personalized Course Path";

  return {
    pathwayTitle,
    summary: profileSummaryMap[answers.stage],
    primaryRecommendations: primaryIds.map(toRecommendation),
    supportRecommendations: supportIds.map(toRecommendation),
  };
};
