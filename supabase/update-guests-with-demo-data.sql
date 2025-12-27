-- =====================================================
-- UPDATE GUESTS WITH DEMO DATA FOR AUTO-TAGGING
-- Run this to enable guest segmentation features
-- =====================================================

-- Update existing guests with realistic demo data

-- Guest 1: José Carrallo - VIP + High Value + Repeat Guest
UPDATE public.guests
SET
  total_bookings = 3,
  total_spent = 2500.00,
  avg_rating = 4.9,
  last_booking_date = NOW() - INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'josecarrallodelafuente@gmail.com';

-- Guest 2: Make one a Loyal customer
UPDATE public.guests
SET
  total_bookings = 6,
  total_spent = 3200.00,
  avg_rating = 4.8,
  last_booking_date = NOW() - INTERVAL '45 days',
  updated_at = NOW()
WHERE id = (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 1 OFFSET 0);

-- Guest 3: At Risk customer
UPDATE public.guests
SET
  total_bookings = 2,
  total_spent = 800.00,
  avg_rating = 4.5,
  last_booking_date = NOW() - INTERVAL '250 days',
  updated_at = NOW()
WHERE id = (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 1 OFFSET 1);

-- Guest 4: Win Back customer
UPDATE public.guests
SET
  total_bookings = 1,
  total_spent = 450.00,
  avg_rating = 4.2,
  last_booking_date = NOW() - INTERVAL '400 days',
  updated_at = NOW()
WHERE id = (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 1 OFFSET 2);

-- Guests 5-8: Recent Bookings
UPDATE public.guests
SET
  total_bookings = 1,
  total_spent = 650.00,
  avg_rating = 4.7,
  last_booking_date = NOW() - INTERVAL '15 days',
  updated_at = NOW()
WHERE id IN (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 4 OFFSET 3);

-- Guests 9-12: High Value
UPDATE public.guests
SET
  total_bookings = 2,
  total_spent = 1350.00,
  avg_rating = 4.6,
  last_booking_date = NOW() - INTERVAL '60 days',
  updated_at = NOW()
WHERE id IN (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 4 OFFSET 7);

-- Guests 13-16: First Time (no bookings yet but registered)
UPDATE public.guests
SET
  total_bookings = 0,
  total_spent = 0.00,
  avg_rating = NULL,
  last_booking_date = NULL,
  updated_at = NOW()
WHERE id IN (SELECT id FROM public.guests WHERE email != 'josecarrallodelafuente@gmail.com' LIMIT 4 OFFSET 11);

-- Verify the update
SELECT
  name,
  email,
  total_bookings,
  total_spent,
  avg_rating,
  last_booking_date
FROM public.guests
ORDER BY total_spent DESC;
