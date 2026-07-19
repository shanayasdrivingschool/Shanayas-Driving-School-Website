# Meta CRM Events (Conversions API for Leads) — Implementation Plan

Connect Supabase `public.leads` to Meta's Conversions API so lead-quality signals flow back to
the ad account and Advantage+ can optimise for students who actually book, not just form fills.

| Item | Value |
| --- | --- |
| Ad account | Driving School (`26569914862639062`) |
| Dataset ID | `833615842503533` |
| Endpoint | `https://graph.facebook.com/v25.0/833615842503533/events` |
| API version | `v25.0` |
| CRM of record | Supabase `public.leads` |

---

## 0. Why part 1 exists

Meta matches CRM events to ad impressions using the **`lead_id`** — a 15–17 digit number Meta
generates the moment someone submits an Instant Form. Nothing in `public.leads` captures it today,
and it is not recoverable after the fact except by CSV export.

**Until `lead_id` is stored on the lead row, no amount of CAPI work will match.** So ingestion
(Step 2) must ship before or alongside the event sender (Step 4).

```
Instant Form submit
  │
  ├─ [Step 2] Meta Leadgen webhook ──> edge fn `meta-leadgen-webhook`
  │                                      ├─ verify X-Hub-Signature-256
  │                                      ├─ GET /{leadgen_id} for field_data
  │                                      └─ INSERT leads (meta_lead_id, status='new')
  │                                                │
  ├─ [Step 4] on insert ─────────────────────────> │
  └─ [Step 4] admin changes status in AdminLeads ─>│
                                                   ↓
                             edge fn `meta-crm-events`
                               ├─ normalise + SHA-256 em / ph
                               ├─ dedupe via meta_crm_events log
                               └─ POST /833615842503533/events
```

---

## 1. Prerequisites (Business Manager, ~20 min, no code)

1. **System User token.** Business Settings → Users → System Users → Add. Assign the ad account
   `26569914862639062` and the dataset `833615842503533` with full control. Generate a token with
   scopes: `ads_management`, `leads_retrieval`, `pages_manage_metadata`, `pages_read_engagement`,
   `business_management`. Set expiry to **Never**.
2. **Page access token** for the `drivingschoolvictoria` Page (needed to read lead field data).
3. **App secret** from the Meta app used for the webhook subscription.
4. Store all three as Supabase secrets — never in `src/`, which ships to the browser:

   ```bash
   supabase secrets set META_CAPI_ACCESS_TOKEN=...
   supabase secrets set META_PAGE_ACCESS_TOKEN=...
   supabase secrets set META_APP_SECRET=...
   supabase secrets set META_WEBHOOK_VERIFY_TOKEN=...   # any random string you choose
   supabase secrets set META_DATASET_ID=833615842503533
   ```

---

## 2. Schema changes

New migration: `supabase/migrations/20260720010000_meta_crm_events.sql`

```sql
-- Capture Meta lead-ad identifiers on the lead row
alter table public.leads
  add column if not exists meta_lead_id      text,
  add column if not exists meta_form_id      text,
  add column if not exists meta_ad_id        text,
  add column if not exists meta_campaign_id  text,
  add column if not exists fbc               text,   -- click id, when available
  add column if not exists fbp               text;

create unique index if not exists leads_meta_lead_id_key
  on public.leads (meta_lead_id)
  where meta_lead_id is not null;

-- Dedupe + retry log. One row per (lead, stage) we have successfully told Meta about.
create table if not exists public.meta_crm_events (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references public.leads (id) on delete cascade,
  meta_lead_id  text not null,
  event_name    text not null,
  event_time    timestamptz not null default now(),
  status        text not null default 'pending'
                check (status in ('pending', 'sent', 'failed')),
  attempts      int  not null default 0,
  last_error    text,
  fbtrace_id    text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz,
  unique (meta_lead_id, event_name)
);

create index if not exists meta_crm_events_status_idx
  on public.meta_crm_events (status, created_at);

alter table public.meta_crm_events enable row level security;
grant select on table public.meta_crm_events to authenticated;
-- writes happen only via service-role edge functions; no insert/update grant to authenticated
```

The `unique (meta_lead_id, event_name)` constraint **is** the deduplication mechanism — insert
first, send second. A duplicate insert raising `23505` means "already reported, skip".

---

## 3. Step 2 — Ingest Meta leads (`supabase/functions/meta-leadgen-webhook/index.ts`)

Deploy with `supabase functions deploy meta-leadgen-webhook --no-verify-jwt` (Meta cannot send a
Supabase JWT). Security comes from signature verification instead, which is **not optional** — an
unauthenticated endpoint that writes to `leads` is otherwise open to spam.

**Handler contract:**

- `GET` — webhook verification handshake. If `hub.mode === 'subscribe'` and
  `hub.verify_token === META_WEBHOOK_VERIFY_TOKEN`, return `hub.challenge` as plain text, 200.
- `POST` — lead delivery.
  1. Read the raw body **as text before parsing** and verify `X-Hub-Signature-256`
     (`sha256=<hmac>`, HMAC-SHA256 of the raw body keyed with `META_APP_SECRET`). Compare with a
     constant-time comparison. Reject with 401 on mismatch.
  2. Return **200 immediately**, then process. Meta retries aggressively and disables webhooks that
     respond slowly — do the Graph fetch after the response, or push onto a queue.
  3. For each `entry[].changes[]` where `field === 'leadgen'`, read
     `value.leadgen_id`, `value.form_id`, `value.ad_id`, `value.page_id`.
  4. Fetch the answers:
     `GET https://graph.facebook.com/v25.0/{leadgen_id}?access_token={META_PAGE_ACCESS_TOKEN}`
     → returns `{ created_time, id, field_data: [{ name, values: [...] }] }`.
  5. Map `field_data` onto a lead row and insert with the service-role key:

     | Instant Form field | `leads` column |
     | --- | --- |
     | `full_name` | `full_name` |
     | `email` | `email` |
     | `phone_number` | `phone` |
     | everything else (city, licence stage, timeline) | `payload` JSONB |

     Plus `lead_type: 'student_assessment'`, `source_page: '/meta-lead-ad'`, `status: 'new'`,
     `meta_lead_id: leadgen_id`, `meta_form_id`, `meta_ad_id`.
  6. After a successful insert, call `meta-crm-events` with `event_name: 'Lead'` (Step 4).

**Subscribe the Page** (once, after deploy):

```bash
curl -X POST "https://graph.facebook.com/v25.0/{PAGE_ID}/subscribed_apps" \
  -d "subscribed_fields=leadgen" \
  -d "access_token={META_PAGE_ACCESS_TOKEN}"
```

Then in the Meta app dashboard → Webhooks → Page → subscribe to `leadgen`, callback URL
`https://{project-ref}.supabase.co/functions/v1/meta-leadgen-webhook`, verify token = the secret set above.

> **Fallback if the webhook is too much:** Zapier's "Facebook Lead Ads" trigger exposes the same
> `id` field (= `lead_id`). Map it to `meta_lead_id` and POST to a simple Supabase endpoint. Costs
> ~$20/mo and adds a failure point, but skips Steps 3 and the app review dance.

---

## 4. Step 3 — Send CRM events (`supabase/functions/meta-crm-events/index.ts`)

Input: `{ leadId: uuid, eventName: string, testEventCode?: string }`.

### 4a. Stage mapping

| `leads.status` | `event_name` sent to Meta | Meaning |
| --- | --- | --- |
| `new` (on insert) | `Lead` | raw lead received — **always send this one** |
| `pending_review` | *(not sent)* | internal only, no signal value |
| `reviewed` | `LeadQualified` | reachable, real prospect in service area |
| `shortlisted` | `LeadConverted` | lesson or package booked/paid |
| `rejected` | `LeadDisqualified` | junk, out of area, unreachable |

Meta requires the raw stage (`Lead`) **plus at least one downstream stage** to model quality. Names
are free-form but must stay identical forever — renaming resets Meta's learning.

`shortlisted` is currently a hiring-oriented status in `AdminLeads`; consider adding a dedicated
`booked` status for lead-ad leads rather than overloading it.

### 4b. Normalisation — the part that silently fails

Meta hashes the same way on their side. Any deviation produces a 0% match rate with **no error**.

```ts
// Email: trim, lowercase. Nothing else.
const normEmail = (v: string) => v.trim().toLowerCase();

// Phone: digits only, country code included, no '+', no punctuation.
// "(250) 542-3673" -> "12505423673"
const normPhone = (v: string) => {
  const digits = v.replace(/\D/g, "");
  if (digits.length === 10) return `1${digits}`;          // BC local -> add country code
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  return digits;
};

// Names / city: trim, lowercase, strip punctuation and accents.
const normName = (v: string) =>
  v.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");

const sha256Hex = async (value: string) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
```

**Do NOT hash:** `lead_id`, `fbc`, `fbp`, `client_ip_address`, `client_user_agent`.
`lead_id` is sent as a raw **number**. Hashing it is the single most common cause of a dead
integration.

### 4c. Payload

```json
{
  "data": [
    {
      "event_name": "LeadQualified",
      "event_time": 1784505600,
      "action_source": "system_generated",
      "custom_data": {
        "event_source": "crm",
        "lead_event_source": "Supabase"
      },
      "user_data": {
        "lead_id": 1234567890123456,
        "em": ["<sha256 of normalised email>"],
        "ph": ["<sha256 of normalised phone>"],
        "fn": ["<sha256 of first name>"],
        "ct": ["<sha256 of city>"],
        "st": ["<sha256 of 'bc'>"],
        "country": ["<sha256 of 'ca'>"]
      }
    }
  ]
}
```

Notes:
- `event_time` is **UNIX seconds**, not milliseconds. `Math.floor(Date.now() / 1000)`.
- Omit any `user_data` key you don't have — never send an empty string or a hash of `""`.
- `st` is the two-letter province (`bc`) and `country` the two-letter code (`ca`), both hashed.
  Cheap to include and it lifts match quality noticeably for a single-province business.
- Batch up to 1,000 events per request in `data[]` for the daily sweeper.

### 4d. Flow inside the function

1. Load the lead; abort quietly if `meta_lead_id` is null (site leads aren't Meta leads).
2. `INSERT INTO meta_crm_events (...) VALUES (..., 'pending')`. On `23505` (unique violation),
   return `{ skipped: 'duplicate' }` — this is the dedupe gate.
3. Build and POST the payload.
4. On 2xx: `status='sent'`, `sent_at=now()`, store `fbtrace_id` from the response.
5. On failure: `status='failed'`, increment `attempts`, store `last_error`. Do **not** throw — a
   Meta outage must never block an admin from updating a lead status.

### 4e. Wiring the triggers

- **On insert:** call from `meta-leadgen-webhook` after the row lands (Step 3.6).
- **On status change:** the admin path runs through `updateLeadStatus` in
  [affiliateApi.ts:672](src/lib/affiliateApi.ts#L672) and `updateDirectLeadStatus` in
  [adminApiDirect.ts:450](src/lib/adminApiDirect.ts#L450). Fire the event **server-side**, not from
  `AdminLeads.tsx` — a browser call would need the CAPI token in the client bundle. Cleanest option
  is a Postgres `AFTER UPDATE OF status` trigger on `public.leads` using `pg_net` to call the edge
  function, so both admin code paths are covered automatically.
- **Daily sweeper:** a `pg_cron` job that re-sends `meta_crm_events` rows with
  `status='failed' AND attempts < 5`. Meta's Diagnostics flags integrations that go quiet, so this
  also serves as the "upload at least once a day" heartbeat the guide asks for.

---

## 5. Testing

1. **Test event first.** Add `"test_event_code": "TEST12345"` (from Events Manager → Test Events)
   at the top level of the request body, alongside `data`. Events appear in the Test Events tab
   within seconds and do **not** pollute production data.
2. Confirm the payload shape in Events Manager → Payload Helper before writing the function — paste
   the JSON from 4c and it will flag structural errors.
3. Verify the whole chain with one real submission: submit the live Instant Form yourself →
   confirm a `leads` row with a populated `meta_lead_id` → change status to `reviewed` in the admin
   → confirm `LeadQualified` in Events Manager within an hour.
4. Watch **Events Manager → Diagnostics** for the first week. The two errors to expect:
   *"lead_id not matched"* (usually a hashed lead_id, or a lead older than the attribution window)
   and *"low match quality"* (usually phone normalisation).

Test events only prove connectivity — they do **not** validate that your data is correct. Match
rate in Events Manager is the real scoreboard; aim for >70% on `lead_id`-matched events.

---

## 6. Compliance (British Columbia)

- Hashing satisfies Meta's transfer requirements, but **PIPA still treats hashed contact data as
  personal information**. The Privacy Policy (effective March 16, 2026) needs an explicit line
  covering disclosure of contact details to advertising platforms for measurement and optimisation.
- The Instant Form's CASL consent checkbox covers *contacting* the lead; it does not by itself
  cover *disclosing* their data to Meta. Add that to the form's custom disclaimer text and link the
  Privacy Policy in the form's required privacy URL field.
- Meta's Business Tools Terms require you to have the right to share the data — the disclaimer is
  what establishes it. Do this before the first production event, not after.

---

## 7. Build order

| # | Task | Depends on |
| --- | --- | --- |
| 1 | System user token + secrets | — |
| 2 | Migration `20260720010000_meta_crm_events.sql` | — |
| 3 | Privacy Policy + form disclaimer update | — |
| 4 | `meta-crm-events` edge function + Test Events verification | 1, 2 |
| 5 | `meta-leadgen-webhook` edge function + Page subscription | 1, 2 |
| 6 | `AFTER UPDATE OF status` trigger via `pg_net` | 4 |
| 7 | `pg_cron` retry sweeper | 4 |

Steps 1–4 are the minimum that produces a working, testable integration. 5 makes it automatic;
6–7 make it reliable.
