import { CreditCard, Gavel, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { sitePolicies } from "@/data/policies";

const policyIconMap = {
  "privacy-policy": ShieldCheck,
  "installment-policy": CreditCard,
  "terms-and-conditions": Gavel,
} as const;
const publicPolicies = sitePolicies.filter((policy) => policy.id !== "installment-policy");

const Policies = () => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow="Policies, terms, and payment rules"
      title={<span className="text-white">Policies</span>}
      description="Browse each published policy on its own page, including privacy and website terms."
      backgroundImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80"
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Browse</p>
      <h1 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Policy Library</h1>
      <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
        Each policy now opens on its own page so it can be shared, reviewed, and referenced directly.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {publicPolicies.map((policy) => {
          const Icon = policyIconMap[policy.id as keyof typeof policyIconMap];

          return (
            <article key={policy.id} className="flex h-full flex-col rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-[#1d52a1]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-2xl font-black text-slate-900">{policy.label}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{policy.cardDescription}</p>
              <div className="mt-5 space-y-3">
                {policy.highlights.map((highlight) => (
                  <div key={highlight} className="rounded-2xl bg-[#F2F2F2] px-4 py-3 text-sm font-semibold text-slate-700">
                    {highlight}
                  </div>
                ))}
              </div>
              <Link
                to={policy.href}
                className="mt-6 inline-flex items-center text-sm font-bold text-[#E6242A] transition-colors hover:text-[#C41E23]"
              >
                Open policy
              </Link>
            </article>
          );
        })}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="rounded-[36px] bg-[#1d52a1] p-6 text-white sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-200">Support</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Need clarification about a policy before booking?</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-100 sm:text-lg">
              Contact the school before enrolling or sharing a referral link if you need clarification on any published
              policy.
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

export default Policies;


