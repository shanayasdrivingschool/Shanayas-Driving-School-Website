alter table public.affiliates
  add column if not exists age integer,
  add column if not exists is_minor boolean not null default false,
  add column if not exists guardian_name text,
  add column if not exists guardian_email text,
  add column if not exists guardian_phone text,
  add column if not exists guardian_consent boolean not null default false,
  add column if not exists guardian_consent_timestamp timestamptz;

update public.affiliates
set
  age = null,
  is_minor = false,
  guardian_name = null,
  guardian_email = null,
  guardian_phone = null,
  guardian_consent = false,
  guardian_consent_timestamp = null
where age is null;

alter table public.affiliates
  drop constraint if exists affiliates_age_range_check;

alter table public.affiliates
  add constraint affiliates_age_range_check
  check (age is null or age between 13 and 100);

alter table public.affiliates
  drop constraint if exists affiliates_minor_consent_check;

alter table public.affiliates
  add constraint affiliates_minor_consent_check
  check (
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

drop trigger if exists trg_affiliates_participant_validation on public.affiliates;
create trigger trg_affiliates_participant_validation
before insert or update on public.affiliates
for each row execute function public.prepare_affiliate_profile();

drop policy if exists "Affiliates can insert their own profile" on public.affiliates;
create policy "Affiliates can insert their own profile"
on public.affiliates
for insert
to authenticated
with check (
  auth.uid() = auth_user_id
  and coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'affiliate'
);

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
