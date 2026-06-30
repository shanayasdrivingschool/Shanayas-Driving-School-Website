revoke all on table public.checkout_invoices from anon, authenticated;
grant select, insert, update, delete on public.checkout_invoices to authenticated;
