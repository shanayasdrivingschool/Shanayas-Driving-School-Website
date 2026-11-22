-- Run only against a disposable local test database after the migration.
-- No external requests are made. All fixture changes roll back.
begin;
create function pg_temp.assert_true(value boolean, label text) returns void language plpgsql as $$
begin
  if value is distinct from true then raise exception 'Assertion failed: %', label; end if;
end;
$$;

insert into public.leads(id, lead_type, full_name, email, source_page, status, payload)
values
 ('00000000-0000-4000-8000-000000000001','student_assessment','Test','student@example.test','/apply','new',
  '{"meta_tracking":{"event_id":"lead:test","client_ip_address":"192.0.2.1","student_age":"do-not-copy"},"training_goals":"do-not-copy"}'),
 ('00000000-0000-4000-8000-000000000002','employee_application','Test','employee@example.test','/careers/apply','new','{"meta_tracking":{"event_id":"lead:hiring"}}'),
 ('00000000-0000-4000-8000-000000000003','contact','Test','manual@example.test','/admin/manual','new','{}'),
 ('00000000-0000-4000-8000-000000000004','contact','Test','optout@example.test','/contact','new','{"meta_tracking":{"event_id":"lead:optout","sharing_allowed":false}}');

select pg_temp.assert_true((select count(*)=1 from public.meta_conversion_events), 'only eligible website lead queued');
select pg_temp.assert_true((select event_id='lead:test' from public.meta_conversion_events), 'browser event ID preserved');
select pg_temp.assert_true((select snapshot::text not like '%do-not-copy%' from public.meta_conversion_events), 'snapshot excludes unrelated PII');

update public.leads set status='qualified' where id='00000000-0000-4000-8000-000000000001';
update public.leads set status='qualified' where id='00000000-0000-4000-8000-000000000001';
update public.leads set status='contacted' where id='00000000-0000-4000-8000-000000000001';
update public.leads set status='qualified', email='changed@example.test' where id='00000000-0000-4000-8000-000000000001';
select pg_temp.assert_true((select count(*)=2 from public.meta_conversion_events), 'one event per distinct stage, no contacted event');
select pg_temp.assert_true((select snapshot->>'email'='student@example.test' from public.meta_conversion_events where stage='new'), 'immutable event snapshot');

create temp table first_claim as select * from public.claim_meta_conversion_events(20);
select pg_temp.assert_true((select count(*)=2 from first_claim), 'claim eligible events');
select pg_temp.assert_true((select count(*)=0 from public.claim_meta_conversion_events(20)), 'active leases prevent duplicate claim');
update public.meta_conversion_events set status='failed', locked_until=null, next_attempt_at=now()+interval '1 hour' where stage='new';
select pg_temp.assert_true((select count(*)=0 from public.claim_meta_conversion_events(20)), 'backoff delays retry');
update public.meta_conversion_events set next_attempt_at=now()-interval '1 second' where stage='new';
create temp table retry_claim as select * from public.claim_meta_conversion_events(20);
select pg_temp.assert_true((select count(*)=1 from retry_claim), 'failed row retries despite unique stage key');
select pg_temp.assert_true((select attempts=2 and event_id='lead:test' from retry_claim), 'retry preserves event identity and increments attempt');
select pg_temp.assert_true((select r.claim_token<>f.claim_token from retry_claim r join first_claim f using(id)), 'retry changes fencing token');
update public.meta_conversion_events e set status='sent' from first_claim f where e.id=f.id and e.claim_token=f.claim_token and e.stage='new';
select pg_temp.assert_true((select status='processing' from public.meta_conversion_events where stage='new'), 'stale worker cannot complete reclaimed event');
update public.meta_conversion_events set locked_until=now()-interval '1 second', attempts=8 where stage='qualified';
select * from public.claim_meta_conversion_events(20);
select pg_temp.assert_true((select status='failed' and last_error='attempt_limit_reached' from public.meta_conversion_events where stage='qualified'), 'exhausted interrupted worker is marked failed');

insert into public.meta_leadgen_inbox(meta_lead_id, meta_page_id) values('12345678901234567890','100') on conflict do nothing;
insert into public.meta_leadgen_inbox(meta_lead_id, meta_page_id) values('12345678901234567890','100') on conflict do nothing;
select pg_temp.assert_true((select count(*)=1 from public.meta_leadgen_inbox), 'webhook retries are idempotent');
select pg_temp.assert_true((select count(*)=1 from public.claim_meta_leadgen_inbox(20)), 'inbox work claimed');
select pg_temp.assert_true((select count(*)=0 from public.claim_meta_leadgen_inbox(20)), 'inbox active lease blocks overlapping workers');

insert into public.leads(id, lead_type, source_page, status, payload, meta_lead_id)
values ('00000000-0000-4000-8000-000000000005','student_assessment','/meta-lead-ad','new','{"source":"meta"}','12345678901234567890');
select pg_temp.assert_true((select channel='crm' and snapshot->>'meta_lead_id'='12345678901234567890' from public.meta_conversion_events where lead_id='00000000-0000-4000-8000-000000000005'), 'Instant Form ID remains exact');
select pg_temp.assert_true(not has_table_privilege('anon','public.meta_conversion_events','SELECT'), 'queue hidden from anon');
select pg_temp.assert_true(not has_table_privilege('authenticated','public.meta_conversion_events','SELECT'), 'queue hidden from regular authenticated users');
select pg_temp.assert_true(not has_function_privilege('authenticated','public.claim_meta_conversion_events(integer)','EXECUTE'), 'claim RPC restricted');
rollback;
