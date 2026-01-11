# 🏨 MY HOST BIZMATE — DOCUMENTO MASTER COMPLETO
## Fecha: 11 Enero 2026 | IZUMI Hotel Edition

---

## 🚀 PROMPT DE ARRANQUE PARA NUEVA SESIÓN

```
Soy Jose, founder de MY HOST BizMate.

MY HOST BizMate es un SaaS de IA para boutique hotels y villas en Bali/Southeast Asia.

4 AI AGENTS:
- LUMINA.AI = Sales & Leads (captura, pipeline, follow-ups, AI sales)
- BANYU.AI = WhatsApp Guest Concierge (comunicación 24/7)
- KORA.AI = Voice Concierge (llamadas, VAPI)
- OSIRIS.AI = Operations & Control (dashboard owner)

CLIENTE PILOTO: Izumi Hotel (7 villas luxury en Ubud, Bali - abre verano 2026)
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
- WhatsApp: +62 813 2576 4867

STACK TÉCNICO:
- Frontend: React + Tailwind (Vercel)
- Backend: Supabase (Postgres + Auth + RPC)
- Workflows: n8n en Railway (v1.123.5)
- WhatsApp: Chakra HQ API
- Voice: VAPI.ai
- Social: Buffer (pendiente)

WORKFLOWS:
- WF-SP-01 Inbound Lead Handler ✅ (ID: CBiOKCQ7eGnTJXQd)
- WF-SP-02 AI Sales Assistant ❌ PENDIENTE
- WF-SP-03 Follow-Up Engine ✅ (ID: HndGXnQAEyaYDKFZ)
- WF-VA-01 Voice Intake (KORA) ❌ PENDIENTE
- WF-SOC-01 Social Content Engine ❌ PENDIENTE
- WhatsApp AI Concierge (BANYU) ✅
- VAPI Voice Assistant ✅

DOCUMENTOS DE REFERENCIA:
- MYHOST_BIZMATE_DOCUMENTO_MASTER_11_ENERO_2026
- LUMINA_AI_KORA_AI_COMPLETO_11_ENERO_2026

¿En qué te puedo ayudar hoy?
```

---

# PARTE 1: PLATAFORMA Y AGENTES AI

---

## 🎯 QUÉ ES MY HOST BIZMATE

> **MY HOST BizMate es una plataforma AI todo-en-uno para boutique hotels y villas.**
> 
> Gestiona operaciones, huéspedes, marketing y ventas desde un solo lugar inteligente.
> 
> **"Empowering Property Owners with Intelligence"**

---

## 🤖 LOS 4 AI AGENTS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MY HOST BIZMATE                                   │
│                      IZUMI Hotel Edition                                    │
├─────────────────────┬─────────────────────┬─────────────────────────────────┤
│                     │                     │                                 │
│   🌟 LUMINA.AI      │   💧 BANYU.AI       │   📞 KORA.AI                    │
│   Sales & Leads     │   WhatsApp Guest    │   Voice Concierge               │
│                     │   Concierge         │                                 │
│   • Lead Inbox      │   • Responde FAQ    │   • Atiende llamadas            │
│   • Pipeline CRM    │   • Check availability│  • Availability/Price         │
│   • AI Follow-ups   │   • Confirmaciones  │   • Structured outputs          │
│   • Conversations   │   • Reminders       │   • Handoff rules               │
│   • Templates       │   • Coexistence     │   • Call logs                   │
│                     │                     │                                 │
├─────────────────────┴─────────────────────┴─────────────────────────────────┤
│                                                                             │
│                        👁️ OSIRIS.AI                                         │
│                   Operations & Control                                      │
│                                                                             │
│   • Bookings Overview    • Payments & Revenue    • Guest Status             │
│   • Alerts & Exceptions  • Owner Dashboard       • Analytics                │
│                                                                             │
│              "The owner supervises. The system executes."                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 LUMINA.AI — Sales & Leads (Detalle)

### Descripción
Sistema inteligente que transforma consultas en reservas confirmadas, optimizando cada paso del funnel de ventas.

### Screens UI

| Screen | Función |
|--------|---------|
| **Inbox** | Tabla de nuevos leads con filtros por canal (IG/FB/TikTok/Email/WA) |
| **Pipeline** | Kanban con 6 stages, drag & drop |
| **Follow-ups** | Sequence library + per-lead schedule |
| **Conversations** | Thread omnicanal (WA/Email/IG/FB) |
| **Templates** | Message templates con variables |

### Pipeline Stages (6)

```
New → Qualified → Proposal/Summary → Pending Decision → Won/Booked → Lost
```

### Variables para Templates
- `{{guest_name}}`
- `{{villa_name}}`
- `{{dates}}`
- `{{price}}`
- `{{whatsapp_shortlink}}`

---

## 📞 KORA.AI — Voice Concierge (Detalle)

### Descripción
AI que atiende llamadas automáticamente cuando recepción está cerrada, usando la misma data que WhatsApp y el Control Panel.

### Funciones
- Maneja llamadas fuera de horario
- Responde preguntas de disponibilidad y precios
- Usa tools compartidos (check_availability, calculate_price)
- Genera structured outputs para n8n

### VAPI Structured Output Schema
```json
{
  "type": "object",
  "properties": {
    "intent": {"type": "string", "enum": ["faq", "availability", "price_quote", "booking", "transfer", "voicemail"]},
    "dates": {
      "type": "object",
      "properties": {
        "check_in": {"type": "string", "format": "date"},
        "check_out": {"type": "string", "format": "date"}
      }
    },
    "guests": {"type": "integer", "minimum": 1},
    "notes": {"type": "string"},
    "action": {"type": "string", "enum": ["send_wa_summary", "send_email_quote", "create_hold_booking", "request_callback"]}
  },
  "required": ["intent"]
}
```

### Settings UI
- Reception hours (timezone-aware)
- Handoff rules (transfer to staff when...)
- Allowed intents
- Phone numbers (main + fallback)

---

## 💧 BANYU.AI — WhatsApp Concierge

### Funciones
1. Responde preguntas de huéspedes (FAQ)
2. Verifica disponibilidad en tiempo real
3. Envía confirmaciones y reminders
4. **Coexistence**: Owner y AI comparten el mismo WhatsApp

---

## 👁️ OSIRIS.AI — Operations & Control

### Dashboard Owner
- Bookings Overview
- Payments & Revenue
- Guest Status
- Alerts & Exceptions

> **"The owner supervises. The system executes."**

---

# PARTE 2: ARQUITECTURA TÉCNICA

---

## 🔄 WORKFLOWS n8n

### LUMINA.AI Workflows

| Workflow | ID | Estado | Función |
|----------|-----|--------|---------|
| **WF-SP-01** Inbound Lead Handler | `CBiOKCQ7eGnTJXQd` | ✅ | Webhook → upsert lead → create conversation |
| **WF-SP-02** AI Sales Assistant | - | ❌ | AI reply + tools (availability, price) |
| **WF-SP-03** Follow-Up Engine | `HndGXnQAEyaYDKFZ` | ✅ | CRON → sequence_enrollments → send messages |

### KORA.AI Workflows

| Workflow | ID | Estado | Función |
|----------|-----|--------|---------|
| **WF-VA-01** Voice Intake | - | ❌ | VAPI webhook → branching por intent → actions |

### Social Engine Workflows

| Workflow | ID | Estado | Función |
|----------|-----|--------|---------|
| **WF-SOC-01** Social Content Engine | - | ❌ | Sheets → AI caption → Buffer → IG/FB |
| **WF-SOC-02** Meta DMs → LUMINA | - | ❌ | DM webhook → SP-01 (Fase 2) |

---

## 🗄️ SUPABASE SCHEMA

### Tablas LUMINA.AI

```sql
-- Core leads
leads (id, tenant_id, channel, external_id, name, email, phone, message, 
       stage, owner_id, created_at, updated_at)

lead_events (id, lead_id, type, channel, payload_json, created_at)

-- Conversations
conversations (id, lead_id, channel, last_message_at)

messages (id, conversation_id, direction, channel, body, template_id, 
          sent_at, status, meta_json)

-- Sequences
sequences (id, tenant_id, name, steps_json)

sequence_enrollments (id, lead_id, sequence_id, next_action_at, status)

-- Templates
templates (id, tenant_id, name, channel, body, variables_json)

-- Autonomy (del día anterior)
autonomy_policies (id, property_id, can_send_without_approval, can_offer_discount,
                   max_discount_percent, max_followups, quiet_hours_start, 
                   quiet_hours_end, escalation_keywords, ...)

followup_jobs (id, lead_id, property_id, job_type, scheduled_at, executed_at, 
               status, message_draft, created_at)
```

### Tablas KORA.AI

```sql
call_logs (id, tenant_id, call_id, caller, intent, payload_json, outcome, created_at)

call_messages (id, call_log_id, channel, body, sent_at, meta_json)
```

### Tablas Social Engine

```sql
social_posts (id, tenant_id, property_id, asset_type, asset_url, caption, 
              hashtags, publish_status, ig_post_url, fb_post_url, created_at)

social_events (id, tenant_id, event_type, payload_json, created_at)
```

---

## 🔌 API CONTRACTS (Frontend ⇄ n8n)

| Endpoint | Método | Función |
|----------|--------|---------|
| `/api/leads/ingest` | POST | Proxy a WF-SP-01 webhook |
| `/api/leads/{id}/ai-reply` | POST | Body: {message} → AI reply + suggested_actions |
| `/api/leads/{id}/enroll-sequence` | POST | {sequence_id} → enroll en follow-up |
| `/api/sequences/{enrollment_id}/pause` | POST | Pausar sequence |
| `/api/sequences/{enrollment_id}/resume` | POST | Reanudar sequence |
| `/api/sequences/{enrollment_id}/cancel` | POST | Cancelar sequence |
| `/api/pipeline` | GET | Pipeline con counts por stage |
| `/api/leads` | GET | Lista leads con filtros |
| `/api/conversations/{id}` | GET | Thread de conversación |
| `/api/messages/send` | POST | Enviar mensaje manual |

---

## 🔧 ENV & CONFIG

```env
NEXT_PUBLIC_TENANT_MODE=multi
MCP_ENDPOINT=https://mcp-central/api
N8N_WEBHOOK_SP01=...
N8N_WEBHOOK_SP02=...
N8N_WEBHOOK_SP03=...
N8N_WEBHOOK_VA01=...
VAPI_ASSISTANT_ID=...
WHATSAPP_SENDER_API=...
```

---

# PARTE 3: NAVEGACIÓN UI

---

## 📱 SIDEBAR (Left Navigation)

```
├── Overview
├── Operations & Guests
├── Revenue & Pricing
├── Sales & Leads        → LUMINA.AI
├── Market Intelligence
├── OSIRIS.AI            (Owner & Operations)
├── BANYU.AI             (Guest & WhatsApp)
├── KORA.AI              (Voice Concierge)
└── Settings
```

---

# PARTE 4: QA / ACCEPTANCE CRITERIA

---

## ✅ Smoke Path (LUMINA)

```
New IG DM 
   → WF-SP-01 creates lead 
   → WF-SP-02 answers with availability/price 
   → WF-SP-03 schedules follow-ups 
   → Stage: "Won/Booked"
```

## ✅ Voice Path (KORA)

```
After-hours call asks availability 
   → VAPI structured output 
   → WF-VA-01 processes intent 
   → WA summary sent to caller 
   → Call logged in call_logs
```

## ✅ Dashboard

- Sales KPIs visible (New leads 7d, Conversion rate 30d, Avg response time)
- KORA call stats visible
- Errors surface with link "Open in n8n"

---

# PARTE 5: PENDIENTES PRIORIZADOS

---

## 🔴 CRÍTICO (Esta semana)

| # | Tarea | Módulo |
|---|-------|--------|
| 1 | Crear tablas Supabase (leads, sequences, conversations, messages, templates, call_logs) | Supabase |
| 2 | Crear WF-SP-02 AI Sales Assistant | n8n |
| 3 | Conectar WF-SP-01 → WF-SP-02 | n8n |
| 4 | Crear WF-VA-01 Voice Intake | n8n |

## 🟡 IMPORTANTE (Próximas 2 semanas)

| # | Tarea | Módulo |
|---|-------|--------|
| 5 | UI: Screens LUMINA.AI (Inbox, Pipeline, Conversations) | React |
| 6 | UI: Screen KORA.AI (Call logs, Settings) | React |
| 7 | Crear WF-SOC-01 Social Content Engine | n8n |
| 8 | Configurar Buffer + IG/FB | Buffer |

## 🟢 DESPUÉS

| # | Tarea |
|---|-------|
| 9 | WF-SOC-02 Meta DMs → LUMINA |
| 10 | Market Intelligence |
| 11 | TikTok integration |

---

## 📞 INFO IZUMI HOTEL

| Campo | Valor |
|-------|-------|
| Property ID | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| Tenant ID | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| WhatsApp | +62 813 2576 4867 |
| Owner Test | +34 619 794 604 |
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |

---

*Documento Master v4.0 — 11 Enero 2026*
*Agentes: LUMINA.AI | BANYU.AI | KORA.AI | OSIRIS.AI*
