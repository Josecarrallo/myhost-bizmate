# PROMPT DE CONTINUACIÓN - WhatsApp Multimodal Izumi Hotel
## Fecha: 14 Diciembre 2025 - 12:30 PM
## Versión: 5.0 FINAL

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

## PLAN DEFINITIVO: DOS NÚMEROS

| Número | Plataforma | Uso | Workflow |
|--------|------------|-----|----------|
| +62 813 2576 4867 | **ChakraHQ** | Producción Izumi Hotel (con handoff humano) | Actual (ln2myAS3406D6F8W) |
| +62 (nuevo) | **Meta directo** | Pruebas rendimiento / otros clientes | Nuevo workflow futuro |

### ¿Por qué dos números?
- Un número WhatsApp solo puede tener UN webhook activo
- ChakraHQ ofrece Coexistence (bot + app manual) necesario para handoff humano
- Meta directo es más rápido pero sin handoff integrado
- Comparar rendimiento requiere números separados

---

## ARQUITECTURA CHAKRAHQ (Número 4867)

```
Cliente WhatsApp
       ↓
    Meta/WhatsApp
       ↓
    ChakraHQ (webhook) ←→ App WhatsApp Business (humanos)
       ↓
    Tu n8n (webhook)
       ↓
    AI Agent + Tools
       ↓
    ChakraHQ API
       ↓
    Meta/WhatsApp
       ↓
Cliente WhatsApp
```

**Ventajas:**
- Coexistence: mismo número para bot y humanos
- Handoff a humano funciona
- Inbox compartido para el equipo

**Desventaja:**
- Un salto extra de red (ligeramente más lento)
- Envío de media requiere upload previo

---

## CREDENCIALES CHAKRAHQ

**Token:**
```
Bearer qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g
```

**Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`
**Phone Number ID:** `944855278702577`
**OpenAI Credential ID:** `hlVVk9ThwmKbr4yS` (OpenAi account 4)

**Endpoints:**
```
Upload Media: https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media

Send Message: https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages

Download Media: https://api.chakrahq.com/v1/whatsapp/v19.0/media/{mediaId}/show
```

---

## ESTADO ACTUAL DEL WORKFLOW (80% completado)

### FUNCIONANDO ✅

| Funcionalidad | Estado |
|---------------|--------|
| Recibir texto → AI Agent → Responder texto | ✅ |
| Recibir audio → Transcribir → AI Agent → Responder texto | ✅ |
| Recibir imagen → Analizar → AI Agent → Responder texto | ✅ |
| Herramientas Supabase (disponibilidad, precio, reserva) | ✅ |
| Memoria de conversación | ✅ |
| Detección si mensaje era audio (From audio to audio?) | ✅ |
| Generación de audio con OpenAI TTS | ✅ |
| Fix mimeType para audio | ✅ |

### PENDIENTE ⚠️

| Funcionalidad | Problema | Solución |
|---------------|----------|----------|
| Enviar respuesta de audio | ChakraHQ necesita URL pública, no binario | Añadir nodo "Upload Audio to ChakraHQ" |
| Rama Document/PDF | No implementada | Añadir 5 nodos |

---

## PRÓXIMO PASO INMEDIATO

### Arreglar envío de audio

**Flujo actual (roto):**
```
Generate audio → Fix mimeType → Send audio ❌ (error: JSON inválido)
```

**Flujo corregido:**
```
Generate audio → Fix mimeType → Upload to ChakraHQ → Send audio ✅
```

**Nodo a añadir: "Upload Audio to ChakraHQ"**
- Tipo: HTTP Request
- Method: POST  
- URL: `https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/upload-public-media`
- Content-Type: multipart/form-data
- Body: archivo binario del audio
- Response: URL pública del archivo

**Después actualizar "Send audio" con:**
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

## CONEXIONES ACTUALES

```
Webhook → Filter → Switch
    ├─[Text]─────→ Text ────────────────────────────────→ AI Agent
    ├─[Audio]────→ Download audio → Transcribe → Audio ─→ AI Agent
    ├─[Image]────→ Download Image → Analyze → Image ────→ AI Agent
    └─[Document]─→ (pendiente)

AI Agent → From audio to audio?
    ├─[true]───→ Generate audio → Fix mimeType → ❌ → Send audio
    └─[false]──→ HTTP Request (texto) ✅
```

---

## FASES DEL PROYECTO

### FASE 1: Completar ChakraHQ (actual)
- [x] Texto entrada/salida
- [x] Audio entrada → texto salida  
- [x] Imagen entrada → texto salida
- [ ] **Audio entrada → audio salida** ← PRÓXIMO
- [ ] Document/PDF entrada → texto salida

### FASE 2: Workflow Meta directo (futuro)
- Usar número +62 nuevo
- Nodos nativos WhatsApp de n8n
- Comparar velocidad de respuesta
- Sin handoff humano integrado

### FASE 3: Decisión para otros clientes
- Evaluar resultados de rendimiento
- Decidir arquitectura por cliente según necesidades

---

## HUMAN HANDOFF (ya configurado)

El AI Agent tiene en su system prompt:

```
5. HANDOFF A HUMANO - SOLO en estos casos:
   - El usuario pide explícitamente hablar con una persona
   - Quejas o problemas urgentes
   - Cancelación o modificación de reserva existente
   - Negociación de precios o descuentos
   - Grupos de +10 personas o eventos
   
   Respuesta: "Voy a conectarte con nuestro equipo..."
```

El equipo de Izumi responde desde:
- App WhatsApp Business (Coexistence)
- Dashboard ChakraHQ

---

## ARCHIVOS RELACIONADOS

- Template referencia: `/mnt/user-data/uploads/AI-Powered_WhatsApp_Chatbot_for_Text__Voice__Images___PDFs.json`
- Transcripts: `/mnt/transcripts/`

---

## INSTRUCCIONES PARA CLAUDE

1. **Lee este documento primero**
2. Usa n8n MCP para verificar estado real del workflow
3. **Tarea inmediata:** Añadir nodo upload y arreglar envío audio
4. Después: Implementar rama Document/PDF
5. Probar todo el flujo completo
6. **Fase 2:** Crear workflow Meta directo con número nuevo
