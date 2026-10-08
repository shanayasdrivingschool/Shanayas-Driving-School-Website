import { useQuery } from "@tanstack/react-query";
import { activeBlogPosts, type BlogPostData } from "@/data/blogPosts";
import { blogBlocksPlainText, renderBlogBlocksToHtml, sanitizeBlogHtml } from "@/lib/blogHtml";
import type { BlogContentBlock, BlogFaq } from "@/lib/blogAdmin";

type PublicBlogRow = {
  snapshot: Record<string, unknown>;
  published_at: string;
  updated_at: string;
};

const stringValue = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const stringArray = (value: unknown) => Array.isArray(value) ? value.map(String) : [];

const dateOnly = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const displayDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
};

const readTime = (blocks: BlogContentBlock[]) => {
  const words = blogBlocksPlainText(blocks).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

export const mapPublicBlogRow = (row: PublicBlogRow): BlogPostData | null => {
  const snapshot = row.snapshot;
  const slug = stringValue(snapshot.slug);
  const title = stringValue(snapshot.title);
  if (!slug || !title) return null;

  const blocks = Array.isArray(snapshot.contentBlocks) ? snapshot.contentBlocks as BlogContentBlock[] : [];
  const publishedAt = stringValue(snapshot.datePublished, row.published_at);
  const modifiedAt = stringValue(snapshot.dateModified, row.updated_at);
  const rawHtml = renderBlogBlocksToHtml(blocks);

  return {
    slug,
    title,
    seoTitle: stringValue(snapshot.seoTitle) || undefined,
    canonicalPath: stringValue(snapshot.canonicalPath) || `/blog/${slug}/`,
    description: stringValue(snapshot.metaDescription, stringValue(snapshot.excerpt)),
    heroImage: stringValue(snapshot.coverImageUrl),
    author: "Shanaya's Driving School",
    authorName: stringValue(snapshot.authorName, "Shanaya's Driving School"),
    reviewerName: stringValue(snapshot.reviewerName) || undefined,
    date: displayDate(modifiedAt || publishedAt),
    datePublished: dateOnly(publishedAt),
    dateModified: dateOnly(modifiedAt || publishedAt),
    readTime: readTime(blocks),
    category: stringValue(snapshot.category, "Driving resources"),
    content: null,
    contentHtml: sanitizeBlogHtml(rawHtml),
    relatedSlugs: stringArray(snapshot.relatedSlugs),
    faqs: Array.isArray(snapshot.faqs) ? snapshot.faqs as BlogFaq[] : [],
    robots: stringValue(snapshot.robots, "index, follow") as BlogPostData["robots"],
    schemaType: stringValue(snapshot.schemaType, "BlogPosting") as BlogPostData["schemaType"],
    faqSchemaEnabled: snapshot.faqSchemaEnabled !== false,
    breadcrumbSchemaEnabled: snapshot.breadcrumbSchemaEnabled !== false,
  };
};

export const mergePublicBlogPosts = (published: BlogPostData[]) => {
  const bySlug = new Map(activeBlogPosts.map((post) => [post.slug, post]));
  published.forEach((post) => bySlug.set(post.slug, post));
  return [...bySlug.values()];
};

export const getPublishedBlogPosts = async () => {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return [];
  const response = await fetch(`${url}/rest/v1/public_blog_posts?select=snapshot,published_at,updated_at&order=published_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error("Unable to load published blog articles.");
  const data = await response.json() as PublicBlogRow[];
  return data.map(mapPublicBlogRow).filter((post): post is BlogPostData => Boolean(post));
};

export const usePublicBlogPosts = (enabled = true) => {
  const query = useQuery({
    queryKey: ["public-blog-posts"],
    queryFn: getPublishedBlogPosts,
    enabled,
    staleTime: 60_000,
    retry: 1,
  });

  return {
    ...query,
    posts: mergePublicBlogPosts(query.data ?? []),
  };
};
