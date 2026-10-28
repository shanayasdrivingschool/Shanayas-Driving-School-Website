# Automatic Stripe payment reconciliation

Stripe webhooks remain the immediate source of truth for payment updates. The scheduled worker is a recovery path for orders whose webhook was delayed, rejected, or missed.

## Deploy

```sh
npx supabase functions deploy stripe-payment-reconciliation-worker --project-ref <project-ref> --no-verify-jwt --use-api --yes
npx supabase secrets set STRIPE_RECONCILIATION_CRON_SECRET=<random-secret> --project-ref <project-ref>
```

Create these Vault secrets in Supabase:

- `stripe_reconciliation_worker_url`: `https://<project-ref>.supabase.co/functions/v1/stripe-payment-reconciliation-worker`
- `stripe_reconciliation_worker_secret`: the same value used for `STRIPE_RECONCILIATION_CRON_SECRET`

Run [`supabase/setup/stripe-payment-reconciliation-schedule.sql`](../supabase/setup/stripe-payment-reconciliation-schedule.sql) once in the SQL editor. It runs every ten minutes, checks unresolved orders that have a Stripe PaymentIntent reference, and only marks an order paid when Stripe returns `succeeded`.

Orders without a PaymentIntent reference and PaymentIntents that are still incomplete remain unchanged for manual review.
