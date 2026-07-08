import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type BlogPostData = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: ReactNode;
  relatedSlugs?: string[];
};

export const blogPosts: BlogPostData[] = [
  {
    slug: "how-to-pass-driving-test-victoria-bc",
    title: "How to Pass Your Driving Test in Victoria, BC",
    description:
      "A step-by-step guide to passing your ICBC driving test in Victoria, BC: what to bring, the vehicle check, how examiners score the drive, and what happens after.",
    heroImage:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1800&q=80",
    author: "Shanaya's Driving School",
    date: "July 5, 2026",
    readTime: "8 min read",
    category: "Road Test Guide",
    relatedSlugs: ["icbc-road-test-tips-victoria", "pass-road-test", "defensive-driving"],
    content: (
      <>
        <p>
          Passing your driving test in Victoria comes down to two things: being genuinely ready to
          drive, and knowing exactly what to expect on the day. This step-by-step guide walks you
          through the whole ICBC process, from booking to the moment the examiner hands you the
          result.
        </p>

        <h2>Step 1: Book the right ICBC test</h2>
        <p>
          There are two road tests in BC. The Class 7 test moves you from your learner (L) licence to
          novice (N), and the Class 5 test moves you from N to a full licence. Book the one that
          matches your stage at the Victoria-area test centre, and book early, since appointments
          fill up. Give yourself enough lead time to finish preparing.
        </p>

        <h2>Step 2: Bring the right documents and vehicle</h2>
        <p>
          On test day you will need your current licence, plus your glasses or contacts if you need
          them to drive. Your vehicle must be safe and road-legal, with valid insurance and working
          signals, brake lights, tires, seatbelts, and horn. Arrive a little early so you are not
          rushed.
        </p>

        <h2>Step 3: Expect a quick vehicle check</h2>
        <p>
          Before you drive, the examiner usually does a short safety check and may ask you to show
          your signals, brake lights, and horn, or point out controls like the defroster and hazard
          lights. Knowing where everything is keeps this part stress-free.
        </p>

        <h2>Step 4: Know how the drive is scored</h2>
        <p>
          During the drive the examiner watches your observation and shoulder checks, speed control,
          lane positioning, intersections, lane changes, and parking. Small errors add up, while a
          single dangerous action, such as failing to yield or a near-miss, can end the test early.
          Smooth, predictable, safe driving is what earns a pass.
        </p>

        <h2>Step 5: Practise real Victoria conditions</h2>
        <p>
          The best preparation is practice on the roads you will actually be tested on: the Saanich
          and Victoria test routes, downtown one-ways, hills, roundabouts, and busy cyclist areas.
          Our <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> is built around
          these exact routes, and our{" "}
          <Link to="/blog/icbc-road-test-tips-victoria">ICBC road test tips for Victoria</Link> cover
          the habits examiners reward.
        </p>

        <h2>Step 6: Stay calm on the day</h2>
        <p>
          Arrive early, set your mirrors and seat, and take a breath before each manoeuvre. Drive at
          a controlled pace and treat it like a normal lesson. Calm, methodical driving is exactly
          what the examiner wants to see.
        </p>

        <h2>What happens after the test</h2>
        <p>
          If you pass, the examiner reviews your result and you move to the next stage of the
          graduated licensing program. If you do not pass this time, you will get feedback on what to
          work on, and ICBC sets a minimum wait before you can rebook. Use that time for focused
          practice on the areas that cost you marks.
        </p>

        <blockquote>
          A pass is not luck. It is preparation plus knowing the process, so nothing on test day
          catches you off guard.
        </blockquote>

        <p>
          Ready to prepare the right way? Start with{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> or build your
          foundation with <Link to="/driving-lessons">driving lessons in Victoria</Link>, and book a
          mock test before your appointment.
        </p>
      </>
    ),
  },
  {
    slug: "icbc-road-test-tips-victoria",
    title: "ICBC Road Test Tips: Victoria, BC",
    description:
      "Local ICBC road test tips for Victoria and Saanich: the test routes, the manoeuvres examiners score, common mistakes to avoid, and how to stay calm on test day.",
    heroImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
    author: "Shanaya's Driving School",
    date: "July 5, 2026",
    readTime: "7 min read",
    category: "Road Test Tips",
    relatedSlugs: ["how-to-pass-driving-test-victoria-bc", "pass-road-test", "defensive-driving"],
    content: (
      <>
        <p>
          A Victoria road test is very passable once you know the local routes and practise the exact
          habits ICBC examiners look for. These are the tips our instructors share with students
          before test day at the Saanich and Victoria test centres.
        </p>

        <h2>1. Practise the Victoria and Saanich test routes</h2>
        <p>
          Most Victoria-area road tests run through Saanich and the streets around the test centre.
          Get comfortable on Douglas, Blanshard, Quadra, Shelbourne, and McKenzie, plus the nearby
          residential streets, school zones, and advanced-green intersections. Familiar roads mean
          fewer surprises on test day. Structured{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> is built around these
          exact routes.
        </p>

        <h2>2. Nail the manoeuvres examiners score</h2>
        <p>
          Most marks come from a short list of skills: smooth observation and shoulder checks,
          correct speed for each zone, safe lane changes, parallel and stall parking, and controlled
          hill starts. Practise each one until it feels automatic.
        </p>

        <h2>3. Respect Victoria's local challenges</h2>
        <ul>
          <li>Downtown one-way streets and busy pedestrian crossings</li>
          <li>Steep residential hills that call for confident hill starts and parking</li>
          <li>Heavy cyclist traffic and marked bike lanes across the city</li>
          <li>Roundabouts, where lane choice and signalling are watched closely</li>
          <li>Highway merging on Highway 1 if your route includes it</li>
        </ul>

        <h2>4. Avoid the mistakes that fail most tests</h2>
        <ul>
          <li>Missing shoulder checks before lane changes and pull-outs</li>
          <li>Rolling through stop signs instead of coming to a full stop</li>
          <li>Speeding in school and playground zones</li>
          <li>Not yielding to pedestrians and cyclists at crosswalks</li>
          <li>Drifting speed or lane position in steady traffic</li>
        </ul>

        <h2>5. Book a mock test on local routes</h2>
        <p>
          A mock road test on the real Victoria routes shows exactly where you stand and settles
          nerves before the appointment. It is the fastest way to turn practice into a confident
          pass.
        </p>

        <h2>6. Stay calm on test day</h2>
        <p>
          Arrive early, adjust your mirrors and seat, and take a breath before each manoeuvre. Drive
          at a pace that feels controlled, not rushed. Calm, methodical driving is exactly what
          examiners want to see.
        </p>

        <blockquote>
          Prepared drivers pass. The more your test day looks like your practice, the calmer you
          will be.
        </blockquote>

        <p>
          Ready to get test-ready? Explore{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> or start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>, and book a mock test on the
          routes you will actually drive.
        </p>
      </>
    ),
  },
  {
    slug: "pass-road-test",
    title: "How to Pass Your Road Test on the First Try",
    description:
      "Practical tips and common mistakes to avoid so you can walk out of ICBC with your licence in hand.",
    heroImage:
      "https://drivinginstructorblog.com/wp-content/uploads/2021/11/ROAD-TEST-TIPS-FROM-A-STUDENT-DRIVER.png",
    author: "Shanaya's Driving School",
    date: "March 1, 2026",
    readTime: "6 min read",
    category: "Road Test Tips",
    relatedSlugs: ["icbc-road-test-tips-victoria", "defensive-driving", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          Passing your road test on the first try is absolutely achievable when you know what to
          expect and have practiced the right way. Here are the key strategies our instructors share
          with every student before test day.
        </p>

        <h2>1. Know the Test Route</h2>
        <p>
          While the exact route may vary, most ICBC road tests follow similar patterns in your local
          area. Practice driving through common test zones - school zones, residential streets,
          intersections with advanced greens, and areas with high pedestrian traffic.
        </p>

        <h2>2. Master the Basics</h2>
        <p>
          Examiners look for smooth vehicle control, proper mirror checks, shoulder checks, and
          consistent speed management. These fundamentals account for the majority of test marks.
        </p>

        <h2>3. Stay Calm and Focused</h2>
        <p>
          Nervousness causes rushed decisions. Take a breath before each manoeuvre, check your
          mirrors methodically, and drive at a pace that feels controlled - not hurried.
        </p>

        <h2>4. Avoid Common Mistakes</h2>
        <ul>
          <li>Forgetting shoulder checks before lane changes</li>
          <li>Rolling through stop signs</li>
          <li>Speeding in school or playground zones</li>
          <li>Not yielding to pedestrians at crosswalks</li>
          <li>Improper hand position on the steering wheel</li>
        </ul>

        <h2>5. Take a Mock Test</h2>
        <p>
          A mock road test with your instructor simulates the real experience. It highlights weak
          spots and builds the confidence you need to perform calmly on the actual day.
        </p>

        <blockquote>
          "Practice doesn't make perfect - it makes <strong>prepared</strong>."
        </blockquote>

        <p>
          At Shanaya's Driving School, our structured road test preparation has helped hundreds of
          students pass on their first attempt. Book a lesson today and let us help you get there.
        </p>
      </>
    ),
  },
  {
    slug: "defensive-driving",
    title: "Defensive Driving: Skills That Keep You Safe",
    description:
      "Learn the core defensive driving habits our instructors teach every student - from hazard scanning to safe following distances.",
    heroImage:
      "https://media-blog.zutobi.com/wp-content/uploads/sites/2/2021/06/14165940/WHAT-IS-DEFENSIVE-DRIVING-scaled.jpg",
    author: "Shanaya's Driving School",
    date: "February 20, 2026",
    readTime: "5 min read",
    category: "Driving Skills",
    relatedSlugs: ["pass-road-test", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          Defensive driving is about anticipating hazards before they become emergencies. It's the
          difference between reacting and being prepared.
        </p>

        <h2>What Is Defensive Driving?</h2>
        <p>
          Defensive driving means staying aware of your surroundings, predicting what other drivers
          might do, and keeping a safe margin of error at all times.
        </p>

        <h2>Key Habits to Develop</h2>
        <ul>
          <li>
            <strong>Scan ahead:</strong> Look 12-15 seconds down the road, not just at the car in
            front of you.
          </li>
          <li>
            <strong>Check mirrors frequently:</strong> Every 5-8 seconds, glance at your mirrors to
            stay aware of traffic around you.
          </li>
          <li>
            <strong>Maintain safe following distance:</strong> Keep at least 3 seconds of space
            between you and the vehicle ahead.
          </li>
          <li>
            <strong>Expect the unexpected:</strong> Assume other drivers may make mistakes - be
            ready to respond safely.
          </li>
        </ul>

        <h2>Why It Matters</h2>
        <p>
          Defensive driving reduces accidents, lowers insurance costs, and builds the kind of
          confidence that lasts a lifetime. It's a core part of every lesson at Shanaya's Driving
          School.
        </p>
      </>
    ),
  },
  {
    slug: "newcomers-guide-bc",
    title: "A Newcomer's Guide to Driving in BC",
    description:
      "Moving to British Columbia? Here's everything you need to know about getting your BC driver's licence and staying road-legal.",
    heroImage:
      "https://imgv2-2-f.scribdassets.com/img/document/590636925/original/b9ac4ae164/1?v=1",
    author: "Shanaya's Driving School",
    date: "February 10, 2026",
    readTime: "7 min read",
    category: "Newcomer Resources",
    relatedSlugs: ["pass-road-test", "defensive-driving"],
    content: (
      <>
        <p>
          If you've recently moved to British Columbia, understanding the local driving rules and
          licensing process is one of the first things to take care of. Here's a clear guide to help
          you get started.
        </p>

        <h2>Step 1: Visit an ICBC Driver Licensing Office</h2>
        <p>
          Within 90 days of becoming a BC resident, you must obtain a BC driver's licence. Bring
          your current licence, two pieces of ID, and proof of residency.
        </p>

        <h2>Step 2: Understand the Graduated Licensing Program</h2>
        <p>
          BC uses a graduated licensing system (GLP). Depending on your existing experience, you may
          need to complete the Learner (L) and Novice (N) stages before receiving a full licence.
        </p>

        <h2>Step 3: Learn BC-Specific Rules</h2>
        <ul>
          <li>Right turns on red are allowed (unless posted otherwise)</li>
          <li>School zones are 30 km/h during posted hours</li>
          <li>Playground zones are 30 km/h dawn to dusk</li>
          <li>Distracted driving laws are strictly enforced</li>
          <li>Winter tires are required on many highways from October to April</li>
        </ul>

        <h2>Step 4: Consider Professional Lessons</h2>
        <p>
          Even experienced international drivers benefit from professional lessons to understand
          local road culture, signage differences, and defensive driving techniques used in BC.
        </p>

        <blockquote>
          "Learning the local rules is the fastest way to feel confident on BC roads."
        </blockquote>
      </>
    ),
  },
];
