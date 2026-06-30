import { Fragment } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

type CheckoutProgressBarProps = {
  className?: string;
  currentStep: 1 | 2 | 3;
  highestAccessibleStep?: 1 | 2 | 3;
  querySuffix?: string;
};

const checkoutSteps = [
  { step: 1, label: "Summary" },
  { step: 2, label: "Information" },
  { step: 3, label: "Payment" },
] as const;

const getStepState = (step: number, currentStep: CheckoutProgressBarProps["currentStep"]) => {
  if (step < currentStep) {
    return "complete";
  }

  if (step === currentStep) {
    return "current";
  }

  return "upcoming";
};

export default function CheckoutProgressBar({
  className = "",
  currentStep,
  highestAccessibleStep = currentStep,
  querySuffix = "",
}: CheckoutProgressBarProps) {
  return (
    <div className={`${className} rounded-3xl border border-slate-200 bg-[#F8FAFC] p-5`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {checkoutSteps.map((item, index) => {
          const stepState = getStepState(item.step, currentStep);
          const isAccessible = item.step <= highestAccessibleStep;
          const isClickable = isAccessible && item.step !== currentStep;
          const stepHref =
            item.step === 1
              ? `/checkout${querySuffix}`
              : item.step === 2
                ? `/checkout/information${querySuffix}`
                : `/checkout/payment${querySuffix}`;
          const stepContent = (
            <>
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-black transition-colors ${
                  stepState === "complete"
                    ? "border-[#1d52a1] bg-white text-[#1d52a1]"
                    : stepState === "current"
                      ? "border-[#1d52a1] bg-[#1d52a1] text-white"
                      : isAccessible
                        ? "border-slate-300 bg-white text-slate-600"
                        : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {stepState === "complete" ? <Check className="h-4 w-4" /> : item.step}
              </span>

              <div className="min-w-0">
                <p
                  className={`text-[11px] font-black uppercase tracking-[0.16em] ${
                    stepState === "current" ? "text-[#1d52a1]" : "text-slate-500"
                  }`}
                >
                  Step {item.step}
                </p>
                <p className="text-sm font-bold text-slate-900 sm:text-base">{item.label}</p>
              </div>
            </>
          );

          return (
            <Fragment key={item.step}>
              {isClickable ? (
                <Link
                  to={stepHref}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#1d52a1]/30"
                >
                  {stepContent}
                </Link>
              ) : (
                <div
                  aria-current={stepState === "current" ? "step" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  {stepContent}
                </div>
              )}

              {index < checkoutSteps.length - 1 ? (
                <div
                  className={`hidden h-1 flex-1 rounded-full md:block ${
                    item.step < currentStep ? "bg-[#1d52a1]" : "bg-slate-200"
                  }`}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
