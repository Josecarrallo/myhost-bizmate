-- ========================================================================
-- CLEANUP SCRIPT - Remove existing AI Assistant tables
-- Run this FIRST before applying schema-ai-assistant-FIXED.sql
-- ========================================================================

-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS public.ai_runs CASCADE;
DROP TABLE IF EXISTS public.ai_chat_history_v2 CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.alerts CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.calculate_occupancy_rate(UUID, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_total_revenue(UUID, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_adr(UUID, DATE, DATE) CASCADE;

-- Verify cleanup
SELECT 'Cleanup completed. Tables dropped:' as message;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND (tablename LIKE 'ai_%' OR tablename = 'alerts' OR tablename = 'audit_logs');
