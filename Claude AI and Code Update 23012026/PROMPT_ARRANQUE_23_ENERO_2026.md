# PROMPT DE ARRANQUE - 23 Enero 2026
## Sesión: LUMINA.AI + Próximos Workflows

**Usa este prompt para iniciar la sesión con Claude Code**

---

```
Hola Claude Code,

Continuamos con MY HOST BizMate. Ayer completamos OSIRIS.AI exitosamente.
Hoy vamos a trabajar en LUMINA.AI y otros workflows.

# CONTEXTO PROYECTO

**Stack:** React 18.2 + Vite + Tailwind + Supabase + n8n
**Repo:** C:\myhost-bizmate
**Branch:** backup-antes-de-automatizacion
**Live URL:** https://my-host-bizmate.vercel.app
**n8n:** https://n8n-production-bb2d.up.railway.app
**Supabase:** jjpscimtxrudtepzwhag
**Tenant ID (Izumi):** c24393db-d318-4d75-8bbf-0fa240b9c1db

---

# ESTADO AGENTES AI (23 Enero 2026)

| Agente | Función | Estado |
|--------|---------|--------|
| **KORA** | Voice AI - Reservas telefónicas | ✅ Funcionando |
| **BANYU** | WhatsApp AI - Concierge 24/7 | ✅ Funcionando |
| **OSIRIS** | Owner Operations & Control | ✅ **PRODUCCIÓN** (completado ayer) |
| **LUMINA** | Sales AI - Orquestación leads | 🔧 **A IMPLEMENTAR HOY** |
| **AURA** | Content AI - Marketing | 📋 Pendiente |
| **HESTIA** | Guest Experience AI | 📋 Pendiente |

---

# TRABAJO COMPLETADO AYER (22 Enero 2026)

## OSIRIS.AI - ✅ PRODUCCIÓN

**Endpoint V2 funcionando:**
```
POST https://n8n-production-bb2d.up.railway.app/webhook/ai/chat-v2
Body: { tenant_id, message }
```

**Características:**
- Multilingual support (EN/ES/ID)
- 6 Tools conectadas (dashboard stats, payments, bookings, check-ins, alerts, WhatsApp)
- Structured JSON output (reply, kpis, table, actions, meta)
- Logging en Supabase (ai_chat_history_v2, audit_logs)
- Frontend integrado y probado

**Archivo principal:** `src/components/AISystems/AISystems.jsx`

**Workflow n8n:** WF-OSIRIS-MVP (activo y funcionando)

**Documentación completa:**
- `Claude AI and Code Update 22012026/OSIRIS_PROXIMOS_PASOS.md`
- `Claude AI and Code Update 23012026/RESUMEN_EJECUTIVO_22_ENERO_2026.md`

---

# OBJETIVO HOY: LUMINA.AI (Sales & Leads)

## 1. ¿Qué es LUMINA?

**LUMINA.AI** es el agente de Sales & Lead Orchestration.

**Funciones principales:**
- Gestionar pipeline de leads
- Priorizar leads hot/warm/cold
- Automatizar follow-ups
- Analizar conversión
- Proponer acciones de ventas
- Integrar con KORA (phone leads) y BANYU (WhatsApp leads)

**Diferencia con OSIRIS:**
- OSIRIS = Operations (what's happening NOW)
- LUMINA = Sales (who are we talking to, what's next)

---

## 2. DECISIÓN ARQUITECTÓNICA CRÍTICA

### Opción A: LUMINA en n8n (como OSIRIS actual)
```
Frontend → n8n → Claude API → Supabase → Frontend
```
**Pros:**
- Consistente con OSIRIS
- Logging centralizado en n8n
- Fácil integración con workflows existentes

**Contras:**
- Latencia ~3-5 segundos
- Más hops de red

### Opción B: LUMINA en Claude Code (frontend directo)
```
Frontend → Claude API (directo) → Supabase → Frontend
```
**Pros:**
- Latencia ~1-2 segundos (mucho más rápido)
- Mejor UX para queries interactivas
- Menos dependencias

**Contras:**
- API key de Claude en frontend (necesita proxy o Edge Function)
- Logging más manual
- Diferente arquitectura que OSIRIS

### Opción C: Híbrida
- LUMINA conversacional → Frontend directo (rápido)
- LUMINA automated workflows → n8n (scheduled tasks, notifications)

**¿Qué opción prefieres para LUMINA?**

---

## 3. TOOLS NECESARIAS PARA LUMINA

Basándonos en la función de Sales & Leads, LUMINA necesitará:

### LUMINA-T01: get_leads_pipeline
**Función:** Obtener leads activos con scoring
**Source:** Tabla `leads` con filtros y JOIN
**Retorna:** Array de leads con score, status, last_contact, source

### LUMINA-T02: get_hot_leads
**Función:** Leads con alto potencial de conversión
**Source:** Tabla `leads` WHERE score > 80 AND status != 'won'
**Retorna:** Lista de leads hot con detalle

### LUMINA-T03: get_lead_history
**Función:** Historial de interacciones con un lead
**Source:** Tabla `lead_events` + conversaciones KORA/BANYU
**Retorna:** Timeline completo del lead

### LUMINA-T04: suggest_followup_action
**Función:** Proponer próximo paso con un lead
**Logic:** AI analiza historial y sugiere (call, email, WhatsApp, etc.)
**Retorna:** Action con needs_confirm=true

### LUMINA-T05: get_conversion_stats
**Función:** Métricas de conversión del pipeline
**Source:** RPC `get_lumina_stats(tenant_id)` - **YA EXISTE en Supabase**
**Retorna:** Conversion rate, avg time to close, revenue by source

### LUMINA-T06: draft_followup_message
**Función:** Generar mensaje personalizado para follow-up
**Logic:** AI drafts basado en contexto del lead
**Retorna:** Draft message con variables

**¿Alguna tool adicional que consideres necesaria?**

---

## 4. TABLAS SUPABASE DISPONIBLES

### Ya existen (creadas en sesiones anteriores):
```sql
-- LEADS (core)
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  tenant_id UUID,
  name TEXT,
  phone TEXT,
  email TEXT,
  status TEXT, -- 'new', 'contacted', 'qualified', 'won', 'lost'
  source TEXT, -- 'whatsapp', 'vapi', 'web', 'booking.com', etc.
  score INTEGER, -- 0-100 (lead scoring)
  last_contact_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
);

-- LEAD_EVENTS (historial)
CREATE TABLE lead_events (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  event_type TEXT, -- 'call', 'whatsapp', 'email', 'status_change'
  event_data JSONB,
  created_at TIMESTAMPTZ
);

-- BOOKINGS (para conversiones)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  property_id UUID,
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT,
  source TEXT,
  created_at TIMESTAMPTZ
);
```

### RPCs disponibles:
- ✅ `get_lumina_stats(tenant_id)` - Ya existe
- ✅ `get_osiris_stats(tenant_id)` - Para referencia
- ✅ `get_active_alerts(tenant_id)`

---

## 5. FORMATO JSON OUTPUT (Mismo que OSIRIS)

```json
{
  "reply": "You have 12 hot leads. Top priority: John Doe (score 95) - no contact in 3 days.",
  "agent": "lumina",
  "intent": "insight|list|action",
  "kpis": [
    {"label": "Hot Leads", "value": "12", "delta": "+3"},
    {"label": "Conversion Rate", "value": "23%", "delta": "+5%"}
  ],
  "table": {
    "columns": [
      {"key": "name", "label": "Lead Name"},
      {"key": "score", "label": "Score"},
      {"key": "status", "label": "Status"},
      {"key": "last_contact", "label": "Last Contact"}
    ],
    "rows": [...]
  },
  "actions": [
    {
      "id": "send_followup_whatsapp",
      "label": "Send follow-up via WhatsApp",
      "needs_confirm": true,
      "payload": {...}
    }
  ],
  "meta": {
    "execution_id": "...",
    "sources": ["table:leads", "rpc:get_lumina_stats"],
    "timestamp": "..."
  }
}
```

---

## 6. FRONTEND - YA PREPARADO

El frontend en `src/components/AISystems/AISystems.jsx` ya tiene:
- ✅ Agente LUMINA definido (líneas 47-60)
- ✅ Icon: Target
- ✅ Gradient: from-[#FF6B35] via-[#FF8C42] to-[#FFA94D]
- ✅ Quick questions: "Show hot leads", "Pending follow-ups", etc.

**Solo necesita:** Cambiar de mock response a real endpoint (como hicimos con OSIRIS)

---

## 7. PLAN DE TRABAJO PROPUESTO

### Fase 1: Diseño (30 min)
1. Decidir arquitectura (n8n vs Claude Code)
2. Definir 6 tools finales
3. Revisar quick questions del frontend

### Fase 2: Backend (1-2 horas)
**Si n8n:**
- Crear workflow WF-LUMINA-MVP
- Implementar 6 tools
- Configurar Claude AI Agent
- Logging en Supabase

**Si Claude Code:**
- Crear service layer en frontend
- Implementar tools como funciones
- Llamada directa a Claude API
- Logging manual a Supabase

### Fase 3: Integración Frontend (30 min)
- Actualizar AISystems.jsx
- Cambiar mock response por real endpoint
- Probar quick questions

### Fase 4: Testing (30 min)
- Test 1: "Show hot leads"
- Test 2: "Conversion rate this month"
- Test 3: "Draft follow-up for [lead name]"

---

## 8. DECISIÓN PENDIENTE DE AYER

**Tema:** Arquitectura general de agentes conversacionales

**Observación:** OSIRIS tiene latencia ~3-5 segundos con n8n.
Para LUMINA (y futuros agentes conversacionales), considerar arquitectura híbrida:

- **Queries síncronas** (OSIRIS, LUMINA) → Claude Code (frontend directo)
- **Workflows asíncronos** (KORA post-call, BANYU automation) → n8n

**Ventajas híbrido:**
- Mejor UX para owner (respuestas rápidas)
- Mantener n8n para automatizaciones complejas
- Separación de concerns

**¿Decidimos arquitectura híbrida hoy?**

---

## 9. OTROS WORKFLOWS (Prioridad 2)

Además de LUMINA, tenemos pendientes:

### Workflows KORA/BANYU (ya funcionan, posibles mejoras):
- ✅ WF-01-MCP-KORA-TOOLS (MCP server para VAPI)
- ✅ WF-02-KORA-POST-CALL (procesa structured outputs)
- ✅ WF-03-LEAD-HANDLER (CRM - crea/actualiza leads)
- ✅ WF-04-BOOKING-NOTIFICATIONS (WhatsApp + Email)

### Nuevos workflows a considerar:
- 📋 Daily Lead Digest (enviar resumen diario a owner)
- 📋 Automated Follow-ups (WhatsApp scheduled messages)
- 📋 Lead Scoring Update (recalcular scores nightly)
- 📋 Revenue Forecasting (predictive analytics)

**¿Alguno de estos tiene prioridad hoy?**

---

## 10. ARCHIVOS CLAVE

### Frontend:
- `src/components/AISystems/AISystems.jsx` - Chat UI (6 agentes)
- `src/components/VoiceAssistant/VoiceAssistant.jsx` - KORA voice button
- `src/components/Dashboard/OwnerExecutiveSummary.jsx` - Dashboard principal

### Documentación:
- `Claude AI and Code Update 21012026/BRIEF_OSIRIS_MVP_21_ENERO_2026.md` - Spec OSIRIS
- `Claude AI and Code Update 21012026/prompt-sesion-kora-21-enero-2026_1.md` - Estado KORA
- `Claude AI and Code Update 22012026/OSIRIS_PROXIMOS_PASOS.md` - Implementación OSIRIS
- `Claude AI and Code Update 23012026/RESUMEN_EJECUTIVO_22_ENERO_2026.md` - Trabajo de ayer

### Supabase:
- `supabase/schema.sql` - Schema principal
- `supabase/FINAL-schema-ai-assistant.sql` - Tablas AI

### n8n Workflows:
- Ver en: https://n8n-production-bb2d.up.railway.app
- WF-OSIRIS-MVP (activo)
- WF-KORA-POST-CALL (activo)
- WF-LEAD-HANDLER (activo)

---

## 11. COMANDOS ÚTILES

```bash
# Dev server (ya corriendo)
npm run dev  # localhost:5173

# Ver estado git
git status
git branch  # backup-antes-de-automatizacion

# Ver archivos recientes
ls "Claude AI and Code Update 23012026/"
```

---

## 12. PREGUNTAS PARA ARRANCAR LA SESIÓN

1. **¿Qué arquitectura prefieres para LUMINA?**
   - A) n8n (como OSIRIS actual)
   - B) Claude Code (frontend directo, más rápido)
   - C) Híbrida (conversacional en frontend, automation en n8n)

2. **¿Las 6 tools propuestas cubren lo necesario para LUMINA?**
   - get_leads_pipeline
   - get_hot_leads
   - get_lead_history
   - suggest_followup_action
   - get_conversion_stats
   - draft_followup_message

3. **¿Algún workflow adicional tiene prioridad hoy?**
   - Daily Lead Digest
   - Automated Follow-ups
   - Lead Scoring Update
   - Otro?

4. **¿Empezamos con LUMINA o prefieres revisar/mejorar algo de OSIRIS primero?**

---

¡Listo para empezar! ¿Por dónde arrancamos hoy?
```

---

**Última actualización:** 22 Enero 2026 - 21:00 WIB
**Próxima sesión:** 23 Enero 2026
**Objetivo:** LUMINA.AI + Workflows adicionales
