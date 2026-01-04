# MYHOST BizMate - RESUMEN COMPLETO Y PLAN DE ACCIÓN
**Fecha:** 4 Enero 2026  
**Versión:** 3.0

---

## 📊 ESTADO GLOBAL DEL SISTEMA

### Arquitectura Validada
```
┌─────────────────────────────────────────────────────────────┐
│                    MYHOST BizMate                           │
├─────────────────────────────────────────────────────────────┤
│  BANYU.AI (Front-Office)    │    OSIRIS.AI (Back-Office)   │
│  - Ventas & Leads           │    - Operaciones             │
│  - WhatsApp/VAPI            │    - Intelligence            │
│  - Guest Journey            │    - Alertas                 │
├─────────────────────────────────────────────────────────────┤
│                    MCP CENTRAL                              │
│         (Actions Layer - Reutilizable)                      │
├─────────────────────────────────────────────────────────────┤
│  n8n (Railway)  │  Supabase  │  ChakraHQ  │  VAPI/SendGrid │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ LO QUE YA FUNCIONA (NO TOCAR)

### BLOQUE 1: Sales & Lead Management (Parcial)

| Componente | Estado | Workflow ID |
|------------|--------|-------------|
| WhatsApp AI Concierge | ✅ Funciona | `ln2myAS3406D6F8W` |
| VAPI Voice Assistant | ✅ Funciona | `jyvFpkPes5DdoBRE` |
| Webhooks entrada | ✅ Funciona | Varios |

### BLOQUE 2: Guest Journey (Completo)

| Componente | Estado | Workflow ID |
|------------|--------|-------------|
| GuestJourney-Scheduler | ✅ Funciona | `cQLiQnqR2AHkYOjd` |
| 5 Fases automatizadas | ✅ Funciona | - |
| Notify Owner | ✅ Funciona | - |
| Log Journey Events | ✅ Funciona | - |
| Update Journey State | ✅ Funciona | - |

### BLOQUE 3: Owner Intelligence (Parcial)

| Componente | Estado | Workflow ID |
|------------|--------|-------------|
| Owner Daily Intelligence | ✅ Funciona | `aergpRINvoJEyufR` |
| Owner Alerts Engine | ✅ Funciona | - |
| KPI Calculator | ✅ Funciona | - |

### BLOQUE 4: MCP Central (Base)

| Componente | Estado |
|------------|--------|
| send_whatsapp | ✅ Funciona |
| send_email | ✅ Funciona |
| create_booking | ✅ Funciona |
| check_availability | ✅ Funciona |
| logging | ✅ Funciona |

---

## 🔴 LO QUE FALTA COMPLETAR

### WF-SP-01: Inbound Lead Handler
**Prioridad:** 🔴 MÁXIMA  
**Estado:** PARCIALMENTE IMPLEMENTADO (disperso)

#### Qué YA hace:
- ✅ Recibe contactos desde WhatsApp, IG, Email, Web
- ✅ Normaliza mensajes
- ✅ Responde con AI

#### Qué FALTA:
| Tarea | Descripción | Impacto |
|-------|-------------|---------|
| Tabla `leads` | Modelo unificado LEAD/CONTACT | Base del CRM |
| Estados del lead | NEW → ENGAGED → HOT → WON/LOST | Funnel visible |
| Eventos estándar | `lead_created`, `lead_updated` | Integración |
| Detección duplicados | Si existe → update, si no → create | Data limpia |
| Clasificación intención | info/precio/disponibilidad/booking | Lead scoring |

#### Regla clave:
> **Este flujo NO vende, NO responde, NO decide. Solo CAPTURA y CLASIFICA.**

---

### WF-SP-02: AI Self-Assistance
**Prioridad:** 🟡 ALTA  
**Estado:** IMPLEMENTADO Y FUNCIONAL (mejorar)

#### Qué YA hace:
- ✅ Responde 24/7
- ✅ Da precios y disponibilidad
- ✅ Crea bookings
- ✅ Usa memoria básica

#### Qué FALTA:
| Tarea | Descripción | Impacto |
|-------|-------------|---------|
| Contexto comercial | Detectar intención de compra/indecisión | Conversión |
| Estados conversación | INFO → INTEREST → HOT → READY_TO_BOOK | Tracking |
| Emisión eventos | `ai_hot_lead_detected`, `ai_ready_to_book` | Follow-up |
| Derivación inteligente | Si duda/no responde → WF-SP-03 | No perder leads |

#### Regla clave:
> **El AI NO debe spamear. Debe escalar inteligentemente.**

---

### WF-SP-03: Follow-Up Engine
**Prioridad:** 🔴 MÁXIMA  
**Estado:** MUY AVANZADO (estructura hecha)

#### Qué YA hace:
- ✅ Mensajes automáticos
- ✅ Alertas al owner
- ✅ Reglas de seguimiento
- ✅ Lógica temporal

#### Qué FALTA:
| Tarea | Descripción | Impacto |
|-------|-------------|---------|
| Escuchar eventos | `lead_created`, `ai_hot_lead`, `no_response_24h` | Triggers |
| Reglas follow-up | 24h suave → 48h valor → 72h última llamada | Conversión |
| Personalización | Nombre, fechas, tipo habitación | Engagement |
| Estados lead | FOLLOWING_UP → WON/LOST | Métricas |
| Notificar owner | Si lead caliente o alto valor | Intervención |

#### Regla clave:
> **Este flujo NO capta (WF-SP-01), NO responde en tiempo real (WF-SP-02). Este flujo CIERRA.**

---

### WF-SP-04: Guest Journey Builder
**Prioridad:** 🟢 MANTENIMIENTO  
**Estado:** IMPLEMENTADO Y VALIDADO ✅

#### Pendiente menor:
| Tarea | Descripción |
|-------|-------------|
| Guest Response Handler | Procesar "YES" al airport pickup |
| Migración MCP | A futuro, mover acciones a MCP Central |

---

### Owner Intelligence (Expandir)
**Prioridad:** 🟡 MEDIA

#### Qué FALTA:
| Tarea | Descripción |
|-------|-------------|
| Market Intelligence Bali | Competencia, pricing, ocupación |
| Tendencias | Señales macro para decisión |
| Dashboard estratégico | Decisiones asistidas por AI |

---

## 📋 PLAN DE ACCIÓN PRIORIZADO

### FASE 1: Sales Foundation (Semana 1-2)
```
┌────────────────────────────────────────────────┐
│  1. Crear tabla `leads` en Supabase            │
│  2. Implementar WF-SP-01 completo              │
│  3. Conectar webhooks existentes → leads       │
│  4. Emitir eventos lead_created/updated        │
└────────────────────────────────────────────────┘
```

**Entregables:**
- [ ] Tabla `leads` con estados (NEW, ENGAGED, HOT, WON, LOST)
- [ ] Workflow WF-SP-01 en n8n
- [ ] Todos los canales alimentan tabla leads
- [ ] Eventos funcionando

---

### FASE 2: Follow-Up Engine (Semana 2-3)
```
┌────────────────────────────────────────────────┐
│  1. Completar WF-SP-03 Follow-Up Engine        │
│  2. Reglas de seguimiento (24h/48h/72h)        │
│  3. Templates de mensajes personalizados       │
│  4. Conexión con estados de lead               │
└────────────────────────────────────────────────┘
```

**Entregables:**
- [ ] Motor de follow-up automático
- [ ] 3 niveles de seguimiento
- [ ] Actualización automática WON/LOST
- [ ] Notificaciones al owner

---

### FASE 3: AI Self-Assistance Enhanced (Semana 3-4)
```
┌────────────────────────────────────────────────┐
│  1. Mejorar prompt con contexto comercial      │
│  2. Clasificación de intención en tiempo real  │
│  3. Emisión de eventos hacia Follow-Up         │
│  4. Métricas de conversación                   │
└────────────────────────────────────────────────┘
```

**Entregables:**
- [ ] AI detecta hot leads automáticamente
- [ ] Derivación inteligente a follow-up
- [ ] Lead scoring por conversación

---

### FASE 4: Guest Response Handler (Semana 4)
```
┌────────────────────────────────────────────────┐
│  1. Detectar respuestas "YES" al pickup        │
│  2. Crear tabla `transfers`                    │
│  3. Confirmar al guest                         │
│  4. Notificar al owner                         │
└────────────────────────────────────────────────┘
```

**Entregables:**
- [ ] Flujo completo de airport pickup
- [ ] Registro en Supabase
- [ ] Confirmaciones automáticas

---

### FASE 5: Owner Intelligence Expandido (Semana 5+)
```
┌────────────────────────────────────────────────┐
│  1. Market Intelligence Bali                   │
│  2. Competencia y pricing                      │
│  3. Dashboard estratégico                      │
└────────────────────────────────────────────────┘
```

---

## 🗄️ ESTRUCTURA DE DATOS REQUERIDA

### Nueva tabla: `leads`
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES properties(id),
  
  -- Contacto
  name TEXT,
  phone TEXT,
  email TEXT,
  channel TEXT, -- whatsapp, instagram, email, web, vapi
  
  -- Estado comercial
  status TEXT DEFAULT 'NEW', -- NEW, ENGAGED, HOT, FOLLOWING_UP, WON, LOST
  intent TEXT, -- info, price, availability, booking
  score INTEGER DEFAULT 0,
  
  -- Contexto
  source TEXT, -- organic, referral, ad
  first_message TEXT,
  last_message TEXT,
  dates_interested DATERANGE,
  room_type_interested TEXT,
  
  -- Conversión
  booking_id UUID REFERENCES bookings(id),
  converted_at TIMESTAMPTZ,
  lost_reason TEXT,
  
  -- Timestamps
  first_contact_at TIMESTAMPTZ DEFAULT NOW(),
  last_contact_at TIMESTAMPTZ DEFAULT NOW(),
  next_followup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Nueva tabla: `lead_events`
```sql
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  event_type TEXT, -- lead_created, lead_updated, followup_sent, converted, lost
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Nueva tabla: `transfers` (para airport pickup)
```sql
CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  property_id UUID REFERENCES properties(id),
  
  -- Detalles
  type TEXT DEFAULT 'airport_pickup',
  pickup_location TEXT,
  dropoff_location TEXT,
  pickup_datetime TIMESTAMPTZ,
  flight_number TEXT,
  passengers INTEGER,
  price DECIMAL,
  
  -- Estado
  status TEXT DEFAULT 'pending', -- pending, confirmed, assigned, completed, cancelled
  driver_id UUID,
  
  -- Timestamps
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📊 MÉTRICAS OBJETIVO

### Sales & Lead Management
| Métrica | Target |
|---------|--------|
| % leads capturados vs perdidos | > 95% |
| Tiempo respuesta inicial | < 2 min |
| Tasa conversión lead → booking | > 15% |
| Follow-up coverage | 100% leads |

### Guest Journey
| Métrica | Target |
|---------|--------|
| Mensajes enviados correctamente | > 99% |
| Tasa respuesta airport pickup | > 30% |
| Reviews solicitados | 100% post-stay |

---

## 🎯 RESUMEN EJECUTIVO

### Lo que TENEMOS (Fortalezas)
1. ✅ Sistema de comunicación robusto (WhatsApp + VAPI + Email)
2. ✅ Guest Journey completo y automatizado
3. ✅ MCP Central como capa de acciones
4. ✅ Owner Intelligence funcionando
5. ✅ Arquitectura multi-tenant preparada

### Lo que FALTA (Gaps Críticos)
1. 🔴 **No hay CRM de leads** - Conversaciones se pierden
2. 🔴 **No hay follow-up automático** - Dinero en la mesa
3. 🟡 **AI no detecta hot leads** - Oportunidades perdidas
4. 🟡 **Guest Response Handler** - Pickup sin procesar

### Próximo Paso Inmediato
> **Crear tabla `leads` y WF-SP-01 Inbound Lead Handler**

Esto es la BASE sobre la que construir todo el sistema de ventas.

---

## 📝 PROMPT DE SEGUIMIENTO ACTUALIZADO

```
MYHOST BizMate - Sesión de Desarrollo

PROYECTO: SaaS gestión hotelera con IA dual (BANYU/OSIRIS)
CLIENTE PILOTO: Izumi Hotel, Ubud, Bali

ARQUITECTURA:
- 4 Bloques: Sales, Guest Journey, Owner Intelligence, MCP Central
- Stack: n8n + Supabase + ChakraHQ + VAPI + SendGrid

COMPLETADO:
✅ WhatsApp AI Concierge (ln2myAS3406D6F8W)
✅ VAPI Voice Assistant (jyvFpkPes5DdoBRE)
✅ Guest Journey 5 fases (cQLiQnqR2AHkYOjd)
✅ Owner Daily Intelligence (aergpRINvoJEyufR)
✅ MCP Central (tools funcionando)
✅ Notify Owner + Log Events

FLUJOS PENDIENTES (PRIORIDAD):
1. WF-SP-01 Inbound Lead Handler (CREAR)
   - Tabla leads
   - Estados: NEW → ENGAGED → HOT → WON/LOST
   - Eventos: lead_created, lead_updated

2. WF-SP-03 Follow-Up Engine (COMPLETAR)
   - Reglas 24h/48h/72h
   - Personalización mensajes
   - Conversión WON/LOST

3. WF-SP-02 AI Self-Assistance (MEJORAR)
   - Contexto comercial
   - Detección hot leads
   - Emisión eventos

4. Guest Response Handler (CREAR)
   - Procesar "YES" airport pickup
   - Tabla transfers

IDs CRÍTICOS:
- tenant_id: c24393db-d318-4d75-8bbf-0fa240b9c1db
- property_id: 18711359-1378-4d12-9ea6-fb31c0b1bac2

REGLA: NO rehacer lo que funciona. Estructurar, conectar, completar.

ACCIÓN: [Especificar flujo a desarrollar]
```

---

*Documento generado: 4 Enero 2026*
*Próxima revisión: Después de completar WF-SP-01*
