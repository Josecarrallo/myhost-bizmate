# MY HOST BizMate - Documentación Completa del Proyecto
## Última actualización: 19 Diciembre 2024

---

# ÍNDICE
1. [Resumen del Proyecto](#resumen-del-proyecto)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Workflows n8n](#workflows-n8n)
4. [Configuraciones Técnicas](#configuraciones-técnicas)
5. [Prompts de los AI Agents](#prompts-de-los-ai-agents)
6. [Integraciones](#integraciones)
7. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
8. [Prompt de Recuperación](#prompt-de-recuperación)

---

# RESUMEN DEL PROYECTO

## Descripción
MY HOST BizMate es una plataforma SaaS que proporciona automatización de WhatsApp impulsada por IA y soluciones de gestión de propiedades para hoteles boutique y villas en el sudeste asiático, particularmente Indonesia y Bali.

## Cliente Piloto
**Izumi Hotel** - Hotel boutique de lujo 5 estrellas en Ubud, Bali
- Ubicación: Jl Raya Andong N. 18, Ubud, Bali, Indonesia
- Apertura: Verano 2026
- Teléfono: +62 813 2576 4867

## Propietario
**José Carrallo** - Fundador de MY HOST BizMate
- Opera entre España e Indonesia
- Teléfono: +34 619 794 604
- Email: josecarrallodelafuente@gmail.com

---

# ARQUITECTURA DEL SISTEMA

## Componentes Principales

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   WhatsApp      │────▶│    ChakraHQ     │────▶│      n8n        │
│   Business      │◀────│   (Coexistence) │◀────│   (Railway)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────────────┐
                        │                               │                               │
                        ▼                               ▼                               ▼
                ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
                │    Supabase     │             │     OpenAI      │             │     Vapi.ai     │
                │   (Database)    │             │   (GPT-4.1)     │             │ (Voice Widget)  │
                └─────────────────┘             └─────────────────┘             └─────────────────┘
```

## URLs y Endpoints

| Servicio | URL |
|----------|-----|
| n8n Dashboard | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| ChakraHQ | https://app.chakrahq.com |
| Vapi Dashboard | https://dashboard.vapi.ai |
| MY HOST BizMate Web | www.my-host-bizmate.com |

---

# WORKFLOWS N8N

## Workflow VII - Staff Notification
- **ID:** F8YPuLhcNe6wGcCv
- **Nombre:** Staff Notification - New Booking (Izumi Hotel) MYHOST Bizmate VII
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/F8YPuLhcNe6wGcCv
- **Estado:** ACTIVE
- **Función:** Envía notificaciones WhatsApp al staff y confirmación al huésped cuando se crea una reserva

### Mensaje de Confirmación al Huésped (Nodo: WhatsApp to Guest)
```json
{
  "messaging_product": "whatsapp",
  "to": "{{$('Format Booking Data').item.json.guest_phone}}",
  "type": "text",
  "text": {
    "body": "✅ *Reserva Confirmada*\n\nHola {{$('Format Booking Data').item.json.guest_name}},\n\n¡Tu reserva ha sido confirmada!\n\n🏨 *Hotel:* {{$json.name}}\n📍 *Ubicación:* Jl Raya Andong N. 18, Ubud, Bali\n📅 *Check-in:* {{$('Format Booking Data').item.json.check_in}}\n📅 *Check-out:* {{$('Format Booking Data').item.json.check_out}}\n👥 *Huéspedes:* {{$('Format Booking Data').item.json.guests}}\n💰 *Total:* ${{$('Format Booking Data').item.json.total_price}}\n\n¡Te esperamos! 🌺\n\n📞 CONTACTO IZUMI HOTEL\nWhatsApp: +62 813 2576 4867 (24/7)\nTeléfono: +62 813 2576 4867 (8:00-22:00)\nWeb: www.my-host-bizmate.com (Asistente de voz 24/7)"
  }
}
```

---

## Workflow VIII - WhatsApp AI Agent
- **ID:** ln2myAS3406D6F8W
- **Nombre:** WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate VIII
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/ln2myAS3406D6F8W
- **Webhook:** https://n8n-production-bb2d.up.railway.app/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53
- **Estado:** ACTIVE
- **Función:** Agente AI multimodal para WhatsApp (texto, audio, imágenes)

### Flujo de Nodos
```
Webhook → Filter → Switch ─┬─▶ Text ────────────────────────▶ AI Agent → From audio? ─┬─▶ HTTP Request (texto)
                           ├─▶ Download audio → Transcribe → Audio ─▶     │            └─▶ Generate audio → Upload → Send audio
                           └─▶ Download Image → Analyze → Image ──────────┘
```

### Herramientas del AI Agent
1. **Check Availability** - Consulta disponibilidad en Supabase
2. **Calculate Price** - Calcula precio total de estancia
3. **Create Booking** - Crea pre-reserva en Supabase

### System Message del AI Agent (FUNCIONAL)
```
Eres Ayu, la recepcionista virtual de Izumi Hotel, un hotel boutique de lujo 5 estrellas en Ubud, Bali.

INFO DEL HOTEL:
- Ubicación: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 14:00 | Check-out: 12:00
- Apertura: Verano 2026

HABITACIONES Y PRECIOS:
- Tropical Room: $450/noche
- River Villa: $500/noche
- Nest Villa: $525/noche
- Cave Villa: $550/noche
- Sky Villa: $550/noche
- Blossom Villa: $600/noche
- 5BR Villa: $2,500/noche

HERRAMIENTAS - ÚSALAS:
- Check Availability: Cuando pregunten disponibilidad. Requiere check_in y check_out en YYYY-MM-DD.
- Calculate Price: Para calcular precio total. Requiere check_in, check_out, guests.
- Create Booking: SOLO después de Calculate Price. Requiere: guest_name, guest_email, guest_phone, check_in, check_out, guests, y total_price del resultado de Calculate Price.

REGLAS:
1. Detecta idioma del usuario y responde en el mismo idioma
2. Respuestas cortas y amables
3. Para reservar pide: fechas, número de huéspedes, preferencia de habitación
4. SIEMPRE usa Calculate Price PRIMERO y dile el precio al usuario
5. DESPUÉS pide: nombre, email, teléfono
6. Al crear reserva, pasa el precio EXACTO de Calculate Price como total_price
7. Nunca uses comillas dobles en tus respuestas
```

### Nodo Create Booking - JSON Body
```json
{
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "guest_name": "{{ $fromAI('guest_name', 'nombre completo del huésped') }}",
  "guest_email": "{{ $fromAI('guest_email', 'email del huésped') }}",
  "guest_phone": "{{ $fromAI('guest_phone', 'teléfono del huésped con código de país') }}",
  "check_in": "{{ $fromAI('check_in', 'fecha de llegada en formato YYYY-MM-DD') }}",
  "check_out": "{{ $fromAI('check_out', 'fecha de salida en formato YYYY-MM-DD') }}",
  "guests": {{ $fromAI('guests', 'número de huéspedes como número entero') }},
  "total_price": {{ $fromAI('total_price', 'precio total en dólares como número entero sin símbolo, ejemplo 1120') }},
  "status": "inquiry",
  "channel": "direct"
}
```

---

## Workflow IX - Vapi Voice Assistant
- **ID:** 3sU4RgV892az8nLZ
- **Nombre:** Vapi Izumi Hotel - MYHOST Bizmate IX
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/3sU4RgV892az8nLZ
- **Webhook:** https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix
- **Estado:** ACTIVE (activar cuando se use)
- **Función:** Backend para el asistente de voz Vapi en la web

### Flujo de Nodos
```
Webhook for vapi → Keep Session id & Query → AI Agent → Respond to Vapi
```

### System Message del AI Agent (FUNCIONAL)
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
- Create Booking: Use when you have ALL data: guest name, email, phone, check-in, check-out, number of guests, and total_price. You MUST include the total_price from the Calculate Price result.

RULES:
1. Detect user language and respond in same language
2. Keep responses short and friendly
3. When user wants to book, ask for: dates, number of guests, room preference
4. ALWAYS use Calculate Price first, then pass that exact price number to Create Booking as total_price
5. Never use quotes (") in your responses, use single quotes (') instead
```

### Nodo Respond to Vapi
```json
{
  "results": [
    {
      "toolCallId": "{{ $('Keep Session id & Query').item.json.id }}",
      "result": "{{ $json.output }}"
    }
  ]
}
```

---

# CONFIGURACIONES TÉCNICAS

## Supabase

### Credenciales
- **URL:** https://jjpscimtxrudtepzwhag.supabase.co
- **API Key (anon):** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

### Property ID (Izumi Hotel)
```
18711359-1378-4d12-9ea6-fb31c0b1bac2
```

### Funciones RPC
- `check_availability(p_property_id, p_check_in, p_check_out)`
- `calculate_booking_price(p_property_id, p_check_in, p_check_out, p_guests)`

### Tabla Bookings
| Campo | Tipo | Descripción |
|-------|------|-------------|
| property_id | UUID | ID de la propiedad |
| guest_name | String | Nombre del huésped |
| guest_email | String | Email del huésped |
| guest_phone | String | Teléfono con código país |
| check_in | Date | Fecha entrada (YYYY-MM-DD) |
| check_out | Date | Fecha salida (YYYY-MM-DD) |
| guests | Integer | Número de huéspedes |
| total_price | Integer | Precio total en USD |
| status | String | Estado (inquiry, confirmed, etc.) |
| channel | String | Canal (direct, whatsapp, voice) |

---

## ChakraHQ

### Configuración WhatsApp
- **Plugin ID:** 2e45a0bd-8600-41b4-ac92-599d59d6221c
- **Phone Number ID:** 944855278702577
- **Número conectado:** +62 813-2576-4867 (Izumi Hotel)
- **Estado:** CONNECTED

### API Endpoint para envío de mensajes
```
https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages
```

### Bearer Token
```
qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

---

## OpenAI

### Credencial n8n
- **ID:** hlVVk9ThwmKbr4yS
- **Nombre:** OpenAi account 4

### Modelos utilizados
- **AI Agent:** gpt-4.1-mini
- **Análisis de imágenes:** gpt-4o-mini
- **Transcripción de audio:** whisper-1
- **Generación de audio:** tts-1 (voz: onyx)

---

## Vapi.ai

### Configuración del Widget
- **Webhook URL:** https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix
- **Tool Name:** askQuestion
- **Tool Parameter:** user_query

---

# INTEGRACIONES

## Flujo de Reserva Completo

```
1. Usuario envía mensaje WhatsApp → 
2. ChakraHQ recibe y envía webhook a n8n →
3. Workflow VIII procesa con AI Agent →
4. AI Agent usa tools de Supabase →
5. Se crea booking en Supabase →
6. Supabase trigger activa Workflow VII →
7. Staff recibe notificación WhatsApp →
8. Huésped recibe confirmación WhatsApp
```

---

# SOLUCIÓN DE PROBLEMAS COMUNES

## Problema: Precio $0 en reservas

**Causa:** El AI Agent no pasa el total_price a Create Booking

**Solución:**
1. Verificar que Create Booking tenga `$fromAI('total_price'...)` en el JSON
2. El prompt del AI Agent debe incluir instrucción explícita de usar Calculate Price ANTES de Create Booking
3. Usar prompts simples y directos (el prompt largo no funciona bien)

## Problema: Mensajes de WhatsApp no llegan

**Causa:** Cache corrupto en la app de WhatsApp

**Solución:**
1. Borrar mensajes pendientes (con reloj)
2. Borrar el chat completo
3. Forzar cierre de WhatsApp
4. Esperar 10 segundos
5. Reabrir y enviar nuevo mensaje

## Problema: Sesión de 24 horas expirada

**Causa:** WhatsApp Business API solo permite mensajes durante 24h después del último mensaje del cliente

**Solución:** El cliente debe enviar un mensaje primero para abrir nueva ventana de 24h

## Problema: JSON inválido en respuestas

**Causa:** El AI Agent incluye comillas dobles o saltos de línea en sus respuestas

**Solución:**
1. Añadir regla en el prompt: "Nunca uses comillas dobles en tus respuestas"
2. En Workflow IX se puede añadir nodo Code para limpiar caracteres problemáticos

---

# PROMPT DE RECUPERACIÓN

## Para iniciar nueva conversación con Claude sobre este proyecto:

```
Soy José Carrallo, fundador de MY HOST BizMate, una plataforma SaaS de automatización WhatsApp con IA para hoteles boutique en Bali/Indonesia.

PROYECTO ACTUAL: Sistema de reservas para Izumi Hotel (hotel boutique 5 estrellas en Ubud, Bali, apertura verano 2026)

ARQUITECTURA:
- n8n en Railway (workflows de automatización)
- ChakraHQ (WhatsApp Business API con coexistencia)
- Supabase (base de datos PostgreSQL)
- OpenAI GPT-4.1-mini (AI Agent)
- Vapi.ai (asistente de voz web)

WORKFLOWS ACTIVOS:
1. Workflow VII (F8YPuLhcNe6wGcCv) - Staff Notification: Notifica al staff y confirma al huésped cuando hay nueva reserva
2. Workflow VIII (ln2myAS3406D6F8W) - WhatsApp AI Agent: Agente multimodal (texto, audio, imágenes) para atención al cliente
3. Workflow IX (3sU4RgV892az8nLZ) - Vapi Voice: Backend para asistente de voz en la web

FUNCIONALIDADES COMPLETADAS:
✅ Chatbot WhatsApp multimodal (texto, audio, imágenes)
✅ Verificación de disponibilidad en tiempo real
✅ Cálculo de precios automático
✅ Creación de reservas con precio correcto
✅ Notificaciones automáticas al staff
✅ Confirmación automática al huésped con info de contacto
✅ Asistente de voz web (Vapi)
✅ Respuesta audio-a-audio en WhatsApp

DATOS IMPORTANTES:
- Supabase URL: https://jjpscimtxrudtepzwhag.supabase.co
- Property ID Izumi: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- WhatsApp Izumi: +62 813 2576 4867
- n8n: https://n8n-production-bb2d.up.railway.app

PROBLEMA RESUELTO HOY (19/12/2024):
El precio se guardaba como $0. Solución: prompt simple y directo que instruye al AI Agent a usar Calculate Price ANTES de Create Booking y pasar el precio exacto.

¿En qué puedo ayudarte hoy?
```

---

# INFORMACIÓN DE CONTACTO

## Izumi Hotel
- **WhatsApp:** +62 813 2576 4867 (24/7)
- **Teléfono:** +62 813 2576 4867 (8:00-22:00 hora Bali)
- **Web:** www.my-host-bizmate.com (Asistente de voz 24/7)
- **Email:** reservations@izumi-hotel.com

## José Carrallo (Fundador)
- **WhatsApp/Teléfono:** +34 619 794 604
- **Email:** josecarrallodelafuente@gmail.com

---

*Documento generado el 19 de Diciembre de 2024*
*MY HOST BizMate - AI-Powered Hospitality Solutions*
