create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  lead_type text not null check (lead_type in ('contact', 'student_assessment', 'employee_application', 'custom_package_request')),
  full_name text,
  email text,
  phone text,
  source_page text not null,
  -- Student pipeline: new -> contacted -> qualified -> booked, with unqualified / lost as exits.
  -- Hiring pipeline (employee_application): new -> pending_review -> reviewed -> shortlisted / rejected.
  -- See docs/lead-status-split.md.
  status text not null default 'new' check (status in (
    'new', 'contacted', 'qualified', 'booked', 'unqualified', 'lost',
    'pending_review', 'reviewed', 'shortlisted', 'rejected'
  )),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Allow anonymous lead inserts" on public.leads;
create policy "Allow anonymous lead inserts"
on public.leads
for insert
to anon
with check (true);

drop policy if exists "Allow authenticated lead reads" on public.leads;
drop policy if exists "Allow anonymous employee application reads" on public.leads;

create index if not exists idx_leads_lead_type_created_at
on public.leads (lead_type, created_at desc);

create index if not exists idx_leads_status
on public.leads (status);

create index if not exists idx_leads_payload_gin
on public.leads
using gin (payload);

create table if not exists public.edge_rate_limits (
  key text primary key,
  endpoint text not null,
  window_start timestamptz not null,
  count integer not null default 0 check (count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.edge_rate_limits enable row level security;

revoke all on table public.edge_rate_limits from anon, authenticated;

create index if not exists idx_edge_rate_limits_updated_at
on public.edge_rate_limits (updated_at);

create or replace function public.check_submit_lead_rate_limit(
  p_key text,
  p_endpoint text,
  p_window_seconds integer,
  p_max_requests integer
)
returns table (
  allowed boolean,
  current_count integer,
  retry_after_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_window_seconds integer := greatest(1, p_window_seconds);
  v_max_requests integer := greatest(1, p_max_requests);
  v_bucket_epoch bigint;
  v_window_start timestamptz;
  v_result public.edge_rate_limits%rowtype;
begin
  v_bucket_epoch := floor(extract(epoch from v_now) / v_window_seconds)::bigint * v_window_seconds;
  v_window_start := to_timestamp(v_bucket_epoch);

  insert into public.edge_rate_limits (key, endpoint, window_start, count, created_at, updated_at)
  values (p_key, p_endpoint, v_window_start, 1, v_now, v_now)
  on conflict (key)
  do update set
    endpoint = excluded.endpoint,
    window_start = excluded.window_start,
    count = case
      when public.edge_rate_limits.window_start = excluded.window_start then public.edge_rate_limits.count + 1
      else 1
    end,
    updated_at = v_now
  returning * into v_result;

  allowed := v_result.count <= v_max_requests;
  current_count := v_result.count;
  retry_after_seconds := greatest(
    0,
    v_window_seconds - floor(extract(epoch from (v_now - v_window_start)))::integer
  );

  return next;
end;
$$;

revoke all on function public.check_submit_lead_rate_limit(text, text, integer, integer) from public;
grant execute on function public.check_submit_lead_rate_limit(text, text, integer, integer) to service_role;

create or replace view public.employee_applications_view as
select
  id,
  created_at,
  status,
  full_name,
  email,
  phone,
  source_page,
  payload ->> 'application_id' as application_id,
  payload ->> 'position_id' as position_id,
  payload ->> 'position_title' as position_title,
  coalesce((payload ->> 'requires_license')::boolean, false) as requires_license,
  payload ->> 'years_of_experience' as years_of_experience,
  payload ->> 'available_start_date' as available_start_date,
  payload ->> 'address' as address,
  payload ->> 'date_of_birth' as date_of_birth,
  payload ->> 'cover_letter' as cover_letter,
  payload ->> 'license_number' as license_number,
  payload ->> 'license_type' as license_type,
  payload ->> 'license_issue_date' as license_issue_date,
  payload ->> 'license_expiry_date' as license_expiry_date,
  payload ->> 'license_years_experience' as license_years_experience,
  payload ->> 'suspension_history' as suspension_history,
  payload ->> 'traffic_violations' as traffic_violations,
  payload ->> 'resume_file_name' as resume_file_name,
  payload ->> 'police_clearance_file_name' as police_clearance_file_name,
  payload ->> 'medical_fitness_file_name' as medical_fitness_file_name,
  payload -> 'document_upload_state' as document_upload_state,
  payload -> 'field_presence' as field_presence,
  payload -> 'form_snapshot' as form_snapshot
from public.leads
where lead_type = 'employee_application';

revoke select on public.employee_applications_view from anon, authenticated;

create extension if not exists citext;

create sequence if not exists public.affiliate_id_seq start 1023;

create or replace function public.generate_affiliate_code()
returns text
language sql
set search_path = public
as $$
  select 'AFF' || lpad(nextval('public.affiliate_id_seq')::text, 4, '0');
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  label text not null,
  description text,
  coupon_type text not null check (coupon_type in ('one_time', 'periodic')),
  discount_percent numeric(5,2) not null check (discount_percent > 0 and discount_percent <= 100),
  auto_apply boolean not null default false,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  usage_count integer not null default 0 check (usage_count >= 0),
  last_redeemed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

create index if not exists idx_coupons_created_at on public.coupons (created_at desc);
create index if not exists idx_coupons_auto_apply on public.coupons (auto_apply, is_active);

create or replace function public.is_coupon_currently_valid(
  p_coupon_type text,
  p_is_active boolean,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_usage_count integer
)
returns boolean
language sql
stable
set search_path = public
as $$
  select
    coalesce(p_is_active, false)
    and (p_starts_at is null or p_starts_at <= now())
    and (p_ends_at is null or p_ends_at >= now())
    and (p_coupon_type <> 'one_time' or coalesce(p_usage_count, 0) = 0);
$$;

create or replace function public.submit_lead_record(
  p_lead_type text,
  p_full_name text,
  p_email text,
  p_phone text,
  p_source_page text,
  p_status text,
  p_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
  v_payload jsonb := coalesce(p_payload, '{}'::jsonb);
  v_coupon_codes text[] := '{}'::text[];
  v_coupon public.coupons%rowtype;
  v_code text;
  v_is_custom_package boolean :=
    p_lead_type = 'custom_package_request'
    or coalesce(v_payload ->> 'request_type', '') = 'custom_package_request';
begin
  if v_is_custom_package then
    if jsonb_typeof(coalesce(v_payload -> 'applied_coupon_codes', '[]'::jsonb)) <> 'array' then
      raise exception 'invalid_coupon_payload';
    end if;

    select coalesce(array_agg(distinct upper(trim(value))), '{}'::text[])
    into v_coupon_codes
    from jsonb_array_elements_text(coalesce(v_payload -> 'applied_coupon_codes', '[]'::jsonb)) as coupon_values(value)
    where trim(value) <> '';

    foreach v_code in array v_coupon_codes loop
      select *
      into v_coupon
      from public.coupons
      where code = v_code
      for update;

      if not found then
        raise exception 'invalid_coupon_code';
      end if;

      if not v_coupon.is_active then
        raise exception 'coupon_not_active';
      end if;

      if v_coupon.starts_at is not null and v_coupon.starts_at > now() then
        raise exception 'coupon_not_started';
      end if;

      if v_coupon.ends_at is not null and v_coupon.ends_at < now() then
        raise exception 'coupon_expired';
      end if;

      if v_coupon.coupon_type = 'one_time' and v_coupon.usage_count > 0 then
        raise exception 'coupon_already_redeemed';
      end if;
    end loop;
  end if;

  insert into public.leads (
    lead_type,
    full_name,
    email,
    phone,
    source_page,
    status,
    payload
  )
  values (
    p_lead_type,
    nullif(trim(coalesce(p_full_name, '')), ''),
    nullif(trim(coalesce(p_email, '')), ''),
    nullif(trim(coalesce(p_phone, '')), ''),
    p_source_page,
    p_status,
    v_payload
  )
  returning id into v_lead_id;

  if array_length(v_coupon_codes, 1) is not null then
    update public.coupons
    set
      usage_count = usage_count + 1,
      last_redeemed_at = now(),
      updated_at = now()
    where code = any(v_coupon_codes);
  end if;

  return v_lead_id;
end;
$$;

revoke all on function public.submit_lead_record(text, text, text, text, text, text, jsonb) from public;
grant execute on function public.submit_lead_record(text, text, text, text, text, text, jsonb) to service_role;

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  affiliate_id text not null unique default public.generate_affiliate_code(),
  name text not null,
  email citext not null unique,
  phone text,
  age integer,
  is_minor boolean not null default false,
  guardian_name text,
  guardian_email text,
  guardian_phone text,
  guardian_consent boolean not null default false,
  guardian_consent_timestamp timestamptz,
  social_media_link text,
  preferred_payout_method text not null check (preferred_payout_method in ('bank_transfer', 'paypal', 'interac')),
  payout_details jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'blocked')),
  commission_rate numeric(6,4) not null default 0.05 check (commission_rate >= 0 and commission_rate <= 1),
  cookie_duration_days integer not null default 30 check (cookie_duration_days between 1 and 365),
  notes text,
  approved_at timestamptz,
  blocked_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint affiliates_age_range_check check (age is null or age between 13 and 100),
  constraint affiliates_minor_consent_check check (
    (
      age is null
      and is_minor = false
      and guardian_name is null
      and guardian_email is null
      and guardian_phone is null
      and guardian_consent = false
      and guardian_consent_timestamp is null
    )
    or (
      age >= 18
      and is_minor = false
      and guardian_name is null
      and guardian_email is null
      and guardian_phone is null
      and guardian_consent = false
      and guardian_consent_timestamp is null
    )
    or (
      age between 13 and 17
      and is_minor = true
      and guardian_name is not null
      and guardian_email is not null
      and guardian_phone is not null
      and guardian_consent = true
      and guardian_consent_timestamp is not null
    )
  )
);

create table if not exists public.affiliate_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  full_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  referral_code text not null,
  landing_path text not null,
  ip_address inet,
  user_agent text,
  fingerprint_hash text,
  is_suspicious boolean not null default false,
  suspicion_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  external_order_id text unique,
  customer_id uuid references auth.users(id) on delete set null,
  customer_email citext,
  package_name text not null,
  amount numeric(12,2) not null check (amount >= 0),
  payment_status text not null check (payment_status in ('pending', 'pending_payment', 'processing_payment', 'paid', 'cancelled', 'refunded', 'failed')),
  affiliate_id uuid references public.affiliates(id) on delete set null,
  affiliate_click_id uuid references public.affiliate_clicks(id) on delete set null,
  referral_code text,
  customer_ip inet,
  customer_user_agent text,
  fingerprint_hash text,
  is_self_referral boolean not null default false,
  is_suspicious boolean not null default false,
  fraud_flags jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.checkout_invoices (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique default gen_random_uuid(),
  title text not null,
  description text,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  customer_name text,
  customer_email citext,
  status text not null default 'open' check (status in ('draft', 'open', 'paid', 'cancelled')),
  expires_at timestamptz,
  paid_at timestamptz,
  last_order_id uuid references public.orders(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.submit_checkout_record(
  p_customer_email text,
  p_package_name text,
  p_amount numeric,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_customer_email text := lower(nullif(trim(coalesce(p_customer_email, '')), ''));
  v_package_name text := nullif(trim(coalesce(p_package_name, '')), '');
  v_amount numeric := round(coalesce(p_amount, 0)::numeric, 2);
  v_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
begin
  if v_package_name is null then
    raise exception 'invalid_package_name';
  end if;

  if v_amount < 0 then
    raise exception 'invalid_amount';
  end if;

  if jsonb_typeof(v_metadata) <> 'object' then
    raise exception 'invalid_metadata';
  end if;

  insert into public.orders (
    customer_email,
    package_name,
    amount,
    payment_status,
    metadata
  )
  values (
    v_customer_email,
    v_package_name,
    v_amount,
    'pending_payment',
    v_metadata
  )
  returning id into v_order_id;

  return v_order_id;
end;
$$;

revoke all on function public.submit_checkout_record(text, text, numeric, jsonb) from public;
grant execute on function public.submit_checkout_record(text, text, numeric, jsonb) to service_role;

create or replace function public.redeem_checkout_order_coupons(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_metadata jsonb;
  v_coupon_codes text[] := '{}'::text[];
  v_coupon public.coupons%rowtype;
  v_code text;
begin
  select *
  into v_order
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'order_not_found';
  end if;

  v_metadata := coalesce(v_order.metadata, '{}'::jsonb);

  if coalesce((v_metadata ->> 'coupon_redemption_applied')::boolean, false) then
    return false;
  end if;

  if jsonb_typeof(coalesce(v_metadata -> 'applied_coupon_codes', '[]'::jsonb)) <> 'array' then
    raise exception 'invalid_coupon_payload';
  end if;

  select coalesce(array_agg(distinct upper(trim(value))), '{}'::text[])
  into v_coupon_codes
  from jsonb_array_elements_text(coalesce(v_metadata -> 'applied_coupon_codes', '[]'::jsonb)) as coupon_values(value)
  where trim(value) <> '';

  if array_length(v_coupon_codes, 1) is null then
    return false;
  end if;

  foreach v_code in array v_coupon_codes loop
    select *
    into v_coupon
    from public.coupons
    where code = v_code
    for update;

    if not found then
      raise exception 'invalid_coupon_code';
    end if;

    if v_coupon.coupon_type = 'one_time' and v_coupon.usage_count > 0 then
      raise exception 'coupon_already_redeemed';
    end if;
  end loop;

  update public.coupons
  set
    usage_count = usage_count + 1,
    last_redeemed_at = now(),
    updated_at = now()
  where code = any(v_coupon_codes);

  update public.orders
  set
    metadata = jsonb_set(
      jsonb_set(v_metadata, '{coupon_redemption_applied}', 'true'::jsonb, true),
      '{coupon_redemption_applied_at}',
      to_jsonb(now()),
      true
    ),
    updated_at = now()
  where id = p_order_id;

  return true;
end;
$$;

revoke all on function public.redeem_checkout_order_coupons(uuid) from public;
grant execute on function public.redeem_checkout_order_coupons(uuid) to service_role;
create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  order_id uuid not null unique references public.orders(id) on delete cascade,
  purchase_amount numeric(12,2) not null check (purchase_amount >= 0),
  commission_rate numeric(6,4) not null default 0.05 check (commission_rate >= 0 and commission_rate <= 1),
  commission_amount numeric(12,2) not null check (commission_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'reversed', 'rejected')),
  reversal_reason text,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  reversed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  payment_method text not null check (payment_method in ('bank_transfer', 'paypal', 'interac')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'approved', 'paid', 'failed', 'cancelled')),
  commission_ids uuid[] not null default '{}'::uuid[],
  notes text,
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.prepare_affiliate_profile()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.name := trim(new.name);
  new.email := lower(trim(new.email::text))::citext;
  new.phone := nullif(trim(coalesce(new.phone, '')), '');
  new.social_media_link := nullif(trim(coalesce(new.social_media_link, '')), '');
  new.guardian_name := nullif(trim(coalesce(new.guardian_name, '')), '');
  new.guardian_email := lower(nullif(trim(coalesce(new.guardian_email, '')), ''));
  new.guardian_phone := nullif(trim(coalesce(new.guardian_phone, '')), '');

  if tg_op = 'INSERT' and new.age is null then
    raise exception 'Age must be provided and be between 13 and 100.';
  end if;

  if new.age is not null and (new.age < 13 or new.age > 100) then
    raise exception 'Age must be provided and be between 13 and 100.';
  end if;

  if new.age is null then
    new.is_minor := false;
    new.guardian_name := null;
    new.guardian_email := null;
    new.guardian_phone := null;
    new.guardian_consent := false;
    new.guardian_consent_timestamp := null;
    return new;
  end if;

  if new.age < 18 then
    if new.guardian_name is null or new.guardian_email is null or new.guardian_phone is null or coalesce(new.guardian_consent, false) = false then
      raise exception 'Guardian consent is required for participants under 18.';
    end if;

    new.is_minor := true;
    new.guardian_consent := true;
    new.guardian_consent_timestamp := coalesce(new.guardian_consent_timestamp, now());
    return new;
  end if;

  new.is_minor := false;
  new.guardian_name := null;
  new.guardian_email := null;
  new.guardian_phone := null;
  new.guardian_consent := false;
  new.guardian_consent_timestamp := null;

  return new;
end;
$$;

create or replace function public.handle_affiliate_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payout_method text := coalesce(new.raw_user_meta_data ->> 'preferred_payout_method', 'bank_transfer');
  participant_age integer := case
    when coalesce(new.raw_user_meta_data ->> 'age', '') ~ '^\d+$' then (new.raw_user_meta_data ->> 'age')::integer
    else null
  end;
  guardian_name text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'guardian_name', '')), '');
  guardian_email text := lower(nullif(trim(coalesce(new.raw_user_meta_data ->> 'guardian_email', '')), ''));
  guardian_phone text := nullif(trim(coalesce(new.raw_user_meta_data ->> 'guardian_phone', '')), '');
  guardian_consent boolean := lower(coalesce(new.raw_user_meta_data ->> 'guardian_consent', 'false')) in ('true', 't', '1', 'yes', 'on');
begin
  if coalesce(new.raw_user_meta_data ->> 'role', '') <> 'affiliate' then
    return new;
  end if;

  if payout_method not in ('bank_transfer', 'paypal', 'interac') then
    payout_method := 'bank_transfer';
  end if;

  insert into public.affiliates (
    auth_user_id,
    name,
    email,
    phone,
    age,
    guardian_name,
    guardian_email,
    guardian_phone,
    guardian_consent,
    social_media_link,
    preferred_payout_method
  )
  values (
    new.id,
    coalesce(nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''), split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    participant_age,
    guardian_name,
    guardian_email,
    guardian_phone,
    guardian_consent,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'social_media_link', '')), ''),
    payout_method
  )
  on conflict (auth_user_id) do update set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    age = excluded.age,
    guardian_name = excluded.guardian_name,
    guardian_email = excluded.guardian_email,
    guardian_phone = excluded.guardian_phone,
    guardian_consent = excluded.guardian_consent,
    social_media_link = excluded.social_media_link,
    preferred_payout_method = excluded.preferred_payout_method,
    updated_at = now();

  return new;
end;
$$;

create index if not exists idx_affiliates_status_created_at on public.affiliates (status, created_at desc);
create index if not exists idx_affiliates_auth_user_id on public.affiliates (auth_user_id);
create index if not exists idx_affiliate_clicks_affiliate_created_at on public.affiliate_clicks (affiliate_id, created_at desc);
create index if not exists idx_affiliate_clicks_ip_affiliate on public.affiliate_clicks (ip_address, affiliate_id);
create index if not exists idx_orders_affiliate_payment_status on public.orders (affiliate_id, payment_status, created_at desc);
create index if not exists idx_orders_external_order_id on public.orders (external_order_id);
create index if not exists idx_checkout_invoices_status_created_at on public.checkout_invoices (status, created_at desc);
create index if not exists idx_checkout_invoices_expires_at on public.checkout_invoices (expires_at);
create index if not exists idx_checkout_invoices_created_at on public.checkout_invoices (created_at desc);
create index if not exists idx_affiliate_commissions_affiliate_status on public.affiliate_commissions (affiliate_id, status, created_at desc);
create index if not exists idx_payouts_affiliate_status on public.payouts (affiliate_id, payment_status, created_at desc);

drop trigger if exists trg_affiliates_participant_validation on public.affiliates;
create trigger trg_affiliates_participant_validation
before insert or update on public.affiliates
for each row execute function public.prepare_affiliate_profile();

drop trigger if exists trg_affiliates_updated_at on public.affiliates;
create trigger trg_affiliates_updated_at
before update on public.affiliates
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_affiliate_commissions_updated_at on public.affiliate_commissions;
create trigger trg_affiliate_commissions_updated_at
before update on public.affiliate_commissions
for each row execute function public.set_updated_at();

drop trigger if exists trg_payouts_updated_at on public.payouts;
create trigger trg_payouts_updated_at
before update on public.payouts
for each row execute function public.set_updated_at();

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists trg_checkout_invoices_updated_at on public.checkout_invoices;
create trigger trg_checkout_invoices_updated_at
before update on public.checkout_invoices
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_affiliate_created on auth.users;
create trigger on_auth_user_affiliate_created
after insert on auth.users
for each row execute function public.handle_affiliate_auth_user();

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

create or replace function public.is_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.admin_users admin
    where admin.user_id = auth.uid()
      and admin.status = 'active'
  );
$$;

create or replace function public.is_affiliate_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.affiliate_admins admin
    where admin.user_id = auth.uid()
  );
$$;

create or replace function public.current_affiliate_uuid()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select affiliate.id
  from public.affiliates affiliate
  where affiliate.auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_checkout_invoice_open(
  p_status text,
  p_expires_at timestamptz,
  p_paid_at timestamptz
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    p_status = 'open'
    and p_paid_at is null
    and (p_expires_at is null or p_expires_at > now());
$$;

create or replace function public.get_checkout_invoice(p_public_token uuid)
returns table (
  id uuid,
  public_token uuid,
  title text,
  description text,
  amount numeric,
  currency text,
  customer_name text,
  customer_email citext,
  status text,
  expires_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    invoice.id,
    invoice.public_token,
    invoice.title,
    invoice.description,
    invoice.amount,
    invoice.currency,
    invoice.customer_name,
    invoice.customer_email,
    invoice.status,
    invoice.expires_at,
    invoice.created_at
  from public.checkout_invoices invoice
  where invoice.public_token = p_public_token
    and public.is_checkout_invoice_open(invoice.status, invoice.expires_at, invoice.paid_at);
$$;

revoke all on function public.get_checkout_invoice(uuid) from public;
grant execute on function public.get_checkout_invoice(uuid) to anon, authenticated, service_role;

create or replace view public.affiliate_payout_candidates as
select
  affiliate.id as affiliate_pk,
  affiliate.affiliate_id,
  affiliate.name,
  affiliate.preferred_payout_method,
  coalesce(sum(commission.commission_amount), 0)::numeric(12,2) as available_amount
from public.affiliates affiliate
left join public.affiliate_commissions commission
  on commission.affiliate_id = affiliate.id
  and commission.status = 'approved'
  and not exists (
    select 1
    from public.payouts payout
    where payout.affiliate_id = affiliate.id
      and commission.id = any(payout.commission_ids)
      and payout.payment_status in ('pending', 'approved', 'paid')
  )
where affiliate.status = 'approved'
group by affiliate.id, affiliate.affiliate_id, affiliate.name, affiliate.preferred_payout_method
having coalesce(sum(commission.commission_amount), 0) >= 100;

alter table public.affiliates enable row level security;
alter table public.admin_users enable row level security;
alter table public.affiliate_admins enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.orders enable row level security;
alter table public.checkout_invoices enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.payouts enable row level security;
alter table public.coupons enable row level security;

drop policy if exists "Affiliates can insert their own profile" on public.affiliates;
create policy "Affiliates can insert their own profile"
on public.affiliates
for insert
to authenticated
with check (
  auth.uid() = auth_user_id
  and coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'affiliate'
);

drop policy if exists "Affiliates can read their own profile" on public.affiliates;
create policy "Affiliates can read their own profile"
on public.affiliates
for select
to authenticated
using (auth.uid() = auth_user_id or public.is_affiliate_admin() or public.is_admin_user());

drop policy if exists "Affiliates can update their own profile" on public.affiliates;
create policy "Affiliates can update their own profile"
on public.affiliates
for update
to authenticated
using (
  public.is_affiliate_admin()
  or public.is_admin_user()
  or (
    auth.uid() = auth_user_id
    and coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'affiliate'
  )
)
with check (
  public.is_affiliate_admin()
  or public.is_admin_user()
  or (
    auth.uid() = auth_user_id
    and coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'affiliate'
  )
);

drop policy if exists "Admins can read admin user roster" on public.admin_users;
create policy "Admins can read admin user roster"
on public.admin_users
for select
to authenticated
using (public.is_admin_user() or user_id = auth.uid());

drop policy if exists "Admin users can read all leads" on public.leads;
create policy "Admin users can read all leads"
on public.leads
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create leads" on public.leads;
create policy "Admin users can create leads"
on public.leads
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update all leads" on public.leads;
create policy "Admin users can update all leads"
on public.leads
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete leads" on public.leads;
create policy "Admin users can delete leads"
on public.leads
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can read edge rate limits" on public.edge_rate_limits;
create policy "Admin users can read edge rate limits"
on public.edge_rate_limits
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create edge rate limits" on public.edge_rate_limits;
create policy "Admin users can create edge rate limits"
on public.edge_rate_limits
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update edge rate limits" on public.edge_rate_limits;
create policy "Admin users can update edge rate limits"
on public.edge_rate_limits
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete edge rate limits" on public.edge_rate_limits;
create policy "Admin users can delete edge rate limits"
on public.edge_rate_limits
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admins can read affiliate admin roster" on public.affiliate_admins;
create policy "Admins can read affiliate admin roster"
on public.affiliate_admins
for select
to authenticated
using (public.is_affiliate_admin() or user_id = auth.uid());

drop policy if exists "Public can read valid coupons" on public.coupons;
create policy "Public can read valid coupons"
on public.coupons
for select
to anon, authenticated
using (
  public.is_coupon_currently_valid(coupon_type, is_active, starts_at, ends_at, usage_count)
);

drop policy if exists "Admin users can read coupons" on public.coupons;
create policy "Admin users can read coupons"
on public.coupons
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create coupons" on public.coupons;
create policy "Admin users can create coupons"
on public.coupons
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update coupons" on public.coupons;
create policy "Admin users can update coupons"
on public.coupons
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete coupons" on public.coupons;
create policy "Admin users can delete coupons"
on public.coupons
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can read affiliates" on public.affiliates;
create policy "Admin users can read affiliates"
on public.affiliates
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create affiliates" on public.affiliates;
create policy "Admin users can create affiliates"
on public.affiliates
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update affiliates" on public.affiliates;
create policy "Admin users can update affiliates"
on public.affiliates
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete affiliates" on public.affiliates;
create policy "Admin users can delete affiliates"
on public.affiliates
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Affiliates can view their own clicks" on public.affiliate_clicks;
create policy "Affiliates can view their own clicks"
on public.affiliate_clicks
for select
to authenticated
using (affiliate_id = public.current_affiliate_uuid() or public.is_affiliate_admin() or public.is_admin_user());

drop policy if exists "Admin users can read affiliate clicks" on public.affiliate_clicks;
create policy "Admin users can read affiliate clicks"
on public.affiliate_clicks
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create affiliate clicks" on public.affiliate_clicks;
create policy "Admin users can create affiliate clicks"
on public.affiliate_clicks
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update affiliate clicks" on public.affiliate_clicks;
create policy "Admin users can update affiliate clicks"
on public.affiliate_clicks
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete affiliate clicks" on public.affiliate_clicks;
create policy "Admin users can delete affiliate clicks"
on public.affiliate_clicks
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Affiliates can view their own orders" on public.orders;
create policy "Affiliates can view their own orders"
on public.orders
for select
to authenticated
using (affiliate_id = public.current_affiliate_uuid() or public.is_affiliate_admin() or public.is_admin_user());

drop policy if exists "Admin users can read orders" on public.orders;
create policy "Admin users can read orders"
on public.orders
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create orders" on public.orders;
create policy "Admin users can create orders"
on public.orders
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update orders" on public.orders;
create policy "Admin users can update orders"
on public.orders
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete orders" on public.orders;
create policy "Admin users can delete orders"
on public.orders
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can read checkout invoices" on public.checkout_invoices;
create policy "Admin users can read checkout invoices"
on public.checkout_invoices
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create checkout invoices" on public.checkout_invoices;
create policy "Admin users can create checkout invoices"
on public.checkout_invoices
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update checkout invoices" on public.checkout_invoices;
create policy "Admin users can update checkout invoices"
on public.checkout_invoices
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete checkout invoices" on public.checkout_invoices;
create policy "Admin users can delete checkout invoices"
on public.checkout_invoices
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Affiliates can view their own commissions" on public.affiliate_commissions;
create policy "Affiliates can view their own commissions"
on public.affiliate_commissions
for select
to authenticated
using (affiliate_id = public.current_affiliate_uuid() or public.is_affiliate_admin() or public.is_admin_user());

drop policy if exists "Admin users can read commissions" on public.affiliate_commissions;
create policy "Admin users can read commissions"
on public.affiliate_commissions
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create commissions" on public.affiliate_commissions;
create policy "Admin users can create commissions"
on public.affiliate_commissions
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update commissions" on public.affiliate_commissions;
create policy "Admin users can update commissions"
on public.affiliate_commissions
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete commissions" on public.affiliate_commissions;
create policy "Admin users can delete commissions"
on public.affiliate_commissions
for delete
to authenticated
using (public.is_admin_user());

drop policy if exists "Affiliates can view their own payouts" on public.payouts;
create policy "Affiliates can view their own payouts"
on public.payouts
for select
to authenticated
using (affiliate_id = public.current_affiliate_uuid() or public.is_affiliate_admin() or public.is_admin_user());

drop policy if exists "Admin users can read payouts" on public.payouts;
create policy "Admin users can read payouts"
on public.payouts
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create payouts" on public.payouts;
create policy "Admin users can create payouts"
on public.payouts
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update payouts" on public.payouts;
create policy "Admin users can update payouts"
on public.payouts
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete payouts" on public.payouts;
create policy "Admin users can delete payouts"
on public.payouts
for delete
to authenticated
using (public.is_admin_user());

revoke all on table public.affiliates from anon;
revoke all on table public.admin_users from anon;
revoke all on table public.affiliate_admins from anon;
revoke all on table public.affiliate_clicks from anon;
revoke all on table public.orders from anon;
revoke all on table public.checkout_invoices from anon, authenticated;
revoke all on table public.affiliate_commissions from anon;
revoke all on table public.payouts from anon;
revoke all on table public.coupons from anon, authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.edge_rate_limits to authenticated;
grant select, insert, update, delete on public.affiliates to authenticated;
grant select on public.admin_users to authenticated;
grant select on public.affiliate_admins to authenticated;
grant select, insert, update, delete on public.affiliate_clicks to authenticated;
grant select, insert, update, delete on public.orders to authenticated;
grant select, insert, update, delete on public.checkout_invoices to authenticated;
grant select, insert, update, delete on public.affiliate_commissions to authenticated;
grant select, insert, update, delete on public.payouts to authenticated;
grant select on public.affiliate_payout_candidates to authenticated;
grant select on public.coupons to anon, authenticated;
grant insert, update, delete on public.coupons to authenticated;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced', 'Test Prep', 'Flexible', 'Senior Support')),
  delivery_format text not null check (delivery_format in ('In-class', 'In-car', 'In-class + In-car')),
  duration text not null,
  detail text not null,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  tone text not null,
  image text not null,
  quiz_tags jsonb not null default '[]'::jsonb,
  fixed_price numeric(12,2) check (fixed_price is null or fixed_price >= 0),
  sixty_minute_classes integer not null default 0 check (sixty_minute_classes >= 0),
  ninety_minute_classes integer not null default 0 check (ninety_minute_classes >= 0),
  discount_percent numeric(5,2) not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(highlights) = 'array'),
  check (jsonb_typeof(quiz_tags) = 'array'),
  check (fixed_price is not null or sixty_minute_classes > 0 or ninety_minute_classes > 0)
);

create index if not exists idx_courses_display_order on public.courses (display_order, created_at);
create index if not exists idx_courses_visible_display_order on public.courses (is_visible, display_order, created_at);

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

alter table public.courses enable row level security;

drop policy if exists "Public can read visible courses" on public.courses;
create policy "Public can read visible courses"
on public.courses
for select
to anon, authenticated
using (is_visible);

drop policy if exists "Admin users can read courses" on public.courses;
create policy "Admin users can read courses"
on public.courses
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create courses" on public.courses;
create policy "Admin users can create courses"
on public.courses
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update courses" on public.courses;
create policy "Admin users can update courses"
on public.courses
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete courses" on public.courses;
create policy "Admin users can delete courses"
on public.courses
for delete
to authenticated
using (public.is_admin_user());

revoke all on table public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;

insert into public.courses (
  slug,
  title,
  level,
  delivery_format,
  duration,
  detail,
  description,
  highlights,
  tone,
  image,
  quiz_tags,
  fixed_price,
  sixty_minute_classes,
  ninety_minute_classes,
  discount_percent,
  is_visible,
  display_order
)
values
  (
    'beginner-driving-course',
    $$Beginner's Driving Course$$,
    'Beginner',
    'In-car',
    '10 x 90 min beginner lessons',
    '10 x 90 min beginner lessons',
    'Perfect for first-time drivers, covering essential car control, traffic rules, and safe driving habits.',
    '["Basic Car Control", "Traffic Rules", "Safe Driving Habits", "Road Awareness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&w=1200&q=80',
    '["beginner", "foundation", "confidence", "road-awareness"]'::jsonb,
    null,
    0,
    10,
    0,
    true,
    1
  ),
  (
    'knowledge-test-prep-course',
    'Knowledge Test Prep Course',
    'Beginner',
    'In-class',
    '8 in-class sessions',
    '8 in-class sessions',
    'Build confidence for the knowledge test by learning road signs, traffic rules, and exam-style practice questions.',
    '["Road Signs", "Traffic Rules", "Practice Questions", "Test Preparation"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1581092335878-1d9ff3b5d2f6?auto=format&fit=crop&w=1200&q=80',
    '["knowledge-test", "written-test", "rules", "beginner"]'::jsonb,
    300,
    0,
    0,
    0,
    true,
    2
  ),
  (
    'parking-course',
    'Parking Course',
    'Beginner',
    'In-car',
    '3 x 90 min classes',
    '3 x 90 min classes',
    'Dedicated parking practice for parallel parking, stall parking, and low-speed vehicle control.',
    '["Parallel Parking", "Stall Parking", "Low-Speed Control", "Tight Maneuvers"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
    '["parking", "maneuvers", "beginner", "road-test"]'::jsonb,
    null,
    0,
    3,
    0,
    true,
    3
  ),
  (
    'make-your-own-class',
    'Make Your Own Class',
    'Flexible',
    'In-car',
    'Custom-focus lesson',
    'Custom-focus lesson',
    'Choose your own lesson focus based on the area where you want the most support.',
    '["Flexible Focus", "Weak Area Support", "Custom Lesson Plan", "Personalized Coaching"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    '["custom", "flexible", "mixed-needs"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    4
  ),
  (
    'lesson-road-test-prep-course',
    'Lesson + Road Test Prep Course',
    'Test Prep',
    'In-car',
    '1 x 90 min + road test prep support',
    '1 x 90 min + road test prep support',
    'A combined lesson built to sharpen driving and prepare you for road test expectations.',
    '["Warm-Up Lesson", "Road Test Focus", "Route Preparation", "Last-Minute Support"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    '["road-test", "combined", "test-prep", "maneuvers"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    5
  ),
  (
    'road-test-prep-course',
    'Road Test Prep Course',
    'Test Prep',
    'In-car',
    '1 x 90 min lesson',
    '1 x 90 min lesson',
    'Get focused practice on test routes, key maneuvers, and ICBC road test standards to improve your chances of passing.',
    '["Mock Test Routes", "Parking Practice", "ICBC Standards", "Exam Readiness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    '["road-test", "test-routes", "maneuvers", "test-prep"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    6
  ),
  (
    'new-to-canada',
    'New to Canada',
    'Beginner',
    'In-car',
    '3 x 90 min classes',
    '3 x 90 min classes',
    'Helpful for drivers adjusting to local road rules, driving culture, and test expectations in Canada.',
    '["Canadian Road Rules", "Local Driving Culture", "Sign Review", "Test Expectations"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    '["newcomer", "canada-rules", "confidence", "beginner"]'::jsonb,
    null,
    0,
    3,
    0,
    true,
    7
  ),
  (
    'defensive-driving-course',
    'Defensive Driving Course',
    'Intermediate',
    'In-car',
    '5 x 90 min classes',
    '5 x 90 min classes',
    'Focused on defensive driving techniques, hazard perception, and proactive strategies to reduce risk in complex traffic conditions.',
    '["Hazard Perception", "Risk Reduction", "Defensive Techniques", "Traffic Awareness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    '["defensive", "hazard-awareness", "traffic", "intermediate"]'::jsonb,
    null,
    0,
    5,
    0,
    true,
    8
  ),
  (
    'refresher-driving-course',
    'Refresher Driving Course',
    'Intermediate',
    'In-car',
    '2 x 90 min classes',
    '2 x 90 min classes',
    'Ideal for licensed drivers returning after a break or preparing to re-test, focused on rebuilding confidence and refreshing core driving skills.',
    '["Skill Refresh", "Confidence Building", "Road Practice", "Driving Review"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
    '["refresher", "returning-driver", "confidence", "intermediate"]'::jsonb,
    null,
    0,
    2,
    0,
    true,
    9
  ),
  (
    'mock-test-evaluation',
    'Mock Test Evaluation',
    'Test Prep',
    'In-car',
    '1 x 60 min class',
    '1 x 60 min class',
    'A realistic road test simulation with feedback on what to improve before test day.',
    '["Mock Test", "Exam Feedback", "Readiness Check", "Improvement Plan"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    '["mock-test", "road-test", "feedback", "test-prep"]'::jsonb,
    null,
    1,
    0,
    0,
    true,
    10
  ),
  (
    'confidence-booster-course',
    'Confidence Booster Course',
    'Beginner',
    'In-car',
    '8 x 90 min classes',
    '8 x 90 min classes',
    'Perfect for drivers with basic skills who need a confidence boost to feel comfortable and safe on the road.',
    '["Confidence Training", "Road Comfort", "Driving Practice", "Skill Reinforcement"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    '["confidence", "nervous-driver", "practice", "beginner"]'::jsonb,
    null,
    0,
    8,
    0,
    true,
    11
  ),
  (
    'advanced-driving-course',
    'Advanced Driving Course',
    'Advanced',
    'In-car',
    '5 x 90 min classes',
    '5 x 90 min classes',
    'Designed for experienced drivers to refine skills and apply advanced driving techniques for safer, more controlled driving.',
    '["Advanced Control", "Precision Driving", "Traffic Strategy", "Road Safety"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    '["advanced", "precision", "highway", "complex-situations"]'::jsonb,
    null,
    0,
    5,
    0,
    true,
    12
  ),
  (
    'winter-driving-course',
    'Winter Driving Course',
    'Intermediate',
    'In-car',
    'Seasonal skill training',
    'Seasonal skill training',
    'Learn essential winter driving skills for icy and low-visibility conditions. Build confidence and control in difficult weather.',
    '["Snow Driving", "Ice Control", "Low Visibility Driving", "Vehicle Stability"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80',
    '["winter", "weather", "seasonal", "confidence"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    13
  ),
  (
    'seniors-driving-course',
    'Enhanced Road Assessment',
    'Senior Support',
    'In-class + In-car',
    'Confidence and review sessions',
    'Confidence and review sessions',
    'Tailored for senior drivers, focusing on safe habits, awareness, reaction time, and refreshing important road rules.',
    '["Safe Driving Habits", "Awareness Training", "Reaction Practice", "Road Rules Review"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    '["senior", "confidence", "road-rules", "refresher"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    14
  )
on conflict (slug) do nothing;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a', 'b', 'c', 'd')),
  explanation text,
  category text not null check (category in ('road_signs', 'rules_of_the_road', 'hazard_awareness', 'safe_driving', 'road_markings')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_questions_created_at on public.questions (created_at desc);
create index if not exists idx_questions_category_created_at on public.questions (category, created_at desc);

drop trigger if exists trg_questions_updated_at on public.questions;
create trigger trg_questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

alter table public.questions enable row level security;

drop policy if exists "Public can read practice questions" on public.questions;
create policy "Public can read practice questions"
on public.questions
for select
to anon, authenticated
using (true);

drop policy if exists "Admin users can read practice questions" on public.questions;
create policy "Admin users can read practice questions"
on public.questions
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create practice questions" on public.questions;
create policy "Admin users can create practice questions"
on public.questions
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update practice questions" on public.questions;
create policy "Admin users can update practice questions"
on public.questions
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete practice questions" on public.questions;
create policy "Admin users can delete practice questions"
on public.questions
for delete
to authenticated
using (public.is_admin_user());

revoke all on table public.questions from anon, authenticated;
grant select on public.questions to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;

insert into public.questions (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
select *
from (
  values
    (
      'What should you do when you approach a flashing red traffic light?',
      'Come to a complete stop, then proceed when it is safe',
      'Slow down and continue if no vehicles are coming',
      'Yield only to pedestrians',
      'Continue through the intersection because it is not a full red light',
      'a',
      'A flashing red light is treated like a stop sign. You must stop completely and only continue when it is safe.',
      'rules_of_the_road'
    ),
    (
      'What is the speed limit in a school zone in British Columbia unless a different speed is posted?',
      '30 km/h from 8 a.m. to 5 p.m. on school days',
      '40 km/h at all times',
      '50 km/h only when children are visible',
      '30 km/h only during lunch hour',
      'a',
      'The school zone speed limit is 30 km/h from 8 a.m. to 5 p.m. on school days, unless signs show something different.',
      'road_signs'
    ),
    (
      'When you are turning left at a green light, who must you yield to?',
      'Only cyclists',
      'Oncoming traffic and pedestrians in the crosswalk',
      'Only vehicles already stopped at the light',
      'No one, because the light is green',
      'b',
      'A green light does not give left-turning drivers priority over oncoming vehicles or pedestrians already crossing.',
      'rules_of_the_road'
    ),
    (
      'What does a steady yellow traffic light mean?',
      'Speed up before the light turns red',
      'Stop only if another driver signals to you',
      'Stop unless you cannot do so safely',
      'Proceed because you still have the right-of-way',
      'c',
      'A yellow light warns that the signal is about to turn red. You should stop unless it would be unsafe to do so.',
      'rules_of_the_road'
    ),
    (
      'In good conditions, what following distance should you maintain behind the vehicle ahead?',
      'At least two seconds',
      'At least one second',
      'At least five car lengths',
      'Exactly three seconds in all conditions',
      'a',
      'The basic space cushion in good conditions is at least two seconds. Leave more time when conditions are poor.',
      'safe_driving'
    ),
    (
      'What should you do to your following distance in rain, snow, or icy conditions?',
      'Keep the same distance because slower speeds are enough',
      'Increase your following distance',
      'Drive closer so other vehicles cannot cut in',
      'Use your horn more often instead of creating extra space',
      'b',
      'Poor traction and visibility increase stopping distance. You should leave a larger safety gap in bad conditions.',
      'hazard_awareness'
    ),
    (
      'If an emergency vehicle with flashing lights and siren is approaching from behind, what should you do?',
      'Continue driving until you reach your destination',
      'Brake hard in your lane and stop immediately',
      'Pull over safely and stop so it can pass',
      'Speed up to stay ahead of the vehicle',
      'c',
      'Move out of the way safely, pull over, and stop so the emergency vehicle has a clear path.',
      'hazard_awareness'
    ),
    (
      'On a road with a speed limit of 50 km/h, what must you do when a transit bus with a yield-to-bus sign signals to leave a bus stop?',
      'Yield and let the bus re-enter traffic',
      'Pass the bus quickly before it moves',
      'Honk so the bus driver knows you are beside them',
      'Stop only if the bus driver waves you through',
      'a',
      'In British Columbia, drivers must yield to a transit bus leaving a stop when the speed limit is 60 km/h or lower and the bus displays a yield sign.',
      'rules_of_the_road'
    ),
    (
      'What is the rule for electronic devices if you hold an L or N licence?',
      'You may use hands-free devices only on highways',
      'You may use a phone only while stopped at a red light',
      'You may not use electronic devices while driving',
      'You may use a phone if a passenger is helping you',
      'c',
      'L and N drivers are not allowed to use electronic devices while driving, including hands-free devices.',
      'safe_driving'
    ),
    (
      'What does a diamond-shaped road sign usually mean?',
      'Warning about road conditions or hazards ahead',
      'School zone speed limit',
      'Mandatory stop',
      'Parking is allowed',
      'a',
      'Diamond-shaped signs are warning signs. They alert drivers to curves, crossings, lane changes, and other road conditions ahead.',
      'road_signs'
    ),
    (
      'What does a solid white stop line at an intersection show you?',
      'Where you may start turning right',
      'Where you should stop before entering the intersection',
      'Where pedestrians must wait',
      'Where passing is permitted',
      'b',
      'A stop line marks the point where your vehicle should stop before a stop sign, red light, or other controlled intersection.',
      'road_markings'
    ),
    (
      'What does a yellow centre line on the road separate?',
      'Traffic moving in the same direction',
      'A bike lane from vehicle traffic',
      'Traffic moving in opposite directions',
      'Parking from travel lanes',
      'c',
      'Yellow lines are used to separate traffic travelling in opposite directions.',
      'road_markings'
    ),
    (
      'What must you do when a pedestrian is in a marked crosswalk?',
      'Continue if you believe they will wait',
      'Stop and yield until it is safe to proceed',
      'Honk so they cross faster',
      'Pass around them if the other lane is clear',
      'b',
      'Drivers must yield to pedestrians in crosswalks and should not proceed until it is safe.',
      'safe_driving'
    )
) as seed (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
where not exists (
  select 1
  from public.questions
);



