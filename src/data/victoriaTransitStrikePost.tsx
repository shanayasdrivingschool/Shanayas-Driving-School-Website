import { Link } from "react-router-dom";
import type { BlogPostData } from "./blogPosts";

const transitNotice = "https://www.bctransit.com/unifor-local-333-to-commence-strike-action-on-friday-november-27-2026-11-20/";
const unionNotice = "https://www.unifor.org/news/all-news/victoria-transit-workers-walk-job-november-27-bc-transit-refuses-arbitration";
const rollingStrikeNotice = "https://www.bctransit.com/bc-transit-advising-customers-of-rolling-strikes-as-early-as-november-17-2026-11-16/";
const transitAlerts = "https://alerts.bctransit.com/victoria/";
const cover = "/blog/victoria-transit-strike-cover-1200.webp";
const coverAlt = "AI-generated editorial illustration of a city bus and people waiting at a rainy coastal bus stop.";
const coverSrcSet = "/blog/victoria-transit-strike-cover-480.webp 480w, /blog/victoria-transit-strike-cover-800.webp 800w, /blog/victoria-transit-strike-cover-1200.webp 1200w";

export const victoriaTransitStrikePost: BlogPostData = {
  slug: "victoria-transit-strike-november-27-2026",
  title: "Victoria Transit Strike Planned for November 27: What Is Confirmed",
  seoTitle: "Victoria Transit Strike Nov. 27: Confirmed Service Plan",
  description: "BC Transit confirms a November 27, 2026 bus suspension. Read the service exceptions, picket locations and travel checklist for Victoria and the Westshore.",
  heroImage: cover,
  heroImageAlt: coverAlt,
  heroImageSrcSet: coverSrcSet,
  heroImageWidth: 1200,
  heroImageHeight: 751,
  author: "Shanaya's Driving School",
  date: "November 24, 2026",
  datePublished: "2026-11-24",
  dateModified: "2026-11-24",
  readTime: "4 min read",
  category: "Greater Victoria Travel Updates",
  relatedSlugs: [],
  content: (
    <>
      <p>
        <strong>BC Transit and Unifor have announced a one-day Victoria transit strike for
        Friday, November 27, 2026.</strong> The employer&apos;s <a href={transitNotice} target="_blank" rel="noopener noreferrer">service notice</a>{" "}
        confirms a planned fixed-route bus suspension, with exceptions for Victoria handyDART and
        interregional routes 66 and 99. For Victoria, Langford and Westshore riders, the immediate
        task is to check every connection and arrange a return trip.
      </p>
      <figure className="my-8">
        <img
          src={cover}
          srcSet={coverSrcSet}
          sizes="(min-width: 1024px) 608px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
          width={1200}
          height={751}
          alt={coverAlt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-xl"
        />
        <figcaption className="mt-3 text-sm leading-relaxed text-slate-500">
          AI-generated editorial illustration. This is not a photograph of the strike or a
          specific bus stop; the service information below comes from the official notices.
        </figcaption>
      </figure>
      <div className="my-6 border-l-4 border-[#1d52a1] bg-slate-50 p-5">
        <p className="!mb-2"><strong>News check: November 24, 2026.</strong> The announced action is scheduled for November 27. Actual service arrangements may change while bargaining continues.</p>
        <a href={transitAlerts} target="_blank" rel="noopener noreferrer">Check current Victoria transit alerts before leaving</a>
      </div>

      <h2>Which services are affected on November 27?</h2>
      <p>
        This table summarises <a href={transitNotice} target="_blank" rel="noopener noreferrer">BC Transit&apos;s November 20 notice</a>.
        The dates refer to local time in British Columbia.
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
        <table style={{ minWidth: 0 }}>
          <caption>Announced service plan for Friday, November 27, 2026</caption>
          <thead><tr><th scope="col" style={{ width: "38%" }}>Service</th><th scope="col">Announced arrangement</th></tr></thead>
          <tbody>
            <tr><th scope="row">Victoria regional fixed-route buses</th><td>Suspended for the day.</td></tr>
            <tr><th scope="row">Victoria handyDART</th><td>Not part of this labour dispute.</td></tr>
            <tr><th scope="row">Route 66 (CVX)</th><td>Cowichan–Victoria Express is scheduled to run. Stops behind picket lines will not be served.</td></tr>
            <tr><th scope="row">Route 99 (SVX)</th><td>Shawnigan Lake–Victoria Express is scheduled to run, with the same picket-line stop restriction.</td></tr>
            <tr><th scope="row">Fixed-route service return</th><td>Scheduled for Saturday, November 28. Recheck alerts before travelling.</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        A trip on route 66 or 99 may still leave you without a local connection. BC Transit&apos;s{" "}
        <a href={rollingStrikeNotice} target="_blank" rel="noopener noreferrer">earlier rolling-strike advisory</a>{" "}
        specifically warns that local conventional service will not be available beyond designated
        drop-off points during a regional suspension. Confirm how you will complete that final leg.
      </p>

      <h2>Where are pickets planned?</h2>
      <p>
        The <a href={transitNotice} target="_blank" rel="noopener noreferrer">November 20 notice</a>{" "}
        lists the Victoria Transit Centre, BC Transit&apos;s head office at <strong>520 Gorge Road East</strong>,
        and the Langford Transit Centre at <strong>1000 Henry Eng Place</strong>.
      </p>
      <p>
        BC Transit&apos;s <a href={rollingStrikeNotice} target="_blank" rel="noopener noreferrer">office-access guidance</a>{" "}
        says the head office closes to the public while pickets are present. Taxi Saver vouchers
        and handyDART fare products normally sold there will be temporarily unavailable; online
        store purchases may also be affected. The office-sales interruption is separate from
        handyDART&apos;s status in the dispute.
      </p>

      <h2>What led to the November 27 announcement?</h2>
      <p>
        <a href={unionNotice} target="_blank" rel="noopener noreferrer">Unifor&apos;s November 20 statement</a>{" "}
        says Local 333-BC represents approximately 790 operators and mechanics, and their collective
        agreement expired on March 31, 2025. The union says it proposed mediation and binding
        arbitration, and that BC Transit declined arbitration. These bargaining claims are
        attributed to Unifor, rather than presented as an independent finding by the school.
      </p>
      <p>
        <a href={transitNotice} target="_blank" rel="noopener noreferrer">BC Transit&apos;s response</a>{" "}
        says it remains committed to negotiations and hopes to reach a fair, sustainable agreement.
        Its service notice does not provide a detailed response to the union&apos;s arbitration claim.
      </p>
      <ol>
        <li><strong>November 16:</strong> BC Transit <a href={rollingStrikeNotice} target="_blank" rel="noopener noreferrer">warned of possible rolling disruptions</a>. That advisory describes staged action whose pattern could change.</li>
        <li><strong>November 20:</strong> the employer and union published the linked announcements identifying November 27 as the planned one-day action.</li>
        <li><strong>Before your journey:</strong> check for a revised notice or agreement. A published plan establishes what was announced, not what has already happened.</li>
      </ol>

      <h2>What should Westshore riders arrange now?</h2>
      <p>
        For a Langford-to-Victoria commute, a class or an appointment, plan the complete door-to-door
        journey. A ride into town is only half a plan if your return depends on an unavailable connection.
        Use this checklist with everyone involved in the trip:
      </p>
      <ol>
        <li><strong>Write down the journey.</strong> Record the destination, required arrival time, bus routes and transfers. Identify which part of the journey needs an alternative.</li>
        <li><strong>Confirm the alternative directly.</strong> Ask a household member or friend about a ride, or check a taxi or ride-hailing option with its provider. Confirm the booking and fare; this article does not establish availability.</li>
        <li><strong>Ask about flexibility early.</strong> Contact your employer, school or appointment provider about a different time or remote option. An announced transit disruption does not itself confirm a change to their arrangements.</li>
        <li><strong>Include the return trip.</strong> Agree on a pickup location, time, contact number and backup if the first arrangement falls through.</li>
        <li><strong>Recheck before travelling.</strong> Open the official alert page the evening before and again before departure. Check the date of any screenshot or forwarded message.</li>
      </ol>
      <p>
        Keep the plan in one message that everyone helping with transport can read. Include the
        person to contact if you will be late. This avoids arranging a lift while leaving the
        meeting point or return time unresolved.
      </p>

      <h2>If you have a driving lesson or ICBC appointment</h2>
      <p>
        Tell your instructor if you normally take a bus to your lesson meeting point. Confirm the
        meeting location and time before changing your travel arrangements. If your appointment
        is with ICBC, use your booking confirmation to contact ICBC about any change you need.
        The transit notice does not confirm cancellation of an individual road test.
      </p>
      <p>
        Shanaya&apos;s students can <Link to="/contact">contact our team</Link> with their lesson
        date and travel concern. We can discuss the booking; any pickup or rescheduling arrangement
        must be confirmed individually. Existing school policies continue to apply.
      </p>

      <h2>Sources and updates</h2>
      <p>
        Shanaya&apos;s Driving School prepared this local news summary from the following primary
        sources, checked November 24, 2026. It is a dated report, not a live transit-status feed.
      </p>
      <ul>
        <li><a href={transitNotice} target="_blank" rel="noopener noreferrer">BC Transit: November 20 service announcement</a> — planned suspension, exceptions, locations and return date.</li>
        <li><a href={unionNotice} target="_blank" rel="noopener noreferrer">Unifor: November 20 strike announcement</a> — union membership and its account of bargaining.</li>
        <li><a href={rollingStrikeNotice} target="_blank" rel="noopener noreferrer">BC Transit: November 16 rolling-strike advisory</a> — background, connections and office-access implications.</li>
        <li><a href={transitAlerts} target="_blank" rel="noopener noreferrer">Victoria transit alerts</a> — check here for changes affecting your journey.</li>
      </ul>
    </>
  ),
};
