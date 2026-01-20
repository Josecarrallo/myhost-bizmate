# MY HOST BIZMATE - DOCUMENTO GLOBAL DEL PROYECTO
## Estado: 17 Enero 2026
## Versión: 1.0

---

# ÍNDICE
1. Visión General del Sistema
2. Arquitectura Actual
3. Estado de Cada Componente
4. Tareas Pendientes (Priorizado)
5. Configuración Técnica
6. Workflows Activos
7. Nuevos Módulos (Content Generator + Agentic AI)
8. Prompt para Continuar Mañana

---

# 1. VISIÓN GENERAL DEL SISTEMA

MY HOST BizMate es una plataforma SaaS de automatización para hoteles boutique y villas en el sudeste asiático. El sistema integra múltiples canales de comunicación con huéspedes a través de agentes de IA especializados.

## 1.1 Agentes de IA

| Agente | Función | Canal | Estado |
|--------|---------|-------|--------|
| **BANYU.AI** | WhatsApp Concierge | WhatsApp | ✅ Funcionando |
| **KORA.AI** | Voice AI Assistant | Llamadas (VAPI) | ⚠️ Parcial |
| **LUMINA.AI** | Follow-Up Engine | Multi-canal | ⏳ Pendiente |
| **OSIRIS.AI** | Operations & Control | Dashboard | ⏳ Pendiente |

## 1.2 Cliente Piloto

**Izumi Hotel** - Ubud, Bali
- Apertura: Verano 2026
- 7 villas de lujo
- Tenant ID: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`

---

# 2. ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CLIENT TOUCHPOINTS                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ WhatsApp │ │  Voice   │ │ Website  │ │  Social  │ │  Email   │  │
│  │  BANYU   │ │   KORA   │ │   Form   │ │ IG/FB/TT │ │          │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MASTER EVENT v1.0                                │
│              (Formato estándar JSON para todos los canales)          │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  01 - WF-SP-01 INBOUND LEAD HANDLER                                  │
│  Webhook: /webhook/inbound-lead-v3                                   │
│  - Valida Master Event                                               │
│  - Busca/crea lead en Supabase                                       │
│  - Clasifica intent (info/price/availability/booking)                │
│  - Log en lead_events                                                │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ Booking       │       │ Follow-Up     │       │ Guest         │
│ Confirmed     │       │ Engine        │       │ Journey       │
│ (Notifications)│      │ (LUMINA)      │       │               │
└───────────────┘       └───────────────┘       └───────────────┘
```

## 2.1 Master Event v1.0 (Contrato de Datos)

```json
{
  "schema_version": "1.0",
  "event_id": "uuid",
  "event_type": "lead_inbound",
  "source": "whatsapp|voice|web|social|email",
  "timestamp": "ISO_DATE",
  
  "tenant": {
    "tenant_id": "uuid",
    "property_id": "uuid"
  },
  
  "contact": {
    "name": "string",
    "phone": "string (required)",
    "email": "string|null",
    "language": "en|es|id"
  },
  
  "message": {
    "channel": "whatsapp|voice|web|instagram|facebook|email",
    "message_id": "string",
    "text": "string",
    "raw": "object"
  },
  
  "context": {
    "intent": "info|price|availability|booking|null",
    "checkin": "date|null",
    "checkout": "date|null",
    "guests": "number|null",
    "budget": "number|null",
    "property_hint": "string|null"
  },
  
  "meta": {
    "flow_origin": "string",
    "trace_id": "uuid"
  }
}
```

---

# 3. ESTADO DE CADA COMPONENTE

## 3.1 BANYU.AI (WhatsApp) ✅

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Webhook WhatsApp | ✅ Activo | ChakraHQ |
| AI Agent responde | ✅ Funcionando | GPT-4.1-mini |
| Tools (availability, pricing, booking) | ✅ Funcionando | |
| Build Master Event | ✅ Implementado | |
| Send to WF-SP-01 | ✅ Conectado | |

**Workflow:** BANYU.AI WhatsApp AI Concierge (ORTMMLk6qVKFhELp) - **INACTIVO**

## 3.2 KORA.AI (Voice/VAPI) ⚠️

| Aspecto | Estado | Notas |
|---------|--------|-------|
| VAPI Assistant configurado | ✅ | ID: ae9ea22a-fc9a-49ba-b5b8-900ed69b7615 |
| Structured Output callResult | ✅ | ID: 6426dbc9-8b9e-49f7-8f29-faa16683bcda |
| MCP Server URL | ✅ | Configurado |
| WF-KORA-POST-CALL recibe eventos | ✅ | Webhook activo |
| Extracción datos Structured Output | ✅ | CORREGIDO HOY |
| Router por nextAction | ✅ | Funcionando |
| Build Master Event | ⏳ | PENDIENTE |
| Send to WF-SP-01 | ⏳ | PENDIENTE |
| Prompt VAPI | ⚠️ | NECESITA AJUSTES |

**Workflow Activo:** WF-KORA-POST-CALL v1 (GIYbLfAkTrI7gHPH) - **ACTIVO**

### Problemas del Prompt VAPI a Corregir:
1. **Velocidad inicial:** Arranca muy rápido, pierde la "H" de "Hello"
2. **Confusión con el año:** Debe decir claramente que las fechas son 2026
3. **Pregunta 24/7:** Respuesta poco clara sobre disponibilidad del servicio
4. **Idioma:** Añadir opción de hablar en inglés o español

## 3.3 WF-SP-01 Inbound Lead Handler ✅

| Aspecto | Estado |
|---------|--------|
| Webhook /inbound-lead-v3 | ✅ |
| Validación Master Event | ✅ |
| Buscar lead existente | ✅ |
| Clasificar intent | ✅ |
| INSERT/UPDATE en leads | ✅ |
| Log en lead_events | ✅ |

**Workflow:** WF-SP-01 Inbound Lead Handler Multi-Tenant v1 (BX2X9P1xvZBnpr1p) - **INACTIVO**

## 3.4 MCP Central ❓

| Aspecto | Estado | Notas |
|---------|--------|-------|
| Workflow existe | ✅ | Bz2laIjsYJffUoTw |
| Funcionamiento | ❓ | EVALUAR si merece la pena recuperar |

Ahora que VAPI tiene Structured Outputs funcionando, MCP Central debería funcionar porque recibe JSON limpio en lugar de texto a interpretar.

## 3.5 Email (Resend) ⚠️

| Aspecto | Estado |
|---------|--------|
| Configuración Resend | ⚠️ REVISAR |
| Envío de confirmaciones | ⚠️ PENDIENTE |

---

# 4. TAREAS PENDIENTES (PRIORIZADO)

## 🔴 PRIORIDAD MÁXIMA - Cerrar mañana (17 Enero)

### 4.1 Integrar KORA con Inbound Lead Handler
**Tiempo estimado:** 30 min

1. Copiar nodos de `TEMP - Nodos para KORA` (0PX8qJ4yyfQM4o1j)
2. Pegar en WF-KORA-POST-CALL v1
3. Conectar después de Filter Valid Events
4. Probar con llamada real

### 4.2 Actualizar Prompt VAPI
**Tiempo estimado:** 30 min

Cambios necesarios:
- Añadir pausa inicial antes del greeting
- Especificar claramente "All bookings are for year 2026"
- Mejorar respuesta sobre disponibilidad 24/7
- Añadir detección de idioma (English/Spanish)

### 4.3 Arreglar Email Resend
**Tiempo estimado:** 1h

- Verificar API key
- Verificar dominio configurado
- Probar envío desde WF-BOOKING-NOTIFICATIONS

### 4.4 Activar BANYU (WhatsApp)
**Tiempo estimado:** 15 min

- Activar workflow ORTMMLk6qVKFhELp
- Verificar que Build Master Event funciona
- Probar mensaje real

### 4.5 Evaluar MCP Central
**Tiempo estimado:** 30 min

- Revisar workflow Bz2laIjsYJffUoTw
- Probar con datos estructurados de VAPI
- Decidir si activar o descartar

---

## 🟡 PRIORIDAD MEDIA - Esta semana

### 4.6 Follow-Up Engine (LUMINA)
- Leer leads por estado desde Supabase
- Secuencias automáticas (24h, 48h, 72h, 7d)
- Workflow: WF-02 Follow-Up Engine v8 (HndGXnQAEyaYDKFZ)

### 4.7 Guest Journey
- Automatización post-booking
- Pre-arrival info
- In-stay upsells
- Post-checkout review

### 4.8 Canales adicionales para Inbound Lead Handler
- Website Form → Master Event
- Instagram DM → Master Event
- Facebook Messenger → Master Event
- Email → Master Event

---

## 🟢 PRIORIDAD BAJA - Próximas semanas

### 4.9 Content Generator (NUEVO)
Ver documento: `MÓDULO_CONTENT_GENERATOR_CLAUDE_AI.txt`

Workflow lineal:
1. Webhook recibe petición
2. Validar inputs
3. Claude genera contenido
4. Guardar como DRAFT
5. Opcional: preview WhatsApp/Email

### 4.10 Proactive Agentic Context Agents (NUEVO)
Ver documento: `BLOQUE_NUEVO_PROACTIVE_AGENTIC_CONTEXT_AGENTS_CLAUDE_AI.txt`

4 agentes nuevos:
1. Weather Context Agent
2. Traffic & Access Context Agent
3. Local Events & Demand Agent
4. Disruption & Risk Agent

---

# 5. CONFIGURACIÓN TÉCNICA

## 5.1 Infraestructura

| Servicio | URL/ID | Notas |
|----------|--------|-------|
| **n8n** | https://n8n-production-bb2d.up.railway.app | Railway |
| **n8n versión** | 1.123.5 | NO actualizar a v2.0 |
| **Supabase** | jjpscimtxrudtepzwhag | |
| **VAPI** | Dashboard VAPI | |
| **ChakraHQ** | WhatsApp Business API | |
| **Resend** | Email transaccional | REVISAR |

## 5.2 Izumi Hotel - Datos de Contacto

- **WhatsApp:** +62 813 2576 4867 (24/7)
- **Phone:** +62 813 2576 4867 (8:00-22:00 Bali time)
- **Web:** www.my-host-bizmate.com
- **Ubicación:** Jl Raya Andong N. 18, Ubud, Bali

## 5.3 IDs Importantes

| Elemento | ID |
|----------|-----|
| Tenant ID (Izumi) | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID (Izumi) | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |
| VAPI Assistant ID | ae9ea22a-fc9a-49ba-b5b8-900ed69b7615 |
| Structured Output ID | 6426dbc9-8b9e-49f7-8f29-faa16683bcda |

## 5.4 Webhooks

| Nombre | URL |
|--------|-----|
| Inbound Lead Handler | /webhook/inbound-lead-v3 |
| KORA Post Call | /webhook/kora-post-call |
| WhatsApp (BANYU) | /webhook/894ed1af-89a5-44c9-a340-6e571eacbd53 |

---

# 6. WORKFLOWS RELEVANTES

## 6.1 Workflows ACTIVOS

| Workflow | ID | Estado |
|----------|-----|--------|
| WF-KORA-POST-CALL v1 | GIYbLfAkTrI7gHPH | ✅ ACTIVO |

## 6.2 Workflows CRÍTICOS (a activar)

| Workflow | ID | Acción |
|----------|-----|--------|
| WF-SP-01 Inbound Lead Handler v1 | BX2X9P1xvZBnpr1p | ACTIVAR |
| BANYU.AI WhatsApp Concierge | ORTMMLk6qVKFhELp | ACTIVAR |

## 6.3 Workflows TEMPORALES (borrar)

| Workflow | ID |
|----------|-----|
| TEMP - Nodos para KORA | 0PX8qJ4yyfQM4o1j |
| TEMP - Register Lead CORRECTO | e8XzpHaSpPMHQUPV |
| TEMP - Merge Node Actualizado | 3iEdIuj6n8ts53dv |
| TEMP - Copiar nodos 7 y 8 | iENnVUaJcyqnf91k |
| TEMP - Copiar nodos 6a y 6b | 2I3v43wrF5W01qRn |
| TEMP - 3. Merge CORREGIDO | BqJIT2TfYuB1jtwD |

---

# 7. NUEVOS MÓDULOS

## 7.1 Content Generator

**Objetivo:** Generación automática de contenido marketing para hospitality.

**Input:**
```json
{
  "property_id": "string",
  "channel": "instagram|tiktok|website|email|whatsapp|ads",
  "content_type": "post|reel|story|carousel|email|landing",
  "objective": "bookings|awareness|last_minute|upsell",
  "tone": "luxury|warm|playful|professional|minimal",
  "language": "en|es|id"
}
```

**Output:**
```json
{
  "title": "string",
  "hook": "string",
  "body_copy": "string",
  "cta": "string",
  "hashtags_or_keywords": ["string"],
  "visual_guidelines": ["string"]
}
```

## 7.2 Proactive Agentic Context Agents

**4 Agentes:**

1. **Weather Context Agent**
   - Monitoriza clima
   - Impacta: llegadas, housekeeping, experiencia

2. **Traffic & Access Agent**
   - Detecta problemas de acceso
   - Impacta: check-in tardío, comunicaciones preventivas

3. **Local Events Agent**
   - Detecta eventos locales
   - Impacta: pricing, marketing, upsell

4. **Disruption & Risk Agent**
   - Detecta emergencias
   - Impacta: escalación, comunicaciones urgentes

**Patrón de comportamiento:**
```
OBSERVAR → EVALUAR IMPACTO → DECIDIR ACCIÓN → DISPARAR A SISTEMA EXISTENTE → LOG
```

---

# 8. PROMPT PARA CONTINUAR MAÑANA

```
Hola Claude, continuamos con MY HOST BizMate.

CONTEXTO:
- Proyecto: Plataforma SaaS automatización hoteles
- Cliente piloto: Izumi Hotel, Ubud, Bali
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db

ESTADO ACTUAL:
1. VAPI (KORA) Structured Outputs ✅ funcionando
2. WF-KORA-POST-CALL ✅ extrae datos correctamente
3. BANYU (WhatsApp) ✅ listo pero INACTIVO
4. WF-SP-01 Inbound Lead Handler ✅ listo pero INACTIVO

TAREAS PENDIENTES HOY (prioridad máxima):

1. KORA → Inbound Lead Handler
   - Copiar nodos de TEMP workflow 0PX8qJ4yyfQM4o1j
   - Pegar en WF-KORA-POST-CALL (GIYbLfAkTrI7gHPH)
   - Conectar Build Master Event → Send to WF-SP-01

2. Actualizar Prompt VAPI
   - Añadir pausa inicial (no cortar "Hello")
   - Especificar año 2026 para fechas
   - Mejorar respuesta disponibilidad 24/7
   - Añadir opción inglés/español

3. Arreglar Email Resend
   - Verificar configuración
   - Probar envío

4. Activar workflows
   - BANYU (ORTMMLk6qVKFhELp)
   - WF-SP-01 (BX2X9P1xvZBnpr1p)

5. Evaluar MCP Central
   - ¿Merece la pena recuperar ahora que VAPI envía JSON limpio?

DESPUÉS DE HOY:
- Follow-Up Engine (LUMINA)
- Guest Journey
- Content Generator
- Proactive Agentic Context Agents

REGLA: Cualquier canal de entrada → Master Event v1.0 → WF-SP-01 → Supabase

¿Empezamos por la tarea 1?
```

---

# ANEXO: Tablas Supabase Relevantes

| Tabla | Filas | Uso |
|-------|-------|-----|
| leads | 19 | CRM unificado |
| lead_events | 41 | Log de eventos |
| bookings | 144 | Reservas |
| guests | 16 | Perfiles huéspedes |
| properties | 14 | Propiedades/villas |
| whatsapp_messages | 38 | Log WhatsApp |
| communications_log | 31 | Log comunicaciones |

---

*Documento generado: 16 Enero 2026*
*Próxima actualización: Después de completar tareas prioritarias*
