# Mejoras Necesarias VAPI/KORA - MY HOST BizMate

**Fecha:** 21 Enero 2026  
**Estado:** Pendiente de implementación  
**Prioridad:** Antes de producción

---

## 1. Duplicación de Teléfonos en Leads

### Problema
El mismo teléfono puede crear múltiples leads en la tabla `leads`. En pruebas vimos que "Gomez" y "Pedro Ruiz" se crearon como leads separados con el mismo número (34619794604).

### Impacto
- Datos duplicados en CRM
- Métricas de leads incorrectas
- Confusión al hacer seguimiento comercial

### Solución Propuesta

**Opción A: Modificar función RPC `find_lead_by_contact`**
```sql
-- Hacer que busque SOLO por teléfono (ignorando nombre)
CREATE OR REPLACE FUNCTION find_lead_by_contact(
  p_phone TEXT,
  p_email TEXT,
  p_tenant_id UUID
) RETURNS leads AS $$
BEGIN
  -- Primero buscar por teléfono (más fiable)
  IF p_phone IS NOT NULL THEN
    RETURN (SELECT * FROM leads WHERE phone = p_phone AND tenant_id = p_tenant_id LIMIT 1);
  END IF;
  
  -- Si no hay teléfono, buscar por email
  IF p_email IS NOT NULL THEN
    RETURN (SELECT * FROM leads WHERE email = p_email AND tenant_id = p_tenant_id LIMIT 1);
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

**Opción B: Añadir UNIQUE constraint**
```sql
-- Constraint único por teléfono + tenant
ALTER TABLE leads ADD CONSTRAINT unique_phone_per_tenant 
UNIQUE (phone, tenant_id);
```

### Esfuerzo Estimado
- 30 minutos

---

## 2. Find Booking Depende del Nombre

### Problema
La rama de "Update Phone" en WF-02-KORA-POST-CALL busca el booking por `guest_name + check_in`. Pero el nombre puede variar entre:
- Lo que guarda el MCP durante la llamada: "Corelho"
- Lo que viene en el Structured Output: "Carolo"

Si no coinciden exactamente, no encuentra el booking y no actualiza el teléfono.

### Impacto
- El teléfono corrupto no se corrige
- La solución implementada no funciona en todos los casos

### Solución Propuesta

**Modificar nodo "1. Find Booking by Name+Date" para buscar por `check_in + created_at reciente`:**

```javascript
// En lugar de buscar por nombre, buscar el booking más reciente de hoy con esa fecha de check_in
{
  "filters": {
    "conditions": [
      {
        "keyName": "check_in",
        "keyValue": "={{ $json.booking.check_in }}"
      },
      {
        "keyName": "created_at",
        "condition": "gte",
        "keyValue": "={{ new Date().toISOString().split('T')[0] }}"
      }
    ]
  }
}
```

**Alternativa:** Usar el `caller_number` del webhook de VAPI (más fiable que el nombre).

### Esfuerzo Estimado
- 15 minutos

---

## 3. Sin Retry / Dead-Letter Queue

### Problema
Si WF-03-LEAD-HANDLER o WF-04-BOOKING-NOTIFICATIONS fallan por cualquier razón (timeout, API caída, etc.), los datos se pierden. No hay mecanismo de reintentos ni registro de fallos.

### Impacto
- Pérdida de leads en CRM
- Clientes no reciben confirmación de booking
- Sin visibilidad de qué falló

### Solución Propuesta

**Paso 1: Activar Retry en nodos HTTP**
En n8n, cada nodo HTTP Request tiene opción "Retry on Fail":
- Retries: 3
- Wait between retries: 1000ms

**Paso 2: Crear tabla de eventos fallidos**
```sql
CREATE TABLE failed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending, retrying, resolved, abandoned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_retry_at TIMESTAMPTZ
);
```

**Paso 3: Workflow de reprocesamiento**
Crear WF-99-RETRY-FAILED-EVENTS:
- Trigger: Cron cada hora
- Lee `failed_events` con status='pending' y retry_count < 3
- Reenvía al workflow correspondiente
- Actualiza retry_count y status

### Esfuerzo Estimado
- 2 horas

---

## 4. Webhooks Sin Autenticación

### Problema
Los endpoints de webhook están expuestos públicamente:
- `https://n8n.../webhook/kora-post-call-v2`
- `https://n8n.../webhook/inbound-johnson-v1`
- `https://n8n.../webhook/booking-notifications-v3`

Cualquiera que conozca las URLs puede enviar datos falsos.

### Impacto
- Bookings falsos en el sistema
- Spam de WhatsApp/Email
- Datos corruptos en CRM
- Potencial vector de ataque

### Solución Propuesta

**Paso 1: Definir API Key secreta**
```
X-BizMate-API-Key: bm_prod_k8x9m2n4p5q7r3s1t6u8v0w2
```

**Paso 2: Configurar en VAPI**
En VAPI Dashboard → Assistant → Server URL → Headers:
```json
{
  "X-BizMate-API-Key": "bm_prod_k8x9m2n4p5q7r3s1t6u8v0w2"
}
```

**Paso 3: Validar en n8n**
Añadir nodo Code al inicio de cada workflow:
```javascript
const apiKey = $input.first().json.headers['x-bizmate-api-key'];
const validKey = 'bm_prod_k8x9m2n4p5q7r3s1t6u8v0w2';

if (apiKey !== validKey) {
  throw new Error('Unauthorized: Invalid API Key');
}

return $input.all();
```

**Paso 4: Configurar en ChakraHQ**
Similar proceso para webhooks de WhatsApp.

### Esfuerzo Estimado
- 1 hora

---

## 5. Validación de Teléfono en KORA (Prompt)

### Problema
VAPI/Claude a veces transcribe mal los dígitos del teléfono durante la llamada, duplicando o añadiendo números.

### Impacto
- Teléfonos inválidos en bookings
- WhatsApp no llega al cliente
- Imposible contactar para seguimiento

### Solución Propuesta

**Añadir al prompt de KORA:**
```
PHONE NUMBER VALIDATION - CRITICAL:

1. A valid phone number has between 10 and 13 digits total (including country code)

2. After the guest says their number, COUNT the digits mentally before repeating:
   - If you count MORE than 13 digits → You misheard. Ask them to repeat slowly.
   - If you count LESS than 10 digits → Ask for country code.

3. Always repeat the number back DIGIT BY DIGIT:
   "Let me confirm: three, four, six, one, nine, seven, nine, four, six, zero, four. Is that correct?"

4. NEVER confirm a phone number that has more than 13 digits.

5. The EXACT phone number you say out loud must be IDENTICAL to what you save in:
   - The create_booking tool call
   - The contact.phone field in structured output
   
6. If unsure, ask: "Could you please spell out your phone number one digit at a time?"
```

### Esfuerzo Estimado
- 15 minutos (solo actualizar prompt en VAPI)

---

## Resumen de Prioridades

| # | Mejora | Impacto | Esfuerzo | Prioridad |
|---|--------|---------|----------|-----------|
| 4 | Autenticación webhooks | Alto (seguridad) | 1h | 🔴 CRÍTICA |
| 1 | Duplicación leads | Medio | 30min | 🟠 ALTA |
| 5 | Validación teléfono | Medio | 15min | 🟠 ALTA |
| 3 | Retry/Dead-letter | Medio | 2h | 🟡 MEDIA |
| 2 | Find Booking | Bajo | 15min | 🟢 BAJA |

---

## Plan de Implementación Sugerido

### Antes de producción (obligatorio)
- [ ] #4 Autenticación webhooks
- [ ] #1 Duplicación leads
- [ ] #5 Validación teléfono en prompt

### Primera semana de producción
- [ ] #3 Retry/Dead-letter queue
- [ ] #2 Mejorar Find Booking

### Monitoreo continuo
- Revisar `failed_events` diariamente
- Alertas si hay más de 5 fallos/hora
