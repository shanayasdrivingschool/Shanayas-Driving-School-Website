begin;

-- "Lesson + Road Test Prep + Rental" becomes the "Road Test Package": a $250 base
-- package (road test prep + car rental, no lessons included) with optional $89
-- 60-minute lessons added at checkout. The add-on lesson price lives in the app
-- catalog because the courses table has no column for it.
update public.courses
set
  title = 'Road Test Package',
  duration = 'Road test prep + car rental',
  detail = 'Road test prep + car rental',
  description = 'Road test preparation with an instructor-approved car for your ICBC road test. Add as many practice lessons as you want on top of the base package.',
  highlights = '["Road Test Preparation", "Car Included For Test", "Route And Maneuver Practice", "Add Lessons As Needed"]'::jsonb,
  fixed_price = 250,
  sixty_minute_classes = 0,
  ninety_minute_classes = 0
where slug = 'lesson-road-test-prep-course';

commit;
