import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BranchBookingForm from "@/components/BranchBookingForm";
import { branchLocations, branchAddress, BRAND_NAME, BRANCH_PHONE, BRANCH_TEL, BRANCH_EMAIL, BRANCH_HOURS, ICBC_GLP_URL, type BranchLocation } from "@/data/branchLocations";

const primary = "inline-flex items-center justify-center rounded-full bg-[#F5B13A] px-6 py-3 text-center font-bold text-slate-950";
const secondary = "inline-flex items-center justify-center rounded-full border border-current px-6 py-3 text-center font-bold";
export const BranchContactActions = () => <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><a href={BRANCH_TEL} className={primary}>Call {BRANCH_PHONE} to Book</a><a href={`mailto:${BRANCH_EMAIL}`} className={secondary}>Email Us</a></div>;

export default function BranchLandingPage({ branchId }: { branchId: BranchLocation["id"] }) {
  const branch = branchLocations.find(item => item.id === branchId)!;
  const other = branchLocations.find(item => item.id !== branchId)!;
  return (
    <main className="bg-white text-slate-900">
      <div className="bg-[#173f78] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6"><SiteHeader tone="light" /></div>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div>
            <p className="font-semibold text-blue-100">{branch.label} · British Columbia, Canada</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{branch.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-50">{branch.subheadline}</p>
            <BranchContactActions />
            <a href="#booking-request" className="mt-5 inline-block font-semibold underline underline-offset-4">Request a lesson on this page</a>
          </div>
          <div className="rounded-2xl bg-white p-6 text-slate-900 sm:p-8">
            <h2 className="text-2xl font-bold">{branch.label}</h2>
            <address className="mt-5 space-y-4 not-italic leading-relaxed">
              <p className="font-bold">{BRAND_NAME}</p>
              <p>{branch.street}<br />{branch.city}, BC {branch.postalCode}, Canada</p>
              <p><a href={BRANCH_TEL} className="font-semibold text-[#1d52a1] underline">{BRANCH_PHONE}</a><br /><a href={`mailto:${BRANCH_EMAIL}`} className="break-words text-[#1d52a1] underline">{BRANCH_EMAIL}</a></p>
            </address>
            <p className="mt-4 leading-relaxed"><strong>Hours:</strong><br />{BRANCH_HOURS}</p>
            <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-bold text-[#1d52a1] underline underline-offset-4">Get directions to this campus</a>
          </div>
        </section>
      </div>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black text-[#1d52a1]">{branch.whyTitle}</h2>
        <ul className="mt-8 grid gap-8 md:grid-cols-2">
          {branch.benefits.map(item => <li key={item.title} className="border-t-2 border-[#F5B13A] pt-5"><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-3 leading-relaxed text-slate-600">{item.text}</p></li>)}
        </ul>
      </section>
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-[#1d52a1]">{branch.pickupTitle}</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">{branch.pickupText}</p>
          <ul className="mt-7 grid list-inside list-disc gap-3 font-semibold sm:grid-cols-2 lg:grid-cols-4">{branch.areas.map(area => <li key={area}>{area}</li>)}</ul>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black text-[#1d52a1]">Find the right lesson package</h2>
        <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">{branch.packagesText}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">{branch.packages.map(item => <article key={item.title} className="rounded-xl border border-slate-200 p-6"><h3 className="text-xl font-bold">{item.title}</h3><p className="mt-3 leading-relaxed text-slate-600">{item.text}</p></article>)}</div>
        <p className="mt-6 text-sm text-slate-600">Confirm your individual licensing path with <a href={ICBC_GLP_URL} className="text-[#1d52a1] underline">ICBC</a>. A lesson package does not guarantee a pass or change licensing eligibility.</p>
        <BranchContactActions />
      </section>
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-black text-[#1d52a1]">Questions about {branch.city === "Langford" ? "Langford and Westshore" : "James Bay and Victoria"} lessons</h2>
          <div className="mt-8 space-y-4">{branch.faqs.map(faq => <details key={faq.question} className="rounded-xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">{faq.question}</summary><p className="mt-4 leading-relaxed text-slate-600">{faq.answer}</p>{faq.source ? <a href={faq.source.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-[#1d52a1] underline">{faq.source.label}</a> : null}</details>)}</div>
        </div>
      </section>
      <section id="booking-request" className="mx-auto grid max-w-6xl scroll-mt-28 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div><h2 className="text-3xl font-black text-[#1d52a1]">Request a lesson at {branch.label}</h2><p className="mt-5 leading-relaxed text-slate-600">Tell us your licence stage, lesson goals, pickup neighbourhood and preferred times. We will contact you to discuss availability and confirm the lesson details and full price before booking.</p><p className="mt-5 text-sm text-slate-600">Campus address: {branchAddress(branch)}</p><BranchContactActions /><p className="mt-8 leading-relaxed">Looking for our other branch? <Link to={other.path} className="font-bold text-[#1d52a1] underline">Visit {other.label}</Link>.</p></div>
        <BranchBookingForm key={branch.id} branch={branch} />
      </section>
      <SiteFooter />
    </main>
  );
}
