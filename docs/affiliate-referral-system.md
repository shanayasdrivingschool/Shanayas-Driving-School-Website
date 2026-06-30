# Affiliate Referral System

## Stack Fit

This project is a Vite + React frontend with Supabase already present. The affiliate system is implemented to match that architecture:

- Frontend: React pages and shared theme components
- Auth: Supabase Auth JWT sessions for affiliates and admins
- Backend: Supabase SQL schema plus a routed edge function
- Tracking: browser query-param detection + cookie storage + click logging
- Admin operations: secured through admin membership in `admin_users`

This keeps the affiliate area visually aligned with the existing driving school site while avoiding a second disconnected backend.

## Backend Architecture

### Database

`supabase/schema.sql` now defines the affiliate domain:

- `affiliates`
- `admin_users`
- `affiliate_clicks`
- `orders`
- `affiliate_commissions`
- `payouts`
- `affiliate_payout_candidates` view

Additional helper objects:

- `generate_affiliate_code()` for `AFF1023` style codes
- `set_updated_at()` trigger helper
- `is_affiliate_admin()` for access checks
- `current_affiliate_uuid()` for owner-scoped RLS

### Edge API

`supabase/functions/affiliate-api/index.ts` exposes the business logic:

- affiliate registration
- anonymous referral click tracking
- purchase attribution and commission creation
- affiliate dashboard reads
- admin management reads and mutations
- payout batching and payout state updates

## Commission Logic

Commission rule:

```txt
commission = purchase_amount * 0.05
```

Current implementation:

- commission is created only when `paymentStatus === "paid"`
- `cancelled` or `refunded` calls reverse the commission
- self-referral by matching affiliate email to customer email is rejected
- suspicious clicks are flagged and can reject commission creation
- pending payout is based on approved commission not yet paid

Examples:

- `$801 -> $40.05`
- `$1201 -> $60.05`
- `$1602 -> $80.10`

## Referral Tracking Logic

Frontend:

- `ReferralTracker` watches every route for `?ref=AFF1023`
- if found, it calls the edge function and stores `affiliate_id` cookie for 30 days
- the query param is removed from the URL after processing
- `/ref/:affiliateCode` redirects into the same flow

Backend:

- validates affiliate code exists and is approved
- records click with IP, user agent, fingerprint, path, timestamp
- rate-limits repeated click bursts
- blocks suspicious repeated click patterns from setting the referral cookie

Cookie behavior:

- cookie name: `affiliate_id`
- duration: `30` days
- last referral wins

## Purchase Attribution

The repo does not currently include a live payment backend, so purchase attribution is implemented as a dedicated integration endpoint:

- endpoint: `POST /functions/v1/affiliate-api/commission/create`
- caller: your payment success webhook or checkout backend
- required input: order ID, amount, payment status, package name, referral code

Recommended integration:

1. At checkout, read `affiliate_id` cookie.
2. Store it with the order or webhook metadata.
3. On successful payment, call `commission/create`.
4. On refund or cancellation, call the same endpoint again with the updated status.

## Affiliate UI

New pages:

- `/affiliate/signup`
- `/affiliate/login`
- `/affiliate/dashboard`

Themed implementation choices:

- `PageNameSection` for the hero shell
- shared portal cards, status badges, metric cards, and nav
- existing site footer and typography
- existing brand colors and rounded-card language

Dashboard content:

- referral link with copy action
- total clicks
- total purchases
- revenue generated
- total commission
- pending payout
- referred orders table
- commission history table
- payout history table

## Admin UI

New pages:

- `/admin/affiliates`
- `/admin/referrals`
- `/admin/commissions`
- `/admin/payouts`

Admin capabilities implemented:

- approve or block affiliates
- view referral clicks
- inspect suspicious traffic
- approve, mark paid, or reverse commissions
- create payout batches for eligible affiliates
- approve, mark paid, or cancel payouts
- export on-screen tables to CSV

## API Surface

Requested API names and deployed equivalents:

- `POST /api/affiliate/register`
  deployed as `POST /functions/v1/affiliate-api/register`
- `GET /api/referral/track?ref=AFF1023`
  deployed as `GET /functions/v1/affiliate-api/referral/track?ref=AFF1023`
- `POST /api/commission/create`
  deployed as `POST /functions/v1/affiliate-api/commission/create`
- `GET /api/affiliate/stats`
  deployed as `GET /functions/v1/affiliate-api/affiliate/stats`
- `GET /api/admin/affiliates`
  deployed as `GET /functions/v1/affiliate-api/admin/affiliates`
- `POST /api/admin/payout`
  deployed as `POST /functions/v1/affiliate-api/admin/payout`

Additional admin routes included for completeness:

- `GET /functions/v1/affiliate-api/admin/session`
- `POST /functions/v1/affiliate-api/admin/affiliate-status`
- `GET /functions/v1/affiliate-api/admin/referrals`
- `GET /functions/v1/affiliate-api/admin/commissions`
- `POST /functions/v1/affiliate-api/admin/commission-status`
- `GET /functions/v1/affiliate-api/admin/payouts`

If you want literal `/api/...` URLs on your public domain, add a reverse proxy rewrite in your hosting layer.

## Deployment Steps

1. Apply `supabase/schema.sql` in your Supabase project.
2. Seed at least one admin user into `admin_users`.
3. Set the edge function secrets described in `supabase/functions/affiliate-api/README.md`.
4. Deploy the function:

```bash
supabase functions deploy affiliate-api
```

5. Ensure frontend env already contains:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

6. Route your payment success and refund events into `commission/create`.

## Open Integration Note

Because the existing driving school site currently uses lead-generation flows rather than an integrated checkout, the affiliate system is production-ready at the schema, API, tracking, dashboard, and admin levels, but it still needs the final connection from your real payment success/refund workflow into `commission/create`. That is the only required external integration point.

