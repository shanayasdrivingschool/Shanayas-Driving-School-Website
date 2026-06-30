import { AlertTriangle, CreditCard, Gavel, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { sitePolicies } from "@/data/policies";

const policyIconMap = {
  "privacy-policy": ShieldCheck,
  "installment-policy": CreditCard,
  "terms-and-conditions": Gavel,
} as const;

const normalizeProgramName = (text: string) =>
  text
    .replaceAll("Ruley Rewards referrals", "Ruley Rewards Program activity")
    .replaceAll("Ruley Rewards Referral Program", "Ruley Rewards Program")
    .replaceAll("participating in referral programs", "participating in the Ruley Rewards Program")
    .replaceAll("Referral Program Data", "Ruley Rewards Program Data")
    .replaceAll("Referral program participation", "Ruley Rewards Program participation")
    .replaceAll("administer referral program tracking", "administer Ruley Rewards Program tracking")
    .replaceAll("Participants in the referral program", "Participants in the Ruley Rewards Program")
    .replaceAll("services, or referral program", "services, or the Ruley Rewards Program");

const installmentPlanOverrides = [
  { duration: "2-month plan", frequency: "Monthly", requirement: "Standard enrollment" },
  { duration: "3-month plan", frequency: "Monthly", requirement: "Standard enrollment" },
  { duration: "4-month plan", frequency: "Monthly", requirement: "Standard enrollment" },
];
const publicPolicies = sitePolicies.filter((policy) => policy.id !== "installment-policy");

const PolicyDetail = () => {
  const { policyId = "" } = useParams();
  const policy = publicPolicies.find((entry) => entry.id === policyId);

  if (!policy) {
    return <NotFound />;
  }

  const normalizedPolicy = {
    ...policy,
    cardDescription: normalizeProgramName(policy.cardDescription),
    intro: normalizeProgramName(policy.intro),
    highlights: policy.highlights.map((highlight) =>
      policy.id === "installment-policy"
        ? normalizeProgramName(highlight).replace("4 approved installment options", "3 approved installment options")
        : normalizeProgramName(highlight),
    ),
    sections: policy.sections.map((section) => ({
      ...section,
      title: normalizeProgramName(section.title),
      paragraphs: section.paragraphs.map((paragraph) => normalizeProgramName(paragraph)),
      bullets: section.bullets?.map((bullet) => normalizeProgramName(bullet)),
      note: section.note ? normalizeProgramName(section.note) : section.note,
    })),
    installmentPlans: policy.id === "installment-policy" ? installmentPlanOverrides : policy.installmentPlans,
  };

  const Icon = policyIconMap[policy.id as keyof typeof policyIconMap];

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Published policy"
        title={<span className="text-white">{normalizedPolicy.label}</span>}
        description={normalizedPolicy.cardDescription}
        backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/policies"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"
          >
            All policies
          </Link>
          {publicPolicies.map((entry) => {
            const isActive = entry.id === normalizedPolicy.id;

            return (
              <Link
                key={entry.id}
                to={entry.href}
                className={isActive
                  ? "inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-4 py-2 text-sm font-bold text-white"
                  : "inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:bg-[#1d52a1] hover:text-white"}
              >
                {entry.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E6242A]">Published policy</p>
              <div className="mt-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1] shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h1 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
                {normalizedPolicy.label}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{normalizedPolicy.intro}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {normalizedPolicy.highlights.map((highlight) => (
                <article key={highlight} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">Key point</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">{highlight}</p>
                </article>
              ))}
            </div>
          </div>

          {normalizedPolicy.installmentPlans ? (
            <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700 lg:px-6">
                        Plan duration
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700 lg:px-6">
                        Frequency
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-700 lg:px-6">
                        Requirement
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedPolicy.installmentPlans.map((plan, planIndex) => (
                      <tr key={plan.duration} className={planIndex % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="px-5 py-5 text-base font-bold text-slate-900 lg:px-6">{plan.duration}</td>
                        <td className="px-5 py-5 text-sm font-semibold text-slate-700 lg:px-6">{plan.frequency}</td>
                        <td className="px-5 py-5 text-sm text-slate-700 lg:px-6">{plan.requirement}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-200 bg-[#1d52a1]/5 px-5 py-4 lg:px-6">
                <p className="text-sm leading-relaxed text-slate-700">
                  Specific installment amounts and due dates are confirmed during registration through the payment
                  schedule issued for the selected course or package.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-10 rounded-[32px] border border-slate-200 bg-white px-6 py-3 shadow-sm sm:px-8">
            <Accordion type="single" collapsible className="w-full">
              {normalizedPolicy.sections.map((section, sectionIndex) => (
                <AccordionItem
                  key={`${normalizedPolicy.id}-${section.title}`}
                  value={`${normalizedPolicy.id}-${sectionIndex}`}
                  className="border-slate-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex flex-col items-start gap-2 py-2 sm:flex-row sm:items-center sm:gap-4">
                      <span className="inline-flex rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">
                        Section {sectionIndex + 1}
                      </span>
                      <span className="text-lg font-black text-slate-900 sm:text-2xl">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-7 text-slate-600">
                    <div className="space-y-4">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-relaxed sm:text-base">
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {section.bullets ? (
                      <ul className="mt-5 space-y-3">
                        {section.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-3 rounded-2xl bg-[#F2F2F2] px-4 py-4 text-sm leading-relaxed text-slate-700 sm:text-base"
                          >
                            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[#E6242A]">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {section.note ? (
                      <div className="mt-5 rounded-2xl border border-[#1d52a1]/20 bg-[#1d52a1]/5 px-4 py-4">
                        <p className="text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">{section.note}</p>
                      </div>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-[36px] bg-[#1d52a1] p-6 text-white sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-200">Support</p>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">Need clarification about this policy?</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-100 sm:text-lg">
                Contact the school before enrolling or sharing a referral link if you need clarification on this policy.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-white px-8 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-slate-100"
              >
                Contact us
              </Link>
              <Link
                to="/apply"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-white px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1d52a1]"
              >
                Book your driving lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default PolicyDetail;


