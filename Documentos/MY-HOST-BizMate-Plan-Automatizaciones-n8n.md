# MY HOST BizMate - PLAN COMPLETO DE AUTOMATIZACIONES

**Proyecto:** Automatizaciones con n8n + IA  
**Fecha:** Noviembre 2025  
**Autor:** José + Claude AI  
**Objetivo:** Implementar 21 flujos automatizados paso a paso

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Los 21 Flujos Identificados](#los-21-flujos-identificados)
3. [Top 10 Flujos Priorizados](#top-10-flujos-priorizados)
4. [Plan Semanal Detallado](#plan-semanal-detallado)
5. [Flujo Estrella: Recomendaciones IA Diarias](#flujo-estrella-recomendaciones-ia-diarias)
6. [Clasificación Completa de Flujos](#clasificación-completa-de-flujos)
7. [Checklist y Preparación](#checklist-y-preparación)
8. [Recursos y Credenciales](#recursos-y-credenciales)

---

## 1. RESUMEN EJECUTIVO

### Objetivo General
Automatizar operaciones de MY HOST BizMate mediante 21 flujos de n8n que combinan:
- ✅ Gestión de reservas y pagos
- ✅ Inteligencia Artificial (Claude API)
- ✅ Comunicaciones multi-canal (Email, WhatsApp, Telegram)
- ✅ Operaciones hoteleras diarias
- ✅ Marketing y retención
- ✅ Reporting automático

### Metodología de Aprendizaje
- 📚 Aprender haciendo (paso a paso)
- 🎯 Empezar por flujos simples → avanzados
- 🧪 Probar cada flujo antes de avanzar
- 📝 Documentar todo
- 🔄 Iterar y mejorar

### Herramientas
- **n8n** (Railway) - Automatizaciones
- **Supabase** - Base de datos y triggers
- **Claude API** - Inteligencia Artificial
- **SendGrid** - Email
- **Twilio** - WhatsApp
- **Stripe** - Pagos
- **Telegram** - Notificaciones staff

---

## 2. LOS 21 FLUJOS IDENTIFICADOS

### CATEGORÍA 1: RESERVAS Y PAGOS (5 flujos)

**Flujo 1:** Reserva nueva → Generar enlace de pago y enviar Email/WhatsApp  
**Flujo 2:** Confirmación de pago → Actualizar estado y notificar staff  
**Flujo 3:** Flujo operativo multi-canal (email huésped + mensajes staff + tareas)  
**Flujo 10:** Gestión diaria reservas → Actualizar disponibilidad habitaciones  
**Flujo 11:** Confirmación de pagos y seguimiento por huésped  

---

### CATEGORÍA 2: INTELIGENCIA ARTIFICIAL (6 flujos)

**Flujo 4:** Agente IA que responde dudas con datos de Supabase  
**Flujo 5:** IA redacta mensajes según evento (reserva, cambio, cancelación)  
**Flujo 6:** Mensajes VIP automatizados a super buyers  
**Flujo 9:** Planes completos estancia turistas (ej: 7 días en Bali)  
**Flujo 20:** ⭐ Recomendaciones diarias personalizadas IA (ESTRELLA)  
**Flujo 21:** Videos y publicación semanal en redes sociales  

---

### CATEGORÍA 3: OPERACIONES HOTEL (9 flujos)

**Flujo 7:** Seguimiento y retención con comunicaciones periódicas  
**Flujo 12:** Envío automático emails/WhatsApp bienvenida  
**Flujo 13:** Coordinación staff para limpieza y mantenimiento  
**Flujo 14:** Preparación check-in/check-out con instrucciones  
**Flujo 15:** Monitorización y respuesta a comentarios turísticos  
**Flujo 16:** CRM y historial de clientes actualizado  
**Flujo 17:** Upsell/cross-sell automático por comportamiento  
**Flujo 19:** Comunicación interna diaria al staff con agenda  

---

### CATEGORÍA 4: REPORTING (2 flujos)

**Flujo 8:** Dashboards en tiempo real con análisis de ventas  
**Flujo 18:** Reportes diarios de ocupación e ingresos  

---

## 3. TOP 10 FLUJOS PRIORIZADOS

### Criterios de Priorización
- 🔥 **Impacto:** Beneficio inmediato para el negocio
- 🎓 **Aprendizaje:** Valor educativo en n8n y IA
- ⭐ **Complejidad:** Balance entre desafío y factibilidad

---

### NIVEL 1: FUNDAMENTALES (Empezar aquí)

#### 1. Reserva nueva → Email/WhatsApp
```
Complejidad: ⭐ (Fácil)
Impacto: 🔥🔥🔥 (Crítico)
Aprendizaje: 🎓🎓🎓 (Excelente)
Tiempo: 45 minutos
Prioridad: DÍA 1
```

**Qué aprenderás:**
- Triggers de Supabase
- Webhooks en n8n
- SendGrid integration
- Twilio WhatsApp integration
- Multi-canal notifications

**Arquitectura:**
```
Supabase INSERT booking
    ↓
Trigger on_booking_insert
    ↓
n8n Webhook recibe datos
    ↓
n8n Get complete data
    ↓
SendGrid → Email confirmación
    ↓
Twilio → WhatsApp al host
```

---

#### 2. Confirmación pago → Actualizar + Notificar
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥🔥 (Crítico)
Aprendizaje: 🎓🎓 (Muy bueno)
Tiempo: 1 hora
Prioridad: DÍA 2
```

**Qué aprenderás:**
- Stripe webhooks
- Webhook validation
- Conditional logic
- Database updates
- Team notifications

**Arquitectura:**
```
Stripe Payment Success
    ↓
Webhook → n8n
    ↓
Validate event
    ↓
Update Supabase (status: confirmed)
    ↓
WhatsApp host + Email guest
```

---

#### 3. Email/WhatsApp Bienvenida Automático
```
Complejidad: ⭐ (Fácil)
Impacto: 🔥🔥 (Alto)
Aprendizaje: 🎓🎓 (Muy bueno)
Tiempo: 30 minutos
Prioridad: DÍA 1
```

**Qué aprenderás:**
- Scheduled triggers (cron)
- Date calculations
- Template personalization
- Batch processing

**Arquitectura:**
```
Cron: Daily 8am
    ↓
Query bookings (check_in = tomorrow)
    ↓
For each booking:
    SendGrid + Twilio
    ↓
Update sent_welcome = true
```

---

### NIVEL 2: INTELIGENCIA ARTIFICIAL

#### 4. Agente IA Responde Consultas ⭐
```
Complejidad: ⭐⭐⭐ (Avanzada)
Impacto: 🔥🔥🔥 (Crítico)
Aprendizaje: 🎓🎓🎓 (Excelente)
Tiempo: 1.5 horas
Prioridad: DÍA 3
```

**Qué aprenderás:**
- Claude API integration
- Context building
- Dynamic responses
- Prompt engineering
- AI + Database combination

**Arquitectura:**
```
Webhook recibe pregunta + email
    ↓
Supabase query: buscar reserva
    ↓
Build context for AI
    ↓
Claude API: generar respuesta
    ↓
Send response (Email/WhatsApp)
```

**Ejemplo:**
```
Pregunta: "¿Cuándo es mi check-in?"

Context para Claude:
- Huésped: María García
- Reserva: #1234
- Check-in: 2025-11-20 14:00
- Villa: Lotus Suite
- Noches: 5

Claude responde:
"Hola María! Tu check-in es el 20 de noviembre 
a las 14:00 en Villa Lotus Suite. Te esperamos 
con la villa preparada y lista para ti. 
¿Necesitas transporte desde el aeropuerto?"
```

---

#### 5. IA Redacta Mensajes por Evento
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥 (Alto)
Aprendizaje: 🎓🎓🎓 (Excelente)
Tiempo: 1 hora
Prioridad: DÍA 3
```

**Qué aprenderás:**
- Event-driven automation
- Dynamic prompt engineering
- Multi-scenario AI
- Template generation

**Eventos:**
- new_booking → Welcome email
- change_dates → Confirmation email
- cancelled → Sorry to see you go
- check_in_tomorrow → Reminder
- check_out_today → Review request

**Arquitectura:**
```
Event trigger
    ↓
Get booking details
    ↓
Claude API: Generate email for {{ event_type }}
    ↓
Send personalized message
    ↓
Update flags in Supabase
```

---

#### 6. Recomendaciones Diarias IA ⭐⭐⭐ (ESTRELLA)
```
Complejidad: ⭐⭐⭐ (Avanzada)
Impacto: 🔥🔥🔥 (Crítico)
Aprendizaje: 🎓🎓🎓 (Excelente)
Tiempo: 2-3 horas
Prioridad: DÍA 5
```

**Por qué es ESTRELLA:**
- Combina todo: Cron + DB + Loop + AI + Multi-canal
- Diferenciador competitivo único
- Máximo aprendizaje de n8n
- Alto impacto en experiencia cliente

*(Ver sección detallada más abajo)*

---

### NIVEL 3: OPERACIONES AVANZADAS

#### 7. Generar Enlace Pago Automático
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥🔥 (Crítico)
Aprendizaje: 🎓🎓 (Muy bueno)
Tiempo: 1 hora
Prioridad: DÍA 2
```

**Qué aprenderás:**
- Stripe Payment Links API
- Payment tracking
- Database updates
- Link generation

---

#### 8. Check-in/Check-out Automático
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥 (Alto)
Aprendizaje: 🎓 (Bueno)
Tiempo: 1 hora
Prioridad: DÍA 4
```

**Qué aprenderás:**
- Time-based triggers
- Instruction templates
- Multi-step workflows

---

#### 9. Coordinación Staff Limpieza
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥 (Alto)
Aprendizaje: 🎓🎓 (Muy bueno)
Tiempo: 1.5 horas
Prioridad: DÍA 4
```

**Qué aprenderás:**
- Team notifications
- Task management
- Telegram integration
- Status tracking

---

#### 10. Reportes Automáticos Diarios
```
Complejidad: ⭐⭐ (Media)
Impacto: 🔥🔥 (Alto)
Aprendizaje: 🎓🎓 (Muy bueno)
Tiempo: 1.5 horas
Prioridad: Semana 2
```

**Qué aprenderás:**
- Data aggregation
- Chart generation
- Email reports
- Scheduled reporting

---

## 4. PLAN SEMANAL DETALLADO

### DÍA 1 (HOY) - FUNDAMENTOS 🚀

**Objetivo:** Dominar triggers + multi-canal

#### MAÑANA (2 horas)

**FLUJO 1: Reserva nueva → Email/WhatsApp**

**Paso 1: Crear tabla bookings (si no existe)**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Paso 2: Crear trigger en Supabase**
```sql
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n-production-bb2d.up.railway.app/webhook/booking-created',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'booking_id', NEW.id,
      'property_id', NEW.property_id,
      'guest_name', NEW.guest_name,
      'guest_email', NEW.guest_email,
      'guest_phone', NEW.guest_phone,
      'check_in', NEW.check_in,
      'check_out', NEW.check_out,
      'total_price', NEW.total_price,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_insert
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_created();
```

**Paso 3: Crear workflow en n8n**
```
[Webhook] booking-created
    ↓
[Supabase Get Property]
    Query property details by property_id
    ↓
[SendGrid Email] → Guest
    To: {{ $json.guest_email }}
    Subject: Reserva Confirmada - {{ $node["Supabase"].json.name }}
    Body: Confirmación de tu reserva...
    ↓
[Twilio WhatsApp] → Host
    To: whatsapp:+34XXXXXXXXX
    Body: 🏠 Nueva reserva
          {{ $json.guest_name }}
          {{ $json.check_in }} - {{ $json.check_out }}
          ${{ $json.total_price }}
```

**Paso 4: Probar**
```sql
-- Insertar booking de prueba
INSERT INTO bookings (
  property_id,
  user_id,
  guest_name,
  guest_email,
  check_in,
  check_out,
  total_price
) VALUES (
  'tu-property-id',
  'tu-user-id',
  'Test Guest',
  'test@example.com',
  '2025-12-01',
  '2025-12-05',
  1400.00
);
```

**Paso 5: Verificar**
- ✅ Email llegó al guest
- ✅ WhatsApp llegó al host
- ✅ Workflow verde en n8n
- ✅ Guardar workflow

---

#### TARDE (2 horas)

**FLUJO 3: Email/WhatsApp Bienvenida 24h antes**

**Paso 1: Crear workflow con Cron**
```
[Schedule Trigger] Every day at 8:00 AM
    ↓
[Supabase Query] Get bookings checking in tomorrow
    SELECT * FROM bookings
    WHERE check_in = CURRENT_DATE + INTERVAL '1 day'
    AND status = 'confirmed'
    AND welcome_email_sent = false
    ↓
[Loop] For each booking:
    ↓
    [Supabase Get Property] Get villa details
    ↓
    [SendGrid] Welcome Email
        Subject: ¡Mañana es tu llegada a {{ property.name }}!
        Body: Instrucciones check-in, WiFi, contacto...
    ↓
    [Twilio WhatsApp] Welcome message
        Text: Hola {{ guest_name }}! Mañana te esperamos...
    ↓
    [Supabase Update] Mark welcome_email_sent = true
```

**Paso 2: Añadir columna a tabla**
```sql
ALTER TABLE bookings
ADD COLUMN welcome_email_sent BOOLEAN DEFAULT false;
```

**Paso 3: Probar manualmente**
- Crear booking con check_in = mañana
- Ejecutar workflow manualmente
- Verificar emails/WhatsApp
- Verificar flag updated

---

### DÍA 2 - PAGOS 💰

**Objetivo:** Integrar Stripe end-to-end

#### MAÑANA (2 horas)

**FLUJO 7: Generar enlace pago**

**Paso 1: Configurar Stripe en n8n**
```
Credenciales Stripe:
- API Key (Secret Key)
- Decidir: Payment Links o Checkout Sessions
```

**Paso 2: Workflow**
```
[Webhook] booking-created
    ↓
[Stripe Create Payment Link]
    Product: Reserva {{ property.name }}
    Amount: {{ booking.total_price }}
    Currency: USD
    Success URL: https://yoursite.com/booking-success
    Cancel URL: https://yoursite.com/booking-cancelled
    ↓
[Supabase Update]
    UPDATE bookings
    SET payment_link = {{ $node["Stripe"].json.url }}
    WHERE id = {{ booking_id }}
    ↓
[SendGrid]
    Subject: Completa tu Reserva
    Body: Haz click para pagar: {{ payment_link }}
```

**Paso 3: Probar**
- Crear booking
- Verificar link generado
- Abrir link (modo test)
- Hacer pago de prueba

---

#### TARDE (1.5 horas)

**FLUJO 2: Confirmación de pago**

**Paso 1: Configurar webhook Stripe → n8n**
```
Stripe Dashboard → Webhooks
URL: https://n8n-production-bb2d.up.railway.app/webhook/stripe-payment
Events: payment_intent.succeeded
```

**Paso 2: Workflow**
```
[Webhook] stripe-payment
    ↓
[Filter] Only payment_intent.succeeded events
    ↓
[Supabase Query] Find booking by payment_intent_id
    ↓
[Supabase Update]
    UPDATE bookings
    SET 
      status = 'confirmed',
      payment_status = 'paid',
      payment_date = now()
    WHERE id = {{ booking_id }}
    ↓
[SendGrid] → Guest
    Subject: ✅ Pago Confirmado
    Body: Tu reserva está confirmada...
    ↓
[Twilio WhatsApp] → Host
    Text: 💰 Pago recibido: {{ guest_name }} - ${{ amount }}
```

**Paso 3: Probar end-to-end**
- Crear booking → genera link
- Pagar con tarjeta test
- Verificar webhook recibido
- Verificar status updated
- Verificar notifications sent

---

### DÍA 3 - INTELIGENCIA ARTIFICIAL 🤖

**Objetivo:** Dominar Claude API + Context

#### MAÑANA (2 horas)

**FLUJO 4: Agente IA Responde Consultas**

**Paso 1: Entender Claude API**
```javascript
// Llamada a Claude API desde n8n
POST https://api.anthropic.com/v1/messages
Headers: {
  "Content-Type": "application/json",
  "x-api-key": "tu-api-key",
  "anthropic-version": "2023-06-01"
}
Body: {
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "messages": [{
    "role": "user",
    "content": "Tu prompt aquí"
  }]
}
```

**Paso 2: Workflow**
```
[Webhook] guest-question
    Recibe: {
      "email": "guest@example.com",
      "question": "¿Cuándo es mi check-in?"
    }
    ↓
[Supabase Query] Find booking
    SELECT * FROM bookings
    WHERE guest_email = {{ email }}
    AND status = 'confirmed'
    LIMIT 1
    ↓
[Supabase Get Property] Get villa details
    ↓
[HTTP Request] → Claude API
    Prompt:
    "Eres el concierge de {{ property.name }}.
     
     DATOS DE LA RESERVA:
     - Huésped: {{ booking.guest_name }}
     - Check-in: {{ booking.check_in }} a las 14:00
     - Check-out: {{ booking.check_out }} a las 11:00
     - Villa: {{ property.name }}
     - Ubicación: {{ property.location }}
     
     PREGUNTA DEL HUÉSPED:
     {{ question }}
     
     INSTRUCCIONES:
     - Responde de forma cálida y profesional
     - Usa los datos reales de la reserva
     - Máximo 150 palabras
     - Si no sabes algo, ofrece contactar al equipo
     - Tono: Amigable, útil, local"
    ↓
[Function] Extract AI response
    response = $json.content[0].text
    ↓
[SendGrid] Send answer to guest
```

**Paso 3: Probar con preguntas reales**
```
Pregunta 1: "¿A qué hora es el check-in?"
Pregunta 2: "¿Tienen WiFi?"
Pregunta 3: "¿Cómo llego desde el aeropuerto?"
Pregunta 4: "¿Puedo hacer late checkout?"
Pregunta 5: "¿Dónde están las toallas?"
```

---

#### TARDE (1.5 horas)

**FLUJO 5: IA Redacta Mensajes por Evento**

**Paso 1: Definir eventos y templates**
```
Eventos:
- new_booking
- change_dates
- cancelled
- check_in_tomorrow
- check_out_today
- payment_reminder
```

**Paso 2: Workflow con Switch**
```
[Webhook] booking-event
    Recibe: {
      "event": "new_booking",
      "booking_id": "abc-123"
    }
    ↓
[Supabase Get Booking + Property]
    ↓
[Switch] By event type
    ↓
    ├─ new_booking → [Claude] Generate welcome email
    ├─ change_dates → [Claude] Generate confirmation
    ├─ cancelled → [Claude] Generate sorry message
    ├─ check_in_tomorrow → [Claude] Generate reminder
    └─ check_out_today → [Claude] Generate thank you + review
    ↓
[SendGrid] Send generated email
    ↓
[Supabase Update] Mark email sent
```

**Paso 3: Prompts por evento**

**new_booking:**
```
"Redacta un email de bienvenida para:
Huésped: {{ guest_name }}
Villa: {{ property.name }}
Check-in: {{ check_in }}
Duración: {{ nights }} noches

Incluye:
- Bienvenida cálida
- Confirmación de fechas
- Próximos pasos (pago si aplica)
- Info de contacto para dudas
Tono: Profesional pero cercano
Máximo: 200 palabras"
```

**check_out_today:**
```
"Redacta email de despedida para:
Huésped: {{ guest_name }}
Que se va hoy de {{ property.name }}

Incluye:
- Agradecimiento por hospedarse
- Recordatorio check-out 11:00
- Solicitud amable de review
- Invitación a volver
Tono: Cálido, agradecido
Máximo: 150 palabras"
```

---

### DÍA 4 - OPERACIONES 📊

**Objetivo:** Automatizar tareas diarias del hotel

#### MAÑANA (2 horas)

**FLUJO 8: Check-in/Check-out Automático**

**Workflow 1: Pre-arrival (2 días antes)**
```
[Cron] Daily 9:00 AM
    ↓
[Supabase Query] Bookings checking in in 2 days
    ↓
[Loop] Each booking:
    ↓
    [Claude API] Generate pre-arrival email
        Prompt: "Info útil pre-llegada:
        - Qué traer
        - Clima esperado
        - Actividades recomendadas
        - Transporte desde aeropuerto"
    ↓
    [SendGrid] Send pre-arrival info
    ↓
    [Update] pre_arrival_sent = true
```

**Workflow 2: Day of check-in**
```
[Cron] Daily 8:00 AM
    ↓
[Supabase Query] Bookings checking in today
    ↓
[Loop] Each booking:
    ↓
    [SendGrid] Check-in instructions
        - Dirección exacta
        - Código acceso
        - WiFi password
        - Contacto emergencia
    ↓
    [Twilio WhatsApp] Welcome message
    ↓
    [Telegram] Notify staff: "Check-in hoy: {{ guest }}"
```

**Workflow 3: Day of check-out**
```
[Cron] Daily 8:00 AM
    ↓
[Supabase Query] Bookings checking out today
    ↓
[Loop] Each booking:
    ↓
    [SendGrid] Check-out reminder
        - Hora: 11:00 AM
        - Dejar llaves en...
        - Agradecer estancia
    ↓
    [Telegram] Notify cleaning: "Limpieza después de {{ time }}"
```

**Workflow 4: Post-departure (1 día después)**
```
[Cron] Daily 10:00 AM
    ↓
[Supabase Query] Checked out yesterday
    ↓
[Loop] Each booking:
    ↓
    [Claude API] Generate thank you + review request
    ↓
    [SendGrid] Send email
    ↓
    [Update] review_requested = true
```

---

#### TARDE (1.5 horas)

**FLUJO 9: Coordinación Staff Limpieza**

**Paso 1: Crear tabla cleaning_tasks**
```sql
CREATE TABLE cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  property_id UUID REFERENCES properties(id),
  task_type TEXT, -- 'checkout', 'daily', 'deep'
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT DEFAULT 'pending',
  assigned_to TEXT,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Paso 2: Workflow automático**
```
[Trigger] On booking check-out
    ↓
[Create Cleaning Task]
    INSERT INTO cleaning_tasks (
      booking_id,
      property_id,
      task_type: 'checkout',
      scheduled_date: check_out_date,
      scheduled_time: '11:30:00'
    )
    ↓
[Telegram Group] Notify cleaning team
    "🧹 LIMPIEZA CHECKOUT
    Villa: {{ property.name }}
    Hora: 11:30 AM
    Huésped salió: {{ guest_name }}
    Siguiente check-in: {{ next_checkin }}"
    ↓
[WhatsApp] Assigned cleaner
    "Limpieza asignada:
    {{ property.name }}
    Hoy {{ time }}
    
    Responde OK cuando completes"
```

**Paso 3: Confirmación de limpieza**
```
[Webhook] cleaning-completed
    Recibe: {
      "task_id": "abc",
      "completed_by": "María",
      "photos": ["url1", "url2"]
    }
    ↓
[Update Task] Status = completed
    ↓
[Telegram] Notify manager
    "✅ Limpieza completa
    Villa: {{ property }}
    Por: {{ cleaner }}
    Hora: {{ time }}"
```

---

### DÍA 5 - ESTRELLA: RECOMENDACIONES IA DIARIAS ⭐

**Objetivo:** El workflow más potente - combinación total

*(Ver sección detallada completa más abajo)*

---

## 5. FLUJO ESTRELLA: RECOMENDACIONES IA DIARIAS

### Por Qué Es El Más Importante

**Combina TODO lo aprendido:**
1. ✅ Cron scheduling (automated triggers)
2. ✅ Complex database queries
3. ✅ Looping over multiple items
4. ✅ Advanced AI prompting
5. ✅ Multi-channel communication
6. ✅ External API integration (opcional)
7. ✅ State management (flags)
8. ✅ Error handling

**Impacto en el negocio:**
- 🎯 Diferenciador competitivo único
- 🎯 Mejora experiencia huésped dramáticamente
- 🎯 Aumenta reviews positivas
- 🎯 Fomenta upsell y servicios extras
- 🎯 Genera lealtad de marca

---

### Arquitectura Completa Paso a Paso

```
┌─────────────────────────────────────────────────────┐
│  TRIGGER: Cron Schedule (Every day 8:00 AM)         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 1: Query Active Guests Today                  │
│                                                     │
│  SELECT                                             │
│    b.*,                                             │
│    p.name as property_name,                         │
│    p.location,                                      │
│    CURRENT_DATE - b.check_in + 1 as day_number,    │
│    b.check_out - b.check_in as total_days          │
│  FROM bookings b                                     │
│  JOIN properties p ON b.property_id = p.id          │
│  WHERE b.check_in <= CURRENT_DATE                   │
│    AND b.check_out >= CURRENT_DATE                  │
│    AND b.status = 'confirmed'                       │
│    AND b.daily_recommendation_sent = false          │
│                                                     │
│  Output: Array of active bookings                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 2: Loop - For Each Guest                      │
└─────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┴────────────────┐
        │                                 │
        ↓                                 ↓
┌──────────────────┐          ┌──────────────────┐
│  Get Guest       │          │  Get Property    │
│  Preferences     │          │  Details         │
│                  │          │                  │
│  - Language      │          │  - Amenities     │
│  - Interests     │          │  - Location      │
│  - Dietary       │          │  - Special       │
└──────────────────┘          └──────────────────┘
        │                                 │
        └────────────────┬────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 3: Get Local Events (Optional)                │
│                                                     │
│  [HTTP Request] → Local Events API                  │
│  Query: Events in Ubud today                        │
│                                                     │
│  OR                                                 │
│                                                     │
│  [Supabase Query] → local_events table              │
│  WHERE location = 'Ubud'                            │
│    AND date = CURRENT_DATE                          │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 4: Build Context for AI                       │
│                                                     │
│  context = {                                        │
│    guest_name: booking.guest_name,                  │
│    property_name: property.name,                    │
│    location: "Ubud, Bali",                          │
│    day_number: booking.day_number,                  │
│    total_days: booking.total_days,                  │
│    language: guest.language || 'es',                │
│    interests: guest.interests || [],                │
│    weather: weather_api_data,                       │
│    local_events: events_array,                      │
│    previous_recommendations: []                     │
│  }                                                  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 5: Call Claude API                            │
│                                                     │
│  POST https://api.anthropic.com/v1/messages         │
│                                                     │
│  Prompt: (Ver prompt detallado abajo)               │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 6: Parse AI Response                          │
│                                                     │
│  ai_response = response.content[0].text             │
│                                                     │
│  Split into:                                        │
│  - email_version (full 200 words)                   │
│  - whatsapp_version (short 80 words)                │
└─────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┴────────────────┐
        │                                 │
        ↓                                 ↓
┌──────────────────┐          ┌──────────────────┐
│  SendGrid Email  │          │  Twilio WhatsApp │
│                  │          │                  │
│  To: guest_email │          │  To: guest_phone │
│  Subject: 🌅     │          │  Message: Short  │
│  Recomendaciones │          │  version with    │
│  para hoy        │          │  emojis          │
│                  │          │                  │
│  Body: Full AI   │          │                  │
│  generated text  │          │                  │
└──────────────────┘          └──────────────────┘
        │                                 │
        └────────────────┬────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 7: Update Database                            │
│                                                     │
│  UPDATE bookings                                    │
│  SET daily_recommendation_sent = true,              │
│      last_recommendation_date = CURRENT_DATE        │
│  WHERE id = booking_id                              │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 8: Log Success                                │
│                                                     │
│  INSERT INTO activity_log (                         │
│    type: 'daily_recommendation',                    │
│    booking_id: booking_id,                          │
│    sent_at: now(),                                  │
│    channels: ['email', 'whatsapp']                  │
│  )                                                  │
└─────────────────────────────────────────────────────┘
                         ↓
        [End of Loop - Next Guest]
                         ↓
┌─────────────────────────────────────────────────────┐
│  STEP 9: Send Summary to Staff                      │
│                                                     │
│  [Telegram] → Staff group                           │
│  "✅ Recomendaciones diarias enviadas               │
│   Total huéspedes activos: {{ count }}              │
│   Emails enviados: {{ success_count }}              │
│   Hora: 8:00 AM"                                    │
└─────────────────────────────────────────────────────┘
```

---

### Prompt Detallado para Claude API

```
Eres el concierge personal de {{ property_name }}, un hotel boutique 
en {{ location }}.

INFORMACIÓN DEL HUÉSPED:
- Nombre: {{ guest_name }}
- Día {{ day_number }} de {{ total_days }} de su estancia
- Villa: {{ property_name }}
- Idioma preferido: {{ language }}
- Intereses: {{ interests }}

CONTEXTO LOCAL HOY:
- Ubicación: Ubud, Bali
- Clima: {{ weather.description }}, {{ weather.temp }}°C
- Eventos locales: {{ local_events }}

TU TAREA:
Genera recomendaciones personalizadas para HOY que incluyan:

1. ACTIVIDADES (2-3 sugerencias específicas)
   - Nombre del lugar/actividad
   - Horario recomendado
   - Por qué es especial HOY
   - Tiempo necesario
   - Costo aproximado si aplica

2. GASTRONOMÍA (1-2 restaurantes/warungs locales)
   - Nombre del lugar
   - Qué pedir (plato específico)
   - Rango de precio
   - Por qué es auténtico

3. TIP CULTURAL O PRÁCTICO
   - Un consejo útil para hoy
   - Relacionado con costumbres locales, festividades, o algo útil

4. CLIMA Y MEJOR MOMENTO DEL DÍA
   - Cuándo hacer qué actividad según el clima

REGLAS IMPORTANTES:
- Escribe en {{ language }}
- Tono: Cálido, personal, como un amigo local
- Usa emojis relevantes pero con moderación (3-5 máximo)
- Máximo 200 palabras
- Sé específico con nombres y lugares reales
- Personaliza según el día de estancia (primer día vs último día)
- Si es su último día, incluye despedida emotiva
- Incluye llamada a acción suave (ej: "¿Necesitas ayuda con reservas?")

FORMATO:
Genera DOS versiones:

VERSION_EMAIL:
[Texto completo de 200 palabras con formato visual bonito]

VERSION_WHATSAPP:
[Versión condensada de 80 palabras, más directa]
```

---

### Ejemplo de Output Esperado

**Para:** María García  
**Día:** 3 de 5  
**Villa:** Lotus Suite  
**Idioma:** Español

**VERSION_EMAIL:**

```
🌅 ¡Buenos días María!

Día 3 en Villa Lotus - ¡Ya eres toda una local de Ubud! 🌴

🎯 PARA HOY:

🏞️ ACTIVIDADES
• **Tegalalang Rice Terraces** (6:30-8:00 AM)  
  Ve temprano antes del calor - las terrazas están perfectas para fotos
  y casi sin turistas. Café con vista incluido. $10

• **Pura Tirta Empul** (10:00 AM)  
  Ritual de purificación en templo sagrado. Trae sarong (te prestamos 
  uno) y ropa de cambio. Experiencia espiritual única.

• **Ubud Art Market** (4:00 PM)  
  Hora perfecta para regatear sin el calor del mediodía. 
  Arte local auténtico.

🍜 GASTRONOMÍA
• **Warung Biah Biah** - Nasi goreng más auténtico de Ubud ($3)
• **Kafe** - Sunset con vista al río Ayung ($15)

💡 TIP DEL DÍA
Hoy es día de ceremonia en muchos templos - verás procesiones 
coloridas por las calles. ¡Son fotogénicas pero siempre pide 
permiso antes de fotografiar!

☀️ CLIMA: Soleado 28°C - Perfecto para explorar

¿Necesitas transporte o reservas? ¡Responde este mensaje! 📱

Selamat pagi! (Buenos días en balinés)  
Tu equipo de Villa Lotus 🌺
```

**VERSION_WHATSAPP:**

```
🌅 ¡Hola María! Día 3 en Lotus Suite

PLAN HOY:
🏞️ Tegalalang 6:30am (mejor hora)
🛕 Tirta Empul 10am (ritual purificación)
🎨 Art Market 4pm (regateo!)

🍜 COME: Warung Biah Biah - nasi goreng auténtico $3

💡 TIP: Hoy ceremonias en templos - procesiones coloridas!

☀️ 28°C - día perfecto

¿Ayuda con reservas? Responde aquí 📱

Selamat pagi! 🌺
```

---

### Schema de Base de Datos Necesario

```sql
-- Añadir columnas a bookings
ALTER TABLE bookings
ADD COLUMN daily_recommendation_sent BOOLEAN DEFAULT false,
ADD COLUMN last_recommendation_date DATE,
ADD COLUMN language TEXT DEFAULT 'es',
ADD COLUMN interests TEXT[];

-- Tabla de eventos locales (opcional)
CREATE TABLE local_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  category TEXT, -- 'festival', 'market', 'ceremony', 'activity'
  price_range TEXT,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de actividades recomendadas (base de conocimiento)
CREATE TABLE recommended_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT, -- 'temple', 'nature', 'food', 'art', 'adventure'
  location TEXT NOT NULL,
  description TEXT,
  best_time TEXT, -- 'morning', 'afternoon', 'evening'
  duration_hours INTEGER,
  price_usd INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Log de recomendaciones enviadas
CREATE TABLE recommendation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  sent_date DATE NOT NULL,
  content_email TEXT,
  content_whatsapp TEXT,
  email_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Mejoras Avanzadas (Opcional - Semana 2+)

**1. Weather API Integration**
```
[HTTP Request] → OpenWeatherMap API
URL: api.openweathermap.org/data/2.5/weather?q=Ubud
Response: {
  temp: 28,
  description: "Sunny",
  humidity: 70
}
```

**2. Personalization Based on Past Behavior**
```sql
-- Tracking guest activity
CREATE TABLE guest_activity (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  activity_type TEXT, -- 'temple_visit', 'adventure', 'food', 'spa'
  date DATE,
  rating INTEGER
);

-- Use in AI prompt:
"Past activities: {{ guest_activity }}
Recommend similar but NEW experiences"
```

**3. A/B Testing Different Prompts**
```
Randomly assign guests to:
- Prompt A: More adventurous tone
- Prompt B: More relaxed tone
- Prompt C: More cultural focus

Track which gets better engagement
```

**4. Click Tracking in Emails**
```
Include UTM parameters in links:
?utm_source=daily_rec&utm_campaign=day{{ day_number }}

Track what guests click on
Improve recommendations over time
```

**5. Feedback Loop**
```
"Did you enjoy today's recommendations? 
 Reply: 👍 or 👎"

Store feedback
Improve AI prompts based on responses
```

---

### Testing Checklist

```
□ Cron trigger funciona (ejecuta a las 8am)
□ Query trae huéspedes correctos
□ Loop procesa múltiples huéspedes
□ Claude API responde correctamente
□ Email tiene formato correcto
□ WhatsApp se envía
□ Flags se actualizan en DB
□ No se envían duplicados
□ Funciona con 0 huéspedes (no error)
□ Funciona con 10+ huéspedes
□ Log registra todo correctamente
□ Telegram notifica al staff
```

---

### Métricas de Éxito

**KPIs a trackear:**
- Tasa de apertura emails (target: >40%)
- Tasa de respuesta WhatsApp (target: >15%)
- Incremento en reviews positivas (+20%)
- Upsell de actividades (+$X por huésped)
- Net Promoter Score improvement

---

## 6. CLASIFICACIÓN COMPLETA DE FLUJOS

### TABLA MAESTRA - TODOS LOS FLUJOS

| # | Flujo | Categoría | ⭐ | 🔥 | 🎓 | Tiempo | Prioridad |
|---|-------|-----------|-----|-----|-----|--------|-----------|
| 1 | Reserva nueva → Email/WhatsApp | Reservas | ⭐ | 🔥🔥🔥 | 🎓🎓🎓 | 45m | **DÍA 1** |
| 2 | Confirmación pago → Actualizar | Pagos | ⭐⭐ | 🔥🔥🔥 | 🎓🎓 | 1h | **DÍA 2** |
| 3 | Operativo multi-canal | Operaciones | ⭐ | 🔥🔥 | 🎓🎓 | 30m | **DÍA 1** |
| 4 | IA Responde consultas | IA | ⭐⭐⭐ | 🔥🔥🔥 | 🎓🎓🎓 | 1.5h | **DÍA 3** |
| 5 | IA Redacta mensajes | IA | ⭐⭐ | 🔥🔥 | 🎓🎓🎓 | 1h | **DÍA 3** |
| 6 | Mensajes VIP | IA | ⭐⭐ | 🔥 | 🎓🎓 | 1h | Sem 2 |
| 7 | Generar enlace pago | Pagos | ⭐⭐ | 🔥🔥🔥 | 🎓🎓 | 1h | **DÍA 2** |
| 8 | Dashboards tiempo real | Reporting | ⭐⭐⭐ | 🔥🔥 | 🎓🎓 | 2h | Sem 3 |
| 9 | Planes estancia IA | IA | ⭐⭐⭐ | 🔥🔥 | 🎓🎓🎓 | 2h | Sem 3 |
| 10 | Actualizar disponibilidad | Reservas | ⭐⭐ | 🔥🔥 | 🎓 | 1h | Sem 2 |
| 11 | Seguimiento pagos | Pagos | ⭐⭐ | 🔥🔥 | 🎓 | 1h | Sem 2 |
| 12 | Email/WhatsApp bienvenida | Operaciones | ⭐ | 🔥🔥 | 🎓🎓 | 30m | **DÍA 1** |
| 13 | Coordinación limpieza | Operaciones | ⭐⭐ | 🔥🔥 | 🎓🎓 | 1.5h | **DÍA 4** |
| 14 | Check-in/Check-out | Operaciones | ⭐⭐ | 🔥🔥 | 🎓 | 1h | **DÍA 4** |
| 15 | Monitoreo comentarios | Marketing | ⭐⭐⭐ | 🔥 | 🎓🎓 | 2h | Sem 3 |
| 16 | CRM automático | Operaciones | ⭐⭐ | 🔥 | 🎓 | 1.5h | Sem 3 |
| 17 | Upsell automático | Marketing | ⭐⭐ | 🔥🔥 | 🎓🎓 | 1h | Sem 2 |
| 18 | Reportes ocupación | Reporting | ⭐⭐ | 🔥🔥 | 🎓🎓 | 1.5h | Sem 2 |
| 19 | Comunicación staff | Operaciones | ⭐⭐ | 🔥🔥 | 🎓 | 1h | Sem 2 |
| 20 | **Recomendaciones IA diarias** ⭐ | **IA** | **⭐⭐⭐** | **🔥🔥🔥** | **🎓🎓🎓** | **2-3h** | **DÍA 5** |
| 21 | Videos social networks | Marketing | ⭐⭐⭐ | 🔥 | 🎓🎓 | 3h | Sem 4 |

**Leyenda:**
- ⭐ = Complejidad (1-3 estrellas)
- 🔥 = Impacto en negocio (1-3 fuegos)
- 🎓 = Valor de aprendizaje (1-3 graduaciones)

---

## 7. CHECKLIST Y PREPARACIÓN

### Pre-requisitos Técnicos

#### Supabase
```
□ Cuenta activa
□ Proyecto creado
□ Tabla properties existe
□ Tabla bookings creada (o crear hoy)
□ pg_net extensión habilitada
□ Triggers configurables
□ API URL y Keys disponibles
```

#### n8n
```
□ Instancia en Railway funcionando
□ URL accesible
□ Puede crear workflows
□ Puede exportar/importar workflows
```

#### SendGrid
```
□ Cuenta verificada
□ API Key activa
□ Sender email verificado (josecarrallodelafuente@gmail.com)
□ Templates configurados (opcional)
```

#### Twilio (PENDIENTE - Verificar hoy)
```
□ Cuenta activa
□ Facebook desbloqueó WhatsApp Business
□ Account SID disponible
□ Auth Token disponible
□ WhatsApp Sandbox configurado O
□ WhatsApp Business Number aprobado
□ Tu número de prueba añadido al Sandbox
```

#### Stripe (Para DÍA 2)
```
□ Cuenta creada
□ Modo Test habilitado
□ API Keys (Secret Key)
□ Payment Links o Checkout habilitado
□ Webhook endpoint configurable
```

#### Claude API
```
□ API Key de Anthropic
□ Créditos disponibles
□ Familiaridad con formato de request
```

#### Telegram (Opcional)
```
□ Bot creado con BotFather
□ Bot Token
□ Chat ID del grupo de staff
```

---

### Credenciales Checklist

**CRÍTICO PARA HOY (DÍA 1):**
```
✅ Supabase:
   - URL: https://[tu-proyecto].supabase.co
   - API Key (anon/public)
   - Service Role Key (para n8n)

✅ SendGrid:
   - API Key: SG.QLZsCx...
   - From Email: josecarrallodelafuente@gmail.com

⚠️ Twilio (VERIFICAR):
   - Account SID: AC...
   - Auth Token: ...
   - WhatsApp Number: whatsapp:+14155238886
   - Tu número: whatsapp:+34...
```

**NECESARIO PARA DÍA 2:**
```
□ Stripe:
   - Secret Key: sk_test_...
   - Webhook Secret: whsec_...
```

**NECESARIO PARA DÍA 3:**
```
□ Claude API:
   - API Key: sk-ant-...
   - Model: claude-sonnet-4-20250514
```

**OPCIONAL (Semana 2):**
```
□ Telegram:
   - Bot Token: 123456:ABC-DEF...
   - Chat ID: -100123456789

□ Weather API:
   - OpenWeatherMap API Key

□ Google Calendar:
   - OAuth credentials
```

---

### Estructura de Carpetas Recomendada

```
/my-host-bizmate/
├── docs/
│   ├── n8n-workflows/
│   │   ├── 01-booking-created.json
│   │   ├── 02-payment-confirmed.json
│   │   ├── 03-welcome-messages.json
│   │   ├── 04-ai-guest-support.json
│   │   ├── 05-ai-message-generator.json
│   │   ├── 20-daily-recommendations-ai.json ⭐
│   │   └── README.md
│   ├── supabase/
│   │   ├── schema.sql (todas las tablas)
│   │   ├── triggers.sql (todos los triggers)
│   │   ├── functions.sql (todas las funciones)
│   │   └── README.md
│   ├── prompts/
│   │   ├── ai-guest-support.md
│   │   ├── ai-message-generator.md
│   │   ├── daily-recommendations.md
│   │   └── README.md
│   └── architecture/
│       ├── email-automation.md (del otro día)
│       ├── escalabilidad-costos.md (del otro día)
│       └── plan-automatizaciones.md (este documento)
├── .env.automation
└── README.md
```

---

## 8. RECURSOS Y CREDENCIALES

### URLs Importantes

**n8n:**
```
Production: https://n8n-production-bb2d.up.railway.app
Executions: https://n8n-production-bb2d.up.railway.app/workflow/executions
```

**Supabase:**
```
Dashboard: https://supabase.com/dashboard/project/[tu-proyecto]
SQL Editor: https://supabase.com/dashboard/project/[tu-proyecto]/sql
Table Editor: https://supabase.com/dashboard/project/[tu-proyecto]/editor
```

**Stripe:**
```
Dashboard: https://dashboard.stripe.com/test/dashboard
Webhooks: https://dashboard.stripe.com/test/webhooks
Payment Links: https://dashboard.stripe.com/test/payment-links
```

**SendGrid:**
```
Dashboard: https://app.sendgrid.com
API Keys: https://app.sendgrid.com/settings/api_keys
```

**Twilio:**
```
Console: https://console.twilio.com
WhatsApp Sandbox: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
```

---

### Documentación de Referencia

**n8n:**
- Docs: https://docs.n8n.io
- Supabase Node: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/
- SendGrid Node: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.sendgrid/
- Twilio Node: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.twilio/
- HTTP Request: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/

**Claude API:**
- Docs: https://docs.anthropic.com
- Messages API: https://docs.anthropic.com/en/api/messages
- Prompt Engineering: https://docs.anthropic.com/en/docs/prompt-engineering

**Supabase:**
- pg_net: https://supabase.com/docs/guides/database/extensions/pg_net
- Triggers: https://supabase.com/docs/guides/database/postgres/triggers
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

---

### Archivo de Credenciales (.env.automation)

**NUNCA subir a Git - Solo para referencia local**

```env
# Supabase
SUPABASE_URL=https://[tu-proyecto].supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# n8n
N8N_URL=https://n8n-production-bb2d.up.railway.app
N8N_WEBHOOK_BOOKING_CREATED=/webhook/booking-created
N8N_WEBHOOK_PAYMENT_CONFIRMED=/webhook/payment-confirmed
N8N_WEBHOOK_GUEST_QUESTION=/webhook/guest-question

# SendGrid
SENDGRID_API_KEY=SG.YOUR_SENDGRID_API_KEY_HERE
SENDGRID_FROM_EMAIL=josecarrallodelafuente@gmail.com
SENDGRID_FROM_NAME=MY HOST BizMate

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
TWILIO_MY_PHONE=whatsapp:+34...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Claude API
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-sonnet-4-20250514

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789

# Weather API (opcional)
OPENWEATHER_API_KEY=...
```

---

### Comandos Útiles

**Supabase:**
```sql
-- Ver triggers existentes
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Ver funciones
SELECT proname FROM pg_proc WHERE proname LIKE '%notify%';

-- Verificar pg_net
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- Ver webhooks recientes
SELECT * FROM net._http_response
ORDER BY created DESC LIMIT 10;
```

**n8n:**
```bash
# Exportar workflow
# En UI: Workflow → Menu (☰) → Download

# Importar workflow
# En UI: + → Import from File

# Ver logs en Railway
# Railway Dashboard → n8n → Logs
```

---

## RESUMEN EJECUTIVO FINAL

### Semana 1: Objetivos

**DÍA 1:** Fundamentos - Triggers y notificaciones
**DÍA 2:** Pagos - Stripe end-to-end
**DÍA 3:** IA - Claude API integration
**DÍA 4:** Operaciones - Workflows diarios
**DÍA 5:** ⭐ Estrella - Recomendaciones IA

### Resultado Esperado

Al final de la semana tendrás:
- ✅ 7-10 flujos funcionando en producción
- ✅ Dominio completo de n8n
- ✅ Experiencia con Claude API
- ✅ Sistema que diferencia tu hotel de la competencia
- ✅ Base sólida para los otros 11 flujos (Semana 2-4)

### Métricas de Éxito

**Técnicas:**
- [ ] 0 errores en workflows críticos
- [ ] <2 segundos tiempo respuesta IA
- [ ] 100% emails/WhatsApp entregados
- [ ] Workflows documentados y exportados

**Negocio:**
- [ ] Huéspedes reciben comunicaciones oportunas
- [ ] Staff coordinado automáticamente
- [ ] Pagos procesados sin fricción
- [ ] Experiencia memorable (reviews positivas)

---

## PRÓXIMOS PASOS INMEDIATOS

### AHORA MISMO:

1. ✅ Verificar Facebook/WhatsApp desbloqueado
2. ✅ Reunir credenciales Twilio
3. ✅ Verificar n8n funcionando
4. ✅ Confirmar Supabase accesible
5. ✅ Guardar este documento
6. ✅ Listo para empezar

### CUANDO ESTÉS LISTO:

```
Mensaje: "Listo, tengo Twilio configurado"
O
Mensaje: "Empecemos con Flujo 1"
O  
Mensaje: "Vamos directo al Flujo 20 (Recomendaciones IA)"
```

---

**¡Vamos a construir algo increíble! 🚀**

**¿Por dónde empezamos?** 🎯
