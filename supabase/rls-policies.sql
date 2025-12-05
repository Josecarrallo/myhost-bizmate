-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- MY HOST BIZMATE - FASE 2
-- ========================================================================

-- ENABLE RLS ON ALL TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_portal_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- 1. USERS TABLE POLICIES
-- ========================================================================

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Owners can view all users
CREATE POLICY "Owners can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ========================================================================
-- 2. PROPERTIES TABLE POLICIES
-- ========================================================================

-- Users can view properties they have access to
CREATE POLICY "Users can view accessible properties"
  ON public.properties FOR SELECT
  USING (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND (
          role = 'owner'
          OR properties.id::text = ANY(
            SELECT jsonb_array_elements_text(properties_access)
          )
        )
    )
  );

-- Owners can insert properties
CREATE POLICY "Owners can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Owners/Admins can update their properties
CREATE POLICY "Owners can update their properties"
  ON public.properties FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- Owners can delete their properties
CREATE POLICY "Owners can delete their properties"
  ON public.properties FOR DELETE
  USING (
    owner_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ========================================================================
-- 3. BOOKINGS TABLE POLICIES
-- ========================================================================

-- Users can view bookings for their accessible properties
CREATE POLICY "Users can view accessible bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      JOIN public.users u ON u.id = auth.uid()
      WHERE p.id = bookings.property_id
        AND (
          p.owner_id = auth.uid()
          OR u.role = 'owner'
          OR p.id::text = ANY(
            SELECT jsonb_array_elements_text(u.properties_access)
          )
        )
    )
  );

-- Reception/Admin/Owner can insert bookings
CREATE POLICY "Staff can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin', 'reception')
    )
  );

-- Staff can update bookings for their properties
CREATE POLICY "Staff can update accessible bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      JOIN public.users u ON u.id = auth.uid()
      WHERE p.id = bookings.property_id
        AND (
          p.owner_id = auth.uid()
          OR u.role IN ('owner', 'admin', 'reception')
        )
    )
  );

-- Only owners can delete bookings
CREATE POLICY "Owners can delete bookings"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ========================================================================
-- 4. PAYMENTS TABLE POLICIES
-- ========================================================================

-- Users can view payments for accessible bookings
CREATE POLICY "Users can view accessible payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.properties p ON p.id = b.property_id
      JOIN public.users u ON u.id = auth.uid()
      WHERE b.id = payments.booking_id
        AND (
          p.owner_id = auth.uid()
          OR u.role IN ('owner', 'admin', 'reception')
        )
    )
  );

-- Staff can insert payments
CREATE POLICY "Staff can insert payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin', 'reception')
    )
  );

-- Staff can update payments
CREATE POLICY "Staff can update payments"
  ON public.payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin', 'reception')
    )
  );

-- Only owners can delete payments
CREATE POLICY "Owners can delete payments"
  ON public.payments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ========================================================================
-- 5. GUEST PORTAL ACCESS POLICIES
-- ========================================================================

-- Anyone can read guest portal access (public access)
CREATE POLICY "Anyone can view guest portal access"
  ON public.guest_portal_access FOR SELECT
  USING (true);

-- System can insert guest portal access
CREATE POLICY "System can insert guest portal access"
  ON public.guest_portal_access FOR INSERT
  WITH CHECK (true);

-- ========================================================================
-- 6. DIGITAL CHECK-INS POLICIES
-- ========================================================================

-- Staff can view check-ins for their properties
CREATE POLICY "Staff can view accessible checkins"
  ON public.digital_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      JOIN public.properties p ON p.id = b.property_id
      JOIN public.users u ON u.id = auth.uid()
      WHERE b.id = digital_checkins.booking_id
        AND (
          p.owner_id = auth.uid()
          OR u.role IN ('owner', 'admin', 'reception')
        )
    )
  );

-- Anyone can insert check-in (guest submits)
CREATE POLICY "Anyone can insert checkins"
  ON public.digital_checkins FOR INSERT
  WITH CHECK (true);

-- Staff can update check-ins
CREATE POLICY "Staff can update checkins"
  ON public.digital_checkins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin', 'reception')
    )
  );

-- ========================================================================
-- 7. HOUSEKEEPING TASKS POLICIES
-- ========================================================================

-- Housekeeping staff can view their assigned tasks
CREATE POLICY "Housekeeping can view tasks"
  ON public.housekeeping_tasks FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Admin/Owner can insert tasks
CREATE POLICY "Admin can insert housekeeping tasks"
  ON public.housekeeping_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Housekeeping can update their tasks
CREATE POLICY "Housekeeping can update own tasks"
  ON public.housekeeping_tasks FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Only admin/owner can delete tasks
CREATE POLICY "Admin can delete housekeeping tasks"
  ON public.housekeeping_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ========================================================================
-- 8. MAINTENANCE ISSUES POLICIES
-- ========================================================================

-- Maintenance staff can view their assigned issues
CREATE POLICY "Maintenance can view issues"
  ON public.maintenance_issues FOR SELECT
  USING (
    assigned_to = auth.uid()
    OR reported_by = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Anyone with access can insert issues
CREATE POLICY "Staff can insert maintenance issues"
  ON public.maintenance_issues FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Maintenance can update their issues
CREATE POLICY "Maintenance can update assigned issues"
  ON public.maintenance_issues FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Only admin/owner can delete issues
CREATE POLICY "Admin can delete maintenance issues"
  ON public.maintenance_issues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ========================================================================
-- 9. REVIEWS POLICIES
-- ========================================================================

-- Anyone can view reviews (public)
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Staff can insert reviews
CREATE POLICY "Staff can insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
    )
  );

-- Staff can update reviews (respond)
CREATE POLICY "Staff can update reviews"
  ON public.reviews FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin', 'reception')
    )
  );

-- ========================================================================
-- 10. PRICING RULES POLICIES
-- ========================================================================

-- Users can view pricing rules for accessible properties
CREATE POLICY "Users can view accessible pricing rules"
  ON public.pricing_rules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.properties p
      JOIN public.users u ON u.id = auth.uid()
      WHERE p.id = pricing_rules.property_id
        AND (
          p.owner_id = auth.uid()
          OR u.role = 'owner'
        )
    )
  );

-- Owner/Admin can manage pricing rules
CREATE POLICY "Admin can insert pricing rules"
  ON public.pricing_rules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin can update pricing rules"
  ON public.pricing_rules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admin can delete pricing rules"
  ON public.pricing_rules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ========================================================================
-- 11. CULTURAL EVENTS POLICIES
-- ========================================================================

-- Anyone can view cultural events
CREATE POLICY "Anyone can view cultural events"
  ON public.cultural_events FOR SELECT
  USING (true);

-- Only admin can manage cultural events
CREATE POLICY "Admin can manage cultural events"
  ON public.cultural_events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- ========================================================================
-- 12. AI CHAT HISTORY POLICIES
-- ========================================================================

-- Users can view their own chat history
CREATE POLICY "Users can view own chat history"
  ON public.ai_chat_history FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own chat history
CREATE POLICY "Users can insert own chat history"
  ON public.ai_chat_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ========================================================================
-- END OF RLS POLICIES
-- ========================================================================
