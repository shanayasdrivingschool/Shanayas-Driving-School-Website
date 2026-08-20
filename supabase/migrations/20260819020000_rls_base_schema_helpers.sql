begin;

-- Follow-up to 20260819010000.
--
-- That migration could only rewrite the policies defined in this repo. The original
-- database schema lives outside it and contributed six more affiliate-facing SELECT
-- policies that still call their auth helpers once per row -- including
-- current_affiliate_uuid(), a helper that appears nowhere in this project's files.
--
-- Rather than name policies this repo cannot see, this walks pg_policies and rewraps
-- whatever it finds. The substitution only ever replaces a complete zero-argument call
-- with a scalar subquery of that same call: fn() becomes (SELECT fn()). For a STABLE,
-- zero-argument function those are identical in value -- the only thing that changes is
-- that Postgres evaluates it once per query instead of once per row.
--
-- Safety: everything runs inside one transaction, and Postgres parses each expression
-- when ALTER POLICY runs. A malformed rewrite is a syntax error, which rolls the whole
-- migration back and leaves every policy exactly as it was. The guard at the end also
-- refuses to commit if any bare call survived.

do $$
declare
  rec record;
  fn text;
  pattern text;
  new_qual text;
  new_check text;
  stmt text;
  rewritten int := 0;
  helpers text[] := array[
    'is_admin_user',
    'is_affiliate_admin',
    'current_affiliate_uuid',
    'auth.uid',
    'auth.jwt'
  ];
begin
  for rec in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
  loop
    new_qual  := rec.qual;
    new_check := rec.with_check;

    foreach fn in array helpers loop
      /* Skip a call already inside a scalar subquery, and skip one that is part of a
         longer qualified name so public.fn() is never mangled into nonsense. */
      pattern := '(?<!SELECT )(?<![[:alnum:]_.])' || replace(fn, '.', '\.') || '\(\)';

      if new_qual is not null then
        new_qual := regexp_replace(new_qual, pattern, '(SELECT ' || fn || '())', 'gi');
      end if;

      if new_check is not null then
        new_check := regexp_replace(new_check, pattern, '(SELECT ' || fn || '())', 'gi');
      end if;
    end loop;

    if new_qual is not distinct from rec.qual
       and new_check is not distinct from rec.with_check then
      continue;
    end if;

    stmt := format('alter policy %I on %I.%I', rec.policyname, rec.schemaname, rec.tablename);

    if new_qual is not null then
      stmt := stmt || format(' using (%s)', new_qual);
    end if;

    if new_check is not null then
      stmt := stmt || format(' with check (%s)', new_check);
    end if;

    execute stmt;
    rewritten := rewritten + 1;
    raise notice 'rewrapped %.% -> %', rec.tablename, rec.policyname, stmt;
  end loop;

  raise notice 'policies rewritten: %', rewritten;
end
$$;

-- Refuse to commit unless every policy now resolves its helpers once per query.
do $$
declare
  leftover int;
begin
  select count(*)
    into leftover
  from pg_policies
  where schemaname = 'public'
    and regexp_replace(
          coalesce(qual, '') || ' ' || coalesce(with_check, ''),
          '\(\s*SELECT\s+[a-z_.]*(is_admin_user|is_affiliate_admin|current_affiliate_uuid|uid|jwt)\(\)[^()]*\)',
          '', 'gi'
        ) ~* '(is_admin_user|is_affiliate_admin|current_affiliate_uuid)\(\)';

  if leftover > 0 then
    raise exception 'Still % policy/policies evaluating a helper per row - rolling back.', leftover;
  end if;
end
$$;

commit;

-- Verdict, shown in the results grid.
with checked as (
  select
    regexp_replace(
      coalesce(qual, '') || ' ' || coalesce(with_check, ''),
      '\(\s*SELECT\s+[a-z_.]*(is_admin_user|is_affiliate_admin|current_affiliate_uuid|uid|jwt)\(\)[^()]*\)',
      '', 'gi'
    ) as leftover
  from pg_policies
  where schemaname = 'public'
)
select
  count(*) as total_rules,
  count(*) filter (
    where leftover ~* '(is_admin_user|is_affiliate_admin|current_affiliate_uuid)\(\)'
  ) as still_slow,
  case
    when count(*) filter (
      where leftover ~* '(is_admin_user|is_affiliate_admin|current_affiliate_uuid)\(\)'
    ) = 0 then 'ALL GOOD - every rule now checks once per query'
    else 'STILL SOME LEFT - tell Claude'
  end as verdict
from checked;
