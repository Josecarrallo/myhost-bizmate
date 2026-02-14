# RESUMEN SESIÓN 13 ENERO 2026 - MY HOST BIZMATE

## 🎯 LOGRO PRINCIPAL

Implementamos **Master Event v1.0**, un contrato estándar que permite que todos los flujos de entrada hablen el mismo idioma.

---

## 📊 ARQUITECTURA ACTUAL

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CLIENT TOUCHPOINTS                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ WhatsApp │ │  Voice   │ │ Website  │ │  Social  │ │  Email   │  │
│  │  (Hotel) │ │   Call   │ │   Form   │ │ IG/FB/TT │ │          │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │            │            │            │            │         │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     MASTER EVENT v1.0                                │
│                  (Formato estándar de entrada)                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  01 - INBOUND LEAD HANDLER (WF-SP-01 CLEAN)                         │
│  ─────────────────────────────────────────                          │
│  • Valida Master Event                                              │
│  • Busca lead existente                                             │
│  • Clasifica intent (info/price/availability/booking)               │
│  • INSERT nuevo o UPDATE existente                                  │
│  • Log en lead_events                                               │
│  • Output: Lead State = NEW/ENGAGED/HOT                             │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
                                  ▼
                          ┌───────────────┐
                          │   SUPABASE    │
                          │  ───────────  │
                          │  • leads      │
                          │  • lead_events│
                          │  • bookings   │
                          └───────┬───────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ 02 - BANYU    │       │ 04 - LUMINA   │       │ 05 - GUEST    │
│ AI Sales     │       │ Follow-Up     │       │ Journey       │
│ (WhatsApp)   │       │ Engine        │       │               │
│ ✅ FUNCIONANDO│       │ ⏳ PENDIENTE   │       │ ⏳ PENDIENTE   │
└───────────────┘       └───────────────┘       └───────────────┘

┌───────────────┐       ┌───────────────┐
│ 03 - KORA    │       │ OSIRIS        │
│ Voice AI     │       │ Operations    │
│ (VAPI)       │       │ & Control     │
│ ⏳ PENDIENTE  │       │ ⏳ PENDIENTE   │
└───────────────┘       └───────────────┘
```

---

## 📋 MASTER EVENT v1.0 - ESPECIFICACIÓN

```json
{
  "schema_version": "1.0",
  "event_id": "uuid",
  "event_type": "lead_inbound",
  "source": "whatsapp|voice|web|social|email",
  "timestamp": "ISO_DATE",
  
  "tenant": {
    "tenant_id": "uuid",
    "property_id": "uuid"
  },
  
  "contact": {
    "name": "string",
    "phone": "string (required)",
    "email": "string|null",
    "language": "en|es|id"
  },
  
  "message": {
    "channel": "whatsapp|voice|web|instagram|facebook|tiktok|email",
    "message_id": "string",
    "text": "string (required)",
    "raw": "object (original payload)"
  },
  
  "context": {
    "intent": "string|null",
    "checkin": "date|null",
    "checkout": "date|null",
    "guests": "number|null",
    "budget": "number|null",
    "property_hint": "string|null"
  },
  
  "meta": {
    "flow_origin": "string (workflow identifier)",
    "trace_id": "uuid"
  }
}
```

---

## ✅ WORKFLOWS FUNCIONANDO

### WF-SP-01 CLEAN - Inbound Lead Handler
- **ID:** BX2X9P1xvZBnpr1p
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/BX2X9P1xvZBnpr1p
- **Webhook:** `/webhook/inbound-lead-v3`
- **Estado:** ✅ Activo

**Flujo:**
```
Webhook → Validate Master Event → Buscar Lead → Merge → Clasificar → Set Intent 
→ Switch Lead (New/Existing) → INSERT/UPDATE → Log Created/Received 
→ Switch Canal → Check Email → Email/Respond
```

### BANYU - WhatsApp AI Concierge
- **ID:** ORTMMLk6qVKFhELp
- **URL:** https://n8n-production-bb2d.up.railway.app/workflow/ORTMMLk6qVKFhELp
- **Estado:** ✅ Activo

**Flujo:**
```
Webhook WhatsApp → Filter → Extract Text → AI Agent → Send WhatsApp 
→ Build Master Event → Send to WF-SP-01
```

---

## ⏳ PENDIENTE - PRIORIDADES

### 🔴 PRIORIDAD 1: KORA (Voice AI - VAPI)
- Estructurar salida de VAPI → Master Event v1.0
- Conectar a WF-SP-01 CLEAN
- Mismo patrón que BANYU

### 🟡 PRIORIDAD 2: Follow-Up Engine (LUMINA)
- Leer leads desde Supabase por estado
- Secuencias automatizadas:
  - NOT booked → automated follow-ups
  - Booked → pre-arrival messages
  - 24h/48h/72h sequences
  - 7-day re-engagement

### 🟡 PRIORIDAD 3: Guest Journey
- Post-booking automation
- Arrival info & directions
- Daily tips
- In-stay upsells
- Post-checkout review request

### 🟢 PRIORIDAD 4: Content Creator
- Flujo pendiente (información ya proporcionada)

### 🟢 PRIORIDAD 5: OSIRIS (Operations & Control)
- Dashboard owner
- Booking calendar
- KPIs & analytics
- Manual override

---

## 🗄️ MIGRACIÓN SUPABASE APLICADA

```sql
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'web',
ADD COLUMN IF NOT EXISTS current_phase text DEFAULT 'sales',
ADD COLUMN IF NOT EXISTS last_event text,
ADD COLUMN IF NOT EXISTS ai_control boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS standard_model jsonb;
```

---

## 🔧 DATOS DE CONFIGURACIÓN

### Izumi Hotel (Pilot Client)
- **Tenant ID:** c24393db-d318-4d75-8bbf-0fa240b9c1db
- **Property ID:** 18711359-1378-4d12-9ea6-fb31c0b1bac2
- **WhatsApp:** +62 813 2576 4867
- **Ubicación:** Jl Raya Andong N. 18, Ubud, Bali
- **Apertura:** Summer 2026

### n8n Railway
- **URL:** https://n8n-production-bb2d.up.railway.app
- **Versión:** 1.123.5

### Supabase
- **Project:** jjpscimtxrudtepzwhag

---

## 📝 PRUEBAS REALIZADAS Y EXITOSAS

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Lead nuevo via WhatsApp (INSERT) | ✅ |
| 2 | Lead existente via WhatsApp (UPDATE) | ✅ |
| 3 | Intent "booking" → state HOT | ✅ |
| 4 | Lead events registrados | ✅ |
| 5 | Booking completo creado | ✅ |

---

## 🐛 PROBLEMA RESUELTO HOY

**Error:** `crypto is not defined` en nodo Build Master Event

**Solución:** Reemplazar `crypto.randomUUID()` por función custom:
```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

## 📎 WORKFLOWS TEMPORALES (PUEDEN ELIMINARSE)

- TEST - Disparar WF-SP-01: xKs6N6gKjG2clnyr
- WF-SP-01 antiguo: CBiOKCQ7eGnTJXQd (desactivar)
- TEMP workflows varios de la sesión anterior

---

## 🎯 REGLA DE ORO ESTABLECIDA

> **Cualquier fuente de entrada → Master Event v1.0 → WF-SP-01 → Supabase**

Todos los flujos hablan el mismo idioma. Un único punto de entrada para leads.
