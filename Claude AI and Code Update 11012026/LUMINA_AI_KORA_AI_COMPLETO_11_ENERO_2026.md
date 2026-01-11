# 🚀 LUMINA.AI + KORA.AI — DOCUMENTO TÉCNICO COMPLETO
## Fecha: 11 Enero 2026 | MY HOST BizMate - IZUMI Hotel Edition

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

## 📊 ESTADO DE WORKFLOWS

| Workflow | ID | Estado | Módulo |
|----------|-----|--------|--------|
| WF-SP-01 Inbound Lead Handler | `CBiOKCQ7eGnTJXQd` | ✅ | LUMINA |
| WF-SP-02 AI Sales Assistant | - | ❌ | LUMINA |
| WF-SP-03 Follow-Up Engine | `HndGXnQAEyaYDKFZ` | ✅ | LUMINA |
| WF-VA-01 Voice Intake | - | ❌ | KORA |
| WF-SOC-01 Social Content Engine | - | ❌ | Social |
| WF-SOC-02 Meta DMs → LUMINA | - | ❌ | Social (Fase 2) |

---

# LUMINA.AI — SALES & LEADS

---

## 🎯 Descripción

LUMINA.AI es el sistema inteligente que transforma consultas en reservas confirmadas, optimizando cada paso del funnel de ventas con elegancia y eficiencia.

---

## 📱 SCREENS UI

### 1. Inbox (New Leads)

**Tabla con columnas:**
- channel
- name
- contact
- message preview
- created_at
- owner_notes
- status

**Filtros:**
- Channel: IG / FB / TikTok / Email / WA
- Stage
- Date range

**Row actions:**
- Open in Conversation
- Qualify
- Assign

---

### 2. Pipeline (Stages)

**Kanban con 6 stages:**

```
┌──────────┐  ┌───────────┐  ┌─────────────────┐  ┌──────────────────┐  ┌────────────┐  ┌────────┐
│   New    │→ │ Qualified │→ │ Proposal/Summary│→ │ Pending Decision │→ │ Won/Booked │  │  Lost  │
│          │  │           │  │                 │  │                  │  │            │  │        │
│  (12)    │  │   (8)     │  │      (5)        │  │       (3)        │  │    (24)    │  │  (7)   │
└──────────┘  └───────────┘  └─────────────────┘  └──────────────────┘  └────────────┘  └────────┘
```

**Funciones:**
- Drag & drop para cambiar stage
- Per-stage counts
- Click to open lead detail

---

### 3. Follow-ups (Engine)

**Sequence Library:**
- Secuencias predefinidas (24h / 48h / 72h / 7d / 14d / 30d)
- Custom sequences

**Per-lead schedule view:**
- next_action_at
- last_touch_at
- channel

**Acciones:**
- Bulk enroll
- Bulk unenroll
- Pause / Resume / Cancel

---

### 4. Conversations

**Omnichannel thread:**
- WhatsApp
- Email
- Instagram DM
- Facebook DM

**Composer:**
- Templates dropdown
- Variables auto-fill
- Send button

**Right panel:**
- Lead profile
- Current stage
- Last availability quote
- Price estimate
- Recent tasks

---

### 5. Templates

**Message templates:**
- Name
- Channel (WA / Email / IG / FB)
- Body with variables
- Preview

**Variables disponibles:**
```
{{guest_name}}
{{villa_name}}
{{dates}}
{{price}}
{{whatsapp_shortlink}}
```

---

## 🔄 WORKFLOWS LUMINA

### WF-SP-01: Inbound Lead Handler

**Status:** ✅ EXISTE (ID: `CBiOKCQ7eGnTJXQd`)

**Input (Webhook):**
```json
{
  "tenant_id": "uuid",
  "channel": "instagram|whatsapp|email|facebook",
  "payload": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "message": "string",
    "external_id": "string"
  }
}
```

**Output:**
- Upsert lead
- Create conversation (if new)
- First message (optional)
- Call WF-SP-02 (Execute Workflow)

---

### WF-SP-02: AI Sales Assistant

**Status:** ❌ PENDIENTE (PRIORIDAD MÁXIMA)

**Input:**
```json
{
  "tenant_id": "uuid",
  "lead_id": "uuid",
  "user_text": "string"
}
```

**Tools disponibles:**
- `check_availability` (MCP/HTTP)
- `calculate_price` (MCP/HTTP)
- `create_booking` (MCP/HTTP)

**Output:**
```json
{
  "reply": "AI response text",
  "suggested_actions": ["send_quote", "schedule_call", "enroll_sequence"],
  "availability": {
    "available": true,
    "villa_name": "Villa Sunrise",
    "dates": "Jan 15-20"
  },
  "price_quote": {
    "currency": "USD",
    "total": 2500,
    "notes": "5 nights, 2 adults"
  }
}
```

---

### WF-SP-03: Follow-Up Engine

**Status:** ✅ EXISTE (ID: `HndGXnQAEyaYDKFZ`)

**Trigger:** CRON (cada hora)

**Logic:**
1. Query `sequence_enrollments` WHERE `next_action_at <= now()`
2. Per enrollment:
   - Get sequence step
   - Generate message from template
   - Send via WA/Email/IG DM
   - Log `lead_event`
   - Advance `next_action_at`

**Timeline default:**
- Step 1: SOFT_CHECK (+24h)
- Step 2: VALUE_REMINDER (+48h)
- Step 3: LAST_DIRECT (+72h)
- Step 4: REENGAGEMENT (+7d)
- Step 5: INCENTIVE (+14d)
- Step 6: CLOSURE (+30d) → Lost

---

## 🗄️ DATA MODEL LUMINA (Supabase)

```sql
-- =====================
-- LEADS
-- =====================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  channel VARCHAR(50) NOT NULL,
  external_id VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  message TEXT,
  stage VARCHAR(50) DEFAULT 'new',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_tenant_stage ON leads(tenant_id, stage);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_email ON leads(email);

-- =====================
-- LEAD EVENTS (Audit)
-- =====================
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(50),
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_events_lead ON lead_events(lead_id, created_at DESC);

-- =====================
-- CONVERSATIONS
-- =====================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  channel VARCHAR(50) NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_lead ON conversations(lead_id);

-- =====================
-- MESSAGES
-- =====================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  direction VARCHAR(20) NOT NULL, -- 'inbound' | 'outbound'
  channel VARCHAR(50) NOT NULL,
  body TEXT NOT NULL,
  template_id UUID REFERENCES templates(id),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'sent',
  meta_json JSONB
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at DESC);

-- =====================
-- SEQUENCES
-- =====================
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  steps_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example steps_json:
-- [
--   {"step": 1, "delay_hours": 24, "template_id": "uuid", "channel": "whatsapp"},
--   {"step": 2, "delay_hours": 48, "template_id": "uuid", "channel": "email"},
--   ...
-- ]

-- =====================
-- SEQUENCE ENROLLMENTS
-- =====================
CREATE TABLE sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  sequence_id UUID NOT NULL REFERENCES sequences(id),
  current_step INTEGER DEFAULT 1,
  next_action_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active' | 'paused' | 'completed' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_pending 
ON sequence_enrollments(next_action_at) 
WHERE status = 'active';

-- =====================
-- TEMPLATES
-- =====================
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  channel VARCHAR(50) NOT NULL,
  body TEXT NOT NULL,
  variables_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- AUTONOMY POLICIES
-- =====================
CREATE TABLE autonomy_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id),
  can_send_without_approval BOOLEAN DEFAULT true,
  can_offer_discount BOOLEAN DEFAULT false,
  max_discount_percent INTEGER DEFAULT 0,
  max_followups INTEGER DEFAULT 6,
  max_messages_per_day INTEGER DEFAULT 5,
  quiet_hours_start INTEGER,
  quiet_hours_end INTEGER,
  coexistence_pause_hours INTEGER DEFAULT 4,
  escalation_keywords TEXT[] DEFAULT ARRAY['complaint', 'refund', 'manager'],
  escalate_on_high_value BOOLEAN DEFAULT true,
  escalate_on_discount_request BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- FOLLOWUP JOBS (Legacy/Alternative)
-- =====================
CREATE TABLE followup_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  job_type VARCHAR(50) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending',
  message_draft TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_followup_jobs_pending 
ON followup_jobs(scheduled_at) 
WHERE status = 'pending';
```

---

# KORA.AI — VOICE CONCIERGE

---

## 🎯 Descripción

KORA.AI es el asistente de voz que atiende llamadas automáticamente cuando recepción está cerrada, asegurando que ninguna consulta quede sin respuesta.

---

## 📱 SCREEN UI

### Status Card
- On/Off toggle
- Last call timestamp
- Total calls today

### Call Logs Table

| Columna | Descripción |
|---------|-------------|
| when | Timestamp de la llamada |
| caller_id | Número del llamante |
| intent | faq / availability / price_quote / booking / transfer / voicemail |
| summary | Resumen generado por AI |
| outcome | answered / voicemail / escalated |
| booking_ref | Si aplica |

### Settings

| Setting | Descripción |
|---------|-------------|
| Reception hours | Horario con timezone |
| Handoff rules | Transfer to staff when... |
| Allowed intents | Checkboxes de intents permitidos |
| Structured Output | Schema version selector |
| Numbers | Main line + Fallback line |

---

## 🔄 WF-VA-01: Voice Intake

**Status:** ❌ PENDIENTE

**Trigger:** Webhook de VAPI (on final_response)

**Input:**
```json
{
  "tenant_id": "uuid",
  "call_id": "string",
  "schema_payload": {
    "intent": "availability",
    "dates": {
      "check_in": "2026-02-15",
      "check_out": "2026-02-20"
    },
    "guests": 2,
    "notes": "Looking for villa with pool",
    "action": "send_wa_summary"
  }
}
```

**Branching por intent:**

| Intent | Acción |
|--------|--------|
| `availability` / `price_quote` | Call tools → Send WA/Email summary via BANYU |
| `booking` | create_hold_booking → Confirmation message |
| `transfer` | Trigger staff call hook OR WA ping |
| `voicemail` | Create owner task + Store transcript |

**Output:**
- Log to `call_logs`
- If action involves guest comms → message sent via BANYU

---

## 🎤 VAPI Structured Output Schema

```json
{
  "type": "object",
  "properties": {
    "intent": {
      "type": "string",
      "enum": ["faq", "availability", "price_quote", "booking", "transfer", "voicemail"]
    },
    "dates": {
      "type": "object",
      "properties": {
        "check_in": {"type": "string", "format": "date"},
        "check_out": {"type": "string", "format": "date"}
      }
    },
    "guests": {
      "type": "integer",
      "minimum": 1
    },
    "notes": {
      "type": "string"
    },
    "action": {
      "type": "string",
      "enum": ["send_wa_summary", "send_email_quote", "create_hold_booking", "request_callback"]
    }
  },
  "required": ["intent"]
}
```

---

## 🗄️ DATA MODEL KORA (Supabase)

```sql
-- =====================
-- CALL LOGS
-- =====================
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  call_id VARCHAR(255) NOT NULL,
  caller VARCHAR(50),
  intent VARCHAR(50),
  payload_json JSONB,
  outcome VARCHAR(50), -- 'answered' | 'voicemail' | 'escalated'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_call_logs_tenant ON call_logs(tenant_id, created_at DESC);

-- =====================
-- CALL MESSAGES
-- =====================
CREATE TABLE call_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_log_id UUID NOT NULL REFERENCES call_logs(id),
  channel VARCHAR(50) NOT NULL, -- 'whatsapp' | 'email' | 'sms'
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  meta_json JSONB
);
```

---

# SOCIAL CONTENT ENGINE

---

## 📱 WF-SOC-01: Social Content Engine

**Status:** ❌ PENDIENTE

**Flujo:**
```
Google Sheets (ContentQueue)
        │
        ▼
   Validar fila (tenant_id, asset_url)
        │
        ▼
   AI genera caption + hashtags + CTA
        │
        ▼
   Publicar en IG + FB (via Buffer)
        │
        ▼
   Log en Supabase + Actualizar Sheet
```

**Template de referencia:**
https://n8n.io/workflows/7517

---

## 🗄️ DATA MODEL SOCIAL

```sql
-- =====================
-- SOCIAL POSTS
-- =====================
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  asset_type VARCHAR(20) NOT NULL,
  asset_url TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  cta_target VARCHAR(20),
  platform_ig BOOLEAN DEFAULT false,
  platform_fb BOOLEAN DEFAULT false,
  publish_status VARCHAR(20) DEFAULT 'QUEUED',
  ig_post_url TEXT,
  fb_post_url TEXT,
  provider_response JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SOCIAL EVENTS
-- =====================
CREATE TABLE social_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_type VARCHAR(50) NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# CROSS-AGENT CONSISTENCY

---

## 🔧 Shared Tools (MCP Central)

| Tool | Función | Usado por |
|------|---------|-----------|
| `check_availability` | Verifica disponibilidad | LUMINA, KORA, BANYU |
| `calculate_price` | Calcula precio | LUMINA, KORA, BANYU |
| `create_booking` | Crea reserva | LUMINA, KORA |

## 📄 Property Factsheet (Single Source)

Todos los agentes (LUMINA, BANYU, KORA) usan el mismo documento de:
- Brand tone
- Property facts
- Pricing rules
- FAQ responses

## 📝 Audit Trail

| Evento | Tabla |
|--------|-------|
| Outbound messages | `messages` |
| Lead automations | `lead_events` |
| Voice calls | `call_logs` |
| Social posts | `social_events` |

---

# API CONTRACTS

---

## Frontend ⇄ n8n

| Endpoint | Método | Body | Response |
|----------|--------|------|----------|
| `/api/leads/ingest` | POST | `{tenant_id, channel, payload}` | `{lead_id, status}` |
| `/api/leads/{id}/ai-reply` | POST | `{message}` | `{reply, suggested_actions, availability?, price_quote?}` |
| `/api/leads/{id}/enroll-sequence` | POST | `{sequence_id}` | `{enrollment_id}` |
| `/api/sequences/{id}/pause` | POST | - | `{status}` |
| `/api/sequences/{id}/resume` | POST | - | `{status}` |
| `/api/sequences/{id}/cancel` | POST | - | `{status}` |
| `/api/pipeline` | GET | - | `{stages: [{name, count}]}` |
| `/api/leads` | GET | `?channel=&stage=&from=&to=` | `{leads: [...]}` |
| `/api/conversations/{id}` | GET | - | `{messages: [...]}` |
| `/api/messages/send` | POST | `{conversation_id, channel, body}` | `{message_id}` |

---

# ACCEPTANCE CRITERIA

---

## ✅ LUMINA.AI

- [ ] Drag & drop pipeline works and persists stage
- [ ] AI reply can fetch availability/price via tools
- [ ] AI returns draft with variables filled
- [ ] Follow-up Engine triggers messages at scheduled times
- [ ] Omnichannel thread shows WA + Email (IG/FB stub OK)
- [ ] Metrics visible: New leads (7d), Conversion rate (30d), Avg response time

## ✅ KORA.AI

- [ ] Calls outside reception hours handled by AI
- [ ] During hours, follow handoff rule
- [ ] Structured outputs validated against schema
- [ ] Errors surfaced in UI
- [ ] Each call produces log row
- [ ] If action involves guest comms → WA/Email sent and visible in timeline
- [ ] "Call Summary" attaches to lead if same phone number

## ✅ Smoke Paths

**LUMINA Path:**
```
New IG DM → SP-01 → Lead created → SP-02 AI reply → SP-03 Follow-ups → Won/Booked
```

**KORA Path:**
```
After-hours call → VAPI structured output → WF-VA-01 → WA summary sent → Call logged
```

---

# PENDIENTES PRIORIZADOS

---

## 🔴 CRÍTICO (Esta semana)

| # | Tarea | Tiempo Est. |
|---|-------|-------------|
| 1 | Crear tablas Supabase LUMINA | 1h |
| 2 | Crear tablas Supabase KORA | 30min |
| 3 | Crear WF-SP-02 AI Sales Assistant | 4h |
| 4 | Conectar WF-SP-01 → WF-SP-02 | 30min |
| 5 | Crear WF-VA-01 Voice Intake | 2h |

## 🟡 IMPORTANTE (Próximas 2 semanas)

| # | Tarea |
|---|-------|
| 6 | UI: LUMINA screens (Inbox, Pipeline, Conversations) |
| 7 | UI: KORA screen (Call logs, Settings) |
| 8 | WF-SOC-01 Social Content Engine |
| 9 | Configurar Buffer + IG/FB |

## 🟢 DESPUÉS

| # | Tarea |
|---|-------|
| 10 | WF-SOC-02 Meta DMs → LUMINA |
| 11 | Market Intelligence |
| 12 | TikTok integration |

---

## 📞 INFO IZUMI HOTEL

| Campo | Valor |
|-------|-------|
| Property ID | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| Tenant ID | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| WhatsApp | +62 813 2576 4867 |
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| WF-SP-01 | CBiOKCQ7eGnTJXQd |
| WF-SP-03 | HndGXnQAEyaYDKFZ |

---

*Documento Técnico v4.0 — 11 Enero 2026*
*Agentes: LUMINA.AI | BANYU.AI | KORA.AI | OSIRIS.AI*
