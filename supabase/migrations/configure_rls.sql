-- =====================================================
-- MYHOST BizMate - Row Level Security (RLS)
-- Date: January 4, 2026
-- Purpose: Configure security policies for leads tables
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLICIES FOR: leads
-- =====================================================

-- Allow authenticated users to read all leads
CREATE POLICY "Allow authenticated users to read leads"
ON leads FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert leads
CREATE POLICY "Allow authenticated users to insert leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads"
ON leads FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete leads
CREATE POLICY "Allow authenticated users to delete leads"
ON leads FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- POLICIES FOR: lead_events
-- =====================================================

-- Allow authenticated users to read all lead_events
CREATE POLICY "Allow authenticated users to read lead_events"
ON lead_events FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert lead_events
CREATE POLICY "Allow authenticated users to insert lead_events"
ON lead_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Note: lead_events are append-only, no UPDATE or DELETE

-- =====================================================
-- POLICIES FOR: transfers
-- =====================================================

-- Allow authenticated users to read all transfers
CREATE POLICY "Allow authenticated users to read transfers"
ON transfers FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert transfers
CREATE POLICY "Allow authenticated users to insert transfers"
ON transfers FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update transfers
CREATE POLICY "Allow authenticated users to update transfers"
ON transfers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete transfers
CREATE POLICY "Allow authenticated users to delete transfers"
ON transfers FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ RLS enabled on leads, lead_events, transfers';
  RAISE NOTICE '🔒 Policies created for authenticated users';
  RAISE NOTICE '📝 Note: These are permissive policies. Refine based on your tenant model.';
END $$;
