-- =====================================================
-- FIX: Occupancy rate based on full months × 31 days
-- Formula: total_nights / (number_of_months × 31)
-- Example 2026: 80 nights / (9 months × 31) = 28.67%
-- =====================================================

CREATE OR REPLACE FUNCTION get_overview_stats(
  p_tenant_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  total_revenue NUMERIC,
  revenue_paid NUMERIC,
  revenue_pending NUMERIC,
  total_nights INTEGER,
  total_bookings INTEGER,
  occupancy_rate NUMERIC,
  timeline_data JSONB,
  properties_data JSONB,
  sources_data JSONB,
  payment_status_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total_available_nights INTEGER;
  v_number_of_months INTEGER;
BEGIN
  -- Calculate number of months in the date range
  v_number_of_months := EXTRACT(YEAR FROM AGE(p_end_date, p_start_date)) * 12
                      + EXTRACT(MONTH FROM AGE(p_end_date, p_start_date)) + 1;

  -- Calculate available nights as: number_of_months × 31 days
  v_total_available_nights := v_number_of_months * 31;

  RETURN QUERY
  WITH booking_stats AS (
    SELECT
      b.id,
      b.property_id,
      b.check_in,
      b.check_out,
      b.nights,
      b.total_price,
      b.payment_status,
      b.source as booking_source,
      p.name as property_name
    FROM bookings b
    LEFT JOIN properties p ON b.property_id = p.id
    WHERE b.tenant_id = p_tenant_id
      AND b.status = 'confirmed'
      AND b.check_in >= p_start_date
      AND b.check_in <= p_end_date
  ),
  kpis AS (
    SELECT
      COALESCE(SUM(total_price), 0) as kpi_total_revenue,
      COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total_price ELSE 0 END), 0) as kpi_revenue_paid,
      COALESCE(SUM(CASE WHEN payment_status != 'paid' THEN total_price ELSE 0 END), 0) as kpi_revenue_pending,
      COALESCE(SUM(nights), 0)::INTEGER as kpi_total_nights,
      COUNT(*)::INTEGER as kpi_total_bookings,
      ROUND((COALESCE(SUM(nights), 0)::NUMERIC / NULLIF(v_total_available_nights, 0)) * 100, 2) as kpi_occupancy_rate
    FROM booking_stats
  ),
  timeline AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'month', month_num,
        'month_name', TO_CHAR(TO_DATE(month_num::TEXT, 'MM'), 'Month'),
        'bookings', COALESCE(bookings, 0),
        'nights', COALESCE(nights, 0),
        'revenue', COALESCE(revenue, 0)
      ) ORDER BY month_num
    ) as timeline_json
    FROM (
      SELECT
        m.month_num,
        COUNT(b.id)::INTEGER as bookings,
        SUM(b.nights)::INTEGER as nights,
        SUM(b.total_price) as revenue
      FROM generate_series(1, 12) as m(month_num)
      LEFT JOIN booking_stats b ON EXTRACT(MONTH FROM b.check_in) = m.month_num
      GROUP BY m.month_num
    ) monthly_data
  ),
  properties AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'property_name', prop_property_name,
        'revenue', prop_revenue,
        'nights', prop_nights,
        'occupancy_rate', prop_occupancy_rate
      ) ORDER BY prop_revenue DESC
    ) as properties_json
    FROM (
      SELECT
        COALESCE(property_name, 'Unknown Property') as prop_property_name,
        SUM(total_price) as prop_revenue,
        SUM(nights)::INTEGER as prop_nights,
        ROUND((SUM(nights)::NUMERIC / NULLIF(v_total_available_nights, 0)) * 100, 2) as prop_occupancy_rate
      FROM booking_stats
      GROUP BY property_name
    ) prop_data
  ),
  sources AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'source', src_booking_source,
        'bookings', src_bookings,
        'revenue', src_revenue,
        'percentage', src_percentage
      ) ORDER BY src_revenue DESC
    ) as sources_json
    FROM (
      SELECT
        COALESCE(booking_source, 'Unknown') as src_booking_source,
        COUNT(*)::INTEGER as src_bookings,
        SUM(total_price) as src_revenue,
        ROUND((SUM(total_price)::NUMERIC / NULLIF((SELECT SUM(total_price) FROM booking_stats), 0)) * 100, 2) as src_percentage
      FROM booking_stats
      GROUP BY booking_source
    ) source_data
  ),
  payments AS (
    SELECT jsonb_build_object(
      'paid', jsonb_build_object(
        'bookings', COALESCE(COUNT(*) FILTER (WHERE payment_status = 'paid'), 0),
        'revenue', COALESCE(SUM(total_price) FILTER (WHERE payment_status = 'paid'), 0)
      ),
      'pending', jsonb_build_object(
        'bookings', COALESCE(COUNT(*) FILTER (WHERE payment_status != 'paid'), 0),
        'revenue', COALESCE(SUM(total_price) FILTER (WHERE payment_status != 'paid'), 0)
      )
    ) as payment_json
    FROM booking_stats
  )
  SELECT
    k.kpi_total_revenue,
    k.kpi_revenue_paid,
    k.kpi_revenue_pending,
    k.kpi_total_nights,
    k.kpi_total_bookings,
    k.kpi_occupancy_rate,
    COALESCE(t.timeline_json, '[]'::jsonb),
    COALESCE(p.properties_json, '[]'::jsonb),
    COALESCE(s.sources_json, '[]'::jsonb),
    COALESCE(pm.payment_json, '{}'::jsonb)
  FROM kpis k, timeline t, properties p, sources s, payments pm;
END;
$$;
