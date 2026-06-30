alter table public.orders
  drop constraint if exists orders_payment_method_type_check;

alter table public.orders
  add constraint orders_payment_method_type_check
  check (
    payment_method_type is null
    or payment_method_type in ('card', 'link', 'affirm', 'afterpay_clearpay')
  );
