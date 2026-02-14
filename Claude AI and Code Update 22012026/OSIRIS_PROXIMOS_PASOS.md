# OSIRIS - PRÓXIMOS PASOS
**Fecha:** 22 Enero 2026
**Responsable:** Claude AI (n8n workflows)
**Documento de referencia:** `Claude AI and Code Update 21012026\BRIEF_OSIRIS_MVP_21_ENERO_2026.md`

---

## 📋 TAREA: Completar Workflow WF-OSIRIS-MVP

### Estado Actual
✅ OSIRIS básico funcionando (chat en frontend conectado a n8n)
⏳ Falta implementar: Multilingual, 6 Tools, Structured Output, Logging

---

## 1️⃣ AÑADIR SOPORTE MULTILINGUAL (CRÍTICO)

En el **system prompt** del nodo Claude AI, añade al inicio:

```
LANGUAGE RULE - CRITICAL:
You MUST respond in the SAME language the user writes in.

- If user writes in English → respond in English
- If user writes in Spanish → respond in Spanish
- If user writes in Indonesian → respond in Indonesian

NEVER force a specific language. Detect and match the user's language automatically.

Examples:
- User: "How is the business today?" → Response: "Today you have 77 active bookings..."
- User: "¿Cómo va el negocio hoy?" → Response: "Hoy tienes 77 reservas activas..."
- User: "Bagaimana bisnis hari ini?" → Response: "Hari ini Anda memiliki 77 pemesanan aktif..."

---
```

---

## 2️⃣ IMPLEMENTAR 6 TOOLS OSIRIS

El LLM debe tener acceso a estas 6 tools como function calling (ver documento de referencia líneas 184-393):

### Tool 1: get_dashboard_stats
**Descripción:** Obtener KPIs ejecutivos del dashboard
**Implementación:** Llamar RPC `get_osiris_stats(tenant_id)`
**Retorna:** JSON con revenue, occupancy, active_bookings, pending_payments_count, avg_daily_rate, revenue_growth

### Tool 2: list_pending_payments
**Descripción:** Listar pagos pendientes con filtros
**Implementación:** Query SQL (ver líneas 212-255)
**Parámetros:** tenant_id, limit (default: 50), days_overdue (opcional)
**Retorna:** Array con payment_id, amount, due_date, days_overdue, guest_name, guest_phone, booking_id

### Tool 3: list_checkins_checkouts
**Descripción:** Check-ins y check-outs de fecha específica
**Implementación:** Query SQL (ver líneas 259-307)
**Parámetros:** tenant_id, date (TODAY/tomorrow/YYYY-MM-DD), type (checkin/checkout/both)
**Retorna:** Array de bookings con check_in, check_out, guest info

### Tool 4: list_bookings
**Descripción:** Listar reservas con filtros
**Implementación:** Query SQL (ver líneas 311-344)
**Parámetros:** tenant_id, status (confirmed/pending/cancelled/all), date_from, date_to, limit
**Retorna:** Array de bookings con property info

### Tool 5: get_active_alerts
**Descripción:** Alertas y anomalías activas
**Implementación:** Llamar RPC `get_active_alerts(tenant_id)`
**Retorna:** Array con id, alert_type, severity, message, status

### Tool 6: propose_whatsapp_reminder
**Descripción:** Proponer envío WhatsApp (NO ejecuta, solo construye payload)
**Implementación:** Function node (ver líneas 371-393)
**Parámetros:** payment_ids (array), message_template, custom_message
**Retorna:** Object con action_id, label, needs_confirm: true, payload

**IMPORTANTE:** Esta tool NO ejecuta acciones, solo prepara el payload para que el frontend muestre confirmación al usuario.

---

## 3️⃣ FORMATO DE RESPUESTA (JSON ESTRUCTURADO)

Claude DEBE devolver siempre este formato JSON (ver documento líneas 570-606):

```json
{
  "reply": "Respuesta en texto natural en el idioma del usuario",
  "agent": "osiris",
  "intent": "insight|list|action",

  "kpis": [
    {
      "label": "Total Revenue",
      "value": "$380,050",
      "delta": "+12%"
    }
  ],

  "table": {
    "columns": [
      {"key": "guest_name", "label": "Guest"},
      {"key": "amount", "label": "Amount"}
    ],
    "rows": [
      {
        "payment_id": "uuid",
        "guest_name": "John Doe",
        "amount": 500,
        "due_date": "2026-01-15"
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
    "module": "overview",
    "route": "/",
    "execution_id": "n8n-exec-12345",
    "sources": ["rpc:get_osiris_stats", "table:payments"],
    "timestamp": "2026-01-22T10:30:00Z"
  }
}
```

### Explicación de campos:

- **reply:** Texto conversacional que se muestra al usuario
- **intent:** Tipo de respuesta
  - `insight` - KPIs y métricas
  - `list` - Tablas con datos
  - `action` - Acciones propuestas
- **kpis:** Array de métricas (opcional, usar cuando intent=insight)
- **table:** Datos tabulares (opcional, usar cuando intent=list)
- **actions:** Acciones disponibles (opcional, usar cuando intent=action)
- **meta:** Metadata de ejecución (siempre incluir)

---

## 4️⃣ ARQUITECTURA DEL WORKFLOW (9 Nodos)

Implementar según documento líneas 411-547:

```
NODO 1: Webhook
├─ POST /webhook/osiris-chat
├─ Body: {tenant_id, user_id, session_id, agent_id: "osiris", message}
└─ Validar campos obligatorios

NODO 2: Normalize Input
├─ Trim message
├─ Detectar intent hints (kpi, list, etc.)
└─ Detectar date_range ("hoy", "esta semana")

NODO 3: Get Owner Context
├─ RPC: get_osiris_stats(tenant_id) → KPIs
├─ RPC: get_active_alerts(tenant_id) → Alertas
└─ Construir owner_context para system prompt

NODO 4: Build System Prompt
├─ LANGUAGE RULE (sección 1)
├─ Contexto KPIs actual
├─ Lista de 6 tools disponibles
└─ Output format JSON obligatorio

NODO 5: Claude AI Agent
├─ Model: Claude 3.5 Sonnet
├─ System: {{ system_prompt del NODO 4 }}
├─ User Message: {{ message }}
├─ Tools: Las 6 tools (function calling)
└─ Max tokens: 4000

NODO 6: Parse & Normalize Output
├─ Validar JSON structure
├─ Añadir execution_id, timestamp
├─ Truncar table a 50 filas max
└─ Si error → JSON estándar con error

NODO 7: Log ai_chat_history_v2
├─ Tabla: ai_chat_history_v2 (EXISTENTE - NO CREAR)
├─ INSERT: tenant_id, session_id, message, response
└─ Campos JSONB: kpis_snapshot, actions_suggested

NODO 8: Log audit_logs
├─ Tabla: audit_logs (EXISTENTE - NO CREAR)
├─ INSERT: tenant_id, action: 'ai_query', resource_type: 'osiris'
└─ Details JSONB: query, sources, intent, result_count

NODO 9: Respond
├─ Status: 200
└─ Body: {{ JSON normalizado del NODO 6 }}
```

**CRÍTICO:** NO crear tablas nuevas. Usar solo `ai_chat_history_v2` y `audit_logs` existentes.

---

## 5️⃣ LOGGING EN TABLAS EXISTENTES

### Tabla: ai_chat_history_v2

```sql
INSERT INTO ai_chat_history_v2 (
  tenant_id,
  session_id,
  message,
  response,
  context_mode,
  kpis_snapshot,
  actions_suggested
) VALUES (
  $1,  -- tenant_id
  $2,  -- session_id
  $3,  -- message
  $4,  -- response (reply del JSON)
  'osiris',
  $5::jsonb,  -- {"intent": "insight", "kpis": [...]}
  $6::jsonb   -- actions array
)
```

### Tabla: audit_logs

```sql
INSERT INTO audit_logs (
  tenant_id,
  performed_by_user_id,
  action,
  resource_type,
  resource_id,
  old_values,
  new_values
) VALUES (
  $1,  -- tenant_id
  $2,  -- user_id
  'ai_query',
  'osiris',
  NULL,
  $3::jsonb,  -- {"agent": "osiris", "intent": "..."}
  $4::jsonb   -- {"query": "...", "sources": [...], "result_count": 14}
)
```

---

## 6️⃣ PLAN DE PRUEBAS (3 Tests End-to-End)

### Test 1: English + KPIs (Intent: insight)

**Request:**
```bash
POST https://n8n-production-bb2d.up.railway.app/webhook/osiris-chat
Content-Type: application/json

{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "user_id": "test-user-uuid",
  "session_id": "test-en-001",
  "agent_id": "osiris",
  "message": "How is the business doing today?"
}
```

**Expected Response:**
```json
{
  "reply": "Today you have 77 active bookings with 53.47% occupancy. Total revenue: $380,050 (+12% vs last month). There are 14 pending payments.",
  "agent": "osiris",
  "intent": "insight",
  "kpis": [
    {"label": "Total Revenue", "value": "$380,050", "delta": "+12%"},
    {"label": "Occupancy", "value": "53.47%", "delta": "+5%"},
    {"label": "Active Bookings", "value": "77", "delta": "+8"},
    {"label": "Pending Payments", "value": "14", "delta": "+2"}
  ],
  "table": null,
  "actions": null,
  "meta": {
    "execution_id": "exec-xxx",
    "sources": ["rpc:get_osiris_stats"],
    "timestamp": "2026-01-22T10:30:00Z"
  }
}
```

**Verificar logs:**
```sql
SELECT * FROM ai_chat_history_v2 WHERE session_id = 'test-en-001';
SELECT * FROM audit_logs WHERE resource_type = 'osiris' ORDER BY created_at DESC LIMIT 1;
```

---

### Test 2: Spanish + Table (Intent: list)

**Request:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "user_id": "test-user-uuid",
  "session_id": "test-es-002",
  "agent_id": "osiris",
  "message": "Muéstrame los pagos pendientes"
}
```

**Expected Response:**
```json
{
  "reply": "Hay 14 pagos pendientes. Los más urgentes están atrasados más de 7 días. ¿Quieres que envíe recordatorios por WhatsApp?",
  "agent": "osiris",
  "intent": "list",
  "kpis": null,
  "table": {
    "columns": [
      {"key": "guest_name", "label": "Guest"},
      {"key": "amount", "label": "Amount"},
      {"key": "due_date", "label": "Due Date"},
      {"key": "days_overdue", "label": "Days Overdue"}
    ],
    "rows": [
      {
        "payment_id": "uuid1",
        "guest_name": "John Doe",
        "amount": 500,
        "due_date": "2026-01-15",
        "days_overdue": 6
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
    "execution_id": "exec-xxx",
    "sources": ["table:payments"],
    "timestamp": "2026-01-22T10:35:00Z"
  }
}
```

---

### Test 3: Indonesian + Actions (Intent: action)

**Request:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "user_id": "test-user-uuid",
  "session_id": "test-id-003",
  "agent_id": "osiris",
  "message": "Kirim pengingat pembayaran ke semua tamu yang tertunggak"
}
```

**Expected Response:**
```json
{
  "reply": "Saya akan mengirim pengingat pembayaran melalui WhatsApp ke 14 tamu dengan pembayaran tertunggak. Apakah Anda yakin?",
  "agent": "osiris",
  "intent": "action",
  "kpis": null,
  "table": null,
  "actions": [
    {
      "id": "send_whatsapp_payment_reminder",
      "label": "Kirim pengingat WhatsApp",
      "needs_confirm": true,
      "payload": {
        "payment_ids": ["uuid1", "uuid2", "..."],
        "message_template": "payment_reminder"
      }
    }
  ],
  "meta": {
    "execution_id": "exec-xxx",
    "sources": ["table:payments"],
    "timestamp": "2026-01-22T10:40:00Z"
  }
}
```

---

## 7️⃣ CHECKLIST DE ACEPTACIÓN

- [ ] System prompt incluye LANGUAGE RULE
- [ ] 9 nodos implementados según arquitectura
- [ ] Tool T01 (get_dashboard_stats) funciona
- [ ] Tool T02 (list_pending_payments) funciona
- [ ] Tool T03 (list_checkins_checkouts) funciona
- [ ] Tool T04 (list_bookings) funciona
- [ ] Tool T05 (get_active_alerts) funciona
- [ ] Tool T06 (propose_whatsapp_reminder) funciona
- [ ] JSON output validado en NODO 6
- [ ] Logs en ai_chat_history_v2 funcionan
- [ ] Logs en audit_logs funcionan
- [ ] Test 1 (EN + KPIs) PASA ✅
- [ ] Test 2 (ES + Table) PASA ✅
- [ ] Test 3 (ID + Actions) PASA ✅
- [ ] NO se crearon tablas nuevas ✅
- [ ] NO se rompieron workflows existentes ✅

---

## 📂 DATOS DE CONEXIÓN

| Recurso | Valor |
|---------|-------|
| n8n URL | https://n8n-production-bb2d.up.railway.app |
| Supabase Project | jjpscimtxrudtepzwhag |
| Supabase URL | https://jjpscimtxrudtepzwhag.supabase.co |
| Tenant ID (Izumi) | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID (Izumi) | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |

---

## 📖 REFERENCIAS

### Documento Base
`C:\myhost-bizmate\Claude AI and Code Update 21012026\BRIEF_OSIRIS_MVP_21_ENERO_2026.md`

### Líneas clave del documento:
- **Líneas 184-393:** Especificación completa de las 6 tools
- **Líneas 411-547:** Arquitectura detallada de los 9 nodos
- **Líneas 570-606:** Formato JSON de respuesta (contrato)
- **Líneas 610-725:** Ejemplos de respuestas por tipo de intent
- **Líneas 801-845:** Checklist de aceptación completo

### Tablas Supabase (EXISTENTES - NO CREAR):
- `ai_chat_history_v2` - Logging de conversaciones
- `audit_logs` - Auditoría de acciones
- `properties` - Propiedades del tenant
- `bookings` - Reservas
- `payments` - Pagos

### RPCs Disponibles (YA CREADOS):
- `get_osiris_stats(tenant_id)` → KPIs dashboard
- `get_active_alerts(tenant_id)` → Alertas activas

---

## ⚠️ ERRORES COMUNES A EVITAR

1. **NO crear tablas nuevas** → Usar solo ai_chat_history_v2 y audit_logs existentes
2. **NO ejecutar acciones en chat** → Tool T06 solo PROPONE, no ejecuta
3. **NO forzar idioma** → Siempre responder en el idioma del usuario
4. **NO omitir logging** → Cada query debe registrarse en audit_logs
5. **NO devolver SQL errors** → Siempre JSON válido con error amigable
6. **NO exceder límites** → Máximo 50 filas en tables
7. **NO omitir tenant_id** → Todas las queries deben filtrar por tenant

---

## 🎯 SIGUIENTE PASO

**¿Alguna duda antes de empezar?**

Si todo está claro, procede con la implementación del workflow en n8n siguiendo exactamente esta especificación.

---

**Última actualización:** 22 Enero 2026 - 11:00 WIB
**Versión:** 1.0 (MVP Completion)
