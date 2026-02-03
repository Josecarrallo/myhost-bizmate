# CONTEXTO: MY HOST BizMate - Estado KORA Voice AI (21 Enero 2026)

## RESUMEN EJECUTIVO
Sistema KORA (Voice AI) **funcionando correctamente** después de debugging de 4 horas.
- **Problema resuelto:** Flujo WF-02-KORA-POST-CALL se rompía cuando Find Booking no encontraba match por diferencia de nombres entre MCP y Structured Output.
- **Solución:** Separar en dos ramas paralelas (Lead Handler siempre ejecuta, Update Phone es opcional).
- **Estado actual:** ✅ Probado con 2 escenarios (booking + información) - Todo funciona.

---

## ARQUITECTURA ACTUAL - 4 WORKFLOWS KORA

### WF-01-MCP-KORA-TOOLS (ID: ydByDOQWq9kJACAe)
- **Función:** MCP que ejecuta tools durante llamadas VAPI
- **Trigger:** Webhook desde VAPI cuando Claude llama tools
- **Acciones:** create_booking, check_availability, etc.
- **Estado:** ✅ Funcionando

### WF-02-KORA-POST-CALL (ID: gsMMQrc9T2uZ7LVA)
- **Función:** Procesa Structured Output al terminar llamada
- **Trigger:** Webhook `end-of-call-report` de VAPI
- **Flujo:**
  ```
  VAPI Webhook → Extract Structured Output → Build Johnson Contract
                                                    ├─→ Send to Lead Handler (siempre)
                                                    └─→ Find Booking → Update Phone (opcional)
  ```
- **Estado:** ✅ Funcionando (corregido 21 Enero 2026)

### WF-03-LEAD-HANDLER (ID: OZmq7E9wzODJrzej)
- **Función:** CRM - Crea/actualiza leads
- **Trigger:** Webhook con Johnson Contract v1
- **Lógica:** Busca lead por phone/email → INSERT si nuevo, UPDATE si existe
- **Tablas:** `leads`, `lead_events`
- **Estado:** ✅ Funcionando

### WF-04-BOOKING-NOTIFICATIONS (ID: p3ukMWIbKN4bf5Gz)
- **Función:** Envía confirmaciones WhatsApp + Email
- **Trigger:** Webhook al crear booking en Supabase
- **Canales:** WhatsApp (ChakraHQ), Email (SendGrid)
- **Estado:** ✅ Funcionando

---

## FLUJO COMPLETO DE UNA LLAMADA KORA

```
Cliente llama → VAPI/KORA
                    │
                    ├─→ [Durante llamada] WF-01-MCP crea booking → Supabase
                    │                                                  │
                    │                                          WF-04: WhatsApp + Email
                    │
                    └─→ [Fin llamada] WF-02 procesa Structured Output
                                              │
                                              └─→ WF-03: Crea/actualiza lead
```

---

## AGENTES DEL SISTEMA MY HOST BizMate

| Agente | Función | Canal | Estado |
|--------|---------|-------|--------|
| **KORA** | Voice AI - Reservas y atención telefónica | VAPI + Teléfono | ✅ Funcionando |
| **BANYU** | WhatsApp AI - Concierge 24/7 | WhatsApp Business | ✅ Funcionando (probar hoy) |
| **OSIRIS** | Backoffice AI - Dashboard operaciones | Web Dashboard | 🔧 En desarrollo |
| **AURA** | Content AI - Generación contenido marketing | Web Dashboard | 🔧 En desarrollo |
| **LUMINA** | Sales AI - Orquestación leads | Backend | 📋 Planificado |

---

## PROBLEMA CONOCIDO: TELÉFONO CORRUPTO

### Descripción
VAPI/Claude a veces transcribe mal los dígitos del teléfono durante la llamada.
- Ejemplo: Cliente dice "34619794604" → KORA guarda "34661979946604"

### Solución actual (parcial)
Rama en WF-02 intenta corregir usando Structured Output, pero falla si los nombres no coinciden entre MCP y Structured Output.

### Solución definitiva pendiente
Mejorar prompt de KORA con validación estricta:
```
PHONE NUMBER VALIDATION - CRITICAL:
1. A valid phone number has between 10 and 13 digits total
2. After the guest says their number, COUNT the digits before repeating
3. If you count MORE than 13 digits, say: "I think I may have misheard. Could you please repeat your phone number slowly?"
4. The EXACT phone number you repeat back must match what you save in structured output
```

---

## ARQUITECTURA MULTI-TENANT (PLANIFICADA)

Jose está considerando arquitectura con **VPS dedicada por cliente** para escalabilidad.

### Diseño propuesto

```
                    ┌─────────────────────────────────┐
                    │      MY HOST BizMate CORE       │
                    │   (VPS central / Control)       │
                    │  - Dashboard admin              │
                    │  - Billing                      │
                    │  - Templates de workflows       │
                    │  - Monitoring centralizado      │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│  VPS Izumi    │          │  VPS Hotel B  │          │  VPS Hotel C  │
│  - n8n        │          │  - n8n        │          │  - n8n        │
│  - Supabase   │          │  - Supabase   │          │  - Supabase   │
│  - KORA       │          │  - KORA       │          │  - KORA       │
│  - BANYU      │          │  - BANYU      │          │  - BANYU      │
└───────────────┘          └───────────────┘          └───────────────┘
```

### Ventajas
- Aislamiento total de datos entre clientes
- Personalización por hotel
- Escalado independiente
- Facturación clara por consumo

### Consideraciones
- Más coste operativo (múltiples servidores)
- Necesita automatización de deployments (Terraform/Ansible)

### Alternativa Híbrida (más económica)

```
                    ┌─────────────────────────────────┐
                    │      MY HOST BizMate CORE       │
                    │         (VPS Central)           │
                    │  - n8n (shared, con tenant_id)  │
                    │  - Supabase (shared, RLS)       │
                    │  - Dashboard admin              │
                    │  - Billing                      │
                    │  - Monitoring                   │
                    └───────────────┬─────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│    Izumi      │          │   Hotel B     │          │   Hotel C     │
│  (Dedicado)   │          │  (Dedicado)   │          │  (Dedicado)   │
│  - Nº VAPI    │          │  - Nº VAPI    │          │  - Nº VAPI    │
│  - Nº WhatsApp│          │  - Nº WhatsApp│          │  - Nº WhatsApp│
│  - Prompts    │          │  - Prompts    │          │  - Prompts    │
└───────────────┘          └───────────────┘          └───────────────┘
```

**Shared (centralizado):**
- n8n con workflows que filtran por `tenant_id`
- Supabase con Row Level Security (RLS) por tenant
- Un solo servidor que mantener

**Dedicado (por cliente):**
- Número de teléfono VAPI
- Número WhatsApp Business
- Prompts personalizados de KORA/BANYU
- Configuración de marca (logos, mensajes)

**Ventajas híbrido:**
- Coste base mucho menor (~$50-100/mes vs $200-400/mes VPS dedicadas)
- Un solo deployment para actualizaciones
- Escalable hasta 50+ clientes sin cambios de arquitectura

**Desventajas híbrido:**
- Si el servidor central cae, afecta a todos
- Menos flexibilidad para personalizaciones extremas
- Necesita RLS bien configurado para seguridad

### 💡 MI RECOMENDACIÓN

**Fase 1 (0-10 clientes):** Arquitectura híbrida
- Menor coste, más fácil de mantener
- Perfecto para validar el modelo de negocio
- Izumi Hotel como piloto

**Fase 2 (10-30 clientes):** Híbrido con redundancia
- Añadir servidor de backup
- Implementar monitoreo avanzado
- Considerar migrar clientes premium a VPS dedicada

**Fase 3 (30+ clientes):** Multi-tenant con Kubernetes
- Orquestación automática
- Auto-scaling por demanda
- VPS dedicada solo para enterprise

---

## TABLAS SUPABASE PRINCIPALES

| Tabla | Función |
|-------|---------|
| `bookings` | Reservas confirmadas |
| `leads` | CRM - Seguimiento comercial |
| `lead_events` | Log de eventos por lead |
| `properties` | Info de propiedades/villas |
| `tenants` | Info de clientes (hoteles) |

---

## DATOS DE CONEXIÓN

| Servicio | URL/ID |
|----------|--------|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase Project | jjpscimtxrudtepzwhag |
| VAPI Assistant | KORA |
| Tenant ID Izumi | c24393db-d318-4d75-8bbf-0fa240b9c1db |
| Property ID Izumi | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |
| WhatsApp (ChakraHQ) | +62 813 2576 4867 |

---

## PENDIENTES

### Hoy (21 Enero 2026 - Tarde)
- [ ] Probar BANYU (WhatsApp) end-to-end
- [ ] Comenzar desarrollo OSIRIS (Backoffice AI)
- [ ] Comenzar desarrollo AURA (Content AI)

### Próximamente
- [ ] Mejorar prompt KORA para validación de teléfono
- [ ] Añadir autenticación a webhooks (producción)
- [ ] Diseñar arquitectura multi-tenant detallada
- [ ] Automatización de deployments

---

## NOTAS TÉCNICAS

### n8n en Railway
- Versión actual: 1.123.5
- **NO actualizar a v2.0** (breaking changes)
- Actualizar en: Settings → Source → Source Image
- Rollback disponible en Deployments

### Johnson Contract v1
Formato estandarizado para comunicación entre agentes:
```json
{
  "version": "johnson.v1",
  "event_type": "lead_message",
  "tenant": { "tenant_id": "...", "slug": "..." },
  "lead": { "name": "...", "phone": "...", "email": "..." },
  "channel": { "source": "vapi|whatsapp", "thread_id": "..." },
  "booking": { "check_in": "...", "check_out": "...", "status": "..." },
  "ai": { "intent": "...", "score": 0-100, "is_hot": true|false }
}
```
