# TABLAS SUPABASE - AUTOPILOT MODULE
## Especificación Completa para Claude AI

**Fecha:** 26 Enero 2026
**Proyecto:** MY HOST BizMate - AUTOPILOT MODULE
**Responsable Backend:** Claude AI (n8n + Supabase)
**Responsable Frontend:** Claude Code (React)

---

## 📋 RESUMEN EJECUTIVO

Este documento especifica las **4 tablas Supabase** necesarias para el módulo AUTOPILOT:

1. **`daily_summary`** - Métricas diarias generadas por WF-D3
2. **`autopilot_alerts`** - Alertas urgent/warning/info mostradas en dashboard
3. **`autopilot_actions`** - Acciones que requieren aprobación del owner
4. **`whatsapp_conversations`** - Tracking completo de mensajes BANYU

**División de Responsabilidades:**
- **Claude AI:** Crea tablas, escribe datos vía n8n workflows
- **Claude Code:** Lee datos para mostrar en frontend

---

## 🗄️ TABLA 1: `daily_summary`

### **Propósito:**
Almacenar el resumen diario generado por **WF-D3 Daily Owner Summary**. El owner puede ejecutarlo manualmente desde el botón "Generate Summary" o automáticamente vía CRON.

### **Schema SQL:**

```sql
CREATE TABLE daily_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  summary_date DATE NOT NULL,

  -- Métricas del día
  new_inquiries INTEGER DEFAULT 0,
  pending_payments INTEGER DEFAULT 0,
  confirmed_today INTEGER DEFAULT 0,
  checkins_today INTEGER DEFAULT 0,
  checkouts_today INTEGER DEFAULT 0,
  expired_holds INTEGER DEFAULT 0,

  -- Metadata
  generated_by VARCHAR(50) DEFAULT 'WF-D3', -- 'WF-D3' o 'manual'
  execution_mode VARCHAR(20) DEFAULT 'cron', -- 'cron' o 'manual'

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Índices y constraints
  CONSTRAINT unique_daily_summary UNIQUE (tenant_id, property_id, summary_date)
);

-- Índices para performance
CREATE INDEX idx_daily_summary_tenant ON daily_summary(tenant_id);
CREATE INDEX idx_daily_summary_property ON daily_summary(property_id);
CREATE INDEX idx_daily_summary_date ON daily_summary(summary_date DESC);

-- RLS (Row Level Security)
ALTER TABLE daily_summary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own summaries"
  ON daily_summary FOR SELECT
  USING (tenant_id = auth.uid());
```

### **Ejemplo INSERT (desde n8n WF-D3):**

```javascript
// Node: Supabase Insert
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "summary_date": "{{ $json.date }}",
  "new_inquiries": {{ $json.new_inquiries }},
  "pending_payments": {{ $json.pending_payments }},
  "confirmed_today": {{ $json.confirmed_today }},
  "checkins_today": {{ $json.checkins }},
  "checkouts_today": {{ $json.checkouts }},
  "expired_holds": {{ $json.expired }},
  "generated_by": "WF-D3",
  "execution_mode": "{{ $json.trigger_mode }}" // 'cron' o 'manual'
}
```

### **Ejemplo SELECT (desde Claude Code):**

```javascript
// En Autopilot.jsx - handleGenerateDailySummary()
const { data, error } = await supabase
  .from('daily_summary')
  .select('*')
  .eq('tenant_id', tenantId)
  .eq('property_id', propertyId)
  .eq('summary_date', today)
  .single();

if (data) {
  setTodayMetrics({
    newInquiries: data.new_inquiries,
    pendingPayments: data.pending_payments,
    confirmedBookings: data.confirmed_today,
    checkInsToday: data.checkins_today,
    expiredHolds: data.expired_holds
  });
}
```

---

## 🗄️ TABLA 2: `autopilot_alerts`

### **Propósito:**
Almacenar alertas críticas que el owner debe ver en el dashboard. Tipos: `urgent` (rojo), `warning` (amarillo), `info` (azul).

### **Schema SQL:**

```sql
CREATE TABLE autopilot_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,

  -- Contenido de la alerta
  alert_type VARCHAR(20) NOT NULL, -- 'urgent', 'warning', 'info'
  message TEXT NOT NULL,
  details JSONB, -- Datos adicionales (booking_id, guest_name, etc.)

  -- Origen de la alerta
  source VARCHAR(100), -- 'WF-D2 Payment', 'WF-D1 Inquiry', 'BANYU', etc.
  reference_id UUID, -- ID del booking/lead/conversation relacionado

  -- Estado
  is_viewed BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint
  CONSTRAINT valid_alert_type CHECK (alert_type IN ('urgent', 'warning', 'info'))
);

-- Índices
CREATE INDEX idx_alerts_tenant ON autopilot_alerts(tenant_id);
CREATE INDEX idx_alerts_property ON autopilot_alerts(property_id);
CREATE INDEX idx_alerts_type ON autopilot_alerts(alert_type);
CREATE INDEX idx_alerts_unresolved ON autopilot_alerts(is_resolved, created_at DESC);

-- RLS
ALTER TABLE autopilot_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts"
  ON autopilot_alerts FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can update their own alerts"
  ON autopilot_alerts FOR UPDATE
  USING (tenant_id = auth.uid());
```

### **Ejemplo INSERT (desde n8n WF-D2 Payment Protection):**

```javascript
// Node: Create Alert - Payment Expiring
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "alert_type": "urgent",
  "message": "{{ $json.total_expiring }} bookings with payment expiring in < 4 hours",
  "details": {
    "bookings": {{ $json.expiring_bookings }},
    "threshold": "4 hours"
  },
  "source": "WF-D2 Payment Protection",
  "reference_id": null
}
```

### **Ejemplo SELECT (desde Claude Code):**

```javascript
// En Autopilot.jsx - Daily View
const { data: alerts } = await supabase
  .from('autopilot_alerts')
  .select('*')
  .eq('tenant_id', tenantId)
  .eq('property_id', propertyId)
  .eq('is_resolved', false)
  .order('created_at', { ascending: false })
  .limit(10);

// Agrupar por tipo
const urgentAlerts = alerts.filter(a => a.alert_type === 'urgent');
const warningAlerts = alerts.filter(a => a.alert_type === 'warning');
const infoAlerts = alerts.filter(a => a.alert_type === 'info');
```

---

## 🗄️ TABLA 3: `autopilot_actions`

### **Propósito:**
Almacenar acciones propuestas por AUTOPILOT que requieren **aprobación/rechazo del owner**. Ejemplos: liberar fechas de hold expirado, aprobar descuento, aceptar early check-in.

### **Schema SQL:**

```sql
CREATE TABLE autopilot_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,

  -- Información de la acción
  action_type VARCHAR(50) NOT NULL, -- 'payment_expired', 'special_request', 'pricing_discount', 'task_ops'
  category VARCHAR(50), -- 'booking', 'payment', 'guest_service', 'operations'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,

  -- Contexto
  guest_name VARCHAR(255),
  booking_reference VARCHAR(100),
  related_id UUID, -- ID del booking/lead/task relacionado

  -- Datos de la acción propuesta
  proposed_action JSONB NOT NULL, -- Detalles específicos de qué se propone hacer

  -- Estado
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  decision_made_at TIMESTAMPTZ,
  decision_made_by UUID,
  decision_notes TEXT,

  -- Origen
  source VARCHAR(100), -- 'WF-D2 Payment', 'WF-D1 Inquiry', 'Manual Entry', etc.

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint
  CONSTRAINT valid_action_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Índices
CREATE INDEX idx_actions_tenant ON autopilot_actions(tenant_id);
CREATE INDEX idx_actions_property ON autopilot_actions(property_id);
CREATE INDEX idx_actions_status ON autopilot_actions(status);
CREATE INDEX idx_actions_pending ON autopilot_actions(status, created_at DESC) WHERE status = 'pending';

-- RLS
ALTER TABLE autopilot_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own actions"
  ON autopilot_actions FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can update their own actions"
  ON autopilot_actions FOR UPDATE
  USING (tenant_id = auth.uid());
```

### **Ejemplo INSERT (desde n8n WF-D2 - Payment Expired):**

```javascript
// Node: Create Action - Release Dates
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "action_type": "payment_expired",
  "category": "booking",
  "title": "Payment Expired - Release Dates",
  "description": "Release dates after 24h hold expired",
  "guest_name": "{{ $json.guest_name }}",
  "booking_reference": "{{ $json.booking_reference }}",
  "related_id": "{{ $json.booking_id }}",
  "proposed_action": {
    "action": "release_hold",
    "booking_id": "{{ $json.booking_id }}",
    "dates": {
      "check_in": "{{ $json.check_in }}",
      "check_out": "{{ $json.check_out }}"
    },
    "expiration_time": "{{ $json.hold_expired_at }}"
  },
  "source": "WF-D2 Payment Protection",
  "status": "pending"
}
```

### **Ejemplo SELECT + UPDATE (desde Claude Code):**

```javascript
// En Autopilot.jsx - Fetch pending actions
const { data: pendingActions } = await supabase
  .from('autopilot_actions')
  .select('*')
  .eq('tenant_id', tenantId)
  .eq('property_id', propertyId)
  .eq('status', 'pending')
  .order('created_at', { ascending: false });

// Approve action
const handleApprove = async (actionId) => {
  const { error } = await supabase
    .from('autopilot_actions')
    .update({
      status: 'approved',
      decision_made_at: new Date().toISOString(),
      decision_made_by: userId
    })
    .eq('id', actionId);

  if (!error) {
    // Llamar webhook para ejecutar la acción
    await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/approve', {
      method: 'POST',
      body: JSON.stringify({ action_id: actionId })
    });
  }
};
```

---

## 🗄️ TABLA 4: `whatsapp_conversations`

### **Propósito:**
Almacenar **todas las conversaciones de WhatsApp** gestionadas por **BANYU.AI**. Permite al owner ver qué ha respondido BANYU y hacer seguimiento completo.

### **Schema SQL:**

```sql
CREATE TABLE whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,

  -- Identificación del contacto
  contact_phone VARCHAR(50) NOT NULL,
  contact_name VARCHAR(255),
  contact_id UUID, -- Si existe en la tabla contacts/guests

  -- Mensaje
  message_direction VARCHAR(10) NOT NULL, -- 'inbound', 'outbound'
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'document', 'audio'
  media_url TEXT,

  -- Contexto
  conversation_stage VARCHAR(50), -- 'inquiry', 'negotiation', 'booking', 'confirmed', 'post_stay'
  lead_id UUID, -- Si está vinculado a un lead
  booking_id UUID, -- Si está vinculado a un booking

  -- Metadata BANYU
  handled_by VARCHAR(50) DEFAULT 'BANYU', -- 'BANYU' o 'human'
  banyu_confidence FLOAT, -- 0.0 a 1.0 (qué tan seguro está BANYU de la respuesta)
  requires_human_review BOOLEAN DEFAULT FALSE,

  -- WhatsApp API metadata
  whatsapp_message_id VARCHAR(255),
  whatsapp_timestamp TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint
  CONSTRAINT valid_direction CHECK (message_direction IN ('inbound', 'outbound'))
);

-- Índices
CREATE INDEX idx_whatsapp_tenant ON whatsapp_conversations(tenant_id);
CREATE INDEX idx_whatsapp_property ON whatsapp_conversations(property_id);
CREATE INDEX idx_whatsapp_contact ON whatsapp_conversations(contact_phone);
CREATE INDEX idx_whatsapp_lead ON whatsapp_conversations(lead_id);
CREATE INDEX idx_whatsapp_booking ON whatsapp_conversations(booking_id);
CREATE INDEX idx_whatsapp_timestamp ON whatsapp_conversations(created_at DESC);
CREATE INDEX idx_whatsapp_review ON whatsapp_conversations(requires_human_review) WHERE requires_human_review = TRUE;

-- RLS
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON whatsapp_conversations FOR SELECT
  USING (tenant_id = auth.uid());
```

### **Ejemplo INSERT (desde n8n - BANYU Workflow):**

```javascript
// Node: Save Inbound Message
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "contact_phone": "{{ $json.from }}",
  "contact_name": "{{ $json.contact_name }}",
  "message_direction": "inbound",
  "message_text": "{{ $json.body }}",
  "message_type": "text",
  "conversation_stage": "inquiry",
  "handled_by": "BANYU",
  "banyu_confidence": 0.95,
  "requires_human_review": false,
  "whatsapp_message_id": "{{ $json.message_id }}",
  "whatsapp_timestamp": "{{ $json.timestamp }}"
}

// Node: Save BANYU Response
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "contact_phone": "{{ $json.to }}",
  "contact_name": "{{ $json.contact_name }}",
  "message_direction": "outbound",
  "message_text": "{{ $json.banyu_response }}",
  "message_type": "text",
  "conversation_stage": "{{ $json.stage }}",
  "lead_id": "{{ $json.lead_id }}",
  "booking_id": "{{ $json.booking_id }}",
  "handled_by": "BANYU",
  "banyu_confidence": {{ $json.confidence }},
  "requires_human_review": {{ $json.needs_review }}
}
```

### **Ejemplo SELECT (desde Claude Code):**

```javascript
// En Autopilot.jsx - WhatsApp Tracking Section
const { data: conversations } = await supabase
  .from('whatsapp_conversations')
  .select('*')
  .eq('tenant_id', tenantId)
  .eq('property_id', propertyId)
  .gte('created_at', todayStart)
  .order('created_at', { ascending: false });

// Agrupar por contacto
const groupedByContact = conversations.reduce((acc, msg) => {
  if (!acc[msg.contact_phone]) {
    acc[msg.contact_phone] = {
      contact_name: msg.contact_name,
      contact_phone: msg.contact_phone,
      messages: []
    };
  }
  acc[msg.contact_phone].messages.push(msg);
  return acc;
}, {});

// Filtrar solo conversaciones que requieren revisión
const needsReview = conversations.filter(c => c.requires_human_review);
```

---

## 🔄 COORDINACIÓN CLAUDE AI ↔ CLAUDE CODE

### **Checklist para Claude AI:**

- [ ] **Paso 1:** Crear las 4 tablas en Supabase (ejecutar SQL de este documento)
- [ ] **Paso 2:** Modificar **WF-D3 Daily Summary** para:
  - Aceptar webhook POST en `/webhook/autopilot/daily-summary`
  - Devolver JSON (en vez de texto)
  - Guardar resultado en tabla `daily_summary`
- [ ] **Paso 3:** Modificar **BANYU Workflow** para:
  - Guardar todos los mensajes en `whatsapp_conversations`
  - Marcar `requires_human_review = TRUE` cuando confidence < 0.7
- [ ] **Paso 4:** Implementar **WF-D1 Always-On Inquiries** para:
  - Crear alertas en `autopilot_alerts` cuando llegan nuevos leads
- [ ] **Paso 5:** Implementar **WF-D2 Payment Protection** para:
  - Crear acciones en `autopilot_actions` cuando hold está por expirar
  - Crear alertas en `autopilot_alerts` a las 6h, 20h, 24h
- [ ] **Paso 6:** Crear webhook `/webhook/autopilot/approve` para:
  - Recibir `action_id` desde frontend
  - Ejecutar la acción aprobada (liberar fechas, aplicar descuento, etc.)
- [ ] **Paso 7:** Pasar schema final a Claude Code para integración

### **Checklist para Claude Code:**

- [x] **Paso 1:** Crear componentes UI (ManualDataEntry + Autopilot Dashboard)
- [x] **Paso 2:** Implementar botón "Generate Summary" que llama webhook WF-D3
- [ ] **Paso 3 (Esperar):** Una vez Claude AI cree las tablas:
  - Reemplazar datos demo con queries reales a Supabase
  - Implementar fetch de `daily_summary`
  - Implementar fetch de `autopilot_alerts`
  - Implementar fetch de `autopilot_actions`
  - Implementar fetch de `whatsapp_conversations`
- [ ] **Paso 4:** Conectar botones Approve/Reject a webhook `/webhook/autopilot/approve`
- [ ] **Paso 5:** Implementar sección WhatsApp Tracking en Daily View
- [ ] **Paso 6:** Testing end-to-end con datos reales

---

## 📌 NOTAS IMPORTANTES

### **Multi-Tenant:**
Todas las tablas tienen `tenant_id` y `property_id` para soporte multi-tenant. SIEMPRE usar en WHERE clauses:

```sql
WHERE tenant_id = $1 AND property_id = $2
```

### **RLS (Row Level Security):**
Todas las tablas tienen RLS habilitado para seguridad. Los owners solo pueden ver/modificar sus propios datos.

### **Índices:**
Se crearon índices optimizados para las queries más comunes. Monitorear performance en producción.

### **JSONB Columns:**
- `autopilot_alerts.details` - Permite guardar contexto adicional flexible
- `autopilot_actions.proposed_action` - Permite acciones complejas sin cambiar schema

### **Timestamps:**
Todas las tablas tienen `created_at` y `updated_at` para auditoría.

---

## 🚀 FLUJO COMPLETO - EJEMPLO

### **Escenario:** Owner ejecuta "Generate Summary" a las 18:00

1. **Frontend (Claude Code):**
   - Usuario hace clic en botón "Generate Summary"
   - Fetch a `POST /webhook/autopilot/daily-summary`

2. **n8n WF-D3 (Claude AI):**
   - Recibe webhook POST
   - Query Supabase: cuenta leads hoy, bookings confirmados, check-ins, etc.
   - **Inserta** en `daily_summary` tabla
   - **Inserta** alertas urgentes en `autopilot_alerts` (ej: "3 payments expiring")
   - **Devuelve JSON:**
     ```json
     {
       "success": true,
       "new_inquiries": 8,
       "pending_payments": 3,
       "confirmed_today": 2,
       "checkins": 5,
       "expired": 1
     }
     ```

3. **Frontend (Claude Code):**
   - Recibe JSON
   - **Lee** de `daily_summary` tabla (SELECT más reciente)
   - **Lee** de `autopilot_alerts` (SELECT WHERE is_resolved = FALSE)
   - **Lee** de `autopilot_actions` (SELECT WHERE status = 'pending')
   - Actualiza UI con datos reales
   - Muestra "Last updated: 18:00:23"

4. **Owner revisa:**
   - Ve KPIs actualizados
   - Ve 3 alertas (2 urgent, 1 warning)
   - Ve 2 acciones pendientes de aprobación
   - Hace clic en "Approve" para liberar fechas de hold expirado

5. **Frontend → Webhook:**
   - Fetch a `POST /webhook/autopilot/approve`
   - Body: `{ "action_id": "uuid-123" }`

6. **n8n (Claude AI):**
   - Recibe webhook
   - Lee acción de `autopilot_actions`
   - Ejecuta acción (UPDATE booking status = 'cancelled')
   - **Actualiza** `autopilot_actions` SET status = 'approved'

---

**Fin del Documento**

Este documento debe ser suficiente para que Claude AI implemente todo el backend de AUTOPILOT en Supabase + n8n.

**Contacto:** Claude Code (Frontend) ↔ Claude AI (Backend)
