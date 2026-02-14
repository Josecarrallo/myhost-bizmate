# Plan de Trabajo: Migración a Arquitectura MCP Central
## MY HOST BizMate - Izumi Hotel

**Fecha inicio:** 28 Diciembre 2025  
**Fecha completado:** 28 Diciembre 2025 ✅  
**Objetivo:** Eliminar doble IA, implementar arquitectura MCP con Claude como único cerebro

---

## ✅ ARQUITECTURA IMPLEMENTADA

```
┌─────────────────────────────────────────────────────────┐
│  CAPA IA (Claude Sonnet 3.5) - ÚNICO CEREBRO            │
│  - VAPI Assistant: "Izumi Hotel Receptionist (MCP)"     │
│  - Entiende al usuario, decide qué tool llamar          │
│  - Genera respuestas de voz naturales                   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Protocolo MCP (Streamable HTTP)
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA ACCIONES (n8n como MCP Server) - SIN IA           │
│  Workflow: "MCP Central - Izumi Hotel MYHOST Bizmate XX"│
│  ID: jyvFpkPes5DdoBRE                                   │
│  URL: https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel │
│                                                         │
│  Tools disponibles:                                     │
│  - check_availability (Supabase RPC)                    │
│  - create_booking (Supabase INSERT)                     │
│  - send_email_confirmation (SendGrid)                   │
│  - send_whatsapp_to_guest (ChakraHQ)                    │
│  - send_whatsapp_to_staff (ChakraHQ)                    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  CAPA DATOS E INTEGRACIONES                             │
│  - Supabase (7 villas en tabla properties)              │
│  - WhatsApp Cloud API (ChakraHQ)                        │
│  - SendGrid (email)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## PRINCIPIO CLAVE IMPLEMENTADO

| Componente | Rol | ¿Tiene IA? |
|------------|-----|------------|
| **Claude Sonnet 3.5** (en VAPI) | Cerebro único - entiende, decide, responde | ✅ Sí |
| **n8n** (MCP Server Central) | Ejecutor de acciones - BD, WhatsApp, email | ❌ No |
| **Supabase** | Base de datos con 7 villas de Izumi Hotel | ❌ No |

---

## ✅ FASE 1: COMPLETADA - Análisis y Planificación

**Resultado:** Se identificó que la arquitectura original tenía doble IA (VAPI + n8n AI Agent). Se decidió eliminar el AI Agent de n8n y usar solo Claude en VAPI.

---

## ✅ FASE 2: COMPLETADA - Workflow MCP Central

### Workflow Final: `MCP Central - Izumi Hotel MYHOST Bizmate XX`

| Propiedad | Valor |
|-----------|-------|
| **ID** | `jyvFpkPes5DdoBRE` |
| **Estado** | ✅ Activo |
| **URL MCP** | `https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel` |

### Estructura del Workflow:

```
MCP Server Trigger (path: izumi-hotel)
         │
         ├── check_availability (HTTP Request Tool)
         │   └── POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/check_availability
         │
         ├── create_booking (HTTP Request Tool)
         │   └── POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings
         │
         ├── send_email_confirmation (HTTP Request Tool)
         │   └── POST https://api.sendgrid.com/v3/mail/send
         │
         ├── send_whatsapp_to_guest (HTTP Request Tool)
         │   └── POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/.../messages
         │
         └── send_whatsapp_to_staff (HTTP Request Tool)
             └── POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/.../messages
```

### Tools Configuradas:

#### 1. check_availability
```json
{
  "p_property_id": "{{ $fromAI('hotel_id', 'Hotel ID, use 18711359-1378-4d12-9ea6-fb31c0b1bac2 for Izumi Hotel') }}",
  "p_check_in": "{{ $fromAI('check_in', 'Check-in date in YYYY-MM-DD format') }}",
  "p_check_out": "{{ $fromAI('check_out', 'Check-out date in YYYY-MM-DD format') }}"
}
```

#### 2. create_booking
```json
{
  "property_id": "{{ $fromAI('property_id', 'Property ID of the selected room/villa') }}",
  "guest_name": "{{ $fromAI('guest_name', 'Full name of the guest') }}",
  "guest_email": "{{ $fromAI('guest_email', 'Guest email address') }}",
  "guest_phone": "{{ $fromAI('guest_phone', 'Guest phone with country code') }}",
  "check_in": "{{ $fromAI('check_in', 'Check-in date YYYY-MM-DD') }}",
  "check_out": "{{ $fromAI('check_out', 'Check-out date YYYY-MM-DD') }}",
  "guests": {{ $fromAI('guests', 'Number of guests') }},
  "total_price": {{ $fromAI('total_price', 'Total price as number') }},
  "status": "confirmed",
  "channel": "voice_ai"
}
```

#### 3-5. send_email_confirmation, send_whatsapp_to_guest, send_whatsapp_to_staff
- Envían confirmaciones al huésped y al staff del hotel

---

## ✅ FASE 3: COMPLETADA - Configuración VAPI

### Assistant Configurado:

| Propiedad | Valor |
|-----------|-------|
| **Nombre** | Izumi Hotel Receptionist (MCP) |
| **ID** | ae9ea22a-fc9a-49ba-b5b8-900ed69b7615 |
| **Modelo** | Anthropic Claude Sonnet 3.5 |
| **Voz** | ElevenLabs (English, female) |
| **Tool MCP** | izumi_hotel_tools |

### Tool MCP en VAPI:

| Propiedad | Valor |
|-----------|-------|
| **Nombre** | izumi_hotel_tools |
| **Server URL** | `https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel` |
| **Timeout** | 20 segundos |

### System Prompt:
```
You are the virtual receptionist at Izumi Hotel, a luxury boutique hotel in Ubud, Bali.
You speak natural, friendly and professional English.

Your goal is to help guests:
- Check availability and prices for rooms/villas.
- Confirm a reservation.
- Send confirmations via WhatsApp and email to the guest and staff.

Available MCP tools:

check_availability(hotel_id, check_in, check_out, guests)
Queries the system for available rooms and prices for a date range.

create_booking(hotel_id, room_id, check_in, check_out, guests, guest_name, guest_email, guest_phone, total_price, currency)
Creates a confirmed reservation in the system with guest details.

send_confirmations(booking_id, hotel_id, guest_name, guest_email, guest_phone, check_in, check_out, total_price, currency)
Sends booking confirmation via email and WhatsApp to the guest and via WhatsApp to internal staff.

Usage rules:
- Always ask for check-in and check-out dates and number of guests before calling check_availability.
- Use check_availability every time the guest asks about availability or changes dates/guests. Never invent availability or prices.
- Summarize maximum three options (room type, price per night, total price and currency).
- Clearly ask if they would like to book any of those options.
- If the guest accepts, ask for full name, email and phone number, and confirm which room/villa they chose.
- Call create_booking with all that data.
- If the booking is created successfully, communicate the booking code, check-in and check-out dates, and total amount.
- Then call send_confirmations to send confirmation messages; inform the guest they will receive a WhatsApp and email with details.
- Use short responses (1-2 sentences) for a smooth phone experience.
- If any tool returns an error, apologize, indicate there was an internal problem and offer to retry the operation.

Fixed hotel_id for this assistant: always use hotel_id = "18711359-1378-4d12-9ea6-fb31c0b1bac2" in the tools.

Use US dollars (USD) for prices, for example: "450 dollars per night" or "1,350 dollars total".
```

### First Message:
```
Hello! Welcome to Izumi Hotel, a luxury boutique hotel in Ubud, Bali. My name is Ayu, how can I help you today?
```

---

## ✅ FASE 4: COMPLETADA - Base de Datos Supabase

### Villas Registradas en `properties`:

| ID | Nombre | Precio/Noche | Max Huéspedes |
|----|--------|--------------|---------------|
| 18711359-1378-4d12-9ea6-fb31c0b1bac2 | Tropical Room | $450 | 2 |
| b9e3281c-31fc-4a69-a67d-22c7be146173 | River Villa | $500 | 2 |
| 259ec4fa-af30-47ed-ad25-3f161fee3265 | Nest Villa | $525 | 2 |
| ad5fc1f8-2b14-493a-8a83-5274082b5aad | Cave Villa | $550 | 2 |
| 35770b96-5007-45c7-91b9-7f832616767c | Sky Villa | $550 | 2 |
| fab4291a-96ac-481a-b736-c9c3c4edbf07 | Blossom Villa | $600 | 2 |
| 5210ed1d-99d2-4944-9cf0-f7f12b1f0a51 | 5BR Villa | $2,500 | 10 |

### Función `check_availability` Actualizada:

Devuelve todas las villas disponibles con nombre, precio, y estado de disponibilidad para las fechas solicitadas.

### Constraint `bookings_channel_check` Actualizado:

```sql
CHECK (channel IN ('direct', 'airbnb', 'booking', 'expedia', 'agoda', 'vrbo', 'voice_ai'))
```

---

## ✅ FASE 5: COMPLETADA - Limpieza

### Workflows Desactivados:

| Workflow | ID | Estado |
|----------|-----|--------|
| Vapi Izumi Hotel - MYHOST Bizmate IX | `3sU4RgV892az8nLZ` | ❌ Desactivado |
| Vapi Izumi Hotel - Nueva arquitectura | `DC0GU1AQ9VXMbX9w` | ❌ Desactivado |
| MCP - check_availability (separado) | `VXHTmwTK5BidYnbx` | ❌ Desactivado |
| MCP - create_booking (separado) | `0vJ1njAfvT69tItk` | ❌ Desactivado |
| MCP send confirmations (separado) | `fc4gf1eFELMTxBzL` | ❌ Desactivado |

### Workflow Activo:

| Workflow | ID | Estado |
|----------|-----|--------|
| MCP Central - Izumi Hotel MYHOST Bizmate XX | `jyvFpkPes5DdoBRE` | ✅ Activo |

---

## ✅ CONFIGURACIÓN RAILWAY (CRÍTICO)

Para que n8n genere URLs con HTTPS (requerido por VAPI), se configuraron estas variables de entorno:

```
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n-production-bb2d.up.railway.app
N8N_HOST=n8n-production-bb2d.up.railway.app
```

**⚠️ IMPORTANTE:** Sin estas variables, n8n genera URLs con `http://` y VAPI las rechaza porque requiere `https://`.

---

## RESUMEN DE ESTADOS

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Análisis y Planificación | ✅ Completado |
| 2 | Workflow MCP Central | ✅ Completado |
| 3 | Configuración VAPI | ✅ Completado |
| 4 | Base de Datos Supabase | ✅ Completado |
| 5 | Limpieza | ✅ Completado |

---

## CREDENCIALES (referencia)

**Supabase:**
- URL: `https://jjpscimtxrudtepzwhag.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`

**SendGrid:**
- API Key: `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`

**ChakraHQ WhatsApp:**
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`
- Bearer Token: `qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g`

**Izumi Hotel:**
- Property ID (Tropical Room): `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- WhatsApp Hotel: +62 813 2576 4867
- WhatsApp Staff (Jose): +34 619 79 46 04

---

## LECCIONES APRENDIDAS

### 1. Un solo MCP Server, múltiples Tools
❌ **Error inicial:** Crear 3 workflows MCP separados, cada uno con su propia URL.
✅ **Solución correcta:** Un único workflow MCP con todas las tools conectadas al mismo MCP Server Trigger.

### 2. HTTPS obligatorio para VAPI
❌ **Error:** n8n generaba URLs con `http://` por defecto.
✅ **Solución:** Configurar variables de entorno en Railway: `N8N_PROTOCOL=https`, `WEBHOOK_URL=https://...`

### 3. Constraint de base de datos
❌ **Error:** El campo `channel` en `bookings` no aceptaba `voice_ai`.
✅ **Solución:** Actualizar el constraint `bookings_channel_check` para incluir `voice_ai`.

### 4. Headers de Supabase
- `apikey`: Solo el token JWT (sin prefijo)
- `Authorization`: `Bearer` + token JWT

---

## PRUEBAS REALIZADAS

✅ Consulta de disponibilidad - Devuelve las 7 villas con precios reales
✅ Creación de reserva - Se guarda en Supabase con todos los datos
✅ Envío de WhatsApp al huésped - Confirmación recibida
✅ Envío de WhatsApp al staff - Notificación recibida
✅ Envío de email - (pendiente verificar)

---

## PRÓXIMOS PASOS SUGERIDOS

1. **Verificar email de confirmación** - Comprobar que SendGrid está enviando correctamente
2. **Pruebas con número de teléfono real** - Asignar un número de VAPI para llamadas entrantes
3. **Mejorar el prompt** - Añadir más detalles sobre las villas para que Claude las describa mejor
4. **Integrar con calendario** - Bloquear fechas reservadas automáticamente

---

**Documento actualizado:** 28 Diciembre 2025, 17:45 UTC
**Autor:** Claude + Jose
