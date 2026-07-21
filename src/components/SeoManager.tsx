import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import {
  KNOWLEDGE_TEST_GUIDE_PUBLISHED_ISO,
  KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO,
  knowledgeTestGuideFaqs,
} from "@/data/knowledgeTestGuide";
import { courseCatalog } from "@/data/courseCatalog";
import { optionalExtras } from "@/data/optionalExtras";
import { packageCatalog } from "@/data/packageCatalog";
import { sitePolicies } from "@/data/policies";
import { seoLandingPagesByPath, type SeoLandingPageFaq } from "@/data/seoLandingPages";

const SITE_ORIGIN = "https://www.drivingschoolbc.ca";
const SITE_NAME = "Shanaya's Driving School";
const DEFAULT_TITLE = "Driving Lessons Victoria BC | Shanaya's Driving School";
const DEFAULT_DESCRIPTION =
  "Class 5 and 7 driving lessons, road-test preparation, knowledge-test support, and confidence-building training in Langford, Victoria, and listed B.C. service areas.";
const DEFAULT_IMAGE_PATH = "/logos/For Social Media.jpg";

const optionalEnvUrl = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

const socialProfileUrls = [
  "https://www.facebook.com/drivingschoolvictoria",
  "https://www.instagram.com/drivingschoolvictoria",
  optionalEnvUrl(import.meta.env.VITE_X_PROFILE_URL),
  optionalEnvUrl(import.meta.env.VITE_LINKEDIN_PROFILE_URL),
  optionalEnvUrl(import.meta.env.VITE_YOUTUBE_CHANNEL_URL),
].filter((url): url is string => Boolean(url));

type SeoArticleDetails = {
  headline: string;
  datePublished: string;
  dateModified: string;
  section: string;
  /* Reference guides are Articles; blog posts are BlogPostings. */
  articleType?: "Article" | "BlogPosting";
};

type SeoBreadcrumb = {
  name: string;
  path: string;
};

type SeoDetails = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  robots?: "index, follow" | "noindex, follow" | "noindex, nofollow";
  faqs?: SeoLandingPageFaq[];
  article?: SeoArticleDetails;
  breadcrumbs?: SeoBreadcrumb[];
};

type JsonLdObject = Record<string, unknown>;

const staticRouteSeo: Record<string, Omit<SeoDetails, "path">> = {
  "/": {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  "/courses": {
    title: "Driving Courses in Victoria & Langford, BC | Shanaya's Driving School",
    description:
      "Browse beginner lessons, ICBC road test prep, parking practice, defensive driving, refresher training, and newcomer driving support.",
  },
  "/packages": {
    title: "Driving Lesson Packages in Greater Victoria | Shanaya's Driving School",
    description:
      "Compare structured driving lesson packages for new drivers, road test preparation, confidence building, and flexible training plans.",
  },
  "/about": {
    title: "About Shanaya's Driving School | Victoria & Langford Driving Lessons",
    description:
      "Learn about Shanaya's Driving School, its Langford Class 5 and 7 directory listing, supportive training approach, and student-first instruction.",
  },
  "/contact": {
    title: "Contact Shanaya's Driving School | Book Driving Lessons in BC",
    description:
      "Contact Shanaya's Driving School to book driving lessons, ask about packages, or get help choosing the right training plan.",
  },
  "/apply": {
    title: "Book Driving Lessons | Shanaya's Driving School",
    description:
      "Start your driving lesson booking with Shanaya's Driving School and get matched with training that fits your goals and schedule.",
  },
  "/payment-plan-options": {
    title: "Driving Lesson Payment Plans | Shanaya's Driving School",
    description:
      "Explore installment options for eligible driving lesson packages with clear monthly payment choices and predictable scheduling.",
  },
  "/newcomers-guide": {
    title: "Moving to B.C.: Exchange or Get a B.C. Driver's Licence | Shanaya's",
    description:
      "Choose the correct ICBC path to exchange a valid licence or start B.C.'s Class 7 process, with document, experience, deadline, fee and source details.",
  },
  "/knowledge-test-practice": {
    title: "Independent B.C. Class 7 Knowledge Test Practice | Shanaya's",
    description:
      "Use an independent 20-question Class 7 study bank, then verify every rule with ICBC's official guide and practice test.",
  },
  "/knowledge-test-guide": {
    title: "B.C. Class 7 Knowledge Test: Online & In-Person Guide | Shanaya's",
    description:
      "Current Class 7 guide to ICBC's online and in-person B.C. knowledge test: eligibility, 50 questions, fees, study sources, ID and licence steps.",
    robots: "index, follow",
    type: "article",
    article: {
      articleType: "Article",
      headline: "B.C. Class 7 Knowledge Test: Online and In-Person Guide",
      datePublished: KNOWLEDGE_TEST_GUIDE_PUBLISHED_ISO,
      dateModified: KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO,
      section: "Learner Licensing",
    },
    faqs: knowledgeTestGuideFaqs,
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Class 7 Knowledge Test Guide", path: "/knowledge-test-guide" },
    ],
  },
  "/blog": {
    title: "Driving Tips & Road Test Resources | Shanaya's Driving School",
    description:
      "Read practical driving tips, ICBC road test guidance, defensive driving advice, and newcomer resources for BC drivers.",
  },
  "/careers": {
    title: "Driving Instructor Careers | Shanaya's Driving School",
    description:
      "Explore instructor, support, and contractor opportunities with Shanaya's Driving School in British Columbia.",
  },
  "/affiliate/signup": {
    title: "Ruley Rewards Program | Shanaya's Driving School",
    description:
      "Join the Ruley Rewards referral program and track eligible referrals for Shanaya's Driving School.",
  },
  "/affiliate/terms-and-conditions": {
    title: "Ruley Rewards Program Terms | Shanaya's Driving School",
    description:
      "Review the referral program terms and conditions for Ruley Rewards participants.",
  },
  "/policies": {
    title: "Policies | Shanaya's Driving School",
    description:
      "Review Shanaya's Driving School policies for privacy, payments, installments, cookies, and website terms.",
  },
};

const noIndexPrefixes = [
  "/admin",
  "/affiliate/dashboard",
  "/affiliate/login",
  "/careers/dashboard",
  "/cart",
  "/checkout",
  "/ref",
  "/search",
];

const normalizePath = (pathname: string) => {
  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
};

const decodePathSegment = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const toAbsoluteUrl = (value: string) => new URL(value, SITE_ORIGIN).toString();

const toCanonicalPath = (path: string) => (path === "/" ? "/" : `${path}/`);

const localBusinessJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "DrivingSchool"],
  "@id": `${SITE_ORIGIN}/#localbusiness`,
  name: SITE_NAME,
  url: `${SITE_ORIGIN}/`,
  image: `${SITE_ORIGIN}/logos/For%20Social%20Media.jpg`,
  logo: `${SITE_ORIGIN}/logos/Driving%20School%20Logo%20Horizontal.png`,
  description: DEFAULT_DESCRIPTION,
  telephone: "+1-250-542-3673",
  email: "book@drivingschoolbc.ca",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 124, 2770 Leigh Rd",
    addressLocality: "Langford",
    addressRegion: "BC",
    postalCode: "V9B 4G1",
    addressCountry: "CA",
  },
  areaServed: [
    "Victoria, BC",
    "Langford, BC",
    "Colwood, BC",
    "Sidney, BC",
    "Metchosin, BC",
    "Sooke, BC",
    "Duncan, BC",
    "Salt Spring Island, BC",
  ],
  sameAs: socialProfileUrls,
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Driving lessons",
        areaServed: "Greater Victoria, BC",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Class 5 and 7 road-test preparation",
        areaServed: "Greater Victoria, BC",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Defensive driving course",
        areaServed: "Victoria, BC",
      },
    },
  ],
};

const findMetaByName = (name: string) =>
  document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

const findMetaByProperty = (property: string) =>
  document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);

const setMetaByName = (name: string, content: string) => {
  const element = findMetaByName(name) ?? document.createElement("meta");
  element.setAttribute("name", name);
  element.setAttribute("content", content);

  if (!element.parentElement) {
    document.head.appendChild(element);
  }
};

const setMetaByProperty = (property: string, content: string) => {
  const element = findMetaByProperty(property) ?? document.createElement("meta");
  element.setAttribute("property", property);
  element.setAttribute("content", content);

  if (!element.parentElement) {
    document.head.appendChild(element);
  }
};

const setCanonical = (href: string) => {
  const element =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement("link");
  element.setAttribute("rel", "canonical");
  element.setAttribute("href", href);

  if (!element.parentElement) {
    document.head.appendChild(element);
  }
};

const setHreflangLinks = (href: string) => {
  [
    ["en-ca", href],
    ["x-default", href],
  ].forEach(([hreflang, url]) => {
    const element =
      document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`) ??
      document.createElement("link");

    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", hreflang);
    element.setAttribute("href", url);

    if (!element.parentElement) {
      document.head.appendChild(element);
    }
  });
};

const setJsonLd = (id: string, data: JsonLdObject | null) => {
  const existingElement = document.head.querySelector<HTMLScriptElement>(`script#${id}`);

  if (!data) {
    existingElement?.remove();
    return;
  }

  const element = existingElement ?? document.createElement("script");
  element.id = id;
  element.type = "application/ld+json";
  element.textContent = JSON.stringify(data);

  if (!element.parentElement) {
    document.head.appendChild(element);
  }
};

const buildFaqJsonLd = (faqs?: SeoLandingPageFaq[]): JsonLdObject | null => {
  if (!faqs?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

/* BlogPosting schema for article routes. `publisher` points at the LocalBusiness
   node by @id, which is emitted on every page, so the two graphs stay linked. */
const buildArticleJsonLd = (
  seo: SeoDetails,
  canonicalUrl: string,
  imageUrl: string,
): JsonLdObject | null => {
  if (!seo.article) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": seo.article.articleType ?? "BlogPosting",
    "@id": `${canonicalUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    headline: seo.article.headline,
    description: seo.description,
    image: imageUrl,
    datePublished: seo.article.datePublished,
    dateModified: seo.article.dateModified,
    articleSection: seo.article.section,
    inLanguage: "en-CA",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/about/`,
    },
    publisher: { "@id": `${SITE_ORIGIN}/#localbusiness` },
  };
};

/* BreadcrumbList mirrors the visible breadcrumb trail on the page. Google only
   renders breadcrumb rich results when the markup matches what the user sees. */
const buildBreadcrumbJsonLd = (breadcrumbs?: SeoBreadcrumb[]): JsonLdObject | null => {
  if (!breadcrumbs?.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteUrl(toCanonicalPath(crumb.path)),
    })),
  };
};

const getSeoForPath = (rawPathname: string): SeoDetails => {
  const path = normalizePath(rawPathname);

  if (noIndexPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return {
      title: `${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
      path,
      robots: "noindex, nofollow",
    };
  }

  const courseSlug = path.match(/^\/courses\/([^/]+)$/)?.[1];
  if (courseSlug) {
    const course = courseCatalog.find((item) => item.id === decodePathSegment(courseSlug));
    if (course) {
      return {
        title: `${course.title} in Victoria & Langford, BC | ${SITE_NAME}`,
        description: course.description,
        path,
      };
    }
  }

  const packageSlug = path.match(/^\/packages\/([^/]+)$/)?.[1];
  if (packageSlug) {
    const packageItem = packageCatalog.find((item) => item.id === decodePathSegment(packageSlug));
    if (packageItem) {
      return {
        title: `${packageItem.title} Driving Package | ${SITE_NAME}`,
        description: packageItem.description,
        path,
      };
    }
  }

  const extraSlug = path.match(/^\/extras\/([^/]+)$/)?.[1];
  if (extraSlug) {
    const extra = optionalExtras.find((item) => item.id === decodePathSegment(extraSlug));
    if (extra && typeof extra.price === "number") {
      return {
        title: `${extra.title} | ${SITE_NAME}`,
        description: extra.description,
        path,
      };
    }
  }

  const blogSlug = path.match(/^\/blog\/([^/]+)$/)?.[1];
  if (blogSlug) {
    const post = blogPosts.find((item) => item.slug === decodePathSegment(blogSlug));
    if (post) {
      return {
        title: post.seoTitle ?? `${post.title} | ${SITE_NAME}`,
        description: post.description,
        image: post.heroImage,
        path,
        type: "article",
        article: {
          headline: post.title,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
          section: post.category,
        },
      };
    }
  }

  const policySlug = path.match(/^\/policies\/([^/]+)$/)?.[1];
  if (policySlug) {
    const policy = sitePolicies.find((item) => item.id === decodePathSegment(policySlug));
    if (policy) {
      return {
        title: `${policy.label} | ${SITE_NAME}`,
        description: policy.cardDescription,
        path,
      };
    }
  }

  const landingPage = seoLandingPagesByPath[path];
  if (landingPage) {
      return {
        title: landingPage.title,
        description: landingPage.metaDescription,
        image: landingPage.heroImage,
        path: landingPage.path,
        faqs: landingPage.faqs,
      };
  }

  const staticSeo = staticRouteSeo[path];
  if (staticSeo) {
    return {
      ...staticSeo,
      path,
    };
  }

  return {
    title: `Page Not Found | ${SITE_NAME}`,
    description: "The page you are looking for could not be found.",
    path,
    robots: "noindex, follow",
  };
};

const SeoManager = () => {
  const location = useLocation();
  const seo = useMemo(() => getSeoForPath(location.pathname), [location.pathname]);

  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(toCanonicalPath(seo.path));
    const imageUrl = toAbsoluteUrl(seo.image ?? DEFAULT_IMAGE_PATH);

    document.title = seo.title;
    setCanonical(canonicalUrl);
    setHreflangLinks(canonicalUrl);
    setMetaByName("description", seo.description);
    setMetaByName("robots", seo.robots ?? "index, follow");
    setMetaByName("author", SITE_NAME);

    setMetaByProperty("og:type", seo.type ?? "website");
    setMetaByProperty("og:locale", "en_CA");
    setMetaByProperty("og:site_name", SITE_NAME);
    setMetaByProperty("og:url", canonicalUrl);
    setMetaByProperty("og:title", seo.title);
    setMetaByProperty("og:description", seo.description);
    setMetaByProperty("og:image", imageUrl);
    setMetaByProperty("og:image:alt", `${SITE_NAME} branded social preview`);

    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", seo.title);
    setMetaByName("twitter:description", seo.description);
    setMetaByName("twitter:image", imageUrl);
    setMetaByName("twitter:image:alt", `${SITE_NAME} branded social preview`);

    setJsonLd("local-business-schema", localBusinessJsonLd);
    setJsonLd("faq-schema", buildFaqJsonLd(seo.faqs));
    setJsonLd("article-schema", buildArticleJsonLd(seo, canonicalUrl, imageUrl));
    setJsonLd("breadcrumb-schema", buildBreadcrumbJsonLd(seo.breadcrumbs));
  }, [seo]);

  return null;
};

export default SeoManager;
