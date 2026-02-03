# RESUMEN - AUTOPILOT ACTIONS CREACIÓN

**Fecha:** 28 Enero 2026
**Para:** Claude AI

---

## 🎯 CLARIFICACIÓN IMPORTANTE

### ❌ Lo que pensábamos (INCORRECTO):
- BANYU/KORA crean autopilot_actions cuando detectan requests especiales
- LUMINA crea autopilot_actions cuando detecta excepciones
- WF-D2 crea autopilot_actions cuando payment expira

### ✅ Lo que es CORRECTO:

**WF-03 (Lead Handler) es el ÚNICO workflow que debe crear autopilot_actions**

**¿Por qué?**
- Es el punto central donde entran TODOS los leads (WhatsApp, Web, Instagram, Email)
- Ya tiene toda la información del lead
- Puede detectar situaciones especiales antes de pasar a LUMINA
- Centraliza la lógica de creación de actions

---

## 🔄 FLUJO CORRECTO

```
Lead entra (cualquier canal)
   ↓
WF-03 Lead Handler
   ↓
1. Normaliza datos
2. Guarda en Supabase (leads table)
3. 🔍 DETECTA SITUACIONES ESPECIALES ◄─── AQUÍ CREA ACTIONS
   ├─ Payment request sin proof? → CREATE action (payment_verification)
   ├─ Pide payment plan? → CREATE action (custom_plan_request)
   ├─ Cancelación con emergencia? → CREATE action (cancellation_exception)
   ├─ Dates en conflicto? → CREATE action (date_conflict)
   └─ Pide descuento? → CREATE action (pricing_exception)
4. Llama LUMINA
5. Follow-Up Engine
6. BANYU/KORA responde
```

---

## 📋 CASOS QUE WF-03 DEBE DETECTAR

| Situación | Action Type | Cuándo |
|-----------|-------------|---------|
| Booking sin pago | payment_verification | lead_type='booking' && no payment_proof |
| Pide plan de pago | custom_plan_request | message contiene "payment plan", "installments", "50%" |
| Cancelación especial | cancellation_exception | lead_type='cancellation' && message contiene "emergency", "medical" |
| Fechas conflicto | date_conflict | requested dates overlap existing booking |
| Pide descuento | pricing_exception | message contiene "discount", "cheaper", "lower price" |

---

## 🎯 PARA COMPLETAR FASE 1 HOY

### ✅ LO QUE HACEMOS HOY:

**Usar actions MANUALES para testing:**

```sql
-- 1. Crear action de prueba manualmente:
INSERT INTO autopilot_actions (
  tenant_id, property_id, action_type, title, description,
  status, related_type, related_id, details, priority, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'TEST - Payment Verification Needed',
  'Guest sent booking request, awaiting payment',
  'pending',
  'lead',
  gen_random_uuid(),
  '{"guest_phone": "+34619794604", "amount": 500}',
  'high',
  'TEST_MANUAL'
)
RETURNING id;
```

**2. Probar APPROVE/REJECT desde dashboard**
**3. Validar WF-AUTOPILOT Actions funciona**

---

### ⏳ LO QUE HAREMOS DESPUÉS (FASE 1.5):

**Implementar auto-creación en WF-03:**

1. Añadir nodo "Intent Detection" en WF-03
2. Añadir nodo "Create Autopilot Action" (Supabase INSERT)
3. Testing con leads reales
4. Activar en producción

**Estimación:** 3-4 horas (DESPUÉS de validar FASE 1)

---

## 🚨 IMPORTANTE

**Para HOY:**
- ❌ NO implementar auto-creación de actions en WF-03
- ❌ NO añadir lógica de detección todavía
- ✅ SÍ usar INSERT manual para testing
- ✅ SÍ validar approve/reject end-to-end
- ✅ SÍ completar las 5 tareas de FASE 1

**Razón:** Primero validamos que el workflow WF-AUTOPILOT Actions funciona correctamente con actions creadas manualmente. Una vez validado, entonces implementamos la auto-creación.

---

## 📝 TAREAS PENDIENTES HOY (SIN CAMBIOS)

1. ✅ Probar REJECT en WF-AUTOPILOT Actions V2
2. ✅ Probar fallback/default case
3. ✅ Activar workflows en n8n
4. ✅ Probar WF-D2 Payment Protection
5. ✅ Test end-to-end desde OSIRIS Dashboard

**Usar actions MANUALES (INSERT en Supabase) para todas las pruebas**

---

## 📄 DOCUMENTO COMPLETO

Para más detalle (pseudocódigo, ejemplos, arquitectura completa):

**AUTOPILOT_ACTIONS_CREACION_LOGICA.md**

---

*Resumen generado: 28 Enero 2026*
*Clarificación: WF-03 crea las actions, no BANYU/KORA/LUMINA*
