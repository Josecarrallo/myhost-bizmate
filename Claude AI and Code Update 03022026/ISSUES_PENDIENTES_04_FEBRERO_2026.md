# ISSUES PENDIENTES - 04 FEBRERO 2026

**Proyecto:** MY HOST BizMate
**Prioridad:** Para resolver mañana 04 Febrero 2026

---

## 🔴 ISSUE 1: OSIRIS AI Assistant - CORS Error

**Síntoma:**
```
Error calling OSIRIS: TypeError: Failed to fetch
Access to fetch at 'https://n8n-production-bb2d.up.railway.app/webhook/ai/chat'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

**Causa:**
Webhook de n8n no tiene CORS configurado para permitir requests desde localhost:5174

**Solución (para n8n):**
1. Ir al workflow de n8n: "WF-IA-01 - Owner AI Assistant"
2. En el nodo Webhook, configurar:
   - **Response Headers:**
     ```
     Access-Control-Allow-Origin: *
     Access-Control-Allow-Methods: GET, POST, OPTIONS
     Access-Control-Allow-Headers: Content-Type
     ```
3. O añadir un nodo "Set" después del webhook con estos headers

**Alternativa temporal:**
Usar proxy en Vite para development:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api/osiris': {
        target: 'https://n8n-production-bb2d.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/osiris/, '/webhook/ai/chat')
      }
    }
  }
})
```

**Prioridad:** Alta
**Responsable:** Claude Code (config Vite) o ajustar n8n workflow

---

## 🔴 ISSUE 2: RLS bloqueando funciones RPC de OSIRIS

**Síntomas:**
```
Failed to load: 400 Bad Request
- /rest/v1/rpc/get_active_alerts
- /rest/v1/rpc/get_osiris_stats
- /rest/v1/autopilot_alerts?tenant_id=...
```

**Causa:**
RLS activado en tablas `autopilot_alerts` y funciones RPC sin permisos correctos.

**Solución (para Claude AI):**

### A. Verificar si la tabla existe:
```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'autopilot_alerts';
```

### B. Si NO existe, crear tabla:
```sql
CREATE TABLE autopilot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  type TEXT NOT NULL,  -- 'booking', 'payment', 'maintenance', etc.
  severity TEXT NOT NULL,  -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',  -- 'active', 'resolved', 'dismissed'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_autopilot_alerts_tenant_id ON autopilot_alerts(tenant_id);
CREATE INDEX idx_autopilot_alerts_status ON autopilot_alerts(status);

-- RLS
ALTER TABLE autopilot_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts"
ON autopilot_alerts FOR SELECT
USING (tenant_id = auth.uid());

CREATE POLICY "Users can create their own alerts"
ON autopilot_alerts FOR INSERT
WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users can update their own alerts"
ON autopilot_alerts FOR UPDATE
USING (tenant_id = auth.uid())
WITH CHECK (tenant_id = auth.uid());
```

### C. Verificar funciones RPC:
```sql
-- Verificar si existen
SELECT proname FROM pg_proc
WHERE proname IN ('get_active_alerts', 'get_osiris_stats', 'get_daily_summary');
```

### D. Si NO existen, crear funciones:

```sql
-- Función: get_active_alerts
CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  id UUID,
  type TEXT,
  severity TEXT,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.type,
    a.severity,
    a.title,
    a.description,
    a.created_at
  FROM autopilot_alerts a
  WHERE a.tenant_id = auth.uid()
    AND a.status = 'active'
  ORDER BY a.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Función: get_osiris_stats
CREATE OR REPLACE FUNCTION get_osiris_stats()
RETURNS JSON
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_conversations', COUNT(DISTINCT conversation_id),
    'total_messages', COUNT(*),
    'ai_handled', COUNT(CASE WHEN ai_handled = true THEN 1 END),
    'avg_response_time', AVG(EXTRACT(EPOCH FROM (updated_at - created_at)))
  )
  INTO result
  FROM messages
  WHERE tenant_id = auth.uid();

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función: get_daily_summary (si se necesita)
CREATE OR REPLACE FUNCTION get_daily_summary()
RETURNS JSON
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'bookings_today', (
      SELECT COUNT(*) FROM bookings
      WHERE tenant_id = auth.uid()
        AND DATE(created_at) = CURRENT_DATE
    ),
    'revenue_today', (
      SELECT COALESCE(SUM(total_price), 0) FROM bookings
      WHERE tenant_id = auth.uid()
        AND DATE(check_in) = CURRENT_DATE
    ),
    'alerts_active', (
      SELECT COUNT(*) FROM autopilot_alerts
      WHERE tenant_id = auth.uid()
        AND status = 'active'
    )
  )
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

**Prioridad:** Alta
**Responsable:** Claude AI

---

## 🟡 ISSUE 3: Business Reports - Discrepancia de conteo

**Síntoma:**
- Contador general: **166 bookings**
- Business Reports: **162-165 bookings**
- Diferencia: **4 bookings**

**Investigación requerida:**
```sql
-- Identificar los 4 bookings faltantes
SELECT id, guest_name, check_in, check_out, status, tenant_id
FROM bookings
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
  AND (check_in IS NULL OR check_out IS NULL);
```

**Solución esperada:**
- Identificar causa de la diferencia
- Ajustar query en `getOwnerBusinessReportData()` para incluir todos los bookings
- O filtrar bookings sin fechas del contador general

**Prioridad:** Media
**Responsable:** Claude Code

---

## 🟡 ISSUE 4: AuthContext - User data fetch timeout

**Síntoma:**
```
Error fetching user data (skipping): User data fetch timeout
```

**Causa:**
Timeout de 3 segundos al cargar datos del usuario desde tabla `users`.

**Posibles causas:**
1. Query lenta por falta de índice
2. RLS política compleja
3. Supabase lento

**Solución:**
```sql
-- Añadir índice si no existe
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- Verificar políticas RLS en users
SELECT * FROM pg_policies WHERE tablename = 'users';
```

**Prioridad:** Baja (no crítico, usa fallback)
**Responsable:** Claude AI

---

## 📋 CHECKLIST DE RESOLUCIÓN (MAÑANA)

### Alta Prioridad (Bloqueante):
- [ ] **ISSUE 1:** Configurar CORS en n8n webhook o proxy en Vite
- [ ] **ISSUE 2:** Crear tabla `autopilot_alerts` y funciones RPC

### Media Prioridad:
- [ ] **ISSUE 3:** Resolver discrepancia Business Reports (166 vs 162-165)
- [ ] Limpieza de base de datos (ver PROMPT_LIMPIEZA_BASE_DATOS_CLAUDE_AI.md)

### Baja Prioridad:
- [ ] **ISSUE 4:** Optimizar AuthContext user data fetch
- [ ] Añadir índices adicionales para performance

---

## 🔧 DIVISIÓN DE TRABAJO

**Claude Code:**
- ISSUE 1 (CORS - configurar proxy Vite)
- ISSUE 3 (Business Reports discrepancy)

**Claude AI:**
- ISSUE 2 (Crear tabla autopilot_alerts + funciones RPC)
- ISSUE 4 (Optimizar índices y RLS en users)
- Limpieza general de base de datos

---

**Última actualización:** 03 Febrero 2026 - 21:00
**Estado:** Documentado, listo para resolver mañana
