-- =====================================================
-- PAYMENTS & MESSAGES TABLES - MY HOST BIZMATE
-- =====================================================
-- Created: 2025-12-20
-- Description: Payment transactions and messaging system
-- =====================================================

-- =====================================================
-- TABLE: payments
-- =====================================================
-- Stores all payment transactions for bookings
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  -- Guest Information
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,

  -- Payment Details
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'USD',
  payment_type TEXT CHECK (payment_type IN ('Full Payment', 'Deposit', 'Partial Payment', 'Refund')),

  -- Payment Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),

  -- Payment Method
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Credit Card', 'Bank Transfer', 'PayPal', 'Stripe', 'Cash', 'Other')),

  -- Transaction Details
  transaction_id TEXT UNIQUE,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Additional Info
  notes TEXT,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_date ON payments(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_guest_email ON payments(guest_email);

-- =====================================================
-- TABLE: messages
-- =====================================================
-- Stores all messages/conversations with guests
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,

  -- Conversation Info
  conversation_id UUID, -- Groups messages in same conversation

  -- Sender/Recipient Info
  sender_type TEXT NOT NULL CHECK (sender_type IN ('guest', 'host', 'ai', 'system')),
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,

  -- Message Content
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'photo', 'video', 'file', 'location')),
  message_text TEXT,

  -- Media/Attachments (for voice, photo, etc.)
  media_url TEXT,
  media_metadata JSONB DEFAULT '{}', -- duration for voice, size for files, etc.

  -- Message Status
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),

  -- AI Handling
  ai_handled BOOLEAN DEFAULT false,
  ai_response TEXT,
  ai_confidence DECIMAL(3, 2), -- 0.00 to 1.00

  -- Platform
  platform TEXT CHECK (platform IN ('whatsapp', 'email', 'sms', 'web', 'app')),

  -- Additional Info
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_property_id ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_guest_email ON messages(guest_email);
CREATE INDEX IF NOT EXISTS idx_messages_ai_handled ON messages(ai_handled);
CREATE INDEX IF NOT EXISTS idx_messages_platform ON messages(platform);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments (allow authenticated users to read/write)
CREATE POLICY "Enable read access for authenticated users" ON payments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON payments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON payments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for messages (allow authenticated users to read/write)
CREATE POLICY "Enable read access for authenticated users" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for messages
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get total revenue
CREATE OR REPLACE FUNCTION get_total_revenue(p_property_id UUID DEFAULT NULL)
RETURNS DECIMAL AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed');
  ELSE
    RETURN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE property_id = p_property_id AND status = 'completed');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending payments
CREATE OR REPLACE FUNCTION get_pending_payments_total(p_property_id UUID DEFAULT NULL)
RETURNS DECIMAL AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'pending');
  ELSE
    RETURN (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE property_id = p_property_id AND status = 'pending');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get unread messages count
CREATE OR REPLACE FUNCTION get_unread_messages_count(p_property_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COUNT(*) FROM messages WHERE status = 'unread');
  ELSE
    RETURN (SELECT COUNT(*) FROM messages WHERE property_id = p_property_id AND status = 'unread');
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get AI handled messages count
CREATE OR REPLACE FUNCTION get_ai_handled_messages_count(p_property_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COUNT(*) FROM messages WHERE ai_handled = true);
  ELSE
    RETURN (SELECT COUNT(*) FROM messages WHERE property_id = p_property_id AND ai_handled = true);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (FOR TESTING - REMOVE IN PRODUCTION)
-- =====================================================
-- Note: This assumes you have existing bookings and properties
-- Comment out or remove this section for production

-- Insert sample payments (adjust booking_id and property_id to match your data)
-- INSERT INTO payments (booking_id, property_id, guest_name, guest_email, amount, payment_type, status, payment_method, transaction_id)
-- VALUES
--   (
--     (SELECT id FROM bookings LIMIT 1),
--     (SELECT id FROM properties LIMIT 1),
--     'Sarah Johnson',
--     'sarah.j@email.com',
--     2125.00,
--     'Full Payment',
--     'completed',
--     'Credit Card',
--     'TXN001'
--   );

-- Insert sample messages
-- INSERT INTO messages (booking_id, property_id, sender_type, guest_name, guest_email, message_type, message_text, status, ai_handled, platform)
-- VALUES
--   (
--     (SELECT id FROM bookings LIMIT 1),
--     (SELECT id FROM properties LIMIT 1),
--     'guest',
--     'Emma Wilson',
--     'emma.w@email.com',
--     'text',
--     'Hi! I''d like to know if early check-in is possible for my reservation next week?',
--     'unread',
--     false,
--     'whatsapp'
--   );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON payments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

-- Grant permissions on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
