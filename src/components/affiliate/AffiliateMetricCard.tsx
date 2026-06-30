import type { ReactNode } from "react";

type AffiliateMetricCardProps = {
  label: string;
  value: string;
  note?: string;
  icon?: ReactNode;
};

const AffiliateMetricCard = ({ label, value, note, icon }: AffiliateMetricCardProps) => (
  <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</p>
        <p className="mt-3 text-4xl font-black text-[#1d52a1]">{value}</p>
        {note ? <p className="mt-3 text-sm leading-relaxed text-slate-600">{note}</p> : null}
      </div>
      {icon ? <div className="rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">{icon}</div> : null}
    </div>
  </article>
);

export default AffiliateMetricCard;
