const ALLOWED_TAGS = new Set([
  "a", "blockquote", "br", "caption", "code", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "li", "ol", "p", "pre", "span", "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "ul",
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
  th: new Set(["scope", "colspan", "rowspan"]),
  td: new Set(["colspan", "rowspan"]),
};

const isSafeHref = (value: string) =>
  value.startsWith("/") ||
  value.startsWith("#") ||
  /^(https?:|mailto:|tel:)/i.test(value);

export const sanitizeBlogHtml = (value: string) => {
  if (!value.trim() || typeof DOMParser === "undefined") return value;

  const document = new DOMParser().parseFromString(`<div>${value}</div>`, "text/html");
  const root = document.body.firstElementChild;
  if (!root) return "";

  for (const element of Array.from(root.querySelectorAll("*"))) {
    const tag = element.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }

    const allowed = ALLOWED_ATTRIBUTES[tag] ?? new Set<string>();
    for (const attribute of Array.from(element.attributes)) {
      if (!allowed.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
    }

    if (tag === "a") {
      const href = element.getAttribute("href") ?? "";
      if (!isSafeHref(href)) element.removeAttribute("href");
      if (element.getAttribute("target") === "_blank") {
        element.setAttribute("rel", "noopener noreferrer");
      } else {
        element.removeAttribute("target");
        element.removeAttribute("rel");
      }
    }
  }

  return root.innerHTML;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const safeBlockHref = (block: BlogContentBlock) => {
  const url = block.url?.trim() ?? "";
  if (block.linkKind === "internal") {
    return url.startsWith("/") && !url.startsWith("//") ? url : "#";
  }
  return /^https:\/\//i.test(url) ? url : "#";
};

/** Converts the editor's structured blocks into the public article body. Rich
 * HTML is sanitized in the browser before rendering and is also sanitized on
 * every editor save; the remaining block types are escaped here. */
export const renderBlogBlocksToHtml = (blocks: BlogContentBlock[]) =>
  blocks.map((block) => {
    if (block.type === "rich_html" || (block.type === "paragraph" && block.html?.trim())) {
      return sanitizeBlogHtml(block.html ?? "");
    }

    if (block.type === "heading") {
      const level = Math.min(6, Math.max(1, block.level ?? 2));
      return `<h${level}>${escapeHtml(block.text)}</h${level}>`;
    }

    if (block.type === "bulleted_list" || block.type === "numbered_list") {
      const tag = block.type === "bulleted_list" ? "ul" : "ol";
      const items = (block.items ?? []).filter((item) => item.trim()).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return items ? `<${tag}>${items}</${tag}>` : "";
    }

    if (block.type === "quote") return `<blockquote>${escapeHtml(block.text)}</blockquote>`;
    if (block.type === "callout") return `<aside>${escapeHtml(block.text)}</aside>`;

    if (block.type === "link") {
      const href = escapeHtml(safeBlockHref(block));
      const externalAttributes = block.linkKind === "external" && block.openInNewTab
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<p><a href="${href}"${externalAttributes}>${escapeHtml(block.text || block.url || "Link")}</a></p>`;
    }

    return `<p>${escapeHtml(block.text)}</p>`;
  }).join("");

export const blogBlocksPlainText = (blocks: BlogContentBlock[]) => {
  const html = renderBlogBlocksToHtml(blocks);
  if (typeof DOMParser === "undefined") return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return new DOMParser().parseFromString(html, "text/html").body.textContent?.replace(/\s+/g, " ").trim() ?? "";
};
import type { BlogContentBlock } from "@/lib/blogAdmin";
