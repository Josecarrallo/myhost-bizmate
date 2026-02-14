-- =====================================================
-- GUEST SEGMENTATION SCHEMA
-- MY HOST BizMate - Marketing & Growth Module
-- Phase 1: Guest Segmentation
-- =====================================================

-- Table: guest_tags
-- Stores tags assigned to guests (VIP, Repeat Guest, High Value, etc.)
CREATE TABLE IF NOT EXISTS public.guest_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL,
  tag_type TEXT NOT NULL CHECK (tag_type IN ('VIP', 'Repeat Guest', 'High Value', 'First Time', 'At Risk', 'Win Back', 'Loyal', 'Recent Booking', 'No Show')),
  tag_value TEXT, -- Optional additional value (e.g., "Spent $5000")
  auto_assigned BOOLEAN DEFAULT true, -- true if auto-assigned by system, false if manual
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guest_id, tag_type) -- Each guest can only have each tag type once
);

-- Table: guest_segments
-- Custom segments created by property owner
CREATE TABLE IF NOT EXISTS public.guest_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules JSONB NOT NULL, -- Segmentation rules (e.g., { "min_bookings": 3, "nationality": "USA" })
  guest_count INTEGER DEFAULT 0, -- Cached count of guests in segment
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: segment_guests (junction table)
-- Maps which guests belong to which segments
CREATE TABLE IF NOT EXISTS public.segment_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  segment_id UUID NOT NULL REFERENCES public.guest_segments(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(segment_id, guest_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_guest_tags_guest_id ON public.guest_tags(guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_tags_tag_type ON public.guest_tags(tag_type);
CREATE INDEX IF NOT EXISTS idx_guest_segments_tenant_id ON public.guest_segments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_segment_guests_segment_id ON public.segment_guests(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_guests_guest_id ON public.segment_guests(guest_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_tags TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_segments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.segment_guests TO anon, authenticated;

-- =====================================================
-- AUTO-TAGGING RULES (REFERENCE)
-- =====================================================
-- These rules are implemented in guestSegmentationService.js

-- VIP: total_spent > $2000 OR avg_rating >= 4.8
-- High Value: total_spent > $1000
-- Repeat Guest: total_bookings >= 2
-- Loyal: total_bookings >= 5
-- First Time: total_bookings = 0
-- Recent Booking: last booking within 90 days
-- At Risk: last booking 180-365 days ago
-- Win Back: last booking > 365 days ago
-- No Show: has booking with status 'no_show'

-- =====================================================
-- SAMPLE SEGMENTS (INSERT AFTER TENANT SETUP)
-- =====================================================
-- INSERT INTO public.guest_segments (tenant_id, name, description, rules) VALUES
-- ('tenant-uuid-here', 'High Spenders', 'Guests who spent over $1500', '{"min_spent": 1500}'),
-- ('tenant-uuid-here', 'USA Travelers', 'Guests from United States', '{"nationality": "USA"}'),
-- ('tenant-uuid-here', 'Frequent Visitors', 'Guests with 3+ bookings', '{"min_bookings": 3}');
