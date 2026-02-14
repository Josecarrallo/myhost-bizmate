# PROMPT CONTINUACIÓN - MULTIMODAL WHATSAPP IZUMI HOTEL

## FECHA: 13 Diciembre 2025

## CONTEXTO
Soy José, fundador de MY HOST BizMate (SaaS gestión villas/hoteles boutique en Indonesia/SE Asia). Estoy implementando capacidades multimodal (audio, imágenes, PDFs) en el WhatsApp AI Agent de Izumi Hotel.

## INFRAESTRUCTURA ACTUAL

### n8n
- **URL**: https://n8n-production-bb2d.up.railway.app
- **Workflow principal**: WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate V copia
- **Workflow ID**: ln2myAS3406D6F8W

### ChakraHQ
- **Plugin ID**: 2e45a0bd-8600-41b4-ac92-599d59d6221c
- **Phone Number ID**: 944855278702577
- **Número WhatsApp**: +62 813 2576 4867 (Izumi Hotel)
- **Token ChakraHQ**: qiu1Z9eA3i2hhNjVM3Dm7QEK1Ey6iKQUE5IDWJlsFSAqXk5OlmQoD6DhqEwv9TOdgOVRWSYLWGxm6HfCs2LeCuwiU8Poqrw2Rgmvih0iEawZhoL6TTmMjVjvDUw2WuygAQgQ1vIeLCreDAKOGymGQCuR5bUYDHrRQQrvoMZLYwHw0LaGhFUuf4GxLpQbV3AQj8JDjhP2MzsCUYT4EVCARX6cODl1d1udr4pITGOmHQ793MUBtptq4XCvC8OGD3g

### Meta/Facebook
- **Access Token Meta** (para descargar media): EAALqkl6mgkkBQIugQpf6iOA8oTfKkc7lov49VJDLcoZANLxhouTsKjaDJHlDvv0P3LTVkAVV5shicezRXok70isCDOyhoTsLCOmE34lTFia0h10xpxvdUi0CA9iF8oJn0CVYG1TQSyZBK3ZCeu2QLJaAoxYlVZCZCsfIda4D7JSPN4xSlmCA7XdmdFjeev0oCvjxKQUWisDJKaRorn6CcgXmh6S0evwZAaprv7mXEdZACsRcCxZBkj0ZCsZABbi95w6sJw0ROZCG5oP9D9T7yp1F9iAmzCc

### Supabase
- **URL**: https://jjpscimtxrudtepzwhag.supabase.co
- **Property ID Izumi**: 18711359-1378-4d12-9ea6-fb31c0b1bac2

### OpenAI
- **Credencial en n8n**: OpenAi account 4 (ID: hlVVk9ThwmKbr4yS)
- **Modelo actual**: gpt-4.1-mini

## ESTADO ACTUAL DEL WORKFLOW

### Flujo implementado:
```
Webhook → Filter → Switch → AI Agent → HTTP Request (respuesta)
                      │
                      ├─ Text ────→ AI Agent ✅ FUNCIONA
                      ├─ Audio ───→ (pendiente)
                      ├─ Image ───→ Download Image (EN PROGRESO)
                      ├─ Document → (pendiente)
                      └─ Extra ───→ (no soportado)
```

### Switch Node configurado con 4 reglas:
1. Text: `{{ $json.body.entry[0].changes[0].value.messages[0].text }}` exists
2. Audio: `{{ $json.body.entry[0].changes[0].value.messages[0].audio }}` exists
3. Image: `{{ $json.body.entry[0].changes[0].value.messages[0].image }}` exists
4. Document: `{{ $json.body.entry[0].changes[0].value.messages[0].document }}` exists
- Fallback Output: Extra Output

### Conexiones actuales:
- Filter → Switch ✅
- Switch (Text) → AI Agent ✅
- Switch (Image) → Download Image (EN PROGRESO)

## ESTRUCTURA JSON DE IMAGEN (webhook ChakraHQ)

Cuando llega una imagen, el webhook recibe:
```json
{
  "body": {
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "type": "image",
            "image": {
              "mime_type": "image/jpeg",
              "sha256": "...",
              "id": "1887006965253434",
              "url": "https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=..."
            }
          }]
        }
      }]
    }]
  }
}
```

## PRÓXIMO PASO INMEDIATO

Configurar el nodo **"Download Image"** que ya está creado:

- **Method:** GET
- **URL:** `={{ $json.body.entry[0].changes[0].value.messages[0].image.url }}`
- **Authentication:** None
- **Send Headers:** ON
- **Header:**
  - Name: `Authorization`
  - Value: `Bearer EAALqkl6mgkkBQIugQpf6iOA8oTfKkc7lov49VJDLcoZANLxhouTsKjaDJHlDvv0P3LTVkAVV5shicezRXok70isCDOyhoTsLCOmE34lTFia0h10xpxvdUi0CA9iF8oJn0CVYG1TQSyZBK3ZCeu2QLJaAoxYlVZCZCsfIda4D7JSPN4xSlmCA7XdmdFjeev0oCvjxKQUWisDJKaRorn6CcgXmh6S0evwZAaprv7mXEdZACsRcCxZBkj0ZCsZABbi95w6sJw0ROZCG5oP9D9T7yp1F9iAmzCc`

## PASOS SIGUIENTES DESPUÉS DE DOWNLOAD IMAGE

1. Añadir nodo OpenAI para analizar imagen con GPT-4 Vision
2. Conectar salida de análisis al AI Agent
3. Conectar AI Agent → HTTP Request (respuesta)
4. Probar enviando una imagen al WhatsApp

## PREFERENCIAS DE JOSÉ

- Paso a paso, sin prisas
- Probar cada cambio antes de continuar
- No inventar soluciones - analizar fallos
- Español
- JSON directo en n8n, NUNCA JSON.stringify en expresiones

## DOCUMENTACIÓN RELEVANTE

- n8n Switch node: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/
- Template multimodal WhatsApp: https://n8n.io/workflows/3586

---

**INSTRUCCIÓN**: El nodo "Download Image" ya está creado y conectado a Switch (salida Image). Ayúdame a configurarlo correctamente y luego añadir el análisis con GPT-4 Vision.
