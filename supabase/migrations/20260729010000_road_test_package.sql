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
  description = 'Road test preparation and a rental car for your ICBC road test. Add 60-minute lessons if you want extra practice before test day.',
  highlights = '["Test Routes", "Car Rental", "Parking And Maneuvers", "Optional Practice Lessons"]'::jsonb,
  fixed_price = 250,
  sixty_minute_classes = 0,
  ninety_minute_classes = 0
where slug = 'lesson-road-test-prep-course';

commit;
