-- Durable queues only. No external requests or historical lead backfill.
alter table public.leads
  add column if not exists meta_lead_id text,
  add column if not exists meta_form_id text,
  add column if not exists meta_ad_id text,
  add column if not exists meta_page_id text;
create unique index if not exists leads_meta_lead_id_key on public.leads(meta_lead_id);

create table public.meta_conversion_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  stage text not null check (stage in ('new', 'qualified', 'booked', 'unqualified')),
  channel text not null check (channel in ('website', 'crm')),
  event_id text not null,
  event_name text,
  event_time timestamptz not null,
  snapshot jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'skipped')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  claim_token uuid,
  last_error text,
  fbtrace_id text,
  sent_at timestamptz,
  delivery_mode text check (delivery_mode in ('test', 'production')),
  created_at timestamptz not null default now(),
  unique (lead_id, stage)
);
create index meta_conversion_events_due_idx on public.meta_conversion_events(status, next_attempt_at);

-- Signed leadgen notifications are committed here before the webhook acknowledges them.
create table public.meta_leadgen_inbox (
  meta_lead_id text primary key,
  meta_page_id text not null,
  meta_form_id text,
  meta_ad_id text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'skipped')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  claim_token uuid,
  last_error text,
  created_at timestamptz not null default now()
);
create index meta_leadgen_inbox_due_idx on public.meta_leadgen_inbox(status, next_attempt_at);

alter table public.meta_conversion_events enable row level security;
alter table public.meta_leadgen_inbox enable row level security;
revoke all on public.meta_conversion_events, public.meta_leadgen_inbox from public, anon, authenticated;
grant all on public.meta_conversion_events, public.meta_leadgen_inbox to service_role;

create or replace function public.enqueue_meta_conversion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_channel text;
  v_event_id text;
  v_tracking jsonb;
begin
  if new.lead_type = 'employee_application' then return new; end if;
  if new.status not in ('new', 'qualified', 'booked', 'unqualified') then return new; end if;
  if TG_OP = 'UPDATE' then
    if old.status is not distinct from new.status then return new; end if;
  end if;
  if new.payload #>> '{meta_tracking,sharing_allowed}' = 'false' then return new; end if;

  v_tracking := coalesce(new.payload -> 'meta_tracking', '{}'::jsonb);
  if new.meta_lead_id is not null then
    v_channel := 'crm';
  elsif coalesce(v_tracking ->> 'event_id', '') <> '' then
    v_channel := 'website';
  else
    -- Manual/imported/old leads without event context are not website conversions.
    return new;
  end if;

  v_event_id := new.id::text || ':' || new.status;
  if v_channel = 'website' and new.status = 'new' then
    v_event_id := left(v_tracking ->> 'event_id', 200);
  end if;
  insert into public.meta_conversion_events(lead_id, stage, channel, event_id, event_time, snapshot)
  values (
    new.id, new.status, v_channel, v_event_id,
    case when new.status = 'new' then new.created_at else clock_timestamp() end,
    -- Only matching context is copied, never assessment answers, ages or hiring details.
    jsonb_build_object(
      'email', new.email, 'phone', new.phone, 'meta_lead_id', new.meta_lead_id,
      'source_page', new.source_page, 'tracking', jsonb_build_object(
        'event_id', v_tracking -> 'event_id', 'fbc', v_tracking -> 'fbc',
        'fbp', v_tracking -> 'fbp', 'client_user_agent', v_tracking -> 'client_user_agent',
        'client_ip_address', v_tracking -> 'client_ip_address'
      )
    )
  ) on conflict (lead_id, stage) do nothing;
  return new;
end;
$$;
revoke all on function public.enqueue_meta_conversion() from public, anon, authenticated;
create trigger leads_enqueue_meta_conversion
  after insert or update of status on public.leads
  for each row execute function public.enqueue_meta_conversion();

-- SKIP LOCKED avoids concurrent workers claiming the same row. A lease can be reclaimed
-- after interruption. Every claim gets a fencing token, used by completion updates.
create or replace function public.claim_meta_conversion_events(p_limit integer default 20)
returns setof public.meta_conversion_events
language plpgsql security definer set search_path = '' as $$
begin
  update public.meta_conversion_events
  set status = 'failed', locked_until = null, claim_token = null, last_error = 'attempt_limit_reached'
  where status = 'processing' and locked_until < now() and attempts >= 8;
  return query
  with due as (
    select id from public.meta_conversion_events
    where attempts < 8 and (
      (status in ('pending','failed') and next_attempt_at <= now()) or
      (status = 'processing' and locked_until < now())
    ) order by created_at for update skip locked limit least(greatest(p_limit, 1), 20)
  )
  update public.meta_conversion_events e
  set status = 'processing', attempts = e.attempts + 1,
      locked_until = now() + interval '5 minutes', claim_token = gen_random_uuid()
  from due where e.id = due.id returning e.*;
end;
$$;
create or replace function public.claim_meta_leadgen_inbox(p_limit integer default 20)
returns setof public.meta_leadgen_inbox
language plpgsql security definer set search_path = '' as $$
begin
  update public.meta_leadgen_inbox
  set status = 'failed', locked_until = null, claim_token = null, last_error = 'attempt_limit_reached'
  where status = 'processing' and locked_until < now() and attempts >= 8;
  return query
  with due as (
    select meta_lead_id from public.meta_leadgen_inbox
    where attempts < 8 and (
      (status in ('pending','failed') and next_attempt_at <= now()) or
      (status = 'processing' and locked_until < now())
    ) order by created_at for update skip locked limit least(greatest(p_limit, 1), 20)
  )
  update public.meta_leadgen_inbox e
  set status = 'processing', attempts = e.attempts + 1,
      locked_until = now() + interval '5 minutes', claim_token = gen_random_uuid()
  from due where e.meta_lead_id = due.meta_lead_id returning e.*;
end;
$$;
revoke all on function public.claim_meta_conversion_events(integer), public.claim_meta_leadgen_inbox(integer) from public, anon, authenticated;
grant execute on function public.claim_meta_conversion_events(integer), public.claim_meta_leadgen_inbox(integer) to service_role;
