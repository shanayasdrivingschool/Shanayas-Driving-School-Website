import type { AdminBlogPostUpsertInput } from "@/lib/blogAdmin";
import { requireBlogEditorUser } from "@/lib/seoAccess";

export const saveSeoBlogPost = async (input: AdminBlogPostUpsertInput) => {
  const { client, user } = await requireBlogEditorUser();
  const nullableDate = (value: string) => value.trim() || null;
  const payload = {
    slug: input.slug.trim(),
    title: input.title.trim(),
    status: input.status,
    readiness: input.readiness,
    publication_state: input.publicationState,
    category: input.category.trim(),
    excerpt: input.excerpt.trim(),
    content_blocks: input.contentBlocks,
    cover_image_url: input.coverImageUrl.trim(),
    cover_image_alt: input.coverImageAlt.trim(),
    cover_image_caption: input.coverImageCaption.trim(),
    cover_image_credit: input.coverImageCredit.trim(),
    seo_title: input.seoTitle.trim(),
    meta_description: input.metaDescription.trim(),
    canonical_path: input.canonicalPath.trim(),
    og_title: input.ogTitle.trim(),
    og_description: input.ogDescription.trim(),
    og_image_url: input.ogImageUrl.trim(),
    robots: input.robots,
    schema_type: input.schemaType,
    breadcrumb_schema_enabled: input.breadcrumbSchemaEnabled,
    faq_schema_enabled: input.faqSchemaEnabled,
    faqs: input.faqs,
    related_slugs: input.relatedSlugs,
    annotations: input.annotations,
    editorial_brief: input.brief,
    author_name: input.authorName.trim(),
    reviewer_name: input.reviewerName.trim(),
    review_scope: input.reviewScope.trim(),
    review_required: input.reviewRequired,
    reviewed_at: nullableDate(input.reviewedAt),
    scheduled_for: nullableDate(input.scheduledFor),
    published_at: nullableDate(input.publishedAt),
    updated_by: user.id,
  };

  const query = input.id
    ? client.from("blog_posts").update(payload).eq("id", input.id).select("id").single()
    : client.from("blog_posts").insert({ ...payload, created_by: user.id }).select("id").single();

  const { data, error } = await query;
  if (error) throw error;
  return { success: true, id: String(data.id) };
};

export const deleteSeoBlogPost = async (id: string) => {
  const { client } = await requireBlogEditorUser();
  const { error } = await client.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
};

export const uploadSeoBlogImage = async (file: File, slug: string) => {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Cover images must be 5 MB or smaller.");

  const { client } = await requireBlogEditorUser();
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const safeSlug = slug.trim().replace(/[^a-z0-9-]/g, "-") || "draft";
  const path = `${safeSlug}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from("blog-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from("blog-media").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
};
