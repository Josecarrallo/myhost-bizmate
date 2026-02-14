# MY HOST BizMate - Estado Completo
**Fecha:** 25 de Enero 2026  
**Versión:** 4.0 (POST-TESTING KORA + OSIRIS)

---

# RESUMEN EJECUTIVO

MY HOST BizMate es un SaaS de automatización para boutique hotels.
**Cliente piloto:** Izumi Hotel (7 villas, Ubud, Bali)

## ✅ ESTADO ACTUAL: TESTING COMPLETADO

| Componente | Estado |
|------------|--------|
| BANYU (WhatsApp AI) | ✅ 100% |
| KORA (Voice AI) | ✅ 100% |
| WF-04 Follow-Up Engine | ✅ 100% |
| WF-05 Guest Journey | ✅ 100% |
| OSIRIS (Dashboard AI) | ✅ 90% |
| LUMINA (Lead Intelligence) | ✅ 75% |

---

# IDs CRÍTICOS

```
TENANT_ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE:  +34619794604
```

**URLs:**
```
n8n:          https://n8n-production-bb2d.up.railway.app
Supabase:     https://jjpscimtxrudtepzwhag.supabase.co
```

**Teléfonos:**
```
BANYU WhatsApp:  +62 813 2576 4867
Owner:           +34 619 794 604
```

---

# WORKFLOWS ACTIVOS

| ID | Nombre | Trigger | Estado |
|----|--------|---------|--------|
| `NJR1Omi4BqKA9f1P` | BANYU WhatsApp Concierge | Webhook ChakraHQ | ✅ |
| `gsMMQrc9T2uZ7LVA` | WF-02 KORA-POST-CALL | Webhook VAPI | ✅ |
| `OZmq7E9wzODJrzej` | WF-03-LEAD-HANDLER | Webhook | ✅ |
| `EtrQnkgWqqbvRjEB` | WF-SP-02 LUMINA | Webhook | ✅ |
| `p3ukMWIbKN4bf5Gz` | WF-04-BOOKING-NOTIFICATIONS | Webhook (Trigger) | ✅ |
| `HndGXnQAEyaYDKFZ` | WF-04 Follow-Up Engine | CRON 1h | ✅ |
| `cQLiQnqR2AHkYOjd` | WF-05 Guest Journey | CRON 1h | ✅ |
| `v8icxH6TOdCKO823` | OSIRIS AI Assistant | Webhook | ✅ |

---

# ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────────────────────┐
│                    CANALES DE ENTRADA                            │
├─────────────────────────────────────────────────────────────────┤
│   KORA.AI      │   BANYU.AI     │    Web      │   Instagram     │
│   (Voice)      │   (WhatsApp)   │   (TODO)    │    (TODO)       │
│   channel:     │   channel:     │             │                 │
│   voice_ai     │   direct       │             │                 │
└──────┬─────────┴───────┬────────┴─────────────┴─────────────────┘
       │                 │
       ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESAMIENTO                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  WF-02      │    │   BANYU     │    │  WF-03      │          │
│  │  KORA POST  │───▶│   Agent     │───▶│  LEAD       │          │
│  │  CALL       │    │   Tools     │    │  HANDLER    │          │
│  └─────────────┘    └─────────────┘    └──────┬──────┘          │
│                                               │                  │
│                                               ▼                  │
│                                        ┌─────────────┐          │
│                                        │  LUMINA     │          │
│                                        │  Analysis   │          │
│                                        └─────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DECISIÓN: ¿HAY BOOKING?                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     ┌──────────────────┐          ┌──────────────────┐          │
│     │  SÍ - BOOKING    │          │  NO - LEAD ONLY  │          │
│     │  CONFIRMADO      │          │                  │          │
│     └────────┬─────────┘          └────────┬─────────┘          │
│              │                             │                     │
│              ▼                             ▼                     │
│     ┌──────────────────┐          ┌──────────────────┐          │
│     │ Supabase TRIGGER │          │ WF-04 Follow-Up  │          │
│     │ lead_won_on_     │          │ Engine (CRON 1h) │          │
│     │ booking          │          │                  │          │
│     └────────┬─────────┘          │ 6 Steps:         │          │
│              │                    │ • T+2h  SOFT     │          │
│              ▼                    │ • T+24h VALUE    │          │
│     ┌──────────────────┐          │ • T+48h LAST     │          │
│     │ WF-04-BOOKING-   │          │ • T+72h REENGAGE │          │
│     │ NOTIFICATIONS    │          │ • T+7d  INCENTIVE│          │
│     │                  │          │ • T+14d CLOSURE  │          │
│     │ • WA Guest ✅     │          └──────────────────┘          │
│     │ • WA Owner ✅     │                                        │
│     │ • Email Guest    │                                        │
│     └────────┬─────────┘                                        │
│              │                                                   │
│              ▼                                                   │
│     ┌──────────────────┐                                        │
│     │ WF-05 Guest      │                                        │
│     │ Journey (CRON)   │                                        │
│     │                  │                                        │
│     │ • 7_days_before  │                                        │
│     │ • 48h_before     │                                        │
│     │ • check_in_day ✅ │                                        │
│     │ • check_out_day  │                                        │
│     │ • post_stay      │                                        │
│     └──────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REPORTING & ANALYTICS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     ┌──────────────────┐                                        │
│     │     OSIRIS       │                                        │
│     │   AI Assistant   │                                        │
│     │                  │                                        │
│     │ Tools:           │                                        │
│     │ • get_leads      │                                        │
│     │ • get_bookings   │                                        │
│     │ • get_payments   │                                        │
│     │ • get_guests     │                                        │
│     │ • get_checkins   │                                        │
│     │ • get_alerts     │                                        │
│     │ • get_kpis       │                                        │
│     │ • get_summary ✅  │                                        │
│     └──────────────────┘                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# PRUEBAS COMPLETADAS

## 24 Enero 2026

| Prueba | Estado |
|--------|--------|
| BANYU → Booking → Notificaciones | ✅ |
| BANYU → Info/Precio (sin booking) | ✅ |
| WF-04 Follow-Up Engine (Step 1) | ✅ |
| WF-05 Guest Journey (check_in_day) | ✅ |

## 25 Enero 2026

| Prueba | Estado |
|--------|--------|
| KORA → Info/Precio (sin booking) | ✅ |
| KORA → Booking completo | ✅ |
| WF-05 Guest Journey (fix JSON) | ✅ |
| OSIRIS get_summary_report | ✅ |
| Trigger lead_won_on_booking | ✅ |

---

# CORRECCIONES APLICADAS

## 24 Enero 2026

### 1. Trigger Supabase - booking_notification_trigger
```sql
-- ANTES: Solo voice_ai
WHEN ((NEW.status = 'confirmed') AND (NEW.channel = 'voice_ai'))

-- DESPUÉS: Todos los canales
WHEN (NEW.status = 'confirmed')
```

### 2. BANYU - Tool "Create Booking"
- Cambiar `status: "inquiry"` → `status: "confirmed"`

### 3. WF-03 - Nodo UPDATE
- Añadir `next_followup_at` al actualizar leads existentes

## 25 Enero 2026

### 4. WF-05 - Nodo "Update Journey State"
```json
// ANTES (incorrecto - mezclaba = con {{ }})
={
  "journey_state": "{{ $json.new_journey_state }}"
}

// DESPUÉS (correcto)
{
  "journey_state": "{{ $json.new_journey_state }}"
}
```

### 5. Trigger lead_won_on_booking (NUEVO)
```sql
CREATE OR REPLACE FUNCTION update_lead_on_booking()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' AND NEW.guest_phone IS NOT NULL THEN
    UPDATE leads 
    SET state = 'WON',
        converted_at = NOW(),
        closed_at = NOW(),
        updated_at = NOW()
    WHERE phone = NEW.guest_phone
      AND state != 'WON';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_won_on_booking
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_lead_on_booking();
```

### 6. Función get_summary_report (NUEVA)
```sql
CREATE OR REPLACE FUNCTION get_summary_report(p_period TEXT DEFAULT 'daily')
RETURNS JSON
-- Devuelve: leads (total, by_channel, by_intent, by_state, conversion_rate),
--           bookings (total, revenue, avg_value, nights, guests),
--           activity (followups_sent, journey_messages),
--           top_leads
```

### 7. OSIRIS - Tool get_summary_report (NUEVO)
- Method: POST
- URL: https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_summary_report
- Body: `{"p_period": "daily"}`

---

# PENDIENTES

## Alta Prioridad

### 1. OSIRIS - Reportes weekly/monthly
**Estado:** Solo funciona 'daily'
**Solución:** Crear 3 tools separados:
- `get_daily_report` → `{"p_period": "daily"}`
- `get_weekly_report` → `{"p_period": "weekly"}`
- `get_monthly_report` → `{"p_period": "monthly"}`

### 2. OSIRIS - Reportes por fechas personalizadas
**Estado:** Función preparada, tool no configurado
**Solución:** La función ya acepta p_start_date y p_end_date, pero el HTTP Request Tool no puede enviar parámetros dinámicos. Requiere solución alternativa.

### 3. AUTO PILOT
**Estado:** Por configurar
**Descripción:** Sistema de automatización proactiva

## Media Prioridad

### 4. LUMINA - Ejecutar acciones downstream
**Estado:** 75% - Analiza pero no ejecuta
**Pendiente:** Conectar decisiones (BOOKED/FOLLOWUP/REENGAGE/CLOSE) a workflows

### 5. Landing Page Web
**Estado:** No iniciado
**Descripción:** Formulario web → WF-03

### 6. Instagram DM Integration
**Estado:** No iniciado

### 7. Trigger duplicado (limpieza)
```sql
DROP TRIGGER IF EXISTS on_booking_insert ON bookings;
DROP FUNCTION IF EXISTS notify_booking_created();
```

---

# FUNCIONES SUPABASE ACTIVAS

| Función | Descripción |
|---------|-------------|
| `get_summary_report(p_period)` | Resumen daily/weekly/monthly |
| `get_daily_summary()` | Resumen del día (deprecated, usar get_summary_report) |
| `get_due_followup_leads()` | Leads pendientes de follow-up |
| `update_lead_after_followup()` | Actualiza lead post follow-up |
| `log_followup_event()` | Registra evento de follow-up |
| `update_owner_notified()` | Marca notificación a owner |
| `get_dashboard_stats()` | KPIs generales |
| `get_today_checkins()` | Check-ins del día |
| `get_active_alerts()` | Alertas activas |
| `update_lead_on_booking()` | Lead → WON cuando hay booking |

---

# TRIGGERS SUPABASE ACTIVOS

| Trigger | Tabla | Acción |
|---------|-------|--------|
| `booking_notification_trigger` | bookings | INSERT confirmed → WF-04-BOOKING-NOTIFICATIONS |
| `lead_won_on_booking` | bookings | INSERT confirmed → Lead state = WON |

---

# RESULTADOS DE TESTING 25 ENE

## TEST KORA 1: Consulta Info ✅
```
Lead creado:
- ID: 870d4c5a-8214-49fc-aafc-ed3fd47cdbd6
- Name: Jose Garalo
- Channel: vapi
- State: NEW → WON (post booking)
- Intent: availability → booking
- Score: 50 → 100
- next_followup_at: ✅ seteado
- Booking: NO ✅
```

## TEST KORA 2: Booking Completo ✅
```
Booking creado:
- ID: d2c9252f-c0fb-45ae-a42e-cc0ab7561ea7
- Guest: Perez
- Channel: voice_ai ✅
- Status: confirmed ✅
- journey_state: booking_confirmed
- Check-in: 2026-06-01
- Check-out: 2026-06-10
- Total: $4,050 USD

Notificaciones:
- WhatsApp Owner: ✅ Recibido
- WhatsApp Guest: ✅ Recibido

Lead:
- State: WON ✅ (trigger automático)
```

## TEST OSIRIS: Daily Report ✅
```
Pregunta: "Dame el resumen diario"
Respuesta: Datos correctos de leads, bookings, revenue, conversión
```

---

# API KEYS SUPABASE

```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

---

*Documento actualizado: 25 de Enero 2026 - 12:00 hora Bali*
*Testing BANYU ✅ | Testing KORA ✅ | OSIRIS Daily ✅*
