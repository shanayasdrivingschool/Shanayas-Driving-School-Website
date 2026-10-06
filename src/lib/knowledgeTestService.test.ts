import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fallbackKnowledgeTestQuestions,
  getKnowledgeTestQuestionOptionText,
  getRandomKnowledgeTestQuestions,
  KNOWLEDGE_TEST_QUESTION_COUNT,
} from "@/lib/knowledgeTestService";

describe("knowledge-test question bank", () => {
  it("contains 79 unique fallback questions", () => {
    const ids = fallbackKnowledgeTestQuestions.map((question) => question.id);
    const normalizedQuestions = fallbackKnowledgeTestQuestions.map((question) =>
      question.questionText.trim().toLocaleLowerCase("en-CA"),
    );

    expect(fallbackKnowledgeTestQuestions).toHaveLength(79);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(normalizedQuestions).size).toBe(normalizedQuestions.length);
  });

  it("provides four options, a valid answer, and an explanation for every question", () => {
    for (const question of fallbackKnowledgeTestQuestions) {
      expect(question.questionText.trim()).not.toBe("");
      expect(question.optionA.trim()).not.toBe("");
      expect(question.optionB.trim()).not.toBe("");
      expect(question.optionC.trim()).not.toBe("");
      expect(question.optionD.trim()).not.toBe("");
      expect(getKnowledgeTestQuestionOptionText(question, question.correctOption).trim()).not.toBe("");
      expect(question.explanation?.trim()).not.toBe("");
    }
  });

  it("returns all 79 questions in a shuffled session without changing the bank", () => {
    const originalOrder = fallbackKnowledgeTestQuestions.map((question) => question.id);
    const session = getRandomKnowledgeTestQuestions(fallbackKnowledgeTestQuestions);

    expect(session).toHaveLength(KNOWLEDGE_TEST_QUESTION_COUNT);
    expect(session).toHaveLength(fallbackKnowledgeTestQuestions.length);
    expect(new Set(session.map((question) => question.id)).size).toBe(session.length);
    expect(fallbackKnowledgeTestQuestions.map((question) => question.id)).toEqual(originalOrder);
  });

  it("includes every newly added fallback question in the production database migration", () => {
    const migration = [
      "supabase/migrations/20261006030000_add_researched_knowledge_test_questions.sql",
      "supabase/migrations/20261006040000_add_road_sign_knowledge_test_questions.sql",
      "supabase/migrations/20261006050000_add_rules_markings_knowledge_test_questions.sql",
    ]
      .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
      .join("\n");

    for (const question of fallbackKnowledgeTestQuestions.slice(13)) {
      expect(migration).toContain(question.questionText);
    }
  });
});
