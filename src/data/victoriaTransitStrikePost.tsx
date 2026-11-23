import { Link } from "react-router-dom";
import type { BlogPostData } from "./blogPosts";

const transitNotice = "https://www.bctransit.com/unifor-local-333-to-commence-strike-action-on-friday-november-27-2026-11-20/";
const unionNotice = "https://www.unifor.org/news/all-news/victoria-transit-workers-walk-job-november-27-bc-transit-refuses-arbitration";
const transitAlerts = "https://alerts.bctransit.com/victoria/";

export const victoriaTransitStrikePost: BlogPostData = {
  slug: "victoria-transit-strike-november-27-2026",
  title: "Victoria Bus Strike Planned for November 27: A Westshore Travel Guide",
  seoTitle: "Victoria Bus Strike Nov. 27, 2026: Service Exceptions",
  description: "Planning travel in Victoria or Langford on November 27? Check the announced bus suspension, handyDART and route exceptions, and a backup-trip checklist.",
  heroImage: "/blog/victoria-transit-strike-november-27-2026.webp",
  author: "Shanaya's Driving School",
  date: "November 24, 2026",
  datePublished: "2026-11-24",
  dateModified: "2026-11-24",
  readTime: "3 min read",
  category: "Greater Victoria Travel Updates",
  relatedSlugs: [],
  content: (
    <>
      <p>
        <strong>BC Transit has announced a suspension of Victoria Regional Transit System
        fixed-route buses for Friday, November 27, 2026.</strong> Its{" "}
        <a href={transitNotice} target="_blank" rel="noopener noreferrer">November 20 service notice</a>{" "}
        identifies exceptions for Victoria handyDART and interregional routes 66 and 99.
        Riders in Victoria, Langford and the Westshore should check their whole journey before
        relying on a bus connection.
      </p>
      <p>
        <strong>Information checked November 24, 2026.</strong> This is a dated travel-planning
        summary from Shanaya&apos;s Driving School. The announced arrangements may change as
        the dispute develops. Check the{" "}
        <a href={transitAlerts} target="_blank" rel="noopener noreferrer">official Victoria transit alerts</a>{" "}
        again before travelling.
      </p>

      <h2>Which services are affected on November 27?</h2>
      <p>The <a href={transitNotice} target="_blank" rel="noopener noreferrer">BC Transit notice</a> sets out these arrangements:</p>
      <ul>
        <li><strong>Victoria regional fixed-route buses:</strong> suspended for the day.</li>
        <li><strong>Victoria handyDART:</strong> outside this labour dispute.</li>
        <li><strong>Route 66, Cowichan–Victoria Express, and Route 99, Shawnigan Lake–Victoria Express:</strong> scheduled to run, but stops behind picket lines will not be served.</li>
        <li><strong>Saturday, November 28:</strong> the announced date for fixed-route service to return. Recheck alerts for your trip.</li>
      </ul>
      <p>
        If your journey combines an interregional bus with a local transfer, check both legs.
        One operating route does not establish that your onward connection will be available.
      </p>

      <h2>Why is a strike planned?</h2>
      <p>
        In its{" "}
        <a href={unionNotice} target="_blank" rel="noopener noreferrer">November 20 announcement</a>,
        Unifor Local 333-BC said it planned a one-day strike and that BC Transit had declined
        binding arbitration. The union says it represents about 790 operators and mechanics,
        whose agreement expired March 31, 2025. These are the union&apos;s statements about
        negotiations; BC Transit&apos;s notice says it remains committed to bargaining.
      </p>

      <h2>Make a backup plan for work, school or an appointment</h2>
      <p>
        Write down the arrangements for each essential trip before Friday. A useful plan covers
        the return journey as well as getting there:
      </p>
      <ol>
        <li><strong>List every connection.</strong> Record your routes, transfer points and latest acceptable arrival time.</li>
        <li><strong>Confirm your alternative.</strong> Ask a friend or household member about a ride, or check a taxi or ride-hailing booking directly with the provider. Do not assume a vehicle or fare is guaranteed.</li>
        <li><strong>Arrange flexibility early.</strong> Ask your employer, school or appointment provider whether a different time or remote option is possible.</li>
        <li><strong>Plan the journey home.</strong> Confirm the pickup place, time and contact number with whoever is helping.</li>
        <li><strong>Keep the alert link handy.</strong> Check it the evening before and again before leaving, rather than relying only on a shared screenshot.</li>
      </ol>

      <h2>If you have a driving lesson or road test booked</h2>
      <p>
        Contact your instructor about the meeting point and timing if you normally travel by bus.
        For an ICBC appointment, check your booking confirmation and contact ICBC about any
        change you need; the transit announcement is not a notice about your individual appointment.
      </p>
      <p>
        If your lesson is with Shanaya&apos;s, <Link to="/contact">contact our team</Link> with
        your lesson date and travel concern so we can discuss your booking. Any pickup or
        rescheduling arrangement needs to be confirmed individually. This article does not
        announce a change to school services or booking policies.
      </p>

      <h2>Where to check for changes</h2>
      <p>
        Use <a href={transitAlerts} target="_blank" rel="noopener noreferrer">BC Transit&apos;s Victoria alerts</a>{" "}
        for travel updates and the linked employer and union announcements for their respective
        statements. The dates above refer specifically to November 2026; this article is not
        a live service-status feed.
      </p>
    </>
  ),
};
