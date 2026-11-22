-- Run manually in the Supabase SQL editor AFTER configuring/deploying the functions.
-- First create Vault secrets named:
--   meta_worker_url    https://<project-ref>.supabase.co/functions/v1/meta-conversions-worker
--   meta_worker_secret   same random value as the META_WORKER_SECRET Edge secret
-- Create them in the Vault UI so secrets are not committed to this repository.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (select 1 from vault.decrypted_secrets where name = 'meta_worker_url')
     or not exists (select 1 from vault.decrypted_secrets where name = 'meta_worker_secret') then
    raise exception 'Configure meta_worker_url and meta_worker_secret in Vault first';
  end if;
end;
$$;

select cron.schedule(
  'meta-conversions-worker',
  '* * * * *',
  $job$
    select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'meta_worker_url' limit 1),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-meta-worker-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'meta_worker_secret' limit 1)
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 120000
    );
  $job$
);
-- Pause later with: select cron.unschedule('meta-conversions-worker');
