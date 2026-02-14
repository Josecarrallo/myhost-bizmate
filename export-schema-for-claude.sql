-- SCHEMA COMPLETO PARA CLAUDE AI
-- Copia este output y envíalo a Claude AI

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- PROPERTIES TABLE
SELECT
  'properties table schema:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;

-- BOOKINGS TABLE
SELECT
  'bookings table schema:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
ORDER BY ordinal_position;

-- PAYMENTS TABLE
SELECT
  'payments table schema:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- MESSAGES TABLE
SELECT
  'messages table schema:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- 3 Properties existentes
SELECT * FROM properties WHERE status = 'active' LIMIT 3;

-- 3 Bookings existentes
SELECT * FROM bookings LIMIT 3;

-- ============================================
-- FUNCIONES SQL
-- ============================================

-- get_dashboard_stats function
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'get_dashboard_stats';

-- ============================================
-- TRIGGERS ACTIVOS
-- ============================================

SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
