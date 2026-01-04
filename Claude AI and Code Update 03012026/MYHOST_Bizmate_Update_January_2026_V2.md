# MYHOST Bizmate – Update January 2026 V2

## 📋 Resumen Ejecutivo

**Fecha:** 3 Enero 2026  
**Cliente Piloto:** Izumi Hotel (5-star boutique, 7 villas, Ubud, Bali)  
**Apertura:** Verano 2026

---

## 🎯 Visión del Producto

**Sistema de Operación Dual** que elimina el 90% de la carga operativa mediante dos agentes de IA especializados:

| Agente | Rol | Enfoque |
|--------|-----|---------|
| **BANYU.AI** | Front-Office / Revenue | Concierge 24/7, ventas, upselling, atención al cliente |
| **OSIRIS.AI** | Back-Office / Operaciones | Gestión de staff, logística, yield management, auditoría |

**Propuesta de Valor:** "No vendemos software donde el dueño trabaja; vendemos un sistema donde el dueño solo supervisa."

---

## 🏗️ Stack Tecnológico

| Componente | Tecnología | Estado |
|------------|------------|--------|
| Base de Datos | Supabase (PostgreSQL + Vector Store) | ✅ Configurado |
| Orquestación | n8n (Railway) | ✅ Funcionando |
| WhatsApp Business | ChakraHQ (Coexistencia) | ✅ Funcionando |
| Voice AI | VAPI + Cartesia | ✅ Funcionando |
| Email | SendGrid | ✅ Funcionando |
| LLM Principal | Claude 3.5 Sonnet | ✅ Integrado |
| Frontend | React + Tailwind | ⏳ En desarrollo |

---

## ✅ COMPLETADO - BANYU.AI v1

### 1. WhatsApp AI Concierge
- **Workflow:** `ln2myAS3406D6F8W`
- **Funcionalidad:**
  - Responde FAQs en tiempo real (24/7)
  - Consulta disponibilidad de villas
  - Informa precios y servicios
  - Modo coexistencia con ChakraHQ (owner puede intervenir)
  - Memoria de conversación

### 2. VAPI Voice Assistant
- **Workflow:** `jyvFpkPes5DdoBRE` (MCP Central)
- **Funcionalidad:**
  - Llamadas entrantes para reservas
  - Check availability en tiempo real
  - Crear reservas por voz
  - Enviar confirmaciones (WhatsApp + Email)
  - Latencia ultra-baja con Cartesia

### 3. Guest Journey Automation ⭐ NUEVO
- **Workflow:** `cQLiQnqR2AHkYOjd`
- **5 Fases automatizadas:**

| Fase | Trigger | Canal | Contenido |
|------|---------|-------|-----------|
| 7_days_before | check_in - 7 días | Email | Bali Tips & Booking Details |
| 48_hours_before | check_in - 2 días | WhatsApp | Airport Pickup Offer ($35) |
| check_in_day | Día de check-in | WhatsApp | Welcome Message + WiFi/Breakfast info |
| check_out_day | Día de check-out | WhatsApp | Checkout Thanks + Reminders |
| post_stay | check_out + 1 día | Email | Review Request + COMEBACK15 discount |

- **Características:**
  - Configuración ON/OFF por fase en `journey_settings`
  - Actualización automática de `journey_state` en bookings
  - Notificación al Owner por WhatsApp después de cada envío
  - Log de eventos en `journey_events`
  - Prevención de duplicados (no reprocesa bookings ya enviados)

### 4. New Booking Notification
- **Workflow:** `F8YPuLhcNe6wGcCv`
- **Funcionalidad:**
  - Detecta nuevas reservas en Supabase
  - Envía confirmación por Email al guest
  - Envía confirmación por WhatsApp al guest
  - Notifica al owner

---

## ✅ COMPLETADO - OSIRIS.AI v1

### 1. Owner Daily Intelligence
- **Workflow:** `aergpRINvoJEyufR`
- **Funcionalidad:**
  - Resumen diario automático
  - KPIs: ocupación, revenue, bookings
  - Envío por WhatsApp al owner
  - Ejecución programada (cron)

### 2. Journey Event Logging ⭐ NUEVO
- **Tabla:** `journey_events`
- **Campos:**
  - booking_id (FK)
  - journey_state
  - event_type (whatsapp_sent, email_sent)
  - payload_json (guest_name, template, etc.)
  - created_at

---

## 📊 Estructura de Base de Datos (Supabase)

### Tablas Principales

```
tenants                 # Multi-tenant SaaS
├── id (uuid)
├── name
├── settings_json
└── created_at

properties              # Hoteles/Villas
├── id (uuid)
├── tenant_id (FK)
├── name
├── location
└── settings_json

bookings                # Reservas
├── id (uuid)
├── property_id (FK)
├── guest_name
├── guest_email
├── guest_phone
├── check_in
├── check_out
├── status (confirmed, cancelled, completed)
├── journey_state (booking_confirmed → post_stay_sent)
├── last_journey_event_at
└── created_at

journey_settings        # Configuración por propiedad
├── id (uuid)
├── property_id (FK)
├── step_key (7_days_before, 48_hours_before, etc.)
├── channel (email, whatsapp)
├── template_name
├── enabled (boolean)
└── created_at

journey_events          # Log de mensajes enviados
├── id (uuid)
├── booking_id (FK)
├── journey_state
├── event_type
├── payload_json
└── created_at

conversations           # Historial WhatsApp
├── id (uuid)
├── property_id (FK)
├── guest_phone
├── messages_json
└── updated_at
```

---

## 🔧 IDs Críticos - Izumi Hotel

| Recurso | ID |
|---------|-----|
| tenant_id | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| property_id | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| WhatsApp Number | +62 813 2576 4867 |
| ChakraHQ Plugin | `2e45a0bd-8600-41b4-ac92-599d59d6221c` |
| Phone Number ID | `944855278702577` |

---

## 📱 Workflows n8n Activos

| Workflow | ID | Función | Estado |
|----------|-----|---------|--------|
| WhatsApp AI Concierge | `ln2myAS3406D6F8W` | Chat con huéspedes | ✅ |
| MCP Central | `jyvFpkPes5DdoBRE` | Orquestador VAPI | ✅ |
| Guest Journey Scheduler | `cQLiQnqR2AHkYOjd` | Automatización 5 fases | ✅ |
| New Booking Notification | `F8YPuLhcNe6wGcCv` | Confirmaciones | ✅ |
| Owner Daily Intelligence | `aergpRINvoJEyufR` | Resumen diario | ✅ |

---

## 🚧 PENDIENTE - MVP v1

### Alta Prioridad

| # | Tarea | Descripción | Agente |
|---|-------|-------------|--------|
| 1 | **Guest Response Handler** | Procesar respuestas "YES" al airport pickup | BANYU |
| 2 | **Lead Recovery** | Seguimiento a conversaciones sin reserva | BANYU |
| 3 | **Driver Assignment** | Asignación automática de conductores | OSIRIS |
| 4 | **Crisis Management Basic** | Detectar y resolver cancelaciones/retrasos | OSIRIS |

### Media Prioridad

| # | Tarea | Descripción | Agente |
|---|-------|-------------|--------|
| 5 | Review Monitor | Alertas de reviews Google/TripAdvisor | OSIRIS |
| 6 | Occupancy Alerts | Alertas de baja ocupación | OSIRIS |
| 7 | Payment Reminders | Recordatorios de pago pendiente | BANYU |
| 8 | Upsell During Stay | Ofertas durante la estancia | BANYU |

### Baja Prioridad (v2+)

- Yield Management (precios dinámicos por minuto)
- Auditoría GPS de conductores
- Liquidación masiva de pagos
- OCR de pasaportes

---

## 🎯 Próximo Flujo Recomendado

### Guest Response Handler

**Objetivo:** Cuando un guest responde "YES" al mensaje de airport pickup, crear automáticamente una tarea/servicio y notificar al owner.

**Flujo propuesto:**
```
WhatsApp Webhook (ChakraHQ)
    ↓
Detectar respuesta "YES" / "SI"
    ↓
Verificar contexto (¿es respuesta a airport pickup?)
    ↓
Crear registro en tabla `transfers`
    ↓
Notificar al owner por WhatsApp
    ↓
Confirmar al guest: "¡Perfecto! Tu pickup está confirmado..."
```

---

## 📝 Prompt de Seguimiento para Nueva Sesión

```
Contexto MYHOST Bizmate - Sesión de Desarrollo

PROYECTO: MY HOST BizMate - SaaS de gestión hotelera con IA dual
CLIENTE PILOTO: Izumi Hotel (Ubud, Bali) - Apertura Verano 2026

AGENTES IA:
- BANYU.AI: Front-Office (ventas, WhatsApp, VAPI voice)
- OSIRIS.AI: Back-Office (operaciones, logística, reporting)

COMPLETADO:
✅ WhatsApp AI Concierge (ChakraHQ + coexistencia)
✅ VAPI Voice Assistant (llamadas + reservas)
✅ Guest Journey Automation (5 fases: 7d, 48h, check-in, check-out, post-stay)
✅ New Booking Notification (email + WhatsApp)
✅ Owner Daily Intelligence (resumen KPIs)
✅ Journey Event Logging (auditoría en Supabase)
✅ Notify Owner (WhatsApp después de cada envío automático)

IDs CRÍTICOS:
- tenant_id: c24393db-d318-4d75-8bbf-0fa240b9c1db
- property_id (Izumi): 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Guest Journey Workflow: cQLiQnqR2AHkYOjd
- MCP Central Workflow: jyvFpkPes5DdoBRE

STACK:
- Supabase (PostgreSQL + RLS)
- n8n (Railway): https://n8n-production-bb2d.up.railway.app
- ChakraHQ (WhatsApp Business)
- VAPI + Cartesia (Voice)
- SendGrid (Email)
- Claude 3.5 Sonnet (LLM)

PENDIENTE PRIORITARIO:
1. Guest Response Handler (procesar "YES" al airport pickup)
2. Lead Recovery (seguimiento a leads fríos)
3. Driver Assignment (asignación automática)
4. Crisis Management Basic

ACCIÓN: [Especificar qué quieres desarrollar en esta sesión]
```

---

## 📞 Contacto Izumi Hotel

- **WhatsApp:** +62 813 2576 4867 (24/7)
- **Phone:** +62 813 2576 4867 (8:00-22:00)
- **Web:** www.my-host-bizmate.com
- **Voice Assistant:** 24/7

---

*Documento actualizado: 3 Enero 2026*
*Versión: 2.0*
