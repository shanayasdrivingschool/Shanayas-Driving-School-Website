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
    'pending',
    v_metadata
  )
  returning id into v_order_id;

  return v_order_id;
end;
$$;

revoke all on function public.submit_checkout_record(text, text, numeric, jsonb) from public;
grant execute on function public.submit_checkout_record(text, text, numeric, jsonb) to service_role;
