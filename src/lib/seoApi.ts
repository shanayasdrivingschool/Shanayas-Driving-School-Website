import { clearAdminAccessCache, ensureSupabaseClient } from "@/lib/adminAccess";
import type { AdminBlogPostsResponse, BlogPostRecord } from "@/lib/blogAdmin";
import { clearSeoAccessCache, hasSeoPortalAccess, requireBlogEditorUser } from "@/lib/seoAccess";

const BLOG_FETCH_BATCH_SIZE = 500;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const mapBlogPost = (row: Record<string, unknown>): BlogPostRecord => ({
  id: String(row.id),
  slug: String(row.slug),
  title: String(row.title),
  status: String(row.status) as BlogPostRecord["status"],
  readiness: String(row.readiness) as BlogPostRecord["readiness"],
  publicationState: String(row.publication_state) as BlogPostRecord["publicationState"],
  category: String(row.category ?? ""),
  excerpt: String(row.excerpt ?? ""),
  contentBlocks: Array.isArray(row.content_blocks) ? row.content_blocks as BlogPostRecord["contentBlocks"] : [],
  coverImageUrl: String(row.cover_image_url ?? ""),
  coverImageAlt: String(row.cover_image_alt ?? ""),
  coverImageCaption: String(row.cover_image_caption ?? ""),
  coverImageCredit: String(row.cover_image_credit ?? ""),
  seoTitle: String(row.seo_title ?? ""),
  metaDescription: String(row.meta_description ?? ""),
  canonicalPath: String(row.canonical_path ?? ""),
  ogTitle: String(row.og_title ?? ""),
  ogDescription: String(row.og_description ?? ""),
  ogImageUrl: String(row.og_image_url ?? ""),
  robots: String(row.robots) as BlogPostRecord["robots"],
  schemaType: String(row.schema_type) as BlogPostRecord["schemaType"],
  breadcrumbSchemaEnabled: Boolean(row.breadcrumb_schema_enabled),
  faqSchemaEnabled: Boolean(row.faq_schema_enabled),
  faqs: Array.isArray(row.faqs) ? row.faqs as BlogPostRecord["faqs"] : [],
  relatedSlugs: Array.isArray(row.related_slugs) ? row.related_slugs.map(String) : [],
  annotations: Array.isArray(row.annotations) ? row.annotations as BlogPostRecord["annotations"] : [],
  brief: asRecord(row.editorial_brief) as BlogPostRecord["brief"],
  authorName: String(row.author_name ?? "Shanaya's Driving School"),
  reviewerName: String(row.reviewer_name ?? ""),
  reviewScope: String(row.review_scope ?? ""),
  reviewRequired: Boolean(row.review_required),
  reviewedAt: typeof row.reviewed_at === "string" ? row.reviewed_at : "",
  scheduledFor: typeof row.scheduled_for === "string" ? row.scheduled_for : "",
  publishedAt: typeof row.published_at === "string" ? row.published_at : "",
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
  sourceOrigin: row.source_origin === "code_import" ? "code_import" : "cms",
  publishedSnapshot:
    row.published_snapshot && typeof row.published_snapshot === "object" && !Array.isArray(row.published_snapshot)
      ? asRecord(row.published_snapshot)
      : null,
  publishedRevisionAt: typeof row.published_revision_at === "string" ? row.published_revision_at : "",
});

export const getSeoSession = async () => {
  try {
    await requireBlogEditorUser();
    return { isSeoUser: true };
  } catch {
    return { isSeoUser: false };
  }
};

export const signInSeo = async (email: string, password: string) => {
  const client = ensureSupabaseClient();
  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  if (!data.user || !(await hasSeoPortalAccess(client, data.user.id))) {
    await client.auth.signOut().catch(() => undefined);
    throw new Error("This account does not have SEO portal access.");
  }
};

export const signOutSeo = async () => {
  const client = ensureSupabaseClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  clearSeoAccessCache();
  clearAdminAccessCache();
};

export const getSeoBlogPosts = async (): Promise<AdminBlogPostsResponse> => {
  const { client } = await requireBlogEditorUser();
  const rows: Record<string, unknown>[] = [];
  let from = 0;

  while (true) {
    const to = from + BLOG_FETCH_BATCH_SIZE - 1;
    const { data, error } = await client
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    const batch = (data ?? []) as Record<string, unknown>[];
    rows.push(...batch);
    if (batch.length < BLOG_FETCH_BATCH_SIZE) break;
    from += BLOG_FETCH_BATCH_SIZE;
  }

  const posts = rows.map(mapBlogPost);
  return {
    posts,
    totals: {
      total: posts.length,
      drafts: posts.filter((post) => post.status === "draft").length,
      inReview: posts.filter((post) => post.status === "in_review").length,
      approved: posts.filter((post) => post.status === "approved").length,
      scheduled: posts.filter((post) => post.status === "scheduled").length,
      published: posts.filter((post) => post.status === "published").length,
    },
  };
};
