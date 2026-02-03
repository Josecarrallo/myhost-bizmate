# AUTOPILOT ACTIONS - LÓGICA DE CREACIÓN

**Fecha:** 28 Enero 2026
**Problema identificado:** Las autopilot_actions no se están creando automáticamente
**Solución:** WF-03 Lead Handler debe crear las actions

---

## 🎯 ARQUITECTURA CORRECTA

```
┌─────────────────────────────────────────────────────────┐
│              PUNTOS DE ENTRADA                          │
│   WhatsApp │ Web │ Instagram │ Email │ Direct Entry    │
└──────┬──────┴──┬──┴─────┬─────┴───┬───┴──────┬─────────┘
       │         │        │         │          │
       └─────────┴────────┴─────────┴──────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │  WF-03 Lead Handler         │ ◄─── AQUÍ SE CREAN ACTIONS
           │  (Inbound Lead Handler)     │
           └──────────────┬──────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌────────────────┐
    │ Supabase │   │  LUMINA  │   │ AUTOPILOT      │
    │  Leads   │   │ Analiza  │   │ Actions Table  │
    └──────────┘   └────┬─────┘   └────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  Follow-Up      │
              │  Engine         │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  BANYU / KORA   │
              │  Responde       │
              └─────────────────┘
```

---

## 🔄 WORKFLOW WF-03 (Lead Handler) - LÓGICA COMPLETA

### Flujo Actual vs Flujo Correcto

**❌ ACTUAL (incompleto):**
```
Lead entra → Normaliza → Guarda en Supabase → Llama LUMINA → FIN
```

**✅ CORRECTO:**
```
Lead entra
   ↓
Normaliza datos
   ↓
Guarda en Supabase (leads table)
   ↓
🔍 DETECTA SITUACIONES ESPECIALES
   ↓
   ├─ Booking request sin pago → CREATE autopilot_action (payment_verification)
   ├─ Guest pide payment plan → CREATE autopilot_action (custom_plan_request)
   ├─ Cancelación con motivo especial → CREATE autopilot_action (cancellation_exception)
   ├─ Dates conflicto → CREATE autopilot_action (date_conflict_resolution)
   └─ Precio fuera de rango → CREATE autopilot_action (pricing_exception)
   ↓
Llama LUMINA para análisis
   ↓
Follow-Up Engine ejecuta
   ↓
BANYU/KORA responde
```

---

## 📋 CASOS QUE DEBE DETECTAR WF-03

### 1. **Payment Verification Needed**

**Trigger:**
- Lead type: booking_request
- Payment status: pending
- No payment proof attached

**Action a crear:**
```json
{
  "action_type": "payment_verification",
  "title": "New Booking Requires Payment Verification",
  "description": "Guest {name} requested booking for {dates}, awaiting payment confirmation",
  "status": "pending",
  "related_type": "lead",
  "related_id": "{lead_id}",
  "details": {
    "guest_name": "string",
    "guest_phone": "string",
    "check_in": "date",
    "check_out": "date",
    "amount": 500,
    "currency": "USD"
  },
  "priority": "high",
  "source": "WF-03"
}
```

---

### 2. **Custom Payment Plan Request**

**Trigger:**
- Message contiene: "payment plan", "pay in installments", "50% now 50% later", "deposit"
- Intent detection: custom_payment_request

**Action a crear:**
```json
{
  "action_type": "custom_plan_request",
  "title": "Guest Requests Custom Payment Plan",
  "description": "Guest {name} asked: '{original_message}'",
  "status": "pending",
  "related_type": "lead",
  "related_id": "{lead_id}",
  "details": {
    "guest_name": "string",
    "guest_phone": "string",
    "requested_plan": "50% now, 50% at check-in",
    "total_amount": 1000,
    "original_message": "string"
  },
  "priority": "normal",
  "source": "WF-03"
}
```

---

### 3. **Cancellation Exception Request**

**Trigger:**
- Lead type: cancellation_request
- Outside cancellation policy window
- Message contiene: "emergency", "family emergency", "medical", "visa denied"

**Action a crear:**
```json
{
  "action_type": "cancellation_exception",
  "title": "Cancellation Exception Requested",
  "description": "Guest {name} requests refund due to: {reason}",
  "status": "pending",
  "related_type": "booking",
  "related_id": "{booking_id}",
  "details": {
    "guest_name": "string",
    "guest_phone": "string",
    "booking_id": "uuid",
    "cancellation_reason": "family emergency",
    "original_message": "string",
    "days_before_checkin": 5,
    "refund_amount": 800
  },
  "priority": "urgent",
  "source": "WF-03"
}
```

---

### 4. **Date Conflict Resolution** (NUEVO)

**Trigger:**
- Requested dates overlap with existing booking
- Property calendar shows conflict

**Action a crear:**
```json
{
  "action_type": "date_conflict_resolution",
  "title": "Date Conflict - Owner Decision Needed",
  "description": "Guest {name} requested {dates} but conflict with existing booking",
  "status": "pending",
  "related_type": "lead",
  "related_id": "{lead_id}",
  "details": {
    "guest_name": "string",
    "requested_dates": "2026-03-10 to 2026-03-15",
    "conflicting_booking_id": "uuid",
    "conflicting_guest": "string",
    "suggested_alternatives": ["2026-03-16 to 2026-03-21"]
  },
  "priority": "high",
  "source": "WF-03"
}
```

---

### 5. **Pricing Exception** (NUEVO)

**Trigger:**
- Guest requests price below minimum threshold
- Message contiene: "discount", "lower price", "cheaper", "budget"

**Action a crear:**
```json
{
  "action_type": "pricing_exception",
  "title": "Guest Requests Special Pricing",
  "description": "Guest {name} asked for discount/special price",
  "status": "pending",
  "related_type": "lead",
  "related_id": "{lead_id}",
  "details": {
    "guest_name": "string",
    "standard_price": 1200,
    "requested_price": 900,
    "dates": "2026-03-10 to 2026-03-15",
    "reason": "long stay discount",
    "nights": 5
  },
  "priority": "normal",
  "source": "WF-03"
}
```

---

## 🛠️ IMPLEMENTACIÓN EN WF-03

### Nodos a Añadir en n8n:

```
┌─────────────────────────────────────────────────┐
│  WF-03 Lead Handler (CURRENT)                   │
│                                                  │
│  1. Webhook Trigger                             │
│  2. Normalize Data                              │
│  3. Upsert Lead (Supabase)                      │
│  4. Call LUMINA                                 │
│  5. Respond 200 OK                              │
└─────────────────────────────────────────────────┘

                      ⬇ AÑADIR AQUÍ

┌─────────────────────────────────────────────────┐
│  WF-03 Lead Handler (NEW)                       │
│                                                  │
│  1. Webhook Trigger                             │
│  2. Normalize Data                              │
│  3. Upsert Lead (Supabase)                      │
│                                                  │
│  ═══════ NUEVO BLOQUE ═══════                   │
│  4. Intent Detection (Rule-Based)               │
│     └─ Switch Node:                             │
│        ├─ payment_request?                      │
│        ├─ custom_payment_plan?                  │
│        ├─ cancellation_exception?               │
│        ├─ date_conflict?                        │
│        └─ pricing_exception?                    │
│                                                  │
│  5. Create Autopilot Action (Supabase)          │
│     └─ IF special situation detected            │
│                                                  │
│  6. Notify Owner (WhatsApp - optional)          │
│     └─ "New action needs approval"              │
│  ═══════════════════════════                    │
│                                                  │
│  7. Call LUMINA                                 │
│  8. Respond 200 OK                              │
└─────────────────────────────────────────────────┘
```

---

## 📝 PSEUDOCÓDIGO - Intent Detection

```javascript
// Nodo 4: Intent Detection (Function Node en n8n)
const message = $json.message.toLowerCase();
const lead_type = $json.lead_type;

let create_action = false;
let action_data = {};

// 1. Payment Verification
if (lead_type === 'booking_request' && !$json.payment_proof) {
  create_action = true;
  action_data = {
    action_type: 'payment_verification',
    title: `New Booking Requires Payment Verification`,
    description: `Guest ${$json.guest_name} requested booking for ${$json.check_in} to ${$json.check_out}`,
    priority: 'high'
  };
}

// 2. Custom Payment Plan
else if (
  message.includes('payment plan') ||
  message.includes('installment') ||
  message.includes('50%') ||
  message.includes('deposit only')
) {
  create_action = true;
  action_data = {
    action_type: 'custom_plan_request',
    title: 'Guest Requests Custom Payment Plan',
    description: `Guest ${$json.guest_name} asked: "${message}"`,
    priority: 'normal'
  };
}

// 3. Cancellation Exception
else if (
  lead_type === 'cancellation' &&
  (message.includes('emergency') ||
   message.includes('medical') ||
   message.includes('visa denied') ||
   message.includes('family issue'))
) {
  create_action = true;
  action_data = {
    action_type: 'cancellation_exception',
    title: 'Cancellation Exception Requested',
    description: `Guest ${$json.guest_name} requests refund due to emergency`,
    priority: 'urgent'
  };
}

// 4. Date Conflict (check calendar)
else if (hasDateConflict($json.check_in, $json.check_out)) {
  create_action = true;
  action_data = {
    action_type: 'date_conflict_resolution',
    title: 'Date Conflict - Owner Decision Needed',
    priority: 'high'
  };
}

// 5. Pricing Exception
else if (
  message.includes('discount') ||
  message.includes('lower price') ||
  message.includes('cheaper')
) {
  create_action = true;
  action_data = {
    action_type: 'pricing_exception',
    title: 'Guest Requests Special Pricing',
    priority: 'normal'
  };
}

return { create_action, action_data };
```

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### FASE 1: Testing Manual (HOY)
Para completar AUTOPILOT FASE 1 hoy:
1. ✅ Crear actions manualmente en Supabase
2. ✅ Probar approve/reject desde dashboard
3. ✅ Validar WF-AUTOPILOT Actions funciona

**NO implementar auto-creación todavía**

---

### FASE 2: Auto-Creation (DESPUÉS DE FASE 1)
Una vez validado que approve/reject funciona:
1. Modificar WF-03 Lead Handler
2. Añadir Intent Detection node
3. Añadir Create Autopilot Action node
4. Testing con leads reales

**Estimación:** 3-4 horas

---

## ✅ VENTAJAS DE ESTE APPROACH

1. **Centralizado:** Un solo punto (WF-03) crea todas las actions
2. **Consistente:** Mismo formato, misma lógica
3. **Escalable:** Fácil añadir nuevos action_types
4. **Trazable:** source = 'WF-03' siempre
5. **Multi-canal:** Funciona para WhatsApp, Web, Instagram, Email

---

## 📋 CHECKLIST IMPLEMENTACIÓN

**FASE 1 (Testing Manual - HOY):**
- [ ] Crear 3 actions manuales (payment_verification, custom_plan_request, cancellation_exception)
- [ ] Probar APPROVE para cada tipo
- [ ] Probar REJECT para cada tipo
- [ ] Validar WhatsApp enviado
- [ ] Validar updates en Supabase

**FASE 2 (Auto-Creation - DESPUÉS):**
- [ ] Añadir Intent Detection a WF-03
- [ ] Añadir Create Action node
- [ ] Testing con leads de prueba
- [ ] Activar en producción
- [ ] Monitorear primeras actions creadas automáticamente

---

## 🚨 IMPORTANTE PARA CLAUDE AI

**Para completar AUTOPILOT FASE 1 HOY:**
- **NO** implementar auto-creación de actions todavía
- **SÍ** usar INSERT manual en Supabase para testing
- **SÍ** validar que WF-AUTOPILOT Actions funciona correctamente
- **SÍ** probar approve/reject end-to-end

**Auto-creación de actions → FASE 1.5** (después de validar FASE 1)

---

*Documento generado: 28 Enero 2026*
*Clarificación: WF-03 Lead Handler debe crear las autopilot_actions*
