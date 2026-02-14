# PROMPT DE CONTINUACIÓN - WhatsApp Multimodal Izumi Hotel
## Fecha: 14 Diciembre 2025 - 13:00 PM
## Versión: 6.0 - CON ANÁLISIS COMPLETO DEL TEMPLATE

---

## CONTEXTO DEL PROYECTO

**MY HOST BizMate** - SaaS WhatsApp AI para hoteles boutique en Indonesia/SE Asia
- Cliente piloto: **Izumi Hotel** (Ubud, Bali)
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`

**Infraestructura:**
- n8n: https://n8n-production-bb2d.up.railway.app
- Workflow ID: `ln2myAS3406D6F8W`
- Supabase: jjpscimtxrudtepzwhag.supabase.co

---

## PLAN DE DOS NÚMEROS

| Número | Plataforma | Uso |
|--------|------------|-----|
| +62 813 2576 4867 | ChakraHQ | Producción con handoff humano |
| +62 (nuevo) | Meta directo | Pruebas rendimiento |

---

## PREGUNTAS CRÍTICAS PENDIENTES

### PREGUNTA 1: ¿Cómo mantienen conversación con voz los chatbots profesionales?

**A INVESTIGAR en el nuevo chat:**
- wespeak.pro
- Wassenger
- WATI
- Otros chatbots con respuesta de voz en WhatsApp
- ¿Usan todos URL pública o hay otra forma?
- ¿Qué latencia tienen?
- ¿Qué servicios de storage usan?

### PREGUNTA 2: ¿Cómo lo hace el template exactamente?

**ANÁLISIS COMPLETO DEL TEMPLATE (ya realizado):**

El template usa **nodos nativos de WhatsApp de n8n** (`n8n-nodes-base.whatsApp`), NO HTTP Requests a APIs externas.

**Flujo de respuesta con audio en el template:**

```
AI Agent → From audio to audio? (IF)
    ↓ true
Generate Audio Response (OpenAI TTS, voz "onyx")
    ↓
Fix mimeType for Audio (Code: audio/mp3 → audio/mpeg)
    ↓
Send audio (nodo WhatsApp nativo)
    - type: n8n-nodes-base.whatsApp
    - operation: "send"
    - messageType: "audio"
    - mediaPath: "useMedian8n"  ← CLAVE: sube binario directo a Meta
```

**Nodo "Send audio" del template (líneas 254-272):**
```json
{
  "parameters": {
    "operation": "send",
    "phoneNumberId": "470271332838881",
    "recipientPhoneNumber": "={{ $('Input type').item.json.contacts[0].wa_id }}",
    "messageType": "audio",
    "mediaPath": "useMedian8n",  // ← ESTA ES LA CLAVE
    "additionalFields": {}
  },
  "type": "n8n-nodes-base.whatsApp",
  "typeVersion": 1
}
```

**¿Qué hace `mediaPath: "useMedian8n"`?**
- El nodo nativo de WhatsApp de n8n toma el archivo binario del paso anterior
- Lo sube directamente a los servidores de Meta
- Meta devuelve un media_id
- El nodo envía el mensaje con ese media_id
- TODO ESTO ES TRANSPARENTE - n8n lo hace automáticamente

**¿Por qué no funciona con ChakraHQ?**
- ChakraHQ no es un nodo nativo de n8n
- Estamos usando HTTP Request genérico
- HTTP Request no tiene la magia de `mediaPath: "useMedian8n"`
- Necesitamos subir manualmente a algún lado y obtener URL

---

## DIFERENCIA FUNDAMENTAL

| Aspecto | Template (Meta nativo) | Tu implementación (ChakraHQ) |
|---------|------------------------|------------------------------|
| Nodo envío | `n8n-nodes-base.whatsApp` | HTTP Request genérico |
| Subida de media | Automática (`useMedian8n`) | Manual (necesita URL) |
| Upload a Meta | Lo hace n8n internamente | No disponible |
| Configuración | Simple (un parámetro) | Compleja (endpoint externo) |

---

## OPCIONES PARA SOLUCIONAR EL ENVÍO DE AUDIO CON CHAKRAHQ

### OPCIÓN A: Usar el endpoint upload-public-media de ChakraHQ
- **Estado:** Falla con error 500
- **Acción:** Contactar soporte ChakraHQ

### OPCIÓN B: Subir a Supabase Storage
- Crear bucket público
- Subir audio ahí
- Usar URL de Supabase

### OPCIÓN C: Subir a otro storage (S3, Cloudflare R2, etc.)
- Configurar servicio externo
- Más complejo

### OPCIÓN D: Usar la API de Meta directamente para upload
- Endpoint: `POST https://graph.facebook.com/v19.0/{phone-number-id}/media`
- Requiere token de Meta
- ChakraHQ puede tener un pass-through para esto

---

## ESTADO ACTUAL DEL WORKFLOW

### FUNCIONANDO ✅
- Texto entrada → AI → Texto salida
- Audio entrada → Transcripción → AI → Texto salida  
- Imagen entrada → Análisis → AI → Texto salida
- Herramientas Supabase
- Memoria de conversación

### FALLA ❌
- Audio entrada → AI → **Audio salida** (error al subir/enviar)

### PENDIENTE ⏳
- Rama Document/PDF

---

## CREDENCIALES

**ChakraHQ Token:**
```
Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

**ChakraHQ Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`
**ChakraHQ Phone Number ID:** `944855278702577`
**OpenAI Credential ID:** `hlVVk9ThwmKbr4yS` (OpenAi account 4)

**Supabase:**
- URL: jjpscimtxrudtepzwhag.supabase.co
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0`

---

## ARCHIVOS DE REFERENCIA

- Template: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`
- Transcripts: `/mnt/transcripts/`

---

## INSTRUCCIONES PARA CLAUDE EN NUEVO CHAT

### ANTES DE HACER NADA:

1. **Investigar a fondo** cómo wespeak.pro y otros chatbots profesionales de WhatsApp manejan respuestas de voz
2. **Analizar** si hay forma de usar el nodo nativo de WhatsApp de n8n con ChakraHQ o si son incompatibles
3. **Verificar** si ChakraHQ tiene algún endpoint pass-through para subir media a Meta directamente
4. **Proponer** la solución más simple, rápida y profesional

### DESPUÉS:

5. Implementar la solución elegida para el envío de audio
6. Completar la rama Document/PDF
7. Probar todo el flujo

### REGLAS:

- NO dar instrucciones sin verificar primero el estado real del workflow via MCP
- NO hacer suposiciones - investigar y confirmar
- SI hay dudas, preguntar antes de actuar
- Explicar claramente las opciones con pros y contras
