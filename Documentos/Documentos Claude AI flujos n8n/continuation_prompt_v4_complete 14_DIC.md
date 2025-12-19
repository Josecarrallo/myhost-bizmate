# PROMPT DE CONTINUACIÓN - WhatsApp Multimodal Izumi Hotel
## Fecha: 14 Diciembre 2025 - 12:15 PM
## Versión: 4.0 (Con contexto completo ChakraHQ vs Meta)

---

## CONTEXTO DEL PROYECTO

**MY HOST BizMate** - SaaS WhatsApp AI para hoteles boutique en Indonesia/SE Asia
- Cliente piloto: **Izumi Hotel** (Ubud, Bali)
- WhatsApp: +62 813 2576 4867
- Property ID: `18711359-1378-4d12-9ea6-fb31c0b1bac2`

**Infraestructura:**
- n8n: https://n8n-production-bb2d.up.railway.app
- Workflow ID: `ln2myAS3406D6F8W`
- Supabase: jjpscimtxrudtepzwhag.supabase.co

---

## DECISIÓN ARQUITECTÓNICA: ¿POR QUÉ CHAKRAHQ?

### El problema del Human Handoff

Los hoteles necesitan:
1. Bot automático 24/7 para responder consultas
2. Opción de escalar a humano cuando el cliente lo pide
3. Humanos puedan ver el historial y responder desde una interfaz

### Los nodos nativos de n8n WhatsApp/Meta NO ofrecen:
- Inbox compartido
- Dashboard para agentes humanos
- Asignación de conversaciones
- Pausa del bot cuando entra humano

### ChakraHQ SÍ ofrece:
- **Coexistence**: Mismo número para bot (API) + app manual (humanos)
- Inbox compartido para el equipo
- Dashboard para ver conversaciones
- El humano puede entrar y tomar el control

### Conclusión
**ChakraHQ es la decisión correcta** para el caso de uso de hoteles con handoff a humano.

---

## PLAN DE TRABAJO

### FASE 1: Completar ChakraHQ (actual) - 80% completado
1. ✅ Texto → AI Agent → Respuesta texto
2. ✅ Audio entrada → Transcripción → AI Agent → Respuesta texto
3. ✅ Imagen → Análisis → AI Agent → Respuesta texto
4. ⚠️ Audio entrada → AI Agent → **Respuesta audio** (falta upload)
5. ⏳ Documento/PDF → Extracción → AI Agent → Respuesta texto

### FASE 2: Crear versión Meta nativa (futuro)
- Duplicar workflow
- Adaptar a nodos nativos WhatsApp de n8n
- Comparar rendimiento (velocidad de respuesta)
- Decidir cuál usar en producción

### FASE 3: Decisión final
- Si Meta es significativamente más rápido → usar Meta + plataforma externa para handoff
- Si la diferencia es mínima → quedarse con ChakraHQ (más simple)

---

## CREDENCIALES CHAKRAHQ

**Token:**
```
Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

**Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`

**Phone Number ID:** `944855278702577`

**Endpoints:**
- Upload Media: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media`
- Send Message: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages`
- Download Media: `https://api.chakrahq.com/v1/whatsapp/v19.0/media/{mediaId}/show`

**OpenAI Credential ID:** `hlVVk9ThwmKbr4yS` (OpenAi account 4)

---

## ESTADO ACTUAL DEL WORKFLOW (80% completado)

### FUNCIONANDO ✅

| Funcionalidad | Nodos | Estado |
|---------------|-------|--------|
| Recibir texto | Webhook → Filter → Switch → Text | ✅ |
| Recibir audio | Switch → Download audio → Transcribe → Audio | ✅ |
| Recibir imagen | Switch → Download Image → Analyze → Image | ✅ |
| Procesar con AI | AI Agent + Memory + Tools | ✅ |
| Responder texto | HTTP Request (Send message) | ✅ |
| Herramientas Supabase | Check Availability, Calculate Price, Create Booking | ✅ |

### PARCIALMENTE IMPLEMENTADO ⚠️

| Funcionalidad | Nodos | Estado | Problema |
|---------------|-------|--------|----------|
| Responder con audio | From audio to audio? → Generate audio → Fix mimeType → Send audio | ⚠️ | Falta upload a ChakraHQ |

**Error actual en "Send audio":**
```
"JSON parameter needs to be valid JSON"
```

**Causa:** El audio generado por OpenAI TTS es binario local. ChakraHQ necesita una URL pública.

**Solución:** Añadir nodo "Upload Audio to ChakraHQ" entre Fix mimeType y Send audio.

### PENDIENTE ⏳

| Funcionalidad | Nodos necesarios |
|---------------|------------------|
| Rama Document/PDF | Only PDF? (IF) → Download Doc → Extract → File → AI Agent |
| Mensaje "Not supported" | Para tipos de archivo no soportados |

---

## PRÓXIMO PASO INMEDIATO

### Arreglar respuesta con audio

**Flujo actual (roto):**
```
Generate audio → Fix mimeType → Send audio ❌
```

**Flujo corregido:**
```
Generate audio → Fix mimeType → Upload to ChakraHQ → Send audio ✅
```

**Nodo a añadir: "Upload Audio to ChakraHQ"**

Tipo: HTTP Request
- Method: POST
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media`
- Content-Type: multipart/form-data
- Body: archivo binario del audio
- Response: URL pública del archivo

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

## CONEXIONES ACTUALES DEL WORKFLOW

```
Webhook → Filter → Switch
    ├─[Text]─────→ Text ────────────────────────────────→ AI Agent
    ├─[Audio]────→ Download audio → Transcribe → Audio ─→ AI Agent
    ├─[Image]────→ Download Image → Analyze → Image ────→ AI Agent
    └─[Document]─→ (pendiente)

AI Agent → From audio to audio?
    ├─[true]───→ Generate audio → Fix mimeType → (FALTA: Upload) → Send audio
    └─[false]──→ HTTP Request (texto)
```

---

## TEMPLATE DE REFERENCIA

Archivo: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`

**Nota importante:** Este template usa nodos nativos de WhatsApp/Meta, no ChakraHQ. Por eso requiere adaptaciones en:
- Estructura JSON del webhook (diferente entre Meta y ChakraHQ)
- Endpoints de descarga de media
- Endpoints de envío de mensajes
- Envío de audio (Meta acepta binario directo, ChakraHQ necesita URL)

---

## HUMAN HANDOFF - YA CONFIGURADO

El AI Agent ya tiene en su system prompt:

```
5. HANDOFF A HUMANO - SOLO en estos casos:
   - El usuario pide explícitamente hablar con una persona
   - Quejas o problemas urgentes
   - Cancelación o modificación de reserva existente
   - Negociación de precios o descuentos
   - Grupos de +10 personas o eventos
   
   Respuesta de handoff: "Voy a conectarte con nuestro equipo. 
   Te contactarán pronto (8:00-22:00 hora Bali). 
   WhatsApp: +62 813 2576 4867 / Email: reservations@izumi-hotel.com"
```

Cuando el bot escala, el equipo de Izumi puede responder desde:
- App WhatsApp Business (Coexistence)
- Dashboard de ChakraHQ

---

## ARCHIVOS RELACIONADOS

- Template: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`
- Transcripts: `/mnt/transcripts/`

---

## INSTRUCCIONES PARA CLAUDE EN NUEVO CHAT

1. **Lee este documento completo primero**
2. Tienes acceso al workflow via n8n MCP - úsalo para verificar estado real
3. **Tarea inmediata:** Añadir nodo "Upload Audio to ChakraHQ" y arreglar "Send audio"
4. Después: Implementar rama Document/PDF
5. Después: Probar todo el flujo completo
6. **Fase 2:** Crear versión con nodos nativos Meta para comparar rendimiento

---

## LECCIONES APRENDIDAS (para no repetir errores)

1. **Antes de implementar:** Analizar arquitectura completa y preguntar al usuario sobre su infraestructura
2. **ChakraHQ vs Meta:** No son alternativas excluyentes. ChakraHQ usa Meta por debajo pero añade funcionalidades (Coexistence, inbox compartido)
3. **Human handoff:** Requiere plataforma externa (ChakraHQ, Trengo, etc.). Los nodos nativos de n8n no lo soportan solos.
4. **Envío de media con ChakraHQ:** Requiere subir primero y obtener URL pública (a diferencia de Meta nativo que acepta binario directo)
