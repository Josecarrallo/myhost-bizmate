-- AI Usage Tracking Table
-- Tracks monthly message limits and rate limiting

CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format: "2025-12"
  message_count INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 300,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: one record per tenant per month
  UNIQUE(tenant_id, month)
);

CREATE INDEX idx_usage_tenant_month ON public.ai_usage_tracking(tenant_id, month);

COMMENT ON TABLE public.ai_usage_tracking IS 'Monthly AI usage tracking for cost control';

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_ai_usage(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_month TEXT;
  v_record RECORD;
BEGIN
  v_current_month := TO_CHAR(NOW(), 'YYYY-MM');

  -- Get or insert record
  INSERT INTO public.ai_usage_tracking (tenant_id, month)
  VALUES (p_tenant_id, v_current_month)
  ON CONFLICT (tenant_id, month) DO NOTHING;

  -- Return current state
  SELECT
    message_count,
    monthly_limit,
    (monthly_limit - message_count) as remaining,
    (message_count < monthly_limit) as can_send,
    last_message_at
  INTO v_record
  FROM public.ai_usage_tracking
  WHERE tenant_id = p_tenant_id AND month = v_current_month;

  RETURN QUERY SELECT
    v_record.message_count,
    v_record.monthly_limit,
    v_record.remaining,
    v_record.can_send,
    v_record.last_message_at;
END;
$$ LANGUAGE plpgsql;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_ai_usage(p_tenant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_month TEXT;
  v_can_send BOOLEAN;
BEGIN
  v_current_month := TO_CHAR(NOW(), 'YYYY-MM');

  -- Check if can send
  SELECT (message_count < monthly_limit) INTO v_can_send
  FROM public.ai_usage_tracking
  WHERE tenant_id = p_tenant_id AND month = v_current_month;

  IF v_can_send THEN
    -- Increment counter
    UPDATE public.ai_usage_tracking
    SET
      message_count = message_count + 1,
      last_message_at = NOW(),
      updated_at = NOW()
    WHERE tenant_id = p_tenant_id AND month = v_current_month;

    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT 'AI Usage Tracking schema created successfully!' as status;
