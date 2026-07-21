import { blogPosts } from "@/data/blogPosts";
import { courseCatalog } from "@/data/courseCatalog";
import { packageCatalog } from "@/data/packageCatalog";
import { seoLandingPages } from "@/data/seoLandingPages";

export type SiteSearchItemType = "Page" | "Package" | "Course" | "Resource" | "Blog";

export type SiteSearchItem = {
  title: string;
  description: string;
  href: string;
  type: SiteSearchItemType;
  keywords?: string[];
};

const staticSearchItems: SiteSearchItem[] = [
  {
    title: "Home",
    description: "Main landing page with core driving school services, packages, and recent resources.",
    href: "/",
    type: "Page",
    keywords: ["home", "landing", "driving school", "book"],
  },
  {
    title: "Packages",
    description: "Browse complete driving lesson packages for beginners, test prep, and confidence building.",
    href: "/packages",
    type: "Page",
    keywords: ["packages", "bundle", "pricing", "fresh start", "skill builder", "final lap"],
  },
  {
    title: "Courses",
    description: "Browse individual driving courses covering beginner training, road test prep, parking, and more.",
    href: "/courses",
    type: "Page",
    keywords: ["courses", "lesson", "driving classes", "training"],
  },
  {
    title: "About",
    description: "Learn about the school, instructors, and training approach.",
    href: "/about",
    type: "Page",
    keywords: ["about", "school", "instructors"],
  },
  {
    title: "Contact",
    description: "Contact Shanaya's Driving School to book lessons or ask questions.",
    href: "/contact",
    type: "Page",
    keywords: ["contact", "phone", "email", "location"],
  },
  {
    title: "Careers",
    description: "Explore current opportunities and affiliate program information.",
    href: "/careers",
    type: "Page",
    keywords: ["careers", "jobs", "hiring", "instructor"],
  },
  {
    title: "Independent Class 7 Knowledge Test Practice",
    description: "Use the site's independent study bank, then verify rules with ICBC's official resources.",
    href: "/knowledge-test-practice",
    type: "Resource",
    keywords: ["knowledge test", "practice", "quiz", "learner", "icbc"],
  },
  {
    title: "B.C. Class 7 Knowledge Test Guide",
    description: "Compare ICBC's online and in-person Class 7 test workflows, fees, ID and licence steps.",
    href: "/knowledge-test-guide",
    type: "Resource",
    keywords: ["knowledge test guide", "class 7", "learner", "online test", "in-person test", "icbc"],
  },
  {
    title: "Moving to B.C.: Driver's Licence Guide",
    description: "Choose the ICBC path to exchange a valid licence or start B.C.'s Class 7 process.",
    href: "/newcomers-guide",
    type: "Resource",
    keywords: ["newcomer", "moving to bc", "exchange licence", "bc licence", "driving experience", "class 7"],
  },
  {
    title: "Blog",
    description: "Driving tips, study guides, and road test articles from the school.",
    href: "/blog",
    type: "Resource",
    keywords: ["blog", "articles", "tips", "resources"],
  },
];

const packageSearchItems: SiteSearchItem[] = packageCatalog.map((pkg) => ({
  title: pkg.title,
  description: pkg.description,
  href: `/packages/${pkg.id}`,
  type: "Package",
  keywords: [...pkg.overview, ...pkg.outcomes, ...pkg.includedCourseIds],
}));

const courseSearchItems: SiteSearchItem[] = courseCatalog.map((course) => ({
  title: course.title,
  description: course.description,
  href: `/courses/${course.id}`,
  type: "Course",
  keywords: [...course.highlights, ...course.quizTags, course.level, course.deliveryFormat],
}));

const seoLandingSearchItems: SiteSearchItem[] = seoLandingPages.map((page) => ({
  title: page.h1,
  description: page.metaDescription,
  href: page.path,
  type: "Page",
  keywords: [page.eyebrow, page.targetKeyword, page.id],
}));

const blogSearchItems: SiteSearchItem[] = blogPosts.map((post) => ({
  title: post.title,
  description: post.description,
  href: `/blog/${post.slug}`,
  type: "Blog",
  keywords: [post.category, post.author, post.readTime],
}));

export const siteSearchIndex: SiteSearchItem[] = [
  ...staticSearchItems,
  ...seoLandingSearchItems,
  ...packageSearchItems,
  ...courseSearchItems,
  ...blogSearchItems,
];

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

export const searchSite = (query: string, limit = 8): SiteSearchItem[] => {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return siteSearchIndex
    .map((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const keywords = (item.keywords ?? []).join(" ").toLowerCase();
      const href = item.href.toLowerCase();
      const type = item.type.toLowerCase();
      let score = 0;

      for (const term of terms) {
        let termScore = 0;

        if (title.startsWith(term)) termScore += 9;
        else if (title.includes(term)) termScore += 6;

        if (keywords.includes(term)) termScore += 4;
        if (description.includes(term)) termScore += 3;
        if (type.includes(term)) termScore += 2;
        if (href.includes(term)) termScore += 1;

        if (termScore === 0) {
          return null;
        }

        score += termScore;
      }

      return { item, score };
    })
    .filter((entry): entry is { item: SiteSearchItem; score: number } => Boolean(entry))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.item.title.localeCompare(right.item.title);
    })
    .slice(0, limit)
    .map(({ item }) => item);
};
