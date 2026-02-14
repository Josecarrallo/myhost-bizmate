# PROMPT DE CONTINUACIÓN - WhatsApp Multimodal Izumi Hotel
## Fecha: 14 Diciembre 2025 - 11:45 AM

---

## CONTEXTO DEL PROYECTO

**MY HOST BizMate** - SaaS WhatsApp AI para hoteles boutique en Indonesia/SE Asia
- Cliente piloto: **Izumi Hotel** (Ubud, Bali)
- WhatsApp: +62 813 2576 4867
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`

**Infraestructura:**
- n8n: https://n8n-production-bb2d.up.railway.app
- Workflow ID: `ln2myAS3406D6F8W`
- ChakraHQ Plugin ID: `2e45a0bd-8600-41b4-ac92-599d59d6221c`
- OpenAI Credential ID: `hlVVk9ThwmKbr4yS` (OpenAi account 4)

---

## DIFERENCIA CRÍTICA: TEMPLATE vs TU IMPLEMENTACIÓN

### TEMPLATE ORIGINAL (usa WhatsApp API nativo de Meta)
El template usa el nodo nativo `n8n-nodes-base.whatsApp` que:
- Tiene acceso directo a la API de Meta/WhatsApp
- Puede subir archivos binarios directamente con `mediaPath: "useMedian8n"`
- Meta almacena el archivo y genera un media_id automáticamente
- El envío de audio es "transparente" - n8n maneja todo internamente

```
Generate Audio → Fix mimeType → Send audio (nodo WhatsApp nativo)
                                    ↓
                              mediaPath: "useMedian8n" 
                              (sube binario directo a Meta)
```

### TU IMPLEMENTACIÓN (usa ChakraHQ como intermediario)
ChakraHQ es un **wrapper/proxy** sobre la API de WhatsApp:
- NO puedes enviar binarios directamente en el JSON
- Necesitas primero SUBIR el archivo a ChakraHQ
- ChakraHQ te devuelve una URL pública
- Luego envías el mensaje con esa URL

```
Generate Audio → Fix mimeType → Upload to ChakraHQ → Send audio
                                      ↓                   ↓
                              Obtener URL pública    Usar URL en mensaje
```

### ENDPOINTS CHAKRAHQ RELEVANTES

1. **Subir media público:**
```
POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/{pluginId}/upload-public-media
Header: Authorization: Bearer {token}
Body: multipart/form-data con file y filename
Response: URL pública del archivo
```

2. **Enviar mensaje:**
```
POST https://api.chakrahq.com/v1/ext/plugin/whatsapp/{pluginId}/api/v19.0/{phoneNumberId}/messages
Header: Authorization: Bearer {token}
Body: JSON con type: "audio" y audio.link: {URL}
```

---

## CREDENCIALES

**ChakraHQ Token:**
```
Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

**ChakraHQ Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`

**ChakraHQ Phone Number ID:** `944855278702577`

**ChakraHQ Upload Media Endpoint:**
```
https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media
```

**ChakraHQ Send Message Endpoint:**
```
https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages
```

---

## ESTADO ACTUAL DEL WORKFLOW

### COMPLETADO ✅

| Rama | Nodos | Estado |
|------|-------|--------|
| **Text** | Switch → Text → AI Agent | ✅ Funcionando |
| **Audio (entrada)** | Switch → Download audio → Transcribe → Audio → AI Agent | ✅ Funcionando |
| **Image** | Switch → Download Image → Analyze image → Image → AI Agent | ✅ Funcionando |

### RESPUESTA CON VOZ - PARCIALMENTE IMPLEMENTADO ⚠️

**Nodos creados:**
- ✅ From audio to audio? (IF) - detecta si mensaje era audio
- ✅ Generate audio (OpenAI TTS, voz "onyx")
- ✅ Fix mimeType for Audio (Code)
- ⚠️ Send audio (HTTP Request) - **FALLA: necesita URL pública**

**Error actual:**
```
"JSON parameter needs to be valid JSON"
```
El audio generado es binario local sin URL. ChakraHQ necesita una URL pública.

### CONEXIONES ACTUALES

```
AI Agent → From audio to audio?
              ├─[true]──→ Generate audio → Fix mimeType → Send audio ❌ (falla)
              └─[false]─→ HTTP Request (texto) ✅
```

---

## SOLUCIÓN PENDIENTE

Agregar nodo **"Upload Audio to ChakraHQ"** entre Fix mimeType y Send audio:

```
Fix mimeType → Upload Audio to ChakraHQ → Send audio
                      ↓                        ↓
                Obtener URL              Usar URL en JSON
```

**Configuración del nodo "Upload Audio to ChakraHQ":**
- Method: POST
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media`
- Content-Type: multipart/form-data
- Body: archivo binario del audio

**Después actualizar "Send audio":**
```json
{
  "messaging_product": "whatsapp",
  "to": "{{numero_destino}}",
  "type": "audio",
  "audio": {
    "link": "{{URL_devuelta_por_upload}}"
  }
}
```

---

## PENDIENTE DESPUÉS DE AUDIO

**Rama Document/PDF (5 nodos):**
- Only PDF File (IF)
- Download Document (HTTP Request)
- Extract from File (extractFromFile)
- File (Set/Edit Fields)
- Incorrect format (mensaje error)

---

## ARCHIVOS RELACIONADOS

- Template original: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`
- Transcripts anteriores en `/mnt/transcripts/`

---

## INSTRUCCIONES PARA CLAUDE

1. Tienes acceso al workflow via n8n MCP - ÚSALO para verificar estado real
2. El problema actual es que ChakraHQ necesita URL pública para enviar audio
3. Necesitas implementar el paso de upload antes del envío
4. Verifica la documentación de ChakraHQ para el endpoint upload-public-media
5. El template usa nodo WhatsApp nativo que no aplica aquí
