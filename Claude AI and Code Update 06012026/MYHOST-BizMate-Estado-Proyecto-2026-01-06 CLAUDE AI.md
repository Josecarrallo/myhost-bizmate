# MY HOST BizMate - Estado del Proyecto
## Fecha: 6 Enero 2026

---

## OBJETIVO DEL SISTEMA

Construir un sistema de captación, seguimiento y conversión de leads multicanal, basado en workflows desacoplados, escalables y auditables (WF-01 + WF-03), con un WhatsApp AI Concierge conectado al motor comercial.

---

## ESTADO DE EJECUCIÓN

| # | Tarea | Estado | Notas |
|---|-------|--------|-------|
| 1 | WF-01 Inbound Lead Handler | ✅ HECHO | WF-SP-01 (CBiOKCQ7eGnTJXQd) |
| 2 | WF-01 Tests (simular canales, dedupe, logs) | ❌ PENDIENTE | |
| 3 | Contrato WF-01 ↔ WF-03 | ✅ DEFINIDO | En documento, campos pendientes en DB |
| 4 | WhatsApp AI Concierge → WF-01 | ✅ HECHO | Via WF-04 CRON cada 12h |
| 5 | WF-03 Build (Follow-Up Engine) | ❌ PENDIENTE | CRÍTICO - Motor de ventas |
| 6 | WF-03 Tests | ❌ PENDIENTE | |
| 7 | Integraciones reales (Meta IG/FB, TikTok) | ❌ PENDIENTE | |
| 8 | Fase posterior (cuentas reales, escalado) | ❌ PENDIENTE | |

---

## WORKFLOWS ACTIVOS

| Workflow | ID | Función |
|----------|-----|---------|
| WF-SP-01 Inbound Lead Handler | CBiOKCQ7eGnTJXQd | Recibe leads de todos los canales |
| WF-04 WhatsApp Lead Capture CRON | 18rTfM6Q9sfqayuG | Cada 12h captura WhatsApp → WF-SP-01 |
| WhatsApp AI Concierge | ORTMMLk6qVKFhELp | Conversación AI + bookings |

---

## ARQUITECTURA ACTUAL

```
CANALES NO-WHATSAPP (Web/Instagram/Facebook/Voice)
  ↓
WF-SP-01 (webhook) → tabla leads

WHATSAPP
  ↓
WhatsApp Concierge → whatsapp_messages + bookings
  ↓
WF-04 (CRON 12h) → WF-SP-01 → tabla leads
```

---

## PENDIENTE CRÍTICO: WF-03 FOLLOW-UP ENGINE

### Qué hace:
- CRON cada 15-60 minutos
- Lee leads con `next_followup_at <= now()`
- Envía follow-ups automáticos según timeline
- Cambia estados y notifica al owner

### Timeline de follow-ups:
| Paso | Tiempo | Template | Acción |
|------|--------|----------|--------|
| 1 | +24h | FU_24_SOFT | Soft message |
| 2 | +48h | FU_48_VALUE | Value reminder |
| 3 | +72h | FU_72_LAST | Last attempt |
| 4 | +7d | FU_7D_REENGAGE | Re-engagement |
| 5 | +14d | FU_14D_INCENTIVE | + incentivo |
| 6 | +30d | FU_30D_FINAL | Final → LOST |

### Estados del lead:
```
NEW → ENGAGED → HOT → FOLLOWING_UP → WON / LOST
```

### Notificar al owner cuando:
- Lead becomes HOT
- High value (stay_nights > 5 OR villas_count > 2)
- HOT con no reply after 72h
- Requests discount

---

## CAMPOS REQUERIDOS EN TABLA `leads`

### Ya existen:
- id, tenant_id, property_id
- lead_key, channel, state
- name, email, phone
- last_inbound_at, intent

### Faltan (para WF-03):
- `next_followup_at` (timestamp)
- `followup_step` (int 1-6)
- `last_outbound_at` (timestamp)
- `last_owner_notified_at` (timestamp)
- `stay_nights` (int)
- `villas_count` (int)
- `requested_discount` (boolean)
- `closed_at` (timestamp)
- `value_score` (int)

---

## CREDENCIALES

### n8n
- URL: https://n8n-production-bb2d.up.railway.app
- WF-SP-01 Webhook: /webhook/inbound-lead-v3

### Supabase
- Project: jjpscimtxrudtepzwhag.supabase.co
- Tablas: leads, lead_events, whatsapp_messages, bookings, properties

### WhatsApp (ChakraHQ)
- Phone Number ID: 944855278702577
- Bearer Token: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

### Izumi Hotel
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Slug: izumi-hotel

---

## PRÓXIMAS TAREAS (en orden)

1. **Tests WF-01** - Simular canales Web/Instagram/Facebook, validar dedupe
2. **Migración DB** - Añadir campos para WF-03
3. **Build WF-03** - Follow-Up Engine completo
4. **Tests WF-03** - Forzar leads "due" y validar
5. **Integraciones Meta** - Instagram + Facebook webhooks

---

## PRINCIPIOS CLAVE (NO NEGOCIABLES)

- WF-01 y WF-03 NUNCA se llaman directamente
- Toda la lógica vive en workflows internos
- El tiempo gobierna el sistema (next_followup_at)
- Logs > conversaciones
- AI propone, el sistema decide
- Arquitectura primero, canales después
