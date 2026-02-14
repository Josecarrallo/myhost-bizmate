# MY HOST BIZMATE - DOCUMENTACIÓN TÉCNICA PARA DESARROLLO
## Guía Completa para Claude Code
### Versión 3.0 - 15 Diciembre 2024

---

# ÍNDICE

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Workflows n8n Documentados (I-IX)](#3-workflows-n8n-documentados)
4. [Base de Datos Supabase](#4-base-de-datos-supabase)
5. [APIs y Credenciales](#5-apis-y-credenciales)
6. [Tareas de Desarrollo Frontend](#6-tareas-de-desarrollo-frontend)
7. [Tareas de Desarrollo Backend](#7-tareas-de-desarrollo-backend)
8. [Integración Vapi Voice Widget](#8-integracion-vapi-voice-widget)
9. [Analytics y Dashboard](#9-analytics-y-dashboard)
10. [Checklist de Implementación](#10-checklist-de-implementacion)

---

# 1. RESUMEN DEL PROYECTO

## 1.1 Qué es MY HOST BizMate

MY HOST BizMate es una plataforma SaaS de gestión hotelera con agentes de IA integrados. Está diseñada para hoteles boutique y villas en Indonesia y el Sudeste Asiático.

## 1.2 Estado Actual

| Componente | Estado | Descripción |
|------------|--------|-------------|
| Frontend React | ✅ Desplegado | 19 módulos en Vercel |
| Supabase | ✅ Activo | PostgreSQL + Auth + Storage |
| n8n Workflows | ✅ 9 Workflows | Railway deployment |
| WhatsApp Agent | ✅ Funcionando | Texto + Audio + Imágenes |
| Vapi Voice | ✅ Funcionando | Voz en tiempo real |
| Widget Vapi | 🔴 Pendiente | Integrar en React |
| Analytics | 🔴 Pendiente | Dashboard de métricas |

## 1.3 Propiedad de Prueba

**Izumi Hotel** - Hotel boutique 5 estrellas en Ubud, Bali
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- WhatsApp: +62 813 2576 4867
- Apertura: Verano 2026

---

# 2. ARQUITECTURA DEL SISTEMA

## 2.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vercel)                       │
│                   React + Tailwind CSS                       │
│                    19 módulos desplegados                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND/AUTOMACIÓN                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    n8n      │  │   Vapi.ai   │  │  ChakraHQ   │         │
│  │  (Railway)  │  │   (Voice)   │  │ (WhatsApp)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     BASE DE DATOS                            │
│                       Supabase                               │
│            PostgreSQL + Auth + Storage + RPC                 │
└─────────────────────────────────────────────────────────────┘
```

## 2.2 URLs de Servicios

| Servicio | URL |
|----------|-----|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| ChakraHQ API | https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c |
| Vapi Dashboard | https://dashboard.vapi.ai |

---

# 3. WORKFLOWS N8N DOCUMENTADOS

## WORKFLOW I: Recomendaciones IA Diarias
**ID:** `8xWqs3rlUZmSf8gc`  
**Nombre:** Flujo B - Recomendaciones IA Diarias FINAL MY HOST Bizmate I  
**Estado:** Inactivo (para activar cuando haya huéspedes)

### Descripción
Genera recomendaciones personalizadas diarias para huéspedes activos usando Claude API.

### Flujo
```
Trigger 9 AM Diario → Obtener Huespedes Activos (Supabase) → Claude API → Formatear Datos → Guardar en Supabase → Send WhatsApp
```

### Nodos
| Nodo | Tipo | Función |
|------|------|---------|
| Trigger 9 AM Diario | scheduleTrigger | Cron: `0 9 * * *` |
| Obtener Huespedes Activos | supabase | GET bookings WHERE status=confirmed |
| Claude API | httpRequest | POST api.anthropic.com/v1/messages |
| Formatear Datos | set | Mapea guest_id, recommendations, sent_at |
| Guardar en Supabase | supabase | INSERT recommendation_logs |
| Send message | whatsApp | Envía mensaje a huésped |

### Prompt Claude
```
Eres un concierge experto en Bali. Genera 5 recomendaciones para {{ $json.guest_name }}. 
Check-in: {{ $json.check_in }}, Check-out: {{ $json.check_out }}. 
Incluye: 1 restaurante, 1 actividad cultural, 1 naturaleza, 1 relax, 1 tip secreto. 
Responde en español.
```

---

## WORKFLOW II: Chatbot WhatsApp + Claude (Básico)
**ID:** `P0U2nNLqGzLvermS`  
**Nombre:** Chatbot WhatsApp + Claude (Webhook Manual) MY HOST Bizmate II  
**Estado:** Inactivo (reemplazado por VIII)

### Descripción
Versión básica de chatbot WhatsApp con Claude API directo.

### Flujo
```
Webhook GET (Verify) → Respond Challenge
Webhook POST → ACK a Meta → Es Mensaje? → Claude API → Send WhatsApp
```

### Notas
- Versión inicial sin AI Agent de n8n
- Sin memoria de conversación
- Reemplazado por workflow VIII más avanzado

---

## WORKFLOW IV: WhatsApp AI Chatbot (Con AI Agent)
**ID:** `mEth5Jcuswp2cNXt`  
**Nombre:** WhatsApp AI Chatbot - MY HOST Bizmate IV  
**Estado:** Inactivo (evolución hacia VIII)

### Descripción
Primera implementación con AI Agent de n8n y memoria.

### Flujo
```
Webhook → Edit Fields → AI Agent → Send WhatsApp
                           ↑
              OpenAI Chat Model + Simple Memory
```

### Mejoras vs II
- Usa AI Agent de n8n en lugar de HTTP Request a Claude
- Añade Simple Memory para contexto de conversación
- Extrae sender y message del payload

---

## WORKFLOW VI: Booking Confirmation Flow
**ID:** `OxNTDO0yitqV6MAL`  
**Nombre:** MY HOST - Booking Confirmation Flow (Email+WhatsApp Chakra - MY HOST Bizmate VI)  
**Estado:** Activo

### Descripción
Flujo de confirmación de reservas: envía email al huésped y WhatsApp al huésped + propietario.

### Flujo
```
Webhook (booking-created) → Get Property Info → Send Email → WhatsApp Huésped → WhatsApp Propietario
```

### Webhook
- **Path:** `/webhook/booking-created`
- **Método:** POST
- **Payload esperado:**
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

### Nodos
| Nodo | Tipo | Función |
|------|------|---------|
| Webhook | webhook | Recibe datos de reserva |
| Get a row | supabase | Obtiene info de propiedad |
| Send an email | sendGrid | Email confirmación al huésped |
| HTTP Request | httpRequest | WhatsApp huésped via ChakraHQ |
| WhatsApp Propietario | httpRequest | Notifica al propietario |

### Template Email
```
¡Hola {{ guest_name }}!

Tu reserva ha sido confirmada exitosamente.

DETALLES DE TU RESERVA:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Propiedad: {{ property.name }}
📍 Ubicación: {{ property.location }}
📅 Check-in: {{ check_in }}
📅 Check-out: {{ check_out }}
👥 Huéspedes: {{ guests_count }}
💰 Total: ${{ total_amount }}

¡Esperamos verte pronto!
El equipo de MY HOST BizMate 🌺
```

---

## WORKFLOW VII: Staff Notification
**ID:** `F8YPuLhcNe6wGcCv`  
**Nombre:** Staff Notification - New Booking (Izumi Hotel) MYHOST Bizmate VII  
**Estado:** Activo

### Descripción
Notifica al staff del hotel cuando se crea una nueva reserva via webhook de Supabase.

### Flujo
```
Webhook (new-booking) → Format Booking Data → Get Property Info → [WhatsApp Guest + WhatsApp Staff] → Respond
```

### Webhook
- **Path:** `/webhook/new-booking-notification`
- **Método:** POST
- **Trigger:** Supabase Database Webhook on INSERT bookings

### Payload Supabase Webhook
```json
{
  "type": "INSERT",
  "table": "bookings",
  "record": {
    "id": "uuid",
    "property_id": "uuid",
    "guest_name": "string",
    "guest_email": "string",
    "guest_phone": "string",
    "check_in": "date",
    "check_out": "date",
    "guests": number,
    "total_price": number,
    "status": "string",
    "channel": "string",
    "created_at": "timestamp"
  }
}
```

---

## WORKFLOW VIII: WhatsApp AI Agent Completo (PRINCIPAL)
**ID:** `ln2myAS3406D6F8W`  
**Nombre:** WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate VIII  
**Estado:** Activo 24/7  
**WhatsApp:** +62 813 2576 4867

### Descripción
Agente de IA completo para WhatsApp que maneja texto, audio bidireccional e imágenes. Puede consultar disponibilidad, calcular precios y crear reservas.

### Flujo Principal
```
Webhook → Filter (solo mensajes) → Switch (Text/Audio/Image/Document)
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    ▼                     ▼                     ▼
                  Text              Download Audio         Download Image
                    │                     │                     │
                    │              Transcribe (Whisper)    Analyze (GPT-4o)
                    │                     │                     │
                    └─────────────────────┼─────────────────────┘
                                          ▼
                                      AI Agent ←── OpenAI Chat Model
                                          │    ←── Simple Memory
                                          │    ←── Check Availability
                                          │    ←── Calculate Price
                                          │    ←── Create Booking
                                          ▼
                                From audio to audio?
                                    │         │
                                   Yes       No
                                    │         │
                              Generate Audio  Send Text
                                    │
                              Upload to ChakraHQ
                                    │
                              Send Audio WhatsApp
```

### Webhook
- **Path:** `/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53`
- **Método:** POST
- **Origen:** ChakraHQ (Meta WhatsApp Business API)

### Nodos Principales

| Nodo | Tipo | Función |
|------|------|---------|
| Webhook | webhook | Recibe mensajes de ChakraHQ |
| Filter | filter | Solo procesa mensajes (ignora status) |
| Switch | switch | Clasifica: Text, Audio, Image, Document |
| Download audio | httpRequest | Descarga audio de ChakraHQ |
| Transcribe a recording | openAi | Whisper transcription |
| Download Image | httpRequest | Descarga imagen de ChakraHQ |
| Analyze image | openAi | GPT-4o Vision analysis |
| AI Agent | agent | Procesa con GPT-4.1-mini + tools |
| Simple Memory | memoryBufferWindow | Memoria por sesión (phone number) |
| Check Availability | httpRequestTool | Supabase RPC |
| Calculate Price | httpRequestTool | Supabase RPC |
| Create Booking | httpRequestTool | Supabase INSERT |
| From audio to audio? | if | Detecta si input fue audio |
| Generate audio | openAi | TTS con voz "onyx" |
| Upload Audio to ChakraHQ | httpRequest | Sube audio para URL pública |
| Send audio | httpRequest | Envía nota de voz |
| HTTP Request | httpRequest | Envía texto plano |

### System Prompt AI Agent
```
Eres el asistente virtual de Izumi Hotel, un hotel boutique de lujo 5 estrellas ubicado en Ubud, Bali, especializado en bienestar holístico, tratamientos médicos integrales y sanación transformadora.

INFORMACIÓN DEL HOTEL:
📍 Ubicación: Jl Raya Andong N. 18, Ubud, Bali, Indonesia
⏰ Check-in: 14:00 | Check-out: 12:00
❌ Cancelación: Gratuita hasta 24 horas antes de la llegada
🗓️ Apertura: Verano 2026 (aceptamos pre-reservas)

ALOJAMIENTOS Y TARIFAS:
- Tropical Room: $450/noche
- River Villa: $500/noche
- Nest Villa: $525/noche
- Cave Villa: $550/noche
- Sky Villa: $550/noche
- Blossom Villa: $600/noche
- 5BR Villa (ideal familias/grupos): $2,500/noche

REGLAS DE CONVERSACIÓN:

1. IDIOMA: Detecta el idioma del usuario y responde en el mismo idioma.

2. TONO: Amable, profesional y cálido.

3. HERRAMIENTAS DISPONIBLES - USA SIEMPRE QUE SEA NECESARIO:
   - Check Availability: Para consultar disponibilidad de fechas
   - Calculate Price: Para calcular el precio total de una estancia
   - Create Booking: Para crear pre-reservas cuando tengas TODOS los datos

4. PROCESO DE RESERVA:
   Cuando un usuario quiera reservar, sigue este orden:
   a) Primero pregunta: fechas de check-in/check-out, número de huéspedes y tipo de habitación preferida
   b) Después pide EN UN SOLO MENSAJE: nombre completo, email y teléfono con código de país
   c) Una vez tengas TODOS los datos, usa la herramienta Create Booking para crear la pre-reserva

5. HANDOFF A HUMANO - SOLO en estos casos:
   - El usuario pide explícitamente hablar con una persona
   - Quejas o problemas urgentes
   - Cancelación o modificación de reserva existente
   - Negociación de precios o descuentos
   - Grupos de +10 personas o eventos
   
   Respuesta de handoff: "Voy a conectarte con nuestro equipo. Te contactarán pronto (8:00-22:00 hora Bali). WhatsApp: +62 813 2576 4867 / Email: reservations@izumi-hotel.com"

6. LIMITACIONES:
   - No inventes información
   - No prometas descuentos
```

### Tools Configuration

#### Check Availability
```json
{
  "method": "POST",
  "url": "https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/check_availability",
  "body": {
    "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "p_check_in": "{{ $fromAI('check_in') }}",
    "p_check_out": "{{ $fromAI('check_out') }}"
  }
}
```

#### Calculate Price
```json
{
  "method": "POST",
  "url": "https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/calculate_booking_price",
  "body": {
    "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "p_check_in": "{{ $fromAI('check_in') }}",
    "p_check_out": "{{ $fromAI('check_out') }}",
    "p_guests": "{{ $fromAI('guests') }}"
  }
}
```

#### Create Booking
```json
{
  "method": "POST",
  "url": "https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/bookings",
  "body": {
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
}
```

---

## WORKFLOW IX: Vapi Voice Assistant (NUEVO)
**ID:** `3sU4RgV892az8nLZ`  
**Nombre:** Vapi Izumi Hotel - MYHOST Bizmate IX  
**Estado:** Activo  
**Webhook:** https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix

### Descripción
Asistente de voz en tiempo real para web/app usando Vapi.ai. Permite conversaciones de voz fluidas con el mismo motor de reservas que WhatsApp.

### Flujo
```
Webhook for vapi → Keep Session id & Query → AI Agent → Respond to Vapi
                                                ↑
                                   OpenAI Chat Model (gpt-4.1-mini)
                                   Check availability (Tool)
                                   Calculate Price (Tool)
                                   Create Booking1 (Tool)
```

### Webhook
- **Path:** `/webhook/vapi-izumi-fix`
- **Método:** POST
- **Origen:** Vapi.ai

### ⚠️ CRÍTICO: Extracción de Datos

El payload de Vapi tiene una estructura específica. La ruta correcta incluye `.function`:

```javascript
// CORRECTO
id: {{ $json.body.message.toolCallList[0].id }}
question: {{ $json.body.message.toolCallList[0].function.arguments.user_query }}

// INCORRECTO (question llega como null)
question: {{ $json.body.message.toolCallList[0].arguments.user_query }}
```

### Nodos

| Nodo | Tipo | Versión | Función |
|------|------|---------|---------|
| Webhook for vapi | webhook | 2.1 | Recibe POST de Vapi |
| Keep Session id & Query | set | 3.4 | Extrae id y question |
| AI Agent | agent | **3** | Procesa con tools (¡v3 es crítico!) |
| OpenAI Chat Model | lmChatOpenAi | 1.2 | gpt-4.1-mini |
| Check availability | httpRequestTool | 4.3 | Supabase RPC |
| Calculate Price | httpRequestTool | 4.3 | Supabase RPC |
| Create Booking1 | httpRequestTool | 4.3 | Supabase INSERT |
| Respond to Vapi | respondToWebhook | 1.4 | JSON response |

### System Prompt (Vapi AI Agent)
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

### Respond to Vapi (JSON Format)
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

### Configuración Vapi.ai

**Assistant:** Ayu - Izumi Hotel
- Model: OpenAI GPT-4o Mini
- Voice: OpenAI shimmer
- Transcriber: Deepgram English

**System Prompt Vapi:**
```
You are Ayu from Izumi Hotel in Bali. Always respond in English only. When the user asks anything, use the send_to_n8n tool to get the answer. Always use the tool for every question.
```

**Tool send_to_n8n:**
- Nombre: send_to_n8n
- Descripción: Envía la consulta del usuario al sistema de reservas
- Parámetro: user_query (string, required)
- Server URL: https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix
- Timeout: 20 segundos

---

# 4. BASE DE DATOS SUPABASE

## 4.1 Conexión

```
URL: https://jjpscimtxrudtepzwhag.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

## 4.2 Tablas Principales

### properties
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| name | text | Nombre del hotel |
| location | text | Dirección |
| owner_id | uuid | FK users |
| created_at | timestamp | |

### bookings
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| property_id | uuid | FK properties |
| guest_name | text | |
| guest_email | text | |
| guest_phone | text | |
| check_in | date | |
| check_out | date | |
| guests | integer | |
| total_price | decimal | |
| status | text | inquiry, confirmed, cancelled |
| channel | text | direct, whatsapp, vapi, booking.com |
| created_at | timestamp | |

### recommendation_logs
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | PK |
| guest_id | uuid | FK bookings |
| guest_name | text | |
| recommendations | text | |
| sent_at | timestamp | |
| status | text | generated, sent |

## 4.3 Funciones RPC

### check_availability
```sql
CREATE OR REPLACE FUNCTION check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
) RETURNS JSON AS $$
-- Retorna disponibilidad de habitaciones
$$;
```

**Endpoint:** POST `/rest/v1/rpc/check_availability`

### calculate_booking_price
```sql
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER
) RETURNS JSON AS $$
-- Retorna precio calculado
$$;
```

**Endpoint:** POST `/rest/v1/rpc/calculate_booking_price`

## 4.4 Database Webhooks

Para el workflow VII (Staff Notification), configurar en Supabase:

```
Tabla: bookings
Evento: INSERT
URL: https://n8n-production-bb2d.up.railway.app/webhook/new-booking-notification
```

---

# 5. APIs Y CREDENCIALES

## 5.1 OpenAI
- **Credential ID (n8n):** hlVVk9ThwmKbr4yS
- **Modelo principal:** gpt-4.1-mini
- **Modelo vision:** gpt-4o-mini
- **Modelo TTS:** Voz "onyx"

## 5.2 ChakraHQ (WhatsApp)
```
API Base: https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c
Phone Number ID: 944855278702577
Access Token: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

### Endpoints ChakraHQ
| Acción | Método | URL |
|--------|--------|-----|
| Enviar mensaje | POST | /api/v19.0/{phone_id}/messages |
| Descargar media | GET | /v1/whatsapp/v19.0/media/{media_id}/show |
| Subir media | POST | /upload-public-media |

## 5.3 SendGrid (Email)
- **Credential ID (n8n):** Y35BYbcV5SYfjBwc
- **From:** josecarrallodelafuente@gmail.com

## 5.4 Vapi.ai
- **Dashboard:** https://dashboard.vapi.ai
- **Assistant ID:** 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
- **Assistant Name:** Ayu - Izumi Hotel

---

# 6. TAREAS DE DESARROLLO FRONTEND

## 6.1 Widget Vapi Voice (PRIORITARIO)

### Descripción
Integrar el widget de voz de Vapi en la aplicación React para que los usuarios puedan hablar con Ayu desde el navegador.

### SDK Vapi
```bash
npm install @vapi-ai/web
```

### Implementación Básica
```jsx
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('YOUR_PUBLIC_KEY');

// Iniciar llamada
const startCall = async () => {
  await vapi.start({
    assistantId: '1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61'
  });
};

// Terminar llamada
const endCall = () => {
  vapi.stop();
};

// Eventos
vapi.on('call-start', () => console.log('Llamada iniciada'));
vapi.on('call-end', () => console.log('Llamada terminada'));
vapi.on('speech-start', () => console.log('Usuario hablando'));
vapi.on('speech-end', () => console.log('Usuario terminó de hablar'));
vapi.on('message', (message) => console.log('Mensaje:', message));
```

### Componente React Sugerido
```jsx
// components/VoiceAssistant.jsx
import { useState } from 'react';
import Vapi from '@vapi-ai/web';

const VoiceAssistant = ({ propertyId }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapi] = useState(() => new Vapi(process.env.REACT_APP_VAPI_PUBLIC_KEY));

  const handleStartCall = async () => {
    try {
      await vapi.start({
        assistantId: '1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61',
        // Pasar property_id dinámico cuando se implemente
      });
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleEndCall = () => {
    vapi.stop();
    setIsCallActive(false);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={isCallActive ? handleEndCall : handleStartCall}
        className={`rounded-full p-4 ${isCallActive ? 'bg-red-500' : 'bg-green-500'} text-white`}
      >
        {isCallActive ? '🔴 Terminar' : '🎤 Hablar con Ayu'}
      </button>
    </div>
  );
};

export default VoiceAssistant;
```

### Variables de Entorno
```env
REACT_APP_VAPI_PUBLIC_KEY=your_vapi_public_key
```

## 6.2 Dashboard de Propiedades

### Pantalla de Lista de Propiedades
- Mostrar todas las propiedades del usuario
- Estado de cada agente (WhatsApp, Vapi)
- Métricas rápidas (reservas hoy, consultas pendientes)

### Pantalla de Detalle de Propiedad
- Información general
- Configuración de agentes
- Historial de reservas
- Analytics

## 6.3 Panel de Reservas

### Lista de Reservas
- Filtros: estado, fechas, canal
- Búsqueda por nombre/email
- Acciones: confirmar, cancelar, editar

### Detalle de Reserva
- Información completa del huésped
- Historial de comunicación
- Notas internas

---

# 7. TAREAS DE DESARROLLO BACKEND

## 7.1 Property ID Dinámico

### Problema Actual
Los workflows tienen el Property ID de Izumi hardcodeado. Para escalar a múltiples propiedades, necesitamos:

### Solución Propuesta

1. **En Vapi:** Crear un asistente por propiedad, cada uno con su property_id en metadata

2. **En n8n:** Modificar el workflow IX para:
   - Extraer property_id del payload de Vapi
   - Pasarlo dinámicamente a los tools

```javascript
// Nuevo nodo "Keep Session id & Query"
{
  "id": "{{ $json.body.message.toolCallList[0].id }}",
  "question": "{{ $json.body.message.toolCallList[0].function.arguments.user_query }}",
  "property_id": "{{ $json.body.message.call.assistant.metadata.property_id }}"
}
```

3. **En Tools:** Usar expresión dinámica
```json
{
  "p_property_id": "{{ $('Keep Session id & Query').item.json.property_id }}"
}
```

## 7.2 API para Frontend

### Endpoints Necesarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/properties | Lista propiedades del usuario |
| GET | /api/properties/:id | Detalle de propiedad |
| GET | /api/properties/:id/bookings | Reservas de una propiedad |
| GET | /api/properties/:id/analytics | Métricas de una propiedad |
| POST | /api/properties/:id/assistant | Crear/actualizar asistente Vapi |

### Implementación con Supabase Edge Functions

```typescript
// supabase/functions/get-property-analytics/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { propertyId, startDate, endDate } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Obtener métricas
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
  
  return new Response(JSON.stringify({
    total_bookings: bookings.length,
    total_revenue: bookings.reduce((sum, b) => sum + b.total_price, 0),
    by_channel: groupByChannel(bookings)
  }))
})
```

---

# 8. INTEGRACIÓN VAPI VOICE WIDGET

## 8.1 Obtener Public Key

1. Ir a https://dashboard.vapi.ai
2. Settings → API Keys
3. Copiar Public Key (empieza con `pk_`)

## 8.2 Crear Asistente para Web

El asistente actual está configurado para phone calls. Para web, verificar:

1. En Vapi Dashboard → Assistants → Ayu - Izumi Hotel
2. Verificar que "Web" esté habilitado como canal
3. Copiar Assistant ID

## 8.3 Eventos del SDK

```javascript
vapi.on('call-start', () => {
  // Mostrar indicador de llamada activa
});

vapi.on('call-end', () => {
  // Ocultar indicador, mostrar resumen
});

vapi.on('speech-start', () => {
  // Indicador visual de que el usuario está hablando
});

vapi.on('speech-end', () => {
  // Indicador de que Ayu está procesando
});

vapi.on('message', (message) => {
  // Mostrar transcripción en tiempo real
  if (message.type === 'transcript') {
    console.log('Usuario:', message.transcript);
  }
  if (message.type === 'function-call') {
    console.log('Tool llamado:', message.functionCall);
  }
});

vapi.on('error', (error) => {
  // Manejar errores
  console.error('Vapi error:', error);
});
```

## 8.4 UI/UX Recomendado

```
┌─────────────────────────────────────┐
│                                     │
│     [Avatar de Ayu animado]         │
│                                     │
│     "Hola, soy Ayu. ¿En qué         │
│      puedo ayudarte?"               │
│                                     │
│     ┌─────────────────────────┐     │
│     │  🎤 Hablar con Ayu      │     │
│     └─────────────────────────┘     │
│                                     │
│     [Transcripción en vivo]         │
│                                     │
└─────────────────────────────────────┘
```

---

# 9. ANALYTICS Y DASHBOARD

## 9.1 Fuentes de Datos

### Vapi.ai (API)
```
GET https://api.vapi.ai/call
Authorization: Bearer {API_KEY}

Response:
{
  "calls": [
    {
      "id": "call_xxx",
      "assistantId": "xxx",
      "startedAt": "2024-12-15T10:00:00Z",
      "endedAt": "2024-12-15T10:05:00Z",
      "duration": 300,
      "cost": 0.15,
      "transcript": "...",
      "summary": "..."
    }
  ]
}
```

### Supabase (Bookings)
```sql
SELECT 
  channel,
  COUNT(*) as total,
  SUM(total_price) as revenue
FROM bookings
WHERE property_id = 'xxx'
  AND created_at >= '2024-12-01'
GROUP BY channel;
```

## 9.2 Métricas a Mostrar

### KPIs Principales
- Total llamadas de voz (Vapi)
- Total mensajes WhatsApp
- Reservas creadas por canal
- Tasa de conversión (consulta → reserva)
- Ingresos por canal

### Gráficos
- Llamadas/mensajes por día (línea)
- Distribución por canal (pie)
- Duración media de llamadas (bar)
- Top horas de contacto (heatmap)

## 9.3 Implementación Sugerida

```jsx
// pages/PropertyAnalytics.jsx
import { useQuery } from 'react-query';
import { LineChart, PieChart } from 'recharts';

const PropertyAnalytics = ({ propertyId }) => {
  const { data: vapiStats } = useQuery(['vapi-stats', propertyId], 
    () => fetchVapiStats(propertyId)
  );
  
  const { data: bookingStats } = useQuery(['booking-stats', propertyId],
    () => fetchBookingStats(propertyId)
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <KPICard title="Llamadas de Voz" value={vapiStats?.totalCalls} />
      <KPICard title="Mensajes WhatsApp" value={bookingStats?.whatsappMessages} />
      <KPICard title="Reservas" value={bookingStats?.totalBookings} />
      <KPICard title="Ingresos" value={`$${bookingStats?.totalRevenue}`} />
      
      <LineChart data={vapiStats?.callsByDay} />
      <PieChart data={bookingStats?.byChannel} />
    </div>
  );
};
```

---

# 10. CHECKLIST DE IMPLEMENTACIÓN

## Fase 1: Widget Vapi (1-2 días)
- [ ] Obtener Vapi Public Key
- [ ] Instalar @vapi-ai/web
- [ ] Crear componente VoiceAssistant
- [ ] Integrar en layout principal
- [ ] Probar llamada de voz
- [ ] Añadir estados visuales (llamando, hablando, procesando)

## Fase 2: Property ID Dinámico (1 día)
- [ ] Modificar workflow IX para extraer property_id
- [ ] Actualizar tools con expresión dinámica
- [ ] Crear segundo asistente de prueba en Vapi
- [ ] Probar con dos propiedades diferentes

## Fase 3: Dashboard de Propiedades (2-3 días)
- [ ] Crear página de lista de propiedades
- [ ] Crear página de detalle de propiedad
- [ ] Mostrar estado de agentes
- [ ] Integrar métricas básicas

## Fase 4: Panel de Reservas (2-3 días)
- [ ] Crear lista de reservas con filtros
- [ ] Crear vista de detalle de reserva
- [ ] Implementar acciones (confirmar, cancelar)
- [ ] Añadir historial de comunicación

## Fase 5: Analytics (2-3 días)
- [ ] Conectar API de Vapi
- [ ] Crear queries de Supabase
- [ ] Implementar componentes de gráficos
- [ ] Dashboard completo con KPIs

## Fase 6: Template Replicable (1 día)
- [ ] Documentar proceso de onboarding
- [ ] Crear script de configuración
- [ ] Checklist para nueva propiedad
- [ ] Probar con propiedad de prueba

---

# ANEXO A: ERRORES COMUNES Y SOLUCIONES

## A.1 Vapi + n8n

| Error | Causa | Solución |
|-------|-------|----------|
| question es null | Ruta incorrecta de extracción | Usar `.function.arguments` no solo `.arguments` |
| AI Agent no usa tools | Versión v2.2 del AI Agent | Actualizar a AI Agent v3 |
| Bucle infinito | Prompt demasiado complejo | Simplificar prompt, menos reglas |
| Error JSON | Caracteres especiales en respuesta | Usar JSON.stringify() en Respond to Vapi |

## A.2 WhatsApp + ChakraHQ

| Error | Causa | Solución |
|-------|-------|----------|
| Mensaje no enviado | Token expirado | Renovar access token en ChakraHQ |
| Audio no se reproduce | MIME type incorrecto | Fijar audio/mp3 → audio/mpeg |
| Imagen no analizada | URL de media expirada | Descargar inmediatamente |

## A.3 Supabase

| Error | Causa | Solución |
|-------|-------|----------|
| RPC no encontrado | Función no existe | Verificar nombre exacto de función |
| Unauthorized | API key inválida | Usar anon key para operaciones públicas |
| Constraint violation | Datos duplicados o FK inválida | Validar datos antes de INSERT |

---

# ANEXO B: CONTACTOS Y RECURSOS

## Recursos
- n8n Docs: https://docs.n8n.io
- Vapi Docs: https://docs.vapi.ai
- Supabase Docs: https://supabase.com/docs
- ChakraHQ Docs: https://docs.chakrahq.com

## Soporte
- n8n Community: https://community.n8n.io
- Vapi Discord: https://discord.gg/vapi

---

*Documento generado: 15 Diciembre 2024*
*MY HOST BizMate - Documentación Técnica V3*
*Para uso con Claude Code*
