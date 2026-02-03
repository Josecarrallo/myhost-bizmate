# RESUMEN REUNIÓN NISMARA UMA - 30 ENERO 2026
## Landing Page + AUTOPILOT Integration

**Fecha Reunión:** 30 Enero 2026
**Cliente:** Nismara Uma Villa (Ubud, Bali)
**Status:** ✅ REUNIÓN EXITOSA - APROBADO PARA PROCEDER
**Owner:** [Nombre del owner]

---

## 🎯 ACUERDOS CLAVE

### 1. Plan de Lanzamiento en 2 Fases

#### FASE 1: Landing Page Live (INMEDIATA)
**Timeline:** Esta semana (31 Enero - 6 Febrero)
**Objetivo:** Lanzar nismarauna.lovable.app para empezar a capturar leads

**Qué incluye:**
- ✅ Landing page actual (tal como está)
- ✅ Booking form conectado a Supabase backend
- ✅ Calendar sincronizado con bookings reales
- ✅ Notificaciones automáticas vía WhatsApp cuando llega nuevo lead
- ✅ Owner recibe alerta y puede responder manualmente (por ahora)

**Owner puede seguir usando:** Airbnb, Booking.com, WhatsApp manual

#### FASE 2: AUTOPILOT Dashboard (2 SEMANAS)
**Timeline:** 7-21 Febrero
**Objetivo:** Implementar AUTOPILOT como sistema de gestión

**Qué incluye:**
- ✅ Dashboard AUTOPILOT (Owner Decisions)
- ✅ AI handling 95% de comunicación automática
- ✅ Owner solo aprueba/rechaza decisiones importantes
- ✅ WhatsApp confirmations automáticas
- ✅ Daily/Weekly/Monthly summaries
- ✅ Training completo (video + 1-on-1 call)

**Owner reduce tiempo manual:** De 10-15 horas/semana a 30 min/día

---

## 📦 ENTREGABLES DEL CLIENTE

### Información Requerida (Owner debe proveer):

#### 1. Fotos de Villa (URGENTE - Esta Semana)
- [ ] **Cantidad:** 10-15 imágenes high-resolution
- [ ] **Formato:** JPG o PNG
- [ ] **Resolución mínima:** 1920x1080px
- [ ] **Tipos:**
  - Exterior villa (3-4 fotos)
  - Bedrooms (2-3 fotos)
  - Living/dining areas (2-3 fotos)
  - Pool & garden (2-3 fotos)
  - Views & surroundings (2-3 fotos)
- [ ] **Enviar vía:** Google Drive link o WeTransfer

#### 2. Property Details (URGENTE - Esta Semana)
- [ ] **Address completo:** [Calle, número, distrito, Ubud, Bali]
- [ ] **Coordinates GPS:** (Lat, Long) para Google Maps
- [ ] **Amenities list:**
  - Bedrooms: [número]
  - Bathrooms: [número]
  - Max guests: [número]
  - Pool: Yes/No
  - Kitchen: Yes/No
  - WiFi: Yes/No
  - Air conditioning: Yes/No
  - Parking: Yes/No
  - [Otros amenities...]

#### 3. Policies & Rules (Esta Semana)
- [ ] **Check-in time:** [ej: 2:00 PM]
- [ ] **Check-out time:** [ej: 12:00 PM]
- [ ] **Cancellation policy:**
  - Free cancellation: [ej: 7 days before check-in]
  - 50% refund: [ej: 3-7 days before]
  - No refund: [ej: < 3 days before]
- [ ] **House rules:**
  - Pets: Allowed/Not allowed
  - Smoking: Allowed/Not allowed
  - Parties: Allowed/Not allowed
  - [Otros rules...]

#### 4. Pricing (Esta Semana)
- [ ] **Price per night:**
  - Low season (May-Sep): IDR [precio]
  - High season (Oct-Apr): IDR [precio]
  - Peak season (Dec-Jan): IDR [precio]
- [ ] **Minimum stay:**
  - Low season: [ej: 2 nights]
  - High season: [ej: 3 nights]
  - Peak season: [ej: 5 nights]
- [ ] **Extra fees:**
  - Cleaning fee: IDR [precio]
  - Service fee: [%]
  - Security deposit: IDR [precio]

#### 5. Contact Information (Esta Semana)
- [ ] **Owner name:** [Full name]
- [ ] **Owner email:** [Email address]
- [ ] **Owner phone:** [WhatsApp number con código país]
- [ ] **WhatsApp Business number:** (si diferente del personal)
- [ ] **Bank account details:** (para payment tracking en Fase 2)

#### 6. Bookings Históricos (Próximas 2 Semanas)
- [ ] **Archivo Excel o CSV** con todas las reservas pasadas y futuras
- [ ] **Columnas requeridas:**
  - Guest name
  - Guest email
  - Guest phone
  - Guest country
  - Check-in date (formato: YYYY-MM-DD)
  - Check-out date (formato: YYYY-MM-DD)
  - Total amount (IDR)
  - Channel (Airbnb, Booking.com, Direct, etc.)
  - Payment status (Paid, Pending, Partial)
  - Booking date
- [ ] **Periodo:** Últimos 6 meses + futuras reservas
- [ ] **Enviar vía:** Email o Google Sheets

---

## 💰 PRICING ACORDADO

### Setup Fee (One-time)
**Total: $300 USD** (paid before go-live)

**Incluye:**
- Supabase tenant & property setup
- Landing page backend integration (Booking form + Calendar)
- AI agents configuration (KORA, BANYU, LUMINA, OSIRIS)
- n8n workflows setup (5 workflows activos)
- Historical bookings import
- Owner training (video + 1-on-1 call, 30 min)
- Documentation (user guide PDF)

### Monthly Subscription
**AUTOPILOT Starter: $49/month**

**Incluye:**
- AUTOPILOT Dashboard (Owner Decisions, Daily/Weekly/Monthly summaries)
- AI Systems (OSIRIS chat assistant)
- 1 property (Nismara Uma Villa)
- Unlimited bookings
- WhatsApp notifications (via BANYU)
- Email notifications
- Workflow automation:
  - Lead Handler (WF-03)
  - Guest Journey (WF-05)
  - Payment Protection (WF-D2)
  - Daily Summary (WF-D3)
  - Follow-Up Engine (WF-04)
- Support (email + WhatsApp, business hours Mon-Fri 9AM-6PM WIB)

**Billing:**
- First month: FREE (14-day trial)
- After trial: $49/month, billed monthly
- Cancel anytime, no long-term commitment

**Payment Methods:**
- Credit card (Stripe)
- Bank transfer (Indonesian bank account)

---

## 📅 CRONOGRAMA DETALLADO

### SEMANA 1 (31 Enero - 6 Febrero): Landing Page Live

| Día | Tarea | Responsable | Status |
|-----|-------|-------------|--------|
| **Lun 31 Ene** | Client envía fotos + property details | Owner | ⏳ Pending |
| | Create Supabase tenant & property | Tech Team | ⏳ Pending |
| **Mar 1 Feb** | Upload fotos a Supabase Storage | Tech Team | ⏳ Pending |
| | Modify BookingSection.tsx (calendar sync) | Tech Team | ⏳ Pending |
| **Mié 2 Feb** | Modify BookingDialog.tsx (Supabase insert) | Tech Team | ⏳ Pending |
| | Connect to n8n WF-03 Lead Handler | Tech Team | ⏳ Pending |
| **Jue 3 Feb** | Testing end-to-end (booking form) | Tech Team | ⏳ Pending |
| | QA on staging environment | Tech Team | ⏳ Pending |
| **Vie 4 Feb** | Deploy to production (Lovable) | Tech Team | ⏳ Pending |
| | Owner test booking flow | Owner | ⏳ Pending |
| **Sáb 5 Feb** | Monitoring first real leads | Tech Team | ⏳ Pending |
| **Dom 6 Feb** | Fix any issues reported | Tech Team | ⏳ Pending |

**Milestone:** ✅ Landing page live, capturing real leads

---

### SEMANA 2 (7-13 Febrero): AUTOPILOT Setup

| Día | Tarea | Responsable | Status |
|-----|-------|-------------|--------|
| **Lun 7 Feb** | Configure KORA (VAPI voice assistant) | Tech Team | ⏳ Pending |
| | Configure BANYU (WhatsApp AI) | Tech Team | ⏳ Pending |
| **Mar 8 Feb** | Configure LUMINA (Sales AI lead scoring) | Tech Team | ⏳ Pending |
| | Test AI agents end-to-end | Tech Team | ⏳ Pending |
| **Mié 9 Feb** | Clone & customize n8n workflows | Tech Team | ⏳ Pending |
| | Test WF-03, WF-04, WF-05, WF-D2, WF-D3 | Tech Team | ⏳ Pending |
| **Jue 10 Feb** | Create owner account in MY HOST BizMate | Tech Team | ⏳ Pending |
| | Setup AUTOPILOT-only mode | Tech Team | ⏳ Pending |
| **Vie 11 Feb** | Record onboarding video (15 min) | Tech Team | ⏳ Pending |
| | Prepare user guide PDF | Tech Team | ⏳ Pending |
| **Sáb 12 Feb** | Client envía historical bookings CSV | Owner | ⏳ Pending |
| | Import historical bookings | Tech Team | ⏳ Pending |
| **Dom 13 Feb** | Final QA & testing | Tech Team | ⏳ Pending |

**Milestone:** ✅ AUTOPILOT ready para onboarding call

---

### SEMANA 3 (14-20 Febrero): Owner Training & Go-Live

| Día | Tarea | Responsable | Status |
|-----|-------|-------------|--------|
| **Lun 14 Feb** | **ONBOARDING CALL (30 min, 10:00 AM WIB)** | Both | ⏳ Pending |
| | Send onboarding video + user guide | Tech Team | ⏳ Pending |
| **Mar 15 Feb** | Owner first login & test | Owner | ⏳ Pending |
| | Create test decision for practice | Tech Team | ⏳ Pending |
| **Mié 16 Feb** | Owner approves/rejects test decision | Owner | ⏳ Pending |
| | Monitor owner usage | Tech Team | ⏳ Pending |
| **Jue 17 Feb** | First real owner decision (if any) | Owner | ⏳ Pending |
| | Support call if needed | Tech Team | ⏳ Pending |
| **Vie 18 Feb** | Check-in call (15 min) | Tech Team | ⏳ Pending |
| | Collect feedback | Tech Team | ⏳ Pending |
| **Sáb-Dom 19-20 Feb** | Weekend monitoring | Tech Team | ⏳ Pending |

**Milestone:** ✅ Owner using AUTOPILOT independently

---

### SEMANA 4 (21-27 Febrero): Optimization

| Día | Tarea | Responsable | Status |
|-----|-------|-------------|--------|
| **Lun 21 Feb** | **First Weekly Summary delivered (6:00 AM)** | Auto | ⏳ Pending |
| | Review weekly summary with owner | Tech Team | ⏳ Pending |
| **Mar 22 Feb** | Iterate based on owner feedback | Tech Team | ⏳ Pending |
| **Mié 23 Feb** | Guest Journey workflow first trigger | Auto | ⏳ Pending |
| **Jue 24 Feb** | Payment Protection workflow test | Tech Team | ⏳ Pending |
| **Vie 25 Feb** | Owner satisfaction survey (NPS) | Tech Team | ⏳ Pending |
| **Sáb-Dom 26-27 Feb** | Review metrics & plan Phase 3 | Tech Team | ⏳ Pending |

**Milestone:** ✅ Full AUTOPILOT operational

---

## 📊 MÉTRICAS DE ÉXITO

### Week 1 (Landing Page)
- [ ] Landing page deployed ✅
- [ ] First lead captured via booking form ✅
- [ ] Lead inserted en Supabase ✅
- [ ] Owner notified via WhatsApp ✅

### Week 2-3 (AUTOPILOT)
- [ ] Owner trained ✅
- [ ] Owner first decision made ✅
- [ ] WhatsApp confirmation sent automatically ✅
- [ ] Owner login frequency: Daily ✅

### Week 4 (Optimization)
- [ ] Weekly summary delivered ✅
- [ ] Owner NPS score: 8+ ✅
- [ ] Time saved: 10+ hours/week ✅
- [ ] Zero critical support tickets ✅

---

## 🚨 RIESGOS Y PLAN DE CONTINGENCIA

### Riesgo 1: Owner no responde con info a tiempo
**Mitigación:**
- WhatsApp follow-up diario si no recibimos fotos/details
- Deadline firme: 3 Febrero para fotos, 6 Febrero para details
- Si retraso: Postpone go-live 1 semana

### Riesgo 2: Bookings históricos en formato incorrecto
**Mitigación:**
- Enviar template CSV con ejemplo
- Ofrecer llamada para explicar formato
- Si CSV complejo: Manual data entry (1 hora extra, no cost)

### Riesgo 3: Owner no usa AUTOPILOT después de training
**Mitigación:**
- WhatsApp reminder diario (9AM) primeros 7 días
- Weekly check-in calls (15 min)
- Si no usage después 2 semanas: Schedule intervention call

### Riesgo 4: Landing page performance issues
**Mitigación:**
- Monitor page load times with Google PageSpeed
- Optimize images (WebP, lazy loading)
- If Lovable hosting slow: Migrate to Vercel (1 día)

---

## 📞 CONTACTOS

### Owner (Nismara Uma)
- **Name:** [Owner Name]
- **Email:** [owner@nismarauma.com]
- **WhatsApp:** [+62 xxx xxxx xxxx]
- **Best time to reach:** [Morning 9-11 AM / Evening 6-8 PM]

### ZENTARA LIVING Tech Team
- **Lead Developer:** Jose Carrallo
- **Email:** jose@zentaraliving.com
- **WhatsApp Support:** [Support number]
- **Support Hours:** Mon-Fri 9AM-6PM WIB (GMT+8)

### Meetings Scheduled
1. **Onboarding Call:** 14 Febrero 2026, 10:00 AM WIB (30 min)
   - Zoom link: [Link]
   - Calendar invite: Sent

2. **Check-in Call:** 18 Febrero 2026, 2:00 PM WIB (15 min)
   - Zoom link: [Link]
   - Calendar invite: Sent

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

### HOY (30 Enero):
- [x] ✅ Reunión completada con éxito
- [x] ✅ Plan de integración aprobado
- [ ] Owner firma contrato (via DocuSign)
- [ ] Owner paga setup fee $300 USD (via Stripe/bank transfer)
- [ ] Tech team crea ticket en project management (Linear/Notion)

### MAÑANA (31 Enero):
- [ ] **Owner:** Envía fotos de villa (10-15 imágenes)
- [ ] **Owner:** Envía property details completos
- [ ] **Tech Team:** Create Supabase tenant & property
- [ ] **Tech Team:** Setup Supabase Storage

### ESTA SEMANA (1-6 Febrero):
- [ ] Landing page backend integration
- [ ] Testing end-to-end
- [ ] Deploy to production
- [ ] Go-live! 🚀

---

## 💬 FEEDBACK DEL CLIENTE

### Positivos (Owner Highlights):
- ✅ "Me encanta que sea gradual - primero landing page, luego AUTOPILOT"
- ✅ "El precio es razonable ($300 setup + $49/mes)"
- ✅ "Necesito esto - paso demasiado tiempo respondiendo WhatsApp"
- ✅ "La transparencia del Database Visualization me da confianza"

### Preocupaciones (Owner Concerns):
- ⚠️ "¿Qué pasa si el AI se equivoca?" → Respuesta: "Owner always has final approval. AI only suggests, you decide."
- ⚠️ "¿Puedo cancelar si no me gusta?" → Respuesta: "Yes, cancel anytime after 14-day trial. No commitment."
- ⚠️ "¿Quién responde si tengo problemas a medianoche?" → Respuesta: "24/7 AI support via OSIRIS chat. Human support Mon-Fri 9-6 PM. Urgent issues: WhatsApp escalation."

### Action Items from Feedback:
- [ ] Add 24/7 emergency contact number (for critical issues)
- [ ] Clarify in contract: "Owner retains full control, AI is assistant only"
- [ ] Provide examples of "what AI handles" vs "what escalates to owner"

---

## 📄 DOCUMENTOS GENERADOS

1. **PLAN_INTEGRACION_NISMARA_UMA_30ENE2026.md**
   - Plan técnico completo (3 fases)
   - Setup instructions
   - Code modifications
   - Testing procedures

2. **AUTOPILOT_COMO_INTRODUCCION_MYHOST.md**
   - Estrategia de onboarding gradual
   - AUTOPILOT-only mode
   - Upgrade path to full platform
   - Success metrics

3. **RESUMEN_REUNION_NISMARA_UMA.md** (este documento)
   - Acuerdos clave
   - Entregables del cliente
   - Cronograma detallado
   - Pricing acordado

---

## 🎉 CONCLUSIÓN

**Status:** ✅ APROBADO PARA PROCEDER

**Next Milestone:** Landing page live (6 Febrero 2026)

**Owner Sentiment:** Enthusiastic & Confident

**Team Confidence:** High - Clear plan, realistic timeline

**Go/No-Go Decision:** **GO** 🚀

---

*Documento creado: 30 Enero 2026*
*MY HOST BizMate - ZENTARA LIVING*
*Cliente: Nismara Uma Villa*
*Prepared by: Jose Carrallo*
