import { Link } from "react-router-dom";
import type { BlogPostData } from "./blogPosts";

const googleReviewsUrl =
  "https://www.google.com/maps/place/Shanaya's+Driving+School/@48.4514745,-123.5207662,17z/data=!4m8!3m7!1s0x548f0dbc0a227e83:0xf890ce589bc36216!8m2!3d48.451471!4d-123.5181913!9m1!1b1!16s%2Fg%2F11nk25xtf2";
const driveBcUrl = "https://api.open511.gov.bc.ca/events?format=kml&status=ACTIVE";
const icbcPoorConditionsUrl =
  "https://www.icbc.com/road-safety/safety-and-road-conditions/tips-for-driving-in-poor-conditions";
const contactUrl = "/contact";
const roadTestPrepUrl = "/road-test-prep-victoria";
const mockTestUrl = "/courses/mock-test-evaluation";

const routeAlertsFaqs = [
  {
    question: "What should I check before a driving lesson or road test in Greater Victoria?",
    answer:
      "Check the current District of Saanich advisories, North Saanich notices and DriveBC events before leaving. Add time for a detour or traffic-control stop, follow temporary signs and confirm any time-sensitive booking details early.",
  },
  {
    question: "Do roadwork notices show an ICBC road-test route?",
    answer:
      "No. Roadwork notices describe current traffic impacts. They do not publish an official ICBC test route. Prepare observation, speed control, lane positioning, shoulder checks and safe decisions across different roads.",
  },
  {
    question: "Can a mock evaluation help before my road test?",
    answer:
      "A private mock evaluation can help identify skills to practise before test day. It is coaching, not an official ICBC assessment, and it cannot guarantee a result.",
  },
];

export const greaterVictoriaRouteAlertsPost: BlogPostData = {
  slug: "greater-victoria-roadwork-route-alerts-november-2026",
  title: "Greater Victoria Roadwork and Route Alerts for Nov. 2–6, 2026",
  seoTitle: "Greater Victoria Roadwork Alerts: Nov. 2–6, 2026",
  description:
    "Current Saanich, North Saanich and Highway 1 traffic impacts for Greater Victoria lessons, commutes and road-test planning.",
  heroImage: "/landing/driving-lessons-saanich.webp",
  author: "Shanaya's Driving School",
  date: "November 1, 2026",
  datePublished: "2026-11-01",
  dateModified: "2026-11-01",
  readTime: "5 min read",
  category: "Greater Victoria Road Safety",
  relatedSlugs: ["icbc-road-test-victoria-mckenzie-office", "pass-road-test", "defensive-driving"],
  faqs: routeAlertsFaqs,
  content: (
    <>
      <p>
        If you have a driving lesson, school commute or ICBC road test in Greater Victoria this week,
        check the official traffic notices before leaving and allow extra time. Current notices affect
        Saanich, North Saanich and overnight travel on Highway 1. This is a dated summary from Shanaya&apos;s
        Driving School; the municipal and provincial notices remain the controlling sources.
      </p>

      <h2>Current closures and lane restrictions</h2>
      <h3>Saanich</h3>
      <ul>
        <li>
          <strong>Millgrove Street:</strong> A water-main upgrade is scheduled for Monday, November 2,
          from 8 a.m. to 3:30 p.m. The road is closed to through traffic, with local and emergency access maintained.
        </li>
        <li>
          <strong>McKenzie Avenue at Gordon Head Road and Shelbourne Street:</strong> Single-lane traffic is
          scheduled for Tuesday, November 3, from 8:30 a.m. to 3 p.m.
        </li>
        <li>
          <strong>Piedmont Drive:</strong> A water-main project continues through November 30, with a road
          closure between Del Monte Avenue and Santa Clara Avenue during the listed work hours.
        </li>
      </ul>
      <p>
        The <a href="https://www.saanich.ca/EN/main/community/getting-around/roads-traffic/traffic-advisories.html" target="_blank" rel="noopener noreferrer">District of Saanich traffic advisories</a>
        say signs and traffic-control personnel will guide drivers. Follow temporary signs rather than relying on a familiar route.
      </p>

      <h3>North Saanich</h3>
      <p>
        Dean Park Road will be closed to through traffic during working hours from November 3 to 6 for the
        Capital Regional District&apos;s Bear Hill Trunk Main Extension Project. A temporary detour will be in place.
        Local access will be maintained, and East Saanich Road may have alternating single-lane traffic. Read the
        <a href="https://www.northsaanich.ca/news-community/news-notices/dean-park-road-closure-november-3-6-2026" target="_blank" rel="noopener noreferrer">District of North Saanich notice</a>
        before travelling.
      </p>

      <h2>Overnight Highway 1 work</h2>
      <p>
        DriveBC lists overnight blasting between the View Royal and Saanich/McKenzie Avenue areas from October 6
        to November 30. The notice describes lane closures in both directions, intermittent stoppages of up to
        10 minutes during blasts, weekday work from 8 p.m. to 6 a.m. and Saturday work from 8 p.m. to 8 a.m.
      </p>
      <p>
        A separate DriveBC notice for the Bus on Shoulder project covers the Saanich/McKenzie Avenue and View Royal/
        Colwood Bridge corridor. It lists weekday night work from 8 p.m. to 5 a.m., periodic five-minute stoppages
        and a 50 km/h speed restriction. This is a separate event from the blasting notice. Check the
        <a href={driveBcUrl} target="_blank" rel="noopener noreferrer">live DriveBC feed</a> before travelling because construction details can change.
      </p>

      <h2>A route checklist for lessons and road tests</h2>
      <ol>
        <li>
          Check the <a href="https://www.saanich.ca/EN/main/community/getting-around/roads-traffic/traffic-advisories.html" target="_blank" rel="noopener noreferrer">Saanich advisories</a>,
          the <a href="https://www.northsaanich.ca/news-community/news-notices/dean-park-road-closure-november-3-6-2026" target="_blank" rel="noopener noreferrer">North Saanich notice</a>
          and <a href="https://www.drivebc.ca/" target="_blank" rel="noopener noreferrer">DriveBC</a> before leaving.
        </li>
        <li>Add a time buffer for a detour, queue or traffic-control stop.</li>
        <li>Follow the posted temporary speed, lane and turn instructions.</li>
        <li>Contact the school or testing office early if your appointment is time-sensitive.</li>
        <li>Use route changes to practise transferable skills rather than trying to memorise a test route.</li>
      </ol>
      <p>
        For road-test preparation, practise observation, speed control, lane positioning, shoulder checks and safe
        decisions around changing traffic. ICBC&apos;s <a href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf" target="_blank" rel="noopener noreferrer">Road Test Skills Explainer</a>
        describes skills an examiner may assess; it does not publish a route to memorise.
      </p>

      <h2>Why gradual route practice matters</h2>
      <p>
        One saved review from <strong>Vanessa Nicdao</strong> describes her son starting on narrow residential streets
        and later driving confidently on the highway after lessons. That is one family&apos;s account, not a typical timeline
        or a promise of readiness, but it illustrates why practice should expand by skill and traffic demand.
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>
          “My son started with little experience, driving only on narrow residential streets. … he can now drive confidently on the highway.”
        </blockquote>
        <figcaption className="text-sm">
          Vanessa Nicdao · saved customer review excerpt ·{" "}
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google</a>
        </figcaption>
      </figure>
      <p>
        If you would like help matching practice to your current experience, review our{" "}
        <Link to={roadTestPrepUrl}>Victoria road-test preparation</Link>,{" "}
        <Link to={mockTestUrl}>mock test evaluations</Link> or <Link to={contactUrl}>contact the school</Link>.
        Confirm the current service, price and availability before booking.
      </p>
    </>
  ),
};

const fogFaqs = [
  {
    question: "What headlights should I use in fog in B.C.?",
    answer: "ICBC advises using low-beam headlights in fog or heavy snow. Check the road conditions and DriveBC before travelling, and adjust your speed to what you can see and the traction available.",
  },
  {
    question: "How much following distance should I leave in poor conditions?",
    answer: "ICBC advises allowing at least twice the normal braking distance on wet or slippery roads. Fog can also reduce what you can see ahead, so leave room to respond smoothly.",
  },
  {
    question: "Does a fog checklist describe an ICBC road-test route?",
    answer: "No. It explains safety decisions that transfer across roads. It does not identify or guarantee an official ICBC test route.",
  },
];

export const malahatFogPost: BlogPostData = {
  slug: "fog-malahat-island-highway-driving-checklist",
  title: "Fog on the Malahat and Island Highway: A Low-Visibility Checklist",
  seoTitle: "Fog on the Malahat: A B.C. Driving Checklist",
  description:
    "A Victoria-area fog checklist based on current DriveBC conditions and ICBC guidance for low beams, speed, braking distance and preparation.",
  heroImage: "/landing/defensive-driving.webp",
  author: "Shanaya's Driving School",
  date: "November 1, 2026",
  datePublished: "2026-11-01",
  dateModified: "2026-11-01",
  readTime: "5 min read",
  category: "Driving Safety",
  relatedSlugs: ["defensive-driving", "late-night-crash-langford-night-driving-safety", "pass-road-test"],
  faqs: fogFaqs,
  content: (
    <>
      <p>
        At the time of this check on November 1, 2026, <a href={driveBcUrl} target="_blank" rel="noopener noreferrer">DriveBC&apos;s active events feed</a>
        reported fog patches from near the Malahat through the Cobble Hill and Duncan areas toward Chemainus. Fog can be patchy:
        clear pavement can change to limited visibility within a short distance. Slow down, use low beams and leave more room to stop.
        Check the live feed again before travelling because the event can be updated or cleared.
      </p>

      <h2>What ICBC recommends</h2>
      <p>
        <a href={icbcPoorConditionsUrl} target="_blank" rel="noopener noreferrer">ICBC&apos;s poor-conditions guidance</a> covers rain, snow and fog. It recommends:
      </p>
      <ul>
        <li>Slow down when conditions reduce visibility or traction.</li>
        <li>Use low-beam headlights in fog or heavy snow.</li>
        <li>Allow at least twice the normal braking distance on wet or slippery roads.</li>
        <li>Keep wiper fluid topped up and check tyre pressure in colder conditions.</li>
        <li>Check road and weather information on <a href="https://www.drivebc.ca/" target="_blank" rel="noopener noreferrer">DriveBC</a> before travelling.</li>
      </ul>
      <p>
        Posted speed limits are designed for ideal conditions. A lower speed may be appropriate when you cannot see as far ahead
        or when the road is wet, while still following the signs and driving predictably.
      </p>

      <h2>A fog-driving checklist</h2>
      <h3>Before leaving</h3>
      <ol>
        <li>Clean the windscreen, mirrors and lights.</li>
        <li>Confirm that low beams and windscreen wipers work.</li>
        <li>Check the live DriveBC events and the weather for your route.</li>
        <li>Leave enough time that you do not feel pressure to make up time in poor visibility.</li>
      </ol>
      <h3>While driving</h3>
      <ol>
        <li>Reduce speed before visibility drops rather than braking sharply after entering fog.</li>
        <li>Use low beams, as ICBC advises for fog.</li>
        <li>Increase the space in front of you, especially on wet pavement.</li>
        <li>Watch lane markings, signs, cyclists and stopped or slow-moving vehicles.</li>
        <li>Avoid sudden lane changes and keep steering and braking smooth.</li>
      </ol>
      <p>
        If visibility becomes too poor to continue safely, pull over only where it is legal and safe to do so. Keep well clear of travel lanes
        and follow official road instructions.
      </p>

      <h2>What this means for a learner</h2>
      <p>
        Fog practice is about judgement, speed control, following distance and calm observation. These are practical applications of official
        guidance, not additional ICBC rules. They are also not a reason to chase a particular road or claim knowledge of an ICBC test route.
      </p>
      <p>
        One saved customer review from <strong>Yogita Bang</strong> describes a first lesson this way: “I took a trial lesson and had a great experience.
        The instructor was patient, knowledgeable, and made me feel comfortable even though I was nervous.” That is one learner&apos;s account, not a typical
        outcome or a promise that fog-related anxiety will disappear.
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>
          “I took a trial lesson and had a great experience. The instructor was patient, knowledgeable, and made me feel comfortable even though I was nervous.”
        </blockquote>
        <figcaption className="text-sm">
          Yogita Bang · saved customer review excerpt ·{" "}
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google</a>
        </figcaption>
      </figure>
      <p>
        If you want help applying the checklist, see our <Link to="/courses/winter-driving-course">winter driving instruction</Link>,{" "}
        <Link to="/courses/defensive-driving-course">defensive driving</Link> and <Link to={roadTestPrepUrl}>Victoria road-test preparation</Link>.
        Ask about the lesson focus that fits your current skills, and confirm availability, service area and price before booking.
      </p>
    </>
  ),
};

const visibleFaqs = [
  {
    question: "What should drivers do for Let’s Get Visible Day in Greater Victoria?",
    answer: "Turn on headlights, slow down in low visibility, focus on the road, watch for pedestrians and cyclists, and be ready to stop. Follow temporary signs and local road rules.",
  },
  {
    question: "What can pedestrians and cyclists do to be more visible?",
    answer: "Wear bright or reflective clothing, use lights or reflectors where appropriate, use sidewalks or paths when available and make intentions clear while checking that traffic has stopped.",
  },
  {
    question: "Can a driving lesson help with visibility and pedestrian awareness?",
    answer: "A lesson can provide practice with scanning, speed choice, yielding and identifying vulnerable road users. It is coaching for transferable skills, not an official ICBC assessment.",
  },
];

export const letsGetVisiblePost: BlogPostData = {
  slug: "lets-get-visible-greater-victoria-driver-pedestrian-checklist",
  title: "Let’s Get Visible Day in Greater Victoria: A Driver and Pedestrian Checklist",
  seoTitle: "Let’s Get Visible Day in Greater Victoria (2026)",
  description:
    "A Greater Victoria checklist for drivers, pedestrians and cyclists ahead of Let’s Get Visible Day on November 6, 2026.",
  heroImage: "/landing/driving-lessons-view-royal.webp",
  author: "Shanaya's Driving School",
  date: "November 1, 2026",
  datePublished: "2026-11-01",
  dateModified: "2026-11-01",
  readTime: "4 min read",
  category: "Community Safety",
  relatedSlugs: ["defensive-driving", "icbc-road-test-tips-victoria", "late-night-crash-langford-night-driving-safety"],
  faqs: visibleFaqs,
  content: (
    <>
      <p>
        Greater Victoria School District 61 is taking part in the CRD-led Let&apos;s Get Visible Day on <strong>November 6, 2026</strong>.
        If you are driving, walking, cycling or rolling to school or work, make yourself easier to see, reduce speed when visibility is poor
        and expect other road users to be harder to spot.
      </p>
      <p>
        SD61 reports that 42% of crashes involving pedestrians happen between October and January, with an ICBC attribution. That statistic
        describes a broader B.C. pattern; it is not a claim about Shanaya&apos;s students or a prediction of an individual&apos;s risk.
      </p>

      <h2>A checklist for drivers</h2>
      <ul>
        <li>Turn on your headlights before the light fades.</li>
        <li>Slow down where visibility is reduced and scan for people crossing or walking near the road.</li>
        <li>Expect pedestrians and cyclists near schools, bus stops, crosswalks and driveways.</li>
        <li>Keep your attention on the road and put the phone away.</li>
        <li>Be ready to stop when a person&apos;s intention is unclear.</li>
        <li>Leave extra time for a dark, wet commute.</li>
      </ul>
      <p>
        ICBC also recommends low beams in fog or heavy snow and at least twice the normal braking distance on wet or slippery roads.
        Apply each instruction to the condition it covers.
      </p>

      <h2>A checklist for people walking, cycling or rolling</h2>
      <ul>
        <li>Wear bright or reflective clothing and use lights or reflectors where appropriate.</li>
        <li>Use the sidewalk or path when one is available.</li>
        <li>Make your intentions clear with eye contact or a signal, while still checking that traffic has stopped.</li>
        <li>Follow signs and road rules, especially at crossings and school entrances.</li>
        <li>Stay alert for vehicles turning across your path.</li>
      </ul>
      <p>
        Visibility is shared responsibility. Reflective clothing does not make a person invulnerable, and headlights do not remove a driver&apos;s duty
        to look carefully and yield when required.
      </p>

      <h2>A useful lesson topic</h2>
      <p>
        Learners can use a darker commute to practise scanning, speed choice, intersections, yielding and identifying vulnerable road users.
        Ask an instructor to explain what they are looking for, then practise one skill at a time. The goal is to build habits that work across
        Greater Victoria rather than memorise one school route. A practice session is not an official ICBC assessment, and no lesson guarantees a result.
      </p>
      <p>
        Read the <a href="https://www.sd61.bc.ca/news-events/news/title/lets-get-visible/" target="_blank" rel="noopener noreferrer">SD61 event notice</a> and
        <a href={icbcPoorConditionsUrl} target="_blank" rel="noopener noreferrer">ICBC&apos;s poor-conditions advice</a>. You can also review our{" "}
        <Link to="/driving-lessons-saanich">Saanich driving lessons</Link> and <Link to={roadTestPrepUrl}>Victoria road-test preparation</Link>, or{" "}
        <Link to={contactUrl}>contact the school</Link> with the skill you want to practise. Confirm the current instructor, service area, price and availability before booking.
      </p>
    </>
  ),
};

const redRibbonFaqs = [
  {
    question: "What should I do if I plan to drink or use cannabis?",
    answer: "Plan a safe ride before you go out. Leave the car at home, use transit or a taxi or ride-hailing service, stay with a sober designated driver or arrange an overnight stay.",
  },
  {
    question: "Can L and N drivers drive after drinking or using drugs?",
    answer: "ICBC says learner and novice drivers must have zero alcohol and zero drugs in their blood while driving. If there is any doubt about safety, do not drive.",
  },
  {
    question: "Does coffee or waiting make an impaired driver safe?",
    answer: "No. Coffee, food, a short nap or waiting for a particular number of hours does not turn an impaired driver into a safe driver. Arrange another way home.",
  },
];

export const projectRedRibbonPost: BlogPostData = {
  slug: "project-red-ribbon-sober-driving-pledge-victoria",
  title: "Project Red Ribbon: A Sober-Driving Pledge for Victoria Learners and Families",
  seoTitle: "Project Red Ribbon: Sober Driving in Victoria",
  description:
    "A practical sober-driving plan for Victoria learners and families, based on MADD Canada’s Project Red Ribbon and current ICBC guidance.",
  heroImage: "/landing/defensive-driving.webp",
  author: "Shanaya's Driving School",
  date: "November 1, 2026",
  datePublished: "2026-11-01",
  dateModified: "2026-11-01",
  readTime: "4 min read",
  category: "Driver Safety",
  relatedSlugs: ["defensive-driving", "parents-teen-drivers-victoria-bc-guide", "icbc-road-test-tips-victoria"],
  faqs: redRibbonFaqs,
  content: (
    <>
      <p>
        MADD Canada&apos;s Project Red Ribbon is a national holiday-season campaign reminding Canadians to never drive impaired and inviting people
        to take a sober-driving pledge. The campaign page does not establish a November 1 launch date, so this article uses the confirmed holiday-season
        message without assigning an unverified launch date.
      </p>

      <h2>Make the plan before the celebration</h2>
      <p>
        If your plans involve alcohol, cannabis or another drug, decide how you will get home before you go out. ICBC recommends leaving the car at home,
        taking transit or a taxi or ride-hailing service, or choosing a designated driver who will stay sober.
      </p>
      <p>
        For learners and novice drivers, the decision is even clearer. ICBC says L and N drivers must have zero alcohol and zero drugs in their blood while driving.
        If there is any doubt about your ability to drive safely, do not drive.
      </p>

      <h2>A simple sober-driving plan</h2>
      <ol>
        <li>Choose the person who will drive before the first drink or other intoxicant.</li>
        <li>Arrange a backup: transit, a taxi, a ride-hailing service, a friend or an overnight stay.</li>
        <li>Leave the vehicle at home if you might not be able to drive safely later.</li>
        <li>Keep the keys away from anyone who is impaired.</li>
        <li>If a friend has used alcohol, cannabis or another drug, help them find a safe ride without shaming them.</li>
      </ol>
      <p>
        Coffee, food, a short nap or waiting for a particular number of hours does not turn an impaired driver into a safe driver.
      </p>

      <h2>The pledge</h2>
      <blockquote>
        I will never drive impaired. I will plan a safe ride home, help my friends do the same and keep my keys away from anyone who cannot drive safely.
      </blockquote>
      <p>
        Take the official pledge through <a href="https://projectredribbon.ca/" target="_blank" rel="noopener noreferrer">MADD Canada&apos;s Project Red Ribbon</a>.
        For current B.C. guidance, read ICBC&apos;s pages on <a href="https://www.icbc.com/road-safety/crashes-happen/alcohol-impaired-driving" target="_blank" rel="noopener noreferrer">alcohol-impaired driving</a>
        and <a href="https://www.icbc.com/road-safety/crashes-happen/drug-impaired-driving" target="_blank" rel="noopener noreferrer">drug-impaired driving</a>.
      </p>

      <h2>A learner&apos;s perspective on safe habits</h2>
      <p>
        In a saved review snapshot, <strong>Violet Lily</strong> wrote that her instructor helped her “develop safe defensive driving habits.”
        That is one learner&apos;s experience, not evidence of a typical outcome or a substitute for the sober-driving plan above.
      </p>
      <figure className="my-7">
        <blockquote cite={googleReviewsUrl}>“develop safe defensive driving habits.”</blockquote>
        <figcaption className="text-sm">
          Violet Lily · saved customer review excerpt ·{" "}
          <a href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Read reviews on Google</a>
        </figcaption>
      </figure>
      <p>
        If you want structured practice with defensive habits, see our <Link to="/courses/defensive-driving-course">defensive-driving course</Link> or{" "}
        <Link to={contactUrl}>contact the school</Link> with questions about the current service, instructor and availability. No lesson replaces the decision
        to leave driving to a sober person when you are impaired.
      </p>
    </>
  ),
};
