# OSIRIS MVP - BRIEF TÉCNICO COMPLETO
## MY HOST BizMate - Owner Operations & Control Agent
**Fecha:** 21 Enero 2026
**Versión:** MVP (Minimum Viable Product)
**Responsable:** Claude AI (n8n + Supabase)
**Colaborador Frontend:** Claude Code (UI para consumir JSON)
**Timeline:** 2-3 días

---

## 🎯 OBJETIVO

Crear **OSIRIS MVP**: agente AI que permite al propietario del hotel:
- Consultar estado del negocio en lenguaje natural
- Obtener KPIs ejecutivos en tiempo real
- Ver listas/tablas de datos (pagos, check-ins, bookings)
- Proponer acciones (enviar recordatorios WhatsApp) con confirmación
- TODO con seguridad multi-tenant y auditoría

**Principio fundamental:** OSIRIS NO ejecuta SQL libre, solo usa "tools" controladas (RPCs + SELECTs seguros).

---

## 📋 CONTEXTO DEL PROYECTO

### Sistema Actual
- **Supabase:** PostgreSQL con datos reales (properties, bookings, guests, payments, leads)
- **n8n:** Railway - https://n8n-production-bb2d.up.railway.app
- **AI Agents existentes:**
  - KORA (Voice) ✅ Funcionando
  - BANYU (WhatsApp) ✅ Funcionando
  - OSIRIS (Owner) ⏳ A crear ahora (MVP)

### Tenant Piloto
- **Tenant ID:** `c24393db-d318-4d75-8bbf-0fa240b9c1db` (Izumi Hotel)
- **Property ID:** `18711359-1378-4d12-9ea6-fb31c0b1bac2`

---

## 🗄️ SCHEMA SUPABASE ACTUAL (TABLAS EXISTENTES)

### Tablas Core (YA EXISTEN - NO CREAR)
```sql
-- 1. PROPERTIES
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  tenant_id UUID, -- ⚠️ Pendiente añadir RLS (próximas semanas)
  name TEXT,
  location TEXT,
  base_price DECIMAL,
  status TEXT, -- 'active', 'inactive'
  created_at TIMESTAMPTZ
);

-- 2. BOOKINGS
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT, -- 'confirmed', 'pending', 'cancelled'
  source TEXT, -- 'booking.com', 'airbnb', 'direct', etc.
  created_at TIMESTAMPTZ
);

-- 3. PAYMENTS
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL,
  status TEXT, -- 'pending', 'paid', 'refunded'
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ
);

-- 4. GUESTS
CREATE TABLE guests (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  nationality TEXT,
  total_stays INTEGER DEFAULT 0,
  total_spent DECIMAL DEFAULT 0,
  created_at TIMESTAMPTZ
);

-- 5. LEADS
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  name TEXT,
  phone TEXT,
  email TEXT,
  status TEXT, -- 'new', 'contacted', 'qualified', 'won', 'lost'
  source TEXT, -- 'whatsapp', 'vapi', 'web', etc.
  created_at TIMESTAMPTZ
);

-- 6. AI_CONVERSATIONS (YA EXISTE - para otros agentes)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  agent_type TEXT, -- 'kora', 'banyu', 'osiris'
  conversation_data JSONB,
  created_at TIMESTAMPTZ
);

-- 7. ACTIVE_ALERTS (YA EXISTE)
CREATE TABLE active_alerts (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  alert_type TEXT,
  severity TEXT, -- 'low', 'medium', 'high', 'critical'
  message TEXT,
  status TEXT, -- 'active', 'resolved'
  created_at TIMESTAMPTZ
);
```

### RPCs Existentes (USAR EN OSIRIS)
```sql
-- Ya creadas por Claude AI (funcionando):
✅ get_osiris_stats(tenant_id) → KPIs dashboard
✅ get_lumina_stats(tenant_id) → Stats LUMINA
✅ get_banyu_stats(tenant_id) → Stats BANYU
✅ get_kora_stats(tenant_id) → Stats KORA
✅ get_active_alerts(tenant_id) → Alertas activas
```

---

## 🆕 TABLAS NUEVAS A CREAR (MVP)

### 1. AI_CHAT_HISTORY (CRÍTICA - para logging)
```sql
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  user_id UUID, -- usuario que pregunta
  session_id TEXT NOT NULL, -- para agrupar conversaciones
  agent_id TEXT NOT NULL, -- 'osiris', 'banyu', 'kora'
  user_message TEXT NOT NULL,
  assistant_reply TEXT NOT NULL,
  intent TEXT, -- 'insight', 'list', 'action'
  meta JSONB, -- {sources: ['rpc:get_osiris_stats'], execution_id: '...', ...}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_history_tenant ON ai_chat_history(tenant_id);
CREATE INDEX idx_ai_chat_history_session ON ai_chat_history(session_id);
CREATE INDEX idx_ai_chat_history_agent ON ai_chat_history(agent_id);
```

### 2. AUDIT_LOGS (RECOMENDADA - para seguridad)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  actor_id UUID, -- user_id o 'system'
  action TEXT NOT NULL, -- 'ai_query', 'execute_action', 'data_access'
  agent_id TEXT, -- 'osiris', 'banyu', 'kora', null
  entity_type TEXT, -- 'booking', 'payment', 'property', null
  entity_id UUID, -- id del recurso accedido
  details JSONB, -- {query: '...', sources: [...], result_count: 14}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

**Nota:** Estas 2 tablas son suficientes para MVP. NO crear `tasks`, `issues`, `workflow_executions` aún (Fase 2).

---

## 🔧 TOOLS OSIRIS MVP (6 TOOLS)

### OSIRIS-T01: get_dashboard_stats
**Propósito:** KPIs ejecutivos del dashboard
**Fuente:** RPC `get_osiris_stats(tenant_id)` - **YA EXISTE**
**Parámetros:**
- tenant_id (obligatorio)

**Retorna:**
```json
{
  "total_revenue": 380050,
  "occupancy_rate": 53.47,
  "active_bookings": 77,
  "pending_payments_count": 14,
  "avg_daily_rate": 250,
  "revenue_growth": 12
}
```

**Implementación en n8n:**
- Nodo Supabase: Execute Query
- Query: `SELECT * FROM get_osiris_stats($1)`
- Parámetros: `[{{ $json.tenant_id }}]`

---

### OSIRIS-T02: list_pending_payments
**Propósito:** Listar pagos pendientes (para recordatorios)
**Fuente:** Tabla `payments` con JOIN a `bookings`
**Parámetros:**
- tenant_id (obligatorio)
- limit (default: 50)
- days_overdue (opcional: filtra solo atrasados N días)

**Query SQL:**
```sql
SELECT
  p.id as payment_id,
  p.amount,
  p.due_date,
  p.status,
  b.guest_name,
  b.guest_phone,
  b.guest_email,
  b.id as booking_id,
  (CURRENT_DATE - p.due_date) as days_overdue
FROM payments p
JOIN bookings b ON p.booking_id = b.id
WHERE p.status = 'pending'
  AND b.property_id IN (
    SELECT id FROM properties WHERE tenant_id = $1
  )
ORDER BY p.due_date ASC
LIMIT $2;
```

**Retorna:**
```json
[
  {
    "payment_id": "uuid",
    "amount": 500,
    "due_date": "2026-01-15",
    "days_overdue": 6,
    "guest_name": "John Doe",
    "guest_phone": "+1234567890",
    "guest_email": "john@example.com",
    "booking_id": "uuid"
  }
]
```

---

### OSIRIS-T03: list_checkins_checkouts
**Propósito:** Check-ins y check-outs de hoy/mañana
**Fuente:** Tabla `bookings`
**Parámetros:**
- tenant_id (obligatorio)
- date (default: TODAY, también acepta 'tomorrow', 'YYYY-MM-DD')
- type (opcional: 'checkin', 'checkout', 'both')

**Query SQL:**
```sql
SELECT
  id as booking_id,
  guest_name,
  guest_phone,
  property_id,
  check_in,
  check_out,
  status,
  total_price
FROM bookings
WHERE property_id IN (
    SELECT id FROM properties WHERE tenant_id = $1
  )
  AND status = 'confirmed'
  AND (
    -- Check-ins
    ($3 = 'checkin' OR $3 = 'both') AND check_in = $2
    OR
    -- Check-outs
    ($3 = 'checkout' OR $3 = 'both') AND check_out = $2
  )
ORDER BY check_in, check_out;
```

**Retorna:**
```json
[
  {
    "booking_id": "uuid",
    "guest_name": "Jane Smith",
    "guest_phone": "+34619794604",
    "property_id": "uuid",
    "check_in": "2026-01-21",
    "check_out": "2026-01-25",
    "status": "confirmed",
    "total_price": 1200
  }
]
```

---

### OSIRIS-T04: list_bookings
**Propósito:** Listar bookings con filtros básicos
**Fuente:** Tabla `bookings`
**Parámetros:**
- tenant_id (obligatorio)
- status (opcional: 'confirmed', 'pending', 'cancelled', 'all')
- date_from (opcional: YYYY-MM-DD)
- date_to (opcional: YYYY-MM-DD)
- limit (default: 50)

**Query SQL:**
```sql
SELECT
  b.id,
  b.guest_name,
  b.guest_phone,
  b.guest_email,
  b.check_in,
  b.check_out,
  b.total_price,
  b.status,
  b.source,
  p.name as property_name
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE p.tenant_id = $1
  AND ($2 = 'all' OR b.status = $2)
  AND ($3::date IS NULL OR b.check_in >= $3)
  AND ($4::date IS NULL OR b.check_out <= $4)
ORDER BY b.check_in DESC
LIMIT $5;
```

**Retorna:** Array de bookings con propiedades

---

### OSIRIS-T05: get_active_alerts
**Propósito:** Alertas y anomalías activas
**Fuente:** RPC `get_active_alerts(tenant_id)` - **YA EXISTE**
**Parámetros:**
- tenant_id (obligatorio)

**Retorna:**
```json
[
  {
    "id": "uuid",
    "alert_type": "payment_overdue",
    "severity": "high",
    "message": "3 payments overdue > 7 days",
    "status": "active",
    "created_at": "2026-01-20T10:30:00Z"
  }
]
```

---

### OSIRIS-T06: propose_whatsapp_reminder
**Propósito:** NO ejecuta, solo prepara payload para /ai/action
**Fuente:** Lógica (no query)
**Parámetros:**
- payment_ids (array de UUIDs)
- message_template (opcional: 'payment_reminder', 'checkin_reminder', 'custom')
- custom_message (opcional: texto libre si template='custom')

**Retorna:**
```json
{
  "action_id": "send_whatsapp_payment_reminder",
  "label": "Enviar recordatorio por WhatsApp",
  "needs_confirm": true,
  "payload": {
    "payment_ids": ["uuid1", "uuid2"],
    "message_template": "payment_reminder",
    "custom_message": null
  }
}
```

**Nota:** Esta tool NO ejecuta, solo construye el objeto `action` que el LLM retorna al frontend.

---

## 🔄 WORKFLOW N8N: WF-OSIRIS-MVP

### Arquitectura Recomendada
**Opción A (Recomendada):** Integrar en WF-AI-ROUTER existente
- Webhook: `POST /ai/chat`
- Switch: agent_id = 'osiris' → sub-flujo OSIRIS

**Opción B (Alternativa):** Workflow dedicado
- Webhook: `POST /ai/osiris/chat`
- Flujo independiente

**Ambas son válidas. Elige la que prefieras.**

---

### NODOS OSIRIS (Secuencia Exacta)

```
NODO 1: Webhook / Entrada desde Router
├─ Trigger: POST /ai/chat con agent_id='osiris'
├─ Body esperado:
│  {
│    "tenant_id": "uuid",
│    "user_id": "uuid",
│    "session_id": "string",
│    "agent_id": "osiris",
│    "message": "¿Cómo va la ocupación?",
│    "page_context": { "module": "overview", "route": "/" } (opcional)
│  }
└─ Validar: tenant_id, user_id, session_id, message obligatorios

NODO 2: Validate & Normalize Input (Function)
├─ Validar campos obligatorios
├─ Normalizar message (trim, lowercase para keywords)
├─ Detectar date_range si menciona "hoy", "esta semana", "este mes"
├─ Detectar intent_hint: "kpi" si pregunta estado, "list" si pide listar
└─ Si falta algo obligatorio → Respond 400 JSON

NODO 3: Get Owner Context (Supabase + Set)
├─ Ejecutar get_osiris_stats(tenant_id) → KPIs snapshot
├─ Ejecutar get_active_alerts(tenant_id) → Alertas count
├─ Construir "owner_context":
│  {
│    "kpis": { revenue, occupancy, active_bookings, pending_payments_count },
│    "alerts_count": 3,
│    "tenant_id": "..."
│  }
└─ Esto alimenta al LLM sin hacer 20 queries

NODO 4: Build OSIRIS System Prompt (Set)
├─ Instrucciones del agente:
│  "Eres OSIRIS, director de operaciones de MY HOST BizMate.
│   Tu rol: responder al propietario del hotel con información clara y accionable.
│
│   REGLAS ESTRICTAS:
│   - NO uses SQL directo, SOLO tools disponibles
│   - Si es pregunta de estado: devuelve KPIs
│   - Si el usuario pide listado: devuelve table (máximo 50 filas)
│   - Si el usuario pide una ACCIÓN: NO ejecutes, devuelve actions[] con needs_confirm=true
│   - Si faltan datos: pide solo lo mínimo necesario
│   - Siempre responde en JSON siguiendo el contrato (ver abajo)
│
│   CONTEXTO ACTUAL:
│   - Revenue: ${{ $('Get Owner Context').item.json.kpis.total_revenue }}
│   - Ocupación: {{ $('Get Owner Context').item.json.kpis.occupancy_rate }}%
│   - Reservas activas: {{ $('Get Owner Context').item.json.kpis.active_bookings }}
│   - Pagos pendientes: {{ $('Get Owner Context').item.json.kpis.pending_payments_count }}
│   - Alertas activas: {{ $('Get Owner Context').item.json.alerts_count }}
│
│   TOOLS DISPONIBLES (úsalas cuando sea necesario):
│   1. get_dashboard_stats - KPIs completos
│   2. list_pending_payments - Pagos pendientes con filtros
│   3. list_checkins_checkouts - Check-ins/outs de fecha específica
│   4. list_bookings - Listar reservas con filtros
│   5. get_active_alerts - Alertas y anomalías
│   6. propose_whatsapp_reminder - Proponer envío WhatsApp (NO ejecuta)
│
│   OUTPUT FORMAT (OBLIGATORIO):
│   {
│     'reply': 'Respuesta en texto claro',
│     'agent': 'osiris',
│     'intent': 'insight|list|action',
│     'kpis': [{ label, value, delta }] (opcional),
│     'table': { columns, rows, row_count } (opcional),
│     'actions': [{ id, label, needs_confirm, payload }] (opcional),
│     'meta': { module, route, execution_id, sources: ['rpc:get_osiris_stats'] }
│   }"
│
└─ Variable: system_prompt

NODO 5: AI Agent (Claude Sonnet 4) con Tools
├─ Model: Claude 3.5 Sonnet (o superior)
├─ System: {{ $('Build OSIRIS System Prompt').item.json.system_prompt }}
├─ User Message: {{ $json.message }}
├─ Tools: Las 6 tools OSIRIS (definir cada una como function tool)
├─ Output: JSON directo (configurar response_format: json_object si API lo soporta)
└─ Max tokens: 4000

NODO 6: Parse & Normalize AI Output (Function)
├─ Validar que el JSON tiene campos obligatorios:
│  - reply existe y no está vacío
│  - agent = 'osiris'
│  - intent en ['insight', 'list', 'action']
├─ Añadir meta si falta:
│  - execution_id = n8n execution ID
│  - sources = extraer de tool_calls usados
│  - timestamp = NOW()
├─ Si table existe:
│  - Validar columns y rows
│  - row_count = rows.length
│  - Truncar a 50 filas si excede
└─ Si hay errores de formato → construir JSON de error estándar

NODO 7: Log to ai_chat_history (Supabase Insert)
├─ Tabla: ai_chat_history
├─ Datos:
│  {
│    "tenant_id": "{{ $json.tenant_id }}",
│    "user_id": "{{ $json.user_id }}",
│    "session_id": "{{ $json.session_id }}",
│    "agent_id": "osiris",
│    "user_message": "{{ $json.message }}",
│    "assistant_reply": "{{ $('Parse & Normalize AI Output').item.json.reply }}",
│    "intent": "{{ $('Parse & Normalize AI Output').item.json.intent }}",
│    "meta": {{ $('Parse & Normalize AI Output').item.json.meta }} (JSONB)
│  }
└─ Importante: No fallar workflow si insert falla (log error pero continuar)

NODO 8: Log to audit_logs (Supabase Insert)
├─ Tabla: audit_logs
├─ Datos:
│  {
│    "tenant_id": "{{ $json.tenant_id }}",
│    "actor_id": "{{ $json.user_id }}",
│    "action": "ai_query",
│    "agent_id": "osiris",
│    "entity_type": null,
│    "entity_id": null,
│    "details": {
│      "query": "{{ $json.message }}",
│      "sources": {{ $('Parse & Normalize AI Output').item.json.meta.sources }},
│      "intent": "{{ $('Parse & Normalize AI Output').item.json.intent }}",
│      "result_count": {{ $('Parse & Normalize AI Output').item.json.table.row_count || 0 }}
│    }
│  }
└─ Importante: No fallar workflow si insert falla

NODO 9: Respond to Webhook (HTTP Response)
├─ Status: 200
├─ Body: {{ $('Parse & Normalize AI Output').item.json }}
└─ Headers: { "Content-Type": "application/json" }
```

---

## 📤 CONTRATO JSON (ENTRADA/SALIDA)

### ENTRADA (App → n8n)
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "user_id": "uuid-del-propietario",
  "session_id": "session-abc123",
  "agent_id": "osiris",
  "message": "¿Cómo va la ocupación hoy?",
  "page_context": {
    "module": "overview",
    "route": "/"
  }
}
```

### SALIDA (n8n → App)
```json
{
  "reply": "Hoy tienes 77 reservas activas con ocupación del 53.47%. Revenue total: $380,050 (+12% vs mes pasado). Hay 14 pagos pendientes.",
  "agent": "osiris",
  "intent": "insight",
  "kpis": [
    {
      "label": "Total Revenue",
      "value": "$380,050",
      "delta": "+12%"
    },
    {
      "label": "Occupancy",
      "value": "53.47%",
      "delta": "+5%"
    },
    {
      "label": "Active Bookings",
      "value": "77",
      "delta": "+8"
    },
    {
      "label": "Pending Payments",
      "value": "14",
      "delta": "+2"
    }
  ],
  "table": null,
  "actions": null,
  "meta": {
    "module": "overview",
    "route": "/",
    "execution_id": "n8n-exec-12345",
    "sources": ["rpc:get_osiris_stats"],
    "timestamp": "2026-01-21T14:55:30Z"
  }
}
```

---

## 📊 EJEMPLOS DE RESPUESTAS (CASOS DE USO)

### Ejemplo 1: Pregunta de Estado (Intent: insight)
**User:** "¿Cómo va el negocio hoy?"

**OSIRIS Response:**
```json
{
  "reply": "Hoy tienes 77 reservas activas con ocupación del 53.47%. Revenue total: $380,050 (+12% vs mes pasado). Hay 14 pagos pendientes y 3 alertas activas de prioridad alta.",
  "agent": "osiris",
  "intent": "insight",
  "kpis": [
    { "label": "Total Revenue", "value": "$380,050", "delta": "+12%" },
    { "label": "Occupancy", "value": "53.47%", "delta": "+5%" },
    { "label": "Active Bookings", "value": "77", "delta": "+8" },
    { "label": "Pending Payments", "value": "14", "delta": "+2" }
  ],
  "meta": {
    "execution_id": "exec-123",
    "sources": ["rpc:get_osiris_stats", "rpc:get_active_alerts"]
  }
}
```

---

### Ejemplo 2: Listado de Datos (Intent: list)
**User:** "Muéstrame los pagos pendientes"

**OSIRIS Response:**
```json
{
  "reply": "Hay 14 pagos pendientes. Los más urgentes están atrasados más de 7 días. ¿Quieres que envíe recordatorios por WhatsApp?",
  "agent": "osiris",
  "intent": "list",
  "kpis": null,
  "table": {
    "columns": [
      { "key": "guest_name", "label": "Guest" },
      { "key": "amount", "label": "Amount" },
      { "key": "due_date", "label": "Due Date" },
      { "key": "days_overdue", "label": "Days Overdue" }
    ],
    "rows": [
      {
        "payment_id": "uuid1",
        "guest_name": "John Doe",
        "amount": 500,
        "due_date": "2026-01-15",
        "days_overdue": 6,
        "guest_phone": "+1234567890"
      },
      {
        "payment_id": "uuid2",
        "guest_name": "Jane Smith",
        "amount": 750,
        "due_date": "2026-01-18",
        "days_overdue": 3,
        "guest_phone": "+34619794604"
      }
    ],
    "row_count": 14
  },
  "actions": [
    {
      "id": "send_whatsapp_payment_reminder",
      "label": "Enviar recordatorios WhatsApp",
      "needs_confirm": true,
      "payload": {
        "payment_ids": ["uuid1", "uuid2"],
        "message_template": "payment_reminder"
      }
    }
  ],
  "meta": {
    "module": "payments",
    "route": "/payments",
    "execution_id": "exec-456",
    "sources": ["table:payments"]
  }
}
```

---

### Ejemplo 3: Proponer Acción (Intent: action)
**User:** "Envía recordatorio de pago a John Doe"

**OSIRIS Response:**
```json
{
  "reply": "Voy a enviar un recordatorio de pago por WhatsApp a John Doe (+1234567890) por $500 con vencimiento 2026-01-15. ¿Confirmas?",
  "agent": "osiris",
  "intent": "action",
  "kpis": null,
  "table": null,
  "actions": [
    {
      "id": "send_whatsapp_payment_reminder",
      "label": "Confirmar envío WhatsApp",
      "needs_confirm": true,
      "payload": {
        "payment_ids": ["uuid1"],
        "message_template": "payment_reminder",
        "guest_phone": "+1234567890",
        "guest_name": "John Doe",
        "amount": 500,
        "due_date": "2026-01-15"
      }
    }
  ],
  "meta": {
    "execution_id": "exec-789",
    "sources": ["table:payments"]
  }
}
```

**Nota:** La ejecución real se hace en WF-AI-ACTION (POST /ai/action) que recibirá el payload y ejecutará el envío WhatsApp.

---

## ⚙️ WF-AI-ACTION (EJECUCIÓN DE ACCIONES)

### Webhook: POST /ai/action

**Entrada:**
```json
{
  "tenant_id": "uuid",
  "user_id": "uuid",
  "action_id": "send_whatsapp_payment_reminder",
  "payload": {
    "payment_ids": ["uuid1"],
    "message_template": "payment_reminder",
    "guest_phone": "+1234567890",
    "guest_name": "John Doe",
    "amount": 500,
    "due_date": "2026-01-15"
  },
  "confirmed": true
}
```

**Salida:**
```json
{
  "ok": true,
  "result": {
    "whatsapp_sent": true,
    "message_id": "wamid.xxx",
    "sent_at": "2026-01-21T15:00:00Z"
  },
  "execution_id": "exec-action-123"
}
```

### Implementación (2 acciones MVP)

**ACTION-01: send_whatsapp_payment_reminder**
1. Validar payload (payment_ids, guest_phone, message_template)
2. Construir mensaje desde template:
   - Template "payment_reminder":
     ```
     Hola {{ guest_name }},

     Te recordamos que tienes un pago pendiente de ${{ amount }}
     con vencimiento {{ due_date }}.

     Por favor realiza el pago lo antes posible.

     Gracias,
     {{ property_name }}
     ```
3. Enviar WhatsApp (usar infraestructura BANYU/KORA existente - ChakraHQ o equivalente)
4. Log en audit_logs:
   ```json
   {
     "action": "whatsapp_sent",
     "entity_type": "payment",
     "entity_id": "payment_id",
     "details": { "message_template": "payment_reminder", "sent_to": "+123..." }
   }
   ```
5. Responder con resultado

**ACTION-02: send_whatsapp_message_generic**
Similar a ACTION-01 pero con mensaje custom (payload.custom_message).

---

## ✅ CHECKLIST DE ACEPTACIÓN (MVP)

### Fase 1 - Infraestructura (Día 1)
- [ ] Crear tabla `ai_chat_history` en Supabase
- [ ] Crear tabla `audit_logs` en Supabase
- [ ] Verificar RPCs existentes funcionan (`get_osiris_stats`, `get_active_alerts`)
- [ ] Workflow WF-OSIRIS-MVP creado en n8n con webhook funcional

### Fase 2 - Tools Básicas (Día 1-2)
- [ ] Tool T01 (get_dashboard_stats) implementada y probada
- [ ] Tool T02 (list_pending_payments) implementada y probada
- [ ] Tool T03 (list_checkins_checkouts) implementada y probada
- [ ] Tool T04 (list_bookings) implementada y probada
- [ ] Tool T05 (get_active_alerts) implementada y probada
- [ ] Tool T06 (propose_whatsapp_reminder) implementada (solo propone)

### Fase 3 - LLM Integration (Día 2)
- [ ] Claude AI Agent configurado con system prompt correcto
- [ ] AI Agent usa las 6 tools correctamente
- [ ] Output JSON es válido y sigue contrato

### Fase 4 - Logging & Audit (Día 2)
- [ ] Logs en `ai_chat_history` funcionan correctamente
- [ ] Logs en `audit_logs` funcionan correctamente
- [ ] Logs incluyen sources (tools usadas)

### Fase 5 - Testing End-to-End (Día 2-3)
- [ ] Test 1: "¿Cómo va ocupación?" → Devuelve KPIs correctos (intent: insight)
- [ ] Test 2: "Pagos pendientes" → Devuelve tabla con datos reales (intent: list)
- [ ] Test 3: "Check-ins hoy" → Devuelve lista correcta (intent: list)
- [ ] Test 4: "Envía recordatorio a Juan" → Propone acción (intent: action)
- [ ] Test 5: Logs en ai_chat_history registrados correctamente
- [ ] Test 6: Logs en audit_logs registrados correctamente

### Fase 6 - Actions (Día 3)
- [ ] WF-AI-ACTION creado con webhook POST /ai/action
- [ ] ACTION-01 (send_whatsapp_payment_reminder) funciona
- [ ] ACTION-02 (send_whatsapp_message_generic) funciona
- [ ] Logs de acciones ejecutadas en audit_logs

### Fase 7 - Multi-tenant Testing (Día 3)
- [ ] Test con tenant Izumi Hotel funciona
- [ ] Queries filtran correctamente por tenant_id
- [ ] NO hay leaks de datos entre tenants (preparar para RLS futuro)

---

## 🚨 ERRORES COMUNES A EVITAR

1. **NO inventar tablas/columnas**
   - ✅ Usar solo las del schema proporcionado
   - ❌ NO crear queries a tablas que no existen

2. **NO ejecutar acciones en /ai/chat**
   - ✅ Solo proponer con needs_confirm=true
   - ❌ NO enviar WhatsApp desde /ai/chat

3. **NO devolver SQL errors al usuario**
   - ✅ Capturar errores y devolver JSON estándar con mensaje amigable
   - ❌ NO exponer stack traces o SQL queries

4. **NO olvidar tenant_id en queries**
   - ✅ Siempre filtrar por tenant_id (preparar para RLS)
   - ❌ NO hacer queries sin tenant filter

5. **NO exceder límites**
   - ✅ Máximo 50 filas en tables
   - ✅ Timeout razonable en queries (5s max)
   - ❌ NO queries open-ended sin LIMIT

6. **NO omitir logging**
   - ✅ Siempre log en ai_chat_history + audit_logs
   - ❌ NO dejar queries sin auditoría

---

## 📞 DATOS DE CONEXIÓN

| Recurso | Valor |
|---------|-------|
| n8n URL | https://n8n-production-bb2d.up.railway.app |
| Supabase Project | jjpscimtxrudtepzwhag |
| Supabase URL | https://jjpscimtxrudtepzwhag.supabase.co |
| Tenant ID (Izumi) | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID (Izumi) | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |
| WhatsApp (ChakraHQ) | +62 813 2576 4867 |

---

## 🎯 PRÓXIMOS PASOS (POST-MVP)

**Fase 2 (después de validar MVP):**
1. Añadir tablas `tasks`, `issues`
2. Tool T07: list_issues_tasks
3. Tool T08: property_performance_rank
4. Tool T09: anomalies_alerts (mejorado)
5. Tool T10: communications_summary
6. Tool T12: create_issue_task
7. Crear RPCs adicionales: `occupancy_rate`, `total_revenue`

**Fase 3 (scaling):**
1. Dashboard OSIRIS en UI (Claude Code)
2. Voice commands para OSIRIS (integración con KORA)
3. Scheduled insights (reportes diarios automáticos)
4. Predictive analytics (ML para forecasting)

---

## 📝 NOTAS FINALES

- **Timeline:** 2-3 días de trabajo intensivo
- **Responsable backend:** Claude AI (n8n + Supabase)
- **Responsable frontend:** Claude Code (después de MVP funcional)
- **Testing:** Jose (validación end-to-end)

**Principio guía:**
> "Mejor un MVP funcionando en 2 días que un FULL perfecto en 3 semanas que nunca termina."

---

**FIN DEL BRIEF**

Última actualización: 21 Enero 2026 - 15:00 WIB
Versión: 1.0 (MVP)
