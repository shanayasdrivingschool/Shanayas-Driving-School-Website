import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import SiteFooter from "@/components/SiteFooter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { seoLandingPagesById, type SeoLandingPageId } from "@/data/seoLandingPages";
import NotFound from "@/pages/NotFound";

type SeoLandingPageProps = {
  pageId: SeoLandingPageId;
};

const SeoLandingPage = ({ pageId }: SeoLandingPageProps) => {
  const page = seoLandingPagesById[pageId];

  if (!page) {
    return <NotFound />;
  }

  const primaryHref = page.id === "pricing" ? "/packages" : "/apply";
  const secondaryHref = page.id === "pricing" ? "/contact" : "/courses";
  const primaryLabel = page.primaryCtaLabel ?? "Book a lesson";
  const secondaryLabel = page.secondaryCtaLabel ?? "View courses";

  return (
    <main className="bg-white text-[#202121]">
      <PageNameSection
        eyebrow={page.eyebrow}
        title={<span className="text-white">{page.h1}</span>}
        description={page.heroDescription}
        backgroundImage={page.heroImage}
        backgroundImagePosition="center"
        overlayGradient="linear-gradient(180deg,rgba(0,0,0,0.58) 0%,rgba(0,0,0,0.48) 100%)"
        minHeightClassName="min-h-[460px] sm:min-h-[540px] md:min-h-[620px]"
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">
              {page.eyebrow}
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-[#1d52a1] sm:text-5xl">
              {page.h1}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              {page.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryHref} className={siteCtaPrimaryClassName}>
                {primaryLabel}
              </Link>
              <Link to={secondaryHref} className={siteCtaSecondaryClassName}>
                {secondaryLabel}
              </Link>
            </div>
          </div>

          <aside className="rounded-[32px] bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F5B13A] text-[#202121]">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">Local service area</p>
                <p className="mt-1 text-lg font-black text-slate-900">Greater Victoria and BC communities</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700 sm:text-base">
              {["Victoria", "Langford", "Colwood", "Sidney", "Sooke", "Duncan", "Salt Spring Island"].map((area) => (
                <li key={area} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1d52a1]" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1d52a1] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#17488d]"
            >
              Ask about availability
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>

      {page.testimonial ? (
        <section className="bg-white pb-16 sm:pb-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <figure className="rounded-[28px] bg-[#F2F2F2] p-8 text-center shadow-sm sm:p-10">
              <div className="text-lg tracking-[0.35em] text-[#F5B13A]" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-4 text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl">
                &ldquo;{page.testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm font-black uppercase tracking-[0.14em] text-[#1d52a1]">
                {page.testimonial.name}
                <span className="ml-2 font-semibold normal-case tracking-normal text-slate-500">
                  {page.testimonial.location}
                </span>
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      <section className="bg-[#F2F2F2] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="responsive-section-label text-center font-black text-gray-300/80">Details</p>
          <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">
            What to know before booking
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {page.sections.map((section) => (
              <article key={section.title} className="rounded-[28px] bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-2xl font-black text-slate-900">{section.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{section.body}</p>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3 text-sm font-semibold text-slate-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E6242A]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.faqs?.length ? (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <p className="responsive-section-label text-center font-black text-gray-300/80">FAQ</p>
            <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">
              Common questions
            </h2>
            <Accordion type="single" collapsible className="mt-10 space-y-4">
              {page.faqs.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="rounded-2xl border border-slate-200 bg-[#F2F2F2] px-5"
                >
                  <AccordionTrigger className="text-left text-base font-black text-slate-900 hover:no-underline sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ) : null}

      {page.relatedLinks?.length ? (
        <section className="bg-[#F2F2F2] py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="responsive-section-label text-center font-black text-gray-300/80">Service areas</p>
            <h2 className="responsive-section-title text-center font-black text-[#1d52a1]">
              {page.relatedLinksTitle ?? "Explore by area"}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {page.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group rounded-[28px] bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                >
                  <h3 className="text-2xl font-black text-slate-900 transition-colors group-hover:text-[#1d52a1]">
                    {link.label}
                  </h3>
                  {link.description ? (
                    <p className="mt-3 text-base leading-relaxed text-slate-600">{link.description}</p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#E6242A]">
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <SiteCtaSection
        eyebrow="Ready to start?"
        title={
          <>
            Choose the right <span className="text-[#F5B13A]">driving plan</span>
          </>
        }
        description="Get calm, structured instruction built around your licence stage, road test timeline, and local driving goals."
        actions={
          <>
            <Link to={primaryHref} className={siteCtaPrimaryClassName}>
              {primaryLabel}
            </Link>
            <Link to="/contact" className={siteCtaSecondaryClassName}>
              Contact us
            </Link>
          </>
        }
      />

      <SiteFooter />
    </main>
  );
};

export default SeoLandingPage;
