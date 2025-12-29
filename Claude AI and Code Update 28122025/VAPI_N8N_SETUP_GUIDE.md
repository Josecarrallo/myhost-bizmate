# 🎯 VAPI + n8n Redesign - Setup Guide
## MY HOST BizMate - Izumi Hotel Voice AI

**Fecha:** 28 Diciembre 2025  
**Objetivo:** Eliminar doble IA, Claude como único cerebro conversacional

---

## ✅ WORKFLOWS CREADOS

| ID | Nombre | Webhook URL | Estado |
|---|---|---|---|
| `mbzNgTRzxsU9Meya` | WF-VAPI-01 - Check Availability | `/webhook/vapi/check-availability` | 🔴 Pendiente activar |
| `AyMbMnyh27K5CbfZ` | WF-VAPI-02 - Create Booking | `/webhook/vapi/create-booking` | 🔴 Pendiente activar |
| `AIoZXXsMYnsyCXxe` | WF-VAPI-03 - Send Confirmations | `/webhook/vapi/send-confirmations` | 🔴 Pendiente activar |

**URLs Base:** `https://n8n-production-bb2d.up.railway.app`

---

## 📋 PASOS PENDIENTES

### 1. Activar Workflows en n8n (Manual)

1. Ir a: https://n8n-production-bb2d.up.railway.app
2. Para cada workflow:
   - Abrir el workflow
   - Click en el toggle "Active" (arriba derecha)
   - Verificar que el webhook esté disponible

### 2. Crear Función check_availability en Supabase

```sql
CREATE OR REPLACE FUNCTION check_availability(
  p_hotel_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER DEFAULT 2
)
RETURNS TABLE (
  room_id UUID,
  room_name TEXT,
  room_type TEXT,
  max_guests INTEGER,
  price_per_night NUMERIC,
  total_nights INTEGER,
  total_price NUMERIC,
  amenities JSONB,
  description TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_nights INTEGER;
BEGIN
  v_nights := p_check_out - p_check_in;
  
  RETURN QUERY
  SELECT 
    r.id as room_id,
    r.name as room_name,
    r.room_type,
    r.max_guests,
    r.price_per_night,
    v_nights as total_nights,
    (r.price_per_night * v_nights) as total_price,
    r.amenities,
    r.description
  FROM rooms r
  WHERE r.property_id = p_hotel_id
    AND r.max_guests >= p_guests
    AND r.status = 'available'
    AND NOT EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.room_id = r.id
        AND b.status IN ('confirmed', 'pending')
        AND (
          (b.check_in <= p_check_in AND b.check_out > p_check_in)
          OR (b.check_in < p_check_out AND b.check_out >= p_check_out)
          OR (b.check_in >= p_check_in AND b.check_out <= p_check_out)
        )
    )
  ORDER BY r.price_per_night ASC;
END;
$$;
```

### 3. Configurar VAPI Assistant

**Assistant ID:** `1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61`

#### System Prompt (Actualizar en VAPI Dashboard)

```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury boutique hotel in Ubud, Bali.

LANGUAGE: Always respond in English. Pronounce numbers naturally.

AVAILABLE TOOLS:
- check_availability: Check available rooms for given dates
- create_booking: Create a confirmed reservation
- send_confirmations: Send email and WhatsApp confirmation

CONVERSATION FLOW:
1. When user provides dates → use check_availability
2. Summarize maximum 3 room options
3. If they want to book → collect name, email, phone
4. Confirm details and use create_booking
5. If booking OK → use send_confirmations
6. Inform guest they will receive WhatsApp and email

RULES:
- Keep responses short (1-2 sentences) for phone fluency
- Never invent availability or prices
- Always use hotel_id = "18711359-1378-4d12-9ea6-fb31c0b1bac2"
- Be warm and professional
- For dates, ask for month and day clearly
```

#### Tools Configuration (JSON para VAPI)

```json
[
  {
    "type": "function",
    "function": {
      "name": "check_availability",
      "description": "Check available rooms for specific dates at the hotel",
      "parameters": {
        "type": "object",
        "properties": {
          "hotel_id": {
            "type": "string",
            "description": "Hotel ID - always use 18711359-1378-4d12-9ea6-fb31c0b1bac2"
          },
          "check_in": {
            "type": "string",
            "description": "Check-in date in YYYY-MM-DD format"
          },
          "check_out": {
            "type": "string",
            "description": "Check-out date in YYYY-MM-DD format"
          },
          "guests": {
            "type": "integer",
            "description": "Number of guests"
          }
        },
        "required": ["hotel_id", "check_in", "check_out", "guests"]
      }
    },
    "server": {
      "url": "https://n8n-production-bb2d.up.railway.app/webhook/vapi/check-availability"
    }
  },
  {
    "type": "function",
    "function": {
      "name": "create_booking",
      "description": "Create a confirmed booking reservation",
      "parameters": {
        "type": "object",
        "properties": {
          "hotel_id": {
            "type": "string",
            "description": "Hotel ID"
          },
          "room_id": {
            "type": "string",
            "description": "Room ID from availability check"
          },
          "check_in": {
            "type": "string",
            "description": "Check-in date YYYY-MM-DD"
          },
          "check_out": {
            "type": "string",
            "description": "Check-out date YYYY-MM-DD"
          },
          "guests": {
            "type": "integer",
            "description": "Number of guests"
          },
          "guest_name": {
            "type": "string",
            "description": "Guest full name"
          },
          "guest_email": {
            "type": "string",
            "description": "Guest email address"
          },
          "guest_phone": {
            "type": "string",
            "description": "Guest phone with country code"
          },
          "total_price": {
            "type": "number",
            "description": "Total booking price"
          }
        },
        "required": ["hotel_id", "room_id", "check_in", "check_out", "guests", "guest_name", "guest_email", "guest_phone", "total_price"]
      }
    },
    "server": {
      "url": "https://n8n-production-bb2d.up.railway.app/webhook/vapi/create-booking"
    }
  },
  {
    "type": "function",
    "function": {
      "name": "send_confirmations",
      "description": "Send booking confirmation via email and WhatsApp",
      "parameters": {
        "type": "object",
        "properties": {
          "booking_id": {
            "type": "string",
            "description": "Booking ID from create_booking"
          },
          "hotel_id": {
            "type": "string",
            "description": "Hotel ID"
          },
          "guest_name": {
            "type": "string",
            "description": "Guest name"
          },
          "guest_email": {
            "type": "string",
            "description": "Guest email"
          },
          "guest_phone": {
            "type": "string",
            "description": "Guest phone"
          },
          "check_in": {
            "type": "string",
            "description": "Check-in date"
          },
          "check_out": {
            "type": "string",
            "description": "Check-out date"
          },
          "total_price": {
            "type": "number",
            "description": "Total price"
          }
        },
        "required": ["booking_id", "hotel_id", "guest_name", "guest_email", "guest_phone", "check_in", "check_out", "total_price"]
      }
    },
    "server": {
      "url": "https://n8n-production-bb2d.up.railway.app/webhook/vapi/send-confirmations"
    }
  }
]
```

---

## 🏗️ ARQUITECTURA FINAL

```
Cliente (voz/teléfono)
       │
       ▼
[VAPI Assistant con Claude] ← Único cerebro conversacional
       │
       │  (llama webhooks como tools)
       ▼
[n8n Webhooks - SIN LLM]
   ├─ /vapi/check-availability → Supabase RPC
   ├─ /vapi/create-booking → Supabase INSERT
   └─ /vapi/send-confirmations → Email + WhatsApp
       │
       ▼
[Supabase] + [SendGrid] + [ChakraHQ WhatsApp]
```

---

## 🧪 TESTING

### Test Check Availability
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/vapi/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "check_in": "2026-07-15",
    "check_out": "2026-07-18",
    "guests": 2
  }'
```

### Test Create Booking
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/vapi/create-booking \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "room_id": "ROOM_ID_FROM_AVAILABILITY",
    "check_in": "2026-07-15",
    "check_out": "2026-07-18",
    "guests": 2,
    "guest_name": "John Test",
    "guest_email": "john@test.com",
    "guest_phone": "+1234567890",
    "total_price": 450
  }'
```

### Test Send Confirmations
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/vapi/send-confirmations \
  -H "Content-Type: application/json" \
  -d '{
    "booking_id": "BOOKING_ID",
    "hotel_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "guest_name": "John Test",
    "guest_email": "john@test.com",
    "guest_phone": "+1234567890",
    "check_in": "2026-07-15",
    "check_out": "2026-07-18",
    "total_price": 450
  }'
```

---

## 📝 NOTAS IMPORTANTES

1. **Formato de respuesta VAPI:** Los webhooks devuelven el formato esperado por VAPI:
   ```json
   {
     "results": [{
       "toolCallId": "...",
       "result": { ... }
     }]
   }
   ```

2. **Extracción de parámetros:** Los workflows extraen parámetros tanto del formato VAPI (`message.toolCalls[0].function.arguments`) como de llamadas directas (`body.param`)

3. **Sin LLM interno:** Ningún workflow usa AI Agent ni LLM - solo lógica de datos

4. **Credenciales configuradas:**
   - Supabase: `SJLQzwU9BVHEVAGc`
   - SendGrid: `Y35BYbcV5SYfjBwc`
   - ChakraHQ: Bearer token incluido en HTTP nodes

---

## 🎯 CHECKLIST FINAL

- [ ] Activar WF-VAPI-01 en n8n
- [ ] Activar WF-VAPI-02 en n8n
- [ ] Activar WF-VAPI-03 en n8n
- [ ] Crear función `check_availability` en Supabase
- [ ] Verificar tabla `rooms` existe con campos correctos
- [ ] Verificar tabla `bookings` permite INSERT
- [ ] Actualizar System Prompt en VAPI Dashboard
- [ ] Configurar Tools en VAPI Dashboard
- [ ] Probar llamada de voz completa
