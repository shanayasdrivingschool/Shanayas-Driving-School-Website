import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { sitePolicies } from "@/data/policies";
import { getPolicyIcon } from "@/data/policyIcons";

// Lead with the policies people actually look for; anything unlisted falls to the end.
const policyOrder = [
  "privacy-policy",
  "terms-and-conditions",
  "promotions-and-discounts",
  "in-vehicle-passenger-policy",
];

const orderIndex = (id: string) => {
  const index = policyOrder.indexOf(id);
  return index === -1 ? policyOrder.length : index;
};

const publicPolicies = sitePolicies
  .filter((policy) => policy.id !== "installment-policy")
  .slice()
  .sort((a, b) => orderIndex(a.id) - orderIndex(b.id));

const Policies = () => (
  <main className="bg-white text-[#202121]">
    <section className="relative bg-[#1d52a1] text-white">
      <SiteHeader tone="brand" />
      <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32">
        <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Link to="/" className="text-white/80 transition-colors hover:text-white">
            Home
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-white/55">Policies</span>
        </nav>

        <h1
          className="mx-auto mt-6 max-w-3xl text-center text-[clamp(2rem,4.6vw,3.25rem)] font-black leading-[1.1]"
          style={{ textWrap: "balance" }}
        >
          Policies
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-white/80">
          Browse each published policy on its own page, including privacy, payments, promotions, and website terms.
        </p>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">Read the policy that applies to you</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          These policies explain how we handle your privacy, payments, promotions, and lessons. Open the one relevant to
          you — or contact us if anything's unclear.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {publicPolicies.map((policy) => {
          const Icon = getPolicyIcon(policy.id);

          return (
            <Link
              key={policy.id}
              to={policy.href}
              aria-label={`${policy.label} — read policy`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 outline-none transition-all hover:border-[#1d52a1] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-[#1d52a1]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-slate-900">{policy.label}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{policy.cardDescription}</p>

              <ul className="mt-4 space-y-2">
                {policy.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-end pt-6">
                <span
                  className="text-sm font-bold text-[#E6242A] transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  Open &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Questions about a policy?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Contact the school before enrolling if you need clarification on any published policy.
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

export default Policies;
