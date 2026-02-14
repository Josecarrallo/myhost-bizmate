# WF-AUTOPILOT Actions v3 - Especificación Completa

## CONTEXTO DEL PROYECTO

**Proyecto:** MY HOST BizMate - Módulo AUTOPILOT
**Desarrollador:** Jose (ZENTARA LIVING)
**Fecha:** 27 Enero 2026

---

## PROBLEMA TÉCNICO ACTUAL

La herramienta `n8n:create_workflow` está fallando. Durante casi 2 meses ha funcionado perfectamente creando workflows. Ahora los workflows se crean en la API (puedo hacer GET y ver los nodos) pero NO aparecen en la UI de n8n - aparecen vacíos.

**EVIDENCIA DEL BUG:**
- Workflow `E6vXYR5Xm3SYVEnC` (WF-AUTOPILOT Actions v2) - FUNCIONA, creado manualmente
- Workflows creados por Claude via API - API muestra nodos, UI muestra VACÍO
- Múltiples intentos con diferentes formatos de JSON - TODOS fallan igual

**SOLUCIÓN NECESARIA:**
1. Usar browser (Claude in Chrome) para crear el workflow directamente en la UI de n8n, O
2. Modificar el workflow v2 existente manualmente añadiendo los nodos necesarios

---

## 1. ESTADO ACTUAL (v2)

**Workflow ID:** `E6vXYR5Xm3SYVEnC`
**Nombre:** WF-AUTOPILOT Actions Approve-Reject v2
**Endpoint:** POST `/webhook/autopilot/action`
**n8n URL:** https://n8n-production-bb2d.up.railway.app

**Estructura actual:**
```
Webhook → Switch (approve/reject) → Update Supabase → Respond
```

**Lo que hace actualmente:**
1. Recibe `{action: "approve/reject", action_id: "uuid"}`
2. Actualiza `autopilot_actions` con `status: approved/rejected`
3. Responde `{success: true}`

**PROBLEMA:** Solo actualiza el status, NO ejecuta ninguna acción según el `action_type`.

---

## 2. OBJETIVO (v3)

**Nuevo endpoint:** POST `/webhook/autopilot/action/v3`

**Nuevo flujo requerido:**
```
Webhook 
    → Load Action (obtener action_type del registro)
    → Switch 1: approve/reject
        → SI APPROVE:
            → Switch 2: action_type
                → payment_verification → Extender hold + WhatsApp guest
                → custom_plan_request → Crear plan de pago
                → cancellation_exception → Procesar reembolso
                → default → Solo marcar approved
            → Update status = approved
            → Respond OK
        → SI REJECT:
            → Update status = rejected
            → Respond OK
```

---

## 3. CASOS ESPECIALES CON LÓGICA

### CASO A: payment_verification

**Cuándo ocurre:** Guest dice que pagó (envía screenshot), faltan ≤2h para expiración

**SI APPROVE:**
1. Extender `payment_expiry_at` +24 horas en `bookings`
2. Enviar WhatsApp al guest: "Thank you! We've extended your booking hold by 24 hours while we verify your payment."
3. Marcar action como `approved`
4. Log en `autopilot_activity_log`

**SI REJECT:**
1. Marcar action como `rejected`
2. Dejar que el booking expire normalmente (no hacer nada más)

### CASO B: custom_plan_request

**Cuándo ocurre:** Guest pide plan de pago especial (50% ahora, 50% después)

**SI APPROVE:**
1. Crear registro de payment plan
2. Actualizar booking con nuevo `payment_plan`
3. Enviar WhatsApp confirmando el plan
4. Marcar action como `approved`

**SI REJECT:**
1. Marcar action como `rejected`
2. Enviar WhatsApp: "We're sorry, we cannot accommodate a custom payment plan for your booking."

### CASO C: cancellation_exception

**Cuándo ocurre:** Guest cancela fuera de política pero pide reembolso por emergencia

**SI APPROVE:**
1. Procesar reembolso (marcar en booking)
2. Actualizar booking `status: cancelled_with_refund`
3. Enviar WhatsApp confirmando reembolso
4. Marcar action como `approved`

**SI REJECT:**
1. Marcar action como `rejected`
2. Enviar WhatsApp: "We're sorry, we cannot make an exception to our cancellation policy."

---

## 4. ESTRUCTURA DE NODOS v3

```
[1] Webhook
    ↓
[2] Load Action (HTTP GET autopilot_actions?id=eq.action_id)
    ↓
[3] Switch: action (approve/reject)
    ├─ approve →
    │   ↓
    │   [4] Switch: action_type
    │   ├─ payment_verification →
    │   │   [5a] Extend Hold (PATCH bookings)
    │   │   [6a] WhatsApp Guest
    │   │   [7a] Update Action Approved
    │   │   [8a] Log Activity
    │   │   [9a] Respond OK
    │   │
    │   ├─ custom_plan_request →
    │   │   [5b] Create Payment Plan
    │   │   [6b] WhatsApp Guest
    │   │   [7b] Update Action Approved
    │   │   [8b] Log Activity
    │   │   [9b] Respond OK
    │   │
    │   ├─ cancellation_exception →
    │   │   [5c] Process Refund
    │   │   [6c] WhatsApp Guest
    │   │   [7c] Update Action Approved
    │   │   [8c] Log Activity
    │   │   [9c] Respond OK
    │   │
    │   └─ default (otros tipos) →
    │       [5d] Update Action Approved
    │       [6d] Respond OK
    │
    └─ reject →
        [10] Update Action Rejected
        [11] Respond OK
```

---

## 5. WEBHOOK INPUT REQUERIDO

```json
{
  "action": "approve",
  "action_id": "uuid-de-la-accion",
  "user_id": "uuid-del-owner",
  "reason": "optional string para reject"
}
```

---

## 6. DATOS EN autopilot_actions

La action ya tiene toda la info necesaria en el registro:

```json
{
  "id": "uuid",
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "action_type": "payment_verification",
  "title": "Payment Verification - Sarah Johnson",
  "description": "Guest claims payment sent. Bank transfer pending.",
  "status": "pending",
  "related_type": "booking",
  "related_id": "booking-uuid",
  "details": {
    "booking_id": "uuid",
    "guest_name": "Sarah Johnson",
    "guest_phone": "+34619794604",
    "hours_remaining": 2,
    "payment_method": "bank_transfer",
    "amount": 6300,
    "currency": "USD"
  },
  "payload": {},
  "priority": "high",
  "source": "WF-D2",
  "created_at": "2026-01-27T10:00:00Z"
}
```

---

## 7. PRIORIDAD DE IMPLEMENTACIÓN

**Fase 1 (Mínimo viable):**
- Load Action para obtener action_type
- Switch por action_type
- payment_verification con extend hold + WhatsApp
- Default para otros tipos (solo update status)

**Fase 2 (Después):**
- custom_plan_request completo
- cancellation_exception completo
- Logs completos en autopilot_activity_log

---

## 8. RECURSOS Y CREDENCIALES

| Recurso | Valor |
|---------|-------|
| **n8n URL** | https://n8n-production-bb2d.up.railway.app |
| **Workflow v2 funcional** | `E6vXYR5Xm3SYVEnC` |
| **Supabase URL** | https://jjpscimtxrudtepzwhag.supabase.co |
| **Supabase apikey** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0` |
| **ChakraHQ WhatsApp URL** | `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages` |
| **ChakraHQ Bearer** | `qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g` |
| **Tenant ID** | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| **Property ID** | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |

---

## 9. TABLAS SUPABASE RELEVANTES

### autopilot_actions
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

### autopilot_activity_log
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

## 10. COMANDOS DE TEST

### Probar Approve (payment_verification)
```powershell
$body = @'
{
  "action": "approve",
  "action_id": "[UUID-DE-ACTION-PENDIENTE]",
  "user_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db"
}
'@
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action/v3" -Method POST -ContentType "application/json" -Body $body
```

### Probar Reject
```powershell
$body = @'
{
  "action": "reject",
  "action_id": "[UUID-DE-ACTION-PENDIENTE]",
  "user_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "reason": "Payment not verified"
}
'@
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action/v3" -Method POST -ContentType "application/json" -Body $body
```

---

## 11. MENSAJES WHATSAPP

### payment_verification - APPROVED
```
Thank you! We've extended your booking hold by 24 hours while we verify your payment.

Booking: [property_name]
Check-in: [check_in_date]
Amount: $[amount] [currency]

We'll confirm once payment is verified.
```

### payment_verification - REJECTED
(No se envía mensaje, el booking expira normalmente)

### custom_plan_request - APPROVED
```
Great news! Your custom payment plan has been approved.

Payment 1: $[amount1] due now
Payment 2: $[amount2] due [date]

Please complete your first payment to confirm your booking.
```

### custom_plan_request - REJECTED
```
We're sorry, we cannot accommodate a custom payment plan for your booking at this time.

Please complete the full payment of $[amount] within [hours] hours to secure your dates.
```

### cancellation_exception - APPROVED
```
We understand emergencies happen. Your cancellation exception has been approved.

A refund of $[amount] will be processed within 5-7 business days.

We hope to welcome you in the future.
```

### cancellation_exception - REJECTED
```
We're sorry, but we cannot make an exception to our cancellation policy for your booking.

Per our policy, cancellations within [X] days of check-in are non-refundable.

If you have any questions, please don't hesitate to reach out.
```

---

## 12. WORKFLOWS AUTOPILOT EXISTENTES

| Workflow | ID | Estado | Función |
|----------|-----|--------|---------|
| AUTOPILOT - Daily Summary CRON | `1V9GYFmjXISwXTIn` | ✅ Activo | Resumen diario 18:00 |
| AUTOPILOT - Daily Summary API | `2wVP7lYVQ9NZfkxz` | ✅ Activo | Botón "Generate Summary" |
| AUTOPILOT - Payment Protection | `9VzPX1MCghPKkxFS` | ✅ Activo | Control pagos 24h |
| WF-AUTOPILOT Actions v2 | `E6vXYR5Xm3SYVEnC` | ⚠️ Inactivo | Approve/Reject básico |

---

## 13. DOCUMENTACIÓN ADICIONAL

Los documentos completos del proyecto están en:
- `/home/claude/project_docs/DOC_1_MYHOST_BIZMATE_PROJECT_UPDATE_2026-01-26 CLAUDE AI.md`
- `/home/claude/project_docs/DOC_2_AUTOPILOT_MODULE_COMPLETE_2026-01-26 CLAUDE AI.md`
- `/home/claude/project_docs/DOC_3_PROMPT_INICIO_SESION_MARTES_27 CLAUDE AI.md`

Transcripts de sesiones anteriores en:
- `/mnt/transcripts/`

---

*Documento generado: 27 Enero 2026*
