import { useState } from "react";
import { Mail, MapPin, Phone, Headphones, Newspaper, Briefcase } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { officeLocation, publicServiceLocations } from "@/data/serviceLocations";
import { submitContactLead } from "@/lib/leadService";
import { getCaptchaVerification } from "@/lib/captcha";

/* â”€â”€ "Reach Us Out Directly" cards â”€â”€ */
const reachCards = [
  {
    icon: Headphones,
    title: "Help & Support",
    text: "Have questions or need assistance? Our team is here to support students and parents with scheduling, training inquiries, and guidance for a confident start.",
    link: "mailto:book@drivingschoolbc.ca",
    linkLabel: "Get support",
  },
  {
    icon: Newspaper,
    title: "Press & Media",
    text: "Stay informed with our latest updates, achievements, and student success stories. Discover how we help new drivers build skill, confidence, and safe driving habits.",
    link: "mailto:book@drivingschoolbc.ca",
    linkLabel: "Media enquiries",
  },
  {
    icon: Briefcase,
    title: "Sales & Enquiries",
    text: "Ready to start driving? Contact our sales team to ask about lesson options, current instructor availability, and scheduling.",
    link: "mailto:book@drivingschoolbc.ca",
    linkLabel: "Talk to sales",
  },
];

/* â”€â”€ FAQs â”€â”€ */
const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <main className="bg-white text-[#202121]">
      {/* â”€â”€â”€ 1. Hero / Page Header â”€â”€â”€ */}
      <section className="relative isolate w-full overflow-hidden text-white min-h-[520px] md:min-h-[600px]">
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=2200&q=80"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div
          className="relative z-30 mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <SiteHeader tone="light" />

          <div className="flex min-h-[340px] flex-col items-center justify-end gap-2 pb-24 pt-8 text-center md:min-h-[420px] lg:flex-row lg:gap-0 lg:pb-0 lg:text-left">
            {/* Left â€“ PNG Image (transparent bg) */}
            <div className="relative flex shrink-0 items-end justify-center self-end">
              <img
                src="/logos/contact-hero.webp"
                alt="Ruley - Shanaya's Driving School mascot"
                loading="eager"
                decoding="async"
                className="w-auto object-contain drop-shadow-2xl max-h-[420px] sm:max-h-[500px] lg:max-h-[620px] lg:-translate-y-[20px]"
              />
            </div>

            {/* Right â€“ Text */}
            <div>
              <h1 className="text-[clamp(2.4rem,4.5vw,4rem)] font-black leading-[1.08]">
                <span className="text-[#F5C518]">Let's talk about<br />your driving lessons</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-[clamp(0.95rem,1.4vw,1.15rem)] leading-[1.5] text-slate-300 md:mx-0">
                We're happy to assess your learning needs, and help you choose the right program to get you road-ready with confidence.
              </p>

            </div>
          </div>
        </div>

        {/* Wave curve */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[80px] md:h-[100px] lg:h-[120px]">
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden className="h-full w-full">
            <path fill="#1d52a1" d="M0,40 A2400,2400 0 0,0 1440,40 L1440,200 L0,200 Z" />
            <path fill="#ffffff" d="M0,80 A2400,2400 0 0,0 1440,80 L1440,200 L0,200 Z" />
          </svg>
        </div>
      </section>

      {/* â”€â”€â”€ 3. Contact Details + Form (side by side) â”€â”€â”€ */}
      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Connect</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Get In Touch</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Our team can discuss your learning needs, current lesson availability, and the training options shown in our catalogue.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            {/* Left column â€“ contact info cards */}
            <div className="space-y-4">
              <a
                href="mailto:book@drivingschoolbc.ca"
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#202121]">
                  <Mail size={18} />
                </span>
                <span>
                  <span className="block text-xl font-black text-slate-900">Email</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-700">book@drivingschoolbc.ca</span>
                  <span className="mt-2 block text-sm text-slate-500"></span>
                </span>
              </a>

              <a
                href="tel:+12505423673"
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#202121]">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="block text-xl font-black text-slate-900">Phone</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-700">+1 (250) 542-3673</span>
                </span>
              </a>

              <a
                href="https://maps.google.com/?q=2770+Leigh+Rd,+Langford,+BC+V9B+4G1"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#202121]">
                  <MapPin size={18} />
                </span>
                <span>
                  <span className="block text-xl font-black text-slate-900">Our Office</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-700">
                    2770 Leigh Rd, Victoria, British Columbia V9B 4G1
                  </span>
                  <span className="mt-2 block text-sm text-slate-500">By appointment - Free parking available</span>
                </span>
              </a>
            </div>

            {/* Right column â€“ form */}
            <div className="rounded-[30px] border border-[#E0E0E0] bg-white p-6 sm:p-8">
              <h3 className="text-3xl font-black text-slate-900">Send a Message</h3>
              <p className="mt-3 max-w-xl text-base text-slate-600 sm:text-lg">
                Tell us about your goals and we will get back to you with a personalised recommendation.
              </p>

              <div className="mt-5">
                {submitted ? (
                  <div className="rounded-2xl border border-[#1d52a1]/30 bg-[#F2F2F2] p-6 text-center">
                    <p className="text-2xl font-black text-slate-900">Thanks, we got your message!</p>
                    <p className="mt-2 text-slate-600">Our team will contact you within 24 hours.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={async (event) => {
                      event.preventDefault();
                      if (isSubmitting) return;
                      setSubmitError("");
                      setIsSubmitting(true);
                      try {
                        const captcha = await getCaptchaVerification("contact_form_submit");
                        await submitContactLead({
                          firstName,
                          lastName,
                          email,
                          message,
                          captchaProvider: captcha.provider ?? undefined,
                          captchaToken: captcha.token ?? undefined,
                          captchaAction: captcha.action ?? undefined,
                        });
                        setSubmitted(true);
                      } catch (error) {
                        console.error("Contact submit failed:", error);
                        setSubmitError("Submission failed. Please retry after verification or call +1 (250) 542-3673.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        placeholder="First name"
                        required
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        required
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email address"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]"
                    />
                    <textarea
                      placeholder="Your message"
                      rows={5}
                      required
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition-colors focus:border-[#1d52a1]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full bg-[#E6242A] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C41E23]"
                    >
                    {isSubmitting ? "Sending..." : "Connect With Our Team"}
                    </button>
                    {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ 6. Reach Us Out Directly â”€â”€â”€ */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Support</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Reach Us Out Directly</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            Whether you're a new driver or a parent of a first-time learner, contact us to learn more about our
            current training options, scheduling availability, and convenient
            <br />
            pickup & drop-off services.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reachCards.map((card) => (
              <a
                key={card.title}
                href={card.link}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#202121]">
                  <card.icon size={22} />
                </span>
                <h3 className="mt-5 text-xl font-black text-slate-900">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{card.text}</p>
                <span className="mt-5 inline-block text-sm font-bold text-[#1d52a1] transition-colors group-hover:text-[#E6242A]">
                  {card.linkLabel} -&gt;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€â”€ 7. Locations â”€â”€â”€ */}
      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-6xl font-black text-gray-300/80 sm:text-7xl lg:text-8xl">Local</p>
          <h2 className="text-center text-3xl font-black text-[#1d52a1] sm:text-4xl md:text-5xl">Our Locations</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base text-slate-600 sm:text-lg">
            We proudly serve communities across Vancouver & Surrounding Gulf Islands.
          </p>

          <article className="mt-10 rounded-3xl bg-[#E6242A] p-6 text-white shadow-[0_18px_40px_rgba(230,36,42,0.25)] sm:p-8">
            <div className="flex justify-end">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/20 px-4 py-1 text-xs font-black uppercase tracking-[0.14em]">
                Our office location
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white">
                  <MapPin size={18} />
                </span>
                <h3 className="mt-4 text-3xl font-black">{officeLocation.name}</h3>
                <p className="mt-2 text-base font-semibold text-white/95">{officeLocation.address}</p>
                <p className="mt-3 text-base leading-relaxed text-white/90">{officeLocation.description}</p>
              </div>
            </div>
          </article>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {publicServiceLocations.map((loc) => (
              <article
                key={loc.name}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1d52a1]/15 text-[#202121]">
                  <MapPin size={18} />
                </span>
                <h3 className="mt-4 text-xl font-black text-slate-900">{loc.name}</h3>
                <p className="mt-2 text-sm font-semibold text-slate-700">{loc.address}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500">{loc.description}</p>
              </article>
            ))}
          </div>
        </div>

          <div className="mt-10 w-full">
            <iframe
              title="Our office location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2646.263636375451!2d-123.52076622307371!3d48.451470971279875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548f0d12a28feb31%3A0x7844eb9adc8db1de!2s2770%20Leigh%20Rd%20%23124%2C%20Victoria%2C%20BC%20V9B%204G2%2C%20Canada!5e0!3m2!1sen!2s!4v1772209932126!5m2!1sen!2s"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[400px] w-full border-0 sm:h-[480px] lg:h-[540px]"
            />
          </div>
      </section>

      {/* â”€â”€â”€ 8. FAQs â”€â”€â”€ */}
      <SiteFooter />
    </main>
  );
};

export default Contact;
