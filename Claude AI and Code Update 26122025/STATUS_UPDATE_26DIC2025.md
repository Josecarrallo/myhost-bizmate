# MY HOST BIZMATE - STATUS UPDATE
## Fecha: 26 de Diciembre 2025

---

## ✅ COMPLETADO HOY

### Internal AI Agent (Owner Operations Assistant)
**Estado:** ✅ COMPLETADO Y COMMITEADO

**Commit:** `5942626`

**Implementación:**
- OpenAI integration (gpt-4o-mini)
- COS System Prompt con scope limitado a PMS
- Monthly limits (300 msg/mes)
- Rate limiting (5 msg/2min)
- KPIs en tiempo real desde Supabase
- Session management (chat limpio)

**Testing:** ✅ Completo
- Respuestas inteligentes ✅
- Scope limitation ✅
- Manejo de fechas ✅
- Rate limiting ✅

**Costo:** ~$0.03 USD/mes por tenant

---

## 🆕 NUEVO REQUIREMENT: GUEST COMMUNICATION

### Objetivo
Añadir funcionalidad de comunicación (Email + WhatsApp) dentro del perfil del huésped.

### Ubicación
**Módulo:** Guests → Guest Profile → Nueva sección "Communication"

### Funcionalidades Requeridas

#### 1. UI Components (Level 1 - Rápido)

**Pantalla de Guests - Guest Profile:**
```
┌─────────────────────────────────────────┐
│ Guest Profile: John Doe                 │
├─────────────────────────────────────────┤
│                                          │
│ [Basic Info] [Bookings] [Communication] │ ← Nueva tab
│                                          │
│ ┌─────────────────────────────────────┐ │
│ │ Communication                        │ │
│ ├─────────────────────────────────────┤ │
│ │                                      │ │
│ │ [📧 Send Email] [💬 Send WhatsApp]  │ │ ← 2 botones
│ │                                      │ │
│ │ Recent Communications:               │ │
│ │ • Email - Welcome (2 days ago)       │ │
│ │ • WhatsApp - Check-in (1 day ago)    │ │
│ │                                      │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### 2. Modal de Envío

**Al hacer click en "Send Email" o "Send WhatsApp":**

```
┌──────────────────────────────────────────┐
│ Send Email / WhatsApp                     │
├──────────────────────────────────────────┤
│                                           │
│ To: john.doe@email.com                   │ ← Pre-filled
│                                           │
│ Template: [Dropdown ▼]                   │
│   - Welcome                               │
│   - Pre check-in                          │
│   - Check-in day                          │
│   - Payment reminder                      │
│   - Review request                        │
│   - Custom (no template)                  │
│                                           │
│ Subject: (si es email)                    │
│ ┌─────────────────────────────────────┐  │
│ │ Welcome to [Property Name]!          │  │
│ └─────────────────────────────────────┘  │
│                                           │
│ Message:                                  │
│ ┌─────────────────────────────────────┐  │
│ │ Dear John,                           │  │ ← Editable
│ │                                      │  │
│ │ Welcome to our property...           │  │
│ │                                      │  │
│ └─────────────────────────────────────┘  │
│                                           │
│         [Cancel]  [Send Message]          │
└──────────────────────────────────────────┘
```

### 3. Base de Datos

**Nueva tabla: `communications_log`**

```sql
CREATE TABLE IF NOT EXISTS public.communications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Multi-tenant
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,

  -- Communication details
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp')),
  template_key TEXT, -- 'welcome', 'pre_checkin', 'checkin_day', 'payment_reminder', 'review_request', null for custom

  -- Email specific
  subject TEXT,

  -- Message
  message_body TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'delivered', 'read')),
  provider_message_id TEXT, -- ID del provider (SendGrid, ChakraHQ, etc.)
  provider_response JSONB, -- Response completa del provider

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Metadata
  sent_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Staff que envió
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comm_tenant ON public.communications_log(tenant_id);
CREATE INDEX idx_comm_guest ON public.communications_log(guest_id);
CREATE INDEX idx_comm_booking ON public.communications_log(booking_id);
CREATE INDEX idx_comm_status ON public.communications_log(status);
CREATE INDEX idx_comm_created ON public.communications_log(created_at DESC);

-- RLS
ALTER TABLE public.communications_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own communications"
  ON public.communications_log FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can insert own communications"
  ON public.communications_log FOR INSERT
  WITH CHECK (tenant_id = auth.uid());
```

### 4. Backend API

**Endpoint sugerido:**

```
POST /api/communications/send
```

**Payload:**
```json
{
  "tenant_id": "uuid",
  "property_id": "uuid",
  "guest_id": "uuid",
  "booking_id": "uuid?",
  "channel": "email" | "whatsapp",
  "template_key": "welcome" | "pre_checkin" | null,
  "subject": "string", // solo para email
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "communication_id": "uuid",
  "status": "queued",
  "message": "Communication queued successfully"
}
```

### 5. Integración con n8n

**Opción recomendada:** Webhook a n8n

**Flow:**
```
Frontend
   ↓
POST /api/communications/send (Supabase Edge Function o API)
   ↓
1. Validar tenant_id (RLS)
2. Guardar en communications_log (status: 'queued')
3. Trigger n8n webhook
   ↓
n8n Workflow
   ↓
IF channel === 'email'
   → SendGrid node
   → Update communications_log (status: 'sent', provider_message_id)

IF channel === 'whatsapp'
   → ChakraHQ node
   → Update communications_log (status: 'sent', provider_message_id)
```

**Webhook n8n:**
```
POST https://n8n-production-bb2d.up.railway.app/webhook/send-communication

Payload:
{
  "communication_id": "uuid",
  "tenant_id": "uuid",
  "guest_id": "uuid",
  "channel": "email|whatsapp",
  "to": "recipient",
  "subject": "string",
  "message": "string",
  "template_key": "string?"
}
```

### 6. Templates (Inicial - Simple)

**Dropdown con 5 templates básicos:**

1. **Welcome**
   - Email subject: "Welcome to [Property Name]!"
   - Message: "Dear [Guest Name], welcome to our property..."

2. **Pre check-in**
   - Subject: "Your check-in is coming up!"
   - Message: "Hi [Guest Name], we're excited to host you on [Check-in Date]..."

3. **Check-in day**
   - Subject: "Welcome! Check-in instructions"
   - Message: "Hi [Guest Name], today is your check-in day! Here are the instructions..."

4. **Payment reminder**
   - Subject: "Payment reminder for booking #[Booking ID]"
   - Message: "Hi [Guest Name], this is a friendly reminder about the pending payment..."

5. **Review request**
   - Subject: "How was your stay at [Property Name]?"
   - Message: "Hi [Guest Name], thank you for staying with us! We'd love to hear about your experience..."

**Variables de reemplazo:**
- `[Guest Name]`
- `[Property Name]`
- `[Check-in Date]`
- `[Check-out Date]`
- `[Booking ID]`
- `[Amount Due]`

### 7. Requisitos Técnicos

**Multi-tenant:**
- ✅ Filtrar por `tenant_id` en todas las queries
- ✅ RLS habilitado en `communications_log`
- ✅ Validar `tenant_id` en backend

**UI/UX:**
- ✅ Mantener diseño V0 + shadcn/ui actual
- ✅ Responsive (mobile + desktop)
- ✅ Loading states mientras envía
- ✅ Success/error notifications (toast)

**Logging:**
- ✅ Guardar TODOS los mensajes enviados
- ✅ Status tracking (queued → sent → delivered → read)
- ✅ Error logging con retry count

**Seguridad:**
- ✅ Validar que guest pertenece al tenant
- ✅ Rate limiting (ej: 50 mensajes/hora por tenant)
- ✅ Sanitizar inputs (prevenir XSS)

### 8. NO Incluido en Fase 1

❌ AI writing assistance (fase 2)
❌ Email templates avanzados (fase 2)
❌ Personalización con datos dinámicos (fase 2)
❌ Scheduling/automation (fase 2)
❌ Bulk send (fase 2)
❌ SMS channel (fase 2)

---

## 📋 IMPLEMENTACIÓN PROPUESTA

### Fase 1: UI + Logging (Estimado: 4-6 horas)

**1. Database Setup (30 min)**
- [ ] Crear tabla `communications_log`
- [ ] Crear indexes
- [ ] Habilitar RLS
- [ ] Test con datos mock

**2. UI Components (2-3 horas)**
- [ ] Crear componente `CommunicationSection`
- [ ] Crear modal `SendCommunicationModal`
- [ ] Integrar en `GuestProfile`
- [ ] Implementar templates dropdown
- [ ] Implementar variable replacement

**3. API Integration (1-2 horas)**
- [ ] Crear función `sendCommunication()` en service
- [ ] Guardar en `communications_log`
- [ ] Trigger n8n webhook
- [ ] Handle success/error responses

**4. Testing (1 hour)**
- [ ] Test email send flow
- [ ] Test WhatsApp send flow
- [ ] Test error handling
- [ ] Test multi-tenant isolation

### Fase 2: n8n Workflow (Estimado: 2-3 horas)

**1. Email Workflow**
- [ ] Webhook trigger
- [ ] SendGrid node
- [ ] Update communications_log

**2. WhatsApp Workflow**
- [ ] Webhook trigger
- [ ] ChakraHQ node
- [ ] Update communications_log

**3. Error Handling**
- [ ] Retry logic
- [ ] Error notifications
- [ ] Fallback handling

---

## 🔗 PRÓXIMOS PASOS

### Prioridad 1: Guest Communication (NUEVO)
Implementar comunicación Email + WhatsApp según especificación arriba

### Prioridad 2: n8n Workflow Integration
Integrar llamadas a los flujos n8n existentes desde el frontend:
- WF-IA-01: Owner AI Assistant (ya parcialmente integrado)
- WF-IA-02: Owner Alerts Engine
- WF-IA-03: Action Executor

### Prioridad 3: Channel Manager & DOMUS
Revisar documentación MYHOST_BIZMATE_FULL_DOCUMENTATION.md para:
- Channel Manager integration
- DOMUS PMS integration
- Payments integration
- Arquitectura Multitenant

---

## 📁 ARCHIVOS DE REFERENCIA

**Documentación:**
- `MYHOST_BIZMATE_FULL_DOCUMENTATION.md` - Doc técnica completa
- `INTERNAL_AI_AGENT_IMPLEMENTATION_26DIC2025.md` - Internal AI Agent
- `PROMPT_CONTINUACION_26122025_v2.md` - Contexto de continuación

**n8n Workflows:**
- `WF-IA-01 - Owner AI Assistant - MYHOST Bizmate XIII.json`
- `WF-IA-02 - Owner AI Recommendation MYHOST Bizamate XII.json`
- `WF-IA-03 - Action Executor MYHOST BizMate XIV.json`

**Supabase:**
- `n8n_Supabase/MYHOST_BizMate_Schema_Definitivo.sql`
- `n8n_Supabase/MYHOST_Supabase_Triggers_Functions_Backup.sql`

---

## ⏰ ESTIMACIÓN DE TIEMPO

| Tarea | Estimado | Prioridad |
|-------|----------|-----------|
| Guest Communication UI + DB | 4-6 hours | 🔴 Alta |
| Guest Communication n8n | 2-3 hours | 🔴 Alta |
| n8n Workflows Integration | 6-8 hours | 🟡 Media |
| Channel Manager | TBD | 🟡 Media |
| DOMUS Integration | TBD | 🟡 Media |

---

**Última actualización:** 26 Diciembre 2025
**Branch:** backup-antes-de-automatizacion
**Commit actual:** 5942626
