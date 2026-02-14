# IZUMI HOTEL - AGENTES N8N
## Documento de Configuración Completo
**Fecha:** 11 Diciembre 2025 | **Versión:** 6.0

---

## ÍNDICE

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Agente 1: Booking Confirmation Flow](#2-agente-1-booking-confirmation-flow)
   - 2.1 Descripción y propósito
   - 2.2 Configuración técnica
   - 2.3 Estado actual
   - 2.4 Pendientes
3. [Agente 2: WhatsApp AI Agent (Estilo WeSpoke)](#3-agente-2-whatsapp-ai-agent-estilo-wespoke)
   - 3.1 Descripción y propósito
   - 3.2 Configuración técnica
   - 3.3 System Prompt completo
   - 3.4 Estado actual
   - 3.5 Pendientes y roadmap
4. [Estimación de Tiempos](#4-estimación-de-tiempos)
5. [Datos Técnicos Globales](#5-datos-técnicos-globales)
6. [Problemas Resueltos](#6-problemas-resueltos)
7. [Información de Contacto](#7-información-de-contacto)

---

## 1. RESUMEN EJECUTIVO

| Agente | Propósito | Estado | Pendiente principal |
|--------|-----------|--------|---------------------|
| **Booking Confirmation Flow** | Automatización backend de reservas | ⏳ 90% | WhatsApp propietario |
| **WhatsApp AI Agent** | Agente conversacional para clientes (estilo WeSpoke) | ✅ Activo 24/7 | Features avanzadas |

---

## 2. AGENTE 1: BOOKING CONFIRMATION FLOW

### 2.1 Descripción y propósito

**Automatización backend de reservas.** Este agente NO interactúa con el cliente. Se activa automáticamente cuando hay una nueva reserva en Supabase y notifica a todas las partes.

| Campo | Valor |
|-------|-------|
| Workflow ID | `OxNTDO0yitqV6MAL` |
| Tipo | Automatización backend |
| Trigger | Nueva reserva en Supabase |

### 2.2 Configuración técnica

**Estructura del flujo:**
```
Webhook (Supabase) → Get property data → Send email (SendGrid) → WhatsApp huésped → WhatsApp propietario
```

**Webhook URL:** Configurado en Supabase Database Webhooks

**Datos que obtiene de Supabase:**
- Property ID Izumi Hotel: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- Campo owner_phone: `34619794604`

### 2.3 Estado actual

| Paso | Estado |
|------|--------|
| Webhook trigger Supabase | ✅ Completado |
| Get property data | ✅ Completado |
| Send email (SendGrid) | ✅ Completado |
| WhatsApp huésped | ✅ Completado |
| WhatsApp propietario | ⏳ PENDIENTE |

### 2.4 Pendientes

| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| WhatsApp propietario | Notificar al dueño cuando hay nueva reserva | 30 min |

**Configuración pendiente:**
- To: `{{ $node['Get a row'].json['owner_phone'] }}`
- Mensaje: Notificación de nueva reserva

---

## 3. AGENTE 2: WHATSAPP AI AGENT (ESTILO WESPOKE)

### 3.1 Descripción y propósito

**Agente conversacional para clientes.** El cliente puede hacer TODO por WhatsApp: preguntar, consultar disponibilidad, cotizar, reservar y pagar. Inspirado en WeSpoke.pro (startup argentina con 500+ hoteles).

| Campo | Valor |
|-------|-------|
| Workflow ID | `ln2myAS3406D6F8W` |
| Tipo | Agente conversacional IA |
| Número WhatsApp | +62 813 2576 4867 |
| Estado | ✅ Activo 24/7 |

**Objetivo final:** Que el cliente pueda consultar, cotizar, reservar y pagar sin salir de WhatsApp.

### 3.2 Configuración técnica

**Estructura del flujo:**
```
Webhook → Filter → AI Agent (con Simple Memory) → HTTP Request (WhatsApp)
```

#### Filter Node
- **Value 1 (fx):** `{{ $json.body.entry[0].changes[0].value.messages ? 'mensaje' : 'status' }}`
- **Operation:** `is equal to`
- **Value 2:** `mensaje`
- **Función:** Descarta status updates, solo procesa mensajes reales.

#### AI Agent Node
- **User Message:** `{{ $json.body.entry[0].changes[0].value.messages[0].text.body }}`
- **Memory:** Simple Memory
- **Session Key:** `{{ $json.body.entry[0].changes[0].value.messages[0].from }}`
- **Context Window:** 10

#### HTTP Request Node
- **Method:** POST
- **URL:** `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`
- **Header Authorization:** `Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g`
- **Body JSON:**
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.body.entry[0].changes[0].value.messages[0].from }}",
  "type": "text",
  "text": { "body": "{{ $('AI Agent').item.json.output }}" }
}
```

### 3.3 System Prompt completo

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

IZUMI MEDICAL SPA & WELLNESS CENTER:

TRATAMIENTOS MÉDICOS INTEGRALES:
Ofrecemos tratamientos médicos auténticos enfocados en bienestar holístico balinés y ayurvédico, combinando sanación física y espiritual para una experiencia transformadora.

Programas Panchakarma (Desintoxicación Ayurvédica):
- Programas personalizados de 7, 14 o 21 días
- Desintoxicación profunda y reequilibrio cuerpo-mente
- Supervisión médica ayurvédica
- Masajes Abhyanga con aceites medicinales
- Tratamientos Shirodhara (aceite en frente)
- Dieta ayurvédica personalizada
- Consulta inicial con médico ayurvédico

Terapias de Equilibrio Energético:
- Equilibrio de Chakras con cristales y sonido
- Drenaje linfático con aceites infusionados con cristales
- Terapias de luz y color para sanación profunda

Sound Healing (Sanación con Sonido):
- Sesiones con cuencos tibetanos
- Terapia de gong para vibraciones sanadoras
- Baños de sonido grupales e individuales

RITUALES TRADICIONALES BALINESES Y DE JAVA:

Lulur de Java:
- Tratamiento real de belleza exótico y lujoso
- Exfoliación con harinas de arroz, cúrcuma y sándalo
- Nutrición profunda de la piel

Mepijet Balinés:
- Masaje profundo tradicional
- Aceites locales de jengibre
- Estiramientos y puntos de presión
- Calma profunda del sistema nervioso

PROGRAMAS PERSONALIZADOS:
- Retiros de bienestar de 3, 5, 7 o 14 días
- Consulta inicial detallada para crear programa a medida
- Yoga y meditación diaria incluida
- Pranayama (técnicas de respiración)
- Nutrición personalizada

EQUIPO MÉDICO Y TERAPÉUTICO:
- Médicos ayurvédicos certificados
- Terapeutas de energía especializados
- Nutricionistas holísticos
- Maestros de yoga y meditación
- Sanadores tradicionales balineses (Balian)

SERVICIOS COMPLEMENTARIOS:
- Talleres: Cocina saludable balinesa, batik, ceremonias de té
- Actividades: Caminatas por campos de arroz, visitas a templos sagrados
- Retiros de silencio
- Ceremonias de purificación balinesas (Melukat)
- Desayuno orgánico incluido
- WiFi gratuito
- Piscina infinity con vistas al valle
- Transporte al aeropuerto
- Concierge 24 horas

FILOSOFÍA IZUMI:
Izumi significa "fuente" en japonés. Somos una fuente de sanación que ofrece experiencias transformadoras arraigadas en la cultura milenaria de Ubud. No solo relajación, sino programas holísticos que integran bienestar físico, mental y espiritual. Utilizamos ingredientes y técnicas ancestrales auténticas de Bali, Java e India, con programas 100% personalizados.

INSTRUCCIONES:
1. Responde siempre de forma amable, profesional y cálida, reflejando la esencia zen del hotel
2. Detecta el idioma del cliente y responde en el mismo idioma (español, inglés o indonesio)
3. Si preguntan por disponibilidad, solicita fechas y número de huéspedes
4. Destaca la experiencia transformadora y los tratamientos médicos cuando sea relevante
5. Para programas médicos extensos (Panchakarma), recomienda consulta previa
6. Si no puedes resolver algo o el cliente pide hablar con un humano, di: "Te conecto con nuestro equipo. Por favor escribe a josecarrallodelafuente@gmail.com o espera que un agente te contacte pronto."
7. Nunca inventes información que no tengas
8. Sé conciso pero completo en tus respuestas
9. Usa emojis con moderación para dar calidez (🙏 🌿 ✨ 🧘)
```

### 3.4 Estado actual

| Feature | Estado |
|---------|--------|
| Respuestas 24/7 | ✅ Completado |
| System Prompt personalizado | ✅ Completado |
| Memoria conversacional | ✅ Completado |
| Filter status updates | ✅ Completado |
| Multiidioma (ES/EN/ID) | ✅ Completado |

### 3.5 Pendientes y roadmap

#### 🟡 SIGUIENTE (45 min)
| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Handoff humano mejorado | Detectar frustración, escalación clara | 30 min |

#### 🟢 FASE 2 - MVP (5-6 hrs)
| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Consultar disponibilidad | IA consulta tabla bookings en Supabase | 1-2 hrs |
| Cotización automática | Calcula precio según villa, fechas, huéspedes | 1 hr |
| Crear reserva desde chat | Cliente dice "quiero reservar" → booking en Supabase | 2 hrs |
| Transcripción de audio | Entiende notas de voz (OpenAI Whisper) | 1 hr |

**Implementación técnica Fase 2:**
- Añadir tools al AI Agent para consultar Supabase
- HTTP Request a Supabase API para queries
- Tool "check_availability" con parámetros: villa_type, check_in, check_out
- Tool "create_booking" con datos del cliente

#### 🔵 FASE 3 - PREMIUM (8-10 hrs)
| Tarea | Descripción | Tiempo |
|-------|-------------|--------|
| Análisis de imágenes | Cliente envía foto, IA la interpreta (GPT-4 Vision) | 1 hr |
| Integración Instagram/Facebook | Misma IA en otros canales Meta | 2-3 hrs |
| Pagos por chat | Enviar link de pago Stripe/QRIS | 2 hrs |
| Reviews automáticas | Mensaje pidiendo valoración post-checkout | 1 hr |
| Upselling inteligente | Ofrecer extras según perfil (tours, spa) | 1 hr |

#### Comparativa vs WeSpoke.pro

| WeSpoke | Nuestro sistema |
|---------|-----------------|
| $TBD/mes por hotel | DIY - Solo costos API |
| SaaS externo | Control total en n8n propio |
| Genérico hoteles | Especializado wellness/medical spa |
| Depende de terceros | Infraestructura propia (Railway) |

---

## 4. ESTIMACIÓN DE TIEMPOS

### Resumen por agente

| Agente | Pendiente | Tiempo |
|--------|-----------|--------|
| Booking Confirmation Flow | WhatsApp propietario | 30 min |
| WhatsApp AI Agent | Handoff mejorado | 30 min |
| WhatsApp AI Agent | MVP (disponibilidad, cotización, reserva, audio) | 5-6 hrs |
| WhatsApp AI Agent | Premium (imágenes, redes, pagos, reviews) | 8-10 hrs |

### Cronograma sugerido

| Nivel | Tiempo | Resultado |
|-------|--------|-----------|
| 🔴 Hoy | 1 hora | Ambos agentes básicos completos |
| 🟢 MVP WeSpoke | +6 horas | Cliente reserva por WhatsApp |
| 🔵 Premium | +8 horas | Igual que WeSpoke.pro |

**Tiempo total estimado:**
- MVP funcional: 2-3 sesiones (7 hrs)
- Todo completo: 4-5 sesiones (15 hrs)

---

## 5. DATOS TÉCNICOS GLOBALES

### ChakraHQ (WhatsApp Business API)

| Campo | Valor |
|-------|-------|
| Plugin ID | `2e45a0bd-8600-41b4-ac92-599d59d6221c` |
| Phone Number ID | `944855278702577` |
| API Key | `qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g` |
| Número WhatsApp | +62 813 2576 4867 |
| Estado | CONNECTED (Coexistence) |

### Supabase

| Campo | Valor |
|-------|-------|
| Property ID Izumi | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| owner_phone | `34619794604` |

### n8n (Railway)

| Campo | Valor |
|-------|-------|
| Workflow AI Agent | `ln2myAS3406D6F8W` |
| Workflow Booking | `OxNTDO0yitqV6MAL` |

---

## 6. PROBLEMAS RESUELTOS

### Error "No prompt specified"

**Síntoma:** Error en logs aunque el bot funcionaba.

**Causa:** WhatsApp API envía dos tipos de eventos:
1. Mensajes reales → contienen `messages`
2. Status updates (delivered, read) → contienen `statuses`, NO tienen `messages`

**Solución:** Añadir nodo Filter con expresión ternaria:
```
{{ $json.body.entry[0].changes[0].value.messages ? 'mensaje' : 'status' }}
```

---

## 7. INFORMACIÓN DE CONTACTO

| Campo | Valor |
|-------|-------|
| Proyecto | MY HOST BizMate |
| Propiedad | Izumi Hotel, Ubud, Bali |
| Empresa | PT. ZEN TARA LIVING |
| Email escalación | josecarrallodelafuente@gmail.com |
| Teléfono propietario | +34 619 794 604 |

---

**Última actualización:** 11 Diciembre 2025 - Versión 6.0
