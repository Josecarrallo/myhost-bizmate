# 🎯 PROMPT COMPLETO: WF-SP-01 Inbound Lead Handler

## CONTEXTO DEL PROYECTO

Soy Jose, fundador de MY HOST BizMate - plataforma SaaS de automatización para hoteles boutique y villas en Bali. Mi cliente piloto es Izumi Hotel (7 villas de lujo en Ubud, apertura verano 2026).

---

## IDs CRÍTICOS (usar siempre estos)

| Concepto | Valor |
|----------|-------|
| tenant_id | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| property_id | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |

---

## INFRAESTRUCTURA

| Servicio | URL/Valor |
|----------|-----------|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | jjpscimtxrudtepzwhag.supabase.co |
| API Key Supabase (anon) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0` |

---

## WORKFLOW EXISTENTE: WF-SP-01 Inbound Lead Handler v2

| Campo | Valor |
|-------|-------|
| ID | `lpRxkDSlXduhdpc1` |
| Estado | ACTIVO ✅ |
| Endpoint | https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v2 |

### Flujo actual (6 nodos):

```
Webhook POST → 1. Normalizar → 2. Buscar Lead → 3. Merge → 4. Switch → 5a. INSERT / 5b. UPDATE → 6. Respond
```

### Lo que YA hace:

- ✅ Recibe POST con: channel, phone, name, email, message
- ✅ Normaliza datos con tenant_id y property_id hardcodeados
- ✅ Busca lead existente usando función RPC `find_lead_by_contact`
- ✅ Si nuevo → INSERT en tabla `leads` (status: NEW, intent: info, score: 20)
- ✅ Si existe → UPDATE (status: ENGAGED, last_contacted_at)
- ✅ Responde JSON con lead_id

---

## TABLAS EN SUPABASE (ya existen)

### Tabla `leads`:

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| tenant_id | uuid | FK |
| property_id | uuid | FK |
| name | text | |
| phone | text | |
| email | text | |
| channel | text | whatsapp/instagram/email/web/vapi |
| status | text | NEW → ENGAGED → HOT → FOLLOWING_UP → WON/LOST |
| intent | text | info/price/availability/booking |
| score | integer | |
| last_contacted_at | timestamp | |
| next_followup_at | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |

### Tabla `lead_events`:

| Columna | Tipo | Notas |
|---------|------|-------|
| id | uuid | PK |
| lead_id | uuid | FK a leads |
| event_type | text | lead_created, lead_updated, message_received, followup_scheduled, status_changed |
| event_data | jsonb | datos adicionales |
| created_at | timestamp | |

### Función RPC existente:

```sql
find_lead_by_contact(p_phone, p_email, p_tenant_id)
```

---

## TAREAS PENDIENTES (hacer en orden)

### TAREA 1: Agregar Clasificación de Intención con AI

Insertar nodo entre "3. Merge" y "4. Switch" que use OpenAI para clasificar:

| Intent | Descripción | Score |
|--------|-------------|-------|
| info | pregunta general | +10 |
| price | pregunta de precio | +20 |
| availability | consulta disponibilidad | +30 |
| booking | quiere reservar | +50, status HOT |

Usar el mensaje del usuario para clasificar. Respuesta debe ser solo una palabra.

---

### TAREA 2: Agregar Log en lead_events

Después de INSERT o UPDATE, crear nodo que inserte en `lead_events`:

| Situación | event_type |
|-----------|------------|
| Nuevo lead | `lead_created` |
| Lead existente | `message_received` |

El `event_data` debe incluir: channel, message, intent, score

---

### TAREA 3: Trigger al WhatsApp AI Concierge

Si channel = "whatsapp", después de procesar el lead, llamar al workflow existente:

| Campo | Valor |
|-------|-------|
| Workflow | WhatsApp AI Concierge |
| ID | `ln2myAS3406D6F8W` |

Pasar los datos necesarios para que responda al cliente.

---

### TAREA 4: Pruebas completas

#### Test 1 - Nuevo lead WhatsApp (pregunta precio):

```json
{
  "channel": "whatsapp",
  "phone": "+62812345TEST1",
  "name": "Test User 1",
  "message": "Hola, ¿cuánto cuesta una villa por noche?"
}
```

**Esperado:** intent=price, score=20, status=NEW, event=lead_created

---

#### Test 2 - Lead existente (mismo teléfono, pregunta disponibilidad):

```json
{
  "channel": "whatsapp", 
  "phone": "+62812345TEST1",
  "name": "Test User 1",
  "message": "¿Tienen disponibilidad para el 15 de marzo?"
}
```

**Esperado:** intent=availability, score aumenta, status=ENGAGED, event=message_received

---

#### Test 3 - Lead Instagram (quiere reservar):

```json
{
  "channel": "instagram",
  "name": "insta_user",
  "email": "test@instagram.com",
  "message": "Vi sus fotos, quiero reservar!"
}
```

**Esperado:** intent=booking, score=50, status=HOT, event=lead_created

---

#### Test 4 - Lead Web (info general):

```json
{
  "channel": "web",
  "name": "Web Visitor",
  "email": "visitor@test.com",
  "phone": "+62899999999",
  "message": "Información sobre sus villas"
}
```

**Esperado:** intent=info, score=10, status=NEW, event=lead_created

---

## WORKFLOW RELACIONADO (NO MODIFICAR)

| Campo | Valor |
|-------|-------|
| Nombre | WhatsApp AI Concierge |
| ID | `ln2myAS3406D6F8W` |
| Función | Responde mensajes de WhatsApp con AI (Ayu) |
| Estado | ACTIVO |

⚠️ Este workflow se debe LLAMAR desde WF-SP-01, NO modificar.

---

## INSTRUCCIONES PARA CLAUDE

1. Primero obtén el workflow WF-SP-01 (ID: `lpRxkDSlXduhdpc1`) para ver su estado actual
2. Modifica agregando los nodos pendientes en orden (Tarea 1, 2, 3)
3. Después de cada modificación, muéstrame el flujo actualizado
4. Al final, ejecuta todas las pruebas (Tarea 4) y muéstrame resultados
5. Verifica que los datos se guardan correctamente en Supabase (leads y lead_events)

---

## RESUMEN VISUAL DEL FLUJO FINAL ESPERADO

```
                                    ┌─────────────────────────────────────┐
                                    │         WEBHOOK INBOUND             │
                                    │     /webhook/inbound-lead-v2        │
                                    └──────────────┬──────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────────────┐
                                    │         1. NORMALIZAR               │
                                    │   channel, phone, name, email, msg  │
                                    └──────────────┬──────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────────────┐
                                    │         2. BUSCAR LEAD              │
                                    │    find_lead_by_contact (RPC)       │
                                    └──────────────┬──────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────────────┐
                                    │           3. MERGE                  │
                                    │     combina datos normalizados      │
                                    └──────────────┬──────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────────────┐
                                    │    🆕 3.5 CLASIFICAR INTENCIÓN      │
                                    │   OpenAI → info/price/avail/book   │
                                    └──────────────┬──────────────────────┘
                                                   │
                                                   ▼
                                    ┌─────────────────────────────────────┐
                                    │          4. SWITCH                  │
                                    │      ¿Lead nuevo o existente?       │
                                    └───────┬─────────────────┬───────────┘
                                            │                 │
                              ┌─────────────▼───┐       ┌─────▼─────────────┐
                              │   5a. INSERT    │       │   5b. UPDATE      │
                              │   (nuevo lead)  │       │ (lead existente)  │
                              └────────┬────────┘       └────────┬──────────┘
                                       │                         │
                                       ▼                         ▼
                              ┌─────────────────┐       ┌─────────────────────┐
                              │ 🆕 6a. LOG      │       │ 🆕 6b. LOG          │
                              │ lead_created    │       │ message_received    │
                              └────────┬────────┘       └────────┬────────────┘
                                       │                         │
                                       └────────────┬────────────┘
                                                    │
                                                    ▼
                                    ┌─────────────────────────────────────┐
                                    │    🆕 7. SWITCH CHANNEL             │
                                    │      ¿Es WhatsApp?                  │
                                    └───────┬─────────────────┬───────────┘
                                            │ SÍ              │ NO
                                            ▼                 ▼
                              ┌─────────────────────┐   ┌─────────────────┐
                              │ 🆕 8. TRIGGER       │   │   9. RESPOND    │
                              │ WhatsApp Concierge  │   │   JSON success  │
                              └─────────┬───────────┘   └────────┬────────┘
                                        │                        │
                                        └────────────┬───────────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │    FIN      │
                                              └─────────────┘
```

---

## ¿EMPEZAMOS?

Copia este documento completo y pégalo en una nueva sesión de Claude.
