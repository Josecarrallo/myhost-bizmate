-- Migration: 013_workflows_tables.sql
-- Purpose: Create tables for Workflows & Automations module
-- Date: December 30, 2025

-- Table 1: workflow_settings
-- Stores user configuration for each workflow (active/inactive, settings, etc.)
CREATE TABLE IF NOT EXISTS workflow_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  workflow_key VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMP,
  execution_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, workflow_key)
);

-- Table 2: workflow_executions
-- Logs all workflow executions (manual, automatic, scheduled)
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  workflow_key VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'pending'
  trigger_type VARCHAR(20) NOT NULL, -- 'manual', 'automatic', 'scheduled'
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_settings_property ON workflow_settings(property_id);
CREATE INDEX IF NOT EXISTS idx_workflow_settings_key ON workflow_settings(workflow_key);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_property ON workflow_executions(property_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_executed ON workflow_executions(executed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);

-- Insert default workflows for Izumi Hotel (for testing)
INSERT INTO workflow_settings (property_id, workflow_key, is_active, execution_count)
VALUES
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'whatsapp_concierge', true, 145),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'voice_receptionist', true, 89),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'booking_confirmation', true, 114),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'daily_recommendations', false, 0)
ON CONFLICT (property_id, workflow_key) DO NOTHING;

-- Insert some mock execution history
INSERT INTO workflow_executions (property_id, workflow_key, status, trigger_type, input_data, output_data, executed_at)
VALUES
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'booking_confirmation', 'success', 'automatic', '{"booking_id": "123"}', '{"email_sent": true, "whatsapp_sent": true}', NOW() - INTERVAL '2 minutes'),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'whatsapp_concierge', 'success', 'automatic', '{"message": "What time is breakfast?"}', '{"reply_sent": true}', NOW() - INTERVAL '5 minutes'),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'voice_receptionist', 'success', 'automatic', '{"caller": "+1234567890"}', '{"call_handled": true, "booking_created": true}', NOW() - INTERVAL '1 hour'),
  ('18711359-1378-4d12-9ea6-fb31c0b1bac2', 'sync_availability', 'error', 'manual', '{}', NULL, NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE workflow_settings IS 'Configuration and state for each workflow per property';
COMMENT ON TABLE workflow_executions IS 'Execution history log for all workflows';
COMMENT ON COLUMN workflow_settings.workflow_key IS 'Unique identifier for the workflow (e.g., whatsapp_concierge)';
COMMENT ON COLUMN workflow_settings.is_active IS 'Whether the workflow is currently active/enabled';
COMMENT ON COLUMN workflow_executions.trigger_type IS 'How the workflow was triggered: manual, automatic, or scheduled';
