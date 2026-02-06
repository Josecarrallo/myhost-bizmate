# 🧪 PLAN DE PRUEBAS COMPLETO — MY HOST BizMate
## Fecha: 06 Febrero 2026 | Todos los componentes

---

## 📊 DIAGNÓSTICO PREVIO — ESTADO REAL DE CADA COMPONENTE

Antes de testear, esto es lo que REALMENTE existe y funciona:

| Componente | Workflow ID | Estado | ¿Testeable HOY? |
|---|---|---|---|
| **OSIRIS** | t9L3dhicNkkFxofD | ✅ Activo, 9 tools | ✅ SÍ |
| **LUMINA** | EtrQnkgWqqbvRjEB | ✅ Activo, pero router roto | ⚠️ PARCIAL — solo ruta AUTOPILOT funciona, las otras 4 van a Respond |
| **GUEST JOURNEY** | cQLiQnqR2AHkYOjd | ✅ Activo, 5 etapas | ⚠️ PARCIAL — hardcodeado a Izumi, no multi-tenant |
| **FOLLOW-UP ENGINE** | 38dOdJ81bIg8d6qS | ❌ Inactivo | ⚠️ PARCIAL — falta nodo "Send WA to Owner" (Build Owner Message no conecta a envío) |
| **AUTOPILOT Payment** | g79gFxN6dW9amCIG | ❌ Inactivo | ⚠️ PARCIAL — WA no llega (necesita debug ChakraHQ) |
| **AUTOPILOT DailyCRON** | yxoycdXQR2yOSGIz | ❌ Inactivo | ✅ SÍ (trigger manual) |
| **AUTOPILOT DailyAPI** | HDNBKjEorzWs3rSc | ❌ Inactivo | ✅ SÍ (webhook) |
| **AUTOPILOT Approve/Reject** | GuHQkHb21GlowlZI | ❌ Inactivo | ✅ SÍ (ya testeado F1) |
| **BANYU (WhatsApp AI)** | ❌ NO EXISTE como workflow separado | Solo hay prototipos viejos (bpMSTuN2, BjA6KRHb, 2zMRKov) | ❌ NO — necesita construir |
| **KORA (Voice AI)** | 3sU4RgV892az8nLZ + 1H1Wohs5js7kWdG9 | ❌ Inactivo, incompleto | ❌ NO — necesita completar integración VAPI |

### ⚠️ GAPS CRÍTICOS DESCUBIERTOS

1. **BANYU NO EXISTE** como workflow funcional. Los que hay son prototipos de ago-dic 2025, ninguno activo ni conectado al flujo actual.
2. **KORA** tiene workflow base + post-call pero no está integrado end-to-end con LUMINA ni con el sistema actual.
3. **Follow-Up Engine** tiene TODO el flujo EXCEPTO el nodo que envía WA al owner (Build Owner Message → ??? → no hay Send WA to Owner).
4. **LUMINA Decision Router** tiene 5 salidas pero solo AUTOPILOT (output 0) va a su flujo correcto. BOOKED, FOLLOWUP, REENGAGE, CLOSE (outputs 1-4) todas van a "9. Respond".

---

## 🔴 FASE 0 — ARREGLOS ANTES DE TESTEAR

Estos arreglos son **prerequisito** para poder ejecutar las pruebas:

### FIX 0.1: Follow-Up Engine — Agregar envío WA a Owner
**Workflow:** 38dOdJ81bIg8d6qS
**Problema:** "Build Owner Message" genera el mensaje pero no hay nodo "Send WA to Owner" después
**Solución:** Agregar HTTP Request node (ChakraHQ) entre "Build Owner Message" y "Update Owner Notified"
**Esfuerzo:** 15 min

### FIX 0.2: LUMINA Decision Router — Conectar 4 salidas faltantes
**Workflow:** EtrQnkgWqqbvRjEB
**Problema:** Outputs 1-4 (BOOKED/FOLLOWUP/REENGAGE/CLOSE) van todos a "9. Respond"
**Solución:**
- BOOKED → Call Guest Journey (o crear lead como booked)
- FOLLOWUP → Call Follow-Up Engine (o update lead state)
- REENGAGE → Call Follow-Up Engine con step reset
- CLOSE → Update lead state to LOST
**Esfuerzo:** 30-45 min

### FIX 0.3: Activar workflows para testing
**Workflows a activar temporalmente:** 38dOdJ81bIg8d6qS, g79gFxN6dW9amCIG
**Nota:** Cambiar Wait nodes a minutos (no horas) para testing rápido

---

## 🟢 FASE 1 — TESTS EJECUTABLES HOY (sin arreglos)

### TEST 1.1: OSIRIS V2 ✅
**Workflow:** t9L3dhicNkkFxofD (activo)
**Método:** Webhook POST

| # | Escenario | Input | Resultado Esperado |
|---|---|---|---|
| 1.1.1 | Revenue mes actual EN | "What's our revenue this month?" | Revenue total Feb, desglose por villa, fechas Feb 1-28 |
| 1.1.2 | Revenue mes actual ES | "¿Cuál es el revenue de febrero?" | Mismo resultado en español |
| 1.1.3 | Revenue mes actual ID | "Berapa pendapatan bulan ini?" | Mismo resultado en bahasa |
| 1.1.4 | Villa ranking | "Rank villas by revenue" | River Villa #1 ($4,750+), distribución correcta |
| 1.1.5 | Check-ins hoy | "Who checks in today?" | Lista de check-ins del 6 Feb o "no check-ins" |
| 1.1.6 | Check-outs hoy | "Who checks out today?" | Incluye status confirmed |
| 1.1.7 | Leads overview | "How many leads do we have?" | 12 leads, estados desglosados |
| 1.1.8 | Pagos pendientes | "Any pending payments?" | Lista de bookings con payment_status pending |
| 1.1.9 | Alertas activas | "Any active alerts?" | Lista de autopilot_alerts |
| 1.1.10 | Reporte diario | "Daily report" | Resumen completo con revenue, occupancy, alertas |
| 1.1.11 | Pregunta sin fecha | "Which villa has most revenue?" | Default a mes completo (no solo hoy) |
| 1.1.12 | Fecha inválida | "Revenue for February 29, 2026" | safe_parse_date clampea a Feb 28 |

### TEST 1.2: LUMINA — Solo ruta AUTOPILOT ⚠️
**Workflow:** EtrQnkgWqqbvRjEB (activo)
**Método:** Webhook POST a /webhook/lumina-analyze

| # | Escenario | Input Payload | Resultado Esperado |
|---|---|---|---|
| 1.2.1 | Lead pide plan de pago | `{"tenant_id":"c24393..","property_id":"18711..","name":"Sarah","phone":"628123456","channel":"whatsapp","message":"Can I pay 50% now and 50% later?","intent":"booking","score":60}` | AUTOPILOT route → create_autopilot_action → WA to owner → lead PENDING_OWNER |
| 1.2.2 | Lead pide cancelación emergencia | `{...,"message":"I need to cancel, my mother is in hospital","intent":"cancel","score":30}` | AUTOPILOT → cancellation_exception action created |
| 1.2.3 | Lead pide descuento | `{...,"message":"Can you give me 20% discount for 7 nights?","intent":"booking","score":50}` | AUTOPILOT → pricing_exception action created |
| 1.2.4 | Lead pregunta disponibilidad (NO requiere owner) | `{...,"message":"Are you available March 15-20?","intent":"availability","score":20}` | FOLLOWUP route → actualmente va a Respond (BUG CONOCIDO) |
| 1.2.5 | Lead con booking confirmado | `{...,"has_booking":true,"intent":"booking","score":100}` | BOOKED route → actualmente va a Respond (BUG CONOCIDO) |
| 1.2.6 | Lead frío, 10 días sin contacto | `{...,"days_since_contact":10,"followup_count":6,"score":5}` | CLOSE route → actualmente va a Respond (BUG CONOCIDO) |

**VALIDAR en cada test:**
- [ ] AI Decision retorna JSON válido
- [ ] Parse AI Decision extrae correctamente
- [ ] Decision Router clasifica en la salida correcta
- [ ] Para AUTOPILOT: action creada en Supabase + WA enviado al owner

### TEST 1.3: AUTOPILOT DailyCRON + DailyAPI
**Workflows:** yxoycdXQR2yOSGIz / HDNBKjEorzWs3rSc

| # | Escenario | Método | Resultado Esperado |
|---|---|---|---|
| 1.3.1 | DailyCRON trigger manual | Trigger manual en n8n UI | Genera daily_summary para Izumi, envía WA al owner |
| 1.3.2 | DailyAPI via webhook | POST /webhook/autopilot/daily-report-v2 con tenant_id | Mismo resultado via API |
| 1.3.3 | DailyAPI tenant inválido | POST con tenant_id inexistente | Error graceful, no crash |

### TEST 1.4: Guest Journey (lectura de estado)
**Workflow:** cQLiQnqR2AHkYOjd (activo)

| # | Escenario | Método | Resultado Esperado |
|---|---|---|---|
| 1.4.1 | Verificar journey_settings | SQL: SELECT * FROM journey_settings | 5 steps, todos enabled |
| 1.4.2 | Simular check-in 7 días | Crear booking con check_in = hoy+7 días, journey_state = 'booking_confirmed' | El scheduler debería clasificarlo |
| 1.4.3 | Simular check-in 48h | Crear booking con check_in = hoy+2 días | Debe enviar WA + email + update state |
| 1.4.4 | Simular check-in day | Booking con check_in = hoy | Welcome message |
| 1.4.5 | Simular check-out day | Booking con check_out = hoy, journey_state = 'checked_in' | Thank you message |
| 1.4.6 | Post-stay review | Booking con check_out = ayer, journey_state = 'checked_out' | Review request con código COMEBACK15 |

**⚠️ PRECAUCIÓN:** Guest Journey está activo y corre cada hora. Crear bookings de test puede disparar mensajes reales. Usar teléfonos de test.

---

## 🟡 FASE 2 — TESTS DESPUÉS DE ARREGLOS (FIX 0.1 + 0.2)

### TEST 2.1: Follow-Up Engine completo
**Workflow:** 38dOdJ81bIg8d6qS (después de FIX 0.1)

| # | Escenario | Setup | Resultado Esperado |
|---|---|---|---|
| 2.1.1 | Lead nuevo, step 1 | Lead con state=NEW, followup_step=1, channel=whatsapp, next_followup_at=pasado | AI genera SOFT_CHECK msg → WA enviado al guest → lead updated step=2 → next_followup +24h |
| 2.1.2 | Lead step 3, high value | Lead con stay_nights=7, villas_count=3, step=3 | LAST_DIRECT msg → WA guest → **Owner notificado vía WA** → owner_notified logged |
| 2.1.3 | Lead HOT con descuento | Lead state=HOT, requested_discount=true, step=2 | VALUE_REMINDER msg → **Owner notificado** (HOT + discount = notify) |
| 2.1.4 | Lead step 6 (closure) | Lead con followup_step=6 | CLOSURE msg → lead state → LOST → no more followups |
| 2.1.5 | Lead canal no-whatsapp | Lead con channel=email | Skip WhatsApp → Log "channel_not_whatsapp" |
| 2.1.6 | No leads pendientes | No leads con next_followup_at vencido | Has Leads? = false → fin silencioso |
| 2.1.7 | Owner ya notificado <24h | Lead con last_owner_notified_at = hace 12h | No enviar segunda notificación (throttle 24h) |

**VALIDAR:**
- [ ] Guest recibe WA con mensaje correcto por step
- [ ] Owner recibe WA cuando lead es high_value/HOT/discount
- [ ] Lead se actualiza en Supabase (state, step, next_followup_at)
- [ ] followup_events se registran
- [ ] Throttle 24h funciona

### TEST 2.2: LUMINA con rutas completas
**Workflow:** EtrQnkgWqqbvRjEB (después de FIX 0.2)

| # | Escenario | Input | Ruta Esperada | Acción |
|---|---|---|---|---|
| 2.2.1 | Lead con booking → BOOKED | has_booking=true | Output 1: BOOKED | Trigger Guest Journey o update lead |
| 2.2.2 | Lead interesado → FOLLOWUP | intent=booking, score=40 | Output 2: FOLLOWUP | Trigger Follow-Up Engine |
| 2.2.3 | Lead frío 8d, <5 followups → REENGAGE | days_since=8, followup_count=3 | Output 3: REENGAGE | Trigger Follow-Up con step reset |
| 2.2.4 | Lead frío 10d, 5+ followups → CLOSE | days_since=10, followup_count=5 | Output 4: CLOSE | Update lead → LOST |
| 2.2.5 | Plan de pago → AUTOPILOT | message="50/50 payment" | Output 0: AUTOPILOT | Create action + WA owner |
| 2.2.6 | Info general → FOLLOWUP | intent=info, score=15 | Output 2: FOLLOWUP | Standard followup |

### TEST 2.3: AUTOPILOT Payment Protection completo
**Workflow:** g79gFxN6dW9amCIG (después de debug WA)

**⏱️ NOTA:** Cambiar Wait nodes a minutos para testing (6h→1min, 14h→1min, 4h→1min)

| # | Escenario | Setup | Resultado Esperado |
|---|---|---|---|
| 2.3.1 | Pago en <6h | Trigger webhook → marcar booking paid antes de 1min | Alert creada → Check 6h → Paid → END |
| 2.3.2 | Pago entre 6-20h | Trigger → no pagar → Reminder 1 enviado → marcar paid | Reminder 1 WA → Check 20h → Paid → END |
| 2.3.3 | Pago entre 20-24h | Trigger → no pagar 2x → Final Reminder → marcar paid | Reminder 1 + Final Reminder WA → Paid → END |
| 2.3.4 | No paga → expira | Trigger → nunca pagar | 3 checks → Expire booking → Alert "expired" → Owner notificado → status=expired |
| 2.3.5 | Config WhatsApp válida | Trigger con tenant válido | get_whatsapp_config retorna phone, chakra token, owner phone |
| 2.3.6 | Tenant sin WA config | Trigger con tenant sin whatsapp_numbers | Error graceful |

**VALIDAR:**
- [ ] Guest recibe Reminder 1 por WA
- [ ] Guest recibe Final Reminder por WA
- [ ] Booking status cambia a expired si no paga
- [ ] Owner recibe notificación de expiración
- [ ] Alert creada en autopilot_alerts
- [ ] Action creada en autopilot_actions

---

## 🔴 FASE 3 — COMPONENTES QUE NECESITAN CONSTRUIR

### TEST 3.1: BANYU (WhatsApp AI Agent) — NO EXISTE

**Estado actual:** No hay workflow BANYU funcional. Solo prototipos viejos sin conexión al sistema actual.

**Se necesita construir:**
1. Webhook receptor de ChakraHQ (inbound messages)
2. Routing multi-tenant por phone_number_id
3. AI Agent con contexto de property (precios, disponibilidad, servicios)
4. Integración con LUMINA (clasificar cada conversación)
5. Registro en whatsapp_conversations/messages

**Escenarios a testear CUANDO EXISTA:**

| # | Escenario del Guest | Mensaje WA | Resultado Esperado |
|---|---|---|---|
| 3.1.1 | Solo pide info | "Hi, what are your prices for March?" | BANYU responde con precios → LUMINA: interested/followup |
| 3.1.2 | Pregunta disponibilidad | "Do you have a villa available March 15-20?" | BANYU check availability → responde → LUMINA: interested |
| 3.1.3 | Quiere reservar | "I want to book River Villa for March 15-20, 2 guests" | BANYU inicia booking flow → LUMINA: booking/high |
| 3.1.4 | Pide descuento | "Can I get a discount for 10 nights?" | BANYU → LUMINA → AUTOPILOT (owner decision) |
| 3.1.5 | Plan de pago | "Can I pay half now half later?" | BANYU → LUMINA → AUTOPILOT (custom_plan) |
| 3.1.6 | Info general (amenities) | "Do you have a pool? What about breakfast?" | BANYU responde directo (no necesita LUMINA) |
| 3.1.7 | Cancelación | "I need to cancel my booking, family emergency" | BANYU → LUMINA → AUTOPILOT (cancellation_exception) |
| 3.1.8 | Conversación multi-turn | Info → precios → disponibilidad → reservar | BANYU mantiene contexto → escala a LUMINA cuando score sube |
| 3.1.9 | Idioma mixto | "Hola, quiero reservar" (en número inglés) | BANYU detecta español, responde en español |
| 3.1.10 | Guest existente con booking | "When is my check-in?" | BANYU busca booking activo → responde con datos |

### TEST 3.2: KORA (Voice AI) — INCOMPLETO

**Estado actual:** Workflow base existe (3sU4RgV892az8nLZ) + Post-Call v3 (1H1Wohs5js7kWdG9) pero no integrados end-to-end.

**Se necesita completar:**
1. Conexión VAPI → n8n webhook
2. Post-call processing (transcripción → análisis → acciones)
3. Integración con LUMINA
4. Registro en leads/whatsapp_conversations

**Escenarios a testear CUANDO ESTÉ LISTO:**

| # | Escenario del Guest | Llamada | Resultado Esperado |
|---|---|---|---|
| 3.2.1 | Solo pide info por voz | "Hi, I'm interested in your hotel, what are the prices?" | KORA responde → Post-call: registra lead, LUMINA: interested/followup |
| 3.2.2 | Quiere reservar por voz | "I'd like to book a villa for next week" | KORA recoge datos → Post-call: crea booking/lead → LUMINA: booking/high |
| 3.2.3 | Pide precio especial | "I'm staying 10 nights, can I get a deal?" | KORA → Post-call → LUMINA → AUTOPILOT (pricing_exception) |
| 3.2.4 | Emergencia cancelación | "I need to cancel my booking, I had a medical emergency" | KORA → Post-call → LUMINA → AUTOPILOT (cancellation_exception) |
| 3.2.5 | Pregunta sobre check-in | "What time is check-in? Where is the hotel exactly?" | KORA responde directo con info de propiedad |
| 3.2.6 | Idioma español | Llamada en español | KORA detecta y responde en español |
| 3.2.7 | Llamada cortada/incompleta | Guest cuelga a medio | Post-call registra lo capturado, no pierde datos |
| 3.2.8 | Guest ya tiene booking | "I have a reservation, can you tell me the details?" | KORA busca booking → proporciona info |

---

## 🔄 FASE 4 — TESTS DE INTEGRACIÓN END-TO-END

Estos tests verifican el flujo COMPLETO de un guest desde primer contacto hasta post-stay:

### TEST 4.1: Guest Journey Completo (Happy Path)

```
DÍA 1: Guest llama por KORA pidiendo info
  → KORA responde con precios
  → Post-call registra lead (state=NEW)
  → LUMINA clasifica: interested/followup

DÍA 2: Guest escribe por BANYU queriendo reservar
  → BANYU inicia booking flow
  → Booking creado (status=pending, payment_status=pending)
  → AUTOPILOT Payment Protection activado
  → LUMINA: booked/guest_journey

DÍA 2 (6h después): AUTOPILOT envía reminder de pago
  → Guest paga
  → Booking: status=confirmed, payment_status=paid
  → AUTOPILOT: END (payment received)

DÍA -7 (7 días antes check-in): Guest Journey
  → WA: "Your Bali Adventure Guide - 7 Days to Go!"
  → Email: misma info
  → Owner notificado
  → journey_state: pre_arrival_7d

DÍA -2 (48h antes): Guest Journey
  → WA: "Airport Pickup?"
  → journey_state: pre_arrival_48h

DÍA 0 (check-in): Guest Journey
  → WA: "Welcome to Izumi Hotel!"
  → journey_state: checked_in

DÍA X (check-out): Guest Journey
  → WA: "Thank you!"
  → journey_state: checked_out

DÍA X+1 (post-stay): Guest Journey
  → WA: "Rate your experience" + código COMEBACK15
  → journey_state: post_stay_sent
```

### TEST 4.2: Lead que NO reserva (Follow-Up Path)

```
DÍA 1: Guest pregunta por BANYU sobre precios
  → Lead creado (state=NEW)
  → LUMINA: interested/followup

+24h: Follow-Up Engine Step 1 (SOFT_CHECK)
  → WA: "Do you have any questions?"
  → state: FOLLOWING_UP, step: 2

+48h: Follow-Up Engine Step 2 (VALUE_REMINDER)
  → WA: "Remember the experience awaiting you..."
  → step: 3

+72h: Follow-Up Engine Step 3 (LAST_DIRECT)
  → WA: "Would you like to proceed?"
  → step: 4
  → IF high_value: Owner notificado

+7d: Follow-Up Engine Step 4 (REENGAGEMENT)
  → WA: "We're still here..."
  → step: 5

+14d: Follow-Up Engine Step 5 (INCENTIVE)
  → WA: "Special consideration..."
  → step: 6

+14d: Follow-Up Engine Step 6 (CLOSURE)
  → WA: "Thank you, door is open..."
  → state: LOST
  → No más followups
```

### TEST 4.3: Guest pide descuento → Owner Decision (AUTOPILOT Path)

```
DÍA 1: Guest escribe por BANYU: "Can I get 20% off for 7 nights?"
  → BANYU registra mensaje
  → LUMINA analiza: OWNER_DECISION_REQUIRED (pricing_exception)
  → AUTOPILOT crea action en DB
  → Owner recibe WA: "💰 DESCUENTO - Lead: Sarah, 20% off 7 nights"
  → Lead state: PENDING_OWNER

OWNER responde: "APPROVE [action_id]"
  → AUTOPILOT Approve/Reject procesa
  → Action status: approved
  → BANYU envía a guest: "Great news, we can offer..."
  → Lead state: ENGAGED

--- O ---

OWNER responde: "REJECT [action_id]"
  → Action status: rejected
  → BANYU envía a guest: "Unfortunately we can't offer..."
  → Lead continúa en Follow-Up Engine
```

### TEST 4.4: Booking sin pago → Expiración (Payment Protection Path)

```
DÍA 1: Guest reserva via BANYU
  → Booking creado (pending)
  → AUTOPILOT Payment Protection activado

+6h: Check payment → NOT PAID
  → Reminder 1 WA: "Friendly reminder, 18h remaining"

+20h: Check payment → NOT PAID
  → Final Reminder WA: "FINAL reminder, 4h remaining"

+24h: Check payment → NOT PAID
  → Booking status → expired
  → Dates released
  → Alert: "Booking expired"
  → Owner WA: "Booking expired, dates available again"
```

---

## 📋 CHECKLIST DE VALIDACIÓN POR COMPONENTE

### Para cada test, verificar:

**Base de datos:**
- [ ] Registros creados/actualizados correctamente en Supabase
- [ ] tenant_id presente en todos los registros
- [ ] Timestamps correctos
- [ ] Enum values válidos (states, status, channels)

**WhatsApp (ChakraHQ):**
- [ ] Mensaje llega al destinatario
- [ ] Formato correcto (no JSON crudo)
- [ ] Número correcto (guest vs owner)
- [ ] Token de autenticación válido

**n8n:**
- [ ] Workflow ejecuta sin errores
- [ ] Todos los nodos se ejecutan en orden
- [ ] Error handling funciona (no crash en datos inválidos)
- [ ] Ejecución registrada en historial

**AI (GPT-4o / GPT-4o-mini):**
- [ ] Respuesta en JSON válido
- [ ] Clasificación correcta
- [ ] Idioma detectado correctamente
- [ ] Sin alucinaciones (no inventa datos)

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

```
SEMANA 1:
├── DÍA 1: Fase 0 — Arreglos (FIX 0.1, 0.2, 0.3)
├── DÍA 2: Fase 1 — Tests OSIRIS (1.1.1-1.1.12) + LUMINA parcial (1.2.1-1.2.3)
├── DÍA 3: Fase 2 — Tests Follow-Up Engine (2.1.1-2.1.7) + LUMINA completo (2.2.1-2.2.6)
├── DÍA 4: Fase 2 — Tests AUTOPILOT Payment (2.3.1-2.3.6)
└── DÍA 5: Fase 1 — Tests Guest Journey (1.4.1-1.4.6)

SEMANA 2:
├── DÍA 1-2: Construir BANYU (MVP)
├── DÍA 3: Fase 3 — Tests BANYU (3.1.1-3.1.10)
├── DÍA 4: Completar KORA
└── DÍA 5: Fase 3 — Tests KORA (3.2.1-3.2.8)

SEMANA 3:
├── DÍA 1-2: Fase 4 — Tests integración E2E (4.1-4.4)
├── DÍA 3: Bug fixes encontrados en E2E
├── DÍA 4: Re-test
└── DÍA 5: Activar todos en producción
```

---

## 🔧 DATOS DE TEST NECESARIOS

### Teléfonos de test (NO usar números reales de guests):
- **Tu teléfono (owner):** +34 619 794 604
- **Teléfono test guest 1:** [DEFINIR - tu segundo número o número de test]
- **Teléfono test guest 2:** [DEFINIR]

### Bookings de test a crear:
```sql
-- Booking para Guest Journey test (check-in en 7 días)
INSERT INTO bookings (tenant_id, property_id, villa_id, guest_name, guest_phone, guest_email,
  check_in, check_out, status, payment_status, journey_state, total_amount)
VALUES ('c24393db-...', '18711359-...', [villa_id], 'TEST Guest Journey',
  '[test_phone]', 'test@test.com',
  CURRENT_DATE + 7, CURRENT_DATE + 10, 'confirmed', 'paid', 'booking_confirmed', 1500);

-- Booking para Payment Protection test (pending)
INSERT INTO bookings (tenant_id, property_id, villa_id, guest_name, guest_phone,
  check_in, check_out, status, payment_status, total_amount)
VALUES ('c24393db-...', '18711359-...', [villa_id], 'TEST Payment',
  '[test_phone]', CURRENT_DATE + 14, CURRENT_DATE + 17, 'pending', 'pending', 2000);
```

### Leads de test a crear:
```sql
-- Lead para Follow-Up Engine test (due now)
INSERT INTO leads (tenant_id, property_id, name, phone, channel, state,
  followup_step, next_followup_at, stay_nights, villas_count)
VALUES ('c24393db-...', '18711359-...', 'TEST Follow-Up',
  '[test_phone]', 'whatsapp', 'NEW', 1, NOW() - INTERVAL '1 hour', 3, 1);

-- Lead high-value para owner notification test
INSERT INTO leads (tenant_id, property_id, name, phone, channel, state,
  followup_step, next_followup_at, stay_nights, villas_count, requested_discount)
VALUES ('c24393db-...', '18711359-...', 'TEST VIP Lead',
  '[test_phone]', 'whatsapp', 'HOT', 3, NOW() - INTERVAL '1 hour', 8, 3, true);
```

---

## 📝 NOTAS FINALES

1. **CADA test debe ejecutarse y documentar resultado** (PASS/FAIL + screenshot de n8n execution)
2. **LIMPIAR datos de test** después de cada fase (DELETE bookings/leads de test)
3. **Wait nodes:** Cambiar a minutos para testing, restaurar horas en producción
4. **WhatsApp:** Verificar que ChakraHQ no tenga rate limiting que bloquee tests
5. **Los tests de Fase 4 (E2E) son los MÁS importantes** — validan que todo el sistema funciona junto

---

**Documento generado: 06 Febrero 2026**
**Total escenarios: 62 tests (20 Fase 1 + 13 Fase 2 + 18 Fase 3 + 4 Fase 4 + 7 Edge Cases)**
