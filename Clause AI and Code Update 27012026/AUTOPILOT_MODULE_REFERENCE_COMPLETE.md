# AUTOPILOT MODULE - DOCUMENTO DE REFERENCIA COMPLETO

**Proyecto:** MY HOST BizMate  
**Módulo:** AUTOPILOT  
**Fecha:** 27 Enero 2026  
**Versión:** 1.0

---

## 1. QUÉ ES AUTOPILOT

AUTOPILOT **NO es un agente nuevo ni IA complicada**. Es un **modo de trabajo automatizado** que hace exactamente lo que el owner hace manualmente cada día:

- Responder mensajes 24/7
- Perseguir pagos
- Controlar reservas
- No perder disponibilidad
- Saber qué ha pasado hoy / esta semana / este mes

### Problema que resuelve

| Hoy (Manual) | Con AUTOPILOT |
|--------------|---------------|
| Owner responde tarde | Disponibilidad 24/7 |
| No controla pagos | Pagos controlados |
| No sabe sus números | Claridad diaria |
| Vive bajo presión | Orden progresivo |

### El owner solo:
- Ve lo que pasa
- Introduce datos manuales si hace falta
- Aprueba o ignora acciones sugeridas

---

## 2. ESTRUCTURA DE AUTOPILOT

```
AUTOPILOT
├── FASE 1: DAILY   ← IMPLEMENTAR AHORA
├── FASE 2: WEEKLY  ← DESPUÉS
└── FASE 3: MONTHLY ← DESPUÉS
```

### FASE 1 - AUTOPILOT DAILY (Actual)
| Workflow | Función | Estado |
|----------|---------|--------|
| WF-D1 Always-On Inquiries | Responder 24/7, capturar leads | ❌ No necesario (BANYU lo hace) |
| WF-D2 Payment Protection | Control pagos, reminders, expiración | ⚠️ Creado, pendiente probar |
| WF-D3 Daily Owner Summary | Resumen diario 18:00 → WhatsApp | ✅ Funcionando |
| WF-D4 Review/Issue Watch | Detectar problemas | ⏳ Opcional |
| **WF-AUTOPILOT Actions** | **Approve/Reject desde app** | **🔄 En progreso HOY** |

### FASE 2 - AUTOPILOT WEEKLY (Después)
| Workflow | Función |
|----------|---------|
| WF-W1 Weekly Business Check | Análisis semanal |
| WF-W2 Weekly Ops Checklist | Checklist operaciones |

### FASE 3 - AUTOPILOT MONTHLY (Después)
| Workflow | Función |
|----------|---------|
| WF-M1 Monthly Close & Report | Cierre mensual y reporte |

---

## 3. ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (App)                        │
│  - Menú Autopilot (Daily/Weekly/Monthly)                │
│  - Manual Data Entry                                     │
│  - Botones Approve/Reject                               │
└──────────────────────┬──────────────────────────────────┘
                       │ Webhooks
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    n8n (Backend)                         │
│  - Workflows automáticos                                │
│  - Orquesta mensajes, pagos, resúmenes                 │
│  - Escribe estados en Supabase                          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  - Base de datos única                                  │
│  - Estados, logs, summaries                             │
│  - Punto de integración app ↔ n8n                       │
└─────────────────────────────────────────────────────────┘
```

### Responsabilidades

| Componente | Responsabilidad |
|------------|-----------------|
| **Claude AI (n8n)** | Flujos automáticos, lógica de negocio, escribir en Supabase |
| **Claude Code (App)** | Pantallas, formularios, mostrar datos, lanzar webhooks |
| **Supabase** | Fuente única de datos, estados, logs, summaries |

---

## 4. WORKFLOWS n8n - DETALLE TÉCNICO

### 4.1 WF-D1 Always-On Inquiries (NO IMPLEMENTAR - BANYU lo hace)

**Trigger:** Webhook POST `/autopilot/inquiry`

**Nodos:**
1. Webhook Trigger
2. Validate & Normalize
3. Lead Upsert (Supabase)
4. Intent Detection (RULE-BASED: booking/availability/price/dates)
5. Auto Reply (template por canal)
6. Emit Event (si booking_intent)
7. Log Activity
8. Respond 200 OK

---

### 4.2 WF-D2 Payment Protection

**ID:** `9VzPX1MCghPKkxFS`  
**Trigger:** Webhook POST `/autopilot/payment/start`  
**Estado:** ⚠️ Creado, pendiente probar

**Reglas:**
- HOLD_DURATION_HOURS = 24
- REMINDER_1 = +6h
- REMINDER_2 = +20h

**Flujo:**
```
Booking pending_payment
    │
    ├── < 6 horas → OK, no hacer nada
    │
    ├── 6-20 horas → INFO: "Payment Pending"
    │                + Acción: "Send gentle reminder"
    │
    ├── 20-24 horas → WARNING: "Payment Warning"
    │                 + Acción: "Send FINAL reminder"
    │
    └── > 24 horas → URGENT: "Payment Expired"
                    + Acción: "Cancel booking"
```

**Nodos:**
1. Webhook Trigger
2. Load Booking (Supabase)
3. Update Booking Status (pending_payment, expiry_at)
4. Send Payment Instructions (WhatsApp/Email)
5. Wait Node (6h)
6. Reminder #1
7. Wait Node (14h adicionales)
8. Reminder #2
9. Final Check (payment_received? → confirmed : expired)
10. Log Actions

---

### 4.3 WF-D3 Daily Owner Summary

**IDs:**
- CRON: `1V9GYFmjXISwXTIn` ✅ Activo
- API: `2wVP7lYVQ9NZfkxz` ✅ Activo

**Trigger:** CRON diario 18:00 Bali (WITA)

**Métricas:**
- new_inquiries_today
- pending_payments
- confirmed_bookings_today
- checkins_today
- checkouts_today
- expired_holds_today

**Nodos:**
1. CRON Trigger
2. Query Daily Metrics (Supabase RPC)
3. Build Summary JSON
4. Save daily_summary (Supabase)
5. Send WhatsApp to Owner
6. Log Completion

---

### 4.4 WF-AUTOPILOT Actions Approve/Reject V2

**ID:** `GuHQkHb21GlowIZl`  
**Endpoint:** POST `/webhook/autopilot/action`  
**Estado:** 🔄 En progreso

**Input:**
```json
{
  "action": "approve|reject",
  "action_id": "uuid",
  "user_id": "uuid",
  "reason": "optional for reject"
}
```

**Flujo actual (v2 completado hoy):**
```
Webhook → Load Action → Route Action (approve/reject)
    │
    ├── APPROVE → Switch Action Type
    │   ├── payment_verification → Extend Hold → WhatsApp → Approve → Respond ✅
    │   ├── custom_plan_request → Update Plan → WhatsApp → Approve → Respond ✅
    │   ├── cancellation_exception → Process Refund → WhatsApp → Approve → Respond ✅
    │   └── default → Approve → Respond ✅
    │
    └── REJECT → Reject in Supabase → Respond ⏳ PENDIENTE PROBAR
```

---

## 5. TABLAS SUPABASE

### 5.1 autopilot_actions
```sql
CREATE TABLE autopilot_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  action_type TEXT NOT NULL,  -- payment_verification, custom_plan_request, cancellation_exception
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected
  related_type TEXT,  -- booking, lead, etc.
  related_id UUID,
  payload JSONB DEFAULT '{}',
  details JSONB DEFAULT '{}',  -- guest_phone, amount, etc.
  priority VARCHAR DEFAULT 'normal',  -- low, normal, high, urgent
  source VARCHAR,  -- WF-D2, BANYU, etc.
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  rejected_at TIMESTAMPTZ,
  rejected_by TEXT,
  rejection_reason TEXT,
  executed_at TIMESTAMPTZ,
  execution_result JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.2 autopilot_activity_log
```sql
CREATE TABLE autopilot_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  workflow_id TEXT,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 5.3 daily_summary
```sql
CREATE TABLE daily_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  date DATE NOT NULL,
  metrics JSONB NOT NULL,
  alerts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. CASOS ESPECIALES - LÓGICA DETALLADA

### 6.1 payment_verification

**Cuándo ocurre:** Guest dice que pagó (envía screenshot), faltan ≤2h para expiración

| Acción | Qué hace |
|--------|----------|
| **APPROVE** | 1. Extender payment_expiry_at +24h<br>2. WhatsApp: "Extended hold 24h"<br>3. Marcar approved |
| **REJECT** | 1. Marcar rejected<br>2. Booking expira normalmente |

**WhatsApp APPROVE:**
```
Thank you! We've extended your booking hold by 24 hours while we verify your payment.

We'll confirm once payment is verified.
```

---

### 6.2 custom_plan_request

**Cuándo ocurre:** Guest pide plan de pago especial (50% ahora, 50% después)

| Acción | Qué hace |
|--------|----------|
| **APPROVE** | 1. Actualizar booking.payment_plan<br>2. WhatsApp: "Plan approved"<br>3. Marcar approved |
| **REJECT** | 1. Marcar rejected<br>2. WhatsApp: "Cannot accommodate" |

**WhatsApp APPROVE:**
```
Great news! Your custom payment plan has been approved.

Please complete your first payment to confirm your booking.

We look forward to hosting you!
```

**WhatsApp REJECT:**
```
We're sorry, we cannot accommodate a custom payment plan for your booking at this time.

Please complete the full payment to secure your dates.
```

---

### 6.3 cancellation_exception

**Cuándo ocurre:** Guest cancela fuera de política pero pide reembolso por emergencia

| Acción | Qué hace |
|--------|----------|
| **APPROVE** | 1. Actualizar status: cancelled, payment_status: refunded<br>2. WhatsApp: "Refund approved"<br>3. Marcar approved |
| **REJECT** | 1. Marcar rejected<br>2. WhatsApp: "Cannot make exception" |

**WhatsApp APPROVE:**
```
We understand emergencies happen. Your cancellation exception has been approved.

A refund will be processed within 5-7 business days.

We hope to welcome you in the future.
```

**WhatsApp REJECT:**
```
We're sorry, but we cannot make an exception to our cancellation policy for your booking.

Per our policy, cancellations within [X] days of check-in are non-refundable.

If you have any questions, please don't hesitate to reach out.
```

---

## 7. EXPERIENCIA DEL OWNER (UX)

### Menú en la App
```
├── Manual Data Entry  (/manual-entry)
└── Autopilot
    ├── Daily   (/autopilot/daily)
    ├── Weekly  (/autopilot/weekly)  [coming soon]
    └── Monthly (/autopilot/monthly) [coming soon]
```

### Pantalla /autopilot/daily

**A) Today at a glance (KPIs)**
- New inquiries today
- Pending payments
- Confirmed bookings today
- Check-ins today
- Expired holds

**B) Alerts**
- Expired holds
- Pending payment > 24h
- Conflicts

**C) Actions (needs approval)**
- Lista de items con status = pending
- Cada item tiene: title, description, [Approve] [Ignore]

**D) Quick Buttons**
- "Add Booking / Payment"
- "Add Lead"

### Copy / Tono

**NO usar:** agents, workflows, n8n, AI  
**SÍ usar:** Autopilot, Today summary, Needs approval, We handled X for you

---

## 8. RECURSOS DEL PROYECTO

| Recurso | Valor |
|---------|-------|
| n8n URL | https://n8n-production-bb2d.up.railway.app |
| Supabase URL | https://jjpscimtxrudtepzwhag.supabase.co |
| Supabase apikey | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0 |
| ChakraHQ WhatsApp URL | https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages |
| ChakraHQ Bearer | qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g |
| Tenant ID | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |

---

## 9. WORKFLOWS AUTOPILOT - IDs

| Workflow | ID | Estado |
|----------|-----|--------|
| AUTOPILOT - Daily Summary CRON | `1V9GYFmjXISwXTIn` | ✅ Activo |
| AUTOPILOT - Daily Summary API | `2wVP7lYVQ9NZfkxz` | ✅ Activo |
| AUTOPILOT - Payment Protection | `9VzPX1MCghPKkxFS` | ⚠️ Inactivo |
| AUTOPILOT - Actions Approve Reject V2 | `GuHQkHb21GlowIZl` | ⚠️ Inactivo |

---

## 10. PRINCIPIOS DE DISEÑO (NO NEGOCIABLES)

1. **1 workflow = 1 responsabilidad**
2. **Flujos lineales** (7-10 nodos máx.)
3. **Multi-tenant siempre** (tenant_id, property_id)
4. **Todo estado en Supabase**
5. **Nada de lógica de UI en n8n**
6. **Usar IA solo cuando aporte valor real**
7. **Implementar por fases - NO anticipar**

---

## 11. VILLA OWNER POINT OF VIEW

### Actividades Diarias del Owner
- Check bookings (OTA, WhatsApp, Instagram)
- Verificar no double booking
- Check-ins y check-outs
- Responder inquiries (precio, disponibilidad)
- Follow up pagos pendientes
- Actualizar calendarios manualmente

### Problemas Principales
- Demasiados canales de booking
- Trabajo mayormente manual
- Owner siempre "on-call"
- Sin datos estructurados
- Decisiones basadas en intuición

### Lo que necesita el Owner
- Un lugar para: ver bookings, ver ingresos, responder guests
- Notificaciones, no reportes largos
- Automatización simple de chat
- Mobile-friendly

---

*Documento generado: 27 Enero 2026*
*Este documento es la referencia maestra para el módulo AUTOPILOT*
