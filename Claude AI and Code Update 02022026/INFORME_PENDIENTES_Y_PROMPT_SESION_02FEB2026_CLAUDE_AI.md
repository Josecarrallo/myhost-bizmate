# MY HOST BizMate — INFORME DE PENDIENTES + PROMPT NUEVA SESIÓN
## Fecha: 2 Febrero 2026

---

# PARTE 1: INFORME COMPLETO DE PENDIENTES

## ESTADO ACTUAL DEL SISTEMA (verificado 2 Feb 2026)

### Base de Datos (Supabase)
| Tabla | Registros | Estado |
|-------|-----------|--------|
| users (owners) | 2 | ✅ |
| properties | 2 | ✅ Limpio (sin duplicados) |
| villas | 9 | ✅ NUEVO - 8 Izumi + 1 Nismara |
| bookings | 206 | ✅ Todos con villa_id y tenant_id |
| payments | 63 | ✅ |
| leads | 9 | ✅ |
| autopilot_actions | 9 | ✅ |
| generated_reports | 0 | ⏳ Pendiente implementar |

### Jerarquía de Datos (migración completada)
```
Owner (users) → Property (properties) → Villa (villas) → Booking (bookings)
```

### Owners
| Owner | Tenant ID | Bookings | Revenue |
|-------|-----------|----------|---------|
| Jose Carrallo | c24393db-d318-4d75-8bbf-0fa240b9c1db | 165 | $538,140 USD |
| Gita Pradnyana | 1f32d384-4018-46a9-a6f9-058217e6924a | 41 | IDR 139,909,985 |

### Properties
| Property | ID | Currency | Villas | auto_reports |
|----------|----|----------|--------|--------------|
| Izumi Hotel & Villas | 18711359-1378-4d12-9ea6-fb31c0b1bac2 | USD | 8 | false |
| Nismara Uma Villa | 3551cd18-af6b-48c2-85ba-4c5dc0074892 | IDR | 1 | true |

---

## 🔴 PRIORIDAD 1 — CRÍTICO (bloquea funcionalidad core)

### P1.1: LUMINA → Decision Router → AUTOPILOT (routing roto)
- **Problema:** El Decision Router conecta las 5 rutas al nodo "Respond" en vez de ejecutar workflows correspondientes
- **Impacto:** Cuando LUMINA detecta OWNER_DECISION_REQUIRED, no crea registro en autopilot_actions ni notifica al owner
- **Workflow:** WF-SP-02 LUMINA (EtrQnkgWqqbvRjEB)
- **Lo que falta (PASO 3 nunca implementado):**
  1. Extract Action Details (del output de LUMINA AI)
  2. Create Autopilot Action (INSERT en Supabase)
  3. Notify Owner (WhatsApp via ChakraHQ)
  4. Update Lead Status (state → PENDING_OWNER)
  5. Respond al caller
- **Bug adicional:** WF-03 Lead Handler NO envía `last_message` a LUMINA, por lo que LUMINA no tiene el mensaje real para analizar
- **Tiempo estimado:** 2-3h

### P1.2: Follow-Up Engine — No envía notificación al owner
- **Workflow:** WF-02 Follow-Up Engine (38dOdJ81bIg8d6qS) — INACTIVO
- **Problema:** El nodo "Build Owner Message" existe pero NO está conectado a ningún nodo de envío WhatsApp
- **Validación mercado:** Follow-ups = pain point #1 de villa owners
- **Flujo correcto (según doc):**
  1. CRON trigger → Load leads con next_followup_at vencido
  2. Generar mensaje personalizado
  3. Enviar AL OWNER para aprobación (modo SAFE) o via BANYU (modo AUTOPILOT)
  4. Actualizar followup_step y next_followup_at
- **Tiempo estimado:** 2-3h

### P1.3: WF-03 Lead Handler — next_followup_at no se actualiza
- **Workflow:** WF-03-LEAD-HANDLER (OZmq7E9wzODJrzej)
- **Problema:** El nodo UPDATE no incluye `next_followup_at` → leads quedan con null → Follow-Up Engine no los procesa
- **Fix:** Añadir `"next_followup_at": "{{ new Date(Date.now() + 2*60*60*1000).toISOString() }}"` al UPDATE
- **Tiempo estimado:** 15 min

---

## 🟡 PRIORIDAD 2 — ALTA (genera valor significativo)

### P2.1: BUSINESS REPORTS — Implementación Claude Code
- **Spec:** BUSINESS_REPORTS_SPEC.md v2 ✅ LISTO
- **Contenido:** SQL queries completos, estructura de 5 páginas con villa breakdown, multi-currency, testing data
- **Acción:** Entregar spec + PDF referencia a Claude Code para Phase 1 (SQL engine + HTML generator)
- **Tablas involucradas:** bookings, villas, properties, generated_reports
- **Tiempo estimado:** 4-6h (Claude Code)

### P2.2: AUTOPILOT Fases 2-3 — Weekly/Monthly reports
- **Fase 1:** ✅ Completada (6 escenarios probados: payment_verification, custom_plan, cancellation approve/reject)
- **Fase 2:** Weekly report CRON → pendiente
- **Fase 3:** Monthly report CRON → pendiente
- **Workflows existentes:**
  - Daily Summary CRON (1V9GYFmjXISwXTIn) ✅ Active
  - Daily Summary API (2wVP7lYVQ9NZfkxz) ✅ Active
  - Payment Protection (9VzPX1MCghPKkxFS) ✅ Active
  - Actions Approve/Reject (GuHQkHb21GlowIZl) ✅ Funciona
- **Tiempo estimado:** 30-45 min

### P2.3: KORA Voice AI — Testing end-to-end
- **Workflow:** WF-02 KORA-POST-CALL (gsMMQrc9T2uZ7LVA)
- **VAPI ID:** ae9ea22a-fc9a-49ba-b5b8-900ed69b7615
- **Pruebas pendientes:**
  - B1: Llamada información general
  - B2: Booking completo por teléfono
  - B3: Handoff a humano
  - B4: Mejoras de voz (idioma, tono)
- **Tiempo estimado:** 1-2h

---

## 🔵 PRIORIDAD 3 — MEDIA (mejora experiencia)

### P3.1: OSIRIS Dashboard — Frontend Claude Code
- **Backend:** ✅ RPC functions en Supabase funcionando
- **Workflow:** WF-OSIRIS-MVP-v2 (06F2a8dcu0G3D85g) — INACTIVO
- **Problema detectado:** Body JSON truncado en nodo Claude API
- **Pendiente:** Conectar frontend con Claude Code
- **Tiempo estimado:** 4-6h

### P3.2: Content Generator — Workflows sin conectar
- **Workflows:**
  - Content Creator (8S0LKqyc1r1oqLyH)
  - Social Publishing (7lqwefjJaJDKui7F)
- **Estado:** Esqueletos construidos, sin conexiones al sistema principal
- **Tiempo estimado:** 6-10h

### P3.3: Limpiar workflows TEMP
```
rBqa7uXRJiHT89CN - TEMP - Notify Owner Approved
9nLsltoCjjjkdPyz - TEMP - Nodos AUTOPILOT para LUMINA
euiwzyMod6pMExTF - TEMP - Nodos payment_verification
2AGpKbsUMg68FF1V - TEMP - Nodos custom_plan y cancellation
```
- **Tiempo estimado:** 15 min

---

## ⚪ PRIORIDAD 4 — BAJA (nice-to-have)

| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Landing Page | Web para captura de leads → webhook → WF-03 | 3-4h |
| ChakraHQ Coexistence | Integrar número owner con WhatsApp Business | 2-3h |
| Instagram/TikTok | Captura de leads desde redes sociales | 4-6h |
| Guest Journey mejoras | Más touchpoints pre/post stay | 2-4h |

---

## RESUMEN DE TIEMPOS

| Prioridad | Horas estimadas |
|-----------|-----------------|
| 🔴 Crítico (P1.1-P1.3) | 4-6h |
| 🟡 Alta (P2.1-P2.3) | 6-9h |
| 🔵 Media (P3.1-P3.3) | 10-16h |
| ⚪ Baja (P4) | 11-17h |
| **TOTAL** | **~31-48h** |

---
---
---

# PARTE 2: PROMPT INICIO NUEVA SESIÓN

Copiar TODO lo siguiente como primer mensaje en nueva conversación:

---

```
# MY HOST BizMate — Sesión de Trabajo (Febrero 2026)

## CONTEXTO
SaaS automatización boutique hotels en Bali. Producto: MY HOST BizMate.
AUTOPILOT = interfaz para owners poco técnicos. MY HOST BizMate = cerebro + motor.

## ARQUITECTURA
```
LEAD CAPTURE: WhatsApp(BANYU) + KORA(VAPI) + Landing + Instagram
       ↓
WF-03 Lead Handler → LUMINA Intelligence
       ↓
┌──────┴──────┬──────────────┬───────────────┐
Auto Reply  AUTOPILOT     WF-02 Follow-Up
             Actions        Engine
       ↓
    WF-D2 Payment Protection
       ↓
WF-05 Guest Journey    Content Generator    OSIRIS Dashboard
```

Jerarquía DB: Owner (users) → Property (properties) → Villa (villas) → Booking (bookings)

## IDs CRÍTICOS
- TENANT (Jose): c24393db-d318-4d75-8bbf-0fa240b9c1db
- PROPERTY (Izumi): 18711359-1378-4d12-9ea6-fb31c0b1bac2
- TENANT (Gita): 1f32d384-4018-46a9-a6f9-058217e6924a
- PROPERTY (Nismara): 3551cd18-af6b-48c2-85ba-4c5dc0074892
- OWNER_PHONE: +62 813 5351 5520
- BANYU_WA: +62 813 2576 4867
- VAPI_ID: ae9ea22a-fc9a-49ba-b5b8-900ed69b7615

## INFRAESTRUCTURA
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co
- ChakraHQ: WhatsApp messaging API

## WORKFLOWS PRINCIPALES
| ID | Nombre | Estado |
|----|--------|--------|
| NJR1Omi4BqKA9f1P | BANYU WhatsApp Concierge | ✅ Active |
| gsMMQrc9T2uZ7LVA | WF-02 KORA-POST-CALL | ✅ Active |
| OZmq7E9wzODJrzej | WF-03-LEAD-HANDLER | ✅ Active |
| EtrQnkgWqqbvRjEB | WF-SP-02 LUMINA | ✅ Active |
| p3ukMWIbKN4bf5Gz | WF-04-BOOKING-NOTIFICATIONS | ✅ Active |
| HndGXnQAEyaYDKFZ | WF-04 Follow-Up Engine | ⚠️ Inactive |
| cQLiQnqR2AHkYOjd | WF-05 Guest Journey | ✅ Active |
| 1V9GYFmjXISwXTIn | AUTOPILOT - Daily Summary CRON | ✅ Active |
| 2wVP7lYVQ9NZfkxz | AUTOPILOT - Daily Summary API | ✅ Active |
| 9VzPX1MCghPKkxFS | AUTOPILOT - Payment Protection | ✅ Active |
| GuHQkHb21GlowIZl | WF-AUTOPILOT Actions v3 | ✅ Funciona |
| 38dOdJ81bIg8d6qS | WF-02 Follow-Up Engine | ⚠️ Inactive |

## BASE DE DATOS ACTUAL
- 2 owners, 2 properties, 9 villas, 206 bookings, 63 payments, 9 leads, 9 autopilot_actions
- Izumi Hotel: 8 villas, 165 bookings, $538,140 USD
- Nismara Uma: 1 villa, 41 bookings, IDR 139,909,985
- Tabla villas: id, property_id, name, slug, description, base_price, currency, max_guests, bedrooms, bathrooms, amenities, photos, status
- bookings.villa_id (FK → villas.id) — todos los 206 bookings tienen villa_id

## QUÉ FUNCIONA ✅
- BANYU → WhatsApp booking + info ✅
- KORA → Voice booking + info ✅ (pendiente más testing)
- WF-03 Lead Handler → recibe de ambos canales ✅
- LUMINA → analiza y decide ✅ (pero routing roto)
- AUTOPILOT Fase 1 → 6 escenarios probados ✅ (approve/reject payment_verification, custom_plan, cancellation)
- Daily Summary CRON ✅
- Guest Journey ✅ (check_in_day probado)
- OSIRIS get_summary_report ✅ (backend)
- DB hierarchy migration ✅ (Owner→Property→Villa→Booking)

## PENDIENTES POR PRIORIDAD

### 🔴 CRÍTICO
1. **LUMINA routing roto** — Decision Router conecta todo a "Respond". PASO 3 (crear action + notificar owner) nunca implementado. WF-03 no envía last_message a LUMINA. (WF: EtrQnkgWqqbvRjEB, OZmq7E9wzODJrzej)
2. **Follow-Up Engine** — Nodo "Build Owner Message" no conectado a envío WhatsApp. Workflow inactivo. (WF: 38dOdJ81bIg8d6qS)
3. **WF-03 next_followup_at** — UPDATE no incluye campo, leads quedan null. Fix: 15 min. (WF: OZmq7E9wzODJrzej)

### 🟡 ALTA
4. **BUSINESS REPORTS** — BUSINESS_REPORTS_SPEC.md v2 listo. Entregar a Claude Code para implementación (SQL engine + HTML generator con villa breakdown).
5. **AUTOPILOT Fases 2-3** — Weekly/monthly report CRONs. 30-45 min.
6. **KORA testing** — Pruebas B1-B4 end-to-end con llamadas reales.

### 🔵 MEDIA
7. **OSIRIS frontend** — Backend listo, falta conectar Claude Code.
8. **Content Generator** — Workflows 8S0LKqyc1r1oqLyH, 7lqwefjJaJDKui7F sin conectar.
9. **Limpiar TEMP workflows** — 4 workflows temporales a eliminar.

### ⚪ BAJA
10. Landing Page, ChakraHQ Coexistence, Instagram/TikTok, Guest Journey mejoras.

## REGLAS DE TRABAJO
1. No inventar — verificar siempre en n8n/Supabase
2. Mostrar estado ACTUAL primero antes de cambios
3. Cambios exactos con código completo
4. No asumir — preguntar si hay duda
5. Verificar API antes de responder
6. Sin charla innecesaria
7. Admitir errores inmediatamente
8. Una tarea a la vez
9. Código completo, nunca parcial
10. Esperar OK antes de continuar

## COMANDOS DE PRUEBA (PowerShell)
```powershell
# AUTOPILOT APPROVE
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body '{"action": "approve", "action_id": "ACTION_ID"}'

# AUTOPILOT REJECT
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body '{"action": "reject", "action_id": "ACTION_ID", "reason": "Motivo"}'

# DAILY SUMMARY
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/summary" -Method POST -ContentType "application/json" -Body '{"tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db", "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2", "period": "daily"}'
```

## EMPEZAMOS
Quiero trabajar en los pendientes según prioridad. Revisa n8n y Supabase antes de tocar nada.
```

---

# FIN DEL DOCUMENTO
