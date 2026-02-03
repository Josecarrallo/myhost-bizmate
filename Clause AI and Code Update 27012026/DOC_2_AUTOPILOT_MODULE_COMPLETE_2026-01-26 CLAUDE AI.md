# AUTOPILOT MODULE - Documentación Completa
## MY HOST BizMate - Actualización 26 Enero 2026

---

## 1. VISIÓN DEL MÓDULO AUTOPILOT

AUTOPILOT es el módulo de automatización proactiva que permite al sistema tomar acciones sin intervención del owner, manteniendo control humano para decisiones críticas.

### Filosofía
- **Automático por defecto:** El sistema actúa sin esperar al owner
- **Supervisión humana:** El owner ve qué hizo el sistema y puede intervenir en casos especiales
- **Transparencia total:** Cada acción se registra y es visible en OSIRIS

---

## 2. ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────────────┐
│                         AUTOPILOT                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │   WF-D3      │    │   WF-D2      │    │ WF-AUTOPILOT     │  │
│  │ Daily Summary│    │  Payment     │    │ Actions          │  │
│  │              │    │ Protection   │    │ Approve/Reject   │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                   │                    │              │
│         ▼                   ▼                    ▼              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SUPABASE TABLES                        │  │
│  │  • daily_summary                                          │  │
│  │  • autopilot_actions                                      │  │
│  │  • autopilot_activity_log                                 │  │
│  │  • autopilot_alerts                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    OSIRIS DASHBOARD                       │  │
│  │  • Actions Needing Approval                               │  │
│  │  • Quick Actions                                          │  │
│  │  • Activity Log                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. WORKFLOWS IMPLEMENTADOS

### 3.1 WF-D3 Daily Owner Summary

| Propiedad | Valor |
|-----------|-------|
| **ID** | `Y40PfgjndwMepfaD` |
| **Trigger** | CRON 18:00 WITA diario |
| **Estado** | ✅ COMPLETO Y FUNCIONAL |

**Flujo:**
1. CRON dispara a las 18:00
2. Consulta métricas del día (check-ins, check-outs, pagos pendientes, etc.)
3. Guarda resumen en `daily_summary`
4. Envía WhatsApp al owner con resumen

**Métricas incluidas:**
- Check-ins hoy
- Check-outs hoy
- Pagos pendientes
- Nuevas consultas
- Reservas confirmadas
- Holds expirados

---

### 3.2 WF-D2 Payment Protection

| Propiedad | Valor |
|-----------|-------|
| **ID** | `o471FL9bpMewcJIr` |
| **Trigger** | Webhook POST `/autopilot/payment/start` |
| **Estado** | ✅ FUNCIONAL (falta trigger automático) |

**Flujo:**
```
Webhook → Load Booking → Update Status (pending_payment)
    → Send Payment Instructions (WhatsApp)
    → Wait 6h
    → Reminder 1 ("18h remaining")
    → Wait 14h
    → Reminder 2 ("4h remaining - FINAL")
    → Final Check (payment_status)
    → IF paid: Confirm Booking + Log
    → IF not paid: Expire Booking + Log
```

**Mensajes enviados:**

1. **Inicial:**
```
Hi! Your booking is confirmed pending payment.
Amount: $[amount] [currency]
Please complete payment within 24 hours to secure your dates.
Reply here once payment is made.
```

2. **Reminder 1 (6h):**
```
Hi! Friendly reminder - your booking payment is still pending.
Amount: $[amount]
18 hours remaining to secure your dates.
```

3. **Reminder 2 (20h):**
```
FINAL REMINDER
Your booking expires in 4 hours.
Amount: $[amount]
After expiration, dates will be released.
```

**Webhook Input:**
```json
{
  "tenant_id": "uuid",
  "property_id": "uuid",
  "booking_id": "uuid",
  "guest_contact": "+34619794604",
  "amount": 6300,
  "currency": "USD"
}
```

---

### 3.3 WF-AUTOPILOT Actions Approve/Reject

| Propiedad | Valor |
|-----------|-------|
| **ID** | `E6vXYR5Xm3SYVEnC` |
| **Trigger** | Webhook POST `/autopilot/action` |
| **Estado** | ⚠️ EXISTE - PENDIENTE VERIFICAR |

**Webhook Input:**
```json
{
  "action": "approve",  // o "reject"
  "action_id": "uuid-de-la-accion",
  "user_id": "uuid-del-owner"
}
```

---

## 4. TABLAS DE BASE DE DATOS

### 4.1 daily_summary
```sql
CREATE TABLE daily_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  summary_date DATE NOT NULL,
  metrics JSONB DEFAULT '{
    "checkins_today": 0,
    "checkouts_today": 0,
    "pending_payments": 0,
    "expired_holds_today": 0,
    "new_inquiries_today": 0,
    "confirmed_bookings_today": 0
  }',
  alerts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 autopilot_actions
```sql
CREATE TABLE autopilot_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  related_type TEXT,
  related_id TEXT,
  payload JSONB DEFAULT '{}',
  details JSONB DEFAULT '{}',
  priority VARCHAR DEFAULT 'normal',
  source VARCHAR,
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

### 4.3 autopilot_activity_log
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

---

## 5. CASOS DE USO - APPROVE/REJECT

El botón Approve/Reject en OSIRIS es para **CASOS ESPECIALES** que requieren decisión humana:

### Caso A: Payment Verification Pending
**Situación:** Guest hace transferencia bancaria, faltan 2h para expiración, guest envía screenshot del comprobante.

**Acción del sistema:**
```json
{
  "action_type": "payment_verification",
  "title": "Payment Verification - Sarah Johnson",
  "description": "Guest claims payment sent. Bank transfer pending.",
  "details": {
    "booking_id": "uuid",
    "guest_name": "Sarah Johnson",
    "hours_remaining": 2,
    "payment_method": "bank_transfer"
  },
  "status": "pending"
}
```

**Si Approve:** Extiende hold 24h + notifica al guest
**Si Reject:** Deja que expire normalmente

### Caso B: Custom Payment Plan
**Situación:** Guest pide pagar 50% ahora, 50% una semana antes del check-in.

**Acción del sistema:**
```json
{
  "action_type": "custom_payment_plan",
  "title": "Custom Payment Plan Request",
  "description": "Guest requests split payment: 50% now, 50% in 14 days",
  "status": "pending"
}
```

### Caso C: Cancellation Exception
**Situación:** Guest cancela 2 días antes (política: no reembolso), pero tiene emergencia familiar.

**Acción del sistema:**
```json
{
  "action_type": "cancellation_exception",
  "title": "Cancellation Exception Request",
  "description": "Guest requests refund despite policy. Reason: family emergency",
  "status": "pending"
}
```

---

## 6. ESTADO ACTUAL vs OBJETIVO

| Componente | Estado Actual | Objetivo |
|------------|---------------|----------|
| WF-D3 Daily Summary | ✅ Completo | ✅ |
| WF-D2 Payment Protection | ✅ Funcional | ⚠️ Falta trigger automático |
| WF-D2 → Casos especiales | ❌ No implementado | Crear autopilot_action cuando faltan 2h + guest envió mensaje |
| WF-AUTOPILOT Actions | ⚠️ Existe | Verificar y probar |
| OSIRIS Dashboard | ✅ UI lista | ✅ |

---

## 7. PENDIENTE DE IMPLEMENTAR

### 7.1 Trigger Automático de WF-D2
**Opción recomendada:** CRON cada 15 minutos

```
1. Buscar reservas con:
   - payment_status = 'pending'
   - status IN ('confirmed', 'provisional')
   - Sin proceso de Payment Protection activo
   - No tiene payment_expiry_at o payment_expiry_at es NULL

2. Para cada reserva encontrada:
   - Llamar webhook /autopilot/payment/start
   - Marcar booking con payment_expiry_at
```

### 7.2 Lógica de Casos Especiales en WF-D2
**Cuándo crear autopilot_action:**
- Faltan ≤2h para expiración
- Guest ha enviado mensaje en las últimas 2h
- Mensaje contiene indicadores de pago (screenshot, "paid", "transferred", etc.)

**Acción:**
```json
{
  "action_type": "payment_verification",
  "title": "Payment Verification - [guest_name]",
  "description": "Guest claims payment sent. [hours_remaining]h remaining.",
  "status": "pending",
  "related_type": "booking",
  "related_id": "[booking_id]"
}
```

### 7.3 Verificar WF-AUTOPILOT Actions
1. Probar con action_id real
2. Verificar que actualiza `autopilot_actions.status`
3. Verificar que ejecuta acción correspondiente según `action_type`

---

## 8. TESTING COMMANDS

### Probar WF-D2 Payment Protection
```powershell
$body = '{"tenant_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db","property_id":"18711359-1378-4d12-9ea6-fb31c0b1bac2","booking_id":"68f08a60-6ecd-4b68-8252-a2fba7a2b981","guest_contact":"+34619794604","amount":6300,"currency":"USD"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

### Probar Daily Summary API
```powershell
$body = '{"tenant_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db","property_id":"18711359-1378-4d12-9ea6-fb31c0b1bac2"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary" -Method POST -ContentType "application/json" -Body $body
```

### Probar Approve/Reject
```powershell
$body = '{"action":"approve","action_id":"[UUID]","user_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

---

## 9. CHECKLIST ANTES DE PRODUCCIÓN

- [x] WF-D3 Daily Summary funcional
- [x] WF-D2 Payment Protection funcional (manual)
- [x] Tablas Supabase creadas
- [x] OSIRIS muestra Actions Needing Approval
- [ ] Trigger automático de WF-D2 implementado
- [ ] WF-AUTOPILOT Actions verificado
- [ ] Casos especiales (payment_verification) implementados
- [ ] Test end-to-end con reserva real

---

*Documento generado: 26 de Enero 2026*
