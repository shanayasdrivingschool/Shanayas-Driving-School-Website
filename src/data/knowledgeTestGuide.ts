import type { SeoLandingPageFaq } from "@/data/seoLandingPages";

/* Single source of truth for the Class 7 guide's review date. The page text, the
   <time> element and the Article schema's dateModified all read from here, so a
   re-check only has to be recorded once. */
export const KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO = "2026-07-21";
export const KNOWLEDGE_TEST_GUIDE_PUBLISHED_ISO = "2026-06-12";

export const KNOWLEDGE_TEST_GUIDE_REVIEWED_LABEL = new Date(
  `${KNOWLEDGE_TEST_GUIDE_REVIEWED_ISO}T00:00:00Z`,
).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export type KnowledgeTestGuideSection = {
  id: string;
  label: string;
};

/* Drives both the on-page table of contents and the section anchors. Order here
   is the order the sections appear in. */
export const knowledgeTestGuideSections: KnowledgeTestGuideSection[] = [
  { id: "at-a-glance", label: "At a glance" },
  { id: "study-materials", label: "Study materials" },
  { id: "online-test", label: "Online test" },
  { id: "in-person-test", label: "In-person test" },
  { id: "after-you-pass", label: "After you pass" },
  { id: "faq", label: "Common questions" },
  { id: "sources", label: "Official sources" },
];

/* Rendered on the page AND emitted as FAQPage schema. Google requires the answer
   text to be visible on the page, so these must stay in sync — hence one array. */
export const knowledgeTestGuideFaqs: SeoLandingPageFaq[] = [
  {
    question: "How many questions are on the B.C. Class 7 knowledge test?",
    answer:
      "The Class 7 passenger-vehicle knowledge test has 50 multiple-choice questions. You need 40 correct answers to pass and you have a maximum of 45 minutes. The same format applies whether you take the test online or in person.",
  },
  {
    question: "Can I retake the knowledge test if I fail?",
    answer:
      "Yes. ICBC says you may retake the online test after 24 hours. You must register again and pay another $15 attempt fee each time. You can also choose to take the test at a driver licensing office instead.",
  },
  {
    question: "What ID do I need to bring to the driver licensing office?",
    answer:
      "Bring two accepted pieces of identification: one primary and one secondary. If you passed the test online, your primary ID must be the same one you used to register. Check ICBC's accepted-ID page before your visit, because requirements can depend on your circumstances.",
  },
  {
    question: "How much does the B.C. knowledge test cost?",
    answer:
      "The knowledge test costs $15 for each attempt. If you pass, there is a separate $10 fee for the Class 7 photo learner's licence. Confirm current amounts on ICBC's fees page before you pay.",
  },
  {
    question: "Can I take the B.C. knowledge test on my phone?",
    answer:
      "No. The online knowledge test requires a desktop or laptop computer with a mouse or trackpad, a keyboard and a working webcam. Phones and tablets are not supported, and you must be physically located in Canada or the United States.",
  },
  {
    question: "Does passing the online test mean I can drive?",
    answer:
      "No. A passing result is only the test result. You are not licensed or legally allowed to drive until ICBC issues your learner's licence, which requires visiting a driver licensing office with your ID, completing a vision screening and paying the licence fee. Your online result is valid for one year.",
  },
  {
    question: "What languages is the knowledge test available in?",
    answer:
      "ICBC offers the Class 7 knowledge test in 12 languages: English, Arabic, Croatian, French, Farsi, Traditional Chinese, Simplified Chinese, Punjabi, Russian, Spanish, Ukrainian and Vietnamese.",
  },
  {
    question: "Do I need parent or guardian consent?",
    answer:
      "Applicants under 19 currently need parent or legal guardian consent. The B.C. government has announced that, effective October 19, 2026, the threshold will be lowered to under 18. Check ICBC's current instructions if you are applying near or after that date.",
  },
];
