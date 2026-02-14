# ⚠️ ANÁLISIS DE IMPACTO - Implementación RLS Estricto
## MY HOST BizMate - 20 Enero 2026

---

## 📋 RESUMEN EJECUTIVO

**Tu preocupación es VÁLIDA y CRÍTICA.** Implementar Row Level Security (RLS) estricto en Supabase **SÍ puede romper** sistemas actuales si no se hace correctamente.

Este documento analiza:
- ✅ Qué sistemas se verán afectados
- ⚠️ Qué puede romperse
- 🔧 Cómo migrar sin romper nada
- 📝 Plan de implementación seguro

---

## 🎯 ESTADO ACTUAL (Sin RLS Estricto)

### Arquitectura Actual

```
┌──────────────────────────────────────────────────────────┐
│                    SISTEMA ACTUAL                         │
└──────────────────────────────────────────────────────────┘

Frontend (React)
│
├─── Queries con ANON KEY (público)
│    └─ NO tiene tenant_id injection automático
│    └─ Debe incluir WHERE tenant_id = 'xxx' manualmente
│
├─── n8n Workflows (21 flujos planificados)
│    └─ Usa SERVICE ROLE KEY (bypasea RLS)
│    └─ Queries directas a todas las tablas
│    └─ NO valida tenant_id automáticamente
│
├─── VAPI Webhooks → n8n → Supabase
│    └─ Crea bookings desde voz
│    └─ tenant_id se inyecta manualmente en payload
│
└─── Supabase Triggers → n8n Webhooks
     └─ on_booking_insert, on_payment_confirm, etc.
     └─ Envía datos completos a n8n
```

---

## ⚠️ SISTEMAS AFECTADOS POR RLS

### 1. **n8n Workflows** (CRÍTICO - 21 FLUJOS)

#### Flujos ACTUALMENTE funcionando:
- ✅ KORA Post-Call (VAPI → n8n → Supabase bookings)
- ✅ New Property Notification (Supabase trigger → n8n)

#### Flujos PLANIFICADOS (del documento):
1. Reserva nueva → Email/WhatsApp
2. Confirmación pago → Actualizar
3. Email/WhatsApp Bienvenida 24h antes
4. Agente IA Responde Consultas
5. IA Redacta Mensajes por Evento
6. Mensajes VIP
7. Generar enlace pago
8. Dashboards tiempo real
9. Planes estancia IA
10. Actualizar disponibilidad
11. Seguimiento pagos
12. Coordinación limpieza
13. Check-in/Check-out
14. Monitoreo comentarios
15. CRM automático
16. Upsell automático
17. Reportes ocupación
18. Comunicación staff
19. **⭐ Recomendaciones IA diarias** (ESTRELLA)
20. Videos social networks

**IMPACTO SI ACTIVAMOS RLS HOY:**

```javascript
// ❌ ANTES (funcionaba)
await supabase
  .from('bookings')
  .select('*')
  .eq('check_in', tomorrow);

// ✅ DESPUÉS (necesita tenant context)
await supabase
  .rpc('set_tenant', { tenant_id: 'xxx' })
  .from('bookings')
  .select('*')
  .eq('check_in', tomorrow);

// O usar Service Role Key que bypasea RLS
```

---

### 2. **Frontend (React)** (MEDIO RIESGO)

#### Archivos Afectados:

**`src/services/data.js` (803 líneas)**
- ❌ 14 funciones con queries sin tenant context
- ⚠️ Todas las queries fallarían con RLS estricto

**Ejemplo actual:**
```javascript
// src/services/data.js línea 120
async getBookings(filters = {}, tenantId = DEFAULT_TENANT) {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      properties (id, name, location),
      guest_contacts (id, name, email, phone)
    `)
    .eq('tenant_id', tenantId)  // ← Filtro MANUAL
    .order('check_in', { ascending: false });

  return data;
}
```

**Con RLS estricto, necesitaría:**
```javascript
async getBookings(filters = {}, tenantId = DEFAULT_TENANT) {
  // OPCIÓN A: Service Role Key (n8n actual)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // OPCIÓN B: Tenant context injection (más seguro)
  await supabase.rpc('set_config', {
    parameter: 'app.current_tenant',
    value: tenantId
  });

  let query = supabase
    .from('bookings')
    .select(`...`);
  // Ya NO necesita .eq('tenant_id', tenantId)
  // RLS lo hace automáticamente
}
```

---

### 3. **VAPI → n8n → Supabase** (BAJO RIESGO)

#### Flujo actual:
```
Usuario habla por voz
    ↓
VAPI captura datos
    ↓
VoiceAssistant.jsx envía a n8n webhook
    ↓
n8n workflow "KORA Post-Call"
    ↓
n8n crea booking en Supabase
    └─ Usa SERVICE ROLE KEY
    └─ Incluye tenant_id en INSERT
```

**¿Se rompe con RLS?**
- ✅ **NO** - Porque n8n usa SERVICE_ROLE_KEY
- ✅ SERVICE_ROLE_KEY bypasea RLS por diseño
- ✅ Solo necesita asegurar que tenant_id esté en el INSERT

---

### 4. **Supabase Triggers → n8n** (BAJO RIESGO)

#### Triggers existentes:
```sql
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n-production-bb2d.up.railway.app/webhook/booking-created',
    body := jsonb_build_object(
      'booking_id', NEW.id,
      'property_id', NEW.property_id,
      'guest_name', NEW.guest_name,
      -- ...
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- ← BYPASEA RLS
```

**¿Se rompe con RLS?**
- ✅ **NO** - `SECURITY DEFINER` ejecuta con permisos del creador
- ✅ Triggers se ejecutan con privilegios elevados
- ✅ Webhooks seguirán funcionando

---

## 🔴 PUNTOS DE RUPTURA IDENTIFICADOS

### CRÍTICO - Se romperá INMEDIATAMENTE:

#### 1. **Frontend Queries (14 funciones en data.js)**
```javascript
// src/services/data.js
- getBookings()           // ❌ Fallará
- getProperties()         // ❌ Fallará
- getGuestContacts()      // ❌ Fallará
- getPayments()           // ❌ Fallará
- getMessages()           // ❌ Fallará
- getMonthlyAnalytics()   // ❌ Fallará
- getPricingData()        // ❌ Fallará
- getMultichannelData()   // ❌ Fallará
- getMultichannelStats()  // ❌ Fallará
// ... y 5 más
```

**Síntoma:**
```
Error: new row violates row-level security policy for table "bookings"
```

#### 2. **n8n Workflows futuros (si usan ANON KEY)**
```javascript
// ❌ Si n8n usa ANON KEY (no recomendado)
Supabase Node
  Connection: ANON KEY
  Query: SELECT * FROM bookings
  // FALLARÁ con RLS

// ✅ Si n8n usa SERVICE_ROLE_KEY (actual)
Supabase Node
  Connection: SERVICE_ROLE_KEY
  Query: SELECT * FROM bookings WHERE tenant_id = 'xxx'
  // FUNCIONARÁ (bypasea RLS)
```

---

### MEDIO RIESGO - Puede fallar en edge cases:

#### 3. **Joins entre tablas**
```sql
-- Si bookings tiene RLS pero properties NO
SELECT b.*, p.name
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.check_in = '2025-01-21'

-- RLS puede bloquear el join
```

#### 4. **Inserts desde frontend**
```javascript
// Crear nueva propiedad desde UI
await supabase
  .from('properties')
  .insert({
    name: 'Villa Nueva',
    location: 'Ubud',
    // ❌ tenant_id falta - INSERT fallará
  });

// Con RLS necesita:
await supabase
  .from('properties')
  .insert({
    name: 'Villa Nueva',
    location: 'Ubud',
    tenant_id: currentUser.tenant_id  // ✅ Automático con RLS
  });
```

---

## 🔧 SOLUCIÓN: Migración sin Ruptura

### ESTRATEGIA RECOMENDADA: 3 FASES

```
FASE 1: PREPARACIÓN (1-2 días)
  └─ Auditar queries actuales
  └─ Identificar puntos de ruptura
  └─ Crear tests de regresión

FASE 2: IMPLEMENTACIÓN GRADUAL (2-3 días)
  └─ Activar RLS tabla por tabla
  └─ Migrar frontend progresivamente
  └─ Verificar n8n workflows

FASE 3: VALIDACIÓN (1 día)
  └─ Testing exhaustivo
  └─ Rollback plan listo
  └─ Monitoring activo
```

---

### FASE 1: PREPARACIÓN

#### 1.1 Auditar Estado Actual de RLS

```sql
-- Ver qué tablas TIENEN RLS habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = TRUE;

-- Ver políticas RLS existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Resultado esperado:
-- (vacío o solo algunas tablas)
```

#### 1.2 Inventario de Queries

**Archivo de tracking:**
```javascript
// queries-inventory.js
export const QUERIES_TO_MIGRATE = {
  'data.js': {
    getBookings: {
      table: 'bookings',
      hasJoins: true,
      risk: 'HIGH',
      migration: 'REQUIRED'
    },
    getProperties: {
      table: 'properties',
      hasJoins: false,
      risk: 'MEDIUM',
      migration: 'REQUIRED'
    },
    // ... resto
  },
  'supabase.js': {
    createProperty: {
      table: 'properties',
      operation: 'INSERT',
      risk: 'HIGH',
      migration: 'REQUIRED'
    }
  }
};
```

---

### FASE 2: IMPLEMENTACIÓN GRADUAL

#### 2.1 **Opción A: Service Role Key (MÁS RÁPIDO)**

**Ventaja:** Bypasea RLS, no requiere cambios de código
**Desventaja:** Menos seguro (confiamos en filtrado manual)

```javascript
// src/lib/supabase-admin.js (NUEVO ARCHIVO)
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jjpscimtxrudtepzwhag.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // NUNCA exponer en frontend

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Usar SOLO en backend/n8n
```

**Para n8n:**
```
Todos los workflows usan SERVICE_ROLE_KEY
  ↓
RLS NO les afecta (bypass)
  ↓
Pero DEBEN filtrar por tenant_id manualmente
```

---

#### 2.2 **Opción B: Tenant Context Injection (MÁS SEGURO)**

**Ventaja:** RLS funciona correctamente, seguridad real
**Desventaja:** Requiere cambios en TODAS las queries

**Paso 1: Crear función de context injection**
```sql
-- En Supabase SQL Editor
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_uuid UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_tenant', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Paso 2: Middleware en frontend**
```javascript
// src/lib/supabase-with-tenant.js
import { supabase } from './supabase';

export async function withTenant(tenantId, queryFn) {
  // Set tenant context
  await supabase.rpc('set_current_tenant', { tenant_uuid: tenantId });

  // Execute query (RLS usará el tenant_id del context)
  const result = await queryFn();

  return result;
}

// USO:
const bookings = await withTenant(
  user.tenant_id,
  () => supabase.from('bookings').select('*')
);
```

**Paso 3: Políticas RLS usando context**
```sql
-- Política para SELECT en bookings
CREATE POLICY "Users can only see their tenant's bookings"
ON bookings
FOR SELECT
USING (
  tenant_id = current_setting('app.current_tenant', true)::uuid
);

-- Política para INSERT
CREATE POLICY "Users can only insert their tenant's bookings"
ON bookings
FOR INSERT
WITH CHECK (
  tenant_id = current_setting('app.current_tenant', true)::uuid
);

-- Política para UPDATE
CREATE POLICY "Users can only update their tenant's bookings"
ON bookings
FOR UPDATE
USING (
  tenant_id = current_setting('app.current_tenant', true)::uuid
);

-- Política para DELETE
CREATE POLICY "Users can only delete their tenant's bookings"
ON bookings
FOR DELETE
USING (
  tenant_id = current_setting('app.current_tenant', true)::uuid
);
```

---

#### 2.3 **Activar RLS Tabla por Tabla**

```sql
-- ORDEN RECOMENDADO (menos riesgo → más riesgo)

-- 1. Tablas sin dependencias
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_events ENABLE ROW LEVEL SECURITY;

-- 2. Tablas secundarias
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 3. Tablas core (DESPUÉS de probar las anteriores)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_contacts ENABLE ROW LEVEL SECURITY;
```

**IMPORTANTE: Test después de CADA tabla**
```bash
# Después de activar RLS en cada tabla
1. Verificar frontend carga datos
2. Verificar n8n workflows funcionan
3. Verificar VAPI puede crear bookings
4. Si algo falla → ROLLBACK inmediato
```

**Rollback:**
```sql
-- Si algo falla
ALTER TABLE [tabla] DISABLE ROW LEVEL SECURITY;
-- O borrar políticas específicas
DROP POLICY "[nombre_policy]" ON [tabla];
```

---

### FASE 3: VALIDACIÓN

#### 3.1 Tests de Regresión

```javascript
// tests/rls-validation.test.js
describe('RLS Validation Tests', () => {
  const tenantA = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
  const tenantB = 'diferente-tenant-id';

  test('Tenant A no puede ver bookings de Tenant B', async () => {
    // Set context como Tenant A
    await supabase.rpc('set_current_tenant', { tenant_uuid: tenantA });

    const { data } = await supabase.from('bookings').select('*');

    // Verificar que TODOS los bookings son de Tenant A
    const allBelongToTenantA = data.every(b => b.tenant_id === tenantA);
    expect(allBelongToTenantA).toBe(true);
  });

  test('Tenant A no puede insertar booking para Tenant B', async () => {
    await supabase.rpc('set_current_tenant', { tenant_uuid: tenantA });

    const { error } = await supabase.from('bookings').insert({
      tenant_id: tenantB,  // Intentar insertar para otro tenant
      property_id: '...',
      guest_name: 'Test'
    });

    // Debe fallar
    expect(error).not.toBeNull();
    expect(error.code).toBe('42501'); // RLS violation
  });

  test('n8n puede crear bookings (Service Role Key)', async () => {
    // n8n usa Service Role Key (bypasea RLS)
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        tenant_id: tenantA,
        property_id: '...',
        guest_name: 'From n8n'
      });

    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  test('Joins funcionan correctamente con RLS', async () => {
    await supabase.rpc('set_current_tenant', { tenant_uuid: tenantA });

    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        properties (name, location),
        guest_contacts (name, email)
      `);

    expect(data).not.toBeNull();
    // Verificar que joins solo traen datos del tenant correcto
  });
});
```

#### 3.2 Monitoring Post-Implementación

```sql
-- Crear tabla de audit log
CREATE TABLE rls_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  user_id UUID,
  table_name TEXT,
  operation TEXT, -- SELECT, INSERT, UPDATE, DELETE
  success BOOLEAN,
  error_message TEXT,
  query_text TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para logging automático
CREATE OR REPLACE FUNCTION log_rls_operations()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO rls_audit_log (
    tenant_id,
    table_name,
    operation,
    success,
    timestamp
  ) VALUES (
    current_setting('app.current_tenant', true)::uuid,
    TG_TABLE_NAME,
    TG_OP,
    true,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tablas críticas
CREATE TRIGGER audit_bookings
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW EXECUTE FUNCTION log_rls_operations();
```

---

## 📊 PLAN DE IMPLEMENTACIÓN RECOMENDADO

### RECOMENDACIÓN: **OPCIÓN A + Migración gradual a OPCIÓN B**

**Por qué:**
- ✅ Rápido de implementar (1-2 días)
- ✅ No rompe nada existente
- ✅ n8n sigue funcionando sin cambios
- ✅ Puedes migrar frontend progresivamente
- ✅ Tienes tiempo para testing exhaustivo

### Timeline Recomendado:

```
┌────────────────────────────────────────────────────────┐
│ SEMANA 1: POST-MEETING (Después del lunes)            │
└────────────────────────────────────────────────────────┘

DÍA 1-2: PREPARACIÓN
  ✅ Auditar RLS actual en Supabase
  ✅ Inventariar queries en data.js
  ✅ Crear tests de regresión
  ✅ Documentar rollback plan

DÍA 3: SERVICE ROLE KEY para todo
  ✅ Configurar SERVICE_ROLE_KEY en n8n (si no está)
  ✅ Verificar todos los workflows usan SERVICE_ROLE
  ✅ Testing exhaustivo n8n workflows

DÍA 4-5: Activar RLS tabla por tabla
  ✅ market_data (bajo riesgo)
  ✅ channel_listings (bajo riesgo)
  ✅ messages (medio riesgo)
  ✅ Test cada tabla antes de siguiente

┌────────────────────────────────────────────────────────┐
│ SEMANA 2: CORE TABLES                                  │
└────────────────────────────────────────────────────────┘

DÍA 1-2: Tablas críticas
  ✅ properties (con testing extensivo)
  ✅ bookings (con testing extensivo)
  ✅ guest_contacts (con testing extensivo)

DÍA 3-5: Frontend migration (opcional, más seguro)
  ✅ Implementar withTenant() helper
  ✅ Migrar data.js función por función
  ✅ A/B testing en producción
```

---

## ⚠️ RIESGOS Y MITIGACIONES

### Riesgo 1: n8n workflows fallan después de activar RLS

**Probabilidad:** BAJA (si usas SERVICE_ROLE_KEY)

**Mitigación:**
```javascript
// Verificar en CADA workflow de n8n:
Supabase Node → Credentials
  └─ Authentication: Service Role Key (NOT Anon Key)
  └─ API Key: tu-service-role-key (empieza con eyJ...)

// Si usa Anon Key → cambiar a Service Role
```

**Rollback:**
```sql
-- Si n8n falla
ALTER TABLE [tabla_problema] DISABLE ROW LEVEL SECURITY;
-- Fix n8n credentials
-- Re-enable RLS
```

---

### Riesgo 2: Frontend deja de cargar datos

**Probabilidad:** ALTA (si activas RLS sin migrar queries)

**Mitigación:**
```javascript
// ANTES de activar RLS en una tabla
// Asegurar que data.js use:

// Opción A: Service Role (temporal)
import { supabaseAdmin } from './supabase-admin';
const { data } = await supabaseAdmin.from('bookings').select('*');

// Opción B: Tenant context (mejor)
await withTenant(user.tenant_id, async () => {
  const { data } = await supabase.from('bookings').select('*');
});
```

**Rollback:**
```sql
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
```

---

### Riesgo 3: VAPI deja de crear bookings

**Probabilidad:** MUY BAJA

**Mitigación:**
```javascript
// VoiceAssistant.jsx → n8n webhook
// n8n workflow: KORA Post-Call
// Verificar que n8n node use SERVICE_ROLE_KEY
// Y que INSERT incluya tenant_id:

await supabase
  .from('bookings')
  .insert({
    tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db',  // ✅
    property_id: data.property_id,
    guest_name: data.guest_name,
    // ...
  });
```

---

## 🎯 DECISIÓN FINAL RECOMENDADA

### Para MY HOST BizMate AHORA:

**NO implementar RLS estricto ANTES del lunes.**

**Razones:**
1. ⏰ **Tiempo crítico** - Demo del lunes es prioridad
2. ⚠️ **Riesgo alto** - Puede romper cosas justo antes de demo
3. 🔧 **Requiere testing** - 2-3 días mínimo
4. ✅ **No es urgente** - Estás en MVP con 1 tenant

### DESPUÉS del lunes (Plan recomendado):

**SEMANA 1 POST-MEETING:**
1. Auditar estado actual
2. Implementar SERVICE_ROLE_KEY en todos los n8n workflows
3. Activar RLS tabla por tabla (menos críticas primero)
4. Testing exhaustivo

**SEMANA 2:**
5. Activar RLS en tablas core (properties, bookings, guests)
6. Migrar frontend progresivamente
7. Monitoring y ajustes

### Mientras tanto (AHORA):

**Medidas de seguridad inmediatas:**
```sql
-- 1. Crear índices en tenant_id (performance)
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_properties_tenant ON properties(tenant_id);
CREATE INDEX idx_guests_tenant ON guest_contacts(tenant_id);

-- 2. Validación en triggers (primera línea de defensa)
CREATE OR REPLACE FUNCTION validate_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    RAISE EXCEPTION 'tenant_id cannot be NULL';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_booking_tenant
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION validate_tenant_id();

-- 3. NOT NULL constraints
ALTER TABLE bookings ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE properties ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE guest_contacts ALTER COLUMN tenant_id SET NOT NULL;
```

---

## 📝 CHECKLIST DE IMPLEMENTACIÓN (Post-Meeting)

```
□ PREPARACIÓN
  □ Backup completo de Supabase
  □ Exportar todos los workflows n8n
  □ Crear branch de git para cambios
  □ Escribir tests de regresión

□ AUDITORÍA
  □ Listar todas las tablas con tenant_id
  □ Verificar índices existen
  □ Inventariar queries en data.js
  □ Verificar credenciales n8n (Service Role?)

□ IMPLEMENTACIÓN
  □ Crear políticas RLS para 1 tabla test
  □ Activar RLS en tabla test
  □ Verificar frontend funciona
  □ Verificar n8n funciona
  □ Repetir para cada tabla

□ VALIDACIÓN
  □ Ejecutar tests de regresión
  □ Test cross-tenant aislamiento
  □ Test n8n workflows (todos los 21 si aplica)
  □ Test VAPI bookings
  □ Monitoring 24-48 horas

□ ROLLBACK PLAN
  □ Scripts de disable RLS listos
  □ Backup restoration plan
  □ Contacto con equipo disponible
```

---

## 🚀 CONCLUSIÓN

**Tu preocupación es CORRECTA:**
Implementar RLS **SÍ puede romper** n8n workflows y frontend si no se hace con cuidado.

**PERO es manejable:**
Con SERVICE_ROLE_KEY en n8n y migración gradual, el riesgo se reduce a MÍNIMO.

**RECOMENDACIÓN FINAL:**
1. **AHORA:** Foco en demo del lunes
2. **POST-MEETING:** Implementar RLS gradualmente en 2 semanas
3. **ESTRATEGIA:** Service Role Key + migración tabla por tabla
4. **ROLLBACK:** Plan listo para cada paso

**PRIORIDAD: Demo del lunes > RLS > Arquitectura multi-tenant**

---

**Preparado por:** Claude Code
**Fecha:** 20 Enero 2026
**Proyecto:** MY HOST BizMate - RLS Impact Analysis
