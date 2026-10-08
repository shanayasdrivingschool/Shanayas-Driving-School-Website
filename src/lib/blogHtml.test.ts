import { describe, expect, it } from "vitest";
import { sanitizeBlogHtml } from "@/lib/blogHtml";

describe("sanitizeBlogHtml", () => {
  it("preserves article formatting and safe links", () => {
    const html = sanitizeBlogHtml('<h2>Heading</h2><p><strong>Text</strong> <a href="/blog/test">link</a></p>');
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain('<a href="/blog/test">link</a>');
  });

  it("removes executable markup and unsafe attributes", () => {
    const html = sanitizeBlogHtml('<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">Bad</a>');
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("Safe");
  });
});
