/** Presentation copy only. Prices and durations come from the existing catalogue. */
export const paidLandingOffers: Record<string, {
  title: string;
  description: string;
  highlights: string[];
  duration?: string;
}> = {
  "road-test-prep-course": {
    title: "Road-Test Preparation Lessons",
    description: "Focused instruction to help you prepare for your road test.",
    highlights: ["Personalised driving practice", "Focus on areas requiring improvement", "Feedback on road-test driving skills"],
  },
  "mock-test-evaluation": {
    title: "Mock Road-Test Evaluation",
    description: "Practise in a test-style evaluation and discuss what to work on next.",
    highlights: ["Practice evaluation", "Feedback on strengths and areas to improve", "A school evaluation, separate from the ICBC test"],
  },
  "lesson-road-test-prep-course": {
    title: "Road-Test Day Package",
    description: "Road-test preparation and use of the school car for your ICBC road test.",
    duration: "Preparation + test-day car rental",
    highlights: ["Test-day vehicle, subject to availability", "Confirm preparation timing and test location before booking", "Additional practice lessons priced separately"],
  },
  "beginner-driving-course": {
    title: "Beginner’s Driving Course",
    description: "Structured lessons for drivers learning the fundamentals.",
    highlights: ["Basic vehicle control", "Road awareness and traffic rules", "Practice suited to your starting point"],
  },
  "make-your-own-class": {
    title: "Personalised Driving Lesson",
    description: "Choose a lesson focused on the areas where you would like support.",
    duration: "1 × 90-minute lesson",
    highlights: ["Choose your lesson focus", "Individual feedback", "Discuss your goals before booking"],
  },
  "parking-course": {
    title: "Parking Course",
    description: "Dedicated time to practise parking and low-speed vehicle control.",
    highlights: ["Parallel parking", "Stall parking", "Low-speed control"],
  },
  "refresher-driving-course": {
    title: "Refresher Driving Lessons",
    description: "Revisit your driving skills after a break or prepare for a return to regular driving.",
    highlights: ["Review core driving skills", "Discuss areas you find difficult", "Personalised feedback"],
  },
  "confidence-booster-course": {
    title: "Confidence Booster Course",
    description: "Structured practice for drivers with basic skills who want more support.",
    highlights: ["Time to practise existing skills", "Discuss your pace with the instructor", "Feedback on your progress"],
  },
};
