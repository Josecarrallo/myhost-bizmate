# RECORDATORIO - PENDIENTES POST AUTOPILOT FASE 1

**Fecha:** 28 Enero 2026
**Estado:** AUTOPILOT FASE 1 en proceso de completarse esta mañana

---

## 🔴 HOY - AUTOPILOT FASE 1

### Completar esta mañana (con Claude AI):
1. ✅ Probar REJECT en WF-AUTOPILOT Actions V2
2. ✅ Probar fallback/default case
3. ✅ Activar workflows en n8n
4. ✅ Probar WF-D2 Payment Protection
5. ✅ **Test end-to-end desde MYHOST Bizmate App**

**Prompt de arranque:** `PROMPT_ARRANQUE_28ENE_FASE1_FINAL.md`

---

## 🟡 PENDIENTE - CANALES DE ENTRADA ADICIONALES

### Problema Identificado:

**Flujo actual de leads:**
```
Lead entra (solo WhatsApp actualmente)
   ↓
WF-SP-01 Inbound Lead Handler
   ↓
WF-SP-02 LUMINA analiza y decide
   ↓
WF-04 Follow-Up Engine ejecuta
   ↓
BANYU / KORA hablan con el huésped
```

### Canales que FALTAN implementar:

| Canal | Estado | Webhook Entrada | Prioridad |
|-------|--------|-----------------|-----------|
| **WhatsApp** | ✅ Funcionando | ChakraHQ webhook | N/A |
| **Web (Direct Booking)** | ❌ Falta | Booking Engine form → webhook | 🔴 Alta |
| **Instagram DM** | ❌ Falta | Meta Graph API webhook | 🟡 Media |
| **TikTok DM** | ❌ Falta | TikTok API webhook | 🟢 Baja |
| **Email** | ❌ Falta | SendGrid Inbound Parse | 🟡 Media |
| **Facebook Messenger** | ❌ Falta | Meta Graph API webhook | 🟢 Baja |

---

## 📋 ESPECIFICACIÓN TÉCNICA - CANALES ADICIONALES

### 1. WEB (Direct Booking) - 🔴 PRIORIDAD ALTA

**Flujo:**
```
Owner activa Booking Engine en MY WEB
   ↓
Guest llena formulario en /site/:slug/book
   ↓
POST /webhook/lead/web → WF-SP-01 Inbound Lead Handler
   ↓
Crea lead en Supabase (source: 'web')
   ↓
LUMINA analiza → Follow-Up → BANYU responde por WhatsApp
```

**Datos del formulario web:**
```json
{
  "source": "web",
  "property_id": "uuid",
  "guest_name": "string",
  "guest_email": "string",
  "guest_phone": "string (con country code)",
  "check_in": "date",
  "check_out": "date",
  "guests": "number",
  "message": "string (opcional)",
  "utm_source": "string (tracking)",
  "referrer_url": "string"
}
```

**Archivos a modificar:**
- `src/components/PublicSite/PublicSite.jsx` - Añadir booking form
- `src/services/leadService.js` - Crear servicio de envío webhook
- WF-SP-01 en n8n - Ya está listo (multi-source)

---

### 2. INSTAGRAM DM - 🟡 PRIORIDAD MEDIA

**Flujo:**
```
Guest envía DM a @izumi_resort
   ↓
Meta Graph API webhook → n8n
   ↓
POST /webhook/lead/instagram → WF-SP-01
   ↓
Crea lead (source: 'instagram')
   ↓
LUMINA analiza → Follow-Up → Respuesta automática Instagram + WhatsApp
```

**Requisitos:**
- Instagram Business Account
- Meta App configurada
- Webhook subscription a `messages`
- Token de acceso con permisos `instagram_manage_messages`

**Datos de Instagram webhook:**
```json
{
  "object": "instagram",
  "entry": [{
    "id": "instagram_account_id",
    "messaging": [{
      "sender": {"id": "user_instagram_id"},
      "recipient": {"id": "page_instagram_id"},
      "timestamp": 1234567890,
      "message": {
        "mid": "message_id",
        "text": "Hi, I want to book for 3 nights"
      }
    }]
  }]
}
```

**Workflow n8n:**
- Nuevo: `WF-INBOUND-INSTAGRAM` → Normaliza → Llama WF-SP-01

---

### 3. TIKTOK DM - 🟢 PRIORIDAD BAJA

**Flujo similar a Instagram:**
```
Guest envía DM a @izumiresort TikTok
   ↓
TikTok Messaging API webhook
   ↓
POST /webhook/lead/tiktok → WF-SP-01
   ↓
Crea lead (source: 'tiktok')
   ↓
LUMINA analiza → Follow-Up → Respuesta TikTok + WhatsApp
```

**Requisitos:**
- TikTok Business Account
- TikTok Developer App
- Webhook para Direct Messages
- OAuth token con permisos de mensajería

**Status:** Baja prioridad (menos adoption en Bali hospitality)

---

### 4. EMAIL - 🟡 PRIORIDAD MEDIA

**Flujo:**
```
Guest envía email a bookings@izumiresort.com
   ↓
SendGrid Inbound Parse webhook
   ↓
POST /webhook/lead/email → WF-SP-01
   ↓
Crea lead (source: 'email')
   ↓
LUMINA analiza → Follow-Up → Auto-reply email + WhatsApp
```

**Requisitos:**
- Dominio custom (izumiresort.com)
- SendGrid Inbound Parse configurado
- MX records apuntando a SendGrid

**Datos de SendGrid Inbound Parse:**
```json
{
  "from": "guest@example.com",
  "to": "bookings@izumiresort.com",
  "subject": "Booking inquiry for July 2026",
  "text": "Email body plain text",
  "html": "Email body HTML",
  "attachments": []
}
```

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### FASE 1: Web (Direct Booking) - Esta semana
**Estimación:** 4-6 horas

1. **Frontend (Claude Code):**
   - Añadir booking form en PublicSite.jsx
   - Crear leadService.js con método `submitWebLead()`
   - Validación de formulario + UX de envío

2. **Backend (Claude AI):**
   - Crear WF-INBOUND-WEB en n8n
   - Normalizar datos → POST a WF-SP-01
   - Configurar auto-respuesta email + WhatsApp

3. **Testing:**
   - Crear lead desde https://nismauma.lovable.app clone
   - Verificar lead creado en Supabase
   - Verificar LUMINA procesa
   - Verificar BANYU responde por WhatsApp

---

### FASE 2: Instagram DM - Próxima semana
**Estimación:** 6-8 horas

1. Configurar Meta Developer App
2. Crear WF-INBOUND-INSTAGRAM
3. Implementar auto-respuesta Instagram
4. Testing con cuenta de prueba

---

### FASE 3: Email - Próxima semana
**Estimación:** 3-4 horas

1. Configurar SendGrid Inbound Parse
2. Crear WF-INBOUND-EMAIL
3. Implementar auto-respuesta email
4. Testing con emails de prueba

---

### FASE 4: TikTok (Backlog)
**Estimación:** 6-8 horas
**Cuando:** Solo si hay demanda real de guests via TikTok

---

## 📊 ARQUITECTURA MULTI-CANAL

```
┌─────────────────────────────────────────────────────────┐
│                   PUNTOS DE ENTRADA                      │
│  WhatsApp │ Web │ Instagram │ Email │ TikTok │ Messenger│
└────┬──────┴──┬──┴─────┬─────┴───┬───┴───┬────┴─────┬────┘
     │         │        │         │       │          │
     └─────────┴────────┴─────────┴───────┴──────────┘
                         │
                         ▼
           ┌─────────────────────────────┐
           │  WF-SP-01 Inbound Handler   │
           │  (Normaliza todos los leads)│
           └──────────────┬──────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │ Supabase Leads │
                 │ (source field) │
                 └────────┬───────┘
                          │
                          ▼
           ┌──────────────────────────┐
           │  WF-SP-02 LUMINA         │
           │  (Análisis inteligente)  │
           └──────────┬───────────────┘
                      │
                      ▼
           ┌──────────────────────────┐
           │  WF-04 Follow-Up Engine  │
           │  (Ejecuta estrategia)    │
           └──────────┬───────────────┘
                      │
                      ▼
           ┌──────────────────────────┐
           │  BANYU / KORA            │
           │  (Conversación humanizada)│
           └──────────────────────────┘
```

### Tabla `leads` ya soporta multi-canal:

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  source TEXT NOT NULL,  -- 'whatsapp', 'web', 'instagram', 'email', 'tiktok'
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  message TEXT,
  status TEXT,  -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  assigned_to TEXT,  -- 'LUMINA', 'BANYU', 'KORA', 'HUMAN'
  metadata JSONB,  -- Canal-specific data
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## ✅ CRITERIOS DE ÉXITO

**Canal considerado "implementado" cuando:**

1. ✅ Webhook recibe datos del canal
2. ✅ WF-SP-01 procesa y crea lead en Supabase
3. ✅ LUMINA analiza el lead
4. ✅ Follow-Up Engine ejecuta estrategia
5. ✅ BANYU/KORA responde al guest
6. ✅ Owner ve el lead en MYHOST Bizmate dashboard
7. ✅ Testing end-to-end exitoso

---

## 📝 DOCUMENTOS RELACIONADOS

- **AUTOPILOT_MODULE_REFERENCE_COMPLETE.md** - Referencia técnica AUTOPILOT
- **DOCUMENTO_MAESTRO_MYHOST_BIZMATE_27ENE2026.md** - Estado global proyecto
- **NISMARA_UMA_VILLA_REFERENCE.md** - Template MY WEB para booking directo

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

**HOY (28 Enero):**
1. ✅ Completar AUTOPILOT FASE 1 con Claude AI
2. ✅ Probar todo desde MYHOST Bizmate App
3. ✅ Validar checklist completo

**MAÑANA (29 Enero):**
1. 🔴 Implementar canal WEB (Direct Booking)
2. 🔴 Añadir booking form a PublicSite.jsx
3. 🔴 Crear WF-INBOUND-WEB en n8n
4. 🔴 Testing end-to-end web → LUMINA → BANYU

**Próxima semana:**
1. 🟡 Implementar Instagram DM
2. 🟡 Implementar Email inbound
3. 🟢 (Opcional) TikTok DM

---

*Documento generado: 28 Enero 2026*
*Recordatorio para no olvidar canales adicionales después de AUTOPILOT*
