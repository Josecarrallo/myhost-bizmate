-- =====================================================
-- BASE TABLES - MY HOST BIZMATE
-- =====================================================
-- Created: 2025-12-20
-- Description: Core tables for properties and bookings
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: properties
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Info
  name TEXT NOT NULL,
  property_type TEXT CHECK (property_type IN ('Villa', 'Apartment', 'House', 'Studio', 'Resort', 'Hotel', 'Other')),

  -- Location
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Capacity
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,

  -- Pricing
  base_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,

  -- Amenities
  amenities JSONB DEFAULT '[]',

  -- Description
  description TEXT,
  house_rules TEXT,

  -- Images
  images JSONB DEFAULT '[]',
  main_image_url TEXT,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for properties
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);

-- =====================================================
-- TABLE: bookings
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  -- Guest Information
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_country TEXT,
  number_of_guests INTEGER DEFAULT 1,

  -- Booking Dates
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER GENERATED ALWAYS AS (check_out - check_in) STORED,

  -- Pricing
  total_price DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  service_fee DECIMAL(10, 2) DEFAULT 0,

  -- Booking Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'confirmed',
    'cancelled',
    'completed',
    'no-show'
  )),

  -- Payment Status
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN (
    'pending',
    'partial',
    'paid',
    'refunded'
  )),

  -- Booking Source
  source TEXT DEFAULT 'direct' CHECK (source IN (
    'direct',
    'airbnb',
    'booking.com',
    'vrbo',
    'expedia',
    'other'
  )),

  -- Special Requests
  special_requests TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Enable read access for all users" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for bookings
CREATE POLICY "Enable read access for authenticated users" ON bookings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert access for authenticated users" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update access for authenticated users" ON bookings
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

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check availability
CREATE OR REPLACE FUNCTION check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM bookings
    WHERE property_id = p_property_id
    AND status IN ('confirmed', 'pending')
    AND (
      (check_in <= p_check_in AND check_out > p_check_in) OR
      (check_in < p_check_out AND check_out >= p_check_out) OR
      (check_in >= p_check_in AND check_out <= p_check_out)
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate booking price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
  v_base_price DECIMAL;
  v_cleaning_fee DECIMAL;
  v_nights INTEGER;
  v_total DECIMAL;
BEGIN
  SELECT base_price, cleaning_fee
  INTO v_base_price, v_cleaning_fee
  FROM properties
  WHERE id = p_property_id;

  v_nights := p_check_out - p_check_in;
  v_total := (v_base_price * v_nights) + v_cleaning_fee;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA (FOR TESTING)
-- =====================================================

-- Insert sample properties
INSERT INTO properties (name, property_type, address, city, bedrooms, bathrooms, max_guests, base_price, description, status)
VALUES
  (
    'Izumi Hotel - Deluxe Suite',
    'Hotel',
    'Jl. Raya Ubud No. 88',
    'Ubud',
    2,
    2,
    4,
    250.00,
    'Luxury hotel suite in the heart of Ubud with stunning rice terrace views',
    'active'
  ),
  (
    'Villa Sunset Paradise',
    'Villa',
    'Jl. Pantai Seminyak',
    'Seminyak',
    3,
    3,
    6,
    425.00,
    'Beautiful beachfront villa with private pool and ocean views',
    'active'
  ),
  (
    'Beach House Deluxe',
    'House',
    'Jl. Pantai Canggu',
    'Canggu',
    4,
    3,
    8,
    520.00,
    'Spacious beach house perfect for families and groups',
    'active'
  ),
  (
    'City Loft Premium',
    'Apartment',
    'Jl. Sunset Road',
    'Kuta',
    1,
    1,
    2,
    180.00,
    'Modern loft apartment close to beach and nightlife',
    'active'
  ),
  (
    'Mountain Cabin Retreat',
    'House',
    'Jl. Raya Kintamani',
    'Kintamani',
    2,
    2,
    4,
    245.00,
    'Peaceful mountain retreat with volcano views',
    'active'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  check_in,
  check_out,
  number_of_guests,
  total_price,
  status,
  payment_status,
  source
)
SELECT
  p.id,
  'Sarah Johnson',
  'sarah.j@email.com',
  '+1-555-0101',
  '2025-10-25',
  '2025-10-30',
  2,
  1250.00,
  'confirmed',
  'paid',
  'direct'
FROM properties p
WHERE p.name = 'Izumi Hotel - Deluxe Suite'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  check_in,
  check_out,
  number_of_guests,
  total_price,
  status,
  payment_status,
  source
)
SELECT
  p.id,
  'Michael Chen',
  'mchen@email.com',
  '+1-555-0102',
  '2025-10-28',
  '2025-11-02',
  4,
  2600.00,
  'confirmed',
  'partial',
  'airbnb'
FROM properties p
WHERE p.name = 'Villa Sunset Paradise'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  check_in,
  check_out,
  number_of_guests,
  total_price,
  status,
  payment_status,
  source
)
SELECT
  p.id,
  'Emma Wilson',
  'emma.w@email.com',
  '+1-555-0103',
  '2025-10-24',
  '2025-10-27',
  2,
  1140.00,
  'confirmed',
  'paid',
  'booking.com'
FROM properties p
WHERE p.name = 'City Loft Premium'
LIMIT 1
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON properties TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
