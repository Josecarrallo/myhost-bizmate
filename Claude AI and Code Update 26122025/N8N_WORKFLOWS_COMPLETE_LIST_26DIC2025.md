# N8N WORKFLOWS - LISTA COMPLETA
## MY HOST BIZMATE - 15 Flujos Totales
### Fecha: 26 de Diciembre 2025

---

## 📊 RESUMEN EJECUTIVO

**Total de flujos:** 15
- 🔴 **Prioridad Alta:** 4 flujos (Agentes AI)
- 🟡 **Prioridad Media:** 8 flujos (Communication + Marketing + Enrichment)
- 🟢 **Prioridad Baja:** 3 flujos (Dashboard Widgets)

**Estado actual:**
- ✅ Frontend listo: 2 flujos (#5, #6 - Guest Communication)
- ⏳ Pendientes: 13 flujos

---

## 🔴 PRIORIDAD ALTA (4 FLUJOS)

### 1. Rediseño VAPI + n8n
**Tipo:** Voice
**Webhook:** `/webhook/vapi-izumi-fix`
**Estado:** 🟡 En rediseño (esperando templates de Stephane y Nate Herk)

**Descripción:**
- Voice assistant para bookings por teléfono
- VAPI maneja toda la AI
- n8n solo backend (tools execution)
- Cliente piloto: Izumi Hotel

**Funcionalidades:**
- Check availability
- Calculate price
- Create booking
- Update booking
- Send confirmation

**Documentación:**
- `VAPI_N8N_Documentation_25122025.md`
- `Vapi_Izumi_Hotel_WORKING_25122025.json`

---

### 2. WhatsApp Concierge Agent
**Tipo:** Agent
**Webhook:** `/wa/external-agent`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- External AI Agent para guests vía WhatsApp
- Concierge 24/7
- Información sobre property, local area, services
- NO maneja bookings (eso es VAPI)

**Funcionalidades:**
- Responder preguntas sobre property
- Recomendaciones locales (restaurants, attractions)
- Service requests
- Check-in/check-out info

**Provider:** ChakraHQ

**Tablas Supabase:**
- `wa_conversations` - Chat history
- `wa_errors` - Error tracking

---

### 3. Internal Agent (PMS/Operations)
**Tipo:** Agent (Backend/API)
**Webhook:** Backend API (no webhook público)
**Estado:** ✅ **COMPLETADO** (26 Dic 2025)

**Descripción:**
- AI Assistant para operaciones internas del owner
- Chat en dashboard
- Análisis de KPIs en tiempo real
- Scope limitado a PMS topics

**Implementado:**
- OpenAI integration (gpt-4o-mini)
- COS System Prompt
- Monthly limits (300 msg/mes)
- Rate limiting (5 msg/2min)
- Real-time KPIs from Supabase

**Commit:** `5942626`
**Documentación:** `INTERNAL_AI_AGENT_IMPLEMENTATION_26DIC2025.md`

---

### 4. External Agent (Market/Growth)
**Tipo:** Agent (Backend/API)
**Webhook:** Backend API (no webhook público)
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- AI Agent para análisis de mercado y crecimiento
- Acceso a datos externos (market trends, competitors)
- Recommendations basadas en OpenAI + context externo
- Solo para owner

**Funcionalidades:**
- Market analysis
- Competitor pricing
- Growth recommendations
- Marketing strategies

**Nota:** Diferente del Internal Agent (PMS) - este tiene acceso a datos externos

---

## 🟡 PRIORIDAD MEDIA (8 FLUJOS)

### 5. Send Email to Guest ✅
**Tipo:** Communication
**Webhook:** `/communications/send-email`
**Estado:** ✅ **FRONTEND COMPLETADO** (26 Dic 2025)
**Pendiente:** n8n webhook

**Descripción:**
- Envío de emails a guests desde Guest Profile
- 5 templates predefinidos
- Variable replacement
- History tracking

**Frontend implementado:**
- Modal SendCommunicationModal
- Template selector
- Subject + message editor
- Status tracking

**Backend pendiente:**
- n8n workflow con SendGrid
- Update communications_log status
- Error handling

**Commit:** `5c0454c`
**Documentación:** `GUEST_COMMUNICATION_IMPLEMENTATION_26DIC2025.md`

---

### 6. Send WhatsApp to Guest ✅
**Tipo:** Communication
**Webhook:** `/communications/send-whatsapp`
**Estado:** ✅ **FRONTEND COMPLETADO** (26 Dic 2025)
**Pendiente:** n8n webhook

**Descripción:**
- Envío de WhatsApp a guests desde Guest Profile
- 5 templates predefinidos
- Variable replacement
- History tracking

**Frontend implementado:**
- Modal SendCommunicationModal (mismo que email)
- Template selector
- Message editor
- Status tracking

**Backend pendiente:**
- n8n workflow con ChakraHQ/Twilio
- Update communications_log status
- Error handling

**Commit:** `5c0454c`
**Documentación:** `GUEST_COMMUNICATION_IMPLEMENTATION_26DIC2025.md`

---

### 7. Content Triggers
**Tipo:** Marketing Automation
**Webhook:** `/automation/content-trigger`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Automation triggers based on content events
- Auto-publish to social media
- Auto-send marketing emails
- Auto-create campaigns

**Triggers:**
- New property added
- New review received
- Booking milestone reached
- Seasonal event approaching

---

### 8. Social Publishing
**Tipo:** Marketing Automation
**Webhook:** `/automation/publish`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Auto-publish content to social media
- Facebook, Instagram, Twitter/X
- Schedule posts
- Analytics tracking

**Funcionalidades:**
- Create post from template
- Upload images
- Schedule publication
- Track engagement

---

### 9. Review Amplification
**Tipo:** Marketing
**Webhook:** (No especificado)
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Amplify positive reviews
- Share on social media
- Send thank you messages
- Request more reviews from happy guests

**Triggers:**
- 5-star review received
- Positive keywords detected
- Guest completes stay

---

### 10. WhatsApp Campaigns
**Tipo:** Marketing Automation
**Webhook:** `/automation/whatsapp/launch`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Launch WhatsApp marketing campaigns
- Bulk send to segments
- Promotional offers
- Event announcements

**Funcionalidades:**
- Create campaign
- Select audience segment
- Choose template
- Schedule send
- Track responses

---

### 11. Internal Alert Flow
**Tipo:** Enrichment Automation
**Webhook:** `/automation/internal/flag`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Detect anomalies in PMS data
- Flag issues for owner attention
- Create alerts in dashboard
- Escalation rules

**Alert types:**
- Low occupancy
- Payment overdue
- Booking cancellation spike
- Maintenance required
- Review score drop

---

### 12. External Enrichment Flow
**Tipo:** Enrichment Automation
**Webhook:** `/automation/external/input`
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Enrich guest/booking data with external sources
- Market data integration
- Competitor analysis
- Weather data
- Event calendar

**Sources:**
- APIs externas
- Web scraping
- Third-party data providers

---

## 🟢 PRIORIDAD BAJA (3 FLUJOS)

### 13. Dashboard - Marketing Activity Widget
**Tipo:** UI Widget
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Dashboard widget showing marketing activity
- Recent campaigns
- Social media posts
- Email sends
- Engagement metrics

**Data source:** Marketing automations (#7-#10)

---

### 14. Dashboard - Internal Alerts Widget
**Tipo:** UI Widget
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Dashboard widget showing internal alerts
- Flagged issues
- Action items
- Priority indicators

**Data source:** Internal Alert Flow (#11)

---

### 15. Dashboard - Guest Insights Widget
**Tipo:** UI Widget
**Estado:** 🔴 Pendiente implementar

**Descripción:**
- Dashboard widget showing guest insights
- Guest segments
- Booking patterns
- Revenue by segment
- Satisfaction scores

**Data source:** External Enrichment Flow (#12)

---

## 📁 TABLAS SUPABASE NUEVAS

### 1. wa_conversations ⏳
```sql
CREATE TABLE IF NOT EXISTS public.wa_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  conversation_id TEXT NOT NULL, -- ChakraHQ conversation ID
  last_message_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Uso:** WhatsApp Concierge (#2), WhatsApp Campaigns (#10)

---

### 2. wa_errors ⏳
```sql
CREATE TABLE IF NOT EXISTS public.wa_errors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.wa_conversations(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Uso:** Error tracking para WhatsApp flows

---

### 3. communications_log ✅
```sql
-- Ya creada (26 Dic 2025)
-- Ver: supabase/communications-log-schema.sql
```

**Uso:** Send Email (#5), Send WhatsApp (#6)

---

### 4. message_templates ⏳ (Opcional)
```sql
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('email', 'whatsapp', 'both')),
  template_key TEXT NOT NULL,
  subject TEXT, -- Solo para email
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb, -- Array de variables soportadas
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, template_key)
);
```

**Uso:** Custom templates by tenant (opcional - ahora hardcoded)

---

## 🗺️ ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Communication (2 semanas)
- [x] #5 - Send Email to Guest (Frontend ✅)
- [x] #6 - Send WhatsApp to Guest (Frontend ✅)
- [ ] #5 - n8n webhook + SendGrid
- [ ] #6 - n8n webhook + ChakraHQ
- [ ] Crear tablas: wa_conversations, wa_errors

### Fase 2: Agents (3 semanas)
- [x] #3 - Internal Agent (✅ Completado)
- [ ] #2 - WhatsApp Concierge
- [ ] #4 - External Agent (Market/Growth)
- [ ] #1 - Rediseño VAPI + n8n (esperando templates)

### Fase 3: Marketing Automations (4 semanas)
- [ ] #7 - Content Triggers
- [ ] #8 - Social Publishing
- [ ] #9 - Review Amplification
- [ ] #10 - WhatsApp Campaigns

### Fase 4: Enrichment (2 semanas)
- [ ] #11 - Internal Alert Flow
- [ ] #12 - External Enrichment Flow

### Fase 5: Dashboard Widgets (1 semana)
- [ ] #13 - Marketing Activity Widget
- [ ] #14 - Internal Alerts Widget
- [ ] #15 - Guest Insights Widget

**TOTAL ESTIMADO:** 12 semanas (3 meses)

---

## 📊 PROGRESO ACTUAL

| Categoría | Total | Completado | Pendiente | % |
|-----------|-------|------------|-----------|---|
| Agentes AI | 4 | 1 | 3 | 25% |
| Communication | 2 | 2 (frontend) | 0 (backend) | 100% frontend |
| Marketing | 4 | 0 | 4 | 0% |
| Enrichment | 2 | 0 | 2 | 0% |
| Widgets | 3 | 0 | 3 | 0% |
| **TOTAL** | **15** | **3** | **12** | **20%** |

---

## 🔗 WEBHOOKS N8N

**Base URL:** `https://n8n-production-bb2d.up.railway.app`

| # | Webhook Path | Estado |
|---|--------------|--------|
| 1 | `/webhook/vapi-izumi-fix` | 🟡 Rediseñando |
| 2 | `/wa/external-agent` | 🔴 Pendiente |
| 3 | Backend API | ✅ Completado |
| 4 | Backend API | 🔴 Pendiente |
| 5 | `/communications/send-email` | 🟡 Frontend listo |
| 6 | `/communications/send-whatsapp` | 🟡 Frontend listo |
| 7 | `/automation/content-trigger` | 🔴 Pendiente |
| 8 | `/automation/publish` | 🔴 Pendiente |
| 9 | TBD | 🔴 Pendiente |
| 10 | `/automation/whatsapp/launch` | 🔴 Pendiente |
| 11 | `/automation/internal/flag` | 🔴 Pendiente |
| 12 | `/automation/external/input` | 🔴 Pendiente |
| 13-15 | Dashboard data only | 🔴 Pendiente |

---

## 📦 ARCHIVOS DE REFERENCIA

**Workflows n8n existentes:**
```
n8n_worlkflow_claude/
├── WF-IA-01 - Owner AI Assistant - MYHOST Bizmate XIII.json
├── WF-IA-02 - Owner AI Recommendation MYHOST Bizamate XII.json
├── WF-IA-03 - Action Executor MYHOST BizMate XIV.json
├── Vapi Izumi Hotel - MYHOST Bizmate IX.json
├── Owner Daily Intelligence - MYHOST Bizmate WF1 FINAL.json
└── MY HOST - New Property Notification (Email+WhatsApp).json
```

**Documentación:**
```
Claude AI and Code Update 26122025/
├── INTERNAL_AI_AGENT_IMPLEMENTATION_26DIC2025.md
├── GUEST_COMMUNICATION_IMPLEMENTATION_26DIC2025.md
├── MYHOST_BIZMATE_FULL_DOCUMENTATION.md
├── N8N_WORKFLOWS_COMPLETE_LIST_26DIC2025.md (este archivo)
└── STATUS_UPDATE_26DIC2025.md
```

---

**Última actualización:** 26 de Diciembre 2025
**Branch:** backup-antes-de-automatizacion
