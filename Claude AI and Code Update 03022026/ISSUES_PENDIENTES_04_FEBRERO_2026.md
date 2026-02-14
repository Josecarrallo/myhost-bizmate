# ISSUES PENDIENTES - 04 FEBRERO 2026 (ACTUALIZADO)

**Proyecto:** MY HOST BizMate
**Fecha actualización:** 04 Febrero 2026 - Mañana
**Estado actual:** RLS activado y funcionando ✅ | Multi-tenant operativo ✅

---

## ✅ ESTADO ACTUAL DEL SISTEMA (04 FEB 2026)

### Lo que funciona correctamente:
- ✅ Multi-tenant funcionando (Gita ve 41, Jose ve 166 bookings)
- ✅ RLS activo en tablas principales (bookings, payments, properties, users)
- ✅ Cliente Supabase refactorizado (usa JWT automáticamente)
- ✅ Todos los hardcoded UUIDs y contadores eliminados
- ✅ Login/logout funcionando correctamente

### Lo que NO funciona:
- ❌ OSIRIS AI Assistant (CORS + tablas RLS faltantes)
- ⚠️ Business Reports muestra 4 bookings menos (162-165 vs 166)
- ⚠️ Algunos warnings en consola (user data timeout, alerts 400)

---

## 🔴 ISSUE 1: OSIRIS AI Assistant - CORS Error (CRÍTICO)

### Síntoma:
```
Error calling OSIRIS: TypeError: Failed to fetch
Access to fetch at 'https://n8n-production-bb2d.up.railway.app/webhook/ai/chat'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

### Causa:
El webhook de n8n (OSIRIS) no tiene CORS configurado para permitir requests desde:
- `http://localhost:5174` (development)
- `https://my-host-bizmate.vercel.app` (production)

### Solución RÁPIDA (5 minutos):

**Opción A - Configurar CORS en n8n workflow (RECOMENDADO):**

1. Ir a n8n: https://n8n-production-bb2d.up.railway.app
2. Abrir workflow: **"WF-IA-01 - Owner AI Assistant - MYHOST Bizmate XIII"**
3. En el nodo **Webhook** al inicio del workflow:
   - Click en el nodo
   - En **"Response"** → **"Response Headers"**
   - Añadir estos headers:
     ```json
     {
       "Access-Control-Allow-Origin": "*",
       "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
       "Access-Control-Allow-Headers": "Content-Type, Authorization"
     }
     ```
4. Guardar y activar workflow

**Opción B - Proxy en Vite (alternativa temporal):**

Si no tienes acceso a n8n, puedo configurar un proxy en desarrollo:

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

Luego cambiar en el código:
```javascript
// Antes:
const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/ai/chat', {...});

// Después:
const response = await fetch('/api/osiris', {...});
```

### Prioridad: 🔴 ALTA (OSIRIS no funciona sin esto)
### Responsable: Claude Code (si Opción B) o Usuario (si Opción A en n8n)

---

## 🔴 ISSUE 2: RLS bloqueando funciones RPC de OSIRIS (CRÍTICO)

### Síntomas en consola:
```
Failed to load: 400 Bad Request
- /rest/v1/rpc/get_active_alerts
- /rest/v1/rpc/get_osiris_stats
- /rest/v1/rpc/get_daily_summary (404 - no existe)
- /rest/v1/autopilot_alerts?tenant_id=... (400)
```

### Causa:
Cuando activamos RLS ayer, bloqueó el acceso a:
1. Tabla `autopilot_alerts` (probablemente no existe o sin RLS policy)
2. Funciones RPC que OSIRIS necesita (sin SECURITY DEFINER)

### Solución para Claude AI:

#### PASO 1: Verificar qué existe actualmente

```sql
-- 1A. Verificar si tabla autopilot_alerts existe
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'autopilot_alerts';

-- 1B. Verificar funciones RPC existentes
SELECT proname, proargtypes
FROM pg_proc
WHERE proname IN ('get_active_alerts', 'get_osiris_stats', 'get_daily_summary');

-- 1C. Si la tabla existe, verificar RLS
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'autopilot_alerts';
```

#### PASO 2: Crear tabla autopilot_alerts (si no existe)

```sql
CREATE TABLE IF NOT EXISTS autopilot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'payment', 'maintenance', 'review', 'message', 'system')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'dismissed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_autopilot_alerts_tenant_id ON autopilot_alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_autopilot_alerts_status ON autopilot_alerts(status);
CREATE INDEX IF NOT EXISTS idx_autopilot_alerts_created_at ON autopilot_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_autopilot_alerts_property_id ON autopilot_alerts(property_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_autopilot_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_autopilot_alerts_updated_at
BEFORE UPDATE ON autopilot_alerts
FOR EACH ROW
EXECUTE FUNCTION update_autopilot_alerts_updated_at();
```

#### PASO 3: Configurar RLS en autopilot_alerts

```sql
-- Habilitar RLS
ALTER TABLE autopilot_alerts ENABLE ROW LEVEL SECURITY;

-- Política SELECT: Ver solo tus alertas
CREATE POLICY "Users can view their own alerts"
ON autopilot_alerts FOR SELECT
USING (tenant_id = auth.uid());

-- Política INSERT: Crear solo tus alertas
CREATE POLICY "Users can create their own alerts"
ON autopilot_alerts FOR INSERT
WITH CHECK (tenant_id = auth.uid());

-- Política UPDATE: Actualizar solo tus alertas
CREATE POLICY "Users can update their own alerts"
ON autopilot_alerts FOR UPDATE
USING (tenant_id = auth.uid())
WITH CHECK (tenant_id = auth.uid());

-- Política DELETE: Eliminar solo tus alertas
CREATE POLICY "Users can delete their own alerts"
ON autopilot_alerts FOR DELETE
USING (tenant_id = auth.uid());
```

#### PASO 4: Crear funciones RPC con SECURITY DEFINER

```sql
-- Función 1: get_active_alerts
CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  id UUID,
  type TEXT,
  severity TEXT,
  title TEXT,
  description TEXT,
  property_id UUID,
  action_url TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar que el usuario esté autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT
    a.id,
    a.type,
    a.severity,
    a.title,
    a.description,
    a.property_id,
    a.action_url,
    a.created_at
  FROM autopilot_alerts a
  WHERE a.tenant_id = auth.uid()
    AND a.status = 'active'
  ORDER BY
    CASE a.severity
      WHEN 'critical' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END,
    a.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Función 2: get_osiris_stats
CREATE OR REPLACE FUNCTION get_osiris_stats()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  user_id UUID;
BEGIN
  -- Obtener user_id
  user_id := auth.uid();

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Calcular stats
  SELECT json_build_object(
    'total_conversations', COALESCE(COUNT(DISTINCT conversation_id), 0),
    'total_messages', COALESCE(COUNT(*), 0),
    'ai_handled', COALESCE(COUNT(CASE WHEN ai_handled = true THEN 1 END), 0),
    'avg_response_time_seconds', COALESCE(
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))),
      0
    ),
    'unread_messages', COALESCE(
      COUNT(CASE WHEN status = 'unread' THEN 1 END),
      0
    )
  )
  INTO result
  FROM messages
  WHERE tenant_id = user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Función 3: get_daily_summary
CREATE OR REPLACE FUNCTION get_daily_summary()
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  user_id UUID;
BEGIN
  user_id := auth.uid();

  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT json_build_object(
    'bookings_today', (
      SELECT COALESCE(COUNT(*), 0)
      FROM bookings
      WHERE tenant_id = user_id
        AND DATE(created_at) = CURRENT_DATE
    ),
    'revenue_today', (
      SELECT COALESCE(SUM(total_price), 0)
      FROM bookings
      WHERE tenant_id = user_id
        AND DATE(check_in) = CURRENT_DATE
        AND status IN ('confirmed', 'checked_in', 'checked_out')
    ),
    'alerts_active', (
      SELECT COALESCE(COUNT(*), 0)
      FROM autopilot_alerts
      WHERE tenant_id = user_id
        AND status = 'active'
    ),
    'messages_unread', (
      SELECT COALESCE(COUNT(*), 0)
      FROM messages
      WHERE tenant_id = user_id
        AND status = 'unread'
    ),
    'payments_pending', (
      SELECT COALESCE(COUNT(*), 0)
      FROM payments
      WHERE tenant_id = user_id
        AND status = 'pending'
    )
  )
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### PASO 5: Verificar que funciona

```sql
-- Test 1: Probar get_active_alerts (debe devolver array vacío si no hay alertas)
SELECT * FROM get_active_alerts();

-- Test 2: Probar get_osiris_stats
SELECT get_osiris_stats();

-- Test 3: Probar get_daily_summary
SELECT get_daily_summary();

-- Test 4: Insertar una alerta de prueba
INSERT INTO autopilot_alerts (tenant_id, type, severity, title, description)
VALUES (
  auth.uid(),
  'system',
  'low',
  'Test Alert',
  'This is a test alert for OSIRIS'
);

-- Test 5: Verificar que aparece
SELECT * FROM get_active_alerts();
```

### Prioridad: 🔴 ALTA (Bloquea OSIRIS completamente)
### Responsable: Claude AI
### Tiempo estimado: 10-15 minutos

---

## 🟡 ISSUE 3: Business Reports - Discrepancia de 4 bookings

### Síntoma:
- Contador general (All The Information, Manual Data Entry): **166 bookings**
- Business Reports (dinámico y estático): **162-165 bookings**
- **Diferencia:** 4 bookings no aparecen en reportes

### Investigación para Claude AI:

```sql
-- Query 1: Identificar bookings sin fechas
SELECT
  id,
  guest_name,
  check_in,
  check_out,
  status,
  created_at,
  property_id
FROM bookings
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db'  -- Jose's UUID
  AND (check_in IS NULL OR check_out IS NULL);

-- Query 2: Comparar conteo total vs conteo con fechas
SELECT
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN check_in IS NOT NULL AND check_out IS NOT NULL THEN 1 END) as bookings_with_dates,
  COUNT(CASE WHEN check_in IS NULL OR check_out IS NULL THEN 1 END) as bookings_without_dates
FROM bookings
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

-- Query 3: Ver todos los bookings del periodo de Business Reports
SELECT
  id,
  guest_name,
  check_in,
  check_out,
  status,
  total_price
FROM bookings
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
  AND check_in >= '2025-01-01'
  AND check_in <= '2026-12-31'
ORDER BY check_in DESC;
```

### Solución esperada:
1. Claude AI identifica los 4 bookings problemáticos
2. Si son bookings sin fechas (check_in/check_out NULL):
   - Opción A: Asignarles fechas válidas si son datos reales
   - Opción B: Eliminarlos si son datos de prueba
3. Si son bookings con fechas fuera de rango:
   - Ajustar filtro en Business Reports para incluirlos
4. Verificar que después coincidan los números: **166 = 166**

### Prioridad: 🟡 MEDIA (No crítico pero inconsistente)
### Responsable: Claude AI (investigación) + Claude Code (ajuste de query si necesario)

---

## 🟢 ISSUE 4: AuthContext - User data fetch timeout (NO CRÍTICO)

### Síntoma:
```
Error fetching user data (skipping): User data fetch timeout
```

### Contexto:
- Esto es un **warning**, no un error crítico
- El sistema tiene fallback: si no carga userData en 3 segundos, continúa sin él
- No bloquea el login ni el funcionamiento del sistema
- Aparece ocasionalmente, no siempre

### Causa probable:
1. Supabase lento en responder (latencia)
2. Query a tabla `users` sin índice optimizado
3. Timeout muy corto (3 segundos puede ser poco)

### Solución para Claude AI (opcional, baja prioridad):

```sql
-- 1. Verificar índice en users.id
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users'
  AND schemaname = 'public';

-- 2. Crear índice si falta (debería existir por ser PK, pero verificar)
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- 3. Verificar políticas RLS en users (pueden estar ralentizando)
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'users';

-- 4. Si las políticas son complejas, simplificarlas
-- Ejemplo de política simple:
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
ON users FOR SELECT
USING (id = auth.uid());
```

### Alternativa en código (para Claude Code):
Aumentar timeout de 3s a 5s:

```javascript
// src/contexts/AuthContext.jsx - línea ~35
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Session check timeout')), 5000)  // 3000 → 5000
);
```

### Prioridad: 🟢 BAJA (Funciona con fallback)
### Responsable: Claude AI (optimización DB) o Claude Code (aumentar timeout)

---

## 📋 RESUMEN DE PRIORIDADES

### 🔴 CRÍTICO (resolver HOY):
1. **ISSUE 1:** OSIRIS CORS - Sin esto OSIRIS no funciona en absoluto
2. **ISSUE 2:** OSIRIS RLS - Sin esto las queries de OSIRIS fallan

### 🟡 IMPORTANTE (resolver esta semana):
3. **ISSUE 3:** Business Reports discrepancy - Inconsistencia de datos
4. Limpieza de base de datos (ver PROMPT_LIMPIEZA_BASE_DATOS_CLAUDE_AI.md)

### 🟢 OPCIONAL (mejorar en futuro):
5. **ISSUE 4:** AuthContext timeout - No bloquea funcionalidad
6. Añadir más índices para optimizar performance general

---

## 🔧 PLAN DE ACCIÓN (HOY 04 FEB 2026)

### Fase 1: OSIRIS (30 minutos)

**Claude AI:**
1. Ejecutar queries de verificación (PASO 1 del ISSUE 2)
2. Crear tabla `autopilot_alerts` si no existe (PASO 2)
3. Configurar RLS en `autopilot_alerts` (PASO 3)
4. Crear funciones RPC (get_active_alerts, get_osiris_stats, get_daily_summary) (PASO 4)
5. Ejecutar tests de verificación (PASO 5)
6. Reportar resultado

**Usuario o Claude Code:**
- Configurar CORS en n8n (ISSUE 1, Opción A)
- O configurar proxy en Vite (ISSUE 1, Opción B)

### Fase 2: Business Reports (15 minutos)

**Claude AI:**
1. Ejecutar queries de investigación (ISSUE 3)
2. Identificar los 4 bookings problemáticos
3. Proponer solución (eliminar/corregir/ajustar filtro)
4. Aplicar solución
5. Verificar que números coincidan (166 = 166)

### Fase 3: Testing (15 minutos)

**Claude Code + Usuario:**
1. Probar OSIRIS con ambos usuarios (Gita y Jose)
2. Verificar que Business Reports muestre 166 bookings
3. Confirmar que RLS sigue funcionando correctamente
4. Probar otras secciones (Payments, Messages, etc.)

---

## ✅ CHECKLIST FINAL

- [ ] **ISSUE 1:** CORS configurado (OSIRIS accesible desde frontend)
- [ ] **ISSUE 2:** Tabla autopilot_alerts creada con RLS
- [ ] **ISSUE 2:** Funciones RPC creadas y funcionando
- [ ] **ISSUE 2:** OSIRIS responde sin errores 400/404
- [ ] **ISSUE 3:** Identificados 4 bookings problemáticos
- [ ] **ISSUE 3:** Business Reports muestra 166 bookings (igual que contador)
- [ ] Testing completo: Login Gita → 41 bookings ✅
- [ ] Testing completo: Login Jose → 166 bookings ✅
- [ ] Testing completo: OSIRIS responde correctamente ✅
- [ ] Commit y push de cambios realizados

---

**Última actualización:** 04 Febrero 2026 - 09:00
**Estado:** Actualizado y listo para ejecución
**Prioridad máxima:** ISSUE 1 + ISSUE 2 (OSIRIS)
