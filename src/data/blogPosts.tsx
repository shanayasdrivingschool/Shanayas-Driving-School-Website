import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export type BlogPostData = {
  slug: string;
  title: string;
  /* Overrides the <title> tag when the reader-facing headline plus the brand
     suffix would truncate in search results. Must match the matching entry in
     scripts/generate-static-seo-pages.mjs. */
  seoTitle?: string;
  description: string;
  heroImage: string;
  author: string;
  /* Human-readable date shown in the UI. */
  date: string;
  /* ISO 8601 dates for Article schema. Keep in sync with `date`, which renders
     as the "Updated" line, so it should match dateModified. */
  datePublished: string;
  dateModified: string;
  readTime: string;
  category: string;
  content: ReactNode;
  relatedSlugs?: string[];
};

export const blogPosts: BlogPostData[] = [
  {
    slug: "bc-glp-changes-2026",
    title: "BC Is Removing the Second Road Test: What Changes on October 19, 2026",
    seoTitle: "BC Second Road Test Removed: GLP Changes Oct 19, 2026",
    description:
      "ICBC is replacing BC's second road test with a Driving Record Assessment on October 19, 2026. What changes, who it affects, and what to do now.",
    heroImage: "/landing/bc-graduated-licensing-program.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    readTime: "9 min read",
    category: "ICBC Updates",
    relatedSlugs: ["how-to-pass-driving-test-victoria-bc", "icbc-road-test-tips-victoria", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          On July 20, 2026, the Government of British Columbia and ICBC announced the largest change
          to the Graduated Licensing Program (GLP) in more than 25 years. The headline: the{" "}
          <strong>second road test is being removed</strong>. From{" "}
          <strong>October 19, 2026</strong>, drivers will move from a novice licence to a Class 5
          through a records check rather than a second drive with an examiner.
        </p>
        <p>
          Below is a plain-language breakdown of what is changing, who it affects, and the steps
          worth taking before October. Everything here is drawn from the official Government of B.C.
          news release and ICBC's own GLP changes page, both linked at the end.
        </p>

        <h2>The short version</h2>
        <ul>
          <li>
            The second road test (novice to Class 5) is replaced by an in-office{" "}
            <strong>Driving Record Assessment</strong>, which checks your record rather than your
            driving.
          </li>
          <li>
            Passing it no longer gives you an unrestricted licence. You get a Class 5 with a{" "}
            <strong>12-month zero alcohol and drug restriction</strong> first.
          </li>
          <li>
            Drivers <strong>25 and older</strong> get a shorter path: nine months in the learner
            stage instead of 12, and 12 months as a novice instead of 24.
          </li>
          <li>
            For drivers <strong>under 25, the timeline does not change</strong>. It is still 12
            months as a learner and 24 months as a novice, reduced to 18 with an approved GLP
            course.
          </li>
          <li>
            The first road test, the one that takes you from L to N, is{" "}
            <strong>not going anywhere</strong>. It is now the only road test in the program.
          </li>
        </ul>

        <h2>What the Driving Record Assessment actually is</h2>
        <p>
          It is not a driving test. It is an in-office check of your driving record to confirm you
          have spent the required time driving safely. To upgrade from a Class 7 or 7,8 licence to a
          Class 5 or 5,6, ICBC states you must meet <em>all</em> of the following:
        </p>
        <ul>
          <li>
            <strong>At least 24 months of safe driving if you are under 25</strong>, or 18 months if
            you completed an approved GLP course during your learner stage.
          </li>
          <li>
            <strong>At least 12 months of safe driving if you are 25 or older.</strong>
          </li>
          <li>
            <strong>No convictions</strong> for excessive speed or use of electronic devices during
            that period.
          </li>
          <li>
            <strong>No prohibitions or suspensions</strong> during that period.
          </li>
        </ul>
        <p>
          The trade-off is worth understanding. You no longer have to perform on one nerve-wracking
          morning, but your record now has to stay clean for a two-year stretch. A single excessive
          speeding ticket or distracted driving conviction can restart the novice period. Under the
          old system, a bad ticket was a fine. Under the new one, it can cost you years.
        </p>

        <h2>The new stages, side by side</h2>
        <p>
          The old model had three stages. The new one has four, because the Class 5 you receive
          after the assessment comes with strings attached for the first year.
        </p>
        <h3>The old model</h3>
        <ol>
          <li>Learner (Class 7L), 12 months</li>
          <li>First road test, then Novice (Class 7), 24 months, or 18 with an approved course</li>
          <li>Second road test, then full Class 5 with no restrictions</li>
        </ol>
        <h3>The new model, drivers under 25</h3>
        <ol>
          <li>Learner, 12 months</li>
          <li>First road test, then Novice, 24 months, or 18 with an approved GLP course</li>
          <li>Driving Record Assessment, then Class 5 with a zero alcohol and drug restriction for 12 months</li>
          <li>Class 5 without the restriction</li>
        </ol>
        <h3>The new model, drivers 25 and older</h3>
        <ol>
          <li>Learner, 9 months</li>
          <li>First road test, then Novice, 12 months</li>
          <li>Driving Record Assessment, then Class 5 with a zero alcohol and drug restriction for 12 months</li>
          <li>Class 5 without the restriction</li>
        </ol>

        <h2>If you have a road test booked for on or after October 19</h2>
        <p>
          It will be cancelled. ICBC has confirmed that second road tests scheduled on or after
          October 19, 2026 will be cancelled automatically, and that affected drivers will receive an
          email confirming the cancellation and explaining the next steps.
        </p>
        <p>
          You are not losing anything by having it cancelled, since the assessment replaces it. But
          if you would rather finish under the current process, you can still take a Class 5 road
          test <strong>before</strong> October 19. Appointments in the Victoria area book up well in
          advance, so that window is narrower than it looks.
        </p>

        <blockquote>
          If you are close to eligible and want your Class 5 the old way, book now. If you are not
          close, there is nothing to rush, because the assessment will be waiting for you.
        </blockquote>

        <h2>The changes that make learning more accessible</h2>
        <p>Alongside the road test change, several rules are loosening:</p>
        <ul>
          <li>
            <strong>Supervisor age drops from 25 to 22.</strong> More people in your life can legally
            supervise your practice driving, which is a real difference for families where no one
            was old enough before.
          </li>
          <li>
            <strong>The age of consent to apply for a licence drops from 19 to 18</strong>, so more
            young adults can apply independently.
          </li>
          <li>
            <strong>Passenger restrictions gain an immediate family exemption</strong>, which helps
            novice drivers in larger families.
          </li>
          <li>
            <strong>The Province says the Driving Record Assessment will be available at Service BC
            offices, driver licensing agent offices and ICBC driver licensing offices</strong>,
            reducing travel for people in rural and remote communities. ICBC's own page is narrower
            on this point, so see the note at the end of this article before you travel to a
            non-ICBC location.
          </li>
        </ul>
        <p>
          The Province has been explicit that a major goal here is access for First Nations, rural
          and remote communities, where getting to a road test appointment has been a genuine
          barrier.
        </p>

        <h2>What ICBC told driving schools</h2>
        <p>
          As an ICBC-recognised driving school, we also received the July 2026 driver training
          industry bulletin, which included a few operational details worth passing along:
        </p>
        <ul>
          <li>
            The <strong>road test fee rises from $35 to $50</strong>. ICBC describes this as a $35
            saving because you no longer pay for a second test. Netted against the higher fee, the
            real difference is about $20: two tests at $35 used to cost $70, and one test at $50 now
            costs $50.
          </li>
          <li>
            The <strong>Class 5/7 marking sheet moves to a demerit-based approach</strong> with error
            cut-offs that flag poor driving behaviours.
          </li>
          <li>
            <strong>Road test appointments get five extra minutes</strong> so examiners can give more
            feedback. The drive itself is not getting longer.
          </li>
          <li>
            Starting in <strong>early fall 2026</strong>, drivers currently in the GLP will receive
            letters from ICBC explaining how they are affected.
          </li>
        </ul>
        <p>
          The Province has also indicated that some eligible drivers may qualify for a{" "}
          <strong>one-time automatic upgrade</strong> from Class 7 to Class 5 without needing to
          complete an in-office assessment. Details on exactly who qualifies had not been published
          at the time of writing, so watch for your ICBC letter.
        </p>

        <h2>Why the approved GLP course matters more now, not less</h2>
        <p>
          It would be easy to read "the second road test is gone" as "driver training matters less."
          The opposite is true, for three reasons.
        </p>
        <p>
          <strong>First, the course discount is now the only shortcut left in the program.</strong>{" "}
          For drivers under 25, completing an ICBC-approved GLP course during the learner stage cuts
          the novice period from 24 months to 18. That is six months earlier to a Class 5, and it is
          the single remaining way to move faster.
        </p>
        <p>
          Two conditions are worth reading carefully. ICBC specifies the course must be completed{" "}
          <strong>during the learner phase</strong>, so leaving it until after your first road test
          may mean it does not count. And the industry bulletin is blunt that if you{" "}
          <strong>start but do not finish</strong> an approved course, you still owe the full 24
          months. Enrolling is not enough. Finishing is.
        </p>
        <p>
          <strong>Second, your record now carries the weight the exit test used to.</strong> There is
          no longer a final exam where good driving can prove itself. Instead, two years of clean
          driving is the proof. Habits built early are what protect that record.
        </p>
        <p>
          <strong>Third, the one remaining road test is now the whole gate.</strong> Failing the
          Class 7 test costs you time and a rebooking fee, and it is the only driving assessment
          standing between you and a licence. Preparing properly for it matters more than it did when
          there was a second chance later.
        </p>

        <h2>What to do now</h2>
        <ol>
          <li>
            <strong>If you are a learner under 25:</strong> get into an approved GLP course during
            your learner stage and finish it. Six months is a meaningful head start.
          </li>
          <li>
            <strong>If you are a learner 25 or older:</strong> you reach a Class 5 about 15 months
            sooner, in 21 months instead of 36. Note that it is a restricted Class 5, so the fully
            unrestricted licence arrives at 33 months rather than 36. Focus on the first road test,
            since it is the only one you will take.
          </li>
          <li>
            <strong>If you are a novice with a Class 5 test booked before October 19:</strong> decide
            whether to keep it or let the assessment handle it. Either route works.
          </li>
          <li>
            <strong>If you are a novice with a test booked on or after October 19:</strong> expect
            the cancellation email and confirm your assessment eligibility date.
          </li>
          <li>
            <strong>Everyone:</strong> protect your record. Excessive speeding and phone-use
            convictions now carry consequences they did not before.
          </li>
        </ol>

        <h2>What this means in Greater Victoria</h2>
        <p>
          The rules are province-wide, but a few effects land differently depending on where you
          learn to drive.
        </p>
        <p>
          <strong>The Victoria and Saanich test routes matter more than they used to.</strong> With
          the second road test gone, the Class 7 test on those routes becomes the only time an
          examiner ever assesses your driving. The hills, one-way streets, roundabouts, and heavy
          cyclist traffic that make the local routes demanding are now the whole gate rather than the
          first of two. If you are learning in Victoria, Saanich, Langford, or Colwood, that is an
          argument for preparing on the actual routes rather than generally.
        </p>
        <p>
          <strong>The booking squeeze is local.</strong> If you want to finish under the old process,
          you need a Class 5 test before October 19, and Greater Victoria appointments are booked
          well ahead at the best of times. Expect that to get worse as the date approaches and
          eligible novice drivers try to get in ahead of the change.
        </p>
        <p>
          <strong>Island and Westshore drivers gain the most.</strong> The Province was explicit that
          a major goal is reducing travel for people in rural, remote, and Indigenous communities.
          For students on Salt Spring Island, or out in Sooke and Metchosin, the difference between
          booking a road test appointment and completing an in-office records check is real time and
          ferry cost saved.
        </p>

        <h2>Where to get help</h2>
        <p>
          We teach the ICBC-approved course path and the first road test that now decides everything.
          Start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>, sharpen up with{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link>, or read our overview
          of the{" "}
          <Link to="/bc-graduated-licensing-program">BC Graduated Licensing Program</Link> to see
          where you sit today. If you are unsure which stage applies to you, our{" "}
          <Link to="/course-quiz">course quiz</Link> will point you at the right starting place.
        </p>
        <p>
          One practical note. ICBC's page says you will be able to book a Driving Record Assessment
          appointment online at ICBC driver licensing offices, while the Province's release says the
          assessment will be available at Service BC and driver licensing agent offices too. If you
          plan to use a Service BC or agent location, confirm with ICBC directly before travelling.
        </p>

        <h2>Sources</h2>
        <p>
          This article is based on the following official announcements, both published July 20,
          2026:
        </p>
        <ul>
          <li>
            Government of British Columbia,{" "}
            <a
              href="https://news.gov.bc.ca/releases/2026PSSG0061-000847"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Supporting road safety, streamlining licensing for new drivers"
            </a>{" "}
            (news release, Ministry of Public Safety and Solicitor General)
          </li>
          <li>
            ICBC,{" "}
            <a
              href="https://icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Changes are coming to the Graduated Licensing Program"
            </a>
          </li>
          <li>
            ICBC, <em>Driver training news</em> bulletin to driver training schools, July 20, 2026
          </li>
        </ul>
        <p>
          Rules and dates can be updated by ICBC after publication. Always confirm your own
          requirements with ICBC before booking or making decisions about your licence. This page was
          last updated on July 21, 2026.
        </p>
      </>
    ),
  },
  {
    slug: "how-to-pass-driving-test-victoria-bc",
    title: "How to Pass Your Driving Test in Victoria, BC",
    description:
      "A step-by-step guide to passing your ICBC driving test in Victoria, BC: what to bring, the vehicle check, and how examiners score the drive.",
    heroImage:
      "/blog/how-to-pass-driving-test-victoria-bc.webp",
    author: "Shanaya's Driving School",
    date: "July 5, 2026",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    readTime: "8 min read",
    category: "Road Test Guide",
    relatedSlugs: ["bc-glp-changes-2026", "icbc-road-test-tips-victoria", "pass-road-test"],
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
          There are two road tests in BC, though that changes on October 19, 2026, when the Class 5
          test is replaced by a records check. See{" "}
          <Link to="/blog/bc-glp-changes-2026">what changes on October 19, 2026</Link> if that date
          affects you. The Class 7 test moves you from your learner (L) licence to
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

        <h2>Where to get help</h2>
        <p>
          Ready to prepare the right way? Start with{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> or build your
          foundation with <Link to="/driving-lessons">driving lessons in Victoria</Link>, and book a
          mock test before your appointment.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Book a road test"
            </a>
          </li>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Graduated-licensing"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Graduated licensing"
            </a>
          </li>
        </ul>
        <p>
          ICBC can change requirements, fees, and booking rules after publication. Always confirm the
          current details with ICBC before booking. This page was last updated on July 5, 2026.
        </p>
      </>
    ),
  },
  {
    slug: "icbc-road-test-tips-victoria",
    title: "ICBC Road Test Tips: Victoria, BC",
    description:
      "Local ICBC road test tips for Victoria and Saanich: the test routes, the manoeuvres examiners score, and the common mistakes to avoid.",
    heroImage:
      "/blog/icbc-road-test-tips-victoria.webp",
    author: "Shanaya's Driving School",
    date: "July 5, 2026",
    datePublished: "2026-07-05",
    dateModified: "2026-07-05",
    readTime: "7 min read",
    category: "Road Test Tips",
    relatedSlugs: ["bc-glp-changes-2026", "how-to-pass-driving-test-victoria-bc", "pass-road-test"],
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

        <h2>Where to get help</h2>
        <p>
          Ready to get test-ready? Explore{" "}
          <Link to="/road-test-prep-victoria">road test prep in Victoria</Link> or start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>, and book a mock test on the
          routes you will actually drive.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Book a road test"
            </a>
          </li>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Graduated-licensing"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Graduated licensing"
            </a>
          </li>
        </ul>
        <p>
          ICBC can change requirements, fees, and booking rules after publication. Always confirm the
          current details with ICBC before booking. This page was last updated on July 5, 2026.
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
      "/blog/road-test-tips.webp",
    author: "Shanaya's Driving School",
    date: "March 1, 2026",
    datePublished: "2026-03-01",
    dateModified: "2026-03-01",
    readTime: "6 min read",
    category: "Road Test Tips",
    relatedSlugs: ["bc-glp-changes-2026", "icbc-road-test-tips-victoria", "newcomers-guide-bc"],
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

        <h2>Where to get help</h2>
        <p>
          At Shanaya's Driving School, our structured road test preparation has helped hundreds of
          students pass on their first attempt. Explore{" "}
          <Link to="/road-test-prep">ICBC road test preparation</Link> or start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>, and book a mock test before
          your appointment.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Book a road test"
            </a>
          </li>
        </ul>
        <p>
          ICBC can change requirements, fees, and booking rules after publication. Always confirm the
          current details with ICBC before booking. This page was last updated on March 1, 2026.
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
      "/blog/what-is-defensive-driving.webp",
    author: "Shanaya's Driving School",
    date: "February 20, 2026",
    datePublished: "2026-02-20",
    dateModified: "2026-02-20",
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

        <blockquote>
          Defensive driving is the difference between reacting and being prepared.
        </blockquote>

        <h2>Where to get help</h2>
        <p>
          Every lesson we teach builds these habits. Explore our{" "}
          <Link to="/defensive-driving">defensive driving course</Link> or start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Learn to Drive Smart"
            </a>
          </li>
        </ul>
        <p>
          ICBC can update its guidance after publication. Always confirm current road rules with
          ICBC. This page was last updated on February 20, 2026.
        </p>
      </>
    ),
  },
  {
    slug: "newcomers-guide-bc",
    title: "New to BC? Driving Rules Newcomers Should Know",
    description:
      "New to BC? The road rules that catch newcomers off guard: right turns on red, 30 km/h school zones, winter tires, distracted driving, and licensing.",
    heroImage:
      "/blog/newcomers-guide-bc.webp",
    author: "Shanaya's Driving School",
    date: "February 10, 2026",
    datePublished: "2026-02-10",
    dateModified: "2026-02-10",
    readTime: "7 min read",
    category: "Newcomer Resources",
    relatedSlugs: ["pass-road-test", "defensive-driving"],
    content: (
      <>
        <p>
          If you've recently moved to British Columbia, understanding the local driving rules and
          licensing process is one of the first things to take care of. Here's a clear guide to help
          you get started. For the full step-by-step licensing walkthrough, see our{" "}
          <Link to="/newcomers-guide">BC driver's licence guide for newcomers</Link>.
        </p>

        <h2>Step 1: Visit an ICBC Driver Licensing Office</h2>
        <p>
          Within 90 days of becoming a BC resident, you must obtain a BC driver's licence. Bring
          your current licence, two pieces of ID, and proof of residency.
        </p>

        <h2>Step 2: Understand the Graduated Licensing Program</h2>
        <p>
          BC uses a graduated licensing system (GLP). Depending on your existing experience, you may
          need to complete the Learner (L) and Novice (N) stages before receiving a full licence. See
          our{" "}
          <Link to="/bc-graduated-licensing-program">BC Graduated Licensing Program guide</Link> for
          the full stage-by-stage breakdown.
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

        <h2>Where to get help</h2>
        <p>
          We teach new arrivals every week. Start with{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link>, or read the full{" "}
          <Link to="/newcomers-guide">BC licensing guide for newcomers</Link> for the
          stage-by-stage process.
        </p>

        <h2>Sources</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Graduated-licensing"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Graduated licensing"
            </a>
          </li>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
              target="_blank"
              rel="noopener noreferrer"
            >
              "Learn to Drive Smart"
            </a>
          </li>
        </ul>
        <p>
          Licensing rules can change after publication, and BC's Graduated Licensing Program is being
          updated on October 19, 2026. See{" "}
          <Link to="/blog/bc-glp-changes-2026">what changes on October 19, 2026</Link>, and confirm
          your own requirements with ICBC. This page was last updated on February 10, 2026.
        </p>
      </>
    ),
  },
];
