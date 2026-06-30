import type { ProductOutlineSection } from "@/data/productTypes";

export const courseModulesById: Record<string, ProductOutlineSection[]> = {
  "beginner-driving-course": [
    {
      title: "Vehicle basics",
      objectives: [
        "Set mirrors, seating, steering grip, and moving-off routines correctly from the start.",
        "Build smooth braking, acceleration, and lane positioning in quiet practice areas.",
      ],
    },
    {
      title: "Core road habits",
      objectives: [
        "Practice turns, observation checks, and speed control in low-pressure traffic.",
        "Develop safe scanning habits before lane changes, intersections, and stops.",
      ],
    },
    {
      title: "Early driving confidence",
      objectives: [
        "Increase comfort on local roads with repeatable lesson structure and instructor guidance.",
        "Strengthen awareness so beginner decisions feel calmer and more predictable.",
      ],
    },
  ],
  "knowledge-test-prep-course": [
    {
      title: "Road signs mastery",
      objectives: [
        "Recognize the most common warning, regulatory, and information signs quickly.",
        "Understand what each sign means in realistic learner-test scenarios.",
      ],
    },
    {
      title: "Rules and right-of-way",
      objectives: [
        "Review traffic rules, lane-use basics, and common right-of-way decisions.",
        "Reduce mistakes around intersections, pedestrians, and common written-test traps.",
      ],
    },
    {
      title: "Mock exam readiness",
      objectives: [
        "Practice with exam-style questions until rule recall becomes more consistent.",
        "Identify weak topics early and revise them before the real knowledge test.",
      ],
    },
  ],
  "parking-course": [
    {
      title: "Stall parking control",
      objectives: [
        "Improve steering timing, alignment, and slow-speed accuracy in stall parking.",
        "Practice entering and exiting spaces without panic or overcorrection.",
      ],
    },
    {
      title: "Parallel parking routine",
      objectives: [
        "Break parallel parking into repeatable steps that are easier to remember.",
        "Use reference points and mirror checks to improve consistency beside the curb.",
      ],
    },
    {
      title: "Low-speed accuracy",
      objectives: [
        "Strengthen clutch-free, low-speed control in tight maneuvering situations.",
        "Build confidence in reverse control, space judgment, and tight turns.",
      ],
    },
  ],
  "make-your-own-class": [
    {
      title: "Personalized focus",
      objectives: [
        "Choose the exact lesson topic that needs the most help right now.",
        "Build a one-off lesson plan around the student’s current weak spot or goal.",
      ],
    },
    {
      title: "Targeted repetition",
      objectives: [
        "Use the full lesson time on one skill instead of splitting attention across topics.",
        "Repeat the selected maneuver or route pattern until it feels more controlled.",
      ],
    },
    {
      title: "Next-step clarity",
      objectives: [
        "Leave with clearer feedback on what improved and what still needs repetition.",
        "Use the lesson to decide whether more custom work or a full course is the better fit.",
      ],
    },
  ],
  "lesson-road-test-prep-course": [
    {
      title: "Warm-up correction",
      objectives: [
        "Use a pre-test lesson to fix the mistakes most likely to cost marks.",
        "Tighten observations, positioning, and control before test pressure increases.",
      ],
    },
    {
      title: "Route execution",
      objectives: [
        "Practice realistic route decisions, lane choices, and maneuver timing.",
        "Reinforce the standard expected during turns, stops, shoulder checks, and parking.",
      ],
    },
    {
      title: "Final readiness",
      objectives: [
        "Finish with a short, practical action plan for the hours before the road test.",
        "Reduce last-minute uncertainty with structured final feedback and repetition.",
      ],
    },
  ],
  "road-test-prep-course": [
    {
      title: "Test criteria review",
      objectives: [
        "Understand how the examiner will evaluate control, observations, and judgment.",
        "Focus practice on the standards that matter most on the actual test.",
      ],
    },
    {
      title: "Maneuver accuracy",
      objectives: [
        "Rehearse turns, parking, speed management, and lane positioning with precision.",
        "Reduce avoidable errors in the maneuvers that commonly create deductions.",
      ],
    },
    {
      title: "ICBC route readiness",
      objectives: [
        "Practice in a way that reflects real local test conditions and route pressure.",
        "Build enough consistency that exam-day driving feels calmer and more controlled.",
      ],
    },
  ],
  "new-to-canada": [
    {
      title: "Local rule adjustment",
      objectives: [
        "Learn the road rules and sign meanings that differ from previous driving experience.",
        "Understand local expectations around right-of-way, school zones, and intersections.",
      ],
    },
    {
      title: "Canadian traffic habits",
      objectives: [
        "Adapt to local driving culture, spacing, lane use, and hazard awareness.",
        "Practice the observation habits expected during daily driving and road tests here.",
      ],
    },
    {
      title: "Practical confidence",
      objectives: [
        "Use familiar local routes to build comfort under real Canadian road conditions.",
        "Turn prior experience into safer, rule-aligned local driving decisions.",
      ],
    },
  ],
  "defensive-driving-course": [
    {
      title: "Hazard scanning",
      objectives: [
        "Improve forward planning and spot hazards earlier in busy driving environments.",
        "Strengthen visual scanning so risk is identified before it becomes urgent.",
      ],
    },
    {
      title: "Space management",
      objectives: [
        "Use safer following distance, lane position, and timing around surrounding traffic.",
        "Reduce pressure from other drivers by making calmer spacing decisions.",
      ],
    },
    {
      title: "Risk response",
      objectives: [
        "Practice safer reactions to unpredictable traffic, merging, and sudden conflict points.",
        "Build a more proactive driving style instead of reacting late to danger.",
      ],
    },
  ],
  "refresher-driving-course": [
    {
      title: "Skill reset",
      objectives: [
        "Revisit the core habits that may have become rusty after time away from driving.",
        "Clean up small mistakes in steering, positioning, and basic road judgment.",
      ],
    },
    {
      title: "Confidence rebuild",
      objectives: [
        "Use guided practice to reduce hesitation and rebuild comfort behind the wheel.",
        "Regain trust in everyday driving decisions through structured repetition.",
      ],
    },
    {
      title: "Everyday route consistency",
      objectives: [
        "Practice real driving tasks that matter for normal day-to-day independence.",
        "Leave with a clear picture of what is already solid and what still needs work.",
      ],
    },
  ],
  "mock-test-evaluation": [
    {
      title: "Simulated assessment",
      objectives: [
        "Experience a realistic mock test instead of guessing how ready you really are.",
        "Measure current performance under exam-style route and timing pressure.",
      ],
    },
    {
      title: "Error review",
      objectives: [
        "Identify the exact mistakes that are most likely to cause trouble on test day.",
        "Separate minor habits from the issues that need immediate correction.",
      ],
    },
    {
      title: "Correction plan",
      objectives: [
        "Turn mock feedback into a short, practical improvement plan before the real test.",
        "Use the evaluation to decide whether another prep lesson is needed or not.",
      ],
    },
  ],
  "confidence-booster-course": [
    {
      title: "Calmer driving mindset",
      objectives: [
        "Reduce nerves by building a more stable routine before and during the drive.",
        "Practice staying composed when traffic, turns, or parking begin to feel stressful.",
      ],
    },
    {
      title: "Controlled repetition",
      objectives: [
        "Repeat the driving situations that create the most hesitation until they feel manageable.",
        "Use guided practice to replace panic responses with calmer, safer habits.",
      ],
    },
    {
      title: "Independent confidence",
      objectives: [
        "Increase trust in your own judgment during normal road situations.",
        "Finish with stronger comfort on local routes, intersections, and traffic flow.",
      ],
    },
  ],
  "advanced-driving-course": [
    {
      title: "Precision vehicle control",
      objectives: [
        "Refine steering, positioning, and control accuracy beyond the beginner stage.",
        "Practice smoother input and better judgment in more demanding situations.",
      ],
    },
    {
      title: "Complex traffic strategy",
      objectives: [
        "Strengthen planning around dense traffic, lane changes, and higher-speed roads.",
        "Make smarter, earlier decisions in situations that require sharper timing.",
      ],
    },
    {
      title: "Safer high-demand driving",
      objectives: [
        "Improve control when road conditions or traffic complexity increase.",
        "Build a more polished driving style that stays safe under added pressure.",
      ],
    },
  ],
  "winter-driving-course": [
    {
      title: "Traction management",
      objectives: [
        "Understand how snow and ice affect braking distance, steering, and grip.",
        "Practice smoother control to reduce skids and overcorrection in winter conditions.",
      ],
    },
    {
      title: "Low-visibility judgment",
      objectives: [
        "Improve decisions when visibility drops because of weather, spray, or darkness.",
        "Use better spacing and speed choices when conditions become unpredictable.",
      ],
    },
    {
      title: "Winter response skills",
      objectives: [
        "Build safer habits for hills, stops, and lane changes in seasonal conditions.",
        "Leave with more confidence handling common winter-road risks.",
      ],
    },
  ],
  "seniors-driving-course": [
    {
      title: "Comfort and vehicle setup",
      objectives: [
        "Adjust seating, mirrors, and vehicle position for better comfort and visibility.",
        "Reduce strain so normal driving tasks feel more manageable and controlled.",
      ],
    },
    {
      title: "Awareness and reaction timing",
      objectives: [
        "Refresh scanning habits and timing around intersections, pedestrians, and traffic changes.",
        "Practice safer response decisions at a pace that matches current comfort.",
      ],
    },
    {
      title: "Ongoing safe independence",
      objectives: [
        "Reinforce the habits that support confident, independent driving for longer.",
        "Review any rules or maneuvers that need updating before returning to regular driving.",
      ],
    },
  ],
};
