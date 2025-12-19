# MY HOST BIZMATE - ARQUITECTURA MULTITENANT
## Diseño para Múltiples Propiedades
### Versión 3.0 - 15 Diciembre 2024

---

## ESTADO ACTUAL

Actualmente los workflows tienen el `property_id` hardcodeado:

```json
{
  "p_property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
}
```

Esto requiere duplicar workflows para cada propiedad.

---

## ARQUITECTURA OBJETIVO

### Opción A: Un workflow por propiedad (Actual)
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Workflow    │     │ Workflow    │     │ Workflow    │
│ Hotel A     │     │ Hotel B     │     │ Hotel C     │
└─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │
      └───────────────────┴───────────────────┘
                          │
                    ┌─────────────┐
                    │  Supabase   │
                    └─────────────┘
```

**Pros:** Simple, aislamiento total
**Contras:** Mantenimiento duplicado, no escala

### Opción B: Workflow único con property_id dinámico (Objetivo)
```
                    ┌─────────────┐
                    │  Workflow   │
                    │   Único     │
                    └─────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
  ┌───────────┐     ┌───────────┐     ┌───────────┐
  │ Vapi      │     │ Vapi      │     │ Vapi      │
  │ Hotel A   │     │ Hotel B   │     │ Hotel C   │
  │ (metadata)│     │ (metadata)│     │ (metadata)│
  └───────────┘     └───────────┘     └───────────┘
```

**Pros:** Un solo workflow, fácil mantenimiento
**Contras:** Configuración inicial más compleja

---

## IMPLEMENTACIÓN OPCIÓN B

### 1. Configurar Vapi con metadata

En cada asistente de Vapi, añadir metadata:

```json
{
  "name": "Ayu - Izumi Hotel",
  "metadata": {
    "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "property_name": "Izumi Hotel"
  }
}
```

### 2. Modificar nodo "Keep Session id & Query"

```javascript
{
  "id": "{{ $json.body.message.toolCallList[0].id }}",
  "question": "{{ $json.body.message.toolCallList[0].function.arguments.user_query }}",
  "property_id": "{{ $json.body.message.call.assistant.metadata.property_id }}"
}
```

### 3. Actualizar tools con expresión dinámica

```json
{
  "p_property_id": "{{ $('Keep Session id & Query').item.json.property_id }}",
  "p_check_in": "{{ $fromAI('check_in') }}",
  "p_check_out": "{{ $fromAI('check_out') }}"
}
```

### 4. Para WhatsApp (ChakraHQ)

Opción 1: Un número por propiedad → workflow específico
Opción 2: Router en n8n que detecta número y asigna property_id

```javascript
// Nodo Switch por número de teléfono
{
  "conditions": [
    {
      "phone": "+62813xxxx",
      "property_id": "uuid-hotel-a"
    },
    {
      "phone": "+62814xxxx", 
      "property_id": "uuid-hotel-b"
    }
  ]
}
```

---

## MODELO DE DATOS SUPABASE

### Tabla: properties
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  owner_id UUID REFERENCES auth.users(id),
  whatsapp_number TEXT,
  vapi_assistant_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: property_agents
```sql
CREATE TABLE property_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  agent_type TEXT CHECK (agent_type IN ('whatsapp', 'vapi', 'email')),
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Ejemplo de config por agente
```json
{
  "whatsapp": {
    "phone_number": "+62813xxxx",
    "webhook_path": "/webhook/xxx",
    "system_prompt": "..."
  },
  "vapi": {
    "assistant_id": "xxx",
    "voice": "shimmer"
  }
}
```

---

## MIGRACIÓN

### Fase 1: Preparar estructura
1. Crear tabla `property_agents`
2. Migrar configuraciones actuales
3. Mantener workflows existentes

### Fase 2: Crear workflow unificado
1. Duplicar workflow IX
2. Añadir extracción de property_id
3. Actualizar todos los tools
4. Probar con 2 propiedades

### Fase 3: Migrar propiedades
1. Crear asistentes Vapi con metadata
2. Actualizar webhooks
3. Desactivar workflows antiguos

---

*Última actualización: 15 Diciembre 2024*
