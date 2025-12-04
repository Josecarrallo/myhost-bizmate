# ANÁLISIS DE ARQUITECTURA - 21 FLUJOS MYHOST-Bizmate

**Proyecto:** MY HOST BizMate - Automatizaciones
**Fecha Creación:** 28 Noviembre 2025
**Última Actualización:** 02 Diciembre 2025
**Autor:** José + Claude AI
**Objetivo:** Definir qué va en Backend vs n8n workflows

---

## 🎯 ESTADO DEL PROYECTO - 30 NOVIEMBRE 2025

### ✅ COMPLETADO HOY (30 NOV):

**SESIÓN 1 - BACKEND: 3 FLUJOS CRÍTICOS IMPLEMENTADOS:**

1. **check_availability()** - ✅ FUNCIONANDO
   - Función SQL en Supabase
   - Previene double-booking con validación atómica
   - Probado con 4 escenarios reales: TODOS PASARON

2. **calculate_booking_price()** - ✅ FUNCIONANDO
   - Función SQL en Supabase
   - Cálculo completo con todas las reglas de negocio
   - High season multiplier: +30% (Jun-Aug, Dec)
   - Guest surcharge: $20/noche por guest extra
   - Cleaning fee: $50
   - Service fee: 15%
   - Probado con 2 escenarios: TODOS PASARON

3. **Frontend Integration** - ✅ COMPLETADO
   - Actualizado `BookingEngine.jsx` con llamadas a funciones reales
   - Nuevo componente `PricingBreakdown.jsx`
   - Validación de disponibilidad en tiempo real
   - Cálculo de precio dinámico
   - UI muestra disponibilidad y bloquea si no hay

**Archivos modificados:**
- `src/services/supabase.js` - Nuevos métodos para checkAvailability, calculateBookingPrice, createBooking
- `src/components/BookingEngine/BookingEngine.jsx` - Integración completa
- `src/components/BookingEngine/PricingBreakdown.jsx` - Componente nuevo
- `supabase/functions/create-payment-link/` - Edge Function creada (pendiente config auth)

**Git Commit:** `7f63d98` - "Implementar flujos críticos de backend: check_availability y calculate_booking_price"

---

**SESIÓN 2 - FRONTEND: MODERNIZACIÓN COMPLETA DE UI:**

1. **Diseño Corporativo Naranja y Blanco** - ✅ COMPLETADO
   - Aplicado gradiente de fondo naranja (from-orange-400 via-orange-500 to-orange-600)
   - Elementos animados (círculos pulsantes con backdrop blur)
   - Header unificado: "MY HOST BizMate" en blanco/naranja en todas las pantallas
   - Todas las tarjetas convertidas a fondo blanco semi-transparente (bg-white/95 backdrop-blur-sm)

2. **Corrección de Textos Negros → Naranja** - ✅ COMPLETADO
   - Todo el texto negro (text-gray-900/800/700) cambiado a naranja (text-orange-600)
   - Actualizado en 15 pantallas + componentes comunes
   - Inputs del Booking Engine con text-orange-600 y placeholders en gris

3. **Pantallas Modernizadas (15 de 21):**
   - **Operations & Guest Management (7/7):**
     * Dashboard, Bookings, PMS Calendar, Properties, Operations Hub, Digital Check-in, Messages ✅
   - **Revenue & Pricing (5/5):**
     * Payments, Smart Pricing, Reports, Booking Engine, RMS Integration ✅
   - **Pendientes (9 pantallas):**
     * AI Intelligence Layer (3): AI Consultant, Marketing AI, Social Media AI
     * Marketing & Growth (4): Guest Experience, Reviews, Upsell, Channel Manager
     * Workflows & Automations (1): n8n Workflows
     * Settings (1): Settings

4. **Componentes Comunes Actualizados:**
   - BookingCard.jsx - todos los valores en naranja
   - MessageCard.jsx - nombres en naranja
   - PropertyCard.jsx - detalles en naranja
   - PaymentCard.jsx - montos en naranja
   - PricingCard.jsx - títulos en naranja
   - ModuleGridCard.jsx - fondo naranja semi-transparente

5. **Landing Page Ajustada:**
   - Padding superior aumentado (pt-32) para evitar corte del logo
   - Botón "Enter Dashboard" posicionado correctamente (mb-12)

**Archivos modificados (Sesión 2):**
- 21 archivos totales
- 534 inserciones, 4215 eliminaciones
- Componentes: Dashboard, Bookings, Messages, Properties, Operations, Digital Check-in, PMSCalendar, Payments, SmartPricing, Reports, BookingEngine, RMSIntegration
- Componentes comunes: BookingCard, MessageCard, PropertyCard, PaymentCard, PricingCard, ModuleGridCard
- src/App.jsx (landing page y module grid)

**Git Commits Sesión 2:**
- Commit: `bbcbae6` - "Modernizar UI completa con colores corporativos naranja y blanco"
- Push exitoso a repositorio remoto
- Branch: backup-antes-de-automatizacion

---

## 🎯 ESTADO DEL PROYECTO - 02 DICIEMBRE 2025

### ✅ COMPLETADO HOY (02 DIC):

**SESIÓN 3 - FRONTEND: FINALIZACIÓN UI + AJUSTES:**

1. **9 Pantallas Restantes Modernizadas** - ✅ COMPLETADO

   **AI Intelligence Layer (3 pantallas):**
   - AIAssistant.jsx - Consultor IA con análisis de ocupación y recomendaciones
   - Marketing.jsx - Suite de marketing con campañas
   - SocialPublisher.jsx - Publicación en redes sociales
   - CampaignCard.jsx (componente común)

   **Marketing & Growth (4 pantallas):**
   - CulturalIntelligence.jsx - Guest Experience (Coming Soon)
   - Reviews.jsx - Gestión de reseñas multi-plataforma
   - Multichannel.jsx - Channel Manager (Booking.com, Airbnb, Agoda)
   - VoiceAI.jsx - Agente de voz IA para llamadas automatizadas

   **Workflows & Automations (1 pantalla):**
   - Workflows.jsx - Gestión de automatizaciones
   - WorkflowCard.jsx (componente común)

   **Nota:** Settings no existe en el codebase actual

2. **Patrón de Diseño Aplicado:**
   - Fondo: `bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600`
   - Círculos animados con efecto pulse
   - Header "MY HOST BizMate" en blanco (drop-shadow)
   - Tarjetas: `bg-white/95 backdrop-blur-sm`
   - Todo el texto en `text-orange-600`
   - Sombras consistentes y efectos hover

3. **Ajustes Finales Basados en Validación del Usuario:**

   **BookingEngine.jsx:**
   - Agregado header "MY HOST BizMate" en naranja

   **RMSIntegration.jsx:**
   - Cambiado fondo de azul (indigo) a naranja
   - Agregado header "MY HOST BizMate"
   - Todos los botones de indigo/azul → naranja

   **Scroll-to-top fixes (9 pantallas):**
   - Agregado `useEffect(() => window.scrollTo(0, 0), [])` en:
   - AIAssistant, Marketing, SocialPublisher
   - CulturalIntelligence, Reviews, Multichannel
   - VoiceAI, Workflows, Reports
   - Fix: Pantallas ahora empiezan desde arriba en lugar de mitad de página

   **Header color corrections:**
   - VoiceAI: Header "MY HOST" cambiado de blanco → naranja
   - Reviews: Header "MY HOST" cambiado de blanco → naranja

**Archivos modificados (Sesión 3):**
- **Primera ronda (9 pantallas):** 10 archivos modificados, 355 inserciones, 139 eliminaciones
- **Ajustes finales:** 11 archivos modificados, 86 inserciones, 47 eliminaciones
- **Total:** 20 archivos únicos modificados

**Git Commits Sesión 3:**
- Commit 1: `af79eeb` - "feat: Complete UI modernization - Final 9 screens to corporate orange theme"
- Commit 2: `f7d6c5c` - "fix: Final UI adjustments - Headers, colors, and scroll behavior"
- Push exitoso a origin/backup-antes-de-automatizacion
- Branch: backup-antes-de-automatizacion

**Estadísticas Totales UI Modernization:**
- **24 pantallas modernizadas** (15 previas + 9 nuevas)
- **Cobertura completa:** 100% de las pantallas existentes
- **Branding corporativo:** Naranja y blanco consistente en toda la aplicación
- **Tiempo total:** ~26-28 horas (3 sesiones)

---

### ⏸️ PAUSADO (para después):

4. **create_payment_link()** - Edge Function
   - Creada y deployada en Supabase
   - Pendiente: Configuración de autenticación JWT
   - **DECISIÓN:** Implementar Stripe payment link directamente desde frontend (más simple)

---

### ⏭️ PENDIENTE (próxima sesión):

**n8n Workflows - 17 flujos de automatización:**
1. Flujo 1: Nueva reserva → Email/WhatsApp (45 min)
2. Flujo 2: Pago confirmado → Actualizar (1 hora)
3. Flujo 12: Bienvenida 24h antes (30 min)
4. ... (14 flujos más)

**Tiempo estimado total:** 15-20 horas para los 17 workflows

---

---

## ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de Integración](#arquitectura-de-integración)
3. [Tipos de Arquitectura por Flujo](#tipos-de-arquitectura-por-flujo)
4. [Flujos Críticos para Backend](#flujos-críticos-para-backend)
5. [Regla de Oro: Backend vs n8n](#regla-de-oro-backend-vs-n8n)
6. [Clasificación Completa de 21 Flujos](#clasificación-completa-de-21-flujos)
7. [Ejemplo Concreto: Flujo Completo de Reserva](#ejemplo-concreto-flujo-completo-de-reserva)
8. [Próximos Pasos](#próximos-pasos)

---

## 1. RESUMEN EJECUTIVO

### La Pregunta Clave

**"Una vez tenga un flujo probado y aprobado, ¿lo metes en el código backend que estamos haciendo?"**

### La Respuesta

**NO. Los workflows de n8n NO se "meten" en el código backend.**

n8n es un **servicio independiente** que corre en Railway y se integra con tu aplicación mediante:
- **Triggers SQL de Supabase** (cuando se inserta/actualiza data)
- **Webhooks** (llamadas HTTP entre servicios)
- **APIs REST** (n8n lee/escribe en Supabase)

### Arquitectura General

```
Frontend (Vercel React)
    ↓ API calls
Supabase (Database + Backend Logic)
    ↓ Triggers SQL + Webhooks
n8n (Automation Workflows - Railway)
    ↓ External API calls
SendGrid, Twilio, Claude AI, Stripe, etc.
```

**Clave:** Tu código React/Supabase NUNCA cambia por los workflows de n8n.

---

## 2. ARQUITECTURA DE INTEGRACIÓN

### Diagrama Completo

```
┌─────────────────────────────────────────┐
│         FRONTEND (Vercel)               │
│  React 18 + Vite + TailwindCSS          │
│                                         │
│  Componentes:                           │
│  - BookingForm.jsx                      │
│  - PaymentButton.jsx                    │
│  - Dashboard.jsx                        │
└────────────┬────────────────────────────┘
             │
             │ API Calls (REST)
             ↓
┌─────────────────────────────────────────┐
│      SUPABASE (PostgreSQL)              │
│                                         │
│  Tablas:                                │
│  - bookings                             │
│  - properties                           │
│  - payments                             │
│  - recommendation_logs                  │
│                                         │
│  Triggers SQL:                          │
│  - on_booking_insert → n8n webhook      │
│  - on_payment_update → n8n webhook      │
│                                         │
│  RPC Functions (Backend logic):         │
│  - check_availability()                 │
│  - calculate_price()                    │
│  - generate_payment_link()              │
└────────┬───────────────┬────────────────┘
         │               │
         │               │ Database Triggers
         │               │ (HTTP POST)
         │               ↓
         │    ┌─────────────────────────────┐
         │    │    n8n (Railway)            │
         │    │                             │
         │    │  17 Workflows:              │
         │    │  - Email automations        │
         │    │  - WhatsApp messages        │
         │    │  - Claude AI calls          │
         │    │  - Scheduled reports        │
         │    │  - Staff coordination       │
         │    └─────────┬───────────────────┘
         │              │
         │              │ Calls to external APIs
         │              ↓
         │    ┌─────────────────────────────┐
         │    │   EXTERNAL SERVICES         │
         │    │                             │
         │    │  - SendGrid (Email)         │
         │    │  - Twilio (WhatsApp)        │
         │    │  - Claude AI (Anthropic)    │
         │    │  - Telegram (Staff)         │
         │    └─────────────────────────────┘
         │
         │ Webhooks from external services
         ↓
┌─────────────────────────────────────────┐
│       STRIPE (Payments)                 │
│                                         │
│  Sends webhooks to n8n when:            │
│  - payment_intent.succeeded             │
│  - payment_intent.failed                │
└─────────────────────────────────────────┘
```

---

## 3. TIPOS DE ARQUITECTURA POR FLUJO

### TIPO A: TRIGGER DATABASE → n8n (Event-Driven)

**Patrón:** Supabase INSERT/UPDATE → Trigger SQL → HTTP POST → n8n webhook

**Flujos que usan este patrón:**
- Flujo 1: Nueva reserva
- Flujo 2: Confirmación de pago
- Flujo 3: Operativo multi-canal
- Flujo 6: Mensajes VIP
- Flujo 16: CRM automático
- Flujo 17: Upsell automático

**Arquitectura:**
```
Usuario crea reserva en frontend (Vercel)
    ↓
INSERT INTO bookings (Supabase)
    ↓
Trigger SQL: on_booking_insert
    ↓
Función: notify_booking_created()
    ↓
HTTP POST a n8n webhook
    ↓
n8n workflow ejecuta acciones
    ↓
Emails, WhatsApp, actualizaciones DB
```

**Ejemplo de Trigger SQL:**
```sql
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n-production-bb2d.up.railway.app/webhook/nueva-reserva',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'booking_id', NEW.id,
      'guest_name', NEW.guest_name,
      'guest_email', NEW.guest_email,
      'check_in', NEW.check_in,
      'check_out', NEW.check_out,
      'property_id', NEW.property_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_created();
```

**¿Por qué n8n y NO backend?**
- ✅ No hay lógica de negocio crítica
- ✅ Solo orquestación de servicios externos (email, SMS)
- ✅ Facilita cambios sin deployments
- ✅ No afecta performance del frontend

---

### TIPO B: SCHEDULED CRON → n8n (Time-Based)

**Patrón:** n8n Cron Trigger → Query DB → Loop → Acciones

**Flujos que usan este patrón:**
- Flujo 12: Bienvenida 24h antes
- Flujo 14: Check-in/Check-out
- Flujo 18: Reportes diarios
- Flujo 19: Comunicación staff
- Flujo 20: Recomendaciones IA diarias ⭐

**Arquitectura:**
```
n8n Cron (8:00 AM diario)
    ↓
SELECT bookings WHERE check_in = tomorrow
    ↓
FOR EACH booking:
    Query property details
    Call Claude AI (opcional)
    Send Email/WhatsApp
    Update flags
```

**Ejemplo de Workflow n8n:**
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
    ↓
    [Twilio WhatsApp] Welcome message
    ↓
    [Supabase Update] Mark welcome_email_sent = true
```

**¿Por qué n8n y NO backend?**
- ✅ No hay usuario esperando respuesta
- ✅ Pueden correr en background
- ✅ Fácil ajustar horarios sin código
- ✅ Logs centralizados en n8n

---

### TIPO C: WEBHOOK EXTERNO → n8n (External Event)

**Patrón:** Servicio externo → n8n webhook → Procesar → DB update

**Flujos que usan este patrón:**
- Flujo 2: Stripe payment success
- Flujo 4: IA responde consultas (desde chatbot)
- Flujo 5: IA redacta mensajes
- Flujo 15: Monitoreo comentarios (Google/TripAdvisor)

**Arquitectura:**
```
Stripe: payment_intent.succeeded
    ↓
POST https://n8n.../webhook/stripe-payment
    ↓
n8n valida evento
    ↓
UPDATE bookings SET status='confirmed'
    ↓
Notifica huésped + staff
```

**Configuración en Stripe Dashboard:**
```
Webhooks → Add endpoint
URL: https://n8n-production-bb2d.up.railway.app/webhook/stripe-payment
Events: payment_intent.succeeded
```

**¿Por qué n8n y NO backend?**
- ✅ Aísla integraciones de terceros
- ✅ Más fácil de debuggear webhooks
- ✅ No contamina código backend con APIs externas

---

### TIPO D: LOOP + AI (Batch Processing)

**Patrón:** Cron → Query múltiples items → Loop + Claude AI → Multi-canal

**Flujos que usan este patrón:**
- Flujo 4: Agente IA consultas
- Flujo 9: Planes estancia completos
- Flujo 20: Recomendaciones diarias ⭐
- Flujo 21: Videos redes sociales

**Arquitectura:**
```
Trigger (cron o webhook)
    ↓
Query: Get active guests
    ↓
Loop Each Guest:
    ├─ Get context from DB
    ├─ Build AI prompt
    ├─ POST Claude API
    ├─ Parse response
    ├─ Send via Email/WhatsApp
    └─ Update sent flags
```

**Ejemplo (Flujo 20 - Recomendaciones IA):**
```
[Cron] Daily 8:00 AM
    ↓
[Supabase Query]
    SELECT * FROM bookings
    WHERE check_in <= CURRENT_DATE
    AND check_out >= CURRENT_DATE
    AND status = 'confirmed'
    ↓
[Split in Batches] batchSize: 1
    ↓
    [HTTP Request] Claude API
        POST https://api.anthropic.com/v1/messages
        Body: {
          "model": "claude-3-5-sonnet-20241022",
          "max_tokens": 1024,
          "messages": [{
            "role": "user",
            "content": "Generate 5 personalized Bali recommendations for {{ guest_name }}..."
          }]
        }
    ↓
    [Code] Parse AI response
    ↓
    [SendGrid] Send email
    ↓
    [Twilio] Send WhatsApp
    ↓
    [Supabase Update] Mark sent = true
```

**¿Por qué n8n y NO backend?**
- ✅ Procesamiento asíncrono en batch
- ✅ Fácil visualizar errores por item
- ✅ Retry automático en n8n
- ✅ No bloquea requests del frontend

---

### TIPO E: COMPLEX ORCHESTRATION (Multi-step)

**Patrón:** Múltiples pasos con decisiones y bifurcaciones

**Flujos que usan este patrón:**
- Flujo 7: Generar enlace pago (Stripe API + DB + Email)
- Flujo 10: Actualizar disponibilidad (multi-property logic)
- Flujo 13: Coordinación limpieza (staff + schedule + tracking)

**Arquitectura:**
```
Trigger
    ↓
Decision: IF (condition)
    ├─ TRUE → Path A
    └─ FALSE → Path B
    ↓
Multiple services in parallel:
    ├─ Service 1 (Stripe)
    ├─ Service 2 (Email)
    └─ Service 3 (DB update)
    ↓
Merge results
    ↓
Final action
```

**¿Por qué n8n y NO backend?**
- ✅ Visual workflow fácil de entender
- ✅ Cambios rápidos sin deployments
- ✅ Paralelización built-in

---

## 4. FLUJOS CRÍTICOS PARA BACKEND

### ⚠️ FLUJOS QUE DEBEN SER CÓDIGO, NO n8n

Estos 4 flujos **NO pueden ir en n8n** porque son críticos para el funcionamiento del negocio:

---

#### 1. GENERACIÓN DE ENLACE DE PAGO (Flujo 7) - **CRÍTICO**

**Por qué DEBE ser backend:**

```javascript
// src/services/stripe/createPaymentLink.js
export async function createBookingPayment(bookingId) {
  const booking = await supabase
    .from('bookings')
    .select('*, property:properties(*)')
    .eq('id', bookingId)
    .single()

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Reserva ${booking.property.name}`,
          description: `${booking.check_in} - ${booking.check_out}`
        },
        unit_amount: booking.total_price * 100
      },
      quantity: 1
    }],
    metadata: {
      booking_id: bookingId
    },
    after_completion: {
      type: 'redirect',
      redirect: {
        url: `${process.env.FRONTEND_URL}/booking/${bookingId}/success`
      }
    }
  })

  // Update booking with payment link
  await supabase
    .from('bookings')
    .update({ payment_link: paymentLink.url })
    .eq('id', bookingId)

  return paymentLink.url
}
```

**Razones:**
- ❌ **Seguridad:** Secret Keys de Stripe no deben estar en n8n
- ❌ **Performance:** Usuario esperando respuesta inmediata
- ❌ **Crítico:** Si falla, la reserva no se puede pagar
- ✅ **Debe ser síncrono:** Frontend necesita el link inmediatamente

**Implementación:** Supabase Edge Function o RPC Function

**Cuándo llamar:** Cuando el usuario crea la reserva (mismo request)

---

#### 2. VALIDACIÓN DE DISPONIBILIDAD (Flujo 10) - **CRÍTICO**

**Por qué DEBE ser backend:**

```javascript
// Supabase RPC Function: check_availability
CREATE OR REPLACE FUNCTION check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflict_count
  FROM bookings
  WHERE property_id = p_property_id
    AND status != 'cancelled'
    AND (
      (check_in <= p_check_in AND check_out >= p_check_in) OR
      (check_in <= p_check_out AND check_out >= p_check_out) OR
      (check_in >= p_check_in AND check_out <= p_check_out)
    );

  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql;
```

**Uso en Frontend:**
```javascript
const { data: isAvailable } = await supabase
  .rpc('check_availability', {
    p_property_id: propertyId,
    p_check_in: checkIn,
    p_check_out: checkOut
  })

if (!isAvailable) {
  toast.error('No disponible en esas fechas')
  return
}
```

**Razones:**
- ❌ **Race condition:** Dos usuarios reservando al mismo tiempo
- ❌ **Lógica de negocio crítica:** No puede fallar
- ❌ **Debe ser atómico:** Validar + Crear booking en una transacción
- ✅ **Necesita estar en el request path:** No puede ser async

**Implementación:** Supabase RPC Function

**Cuándo llamar:** ANTES de crear la reserva (blocking)

---

#### 3. CÁLCULO DE PRECIOS DINÁMICOS - **CRÍTICO**

**Por qué DEBE ser backend:**

```javascript
// Supabase RPC Function: calculate_booking_price
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_property RECORD;
  v_nights INTEGER;
  v_base_price DECIMAL(10,2);
  v_cleaning_fee DECIMAL(10,2);
  v_service_fee DECIMAL(10,2);
  v_guest_surcharge DECIMAL(10,2);
  v_total DECIMAL(10,2);
BEGIN
  -- Get property details
  SELECT * INTO v_property
  FROM properties
  WHERE id = p_property_id;

  -- Calculate nights
  v_nights := p_check_out - p_check_in;

  -- Base price
  v_base_price := v_property.price_per_night * v_nights;

  -- High season multiplier (June-August, December)
  IF EXTRACT(MONTH FROM p_check_in) IN (6, 7, 8, 12) THEN
    v_base_price := v_base_price * 1.3;
  END IF;

  -- Guest count surcharge
  v_guest_surcharge := 0;
  IF p_guests > v_property.base_guests THEN
    v_guest_surcharge := (p_guests - v_property.base_guests) * 20 * v_nights;
  END IF;

  -- Cleaning fee
  v_cleaning_fee := COALESCE(v_property.cleaning_fee, 50);

  -- Service fee (15%)
  v_service_fee := v_base_price * 0.15;

  -- Total
  v_total := v_base_price + v_guest_surcharge + v_cleaning_fee + v_service_fee;

  RETURN json_build_object(
    'base_price', v_base_price,
    'guest_surcharge', v_guest_surcharge,
    'cleaning_fee', v_cleaning_fee,
    'service_fee', v_service_fee,
    'total', v_total,
    'nights', v_nights
  );
END;
$$ LANGUAGE plpgsql;
```

**Uso en Frontend:**
```javascript
const { data: pricing } = await supabase
  .rpc('calculate_booking_price', {
    p_property_id: propertyId,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_guests: guestsCount
  })

console.log(pricing)
// {
//   base_price: 1000,
//   guest_surcharge: 100,
//   cleaning_fee: 50,
//   service_fee: 150,
//   total: 1300,
//   nights: 5
// }
```

**Razones:**
- ❌ **Lógica de negocio compleja:** Reglas de pricing cambian
- ❌ **Debe ser consistente:** Mismo cálculo en preview y confirmación
- ❌ **Auditable:** Necesitas logs de cómo se calculó cada precio
- ✅ **Parte del flujo de reserva:** Usuario esperando

**Implementación:** Supabase RPC Function

**Cuándo llamar:** Cuando usuario selecciona fechas (para mostrar precio estimado)

---

#### 4. DASHBOARD DE MÉTRICAS EN TIEMPO REAL (Flujo 8) - **DEBERÍA SER BACKEND**

**Por qué DEBE ser backend API:**

```javascript
// Supabase RPC Function: get_dashboard_metrics
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS JSON AS $$
DECLARE
  v_total_revenue DECIMAL(10,2);
  v_total_bookings INTEGER;
  v_occupancy_rate DECIMAL(5,2);
  v_avg_booking_value DECIMAL(10,2);
BEGIN
  -- Total revenue
  SELECT COALESCE(SUM(total_price), 0) INTO v_total_revenue
  FROM bookings
  WHERE created_at >= p_start_date
    AND created_at <= p_end_date
    AND status = 'confirmed';

  -- Total bookings
  SELECT COUNT(*) INTO v_total_bookings
  FROM bookings
  WHERE created_at >= p_start_date
    AND created_at <= p_end_date;

  -- Occupancy rate
  SELECT ROUND(
    (COUNT(DISTINCT booking_id) * 100.0 /
     (SELECT COUNT(*) * (p_end_date - p_start_date) FROM properties)), 2
  ) INTO v_occupancy_rate
  FROM bookings
  WHERE check_in <= p_end_date
    AND check_out >= p_start_date
    AND status = 'confirmed';

  -- Average booking value
  v_avg_booking_value := CASE
    WHEN v_total_bookings > 0 THEN v_total_revenue / v_total_bookings
    ELSE 0
  END;

  RETURN json_build_object(
    'total_revenue', v_total_revenue,
    'total_bookings', v_total_bookings,
    'occupancy_rate', v_occupancy_rate,
    'avg_booking_value', v_avg_booking_value
  );
END;
$$ LANGUAGE plpgsql;
```

**Uso en Frontend:**
```javascript
const { data: metrics } = await supabase
  .rpc('get_dashboard_metrics', {
    p_start_date: '2025-11-01',
    p_end_date: '2025-11-30'
  })
```

**Razones:**
- ❌ **Usuario esperando:** Dashboard debe cargar rápido
- ❌ **Queries complejas:** Mejor usar RPC functions de Supabase
- ✅ **Cacheable:** Puedes usar React Query para optimizar

**Alternativa aceptable:** n8n genera reporte diario y lo guarda en tabla `daily_metrics`, frontend lee esa tabla

---

## 5. REGLA DE ORO: BACKEND VS n8n

### Tabla de Decisión

| Característica | Backend Code | n8n Workflow |
|---------------|--------------|--------------|
| **Usuario esperando respuesta** | ✅ BACKEND | ❌ No |
| **Lógica crítica de negocio** | ✅ BACKEND | ❌ No |
| **Maneja dinero/pagos** | ✅ BACKEND | ❌ No |
| **Validaciones antes de guardar** | ✅ BACKEND | ❌ No |
| **Race conditions posibles** | ✅ BACKEND | ❌ No |
| **Requiere transacciones atómicas** | ✅ BACKEND | ❌ No |
| **Orquestación de emails/SMS** | ❌ No | ✅ n8n |
| **Scheduled tasks (cron)** | ❌ No | ✅ n8n |
| **Batch processing** | ❌ No | ✅ n8n |
| **IA calls (async)** | ❌ No | ✅ n8n |
| **Multi-step workflows** | ❌ No | ✅ n8n |
| **Integraciones con 3rd parties** | ❌ No | ✅ n8n |

### Preguntas para Decidir

**Hazte estas preguntas:**

1. **¿El usuario está esperando esta respuesta ahora?**
   - SÍ → Backend
   - NO → n8n

2. **¿Si esto falla, el negocio pierde dinero?**
   - SÍ → Backend
   - NO → n8n

3. **¿Necesita ejecutarse en una transacción con otros cambios de DB?**
   - SÍ → Backend
   - NO → n8n

4. **¿Es solo enviar emails/notificaciones?**
   - SÍ → n8n
   - NO → Evaluar

5. **¿Es un proceso scheduled (cron)?**
   - SÍ → n8n
   - NO → Evaluar

---

## 6. CLASIFICACIÓN COMPLETA DE 21 FLUJOS

### ✅ DEBEN IR EN BACKEND (Código)

| # | Flujo | Implementación | Por qué Backend |
|---|-------|----------------|-----------------|
| 7 | Generar enlace de pago | Supabase Function | Crítico, síncrono, seguridad |
| 10 | Validar disponibilidad | Supabase Function | Race condition, transaccional |
| - | Cálculo de precios | Supabase Function | Lógica de negocio, consistencia |
| 8 | Dashboard métricas | Supabase Function | Usuario esperando, queries complejas |

**Total: 3-4 flujos críticos en código backend**

---

### ✅ PERFECTOS PARA n8n

#### FUNDAMENTALES (Día 1-2):
- **Flujo 1:** Nueva reserva → Email/WhatsApp
- **Flujo 2:** Pago confirmado → Actualizar + Notificar
- **Flujo 3:** Operativo multi-canal
- **Flujo 12:** Bienvenida 24h antes

#### INTELIGENCIA ARTIFICIAL (Día 3-5):
- **Flujo 4:** IA responde consultas
- **Flujo 5:** IA redacta mensajes
- **Flujo 9:** Planes estancia completos
- **Flujo 20:** Recomendaciones diarias ⭐

#### OPERACIONES (Día 4+):
- **Flujo 13:** Coordinación limpieza
- **Flujo 14:** Check-in/Check-out
- **Flujo 19:** Comunicación staff

#### MARKETING:
- **Flujo 6:** Mensajes VIP
- **Flujo 15:** Monitoreo comentarios
- **Flujo 17:** Upsell automático
- **Flujo 21:** Videos redes sociales

#### REPORTING:
- **Flujo 11:** Seguimiento pagos
- **Flujo 16:** CRM automático
- **Flujo 18:** Reportes diarios

**Total: 17 flujos en n8n**

---

## 7. EJEMPLO CONCRETO: FLUJO COMPLETO DE RESERVA

### Paso a Paso (Mostrando qué va donde)

```javascript
// ============================================
// 1. USUARIO LLENA FORMULARIO (Frontend)
// ============================================
// src/modules/bookings/BookingForm.jsx

const handleSubmit = async (formData) => {

  // ============================================
  // 2. VALIDAR DISPONIBILIDAD
  // ✅ BACKEND - Supabase Function
  // ============================================
  const { data: isAvailable } = await supabase
    .rpc('check_availability', {
      p_property_id: formData.propertyId,
      p_check_in: formData.checkIn,
      p_check_out: formData.checkOut
    })

  if (!isAvailable) {
    return toast.error('No disponible en esas fechas')
  }

  // ============================================
  // 3. CALCULAR PRECIO
  // ✅ BACKEND - Supabase Function
  // ============================================
  const { data: pricing } = await supabase
    .rpc('calculate_booking_price', {
      p_property_id: formData.propertyId,
      p_check_in: formData.checkIn,
      p_check_out: formData.checkOut,
      p_guests: formData.guestsCount
    })

  // ============================================
  // 4. CREAR BOOKING
  // ✅ BACKEND - Supabase INSERT
  // ============================================
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      ...formData,
      total_price: pricing.total,
      status: 'pending'
    })
    .select()
    .single()

  if (error) return toast.error('Error al crear reserva')

  // ============================================
  // 5. GENERAR PAYMENT LINK
  // ✅ BACKEND - Supabase Function
  // ============================================
  const { data: paymentLink } = await supabase
    .rpc('create_stripe_payment_link', {
      booking_id: booking.id
    })

  // ============================================
  // 6. AQUÍ TERMINA EL BACKEND
  // Todo lo siguiente pasa AUTOMÁTICAMENTE:
  // ============================================

  // ============================================
  // 7. TRIGGER SQL SE ACTIVA
  // ✅ SUPABASE (Automático)
  // ============================================
  // on_booking_insert → Calls n8n webhook
  // URL: https://n8n.../webhook/nueva-reserva

  // ============================================
  // 8. N8N RECIBE WEBHOOK
  // ✅ n8n Flujo 1 (Automático)
  // ============================================
  // - Formatea email de confirmación
  // - Envía email al huésped (SendGrid)
  // - Envía WhatsApp al host (Twilio)
  // - Registra en activity_log

  // ============================================
  // 9. USUARIO VE EL RESULTADO
  // ✅ FRONTEND
  // ============================================
  toast.success('¡Reserva creada!')
  navigate(`/booking/${booking.id}/payment?link=${paymentLink}`)
}

// ============================================
// 10. USUARIO PAGA
// ✅ STRIPE (Externo)
// ============================================
// Stripe procesa pago → Envía webhook a n8n

// ============================================
// 11. N8N RECIBE WEBHOOK DE STRIPE
// ✅ n8n Flujo 2 (Automático)
// ============================================
// - Valida evento payment_intent.succeeded
// - UPDATE bookings SET status='confirmed'
// - Envía email confirmación al huésped
// - Notifica al host vía WhatsApp

// ============================================
// 12. AL DÍA SIGUIENTE
// ✅ n8n Flujo 20 - Cron 8am (Automático)
// ============================================
// - Query bookings activos
// - Loop cada huésped
// - Claude AI genera recomendaciones personalizadas
// - Envía email + WhatsApp con recomendaciones
// - Update daily_recommendation_sent = true
```

### Diagrama Visual del Flujo

```
Usuario completa formulario
    ↓
[BACKEND] Validar disponibilidad
    ↓
[BACKEND] Calcular precio
    ↓
[BACKEND] Crear booking en DB
    ↓
[BACKEND] Generar Stripe payment link
    ↓
[AUTOMÁTICO] Trigger SQL → n8n webhook
    ↓
[n8n] Enviar email confirmación
[n8n] Enviar WhatsApp al host
    ↓
Usuario recibe link de pago
    ↓
Usuario paga en Stripe
    ↓
[AUTOMÁTICO] Stripe → n8n webhook
    ↓
[n8n] Actualizar status = 'confirmed'
[n8n] Notificar huésped + host
    ↓
[n8n CRON] Al día siguiente 8am
[n8n] Recomendaciones IA personalizadas
```

---

## 8. PRÓXIMOS PASOS

### ESTA SEMANA - Backend (Código)

**Prioridad 1: Implementar Supabase Functions**

1. **check_availability()**
   - Validar disponibilidad de property
   - Prevenir double-booking
   - Archivo: `supabase/functions/check_availability.sql`

2. **calculate_booking_price()**
   - Calcular precio base
   - Aplicar multiplicadores (high season, guests)
   - Sumar fees (cleaning, service)
   - Archivo: `supabase/functions/calculate_booking_price.sql`

3. **create_stripe_payment_link()**
   - Crear payment link en Stripe
   - Guardar URL en booking
   - Devolver link al frontend
   - Archivo: `supabase/functions/create_stripe_payment_link.sql`

4. **get_dashboard_metrics()**
   - Revenue total
   - Bookings count
   - Occupancy rate
   - Average booking value
   - Archivo: `supabase/functions/get_dashboard_metrics.sql`

**Tiempo estimado:** 3-4 horas

---

### PRÓXIMA SEMANA - n8n (Workflows)

**Prioridad 2: Flujos Fundamentales**

1. **Flujo 1:** Nueva reserva → Email/WhatsApp (45 min)
2. **Flujo 2:** Pago confirmado → Actualizar (1 hora)
3. **Flujo 12:** Bienvenida 24h antes (30 min)

**Tiempo estimado:** 2-3 horas

---

### SEMANA 3 - n8n Advanced (IA)

**Prioridad 3: Inteligencia Artificial**

1. **Flujo 4:** IA responde consultas (1.5 horas)
2. **Flujo 5:** IA redacta mensajes (1 hora)
3. **Flujo 20:** Recomendaciones IA diarias ⭐ (2-3 horas)

**Tiempo estimado:** 4-5 horas

---

## RESUMEN FINAL

### Arquitectura Clara

**Backend (Supabase Functions):**
- Lógica crítica de negocio
- Validaciones antes de guardar
- Cálculos complejos
- Seguridad (API keys, secrets)
- Usuario esperando respuesta

**n8n (Workflows):**
- Orquestación de servicios externos
- Emails, WhatsApp, notificaciones
- Scheduled tasks (cron)
- Batch processing
- IA calls (Claude API)
- No bloquea frontend

### División de Trabajo

- **4 flujos críticos** → Código backend (Supabase Functions)
- **17 flujos automatización** → n8n workflows

### La Regla de Oro

> **Si el usuario está esperando respuesta → Backend**
> **Si es automático en background → n8n**

---

**Documento creado:** 28 Noviembre 2025
**Siguiente paso:** Desarrollar Flujo 1 (Nueva reserva → Email/WhatsApp)
