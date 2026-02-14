# AUTOPILOT - VISIÓN + MENÚ OFICIAL FINAL
## DOCUMENTO MAESTRO - ARQUITECTURA DEFINITIVA

**Fecha:** 29 Enero 2026
**Proyecto:** MYHOST BizMate - AUTOPILOT
**Estado:** ✅ CERRADO A NIVEL CONCEPTUAL

---

## 🎯 PARTE 1 — QUÉ ES AUTOPILOT

### Principio fundamental:

```
Autopilot NO es un sistema nuevo.
Autopilot NO duplica lógica.
Autopilot es una VISTA SIMPLIFICADA (modo fácil) de MyHost BizMate.
```

### Arquitectura:

```
┌─────────────────────────────────────────────────────┐
│  AUTOPILOT (Frontend - Vista Simplificada)         │
│  "Owner View" - Interfaz amigable                   │
└─────────────────┬───────────────────────────────────┘
                  │ Mapea directamente a:
                  ▼
┌─────────────────────────────────────────────────────┐
│  MYHOST BIZMATE (Backend - Motor Real)             │
│  Cerebro + Base de Datos + Workflows               │
├─────────────────────────────────────────────────────┤
│  - Supabase (bookings, payments, guests, etc.)     │
│  - n8n Workflows (LUMINA, Follow-Up, etc.)         │
│  - Autopilot Actions (decisiones pendientes)       │
│  - Channels (Airbnb, Booking, Direct)              │
│  - WhatsApp / Email                                │
└─────────────────────────────────────────────────────┘
```

### Regla clave:

**✅ CORRECTO:**
```
Autopilot = interfaz simple
MyHost BizMate = cerebro + motor
Todo mapea a entidades reales de BizMate
```

**❌ INCORRECTO:**
```
Crear lógica nueva en Autopilot
Duplicar funcionalidad
Crear tablas separadas
```

---

## 🎯 OBJETIVO DE AUTOPILOT

> **"Que el owner pueda hacer lo que ya hace hoy (día a día, semana, mes), pero de forma organizada, automática y sin perder nada."**

### Público objetivo:
- Villa / hotel owners **poco técnicos**
- Que vienen de Excel + WhatsApp + Google Calendar
- Que NO quieren sistemas "corporativos" complejos

### Puerta de entrada:
```
Owner empieza usando solo AUTOPILOT
                ↓
Descubre valor (ahorro tiempo, menos errores)
                ↓
Explora más módulos de MyHost BizMate
                ↓
Usa todo el sistema gradualmente
```

---

## 📋 PARTE 2 — MENÚ FINAL DE AUTOPILOT

### Estructura del menú:

```
AUTOPILOT — OWNER VIEW
├── 1. Setup & Data Entry
├── 2. Availability & Channels
├── 3. Bookings
├── 4. Payments
├── 5. Guest Communication
├── 6. My Villa Website
├── 7. Maintenance & Tasks
├── 8. Overview (Daily / Weekly / Monthly)
└── 9. Owner Decisions
```

---

### 1️⃣ **Setup & Data Entry**

**Qué incluye:**
- Property profile (nombre, ubicación, contacto)
- Units (villas / habitaciones: nombre + capacidad)
- Base rates (precio/noche por unidad)
- Policies simples (check-in/out, cancelación, mascotas)
- Manual add booking / manual add payment (para pilotos)

**Objetivo:**
> "Aquí meto mis datos y empiezo."

**Mapea a:**
```
Supabase tables:
- properties
- units (o rooms)
- property_settings
- bookings (manual entry)
- payments (manual entry)
```

**Componente:**
```
src/components/Autopilot/Setup.jsx
src/components/Autopilot/ManualDataEntry.jsx (ya existe)
```

---

### 2️⃣ **Availability & Channels**

**Qué incluye:**
- Estado de canales: Airbnb / Booking / Direct
  - Connected / Not connected
- Calendar view simple por unidad
- Block / unblock fechas manualmente

**Objetivo:**
> "Aquí veo disponibilidad y conexiones."

**Mapea a:**
```
Supabase tables:
- channel_connections (airbnb_connected, booking_connected)
- calendar_blocks
- bookings (para mostrar ocupación)

n8n workflows:
- Channel sync workflows (cuando se conecten)
```

**Componente:**
```
src/components/Autopilot/Availability.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  CHANNELS                                           │
├─────────────────────────────────────────────────────┤
│  Airbnb:    ✅ Connected  [Settings]               │
│  Booking:   ✅ Connected  [Settings]               │
│  Direct:    ✅ Active     [View Site]              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  CALENDAR - Villa 1                                 │
├─────────────────────────────────────────────────────┤
│  [Calendar grid showing availability]               │
│  Click date → Block / Unblock                       │
└─────────────────────────────────────────────────────┘
```

---

### 3️⃣ **Bookings**

**Qué incluye:**
- Listado de reservas: pasadas, actuales, futuras
- Datos clave:
  - Guest, fechas, noches, canal, status, importe
- Acciones básicas:
  - Ver detalle, cambiar estado, cancelar si aplica

**Objetivo:**
> "Aquí están todas mis reservas."

**Mapea a:**
```
Supabase table:
- bookings (SELECT * WHERE tenant_id = ... ORDER BY check_in)

Filtros:
- Past (check_out < today)
- Current (check_in <= today <= check_out)
- Upcoming (check_in > today)
```

**Componente:**
```
src/components/Autopilot/Bookings.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  BOOKINGS                                           │
│  [Upcoming] [Current] [Past]                        │
├─────────────────────────────────────────────────────┤
│  Maria Garcia                                       │
│  Mar 10-15 (5 nights) | Airbnb | Confirmed          │
│  $1,200 - Paid                                      │
│  [View Details] [Contact Guest]                     │
├─────────────────────────────────────────────────────┤
│  John Smith                                         │
│  Mar 20-25 (5 nights) | Direct | Pending Payment    │
│  $1,000 - Pending                                   │
│  [View Details] [Send Reminder]                     │
└─────────────────────────────────────────────────────┘
```

---

### 4️⃣ **Payments**

**Qué incluye:**
- Estado de pagos por booking:
  - Paid / Pending / Partial
- Método de pago (etiqueta):
  - Cash / Bank transfer / Card
- Listas:
  - Pending payments / Overdue
- Acción:
  - Mark as paid / Request confirmation

**Objetivo:**
> "Aquí controlo el dinero y no pierdo pagos."

**Mapea a:**
```
Supabase tables:
- bookings (payment_status field)
- payments (detailed payment records)

n8n workflow:
- WF-D2 Payment Protection (reminders automáticos)
```

**Componente:**
```
src/components/Autopilot/Payments.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  PAYMENTS PENDING                                   │
├─────────────────────────────────────────────────────┤
│  🔴 OVERDUE                                         │
│  John Smith - $1,000                                │
│  Due: Mar 15 (2 days ago)                           │
│  [Mark Paid] [Send Reminder]                        │
├─────────────────────────────────────────────────────┤
│  🟡 DUE SOON                                        │
│  Sarah Lee - $800                                   │
│  Due: Mar 20 (in 2 days)                            │
│  [Mark Paid] [Contact Guest]                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  PAYMENTS RECEIVED THIS MONTH                       │
│  Total: $5,200                                      │
│  Bank Transfer: $3,000                              │
│  Cash: $1,500                                       │
│  Card: $700                                         │
└─────────────────────────────────────────────────────┘
```

---

### 5️⃣ **Guest Communication**

**Qué incluye:**
- Inbox unificado (WhatsApp principal, email secundario)
- Conversaciones ligadas a guest / booking
- Templates rápidos:
  - Confirmación, pago, seguimiento
- Estados:
  - Waiting guest / Waiting owner / Resolved

**Objetivo:**
> "Aquí no se me pierde ningún mensaje."

**Mapea a:**
```
Supabase tables:
- messages (thread per guest/booking)
- message_threads (status tracking)

n8n workflows:
- BANYU (WhatsApp AI auto-responde)
- WF-02 Follow-Up Engine
```

**Componente:**
```
src/components/Autopilot/GuestCommunication.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  INBOX                                              │
│  [Waiting Owner] [Waiting Guest] [Resolved]         │
├─────────────────────────────────────────────────────┤
│  🔴 Maria Garcia                                    │
│  Last message: "I sent the payment"                 │
│  Booking: Mar 10-15                                 │
│  [Open Chat]                                        │
├─────────────────────────────────────────────────────┤
│  ✅ John Smith                                      │
│  Last message: "Thanks!"                            │
│  Booking: Mar 20-25                                 │
│  Status: Resolved                                   │
└─────────────────────────────────────────────────────┘
```

---

### 6️⃣ **My Villa Website**

**Qué incluye:**
- Link público a la landing page
- Acciones:
  - Open / Copy / Share por WhatsApp
- Preview rápido (fotos + descripción)
- Edición básica v1:
  - Fotos, texto, precios

**Objetivo:**
> "Aquí está mi web lista para enviar a clientes."

**Mapea a:**
```
Supabase table:
- sites (slug, theme, content, published)

Frontend:
- src/components/PublicSite/PublicSite.jsx
- src/components/MySite/MySite.jsx (wizard)
```

**Componente:**
```
src/components/Autopilot/MyWebsite.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  MY VILLA WEBSITE                                   │
├─────────────────────────────────────────────────────┤
│  Status: ✅ Published                               │
│  URL: https://my-host-bizmate.vercel.app/site/nismara │
│                                                     │
│  [Open Website] [Copy Link] [Share WhatsApp]        │
│                                                     │
│  Preview:                                           │
│  [Image preview of landing page]                    │
│                                                     │
│  [Edit Content] [Change Photos] [Update Prices]     │
└─────────────────────────────────────────────────────┘
```

---

### 7️⃣ **Maintenance & Tasks**

**Qué incluye:**
- Lista de tareas:
  - Cleaning, maintenance, supplies
- Estados:
  - Open / In progress / Done
- Asignación:
  - Owner / Staff
- Fecha límite + notas

**Objetivo:**
> "Aquí gestiono la operación diaria."

**Mapea a:**
```
Supabase table:
- tasks (nueva tabla)

Schema:
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  task_type TEXT NOT NULL,  -- cleaning, maintenance, supplies
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',  -- open, in_progress, done
  assigned_to TEXT,  -- owner, staff_name
  due_date DATE,
  related_type TEXT,  -- booking, unit
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Componente:**
```
src/components/Autopilot/Tasks.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  TASKS                                              │
│  [Open] [In Progress] [Done]                        │
├─────────────────────────────────────────────────────┤
│  🔴 URGENT                                          │
│  Villa 1 - Cleaning                                 │
│  Before check-in: Mar 10 (tomorrow)                 │
│  Assigned: Maria (staff)                            │
│  [Mark Done]                                        │
├─────────────────────────────────────────────────────┤
│  🟡 Villa 2 - Maintenance                           │
│  Fix pool pump                                      │
│  Due: Mar 15                                        │
│  Assigned: Owner                                    │
│  [Start] [Mark Done]                                │
└─────────────────────────────────────────────────────┘
```

---

### 8️⃣ **Overview** (Daily / Weekly / Monthly)

**Qué incluye:**

**Tabs: Daily / Weekly / Monthly**

**Daily:**
- Inquiries, check-ins, pagos pendientes, alertas

**Weekly:**
- Reservas confirmadas, pagos cobrados, acciones abiertas

**Monthly:**
- Revenue estimado, ocupación estimada, cancelaciones

**Objetivo:**
> "En 30 segundos sé cómo va el negocio."

**Mapea a:**
```
Supabase tables:
- daily_summary (ya existe)
- weekly_summary (crear RPC)
- monthly_summary (crear RPC)

n8n workflows:
- WF-D3 Daily Summary ✅
- WF-W1 Weekly Summary (FASE 2)
- WF-M1 Monthly Summary (FASE 3)
```

**Componente:**
```
src/components/Autopilot/Overview.jsx
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  OVERVIEW                                           │
│  [Daily] [Weekly] [Monthly]                         │
├─────────────────────────────────────────────────────┤
│  📊 TODAY AT A GLANCE                               │
│  New Inquiries: 8                                   │
│  Pending Payments: 2                                │
│  Check-ins Today: 1                                 │
│  Check-outs Today: 2                                │
│                                                     │
│  🚨 ALERTS                                          │
│  - Payment overdue: John Smith                      │
│  - Cleaning due: Villa 1 (tomorrow)                 │
└─────────────────────────────────────────────────────┘
```

---

### 9️⃣ **Owner Decisions**

**Qué incluye:**
- Lista de autopilot_actions pendientes
- Tipos:
  - Discount request
  - Payment plan
  - Cancellation exception
  - Payment verification
  - Date change
- Cada acción muestra:
  - Guest + booking + resumen + urgencia
- Acciones:
  - Approve / Reject (conecta con flujos existentes)

**Objetivo:**
> "El sistema trabaja solo y me pide decisiones cuando toca."

**Mapea a:**
```
Supabase table:
- autopilot_actions (ya existe)

n8n workflow:
- WF-AUTOPILOT Actions V2 (GuHQkHb21GlowIZl) ✅
```

**Componente:**
```
src/components/Autopilot/OwnerDecisions.jsx
(Actualmente en Autopilot.jsx - sección "Actions Needing Approval")
```

**UI:**
```
┌─────────────────────────────────────────────────────┐
│  OWNER DECISIONS                                    │
│  Things that need your approval                     │
├─────────────────────────────────────────────────────┤
│  🔴 HIGH PRIORITY                                   │
│  Guest Payment Screenshot Received                  │
│  Maria Garcia wants to confirm payment              │
│  Booking: Mar 10-15 | $1,200                        │
│  [Approve] [Reject]                                 │
├─────────────────────────────────────────────────────┤
│  🟡 NORMAL                                          │
│  Custom Payment Plan Request                        │
│  John Smith asks: "Can I pay 50% now, 50% later?"  │
│  Booking: Mar 20-25 | $1,000                        │
│  [Approve] [Reject]                                 │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 IDEA FINAL (IMPORTANTE)

### Quote maestro:

> **"Lo que hago cada día, cada semana y cada mes, pero organizado, automatizado y sin que nada se me escape."**

### Estado conceptual:

```
✅ CERRADO A NIVEL CONCEPTUAL
⏳ AHORA TOCA: Ejecución en frontend conectado directamente a MyHost BizMate
```

---

## 🗺️ ARQUITECTURA DE IMPLEMENTACIÓN

### Estructura de componentes:

```
src/components/Autopilot/
├── Autopilot.jsx               # Main router (navegación entre secciones)
├── Setup.jsx                   # 1. Setup & Data Entry
├── ManualDataEntry.jsx         # (Ya existe - parte de Setup)
├── Availability.jsx            # 2. Availability & Channels
├── Bookings.jsx                # 3. Bookings
├── Payments.jsx                # 4. Payments
├── GuestCommunication.jsx      # 5. Guest Communication
├── MyWebsite.jsx               # 6. My Villa Website
├── Tasks.jsx                   # 7. Maintenance & Tasks
├── Overview.jsx                # 8. Overview (Daily/Weekly/Monthly)
└── OwnerDecisions.jsx          # 9. Owner Decisions
```

### Sidebar mejorado:

```jsx
// src/components/Layout/Sidebar.jsx

<div className="autopilot-section">
  <h3>AUTOPILOT</h3>
  <ul>
    <li onClick={() => navigate('autopilot/setup')}>
      Setup & Data Entry
    </li>
    <li onClick={() => navigate('autopilot/availability')}>
      Availability & Channels
    </li>
    <li onClick={() => navigate('autopilot/bookings')}>
      Bookings
    </li>
    <li onClick={() => navigate('autopilot/payments')}>
      Payments
    </li>
    <li onClick={() => navigate('autopilot/communication')}>
      Guest Communication
    </li>
    <li onClick={() => navigate('autopilot/website')}>
      My Villa Website
    </li>
    <li onClick={() => navigate('autopilot/tasks')}>
      Maintenance & Tasks
    </li>
    <li onClick={() => navigate('autopilot/overview')}>
      Overview
    </li>
    <li onClick={() => navigate('autopilot/decisions')}>
      Owner Decisions
    </li>
  </ul>
</div>
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### FASE 1 (Para presentación mañana):
- ✅ Overview (ya existe parcialmente)
- ✅ Owner Decisions (ya existe en Autopilot.jsx)
- ✅ Mejorar menú según estructura oficial

### FASE 2 (Post-presentación):
- Bookings (conectar con tabla bookings)
- Payments (conectar con payment_status)
- Setup & Data Entry (mejorar ManualDataEntry existente)

### FASE 3:
- Availability & Channels
- Guest Communication
- My Villa Website
- Maintenance & Tasks

---

## ✅ CHECKLIST CONCEPTUAL

### Principios validados:
- [x] Autopilot = Vista simplificada (NO sistema nuevo)
- [x] Mapea directamente a MyHost BizMate existente
- [x] NO duplica lógica ni tablas
- [x] Puerta de entrada para owners poco técnicos
- [x] "Lo que hago cada día/semana/mes, pero organizado"

### Menú oficial:
- [x] 1. Setup & Data Entry
- [x] 2. Availability & Channels
- [x] 3. Bookings
- [x] 4. Payments
- [x] 5. Guest Communication
- [x] 6. My Villa Website
- [x] 7. Maintenance & Tasks
- [x] 8. Overview
- [x] 9. Owner Decisions

### Arquitectura técnica:
- [x] Frontend: src/components/Autopilot/*
- [x] Backend: MyHost BizMate existente (Supabase + n8n)
- [x] Mapeo directo a tablas: bookings, payments, guests, etc.
- [x] NO lógica nueva en Autopilot, solo presentación

---

*Documento generado: 29 Enero 2026 - 23:30h*
*VISIÓN + MENÚ OFICIAL FINAL - CERRADO CONCEPTUALMENTE*
*Listo para ejecución frontend*
