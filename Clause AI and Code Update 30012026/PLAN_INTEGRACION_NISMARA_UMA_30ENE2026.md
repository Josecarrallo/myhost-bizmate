# PLAN DE INTEGRACIÓN NISMARA UMA → MY HOST BIZMATE
## Landing Page + AUTOPILOT Integration Plan

**Fecha:** 30 Enero 2026
**Cliente:** Nismara Uma Villa (Ubud, Bali)
**Status:** 🟢 READY TO START
**Prioridad:** 🔴 ALTA

---

## 📋 RESUMEN EJECUTIVO

### Situación Actual
- ✅ Landing page desarrollada con Lovable (React + TypeScript + Vite)
- ✅ Live en https://nismarauna.lovable.app
- ✅ Booking calendar funcional con mock data
- ✅ Booking dialog con 3 pasos (details, payment, confirmation)
- ❌ **NO conectada a backend** - toda la data es hardcoded
- ❌ Sin sincronización de calendar con bookings reales
- ❌ Sin notificaciones automáticas
- ❌ Sin AUTOPILOT integration

### Plan del Cliente
1. **Fase 1 (INMEDIATA):** Lanzar landing page tal como está para empezar a capturar leads
2. **Fase 2 (2 SEMANAS):** Integrar AUTOPILOT como sistema de gestión
3. **Fase 3 (1 MES):** Integración completa con MY HOST BizMate

### Objetivo
Conectar la landing page de Nismara Uma a MY HOST BizMate backend:
- Bookings reales en Supabase
- Calendar sincronizado
- Pagos tracking
- AUTOPILOT como dashboard de gestión
- Workflows n8n automatizados

---

## 🏗️ ANÁLISIS TÉCNICO

### Landing Page Actual (Nismara Uma)

#### Stack Tecnológico
```json
{
  "framework": "React 18.3 + TypeScript",
  "bundler": "Vite 5.4",
  "ui_library": "shadcn-ui + Radix UI",
  "styling": "Tailwind CSS",
  "routing": "React Router DOM 6.30",
  "forms": "React Hook Form + Zod",
  "animations": "Framer Motion",
  "date_handling": "date-fns",
  "charts": "Recharts"
}
```

#### Componentes Clave

**1. BookingSection.tsx** (líneas 1-309)
- Calendar interactivo con date-fns
- Mock booked dates (hardcoded):
```typescript
const bookedDates = [
  new Date(2026, 1, 5), // Feb 5
  new Date(2026, 1, 6), // Feb 6
  // ... más fechas
];
```
- Precio: IDR 1,300,000/noche
- Check-in/check-out selection
- Total price calculation

**2. BookingDialog.tsx** (líneas 1-330)
- 3-step booking process:
  1. **Guest Details:** First name, last name, email, phone, # guests
  2. **Payment Method:** Credit card o Bank transfer
  3. **Confirmation:** Success message
- Form validation
- Estado local (no persiste)
- No backend integration

#### Funcionalidad Actual
| Feature | Status | Notas |
|---------|--------|-------|
| Calendar display | ✅ FUNCIONAL | shadcn-ui Calendar component |
| Date selection | ✅ FUNCIONAL | Check-in/check-out |
| Blocked dates | ⚠️ HARDCODED | Mock data, no sync con backend |
| Price calculation | ✅ FUNCIONAL | Fixed IDR 1,300,000/night |
| Guest form | ✅ FUNCIONAL | Validación básica |
| Payment form | ⚠️ FAKE | No procesamiento real |
| Confirmation | ⚠️ FAKE | No email enviado |
| Data persistence | ❌ NONE | Todo es local state |

---

### MY HOST BizMate Backend

#### Supabase Tables Disponibles
```sql
-- 1. leads (para capturar inquiries desde landing page)
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  guest_phone VARCHAR(50),
  guest_country VARCHAR(100),
  check_in_date DATE,
  check_out_date DATE,
  number_of_guests INT,
  total_amount DECIMAL(10,2),
  lead_source VARCHAR(100), -- 'landing_page'
  lead_stage VARCHAR(50), -- 'NEW', 'ENGAGED', 'HOT', 'WON', 'LOST'
  lead_score INT,
  intent VARCHAR(50), -- 'booking'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. bookings (cuando lead se convierte en booking confirmado)
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  guest_id UUID,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  status VARCHAR(50), -- 'pending', 'confirmed', 'checked_in', 'checked_out'
  channel VARCHAR(100), -- 'Direct'
  total_amount DECIMAL(10,2),
  currency VARCHAR(10), -- 'IDR'
  payment_status VARCHAR(50), -- 'pending', 'paid', 'partial'
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. autopilot_actions (para owner decisions)
CREATE TABLE autopilot_actions (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  property_id UUID NOT NULL,
  action_type VARCHAR(100), -- 'booking_request'
  priority VARCHAR(50), -- 'URGENT', 'HIGH', 'NORMAL'
  guest_name VARCHAR(255),
  guest_phone VARCHAR(50),
  amount DECIMAL(10,2),
  description TEXT,
  status VARCHAR(50), -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### n8n Workflows Disponibles
```
WF-03: Lead Handler → Process new leads from landing page
WF-04: Follow-Up Engine → Automated lead nurturing
WF-05: Guest Journey → Pre-arrival, during stay, post-checkout
WF-D2: Payment Protection → Track pending payments
WF-D3: Daily Summary → Generate daily metrics
WF-AUTOPILOT: Actions → Approve/Reject owner decisions
```

---

## 🎯 PLAN DE INTEGRACIÓN (3 FASES)

### FASE 1: LANDING PAGE LIVE (SEMANA 1)
**Timeline:** 30 Enero - 6 Febrero 2026
**Objetivo:** Lanzar landing page para capturar leads

#### 1.1 Setup Básico (DÍA 1-2)
- [ ] **Crear tenant en Supabase:**
  - `tenant_id`: Nuevo UUID para Nismara Uma
  - `property_id`: Nuevo UUID para la villa
  - Owner details (name, email, phone)

- [ ] **Configurar property details:**
```sql
INSERT INTO properties (id, tenant_id, name, description, location, max_guests, price_per_night, currency)
VALUES (
  'NISMARA_PROPERTY_ID',
  'NISMARA_TENANT_ID',
  'Nismara Uma Villa',
  'Private boutique escape in Ubud, Bali',
  'Ubud, Bali, Indonesia',
  4,
  1300000,
  'IDR'
);
```

- [ ] **Subir fotos de villa a Supabase Storage:**
  - Estructura: `properties/NISMARA_PROPERTY_ID/villa1.jpg`, `villa2.jpg`, etc.
  - Client proveerá high-res photos

#### 1.2 Conectar Booking Form a Supabase (DÍA 3-4)
**Archivo a modificar:** `BookingDialog.tsx`

**Cambios requeridos:**

```typescript
// 1. Install Supabase client
npm install @supabase/supabase-js

// 2. Create supabase.ts service
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. Modify BookingDialog.tsx - handleContinue() en step "payment"
const handleContinue = async () => {
  if (step === "payment") {
    try {
      // Insert lead into Supabase
      const { data, error } = await supabase
        .from('leads')
        .insert({
          tenant_id: 'NISMARA_TENANT_ID',
          property_id: 'NISMARA_PROPERTY_ID',
          guest_name: `${formData.firstName} ${formData.lastName}`,
          guest_email: formData.email,
          guest_phone: formData.phone,
          check_in_date: checkIn,
          check_out_date: checkOut,
          number_of_guests: parseInt(formData.guests),
          total_amount: totalPrice,
          lead_source: 'landing_page',
          lead_stage: 'NEW',
          lead_score: 50,
          intent: 'booking'
        });

      if (error) throw error;

      // Trigger n8n workflow (WF-03 Lead Handler)
      await fetch('https://n8n-production-bb2d.up.railway.app/webhook/lead-handler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: data.id,
          guest_name: `${formData.firstName} ${formData.lastName}`,
          guest_email: formData.email,
          check_in_date: format(checkIn, 'yyyy-MM-dd'),
          check_out_date: format(checkOut, 'yyyy-MM-dd')
        })
      });

      setStep("confirmation");
    } catch (error) {
      console.error('Error creating lead:', error);
      // Show error toast
    }
  }
};
```

#### 1.3 Sincronizar Calendar con Bookings Reales (DÍA 5-6)
**Archivo a modificar:** `BookingSection.tsx`

**Cambios requeridos:**

```typescript
// Replace hardcoded bookedDates with Supabase fetch
const [bookedDates, setBookedDates] = useState<Date[]>([]);

useEffect(() => {
  const fetchBookedDates = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('property_id', 'NISMARA_PROPERTY_ID')
      .eq('status', 'confirmed');

    if (!error) {
      // Generate all dates between check-in and check-out
      const blocked: Date[] = [];
      data.forEach(booking => {
        const start = new Date(booking.check_in_date);
        const end = new Date(booking.check_out_date);
        let current = new Date(start);
        while (current <= end) {
          blocked.push(new Date(current));
          current = addDays(current, 1);
        }
      });
      setBookedDates(blocked);
    }
  };

  fetchBookedDates();

  // Refresh every 5 minutes
  const interval = setInterval(fetchBookedDates, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

#### 1.4 Testing & Deploy (DÍA 7)
- [ ] Test booking form end-to-end
- [ ] Verify lead appears in Supabase
- [ ] Verify n8n workflow triggers
- [ ] Test calendar blocked dates update
- [ ] Deploy to production (Lovable)

---

### FASE 2: AUTOPILOT INTEGRATION (SEMANA 2-3)
**Timeline:** 7 Febrero - 21 Febrero 2026
**Objetivo:** Configurar AUTOPILOT como dashboard de gestión

#### 2.1 Configurar AI Agents (DÍA 1-2)
**KORA (Voice AI - VAPI):**
- [ ] Create new VAPI assistant "Nismara Uma Concierge"
- [ ] Configure system prompt:
```
You are the AI concierge for Nismara Uma Villa, a private boutique villa in Ubud, Bali.
Property details:
- Location: Ubud, Bali
- Capacity: 4 guests maximum
- Price: IDR 1,300,000 per night
- Amenities: [list amenities]

Answer inquiries about:
- Availability
- Pricing
- Amenities
- Location and directions
- Check-in/check-out procedures

For bookings, capture: guest name, email, phone, check-in/check-out dates, number of guests.
Always be warm, professional, and reflect Balinese hospitality.
```
- [ ] Test voice calls

**BANYU (WhatsApp AI - ChakraHQ):**
- [ ] Connect WhatsApp Business number
- [ ] Configure ChakraHQ flow for Nismara Uma
- [ ] Test WhatsApp inquiries

**LUMINA (Sales AI):**
- [ ] Configure lead scoring rules para Nismara Uma
- [ ] Test lead analysis

**OSIRIS (Owner AI):**
- [ ] Ya configurado - solo agregar property context

#### 2.2 Workflows n8n (DÍA 3-5)
**WF-03: Lead Handler** (ya existe, clonar y customizar)
- [ ] Clone existing WF-03
- [ ] Update tenant_id/property_id
- [ ] Test con nuevo lead de landing page
- [ ] Verify:
  - Lead inserted en Supabase ✅
  - LUMINA scores lead ✅
  - Auto-follow-up scheduled (WF-04) ✅
  - Owner notified via WhatsApp ✅

**WF-D3: Daily Summary** (ya existe, agregar property)
- [ ] Update workflow para incluir Nismara Uma
- [ ] Test daily summary generation
- [ ] Verify WhatsApp notification

**WF-AUTOPILOT: Actions** (ya existe, ready to use)
- [ ] Test approve/reject workflow con Nismara Uma booking

#### 2.3 AUTOPILOT Dashboard Access (DÍA 6-7)
- [ ] **Create owner account** en MY HOST BizMate:
  - Email: owner@nismarauma.com (o el que provean)
  - Password: Generated
  - Role: Owner

- [ ] **Grant access** a AUTOPILOT module
- [ ] **Configure property selector** en dashboard (mostrar solo Nismara Uma)
- [ ] **Test Owner Decisions:**
  1. Crear test action (booking request)
  2. Owner logs in
  3. Ve pending action en AUTOPILOT
  4. Clicks APPROVE
  5. WhatsApp confirmation sent
  6. Lead converts to booking

#### 2.4 Owner Training (DÍA 8-9)
- [ ] **Create onboarding video** (15 min):
  1. Login to MY HOST BizMate
  2. Navigate to AUTOPILOT
  3. View Daily/Weekly/Monthly metrics
  4. Approve/Reject owner decisions
  5. View Database Visualization panel
  6. Access AI Systems (OSIRIS chat)

- [ ] **Schedule 1-on-1 call** con owner (1 hora):
  - Walkthrough AUTOPILOT dashboard
  - Explain each section
  - Demo approve/reject workflow
  - Q&A session
  - Provide support contacts

- [ ] **Provide documentation:**
  - User guide PDF
  - FAQ document
  - Contact info (support email, WhatsApp)

---

### FASE 3: FULL MY HOST BIZMATE (SEMANA 4)
**Timeline:** 22 Febrero - 28 Febrero 2026
**Objetivo:** Integración completa con todos los módulos

#### 3.1 Importar Bookings Históricos (DÍA 1-2)
**Cliente proveerá:** Archivo con todos los bookings existentes

**Formato esperado:**
```csv
guest_name,guest_email,guest_phone,guest_country,check_in_date,check_out_date,total_amount,channel,payment_status,booking_date
"John Doe","john@example.com","+1234567890","USA","2026-03-15","2026-03-18",3900000,"Airbnb","paid","2026-01-20"
"Jane Smith","jane@example.com","+4412345678","UK","2026-03-20","2026-03-25",6500000,"Booking.com","paid","2026-02-01"
```

**Import script:**
```javascript
// scripts/import-bookings.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const importBookings = async (csvFilePath) => {
  const bookings = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      bookings.push({
        tenant_id: 'NISMARA_TENANT_ID',
        property_id: 'NISMARA_PROPERTY_ID',
        guest_name: row.guest_name,
        guest_email: row.guest_email,
        guest_phone: row.guest_phone,
        guest_country: row.guest_country,
        check_in_date: row.check_in_date,
        check_out_date: row.check_out_date,
        total_amount: parseFloat(row.total_amount),
        currency: 'IDR',
        channel: row.channel,
        status: 'completed', // históricos
        payment_status: row.payment_status,
        created_at: row.booking_date
      });
    })
    .on('end', async () => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookings);

      if (error) {
        console.error('Import error:', error);
      } else {
        console.log(`✅ Imported ${bookings.length} bookings`);
      }
    });
};

importBookings('./nismara-bookings.csv');
```

- [ ] Run import script
- [ ] Verify bookings in Supabase
- [ ] Verify calendar updates con historical bookings
- [ ] Generate historical performance reports (revenue, occupancy)

#### 3.2 Payments Module Integration (DÍA 3-4)
- [ ] **Track payment status:**
  - Pending (awaiting payment)
  - Partial (deposit received)
  - Paid (full payment received)
  - Overdue (payment missed deadline)

- [ ] **Payment Protection workflow (WF-D2):**
  - Monitor bookings con payment_status = 'pending'
  - Send reminders (Day 3, 5, 7 before check-in)
  - Escalate to owner via AUTOPILOT if no payment by Day 2

- [ ] **Test payment tracking:**
  1. Create test booking with status = 'pending'
  2. Wait for reminder workflow trigger
  3. Verify WhatsApp reminder sent
  4. Mark as 'paid' manually
  5. Verify no more reminders

#### 3.3 Guest Journey Automation (DÍA 5-6)
**WF-05: Guest Journey** (ya existe)
- [ ] Pre-arrival (24h before check-in):
  - WhatsApp: Check-in instructions, villa location, arrival details
- [ ] During stay (day of check-in):
  - WhatsApp: Welcome message, amenities info, contact details
- [ ] Post-checkout (day after check-out):
  - WhatsApp: Thank you message, review request (Google, Airbnb)

- [ ] Configure para Nismara Uma
- [ ] Test con real booking
- [ ] Verify messages sent at correct times

#### 3.4 Reports & Analytics (DÍA 7)
- [ ] **Dashboard module:**
  - Revenue (MTD, YTD)
  - Occupancy rate
  - Bookings by channel (Direct, Airbnb, Booking.com)
  - Average nightly rate (ADR)
  - RevPAR

- [ ] **AUTOPILOT Weekly/Monthly summaries:**
  - Weekly: Sent every Monday 6AM
  - Monthly: Sent day 1 of each month, 7AM
  - Include AI insights from Claude

---

## 📝 RESPONSABILIDADES

### Cliente (Nismara Uma Owner)
- [ ] Proveer fotos high-res de la villa (10-15 imágenes)
- [ ] Proveer property details completos:
  - Exact address
  - Amenities list
  - House rules
  - Check-in/check-out times
  - Cancellation policy
- [ ] Proveer bookings históricos (CSV o Excel)
- [ ] WhatsApp Business number
- [ ] Bank account details (para payment tracking)
- [ ] Review y feedback durante testing

### Nosotros (ZENTARA LIVING Tech Team)
- [ ] Setup Supabase (tenant, property)
- [ ] Modify landing page code (BookingSection, BookingDialog)
- [ ] Configure AI agents (KORA, BANYU, LUMINA, OSIRIS)
- [ ] Setup n8n workflows
- [ ] Import historical bookings
- [ ] Owner training (video + 1-on-1)
- [ ] Documentation (user guide, FAQ)
- [ ] Support durante primeras 2 semanas

---

## 💰 PRICING STRUCTURE (Sugerencia)

### Setup Fee (One-time)
- **Onboarding completo:** $300 USD
  - Supabase setup
  - Landing page integration
  - AI agents configuration
  - n8n workflows
  - Historical data import
  - Owner training

### Monthly Subscription
**Tier: AUTOPILOT Starter** - $49/month
- Incluye:
  - AUTOPILOT Dashboard (Owner Decisions, Daily/Weekly/Monthly summaries)
  - AI Systems (OSIRIS chat assistant)
  - 1 property
  - Unlimited bookings
  - WhatsApp notifications (BANYU)
  - Email notifications
  - Workflows automation (Lead Handler, Guest Journey, Payment Protection)
  - Support (email + WhatsApp)

**Future Tiers:**
- **Pro** - $79/month: + Voice AI (KORA), Multi-property (up to 3), Advanced analytics
- **Premium** - $129/month: + Multi-property (up to 10), API access, Custom integrations

---

## 🎯 MÉTRICAS DE ÉXITO

### KPIs - Semana 1 (Post-Launch)
- [ ] Landing page live ✅
- [ ] First lead captured via booking form ✅
- [ ] Lead inserted en Supabase ✅
- [ ] n8n workflow triggered ✅
- [ ] Calendar showing blocked dates ✅

### KPIs - Semana 2-3 (AUTOPILOT)
- [ ] Owner account created ✅
- [ ] Owner trained ✅
- [ ] First owner decision (approve/reject) ✅
- [ ] WhatsApp confirmation sent ✅
- [ ] Daily summary generated ✅

### KPIs - Semana 4 (Full Integration)
- [ ] Historical bookings imported ✅
- [ ] Calendar 100% accurate ✅
- [ ] Payment tracking active ✅
- [ ] Guest Journey workflows triggered ✅
- [ ] Weekly/Monthly summaries delivered ✅

### KPIs - Mes 1 (Success Metrics)
- **Lead Conversion:**
  - Landing page visitors → Leads: Target 5%
  - Leads → Bookings: Target 20%
- **Response Time:**
  - Owner decision time: < 2 hours (vs 24h manual)
- **Automation Rate:**
  - 90% of guest communication automated
  - 100% of payment reminders automated
- **Owner Satisfaction:**
  - Net Promoter Score (NPS): Target 8+/10
  - Time saved per week: Target 10-15 hours

---

## 🚨 RIESGOS Y MITIGACIONES

### Riesgo 1: Calendar Sync Delays
**Problema:** Bookings no se reflejan inmediatamente en calendar
**Mitigación:**
- Implement real-time Supabase subscriptions
- Fallback: 5-min polling refresh
- Cache buster en cada page load

### Riesgo 2: Payment Tracking Manual
**Problema:** Payments still require manual verification (no Stripe/Midtrans integration yet)
**Mitigación:**
- Phase 1: Manual payment status update en AUTOPILOT
- Phase 2: Integrate payment gateway (Midtrans for Indonesia)

### Riesgo 3: Owner Learning Curve
**Problema:** Owner may find AUTOPILOT dashboard complex
**Mitigación:**
- Comprehensive onboarding video
- 1-on-1 training session
- Simple UI with clear CTAs
- 24/7 support (WhatsApp + email)

### Riesgo 4: Landing Page Performance
**Problema:** Lovable hosting may have limitations
**Mitigación:**
- Monitor page load times
- Optimize images (WebP, lazy loading)
- Consider migrating to Vercel if needed

---

## 📅 CRONOGRAMA COMPLETO

```
ENERO 2026
├─ 30 Ene: Plan aprobado, inicio Fase 1
├─ 31 Ene: Supabase setup (tenant, property)
└─ ...

FEBRERO 2026
├─ Semana 1 (1-6 Feb): Landing page integration + deploy
├─ Semana 2 (7-13 Feb): AUTOPILOT setup + AI agents
├─ Semana 3 (14-20 Feb): Owner training + testing
├─ Semana 4 (21-27 Feb): Full integration + historical import
└─ 28 Feb: Go-live completo

MARZO 2026
├─ Semana 1: Monitor & support
├─ Semana 2: Collect feedback, iterate
└─ Ongoing: Monthly check-ins
```

---

## 📞 PRÓXIMOS PASOS INMEDIATOS

### HOY (30 Enero):
1. ✅ Analizar landing page de Nismara Uma
2. ✅ Crear plan de integración completo
3. [ ] Enviar plan al owner para aprobación
4. [ ] Solicitar:
   - Fotos de villa (high-res)
   - Property details completos
   - WhatsApp Business number
   - Bookings históricos (CSV/Excel)

### MAÑANA (31 Enero):
1. [ ] Create tenant en Supabase
2. [ ] Create property record
3. [ ] Setup Supabase Storage para fotos
4. [ ] Begin landing page code modifications

### ESTA SEMANA:
- [ ] Complete Fase 1 (Landing page live con Supabase)
- [ ] Deploy to production
- [ ] Capture first real lead

---

## 📚 DOCUMENTOS DE REFERENCIA

**En este repositorio:**
- `AUTOPILOT_DEMO_WALKTHROUGH_30ENE2026.md` - Scripts de demo
- `INFORME_SUPABASE_IZUMI_HOTEL_29ENE2026.md` - Estructura de datos
- `PENDIENTES_PRIORIZADOS_30ENE2026.md` - Task list general

**Landing Page Code:**
- `nismarauna-main/src/components/villa/BookingSection.tsx` - Calendar
- `nismarauna-main/src/components/villa/BookingDialog.tsx` - Booking form

**MY HOST BizMate:**
- `src/components/Autopilot/Autopilot.jsx` - AUTOPILOT dashboard
- `src/services/supabase.js` - Supabase service layer
- `src/n8n_worlkflow_claude/WF-03-LEAD-HANDLER.json` - Lead handler workflow

---

*Plan creado: 30 Enero 2026*
*MY HOST BizMate - ZENTARA LIVING*
*Cliente: Nismara Uma Villa, Ubud, Bali*
