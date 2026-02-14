## CONTEXTO - CONTINUAR CONFIGURACIÓN N8N WHATSAPP

### ESTADO ACTUAL

**1. WhatsApp AI Agent - Izumi Hotel (ChakraHQ) ✅ COMPLETADO**
- Workflow ID: ln2myAS3406D6F8W
- Estado: Activo y funcionando
- Número WhatsApp: +62 813 2576 4867

**Estructura del flujo:**
```
Webhook → Filter → AI Agent (con Simple Memory) → HTTP Request (WhatsApp)
```

**Configuración Filter:**
- Value 1 (fx): `{{ $json.body.entry[0].changes[0].value.messages ? 'mensaje' : 'status' }}`
- Operation: `is equal to`
- Value 2: `mensaje`

**Configuración AI Agent:**
- Prompt (User Message): `{{ $json.body.entry[0].changes[0].value.messages[0].text.body }}`
- Memory: Simple Memory con Session Key `{{ $json.body.entry[0].changes[0].value.messages[0].from }}`
- Context Window Length: 10

**System Message (AI Agent):**
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

**Configuración HTTP Request (respuesta WhatsApp):**
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`
- Header Authorization: `Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g`
- Body JSON:
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $json.body.entry[0].changes[0].value.messages[0].from }}",
  "type": "text",
  "text": { "body": "{{ $('AI Agent').item.json.output }}" }
}
```

---

**2. Booking Confirmation Flow ⏳ 90% COMPLETADO**
- Workflow ID: OxNTDO0yitqV6MAL
- Estado: Activo

**Estructura actual:**
```
Webhook (trigger Supabase) → Get property data → Send email (SendGrid) ✅ → WhatsApp huésped ✅ → WhatsApp propietario ⏳ PENDIENTE
```

**Lo que falta:**
- Añadir segundo HTTP Request para WhatsApp al propietario
- El owner_phone está en la tabla properties (ya se obtiene con "Get a row")

**Datos Supabase:**
- Property ID Izumi Hotel: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Campo owner_phone en properties: 34619794604

---

### PENDIENTES

---

## ⏳ PENDIENTE INMEDIATO: Booking Confirmation Flow (90%)

**Tarea:** Añadir HTTP Request - WhatsApp Propietario
- Mismo formato que WhatsApp huésped
- To: `{{ $node['Get a row'].json['owner_phone'] }}`
- owner_phone en Supabase: 34619794604
- Mensaje: Notificación de nueva reserva al propietario

---

## 📋 MEJORAS AI AGENT ESTILO WESPOKE (Roadmap)

Basado en funcionalidades de WeSpoke.pro (startup argentina con 500+ hoteles en 20 países, respuestas en 7 segundos, reservas directas 24/7).

### NIVEL 1 - BÁSICO (Mejoras rápidas - 1-2 horas)

| Feature | Estado | Descripción | Tiempo |
|---------|--------|-------------|--------|
| Respuestas 24/7 | ✅ COMPLETADO | Bot activo siempre | - |
| System Prompt personalizado | ✅ COMPLETADO | Info completa Izumi Hotel | - |
| Memoria conversacional | ✅ COMPLETADO | Simple Memory activo | - |
| Filter status updates | ✅ COMPLETADO | Solo procesa mensajes reales | - |
| **Multiidioma automático** | ⏳ PENDIENTE | Detectar ES/EN/ID y responder igual | 15 min |
| **Handoff a humano mejorado** | ⏳ PENDIENTE | Detectar frustración, escalación clara | 30 min |

---

### NIVEL 2 - INTERMEDIO (Diferenciador - 5-6 horas)

| Feature | Descripción | Tiempo |
|---------|-------------|--------|
| **Consulta disponibilidad real** | IA consulta tabla bookings en Supabase, responde si hay fechas libres | 1-2 hrs |
| **Cotización automática** | Calcula precio según villa, fechas y número de huéspedes | 1 hr |
| **Crear reserva desde chat** | Cliente dice "Quiero reservar" → IA crea booking en Supabase | 2 hrs |
| **Transcripción de audio** | Entiende notas de voz del cliente (OpenAI Whisper) | 1 hr |

**Implementación técnica:**
- Añadir tools al AI Agent para consultar Supabase
- HTTP Request a Supabase API para queries
- Tool "check_availability" con parámetros: villa_type, check_in, check_out
- Tool "create_booking" con datos del cliente

---

### NIVEL 3 - AVANZADO/PREMIUM (8-10 horas)

| Feature | Descripción | Tiempo |
|---------|-------------|--------|
| **Análisis de imágenes** | Cliente envía foto, IA la interpreta (GPT-4 Vision) | 1 hr |
| **Integración Instagram/Facebook** | Misma IA responde en otros canales Meta | 2-3 hrs |
| **Pagos por chat** | Enviar link de pago Stripe/QRIS por WhatsApp | 2 hrs |
| **Reviews automáticas post-estancia** | Mensaje automático pidiendo valoración después del checkout | 1 hr |
| **Upselling inteligente** | IA ofrece extras relevantes (tours, spa, transporte) según perfil | 1 hr |
| **Dashboard de métricas** | Conversaciones, tasa conversión, tiempo respuesta | 2 hrs |

---

### VALOR AGREGADO VS WESPOKE

| WeSpoke | Nuestro sistema |
|---------|-----------------|
| $TBD/mes por hotel | DIY - Solo costos API |
| SaaS externo | Control total en n8n propio |
| Genérico hoteles | Especializado wellness/medical spa |
| Depende de terceros | Infraestructura propia (Railway) |

---

## 🎯 ORDEN RECOMENDADO DE IMPLEMENTACIÓN

1. ✅ ~~WhatsApp AI Agent básico~~ COMPLETADO
2. ✅ ~~Booking Confirmation email~~ COMPLETADO
3. ✅ ~~Booking Confirmation WhatsApp huésped~~ COMPLETADO
4. ⏳ **HOY:** WhatsApp propietario (30 min)
5. ⏳ **SIGUIENTE:** Multiidioma + Handoff mejorado (45 min)
6. ⏳ **FASE 2:** Consulta disponibilidad + Cotización (3 hrs)
7. ⏳ **FASE 3:** Reserva desde chat (2 hrs)
8. ⏳ **FASE 4:** Audio transcription (1 hr)
9. ⏳ **FUTURO:** Nivel 3 features

---

### DATOS TÉCNICOS CHAKRAHQ

- Plugin ID: 2e45a0bd-8600-41b4-ac92-599d59d6221c
- Phone Number ID: 944855278702577
- API Key: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

---

### PROBLEMA RESUELTO EN ESTA SESIÓN

**Síntoma:** Error "No prompt specified" en logs aunque el bot funcionaba.

**Causa:** WhatsApp API envía dos tipos de eventos:
1. Mensajes reales → contienen `messages`
2. Status updates (delivered, read) → contienen `statuses`, NO tienen `messages`

**Solución:** Añadir nodo Filter con expresión ternaria:
```
{{ $json.body.entry[0].changes[0].value.messages ? 'mensaje' : 'status' }}
```
- Si existe `messages` → devuelve "mensaje" → pasa al AI Agent
- Si no existe → devuelve "status" → Filter lo descarta

---

## 📁 DOCUMENTOS DE REFERENCIA

### Documentos creados:

1. **prompt-nuevo-chat-completo.md** (ESTE DOCUMENTO)
   - Ubicación: `/mnt/user-data/outputs/prompt-nuevo-chat-completo.md`
   - Contenido: Configuración completa, System Prompt, pendientes, roadmap WeSpoke

2. **WhatsApp-AI-Agent-Izumi-Hotel-Config.docx**
   - Ubicación: `/mnt/user-data/outputs/WhatsApp-AI-Agent-Izumi-Hotel-Config.docx`
   - Contenido: Documento Word con configuración técnica del AI Agent

### Transcripts con historial completo:

3. **2025-12-11-07-31-02-whatsapp-ai-booking-agents-izumi-hotel.txt**
   - Ubicación: `/mnt/transcripts/`
   - Contenido: Sesión completa configuración WhatsApp + análisis WeSpoke

4. **2025-12-11-08-51-56-whatsapp-ai-agent-prompt-document-creation.txt**
   - Ubicación: `/mnt/transcripts/`
   - Contenido: Sesión creación de documentos de prompt

### Información clave por documento:

| Información | Documento |
|-------------|-----------|
| System Prompt completo (tratamientos médicos) | Este documento (md) |
| Configuración técnica ChakraHQ | Este documento + docx |
| Fases mejoras estilo WeSpoke | Este documento (md) |
| Configuración Filter node | Este documento (md) |
| Historial troubleshooting | Transcripts |
| Análisis WeSpoke original | Transcript 07-31-02 |

---

**Fecha última actualización:** 11 Diciembre 2025
