-- Limited-time paid-landing offer approved on 2026-10-14.
-- Checkout independently enforces the five-class custom-lesson threshold.
update public.courses
set discount_percent = 30,
    updated_at = timezone('utc'::text, now())
where slug = 'beginner-driving-course';
