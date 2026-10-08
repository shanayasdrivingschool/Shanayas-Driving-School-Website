const ALLOWED_TAGS = new Set([
  "a", "blockquote", "br", "caption", "code", "div", "em", "h2", "h3", "h4", "h5", "h6",
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
