-- Add location, property_type, and address columns to villas table
-- Run this in Supabase SQL Editor

ALTER TABLE villas
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'villas'
  AND column_name IN ('location', 'property_type', 'address')
ORDER BY column_name;
