# PROMPT DE ARRANQUE - MY HOST BizMate
## Fecha: 6 Enero 2026

---

## CONTEXTO

Estoy construyendo MY HOST BizMate, un sistema SaaS de automatización para hoteles boutique. El cliente piloto es Izumi Hotel (7 villas de lujo en Ubud, Bali).

El sistema tiene 2 workflows principales que NUNCA se llaman directamente:
- **WF-01 (WF-SP-01)**: Inbound Lead Handler - recibe leads de todos los canales
- **WF-03**: Follow-Up Engine - ejecuta reglas de seguimiento por tiempo (CRON)

---

## ESTADO ACTUAL

### ✅ COMPLETADO:
1. WF-01 Inbound Lead Handler (CBiOKCQ7eGnTJXQd) - ACTIVO
2. WF-04 WhatsApp Lead Capture CRON (18rTfM6Q9sfqayuG) - ACTIVO cada 12h
3. WhatsApp AI Concierge (ORTMMLk6qVKFhELp) - ACTIVO
4. Contrato WF-01 ↔ WF-03 definido

### ❌ PENDIENTE:
- **Punto 2**: Tests WF-01 (simular canales, validar dedupe)
- **Punto 5**: WF-03 Follow-Up Engine (CRÍTICO - motor de ventas)
- **Punto 6**: Tests WF-03
- **Punto 7**: Integraciones Meta (Instagram/Facebook)
- **Punto 8**: Fase posterior (escalado comercial)

---

## PRÓXIMA TAREA

Construir **WF-03 Follow-Up Engine** según especificación:

### Estructura:
```
CRON (cada 15-60 min)
  ↓
Load Due Leads (next_followup_at <= now)
  ↓
Compute Next Action (template por step)
  ↓
Send Message (WhatsApp/Email)
  ↓
Update Lead (state, timestamps, step)
  ↓
Owner Notification (si aplica)
  ↓
Log Event
```

### Timeline:
- Step 1 (+24h): FU_24_SOFT
- Step 2 (+48h): FU_48_VALUE
- Step 3 (+72h): FU_72_LAST
- Step 4 (+7d): FU_7D_REENGAGE
- Step 5 (+14d): FU_14D_INCENTIVE
- Step 6 (+30d): FU_30D_FINAL → LOST

### Estados:
NEW → ENGAGED → HOT → FOLLOWING_UP → WON / LOST

### Notificar owner si:
- Lead HOT
- stay_nights > 5 OR villas_count > 2
- requested_discount = true
- HOT + 72h sin respuesta

---

## ANTES DE WF-03: Migración DB

Añadir campos a tabla `leads`:
- next_followup_at (timestamp)
- followup_step (int)
- last_outbound_at (timestamp)
- last_owner_notified_at (timestamp)
- stay_nights (int)
- villas_count (int)
- requested_discount (boolean)
- closed_at (timestamp)
- value_score (int)

---

## CREDENCIALES

- **n8n**: https://n8n-production-bb2d.up.railway.app
- **Supabase**: jjpscimtxrudtepzwhag.supabase.co
- **WF-SP-01 Webhook**: /webhook/inbound-lead-v3
- **Izumi Property ID**: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- **ChakraHQ Token**: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

---

## DOCUMENTO DE REFERENCIA

El plan completo está en: PLAN_DE_EJECUCIÓN___MYHOST_BIZMATE__VALIDADO_6_DICIEMBRE_2026_.docx

Este documento contiene las especificaciones detalladas de WF-01, WF-03, tests, integraciones y contrato de datos.

---

## EMPEZAR POR

1. Migración de campos en tabla `leads`
2. Construir WF-03 Follow-Up Engine
