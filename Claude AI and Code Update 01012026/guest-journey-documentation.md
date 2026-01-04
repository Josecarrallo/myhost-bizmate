# GUEST JOURNEY AUTOMATION - DOCUMENTACIÓN COMPLETA
## MY HOST BizMate - Izumi Hotel
### Fecha: 1 Enero 2026

---

# RESUMEN EJECUTIVO

## ✅ LO QUE SE COMPLETÓ HOY

### Workflow: GuestJourney-Scheduler
- **ID:** cQLiQnqR2AHkYOjd
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/cQLiQnqR2AHkYOjd
- **Estado:** ACTIVO ✅
- **Trigger:** Cada hora

### Funcionalidad actual:
1. Busca reservas con `status=confirmed` y `journey_state=booking_confirmed`
2. Filtra las que tienen check-in en exactamente 3 días
3. Envía WhatsApp al huésped
4. Envía Email al huésped
5. Actualiza `journey_state` a `pre_arrival`

### Estructura del workflow:
```
Schedule Trigger (cada hora)
       ↓
Get Pre-Arrival Bookings (HTTP Request a Supabase)
       ↓
Filter 3 Days Before (Code node)
       ↓ (en paralelo)
├── Send WhatsApp (HTTP Request a ChakraHQ)
├── Send Email (SendGrid nativo)
└── Update Journey State (HTTP Request PATCH a Supabase)
```

---

# IDENTIFICADORES CRÍTICOS

## n8n Workflows
| Workflow | ID | Estado |
|----------|-----|--------|
| GuestJourney-Scheduler | cQLiQnqR2AHkYOjd | ✅ Activo |
| MCP Central | jyvFpkPes5DdoBRE | Para VAPI/WhatsApp Concierge |
| WhatsApp AI Concierge | ORTMMLk6qVKFhELp | Referencia |

## Supabase
- **URL:** https://jjpscimtxrudtepzwhag.supabase.co
- **Property ID (Izumi):** 18711359-1378-4d12-9ea6-fb31c0b1bac2
- **API Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

## WhatsApp (ChakraHQ)
- **URL:** https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages
- **Bearer Token:** qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

## SendGrid
- **Credentials ID:** Y35BYbcV5SYfjBwc
- **From Email:** josecarrallodelafuente@gmail.com

---

# JOURNEY STATES (Estados del Guest Journey)

```
booking_confirmed → pre_arrival → checked_in → checked_out → post_stay
```

| Estado | Descripción | Cuándo se activa |
|--------|-------------|------------------|
| booking_confirmed | Reserva confirmada | Al crear booking |
| pre_arrival | Pre-llegada comunicada | 3 días antes (actual) |
| checked_in | Huésped en hotel | Día de check-in |
| checked_out | Huésped salió | Día de checkout |
| post_stay | Post-estancia | Después de checkout |

---

# APP - GUEST COMMUNICATIONS (Lo que muestra la App)

Según la captura de pantalla de la App:

| Etapa | Canal | Template | Timing |
|-------|-------|----------|--------|
| Booking | Email | Booking Confirmation | Al confirmar |
| 7 Days Before | Email | Pre-Arrival Tips | 7 días antes |
| 48 Hours Before | WhatsApp | Airport Pickup Offer | 48 horas antes |
| Check-In Day | WhatsApp | Welcome Message | Día de llegada |
| Checkout Day | (pendiente) | (pendiente) | Día de salida |
| Post-Stay | (pendiente) | (pendiente) | Después |

---

# LO QUE FALTA POR HACER

## PASO 1: Adaptar el flujo actual a las etapas de la App

El flujo actual filtra "3 días antes" pero la App muestra:
- **7 Days Before** (Email)
- **48 Hours Before** (WhatsApp)

**Decisión necesaria:** ¿Crear filtros separados para cada etapa o un solo flujo con múltiples filtros?

### Opción A: Un workflow con múltiples ramas
```
Schedule Trigger
       ↓
Get All Confirmed Bookings
       ↓
├── Filter 7 Days → Email (Pre-Arrival Tips)
├── Filter 48 Hours → WhatsApp (Airport Pickup)
├── Filter Check-in Day → WhatsApp (Welcome)
├── Filter Checkout Day → WhatsApp/Email (Thanks)
└── Filter Post-Stay → Email (Review Request)
```

### Opción B: Workflows separados por etapa
- GuestJourney-7DaysBefore
- GuestJourney-48Hours
- GuestJourney-CheckIn
- GuestJourney-Checkout
- GuestJourney-PostStay

**Recomendación:** Opción A (un solo workflow) es más mantenible.

---

## PASO 2: Conectar con journey_settings table

La tabla `journey_settings` existe en Supabase para controlar ON/OFF desde la App.

### Estructura de journey_settings:
```sql
CREATE TABLE journey_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  property_id UUID,
  step_key TEXT,  -- 'booking_confirmation', '7_days_before', '48_hours_before', etc.
  enabled BOOLEAN DEFAULT true,
  channel TEXT,   -- 'email', 'whatsapp'
  template_name TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Lógica a implementar:
1. Antes de enviar mensaje, consultar `journey_settings`
2. Verificar si `enabled = true` para ese `step_key`
3. Solo enviar si está habilitado

---

## PASO 3: Completar todas las etapas del Guest Journey

### 3.1 Booking Confirmation (Al crear reserva)
- **Trigger:** Webhook desde Supabase cuando se crea booking
- **Canal:** Email
- **Journey State:** → booking_confirmed
- **Ya existe parcialmente en:** MCP Central

### 3.2 Seven Days Before
- **Filter:** check_in = today + 7 days
- **Canal:** Email
- **Contenido:** Bali tips, cómo llegar, qué empacar
- **Journey State:** (no cambia, sigue en booking_confirmed)

### 3.3 48 Hours Before
- **Filter:** check_in = today + 2 days
- **Canal:** WhatsApp
- **Contenido:** Oferta airport pickup, confirmar hora llegada
- **Journey State:** → pre_arrival

### 3.4 Check-In Day
- **Filter:** check_in = today
- **Canal:** WhatsApp
- **Contenido:** Bienvenida, WiFi, horario desayuno
- **Journey State:** → checked_in

### 3.5 Checkout Day
- **Filter:** check_out = today
- **Canal:** WhatsApp/Email
- **Contenido:** Gracias, recordatorio checkout 12pm
- **Journey State:** → checked_out

### 3.6 Post-Stay (1 día después)
- **Filter:** check_out = today - 1 day
- **Canal:** Email
- **Contenido:** Solicitud review, oferta regreso
- **Journey State:** → post_stay

---

# SQL ÚTILES PARA TESTING

## Limpiar reservas de prueba:
```sql
DELETE FROM bookings 
WHERE guest_name LIKE 'Test%';
```

## Crear reserva de prueba (ajustar fecha según lo que se prueba):
```sql
INSERT INTO bookings (
  property_id,
  guest_name,
  guest_email,
  guest_phone,
  check_in,
  check_out,
  guests,
  total_price,
  status,
  channel,
  journey_state
) VALUES (
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'Test Journey',
  'josecarrallodelafuente@gmail.com',
  '34619794604',
  '2026-01-04',  -- Cambiar según prueba
  '2026-01-07',
  2,
  1500,
  'confirmed',
  'direct',
  'booking_confirmed'
);
```

## Ver journey_settings:
```sql
SELECT * FROM journey_settings WHERE property_id = '18711359-1378-4d12-9ea6-fb31c0b1bac2';
```

---

# TEMPLATES DE MENSAJES

## WhatsApp - 48 Hours Before (Airport Pickup)
```
Hello {{ guest_name }}! 🌴

Your stay at Izumi Hotel is just 2 days away!

🛫 *Airport Transfer*
We offer private pickup from Ngurah Rai Airport.
Price: $45 USD (up to 4 guests)
Duration: ~1.5 hours to Ubud

Reply YES + your flight number to book!

Check-in: {{ check_in }} at 2:00 PM

🏨 Izumi Hotel Team
```

## WhatsApp - Check-In Day (Welcome)
```
Selamat datang! 🌺

Welcome to Izumi Hotel, {{ guest_name }}!

🏠 *Your Villa is Ready*
Check-in: 2:00 PM onwards

📶 *WiFi:* IzumiGuest
🔑 *Password:* Bali2026

🍳 *Breakfast:* 7:00 - 10:00 AM

Need anything? Just reply here!

🏨 Izumi Hotel Team
```

## Email - Post-Stay (Review Request)
```
Subject: Thank you for staying with us, {{ guest_name }}! 🌺

Dear {{ guest_name }},

Thank you for choosing Izumi Hotel for your Bali adventure!

We hope you had an unforgettable experience in Ubud.

Would you mind sharing your experience?
→ Leave a review on Google: [link]
→ Share on TripAdvisor: [link]

As a thank you, enjoy 15% off your next stay!
Use code: RETURN15

We hope to welcome you back soon!

With gratitude,
The Izumi Hotel Team 🌺
```

---

# ARQUITECTURA FINAL DESEADA

```
┌─────────────────────────────────────────────────────────────────┐
│                    GuestJourney-Scheduler                        │
│                    (Ejecuta cada hora)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              Get Confirmed Bookings from Supabase                │
│     (status=confirmed, journey_state IN (...relevant...))       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Check journey_settings                         │
│              (qué etapas están habilitadas)                     │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐        ┌──────────┐        ┌──────────┐
    │ 7 Days   │        │ 48 Hours │        │ Check-in │
    │ Before   │        │ Before   │        │   Day    │
    │ (Email)  │        │(WhatsApp)│        │(WhatsApp)│
    └──────────┘        └──────────┘        └──────────┘
          │                   │                   │
          ▼                   ▼                   ▼
    ┌─────────────────────────────────────────────────┐
    │           Update journey_state                   │
    │         (según la etapa procesada)              │
    └─────────────────────────────────────────────────┘
```

---

# CONTACTO IZUMI HOTEL

- **WhatsApp:** +62 813 2576 4867 (24/7)
- **Phone:** +62 813 2576 4867 (8:00-22:00)
- **Web:** www.my-host-bizmate.com
- **Location:** Jl Raya Andong N. 18, Ubud, Bali

---

# NOTAS IMPORTANTES

1. **El workflow está ACTIVO** - Se ejecuta cada hora. Desactivar si no quieres mensajes de prueba.

2. **Filtro actual = 3 días** - Hay que cambiarlo a 48 horas o 7 días según la App.

3. **No hay validación de journey_settings** - Actualmente envía siempre, sin verificar si está habilitado en la App.

4. **Templates en inglés** - El AI Agent de WhatsApp Concierge detecta idioma, pero estos templates son fijos en inglés.

5. **SendGrid desde tu email personal** - Considera usar un email de dominio propio para producción.

---

*Documentación generada el 1 de Enero 2026*
*MY HOST BizMate - Jose Carrallo*
