begin;

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

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

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

alter table public.coupons enable row level security;

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

revoke all on table public.coupons from anon, authenticated;
grant select on table public.coupons to anon, authenticated;
grant insert, update, delete on table public.coupons to authenticated;

commit;
