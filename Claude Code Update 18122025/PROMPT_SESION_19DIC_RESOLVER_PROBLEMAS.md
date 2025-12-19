# PROMPT SESIÓN - RESOLVER PROBLEMAS MY HOST BIZMATE
## 19 Diciembre 2024 - URGENTE

---

## COPIAR Y PEGAR ESTO AL INICIO DE NUEVA SESIÓN:

```
Hola, soy José de MY HOST BizMate. Necesito resolver varios problemas urgentes en los workflows de n8n y en Vapi.

CONTEXTO DEL PROYECTO:
- Plataforma SaaS de gestión hotelera con IA para Izumi Hotel (Bali)
- 3 agentes: WhatsApp AI, Booking Confirmation, Vapi Voice
- Stack: n8n (Railway) + Supabase + Vapi.ai + ChakraHQ (WhatsApp)
- Ayer funcionaba todo, hoy hay múltiples errores

=====================================================
PROBLEMA 1: WORKFLOW VIII - WHATSAPP AI AGENT
=====================================================
URL: https://n8n-production-bb2d.up.railway.app/workflow/ln2myAS3406D6F8W
ID: ln2myAS3406D6F8W

ERRORES:
1. No da el precio de la habitación cuando el cliente selecciona una
2. Cuando confirma la reserva NO dice el total (solo lo dice si se lo pides explícitamente)
3. Falta bloque de contacto al final de los mensajes

SOLUCIÓN NECESARIA:
- Actualizar System Prompt para que SIEMPRE calcule y diga el precio antes de crear reserva
- Añadir regla: "Siempre informa el precio de la habitación seleccionada y el total antes de confirmar"
- Añadir al final de conversaciones importantes:

📞 CONTACTO IZUMI HOTEL
WhatsApp: +62 813 2576 4867 (24/7)
Teléfono: +62 813 2576 4867 (8:00-22:00)
Web: www.my-host-bizmate.com (Asistente de voz 24/7)

=====================================================
PROBLEMA 2: WORKFLOW VI - BOOKING CONFIRMATION
=====================================================
URL: https://n8n-production-bb2d.up.railway.app/workflow/OxNTDO0yitqV6MAL
ID: OxNTDO0yitqV6MAL

ERRORES:
1. El precio aparece como $0 en el email y WhatsApp de confirmación
2. Falta bloque de contacto

CAUSA PROBABLE:
- El campo total_price no se está pasando correctamente desde el webhook
- O el workflow Create Booking del Agent VIII está guardando 0 en vez del precio calculado

SOLUCIÓN NECESARIA:
- Revisar de dónde viene el precio (webhook payload vs Supabase)
- Corregir para que muestre el precio real
- Añadir bloque de contacto al final del email y WhatsApp

=====================================================
PROBLEMA 3: VAPI VOICE ASSISTANT - NO FUNCIONA
=====================================================
Workflow n8n: https://n8n-production-bb2d.up.railway.app/workflow/3sU4RgV892az8nLZ
ID: 3sU4RgV892az8nLZ
Webhook: https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix

CONFIGURACIÓN VAPI:
- Assistant ID: 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
- Assistant Name: Ayu - Izumi Hotel
- Model: OpenAI GPT-4o Mini
- Voice: OpenAI shimmer
- Transcriber: Deepgram English
- Tool: send_to_n8n → webhook vapi-izumi-fix
- Timeout: 20 segundos

ERRORES:
1. Se conecta pero dice: "It seems there is still an issue with processing your reservation request. Please allow me a moment to try again. It seems I'm having trouble processing your reservation request at the moment."
   → Esto indica que el tool send_to_n8n está fallando o n8n no responde

2. Mezcla español e inglés (números en inglés, resto en español)
   → Problema de configuración de idioma en Vapi

3. Aparece warning: "Missing Provider Fallbacks - No transcriber fallback configured - No voice fallback configured"
   → Necesita configurar fallbacks

4. Desde Vapi Dashboard habla en inglés, desde widget web habla en español
   → Inconsistencia en configuración de idioma

SYSTEM PROMPT ACTUAL EN VAPI DASHBOARD:
"You are Ayu from Izumi Hotel in Bali. Always respond in English only. When the user asks anything, use the send_to_n8n tool to get the answer. Always use the tool for every question."

SYSTEM PROMPT EN N8N AI AGENT (workflow IX):
"You are Ayu, the virtual receptionist at Izumi Hotel..."
(Este está en español/multiidioma)

TOOL EN VAPI:
- Nombre: send_to_n8n
- Parámetro: user_query (string, required)
- Server URL: https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix

=====================================================
INFORMACIÓN TÉCNICA ADICIONAL
=====================================================

SUPABASE:
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Property ID Izumi: 18711359-1378-4d12-9ea6-fb31c0b1bac2

FUNCIONES RPC SUPABASE:
- check_availability(p_property_id, p_check_in, p_check_out)
- calculate_booking_price(p_property_id, p_check_in, p_check_out, p_guests)

ENDPOINTS SUPABASE:
- POST /rest/v1/rpc/check_availability
- POST /rest/v1/rpc/calculate_booking_price
- POST /rest/v1/bookings

CHAKRAHQ (WhatsApp):
- API: https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c
- Phone ID: 944855278702577

=====================================================
ORDEN DE PRIORIDAD
=====================================================
1. VAPI - Arreglar conexión (más urgente, está roto)
2. Workflow VIII - Precios y bloque contacto
3. Workflow VI - Precio $0 y bloque contacto

¿Empezamos revisando por qué Vapi no puede conectar con n8n?
```

---

## RESUMEN DE PROBLEMAS

| Problema | Workflow | Síntoma | Causa probable |
|----------|----------|---------|----------------|
| Vapi no funciona | IX | "trouble processing" | n8n no responde o timeout |
| Vapi idioma mezclado | IX | Números en inglés | Config idioma inconsistente |
| WhatsApp no da precio | VIII | No dice total | Falta regla en prompt |
| Confirmación $0 | VI | Precio = 0 | total_price no se guarda |
| Falta contacto | VI, VIII | No aparece | Añadir a mensajes |

---

## DIAGNÓSTICO SUGERIDO PARA VAPI

1. **Verificar que workflow IX está ACTIVO en n8n**
2. **Probar webhook manualmente:**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/vapi-izumi-fix \
  -H "Content-Type: application/json" \
  -d '{"message":{"toolCallList":[{"id":"test123","function":{"name":"send_to_n8n","arguments":{"user_query":"What rooms do you have?"}}}]}}'
```
3. **Revisar logs de ejecución en n8n**
4. **Verificar timeout de Vapi (20s puede ser poco si n8n tarda)**

---

## DATOS DE CONTACTO A AÑADIR

```
📞 CONTACTO IZUMI HOTEL
WhatsApp: +62 813 2576 4867 (24/7)
Teléfono: +62 813 2576 4867 (8:00-22:00)
Web: www.my-host-bizmate.com (Asistente de voz 24/7)
```

---

*Documento creado: 19 Diciembre 2024*
*MY HOST BizMate - Sesión de resolución de problemas*
