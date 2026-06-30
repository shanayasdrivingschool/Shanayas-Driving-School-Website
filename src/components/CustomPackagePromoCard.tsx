import type { ReactNode } from "react";

type CustomPackagePromoCardProps = {
  action: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  eyebrow?: string;
};

const CustomPackagePromoCard = ({
  action,
  className = "",
  title = "Make Your Own Package",
  description = "Choose the courses you want from our full course list and let us build a plan around your goals, pace, and schedule.",
  eyebrow = "Custom option",
}: CustomPackagePromoCardProps) => (
  <article
    className={`mt-6 flex flex-col gap-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:flex-row lg:items-center lg:justify-between lg:p-10 ${className}`.trim()}
  >
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E6242A]">{eyebrow}</p> : null}
      <h3 className={`${eyebrow ? "mt-3" : ""} text-3xl font-black text-slate-900 sm:text-4xl`.trim()}>{title}</h3>
      {description ? <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p> : null}
    </div>

    <div className="w-full lg:w-auto [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto">{action}</div>
  </article>
);

export default CustomPackagePromoCard;
