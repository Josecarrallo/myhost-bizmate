# MY HOST BIZMATE - DOCUMENTO MAESTRO
## Estado del Proyecto - 27 Enero 2026

---

## 📋 ÍNDICE

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Arquitectura de Agentes AI](#2-arquitectura-de-agentes-ai)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Workflows n8n - Estado Actual](#4-workflows-n8n---estado-actual)
5. [Base de Datos Supabase](#5-base-de-datos-supabase)
6. [Módulo AUTOPILOT - Estado Detallado](#6-módulo-autopilot---estado-detallado)
7. [Frontend OSIRIS](#7-frontend-osiris)
8. [Tareas Pendientes](#8-tareas-pendientes)
9. [Limitaciones Conocidas](#9-limitaciones-conocidas)
10. [Roadmap y Próximos Pasos](#10-roadmap-y-próximos-pasos)

---

## 1. VISIÓN GENERAL DEL PROYECTO

### ¿Qué es MY HOST BizMate?

**MY HOST BizMate** es una plataforma SaaS multi-tenant de automatización integral para boutique hotels y villas en Bali. El objetivo es **eliminar completamente la intervención manual** en operaciones rutinarias mientras se mantiene un servicio personalizado de alta calidad.

### Propietario y Piloto

| Rol | Detalles |
|-----|----------|
| **Fundador** | Jose (ZENTARA LIVING) |
| **Hotel Piloto** | Izumi Hotel - 7 villas en Ubud, Bali |
| **Tenant ID** | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| **Property ID** | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| **Timezone** | Asia/Makassar (WITA, UTC+8) |

### Filosofía de Diseño

- ✅ **Automatización por defecto:** El sistema actúa sin intervención humana
- ✅ **Supervisión inteligente:** El owner ve todo y puede intervenir cuando quiera
- ✅ **Transparencia total:** Cada acción queda registrada y auditable
- ✅ **Experiencia de huésped premium:** Respuestas instantáneas 24/7

---

## 2. ARQUITECTURA DE AGENTES AI

```
┌─────────────────────────────────────────────────────────────────┐
│                      MY HOST BIZMATE                             │
│                   AI OPERATING SYSTEM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   KORA   │  │  BANYU   │  │  LUMINA  │  │ AUTOPILOT│       │
│  │ Voice AI │  │WhatsApp  │  │  Lead    │  │Proactive │       │
│  │          │  │   AI     │  │Intelligence│ │Automation│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│       │             │             │              │              │
│       └─────────────┴─────────────┴──────────────┘              │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    OSIRIS DASHBOARD                       │  │
│  │              (Business Intelligence UI)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     SUPABASE DB                           │  │
│  │           (PostgreSQL + Real-time + Auth)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Agentes y Estado

| Agente | Función Principal | Canal | Estado | ID Workflow |
|--------|-------------------|-------|--------|-------------|
| **KORA** | Voice AI - Llamadas telefónicas | VAPI | ✅ Operativo | `gsMMQrc9T2uZ7LVA` |
| **BANYU** | WhatsApp AI - Mensajería 24/7 | ChakraHQ | ✅ Operativo | `NJR1Omi4BqKA9f1P` |
| **LUMINA** | Lead Intelligence & Routing | n8n | ⚠️ Decisión OK / Downstream pendiente | `EtrQnkgWqqbvRjEB` |
| **OSIRIS** | Business Intelligence Dashboard | React | ✅ Frontend operativo | - |
| **AUTOPILOT** | Automatización proactiva | n8n | 🔧 En desarrollo (75%) | Múltiples |

---

## 3. STACK TECNOLÓGICO

### Infraestructura

| Componente | Tecnología | URL/Endpoint | Notas |
|------------|------------|--------------|-------|
| **Workflows** | n8n (self-hosted) | https://n8n-production-bb2d.up.railway.app | Railway deployment |
| **Base de Datos** | Supabase (PostgreSQL) | https://jjpscimtxrudtepzwhag.supabase.co | Multi-tenant con RLS |
| **Voice AI** | VAPI | Integrado con KORA | Llamadas telefónicas |
| **WhatsApp** | ChakraHQ | Plugin ID: `2e45a0bd-8600-41b4-ac92-599d59d6221c` | Meta Business API |
| **Frontend** | React 18 + Vite | localhost:5173 (dev) | Tailwind CSS |
| **AI Models** | Claude 3.5 Sonnet | Anthropic API | Para BANYU, LUMINA, OSIRIS |

### APIs Externas

| Servicio | Propósito | Credenciales |
|----------|-----------|--------------|
| **Anthropic Claude** | AI conversacional | API Key en n8n credentials |
| **Meta WhatsApp** | Mensajería WhatsApp | Phone ID: `944855278702577` |
| **SendGrid** | Email notifications | API Key configurado |
| **VAPI** | Voice AI calls | Integrado con ChakraHQ |

---

## 4. WORKFLOWS N8N - ESTADO ACTUAL

### Workflows en Producción (ACTIVE = TRUE)

| ID | Nombre | Trigger | Función | Estado |
|----|--------|---------|---------|--------|
| `Y40PfgjndwMepfaD` | WF-D3 Daily Owner Summary v4 | CRON 18:00 WITA | Resumen diario WhatsApp al owner | ✅ 100% |
| `2wVP7lYVQ9NZfkxz` | AUTOPILOT - Daily Summary API | Webhook | API para Dashboard OSIRIS | ✅ 100% |
| `o471FL9bpMewcJIr` | WF-D2 Payment Protection | Webhook | Seguimiento pagos (reminders) | ✅ 90% |
| `NJR1Omi4BqKA9f1P` | BANYU WhatsApp AI | Webhook | Respuestas WhatsApp inteligentes | ✅ 100% |
| `gsMMQrc9T2uZ7LVA` | KORA Voice AI | VAPI | Llamadas telefónicas AI | ✅ 100% |
| `cQLiQnqR2AHkYOjd` | WF-05 Guest Journey | Múltiple | Journey completo del huésped | ✅ 100% |
| `EtrQnkgWqqbvRjEB` | WF-SP-02 LUMINA | Webhook | Análisis inteligente de leads | ⚠️ 80% |
| `E6vXYR5Xm3SYVEnC` | WF-AUTOPILOT Actions v2 | Webhook | Procesa Approve/Reject | ⚠️ No probado |
| `1V9GYFmjXISwXTIn` | AUTOPILOT - Daily Summary CRON | CRON diario | Trigger automático resumen | ✅ 100% |

### Endpoints Activos

```
POST /webhook/banyu/incoming          → BANYU (WhatsApp messages)
POST /webhook/kora/post-call          → KORA (Post-call processing)
POST /webhook/lumina/analyze          → LUMINA (Lead analysis)
POST /webhook/autopilot/payment/start → WF-D2 (Payment Protection)
POST /webhook/autopilot/daily-summary → Daily Summary API
POST /webhook/autopilot/action        → Approve/Reject Actions
```

### Workflows Pendientes de Implementar

| Workflow | Propósito | Prioridad |
|----------|-----------|-----------|
| WF-D2 Auto-Trigger | CRON que activa WF-D2 automáticamente | 🔴 ALTA |
| WF-LUMINA Downstream | Conectar decisiones LUMINA con acciones | 🟡 MEDIA |
| WF-D2 Special Cases | Crear autopilot_actions en casos especiales | 🔴 ALTA |

---

## 5. BASE DE DATOS SUPABASE

### Tablas Principales

| Tabla | Registros | Función | RLS Activo |
|-------|-----------|---------|------------|
| `tenants` | 1 | Multi-tenancy | ✅ |
| `properties` | 14 | Propiedades (villas/rooms) | ✅ |
| `bookings` | 164 | Reservas | ✅ |
| `leads` | 23 | Leads/Contactos | ✅ |
| `guests` | 16 | Huéspedes | ✅ |
| `payments` | 18 | Pagos | ✅ |
| `whatsapp_messages` | 38 | Mensajes WhatsApp | ✅ |
| `lead_events` | 103 | Eventos de leads | ✅ |
| `audit_logs` | 154 | Auditoría general | ✅ |

### Tablas AUTOPILOT

| Tabla | Función | Campos Clave |
|-------|---------|--------------|
| `daily_summary` | Resúmenes diarios generados | `metrics JSONB`, `alerts JSONB` |
| `autopilot_actions` | Acciones pendientes de aprobación | `action_type`, `status`, `details JSONB` |
| `autopilot_activity_log` | Log de actividades del sistema | `activity_type`, `workflow_id`, `details JSONB` |
| `autopilot_alerts` | Alertas del sistema | `alert_type`, `severity`, `status` |

### Funciones RPC Disponibles

```sql
-- Resumen diario para dashboard
get_daily_summary(p_tenant_id UUID) → JSONB

-- Pendiente de implementar:
get_weekly_summary(p_tenant_id UUID) → JSONB
get_monthly_summary(p_tenant_id UUID) → JSONB
```

### Estados de Bookings

```sql
status:
  - inquiry          → Primera consulta
  - confirmed        → Confirmado (pago recibido)
  - pending_payment  → Esperando pago (hold activo)
  - provisional      → Reserva provisional
  - checked_in       → Guest ya llegó
  - checked_out      → Guest ya se fue
  - cancelled        → Cancelado
  - expired          → Hold expiró (no pagó)

payment_status:
  - pending          → Esperando pago
  - partial          → Pago parcial recibido
  - paid             → Pagado completo
  - refunded         → Reembolsado
  - expired          → Pago expiró
```

---

## 6. MÓDULO AUTOPILOT - ESTADO DETALLADO

### 6.1 Visión del Módulo

AUTOPILOT es el cerebro proactivo del sistema. Toma decisiones y ejecuta acciones automáticamente, solo consultando al owner en casos especiales.

**Flujo típico:**
```
Sistema detecta situación → Evalúa si puede decidir solo
    ├─ SÍ → Ejecuta acción + registra en log
    └─ NO → Crea autopilot_action → Owner ve en Dashboard → Approve/Reject
```

### 6.2 Componentes Implementados

#### A) WF-D3 Daily Owner Summary

| Propiedad | Valor |
|-----------|-------|
| **Estado** | ✅ 100% COMPLETO Y FUNCIONAL |
| **ID Workflow** | `Y40PfgjndwMepfaD` |
| **Trigger** | CRON 18:00 WITA diario |
| **Función** | Genera resumen del día y envía WhatsApp al owner |

**Métricas incluidas:**
- Check-ins hoy
- Check-outs hoy
- Pagos pendientes
- Nuevas consultas
- Reservas confirmadas
- Holds expirados

**Output:**
- Guarda en tabla `daily_summary`
- Envía WhatsApp al owner (+34619794604)
- Actualiza dashboard OSIRIS

---

#### B) WF-D2 Payment Protection

| Propiedad | Valor |
|-----------|-------|
| **Estado** | ✅ FUNCIONAL (falta trigger automático) |
| **ID Workflow** | `o471FL9bpMewcJIr` |
| **Trigger** | Webhook POST `/autopilot/payment/start` |
| **Función** | Seguimiento de pagos con 3 reminders |

**Flujo completo:**
```
Webhook recibe booking_id
  ↓
Actualiza booking.status = 'pending_payment'
Actualiza booking.payment_expiry_at = NOW() + 24h
  ↓
Envía WhatsApp: "Payment instructions" (inicial)
  ↓
Wait 6 horas
  ↓
Envía WhatsApp: "Reminder 1 - 18h remaining"
  ↓
Wait 14 horas (total 20h transcurridas)
  ↓
Envía WhatsApp: "FINAL REMINDER - 4h remaining"
  ↓
Wait 4 horas (total 24h)
  ↓
Consulta payment_status
  ├─ SI paid → booking.status = 'confirmed' + notifica owner
  └─ SI NO paid → booking.status = 'expired' + libera fechas + notifica owner
```

**Webhook Input:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "booking_id": "uuid",
  "guest_contact": "+34619794604",
  "amount": 6300,
  "currency": "USD"
}
```

**¿Qué falta?**
- ⏳ Trigger automático al crear reserva
- ⏳ Lógica de casos especiales (payment_verification)

---

#### C) WF-AUTOPILOT Actions (Approve/Reject)

| Propiedad | Valor |
|-----------|-------|
| **Estado** | ⚠️ EXISTE PERO NO PROBADO |
| **ID Workflow** | `E6vXYR5Xm3SYVEnC` |
| **Trigger** | Webhook POST `/autopilot/action` |
| **Función** | Procesa decisiones del owner |

**Webhook Input:**
```json
{
  "action": "approve",  // o "reject"
  "action_id": "uuid-de-autopilot_actions",
  "user_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db"
}
```

**Proceso esperado:**
1. Buscar acción en `autopilot_actions` por `action_id`
2. Actualizar `status` = 'approved' o 'rejected'
3. Guardar `approved_by`, `approved_at`
4. Ejecutar acción correspondiente según `action_type`:
   - `payment_verification` → Extender hold 24h + notificar guest
   - `custom_payment_plan` → Actualizar booking + programar recordatorios
   - `cancellation_exception` → Procesar reembolso + notificar
5. Crear log en `audit_logs`

**¿Qué falta?**
- ⚠️ Probar con `action_id` real
- ⚠️ Verificar que ejecuta acciones correctamente

---

### 6.3 Casos de Uso - ¿Cuándo usar Approve/Reject?

El botón **Approve/Reject** en OSIRIS Dashboard se usa SOLO para **casos especiales** que requieren decisión humana:

#### Caso A: Payment Verification Pending

**Situación:**
- Guest hace transferencia bancaria
- Pasan 22 horas y el sistema NO detecta pago
- Guest envía screenshot del comprobante por WhatsApp
- Faltan 2h para que expire la reserva

**Acción del sistema:**
1. WF-D2 detecta: tiempo_restante ≤ 2h + mensaje reciente del guest
2. Crea registro en `autopilot_actions`:
```json
{
  "action_type": "payment_verification",
  "title": "Payment Verification - Sarah Johnson",
  "description": "Guest claims payment sent. Bank transfer pending. Extend hold?",
  "details": {
    "booking_reference": "BK-2024-001",
    "guest_name": "Sarah Johnson",
    "hours_remaining": 2,
    "payment_method": "bank_transfer",
    "guest_message": "Ya hice la transferencia, adjunto comprobante"
  },
  "priority": "high",
  "status": "pending"
}
```
3. Owner ve alerta en Dashboard
4. **APPROVE** → Extiende hold 24h + notifica al guest
5. **REJECT** → Deja que expire normalmente

#### Caso B: Custom Payment Plan

**Situación:**
- Guest pide pagar 50% ahora, 50% antes del check-in
- Política normal: 100% upfront

**Acción del sistema:**
1. LUMINA o BANYU detecta solicitud especial
2. Crea acción tipo `custom_payment_plan`
3. Owner decide si aprueba o rechaza

#### Caso C: Cancellation Exception

**Situación:**
- Guest cancela 2 días antes del check-in
- Política: No reembolso
- Guest tiene emergencia familiar y pide excepción

**Acción del sistema:**
1. Sistema detecta cancelación fuera de política
2. Crea acción tipo `cancellation_exception`
3. Owner decide: reembolso total/parcial/ninguno

---

## 7. FRONTEND OSIRIS

### Estado del Dashboard

| Componente | Estado | Notas |
|------------|--------|-------|
| Login Page | ✅ 100% | Dark theme, split layout |
| Sidebar Navigation | ✅ 100% | Collapsible sections |
| Owner Executive Summary | ✅ 100% | Dashboard principal |
| Properties Module | ✅ 100% | CRUD completo |
| Bookings Module | ✅ 100% | Gestión de reservas |
| Autopilot Dashboard | ✅ 100% | Tema oscuro, conexión Supabase |
| Manual Data Entry | ✅ 100% | Tema oscuro, 4 tabs |
| AI Systems (Agents) | ✅ 100% | Monitor de KORA, BANYU, LUMINA, OSIRIS |
| Payments | ✅ 90% | UI lista, datos demo |
| Messages | ✅ 90% | UI lista, datos demo |

### Autopilot Dashboard - Funcionalidad

**Tabs disponibles:**
- Daily View (por defecto)
- Weekly View (placeholder)
- Monthly View (placeholder)

**Secciones en Daily View:**

1. **KPI Cards**
   - New Inquiries
   - Pending Payments
   - Confirmed Bookings
   - Check-ins Today
   - Expired Holds

2. **Recent Alerts**
   - Carga desde `autopilot_alerts` en Supabase
   - Muestra tipo, mensaje, tiempo relativo

3. **Actions Needing Approval**
   - Carga desde `autopilot_actions` WHERE status='pending'
   - Muestra guest, booking reference, descripción
   - Botones: **Approve** (verde) | **Reject** (rojo) | **View** (gris)
   - Al hacer click → llama webhook `/autopilot/action`

4. **Quick Actions**
   - View All Inquiries
   - Payment Follow-ups
   - Today's Schedule
   - View All Alerts

**Conexión con Backend:**
```javascript
// Al montar componente:
useEffect(() => {
  fetchTodayMetrics();   // RPC get_daily_summary
  fetchAlerts();          // SELECT autopilot_alerts
  fetchActions();         // SELECT autopilot_actions
}, []);

// Botón "Generate Summary":
handleGenerateDailySummary() → POST /webhook/autopilot/daily-summary

// Botones Approve/Reject:
handleApprove(actionId) → POST /webhook/autopilot/action
handleReject(actionId) → POST /webhook/autopilot/action
```

---

## 8. TAREAS PENDIENTES

### 🔴 PRIORIDAD ALTA (Esta semana)

#### 1. Implementar Trigger Automático WF-D2

**Problema actual:**
WF-D2 solo se activa con webhook manual. Debería activarse automáticamente al crear una reserva.

**Soluciones posibles:**

**Opción A: Database Trigger (Supabase Edge Function)**
```sql
CREATE TRIGGER trg_booking_payment_protection
AFTER INSERT OR UPDATE ON bookings
FOR EACH ROW
WHEN (NEW.payment_status = 'pending' AND NEW.status IN ('confirmed', 'provisional'))
EXECUTE FUNCTION trigger_payment_protection();
```
Pros: Inmediato
Contras: Requiere Edge Function en Supabase

**Opción B: Modificar BANYU/KORA**
Cuando crean un booking, llamar directamente al webhook WF-D2.
Pros: Simple
Contras: Acopla lógica

**Opción C: CRON en n8n (RECOMENDADO)**
Crear workflow que cada 15 minutos busca:
```sql
SELECT * FROM bookings
WHERE payment_status = 'pending'
  AND status IN ('confirmed', 'provisional')
  AND payment_expiry_at IS NULL
  AND created_at > NOW() - INTERVAL '1 hour'
```
Para cada uno → llama webhook WF-D2
Pros: Desacoplado, fácil debugging
Contras: Delay de hasta 15 min

**Implementar:** Opción C

---

#### 2. Verificar y Probar WF-AUTOPILOT Actions

**Pasos:**
1. Crear registro manual en `autopilot_actions`:
```sql
INSERT INTO autopilot_actions (
  tenant_id,
  property_id,
  action_type,
  title,
  description,
  status,
  details
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'payment_verification',
  'Test Payment Verification',
  'Guest claims payment sent. Test case.',
  'pending',
  '{"booking_reference": "BK-TEST-001", "guest_name": "Test Guest"}'::jsonb
);
```

2. Copiar el UUID generado

3. Probar Approve:
```powershell
$body = '{"action":"approve","action_id":"UUID_COPIADO","user_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db"}'
Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

4. Verificar:
   - `autopilot_actions.status` cambió a 'approved'
   - `approved_by` y `approved_at` están poblados
   - Se ejecutó alguna acción (según action_type)

---

#### 3. Implementar Casos Especiales en WF-D2

**Modificación en WF-D2:**

Añadir nodo después de "Wait 20h" (antes del final):

```
Nodo: "Check for Special Cases"
  ↓
IF (time_remaining ≤ 2h) AND (guest_sent_message_recently)
  ↓
  CREATE autopilot_action:
  {
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
      "guest_message": "{last_message}"
    },
    "priority": "high"
  }
  ↓
  CREATE autopilot_alert:
  {
    "alert_type": "payment_verification_needed",
    "message": "Action required: Payment verification for {booking_ref}",
    "severity": "high",
    "status": "active"
  }
```

**Cómo detectar "guest_sent_message_recently":**
```sql
SELECT COUNT(*) FROM whatsapp_messages
WHERE guest_id = :guest_id
  AND created_at > NOW() - INTERVAL '2 hours'
  AND direction = 'inbound'
  AND (
    message ILIKE '%paid%' OR
    message ILIKE '%payment%' OR
    message ILIKE '%transfer%' OR
    message ILIKE '%comprobante%'
  )
```

---

### 🟡 PRIORIDAD MEDIA (Próximas 2 semanas)

#### 4. Conectar LUMINA con Downstream Workflows

**Estado actual:**
- LUMINA analiza leads ✅
- Devuelve decisión: BOOKED/FOLLOWUP/REENGAGE/CLOSE ✅
- NO ejecuta acciones basadas en decisión ❌

**Implementar:**

```
LUMINA devuelve decisión
  ↓
SWITCH por decisión:
  ├─ BOOKED → Trigger WF-04 Follow-Up (confirmation sequence)
  ├─ FOLLOWUP → Trigger WF reminders (1h, 6h, 24h)
  ├─ REENGAGE → Trigger WF retargeting (48h, 1 semana)
  └─ CLOSE → Marcar lead como closed + log
```

#### 5. Expandir OSIRIS con Weekly/Monthly Views

**Pendiente:**
- Crear funciones RPC `get_weekly_summary` y `get_monthly_summary` en Supabase
- Modificar WF-OSIRIS para usar estos tools
- Conectar tabs Weekly/Monthly en Dashboard

#### 6. Testing End-to-End con Reserva Real

**Flujo completo a probar:**
1. Lead llega por WhatsApp
2. BANYU responde
3. LUMINA analiza → decisión BOOKED
4. Se crea booking en Supabase
5. WF-D2 se activa automáticamente (trigger a implementar)
6. Guest recibe 3 reminders
7. Guest paga (o no paga)
8. Sistema confirma o expira automáticamente
9. Owner recibe resumen diario a las 18:00

---

### 🟢 PRIORIDAD BAJA (Backlog)

- Onboarding segundo hotel cuando Meta permita más números WhatsApp
- Documentación completa para handoff a equipo técnico
- Sistema de notificaciones push en OSIRIS
- Integración con PMS externo (opcional)
- Analytics avanzado (conversion funnel, A/B testing)

---

## 9. LIMITACIONES CONOCIDAS

### Meta WhatsApp Business API

**Problema:**
- Límite actual: **2 números WhatsApp** por Business Manager
- Business Manager ID: `1300932111383434`
- WABA ID: `819469717463709`

**Impacto:**
- Retrasa expansión multi-tenant
- Cada hotel necesita su propio número WhatsApp

**Estado:**
- Números actuales: 2/2 (límite alcanzado)
- Meta NO aumenta límite manualmente
- Debe crecer orgánicamente según calidad de mensajes

**Solución temporal:**
- Crear nuevo Business Manager → +2 números inmediatamente
- Trade-off: Mayor complejidad de gestión

**Solución a largo plazo:**
- Esperar crecimiento orgánico del límite (semanas/meses)
- Continuar enviando mensajes de alta calidad

### ChakraHQ Coexistence Mode

**Configurado para:**
- Owner puede usar WhatsApp Business App simultáneamente con BANYU
- Número personal del owner: +62 813 5351 5520
- BANYU responde automáticamente, owner puede intervenir manualmente

---

## 10. ROADMAP Y PRÓXIMOS PASOS

### Semana 1 (27 Enero - 2 Febrero)

- [ ] Implementar CRON auto-trigger para WF-D2
- [ ] Probar WF-AUTOPILOT Actions end-to-end
- [ ] Implementar casos especiales (payment_verification) en WF-D2
- [ ] Testing completo Autopilot con reserva real

### Semana 2-3 (3-16 Febrero)

- [ ] Conectar LUMINA downstream workflows
- [ ] Implementar get_weekly_summary y get_monthly_summary
- [ ] Expandir OSIRIS con tabs Weekly/Monthly
- [ ] Documentación técnica completa

### Semana 4+ (17 Febrero en adelante)

- [ ] Onboarding segundo hotel (cuando Meta permita)
- [ ] Optimización de performance
- [ ] Analytics avanzado
- [ ] Features adicionales según feedback

---

## ANEXOS

### A. Comandos de Testing

#### Test WF-D2 Payment Protection
```powershell
$body = '{"tenant_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db","property_id":"18711359-1378-4d12-9ea6-fb31c0b1bac2","booking_id":"68f08a60-6ecd-4b68-8252-a2fba7a2b981","guest_contact":"+34619794604","amount":6300,"currency":"USD"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start" -Method POST -ContentType "application/json" -Body $body
```

#### Test Daily Summary API
```powershell
$body = '{"tenant_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db","property_id":"18711359-1378-4d12-9ea6-fb31c0b1bac2"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary" -Method POST -ContentType "application/json" -Body $body
```

#### Test Approve/Reject
```powershell
# Primero crear acción de prueba en Supabase, luego:
$body = '{"action":"approve","action_id":"UUID_AQUI","user_id":"c24393db-d318-4d75-8bbf-0fa240b9c1db"}'

Invoke-RestMethod -Uri "https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action" -Method POST -ContentType "application/json" -Body $body
```

### B. Queries Útiles de Supabase

#### Ver acciones pendientes
```sql
SELECT * FROM autopilot_actions
WHERE status = 'pending'
ORDER BY priority DESC, created_at DESC;
```

#### Ver alertas activas
```sql
SELECT * FROM autopilot_alerts
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10;
```

#### Ver bookings pendientes de pago
```sql
SELECT * FROM bookings
WHERE payment_status = 'pending'
  AND status IN ('confirmed', 'provisional')
ORDER BY created_at DESC;
```

#### Ver resumen diario más reciente
```sql
SELECT * FROM daily_summary
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
ORDER BY summary_date DESC
LIMIT 1;
```

### C. Contactos y Recursos

**Owner:**
- Email: [Jose's email]
- WhatsApp: +34619794604
- Timezone: WITA (UTC+8)

**APIs:**
- ChakraHQ Plugin ID: `2e45a0bd-8600-41b4-ac92-599d59d6221c`
- WhatsApp Phone Number ID: `944855278702577`
- Meta Business Manager ID: `1300932111383434`

**Documentación de referencia:**
- `AUTOPILOT_MODULE_-_IV_CLAUDE_AI.txt`
- `MYHOST_TECH_STACK.md`
- `PROMPT_CLAUDE_AI_CERRAR_FLUJOS_26ENE2026.md`

---

## METODOLOGÍA DE TRABAJO

### Para Claude AI

1. **SIEMPRE lee la documentación completa antes de implementar**
2. **NO modifiques workflows en producción hasta validar en test**
3. **Sigue las especificaciones EXACTAMENTE como están escritas**
4. **Prueba incrementalmente con datos reales**
5. **Documenta cada cambio en audit_logs**
6. **Pregunta si tienes dudas ANTES de ejecutar**

### Para Claude Code

1. **Lee archivos existentes antes de modificar**
2. **Mantén consistencia de estilos y patrones**
3. **Usa componentes reutilizables cuando sea posible**
4. **Prueba en localhost antes de commit**
5. **Commits descriptivos con formato estándar**

---

**Documento generado:** 27 de Enero 2026
**Próxima revisión:** 3 de Febrero 2026
**Versión:** 1.0

---

*Este es el documento maestro del proyecto MY HOST BizMate. Actualizar después de cada sprint o cambio significativo.*
