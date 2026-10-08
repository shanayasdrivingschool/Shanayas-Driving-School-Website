import { Link } from "react-router-dom";
import type { BlogPostData } from "./blogPosts";
import { knowledgeTestArticleLinks as official } from "./knowledgeTestArticleLinks";

const faqs = [
  {
    question: "What is the first step for a new knowledge-test learner?",
    answer:
      "Confirm which licence class and knowledge test apply to you, then use the current official guide for that class. For a passenger-vehicle Class 5 or 7 test, begin with ICBC's Learn to Drive Smart.",
  },
  {
    question: "How long should I study before taking the test?",
    answer:
      "There is no single number of days that proves readiness. Use short sessions, track weak topics and move to mixed practice only after you can explain the main rules. Schedule based on consistent understanding rather than a rushed deadline.",
  },
  {
    question: "Can I take the B.C. passenger-vehicle knowledge test online?",
    answer:
      "ICBC currently offers online and in-person passenger-vehicle knowledge tests. Eligibility, equipment, identification and follow-up licensing steps apply, so check ICBC's current online-test page before registering.",
  },
];

export const knowledgeTestPlanLangfordPost: BlogPostData = {
  slug: "knowledge-test-practice-langford-step-by-step",
  title: "Knowledge Test Practice Langford: A Step-by-Step Guide for New Drivers",
  seoTitle: "ICBC Knowledge Test Study Plan for Langford Learners",
  description:
    "Follow a practical four-stage plan for studying B.C. road rules, using practice questions and preparing for an ICBC knowledge test.",
  heroImage: "/Course-pictures-updated/Knowledge test prep course whatsapp catalogue_.webp",
  author: "Shanaya's Driving School",
  date: "October 8, 2026",
  datePublished: "2026-10-08",
  dateModified: "2026-10-08",
  readTime: "7 min read",
  category: "Knowledge Test",
  faqs,
  relatedSlugs: [
    "knowledge-test-practice-victoria-what-to-study",
    "knowledge-test-practice-langford-road-signs",
    "knowledge-test-practice-langford-confidence",
  ],
  content: (
    <>
      <p>
        A new driver in Langford does not need to study everything at once. A useful plan moves
        through four stages: confirm the correct test, learn from the official guide, use practice
        questions to find gaps, and prepare the practical details for test day.
      </p>
      <p>
        This guide is for passenger-vehicle knowledge preparation. ICBC publishes different study
        material for motorcycles and commercial licence classes, so confirm your own test before
        following a Class 5 or 7 plan.
      </p>

      <h2>Stage 1: confirm your path and collect the right sources</h2>
      <p>
        Start with ICBC's <a href={official.getYourL} target="_blank" rel="noopener noreferrer">Get your L page</a> and <a href={official.learnToDriveSmart} target="_blank" rel="noopener noreferrer">Learn to Drive Smart</a>.
        The first tells you how the passenger-vehicle learner process works; the second is the
        official study guide. Save the current links instead of depending on an old downloaded list
        or an answer sheet from someone else.
      </p>
      <ul>
        <li>Confirm the licence class you are applying for.</li>
        <li>Use the official guide for that class.</li>
        <li>Choose a realistic target date without making it your only measure of progress.</li>
        <li>Create one place for notes and repeated mistakes.</li>
      </ul>

      <h2>Stage 2: learn in topic blocks</h2>
      <p>
        Work through a small group of related topics in each session. For example, pair signs and
        markings, then intersections and right-of-way, then sharing the road and hazard response.
        End each session by explaining two or three rules without looking at the text.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200" role="region" aria-label="Four-session knowledge test plan" tabIndex={0}>
        <table>
          <caption>A repeatable cycle for early study sessions.</caption>
          <thead><tr><th scope="col">Part</th><th scope="col">Task</th><th scope="col">Evidence of progress</th></tr></thead>
          <tbody>
            <tr><th scope="row">Read</th><td>Study one manageable section of the guide.</td><td>You can summarize its purpose.</td></tr>
            <tr><th scope="row">Connect</th><td>Apply the rule to a road situation.</td><td>You can identify the deciding detail.</td></tr>
            <tr><th scope="row">Recall</th><td>Close the guide and explain the rule.</td><td>You do not depend on the original wording.</td></tr>
            <tr><th scope="row">Review</th><td>Reopen the source and correct your explanation.</td><td>Your note matches the official rule.</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Stage 3: add practice questions and diagnose mistakes</h2>
      <p>
        Use ICBC's <a href={official.practiceTest} target="_blank" rel="noopener noreferrer">official practice-test page</a> after you have studied the relevant material.
        A score tells you how that session went. A mistake log tells you what to do next.
      </p>
      <p>
        Sort mistakes into a few useful groups: signs and markings, intersections, speed and space,
        vulnerable road users, driver condition, emergency response and licensing. If one group
        grows faster than the others, return to that part of the guide before continuing with more
        mixed questions.
      </p>
      <p>
        Use our <Link to="/blog/knowledge-test-practice-victoria-common-questions">question-strategy guide</Link> when your difficulty is reading scenarios rather than recalling the rule.
      </p>

      <h2>Stage 4: prepare for the real test process</h2>
      <p>
        ICBC currently offers passenger-vehicle knowledge testing online and at driver licensing
        offices. The two options have different practical requirements. Review the <a href={official.onlineTest} target="_blank" rel="noopener noreferrer">online-test page</a> for
        equipment and follow-up steps, or ICBC's appointment information for an in-person test.
      </p>
      <p>
        Passing online does not make you licensed to drive. ICBC says you must still complete the
        required identity, vision and licence-issuance steps at a driver licensing office. Our
        <Link to="/knowledge-test-guide"> B.C. knowledge-test guide</Link> collects those process details and official links.
      </p>

      <h2>Use a flexible two-week example</h2>
      <p>
        This is an example schedule, not a promise that every learner will be ready in two weeks.
        Shorten or extend it according to your understanding.
      </p>
      <ul>
        <li><strong>Days 1–4:</strong> study topic blocks and write brief recall notes.</li>
        <li><strong>Days 5–7:</strong> add topic-based practice and build a mistake log.</li>
        <li><strong>Days 8–11:</strong> revisit weak sections and begin mixed practice.</li>
        <li><strong>Days 12–13:</strong> complete realistic sessions and review recurring gaps.</li>
        <li><strong>Day 14:</strong> use a light review, confirm test logistics and avoid last-minute overload.</li>
      </ul>

      <h2>Know when to adjust the plan</h2>
      <p>
        Extend the study stage if you keep recognizing answers without being able to explain them,
        if one topic remains consistently weak or if language makes the source difficult to
        interpret. ICBC publishes Learn to Drive Smart and practice material in several languages;
        use the current language options on the official pages.
      </p>
      <p>
        If you want structured help organizing signs, rules and practice, review the
        <Link to="/courses/knowledge-test-prep-course"> Knowledge Test Prep Course</Link>. Confirm current scheduling before relying on a course date.
      </p>
    </>
  ),
};
