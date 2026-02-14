# 🤖 ARQUITECTURA FINAL - 4 AGENTES IA
**Fecha:** 11 Enero 2026 (Actualización aplicada 11 Enero 2026)
**Proyecto:** MY HOST BizMate - IZUMI Hotel Edition
**Status:** ✅ NOMENCLATURA FINAL - NO MODIFICAR

---

## 🚀 SYSTEM PROMPT - ARQUITECTURA ALIGNMENT

**CONTEXTO:**
Este documento establece la nomenclatura FINAL de los 4 agentes IA del sistema.

**REGLA CRÍTICA:**
- ❌ NO redesign architecture
- ❌ NO split versions (no v1/v2)
- ❌ NO modify existing workflows
- ❌ NO change Supabase structure
- ✅ ONLY align naming, grouping, and references

---

## 🎯 LOS 4 AGENTES IA (NOMBRES FINALES)

```
┌─────────────────────────────────────────────────────────────────┐
│                        MY HOST BIZMATE                           │
│                      IZUMI Hotel Edition                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   🌟 LUMINA.AI      💧 BANYU.AI      📞 KORA.AI                  │
│   Sales & Leads     WhatsApp Guest   Voice Concierge             │
│                     Concierge                                     │
│   ├─ Inbox          ├─ FAQ 24/7      ├─ Call Logs                │
│   ├─ Pipeline       ├─ Availability  ├─ Settings                 │
│   ├─ Follow-ups     ├─ Confirm       ├─ Analytics                │
│   ├─ Conversations  ├─ Reminders     └─ Reception Hours          │
│   └─ Templates      └─ Coexistence                               │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                       👁️ OSIRIS.AI                               │
│                  Operations & Control                            │
│   • Bookings  • Payments  • Alerts  • Analytics  • Workflows     │
│                                                                   │
│         "The owner supervises. The system executes."             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 DEFINICIÓN DE CADA AGENTE

### 1. 🌟 LUMINA.AI - Sales & Leads

**Rol:** Transforma consultas en reservas confirmadas

**Scope:**
- Lead capture (Instagram, WhatsApp, Email, Web, VAPI)
- Pipeline CRM (6 stages)
- AI Sales Assistant (availability, pricing tools)
- Follow-up automation
- Omnichannel conversations
- Message templates

**Workflows:**
- ✅ WF-SP-01 Inbound Lead Handler (`CBiOKCQ7eGnTJXQd`)
- ❌ WF-SP-02 AI Sales Assistant (PENDIENTE - CRÍTICO)
- ✅ WF-SP-03 Follow-Up Engine (`HndGXnQAEyaYDKFZ`)

**Pipeline Stages:**
```
New → Qualified → Proposal/Summary → Pending Decision → Won/Booked → Lost
```

**UI Screens:**
- Inbox (New Leads)
- Pipeline (Kanban drag & drop)
- Follow-ups (Sequence library)
- Conversations (Omnichannel thread)
- Templates (Message templates con variables)

---

### 2. 💧 BANYU.AI - WhatsApp Guest Concierge

**Rol:** Asistente de huéspedes 24/7 vía WhatsApp

**Scope:**
- Responder FAQ automáticamente
- Verificar disponibilidad en tiempo real
- Enviar confirmaciones
- Reminders pre-check-in
- Coexistence con owner (mismo WhatsApp)

**Workflows:**
- ✅ WhatsApp AI Concierge (existente)
- ✅ Guest Journey Scheduler (existente)

**Características:**
- AI prompt customizado por property
- Tools: check_availability, calculate_price, create_booking
- Memoria de conversación
- Handoff inteligente a owner cuando es necesario

**UI:**
- Guest Communications
- Guest Database / CRM
- Guest Analytics
- Marketing Campaigns

---

### 3. 📞 KORA.AI - Voice Concierge

**Rol:** Atiende llamadas cuando recepción está cerrada

**Scope:**
- Maneja llamadas fuera de horario
- Responde disponibilidad y precios por voz
- Usa VAPI structured outputs
- Envía resúmenes por WhatsApp/Email
- Handoff a staff cuando es necesario

**Workflows:**
- ❌ WF-VA-01 Voice Intake (PENDIENTE)

**VAPI Structured Output Schema:**
```json
{
  "intent": "availability|price_quote|booking|transfer|voicemail",
  "dates": {"check_in": "date", "check_out": "date"},
  "guests": integer,
  "notes": "string",
  "action": "send_wa_summary|send_email_quote|create_hold_booking|request_callback"
}
```

**UI Screens:**
- Call Logs (tabla de llamadas)
- Settings (reception hours, handoff rules)
- Analytics (call stats)

**Branching por Intent:**
- `availability` / `price_quote` → Check tools → Send WA/Email summary
- `booking` → Create hold booking → Confirmation
- `transfer` → Trigger staff call hook
- `voicemail` → Create owner task + Store transcript

---

### 4. 👁️ OSIRIS.AI - Operations & Control

**Rol:** Dashboard owner, supervisión y control

**Scope:**
- Bookings overview
- Payments & revenue tracking
- Guest status monitoring
- Alerts & exceptions
- Analytics & reports
- Workflow management

**Philosophy:**
> "The owner supervises. The system executes."

**UI:**
- Dashboard Owner (Executive Summary)
- AI Assistant (chat with AI for insights)
- AI Agents Monitor (WhatsApp + VAPI monitoring)
- Workflows & Automations
- My Site (website builder)

---

## 🔄 WORKFLOW MAPPING

### LUMINA.AI Workflows

| Workflow | ID | Estado | Descripción |
|----------|-----|--------|-------------|
| **WF-SP-01** Inbound Lead Handler | `CBiOKCQ7eGnTJXQd` | ✅ ACTIVO | Webhook → normalize → upsert lead → create conversation |
| **WF-SP-02** AI Sales Assistant | - | ❌ PENDIENTE | AI reasoning + tools (availability, price) → reply + suggestions |
| **WF-SP-03** Follow-Up Engine | `HndGXnQAEyaYDKFZ` | ✅ ACTIVO | CRON → sequence_enrollments → send messages → update |

### KORA.AI Workflows

| Workflow | ID | Estado | Descripción |
|----------|-----|--------|-------------|
| **WF-VA-01** Voice Intake | - | ❌ PENDIENTE | VAPI webhook → branching por intent → actions → log call |

### BANYU.AI Workflows

| Workflow | Estado | Descripción |
|----------|--------|-------------|
| WhatsApp AI Concierge | ✅ ACTIVO | AI 24/7 para guests |
| Guest Journey Scheduler | ✅ ACTIVO | 5 fases automatizadas |

### OSIRIS.AI Workflows

| Workflow | Estado | Descripción |
|----------|--------|-------------|
| Owner Daily Intelligence | ✅ ACTIVO | Resumen diario al owner |
| MCP Central | ✅ ACTIVO | Central orchestrator |

---

## 🗄️ DATA MODEL SUPABASE

### Tablas LUMINA.AI

```sql
-- Core leads
leads (id, tenant_id, channel, external_id, name, email, phone,
       message, stage, owner_id, created_at, updated_at)

lead_events (id, lead_id, type, channel, payload_json, created_at)

-- Conversations
conversations (id, lead_id, channel, last_message_at)
messages (id, conversation_id, direction, channel, body, template_id,
          sent_at, status, meta_json)

-- Sequences
sequences (id, tenant_id, name, steps_json)
sequence_enrollments (id, lead_id, sequence_id, current_step,
                      next_action_at, status)

-- Templates
templates (id, tenant_id, name, channel, body, variables_json)

-- Autonomy
autonomy_policies (id, property_id, can_send_without_approval,
                   max_discount_percent, max_followups, quiet_hours, ...)
```

### Tablas KORA.AI

```sql
call_logs (id, tenant_id, call_id, caller, intent, payload_json,
           outcome, created_at)

call_messages (id, call_log_id, channel, body, sent_at, meta_json)
```

### Tablas BANYU.AI (existentes)

```sql
bookings, guests, guest_journeys, properties, tenants, users
```

### Tablas OSIRIS.AI (existentes)

```sql
-- Usa las mismas tablas que BANYU + LUMINA para monitoreo
```

---

## 📱 NAVEGACIÓN UI (SIDEBAR)

```
├── Overview (OSIRIS.AI)
├── Operations & Guests
│   ├── Dashboard
│   ├── Properties
│   ├── Bookings
│   ├── Calendar
│   └── Guests
│
├── Revenue & Pricing
│   ├── Payments
│   ├── Smart Pricing
│   ├── Reports
│   └── Channel Integration
│
├── 🌟 LUMINA.AI (Sales & Leads)
│   ├── Inbox (New Leads)
│   ├── Pipeline
│   ├── Follow-ups
│   ├── Conversations
│   └── Templates
│
├── 📞 KORA.AI (Voice Concierge)
│   ├── Call Logs
│   ├── Settings
│   └── Analytics
│
├── Marketing & Growth
│   ├── Overview
│   ├── Meta Ads
│   ├── Content Planner
│   ├── Creative Studio (Soon)
│   ├── Reviews Management
│   └── Insights
│
├── Market Intelligence
│   ├── Competitors Snapshot
│   ├── Bali Market Trends
│   ├── Alerts
│   └── AI Recommendations
│
├── 👁️ OSIRIS.AI (Operations & Control)
│   ├── AI Assistant
│   ├── AI Agents Monitor
│   ├── Workflows & Automations
│   └── My Site
│
├── 💧 BANYU.AI (WhatsApp Guest Concierge)
│   ├── Guest Database / CRM
│   ├── Guest Communications
│   ├── Guest Analytics
│   ├── Marketing Campaigns
│   ├── Meta Ads (Instagram + Facebook)
│   ├── Reviews Management
│   ├── Create My Website
│   ├── Booking Engine Config
│   └── Digital Check-in Setup
│
└── Settings
```

---

## 🔧 SHARED TOOLS (MCP Central)

Todos los agentes comparten estos tools:

| Tool | Función | Usado por |
|------|---------|-----------|
| `check_availability` | Verifica disponibilidad | LUMINA, KORA, BANYU |
| `calculate_price` | Calcula precio | LUMINA, KORA, BANYU |
| `create_booking` | Crea reserva | LUMINA, KORA |

**Single Source of Truth:**
- Property Factsheet (brand tone, facts, pricing rules, FAQ)
- Mismo documento para LUMINA, BANYU, KORA

---

## 📊 ACCEPTANCE CRITERIA

### ✅ LUMINA.AI

- [ ] Drag & drop pipeline works and persists stage
- [ ] AI reply can fetch availability/price via tools
- [ ] AI returns draft with variables filled
- [ ] Follow-up Engine triggers messages at scheduled times
- [ ] Omnichannel thread shows WA + Email (IG/FB stub OK)
- [ ] Metrics visible: New leads (7d), Conversion rate (30d), Avg response time

### ✅ KORA.AI

- [ ] Calls outside reception hours handled by AI
- [ ] During hours, follow handoff rule
- [ ] Structured outputs validated against schema
- [ ] Errors surfaced in UI
- [ ] Each call produces log row
- [ ] If action involves guest comms → WA/Email sent and visible in timeline
- [ ] "Call Summary" attaches to lead if same phone number

### ✅ BANYU.AI

- [ ] Responde FAQ 24/7
- [ ] Verifica disponibilidad en tiempo real
- [ ] Envía confirmaciones automáticas
- [ ] Coexistence con owner funciona (no spamea)
- [ ] Handoff a owner cuando es necesario

### ✅ OSIRIS.AI

- [ ] Dashboard muestra KPIs actualizados
- [ ] Alerts funcionan y se notifican
- [ ] Workflows monitorizables desde UI
- [ ] AI Assistant responde preguntas del owner

---

## 🔴 PENDIENTES PRIORIZADOS

### CRÍTICO (Esta semana)

| # | Tarea | Tiempo Est. | Módulo |
|---|-------|-------------|--------|
| 1 | Crear tablas Supabase LUMINA | 1h | Supabase |
| 2 | Crear tablas Supabase KORA | 30min | Supabase |
| 3 | Crear WF-SP-02 AI Sales Assistant | 4h | n8n |
| 4 | Conectar WF-SP-01 → WF-SP-02 | 30min | n8n |
| 5 | Crear WF-VA-01 Voice Intake | 2h | n8n |

### IMPORTANTE (Próximas 2 semanas)

| # | Tarea | Módulo |
|---|-------|--------|
| 6 | UI: LUMINA screens (Inbox, Pipeline, Conversations) | React |
| 7 | UI: KORA screen (Call logs, Settings) | React |
| 8 | WF-SOC-01 Social Content Engine | n8n |
| 9 | Configurar Buffer + IG/FB | Buffer |

### DESPUÉS

| # | Tarea |
|---|-------|
| 10 | WF-SOC-02 Meta DMs → LUMINA |
| 11 | Market Intelligence |
| 12 | TikTok integration |

---

## 📞 INFO IZUMI HOTEL

| Campo | Valor |
|-------|-------|
| **Property ID** | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| **Tenant ID** | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| **WhatsApp** | +62 813 2576 4867 |
| **Owner Test** | +34 619 794 604 |
| **n8n** | https://n8n-production-bb2d.up.railway.app |
| **Supabase** | https://jjpscimtxrudtepzwhag.supabase.co |
| **App Live** | https://my-host-bizmate.vercel.app |

---

## 🔄 STACK TÉCNICO

```
Frontend: React 18.2 + Vite + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + RPC)
Workflows: n8n en Railway (v1.123.5)
WhatsApp: Chakra HQ API
Voice: VAPI.ai
Email: SendGrid
Social: Buffer (pendiente)
```

---

## 📝 CAMBIOS APLICADOS HOY (11 Enero 2026)

### Sidebar.jsx - Nomenclatura Final

**ANTES:**
```
SALES & LEADS
OSIRIS.AI (Owner & Operations Agent)
BANYU.AI (Guest & Marketing Agent)
```

**DESPUÉS:**
```
🌟 LUMINA.AI (Sales & Leads)
📞 KORA.AI (Voice Concierge)  [NUEVO]
👁️ OSIRIS.AI (Operations & Control)
💧 BANYU.AI (WhatsApp Guest Concierge)
```

### Sección KORA.AI Añadida

```jsx
{
  sectionId: 'kora-ai',
  sectionLabel: '📞 KORA.AI (Voice Concierge)',
  sectionIcon: PhoneCall,
  collapsible: true,
  items: [
    { id: 'kora-call-logs', label: 'Call Logs', icon: Phone },
    { id: 'kora-settings', label: 'Settings', icon: Settings },
    { id: 'kora-analytics', label: 'Analytics', icon: BarChart3 }
  ]
}
```

---

## ✅ VERIFICACIÓN DE ARQUITECTURA

**4 Agentes definidos:** ✅
- LUMINA.AI (Sales & Leads)
- BANYU.AI (WhatsApp Guest Concierge)
- KORA.AI (Voice Concierge)
- OSIRIS.AI (Operations & Control)

**Workflows mapeados:** ✅
- WF-SP-01, WF-SP-02, WF-SP-03 → LUMINA
- WF-VA-01 → KORA
- WhatsApp Concierge, Guest Journey → BANYU
- Owner Intelligence, MCP Central → OSIRIS

**Naming consistente:** ✅
- Sidebar actualizado
- Documentación alineada
- No versioning (no v1/v2)

**No breaking changes:** ✅
- Workflows existentes NO modificados
- Supabase schema NO cambiado
- Solo renaming y reorganización UI

---

## 🚨 RECORDATORIOS IMPORTANTES

### ⚠️ NO HACER

1. ❌ NO redesign architecture
2. ❌ NO split into versions (v1/v2)
3. ❌ NO refactor existing workflows
4. ❌ NO change Supabase structure
5. ❌ NO modify workflows que ya funcionan

### ✅ SÍ HACER

1. ✅ Usar nombres finales (LUMINA, BANYU, KORA, OSIRIS)
2. ✅ Implementar workflows completos directamente (no MVP/versiones)
3. ✅ Mantener consistencia en toda la documentación
4. ✅ Seguir el plan de tablas Supabase definido
5. ✅ Testear cada agente según acceptance criteria

---

**Este documento es la REFERENCIA FINAL para la arquitectura de agentes IA.**

**Cualquier duda sobre nombres, scope o responsabilidades → consultar este documento.**

---

*Versión: 4.0 Final*
*Fecha: 11 Enero 2026*
*Aplicado: 11 Enero 2026*
*Agentes: LUMINA.AI | BANYU.AI | KORA.AI | OSIRIS.AI*
