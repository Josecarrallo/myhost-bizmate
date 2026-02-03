# PROMPT DE ARRANQUE - 28 ENERO 2026
# AUTOPILOT FASE 1 - COMPLETAR TESTING

---

## CONTEXTO

Soy Jose, founder de ZENTARA LIVING, desarrollando MY HOST BizMate.
Plataforma SaaS multi-tenant para boutique hotels en Bali.
Pilot client: Izumi Hotel (7 villas en Ubud).

**ESTADO:** AUTOPILOT FASE 1 casi completo. Frontend 100% listo. Workflows creados, APPROVE probado. Pendiente: probar REJECT y activar workflows.

---

## RECURSOS DEL PROYECTO

| Recurso | Valor |
|---------|-------|
| n8n URL | https://n8n-production-bb2d.up.railway.app |
| Supabase URL | https://jjpscimtxrudtepzwhag.supabase.co |
| Supabase apikey | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0 |
| ChakraHQ WhatsApp URL | https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages |
| ChakraHQ Bearer | qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g |
| Tenant ID | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |

---

## ESTADO ACTUAL - AUTOPILOT FASE 1

### ✅ COMPLETADO (27 Enero 2026)

**Frontend (Claude Code):**
- ✅ Autopilot.jsx - Dashboard con colores corporativos naranjas
- ✅ ManualDataEntry.jsx - Formulario entrada manual datos
- ✅ Conexión con Supabase
- ✅ Visualización de actions pending approval
- ✅ Botones Approve/Reject funcionales

**Workflows n8n (Claude AI):**
- ✅ WF-D3 Daily Summary CRON (ID: `1V9GYFmjXISwXTIn`) - Activo, funciona 18:00 WITA
- ✅ WF-D3 Daily Summary API (ID: `2wVP7lYVQ9NZfkxz`) - Activo, funciona on-demand
- ✅ WF-AUTOPILOT Actions V2 (ID: `GuHQkHb21GlowIZl`) - **APPROVE probado para 3 tipos:**
  - payment_verification → Extend Hold +24h → WhatsApp → ✅ FUNCIONA
  - custom_plan_request → Update Plan → WhatsApp → ✅ FUNCIONA
  - cancellation_exception → Process Refund → WhatsApp → ✅ FUNCIONA

### ⏳ PENDIENTE (28 Enero 2026)

| Tarea | Workflow | Estimación | Responsable |
|-------|----------|------------|-------------|
| **1. Probar REJECT** | WF-AUTOPILOT Actions V2 | 15 min | Claude AI |
| **2. Probar fallback/default** | WF-AUTOPILOT Actions V2 | 10 min | Claude AI |
| **3. Activar workflows** | WF-AUTOPILOT + WF-D2 | 5 min | Claude AI |
| **4. Probar WF-D2** | Payment Protection | 30 min | Claude AI |
| **5. Test end-to-end** | Desde OSIRIS Dashboard | 20 min | Jose + Claude Code |

**Total estimado:** 1h 20min

---

## TAREAS DETALLADAS

### TAREA 1: Probar REJECT (15 min)

**Workflow:** WF-AUTOPILOT Actions V2 (ID: `GuHQkHb21GlowIZl`)

**Pasos:**

1. **Crear action de prueba en Supabase:**
```sql
INSERT INTO autopilot_actions (
  tenant_id, property_id, action_type, title, description, status,
  related_type, related_id, details, priority, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'TEST REJECT - Payment Verification',
  'Guest sent payment screenshot but verification failed',
  'pending',
  'booking',
  'c9000001-0001-0001-0001-000000000002',
  '{"guest_phone": "+34619794604", "guest_name": "Test Guest", "amount": 500}',
  'high',
  'TEST_REJECT'
)
RETURNING id;
```

2. **Copiar el UUID generado**

3. **Enviar REJECT al webhook:**
```powershell
$body = @{
  action = "reject"
  action_id = "[UUID_COPIADO]"
  user_id = "test_user"
  reason = "Payment not verified - screenshot unclear"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

4. **Verificar en Supabase:**
```sql
SELECT id, action_type, status, rejected_at, rejected_by, rejection_reason
FROM autopilot_actions
WHERE id = '[UUID_COPIADO]';
```

**Criterio de éxito:**
- ✅ status = 'rejected'
- ✅ rejected_at tiene timestamp
- ✅ rejected_by = 'test_user'
- ✅ rejection_reason = 'Payment not verified - screenshot unclear'

**Repetir para:**
- custom_plan_request
- cancellation_exception

---

### TAREA 2: Probar fallback/default (10 min)

**Objetivo:** Verificar que action_type desconocidos solo marcan approved sin ejecutar lógica especial.

**Pasos:**

1. **Crear action con tipo desconocido:**
```sql
INSERT INTO autopilot_actions (
  tenant_id, property_id, action_type, title, description, status,
  related_type, related_id, priority, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'unknown_type_test',
  'TEST FALLBACK - Unknown Type',
  'Testing default case in switch',
  'pending',
  'other',
  gen_random_uuid(),
  'normal',
  'TEST_FALLBACK'
)
RETURNING id;
```

2. **Aprobar:**
```powershell
$body = @{
  action = "approve"
  action_id = "[UUID]"
  user_id = "test_user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

3. **Verificar:**
```sql
SELECT id, action_type, status, approved_at, approved_by, execution_result
FROM autopilot_actions
WHERE id = '[UUID]';
```

**Criterio de éxito:**
- ✅ status = 'approved'
- ✅ approved_at tiene timestamp
- ✅ NO ejecutó lógica especial (no WhatsApp, no updates a booking)
- ✅ execution_result indica que se procesó en default case

---

### TAREA 3: Activar workflows (5 min)

**Workflows a activar:**

1. **WF-AUTOPILOT Actions V2** (ID: `GuHQkHb21GlowIZl`)
   - Ir a n8n: https://n8n-production-bb2d.up.railway.app/workflow/GuHQkHb21GlowIZl
   - Toggle ON (arriba derecha)
   - Verificar: Status = Active

2. **WF-D2 Payment Protection** (ID: `9VzPX1MCghPKkxFS`)
   - Ir a n8n: https://n8n-production-bb2d.up.railway.app/workflow/9VzPX1MCghPKkxFS
   - Toggle ON
   - Verificar: Status = Active

**Verificar endpoint responde:**
```powershell
# Test WF-AUTOPILOT
$body = @{action="approve"; action_id="test"; user_id="test"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body

# Test WF-D2
$body = @{tenant_id="c24393db-d318-4d75-8bbf-0fa240b9c1db"; property_id="18711359-1378-4d12-9ea6-fb31c0b1bac2"; booking_id="test"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

---

### TAREA 4: Probar WF-D2 Payment Protection (30 min)

**Workflow:** WF-D2 Payment Protection (ID: `9VzPX1MCghPKkxFS`)

**Lógica:**
- HOLD_DURATION_HOURS = 24
- REMINDER_1 = +6h (INFO: "Payment Pending")
- REMINDER_2 = +20h (WARNING: "Payment Warning")
- EXPIRY = +24h (URGENT: "Payment Expired" → Cancel booking)

**Pasos:**

1. **Crear booking de prueba:**
```sql
INSERT INTO bookings (
  id, tenant_id, property_id,
  guest_name, guest_phone, guest_email,
  check_in, check_out,
  total_amount, currency,
  status, payment_status,
  created_at
) VALUES (
  gen_random_uuid(),
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'Test Guest Payment',
  '+34619794604',
  'test@example.com',
  current_date + interval '7 days',
  current_date + interval '10 days',
  500.00,
  'USD',
  'pending',
  'pending',
  now()
)
RETURNING id;
```

2. **Disparar WF-D2:**
```powershell
$body = @{
  tenant_id = "c24393db-d318-4d75-8bbf-0fa240b9c1db"
  property_id = "18711359-1378-4d12-9ea6-fb31c0b1bac2"
  booking_id = "[UUID_COPIADO]"
  guest_contact = "+34619794604"
  amount = 500
  currency = "USD"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

3. **Verificar booking actualizado:**
```sql
SELECT id, status, payment_status, payment_expiry_at
FROM bookings
WHERE id = '[UUID]';
```

**Criterio de éxito:**
- ✅ payment_expiry_at = now() + 24 hours
- ✅ WhatsApp enviado con instrucciones de pago
- ✅ Log en autopilot_activity_log

**OPCIONAL:** Esperar 6h o simular para ver reminder #1 (no crítico para FASE 1)

---

### TAREA 5: Test end-to-end desde OSIRIS (20 min)

**Workflow completo:** Frontend → n8n → Supabase → Frontend

**Pasos:**

1. **Abrir MYHOST Bizmate:**
   - Login: https://my-host-bizmate.vercel.app
   - Navegar a: Autopilot → Daily

2. **Crear action pendiente manualmente en Supabase:**
```sql
INSERT INTO autopilot_actions (
  tenant_id, property_id, action_type, title, description, status,
  related_type, related_id, details, priority, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'Guest Payment Screenshot Received',
  'Guest Maria sent payment confirmation, 1 hour before expiry',
  'pending',
  'booking',
  'c9000001-0001-0001-0001-000000000002',
  '{"guest_phone": "+34619794604", "guest_name": "Maria Garcia", "amount": 500}',
  'high',
  'WF-D2'
)
RETURNING id;
```

3. **Refrescar dashboard → Ver action en "Actions Needing Approval"**

4. **Click en "Approve"**

5. **Verificar:**
   - ✅ Action desaparece de pending
   - ✅ Status en Supabase = 'approved'
   - ✅ WhatsApp enviado a +34619794604
   - ✅ Booking.payment_expiry_at extendido +24h

6. **Repetir con REJECT:**
   - Crear otra action
   - Click "Reject" con reason
   - Verificar status = 'rejected' y rejection_reason guardado

---

## CHECKLIST FINAL - AUTOPILOT FASE 1 COMPLETO

Una vez terminadas las 5 tareas:

| Item | Estado |
|------|--------|
| Daily Summary CRON funciona a las 18:00 | ✅ |
| Daily Summary API responde on-demand | ✅ |
| Payment Protection envía payment instructions | ⏳ |
| Actions APPROVE funciona para 3 tipos | ✅ |
| Actions REJECT funciona | ⏳ |
| Actions fallback/default funciona | ⏳ |
| OSIRIS puede aprobar/rechazar desde UI | ⏳ |
| Todos los workflows ACTIVOS | ⏳ |
| Test end-to-end completo | ⏳ |

**Criterio:** TODOS los items en ✅ = **AUTOPILOT FASE 1 COMPLETO** 🎉

---

## DESPUÉS DE FASE 1

Una vez completado, documentar:

1. **Issues encontrados** (si hay)
2. **Mejoras sugeridas** para FASE 2/3
3. **Actualizar DOCUMENTO_MAESTRO** con estado final

**Siguiente paso:** FASE 2 - AUTOPILOT WEEKLY (1-2 días estimados)

---

## DOCUMENTACIÓN DE REFERENCIA

En `C:\myhost-bizmate\Clause AI and Code Update 27012026`:
- **AUTOPILOT_MODULE_REFERENCE_COMPLETE.md** - Referencia técnica completa
- **DOCUMENTO_MAESTRO_MYHOST_BIZMATE_27ENE2026.md** - Estado global proyecto
- **TEMAS_PENDIENTES_PRIORIZADOS_27ENE2026.md** - Roadmap priorizado

---

## LO QUE NO QUIERO

- Explicaciones largas de cosas ya documentadas
- Preguntas sobre qué hacer (ya está todo especificado)
- Revisiones de documentación innecesarias
- Pérdida de tiempo

## LO QUE QUIERO

- Ejecutar las 5 tareas directamente
- Resultados verificables
- Documentar solo issues/blockers
- Al final: FASE 1 al 100% ✅

---

*Prompt generado: 27 Enero 2026 - 23:45h*
*Para sesión: 28 Enero 2026 con Claude AI*
