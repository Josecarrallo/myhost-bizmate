-- QUERIES DE TESTING PARA BOOKINGS

-- 1. Ver últimas 10 reservas
SELECT
  id,
  reservation_id,
  guest_name,
  check_in,
  check_out,
  total_price,
  currency_code,
  status,
  source,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 10;

-- 2. Ver solo reservas de DOMUS
SELECT * FROM bookings
WHERE source = 'domus'
ORDER BY created_at DESC;

-- 3. Ver reservas futuras (check-in pendiente)
SELECT
  reservation_id,
  guest_name,
  check_in,
  check_out,
  total_price || ' ' || currency_code as price,
  status
FROM bookings
WHERE check_in > CURRENT_DATE
ORDER BY check_in ASC;

-- 4. Ver reservas activas (huéspedes actuales)
SELECT * FROM bookings
WHERE check_in <= CURRENT_DATE
  AND check_out >= CURRENT_DATE
  AND status = 'confirmed';

-- 5. Estadísticas por mes
SELECT
  DATE_TRUNC('month', check_in) as month,
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue,
  AVG(total_price) as avg_price
FROM bookings
WHERE source = 'domus'
GROUP BY month
ORDER BY month DESC;

-- 6. Estadísticas por canal (Booking.com, Expedia, etc.)
SELECT
  channel_id,
  CASE channel_id
    WHEN 1 THEN 'Booking.com'
    WHEN 2 THEN 'Expedia'
    WHEN 3 THEN 'Airbnb'
    ELSE 'Other'
  END as channel_name,
  COUNT(*) as bookings,
  SUM(total_price) as revenue
FROM bookings
WHERE source = 'domus'
GROUP BY channel_id
ORDER BY bookings DESC;

-- 7. Buscar por reservation ID
SELECT * FROM bookings
WHERE reservation_id = 'XXXXX';  -- Reemplazar XXXXX

-- 8. Ver JSON raw de una reserva
SELECT
  reservation_id,
  guest_name,
  raw_data
FROM bookings
WHERE reservation_id = 'XXXXX';  -- Reemplazar XXXXX

-- 9. Eliminar reserva de test (CUIDADO!)
-- DELETE FROM bookings WHERE reservation_id = 'TEST-XXXXX';

-- 10. Contar reservas por status
SELECT
  status,
  COUNT(*) as count
FROM bookings
GROUP BY status
ORDER BY count DESC;
