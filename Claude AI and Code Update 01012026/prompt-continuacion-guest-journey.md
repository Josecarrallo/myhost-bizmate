# PROMPT PARA CONTINUAR MAÑANA - GUEST JOURNEY AUTOMATION

---

## COPIA Y PEGA ESTE PROMPT COMPLETO AL INICIO DE LA NUEVA CONVERSACIÓN:

---

Hola Claude, vengo de una sesión de trabajo del 1 de Enero 2026. Estoy desarrollando el sistema de **Guest Journey Automation** para **Izumi Hotel** (MY HOST BizMate).

## CONTEXTO CRÍTICO

### Lo que ya está funcionando:
- **Workflow:** GuestJourney-Scheduler (ID: cQLiQnqR2AHkYOjd)
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/cQLiQnqR2AHkYOjd
- **Estado:** ACTIVO (se ejecuta cada hora)
- **Funcionalidad actual:** Envía WhatsApp + Email a reservas con check-in en 3 días y actualiza journey_state a "pre_arrival"

### Estructura actual del workflow:
```
Schedule Trigger (cada hora)
       ↓
Get Pre-Arrival Bookings (Supabase: status=confirmed, journey_state=booking_confirmed)
       ↓
Filter 3 Days Before (Code node)
       ↓ (en paralelo)
├── Send WhatsApp (ChakraHQ)
├── Send Email (SendGrid nativo)
└── Update Journey State (PATCH a Supabase → pre_arrival)
```

### IDs y URLs importantes:
- **n8n:** https://n8n-production-bb2d.up.railway.app
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co
- **Property ID Izumi:** 18711359-1378-4d12-9ea6-fb31c0b1bac2
- **MCP Central:** jyvFpkPes5DdoBRE
- **WhatsApp Concierge (referencia):** ORTMMLk6qVKFhELp

---

## LOS 3 PASOS QUE FALTAN

### PASO 1: Adaptar el flujo a las etapas de la App

La App de MY HOST BizMate muestra estas etapas en "Guest Communications":

| Etapa | Canal | Timing actual en workflow |
|-------|-------|---------------------------|
| Booking | Email | ❌ No implementado |
| 7 Days Before | Email | ❌ No (tenemos 3 días) |
| 48 Hours Before | WhatsApp | ❌ No (tenemos 3 días) |
| Check-In Day | WhatsApp | ❌ No implementado |
| Checkout Day | (pendiente) | ❌ No implementado |
| Post-Stay | (pendiente) | ❌ No implementado |

**Tarea:** Modificar el workflow para que tenga múltiples filtros (7 días, 48 horas, día check-in, día checkout, post-stay) en lugar de solo "3 días antes".

---

### PASO 2: Conectar con journey_settings table

Existe la tabla `journey_settings` en Supabase que permite a la App controlar ON/OFF de cada etapa.

**Estructura:**
```sql
- step_key: 'booking_confirmation', '7_days_before', '48_hours_before', 'check_in_day', etc.
- enabled: true/false
- channel: 'email', 'whatsapp'
- template_name: nombre del template
```

**Tarea:** Antes de enviar cada mensaje, consultar journey_settings para verificar si esa etapa está habilitada.

---

### PASO 3: Completar todas las etapas del Guest Journey

**Journey States en Supabase:**
```
booking_confirmed → pre_arrival → checked_in → checked_out → post_stay
```

**Por implementar:**

1. **7 Days Before** (Email)
   - Filter: check_in = today + 7 days
   - Contenido: Bali tips, cómo llegar
   - No cambia journey_state

2. **48 Hours Before** (WhatsApp)
   - Filter: check_in = today + 2 days
   - Contenido: Oferta airport pickup
   - Cambia a: pre_arrival

3. **Check-In Day** (WhatsApp)
   - Filter: check_in = today
   - Contenido: Bienvenida, WiFi, desayuno
   - Cambia a: checked_in

4. **Checkout Day** (WhatsApp/Email)
   - Filter: check_out = today
   - Contenido: Gracias, recordatorio 12pm
   - Cambia a: checked_out

5. **Post-Stay** (Email, 1 día después)
   - Filter: check_out = today - 1 day
   - Contenido: Solicitud review
   - Cambia a: post_stay

---

## CREDENCIALES (ya configuradas en n8n)

- **Supabase API Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

- **ChakraHQ (WhatsApp):** Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

- **SendGrid:** Credentials ID Y35BYbcV5SYfjBwc (from: josecarrallodelafuente@gmail.com)

---

## SQL PARA TESTING

```sql
-- Limpiar pruebas
DELETE FROM bookings WHERE guest_name LIKE 'Test%';

-- Crear reserva de prueba
INSERT INTO bookings (
  property_id, guest_name, guest_email, guest_phone,
  check_in, check_out, guests, total_price,
  status, channel, journey_state
) VALUES (
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'Test Journey',
  'josecarrallodelafuente@gmail.com',
  '34619794604',
  '2026-01-04',  -- Ajustar según prueba
  '2026-01-07',
  2, 1500, 'confirmed', 'direct', 'booking_confirmed'
);
```

---

## DECISIÓN ARQUITECTÓNICA PENDIENTE

**¿Un workflow con múltiples ramas o workflows separados?**

**Opción A (Recomendada):** Un solo workflow con múltiples filtros en paralelo
```
Schedule Trigger
       ↓
Get All Bookings
       ↓ (en paralelo)
├── Filter 7 Days → Email
├── Filter 48 Hours → WhatsApp  
├── Filter Check-in → WhatsApp
├── Filter Checkout → WhatsApp/Email
└── Filter Post-Stay → Email
```

**Opción B:** Workflows separados por etapa

---

## PRIMERA TAREA DE HOY

Revisar el workflow actual en n8n y decidir:
1. ¿Expandimos el workflow actual con más filtros?
2. ¿O creamos la estructura completa desde cero?

Accede al workflow: https://n8n-production-bb2d.up.railway.app/workflow/cQLiQnqR2AHkYOjd

---

## MI TELÉFONO PARA PRUEBAS
- **WhatsApp:** 34619794604
- **Email:** josecarrallodelafuente@gmail.com

---

**IMPORTANTE:** El workflow está ACTIVO ahora mismo. Si hay reservas de prueba con check-in en 3 días, recibiré mensajes cada hora. Considerar desactivar durante desarrollo.

---

*Prompt preparado el 1 Enero 2026 - Jose Carrallo*
