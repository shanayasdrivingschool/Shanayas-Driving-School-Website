# submit-lead Edge Function

This function receives lead submissions from the frontend and writes to `public.leads` using the service role key.

## Deploy

1. Link your local project:

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

2. Apply SQL changes in `supabase/schema.sql` first (adds rate-limit table + RPC):

```sql
-- run the latest schema.sql in Supabase SQL editor
```

3. Set function secrets:

```bash
supabase secrets set \
  SUPABASE_URL=https://<your-project-ref>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> \
  ALLOWED_ORIGINS="https://<your-domain>" \
  RATE_LIMIT_WINDOW_SECONDS=60 \
  RATE_LIMIT_MAX_REQUESTS=8 \
  CAPTCHA_REQUIRED=true \
  CAPTCHA_PROVIDER=turnstile \
  TURNSTILE_SECRET_KEY=<your-turnstile-secret>
```

If you prefer Google reCAPTCHA v3, use:

```bash
supabase secrets set \
  CAPTCHA_REQUIRED=true \
  CAPTCHA_PROVIDER=recaptcha \
  RECAPTCHA_SECRET_KEY=<your-recaptcha-secret> \
  RECAPTCHA_MIN_SCORE=0.5
```

4. Deploy:

```bash
supabase functions deploy submit-lead
```

5. Frontend env (`.env`) must include matching site key:

```bash
VITE_CAPTCHA_PROVIDER=turnstile
VITE_TURNSTILE_SITE_KEY=<your-turnstile-site-key>
```

or

```bash
VITE_CAPTCHA_PROVIDER=recaptcha
VITE_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>
```

6. Test from the website forms (Contact, Student Apply, Employee Apply).

Loopback development origins such as `http://localhost:8080`, `http://127.0.0.1:8080`, and other local ports are accepted automatically. `ALLOWED_ORIGINS` only needs your real deployed domains.

## When to drop anon insert policy

Only after step 6 succeeds in production, run:

```sql
drop policy if exists "Allow anonymous lead inserts" on public.leads;
```

If you run this too early, form submission will fail.