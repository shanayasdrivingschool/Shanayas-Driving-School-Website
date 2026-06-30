import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  label: string;
  toneClassName: string;
};

const AdminStatusBadge = ({ label, toneClassName }: AdminStatusBadgeProps) => (
  <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", toneClassName)}>
    {label}
  </span>
);

export default AdminStatusBadge;
