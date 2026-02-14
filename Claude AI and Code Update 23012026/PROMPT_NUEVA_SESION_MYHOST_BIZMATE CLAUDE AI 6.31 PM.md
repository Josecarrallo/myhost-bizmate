# PROMPT PARA NUEVA SESIÓN - MY HOST BizMate
## Fecha: 23 de Enero de 2026

---

## CONTEXTO DEL PROYECTO

Estamos desarrollando **MY HOST BizMate**, una plataforma SaaS de automatización integral para boutique hotels en Bali. El cliente piloto es **Izumi Hotel** (7 villas de lujo en Ubud).

**Usuario objetivo:** Pequeños villa owners (2-5 unidades) que manejan todo ellos mismos o con equipo familiar. NO son hoteles corporativos. Necesitan soluciones simples, mobile-friendly, que reduzcan trabajo manual.

---

## IDENTIFICADORES CRÍTICOS

```
Tenant ID:    c24393db-d318-4d75-8bbf-0fa240b9c1db
Property ID:  18711359-1378-4d12-9ea6-fb31c0b1bac2
VAPI ID:      ae9ea22a-fc9a-49ba-b5b8-900ed69b7615
```

---

## URLs DE PRODUCCIÓN

- **n8n:** https://n8n-production-bb2d.up.railway.app
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co

---

## STACK TECNOLÓGICO

| Componente | Tecnología |
|------------|------------|
| Workflows | n8n (Railway) |
| Base de datos | Supabase (PostgreSQL) |
| Voice AI | VAPI |
| WhatsApp | ChakraHQ |
| Email | SendGrid |
| Video Generation | Fal.ai (Wan i2v) |
| Frontend | React/Vite (Vercel) |

---

## ARQUITECTURA DE AGENTES AI

| Agente | Función | Canal | Estado |
|--------|---------|-------|--------|
| **KORA** | Voice booking concierge | VAPI (llamadas) | ✅ 100% Producción |
| **BANYU** | WhatsApp automation | ChakraHQ | ✅ 100% Producción |
| **LUMINA** | Sales orchestrator / Lead intelligence | Backend | ✅ 75% (decide, no ejecuta) |
| **OSIRIS** | Business intelligence dashboard | Dashboard | ✅ 100% Producción |

---

## WORKFLOWS ACTIVOS EN PRODUCCIÓN

| Workflow | ID | Endpoint | Función |
|----------|-----|----------|---------|
| WF-01-MCP-KORA-TOOLS | `ydByDOQWq9kJACAe` | `/mcp/izumi-hotel-v3` | MCP Server para VAPI |
| WF-02 KORA-POST-CALL | `gsMMQrc9T2uZ7LVA` | `/webhook/kora-post-call-v2` | Procesa llamadas VAPI |
| BANYU - Johnson Contract v1 | `NJR1Omi4BqKA9f1P` | ChakraHQ trigger | AI Agent WhatsApp |
| WF-03-LEAD-HANDLER | `OZmq7E9wzODJrzej` | `/webhook/inbound-johnson-v1` | Handler compartido KORA+BANYU |
| WF-SP-02 LUMINA | `EtrQnkgWqqbvRjEB` | `/webhook/lumina-analyze` | Decisiones de leads |
| WF-04 Booking Notifications | `p3ukMWlbKN4bf5Gz` | Trigger Supabase | Notifica reservas |
| WF-IA-01 OSIRIS V1 | (actualizado hoy) | `/webhook/ai/chat-v2` | Dashboard AI owner |

---

## FLUJO DE DATOS PRINCIPAL

```
KORA (Voice)                    BANYU (WhatsApp)
     ↓                               ↓
WF-01 MCP-KORA-TOOLS           BANYU Johnson Contract
     ↓                               ↓
WF-02 KORA-POST-CALL                 │
     ↓                               │
     └──────────┬────────────────────┘
                ↓
        WF-03-LEAD-HANDLER
          (Johnson Contract)
                ↓
        WF-SP-02 LUMINA
                ↓
    ┌───────────┼───────────┐
    ↓           ↓           ↓
 BOOKED     FOLLOWUP     CLOSE
    ↓           ↓           ↓
   ???        ???         ???
(Pendiente conectar a workflows downstream)
```

---

## PENDIENTES CRÍTICOS

### LUMINA - Conexiones Pendientes
LUMINA decide pero NO ejecuta acciones. Falta conectar:

| Decisión | Acción Requerida | Prioridad |
|----------|------------------|-----------|
| BOOKED | → Disparar WF-05 Guest Journey | 🔴 Alta |
| FOLLOWUP | → Disparar WF-04 Follow-Up Engine | 🔴 Alta |
| REENGAGE | → Disparar WF-04 (secuencia diferente) | 🟡 Media |
| CLOSE | → Actualizar lead como LOST en Supabase | 🟢 Baja |

### Workflows Existentes pero INACTIVOS

| Workflow | ID | Necesita |
|----------|-----|----------|
| Follow-Up Engine v8 | `HndGXnQAEyaYDKFZ` | Renombrar, conectar a LUMINA, activar |
| GuestJourney-Scheduler | `cQLiQnqR2AHkYOjd` | Renombrar, conectar a LUMINA, activar |

---

## CONTENT CREATOR (NUEVO MÓDULO)

### Workflow 1: Media → Video → WhatsApp (MVP)
**ID:** `8S0LKqyc1r1oqLyH`
**Estado:** ❌ Esqueleto creado, sin conexiones
**Endpoint:** `/webhook/media-to-video`

**Flujo:**
1. Owner envía foto/descripción
2. Claude genera concepto de video + caption + hashtags
3. Fal.ai (Wan i2v) genera video 9:16
4. Se envía al owner por WhatsApp

**Tabla Supabase necesaria:** `media_jobs` (PENDIENTE CREAR)

### Workflow 2: Social Publishing (Factory + Scheduler)
**ID:** `7lqwefjJaJDKui7F`
**Estado:** ❌ Esqueleto creado, sin conexiones
**Endpoint:** `/webhook/generate-social-posts`

**Flujo:**
1. Toma video generado (media_job ready)
2. Claude genera contenido optimizado por plataforma (IG/FB/TikTok)
3. Inserta en `social_posts` con status='scheduled'
4. CRON publica cuando toca

**Tabla Supabase necesaria:** `social_posts` (PENDIENTE CREAR)

---

## TABLAS PRINCIPALES SUPABASE

### Existentes
- `users`, `properties`, `bookings`, `leads`, `lead_events`
- `guests`, `payments`, `whatsapp_messages`, `alerts`
- `ai_chat_history_old`, `audit_logs`
- `journey_settings`, `journey_events`

### Pendientes de Crear
- `media_jobs` (Content Creator)
- `social_posts` (Content Creator)

### RPCs Disponibles
```sql
get_lumina_stats()
get_banyu_stats()
get_kora_stats()
get_osiris_stats()
get_dashboard_stats()
get_active_alerts()
get_due_followup_leads()
update_lead_after_followup()
log_followup_event()
update_owner_notified()
```

---

## CREDENCIALES EN N8N

| Servicio | ID Credencial |
|----------|---------------|
| Supabase | `SJLQzwU9BVHEVAGc` |
| OpenAI | `hlVVk9ThwmKbr4yS` |
| SendGrid | `Y35BYbcV5SYfjBwc` |

---

## REGLAS CRÍTICAS DEL PROYECTO

1. **NO crear tablas nuevas** en Supabase sin aprobación explícita
2. **NO modificar esquemas** sin usar migraciones documentadas
3. **Verificar workflows existentes** antes de crear nuevos
4. **Nomenclatura:** `WF-XX - Nombre - MYHOST Bizmate`
5. **JSON Body en n8n:** usar `JSON.stringify()` para evitar errores de sintaxis
6. **Testear en producción** solo después de verificar en manual trigger

---

## FILOSOFÍA DEL PRODUCTO (CRÍTICO)

**Los villa owners NO necesitan sistemas complejos.** Necesitan:

| Lo que QUIEREN | Lo que NO quieren |
|----------------|-------------------|
| Un solo lugar para todo | Múltiples dashboards |
| Notificaciones cortas | Reportes largos |
| Decisiones automáticas | Análisis manual |
| Mobile-friendly | Desktop-only |
| Affordable | PMS caros con features no usados |

**AI debe:**
- **Recordar**, no instruir
- **Resumir**, no añadir trabajo
- **Tomar decisiones simples** automáticamente

**Ejemplos de decisiones automáticas:**
- "Baja ocupación hoy → sugerir promoción"
- "Conflicto de reserva → alertar owner"
- "Dependencia OTA muy alta → promover reserva directa"

---

## PRIORIDADES DE IMPLEMENTACIÓN

### Fase 1: Completar LUMINA (Esta semana)
1. ✅ LUMINA decide correctamente
2. ⏳ Conectar LUMINA → WF-04 Follow-Up Engine
3. ⏳ Conectar LUMINA → WF-05 Guest Journey
4. ⏳ Activar WF-04 y WF-05

### Fase 2: Content Creator (Próxima semana)
1. Crear tablas `media_jobs` y `social_posts`
2. Completar Workflow 1 (Media → Video)
3. Completar Workflow 2 (Social Publishing)
4. Integrar APIs de redes sociales

### Fase 3: Refinamiento (Febrero)
1. OSIRIS con Tools dinámicos
2. RLS multi-tenant
3. Dashboard frontend completo

---

## HISTORIAL DE CAMBIOS RECIENTES

| Fecha | Cambio |
|-------|--------|
| 23 Ene 2026 | OSIRIS endpoint actualizado a `/webhook/ai/chat-v2` |
| 23 Ene 2026 | Fix JSON Body en Call LUMINA (WF-03) |
| 23 Ene 2026 | Fix filtrado eventos VAPI en WF-02 KORA-POST-CALL |
| 23 Ene 2026 | Integración completa LUMINA ← KORA + BANYU |
| 23 Ene 2026 | Documentación Content Creator workflows |
| 22 Ene 2026 | Creación WF-SP-02 LUMINA |

---

## DOCUMENTACIÓN DE REFERENCIA

Los siguientes documentos contienen especificaciones detalladas:
- `CONTENT_RESUMEN_EJECUTIVO.txt` - Specs de Content Creator
- `Villa_Owner_Point_of_View.pdf` - Investigación de campo usuarios
- `MYHOST_BIZMATE_DOCUMENTO_GLOBAL_23_ENERO_2026.md` - Documento maestro

---

*Prompt generado: 23 de Enero de 2026*
