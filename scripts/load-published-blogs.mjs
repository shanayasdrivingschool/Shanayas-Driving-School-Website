const asString = (value, fallback = "") => typeof value === "string" ? value : fallback;
const asStringArray = (value) => Array.isArray(value) ? value.map(String) : [];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const safeHref = (block) => {
  const url = asString(block.url).trim();
  if (block.linkKind === "internal") return url.startsWith("/") && !url.startsWith("//") ? url : "#";
  return /^https:\/\//i.test(url) ? url : "#";
};

const allowedTags = new Set([
  "a", "blockquote", "br", "caption", "code", "div", "em", "h1", "h2", "h3", "h4", "h5", "h6",
  "hr", "li", "ol", "p", "pre", "span", "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr", "ul",
]);
const allowedAttributes = {
  a: new Set(["href", "target", "rel"]),
  th: new Set(["scope", "colspan", "rowspan"]),
  td: new Set(["colspan", "rowspan"]),
};

export const sanitizePublishedHtml = (value) => {
  const dom = new JSDOM(`<div id="published-root">${asString(value)}</div>`);
  const root = dom.window.document.querySelector("#published-root");
  if (!root) return "";
  for (const element of [...root.querySelectorAll("*")]) {
    const tag = element.tagName.toLowerCase();
    if (!allowedTags.has(tag)) {
      element.replaceWith(...element.childNodes);
      continue;
    }
    const allowed = allowedAttributes[tag] ?? new Set();
    for (const attribute of [...element.attributes]) {
      if (!allowed.has(attribute.name.toLowerCase())) element.removeAttribute(attribute.name);
    }
    if (tag === "a") {
      const href = element.getAttribute("href") ?? "";
      if (!(href.startsWith("/") || href.startsWith("#") || /^(https?:|mailto:|tel:)/i.test(href))) {
        element.removeAttribute("href");
      }
      if (element.getAttribute("target") === "_blank") element.setAttribute("rel", "noopener noreferrer");
      else {
        element.removeAttribute("target");
        element.removeAttribute("rel");
      }
    }
  }
  return root.innerHTML;
};

export const blocksToHtml = (blocks) => blocks.map((block) => {
  if (!block || typeof block !== "object") return "";
  if (block.type === "rich_html" || (block.type === "paragraph" && asString(block.html).trim())) {
    return sanitizePublishedHtml(block.html);
  }
  if (block.type === "heading") {
    const level = Math.min(6, Math.max(1, Number(block.level) || 2));
    return `<h${level}>${escapeHtml(asString(block.text))}</h${level}>`;
  }
  if (block.type === "bulleted_list" || block.type === "numbered_list") {
    const tag = block.type === "bulleted_list" ? "ul" : "ol";
    const items = Array.isArray(block.items)
      ? block.items.filter((item) => asString(item).trim()).map((item) => `<li>${escapeHtml(item)}</li>`).join("")
      : "";
    return items ? `<${tag}>${items}</${tag}>` : "";
  }
  if (block.type === "quote") return `<blockquote>${escapeHtml(asString(block.text))}</blockquote>`;
  if (block.type === "callout") return `<aside>${escapeHtml(asString(block.text))}</aside>`;
  if (block.type === "link") {
    const external = block.linkKind === "external" && block.openInNewTab
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";
    return `<p><a href="${escapeHtml(safeHref(block))}"${external}>${escapeHtml(asString(block.text, asString(block.url, "Link")))}</a></p>`;
  }
  return `<p>${escapeHtml(asString(block.text))}</p>`;
}).join("");

const wordsToReadTime = (html) => {
  const words = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
};

const dateOnly = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const displayDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
};

export const loadPublishedBlogs = async (env = process.env) => {
  const url = env.VITE_SUPABASE_URL?.trim();
  const key = env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return [];

  const response = await fetch(`${url}/rest/v1/public_blog_posts?select=snapshot,published_at,updated_at&order=published_at.desc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(`Unable to load published CMS articles for the static build (${response.status}).`);
  }

  const rows = await response.json();
  return rows.flatMap((row) => {
    const snapshot = row.snapshot && typeof row.snapshot === "object" ? row.snapshot : {};
    const slug = asString(snapshot.slug);
    const title = asString(snapshot.title);
    if (!slug || !title) return [];
    const blocks = Array.isArray(snapshot.contentBlocks) ? snapshot.contentBlocks : [];
    const html = blocksToHtml(blocks);
    const publishedAt = asString(snapshot.datePublished, row.published_at);
    const modifiedAt = asString(snapshot.dateModified, row.updated_at);
    return [{
      slug,
      html,
      title,
      seoTitle: asString(snapshot.seoTitle) || undefined,
      canonicalPath: asString(snapshot.canonicalPath) || `/blog/${slug}/`,
      description: asString(snapshot.metaDescription, asString(snapshot.excerpt)),
      author: asString(snapshot.authorName, "Shanaya's Driving School"),
      authorName: asString(snapshot.authorName, "Shanaya's Driving School"),
      reviewerName: asString(snapshot.reviewerName) || undefined,
      date: displayDate(modifiedAt || publishedAt),
      datePublished: dateOnly(publishedAt),
      dateModified: dateOnly(modifiedAt || publishedAt),
      readTime: wordsToReadTime(html),
      category: asString(snapshot.category, "Driving resources"),
      faqs: Array.isArray(snapshot.faqs) ? snapshot.faqs : [],
      heroImage: asString(snapshot.coverImageUrl),
      relatedSlugs: asStringArray(snapshot.relatedSlugs),
      robots: asString(snapshot.robots, "index, follow"),
      schemaType: asString(snapshot.schemaType, "BlogPosting"),
      faqSchemaEnabled: snapshot.faqSchemaEnabled !== false,
      breadcrumbSchemaEnabled: snapshot.breadcrumbSchemaEnabled !== false,
      sourceOrigin: "cms_publication",
    }];
  });
};
import { JSDOM } from "jsdom";
