# FASE 1.5 AUTOPILOT - DOCUMENTO OFICIAL ACTUALIZADO

**Fecha:** 28 Enero 2026  
**Proyecto:** MY HOST BizMate - AUTOPILOT Actions  
**Estado:** ARQUITECTURA APROBADA - LISTO PARA IMPLEMENTACIÓN

---

## 🎯 RESUMEN EJECUTIVO

**FASE 1 COMPLETADA ✅** - Workflow que EJECUTA approve/reject funciona (6 tests pasados)

**FASE 1.5 ARQUITECTURA DEFINIDA ✅** - Aprobada por equipo técnico

**PRINCIPIO CLAVE:** Single Responsibility
- LUMINA = analiza y decide (NUNCA ejecuta)
- DECISION ROUTER = elige el camino
- AUTOPILOT = crea registros y ejecuta (NUNCA analiza)
- OWNER = aprueba o rechaza

---

## 📊 ARQUITECTURA FINAL APROBADA

```
┌─────────────────────────────────────────────────────────────┐
│              CANALES DE ENTRADA                              │
│  KORA.AI (Voice) │ BANYU.AI (WhatsApp) │ Web │ IG/FB │ OTA  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  [01] WF-03 INBOUND LEAD HANDLER                            │
│  Recibe, normaliza, guarda lead, llama LUMINA               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  [02] LUMINA - Lead Intelligence (SOLO ANALIZA)             │
│  ID: EtrQnkgWqqbvRjEB                                       │
├─────────────────────────────────────────────────────────────┤
│  • Analiza mensaje con GPT-4o-mini                          │
│  • Clasifica lead (guest_journey/followup/reengage/close)   │
│  • Responde UNA pregunta clave:                             │
│    ❓ ¿Este mensaje requiere decisión humana del owner?     │
│                                                             │
│  • SI requiere → Marca "OWNER_DECISION_REQUIRED" en reason  │
│  • NO requiere → Continúa normal                            │
│                                                             │
│  ⚠️ LUMINA NUNCA crea actions                               │
│  ⚠️ LUMINA NUNCA notifica                                   │
│  ⚠️ LUMINA NUNCA ejecuta                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  [03] DECISION ROUTER (PUNTO CRÍTICO)                       │
├─────────────────────────────────────────────────────────────┤
│  Lee la respuesta de LUMINA y elige camino:                 │
│                                                             │
│  IF reason CONTAINS "OWNER_DECISION_REQUIRED"               │
│      → Route to AUTOPILOT (NUEVA RUTA)                      │
│  ELSE                                                       │
│      → Rutas existentes (BOOKED/FOLLOWUP/REENGAGE/CLOSE)    │
│                                                             │
│  ⚠️ Aquí NO se crea nada                                    │
│  ⚠️ Aquí SOLO se elige el camino                            │
└─────────────────────────────────────────────────────────────┘
          │
          ├── BOOKED ────────► Guest Journey
          ├── FOLLOWUP ──────► Follow-Up Engine
          ├── REENGAGE ──────► Follow-Up Engine
          ├── CLOSE ─────────► Mark LOST
          │
          └── AUTOPILOT (NUEVO) ──────────────────────────────┐
                                                              │
┌─────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│  [04] AUTOPILOT - Crear Registro y Actuar (AQUÍ SÍ)         │
├─────────────────────────────────────────────────────────────┤
│  1. Crear registro en tabla `autopilot_actions`             │
│     - action_type (pricing_exception, payment_verification) │
│     - status = "pending"                                    │
│     - related_id (lead/booking)                             │
│     - details (JSON con mensaje y contexto)                 │
│     - priority                                              │
│                                                             │
│  2. Notificar al owner (WhatsApp)                           │
│                                                             │
│  3. Marcar lead como: pending_owner_decision                │
│                                                             │
│  👉 SISTEMA QUEDA BLOQUEADO                                 │
│     No hay follow-ups ni automatismos hasta que owner       │
│     apruebe o rechace                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  [05] OWNER DECIDE (approve/reject)                         │
├─────────────────────────────────────────────────────────────┤
│  Webhook: POST /webhook/autopilot/action                    │
│  Body: { "action": "approve|reject", "action_id": "uuid" }  │
│                                                             │
│  → WF-AUTOPILOT Actions v3 (ID: Efk3dYHDA6hyyYjV)           │
│  → Ejecuta lógica según action_type                         │
│  → Actualiza Supabase                                       │
│  → Envía WhatsApp al guest                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTACIÓN PASO A PASO

### PASO 1: Modificar LUMINA - Ampliar Prompt

**NO sustituir el prompt actual. SOLO añadir esto al final:**

```
Additionally, determine whether the message requires a human decision from the property owner.

SITUATIONS THAT REQUIRE OWNER DECISION:
- Payment plan request (50% now, installments, deposit only)
- Cancellation with special circumstances (emergency, medical, visa, family)
- Discount or price negotiation request
- Payment confirmation that needs manual verification
- Date conflicts with existing bookings

SITUATIONS THAT DO NOT REQUIRE OWNER DECISION:
- Availability questions
- Standard pricing inquiries
- General information requests
- Normal booking flow

If a human decision is required, include the keyword:

OWNER_DECISION_REQUIRED

inside the 'reason' field of the JSON response.

Do NOT create actions.
Do NOT notify anyone.
Do NOT pause flows.
Only flag the need for owner decision in the analysis.
```

**Ejemplo de salida NORMAL:**
```json
{
  "lead_status": "interested",
  "next_action": "followup",
  "recommended_channel": "whatsapp",
  "urgency": "medium",
  "reason": "Asking for availability"
}
```

**Ejemplo de salida CON decisión humana:**
```json
{
  "lead_status": "interested",
  "next_action": "followup",
  "recommended_channel": "whatsapp",
  "urgency": "high",
  "reason": "OWNER_DECISION_REQUIRED: guest requests 50/50 payment plan"
}
```

---

### PASO 2: Modificar Decision Router - Añadir Ruta AUTOPILOT

**Ubicación:** Nodo "6. Decision Router" en LUMINA (EtrQnkgWqqbvRjEB)

**Rutas actuales:**
- BOOKED (next_action = guest_journey)
- FOLLOWUP (next_action = followup)
- REENGAGE (next_action = reengage)
- CLOSE (next_action = close)

**NUEVA RUTA a añadir:**
- AUTOPILOT

**Condición:**
```
reason CONTAINS "OWNER_DECISION_REQUIRED"
```

**IMPORTANTE:** Esta ruta debe evaluarse PRIMERO (antes de las otras), porque un mensaje puede ser "interested" + "OWNER_DECISION_REQUIRED" al mismo tiempo.

---

### PASO 3: Crear Rama AUTOPILOT (nodos nuevos)

Después del Decision Router, cuando sale por AUTOPILOT:

**Nodo 1: Extract Action Details (Code)**
```javascript
const input = $input.first().json;
const reason = input.reason || '';

// Extraer tipo de acción del reason
let action_type = 'general_approval';
const reasonLower = reason.toLowerCase();

if (reasonLower.includes('payment plan') || reasonLower.includes('50/50') || reasonLower.includes('installment')) {
  action_type = 'custom_plan_request';
} else if (reasonLower.includes('cancel') || reasonLower.includes('refund') || reasonLower.includes('emergency')) {
  action_type = 'cancellation_exception';
} else if (reasonLower.includes('discount') || reasonLower.includes('price') || reasonLower.includes('cheaper')) {
  action_type = 'pricing_exception';
} else if (reasonLower.includes('payment') || reasonLower.includes('transfer') || reasonLower.includes('paid')) {
  action_type = 'payment_verification';
}

// Extraer descripción limpia (sin el prefijo)
const description = reason.replace('OWNER_DECISION_REQUIRED:', '').trim();

return {
  json: {
    action_type,
    description,
    lead_id: input.lead_id,
    tenant_id: input.tenant_id,
    property_id: input.property_id,
    context: input.context,
    urgency: input.urgency
  }
};
```

**Nodo 2: Create Autopilot Action (HTTP POST a Supabase)**
```
POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_actions
Headers:
  - apikey: [SUPABASE_ANON_KEY]
  - Content-Type: application/json
  - Prefer: return=representation

Body:
{
  "tenant_id": "{{ $json.tenant_id }}",
  "property_id": "{{ $json.property_id }}",
  "action_type": "{{ $json.action_type }}",
  "title": "Owner Decision Required",
  "description": "{{ $json.description }}",
  "status": "pending",
  "related_type": "lead",
  "related_id": "{{ $json.lead_id }}",
  "priority": "{{ $json.urgency }}",
  "source": "LUMINA",
  "details": {
    "lead_name": "{{ $json.context.lead_name }}",
    "lead_phone": "{{ $json.context.lead_phone }}",
    "lead_channel": "{{ $json.context.lead_channel }}",
    "original_reason": "{{ $json.description }}"
  }
}
```

**Nodo 3: Notify Owner WhatsApp (HTTP POST a ChakraHQ)**
```
POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/.../messages
Headers:
  - Authorization: Bearer [TOKEN]

Body:
{
  "messaging_product": "whatsapp",
  "to": "34619794604",
  "type": "text",
  "text": {
    "body": "🔔 DECISIÓN REQUERIDA\n\n{{ $json.description }}\n\nResponde APPROVE o REJECT\nAction ID: {{ $('Create Autopilot Action').item.json[0].id }}"
  }
}
```

**Nodo 4: Update Lead Status (HTTP PATCH a Supabase)**
```
PATCH https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/leads?id=eq.{{ $json.lead_id }}
Body:
{
  "state": "PENDING_OWNER",
  "updated_at": "{{ new Date().toISOString() }}"
}
```

**Nodo 5: Respond (igual que las otras ramas)**

---

## 🔑 IDs CRÍTICOS

```
Tenant ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
Owner phone:  34619794604
BANYU phone:  +62 813 2576 4867

LUMINA workflow:          EtrQnkgWqqbvRjEB
AUTOPILOT Actions v3:     Efk3dYHDA6hyyYjV (funciona, hay que activar)

n8n Base URL: https://n8n-production-bb2d.up.railway.app
Supabase:     https://jjpscimtxrudtepzwhag.supabase.co
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### LUMINA (WF-SP-02, ID: EtrQnkgWqqbvRjEB)
- [ ] Añadir texto adicional al prompt del nodo "4. LUMINA AI Decision"
- [ ] NO modificar el resto del prompt existente
- [ ] Modificar nodo "6. Decision Router" para añadir ruta AUTOPILOT
- [ ] La ruta AUTOPILOT debe evaluarse PRIMERO (condición: reason contains OWNER_DECISION_REQUIRED)
- [ ] Crear nodos de la rama AUTOPILOT (Extract → Create Action → Notify → Update Lead → Respond)

### WF-AUTOPILOT Actions v3 (ID: Efk3dYHDA6hyyYjV)
- [ ] Activar workflow (actualmente inactivo)
- [ ] Verificar que sigue funcionando tras cambios en LUMINA

### Testing
- [ ] Enviar mensaje "Can I pay 50% now?" → Debe crear action + notificar owner
- [ ] Enviar mensaje "Medical emergency, need refund" → Debe crear action + notificar owner
- [ ] Enviar mensaje "What's the price for March?" → NO debe crear action (flujo normal)
- [ ] Probar approve desde webhook → Debe ejecutar acción correctamente
- [ ] Probar reject desde webhook → Debe notificar rechazo

---

## 📋 REGLA MENTAL FINAL

```
LUMINA = analiza y marca (NUNCA ejecuta)
ROUTER = decide el camino (NUNCA crea)
AUTOPILOT = crea registro y actúa (NUNCA analiza)
OWNER = manda

ESTA ES LA ARQUITECTURA FINAL. NO HAY OTRA.
```

---

*Documento actualizado: 28 Enero 2026*
*Arquitectura aprobada por equipo técnico*
*Estado: Listo para implementación*
