# PROMPT PARA CLAUDE AI - CERRAR FLUJOS AUTOPILOT
**Fecha:** 26 Enero 2026
**Proyecto:** MY HOST BizMate
**Objetivo:** Completar 3 tareas pendientes en n8n

---

## CONTEXTO

Hoy hemos completado el frontend de AUTOPILOT (100% funcional en demo mode). Ahora necesito que completes la parte de backend (n8n workflows) para cerrar este módulo.

**Lo que YA está hecho:**
- ✅ Frontend AUTOPILOT dashboard (Autopilot.jsx) - tarjetas blancas, fondo naranja
- ✅ Frontend Manual Data Entry (ManualDataEntry.jsx) - 4 tabs operativos
- ✅ Tablas Supabase: `autopilot_alerts`, `autopilot_actions`, `daily_summary`, `whatsapp_conversations`, `whatsapp_numbers`
- ✅ Funciones RPC: `get_tenant_by_phone_number_id`, `log_whatsapp_message`, `create_autopilot_alert`, etc.
- ✅ WF-03-LEAD-HANDLER (activo)
- ✅ WF-04-BOOKING-NOTIFICATIONS (activo)

**Lo que necesito que hagas HOY:**
1. Implementar WF-D2 Payment Protection
2. Conectar AUTOPILOT frontend con datos reales de Supabase
3. Añadir Weekly/Monthly a OSIRIS (actualmente solo tiene daily)

---

## TAREA 1: WF-D2 PAYMENT PROTECTION ⚡ PRIORIDAD MÁXIMA

### Objetivo
Control automático de pagos con sistema de reminders (6h, 20h, expiración 24h).

### Flujo completo

```
BOOKING CONFIRMADO (status='hold')
         │
         ▼
  WF-04 crea booking
         │
         ▼
  Trigger automático → WF-D2 Payment Protection
         │
         ├─ Crea ALERT: "Payment pending - expires in 24h"
         │  INSERT INTO autopilot_alerts (tenant_id, alert_type='warning', title, message)
         │
         ├─ Crea ACTION: "Monitor payment for booking BK-XXX"
         │  INSERT INTO autopilot_actions (tenant_id, action_type='payment_monitor', ...)
         │
         └─ Programa 3 reminders:
              │
              ├─ REMINDER 1: +6 horas
              │   └─ Si NO pagado → WhatsApp Guest: "Reminder: Payment pending"
              │
              ├─ REMINDER 2: +20 horas
              │   └─ Si NO pagado → WhatsApp Guest: "Last reminder - 4h to confirm"
              │
              └─ REMINDER 3: +24 horas (EXPIRACIÓN)
                  └─ Si NO pagado:
                      - UPDATE booking SET status='expired'
                      - UPDATE autopilot_actions SET status='completed'
                      - CREATE autopilot_alert: "Booking expired - dates released"
                      - WhatsApp Owner: "Booking BK-XXX expired, dates now available"
```

### Webhook de entrada

**URL:** `https://n8n-production-bb2d.up.railway.app/webhook/autopilot/payment/start`

**Trigger:** Llamado automáticamente por WF-04-BOOKING-NOTIFICATIONS cuando se crea un booking con `status='hold'`

**Payload esperado:**
```json
{
  "booking_id": "uuid",
  "tenant_id": "uuid",
  "property_id": "uuid",
  "guest_name": "Sarah Johnson",
  "guest_phone": "+628123456789",
  "total_amount": 1200.00,
  "check_in": "2026-02-15",
  "check_out": "2026-02-18",
  "created_at": "2026-01-26T10:30:00Z"
}
```

### Nodos del workflow

#### 1. Webhook Trigger
- Método: POST
- Path: `/webhook/autopilot/payment/start`

#### 2. Create Alert
**HTTP Request → Supabase RPC**
```
POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_alerts

Body:
{
  "tenant_id": "={{ $json.tenant_id }}",
  "alert_type": "warning",
  "priority": "medium",
  "title": "Payment pending",
  "message": "Booking {{ $json.booking_id }} - Payment expires in 24h - {{ $json.guest_name }}",
  "related_booking_id": "={{ $json.booking_id }}",
  "action_required": true
}
```

#### 3. Create Action
**HTTP Request → Supabase**
```
POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_actions

Body:
{
  "tenant_id": "={{ $json.tenant_id }}",
  "action_type": "payment_monitor",
  "priority": "high",
  "title": "Monitor payment - {{ $json.guest_name }}",
  "description": "Booking {{ $json.booking_id }} - Total ${{ $json.total_amount }}",
  "status": "pending",
  "source": "autopilot",
  "related_booking_id": "={{ $json.booking_id }}",
  "details": {
    "booking_id": "={{ $json.booking_id }}",
    "guest_name": "={{ $json.guest_name }}",
    "total_amount": "={{ $json.total_amount }}",
    "expiration_time": "={{ new Date(Date.now() + 24*60*60*1000).toISOString() }}"
  }
}
```

#### 4. Schedule - Wait 6 Hours
**Wait node**
- Duration: 6 hours

#### 5. Check Payment Status (6h)
**HTTP Request → Supabase**
```
GET https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings?id=eq.{{ $json.booking_id }}&select=status,payment_status

If payment_status != 'paid':
  → Send Reminder 1
Else:
  → End flow (payment received)
```

#### 6. Send Reminder 1 (WhatsApp)
**HTTP Request → ChakraHQ**
```
POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/[CHAKRA_PLUGIN_ID]/api/v19.0/[PHONE_NUMBER_ID]/messages

Body:
{
  "messaging_product": "whatsapp",
  "to": "={{ $json.guest_phone }}",
  "type": "text",
  "text": {
    "body": "Hi {{ $json.guest_name }}, this is a friendly reminder that your booking payment is pending. You have 18 hours remaining to confirm. Total: ${{ $json.total_amount }}. Reply to this message if you need assistance."
  }
}
```

#### 7. Schedule - Wait 14 Hours More (total 20h)
**Wait node**
- Duration: 14 hours

#### 8. Check Payment Status (20h)
**Similar to step 5**

#### 9. Send Reminder 2 (Final Warning)
**WhatsApp Message:**
```
"Hi {{ $json.guest_name }}, this is your FINAL reminder. Your booking will expire in 4 hours if payment is not received. Total: ${{ $json.total_amount }}. Please confirm now to secure your dates."
```

#### 10. Schedule - Wait 4 Hours More (total 24h)
**Wait node**
- Duration: 4 hours

#### 11. Check Payment Status (24h - EXPIRATION)
**HTTP Request → Supabase**

#### 12. IF NOT PAID → Expire Booking
**HTTP Request → Supabase**
```
PATCH https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings?id=eq.{{ $json.booking_id }}

Body:
{
  "status": "expired",
  "payment_status": "expired",
  "journey_state": "booking_expired",
  "updated_at": "={{ new Date().toISOString() }}"
}
```

#### 13. Create Expiration Alert
**HTTP Request → Supabase**
```
POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_alerts

Body:
{
  "tenant_id": "={{ $json.tenant_id }}",
  "alert_type": "info",
  "priority": "low",
  "title": "Booking expired",
  "message": "{{ $json.guest_name }} - Dates released: {{ $json.check_in }} to {{ $json.check_out }}",
  "related_booking_id": "={{ $json.booking_id }}"
}
```

#### 14. Notify Owner (WhatsApp)
**WhatsApp Message:**
```
"Booking expired: {{ $json.guest_name }} - {{ $json.check_in }} to {{ $json.check_out }} - Dates are now available again."
```

#### 15. Complete Action
**HTTP Request → Supabase**
```
PATCH https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_actions?id=eq.{{ $json.action_id }}

Body:
{
  "status": "completed",
  "completed_at": "={{ new Date().toISOString() }}"
}
```

### Casos especiales

**Si el pago se recibe ANTES de las 24h:**
- El trigger de bookings actualiza `payment_status='paid'`
- Los checks en pasos 5, 8, 11 detectan esto
- El workflow termina automáticamente (no envía más reminders)

**Si el owner aprueba manualmente extender el plazo:**
- Frontend llama a `/webhook/autopilot/action` con `action='extend'`
- Se resetea el contador de 24h

---

## TAREA 2: CONECTAR AUTOPILOT FRONTEND CON SUPABASE REAL

### Objetivo
Reemplazar datos hardcodeados en Autopilot.jsx con datos reales de Supabase.

### Cambios necesarios en Autopilot.jsx

#### A) Fetch Today Metrics al cargar componente

**Añadir useEffect:**
```javascript
useEffect(() => {
  fetchTodayMetrics();
}, []);

const fetchTodayMetrics = async () => {
  try {
    const response = await fetch(
      'https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_daily_summary',
      {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          p_tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
        })
      }
    );

    const data = await response.json();

    setTodayMetrics({
      newInquiries: data.new_inquiries || 0,
      pendingPayments: data.pending_payments || 0,
      confirmedBookings: data.confirmed_bookings || 0,
      checkInsToday: data.checkins_today || 0,
      expiredHolds: data.expired_holds || 0
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
  }
};
```

#### B) Fetch Alerts

**Añadir estado y función:**
```javascript
const [alerts, setAlerts] = useState([]);

const fetchAlerts = async () => {
  try {
    const response = await fetch(
      'https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_alerts?tenant_id=eq.c24393db-d318-4d75-8bbf-0fa240b9c1db&status=eq.active&order=created_at.desc&limit=10',
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
        }
      }
    );

    const data = await response.json();
    setAlerts(data.map(alert => ({
      id: alert.id,
      type: alert.alert_type, // 'urgent', 'warning', 'info'
      message: alert.message,
      time: formatTimeAgo(alert.created_at)
    })));
  } catch (error) {
    console.error('Error fetching alerts:', error);
  }
};

// Helper function
const formatTimeAgo = (timestamp) => {
  const minutes = Math.floor((new Date() - new Date(timestamp)) / 60000);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
};
```

#### C) Fetch Actions Needing Approval

**Añadir estado y función:**
```javascript
const [actionsNeedingApproval, setActionsNeedingApproval] = useState([]);

const fetchActions = async () => {
  try {
    const response = await fetch(
      'https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/autopilot_actions?tenant_id=eq.c24393db-d318-4d75-8bbf-0fa240b9c1db&status=eq.pending&order=priority.desc,created_at.desc',
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0'
        }
      }
    );

    const data = await response.json();
    setActionsNeedingApproval(data.map(action => ({
      id: action.id,
      type: action.action_type, // 'payment_expired', 'special_request', 'pricing'
      guest: action.details?.guest_name || 'Unknown',
      booking: action.details?.booking_reference || 'N/A',
      action: action.description,
      status: action.status
    })));
  } catch (error) {
    console.error('Error fetching actions:', error);
  }
};
```

#### D) Modificar handleApprove y handleReject

**Actualizar funciones:**
```javascript
const handleApprove = async (actionId) => {
  try {
    const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        action_id: actionId,
        user_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
      })
    });

    if (response.ok) {
      alert('Action approved successfully!');
      fetchActions(); // Refresh list
    }
  } catch (error) {
    console.error('Error approving action:', error);
  }
};

const handleReject = async (actionId) => {
  // Similar pero con action: 'reject'
};
```

#### E) Modificar handleGenerateDailySummary

**Ya está implementado correctamente en el componente actual** (líneas 95-130). Solo verificar que el webhook WF-D3 está activo.

---

## TAREA 3: OSIRIS - AÑADIR WEEKLY/MONTHLY REPORTS

### Objetivo
Crear 3 tools separados para OSIRIS (actualmente solo tiene `get_daily_summary`).

### Tools a crear

#### 1. get_daily_summary (YA EXISTE ✅)
**Sin cambios** - Funciona correctamente

#### 2. get_weekly_summary (NUEVO)
```json
{
  "name": "get_weekly_summary",
  "description": "Get weekly performance report (last 7 days): inquiries, bookings, revenue, conversion rate, top properties",
  "input_schema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "The tenant ID (owner UUID)"
      }
    },
    "required": ["tenant_id"]
  }
}
```

**Backend implementation (Supabase RPC):**
```sql
CREATE OR REPLACE FUNCTION get_weekly_summary(p_tenant_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'period', 'weekly',
    'start_date', (CURRENT_DATE - INTERVAL '7 days')::TEXT,
    'end_date', CURRENT_DATE::TEXT,

    -- Inquiries
    'total_inquiries', (
      SELECT COUNT(*) FROM leads
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    ),
    'inquiries_by_channel', (
      SELECT json_object_agg(channel, count) FROM (
        SELECT channel, COUNT(*) as count
        FROM leads
        WHERE tenant_id = p_tenant_id
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY channel
      ) sub
    ),

    -- Bookings
    'total_bookings', (
      SELECT COUNT(*) FROM bookings
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status IN ('confirmed', 'hold')
    ),
    'confirmed_bookings', (
      SELECT COUNT(*) FROM bookings
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status = 'confirmed'
    ),

    -- Revenue
    'total_revenue', (
      SELECT COALESCE(SUM(total_amount), 0) FROM bookings
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status = 'confirmed'
    ),
    'average_booking_value', (
      SELECT COALESCE(AVG(total_amount), 0) FROM bookings
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
      AND status = 'confirmed'
    ),

    -- Conversion
    'conversion_rate', (
      SELECT CASE
        WHEN COUNT(*) FILTER (WHERE state = 'WON') > 0
        THEN ROUND((COUNT(*) FILTER (WHERE state = 'WON')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        ELSE 0
      END
      FROM leads
      WHERE tenant_id = p_tenant_id
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    ),

    -- Top performing properties
    'top_properties', (
      SELECT json_agg(
        json_build_object(
          'property_name', p.name,
          'bookings', COUNT(b.id),
          'revenue', COALESCE(SUM(b.total_amount), 0)
        )
      )
      FROM properties p
      LEFT JOIN bookings b ON b.property_id = p.id
        AND b.created_at >= CURRENT_DATE - INTERVAL '7 days'
        AND b.status = 'confirmed'
      WHERE p.owner_id = p_tenant_id
      GROUP BY p.id, p.name
      ORDER BY COUNT(b.id) DESC
      LIMIT 5
    )

  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

#### 3. get_monthly_summary (NUEVO)
```json
{
  "name": "get_monthly_summary",
  "description": "Get monthly performance report (last 30 days): inquiries, bookings, revenue, conversion, occupancy, trends",
  "input_schema": {
    "type": "object",
    "properties": {
      "tenant_id": {
        "type": "string",
        "description": "The tenant ID (owner UUID)"
      }
    },
    "required": ["tenant_id"]
  }
}
```

**Backend implementation (Supabase RPC):**
```sql
CREATE OR REPLACE FUNCTION get_monthly_summary(p_tenant_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'period', 'monthly',
    'start_date', (CURRENT_DATE - INTERVAL '30 days')::TEXT,
    'end_date', CURRENT_DATE::TEXT,

    -- Similar estructura a weekly pero con:
    'total_inquiries', (SELECT COUNT(*) FROM leads WHERE tenant_id = p_tenant_id AND created_at >= CURRENT_DATE - INTERVAL '30 days'),
    'total_bookings', (SELECT COUNT(*) FROM bookings WHERE tenant_id = p_tenant_id AND created_at >= CURRENT_DATE - INTERVAL '30 days' AND status IN ('confirmed', 'hold')),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE tenant_id = p_tenant_id AND created_at >= CURRENT_DATE - INTERVAL '30 days' AND status = 'confirmed'),
    'conversion_rate', ...,

    -- NUEVO: Occupancy rate
    'occupancy_rate', (
      -- Calcular % de noches ocupadas vs disponibles
      -- Formula: (total_booked_nights / (total_properties * 30)) * 100
    ),

    -- NUEVO: Week-over-week trends
    'trends', (
      SELECT json_build_object(
        'revenue_trend', 'up/down/stable',
        'bookings_trend', 'up/down/stable',
        'conversion_trend', 'up/down/stable'
      )
    ),

    'top_properties', ...

  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

### Workflow WF-OSIRIS modificar

**Añadir estos 2 nuevos tools al array de tools:**

```javascript
// En el nodo "Configure OSIRIS Tools"
const tools = [
  {
    name: "get_daily_summary",
    description: "Get today's performance summary...",
    input_schema: { ... }
  },
  {
    name: "get_weekly_summary", // ← NUEVO
    description: "Get weekly performance report (last 7 days): inquiries, bookings, revenue, conversion rate, top properties",
    input_schema: {
      type: "object",
      properties: {
        tenant_id: { type: "string", description: "The tenant ID (owner UUID)" }
      },
      required: ["tenant_id"]
    }
  },
  {
    name: "get_monthly_summary", // ← NUEVO
    description: "Get monthly performance report (last 30 days): inquiries, bookings, revenue, conversion, occupancy, trends",
    input_schema: {
      type: "object",
      properties: {
        tenant_id: { type: "string", description: "The tenant ID (owner UUID)" }
      },
      required: ["tenant_id"]
    }
  },
  // ... otros tools existentes
];
```

**Modificar el nodo "Execute Tool" para detectar los nuevos tools:**

```javascript
// En el Switch/IF que detecta qué tool ejecutar
if (toolName === 'get_daily_summary') {
  // Código existente...
}
else if (toolName === 'get_weekly_summary') {
  // Llamar a Supabase RPC get_weekly_summary
  const result = await fetch(
    'https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_weekly_summary',
    {
      method: 'POST',
      headers: { ... },
      body: JSON.stringify({ p_tenant_id: toolInput.tenant_id })
    }
  );
  return result.json();
}
else if (toolName === 'get_monthly_summary') {
  // Similar...
}
```

---

## TAREA 4: LANDING PAGE → n8n LEAD HANDLER (BONUS)

### Objetivo
Crear una landing page simple para Izumi Hotel que envíe leads a WF-03-LEAD-HANDLER.

### Especificación técnica

**Webhook destino:**
```
POST https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3

Body (Master Event v1.0):
{
  "schema_version": "1.0",
  "source": "web",
  "event_type": "lead_created",
  "tenant": {
    "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
  },
  "contact": {
    "name": "[del formulario]",
    "phone": "[del formulario]",
    "email": "[del formulario]"
  },
  "message": {
    "text": "[mensaje del formulario]",
    "channel": "web"
  },
  "booking_interest": {
    "check_in": "[fecha si proporcionó]",
    "check_out": "[fecha si proporcionó]",
    "guests": [número si proporcionó]
  },
  "utm": {
    "source": "[utm_source de URL]",
    "medium": "[utm_medium de URL]",
    "campaign": "[utm_campaign de URL]"
  }
}
```

### Campos del formulario

**Obligatorios:**
- Full Name
- Email (validar formato)
- Phone (WhatsApp) - formato internacional

**Opcionales:**
- Check-in date
- Check-out date
- Number of guests (default: 2)
- Message / Special requests

**Tracking UTM:**
Leer de URL: `?utm_source=xxx&utm_medium=xxx&utm_campaign=xxx`

### Validaciones

```javascript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone (internacional)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// Fechas
if (checkOut && checkIn && new Date(checkOut) <= new Date(checkIn)) {
  error = "Check-out must be after check-in";
}
```

### Respuesta de éxito

```
Thank you! We'll contact you within 2 hours via WhatsApp.

Or chat with us now: [WhatsApp Button]
→ https://wa.me/6281325764867?text=Hi!%20I'm%20interested%20in%20Izumi%20Hotel
```

### Stack sugerido para Landing Page

**Opción A: HTML estático + JavaScript vanilla**
- Más simple
- Deploy en Vercel/Netlify
- 1 archivo HTML + CSS + JS

**Opción B: Next.js página separada**
- Integrado con el resto del proyecto
- `/public-landing` route
- Server-side tracking

---

## RESUMEN DE ENTREGABLES

### Para Claude AI (TÚ):

1. **WF-D2 Payment Protection**
   - Workflow completo en n8n
   - 15 nodos (webhook, checks, waits, notifications)
   - Testing con booking de prueba

2. **Funciones RPC Supabase**
   - `get_weekly_summary(p_tenant_id UUID)`
   - `get_monthly_summary(p_tenant_id UUID)`
   - Testing de ambas funciones

3. **WF-OSIRIS actualizado**
   - Añadir 2 nuevos tools (weekly, monthly)
   - Modificar nodo "Execute Tool" para detectarlos
   - Testing: "Dame el resumen semanal"

### Para Claude Code (YO - después de que termines):

1. **Conectar Autopilot.jsx con Supabase**
   - Fetch metrics, alerts, actions
   - Conectar botones Approve/Reject
   - Testing en localhost

2. **Landing Page Izumi Hotel**
   - Formulario → WF-03-LEAD-HANDLER
   - Tracking UTM
   - WhatsApp fallback

---

## CHECKLIST DE VERIFICACIÓN

Cuando termines, verificar:

- [ ] WF-D2 está activo en n8n
- [ ] Probar con booking de prueba: debe enviar 2 reminders y expirar a las 24h
- [ ] `get_weekly_summary()` devuelve JSON válido
- [ ] `get_monthly_summary()` devuelve JSON válido
- [ ] OSIRIS responde a: "Dame el resumen de la semana"
- [ ] OSIRIS responde a: "Dame el resumen del mes"
- [ ] WF-03-LEAD-HANDLER recibe leads de página web correctamente

---

## INFORMACIÓN DE CONEXIÓN

**Supabase:**
```
URL: https://jjpscimtxrudtepzwhag.supabase.co
API Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

**n8n:**
```
URL: https://n8n-production-bb2d.up.railway.app
```

**Izumi Hotel (Tenant de prueba):**
```
tenant_id: c24393db-d318-4d75-8bbf-0fa240b9c1db
property_id: 18711359-1378-4d12-9ea6-fb31c0b1bac2
whatsapp_number: +6281325764867
phone_number_id: 944855278702577
chakra_plugin_id: 2e45a0bd-8600-41b4-ac92-599d59d6221c
```

---

**Documento creado:** 26 Enero 2026
**Para:** Claude AI
**Prioridad:** 🔴 ALTA - Cerrar flujos AUTOPILOT
