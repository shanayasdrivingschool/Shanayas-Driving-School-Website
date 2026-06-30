import { FunctionsFetchError, FunctionsHttpError, FunctionsRelayError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type LeadType = "contact" | "student_assessment" | "employee_application" | "custom_package_request";
type CaptchaProvider = "turnstile" | "recaptcha";
export type EmployeeApplicationStatus = "Pending Review" | "Reviewed" | "Shortlisted" | "Rejected";

export type EmployeeApplicationRecord = {
  applicationID: string;
  positionApplied: string;
  requiresLicenseFlag: boolean;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  yearsOfExperience: string;
  submissionTimestamp: string;
  status: EmployeeApplicationStatus;
};

type LeadInsert = {
  lead_type: LeadType;
  full_name?: string;
  email?: string;
  phone?: string;
  source_page: string;
  status?: string;
  payload?: Record<string, unknown>;
  captcha_provider?: CaptchaProvider;
  captcha_token?: string;
  captcha_action?: string;
};

type ContactLeadInput = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  captchaProvider?: CaptchaProvider;
  captchaToken?: string;
  captchaAction?: string;
};

type StudentAssessmentLeadInput = {
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
  trainingGoals: string;
  preferredLessonTimes: string[];
  needsPickup: string;
  pickupLocation: string;
  captchaProvider?: CaptchaProvider;
  captchaToken?: string;
  captchaAction?: string;
};

type EmployeeLeadInput = {
  applicationID: string;
  fullName: string;
  email: string;
  phone: string;
  positionId: string;
  positionTitle: string;
  requiresLicense: boolean;
  yearsOfExperience: string;
  availableStartDate: string;
  address: string;
  dateOfBirth: string;
  coverLetter: string;
  licenseNumber: string;
  licenseType: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseYearsExperience: string;
  suspensionHistory: string;
  trafficViolations: string;
  resumeFileName: string | null;
  policeClearanceFileName: string | null;
  medicalFitnessFileName: string | null;
  captchaProvider?: CaptchaProvider;
  captchaToken?: string;
  captchaAction?: string;
};

type CustomPackageLeadInput = {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  selectedLocationId: string;
  selectedLocationName: string;
  selectedLocationPricingTier: string;
  basePriceLabel: string;
  discountedPriceLabel: string;
  appliedCouponCodes: string[];
  selectedCourses: Array<{
    id: string;
    title: string;
    detail: string;
    level: string;
  }>;
  captchaProvider?: CaptchaProvider;
  captchaToken?: string;
  captchaAction?: string;
};

type EmployeeLeadRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  status: string | null;
  created_at: string;
  payload: Record<string, unknown> | null;
};

const ensureSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  return supabase;
};

const LEAD_SUBMIT_FUNCTION = "submit-lead";

const getResponseErrorMessage = async (response?: Response) => {
  if (!response) return null;

  try {
    const raw = await response.text();
    if (!raw.trim()) return null;

    try {
      const payload = JSON.parse(raw) as {
        error?: string;
        reason?: string;
        message?: string;
        retry_after_seconds?: number;
      };

      const parts = [
        payload.error,
        payload.reason,
        payload.message,
        typeof payload.retry_after_seconds === "number" ? `retry_after_seconds=${payload.retry_after_seconds}` : null,
      ].filter((value): value is string => typeof value === "string" && value.length > 0);

      if (parts.length > 0) {
        return parts.join(" ");
      }
    } catch {
      return raw.trim();
    }
  } catch {
    return null;
  }

  return null;
};

const getFunctionErrorMessage = async (error: unknown, response?: Response) => {
  const responseMessage = await getResponseErrorMessage(response);
  if (responseMessage) {
    return responseMessage;
  }

  if (error instanceof FunctionsHttpError) {
    const contextMessage = await getResponseErrorMessage(error.context);
    if (contextMessage) {
      return contextMessage;
    }
    return "edge_function_http_error";
  }

  if (error instanceof FunctionsRelayError) {
    return "edge_function_relay_error";
  }

  if (error instanceof FunctionsFetchError) {
    return "edge_function_fetch_error";
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return "lead_submit_failed";
};

const insertLead = async (lead: LeadInsert) => {
  const client = ensureSupabase();

  const { error: functionError, response } = await client.functions.invoke(LEAD_SUBMIT_FUNCTION, {
    body: lead,
  });
  if (functionError) {
    throw new Error(await getFunctionErrorMessage(functionError, response));
  }
};

const insertLeadDirect = async (lead: LeadInsert) => {
  const client = ensureSupabase();
  const { error } = await client.from("leads").insert({
    lead_type: lead.lead_type,
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    source_page: lead.source_page,
    status: lead.status ?? "new",
    payload: lead.payload ?? {},
  });

  if (error) {
    throw error;
  }
};

const statusMap: Record<string, EmployeeApplicationStatus> = {
  new: "Pending Review",
  pending: "Pending Review",
  pending_review: "Pending Review",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

const mapEmployeeStatus = (status: string | null | undefined): EmployeeApplicationStatus => {
  const normalized = status?.trim().toLowerCase() ?? "";
  return statusMap[normalized] ?? "Pending Review";
};

const asPayload = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
};

const readString = (record: Record<string, unknown>, key: string, fallback = "") => {
  const value = record[key];
  return typeof value === "string" ? value : fallback;
};

const readBoolean = (record: Record<string, unknown>, key: string, fallback = false) => {
  const value = record[key];
  return typeof value === "boolean" ? value : fallback;
};

const normalizeSingle = (value: string) => value.trim();

const normalizeMulti = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));

const toCheckboxState = (selected: string[] | string, options: readonly string[]) => {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);
  return options.reduce<Record<string, boolean>>((acc, option) => {
    acc[option] = selectedSet.has(option);
    return acc;
  }, {});
};

const studentCheckboxOptions = {
  preferredContactMethods: ["call", "text", "email"] as const,
  licenceStatus: ["no-licence", "class-7l", "class-7n", "class-5", "international"] as const,
  hasValidBCLearnerLicence: ["yes", "no"] as const,
  drivingExperienceLevel: ["none", "limited", "comfortable", "road-test", "refresher"] as const,
  roadTestBookingStatus: ["yes", "no", "need-help"] as const,
  preferredLessonTimes: ["weekday-mornings", "weekday-afternoons", "evenings", "weekends"] as const,
  needsPickup: ["yes", "no"] as const,
} as const;

export const submitContactLead = async (input: ContactLeadInput) => {
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  await insertLead({
    lead_type: "contact",
    full_name: fullName,
    email: input.email,
    source_page: "/contact",
    payload: {
      first_name: input.firstName,
      last_name: input.lastName,
      message: input.message,
    },
    captcha_provider: input.captchaProvider,
    captcha_token: input.captchaToken,
    captcha_action: input.captchaAction,
  });
};

export const submitStudentAssessmentLead = async (input: StudentAssessmentLeadInput) => {
  const preferredContactMethods = normalizeMulti(input.preferredContactMethods);
  const preferredLessonTimes = normalizeMulti(input.preferredLessonTimes);
  const licenceStatus = normalizeSingle(input.licenceStatus);
  const hasValidBCLearnerLicence = normalizeSingle(input.hasValidBCLearnerLicence);
  const drivingExperienceLevel = normalizeSingle(input.drivingExperienceLevel);
  const roadTestBookingStatus = normalizeSingle(input.roadTestBookingStatus);
  const needsPickup = normalizeSingle(input.needsPickup);

  await insertLead({
    lead_type: "student_assessment",
    full_name: normalizeSingle(input.fullName),
    email: normalizeSingle(input.email),
    phone: normalizeSingle(input.phone),
    source_page: "/apply",
    payload: {
      preferred_contact_methods: preferredContactMethods,
      preferred_contact_methods_state: toCheckboxState(
        preferredContactMethods,
        studentCheckboxOptions.preferredContactMethods,
      ),
      student_name: normalizeSingle(input.studentName),
      student_age: normalizeSingle(input.studentAge),
      licence_status: licenceStatus,
      licence_status_state: toCheckboxState(licenceStatus, studentCheckboxOptions.licenceStatus),
      has_valid_bc_learner_licence: hasValidBCLearnerLicence,
      has_valid_bc_learner_licence_state: toCheckboxState(
        hasValidBCLearnerLicence,
        studentCheckboxOptions.hasValidBCLearnerLicence,
      ),
      driving_experience_level: drivingExperienceLevel,
      driving_experience_level_state: toCheckboxState(
        drivingExperienceLevel,
        studentCheckboxOptions.drivingExperienceLevel,
      ),
      road_test_booking_status: roadTestBookingStatus,
      road_test_booking_status_state: toCheckboxState(
        roadTestBookingStatus,
        studentCheckboxOptions.roadTestBookingStatus,
      ),
      preferred_road_test_location: normalizeSingle(input.preferredRoadTestLocation),
      training_goals: normalizeSingle(input.trainingGoals),
      preferred_lesson_times: preferredLessonTimes,
      preferred_lesson_times_state: toCheckboxState(
        preferredLessonTimes,
        studentCheckboxOptions.preferredLessonTimes,
      ),
      needs_pickup: needsPickup,
      needs_pickup_state: toCheckboxState(needsPickup, studentCheckboxOptions.needsPickup),
      pickup_location: normalizeSingle(input.pickupLocation),
      form_snapshot: {
        fullName: normalizeSingle(input.fullName),
        phone: normalizeSingle(input.phone),
        email: normalizeSingle(input.email),
        preferredContactMethods,
        studentName: normalizeSingle(input.studentName),
        studentAge: normalizeSingle(input.studentAge),
        licenceStatus,
        hasValidBCLearnerLicence,
        drivingExperienceLevel,
        roadTestBookingStatus,
        preferredRoadTestLocation: normalizeSingle(input.preferredRoadTestLocation),
        trainingGoals: normalizeSingle(input.trainingGoals),
        preferredLessonTimes,
        needsPickup,
        pickupLocation: normalizeSingle(input.pickupLocation),
      },
    },
    captcha_provider: input.captchaProvider,
    captcha_token: input.captchaToken,
    captcha_action: input.captchaAction,
  });
};

export const submitEmployeeLead = async (input: EmployeeLeadInput) => {
  const fullName = normalizeSingle(input.fullName);
  const email = normalizeSingle(input.email);
  const phone = normalizeSingle(input.phone);
  const positionId = normalizeSingle(input.positionId);
  const positionTitle = normalizeSingle(input.positionTitle);
  const yearsOfExperience = normalizeSingle(input.yearsOfExperience);
  const availableStartDate = normalizeSingle(input.availableStartDate);
  const address = normalizeSingle(input.address);
  const dateOfBirth = normalizeSingle(input.dateOfBirth);
  const coverLetter = normalizeSingle(input.coverLetter);
  const licenseNumber = normalizeSingle(input.licenseNumber);
  const licenseType = normalizeSingle(input.licenseType);
  const licenseIssueDate = normalizeSingle(input.licenseIssueDate);
  const licenseExpiryDate = normalizeSingle(input.licenseExpiryDate);
  const licenseYearsExperience = normalizeSingle(input.licenseYearsExperience);
  const suspensionHistory = normalizeSingle(input.suspensionHistory);
  const trafficViolations = normalizeSingle(input.trafficViolations);
  const applicationID = normalizeSingle(input.applicationID);

  const resumeFileName = normalizeSingle(input.resumeFileName ?? "");
  const policeClearanceFileName = normalizeSingle(input.policeClearanceFileName ?? "");
  const medicalFitnessFileName = normalizeSingle(input.medicalFitnessFileName ?? "");

  const normalizedResumeFileName = resumeFileName.length > 0 ? resumeFileName : null;
  const normalizedPoliceClearanceFileName = policeClearanceFileName.length > 0 ? policeClearanceFileName : null;
  const normalizedMedicalFitnessFileName = medicalFitnessFileName.length > 0 ? medicalFitnessFileName : null;

  const employeeFieldPresence = {
    full_name: fullName.length > 0,
    email: email.length > 0,
    phone: phone.length > 0,
    position_id: positionId.length > 0,
    position_title: positionTitle.length > 0,
    years_of_experience: yearsOfExperience.length > 0,
    available_start_date: availableStartDate.length > 0,
    address: address.length > 0,
    date_of_birth: dateOfBirth.length > 0,
    cover_letter: coverLetter.length > 0,
    license_number: licenseNumber.length > 0,
    license_type: licenseType.length > 0,
    license_issue_date: licenseIssueDate.length > 0,
    license_expiry_date: licenseExpiryDate.length > 0,
    license_years_experience: licenseYearsExperience.length > 0,
    suspension_history: suspensionHistory.length > 0,
    traffic_violations: trafficViolations.length > 0,
    resume_file_name: Boolean(normalizedResumeFileName),
    police_clearance_file_name: Boolean(normalizedPoliceClearanceFileName),
    medical_fitness_file_name: Boolean(normalizedMedicalFitnessFileName),
  } as const;

  await insertLead({
    lead_type: "employee_application",
    full_name: fullName,
    email,
    phone,
    source_page: "/careers/apply",
    status: "pending_review",
    payload: {
      application_id: applicationID,
      position_id: positionId,
      position_title: positionTitle,
      requires_license: input.requiresLicense,
      years_of_experience: yearsOfExperience,
      available_start_date: availableStartDate,
      address,
      date_of_birth: dateOfBirth,
      cover_letter: coverLetter,
      license_number: licenseNumber,
      license_type: licenseType,
      license_issue_date: licenseIssueDate,
      license_expiry_date: licenseExpiryDate,
      license_years_experience: licenseYearsExperience,
      suspension_history: suspensionHistory,
      traffic_violations: trafficViolations,
      resume_file_name: normalizedResumeFileName,
      police_clearance_file_name: normalizedPoliceClearanceFileName,
      medical_fitness_file_name: normalizedMedicalFitnessFileName,
      document_upload_state: {
        resume_uploaded: Boolean(normalizedResumeFileName),
        police_clearance_uploaded: Boolean(normalizedPoliceClearanceFileName),
        medical_fitness_uploaded: Boolean(normalizedMedicalFitnessFileName),
      },
      field_presence: employeeFieldPresence,
      form_snapshot: {
        applicationID,
        fullName,
        email,
        phone,
        positionId,
        positionTitle,
        requiresLicense: input.requiresLicense,
        yearsOfExperience,
        availableStartDate,
        address,
        dateOfBirth,
        coverLetter,
        licenseNumber,
        licenseType,
        licenseIssueDate,
        licenseExpiryDate,
        licenseYearsExperience,
        suspensionHistory,
        trafficViolations,
        resumeFileName: normalizedResumeFileName,
        policeClearanceFileName: normalizedPoliceClearanceFileName,
        medicalFitnessFileName: normalizedMedicalFitnessFileName,
      },
    },
    captcha_provider: input.captchaProvider,
    captcha_token: input.captchaToken,
    captcha_action: input.captchaAction,
  });
};

export const submitCustomPackageLead = async (input: CustomPackageLeadInput) => {
  const fullName = normalizeSingle(input.fullName);
  const email = normalizeSingle(input.email);
  const phone = normalizeSingle(input.phone);
  const message = normalizeSingle(input.message);
  const selectedLocationId = normalizeSingle(input.selectedLocationId);
  const selectedLocationName = normalizeSingle(input.selectedLocationName);
  const selectedLocationPricingTier = normalizeSingle(input.selectedLocationPricingTier);
  const basePriceLabel = normalizeSingle(input.basePriceLabel);
  const discountedPriceLabel = normalizeSingle(input.discountedPriceLabel);
  const appliedCouponCodes = normalizeMulti(input.appliedCouponCodes);
  const selectedCourses = input.selectedCourses.map((course) => ({
    id: normalizeSingle(course.id),
    title: normalizeSingle(course.title),
    detail: normalizeSingle(course.detail),
    level: normalizeSingle(course.level),
  }));

  const lead: LeadInsert = {
    lead_type: "custom_package_request",
    full_name: fullName,
    email,
    phone,
    source_page: "/packages",
    payload: {
      request_type: "custom_package_request",
      selected_course_ids: selectedCourses.map((course) => course.id),
      selected_courses: selectedCourses,
      selected_course_count: selectedCourses.length,
      selected_location_id: selectedLocationId,
      selected_location_name: selectedLocationName,
      selected_location_pricing_tier: selectedLocationPricingTier,
      base_price_label: basePriceLabel,
      discounted_price_label: discountedPriceLabel,
      applied_coupon_codes: appliedCouponCodes,
      message,
      form_snapshot: {
        fullName,
        email,
        phone,
        message,
        selectedLocationId,
        selectedLocationName,
        selectedLocationPricingTier,
        basePriceLabel,
        discountedPriceLabel,
        appliedCouponCodes,
        selectedCourses,
      },
    },
    captcha_provider: input.captchaProvider,
    captcha_token: input.captchaToken,
    captcha_action: input.captchaAction,
  };

  try {
    await insertLead(lead);
  } catch (error) {
    if (appliedCouponCodes.length === 0) {
      try {
        await insertLeadDirect(lead);
        return;
      } catch {
        throw error;
      }
    }

    throw error;
  }
};

export const fetchEmployeeApplications = async (): Promise<EmployeeApplicationRecord[]> => {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("leads")
    .select("id, full_name, email, phone, status, created_at, payload")
    .eq("lead_type", "employee_application")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as EmployeeLeadRow[];
  return rows.map((row) => {
    const payload = asPayload(row.payload);
    const fallbackId = `APP-${row.id.slice(0, 8).toUpperCase()}`;

    return {
      applicationID: readString(payload, "application_id", fallbackId),
      positionApplied: readString(payload, "position_title", "Unspecified Position"),
      requiresLicenseFlag: readBoolean(payload, "requires_license", false),
      applicantName: row.full_name ?? "Unknown Applicant",
      applicantEmail: row.email ?? "No email provided",
      applicantPhone: row.phone ?? "No phone provided",
      yearsOfExperience: readString(payload, "years_of_experience", "0"),
      submissionTimestamp: row.created_at,
      status: mapEmployeeStatus(row.status),
    };
  });
};
