# Admin Panel Deployment

This admin panel uses the existing Supabase tables and a dedicated `admin_users` access table. Admin accounts are separate from affiliate accounts.

## Routes

- `/admin/login`
- `/admin/dashboard`
- `/admin/leads`
- `/admin/affiliates`
- `/admin/referrals`
- `/admin/orders`
- `/admin/commissions`
- `/admin/payouts`
- `/admin/rate-limits`

## Required environment variables

Frontend `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Supabase Edge Function secrets:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
PUBLIC_SITE_URL=https://your-site-domain
ALLOWED_ORIGINS=https://your-site-domain
AFFILIATE_COMMISSION_RATE=0.05
AFFILIATE_MIN_PAYOUT_THRESHOLD=100
AFFILIATE_CLICK_WINDOW_SECONDS=900
AFFILIATE_CLICK_MAX_REQUESTS=12
ADMIN_RATE_LIMIT_WINDOW_SECONDS=300
ADMIN_RATE_LIMIT_MAX_REQUESTS=180
AFFILIATE_WEBHOOK_SECRET=choose-a-secret
```

## Supabase setup

1. Apply the existing SQL schema in `supabase/schema.sql`.
2. Deploy the edge function:

```bash
npx supabase functions deploy affiliate-api
```

3. Create an admin user in Supabase Auth.
4. Add that user to `public.admin_users` so `/admin/*` routes can be accessed:

```sql
insert into public.admin_users (user_id)
values ('SUPABASE_AUTH_USER_UUID');
```

## How admin access works

- Admins authenticate with Supabase Auth on `/admin/login`.
- All `/admin/*` routes are protected client-side by `AdminRouteGuard`.
- The edge function re-validates the JWT and confirms the user exists in `public.admin_users`.
- Admin pages read and mutate data through the `affiliate-api` edge function.

## Managed datasets

- `public.leads`
- `public.affiliates`
- `public.affiliate_clicks`
- `public.orders`
- `public.affiliate_commissions`
- `public.payouts`
- `public.edge_rate_limits`

## Local development

1. Install dependencies.
2. Add the frontend env vars.
3. Run the app:

```bash
npm run dev
```

4. Open `http://localhost:8080/admin/login`.

Loopback development origins such as `http://localhost:8080`, `http://127.0.0.1:8080`, and other local ports are accepted automatically by the edge functions. `ALLOWED_ORIGINS` only needs your real deployed domains.

## Production checks

- Confirm `ALLOWED_ORIGINS` includes the production admin origin.
- Confirm at least one row exists in `public.admin_users`.
- Confirm the `affiliate-api` edge function is deployed after code changes.
- Confirm the frontend uses the same Supabase project as the production tables.
