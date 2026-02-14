# PROMPT DE CONTINUACIÓN - MY HOST BIZMATE
## Fecha: 26 de Diciembre 2025 (ACTUALIZADO)

---

## CONTEXTO DEL PROYECTO

Soy José, founder de MY HOST BizMate, una plataforma SaaS de automatización con IA para hoteles boutique y villas en el sudeste asiático. Mi cliente piloto es Izumi Hotel, un hotel boutique 5 estrellas con 7 villas de lujo en Ubud, Bali, que abre en verano 2026.

---

## ESTADO ACTUAL (26 Diciembre 2025)

### ✅ COMPLETADO

**VAPI + N8N Voice Assistant (Ayu - Izumi Hotel)**
- Flujo completo de reservas por voz funcionando
- VAPI llama correctamente al tool send_to_n8n
- N8N ejecuta las herramientas (Check Availability, Calculate Price, Create Booking)
- Reservas se guardan en Supabase
- Problema de fechas 2023 vs 2025 corregido con prompt

**Documentación:**
- `VAPI_N8N_Documentation_25122025.md` - Configuración actual
- `ANALISIS_VOICE_AI_OPTIONS_26122025.md` - Análisis de alternativas
- `Vapi_Izumi_Hotel_WORKING_25122025.json` - Backup workflow

### 🔄 EN ESPERA

**Rediseño arquitectura VAPI + n8n**
- Contactado: stephane@useamato.com (template hoteles)
- Contactado: Nate Herk (guía MCP Server + templates)
- **Esperando respuestas antes de implementar**

---

## CONFIGURACIÓN ACTUAL QUE FUNCIONA

### VAPI System Prompt (Ayu - Izumi Hotel)
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

### URLs del Sistema
- **N8N**: https://n8n-production-bb2d.up.railway.app
- **Webhook VAPI**: /webhook/vapi-izumi-fix
- **Supabase**: https://jjpscimtxrudtepzwhag.supabase.co
- **Property ID**: 18711359-1378-4d12-9ea6-fb31c0b1bac2

---

## PENDIENTES PRIORIZADOS

### 🔴 PRIORIDAD ALTA

#### 1. REDISEÑO VAPI + N8N (Esperando templates)
**Problema identificado**: Tener 2 AI (VAPI + OpenAI en n8n) genera conflictos
**Solución**: Toda la AI en VAPI, n8n solo como backend sin AI
**Estado**: Esperando respuesta de Stephane y Nate Herk

#### 2. NUEVO AGENTE: WHATSAPP CONCIERGE
**Descripción**: Agente externo que actúa como recepcionista/concierge por WhatsApp
**Stack**: ChakraHQ + n8n + Supabase + OpenAI

**Funcionalidades**:
- Responder sobre la estancia del huésped
- Info de la propiedad/hotel
- Normas de la casa
- Check-in / check-out
- WiFi, amenities, pagos
- Recomendaciones locales (Bali/Ubud)
- **NO es ChatGPT general** - Solo temas del alojamiento

**Tablas Supabase necesarias**:
```sql
-- wa_conversations (historial de chat)
id, tenant_id, property_id, booking_id, wa_from, role, content, message_id, created_at

-- guests (ya existe, verificar campos)
id, tenant_id, full_name, phone, preferred_language

-- bookings (ya existe, verificar campos)
id, tenant_id, property_id, guest_phone, check_in, check_out, status

-- properties (ya existe, añadir campos)
id, tenant_id, name, location, zone, address, house_rules, checkin_info, wifi_info, amenities
```

**Workflow n8n** (14 nodos):
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
14. On_Error - Manejo de errores

---

### 🟡 PRIORIDAD MEDIA

#### 3. GROWTH & MARKETING AUTOMATIONS

**Flujos definidos**:

A) **Content Triggers (Orchestrator)**
- Detecta señales: baja ocupación, nueva review, eventos
- Genera brief contextual
- IA propone contenido
- Crea Content Task

B) **Social Publishing**
- Publica contenido aprobado
- Instagram, Facebook, Google
- Estados: draft → scheduled → published

C) **Review Amplification**
- Review entra → IA genera respuesta
- Convierte en post/story/trust asset

D) **WhatsApp Campaigns**
- Segmentos personalizados
- IA personaliza mensaje
- Métricas: enviados, respuestas

#### 4. ENRIQUECIMIENTO DE AGENTES

E) **Internal Alert Flow**
- Staff crea flag/nota
- Si urgente → notificación + task
- Si no → backlog

F) **External Enrichment Flow**
- Mensaje/review entra
- IA extrae: preferencia, objeción, intención, timing
- Actualiza perfil huésped

---

### 🟢 PRIORIDAD BAJA

#### 5. DASHBOARD UPDATES

**Widgets a añadir**:
- Marketing Activity (triggers, posts, campañas)
- Internal Alerts (incidencias, flags)
- Guest Insights (preferencias, objeciones, timing)

---

## ARQUITECTURA TÉCNICA

### Stack Actual
- **Frontend**: React + Tailwind CSS (Vercel)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Workflows**: N8N (Railway)
- **Voice AI**: VAPI
- **WhatsApp**: ChakraHQ
- **AI**: OpenAI GPT-4o-mini

### Webhooks Definidos
```
/webhook/vapi-izumi-fix          (Voice AI)
/wa/external-agent               (WhatsApp Concierge) [NUEVO]
/automation/internal/flag        (Internal Alerts)
/automation/external/input       (External Enrichment)
/automation/content-trigger      (Marketing)
/automation/publish              (Social Publishing)
/automation/whatsapp/launch      (WhatsApp Campaigns)
```

---

## MODELO DE NEGOCIO

- **Target**: Hoteles boutique y villas pequeñas (1-3 propiedades) en SE Asia
- **Precio**: $50-70/mes (vs competidores $250-300+)
- **Objetivo**: 100-200 clientes para $3,000-6,000 MRR

---

## ARCHIVOS DE REFERENCIA

| Archivo | Descripción |
|---------|-------------|
| `MYHOST_BIZMATE_FULL_DOCUMENTATION.md` | **DOCUMENTACIÓN MAESTRA COMPLETA** |
| `VAPI_N8N_Documentation_25122025.md` | Config Voice Agent actual |
| `ANALISIS_VOICE_AI_OPTIONS_26122025.md` | Análisis alternativas VAPI |
| `Vapi_Izumi_Hotel_WORKING_25122025.json` | Backup workflow n8n |
| `PROMPT_CONTINUACION_26122025_v2.md` | Este documento |

## ARQUITECTURA DE AGENTES AI

```
┌─────────────────────────────────────────────────────────────┐
│                 MY HOST BIZMATE - 4 AGENTES AI              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INTERNAL AGENT     │  EXTERNAL AGENT    │  WA CONCIERGE   │
│  PMS/Operations     │  Market/Growth     │  Guest Chat     │
│  Solo Supabase      │  OpenAI + Context  │  ChakraHQ+OpenAI│
│  Staff only         │  Owner only        │  Guests only    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              VOICE AGENT (VAPI - AYU)               │   │
│  │              Reservas por teléfono/web              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**REGLA CLAVE**: Ningún agente es ChatGPT genérico. Todos limitados por rol y contexto.

---

## INSTRUCCIONES PARA CLAUDE

1. **Comunicación**: Responde en español, código y configuraciones en inglés
2. **Cambios de prompts**: No hagas cambios drásticos, solo ajustes puntuales
3. **Antes de cambiar algo**: Muéstrame el cambio exacto y espera confirmación
4. **Debug**: Sigue el orden: VAPI logs → N8N executions → Supabase
5. **Backups**: Siempre pide exportar antes de hacer cambios grandes
6. **Nuevo desarrollo**: Sigue la arquitectura definida (VAPI=cerebro, n8n=manos)

---

## PREGUNTAS PARA EMPEZAR

1. ¿Recibiste respuesta de Stephane o Nate Herk? → Rediseñamos VAPI+n8n
2. ¿Empezamos con el WhatsApp Concierge? → Nuevo workflow
3. ¿Prefieres avanzar con Marketing Automations? → Content Triggers
4. ¿Otro tema?

---

*Copia este prompt completo para empezar la siguiente sesión*
