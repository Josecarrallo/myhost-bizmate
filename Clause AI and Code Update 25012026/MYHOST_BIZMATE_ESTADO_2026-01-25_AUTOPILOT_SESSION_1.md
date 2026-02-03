# MY HOST BizMate - Estado del Proyecto
## Sesión AUTOPILOT - 25 Enero 2026

---

## 1. CONTEXTO GENERAL

**Producto:** SaaS automatización para boutique hotels
**Cliente Piloto:** Izumi Hotel (7 villas, Ubud, Bali)
**Fase Actual:** AUTOPILOT Module - Phase 1 DAILY

---

## 2. IDs CRÍTICOS

```
TENANT_ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
OWNER_PHONE:  +62 813 5351 5520 (número real del owner/piloto)
BANYU_PHONE:  +62 813 2576 4867 (número conectado a ChakraHQ)
```

---

## 3. INFRAESTRUCTURA

| Servicio | URL |
|----------|-----|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| ChakraHQ | WhatsApp Business API Provider |

**Supabase API Key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

---

## 4. COMPONENTES AI DEL SISTEMA

| Componente | Función | Estado |
|------------|---------|--------|
| **KORA** | Voice AI (VAPI) | ✅ 100% |
| **BANYU** | WhatsApp AI Concierge | ✅ 100% |
| **LUMINA** | Lead Intelligence & Sales Orchestrator | 75% |
| **OSIRIS** | Dashboard AI Assistant | 90% |

---

## 5. WORKFLOWS n8n ACTIVOS

| ID | Nombre | Función |
|----|--------|---------|
| NJR1Omi4BqKA9f1P | BANYU WhatsApp Concierge | Responde WhatsApp via AI |
| gsMMQrc9T2uZ7LVA | WF-02 KORA-POST-CALL | Procesa llamadas de voz |
| OZmq7E9wzODJrzej | WF-03-LEAD-HANDLER | Procesa leads entrantes |
| EtrQnkgWqqbvRjEB | WF-SP-02 LUMINA | Analiza leads, decide acciones |
| p3ukMWIbKN4bf5Gz | WF-04-BOOKING-NOTIFICATIONS | Notifica bookings confirmados |
| HndGXnQAEyaYDKFZ | WF-04 Follow-Up Engine | Secuencias de follow-up |
| cQLiQnqR2AHkYOjd | WF-05 Guest Journey | Comunicación post-booking |
| v8icxH6TOdCKO823 | OSIRIS AI Assistant | Asistente dashboard |
| **Y40PfgjndwMepfaD** | **WF-D3 Daily Owner Summary v4** | **✅ NUEVO - Resumen diario** |

---

## 6. AUTOPILOT MODULE - ESTADO

### 6.1 Concepto AUTOPILOT

AUTOPILOT no es un agente nuevo. Es un **modo de uso** para villa owners no técnicos que:
- Gestionan todo por WhatsApp/Instagram
- Trabajan de forma manual
- No quieren aprender herramientas nuevas

**Objetivo:** Automatizar exactamente lo que el owner hace cada día, sin añadir complejidad.

### 6.2 Fases AUTOPILOT

| Fase | Descripción | Estado |
|------|-------------|--------|
| **PHASE 1 - DAILY** | Respuestas 24/7, control pagos, resumen diario | 🔄 EN PROGRESO |
| PHASE 2 - WEEKLY | Análisis semanal | ⏳ Pendiente |
| PHASE 3 - MONTHLY | Análisis mensual | ⏳ Pendiente |

### 6.3 AUTOPILOT DAILY - Workflows

| Workflow | Descripción | Estado |
|----------|-------------|--------|
| **WF-D3** Daily Owner Summary | Resumen diario 18:00 → WhatsApp owner | ✅ COMPLETADO |
| **WF-D1** Always-On Inquiries | Auto-respuesta 24/7 | ❌ NO NECESARIO (BANYU lo hace) |
| **WF-D2** Payment Protection | Control pagos, reminders, expiración | ⏳ SIGUIENTE |
| **WF-D4** Review Watch | Detectar issues/reviews | ⏳ Opcional |

---

## 7. LO QUE SE HIZO HOY (25 Enero 2026)

### 7.1 Tablas Supabase Creadas

```sql
-- daily_summary: Métricas diarias por property
-- autopilot_actions: Acciones pendientes de aprobación
-- autopilot_activity_log: Log de actividad autopilot
```

### 7.2 Funciones RPC Creadas

```sql
-- generate_daily_summary(p_tenant_id, p_property_id, p_date)
-- get_daily_summary(p_tenant_id, p_property_id, p_date)
-- log_autopilot_activity(p_tenant_id, p_property_id, p_activity_type, p_workflow_id, p_details)
-- get_owner_phone(p_tenant_id) → Bypasa RLS para obtener teléfono
```

### 7.3 WF-D3 Daily Owner Summary - COMPLETADO ✅

**Workflow ID:** Y40PfgjndwMepfaD

**Estructura (5 nodos):**
```
CRON 18:00 Bali → Set Config → Get Owner Phone → Generate Summary → Send WhatsApp
```

**Mensaje que envía:**
```
📊 *Daily Summary - Izumi Hotel*

📅 2026-01-25

📥 New inquiries: 6
💳 Pending payments: 0
✅ Confirmed today: 1
🛬 Check-ins: 0
🛫 Check-outs: 1
⏰ Expired: 0

✨ Autopilot working!
```

### 7.4 Actualización Base de Datos

```sql
-- Teléfono del owner actualizado en users table
UPDATE users SET phone = '34619794604' WHERE id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
```

---

## 8. DESCUBRIMIENTO CRÍTICO DE LA SESIÓN

### 8.1 El Problema Real

El owner recibe **10-15 mensajes WhatsApp/día** en su número personal (+62 813 5351 5520).

**Situación actual:**
```
Cliente → +62 813 5351 5520 (owner) → Owner responde manualmente → Pierde horas
```

**BANYU está en otro número:**
```
Cliente → +62 813 2576 4867 (BANYU) → BANYU responde automático → ✅
```

Los clientes NO escriben al número de BANYU, escriben al número personal del owner.

### 8.2 La Solución

**Añadir el número del owner a ChakraHQ (Coexistence)**

```
+62 813 5351 5520 (owner) → ChakraHQ → BANYU responde automático
```

**Resultado:**
- Cliente escribe al número del owner
- ChakraHQ intercepta el mensaje
- BANYU responde automáticamente (AI)
- Owner sigue viendo la conversación en su teléfono
- Lead se guarda en Supabase
- Owner deja de contestar manualmente

### 8.3 Costo Estimado

ChakraHQ permite múltiples números:
- Plan Growth incluye hasta 12 números
- Números adicionales: ~$3/mes cada uno

### 8.4 Información ChakraHQ Coexistence

- Permite usar el mismo número en WhatsApp Business App + Cloud API
- El owner sigue usando su WhatsApp normal
- BANYU puede responder automáticamente via API
- Disponible globalmente (excepto Nigeria y Sudáfrica)

---

## 9. DECISIONES PENDIENTES

### 9.1 Inmediato (Para el Owner)

1. **Añadir +62 813 5351 5520 a ChakraHQ con Coexistence**
   - Verificar pasos en dashboard ChakraHQ
   - Determinar si hay costo adicional según plan actual

### 9.2 Desarrollo (n8n)

1. **WF-D2 Payment Protection** - Siguiente a implementar
   - Webhook /autopilot/payment/start
   - Control de pagos: hold 24h, reminders, expiración

2. **WF-D1 Always-On Inquiries** - NO NECESARIO
   - BANYU ya cubre esta función
   - Cuando el número del owner esté en ChakraHQ, BANYU responderá

---

## 10. WORKFLOWS DEPRECADOS (BORRAR)

| ID | Nombre | Razón |
|----|--------|-------|
| tulbElRR5XVwvnuB | WF-D3 Daily Owner Summary - AUTOPILOT | Versión obsoleta |
| 4Oi9XibwXhj3rydx | WF-D3 Daily Owner Summary - AUTOPILOT v2 | Versión obsoleta |
| b1cucgYr82R90FWB | WF-D3 Daily Owner Summary - AUTOPILOT v3 | RLS issue |

**Mantener solo:** Y40PfgjndwMepfaD (v4)

---

## 11. ARCHIVOS DE REFERENCIA

| Archivo | Contenido |
|---------|-----------|
| AUTOPILOT_MODULE_-_INTRODUCTION.txt | Concepto general AUTOPILOT |
| AUTOPILOT_MODULE_-_I_CLAUDE_AI_AND_CLAUDE_CODE.txt | Especificaciones base |
| AUTOPILOT_MODULE_-_II_CLAUDE_CODE.txt | Especificaciones app (Claude Code) |
| AUTOPILOT_MODULE_-_III_CLAUDE_AI.txt | Arquitectura n8n |
| AUTOPILOT_MODULE_-_IV_CLAUDE_AI.txt | Detalle técnico nodos |

---

## 12. PRÓXIMOS PASOS (ORDEN PRIORITARIO)

1. **ACCIÓN OWNER:** Añadir número +62 813 5351 5520 a ChakraHQ
2. **ACCIÓN OWNER:** Verificar que BANYU responde en ese número
3. **DESARROLLO:** Implementar WF-D2 Payment Protection
4. **DESARROLLO:** Conectar LUMINA con workflows downstream
5. **LIMPIEZA:** Borrar workflows obsoletos en n8n

---

## 13. MÉTRICAS ACTUALES (Supabase)

| Tabla | Registros |
|-------|-----------|
| leads | 20 |
| bookings | 180 |
| users | 1 |
| properties | 14 |

---
