# 🚀 PROMPT CONTINUACIÓN - 5 Enero 2026

**Fecha Creación:** 4 Enero 2026
**Sesión Anterior:** Sales & Leads Frontend + Supabase Tables
**Prioridad Máxima:** WF-SP-01 Inbound Lead Handler

---

## 📋 CONTEXTO RÁPIDO

### ✅ Lo que YA está hecho (No tocar)

**Frontend:**
- Sales & Leads página completa (`src/components/SalesLeads/SalesLeads.jsx`)
- Bali Market Trends página completa (`src/components/MarketIntelligence/BaliMarketTrends.jsx`)
- Navegación en sidebar funcionando

**Base de Datos:**
- Tabla `leads` ✅ Creada
- Tabla `lead_events` ✅ Creada
- Tabla `transfers` ✅ Creada
- 13 índices ✅ Creados
- 2 triggers ✅ Creados
- **RLS: NO habilitado** (decisión consciente)

**Workflows n8n existentes (NO modificar):**
- WhatsApp AI Concierge: `ln2myAS3406D6F8W` ✅
- VAPI Voice Assistant: `jyvFpkPes5DdoBRE` ✅
- Guest Journey Scheduler: `cQLiQnqR2AHkYOjd` ✅
- Owner Daily Intelligence: `aergpRINvoJEyufR` ✅

---

## 🎯 OBJETIVO DE HOY

### Crear WF-SP-01: Inbound Lead Handler

**Descripción:**
Workflow que captura TODOS los contactos entrantes desde WhatsApp, Instagram, Email, Web y VAPI, y los almacena en la tabla `leads` de Supabase.

**Resultado esperado:**
- Cada contacto nuevo → INSERT en `leads`
- Contacto existente (mismo phone/email) → UPDATE en `leads`
- Evento `lead_created` o `lead_updated` en `lead_events`
- Frontend "Sales & Leads" muestra datos REALES

---

## 📊 ARQUITECTURA DEL WORKFLOW

### WF-SP-01: Inbound Lead Handler

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRY POINTS (Webhooks)                   │
├─────────────────────────────────────────────────────────────┤
│  WhatsApp    Instagram    Email    Web Form    VAPI Voice   │
│     │            │          │          │            │        │
│     └────────────┴──────────┴──────────┴────────────┘        │
│                           ↓                                  │
│                   NORMALIZE DATA                             │
│                  (Code Node: Extract)                        │
│                           ↓                                  │
│              {                                               │
│                name, phone, email, channel,                  │
│                message, intent, context                      │
│              }                                               │
│                           ↓                                  │
│                CHECK IF EXISTS                               │
│           (Supabase: SELECT by phone/email)                  │
│                           ↓                                  │
│                    ┌──────┴──────┐                           │
│                    │             │                           │
│                EXISTS?        NEW?                           │
│                    │             │                           │
│            UPDATE lead    INSERT lead                        │
│         (Supabase PATCH) (Supabase POST)                     │
│                    │             │                           │
│                    └──────┬──────┘                           │
│                           ↓                                  │
│                  CLASSIFY INTENT                             │
│             (Code: info/price/availability/booking)          │
│                           ↓                                  │
│                  CALCULATE SCORE                             │
│                   (Code: 0-100)                              │
│                           ↓                                  │
│                  LOG EVENT                                   │
│          (Supabase POST to lead_events)                      │
│            lead_created / lead_updated                       │
│                           ↓                                  │
│                  EMIT TO NEXT WORKFLOWS                      │
│              (Trigger WF-SP-02 if needed)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIÓN DETALLADA

### PASO 1: Crear Webhook Endpoints

**Nodos:**
1. **Webhook - WhatsApp**
   - Path: `/webhook/inbound/whatsapp`
   - Method: POST
   - Response: 200 OK

2. **Webhook - Instagram**
   - Path: `/webhook/inbound/instagram`
   - Method: POST
   - Response: 200 OK

3. **Webhook - Email**
   - Path: `/webhook/inbound/email`
   - Method: POST
   - Response: 200 OK

4. **Webhook - Web Form**
   - Path: `/webhook/inbound/web`
   - Method: POST
   - Response: 200 OK

5. **Webhook - VAPI**
   - Path: `/webhook/inbound/vapi`
   - Method: POST
   - Response: 200 OK

**Merge:** Todos los webhooks → 1 solo flujo

---

### PASO 2: Normalize Data (Code Node)

**Input:** Raw data desde diferentes fuentes
**Output:** Estructura unificada

```javascript
// Code Node: Normalize Inbound Data
const channel = $input.item.json.channel || 'unknown';
const rawData = $input.item.json;

let normalized = {
  // Contact Info
  name: null,
  phone: null,
  email: null,
  channel: channel,

  // Context
  message: null,
  check_in: null,
  check_out: null,
  guests: null,

  // Metadata
  source_url: null,
  utm_campaign: null,
  utm_source: null,
  utm_medium: null,

  // Tracking
  tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db', // Izumi Hotel
  property_id: '18711359-1378-4d12-9ea6-fb31c0b1bac2' // Izumi Hotel
};

// Extract based on channel
switch(channel) {
  case 'whatsapp':
    normalized.phone = rawData.from || rawData.phone;
    normalized.name = rawData.profile?.name || rawData.name;
    normalized.message = rawData.text?.body || rawData.message;
    break;

  case 'instagram':
    normalized.name = rawData.sender?.username;
    normalized.message = rawData.message?.text;
    break;

  case 'email':
    normalized.email = rawData.from;
    normalized.name = rawData.from_name;
    normalized.message = rawData.text || rawData.html;
    break;

  case 'web':
    normalized.name = rawData.name;
    normalized.phone = rawData.phone;
    normalized.email = rawData.email;
    normalized.message = rawData.message;
    normalized.check_in = rawData.check_in;
    normalized.check_out = rawData.check_out;
    normalized.guests = rawData.guests;
    break;

  case 'vapi':
    normalized.phone = rawData.customer?.number;
    normalized.message = rawData.transcript;
    break;
}

return { json: normalized };
```

---

### PASO 3: Check if Lead Exists (Supabase SELECT)

**Nodo:** Supabase - Get Rows

**Config:**
- Table: `leads`
- Filter: `phone.eq.{{$json.phone}}` OR `email.eq.{{$json.email}}`
- Limit: 1

**Output:**
- Si existe: `lead_id`, `current_status`, etc.
- Si no existe: empty array

---

### PASO 4: Branch - Exists vs New (IF Node)

**Condition:**
```javascript
{{ $json.id !== undefined }}
```

**True (EXISTS):** → UPDATE lead
**False (NEW):** → INSERT lead

---

### PASO 5A: UPDATE Existing Lead (Supabase PATCH)

**Nodo:** Supabase - Update Rows

**Payload:**
```json
{
  "last_contacted_at": "{{ $now.toISO() }}",
  "message_history": "{{ $json.message_history.concat([{
    timestamp: $now.toISO(),
    message: $('Normalize').item.json.message,
    channel: $('Normalize').item.json.channel
  }]) }}",
  "updated_at": "{{ $now.toISO() }}"
}
```

**Filter:** `id.eq.{{$json.id}}`

---

### PASO 5B: INSERT New Lead (Supabase POST)

**Nodo:** Supabase - Insert Rows

**Payload:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "name": "{{ $('Normalize').item.json.name }}",
  "phone": "{{ $('Normalize').item.json.phone }}",
  "email": "{{ $('Normalize').item.json.email }}",
  "channel": "{{ $('Normalize').item.json.channel }}",
  "status": "NEW",
  "intent": null,
  "score": 0,
  "check_in": "{{ $('Normalize').item.json.check_in }}",
  "check_out": "{{ $('Normalize').item.json.check_out }}",
  "guests": "{{ $('Normalize').item.json.guests }}",
  "message_history": [{
    "timestamp": "{{ $now.toISO() }}",
    "message": "{{ $('Normalize').item.json.message }}",
    "channel": "{{ $('Normalize').item.json.channel }}"
  }],
  "source_url": "{{ $('Normalize').item.json.source_url }}",
  "utm_campaign": "{{ $('Normalize').item.json.utm_campaign }}",
  "utm_source": "{{ $('Normalize').item.json.utm_source }}",
  "utm_medium": "{{ $('Normalize').item.json.utm_medium }}",
  "first_contact_at": "{{ $now.toISO() }}",
  "last_contact_at": "{{ $now.toISO() }}"
}
```

---

### PASO 6: Classify Intent (Code Node)

**Input:** `message` text
**Output:** `intent` (info / price / availability / booking)

```javascript
// Code Node: Classify Intent
const message = $('Normalize').item.json.message?.toLowerCase() || '';

let intent = 'info'; // default

// Keywords para clasificación básica
if (message.match(/book|reserve|reservation|confirm/i)) {
  intent = 'booking';
} else if (message.match(/available|availability|free|vacant/i)) {
  intent = 'availability';
} else if (message.match(/price|cost|how much|rate|tariff/i)) {
  intent = 'price';
}

return { json: { intent } };
```

---

### PASO 7: Calculate Lead Score (Code Node)

**Input:** Lead data
**Output:** `score` (0-100)

```javascript
// Code Node: Calculate Lead Score
let score = 0;

const lead = $('Supabase Insert/Update').item.json;
const message = $('Normalize').item.json.message?.toLowerCase() || '';

// +20 si tiene fechas específicas
if (lead.check_in && lead.check_out) score += 20;

// +15 si pregunta por precio
if (message.match(/price|cost|how much/i)) score += 15;

// +25 si pregunta por disponibilidad
if (message.match(/available|availability/i)) score += 25;

// +40 si quiere reservar
if (message.match(/book|reserve|reservation/i)) score += 40;

// +10 si tiene email Y teléfono
if (lead.email && lead.phone) score += 10;

// -10 si solo pide info genérica
if (message.match(/information|info|tell me about/i) && score === 0) score = 5;

// Cap at 100
score = Math.min(score, 100);

return { json: { score } };
```

---

### PASO 8: Update Score (Supabase PATCH)

**Nodo:** Supabase - Update Rows

**Payload:**
```json
{
  "intent": "{{ $('Classify Intent').item.json.intent }}",
  "score": "{{ $('Calculate Score').item.json.score }}"
}
```

**Filter:** `id.eq.{{$('Supabase Insert/Update').item.json.id}}`

---

### PASO 9: Log Event (Supabase POST to lead_events)

**Nodo:** Supabase - Insert Rows
**Table:** `lead_events`

**Payload:**
```json
{
  "lead_id": "{{ $('Supabase Insert/Update').item.json.id }}",
  "event_type": "{{ $('IF Exists').item.json.id ? 'lead_updated' : 'lead_created' }}",
  "payload_json": {
    "channel": "{{ $('Normalize').item.json.channel }}",
    "message": "{{ $('Normalize').item.json.message }}",
    "intent": "{{ $('Classify Intent').item.json.intent }}",
    "score": "{{ $('Calculate Score').item.json.score }}"
  },
  "created_by": "WF-SP-01"
}
```

---

### PASO 10: Emit to Next Workflows (Webhook)

**Nodo:** Webhook - Call
**URL:** `https://n8n-production-bb2d.up.railway.app/webhook/lead/new`

**Payload:**
```json
{
  "lead_id": "{{ $('Supabase Insert/Update').item.json.id }}",
  "event": "{{ $('IF Exists').item.json.id ? 'lead_updated' : 'lead_created' }}",
  "score": "{{ $('Calculate Score').item.json.score }}",
  "intent": "{{ $('Classify Intent').item.json.intent }}"
}
```

**Purpose:**
- Trigger WF-SP-02 (AI Self-Assistance) si es hot lead
- Trigger WF-SP-03 (Follow-Up Engine) si es NEW

---

## 🔗 CONECTAR WORKFLOWS EXISTENTES

### WhatsApp AI Concierge → WF-SP-01

**Modificación mínima:**
Al final del workflow `ln2myAS3406D6F8W`, añadir:

**Nodo:** HTTP Request
**URL:** `https://n8n-production-bb2d.up.railway.app/webhook/inbound/whatsapp`
**Method:** POST
**Body:**
```json
{
  "channel": "whatsapp",
  "phone": "{{ $json.from }}",
  "name": "{{ $json.profile?.name }}",
  "message": "{{ $json.text?.body }}",
  "raw": "{{ $json }}"
}
```

### VAPI Voice Assistant → WF-SP-01

**Modificación mínima:**
Al final del workflow `jyvFpkPes5DdoBRE`, añadir:

**Nodo:** HTTP Request
**URL:** `https://n8n-production-bb2d.up.railway.app/webhook/inbound/vapi`
**Method:** POST
**Body:**
```json
{
  "channel": "vapi",
  "phone": "{{ $json.customer?.number }}",
  "message": "{{ $json.transcript }}",
  "raw": "{{ $json }}"
}
```

### Web Form (Frontend) → WF-SP-01

**Nuevo endpoint en frontend:**
`src/services/supabase.js` → añadir función:

```javascript
async submitLeadForm(formData) {
  const response = await fetch(
    'https://n8n-production-bb2d.up.railway.app/webhook/inbound/web',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'web',
        ...formData
      })
    }
  );
  return response.json();
}
```

---

## 📊 TESTING DEL WORKFLOW

### Test 1: WhatsApp Lead (Manual)

**cURL:**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/inbound/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "whatsapp",
    "phone": "+1234567890",
    "name": "Test User",
    "message": "Hi, I want to book a villa for Feb 15-20"
  }'
```

**Expected Result:**
1. Nuevo registro en tabla `leads` con status = NEW
2. Evento en `lead_events` con event_type = lead_created
3. intent = booking
4. score ≈ 60-80

---

### Test 2: Email Lead (Manual)

**cURL:**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/inbound/email \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "email",
    "email": "test@example.com",
    "name": "Jane Doe",
    "message": "Can you tell me about your pricing?"
  }'
```

**Expected Result:**
1. Nuevo registro en `leads`
2. intent = price
3. score ≈ 15-25

---

### Test 3: Duplicate Lead (UPDATE test)

**cURL (mismo phone que Test 1):**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/inbound/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "whatsapp",
    "phone": "+1234567890",
    "name": "Test User",
    "message": "Is the villa still available?"
  }'
```

**Expected Result:**
1. NO crear nuevo registro
2. UPDATE registro existente
3. `last_contacted_at` actualizado
4. `message_history` con 2 mensajes
5. Evento `lead_updated` en `lead_events`

---

### Test 4: Verificar en Frontend

1. Abrir app: https://my-host-bizmate.vercel.app
2. Login
3. Ir a: REVENUE & PRICING → Sales & Leads
4. Verificar que aparecen los leads de tests
5. Verificar métricas actualizadas

---

## 🎯 CRITERIOS DE ÉXITO

**Workflow WF-SP-01 es exitoso si:**

- [x] Recibe webhooks desde 5 canales (WhatsApp, IG, Email, Web, VAPI)
- [x] Normaliza datos correctamente
- [x] Detecta duplicados por phone/email
- [x] INSERT nuevo lead si no existe
- [x] UPDATE lead existente si existe
- [x] Clasifica intent correctamente (info/price/availability/booking)
- [x] Calcula score (0-100) basado en contexto
- [x] Log evento en `lead_events` (lead_created / lead_updated)
- [x] Emite evento a workflows downstream
- [x] Frontend muestra leads REALES

---

## 🚨 NOTAS IMPORTANTES

### ⚠️ NO HACER

1. **NO modificar lógica de workflows existentes**
   - Solo añadir llamada HTTP al final
   - No cambiar prompts de AI
   - No cambiar estructura de respuesta

2. **NO habilitar RLS**
   - Ya lo discutimos
   - Dejar tablas sin RLS
   - n8n necesita acceso libre

3. **NO crear campos que no existen**
   - Respetar schema de tabla `leads`
   - Si necesitas nuevo campo → primero ALTER TABLE

### ✅ SÍ HACER

1. **Testear cada paso**
   - Usar Test Workflow en n8n
   - Verificar que cada nodo funciona
   - Ver output en Supabase directamente

2. **Documentar IDs de workflows**
   - Anotar el workflow_id de WF-SP-01
   - Guardar URLs de webhooks

3. **Monitorear errores**
   - Si falla un nodo, revisar logs n8n
   - Si no llega a Supabase, verificar permisos (RLS no debe estar habilitado)

---

## 📁 ARCHIVOS DE REFERENCIA

### Supabase Schema
- `supabase/migrations/create_leads_tables_v2.sql` - Schema completo

### Frontend
- `src/components/SalesLeads/SalesLeads.jsx` - Página que mostrará los leads

### Documentación
- `Claude AI and Code Update 04012026/RESUMEN_SESION_04_ENERO_2026.md` - Sesión anterior
- `Claude AI and Code Update 04012026/MYHOST_BIZMATE_RESUMEN_COMPLETO_Y_PLAN_ACCION.md` - Plan maestro

---

## 🔧 CONFIGURACIÓN N8N

### Credenciales Necesarias

**Supabase:**
- Name: `Supabase account`
- Host: `https://jjpscimtxrudtepzwhag.supabase.co`
- API Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`

### URLs n8n
- **Base:** https://n8n-production-bb2d.up.railway.app
- **Webhooks Path:** `/webhook/inbound/{channel}`

---

## ⏱️ ESTIMACIÓN DE TIEMPO

**Tiempo total estimado:** 2-3 horas

| Tarea | Tiempo |
|-------|--------|
| Crear workflow WF-SP-01 base | 30 min |
| Implementar normalización de datos | 20 min |
| Lógica de INSERT/UPDATE | 20 min |
| Clasificación de intent | 15 min |
| Lead scoring | 15 min |
| Log eventos | 10 min |
| Conectar workflows existentes | 30 min |
| Testing completo | 30 min |

---

## 🚀 SIGUIENTE PASO (Para después de WF-SP-01)

Una vez que WF-SP-01 esté funcionando:

**WF-SP-03: Follow-Up Engine**
- Escuchar eventos `lead_created`, `ai_hot_lead_detected`
- Enviar seguimientos automáticos
- Actualizar status a WON/LOST

**Meta:** Cerrar el ciclo completo de Sales & Leads.

---

**¡Manos a la obra! 🔥**

Crear WF-SP-01 es la pieza clave para que todo el sistema de Sales funcione.

---

*Creado: 4 Enero 2026, 17:45*
*Para sesión: 5 Enero 2026*
