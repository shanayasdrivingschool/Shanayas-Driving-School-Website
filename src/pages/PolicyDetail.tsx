import { AlertTriangle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { sitePolicies } from "@/data/policies";
import { getPolicyIcon } from "@/data/policyIcons";

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

const publicPolicies = sitePolicies.filter((policy) => policy.id !== "installment-policy");

const sectionAnchorId = (index: number) => `policy-section-${index}`;

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
    highlights: policy.highlights.map((highlight) => normalizeProgramName(highlight)),
    sections: policy.sections.map((section) => ({
      ...section,
      title: normalizeProgramName(section.title),
      paragraphs: section.paragraphs.map((paragraph) => normalizeProgramName(paragraph)),
      bullets: section.bullets?.map((bullet) => normalizeProgramName(bullet)),
      note: section.note ? normalizeProgramName(section.note) : section.note,
    })),
  };

  const Icon = getPolicyIcon(policy.id);

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow="Published policy"
        title={<span className="text-white">{normalizedPolicy.label}</span>}
        description={normalizedPolicy.cardDescription}
        backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
          <Link to="/policies" className="font-semibold text-slate-600 transition-colors hover:text-[#1d52a1]">
            Policies
          </Link>
          <span aria-hidden="true" className="text-slate-300">/</span>
          <span aria-current="page" className="text-slate-400">{normalizedPolicy.label}</span>
        </nav>

        <div className="mt-8 flex items-center gap-2 text-[#E6242A]">
          <Icon className="h-4 w-4" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Published policy</p>
        </div>
        <p className="mt-3 text-sm text-slate-500">Effective {normalizedPolicy.effectiveDate}</p>
        <p className="mt-5 max-w-[68ch] text-lg leading-relaxed text-slate-600">{normalizedPolicy.intro}</p>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {normalizedPolicy.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1d52a1]" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-12 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-slate-200">
                {normalizedPolicy.sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#${sectionAnchorId(index)}`}
                      className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-sm text-slate-500 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            <details className="mb-8 border-y border-slate-200 py-3 lg:hidden">
              <summary className="cursor-pointer text-sm font-bold text-slate-700">Contents</summary>
              <ul className="mt-3 space-y-2">
                {normalizedPolicy.sections.map((section, index) => (
                  <li key={section.title}>
                    <a href={`#${sectionAnchorId(index)}`} className="text-sm text-slate-500 hover:text-[#1d52a1]">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            <div className="space-y-10">
              {normalizedPolicy.sections.map((section, index) => (
                <section
                  key={section.title}
                  id={sectionAnchorId(index)}
                  className="scroll-mt-24 border-t border-slate-200 pt-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{section.title}</h2>

                  <div className="mt-4 max-w-[68ch] space-y-4 text-slate-600">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.bullets ? (
                    <ul className="mt-4 max-w-[68ch] space-y-2.5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-slate-600">
                          {section.tone === "warning" ? (
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E6242A]" aria-hidden="true" />
                          ) : (
                            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                          )}
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.note ? (
                    <p className="mt-5 max-w-[68ch] border-l-2 border-[#1d52a1]/40 pl-4 leading-relaxed text-slate-600">
                      {section.note}
                    </p>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Need clarification about this policy?</h2>
              <p className="mt-2 text-sm text-slate-600">
                Contact the school before enrolling if you have questions about this policy.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#17417f]"
              >
                Contact us
              </Link>
              <Link
                to="/apply"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-[#1d52a1] hover:text-[#1d52a1]"
              >
                Book a lesson
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
