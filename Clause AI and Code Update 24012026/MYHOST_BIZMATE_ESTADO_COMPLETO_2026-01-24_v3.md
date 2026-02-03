# MY HOST BizMate - Estado Completo
**Fecha:** 24 de Enero 2026  
**Versión:** 3.0 (FINAL - POST-TESTING)

---

# RESUMEN TESTING 24 ENE 2026

## ✅ PRUEBAS COMPLETADAS

| Prueba | Estado |
|--------|--------|
| BANYU → Booking → Notificaciones | ✅ |
| BANYU → Info/Precio (sin booking) | ✅ |
| WF-04-BOOKING-NOTIFICATIONS | ✅ |
| WF-05 Guest Journey (check_in) | ✅ |
| WF-04 Follow-Up Engine | ✅ |

## 🔧 BUGS CORREGIDOS

### 1. Trigger Supabase
**Problema:** Solo disparaba para `channel='voice_ai'`
**Solución:** `WHEN (NEW.status = 'confirmed')` sin filtro de channel

### 2. BANYU Create Booking
**Problema:** `status: "inquiry"`
**Solución:** `status: "confirmed"`

### 3. WF-03 UPDATE
**Problema:** No seteaba `next_followup_at` en leads existentes
**Solución:** Añadir `"next_followup_at": "{{ new Date(Date.now() + 2*60*60*1000).toISOString() }}"`

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

| ID | Nombre | Trigger |
|----|--------|---------|
| `NJR1Omi4BqKA9f1P` | BANYU WhatsApp | Webhook ChakraHQ |
| `gsMMQrc9T2uZ7LVA` | WF-02 KORA-POST-CALL | Webhook VAPI |
| `OZmq7E9wzODJrzej` | WF-03-LEAD-HANDLER | Webhook |
| `EtrQnkgWqqbvRjEB` | WF-SP-02 LUMINA | Webhook |
| `p3ukMWIbKN4bf5Gz` | WF-04-BOOKING-NOTIFICATIONS | Webhook (Trigger) |
| `HndGXnQAEyaYDKFZ` | WF-04 Follow-Up Engine | CRON 1h |
| `cQLiQnqR2AHkYOjd` | WF-05 Guest Journey | CRON 1h |

---

# ARQUITECTURA

```
BANYU/KORA → ¿Booking? 
                │
     ┌──────────┴──────────┐
     ▼                     ▼
   SÍ                     NO
     │                     │
     ▼                     ▼
  INSERT booking      WF-03-LEAD-HANDLER
  status=confirmed    (crea/actualiza lead)
     │                     │
     ▼                     ▼
  TRIGGER             LUMINA
     │                     │
     ▼                     ▼
  WF-04-BOOKING-      WF-04 Follow-Up
  NOTIFICATIONS       Engine (6 pasos)
  • WA Guest
  • WA Owner
  • Email
     │
     ▼
  WF-05 Guest Journey
  (5 etapas según fechas)
```

---

# PENDIENTE: KORA (MAÑANA)

### TEST-KORA-1: Consulta info
- Llamar desde APP MYHOST Bizmate
- Verificar: lead creado, NO booking

### TEST-KORA-2: Booking por voz
- Llamar y completar reserva
- Verificar: booking + notificaciones

---

*Actualizado: 24 Enero 2026 - 20:00 Bali*
