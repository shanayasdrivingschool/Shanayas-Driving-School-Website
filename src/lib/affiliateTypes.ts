export type AffiliateStatus = "pending" | "approved" | "blocked";
export type CommissionStatus = "pending" | "approved" | "paid" | "reversed" | "rejected";
export type PayoutStatus = "pending" | "approved" | "paid" | "failed" | "cancelled";
export type PaymentStatus =
  | "pending"
  | "pending_payment"
  | "processing_payment"
  | "paid"
  | "cancelled"
  | "refunded"
  | "failed";
export type PreferredPayoutMethod = "bank_transfer" | "paypal" | "interac";
export type LeadType = "contact" | "student_assessment" | "employee_application" | "custom_package_request";
export type LeadStatus = "new" | "pending_review" | "reviewed" | "shortlisted" | "rejected";
export type CouponType = "one_time" | "periodic";
export type CheckoutInvoiceStatus = "draft" | "open" | "paid" | "cancelled";
export type KnowledgeTestQuestionCategory =
  | "road_signs"
  | "rules_of_the_road"
  | "hazard_awareness"
  | "safe_driving"
  | "road_markings";
export type KnowledgeTestQuestionOptionKey = "a" | "b" | "c" | "d";

export type AffiliateProfile = {
  id: string;
  affiliateId: string;
  authUserId?: string | null;
  name: string;
  email: string;
  phone: string | null;
  age: number | null;
  isMinor: boolean;
  guardianName: string | null;
  guardianEmail: string | null;
  guardianPhone: string | null;
  guardianConsent: boolean;
  guardianConsentTimestamp: string | null;
  socialMediaLink: string | null;
  preferredPayoutMethod: PreferredPayoutMethod;
  status: AffiliateStatus;
  commissionRate: number;
  cookieDurationDays: number;
  notes?: string | null;
  createdAt: string;
  approvedAt: string | null;
  blockedAt: string | null;
};

export type AffiliateDashboardStats = {
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  totalCommission: number;
  pendingPayout: number;
  approvedCommission: number;
  minimumPayout: number;
};

export type AffiliateOrderRecord = {
  id: string;
  externalOrderId: string | null;
  packageName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  purchasedAt: string | null;
  referralCode: string | null;
  isSuspicious: boolean;
  fraudFlags: string[];
};

export type AffiliateCommissionRecord = {
  id: string;
  orderId: string;
  orderReference: string | null;
  commissionAmount: number;
  purchaseAmount: number;
  status: CommissionStatus;
  createdAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
};

export type PayoutRecord = {
  id: string;
  amount: number;
  paymentMethod: PreferredPayoutMethod;
  paymentStatus: PayoutStatus;
  createdAt: string;
  requestedAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  notes: string | null;
};

export type AffiliateDashboardResponse = {
  affiliate: AffiliateProfile;
  referralLink: string;
  stats: AffiliateDashboardStats;
  orders: AffiliateOrderRecord[];
  commissions: AffiliateCommissionRecord[];
  payouts: PayoutRecord[];
};

export type AffiliateRegistrationInput = {
  name: string;
  email: string;
  phone: string;
  age: number;
  password: string;
  socialMediaLink?: string;
  preferredPayoutMethod: PreferredPayoutMethod;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianConsent?: boolean;
  guardianConsentTimestamp?: string;
  acceptedReferralTermsAt: string;
  acceptedReferralTermsVersion: string;
  acceptedPrivacyConsentAt: string;
};

export type AffiliateRegistrationResult = {
  affiliate: AffiliateProfile | null;
  referralLink: string | null;
  requiresEmailConfirmation: boolean;
  email: string;
};

export type ReferralTrackingResult = {
  valid: boolean;
  affiliateId: string;
  affiliateCode: string;
  affiliateName: string;
  expiresInDays: number;
  clickId: string;
};

export type PurchaseCommissionInput = {
  externalOrderId: string;
  packageName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  customerEmail?: string;
  customerId?: string;
  customerIp?: string;
  customerUserAgent?: string;
  fingerprintHash?: string;
  referralCode?: string;
};

export type PurchaseCommissionResult = {
  orderId: string;
  commissionId: string | null;
  commissionStatus: CommissionStatus | null;
  commissionAmount: number | null;
  rejectedReason: string | null;
};

export type AdminAffiliateRecord = AffiliateProfile & {
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  totalCommission: number;
  pendingPayout: number;
};

export type AdminAffiliatesResponse = {
  affiliates: AdminAffiliateRecord[];
  totals: {
    totalAffiliates: number;
    approvedAffiliates: number;
    blockedAffiliates: number;
    pendingAffiliates: number;
  };
};

export type AdminLeadRecord = {
  id: string;
  leadType: LeadType;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  sourcePage: string;
  status: LeadStatus;
  payload: Record<string, unknown>;
  requestType: string | null;
  createdAt: string;
};

export type AdminLeadsResponse = {
  leads: AdminLeadRecord[];
  totals: {
    totalLeads: number;
    contact: number;
    studentAssessment: number;
    employeeApplications: number;
    customPackageRequests: number;
  };
};

export type AdminReferralRecord = {
  id: string;
  affiliateRecordId: string | null;
  affiliateId: string;
  affiliateName: string;
  referralCode: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  landingPath: string;
  fingerprintHash: string | null;
  isSuspicious: boolean;
  suspicionReason: string | null;
  createdAt: string;
};

export type AdminReferralsResponse = {
  referrals: AdminReferralRecord[];
  suspiciousCount: number;
  totalClicks: number;
};

export type AdminOrderRecord = {
  id: string;
  externalOrderId: string | null;
  customerId: string | null;
  customerEmail: string | null;
  packageName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  affiliateRecordId: string | null;
  affiliateId: string | null;
  affiliateName: string | null;
  affiliateClickId: string | null;
  referralCode: string | null;
  customerIp: string | null;
  customerUserAgent: string | null;
  fingerprintHash: string | null;
  isSelfReferral: boolean;
  isSuspicious: boolean;
  fraudFlags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  purchasedAt: string | null;
};

export type AdminOrdersResponse = {
  orders: AdminOrderRecord[];
  totals: {
    totalOrders: number;
    paid: number;
    pendingPayment: number;
    processingPayment: number;
    cancelled: number;
    refunded: number;
    failed: number;
    suspicious: number;
  };
};

export type AdminInvoiceRecord = {
  id: string;
  publicToken: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  customerName: string | null;
  customerEmail: string | null;
  status: CheckoutInvoiceStatus;
  expiresAt: string | null;
  paidAt: string | null;
  lastOrderId: string | null;
  metadata: Record<string, unknown>;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminInvoicesResponse = {
  invoices: AdminInvoiceRecord[];
  totals: {
    totalInvoices: number;
    openInvoices: number;
    draftInvoices: number;
    paidInvoices: number;
    cancelledInvoices: number;
    expiredInvoices: number;
    openAmount: number;
    paidAmount: number;
  };
};

export type AdminCommissionRecord = {
  id: string;
  affiliateRecordId: string;
  affiliateId: string;
  affiliateName: string;
  orderId: string;
  orderReference: string | null;
  purchaseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
  approvedAt: string | null;
  paidAt: string | null;
  reversedAt: string | null;
  reversalReason: string | null;
};

export type AdminCommissionsResponse = {
  commissions: AdminCommissionRecord[];
  totals: {
    pending: number;
    approved: number;
    paid: number;
    reversed: number;
  };
};

export type AdminPayoutCandidate = {
  id: string;
  affiliateId: string;
  affiliateName: string;
  payoutMethod: PreferredPayoutMethod;
  availableAmount: number;
};

export type AdminPayoutRecord = PayoutRecord & {
  affiliateRecordId: string;
  affiliateId: string;
  affiliateName: string;
  commissionIds: string[];
};

export type AdminPayoutsResponse = {
  payouts: AdminPayoutRecord[];
  eligibleAffiliates: AdminPayoutCandidate[];
};

export type AdminRateLimitRecord = {
  key: string;
  endpoint: string;
  windowStart: string;
  count: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminRateLimitsResponse = {
  rateLimits: AdminRateLimitRecord[];
  totals: {
    totalWindows: number;
    flaggedWindows: number;
    uniqueEndpoints: number;
  };
};

export type AdminDashboardResponse = {
  totals: {
    totalLeads: number;
    totalAffiliates: number;
    totalReferralClicks: number;
    totalOrders: number;
    totalCommissions: number;
    totalPayouts: number;
    suspiciousActivityCount: number;
  };
  recentLeads: AdminLeadRecord[];
  recentOrders: AdminOrderRecord[];
  recentAffiliateSignups: AdminAffiliateRecord[];
};

export type CouponRecord = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  couponType: CouponType;
  discountPercent: number;
  autoApply: boolean;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  usageCount: number;
  lastRedeemedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminCouponRecord = CouponRecord;

export type AdminCouponsResponse = {
  coupons: AdminCouponRecord[];
  totals: {
    totalCoupons: number;
    activeCoupons: number;
    oneTimeCoupons: number;
    periodicCoupons: number;
    redeemedCoupons: number;
  };
};

export type AdminCourseRecord = {
  recordId: string;
  slug: string;
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Test Prep" | "Flexible" | "Senior Support";
  deliveryFormat: "In-class" | "In-car" | "In-class + In-car";
  duration: string;
  detail: string;
  description: string;
  highlights: string[];
  tone: string;
  image: string;
  quizTags: string[];
  pricing: {
    fixedPrice?: number;
    sixtyMinuteClasses?: number;
    ninetyMinuteClasses?: number;
    discountPercent?: number;
  };
  fixedPrice: number | null;
  sixtyMinuteClasses: number;
  ninetyMinuteClasses: number;
  discountPercent: number;
  isVisible: boolean;
  displayOrder: number;
  basePrice: number;
  discountedPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminCoursesResponse = {
  courses: AdminCourseRecord[];
  totals: {
    totalCourses: number;
    visibleCourses: number;
    hiddenCourses: number;
    discountedCourses: number;
  };
};

export type AdminKnowledgeTestQuestionRecord = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: KnowledgeTestQuestionOptionKey;
  explanation: string | null;
  category: KnowledgeTestQuestionCategory;
  createdAt: string;
  updatedAt: string;
};

export type AdminKnowledgeTestQuestionsResponse = {
  questions: AdminKnowledgeTestQuestionRecord[];
  totals: {
    totalQuestions: number;
    categoriesCovered: number;
    withExplanations: number;
    roadSigns: number;
    rulesOfTheRoad: number;
    hazardAwareness: number;
    safeDriving: number;
    roadMarkings: number;
  };
};

export type PublicCheckoutInvoice = {
  id: string;
  publicToken: string;
  title: string;
  description: string | null;
  amount: number;
  currency: string;
  customerName: string | null;
  customerEmail: string | null;
  status: CheckoutInvoiceStatus;
  expiresAt: string | null;
  createdAt: string;
};

export type AffiliateStatusUpdateInput = {
  affiliateId: string;
  status: AffiliateStatus;
  note?: string;
};

export type AffiliateDetailsUpdateInput = {
  affiliateId: string;
  name: string;
  email: string;
  phone?: string;
  socialMediaLink?: string;
  preferredPayoutMethod: PreferredPayoutMethod;
  status: AffiliateStatus;
  commissionRate: number;
  cookieDurationDays: number;
  note?: string;
};

export type LeadStatusUpdateInput = {
  leadId: string;
  status: LeadStatus;
};

export type CommissionStatusUpdateInput = {
  commissionId: string;
  status: Extract<CommissionStatus, "approved" | "paid" | "reversed" | "rejected">;
  reversalReason?: string;
};

export type PayoutActionInput =
  | {
      action: "create";
      affiliateId: string;
      amount?: number;
      note?: string;
    }
  | {
      action: "approve" | "paid" | "cancel";
      payoutId: string;
      note?: string;
    };

export type AdminLeadUpsertInput = {
  id?: string;
  leadType: LeadType;
  fullName?: string;
  email?: string;
  phone?: string;
  sourcePage: string;
  status: LeadStatus;
  payload: Record<string, unknown>;
  createdAt?: string | null;
};

export type AdminAffiliateUpsertInput = {
  id?: string;
  authUserId?: string;
  affiliateCode?: string;
  name: string;
  email: string;
  phone?: string;
  age?: number | null;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianConsent?: boolean;
  socialMediaLink?: string;
  preferredPayoutMethod: PreferredPayoutMethod;
  status: AffiliateStatus;
  commissionRate: number;
  cookieDurationDays: number;
  notes?: string;
  createdAt?: string | null;
  approvedAt?: string | null;
  blockedAt?: string | null;
};

export type AdminReferralUpsertInput = {
  id?: string;
  affiliateRecordId: string;
  referralCode: string;
  landingPath: string;
  ipAddress?: string;
  userAgent?: string;
  fingerprintHash?: string;
  isSuspicious: boolean;
  suspicionReason?: string;
  createdAt?: string | null;
};

export type AdminOrderUpsertInput = {
  id?: string;
  externalOrderId?: string;
  customerId?: string;
  customerEmail?: string;
  packageName: string;
  amount: number;
  paymentStatus: PaymentStatus;
  affiliateRecordId?: string | null;
  affiliateClickId?: string | null;
  referralCode?: string;
  customerIp?: string;
  customerUserAgent?: string;
  fingerprintHash?: string;
  isSelfReferral: boolean;
  isSuspicious: boolean;
  fraudFlags: string[];
  metadata: Record<string, unknown>;
  purchasedAt?: string | null;
  createdAt?: string | null;
};

export type AdminInvoiceUpsertInput = {
  id?: string;
  publicToken?: string;
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  status: CheckoutInvoiceStatus;
  expiresAt?: string | null;
  paidAt?: string | null;
  lastOrderId?: string | null;
  metadata: Record<string, unknown>;
  createdAt?: string | null;
};

export type AdminCommissionUpsertInput = {
  id?: string;
  affiliateRecordId: string;
  orderId: string;
  purchaseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  reversalReason?: string;
  createdAt?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  reversedAt?: string | null;
};

export type AdminPayoutUpsertInput = {
  id?: string;
  affiliateRecordId: string;
  amount: number;
  paymentMethod: PreferredPayoutMethod;
  paymentStatus: PayoutStatus;
  commissionIds: string[];
  notes?: string;
  requestedAt?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  createdAt?: string | null;
};

export type AdminRateLimitUpsertInput = {
  originalKey?: string;
  key: string;
  endpoint: string;
  windowStart: string;
  count: number;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminCouponUpsertInput = {
  id?: string;
  code: string;
  label: string;
  description?: string;
  couponType: CouponType;
  discountPercent: number;
  autoApply: boolean;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  usageCount: number;
  lastRedeemedAt?: string | null;
  createdAt?: string | null;
};

export type AdminCourseUpsertInput = {
  recordId?: string;
  slug: string;
  title: string;
  level: AdminCourseRecord["level"];
  deliveryFormat: AdminCourseRecord["deliveryFormat"];
  duration: string;
  detail: string;
  description: string;
  highlights: string[];
  tone: string;
  image: string;
  quizTags: string[];
  fixedPrice?: number | null;
  sixtyMinuteClasses: number;
  ninetyMinuteClasses: number;
  discountPercent: number;
  isVisible: boolean;
  displayOrder: number;
};

export type AdminKnowledgeTestQuestionUpsertInput = {
  id?: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: KnowledgeTestQuestionOptionKey;
  explanation?: string | null;
  category: KnowledgeTestQuestionCategory;
  createdAt?: string | null;
};

export type AdminSessionResponse = {
  isAdmin: boolean;
};


