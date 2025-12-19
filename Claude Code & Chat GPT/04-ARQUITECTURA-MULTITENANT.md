# MY HOST BizMate - Arquitectura Multi-tenant
## Diseño escalable para 100+ clientes

---

## 1. VISIÓN GENERAL

### Problema
Crear un workflow separado por cada cliente no escala:
- 100 clientes = 100 workflows = caos de mantenimiento
- Actualizaciones manuales en cada uno
- Difícil de monitorear

### Solución
Un único workflow multi-tenant que detecta el cliente automáticamente:
- 1 workflow para N clientes
- Configuración dinámica por tenant
- Fácil de mantener y actualizar

---

## 2. ARQUITECTURA PROPUESTA

```
                    ┌─────────────────────────────────────┐
                    │         WEBHOOK ÚNICO               │
                    │   /webhook/whatsapp-multi-tenant    │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │      IDENTIFICAR TENANT             │
                    │   (por phone_number_id o label)     │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │      CARGAR CONFIG TENANT           │
                    │   (desde tabla tenants)             │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │         AI AGENT                    │
                    │   (prompt dinámico por tenant)      │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │      RESPONDER VÍA CHAKRAHQ         │
                    │   (usando config del tenant)        │
                    └─────────────────────────────────────┘
```

---

## 3. ESTRUCTURA DE BASE DE DATOS

### Tabla: tenants

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- WhatsApp Config
  whatsapp_number VARCHAR(20) NOT NULL,
  whatsapp_phone_id VARCHAR(50),
  chakra_label VARCHAR(100),
  
  -- Property Reference
  property_id UUID REFERENCES properties(id),
  
  -- AI Config
  ai_prompt TEXT,
  ai_model VARCHAR(50) DEFAULT 'gpt-4.1-mini',
  ai_temperature DECIMAL(2,1) DEFAULT 0.7,
  
  -- Business Config
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  language VARCHAR(10) DEFAULT 'en',
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Subscription
  plan VARCHAR(20) DEFAULT 'starter',
  status VARCHAR(20) DEFAULT 'active',
  monthly_messages_limit INT DEFAULT 500,
  messages_used_this_month INT DEFAULT 0,
  
  -- Contact
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  owner_phone VARCHAR(20),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  trial_ends_at TIMESTAMP,
  
  -- Indexes
  CONSTRAINT unique_whatsapp UNIQUE (whatsapp_number)
);

-- Índice para búsqueda rápida
CREATE INDEX idx_tenants_whatsapp ON tenants(whatsapp_number);
CREATE INDEX idx_tenants_phone_id ON tenants(whatsapp_phone_id);
```

---

## 4. WORKFLOW MULTI-TENANT EN N8N

### Nodo 1: Webhook
```
Path: /webhook/whatsapp-multi-tenant
Method: POST
```

### Nodo 2: Identificar Tenant (Code Node)
```javascript
// Extraer phone_number_id del webhook de ChakraHQ
const phoneNumberId = $json.body.entry[0].changes[0].value.metadata.phone_number_id;
const fromNumber = $json.body.entry[0].changes[0].value.messages[0].from;

return {
  phone_number_id: phoneNumberId,
  from_number: fromNumber,
  message: $json.body.entry[0].changes[0].value.messages[0]
};
```

### Nodo 3: Cargar Tenant (Supabase)
```
Operation: Get
Table: tenants
Filter: whatsapp_phone_id = {{ $json.phone_number_id }}
```

### Nodo 4: Verificar Tenant Existe (IF)
```
Condition: {{ $json.id }} is not empty
True → Continuar
False → Responder "Tenant no configurado"
```

### Nodo 5: Cargar Property Info (Supabase)
```
Operation: Get
Table: properties
Filter: id = {{ $json.property_id }}
```

### Nodo 6: AI Agent
```
Model: {{ $('Cargar Tenant').item.json.ai_model }}
Temperature: {{ $('Cargar Tenant').item.json.ai_temperature }}
System Prompt: {{ $('Cargar Tenant').item.json.ai_prompt }}
```

### Nodo 7: Responder WhatsApp (HTTP Request)
```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $('Identificar Tenant').item.json.from_number }}",
  "type": "text",
  "text": {
    "body": "{{ $json.response }}"
  }
}
```

---

## 5. MIGRACIÓN DE IZUMI AL SISTEMA MULTI-TENANT

### Paso 1: Crear registro en tenants
```sql
INSERT INTO tenants (
  name,
  slug,
  whatsapp_number,
  whatsapp_phone_id,
  chakra_label,
  property_id,
  ai_prompt,
  owner_name,
  owner_email,
  owner_phone,
  plan,
  status
) VALUES (
  'Izumi Hotel',
  'izumi-hotel',
  '+6281325764867',
  '944855278702577',
  'Izumi',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'You are the AI assistant for Izumi Hotel in Ubud, Bali...',
  'José',
  'jose@myhostbizmate.com',
  '+34619794604',
  'starter',
  'active'
);
```

### Paso 2: Actualizar tablas relacionadas
```sql
-- Añadir tenant_id a bookings
ALTER TABLE bookings ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Actualizar bookings existentes de Izumi
UPDATE bookings 
SET tenant_id = (SELECT id FROM tenants WHERE slug = 'izumi-hotel')
WHERE property_id = '18711359-1378-4d12-9ea6-fb31c0b1bac2';
```

### Paso 3: Crear workflow multi-tenant
- Duplicar workflow actual
- Modificar para usar configuración dinámica
- Probar con Izumi
- Desactivar workflow antiguo

---

## 6. CHAKRAHQ - GESTIÓN DE LABELS

### Estructura de labels
```
MY HOST BizMate (cuenta principal)
├── Izumi Hotel
├── Villa Sunset
├── Bali Dreams Resort
├── Paradise Inn
└── ... (hasta 100+)
```

### Filtrado en Inbox
- Cada operador ve solo sus labels asignados
- Admin ve todos
- Filtros rápidos por cliente

---

## 7. VENTAJAS DEL DISEÑO

| Aspecto | Antes (1 workflow/cliente) | Después (multi-tenant) |
|---------|---------------------------|------------------------|
| Workflows | 100 | 1 |
| Mantenimiento | 100 actualizaciones | 1 actualización |
| Onboarding | Duplicar workflow | INSERT en DB |
| Monitoreo | Revisar 100 logs | 1 log centralizado |
| Escalabilidad | Limitada | Ilimitada |

---

## 8. CONSIDERACIONES DE SEGURIDAD

### Aislamiento de datos
- Cada query incluye `WHERE tenant_id = X`
- Row Level Security (RLS) en Supabase
- Tokens separados si es necesario

### RLS Policy ejemplo
```sql
-- Solo ver bookings del propio tenant
CREATE POLICY tenant_isolation ON bookings
  FOR ALL
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

---

## 9. ROADMAP DE IMPLEMENTACIÓN

| Fase | Tarea | Duración |
|------|-------|----------|
| 1 | Crear tabla tenants | 1 hora |
| 2 | Migrar Izumi a tenant | 1 hora |
| 3 | Crear workflow multi-tenant | 4 horas |
| 4 | Probar con Izumi | 2 horas |
| 5 | Documentar proceso onboarding | 2 horas |
| **Total** | | **10 horas** |

---

**Última actualización:** 13 Diciembre 2025
