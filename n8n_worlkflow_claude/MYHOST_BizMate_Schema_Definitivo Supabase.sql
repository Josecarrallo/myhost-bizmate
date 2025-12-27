-- ============================================
-- MY HOST BizMate - ESQUEMA DEFINITIVO
-- Fecha: 23 Diciembre 2025
-- Versión: 1.0
-- ============================================
-- Este script contiene la estructura completa
-- de todas las tablas necesarias para los
-- workflows de IA del sistema.
-- ============================================

-- ============================================
-- TABLA: alerts
-- Propósito: Almacenar alertas generadas por
-- el sistema de recomendaciones (WF-IA-02)
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  alert_type text,                    -- low_occupancy, no_bookings, high_cancellations, pending_checkins
  severity text,                      -- low, medium, high, critical
  title text,
  description text,
  message text,                       -- Campo legacy, puede ser NULL
  status text DEFAULT 'open',         -- open, resolved, dismissed
  dismissed boolean DEFAULT false,
  related_type text,
  related_id uuid,
  property_id uuid,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para alerts
CREATE INDEX IF NOT EXISTS idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type);

-- ============================================
-- TABLA: ai_chat_history
-- Propósito: Almacenar historial de conversaciones
-- con el asistente IA (WF-IA-01)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  user_id uuid,
  message text,                       -- Pregunta del usuario
  answer text,                        -- Respuesta de Claude
  response text,                      -- Campo legacy
  suggested_actions jsonb,            -- Acciones sugeridas por la IA
  created_at timestamptz DEFAULT now()
);

-- Índices para ai_chat_history
CREATE INDEX IF NOT EXISTS idx_ai_chat_tenant ON ai_chat_history(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_user ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_created ON ai_chat_history(created_at DESC);

-- ============================================
-- TABLA: recommendation_logs
-- Propósito: Registrar ejecuciones del sistema
-- de recomendaciones y alertas (WF-IA-02)
-- ============================================
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  guest_id uuid,
  guest_name text,
  rule_triggered text,                -- Regla que generó la alerta
  alert_id uuid,                      -- Referencia a la alerta creada
  recommendations_count integer,
  data_snapshot jsonb,                -- Snapshot de datos al momento de ejecución
  email_sent boolean DEFAULT false,
  whatsapp_sent boolean DEFAULT false,
  status text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Índices para recommendation_logs
CREATE INDEX IF NOT EXISTS idx_recommendation_tenant ON recommendation_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_created ON recommendation_logs(created_at DESC);

-- ============================================
-- TABLA: workflow_logs
-- Propósito: Registrar ejecuciones de todos
-- los workflows para debugging y auditoría
-- ============================================
CREATE TABLE IF NOT EXISTS workflow_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  workflow_name text,                 -- Nombre del workflow ejecutado
  execution_status text,              -- success, error, success_no_alerts
  execution_data jsonb,               -- Datos de la ejecución
  status text,                        -- Campo legacy
  payload jsonb,
  result jsonb,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Índices para workflow_logs
CREATE INDEX IF NOT EXISTS idx_workflow_tenant ON workflow_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_workflow_name ON workflow_logs(workflow_name);
CREATE INDEX IF NOT EXISTS idx_workflow_created ON workflow_logs(created_at DESC);

-- ============================================
-- TABLA: audit_logs
-- Propósito: Auditoría general de acciones
-- en el sistema
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  action_type text,                   -- owner_ai_assistant, booking_created, etc.
  event text,                         -- Campo legacy
  payload_in jsonb,                   -- Datos de entrada
  payload_out jsonb,                  -- Datos de salida
  user_id uuid,
  entity_type text,
  entity_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);

-- ============================================
-- TABLA: ops_tasks
-- Propósito: Tareas operativas generadas por
-- el sistema o manualmente (WF-IA-03)
-- ============================================
CREATE TABLE IF NOT EXISTS ops_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  task_type text NOT NULL,            -- maintenance, cleaning, guest_request, etc.
  title text NOT NULL,
  description text,
  priority text DEFAULT 'medium',     -- low, medium, high, urgent
  status text DEFAULT 'open',         -- open, in_progress, completed, cancelled
  property_id uuid,
  booking_id uuid,
  assigned_to uuid,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para ops_tasks
CREATE INDEX IF NOT EXISTS idx_ops_tasks_tenant ON ops_tasks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_status ON ops_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_priority ON ops_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_ops_tasks_due ON ops_tasks(due_date);

-- ============================================
-- COMENTARIOS SOBRE TABLAS EXISTENTES
-- (No modificar, solo referencia)
-- ============================================
-- Las siguientes tablas ya existen y son
-- utilizadas por los workflows:
--
-- - properties: Propiedades/villas
-- - bookings: Reservaciones
-- - guests: Huéspedes
-- - payments: Pagos
-- - messages: Mensajes WhatsApp
-- - tenants: Organizaciones/propietarios
-- - users: Usuarios del sistema
-- ============================================

-- ============================================
-- SCRIPT DE VERIFICACIÓN
-- Ejecutar para confirmar que todo está OK
-- ============================================
/*
SELECT 
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'alerts', 
    'ai_chat_history', 
    'recommendation_logs', 
    'workflow_logs', 
    'audit_logs', 
    'ops_tasks'
  )
GROUP BY table_name
ORDER BY table_name;
*/

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
