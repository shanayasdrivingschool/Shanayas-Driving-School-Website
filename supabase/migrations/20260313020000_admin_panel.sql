begin;

create extension if not exists citext;

-- This migration assumes the base driving-school schema already exists.
-- It adds only the database objects and access rules required by the admin panel.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email citext unique,
  full_name text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.admin_users enable row level security;
alter table public.leads enable row level security;
alter table public.affiliates enable row level security;
alter table public.affiliate_clicks enable row level security;
alter table public.orders enable row level security;
alter table public.affiliate_commissions enable row level security;
alter table public.payouts enable row level security;
alter table public.edge_rate_limits enable row level security;

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

revoke all on table public.admin_users from anon;

grant select on table public.admin_users to authenticated;
grant select, insert, update, delete on table public.leads to authenticated;
grant select, insert, update, delete on table public.affiliates to authenticated;
grant select, insert, update, delete on table public.affiliate_clicks to authenticated;
grant select, insert, update, delete on table public.orders to authenticated;
grant select, insert, update, delete on table public.affiliate_commissions to authenticated;
grant select, insert, update, delete on table public.payouts to authenticated;
grant select, insert, update, delete on table public.edge_rate_limits to authenticated;
grant select on table public.affiliate_payout_candidates to authenticated;

commit;
