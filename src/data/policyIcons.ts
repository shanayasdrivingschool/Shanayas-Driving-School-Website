import { CalendarClock, CreditCard, FileText, Gavel, Percent, ShieldCheck, Users, type LucideIcon } from "lucide-react";

/**
 * Single source of truth for the icon shown against each policy. Shared by the
 * Policy Library index and the Policy detail page so the two never drift, and
 * so a newly added policy id can never crash a render (see `getPolicyIcon`).
 */
export const policyIcons: Record<string, LucideIcon> = {
  "privacy-policy": ShieldCheck,
  "installment-policy": CreditCard,
  "in-vehicle-passenger-policy": Users,
  "promotions-and-discounts": Percent,
  "cancellation-and-rescheduling": CalendarClock,
  "terms-and-conditions": Gavel,
};

/** Resolve a policy id to its icon, falling back to a neutral document glyph. */
export const getPolicyIcon = (id: string): LucideIcon => policyIcons[id] ?? FileText;
