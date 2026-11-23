import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../docs/ai-search-blogs/content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'docs/ai-search-blogs');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const style = `*{box-sizing:border-box}body{margin:0;background:#f4f5f3;color:#1b2931;font:18px/1.7 system-ui,sans-serif}main{max-width:850px;margin:auto;padding:32px 24px 72px}h1,h2,h3{line-height:1.2;color:#102d3e}h1{font-size:clamp(2rem,5vw,3rem);margin:24px 0}h2{font-size:1.6rem;margin-top:2.2em}h3{font-size:1.15rem;margin-top:1.7em}p,li{max-width:75ch}a{color:#07577b;text-underline-offset:3px;overflow-wrap:anywhere}a:focus-visible{outline:3px solid #b45812;outline-offset:3px}.editorial{overflow-wrap:anywhere;background:#fff1db;border-left:4px solid #ad611a;padding:18px;margin:24px 0;font-size:15px}.editorial p{margin:.5em 0}.byline{color:#52616b;font-size:16px}.table-wrap{overflow-x:auto;border:1px solid #bbc8cf}table{border-collapse:collapse;width:100%;min-width:560px;font-size:16px;text-align:left}caption{padding:14px;text-align:left;font-weight:600}td,th{padding:14px;border:1px solid #c8d0d4;vertical-align:top}thead{background:#e5edf0}blockquote{margin:24px 0;padding:16px 22px;border-left:4px solid #49788d;background:#e8eff2}li{margin:.45em 0}.card{background:white;border:1px solid #d1d9dd;padding:22px;margin:20px 0}.card h2{margin:0 0 12px;font-size:1.3rem}small{display:block;color:#52616b}@media(max-width:500px){main{padding:20px 18px 48px}body{font-size:17px}.editorial{padding:14px}}`;
const shell = (title, description, content) => `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><style>${style}</style></head><body><main>${content}</main></body></html>`;
const previewLinks = (html) => html.replace(/href="(\/[^"#]*)"/g, (_, href) => {
  const draft = articles.find(a => href.replace(/\/$/, '') === `/blog/${a.slug}`);
  return `href="${draft ? `${draft.slug}.html` : `https://www.shanayasdrivingschool.com${href}`}"`;
});

await fs.mkdir(destination, { recursive: true });
const manifest = [];
for (const article of articles) {
  if (article.seoTitle.length >= 60 || article.description.length >= 155) {
    throw new Error(`Metadata length: ${article.slug} (${article.seoTitle.length}/${article.description.length})`);
  }
  const { body, rulesReplacement, faqReplacement, ...metadata } = article;
  const publicBody = body.trim();
  await fs.writeFile(path.join(destination, `${article.slug}.fragment.html`), `${publicBody}\n`);
  if (rulesReplacement) await fs.writeFile(path.join(destination, `${article.slug}.rules-replacement.html`), `${rulesReplacement}\n`);
  const notice = `<aside class="editorial" aria-label="Editorial review information"><strong>Review draft · November 23, 2026 · ${escape(article.kind)}</strong><p>Required review: ${escape(article.review)} No completed subject review or publication is claimed.</p><p>Proposed URL: /blog/${escape(article.slug)}/</p><p>SEO title: ${escape(article.seoTitle)}</p><p>Meta description: ${escape(article.description)}</p>${article.integration ? `<p><strong>Integration:</strong> ${escape(article.integration)}</p>` : ''}</aside>`;
  const replacement = rulesReplacement ? `<section aria-label="Replacement rules and FAQ"><h2>Replacement for the existing rules section</h2>${previewLinks(rulesReplacement)}<h2>Replacement for the existing supervision FAQ</h2><h3>${escape(faqReplacement.question)}</h3><p>${escape(faqReplacement.answer)}</p><hr><h2>Addition for the parent guide</h2></section>` : '';
  const html = shell(article.seoTitle, article.description, `<nav><a href="index.html">All seven draft items</a></nav>${notice}<article><h1>${escape(article.title)}</h1><p class="byline">By Shanaya’s Driving School · British Columbia, Canada</p>${replacement}${previewLinks(publicBody)}</article>`);
  await fs.writeFile(path.join(destination, `${article.slug}.html`), html);
  manifest.push({ ...metadata, proposedPath: `/blog/${article.slug}/`, author: "Shanaya's Driving School", draftedOn: '2026-11-23', datePublished: null, reviewedBy: null, pageQuality: 'Draft awaiting evidence/review', intentSatisfaction: 'Draft awaiting evidence/review', publicationState: 'draft only', bodyHtml: publicBody, ...(rulesReplacement ? { rulesReplacement, faqReplacement } : {}) });
}
await fs.writeFile(path.join(destination, 'draft-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
const cards = articles.map(a => `<section class="card"><small>PDF topic${a.topics.length > 1 ? 's' : ''} ${a.topics.join(', ')} · ${escape(a.kind)}</small><h2><a href="${a.slug}.html">${escape(a.title)}</a></h2><p>${escape(a.description)}</p><small>Required review: ${escape(a.review)}</small></section>`).join('');
await fs.writeFile(path.join(destination, 'index.html'), shell('Student safety blog review pack', 'Five new blog drafts and additions to two existing guides, based on the supplied AI search content plan.', `<h1>Student safety blog review pack</h1><p>Five new articles and two existing-guide updates cover all twelve proposed questions. Prepared for Shanaya’s Driving School, British Columbia, Canada.</p><aside class="editorial"><strong>Draft only · November 23, 2026</strong><p>The articles require the reviews listed below. Nothing in this pack has been added to the public blog or sitemap. Review notes are separate from the clean article fragments.</p><p>Established safety and illness policy URLs are retained. No new complaint policy, free-trial offer, reviewer credential or publication date is asserted.</p></aside>${cards}`));
console.log(`Exported ${articles.length} review items to docs/ai-search-blogs/`);
