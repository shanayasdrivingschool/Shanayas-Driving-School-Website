/** Owner-supplied offer and Class 5/7, no-expiry and unsuccessful-test
 * definitions confirmed 2026-11-23. See ROAD_TEST_CONFIDENCE_NOTES.md. */
export const roadTestConfidenceProgramme = {
  lessonMinutes: 90,
  initialHours: 15,
  maximumHours: 30,
  maximumAttempts: 4,
  conditions: "For Class 5 and Class 7 road-test preparation, with no package expiry date. Start with 15 hours. An unsuccessful test means a failed ICBC road test; the next included lesson block becomes available after that result. Conditional support ends when you pass or after the fourth covered attempt. ICBC fees are separate; passing is not guaranteed.",
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
    { attempt: 2, lessons: 5, hours: 7.5, title: "5 more lessons", condition: "If your first ICBC road test is unsuccessful", detail: "Additional coaching before your second covered attempt, included in your package." },
    { attempt: 3, lessons: 3, hours: 4.5, title: "3 more lessons", condition: "If your second ICBC road test is unsuccessful", detail: "Another block of included coaching before your third covered attempt." },
    { attempt: 4, lessons: 2, hours: 3, title: "2 more lessons", condition: "If your third ICBC road test is unsuccessful", detail: "A final block of included coaching before your fourth covered attempt." },
  ],
};
