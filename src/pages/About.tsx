import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import SafetyStandardsSection from "@/components/SafetyStandardsSection";

const values = [
  {
    title: "Calm Learning Environment",
    text: "We create a calm and supportive learning environment where students can build confidence at their own pace without pressure.",
  },
  {
    title: "Skills that last lifetime",
    text: "Every lesson focuses on practical skills, safe habits, and real-world driving situations students will face every day.",
  },
  {
    title: "Confidence first matters",
    text: "We prioritize awareness, responsibility, and confident decision-making so students feel prepared beyond the road test.",
  },
];

const About = () => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow="Meet the team"
      title={<span className="text-white">About us</span>}
      description="We provide patient instruction, structured lesson plans, and practical road training for learners across Vancouver & Surrounding Gulf Islands."
      backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2200&q=80"
    />

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase tracking-wider text-[#E6242A]">Who We Are</p>
          <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">A Standard for Safe, Confident Driving</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            We help new drivers and learners build confidence, develop safe habits, and turn practice into real driving independence.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Our training combines clear instruction, practical learning, and real-world driving so students feel prepared in any situation.
          </p>
        </div>
        <div className="overflow-hidden rounded-[32px]">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
            alt="Team workshop"
            loading="lazy"
            decoding="async"
            className="h-[320px] w-full object-cover sm:h-[380px]"
          />
        </div>
      </div>

    </section>

    <section className="bg-[#F2F2F2] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Our Approach</p>
        <h3 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">What Matters Most</h3>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h4 className="text-3xl font-black text-slate-900">{value.title}</h4>
              <p className="mt-3 text-lg leading-relaxed text-slate-600">{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-10 rounded-[36px] bg-[#1d52a1] p-6 text-white sm:p-8 lg:grid-cols-[1fr_0.9fr] md:p-10 lg:p-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-200">OUR PROMISE</p>
          <h3 className="mt-3 text-[clamp(2rem,4.2vw,3.5rem)] font-black leading-tight">
            Training that builds confidence and real driving skills.
          </h3>
          <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
            We don&apos;t rush students through lessons. We provide structured guidance and real-world practice that
            helps drivers feel safe, prepared, and confident on every road.
          </p>
        </div>
        <div className="overflow-hidden rounded-[28px]">
          <img
            src="https://www.alpha-drivingschool.com/webfiles/DES/albums/layout_images/or/home.jpg"
            alt="Team collaboration"
            loading="lazy"
            decoding="async"
            className="h-[260px] w-full object-cover sm:h-[320px]"
          />
        </div>
      </div>
    </section>

    <SafetyStandardsSection />

    <SiteFooter />
  </main>
);

export default About;
