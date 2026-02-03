# ARQUITECTURA COMPLETA DEL SISTEMA MY HOST BizMate
## Flujo Real de Leads & Guest Journey

**Fecha:** 22 Enero 2026 (actualizado)
**IMPORTANTE:** Esta es la arquitectura REAL del sistema

---

## 🎯 PRINCIPIO FUNDAMENTAL

**LUMINA.AI NO ES UN CHAT CONVERSACIONAL**

LUMINA es un **Lead Intelligence & Sales Orchestrator**:
- ✅ Analiza leads
- ✅ Decide next actions
- ✅ Orquesta workflows
- ❌ NO conversa con leads
- ❌ NO hace reservas
- ❌ NO calcula precios

**Quienes conversan:** BANYU.AI (WhatsApp) y KORA.AI (Voice)
**Quien orquesta:** LUMINA.AI (inteligencia detrás de escena)

---

## 📊 DIAGRAMA VISUAL COMPLETO

```
┌───────────────────────────────────────────────┐
│           CANALES DE ENTRADA (REALIDAD)        │
├───────────────────────────────────────────────┤
│  BANYU.AI  │  KORA.AI  │  Web  │  IG/FB │ OTA │
│ (WhatsApp) │ (Voice)   │ Forms │ Msgs   │     │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│        [01] INBOUND LEAD HANDLER               │
├───────────────────────────────────────────────┤
│ - Recibe leads desde TODOS los canales         │
│ - Normaliza datos                              │
│ - Deduplica                                   │
│ - Añade source / timestamps / metadata        │
│ - Crea o actualiza el lead                    │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│        [02] LUMINA.AI                          │
│   Lead Intelligence / Sales Orchestrator      │
├───────────────────────────────────────────────┤
│ - Analiza estado del lead                     │
│   (booked / interested / cold / not_fit)      │
│ - Decide el siguiente paso                    │
│ - NO conversa                                 │
│ - NO reserva                                  │
│ - NO calcula precios                          │
└───────────────────────────────────────────────┘
            │                              │
            │                              │
            ▼                              ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│   IF BOOKED                  │   │ IF NOT BOOKED                │
│                              │   │ (interested / cold)          │
▼                              ▼   ▼                              ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ [05] GUEST JOURNEY           │   │ [04] FOLLOW-UP ENGINE         │
├──────────────────────────────┤   ├──────────────────────────────┤
│ - Pre-arrival                │   │ - Secuencias automáticas      │
│ - Arrival                    │   │ - T+2h / 24h / 72h / 7d       │
│ - In-stay                    │   │ - Re-engagement suave         │
│ - Check-out                  │   │   o reservar                  │
│ - Post-stay                  │   │ - Se detiene al responder     │
└──────────────────────────────┘   └──────────────────────────────┘
            │                              │
            │                              │
            ▼                              ▼
┌────────────────────────────────────────────────┐
│      BANYU.AI / KORA.AI (EJECUCIÓN)            │
├────────────────────────────────────────────────┤
│ - Envían mensajes WhatsApp                     │
│ - Hacen llamadas de voz                        │
│ - Confirman reservas                          │
│ - Devuelven eventos al sistema                │
└────────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│        [03] OSIRIS.AI                          │
│      Operations & Control                     │
├───────────────────────────────────────────────┤
│ - Crear tasks (housekeeping / maintenance)    │
│ - Alertas                                     │
│ - Escalaciones                                │
│ - Reporting                                  │
└───────────────────────────────────────────────┘
```

---

## 🔄 FLUJO COMPLETO (ORDEN CORRECTO)

### PASO 1: CANALES DE ENTRADA (PRIMERO, SIEMPRE)
```
- BANYU.AI (WhatsApp)
- KORA.AI (Voice)
- Web forms
- Instagram / Facebook
- OTAs (Booking, Airbnb, etc.)
- 📋 ENTRADA MANUAL (pendiente implementar)
```

### PASO 2: [01] INBOUND LEAD HANDLER
**Función:** Punto de entrada único para TODOS los canales

**Acciones:**
- Recibe eventos desde TODOS los canales
- Normaliza datos del lead (nombre, teléfono, email, fechas)
- Crea / actualiza lead record en Supabase
- Deduplica (evita leads duplicados por múltiples canales)
- Añade metadata:
  - `source`: 'whatsapp', 'vapi', 'web', 'instagram', 'booking.com', 'manual'
  - `channel`: 'banyu', 'kora', 'web', 'ota', 'manual'
  - `timestamps`: first_contact, last_contact
  - `conversation_id`: para trackear thread

**Output:** Lead normalizado en tabla `leads`

**Estado actual:** ✅ Existe (WF-03-LEAD-HANDLER)

---

### PASO 3: [02] LUMINA.AI - Lead Intelligence

**Función:** Orquestador de inteligencia (NO conversacional)

**Analiza:**
```javascript
lead.status = analyze({
  conversation_history,
  booking_intent,
  responsiveness,
  budget_fit,
  dates_availability
}) → 'booked' | 'interested' | 'cold' | 'not_fit'
```

**Decide next_action:**
```javascript
if (lead.status === 'booked') {
  → Trigger [05] Guest Journey
} else if (lead.status === 'interested') {
  → Trigger [04] Follow-up Engine (T+2h)
} else if (lead.status === 'cold') {
  → Trigger [04] Follow-up Engine (T+72h, light touch)
} else {
  → Archive (not_fit)
}
```

**NO hace:**
- ❌ NO conversa directamente con el lead
- ❌ NO hace reservas
- ❌ NO calcula precios
- ❌ NO envía mensajes

**SÍ hace:**
- ✅ Analiza y clasifica leads
- ✅ Decide next steps
- ✅ Trigger workflows
- ✅ Score leads (0-100)
- ✅ Detecta patterns

**Estado actual:** 📋 A implementar (23 Enero 2026)

---

### PASO 4A: [04] FOLLOW-UP ENGINE (Si NOT booked)

**Función:** Secuencias automáticas de follow-up

**Timings:**
```
Lead created → T+2h  → "Thanks for reaching out..."
            → T+24h → "Still available, any questions?"
            → T+72h → "Special offer this week..."
            → T+7d  → "Gentle reminder, dates filling up..."
```

**Reglas:**
- Se detiene al responder o reservar
- Re-engagement suave (no spam)
- Personalizado según conversación previa
- Respeta timezone del lead

**Ejecutor:** BANYU.AI (WhatsApp) o KORA.AI (Voice)

**Estado actual:** 📋 A implementar

---

### PASO 4B: [05] GUEST JOURNEY (Si booked)

**Función:** Experiencia del huésped desde confirmación hasta post-stay

**Fases:**
```
1. PRE-ARRIVAL (confirmed → check-in)
   - T-7d: Welcome message + pre-arrival info
   - T-3d: Check-in instructions
   - T-1d: Final reminder + contact info

2. ARRIVAL (check-in day)
   - Check-in confirmation
   - Welcome pack digital
   - Emergency contacts

3. IN-STAY (check-in → check-out)
   - Day 2: "How's your stay?"
   - Daily: Available for questions
   - Proactive: Weather alerts, recommendations

4. CHECK-OUT (check-out day)
   - Checkout instructions
   - Feedback request
   - Review invitation

5. POST-STAY (after checkout)
   - T+1d: Thank you message
   - T+3d: Review reminder (gentle)
   - T+30d: "Come back?" re-engagement
```

**Ejecutor:** BANYU.AI (WhatsApp) principalmente

**Estado actual:** 📋 A implementar

---

### PASO 5: BANYU.AI / KORA.AI (EJECUCIÓN)

**Función:** Ejecutan las acciones decididas por LUMINA

**BANYU.AI (WhatsApp):**
- Envía mensajes automáticos (follow-ups, guest journey)
- Responde preguntas en tiempo real
- Confirma reservas
- Envía documentos (invoices, guides)

**KORA.AI (Voice):**
- Recibe llamadas de phone leads
- Hace llamadas de follow-up (si configurado)
- Confirma reservas por teléfono
- Captura información del lead

**Ambos devuelven eventos al sistema:**
```javascript
{
  event_type: 'message_sent' | 'lead_responded' | 'booking_confirmed',
  lead_id: 'uuid',
  data: {...}
}
```

**Estado actual:** ✅ BANYU y KORA funcionando

---

### PASO 6: [03] OSIRIS.AI (Operations)

**Función:** Control de operaciones (para el owner)

**Cuando se activa:**
- Lead confirmado → crear tasks de preparación
- Check-in próximo → alertas housekeeping
- Issues durante stay → escalaciones
- Check-out → inspection tasks

**Acciones:**
```javascript
- create_task(type: 'housekeeping', priority: 'high')
- create_alert(severity: 'critical', message: '...')
- escalate_issue(to: 'owner', issue: '...')
- generate_report(type: 'daily_operations')
```

**Estado actual:** ✅ Funcionando (completado 22 Enero)

---

## 📋 ENTRADA MANUAL DE DATOS (PENDIENTE)

### Problema identificado:
No todos los leads llegan por canales automáticos. El owner/staff necesita:
- Registrar bookings tomados por teléfono
- Añadir leads de walk-ins
- Registrar reservas de OTAs manualmente
- Añadir notas a leads existentes

### Solución a implementar (23 Enero):

#### Opción A: Form en Dashboard
```
Dashboard → "Add Lead Manually"
├─ Campos: name, phone, email, source, dates, notes
├─ Submit → POST to [01] Inbound Lead Handler
└─ LUMINA procesa como cualquier otro lead
```

#### Opción B: Quick Add en OSIRIS
```
OSIRIS chat: "Register new booking for John Doe..."
├─ OSIRIS extrae datos del mensaje
├─ Valida campos obligatorios
├─ Crea lead en sistema
└─ Confirma con el owner
```

#### Opción C: Spreadsheet Import
```
Upload CSV/Excel → Parse → Validate → Create leads en batch
```

**Decisión pendiente:** Discutir mañana (23 Enero)

---

## 🎯 ROLES DE CADA AGENTE (CLARIFICADO)

### KORA.AI (Voice Assistant)
**ROL:** Recepcionist de voz 24/7
**HACE:**
- ✅ Responde llamadas
- ✅ Captura lead info
- ✅ Confirma disponibilidad
- ✅ Hace reservas
**NO HACE:**
- ❌ Follow-ups automáticos (eso es LUMINA → KORA)
- ❌ Analiza pipeline

---

### BANYU.AI (WhatsApp Concierge)
**ROL:** Concierge WhatsApp 24/7
**HACE:**
- ✅ Responde mensajes WhatsApp
- ✅ Captura lead info
- ✅ Confirma disponibilidad
- ✅ Hace reservas
- ✅ Envía mensajes programados (trigger desde LUMINA)
**NO HACE:**
- ❌ Decide cuándo hacer follow-up (eso es LUMINA)
- ❌ Analiza pipeline

---

### LUMINA.AI (Lead Intelligence)
**ROL:** Orquestador de sales & leads (backend, NO conversacional)
**HACE:**
- ✅ Analiza todos los leads
- ✅ Clasifica (booked/interested/cold/not_fit)
- ✅ Decide next actions
- ✅ Trigger workflows (follow-up engine, guest journey)
- ✅ Lead scoring
- ✅ Pipeline analytics
**NO HACE:**
- ❌ Conversa con leads (eso es BANYU/KORA)
- ❌ Envía mensajes directamente
- ❌ Hace reservas

---

### OSIRIS.AI (Operations)
**ROL:** Director de operaciones (conversacional con owner)
**HACE:**
- ✅ Responde preguntas del owner
- ✅ Genera reportes
- ✅ Crea tasks
- ✅ Alertas y escalaciones
**NO HACE:**
- ❌ Interactúa con guests/leads
- ❌ Hace reservas

---

### AURA.AI (Content Creator) - Futuro
**ROL:** Generador de contenido marketing
**HACE:**
- ✅ Genera posts para IG/FB
- ✅ Drafts emails campaigns
- ✅ Copywriting
**NO HACE:**
- ❌ Publica directamente (necesita aprobación)

---

### HESTIA.AI (Guest Experience) - Futuro
**ROL:** Analizador de experiencia del huésped
**HACE:**
- ✅ Analiza feedback
- ✅ Detecta patterns
- ✅ Propone mejoras
**NO HACE:**
- ❌ Conversa con guests (eso es BANYU)

---

## 🔄 FLUJO EJEMPLO COMPLETO

### Ejemplo 1: Lead desde WhatsApp → Booking confirmado

```
1. Guest: "Hi, I'm looking for a villa for Feb 10-15"
   → BANYU.AI responde
   → Crea lead en sistema via [01] Inbound Lead Handler

2. [02] LUMINA analiza:
   - status: 'interested'
   - score: 75
   - next_action: 'follow_up_in_2h'

3. T+2h (si no responde):
   → [04] Follow-up Engine trigger
   → BANYU.AI envía: "Still interested? I can check availability"

4. Guest: "Yes please, for 4 people"
   → BANYU.AI verifica disponibilidad
   → Confirma booking
   → Update lead status = 'booked'

5. [02] LUMINA detecta booking:
   → status: 'booked'
   → Trigger [05] Guest Journey (Pre-arrival phase)

6. T-7d antes check-in:
   → [05] Guest Journey trigger
   → BANYU.AI envía welcome message

7. Check-in day:
   → [03] OSIRIS crea housekeeping task
   → BANYU.AI envía check-in instructions

8. Durante stay:
   → BANYU.AI available para preguntas
   → [03] OSIRIS monitorea operaciones

9. Check-out:
   → BANYU.AI pide feedback
   → [05] Guest Journey: Post-stay phase

10. T+3d:
    → BANYU.AI gentle review request
```

---

### Ejemplo 2: Lead desde KORA (Voice) → No convierte

```
1. Guest llama:
   → KORA.AI responde
   → Captura info
   → Crea lead via [01] Inbound Lead Handler

2. [02] LUMINA analiza:
   - status: 'interested'
   - score: 60 (presupuesto ajustado)
   - next_action: 'follow_up_in_24h'

3. T+24h (no responde):
   → [04] Follow-up Engine trigger
   → BANYU.AI: "Hi John, following up on our call..."

4. T+72h (no responde):
   → [04] Follow-up Engine trigger
   → BANYU.AI: "Special offer this week..."

5. T+7d (no responde):
   → [02] LUMINA re-clasifica:
     - status: 'cold'
   → [04] Light touch follow-up (T+30d)

6. Si responde en cualquier momento:
   → [02] LUMINA re-activa
   → Back to active pipeline
```

---

## 📊 TABLAS SUPABASE NECESARIAS

### Ya existen:
```sql
- leads (core)
- lead_events (historial)
- bookings (conversiones)
- properties (inventario)
- payments (transacciones)
- ai_chat_history_v2 (logs conversaciones)
- audit_logs (auditoría)
```

### A crear (para LUMINA + workflows):
```sql
-- Follow-up sequences
CREATE TABLE followup_sequences (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  sequence_type TEXT, -- 'interested', 'cold', 'reengagement'
  step INTEGER, -- 1, 2, 3, 4...
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  status TEXT -- 'pending', 'sent', 'cancelled'
);

-- Guest journey stages
CREATE TABLE guest_journey_stages (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  stage TEXT, -- 'pre_arrival', 'arrival', 'in_stay', 'checkout', 'post_stay'
  step INTEGER,
  scheduled_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ,
  status TEXT
);

-- LUMINA decisions log
CREATE TABLE lumina_decisions (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  decision_type TEXT, -- 'classification', 'next_action', 'scoring'
  input_data JSONB,
  output_data JSONB,
  confidence DECIMAL,
  created_at TIMESTAMPTZ
);
```

---

## 🎯 IMPLEMENTACIÓN PRIORIZADA

### Fase 1 (23 Enero): LUMINA Core
- [ ] [02] LUMINA.AI - Lead Intelligence (backend)
- [ ] Entrada manual de datos (dashboard form)
- [ ] Integración LUMINA con leads existentes

### Fase 2 (24-25 Enero): Follow-up Engine
- [ ] [04] Follow-up Engine
- [ ] Secuencias automáticas (T+2h, 24h, 72h, 7d)
- [ ] Integration LUMINA → BANYU

### Fase 3 (26-27 Enero): Guest Journey
- [ ] [05] Guest Journey workflows
- [ ] Pre-arrival sequence
- [ ] In-stay monitoring
- [ ] Post-stay engagement

### Fase 4 (28-31 Enero): Optimización
- [ ] A/B testing sequences
- [ ] Lead scoring refinement
- [ ] Dashboard analytics LUMINA

---

## 💡 DECISIÓN ARQUITECTÓNICA LUMINA (Actualizada)

Dado que LUMINA **NO es conversacional**, la arquitectura es clara:

**LUMINA debe estar en n8n (NO en frontend)**

**Por qué:**
- Es un proceso backend (no necesita latencia baja)
- Trigger automático desde [01] Inbound Lead Handler
- Ejecuta workflows (follow-up, guest journey)
- No interactúa con el owner en tiempo real

**Arquitectura correcta:**
```
Lead created
   ↓
[01] Inbound Lead Handler (n8n)
   ↓
[02] LUMINA.AI (n8n workflow)
   ↓
Trigger actions:
   → [04] Follow-up Engine (n8n)
   → [05] Guest Journey (n8n)
   ↓
BANYU/KORA execute (send messages)
```

**Owner interaction con LUMINA:**
- Via OSIRIS chat: "Show me hot leads"
- Via Dashboard: LUMINA analytics panel
- NO necesita chat directo con LUMINA

---

## 📞 PRÓXIMOS PASOS (23 ENERO)

1. **Implementar entrada manual de datos**
   - Form en dashboard
   - POST to [01] Inbound Lead Handler

2. **Crear [02] LUMINA.AI workflow**
   - Lead classification logic
   - Decision engine
   - Integration con [04] y [05]

3. **Dashboard LUMINA (en OSIRIS)**
   - "Show hot leads"
   - "Conversion stats"
   - "Pipeline overview"

---

**Última actualización:** 22 Enero 2026 - 21:45 WIB
**Próxima sesión:** 23 Enero 2026
**Prioridad:** Entrada manual + LUMINA Core
