# 🎯 PLAN MAESTRO COMPLETO - MY HOST BIZMATE
**Fecha:** 27 Diciembre 2025 | **Versión:** 2.0 (Ajustada a Realidad)
**Estado Actual:** Marketing & Growth Phase 1 ✅ Completado (~30% del proyecto)
**Siguiente Fase:** Infraestructura + Integraciones + Workflows n8n

---

## ⚡ ESTIMACIÓN REALISTA - VERSIÓN 2.0

> **IMPORTANTE:** Esta es la estimación REAL basada en experiencia de desarrollo.
> Las estimaciones originales (76-112h) eran optimistas y no incluían debugging, iteraciones, ni imprevistos.

### 📊 Números Realistas

| Métrica | Valor Realista |
|---------|----------------|
| **Horas totales** | 200-250 horas |
| **Semanas** | 6-8 semanas |
| **Horas por día** | 4-6 horas (sostenible) |
| **Días por semana** | 5 días laborables |
| **Progreso actual** | 30% completado |
| **Progreso restante** | 70% (principalmente backend e integraciones) |

### ⏱️ Desglose Realista por Fase

| Fase | Original | **Realista** | Diferencia |
|------|----------|--------------|------------|
| FASE 1: Multi-tenant | 14-20h | **25-35h** | +55-75% |
| FASE 2.1: Stripe | 12-17h | **20-30h** | +66-76% |
| FASE 2.2: DOMUS | 20-26h | **35-50h** | +75-92% |
| FASE 3: Workflows Alta | 9-13h | **15-25h** | +66-92% |
| FASE 4: Workflows Media | 16-27h | **30-45h** | +87-66% |
| FASE 5: Polish | 5-9h | **15-25h** | +200-177% |
| **Buffer Imprevistos** | 0h | **30-40h** | - |
| **TOTAL** | 76-112h | **200-250h** | **+163-123%** |

### 🎯 Por Qué el Ajuste

**Factores que duplican/triplican el tiempo:**
- ✅ Debugging real (~30% del tiempo)
- ✅ Aprendizaje de APIs nuevas (~15%)
- ✅ Testing exhaustivo (~15%)
- ✅ Iteraciones y refinamientos (~20%)
- ✅ Documentación (~10%)
- ✅ Imprevistos inevitables (~30%)

**Sin estos factores = estimación optimista que nunca se cumple**

### 📅 Timeline Semanal Realista (5h/día promedio)

```
SEMANA 1-2  →  Multi-Tenant Architecture (25-35h)
               ├─ RLS policies críticas
               ├─ Testing exhaustivo
               └─ Migración de datos

SEMANA 3     →  Stripe Payments (20-30h)
               ├─ Setup + Payment Intent
               ├─ Checkout UI + Webhooks
               └─ Testing con datos reales

SEMANA 4-5   →  DOMUS Channel Manager (35-50h)
               ├─ API research + auth
               ├─ Property & Booking sync
               ├─ Calendar real-time
               └─ Conflict resolution

SEMANA 6     →  Workflows Alta Prioridad (15-25h)
               ├─ VAPI Voice Agent
               ├─ WhatsApp Concierge
               └─ AI Agents

SEMANA 7     →  Workflows Media Prioridad (30-45h)
               ├─ Marketing workflows (4)
               ├─ Communication (1)
               ├─ Content & Campaigns (4)
               └─ Enrichment (2)

SEMANA 8     →  Polish + Testing Final (15-25h)
               ├─ Dashboard widgets
               ├─ Bug fixes
               ├─ Performance optimization
               └─ Documentación final

BUFFER       →  Imprevistos (30-40h distribuidos)
               └─ Lo que siempre pasa

TOTAL: 6-8 semanas | 200-250 horas | 4-6h/día
```

### ✅ Validación Matemática

```
Escenario Conservador:
4h/día × 5 días × 8 semanas = 160h base
160h + 40% buffer = 224h ✅

Escenario Medio:
5h/día × 5 días × 7 semanas = 175h base
175h + 40% buffer = 245h ✅

Escenario Optimista:
6h/día × 5 días × 6 semanas = 180h base
180h + 30% buffer = 234h ✅

Rango final: 224-245h promedio = 200-250h ✅
```

---

> **📌 NOTA:** El resto del documento mantiene las estimaciones originales (76-112h) para referencia de tareas individuales, pero debes multiplicar por ~2.5x para obtener tiempos reales que incluyan debugging, testing e imprevistos.

---

## 📋 ÍNDICE
1. [Estado Actual](#estado-actual)
2. [Roadmap Completo](#roadmap-completo)
3. [FASE 1: Infraestructura Base](#fase-1-infraestructura-base)
4. [FASE 2: Integraciones Críticas](#fase-2-integraciones-críticas)
5. [FASE 3: Workflows Alta Prioridad](#fase-3-workflows-alta-prioridad)
6. [FASE 4: Workflows Media Prioridad](#fase-4-workflows-media-prioridad)
7. [FASE 5: Workflows Baja Prioridad](#fase-5-workflows-baja-prioridad)
8. [Timeline Consolidado](#timeline-consolidado)
9. [Resumen Ejecutivo](#resumen-ejecutivo)

---

## ✅ ESTADO ACTUAL

### Marketing & Growth - Phase 1 (COMPLETADO)
| # | Módulo | Estado | Commit | Fecha |
|---|--------|--------|--------|-------|
| 1 | Guest Segmentation | ✅ Completado | 4d5dda4 | 27-Dic-2025 |
| 2 | Meta Ads Manager | ✅ Completado | 7f93756 | 27-Dic-2025 |
| 3 | Reviews & Reputation | ✅ Completado | 0dc55f4 | 27-Dic-2025 |
| 4 | Guest Analytics Dashboard | ✅ Completado | 4d5dda4 | 27-Dic-2025 |

**Total:** 4 módulos UI implementados con datos demo

---

## 🗺️ ROADMAP COMPLETO

```
┌─────────────────────────────────────────────────────────────────┐
│                       ESTADO ACTUAL                             │
│  Marketing & Growth Phase 1 ✅ (4 módulos completados)         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: INFRAESTRUCTURA BASE 🔴 (14-20h | 3-4 días)           │
│  → Multi-Tenant Architecture                                    │
│  → Supabase RLS & Schema Updates                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: INTEGRACIONES CRÍTICAS 🔴 (32-43h | 6-8 días)        │
│  → Stripe Payments Integration                                  │
│  → DOMUS Channel Manager API                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: WORKFLOWS ALTA PRIORIDAD 🔴 (9-13h | 2-3 días)       │
│  → VAPI Voice Agent "Ayu"                                       │
│  → WhatsApp Concierge                                           │
│  → Internal & External Agents                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4: WORKFLOWS MEDIA PRIORIDAD 🟡 (16-27h | 3-5 días)     │
│  → Marketing & Growth Workflows (4)                             │
│  → Communication Workflows (1)                                  │
│  → Content & Campaigns (4)                                      │
│  → Enrichment (2)                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 5: POLISH & WIDGETS 🟢 (3-6h | 1 día)                   │
│  → Dashboard Widgets (3)                                        │
│  → Testing & Bug Fixes                                          │
└─────────────────────────────────────────────────────────────────┘
```

**TOTAL ESTIMADO:** 74-109 horas | 15-21 días laborables

---

# FASE 1: INFRAESTRUCTURA BASE 🔴
**Prioridad:** CRÍTICA - BLOQUEANTE
**Duración:** 14-20 horas | 3-4 días
**¿Por qué primero?** Sin multi-tenancy, el resto no puede escalar

## 1.1 Multi-Tenant Architecture - Supabase Schema

### Tarea 1.1.1: Auditoría de Tablas Actuales
**Descripción:** Identificar todas las tablas que necesitan `tenant_id`
**Complejidad:** 🟢 Baja
**Tiempo:** 1-2 horas

**Checklist:**
- [ ] Listar todas las tablas en Supabase
- [ ] Identificar tablas compartidas vs. aisladas
- [ ] Documentar relaciones entre tablas
- [ ] Crear script de migración

**Entregables:**
- `supabase/migrations/001_audit_tables.sql`
- Documento: `docs/multi-tenant-schema.md`

---

### Tarea 1.1.2: Agregar tenant_id a Tablas
**Descripción:** Migración para agregar columna `tenant_id` + índices
**Complejidad:** 🔴 Alta
**Tiempo:** 3-4 horas

**Tablas a modificar:**
- `properties`
- `bookings`
- `guests`
- `payments`
- `messages`
- `reviews`
- `campaigns`
- `workflows`
- `ai_conversations`
- `notifications`

**Script SQL:**
```sql
-- Ejemplo para tabla properties
ALTER TABLE properties
ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id);

CREATE INDEX idx_properties_tenant_id ON properties(tenant_id);
```

**Checklist:**
- [ ] Crear tabla `tenants` (id, name, domain, plan, created_at)
- [ ] Agregar `tenant_id` a 10+ tablas
- [ ] Crear índices para performance
- [ ] Migrar datos existentes a tenant demo
- [ ] Testing: verificar integridad referencial

**Entregables:**
- `supabase/migrations/002_add_tenant_id.sql`

---

### Tarea 1.1.3: Row Level Security (RLS) Policies
**Descripción:** Configurar políticas RLS para aislamiento de datos
**Complejidad:** 🔴 Alta
**Tiempo:** 3-4 horas

**Política base (aplicar a cada tabla):**
```sql
-- Política de SELECT
CREATE POLICY "Users can only see their tenant's data"
ON properties FOR SELECT
USING (tenant_id = auth.jwt() ->> 'tenant_id');

-- Política de INSERT
CREATE POLICY "Users can only insert into their tenant"
ON properties FOR INSERT
WITH CHECK (tenant_id = auth.jwt() ->> 'tenant_id');

-- Similar para UPDATE, DELETE
```

**Checklist:**
- [ ] Habilitar RLS en todas las tablas multi-tenant
- [ ] Crear políticas SELECT, INSERT, UPDATE, DELETE
- [ ] Configurar JWT claims para incluir `tenant_id`
- [ ] Testing con 2 tenants diferentes

**Entregables:**
- `supabase/migrations/003_rls_policies.sql`
- Test: `tests/multi-tenant-isolation.test.js`

---

### Tarea 1.1.4: Auth Context - Frontend
**Descripción:** Actualizar AuthContext para manejar tenant_id en sesión
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Archivos a modificar:**
- `src/contexts/AuthContext.jsx`
- `src/services/supabase.js`

**Cambios necesarios:**
```javascript
// AuthContext.jsx
const [tenant, setTenant] = useState(null);

useEffect(() => {
  const session = supabase.auth.getSession();
  if (session) {
    const tenantId = session.user.user_metadata.tenant_id;
    fetchTenantData(tenantId);
  }
}, [user]);
```

**Checklist:**
- [ ] Agregar `tenant` al AuthContext
- [ ] Fetch tenant data on login
- [ ] Pasar tenant_id a todas las queries
- [ ] Update login flow para asignar tenant

**Entregables:**
- `src/contexts/AuthContext.jsx` (updated)
- `src/hooks/useTenant.js` (new)

---

### Tarea 1.1.5: Data Isolation - Service Layer
**Descripción:** Actualizar todas las queries para filtrar por tenant_id
**Complejidad:** 🔴 Alta
**Tiempo:** 3-4 horas

**Patrón a aplicar:**
```javascript
// ANTES
const { data } = await supabase
  .from('properties')
  .select('*');

// DESPUÉS
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('tenant_id', tenantId);
```

**Archivos a actualizar:**
- `src/services/supabase.js` (todas las funciones)
- Todos los componentes que hacen fetch directo

**Checklist:**
- [ ] Actualizar 20+ queries en supabaseService
- [ ] Agregar tenant_id a todos los INSERTs
- [ ] Testing: verificar que un tenant no ve datos de otro
- [ ] Error handling para tenant_id faltante

**Entregables:**
- `src/services/supabase.js` (refactored)
- Test suite: `tests/tenant-isolation.test.js`

---

### Tarea 1.1.6: Testing Multi-Tenant
**Descripción:** Suite de tests para verificar aislamiento total
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Casos de test:**
1. Tenant A no puede ver propiedades de Tenant B
2. INSERT con tenant_id incorrecto falla
3. JWT sin tenant_id rechazado
4. Cross-tenant queries bloqueados por RLS

**Checklist:**
- [ ] Crear 2 tenants de prueba
- [ ] 10+ test cases de aislamiento
- [ ] Performance test con 1000+ registros
- [ ] Documentar resultados

**Entregables:**
- `tests/multi-tenant.test.js`
- Reporte: `docs/multi-tenant-test-results.md`

---

## ✅ FASE 1 - Criterios de Completitud

- [ ] Tabla `tenants` creada y poblada
- [ ] 10+ tablas con `tenant_id` + índices
- [ ] RLS habilitado en todas las tablas
- [ ] AuthContext maneja tenant_id
- [ ] Todas las queries filtran por tenant
- [ ] 100% de tests pasando
- [ ] Documentación completa

**Resultado:** Sistema multi-tenant funcional, listo para producción

---

# FASE 2: INTEGRACIONES CRÍTICAS 🔴
**Prioridad:** ALTA
**Duración:** 32-43 horas | 6-8 días
**Dependencias:** Requiere FASE 1 completada

## 2.1 Stripe Payments Integration

### Tarea 2.1.1: Stripe Setup & Configuration
**Descripción:** Configurar Stripe SDK en frontend y backend
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Pasos:**
1. Crear cuenta Stripe (test mode)
2. Obtener API keys (publishable + secret)
3. Instalar dependencias

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Checklist:**
- [ ] Crear cuenta Stripe
- [ ] Configurar webhooks endpoint
- [ ] Agregar keys a .env
- [ ] Instalar SDK en frontend/backend

**Entregables:**
- `.env.example` actualizado
- `docs/stripe-setup-guide.md`

---

### Tarea 2.1.2: Payment Intent API
**Descripción:** Backend endpoint para crear Payment Intents
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Nuevo servicio:**
```javascript
// src/services/stripeService.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, bookingId, tenantId) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // cents
    currency: 'usd',
    metadata: {
      booking_id: bookingId,
      tenant_id: tenantId
    }
  });

  return paymentIntent;
};
```

**Checklist:**
- [ ] Crear `stripeService.js`
- [ ] Endpoint: POST /api/create-payment-intent
- [ ] Validar amount, bookingId
- [ ] Logging y error handling

**Entregables:**
- `src/services/stripeService.js`
- API endpoint funcional

---

### Tarea 2.1.3: Checkout UI Component
**Descripción:** Formulario de pago con Stripe Elements
**Complejidad:** 🟡 Media
**Tiempo:** 3-4 horas

**Componente nuevo:**
```jsx
// src/components/Payments/StripeCheckout.jsx
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripeCheckout = ({ amount, bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: elements.getElement(CardElement) } }
    );

    if (error) {
      console.error(error);
    } else {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay ${amount}</button>
    </form>
  );
};
```

**Checklist:**
- [ ] Crear componente StripeCheckout
- [ ] Integrar CardElement
- [ ] Styling corporativo (orange theme)
- [ ] Loading states
- [ ] Error messages

**Entregables:**
- `src/components/Payments/StripeCheckout.jsx`
- Integrado en módulo Bookings

---

### Tarea 2.1.4: Webhooks Handler
**Descripción:** Procesar eventos de Stripe (success, failed, refund)
**Complejidad:** 🔴 Alta
**Tiempo:** 3-4 horas

**Eventos a manejar:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

**Endpoint:**
```javascript
// api/webhooks/stripe.js
export default async function handler(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
  }

  res.json({ received: true });
}
```

**Checklist:**
- [ ] Crear endpoint /api/webhooks/stripe
- [ ] Verificar firma de webhook
- [ ] Handler para cada evento
- [ ] Update booking status en Supabase
- [ ] Notificar al usuario

**Entregables:**
- `api/webhooks/stripe.js`
- Webhooks configurados en Stripe Dashboard

---

### Tarea 2.1.5: Payment Records en Supabase
**Descripción:** Guardar historial de pagos
**Complejidad:** 🟢 Baja
**Tiempo:** 2-3 horas

**Nueva tabla:**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  booking_id UUID REFERENCES bookings(id),
  stripe_payment_intent_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL, -- succeeded, failed, refunded
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Checklist:**
- [ ] Crear tabla payments
- [ ] RLS policies
- [ ] Función: savePayment()
- [ ] UI: Payment history en Bookings

**Entregables:**
- `supabase/migrations/004_payments_table.sql`
- `src/services/paymentService.js`

---

## 2.2 DOMUS Channel Manager Integration

### Tarea 2.2.1: DOMUS API Research
**Descripción:** Estudiar documentación de DOMUS API
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Investigar:**
- Endpoints disponibles
- Método de autenticación (OAuth, API key, etc.)
- Rate limits
- Formato de datos (JSON, XML)
- Webhooks disponibles

**Checklist:**
- [ ] Leer documentación oficial
- [ ] Crear cuenta de prueba DOMUS
- [ ] Obtener API credentials
- [ ] Probar endpoints con Postman
- [ ] Documentar hallazgos

**Entregables:**
- `docs/domus-api-documentation.md`
- Colección Postman: `domus-api-tests.json`

---

### Tarea 2.2.2: Authentication Flow
**Descripción:** Implementar autenticación con DOMUS
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Servicio:**
```javascript
// src/services/domusService.js
export const authenticateDomus = async (apiKey) => {
  const response = await fetch('https://api.domus.com/auth', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });

  const { access_token } = await response.json();
  return access_token;
};
```

**Checklist:**
- [ ] Implementar OAuth flow (si aplica)
- [ ] Guardar tokens en Supabase (tabla `integrations`)
- [ ] Token refresh automático
- [ ] Error handling

**Entregables:**
- `src/services/domusService.js` (auth module)
- Tabla `integrations` en Supabase

---

### Tarea 2.2.3: Property Sync - Import
**Descripción:** Importar propiedades desde DOMUS a MY HOST
**Complejidad:** 🔴 Alta
**Tiempo:** 4-5 horas

**Flujo:**
1. Fetch propiedades desde DOMUS API
2. Mapear campos DOMUS → Supabase schema
3. Crear/actualizar en tabla `properties`
4. Manejar fotos, amenities

**Endpoint:**
```javascript
export const syncPropertiesFromDomus = async (tenantId) => {
  const domusProperties = await domusAPI.getProperties();

  for (const domusProp of domusProperties) {
    const mapped = {
      tenant_id: tenantId,
      external_id: domusProp.id,
      name: domusProp.name,
      address: domusProp.location,
      bedrooms: domusProp.rooms,
      // ... más campos
    };

    await supabase.from('properties').upsert(mapped);
  }
};
```

**Checklist:**
- [ ] Endpoint GET /api/domus/properties
- [ ] Field mapping DOMUS → Supabase
- [ ] Manejo de fotos (URLs o download)
- [ ] UI: Botón "Import from DOMUS" en Properties
- [ ] Progress indicator

**Entregables:**
- Función `syncPropertiesFromDomus()`
- UI integration en Properties module

---

### Tarea 2.2.4: Booking Sync - Bidireccional
**Descripción:** Sincronizar reservas en ambas direcciones
**Complejidad:** 🔴 Alta
**Tiempo:** 5-6 horas

**Escenarios:**
1. **DOMUS → MY HOST:** Nueva reserva en DOMUS crea booking en Supabase
2. **MY HOST → DOMUS:** Nueva reserva en MY HOST actualiza DOMUS
3. **Modificaciones:** Cambios en fechas/precio se sincronizan
4. **Cancelaciones:** Cancelar en un lado cancela en el otro

**Lógica de conflictos:**
```javascript
export const syncBooking = async (booking, direction) => {
  if (direction === 'from_domus') {
    // DOMUS es source of truth
    const existingBooking = await supabase
      .from('bookings')
      .select('*')
      .eq('external_id', booking.domus_id)
      .single();

    if (existingBooking && existingBooking.updated_at > booking.updated_at) {
      // Conflict: MY HOST más reciente
      await resolveConflict(existingBooking, booking);
    } else {
      await supabase.from('bookings').upsert({
        external_id: booking.domus_id,
        // ... campos
      });
    }
  }
};
```

**Checklist:**
- [ ] Webhook listener para DOMUS bookings
- [ ] POST booking a DOMUS cuando se crea en MY HOST
- [ ] Conflict resolution strategy
- [ ] Testing con 3 escenarios

**Entregables:**
- `src/services/domusSync.js` (booking module)
- Webhooks configurados en DOMUS

---

### Tarea 2.2.5: Calendar Sync - Disponibilidad
**Descripción:** Sincronizar disponibilidad en tiempo real
**Complejidad:** 🔴 Alta
**Tiempo:** 4-5 horas

**Funcionalidad:**
- Bloquear fechas en DOMUS cuando se reserva en MY HOST
- Importar bloques de DOMUS (mantenimiento, reservas directas)
- Update en tiempo real (webhooks)

**Implementación:**
```javascript
export const syncAvailability = async (propertyId, startDate, endDate) => {
  // Fetch availability from DOMUS
  const domusAvailability = await domusAPI.getAvailability(
    propertyId,
    startDate,
    endDate
  );

  // Update local calendar
  await supabase.from('calendar_blocks').upsert(
    domusAvailability.map(block => ({
      property_id: propertyId,
      start_date: block.start,
      end_date: block.end,
      status: block.status, // available, booked, blocked
      source: 'domus'
    }))
  );
};
```

**Checklist:**
- [ ] Fetch availability from DOMUS
- [ ] Tabla `calendar_blocks` en Supabase
- [ ] Webhooks para cambios en tiempo real
- [ ] UI: Calendar view con estados

**Entregables:**
- `supabase/migrations/005_calendar_blocks.sql`
- Calendar sync service
- UI update en PMS Calendar module

---

### Tarea 2.2.6: Error Handling & Retry Logic
**Descripción:** Manejo robusto de errores en sync
**Complejidad:** 🟡 Media
**Tiempo:** 3-4 horas

**Patrones a implementar:**
- Retry con exponential backoff
- Queue system para syncs fallidos
- Logs detallados
- Notificaciones de errores

**Retry logic:**
```javascript
export const retryableSync = async (syncFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await syncFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
};
```

**Checklist:**
- [ ] Retry logic wrapper
- [ ] Sync queue en Supabase (`sync_queue` table)
- [ ] Cron job para procesar queue
- [ ] Dashboard de sync status

**Entregables:**
- `src/services/syncQueue.js`
- Admin UI: Sync logs viewer

---

## ✅ FASE 2 - Criterios de Completitud

- [ ] Stripe checkout funcional end-to-end
- [ ] Webhooks procesando eventos correctamente
- [ ] DOMUS autenticación working
- [ ] Properties importadas desde DOMUS
- [ ] Bookings sincronizando bidireccional
- [ ] Calendar actualizado en tiempo real
- [ ] Error handling robusto
- [ ] Documentación completa

---

# FASE 3: WORKFLOWS ALTA PRIORIDAD 🔴
**Prioridad:** ALTA
**Duración:** 9-13 horas | 2-3 días
**Dependencias:** Ninguna (workflows n8n independientes)

## 3.1 VAPI Voice Agent "Ayu" - Redesign

### Tarea 3.1.1: VAPI Account Setup
**Descripción:** Configurar cuenta VAPI y crear agente "Ayu"
**Complejidad:** 🟡 Media
**Tiempo:** 1 hora

**Checklist:**
- [ ] Crear cuenta en vapi.ai
- [ ] Configurar phone number (Twilio integration)
- [ ] Crear agente "Ayu" con voz femenina
- [ ] Definir personality prompt

**Entregables:**
- VAPI agent ID
- `docs/vapi-setup.md`

---

### Tarea 3.1.2: n8n Workflow - VAPI → Supabase
**Descripción:** Workflow que captura llamadas y crea bookings
**Complejidad:** 🔴 Alta
**Tiempo:** 2-3 horas

**Flujo n8n:**
```
[VAPI Webhook]
  → [Extract Call Data]
  → [Parse Intent: Booking/Info/Complaint]
  → [IF Booking]
      → [Create Lead in Supabase]
      → [Send Confirmation WhatsApp]
  → [Save Call Transcript]
```

**Checklist:**
- [ ] Crear workflow en n8n
- [ ] Webhook endpoint para VAPI
- [ ] Intent recognition (booking vs. query)
- [ ] Guardar transcripts en Supabase
- [ ] WhatsApp confirmation

**Entregables:**
- `n8n_workflows/WF-VAPI-01-Voice-Bookings.json`
- Webhook configurado en VAPI

---

## 3.2 WhatsApp Concierge Agent

### Tarea 3.2.1: WhatsApp Business API Setup
**Descripción:** Configurar cuenta WhatsApp Business
**Complejidad:** 🟡 Media
**Tiempo:** 1 hora

**Checklist:**
- [ ] Cuenta WhatsApp Business
- [ ] Conectar a n8n (via API o Twilio)
- [ ] Phone number verificado
- [ ] Message templates aprobados

**Entregables:**
- WhatsApp Business ID
- API credentials en n8n

---

### Tarea 3.2.2: n8n Workflow - Concierge
**Descripción:** Bot conversacional para huéspedes durante estancia
**Complejidad:** 🔴 Alta
**Tiempo:** 2-3 horas

**Flujo n8n:**
```
[WhatsApp Webhook]
  → [Identify Guest from Phone]
  → [Get Active Booking]
  → [Claude AI - Context: Property + Booking + Location]
  → [Generate Response]
  → [Send WhatsApp Reply]
  → [Log Conversation in Supabase]
```

**Casos de uso:**
- WiFi password
- Check-out instructions
- Restaurant recommendations
- Issue reporting
- Taxi/transport booking

**Checklist:**
- [ ] Workflow en n8n
- [ ] Claude AI integration
- [ ] Context builder (property info, guest history)
- [ ] Response generator
- [ ] Conversation logging

**Entregables:**
- `n8n_workflows/WF-COMM-03-WhatsApp-Concierge.json`

---

## 3.3 Internal Agent (Dashboard Assistant)

### Tarea 3.3.1: n8n Workflow - Staff Assistant
**Descripción:** Asistente IA para staff/owner en Dashboard
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Funcionalidad:**
- Preguntas sobre ocupación: "¿Cuántas reservas tengo en Febrero?"
- Análisis de revenue: "¿Cuál es mi ADR este mes?"
- Alertas: "¿Hay algún pago pendiente?"

**Flujo n8n:**
```
[API Endpoint]
  → [Recibe pregunta del usuario]
  → [Query Supabase con filtros de tenant]
  → [Procesar datos]
  → [Return JSON response]
```

**Checklist:**
- [ ] API endpoint en n8n
- [ ] Queries a Supabase (bookings, payments, occupancy)
- [ ] Response formatter
- [ ] Integrar en AIAssistant component

**Entregables:**
- `n8n_workflows/WF-IA-04-Internal-Agent.json`
- API integration en frontend

---

## 3.4 External Agent (Market Intelligence)

### Tarea 3.4.1: n8n Workflow - Market Analysis
**Descripción:** Análisis de mercado con OpenAI + contexto externo
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Funcionalidad:**
- Competitor pricing (scraping Airbnb/Booking)
- Demand forecast (Google Trends API)
- Recommendations de pricing

**Flujo n8n:**
```
[Scheduled Trigger - Diario 8AM]
  → [Scrape Competitor Prices]
  → [Fetch Google Trends]
  → [OpenAI: Analyze + Recommendations]
  → [Save to Supabase: market_insights table]
  → [Notify Owner via Email]
```

**Checklist:**
- [ ] Web scraping (Puppeteer node en n8n)
- [ ] Google Trends API integration
- [ ] OpenAI analysis prompt
- [ ] Tabla `market_insights`
- [ ] Email con reporte

**Entregables:**
- `n8n_workflows/WF-IA-05-External-Agent.json`
- `supabase/migrations/006_market_insights.sql`

---

## ✅ FASE 3 - Criterios de Completitud

- [ ] VAPI agent "Ayu" respondiendo llamadas
- [ ] Bookings creados desde llamadas telefónicas
- [ ] WhatsApp Concierge respondiendo a huéspedes
- [ ] Internal Agent respondiendo queries en Dashboard
- [ ] External Agent enviando reportes diarios
- [ ] Todos los workflows testeados

---

# FASE 4: WORKFLOWS MEDIA PRIORIDAD 🟡
**Prioridad:** MEDIA
**Duración:** 16-27 horas | 3-5 días
**Dependencias:** Ninguna

## 4.1 Marketing & Growth Workflows (6-10h)

### WF-05: WhatsApp Marketing Funnel (2-3h)
**Descripción:** Captura leads y nurturing automático

**Flujo:**
```
[Lead captures via MySite/Instagram]
  → [Create contact in Supabase]
  → [Tag: cold_lead]
  → [Send WhatsApp: Intro message]
  → [Wait 2 days]
  → [Send: Property highlights + photos]
  → [Wait 3 days]
  → [Send: Special offer]
  → [If response → Tag: hot_lead]
```

**Entregables:**
- `n8n_workflows/WF-MARK-01-WhatsApp-Funnel.json`

---

### WF-06: Instagram Performance Sync (1-2h)
**Descripción:** Sincronizar métricas diarias de Instagram a Supabase

**Flujo:**
```
[Schedule: Daily 9AM]
  → [Instagram Graph API: Get metrics]
  → [Parse: followers, reach, engagement]
  → [Insert into instagram_metrics table]
```

**Entregables:**
- `n8n_workflows/WF-MARK-02-Instagram-Sync.json`
- Tabla `instagram_metrics`

---

### WF-07: Meta Ads Summary (1-2h)
**Descripción:** Resumen diario de campañas Meta Ads

**Flujo:**
```
[Schedule: Daily 10AM]
  → [Meta Ads API: Get campaign stats]
  → [Calculate: spend, impressions, conversions, ROI]
  → [Save to meta_ads_summary table]
  → [Send Email digest al owner]
```

**Entregables:**
- `n8n_workflows/WF-MARK-03-Meta-Ads-Summary.json`

---

### WF-08: AI Marketing Insights (2-3h)
**Descripción:** Análisis IA de datos de marketing

**Flujo:**
```
[Schedule: Weekly Monday 8AM]
  → [Fetch last week's data: Instagram + Meta Ads + Website]
  → [OpenAI: Analyze trends]
  → [Generate: Recommendations, A/B test ideas]
  → [Save to marketing_insights table]
  → [Notify owner]
```

**Entregables:**
- `n8n_workflows/WF-MARK-04-AI-Insights.json`

---

## 4.2 Communication Workflows (1-2h)

### WF-09: Send Email to Guest (1-2h)
**Descripción:** Envío de emails desde la app via SendGrid

**Funcionalidad:**
- Confirmación de reserva
- Pre-arrival instructions
- Post-checkout thank you
- Review request

**Flujo:**
```
[API Endpoint: /send-email]
  → [Recibe: guest_email, template_id, variables]
  → [SendGrid: Send email]
  → [Log to email_logs table]
```

**Entregables:**
- `n8n_workflows/WF-COMM-01-Send-Email.json`
- Templates en SendGrid

---

## 4.3 Content & Campaigns (6-10h)

### WF-10: Content Triggers (1-2h)
**Descripción:** Disparadores automáticos de contenido

**Triggers:**
- Nueva propiedad → Post en Instagram
- Review 5★ → Share en redes
- Milestone (100 bookings) → Celebratory post

**Entregables:**
- `n8n_workflows/WF-CONT-01-Content-Triggers.json`

---

### WF-11: Social Publishing (2-3h)
**Descripción:** Publicación automática en redes sociales

**Flujo:**
```
[Content Queue en Supabase]
  → [Schedule: Check every hour]
  → [If content.publish_at <= NOW]
      → [Post to Instagram API]
      → [Post to Facebook API]
      → [Mark as published]
```

**Entregables:**
- `n8n_workflows/WF-CONT-02-Social-Publishing.json`
- Tabla `content_queue`

---

### WF-12: Review Amplification (1-2h)
**Descripción:** Amplificar reseñas positivas

**Flujo:**
```
[New Review webhook]
  → [IF rating >= 4]
      → [Create social media post]
      → [Add to content_queue]
      → [Tag guest: brand_advocate]
```

**Entregables:**
- `n8n_workflows/WF-CONT-03-Review-Amplification.json`

---

### WF-13: WhatsApp Campaigns (2-3h)
**Descripción:** Campañas masivas de WhatsApp

**Uso:**
- Promociones especiales
- Last-minute deals
- Seasonal campaigns

**Flujo:**
```
[Campaign trigger from Dashboard]
  → [Fetch target segment from Supabase]
  → [For each contact]
      → [Personalize message]
      → [Send WhatsApp]
      → [Wait 30s (rate limit)]
  → [Log campaign results]
```

**Entregables:**
- `n8n_workflows/WF-CAMP-01-WhatsApp-Campaigns.json`

---

## 4.4 Enrichment Workflows (3-5h)

### WF-14: Internal Alert Flow (1-2h)
**Descripción:** Alertas internas al staff

**Alertas:**
- Payment failed
- Check-in sin confirmación (24h antes)
- Maintenance request urgente
- Negative review

**Flujo:**
```
[Event triggers]
  → [Create alert in Supabase]
  → [IF urgent]
      → [Send WhatsApp to staff]
  → [ELSE]
      → [Show in Dashboard]
```

**Entregables:**
- `n8n_workflows/WF-ENRICH-01-Internal-Alerts.json`

---

### WF-15: External Enrichment (2-3h)
**Descripción:** Enriquecimiento de datos externos

**Funcionalidad:**
- Guest lookup (LinkedIn, email validation)
- Property data (photos vía Google Places)
- Competitor intel

**Flujo:**
```
[New guest created]
  → [Email validation API]
  → [LinkedIn lookup (Clearbit)]
  → [Update guest profile with: company, title, photo]
```

**Entregables:**
- `n8n_workflows/WF-ENRICH-02-External-Data.json`

---

## ✅ FASE 4 - Criterios de Completitud

- [ ] 11 workflows desplegados en n8n
- [ ] Marketing funnel operativo
- [ ] Email sending funcional
- [ ] Social media automation working
- [ ] Alert system activo
- [ ] External enrichment enriqueciendo perfiles

---

# FASE 5: POLISH & WIDGETS 🟢
**Prioridad:** BAJA
**Duración:** 3-6 horas | 1 día
**Dependencias:** Requiere FASE 4 completada

## 5.1 Dashboard Widgets (3-6h)

### WF-16: Marketing Activity Widget (1-2h)
**Descripción:** Widget en Dashboard con actividad de marketing

**Muestra:**
- Últimas 5 campañas
- ROI total del mes
- Próximas publicaciones programadas

**Entregables:**
- Componente: `src/components/Dashboard/MarketingActivityWidget.jsx`
- API endpoint en n8n

---

### WF-17: Internal Alerts Widget (1-2h)
**Descripción:** Widget de alertas internas

**Muestra:**
- Alertas sin resolver
- Severidad (crítico, alto, medio, bajo)
- Quick actions

**Entregables:**
- Componente: `src/components/Dashboard/AlertsWidget.jsx`

---

### WF-18: Guest Insights Widget (1-2h)
**Descripción:** Widget de insights de huéspedes

**Muestra:**
- Top 3 guest segments
- Revenue por segmento
- Trends (crecimiento/decrecimiento)

**Entregables:**
- Componente: `src/components/Dashboard/GuestInsightsWidget.jsx`

---

## 5.2 Testing & Bug Fixes (2-3h)

**Checklist:**
- [ ] End-to-end testing de todos los flujos
- [ ] Performance testing
- [ ] Security audit
- [ ] Bug fixing
- [ ] Documentation update

**Entregables:**
- Test report
- Bug fix commits
- Updated README.md

---

## ✅ FASE 5 - Criterios de Completitud

- [ ] 3 widgets integrados en Dashboard
- [ ] Todos los bugs críticos resueltos
- [ ] Performance optimizado
- [ ] Documentación actualizada
- [ ] Sistema listo para producción

---

# 📊 TIMELINE CONSOLIDADO

## Estimación por Semanas

### **SEMANA 1-2: Infraestructura Base**
| Día | Fase | Tareas | Horas |
|-----|------|--------|-------|
| 1-2 | FASE 1 | Multi-Tenant: Audit + Schema | 4-6h |
| 3-4 | FASE 1 | RLS Policies + Auth Context | 5-7h |
| 5-6 | FASE 1 | Data Isolation + Testing | 5-7h |

**Total Semana 1-2:** 14-20 horas

---

### **SEMANA 3-4: Integraciones Críticas**
| Día | Fase | Tareas | Horas |
|-----|------|--------|-------|
| 7-8 | FASE 2.1 | Stripe: Setup + Payment Intent | 4-6h |
| 9-10 | FASE 2.1 | Stripe: Checkout UI + Webhooks | 6-8h |
| 11 | FASE 2.1 | Stripe: Payment Records | 2-3h |
| 12-13 | FASE 2.2 | DOMUS: Research + Auth | 4-6h |
| 14-16 | FASE 2.2 | DOMUS: Property + Booking Sync | 9-11h |
| 17-18 | FASE 2.2 | DOMUS: Calendar + Error Handling | 7-9h |

**Total Semana 3-4:** 32-43 horas

---

### **SEMANA 5: Workflows Alta Prioridad**
| Día | Fase | Tareas | Horas |
|-----|------|--------|-------|
| 19-20 | FASE 3 | VAPI Voice Agent "Ayu" | 3-4h |
| 21 | FASE 3 | WhatsApp Concierge | 2-3h |
| 22 | FASE 3 | Internal Agent | 2-3h |
| 23 | FASE 3 | External Agent | 2-3h |

**Total Semana 5:** 9-13 horas

---

### **SEMANA 6-7: Workflows Media Prioridad**
| Día | Fase | Tareas | Horas |
|-----|------|--------|-------|
| 24-25 | FASE 4.1 | Marketing Workflows (4) | 6-10h |
| 26 | FASE 4.2 | Communication (1) | 1-2h |
| 27-28 | FASE 4.3 | Content & Campaigns (4) | 6-10h |
| 29 | FASE 4.4 | Enrichment (2) | 3-5h |

**Total Semana 6-7:** 16-27 horas

---

### **SEMANA 8: Polish & Launch**
| Día | Fase | Tareas | Horas |
|-----|------|--------|-------|
| 30-31 | FASE 5 | Dashboard Widgets (3) | 3-6h |
| 32-33 | FASE 5 | Testing & Bug Fixes | 2-3h |

**Total Semana 8:** 5-9 horas

---

## 📅 Calendario Resumido

| Semana | Fase | Horas | Días Laborables |
|--------|------|-------|-----------------|
| 1-2 | Infraestructura Base | 14-20h | 3-4 días |
| 3-4 | Integraciones Críticas | 32-43h | 6-8 días |
| 5 | Workflows Alta Prioridad | 9-13h | 2-3 días |
| 6-7 | Workflows Media Prioridad | 16-27h | 3-5 días |
| 8 | Polish & Launch | 5-9h | 1-2 días |
| **TOTAL** | **5 Fases** | **76-112h** | **15-22 días** |

---

# 🎯 RESUMEN EJECUTIVO

## Por Categoría

| Categoría | Tareas | Horas Mín | Horas Máx | Prioridad |
|-----------|--------|-----------|-----------|-----------|
| **Multi-Tenant Architecture** | 6 | 14h | 20h | 🔴 CRÍTICA |
| **Stripe Payments** | 5 | 12h | 17h | 🔴 ALTA |
| **DOMUS Integration** | 6 | 20h | 26h | 🔴 ALTA |
| **n8n Workflows - Alta** | 4 | 9h | 13h | 🔴 ALTA |
| **n8n Workflows - Media** | 11 | 16h | 27h | 🟡 MEDIA |
| **n8n Workflows - Baja** | 3 | 3h | 6h | 🟢 BAJA |
| **Testing & Polish** | 2 | 2h | 3h | 🟢 BAJA |
| **TOTAL** | **37 tareas** | **76h** | **112h** | - |

---

## Por Prioridad

### 🔴 CRÍTICA/ALTA (55-76h)
1. Multi-Tenant Architecture (14-20h) - **BLOQUEANTE**
2. Stripe Payments (12-17h)
3. DOMUS Integration (20-26h)
4. n8n Workflows Alta Prioridad (9-13h)

**Resultado:** Sistema multi-tenant con pagos y sync PMS funcional

---

### 🟡 MEDIA (16-27h)
5. Marketing & Growth Workflows (6-10h)
6. Communication Workflows (1-2h)
7. Content & Campaigns (6-10h)
8. Enrichment (3-5h)

**Resultado:** Automatización completa de marketing y comunicaciones

---

### 🟢 BAJA (5-9h)
9. Dashboard Widgets (3-6h)
10. Testing & Polish (2-3h)

**Resultado:** UI pulido y sistema production-ready

---

## Escenarios de Tiempo

> **⚠️ ACTUALIZADO - VERSIÓN 2.0:** Estimaciones ajustadas a la realidad con debugging, testing e imprevistos incluidos.

### Estimación Original (Optimista - NO USAR)
| Escenario | Horas | Días (6h/día) | Días (8h/día) | Semanas |
|-----------|-------|---------------|---------------|---------|
| ~~Optimista~~ | ~~76h~~ | ~~13 días~~ | ~~10 días~~ | ~~2 semanas~~ |
| ~~Realista~~ | ~~94h~~ | ~~16 días~~ | ~~12 días~~ | ~~2.5 semanas~~ |
| ~~Con buffer~~ | ~~112h~~ | ~~19 días~~ | ~~14 días~~ | ~~3 semanas~~ |

### ✅ Estimación Realista V2.0 (USAR ESTA)
| Escenario | Horas | Días (5h/día) | Días (6h/día) | Semanas |
|-----------|-------|---------------|---------------|---------|
| **Optimista** | 200h | 40 días | 34 días | **6 semanas** |
| **Realista** | 225h | 45 días | 38 días | **7 semanas** |
| **Con buffer** | 250h | 50 días | 42 días | **8 semanas** |

**Progreso actual:** 30% completado (~90h invertidas)
**Progreso restante:** 70% (~200-250h por invertir)

**Fecha estimada de finalización:** Mediados de Febrero 2026 (si inicias en Enero)

---

## Hitos Clave (Milestones)

> **⚠️ ACTUALIZADO V2.0:** Hitos ajustados a timeline realista de 6-8 semanas

| Hito | Descripción | Semana Original | **Semana Realista** | Resultado |
|------|-------------|-----------------|---------------------|-----------|
| **M1** | Multi-Tenant Funcional | ~~Semana 2~~ | **Semana 2** | Sistema soporta múltiples clientes ✅ |
| **M2** | Payments Live | ~~Semana 3~~ | **Semana 3** | Cobros con Stripe operativos ✅ |
| **M3** | DOMUS Sincronizado | ~~Semana 4~~ | **Semana 5** | Propiedades y bookings en sync ✅ |
| **M4** | Agentes IA Live | ~~Semana 5~~ | **Semana 6** | VAPI + WhatsApp + Asistentes ✅ |
| **M5** | Marketing Automatizado | ~~Semana 7~~ | **Semana 7** | Campañas ejecutándose solas ✅ |
| **M6** | Production Ready | ~~Semana 8~~ | **Semana 8** | Sistema completo listo 🚀 |

**Nota:** Los hitos están bien espaciados en el timeline realista. La diferencia principal está en que cada semana tiene menos horas efectivas (25h vs 40h asumidas originalmente).

---

## Dependencias Críticas

### BLOQUEANTES
- **DOMUS API access** - Necesario para FASE 2.2
- **Stripe account approval** - Necesario para FASE 2.1
- **WhatsApp Business approval** - Necesario para workflows
- **VAPI account** - Necesario para voice agent

### RECOMENDACIONES
1. **Iniciar trámites YA:**
   - Aplicar a WhatsApp Business API (puede tardar 1-2 semanas)
   - Crear cuenta Stripe y verificar
   - Solicitar acceso DOMUS API
   - Crear cuenta VAPI

2. **Orden de ejecución:**
   - FASE 1 es BLOQUEANTE - debe completarse primero
   - FASE 2 y FASE 3 pueden ejecutarse en paralelo
   - FASE 4 y FASE 5 dependen de infraestructura base

3. **Recursos necesarios:**
   - 1 desarrollador full-time
   - Acceso a todas las APIs mencionadas
   - Budget para servicios (Stripe, VAPI, WhatsApp, n8n)

---

## Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| DOMUS API no disponible | Media | Alto | Tener PMS alternativo (Hostaway) |
| WhatsApp Business rechazado | Baja | Medio | Usar Twilio WhatsApp sandbox |
| Stripe compliance issues | Baja | Alto | Tener PayPal como backup |
| n8n Rate limits | Media | Bajo | Implementar retry logic robusto |
| Multi-tenant bugs | Alta | Crítico | Testing exhaustivo en FASE 1 |

---

## Próximos Pasos Inmediatos

### Esta Semana (Semana 1)
1. [ ] Iniciar aplicación WhatsApp Business API
2. [ ] Crear cuenta Stripe (modo test)
3. [ ] Solicitar documentación DOMUS API
4. [ ] Crear cuenta VAPI
5. [ ] **INICIAR FASE 1:** Multi-Tenant Architecture

### Semana Siguiente (Semana 2)
1. [ ] Completar FASE 1 (Multi-Tenant)
2. [ ] Testing exhaustivo de RLS
3. [ ] Iniciar FASE 2.1 (Stripe)

### Mes 1
- Completar FASES 1, 2 y 3
- Sistema multi-tenant con pagos y sync DOMUS
- Agentes IA operativos

### Mes 2
- Completar FASES 4 y 5
- Marketing automation completo
- Launch production

---

## KPIs de Éxito

| KPI | Objetivo | Métrica |
|-----|----------|---------|
| **Uptime** | 99.5%+ | Sistema disponible 24/7 |
| **Payment Success Rate** | 95%+ | Pagos procesados sin errores |
| **DOMUS Sync Accuracy** | 99%+ | Bookings sincronizados correctamente |
| **VAPI Call Completion** | 90%+ | Llamadas completadas sin errores |
| **WhatsApp Response Time** | <30s | Respuesta automática del concierge |
| **Marketing ROI** | 3x+ | $3 revenue por cada $1 en marketing |

---

## Recursos Adicionales

- **Documentación:** `docs/` folder
- **Migrations:** `supabase/migrations/`
- **n8n Workflows:** `n8n_workflows/`
- **Tests:** `tests/`
- **Deploy:** Vercel (frontend) + Railway (n8n)

---

**Última actualización:** 27 Diciembre 2025
**Versión:** 1.0
**Estado:** PLAN APROBADO - LISTO PARA EJECUCIÓN

---

## Aprobación

- [ ] Revisado por: José
- [ ] Aprobado por: José
- [ ] Presupuesto aprobado: __________
- [ ] Fecha de inicio: __________
- [ ] Fecha estimada de finalización: __________

---

**🚀 ¡Vamos a construir el mejor PMS del mercado!**
