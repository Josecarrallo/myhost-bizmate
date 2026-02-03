# MY HOST BizMate - Estado del Proyecto
## 26 Enero 2026 - Sesión AUTOPILOT + Multi-Tenant

---

# PARTE 1: CONTEXTO GENERAL

## 1.1 ¿Qué es MY HOST BizMate?

SaaS de automatización para **boutique hotels y villas pequeñas** (2-5 unidades).

**Cliente Piloto:** Izumi Hotel (7 villas, Ubud, Bali)

**Problema que resuelve:**
Los villa owners:
- Trabajan manualmente (WhatsApp, Instagram, Excel)
- Responden tarde a mensajes
- No controlan pagos
- No conocen sus números
- Viven bajo presión constante 24/7

---

## 1.2 IDs Críticos (Izumi Hotel)

```
TENANT_ID:         c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:       18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE:       +62 813 5351 5520
BANYU_PHONE:       +62 813 2576 4867
WHATSAPP_NUMBER_ID: 944855278702577
```

---

## 1.3 Infraestructura

| Servicio | URL |
|----------|-----|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| ChakraHQ | WhatsApp Business API Provider |
| VAPI | Voice AI Provider |

**Supabase API Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

---

# PARTE 2: COMPONENTES AI DEL SISTEMA

| Componente | Función | Estado |
|------------|---------|--------|
| **KORA** | Voice AI (VAPI) - Llamadas telefónicas | ✅ 100% |
| **BANYU** | WhatsApp AI Concierge - Mensajes WA | ✅ 100% |
| **LUMINA** | Lead Intelligence & Sales Orchestrator | 75% (decide pero no ejecuta) |
| **OSIRIS** | Dashboard AI Assistant | 90% |
| **AUTOPILOT** | Automatización proactiva para owners | 🔄 EN PROGRESO |

---

# PARTE 3: AUTOPILOT MODULE (DOCUMENTACIÓN COMPLETA)

## 3.1 ¿Qué es AUTOPILOT?

**AUTOPILOT NO es un agente nuevo ni IA complicada.**

Es un **modo de trabajo automatizado** que hace exactamente lo que el owner ya hace cada día:
- Responder mensajes 24/7
- Controlar pagos
- Gestionar reservas
- No perder disponibilidad
- Saber qué pasó hoy / esta semana / este mes

**El owner solo:**
- Ve lo que pasa
- Introduce datos manuales si hace falta
- Aprueba o ignora acciones sugeridas

---

## 3.2 Estructura de AUTOPILOT (3 Fases)

| Fase | Nombre | Contenido | Estado |
|------|--------|-----------|--------|
| **FASE 1** | AUTOPILOT DAILY | Operación y urgencia diaria | 🔄 EN PROGRESO |
| FASE 2 | AUTOPILOT WEEKLY | Control, prevención, planificación | ⏳ Después |
| FASE 3 | AUTOPILOT MONTHLY | Claridad financiera | ⏳ Después |

**REGLA CRÍTICA:** Implementar FASE 1 completa → Validar → Solo después avanzar.

---

## 3.3 FASE 1 - AUTOPILOT DAILY (Workflows)

### WF-D1: Always-On Inquiries
**Objetivo:** Responder mensajes 24/7, capturar leads, dar sensación de presencia inmediata.

**Trigger:** Webhook POST `/autopilot/inquiry`

**Input:**
```json
{
  "tenant_id": "uuid",
  "property_id": "uuid",
  "channel": "whatsapp | instagram | web",
  "contact_name": "string",
  "contact_phone": "string",
  "message_text": "string",
  "timestamp": "ISO"
}
```

**8 Nodos:**
1. Webhook Trigger
2. Validate & Normalize
3. Lead Upsert (Supabase)
4. Intent Detection (RULE-BASED, NO IA)
5. Auto Reply (Template)
6. Emit Internal Event (si booking_intent)
7. Log Activity
8. Respond 200 OK

**NOTA:** BANYU ya cubre esta función. WF-D1 puede ser complementario.

---

### WF-D2: Payment Protection
**Objetivo:** Evitar reservas sin pagar, reducir presión del owner, liberar fechas automáticamente.

**Trigger:** Webhook POST `/autopilot/payment/start`

**Input:**
```json
{
  "tenant_id": "uuid",
  "property_id": "uuid",
  "booking_id": "uuid",
  "guest_contact": "string",
  "amount": "number",
  "currency": "string"
}
```

**Reglas:**
- HOLD_DURATION = 24 horas
- REMINDER_1 = +6h
- REMINDER_2 = +20h

**10 Nodos:**
1. Webhook Trigger
2. Load Booking (Supabase)
3. Update Booking Status → pending_payment
4. Send Payment Instructions (WhatsApp/Email)
5. Wait Node (6h)
6. Reminder #1 (amable)
7. Wait Node (14h adicionales)
8. Reminder #2 (claro, expiración próxima)
9. Final Check → IF payment_received: confirmed, ELSE: expired + release dates
10. Log Actions

---

### WF-D3: Daily Owner Summary
**Objetivo:** Dar claridad diaria sin que el owner piense.

**Trigger:** CRON Daily (18:00 hora local Bali)

**6 Nodos:**
1. Cron Trigger
2. Query Daily Metrics (Supabase)
3. Build Summary JSON
4. Save daily_summary (Supabase)
5. Notification WhatsApp al owner
6. Log Completion

**Métricas:**
- new_inquiries_today
- pending_payments
- confirmed_bookings_today
- checkins_today
- checkouts_today
- expired_holds_today

---

### WF-D4: Review/Issue Watch (Opcional)
**Objetivo:** Detectar problemas temprano.

**Trigger:** CRON Daily o manual

**4 Nodos:**
1. Trigger
2. Check new issues/reviews
3. IF negative → create alert + notify owner
4. Log

---

## 3.4 Responsabilidades

| Quien | Qué hace |
|-------|----------|
| **Claude AI (n8n)** | Flujos automáticos, lógica de negocio, escribir en Supabase |
| **Claude Code (App)** | Pantallas, formularios, mostrar datos, lanzar aprobaciones |
| **Supabase** | Base de datos única, estados, logs, summaries |

---

## 3.5 Tablas Supabase para AUTOPILOT

| Tabla | Propósito | Estado |
|-------|-----------|--------|
| `daily_summary` | Resúmenes diarios por property | ✅ Existe |
| `autopilot_actions` | Acciones pendientes de aprobación | ✅ Existe |
| `autopilot_alerts` | Alertas del sistema | ✅ Existe |
| `autopilot_activity_log` | Log de actividad | ✅ Existe |
| `whatsapp_conversations` | Tracking mensajes BANYU | ✅ Creada hoy |
| `whatsapp_numbers` | Routing multi-tenant | ✅ Creada hoy |

---

## 3.6 Frontend AUTOPILOT (Claude Code)

### Menú
```
Manual Data Entry  (/manual-entry)
Autopilot          (/autopilot)
  - Daily          (/autopilot/daily)
  - Weekly         (/autopilot/weekly)  [coming soon]
  - Monthly        (/autopilot/monthly) [coming soon]
```

### Manual Data Entry (4 Tabs)
- **Tab A:** Add Lead/Inquiry
- **Tab B:** Add Booking/Hold
- **Tab C:** Update Payment
- **Tab D:** Add Task (Ops)

### Autopilot Daily (Pantalla Principal)
- **A) Today at a glance:** 4-6 KPI cards
- **B) Alerts:** Lista corta (expired holds, pending payment >24h)
- **C) Actions (needs approval):** Lista con [Approve] [Ignore]
- **D) Quick Buttons:** "Add Booking" / "Add Lead"

---

## 3.7 Webhooks n8n para AUTOPILOT

| Endpoint | Propósito |
|----------|-----------|
| `POST /autopilot/inquiry` | WF-D1 - Procesar inquiry entrante |
| `POST /autopilot/payment/start` | WF-D2 - Iniciar control de pago |
| `POST /autopilot/approve` | Ejecutar acción aprobada |
| `POST /autopilot/daily-summary` | Generar resumen manualmente |
| `POST /autopilot/action` | Approve/Reject desde frontend |

---

## 3.8 Principios de Diseño (NO NEGOCIABLES)

- 1 workflow = 1 responsabilidad
- Flujos lineales (7-10 nodos máx.)
- Multi-tenant siempre (tenant_id, property_id)
- Todo estado en Supabase
- Nada de lógica de UI en n8n
- Usar IA solo cuando aporte valor real

---

## 3.9 Copy/Tono para el Owner

**NO usar:** agents, workflows, n8n, AI, technical terms

**SÍ usar:** Autopilot, Today summary, Needs approval, Pending payments, "We handled X for you"

---

# PARTE 4: VILLA OWNER POINT OF VIEW

## 4.1 Actividades Diarias del Owner

**Mañana:**
- Revisar bookings de hoy y próximos (OTA, WhatsApp, Instagram)
- Evitar double bookings
- Revisar check-ins/check-outs
- Responder inquiries (precio, disponibilidad)

**Mediodía:**
- Follow up inquiries sin confirmar
- Enviar instrucciones de pago
- Actualizar calendarios manualmente
- Revisar reviews en OTA

**Tarde/Noche:**
- Asegurar check-ins smooth
- Comunicar con guests via WhatsApp
- Monitorear last-minute bookings
- Responder mensajes fuera de horario

**Problemas principales:**
- Demasiados canales de booking
- Trabajo mayormente manual
- Owner siempre "on-call"

---

## 4.2 Actividades Semanales del Owner

**Operaciones:**
- Revisar stock de amenities
- Inspeccionar condición de villa

**Ventas/Pricing:**
- Revisar precios competidores
- Ajustar rates en OTA
- Unirse/salirse de promociones OTA

**Marketing simple:**
- Postear en Instagram
- Mensajear repeat guests
- Follow up inquiries antiguas

---

## 4.3 Actividades Mensuales del Owner

**Finanzas:**
- Calcular revenue total
- Calcular comisiones OTA
- Revisar cash flow

**Performance:**
- Occupancy rate mensual
- Canales que mejor funcionan
- Comparación con mes anterior

---

## 4.4 Lo que Necesita el Villa Owner

**NO necesita sistemas complejos.** Necesita:
- Un lugar para ver bookings, income, responder guests
- Notificaciones, no reportes largos
- Chat automation simple
- Sincronización fácil de precios/calendario
- Mobile-friendly

---

# PARTE 5: WORKFLOWS n8n ACTIVOS

| ID | Nombre | Función | Estado |
|----|--------|---------|--------|
| NJR1Omi4BqKA9f1P | BANYU WhatsApp Concierge | Responde WhatsApp via AI | ✅ ACTIVO |
| gsMMQrc9T2uZ7LVA | WF-02 KORA-POST-CALL | Procesa llamadas de voz | ✅ ACTIVO |
| HndGXnQAEyaYDKFZ | WF-04 Follow-Up Engine | Secuencias de follow-up | ✅ ACTIVO |
| cQLiQnqR2AHkYOjd | WF-05 Guest Journey | Comunicación post-booking | ✅ ACTIVO |
| EtrQnkgWqqbvRjEB | WF-SP-02 LUMINA | Analiza leads, decide acciones | ✅ ACTIVO |
| Y40PfgjndwMepfaD | WF-D3 Daily Owner Summary v4 | Resumen diario 18:00 → WhatsApp | ✅ ACTIVO |

---

# PARTE 6: WORKFLOWS AUTOPILOT (ESTADO HOY)

| ID | Nombre | Estado | Notas |
|----|--------|--------|-------|
| Y40PfgjndwMepfaD | WF-D3 Daily Owner Summary | ✅ ACTIVO | CRON 18:00 Bali |
| c13WiqN6pmzxSSMH | WF-D3-API Daily Summary Webhook | ⚠️ INACTIVO | Para botón Generate Summary |
| P0EYlLzcCh4UeTzJ | WF-AUTOPILOT-API Actions | ❌ VACÍO | Crear manualmente en n8n |
| zTvQZdDa8so8nysM | WF-D2 Payment Protection | ⚠️ INACTIVO | CRON cada hora |

---

# PARTE 7: ARQUITECTURA MULTI-TENANT

## 7.1 Contexto Meta WhatsApp

- **Límite actual:** 2 números por WABA
- **Meta NO aumenta manualmente** - crece con calidad de mensajes
- **Target realista:** 20 números
- **Diseño preparado para:** 40+ números

## 7.2 Principio Fundamental

```
1 WhatsApp Number = 1 Owner (Tenant) = 1+ Properties
```

## 7.3 Tablas Multi-Tenant Creadas

**whatsapp_numbers (CENTRAL):**
- phone_number_id (routing key de Meta)
- tenant_id
- property_id
- chakra_plugin_id
- bot_config (JSONB)

**Función RPC crítica:**
```sql
get_tenant_by_phone_number_id(phone_number_id)
→ Returns: tenant_id, whatsapp_number_id, property_id, bot_config
```

## 7.4 Implementación Pospuesta

Multi-tenant documentado pero NO implementado en workflows hasta que Meta aumente límite de números.

---

# PARTE 8: PRÓXIMOS PASOS

## 8.1 Inmediato (Esta Sesión)

1. ❌ **NO recrear** workflow vacío (P0EYlLzcCh4UeTzJ)
2. ⏳ Activar workflows en n8n manualmente
3. ⏳ Probar WF-D3 Daily Summary (CRON y webhook)
4. ⏳ Probar WF-D2 Payment Protection

## 8.2 Pendiente Backend

- ❌ WF-D2 Payment Protection con Wait Nodes reales
- ❌ Conectar LUMINA con workflows downstream
- ❌ Modificar BANYU para guardar en whatsapp_conversations

## 8.3 Pendiente Frontend (Claude Code)

- Conectar /autopilot/daily con datos reales de Supabase
- Implementar botones Approve/Reject funcionales
- Conectar Manual Data Entry con webhooks n8n

---

# PARTE 9: DOCUMENTOS DE REFERENCIA

| Documento | Contenido |
|-----------|-----------|
| AUTOPILOT_MODULE_-_INTRODUCTION.txt | Concepto general |
| AUTOPILOT_MODULE_-_I_CLAUDE_AI_AND_CLAUDE_CODE.txt | Responsabilidades base |
| AUTOPILOT_MODULE_-_II_CLAUDE_CODE.txt | Especificaciones frontend |
| AUTOPILOT_MODULE_-_III_CLAUDE_AI.txt | Arquitectura n8n |
| AUTOPILOT_MODULE_-_IV_CLAUDE_AI.txt | Detalle técnico nodo a nodo |
| AUTOPILOT_MODULE_-_Villa_Owner_Point_of_View.pdf | Perspectiva del usuario final |

---

# FIN DEL DOCUMENTO
## Este documento contiene TODO el contexto para continuar AUTOPILOT
