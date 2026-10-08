import { describe, expect, it } from "vitest";
import {
  createBlogContentBlock,
  createEmptyBlogPost,
  slugifyBlogTitle,
  validateBlogPost,
} from "@/lib/blogAdmin";

describe("blog admin validation", () => {
  it("creates safe URL slugs", () => {
    expect(slugifyBlogTitle("ICBC’s Road Signs: Victoria & Langford")).toBe("icbcs-road-signs-victoria-langford");
  });

  it("requires an H2 section even when the title supplies the default H1", () => {
    const draft = createEmptyBlogPost();
    draft.title = "A useful article";
    draft.slug = "a-useful-article";
    draft.category = "Knowledge Test";
    draft.excerpt = "A concise summary.";
    draft.metaDescription = "A concise description of the useful article.";
    draft.contentBlocks = [{ ...createBlogContentBlock("paragraph"), text: "The answer comes first." }];

    expect(validateBlogPost(draft).some((issue) => issue.field === "Headings" && issue.level === "error")).toBe(true);
  });

  it("rejects skipped heading levels", () => {
    const draft = createEmptyBlogPost();
    draft.contentBlocks = [
      { ...createBlogContentBlock("heading"), level: 2, text: "First" },
      { ...createBlogContentBlock("heading"), level: 4, text: "Skipped" },
    ];

    expect(validateBlogPost(draft).some((issue) => issue.message.includes("cannot skip"))).toBe(true);
  });

  it("allows an H1 block but flags the duplicate-H1 risk", () => {
    const draft = createEmptyBlogPost();
    draft.contentBlocks = [
      { ...createBlogContentBlock("heading"), level: 1, text: "Custom page heading" },
      { ...createBlogContentBlock("heading"), level: 2, text: "First section" },
    ];

    expect(validateBlogPost(draft).some((issue) => issue.level === "warning" && issue.message.includes("already renders as H1"))).toBe(true);
  });

  it("validates internal and external link destinations", () => {
    const draft = createEmptyBlogPost();
    draft.contentBlocks = [
      { ...createBlogContentBlock("link"), text: "Unsafe external link", linkKind: "external", url: "javascript:alert(1)" },
      { ...createBlogContentBlock("link"), text: "Invalid internal link", linkKind: "internal", url: "//example.com" },
    ];

    const issues = validateBlogPost(draft);
    expect(issues.some((issue) => issue.message.includes("complete HTTPS URL"))).toBe(true);
    expect(issues.some((issue) => issue.message.includes("one slash"))).toBe(true);
  });
});
