import { Link } from "react-router-dom";
import { googleReviewsUrl } from "./beginnerCourseLanding";
import type { BlogPostData } from "./blogPosts";

const parentGuideUrl =
  "https://www.icbc.com/driver-licensing/new-drivers/For-parents-of-teen-drivers";
const learnerRestrictionsUrl =
  "https://www.icbc.com/driver-licensing/new-drivers/you-have-a-class-7l-licence";
const tuningUpUrl =
  "https://www.icbc.com/assets/en/7piwqMyGnoxb1F6ONZSMqr/tuneup-complete.pdf";
const glpChangesUrl =
  "https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes";
const insuranceUrl = "https://www.icbc.com/insurance/products-coverage/unlisted-driver-protection";

const parentTeenFaqs = [
  {
    question: "Who can supervise a teen with a Class 7L licence in B.C.?",
    answer:
      "Until October 19, 2026, a supervisor must be at least 25, hold a valid Class 1–5 licence and sit in the front passenger seat. ICBC says the minimum age becomes 22 on that date. Check the teen’s licence and ICBC’s current restrictions before driving.",
  },
  {
    question: "How can parents make driving practice less stressful?",
    answer:
      "Choose one skill and a familiar route, keep instructions short, and save non-urgent feedback for a parked debrief. End the drive if either person becomes too upset or tired to continue safely.",
  },
  {
    question: "Should a parent sit in during a teen’s driving lesson?",
    answer:
      "Ask the school and your teen before booking because passenger policies and lesson goals differ. Even when a parent does not ride along, they can ask the instructor for practice priorities that the teen agrees may be shared.",
  },
  {
    question: "When might professional instruction help a teen learner?",
    answer:
      "It may help when family practice repeatedly becomes tense, the parent is unsure how to explain a skill, or the learner needs structured feedback before moving into more complex traffic. Lessons complement legal supervised practice and do not guarantee road-test success.",
  },
];

export const parentsTeenDriversVictoriaPost: BlogPostData = {
  slug: "parents-teen-drivers-victoria-bc-guide",
  title: "For Parents of Teen Drivers in Victoria: A Practical Guide to Safer Practice",
  seoTitle: "Parents of Teen Drivers in Victoria: A Practical Guide",
  description:
    "Help your teen learn to drive in Victoria with current B.C. learner rules, calmer coaching, a staged practice plan and signs that outside instruction may help.",
  heroImage: "/course-pictures/beginner-driving-course.jpg",
  author: "Shanaya's Driving School",
  date: "September 7, 2026",
  datePublished: "2026-09-07",
  dateModified: "2026-09-07",
  readTime: "7 min read",
  category: "Teen Driver Guide",
  faqs: parentTeenFaqs,
  relatedSlugs: [
    "how-many-driving-lessons-before-victoria-driving-test",
    "choosing-driving-school-first-time-victoria-langford",
    "icbc-road-test-tips-victoria",
  ],
  content: (
    <>
      <p>
        Teaching your teen to drive can turn an ordinary trip through Victoria into a tense family
        moment. You are explaining a skill while your teen processes signs, pedals, mirrors and your
        voice at the same time.
      </p>
      <p>
        A better approach is to make each drive small, planned and calm. Check the licence
        restrictions first, choose one main skill, match the route to your teen&apos;s current ability
        and discuss feedback after the car is safely parked. Your role is to provide legal
        supervision and useful practice, not to recreate a road test on every trip.
      </p>
      <p>
        ICBC describes the same mix of excitement and worry in its{" "}
        <a href={parentGuideUrl} target="_blank" rel="noopener noreferrer">
          information for parents of teen drivers
        </a>
        :
      </p>
      <figure className="my-7">
        <blockquote cite={parentGuideUrl}>
          “Having a teen who&apos;s learning to drive can be an exciting and stressful time.”
        </blockquote>
        <figcaption className="text-sm">
          ICBC, <a href={parentGuideUrl} target="_blank" rel="noopener noreferrer">For parents of teen drivers</a>.
        </figcaption>
      </figure>

      <h2>Start with the rules that apply to your teen</h2>
      <p>
        For a teen with a B.C. Class 7L learner&apos;s licence, supervision is a legal condition of
        driving. As of September 7, 2026, ICBC&apos;s{" "}
        <a href={learnerRestrictionsUrl} target="_blank" rel="noopener noreferrer">
          Class 7L restrictions
        </a>{" "}
        require a qualified supervisor who is at least 25 and holds a valid Class 1–5 licence. The
        supervisor must sit beside the learner in the front passenger seat.
      </p>
      <p>The same current restriction page says a Class 7L driver must:</p>
      <ul>
        <li>display the red L sign on the back of the vehicle;</li>
        <li>have zero alcohol or drugs in their blood while driving;</li>
        <li>avoid all cellphones and other electronic devices, including hands-free devices;</li>
        <li>drive only between 5 a.m. and midnight; and</li>
        <li>carry only one passenger in addition to the qualified supervisor.</li>
      </ul>
      <p>
        These rules are changing soon. ICBC says that on <strong>October 19, 2026</strong>, the
        minimum supervisor age will become 22 and immediate-family passengers will receive an
        exemption from the one-passenger limit, subject to the published conditions. Review the{" "}
        <a href={glpChangesUrl} target="_blank" rel="noopener noreferrer">
          official Graduated Licensing Program changes
        </a>{" "}
        before a drive on or after that date. The restriction printed on the licence and ICBC&apos;s
        current guidance should settle any uncertainty.
      </p>
      <p>
        Before using the family vehicle, also confirm that your teen is properly listed for its
        insurance. ICBC explains the potential consequence when an unlisted household member causes
        a crash on its{" "}
        <a href={insuranceUrl} target="_blank" rel="noopener noreferrer">
          unlisted driver protection page
        </a>
        . Ask an Autoplan broker about your own policy rather than assuming another family&apos;s setup
        applies to yours.
      </p>

      <h2>Use a five-minute plan before every practice drive</h2>
      <p>
        A short conversation before moving the car prevents many arguments later. Agree on four
        things: the main skill, the route, the conditions and the words you will use if the teen must
        slow down or stop. Either person can end the session if concentration or patience is slipping.
      </p>
      <div
        className="overflow-x-auto rounded-xl border border-slate-200"
        role="region"
        aria-label="Teen driving practice plan"
        tabIndex={0}
      >
        <table>
          <caption>A simple progression for family-supervised practice in Greater Victoria.</caption>
          <thead>
            <tr>
              <th scope="col">Stage</th>
              <th scope="col">Possible focus</th>
              <th scope="col">Move on when</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Quiet start</th>
              <td>Seat and mirror setup, smooth starts and stops, steering and basic observation.</td>
              <td>The teen can control the car without hurried reminders.</td>
            </tr>
            <tr>
              <th scope="row">Familiar streets</th>
              <td>Intersections, signs, parked vehicles, pedestrians and speed choices.</td>
              <td>Checks and decisions become consistent on several drives.</td>
            </tr>
            <tr>
              <th scope="row">More traffic</th>
              <td>Lane changes, busier junctions, cyclists and changing speed limits.</td>
              <td>The teen keeps safe margins while handling the added workload.</td>
            </tr>
            <tr>
              <th scope="row">Varied conditions</th>
              <td>Rain, darkness, hills and higher-speed roads, introduced separately.</td>
              <td>The teen adapts without losing the habits built earlier.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These are planning examples, not a fixed curriculum or readiness test. Victoria-area
        conditions can change quickly between a quiet residential street, a busy cycling corridor
        and the Trans-Canada Highway. Increase only one kind of difficulty at a time. A learner who
        is still working on smooth braking does not also need an unfamiliar route in heavy rain.
      </p>

      <h2>Coach without turning the passenger seat into a conflict</h2>
      <p>
        Give directions early and use the same short phrases each time. “At the next safe place,
        pull over” is easier to process than a long explanation delivered near the turn. If there is
        no immediate danger, make a note and discuss it once parked.
      </p>
      <p>
        ICBC&apos;s <a href={tuningUpUrl} target="_blank" rel="noopener noreferrer">Tuning up for Drivers manual</a>{" "}
        treats communication and patience as part of being a suitable supervisor. Its learning cycle
        is practical: discuss the exercise, demonstrate it, let the learner try, give feedback and
        allow time to practise. The manual also asks a candid question:
      </p>
      <figure className="my-7">
        <blockquote cite={`${tuningUpUrl}#page=9`}>
          “Can your relationship survive the frustrations of driving practice?”
        </blockquote>
        <figcaption className="text-sm">
          ICBC, <a href={`${tuningUpUrl}#page=9`} target="_blank" rel="noopener noreferrer">Tuning up for Drivers, page 4 of the guide</a>.
        </figcaption>
      </figure>
      <p>
        If the answer feels uncertain, change the process. Shorten the drive, use one supervisor
        consistently, or let an instructor introduce a difficult skill before practising it as a
        family.
      </p>

      <h2>Track progress by skills, not by pressure</h2>
      <p>
        ICBC&apos;s supervisor manual suggests planning about 60 hours of practice before the Class 7
        road test. This is practice guidance, not a required number of paid lessons, and reaching an
        hour total does not prove readiness. Our{" "}
        <Link to="/blog/how-many-driving-lessons-before-victoria-driving-test">
          guide to lesson and practice planning
        </Link>{" "}
        explains that distinction in detail.
      </p>
      <p>
        Keep a simple log with the date, conditions, route type, skill practised and one next step.
        “Drove for 40 minutes” says little. “Chose safe gaps at familiar intersections; still needed
        two shoulder-check reminders” gives the next drive a clear purpose.
      </p>
      <p>Look for patterns across several drives:</p>
      <ul>
        <li>Does your teen notice hazards without being prompted?</li>
        <li>Can they manage speed and following space when traffic changes?</li>
        <li>Do familiar skills remain reliable on an unfamiliar road?</li>
        <li>Can they accept feedback and apply it on the next attempt?</li>
        <li>Are you still giving frequent instructions or intervening for safety?</li>
      </ul>
      <p>
        Confidence matters, but confidence and independent driving ability are not identical. Delay
        difficult conditions while control or observation depends on constant coaching.
      </p>

      <h2>When an instructor can support the family practice plan</h2>
      <p>
        Outside instruction can be useful when the same disagreement keeps returning, when you are
        unsure how to explain a skill, or when your teen is ready to add complexity but family
        practice has stalled. Ask for specific priorities to carry into later supervised drives.
      </p>
      <p>
        Ask how the instructor communicates progress, whether practice suggestions can be shared
        with a parent with the teen&apos;s agreement, and how the school decides when to introduce
        busier roads. Our guide to{" "}
        <Link to="/blog/choosing-driving-school-first-time-victoria-langford">
          choosing a driving school in Victoria or Langford
        </Link>{" "}
        gives you a fuller set of questions.
      </p>
      <p>
        One parent, Tanya Frenette, described her own family&apos;s experience with Shanaya&apos;s this way:
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>
          “As a parent, I like the emphasis on safety and feel very comfortable letting them drive.”
        </blockquote>
        <figcaption className="text-sm">
          Tanya Frenette · excerpt from an individual Google review ·{" "}
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">read reviews on Google</a>.
        </figcaption>
      </figure>
      <p>
        That is one parent&apos;s account, not a promise about another learner&apos;s progress. It does show
        a useful standard to ask for: clear attention to safety, feedback the family can understand
        and a pace that fits the learner.
      </p>

      <h2>Give your teen more ownership as their skills grow</h2>
      <p>
        Let your teen help choose the practice goal and describe what felt difficult. Ask them to
        talk through what they noticed rather than supplying every answer. Over time, move from
        instructions to questions: “What is changing ahead?” or “Where is your safe space?” The goal
        is for the learner to make decisions before the supervisor has to speak.
      </p>
      <p>
        Road-test preparation comes later in that process. When your teen is approaching the Class 7
        test, use our <Link to="/blog/icbc-road-test-tips-victoria">Victoria road-test guide</Link> to
        review skills and local conditions without relying on supposed test routes or pass promises.
      </p>

      <h2>A calmer next drive starts before the engine does</h2>
      <p>
        Pick one skill, choose a suitable route and agree on how you will communicate. Follow the
        current licence and insurance conditions, then finish with one thing that improved and one
        thing to practise next. That rhythm gives a teen room to learn and gives a parent a clearer
        role than watching every mistake at once.
      </p>
      <p>
        If family practice needs a fresh set of eyes, explore our{" "}
        <Link to="/beginner-driving-lessons-victoria">beginner driving lessons in Victoria</Link> or{" "}
        <Link to="/contact">tell us where your teen is getting stuck</Link>. You can also call{" "}
        <a href="tel:+12505423673">250-542-3673</a> or email{" "}
        <a href="mailto:book@drivingschoolbc.ca">book@drivingschoolbc.ca</a>. We can discuss a
        suitable next step around their present skills and your family&apos;s practice plan.
      </p>

      <h2>Frequently asked questions</h2>
      {parentTeenFaqs.map((faq) => (
        <section key={faq.question}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </section>
      ))}
    </>
  ),
};
