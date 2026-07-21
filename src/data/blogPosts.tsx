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
    title: "B.C. GLP Changes on October 19, 2026: Second Road Test, DRA and New Timelines",
    seoTitle: "B.C. GLP Changes: What Starts October 19, 2026",
    description:
      "A sourced guide to B.C.'s October 19, 2026 GLP changes: the Driving Record Assessment, age-based timelines, restricted Class 5 stage and transition rules.",
    heroImage: "/landing/bc-graduated-licensing-program.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-07-21",
    dateModified: "2026-07-21",
    readTime: "8 min read",
    category: "ICBC Updates",
    relatedSlugs: ["how-to-pass-driving-test-victoria-bc", "icbc-road-test-tips-victoria", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          B.C.'s Graduated Licensing Program (GLP) changes on <strong>October 19, 2026</strong>. On that
          date, eligible drivers with a Class 7 novice or Class 7, 8 novice licence will use a{" "}
          <strong>Driving Record Assessment (DRA)</strong> instead of a second road test to move to a
          Class 5 or Class 5, 6 licence with restrictions. The Class 7 road test from learner to
          novice remains part of the program. These details come from{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
            target="_blank"
            rel="noopener noreferrer"
          >
            ICBC's GLP changes page
          </a>{" "}
          and the{" "}
          <a
            href="https://news.gov.bc.ca/releases/2026PSSG0061-000847"
            target="_blank"
            rel="noopener noreferrer"
          >
            Government of B.C. announcement
          </a>.
        </p>
        <p>
          This article explains the public rules available on July 21, 2026. Your age, current
          licence, driving record and the date of any booked test can change how the transition
          applies to you, so use ICBC's page to confirm your individual requirements.
        </p>

        <h2>What changes on October 19</h2>
        <ul>
          <li>
            <strong>The learner-to-novice road test stays.</strong> The DRA replaces the second road
            test for eligible novice drivers.
          </li>
          <li>
            <strong>The first Class 5 is restricted for 12 months.</strong> Restriction 55 requires
            zero blood alcohol and zero blood drug content while driving.
          </li>
          <li>
            <strong>Drivers under 25</strong> keep a 12-month learner stage and a 24-month novice
            stage, or 18 months as a novice if they complete an ICBC-approved GLP course and satisfy
            its other conditions. The new restricted-Class-5 year comes after that.
          </li>
          <li>
            <strong>Drivers 25 and older</strong> have a nine-month learner stage, a 12-month novice
            stage and then the 12-month restricted-Class-5 stage.
          </li>
          <li>
            <strong>Second road tests booked for October 19 or later will be cancelled.</strong> ICBC
            says it will email affected drivers with next steps.
          </li>
        </ul>

        <h2>Driving Record Assessment eligibility</h2>
        <p>
          A DRA is an in-office review of your driving record, not an on-road test. According to{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
            target="_blank"
            rel="noopener noreferrer"
          >
            ICBC's published criteria
          </a>, you must meet all of the following to upgrade:
        </p>
        <ul>
          <li>
            If you are under 25: at least 24 months of safe driving, or 18 months if you completed an
            ICBC-approved GLP course during the learner stage.
          </li>
          <li>If you are 25 or older: at least 12 months of safe driving.</li>
          <li>No convictions for excessive speed or use of electronic devices during that time.</li>
          <li>No driving prohibitions or suspensions during that time.</li>
        </ul>
        <p>
          Tickets already have consequences under the current GLP. ICBC says even one ticket may
          trigger a record review and a possible prohibition, and the{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-full-licence"
            target="_blank"
            rel="noopener noreferrer"
          >
            current Class 5 eligibility rule
          </a>{" "}
          requires 24 consecutive months without a prohibition. RoadSafetyBC also applies its Driver
          Improvement Program at lower point levels for new drivers. The new rule is more specific:
          an excessive-speed or electronic-device conviction during the required DRA period prevents
          the driver from meeting the published criteria. Do not assume that another type of ticket
          has no consequence; check your record and ask ICBC about your eligibility. See ICBC's{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-L"
            target="_blank"
            rel="noopener noreferrer"
          >
            GLP penalty guidance
          </a>{" "}
          and the Province's{" "}
          <a
            href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/high-risk-driver/driver-improvement"
            target="_blank"
            rel="noopener noreferrer"
          >
            Driver Improvement Program
          </a>.
        </p>

        <h2>How long until an unrestricted Class 5?</h2>
        <p>
          The table below adds the minimum published stages for a new driver who progresses without
          an interruption. It does not include extra time caused by waiting, an unsuccessful road
          test, a prohibition, suspension or a disqualifying conviction.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table>
            <caption>
              Each row is one step of the licensing path, in order. The Stage column says whether
              that step is waiting time or a test, and the three columns beside it show what applies
              to you.
            </caption>
            <thead>
              <tr>
                <th scope="col">Stage</th>
                <th scope="col">Old model</th>
                <th scope="col">New model, under 25</th>
                <th scope="col">New model, 25 and older</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  Class 7L learner
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    Waiting time. The minimum you must hold the learner licence before you may book
                    the Class 7 road test. You drive only with a qualified supervisor beside you.
                  </span>
                </th>
                <td>12 months</td>
                <td>12 months</td>
                <td>9 months</td>
              </tr>
              <tr>
                <th scope="row">
                  Learner to novice
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    A test, not waiting time. Passing it lets you start driving on your own. This
                    step does not change on October 19, 2026.
                  </span>
                </th>
                <td>Class 7 road test</td>
                <td>Class 7 road test</td>
                <td>Class 7 road test</td>
              </tr>
              <tr>
                <th scope="row">
                  Class 7 novice
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    Waiting time. The minimum you must hold the novice licence before you can move
                    up. You drive alone, display an "N" sign and follow passenger limits.
                  </span>
                </th>
                <td>24 months, or 18 with an ICBC-approved GLP course</td>
                <td>24 months, or 18 with an ICBC-approved GLP course</td>
                <td>12 months</td>
              </tr>
              <tr>
                <th scope="row">
                  Novice to Class 5
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    A step, not waiting time. It removes the "N". Before the change it is a second
                    drive with an examiner; afterwards it is an in-office check of your driving
                    record, with no driving at all.
                  </span>
                </th>
                <td>Second road test</td>
                <td>Driving Record Assessment</td>
                <td>Driving Record Assessment</td>
              </tr>
              <tr>
                <th scope="row">
                  Class 5 with restriction 55
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    Waiting time, and a brand new stage. The minimum you must hold a Class 5 that
                    requires zero alcohol and zero drugs while driving, before that restriction
                    lifts.
                  </span>
                </th>
                <td>Did not exist</td>
                <td>12 months</td>
                <td>12 months</td>
              </tr>
              <tr>
                <th scope="row">
                  Total to an unrestricted Class 5
                  <span className="mt-1 block text-sm font-normal text-slate-500">
                    All the waiting times added together, from your first day as a learner to a
                    licence with no GLP conditions left.
                  </span>
                </th>
                <td>36 months, or 30 with an ICBC-approved GLP course</td>
                <td>48 months, or 42 with an ICBC-approved GLP course</td>
                <td>33 months</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          For drivers under 25, that is 48 months from the start of the learner stage to an
          unrestricted Class 5 using the ordinary minimums, or 42 months if the driver qualifies for
          the six-month approved-course reduction. The under-25 learner and novice minimums do not
          change, but the new 12-month restricted-Class-5 stage means the time to an{" "}
          <em>unrestricted</em> licence does change.
        </p>
        <p>
          For drivers 25 and older, adding those minimum stages gives 33 months to an unrestricted
          Class 5. The Province's{" "}
          <a
            href="https://news.gov.bc.ca/releases/2026PSSG0061-000847"
            target="_blank"
            rel="noopener noreferrer"
          >
            official backgrounder
          </a>{" "}
          sets out both age-based paths. Totals in the table are the sum of the published stage
          minimums, not a figure ICBC publishes directly.
        </p>

        <h2>What restriction 55 means</h2>
        <p>
          After a successful DRA, the Class 5 licence has restriction 55: zero blood alcohol and zero
          blood drug content while driving. ICBC says the expiry date will appear on the back of the
          licence and the restriction expires automatically after 12 months. No separate removal
          appointment is required.
        </p>
        <p>
          If the driver receives a prohibition or suspension before the restriction expires, the full
          12-month period restarts on the date the licence is reinstated. This reset is narrower than
          saying every ticket automatically restarts the restriction. Read ICBC's{" "}
          <a
            href="https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7-licence-and-youre-under-25"
            target="_blank"
            rel="noopener noreferrer"
          >
            restriction 55 explanation
          </a>{" "}
          and contact ICBC if a violation appears on your record.
        </p>

        <h2>If your second road test is booked around the change</h2>
        <p>
          ICBC says a second road test booked for <strong>October 19, 2026 or later</strong> will be
          cancelled and it will email the driver with next steps. Until the change takes effect, an
          eligible novice driver can still choose to take the second road test.
        </p>
        <p>
          The two outcomes are not identical. Under the existing model, passing a Class 5 road test
          before October 19 leads to an unrestricted Class 5. Under the new model, an eligible driver
          completes the DRA and then holds a Class 5 with restriction 55 for 12 months. Before
          changing or keeping an appointment, confirm your eligibility and options with ICBC; this
          article cannot determine which choice is suitable for an individual driver.
        </p>

        <h2>Passenger, supervisor and consent changes</h2>
        <ul>
          <li>
            <strong>Learner passengers:</strong> a Class 7L learner currently may carry one passenger
            in addition to the required supervisor. From October 19, the learner may carry more than
            one passenger only when all passengers other than the supervisor are immediate family.
            This is the new family exception described on ICBC's{" "}
            <a
              href="https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7l-licence"
              target="_blank"
              rel="noopener noreferrer"
            >
              Class 7L page
            </a>.
          </li>
          <li>
            <strong>Novice passengers:</strong> Class 7 novice drivers already have an immediate-family
            exception. Their existing rule allows one passenger unless all passengers are immediate
            family or a qualified supervisor is seated beside the driver.
          </li>
          <li>
            <strong>Supervisors:</strong> from October 19, the minimum age drops from 25 to 22. ICBC
            says the supervisor must have an unrestricted Class 5 licence, be legally able to drive
            and sit beside the learner or novice driver.
          </li>
          <li>
            <strong>Consent:</strong> the age at which a person can apply for a driver's licence without
            parental or guardian consent drops from 19 to 18.
          </li>
        </ul>

        <h2>Other transition details</h2>
        <p>
          The Province says some drivers who are already in the GLP may qualify for a one-time
          automatic upgrade from Class 7 to Class 5 without an in-office DRA. Its July 20 announcement
          does not define the eligible group. It says ICBC will begin sending letters in early fall
          2026 explaining how current GLP drivers are affected. Rely on that notice or confirm
          directly with ICBC rather than assuming an automatic upgrade.
        </p>
        <p>
          The B.C. release says DRAs will be available at Service BC offices, driver licensing agent
          offices and ICBC driver licensing offices. ICBC's booking instructions say online DRA
          appointments can be made only for an ICBC driver licensing office, not for Service BC or a
          driver licensing agent; walk-in service is also described. Confirm service availability at
          the location before travelling.
        </p>

        <h2>Approved GLP course: what the reduction requires</h2>
        <p>
          A driving-school licence and approval of a GLP course are different things. ICBC licenses
          driving schools to operate; a licensed school must complete a separate process before ICBC
          approves a particular Class 7 GLP course. Confirm both the school and the course in ICBC's{" "}
          <a
            href="https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school"
            target="_blank"
            rel="noopener noreferrer"
          >
            licensed-school directory
          </a>{" "}
          and{" "}
          <a
            href="https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools"
            target="_blank"
            rel="noopener noreferrer"
          >
            approved-GLP-school list
          </a>.
        </p>
        <p>
          ICBC describes the approved Class 7 course as 32 hours: 16 hours of classroom theory, 12
          hours of individual on-road instruction and four discretionary hours. For an under-25
          driver to qualify for the six-month novice-stage reduction, ICBC says the course must be
          completed within 365 days while the student holds a Class 7 learner's licence. The student
          must then have no violations or at-fault crashes during the first 18 months of the novice
          stage. Starting but not completing the course does not shorten the 24-month requirement.
          See ICBC's full{" "}
          <a
            href="https://www.partners.icbc.com/driver-training/driving-schools/teach-approved-course"
            target="_blank"
            rel="noopener noreferrer"
          >
            approved-course requirements
          </a>.
        </p>

        <h2>Practical checklist</h2>
        <ol>
          <li>Check your current licence type and age against ICBC's GLP changes page.</li>
          <li>Review your driving record against every DRA criterion, not only the time requirement.</li>
          <li>
            If a second road test is booked, compare its date with October 19 and wait for ICBC's
            email if it will be cancelled.
          </li>
          <li>
            If considering the course reduction, verify that the provider and specific course are on
            ICBC's approved GLP list before paying.
          </li>
          <li>Confirm your DRA location and whether it accepts appointments or walk-ins.</li>
        </ol>

        <h2>Independent-school disclosure</h2>
        <p>
          Shanaya's Driving School is an independent driving school. It is not ICBC and cannot decide
          DRA eligibility, change a driving record, guarantee a test result or issue a licence. For
          official decisions, contact ICBC. If you choose optional professional practice for the
          learner-to-novice road test, see our <Link to="/driving-lessons">driving lessons</Link> or{" "}
          <Link to="/road-test-prep-victoria">road-test preparation</Link>. These services are separate
          from an ICBC-approved GLP course unless ICBC's current approved-course list says otherwise.
        </p>

        <h2>Official sources</h2>
        <p>
          Sources were reviewed on July 21, 2026. ICBC may refine operational details before the
          October 19 effective date.
        </p>
        <ul>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Changes to the Graduated Licensing Program
            </a>
          </li>
          <li>
            <a
              href="https://news.gov.bc.ca/releases/2026PSSG0061-000847"
              target="_blank"
              rel="noopener noreferrer"
            >
              Government of B.C.: Supporting road safety, streamlining licensing for new drivers
            </a>
          </li>
          <li>
            <a
              href="https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7-licence-and-youre-under-25"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Class 7 licence and under-25 transition details
            </a>
          </li>
          <li>
            <a
              href="https://icbc.com/driver-licensing/new-drivers/you-have-a-class-7l-licence"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Class 7L transition and passenger rules
            </a>
          </li>
          <li>
            <a
              href="https://www.partners.icbc.com/driver-training/driving-schools/teach-approved-course"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC Driver Training: Approved GLP course requirements
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Choosing a licensed driving school
            </a>{" "}
            and the{" "}
            <a
              href="https://www.icbc.com/driver-licensing/driver-training/Choosing-your-driving-school/glp-schools"
              target="_blank"
              rel="noopener noreferrer"
            >
              approved GLP school list
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-L"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Penalties for GLP drivers
            </a>{" "}
            and{" "}
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-full-licence"
              target="_blank"
              rel="noopener noreferrer"
            >
              current Class 5 road-test eligibility
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/high-risk-driver/driver-improvement"
              target="_blank"
              rel="noopener noreferrer"
            >
              RoadSafetyBC: Driver Improvement Program
            </a>
          </li>
        </ul>
        <p>
          Last substantive review: July 21, 2026. Always confirm current requirements with ICBC
          before changing an appointment or making a licensing decision.
        </p>
      </>
    ),
  },
  {
    slug: "how-to-pass-driving-test-victoria-bc",
    title: "B.C. Class 7 Road Test: Victoria Preparation Guide",
    seoTitle: "Class 7 Road Test Victoria: Preparation Guide",
    description:
      "Prepare for a B.C. Class 7 road test in Victoria with verified ICBC eligibility, practice, booking, fee, vehicle and test-day information.",
    heroImage:
      "/blog/how-to-pass-driving-test-victoria-bc.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-07-05",
    dateModified: "2026-07-21",
    readTime: "8 min read",
    category: "Road Test Guide",
    relatedSlugs: ["bc-glp-changes-2026", "icbc-road-test-tips-victoria", "pass-road-test"],
    content: (
      <>
        <p>
          This guide is for a B.C. Class 7 learner preparing to take the first road test and obtain a
          novice (N) licence. It explains the current eligibility rule, what ICBC says to practise,
          how to book, what to bring, and what happens during and after the test. No guide or lesson
          can guarantee a pass: the result depends on the driving you demonstrate during the test.
        </p>

        <h2>1. Check when you are eligible</h2>
        <p>
          Under the rules in effect on July 21, 2026, a Class 7 learner must complete at least 12
          consecutive months as a learner without a driving prohibition before taking the Class 7
          road test. ICBC prints the earliest test date on the licence. Holding the licence for the
          minimum period makes you eligible to test; it does not by itself mean you are ready. See
          ICBC&apos;s current <a href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N" target="_blank" rel="noopener noreferrer">Get your N guidance</a> and the eligibility date on your own licence.
        </p>
        <p>
          A scheduled change takes effect on October 19, 2026: learners who are 25 or older will
          have a minimum learner period of nine months, while the 12-month minimum will continue for
          learners under 25. The first Class 7 road test remains part of the process. The change to
          the second road test does not remove this test. Read ICBC&apos;s{" "}
          <a href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes" target="_blank" rel="noopener noreferrer">Graduated Licensing Program changes</a> and our plain-language{" "}
          <Link to="/blog/bc-glp-changes-2026">GLP change summary</Link> before relying on a future date.
        </p>

        <h2>2. Build readiness before choosing a test date</h2>
        <p>
          ICBC recommends at least 60 hours of practice for the Class 7 road test. That number is
          preparation guidance, not a statutory minimum and not a promise that a particular number
          of hours will produce a pass. Some learners need more time. ICBC&apos;s free{" "}
          <a href="https://www.icbc.com/driver-licensing/documents/tuneup-complete.pdf" target="_blank" rel="noopener noreferrer">Tuning Up for Drivers guide</a> provides structured sessions and a practice log to use with a qualified supervisor.
        </p>
        <p>
          Build practice gradually and include different legal driving environments, traffic levels,
          times of day and weather conditions with your supervisor. In Greater Victoria, useful
          transferable practice may include hills, multi-lane roads, roundabouts and areas with
          pedestrians and cyclists. These are examples of varied practice, not a prediction of what
          will be on a test or which streets an examiner will use.
        </p>

        <h3>Use ICBC&apos;s five core skill groups</h3>
        <p>
          ICBC&apos;s <a href="https://www.icbc.com/assets/pa/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf" target="_blank" rel="noopener noreferrer">Road Test Skills Explainer</a> organizes the driving criteria into five core competencies:
        </p>
        <ul>
          <li>
            <strong>Observation:</strong> scan for hazards, use mirrors, shoulder-check before a
            change in direction or road position, look all around before backing, and look in the
            direction of travel.
          </li>
          <li>
            <strong>Space margin:</strong> choose a safe and legal lane position, maintain a safe
            following distance, select safe gaps, stop in the correct position, and leave adequate
            clearance when parking.
          </li>
          <li>
            <strong>Speed:</strong> stay within the limit while choosing a speed appropriate for
            conditions, stop fully when required, respond safely to amber lights, and accelerate or
            slow smoothly.
          </li>
          <li>
            <strong>Steering:</strong> maintain control, use an appropriate steering-wheel position,
            and position the wheels correctly when parked on a hill.
          </li>
          <li>
            <strong>Communication:</strong> signal before turning, changing lanes, pulling out or
            pulling over; time the signal so it gives useful warning; and cancel it afterwards.
          </li>
        </ul>
        <p>
          The Skills Explainer also defines a dangerous action as conduct, or a failure to act, that
          could cause a collision or loss of control and requires another person to intervene. A
          violation is observed behaviour outside the applicable criteria that is typically a
          ticketable offence. ICBC does not publish a simple points target, so prepare to perform all
          core skills consistently rather than trying to calculate an unofficial passing score.
        </p>

        <h2>3. Book directly through ICBC</h2>
        <p>
          Use ICBC&apos;s official <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test" target="_blank" rel="noopener noreferrer">road-test booking page</a> to book, reschedule or cancel. Third-party booking services are not affiliated with ICBC, and ICBC says phoning does not reveal different appointment times from those available online. Choose an office and date for which you can arrive prepared; do not assume that a particular location will be easier.
        </p>
        <p>
          ICBC does not make its road-test routes available outside ICBC and warns that sites selling
          routes did not obtain them from ICBC. Practising memorized streets is therefore not a
          reliable preparation strategy. If you need to cancel or reschedule, give at least 48
          hours&apos; notice to avoid the current $25 cancellation fee.
        </p>

        <h2>4. Bring every required item</h2>
        <p>
          Check the official <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment" target="_blank" rel="noopener noreferrer">appointment-preparation page</a> again shortly before the test. ICBC&apos;s current passenger-vehicle guidance calls for:
        </p>
        <ul>
          <li>your current driver&apos;s licence;</li>
          <li>one accepted primary ID and one accepted secondary ID;</li>
          <li>
            a safe, reliable and properly insured vehicle with a Canadian licence plate, along with
            its registration and insurance papers; be ready to give the plate number at the counter
            and make sure the coverage permits you to drive it;
          </li>
          <li>
            a licensed driver who meets the supervisor requirements, because you must continue to
            obey the conditions of your learner&apos;s licence before the test and will still need
            supervised driving if you do not pass;
          </li>
          <li>glasses or contact lenses if you require them to drive;</li>
          <li>
            your Declaration of Completion if you successfully completed an ICBC-approved GLP
            driver-training course; and
          </li>
          <li>payment for the road-test and licence fees.</li>
        </ul>
        <p>
          If you are not the named member for a car-share vehicle, ICBC requires an original,
          signed and dated authorization letter on the company&apos;s letterhead for each test attempt.
          The current preparation page also says the test vehicle must be clean, scent-free and free
          of items that could affect health or safety. Audio and video recording devices cannot be
          used, and GPS and navigation systems must be turned off.
        </p>

        <h3>Check the vehicle before leaving home</h3>
        <p>
          ICBC may cancel a test if a vehicle is unsafe or does not meet legal requirements. Its
          published common rejection reasons include illegally tinted or cracked glass, safety-related
          dashboard warning lights, damaged seatbelts, non-working lights, an unsafe or cluttered
          interior, illegal modifications, a non-working horn, unsafe tires, doors or windows that do
          not operate, and too little fuel or battery charge. Check for an outstanding serious safety
          recall as well. This check should happen before test day, leaving time to repair a problem
          or arrange another eligible vehicle.
        </p>

        <h2>5. Know the current fees</h2>
        <p>
          As checked on July 21, 2026, ICBC lists a $35 fee for a Class 7 road-test attempt and a $75
          fee for the five-year novice licence issued after a pass. A test fee applies to each
          attempt. Fees can change, so confirm them on ICBC&apos;s <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Fees" target="_blank" rel="noopener noreferrer">driver-licensing fees page</a> rather than relying on an old checklist.
        </p>

        <h2>6. What happens during the Class 7 test</h2>
        <p>
          ICBC says the Class 7 road test, including the feedback afterwards, takes about 35 minutes.
          Before driving, the examiner checks the vehicle and may ask you to locate or operate items
          such as the horn, parking brake, high beams and turn signals, and to demonstrate hand
          signals. If the vehicle is not test-ready, the drive may not proceed.
        </p>
        <p>
          On the road, the examiner gives directions with advance warning and assesses whether you
          demonstrate skills safely, smoothly and under control. The test may draw from such tasks as
          intersections and turns, entering traffic, pulling over, lane changes, hill parking,
          backing, parking and two- or three-point turns. It may also include identifying potential
          hazards. Not every skill is necessarily included, and ICBC says examiners are not looking
          for perfection. Follow the examiner&apos;s directions, but never make an illegal or unsafe move;
          ICBC states that examiners will not ask you to do one.
        </p>
        <p>
          Only the examiner and examinee are permitted in the vehicle during the road test. A
          translator cannot ride along, although ICBC allows someone to translate during the
          feedback session after the drive. Review the official materials in advance if English
          driving terms are unfamiliar.
        </p>

        <h2>7. Use the result as specific feedback</h2>
        <p>
          After the drive, the examiner tells you the result and provides a copy of the road-test
          form. The Skills Explainer on the form identifies the areas demonstrated and any skills to
          improve. If you pass, complete the licensing process and make sure you understand every
          novice restriction before driving as an N.
        </p>
        <p>
          If you do not pass, ICBC&apos;s current minimum waits are 14 days after the first unsuccessful
          attempt, 30 days after the second, and 60 days after a third or later attempt. These are
          minimums, not readiness targets. Use the examiner&apos;s written feedback and supervised
          practice to decide when to try again, and remember that the test fee applies again.
        </p>

        <h2>Are professional lessons required?</h2>
        <p>
          No. A learner can prepare through legal, supervised practice and ICBC&apos;s free guides.
          Professional <Link to="/driving-lessons">driving lessons in Victoria</Link> or a{" "}
          <Link to="/road-test-prep-victoria">road-test preparation lesson</Link> are optional ways to
          receive structured feedback. A lesson, assessment or practice drive does not reproduce an
          ICBC examination and cannot guarantee a passing result.
        </p>

        <h2>Official sources</h2>
        <ul>
          <li>
            ICBC, <a href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N" target="_blank" rel="noopener noreferrer">Get your N</a> — eligibility, test duration, feedback and retest waits.
          </li>
          <li>
            ICBC, <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test" target="_blank" rel="noopener noreferrer">Book a road test</a> — direct booking, route confidentiality and cancellation notice.
          </li>
          <li>
            ICBC, <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment" target="_blank" rel="noopener noreferrer">Prepare for your road-test appointment</a> — ID, vehicle and test-day requirements.
          </li>
          <li>
            ICBC, <a href="https://www.icbc.com/assets/pa/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf" target="_blank" rel="noopener noreferrer">Road Test Skills Explainer</a> — official assessment criteria.
          </li>
          <li>
            ICBC, <a href="https://www.icbc.com/driver-licensing/documents/tuneup-complete.pdf" target="_blank" rel="noopener noreferrer">Tuning Up for Drivers</a> — guided practice sessions and the 60-hour recommendation.
          </li>
          <li>
            ICBC, <a href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes" target="_blank" rel="noopener noreferrer">Graduated Licensing Program changes</a> — changes effective October 19, 2026.
          </li>
        </ul>
        <p>
          Sources and fees were checked on July 21, 2026. ICBC can change eligibility, fees,
          documentation and appointment rules. Confirm the official pages and your own licence
          conditions before booking or attending a test.
        </p>
      </>
    ),
  },
  {
    slug: "icbc-road-test-tips-victoria",
    title: "Class 7 Road Test Tips for Victoria Driving Conditions",
    seoTitle: "Class 7 Road Test Tips for Victoria, B.C.",
    description:
      "Apply ICBC's Class 7 road-test skills across Greater Victoria hills, one-way streets, roundabouts and cyclist traffic without relying on route claims.",
    heroImage:
      "/blog/icbc-road-test-tips-victoria.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-07-05",
    dateModified: "2026-07-21",
    readTime: "8 min read",
    category: "Road Test Tips",
    relatedSlugs: ["bc-glp-changes-2026", "how-to-pass-driving-test-victoria-bc", "pass-road-test"],
    content: (
      <>
        <p>
          The B.C. Class 7 road test measures whether a learner can apply safe driving skills as
          conditions change. This guide uses ICBC&apos;s published skill categories and shows how to
          practise them in driving environments found around Greater Victoria. It is not a route
          guide, a scoring formula or a prediction of what will appear on an individual test. No
          article or lesson can guarantee a result.
        </p>

        <h2>Do not build preparation around a claimed test route</h2>
        <p>
          ICBC says it does not make road-test routes available outside ICBC and warns that sites
          claiming to sell those routes did not get the information from ICBC. Book directly through
          ICBC and prepare for transferable skills rather than memorizing a sequence of streets. See
          ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
            target="_blank"
            rel="noopener noreferrer"
          >
            road-test booking guidance
          </a>.
        </p>

        <h2>Use ICBC&apos;s five road-test skill groups</h2>
        <p>
          ICBC&apos;s one-page{" "}
          <a
            href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Road Test Skills Explainer
          </a>{" "}
          groups its criteria under observation, space margin, speed, steering and communication.
          The document lists specific behaviours within each group; it does not publish a simple
          points target or say that one group is worth most of the test.
        </p>
        <p>
          A useful way to combine the five groups is ICBC&apos;s <strong>See-Think-Do</strong> strategy:
          scan for hazards and other road users, decide which hazards create the greatest risk, then
          respond through speed control, steering, space margins and communication. ICBC explains
          that method in{" "}
          <a
            href="https://www.icbc.com/assets/en/4y4ZwCc9FaBYZTxC5LVmue/drivers5.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            chapter 5 of Learn to Drive Smart
          </a>.
        </p>

        <h2>1. Make observation a continuous cycle</h2>
        <p>
          Looking only at the vehicle ahead is not enough. ICBC advises scanning at least 12 seconds
          ahead and completing an observation cycle every five to eight seconds: look well ahead,
          scan from side to side for potential hazards, glance in the mirrors, then repeat. Those
          timings come from the See-Think-Do chapter above; they are practice guidance, not a claim
          about how points are awarded.
        </p>
        <ul>
          <li>
            Scan intersections and crosswalks early, including the areas partly hidden by parked
            vehicles, buses, vegetation, hills or curves.
          </li>
          <li>
            Check the appropriate mirror and blind spot before changing direction or road position,
            pulling away from a curb or pulling over. Driver-assistance alerts do not replace a
            shoulder check.
          </li>
          <li>
            Before reversing, complete the 360-degree check identified in the Skills Explainer and
            keep looking in the direction of travel while backing.
          </li>
        </ul>

        <h2>2. Identify a hazard, then make a measured response</h2>
        <p>
          Hazard perception means noticing what could affect you or another road user before it
          becomes an emergency. In Greater Victoria practice, examples can include a cyclist beside
          parked cars, a pedestrian near a crossing, a bus blocking the view, reduced visibility in
          rain, or a curve or hill hiding what is ahead. These are practice scenarios, not route
          predictions.
        </p>
        <p>
          Name the hazard while practising with a qualified supervisor, assess what could happen,
          and identify the safest available space. ICBC&apos;s Skills Explainer says that when a
          potential hazard appears, the driver should take their foot off the accelerator and cover
          the brake in preparation to stop. That does not mean braking suddenly for every possible
          hazard; the response still needs to fit traffic, traction, visibility and the space around
          the vehicle.
        </p>

        <h2>3. Protect space around the vehicle</h2>
        <p>
          The official criteria include a safe following distance, legal lane position, safe gaps,
          correct stopping position and adequate parking clearance. A gap is not safe if another
          road user must change speed or position because you entered it. Stop behind a crosswalk
          rather than blocking it, and leave enough space to finish a turn or parking manoeuvre
          without touching a curb or object. These behaviours are described in ICBC&apos;s{" "}
          <a
            href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            official criteria
          </a>.
        </p>
        <p>
          Around cyclists, first observe, then preserve a safe side and following margin. Before a
          right turn or any move toward the curb, check the mirror and blind spot for a person riding
          beside the vehicle. ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/assets/en/2nzdWqYvb055vGu78wiXoN/drivers6.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sharing the Road chapter
          </a>{" "}
          also tells drivers to scan carefully for cyclists at intersections and wait for a clear,
          safe opportunity rather than crowding a cyclist while passing.
        </p>

        <h2>4. Match speed to the limit and the conditions</h2>
        <p>
          ICBC&apos;s published criterion is a speed that is consistent, within the posted limit and
          appropriate for the conditions. A slower speed may be necessary when visibility or
          traction is reduced, but unnecessary slowing can also disrupt traffic. Anticipate changes
          so acceleration and braking stay smooth. Come to a complete stop where required, and on an
          amber light stop before entering the intersection unless a safe stop is no longer possible.
        </p>
        <p>
          Hills are useful for practising controlled speed, steering and space together. Prevent the
          vehicle from rolling back when starting uphill, manage downhill speed before it builds, and
          set the front wheels in the appropriate direction when hill parking. Each of those
          behaviours appears in the Skills Explainer or ICBC&apos;s See-Think-Do chapter.
        </p>

        <h2>5. Communicate early enough to be useful</h2>
        <p>
          Signal before turning, changing lanes, pulling out or pulling over. ICBC says a signal
          should give useful advance warning without being so early that it confuses other road
          users, and it should be cancelled after the manoeuvre. A signal communicates intent; it
          does not create a safe gap or replace mirror and shoulder checks.
        </p>

        <h2>Apply the skills in varied Greater Victoria conditions</h2>
        <p>
          Varied practice is more useful than repeating a claimed route. The following environments
          let a learner combine the official skills while driving legally with a qualified
          supervisor:
        </p>
        <ul>
          <li>
            <strong>One-way streets and multiple turn lanes:</strong> read signs, signals and pavement
            markings early, choose the correct approach lane, and finish in the correct lane. For
            example, ICBC&apos;s rule guide shows a left turn from a one-way road to another beginning
            in the left lane and ending in the left lane.
          </li>
          <li>
            <strong>Roundabouts:</strong> choose the correct lane before entering, slow on approach,
            yield to pedestrians at the approach crosswalk and to traffic already in the roundabout,
            stay in the same lane, and signal right before exiting.
          </li>
          <li>
            <strong>Hills and curves:</strong> look beyond the crest or curve as far as visibility
            permits, reduce speed before a curve, and maintain control without cutting across the
            lane.
          </li>
          <li>
            <strong>Pedestrian and cyclist activity:</strong> keep the observation cycle moving,
            check the blind spot before turning or moving laterally, and leave safe space.
          </li>
          <li>
            <strong>Rain or limited visibility:</strong> increase the time available to respond by
            reducing speed appropriately and preserving space; do not drive faster than the distance
            you can see to stop.
          </li>
        </ul>
        <p>
          ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/assets/en/DhxStHw3HmhFhbL8v150h/drivers4.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rules of the Road chapter
          </a>{" "}
          provides the one-way, lane-tracking and roundabout instructions. Follow the signs and
          markings at the location; they control the movement available there.
        </p>

        <h2>Practise the behaviours ICBC actually documents</h2>
        <p>
          The Skills Explainer specifically identifies missed shoulder, mirror and 360-degree checks;
          inadequate scanning or hazard perception; unsafe gaps and following distance; blocking a
          crosswalk; incorrect turn or stop position; rolling stops; speed that is inconsistent or
          unsuitable for conditions; rollback on a hill; steering-control issues; and signal timing
          or cancellation problems. This is an official list of assessed behaviours, not a ranking of
          the most frequent reasons people are unsuccessful.
        </p>
        <p>
          During practice, record one observable behaviour at a time. For example: “I checked the
          mirror but missed the shoulder check before moving away from the curb.” That is more useful
          than a vague goal such as “be more confident,” because the next practice drive can repeat
          and verify the exact sequence.
        </p>

        <h2>Test timing, feedback and another attempt</h2>
        <p>
          ICBC says the Class 7 road test takes about 35 minutes and includes feedback at the end. If
          the result is unsuccessful, ICBC&apos;s current waiting periods are 14 days after the first
          attempt, 30 days after the second, and 60 days after three or more attempts. Use the
          feedback to choose what to practise before booking again. Confirm the current details on
          ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get your N page
          </a>.
        </p>

        <h2>The first Class 7 road test remains after October 19, 2026</h2>
        <p>
          B.C.&apos;s GLP change on October 19, 2026 replaces the later novice-to-Class-5 road test with a
          Driving Record Assessment for eligible drivers. It does not remove the learner-to-novice
          Class 7 road test discussed here. Read ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
            target="_blank"
            rel="noopener noreferrer"
          >
            GLP changes page
          </a>{" "}
          for the transition rules.
        </p>

        <h2>Optional instruction and independent practice</h2>
        <p>
          Professional lessons are optional; they cannot determine or ensure the test result. A
          learner can use ICBC&apos;s free practice materials with a qualified supervisor, choose a
          licensed school for targeted feedback, or combine both. If you want optional support, see our{" "}
          <Link to="/road-test-prep-victoria">road-test preparation</Link> or{" "}
          <Link to="/driving-lessons">driving lessons</Link>. Shanaya&apos;s Driving School is independent
          from ICBC and does not set test routes, assessment criteria or licensing decisions.
        </p>

        <h2>Official sources</h2>
        <p>Sources were reviewed on July 21, 2026.</p>
        <ul>
          <li>
            <a
              href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Road Test Skills Explainer
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/assets/en/4y4ZwCc9FaBYZTxC5LVmue/drivers5.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Learn to Drive Smart, chapter 5 — See-Think-Do
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/assets/en/DhxStHw3HmhFhbL8v150h/drivers4.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Learn to Drive Smart, chapter 4 — Rules of the Road
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/assets/en/2nzdWqYvb055vGu78wiXoN/drivers6.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Learn to Drive Smart, chapter 6 — Sharing the Road
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Get your N
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Book a road test
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Changes to the Graduated Licensing Program
            </a>
          </li>
        </ul>
        <p>
          Last substantive review: July 21, 2026. ICBC can change test procedures and licensing
          rules. Check the official pages before booking or relying on a future date.
        </p>
      </>
    ),
  },
  {
    slug: "pass-road-test",
    title: "B.C. Class 7 Road Test: Readiness and Test-Day Checklist",
    seoTitle: "B.C. Class 7 Road Test Checklist",
    description:
      "A source-checked Class 7 checklist for eligibility, practice, booking, ID, vehicle readiness, fees, test day, results and novice restrictions.",
    heroImage:
      "/blog/road-test-tips.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-03-01",
    dateModified: "2026-07-21",
    readTime: "8 min read",
    category: "Road Test Checklist",
    relatedSlugs: ["bc-glp-changes-2026", "icbc-road-test-tips-victoria", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          This checklist is for a B.C. Class 7 learner preparing for the road test that leads to a
          novice (N) licence. It separates official requirements from preparation advice and covers
          what to check before booking, what to bring, what happens at the appointment and what to do
          with either result. No checklist, lesson or number of practice hours can guarantee a pass;
          the outcome depends on the driving demonstrated during the test.
        </p>

        <h2>Before booking: confirm eligibility</h2>
        <p>
          Under the rules in effect on July 21, 2026, you may take the Class 7 road test after holding
          your learner&apos;s licence for at least 12 consecutive months without a driving prohibition.
          ICBC prints the earliest test date on the licence. Check that date and the current{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get your N requirements
          </a>{" "}
          before selecting an appointment.
        </p>
        <p>
          A scheduled change starts on <strong>October 19, 2026</strong>: ICBC says the minimum learner
          stage will be nine months for people age 25 or older and will remain 12 months for people
          under 25. The Class 7 learner-to-novice road test remains required. It is the later,
          novice-to-Class-5 road test that the new Driving Record Assessment replaces for eligible
          drivers. If your eligibility is near or after that date, use ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
            target="_blank"
            rel="noopener noreferrer"
          >
            GLP changes page
          </a>{" "}
          rather than assuming that the first road test disappears.
        </p>

        <h2>Readiness check: practise skills, not a route</h2>
        <p>
          ICBC recommends <strong>at least 60 hours of practice</strong> before the Class 7 road test.
          This is preparation guidance, not a legal minimum and not a prediction of the result. Use
          supervised practice in varied, legal conditions and record it in ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/documents/tuneup-complete.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tuning Up for Drivers guide
          </a>.
        </p>
        <p>
          Before booking, ask whether you can repeatedly perform the five core competencies in
          ICBC&apos;s{" "}
          <a
            href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Road Test Skills Explainer
          </a>{" "}
          without prompts from your supervisor:
        </p>
        <ul>
          <li>
            <strong>Observation:</strong> scan for hazards, use mirrors, shoulder-check before a
            change in direction or road position, look all around before backing and look where the
            vehicle is travelling.
          </li>
          <li>
            <strong>Space margin:</strong> choose a safe and legal lane position, maintain following
            distance, select safe gaps, stop in the correct place and leave adequate parking space.
          </li>
          <li>
            <strong>Speed:</strong> stay within the limit, adjust for conditions, stop fully when
            required and accelerate or slow smoothly.
          </li>
          <li>
            <strong>Steering:</strong> maintain control and position the wheels correctly when parked
            on a hill.
          </li>
          <li>
            <strong>Communication:</strong> signal at a useful time before turns, lane changes,
            pulling out or pulling over, then cancel the signal.
          </li>
        </ul>
        <p>
          The Explainer also describes dangerous actions, violations and other problems; it does not
          publish a simple points target for learners to calculate. Readiness means applying the
          whole skill set safely and consistently. Practise different road environments rather than
          memorizing streets. ICBC states that it does not make its road-test routes available
          outside ICBC and that sites claiming to sell those routes did not get them from ICBC.
        </p>

        <h2>When booking: use ICBC directly</h2>
        <ul>
          <li>
            Book, reschedule or cancel through ICBC&apos;s official{" "}
            <a
              href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test"
              target="_blank"
              rel="noopener noreferrer"
            >
              road-test booking page
            </a>. ICBC says third-party booking sites are not affiliated with it.
          </li>
          <li>Choose a date when both you and an eligible test vehicle will be ready.</li>
          <li>
            Cancel or rebook with at least 48 hours&apos; notice to avoid ICBC&apos;s current $25 late
            cancellation fee.
          </li>
          <li>Review the confirmation email and arrive at the check-in time it gives you.</li>
        </ul>

        <h2>What to bring: Class 7 appointment checklist</h2>
        <p>
          Recheck ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment"
            target="_blank"
            rel="noopener noreferrer"
          >
            road-test appointment page
          </a>{" "}
          shortly before your test. For a Class 7 appointment, prepare all of the following:
        </p>
        <ul>
          <li>your current learner&apos;s licence;</li>
          <li>
            one piece of ICBC-accepted primary identification and one piece of accepted secondary
            identification;
          </li>
          <li>
            payment for the road test and, if you pass, the novice licence; ICBC driver licensing
            offices currently list cash, major credit cards, debit and personal cheques as accepted
            methods;
          </li>
          <li>
            a safe, reliable and properly insured vehicle with a Canadian licence plate, plus its
            registration and insurance papers; know the plate number for check-in and confirm that
            the insurance permits you to drive it;
          </li>
          <li>
            a qualified supervisor so you can legally travel to the appointment as a learner and
            leave under learner conditions if you do not pass; under the current learner restriction,
            the supervisor must be at least 25, hold a valid Class 1, 2, 3, 4 or 5 licence and sit in
            the front passenger seat;
          </li>
          <li>glasses or contact lenses if they are required for you to drive; and</li>
          <li>
            a Declaration of Completion if you completed an ICBC-approved GLP driver-training course
            during the learner stage.
          </li>
        </ul>
        <p>
          For a car-share vehicle when you are not the named member, ICBC also requires a new
          original authorization letter for each attempt. It must be on the company&apos;s letterhead and
          signed and dated by a company representative.
        </p>

        <h2>Vehicle check: fix the problem or reschedule</h2>
        <p>
          ICBC may cancel a test if the vehicle is unsafe or does not meet legal requirements. Check
          it early enough to arrange a repair or another eligible vehicle. ICBC&apos;s published common
          rejection reasons include cracked or illegally tinted glass, safety-related dashboard
          warning lights, damaged seatbelts, non-working lights or horn, unsafe tires, doors or
          windows that do not work, unsafe or illegal modifications, an unclean or hazardous interior
          and too little fuel or battery charge. Check for an outstanding serious vehicle safety
          recall too.
        </p>
        <p>
          Reschedule if you cannot bring the required ID, payment, qualified supervisor or a legal,
          insured, test-ready vehicle. Giving at least 48 hours&apos; notice avoids the current $25
          cancellation fee. Do not rely on the examiner overlooking a defect: the inspection happens
          before the on-road portion.
        </p>

        <h2>Current fees</h2>
        <p>
          As checked on July 21, 2026, ICBC lists <strong>$35 for each Class 7 road-test attempt</strong>{" "}
          and <strong>$75 for the five-year novice licence</strong> issued after a pass. Confirm the{" "}
          <a
            href="https://www.icbc.com/driver-licensing/visit-dl-office/Fees"
            target="_blank"
            rel="noopener noreferrer"
          >
            current driver-licensing fees
          </a>{" "}
          before attending because published fees can change.
        </p>

        <h2>Test day: what happens in order</h2>
        <ol>
          <li>
            <strong>Check in.</strong> Arrive at the time in your confirmation, present the required
            ID, give the plate number and pay the test fee.
          </li>
          <li>
            <strong>Complete the vehicle check.</strong> The examiner assesses whether the vehicle is
            test-ready and may ask you to locate or operate controls such as the horn, parking brake,
            high beams and turn signals, or demonstrate hand signals.
          </li>
          <li>
            <strong>Take the on-road test.</strong> Only the examiner and examinee may be in the
            vehicle. Recording devices cannot be used, and GPS and navigation systems must be off.
            The examiner gives directions and assesses whether the published skills are demonstrated
            safely, smoothly and under control. Never make an illegal or unsafe movement to follow a
            direction.
          </li>
          <li>
            <strong>Receive the result and feedback.</strong> ICBC says the complete Class 7 test,
            including the feedback afterwards, takes about 35 minutes. The examiner tells you the
            result and gives you a paper copy of the road-test form identifying demonstrated skills
            and areas to improve.
          </li>
        </ol>

        <h2>If you pass: finish licensing and follow N restrictions</h2>
        <p>
          Complete the novice licensing transaction and pay the current licence fee. ICBC&apos;s
          published card guidance says an interim paper driver&apos;s licence is valid for 90 days and
          that most physical licence or ID cards take up to 60 days to arrive. Keep the interim
          document valid and use ICBC&apos;s{" "}
          <a
            href="https://www.icbc.com/driver-licensing/getting-licensed/Card-status-tracking"
            target="_blank"
            rel="noopener noreferrer"
          >
            card-status service
          </a>{" "}
          if needed.
        </p>
        <p>Before driving independently, review the restrictions printed on your new licence. Current N restrictions include:</p>
        <ul>
          <li>zero alcohol and zero drugs in your blood while driving;</li>
          <li>displaying the official N sign on the back of the vehicle;</li>
          <li>no hand-held or hands-free cellphones or other electronic devices; and</li>
          <li>
            one passenger, not counting immediate family, unless a supervisor age 25 or older with a
            valid Class 1, 2, 3, 4 or 5 licence is seated beside you.
          </li>
        </ul>
        <p>
          Licensing rules change and individual licences can carry additional restrictions, so the
          conditions printed on your licence and ICBC&apos;s current guidance control.
        </p>

        <h2>If you do not pass: use the form, then rebook when ready</h2>
        <p>
          An unsuccessful attempt does not change the skills you need to build. Review the road-test
          form and the examiner&apos;s specific feedback, then practise those areas legally with a
          qualified supervisor. ICBC&apos;s current minimum waits are <strong>14 days</strong> after the
          first unsuccessful attempt, <strong>30 days</strong> after the second and{" "}
          <strong>60 days</strong> after a third or later attempt. A new test fee applies each time.
          These are waiting periods, not evidence that a learner is ready on the first available day.
        </p>
        <p>
          Continue following every learner restriction until a novice licence is issued. Recheck the
          ID and vehicle lists before the new appointment instead of assuming the previous documents
          or car-share letter will carry over.
        </p>

        <h2>Optional preparation support</h2>
        <p>
          Learners may prepare with a qualified supervisor and ICBC&apos;s free materials. Professional{" "}
          <Link to="/driving-lessons">driving lessons in Victoria</Link> or a{" "}
          <Link to="/road-test-prep-victoria">road-test preparation lesson</Link> are optional ways to
          receive structured feedback. A practice assessment is not an ICBC examination, cannot use
          confidential ICBC routes and cannot guarantee a result.
        </p>

        <h2>Official source ledger</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/new-drivers/Get-your-N" target="_blank" rel="noopener noreferrer">Get your N</a>{" "}
            — current eligibility, duration, result form, retest waits and N restrictions.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Book-a-road-test" target="_blank" rel="noopener noreferrer">Book a road test</a>{" "}
            — direct booking, cancellation notice and route confidentiality.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Prepare-road-test-appointment" target="_blank" rel="noopener noreferrer">Prepare for your road-test appointment</a>{" "}
            — ID, payment, vehicle, car-share and in-vehicle requirements.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://icbc.com/assets/en/49OS8RJMWgWKgOx4U0EGOa/skills-explainer.pdf" target="_blank" rel="noopener noreferrer">Road Test Skills Explainer</a>{" "}
            — the five core competencies and skill definitions.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/visit-dl-office/Fees" target="_blank" rel="noopener noreferrer">Fees</a>{" "}
            — Class 7 test and novice-licence fees and payment methods.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes" target="_blank" rel="noopener noreferrer">Graduated Licensing Program changes</a>{" "}
            — changes effective October 19, 2026.
          </li>
          <li>
            ICBC,{" "}
            <a href="https://www.icbc.com/driver-licensing/getting-licensed/Card-status-tracking" target="_blank" rel="noopener noreferrer">Card status tracking</a>, and{" "}
            <a href="https://www.icbc.com/about-icbc/newsroom/icbc-services-during-canada-post-disruption-05-2025" target="_blank" rel="noopener noreferrer">interim-licence guidance</a>{" "}
            — card delivery and the validity period of the paper interim licence.
          </li>
        </ul>
        <p>
          Sources, fees and future-rule descriptions were last substantively checked on July 21,
          2026. ICBC can change requirements, restrictions, fees and appointment procedures. Confirm
          the official pages and your own licence before booking or driving.
        </p>
      </>
    ),
  },
  {
    slug: "defensive-driving",
    title: "Defensive Driving in B.C.: A Practical Risk-Management Guide",
    seoTitle: "Defensive Driving in B.C.: Practical Guide",
    description:
      "Use ICBC's See–Think–Do method to scan, manage space, choose a safe speed and respond calmly to common driving risks in B.C.",
    heroImage:
      "/blog/what-is-defensive-driving.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-02-20",
    dateModified: "2026-07-21",
    readTime: "8 min read",
    category: "Driving Skills",
    relatedSlugs: ["pass-road-test", "newcomers-guide-bc"],
    content: (
      <>
        <p>
          Defensive driving is not a promise that every collision can be avoided. It is a repeatable
          way to identify risk early, preserve time and space, and choose a response that leaves a
          margin for mistakes by you or someone else. For B.C. drivers, a useful starting point is
          ICBC's <strong>See–Think–Do</strong> method.
        </p>

        <h2>1. Use See–Think–Do as a continuous cycle</h2>
        <p>
          ICBC presents See–Think–Do in Chapter 5 of its official{" "}
          <a
            href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn to Drive Smart guide
          </a>
          . It is a decision cycle, not a single manoeuvre:
        </p>
        <ul>
          <li>
            <strong>See:</strong> keep your eyes moving, look well ahead, scan from side to side and
            use your mirrors. Look for road users, signs, surface changes, restricted sight lines and
            anything else that could create a conflict.
          </li>
          <li>
            <strong>Think:</strong> assess the risk. Ask what could happen, whether your current speed
            and space are enough, and which response creates the lowest risk.
          </li>
          <li>
            <strong>Do:</strong> act early and smoothly. That may mean communicating, changing lane
            position, increasing following distance, reducing speed or deciding not to proceed.
          </li>
        </ul>
        <p>
          The cycle continues throughout the drive. Looking without assessing the risk is incomplete;
          identifying a hazard without making a timely adjustment is also incomplete.
        </p>

        <h2>2. Build an observation routine</h2>
        <p>
          ICBC advises drivers to scan <strong>at least 12 seconds ahead</strong>. In city driving,
          its guide describes that as roughly one to two blocks; on a highway, roughly half a
          kilometre. The purpose is to notice developing situations before they demand abrupt action.
          ICBC also says to repeat the full observation cycle—look ahead, scan side to side and
          glance in the mirrors—every <strong>five to eight seconds</strong>. These are scanning
          habits, not a reason to stare away from the path immediately in front of the vehicle.
        </p>
        <p>
          Mirrors do not show every area around a vehicle. Do a shoulder check whenever you plan to
          change direction or road position, including pulling away, pulling over, changing lanes and
          turning. Check again before opening a vehicle door. Blind-spot monitors and cameras can
          provide useful information, but ICBC says they do not replace turning your head to check the
          relevant blind spot or looking behind when required. See the observation and blind-spot
          guidance in{" "}
          <a
            href="https://icbc.com/assets/en/4y4ZwCc9FaBYZTxC5LVmue/drivers5.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            ICBC's See–Think–Do chapter (PDF)
          </a>
          .
        </p>

        <h2>3. Match following distance to the conditions</h2>
        <p>
          Use a fixed object beside the road to measure a time gap. When the rear of the vehicle
          ahead passes it, count the seconds until the front of your vehicle reaches the same point.
          ICBC's current guidance is:
        </p>
        <ul>
          <li>
            <strong>At least two seconds</strong> in good weather and road conditions.
          </li>
          <li>
            <strong>At least three seconds</strong> on high-speed roads; behind a large vehicle that
            blocks your view; behind a motorcycle that may stop quickly; when a vehicle is following
            closely behind you; or on an unpaved road where dust or gravel may reduce visibility or
            traction.
          </li>
          <li>
            <strong>At least four seconds</strong> in bad weather or on uneven or slippery roads.
          </li>
        </ul>
        <p>
          Those time gaps are ICBC driving guidance, not a universal legal safe harbour. Section 162
          of B.C.'s{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05#section162"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act
          </a>{" "}
          prohibits following more closely than is reasonable and prudent, having regard to speed,
          traffic and highway conditions. Increase the gap beyond the guide's examples whenever
          visibility, traction, load, fatigue, vehicle condition or another hazard means you need more
          time or stopping distance.
        </p>

        <h2>4. Keep space around the vehicle and preserve an escape option</h2>
        <p>
          Space in front is only one part of the plan. Avoid travelling beside another vehicle for
          longer than necessary, stay out of other drivers' blind spots and leave room beside parked
          vehicles for an opening door or a person stepping out. On a multi-lane road, notice whether
          an adjacent clear area could provide an escape route if traffic ahead stops suddenly. An
          escape option is something to preserve through positioning and observation—it is not
          permission to make an unsafe lane movement.
        </p>
        <p>
          If another driver follows too closely, do not brake-check, compete or make abrupt changes.
          ICBC recommends staying calm and slightly increasing the space in front so that, if you must
          slow, you can do so more gradually. When it is safe, move to another lane or pull over and
          let the driver pass. ICBC provides the same guidance on its{" "}
          <a
            href="https://www.icbc.com/about-icbc/newsroom/2025-06-24-tailgating-survey"
            target="_blank"
            rel="noopener noreferrer"
          >
            tailgating safety page
          </a>
          .
        </p>

        <h2>5. Treat the posted limit as a limit, not a target for every condition</h2>
        <p>
          Read the road, traffic, visibility and weather before selecting a speed. Section 144 of the{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05#section144"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act
          </a>{" "}
          prohibits driving at a speed that is excessive relative to those conditions. A posted speed
          limit therefore does not mean that speed is suitable in rain, glare, fog, darkness,
          congestion or on a slippery surface. Reduce speed before the hazard, make steering and
          braking inputs smoothly, and keep enough clear distance to stop within what you can see.
        </p>

        <h2>6. Remove risks that observation cannot compensate for</h2>
        <h3>Distraction</h3>
        <p>
          Set navigation, climate controls and audio before moving, and keep the phone out of sight
          and reach. B.C.'s electronic-device rules apply even when stopped at a red light. Learner
          and novice drivers may not use personal electronic devices while driving, including
          hands-free devices. ICBC's{" "}
          <a
            href="https://www.icbc.com/road-safety/crashes-happen/distracted-driving"
            target="_blank"
            rel="noopener noreferrer"
          >
            distracted-driving page
          </a>{" "}
          explains the current restrictions and links to the law.
        </p>

        <h3>Alcohol, drugs and medication</h3>
        <p>
          Do not drive while impaired. Arrange another way home before consuming alcohol or cannabis.
          Prescription and over-the-counter medicines can also affect driving; ICBC advises checking
          with a physician or pharmacist about how a medication may affect you. Do not guess at a
          supposedly safe waiting period for cannabis—the effects vary by person, dose and method of
          consumption. See ICBC's current{" "}
          <a
            href="https://www.icbc.com/road-safety/crashes-happen/drug-impaired-driving"
            target="_blank"
            rel="noopener noreferrer"
          >
            drug-impaired-driving guidance
          </a>
          .
        </p>

        <h3>Fatigue</h3>
        <p>
          Difficulty holding your lane, drifting speed, heavy eyes, blurred vision, loss of focus or
          not recalling the last few minutes are warning signs. If they appear, stop in a safe place
          and rest or change drivers; opening a window or turning up music does not resolve the need
          for sleep. ICBC recommends beginning a long trip rested, planning breaks and understanding
          whether medication can cause drowsiness. Its{" "}
          <a
            href="https://www.icbc.com/about-icbc/newsroom/2025-07-29-fatigue"
            target="_blank"
            rel="noopener noreferrer"
          >
            driver-fatigue guidance
          </a>{" "}
          lists the warning signs and practical responses.
        </p>

        <h2>7. Give pedestrians, cyclists and other vulnerable road users room</h2>
        <p>
          Search sidewalks, crosswalks, driveways, parked-vehicle gaps and cycle lanes rather than
          looking only for cars. Shoulder-check for a cyclist before turning right, and look for an
          oncoming cyclist before turning left. Approach a blocked view at a speed that gives you time
          to respond to someone who appears late.
        </p>
        <p>
          When passing a pedestrian, cyclist or another person covered by section 157.1 of B.C.'s
          Motor Vehicle Act, the movement must be safe and the minimum lateral distance is generally:
        </p>
        <ul>
          <li>
            <strong>1 metre</strong> where the speed limit is 50 km/h or less;
          </li>
          <li>
            <strong>1.5 metres</strong> where the speed limit is more than 50 km/h; or
          </li>
          <li>
            <strong>0.5 metre</strong> when the person is on a sidewalk or in a protected cycle lane.
          </li>
        </ul>
        <p>
          The governing text is{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05#section157.1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act section 157.1
          </a>{" "}
          and{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/26_58_16"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act Regulations, Division 48
          </a>
          . A minimum distance does not make an otherwise unsafe pass acceptable. Wait for a safe
          opportunity and allow more space when conditions call for it.
        </p>

        <h2>A short practice routine</h2>
        <p>
          During lawful practice, have the learner quietly identify one developing hazard, the space
          available and the lowest-risk response. At the end of the drive, review one situation in
          this order: what was visible, what risk developed, what choice was made, and whether an
          earlier adjustment would have created more margin. Keep the discussion away from busy
          moments so it does not become a distraction.
        </p>

        <h2>Defensive-driving lessons and insurance</h2>
        <p>
          A defensive-driving lesson does not automatically create an ICBC insurance discount. ICBC
          says premiums are affected by factors including listed drivers, driving experience, crash
          history, vehicle use and territory. Its{" "}
          <a
            href="https://www.icbc.com/insurance/costs/drivers-experience-crash-history"
            target="_blank"
            rel="noopener noreferrer"
          >
            premium-factor explanation
          </a>{" "}
          says experience and crash history help determine driver risk; it does not promise a discount
          for completing this type of lesson. Ask an Autoplan broker about your own policy rather than
          relying on a course-marketing claim.
        </p>

        <h2>Where to get help</h2>
        <p>
          Drivers can study the official guide and practise these routines independently when they are
          legally qualified and, for learners, with the required supervisor. Someone who wants
          structured feedback can also review our optional{" "}
          <Link to="/defensive-driving">defensive-driving lesson information</Link> or{" "}
          <Link to="/driving-lessons">driving lessons in Greater Victoria</Link>. Lessons cannot
          eliminate road risk or guarantee a particular driving, test or insurance outcome.
        </p>

        <h2>Official source ledger</h2>
        <ul>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/driver-licensing/driving-guides/Learn-to-Drive-Smart"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn to Drive Smart
            </a>{" "}
            and its{" "}
            <a
              href="https://icbc.com/assets/en/4y4ZwCc9FaBYZTxC5LVmue/drivers5.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              See–Think–Do chapter (PDF)
            </a>
            : observation, blind spots, following distance, space margins and speed selection.
          </li>
          <li>
            Province of British Columbia,{" "}
            <a
              href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_00_multi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Motor Vehicle Act
            </a>{" "}
            and{" "}
            <a
              href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/26_58_00_multi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Motor Vehicle Act Regulations
            </a>
            : conditional speed, prudent following and minimum passing-distance requirements.
          </li>
          <li>
            ICBC road-safety pages on{" "}
            <a
              href="https://www.icbc.com/road-safety/crashes-happen/distracted-driving"
              target="_blank"
              rel="noopener noreferrer"
            >
              distraction
            </a>
            ,{" "}
            <a
              href="https://www.icbc.com/road-safety/crashes-happen/drug-impaired-driving"
              target="_blank"
              rel="noopener noreferrer"
            >
              drug impairment and medication
            </a>{" "}
            and{" "}
            <a
              href="https://www.icbc.com/about-icbc/newsroom/2025-07-29-fatigue"
              target="_blank"
              rel="noopener noreferrer"
            >
              fatigue
            </a>
            : avoidable driver-state risks and response guidance.
          </li>
          <li>
            ICBC,{" "}
            <a
              href="https://www.icbc.com/insurance/costs/drivers-experience-crash-history"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drivers, experience and crash history
            </a>
            : factors ICBC uses when determining premiums.
          </li>
        </ul>
        <p>
          Sources and legal references were checked on July 21, 2026. Laws and ICBC guidance can
          change. Consult the current official text for your circumstances; this article is general
          educational information, not legal or insurance advice.
        </p>
      </>
    ),
  },
  {
    slug: "newcomers-guide-bc",
    title: "Moving to B.C.: Licence Deadlines and Five Road Rules to Check",
    seoTitle: "Moving to B.C.: Licence Deadlines & 5 Road Rules",
    description:
      "A source-checked overview of B.C.'s 90-day licence deadline, newcomer licensing paths, vehicle deadline, and five road rules for passenger drivers.",
    heroImage: "/blog/newcomers-guide-bc.webp",
    author: "Shanaya's Driving School",
    date: "July 21, 2026",
    datePublished: "2026-02-10",
    dateModified: "2026-07-21",
    readTime: "7 min read",
    category: "Newcomer Resources",
    relatedSlugs: ["bc-glp-changes-2026", "defensive-driving", "pass-road-test"],
    content: (
      <>
        <p>
          This article is a focused starting point for an ordinary passenger-vehicle driver moving
          to British Columbia. It covers the main licence and vehicle deadlines, shows where to find
          the correct licensing path, and explains five road rules that are easy to misread. It does
          not cover commercial or motorcycle licensing, and ICBC must decide how a particular
          licence and driving record are recognized.
        </p>

        <h2>The general licence deadline is 90 days</h2>
        <p>
          ICBC says that after moving to B.C., a person generally has <strong>90 days</strong> to
          switch a valid licence to a B.C. driver's licence. Start early if testing or document
          verification may be required. See ICBC's current{" "}
          <a
            href="https://www.icbc.com/driver-licensing/moving-bc"
            target="_blank"
            rel="noopener noreferrer"
          >
            moving-to-B.C. hub
          </a>{" "}
          before relying on the deadline.
        </p>
        <p>
          ICBC identifies exceptions to that general rule for a tourist visiting for up to six
          months, a full-time student who has a valid exemption at a designated educational
          institution, a person ordinarily resident outside B.C., and a temporary foreign worker
          whose federal work permit places them in the Seasonal Agricultural Worker Program. ICBC
          says a qualifying worker in that program may drive on a valid home-jurisdiction licence for
          up to 12 months. Each exception has conditions; moving to B.C. does not by itself prove that
          an exception applies. Check the live list on ICBC's{" "}
          <a
            href="https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country"
            target="_blank"
            rel="noopener noreferrer"
          >
            moving from outside Canada page
          </a>{" "}
          or ask ICBC about your status.
        </p>

        <h2>Use the path that matches your licence and provable experience</h2>
        <p>
          The following four planning categories summarize common passenger-vehicle cases. They are
          not a substitute for ICBC's assessment, and the current exchange-jurisdiction list should
          be checked rather than copied from an old article.
        </p>
        <ol>
          <li>
            <strong>Licence from another Canadian province or territory:</strong> follow ICBC's{" "}
            <a
              href="https://www.icbc.com/driver-licensing/moving-bc/Moving-from-within-canada"
              target="_blank"
              rel="noopener noreferrer"
            >
              within-Canada exchange instructions
            </a>.
          </li>
          <li>
            <strong>Licence from an exchange jurisdiction outside Canada:</strong> an eligible
            non-commercial licence may be exchanged without the usual knowledge and road tests.
            Confirm that the jurisdiction and licence class appear on ICBC's live exchange list.
          </li>
          <li>
            <strong>Licence from a non-exchange jurisdiction:</strong> ICBC says a knowledge test and
            road test are required. Provable full-privilege driving experience affects whether the
            driver can seek a Class 5 licence without entering GLP.
          </li>
          <li>
            <strong>Less than two years of full-privilege experience, or no acceptable proof:</strong>{" "}
            ICBC says the driver enters the Graduated Licensing Program (GLP). A person who does not
            already hold a licence follows ICBC's new-driver process.
          </li>
        </ol>
        <p>
          ICBC's complete{" "}
          <a
            href="https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country"
            target="_blank"
            rel="noopener noreferrer"
          >
            outside-Canada instructions
          </a>{" "}
          explain the exchange and testing routes. Our separate{" "}
          <Link to="/newcomers-guide">B.C. driver's licence decision guide</Link> walks through these
          paths in more detail.
        </p>

        <h2>Bring documents ICBC accepts, not a generic checklist</h2>
        <p>
          ICBC's outside-Canada application list includes accepted identification, the current
          driver's licence, the applicable licence fees and proof of driving experience. Its{" "}
          <a
            href="https://www.icbc.com/driver-licensing/visit-dl-office/Accepted-ID"
            target="_blank"
            rel="noopener noreferrer"
          >
            accepted-ID page
          </a>{" "}
          currently calls for one primary and one secondary piece of ID and explains additional
          requirements. Document needs can vary with immigration status, issuing jurisdiction,
          licence class and name history, so verify the current list for your appointment.
        </p>
        <p>
          Proof of at least <strong>two years</strong> with a full-privilege, non-learner licence is
          needed for a GLP exemption. ICBC's{" "}
          <a
            href="https://www.icbc.com/driver-licensing/moving-bc/Proving-your-driving-experience"
            target="_blank"
            rel="noopener noreferrer"
          >
            driving-experience page
          </a>{" "}
          describes acceptable records and special instructions by jurisdiction. If a licence,
          driving record or ID needs translation, use an ICBC-approved translator and present the
          original document, or a copy that a driver licensing office has approved and stamped,
          with the translation. ICBC may also hold an application while it verifies documents.
        </p>
        <p>
          A person may legally hold only one driver's licence in B.C. ICBC says the previous licence
          must be surrendered when the person qualifies for the new B.C. licence. If a required road
          test is unsuccessful, ICBC says it issues a B.C. learner's licence and does not return the
          previous licence.
        </p>

        <h2>A personal vehicle has a separate 30-day deadline</h2>
        <p>
          The driver's-licence deadline and the vehicle deadline are different. If you bring your
          personal vehicle to B.C., ICBC says you have <strong>30 days after arriving</strong> to
          register, license and insure it in B.C.; commercial vehicles must be handled immediately.
          Import, inspection and exemption requirements depend on the vehicle and where it came
          from. Start with ICBC's{" "}
          <a
            href="https://www.icbc.com/insurance/moving-travelling/moving-BC"
            target="_blank"
            rel="noopener noreferrer"
          >
            moving and insurance page
          </a>{" "}
          and confirm the required documents with an Autoplan broker.
        </p>

        <h2>Five B.C. road rules to check</h2>

        <h3>1. A right turn may be made on a steady red only after stopping and yielding</h3>
        <p>
          Under section 129 of B.C.'s Motor Vehicle Act, a driver facing a steady red light must stop
          before the near crosswalk, or before the intersection if there is no marked crosswalk. A
          right turn may then be made only if a sign does not prohibit it and after yielding to
          pedestrians and vehicles lawfully proceeding through the intersection. The turn must also
          be safe. This permission applies to a <strong>steady red light</strong>; it is not permission
          to turn against a red arrow or another signal controlling the lane. See the official{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act, sections 129–130
          </a>.
        </p>

        <h3>2. A signed school zone is 30 km/h on regular school days</h3>
        <p>
          Where a school-zone sign displays 30 km/h, section 147 requires a maximum of 30 km/h on a
          regular school day from <strong>8 a.m. to 5 p.m.</strong>, or for the longer times stated on
          the sign. A school warning sign without a 30 km/h tab does not create that 30 km/h limit;
          read the whole sign and continue to watch for children.
        </p>

        <h3>3. A signed public playground zone is 30 km/h from dawn to dusk</h3>
        <p>
          The same section sets a 30 km/h maximum when approaching or passing a public playground
          between <strong>dawn and dusk</strong> where signs display that limit or prominently show
          “30.” Unlike the school-zone rule, the statute does not restrict the playground rule to
          school days. Read B.C.'s current{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05"
            target="_blank"
            rel="noopener noreferrer"
          >
            Motor Vehicle Act, section 147
          </a>{" "}
          for both zone rules.
        </p>

        <h3>4. Class 7 L and N drivers have a broader electronic-device ban</h3>
        <p>
          All drivers are prohibited from holding or operating a hand-held communication or
          computing device, watching its screen, or sending and receiving text-based messages while
          driving. The regulation permits limited hands-free, audio and navigation uses for drivers
          who meet its installation and operation conditions—but those permissions do not apply to
          drivers with a Class 7 learner or novice licence. RoadSafetyBC describes the Class 7 rule
          as a ban on electronic-device use while driving, including hands-free units and navigation
          devices, with limited exceptions for being safely parked off the roadway or making an
          emergency call. Check the Government of B.C.'s{" "}
          <a
            href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/high-risk/distracted/electronic-devices"
            target="_blank"
            rel="noopener noreferrer"
          >
            electronic-device rules
          </a>{" "}
          and the current{" "}
          <a
            href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/308_2009"
            target="_blank"
            rel="noopener noreferrer"
          >
            regulation
          </a>.
        </p>

        <h3>5. Winter-tire dates apply on designated, signed routes</h3>
        <p>
          Winter tires or chains are required on most designated routes from <strong>October 1 to
          April 30</strong>; requirements on some routes end March 31. The regulatory signs on the
          highway identify where the rule applies, and authorities may restrict travel when
          conditions require it. For a standard passenger vehicle, a legal winter tire must show
          either the letters M and S or the three-peaked mountain-and-snowflake symbol and have at
          least <strong>3.5 mm</strong> of tread depth. Review the Province's current{" "}
          <a
            href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/traveller-information/seasonal/winter-driving/winter-tire-and-chain-up-routes"
            target="_blank"
            rel="noopener noreferrer"
          >
            designated-route maps and dates
          </a>{" "}
          and{" "}
          <a
            href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/traveller-information/seasonal/winter-driving/about-winter-tires"
            target="_blank"
            rel="noopener noreferrer"
          >
            passenger-tire requirements
          </a>{" "}
          before travelling.
        </p>

        <h2>GLP changes on October 19, 2026</h2>
        <p>
          B.C.'s passenger-vehicle GLP changes on <strong>October 19, 2026</strong>. The learner-to-
          novice road test remains. For eligible novice drivers, a Driving Record Assessment replaces
          the later road test used to move to a Class 5 licence, followed by a 12-month restricted
          Class 5 stage. Age, time in the novice stage and the driving record affect eligibility.
          These changes do not turn a non-exchange foreign licence into an exchangeable licence. Read
          ICBC's{" "}
          <a
            href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
            target="_blank"
            rel="noopener noreferrer"
          >
            official GLP changes page
          </a>{" "}
          and our source-linked{" "}
          <Link to="/blog/bc-glp-changes-2026">October 19 GLP guide</Link> for the transition details.
        </p>

        <h2>Optional local driving feedback</h2>
        <p>
          Professional instruction is optional. Shanaya's Driving School is independent from ICBC;
          it cannot decide licence-exchange eligibility, approve documents, issue a licence or
          guarantee a test result. A driver who wants optional local feedback can review our{" "}
          <Link to="/driving-lessons">driving lessons</Link>. Official licensing decisions and
          current legal requirements remain with ICBC and the Province of B.C.
        </p>

        <h2>Official sources</h2>
        <p>
          Sources were reviewed on July 21, 2026. Rules and service procedures can change; use the
          linked official pages to confirm the current requirements for your circumstances.
        </p>
        <ul>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/moving-bc/moving-from-another-country"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Moving from outside Canada
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/moving-bc/Moving-from-within-canada"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Moving from within Canada
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/moving-bc/Proving-your-driving-experience"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Proving your driving experience
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/insurance/moving-travelling/moving-BC"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Moving to, from or within B.C.
            </a>
          </li>
          <li>
            <a
              href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/96318_05"
              target="_blank"
              rel="noopener noreferrer"
            >
              B.C. Laws: Motor Vehicle Act, Part 3
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/roadsafetybc/high-risk/distracted/electronic-devices"
              target="_blank"
              rel="noopener noreferrer"
            >
              Government of B.C.: Use of electronic devices while driving
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/traveller-information/seasonal/winter-driving/winter-tire-and-chain-up-routes"
              target="_blank"
              rel="noopener noreferrer"
            >
              Government of B.C.: Designated winter tire and chain routes
            </a>
          </li>
          <li>
            <a
              href="https://www.icbc.com/driver-licensing/new-drivers/graduated-licensing-program-changes"
              target="_blank"
              rel="noopener noreferrer"
            >
              ICBC: Changes to the Graduated Licensing Program
            </a>
          </li>
        </ul>
      </>
    ),
  },
];
