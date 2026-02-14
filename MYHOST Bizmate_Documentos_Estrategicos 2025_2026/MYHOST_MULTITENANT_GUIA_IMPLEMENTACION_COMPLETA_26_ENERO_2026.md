# MY HOST BizMate - GUÍA COMPLETA MULTI-TENANT
## Para implementar cuando Meta aumente el límite de números

**Fecha de creación:** 26 Enero 2026  
**Estado:** DOCUMENTADO - Pendiente de implementar  
**Requisito:** Meta debe aumentar límite de números (actualmente 2)

---

## 📋 ÍNDICE

1. [Contexto y Problema](#1-contexto-y-problema)
2. [Lo que YA está creado en Supabase](#2-lo-que-ya-está-creado-en-supabase)
3. [Cambios necesarios en BANYU](#3-cambios-necesarios-en-banyu)
4. [Cambios necesarios en KORA](#4-cambios-necesarios-en-kora)
5. [Cómo añadir un nuevo cliente](#5-cómo-añadir-un-nuevo-cliente)
6. [Checklist de implementación](#6-checklist-de-implementación)

---

## 1. CONTEXTO Y PROBLEMA

### 1.1 Situación Actual (Enero 2026)
- **Límite Meta:** 2 números por WABA
- **Números activos:** 1 (BANYU para Izumi Hotel)
- **Todo hardcodeado:** Los IDs de Izumi están escritos directamente en los workflows

### 1.2 Situación Futura (Cuando Meta aumente límite)
- Cada hotel/villa tendrá su propio número de WhatsApp
- Cada hotel/villa tendrá su propio número de teléfono para KORA
- BANYU y KORA deben saber automáticamente a qué hotel pertenece cada mensaje/llamada

### 1.3 El Principio Fundamental
```
1 Número de Teléfono = 1 Owner (Tenant) = 1+ Properties
```

### 1.4 Cómo funciona el routing
```
WEBHOOK llega con phone_number_id
         │
         ▼
Supabase: "¿De quién es este número?"
         │
         ▼
Respuesta: tenant_id, property_id, bot_config, etc.
         │
         ▼
BANYU/KORA responde con la configuración correcta
```

---

## 2. LO QUE YA ESTÁ CREADO EN SUPABASE

### 2.1 Tabla: whatsapp_numbers ✅ CREADA

```sql
-- Esta tabla YA EXISTE en Supabase
-- Es la "agenda telefónica" central

SELECT * FROM whatsapp_numbers;

-- Columnas principales:
-- id                  UUID (PK)
-- tenant_id           UUID → users.id (el owner)
-- phone_number        VARCHAR(20) → "+6281325764867"
-- phone_number_id     VARCHAR(50) → "944855278702577" ◄── CLAVE ROUTING
-- waba_id             VARCHAR(50) → "819469717463709"
-- display_name        VARCHAR(100) → "Izumi Hotel"
-- chakra_plugin_id    VARCHAR(100) → Para enviar mensajes
-- bot_config          JSONB → Configuración de BANYU
-- status              VARCHAR(20) → active/inactive
-- quality_rating      VARCHAR(20) → GREEN/YELLOW/RED
```

### 2.2 Tabla: whatsapp_conversations ✅ CREADA

```sql
-- Tracking completo de mensajes BANYU
-- Cada mensaje está vinculado a un whatsapp_number_id

SELECT * FROM whatsapp_conversations;

-- Columnas principales:
-- id                   UUID (PK)
-- whatsapp_number_id   UUID → whatsapp_numbers.id ◄── ROUTING
-- tenant_id            UUID
-- contact_phone        VARCHAR(50) → Número del guest
-- message_direction    VARCHAR(10) → inbound/outbound
-- message_text         TEXT
-- handled_by           VARCHAR(20) → BANYU/human
-- banyu_confidence     DECIMAL → 0.00-1.00
-- conversation_stage   VARCHAR(50) → inquiry/booking/confirmed/etc.
```

### 2.3 Tabla: autopilot_alerts ✅ CREADA

```sql
-- Alertas para el dashboard AUTOPILOT
SELECT * FROM autopilot_alerts;
```

### 2.4 Columnas añadidas a tablas existentes ✅

```sql
-- properties.whatsapp_number_id → Vincula property con número
-- leads.whatsapp_number_id → De qué número vino el lead
-- whatsapp_messages.whatsapp_number_id → A qué número pertenece
-- bookings.tenant_id → Para multi-tenant
```

### 2.5 Funciones RPC ✅ CREADAS

#### get_tenant_by_phone_number_id (CRÍTICA PARA ROUTING)
```sql
-- Llamar así desde n8n:
POST https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_tenant_by_phone_number_id
Body: { "p_phone_number_id": "944855278702577" }

-- Respuesta:
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "whatsapp_number_id": "8e5a6c72-b319-4c66-b39b-717de11a74c9",
  "phone_number": "+6281325764867",
  "display_name": "Izumi Hotel",
  "bot_config": { "language": "en", "brand_tone": "luxury", ... },
  "chakra_plugin_id": "2e45a0bd-8600-41b4-ac92-599d59d6221c",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "property_name": "Izumi Hotel"
}
```

#### log_whatsapp_message
```sql
-- Para guardar mensajes en whatsapp_conversations
POST .../rpc/log_whatsapp_message
Body: {
  "p_whatsapp_number_id": "uuid",
  "p_contact_phone": "+628123456789",
  "p_message_direction": "inbound",
  "p_message_text": "Hello...",
  ...
}
```

#### create_autopilot_alert
```sql
-- Para crear alertas en el dashboard
POST .../rpc/create_autopilot_alert
Body: {
  "p_tenant_id": "uuid",
  "p_alert_type": "urgent",
  "p_title": "Payment expiring",
  "p_message": "3 bookings with payment expiring",
  ...
}
```

### 2.6 Registro de Izumi Hotel ✅ INSERTADO

```sql
-- Ya existe en whatsapp_numbers:
whatsapp_number_id: 8e5a6c72-b319-4c66-b39b-717de11a74c9
tenant_id:          c24393db-d318-4d75-8bbf-0fa240b9c1db
phone_number:       +6281325764867
phone_number_id:    944855278702577
display_name:       Izumi Hotel
chakra_plugin_id:   2e45a0bd-8600-41b4-ac92-599d59d6221c

-- Las 14 properties de Izumi están vinculadas
```

---

## 3. CAMBIOS NECESARIOS EN BANYU

### 3.1 Workflow actual
**ID:** NJR1Omi4BqKA9f1P  
**Nombre:** BANYU - Johnson Contract v1 - WhatsApp AI Concierge

### 3.2 Flujo ACTUAL (hardcodeado)
```
Webhook → Filter → Extract Text → AI Agent → Send WhatsApp → ...
                                     ↓
                          Todo con IDs de Izumi fijos
```

### 3.3 Flujo NUEVO (multi-tenant)
```
Webhook → 🆕 LOOKUP TENANT → Filter → Extract Text → AI Agent → Send WhatsApp → ...
              ↓
         Obtiene tenant_id, property_id, 
         chakra_plugin_id, bot_config
              ↓
         Todos los nodos usan variables
```

### 3.4 NODO NUEVO A AÑADIR: "Lookup Tenant"

**Tipo:** HTTP Request  
**Posición:** Después de Webhook, antes de Filter

```json
{
  "name": "Lookup Tenant",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/rpc/get_tenant_by_phone_number_id",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "apikey",
          "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0"
        },
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ { \"p_phone_number_id\": $json.body.entry[0].changes[0].value.metadata.phone_number_id } }}"
  }
}
```

### 3.5 CAMBIOS EN NODOS EXISTENTES

#### 3.5.1 AI Agent - System Prompt

**ANTES (línea 1):**
```
You are BANYU, the WhatsApp Concierge at Izumi Hotel, a luxury 5-star boutique hotel in Ubud, Bali.
```

**DESPUÉS:**
```
You are BANYU, the WhatsApp Concierge at {{ $('Lookup Tenant').item.json.display_name }}, a luxury boutique hotel.
```

**O mejor, usar bot_config:**
```
={{ $('Lookup Tenant').item.json.bot_config.system_prompt }}
```

#### 3.5.2 Check Availability

**ANTES:**
```json
"p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
```

**DESPUÉS:**
```json
"p_property_id": "{{ $('Lookup Tenant').item.json.property_id }}"
```

#### 3.5.3 Calculate Price

**ANTES:**
```json
"p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
```

**DESPUÉS:**
```json
"p_property_id": "{{ $('Lookup Tenant').item.json.property_id }}"
```

#### 3.5.4 Create Booking

**ANTES:**
```json
"property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
```

**DESPUÉS:**
```json
"property_id": "{{ $('Lookup Tenant').item.json.property_id }}"
```

#### 3.5.5 Send WhatsApp - URL

**ANTES:**
```
https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages
```

**DESPUÉS:**
```
https://api.chakrahq.com/v1/ext/plugin/whatsapp/{{ $('Lookup Tenant').item.json.chakra_plugin_id }}/api/v19.0/{{ $json.body.entry[0].changes[0].value.metadata.phone_number_id }}/messages
```

#### 3.5.6 Build Johnson Contract

**ANTES:**
```javascript
tenant: {
  slug: "izumi-hotel",
  tenant_id: "c24393db-d318-4d75-8bbf-0fa240b9c1db"
},
property: {
  property_id: "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  property_name: "Izumi Hotel",
}
```

**DESPUÉS:**
```javascript
// Obtener datos del lookup
const lookup = $('Lookup Tenant').item.json;

tenant: {
  slug: lookup.display_name.toLowerCase().replace(/ /g, '-'),
  tenant_id: lookup.tenant_id
},
property: {
  property_id: lookup.property_id,
  property_name: lookup.property_name,
}
```

---

## 4. CAMBIOS NECESARIOS EN KORA

### 4.1 Workflow actual
**ID:** gsMMQrc9T2uZ7LVA  
**Nombre:** WF-02 KORA-POST-CALL

### 4.2 El problema con KORA

KORA recibe datos de VAPI. El routing depende de cómo VAPI identifica al tenant.

**Opciones:**
1. **Por número de teléfono:** Cada hotel tiene su número → Lookup similar a BANYU
2. **Por assistant_id de VAPI:** Cada hotel tiene su asistente configurado
3. **VAPI envía tenant_id:** Configurar en VAPI el tenant_id como variable

### 4.3 Solución recomendada: Por número de teléfono

Añadir a la tabla `whatsapp_numbers` soporte para números de voz:

```sql
-- Añadir columna para tipo de número
ALTER TABLE whatsapp_numbers 
ADD COLUMN number_type VARCHAR(20) DEFAULT 'whatsapp' 
CHECK (number_type IN ('whatsapp', 'voice', 'both'));

-- O crear tabla separada phone_numbers (más limpio)
CREATE TABLE phone_numbers (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES users(id),
  phone_number VARCHAR(20),
  number_type VARCHAR(20), -- 'whatsapp' o 'voice'
  -- resto de config...
);
```

### 4.4 Cambios en KORA workflow

#### Añadir nodo "Lookup Tenant"

```javascript
// En el nodo Extract Structured Output, obtener el número que llamó
const callerNumber = call.customer?.number;
const assistantPhoneNumber = call.phoneNumber?.number; // El número del asistente

// Luego hacer lookup por assistantPhoneNumber
```

#### Modificar Build Johnson Contract

**ANTES:**
```javascript
tenant: {
  slug: "izumi-hotel",
  tenant_id: cr.tenantId || "c24393db-d318-4d75-8bbf-0fa240b9c1db"
},
property: {
  property_id: "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  property_name: "Izumi Hotel",
}
```

**DESPUÉS:**
```javascript
// lookup = resultado del Lookup Tenant
tenant: {
  slug: lookup.display_name.toLowerCase().replace(/ /g, '-'),
  tenant_id: lookup.tenant_id
},
property: {
  property_id: lookup.property_id,
  property_name: lookup.property_name,
}
```

---

## 5. CÓMO AÑADIR UN NUEVO CLIENTE

### 5.1 Prerequisitos
- [ ] Meta ha aumentado el límite de números
- [ ] El nuevo cliente tiene un número de WhatsApp Business
- [ ] El número está añadido en ChakraHQ

### 5.2 Paso 1: Crear el usuario (owner) en Supabase

```sql
INSERT INTO users (id, full_name, email, phone, role)
VALUES (
  gen_random_uuid(),
  'Nombre del Owner',
  'owner@email.com',
  '+628XXXXXXXX',
  'owner'
)
RETURNING id;
-- Guardar este ID como NUEVO_TENANT_ID
```

### 5.3 Paso 2: Crear la property

```sql
INSERT INTO properties (
  id, name, owner_id, base_price, city, country
)
VALUES (
  gen_random_uuid(),
  'Villa Nueva',
  'NUEVO_TENANT_ID',
  300,
  'Ubud',
  'Indonesia'
)
RETURNING id;
-- Guardar este ID como NUEVA_PROPERTY_ID
```

### 5.4 Paso 3: Registrar el número de WhatsApp

```sql
INSERT INTO whatsapp_numbers (
  tenant_id,
  phone_number,
  phone_number_id,      -- Obtener de Meta/ChakraHQ
  waba_id,              -- El mismo WABA compartido
  display_name,
  chakra_plugin_id,     -- Obtener de ChakraHQ
  bot_config,
  status
)
VALUES (
  'NUEVO_TENANT_ID',
  '+628XXXXXXXX',
  'PHONE_NUMBER_ID_DE_META',
  '819469717463709',    -- WABA compartido
  'Villa Nueva',
  'CHAKRA_PLUGIN_ID',
  '{
    "enabled": true,
    "bot_name": "BANYU",
    "language": "en",
    "brand_tone": "luxury",
    "system_prompt": "You are BANYU, the WhatsApp Concierge at Villa Nueva..."
  }',
  'active'
)
RETURNING id;
-- Guardar este ID como WHATSAPP_NUMBER_ID
```

### 5.5 Paso 4: Vincular property con número

```sql
UPDATE properties
SET whatsapp_number_id = 'WHATSAPP_NUMBER_ID'
WHERE id = 'NUEVA_PROPERTY_ID';
```

### 5.6 Paso 5: Verificar

```sql
-- Probar el lookup
SELECT * FROM get_tenant_by_phone_number_id('PHONE_NUMBER_ID_DE_META');

-- Debe devolver los datos del nuevo cliente
```

### 5.7 Paso 6: Probar

1. Enviar un mensaje de WhatsApp al nuevo número
2. Verificar que BANYU responde correctamente
3. Verificar que el mensaje se guarda en `whatsapp_conversations` con el `tenant_id` correcto

---

## 6. CHECKLIST DE IMPLEMENTACIÓN

### 6.1 Cuando Meta aumente el límite:

#### Supabase (YA HECHO ✅)
- [x] Tabla `whatsapp_numbers` creada
- [x] Tabla `whatsapp_conversations` creada
- [x] Función `get_tenant_by_phone_number_id` creada
- [x] Función `log_whatsapp_message` creada
- [x] Izumi Hotel registrado
- [x] Columnas `whatsapp_number_id` añadidas

#### n8n - BANYU (PENDIENTE ⏳)
- [ ] Añadir nodo "Lookup Tenant" después del Webhook
- [ ] Modificar AI Agent system prompt para usar variable
- [ ] Modificar Check Availability para usar `property_id` dinámico
- [ ] Modificar Calculate Price para usar `property_id` dinámico
- [ ] Modificar Create Booking para usar `property_id` dinámico
- [ ] Modificar Send WhatsApp URL para usar `chakra_plugin_id` dinámico
- [ ] Modificar Build Johnson Contract para usar variables
- [ ] Probar con Izumi Hotel (debe seguir funcionando igual)
- [ ] Probar con segundo número (si disponible)

#### n8n - KORA (PENDIENTE ⏳)
- [ ] Decidir método de routing (por número o por assistant_id)
- [ ] Añadir nodo "Lookup Tenant" si es por número
- [ ] Modificar Build Johnson Contract para usar variables
- [ ] Probar

#### Onboarding nuevo cliente
- [ ] Crear usuario en Supabase
- [ ] Crear property
- [ ] Añadir número en ChakraHQ
- [ ] Registrar número en `whatsapp_numbers`
- [ ] Vincular property
- [ ] Probar end-to-end

---

## 📎 ANEXO: IDs DE REFERENCIA

### Izumi Hotel (Piloto)
```
TENANT_ID:           c24393db-d318-4d75-8bbf-0fa240b9c1db
PROPERTY_ID:         18711359-1378-4d12-9ea6-fb31c0b1bac2
WHATSAPP_NUMBER_ID:  8e5a6c72-b319-4c66-b39b-717de11a74c9
PHONE_NUMBER_ID:     944855278702577  (Meta)
PHONE_NUMBER:        +6281325764867
CHAKRA_PLUGIN_ID:    2e45a0bd-8600-41b4-ac92-599d59d6221c
WABA_ID:             819469717463709
```

### Supabase
```
URL:     https://jjpscimtxrudtepzwhag.supabase.co
API_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

### n8n Workflows
```
BANYU:  NJR1Omi4BqKA9f1P
KORA:   gsMMQrc9T2uZ7LVA
```

---

**Documento creado:** 26 Enero 2026  
**Implementar cuando:** Meta aumente límite de números de WhatsApp  
**Contacto:** Jose Carrallo - josecarrallodelafuente@gmail.com
