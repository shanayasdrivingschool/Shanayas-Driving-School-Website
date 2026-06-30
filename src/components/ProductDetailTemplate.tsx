import { useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, CarFront, Check, CheckCircle2, ChevronDown, Clock3, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";
import { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { ProductLocationPricing, ProductOutlineSection } from "@/data/productTypes";
import type { ServiceLocation } from "@/data/serviceLocations";

type ProductDetailLinkCard = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  href: string;
};

type ProductDetailStat = {
  label: string;
  value: string;
};

type ProductDetailCta = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type ProductDetailTemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  backgroundImage: string;
  heroImagePosition?: string;
  sectionLabel: string;
  detailLabel: string;
  levelLabel?: string;
  formatLabel?: "In-class" | "In-car" | "In-class + In-car";
  highlights: string[];
  outlineSections: ProductOutlineSection[];
  outcomes: string[];
  stats: ProductDetailStat[];
  locationOptions: ServiceLocation[];
  selectedLocationId: string;
  onLocationChange: (value: string) => void;
  pricing: ProductLocationPricing;
  selectedLocation: ServiceLocation;
  lessonDurationSelector?: ReactNode;
  itemsSectionEyebrow: string;
  itemsSectionTitle: string;
  itemsSectionDescription: string;
  items: ProductDetailLinkCard[];
  browseSectionTitle: string;
  browseItems: ProductDetailLinkCard[];
  purchaseConfigurator?: ReactNode;
  primaryCta: ProductDetailCta;
  secondaryCta: ProductDetailCta;
};

const ProductDetailTemplate = ({
  eyebrow,
  title,
  description,
  backgroundImage,
  heroImagePosition,
  sectionLabel,
  detailLabel,
  levelLabel,
  formatLabel,
  highlights,
  outlineSections,
  outcomes,
  stats,
  locationOptions,
  selectedLocationId,
  onLocationChange,
  pricing,
  selectedLocation,
  lessonDurationSelector,
  itemsSectionEyebrow,
  itemsSectionTitle,
  itemsSectionDescription,
  items,
  browseSectionTitle,
  browseItems,
  purchaseConfigurator,
  primaryCta,
  secondaryCta,
}: ProductDetailTemplateProps) => {
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [learnSectionOpen, setLearnSectionOpen] = useState(false);
  const [outlineSectionOpen, setOutlineSectionOpen] = useState(false);
  const [outcomesSectionOpen, setOutcomesSectionOpen] = useState(false);
  const [openOutlineItems, setOpenOutlineItems] = useState<string[]>([]);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const FormatIcon =
    formatLabel === "In-class" ? GraduationCap : formatLabel === "In-class + In-car" ? BookOpen : CarFront;
  const learnPoints = Array.from(new Set([...highlights, ...outlineSections.map((section) => section.title)]));
  const totalOutlineObjectives = outlineSections.reduce((count, section) => count + section.objectives.length, 0);
  const outlineValues = outlineSections.map((_, index) => `outline-${index}`);
  const areAllOutlineItemsOpen = outlineValues.length > 0 && outlineValues.every((value) => openOutlineItems.includes(value));
  const hasExtraHighlights = learnPoints.length > 4;
  const visibleHighlights = showAllHighlights ? learnPoints : learnPoints.slice(0, 4);

  return (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow={eyebrow}
      title={<span className="text-white">{title}</span>}
      description={description}
      backgroundImage={backgroundImage}
      backgroundImagePosition={heroImagePosition}
      minHeightClassName="min-h-[420px] sm:min-h-[500px] md:min-h-[560px]"
      contentLayout="center"
    />

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <p className="responsive-section-label text-center font-black text-gray-300/80 sm:text-left">
            {sectionLabel}
          </p>
          <h1
            className="responsive-section-title mt-2 text-center font-black text-[#1d52a1] sm:text-left"
            style={{ textWrap: "balance" }}
          >
            {title}
          </h1>
          <p className="responsive-copy mt-5 max-w-3xl text-slate-600">{description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {levelLabel ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1d52a1]/10 px-4 py-2 text-sm font-bold text-[#1d52a1]">
                <BookOpen className="h-4 w-4" />
                {levelLabel}
              </span>
            ) : null}
            {formatLabel ? (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                  formatLabel === "In-class"
                    ? "bg-[#E6242A]/10 text-[#E6242A]"
                    : formatLabel === "In-car"
                      ? "bg-[#F3B233]/15 text-[#B77900]"
                      : "bg-[#1d52a1]/10 text-[#1d52a1]"
                }`}
              >
                <FormatIcon className="h-4 w-4" />
                {formatLabel}
              </span>
            ) : null}
            <span className="rounded-full bg-[#E6242A]/10 px-4 py-2 text-sm font-bold text-[#E6242A]">{detailLabel}</span>
          </div>

          {stats.length > 0 ? (
            <div className={`mt-8 grid gap-4 ${stats.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
              {stats.map((stat) => (
                <article key={stat.label} className="rounded-3xl border border-slate-200 bg-[#F2F2F2] p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-2xl font-black text-slate-900">{stat.value}</p>
                </article>
              ))}
            </div>
          ) : null}

          <Collapsible open={learnSectionOpen} onOpenChange={setLearnSectionOpen}>
            <div className="mt-10">
              <CollapsibleTrigger asChild>
                <button type="button" className="flex w-full items-center justify-between gap-4 pb-4 text-left">
                  <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">What you&apos;ll learn</h2>
                  <ChevronDown
                    className={`h-6 w-6 shrink-0 text-[#1d52a1] transition-transform ${learnSectionOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <div className="h-px w-full bg-slate-200" />

              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="mt-6">
                  <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
                    {visibleHighlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-4">
                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#1d52a1]">
                          <Check className="h-4 w-4" />
                        </span>
                        <p className="text-base leading-relaxed text-slate-600">{highlight}</p>
                      </div>
                    ))}
                  </div>

                  {hasExtraHighlights ? (
                    <button
                      type="button"
                      onClick={() => setShowAllHighlights((current) => !current)}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
                    >
                      {showAllHighlights ? "Show less" : "Show more"}
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAllHighlights ? "rotate-180" : ""}`} />
                    </button>
                  ) : null}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Collapsible open={outlineSectionOpen} onOpenChange={setOutlineSectionOpen}>
            <div className="mt-10">
              <CollapsibleTrigger asChild>
                <button type="button" className="flex w-full items-center justify-between gap-4 pb-4 text-left">
                  <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{sectionLabel} outline</h2>
                  <ChevronDown
                    className={`h-6 w-6 shrink-0 text-[#1d52a1] transition-transform ${outlineSectionOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <div className="h-px w-full bg-slate-200" />

              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="mt-6">
                  <div className="flex flex-col gap-4 border-b border-slate-200 px-2 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-0">
                    <p className="text-sm font-semibold text-slate-600">
                      {outlineSections.length} sections | {totalOutlineObjectives} learning points
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpenOutlineItems(areAllOutlineItemsOpen ? [] : outlineValues)}
                      className="text-sm font-bold text-[#6d28d9] transition-colors hover:text-[#5b21b6]"
                    >
                      {areAllOutlineItemsOpen ? "Collapse all sections" : "Expand all sections"}
                    </button>
                  </div>

                  <Accordion
                    type="multiple"
                    value={openOutlineItems}
                    onValueChange={setOpenOutlineItems}
                    className="mt-2"
                  >
                    {outlineSections.map((section, index) => (
                      <AccordionItem
                        key={section.title}
                        value={`outline-${index}`}
                        className="border-slate-200"
                      >
                        <AccordionTrigger className="px-2 text-left text-base font-black text-slate-900 hover:no-underline sm:px-4 sm:text-xl">
                          <div className="flex w-full flex-col gap-2 pr-4 sm:flex-row sm:items-center sm:justify-between">
                            <span>{section.title}</span>
                            <span className="text-sm font-semibold text-slate-500">
                              {section.objectives.length} learning points
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-0 sm:px-4">
                          <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                            {section.objectives.map((objective, objectiveIndex) => (
                              <li
                                key={objective}
                                className={`flex items-start gap-3 px-4 py-4 text-sm leading-relaxed text-slate-600 sm:px-5 ${
                                  objectiveIndex > 0 ? "border-t border-slate-200" : ""
                                }`}
                              >
                                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d52a1]/10 text-[#1d52a1]">
                                  <Check className="h-3.5 w-3.5" />
                                </span>
                                <span>{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Collapsible open={outcomesSectionOpen} onOpenChange={setOutcomesSectionOpen}>
            <div className="mt-10">
              <CollapsibleTrigger asChild>
                <button type="button" className="flex w-full items-center justify-between gap-4 pb-4 text-left">
                  <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">Expected outcome</h2>
                  <ChevronDown
                    className={`h-6 w-6 shrink-0 text-[#1d52a1] transition-transform ${outcomesSectionOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </CollapsibleTrigger>
              <div className="h-px w-full bg-slate-200" />

              <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="mt-6 space-y-4">
                  {outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1d52a1]" />
                      <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{outcome}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        <aside className="lg:pt-12 xl:pt-24">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-[32px] border border-slate-200 bg-[#F2F2F2] p-6 shadow-sm sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#E6242A]">Pricing by location</p>
              <h2 className="mt-3 text-3xl font-black text-slate-900">Choose your lesson area</h2>

              <p id="product-location-label" className="mt-6 block text-sm font-bold text-slate-700">
                Select your location
              </p>
              <div className="mt-2">
                <Popover open={locationMenuOpen} onOpenChange={setLocationMenuOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      id="product-location"
                      aria-labelledby="product-location-label product-location"
                      className="flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-left text-sm font-semibold text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1d52a1]/20"
                    >
                      <span>{selectedLocation.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-500 transition-transform ${locationMenuOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                  >
                    {locationOptions.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => {
                          onLocationChange(location.id);
                          setLocationMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors ${
                          location.id === selectedLocationId
                            ? "bg-[#1d52a1]/10 text-[#1d52a1]"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{location.name}</span>
                        {location.id === selectedLocationId ? <Check className="h-4 w-4" /> : null}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              {lessonDurationSelector ? <div className="mt-5">{lessonDurationSelector}</div> : null}

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5">
                <span className="rounded-full bg-[#1d52a1]/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#1d52a1]">
                  {pricing.badge}
                </span>
                {pricing.originalLabel ? (
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <span className="text-lg font-bold text-slate-400 line-through">{pricing.originalLabel}</span>
                    <h3 className="text-2xl font-black text-[#E6242A]">{pricing.label}</h3>
                    {pricing.discountPercent ? (
                      <span className="rounded-full bg-[#E6242A]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#E6242A]">
                        {pricing.discountPercent}% off
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <h3 className="mt-4 text-2xl font-black text-slate-900">{pricing.label}</h3>
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{pricing.note}</p>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                    <div>
                      <p className="text-sm font-black text-slate-900">{selectedLocation.name}</p>
                    </div>
                  </div>
                </div>

                {pricing.schedule ? (
                  <div className="mt-4 flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#1d52a1]" />
                    <p className="text-sm leading-relaxed text-slate-600">{pricing.schedule}</p>
                  </div>
                ) : null}
              </div>

              {purchaseConfigurator ? <div className="mt-6">{purchaseConfigurator}</div> : null}

              <div className="mt-6 responsive-cta-row">
                {primaryCta.onClick ? (
                  <button type="button" onClick={primaryCta.onClick} className={siteCtaPrimaryClassName}>
                    {primaryCta.label}
                  </button>
                ) : primaryCta.href ? (
                  <Link to={primaryCta.href} className={siteCtaPrimaryClassName}>
                    {primaryCta.label}
                  </Link>
                ) : null}
                {secondaryCta.onClick ? (
                  <button type="button" onClick={secondaryCta.onClick} className={siteCtaSecondaryClassName}>
                    {secondaryCta.label}
                  </button>
                ) : secondaryCta.href ? (
                  <Link to={secondaryCta.href} className={siteCtaSecondaryClassName}>
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>

            </div>
          </div>
        </aside>
      </div>
    </section>

    <section className="bg-[#F2F2F2] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="responsive-section-label text-center font-black text-gray-300/80">{itemsSectionEyebrow}</p>
        <h2
          className="responsive-section-title mt-2 text-center font-black text-[#1d52a1]"
          style={{ textWrap: "balance" }}
        >
          {itemsSectionTitle}
        </h2>
        <p className="responsive-copy mx-auto mt-4 max-w-3xl text-center text-slate-600">
          {itemsSectionDescription}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5">
              {item.meta ? (
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#E6242A]">{item.meta}</p>
              ) : null}
              <h3 className="mt-3 text-2xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <Link
                to={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
              >
                View details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="responsive-section-label text-center font-black text-gray-300/80">Explore</p>
        <h2
          className="responsive-section-title mt-2 text-center font-black text-[#1d52a1]"
          style={{ textWrap: "balance" }}
        >
          {browseSectionTitle}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {browseItems.map((item) => (
            <article key={item.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-[#F2F2F2] p-5">
              {item.meta ? (
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{item.meta}</p>
              ) : null}
              <h3 className="mt-3 text-2xl font-black text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <Link
                to={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1d52a1] transition-colors hover:text-[#17488d]"
              >
                Open page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
  );
};

export default ProductDetailTemplate;

