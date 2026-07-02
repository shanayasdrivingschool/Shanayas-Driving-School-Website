# GEO / AI Search Readiness Audit — drivingschoolbc.ca

**Site:** Shanaya's Driving School (ICBC-aligned driving school, Langford/Victoria/Greater Victoria, BC)
**Audited URL:** https://www.drivingschoolbc.ca/
**Method:** Live fetch of robots.txt, llms.txt, sitemap.xml; raw-mode (`--mode never`, pre-JS) and rendered-mode (`--mode always`, post-JS) fetches via `render_page.py` for the homepage and 5 interior pages (`/driving-lessons/`, `/pricing/`, `/faq/`, `/road-test-prep/`, `/contact/`); trafilatura extraction on both raw and rendered HTML.

---

## GEO Health Score: 40 / 100 (Needs Significant Work)

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Citability | 25% | 35/100 | 8.75 |
| Structural Readability | 20% | 45/100 | 9.0 |
| Multi-Modal Content | 15% | 30/100 | 4.5 |
| Authority & Brand Signals | 20% | 50/100 | 10.0 |
| Technical Accessibility | 20% | 40/100 | 8.0 |
| **Total** | | | **40.25 ≈ 40/100** |

**Headline:** The crawler-permission and llms.txt layer is genuinely best-in-class — better than the large majority of sites audited. But the site is a client-rendered React SPA, and the raw HTML that non-JS-executing AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot) actually receive is a ~205-word, CSS-hidden `#seo-fallback` stub that is ~80% smaller than the real page and, worse, is near-duplicate boilerplate across every URL on the site. That single architectural issue caps the overall score regardless of how good the crawler-access and llms.txt layers are.

---

## 1. AI Crawler Access (robots.txt) — EXCELLENT

Live fetch of `https://www.drivingschoolbc.ca/robots.txt` (200 OK) confirms explicit `Allow: /` blocks for every major AI crawler, plus classic search bots:

```
Googlebot, Bingbot, GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot,
ClaudeBot, Claude-SearchBot, anthropic-ai, Applebot, Google-Extended,
CCBot, Twitterbot, facebookexternalhit, User-agent: * → Allow: /
```

| Crawler | Status |
|---|---|
| GPTBot | Allowed |
| ChatGPT-User | Allowed |
| OAI-SearchBot | Allowed |
| PerplexityBot | Allowed |
| ClaudeBot | Allowed |
| Claude-SearchBot | Allowed |
| anthropic-ai | Allowed |
| Google-Extended | Allowed |
| CCBot | Allowed |
| Applebot | Allowed |

No crawler is blocked, no `Disallow` rules restrict any AI agent (not even the training-only bots like CCBot/anthropic-ai, which many sites choose to block — this site permits them, maximizing surface area). This is a strength; nothing to fix here.

---

## 2. llms.txt — PRESENT, WELL-STRUCTURED (best-in-class for an SMB site)

- Correctly discoverable: homepage `<head>` includes `<link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />` on every page tested.
- Live fetch of `https://www.drivingschoolbc.ca/llms.txt` returns 200 OK, 1245 bytes, and is byte-identical to the local source at `public/llms.txt` / `public_html/llms.txt` — deployment is in sync.
- Content quality: includes Business block (name, website, email, phone, address, service areas), a Key Pages list with one-line descriptions for 12 URLs, a Services list (11 items), a "Summary For AI Assistants" paragraph written as a self-contained, citable answer block, and Crawl Notes linking sitemap.xml and robots.txt.

**Gaps:**
- Does not cover pages that exist in the site nav/footer but not in llms.txt or sitemap.xml (e.g. "Driver's Licence Guide," "Knowledge Test Practice," "Blog," "Careers," "Ruley Rewards" seen in the rendered footer).
- Contains no pricing figures and no FAQ content — meaning the one file explicitly designed for LLM consumption also inherits the site's biggest content gap (see §4).

---

## 3. Content Available to Non-Rendering AI Crawlers — CRITICAL GAP (quantified)

The site is a Vite/React SPA. Every route's raw HTML document is nearly identical: a `<head>` with unique meta/OG/Twitter tags and JSON-LD, plus a `<body>` containing `<div id="root"><main id="seo-fallback">...</main></div>`. The real UI is injected client-side by a single ~850 KB JS entry chunk (`/assets/index-qsDPKRHF.js`). Text-only crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot, OAI-SearchBot) do not execute JavaScript, so `#root` never gets replaced for them — they see only `#seo-fallback`.

Important nuance confirmed by testing: the inline `<style>#seo-fallback{display:none}</style>` only hides the stub visually for a JS-executing browser; it does **not** strip the text from the HTTP response. A raw-HTML crawler still receives the stub's text (this is not a hard content block) — but the stub is severely thin and duplicated.

**Measured (trafilatura-extracted word counts, raw vs. rendered):**

| Page | Raw (`--mode never`) words | Rendered (`--mode always`) words | Raw as % of real content |
|---|---|---|---|
| Home `/` | 204 | 1,213 | 17% |
| `/driving-lessons/` | 205 | not sampled | — |
| `/pricing/` | 208 | 130* | 100%+ (see §4 — real page is *also* thin) |
| `/faq/` | 206 | not sampled | — |
| `/road-test-prep/` | 205 | not sampled | — |
| `/contact/` | 204 | not sampled | — |

\*The pricing page is the one page where raw ≥ rendered word count — because the real rendered pricing page itself contains very little citable prose (see §4).

**The bigger problem: the stub is near-duplicate across pages.** Of the ~204-208 words in each raw stub, ~170 words (5 of 6 `<section>` blocks: "ICBC-Aligned Driving Lessons in Victoria and Langford," "Road Test Prep, Defensive Driving, and Knowledge Test Support," "Driving School Services," "Service Areas Across Greater Victoria," "Why Students Choose Shanaya's Driving School," "How Lessons Work") are **byte-for-byte identical** across Home, Driving Lessons, Pricing, FAQ, Road Test Prep, and Contact. Only the `<h1>` and first `<p>` (~15-30 words, sourced from the page's title/meta description) differ per page. For a non-JS AI crawler, `/pricing/`, `/contact/`, and `/road-test-prep/` are — apart from one sentence — the same document. This is a duplicate/thin-content pattern that suppresses per-page citability: there is no page-specific, extractable fact for an LLM to quote about pricing, the contact process, or road-test specifics beyond the shared generic boilerplate.

**What non-JS crawlers miss entirely:** the fully rendered homepage carries 1,213 words of unique extracted content (ICBC-aligned training standards detail, the 4-step "Plan," testimonials/trust copy, service-area specifics, footer resource links to Driver's Licence Guide / Knowledge Test Practice / Blog). None of that reaches GPTBot, ClaudeBot, PerplexityBot, or CCBot today.

**One mitigating factor:** JSON-LD (`LocalBusiness`/`DrivingSchool` schema, and `FAQPage` schema on `/pricing/`, `/faq/`, `/road-test-prep/`) is embedded directly in the raw `<head>` and is **not** JS-gated — any crawler that parses `<script type="application/ld+json">` (most major AI crawlers do) gets structured NAP data and a handful of Q&A pairs even without rendering.

---

## 4. Passage-Level Citability

- **No page-specific prose survives to non-JS crawlers** beyond the H1/meta sentence — see §3.
- **Pricing page has zero extractable price figures, even fully rendered.** Searching the complete post-JS DOM of `/pricing/` for dollar amounts (`\$\s?\d`) returned **0 matches**. The real page text says "Lesson prices can vary by package, duration, service area, and training type. Students should confirm current rates" and "Ask about pricing" instead of stating numbers. This means no AI engine (Google AI Overviews, ChatGPT, Perplexity, Copilot) can ever cite a specific price for this school — a page that should be the top citation target for "how much are driving lessons in Victoria BC" is structurally unable to produce a citable statistic, independent of the SPA/rendering issue. Rendered `/pricing/` extracted text is only 130 words total.
- **FAQ answers live only in JSON-LD, not in visible/extractable prose reachable without JS.** The `FAQPage` schema has 4 Q&As on `/faq/`, 2 on `/pricing/`, 2 on `/road-test-prep/` — reasonable for schema-reading engines, but thin, and structurally invisible to any citation pipeline that extracts from body text (e.g. trafilatura-style extraction, which is representative of how many RAG/AI-search systems ingest pages) rather than parsing embedded JSON-LD.
- **Passage length:** the shared stub sections run 25-45 words each — shorter than the 134-167 word optimal-citation range — and none are self-contained enough to answer a specific query (they're generic marketing summaries, not direct answers to "how many lessons do I need," "what's included in road test prep," etc.).
- **No question-based H2/H3s in the raw HTML.** Headings in the stub ("Driving School Services," "How Lessons Work") are declarative, not question-formatted, reducing match quality against natural-language AI queries.

---

## 5. Brand / Entity Clarity

**Strong:**
- `LocalBusiness` + `DrivingSchool` JSON-LD is present, in raw HTML, on every page tested: name, url, logo, image, description, `telephone: +1-250-542-3673`, `email: book@drivingschoolbc.ca`, `priceRange: $$`, full `PostalAddress` (Unit 124, 2770 Leigh Rd, Langford, BC V9B 4G1, Canada), `areaServed` (8 communities: Victoria, Langford, Colwood, Sidney, Metchosin, Sooke, Duncan, Salt Spring Island).
- NAP is consistent between the JSON-LD schema and llms.txt — no conflicting address/phone/email found.
- Rendered homepage's `makesOffer` schema array lists named services (Driving lessons, ICBC road test preparation, Defensive driving course) with `areaServed`, adding entity-service linkage.

**Weak:**
- `sameAs` only lists Facebook and Instagram. No Google Business Profile URL, no YouTube, no LinkedIn, no Yelp — despite the business already appearing independently on Yelp (confirmed via search: "Shanaya's Driving School Victoria," ranked in Yelp's "Top 10 Best Driving Schools in Langford, BC," marked "New on Yelp"). That listing is unclaimed/uncross-linked from the site.
- No YouTube presence found. Per documented brand-mention/AI-citation correlation, YouTube mentions are the strongest single signal (~0.737 correlation) — its total absence is a meaningful gap for a local-service business where a short "what a lesson looks like" or student-testimonial video is a low-effort, high-signal asset.
- No Reddit footprint identified in a general web search for the brand name — Reddit presence is documented as a high-correlation signal for AI citation and currently unaddressed.
- No named instructor/author bios found in the raw or rendered content sampled — `meta name="author"` is set to the business name, not a real person, which is appropriate for LocalBusiness schema but does nothing for E-E-A-T "experience" signals (e.g., "20 years teaching new drivers in Greater Victoria").

---

## 6. Other Technical Findings

- **`og:image` inconsistency / hotlink risk:** `/road-test-prep/`'s Open Graph and Twitter image points to `https://www.easydriversed.com/wp-content/uploads/2025/01/the-road-test-process.jpg` — an external, third-party domain that appears to belong to a different driving school. This is a brand-trust and reliability risk (the image can disappear or change without notice, and social/AI-preview cards may show a competitor's asset). `/pricing/` and `/faq/` use generic Unsplash stock photos rather than owned imagery; `/`, `/contact/` use the brand's own social image. Recommend standardizing on owned, page-relevant imagery across all routes.
- **No RSL 1.0 licensing file.** Requesting `/rsl.xml` returns HTTP 200 with the SPA's generic fallback HTML (the catch-all route), not a real RSL document or a 404. This indicates the server has no genuine "not found" handling for arbitrary unmatched paths either — a soft-200 pattern that can confuse crawlers about URL/content validity generally, beyond the specific RSL question.
- **Sitemap.xml is valid and current:** `application/xml`, includes `lastmod` (2026-05-24 across sampled entries), `changefreq`, and `priority` — a good freshness signal, and its URL list is consistent with llms.txt's Key Pages section.
- **JS payload:** the real content is gated behind a single ~850 KB JS entry chunk. This is primarily a Core Web Vitals/performance concern, but it is also the direct cause of the content gap in §3 — every non-JS crawler pays the full cost of "page has almost no content" because none of that 850 KB is ever executed on their behalf.

---

## 7. Platform-Specific Notes

No live DataForSEO or platform-visibility tooling was available in this environment, so the following are inferred from documented crawler behavior, not live-tested outputs:

- **Google AI Overviews:** Likely the least affected by the SPA gap — Googlebot uses an evergreen rendering service and generally indexes post-JS content, so Google's view of the site is probably close to the "real" 1,200+ word homepage rather than the 204-word stub. Robots.txt explicitly allows `Google-Extended`. Estimated relative readiness: moderate (~55-65/100), constrained mainly by thin/duplicate per-page prose and the missing pricing data once Google *does* see the content.
- **ChatGPT (GPTBot / OAI-SearchBot / ChatGPT-User):** These agents are documented as non-JS-rendering. They receive the ~205-word duplicate stub plus llms.txt. llms.txt gives ChatGPT a solid, self-contained business summary to draw from, but page-level citations (e.g., "According to drivingschoolbc.ca's pricing page...") have almost nothing unique to quote. Estimated: low (~30-35/100).
- **Perplexity (PerplexityBot):** Same non-JS constraint as GPTBot. llms.txt is a partial offset. Estimated: low (~30-35/100).
- **Bing Copilot (Bingbot-based):** Bingbot has historically rendered JS for a meaningful share of crawled pages (though less consistently than Google), so Copilot's view may sit between the ChatGPT/Perplexity case and the Google AIO case. Estimated: moderate-low (~45-50/100).

---

## Findings Table (severity-ranked)

| # | Title | Severity | Evidence | Fix |
|---|---|---|---|---|
| 1 | Raw HTML delivers ~80% less content than the real page to non-JS AI crawlers | Critical | Homepage: 204 raw words vs. 1,213 rendered words (trafilatura) | Prerender/SSG all routes (Vite SSG plugin, prerender.io, or static export) so full content ships in the initial HTML response, not just a stub |
| 2 | `#seo-fallback` stub is near-duplicate boilerplate across every page | Critical | 5 of 6 stub sections are byte-identical across Home, Driving Lessons, Pricing, FAQ, Road Test Prep, Contact | Rewrite each page's fallback to contain unique, page-specific facts (150-300 words) instead of shared marketing copy |
| 3 | Pricing page has zero extractable price figures, even fully rendered | High | Regex scan of full rendered DOM for `$\d` returned 0 matches; page text says "confirm current rates" | Publish at least starting/typical price points (e.g., "$XX/hour," "$XXX 8-lesson package") in visible prose |
| 4 | FAQ answers exist only in JSON-LD, not in citable body prose reachable without JS | High | `/faq/` JSON-LD has 4 Q&As; none appear as `<p>` text in the raw stub | Add a visible Q&A block (plain HTML, not JS-only) mirroring the FAQPage schema |
| 5 | `og:image` for `/road-test-prep/` hotlinks a third-party competitor domain | Medium | `og:image` = `easydriversed.com/wp-content/...` | Replace with owned, brand-consistent imagery |
| 6 | Thin external brand/entity signals (`sameAs`, YouTube, Reddit, GBP) | Medium | `sameAs` = Facebook + Instagram only; unclaimed Yelp listing found via search; no YouTube/Reddit footprint | Add Google Business Profile + Yelp to `sameAs`; publish at least one YouTube video (lesson walkthrough/testimonial) |
| 7 | No RSL 1.0 licensing; `/rsl.xml` returns a soft-200 SPA fallback | Low | `GET /rsl.xml` → 200, identical fallback markup to other pages | Add a real RSL file or return proper 404s for unmatched paths; add RSL if AI-licensing control is desired |
| 8 | robots.txt explicitly allows all major AI crawlers | Strength | Live fetch confirms `Allow: /` for GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Claude-SearchBot, anthropic-ai, Google-Extended, CCBot, Applebot | Maintain as-is |
| 9 | llms.txt present, accurate, well-structured, correctly linked | Strength | Live 200 fetch matches local source; includes NAP, key pages, services, AI-summary paragraph, crawl notes | Expand to cover pricing ranges, more FAQ content, and pages missing from the list (Blog, Careers, Driver's Licence Guide, Knowledge Test Practice) |
| 10 | Page-specific meta/canonical/hreflang/JSON-LD present in raw HTML (not JS-gated) | Strength | Confirmed unique `<title>`, `<meta description>`, canonical, OG/Twitter tags, and LocalBusiness/FAQPage JSON-LD in raw fetch for every page sampled | Maintain; extend FAQPage schema coverage to more pages |

---

## Quick Wins (ranked by impact/effort)

1. **Fix the `/road-test-prep/` hotlinked `og:image`** — Effort: trivial (~5 min). Swap to an owned image.
2. **Add 2-4 real FAQ Q&A pairs as visible prose** (not just JSON-LD) on `/faq/`, `/pricing/`, `/road-test-prep/` — Effort: low (content edit).
3. **Publish explicit price figures** on `/pricing/` (even as ranges/"starting at") — Effort: low-medium (business decision + copy, no dev work).
4. **Add Google Business Profile and Yelp URLs to `sameAs`** in the LocalBusiness schema and llms.txt — Effort: low.
5. **De-duplicate the `#seo-fallback` stub** — give each page 150-300 words of unique, page-specific prose instead of the shared 5-section boilerplate — Effort: medium (content + minor code change), high impact on §3/§4.
6. **Publish one YouTube video** (lesson walkthrough or student testimonial) and link it in `sameAs` / llms.txt — Effort: medium, addresses the strongest documented AI-citation correlation signal.
7. **Prerender/SSG the site** so every route ships full content in raw HTML — Effort: high, but this is the single highest-leverage fix and would likely move the overall score from ~40 into the 70s+ given how strong robots.txt and llms.txt already are.

---

## Structured Findings (JSON) — for audit-data.json / AI Search Readiness category

```json
{
  "category": "ai_search_readiness",
  "geo_score": 40,
  "dimension_scores": {
    "citability": 35,
    "structural_readability": 45,
    "multi_modal_content": 30,
    "authority_brand_signals": 50,
    "technical_accessibility": 40
  },
  "ai_crawler_access": {
    "GPTBot": "allowed",
    "ChatGPT-User": "allowed",
    "OAI-SearchBot": "allowed",
    "PerplexityBot": "allowed",
    "ClaudeBot": "allowed",
    "Claude-SearchBot": "allowed",
    "anthropic-ai": "allowed",
    "Google-Extended": "allowed",
    "CCBot": "allowed",
    "Applebot": "allowed"
  },
  "llms_txt": {
    "status": "present",
    "url": "https://www.drivingschoolbc.ca/llms.txt",
    "http_status": 200,
    "linked_in_head": true,
    "quality": "high",
    "gaps": ["no pricing figures", "no FAQ content", "missing some footer pages (Blog, Careers, Driver's Licence Guide, Knowledge Test Practice)"]
  },
  "findings": [
    {"title": "Raw HTML delivers ~80% less content than rendered page to non-JS AI crawlers", "severity": "critical", "evidence": "home raw=204 words vs rendered=1213 words", "fix": "Prerender/SSG all routes"},
    {"title": "#seo-fallback stub is near-duplicate boilerplate across every page", "severity": "critical", "evidence": "5 of 6 stub sections byte-identical across 6 pages tested", "fix": "Unique page-specific fallback prose"},
    {"title": "Pricing page has zero extractable price figures even when fully rendered", "severity": "high", "evidence": "0 dollar-amount regex matches in rendered DOM", "fix": "Publish explicit price ranges"},
    {"title": "FAQ answers exist only in JSON-LD, not citable prose reachable without JS", "severity": "high", "evidence": "FAQPage schema present but no matching <p> text in raw stub", "fix": "Add visible Q&A HTML block"},
    {"title": "og:image for /road-test-prep/ hotlinks third-party competitor domain", "severity": "medium", "evidence": "og:image=easydriversed.com/wp-content/...", "fix": "Use owned imagery"},
    {"title": "Thin external brand/entity signals", "severity": "medium", "evidence": "sameAs=Facebook+Instagram only; unclaimed Yelp listing; no YouTube/Reddit", "fix": "Add GBP/Yelp to sameAs; publish YouTube content"},
    {"title": "No RSL 1.0 licensing; /rsl.xml returns soft-200 SPA fallback", "severity": "low", "evidence": "GET /rsl.xml -> 200 identical fallback markup", "fix": "Add real RSL file or proper 404 handling"},
    {"title": "robots.txt explicitly allows all major AI crawlers", "severity": "strength", "evidence": "Allow: / for GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.", "fix": "Maintain"},
    {"title": "llms.txt present, accurate, well-structured", "severity": "strength", "evidence": "Live 200 fetch matches local source; NAP + key pages + AI summary present", "fix": "Expand coverage"},
    {"title": "Page-specific meta/canonical/JSON-LD present in raw (non-JS-gated) HTML", "severity": "strength", "evidence": "Unique title/description/canonical/OG + LocalBusiness+FAQPage JSON-LD confirmed in raw fetch", "fix": "Maintain; extend FAQPage schema to more pages"}
  ],
  "platform_estimates": {
    "google_ai_overviews": 60,
    "chatgpt_search": 32,
    "perplexity": 32,
    "bing_copilot": 47,
    "note": "Inferred from documented crawler JS-rendering behavior; no live DataForSEO/platform visibility tooling was available in this environment"
  }
}
```
