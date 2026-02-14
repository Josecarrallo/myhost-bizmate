-- =====================================================
-- INSERT GUEST: José Carrallo
-- Email: josecarrallodelafuente@gmail.com
-- Phone: +34 619 79 46 04
-- =====================================================

-- Insertar guest José Carrallo
INSERT INTO public.guests (
  id,
  name,
  email,
  phone,
  nationality,
  total_bookings,
  total_spent,
  avg_rating,
  notes,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'José Carrallo',
  'josecarrallodelafuente@gmail.com',
  '+34 619 79 46 04',
  'Spain',
  0,
  0.00,
  NULL,
  'Test guest for Guest Communication',
  NOW(),
  NOW()
);

-- Verificar que se insertó correctamente
SELECT
  id,
  name,
  email,
  phone,
  nationality,
  created_at
FROM public.guests
WHERE email = 'josecarrallodelafuente@gmail.com';
