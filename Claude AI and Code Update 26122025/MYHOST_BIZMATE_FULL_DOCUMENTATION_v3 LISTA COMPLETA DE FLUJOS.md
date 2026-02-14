# MY HOST BIZMATE - DOCUMENTACIÓN TÉCNICA COMPLETA
## AI Agents, Workflows & System Architecture
### Versión: 26 Diciembre 2025 - ACTUALIZADA

---

# ÍNDICE

1. [Contexto General](#1-contexto-general)
2. [Arquitectura de Agentes AI](#2-arquitectura-de-agentes-ai)
3. [Internal Agent - PMS/Operations](#3-internal-agent---pmsoperations)
4. [External Agent - Market & Growth](#4-external-agent---market--growth)
5. [WhatsApp Concierge Agent](#5-whatsapp-concierge-agent)
6. [Voice Agent - VAPI Ayu](#6-voice-agent---vapi-ayu)
7. [Guest Communication - Email & WhatsApp](#7-guest-communication---email--whatsapp)
8. [Growth & Marketing Automations](#8-growth--marketing-automations)
9. [Enrichment Flows](#9-enrichment-flows)
10. [Dashboard Updates](#10-dashboard-updates)
11. [Stack Técnico](#11-stack-técnico)
12. [Control de Costes](#12-control-de-costes)
13. [Lista Completa de Flujos Pendientes](#13-lista-completa-de-flujos-pendientes)

---

# 1. CONTEXTO GENERAL

## ¿Qué es MY HOST BizMate?

MY HOST BizMate es un **PMS + AI Operating System** para pequeños y medianos propietarios de alojamientos turísticos (villas, rooms, boutique hotels) en el sudeste asiático.

## Principios de Diseño (NO NEGOCIABLES)

- **No crear más agentes** - Usar los 4 definidos
- **No añadir más menús** - Mantener UX simple
- **No duplicar lógica** - Reutilizar componentes
- **No construir herramientas genéricas** - Todo específico para hospitality
- **NINGÚN agente es ChatGPT genérico** - Todos limitados por rol y contexto
- **Multi-tenant estricto** - RLS en todas las operaciones
- **Todo envío debe quedar registrado** - Audit + trazabilidad

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
"I can only assist with questions about your stay at {{property.name}} and local recommendations in Bali."

RULES:
- Be polite, concise, professional and helpful
- Keep responses short (max 3-4 sentences)
- Use natural, friendly language
```

## Tablas Supabase

### wa_conversations
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
```

### wa_errors
```sql
CREATE TABLE wa_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wa_from TEXT,
  error_message TEXT,
  error_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Workflow: EXT_AGENT_WHATSAPP_CONCIERGE_V1

**Webhook**: `/wa/external-agent`

**Nodos** (15):
1. WA_IN_Webhook - Recibe mensaje de Chakra
2. Normalize_Inbound - Normaliza datos
3. If_Empty_Text - Valida mensaje
4. Send_Fallback_AskText - Respuesta si vacío
5. SB_Find_Guest - Busca huésped por teléfono
6. SB_Find_Active_Booking - Busca reserva activa
7. SB_Get_Property - Carga datos del hotel
8. SB_Load_Memory - Carga últimos 10 mensajes
9. Build_Prompt_Context - Construye system prompt
10. OpenAI_Concierge_Reply - Genera respuesta
11. SB_Save_Incoming - Guarda mensaje usuario
12. SB_Save_Assistant - Guarda respuesta AI
13. Chakra_Send_Text - Envía respuesta WhatsApp
14. Respond_OK - Responde al webhook
15. On_Error - Manejo de errores

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

## Configuración VAPI
- **Assistant ID**: 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
- **Voice**: OpenAI TTS-1, Shimmer
- **Model**: GPT-4o-mini
- **Transcriber**: Deepgram nova-2

## Workflow n8n Actual
- **ID**: 3sU4RgV892az8nLZ
- **Webhook**: `/webhook/vapi-izumi-fix`

---

# 7. GUEST COMMUNICATION - EMAIL & WHATSAPP

## Objetivo
Desde la UI (Guests / Guest Profile) el owner puede enviar Email y WhatsApp a un huésped, con logging en Supabase y multi-tenant estricto.

## Principios (NO NEGOCIABLES)
- Todo envío debe quedar registrado en Supabase (audit + trazabilidad)
- Multi-tenant: cualquier acción debe filtrar por tenant_id
- El Frontend NO habla con WhatsApp/Email directo: siempre webhook seguro → n8n
- n8n NO debe aceptar requests sin "shared secret" o firma
- Respuesta rápida: devolver "queued/sent/failed" y communication_id

## UI Requirements

### En Guest Profile - Sección "Communication"
2 botones claros:
- **"Send Email"**
- **"Send WhatsApp"**

### Modal al pulsar botón
- **To**: Pre-rellenado con email o teléfono del guest
- **Template selector** (dropdown, opcional):
  - Welcome
  - Pre check-in
  - Check-in day
  - Payment reminder
  - Review request
- **Message**: Textarea editable
- **Subject**: Solo para email
- **Botón "Send"**

## Endpoint API

```
POST /api/communications/send

Payload:
{
  "tenant_id": "uuid",
  "property_id": "uuid",
  "guest_id": "uuid",
  "booking_id": "uuid" (opcional),
  "channel": "email" | "whatsapp",
  "template_key": "welcome" (opcional),
  "subject": "string" (solo email),
  "message": "string"
}

Response:
{
  "communication_id": "uuid",
  "status": "queued" | "sent" | "failed"
}
```

## Tablas Supabase

### communications_log
```sql
CREATE TABLE communications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID,
  guest_id UUID NOT NULL,
  booking_id UUID,
  channel TEXT CHECK (channel IN ('whatsapp', 'email')),
  direction TEXT CHECK (direction IN ('outbound', 'inbound')) DEFAULT 'outbound',
  template_key TEXT,
  subject TEXT,
  message_body TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued', 'sent', 'failed')) DEFAULT 'queued',
  provider TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  created_by_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE communications_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenant isolation" ON communications_log
  FOR ALL USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

### message_templates (opcional)
```sql
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  channel TEXT CHECK (channel IN ('whatsapp', 'email')),
  template_key TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, channel, template_key)
);
```

## Workflows n8n

### WORKFLOW G: SEND_EMAIL_TO_GUEST

**Webhook**: `/communications/send-email`

**Nodos**:
1. Webhook_Email_Request
2. Validate_Tenant_Secret
3. Get_Guest_Data (Supabase)
4. Get_Template (si template_key)
5. Build_Email_Content
6. Send_Email (SendGrid/Resend/SMTP)
7. Update_Log_Success
8. Update_Log_Failed (on error)
9. Respond_To_App

### WORKFLOW H: SEND_WHATSAPP_TO_GUEST

**Webhook**: `/communications/send-whatsapp`

**Nodos**:
1. Webhook_WA_Request
2. Validate_Tenant_Secret
3. Get_Guest_Data (Supabase)
4. Get_Template (si template_key)
5. Build_WA_Message
6. Send_WhatsApp (ChakraHQ)
7. Update_Log_Success
8. Update_Log_Failed (on error)
9. Respond_To_App

---

# 8. GROWTH & MARKETING AUTOMATIONS

## Flujo A: Content Triggers (Orchestrator)

**Webhook**: `/automation/content-trigger`

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

---

## Flujo B: Social Publishing

**Webhook**: `/automation/publish`

**Objetivo**: Publicar contenido aprobado en redes sociales

**Plataformas**: Instagram, Facebook, Google

**Flujo**:
1. Detectar Content Tasks listas
2. Publicar en plataformas
3. Guardar estado y links

**Estados**: `draft` → `scheduled` → `published` → `failed`

---

## Flujo C: Review Amplification

**Objetivo**: Convertir reviews en activos de confianza

**Flujo**:
1. Review entra
2. IA genera respuesta
3. IA convierte en post/story/trust asset
4. Se guarda para reutilización

---

## Flujo D: WhatsApp Campaigns

**Webhook**: `/automation/whatsapp/launch`

**Objetivo**: Campañas personalizadas (no masivas)

**Flujo**:
1. Seleccionar segmento real
2. IA personaliza mensaje
3. Enviar por WhatsApp
4. Registrar métricas

**Métricas**: Enviados, Respuestas, Estado

---

# 9. ENRICHMENT FLOWS

## Flujo E: Internal Alert Flow

**Webhook**: `/automation/internal/flag`

**Objetivo**: Convertir incidencias internas en acciones automáticas

**Flujo**:
1. Staff crea flag/nota (housekeeping/maintenance/VIP/urgent)
2. Se guarda incidencia
3. Si urgente → notificación + creación de task
4. Si no → backlog

---

## Flujo F: External Enrichment Flow

**Webhook**: `/automation/external/input`

**Objetivo**: Convertir mensajes y reviews en insights estructurados

**Flujo**:
1. Entra mensaje/review
2. IA extrae:
   - Preferencia
   - Objeción
   - Intención
   - Timing
3. Se guarda insight
4. Se actualiza perfil del huésped
5. Si hay intención → se crea follow-up

**Reglas**:
- NO hace marketing
- NO publica contenido
- Solo captura, estructura y enriquece datos

---

# 10. DASHBOARD UPDATES

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

# 11. STACK TÉCNICO

## Componentes

| Componente | Tecnología | URL/Ubicación |
|------------|-----------|---------------|
| Frontend | React + Tailwind + shadcn/ui | Vercel |
| Backend/DB | Supabase | jjpscimtxrudtepzwhag.supabase.co |
| Workflows | n8n | Railway |
| Voice AI | VAPI | dashboard.vapi.ai |
| WhatsApp | ChakraHQ | chakrahq.com |
| Email | SendGrid/Resend | - |
| AI | OpenAI GPT-4o-mini | api.openai.com |

## Webhooks Completos

```
# Voice Agent
/webhook/vapi-izumi-fix              → Voice Agent (Ayu)

# WhatsApp Concierge
/webhook/wa/external-agent           → WhatsApp Concierge

# Guest Communication (Owner → Guest)
/webhook/communications/send-email   → Email to Guest
/webhook/communications/send-whatsapp→ WhatsApp to Guest

# Marketing Automations
/automation/content-trigger          → Content Triggers
/automation/publish                  → Social Publishing
/automation/whatsapp/launch          → WhatsApp Campaigns

# Enrichment
/automation/internal/flag            → Internal Alerts
/automation/external/input           → External Enrichment
```

## IDs Importantes

- **Izumi Property ID**: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- **VAPI Assistant ID**: `1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61`
- **n8n Workflow ID**: `3sU4RgV892az8nLZ`

---

# 12. CONTROL DE COSTES

## Límites por Agente

| Agente | Límite Mensual | Límite por Request | Cooldown |
|--------|---------------|-------------------|----------|
| Internal | Por plan | Tokens limitados | No |
| External | Por plan | Tokens limitados | Sí |
| WhatsApp Concierge | Ilimitado* | 300 tokens | No |
| Voice (VAPI) | Por minutos | N/A | No |

## Estrategias de Control

1. **Rechazo automático** de prompts largos o repetitivos
2. **Hard stop** con CTA de upgrade al alcanzar límites
3. **Contexto obligatorio** en cada request
4. **Restricción estricta** de temas permitidos
5. **Shared secret** para webhooks

---

# 13. LISTA COMPLETA DE FLUJOS PENDIENTES

## 🔴 PRIORIDAD ALTA

| # | Flujo | Tipo | Webhook | Estado |
|---|-------|------|---------|--------|
| 1 | Rediseño VAPI + n8n | Voice | `/webhook/vapi-izumi-fix` | ⏳ Esperando templates |
| 2 | WhatsApp Concierge | Agent | `/wa/external-agent` | 📋 Especificado |
| 3 | Internal Agent | Agent | Backend/API | 📋 Especificado |
| 4 | External Agent | Agent | Backend/API | 📋 Especificado |

## 🟡 PRIORIDAD MEDIA

| # | Flujo | Tipo | Webhook | Estado |
|---|-------|------|---------|--------|
| 5 | Send Email to Guest | Communication | `/communications/send-email` | 📋 Especificado |
| 6 | Send WhatsApp to Guest | Communication | `/communications/send-whatsapp` | 📋 Especificado |
| 7 | Content Triggers | Marketing | `/automation/content-trigger` | 📝 Definido |
| 8 | Social Publishing | Marketing | `/automation/publish` | 📝 Definido |
| 9 | Review Amplification | Marketing | - | 📝 Definido |
| 10 | WhatsApp Campaigns | Marketing | `/automation/whatsapp/launch` | 📝 Definido |
| 11 | Internal Alert Flow | Enrichment | `/automation/internal/flag` | 📝 Definido |
| 12 | External Enrichment Flow | Enrichment | `/automation/external/input` | 📝 Definido |

## 🟢 PRIORIDAD BAJA

| # | Flujo | Tipo | Webhook | Estado |
|---|-------|------|---------|--------|
| 13 | Dashboard - Marketing Activity | UI | - | 📝 Definido |
| 14 | Dashboard - Internal Alerts | UI | - | 📝 Definido |
| 15 | Dashboard - Guest Insights | UI | - | 📝 Definido |

---

## RESUMEN TOTAL

| Categoría | Cantidad |
|-----------|----------|
| **Agentes AI** | 4 |
| **Workflows Communication** | 2 |
| **Workflows Marketing** | 4 |
| **Workflows Enrichment** | 2 |
| **Dashboard Widgets** | 3 |
| **TOTAL FLUJOS PENDIENTES** | **15** |

---

## TABLAS SUPABASE NECESARIAS (NUEVAS)

| Tabla | Propósito | Estado |
|-------|-----------|--------|
| `wa_conversations` | Chat history WhatsApp Concierge | Crear |
| `wa_errors` | Error logging WhatsApp | Crear |
| `communications_log` | Log de emails y WA enviados | Crear |
| `message_templates` | Templates de mensajes | Crear (opcional) |

---

## CAMPOS A AÑADIR EN TABLAS EXISTENTES

### properties
```sql
ALTER TABLE properties ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS house_rules TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS checkin_info TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS wifi_info TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities JSONB;
```

### guests
```sql
ALTER TABLE guests ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
```

### bookings
```sql
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_phone TEXT;
```

---

*Documento creado: 26 Diciembre 2025*
*Última actualización: 26 Diciembre 2025 - v3*
