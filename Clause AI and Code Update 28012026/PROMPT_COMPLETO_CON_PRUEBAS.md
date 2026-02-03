# PROMPT COMPLETO - FASE 1.5 AUTOPILOT + PLAN DE PRUEBAS

**Fecha:** 29 Enero 2026  
**Proyecto:** MY HOST BizMate  
**Estado:** Implementación + Testing

---

Copia todo desde aquí:

```
CONTEXTO: Implementando FASE 1.5 de AUTOPILOT para MY HOST BizMate (SaaS automatización hoteles Bali).
Cliente piloto: Izumi Hotel (7 villas, Ubud).

═══════════════════════════════════════════════════════════════
ARQUITECTURA FINAL APROBADA (DOCUMENTO OFICIAL 28 ENE 2026)
═══════════════════════════════════════════════════════════════

PRINCIPIO CLAVE - SINGLE RESPONSIBILITY:
- LUMINA = analiza y marca (NUNCA ejecuta)
- DECISION ROUTER = elige el camino (NUNCA crea)
- AUTOPILOT = crea registros y ejecuta (NUNCA analiza)
- OWNER = manda

FLUJO COMPLETO:
```
Mensaje cliente → LUMINA (analiza) → Decision Router → Ruta correspondiente
                                            │
                                            ├── BOOKED → Guest Journey
                                            ├── FOLLOWUP → Follow-Up Engine
                                            ├── REENGAGE → Follow-Up Engine
                                            ├── CLOSE → Mark LOST
                                            └── AUTOPILOT (NUEVO) → Crear action → Notificar → BLOQUEAR
```

═══════════════════════════════════════════════════════════════
LO QUE HAY QUE IMPLEMENTAR (3 PASOS)
═══════════════════════════════════════════════════════════════

PASO 1: Modificar prompt de LUMINA (NO sustituir, SOLO añadir)
--------------------------------------------------------
Ubicación: Nodo "4. LUMINA AI Decision" en workflow EtrQnkgWqqbvRjEB

Añadir al FINAL del prompt existente:

"Additionally, determine whether the message requires a human decision from the property owner.

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

Do NOT create actions. Do NOT notify anyone. Do NOT pause flows.
Only flag the need for owner decision in the analysis."

Ejemplo output normal:
{
  "lead_status": "interested",
  "next_action": "followup",
  "urgency": "medium",
  "reason": "Asking for availability"
}

Ejemplo output con decisión humana:
{
  "lead_status": "interested",
  "next_action": "followup",
  "urgency": "high",
  "reason": "OWNER_DECISION_REQUIRED: guest requests 50/50 payment plan"
}

PASO 2: Modificar Decision Router
--------------------------------------------------------
Ubicación: Nodo "6. Decision Router" en workflow EtrQnkgWqqbvRjEB

Rutas actuales: BOOKED, FOLLOWUP, REENGAGE, CLOSE

AÑADIR nueva ruta: AUTOPILOT
Condición: reason CONTAINS "OWNER_DECISION_REQUIRED"
⚠️ Esta ruta debe evaluarse PRIMERO (antes de las otras)

PASO 3: Crear rama AUTOPILOT (nodos nuevos)
--------------------------------------------------------
Después del Decision Router, cuando sale por AUTOPILOT:

Nodo 1: Extract Action Details (Code)
- Determina action_type del reason (custom_plan_request, cancellation_exception, etc.)

Nodo 2: Create Autopilot Action (HTTP POST Supabase)
- Crear registro en autopilot_actions con status="pending"

Nodo 3: Notify Owner WhatsApp (HTTP POST ChakraHQ)
- Enviar mensaje al owner (34619794604)

Nodo 4: Update Lead Status (HTTP PATCH Supabase)
- Cambiar lead.state a "PENDING_OWNER"

Nodo 5: Respond (igual que otras ramas)

═══════════════════════════════════════════════════════════════
FASE 1 YA COMPLETADA ✅
═══════════════════════════════════════════════════════════════
- WF-AUTOPILOT Actions v3 (ID: Efk3dYHDA6hyyYjV) FUNCIONA
- Webhook: POST /webhook/autopilot/action
- Procesa approve/reject para: custom_plan_request, payment_verification, cancellation_exception
- 6 tests pasados (28 Enero 2026)
- Estado actual: Inactivo (activar después de implementar FASE 1.5)

═══════════════════════════════════════════════════════════════
IDs CRÍTICOS
═══════════════════════════════════════════════════════════════
Tenant ID:        c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID:      18711359-1378-4d12-9ea6-fb31c0b1bac2
Owner phone:      34619794604
BANYU phone:      +62 813 2576 4867

WORKFLOWS:
- LUMINA:              EtrQnkgWqqbvRjEB (MODIFICAR ESTE)
- AUTOPILOT Actions:   Efk3dYHDA6hyyYjV (funciona, activar después)
- WF-03 Lead Handler:  CBiOKCQ7eGnTJXQd (v1) / OZmq7E9wzODJrzej (v2)
- Guest Journey:       cQLiQnqR2AHkYOjd
- Follow-Up Engine:    HndGXnQAEyaYDKFZ

ENDPOINTS:
- n8n Base:     https://n8n-production-bb2d.up.railway.app
- Supabase:     https://jjpscimtxrudtepzwhag.supabase.co
- KORA (VAPI):  Llamar al número configurado en VAPI
- BANYU (WA):   +62 813 2576 4867

═══════════════════════════════════════════════════════════════
ARCHIVOS DE REFERENCIA
═══════════════════════════════════════════════════════════════
- /mnt/user-data/uploads/AUTOPILOT_ACTIONS_CREACION_LOGICA.md
- /mnt/user-data/uploads/MAPA_FLUJOS_ORDEN_MYHOST_Bizmate.txt
- /mnt/user-data/uploads/myhost_arquitectura_FLUJOS.html

═══════════════════════════════════════════════════════════════
═══════════════════════════════════════════════════════════════
PLAN DE PRUEBAS COMPLETO
═══════════════════════════════════════════════════════════════
═══════════════════════════════════════════════════════════════

PREPARACIÓN GENERAL (antes de todas las pruebas)
------------------------------------------------
1. Limpiar datos de prueba anteriores:
   DELETE FROM autopilot_actions WHERE source = 'TEST';
   DELETE FROM leads WHERE name LIKE 'Test%' AND source = 'TEST';

2. Verificar workflows activos:
   - LUMINA (EtrQnkgWqqbvRjEB): ✅ Activo
   - AUTOPILOT Actions (Efk3dYHDA6hyyYjV): Activar para pruebas

3. Tener abierto:
   - Supabase (tablas: leads, autopilot_actions, bookings)
   - n8n (executions de LUMINA y AUTOPILOT)
   - WhatsApp del owner (34619794604)
   - WhatsApp de BANYU (+62 813 2576 4867)

═══════════════════════════════════════════════════════════════
BLOQUE A: PRUEBAS AUTOPILOT (Detección + Approve/Reject)
═══════════════════════════════════════════════════════════════

PRUEBA A1: Detección custom_plan_request
----------------------------------------
OBJETIVO: Verificar que LUMINA detecta petición de pago parcial y crea action

ENTRADA (simular mensaje de lead):
POST /webhook/lumina-analyze
{
  "lead_id": "[crear lead de prueba primero]",
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "name": "Test User A1",
  "phone": "+1234567001",
  "channel": "whatsapp",
  "message": "Hi, I want to book for March 10-15. Can I pay 50% now and 50% at check-in?",
  "intent": "booking",
  "score": 50,
  "state": "NEW"
}

VERIFICAR:
□ LUMINA response.reason contiene "OWNER_DECISION_REQUIRED"
□ Se creó registro en autopilot_actions con:
  - action_type = "custom_plan_request"
  - status = "pending"
  - source = "LUMINA"
□ Owner recibió WhatsApp de notificación
□ Lead.state = "PENDING_OWNER"

---

PRUEBA A2: Detección cancellation_exception
-------------------------------------------
OBJETIVO: Verificar que LUMINA detecta cancelación por emergencia

ENTRADA:
{
  "lead_id": "[lead con booking existente]",
  "message": "I need to cancel my booking. I have a medical emergency and need to return home.",
  "state": "BOOKED",
  "has_booking": true
}

VERIFICAR:
□ LUMINA response.reason contiene "OWNER_DECISION_REQUIRED"
□ Se creó autopilot_action con action_type = "cancellation_exception"
□ Owner recibió WhatsApp
□ Booking NO se canceló automáticamente (espera decisión)

---

PRUEBA A3: Detección pricing_exception
--------------------------------------
OBJETIVO: Verificar que LUMINA detecta petición de descuento

ENTRADA:
{
  "message": "Your prices are a bit high for my budget. Can you offer any discount for a 7-night stay?",
  "intent": "price",
  "score": 30
}

VERIFICAR:
□ LUMINA response.reason contiene "OWNER_DECISION_REQUIRED"
□ Se creó autopilot_action con action_type = "pricing_exception"
□ Owner recibió WhatsApp

---

PRUEBA A4: Detección payment_verification
-----------------------------------------
OBJETIVO: Verificar que LUMINA detecta confirmación de pago pendiente

ENTRADA:
{
  "message": "Hi, I already made the bank transfer yesterday. Please confirm my booking.",
  "state": "HOT",
  "intent": "booking"
}

VERIFICAR:
□ LUMINA response.reason contiene "OWNER_DECISION_REQUIRED"
□ Se creó autopilot_action con action_type = "payment_verification"
□ Owner recibió WhatsApp

---

PRUEBA A5: NO detectar (flujo normal)
-------------------------------------
OBJETIVO: Verificar que mensajes normales NO crean autopilot_actions

ENTRADA:
{
  "message": "What is the price for a villa in March?",
  "intent": "price",
  "score": 20
}

VERIFICAR:
□ LUMINA response.reason NO contiene "OWNER_DECISION_REQUIRED"
□ NO se creó autopilot_action
□ Lead sigue flujo normal (FOLLOWUP)

---

PRUEBA A6: APPROVE custom_plan_request
--------------------------------------
OBJETIVO: Verificar que approve funciona correctamente

PREPARACIÓN: Usar action_id de PRUEBA A1

ENTRADA:
POST /webhook/autopilot/action
{
  "action": "approve",
  "action_id": "[action_id de A1]",
  "user_id": "owner-uuid"
}

VERIFICAR:
□ autopilot_actions.status = "approved"
□ autopilot_actions.approved_at tiene timestamp
□ Guest recibió WhatsApp confirmando plan de pago
□ Lead.state cambió de "PENDING_OWNER"

---

PRUEBA A7: REJECT cancellation_exception
----------------------------------------
OBJETIVO: Verificar que reject funciona correctamente

PREPARACIÓN: Usar action_id de PRUEBA A2

ENTRADA:
POST /webhook/autopilot/action
{
  "action": "reject",
  "action_id": "[action_id de A2]",
  "user_id": "owner-uuid",
  "reason": "Outside cancellation policy window"
}

VERIFICAR:
□ autopilot_actions.status = "rejected"
□ autopilot_actions.rejection_reason tiene el motivo
□ Guest recibió WhatsApp informando rechazo
□ Booking mantiene status original

═══════════════════════════════════════════════════════════════
BLOQUE B: PRUEBAS KORA (Voice AI)
═══════════════════════════════════════════════════════════════

PREPARACIÓN KORA:
- Número KORA configurado en VAPI
- Workflow WF-02 KORA-POST-CALL (gsMMQrc9T2uZ7LVA) activo
- Grabar llamadas para evidencia

---

PRUEBA B1: Llamada información general
--------------------------------------
OBJETIVO: Verificar que KORA responde preguntas básicas

ACCIÓN: Llamar al número KORA y preguntar:
"Hi, I'm interested in your hotel. Can you tell me about your villas?"

VERIFICAR:
□ KORA responde con información del hotel
□ Se creó lead en Supabase con channel="voice"
□ WF-03 Lead Handler recibió el evento
□ LUMINA clasificó como intent="info"

---

PRUEBA B2: Llamada consulta de disponibilidad
---------------------------------------------
OBJETIVO: Verificar que KORA maneja consultas de fechas

ACCIÓN: Llamar y preguntar:
"Do you have availability for March 15 to March 20 for 2 guests?"

VERIFICAR:
□ KORA consulta disponibilidad
□ KORA responde con información de precios/disponibilidad
□ Lead creado con intent="availability"
□ Contexto incluye fechas y guests

---

PRUEBA B3: Llamada con booking intent
-------------------------------------
OBJETIVO: Verificar flujo de reserva por voz

ACCIÓN: Llamar y decir:
"I want to book a villa for March 10 to March 15. My name is John Test."

VERIFICAR:
□ KORA captura datos de reserva
□ Lead creado con intent="booking", score alto
□ LUMINA clasifica como "interested" o "HOT"
□ Booking instructions enviadas (si aplica)

---

PRUEBA B4: Llamada con situación especial (AUTOPILOT)
-----------------------------------------------------
OBJETIVO: Verificar que llamada con situación especial activa AUTOPILOT

ACCIÓN: Llamar y decir:
"I want to book but I can only pay half now. Is that possible?"

VERIFICAR:
□ KORA captura el mensaje
□ Lead llega a LUMINA
□ LUMINA detecta "OWNER_DECISION_REQUIRED"
□ Se crea autopilot_action
□ Owner recibió notificación WhatsApp

═══════════════════════════════════════════════════════════════
BLOQUE C: PRUEBAS BANYU (WhatsApp AI)
═══════════════════════════════════════════════════════════════

PREPARACIÓN BANYU:
- WhatsApp BANYU: +62 813 2576 4867
- ChakraHQ configurado y funcionando
- Usar número de prueba diferente al owner

---

PRUEBA C1: Mensaje información general
--------------------------------------
OBJETIVO: Verificar que BANYU responde preguntas básicas

ACCIÓN: Enviar WhatsApp a BANYU:
"Hello, I'm looking for a villa in Ubud. What do you offer?"

VERIFICAR:
□ BANYU responde con información
□ Lead creado con channel="whatsapp"
□ Conversación registrada en sistema

---

PRUEBA C2: Mensaje consulta de precios
--------------------------------------
OBJETIVO: Verificar manejo de consultas de precio

ACCIÓN: Enviar WhatsApp:
"What's the price for your River Villa for 5 nights in April?"

VERIFICAR:
□ BANYU responde con precios
□ Lead.intent = "price"
□ Follow-up programado si no responde

---

PRUEBA C3: Mensaje con booking intent
-------------------------------------
OBJETIVO: Verificar captura de intención de reserva

ACCIÓN: Enviar WhatsApp:
"I want to book from April 1 to April 5. How do I proceed?"

VERIFICAR:
□ BANYU proporciona instrucciones de reserva
□ Lead.intent = "booking"
□ Lead.state = "HOT"

---

PRUEBA C4: Mensaje con pago parcial (AUTOPILOT)
-----------------------------------------------
OBJETIVO: Verificar detección de situación especial via WhatsApp

ACCIÓN: Enviar WhatsApp:
"Hi, I'd like to book but money is tight. Can I pay 50% deposit and the rest at check-in?"

VERIFICAR:
□ Mensaje llega a WF-03
□ LUMINA detecta "OWNER_DECISION_REQUIRED"
□ autopilot_action creada con action_type="custom_plan_request"
□ Owner recibió notificación
□ BANYU NO responde automáticamente sobre el plan (espera decisión)

---

PRUEBA C5: Mensaje cancelación emergencia (AUTOPILOT)
-----------------------------------------------------
OBJETIVO: Verificar detección de cancelación especial

PREPARACIÓN: Tener booking existente para este lead

ACCIÓN: Enviar WhatsApp:
"I need to cancel my booking urgently. My father is in the hospital and I need to fly home."

VERIFICAR:
□ LUMINA detecta "OWNER_DECISION_REQUIRED"
□ autopilot_action creada con action_type="cancellation_exception"
□ Owner recibió notificación con contexto
□ Booking NO cancelado automáticamente

---

PRUEBA C6: Mensaje descuento (AUTOPILOT)
----------------------------------------
OBJETIVO: Verificar detección de negociación de precio

ACCIÓN: Enviar WhatsApp:
"Your villa looks amazing but $200/night is over my budget. Would you consider $150 for a week?"

VERIFICAR:
□ LUMINA detecta "OWNER_DECISION_REQUIRED"
□ autopilot_action creada con action_type="pricing_exception"
□ Owner recibió notificación
□ BANYU NO ofrece descuento automáticamente

═══════════════════════════════════════════════════════════════
BLOQUE D: PRUEBAS END-TO-END
═══════════════════════════════════════════════════════════════

PRUEBA D1: Flujo completo WhatsApp → AUTOPILOT → Approve
--------------------------------------------------------
OBJETIVO: Verificar ciclo completo de principio a fin

PASOS:
1. Enviar WhatsApp a BANYU: "I want to book March 1-5. Can I pay in 2 installments?"
2. Verificar autopilot_action creada
3. Verificar owner recibió notificación
4. Ejecutar approve via webhook
5. Verificar guest recibió confirmación WhatsApp
6. Verificar estados actualizados en Supabase

---

PRUEBA D2: Flujo completo Voice → AUTOPILOT → Reject
----------------------------------------------------
OBJETIVO: Verificar ciclo completo con rechazo

PASOS:
1. Llamar a KORA: "I need a big discount, at least 50% off"
2. Verificar autopilot_action creada (pricing_exception)
3. Verificar owner recibió notificación
4. Ejecutar reject via webhook con reason
5. Verificar guest recibió mensaje de rechazo
6. Verificar estados actualizados

═══════════════════════════════════════════════════════════════
MATRIZ DE RESULTADOS
═══════════════════════════════════════════════════════════════

| Prueba | Descripción                      | Status | Notas |
|--------|----------------------------------|--------|-------|
| A1     | Detect custom_plan_request       | □      |       |
| A2     | Detect cancellation_exception    | □      |       |
| A3     | Detect pricing_exception         | □      |       |
| A4     | Detect payment_verification      | □      |       |
| A5     | NO detect (flujo normal)         | □      |       |
| A6     | APPROVE custom_plan              | □      |       |
| A7     | REJECT cancellation              | □      |       |
| B1     | KORA info general                | □      |       |
| B2     | KORA disponibilidad              | □      |       |
| B3     | KORA booking                     | □      |       |
| B4     | KORA situación especial          | □      |       |
| C1     | BANYU info general               | □      |       |
| C2     | BANYU precios                    | □      |       |
| C3     | BANYU booking                    | □      |       |
| C4     | BANYU pago parcial               | □      |       |
| C5     | BANYU cancelación emergencia     | □      |       |
| C6     | BANYU descuento                  | □      |       |
| D1     | E2E WhatsApp Approve             | □      |       |
| D2     | E2E Voice Reject                 | □      |       |

═══════════════════════════════════════════════════════════════
⚠️ REGLAS IMPORTANTES
═══════════════════════════════════════════════════════════════
- LUMINA NUNCA ejecuta acciones (solo analiza y marca)
- AUTOPILOT NUNCA analiza mensajes (solo crea y ejecuta)
- Explicar plan COMPLETO antes de modificar cualquier workflow
- Esperar aprobación EXPLÍCITA del usuario
- NO crear workflows nuevos, modificar LUMINA existente
- La ruta AUTOPILOT debe evaluarse ANTES que las otras en el router

REGLA MENTAL FINAL:
LUMINA = analiza y marca
ROUTER = decide el camino  
AUTOPILOT = crea registro y actúa
OWNER = manda

ESTA ES LA ARQUITECTURA FINAL. NO HAY OTRA.
```

---

*Prompt completo generado: 29 Enero 2026*
*Incluye: Arquitectura + Implementación + Plan de Pruebas (18 escenarios)*
