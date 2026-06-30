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

create index if not exists idx_checkout_invoices_status_created_at on public.checkout_invoices(status, created_at desc);
create index if not exists idx_checkout_invoices_expires_at on public.checkout_invoices(expires_at);
create index if not exists idx_checkout_invoices_created_at on public.checkout_invoices(created_at desc);

drop trigger if exists trg_checkout_invoices_updated_at on public.checkout_invoices;
create trigger trg_checkout_invoices_updated_at
before update on public.checkout_invoices
for each row execute function public.set_updated_at();

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

alter table public.checkout_invoices enable row level security;

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
