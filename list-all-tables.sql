-- =====================================================
-- SCRIPT: Listar TODAS las tablas y su info
-- Ejecutar en: Supabase SQL Editor
-- =====================================================

-- 1. LISTAR TODAS LAS TABLAS EN SCHEMA PUBLIC
SELECT
  table_name as "Tabla",
  (SELECT COUNT(*)
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = t.table_name) as "Columnas"
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. LISTAR TABLAS CON NÚMERO DE REGISTROS
-- (Esto puede tardar si hay muchas tablas)

DO $$
DECLARE
  tbl RECORD;
  row_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TABLAS Y CANTIDAD DE REGISTROS:';
  RAISE NOTICE '========================================';

  FOR tbl IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I', tbl.table_name) INTO row_count;
    RAISE NOTICE '✅ % : % registros', tbl.table_name, row_count;
  END LOOP;

  RAISE NOTICE '========================================';
END $$;

-- 3. VERIFICAR SI RLS ESTÁ HABILITADO
SELECT
  tablename as "Tabla",
  rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
