# PROMPT PARA CLAUDE CODE
## Migración MY HOST BizMate: n8n → Vercel Edge

---

## CONTEXTO

Soy José, fundador de MY HOST BizMate. Tengo un sistema de WhatsApp AI Agent para hoteles funcionando en n8n (Railway). Necesito migrarlo a Vercel Edge Functions para escalar a 100+ clientes.

---

## LO QUE TENGO FUNCIONANDO

### Agente WhatsApp AI que:
1. Recibe mensajes de WhatsApp via ChakraHQ webhook
2. Consulta disponibilidad en Supabase (función `check_availability`)
3. Calcula precios (función `calculate_booking_price`)
4. Crea reservas en tabla `bookings`
5. Responde al cliente via API de ChakraHQ
6. Mantiene memoria de conversación

### Stack actual:
- **n8n** en Railway (workflows visuales)
- **Supabase** (base de datos PostgreSQL)
- **OpenAI** API (gpt-4o-mini)
- **ChakraHQ** (WhatsApp Business API)

---

## LO QUE NECESITO

### Arquitectura Vercel Edge Multi-tenant:

```
WhatsApp → ChakraHQ → Vercel Edge Function → Supabase
                              ↓
                    1. Identifica tenant por número
                    2. Carga config de Supabase
                    3. Llama a OpenAI con prompt del tenant
                    4. Ejecuta tools (disponibilidad, precio, reserva)
                    5. Responde via ChakraHQ
```

### Tabla `tenants` en Supabase:

```sql
CREATE TABLE tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  whatsapp_number TEXT UNIQUE NOT NULL,
  chakra_plugin_id TEXT NOT NULL,
  chakra_phone_id TEXT NOT NULL,
  chakra_access_token TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## CREDENCIALES Y ENDPOINTS

### Supabase
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Anon Key: [proporcionaré]
- Service Role Key: [proporcionaré]

### OpenAI
- API Key: [proporcionaré]
- Modelo: gpt-4o-mini

### ChakraHQ (ejemplo de un tenant)
- API: https://api.chakrahq.com/v1/ext/plugin/whatsapp/{plugin_id}/api/v19.0/{phone_id}/messages
- Authorization: Bearer {access_token}

---

## FUNCIONES SUPABASE EXISTENTES

```sql
-- Disponibilidad
SELECT check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
);

-- Precio
SELECT calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INTEGER
);
```

---

## ESTRUCTURA DE PROYECTO ESPERADA

```
/myhost-bizmate-api/
├── package.json
├── tsconfig.json
├── vercel.json
├── .env.example
├── src/
│   ├── app/
│   │   └── api/
│   │       └── webhook/
│   │           └── whatsapp/
│   │               └── route.ts    # Edge Function principal
│   ├── lib/
│   │   ├── supabase.ts            # Cliente Supabase
│   │   ├── openai.ts              # Cliente OpenAI con tools
│   │   ├── chakra.ts              # Cliente ChakraHQ
│   │   └── types.ts               # Tipos TypeScript
│   ├── tools/
│   │   ├── checkAvailability.ts
│   │   ├── calculatePrice.ts
│   │   └── createBooking.ts
│   └── utils/
│       └── memory.ts              # Gestión de memoria conversacional
└── README.md
```

---

## FLUJO DETALLADO

### 1. Webhook recibe mensaje
```typescript
// POST /api/webhook/whatsapp
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "6281234567890",  // Número del cliente
          "text": { "body": "Quiero reservar" }
        }]
      }
    }]
  }]
}
```

### 2. Identificar tenant
```typescript
const tenant = await supabase
  .from('tenants')
  .select('*')
  .eq('whatsapp_number', fromNumber)
  .single();
```

### 3. Cargar memoria de conversación
```typescript
const history = await supabase
  .from('conversation_memory')
  .select('*')
  .eq('phone_number', fromNumber)
  .order('created_at', { ascending: false })
  .limit(5);
```

### 4. Llamar OpenAI con tools
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: tenant.system_prompt },
    ...history,
    { role: 'user', content: message }
  ],
  tools: [
    { type: 'function', function: checkAvailabilityTool },
    { type: 'function', function: calculatePriceTool },
    { type: 'function', function: createBookingTool }
  ]
});
```

### 5. Ejecutar tools si es necesario
```typescript
if (completion.choices[0].message.tool_calls) {
  // Ejecutar cada tool y obtener resultados
  // Llamar OpenAI de nuevo con resultados
}
```

### 6. Enviar respuesta via ChakraHQ
```typescript
await fetch(`https://api.chakrahq.com/v1/ext/plugin/whatsapp/${tenant.chakra_plugin_id}/...`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${tenant.chakra_access_token}` },
  body: JSON.stringify({
    messaging_product: 'whatsapp',
    to: fromNumber,
    type: 'text',
    text: { body: response }
  })
});
```

### 7. Guardar en memoria
```typescript
await supabase.from('conversation_memory').insert({
  phone_number: fromNumber,
  role: 'assistant',
  content: response
});
```

---

## REQUERIMIENTOS ADICIONALES

### Manejo de errores
- Si tenant no existe → Respuesta genérica
- Si OpenAI falla → Retry o respuesta de error amigable
- Si Supabase falla → Log y respuesta de error

### Rate limiting
- Máximo 100 requests/minuto por tenant
- Implementar cola si es necesario

### Logging
- Guardar logs en tabla `webhook_logs`
- Incluir: timestamp, tenant_id, request, response, duration

### Validación webhook
- Verificar que el request viene de ChakraHQ
- Filtrar status updates (solo procesar mensajes)

---

## ARCHIVOS ADJUNTOS

1. **workflow-whatsapp-agent.json** - Export del workflow n8n actual
2. **schema.sql** - Estructura actual de Supabase
3. **system-prompts.md** - Ejemplos de prompts por hotel

---

## ENTREGABLES ESPERADOS

1. Proyecto completo de Vercel Edge listo para deploy
2. Instrucciones de configuración de variables de entorno
3. Script SQL para crear tabla `tenants` y `conversation_memory`
4. README con instrucciones de deploy y mantenimiento
5. Tests básicos para verificar funcionamiento

---

## COMANDOS DE DEPLOY

Una vez creado el proyecto:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## NOTAS IMPORTANTES

- Usa Edge Runtime, no Node.js (más rápido y barato)
- Timeouts de Vercel Edge: 30 segundos máximo
- Si OpenAI tarda mucho, considera streaming o response parciales
- La memoria conversacional debe limpiar mensajes antiguos (+24 horas)
