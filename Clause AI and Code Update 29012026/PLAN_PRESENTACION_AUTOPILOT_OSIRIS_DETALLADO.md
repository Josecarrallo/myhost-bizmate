# PLAN PRESENTACIÓN - AUTOPILOT + OSIRIS
## Para mañana tarde - Demo completo con visualización de datos

**Fecha:** 29 Enero 2026
**Objetivo:** Demostrar AUTOPILOT funcionando con OSIRIS + visualización en tiempo real de cómo se guarda en base de datos

---

## 🎬 GUIÓN DE LA PRESENTACIÓN

### PARTE 1: Problema (2 min)
**"El día a día de un villa owner en Bali"**

```
Owner se despierta → 15 mensajes WhatsApp
├─ "Do you have availability?"
├─ "What's the price?"
├─ "I transferred the money, here's the proof"
├─ "Can I pay 50% now, 50% later?"
└─ "Family emergency, need refund"

Owner pasa 2-3 horas:
- Respondiendo lo mismo
- Persiguiendo pagos
- Haciendo follow-ups
- Actualizando calendarios manualmente
```

**Quote del survey:**
> *"Even with only a few units, the workload is still heavy because everything is handled personally."*

---

### PARTE 2: Solución (15 min demo)
**"Esto es MY HOST BizMate - AUTOPILOT"**

#### DEMO FLOW:

**1. Login → AUTOPILOT Dashboard (2 min)**
```
"Cada mañana, el owner ve esto:"
```

**Vista OSIRIS:**
```
┌──────────────────────────────────────────────────────┐
│  TODAY AT A GLANCE                                   │
├──────────────────────────────────────────────────────┤
│  📨 New Inquiries:        8                          │
│  💰 Pending Payments:     2                          │
│  ✅ Confirmed Bookings:   3                          │
│  🏠 Check-ins Today:      1                          │
│  📤 Check-outs Today:     2                          │
│  ⏰ Expired Holds:        0                          │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  ⚡ TIME SAVED THIS WEEK: 8.5 HOURS                 │
└──────────────────────────────────────────────────────┘
```

**Explicación:**
> "El sistema ya respondió 8 inquiries automáticamente, está persiguiendo 2 pagos, y te ahorró 8.5 horas esta semana. Tú no has hecho nada todavía."

---

**2. Ver Action Pendiente (3 min + visualización DB)**
```
"Pero hay 1 situación que necesita tu decisión:"
```

**Vista Actions Needing Approval:**
```
┌──────────────────────────────────────────────────────┐
│  NEEDS YOUR DECISION                                 │
├──────────────────────────────────────────────────────┤
│  🔴 HIGH PRIORITY                                    │
│                                                      │
│  Guest Payment Screenshot Received                   │
│  Guest Maria sent payment confirmation,              │
│  1 hour before expiry                                │
│                                                      │
│  Guest: Maria Garcia (+34 619794604)                 │
│  Amount: $500 USD                                    │
│  Booking: March 10-15                                │
│                                                      │
│  [Approve] [Reject]                                  │
└──────────────────────────────────────────────────────┘
```

**👉 VISUALIZACIÓN BASE DE DATOS (NUEVO - CRÍTICO):**

Abrir pestaña lateral mostrando Supabase en tiempo real:
```sql
-- Tabla: autopilot_actions
SELECT
  id,
  action_type,
  title,
  status,  -- 'pending'
  priority,
  created_at,
  details
FROM autopilot_actions
WHERE status = 'pending'
ORDER BY created_at DESC;
```

**Resultado visible:**
```
id: a3bbb2aa-eb4f-49e2-8885-45f520231fa9
action_type: payment_verification
title: Guest Payment Screenshot Received
status: pending  ← ESTADO ACTUAL
priority: high
details: {"guest_name": "Maria Garcia", "amount": 500}
```

**Explicación:**
> "Mira, esta action está guardada aquí en la base de datos. Status = 'pending'. El sistema detectó que Maria dice que pagó pero falta verificar. Te pregunta: ¿aprobar o rechazar?"

---

**3. Aprobar desde OSIRIS (5 min + visualización DB)**

**Owner hace click en [Approve]**

**👉 VISUALIZACIÓN EN TIEMPO REAL:**

**Paso 1: Frontend llama webhook**
```javascript
// Console del navegador visible
console.log('Sending to n8n...');
POST https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action
Body: {
  "action": "approve",
  "action_id": "a3bbb2aa-eb4f-49e2-8885-45f520231fa9",
  "user_id": "jose@zentaraliving.com"
}
```

**Paso 2: n8n procesa (mostrar en otra pestaña)**
```
Workflow: WF-AUTOPILOT Actions V2 (GuHQkHb21GlowIZl)

Ejecución:
1. ✅ Webhook recibido
2. ✅ Load Action from Supabase
3. ✅ Route → APPROVE
4. ✅ Switch Action Type → payment_verification
5. ✅ Extend Payment Hold (+24h)
6. ✅ Send WhatsApp to guest
7. ✅ Update Action → approved
8. ✅ Respond 200 OK
```

**Paso 3: Base de datos se actualiza (mostrar Supabase refresh)**
```sql
-- Antes:
status: 'pending'
approved_at: NULL
approved_by: NULL

-- Después (ACTUALIZACIÓN EN VIVO):
status: 'approved'  ← CAMBIÓ
approved_at: '2026-01-29T14:23:45Z'  ← NUEVO
approved_by: 'jose@zentaraliving.com'  ← NUEVO
executed_at: '2026-01-29T14:23:46Z'
execution_result: {"extended_hours": 24, "whatsapp_sent": true}
```

**Paso 4: WhatsApp enviado (mostrar teléfono del owner)**
```
WhatsApp → +34619794604 (Maria Garcia):

"Thank you! We've extended your booking hold by 24 hours
while we verify your payment.

We'll confirm once payment is verified."
```

**Paso 5: Booking actualizado (mostrar tabla bookings)**
```sql
-- Tabla: bookings
SELECT
  id,
  guest_name,
  payment_status,
  payment_expiry_at
FROM bookings
WHERE guest_name = 'Maria Garcia';

-- Actualización:
payment_expiry_at: '2026-01-30T14:23:45Z'  ← +24 horas
```

**Explicación:**
> "En 2 segundos:
> 1. Tu decisión se guardó en la base de datos
> 2. n8n ejecutó el workflow
> 3. Se envió WhatsApp automático a Maria
> 4. Se extendió el hold 24 horas
> 5. Todo registrado en Supabase
>
> Tú hiciste 1 click. El sistema hizo 5 acciones automáticas."

---

**4. Ver Log de Actividad (3 min + visualización DB)**

**Vista Activity Log en OSIRIS:**
```
┌──────────────────────────────────────────────────────┐
│  RECENT ACTIVITY                                     │
├──────────────────────────────────────────────────────┤
│  14:23 - Payment hold extended for Maria Garcia      │
│  14:15 - Auto-reply sent to new inquiry              │
│  13:45 - Follow-up message sent (Step 2)             │
│  13:20 - Daily summary generated                     │
│  12:00 - Payment reminder sent to John Smith         │
└──────────────────────────────────────────────────────┘
```

**👉 VISUALIZACIÓN BASE DE DATOS:**
```sql
-- Tabla: autopilot_activity_log
SELECT
  activity_type,
  workflow_id,
  details,
  created_at
FROM autopilot_activity_log
WHERE tenant_id = 'c24393db...'
ORDER BY created_at DESC
LIMIT 10;
```

**Resultado visible:**
```
activity_type: payment_hold_extended
workflow_id: WF-AUTOPILOT-ACTIONS
details: {"guest": "Maria Garcia", "hours_added": 24}
created_at: 2026-01-29T14:23:46Z

activity_type: follow_up_sent
workflow_id: WF-02
details: {"lead_id": "...", "step": 2, "intent": "VALUE_REMINDER"}
created_at: 2026-01-29T13:45:12Z
```

**Explicación:**
> "Cada acción que el sistema hace queda registrada. Puedes auditar todo lo que pasó, cuándo, y por qué."

---

**5. Manual Data Entry (2 min)**

**"¿Y si una reserva llega por teléfono?"**

**Vista Manual Data Entry:**
```
┌──────────────────────────────────────────────────────┐
│  ADD BOOKING MANUALLY                                │
├──────────────────────────────────────────────────────┤
│  Guest Name:     [María López]                       │
│  Phone:          [+34 600 123 456]                   │
│  Email:          [maria@example.com]                 │
│  Check-in:       [2026-03-10]                        │
│  Check-out:      [2026-03-15]                        │
│  Total Amount:   [1200]                              │
│  Payment Status: [Pending / Confirmed]               │
│                                                      │
│  [Save Booking]                                      │
└──────────────────────────────────────────────────────┘
```

**Owner completa formulario → Click [Save Booking]**

**👉 VISUALIZACIÓN BASE DE DATOS:**
```sql
-- ANTES: bookings está vacío para esa fecha

-- DESPUÉS (INSERT EN VIVO):
INSERT INTO bookings (
  tenant_id, property_id,
  guest_name, guest_phone, guest_email,
  check_in, check_out,
  total_amount, payment_status,
  status, source
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'María López',
  '+34 600 123 456',
  'maria@example.com',
  '2026-03-10',
  '2026-03-15',
  1200.00,
  'pending',
  'confirmed',
  'manual_entry'
);

-- Query resultado:
SELECT * FROM bookings WHERE guest_name = 'María López';
-- Aparece el nuevo registro ✅
```

**Explicación:**
> "Si alguien llama por teléfono, introduces los datos aquí. Se guarda en Supabase y automáticamente:
> 1. Se bloquea el calendario
> 2. Se crea un payment reminder
> 3. Se programa el guest journey
>
> Todo sincronizado."

---

### PARTE 3: Arquitectura Técnica (3 min)

**"¿Cómo funciona por dentro?"**

**Diagrama en pantalla:**
```
┌────────────────────────────────────────────────────┐
│  FRONTEND (MYHOST Bizmate)                         │
│  React + Tailwind + Supabase Client                │
│  - OSIRIS Dashboard (lo que acabas de ver)         │
│  - Manual Data Entry                               │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼ Webhooks
┌────────────────────────────────────────────────────┐
│  n8n WORKFLOWS (Backend Automation)                │
│  https://n8n-production-bb2d.up.railway.app        │
│                                                    │
│  - WF-AUTOPILOT Actions (approve/reject)           │
│  - WF-D2 Payment Protection (reminders)            │
│  - WF-02 Follow-Up Engine (auto follow-ups)        │
│  - LUMINA (lead intelligence)                      │
│  - Daily Summary (reportes)                        │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼ Write/Read
┌────────────────────────────────────────────────────┐
│  SUPABASE (PostgreSQL Database)                    │
│  https://jjpscimtxrudtepzwhag.supabase.co          │
│                                                    │
│  Tables:                                           │
│  - autopilot_actions (pending/approved/rejected)   │
│  - bookings (reservas)                             │
│  - leads (inquiries)                               │
│  - guests (guest database)                         │
│  - daily_summary (métricas)                        │
│  - autopilot_activity_log (audit log)             │
└────────────────────────────────────────────────────┘
```

**Explicación:**
> "3 capas simples:
> 1. Frontend (lo que ves) lee y escribe en Supabase
> 2. n8n workflows escuchan eventos y ejecutan automatismos
> 3. Supabase guarda todo - es la fuente única de verdad
>
> Multi-tenant: cada hotel tiene su tenant_id. Datos aislados y seguros."

---

### PARTE 4: Menú AUTOPILOT Mejorado (2 min)

**"El menú está organizado en 3 fases"**

**Vista Sidebar mejorada:**
```
┌────────────────────────────────────────────┐
│  AUTOPILOT                                 │
├────────────────────────────────────────────┤
│  ► Daily   (FASE 1) ✅                     │
│     - Today's Summary                      │
│     - Actions Needing Approval             │
│     - Payment Protection                   │
│     - Manual Data Entry                    │
│                                            │
│  ► Weekly  (FASE 2) ⏳                     │
│     - Weekly Business Check                │
│     - Operations Checklist                 │
│                                            │
│  ► Monthly (FASE 3) ⏳                     │
│     - Monthly Close & Report               │
│     - Performance Analytics                │
└────────────────────────────────────────────┘
```

**Según documento oficial:**
```
FASE 1 - AUTOPILOT DAILY (IMPLEMENTADO):
├─ WF-D3 Daily Summary ✅
├─ WF-D2 Payment Protection ✅
├─ WF-AUTOPILOT Actions ✅
└─ Manual Data Entry ✅

FASE 2 - AUTOPILOT WEEKLY (PRÓXIMO):
├─ WF-W1 Weekly Business Check
└─ WF-W2 Weekly Ops Checklist

FASE 3 - AUTOPILOT MONTHLY (DESPUÉS):
└─ WF-M1 Monthly Close & Report
```

**Explicación:**
> "Implementamos por fases. Primero lo más urgente (diario), luego weekly, luego monthly. Cada fase agrega valor progresivamente."

---

### PARTE 5: Resultados Validados (2 min)

**"¿Funciona? Lo validamos con 5 villa owners"**

**Survey Results:**
```
┌────────────────────────────────────────────────────┐
│  SURVEY: 5 Villa Owners en Ubud                   │
├────────────────────────────────────────────────────┤
│  ✅ 80% interesados en AI PMS                     │
│  💰 Precio aceptable: $19-57 USD/mes              │
│  ⏰ Pain Point #1: Guest follow-ups manuales      │
│  🤖 Pain Point #2: Respuestas repetitivas         │
│  💸 Pain Point #3: Payment reminders              │
│                                                    │
│  Factor decisión: "If it replaces admin work      │
│  and is not complicated, I'm willing to pay"      │
└────────────────────────────────────────────────────┘
```

**AUTOPILOT resuelve los 3 pain points principales:**
1. ✅ Follow-ups automáticos (WF-02)
2. ✅ Respuestas automáticas (BANYU WhatsApp AI)
3. ✅ Payment reminders (WF-D2)

---

### PARTE 6: Próximos Pasos (1 min)

**"Estamos listos para onboarding"**

**Nismara Uma Villa:**
- Cliente confirmado
- Empiezan con AUTOPILOT esta semana
- Landing page: https://nismarauma.lovable.app

**Roadmap:**
```
Semana 1-2: AUTOPILOT Daily con Nismara Uma
Semana 3-4: AUTOPILOT Weekly + Monthly
Mes 2: Second hotel onboarding
Mes 3: Voice AI (KORA) multi-idioma
Mes 4: Content Generator + Advanced features
```

---

## 🛠️ PREPARACIÓN TÉCNICA PARA LA DEMO

### 1. **Datos de prueba listos en Supabase**

```sql
-- 1. Action pendiente (payment_verification)
INSERT INTO autopilot_actions (...);

-- 2. Daily summary con métricas
INSERT INTO daily_summary (...);

-- 3. Activity log con acciones recientes
INSERT INTO autopilot_activity_log (...);

-- 4. Booking relacionado con la action
INSERT INTO bookings (...);
```

### 2. **Ventanas abiertas para la demo**

**Pantalla principal:**
- MYHOST Bizmate (localhost:5173 o production)

**Pantalla secundaria / pestañas:**
- Supabase → tabla `autopilot_actions` (con auto-refresh)
- Supabase → tabla `bookings` (con auto-refresh)
- n8n → workflow execution log (GuHQkHb21GlowIZl)
- WhatsApp web (teléfono del owner para mostrar mensaje recibido)
- Console del navegador (para ver API calls en tiempo real)

### 3. **Flujo de clicks preparado**

```
1. Login → AUTOPILOT Daily
2. Ver KPIs (explicar cada número)
3. Scroll a "Actions Needing Approval"
4. Mostrar Supabase (status: pending)
5. Click [Approve]
6. Mostrar console (POST webhook)
7. Mostrar n8n execution log
8. Refresh Supabase (status: approved) ✅
9. Mostrar WhatsApp recibido en teléfono
10. Mostrar booking actualizado (payment_expiry_at +24h)
11. Ver activity log actualizado
12. Manual Data Entry → guardar booking
13. Refresh Supabase → nuevo booking visible
```

---

## 📋 CHECKLIST PRE-PRESENTACIÓN

### Datos:
- [ ] Action pendiente creada en Supabase (payment_verification)
- [ ] Daily summary con métricas del día
- [ ] Activity log con eventos recientes
- [ ] Booking relacionado con la action

### Frontend:
- [ ] Menú AUTOPILOT actualizado según documento (Daily/Weekly/Monthly)
- [ ] KPIs Dashboard mostrando datos reales de Supabase
- [ ] Actions List mostrando action pendiente
- [ ] Botones Approve/Reject funcionales
- [ ] Alerts section visible
- [ ] Manual Data Entry funcional
- [ ] "X hours saved" visible

### Backend:
- [ ] WF-AUTOPILOT Actions activo en n8n
- [ ] Webhook responde correctamente
- [ ] WhatsApp se envía tras approve
- [ ] Base de datos se actualiza correctamente

### Visualización:
- [ ] Supabase abierto en pestaña (auto-refresh activado)
- [ ] n8n execution log visible
- [ ] Console del navegador abierto (network tab)
- [ ] WhatsApp web abierto

### Testing:
- [ ] Flujo completo probado 2-3 veces
- [ ] Timing: demo completa en ~15 min
- [ ] Backup: datos adicionales por si algo falla

---

## 🎯 MENSAJES CLAVE PARA LA PRESENTACIÓN

1. **"Reemplaza trabajo manual, no es un juguete tecnológico"**
2. **"8.5 horas ahorradas esta semana - tiempo real medible"**
3. **"1 click tuyo = 5 acciones automáticas del sistema"**
4. **"Todo queda registrado, auditable, transparente"**
5. **"Validado con 5 villa owners - resuelve sus pain points #1, #2, #3"**
6. **"Simple de usar - approve/reject, no configuraciones complejas"**

---

*Plan generado: 29 Enero 2026*
*Listo para implementar mañana primera hora*
