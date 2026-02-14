-- ============================================
-- BACKUP SUPABASE - ANTES DE MULTI-VILLA CHANGES
-- Fecha: 1 Febrero 2026
-- Proyecto: MYHOST BizMate
-- Motivo: Añadir funcionalidad multi-villa reports
-- ============================================

-- IMPORTANTE: Este backup se puede restaurar ejecutando este archivo en Supabase SQL Editor

-- ============================================
-- 1. BACKUP DE SCHEMA ACTUAL DE PROPERTIES
-- ============================================

-- Guardar estructura actual de properties
CREATE TABLE IF NOT EXISTS properties_backup_20260201 AS
SELECT * FROM properties;

COMMENT ON TABLE properties_backup_20260201 IS
'Backup de properties antes de añadir columnas para multi-villa reports - 1 Feb 2026';

-- ============================================
-- 2. VERIFICAR DATOS EXISTENTES
-- ============================================

-- Count de properties actuales
SELECT
  'Total Properties' as metric,
  COUNT(*) as value
FROM properties;

-- Count de bookings actuales
SELECT
  'Total Bookings' as metric,
  COUNT(*) as value
FROM bookings;

-- Tenant actual
SELECT
  'Current Tenant' as metric,
  id as value,
  full_name
FROM users
WHERE id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

-- ============================================
-- 3. EXPORT DE DATOS CRÍTICOS
-- ============================================

-- Properties con sus relaciones
CREATE TABLE IF NOT EXISTS properties_relationships_backup AS
SELECT
  p.id as property_id,
  p.name as property_name,
  p.owner_id,
  u.full_name as owner_name,
  u.email as owner_email,
  COUNT(b.id) as total_bookings,
  COALESCE(SUM(b.total_price), 0) as total_revenue
FROM properties p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN bookings b ON b.property_id = p.id
GROUP BY p.id, p.name, p.owner_id, u.full_name, u.email;

-- ============================================
-- 4. SCRIPT DE ROLLBACK (POR SI ACASO)
-- ============================================

-- Para revertir cambios si algo sale mal:
/*
-- Eliminar nuevas columnas de properties
ALTER TABLE properties
  DROP COLUMN IF EXISTS owner_email,
  DROP COLUMN IF EXISTS auto_reports_enabled,
  DROP COLUMN IF EXISTS report_frequency,
  DROP COLUMN IF EXISTS report_day_of_month,
  DROP COLUMN IF EXISTS commission_rate;

-- Eliminar nueva tabla
DROP TABLE IF EXISTS generated_reports CASCADE;

-- Eliminar función RPC
DROP FUNCTION IF EXISTS get_property_report_data(UUID, DATE, DATE);

-- Restaurar desde backup si necesario
-- INSERT INTO properties SELECT * FROM properties_backup_20260201;
*/

-- ============================================
-- 5. NOTAS IMPORTANTES
-- ============================================

/*
ANTES DE EJECUTAR LOS CAMBIOS:
- Este archivo contiene el backup
- Las tablas *_backup_20260201 tienen los datos originales
- El script de rollback está comentado arriba
- Supabase tiene backups automáticos diarios

DESPUÉS DE EJECUTAR LOS CAMBIOS:
- Verificar que las 14 properties de Izumi siguen intactas
- Verificar que los 144 bookings siguen funcionando
- Verificar que el frontend sigue funcionando
- Probar RLS con queries

SI ALGO SALE MAL:
- Ejecutar el script de rollback comentado arriba
- O restaurar desde Supabase Dashboard > Backups
*/

-- ============================================
-- FIN DEL BACKUP
-- ============================================
