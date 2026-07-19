-- Lead status split: separate the student funnel from the hiring funnel.
--
-- Student leads (contact, student_assessment, custom_package_request) move to:
--   new -> contacted -> qualified -> booked, with unqualified / lost as exits.
-- Hiring leads (employee_application) keep their existing statuses untouched.
--
-- See docs/lead-status-split.md. Prerequisite for the Meta CRM Conversions API
-- integration (docs/meta-crm-conversions-api.md), whose stage mapping reads these values.
--
-- NOTE: public.leads was created outside source control, so the pre-existing status
-- constraint name is not known from the repo. The DO block below drops any CHECK
-- constraint on the status column regardless of its name before adding the new one.

-- 1. Drop whatever CHECK constraint currently guards leads.status, if any.
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_attribute att
      on att.attrelid = con.conrelid
     and att.attnum = any (con.conkey)
    where con.conrelid = 'public.leads'::regclass
      and con.contype = 'c'
      and att.attname = 'status'
  loop
    execute format('alter table public.leads drop constraint %I', constraint_name);
  end loop;
end $$;

-- 2. Backfill student-side leads onto the new vocabulary.
--    Hiring leads are excluded so HiringDashboard keeps working unchanged.
update public.leads set status = 'qualified'
  where lead_type <> 'employee_application' and status = 'reviewed';

update public.leads set status = 'booked'
  where lead_type <> 'employee_application' and status = 'shortlisted';

update public.leads set status = 'unqualified'
  where lead_type <> 'employee_application' and status = 'rejected';

update public.leads set status = 'new'
  where lead_type <> 'employee_application' and status = 'pending_review';

-- 3. Anything still outside the allowed set (unexpected legacy values) falls back to 'new'
--    so the constraint below cannot fail on existing rows.
update public.leads set status = 'new'
  where status is null
     or status not in (
       'new', 'contacted', 'qualified', 'booked', 'unqualified', 'lost',
       'pending_review', 'reviewed', 'shortlisted', 'rejected'
     );

-- 4. Re-add the constraint covering both vocabularies.
alter table public.leads add constraint leads_status_check check (
  status in (
    -- student pipeline
    'new', 'contacted', 'qualified', 'booked', 'unqualified', 'lost',
    -- hiring pipeline
    'pending_review', 'reviewed', 'shortlisted', 'rejected'
  )
);

alter table public.leads alter column status set default 'new';
