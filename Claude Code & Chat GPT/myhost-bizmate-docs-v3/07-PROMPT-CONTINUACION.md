# MY HOST BIZMATE - PROMPT PARA CONTINUACIÓN
## Usar en Nueva Sesión de Claude/Claude Code
### Versión 3.0 - 15 Diciembre 2024

---

## PROMPT RÁPIDO (Copiar y Pegar)

```
Soy José, founder de MY HOST BizMate. Continúo el desarrollo de la plataforma.

ESTADO ACTUAL (15 Dic 2024):
✅ WhatsApp AI Agent funcionando (texto + audio bidireccional + imágenes)
✅ Vapi Voice Assistant funcionando (voz en tiempo real)
✅ n8n workflows desplegados en Railway
✅ Supabase con funciones RPC
✅ Frontend React en Vercel

WORKFLOWS ACTIVOS:
- MY HOST Bizmate VI: Booking Confirmation
- MY HOST Bizmate VII: Staff Notification  
- MY HOST Bizmate VIII: WhatsApp AI Agent (ID: ln2myAS3406D6F8W)
- MY HOST Bizmate IX: Vapi Voice (ID: 3sU4RgV892az8nLZ)

SIGUIENTE PASO:
[Describir aquí qué quieres hacer]

Documentación completa en los archivos adjuntos.
```

---

## PROMPT DETALLADO (Para contexto completo)

```
Soy José, founder de MY HOST BizMate, una plataforma SaaS de gestión hotelera con IA para hoteles boutique en Indonesia/SEA.

ESTADO DEL PROYECTO (15 Diciembre 2024):

1. AGENTES COMPLETADOS:
   ✅ Agente 1: Booking Confirmation (email + WhatsApp)
   ✅ Agente 2: WhatsApp AI Agent (texto, audio bidireccional, imágenes)
   ✅ Agente 3: Vapi Voice Assistant (voz en tiempo real web/app)

2. STACK TÉCNICO:
   - Frontend: React + Tailwind (Vercel)
   - Automación: n8n (Railway)
   - Base de datos: Supabase (PostgreSQL)
   - WhatsApp: ChakraHQ
   - Voice: Vapi.ai
   - LLM: OpenAI GPT-4.1-mini

3. WORKFLOWS N8N:
   - VI: Booking Confirmation (OxNTDO0yitqV6MAL)
   - VII: Staff Notification (F8YPuLhcNe6wGcCv)
   - VIII: WhatsApp AI Agent (ln2myAS3406D6F8W)
   - IX: Vapi Voice (3sU4RgV892az8nLZ) ← ACTIVO

4. PROPIEDAD DE PRUEBA:
   - Izumi Hotel, Ubud, Bali
   - Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
   - WhatsApp: +62 813 2576 4867

5. PENDIENTE:
   - Widget Vapi en frontend React
   - Property ID dinámico (multi-tenant)
   - Dashboard de analytics
   - Template replicable para onboarding

6. LECCIONES APRENDIDAS VAPI+N8N:
   - Usar AI Agent v3, no v2.2 (bugs con tools)
   - Extracción de datos: toolCallList[0].function.arguments (incluir .function)
   - Prompts cortos funcionan mejor
   - Vapi mantiene contexto, no necesita memoria en n8n

Documentación completa adjunta. ¿En qué continuamos?
```

---

## PROMPTS ESPECÍFICOS POR TAREA

### Para Widget Vapi
```
Necesito integrar el widget de voz de Vapi en el frontend React.

Detalles:
- SDK: @vapi-ai/web
- Assistant ID: 1fde9a8c-b473-4f2a-8b7a-0cb53bc8bb61
- Debe mostrar: botón flotante, estados de llamada, transcripción

Ver archivo 06-FRONTEND-VERCEL.md para estructura del componente.
```

### Para Multi-tenant
```
Necesito implementar property_id dinámico para soportar múltiples propiedades con un solo workflow.

Actualmente está hardcodeado:
"p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"

Plan:
1. Añadir property_id en metadata de Vapi
2. Extraerlo en n8n: $json.body.message.call.assistant.metadata.property_id
3. Pasarlo dinámicamente a los tools

Ver archivo 04-ARQUITECTURA-MULTITENANT.md para detalles.
```

### Para Analytics
```
Necesito crear un dashboard de analytics que muestre:
- Llamadas Vapi (desde API de Vapi)
- Mensajes WhatsApp (desde Supabase)
- Reservas por canal
- Tasa de conversión

Fuentes de datos:
- Vapi API: GET https://api.vapi.ai/call
- Supabase: tabla bookings con campo 'channel'

Ver archivo MYHOST_BIZMATE_CLAUDE_CODE_TECHNICAL_DOC_V3.md sección 9.
```

---

## ARCHIVOS DE REFERENCIA

Adjuntar estos archivos según la tarea:

| Tarea | Archivos a adjuntar |
|-------|---------------------|
| General | 01-ESTADO-PROYECTO.md |
| Onboarding | 02-GUIA-ONBOARDING.md |
| Negocio | 03-COSTOS-PROYECCIONES.md |
| Multi-tenant | 04-ARQUITECTURA-MULTITENANT.md |
| Agentes | 05-CONFIGURACION-AGENTES.md |
| Frontend | 06-FRONTEND-VERCEL.md |
| Claude Code | MYHOST_BIZMATE_CLAUDE_CODE_TECHNICAL_DOC_V3.md |
| Prompts IA | PROMPT_AI_AGENT_IZUMI_v3.md |

---

## NOTAS IMPORTANTES

1. **MCP en Railway:** Tiene PATCH bloqueado, configurar nodos manualmente

2. **Expresiones cross-node en n8n:**
   ```
   $('NombreNodo').item.json.campo
   ```

3. **Vapi extracción de datos:**
   ```
   $json.body.message.toolCallList[0].function.arguments.user_query
   ```
   (incluir .function es CRÍTICO)

4. **AI Agent versión:** Siempre usar v3, no v2.2

---

*Última actualización: 15 Diciembre 2024*
