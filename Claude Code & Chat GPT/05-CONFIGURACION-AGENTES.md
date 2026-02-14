# MY HOST BizMate - Configuración Técnica de Agentes
## Detalle de workflows y configuraciones

---

## AGENTE 1: WhatsApp AI Agent

### Información General
| Campo | Valor |
|-------|-------|
| Workflow ID | ln2myAS3406D6F8W |
| Nombre | WhatsApp AI Agent - Izumi Hotel (ChakraHQ) |
| Estado | ✅ Activo |
| Trigger | Webhook ChakraHQ |

### Arquitectura del Flujo
```
ChakraHQ Webhook
      │
      ▼
  Filter (solo mensajes de texto)
      │
      ▼
  Get Conversation History (Supabase)
      │
      ▼
  AI Agent (GPT-4.1-mini)
      │
      ├── Tool: Check Availability
      ├── Tool: Calculate Price  
      └── Tool: Create Booking
      │
      ▼
  Save to Conversation History
      │
      ▼
  Send WhatsApp Response (ChakraHQ API)
```

### System Prompt del AI Agent
```
You are the friendly AI assistant for Izumi Hotel, a boutique hotel in Ubud, Bali.

ABOUT THE HOTEL:
- Location: Jl Raya Andong N. 18, Ubud, Bali, Indonesia
- Style: Traditional Balinese with modern comforts
- Check-in: 14:00, Check-out: 11:00

ROOM TYPES:
- Deluxe Room: $89/night (2 guests max)
- Suite: $149/night (3 guests max)
- Villa: $249/night (4 guests max)

YOUR CAPABILITIES:
1. Answer questions about the hotel
2. Check room availability for specific dates
3. Calculate total prices
4. Create bookings

COMMUNICATION STYLE:
- Warm and welcoming
- Concise but helpful
- Use emojis sparingly
- Always confirm details before booking

LANGUAGES:
- Respond in the same language the guest uses
- Default to English if unclear
```

### Tools Configurados

#### Tool 1: Check Availability
```javascript
// Supabase query
SELECT room_type, available_rooms 
FROM room_availability 
WHERE property_id = $property_id 
  AND date BETWEEN $check_in AND $check_out
  AND available_rooms > 0;
```

#### Tool 2: Calculate Price
```javascript
// Cálculo de precio
const nights = daysBetween(check_in, check_out);
const roomPrice = getRoomPrice(room_type);
const subtotal = nights * roomPrice;
const taxes = subtotal * 0.21; // 21% tax
const total = subtotal + taxes;
```

#### Tool 3: Create Booking
```javascript
// Insert en Supabase
INSERT INTO bookings (
  property_id, guest_name, guest_email, guest_phone,
  check_in, check_out, room_type, guests, 
  total_price, status, channel
) VALUES (...);
```

### Mejoras Pendientes

#### Multimodal (Prioridad Alta)
- [ ] Detectar tipo de mensaje (texto/audio/imagen/PDF)
- [ ] Transcribir audios con Whisper API
- [ ] Analizar imágenes con GPT-4o-mini
- [ ] Extraer texto de PDFs

#### Funcionalidades adicionales
- [ ] Enviar fotos de habitaciones
- [ ] Procesar pagos
- [ ] Gestionar modificaciones de reserva
- [ ] Cancelaciones automáticas

---

## AGENTE 2: Booking Notification Complete

### Información General
| Campo | Valor |
|-------|-------|
| Workflow ID | F8YPuLhcNe6wGcCv |
| Nombre | Staff Notification - New Booking (Izumi Hotel) |
| Estado | ✅ Activo |
| Trigger | Supabase Database Webhook |

### Arquitectura del Flujo (Paralelo)
```
Supabase INSERT (bookings)
          │
          ▼
  Webhook - New Booking
          │
          ▼
  Format Booking Data
          │
          ▼
  Get Property Info
          │
    ┌─────┴─────┐
    ▼           ▼
WhatsApp    WhatsApp
to Guest    to Staff
    │           │
    └─────┬─────┘
          ▼
  Respond to Webhook
```

**IMPORTANTE:** El diseño usa ramas PARALELAS. Ambos nodos WhatsApp reciben datos directamente de "Get Property Info", no en serie.

### Configuración del Webhook en Supabase
```
Database → Webhooks → new_booking_notification

Table: bookings
Events: INSERT
Method: POST
URL: https://n8n-production-bb2d.up.railway.app/webhook/new-booking-notification
Headers:
  Content-Type: application/json
```

### Nodo: Format Booking Data
```json
{
  "booking_id": "{{ $json.body.record.id }}",
  "guest_name": "{{ $json.body.record.guest_name }}",
  "guest_email": "{{ $json.body.record.guest_email }}",
  "guest_phone": "{{ $json.body.record.guest_phone }}",
  "check_in": "{{ $json.body.record.check_in }}",
  "check_out": "{{ $json.body.record.check_out }}",
  "guests": {{ $json.body.record.guests }},
  "total_price": {{ $json.body.record.total_price }},
  "status": "{{ $json.body.record.status }}",
  "channel": "{{ $json.body.record.channel }}",
  "property_id": "{{ $json.body.record.property_id }}"
}
```

### Nodo: WhatsApp to Guest
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $('Format Booking Data').item.json.guest_phone }}",
  "type": "text",
  "text": {
    "body": "✅ *Reserva Confirmada*\n\nHola {{ $('Format Booking Data').item.json.guest_name }},\n\n¡Tu reserva ha sido confirmada!\n\n🏨 *Hotel:* {{ $json.name }}\n📍 *Ubicación:* Jl Raya Andong N. 18, Ubud, Bali\n📅 *Check-in:* {{ $('Format Booking Data').item.json.check_in }}\n📅 *Check-out:* {{ $('Format Booking Data').item.json.check_out }}\n👥 *Huéspedes:* {{ $('Format Booking Data').item.json.guests }}\n💰 *Total:* ${{ $('Format Booking Data').item.json.total_price }}\n\n¡Te esperamos! 🌺"
  }
}
```

### Nodo: WhatsApp to Staff
```json
{
  "messaging_product": "whatsapp",
  "to": "34619794604",
  "type": "text",
  "text": {
    "body": "🔔 *NUEVA RESERVA*\n\n👤 *Huésped:* {{ $('Format Booking Data').item.json.guest_name }}\n📧 *Email:* {{ $('Format Booking Data').item.json.guest_email }}\n📱 *Teléfono:* {{ $('Format Booking Data').item.json.guest_phone }}\n🏨 *Hotel:* {{ $json.name }}\n📍 *Ubicación:* Jl Raya Andong N. 18, Ubud, Bali\n📅 *Check-in:* {{ $('Format Booking Data').item.json.check_in }}\n📅 *Check-out:* {{ $('Format Booking Data').item.json.check_out }}\n👥 *Huéspedes:* {{ $('Format Booking Data').item.json.guests }}\n💰 *Total:* ${{ $('Format Booking Data').item.json.total_price }}"
  }
}
```

### Mejoras Pendientes

- [ ] Añadir email de confirmación (SendGrid/Gmail)
- [ ] Notificación de cancelación
- [ ] Recordatorio pre-llegada (1 día antes)
- [ ] Solicitud de review post-estancia

---

## LECCIÓN CRÍTICA: JSON EN N8N

### ❌ INCORRECTO - No funciona
```javascript
={{ JSON.stringify({
  "messaging_product": "whatsapp",
  "to": $('Nodo').item.json.phone,
  "text": { "body": "Hola " + $json.name }
}) }}
```

### ✅ CORRECTO - Funciona
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $('Nodo').item.json.phone }}",
  "type": "text",
  "text": {
    "body": "Hola {{ $json.name }}"
  }
}
```

### Reglas:
1. **NO usar** `={{ JSON.stringify() }}`
2. **Usar** JSON directo
3. **Expresiones** dentro de strings: `"valor: {{ $json.campo }}"`
4. **Nodos anteriores**: `{{ $('Nombre Nodo').item.json.campo }}`
5. **Nodo inmediato anterior**: `{{ $json.campo }}`

---

## URLS DE WEBHOOKS

### ChakraHQ → n8n (AI Agent)
```
https://n8n-production-bb2d.up.railway.app/webhook/[webhook-id-del-agente]
```

### Supabase → n8n (Booking Notification)
```
https://n8n-production-bb2d.up.railway.app/webhook/new-booking-notification
```

---

## API CHAKRAHQ

### Endpoint para enviar mensajes
```
POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages

Headers:
  Authorization: Bearer [ACCESS_TOKEN]
  Content-Type: application/json
```

### Estructura del mensaje
```json
{
  "messaging_product": "whatsapp",
  "to": "34619794604",
  "type": "text",
  "text": {
    "body": "Mensaje aquí"
  }
}
```

---

**Última actualización:** 13 Diciembre 2025
