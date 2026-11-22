/** Owner-supplied offer, 2026-11-23. Eligibility/expiry details are tracked in
 * Leads-and-conversion/ROAD_TEST_CONFIDENCE_NOTES.md, not invented here. */
export const roadTestConfidenceProgramme = {
  lessonMinutes: 90,
  initialHours: 15,
  maximumHours: 30,
  maximumAttempts: 4,
  conditions: "Start with 15 hours. Up to 15 additional hours become available after unsuccessful qualifying tests. Conditional support ends when you pass or after the fourth covered attempt. ICBC fees are separate; passing is not guaranteed.",
  packages: [
    {
      id: "road-test-confidence",
      name: "Road Test Confidence",
      price: 1999,
      label: "Training support",
      description: "Choose this option if you will arrange your own vehicle for road tests.",
      testCar: "Road-test vehicle rental is separate.",
      includesTestCar: false,
    },
    {
      id: "road-test-confidence-plus",
      name: "Road Test Confidence Plus",
      price: 2599,
      label: "Training + test-day car",
      description: "Choose this option if you want the school car for your covered road tests.",
      testCar: "School car for the first covered test and up to three retries after unsuccessful tests, subject to booking and coverage rules.",
      includesTestCar: true,
    },
  ],
  stages: [
    { attempt: 1, lessons: 10, hours: 15, title: "Start with 10 lessons", condition: "Your initial training", detail: "Ten private 90-minute lessons to work on your driving skills and road-test preparation." },
    { attempt: 2, lessons: 5, hours: 7.5, title: "5 more lessons", condition: "If your first qualifying test is unsuccessful", detail: "Additional coaching before your second covered attempt, included in your package." },
    { attempt: 3, lessons: 3, hours: 4.5, title: "3 more lessons", condition: "If your second qualifying test is unsuccessful", detail: "Another block of included coaching before your third covered attempt." },
    { attempt: 4, lessons: 2, hours: 3, title: "2 more lessons", condition: "If your third qualifying test is unsuccessful", detail: "A final block of included coaching before your fourth covered attempt." },
  ],
};
