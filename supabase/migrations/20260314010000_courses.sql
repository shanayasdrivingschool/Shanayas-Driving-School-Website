begin;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced', 'Test Prep', 'Flexible', 'Senior Support')),
  delivery_format text not null check (delivery_format in ('In-class', 'In-car', 'In-class + In-car')),
  duration text not null,
  detail text not null,
  description text not null,
  highlights jsonb not null default '[]'::jsonb,
  tone text not null,
  image text not null,
  quiz_tags jsonb not null default '[]'::jsonb,
  fixed_price numeric(12,2) check (fixed_price is null or fixed_price >= 0),
  sixty_minute_classes integer not null default 0 check (sixty_minute_classes >= 0),
  ninety_minute_classes integer not null default 0 check (ninety_minute_classes >= 0),
  discount_percent numeric(5,2) not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(highlights) = 'array'),
  check (jsonb_typeof(quiz_tags) = 'array'),
  check (fixed_price is not null or sixty_minute_classes > 0 or ninety_minute_classes > 0)
);

create index if not exists idx_courses_display_order on public.courses (display_order, created_at);
create index if not exists idx_courses_visible_display_order on public.courses (is_visible, display_order, created_at);

drop trigger if exists trg_courses_updated_at on public.courses;
create trigger trg_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

alter table public.courses enable row level security;

drop policy if exists "Public can read visible courses" on public.courses;
create policy "Public can read visible courses"
on public.courses
for select
to anon, authenticated
using (is_visible);

drop policy if exists "Admin users can read courses" on public.courses;
create policy "Admin users can read courses"
on public.courses
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Admin users can create courses" on public.courses;
create policy "Admin users can create courses"
on public.courses
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Admin users can update courses" on public.courses;
create policy "Admin users can update courses"
on public.courses
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Admin users can delete courses" on public.courses;
create policy "Admin users can delete courses"
on public.courses
for delete
to authenticated
using (public.is_admin_user());

revoke all on table public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;

insert into public.courses (
  slug,
  title,
  level,
  delivery_format,
  duration,
  detail,
  description,
  highlights,
  tone,
  image,
  quiz_tags,
  fixed_price,
  sixty_minute_classes,
  ninety_minute_classes,
  discount_percent,
  is_visible,
  display_order
)
values
  (
    'beginner-driving-course',
    $$Beginner's Driving Course$$,
    'Beginner',
    'In-car',
    '10 x 90 min beginner lessons',
    '10 x 90 min beginner lessons',
    'Perfect for first-time drivers, covering essential car control, traffic rules, and safe driving habits.',
    '["Basic Car Control", "Traffic Rules", "Safe Driving Habits", "Road Awareness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1600320254374-ce2d293c324e?auto=format&fit=crop&w=1200&q=80',
    '["beginner", "foundation", "confidence", "road-awareness"]'::jsonb,
    null,
    0,
    10,
    0,
    true,
    1
  ),
  (
    'knowledge-test-prep-course',
    'Knowledge Test Prep Course',
    'Beginner',
    'In-class',
    '8 in-class sessions',
    '8 in-class sessions',
    'Build confidence for the knowledge test by learning road signs, traffic rules, and exam-style practice questions.',
    '["Road Signs", "Traffic Rules", "Practice Questions", "Test Preparation"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1581092335878-1d9ff3b5d2f6?auto=format&fit=crop&w=1200&q=80',
    '["knowledge-test", "written-test", "rules", "beginner"]'::jsonb,
    300,
    0,
    0,
    0,
    true,
    2
  ),
  (
    'parking-course',
    'Parking Course',
    'Beginner',
    'In-car',
    '3 x 90 min classes',
    '3 x 90 min classes',
    'Dedicated parking practice for parallel parking, stall parking, and low-speed vehicle control.',
    '["Parallel Parking", "Stall Parking", "Low-Speed Control", "Tight Maneuvers"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
    '["parking", "maneuvers", "beginner", "road-test"]'::jsonb,
    null,
    0,
    3,
    0,
    true,
    3
  ),
  (
    'make-your-own-class',
    'Make Your Own Class',
    'Flexible',
    'In-car',
    'Custom-focus lesson',
    'Custom-focus lesson',
    'Choose your own lesson focus based on the area where you want the most support.',
    '["Flexible Focus", "Weak Area Support", "Custom Lesson Plan", "Personalized Coaching"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=80',
    '["custom", "flexible", "mixed-needs"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    4
  ),
  (
    'lesson-road-test-prep-course',
    'Lesson + Road Test Prep Course',
    'Test Prep',
    'In-car',
    '1 x 90 min + road test prep support',
    '1 x 90 min + road test prep support',
    'A combined lesson built to sharpen driving and prepare you for road test expectations.',
    '["Warm-Up Lesson", "Road Test Focus", "Route Preparation", "Last-Minute Support"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    '["road-test", "combined", "test-prep", "maneuvers"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    5
  ),
  (
    'road-test-prep-course',
    'Road Test Prep Course',
    'Test Prep',
    'In-car',
    '1 x 90 min lesson',
    '1 x 90 min lesson',
    'Get focused practice on test routes, key maneuvers, and ICBC road test standards to improve your chances of passing.',
    '["Mock Test Routes", "Parking Practice", "ICBC Standards", "Exam Readiness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80',
    '["road-test", "test-routes", "maneuvers", "test-prep"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    6
  ),
  (
    'new-to-canada',
    'New to Canada',
    'Beginner',
    'In-car',
    '3 x 90 min classes',
    '3 x 90 min classes',
    'Helpful for drivers adjusting to local road rules, driving culture, and test expectations in Canada.',
    '["Canadian Road Rules", "Local Driving Culture", "Sign Review", "Test Expectations"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80',
    '["newcomer", "canada-rules", "confidence", "beginner"]'::jsonb,
    null,
    0,
    3,
    0,
    true,
    7
  ),
  (
    'defensive-driving-course',
    'Defensive Driving Course',
    'Intermediate',
    'In-car',
    '5 x 90 min classes',
    '5 x 90 min classes',
    'Focused on defensive driving techniques, hazard perception, and proactive strategies to reduce risk in complex traffic conditions.',
    '["Hazard Perception", "Risk Reduction", "Defensive Techniques", "Traffic Awareness"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    '["defensive", "hazard-awareness", "traffic", "intermediate"]'::jsonb,
    null,
    0,
    5,
    0,
    true,
    8
  ),
  (
    'refresher-driving-course',
    'Refresher Driving Course',
    'Intermediate',
    'In-car',
    '2 x 90 min classes',
    '2 x 90 min classes',
    'Ideal for licensed drivers returning after a break or preparing to re-test, focused on rebuilding confidence and refreshing core driving skills.',
    '["Skill Refresh", "Confidence Building", "Road Practice", "Driving Review"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80',
    '["refresher", "returning-driver", "confidence", "intermediate"]'::jsonb,
    null,
    0,
    2,
    0,
    true,
    9
  ),
  (
    'mock-test-evaluation',
    'Mock Test Evaluation',
    'Test Prep',
    'In-car',
    '1 x 60 min class',
    '1 x 60 min class',
    'A realistic road test simulation with feedback on what to improve before test day.',
    '["Mock Test", "Exam Feedback", "Readiness Check", "Improvement Plan"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80',
    '["mock-test", "road-test", "feedback", "test-prep"]'::jsonb,
    null,
    1,
    0,
    0,
    true,
    10
  ),
  (
    'confidence-booster-course',
    'Confidence Booster Course',
    'Beginner',
    'In-car',
    '8 x 90 min classes',
    '8 x 90 min classes',
    'Perfect for drivers with basic skills who need a confidence boost to feel comfortable and safe on the road.',
    '["Confidence Training", "Road Comfort", "Driving Practice", "Skill Reinforcement"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    '["confidence", "nervous-driver", "practice", "beginner"]'::jsonb,
    null,
    0,
    8,
    0,
    true,
    11
  ),
  (
    'advanced-driving-course',
    'Advanced Driving Course',
    'Advanced',
    'In-car',
    '5 x 90 min classes',
    '5 x 90 min classes',
    'Designed for experienced drivers to refine skills and apply advanced driving techniques for safer, more controlled driving.',
    '["Advanced Control", "Precision Driving", "Traffic Strategy", "Road Safety"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    '["advanced", "precision", "highway", "complex-situations"]'::jsonb,
    null,
    0,
    5,
    0,
    true,
    12
  ),
  (
    'winter-driving-course',
    'Winter Driving Course',
    'Intermediate',
    'In-car',
    'Seasonal skill training',
    'Seasonal skill training',
    'Learn essential winter driving skills for icy and low-visibility conditions. Build confidence and control in difficult weather.',
    '["Snow Driving", "Ice Control", "Low Visibility Driving", "Vehicle Stability"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80',
    '["winter", "weather", "seasonal", "confidence"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    13
  ),
  (
    'seniors-driving-course',
    'Enhanced Road Assessment',
    'Senior Support',
    'In-class + In-car',
    'Confidence and review sessions',
    'Confidence and review sessions',
    'Tailored for senior drivers, focusing on safe habits, awareness, reaction time, and refreshing important road rules.',
    '["Safe Driving Habits", "Awareness Training", "Reaction Practice", "Road Rules Review"]'::jsonb,
    'bg-white text-black border border-gray-200',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    '["senior", "confidence", "road-rules", "refresher"]'::jsonb,
    null,
    0,
    1,
    0,
    true,
    14
  )
on conflict (slug) do nothing;

commit;

