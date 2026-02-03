-- VERIFICAR QUE LA MIGRACIÓN SE EJECUTÓ CORRECTAMENTE

-- 1. Verificar que existe la tabla generated_reports
SELECT
  'generated_reports table exists' as check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_name = 'generated_reports'
    ) THEN '✅ YES'
    ELSE '❌ NO'
  END as status;

-- 2. Verificar que existen las columnas nuevas en properties
SELECT
  'properties.owner_email column' as check_name,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'properties' AND column_name = 'owner_email'
    ) THEN '✅ YES'
    ELSE '❌ NO'
  END as status;

-- 3. Verificar que existen las funciones RPC
SELECT
  proname as function_name,
  '✅ EXISTS' as status
FROM pg_proc
WHERE proname IN (
  'get_property_report_data',
  'get_monthly_breakdown',
  'get_properties_for_auto_reports',
  'save_generated_report'
)
ORDER BY proname;

-- 4. Si no hay resultados arriba, buscar TODAS las funciones
SELECT
  'ALL FUNCTIONS (if above is empty)' as info,
  proname as function_name
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND prokind = 'f'
ORDER BY proname;
