import type {
  AdminKnowledgeTestQuestionRecord,
  KnowledgeTestQuestionCategory,
  KnowledgeTestQuestionOptionKey,
} from "@/lib/affiliateTypes";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export const KNOWLEDGE_TEST_QUESTION_COUNT = 20;
export const KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS = 30 * 60;

export const KNOWLEDGE_TEST_QUESTION_SELECT =
  "id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, category, created_at, updated_at";

export const knowledgeTestQuestionOptionLabels: Record<KnowledgeTestQuestionOptionKey, string> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
};

export const knowledgeTestQuestionCategoryLabels: Record<KnowledgeTestQuestionCategory, string> = {
  road_signs: "Road Signs",
  rules_of_the_road: "Rules of the Road",
  hazard_awareness: "Hazard Awareness",
  safe_driving: "Safe Driving",
  road_markings: "Road Markings",
};

export const knowledgeTestQuestionCategories = Object.entries(knowledgeTestQuestionCategoryLabels).map(
  ([value, label]) => ({ value: value as KnowledgeTestQuestionCategory, label }),
);

export const getKnowledgeTestQuestionOptions = (question: AdminKnowledgeTestQuestionRecord) => [
  { key: "a" as const, label: knowledgeTestQuestionOptionLabels.a, text: question.optionA },
  { key: "b" as const, label: knowledgeTestQuestionOptionLabels.b, text: question.optionB },
  { key: "c" as const, label: knowledgeTestQuestionOptionLabels.c, text: question.optionC },
  { key: "d" as const, label: knowledgeTestQuestionOptionLabels.d, text: question.optionD },
];

export const fallbackKnowledgeTestQuestions: AdminKnowledgeTestQuestionRecord[] = [
  {
    id: "fallback-flashing-red-light",
    questionText: "What should you do when you approach a flashing red traffic light?",
    optionA: "Come to a complete stop, then proceed when it is safe",
    optionB: "Slow down and continue if no vehicles are coming",
    optionC: "Yield only to pedestrians",
    optionD: "Continue through the intersection because it is not a full red light",
    correctOption: "a",
    explanation: "A flashing red light is treated like a stop sign. You must stop completely and only continue when it is safe.",
    category: "rules_of_the_road",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-school-zone-speed",
    questionText: "What is the speed limit in a school zone in British Columbia unless a different speed is posted?",
    optionA: "30 km/h from 8 a.m. to 5 p.m. on school days",
    optionB: "40 km/h at all times",
    optionC: "50 km/h only when children are visible",
    optionD: "30 km/h only during lunch hour",
    correctOption: "a",
    explanation: "The school zone speed limit is 30 km/h from 8 a.m. to 5 p.m. on school days, unless signs show something different.",
    category: "road_signs",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-left-turn-green",
    questionText: "When you are turning left at a green light, who must you yield to?",
    optionA: "Only cyclists",
    optionB: "Oncoming traffic and pedestrians in the crosswalk",
    optionC: "Only vehicles already stopped at the light",
    optionD: "No one, because the light is green",
    correctOption: "b",
    explanation: "A green light does not give left-turning drivers priority over oncoming vehicles or pedestrians already crossing.",
    category: "rules_of_the_road",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-yellow-light",
    questionText: "What does a steady yellow traffic light mean?",
    optionA: "Speed up before the light turns red",
    optionB: "Stop only if another driver signals to you",
    optionC: "Stop unless you cannot do so safely",
    optionD: "Proceed because you still have the right-of-way",
    correctOption: "c",
    explanation: "A yellow light warns that the signal is about to turn red. You should stop unless it would be unsafe to do so.",
    category: "rules_of_the_road",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-following-distance",
    questionText: "In good conditions, what following distance should you maintain behind the vehicle ahead?",
    optionA: "At least two seconds",
    optionB: "At least one second",
    optionC: "At least five car lengths",
    optionD: "Exactly three seconds in all conditions",
    correctOption: "a",
    explanation: "The basic space cushion in good conditions is at least two seconds. Leave more time when conditions are poor.",
    category: "safe_driving",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-bad-weather-spacing",
    questionText: "What should you do to your following distance in rain, snow, or icy conditions?",
    optionA: "Keep the same distance because slower speeds are enough",
    optionB: "Increase your following distance",
    optionC: "Drive closer so other vehicles cannot cut in",
    optionD: "Use your horn more often instead of creating extra space",
    correctOption: "b",
    explanation: "Poor traction and visibility increase stopping distance. You should leave a larger safety gap in bad conditions.",
    category: "hazard_awareness",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-emergency-vehicle",
    questionText: "If an emergency vehicle with flashing lights and siren is approaching from behind, what should you do?",
    optionA: "Continue driving until you reach your destination",
    optionB: "Brake hard in your lane and stop immediately",
    optionC: "Pull over safely and stop so it can pass",
    optionD: "Speed up to stay ahead of the vehicle",
    correctOption: "c",
    explanation: "Move out of the way safely, pull over, and stop so the emergency vehicle has a clear path.",
    category: "hazard_awareness",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-yield-to-bus",
    questionText: "On a road with a speed limit of 50 km/h, what must you do when a transit bus with a yield-to-bus sign signals to leave a bus stop?",
    optionA: "Yield and let the bus re-enter traffic",
    optionB: "Pass the bus quickly before it moves",
    optionC: "Honk so the bus driver knows you are beside them",
    optionD: "Stop only if the bus driver waves you through",
    correctOption: "a",
    explanation: "In British Columbia, drivers must yield to a transit bus leaving a stop when the speed limit is 60 km/h or lower and the bus displays a yield sign.",
    category: "rules_of_the_road",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-no-devices",
    questionText: "What is the rule for electronic devices if you hold an L or N licence?",
    optionA: "You may use hands-free devices only on highways",
    optionB: "You may use a phone only while stopped at a red light",
    optionC: "You may not use electronic devices while driving",
    optionD: "You may use a phone if a passenger is helping you",
    correctOption: "c",
    explanation: "L and N drivers are not allowed to use electronic devices while driving, including hands-free devices.",
    category: "safe_driving",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-warning-sign-shape",
    questionText: "What does a diamond-shaped road sign usually mean?",
    optionA: "Warning about road conditions or hazards ahead",
    optionB: "School zone speed limit",
    optionC: "Mandatory stop",
    optionD: "Parking is allowed",
    correctOption: "a",
    explanation: "Diamond-shaped signs are warning signs. They alert drivers to curves, crossings, lane changes, and other road conditions ahead.",
    category: "road_signs",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-stop-line",
    questionText: "What does a solid white stop line at an intersection show you?",
    optionA: "Where you may start turning right",
    optionB: "Where you should stop before entering the intersection",
    optionC: "Where pedestrians must wait",
    optionD: "Where passing is permitted",
    correctOption: "b",
    explanation: "A stop line marks the point where your vehicle should stop before a stop sign, red light, or other controlled intersection.",
    category: "road_markings",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-yellow-centre-line",
    questionText: "What does a yellow centre line on the road separate?",
    optionA: "Traffic moving in the same direction",
    optionB: "A bike lane from vehicle traffic",
    optionC: "Traffic moving in opposite directions",
    optionD: "Parking from travel lanes",
    correctOption: "c",
    explanation: "Yellow lines are used to separate traffic travelling in opposite directions.",
    category: "road_markings",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
  {
    id: "fallback-crosswalk-pedestrian",
    questionText: "What must you do when a pedestrian is in a marked crosswalk?",
    optionA: "Continue if you believe they will wait",
    optionB: "Stop and yield until it is safe to proceed",
    optionC: "Honk so they cross faster",
    optionD: "Pass around them if the other lane is clear",
    correctOption: "b",
    explanation: "Drivers must yield to pedestrians in crosswalks and should not proceed until it is safe.",
    category: "safe_driving",
    createdAt: "2026-03-14T00:00:00.000Z",
    updatedAt: "2026-03-14T00:00:00.000Z",
  },
];

export const getKnowledgeTestQuestionOptionText = (
  question: AdminKnowledgeTestQuestionRecord,
  optionKey: KnowledgeTestQuestionOptionKey,
) =>
  (
    {
      a: question.optionA,
      b: question.optionB,
      c: question.optionC,
      d: question.optionD,
    } satisfies Record<KnowledgeTestQuestionOptionKey, string>
  )[optionKey];

const normalizeOptionKey = (value: unknown): KnowledgeTestQuestionOptionKey =>
  value === "b" || value === "c" || value === "d" ? value : "a";

export const mapKnowledgeTestQuestionRow = (row: Record<string, unknown>): AdminKnowledgeTestQuestionRecord => ({
  id: String(row.id),
  questionText: String(row.question_text),
  optionA: String(row.option_a),
  optionB: String(row.option_b),
  optionC: String(row.option_c),
  optionD: String(row.option_d),
  correctOption: normalizeOptionKey(row.correct_option),
  explanation: typeof row.explanation === "string" ? row.explanation : null,
  category: String(row.category) as KnowledgeTestQuestionCategory,
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
});

export const getFallbackKnowledgeTestQuestions = () => fallbackKnowledgeTestQuestions;

export const getPublicKnowledgeTestQuestions = async (): Promise<AdminKnowledgeTestQuestionRecord[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return getFallbackKnowledgeTestQuestions();
  }

  try {
    const { data, error } = await supabase
      .from("questions")
      .select(KNOWLEDGE_TEST_QUESTION_SELECT)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    if (rows.length === 0) {
      return getFallbackKnowledgeTestQuestions();
    }

    return rows.map(mapKnowledgeTestQuestionRow);
  } catch {
    return getFallbackKnowledgeTestQuestions();
  }
};

export const getRandomKnowledgeTestQuestions = (
  questions: AdminKnowledgeTestQuestionRecord[],
  count = KNOWLEDGE_TEST_QUESTION_COUNT,
) => {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};
