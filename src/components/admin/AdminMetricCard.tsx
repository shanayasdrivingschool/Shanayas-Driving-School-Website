import type { ReactNode } from "react";

type AdminMetricCardProps = {
  label: string;
  value: string;
  note?: string;
  // Retained for callers; metrics use typography rather than decorative icons.
  icon?: ReactNode;
};

const AdminMetricCard = ({ label, value, note }: AdminMetricCardProps) => (
  <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
    <p className="text-sm leading-5 text-slate-600">{label}</p>
    <p className="mt-3 break-words text-3xl font-medium tabular-nums leading-none text-slate-900">{value}</p>
    {note ? <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p> : null}
  </article>
);

export default AdminMetricCard;
