import { useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, CarFront, CheckCircle2, ChevronLeft, GraduationCap, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { Checkbox } from "@/components/ui/checkbox";
import { usePublicCourses } from "@/hooks/usePublicCourses";
import {
  getCourseRecommendations,
  type CourseQuizAnswers,
  type CourseRecommendationResult,
} from "@/lib/courseRecommendation";

type ChallengeValue = CourseQuizAnswers["primaryChallenge"];
type CourseQuizSingleField =
  | "stage"
  | "licenceStatus"
  | "primaryGoal"
  | "practiceFrequency"
  | "roadTestTimeline"
  | "confidenceLevel"
  | "primaryChallenge"
  | "lessonPreference";

type CourseQuizFormState = {
  stage: CourseQuizAnswers["stage"] | "";
  licenceStatus: CourseQuizAnswers["licenceStatus"] | "";
  primaryGoal: CourseQuizAnswers["primaryGoal"] | "";
  practiceFrequency: CourseQuizAnswers["practiceFrequency"] | "";
  roadTestTimeline: CourseQuizAnswers["roadTestTimeline"] | "";
  confidenceLevel: CourseQuizAnswers["confidenceLevel"] | "";
  primaryChallenge: CourseQuizAnswers["primaryChallenge"] | "";
  challengeAreas: CourseQuizAnswers["challengeAreas"];
  lessonPreference: CourseQuizAnswers["lessonPreference"] | "";
  specialSituations: CourseQuizAnswers["specialSituations"];
};

type QuizOption<T extends string> = {
  value: T;
  label: string;
  description: string;
};

type SingleQuestionConfig = {
  step: number;
  questionNumber: number;
  field: CourseQuizSingleField;
  title: string;
  description?: string;
  columnsClassName: string;
  options: QuizOption<string>[];
};

const initialAnswers: CourseQuizFormState = {
  stage: "",
  licenceStatus: "",
  primaryGoal: "",
  practiceFrequency: "",
  roadTestTimeline: "",
  confidenceLevel: "",
  primaryChallenge: "",
  challengeAreas: [],
  lessonPreference: "",
  specialSituations: [],
};

const stageOptions: Array<QuizOption<CourseQuizAnswers["stage"]>> = [
  { value: "brand-new", label: "Brand-new driver", description: "I need the basics from the beginning." },
  { value: "some-practice", label: "Some practice already", description: "I drive a bit but need targeted improvement." },
  { value: "test-ready", label: "Near my road test", description: "I need a final push before test day." },
  { value: "licensed-rusty", label: "Licensed but rusty", description: "I need to rebuild confidence and consistency." },
  { value: "experienced-upgrading", label: "Experienced, improving further", description: "I want stronger control in harder situations." },
  { value: "mixed-needs", label: "Mixed needs", description: "I need help in several different areas." },
];

const licenceOptions: Array<QuizOption<CourseQuizAnswers["licenceStatus"]>> = [
  { value: "none", label: "No licence yet", description: "I still need help with the earliest stage." },
  { value: "learner", label: "Learner licence", description: "I can start or continue structured driving lessons." },
  { value: "novice", label: "Novice / N", description: "I am building toward the next test stage." },
  { value: "full", label: "Full licence", description: "I am licensed but want targeted coaching." },
  { value: "international", label: "International licence", description: "I drive already but need local adjustment support." },
];

const goalOptions: Array<QuizOption<CourseQuizAnswers["primaryGoal"]>> = [
  { value: "start-learning", label: "Start learning properly", description: "I want a strong beginner foundation." },
  { value: "pass-knowledge-test", label: "Pass the knowledge test", description: "I mainly need rules and sign support." },
  { value: "pass-road-test", label: "Pass the road test", description: "I need test-focused preparation." },
  { value: "build-confidence", label: "Feel more confident", description: "I need calmer repetition and support." },
  { value: "refresh-skills", label: "Refresh old skills", description: "I want to get comfortable again." },
  { value: "advanced-technique", label: "Improve advanced technique", description: "I want sharper control and precision." },
];

const practiceOptions: Array<QuizOption<CourseQuizAnswers["practiceFrequency"]>> = [
  { value: "none-yet", label: "No practice yet", description: "I need instructor-led structure from the start." },
  { value: "once-in-a-while", label: "Only once in a while", description: "I practice sometimes but not consistently." },
  { value: "weekly", label: "At least weekly", description: "I get some regular time behind the wheel." },
  { value: "regularly", label: "Very regularly", description: "I drive often and want more specialized coaching." },
];

const timelineOptions: Array<QuizOption<CourseQuizAnswers["roadTestTimeline"]>> = [
  { value: "within-30-days", label: "Within 30 days", description: "My road test is very soon." },
  { value: "within-90-days", label: "Within 90 days", description: "My road test is booked or planned soon." },
  { value: "not-booked-yet", label: "Not booked yet", description: "I still want prep, but no test date yet." },
  { value: "not-applicable", label: "Not applicable", description: "Road test prep is not my current focus." },
];

const confidenceOptions: Array<QuizOption<CourseQuizAnswers["confidenceLevel"]>> = [
  { value: "very-nervous", label: "Very nervous", description: "I need calm, supportive lessons." },
  { value: "needs-repetition", label: "I need more repetition", description: "I am okay, but extra guided practice would help." },
  { value: "mostly-confident", label: "Mostly confident", description: "I am ready for sharper skill-focused coaching." },
];

const challengeOptions: Array<QuizOption<ChallengeValue>> = [
  { value: "parking", label: "Parking", description: "Parallel parking, stall parking, and low-speed control." },
  { value: "road-rules", label: "Road rules and signs", description: "Traffic rules, signs, and knowledge test content." },
  { value: "test-routes", label: "Road test routes", description: "Test-specific maneuvers and route confidence." },
  { value: "mock-test-feedback", label: "Mock test feedback", description: "A realistic readiness check before test day." },
  { value: "traffic-anxiety", label: "Traffic anxiety", description: "Feeling stressed in live traffic and busy roads." },
  { value: "hazard-awareness", label: "Hazard awareness", description: "Defensive decision-making and traffic scanning." },
  { value: "winter-weather", label: "Winter driving", description: "More control in icy or low-visibility weather." },
  { value: "canadian-rules", label: "Canadian driving rules", description: "Help adapting to local road expectations." },
  { value: "precision-control", label: "Precision control", description: "Better technique and smoother vehicle control." },
];

const lessonPreferenceOptions: Array<QuizOption<CourseQuizAnswers["lessonPreference"]>> = [
  { value: "structured-program", label: "A structured program", description: "I want a fuller learning path, not just one fix." },
  { value: "targeted-improvement", label: "Targeted improvement lessons", description: "I want focused work on specific weak areas." },
  { value: "test-focused", label: "Mostly test-focused prep", description: "I want lessons centered on passing the test." },
  { value: "custom-single-focus", label: "One custom-focus lesson", description: "I want one lesson built around a specific issue." },
];

const specialOptions: Array<QuizOption<CourseQuizAnswers["specialSituations"][number]>> = [
  { value: "new-to-canada", label: "I am new to Canada", description: "I need support with local rules and expectations." },
  { value: "senior-driver", label: "I am a senior driver", description: "I want coaching tailored to comfort and awareness." },
  { value: "want-custom-focus", label: "I want one custom-focus lesson", description: "I already know the area I want to target." },
  { value: "returning-after-break", label: "I am returning after a break", description: "I want to ease back into driving after time away." },
];

const questionCount = 10;

const singleQuestionSteps: SingleQuestionConfig[] = [
  {
    step: 0,
    questionNumber: 1,
    field: "stage",
    title: "What best describes your current driving stage?",
    description: "Choose the option that is closest to your present level.",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: stageOptions,
  },
  {
    step: 1,
    questionNumber: 2,
    field: "licenceStatus",
    title: "What is your current licence situation?",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: licenceOptions,
  },
  {
    step: 2,
    questionNumber: 3,
    field: "primaryGoal",
    title: "What is your main goal right now?",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: goalOptions,
  },
  {
    step: 3,
    questionNumber: 4,
    field: "practiceFrequency",
    title: "How often are you currently practicing driving?",
    description: "This helps us separate foundation support from more specialized coaching.",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: practiceOptions,
  },
  {
    step: 4,
    questionNumber: 5,
    field: "roadTestTimeline",
    title: "What is your road test timeline?",
    description: "If road test prep is not relevant yet, choose not applicable.",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: timelineOptions,
  },
  {
    step: 5,
    questionNumber: 6,
    field: "confidenceLevel",
    title: "How confident do you feel behind the wheel?",
    columnsClassName: "grid gap-4 md:grid-cols-3",
    options: confidenceOptions,
  },
  {
    step: 6,
    questionNumber: 7,
    field: "primaryChallenge",
    title: "What is the single biggest area you want help with?",
    description: "Pick the one area that matters most. We will ask about extra needs next.",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: challengeOptions,
  },
  {
    step: 8,
    questionNumber: 9,
    field: "lessonPreference",
    title: "What kind of lesson format fits you best?",
    description: "This helps us choose between structured, targeted, test-focused, and custom lesson types.",
    columnsClassName: "grid gap-4 md:grid-cols-2",
    options: lessonPreferenceOptions,
  },
];

const singleOptionClass = (selected: boolean) =>
  `flex h-full cursor-pointer flex-col rounded-3xl border p-5 text-left transition-colors ${
    selected ? "border-[#1d52a1] bg-[#1d52a1]/5 shadow-sm" : "border-slate-200 bg-white hover:border-[#1d52a1]/40"
  }`;

const multiOptionClass = (selected: boolean) =>
  `flex h-full cursor-pointer items-start gap-3 rounded-3xl border p-4 transition-colors ${
    selected ? "border-[#1d52a1] bg-[#1d52a1]/5 shadow-sm" : "border-slate-200 bg-white hover:border-[#1d52a1]/40"
  }`;

const QuestionCard = ({
  questionNumber,
  title,
  description,
  children,
}: {
  questionNumber: number;
  title: string;
  description?: string;
  children: ReactNode;
}) => (
  <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
    <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Question {questionNumber}</p>
    <h3 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{title}</h3>
    {description ? <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p> : null}
    <div className="mt-6">{children}</div>
  </section>
);

const CourseQuiz = () => {
  const [answers, setAnswers] = useState<CourseQuizFormState>(initialAnswers);
  const [currentStep, setCurrentStep] = useState(0);
  const [recommendation, setRecommendation] = useState<CourseRecommendationResult | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const coursesQuery = usePublicCourses();
  const visibleCourseIds = new Set(coursesQuery.data.map((course) => course.id));
  const visibleRecommendation = recommendation
    ? {
        ...recommendation,
        primaryRecommendations: recommendation.primaryRecommendations.filter((course) => visibleCourseIds.has(course.id)),
        supportRecommendations: recommendation.supportRecommendations.filter((course) => visibleCourseIds.has(course.id)),
      }
    : null;

  const updateSingleAndAdvance = (field: CourseQuizSingleField, value: string) => {
    setAnswers((current) => {
      if (field === "primaryChallenge") {
        return {
          ...current,
          primaryChallenge: value as ChallengeValue,
          challengeAreas: current.challengeAreas.filter((item) => item !== value),
        };
      }

      return {
        ...current,
        [field]: value,
      } as CourseQuizFormState;
    });

    setRecommendation(null);
    setShowValidation(false);
    setCurrentStep((step) => Math.min(step + 1, questionCount - 1));
  };

  const toggleMulti = (
    field: "challengeAreas" | "specialSituations",
    value: CourseQuizFormState["challengeAreas"][number] | CourseQuizFormState["specialSituations"][number],
  ) => {
    setAnswers((current) => {
      const currentValues = current[field] as string[];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [field]: nextValues,
      } as CourseQuizFormState;
    });
    setRecommendation(null);
  };

  const canContinueFromStep = (step: number) => {
    switch (step) {
      case 0:
        return answers.stage !== "";
      case 1:
        return answers.licenceStatus !== "";
      case 2:
        return answers.primaryGoal !== "";
      case 3:
        return answers.practiceFrequency !== "";
      case 4:
        return answers.roadTestTimeline !== "";
      case 5:
        return answers.confidenceLevel !== "";
      case 6:
        return answers.primaryChallenge !== "";
      case 7:
        return true;
      case 8:
        return answers.lessonPreference !== "";
      case 9:
        return true;
      default:
        return false;
    }
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    setShowValidation(false);
  };

  const handleReset = () => {
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setRecommendation(null);
    setShowValidation(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinue = () => {
    setShowValidation(true);
    if (!canContinueFromStep(currentStep)) return;
    setShowValidation(false);
    setCurrentStep((step) => Math.min(step + 1, questionCount - 1));
  };

  const handleSubmit = () => {
    setShowValidation(true);

    const isReady =
      answers.stage !== "" &&
      answers.licenceStatus !== "" &&
      answers.primaryGoal !== "" &&
      answers.practiceFrequency !== "" &&
      answers.roadTestTimeline !== "" &&
      answers.confidenceLevel !== "" &&
      answers.primaryChallenge !== "" &&
      answers.lessonPreference !== "";

    if (!isReady) return;

    const completedAnswers = {
      stage: answers.stage,
      licenceStatus: answers.licenceStatus,
      primaryGoal: answers.primaryGoal,
      practiceFrequency: answers.practiceFrequency,
      roadTestTimeline: answers.roadTestTimeline,
      confidenceLevel: answers.confidenceLevel,
      primaryChallenge: answers.primaryChallenge,
      challengeAreas: answers.challengeAreas,
      lessonPreference: answers.lessonPreference,
      specialSituations: answers.specialSituations,
    } as CourseQuizAnswers;

    setRecommendation(getCourseRecommendations(completedAnswers));

    window.setTimeout(() => {
      document.getElementById("course-quiz-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const currentSingleQuestion = singleQuestionSteps.find((question) => question.step === currentStep);
  const additionalChallengeOptions = challengeOptions.filter((option) => option.value !== answers.primaryChallenge);

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Find your best-fit courses"
        title={<span className="text-white">Course Match Quiz</span>}
        description="Answer one question at a time and we will recommend the exact courses that match your current needs."
        backgroundImage="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 sm:p-8">
            <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl">Quiz</p>
            <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
              Step-by-step course estimator
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
              Each question is built from the actual training we offer, including beginner lessons, knowledge prep,
              parking, road test prep, refresher work, newcomer support, winter driving, and advanced coaching.
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-600">
                <span>Question {currentStep + 1} of {questionCount}</span>
                <span>{Math.round(((currentStep + 1) / questionCount) * 100)}% complete</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#1d52a1] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questionCount) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-8">
              {currentSingleQuestion ? (
                <QuestionCard
                  questionNumber={currentSingleQuestion.questionNumber}
                  title={currentSingleQuestion.title}
                  description={currentSingleQuestion.description}
                >
                  <div className={currentSingleQuestion.columnsClassName}>
                    {currentSingleQuestion.options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSingleAndAdvance(currentSingleQuestion.field, option.value)}
                        className={singleOptionClass(answers[currentSingleQuestion.field] === option.value)}
                      >
                        <span className="text-lg font-black text-slate-900">{option.label}</span>
                        <span className="mt-2 text-sm leading-relaxed text-slate-600">{option.description}</span>
                      </button>
                    ))}
                  </div>
                </QuestionCard>
              ) : null}
              {currentStep === 7 ? (
                <QuestionCard
                  questionNumber={8}
                  title="Do you have any additional areas you want help with?"
                  description="Optional. Select any extra needs beyond your main challenge, then continue."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {additionalChallengeOptions.map((option) => {
                      const selected = answers.challengeAreas.includes(option.value);

                      return (
                        <label key={option.value} htmlFor={option.value} className={multiOptionClass(selected)}>
                          <Checkbox
                            id={option.value}
                            checked={selected}
                            onCheckedChange={() => toggleMulti("challengeAreas", option.value)}
                            className="mt-1 border-[#1d52a1]"
                          />
                          <span className="flex-1">
                            <span className="block text-base font-black text-slate-900">{option.label}</span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{option.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(8)}
                      className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                    >
                      Skip this question
                    </button>
                  </div>
                </QuestionCard>
              ) : null}

              {currentStep === 9 ? (
                <QuestionCard
                  questionNumber={10}
                  title="Do any of these situations apply to you?"
                  description="Optional. These help refine the final recommendation before we show your results."
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {specialOptions.map((option) => {
                      const selected = answers.specialSituations.includes(option.value);

                      return (
                        <label key={option.value} htmlFor={option.value} className={multiOptionClass(selected)}>
                          <Checkbox
                            id={option.value}
                            checked={selected}
                            onCheckedChange={() => toggleMulti("specialSituations", option.value)}
                            className="mt-1 border-[#1d52a1]"
                          />
                          <span className="flex-1">
                            <span className="block text-base font-black text-slate-900">{option.label}</span>
                            <span className="mt-1 block text-sm leading-relaxed text-slate-600">{option.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                    >
                      Show My Course Recommendations
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                    >
                      Skip and show results
                    </button>
                  </div>
                </QuestionCard>
              ) : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-colors ${
                    currentStep > 0
                      ? "border-2 border-[#1d52a1] text-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"
                      : "cursor-not-allowed border-2 border-slate-200 text-slate-300"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-300 px-7 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Quiz
                </button>
              </div>

              <p className="text-sm text-slate-500">Single-choice questions move forward automatically after selection.</p>
            </div>

            {showValidation && !canContinueFromStep(currentStep) ? (
              <p className="mt-4 text-sm text-red-500">Choose an answer before continuing to the next question.</p>
            ) : null}
          </div>
        </div>
      </section>

      {visibleRecommendation ? (
        <section id="course-quiz-results" className="bg-[#F2F2F2] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Results</p>
            <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
              Your course recommendations
            </h2>

            <div className="mt-10 rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1]/10 px-4 py-2 text-sm font-bold text-[#1d52a1]">
                    <Sparkles className="h-4 w-4" />
                    {visibleRecommendation.pathwayTitle}
                  </div>
                  <h3 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
                    Based on your answers, these are the best-fit courses.
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">{visibleRecommendation.summary}</p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-5 lg:w-[280px]">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Recommended now</p>
                  <p className="mt-2 text-4xl font-black text-[#1d52a1]">{visibleRecommendation.primaryRecommendations.length}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    We kept the list focused so it only includes courses that match the needs you selected.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {visibleRecommendation.primaryRecommendations.map((course) => {
                  const DeliveryIcon =
                    course.deliveryFormat === "In-class"
                      ? GraduationCap
                      : course.deliveryFormat === "In-class + In-car"
                        ? BookOpen
                        : CarFront;

                  return (
                    <article key={course.id} className="rounded-3xl border border-slate-200 bg-white p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1d52a1]">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.level}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            course.deliveryFormat === "In-class"
                              ? "bg-[#E6242A]/10 text-[#E6242A]"
                              : course.deliveryFormat === "In-car"
                                ? "bg-[#F3B233]/15 text-[#B77900]"
                                : "bg-[#1d52a1]/10 text-[#1d52a1]"
                          }`}
                        >
                          <DeliveryIcon className="h-3.5 w-3.5" />
                          {course.deliveryFormat}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                          {course.duration}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-black text-slate-900">{course.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.description}</p>

                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]">Why it fits</p>
                        <ul className="mt-3 space-y-2">
                          {course.reasons.map((reason) => (
                            <li key={reason} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {course.highlights.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleRecommendation.supportRecommendations.length > 0 ? (
                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h4 className="text-xl font-black text-slate-900">Also consider these support courses</h4>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {visibleRecommendation.supportRecommendations.map((course) => (
                      <article key={course.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                          <div>
                            <h5 className="text-lg font-black text-slate-900">{course.title}</h5>
                            <p className="mt-1 text-sm text-slate-600">{course.reasons[0] ?? course.description}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                >
                  Book your driving lesson
                </Link>
                <Link
                  to="/packages#custom-package-builder"
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#1d52a1] px-8 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
                >
                  Build My Own Package
                </Link>
                <a
                  href="tel:+12505423673"
                  className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <SiteCtaSection
        eyebrow="Still unsure?"
        title={
          <>
            Talk to us about the <span className="text-[#F5B13A]">right lesson plan</span>
          </>
        }
        description="If your needs are more specific than the quiz, our team can help combine the right courses and schedule into one practical plan."
        actions={
          <>
            <Link to="/contact" className={siteCtaPrimaryClassName}>
              Contact Us
            </Link>
            <Link to="/course-quiz" className={siteCtaSecondaryClassName}>
              Take Course Quiz
            </Link>
          </>
        }
      />

      <SiteFooter />
    </main>
  );
};

export default CourseQuiz;
