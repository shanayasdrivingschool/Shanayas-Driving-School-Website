import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  User,
  Briefcase,
  FileText,
  Upload,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Car,
  AlertCircle,
} from "lucide-react";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { submitEmployeeLead } from "@/lib/leadService";
import { getCaptchaVerification } from "@/lib/captcha";

/* ═══════════════════════════════════════════════════════════
   POSITIONS DATABASE
   – Add / edit / close positions right here.
   – Only positions with status "OPEN" appear in the form.
   ═══════════════════════════════════════════════════════════ */
export type PositionRecord = {
  id: string;
  title: string;
  requiresLicense: boolean;
  status: "OPEN" | "CLOSED";
};

export const positionsDB: PositionRecord[] = [
  { id: "pos-001", title: "Driving Instructor", requiresLicense: true, status: "OPEN" },
  { id: "pos-002", title: "Office Administrator", requiresLicense: false, status: "OPEN" },
  { id: "pos-003", title: "Sub-Contractor", requiresLicense: true, status: "OPEN" },
  // { id: "pos-004", title: "Marketing Coordinator", requiresLicense: false, status: "CLOSED" },
];

/* ═══════════════════════════════════════════════════════════
   FORM DATA TYPES
   ═══════════════════════════════════════════════════════════ */
type FormData = {
  /* Step 1 – Personal */
  fullName: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  /* Step 2 – Position */
  positionId: string;
  yearsOfExperience: string;
  availableStartDate: string;
  coverLetter: string;
  /* Step 3 – Driving License (conditional) */
  licenseNumber: string;
  licenseType: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseYearsExperience: string;
  suspensionHistory: string;
  trafficViolations: string;
  /* Step 4 – Documents */
  resumeFile: File | null;
  policeClearanceFile: File | null;
  medicalFitnessFile: File | null;
};

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  dateOfBirth: "",
  positionId: "",
  yearsOfExperience: "",
  availableStartDate: "",
  coverLetter: "",
  licenseNumber: "",
  licenseType: "",
  licenseIssueDate: "",
  licenseExpiryDate: "",
  licenseYearsExperience: "",
  suspensionHistory: "",
  trafficViolations: "",
  resumeFile: null,
  policeClearanceFile: null,
  medicalFitnessFile: null,
};

/* ═══════════════════════════════════════════════════════════
   HELPER: generate a unique application ID
   ═══════════════════════════════════════════════════════════ */
const generateAppId = () => {
  const d = new Date();
  const ts = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `APP-${ts}-${rnd}`;
};

/* ═══════════════════════════════════════════════════════════
   STEP CONFIG (dynamic — license step injected when needed)
   ═══════════════════════════════════════════════════════════ */
const baseSteps = [
  { key: "personal", label: "Personal Info", icon: User },
  { key: "position", label: "Position", icon: Briefcase },
  // license step inserted here when requiresLicense
  { key: "documents", label: "Documents", icon: FileText },
  { key: "review", label: "Review", icon: CheckCircle2 },
];

const licenseStep = { key: "license", label: "License Details", icon: Car };

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */
const EmployeeApply = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormData>(() => {
    const preselect = searchParams.get("position") ?? "";
    if (preselect && positionsDB.some((p) => p.id === preselect && p.status === "OPEN")) {
      return { ...initialFormData, positionId: preselect };
    }
    return initialFormData;
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  /* Only OPEN positions */
  const openPositions = useMemo(() => positionsDB.filter((p) => p.status === "OPEN"), []);

  /* Currently selected position record */
  const selectedPosition = useMemo(
    () => openPositions.find((p) => p.id === form.positionId) ?? null,
    [form.positionId, openPositions],
  );

  const requiresLicense = selectedPosition?.requiresLicense ?? false;

  /* Dynamic steps array */
  const steps = useMemo(() => {
    const s = [...baseSteps];
    if (requiresLicense) {
      s.splice(2, 0, licenseStep); // insert after Position
    }
    return s;
  }, [requiresLicense]);

  const isLastStep = currentStep === steps.length - 1;

  /* ── field updaters ── */
  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setFile = (field: "resumeFile" | "policeClearanceFile" | "medicalFitnessFile", file: File | null) =>
    setForm((prev) => ({ ...prev, [field]: file }));

  /* ── validation per step ── */
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    const stepKey = steps[currentStep].key;

    if (stepKey === "personal") {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.phone.trim()) e.phone = "Phone number is required.";
      if (!form.email.trim()) e.email = "Email address is required.";
      else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
      if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
    }

    if (stepKey === "position") {
      if (!form.positionId) e.positionId = "Please select a position.";
      if (!form.yearsOfExperience.trim()) e.yearsOfExperience = "Years of experience is required.";
    }

    if (stepKey === "license") {
      if (!form.licenseNumber.trim()) e.licenseNumber = "License number is required.";
      if (!form.licenseType) e.licenseType = "License type is required.";
      if (!form.licenseIssueDate) e.licenseIssueDate = "Issue date is required.";
      if (!form.licenseExpiryDate) e.licenseExpiryDate = "Expiry date is required.";
      if (!form.licenseYearsExperience.trim()) e.licenseYearsExperience = "Driving experience years is required.";
    }

    if (stepKey === "documents") {
      if (!form.resumeFile) e.resumeFile = "Resume / CV upload is required.";
      if (requiresLicense) {
        if (!form.policeClearanceFile)
          e.policeClearanceFile = "Police Clearance Certificate is required for this role.";
        if (!form.medicalFitnessFile)
          e.medicalFitnessFile = "Medical Fitness Certificate is required for this role.";
      }
    }

    return e;
  };

  /* ── navigation ── */
  const next = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    if (isLastStep) {
      await handleSubmit();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const prev = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (requiresLicense && !form.licenseNumber.trim()) {
      setErrors({ licenseNumber: "Driving License details are required for this role." });
      // Jump back to license step
      const licIdx = steps.findIndex((s) => s.key === "license");
      if (licIdx >= 0) setCurrentStep(licIdx);
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    const appId = generateAppId();

    try {
      const captcha = await getCaptchaVerification("employee_application_submit");
      await submitEmployeeLead({
        applicationID: appId,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        positionId: form.positionId,
        positionTitle: selectedPosition?.title ?? "",
        requiresLicense,
        yearsOfExperience: form.yearsOfExperience,
        availableStartDate: form.availableStartDate,
        address: form.address,
        dateOfBirth: form.dateOfBirth,
        coverLetter: form.coverLetter,
        licenseNumber: form.licenseNumber,
        licenseType: form.licenseType,
        licenseIssueDate: form.licenseIssueDate,
        licenseExpiryDate: form.licenseExpiryDate,
        licenseYearsExperience: form.licenseYearsExperience,
        suspensionHistory: form.suspensionHistory,
        trafficViolations: form.trafficViolations,
        resumeFileName: form.resumeFile?.name ?? null,
        policeClearanceFileName: form.policeClearanceFile?.name ?? null,
        medicalFitnessFileName: form.medicalFitnessFile?.name ?? null,
        captchaProvider: captcha.provider ?? undefined,
        captchaToken: captcha.token ?? undefined,
        captchaAction: captcha.action ?? undefined,
      });
      setGeneratedId(appId);
      setSubmitted(true);
    } catch (error) {
      console.error("Employee application submit failed:", error);
      setSubmitError("Submission failed. Please retry after verification or email book@drivingschoolbc.ca.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════
     RENDER HELPERS
     ═══════════════════════════════════════════════════════════ */
  const inputClass = (field: string) =>
    `w-full rounded-xl border ${
      errors[field] ? "border-red-400 ring-2 ring-red-100" : "border-slate-300"
    } bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#1d52a1] focus:ring-2 focus:ring-[#1d52a1]/20`;

  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";

  const errorMsg = (field: string) =>
    errors[field] ? (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    ) : null;

  /* ── File upload widget ── */
  const FileUpload = ({
    label,
    field,
    required,
    accept = ".pdf,.doc,.docx,.jpg,.png",
  }: {
    label: string;
    field: "resumeFile" | "policeClearanceFile" | "medicalFitnessFile";
    required?: boolean;
    accept?: string;
  }) => (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed ${
          errors[field] ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"
        } px-4 py-4 transition-colors hover:border-[#1d52a1] hover:bg-[#1d52a1]/5`}
      >
        <Upload size={20} className={errors[field] ? "text-red-400" : "text-[#1d52a1]"} />
        <span className="text-sm text-slate-600">
          {form[field] ? (form[field] as File).name : "Click to upload or drag & drop"}
        </span>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => setFile(field, e.target.files?.[0] ?? null)}
        />
      </label>
      {errorMsg(field)}
    </div>
  );

  /* ═══════════════════════════════════════════════════════════
     STEP CONTENT
     ═══════════════════════════════════════════════════════════ */
  const renderStep = () => {
    const stepKey = steps[currentStep].key;

    /* ── Personal Info ── */
    if (stepKey === "personal")
      return (
        <div className="space-y-5">
          <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
          <p className="text-sm text-slate-500">Tell us a bit about yourself.</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass("fullName")}
                placeholder="e.g. Jane Doe"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
              />
              {errorMsg("fullName")}
            </div>
            <div>
              <label className={labelClass}>
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputClass("dateOfBirth")}
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
              />
              {errorMsg("dateOfBirth")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass("phone")}
                placeholder="e.g. 250-555-1234"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              {errorMsg("phone")}
            </div>
            <div>
              <label className={labelClass}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={inputClass("email")}
                placeholder="e.g. jane@example.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {errorMsg("email")}
            </div>
          </div>

          <div>
            <label className={labelClass}>Home Address</label>
            <input
              className={inputClass("address")}
              placeholder="Street, City, Province, Postal Code"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </div>
      );

    /* ── Position ── */
    if (stepKey === "position")
      return (
        <div className="space-y-5">
          <h3 className="text-xl font-black text-slate-900">Position Details</h3>
          <p className="text-sm text-slate-500">Select the role you'd like to apply for.</p>

          <div>
            <label className={labelClass}>
              Position <span className="text-red-500">*</span>
            </label>
            <select
              className={inputClass("positionId")}
              value={form.positionId}
              onChange={(e) => {
                set("positionId", e.target.value);
                // Reset license fields when position changes
                setForm((prev) => ({
                  ...prev,
                  positionId: e.target.value,
                  licenseNumber: "",
                  licenseType: "",
                  licenseIssueDate: "",
                  licenseExpiryDate: "",
                  licenseYearsExperience: "",
                  suspensionHistory: "",
                  trafficViolations: "",
                  policeClearanceFile: null,
                  medicalFitnessFile: null,
                }));
              }}
            >
              <option value="">- Select a position -</option>
              {openPositions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {errorMsg("positionId")}
            {selectedPosition && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck size={14} className={requiresLicense ? "text-[#E6242A]" : "text-green-500"} />
                {requiresLicense
                  ? "This role requires a valid driving licence. You'll need to provide licence details and upload certificates."
                  : "No driving licence required for this role."}
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Years of Work Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className={inputClass("yearsOfExperience")}
                placeholder="e.g. 3"
                value={form.yearsOfExperience}
                onChange={(e) => set("yearsOfExperience", e.target.value)}
              />
              {errorMsg("yearsOfExperience")}
            </div>
            <div>
              <label className={labelClass}>Available Start Date</label>
              <input
                type="date"
                className={inputClass("availableStartDate")}
                value={form.availableStartDate}
                onChange={(e) => set("availableStartDate", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Cover Letter / Message</label>
            <textarea
              rows={4}
              className={inputClass("coverLetter")}
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              value={form.coverLetter}
              onChange={(e) => set("coverLetter", e.target.value)}
            />
          </div>
        </div>
      );

    /* ── Driving License (conditional) ── */
    if (stepKey === "license")
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#E6242A]/10 text-[#E6242A]">
              <Car size={20} />
            </span>
            <div>
              <h3 className="text-xl font-black text-slate-900">Driving Licence Information</h3>
              <p className="text-sm text-slate-500">
                Required for the <strong>{selectedPosition?.title}</strong> position.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="flex items-start gap-2 text-sm text-amber-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              Driving Licence details are required for this role. All fields below are mandatory.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Licence Number <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass("licenseNumber")}
                placeholder="e.g. DL-1234567"
                value={form.licenseNumber}
                onChange={(e) => set("licenseNumber", e.target.value)}
              />
              {errorMsg("licenseNumber")}
            </div>
            <div>
              <label className={labelClass}>
                Licence Type <span className="text-red-500">*</span>
              </label>
              <select
                className={inputClass("licenseType")}
                value={form.licenseType}
                onChange={(e) => set("licenseType", e.target.value)}
              >
                <option value="">- Select type -</option>
                <option value="Class 4">Class 4 - Unrestricted</option>
                <option value="Class 5">Class 5 - Full Privilege</option>
                <option value="Class 7">Class 7 - Novice / Learner</option>
                <option value="ICBC Instructor">ICBC Driving Instructor Licence</option>
              </select>
              {errorMsg("licenseType")}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputClass("licenseIssueDate")}
                value={form.licenseIssueDate}
                onChange={(e) => set("licenseIssueDate", e.target.value)}
              />
              {errorMsg("licenseIssueDate")}
            </div>
            <div>
              <label className={labelClass}>
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputClass("licenseExpiryDate")}
                value={form.licenseExpiryDate}
                onChange={(e) => set("licenseExpiryDate", e.target.value)}
              />
              {errorMsg("licenseExpiryDate")}
            </div>
            <div>
              <label className={labelClass}>
                Years of Driving Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                className={inputClass("licenseYearsExperience")}
                placeholder="e.g. 5"
                value={form.licenseYearsExperience}
                onChange={(e) => set("licenseYearsExperience", e.target.value)}
              />
              {errorMsg("licenseYearsExperience")}
            </div>
          </div>

          <div>
            <label className={labelClass}>Suspension History</label>
            <textarea
              rows={3}
              className={inputClass("suspensionHistory")}
              placeholder="Have you ever had your licence suspended? If yes, provide details..."
              value={form.suspensionHistory}
              onChange={(e) => set("suspensionHistory", e.target.value)}
            />
          </div>

          <div>
            <label className={labelClass}>Traffic Violations</label>
            <textarea
              rows={3}
              className={inputClass("trafficViolations")}
              placeholder="List any traffic violations in the past 5 years, with dates and details..."
              value={form.trafficViolations}
              onChange={(e) => set("trafficViolations", e.target.value)}
            />
          </div>
        </div>
      );

    /* ── Documents ── */
    if (stepKey === "documents")
      return (
        <div className="space-y-5">
          <h3 className="text-xl font-black text-slate-900">Upload Documents</h3>
          <p className="text-sm text-slate-500">
            Upload your resume and any required certificates. Accepted formats: PDF, DOC, DOCX, JPG, PNG.
          </p>

          <FileUpload label="Resume / CV" field="resumeFile" required />

          {requiresLicense && (
            <>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="flex items-start gap-2 text-sm text-amber-800">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  The following certificates are <strong>required</strong> because this position requires a valid
                  driving licence.
                </p>
              </div>
              <FileUpload label="Police Clearance Certificate" field="policeClearanceFile" required />
              <FileUpload label="Medical Fitness Certificate" field="medicalFitnessFile" required />
            </>
          )}
        </div>
      );

    /* ── Review ── */
    if (stepKey === "review") {
      const reviewRow = (label: string, value: string | undefined) =>
        value ? (
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <span className="w-48 shrink-0 text-sm font-semibold text-slate-700">{label}</span>
            <span className="text-sm text-slate-600">{value}</span>
          </div>
        ) : null;

      return (
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900">Review Your Application</h3>
          <p className="text-sm text-slate-500">
            Please review all the information below before submitting.
          </p>

          {/* Personal */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#1d52a1]">Personal Information</p>
            <div className="space-y-2">
              {reviewRow("Full Name", form.fullName)}
              {reviewRow("Date of Birth", form.dateOfBirth)}
              {reviewRow("Phone", form.phone)}
              {reviewRow("Email", form.email)}
              {reviewRow("Address", form.address)}
            </div>
          </div>

          {/* Position */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#1d52a1]">Position Details</p>
            <div className="space-y-2">
              {reviewRow("Position", selectedPosition?.title)}
              {reviewRow("Experience", `${form.yearsOfExperience} years`)}
              {reviewRow("Available From", form.availableStartDate || "Not specified")}
              {reviewRow("Licence Required", requiresLicense ? "Yes" : "No")}
            </div>
          </div>

          {/* License */}
          {requiresLicense && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#E6242A]">
                Driving Licence Information
              </p>
              <div className="space-y-2">
                {reviewRow("Licence Number", form.licenseNumber)}
                {reviewRow("Licence Type", form.licenseType)}
                {reviewRow("Issue Date", form.licenseIssueDate)}
                {reviewRow("Expiry Date", form.licenseExpiryDate)}
                {reviewRow("Driving Experience", `${form.licenseYearsExperience} years`)}
                {reviewRow("Suspension History", form.suspensionHistory || "None")}
                {reviewRow("Traffic Violations", form.trafficViolations || "None")}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-[#1d52a1]">Documents</p>
            <div className="space-y-2">
              {reviewRow("Resume", form.resumeFile?.name)}
              {requiresLicense && reviewRow("Police Clearance", form.policeClearanceFile?.name)}
              {requiresLicense && reviewRow("Medical Fitness", form.medicalFitnessFile?.name)}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  /* ═══════════════════════════════════════════════════════════
     SUCCESS STATE
     ═══════════════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <main className="bg-white text-[#202121]">
        <PageNameSection
          eyebrow="Careers"
          title={<span className="text-[#F5C518]">Employee Application</span>}
          titleClassName="text-[#F5C518]"
          description="Apply to join Shanaya's Driving School team."
          backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=2200&q=80"
        />
        <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={40} />
          </span>
          <h2 className="mt-6 text-3xl font-black text-slate-900">Application Submitted!</h2>
          <p className="mt-4 text-lg text-slate-600">
            Thank you, <strong>{form.fullName}</strong>. Your application for{" "}
            <strong>{selectedPosition?.title}</strong> has been submitted successfully.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#1d52a1]/30 bg-[#1d52a1]/5 px-6 py-3">
            <span className="text-sm font-bold text-[#1d52a1]">Application ID:</span>
            <span className="font-mono text-sm text-slate-700">{generatedId}</span>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Status: <strong>Pending Review</strong> - We'll be in touch soon.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/careers"
              className="rounded-full bg-[#1d52a1] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17408a]"
            >
              Back to Careers
            </Link>
            <button
              type="button"
              onClick={() => {
                setForm(initialFormData);
                setCurrentStep(0);
                setErrors({});
                setSubmitted(false);
                setGeneratedId("");
              }}
              className="rounded-full border-2 border-[#1d52a1] px-8 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
            >
              Submit Another
            </button>
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════════ */
  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Careers"
        title={<span className="text-[#F5C518]">Employee Application</span>}
        titleClassName="text-[#F5C518]"
        description="Apply to join Shanaya's Driving School team."
        backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ── Step indicator ── */}
        <div className="mb-10 flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-green-500 text-white"
                        : isActive
                          ? "bg-[#1d52a1] text-white shadow-lg shadow-[#1d52a1]/30"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                  </span>
                  <span
                    className={`hidden text-[11px] font-semibold sm:block ${
                      isActive ? "text-[#1d52a1]" : isDone ? "text-green-600" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-1 h-0.5 w-6 sm:mx-2 sm:w-10 ${
                      i < currentStep ? "bg-green-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step content card ── */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          {renderStep()}

          {/* ── Navigation buttons ── */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <button
              type="button"
              onClick={next}
              disabled={isLastStep && isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-8 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17408a] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLastStep ? (isSubmitting ? "Submitting..." : "Submit Application") : "Continue"}
              {!isLastStep && <ChevronRight size={16} />}
            </button>
          </div>
          {submitError ? <p className="mt-4 text-sm text-red-500">{submitError}</p> : null}
        </div>

        {/* ── Step counter ── */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Step {currentStep + 1} of {steps.length}
        </p>
      </section>

      {/* ── CTA ── */}
      <SiteCtaSection
        title={
          <>
            Have questions about <span className="text-[#F5B13A]">working with us</span>?
          </>
        }
        description="If you'd like to learn more before applying, feel free to reach out. We're happy to chat."
        actions={
          <>
            <Link to="/contact" className={siteCtaPrimaryClassName}>
              Contact Us
            </Link>
            <Link to="/careers" className={siteCtaSecondaryClassName}>
              View Careers
            </Link>
          </>
        }
      />

      <SiteFooter />
    </main>
  );
};

export default EmployeeApply;

