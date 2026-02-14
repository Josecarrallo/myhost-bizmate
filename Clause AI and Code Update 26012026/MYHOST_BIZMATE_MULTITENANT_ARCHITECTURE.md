# MY HOST BizMate - ARQUITECTURA MULTI-TENANT WHATSAPP
## Diseño Escalable: 2 → 40+ Números

**Fecha:** 26 Enero 2026
**Versión:** 1.0
**Autor:** Claude AI + Jose Carrallo

---

## 📊 RESUMEN EJECUTIVO

### Contexto Meta
- **Límite actual:** 2 números por WABA
- **Target realista:** 20 números (crece automáticamente con calidad)
- **Diseño preparado para:** 40+ números

### Principio Fundamental
```
1 WhatsApp Number = 1 Owner (Tenant) = 1+ Properties
```

---

## 🏗️ MODELO DE DATOS

### Diagrama Entidad-Relación

```
┌─────────────────┐
│     users       │
│   (owners)      │
│─────────────────│
│ id (tenant_id)  │◄──────────────────────────┐
│ full_name       │                            │
│ email           │                            │
│ phone           │                            │
└────────┬────────┘                            │
         │                                     │
         │ 1:N                                 │
         ▼                                     │
┌─────────────────┐                            │
│ whatsapp_numbers│                            │
│─────────────────│                            │
│ id              │◄─────────────────────┐     │
│ tenant_id       │──────────────────────┼─────┘
│ phone_number    │                      │
│ phone_number_id │ ◄── CLAVE ROUTING    │
│ waba_id         │                      │
│ chakra_plugin_id│                      │
│ bot_config      │                      │
│ status          │                      │
│ quality_rating  │                      │
└────────┬────────┘                      │
         │                               │
         │ 1:N                           │
         ▼                               │
┌─────────────────┐                      │
│   properties    │                      │
│─────────────────│                      │
│ id              │                      │
│ owner_id        │──► users             │
│ whatsapp_number │──────────────────────┘
│ name            │
│ ...             │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐    ┌───────────────────────┐
│    bookings     │    │ whatsapp_conversations│
│─────────────────│    │───────────────────────│
│ id              │    │ id                    │
│ property_id     │    │ whatsapp_number_id    │◄── ROUTING
│ tenant_id       │    │ tenant_id             │
│ ...             │    │ contact_phone         │
└─────────────────┘    │ message_direction     │
                       │ message_text          │
┌─────────────────┐    │ banyu_confidence      │
│     leads       │    │ conversation_stage    │
│─────────────────│    │ ...                   │
│ id              │    └───────────────────────┘
│ tenant_id       │
│ whatsapp_number │
│ property_id     │
│ ...             │
└─────────────────┘
```

---

## 📋 TABLAS CREADAS

### 1. whatsapp_numbers (CENTRAL)
```sql
whatsapp_numbers
├── id UUID (PK)
├── tenant_id UUID (FK → users) -- El owner
├── phone_number VARCHAR(20)     -- "+6281325764867"
├── phone_number_id VARCHAR(50)  -- "944855278702577" ◄── CLAVE ROUTING
├── waba_id VARCHAR(50)          -- "819469717463709"
├── display_name VARCHAR(100)    -- "Izumi Hotel"
├── chakra_plugin_id VARCHAR(100)
├── bot_config JSONB             -- Config de BANYU
├── status VARCHAR(20)           -- active/inactive/suspended
├── quality_rating VARCHAR(20)   -- GREEN/YELLOW/RED
├── messaging_limit VARCHAR(20)  -- TIER_1K, TIER_10K, etc.
├── messages_sent_today INTEGER
├── messages_sent_month INTEGER
├── coexistence_enabled BOOLEAN
└── timestamps
```

### 2. whatsapp_conversations (TRACKING)
```sql
whatsapp_conversations
├── id UUID (PK)
├── whatsapp_number_id UUID (FK) ◄── CRITICAL
├── tenant_id UUID (FK)
├── property_id UUID (FK)
├── contact_phone VARCHAR(50)
├── contact_name VARCHAR(255)
├── lead_id UUID (FK)
├── booking_id UUID (FK)
├── message_direction VARCHAR(10)
├── message_text TEXT
├── message_type VARCHAR(20)
├── conversation_stage VARCHAR(50)
├── handled_by VARCHAR(20)       -- BANYU/human/system
├── banyu_intent VARCHAR(50)
├── banyu_confidence DECIMAL
├── requires_human_review BOOLEAN
├── wa_message_id VARCHAR(255)
├── wa_status VARCHAR(20)
└── timestamps
```

### 3. autopilot_alerts
```sql
autopilot_alerts
├── id UUID (PK)
├── tenant_id UUID (FK)
├── property_id UUID (FK)
├── whatsapp_number_id UUID (FK)
├── alert_type VARCHAR(20)       -- urgent/warning/info
├── title VARCHAR(255)
├── message TEXT
├── source VARCHAR(100)          -- WF-D2, BANYU, etc.
├── related_type VARCHAR(50)
├── related_id UUID
├── is_resolved BOOLEAN
└── timestamps
```

---

## 🔀 FLUJO DE WEBHOOK (ROUTING)

### Cuando llega un mensaje de WhatsApp:

```
┌───────────────────────────────────────────────────────────────────┐
│                     CHAKRA WEBHOOK                                 │
│  POST /webhook/whatsapp-inbound                                   │
│  Body: { phone_number_id: "944855278702577", from: "+628...", ...}│
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│               n8n: WEBHOOK RECEIVER                                │
│  1. Extraer phone_number_id del payload                           │
│  2. Llamar RPC: get_tenant_by_phone_number_id(phone_number_id)    │
│  3. Obtener: tenant_id, whatsapp_number_id, bot_config, property  │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│               BANYU WORKFLOW (específico del tenant)               │
│  - Usar bot_config del tenant para personalización                │
│  - Guardar conversación con whatsapp_number_id                    │
│  - Routing de respuestas al número correcto                       │
└───────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────┐
│               ENVIAR RESPUESTA                                     │
│  POST Chakra API usando chakra_plugin_id del tenant               │
│  El mensaje sale del número correcto                              │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔧 FUNCIONES RPC

### 1. get_tenant_by_phone_number_id(phone_number_id)
**Propósito:** Routing de webhooks
**Input:** `"944855278702577"` (de Meta)
**Output:**
```json
{
  "tenant_id": "c24393db-...",
  "whatsapp_number_id": "8e5a6c72-...",
  "phone_number": "+6281325764867",
  "display_name": "Izumi Hotel",
  "bot_config": {...},
  "chakra_plugin_id": "2e45a0bd-...",
  "property_id": "18711359-...",
  "property_name": "Izumi Hotel"
}
```

### 2. log_whatsapp_message(...)
**Propósito:** Guardar mensaje de conversación
**Actualiza:** Métricas del número (messages_sent_today, etc.)

### 3. get_contact_conversation(whatsapp_number_id, contact_phone)
**Propósito:** Obtener historial de conversación para contexto AI

### 4. create_autopilot_alert(...)
**Propósito:** Crear alertas para dashboard

### 5. get_whatsapp_number_stats(whatsapp_number_id)
**Propósito:** Estadísticas para dashboard

---

## 📱 DATOS ACTUALES

### Izumi Hotel (Piloto)
```
Tenant ID:         c24393db-d318-4d75-8bbf-0fa240b9c1db
WhatsApp Number ID: 8e5a6c72-b319-4c66-b39b-717de11a74c9
Phone Number:       +6281325764867 (BANYU)
Phone Number ID:    944855278702577 (Meta)
WABA ID:           819469717463709
Chakra Plugin:      2e45a0bd-8600-41b4-ac92-599d59d6221c
Properties Linked:  14 villas
Status:            ACTIVE
```

---

## 🚀 CÓMO AÑADIR UN NUEVO CLIENTE

### Paso 1: Añadir número a Chakra/Meta
1. En ChakraHQ, añadir el número del nuevo cliente
2. Obtener: `phone_number_id`, verificar `waba_id`

### Paso 2: Crear registro en Supabase
```sql
INSERT INTO whatsapp_numbers (
    tenant_id,           -- El user.id del nuevo owner
    phone_number,        -- "+628123456789"
    phone_number_id,     -- Del paso 1
    waba_id,             -- "819469717463709" (compartido)
    display_name,        -- "Villa ABC"
    chakra_plugin_id,    -- Del dashboard Chakra
    status
) VALUES (...);
```

### Paso 3: Vincular properties
```sql
UPDATE properties
SET whatsapp_number_id = 'nuevo-uuid'
WHERE owner_id = 'tenant-id-nuevo';
```

### Paso 4: Configurar bot
- El `bot_config` en la tabla permite personalizar BANYU por cliente
- Idioma, tono, horarios, keywords de handoff humano

### Resultado
- El webhook ya rutea automáticamente al nuevo cliente
- BANYU responde con la configuración específica
- Dashboard muestra datos separados por tenant

---

## ⚙️ MODIFICACIONES n8n NECESARIAS

### BANYU WhatsApp Concierge (NJR1Omi4BqKA9f1P)

**Cambio principal:** Añadir nodo de routing al inicio

```
WEBHOOK ENTRADA
      │
      ▼
┌─────────────────────────────┐
│ HTTP Request (NUEVO)        │
│ POST Supabase RPC:          │
│ get_tenant_by_phone_number_id│
│ Body: phone_number_id       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Set Variables (NUEVO)       │
│ tenant_id = response.tenant │
│ wa_number_id = response.id  │
│ bot_config = response.config│
│ chakra_plugin = response... │
└──────────────┬──────────────┘
               │
               ▼
        [RESTO DEL WORKFLOW]
        (usa variables dinámicas)
```

### Guardar mensajes
```javascript
// Antes: hardcodeado
{
  "tenant_id": "c24393db-..."  // ❌ FIJO
}

// Después: dinámico
{
  "tenant_id": "{{ $('Routing').item.json.tenant_id }}",  // ✅ DINÁMICO
  "whatsapp_number_id": "{{ $('Routing').item.json.whatsapp_number_id }}"
}
```

### Enviar respuestas
```javascript
// Antes: URL fija
"https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-.../..."  // ❌

// Después: dinámica
"https://api.chakrahq.com/v1/ext/plugin/whatsapp/{{ $('Routing').item.json.chakra_plugin_id }}/..."  // ✅
```

---

## 📊 MÉTRICAS DE CALIDAD META

### Para mantener/aumentar límite de números:

| Métrica | Target | Cómo lograr |
|---------|--------|-------------|
| Quality Rating | GREEN | Respuestas relevantes, no spam |
| Delivery Rate | >95% | Números válidos |
| Read Rate | >70% | Mensajes valiosos |
| Block Rate | <1% | No molestar a usuarios |

### Monitoreo automático
- `messages_sent_today` → Limitar si necesario
- `messages_sent_month` → Alertar si cerca de límite
- `quality_rating` → Alertar si cambia a YELLOW/RED

---

## 🛡️ SEGURIDAD MULTI-TENANT

### RLS (Row Level Security)
Todas las tablas tienen RLS habilitado:
```sql
-- El usuario solo ve sus propios datos
USING (tenant_id = auth.uid())
```

### Aislamiento de datos
- Cada tenant solo ve sus conversaciones
- Cada tenant solo ve sus leads/bookings
- No hay cross-tenant data leaks

### API Keys
- `chakra_api_token` puede almacenarse encriptado
- Cada tenant podría tener su propio token (futuro)

---

## 📅 ROADMAP DE ESCALAMIENTO

### Fase 1: Piloto (Actual - 2 números)
- [x] Izumi Hotel configurado
- [ ] Probar routing completo
- [ ] Validar tracking de conversaciones

### Fase 2: Primeros clientes (5 números)
- [ ] Onboard 3-4 clientes piloto
- [ ] Validar aislamiento multi-tenant
- [ ] Ajustar bot_config por cliente

### Fase 3: Expansión (10-20 números)
- [ ] Dashboard de administración multi-tenant
- [ ] Self-service para nuevos clientes
- [ ] Métricas consolidadas

### Fase 4: Escala (20+ números)
- [ ] Evaluar múltiples WABAs si necesario
- [ ] Sharding por región (opcional)
- [ ] SLA por tier de cliente

---

## ✅ CHECKLIST IMPLEMENTACIÓN

### Supabase (COMPLETADO)
- [x] Tabla `whatsapp_numbers`
- [x] Tabla `whatsapp_conversations`
- [x] Tabla `autopilot_alerts`
- [x] Columnas `whatsapp_number_id` en tablas existentes
- [x] Función `get_tenant_by_phone_number_id`
- [x] Función `log_whatsapp_message`
- [x] Función `create_autopilot_alert`
- [x] Registro Izumi Hotel

### n8n (PENDIENTE)
- [ ] Modificar BANYU para routing dinámico
- [ ] Añadir nodo de lookup tenant
- [ ] Usar variables dinámicas para Chakra API
- [ ] Guardar conversaciones con whatsapp_number_id

### Frontend (PENDIENTE - Claude Code)
- [ ] Leer conversaciones de `whatsapp_conversations`
- [ ] Leer alertas de `autopilot_alerts`
- [ ] Mostrar estadísticas por número

---

**Documento generado:** 26 Enero 2026
**Próxima acción:** Modificar BANYU workflow para routing dinámico
