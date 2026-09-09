import { Link } from "react-router-dom";
import { googleReviewsUrl } from "./beginnerCourseLanding";
import type { BlogPostData } from "./blogPosts";

// One source for the visible dropdown answers and both versions of the FAQ schema.
const costFaqs = [
  {
    question: "How much are driving lessons in Victoria, BC in 2026?",
    answer: "Shanaya’s standard rate is $89 CAD per hour before GST. We are currently running a 30% promotion on eligible lessons. If it applies to your booking, a one-hour lesson works out to $62.30 before GST. Call 250-542-3673 to confirm eligible lessons, available dates and the final price.",
  },
  {
    question: "Do you offer monthly or festival discounts?",
    answer: "Yes. We run monthly and festival promotions. Past offers included up to 50% off throughout April 2026 and a later 40% promotion. Our current promotion is 30% off eligible lessons. Past offers have ended; call 250-542-3673 to check the offer available for your booking and whether it can be combined with anything else.",
  },
  {
    question: "Can I try a lesson before committing?",
    answer: "We have offered free trial lessons so learners can experience our teaching approach before choosing paid instruction. Call 250-542-3673 to ask whether a trial is currently available, who qualifies and what it includes. Trial availability and any follow-on discount should be confirmed before booking.",
  },
  {
    question: "What makes professional driving lessons worth the cost?",
    answer: "The value is individual feedback: understanding what you already do well, working on the areas that need attention and leaving with a clearer practice plan. Patient explanations and a lesson paced to your experience can make learning more manageable. Progress varies, so choose instruction around your needs rather than a promised number of lessons or a guaranteed pass.",
  },
  {
    question: "Does the lesson price include a car for my road test?",
    answer: "A standard lesson includes the school car during that lesson. Road-test-day vehicle use is a separate service unless your chosen package includes it. Ask for the preparation time, vehicle use, applicable discount and final total to be itemised. ICBC test and licensing fees are separate.",
  },
];

const callHref = "tel:+12505423673";
const callButtonClass = "inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1d52a1] px-5 py-3 text-center !text-white !no-underline hover:bg-[#17488d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700";

export const drivingLessonCostsPost: BlogPostData = {
  slug: "driving-lessons-cost-victoria-bc-2026",
  title: "How Much Do Driving Lessons Cost in Victoria, BC in 2026?",
  seoTitle: "Driving Lesson Costs in Victoria, BC (2026)",
  description:
    "Explore supportive driving lessons in Victoria, BC, current savings, student experiences and practical ways to get more value from every lesson in 2026.",
  heroImage: "/landing/pricing.webp",
  author: "Shanaya's Driving School",
  date: "September 6, 2026",
  datePublished: "2026-09-05",
  dateModified: "2026-09-06",
  readTime: "7 min read",
  category: "Lesson Costs",
  faqs: costFaqs,
  relatedSlugs: [
    "pass-road-test",
    "icbc-road-test-victoria-mckenzie-office",
    "newcomers-guide-bc",
  ],
  content: (
    <>
      <p>
        Picture the first drive you can make on your own schedule: getting to work without arranging
        a ride, helping your family when they need you or simply feeling calm on a busy Victoria road.
        That freedom starts before the road test. It begins when each lesson turns uncertainty into a
        skill you understand and can use again.
      </p>
      <p>
        Whether you are taking the wheel for the first time, returning after a long break or preparing
        for your test, the real question is not simply what an hour costs. It is what you can take from
        that hour. This guide will help you recognise worthwhile instruction, plan a realistic budget
        and find available savings without choosing lessons on price alone.
      </p>

      <h2>Start with the progress you want to feel</h2>
      <p>
        An hour behind the wheel is most useful when you understand what you are practising and why.
        Personal instruction gives you someone who can explain an unfamiliar task, notice a habit
        you have missed and help you decide what to work on next. That is the value to look for
        when comparing driving lessons in Victoria, BC.
      </p>
      <p>
        For a beginner, that might mean learning the foundations without feeling rushed. For a nervous
        driver, it may be the chance to ask questions in a patient setting. For someone preparing for
        a road test, it can mean getting specific feedback instead of wondering whether more practice
        is helping. The lesson should meet you at your current stage.
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>
          “The lessons were professional, supportive, and helped build my son’s skills and confidence behind the wheel.”
        </blockquote>
        <figcaption className="text-sm">Vanessa Nicdao · excerpt from a Google review · <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google</a></figcaption>
      </figure>
      <p>
        Vanessa’s experience captures what many parents want from lessons: progress they can see and
        a learning environment their child feels comfortable in. It is one family’s experience,
        rather than a promise that every learner will progress at the same pace.
      </p>

      <h2>Monthly discounts, festival offers and free trials</h2>
      <p>
        Once you know what kind of support will move you forward, it becomes easier to plan what to
        spend. Our standard 60-minute lesson is <strong>$89 CAD before GST</strong>. That hour is built
        around your current ability, the skills you want to strengthen and useful feedback for your
        next practice session.
      </p>
      <p>
        Affordability matters when lessons need to fit around school, rent or family expenses, so we
        run promotions through the year. In <strong>April 2026, we offered up to 50% off for the full
        month</strong>. A later promotion offered 40% off. Those are past offers; our current promotion
        is 30% off eligible lessons. If it applies to your booking, a one-hour lesson is $62.30 before
        GST, saving $26.70.
      </p>
      <p>
        We have also introduced free trials so learners can experience the teaching before choosing
        paid lessons. If you are unsure whether the instructor’s approach will suit you, ask about
        trying a session. It is a practical way to discuss your goals and find out how comfortable
        you feel asking questions.
      </p>
      <p>
        Call <a href={callHref}>250-542-3673</a> for available discounts and trial options. We will
        confirm what applies to your chosen course and dates, including any eligibility conditions.
        Please check before paying rather than assuming an earlier offer is still running or that
        separate discounts can be combined.
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>
          “The school was also very flexible in scheduling my lessons around my availability, which made the whole learning process stress-free.”
        </blockquote>
        <figcaption className="text-sm">Divya Pandya · excerpt from a Google review · <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Explore more student experiences</a></figcaption>
      </figure>
      <p>
        Divya also described the instruction as offering “great value for the quality of instruction
        they provide.” Price matters, but so does finding lessons you can attend and a teaching
        approach that helps you learn.
      </p>

      <h2>How discounts can change your lesson budget</h2>
      <p>
        To understand driving lessons prices in 2026, compare actual instruction time and the offer
        available to you. Here is how our standard hourly rate compares with a 30% reduction when
        the selected instruction qualifies. All figures are CAD before GST; test-day services and
        ICBC fees are separate.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200" role="region" aria-label="Standard and eligible discounted lesson budgets" tabIndex={0}>
        <table>
          <caption>Illustrations using the current 30% promotion if applicable to every hour booked; not package quotes.</caption>
          <thead><tr><th scope="col">Instruction time</th><th scope="col">Standard subtotal</th><th scope="col">With 30% off</th></tr></thead>
          <tbody>
            <tr><th scope="row">1 hour</th><td>$89</td><td>$62.30</td></tr>
            <tr><th scope="row">5 hours</th><td>$445</td><td>$311.50</td></tr>
            <tr><th scope="row">10 hours</th><td>$890</td><td>$623</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Choose the hours around your learning needs. These examples show what a discount could mean
        for your budget, not how many lessons you must buy. Confirm the current offer and itemised
        total when booking; a suitable starting plan is more useful than buying hours simply
        because they are on sale.
      </p>

      <h2>Choose the right lessons for your stage</h2>
      <p>
        If you are looking for <Link to="/courses/beginner-driving-course">beginner driving lessons
        in Victoria</Link>, ask how the first sessions build foundations and how your instructor
        will explain progress. Our standard lessons include a licensed instructor and a dual-control
        school car. Pickup and drop-off are available within the service area, subject to scheduling;
        confirm your address and arrangement when booking.
      </p>
      <p>
        Individual lessons can be a useful starting point when you want to experience the teaching
        or focus on a particular concern. A <Link to="/packages">lesson package</Link> may suit a
        learner who wants a planned sequence. Ask which option fits your experience and whether the
        current discount applies to that choice.
      </p>
      <p>
        If your test is approaching, compare a preparation lesson with a
        <Link to="/courses/lesson-road-test-prep-course"> road-test package</Link>. Check how much
        instruction and vehicle use each contains. Keeping those details clear helps you choose
        useful support without paying for services you do not need.
      </p>

      <h2>Get more value from every appointment</h2>
      <p>
        Tell your instructor what feels difficult, ask questions while an explanation is fresh and
        leave knowing your next practice priority. When legal supervised practice is available,
        use it to build on the feedback from your lesson. ICBC’s free
        <a href="https://www.icbc.com/driver-licensing/driving-guides/Tuning-Up-for-Drivers" target="_blank" rel="noopener noreferrer"> Tuning Up for Drivers guide</a>
        is another resource you can use alongside instruction.
      </p>
      <p>
        When comparing a driving instructor in Victoria, BC, look for a clear course outline,
        patient communication and written booking terms. ICBC’s
        <a href="https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school" target="_blank" rel="noopener noreferrer"> advice on choosing a driving school</a>
        explains the licensing and service information to check. A good price becomes good value
        when you understand what you are buying and how it supports your goals.
      </p>
      <p>
        Before you book, confirm the lesson length, applicable discount, pickup arrangement and
        final total. Read the <Link to="/policies/cancellation-and-rescheduling">cancellation terms</Link>
        so the schedule fits your commitments. No lesson count can guarantee a test result, but
        a clear plan gives you a more useful starting point than guesswork.
      </p>

      <h2>Frequently asked questions</h2>
      <div className="my-6 space-y-3">
        {costFaqs.map((faq) => (
          <details key={faq.question} className="group rounded-xl border border-slate-200 bg-white open:border-blue-300 open:bg-blue-50/40">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl p-5 font-bold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span aria-hidden="true" className="shrink-0 text-2xl text-blue-700 group-open:hidden">+</span>
              <span aria-hidden="true" className="hidden shrink-0 text-2xl text-blue-700 group-open:inline">−</span>
            </summary>
            <p className="!mb-0 px-5 pb-5">{faq.answer}</p>
          </details>
        ))}
      </div>

      <h2>Find a lesson plan that feels right for you</h2>
      <p>
        You do not need to arrive with every lesson planned. Tell us where you are starting, what
        you want to feel more confident doing and the budget you have in mind. We can talk through
        suitable lessons, the current 30% promotion and whether a free trial is available.
      </p>
      <aside aria-label="Ask about lessons and discounts" className="my-6 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xl font-bold text-slate-900">Your next step can be a simple conversation.</p>
        <p>Call for today’s offers and trial availability, or send a booking enquiry with your preferred dates.</p>
        <div className="flex flex-wrap gap-3">
          <a href={callHref} className={callButtonClass}>Call 250-542-3673</a>
          <Link to="/apply" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-blue-700 px-5 py-3 text-center !no-underline hover:bg-blue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">Enquire about lessons and offers</Link>
        </div>
      </aside>
      <p className="text-sm text-slate-500">
        Prices and promotion information checked September 6, 2026. Offers can change; confirm
        eligibility, dates and the final amount before payment. Review excerpts reflect individual experiences.
      </p>
    </>
  ),
};
