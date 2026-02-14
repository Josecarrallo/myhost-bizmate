# 🚀 PROMPT DE ARRANQUE - MARTES 27 ENERO 2026
## MY HOST BizMate - Sesión AUTOPILOT Module

---

## 📌 CONTEXTO RÁPIDO

Soy **Jose**, fundador de ZENTARA LIVING. Estamos desarrollando **MY HOST BizMate**, una plataforma SaaS de automatización total para boutique hotels en Bali.

**Hotel piloto:** Izumi Hotel (7 villas, Ubud)
**Stack:** n8n + Supabase + React + Claude AI
**Estado:** 75% completo - cerrando módulo AUTOPILOT

---

## 🎯 OBJETIVO DE HOY

**Cerrar completamente el módulo AUTOPILOT** para que funcione end-to-end sin intervención manual.

---

## ✅ LO QUE YA FUNCIONA (100%)

### Agentes AI Operativos
- ✅ **KORA** - Voice AI (llamadas telefónicas) → VAPI
- ✅ **BANYU** - WhatsApp AI (mensajes 24/7) → ChakraHQ
- ✅ **OSIRIS** - Dashboard React con tema oscuro
- ✅ **WF-D3** - Resumen diario automático a las 18:00

### AUTOPILOT Workflows
- ✅ **WF-D3 Daily Summary** - Genera resumen diario + WhatsApp al owner (ID: `Y40PfgjndwMepfaD`)
- ✅ **WF-D2 Payment Protection** - 3 reminders de pago (6h, 20h, 24h) (ID: `o471FL9bpMewcJIr`)
- ✅ **Dashboard UI** - Actions Needing Approval visible con botones Approve/Reject

### Base de Datos
- ✅ Todas las tablas AUTOPILOT creadas: `daily_summary`, `autopilot_actions`, `autopilot_activity_log`, `autopilot_alerts`
- ✅ Función RPC `get_daily_summary` operativa

---

## ⚠️ LO QUE FALTA (3 TAREAS CRÍTICAS)

### 🔴 TAREA 1: Auto-Trigger de WF-D2
**Problema:**
WF-D2 solo se activa manualmente con webhook. Debe activarse automáticamente al crear una reserva.

**Solución (OPCIÓN C - RECOMENDADA):**
Crear workflow CRON en n8n que cada 15 minutos:
1. Busca bookings con:
   - `payment_status = 'pending'`
   - `status IN ('confirmed', 'provisional')`
   - `payment_expiry_at IS NULL` (no tiene proceso activo)
   - `created_at > NOW() - INTERVAL '1 hour'`
2. Para cada uno → llama webhook `/autopilot/payment/start`

**Query SQL:**
```sql
SELECT
  id as booking_id,
  tenant_id,
  property_id,
  guest_id,
  total_amount as amount,
  currency
FROM bookings
WHERE payment_status = 'pending'
  AND status IN ('confirmed', 'provisional')
  AND payment_expiry_at IS NULL
  AND created_at > NOW() - INTERVAL '1 hour'
  AND tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
```

**Acción esperada:**
- Crear nuevo workflow en n8n
- Trigger: CRON `*/15 * * * *` (cada 15 min)
- Nombrar: "WF-D2 Auto-Trigger CRON"

---

### 🔴 TAREA 2: Verificar WF-AUTOPILOT Actions
**Problema:**
Workflow existe (ID: `E6vXYR5Xm3SYVEnC`) pero nunca se ha probado.

**Pasos de testing:**

1. **Crear acción de prueba en Supabase:**
```sql
INSERT INTO autopilot_actions (
  tenant_id,
  property_id,
  action_type,
  title,
  description,
  status,
  details,
  priority
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'TEST - Payment Verification',
  'Test case for approve/reject functionality',
  'pending',
  '{"booking_reference": "BK-TEST-001", "guest_name": "Test Guest", "hours_remaining": 2}'::jsonb,
  'high'
) RETURNING id;
```

2. **Copiar UUID generado**

3. **Probar Approve:**
```powershell
$actionId = "UUID_COPIADO_AQUI"
$body = "{`"action`":`"approve`",`"action_id`":`"$actionId`",`"user_id`":`"c24393db-d318-4d75-8bbf-0fa240b9c1db`"}"

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

4. **Verificar resultado:**
```sql
SELECT * FROM autopilot_actions WHERE id = 'UUID_COPIADO_AQUI';
-- Debe mostrar: status = 'approved', approved_at populated, approved_by populated
```

5. **Probar Reject:** Repetir con `"action":"reject"`

**Resultado esperado:**
- Status se actualiza correctamente
- Campos `approved_by` y `approved_at` se populan
- Se ejecuta acción correspondiente (extender hold si payment_verification)

---

### 🔴 TAREA 3: Casos Especiales en WF-D2
**Problema:**
WF-D2 no crea `autopilot_actions` cuando detecta situaciones especiales.

**Casos a implementar:**

#### Caso A: Payment Verification (PRIORIDAD)
**Cuándo:** Faltan ≤2h para expiración + guest envió mensaje reciente

**Detección:**
```sql
-- Verificar si guest envió mensaje en las últimas 2h
SELECT COUNT(*) as recent_messages
FROM whatsapp_messages
WHERE guest_id = :guest_id
  AND created_at > NOW() - INTERVAL '2 hours'
  AND direction = 'inbound'
  AND (
    message ILIKE '%paid%' OR
    message ILIKE '%payment%' OR
    message ILIKE '%transfer%' OR
    message ILIKE '%comprobante%'
  );
```

**Acción (en WF-D2):**
Añadir nodo después de "Wait 20h" que:
1. Calcula `hours_remaining` = tiempo hasta expiración
2. Si `hours_remaining ≤ 2` Y `recent_messages > 0`:
   - Crear registro en `autopilot_actions`:
   ```json
   {
     "tenant_id": "uuid",
     "property_id": "uuid",
     "action_type": "payment_verification",
     "title": "Payment Verification - {guest_name}",
     "description": "Guest claims payment sent. {hours_remaining}h remaining. Extend hold?",
     "status": "pending",
     "related_type": "booking",
     "related_id": "{booking_id}",
     "details": {
       "booking_reference": "{booking_ref}",
       "guest_name": "{guest_name}",
       "hours_remaining": 2,
       "payment_method": "bank_transfer",
       "guest_message": "{last_message_content}"
     },
     "priority": "high"
   }
   ```
   - Crear alerta en `autopilot_alerts`

#### Caso B: Custom Payment Plan (OPCIONAL - si hay tiempo)
**Cuándo:** Guest solicita plan de pago personalizado

#### Caso C: Cancellation Exception (OPCIONAL - si hay tiempo)
**Cuándo:** Guest cancela fuera de política y pide reembolso

---

## 🔑 INFORMACIÓN CLAVE

### Identificadores
```
TENANT_ID:   c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
```

### URLs
```
n8n:      https://n8n-production-bb2d.up.railway.app
Supabase: https://jjpscimtxrudtepzwhag.supabase.co
```

### Workflow IDs Relevantes
```
WF-D3 Daily Summary:       Y40PfgjndwMepfaD
WF-D2 Payment Protection:  o471FL9bpMewcJIr
WF-AUTOPILOT Actions:      E6vXYR5Xm3SYVEnC
```

### Endpoints Críticos
```
POST /webhook/autopilot/payment/start  → Inicia WF-D2
POST /webhook/autopilot/action         → Procesa Approve/Reject
POST /webhook/autopilot/daily-summary  → API Dashboard
```

---

## 📋 CHECKLIST DE ÉXITO

Al final de la sesión, estos puntos deben estar ✅:

- [ ] WF-D2 se activa AUTOMÁTICAMENTE al crear reserva (CRON implementado)
- [ ] WF-AUTOPILOT Actions probado con éxito (Approve y Reject funcionan)
- [ ] WF-D2 crea `autopilot_actions` cuando detecta casos especiales
- [ ] Test end-to-end completo: Crear reserva → WF-D2 se activa → Reminders enviados → Caso especial detectado → Owner aprueba/rechaza → Acción ejecutada

---

## 🎬 PREGUNTA INICIAL RECOMENDADA

**Para Claude AI (n8n workflows):**

> "Hola, vamos a cerrar el módulo AUTOPILOT hoy. Necesito implementar 3 cosas:
>
> 1. CRON auto-trigger para WF-D2 Payment Protection
> 2. Verificar que WF-AUTOPILOT Actions funciona correctamente
> 3. Añadir lógica de casos especiales (payment_verification) en WF-D2
>
> Empecemos por lo primero: crear el workflow CRON que active WF-D2 automáticamente cuando se crea una reserva con payment_status='pending'.
>
> El CRON debe ejecutarse cada 15 minutos, buscar bookings que cumplan las condiciones, y llamar al webhook /autopilot/payment/start para cada uno.
>
> ¿Puedes revisar primero el workflow WF-D2 actual (ID: o471FL9bpMewcJIr) para entender qué parámetros espera el webhook, y luego crear el nuevo workflow CRON?"

**Para Claude Code (frontend):**

> "El módulo AUTOPILOT está casi listo. El backend (Claude AI) está implementando los workflows finales. ¿Hay algo en el frontend (Dashboard de Autopilot o ManualDataEntry) que necesite ajustes antes de testing final?"

---

## 📚 DOCUMENTOS DE REFERENCIA

### Lectura OBLIGATORIA antes de empezar:
1. **DOCUMENTO_MAESTRO_MYHOST_BIZMATE_27ENE2026.md** ← Este es el documento más importante
2. **DOC_2_AUTOPILOT_MODULE_COMPLETE_2026-01-26.md** ← Especificaciones detalladas AUTOPILOT

### Referencia adicional:
- DOC_1_MYHOST_BIZMATE_PROJECT_UPDATE_2026-01-26.md
- Carpeta `MYHOST Bizmate_Documentos_Estrategicos 2025_2026/`

---

## ⚙️ CONFIGURACIÓN DEL ENTORNO

### Timezone
```
Asia/Makassar (WITA, UTC+8)
```

### Testing Phone Numbers
```
Owner: +34619794604 (para WhatsApp de prueba)
```

### Credenciales
- Ya están configuradas en n8n credentials store
- Supabase anon key está en frontend (src/components/Autopilot/Autopilot.jsx)

---

## 🚨 REGLAS IMPORTANTES

### Para Claude AI:
1. **NO modifiques workflows activos hasta probar en test**
2. **Sigue las especificaciones EXACTAMENTE**
3. **Pregunta ANTES de ejecutar si tienes dudas**
4. **Documenta cada cambio en audit_logs**

### Para Claude Code:
1. **Lee archivos existentes antes de modificar**
2. **Mantén consistencia con el tema oscuro actual**
3. **Prueba en localhost antes de commit**
4. **NO uses emojis en código (solo en commits si el user lo pide)**

---

## 🎯 RESULTADO ESPERADO AL FINAL DEL DÍA

**Sistema funcionando end-to-end:**
```
Guest envía mensaje por WhatsApp
  ↓
BANYU responde y crea lead
  ↓
LUMINA analiza → decisión BOOKED
  ↓
Se crea booking en Supabase (status='confirmed', payment_status='pending')
  ↓
CRON detecta en <15 minutos
  ↓
WF-D2 inicia automáticamente
  ↓
Guest recibe instrucciones de pago
  ↓
Wait 6h → Reminder 1
  ↓
Wait 14h → Reminder 2 (total 20h)
  ↓
Si guest envió mensaje → Crea autopilot_action
  ↓
Owner ve en Dashboard → Approve/Reject
  ↓
Sistema ejecuta decisión (extender hold o dejar expirar)
  ↓
Wait 4h → Final check
  ↓
Si pagó: Confirma booking
Si NO pagó: Expira booking + libera fechas
  ↓
Owner recibe resumen diario a las 18:00
```

---

## 💪 MOTIVACIÓN

Hoy cerramos el **corazón del sistema**: AUTOPILOT. Una vez completado, el sistema puede manejar el 90% de las operaciones sin intervención humana.

**Let's do this! 🚀**

---

*Prompt generado: 27 de Enero 2026 - 00:00 WITA*
*Para uso: Sesión del Martes 27 de Enero 2026*
