import type { ReactNode } from "react";

type AdminMetricCardProps = {
  label: string;
  value: string;
  note?: string;
  icon?: ReactNode;
};

/* A compact counterpart to the affiliate dashboard's metric card.

   That one is built for a page a customer visits occasionally: a 28px radius, 24px of
   padding, a drop shadow and a 36px figure. The admin panel shows up to seven of them in a
   row above a table someone is scanning, where that scale turns a summary strip into a
   third of the viewport. Same information, a quarter of the height -- and it stays a
   separate component so the affiliate side keeps its own proportions. */
const AdminMetricCard = ({ label, value, note, icon }: AdminMetricCardProps) => (
  <article className="rounded-xl border border-slate-200 bg-white px-4 py-3">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        {/* Tabular figures keep the width steady as the number changes behind a filter. */}
        <p className="mt-1 text-2xl font-black tabular-nums leading-none text-slate-900">{value}</p>
        {note ? <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{note}</p> : null}
      </div>
      {icon ? <span className="shrink-0 text-slate-400">{icon}</span> : null}
    </div>
  </article>
);

export default AdminMetricCard;
