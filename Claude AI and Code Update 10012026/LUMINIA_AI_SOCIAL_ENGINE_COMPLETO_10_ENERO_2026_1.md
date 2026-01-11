# 🚀 LUMINIA.AI + SOCIAL CONTENT ENGINE — DOCUMENTO COMPLETO
## Fecha: 10 Enero 2026 | MY HOST BizMate

---

## 🚀 PROMPT DE ARRANQUE PARA NUEVA SESIÓN

```
Soy Jose, founder de MY HOST BizMate.

MY HOST BizMate es un SaaS de IA para boutique hotels y villas en Bali/Southeast Asia.

PILARES DEL PRODUCTO:
- LUMINIA AI = Sales & Leads (WhatsApp AI, Voice, Follow-ups, Social)
- BANYU = Guest & Revenue (Bookings, Pricing, Upsells)
- OSIRIS = Operations & Control (Tasks, Staff, Inventory)

CLIENTE PILOTO: Izumi Hotel (7 villas luxury en Ubud, Bali - abre verano 2026)
- Property ID: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Tenant ID: c24393db-d318-4d75-8bbf-0fa240b9c1db
- WhatsApp: +62 813 2576 4867

STACK TÉCNICO:
- Frontend: React + Tailwind (Vercel)
- Backend: Supabase (Postgres + Auth + RPC)
- Workflows: n8n en Railway (v1.123.5)
- WhatsApp: Chakra HQ API
- Voice: VAPI.ai
- Social: Buffer (pendiente)

WORKFLOWS EXISTENTES:
- WF-SP-01 Inbound Lead Handler ✅ (ID: CBiOKCQ7eGnTJXQd)
- WF-SP-02 AI Sales Assistant ❌ PENDIENTE
- WF-SP-03 Follow-Up Engine ✅ (ID: HndGXnQAEyaYDKFZ)
- WF-SOC-01 Social Content Engine ❌ PENDIENTE
- WhatsApp AI Concierge ✅
- VAPI Voice Assistant ✅

PENDIENTES CRÍTICOS:
1. Crear tablas Supabase (autonomy_policies, followup_jobs, lead_messages, social_posts, social_events)
2. Crear WF-SP-02 AI Sales Assistant
3. Crear WF-SOC-01 Social Content Engine
4. UI: Módulo LUMINIA visible en menú

DOCUMENTOS DE REFERENCIA:
- MYHOST_BIZMATE_DOCUMENTO_MASTER (Pitch + Gaps + Estado)
- LUMINIA_AI_SOCIAL_ENGINE_COMPLETO (Detalle técnico workflows)

¿En qué te puedo ayudar hoy?
```

---

---

## 📋 RESUMEN EJECUTIVO

### Cambio de Paradigma
**ANTES**: Sistema dividido en versiones (V1/V2) con funcionalidades limitadas por fase.
**AHORA**: Sistema COMPLETO desde el inicio, diferenciado por NIVEL DE AUTONOMÍA controlado por reglas.

### Qué es LUMINIA.AI
LUMINIA.AI es el **sistema completo de Sales & Leads** de MY HOST BizMate que incluye:
- **WF-SP-01** Inbound Lead Handler (Captura multicanal) ✅ EXISTE
- **WF-SP-02** AI Sales Assistant (El cerebro conversacional) ❌ PENDIENTE
- **WF-SP-03** Follow-up Engine (Secuencias automatizadas) ✅ EXISTE

### Qué es Social Content Engine (NUEVO)
Sistema de **publicación automática** en redes sociales:
- **WF-SOC-01** Social Content Engine (IG + FB) ❌ PENDIENTE
- **WF-SOC-02** Meta DMs → LUMINIA (Leads loop) ❌ PENDIENTE (Fase 2)

### Principio Arquitectónico
```
LUMINIA.AI = PIENSA / DECIDE (Ventas)
SOCIAL ENGINE = GENERA / PUBLICA (Marketing)
MCP CENTRAL = EJECUTA (Tools reutilizables)
n8n = ORQUESTA flujos y estados
Supabase = ESTADO, MEMORIA y AUDITORÍA
```

---

## 📊 ESTADO ACTUAL DE WORKFLOWS

### LUMINIA.AI (Sales & Leads)

| Workflow | ID | Estado |
|----------|-----|--------|
| **WF-SP-01** Inbound Lead Handler (XXIII) | `CBiOKCQ7eGnTJXQd` | ✅ EXISTE |
| **WF-SP-02** AI Sales Assistant | - | ❌ PENDIENTE |
| **WF-SP-03** Follow-Up Engine v8 (XXV) | `HndGXnQAEyaYDKFZ` | ✅ EXISTE |

### Social Content Engine (Marketing)

| Workflow | ID | Estado |
|----------|-----|--------|
| **WF-SOC-01** Social Content Engine (IG+FB) | - | ❌ PENDIENTE |
| **WF-SOC-02** Meta DMs → LUMINIA | - | ❌ FASE 2 |

---

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MY HOST BIZMATE                                 │
├─────────────────────────────────┬───────────────────────────────────────────┤
│                                 │                                           │
│      🌟 LUMINIA.AI              │      📱 SOCIAL CONTENT ENGINE             │
│      (Sales & Leads)            │      (Marketing)                          │
│                                 │                                           │
│  ┌─────────┐ ┌─────────┐       │  ┌─────────────────────────────┐          │
│  │ WF-SP-01│→│ WF-SP-02│       │  │      WF-SOC-01              │          │
│  │ Inbound │ │AI Sales │       │  │  Social Content Engine      │          │
│  │   ✅    │ │   ❌    │       │  │         ❌                  │          │
│  └────┬────┘ └────┬────┘       │  └─────────────┬───────────────┘          │
│       │           │            │                │                          │
│       │     ┌─────┴─────┐      │                │                          │
│       │     │ WF-SP-03  │      │       ┌────────┴────────┐                 │
│       │     │Follow-Up  │      │       │   WF-SOC-02     │                 │
│       │     │    ✅     │      │       │ DMs → LUMINIA   │                 │
│       │     └───────────┘      │       │   ❌ (Fase 2)   │                 │
│       │                        │       └────────┬────────┘                 │
│       │                        │                │                          │
│       └────────────────────────┼────────────────┘                          │
│                                │                                           │
│                    LEADS ENTRAN A LUMINIA                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │      SUPABASE         │
                        │  leads, social_posts  │
                        │  events, policies     │
                        └───────────────────────┘
```

---

## 📱 WF-SOC-01: SOCIAL CONTENT ENGINE (IG + FB)

### Descripción
Workflow que automatiza la publicación de contenido en Instagram y Facebook, con generación de captions por IA.

### Flujo

```
┌───────────────────────────┐
│   Google Sheets           │
│   "ContentQueue"          │
│   (status = READY)        │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  VALIDATE + ENRICH        │
│  tenant_id, property_id,  │
│  asset_url, type          │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  AI COPY GENERATION       │
│  caption + hashtags + CTA │
│  (GPT-4 / Claude)         │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  PUBLISH VIA BUFFER       │
│  Instagram + Facebook     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  LOG TO SUPABASE          │
│  social_posts table       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│  UPDATE SHEET             │
│  status = PUBLISHED/FAILED│
│  result_ig_url, fb_url    │
└───────────────────────────┘
```

### Google Sheet "ContentQueue" (Columnas)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| tenant_id | UUID | Multi-tenant obligatorio |
| property_id | UUID | Propiedad |
| asset_type | string | `video` o `image` |
| asset_url | URL | Link de Drive o URL público |
| caption_hint | string | Ej: "sunset villa", "3BR Ubud" |
| offer_hint | string | Ej: "20% off Jan", "airport pickup" |
| cta_target | string | `whatsapp` o `website` |
| whatsapp_link | URL | wa.me/xxxxx?text=... |
| website_link | URL | Landing page |
| platforms | string | `IG,FB` |
| scheduled_at | datetime | ISO datetime (opcional) |
| status | string | `NEW` → `READY` → `PUBLISHED` / `FAILED` |
| result_ig_url | URL | (auto) URL del post en IG |
| result_fb_url | URL | (auto) URL del post en FB |
| last_error | string | (auto) Mensaje de error |

### Nodos n8n (Resumen)

| # | Nodo | Función |
|---|------|---------|
| 1 | CRON | Trigger cada 10 min |
| 2 | Google Sheets Read | Leer filas status=READY |
| 3 | IF | Si no hay filas → STOP |
| 4 | Split In Batches | Procesar 1 a 1 |
| 5 | Function | Validar + normalizar |
| 6 | AI Node | Generar caption + hashtags |
| 7 | Buffer | Publicar en IG + FB |
| 8 | Supabase Insert | Log en social_posts |
| 9 | Google Sheets Update | status=PUBLISHED + URLs |
| 10 | Error Handler | Si falla → status=FAILED |

### AI Prompt (Caption Generator)

```
System:
You are a luxury hospitality social media copywriter for Bali villas/hotels.
Output must be JSON.

Rules:
- Premium, clean, not spammy
- Short lines
- One CTA
- 8-15 hashtags (Bali, villa, luxury, etc.)
- If offer_hint exists, mention it naturally
- Mention WhatsApp if cta_target=whatsapp

OUTPUT JSON:
{
  "caption": "...",
  "hashtags": ["#bali", "..."],
  "cta": "...",
  "post_text": "caption + hashtags"
}
```

### Template de Referencia
- **Nombre**: Generate & Schedule Social Media Content with GPT-4 and Buffer from Google Sheets
- **URL**: https://n8n.io/workflows/7517
- **Por qué**: Completo, estable, usa Sheets + IA + Buffer

---

## 🔗 WF-SOC-02: Meta DMs → LUMINIA (Fase 2)

### Descripción
Workflow separado que captura DMs de Instagram/Facebook y los envía a LUMINIA para convertirlos en leads.

### Flujo (Futuro)

```
Meta Webhook (DM recibido)
        │
        ▼
Normalizar mensaje
        │
        ▼
Call WF-SP-01 Inbound Lead Handler
{
  tenant_id,
  source_channel: "instagram" / "facebook",
  external_thread_id,
  last_message_text
}
        │
        ▼
Lead entra al ciclo LUMINIA
```

**Estado**: ❌ FASE 2 (no bloquea MVP)

---

## 🗄️ SCHEMA SUPABASE COMPLETO

### Tablas LUMINIA.AI (Sales)

#### `autonomy_policies` (NUEVA)
```sql
CREATE TABLE autonomy_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id),
  can_send_without_approval BOOLEAN DEFAULT true,
  can_offer_discount BOOLEAN DEFAULT false,
  max_discount_percent INTEGER DEFAULT 0,
  max_followups INTEGER DEFAULT 6,
  max_messages_per_day INTEGER DEFAULT 5,
  quiet_hours_start INTEGER,
  quiet_hours_end INTEGER,
  coexistence_pause_hours INTEGER DEFAULT 4,
  escalation_keywords TEXT[] DEFAULT ARRAY['complaint', 'refund', 'manager'],
  escalate_on_high_value BOOLEAN DEFAULT true,
  escalate_on_discount_request BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `followup_jobs` (NUEVA)
```sql
CREATE TABLE followup_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  job_type VARCHAR(50) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  executed_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'pending',
  message_draft TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_followup_jobs_pending 
ON followup_jobs(scheduled_at) WHERE status = 'pending';
```

#### `lead_messages` (NUEVA)
```sql
CREATE TABLE lead_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id),
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  channel VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_messages_lead 
ON lead_messages(lead_id, created_at DESC);
```

### Tablas Social Content Engine (Marketing)

#### `social_posts` (NUEVA)
```sql
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  asset_type VARCHAR(20) NOT NULL,
  asset_url TEXT NOT NULL,
  caption TEXT,
  hashtags TEXT[],
  cta_target VARCHAR(20),
  platform_ig BOOLEAN DEFAULT false,
  platform_fb BOOLEAN DEFAULT false,
  publish_status VARCHAR(20) DEFAULT 'QUEUED',
  ig_post_url TEXT,
  fb_post_url TEXT,
  provider_response JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_social_posts_tenant 
ON social_posts(tenant_id, created_at DESC);
```

#### `social_events` (NUEVA - Audit)
```sql
CREATE TABLE social_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  event_type VARCHAR(50) NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎯 PLAN DE ACCIÓN COMPLETO

### FASE 1: LUMINIA AI - Tablas + WF-SP-02 (Prioridad Alta)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 1.1 | Crear tabla `autonomy_policies` | 30 min | ⏳ |
| 1.2 | Crear tabla `followup_jobs` | 30 min | ⏳ |
| 1.3 | Crear tabla `lead_messages` | 30 min | ⏳ |
| 1.4 | Insertar policy default Izumi | 15 min | ⏳ |
| 1.5 | Crear WF-SP-02 (10 nodos) | 4-6h | ⏳ |
| 1.6 | Conectar WF-SP-01 → WF-SP-02 | 30 min | ⏳ |

### FASE 2: SOCIAL CONTENT ENGINE (Prioridad Media)

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 2.1 | Crear tabla `social_posts` | 30 min | ⏳ |
| 2.2 | Crear tabla `social_events` | 15 min | ⏳ |
| 2.3 | Crear Google Sheet "ContentQueue" | 30 min | ⏳ |
| 2.4 | Configurar cuenta Buffer | 1h | ⏳ |
| 2.5 | Conectar Buffer con IG + FB | 1h | ⏳ |
| 2.6 | Crear WF-SOC-01 | 3-4h | ⏳ |
| 2.7 | Test con 3 posts reales | 1h | ⏳ |

### FASE 3: INTEGRACIÓN + TESTING

| # | Tarea | Tiempo | Estado |
|---|-------|--------|--------|
| 3.1 | Renombrar WF-02 → WF-SP-03 | 15 min | ⏳ |
| 3.2 | Testing E2E LUMINIA | 2h | ⏳ |
| 3.3 | Testing E2E Social Engine | 1h | ⏳ |

### FASE 4: EXTRAS (Después)

| # | Tarea | Estado |
|---|-------|--------|
| 4.1 | WF-SOC-02: DMs → LUMINIA | ⏳ |
| 4.2 | UI: Renombrar a LUMINIA AI | ⏳ |
| 4.3 | TikTok integration | ⏳ |
| 4.4 | Adapters IG/FB/Web para WF-SP-01 | ⏳ |

---

## 📌 RESUMEN PENDIENTES (SIMPLE)

### 🔴 CRÍTICO

| # | Tarea |
|---|-------|
| 1 | Crear 3 tablas LUMINIA (autonomy_policies, followup_jobs, lead_messages) |
| 2 | Crear WF-SP-02 AI Sales Assistant |
| 3 | Conectar WF-SP-01 → WF-SP-02 |

### 🟡 IMPORTANTE

| # | Tarea |
|---|-------|
| 4 | Crear 2 tablas Social (social_posts, social_events) |
| 5 | Crear Google Sheet "ContentQueue" |
| 6 | Crear WF-SOC-01 Social Content Engine |
| 7 | Configurar Buffer + IG/FB |

### 🟢 DESPUÉS

| # | Tarea |
|---|-------|
| 8 | WF-SOC-02: DMs → LUMINIA |
| 9 | Renombrar WF-02 → WF-SP-03 |
| 10 | UI: Sales & Leads → LUMINIA AI |
| 11 | TikTok (fase siguiente) |

---

## ✅ YA HECHO

- WF-SP-01 Inbound Handler (XXIII) ✅
- WF-SP-03 Follow-Up Engine v8 (XXV) ✅
- WhatsApp AI Concierge ✅
- VAPI Voice Assistant ✅
- Backup workflows ✅
- n8n actualizado a 1.123.5 ✅

---

## 🖥️ CAMBIOS EN UI (DASHBOARD/MENU)

### Renombrar "Sales & Leads" → "LUMINIA AI (Sales & Leads)"

**Archivos típicos a modificar:**

| Archivo | Cambio |
|---------|--------|
| `Sidebar.jsx` | Label del menú |
| `routes.js` | Nombre de ruta |
| `SalesLeads.jsx` | Título de página |

**Iconos sugeridos (Heroicons):**
- `SparklesIcon` - Para LUMINIA AI
- `MegaphoneIcon` - Para Social Content

### ⚠️ PENDIENTE: Compartir código del frontend para documentar cambios exactos

---

## 📞 INFO DE CONTACTO IZUMI HOTEL

- **WhatsApp**: +62 813 2576 4867 (24/7)
- **Property ID**: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- **Tenant ID**: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- **Test Owner Phone**: `+34619794604`

---

## 🔗 URLs E IDs

| Recurso | Valor |
|---------|-------|
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |
| WF-SP-01 | CBiOKCQ7eGnTJXQd |
| WF-SP-03 | HndGXnQAEyaYDKFZ |
| Template Social | https://n8n.io/workflows/7517 |

---

*Documento generado: 10 Enero 2026*
*Estado: WF-SP-01 ✅ | WF-SP-02 ❌ | WF-SP-03 ✅ | WF-SOC-01 ❌*
