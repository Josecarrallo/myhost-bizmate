# MY HOST BIZMATE - INFORME GLOBAL COMPLETO
## Actualizado: 19 Enero 2026, 20:00 (Bali Time)

---

# 📋 ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Agentes AI - Definición y Roles](#3-agentes-ai)
4. [Workflows n8n - Estado Actual](#4-workflows-n8n)
5. [VAPI/KORA - Configuración](#5-vapi-kora)
6. [Problema Crítico Pendiente](#6-problema-crítico)
7. [Frontend - Estado](#7-frontend)
8. [Supabase - Base de Datos](#8-supabase)
9. [Flujos Pendientes de Implementar](#9-flujos-pendientes)
10. [Tareas Pendientes Priorizadas](#10-tareas-pendientes)
11. [Prompt para Siguiente Sesión](#11-prompt-siguiente-sesion)

---

# 1. RESUMEN EJECUTIVO

**Proyecto:** MY HOST BizMate
**Cliente Piloto:** Izumi Hotel (7 villas de lujo, Ubud, Bali - apertura verano 2026)
**Objetivo:** Plataforma SaaS de automatización para hoteles boutique y villas

## Stack Tecnológico
| Componente | Tecnología | URL |
|------------|------------|-----|
| Frontend | React + Vite + Tailwind | https://my-host-bizmate.vercel.app |
| Backend/DB | Supabase (PostgreSQL) | https://jjpscimtxrudtepzwhag.supabase.co |
| Workflows | n8n (Railway) | https://n8n-production-bb2d.up.railway.app |
| Voice AI | VAPI | Dashboard VAPI |
| WhatsApp | ChakraHQ | API ChakraHQ |
| Email | SendGrid | API SendGrid |

## Estado General
- **Frontend:** 40% migrado a datos reales
- **Backend n8n:** Flujos core funcionando, pendientes flujos avanzados
- **VAPI/KORA:** Funcional con problema de datos en bookings
- **BANYU (WhatsApp):** Diseñado, no activado en producción

---

# 2. ARQUITECTURA DEL SISTEMA

## Regla de Arquitectura Híbrida
```
App (ClaudeCode) = INTERFAZ → solo muestra y envía/recibe
n8n (Claude AI)  = CEREBRO  → interpreta, consulta, ejecuta, registra
Supabase         = DATOS    → fuente de verdad + seguridad (RLS)
```

## Diagrama de Flujo Principal
```
┌─────────────────────────────────────────────────┐
│           CANALES DE ENTRADA                     │
├─────────────────────────────────────────────────┤
│  BANYU.AI  │  KORA.AI  │  Web  │  IG/FB  │ OTA │
│ (WhatsApp) │  (Voice)  │ Forms │Messages │     │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│     [01] INBOUND LEAD HANDLER (WF-SP-01)        │
│  - Normaliza datos                              │
│  - Deduplica                                    │
│  - Crea/actualiza lead                          │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│     [02] LUMINA.AI - Lead Intelligence          │
│  - Analiza estado del lead                      │
│  - Decide siguiente acción                      │
│  - NO conversa, NO reserva                      │
└─────────────────────────────────────────────────┘
           │                        │
           ▼                        ▼
    IF BOOKED               IF NOT BOOKED
           │                        │
           ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│ [05] GUEST       │    │ [04] FOLLOW-UP   │
│ JOURNEY          │    │ ENGINE           │
│ - Pre-arrival    │    │ - T+2h/24h/72h   │
│ - In-stay        │    │ - Re-engagement  │
│ - Post-stay      │    │                  │
└──────────────────┘    └──────────────────┘
           │                        │
           └────────────┬───────────┘
                        ▼
┌─────────────────────────────────────────────────┐
│     BANYU / KORA (EJECUCIÓN)                    │
│  - Envían WhatsApp                              │
│  - Hacen llamadas                               │
│  - Confirman reservas                           │
└─────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│     [03] OSIRIS.AI - Operations & Control       │
│  - Tasks (housekeeping/maintenance)             │
│  - Alertas y escalaciones                       │
│  - Reporting                                    │
└─────────────────────────────────────────────────┘
```

---

# 3. AGENTES AI - DEFINICIÓN Y ROLES

## 3.1 OSIRIS.AI - Operations & Control
**Rol:** Dashboard operativo y control del sistema
**Funciones:**
- KPIs del dashboard (ocupación, revenue, pagos pendientes)
- Crear tasks (housekeeping, maintenance)
- Alertas y escalaciones
- Reporting

**Tools MVP:**
- `get_dashboard_stats` (KPI)
- `list_pending_payments` (LIST)
- `propose_send_whatsapp_payment_reminder` (ACTION)

## 3.2 LUMINA.AI - Lead Intelligence & Sales Orchestrator
**Rol:** Analiza leads y decide acciones (NO conversa, NO reserva)
**Funciones:**
- Analizar estado del lead (booked/interested/cold/not_fit)
- Decidir siguiente acción
- Disparar Follow-up Engine o Guest Journey
- Recomendar canal y urgencia

**Output JSON:**
```json
{
  "lead_id": "string",
  "lead_status": "booked | interested | cold | not_fit",
  "next_action": "guest_journey | followup | close | reengage",
  "recommended_channel": "whatsapp | voice | none",
  "urgency": "low | medium | high",
  "reason": "string"
}
```

**Tools MVP:**
- `list_hot_leads` (LIST)
- `search_lead` (LIST)
- `propose_send_followup_message` (ACTION)

## 3.3 BANYU.AI - WhatsApp Concierge
**Rol:** Conversación y reservas por WhatsApp
**Funciones:**
- Conversar con huéspedes
- Comprobar disponibilidad
- Calcular precios
- Crear reservas
- Enviar confirmaciones

**Estado:** Workflow diseñado (`NJR1Omi4BqKA9f1P`), no activo en producción

## 3.4 KORA.AI - Voice Concierge
**Rol:** Conversación y reservas por teléfono (VAPI)
**Funciones:**
- Atender llamadas 24/7
- Comprobar disponibilidad
- Calcular precios
- Crear reservas (⚠️ PROBLEMA ACTUAL)
- Generar structured output post-llamada

**Estado:** Activo con problema de datos en bookings

## 3.5 IRIS.AI - Marketing & Content
**Rol:** Generación de contenido y marketing
**Funciones:**
- Content Generator (posts, emails, ads)
- Campaign summaries
- Reviews management

**Estado:** Diseñado, no implementado

## 3.6 AURA.AI - Insights & Analytics
**Rol:** Inteligencia de negocio y alertas
**Funciones:**
- Anomaly detection
- Business insights
- Predictive analytics

**Estado:** Diseñado, no implementado

---

# 4. WORKFLOWS N8N - ESTADO ACTUAL

## 4.1 Workflows ACTIVOS (Producción)

| ID | Nombre | Función | Webhook/Path |
|----|--------|---------|--------------|
| `gsMMQrc9T2uZ7LVA` | **WF-KORA-POST-CALL v2** | Procesa structured output VAPI, crea leads | `/webhook/kora-post-call-v2` |
| `ydByDOQWq9kJACAe` | **MCP Central v1** | Tools para VAPI (check_availability, create_booking) | `/mcp/izumi-hotel-v3` |
| `p3ukMWIbKN4bf5Gz` | **WF-BOOKING-NOTIFICATIONS v1** | WhatsApp + Email post-booking | `/webhook/booking-notifications-v3` |
| `OZmq7E9wzODJrzej` | **WF-SP-01** | Johnson Contract Handler - Crea/actualiza leads | `/webhook/inbound-johnson-v1` |

## 4.2 Workflows INACTIVOS (Referencia)

| ID | Nombre | Notas |
|----|--------|-------|
| `NJR1Omi4BqKA9f1P` | BANYU - WhatsApp AI Concierge | Modelo de referencia, funciona bien |
| `Bz2laIjsYJffUoTw` | MCP Central XX (5 tools) | Versión anterior |
| `GIYbLfAkTrI7gHPH` | WF-KORA-POST-CALL v1 | Versión anterior |

## 4.3 Reglas Críticas n8n

⚠️ **NO TOCAR RLS en Supabase** - n8n workflows se rompen
⚠️ **Actualizar n8n:** Settings → Source → Source Image (versión actual 1.123.5)
⚠️ **EVITAR v2.0** por breaking changes

---

# 5. VAPI/KORA - CONFIGURACIÓN

## 5.1 Assistant Configuration
| Campo | Valor |
|-------|-------|
| Assistant Name | Izumi Hotel Receptionist (MCP) |
| Assistant ID | `ae9ea22a-fc9a-49ba-b5b8-900ed69b7615` |
| Model | Claude 3.5 Sonnet |
| MCP Server URL | `https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel-v3` |
| Server URL (webhooks) | `https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2` |
| API Key | `bd547223-da9c-4e35-a403-2b3c6efd28b0` |

## 5.2 Structured Output: callResult
| Campo | Valor |
|-------|-------|
| ID | `6426dbc9-8b9e-49f7-8f29-faa16683bcda` |
| Linked to Assistant | ✅ Sí (vinculado 19/01/2026) |

### Schema:
```json
{
  "intentType": "BOOKING|INQUIRY|CANCEL|CHANGE|SUPPORT|OTHER",
  "tenantId": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "bookingCompleted": boolean,
  "booking": {
    "checkInDate": "YYYY-MM-DD",
    "checkOutDate": "YYYY-MM-DD",
    "numGuests": number,
    "villaName": "string",
    "totalPrice": number
  },
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "metrics": {
    "leadScore": 0-100,
    "sentiment": "positive|neutral|negative"
  },
  "callSummary": {
    "summary": "string",
    "language": "string",
    "callSuccessful": boolean
  },
  "nextAction": "CREATE_LEAD|SEND_CONFIRMATION|NONE"
}
```

---

# 6. PROBLEMA CRÍTICO PENDIENTE

## 6.1 El Problema del Número de Teléfono

### Situación Actual
1. **KORA** (Voice AI) habla con el cliente
2. Durante la llamada, KORA llama al **MCP create_booking** con datos de transcripción de voz
3. La transcripción es **aleatoria** - puede capturar mal el número
4. El booking se guarda en Supabase con **número incorrecto**
5. **Después** de la llamada, el **structured output** llega con datos **correctos**
6. WF-KORA-POST-CALL crea el **lead** con datos correctos
7. Pero el **booking** ya tiene datos incorrectos

### Evidencia
```
Booking en Supabase: guest_phone = "3461979746604" ❌ (mal)
Lead en Supabase:    phone = "34619794604" ✅ (correcto)
```

### Diferencia BANYU vs KORA
- **BANYU (WhatsApp):** Usuario **escribe** → texto exacto → funciona bien
- **KORA (Voice):** Usuario **habla** → transcripción → errores aleatorios

### Timing del Problema
```
Timeline:
─────────────────────────────────────────────────────────►
│                                                        │
│  DURANTE LA LLAMADA          │  DESPUÉS DE LA LLAMADA  │
│  ─────────────────           │  ──────────────────────  │
│  MCP create_booking          │  Structured Output      │
│  (datos de voz, MAL)         │  (datos correctos)      │
│                              │                         │
│  Booking creado ❌            │  Lead creado ✅          │
```

## 6.2 Opciones de Solución

### OPCIÓN A: Quitar create_booking del MCP
**Cambios:**
1. MCP solo tiene `check_availability` (consulta)
2. KORA confirma verbalmente pero NO crea booking
3. WF-KORA-POST-CALL crea booking con datos del structured output

**Pros:**
- Datos siempre correctos
- Un solo punto de creación de booking

**Contras:**
- Cambio en prompt de KORA en VAPI
- El booking se crea después de la llamada, no durante

### OPCIÓN B: Mantener MCP, corregir después
**Cambios:**
1. MCP crea booking "provisional"
2. WF-KORA-POST-CALL actualiza/corrige con structured output

**Pros:**
- Menos cambios en VAPI
- Booking existe durante la llamada

**Contras:**
- Más complejo
- Posibles duplicados
- Datos temporalmente incorrectos

### DECISIÓN PENDIENTE
**Necesita análisis en siguiente sesión**

---

# 7. FRONTEND - ESTADO

## 7.1 Progreso de Migración a Datos Reales

| Módulo | Estado | Datos Reales |
|--------|--------|--------------|
| Properties | ✅ 100% | Sí |
| Dashboard (Stats) | ✅ 100% | Sí |
| Dashboard (AI Agents) | ✅ 100% | Sí |
| Bookings | ✅ 95% | Sí |
| Payments | ✅ 95% | Sí |
| Messages (Multi-canal) | ✅ 95% | Sí |
| Calendar | ❌ 0% | Mock |
| Guests/CRM | ❌ 0% | Mock |
| Reviews | ❌ 0% | Mock |
| Marketing | ❌ 0% | Mock |
| AI Assistant | ⚠️ Parcial | Parcial |

**Progreso General:** ~40%

## 7.2 Tecnologías Frontend
- React 18.2 + Vite
- Tailwind CSS 3.3
- Lucide React (icons)
- Recharts (gráficos)
- Vercel (hosting)

## 7.3 Git Status
- **Branch:** `backup-antes-de-automatizacion`
- **Último commit:** `7cec6d9` - Multi-Channel Unified Inbox
- **Estado:** ✅ Todo commiteado y pusheado

---

# 8. SUPABASE - BASE DE DATOS

## 8.1 Información de Conexión
| Campo | Valor |
|-------|-------|
| URL | `https://jjpscimtxrudtepzwhag.supabase.co` |
| Tenant ID (Izumi) | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| Property ID (Izumi) | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |

## 8.2 Tablas Principales

**Operaciones:**
- `properties` (14 villas activas)
- `bookings` (144+ reservas)
- `payments` (transacciones)
- `messages` (WhatsApp, Email, Voice, SMS)
- `leads` (leads de ventas)
- `alerts` (notificaciones)

**Sistema:**
- `users` (autenticación)
- `tenants` (multi-tenancy)
- `workflow_executions` (logs n8n)
- `ai_chat_history_v2` (historial AI)

## 8.3 RPC Functions Disponibles
```sql
✅ get_lumina_stats(p_tenant_id UUID)
✅ get_banyu_stats(p_tenant_id UUID)
✅ get_kora_stats(p_tenant_id UUID)
✅ get_osiris_stats(p_tenant_id UUID)
✅ get_active_alerts()
✅ get_dashboard_stats()
✅ check_availability(p_property_id, p_check_in, p_check_out)
✅ calculate_booking_price(p_property_id, p_check_in, p_check_out, p_guests)
✅ find_lead_by_contact(p_tenant_id, p_phone, p_email)
```

---

# 9. FLUJOS PENDIENTES DE IMPLEMENTAR

## 9.1 WF-02 LUMINA.AI - Lead Intelligence
**Estado:** Diseñado, NO implementado
**Prioridad:** ALTA

**Nodos:**
1. Trigger (Webhook/Event desde BANYU o KORA)
2. Normalize Lead Event
3. LUMINA AI Node (Claude)
4. Decision Router (IF booked/interested/cold)
5. Trigger External Systems
6. Log & Metrics

## 9.2 WF-04 FOLLOW-UP ENGINE
**Estado:** Diseñado, NO implementado
**Prioridad:** ALTA

**Objetivo:** Recuperar leads "no-booked" automáticamente

**Secuencia:**
- T+2h: Follow-up #1 (value + simple question)
- T+24h: Follow-up #2 (gentle reminder)
- T+72h: Follow-up #3 (last check)
- T+7d: Optional re-engage

**Nodos:**
1. Trigger (desde LUMINA)
2. Load Lead State
3. Sequence Step Selector
4. Claude Message Generator
5. Policy Check (SAFE mode)
6. Send via BANYU/KORA
7. Wait/Delay
8. Check for Reply/Booking
9. Stop or Continue
10. Log outcome

## 9.3 WF-05 GUEST JOURNEY (Post-Booking)
**Estado:** Diseñado, NO implementado
**Prioridad:** ALTA

**Etapas:**
- **PRE-ARRIVAL (T-3d/T-1d):** Welcome, directions, upsell
- **ARRIVAL DAY:** Ready message, wifi/access info
- **IN-STAY:** "How is everything?", issue capture
- **CHECK-OUT:** Instructions, transport reminder
- **POST-STAY (T+1d/T+3d):** Thank you, review request, rebook offer

## 9.4 WF-AI-ROUTER - AI Systems
**Estado:** Diseñado, NO implementado
**Prioridad:** MEDIA

**Objetivo:** Endpoint único para AI Assistant en la app

**Endpoints:**
- `POST /ai/chat` - Conversación con agentes
- `POST /ai/action` - Ejecutar acciones confirmadas

## 9.5 CONTENT GENERATOR
**Estado:** Diseñado, NO implementado
**Prioridad:** BAJA

**Objetivo:** Generación automática de contenido marketing

## 9.6 PROACTIVE AGENTIC CONTEXT
**Estado:** Diseñado, NO implementado
**Prioridad:** BAJA

**Agentes:**
- Weather Context Agent
- Traffic & Access Agent
- Local Events & Demand Agent
- Disruption & Risk Agent

---

# 10. TAREAS PENDIENTES PRIORIZADAS

## 🔴 PRIORIDAD CRÍTICA (Resolver primero)

| # | Tarea | Descripción |
|---|-------|-------------|
| 1 | **Resolver problema MCP/Booking** | Decidir arquitectura: ¿quitar create_booking del MCP o corregir después? |
| 2 | **Implementar solución elegida** | Modificar workflows según decisión |
| 3 | **Testing completo KORA** | Verificar flujo completo con datos correctos |

## 🟠 PRIORIDAD ALTA (Esta semana)

| # | Tarea | Descripción |
|---|-------|-------------|
| 4 | **Implementar WF-02 LUMINA** | Lead Intelligence & Orchestrator |
| 5 | **Implementar WF-04 Follow-up Engine** | Secuencias de recuperación de leads |
| 6 | **Implementar WF-05 Guest Journey** | Automatización post-booking |
| 7 | **Activar BANYU en producción** | WhatsApp AI Concierge |

## 🟡 PRIORIDAD MEDIA (Próximas semanas)

| # | Tarea | Descripción |
|---|-------|-------------|
| 8 | **Migrar Calendar a datos reales** | Frontend |
| 9 | **Migrar Guests/CRM a datos reales** | Frontend |
| 10 | **Implementar WF-AI-ROUTER** | AI Systems endpoint |
| 11 | **Limpieza de workflows n8n** | Documentar y eliminar duplicados |

## 🟢 PRIORIDAD BAJA (Futuro)

| # | Tarea | Descripción |
|---|-------|-------------|
| 12 | Content Generator | Marketing automation |
| 13 | Proactive Context Agents | Weather, traffic, events |
| 14 | Reviews integration | OTAs reviews management |

---

# 11. PROMPT PARA SIGUIENTE SESIÓN

```markdown
# PROMPT INICIO SESIÓN - 20 Enero 2026

## CONTEXTO
Soy Jose, fundador de MY HOST BizMate. Continúo desarrollo de la plataforma.

## DOCUMENTOS ADJUNTOS
- MY-HOST-BIZMATE-INFORME-GLOBAL-19-01-2026.md (este documento)

## PROBLEMA CRÍTICO A RESOLVER

El MCP de KORA crea bookings con datos incorrectos (transcripción de voz), 
mientras que el structured output tiene datos correctos pero llega DESPUÉS.

### Opciones:
**A)** Quitar create_booking del MCP → booking se crea desde WF-KORA-POST-CALL
**B)** Mantener MCP → actualizar/corregir booking cuando llega structured output

## PRIMERA TAREA

Analiza ambas opciones con pros/contras considerando:
- Cambios necesarios en n8n
- Cambios necesarios en VAPI
- Riesgo de romper lo que funciona
- Complejidad de implementación
- Arquitectura consistente con BANYU

Dame tu recomendación clara.

## WORKFLOWS ACTIVOS (NO TOCAR sin razón)
- WF-KORA-POST-CALL v2: `gsMMQrc9T2uZ7LVA`
- MCP Central v1: `ydByDOQWq9kJACAe`
- WF-BOOKING-NOTIFICATIONS v1: `p3ukMWIbKN4bf5Gz`
- WF-SP-01: `OZmq7E9wzODJrzej`

## IDs IMPORTANTES
- Tenant ID: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- VAPI Assistant: `ae9ea22a-fc9a-49ba-b5b8-900ed69b7615`
```

---

# 📞 CONTACTOS

**Izumi Hotel:**
- WhatsApp: +62 813 2576 4867 (24/7)
- Phone: +62 813 2576 4867 (8:00-22:00)
- Web: www.my-host-bizmate.com

**Staff (Jose):**
- Phone: +34 619 794 604

---

*Documento generado: 19 Enero 2026, 20:00 Bali Time*
*Próxima revisión: 20 Enero 2026*
