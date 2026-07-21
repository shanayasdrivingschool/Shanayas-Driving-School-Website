import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  Languages,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";

const movingFromCanadaUrl =
  "https://www.icbc.com/driver-licensing/moving-bc/Moving-from-within-canada";
const movingFromAnotherCountryUrl =
  "https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country";
const proofOfExperienceUrl =
  "https://www.icbc.com/driver-licensing/moving-bc/Proving-your-driving-experience";
const acceptedIdUrl = "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID";
const movingVehicleUrl = "https://www.icbc.com/insurance/moving-travelling/moving-BC";
const feesUrl = "https://www.icbc.com/driver-licensing/visit-dl-office/Fees";
const getLUrl = "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L";
const getNUrl = "https://www.icbc.com/driver-licensing/new-drivers/Get-your-N";
const onlineKnowledgeTestUrl =
  "https://www.icbc.com/driver-licensing/new-drivers/online-knowledge-test";
const glpChangesUrl =
  "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes";
const schoolDirectoryUrl =
  "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school";
const approvedGlpSchoolsUrl =
  "https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools";
const approvedCourseUrl =
  "https://www.partners.icbc.com/driver-training/driving-schools/teach-approved-course";

const decisionPaths = [
  {
    eyebrow: "Path 1",
    title: "Valid licence from within Canada",
    summary:
      "Apply to exchange your valid provincial or territorial licence. Bring accepted ID, your current licence, fees and any driving-experience record ICBC asks for.",
    detail:
      "If you cannot prove two years with a full-privilege, non-learner licence, ICBC may place you in the Graduated Licensing Program and credit the experience it can verify.",
    href: movingFromCanadaUrl,
    label: "ICBC: moving from within Canada",
    icon: MapPinned,
  },
  {
    eyebrow: "Path 2",
    title: "Valid licence from an exchange jurisdiction",
    summary:
      "Some foreign passenger-vehicle licences can be exchanged without a knowledge or road test. Check ICBC's current exchange list rather than relying on an older country list elsewhere.",
    detail:
      "Your licence class, validity, documents and proven experience still matter. ICBC makes the final decision about the B.C. class and any restrictions issued.",
    href: movingFromAnotherCountryUrl,
    label: "ICBC: check exchange jurisdictions",
    icon: FileCheck2,
  },
  {
    eyebrow: "Path 3",
    title: "Valid licence from a non-exchange jurisdiction",
    summary:
      "You can apply for a B.C. licence, but ICBC normally requires a knowledge test and a road test in addition to the application, vision screening and document review.",
    detail:
      "Prove your full-privilege experience before testing. It can determine whether you qualify for a Class 5 test or enter the Class 7 GLP path.",
    href: movingFromAnotherCountryUrl,
    label: "ICBC: testing for non-exchange licences",
    icon: ClipboardCheck,
  },
  {
    eyebrow: "Path 4",
    title: "Never licensed",
    summary:
      "Start as a first-time B.C. driver: study, pass the knowledge test and vision screening, receive a Class 7 learner licence, practise with a qualified supervisor, then take the Class 7 road test.",
    detail:
      "Driving-school lessons are optional. Every learner must follow the conditions printed on their licence and the current ICBC rules.",
    href: getLUrl,
    label: "ICBC: get your learner licence",
    icon: GraduationCap,
  },
];

const deadlineExceptions = [
  "A tourist visiting for up to six months",
  "A full-time student who has a valid exemption through enrolment at a designated B.C. educational institution",
  "A person who is ordinarily resident outside B.C.",
  "A temporary foreign worker whose federal work permit identifies the Seasonal Agricultural Worker Program (SAWP), for up to 12 months",
];

const appointmentChecklist = [
  {
    title: "One primary and one secondary accepted ID",
    text: "Check ICBC's current ID list before the appointment. Most federal immigration documents can serve as primary ID, but the exact document combination matters.",
    href: acceptedIdUrl,
    icon: FileCheck2,
  },
  {
    title: "Your current valid driver's licence",
    text: "Bring every licence ICBC asks to review. If you qualify for a B.C. licence, B.C. law requires you to surrender your previous licence because you may hold only one.",
    href: movingFromAnotherCountryUrl,
    icon: ShieldCheck,
  },
  {
    title: "Original proof of driving experience",
    text: "A current licence showing the original issue date or an acceptable original driving record or letter can establish how long you held a full-privilege licence.",
    href: proofOfExperienceUrl,
    icon: CalendarClock,
  },
  {
    title: "An ICBC-approved translation, if required",
    text: "Translation requirements depend on the issuing jurisdiction and document. ICBC may place the application on hold and require an ICBC-approved translator.",
    href: movingFromAnotherCountryUrl,
    icon: Languages,
  },
];

const firstTimeSteps = [
  {
    title: "Knowledge test and learner licence",
    text: "At age 16 or older, take the $15 Class 7 knowledge test online or in person. If you pass online, you are not yet licensed: visit an ICBC office for ID review, consent if you are under 19, vision screening and the $10 photo learner licence.",
    icon: BookOpen,
  },
  {
    title: "Supervised learner stage",
    text: "Hold the L for at least 12 months without a driving prohibition, practise with a qualified supervisor and follow every learner restriction shown on your licence.",
    icon: CarFront,
  },
  {
    title: "Class 7 road test and novice licence",
    text: "The Class 7 road test costs $35 per attempt. If ICBC issues your first five-year novice licence after a pass, the current licence fee is $75.",
    icon: ClipboardCheck,
  },
];

const feeRows = [
  ["Class 7 knowledge test", "$15", "Per attempt"],
  ["Class 7 photo learner licence", "$10", "After qualification"],
  ["Class 7 road test", "$35", "Per attempt"],
  ["First five-year novice licence", "$75", "When issued"],
];

const sourceLinks = [
  { label: "Moving from within Canada", href: movingFromCanadaUrl },
  { label: "Moving from outside Canada", href: movingFromAnotherCountryUrl },
  { label: "Proving your driving experience", href: proofOfExperienceUrl },
  { label: "Accepted identification", href: acceptedIdUrl },
  { label: "Moving to B.C. with a vehicle", href: movingVehicleUrl },
  { label: "Driver licensing fees", href: feesUrl },
  { label: "Online knowledge test process", href: onlineKnowledgeTestUrl },
  { label: "Get your learner (L) licence", href: getLUrl },
  { label: "Get your novice (N) licence", href: getNUrl },
  { label: "October 19, 2026 GLP changes", href: glpChangesUrl },
  { label: "Choosing a licensed driving school", href: schoolDirectoryUrl },
  { label: "ICBC-approved GLP schools", href: approvedGlpSchoolsUrl },
  { label: "Approved GLP course requirements", href: approvedCourseUrl },
];

const externalLinkClassName =
  "font-bold text-[#1d52a1] underline decoration-[#1d52a1]/35 underline-offset-4 transition-colors hover:text-[#E6242A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2";

const NewcomersGuide = () => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow="ICBC licence decision guide"
      title={<span className="text-white">Moving to B.C.: Exchange or Get a B.C. Driver's Licence</span>}
      description="Choose the correct path for your current licence, documents and driving experience before your 90-day deadline."
      backgroundImage="/blog/newcomers-guide-bc.webp"
      backgroundImagePosition="center 58%"
      contentLayout="left"
    />

    <section aria-labelledby="choose-path" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Start here</p>
        <h2 id="choose-path" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
          Which licence path applies to you?
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
          “Newcomer” is not a licence category. ICBC looks at where your licence was issued,
          whether it is valid, its class, and how much full-privilege driving experience you can
          prove. Use this guide to prepare, then let ICBC confirm your individual eligibility.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {decisionPaths.map((path) => (
          <article key={path.title} className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex shrink-0 rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]" aria-hidden="true">
                <path.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]">{path.eyebrow}</p>
                <h3 className="mt-2 text-xl font-black leading-tight text-slate-950 sm:text-2xl">{path.title}</h3>
              </div>
            </div>
            <p className="mt-5 text-base leading-relaxed text-slate-700">{path.summary}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{path.detail}</p>
            <a href={path.href} target="_blank" rel="noreferrer" className={`mt-6 inline-flex items-center gap-2 self-start ${externalLinkClassName}`}>
              {path.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>

    <section aria-labelledby="deadline-heading" className="bg-[#F8FAFC] py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
          <div className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]" aria-hidden="true">
            <CalendarClock className="h-6 w-6" />
          </div>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">General deadline</p>
          <h2 id="deadline-heading" className="mt-3 text-3xl font-black sm:text-4xl">90 days after moving</h2>
          <p className="mt-5 text-base leading-relaxed text-white/85 sm:text-lg">
            After moving to B.C., you generally have 90 days to switch a valid out-of-province or
            foreign licence to a B.C. driver's licence. Start early: records, translations and test
            appointments can take time, and a licence that expires is no longer a valid licence for
            the 90-day driving allowance.
          </p>
          <a href={movingFromAnotherCountryUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-[#F5B13A] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Read ICBC's 90-day rule
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div>
          <h3 className="text-2xl font-black text-slate-950 sm:text-3xl">ICBC lists four exceptions</h3>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            The general 90-day switching rule does not apply in these situations while the person's
            home-jurisdiction licence and qualifying status remain valid:
          </p>
          <ul className="mt-6 grid gap-3" role="list">
            {deadlineExceptions.map((exception) => (
              <li key={exception} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" aria-hidden="true" />
                <span>{exception}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 sm:text-base">
            Do not assume an exception applies based only on a study or work permit. Confirm your
            status with ICBC before driving past the general deadline.
          </p>
        </div>
      </div>
    </section>

    <section aria-labelledby="appointment-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Before the appointment</p>
          <h2 id="appointment-heading" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
            Bring the records ICBC needs
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
            Book an ICBC driver licensing appointment and check the requirements before you go. An
            incomplete record can delay the exchange or change the licence stage ICBC can issue.
          </p>
          <div className="mt-7 grid gap-4">
            {appointmentChecklist.map((item) => (
              <article key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex shrink-0 rounded-xl bg-[#1d52a1]/10 p-2.5 text-[#1d52a1]" aria-hidden="true">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{item.text}</p>
                    <a href={item.href} target="_blank" rel="noreferrer" className={`mt-3 inline-flex items-center gap-2 text-sm ${externalLinkClassName}`}>
                      Verify with ICBC
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <figure className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-sm">
          <img
            src="/landing/bc-graduated-licensing-program.webp"
            alt="Illustrative photo of a learner practising in a car with an adult passenger"
            loading="lazy"
            decoding="async"
            className="aspect-[4/3] w-full object-cover"
          />
          <figcaption className="px-5 py-4 text-sm leading-relaxed text-slate-600">
            Lessons and supervised practice can help with local road conditions, but they do not
            replace ICBC's document, testing or licensing decisions.
          </figcaption>
        </figure>
      </div>
    </section>

    <section aria-labelledby="experience-heading" className="bg-[#0f172a] py-14 text-white sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 lg:col-span-2">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">A document can change your path</p>
          <h2 id="experience-heading" className="mt-3 text-3xl font-black sm:text-4xl">Prove full-privilege driving experience</h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            To be exempt from B.C.'s GLP, ICBC requires proof that you held a full driver's licence
            — not a learner licence — for at least two years. A current licence showing the period
            may be enough; otherwise, bring an acceptable original driver record or letter of
            experience. ICBC allows records from multiple jurisdictions to be combined.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            A record or letter must meet ICBC's format rules, including verifiable licensing-body
            details, your identifying information, licence class and original issue date. Email
            printouts do not establish the GLP exemption. If a required document is not in English,
            present the original or ICBC-stamped copy with an ICBC-approved translation.
          </p>
          <a href={proofOfExperienceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-[#F5B13A] underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Check ICBC's accepted evidence
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <aside className="rounded-[28px] bg-[#F5B13A] p-6 text-slate-950 sm:p-8" aria-label="Vehicle deadline">
          <CarFront className="h-7 w-7" aria-hidden="true" />
          <p className="mt-5 text-sm font-black uppercase tracking-[0.16em]">Bringing a vehicle?</p>
          <h3 className="mt-3 text-3xl font-black">30 days</h3>
          <p className="mt-4 text-base leading-relaxed">
            A personal vehicle brought to B.C. generally must be registered, licensed and insured
            here within 30 days of arrival. Import and inspection requirements depend on the vehicle
            and where it came from.
          </p>
          <a href={movingVehicleUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold underline underline-offset-4 hover:text-[#1d52a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950">
            ICBC moving and insurance guide
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </aside>
      </div>
    </section>

    <section aria-labelledby="first-time-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">If you are starting from zero</p>
        <h2 id="first-time-heading" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl md:text-5xl">
          The current Class 7 path, briefly
        </h2>
        <p className="mt-5 text-base leading-relaxed text-slate-700 sm:text-lg">
          These passenger-vehicle steps and fees were checked against ICBC on July 21, 2026. Fees
          can change, and an unsuccessful test means paying the test fee again.
        </p>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-3">
        {firstTimeSteps.map((step, index) => (
          <article key={step.title} className="rounded-[28px] border border-slate-200 bg-[#F8FAFC] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]" aria-hidden="true">
                <step.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-black text-slate-400">0{index + 1}</span>
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">{step.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{step.text}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-slate-600 sm:text-base">
        Verify the steps on ICBC's{" "}
        <a href={onlineKnowledgeTestUrl} target="_blank" rel="noreferrer" className={externalLinkClassName}>online knowledge test page</a>,{" "}
        <a href={getLUrl} target="_blank" rel="noreferrer" className={externalLinkClassName}>learner licence page</a>{" "}
        and{" "}
        <a href={getNUrl} target="_blank" rel="noreferrer" className={externalLinkClassName}>novice licence page</a>.
      </p>

      <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 bg-[#1d52a1] px-5 py-5 text-white sm:flex-row sm:items-center sm:px-7">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F5B13A]">Current ICBC fees</p>
            <h3 className="mt-1 text-xl font-black">Class 7 passenger-vehicle path</h3>
          </div>
          <CircleDollarSign className="h-7 w-7 text-[#F5B13A]" aria-hidden="true" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">ICBC Class 7 test and licence fees checked July 21, 2026</caption>
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              <tr>
                <th scope="col" className="px-5 py-4 sm:px-7">Item</th>
                <th scope="col" className="px-5 py-4">Fee</th>
                <th scope="col" className="px-5 py-4 sm:px-7">When charged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {feeRows.map(([item, fee, timing]) => (
                <tr key={item}>
                  <th scope="row" className="px-5 py-4 font-bold text-slate-900 sm:px-7">{item}</th>
                  <td className="px-5 py-4 font-black text-[#1d52a1]">{fee}</td>
                  <td className="px-5 py-4 text-slate-600 sm:px-7">{timing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-slate-200 px-5 py-4 text-sm leading-relaxed text-slate-600 sm:px-7">
          Confirm the amount before your visit on the{" "}
          <a href={feesUrl} target="_blank" rel="noreferrer" className={externalLinkClassName}>official ICBC fees page</a>.
        </p>
      </div>
    </section>

    <section aria-labelledby="changes-heading" className="bg-[#F8FAFC] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[32px] border border-[#1d52a1]/20 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Dated transition note</p>
          <h2 id="changes-heading" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
            What changes on October 19, 2026
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-700">
            Until the change takes effect, an eligible novice driver can still take the second
            Class 5 road test. ICBC says a second road test scheduled for October 19, 2026 or later
            will be cancelled, with next steps sent to the customer by email.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              "The first Class 7 road test remains. It is still required to move from L to N.",
              "For drivers under 25, the usual 12-month learner and 24-month novice minimums remain; the novice minimum can be 18 months after an approved GLP course when ICBC's other conditions are met.",
              "Drivers aged 25 or older will generally have a nine-month learner minimum and a 12-month novice minimum.",
              "For eligible novice drivers, a Driving Record Assessment replaces the second road test. An upgrade leads to a Class 5 with restriction 55: zero blood alcohol and zero blood drug content for 12 months. Other individual licence restrictions, if any, remain separate.",
              "DRA eligibility requires the applicable 24-, 18- or 12-month period with no excessive-speed or electronic-device convictions and no driving prohibitions or suspensions.",
              "A prohibition or suspension during the restricted-Class-5 year restarts the full 12 months from the date the licence is reinstated.",
              "Parental or guardian consent will be required only for applicants under 18. The qualified-supervisor minimum age drops to 22, subject to ICBC's Class 5 and licence-condition rules.",
              "Learners gain an immediate-family passenger exception. Novice drivers already have an immediate-family exception under the current passenger rule.",
            ].map((change) => (
              <div key={change} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" aria-hidden="true" />
                <span>{change}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-base leading-relaxed text-slate-600">
            Transition rules depend on your age, licence stage, safe-driving period and test date.
            Read{" "}
            <a href={glpChangesUrl} target="_blank" rel="noreferrer" className={externalLinkClassName}>ICBC's current transition page</a>{" "}
            and our{" "}
            <Link to="/blog/bc-glp-changes-2026" className={externalLinkClassName}>source-linked GLP change guide</Link>{" "}
            before making a licensing decision.
          </p>
        </div>
      </div>
    </section>

    <section aria-labelledby="training-heading" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#1d52a1]">Optional support</p>
          <h2 id="training-heading" className="mt-3 text-3xl font-black text-slate-950">Ordinary driving lessons</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-700">
            A licensed driving school may teach the vehicle classes shown in ICBC's general school
            directory. Lessons can be used for local-rule orientation, supervised skill development
            or road-test preparation, but professional lessons are not required to apply, exchange a
            licence or take the Class 7 test.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-700">
            Shanaya's Driving School appears in the general ICBC directory for Class 5 and Class 7
            driver training at 124–2770 Leigh Road, Langford. A directory listing is not an ICBC
            endorsement and does not make ordinary lessons an approved GLP course.
          </p>
          <a href={schoolDirectoryUrl} target="_blank" rel="noreferrer" className={`mt-6 inline-flex items-center gap-2 ${externalLinkClassName}`}>
            Check the general ICBC directory
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </article>

        <article className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">Separate program</p>
          <h2 className="mt-3 text-3xl font-black">ICBC-approved GLP course</h2>
          <p className="mt-5 text-base leading-relaxed text-white/80">
            This is a specifically approved minimum 32-hour program: at least 16 classroom hours,
            12 practical hours and four additional hours allocated under ICBC's course rules. Only
            a school on ICBC's approved GLP list can provide the approved-course declaration.
          </p>
          <p className="mt-4 text-base leading-relaxed text-white/80">
            As checked on July 21, 2026, Shanaya's Driving School is not listed as an approved GLP
            provider. Do not enrol in its ordinary lessons expecting the approved-course time
            reduction; verify any provider directly on ICBC's current list before paying.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={approvedGlpSchoolsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F5B13A] px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Check approved providers
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={approvedCourseUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              Read course requirements
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </article>
      </div>
    </section>

    <section aria-labelledby="responsibility-heading" className="bg-[#1d52a1] py-14 text-white sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#F5B13A]">Editorial responsibility</p>
            <h2 id="responsibility-heading" className="mt-3 text-3xl font-black sm:text-4xl">Reviewed against primary sources</h2>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/85">
              Shanaya's Driving School is responsible for this guide as an organization. It was
              reviewed on July 21, 2026 against the linked ICBC material. No individual reviewer or
              credential is named because the site does not publish a verified person for that role.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/85">
              Shanaya's is independent from ICBC. This page is general information, not a licensing
              decision or legal advice. ICBC decides each applicant's identity, experience,
              exchange, testing and licence eligibility. For a correction, email{" "}
              <a href="mailto:book@drivingschoolbc.ca?subject=Correction%20to%20newcomer%20licence%20guide" className="font-bold text-white underline underline-offset-4 hover:text-[#F5B13A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                book@drivingschoolbc.ca
              </a>.
            </p>
          </div>
          <aside className="rounded-[28px] border border-white/15 bg-white/10 p-6 sm:p-8" aria-label="Next steps">
            <h3 className="text-2xl font-black">Before you act</h3>
            <ol className="mt-5 grid gap-3 text-sm leading-relaxed text-white/85 sm:text-base">
              <li className="flex gap-3"><span className="font-black text-[#F5B13A]">1.</span><span>Choose the path matching your current valid licence.</span></li>
              <li className="flex gap-3"><span className="font-black text-[#F5B13A]">2.</span><span>Collect accepted ID and original experience records.</span></li>
              <li className="flex gap-3"><span className="font-black text-[#F5B13A]">3.</span><span>Book early and confirm your case with ICBC.</span></li>
            </ol>
            <a href={movingFromAnotherCountryUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#1d52a1] transition-colors hover:bg-[#F5B13A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d52a1]">
              Go to ICBC's newcomer guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </section>

    <section aria-labelledby="sources-heading" className="bg-[#F8FAFC] py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Source ledger</p>
        <h2 id="sources-heading" className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Official references used</h2>
        <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-600">
          All factual licensing claims above link to primary ICBC pages. Because requirements and
          fees can change, use these live sources to check details close to your appointment date.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {sourceLinks.map((source) => (
            <li key={source.href}>
              <a href={source.href} target="_blank" rel="noreferrer" className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-snug text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#1d52a1]/40 hover:text-[#1d52a1] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2">
                <span>{source.label}</span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="border-t border-slate-200 bg-white py-12" aria-label="Optional driving lesson support">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-black text-slate-950">Looking for optional Class 5 or 7 practice?</h2>
          <p className="mt-2 text-base leading-relaxed text-slate-600">
            Ask about ordinary lessons after ICBC confirms your licence path. Lessons do not change
            ICBC's exchange, document or testing requirements.
          </p>
        </div>
        <Link to="/contact" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#173f7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d52a1] focus-visible:ring-offset-2">
          Contact the school
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>

    <SiteFooter />
  </main>
);

export default NewcomersGuide;
