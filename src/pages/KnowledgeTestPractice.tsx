import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  GraduationCap,
  ListChecks,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
type ResultsFilter = "all" | "review";

const TIMER_WARNING_SECONDS = 5 * 60;
const TIMER_CRITICAL_SECONDS = 60;

const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The site header is fixed, so scrolling an element to y=0 would tuck it underneath.
const scrollElementIntoView = (element: HTMLElement | null) => {
  if (!element) return;

  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

  window.scrollTo({ top: Math.max(top, 0), behavior: prefersReducedMotion() ? "auto" : "smooth" });
};

const howItWorks = [
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

type ResultStatus = "correct" | "incorrect" | "skipped";

const resultStatusMeta: Record<
  ResultStatus,
  { label: string; icon: typeof CheckCircle2; iconClass: string; textClass: string }
> = {
  correct: { label: "Correct", icon: CheckCircle2, iconClass: "text-emerald-600", textClass: "text-emerald-700" },
  incorrect: { label: "Incorrect", icon: XCircle, iconClass: "text-[#E6242A]", textClass: "text-[#E6242A]" },
  skipped: { label: "Skipped", icon: CircleHelp, iconClass: "text-amber-600", textClass: "text-amber-700" },
};

const eyebrowClass = "text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]";
const labelClass = "text-xs font-semibold uppercase tracking-[0.16em] text-slate-500";
const headingClass = "text-3xl font-black text-slate-900 sm:text-4xl";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultsFilter, setResultsFilter] = useState<ResultsFilter>("all");
  const [expandedResults, setExpandedResults] = useState<Record<string, boolean>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const availableQuestions = questionsQuery.data;
  const plannedQuestionCount = Math.min(KNOWLEDGE_TEST_QUESTION_COUNT, availableQuestions.length);
  const currentQuestion = sessionQuestions[currentIndex] ?? null;
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const unansweredCount = Math.max(0, sessionQuestions.length - answeredCount);
  const isLastQuestion = currentIndex === sessionQuestions.length - 1;
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

  const getResultStatus = (question: AdminKnowledgeTestQuestionRecord): ResultStatus => {
    const userAnswer = answers[question.id];
    if (!userAnswer) return "skipped";
    return userAnswer === question.correctOption ? "correct" : "incorrect";
  };

  const reviewQuestions = useMemo(
    () => sessionQuestions.filter((question) => answers[question.id] !== question.correctOption),
    [answers, sessionQuestions],
  );
  const visibleResults = resultsFilter === "review" ? reviewQuestions : sessionQuestions;

  const finishSession = (questions: AdminKnowledgeTestQuestionRecord[] = sessionQuestions) => {
    const needsReview = questions.filter((question) => answers[question.id] !== question.correctOption);
    // Every row starts collapsed; the reader opens what they want to read.
    setExpandedResults({});
    setResultsFilter(needsReview.length > 0 ? "review" : "all");
    setPhase("results");
    setSubmittedAt(new Date().toISOString());
  };

  const startTest = () => {
    if (availableQuestions.length === 0) return;

    setSessionQuestions(getRandomKnowledgeTestQuestions(availableQuestions, KNOWLEDGE_TEST_QUESTION_COUNT));
    setAnswers({});
    setCurrentIndex(0);
    setTimeRemaining(KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS);
    setSubmittedAt(null);
    setExpandedResults({});
    setResultsFilter("all");
    setPhase("active");
    scrollElementIntoView(panelRef.current);
  };

  const requestSubmit = () => {
    if (sessionQuestions.length === 0) return;

    if (unansweredCount > 0) {
      setConfirmOpen(true);
      return;
    }

    finishSession();
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

  const timerTone =
    timeRemaining <= TIMER_CRITICAL_SECONDS
      ? "text-[#E6242A]"
      : timeRemaining <= TIMER_WARNING_SECONDS
        ? "text-amber-600"
        : "text-[#1d52a1]";

  return (
    <main className="bg-white text-[#202121]">
      {/* Hero: solid brand band, matching the blog header */}
      <section className="relative bg-[#1d52a1] text-white">
        <SiteHeader tone="brand" />
        <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Link to="/" className="text-white/80 transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white/55">Knowledge Test Practice</span>
          </nav>

          <h1
            className="mx-auto mt-4 max-w-3xl text-center text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.1]"
            style={{ textWrap: "balance" }}
          >
            B.C. Class 7 Knowledge Test Practice
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-white/80">
            Use independent learner-licence practice questions, then verify the rules with ICBC&apos;s official
            handbook and practice test.
          </p>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-8 border-l-4 border-amber-400 bg-amber-50/70 py-4 pl-5 pr-4 text-sm leading-relaxed text-amber-950">
            <p className="font-bold">Independent practice tool — not ICBC&apos;s official test</p>
            <p className="mt-1.5">
              The question bank is not supplied, reviewed, approved or endorsed by ICBC. Do not treat any question
              as an official live-test item. A practice score does not predict an official result. Study the{" "}
              <a
                href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                current Learn to Drive Smart guide
              </a>{" "}
              and use{" "}
              <a
                href="https://www.icbc.com/driver-licensing/new-drivers/practice-knowledge-test"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline underline-offset-2"
              >
                ICBC&apos;s official practice test
              </a>
              .
            </p>
          </div>

          {/* The one card on the page: the interactive panel. */}
          <div
            ref={panelRef}
            className="scroll-mt-28 rounded-[20px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
              {phase === "ready" ? (
                <>
                  <p className={eyebrowClass}>Practice session</p>
                  <h2 className={`mt-3 ${headingClass}`}>Start your knowledge test practice</h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                    Start a timed practice session with multiple-choice questions from our question bank. When you
                    finish, you&apos;ll see your score, your answers, and the correct responses for review.
                  </p>

                  <div className="mt-8 grid gap-6 border-y border-slate-200 py-6 sm:grid-cols-2 sm:gap-8 sm:divide-x sm:divide-slate-200">
                    <div>
                      <p className={labelClass}>Session format</p>
                      <p className="mt-2 text-2xl font-bold text-[#1d52a1]">{plannedQuestionCount} questions</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        Questions appear one at a time with four answer choices and a live progress indicator.
                      </p>
                    </div>
                    <div className="sm:pl-8">
                      <p className={labelClass}>Review mode</p>
                      <p className="mt-2 text-2xl font-bold text-[#1d52a1]">Instant scoring</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        After submission, you can review correct answers and any explanations added by the admin team.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={startTest}
                      disabled={availableQuestions.length === 0}
                      className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Start Test
                    </button>
                    <p className="text-sm text-slate-500">
                      Up to {KNOWLEDGE_TEST_QUESTION_COUNT} random questions from the current question bank.
                    </p>
                  </div>
                </>
              ) : null}

              {phase === "active" && currentQuestion ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className={eyebrowClass}>Practice in progress</p>
                      <h2 className={`mt-3 ${headingClass}`}>
                        Question {currentIndex + 1} of {sessionQuestions.length}
                      </h2>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className={labelClass}>Practice timer</p>
                      <p
                        role="timer"
                        aria-live={timeRemaining <= TIMER_WARNING_SECONDS ? "polite" : "off"}
                        aria-atomic="true"
                        className={`mt-1 text-3xl font-bold tabular-nums ${timerTone}`}
                      >
                        {formatTimer(timeRemaining)}
                      </p>
                      {timeRemaining <= TIMER_WARNING_SECONDS ? (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
                          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                          Auto-submits at 00:00
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-600">
                      <span>
                        {answeredCount} of {sessionQuestions.length} answered
                      </span>
                      <span>{unansweredCount} remaining</span>
                    </div>
                    <Progress
                      value={(answeredCount / sessionQuestions.length) * 100}
                      className="mt-3 h-2 bg-slate-200 [&>div]:bg-[#1d52a1]"
                    />
                  </div>

                  <nav aria-label="Jump to question" className="mt-5">
                    <ul className="flex flex-wrap gap-2">
                      {sessionQuestions.map((question, index) => {
                        const isAnswered = Boolean(answers[question.id]);
                        const isCurrent = index === currentIndex;

                        return (
                          <li key={question.id}>
                            <button
                              type="button"
                              onClick={() => setCurrentIndex(index)}
                              aria-current={isCurrent ? "true" : undefined}
                              aria-label={`Question ${index + 1}, ${isAnswered ? "answered" : "not answered"}`}
                              className={`h-10 w-10 rounded-xl text-sm font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2 ${
                                isAnswered
                                  ? "bg-[#1d52a1] text-white hover:bg-[#17488d]"
                                  : "border border-slate-300 bg-white text-slate-600 hover:border-[#1d52a1] hover:text-[#1d52a1]"
                              } ${isCurrent ? "ring-2 ring-[#1d52a1] ring-offset-2" : ""}`}
                            >
                              {index + 1}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="mt-8 border-t border-slate-200 pt-8">
                    <span className="inline-flex rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d52a1]">
                      {knowledgeTestQuestionCategoryLabels[currentQuestion.category]}
                    </span>
                    <h3 className="mt-4 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">
                      {currentQuestion.questionText}
                    </h3>

                    <RadioGroup
                      value={selectedAnswer ?? ""}
                      onValueChange={(value) =>
                        setAnswers((currentAnswers) => ({
                          ...currentAnswers,
                          [currentQuestion.id]: value as KnowledgeTestQuestionOptionKey,
                        }))
                      }
                      className="mt-6 gap-3"
                    >
                      {getKnowledgeTestQuestionOptions(currentQuestion).map((option) => {
                        const optionId = `${currentQuestion.id}-${option.key}`;
                        const isSelected = selectedAnswer === option.key;

                        return (
                          <label
                            key={option.key}
                            htmlFor={optionId}
                            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-[#1d52a1] focus-within:ring-offset-2 ${
                              isSelected
                                ? "border-[#1d52a1] bg-[#1d52a1]/5"
                                : "border-slate-200 bg-white hover:border-[#1d52a1]/40 hover:bg-slate-50"
                            }`}
                          >
                            <RadioGroupItem id={optionId} value={option.key} className="sr-only" />
                            <span
                              aria-hidden="true"
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                                isSelected ? "bg-[#1d52a1] text-white" : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {option.label}
                            </span>
                            <span className="flex-1 text-sm leading-relaxed text-slate-700 sm:text-base">
                              {option.text}
                            </span>
                            {isSelected ? (
                              <Check className="h-5 w-5 shrink-0 text-[#1d52a1]" aria-hidden="true" />
                            ) : null}
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                        disabled={currentIndex === 0}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentIndex((index) => Math.min(index + 1, sessionQuestions.length - 1))
                        }
                        disabled={isLastQuestion}
                        className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                          isLastQuestion
                            ? "border border-slate-300 text-slate-700 focus-visible:ring-slate-400"
                            : "bg-[#1d52a1] text-white hover:bg-[#17488d] focus-visible:ring-[#1d52a1]"
                        }`}
                      >
                        Next
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={requestSubmit}
                      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E6242A] focus-visible:ring-offset-2 ${
                        isLastQuestion
                          ? "bg-[#E6242A] text-white hover:bg-[#C41E23]"
                          : "text-[#E6242A] hover:bg-[#E6242A]/5"
                      }`}
                    >
                      Finish practice
                    </button>
                  </div>
                </>
              ) : null}

              {phase === "results" ? (
                <>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className={eyebrowClass}>Results</p>
                      <h2 className={`mt-3 ${headingClass}`}>Your practice test score</h2>
                    </div>
                    <div className="shrink-0 sm:text-right">
                      <p className="text-5xl font-black tabular-nums text-[#1d52a1]">
                        {score}
                        <span className="text-2xl text-slate-400">/{sessionQuestions.length}</span>
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{scorePercent}% correct</p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-y border-slate-200 py-5 text-center sm:text-left">
                    <div>
                      <p className={labelClass}>Answered</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{answeredCount}</p>
                    </div>
                    <div>
                      <p className={labelClass}>Needs review</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{reviewQuestions.length}</p>
                    </div>
                    <div>
                      <p className={labelClass}>Completed</p>
                      <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                        {submittedAt
                          ? new Date(submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Now"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter results">
                    {(
                      [
                        { key: "review" as const, label: `Needs review (${reviewQuestions.length})` },
                        { key: "all" as const, label: `All questions (${sessionQuestions.length})` },
                      ]
                    ).map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setResultsFilter(option.key)}
                        aria-pressed={resultsFilter === option.key}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2 ${
                          resultsFilter === option.key
                            ? "bg-[#1d52a1] text-white"
                            : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {visibleResults.length === 0 ? (
                    <p className="mt-8 rounded-xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
                      Nothing to review — you answered every question correctly.
                    </p>
                  ) : (
                    <ul className="mt-6 divide-y divide-slate-200 border-t border-slate-200">
                      {visibleResults.map((question) => {
                        const originalIndex = sessionQuestions.indexOf(question);
                        const userAnswer = answers[question.id];
                        const status = getResultStatus(question);
                        const meta = resultStatusMeta[status];
                        const StatusIcon = meta.icon;
                        const isExpanded = Boolean(expandedResults[question.id]);
                        const panelId = `result-panel-${question.id}`;

                        return (
                          <li key={question.id}>
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedResults((current) => ({
                                  ...current,
                                  [question.id]: !current[question.id],
                                }))
                              }
                              aria-expanded={isExpanded}
                              aria-controls={panelId}
                              className="flex w-full items-start gap-4 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2"
                            >
                              <StatusIcon
                                className={`mt-0.5 h-5 w-5 shrink-0 ${meta.iconClass}`}
                                aria-hidden="true"
                              />
                              <span className="flex-1">
                                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                  <span className={labelClass}>Question {originalIndex + 1}</span>
                                  <span className={`text-xs font-bold uppercase tracking-wide ${meta.textClass}`}>
                                    {meta.label}
                                  </span>
                                </span>
                                <span className="mt-1.5 block text-base font-semibold leading-snug text-slate-900">
                                  {question.questionText}
                                </span>
                              </span>
                              <ChevronDown
                                className={`mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform motion-reduce:transition-none ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                              />
                            </button>

                            {isExpanded ? (
                              <div id={panelId} className="space-y-4 pb-6 pl-9 pr-2 text-sm">
                                <div>
                                  <p className={labelClass}>Your answer</p>
                                  <p className="mt-1 leading-relaxed text-slate-700">
                                    {userAnswer
                                      ? `${knowledgeTestQuestionOptionLabels[userAnswer]}. ${getKnowledgeTestQuestionOptionText(question, userAnswer)}`
                                      : "Not answered"}
                                  </p>
                                </div>
                                <div>
                                  <p className={labelClass}>Correct answer</p>
                                  <p className="mt-1 font-semibold leading-relaxed text-slate-900">
                                    {knowledgeTestQuestionOptionLabels[question.correctOption]}.{" "}
                                    {getKnowledgeTestQuestionOptionText(question, question.correctOption)}
                                  </p>
                                </div>
                                {question.explanation?.trim() ? (
                                  <div>
                                    <p className={labelClass}>Explanation</p>
                                    <p className="mt-1 leading-relaxed text-slate-700">{question.explanation}</p>
                                  </div>
                                ) : null}
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  {knowledgeTestQuestionCategoryLabels[question.category]}
                                </p>
                              </div>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={startTest}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Retake Test
                    </button>
                    <Link
                      to="/courses/knowledge-test-prep-course"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <GraduationCap className="h-4 w-4" aria-hidden="true" />
                      View Knowledge Test Prep Course
                    </Link>
                  </div>
                </>
              ) : null}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>How this works</p>
          <h2 className={`mt-3 ${headingClass}`}>Learn Through Practice</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Use this independent question bank to review what you have studied, identify topics to revisit, and read
            the available answer explanations. Check every uncertain rule against ICBC&apos;s current material.
          </p>

          <div className="mt-10 grid gap-x-12 sm:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.title} className="border-t border-slate-300 py-6">
                <span className="text-[#1d52a1]" aria-hidden="true">
                  {item.icon}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-slate-600">
            The bank currently holds {availableQuestions.length}{" "}
            {availableQuestions.length === 1 ? "question" : "questions"}, and each session draws{" "}
            {plannedQuestionCount} of them with a{" "}
            {Math.floor(KNOWLEDGE_TEST_PRACTICE_TIMER_SECONDS / 60)}-minute timer. That differs from ICBC&apos;s
            50-question, 45-minute Class 7 test — continue with ICBC&apos;s official learner materials and practice
            test.
          </p>
        </div>
      </section>

      <section className="bg-[#F8FAFC] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Study smarter</p>
          <h2 className={`mt-3 ${headingClass}`}>ICBC knowledge test preparation strategies</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            The Class 7 knowledge test covers road signs, rules of the road, and safe-driving decisions. These
            suggestions organize study; they cannot guarantee a passing result or a particular number of attempts.
          </p>
          <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {knowledgeTestStrategies.map((strategy) => (
              <div key={strategy.title} className="border-t border-slate-300 py-6">
                <h3 className="text-lg font-semibold text-slate-900">{strategy.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className={eyebrowClass}>Next step</p>
          <h2 className={`mt-3 ${headingClass}`}>Turn practice into confidence</h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Knowledge test practice is most effective when it is combined with steady study and clear feedback. If you
            want extra support, structured instruction can help you review signs, rules, and safe-driving decisions in
            a more focused way.
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
      </section>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish with {unansweredCount} unanswered?</AlertDialogTitle>
            <AlertDialogDescription>
              {unansweredCount === 1
                ? "One question has no answer and will be marked as skipped."
                : `${unansweredCount} questions have no answer and will be marked as skipped.`}{" "}
              Use the numbered buttons to go back and finish them, or continue to your results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep practising</AlertDialogCancel>
            <AlertDialogAction onClick={() => finishSession()} className="bg-[#E6242A] hover:bg-[#C41E23]">
              See my results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SiteFooter />
    </main>
  );
};

export default KnowledgeTestPractice;
