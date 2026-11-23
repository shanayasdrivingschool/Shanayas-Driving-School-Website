import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { roadTestConfidenceProgramme as programme } from "@/data/roadTestConfidence";

const container = "mx-auto max-w-6xl px-4 sm:px-6";
const button = "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#C91F24] px-6 py-3 text-sm font-bold text-white hover:bg-[#ad191e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300";
const link = "inline-flex min-h-[44px] items-center font-bold text-[#1d52a1] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";
const price = (amount: number) => `$${amount.toLocaleString("en-CA")}`;
type Props = { onPrimaryCta: (location: string, trigger: HTMLElement, packageName?: string) => void };

export function RoadTestConfidencePackages({ onPrimaryCta }: Props) {
  return (
    <section id="confidence-packages" aria-labelledby="pricing-heading" className="scroll-mt-5 bg-[#F7F8FA] py-12 sm:py-16">
      <div className={container}>
        <h2 id="pricing-heading" className="text-2xl font-black tracking-tight sm:text-3xl">Choose Your Road Test Confidence Package</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">Both options include the same training and conditional retest lessons. The difference is whether you want the school car for your covered road tests.</p>
        <div className="mt-7 grid items-stretch gap-5 md:grid-cols-2">
          {programme.packages.map((item) => (
            <article key={item.id} className={`flex flex-col rounded-2xl border bg-white p-6 sm:p-7 ${item.includesTestCar ? "border-[#1d52a1]" : "border-slate-200"}`}>
              <p className="text-sm font-bold text-[#1d52a1]">{item.label}</p>
              <h3 className="mt-2 text-2xl font-black text-[#0B1A33]">{item.name}</h3>
              <p className="mt-4 text-4xl font-black tracking-tight">{price(item.price)} <span className="text-sm font-medium tracking-normal text-slate-600">CAD + GST</span></p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-700">
                {[
                  "15 initial hours: 10 private lessons of 90 minutes",
                  "Up to 15 more hours after unsuccessful ICBC road tests",
                  "Included lesson support across up to 4 total attempts",
                  "School vehicle during all included training lessons",
                  item.includesTestCar ? "Up to 4 covered test-day vehicle uses" : "Arrange your road-test vehicle separately",
                ].map((text) => <li key={text} className="flex items-start gap-2"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" /><span>{text}</span></li>)}
              </ul>
              <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{item.testCar} <strong>ICBC testing fees are separate.</strong></p>
              <div className="mt-auto pt-6"><button type="button" aria-label={`Request a Callback about ${item.name}`} onClick={(event) => onPrimaryCta(`product-${item.id}`, event.currentTarget, item.name)} className={`${button} w-full`}>Request a Callback <ArrowRight aria-hidden="true" className="h-4 w-4" /></button><p className="mt-2 text-center text-xs text-slate-600">Ask about this package. No payment to enquire.</p></div>
            </article>
          ))}
        </div>
        <p className="mt-5 max-w-4xl text-sm leading-relaxed text-slate-600">{programme.conditions}</p>
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-[#0B1A33]">Confirm your coverage before paying</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Ask for your package inclusions and any lesson-completion requirements in writing. Confirm your test centre, vehicle availability, and cancellation and refund terms before accepting the package.</p>
          <Link to="/policies/cancellation-and-rescheduling" className={`${link} mt-2 text-sm`}>School cancellation and refund policy</Link>
        </div>
        <aside aria-labelledby="instalments-heading" className="mt-8 rounded-2xl bg-[#0B1A33] p-6 text-white sm:p-8 lg:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
            <div>
              <h3 id="instalments-heading" className="max-w-xl text-2xl font-black leading-tight tracking-tight sm:text-3xl">Prefer to pay in instalments?</h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">Ask about eligible instalment options, including Klarna where available.</p>
            </div>
            <button type="button" onClick={(event) => onPrimaryCta("confidence-instalments", event.currentTarget)} className="inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-center text-sm font-bold text-[#0B1A33] transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 lg:w-auto">Ask about payment options <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></button>
          </div>
          <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-relaxed text-white/80">Available plans, purchase limits, interest or fees and repayment schedules depend on the provider. Approval is not guaranteed.</p>
        </aside>
      </div>
    </section>
  );
}

export function RoadTestConfidenceStages() {
  return (
    <section aria-labelledby="steps-heading" className="border-y border-slate-200 bg-[#F7F8FA] py-12 sm:py-16">
      <div className={container}>
        <h2 id="steps-heading" className="text-2xl font-black tracking-tight sm:text-3xl">What Happens If You Need Another Attempt?</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">A clear lesson allowance at each stage. Every lesson is 90 minutes, with no extra instruction charge for the included retest lessons.</p>
        <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programme.stages.map((stage) => <li key={stage.attempt} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-bold text-[#1d52a1]">Before attempt {stage.attempt}</p>
            <h3 className="mt-3 text-xl font-black text-[#0B1A33]">{stage.title}</h3>
            <p className="mt-1 font-bold text-slate-700">{stage.hours} hours</p>
            <p className="mt-4 text-sm font-semibold leading-relaxed">{stage.condition}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{stage.detail}</p>
          </li>)}
        </ol>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-600">The extra lessons are conditional, not an upfront 30-hour allowance. Support ends when you pass or after your fourth covered attempt. Extra training or test-day vehicle services beyond the package can be arranged separately, subject to availability.</p>
      </div>
    </section>
  );
}
