-- Fix KPI functions to count all bookings except cancelled

CREATE OR REPLACE FUNCTION public.calculate_occupancy_rate(p_tenant_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  v_total_nights INTEGER;
  v_booked_nights INTEGER;
  v_occupancy_rate DECIMAL(5,2);
BEGIN
  SELECT (p_date_to - p_date_from) * COUNT(*) INTO v_total_nights
  FROM public.properties WHERE owner_id = p_tenant_id AND status = 'active';

  SELECT COALESCE(SUM(CASE
    WHEN check_in >= p_date_from AND check_out <= p_date_to THEN nights
    WHEN check_in < p_date_from AND check_out > p_date_to THEN (p_date_to - p_date_from)
    WHEN check_in < p_date_from AND check_out <= p_date_to THEN (check_out - p_date_from)
    WHEN check_in >= p_date_from AND check_out > p_date_to THEN (p_date_to - check_in)
    ELSE 0 END), 0) INTO v_booked_nights
  FROM public.bookings b JOIN public.properties p ON b.property_id = p.id
  WHERE p.owner_id = p_tenant_id
    AND b.status != 'cancelled'
    AND b.check_out > p_date_from
    AND b.check_in < p_date_to;

  IF v_total_nights > 0 THEN
    v_occupancy_rate := (v_booked_nights::DECIMAL / v_total_nights::DECIMAL) * 100;
  ELSE
    v_occupancy_rate := 0;
  END IF;
  RETURN ROUND(v_occupancy_rate, 2);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_total_revenue(p_tenant_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS DECIMAL(10,2) AS $$
DECLARE v_total_revenue DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(b.total_price), 0) INTO v_total_revenue
  FROM public.bookings b JOIN public.properties p ON b.property_id = p.id
  WHERE p.owner_id = p_tenant_id
    AND b.status != 'cancelled'
    AND b.check_in >= p_date_from
    AND b.check_in <= p_date_to;
  RETURN v_total_revenue;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.calculate_adr(p_tenant_id UUID, p_date_from DATE, p_date_to DATE)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  v_total_revenue DECIMAL(10,2);
  v_total_nights INTEGER;
  v_adr DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(b.total_price), 0), COALESCE(SUM(b.nights), 0)
  INTO v_total_revenue, v_total_nights
  FROM public.bookings b JOIN public.properties p ON b.property_id = p.id
  WHERE p.owner_id = p_tenant_id
    AND b.status != 'cancelled'
    AND b.check_in >= p_date_from
    AND b.check_in <= p_date_to;

  IF v_total_nights > 0 THEN v_adr := v_total_revenue / v_total_nights;
  ELSE v_adr := 0;
  END IF;
  RETURN ROUND(v_adr, 2);
END;
$$ LANGUAGE plpgsql;

SELECT 'KPI functions updated!' as status;
