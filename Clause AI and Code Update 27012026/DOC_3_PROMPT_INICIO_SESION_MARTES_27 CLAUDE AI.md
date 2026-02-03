# PROMPT INICIO SESIÓN - MARTES 27 ENERO 2026
## MY HOST BizMate - Continuación desarrollo AUTOPILOT

---

## CONTEXTO DEL PROYECTO

Soy Jose, fundador de ZENTARA LIVING. Estamos desarrollando **MY HOST BizMate**, una plataforma SaaS de automatización para boutique hotels en Bali. El piloto es **Izumi Hotel** (7 villas en Ubud).

### Stack Tecnológico
- **n8n:** https://n8n-production-bb2d.up.railway.app
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co
- **Frontend (OSIRIS):** React en desarrollo local

### Identificadores Izumi Hotel
```
TENANT_ID:   c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
```

---

## AGENTES AI DEL SISTEMA

| Agente | Función | Estado |
|--------|---------|--------|
| KORA | Voice AI (llamadas) | ✅ Operativo |
| BANYU | WhatsApp AI | ✅ Operativo |
| LUMINA | Lead Intelligence | ✅ Análisis funciona, downstream pendiente |
| OSIRIS | Dashboard BI | ✅ Frontend operativo |
| AUTOPILOT | Automatización proactiva | 🔧 En desarrollo |

---

## ESTADO ACTUAL - AUTOPILOT MODULE

### Completado ✅

1. **WF-D3 Daily Owner Summary**
   - ID: `Y40PfgjndwMepfaD`
   - CRON 18:00 WITA + WhatsApp al owner
   - 100% funcional

2. **WF-D2 Payment Protection**
   - ID: `o471FL9bpMewcJIr`
   - Webhook: POST `/autopilot/payment/start`
   - Envía 3 mensajes WhatsApp (inicial, 6h, 20h)
   - Expira o confirma booking automáticamente
   - **FUNCIONAL pero se activa manualmente**

3. **Tablas Supabase**
   - `daily_summary` ✅
   - `autopilot_actions` ✅
   - `autopilot_activity_log` ✅
   - `autopilot_alerts` ✅

4. **OSIRIS Dashboard**
   - "Actions Needing Approval" visible
   - Botones Approve/Reject presentes

### Pendiente ⏳

1. **Trigger automático de WF-D2**
   - Actualmente se activa con webhook manual
   - Debería activarse AUTOMÁTICAMENTE cuando se crea una reserva
   - Opción recomendada: CRON cada 15 min que busca reservas pending sin proceso activo

2. **Lógica de casos especiales en WF-D2**
   - Cuando faltan ≤2h + guest envió mensaje → crear `autopilot_action`
   - Tipos: payment_verification, custom_payment_plan, cancellation_exception
   - El owner decide via Approve/Reject en OSIRIS

3. **Verificar WF-AUTOPILOT Actions**
   - ID: `E6vXYR5Xm3SYVEnC`
   - Webhook: POST `/autopilot/action`
   - Procesa decisiones Approve/Reject
   - **Existe pero NO probado**

4. **Conectar LUMINA con downstream workflows**
   - LUMINA analiza leads y decide: BOOKED/FOLLOWUP/REENGAGE/CLOSE
   - Falta conectar esas decisiones con acciones reales

---

## WORKFLOWS ACTIVOS EN N8N

| ID | Nombre | Función |
|----|--------|---------|
| `Y40PfgjndwMepfaD` | WF-D3 Daily Owner Summary v4 | Resumen diario |
| `2wVP7lYVQ9NZfkxz` | AUTOPILOT - Daily Summary API | API Dashboard |
| `o471FL9bpMewcJIr` | WF-D2 Payment Protection | Seguimiento pagos |
| `NJR1Omi4BqKA9f1P` | BANYU WhatsApp AI | WhatsApp |
| `gsMMQrc9T2uZ7LVA` | KORA Voice AI | Llamadas |
| `cQLiQnqR2AHkYOjd` | WF-05 Guest Journey | Journey huésped |
| `EtrQnkgWqqbvRjEB` | WF-SP-02 LUMINA | Análisis leads |
| `E6vXYR5Xm3SYVEnC` | WF-AUTOPILOT Actions v2 | Approve/Reject |

---

## ESPECIFICACIÓN WF-D2 (REFERENCIA)

### Flujo Actual
```
Webhook → Load Booking → Update Status (pending_payment)
    → Send Payment Instructions
    → Wait 6h → Reminder 1 (18h remaining)
    → Wait 14h → Reminder 2 (4h remaining - FINAL)
    → Final Check → IF paid: Confirm | IF not: Expire
```

### Lo que falta según documentación
1. Se activa AUTOMÁTICAMENTE al crear booking (no manual)
2. Cuando faltan 2h + guest envió mensaje → crear registro en `autopilot_actions`
3. Owner ve en Dashboard y decide Approve (extender hold) o Reject (dejar expirar)

---

## TAREAS PARA HOY (MARTES 27)

### Prioridad 1: Trigger Automático WF-D2
Implementar un mecanismo para que WF-D2 se active automáticamente cuando se crea una reserva con `payment_status = 'pending'`.

**Opciones:**
- A) Database trigger en Supabase (Edge Function)
- B) Modificar BANYU/KORA para llamar webhook al crear booking
- C) CRON en n8n cada 15 min (recomendado - más simple)

### Prioridad 2: Verificar WF-AUTOPILOT Actions
1. Revisar workflow `E6vXYR5Xm3SYVEnC`
2. Probar con un `action_id` real de `autopilot_actions`
3. Verificar que actualiza status y ejecuta acción correspondiente

### Prioridad 3: Implementar Casos Especiales
Añadir lógica en WF-D2 para:
- Detectar "faltan ≤2h + guest envió mensaje"
- Crear registro en `autopilot_actions` tipo `payment_verification`

---

## COMANDOS DE PRUEBA

### Probar WF-D2
```powershell
$body = '{"tenant_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db","property_id":"18711359-1378-4d12-9ea6-fb31c0b1bac2","booking_id":"68f08a60-6ecd-4b68-8252-a2fba7a2b981","guest_contact":"+34619794604","amount":6300,"currency":"USD"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

### Probar Approve/Reject
```powershell
$body = '{"action":"approve","action_id":"[UUID_FROM_AUTOPILOT_ACTIONS]","user_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

---

## METODOLOGÍA DE TRABAJO

1. **SIEMPRE lee la documentación antes de implementar**
2. **NO modifiques producción hasta validar**
3. **Sigue las especificaciones EXACTAMENTE**
4. **Prueba incrementalmente con datos reales**
5. **Documenta cada cambio**

---

## NOTAS IMPORTANTES

- **Meta WhatsApp Limit:** 2 números máximo por Business Manager (limitación actual)
- **ChakraHQ Coexistence:** Activo para Izumi Hotel
- **Timezone:** Asia/Makassar (WITA, UTC+8)
- **Owner Phone:** +34619794604 (para pruebas WhatsApp)

---

## PREGUNTA INICIAL SUGERIDA

"Vamos a continuar con AUTOPILOT. Primero muéstrame el estado actual del workflow WF-AUTOPILOT Actions (E6vXYR5Xm3SYVEnC) y dime si está correctamente configurado para procesar Approve/Reject."

---

*Prompt generado: 26 de Enero 2026*
*Para uso: 27 de Enero 2026*
