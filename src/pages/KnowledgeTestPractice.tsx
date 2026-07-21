import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, CircleHelp, Clock3, GraduationCap, ListChecks, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AdminKnowledgeTestQuestionRecord, KnowledgeTestQuestionOptionKey } from "@/lib/affiliateTypes";
import {
  getFallbackKnowledgeTestQuestions,
  getKnowledgeTestQuestionOptionText,
  getKnowledgeTestQuestionOptions,
  getPublicKnowledgeTestQuestions,
  getRandomKnowledgeTestQuestions,
  KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS,
  KNOWLEDGE_TEST_QUESTION_COUNT,
  knowledgeTestQuestionCategoryLabels,
  knowledgeTestQuestionOptionLabels,
} from "@/lib/knowledgeTestService";

type PracticePhase = "ready" | "active" | "results";

const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const infoCards = [
  {
    title: "Multiple-choice questions",
    description: "Practice with multiple-choice questions from this site's independent study bank.",
    icon: <ListChecks className="h-5 w-5" />,
  },
  {
    title: "Instant score and review",
    description: "See your score, correct answers, and explanations right after you finish.",
    icon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    title: "Practice timer included",
    description: "Use an optional timer for study structure; this session does not reproduce the official test format.",
    icon: <Clock3 className="h-5 w-5" />,
  },
];

const knowledgeTestStrategies = [
  {
    title: "Start with the official source",
    description:
      "Study ICBC's Learn to Drive Smart guide first. ICBC says it contains the information needed for the Class 7 knowledge test.",
  },
  {
    title: "Master road signs by shape and colour",
    description:
      "Many questions test sign recognition. Learn what each shape and colour means so you can answer even unfamiliar signs correctly.",
  },
  {
    title: "Practise under a timer",
    description:
      "A timer can help you practise reading carefully. The official Class 7 test has 50 questions and a 45-minute limit; this tool uses a different format.",
  },
  {
    title: "Review every wrong answer",
    description:
      "After each session, read the explanation for anything you missed. Understanding why an answer is correct sticks better than memorising it.",
  },
  {
    title: "Revisit rules you miss",
    description:
      "When you miss a question, return to the matching section of the official guide and verify the rule before trying again.",
  },
  {
    title: "Check the available languages",
    description:
      "ICBC offers the Class 7 knowledge test in 12 languages. Check the current list and choose an available language you understand well.",
  },
];

const resultToneClassName = (isCorrect: boolean, wasAnswered: boolean) => {
  if (isCorrect) return "border-emerald-200 bg-emerald-50";
  if (!wasAnswered) return "border-amber-200 bg-amber-50";
  return "border-[#E6242A]/20 bg-[#E6242A]/5";
};

const KnowledgeTestPractice = () => {
  const questionsQuery = useQuery({
    queryKey: ["knowledge-test-questions"],
    queryFn: getPublicKnowledgeTestQuestions,
    initialData: getFallbackKnowledgeTestQuestions(),
    staleTime: 60_000,
  });
  const [phase, setPhase] = useState<PracticePhase>("ready");
  const [sessionQuestions, setSessionQuestions] = useState<AdminKnowledgeTestQuestionRecord[]>([]);
  const [answers, setAnswers] = useState<Record<string, KnowledgeTestQuestionOptionKey>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const availableQuestions = questionsQuery.data;
  const plannedQuestionCount = Math.min(KNOWLEDGE_TEST_QUESTION_COUNT, availableQuestions.length);
  const currentQuestion = sessionQuestions[currentIndex] ?? null;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredCount = Math.max(0, sessionQuestions.length - answeredCount);
  const score = useMemo(
    () =>
      sessionQuestions.reduce((total, question) => {
        if (answers[question.id] === question.correctOption) {
          return total + 1;
        }

        return total;
      }, 0),
    [answers, sessionQuestions],
  );
  const scorePercent = sessionQuestions.length > 0 ? Math.round((score / sessionQuestions.length) * 100) : 0;

  const startTest = () => {
    if (availableQuestions.length === 0) return;

    setSessionQuestions(getRandomKnowledgeTestQuestions(availableQuestions, KNOWLEDGE_TEST_QUESTION_COUNT));
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS);
    setSubmittedAt(null);
    setPhase("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitTest = () => {
    if (sessionQuestions.length === 0) return;

    setPhase("results");
    setSubmittedAt(new Date().toISOString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (phase !== "active" || sessionQuestions.length === 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeRemaining((currentValue) => {
        if (currentValue <= 1) {
          window.clearInterval(timerId);
          setPhase("results");
          setSubmittedAt(new Date().toISOString());
          return 0;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [phase, sessionQuestions.length]);

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Learner Practice"
        title={<span className="text-white">B.C. Class 7 Knowledge Test Practice</span>}
        description="Use independent learner-licence practice questions, then verify the rules with ICBC's official handbook and practice test."
        backgroundImage="/why-choose/knowledge-test-prep.webp"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 rounded-[28px] border border-amber-300 bg-amber-50 p-6 text-sm leading-relaxed text-amber-950 sm:text-base">
            <p className="font-black">Independent practice tool — not ICBC&apos;s official test</p>
            <p className="mt-2">
              The question bank is not supplied, reviewed, approved or endorsed by ICBC. Do not treat any question
              as an official live-test item. A practice score does not predict an official result. Study the{" "}
              <a
                href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2"
              >
                current Learn to Drive Smart guide
              </a>{" "}
              and use{" "}
              <a
                href="https://www.icbc.com/driver-licensing/new-drivers/practice-knowledge-test"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-2"
              >
                ICBC&apos;s official practice test
              </a>
              .
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
            <div className="space-y-5">
              <div className="rounded-[30px] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">How this works</p>
                <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Learn Through Practice</h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Use this independent question bank to review what you have studied, identify topics to revisit, and
                  read the available answer explanations. Check every uncertain rule against ICBC&apos;s current material.
                </p>

                <div className="mt-6 space-y-4">
                  {infoCards.map((card) => (
                    <article key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">{card.icon}</div>
                      <h3 className="mt-4 text-lg font-black text-slate-900">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[30px] border border-slate-200 bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F5B13A]">Question bank</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-3xl font-black">{availableQuestions.length}</p>
                    <p className="mt-1 text-sm text-white/75">Questions currently available</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">{plannedQuestionCount}</p>
                    <p className="mt-1 text-sm text-white/75">Questions per practice session</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">{Math.floor(KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS / 60)}</p>
                    <p className="mt-1 text-sm text-white/75">Minutes on the practice timer</p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-white/80">
                  This 20-question, 30-minute study session differs from ICBC&apos;s 50-question, 45-minute Class 7 test.
                  Continue with ICBC&apos;s official learner materials and practice test.
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              {phase === "ready" ? (
                <>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Practice session</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Start your knowledge test practice</h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Start a timed practice session with multiple-choice questions from our question bank. When you finish, you'll see your score, your answers, and the correct responses for review.
                  </p>

                  <div className="mt-8 rounded-3xl border border-slate-200 bg-[#F8FAFC] p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Session format</p>
                        <p className="mt-2 text-2xl font-black text-[#1d52a1]">{plannedQuestionCount} questions</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          Questions appear one at a time with four answer choices and a live progress indicator.
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">Review mode</p>
                        <p className="mt-2 text-2xl font-black text-[#1d52a1]">Instant scoring</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">
                          After submission, you can review correct answers and any explanations added by the admin team.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={startTest}
                      disabled={availableQuestions.length === 0}
                      className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Start Test
                    </button>
                    <p className="text-sm text-slate-500">
                      The system will use up to {KNOWLEDGE_TEST_QUESTION_COUNT} random questions from the current question bank.
                    </p>
                  </div>
                </>
              ) : null}

              {phase === "active" && currentQuestion ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Practice in progress</p>
                      <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                        Question {currentIndex + 1} of {sessionQuestions.length}
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-slate-700">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Practice timer</p>
                      <p className="mt-2 text-2xl font-black text-[#1d52a1]">{formatTimer(timeRemaining)}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-600">
                      <span>{answeredCount} answered</span>
                      <span>{unansweredCount} remaining</span>
                    </div>
                    <Progress value={((currentIndex + 1) / sessionQuestions.length) * 100} className="mt-3 h-2 bg-slate-200 [&>div]:bg-[#1d52a1]" />
                  </div>

                  <div className="mt-8 rounded-[28px] border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1d52a1]">
                        {knowledgeTestQuestionCategoryLabels[currentQuestion.category]}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{currentQuestion.questionText}</h3>

                    <RadioGroup
                      value={selectedAnswer ?? ""}
                      onValueChange={(value) =>
                        setAnswers((currentAnswers) => ({
                          ...currentAnswers,
                          [currentQuestion.id]: value as KnowledgeTestQuestionOptionKey,
                        }))
                      }
                      className="mt-6 gap-4"
                    >
                      {getKnowledgeTestQuestionOptions(currentQuestion).map((option) => {
                        const optionId = `${currentQuestion.id}-${option.key}`;
                        const isSelected = selectedAnswer === option.key;

                        return (
                          <label
                            key={option.key}
                            htmlFor={optionId}
                            className={`flex cursor-pointer items-start gap-4 rounded-3xl border p-4 transition-colors ${
                              isSelected ? "border-[#1d52a1] bg-[#1d52a1]/5" : "border-slate-200 bg-white hover:border-[#1d52a1]/30"
                            }`}
                          >
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0f172a] text-sm font-black text-white">
                              {option.label}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{option.text}</p>
                            </div>
                            <RadioGroupItem id={optionId} value={option.key} className="mt-1 border-[#1d52a1] text-[#1d52a1]" />
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                        disabled={currentIndex === 0}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Previous
                      </button>
                      {currentIndex < sessionQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentIndex((index) => Math.min(index + 1, sessionQuestions.length - 1))}
                          className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={submitTest}
                          className="inline-flex items-center justify-center rounded-full bg-[#E6242A] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                        >
                          Submit Test
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={submitTest}
                      className="inline-flex items-center justify-center rounded-full border border-[#E6242A] px-6 py-3 text-sm font-bold text-[#E6242A] transition-colors hover:bg-[#E6242A] hover:text-white"
                    >
                      Submit Now
                    </button>
                  </div>
                </>
              ) : null}

              {phase === "results" ? (
                <>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Results</p>
                      <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Your practice test score</h2>
                      <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                        Review the correct answers and explanations below to understand where you are strong and where you should study more.
                      </p>
                    </div>
                    <div className="rounded-[28px] bg-[#0f172a] px-6 py-5 text-white">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Score</p>
                      <p className="mt-2 text-4xl font-black">{score} / {sessionQuestions.length}</p>
                      <p className="mt-2 text-sm text-white/80">{scorePercent}% correct</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <article className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Answered</p>
                      <p className="mt-2 text-3xl font-black text-[#1d52a1]">{answeredCount}</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Correct</p>
                      <p className="mt-2 text-3xl font-black text-[#1d52a1]">{score}</p>
                    </article>
                    <article className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Completed</p>
                      <p className="mt-2 text-3xl font-black text-[#1d52a1]">
                        {submittedAt ? new Date(submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Now"}
                      </p>
                    </article>
                  </div>

                  <div className="mt-8 space-y-4">
                    {sessionQuestions.map((question, index) => {
                      const userAnswer = answers[question.id];
                      const isCorrect = userAnswer === question.correctOption;
                      const wasAnswered = Boolean(userAnswer);

                      return (
                        <article
                          key={question.id}
                          className={`rounded-[28px] border p-6 ${resultToneClassName(isCorrect, wasAnswered)}`}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Question {index + 1}</p>
                              <h3 className="mt-2 text-xl font-black text-slate-900">{question.questionText}</h3>
                            </div>
                            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                              {knowledgeTestQuestionCategoryLabels[question.category]}
                            </span>
                          </div>

                          <div className="mt-5 grid gap-3 md:grid-cols-2">
                            <div className="rounded-2xl bg-white/80 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Your answer</p>
                              <p className="mt-2 text-sm font-semibold text-slate-800">
                                {userAnswer
                                  ? `${knowledgeTestQuestionOptionLabels[userAnswer]}. ${getKnowledgeTestQuestionOptionText(question, userAnswer)}`
                                  : "Not answered"}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-white/80 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Correct answer</p>
                              <p className="mt-2 text-sm font-semibold text-slate-800">
                                {knowledgeTestQuestionOptionLabels[question.correctOption]}.{" "}
                                {getKnowledgeTestQuestionOptionText(question, question.correctOption)}
                              </p>
                            </div>
                          </div>

                          {question.explanation?.trim() ? (
                            <div className="mt-4 rounded-2xl bg-white/80 p-4">
                              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Explanation</p>
                              <p className="mt-2 text-sm leading-relaxed text-slate-700">{question.explanation}</p>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={startTest}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Retake Test
                    </button>
                    <Link
                      to="/courses/knowledge-test-prep-course"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <GraduationCap className="h-4 w-4" />
                      View Knowledge Test Prep Course
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[36px] border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Study smarter</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              ICBC knowledge test preparation strategies
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              The Class 7 knowledge test covers road signs, rules of the road, and safe-driving decisions. These
              suggestions organize study; they cannot guarantee a passing result or a particular number of attempts.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {knowledgeTestStrategies.map((strategy) => (
                <div key={strategy.title} className="rounded-3xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-black text-slate-900">{strategy.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Next step</p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Turn practice into confidence</h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Knowledge test practice is most effective when it is combined with steady study and clear feedback. If you want extra support, structured instruction can help you review signs, rules, and safe-driving decisions in a more focused way.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/courses/knowledge-test-prep-course"
                className="inline-flex items-center justify-center rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
              >
                Knowledge Test Prep Course
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default KnowledgeTestPractice;
