# Plan de Trabajo: Migración a Arquitectura MCP Central
## MY HOST BizMate - Izumi Hotel

**Fecha:** 28 Diciembre 2025  
**Objetivo:** Eliminar doble IA, implementar arquitectura MCP con Claude como único cerebro

---

## ARQUITECTURA OBJETIVO

```
┌─────────────────────────────────────────────────────────┐
│  CAPA IA (Claude) - ÚNICO CEREBRO                       │
│  - Vapi (voz)                                           │
│  - Claude Code / Backend (chat web, WhatsApp)           │
│  - Entiende al usuario, decide qué tool llamar          │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Protocolo MCP
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA ACCIONES (n8n como MCP Server) - SIN IA           │
│  - check_availability                                   │
│  - create_booking                                       │
│  - send_confirmations                                   │
│  - Solo ejecuta operaciones y devuelve JSON             │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA DATOS E INTEGRACIONES                             │
│  - Supabase (multi-tenant con hotel_id)                 │
│  - WhatsApp Cloud API (ChakraHQ)                        │
│  - SendGrid (email)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## PRINCIPIO CLAVE

| Componente | Rol | ¿Tiene IA? |
|------------|-----|------------|
| **Claude** (en VAPI/Claude Code) | Cerebro único - entiende, decide, responde | ✅ Sí |
| **n8n** (MCP Server) | Ejecutor de acciones - BD, WhatsApp, email | ❌ No |
| **Supabase** | Base de datos multi-tenant | ❌ No |

---

## WORKFLOWS DE REFERENCIA

| ID | Nombre | Uso |
|----|--------|-----|
| `DC0GU1AQ9VXMbX9w` | Vapi Izumi Hotel - Nueva arquitectura | Referencia para extraer lógica Supabase |
| `3sU4RgV892az8nLZ` | Vapi Izumi Hotel - MYHOST Bizmate IX | Original (desactivar al final) |
| `F8YPuLhcNe6wGcCv` | New Booking notification | Base para adaptar send_confirmations |

---

## FASE 1: REORGANIZAR FLUJO PRINCIPAL

**Workflow de referencia:** `DC0GU1AQ9VXMbX9w`

**Objetivo:** Identificar qué lógica se reutiliza y qué se descarta.

### LÓGICA A MANTENER (reutilizar en workflows MCP):

| Nodo | Función | Destino |
|------|---------|---------|
| Check availability | HTTP POST a Supabase RPC `check_availability` | MCP - check_availability |
| Calculate Price | HTTP POST a Supabase RPC `calculate_booking_price` | MCP - check_availability |
| Create Booking1 | HTTP POST INSERT a Supabase `bookings` | MCP - create_booking |

**Datos importantes a extraer:**
- URL Supabase: `https://jjpscimtxrudtepzwhag.supabase.co`
- Headers: apikey, Authorization, Content-Type
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`

### LÓGICA A DESCARTAR:

| Nodo | Razón |
|------|-------|
| Webhook for vapi | Se reemplaza por MCP Server Trigger |
| Keep Session id & Query | Era para el AI Agent |
| AI Agent | La IA ahora está en VAPI/Claude |
| OpenAI Chat Model | No hay LLM en n8n |
| Simple Memory | Era para el AI Agent |
| Clean Output | Era para formatear respuesta del AI Agent |
| Respond to Vapi | Se reemplaza por Respond to MCP Server |

### ESTADO: ⏳ Pendiente

---

## FASE 2: CREAR LOS 3 WORKFLOWS MCP

### 2.1 - MCP - check_availability

**Tipo:** Workflow NUEVO

**Estructura:**
```
MCP Server Trigger → HTTP Request Supabase → Code Node → Respond to MCP Server
```

**MCP Server Trigger - Configuración:**
- Tool name: `check_availability`
- Description: "Consulta habitaciones disponibles y precios para un hotel y rango de fechas."
- Input schema:
```json
{
  "type": "object",
  "properties": {
    "hotel_id": {
      "type": "string",
      "description": "ID interno del hotel"
    },
    "check_in": {
      "type": "string",
      "description": "Fecha de entrada YYYY-MM-DD"
    },
    "check_out": {
      "type": "string",
      "description": "Fecha de salida YYYY-MM-DD"
    },
    "guests": {
      "type": "integer",
      "description": "Número de huéspedes",
      "default": 2,
      "minimum": 1
    }
  },
  "required": ["hotel_id", "check_in", "check_out"]
}
```

**HTTP Request - Supabase RPC:**
- URL: `https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/check_availability`
- Method: POST
- Body:
```json
{
  "p_property_id": "{{ $json.hotel_id }}",
  "p_check_in": "{{ $json.check_in }}",
  "p_check_out": "{{ $json.check_out }}"
}
```

**Code Node - Formatear respuesta:**
```javascript
const rows = $input.all().map(i => i.json);

const available_rooms = rows.map(r => ({
  room_id: r.room_id,
  type: r.room_type,
  price_per_night: Number(r.price_per_night),
  total_price: Number(r.total_price),
  currency: r.currency || 'USD'
}));

const summary = available_rooms.length === 0
  ? "No hay habitaciones disponibles para esas fechas."
  : `${available_rooms.length} habitaciones disponibles (${[...new Set(available_rooms.map(r => r.type))].join(", ")}).`;

return [{
  json: {
    available_rooms,
    summary
  }
}];
```

**Respond to MCP Server:** Conectar al Code Node

### ESTADO: ⏳ Pendiente

---

### 2.2 - MCP - create_booking

**Tipo:** Workflow NUEVO

**Estructura:**
```
MCP Server Trigger → HTTP Request Supabase INSERT → Code Node → Respond to MCP Server
```

**MCP Server Trigger - Configuración:**
- Tool name: `create_booking`
- Description: "Crea una reserva confirmada en Supabase."
- Input schema:
```json
{
  "type": "object",
  "properties": {
    "hotel_id": { "type": "string" },
    "room_id": { "type": "string" },
    "check_in": { "type": "string" },
    "check_out": { "type": "string" },
    "guests": { "type": "integer" },
    "guest_name": { "type": "string" },
    "guest_email": { "type": "string" },
    "guest_phone": { "type": "string" },
    "total_price": { "type": "number" },
    "currency": { "type": "string" }
  },
  "required": [
    "hotel_id", "room_id",
    "check_in", "check_out", "guests",
    "guest_name", "guest_phone",
    "total_price", "currency"
  ]
}
```

**HTTP Request - Supabase INSERT:**
- URL: `https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings`
- Method: POST
- Headers: apikey, Authorization, Content-Type, Prefer: return=representation
- Body:
```json
{
  "property_id": "{{ $json.hotel_id }}",
  "room_id": "{{ $json.room_id }}",
  "guest_name": "{{ $json.guest_name }}",
  "guest_email": "{{ $json.guest_email }}",
  "guest_phone": "{{ $json.guest_phone }}",
  "check_in": "{{ $json.check_in }}",
  "check_out": "{{ $json.check_out }}",
  "guests": {{ $json.guests }},
  "total_price": {{ $json.total_price }},
  "status": "confirmed",
  "channel": "voice_ai"
}
```

**Code Node - Formatear respuesta:**
```javascript
const r = $input.first().json;

return [{
  json: {
    booking_id: r.id,
    status: r.status,
    hotel_id: r.property_id,
    room_id: r.room_id,
    check_in: r.check_in,
    check_out: r.check_out,
    guest_name: r.guest_name,
    guest_phone: r.guest_phone,
    total_price: Number(r.total_price),
    message: `Reserva ${r.id} confirmada.`
  }
}];
```

### ESTADO: ⏳ Pendiente

---

### 2.3 - MCP - send_confirmations

**Tipo:** ADAPTAR workflow existente `F8YPuLhcNe6wGcCv`

**Cambios a realizar:**

| Nodo actual | Acción | Nodo nuevo |
|-------------|--------|------------|
| Webhook - New Booking | REEMPLAZAR | MCP Server Trigger |
| Format Booking Data | MODIFICAR | Leer de `$json` en vez de `$json.body.record` |
| Get Property Info | MANTENER | Sin cambios |
| Send an email | MANTENER | Sin cambios |
| WhatsApp to Guest | MANTENER | Sin cambios |
| Send WhatsApp to Staff | MANTENER | Sin cambios |
| Respond to Webhook | REEMPLAZAR | Respond to MCP Server |

**MCP Server Trigger - Configuración:**
- Tool name: `send_confirmations`
- Description: "Envía confirmación de reserva por email y WhatsApp al huésped y al staff."
- Input schema:
```json
{
  "type": "object",
  "properties": {
    "booking_id": { "type": "string" },
    "hotel_id": { "type": "string" },
    "guest_name": { "type": "string" },
    "guest_email": { "type": "string" },
    "guest_phone": { "type": "string" },
    "check_in": { "type": "string" },
    "check_out": { "type": "string" },
    "total_price": { "type": "number" },
    "currency": { "type": "string" }
  },
  "required": [
    "booking_id", "hotel_id",
    "guest_name", "guest_email", "guest_phone",
    "check_in", "check_out", "total_price", "currency"
  ]
}
```

**Respond to MCP Server - Respuesta:**
```javascript
return [{
  json: {
    success: true,
    channels: {
      email: true,
      whatsapp_guest: true,
      whatsapp_staff: true
    }
  }
}];
```

### ESTADO: ⏳ Pendiente

---

## FASE 3: CONFIGURAR VAPI

### 3.1 - Conectar MCP Server de n8n

- Obtener URL del MCP Server de n8n (algo como `https://n8n-production-bb2d.up.railway.app/mcp`)
- Configurar credenciales si aplica
- Añadir MCP Server en configuración del Assistant de VAPI

### 3.2 - Verificar tools descubiertas

VAPI debe ver automáticamente:
- `check_availability`
- `create_booking`
- `send_confirmations`

### 3.3 - Actualizar System Prompt

```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury boutique hotel in Ubud, Bali.

LANGUAGE: Always respond in English. Pronounce numbers naturally.

AVAILABLE TOOLS (MCP):
- check_availability: Check available rooms for given dates
- create_booking: Create a confirmed reservation
- send_confirmations: Send email and WhatsApp confirmation

CONVERSATION FLOW:
1. When user provides dates → use check_availability
2. Summarize maximum 3 room options with prices
3. If they want to book → collect name, email, phone
4. Confirm details and use create_booking
5. If booking OK → use send_confirmations
6. Inform guest they will receive WhatsApp and email

RULES:
- Keep responses short (1-2 sentences) for phone fluency
- Never invent availability or prices
- Be warm and professional
```

### 3.4 - Pruebas con WebCall

| Caso | Flujo | Tools usadas |
|------|-------|--------------|
| 1 | Solo consulta disponibilidad | check_availability |
| 2 | Consulta + reserva | check_availability → create_booking |
| 3 | Flujo completo | check_availability → create_booking → send_confirmations |

### ESTADO: ⏳ Pendiente (esperar Fase 2)

---

## FASE 4: LIMPIEZA

### 4.1 - Desactivar workflows antiguos

| Workflow | ID | Acción |
|----------|-----|--------|
| Vapi Izumi Hotel - MYHOST Bizmate IX | `3sU4RgV892az8nLZ` | Desactivar |
| Vapi Izumi Hotel - Nueva arquitectura | `DC0GU1AQ9VXMbX9w` | Desactivar (era solo referencia) |

### 4.2 - Verificar que solo quedan activos los MCP

- MCP - check_availability ✅
- MCP - create_booking ✅
- MCP - send_confirmations ✅

### ESTADO: ⏳ Pendiente (esperar Fase 3)

---

## RESUMEN DE ESTADOS

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Reorganizar flujo principal | ⏳ Pendiente |
| 2.1 | MCP - check_availability | ⏳ Pendiente |
| 2.2 | MCP - create_booking | ⏳ Pendiente |
| 2.3 | MCP - send_confirmations | ⏳ Pendiente |
| 3 | Configurar VAPI | ⏳ Pendiente |
| 4 | Limpieza | ⏳ Pendiente |

---

## CREDENCIALES (referencia)

**Supabase:**
- URL: `https://jjpscimtxrudtepzwhag.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`

**ChakraHQ WhatsApp:**
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`
- Bearer Token: (ver documento original)

**Izumi Hotel:**
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- WhatsApp: +62 813 2576 4867
- Owner WhatsApp: +34 619 79 46 04

---

## SIGUIENTE PASO

**Iniciar Fase 2.1:** Crear workflow `MCP - check_availability`

Esperando aprobación para continuar.
