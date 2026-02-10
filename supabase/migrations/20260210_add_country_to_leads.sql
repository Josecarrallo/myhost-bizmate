-- Add country column to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS country TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_leads_country ON leads(country);

-- Add comment
COMMENT ON COLUMN leads.country IS 'Country of origin for the lead/customer';
