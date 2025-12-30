-- Migration: Dashboard RPC Functions
-- Created: 2025-12-30
-- Description: RPC functions for dashboard statistics and alerts

-- =====================================================
-- Function: get_dashboard_stats()
-- Purpose: Get dashboard statistics
-- =====================================================
DROP FUNCTION IF EXISTS get_dashboard_stats();

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  occupancy_rate DECIMAL,
  active_bookings BIGINT,
  total_properties BIGINT,
  guests_this_month BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  avg_daily_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'checked_in', 'checked_out') THEN b.total_price ELSE 0 END), 0) as rev,
      COUNT(*) FILTER (WHERE b.status IN ('confirmed', 'checked_in')) as active,
      COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed,
      COUNT(*) FILTER (WHERE b.status = 'pending') as pending,
      COALESCE(SUM(CASE WHEN DATE_TRUNC('month', b.created_at) = DATE_TRUNC('month', CURRENT_DATE)
                        AND b.status IN ('confirmed', 'checked_in', 'checked_out') THEN b.guests ELSE 0 END), 0) as guests_month,
      COALESCE(AVG(CASE WHEN b.status IN ('confirmed', 'checked_in', 'checked_out') AND (b.check_out - b.check_in) > 0
                   THEN b.total_price / (b.check_out - b.check_in) END), 0) as avg_rate
    FROM bookings b
  )
  SELECT
    stats.rev,
    ROUND((stats.active::NUMERIC / NULLIF((SELECT COUNT(*) FROM bookings), 0)) * 100, 2),
    stats.active,
    (SELECT COUNT(*) FROM properties WHERE status = 'active'),
    stats.guests_month,
    stats.confirmed,
    stats.pending,
    ROUND(stats.avg_rate, 2)
  FROM stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: get_today_checkins()
-- Purpose: Get today's check-ins
-- =====================================================
DROP FUNCTION IF EXISTS get_today_checkins();

CREATE OR REPLACE FUNCTION get_today_checkins()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  property_name TEXT,
  guests INTEGER,
  nights INTEGER,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    p.name as property_name,
    b.guests as guests,
    (b.check_out - b.check_in)::INTEGER as nights,
    b.check_in,
    b.check_out,
    b.total_price,
    b.status
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_in = CURRENT_DATE
    AND b.status IN ('confirmed', 'checked_in')
  ORDER BY b.check_in;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: get_today_checkouts()
-- Purpose: Get today's check-outs
-- =====================================================
DROP FUNCTION IF EXISTS get_today_checkouts();

CREATE OR REPLACE FUNCTION get_today_checkouts()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  property_name TEXT,
  guests INTEGER,
  nights INTEGER,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    p.name as property_name,
    b.guests as guests,
    (b.check_out - b.check_in)::INTEGER as nights,
    b.check_in,
    b.check_out,
    b.total_price,
    b.status
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_out = CURRENT_DATE
    AND b.status IN ('checked_in', 'checked_out')
  ORDER BY b.check_out;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Function: get_active_alerts()
-- Purpose: Get active alerts
-- =====================================================
DROP FUNCTION IF EXISTS get_active_alerts();

CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  alert_id UUID,
  message TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ,
  related_type TEXT,
  related_id UUID
) AS $$
BEGIN
  -- Check if alerts table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'alerts') THEN
    RETURN QUERY
    SELECT
      a.id as alert_id,
      a.message,
      a.severity,
      a.created_at,
      a.related_type,
      a.related_id
    FROM alerts a
    WHERE a.status = 'active'
    ORDER BY
      CASE a.severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        WHEN 'info' THEN 3
        ELSE 4
      END,
      a.created_at DESC
    LIMIT 10;
  END IF;
  -- If table doesn't exist, function returns empty set (no ELSE needed)
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON FUNCTION get_dashboard_stats() IS 'Returns dashboard statistics including revenue, occupancy, and bookings';
COMMENT ON FUNCTION get_today_checkins() IS 'Returns list of check-ins scheduled for today';
COMMENT ON FUNCTION get_today_checkouts() IS 'Returns list of check-outs scheduled for today';
COMMENT ON FUNCTION get_active_alerts() IS 'Returns active alerts ordered by severity (critical, warning, info)';
