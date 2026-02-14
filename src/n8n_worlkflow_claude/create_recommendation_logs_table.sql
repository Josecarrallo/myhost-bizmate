-- Tabla para guardar logs del Flujo B - Recomendaciones IA Diarias
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS recommendation_logs (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Guest information
  guest_id UUID,
  guest_name TEXT NOT NULL,

  -- Execution details
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  recommendations_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('success', 'error', 'partial')),

  -- Error tracking
  error_message TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_guest_id ON recommendation_logs(guest_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_sent_at ON recommendation_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_status ON recommendation_logs(status);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recommendation_logs_updated_at BEFORE UPDATE
    ON recommendation_logs FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE recommendation_logs IS 'Logs de ejecución del Flujo B - Recomendaciones IA Diarias';
COMMENT ON COLUMN recommendation_logs.guest_id IS 'ID del huésped (FK a bookings.id)';
COMMENT ON COLUMN recommendation_logs.sent_at IS 'Timestamp de cuando se enviaron las recomendaciones';
COMMENT ON COLUMN recommendation_logs.recommendations_count IS 'Número de recomendaciones generadas';
COMMENT ON COLUMN recommendation_logs.status IS 'Estado: success (todo OK), error (falló), partial (solo email o whatsapp)';
