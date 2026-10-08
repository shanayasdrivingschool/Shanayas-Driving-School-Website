import { describe, expect, it } from "vitest";
import { mapPublicBlogRow, mergePublicBlogPosts } from "@/lib/publicBlog";

describe("public blog publications", () => {
  it("maps a publication snapshot into a public article", () => {
    const post = mapPublicBlogRow({
      published_at: "2026-10-08T10:00:00Z",
      updated_at: "2026-10-08T11:00:00Z",
      snapshot: {
        slug: "cms-article",
        title: "CMS article",
        excerpt: "A public summary.",
        category: "Knowledge Test",
        contentBlocks: [
          { id: "p1", type: "paragraph", text: "Opening answer." },
          { id: "h2", type: "heading", level: 2, text: "Next step" },
        ],
        coverImageUrl: "/blog/test.webp",
        relatedSlugs: [],
        faqs: [],
      },
    });

    expect(post?.slug).toBe("cms-article");
    expect(post?.contentHtml).toContain("<h2>Next step</h2>");
    expect(post?.datePublished).toBe("2026-10-08");
  });

  it("lets a CMS publication replace the matching code-authored article", () => {
    const replacement = {
      slug: "pass-road-test",
      title: "Republished title",
      description: "Updated",
      heroImage: "/updated.webp",
      author: "Shanaya's Driving School",
      date: "October 8, 2026",
      datePublished: "2026-03-01",
      dateModified: "2026-10-08",
      readTime: "5 min read",
      category: "Road Test",
      content: null,
    };

    const merged = mergePublicBlogPosts([replacement]);
    expect(merged.find((post) => post.slug === "pass-road-test")?.title).toBe("Republished title");
  });
});
