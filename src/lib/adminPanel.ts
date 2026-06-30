import type {
  AffiliateStatus,
  LeadStatus,
  LeadType,
  PaymentStatus,
} from "@/lib/affiliateTypes";

export const ADMIN_ROWS_PER_PAGE = 50;

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Invoices", to: "/admin/invoices" },
  { label: "Courses", to: "/admin/courses" },
  { label: "Knowledge Test", to: "/admin/knowledge-test" },
  { label: "Leads", to: "/admin/leads" },
  { label: "Coupons", to: "/admin/coupons" },
  { label: "Affiliates", to: "/admin/affiliates" },
  { label: "Referrals", to: "/admin/referrals" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Commissions", to: "/admin/commissions" },
  { label: "Payouts", to: "/admin/payouts" },
  { label: "Rate Limits", to: "/admin/rate-limits" },
] as const;

export const leadTypeLabels: Record<LeadType, string> = {
  contact: "Contact",
  student_assessment: "Student assessment",
  employee_application: "Employee application",
  custom_package_request: "Custom package request",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  pending_review: "Pending review",
  reviewed: "Reviewed",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  pending_payment: "Pending payment",
  processing_payment: "Processing payment",
  paid: "Paid",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

export const affiliateStatusTone: Record<AffiliateStatus, string> = {
  pending: "bg-[#F5B13A]/15 text-[#9A6400]",
  approved: "bg-[#1d52a1]/10 text-[#1d52a1]",
  blocked: "bg-[#E6242A]/10 text-[#B91C1C]",
};

export const leadStatusTone: Record<LeadStatus, string> = {
  new: "bg-[#1d52a1]/10 text-[#1d52a1]",
  pending_review: "bg-[#F5B13A]/15 text-[#9A6400]",
  reviewed: "bg-[#1d52a1]/10 text-[#1d52a1]",
  shortlisted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-[#E6242A]/10 text-[#B91C1C]",
};

export const paymentStatusTone: Record<PaymentStatus, string> = {
  pending: "bg-[#F5B13A]/15 text-[#9A6400]",
  pending_payment: "bg-[#F5B13A]/15 text-[#9A6400]",
  processing_payment: "bg-sky-100 text-sky-700",
  paid: "bg-[#1d52a1]/10 text-[#1d52a1]",
  cancelled: "bg-slate-200 text-slate-700",
  refunded: "bg-[#E6242A]/10 text-[#B91C1C]",
  failed: "bg-[#E6242A]/10 text-[#B91C1C]",
};

export const matchesSearch = (query: string, values: Array<string | null | undefined>) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
};

export const isWithinDateRange = (value: string | null | undefined, dateFrom: string, dateTo: string) => {
  if (!value) return false;

  const dateValue = new Date(value);
  if (Number.isNaN(dateValue.getTime())) return false;

  if (dateFrom) {
    const from = new Date(`${dateFrom}T00:00:00`);
    if (dateValue < from) return false;
  }

  if (dateTo) {
    const to = new Date(`${dateTo}T23:59:59.999`);
    if (dateValue > to) return false;
  }

  return true;
};

export const paginateItems = <T,>(items: T[], page: number, pageSize = ADMIN_ROWS_PER_PAGE) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    page: safePage,
    totalPages,
    items: items.slice(start, start + pageSize),
  };
};

export const buildPaginationWindow = (page: number, totalPages: number) => {
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  return Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
};
