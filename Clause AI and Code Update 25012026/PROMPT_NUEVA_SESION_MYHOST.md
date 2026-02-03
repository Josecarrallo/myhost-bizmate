# MY HOST BizMate - Prompt Nueva Sesión

## CONTEXTO DEL PROYECTO

SaaS de automatización para boutique hotels. Cliente piloto: Izumi Hotel (7 villas, Ubud, Bali).

**Estado actual:** Testing BANYU y KORA completado ✅. Sistema funcional end-to-end.

## IDs CRÍTICOS

```
TENANT_ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE:  +34619794604
BANYU_WA:     +62 813 2576 4867
```

## INFRAESTRUCTURA

```
n8n:      https://n8n-production-bb2d.up.railway.app
Supabase: https://jjpscimtxrudtepzwhag.supabase.co
```

## WORKFLOWS ACTIVOS

| ID | Nombre | Función |
|----|--------|---------|
| NJR1Omi4BqKA9f1P | BANYU WhatsApp | AI Concierge WhatsApp |
| gsMMQrc9T2uZ7LVA | WF-02 KORA-POST-CALL | Procesa llamadas VAPI |
| OZmq7E9wzODJrzej | WF-03-LEAD-HANDLER | Crea/actualiza leads |
| EtrQnkgWqqbvRjEB | WF-SP-02 LUMINA | Análisis de leads |
| p3ukMWIbKN4bf5Gz | WF-04-BOOKING-NOTIFICATIONS | Notifica bookings |
| HndGXnQAEyaYDKFZ | WF-04 Follow-Up Engine | Secuencia pre-booking |
| cQLiQnqR2AHkYOjd | WF-05 Guest Journey | Secuencia post-booking |
| v8icxH6TOdCKO823 | OSIRIS AI Assistant | Dashboard analytics |

## TESTING COMPLETADO ✅

- BANYU → Booking → Notificaciones ✅
- BANYU → Info/Precio (sin booking) ✅
- KORA → Info/Precio (sin booking) ✅
- KORA → Booking completo ✅
- WF-04 Follow-Up Engine ✅
- WF-05 Guest Journey ✅
- OSIRIS get_summary_report (daily) ✅

## TRIGGERS SUPABASE ACTIVOS

| Trigger | Función |
|---------|---------|
| booking_notification_trigger | INSERT confirmed → WF-04-BOOKING-NOTIFICATIONS |
| lead_won_on_booking | INSERT confirmed → Lead state = WON |

## FUNCIONES SUPABASE CLAVE

- `get_summary_report(p_period)` → Resumen daily/weekly/monthly
- `get_due_followup_leads()` → Leads pendientes follow-up
- `update_lead_on_booking()` → Lead → WON automático

## PENDIENTES PRIORITARIOS

### 1. OSIRIS - Reportes weekly/monthly
**Estado:** Solo funciona 'daily'
**Solución:** Crear 2 tools adicionales:
- `get_weekly_report` → `{"p_period": "weekly"}`
- `get_monthly_report` → `{"p_period": "monthly"}`

### 2. AUTO PILOT
**Estado:** Por configurar
**Descripción:** Sistema de automatización proactiva (siguiente tarea)

### 3. LUMINA - Acciones downstream
**Estado:** 75% - Analiza pero no ejecuta acciones

### 4. Landing Page Web
**Estado:** No iniciado

## API KEYS SUPABASE

```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

Authorization: Bearer [mismo token]

Content-Type: application/json
```

## DOCUMENTO DE REFERENCIA

MYHOST_BIZMATE_ESTADO_COMPLETO_2026-01-25_v4.md
