-- Run once in the Supabase SQL editor after deploying
-- stripe-payment-reconciliation-worker and configuring the two Vault secrets.
-- The worker secret must match STRIPE_RECONCILIATION_CRON_SECRET.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'stripe_reconciliation_worker_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'stripe_reconciliation_worker_secret') then
    raise exception 'Configure stripe_reconciliation_worker_url and stripe_reconciliation_worker_secret in Vault first';
  end if;
end;
$$;

select cron.schedule(
  'stripe-payment-reconciliation-worker',
  '*/10 * * * *',
  $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'stripe_reconciliation_worker_url' limit 1),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-stripe-reconciliation-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'stripe_reconciliation_worker_secret' limit 1)
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$
);
-- Pause later with: select cron.unschedule('stripe-payment-reconciliation-worker');
