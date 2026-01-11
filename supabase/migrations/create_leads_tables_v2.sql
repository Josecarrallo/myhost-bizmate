-- =====================================================
-- MYHOST BizMate - Sales & Leads System
-- Date: January 4, 2026
-- Purpose: Create tables for lead management system
-- =====================================================

-- =====================================================
-- TABLE 1: leads
-- Purpose: Unified lead/contact management for CRM
-- Used by: WF-SP-01 (Inbound Lead Handler)
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  property_id UUID,

  -- Contact Information
  name TEXT,
  phone TEXT,
  email TEXT,
  channel TEXT CHECK (channel IN ('whatsapp', 'instagram', 'email', 'web', 'vapi')),

  -- Commercial Status
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'ENGAGED', 'HOT', 'FOLLOWING_UP', 'WON', 'LOST')),
  intent TEXT CHECK (intent IN ('info', 'price', 'availability', 'booking')),
  score INTEGER DEFAULT 0,

  -- Context
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  message_history JSONB DEFAULT '[]'::jsonb,

  -- Tracking
  source_url TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  lost_reason TEXT,

  -- Indexes for performance
  CONSTRAINT unique_phone_tenant UNIQUE (phone, tenant_id),
  CONSTRAINT unique_email_tenant UNIQUE (email, tenant_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_leads_tenant_id ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_channel ON leads(channel);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email) WHERE email IS NOT NULL;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Comments for documentation
COMMENT ON TABLE leads IS 'Unified lead/contact management table for CRM system. Captures all inbound contacts from WhatsApp, Email, Instagram, Web, and VAPI.';
COMMENT ON COLUMN leads.status IS 'Lead funnel stage: NEW → ENGAGED → HOT → FOLLOWING_UP → WON/LOST';
COMMENT ON COLUMN leads.intent IS 'Detected intent from conversation: info, price, availability, booking';
COMMENT ON COLUMN leads.score IS 'AI-calculated lead score (0-100). Higher = more likely to convert';
COMMENT ON COLUMN leads.channel IS 'Source channel: whatsapp, instagram, email, web, vapi';

-- =====================================================
-- TABLE 2: lead_events
-- Purpose: Event log for lead lifecycle tracking
-- Used by: All workflows that interact with leads
-- =====================================================

CREATE TABLE IF NOT EXISTS lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'lead_created',
    'lead_updated',
    'status_changed',
    'followup_sent',
    'message_received',
    'message_sent',
    'converted',
    'lost',
    'ai_hot_lead_detected',
    'ai_ready_to_book'
  )),

  -- Event payload
  payload_json JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT
);

-- Create indexes for querying events
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_event_type ON lead_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON lead_events(created_at DESC);

-- Comments for documentation
COMMENT ON TABLE lead_events IS 'Event log for all lead lifecycle events. Used for analytics, debugging, and workflow triggers.';
COMMENT ON COLUMN lead_events.event_type IS 'Type of event that occurred in the lead lifecycle';
COMMENT ON COLUMN lead_events.payload_json IS 'Flexible JSON field for event-specific data (messages, status changes, etc.)';

-- =====================================================
-- TABLE 3: transfers
-- Purpose: Airport pickup and transfer management
-- Used by: Upsell features and guest journey
-- =====================================================

CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  property_id UUID,

  -- Transfer details
  type TEXT DEFAULT 'airport_pickup' CHECK (type IN ('airport_pickup', 'airport_dropoff', 'custom')),
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_datetime TIMESTAMPTZ NOT NULL,
  flight_number TEXT,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage INTEGER DEFAULT 0,

  -- Pricing
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',

  -- Guest details
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')),
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_type TEXT,
  vehicle_plate TEXT,

  -- Notes
  special_requests TEXT,
  internal_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transfers_booking_id ON transfers(booking_id);
CREATE INDEX IF NOT EXISTS idx_transfers_property_id ON transfers(property_id);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfers(status);
CREATE INDEX IF NOT EXISTS idx_transfers_pickup_datetime ON transfers(pickup_datetime);
CREATE INDEX IF NOT EXISTS idx_transfers_created_at ON transfers(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transfers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_transfers_updated_at
  BEFORE UPDATE ON transfers
  FOR EACH ROW
  EXECUTE FUNCTION update_transfers_updated_at();

-- Comments for documentation
COMMENT ON TABLE transfers IS 'Airport pickup and transfer management. Supports upselling transport services to guests.';
COMMENT ON COLUMN transfers.type IS 'Type of transfer: airport_pickup, airport_dropoff, custom';
COMMENT ON COLUMN transfers.status IS 'Transfer status: pending → confirmed → assigned → in_progress → completed/cancelled';
COMMENT ON COLUMN transfers.price IS 'Price for the transfer service (typically $25-50 for airport pickup in Bali)';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Successfully created tables: leads, lead_events, transfers';
  RAISE NOTICE '📊 Created indexes for optimal query performance';
  RAISE NOTICE '🔔 Created triggers for automatic timestamp updates';
  RAISE NOTICE '📝 Next step: Configure Row Level Security (RLS) policies';
END $$;
