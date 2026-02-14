-- Communications Log Table
-- Stores all email and WhatsApp communications sent to guests

CREATE TABLE IF NOT EXISTS public.communications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Multi-tenant
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  guest_id UUID NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,

  -- Communication details
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  template_key TEXT, -- 'welcome', 'pre_checkin', 'checkin_day', 'payment_reminder', 'review_request', null for custom

  -- Recipient
  recipient_email TEXT,
  recipient_phone TEXT,

  -- Email specific
  subject TEXT,

  -- Message
  message_body TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'delivered', 'read')),
  provider_message_id TEXT, -- ID from provider (SendGrid, ChakraHQ, etc.)
  provider_response JSONB, -- Full response from provider

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Metadata
  sent_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Staff who sent
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_comm_tenant ON public.communications_log(tenant_id);
CREATE INDEX idx_comm_guest ON public.communications_log(guest_id);
CREATE INDEX idx_comm_booking ON public.communications_log(booking_id);
CREATE INDEX idx_comm_status ON public.communications_log(status);
CREATE INDEX idx_comm_created ON public.communications_log(created_at DESC);
CREATE INDEX idx_comm_channel ON public.communications_log(channel);

-- Enable Row Level Security
ALTER TABLE public.communications_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own communications"
  ON public.communications_log FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can insert own communications"
  ON public.communications_log FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can update own communications"
  ON public.communications_log FOR UPDATE
  USING (tenant_id = auth.uid());

COMMENT ON TABLE public.communications_log IS 'Logs all email and WhatsApp communications sent to guests';

SELECT 'Communications Log schema created successfully!' as status;
