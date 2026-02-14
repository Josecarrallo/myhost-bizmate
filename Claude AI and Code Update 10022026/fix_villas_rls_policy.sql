-- =====================================================
-- FIX: Add RLS Policy to villas table
-- Date: 10 Feb 2026
-- Reason: villas table missing policy, blocking anon key access
-- =====================================================

-- Apply same policy as bookings, leads, autopilot_alerts, etc.
CREATE POLICY "Allow all access to villas"
ON villas FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Verificar que la policy fue creada
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'villas'
ORDER BY policyname;
