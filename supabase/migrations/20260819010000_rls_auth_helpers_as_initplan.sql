begin;

-- Wrap every auth helper called from an RLS policy in a scalar subquery.
--
-- Written unwrapped, `using (public.is_admin_user())` is re-evaluated by Postgres once
-- per row scanned, and is_admin_user() itself runs an EXISTS against admin_users. Loading
-- the admin panel therefore ran that subquery once for every row of every table it
-- touched, which made the dashboard totals scale linearly with the size of the data.
--
-- `(select public.is_admin_user())` is evaluated once per query as an InitPlan and the
-- result reused for all rows. The permission granted is identical -- both forms read the
-- same function against the same auth.uid() -- so this changes performance only.
--
-- The same applies to auth.uid() and auth.jwt(). Policies whose expressions genuinely
-- depend on the row (is_coupon_currently_valid, is_visible) are deliberately left alone.

alter policy "Admin users can read coupons" on public.coupons
  using ((select public.is_admin_user()));

alter policy "Admin users can create coupons" on public.coupons
  with check ((select public.is_admin_user()));

alter policy "Admin users can update coupons" on public.coupons
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete coupons" on public.coupons
  using ((select public.is_admin_user()));

alter policy "Admins can read admin user roster" on public.admin_users
  using ((select public.is_admin_user()) or user_id = (select auth.uid()));

alter policy "Admin users can read all leads" on public.leads
  using ((select public.is_admin_user()));

alter policy "Admin users can create leads" on public.leads
  with check ((select public.is_admin_user()));

alter policy "Admin users can update all leads" on public.leads
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete leads" on public.leads
  using ((select public.is_admin_user()));

alter policy "Admin users can read affiliates" on public.affiliates
  using ((select public.is_admin_user()));

alter policy "Admin users can create affiliates" on public.affiliates
  with check ((select public.is_admin_user()));

alter policy "Admin users can update affiliates" on public.affiliates
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete affiliates" on public.affiliates
  using ((select public.is_admin_user()));

alter policy "Admin users can read affiliate clicks" on public.affiliate_clicks
  using ((select public.is_admin_user()));

alter policy "Admin users can create affiliate clicks" on public.affiliate_clicks
  with check ((select public.is_admin_user()));

alter policy "Admin users can update affiliate clicks" on public.affiliate_clicks
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete affiliate clicks" on public.affiliate_clicks
  using ((select public.is_admin_user()));

alter policy "Admin users can read orders" on public.orders
  using ((select public.is_admin_user()));

alter policy "Admin users can create orders" on public.orders
  with check ((select public.is_admin_user()));

alter policy "Admin users can update orders" on public.orders
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete orders" on public.orders
  using ((select public.is_admin_user()));

alter policy "Admin users can read commissions" on public.affiliate_commissions
  using ((select public.is_admin_user()));

alter policy "Admin users can create commissions" on public.affiliate_commissions
  with check ((select public.is_admin_user()));

alter policy "Admin users can update commissions" on public.affiliate_commissions
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete commissions" on public.affiliate_commissions
  using ((select public.is_admin_user()));

alter policy "Admin users can read payouts" on public.payouts
  using ((select public.is_admin_user()));

alter policy "Admin users can create payouts" on public.payouts
  with check ((select public.is_admin_user()));

alter policy "Admin users can update payouts" on public.payouts
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete payouts" on public.payouts
  using ((select public.is_admin_user()));

alter policy "Admin users can read edge rate limits" on public.edge_rate_limits
  using ((select public.is_admin_user()));

alter policy "Admin users can create edge rate limits" on public.edge_rate_limits
  with check ((select public.is_admin_user()));

alter policy "Admin users can update edge rate limits" on public.edge_rate_limits
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete edge rate limits" on public.edge_rate_limits
  using ((select public.is_admin_user()));

alter policy "Admin users can read courses" on public.courses
  using ((select public.is_admin_user()));

alter policy "Admin users can create courses" on public.courses
  with check ((select public.is_admin_user()));

alter policy "Admin users can update courses" on public.courses
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete courses" on public.courses
  using ((select public.is_admin_user()));

alter policy "Admin users can read practice questions" on public.questions
  using ((select public.is_admin_user()));

alter policy "Admin users can create practice questions" on public.questions
  with check ((select public.is_admin_user()));

alter policy "Admin users can update practice questions" on public.questions
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete practice questions" on public.questions
  using ((select public.is_admin_user()));

alter policy "Affiliates can insert their own profile" on public.affiliates
  with check ( (select auth.uid()) = auth_user_id and coalesce((select auth.jwt()) -> 'user_metadata' ->> 'role', '') = 'affiliate' );

alter policy "Affiliates can update their own profile" on public.affiliates
  using ( (select public.is_affiliate_admin()) or (select public.is_admin_user()) or ( (select auth.uid()) = auth_user_id and coalesce((select auth.jwt()) -> 'user_metadata' ->> 'role', '') = 'affiliate' ) )
  with check ( (select public.is_affiliate_admin()) or (select public.is_admin_user()) or ( (select auth.uid()) = auth_user_id and coalesce((select auth.jwt()) -> 'user_metadata' ->> 'role', '') = 'affiliate' ) );

alter policy "Admin users can read checkout invoices" on public.checkout_invoices
  using ((select public.is_admin_user()));

alter policy "Admin users can create checkout invoices" on public.checkout_invoices
  with check ((select public.is_admin_user()));

alter policy "Admin users can update checkout invoices" on public.checkout_invoices
  using ((select public.is_admin_user()))
  with check ((select public.is_admin_user()));

alter policy "Admin users can delete checkout invoices" on public.checkout_invoices
  using ((select public.is_admin_user()));

-- The base driving-school schema predates these migrations and may define policies of its
-- own. pg_policies renders a wrapped call as "( SELECT is_admin_user() AS ... )", so those
-- forms are stripped out first and anything still calling a helper bare is reported, ready
-- to be folded into a follow-up migration.
do $$
declare
  wrapped constant text := '\(\s*SELECT\s+[a-z_.]*(is_admin_user|is_affiliate_admin|uid|jwt)\(\)[^()]*\)';
  bare    constant text := '(is_admin_user|is_affiliate_admin)\(\)';
  leftover text;
begin
  select string_agg(format('%s.%s: %s', schemaname, tablename, policyname), e'\n  ' order by tablename, policyname)
    into leftover
  from pg_policies
  where schemaname = 'public'
    and (
      regexp_replace(coalesce(qual, ''), wrapped, '', 'gi') ~* bare
      or regexp_replace(coalesce(with_check, ''), wrapped, '', 'gi') ~* bare
    );

  if leftover is not null then
    raise notice 'RLS policies still evaluating an auth helper per row:%  %', e'\n', leftover;
  else
    raise notice 'All public RLS policies now evaluate their auth helpers once per query.';
  end if;
end
$$;

commit;
