import { useState } from "react";
import { CheckCircle2, Users, CalendarClock, Heart, TrendingUp, Car, Mail, Phone, ChevronDown, Briefcase, MapPin, Clock, X, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";

/* ── Why Work With Us ── */
const benefits = [
  {
    title: "Supportive Team Environment",
    text: "You will work alongside experienced instructors who are happy to share advice, trade routes, and help you grow. We look out for each other.",
    icon: Users,
  },
  {
    title: "Flexible Scheduling",
    text: "We understand that life does not always fit neatly into a nine-to-five schedule. We work with you to build a timetable that suits your availability.",
    icon: CalendarClock,
  },
  {
    title: "Meaningful Work",
    text: "Helping someone pass their road test or overcome driving anxiety is genuinely rewarding. You will see the difference you make every day.",
    icon: Heart,
  },
  {
    title: "Professional Growth",
    text: "Whether you are an experienced instructor or just starting out, we provide ongoing mentorship, training opportunities, and room to develop your career.",
    icon: TrendingUp,
  },
  {
    title: "Modern Training Vehicles",
    text: "Our fleet is well maintained and equipped with dual controls. You will always have a reliable, clean vehicle to work with.",
    icon: Car,
  },
  {
    title: "Respectful Work Culture",
    text: "We maintain a professional and supportive workplace where teamwork, communication, and mutual respect are part of everyday work.",
    icon: Users,
  },
];

/* ── Open Positions ── */
type ListSection = {
  heading: string;
  iconColor: "blue" | "red";
  items: string[];
};

type Position = {
  id: string;              // must match positionsDB in EmployeeApply
  title: string;
  subtitle: string;
  badge?: string;
  featured?: boolean;
  type: string;
  location: string;
  hiringCount: number;
  description: string;
  sections: ListSection[];
  buttonStyle: "red" | "blue";
};

const positions: Position[] = [
  {
    id: "pos-001",
    title: "Driving Instructor",
    subtitle: "ICBC Licensed",
    badge: "Now Hiring",
    featured: true,
    type: "Full Time",
    location: "Victoria, BC",
    hiringCount: 2,
    description:
      "Join our team as a fully licensed driving instructor. You will deliver in-car lessons, prepare students for their road tests, and help them develop safe habits that last a lifetime.",
    sections: [
      {
        heading: "Responsibilities",
        iconColor: "blue",
        items: [
          "Deliver structured in-car driving lessons",
          "Prepare students for ICBC road tests",
          "Provide clear, constructive feedback after each session",
          "Maintain accurate lesson records and progress notes",
          "Keep training vehicles clean and in good condition",
        ],
      },
      {
        heading: "Requirements",
        iconColor: "red",
        items: [
          "Valid ICBC Driving Instructor licence",
          "Clean driving record",
          "Strong communication and interpersonal skills",
          "Ability to stay calm under pressure",
        ],
      },
    ],
    buttonStyle: "red",
  },
  {
    id: "pos-002",
    title: "Office Administrator",
    subtitle: "Administrative Support",
    badge: "New",
    featured: false,
    type: "Part Time",
    location: "Victoria, BC",
    hiringCount: 1,
    description:
      "Help us keep things running smoothly behind the scenes. You will manage bookings, handle enquiries, and support our team of instructors with day-to-day administrative tasks.",
    sections: [
      {
        heading: "Responsibilities",
        iconColor: "blue",
        items: [
          "Manage student bookings and lesson schedules",
          "Answer phone calls, emails, and online enquiries",
          "Process payments and maintain financial records",
          "Update student files and progress records",
          "Support instructors with administrative needs",
          "Help maintain the company website and social media",
        ],
      },
      {
        heading: "Requirements",
        iconColor: "red",
        items: [
          "Strong organisational and multitasking skills",
          "Excellent written and verbal communication",
          "Proficiency with office software and booking systems",
          "Friendly, professional phone and email manner",
          "Ability to work independently and take initiative",
        ],
      },
    ],
    buttonStyle: "blue",
  },
  {
    id: "pos-003",
    title: "Sub-Contractor",
    subtitle: "Contract Opportunity",
    badge: "Open",
    featured: false,
    type: "Contract",
    location: "Victoria, BC",
    hiringCount: 1,
    description:
      "Work with our school as a sub-contractor and support students with professional driving instruction while keeping the flexibility of an independent contract role.",
    sections: [
      {
        heading: "Responsibilities",
        iconColor: "blue",
        items: [
          "Provide structured driving lessons based on student skill level and goals",
          "Prepare learners for road tests with practical coaching and clear guidance",
          "Maintain professional communication with students and the admin team",
          "Keep accurate lesson notes and share progress updates when needed",
          "Represent the school professionally while delivering safe, reliable instruction",
        ],
      },
      {
        heading: "Requirements",
        iconColor: "red",
        items: [
          "Valid ICBC Driving Instructor licence",
          "Clean driving record and professional approach to safety",
          "Ability to work independently while coordinating with the school team",
          "Strong communication skills and a student-focused attitude",
        ],
      },
    ],
    buttonStyle: "blue",
  },
];

/* ── Hiring Process Steps ── */
const hiringSteps = [
  {
    step: "01",
    title: "Submit Your Application",
    text: "Send us your resume and a brief introduction by email. Let us know about your driving experience, any teaching background, and what interests you about the role.",
  },
  {
    step: "02",
    title: "Initial Conversation",
    text: "We will set up a short phone or video call to learn more about you, answer your questions, and make sure the opportunity is a good fit on both sides.",
  },
  {
    step: "03",
    title: "In-Person Meeting",
    text: "If things look like a good match, we will invite you in for a face-to-face conversation. This is a chance for you to meet the team and see how we operate.",
  },
  {
    step: "04",
    title: "Observation or Trial Session",
    text: "For instructor roles, we arrange a short in-car session so we can see your teaching approach and driving style. For trainees, this step focuses on your learning potential.",
  },
  {
    step: "05",
    title: "Offer and Onboarding",
    text: "If everything aligns, we will extend an offer and walk you through our onboarding process. We make sure you feel prepared and supported from day one.",
  },
];

const Careers = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
  <main className="bg-white text-[#202121]">
    {/* ─── 1. Hero Section ─── */}
    <PageNameSection
      eyebrow="Join Our Team"
      title={<span className="select-none text-white">Make a Difference on the Road</span>}
      description="Work alongside dedicated professionals who are passionate about safety, education, and creating confident drivers."
      backgroundImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=2200&q=80"
    />

    {/* ─── 2. Open Positions ─── */}
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Positions</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
          Open Positions
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          We are currently looking to fill the following roles. Click on a position to see the full details.
        </p>

        {/* Position cards grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {positions.map((pos, i) => (
            <article
              key={pos.title}
              onClick={() => toggle(i)}
              className="group relative flex cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Top accent bar */}
              <div className={`h-1.5 rounded-t-2xl ${
                pos.featured ? "bg-[#E6242A]" : "bg-[#1d52a1]"
              }`} />

              <div className="flex flex-1 flex-col p-6">
                {/* Badge + Location row */}
                <div className="flex items-center justify-between">
                  {pos.badge ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-bold text-[#E6242A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E6242A]" />
                      {pos.badge}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-bold text-[#1d52a1]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1d52a1]" />
                      Open
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    {pos.location}
                  </span>
                </div>

                {/* Icon + Subtitle */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1d52a1]/10 text-[#1d52a1]">
                    <Briefcase size={18} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">Shanaya's Driving School</p>
                    <p className="text-sm font-bold text-slate-900">{pos.subtitle}</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-xl font-black text-slate-900">{pos.title}</h3>

                {/* Short description */}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{pos.description}</p>

                {/* Bottom row: type + count + Apply */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <Clock size={12} className="text-[#1d52a1]" />
                      {pos.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <UserPlus size={12} className="text-[#1d52a1]" />
                      Hiring {pos.hiringCount}
                    </span>
                  </div>
                  <span className={`rounded-full px-5 py-2 text-xs font-bold text-white transition-colors ${
                    pos.buttonStyle === "red"
                      ? "bg-[#E6242A] group-hover:bg-[#C41E23]"
                      : "bg-[#1d52a1] group-hover:bg-[#17408a]"
                  }`}>
                    View Details
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ── Expanded detail modal overlay ── */}
        {openIndex !== null && (() => {
          const pos = positions[openIndex];
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
              onClick={() => setOpenIndex(null)}
            >
              <div
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8 lg:p-10 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setOpenIndex(null)}
                  className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                >
                  <X size={16} />
                </button>

                {/* Badge */}
                <div className="flex items-center gap-3">
                  {pos.badge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-bold text-[#E6242A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E6242A]" />
                      {pos.badge}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    {pos.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock size={12} />
                    {pos.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <UserPlus size={12} />
                    Hiring {pos.hiringCount} {pos.hiringCount === 1 ? "position" : "positions"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">{pos.title}</h3>
                <p className="mt-1 text-sm font-semibold text-[#1d52a1]">{pos.subtitle}</p>

                {/* Description */}
                <p className="mt-4 text-base leading-relaxed text-slate-600">{pos.description}</p>

                {/* Sections grid */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {pos.sections.map((section) => (
                    <div key={section.heading} className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-sm font-black uppercase tracking-wide text-[#1d52a1]">{section.heading}</p>
                      <ul className="mt-3 space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2
                              size={14}
                              className={`mt-1 shrink-0 ${
                                section.iconColor === "red" ? "text-[#E6242A]" : "text-[#1d52a1]"
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-6">
                  <a
                    href={`mailto:book@drivingschoolbc.ca?subject=Application%20-%20${encodeURIComponent(pos.title)}`}
                    className={`inline-flex rounded-full px-7 py-3 text-sm font-bold text-white transition-colors ${
                      pos.buttonStyle === "red"
                        ? "bg-[#E6242A] hover:bg-[#C41E23]"
                        : "bg-[#1d52a1] hover:bg-[#17408a]"
                    }`}
                  >
                    Email Application
                  </a>
                  <Link
                    to={`/careers/apply?position=${encodeURIComponent(pos.id)}`}
                    onClick={() => setOpenIndex(null)}
                    className="inline-flex rounded-full border-2 border-[#1d52a1] px-7 py-3 text-sm font-bold text-[#1d52a1] transition-colors hover:bg-[#1d52a1] hover:text-white"
                  >
                    Apply Online
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>

    {/* ─── 3. Why Work With Us ─── */}
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Benefits</p>
      <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
        Why Work With Us
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
        We have built a workplace where team members feel valued, supported, and genuinely enjoy coming to work.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#1d52a1]">
              <benefit.icon size={22} />
            </span>
            <h3 className="mt-5 text-2xl font-black text-slate-900">{benefit.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>

    {/* ─── 4. What It's Like Working Here ─── */}
    <section className="bg-[#F2F2F2] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-[32px]">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80"
              alt="Team collaboration"
              loading="lazy"
              decoding="async"
              className="h-[320px] w-full object-cover sm:h-[380px]"
            />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wider text-[#E6242A]">Life at Shanaya's Driving School</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">What It's Like Working Here</h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
              Our instructors work with a wide range of students - nervous beginners, newcomers to Canada learning BC
              roads for the first time, experienced drivers brushing up on their skills, and teens preparing for their
              first road test.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              No two days are the same, and that variety is part of what makes this work interesting. You will build
              genuine connections with your students and take pride in watching them progress. The team here is
              supportive, the schedule is flexible, and the work genuinely matters.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              We keep things straightforward - clear communication, fair expectations, and a focus on doing good work.
              If that sounds like the kind of place you would like to be, we would be glad to hear from you.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ─── 5. Hiring Process ─── */}
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Process</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
          Our Hiring Process
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          We keep our hiring process simple and respectful of your time. Here is what to expect.
        </p>

        <div className="relative mt-12">
          {/* Vertical line connector */}
          <div className="absolute left-[22px] top-0 hidden h-full w-0.5 bg-[#1d52a1]/20 md:block" />

          <div className="space-y-8">
            {hiringSteps.map((step, index) => (
              <div key={step.step} className="relative flex items-start gap-6">
                {/* Step number circle */}
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d52a1] text-sm font-black text-white">
                  {step.step}
                </div>
                <div className="rounded-3xl bg-[#F2F2F2] p-6 sm:p-8 flex-1">
                  <h3 className="text-xl font-black text-slate-900 sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ─── 7. Apply Section ─── */}
    <section className="bg-[#F2F2F2] py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Apply</p>
        <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">
          Ready to Apply?
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
          Submit your resume and a brief introduction to the email below, outlining your experience and interest in
          joining Shanaya&apos;s Driving School. We will review your application and be in touch.
        </p>

        <div className="mt-8 mx-auto w-full max-w-xl rounded-2xl border border-[#1d52a1]/30 bg-white px-4 py-4 sm:px-6">
          <a
            href="mailto:book@drivingschoolbc.ca"
            className="flex items-center justify-center gap-3 text-center text-sm font-bold text-[#1d52a1] sm:text-lg"
          >
            <Mail size={20} className="shrink-0" />
            <span className="min-w-0 break-all leading-tight sm:break-normal">book@drivingschoolbc.ca</span>
          </a>
        </div>

        <div className="mt-6">
          <a
            href="mailto:book@drivingschoolbc.ca?subject=Career%20Application%20-%20Shanaya's%20Driving%20School"
            className="inline-flex rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
          >
            Apply Now
          </a>
        </div>
      </div>
    </section>

    {/* ─── 8. Equal Opportunity Statement ─── */}
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-black uppercase tracking-wider text-[#E6242A]">Equal Opportunity Employer</p>
          <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">Everyone Is Welcome Here</h3>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Shanaya's Driving School is committed to building an inclusive workplace. We welcome applications from
            people of all backgrounds, identities, and experiences. What matters most to us is your character, your
            willingness to learn, and the care you bring to your work.
          </p>
        </div>
      </div>
    </section>

    {/* ─── 9. Final CTA ─── */}
    <SiteCtaSection
      eyebrow="Not sure yet?"
      title={
        <>
          Have questions before you <span className="text-[#F5B13A]">apply</span>?
        </>
      }
      description="If you are interested but not quite ready to apply, feel free to reach out. We are happy to answer questions about the role, our training process, or what a typical day looks like. No pressure at all."
      actions={
        <>
          <Link to="/contact" className={siteCtaPrimaryClassName}>
            Contact Us
          </Link>
          <a
            href="mailto:book@drivingschoolbc.ca?subject=Question%20About%20Careers"
            className={siteCtaSecondaryClassName}
          >
            Ask a Question
          </a>
        </>
      }
    />

    <SiteFooter />
  </main>
  );
};

export default Careers;


