create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  question_text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a', 'b', 'c', 'd')),
  explanation text,
  category text not null check (category in ('road_signs', 'rules_of_the_road', 'hazard_awareness', 'safe_driving', 'road_markings')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_questions_created_at on public.questions (created_at desc);
create index if not exists idx_questions_category_created_at on public.questions (category, created_at desc);

drop trigger if exists trg_questions_updated_at on public.questions;
create trigger trg_questions_updated_at
before update on public.questions
for each row execute function public.set_updated_at();

alter table public.questions enable row level security;

drop policy if exists "Public can read practice questions" on public.questions;
create policy "Public can read practice questions"
on public.questions
for select
to anon, authenticated
using (true);

drop policy if exists "Admin users can read practice questions" on public.questions;
create policy "Admin users can read practice questions"
on public.questions
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create practice questions" on public.questions;
create policy "Admin users can create practice questions"
on public.questions
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update practice questions" on public.questions;
create policy "Admin users can update practice questions"
on public.questions
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete practice questions" on public.questions;
create policy "Admin users can delete practice questions"
on public.questions
for delete
to authenticated
using (public.is_admin_user());

revoke all on table public.questions from anon, authenticated;
grant select on public.questions to anon, authenticated;
grant insert, update, delete on public.questions to authenticated;

insert into public.questions (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
select *
from (
  values
    (
      'What should you do when you approach a flashing red traffic light?',
      'Come to a complete stop, then proceed when it is safe',
      'Slow down and continue if no vehicles are coming',
      'Yield only to pedestrians',
      'Continue through the intersection because it is not a full red light',
      'a',
      'A flashing red light is treated like a stop sign. You must stop completely and only continue when it is safe.',
      'rules_of_the_road'
    ),
    (
      'What is the speed limit in a school zone in British Columbia unless a different speed is posted?',
      '30 km/h from 8 a.m. to 5 p.m. on school days',
      '40 km/h at all times',
      '50 km/h only when children are visible',
      '30 km/h only during lunch hour',
      'a',
      'The school zone speed limit is 30 km/h from 8 a.m. to 5 p.m. on school days, unless signs show something different.',
      'road_signs'
    ),
    (
      'When you are turning left at a green light, who must you yield to?',
      'Only cyclists',
      'Oncoming traffic and pedestrians in the crosswalk',
      'Only vehicles already stopped at the light',
      'No one, because the light is green',
      'b',
      'A green light does not give left-turning drivers priority over oncoming vehicles or pedestrians already crossing.',
      'rules_of_the_road'
    ),
    (
      'What does a steady yellow traffic light mean?',
      'Speed up before the light turns red',
      'Stop only if another driver signals to you',
      'Stop unless you cannot do so safely',
      'Proceed because you still have the right-of-way',
      'c',
      'A yellow light warns that the signal is about to turn red. You should stop unless it would be unsafe to do so.',
      'rules_of_the_road'
    ),
    (
      'In good conditions, what following distance should you maintain behind the vehicle ahead?',
      'At least two seconds',
      'At least one second',
      'At least five car lengths',
      'Exactly three seconds in all conditions',
      'a',
      'The basic space cushion in good conditions is at least two seconds. Leave more time when conditions are poor.',
      'safe_driving'
    ),
    (
      'What should you do to your following distance in rain, snow, or icy conditions?',
      'Keep the same distance because slower speeds are enough',
      'Increase your following distance',
      'Drive closer so other vehicles cannot cut in',
      'Use your horn more often instead of creating extra space',
      'b',
      'Poor traction and visibility increase stopping distance. You should leave a larger safety gap in bad conditions.',
      'hazard_awareness'
    ),
    (
      'If an emergency vehicle with flashing lights and siren is approaching from behind, what should you do?',
      'Continue driving until you reach your destination',
      'Brake hard in your lane and stop immediately',
      'Pull over safely and stop so it can pass',
      'Speed up to stay ahead of the vehicle',
      'c',
      'Move out of the way safely, pull over, and stop so the emergency vehicle has a clear path.',
      'hazard_awareness'
    ),
    (
      'On a road with a speed limit of 50 km/h, what must you do when a transit bus with a yield-to-bus sign signals to leave a bus stop?',
      'Yield and let the bus re-enter traffic',
      'Pass the bus quickly before it moves',
      'Honk so the bus driver knows you are beside them',
      'Stop only if the bus driver waves you through',
      'a',
      'In British Columbia, drivers must yield to a transit bus leaving a stop when the speed limit is 60 km/h or lower and the bus displays a yield sign.',
      'rules_of_the_road'
    ),
    (
      'What is the rule for electronic devices if you hold an L or N licence?',
      'You may use hands-free devices only on highways',
      'You may use a phone only while stopped at a red light',
      'You may not use electronic devices while driving',
      'You may use a phone if a passenger is helping you',
      'c',
      'L and N drivers are not allowed to use electronic devices while driving, including hands-free devices.',
      'safe_driving'
    ),
    (
      'What does a diamond-shaped road sign usually mean?',
      'Warning about road conditions or hazards ahead',
      'School zone speed limit',
      'Mandatory stop',
      'Parking is allowed',
      'a',
      'Diamond-shaped signs are warning signs. They alert drivers to curves, crossings, lane changes, and other road conditions ahead.',
      'road_signs'
    ),
    (
      'What does a solid white stop line at an intersection show you?',
      'Where you may start turning right',
      'Where you should stop before entering the intersection',
      'Where pedestrians must wait',
      'Where passing is permitted',
      'b',
      'A stop line marks the point where your vehicle should stop before a stop sign, red light, or other controlled intersection.',
      'road_markings'
    ),
    (
      'What does a yellow centre line on the road separate?',
      'Traffic moving in the same direction',
      'A bike lane from vehicle traffic',
      'Traffic moving in opposite directions',
      'Parking from travel lanes',
      'c',
      'Yellow lines are used to separate traffic travelling in opposite directions.',
      'road_markings'
    ),
    (
      'What must you do when a pedestrian is in a marked crosswalk?',
      'Continue if you believe they will wait',
      'Stop and yield until it is safe to proceed',
      'Honk so they cross faster',
      'Pass around them if the other lane is clear',
      'b',
      'Drivers must yield to pedestrians in crosswalks and should not proceed until it is safe.',
      'safe_driving'
    )
) as seed (
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_option,
  explanation,
  category
)
where not exists (
  select 1
  from public.questions
);