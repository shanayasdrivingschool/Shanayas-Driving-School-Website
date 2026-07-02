# Content Quality & E-E-A-T Audit — drivingschoolbc.ca (Shanaya's Driving School)

Methodology: `render_page.py --mode auto` was attempted first; Playwright is not installed in this
environment (`--mode always` returned `error: playwright is required for rendered mode`), so the
"rendered" view of every URL falls back to `raw`, which only captures the static `#seo-fallback`
stub. Per the task's architecture note, real content depth was therefore evaluated from (a) the
deployed static stub HTML in `public_html/**/index.html` (what non-JS crawlers/AI bots actually
receive today) and (b) the React source of record in `src/pages/` and `src/data/` (what a
JS-executing crawler such as Googlebot would eventually see after render). Both are cited below.

---

## Category Score: 52/100

The site has real strengths (clean entity definition, ICBC-aligned messaging, consistent NAP-ish
contact block, FAQ schema, llms.txt) but is held back by: (1) a byte-for-byte **identical
~220-234 word fallback stub on every single indexed URL**, (2) heavily templated/duplicated body
copy across the 6 SEO landing pages and the 14 course pages, (3) blog posts with no named author,
no bio, and no machine-readable date/author schema, (4) unverifiable, non-third-party
testimonials, and (5) an unresolved NAP address conflict between the schema/contact page and the
embedded Google Map.

---

## 1. E-E-A-T Breakdown

| Factor | Weight | Score /100 | Notes |
|---|---|---|---|
| Experience | 20% | 30 | No first-hand instructor voice, no photos/video of actual lessons, cars, or staff (all imagery is stock/Unsplash/third-party). Blog reads as generic advice, not "we taught this student X" case studies. |
| Expertise | 25% | 35 | No named, credentialed instructors anywhere on the live site. "ICBC-aligned," "licensed instructors" is asserted repeatedly but never evidenced (no ICBC school registration/licence number, no instructor certification names). Blog byline is the brand name, not a person. |
| Authoritativeness | 25% | 40 | No external citations, no press mentions, no linked Google Business Profile/review count, no partnerships beyond generic "ICBC-aligned" phrasing. `sameAs` in schema links only to Facebook/Instagram (no Google Business Profile, no BBB, no ICBC directory listing). |
| Trustworthiness | 30% | 55 | Phone, email, physical address, contact form, and policy pages (privacy, installment, terms, referral) all exist — a real trust positive. But: (a) address conflicts between LocalBusiness schema/contact page ("Langford, BC V9B 4G1") and the Google Maps embed pulling a place labeled "Victoria, BC V9B 4G2" (`src/pages/Contact.tsx:139,328`, `src/pages/Index.tsx:725`); (b) testimonials are first-name+initial only, all 5-star, not linked to a verifiable third-party platform, and include a "Nanaimo" reviewer even though Nanaimo is not one of the eight listed service areas (`src/components/TestimonialsSection.tsx:10-59`); (c) no visible business hours anywhere (confirmed absent in `COMPANY_KNOWLEDGE.md` §10 and in the codebase). |

**Weighted E-E-A-T score: ≈ 40/100**

### Supporting evidence
- `src/components/TeamSection.tsx` still contains an unmodified web-agency template roster —
  "Ahmed Khan – CEO & Founder," "Sara Ali – Creative Director," "Bilal Ahmed – Lead Developer,"
  "Fatima Noor – Marketing Head." This is dead code (grep confirms it is never imported by
  `App.tsx` or any page), so it is **not currently live**, but it is direct evidence the About
  page's team content was never populated with real driving-school staff — the repo simply has no
  page anywhere with real instructor names, photos, or credentials. `src/pages/About.tsx`
  itself has no team roster at all, just generic "values" copy ("Calm Learning Environment,"
  "Skills that last lifetime") and two stock photos captioned "Team workshop" / "Team
  collaboration."
- `COMPANY_KNOWLEDGE.md` §10 independently flags: no business hours found, no founder/ownership
  details found, and an address conflict between the Langford postal address used in copy/schema
  and the Victoria address baked into the Google Maps embed pb= string.
- Safety/standards claims ("Licensed Instructors," "ICBC-Aligned Training Standards," "Insured and
  Licensed") appear as a scrolling marquee of bare label text with no supporting detail, license
  numbers, or links (`src/components/SafetyStandardsSection.tsx:4-14`).

---

## 2. Thin Content / Word Count Findings

### 2a. Static fallback stub — identical on every page (crawler-visible content)

Every URL in `public_html/**/index.html` ships the same `<main id="seo-fallback">` block: one H1,
one intro `<p>`, then **six generic `<h2>` sections that are word-for-word identical across pages**
("ICBC-Aligned Driving Lessons in Victoria and Langford," "Road Test Prep, Defensive Driving, and
Knowledge Test Support," "Driving School Services," "Service Areas Across Greater Victoria," "Why
Students Choose Shanaya's Driving School," "How Lessons Work"), followed by the same two `<nav>`
link blocks. Only the H1 and the one-sentence intro paragraph change per page.

Measured word counts (stub body only):
| Page | Word count |
|---|---|
| `/driving-lessons/` | ~217 |
| `/blog/pass-road-test/` | ~217 (body text is byte-identical to `/driving-lessons/` except H1/intro) |
| `/about/` | 223 |
| `/pricing/` | 231 |
| `/faq/` | 229 |
| `/courses/beginner-driving-course/` | 226 |

This is duplicate boilerplate at scale — for a non-JS crawler (or an AI crawler that does not
execute JS), **every single page on the site — homepage, service pages, blog posts, course
pages, policy pages — reads as the same ~220-word article with a different headline**, i.e.
functionally 0 unique words of body copy per page and severe near-duplicate content across
30+ URLs. `<meta name="robots" content="index, follow">` is present, so Google is explicitly
told to index this thin/duplicate version if it does not render JS in time, or if a render is
skipped/deferred.

### 2b. React-rendered content (what appears after JS executes)

Word counts estimated from `src/data/seoLandingPages.ts` and `src/data/blogPosts.tsx` (intro +
sections + FAQs, excluding nav/chrome):

| Page | Page type | Est. word count | Minimum | Status |
|---|---|---|---|---|
| `/` (Index) | Homepage | ~650-750 (mostly short marketing bullets/labels, not prose) | 500 | Meets floor, but low prose density |
| `/driving-lessons/` | Service page | ~480 | 800 | **Below floor** |
| `/defensive-driving/` | Service page | ~470 | 800 | **Below floor** |
| `/road-test-prep/` | Service page | ~460 | 800 | **Below floor** |
| `/road-test-vehicle/` | Service page | ~470 | 800 | **Below floor** |
| `/intensive-driving-course/` | Service page | ~470 | 800 | **Below floor** |
| `/pricing/` | Service/pricing page | ~430 (prose) + pricing tables | 800 | Prose alone below floor; tables add some coverage |
| `/faq/` | FAQ page | ~420 | — | Thin for a page positioned to answer "common BC driving lesson... questions" |
| `/about/` | About page | ~230 | 500 | **Below floor** — no team bios, no history, no credentials |
| `/blog/pass-road-test/` | Blog post | ~330 | 1,500 | **Well below floor** |
| `/blog/defensive-driving/` | Blog post | ~230 | 1,500 | **Well below floor** |
| `/blog/newcomers-guide-bc/` | Blog post | ~300 | 1,500 | **Well below floor** |
| `/courses/beginner-driving-course/` (and 13 sibling course pages) | Product/course page | ~250-320 (description + highlights + 3 generic "outcomes" sentences + module outline) | 300-400 | Borderline; several likely under 300 once boilerplate outcome sentences are discounted |

Even the *best-case* rendered version of the site (ignoring the identical-stub problem entirely)
under-shoots Google's topical-coverage floors on every service page, the About page, and all
three blog posts. The word-count minimums are explicitly "floors, not targets" per the QRG, but
these pages aren't just under a soft target — they're missing entire categories of expected
content (pricing specifics, instructor bios, real student outcomes, locally-specific detail)
that would organically produce more length.

**Blog posts in particular are the largest gap**: 1,500-word floor vs. ~230-330 actual words. All
three posts are single-topic listicles (5 numbered tips, 4 bullet habits, 4-step guide) with no
depth — no BC-specific statistics, no ICBC policy citations, no instructor commentary, no local
route examples, no images beyond the hero, no internal data.

---

## 3. Duplicate / Boilerplate Content Across Templates

- **SEO landing pages** (`src/data/seoLandingPages.ts`): all 7 entries (driving-lessons,
  defensive-driving, road-test-prep, road-test-vehicle, intensive-driving-course, pricing, faq)
  follow an **identical structural template**: 3-paragraph intro → 3 sections (title/body/optional
  bullets) → 2-4 FAQ pairs. The sentence patterns repeat near-verbatim across pages, e.g. every
  intro's 3rd paragraph restates "the goal isn't just to pass the test, it's to build lasting
  skills/confidence" and every "Local ... areas" section lists the same 8 towns in the same
  order. This is templated content masquerading as distinct pages — a hallmark AI-content pattern
  the Sept 2025 QRG flags ("repetitive structure across pages," "no original insight").
- **Course pages** (`src/pages/CourseProductPage.tsx` + `src/data/courseCatalog.ts` +
  `src/data/courseModules.ts`): all 14 course pages share one component and one "outcomes" string
  template — `outcomes` is programmatically generated from `course.highlights[0]` and
  `course.title` (CourseProductPage.tsx:160-164), producing sentences like "Build stronger [first
  highlight, lowercased] with guided repetition and instructor feedback" for every course. This is
  boilerplate text-templating, not unique written content — flag for `seo-programmatic` review as
  well, since this is a programmatically generated page pattern.
- **Static fallback stub**: as documented in §2a, this is the most severe duplication — identical
  body copy on every URL regardless of page type (service page, blog post, course page, policy
  page all get the same six generic `<h2>` blocks).

---

## 4. Freshness Signals

- Blog posts do carry publish dates in the React data layer (`src/data/blogPosts.tsx`): "March 1,
  2026," "February 20, 2026," "February 10, 2026" — all rendered as plain text next to a
  `<Calendar>` icon in `BlogPost.tsx:60-63`. **None of these dates are exposed as machine-readable
  markup** — no `<time datetime>` element, no `datePublished`/`dateModified`, and no
  `BlogPosting`/`Article` JSON-LD anywhere in the codebase (confirmed via grep of
  `SeoManager.tsx`, which only emits `LocalBusiness`/`DrivingSchool` and `FAQPage` schema). The
  static `#seo-fallback` stub for blog posts contains **no date or author at all** — a non-JS
  crawler or AI system reading only the stub cannot determine post age or authorship.
- No "last updated" indicator anywhere, on any page type (service pages, FAQ, policies).
- Author field for every blog post is the brand name ("Shanaya's Driving School"), not a person —
  eliminates any individual authorship/expertise signal and makes E-E-A-T "Experience" credit
  impossible to award to a specific instructor.
- Privacy Policy has an explicit effective date (March 16, 2026 per `COMPANY_KNOWLEDGE.md` §7),
  which is a positive freshness signal, but it isn't mirrored anywhere else (no sitewide "content
  reviewed" dates on service/course pages).

---

## 5. AI Citation Readiness

**Score: 45/100**

What works:
- A `llms.txt` file exists at `public_html/llms.txt` — proactive AI-crawler signal.
- `LocalBusiness`/`DrivingSchool` JSON-LD is present sitewide with a clear entity definition
  (name, address, phone, email, areaServed, sameAs) — this is a strong, quotable entity anchor.
- `FAQPage` JSON-LD is present on the FAQ and SEO landing pages with plainly-stated Q&A pairs
  ("Do beginners need any experience before booking? No. Beginner lessons can start with basic
  vehicle control...") — genuinely well-formed for AI extraction.
- Canonical tags, hreflang, OG/Twitter tags are consistently implemented per the stub HTML
  reviewed.

What's missing/weak:
- No `BlogPosting`/`Article` schema → AI systems cannot reliably cite blog post authorship or
  publish date.
- No `Review`/`AggregateRating` schema despite a testimonials carousel existing in the codebase —
  a missed opportunity, and arguably appropriate to omit given the reviews aren't independently
  verifiable (fabricating `AggregateRating` on top of unverified quotes would be worse).
- No `Person` schema for instructors (because there are no named instructors to mark up).
- The single most consequential AI-citation issue: **the crawlable HTML (for any bot that doesn't
  execute JS, and as a fallback/interim state for any bot that does) is the same ~220-word
  generic block on every URL.** An LLM or AI Overview system crawling without JS execution would
  extract the *same* six facts sections regardless of whether it fetched the homepage, the pricing
  page, or a blog post — actively harmful for citation accuracy (e.g., asking "what does the
  newcomers guide blog post say?" would return "Service Areas Across Greater Victoria" boilerplate
  instead of the actual GLP/ICBC-office guidance in the React content).
- Pricing is a strong quotable-fact category (fixed dollar figures per `COMPANY_KNOWLEDGE.md` §6)
  but those figures live only in `src/data/coursePricing.ts`/`packageCatalog.ts`, rendered
  client-side — they never appear in the static stub, meta description, or any schema
  (`Offer`/`Product` schema is referenced for the homepage only, per `SeoManager.tsx:175-193`, not
  per individual course/package page).

---

## 6. Readability

Rendered prose (SEO landing pages, blog posts) is generally clean, plain-English, short-sentence
marketing copy — no jargon stacking, reasonable sentence length, consistent use of active voice.
Estimated Flesch Reading Ease in the "fairly easy" band (roughly 60-70), appropriate for a
consumer driving-school audience. This is a genuine strength; the writing quality per-sentence is
fine — the problems are volume, uniqueness, and machine-readability, not clarity.

---

## 7. AI-Generated Content Quality Flags (Sept 2025 QRG)

Several markers of low-effort/templated AI content are present:
- **Repetitive structure across pages** — confirmed in §3 (identical section skeleton across all
  7 SEO landing pages; identical outcomes-sentence template across all 14 course pages).
- **Generic phrasing, lack of specificity** — e.g. "Training that builds confidence and real
  driving skills," "A Standard for Safe, Confident Driving," repeated near-synonymous "confidence"
  language throughout Index.tsx, About.tsx, and every landing page intro, without concrete
  specifics (no student count, no pass-rate statistic, no years-in-business, no instructor count).
- **No first-hand experience signals** — no lesson photos of actual instructors/vehicles/students,
  no route-specific detail beyond naming towns, no "we've noticed ICBC examiners on the X route
  tend to..." type of local insider knowledge that would be very achievable for a real driving
  school and very hard for generic AI content to fake.
- **Not flagged**: no factual inaccuracies were identified in the driving/ICBC guidance itself
  (BC GLP references, school zone speeds, following-distance guidance in the blog posts are
  accurate to general BC road-safety guidance).

---

## Findings Table

| Title | Severity | Evidence | Fix |
|---|---|---|---|
| Static fallback stub is near-identical on every URL (~220 words, same 6 section headings) | Critical | `public_html/driving-lessons/index.html` vs `public_html/blog/pass-road-test/index.html` — bodies byte-identical except H1/intro; word counts 217-234 confirmed across `about`, `pricing`, `faq`, `courses/beginner-driving-course` | Generate a unique, page-specific server/build-time prerender (SSG/prerender per route) so each URL's static HTML reflects its real React content, not a shared generic stub. At minimum, vary the 6 boilerplate `<h2>` sections per page type. |
| Blog posts ~5-7x under the 1,500-word blog floor with no topical depth | High | `src/data/blogPosts.tsx` — ~230-330 words per post vs. 1,500 minimum; content is a bare numbered list with no local data/citations | Expand each post with BC/ICBC-specific detail (route examples, GLP timelines, real statistics with sources), add named-instructor commentary, target 1,200-1,800 words of genuine substance. |
| No named, credentialed instructors anywhere on the live site | High | `src/pages/About.tsx` has no team roster; `src/components/TeamSection.tsx` (unused) still contains a web-agency template roster ("Ahmed Khan – CEO & Founder," "Bilal Ahmed – Lead Developer") | Add real instructor bios: name, ICBC/driving-instructor licence or certification detail, years of experience, photo. This is the single highest-leverage E-E-A-T fix for a YMYL-adjacent local service page. |
| Blog authorship/date not machine-readable; no `BlogPosting` schema | Medium | `src/pages/BlogPost.tsx:56-67` renders date/author as plain text only; `grep` of `SeoManager.tsx` shows only `LocalBusiness`/`FAQPage` JSON-LD | Add `BlogPosting` JSON-LD per post with real `author` (Person, not brand), `datePublished`, `dateModified`. |
| Templated/duplicated body copy across 7 SEO landing pages and 14 course pages | Medium | `src/data/seoLandingPages.ts` — identical 3-para intro / 3-section / FAQ skeleton and repeated phrasing across all entries; `CourseProductPage.tsx:160-164` programmatically generates identical "outcomes" sentence pattern per course | Differentiate each landing page with genuinely unique local detail (specific intersections/test routes per area, specific instructor notes); for course pages, hand-write 2-3 unique differentiating sentences instead of the templated outcomes generator. |
| NAP address conflict: Langford V9B 4G1 (schema/contact copy) vs. Victoria V9B 4G2 (Google Maps embed) | Medium | `src/pages/Contact.tsx:139` (`maps.google.com/?q=...Langford...V9B+4G1`) vs. `src/pages/Contact.tsx:328` and `src/pages/Index.tsx:725` (embed pb= string resolves to "2770 Leigh Rd #124, Victoria, BC V9B 4G2, Canada"); corroborated in `COMPANY_KNOWLEDGE.md` §10 | Reconcile to one canonical address and update the Maps embed pb= string, LocalBusiness schema, and all visible copy to match. Conflicting NAP data undermines local-SEO trust and Google Business Profile matching. |
| Testimonials are unverifiable and include an out-of-service-area location | Medium | `src/components/TestimonialsSection.tsx:10-59` — first-name + initial only, all 5-star, no link to Google/Facebook reviews; one quote attributed to "Student - Nanaimo," not among the 8 official service areas | Replace with real, verifiable reviews (embed actual Google Business Profile reviews with a link) or clearly attribute to a review platform; correct/remove the Nanaimo entry or add Nanaimo to service areas if genuinely served. |
| About page has no history, credentials, or team detail; ~230 words vs. 500 floor | Medium | `src/pages/About.tsx` — generic "values" copy only, two unrelated stock photos ("Team workshop," "Team collaboration") | Expand with founding story, instructor bios/credentials, ICBC school registration detail, years operating, student outcomes. |
| No pricing/`Offer` schema on individual course/package pages despite concrete public pricing | Low | `SeoManager.tsx:175-193` shows `Offer`/`Service` schema only on the homepage-level JSON-LD, not per course/package route; pricing values only in `src/data/coursePricing.ts` | Add `Product`/`Offer` schema per course and package product page with real price, currency, and location-tier variants. |
| Dead template code with irrelevant fake team ("Creative Director," "Lead Developer") left in repo | Low | `src/components/TeamSection.tsx` — unused (grep confirms no imports), but signals incomplete template cleanup | Delete the file or repurpose it with real staff before it's ever wired into a route. |
| Safety/standards claims are unsupported labels with no detail | Low | `src/components/SafetyStandardsSection.tsx:4-14` — "Licensed Instructors," "Insured and Licensed" shown as bare marquee chips, no licence numbers/links | Link each claim to supporting detail (ICBC school registration number, insurance provider mention, instructor certification body) to convert assertions into verifiable trust signals. |

---

## Quick Wins

1. Reconcile the Langford/Victoria address conflict in the Google Maps embed and schema (one-line
   config fix, high trust impact).
2. Add real instructor name(s) + credentials to the About page and blog author byline — even one
   named, credentialed instructor materially improves Expertise/Experience scoring.
3. Add `BlogPosting` JSON-LD with `datePublished`/`author` to the 3 existing blog posts — low
   effort, direct freshness/AI-citation benefit.
4. Delete or repurpose the unused `TeamSection.tsx` template leftover so it can't accidentally ship
   fake "Creative Director" bios later.
5. Fix the single most damaging structural issue — the identical fallback stub — by prerendering
   real per-route content (even a lightweight static export of each `SeoLandingPage`/`BlogPost`
   entry into its own stub body would eliminate the duplicate-content and thin-content problems in
   one pass).
