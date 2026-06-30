import {
  affiliateStatusLabels,
  commissionStatusLabels,
  payoutStatusLabels,
} from "@/lib/affiliateProgram";
import type { AffiliateStatus, CommissionStatus, PayoutStatus } from "@/lib/affiliateTypes";
import { cn } from "@/lib/utils";

type AffiliateStatusBadgeProps =
  | {
      type: "affiliate";
      value: AffiliateStatus;
    }
  | {
      type: "commission";
      value: CommissionStatus;
    }
  | {
      type: "payout";
      value: PayoutStatus;
    };

const toneMap = {
  approved: "bg-[#1d52a1]/10 text-[#1d52a1]",
  paid: "bg-[#1d52a1]/10 text-[#1d52a1]",
  pending: "bg-[#F5B13A]/15 text-[#9A6400]",
  blocked: "bg-[#E6242A]/10 text-[#B91C1C]",
  reversed: "bg-[#E6242A]/10 text-[#B91C1C]",
  rejected: "bg-[#E6242A]/10 text-[#B91C1C]",
  failed: "bg-[#E6242A]/10 text-[#B91C1C]",
  cancelled: "bg-slate-200 text-slate-700",
} as const;

const AffiliateStatusBadge = ({ type, value }: AffiliateStatusBadgeProps) => {
  const label =
    type === "affiliate"
      ? affiliateStatusLabels[value]
      : type === "commission"
        ? commissionStatusLabels[value]
        : payoutStatusLabels[value];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        toneMap[value],
      )}
    >
      {label}
    </span>
  );
};

export default AffiliateStatusBadge;
