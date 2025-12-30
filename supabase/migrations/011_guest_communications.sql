-- Migration: Guest Communications Tables
-- Created: 2025-12-30
-- Description: Tables for email campaigns, WhatsApp messaging, and guest contact management

-- =====================================================
-- Table: guest_contacts
-- Purpose: Store guest contact information and segments
-- =====================================================
CREATE TABLE IF NOT EXISTS guest_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  phone TEXT,
  segment TEXT[] DEFAULT '{}', -- Array: ['vip', 'longstay', 'recent', etc]
  last_stay_date DATE,
  total_stays INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  preferences JSONB DEFAULT '{}', -- Guest preferences (language, dietary, etc)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for guest_contacts
CREATE INDEX idx_guest_contacts_property ON guest_contacts(property_id);
CREATE INDEX idx_guest_contacts_email ON guest_contacts(email);
CREATE INDEX idx_guest_contacts_whatsapp ON guest_contacts(whatsapp);
CREATE INDEX idx_guest_contacts_segment ON guest_contacts USING GIN(segment);

-- =====================================================
-- Table: email_drafts
-- Purpose: Store email campaign drafts
-- =====================================================
CREATE TABLE IF NOT EXISTS email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  segment_id TEXT, -- 'all', 'recent', 'vip', 'longstay', etc
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('formal', 'friendly', 'promo')),
  recipients_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email_drafts
CREATE INDEX idx_email_drafts_property ON email_drafts(property_id);
CREATE INDEX idx_email_drafts_created_by ON email_drafts(created_by);

-- =====================================================
-- Table: email_logs
-- Purpose: Track sent emails and their status
-- =====================================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES email_drafts(id) ON DELETE SET NULL,
  segment_id TEXT,
  subject TEXT NOT NULL,
  recipients_count INTEGER NOT NULL,
  successful_sends INTEGER DEFAULT 0,
  failed_sends INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('sending', 'sent', 'failed', 'partial')) DEFAULT 'sending',
  sendgrid_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for email_logs
CREATE INDEX idx_email_logs_property ON email_logs(property_id);
CREATE INDEX idx_email_logs_draft ON email_logs(draft_id);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);

-- =====================================================
-- Table: whatsapp_messages
-- Purpose: Log WhatsApp messages sent to guests
-- =====================================================
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_contact_id UUID REFERENCES guest_contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('manual', 'automated', 'campaign')) DEFAULT 'manual',
  status TEXT CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')) DEFAULT 'pending',
  whatsapp_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

-- Indexes for whatsapp_messages
CREATE INDEX idx_whatsapp_messages_property ON whatsapp_messages(property_id);
CREATE INDEX idx_whatsapp_messages_guest ON whatsapp_messages(guest_contact_id);
CREATE INDEX idx_whatsapp_messages_phone ON whatsapp_messages(phone_number);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages(status);
CREATE INDEX idx_whatsapp_messages_sent_at ON whatsapp_messages(sent_at DESC);

-- =====================================================
-- Functions: Auto-update timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_guest_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_guest_contacts_timestamp
  BEFORE UPDATE ON guest_contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_guest_contacts_updated_at();

CREATE OR REPLACE FUNCTION update_email_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_email_drafts_timestamp
  BEFORE UPDATE ON email_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_email_drafts_updated_at();

-- =====================================================
-- Sample Data: Insert mock guest contacts for Izumi Hotel
-- =====================================================
INSERT INTO guest_contacts (property_id, full_name, email, whatsapp, phone, segment, last_stay_date, total_stays, total_revenue)
VALUES
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'John Smith', 'john.smith@email.com', '+1234567890', '+1234567890', ARRAY['recent'], '2025-12-15', 1, 450.00),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'Maria Garcia', 'maria.garcia@email.com', '+34612345678', '+34612345678', ARRAY['vip', 'longstay'], '2025-11-20', 3, 1500.00),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'David Chen', 'david.chen@email.com', NULL, '+86138000000', ARRAY['recent'], '2025-12-10', 1, 500.00),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'Sophie Laurent', 'sophie.laurent@email.com', '+33612345678', '+33612345678', ARRAY['vip'], '2025-10-05', 2, 1200.00),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'Carlos Rodriguez', 'carlos.rodriguez@email.com', '+5491123456789', '+5491123456789', ARRAY['longstay'], '2025-09-15', 1, 2500.00)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Comments for documentation
-- =====================================================
COMMENT ON TABLE guest_contacts IS 'Stores guest contact information and segmentation for marketing campaigns';
COMMENT ON TABLE email_drafts IS 'Stores email campaign drafts before sending';
COMMENT ON TABLE email_logs IS 'Tracks sent email campaigns and their delivery status';
COMMENT ON TABLE whatsapp_messages IS 'Logs all WhatsApp messages sent to guests';

COMMENT ON COLUMN guest_contacts.segment IS 'Guest segments: vip, recent, longstay, returning, etc. Used for targeted campaigns.';
COMMENT ON COLUMN email_logs.status IS 'sending: in progress, sent: all sent, failed: all failed, partial: some failed';
COMMENT ON COLUMN whatsapp_messages.message_type IS 'manual: sent by user, automated: triggered by event, campaign: bulk campaign';
