import { Link } from "react-router-dom";
import SiteCtaSection, { siteCtaPrimaryClassName, siteCtaSecondaryClassName } from "@/components/SiteCtaSection";
import { cn } from "@/lib/utils";

type InstallmentCtaSectionProps = {
  className?: string;
  imageClassName?: string;
};

const InstallmentCtaSection = ({ className, imageClassName }: InstallmentCtaSectionProps) => (
  <SiteCtaSection
    eyebrow="FLEXIBLE PAYMENTS"
    title="Learn now, pay over time."
    description="Split your course into monthly installments with Affirm - no hidden fees. Choose your plan right inside the secure Stripe checkout."
    supportingCopy="0% APR options available. Takes 60 seconds to apply."
    sectionClassName={cn(
      "rounded-[36px] border border-slate-200 bg-[#E7EBEF] py-8 shadow-[0_28px_70px_rgba(39,69,86,0.16)] sm:py-10",
      className,
    )}
    imageSrc="/Misc/Installmenticon.png"
    imageAlt="Installment payment icon"
    imageClassName={cn("h-[200px] sm:h-[260px] lg:h-[300px]", imageClassName)}
    actions={
      <>
        <Link to="/packages" className={siteCtaPrimaryClassName}>
          Browse packages
        </Link>
        <a href="tel:+12505423673" className={siteCtaSecondaryClassName}>
          Call Now
        </a>
      </>
    }
  />
);

export default InstallmentCtaSection;
