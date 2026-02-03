# PROMPT COMPLETO: Debugging VAPI/KORA - MY HOST BizMate

## CONTEXTO DEL PROYECTO

- **Proyecto:** MY HOST BizMate - SaaS para hoteles boutique en Bali
- **Cliente piloto:** Izumi Hotel
- **Fecha:** 21 Enero 2026

## AGENTES DEL SISTEMA

- **KORA:** Voice AI (VAPI + Claude) - Maneja llamadas telefónicas, reservas por voz
- **BANYU:** WhatsApp AI - Maneja mensajes de WhatsApp
- **OSIRIS:** Backoffice AI - En desarrollo

---

## PROBLEMA ORIGINAL: Número de teléfono corrupto

### Descripción
Cuando un huésped hace una reserva por teléfono con KORA, el número de teléfono se guarda **corrupto** en Supabase.

### Ejemplo concreto
- **Número correcto (lo que dice el huésped):** `34619794604` (11 dígitos)
- **Número corrupto (lo que se guarda):** `34661979946604` (14 dígitos)

### Causa raíz identificada
El problema ocurre en **dos lugares**:

1. **Durante la llamada:** VAPI/Claude transcribe mal el número cuando llama al tool `create_booking`. El MCP guarda el número ya corrupto.

2. **En el Structured Output:** A veces VAPI también genera el Structured Output con el número mal transcrito. En la última prueba, KORA dijo en voz alta: "Phone, three four **six six** one nine seven nine four six zero four" - duplicando el 6.

---

## SOLUCIÓN IMPLEMENTADA

### Estrategia
Usar el Structured Output de VAPI (que se genera al final de la llamada) para **corregir** el número de teléfono en el booking después de que se crea.

### Flujo modificado: WF-02-KORA-POST-CALL (ID: gsMMQrc9T2uZ7LVA)

**Flujo original:**
```
VAPI Webhook → Extract Structured Output → Build Johnson Contract → Send to WF-SP-01
```

**Flujo modificado (añadidos 2 nodos):**
```
VAPI Webhook → Extract Structured Output → Build Johnson Contract → 1. Find Booking → 2. Update Phone → Send to WF-SP-01
```

### Nodos añadidos

#### Nodo 1: "1. Find Booking by Name+Date"
- **Tipo:** Supabase GET
- **Tabla:** bookings
- **Filtros:**
  - `guest_name` = `{{ $json.lead.name }}`
  - `check_in` = `{{ $json.booking.check_in }}`

#### Nodo 2: "2. Update Phone from Structured Output"
- **Tipo:** Supabase UPDATE
- **Tabla:** bookings
- **Filtro:** `id` equals `{{ $json.id }}`
- **Campo a actualizar:** `guest_phone` = `{{ $('Build Johnson Contract').item.json.lead.phone }}`

### Cambio adicional en "Send to WF-SP-01"
Se cambió el JSON Body de:
```
{{ $json }}
```
A:
```
{{ $('Build Johnson Contract').item.json }}
```

**Razón:** Después del UPDATE de Supabase, `$json` contiene el resultado del UPDATE, no el Johnson Contract. Había que referenciar explícitamente el output del nodo "Build Johnson Contract".

---

## WORKFLOWS INVOLUCRADOS

| ID | Nombre | Función |
|----|--------|---------|
| gsMMQrc9T2uZ7LVA | WF-02-KORA-POST-CALL | Recibe Structured Output de VAPI, actualiza booking, envía a Lead Handler |
| ydByDOQWq9kJACAe | WF-01-MCP-KORA-TOOLS | MCP que ejecuta tools durante la llamada (create_booking, etc.) |
| p3ukMWIbKN4bf5Gz | WF-04-BOOKING-NOTIFICATIONS | Envía WhatsApp y Email al crear booking (trigger de Supabase) |
| OZmq7E9wzODJrzej | WF-03-LEAD-HANDLER | Procesa Johnson Contract, crea/actualiza leads |

---

## ESTADO ACTUAL DE LOS NODOS (WF-02-KORA-POST-CALL)

### 1. VAPI Webhook ✅
- Path: `kora-post-call-v2`
- Method: POST

### 2. Extract Structured Output ✅
- Extrae `callResult` del payload de VAPI
- Solo procesa eventos `end-of-call-report`
- Si no encuentra callResult, devuelve array vacío `[]` y el flujo termina

### 3. Build Johnson Contract ✅
- Transforma callResult a formato Johnson Contract v1
- Output incluye: `lead.name`, `lead.phone`, `lead.email`, `booking.check_in`, etc.

### 4. 1. Find Booking by Name+Date ✅
- Busca booking por `guest_name` + `check_in`
- Configuración correcta

### 5. 2. Update Phone from Structured Output ✅
- Actualiza `guest_phone` con el teléfono del Structured Output
- Configuración correcta:
  - `fieldsUi.fieldValues[0].fieldId`: `guest_phone`
  - `fieldsUi.fieldValues[0].fieldValue`: `{{ $('Build Johnson Contract').item.json.lead.phone }}`

### 6. Send to WF-SP-01 ✅
- URL: `https://n8n-production-bb2d.up.railway.app/webhook/inbound-johnson-v1`
- JSON Body: `{{ $('Build Johnson Contract').item.json }}`

---

## PROBLEMA ACTUAL

### Situación
En la última prueba (04:40-04:41):
- WF-01-MCP-KORA-TOOLS ejecutó ✅
- WF-04-BOOKING-NOTIFICATIONS ejecutó ✅ (WhatsApp/Email llegaron bien)
- WF-02-KORA-POST-CALL ejecutó 2 veces (5152 y 5153) ✅
- **WF-03-LEAD-HANDLER NO ejecutó** después de las 04:18

### Análisis
Las ejecuciones 5152 y 5153 del Post-Call terminaron rápido (menos de 1 segundo). Esto sugiere que:
1. VAPI envió eventos que NO eran `end-of-call-report`
2. El nodo "Extract Structured Output" devolvió `[]`
3. El flujo terminó sin llegar a "Send to WF-SP-01"

### Preguntas sin resolver
1. ¿VAPI envió el evento `end-of-call-report` en esta prueba?
2. Si lo envió, ¿por qué no se procesó?
3. ¿Hay algún problema en la detección del messageType?

---

## ERRORES ANTERIORES (YA RESUELTOS)

### Error 1: "failed to parse logic tree ((id..7bf65e43...))"
- **Causa:** El nodo "2. Update Phone" no tenía configurado el campo `condition: eq` en el filtro
- **Solución:** Configurar `condition: eq` manualmente en n8n

### Error 2: "johnson.v1 [line 6] - Invalid or missing version"
- **Causa:** "Send to WF-SP-01" enviaba `{{ $json }}` que contenía el resultado del UPDATE, no el Johnson Contract
- **Solución:** Cambiar a `{{ $('Build Johnson Contract').item.json }}`

### Error 3: "Invalid JSON in response body"
- **Causa:** Consecuencia del Error 2 - WF-03-LEAD-HANDLER fallaba al validar
- **Solución:** Misma que Error 2

---

## PENDIENTE POR HACER

### 1. Investigar por qué WF-03-LEAD-HANDLER no ejecutó
- Verificar si VAPI está enviando el evento `end-of-call-report`
- Revisar logs de VAPI
- Posiblemente el nodo "Extract Structured Output" necesita debugging

### 2. Mejorar prompt de KORA para validación de teléfono
Añadir al prompt:
```
PHONE NUMBER VALIDATION - CRITICAL:
1. A valid phone number has between 10 and 13 digits total
2. After the guest says their number, COUNT the digits before repeating
3. If you count MORE than 13 digits, say: "I think I may have misheard. Could you please repeat your phone number slowly, one digit at a time?"
4. If you count LESS than 10 digits, ask them to include their country code
5. NEVER confirm a phone number that has more than 13 digits
6. The EXACT phone number you repeat back to the guest must be the SAME number you save in the contact.phone field of the structured output. No changes, no additions, no modifications.
7. Before calling create_booking, verify: the phone number in your tool call matches EXACTLY what you confirmed with the guest.
```

### 3. Limpiar workflows temporales
- Borrar: `wVWKoF1U8zW9Bjft` (FINAL - 2 Nodos Corregidos)
- Borrar: `x9AfporcZoKbpxSm` (CORRECTO - 2 Nodos para Post-Call)

---

## TABLA DE BOOKINGS - REGISTROS DE PRUEBA

Se borraron todos los bookings de hoy (21 Enero 2026) para pruebas limpias.

Bookings borrados:
| guest_name | guest_phone | check_in |
|------------|-------------|----------|
| Jose Fernandez | 34619794604 | 2026-09-15 |
| Jose Ruiz | 34661979946604 | 2026-10-01 |
| Jose Gomez | 34619794604 | 2026-09-20 |

---

## RESUMEN EJECUTIVO

1. **Problema original:** Teléfono se corrompe durante llamadas VAPI
2. **Solución implementada:** Añadir 2 nodos al Post-Call para corregir el teléfono usando Structured Output
3. **Estado de los nodos:** Todos configurados correctamente
4. **Problema actual:** WF-03-LEAD-HANDLER no se ejecutó en última prueba, aunque WhatsApp/Email sí llegaron
5. **Siguiente paso:** Investigar si VAPI está enviando el evento end-of-call-report y por qué no se procesa
