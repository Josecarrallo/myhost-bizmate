# PROMPT - SESIÓN MIÉRCOLES 28 ENERO 2026
# OBJETIVO: COMPLETAR AUTOPILOT FASE 1

---

## CONTEXTO

Soy Jose, founder de ZENTARA LIVING, desarrollando MY HOST BizMate.
Plataforma SaaS de automatización para boutique hotels en Bali.
Pilot client: Izumi Hotel (7 villas en Ubud).

**DOCUMENTO DE REFERENCIA:** AUTOPILOT_MODULE_REFERENCE_COMPLETE.md (adjunto)

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

### WORKFLOWS

| Workflow | ID | Estado | Probado |
|----------|-----|--------|---------|
| Daily Summary CRON | `1V9GYFmjXISwXTIn` | ✅ Activo | ✅ Funciona |
| Daily Summary API | `2wVP7lYVQ9NZfkxz` | ✅ Activo | ✅ Funciona |
| Payment Protection | `9VzPX1MCghPKkxFS` | ⚠️ Inactivo | ❌ Pendiente |
| **Actions Approve/Reject V2** | `GuHQkHb21GlowIZl` | ⚠️ Inactivo | 🔄 Parcial |

### WF-AUTOPILOT Actions - Estado Detallado

| Escenario | APPROVE | REJECT |
|-----------|---------|--------|
| payment_verification | ✅ Probado y funciona | ❌ **PENDIENTE** |
| custom_plan_request | ✅ Probado y funciona | ❌ **PENDIENTE** |
| cancellation_exception | ✅ Probado y funciona | ❌ **PENDIENTE** |
| default/fallback | ❌ **PENDIENTE** | N/A |

---

## TAREAS PENDIENTES PARA COMPLETAR FASE 1

### BLOQUE 1: Completar WF-AUTOPILOT Actions (30 min)

**1.1 Probar REJECT** para cada action_type
```powershell
# Crear action de prueba
# Enviar reject
# Verificar que se marca como rejected
# Verificar WhatsApp (si aplica)
```

**1.2 Probar fallback/default**
- Crear action con action_type diferente (ej: "other")
- Aprobar
- Verificar que solo marca approved sin ejecutar lógica especial

**1.3 Activar el workflow**
- Toggle ON en n8n
- Verificar que webhook responde

---

### BLOQUE 2: Probar WF-D2 Payment Protection (45 min)

**2.1 Entender el workflow actual**
- Revisar nodos en n8n (ID: `9VzPX1MCghPKkxFS`)
- Verificar lógica de reminders (6h, 20h, 24h)

**2.2 Crear booking de prueba**
```sql
INSERT INTO bookings (...)
VALUES (status='pending_payment', payment_expiry_at=now()+interval '24 hours', ...)
```

**2.3 Disparar el workflow**
```powershell
$body = @{
  tenant_id = "c24393db-d318-4d75-8bbf-0fa240b9c1db"
  property_id = "18711359-1378-4d12-9ea6-fb31c0b1bac2"
  booking_id = "[UUID]"
  guest_contact = "+34619794604"
  amount = 500
  currency = "USD"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

**2.4 Verificar**
- Booking actualizado con payment_expiry_at
- WhatsApp enviado con instrucciones de pago
- (Opcional) Esperar 6h para reminder o simular

**2.5 Activar el workflow**

---

### BLOQUE 3: Conectar con OSIRIS Dashboard (30 min)

**3.1 Verificar endpoint API**
- El dashboard debe llamar a `/webhook/autopilot/action` con approve/reject
- Verificar que el frontend tiene la URL correcta

**3.2 Probar flujo completo**
1. Crear autopilot_action pendiente en Supabase
2. Ver que aparece en OSIRIS (Actions Needing Approval)
3. Hacer clic en Approve desde la UI
4. Verificar que el workflow se ejecuta
5. Verificar WhatsApp recibido

---

### BLOQUE 4: Validación Final (15 min)

**4.1 Checklist de completitud**

| Item | Estado |
|------|--------|
| Daily Summary CRON funciona a las 18:00 | ✅ / ❌ |
| Daily Summary API responde on-demand | ✅ / ❌ |
| Payment Protection envía reminders | ✅ / ❌ |
| Actions Approve funciona para 3 tipos | ✅ / ❌ |
| Actions Reject funciona | ✅ / ❌ |
| OSIRIS puede aprobar/rechazar | ✅ / ❌ |
| Todos los workflows ACTIVOS | ✅ / ❌ |

**4.2 Documentar issues encontrados**

---

## EXPRESIONES n8n CORRECTAS (REFERENCIA)

Estas expresiones fueron debuggeadas y funcionan:

### Route Action Switch
```
{{ $('Webhook').item.json.body.action }}
```

### Switch Action Type
```
{{ $json.action_type }}
```

### Acceder a datos de la action desde nodos posteriores
```
{{ $('payment_verification').item.json.details.guest_phone }}
```

### URL para PATCH booking
```
https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings?id=eq.{{ $json.related_id }}
```

---

## TEST DATA DISPONIBLE

### Actions de prueba ya creadas:

| ID | Type | Status |
|----|------|--------|
| a3bbb2aa-eb4f-49e2-8885-45f520231fa9 | payment_verification | approved |
| 416b3710-901b-43aa-b135-7dc4fcfb5c16 | custom_plan_request | approved |
| dbdeb16d-c79c-4d5d-83a6-7ecb05023599 | cancellation_exception | approved |

### Booking de prueba:
- ID: c9000001-0001-0001-0001-000000000002
- Guest: Maria Garcia
- Phone: +34612345678

---

## COMANDOS DE TEST

### Test REJECT
```powershell
$body = @{action="reject"; action_id="[UUID]"; user_id="test"; reason="Payment not verified"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

### Crear nueva action para test
```sql
INSERT INTO autopilot_actions (
  tenant_id, property_id, action_type, title, description, status,
  related_type, related_id, details, priority, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'TEST - Payment Verification',
  'Test action for reject',
  'pending',
  'booking',
  'c9000001-0001-0001-0001-000000000002',
  '{"guest_phone": "+34619794604", "guest_name": "Test Guest", "amount": 500}',
  'high',
  'TEST'
)
RETURNING id;
```

---

## NO QUIERO

- Explicaciones de lo que ya sé
- Que preguntes qué quiero hacer
- Revisiones innecesarias de documentación
- Tiempo perdido en herramientas que no funcionan

## QUIERO

- Ejecutar las tareas pendientes directamente
- Eficiencia y resultados
- Que al final de la sesión FASE 1 esté 100% completa
- Documentar cualquier issue para FASE 2/3

---

## DESPUÉS DE FASE 1: ROADMAP

| Fase | Contenido | Estimación |
|------|-----------|------------|
| FASE 2 | Weekly Business Check, Weekly Ops Checklist | 1-2 días |
| FASE 3 | Monthly Close & Report | 1 día |

---

*Prompt generado: 27 Enero 2026*
