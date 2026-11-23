import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  label: string;
  toneClassName: string;
};

const AdminStatusBadge = ({ label, toneClassName }: AdminStatusBadgeProps) => (
  <span className={cn("inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium", toneClassName)}>
    {label}
  </span>
);

export default AdminStatusBadge;
