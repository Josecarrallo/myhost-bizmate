# MY HOST BizMate - Documento Global del Proyecto
## Fecha: 23 de Enero de 2026

---

## 1. VISIÓN GENERAL

**MY HOST BizMate** es una plataforma SaaS de automatización integral para boutique hotels en Bali. El sistema integra cuatro agentes AI que trabajan coordinadamente para gestionar reservas, comunicación con huéspedes, inteligencia de ventas y operaciones del negocio.

### Cliente Piloto
- **Hotel:** Izumi Hotel
- **Ubicación:** Ubud, Bali
- **Capacidad:** 7 villas de lujo

### Identificadores Críticos
| Recurso | ID |
|---------|-----|
| Tenant ID | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| Property ID | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| VAPI ID | `ae9ea22a-fc9a-49ba-b5b8-900ed69b7615` |

### Stack Tecnológico
| Componente | Tecnología |
|------------|------------|
| Workflows | n8n (Railway) |
| Base de datos | Supabase (PostgreSQL) |
| Voice AI | VAPI |
| WhatsApp | ChakraHQ |
| Email | SendGrid |
| Video Generation | Fal.ai (Wan i2v) |
| Frontend | React/Vite (Vercel) |

### URLs de Producción
- **n8n:** https://n8n-production-bb2d.up.railway.app
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co

---

## 2. ARQUITECTURA DE AGENTES AI

| Agente | Función | Canal | Estado |
|--------|---------|-------|--------|
| **KORA** | Voice booking concierge | VAPI (llamadas) | ✅ Producción |
| **BANYU** | WhatsApp automation | ChakraHQ | ✅ Producción |
| **LUMINA** | Sales orchestrator | Backend | ✅ Producción (decisiones) |
| **OSIRIS** | Business intelligence | Dashboard | ✅ Producción |

---

## 3. WORKFLOWS EN PRODUCCIÓN

### 3.1 Flujo Principal de Canales → LUMINA

```
┌─────────────────┐         ┌─────────────────┐
│   KORA (Voice)  │         │ BANYU (WhatsApp)│
│   VAPI Call     │         │ ChakraHQ        │
└────────┬────────┘         └────────┬────────┘
         │                           │
         ▼                           │
┌─────────────────┐                  │
│ WF-01-MCP-KORA  │                  │
│    TOOLS        │                  │
│ (MCP Server)    │                  │
└────────┬────────┘                  │
         │                           │
         ▼                           │
┌─────────────────┐                  │
│ WF-02 KORA      │                  │
│  POST-CALL      │                  │
│ (Johnson Contract)                 │
└────────┬────────┘                  │
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌─────────────────┐
         │ WF-03-LEAD      │
         │   HANDLER       │
         │ (Compartido)    │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ WF-SP-02 LUMINA │
         │ Lead Intelligence│
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌───────┐   ┌──────────┐   ┌───────┐
│BOOKED │   │FOLLOWUP/ │   │ CLOSE │
│       │   │REENGAGE  │   │       │
└───┬───┘   └────┬─────┘   └───┬───┘
    │            │             │
    ▼            ▼             ▼
   ???         ???           ???
(Pendiente) (Pendiente)  (Pendiente)
```

### 3.2 Tabla de Workflows Activos

| Workflow | ID | Endpoint | Estado | Función |
|----------|-----|----------|--------|---------|
| WF-01-MCP-KORA-TOOLS | `ydByDOQWq9kJACAe` | `/mcp/izumi-hotel-v3` | ✅ ACTIVO | MCP Server para VAPI |
| WF-02 KORA-POST-CALL | `gsMMQrc9T2uZ7LVA` | `/webhook/kora-post-call-v2` | ✅ ACTIVO | Procesa llamadas VAPI |
| BANYU - Johnson Contract v1 | `NJR1Omi4BqKA9f1P` | ChakraHQ trigger | ✅ ACTIVO | AI Agent WhatsApp |
| WF-03-LEAD-HANDLER | `OZmq7E9wzODJrzej` | `/webhook/inbound-johnson-v1` | ✅ ACTIVO | Handler compartido |
| WF-SP-02 LUMINA | `EtrQnkgWqqbvRjEB` | `/webhook/lumina-analyze` | ✅ ACTIVO | Decisiones de leads |
| WF-04 Booking Notifications | `p3ukMWlbKN4bf5Gz` | Trigger Supabase | ✅ ACTIVO | Notifica reservas |
| WF-IA-01 OSIRIS AI Assistant | `iAMo7NdzYkJxJUkP` | `/webhook/ai/chat` | ✅ ACTIVO | Dashboard AI owner |

---

## 4. ESTADO DETALLADO POR AGENTE

### 4.1 KORA (Voice Booking)

**Estado:** ✅ 100% Funcional

**Funcionalidades completadas:**
- ✅ MCP Server con tools para VAPI
- ✅ Extracción de datos estructurados de llamadas
- ✅ Creación de leads desde llamadas
- ✅ Creación de bookings desde llamadas
- ✅ Filtrado de eventos VAPI (solo procesa end-of-call-report)
- ✅ Integración con WF-03-LEAD-HANDLER
- ✅ Integración con LUMINA

**Correcciones aplicadas (23 Ene 2026):**
- Fix: Filtrado de eventos VAPI para evitar errores con status-update
- Fix: Código vacío en nodo "Code in JavaScript" removido

---

### 4.2 BANYU (WhatsApp Automation)

**Estado:** ✅ 100% Funcional

**Funcionalidades completadas:**
- ✅ AI Agent con tools para WhatsApp
- ✅ Recepción y respuesta de mensajes
- ✅ Creación de leads desde conversaciones
- ✅ Integración con WF-03-LEAD-HANDLER
- ✅ Integración con LUMINA
- ✅ Deduplicación de leads por teléfono

---

### 4.3 LUMINA (Sales Orchestrator)

**Estado:** ⚠️ 75% Funcional

**Funcionalidades completadas:**
- ✅ Webhook `/webhook/lumina-analyze`
- ✅ AI Decision con GPT-4o-mini
- ✅ Decision Router con 4 salidas (BOOKED, FOLLOWUP, REENGAGE, CLOSE)
- ✅ Responde JSON con decisión estructurada
- ✅ Integrado con WF-03 (recibe de KORA y BANYU)

**Correcciones aplicadas (23 Ene 2026):**
- Fix: JSON Body con `JSON.stringify()` para evitar errores de sintaxis

**Pendientes:**
| # | Tarea | Prioridad |
|---|-------|-----------|
| 1 | Conectar BOOKED → WF-05 Guest Journey | 🔴 Alta |
| 2 | Conectar FOLLOWUP → WF-04 Follow-Up Engine | 🔴 Alta |
| 3 | Conectar REENGAGE → WF-04 (secuencia diferente) | 🟡 Media |
| 4 | Conectar CLOSE → Actualizar lead LOST | 🟢 Baja |
| 5 | Log decisiones en `lead_events` | 🟢 Baja |

---

### 4.4 OSIRIS (Business Intelligence)

**Estado:** ✅ 100% Funcional (MVP)

**Funcionalidades completadas:**
- ✅ Webhook `/webhook/ai/chat`
- ✅ Cálculo de 17+ KPIs del negocio
- ✅ Respuestas multilenguaje (ES/EN/ID)
- ✅ Output JSON estandarizado
- ✅ Guardado en `ai_chat_history_old`
- ✅ Logging en `audit_logs`

**Output JSON:**
```json
{
  "reply": "respuesta AI",
  "agent": "osiris",
  "intent": "insight|list|action",
  "kpis": {...},
  "table": null,
  "actions": [],
  "meta": { "module": "dashboard", "sources": ["kpi_calculator"] }
}
```

**Pendientes futuros (no prioritarios):**
- Tools con function calling para consultas dinámicas
- Migrar a `ai_chat_history_v2`

---

## 5. WORKFLOWS PENDIENTES DE CONEXIÓN

### 5.1 WF-04 Follow-Up Engine

**Workflow existente:** `HndGXnQAEyaYDKFZ`
**Nombre actual:** "WF-02 Follow-Up Engine v8 MYHOST Bizmate XXV"
**Estado:** ❌ INACTIVO

**Funcionalidad diseñada:**
- CRON cada hora busca leads con `next_followup_at <= now()`
- Secuencia de 6 pasos: SOFT_CHECK → VALUE_REMINDER → LAST_DIRECT → REENGAGEMENT → INCENTIVE → CLOSURE
- AI genera mensajes personalizados
- Envía WhatsApp al lead
- Notifica al owner si es high-value
- Actualiza estado del lead

**Tareas pendientes:**
1. Renombrar a nomenclatura estándar
2. Verificar RPCs en Supabase (`get_due_followup_leads`, `update_lead_after_followup`)
3. Conectar desde LUMINA (salida FOLLOWUP/REENGAGE)
4. Activar workflow
5. Testear secuencia completa

---

### 5.2 WF-05 Guest Journey

**Workflow existente:** `cQLiQnqR2AHkYOjd`
**Nombre actual:** "GuestJourney-Scheduler MYHOST Bizmate XXII"
**Estado:** ❌ INACTIVO

**Funcionalidad diseñada:**
- CRON cada hora busca bookings por fecha
- 5 touchpoints automáticos:
  - 7 días antes: Guía de Bali
  - 48 horas antes: Oferta pickup aeropuerto
  - Día check-in: Bienvenida
  - Día check-out: Recordatorio
  - Post-stay: Review request + código descuento
- Envía Email + WhatsApp
- Actualiza `journey_state` en booking
- Notifica al owner

**Tareas pendientes:**
1. Renombrar a nomenclatura estándar
2. Verificar tabla `journey_settings` en Supabase
3. Conectar desde LUMINA (salida BOOKED)
4. Activar workflow
5. Testear cada touchpoint

---

## 6. NUEVOS MÓDULOS - CONTENT CREATOR

### 6.1 Visión General

Módulo para que owners generen contenido social automáticamente:
1. Owner sube foto/video de su villa
2. Claude genera concepto de video + caption + hashtags
3. Fal.ai genera video vertical 9:16
4. Sistema publica en IG/FB/TikTok

### 6.2 Workflow 1: Media → Video → WhatsApp (MVP)

**ID:** `8S0LKqyc1r1oqLyH`
**Nombre:** "MYHOST - Media → Video → WhatsApp (MVP)"
**Estado:** ❌ INACTIVO (esqueleto creado, sin conexiones)

**Endpoint:** `/webhook/media-to-video`

**Flujo:**
```
Webhook /media-to-video
    │
    ▼
Prepare Media Description
    │
    ▼
Supabase Insert media_job (status='received')
    │
    ▼
Call Claude Creative (genera concepto + caption)
    │
    ▼
Supabase Update (status='processing')
    │
    ▼
Call Fal Wan i2v (genera video 9:16)
    │
    ▼
Supabase Update (status='ready', video_url)
    │
    ▼
Send WhatsApp Video al owner
    │
    ▼
Respond to Webhook
```

**Input esperado:**
```json
{
  "property_id": "villa_123",
  "property_name": "Villa Suerte",
  "language": "es",
  "objective": "bookings",
  "platform_focus": "instagram_reels",
  "target_audience": "parejas",
  "media_url": "https://.../foto.jpg",
  "text_description": "Foto de piscina infinita...",
  "owner_whatsapp": "+628123456789"
}
```

**Tabla Supabase:** `media_jobs`
- id, property_id, input_media_url, has_media, media_description
- language, objective, target_audience, platform_focus
- status ('received' | 'processing' | 'ready' | 'error')
- final_video_url, caption, cta, hashtags, vibe
- clauded_output (jsonb), error_message, owner_whatsapp
- created_at, updated_at

**Tareas pendientes:**
1. ❌ Crear tabla `media_jobs` en Supabase
2. ❌ Configurar nodo Claude con API key y prompt
3. ❌ Configurar nodo Fal.ai con API key
4. ❌ Configurar nodo WhatsApp (ChakraHQ)
5. ❌ Conectar todos los nodos (connections vacías)
6. ❌ Testear flujo completo

---

### 6.3 Workflow 2: Social Publishing (Factory + Scheduler)

**ID:** `7lqwefjJaJDKui7F`
**Nombre:** "MYHOST - Social Publishing (Factory + Scheduler)"
**Estado:** ❌ INACTIVO (esqueleto creado, sin conexiones)

**Parte A - Webhook `/generate-social-posts`:**
```
Webhook /generate-social-posts
    │
    ▼
Supabase Get media_job
    │
    ▼
Prepare Factory Input
    │
    ▼
Call Claude Social Factory
    │
    ▼
Parse Factory JSON
    │
    ▼
Build social_posts rows
    │
    ▼
Supabase Insert social_posts (status='scheduled')
    │
    ▼
Respond to Webhook
```

**Parte B - CRON Publisher:**
```
Cron (cada X minutos)
    │
    ▼
Supabase Fetch scheduled posts (scheduled_at <= now())
    │
    ▼
Split posts
    │
    ▼
Route by Platform
    │
    ├── Instagram → Graph API → Update status
    ├── Facebook → Graph API → Update status
    └── TikTok → Business API → Update status
```

**Input Parte A:**
```json
{
  "media_job_id": "uuid",
  "target_platforms": ["instagram", "tiktok", "facebook"],
  "scheduled_at": "2026-02-01T10:00:00Z"
}
```

**Tabla Supabase:** `social_posts`
- id, property_id, media_job_id
- platform ('instagram' | 'facebook' | 'tiktok')
- status ('scheduled' | 'published' | 'failed')
- language, objective, media_type, video_url
- caption, cta, hashtags, vibe, platform_focus
- scheduled_at, published_at
- instagram_post_id, facebook_post_id, tiktok_video_id
- created_at, updated_at

**Tareas pendientes:**
1. ❌ Crear tabla `social_posts` en Supabase
2. ❌ Configurar nodo Claude Social Factory con prompt
3. ❌ Configurar APIs de Instagram/Facebook/TikTok
4. ❌ Conectar todos los nodos
5. ❌ Configurar CRON interval
6. ❌ Testear publicación en cada plataforma

---

## 7. BASE DE DATOS SUPABASE

### 7.1 Tablas Existentes

| Tabla | Registros | Función |
|-------|-----------|---------|
| users | ~10 | Usuarios del sistema |
| properties | 14 | Villas/propiedades |
| bookings | 176 | Reservas |
| leads | 48 | Prospectos de venta |
| lead_events | ~100 | Historial de eventos de leads |
| guests | 16 | Huéspedes |
| payments | 19 | Pagos |
| whatsapp_messages | 38 | Mensajes WhatsApp |
| alerts | 5 | Alertas del sistema |
| ai_chat_history_old | ~50 | Historial OSIRIS |
| audit_logs | ~200 | Logs de auditoría |
| journey_settings | ~5 | Config Guest Journey |
| journey_events | ~10 | Eventos Guest Journey |

### 7.2 Tablas Pendientes de Crear

| Tabla | Módulo | Prioridad |
|-------|--------|-----------|
| media_jobs | Content Creator | 🔴 Alta |
| social_posts | Content Creator | 🔴 Alta |
| ai_chat_history_v2 | OSIRIS (futuro) | 🟢 Baja |

### 7.3 RPCs Disponibles

```sql
-- Stats por agente
get_lumina_stats()
get_banyu_stats()
get_kora_stats()
get_osiris_stats()

-- Dashboard
get_dashboard_stats()
get_active_alerts()

-- Follow-Up Engine
get_due_followup_leads()
update_lead_after_followup()
log_followup_event()
update_owner_notified()
```

---

## 8. PRIORIDADES DE IMPLEMENTACIÓN

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

## 9. REGLAS CRÍTICAS DEL PROYECTO

1. **NO crear tablas nuevas** en Supabase sin aprobación explícita
2. **NO modificar esquemas** sin usar migraciones documentadas
3. **Verificar workflows existentes** antes de crear nuevos
4. **Nomenclatura:** `WF-XX - Nombre - MYHOST Bizmate`
5. **JSON Body en n8n:** usar `JSON.stringify()` para evitar errores
6. **Testear en producción** solo después de verificar en manual trigger

---

## 10. CONTACTOS Y RECURSOS

### Documentación
- LUMINA specs: `/uploads/LUMINA_SPECIFICATION.md`
- OSIRIS brief: `/uploads/BRIEF_OSIRIS_MVP_21_ENERO_2026.md`
- Content Creator: `/uploads/CONTENT_RESUMEN_EJECUTIVO.txt`
- Supabase schema: `/uploads/SUPABASE_SCHEMA_DOCUMENTATION.md`

### Credenciales (en n8n)
- Supabase: `SJLQzwU9BVHEVAGc`
- OpenAI: `hlVVk9ThwmKbr4yS`
- SendGrid: `Y35BYbcV5SYfjBwc`

---

## 11. HISTORIAL DE CAMBIOS

| Fecha | Cambio |
|-------|--------|
| 23 Ene 2026 | Fix JSON Body en Call LUMINA (WF-03) |
| 23 Ene 2026 | Fix filtrado eventos VAPI en WF-02 KORA-POST-CALL |
| 23 Ene 2026 | Integración completa LUMINA ← KORA + BANYU |
| 23 Ene 2026 | Documentación Content Creator workflows |
| 22 Ene 2026 | Creación WF-SP-02 LUMINA |
| 21 Ene 2026 | Fix OSIRIS AI Assistant |

---

## 12. VILLA OWNER POINT OF VIEW (Información Crítica de Campo)

### 12.1 Perfil del Usuario Real

**NO son hoteles corporativos.** Son pequeños propietarios de villas (2-5 unidades) que manejan todo ellos mismos o con un equipo familiar.

### 12.2 Actividades Diarias del Owner

**Mañana:**
- Revisar reservas de hoy y próximas (OTA, WhatsApp, Instagram DM)
- Verificar que no haya double booking
- Revisar horarios de check-in/check-out
- Responder consultas de huéspedes (precio, disponibilidad, ubicación)

**Mediodía:**
- Follow-up de consultas no confirmadas
- Enviar instrucciones de pago o recordatorios
- Actualizar calendarios manualmente (Excel/Google Sheet/OTA)
- Revisar nuevas reviews en OTAs

**Tarde-Noche:**
- Asegurar que check-ins funcionen bien
- Comunicarse con huéspedes por WhatsApp
- Monitorear reservas de última hora
- Responder mensajes FUERA de horario laboral

**Problemas diarios principales:**
- Demasiados canales de reserva
- Trabajo mayormente manual
- Owner siempre "on-call"

### 12.3 Actividades Semanales

**Operaciones:**
- Revisar stock de sábanas y amenities
- Inspeccionar condición de villa (AC, agua, WiFi, limpieza)

**Ventas y Pricing:**
- Revisar precios de competidores
- Ajustar tarifas en OTAs
- Unirse o salirse de promociones OTA
- Recapitular reservas semanales
- Calcular ingresos aproximados
- Revisar pagos de OTAs (recibidos o pendientes)

**Marketing simple:**
- Postear en Instagram (si hay tiempo)
- Mensajear a huéspedes repetidos
- Follow-up de consultas antiguas

**Problemas semanales principales:**
- Sin datos limpios y estructurados
- Decisiones basadas en intuición
- Difícil saber qué canal funciona mejor

### 12.4 Actividades Mensuales

**Finanzas:**
- Calcular revenue total
- Calcular comisiones OTA
- Revisar cash flow (suficiente o ajustado)

**Evaluación de performance:**
- Tasa de ocupación mensual
- Mejores canales de reserva
- Comparación con mes anterior

**Operaciones y Mantenimiento:**
- Programar mantenimiento ligero
- Retrasar reparaciones si cash flow está ajustado
- Revisar necesidades de staff

**Estrategia de supervivencia:**
- Bajar precios durante baja demanda
- Abrir opciones de long-stay
- Enfocarse más en reservas directas

**Problemas mensuales principales:**
- Sin números en tiempo real
- Sin dashboard simple
- Decisiones se toman demasiado tarde

### 12.5 Lo que REALMENTE Necesitan los Villa Owners

**NO necesitan sistemas complejos.** Necesitan:

| Necesidad | Descripción |
|-----------|-------------|
| **Un solo lugar** | Para revisar reservas, ingresos y responder huéspedes |
| **Notificaciones** | No reportes largos |
| **Chat automation simple** | Sin complejidad |
| **Sync fácil** | Precios y calendarios |
| **Mobile-friendly** | Usable en teléfono |

### 12.6 Dirección Clara para MyHost BizMate AI

**AI que realmente ayuda a owners debe:**

| Debe | No debe |
|------|---------|
| **Recordar**, no instruir | Dar órdenes complicadas |
| **Resumir**, no añadir trabajo | Generar más tareas |
| **Tomar decisiones simples** | Requerir análisis del owner |

**Ejemplos de decisiones automáticas:**
- "Baja ocupación hoy → sugerir promoción"
- "Conflicto de reserva → alertar owner"
- "Dependencia OTA muy alta → promover reserva directa"

### 12.7 Desafíos con Costos de PMS y Comisiones

| Problema | Impacto |
|----------|---------|
| **PMS muy caro** | Fees fijos incluso con baja ocupación, features no usados |
| **Comisiones OTA 15-25%** | Márgenes muy delgados, especialmente en long-stays |
| **Dependencia de OTAs** | Pocas reservas directas, datos controlados por OTAs |
| **Presión de cash flow** | Pagos OTA no son real-time, pero gastos sí |
| **Sistemas muy complejos** | PMS "demasiado complicado" para necesidades reales |

### 12.8 Comportamientos Durante Períodos de Baja Ocupación

1. **Bajar precios agresivamente** - Last-minute deals, descuentos long-stay
2. **Aumentar dependencia de OTAs** - Unirse a todas las promociones
3. **Depender de WhatsApp e Instagram** - Reservas manuales, follow-ups personales
4. **Retrasar gastos** - Posponer mantenimiento, reducir staff
5. **Enfocarse en repeat guests** - Ofertas directas sin OTA
6. **Operaciones muy manuales** - Excel/Google Sheets, sync manual

### 12.9 Mapeo de Mercado (Cómo Piensan los Owners)

**Los owners NO hacen segmentación formal.** Mapean basándose en observación diaria:

| Segmento | Características | Villa ideal |
|----------|-----------------|-------------|
| **Parejas** | 1 bedroom, piscina privada, privacidad | Enfoque en estética |
| **Familias** | 2-3 bedrooms, cocina, cerca de servicios | Enfoque en valor |
| **Grupos/Amigos** | Múltiples habitaciones, espacios compartidos | Costo dividido |
| **Long-stay/Remote** | Tarifas mensuales, internet estable | Grandes descuentos |

**Problema principal:** El mapeo vive en la cabeza del owner, no en datos.

### 12.10 Cómo Fijan Precios (Realidad)

1. Revisar villas cercanas en OTA
2. Comparar: habitaciones, facilities, ratings
3. Lógica: "Un poco más barato" o "mismo precio + descuento"
4. Cambios manuales y frecuentes

**Durante baja demanda:**
- Bajar precios rápidamente
- Activar promociones OTA
- Aceptar precios negociados por WhatsApp

**Problema:** Owners son reactivos, no estratégicos. No conocen el impacto real de cambios de precio.

### 12.11 Rol de MyHost BizMate (Según Necesidades Reales)

**A. Ayudar con Market Mapping (sin complejidad)**
- Agrupar reservas por: número de huéspedes, duración, tipo de unidad
- Mostrar: mercado más frecuente, más rentable, más larga estadía
- Output: "Mi villa es mejor para parejas long-stay que familias"

**B. Ayudar con Pricing Realista**
- Mostrar precios de competidores cercanos
- Dar recomendaciones simples: subir/bajar, activar promociones
- Mostrar impacto: precio vs ocupación vs revenue
- Output: "Bajar precios weekday 10% esta semana"

**C. Ayudar a Alcanzar el Mercado Correcto**
- Mostrar canales más efectivos por mercado
- Soportar reservas directas: recordatorios repeat guests, auto-replies WhatsApp
- Reducir dependencia OTA
- Output: "Repeat guests funcionan mejor que promociones OTA"

**D. Hablar el Idioma del Owner (no del sistema)**
- Notificaciones cortas
- Insights diarios
- Sin términos técnicos
- Mobile-friendly

### 12.12 AI Content Creation - Perspectiva del Villa Owner

**Realidad de campo:**
- Presupuesto limitado
- Uso inconsistente de fotógrafos/creadores
- Contenido: irregular, inconsistente, sin dirección clara

**Lo que owners QUIEREN:**
- Contenido SÍ
- Complejidad NO
- Costo alto NO
- Procesos que consumen tiempo NO

**Principios de AI Content Creation:**

| AI NO reemplaza | AI SÍ reemplaza |
|-----------------|-----------------|
| Creadores | Procesos complicados |
| | Costos altos |
| | Inconsistencia |

**Meta:** "Owners pueden crear contenido sin sentir que están creando contenido"

### 12.13 Plan de Acción: Content Creation con AI

**1. Input del Owner (lo más simple posible)**
- Grabar videos con smartphone
- Clips cortos (5-10 segundos)
- Sin edición, sin pensamiento técnico

**Footage recomendado (5-10 clips):**
- Entrada de villa
- Piscina
- Habitación
- Baño/bañera
- Vista de mañana o atardecer
- Detalles pequeños (café, toallas, cortinas moviéndose)
- Atmósfera tranquila y relajante

**Nota importante:** No necesita ser perfecto. Real > Cinematic.

**2. AI como Editor Automático**
- Seleccionar mejores clips
- Ordenar secuencia de video
- Cortar clips para coincidir con beats de música
- Ajustar duración para Reels/TikTok/Stories

**El owner NO necesita:**
- Editar manualmente
- Pensar en transiciones
- Manejar timing

**3. Selección de Mood y Música por Prompts**

| Mood Prompts | Music Prompts |
|--------------|---------------|
| "Calm morning villa" | "Soft piano" |
| "Romantic couple stay" | "Chill lo-fi" |
| "Tropical slow living" | "Tropical acoustic" |
| "Minimal luxury" | "Luxury ambient" |
| "Rainy day mood" | |

**AI automáticamente ajusta:** tonos de color, tempo, ritmo de edición

**4. Output Instantáneo, Listo para Publicar**
- Video completamente editado
- Auto-formateado para: Instagram Reels, TikTok, Stories
- Caption y hashtags básicos (opcional)

**Owner solo necesita:** Preview → Approve → Post

**5. Consistencia de Contenido (El problema más grande que AI resuelve)**

| Sin AI | Con AI |
|--------|--------|
| Contenido 1x al mes | 1 sesión de grabación = 1-2 semanas de contenido |
| Posting inconsistente | Posting regular |
| Dependiente de creadores externos | 100% controlado por owner |

**6. Rol Estratégico (Más allá de edición)**

Content conectado a performance del negocio:
- Baja ocupación → sugerir contenido promocional
- Muchas reservas de parejas → sugerir contenido romántico
- Muchos long-stays → sugerir contenido "living experience"

**Ejemplo:** "Ocupación weekday baja → postear contenido de 'calm weekday stay'"

**7. Por qué esto encaja perfectamente con villas pequeñas**
- ✅ Affordable
- ✅ No requiere skills especiales
- ✅ Eficiente en tiempo
- ✅ No requiere equipo especial
- ✅ Puede hacerlo el owner

---

## 13. RESUMEN EJECUTIVO - PROBLEMAS Y SOLUCIONES

### Problemas Reales de Villa Owners

| Área | Problema |
|------|----------|
| **Mercado** | Target market no claro |
| **Pricing** | Decisiones reactivas, no estratégicas |
| **Canales** | Alta dependencia de OTAs |
| **Contenido** | No pueden pagar creadores caros |
| **Operaciones** | Todo manual, siempre "on-call" |

### Rol de MyHost BizMate

| Transformación |
|----------------|
| Intuición → Datos |
| Datos → Decisiones |
| Decisiones → Resultados reales |

### Cómo Cada Agente Resuelve Problemas Reales

| Agente | Problema que resuelve |
|--------|----------------------|
| **KORA** | Owner siempre on-call → AI responde llamadas 24/7 |
| **BANYU** | Demasiados canales → Centraliza WhatsApp con AI |
| **LUMINA** | Decisiones basadas en feeling → Datos y recomendaciones |
| **OSIRIS** | Sin dashboard simple → KPIs y alertas en lenguaje simple |
| **Content Creator** | Sin contenido consistente → AI genera automáticamente |

---

*Documento generado: 23 de Enero de 2026*
*Versión: 2.1 - Incluye Villa Owner Point of View*
