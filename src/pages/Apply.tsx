import { useRef, useState, type KeyboardEvent } from "react";
import {
  CheckCircle2,
  User,
  Car,
  BookOpen,
  Calendar,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { submitStudentAssessmentLead } from "@/lib/leadService";
import { getCaptchaVerification } from "@/lib/captcha";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethods: string[];
  studentName: string;
  studentAge: string;
  licenceStatus: string;
  hasValidBCLearnerLicence: string;
  drivingExperienceLevel: string;
  roadTestBookingStatus: string;
  preferredRoadTestLocation: string;
  selectedTrainingGoals: string[];
  trainingGoals: string;
  preferredLessonTimes: string[];
  needsPickup: string;
  pickupLocation: string;
};

type MultiSelectField = "preferredContactMethods" | "preferredLessonTimes" | "selectedTrainingGoals";
type SingleSelectField =
  | "licenceStatus"
  | "hasValidBCLearnerLicence"
  | "drivingExperienceLevel"
  | "roadTestBookingStatus"
  | "needsPickup";

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  preferredContactMethods: [],
  studentName: "",
  studentAge: "",
  licenceStatus: "",
  hasValidBCLearnerLicence: "",
  drivingExperienceLevel: "",
  roadTestBookingStatus: "",
  preferredRoadTestLocation: "",
  selectedTrainingGoals: [],
  trainingGoals: "",
  preferredLessonTimes: [],
  needsPickup: "",
  pickupLocation: "",
};

const steps = [
  { label: "Contact Info", icon: User },
  { label: "Student & Licence", icon: Car },
  { label: "Needs Assessment", icon: BookOpen },
  { label: "Scheduling", icon: Calendar },
];

const roadTestLocationOptions = [
  "ICBC Victoria",
  "ICBC Langford / Westshore",
  "ICBC Sidney",
  "ICBC Duncan",
  "Not sure yet",
] as const;

const trainingGoalOptions = [
  "Prepare for the ICBC road test",
  "Build overall driving confidence",
  "Improve parking and manoeuvres",
  "Get better at city driving",
  "Get better at highway driving",
  "Learn defensive driving habits",
  "Refresh skills after a long break",
] as const;

const inputClass =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]";

const checkboxClass =
  "mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1d52a1] focus:ring-[#1d52a1]";

const optionRowClass =
  "flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#1d52a1]/40";

const tagButtonBaseClass =
  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1]/30";

const normalizeTrainingGoal = (value: string) => value.trim().replace(/\s+/g, " ");

const buildTrainingGoalsValue = (formData: FormData) => {
  const selectedGoals = formData.selectedTrainingGoals.map(normalizeTrainingGoal).filter(Boolean);
  const draftGoal = normalizeTrainingGoal(formData.trainingGoals);
  const combinedGoals =
    draftGoal.length > 0 && !selectedGoals.some((goal) => goal.toLowerCase() === draftGoal.toLowerCase())
      ? [...selectedGoals, draftGoal]
      : selectedGoals;

  return combinedGoals.join(", ");
};

const Apply = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isThankYouRoute = location.pathname.replace(/\/+$/, "") === "/thank-you";
  const submissionInfo = (location.state as { fullName?: string; email?: string } | null) ?? null;
  const thankYouName = submissionInfo?.fullName?.trim() ?? "";
  const thankYouEmail = submissionInfo?.email?.trim() ?? "";

  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const scrollToFormSection = () => {
    if (typeof window === "undefined") return;

    const sectionTop = formSectionRef.current?.getBoundingClientRect().top;
    if (typeof sectionTop !== "number") return;

    window.scrollTo({
      top: Math.max(window.scrollY + sectionTop - 120, 0),
      behavior: "smooth",
    });
  };

  const update = (field: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const addTrainingGoal = (rawValue: string) => {
    const nextGoal = normalizeTrainingGoal(rawValue);
    if (!nextGoal) return;

    setFormData((prev) => {
      const alreadyExists = prev.selectedTrainingGoals.some(
        (goal) => normalizeTrainingGoal(goal).toLowerCase() === nextGoal.toLowerCase(),
      );

      return {
        ...prev,
        selectedTrainingGoals: alreadyExists ? prev.selectedTrainingGoals : [...prev.selectedTrainingGoals, nextGoal],
        trainingGoals: "",
      };
    });
  };

  const removeTrainingGoal = (goalToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTrainingGoals: prev.selectedTrainingGoals.filter((goal) => goal !== goalToRemove),
    }));
  };

  const toggleMulti = (field: MultiSelectField, value: string) => {
    setFormData((prev) => {
      const nextValues = prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value];
      return { ...prev, [field]: nextValues };
    });
  };

  const toggleSingleCheckbox = (field: SingleSelectField, value: string) => {
    setFormData((prev) => {
      const nextValue = prev[field] === value ? "" : value;

      if (field === "licenceStatus") {
        return {
          ...prev,
          licenceStatus: nextValue,
          hasValidBCLearnerLicence:
            nextValue === "no-licence" || nextValue === "" ? "" : prev.hasValidBCLearnerLicence,
        };
      }

      if (field === "needsPickup") {
        return {
          ...prev,
          needsPickup: nextValue,
          pickupLocation: nextValue === "yes" ? prev.pickupLocation : "",
        };
      }

      return {
        ...prev,
        [field]: nextValue,
      };
    });
  };

  const handleTrainingGoalDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTrainingGoal(formData.trainingGoals);
      return;
    }

    if (
      event.key === "Backspace" &&
      normalizeTrainingGoal(formData.trainingGoals).length === 0 &&
      formData.selectedTrainingGoals.length > 0
    ) {
      event.preventDefault();
      removeTrainingGoal(formData.selectedTrainingGoals[formData.selectedTrainingGoals.length - 1]);
    }
  };

  const isStep1Valid =
    formData.fullName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.preferredContactMethods.length > 0;

  const isStep2Valid =
    formData.studentAge.trim() !== "" &&
    formData.licenceStatus !== "" &&
    (formData.licenceStatus === "no-licence" || formData.hasValidBCLearnerLicence !== "");

  const isStep3Valid =
    formData.drivingExperienceLevel !== "" &&
    formData.roadTestBookingStatus !== "" &&
    formData.preferredRoadTestLocation.trim() !== "" &&
    (formData.selectedTrainingGoals.length > 0 || formData.trainingGoals.trim() !== "");

  const isStep4Valid =
    formData.preferredLessonTimes.length > 0 &&
    formData.needsPickup !== "" &&
    (formData.needsPickup === "no" || formData.pickupLocation.trim() !== "");

  const canProceed = [isStep1Valid, isStep2Valid, isStep3Valid, isStep4Valid];

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed[currentStep]) {
      setCurrentStep((s) => s + 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToFormSection);
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToFormSection);
      });
    }
  };

  const handleSubmit = async () => {
    if (!isStep4Valid || isSubmitting) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const captcha = await getCaptchaVerification("student_assessment_submit");
      await submitStudentAssessmentLead({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        preferredContactMethods: formData.preferredContactMethods,
        studentName: formData.studentName,
        studentAge: formData.studentAge,
        licenceStatus: formData.licenceStatus,
        hasValidBCLearnerLicence: formData.hasValidBCLearnerLicence,
        drivingExperienceLevel: formData.drivingExperienceLevel,
        roadTestBookingStatus: formData.roadTestBookingStatus,
        preferredRoadTestLocation: formData.preferredRoadTestLocation,
        trainingGoals: buildTrainingGoalsValue(formData),
        preferredLessonTimes: formData.preferredLessonTimes,
        needsPickup: formData.needsPickup,
        pickupLocation: formData.pickupLocation,
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });
      navigate("/thank-you", {
        state: { fullName: formData.fullName, email: formData.email },
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Student assessment submit failed:", error);
      setSubmitError("Submission failed. Please retry after verification or call us at +1 (250) 542-3673.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Start your journey with confidence"
        title={<span className="text-white">Request Driving Assessment</span>}
        description="Complete the form below and our team will provide a personalized training recommendation."
        backgroundImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">
            {isThankYouRoute ? "Thank You" : "Apply"}
          </p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
            Driving Assessment Form
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-600 sm:text-lg">
            {isThankYouRoute
              ? "Your assessment request has been submitted. Our team will be in touch soon."
              : "Fill in each section below. All information is used only to prepare your assessment recommendation."}
          </p>

          {isThankYouRoute ? (
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#1d52a1]/30 bg-white p-8 text-center shadow-sm sm:p-10">
              <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#1d52a1]">
                <CheckCircle2 size={34} />
              </span>
              <h3 className="mt-5 text-3xl font-black text-slate-900">Assessment Request Received</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                Thank you{thankYouName ? <>, <strong>{thankYouName}</strong></> : ""}. We will review your details and{" "}
                {thankYouEmail ? (
                  <>
                    contact you at <strong>{thankYouEmail}</strong>
                  </>
                ) : (
                  "be in touch"
                )}{" "}
                with a tailored recommendation.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Need to update your request? Call us at{" "}
                <a href="tel:+12505423673" className="font-semibold text-[#1d52a1]">
                  +1 (250) 542-3673
                </a>
              </p>
              <Link
                to="/"
                className="mt-8 inline-block rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17408a]"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="mt-10">
              <div className="mb-8 flex items-center justify-center">
                <div className="flex items-center gap-0">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isUpcoming = index > currentStep;

                    return (
                      <div key={step.label} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (index < currentStep) {
                              setCurrentStep(index);
                              requestAnimationFrame(() => {
                                requestAnimationFrame(scrollToFormSection);
                              });
                            }
                          }}
                          className={`flex flex-col items-center gap-1.5 px-2 sm:px-3 ${
                            index < currentStep ? "cursor-pointer" : "cursor-default"
                          }`}
                          disabled={isUpcoming}
                        >
                          <span
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 sm:h-12 sm:w-12 ${
                              isCompleted
                                ? "bg-[#1d52a1] text-white"
                                : isActive
                                ? "border-2 border-[#1d52a1] bg-white text-[#1d52a1]"
                                : "border-2 border-slate-300 bg-white text-slate-400"
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : <StepIcon size={18} />}
                          </span>
                          <span
                            className={`hidden text-xs font-semibold sm:block ${
                              isActive ? "text-[#1d52a1]" : isCompleted ? "text-slate-700" : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </button>

                        {index < steps.length - 1 && (
                          <div
                            className={`mx-1 h-0.5 w-6 sm:mx-2 sm:w-10 ${
                              index < currentStep ? "bg-[#1d52a1]" : "bg-slate-300"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div ref={formSectionRef} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {currentStep === 0 && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SECTION 1 - Contact Information</h3>
                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name *</label>
                        <p className="mb-2 text-xs text-slate-500">Please enter the primary contact name.</p>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => update("fullName", e.target.value)}
                          placeholder="e.g. Alex Johnson"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone Number *</label>
                        <p className="mb-2 text-xs text-slate-500">
                          We may contact you to confirm details of your assessment.
                        </p>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="+1 (250) 000-0000"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address *</label>
                        <p className="mb-2 text-xs text-slate-500">
                          Assessment confirmation and program recommendations will be sent here.
                        </p>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Preferred Contact Method *</label>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { value: "call", label: "Call" },
                            { value: "text", label: "Text" },
                            { value: "email", label: "Email" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.preferredContactMethods.includes(option.value)}
                                onChange={() => toggleMulti("preferredContactMethods", option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SECTION 2 - Student & Licence Information</h3>
                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Student's Full Name (if different)
                        </label>
                        <p className="mb-2 text-xs text-slate-500">
                          Enter the learner's name if different from above.
                        </p>
                        <input
                          type="text"
                          value={formData.studentName}
                          onChange={(e) => update("studentName", e.target.value)}
                          placeholder="Student full name"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">Student Age *</label>
                        <input
                          type="number"
                          min={14}
                          value={formData.studentAge}
                          onChange={(e) => update("studentAge", e.target.value)}
                          placeholder="e.g. 18"
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Current Licence Status (BC) *</label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            { value: "no-licence", label: "No Licence Yet" },
                            { value: "class-7l", label: "Learner (Class 7L)" },
                            { value: "class-7n", label: "Novice (Class 7N)" },
                            { value: "class-5", label: "Class 5" },
                            { value: "international", label: "International Licence" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.licenceStatus === option.value}
                                onChange={() => toggleSingleCheckbox("licenceStatus", option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.licenceStatus !== "" && formData.licenceStatus !== "no-licence" ? (
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Do you currently hold a valid BC Learner's Licence? *
                          </label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {[
                              { value: "yes", label: "Yes" },
                              { value: "no", label: "No" },
                            ].map((option) => (
                              <label key={option.value} className={optionRowClass}>
                                <input
                                  type="checkbox"
                                  className={checkboxClass}
                                  checked={formData.hasValidBCLearnerLicence === option.value}
                                  onChange={() =>
                                    toggleSingleCheckbox("hasValidBCLearnerLicence", option.value)
                                  }
                                />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      SECTION 3 - Driving Experience & Needs Assessment
                    </h3>
                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Current Driving Experience Level *
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            { value: "none", label: "No driving experience" },
                            { value: "limited", label: "Limited practice" },
                            { value: "comfortable", label: "Comfortable but need improvement" },
                            { value: "road-test", label: "Preparing for road test" },
                            { value: "refresher", label: "Refresher training" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.drivingExperienceLevel === option.value}
                                onChange={() =>
                                  toggleSingleCheckbox("drivingExperienceLevel", option.value)
                                }
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Have you booked your ICBC road test? *
                        </label>
                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                            { value: "need-help", label: "Need assistance booking" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.roadTestBookingStatus === option.value}
                                onChange={() => toggleSingleCheckbox("roadTestBookingStatus", option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Preferred ICBC Road Test Location *
                        </label>
                        <select
                          value={formData.preferredRoadTestLocation}
                          onChange={(e) => update("preferredRoadTestLocation", e.target.value)}
                          className={inputClass}
                        >
                          <option value="">Select a road test location</option>
                          {roadTestLocationOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                          Primary Goals for Training *
                        </label>
                        <p className="mb-3 text-xs text-slate-500">
                          Select preset goals below, or type your own and press Enter to turn it into a tag.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {trainingGoalOptions.map((option) => (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={formData.selectedTrainingGoals.includes(option)}
                              onClick={() => toggleMulti("selectedTrainingGoals", option)}
                              className={`${tagButtonBaseClass} ${
                                formData.selectedTrainingGoals.includes(option)
                                  ? "border-[#1d52a1] bg-[#1d52a1] text-white shadow-sm"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-[#1d52a1] hover:text-[#1d52a1]"
                              }`}
                            >
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                                  formData.selectedTrainingGoals.includes(option)
                                    ? "border-white/40 bg-white/15 text-white"
                                    : "border-slate-300 bg-slate-50 text-slate-400"
                                }`}
                              >
                                {formData.selectedTrainingGoals.includes(option) ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <span className="text-xs font-black">+</span>
                                )}
                              </span>
                              <span>{option}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors focus-within:border-[#1d52a1]">
                          <div className="flex flex-wrap items-center gap-2">
                            {formData.selectedTrainingGoals.map((goal) => (
                              <button
                                key={goal}
                                type="button"
                                onClick={() => removeTrainingGoal(goal)}
                                className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1]/10 px-3 py-1.5 text-sm font-semibold text-[#1d52a1] transition-colors hover:bg-[#1d52a1]/15"
                                aria-label={`Remove ${goal}`}
                              >
                                <span>{goal}</span>
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[#1d52a1]">
                                  <X className="h-3.5 w-3.5" />
                                </span>
                              </button>
                            ))}
                            <input
                              type="text"
                              value={formData.trainingGoals}
                              onChange={(e) => update("trainingGoals", e.target.value)}
                              onKeyDown={handleTrainingGoalDraftKeyDown}
                              onBlur={() => addTrainingGoal(formData.trainingGoals)}
                              placeholder="Type a custom goal and press Enter"
                              className="h-10 min-w-[240px] flex-1 border-0 bg-transparent px-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">SECTION 4 - Scheduling Preferences</h3>
                    <div className="mt-6 space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Preferred Lesson Times *
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            { value: "weekday-mornings", label: "Weekday Mornings" },
                            { value: "weekday-afternoons", label: "Weekday Afternoons" },
                            { value: "evenings", label: "Evenings" },
                            { value: "weekends", label: "Weekends" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.preferredLessonTimes.includes(option.value)}
                                onChange={() => toggleMulti("preferredLessonTimes", option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Do you need pickup? *
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {[
                            { value: "yes", label: "Yes" },
                            { value: "no", label: "No" },
                          ].map((option) => (
                            <label key={option.value} className={optionRowClass}>
                              <input
                                type="checkbox"
                                className={checkboxClass}
                                checked={formData.needsPickup === option.value}
                                onChange={() => toggleSingleCheckbox("needsPickup", option.value)}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {formData.needsPickup === "yes" ? (
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                            Pick-Up Location *
                          </label>
                          <p className="mb-2 text-xs text-slate-500">
                            Enter your preferred lesson starting location.
                          </p>
                          <input
                            type="text"
                            value={formData.pickupLocation}
                            onChange={(e) => update("pickupLocation", e.target.value)}
                            placeholder="Enter pick-up location"
                            className={inputClass}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    {currentStep > 0 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                      >
                        <ChevronLeft size={16} />
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canProceed[currentStep]}
                        className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition-colors ${
                          canProceed[currentStep]
                            ? "bg-[#1d52a1] hover:bg-[#17408a]"
                            : "cursor-not-allowed bg-slate-300"
                        }`}
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isStep4Valid || isSubmitting}
                        className={`rounded-full px-8 py-3 text-sm font-bold text-white transition-colors ${
                          isStep4Valid && !isSubmitting
                            ? "bg-[#E6242A] hover:bg-[#C41E23]"
                            : "cursor-not-allowed bg-slate-300"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Request Driving Assessment"}
                      </button>
                    )}
                  </div>

                  {submitError ? <p className="mt-4 text-sm text-red-500">{submitError}</p> : null}

                  {currentStep === steps.length - 1 && (
                    <p className="mt-4 text-sm text-slate-500">
                      Our team will review your information and provide a tailored training recommendation aligned
                      with ICBC standards.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Apply;




