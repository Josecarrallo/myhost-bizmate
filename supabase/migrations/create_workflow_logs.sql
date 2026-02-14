-- Create workflow_logs table for tracking n8n workflow executions
CREATE TABLE IF NOT EXISTS workflow_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error', 'pending')),
  payload JSONB,
  response JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_workflow_logs_created_at ON workflow_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_status ON workflow_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_workflow_name ON workflow_logs(workflow_name);

-- Enable RLS (Row Level Security)
ALTER TABLE workflow_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON workflow_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON workflow_logs TO anon;
GRANT ALL ON workflow_logs TO authenticated;
GRANT ALL ON workflow_logs TO service_role;
