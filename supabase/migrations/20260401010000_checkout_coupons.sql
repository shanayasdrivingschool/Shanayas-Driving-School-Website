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
