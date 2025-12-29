-- ============================================================================
-- MARKETING & GROWTH MODULE - DATABASE SCHEMA
-- Created: 29 December 2025
-- Description: Tables for marketing campaigns, content planning, and reviews
-- ============================================================================

-- ============================================================================
-- 1. MARKETING CONNECTIONS (Meta, Google, TikTok, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- tenant_id UUID REFERENCES tenants(id), -- TODO: Add after multi-tenant
  provider TEXT NOT NULL CHECK (provider IN ('meta', 'google', 'tiktok')),
  status TEXT NOT NULL CHECK (status IN ('connected', 'disconnected', 'error')) DEFAULT 'disconnected',
  account_name TEXT,
  account_id TEXT,
  access_token_encrypted TEXT, -- Store encrypted tokens
  token_expires_at TIMESTAMPTZ,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. MARKETING CAMPAIGNS (Meta Ads, Google Ads, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- tenant_id UUID REFERENCES tenants(id), -- TODO: Add after multi-tenant
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  objective TEXT NOT NULL CHECK (objective IN ('leads', 'whatsapp_messages', 'website_visits', 'bookings')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')) DEFAULT 'draft',
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok')),
  daily_budget DECIMAL(10,2),
  total_spend_mtd DECIMAL(10,2) DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2), -- Click-through rate
  payload_json JSONB, -- Full campaign configuration
  external_campaign_id TEXT, -- ID from Meta/Google API
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. MARKETING POSTS (Content Planner - Instagram, Facebook, TikTok)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- tenant_id UUID REFERENCES tenants(id), -- TODO: Add after multi-tenant
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'all')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published', 'failed')) DEFAULT 'draft',
  caption TEXT,
  media_urls TEXT[], -- Array of image/video URLs
  hashtags TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT, -- ID from social platform
  engagement_stats JSONB, -- { likes, comments, shares, saves }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. MARKETING REVIEWS (Multi-platform reviews aggregation)
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketing_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- tenant_id UUID REFERENCES tenants(id), -- TODO: Add after multi-tenant
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('airbnb', 'booking', 'google', 'tripadvisor', 'manual')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  guest_name TEXT,
  stay_date DATE,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  response_text TEXT, -- Owner's response
  response_date TIMESTAMPTZ,
  external_review_id TEXT, -- ID from review platform
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_platform ON marketing_campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_property_id ON marketing_campaigns(property_id);

CREATE INDEX IF NOT EXISTS idx_marketing_posts_status ON marketing_posts(status);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_scheduled_at ON marketing_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_marketing_posts_property_id ON marketing_posts(property_id);

CREATE INDEX IF NOT EXISTS idx_marketing_reviews_source ON marketing_reviews(source);
CREATE INDEX IF NOT EXISTS idx_marketing_reviews_rating ON marketing_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_marketing_reviews_property_id ON marketing_reviews(property_id);

-- ============================================================================
-- ROW LEVEL SECURITY (Enable but don't add policies yet - wait for multi-tenant)
-- ============================================================================
ALTER TABLE marketing_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_reviews ENABLE ROW LEVEL SECURITY;

-- Temporary policy: Allow all for development (REMOVE in production)
CREATE POLICY "Allow all for development - marketing_connections" ON marketing_connections FOR ALL USING (true);
CREATE POLICY "Allow all for development - marketing_campaigns" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all for development - marketing_posts" ON marketing_posts FOR ALL USING (true);
CREATE POLICY "Allow all for development - marketing_reviews" ON marketing_reviews FOR ALL USING (true);

-- ============================================================================
-- SEED DATA (Mock data for demo)
-- ============================================================================

-- Mock marketing connection
INSERT INTO marketing_connections (provider, status, account_name) VALUES
('meta', 'disconnected', NULL);

-- Mock campaigns
INSERT INTO marketing_campaigns (name, objective, status, platform, daily_budget, total_spend_mtd, leads_count, impressions, clicks, ctr) VALUES
('Summer Villa Promotion', 'leads', 'active', 'meta', 50.00, 450.00, 23, 12500, 340, 2.72),
('Direct Booking Campaign', 'website_visits', 'active', 'meta', 30.00, 180.00, 12, 8200, 215, 2.62),
('WhatsApp Inquiry Boost', 'whatsapp_messages', 'paused', 'meta', 25.00, 125.00, 8, 5100, 142, 2.78),
('Test Campaign', 'bookings', 'draft', 'meta', 40.00, 0.00, 0, 0, 0, 0.00);

-- Mock posts
INSERT INTO marketing_posts (platform, status, caption, hashtags, scheduled_at) VALUES
('instagram', 'scheduled', 'Escape to paradise 🌴 Book your dream villa in Bali now!', ARRAY['#bali', '#villa', '#travel', '#vacation'], NOW() + INTERVAL '2 days'),
('facebook', 'published', 'Special offer: 20% off on stays longer than 7 nights 🎉', ARRAY['#travel', '#bali', '#discount'], NOW() - INTERVAL '3 days'),
('instagram', 'draft', 'Wake up to this view every morning ☀️', ARRAY['#bali', '#luxury', '#villa'], NULL);

-- Mock reviews
INSERT INTO marketing_reviews (source, rating, review_text, guest_name, stay_date, sentiment) VALUES
('airbnb', 5, 'Amazing villa! The host was super helpful and the location is perfect. Highly recommend!', 'John Smith', '2024-12-15', 'positive'),
('booking', 5, 'Best vacation ever! The villa exceeded our expectations. Will definitely come back.', 'Maria Garcia', '2024-12-10', 'positive'),
('google', 4, 'Great place, beautiful views. Only minor issue was the wifi speed.', 'David Chen', '2024-12-05', 'positive'),
('tripadvisor', 5, 'Absolutely stunning property. Worth every penny!', 'Emma Wilson', '2024-11-28', 'positive'),
('airbnb', 3, 'Nice villa but a bit far from the beach. Otherwise good.', 'Sophie Martin', '2024-11-20', 'neutral');

-- ============================================================================
-- NOTES
-- ============================================================================
-- TODO: Add tenant_id column when implementing multi-tenant
-- TODO: Add proper RLS policies scoped by tenant_id
-- TODO: Add triggers for updated_at timestamp
-- TODO: Encrypt access_token_encrypted field properly
-- ============================================================================
