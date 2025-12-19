# MY HOST BIZMATE - CONFIGURACIÓN DE AGENTES
## Guía Técnica Detallada
### Versión 3.0 - 15 Diciembre 2024

---

## AGENTE 1: BOOKING CONFIRMATION FLOW

**Workflow ID:** `OxNTDO0yitqV6MAL`
**Webhook:** `/webhook/booking-created`

### Flujo
```
Webhook → Get Property → Send Email → WhatsApp Huésped → WhatsApp Propietario
```

### Trigger
Se activa cuando se crea una reserva en Supabase (via Database Webhook o llamada manual).

### Payload esperado
```json
{
  "property_id": "uuid",
  "guest_name": "string",
  "guest_email": "string",
  "guest_phone": "string",
  "check_in": "YYYY-MM-DD",
  "check_out": "YYYY-MM-DD",
  "guests_count": number,
  "total_amount": number
}
```

---

## AGENTE 2: WHATSAPP AI AGENT

**Workflow ID:** `ln2myAS3406D6F8W`
**Webhook:** `/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53`
**WhatsApp:** +62 813 2576 4867

### Capacidades
- ✅ Texto: Respuestas con GPT-4.1-mini
- ✅ Audio IN: Transcripción con Whisper
- ✅ Audio OUT: Respuesta con TTS (voz "onyx")
- ✅ Imágenes: Análisis con GPT-4o Vision
- ✅ Tools: Check Availability, Calculate Price, Create Booking

### Flujo Principal
```
Webhook → Filter → Switch (Text/Audio/Image)
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        Text      Transcribe      Analyze
          │             │             │
          └─────────────┼─────────────┘
                        ▼
                    AI Agent
                        │
                 ┌──────┴──────┐
                 ▼             ▼
           Audio OUT      Text OUT
```

### Configuración AI Agent

**Modelo:** gpt-4.1-mini
**Memoria:** Simple Memory por número de teléfono
**Tools conectados:** 3 (Check, Calculate, Create)

### System Prompt
Ver archivo `PROMPT_AI_AGENT_IZUMI_v3.md`

---

## AGENTE 3: VAPI VOICE ASSISTANT

**Workflow ID:** `3sU4RgV892az8nLZ`
**Webhook:** `/webhook/vapi-izumi-fix`
**Estado:** ✅ Activo

### Configuración Vapi.ai

| Setting | Valor |
|---------|-------|
| Model | OpenAI GPT-4o Mini |
| Voice | OpenAI shimmer |
| Transcriber | Deepgram English |
| Tool | send_to_n8n |
| Timeout | 20 segundos |

### Flujo
```
Vapi Call → Webhook → Extract id & query → AI Agent → Respond to Vapi
                                              ↑
                                   3 Tools conectados
```

### ⚠️ Configuración Crítica

**Extracción de datos (CORRECTO):**
```javascript
id: {{ $json.body.message.toolCallList[0].id }}
question: {{ $json.body.message.toolCallList[0].function.arguments.user_query }}
```

**AI Agent versión:** Debe ser v3 (v2.2 tiene bugs con tools)

### System Prompt Vapi (en n8n AI Agent)
```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury 5-star boutique hotel in Ubud, Bali.

HOTEL INFO:
- Location: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 2:00 PM | Check-out: 12:00 PM
- Opening: Summer 2026

ROOMS AND PRICES:
- Tropical Room: $450/night
- River Villa: $500/night
- Nest Villa: $525/night
- Cave Villa: $550/night
- Sky Villa: $550/night
- Blossom Villa: $600/night
- 5BR Villa: $2,500/night

TOOLS - USE THEM:
- Check Availability: Use when user asks about availability or wants to book. Requires check_in and check_out in YYYY-MM-DD format.
- Calculate Price: Use to calculate total price. Requires check_in, check_out, number of guests.
- Create Booking: Use when you have ALL data: guest name, email, phone, check-in, check-out, number of guests. Create the booking immediately.

RULES:
1. Detect user language and respond in same language
2. Keep responses short and friendly
3. When user wants to book, ask for: dates, number of guests, room preference
4. Always calculate and tell the price before creating the booking
```

---

## CONFIGURACIÓN DE TOOLS (SUPABASE)

### Headers comunes
```json
{
  "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
```

### Check Availability
```
URL: https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/check_availability
Method: POST
Body:
{
  "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "p_check_in": "{{ $fromAI('check_in') }}",
  "p_check_out": "{{ $fromAI('check_out') }}"
}
```

### Calculate Price
```
URL: https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/calculate_booking_price
Method: POST
Body:
{
  "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "p_check_in": "{{ $fromAI('check_in') }}",
  "p_check_out": "{{ $fromAI('check_out') }}",
  "p_guests": "{{ $fromAI('guests') }}"
}
```

### Create Booking
```
URL: https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings
Method: POST
Headers adicional: "Prefer": "return=representation"
Body:
{
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "guest_name": "{{ $fromAI('guest_name') }}",
  "guest_email": "{{ $fromAI('guest_email') }}",
  "guest_phone": "{{ $fromAI('guest_phone') }}",
  "check_in": "{{ $fromAI('check_in') }}",
  "check_out": "{{ $fromAI('check_out') }}",
  "guests": {{ $fromAI('guests') }},
  "total_price": 0,
  "status": "inquiry",
  "channel": "direct"
}
```

---

*Última actualización: 15 Diciembre 2024*
