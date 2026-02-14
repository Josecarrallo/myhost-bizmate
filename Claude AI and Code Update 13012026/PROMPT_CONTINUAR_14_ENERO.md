# PROMPT PARA CONTINUAR - 14 ENERO 2026

## CONTEXTO RÁPIDO

Ayer (13 enero) implementamos Master Event v1.0 para estandarizar la comunicación entre flujos. BANYU (WhatsApp) ya envía Master Events a WF-SP-01 CLEAN y funciona perfectamente.

## PRIORIDAD MÁXIMA: KORA (Voice AI - VAPI)

### Objetivo
Hacer que KORA (VAPI) envíe Master Event v1.0 a WF-SP-01 igual que hace BANYU.

### Lo que necesitamos
1. Analizar la estructura de salida de VAPI después de una llamada
2. Crear nodo "Build Master Event" que transforme la salida de VAPI al formato Master Event v1.0
3. Enviar a WF-SP-01 CLEAN (webhook: `/webhook/inbound-lead-v3`)

### Master Event v1.0 - Recordatorio
```json
{
  "schema_version": "1.0",
  "event_id": "uuid",
  "event_type": "lead_inbound",
  "source": "voice",
  "timestamp": "ISO_DATE",
  "tenant": {
    "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
  },
  "contact": {
    "name": "string",
    "phone": "string (required)",
    "email": "string|null",
    "language": "en"
  },
  "message": {
    "channel": "voice",
    "message_id": "string",
    "text": "transcripción o resumen de la llamada",
    "raw": "payload original de VAPI"
  },
  "context": {},
  "meta": {
    "flow_origin": "WF-VOICE-KORA",
    "trace_id": "uuid"
  }
}
```

### Patrón a seguir (igual que BANYU)
```
VAPI Call End → Webhook n8n → Build Master Event → HTTP POST to /webhook/inbound-lead-v3
```

### Código de referencia (Build Master Event de BANYU)
```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

return [{
  json: {
    schema_version: "1.0",
    event_id: generateUUID(),
    event_type: "lead_inbound",
    source: "voice",
    timestamp: new Date().toISOString(),
    tenant: {
      tenant_id: "c24393db-d318-4d75-8bbf-0fa240b9c1db",
      property_id: "18711359-1378-4d12-9ea6-fb31c0b1bac2"
    },
    contact: {
      name: /* extraer de VAPI */,
      phone: /* extraer de VAPI */,
      email: null,
      language: "en"
    },
    message: {
      channel: "voice",
      message_id: /* extraer de VAPI */,
      text: /* transcripción o summary de VAPI */,
      raw: /* payload completo de VAPI */
    },
    context: {},
    meta: {
      flow_origin: "WF-VOICE-KORA",
      trace_id: generateUUID()
    }
  }
}];
```

## WORKFLOWS RELEVANTES

| Workflow | ID | Estado |
|----------|-----|--------|
| WF-SP-01 CLEAN | BX2X9P1xvZBnpr1p | ✅ Activo |
| BANYU | ORTMMLk6qVKFhELp | ✅ Activo |
| KORA (a modificar) | ? | Pendiente analizar |

## DESPUÉS DE KORA

1. Follow-Up Engine (LUMINA)
2. Guest Journey
3. Content Creator (info ya proporcionada)

## COMANDO PARA EMPEZAR

"Necesito conectar KORA (VAPI Voice AI) a WF-SP-01 usando Master Event v1.0. Primero muéstrame el workflow de KORA actual y la estructura de datos que recibe de VAPI para crear el nodo Build Master Event."
