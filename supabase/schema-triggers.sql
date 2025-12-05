-- ========================================================================
-- MY HOST BIZMATE - TRIGGERS AND FUNCTIONS
-- Execute this AFTER schema-simple.sql
-- ========================================================================

-- ========================================================================
-- DROP EXISTING FUNCTIONS AND TRIGGERS
-- ========================================================================
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
DROP TRIGGER IF EXISTS update_housekeeping_updated_at ON public.housekeeping_tasks;
DROP TRIGGER IF EXISTS update_maintenance_updated_at ON public.maintenance_issues;
DROP TRIGGER IF EXISTS update_pricing_rules_updated_at ON public.pricing_rules;
DROP TRIGGER IF EXISTS calculate_nights_trigger ON public.bookings;
DROP TRIGGER IF EXISTS update_payment_status_on_payment ON public.payments;

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.calculate_nights() CASCADE;
DROP FUNCTION IF EXISTS public.check_availability(UUID, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_booking_price(UUID, DATE, DATE, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.update_booking_payment_status() CASCADE;

-- ========================================================================
-- FUNCTIONS
-- ========================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate nights in bookings
CREATE OR REPLACE FUNCTION public.calculate_nights()
RETURNS TRIGGER AS $$
BEGIN
  NEW.nights = NEW.check_out - NEW.check_in;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check availability for a property in a date range
CREATE OR REPLACE FUNCTION public.check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE property_id = p_property_id
      AND status NOT IN ('cancelled', 'inquiry')
      AND (
        (check_in <= p_check_in AND check_out > p_check_in) OR
        (check_in < p_check_out AND check_out >= p_check_out) OR
        (check_in >= p_check_in AND check_out <= p_check_out)
      )
  );
END;
$$ LANGUAGE plpgsql;

-- Calculate booking price (basic version)
CREATE OR REPLACE FUNCTION public.calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
  v_base_price DECIMAL;
  v_nights INTEGER;
  v_total DECIMAL;
BEGIN
  SELECT base_price INTO v_base_price
  FROM public.properties
  WHERE id = p_property_id;

  v_nights := p_check_out - p_check_in;
  v_total := v_base_price * v_nights;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Update booking payment status based on payments
CREATE OR REPLACE FUNCTION public.update_booking_payment_status()
RETURNS TRIGGER AS $$
DECLARE
  v_total_paid DECIMAL;
  v_booking_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM public.payments
  WHERE booking_id = NEW.booking_id
    AND status = 'completed';

  SELECT total_price INTO v_booking_total
  FROM public.bookings
  WHERE id = NEW.booking_id;

  UPDATE public.bookings
  SET payment_status = CASE
    WHEN v_total_paid = 0 THEN 'pending'
    WHEN v_total_paid < v_booking_total THEN 'partial'
    WHEN v_total_paid >= v_booking_total THEN 'paid'
    ELSE payment_status
  END
  WHERE id = NEW.booking_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================================================
-- TRIGGERS
-- ========================================================================

-- Auto-update updated_at on tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_housekeeping_updated_at BEFORE UPDATE ON public.housekeeping_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_issues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Calculate nights automatically
CREATE TRIGGER calculate_nights_trigger BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.calculate_nights();

-- Auto-update payment status
CREATE TRIGGER update_payment_status_on_payment
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_booking_payment_status();

-- ========================================================================
-- SUCCESS MESSAGE
-- ========================================================================
DO $$
BEGIN
  RAISE NOTICE 'Triggers and functions created successfully! Now execute rls-policies.sql';
END $$;
