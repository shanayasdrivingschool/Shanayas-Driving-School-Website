# affiliate-api Edge Function

This function powers the affiliate referral system for Shanaya's Driving School.

Implemented routes:

- `POST /register`
- `GET /referral/track?ref=AFF1023`
- `POST /commission/create`
- `GET /affiliate/stats`
- `GET /admin/session`
- `GET /admin/affiliates`
- `POST /admin/affiliate-status`
- `GET /admin/referrals`
- `GET /admin/commissions`
- `POST /admin/commission-status`
- `GET /admin/payouts`
- `POST /admin/payout`

These are served from:

`https://<project-ref>.supabase.co/functions/v1/affiliate-api/...`

## Required schema

Run the latest `supabase/schema.sql` first. It now includes:

- `affiliates`
- `admin_users`
- `affiliate_clicks`
- `orders`
- `affiliate_commissions`
- `payouts`
- `affiliate_payout_candidates`

## Required secrets

```bash
supabase secrets set \
  SUPABASE_URL=https://<project-ref>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
  ALLOWED_ORIGINS="https://<your-domain>" \
  PUBLIC_SITE_URL=https://<your-domain> \
  AFFILIATE_COMMISSION_RATE=0.05 \
  AFFILIATE_MIN_PAYOUT_THRESHOLD=50 \
  AFFILIATE_CLICK_WINDOW_SECONDS=900 \
  AFFILIATE_CLICK_MAX_REQUESTS=12 \
  AFFILIATE_WEBHOOK_SECRET=<strong-random-secret>
```

## Deploy

```bash
supabase functions deploy affiliate-api
```

Loopback development origins such as `http://localhost:8080`, `http://127.0.0.1:8080`, and other local ports are accepted automatically. `ALLOWED_ORIGINS` only needs your real deployed domains.

## Payment integration

The affiliate system only creates commission after payment success.

Your payment success webhook or backend should call:

`POST /functions/v1/affiliate-api/commission/create`

Example payload:

```json
{
  "externalOrderId": "ORD-10045",
  "packageName": "Beginner Package",
  "amount": 801,
  "paymentStatus": "paid",
  "customerEmail": "student@example.com",
  "customerIp": "203.0.113.10",
  "customerUserAgent": "Mozilla/5.0 ...",
  "fingerprintHash": "browser-fingerprint-hash",
  "referralCode": "AFF1023"
}
```

This endpoint should be called with:

```http
x-affiliate-webhook-secret: <AFFILIATE_WEBHOOK_SECRET>
```

If the order later becomes `cancelled` or `refunded`, call the same endpoint again with the updated `paymentStatus`. The commission will be reversed automatically.