alter table public.orders
  add column if not exists payment_method_type text
    check (payment_method_type in ('card', 'affirm')),
  add column if not exists payment_provider text
    check (payment_provider in ('stripe'));
