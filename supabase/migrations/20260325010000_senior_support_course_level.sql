begin;

alter table public.courses
drop constraint if exists courses_level_check;

alter table public.courses
add constraint courses_level_check
check (level in ('Beginner', 'Intermediate', 'Advanced', 'Test Prep', 'Flexible', 'Senior Support'));

update public.courses
set level = 'Senior Support'
where slug = 'seniors-driving-course';

commit;
