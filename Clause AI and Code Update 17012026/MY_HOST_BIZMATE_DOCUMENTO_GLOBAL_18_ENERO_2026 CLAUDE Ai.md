# MY HOST BIZMATE - DOCUMENTO GLOBAL DEL PROYECTO
## Actualizado: 17 Enero 2026 (para sesión 18 Enero)
## Para: Claude AI + Claude Code

---

# 1. VISIÓN DEL PROYECTO

## 1.1 ¿Qué es MY HOST BizMate?
Plataforma SaaS de automatización inteligente para hoteles boutique y villas en el Sudeste Asiático, especialmente Bali e Indonesia.

## 1.2 Propuesta de Valor
- **4 Agentes AI** trabajando 24/7
- **Automatización completa** del guest journey
- **Multi-canal**: WhatsApp, Voice, Email, Instagram, Web
- **Diseñado para** propiedades pequeñas (5-20 habitaciones)

## 1.3 Cliente Piloto
- **Nombre:** Izumi Hotel
- **Ubicación:** Ubud, Bali, Indonesia
- **Tipo:** 7 villas de lujo
- **Apertura:** Verano 2026
- **Tenant ID:** `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- **Property ID:** `18711359-1378-4d12-9ea6-fb31c0b1bac2`

---

# 2. LOS 4 AGENTES AI

## 2.1 LUMINA.AI - Sales & Lead Intelligence (ORQUESTADOR)
**Rol:** Cerebro del sistema. Analiza y decide, NO ejecuta.

**Funciones:**
- Analiza estado del lead: `booked | interested | cold | not_fit`
- Decide next_action
- NO conversa directamente
- NO reserva
- NO calcula precios

**Métricas (RPC: `get_lumina_stats`):**
- new_leads (state = 'NEW')
- in_pipeline (ENGAGED, HOT, FOLLOWING_UP)
- pending_followups (next 24h)

---

## 2.2 BANYU.AI - WhatsApp Concierge (EJECUTOR)
**Rol:** Comunicación por WhatsApp. Ejecuta lo que LUMINA decide.

**Funciones:**
- Responde mensajes WhatsApp
- Envía follow-ups
- Confirma reservas
- Maneja multimedia (fotos, voice, PDFs)

**Integración:** ChakraHQ API
**Workflow:** `ORTMMLk6qVKFhELp` (INACTIVO - activar mañana)

**Métricas (RPC: `get_banyu_stats`):**
- messages_today
- active_conversations
- avg_response_time_minutes

---

## 2.3 KORA.AI - Voice Concierge (EJECUTOR)
**Rol:** Llamadas de voz con IA. Ejecuta lo que LUMINA decide.

**Funciones:**
- Atiende llamadas entrantes 24/7
- Extrae datos estructurados (Structured Outputs)
- Crea leads automáticamente
- Multilenguaje (EN/ES/ID)

**Integración:** VAPI
**Assistant ID:** `ae9ea22a-fc9a-49ba-b5b8-900ed69b7615`
**Workflow Post-Call:** `GIYbLfAkTrI7gHPH` (ACTIVO ✅)

**Métricas (RPC: `get_kora_stats`):**
- calls_today
- avg_duration_seconds
- positive_sentiment_pct

---

## 2.4 OSIRIS.AI - Operations & Control
**Rol:** Centro de operaciones y monitoreo.

**Funciones:**
- Crear tasks (housekeeping, maintenance)
- Gestionar alertas
- Escalaciones
- Reporting

**Métricas (RPC: `get_osiris_stats`):**
- active_workflows
- active_alerts
- system_health ('good' | 'warning' | 'error')

---

# 3. ARQUITECTURA DE FLUJOS (CRÍTICO)

## 3.1 Diagrama Principal

```
┌───────────────────────────────────────────────┐
│           CANALES DE ENTRADA                   │
├───────────────────────────────────────────────┤
│  BANYU.AI  │  KORA.AI  │  Web  │  IG/FB │ OTA │
│ (WhatsApp) │  (Voice)  │ Forms │  DMs   │     │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│      [WF-01] INBOUND LEAD HANDLER              │
│  (WF-SP-01 - ID: BX2X9P1xvZBnpr1p)            │
├───────────────────────────────────────────────┤
│ • Recibe leads desde TODOS los canales         │
│ • Normaliza datos (Master Event v1.0)          │
│ • Deduplica por phone/email                    │
│ • Crea o actualiza lead en Supabase            │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│      [WF-02] LUMINA.AI - ORCHESTRATOR          │
├───────────────────────────────────────────────┤
│ • Analiza estado del lead                      │
│ • Decide: BOOKED vs NOT BOOKED                 │
│ • NO conversa, NO reserva                      │
└───────────────────────────────────────────────┘
            │                              │
            ▼                              ▼
     IF BOOKED                      IF NOT BOOKED
            │                              │
            ▼                              ▼
┌─────────────────────┐      ┌─────────────────────┐
│ [WF-05] GUEST       │      │ [WF-04] FOLLOW-UP   │
│ JOURNEY             │      │ ENGINE              │
├─────────────────────┤      ├─────────────────────┤
│ • Pre-arrival (T-3d)│      │ • T+2h: Follow #1   │
│ • Arrival day       │      │ • T+24h: Follow #2  │
│ • In-stay           │      │ • T+72h: Follow #3  │
│ • Check-out         │      │ • T+7d: Re-engage   │
│ • Post-stay         │      │ • STOP si responde  │
└─────────────────────┘      └─────────────────────┘
            │                              │
            └──────────────┬───────────────┘
                           ▼
┌───────────────────────────────────────────────┐
│      BANYU / KORA (EJECUCIÓN)                  │
├───────────────────────────────────────────────┤
│ • Envían mensajes WhatsApp                     │
│ • Hacen llamadas de voz                        │
│ • Devuelven eventos al sistema                 │
└───────────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────────┐
│      [WF-03] OSIRIS.AI - OPERATIONS            │
├───────────────────────────────────────────────┤
│ • Tasks (housekeeping/maintenance)             │
│ • Alertas y escalaciones                       │
│ • Reporting                                    │
└───────────────────────────────────────────────┘
```

## 3.2 Regla de Oro
```
CUALQUIER CANAL → Master Event v1.0 → WF-SP-01 → Supabase
```

---

# 4. MASTER EVENT v1.0 (ESTRUCTURA ESTÁNDAR)

```json
{
  "event_type": "new_lead | lead_update | booking_inquiry",
  "source": {
    "channel": "whatsapp | vapi | instagram | web | email",
    "agent": "BANYU | KORA | WEB | MANUAL",
    "original_event_id": "string"
  },
  "lead": {
    "name": "string | null",
    "phone": "string | null",
    "email": "string | null",
    "language": "en | es | id"
  },
  "intent": {
    "type": "booking | info | pricing | availability | complaint | other",
    "confidence": 0.0-1.0
  },
  "booking_details": {
    "check_in": "YYYY-MM-DD | null",
    "check_out": "YYYY-MM-DD | null",
    "guests": "number | null",
    "villas_requested": "number | null",
    "special_requests": "string | null"
  },
  "metadata": {
    "property_id": "uuid",
    "tenant_id": "uuid",
    "timestamp": "ISO8601",
    "raw_data": {}
  }
}
```

---

# 5. WORKFLOWS EN N8N

## 5.1 Estado Actual

| ID | Nombre | Estado | Función |
|----|--------|--------|---------|
| `BX2X9P1xvZBnpr1p` | WF-SP-01 Inbound Lead Handler v1 | ⏳ INACTIVO | Procesa todos los leads |
| `GIYbLfAkTrI7gHPH` | WF-KORA-POST-CALL v1 | ✅ ACTIVO | Post-procesamiento VAPI |
| `ORTMMLk6qVKFhELp` | BANYU WhatsApp Concierge | ⏳ INACTIVO | WhatsApp automation |
| `0PX8qJ4yyfQM4o1j` | TEMP - Structured Outputs | ✅ ACTIVO | Nodos de prueba (copiar) |
| `Bz2laIjsYJffUoTw` | MCP Central | ❓ EVALUAR | Router central |

## 5.2 Webhooks Importantes

| Webhook | Workflow | Uso |
|---------|----------|-----|
| `/webhook/inbound-lead-v3` | WF-SP-01 | Entrada universal de leads |
| `/webhook/vapi-post-call` | WF-KORA-POST-CALL | Eventos VAPI |
| `/webhook/whatsapp-inbound` | BANYU | Mensajes WhatsApp entrantes |

---

# 6. SUPABASE - TABLAS PRINCIPALES

## 6.1 Tablas Críticas

| Tabla | Rows | Función |
|-------|------|---------|
| `leads` | 19 | CRM unificado |
| `lead_events` | 41 | Event log |
| `bookings` | 144 | Reservas |
| `properties` | 14 | Villas/habitaciones |
| `guests` | 16 | Huéspedes |
| `whatsapp_messages` | 38 | Mensajes WA |
| `payments` | 14 | Pagos |

## 6.2 RPC Functions Disponibles

### Dashboard & Stats
- `get_dashboard_stats()` - KPIs principales
- `get_today_checkins()` - Check-ins de hoy
- `get_today_checkouts()` - Check-outs de hoy
- `get_active_alerts()` - Alertas activas ✅ ARREGLADA

### AI Agents Stats
- `get_lumina_stats(p_tenant_id)` - LUMINA metrics ✅
- `get_banyu_stats(p_tenant_id)` - BANYU metrics ✅
- `get_kora_stats(p_tenant_id)` - KORA metrics ✅
- `get_osiris_stats(p_tenant_id)` - OSIRIS metrics ✅

### Leads & CRM
- `find_lead_by_contact(p_phone, p_email, p_tenant_id)` - Buscar lead
- `get_due_followup_leads(p_limit)` - Leads para follow-up

### Availability & Pricing
- `check_availability(p_property_id, p_check_in, p_check_out)`
- `calculate_booking_price(p_property_id, p_check_in, p_check_out, p_guests)`

## 6.3 Campos que Escribe n8n (NO TOCAR desde frontend)

**Tabla `leads`:**
- message_history, followup_step, next_followup_at
- last_inbound_at, last_outbound_at, last_event
- standard_model, score, state (automático)

**Tabla `bookings`:**
- journey_state, last_journey_event_at, raw_data

**Tabla `whatsapp_messages`:**
- whatsapp_message_id, delivered_at, read_at
- inbound_text, outbound_text, status

---

# 7. CONFIGURACIÓN TÉCNICA

## 7.1 IDs Importantes

```javascript
// Izumi Hotel
const TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
const PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2';

// VAPI
const VAPI_ASSISTANT_ID = 'ae9ea22a-fc9a-49ba-b5b8-900ed69b7615';
const VAPI_PHONE = '+1 (123) 456-7890'; // Verificar número real

// WhatsApp (Izumi)
const WHATSAPP_NUMBER = '+62 813 2576 4867';

// n8n
const N8N_BASE_URL = 'https://n8n-production-bb2d.up.railway.app';
```

## 7.2 Contacto Izumi Hotel
- **WhatsApp:** +62 813 2576 4867 (24/7)
- **Teléfono:** +62 813 2576 4867 (8:00-22:00 WITA)
- **Web:** www.my-host-bizmate.com (Voice assistant 24/7)

---

# 8. ROADMAP H126

## Q1 2026 - BUILD · STABILIZE · PILOT

### ENERO (BUILD) ← ESTAMOS AQUÍ
- ✅ Core development
- ✅ WhatsApp (BANYU) - Configurado
- ✅ Voice (KORA) - Structured Outputs funcionando
- ⏳ Conectar KORA → Inbound Lead Handler
- ⏳ Activar BANYU workflow
- ⏳ Activar WF-SP-01

### FEBRERO (STABILIZE)
- Flow stability
- SAFE mode & logging
- Lead & booking states
- Remove edge cases

### MARZO (PILOT)
- 2-5 clientes piloto reales
- Real leads & guests
- Ajustar timing & copy

## Q2 2026 - LAUNCH · EARLY SCALE

### ABRIL (LAUNCH)
- Controlled public launch
- First paying customers

### MAYO-JUNIO (EARLY SCALE)
- Gradual onboarding
- Performance tuning

---

# 9. MÓDULOS FUTUROS

## 9.1 Content Generator (Marketing)
- Generación automática de contenido
- Canales: Instagram, TikTok, Web, Email, WhatsApp, Ads
- **REGLA:** SIEMPRE draft primero, NUNCA auto-publicar
- Integra con: OSIRIS (baja ocupación), LUMINA (oportunidades)

## 9.2 WF-04 Follow-Up Engine
**Secuencia estándar:**
- T+2h: Follow-up #1 (value + question)
- T+24h: Follow-up #2 (reminder + help)
- T+72h: Follow-up #3 (last check)
- T+7d: Optional re-engage

**Reglas:**
- Max 3-4 intentos por lead
- 1-2 mensajes por 24h máximo
- STOP si responde o reserva

## 9.3 WF-05 Guest Journey
**Etapas:**
- PRE-ARRIVAL (T-3d, T-1d): Welcome, directions, upsell
- ARRIVAL DAY: Ready message, wifi, contact
- IN-STAY: "How is everything?", issue capture
- CHECK-OUT: Instructions, transport reminder
- POST-STAY (T+1d, T+3d): Thank you, review, rebook offer

---

# 10. DIVISIÓN DE RESPONSABILIDADES

## Claude AI (Backend & Integrations)
- ✅ RPC functions en Supabase
- ✅ n8n workflows design
- ✅ WhatsApp/VAPI/Email integrations
- ✅ AI Agents logic
- ✅ Performance optimization

## Claude Code (Frontend & Orchestration)
- React components y UI/UX
- Service layer (llamadas a Supabase)
- Estado y navegación
- Git workflow
- Testing frontend

---

# 11. TAREAS PENDIENTES - PRIORIDAD MÁXIMA (18 ENERO)

## 🔴 CRÍTICAS (Hacer primero)

### 1. KORA → Inbound Lead Handler (30 min)
**Objetivo:** Conectar el post-procesamiento de VAPI al flujo principal

**Pasos:**
1. Abrir WF-KORA-POST-CALL v1 (`GIYbLfAkTrI7gHPH`)
2. Copiar nodos de TEMP workflow (`0PX8qJ4yyfQM4o1j`):
   - Filter Valid Events
   - Build Master Event v1.0
   - HTTP Request to WF-SP-01
3. Conectar al final del workflow
4. Endpoint: `/webhook/inbound-lead-v3`
5. Testear con llamada real

### 2. Actualizar Prompt VAPI (30 min)
**Assistant ID:** `ae9ea22a-fc9a-49ba-b5b8-900ed69b7615`

**Fixes necesarios:**
- Añadir pausa inicial (pierde la "h" de "hello")
- Corregir año: DEBE decir 2026
- Clarificar respuesta 24/7
- Añadir opción de idioma (EN/ES)

### 3. Activar BANYU WhatsApp (15 min)
**Workflow:** `ORTMMLk6qVKFhELp`

**Pasos:**
1. Verificar webhook configurado
2. Verificar Master Event build
3. Activar workflow
4. Test con mensaje real

### 4. Activar WF-SP-01 Inbound Lead Handler (15 min)
**Workflow:** `BX2X9P1xvZBnpr1p`

**Pasos:**
1. Verificar conexión a Supabase
2. Verificar lógica de deduplicación
3. Activar workflow
4. Test end-to-end

## 🟡 SECUNDARIAS (Si hay tiempo)

### 5. Arreglar Email Resend (1h)
- Verificar API key
- Verificar dominio configurado
- Test desde WF-BOOKING-NOTIFICATIONS

### 6. Evaluar MCP Central (30 min)
- Revisar workflow `Bz2laIjsYJffUoTw`
- Decidir: activar o descartar

---

# 12. PROMPT PARA EMPEZAR MAÑANA

```
Hola Claude, continuamos con MY HOST BizMate.

CONTEXTO RÁPIDO:
- Proyecto: SaaS automatización hoteles boutique
- Cliente piloto: Izumi Hotel, Ubud, Bali
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2

ESTADO ACTUAL:
✅ VAPI (KORA) Structured Outputs funcionando
✅ WF-KORA-POST-CALL extrae datos correctamente
✅ BANYU (WhatsApp) configurado pero INACTIVO
✅ WF-SP-01 Inbound Lead Handler listo pero INACTIVO
✅ RPC functions para AI Agents creadas y funcionando
✅ get_active_alerts() arreglada

ARQUITECTURA (regla de oro):
Cualquier Canal → Master Event v1.0 → WF-SP-01 → Supabase

FLUJO:
BANYU/KORA → [01] Inbound Lead Handler → [02] LUMINA
                                              ↓
                              BOOKED → [05] Guest Journey
                              NOT BOOKED → [04] Follow-Up Engine
                                              ↓
                                         [03] OSIRIS

TAREAS HOY (por orden de prioridad):

1. 🔴 KORA → Inbound Lead Handler
   - Copiar nodos de TEMP (0PX8qJ4yyfQM4o1j)
   - Pegar en WF-KORA-POST-CALL (GIYbLfAkTrI7gHPH)
   - Conectar a /webhook/inbound-lead-v3
   - Test end-to-end

2. 🔴 Actualizar Prompt VAPI
   - Assistant ID: ae9ea22a-fc9a-49ba-b5b8-900ed69b7615
   - Fixes: pausa inicial, año 2026, 24/7 claro, idiomas

3. 🔴 Activar BANYU (ORTMMLk6qVKFhELp)
   - Verificar Master Event build
   - Activar y testear

4. 🔴 Activar WF-SP-01 (BX2X9P1xvZBnpr1p)
   - Activar y testear flujo completo

5. 🟡 Email Resend (si hay tiempo)

6. 🟡 Evaluar MCP Central (si hay tiempo)

¿Empezamos con la tarea 1: KORA → Inbound Lead Handler?
```

---

# FIN DEL DOCUMENTO

**Última actualización:** 17 Enero 2026 - 22:00
**Próxima sesión:** 18 Enero 2026
**Prioridad:** VAPI + WhatsApp + Integración completa

---

*Documento generado por Claude AI para colaboración con Claude Code*
