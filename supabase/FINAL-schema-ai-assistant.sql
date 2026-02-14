CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.ai_chat_history_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context_mode TEXT CHECK (context_mode IN ('overview', 'bookings', 'revenue', 'operations')) DEFAULT 'overview',
  date_range_from DATE,
  date_range_to DATE,
  kpis_snapshot JSONB DEFAULT '{}'::jsonb,
  actions_suggested JSONB DEFAULT '[]'::jsonb,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_tenant ON public.ai_chat_history_v2(tenant_id);
CREATE INDEX idx_ai_chat_session ON public.ai_chat_history_v2(session_id);
CREATE INDEX idx_ai_chat_created ON public.ai_chat_history_v2(created_at DESC);

CREATE TABLE public.ai_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  chat_history_id UUID REFERENCES public.ai_chat_history_v2(id) ON DELETE SET NULL,
  request_payload JSONB NOT NULL,
  response_payload JSONB NOT NULL,
  provider TEXT DEFAULT 'placeholder',
  model TEXT,
  tokens_used INTEGER,
  cost_usd DECIMAL(10,4),
  status TEXT DEFAULT 'success',
  error_message TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_runs_tenant ON public.ai_runs(tenant_id);
CREATE INDEX idx_ai_runs_created ON public.ai_runs(created_at DESC);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  performed_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_tenant ON public.audit_logs(tenant_id);
CREATE INDEX idx_audit_performed_by ON public.audit_logs(performed_by_user_id);

CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_resource_type TEXT,
  related_resource_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_tenant ON public.alerts(tenant_id);
CREATE INDEX idx_alerts_unread ON public.alerts(tenant_id, is_read) WHERE NOT is_read;

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
  WHERE p.owner_id = p_tenant_id AND b.status NOT IN ('cancelled')
    AND b.check_out > p_date_from AND b.check_in < p_date_to;

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
  WHERE p.owner_id = p_tenant_id AND b.status NOT IN ('cancelled')
    AND b.check_in >= p_date_from AND b.check_in <= p_date_to;
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
  WHERE p.owner_id = p_tenant_id AND b.status NOT IN ('cancelled')
    AND b.check_in >= p_date_from AND b.check_in <= p_date_to;

  IF v_total_nights > 0 THEN v_adr := v_total_revenue / v_total_nights;
  ELSE v_adr := 0;
  END IF;
  RETURN ROUND(v_adr, 2);
END;
$$ LANGUAGE plpgsql;

SELECT 'Schema creado exitosamente!' as status;
