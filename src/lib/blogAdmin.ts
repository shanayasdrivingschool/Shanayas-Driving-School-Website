export type BlogPostStatus = "draft" | "in_review" | "approved" | "scheduled" | "published" | "archived";
export type BlogReadiness = "needs_revision" | "awaiting_evidence_review" | "ready";
export type BlogPublicationState = "draft_only" | "implemented_locally" | "live_confirmed" | "publication_unverified";
export type BlogSchemaType = "BlogPosting" | "Article";
export type BlogRobotsDirective = "index, follow" | "noindex, follow" | "noindex, nofollow";
export type BlogBlockType = "paragraph" | "heading" | "bulleted_list" | "numbered_list" | "quote" | "callout" | "link" | "rich_html";
export type BlogLinkKind = "internal" | "external";
export type BlogSourceOrigin = "cms" | "code_import";

export type BlogContentBlock = {
  id: string;
  type: BlogBlockType;
  text: string;
  html?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  items?: string[];
  url?: string;
  linkKind?: BlogLinkKind;
  openInNewTab?: boolean;
};

export type BlogFaq = {
  id: string;
  question: string;
  answer: string;
};

export type BlogAnnotation = {
  id: string;
  field: string;
  note: string;
  resolved: boolean;
};

export type BlogEditorialBrief = {
  primaryReader: string;
  targetQuestion: string;
  location: string;
  intendedOutcome: string;
  scope: string;
  overlap: string;
  evidenceGaps: string;
  originalContribution: string;
  responsibleAuthor: string;
  nextStep: string;
  maintenanceDate: string;
};

export type BlogPostRecord = {
  id: string;
  slug: string;
  title: string;
  status: BlogPostStatus;
  readiness: BlogReadiness;
  publicationState: BlogPublicationState;
  category: string;
  excerpt: string;
  contentBlocks: BlogContentBlock[];
  coverImageUrl: string;
  coverImageAlt: string;
  coverImageCaption: string;
  coverImageCredit: string;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;
  robots: BlogRobotsDirective;
  schemaType: BlogSchemaType;
  breadcrumbSchemaEnabled: boolean;
  faqSchemaEnabled: boolean;
  faqs: BlogFaq[];
  relatedSlugs: string[];
  annotations: BlogAnnotation[];
  brief: BlogEditorialBrief;
  authorName: string;
  reviewerName: string;
  reviewScope: string;
  reviewRequired: boolean;
  reviewedAt: string;
  scheduledFor: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  sourceOrigin: BlogSourceOrigin;
  publishedSnapshot: Record<string, unknown> | null;
  publishedRevisionAt: string;
};

export type AdminBlogPostsResponse = {
  posts: BlogPostRecord[];
  totals: {
    total: number;
    drafts: number;
    inReview: number;
    approved: number;
    scheduled: number;
    published: number;
  };
};

export type AdminBlogPostUpsertInput = Omit<BlogPostRecord, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export type BlogValidationIssue = {
  level: "error" | "warning";
  field: string;
  message: string;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blog-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createBlogContentBlock = (type: BlogBlockType = "paragraph"): BlogContentBlock => ({
  id: createId(),
  type,
  text: "",
  ...(type === "heading" ? { level: 2 as const } : {}),
  ...(type === "bulleted_list" || type === "numbered_list" ? { items: [""] } : {}),
  ...(type === "link" ? { url: "", linkKind: "internal" as const, openInNewTab: false } : {}),
  ...(type === "rich_html" ? { html: "<p></p>" } : {}),
});

export const createBlogFaq = (): BlogFaq => ({ id: createId(), question: "", answer: "" });

export const createBlogAnnotation = (): BlogAnnotation => ({
  id: createId(),
  field: "",
  note: "",
  resolved: false,
});

export const createEmptyBlogPost = (): AdminBlogPostUpsertInput => ({
  slug: "",
  title: "",
  status: "draft",
  readiness: "needs_revision",
  publicationState: "draft_only",
  category: "",
  excerpt: "",
  contentBlocks: [createBlogContentBlock("paragraph"), createBlogContentBlock("heading")],
  coverImageUrl: "",
  coverImageAlt: "",
  coverImageCaption: "",
  coverImageCredit: "",
  seoTitle: "",
  metaDescription: "",
  canonicalPath: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  robots: "noindex, follow",
  schemaType: "BlogPosting",
  breadcrumbSchemaEnabled: true,
  faqSchemaEnabled: true,
  faqs: [],
  relatedSlugs: [],
  annotations: [],
  brief: {
    primaryReader: "",
    targetQuestion: "",
    location: "Victoria, British Columbia",
    intendedOutcome: "",
    scope: "",
    overlap: "",
    evidenceGaps: "",
    originalContribution: "",
    responsibleAuthor: "Shanaya's Driving School",
    nextStep: "",
    maintenanceDate: "",
  },
  authorName: "Shanaya's Driving School",
  reviewerName: "",
  reviewScope: "",
  reviewRequired: false,
  reviewedAt: "",
  scheduledFor: "",
  publishedAt: "",
  sourceOrigin: "cms",
  publishedSnapshot: null,
  publishedRevisionAt: "",
});

export const slugifyBlogTitle = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const hasHeadingJump = (blocks: BlogContentBlock[]) => {
  let previousLevel = 1;
  for (const block of blocks) {
    if (block.type !== "heading") continue;
    const level = block.level ?? 2;
    if (level > previousLevel + 1) return true;
    previousLevel = level;
  }
  return false;
};

export const validateBlogPost = (post: AdminBlogPostUpsertInput): BlogValidationIssue[] => {
  const issues: BlogValidationIssue[] = [];
  const add = (level: BlogValidationIssue["level"], field: string, message: string) =>
    issues.push({ level, field, message });

  if (!post.title.trim()) add("error", "Title", "Add the article title. It renders as the page H1 by default.");
  if (!post.slug.trim()) add("error", "Slug", "Add a URL slug.");
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    add("error", "Slug", "Use lowercase letters, numbers and single hyphens only.");
  }
  if (!post.category.trim()) add("error", "Category", "Choose a useful article category.");
  if (!post.excerpt.trim()) add("error", "Excerpt", "Add a reader-facing summary.");
  if (!post.contentBlocks.some((block) => (block.type === "paragraph" || block.type === "rich_html") && block.text.trim())) {
    add("error", "Content", "Add an opening paragraph that answers the reader's question early.");
  }
  if (!post.contentBlocks.some((block) =>
    (block.type === "heading" && block.level === 2 && block.text.trim()) ||
    (block.type === "rich_html" && /<h2\b/i.test(block.html ?? "")))) {
    add("error", "Headings", "Add at least one H2 section. H1 is generated from the title.");
  }
  if (hasHeadingJump(post.contentBlocks)) {
    add("error", "Headings", "Heading levels cannot skip a level (for example, H2 directly to H4).");
  }
  if (post.contentBlocks.some((block) => block.type === "heading" && block.level === 1)) {
    add("warning", "Headings", "The article title already renders as H1. Use another H1 only when intentionally restructuring the page hierarchy.");
  }
  for (const [index, block] of post.contentBlocks.entries()) {
    if (block.type !== "link") continue;
    if (!block.text.trim()) add("error", `Link ${index + 1}`, "Add visible link text.");
    if (block.linkKind === "internal") {
      if (!block.url?.startsWith("/") || block.url.startsWith("//")) {
        add("error", `Link ${index + 1}`, "Internal links must use a site path beginning with one slash.");
      }
    } else if (!/^https:\/\//i.test(block.url ?? "")) {
      add("error", `Link ${index + 1}`, "External links must use a complete HTTPS URL.");
    }
  }
  if (!post.coverImageUrl.trim()) add("warning", "Cover image", "Add a cover image before publication.");
  if (post.coverImageUrl.trim() && !post.coverImageAlt.trim()) {
    add("error", "Image alt text", "Describe the cover image for readers who cannot see it.");
  }
  if (!post.seoTitle.trim()) add("warning", "SEO title", "Add a search title or the article title will be used.");
  if (post.seoTitle.trim().length > 60) add("warning", "SEO title", "The SEO title is longer than 60 characters.");
  if (!post.metaDescription.trim()) add("error", "Meta description", "Add a description that matches the visible article.");
  if (post.metaDescription.trim().length > 160) {
    add("warning", "Meta description", "The meta description is longer than 160 characters.");
  }
  if (post.canonicalPath && !post.canonicalPath.startsWith("/blog/") && !/^https:\/\//.test(post.canonicalPath)) {
    add("error", "Canonical", "Use a /blog/... path or a complete HTTPS URL.");
  }
  if (post.faqSchemaEnabled) {
    for (const [index, faq] of post.faqs.entries()) {
      if (!faq.question.trim() || !faq.answer.trim()) {
        add("error", `FAQ ${index + 1}`, "Every schema FAQ needs a visible question and answer.");
      }
    }
  }
  if (!post.brief.primaryReader.trim() || !post.brief.targetQuestion.trim() || !post.brief.intendedOutcome.trim()) {
    add("warning", "Editorial brief", "Record the primary reader, target question and intended outcome.");
  }
  if (!post.brief.overlap.trim()) {
    add("warning", "Overlap check", "Record how this article differs from or updates existing coverage.");
  }
  if (!post.authorName.trim()) add("error", "Author", "Name the actual author or responsible organization.");
  if (post.reviewRequired && (!post.reviewerName.trim() || !post.reviewScope.trim() || !post.reviewedAt)) {
    add("error", "Required review", "Record the real reviewer, review scope and review date before approval.");
  }
  if (!post.reviewRequired && (post.reviewerName.trim() || post.reviewScope.trim() || post.reviewedAt)) {
    add("warning", "Review record", "Review details are present while required review is turned off.");
  }
  if (post.readiness === "ready" && issues.some((issue) => issue.level === "error")) {
    add("error", "Readiness", "A page with unresolved errors cannot be marked Ready.");
  }
  if (post.status === "scheduled" && !post.scheduledFor) {
    add("error", "Schedule", "Choose a future publication time for a scheduled article.");
  }
  if (post.status === "published" && !post.publishedAt) {
    add("error", "Publication date", "A published article needs its actual publication date.");
  }

  return issues;
};

const absoluteUrl = (value: string) => {
  if (/^https:\/\//.test(value)) return value;
  const path = value.startsWith("/") ? value : `/${value}`;
  return `https://www.shanayasdrivingschool.com${path}`;
};

export const buildBlogSchemaPreview = (post: AdminBlogPostUpsertInput) => {
  const canonical = absoluteUrl(post.canonicalPath || `/blog/${post.slug}/`);
  const article = {
    "@context": "https://schema.org",
    "@type": post.schemaType,
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    ...(post.coverImageUrl ? { image: absoluteUrl(post.coverImageUrl) } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    author: { "@type": "Organization", name: post.authorName || "Shanaya's Driving School" },
    publisher: { "@id": "https://www.shanayasdrivingschool.com/#localbusiness" },
    articleSection: post.category,
    inLanguage: "en-CA",
  };

  const faq = post.faqSchemaEnabled && post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  const breadcrumbs = post.breadcrumbSchemaEnabled
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://www.shanayasdrivingschool.com/" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.shanayasdrivingschool.com/blog/" },
          { "@type": "ListItem", position: 3, name: post.title, item: canonical },
        ],
      }
    : null;

  return [article, faq, breadcrumbs].filter(Boolean);
};
