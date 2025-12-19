# PROMPT DE CONTINUACIÓN - WhatsApp Multimodal Izumi Hotel
## Fecha: 14 Diciembre 2025 - 13:30 PM
## Versión: 7.0 - ANÁLISIS COMPLETO Y SOLUCIÓN DEFINITIVA

---

## CONTEXTO DEL PROYECTO

**MY HOST BizMate** - SaaS WhatsApp AI para hoteles boutique
- Cliente: **Izumi Hotel** (Ubud, Bali)
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- n8n: https://n8n-production-bb2d.up.railway.app
- Workflow ID: `ln2myAS3406D6F8W`

**¿Por qué ChakraHQ?**
- Coexistencia: bot + humanos en el mismo número
- Meta directamente da muchos problemas
- Handoff a agentes humanos integrado

---

## PREGUNTA 1: ¿CÓMO HACEN LOS CHATBOTS PROFESIONALES LA VOZ?

### Investigación realizada:

**Wassenger, WATI, 360dialog, y todos los demás** usan el mismo método:

```
Audio entrada → Transcribir (Whisper) → AI procesa → TTS genera audio → Suben a URL pública → Envían con link
```

**El JSON para enviar audio en WhatsApp Cloud API es:**
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE-NUMBER",
  "type": "audio",
  "audio": {
    "link": "https://URL-PUBLICA-DEL-AUDIO.mp3"
  }
}
```

**CLAVE:** Todos necesitan una **URL pública accesible desde internet**.

Wassenger, Infobip, YCloud, todos lo hacen igual - suben el audio a su propio storage y envían el link.

---

## PREGUNTA 2: ¿CÓMO LO HACE EL TEMPLATE?

### Análisis del template (líneas 254-272):

```json
{
  "parameters": {
    "operation": "send",
    "phoneNumberId": "470271332838881",
    "recipientPhoneNumber": "={{ $('Input type').item.json.contacts[0].wa_id }}",
    "messageType": "audio",
    "mediaPath": "useMedian8n",  // ← MAGIA AQUÍ
    "additionalFields": {}
  },
  "type": "n8n-nodes-base.whatsApp",
  "typeVersion": 1
}
```

**`mediaPath: "useMedian8n"`** hace que el nodo nativo de n8n:
1. Tome el binario del paso anterior
2. Lo suba a los servidores de Meta directamente
3. Obtenga el media_id
4. Envíe el mensaje

**TODO AUTOMÁTICO Y TRANSPARENTE** - Sin URLs externas.

---

## ¿POR QUÉ NO PODEMOS USAR EL NODO NATIVO?

El nodo nativo `n8n-nodes-base.whatsApp` requiere **credenciales de Meta WhatsApp Business**.

Estas credenciales son:
- Access Token de Meta
- Business Account ID
- Phone Number ID

**ChakraHQ actúa como intermediario** y no expone estas credenciales directamente.

---

## SOLUCIÓN CON CHAKRAHQ

ChakraHQ tiene endpoint **Upload Public Media** que funciona:

**Endpoint:** `POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/{pluginId}/upload-public-media`

**Request:** multipart/form-data con `file` y `filename`

**Response:**
```json
{
  "_data": {
    "publicMediaUrl": "https://chakra-public-media.chakrahq.com/xxx/audio.mp3"
  }
}
```

### Flujo correcto con ChakraHQ:

```
1. Generate Audio (OpenAI TTS) → binario MP3
2. Fix mimeType (audio/mp3 → audio/mpeg)
3. Upload to ChakraHQ → obtener URL pública
4. Send message con { "audio": { "link": "URL" } }
```

### Payload para enviar audio via ChakraHQ pass-through:

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "628123456789",
  "type": "audio",
  "audio": {
    "link": "https://chakra-public-media.chakrahq.com/xxx/audio.mp3"
  }
}
```

---

## PROBLEMA ACTUAL

El nodo "Upload Audio to ChakraHQ" falla con error 500.

**Posibles causas a investigar:**
1. Formato incorrecto del multipart/form-data
2. Tipo de archivo no soportado (¿necesita OGG en vez de MP3?)
3. Tamaño del archivo
4. Nombre del campo (`file` vs `audio`)

**Acción:** Verificar configuración exacta del nodo HTTP Request que hace el upload.

---

## CREDENCIALES

**ChakraHQ:**
- Token: `Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g`
- Plugin ID: `2e45a0bd-8600-41b4-ac92-599d59d6221c`
- Phone Number ID: `944855278702577`

**Endpoints ChakraHQ:**
- Upload: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media`
- Send: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`

**OpenAI Credential ID:** `hlVVk9ThwmKbr4yS`

---

## ESTADO DEL WORKFLOW

### Funcionando ✅
- Texto → AI → Texto
- Audio → Transcribe → AI → Texto  
- Imagen → Analyze → AI → Texto
- Herramientas Supabase
- Memoria

### Bloqueado ❌
- Audio → AI → **Audio** (falla upload a ChakraHQ)

### Pendiente ⏳
- Rama Document/PDF

---

## PRÓXIMOS PASOS PARA CLAUDE

1. **Verificar configuración del nodo "Upload Audio to ChakraHQ"** via MCP
2. **Probar el upload con curl** para confirmar que el endpoint funciona
3. **Corregir la configuración** del nodo si es necesario
4. **Probar flujo completo** audio → audio

---

## ARCHIVOS DE REFERENCIA

- Template original: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`
- Transcripts: `/mnt/transcripts/`

---

## RESUMEN EJECUTIVO

**La solución ES posible con ChakraHQ.** El endpoint de upload existe y devuelve URLs públicas. El problema está en cómo se está configurando el nodo HTTP Request en n8n para hacer el upload.

NO necesitamos:
- Segundo número
- Cambiar de proveedor
- Storage externo (Supabase, S3)

SÍ necesitamos:
- Arreglar la configuración del nodo de upload
- Usar el pass-through de ChakraHQ con el formato correcto de Meta API
