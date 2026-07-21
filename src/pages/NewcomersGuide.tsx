import {
  BookOpen,
  CalendarClock,
  CarFront,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  GraduationCap,
  ShieldCheck,
  TimerReset,
  TrafficCone,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";

const programStages = [
  {
    title: "Learner (L)",
    text: "Your first licence stage, focused on supervised driving, road knowledge, and safe habit building.",
    icon: BookOpen,
  },
  {
    title: "Novice (N)",
    text: "An independent driving stage with important restrictions designed to build real-world experience.",
    icon: CarFront,
  },
  {
    title: "Full Class 5 Licence",
    text: "Full driving privileges in British Columbia. From October 19, 2026 this is preceded by a 12-month restricted Class 5 stage.",
    icon: ShieldCheck,
  },
];

const eligibilityRequirements = [
  "Accepted identification",
  "Parent or legal guardian consent if you are under 19, dropping to under 18 on October 19, 2026",
  "The ability to pass a vision screening",
  "The ability to pass the knowledge test",
];

const studyTopics = [
  "Road signs and traffic signals",
  "Right-of-way rules",
  "Road safety principles",
  "Hazard awareness",
  "Sharing the road",
];

const learnerRestrictions = [
  "You must have a qualified supervisor who is 25 or older and holds a valid driver's licence, dropping to 22 or older on October 19, 2026",
  "You must display an L sign on the rear of the vehicle",
  "You must have zero alcohol and zero drugs in your system",
  "You may not use electronic devices, including hands-free devices",
  "You must follow passenger restrictions",
  "Learner drivers are also subject to restricted driving hours",
];

const class7RoadTestChecks = [
  "Vehicle control",
  "Observation and hazard awareness",
  "Intersections and lane positioning",
  "Safe turns",
  "Defensive driving habits",
];

const noviceRules = [
  "You must display an N sign on the vehicle",
  "You must have zero alcohol and zero drugs in your system",
  "You may not use electronic devices, including hands-free devices",
  "You must follow passenger limitations",
];

const class5Skills = [
  "Safe driving behaviour",
  "Hazard awareness",
  "Responsible decision-making",
];

const timelineSteps = [
  {
    title: "Learner (L)",
    duration: "Minimum 12 months",
    text: "Build road knowledge, Practice  with supervision, and prepare for the Class 7 road test. From October 19, 2026, 9 months if you are 25 or older.",
  },
  {
    title: "Novice (N)",
    duration: "Minimum 24 months",
    text: "Gain independent experience while following GLP restrictions and safe-driving requirements. From October 19, 2026, 12 months if you are 25 or older.",
  },
  {
    title: "Full Licence",
    duration: "After successful completion of requirements",
    text: "Progress to Class 5 once the Novice stage and final licensing step are completed. From October 19, 2026 a 12-month restricted period applies first.",
  },
];

const lessonBenefits = [
  "Understand ICBC road test expectations",
  "Practice  defensive driving",
  "Gain experience in real traffic conditions",
  "Prepare more effectively for road tests",
];

const sourceLinks = [
  {
    label: "ICBC: Graduated licensing",
    href: "https://www.icbc.com/driver-licensing/new-drivers/Graduated-licensing",
  },
  {
    label: "ICBC: Get your L",
    href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-L",
  },
  {
    label: "ICBC: Learn to Drive Smart",
    href: "https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart",
  },
  {
    label: "ICBC: Accepted identification (ID)",
    href: "https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID",
  },
  {
    label: "ICBC: Get your N",
    href: "https://www.icbc.com/driver-licensing/new-drivers/Get-your-N",
  },
  {
    label: "ICBC: Changes are coming to the Graduated Licensing Program",
    href: "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes",
  },
];

const checklistClassName =
  "flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 sm:text-base";

const NewcomersGuide = () => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow="British Columbia Licensing Guide"
      title={<span className="text-white">How to Get Your Driver's License</span>}
      description="A step-by-step guide to obtaining your driver's license"
      backgroundImage="https://tests.ca/img/licence/british-columbia-drivers-licence.jpg"
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-[#1d52a1]/20 bg-[#1d52a1]/5 p-6 sm:p-8">
          <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#E6242A]">Important</p>
          <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
            The Graduated Licensing Program is changing on{" "}
            <span className="font-black">October 19, 2026</span>. ICBC is removing the second road
            test and replacing it with a Driving Record Assessment, adding a 12-month restricted
            Class 5 stage, and shortening the path for drivers aged 25 and older. Second road tests
            booked on or after that date will be cancelled. This guide describes the program as it
            works today, with each upcoming change flagged where it applies. See{" "}
            <Link
              to="/blog/bc-glp-changes-2026"
              className="font-bold text-[#1d52a1] underline underline-offset-2"
            >
              what changes on October 19, 2026
            </Link>{" "}
            for the full breakdown.
          </p>
        </div>

        <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F5B13A]">At a glance</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Graduated Licensing Program</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            In British Columbia, new drivers move through the Graduated Licensing Program to build knowledge, supervised experience, and safe driving habits before receiving full driving privileges.
          </p>
          <div className="mt-6 grid gap-4">
            {programStages.map((stage) => (
              <article key={stage.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
                    <stage.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-black">{stage.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{stage.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Eligibility</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Who Can Apply</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          To begin the process, you must meet the basic eligibility requirements set by ICBC. You can apply for your learner's licence on or after your <span className="font-bold">16th birthday</span>.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">Basic requirements</h3>
            <div className="mt-6 grid gap-4">
              {eligibilityRequirements.map((item) => (
                <div key={item} className={checklistClassName}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px]">
            <img
              src="https://static.toiimg.com/photo/89967473.cms"
              alt="Teen student holding a Canada flag"
              loading="lazy"
              decoding="async"
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            ICBC requires applicants to bring valid identification to a driver licensing office. If you are under 19, a parent or legal guardian must normally provide consent before your application can proceed.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Step 1</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Study for the Knowledge Test</h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          The first step is preparing for the <span className="font-bold">ICBC knowledge test</span>. The main official study resource is <span className="font-bold">Learn to Drive Smart</span>.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black sm:text-3xl">What to study</h3>
            <div className="mt-6 grid gap-4">
              {studyTopics.map((topic) => (
                <div key={topic} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/85 sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B13A]" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">What the test covers</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              The knowledge test is made up of multiple-choice questions about traffic rules, signs, and safe driving practices. It is intended to confirm that you understand the fundamentals before you begin driving with a supervisor.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              A strong knowledge base at this stage is important because it supports every step that follows in the GLP.
            </p>

            <div className="mt-6 rounded-3xl border border-[#1d52a1] bg-[#1d52a1] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F5B13A]">Practice With Purpose</p>
              <h4 className="mt-2 text-xl font-black text-white">ICBC Knowledge Test Preparation</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Practice ICBC-style multiple-choice questions, learn through instructor-supported practice, review clear explanations, and build the confidence needed to succeed on your knowledge test.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/knowledge-test-practice"
                  className="inline-flex items-center justify-center rounded-full bg-[#F5B13A] px-5 py-3 text-sm font-bold text-[#202121] transition-colors hover:bg-[#e0a332]"
                >
                  Practice Now
                </Link>
                <Link
                  to="/courses/knowledge-test-prep-course"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Get Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Step 2</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Get Your Learner License (L)</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          Once you pass the knowledge test and vision screening, you can receive a <span className="font-bold">Class 7 Learner licence (L)</span>. This stage is focused on supervised practice and developing core driving skills in lower-risk conditions.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">Typical learner restrictions</h3>
            <div className="mt-6 grid gap-4">
              {learnerRestrictions.map((item) => (
                <div key={item} className={checklistClassName}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
              <TimerReset className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black sm:text-3xl">Practice period</h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              In practical terms, the Learner stage is where you begin building safe habits, vehicle control, observation skills, and confidence behind the wheel.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Drivers in the L stage must generally remain there for <span className="font-black text-white">at least 12 months</span> before they are eligible to take the first road test.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Step 3</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Class 7 Road Test</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          After gaining practice experience in the Learner stage, the next step is the <span className="font-bold">Class 7 road test</span>. This road test is used to assess whether you are ready to move from supervised driving to the Novice stage.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
              <TrafficCone className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black sm:text-3xl">What the examiner evaluates</h3>
            <div className="mt-6 grid gap-4">
              {class7RoadTestChecks.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/85 sm:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B13A]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#F8FAFC] p-6 shadow-sm sm:p-8">
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">Outcome</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              The test is intended to measure whether you can drive safely, smoothly, and responsibly in real traffic conditions.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              If you pass the Class 7 road test, you move to the <span className="font-bold">Novice stage (N)</span>.
            </p>

            <div className="mt-6 rounded-3xl border border-[#1d52a1] bg-[#1d52a1] p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F5B13A]">Need road test help?</p>
              <h4 className="mt-2 text-xl font-black text-white">Want to pass your road test? Get ready now</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Get focused road test preparation, mock practice, and lesson support before your Class 7 test.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/courses/road-test-prep-course"
                  className="inline-flex items-center justify-center rounded-full bg-[#F5B13A] px-5 py-3 text-sm font-bold text-[#202121] transition-colors hover:bg-[#e0a332]"
                >
                  Road Test Prep
                </Link>
                <Link
                  to="/packages"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  View Packages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Step 4</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Novice License (N)</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          After passing the Class 7 road test, you receive your <span className="font-bold">Novice licence (N)</span>. At this stage, you may drive independently, but you must still follow important GLP restrictions.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <CarFront className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">Common novice rules</h3>
            <div className="mt-6 grid gap-4">
              {noviceRules.map((item) => (
                <div key={item} className={checklistClassName}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-[#F5B13A]">
              <CalendarClock className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black sm:text-3xl">Typical duration</h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              The N stage is designed to help drivers build independent driving experience while still operating under important safety restrictions.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              For most drivers, the Novice stage lasts <span className="font-black text-white">24 months</span> before they can progress to a full licence. Drivers who complete an ICBC-approved driver training course during the Learner stage may qualify for a shorter Novice period of 18 months, provided they meet ICBC's conditions. From October 19, 2026, drivers aged 25 and older need only <span className="font-black text-white">12 months</span> as a Novice.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Step 5</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Full Class 5 License</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          The final step is obtaining your <span className="font-bold">full Class 5 licence</span>. Drivers progress to this stage after completing the required Novice period and meeting the safe driving requirements. How you get there depends on whether you finish before or after October 19, 2026.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-sm sm:p-8">
            <h3 className="text-2xl font-black sm:text-3xl">Until October 19, 2026</h3>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Drivers book and complete a final <span className="font-bold">Class 5 road test</span>. From October 19, 2026 that test is replaced by a <span className="font-bold">Driving Record Assessment</span>, an in-office check of your driving record, and passing it gives you a Class 5 carrying a 12-month zero alcohol and drug restriction before the licence becomes fully unrestricted.
            </p>
            <div className="mt-6 grid gap-4">
              {class5Skills.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/85 sm:text-base"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#F5B13A]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
            <div className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">Once requirements are fulfilled</h3>
            <div className="mt-6 grid gap-4">
              {[
                "Graduated restrictions are removed",
                "L and N sign requirements end",
                "The driver receives full driving privileges in British Columbia",
              ].map((item) => (
                <div key={item} className={checklistClassName}>
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1d52a1]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              This is the final stage of the standard first-time licensing path.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Timeline</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Typical Licensing Timeline</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          A typical GLP timeline looks like the stages below. In most cases, the full process takes <span className="font-bold">approximately three years</span> from the time a new driver begins with no licence to the time they qualify for a full Class 5 licence.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {timelineSteps.map((step, index) => (
            <article key={step.title} className="relative rounded-[32px] bg-white p-6 shadow-sm sm:p-8">
              <span className="absolute -top-3 left-6 rounded-full bg-[#E6242A] px-3 py-1 text-xs font-bold text-white">
                Stage {index + 1}
              </span>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">{step.duration}</p>
              <h3 className="mt-3 text-2xl font-black text-slate-900">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Support</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">How Driving Lessons Can Help</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          Structured driving lessons can be helpful at every stage of the GLP. Professional instruction can help students:
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {lessonBenefits.map((benefit) => (
            <article key={benefit} className="rounded-[28px] border border-slate-200 bg-[#F8FAFC] p-6 shadow-sm">
              <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <p className="mt-4 text-lg font-black leading-snug text-slate-900">{benefit}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Lessons can also help new drivers develop correct habits early, improve observation skills, and build confidence in a controlled and consistent way.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-[#F8FAFC] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Sources</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Verified References</h2>
        <p className="mx-auto mt-4 max-w-4xl text-center text-base text-slate-600 sm:text-lg">
          Sources used to verify terminology and current requirements.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sourceLinks.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <span className="inline-flex rounded-2xl bg-[#1d52a1]/10 p-3 text-[#1d52a1]">
                <ExternalLink className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-black text-slate-900">{source.label}</h3>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors group-hover:text-[#E6242A]">
                Visit source
                <ExternalLink className="h-4 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>

    <SiteCtaSection
      eyebrow="Start Your Learning Journey"
      title={
        <>
          Build safe habits, practical skills, and <span className="text-[#F5B13A]">confidence on the road</span>
        </>
      }
      description="Learning to drive is an important milestone. Our instructors are here to help students prepare for the learner stage, develop essential driving skills, and feel fully prepared for road test requirements in Victoria and throughout British Columbia."
      actions={
        <>
          <Link to="/apply" className={siteCtaPrimaryClassName}>
            Book Lessons
          </Link>
          <Link to="/knowledge-test-practice" className={siteCtaSecondaryClassName}>
            Practice Knowledge Test
          </Link>
        </>
      }
    />

    <SiteFooter />
  </main>
);

export default NewcomersGuide;
