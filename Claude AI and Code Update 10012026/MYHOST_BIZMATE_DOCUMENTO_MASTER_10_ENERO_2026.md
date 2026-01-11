# 🏨 MY HOST BIZMATE — DOCUMENTO MASTER COMPLETO
## Fecha: 10 Enero 2026 | Incluye: Arquitectura + Pitch + Gap Analysis

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

# PARTE 1: CÓMO PRESENTAR Y VENDER MYHOST BIZMATE

---

## 🎯 ELEVATOR PITCH (30 segundos)

> **"MyHost BizMate es el copiloto de IA para boutique hotels y villas en Bali.**
> 
> **No es un PMS más. Es tu socio de negocio que:**
> - **Vende por ti** (WhatsApp, Voice, Social)
> - **Sigue leads automáticamente** (sin que hagas nada)
> - **Publica contenido** (IG, FB con un click)
> - **Te dice qué hacer** (no te muestra gráficas)
> 
> **Tú decides. La IA ejecuta.**"

---

## 💼 PROPUESTA DE VALOR POR AUDIENCIA

### Para el Owner (Decisor)

| Dolor | Solución BizMate |
|-------|------------------|
| "No tengo tiempo para responder WhatsApp" | AI Concierge 24/7 que califica y responde |
| "No sé si mis precios están bien" | Market Intelligence con recomendaciones |
| "Los leads se me pierden" | LUMINIA: Pipeline visible + follow-ups automáticos |
| "No publico en redes porque es trabajo" | Social Engine: sube foto, IA hace el resto |
| "Quiero saber qué pasa sin abrir 10 apps" | Daily Brief: "Esto pasó, esto importa, decide esto" |

### Para el Manager (Usuario)

| Dolor | Solución BizMate |
|-------|------------------|
| "Respondo lo mismo 100 veces" | AI responde FAQ, tú solo cierras |
| "No sé qué leads son importantes" | Lead scoring + alertas automáticas |
| "El owner me pregunta y no tengo datos" | Dashboard con métricas reales |
| "Pierdo tiempo entre sistemas" | Todo en un lugar: bookings, leads, mensajes |

---

## 🏆 DIFERENCIADORES CLAVE

```
╔════════════════════════════════════════════════════════════════════════════╗
║                     ¿POR QUÉ MYHOST BIZMATE?                               ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║   ❌ NO ES:                          ✅ SÍ ES:                             ║
║   ─────────                          ────────                              ║
║   • Otro PMS                         • Copiloto de IA para tu negocio      ║
║   • Software que TÚ operas           • IA que opera POR TI                 ║
║   • Dashboards con gráficas          • Respuestas y recomendaciones        ║
║   • Herramienta genérica             • Diseñado para villas en Bali        ║
║   • Chatbot básico                   • Agente de ventas que cierra         ║
║                                                                            ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║   COMPETENCIA:                       BIZMATE:                              ║
║   ────────────                       ────────                              ║
║   "Aquí están tus datos"             "Esto es lo que debes hacer"         ║
║   "Configura tu chatbot"             "Ya está respondiendo por ti"        ║
║   "Integra con 50 apps"              "Ya está conectado, solo usa"        ║
║   "Mira tus métricas"                "Tienes 3 leads calientes, actúa"    ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## 📦 ESTRUCTURA DE PRODUCTO (3 PILARES)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MYHOST BIZMATE                                  │
│                    "Tu Copiloto de IA para Hospitality"                 │
├─────────────────────┬─────────────────────┬─────────────────────────────┤
│                     │                     │                             │
│   🌟 LUMINIA        │   💧 BANYU          │   👁️ OSIRIS                 │
│   Sales & Leads     │   Guest & Revenue   │   Operations & Control      │
│                     │                     │                             │
│   • Lead Inbox      │   • Bookings        │   • Task Management         │
│   • Pipeline CRM    │   • Guest Journey   │   • Staff Coordination      │
│   • AI Follow-ups   │   • Pricing AI      │   • Inventory               │
│   • Social Content  │   • Revenue Mgmt    │   • Maintenance             │
│   • WhatsApp/Voice  │   • Upsells         │   • Reporting               │
│                     │                     │                             │
│   "VENDE"           │   "RENTABILIZA"     │   "CONTROLA"                │
│                     │                     │                             │
└─────────────────────┴─────────────────────┴─────────────────────────────┘
```

---

## 💰 MODELO DE PRICING (SUGERIDO)

| Plan | Precio/mes | Incluye |
|------|------------|---------|
| **Starter** | $99 | 1 property, WhatsApp AI, Basic CRM |
| **Growth** | $199 | 3 properties, + Voice AI, + Social Engine |
| **Scale** | $399 | 10 properties, + Market Intelligence, + API |
| **Enterprise** | Custom | Unlimited, White-label, Dedicated support |

**Add-ons:**
- Voice minutes: $0.10/min después de 100 min
- Extra properties: $50/property
- Custom integrations: Quote

---

## 🗣️ SCRIPT DE DEMO (5 minutos)

```
1. HOOK (30 seg)
   "¿Cuántos leads recibiste esta semana por WhatsApp?"
   "¿Cuántos cerraste? ¿Cuántos se perdieron?"
   "Te muestro cómo BizMate cambia eso."

2. PROBLEMA (1 min)
   "Mira tu WhatsApp ahora. Mensajes sin responder.
   Leads que preguntaron hace 3 días y nadie siguió.
   Eso es dinero que se fue."

3. SOLUCIÓN - LUMINIA (2 min)
   "Esto es LUMINIA. Mira:
   - Este lead llegó hace 2 horas
   - La IA ya respondió, calificó, y agendó follow-up
   - Tú solo ves: 'Lead caliente, 5 noches, llámalo'
   - Un click: la IA hace la llamada"

4. SOCIAL ENGINE (1 min)
   "¿Y marketing? Sube una foto.
   La IA genera caption, hashtags, CTA.
   Publica en IG y FB. Tú no haces nada."

5. CIERRE (30 seg)
   "Esto ya funciona. Izumi Hotel lo usa.
   ¿Cuándo empezamos contigo?"
```

---

# PARTE 2: GAP ANALYSIS — LO QUE FALTA

---

## 🚨 ANÁLISIS DE GAPS CRÍTICOS

### Gap 1: SALES & LEADS MODULE (LUMINIA)
**Status**: ⚠️ PARCIALMENTE CUBIERTO

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Módulo claro en el menú "Sales & Leads" | Los owners no lo encuentran | 🔴 |
| Inbox unificado (IG/WA/Email/Social) | Leads dispersos en canales | 🔴 |
| Pipeline visual (New→Engaged→Proposal→Booked→Lost) | No ven el funnel | 🔴 |
| Separación clara Lead vs Guest | Confusión conceptual | 🟡 |
| Follow-up logic visible al owner | No entienden qué hace la IA | 🟡 |

**Por qué importa:**
> Los owners no piensan en "mensajes". Piensan en "¿Este contacto convirtió o no?"

---

### Gap 2: MARKET & COMPETITIVE INTELLIGENCE
**Status**: ❌ NO IMPLEMENTADO

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Snapshots de precios de competencia | No saben si están caros/baratos | 🔴 |
| Señales de demanda (temporada, eventos) | Pricing reactivo, no proactivo | 🔴 |
| Insights simples ("Estás sobreprecio") | Solo ven datos, no acciones | 🟡 |
| Recomendaciones de IA (no data cruda) | Parálisis por análisis | 🟡 |

**Por qué importa:**
> Esto convierte a BizMate de "herramienta" a "socio de decisiones".

---

### Gap 3: CONTENT & SOCIAL AUTOMATION
**Status**: ❌ NO IMPLEMENTADO (ALTO VALOR)

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Intake simple de contenido (Drive/Upload) | Fricción para subir assets | 🟡 |
| Auto-generación de captions (IG/FB/TikTok) | No publican porque es trabajo | 🔴 |
| Auto-posting o scheduled posting | Inconsistencia en redes | 🔴 |
| Visibilidad en dashboard ("IA publicó X") | No saben qué hizo la IA | 🟡 |

**Por qué importa:**
> Los hoteles no publican porque es trabajo. La IA debe manejar visibilidad, no solo operaciones.

---

### Gap 4: VOICE ASSISTANT COMO CANAL DE VENTAS
**Status**: ⚠️ SUBUTILIZADO

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Posicionamiento claro: Voice = canal de cierre | Se ve como "feature", no como arma | 🟡 |
| Reglas: cuándo escalar de chat → llamada | Oportunidades perdidas | 🔴 |
| Logs + outcomes (llamada → booking o no) | No miden ROI de voice | 🟡 |

**Por qué importa:**
> Los bookings de alto valor cierran más rápido por voz. Es diferenciador premium.

---

### Gap 5: OWNER INTELLIGENCE DASHBOARD
**Status**: ⚠️ BÁSICO

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Daily/Weekly AI Brief ("Qué pasó, qué importa") | Owners abren app y no entienden | 🔴 |
| Alertas en vez de dashboards | Información pasiva, no activa | 🔴 |
| Decisiones "Aprobar/Rechazar" (no ops manual) | Owners hacen trabajo de staff | 🟡 |

**Por qué importa:**
> Los owners quieren RESPUESTAS, no gráficas.

---

### Gap 6: PRODUCT STORY EN UI
**Status**: ⚠️ NECESITA ALINEACIÓN

| Falta | Impacto | Prioridad |
|-------|---------|-----------|
| Naming fuerte (LUMINIA/BANYU/OSIRIS) | Confusión de qué hace cada cosa | 🟡 |
| Modelo mental claro para el owner | No confían si no entienden | 🔴 |
| Onboarding que explique los 3 pilares | Abandono temprano | 🟡 |

**Por qué importa:**
> Si el owner no lo entiende al instante, no lo va a usar.

---

## 📊 MATRIZ DE GAPS (RESUMEN)

```
                    IMPACTO
                    Alto ─────────────────────────────►
                    │
         Alta       │  🔴 Sales Module    🔴 Daily Brief
                    │  🔴 Social Engine   🔴 Market Intel
    P               │
    R               │
    I    Media      │  🟡 Voice Rules     🟡 Pipeline Visual
    O               │  🟡 Content Intake  🟡 Naming/Story
    R               │
    I               │
    D    Baja       │  🟢 Logs Voice      🟢 Onboarding
    A               │
    D               │
                    ▼
```

---

## ✅ PLAN DE ACCIÓN CONSOLIDADO

### 🔴 CRÍTICO (Próximas 2 semanas)

| # | Tarea | Módulo | Gap que resuelve |
|---|-------|--------|------------------|
| 1 | Crear tablas LUMINIA | Supabase | Gap 1 |
| 2 | Crear WF-SP-02 AI Sales | n8n | Gap 1 |
| 3 | Conectar WF-SP-01 → WF-SP-02 | n8n | Gap 1 |
| 4 | Crear WF-SOC-01 Social Engine | n8n | Gap 3 |
| 5 | UI: Módulo "LUMINIA AI" visible | React | Gap 1, 6 |
| 6 | Daily Brief básico | React/n8n | Gap 5 |

### 🟡 IMPORTANTE (Mes 1)

| # | Tarea | Módulo | Gap que resuelve |
|---|-------|--------|------------------|
| 7 | Pipeline visual (Kanban leads) | React | Gap 1 |
| 8 | Inbox unificado (WA/IG/Email) | React | Gap 1 |
| 9 | Reglas Voice → escalate to call | n8n | Gap 4 |
| 10 | Market Intel MVP (scraping básico) | n8n | Gap 2 |
| 11 | Naming alignment (LUMINIA/BANYU/OSIRIS) | UI | Gap 6 |

### 🟢 DESPUÉS (Mes 2+)

| # | Tarea | Gap que resuelve |
|---|-------|------------------|
| 12 | Competitor price snapshots | Gap 2 |
| 13 | Demand signals (events, seasons) | Gap 2 |
| 14 | Voice call outcomes tracking | Gap 4 |
| 15 | Approve/Reject decisions UI | Gap 5 |
| 16 | TikTok integration | Gap 3 |

---

# PARTE 3: ESTADO ACTUAL DE WORKFLOWS

---

## 📊 WORKFLOWS EXISTENTES vs PENDIENTES

### LUMINIA.AI (Sales & Leads)

| Workflow | ID | Estado | Notas |
|----------|-----|--------|-------|
| WF-SP-01 Inbound Handler (XXIII) | `CBiOKCQ7eGnTJXQd` | ✅ | Multi-tenant, dedupe, classify |
| WF-SP-02 AI Sales Assistant | - | ❌ | 10 nodos, PRIORIDAD MÁXIMA |
| WF-SP-03 Follow-Up Engine (XXV) | `HndGXnQAEyaYDKFZ` | ✅ | 6-step timeline |

### Social Content Engine (Marketing)

| Workflow | ID | Estado | Notas |
|----------|-----|--------|-------|
| WF-SOC-01 Social Content Engine | - | ❌ | Buffer + IG/FB |
| WF-SOC-02 Meta DMs → LUMINIA | - | ❌ | Fase 2 |

### Otros

| Workflow | Estado |
|----------|--------|
| WhatsApp AI Concierge | ✅ |
| VAPI Voice Assistant | ✅ |
| MCP Central | ✅ |
| Guest Journey Scheduler | ✅ |

---

## 🗄️ TABLAS SUPABASE

### Existentes ✅
- leads, lead_events, properties, tenants, bookings, guests

### Nuevas (Pendientes) ❌
- autonomy_policies (LUMINIA)
- followup_jobs (LUMINIA)
- lead_messages (LUMINIA)
- social_posts (Social Engine)
- social_events (Social Engine)

---

## 📞 INFO IZUMI HOTEL (PILOTO)

| Campo | Valor |
|-------|-------|
| Property ID | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |
| Tenant ID | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| WhatsApp | +62 813 2576 4867 |
| Owner Test | +34 619 794 604 |
| n8n | https://n8n-production-bb2d.up.railway.app |
| Supabase | https://jjpscimtxrudtepzwhag.supabase.co |

---

## 📋 CHECKLIST RÁPIDO DE PENDIENTES

```
🔴 CRÍTICO
├── [ ] Tablas Supabase LUMINIA (3)
├── [ ] Tablas Supabase Social (2)
├── [ ] WF-SP-02 AI Sales Assistant
├── [ ] Conectar WF-SP-01 → WF-SP-02
├── [ ] WF-SOC-01 Social Content Engine
└── [ ] UI: Módulo LUMINIA visible en menú

🟡 IMPORTANTE
├── [ ] Pipeline visual (Kanban)
├── [ ] Inbox unificado
├── [ ] Daily Brief
├── [ ] Renombrar WF-02 → WF-SP-03
└── [ ] Configurar Buffer + IG/FB

🟢 DESPUÉS
├── [ ] Market Intelligence
├── [ ] Voice call tracking
├── [ ] WF-SOC-02 DMs → LUMINIA
├── [ ] TikTok
└── [ ] Naming LUMINIA/BANYU/OSIRIS en UI
```

---

## 💡 BOTTOM LINE

> **BizMate ya hace muchas cosas.**
> 
> **Lo que falta NO son más features.**
> 
> **Es: CLARIDAD, INTELIGENCIA, y PENSAMIENTO SALES-FIRST.**

---

*Documento Master generado: 10 Enero 2026*
*Versión: 3.0 (incluye Pitch + Gap Analysis)*
