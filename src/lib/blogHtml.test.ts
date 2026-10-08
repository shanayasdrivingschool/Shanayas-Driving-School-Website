import { describe, expect, it } from "vitest";
import { renderBlogBlocksToHtml, sanitizeBlogHtml } from "@/lib/blogHtml";
import { createBlogContentBlock } from "@/lib/blogAdmin";

describe("sanitizeBlogHtml", () => {
  it("preserves article formatting and safe links", () => {
    const html = sanitizeBlogHtml('<h1>Page heading</h1><h2>Heading</h2><p><strong>Text</strong> <a href="/blog/test">link</a></p>');
    expect(html).toContain("<h1>Page heading</h1>");
    expect(html).toContain("<h2>Heading</h2>");
    expect(html).toContain('<a href="/blog/test">link</a>');
  });

  it("keeps external new-tab links safe", () => {
    const html = sanitizeBlogHtml('<p><a href="https://www.icbc.com/" target="_blank">ICBC</a></p>');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("removes executable markup and unsafe attributes", () => {
    const html = sanitizeBlogHtml('<p onclick="alert(1)">Safe</p><script>alert(1)</script><a href="javascript:alert(1)">Bad</a>');
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("Safe");
  });

  it("renders structured public blocks with escaped text and safe links", () => {
    const paragraph = { ...createBlogContentBlock("paragraph"), text: "Safe <script>text</script>" };
    const link = {
      ...createBlogContentBlock("link"),
      text: "ICBC",
      linkKind: "external" as const,
      url: "https://www.icbc.com/",
      openInNewTab: true,
    };

    const html = renderBlogBlocksToHtml([paragraph, link]);
    expect(html).toContain("Safe &lt;script&gt;text&lt;/script&gt;");
    expect(html).toContain('href="https://www.icbc.com/"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("preserves safe inline formatting and links saved in paragraph blocks", () => {
    const paragraph = {
      ...createBlogContentBlock("paragraph"),
      text: "Read the official ICBC guide.",
      html: '<p>Read the <strong>official</strong> <a href="https://www.icbc.com/" target="_blank">ICBC guide</a>.</p>',
    };

    const html = renderBlogBlocksToHtml([paragraph]);
    expect(html).toContain("<strong>official</strong>");
    expect(html).toContain('href="https://www.icbc.com/"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
