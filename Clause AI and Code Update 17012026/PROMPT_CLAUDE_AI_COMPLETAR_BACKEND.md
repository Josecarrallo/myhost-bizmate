# PROMPT PARA CLAUDE AI - COMPLETAR FUNCIONES BACKEND SUPABASE
## Para integración con Claude Code Frontend
## Fecha: 17 Enero 2026

---

# 🎯 OBJETIVO

Claude Code ha migrado el frontend a datos reales de Supabase. Necesitamos **arreglar/crear las funciones RPC restantes** que faltan o tienen errores.

---

# ⚠️ REGLAS CRÍTICAS (NO MODIFICAR)

1. **NO TOCAR TABLAS EXISTENTES** - Solo crear/modificar RPC functions
2. **NO HABILITAR RLS** - Mantener políticas actuales (RLS solo en algunas tablas)
3. **NO MODIFICAR CAMPOS ESCRITOS POR N8N** - Solo leer, nunca escribir desde RPC functions
4. **USAR `SECURITY DEFINER`** - Todas las funciones deben tener esto para funcionar con anon key
5. **MANEJAR CASOS NULL** - Usar COALESCE o retornar NULL cuando no hay datos

---

# 🔴 PROBLEMAS DETECTADOS (ARREGLAR YA)

## 1. ERROR: `get_active_alerts()` - Status 400

**Síntoma:** Error 400 al llamar a esta función desde frontend

**Causa posible:**
- La función no existe
- Retorna estructura incorrecta
- Tiene error de sintaxis

**Lo que necesita Claude Code:**
```typescript
// Debe retornar esto:
const { data } = await supabase.rpc('get_active_alerts');
// Returns: [
//   {
//     alert_id: UUID,
//     message: TEXT,
//     severity: TEXT,  // 'info' | 'warning' | 'error'
//     created_at: TIMESTAMPTZ,
//     related_type: TEXT,
//     related_id: UUID
//   }
// ]
```

**SQL esperado:**
```sql
CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  alert_id UUID,
  message TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ,
  related_type TEXT,
  related_id UUID
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    id as alert_id,
    title || ': ' || message as message,  -- Combinar título y mensaje
    severity,
    created_at,
    related_resource_type as related_type,
    related_resource_id as related_id
  FROM alerts
  WHERE is_read = false
    AND is_dismissed = false
    AND (expires_at IS NULL OR expires_at > NOW())
  ORDER BY
    CASE severity
      WHEN 'error' THEN 1
      WHEN 'warning' THEN 2
      ELSE 3
    END,
    created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

**ACCIÓN:** Crear o reemplazar esta función y verificar que funciona.

---

# 🟡 MEJORAS OPCIONALES (Si tienes tiempo)

## 2. Mejorar `get_banyu_stats()` - Agregar cálculo de response time

**Problema actual:** `avg_response_time_minutes` retorna siempre NULL

**Mejora sugerida:** Si existe alguna forma de calcular tiempo de respuesta basado en timestamps de mensajes inbound/outbound:

```sql
-- Si whatsapp_messages tiene created_at y delivered_at, calcular avg
-- Ejemplo conceptual (ajustar a tu schema real):
CREATE OR REPLACE FUNCTION get_banyu_stats(p_tenant_id UUID)
RETURNS TABLE (
  messages_today INTEGER,
  active_conversations INTEGER,
  avg_response_time_minutes NUMERIC
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE)::INTEGER as messages_today,
    COUNT(DISTINCT guest_contact_id) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours')::INTEGER as active_conversations,
    -- Calcular promedio de tiempo entre inbound y outbound (si es posible)
    ROUND(
      COALESCE(
        AVG(EXTRACT(EPOCH FROM (delivered_at - created_at)) / 60)
        FILTER (WHERE delivered_at IS NOT NULL AND created_at IS NOT NULL),
        NULL
      ),
      1
    ) as avg_response_time_minutes
  FROM whatsapp_messages
  WHERE (property_id IN (SELECT id FROM properties WHERE owner_id = p_tenant_id) OR p_tenant_id IS NULL);
END;
$$ LANGUAGE plpgsql;
```

**ACCIÓN OPCIONAL:** Solo si es posible con los datos actuales.

---

## 3. Mejorar `get_kora_stats()` - Agregar duration y sentiment

**Problema actual:** `avg_duration_seconds` y `positive_sentiment_pct` retornan NULL

**Mejora sugerida:** Si n8n escribe duration o sentiment en alguna tabla (leads, messages, etc.):

```sql
-- Buscar en leads con channel='vapi' si hay metadata con duration/sentiment
-- Ajustar según tu estructura real
CREATE OR REPLACE FUNCTION get_kora_stats(p_tenant_id UUID)
RETURNS TABLE (
  calls_today INTEGER,
  avg_duration_seconds INTEGER,
  positive_sentiment_pct NUMERIC
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND channel = 'vapi')::INTEGER as calls_today,
    -- Si standard_model o metadata tiene duration_seconds
    COALESCE(
      AVG((standard_model->>'duration_seconds')::INTEGER) FILTER (WHERE standard_model->>'duration_seconds' IS NOT NULL),
      NULL
    )::INTEGER as avg_duration_seconds,
    -- Si hay sentiment en metadata
    COALESCE(
      AVG(CASE
        WHEN (standard_model->>'sentiment') = 'positive' THEN 100
        WHEN (standard_model->>'sentiment') = 'neutral' THEN 50
        ELSE 0
      END) FILTER (WHERE standard_model->>'sentiment' IS NOT NULL),
      NULL
    ) as positive_sentiment_pct
  FROM leads
  WHERE (tenant_id = p_tenant_id OR p_tenant_id IS NULL)
    AND channel = 'vapi';
END;
$$ LANGUAGE plpgsql;
```

**ACCIÓN OPCIONAL:** Solo si los datos existen en alguna columna JSONB.

---

# 📋 FUNCIONES QUE YA FUNCIONAN (NO TOCAR)

Estas 4 funciones **YA ESTÁN CREADAS** por ti y funcionan correctamente:

✅ `get_lumina_stats(p_tenant_id UUID)` - FUNCIONA
✅ `get_banyu_stats(p_tenant_id UUID)` - FUNCIONA (aunque response_time es NULL)
✅ `get_kora_stats(p_tenant_id UUID)` - FUNCIONA (aunque duration y sentiment son NULL)
✅ `get_osiris_stats(p_tenant_id UUID)` - FUNCIONA

**NO las modifiques a menos que quieras agregar las mejoras opcionales de arriba.**

---

# 🧪 TESTING REQUERIDO

Después de crear/arreglar `get_active_alerts()`, ejecuta:

```sql
-- Test 1: Verificar que la función existe
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_active_alerts';

-- Test 2: Ejecutar la función
SELECT * FROM get_active_alerts();

-- Test 3: Verificar estructura del resultado
SELECT
  pg_typeof(alert_id) as alert_id_type,
  pg_typeof(message) as message_type,
  pg_typeof(severity) as severity_type,
  pg_typeof(created_at) as created_at_type
FROM get_active_alerts()
LIMIT 1;
```

**Resultado esperado:**
- alert_id_type: uuid
- message_type: text
- severity_type: text
- created_at_type: timestamp with time zone

---

# 📤 QUÉ NECESITO DE TI

**PRIORIDAD ALTA:**
1. ✅ Crear/arreglar `get_active_alerts()` - **URGENTE** (está fallando)
2. ✅ Ejecutar tests y confirmar que funciona
3. ✅ Darme el SQL completo de la función

**PRIORIDAD BAJA (opcional):**
1. Mejorar `get_banyu_stats()` si puedes calcular response time
2. Mejorar `get_kora_stats()` si tienes datos de duration/sentiment

**FORMATO DE RESPUESTA:**
Dame solo el SQL ejecutable, sin explicaciones largas. Ejemplo:

```sql
-- get_active_alerts() - Fixed
CREATE OR REPLACE FUNCTION get_active_alerts() ...

-- Test verification
SELECT * FROM get_active_alerts();
```

---

# 🔗 CONTEXTO ADICIONAL

**Tenant ID actual (Izumi Hotel):** `c24393db-d318-4d75-8bbf-0fa240b9c1db`

**Tablas relevantes:**
- `alerts` (id, title, message, severity, is_read, is_dismissed, expires_at, created_at, related_resource_type, related_resource_id)
- `whatsapp_messages` (id, created_at, delivered_at, read_at, guest_contact_id, property_id)
- `leads` (id, channel, standard_model JSONB, created_at, tenant_id)
- `workflow_settings` (id, is_active)

**Error exacto en frontend:**
```
jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_active_alerts:1
Failed to load resource: the server responded with a status of 400
```

---

**¿Listo? Dame el SQL de `get_active_alerts()` y cualquier mejora opcional que puedas hacer.** 🚀
