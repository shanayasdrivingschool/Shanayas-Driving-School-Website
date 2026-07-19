begin;

update public.courses
set
  title = 'Lesson + Road Test Prep + Rental',
  duration = '2 x 60 min + road test prep and rental',
  detail = '2 x 60 min + road test prep and rental',
  description = 'Two focused lessons, road test preparation, and a rental car for your road test.',
  highlights = '["Warm-Up Lessons", "Road Test Focus", "Car Included", "Route Preparation"]'::jsonb,
  fixed_price = null,
  sixty_minute_classes = 2,
  ninety_minute_classes = 0
where slug = 'lesson-road-test-prep-course';

commit;
