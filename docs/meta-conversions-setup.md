# Meta conversions: implementation and activation

Implemented locally on 2026-10-18. Sending is disabled by default. Nothing has been deployed or sent to Meta during implementation.

## Completed

- Website submissions carry a unique Meta event ID and available `_fbc`/`_fbp` identifiers. A Meta click keeps its original click timestamp across navigation in the current tab.
- `submit-lead` replaces client-supplied network identity with request context. The direct-insert fallback has no server request identity, but still queues matching contacts and available browser identifiers.
- A database trigger queues new website leads and student stage changes regardless of whether updates go through the admin API, direct admin writes or the submission RPC. Hiring leads, untracked/manual records and explicit sharing opt-outs are excluded.
- A signed Meta leadgen webhook commits notifications to an inbox before acknowledging them. A worker retrieves the answers and inserts Meta-labelled leads idempotently, preserving long Meta IDs as strings.
- The worker normalizes/hashes email and phone, sends available matching identifiers, and records delivery status. It does not send assessment answers, ages, inferred locations, hiring applications or revenue values.
- Queue workers use bounded batches, expiring leases and fencing tokens. Failed sends retry up to eight attempts using the same event ID and original timestamp. Successfully delivered stages are not resent when an admin moves a lead back and forth.
- Browser `Lead` events use the same stored ID as server events. Browser conversion sending is separately disabled until the GTM setup has been checked.
- Test mode requires a Test Event Code. Production mode never includes that code. Delivery mode and the chosen event name are pinned before sending, so an ambiguous timeout cannot be retried accidentally in a different mode.

A focused privacy-policy review and proposed policy/form wording are prepared in [the disclosure draft](meta-privacy-copy-draft.md). They remain draft-only pending confirmation of the actual practices.

## Still needed from the owner

| Item | Where it is used |
| --- | --- |
| Confirmed dataset/Pixel ID | `META_DATASET_ID`; `VITE_META_PIXEL_ID` if this app installs the browser Pixel |
| Dataset-authorized CAPI access token | Supabase secret `META_CAPI_ACCESS_TOKEN` |
| Test Event Code | `META_TEST_EVENT_CODE` |
| Confirmed supported Graph API version | `META_GRAPH_API_VERSION` (include the `v` prefix) |
| Canonical HTTPS website origin | `META_SITE_ORIGIN`, e.g. the actual production domain without a page path |
| Which forms are used: website, Instant Forms, both | Determines whether leadgen is enabled |
| Qualified/Booked definitions and final event names | `META_EVENT_QUALIFIED`, `META_EVENT_BOOKED`; optionally `META_EVENT_UNQUALIFIED` |
| GTM/Pixel configuration and relevant account access | Validate installation, deduplication and Events Manager results |
| Confirmation of applicable data-sharing disclosures/consent | Required before enabling production sharing; marketing contact consent is not treated as a measurement permission automatically |
| For Instant Forms only: Page ID, Page access token, Meta app secret and verification token | `META_PAGE_ID`, `META_PAGE_ACCESS_TOKEN`, `META_APP_SECRET`, `META_WEBHOOK_VERIFY_TOKEN` |

Tokens and secrets belong in Supabase secrets/Vault, never chat, source control or `VITE_` variables. Only public browser configuration belongs in Vite build settings.

## Files

- Migration: `supabase/migrations/20261018010000_meta_conversions.sql`
- Sender and inbox processor: `supabase/functions/meta-conversions-worker/index.ts`
- Public signed callback: `supabase/functions/meta-leadgen-webhook/index.ts`
- Secret-name template: `supabase/functions/meta-conversions-worker/.env.example`
- Scheduler setup: `supabase/setup/meta-conversions-schedule.sql`
- Frontend template: `.env.example`

## Activation sequence

1. Review the migration against the connected database's actual `leads` schema. The base leads table was created outside source control. Confirm the student-status migration is applied. Review other pending migrations before any `db push`; do not apply unrelated migrations blindly. The new migration adds metadata columns, private queues, claim functions and an enqueue trigger; it does not backfill old leads or make network calls.
2. Deploy the updated `submit-lead`, then the two new functions. Their JWT configuration lives in `supabase/config.toml`; the webhook uses an HMAC signature and the worker uses `x-meta-worker-secret`.

   ```sh
   supabase functions deploy submit-lead
   supabase functions deploy meta-leadgen-webhook
   supabase functions deploy meta-conversions-worker
   ```

3. Configure secrets from the template securely. Generate a random worker secret, e.g. using `openssl rand -hex 32`. Start with `META_CAPI_ENABLED=false` and `META_LEADGEN_ENABLED=false`. Configure the dataset, token, Graph version, canonical origin and Test Event Code. Configure approved downstream names, or leave those names blank to hold those stages pending. No event-name/qualification definitions are assumed.
4. Enable test delivery with `META_CAPI_ENABLED=true`, `META_CAPI_MODE=test`. Submit a fresh website lead, then call the worker once from a trusted server/terminal with the `x-meta-worker-secret` header. The request body can be `{}`. Calls without the correct secret are rejected. Verify the event in Events Manager, including matching identifiers and the event ID.
5. Install the recurring worker using `supabase/setup/meta-conversions-schedule.sql`. Store `meta_worker_url` and `meta_worker_secret` in Supabase Vault first, matching the Edge Function URL and secret. The schedule calls the worker once per minute; batches process at most 20 inbox items and 20 events. Monitor backlog and increase capacity only if necessary.
6. If using Instant Forms, configure the Page token, Page ID, app secret and verification token, then set `META_LEADGEN_ENABLED=true`. Set the app's Page `leadgen` callback to `https://<project-ref>.supabase.co/functions/v1/meta-leadgen-webhook`, complete verification and subscribe the actual Page to `leadgen`. Use Meta's test-lead tooling to verify receipt, retrieval and the `Meta` source label. No Page subscriptions were created locally.
7. Audit the published GTM container and Pixel installation. Keep one deliberate installation. Enable `VITE_META_LEAD_EVENTS_ENABLED=true` only if this app should send browser Lead events; rebuild the website for Vite variables to take effect. If GTM already sends Lead, configure its event ID to match the stored ID or keep app browser Lead sending off. The frontend already has a separate GTM `lead_submit` event; it must not create a second independent Meta conversion.
8. Submit test leads and exercise Qualified/Booked status changes. Check deduplication, stage names, Diagnostics, token failures and retries. A local test or successful HTTP response alone does not establish account-side attribution or match quality.
9. After owner confirmation, change `META_CAPI_MODE=production`; use fresh submissions for production verification. Test-sent rows remain test-sent and are not replayed into production. Rows attempted in another mode are held with `delivery_mode_changed`; do not bulk-reset them. Any replay needs a deliberate review of whether Meta already received the original event.

The sender is prepared for website form Lead events and subsequent system-generated stage events, and Instant Form CRM stage feedback. Validate final downstream event eligibility/payloads in the account before choosing the campaign's optimisation target. A Booked stage is not a Purchase event.

## Monitoring and recovery

Inspect only through trusted service-role tooling or the SQL editor. These tables are inaccessible to anonymous and regular authenticated users.

```sql
select status, delivery_mode, count(*)
from public.meta_conversion_events group by status, delivery_mode;

select id, stage, attempts, last_error, next_attempt_at
from public.meta_conversion_events
where status in ('failed', 'pending', 'processing')
order by created_at;

select status, attempts, last_error, count(*)
from public.meta_leadgen_inbox group by status, attempts, last_error;
```

- `sent` means Meta returned one accepted event. Verify actual receipt and matching in Events Manager.
- `failed` rows with fewer than eight attempts retry after their due time. Interrupted workers are reclaimed after five minutes; exhausted interrupted claims become failed.
- `stage_not_configured` leaves the stage pending without consuming attempts. After configuring the name, it is retried within an hour. Keep names stable after activation.
- `delivery_mode_changed` holds a previously attempted row without sending. Restore its original mode or investigate individually.
- `event_too_old` skips events seven days old or older. Never change the original timestamp to make an old event appear new. The applicable CRM freshness/attribution rules still need account-side confirmation; this implementation uses a conservative seven-day delivery cutoff for all channels.
- Graph errors store numeric HTTP/code/subcode identifiers only. Raw Graph responses, tokens and contact values are not logged. Inspect error codes with Meta's tools to distinguish expired credentials from permission or payload issues.
- After a configuration fix, retry an individual failed event by resetting its attempts and due time only after reviewing its delivery mode and age. Keep its event ID and event time unchanged. Never reset sent events in bulk.
- Queue snapshots contain contact matching data and must remain private. Set an appropriate retention period for this business; snapshots can be cleared after the chosen retention period for sent/skipped rows while preserving event IDs and delivery metadata. No automatic retention period has been invented.
- Website Meta source labels describe stored tracking evidence, not proof of a paid ad impression. Historical CSVs remain unchanged; there is no historical attribution backfill.

## Local verification

Run focused tests:

```sh
npm run test:meta
```

The database regression script `supabase/tests/meta_conversions.sql` is for an empty disposable PostgreSQL database with the migration applied. It asserts trigger coverage, excluded records, minimal immutable snapshots, stage deduplication, retries, leases/fencing, exhausted claims, inbox idempotency, exact Meta IDs and permissions, then rolls back. It must not be run against production queues.

Implementation validation used an isolated PGlite PostgreSQL database with a minimal `leads` fixture. Deno checks cover the actual Edge Function imports. Neither substitutes for validating the pre-existing live schema, cron/Vault configuration, real Meta responses, authenticated admin rendering or GTM behavior.

## Sources

- [Supabase scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions): cron, pg_net and Vault pattern.
- [Meta Parameter Builder](https://github.com/facebook/capi-param-builder/blob/main/nodejs/README.md): matching parameters and hashing.
- [Meta Business SDK user data model](https://github.com/facebook/facebook-python-business-sdk/blob/main/facebook_business/adobjects/serverside/user_data.py): raw string lead IDs and supported identifiers.

The Meta CRM guide was inaccessible during the check. Account-specific permissions, downstream event configuration and current API eligibility still require verification before activation.

Validation completed on 2026-10-18: 39 focused tests passed, the migration and 20 database assertions passed in isolated PostgreSQL, Deno type checks passed for both new functions and `submit-lead`, targeted ESLint passed, and Vite production compilation passed to a temporary output directory. Application-wide TypeScript checking still reports errors in pre-existing unrelated files; no errors were reported in the changed application files. Existing large-bundle and Browserslist warnings remain. No live tests, deployment, migration application or account changes have occurred.
