# Meta conversions review

Historical review snapshot: 2026-10-18, before implementation. Backend code has since been added locally; see [the implementation and activation guide](meta-conversions-setup.md) for current status.

Repository and supplied CSV inspection: 2026-10-18. Scope: local code, not a live Meta/Supabase account audit.

## Current state

| Area | Finding |
| --- | --- |
| Website leads | `submit-lead` saves form submissions; it does not send Meta server events. |
| Browser tracking | `MarketingScripts.tsx` supports an optional `VITE_META_PIXEL_ID` and sends `PageView`. This variable is absent from the inspected local `.env`. GTM may have additional tags; its published container was not inspected. |
| Lead confirmation | `analytics.ts` pushes `lead_submit` to GTM after successful submissions. This alone does not establish Meta delivery. |
| CRM feedback | No `meta-crm-events` or `meta-leadgen-webhook` functions, Meta event-log migration, or Meta delivery trigger/retry job were found. The existing CRM document is a plan. |
| Student stages | `new`, `contacted`, `qualified`, `booked`, `unqualified`, `lost` exist locally. The older CAPI plan still uses hiring vocabulary. |
| Export | All 35 rows in `Leads-and-conversion/leads_rows.csv` lack campaign attribution and Meta lead IDs. Page paths identify submission location, not acquisition source. |
| Customer Match | The customer-contact CSV is an audience-upload file, not an event feed. Contact details alone do not prove a Meta ad origin or contain the event time/stage needed for conversion reporting. |

## What is needed

### Website form conversions

1. Confirm ownership and access for the intended Meta dataset/Pixel. The older plan lists dataset `833615842503533`; verify it in Events Manager before use.
2. Generate an access token authorized for that dataset and store it as a **Supabase server secret**, never a `VITE_` variable. Confirm a currently supported Graph API version instead of copying the version in the old plan.
3. Implement a server event sender after a lead is durably saved. Include the event name, actual occurrence time in UNIX seconds, appropriate action source, website event URL, and matching customer information. Normalize/hash supported contact fields server-side. Collect valid available `fbc`/`fbp` and browser request context as appropriate; do not fabricate identifiers or locations.
4. If both Pixel and server send the same conversion, give both the same event name and stable event ID. Audit GTM first to prevent duplicate browser installations/conversions. The existing client lead ID only covers some forms and is not yet wired into Meta events.
5. Add an authenticated/internal sender, durable event outbox, delivery status, bounded retries and safe logging. Meta failures must not lose the lead or block an admin status update. Record the original event time and reuse event identity during retries.
6. Verify test events, failure recovery, browser/server deduplication and Diagnostics in Events Manager before declaring it live. Review the actual data-sharing disclosures/consent configuration before production sharing; this review makes no legal determination.

### Meta Instant Forms and CRM quality feedback (additional setup)

1. Confirm the Facebook Page, developer app, lead-access assignments and permissions needed for the chosen integration. Page lead retrieval and dataset event sending have separate access requirements; the old document's broad scope list is not a verified minimum.
2. Configure lead retrieval using a signed `leadgen` webhook or an approved connector. A custom webhook needs a Page access token, app secret, verification token, callback verification, signature validation and Page subscription. Save incoming work durably before acknowledging receipt, so an interrupted worker cannot lose a lead.
3. Store the original Meta lead ID and available form/ad/campaign identifiers. Keep long IDs as strings in the application/database to avoid JavaScript numeric precision loss. Record the source explicitly, e.g. `/meta-lead-ad` plus `payload.source: "meta"`.
4. Send the actual student stage transitions, excluding employee applications. Use `qualified` and `booked`, not `reviewed` and `shortlisted`; confirm the final event names/stage configuration against the connected dataset's CRM setup. `booked` is not proof of payment and must not automatically become a revenue event.
5. Cover all write paths, including direct admin saves and status updates. Use a server-side trigger/outbox or equivalent so feedback does not depend on an admin browser remaining open.

Website lead events and Instant Form CRM feedback are distinct paths. Website forms do not receive a Meta Instant Form lead ID; absence of that ID does not prevent website CAPI implementation.

## Changes implemented locally

- Capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid` and `gclid` on public routes and retain the latest tagged visit within the current browser tab.
- Add attribution to website lead payloads through the shared submission path, including the existing direct-insert fallback. Existing paid-page context and form answers are preserved.
- Show the acquisition source separately from the submission page on desktop and mobile lead layouts. Add source search and filtering. Meta/Facebook/Instagram UTMs, a stored Meta click ID, or an explicit Meta Instant Form marker identify Meta leads.
- Leave historical source as `Unknown` when no evidence exists. Neither a generic page path nor a Pixel browser cookie establishes a Meta origin. A Meta click/source label does not independently prove a paid impression or Meta attribution.
- No CSVs were changed. No data was uploaded to Meta, and no deployment/database update was performed.

For future Meta ad links, use `utm_source=meta&utm_medium=paid_social` and meaningful campaign/content values. For example: `/apply?utm_source=meta&utm_medium=paid_social&utm_campaign=lessons`. The platform may append `fbclid` automatically. Source labels are based on supplied tracking values, not independently authenticated ad attribution.

## Corrections needed in the older plan

- Its claim that nothing can match without an Instant Form lead ID is too broad for website conversions.
- Do not skip every duplicate event-log insert: failed/pending rows must remain retryable. Use a worker claim/lock and stable event identity; skip only work already completed or actively claimed.
- Do not acknowledge a webhook before work is durably queued.
- Do not coerce potentially long Meta IDs to JavaScript numbers.
- Do not send invented daily events as a heartbeat; retry real events and monitor inactivity separately.
- Do not treat regional business location as evidence of each customer's province/country.
- Token expiry, permissions, API version, event eligibility, match-rate targets and legal statements in that plan remain unverified.

## Validation and limits

- 10 targeted attribution tests passed, covering Meta aliases, navigation, campaign replacement, unknown sources and unavailable storage.
- ESLint passed for the changed source/test files.
- Vite production compilation passed using `/private/tmp/driving-school-capi-review-build`, preserving the existing `public_html` output. Existing large-bundle and outdated Browserslist warnings remain.
- Application TypeScript checking was attempted and failed in unchanged files including `Cart.tsx`, `Index.tsx` and several `replaceAll` users. No errors were reported in the changed files.
- Live Meta account configuration, Supabase secrets/deployed functions, GTM tags, authenticated admin rendering and real event delivery were not verified.

## Primary sources inspected

Meta developer documentation requests were blocked/rate-limited during this check. The official repositories below were accessible; they support the payload fields and parameter handling, but do not verify this business's account setup or the old plan's CRM claims.

- [Meta Parameter Builder, Node.js](https://github.com/facebook/capi-param-builder/blob/main/nodejs/README.md): request/cookie/query context, available identifiers, normalization/hashing and payload placement.
- [Meta Business SDK event model](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/serverside/event.py): event name, time, source URL, event ID, user data and action source.
- [Meta Business SDK user data model](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/serverside/user_data.py): matching fields.
