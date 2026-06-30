import type { ReactNode } from "react";
import PageNameSection from "@/components/PageNameSection";
import SiteFooter from "@/components/SiteFooter";

type AffiliatePortalLayoutProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  backgroundImage?: string;
};

const defaultHeroImage =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80";

const AffiliatePortalLayout = ({
  eyebrow,
  title,
  description,
  children,
  backgroundImage = defaultHeroImage,
}: AffiliatePortalLayoutProps) => (
  <main className="bg-white text-[#202121]">
    <PageNameSection
      eyebrow={eyebrow}
      title={title}
      description={description}
      backgroundImage={backgroundImage}
      minHeightClassName="min-h-[420px] md:min-h-[500px]"
      contentLayout="center"
    />
    {children}
    <SiteFooter />
  </main>
);

export default AffiliatePortalLayout;
