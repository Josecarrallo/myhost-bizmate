# PROBLEMA: Número de teléfono se corrompe en bookings de VAPI/KORA

## Contexto
- **Proyecto:** MY HOST BizMate - SaaS para hoteles boutique en Bali
- **Agente afectado:** KORA (Voice AI via VAPI)
- **Cliente piloto:** Izumi Hotel

## El problema
Cuando un huésped hace una reserva por teléfono con KORA, el número de teléfono se guarda **corrupto** en Supabase.

- **Número correcto (lo que dice el huésped):** `34619794604`
- **Número corrupto (lo que se guarda):** `34661979946604`

## Dónde ocurre la corrupción

```
1. Huésped dice su número por teléfono
2. VAPI/Claude transcribe el número DURANTE la llamada
3. Claude llama al tool create_booking con el número YA CORRUPTO ❌
4. MCP (WF-01-MCP-KORA-TOOLS) guarda en Supabase → número MAL
5. Supabase trigger dispara WF-04-BOOKING-NOTIFICATIONS
6. Notificaciones se envían con número MAL
```

## Dato clave descubierto
El **Structured Output** que VAPI genera AL FINAL de la llamada tiene el número **CORRECTO**:

```json
{
  "contact": {
    "name": "Jose Ruiz",
    "email": "Ruth@gmail.com", 
    "phone": "34619794604"  ← CORRECTO
  }
}
```

Pero el booking en Supabase ya se guardó con el número malo durante la llamada.

## Solución propuesta
Modificar **WF-02-KORA-POST-CALL** para que después de recibir el Structured Output (con datos correctos), **actualice** el booking en Supabase con el teléfono correcto.

## Flujo actual de WF-02-KORA-POST-CALL

```
VAPI Webhook → Extract Structured Output → Build Johnson Contract → Send to WF-SP-01
```

## Flujo modificado (añadir 2 nodos)

```
VAPI Webhook → Extract Structured Output → Build Johnson Contract → [1. Find Booking] → [2. Update Phone] → Send to WF-SP-01
```

## Los 2 nodos a añadir

### Nodo 1: Find Booking by Name+Date
- Busca el booking recién creado usando `guest_name` + `check_in`
- Datos vienen de: `$json.lead.name` y `$json.booking.check_in` (output de Build Johnson Contract)

### Nodo 2: Update Phone from Structured Output
- Actualiza el campo `guest_phone` del booking encontrado
- Nuevo valor viene de: `$('Build Johnson Contract').item.json.lead.phone` (el teléfono CORRECTO del Structured Output)

## Resultado esperado
- El booking se crea durante la llamada (con teléfono malo)
- Al terminar la llamada, el post-call corrige el teléfono
- Las notificaciones (WhatsApp, Email) ya usarán el teléfono correcto

## Workflows involucrados
- **WF-01-MCP-KORA-TOOLS** (ID: ydByDOQWq9kJACAe) - Crea booking durante llamada
- **WF-02-KORA-POST-CALL** (ID: gsMMQrc9T2uZ7LVA) - Recibe Structured Output, AQUÍ SE AÑADEN LOS 2 NODOS
- **WF-04-BOOKING-NOTIFICATIONS** (ID: p3ukMWIbKN4bf5Gz) - Envía WhatsApp/Email
