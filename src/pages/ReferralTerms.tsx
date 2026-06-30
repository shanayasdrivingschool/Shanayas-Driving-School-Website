import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import {
  REFERRAL_TERMS_EFFECTIVE_DATE_LABEL,
  REFERRAL_TERMS_PATH,
  referralTermsClosing,
  referralTermsIntro,
  referralTermsSections,
} from "@/data/referralTerms";

const normalizeProgramName = (text: string) =>
  text
    .replaceAll("Ruley Rewards Referral Program", "Ruley Rewards Program")
    .replaceAll("misuses the referral program", "misuses the Ruley Rewards Program")
    .replaceAll("terminate the referral program", "terminate the Ruley Rewards Program")
    .replaceAll("administering the referral program", "administering the Ruley Rewards Program");

const ReferralTerms = () => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow="Ruley Rewards Program"
      title={<span className="text-white">Terms & Conditions</span>}
      description="These terms outline participation in the Ruley Rewards Program, including eligibility, referrals, commissions, conduct, and payout guidelines."
      backgroundImage="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2200&q=80"
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E6242A]">Ruley Rewards Program</p>
        <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl lg:text-5xl">Terms and Conditions</h2>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
          Effective Date: {REFERRAL_TERMS_EFFECTIVE_DATE_LABEL}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">Jurisdiction</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">British Columbia, Canada</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">Program scope</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">Ruley Rewards Program signup, referral tracking, commissions, payouts, and participant conduct.</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-[#F8FAFC] p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">Acceptance</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">Participation in the program is conditional on agreement to these published terms.</p>
          </article>
        </div>

        <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-600">
          {referralTermsIntro.map((paragraph) => (
            <p key={paragraph}>{normalizeProgramName(paragraph)}</p>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[30px] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E6242A]">On this page</p>
          <nav className="mt-5">
            <ul className="space-y-2">
              {referralTermsSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white hover:text-[#1d52a1]"
                  >
                    {section.number}. {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 rounded-[24px] bg-white p-4 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-600">Need the signup form?</p>
            <Link
              to="/affiliate/signup"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-[#1d52a1] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#163f7c]"
            >
              Create account
            </Link>
          </div>
        </aside>

        <div className="space-y-6">
          {referralTermsSections.map((section) => (
            <section
              id={section.id}
              key={section.id}
              className="scroll-mt-28 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#E6242A]">Section {section.number}</p>
                  <h2 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{section.title}</h2>
                </div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d52a1]/10 text-lg font-black text-[#1d52a1]">
                  {section.number}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                {section.entries.map((entry, index) => (
                  <div key={`${section.id}-${entry.id ?? index}`} className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
                      {entry.id ? <span className="mr-2 font-black text-slate-900">{entry.id}</span> : null}
                      {normalizeProgramName(entry.text)}
                    </p>

                    {entry.bullets ? (
                      <ul className="space-y-3">
                        {entry.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="rounded-[20px] border border-slate-200 bg-[#F8FAFC] px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-base"
                          >
                            {normalizeProgramName(bullet)}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[32px] bg-[#1d52a1] p-6 text-white shadow-sm sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-100">Acknowledgement</p>
            <p className="mt-4 text-base leading-relaxed text-slate-100 sm:text-lg">{normalizeProgramName(referralTermsClosing)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/affiliate/signup"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-slate-100"
              >
                Return to signup
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[#1d52a1]"
              >
                Contact Shanaya's Driving School
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="rounded-[36px] border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Program notice</p>
        <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Read the terms before sharing your referral link</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          If you intend to join the Ruley Rewards Program, review these terms carefully and keep a copy for your records. Continued participation after future updates remains subject to the latest published version at <span className="font-semibold text-slate-900">{REFERRAL_TERMS_PATH}</span>.
        </p>
      </div>
    </section>

    <SiteFooter />
  </main>
);

export default ReferralTerms;
