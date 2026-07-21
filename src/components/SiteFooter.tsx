import { Facebook, Instagram, Linkedin, MapPin, Twitter, Youtube, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import BrandWaveDivider from "@/components/BrandWaveDivider";
import { policyLinks } from "@/data/policies";
import { REFERRAL_TERMS_PATH } from "@/data/referralTerms";

const WhatsAppIcon = ({ size = 14 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type OptionalSocialLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const optionalSocialLinks = [
  {
    href: import.meta.env.VITE_X_PROFILE_URL?.trim(),
    label: "X",
    Icon: Twitter,
  },
  {
    href: import.meta.env.VITE_LINKEDIN_PROFILE_URL?.trim(),
    label: "LinkedIn",
    Icon: Linkedin,
  },
  {
    href: import.meta.env.VITE_YOUTUBE_CHANNEL_URL?.trim(),
    label: "YouTube",
    Icon: Youtube,
  },
].filter((link): link is OptionalSocialLink => Boolean(link.href));

const SiteFooter = () => (
  <footer id="contact" className="relative overflow-hidden bg-[#1d52a1] pb-10 pt-[132px] sm:pt-[168px] lg:pt-[208px]">
    <BrandWaveDivider className="absolute inset-x-0 top-0 z-[8] h-[132px] sm:h-[168px] lg:h-[208px]" flipY />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] opacity-[0.18]"
      style={{
        backgroundImage: "url('/Misc/Doodle-pattern-white.webp')",
        backgroundRepeat: "repeat",
        backgroundSize: "260px 260px",
        backgroundPosition: "center top",
      }}
    />
    <div className="relative z-[2] mx-auto grid max-w-6xl gap-10 px-4 text-white sm:px-6 md:grid-cols-2 md:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="mx-auto flex max-w-[320px] flex-col items-center text-center md:mx-0 md:items-start md:text-left">
        <Link to="/" className="inline-block w-[138px] md:w-[164px]" aria-label="Go to home page">
          <img
            src="/logos/Driving School Logo Vertical - white.png"
            alt="Shanaya's Driving School"
            loading="lazy"
            decoding="async"
            className="w-full"
          />
        </Link>
        <p className="mt-6 text-sm font-semibold text-white/90">
          Driving lessons in Langford, Victoria, and surrounding Greater Victoria communities.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
          <a
            href="https://www.facebook.com/drivingschoolvictoria"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800"
          >
            <Facebook size={16} />
          </a>
          <a
            href="https://www.instagram.com/drivingschoolvictoria"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://wa.me/12505423673"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800"
          >
            <WhatsAppIcon size={16} />
          </a>
          {optionalSocialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-colors hover:bg-neutral-800"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="w-full text-left">
          <p className="mb-4 text-left text-lg font-bold uppercase text-black md:text-xl">Menu</p>
          <ul className="space-y-2 font-semibold text-white">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/driving-lessons">Driving Lessons</Link>
            </li>
            <li>
              <Link to="/icbc-approved-driving-school">Licensed Driving School</Link>
            </li>
            <li>
              <Link to="/bc-graduated-licensing-program">BC Graduated Licensing (GLP)</Link>
            </li>
            <li>
              <Link to="/driving-instructor-victoria">Driving Instructor Victoria</Link>
            </li>
            <li>
              <Link to="/driver-education-training">Driver Education &amp; Training</Link>
            </li>
            <li>
              <Link to="/driving-lessons-langford">Driving Lessons Langford</Link>
            </li>
            <li>
              <Link to="/driving-lessons-colwood">Driving Lessons Colwood</Link>
            </li>
            <li>
              <Link to="/driving-lessons-saanich">Driving Lessons Saanich</Link>
            </li>
            <li>
              <Link to="/driving-lessons-view-royal">Driving Lessons View Royal</Link>
            </li>
            <li>
              <Link to="/nervous-driver-lessons-victoria">Nervous Driver Lessons</Link>
            </li>
            <li>
              <Link to="/defensive-driving">Defensive Driving</Link>
            </li>
            <li>
              <Link to="/road-test-prep">Road Test Prep</Link>
            </li>
            <li>
              <Link to="/road-test-prep-victoria">Road Test Prep Victoria</Link>
            </li>
            <li>
              <Link to="/mock-road-test-victoria">Mock Road Test Victoria</Link>
            </li>
            <li>
              <Link to="/road-test-vehicle">Road Test Vehicle</Link>
            </li>
            <li>
              <Link to="/intensive-driving-course">Intensive Course</Link>
            </li>
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/packages">Packages</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/newcomers-guide">Driver's Licence Guide</Link>
            </li>
            <li>
              <Link to="/knowledge-test-guide">Knowledge Test Guide</Link>
            </li>
            <li>
              <Link to="/knowledge-test-practice">Knowledge Test Practice</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/careers">Careers</Link>
            </li>
            <li>
              <Link to="/affiliate/signup">Ruley Rewards Program</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/apply">Book Lessons</Link>
            </li>
          </ul>
        </div>

        <div className="w-full text-left">
          <p className="mb-4 text-left text-lg font-bold uppercase text-black md:text-xl">Policies</p>
          <ul className="space-y-2 font-semibold text-white">
            {policyLinks.map((policy) => (
              <li key={policy.id}>
                <Link to={policy.href}>{policy.label}</Link>
              </li>
            ))}
            <li>
              <Link to={REFERRAL_TERMS_PATH}>Ruley Rewards Program Terms</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[320px] text-left">
        <p className="mb-4 text-left text-lg font-bold uppercase text-black md:text-xl">Our Address</p>
        <p className="flex items-start gap-2 font-semibold text-white">
          <MapPin size={16} className="mt-1" /> Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1
        </p>
      </div>

      <div className="w-full text-left">
        <p className="mb-4 text-left text-lg font-bold uppercase text-black md:text-xl">Call us now!</p>
        <p className="text-left text-xl font-black text-[#F5B13A] md:text-2xl">250-542-3673</p>
      </div>
    </div>
    <p className="relative z-[2] mt-12 text-center text-xs font-semibold text-white/60">
      Copyright (c) 2026 Shanaya's Driving School. All rights reserved.
    </p>
  </footer>
);

export default SiteFooter;
