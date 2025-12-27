# MY HOST BIZMATE - DOCUMENTACIÓN TÉCNICA COMPLETA
## AI Agents, Workflows & System Architecture
### Versión: 26 Diciembre 2025

---

# ÍNDICE

1. [Contexto General](#1-contexto-general)
2. [Arquitectura de Agentes AI](#2-arquitectura-de-agentes-ai)
3. [Internal Agent - PMS/Operations](#3-internal-agent---pmsoperations)
4. [External Agent - Market & Growth](#4-external-agent---market--growth)
5. [WhatsApp Concierge Agent](#5-whatsapp-concierge-agent)
6. [Voice Agent - VAPI Ayu](#6-voice-agent---vapi-ayu)
7. [Growth & Marketing Automations](#7-growth--marketing-automations)
8. [Dashboard Updates](#8-dashboard-updates)
9. [Stack Técnico](#9-stack-técnico)
10. [Control de Costes](#10-control-de-costes)
11. [Pendientes y Roadmap](#11-pendientes-y-roadmap)

---

# 1. CONTEXTO GENERAL

## ¿Qué es MY HOST BizMate?

MY HOST BizMate es un **PMS + AI Operating System** para pequeños y medianos propietarios de alojamientos turísticos (villas, rooms, boutique hotels) en el sudeste asiático.

## Principios de Diseño

- **No crear más agentes** - Usar los definidos
- **No añadir más menús** - Mantener UX simple
- **No duplicar lógica** - Reutilizar componentes
- **No construir herramientas genéricas** - Todo específico para hospitality
- **NINGÚN agente es ChatGPT genérico** - Todos limitados por rol y contexto

## Cliente Piloto

**Izumi Hotel**
- Hotel boutique 5 estrellas
- 7 villas de lujo
- Ubicación: Ubud, Bali
- Apertura: Verano 2026
- WhatsApp: +62 813 2576 4867

---

# 2. ARQUITECTURA DE AGENTES AI

## Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                    MY HOST BIZMATE - AI AGENTS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   INTERNAL   │  │   EXTERNAL   │  │  WHATSAPP CONCIERGE  │  │
│  │    AGENT     │  │    AGENT     │  │       AGENT          │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────────┤  │
│  │ PMS/Ops      │  │ Market/Growth│  │ Guest Communication  │  │
│  │ Solo Supabase│  │ OpenAI + Ctx │  │ ChakraHQ + OpenAI    │  │
│  │ Staff only   │  │ Owner only   │  │ Guests via WhatsApp  │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    VOICE AGENT (VAPI)                     │   │
│  │              Ayu - Receptionist / Bookings                │   │
│  │                  Phone + Web Widget                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Diferenciación de Agentes

| Aspecto | Internal Agent | External Agent | WhatsApp Concierge | Voice Agent |
|---------|---------------|----------------|-------------------|-------------|
| **Usuario** | Staff/Owner | Owner | Guests | Guests/Leads |
| **Canal** | Dashboard | Dashboard | WhatsApp | Teléfono/Web |
| **Datos** | Solo Supabase tenant | OpenAI + contexto | Supabase + OpenAI | VAPI + Supabase |
| **Función** | Operaciones PMS | Mercado/Crecimiento | Concierge/Info | Reservas |
| **Restricción** | MUY ALTA | ALTA | ALTA | MEDIA |

---

# 3. INTERNAL AGENT - PMS/OPERATIONS

## Rol
Asistente operativo del propietario. Responde preguntas usando **EXCLUSIVAMENTE** datos internos del PMS del tenant.

## Fuentes de Datos Permitidas
- `properties` - Propiedades del tenant
- `rooms` - Habitaciones/villas
- `bookings` - Reservas
- `payments` - Pagos
- `guests` - Huéspedes
- `availability` - Disponibilidad
- `rates` - Tarifas
- `workflows` - Logs internos

## Fuentes PROHIBIDAS
- ❌ Conocimiento externo
- ❌ Internet
- ❌ Datos de otros tenants
- ❌ Información no existente en la BD

## System Prompt - Internal Agent

```
You are the Internal Operations AI for MyHost BizMate.

Your role is strictly limited to answering questions using the internal PMS data
of the current tenant only.

You are allowed to:
- Explain bookings, payments, availability, revenue and operations
- Summarize data stored in the tenant's database
- Help the owner understand their business performance
- Assist with operational questions related to their properties

You are NOT allowed to:
- Answer general knowledge questions
- Provide advice unrelated to the tenant's properties
- Generate content outside hospitality operations
- Act as a general ChatGPT assistant

If the required data does not exist in the database, respond:
"I don't have that information available in your PMS data."
```

## Contexto Obligatorio en Cada Request

```json
{
  "tenantId": "uuid-del-tenant",
  "allowedTables": [
    "properties",
    "rooms",
    "bookings",
    "payments",
    "guests",
    "availability",
    "rates"
  ]
}
```

## Límites de Uso
- Límite mensual de mensajes por tenant (según plan)
- Límite de tokens por conversación
- Rechazo automático de prompts largos o repetitivos

**Mensaje al alcanzar límite:**
```
"You have reached your monthly AI Operations limit. Upgrade your plan to continue."
```

---

# 4. EXTERNAL AGENT - MARKET & GROWTH

## Rol
Agente de mercado y crecimiento. Ayuda al propietario a tomar decisiones estratégicas relacionadas con su alojamiento y mercado.

## Temas PERMITIDOS
- ✅ Análisis de mercado turístico
- ✅ Tendencias de demanda
- ✅ Pricing y ocupación estimada
- ✅ Benchmark de competencia
- ✅ Recomendaciones de crecimiento
- ✅ Distribución y canales
- ✅ Experiencia del huésped
- ✅ Contenido para huéspedes (guías locales, mensajes)

## Temas PROHIBIDOS
- ❌ Preguntas personales
- ❌ Consultas fuera de hospitality
- ❌ Uso como ChatGPT genérico
- ❌ Negocios no relacionados
- ❌ Tareas académicas o personales

## System Prompt - External Agent

```
You are the External Market & Growth AI for MyHost BizMate.

Your role is strictly limited to hospitality market analysis and growth.

You are allowed to:
- Analyze tourism and hospitality markets
- Provide pricing and demand insights
- Compare similar properties and competitors
- Suggest growth and marketing strategies
- Generate guest-facing content related to the property location

You are NOT allowed to:
- Act as a general-purpose ChatGPT
- Answer personal or unrelated questions
- Provide assistance outside hospitality and tourism
- Answer questions without clear relevance to the property context

If a question is outside scope, respond politely and redirect the user
to hospitality-related topics only.
```

## Contexto Obligatorio en Cada Request

```json
{
  "location": "Ubud, Bali",
  "propertyType": "Villa | Hotel | Rooms",
  "units": 7,
  "targetMarket": "International leisure travelers"
}
```

## Límites de Uso
- Límite mensual de mensajes por tenant
- Cooldown entre preguntas
- Límite de tokens por sesión

**Mensaje al alcanzar límite:**
```
"You have reached your monthly Market Intelligence limit."
```

---

# 5. WHATSAPP CONCIERGE AGENT

## Rol
Recepcionista/concierge del alojamiento a través de WhatsApp. Atiende a huéspedes con reservas activas o leads.

## Stack
- **ChakraHQ** - WhatsApp Business API
- **n8n** - Orquestación del workflow
- **Supabase** - Datos del hotel y conversaciones
- **OpenAI** - Generación de respuestas

## Temas PERMITIDOS
- ✅ Estancia del huésped
- ✅ Propiedad / hotel
- ✅ Normas de la casa
- ✅ Check-in / check-out
- ✅ WiFi, amenities, pagos
- ✅ Recomendaciones locales (Bali/Ubud)

## Temas PROHIBIDOS
- ❌ ChatGPT general
- ❌ Temas no relacionados con la estancia
- ❌ Información de otros huéspedes
- ❌ Reservas nuevas (derivar a Voice Agent o web)

## System Prompt - WhatsApp Concierge

```
You are the WhatsApp concierge for {{property.name}} in {{property.location}}.

PROPERTY INFORMATION:
- Name: {{property.name}}
- Location: {{property.location}}
- Check-in: {{property.checkin_info}}
- Check-out: 12:00 PM
- WiFi: {{property.wifi_info}}
- House Rules: {{property.house_rules}}

GUEST BOOKING (if exists):
- Guest: {{guest.full_name}}
- Check-in: {{booking.check_in}}
- Check-out: {{booking.check_out}}
- Status: {{booking.status}}

You can ONLY answer questions related to:
- The guest stay and booking
- The property and rooms
- House rules
- Check-in / check-out procedures
- WiFi and amenities
- Payments and bookings
- Local recommendations in Bali / Ubud

If the user asks about anything outside this scope, politely reply:
"I can only assist with questions about your stay at {{property.name}} and local recommendations in Bali. Is there anything else I can help you with regarding your visit?"

RULES:
- Be polite, concise, professional and helpful
- Keep responses short (max 3-4 sentences)
- Use natural, friendly language
- If you don't know something specific, offer to connect them with staff
```

## Tablas Supabase Necesarias

### wa_conversations (NUEVA)
```sql
CREATE TABLE wa_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  property_id UUID REFERENCES properties(id),
  booking_id UUID REFERENCES bookings(id),
  wa_from TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT,
  message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wa_conversations_wa_from ON wa_conversations(wa_from);
CREATE INDEX idx_wa_conversations_created_at ON wa_conversations(created_at DESC);
```

### wa_errors (NUEVA)
```sql
CREATE TABLE wa_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_from TEXT,
  error_message TEXT,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### properties (campos adicionales)
```sql
ALTER TABLE properties ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS checkin_info TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS wifi_info TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB;
```

## Workflow n8n: EXT_AGENT_WHATSAPP_CONCIERGE_V1

### Diagrama de Flujo
```
[1. Webhook IN] ──→ [2. Normalize Input]
                           │
                           ▼
                    [3. If Empty?]
                      │       │
                    YES      NO
                      │       │
                      ▼       ▼
            [4. Fallback]  [5. Find Guest]
                  │              │
                  ▼              ▼
                END      [6. Find Booking]
                               │
                               ▼
                        [7. Get Property]
                               │
                               ▼
                        [8. Load Memory]
                               │
                               ▼
                        [9. Build Prompt]
                               │
                               ▼
                        [10. OpenAI Chat]
                               │
                               ▼
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
    [11. Save User]  [12. Save Assistant]  [13. Send WA]
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                      [14. Respond OK]

[15. On Error] ──→ [Save Error] + [Send Error Msg]
```

### Nodos Detallados

#### NODO 1 – WEBHOOK IN
```yaml
Name: WA_IN_Webhook
Type: Webhook
Method: POST
Path: /wa/external-agent
Response Mode: Response Node
```

#### NODO 2 – NORMALIZE INPUT
```yaml
Name: Normalize_Inbound
Type: Set
Fields:
  wa_from: "{{ $json.from }}"
  wa_msg_text: "{{ $json.text.body || $json.text || '' }}"
  wa_message_id: "{{ $json.id }}"
  wa_timestamp: "{{ $json.timestamp }}"
  wa_type: "{{ $json.type }}"
```

#### NODO 3 – IF EMPTY MESSAGE
```yaml
Name: If_Empty_Text
Type: If
Condition: "{{ $json.wa_msg_text === '' || $json.wa_msg_text === undefined }}"
```

#### NODO 4 – SEND FALLBACK MESSAGE
```yaml
Name: Send_Fallback_AskText
Type: HTTP Request
Method: POST
URL: "{{CHAKRA_SEND_MESSAGE_URL}}"
Body:
  to: "{{ $json.wa_from }}"
  type: "text"
  text: "I received your message. Please type your request so I can help you."
```

#### NODO 5 – FIND GUEST
```yaml
Name: SB_Find_Guest
Type: HTTP Request
Method: GET
URL: "{{SUPABASE_URL}}/rest/v1/guests?phone=eq.{{ $json.wa_from }}&limit=1"
```

#### NODO 6 – FIND ACTIVE BOOKING
```yaml
Name: SB_Find_Active_Booking
Type: HTTP Request
Method: GET
URL: "{{SUPABASE_URL}}/rest/v1/bookings?guest_phone=eq.{{ wa_from }}&status=in.(confirmed,checked_in)&limit=1"
```

#### NODO 7 – GET PROPERTY CONTEXT
```yaml
Name: SB_Get_Property
Type: HTTP Request
Method: GET
URL: "{{SUPABASE_URL}}/rest/v1/properties?id=eq.{{ property_id }}&limit=1"
Default: "18711359-1378-4d12-9ea6-fb31c0b1bac2" (Izumi Hotel)
```

#### NODO 8 – LOAD CONVERSATION MEMORY
```yaml
Name: SB_Load_Memory
Type: HTTP Request
Method: GET
URL: "{{SUPABASE_URL}}/rest/v1/wa_conversations?wa_from=eq.{{ wa_from }}&order=created_at.desc&limit=10"
```

#### NODO 9 – BUILD SYSTEM PROMPT
```yaml
Name: Build_Prompt_Context
Type: Code (JavaScript)
```

```javascript
const property = $('SB_Get_Property').item.json[0] || {};
const booking = $('SB_Find_Active_Booking').item.json[0] || {};
const guest = $('SB_Find_Guest').item.json[0] || {};
const memory = $('SB_Load_Memory').item.json || [];
const userMessage = $('Normalize_Inbound').item.json.wa_msg_text;

const conversationHistory = memory
  .reverse()
  .map(m => ({ role: m.role, content: m.content }));

const systemPrompt = `You are the WhatsApp concierge for ${property.name || 'Izumi Hotel'} in ${property.location || 'Ubud, Bali'}.

PROPERTY INFORMATION:
- Name: ${property.name || 'Izumi Hotel'}
- Location: ${property.location || 'Jl Raya Andong N. 18, Ubud, Bali'}
- Check-in: ${property.checkin_info || '2:00 PM'}
- Check-out: 12:00 PM
- WiFi: ${property.wifi_info || 'Available in all areas'}
- House Rules: ${property.house_rules || 'No smoking indoors, quiet hours 10PM-7AM'}

${booking.id ? `GUEST BOOKING:
- Guest: ${guest.full_name || 'Guest'}
- Check-in: ${booking.check_in}
- Check-out: ${booking.check_out}
- Status: ${booking.status}` : 'No active booking found for this number.'}

You can ONLY answer questions related to:
- The guest stay and booking
- The property and rooms
- House rules
- Check-in / check-out procedures
- WiFi and amenities
- Payments and bookings
- Local recommendations in Bali / Ubud

If the user asks about anything outside this scope, politely reply:
"I can only assist with questions about your stay at ${property.name || 'Izumi Hotel'} and local recommendations in Bali."

RULES:
- Be polite, concise, professional and helpful
- Keep responses short (max 3-4 sentences)
- Use natural, friendly language`;

return [{
  json: {
    systemPrompt,
    conversationHistory,
    userMessage,
    property_id: property.id || '18711359-1378-4d12-9ea6-fb31c0b1bac2',
    booking_id: booking.id || null,
    wa_from: $('Normalize_Inbound').item.json.wa_from
  }
}];
```

#### NODO 10 – OPENAI CHAT
```yaml
Name: OpenAI_Concierge_Reply
Type: OpenAI Chat
Model: gpt-4o-mini
Temperature: 0.7
Max Tokens: 300
```

#### NODO 11 – SAVE USER MESSAGE
```yaml
Name: SB_Save_Incoming
Type: HTTP Request
Method: POST
URL: "{{SUPABASE_URL}}/rest/v1/wa_conversations"
Body:
  property_id: "{{ property_id }}"
  booking_id: "{{ booking_id }}"
  wa_from: "{{ wa_from }}"
  role: "user"
  content: "{{ userMessage }}"
```

#### NODO 12 – SAVE ASSISTANT MESSAGE
```yaml
Name: SB_Save_Assistant
Type: HTTP Request
Method: POST
URL: "{{SUPABASE_URL}}/rest/v1/wa_conversations"
Body:
  property_id: "{{ property_id }}"
  booking_id: "{{ booking_id }}"
  wa_from: "{{ wa_from }}"
  role: "assistant"
  content: "{{ openai_reply }}"
```

#### NODO 13 – SEND WHATSAPP RESPONSE
```yaml
Name: Chakra_Send_Text
Type: HTTP Request
Method: POST
URL: "{{CHAKRA_SEND_MESSAGE_URL}}"
Body:
  to: "{{ wa_from }}"
  type: "text"
  text: "{{ openai_reply }}"
```

#### NODO 14 – RESPOND TO WEBHOOK
```yaml
Name: Respond_OK
Type: Respond to Webhook
Response Code: 200
Body: { "status": "ok" }
```

#### NODO 15 – ERROR HANDLING
```yaml
Name: On_Error
Type: Error Trigger
Actions:
  1. Save error to wa_errors
  2. Send: "Sorry, something went wrong. Please try again in a minute."
```

## Variables de Entorno (n8n)

```
SUPABASE_URL=https://jjpscimtxrudtepzwhag.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[key]
OPENAI_API_KEY=[key]
CHAKRA_API_KEY=[key]
CHAKRA_SEND_MESSAGE_URL=https://api.chakrahq.com/v1/messages
DEFAULT_TIMEZONE=Asia/Jakarta
DEFAULT_LOCALE=en
```

## Configuración ChakraHQ

**Webhook URL:**
```
https://n8n-production-bb2d.up.railway.app/webhook/wa/external-agent
```

**Eventos a suscribir:**
- `message.received`

---

# 6. VOICE AGENT - VAPI AYU

## Rol
Recepcionista virtual para reservas por teléfono y widget web.

## Estado Actual
✅ Funcionando con arquitectura actual (VAPI + n8n AI Agent)

## Arquitectura Futura (Pendiente)
Rediseño con:
- **VAPI** = Toda la AI (cerebro)
- **n8n** = Solo backend sin AI (manos)

## System Prompt Actual (Funcionando)

```
You are Ayu from Izumi Hotel in Bali. Always respond in English only.

IMPORTANT: The current year is 2025. When users mention dates without a year, always assume 2025 or 2026. Never use 2023 or 2024.

IMPORTANT: When using the send_to_n8n tool, you MUST include ALL information collected from the user in the user_query parameter. This includes:
- Check-in and check-out dates (always use year 2025 or 2026)
- Number of guests
- Room type
- Guest full name
- Guest email
- Guest phone number with country code

CRITICAL: When the user says YES to confirm a reservation, you MUST send ALL the booking data to n8n in this format:
"CREATE BOOKING: guest_name=[name], guest_email=[email], guest_phone=[phone], check_in=[YYYY-MM-DD], check_out=[YYYY-MM-DD], guests=[number], room_type=[room], total_price=[amount]"

Always use the send_to_n8n tool for every user message. Never respond without using the tool first.
```

## Configuración VAPI

- **Assistant ID**: 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
- **Voice**: OpenAI TTS-1, Shimmer
- **Model**: GPT-4o-mini
- **Transcriber**: Deepgram nova-2

## Workflow n8n Actual

- **ID**: 3sU4RgV892az8nLZ
- **Webhook**: /webhook/vapi-izumi-fix
- **Nodos**: Webhook → Set → AI Agent → Clean Output → Respond

---

# 7. GROWTH & MARKETING AUTOMATIONS

## Flujos Definidos

### A) Content Triggers (Orchestrator)
**Objetivo**: Detectar señales del negocio y generar propuestas de contenido

**Señales**:
- Baja ocupación
- Nueva review
- Fechas/eventos próximos

**Flujo**:
1. Se detecta señal
2. Se genera brief contextual
3. IA propone contenido
4. Se crea Content Task

**Estados**: `pending_approval` → `approved` → `scheduled`

### B) Social Publishing
**Objetivo**: Publicar contenido aprobado en redes sociales

**Plataformas**: Instagram, Facebook, Google

**Flujo**:
1. Detectar Content Tasks listas
2. Publicar en plataformas
3. Guardar estado y links

**Estados**: `draft` → `scheduled` → `published` → `failed`

### C) Review Amplification
**Objetivo**: Convertir reviews en activos de confianza

**Flujo**:
1. Review entra
2. IA genera respuesta
3. IA convierte en post/story/trust asset
4. Se guarda para reutilización

### D) WhatsApp Campaigns
**Objetivo**: Campañas personalizadas (no masivas)

**Flujo**:
1. Seleccionar segmento real
2. IA personaliza mensaje
3. Enviar por WhatsApp
4. Registrar métricas

**Métricas**: Enviados, Respuestas, Estado

---

# 8. DASHBOARD UPDATES

## Estructura del Dashboard

### A) Métricas de Automatización (TOP)
- Active Workflows
- Tasks Automated
- Indicador de eficiencia

### B) Centro de Control (MIDDLE)
- Workflow Tester (LIVE)
- WhatsApp AI Ready ✓
- Voice AI Ready ✓

### C) Actividad Reciente (BOTTOM)

**Widget 1: Marketing Activity**
- Content Triggers disparados
- Posts publicados
- Campañas WhatsApp lanzadas

**Widget 2: Internal Alerts**
- Incidencias abiertas
- Flags urgentes
- Alertas del staff

**Widget 3: Guest Insights (Last 7 days)**
- Preferencias detectadas
- Objeciones
- Intenciones
- Timing

---

# 9. STACK TÉCNICO

## Componentes

| Componente | Tecnología | URL/Ubicación |
|------------|-----------|---------------|
| Frontend | React + Tailwind | Vercel |
| Backend/DB | Supabase | jjpscimtxrudtepzwhag.supabase.co |
| Workflows | n8n | Railway |
| Voice AI | VAPI | dashboard.vapi.ai |
| WhatsApp | ChakraHQ | chakrahq.com |
| AI | OpenAI GPT-4o-mini | api.openai.com |

## Webhooks Definidos

```
/webhook/vapi-izumi-fix          → Voice Agent (Ayu)
/webhook/wa/external-agent       → WhatsApp Concierge
/automation/internal/flag        → Internal Alerts
/automation/external/input       → External Enrichment
/automation/content-trigger      → Marketing Content
/automation/publish              → Social Publishing
/automation/whatsapp/launch      → WhatsApp Campaigns
```

## IDs Importantes

- **Izumi Property ID**: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- **VAPI Assistant ID**: `1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61`
- **n8n Workflow ID**: `3sU4RgV892az8nLZ`

---

# 10. CONTROL DE COSTES

## Límites por Agente

| Agente | Límite Mensual | Límite por Request | Cooldown |
|--------|---------------|-------------------|----------|
| Internal | Por plan | Tokens limitados | No |
| External | Por plan | Tokens limitados | Sí |
| WhatsApp Concierge | Ilimitado* | 300 tokens | No |
| Voice (VAPI) | Por minutos | N/A | No |

*Sujeto a costes de ChakraHQ y OpenAI

## Estrategias de Control

1. **Rechazo automático** de prompts largos o repetitivos
2. **Hard stop** con CTA de upgrade al alcanzar límites
3. **Contexto obligatorio** en cada request
4. **Restricción estricta** de temas permitidos

---

# 11. PENDIENTES Y ROADMAP

## 🔴 PRIORIDAD ALTA

### 1. Rediseño VAPI + n8n
- **Estado**: Esperando templates de Stephane y Nate Herk
- **Objetivo**: Toda la AI en VAPI, n8n solo backend
- **Beneficio**: Eliminar conflictos de doble AI

### 2. WhatsApp Concierge
- **Estado**: Especificación completa, pendiente implementar
- **Pasos**:
  1. Crear tablas Supabase
  2. Crear workflow n8n
  3. Configurar ChakraHQ webhook
  4. Testing

## 🟡 PRIORIDAD MEDIA

### 3. Marketing Automations
- Content Triggers
- Social Publishing
- Review Amplification
- WhatsApp Campaigns

### 4. Enriquecimiento de Agentes
- Internal Alert Flow
- External Enrichment Flow

## 🟢 PRIORIDAD BAJA

### 5. Dashboard Updates
- Marketing Activity widget
- Internal Alerts widget
- Guest Insights widget

---

# ARCHIVOS DE REFERENCIA

| Archivo | Descripción |
|---------|-------------|
| `MYHOST_BIZMATE_FULL_DOCUMENTATION.md` | Este documento |
| `VAPI_N8N_Documentation_25122025.md` | Config Voice Agent actual |
| `Vapi_Izumi_Hotel_WORKING_25122025.json` | Backup workflow n8n |
| `ANALISIS_VOICE_AI_OPTIONS_26122025.md` | Análisis alternativas VAPI |

---

*Documento creado: 26 Diciembre 2025*
*Última actualización: 26 Diciembre 2025*
