# NISMARA UMA - PLAN DEFINITIVO EN 3 FASES
## Introducción Gradual de Tecnología/AI - MY HOST BizMate

**Fecha:** 1 Febrero 2026
**Cliente:** Nismara Uma Villa (Ubud, Bali)
**Filosofía:** Mejorar su forma de trabajo actual paso a paso

---

## 🎯 VISIÓN GENERAL

### Objetivo
Transformar Nismara Uma de operación 100% manual a operación semi-automatizada con AI, manteniendo control total del owner.

### Filosofía de Implementación
**"Misma forma de trabajo, pero MEJORADA"**

No revolucionar todo de golpe, sino:
1. ✅ Agregar landing page para capturar más leads
2. ✅ Dar visibilidad de todo el negocio en un dashboard
3. ✅ Automatizar tareas repetitivas (confirmaciones, recordatorios)
4. ✅ Generar contenido para marketing
5. ✅ Analytics para tomar mejores decisiones

---

## 📋 3 FASES DE IMPLEMENTACIÓN

```
FASE 1: LANDING PAGE + BOOKING ENGINE (Semana 1-2)
   ↓
   Objetivo: Capturar bookings online + Stripe payments
   Resultado: Más leads, más revenue

FASE 2: AUTOPILOT + DATABASE CORE (Semana 3-4)
   ↓
   Objetivo: Visibilidad completa + Gestión mejorada
   Resultado: Owner trabaja igual pero con superpoderes

FASE 3: ADVANCED FEATURES (Mes 2+)
   ↓
   Objetivo: WhatsApp AI + Content Generation + Analytics
   Resultado: Operación casi 100% automatizada
```

---

## 🚀 FASE 1: LANDING PAGE + BOOKING ENGINE

**Timeline:** Semana 1-2 (1-14 Febrero)
**Objetivo:** Lanzar nismarauna.lovable.app al mercado para capturar bookings online

### 1.1 Landing Page Features

#### A) Villa Selection (si tienen múltiples villas en futuro)
```jsx
<VillaSelector>
  - Nismara Uma Main Villa (4 guests, IDR 1.3M/night)
  - [Future: Villa 2, Villa 3...]
</VillaSelector>
```

#### B) Availability Calendar
```jsx
<AvailabilityCalendar>
  - Fetch bookings de Supabase
  - Show blocked dates (confirmed bookings)
  - Show available dates (green)
  - Date range selection (check-in → check-out)
  - Min stay: 2 nights
</AvailabilityCalendar>
```

**Backend:**
```javascript
// API endpoint: /api/availability
const getAvailability = async (propertyId, month, year) => {
  const { data } = await supabase
    .from('bookings')
    .select('check_in_date, check_out_date')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed')
    .gte('check_in_date', `${year}-${month}-01`)
    .lte('check_in_date', `${year}-${month}-31`);

  // Generate array of blocked dates
  const blockedDates = [];
  data.forEach(booking => {
    let current = new Date(booking.check_in_date);
    const end = new Date(booking.check_out_date);
    while (current <= end) {
      blockedDates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
  });

  return blockedDates;
};
```

#### C) Booking Confirmation Flow
```
1. User selects dates: 15-18 Marzo (3 nights)
2. System calculates: 3 × IDR 1.3M = IDR 3.9M
3. User fills form:
   - Full name
   - Email *
   - Phone (WhatsApp) *
   - Country
   - Number of guests
   - Special requests (optional)

4. User chooses payment method:
   a) Pay with Stripe (credit card or bank transfer)
   b) Manual bank transfer (send screenshot via WhatsApp)

5. If Stripe:
   - Redirect to Stripe checkout
   - Payment processed
   - Booking status: 'confirmed', payment_status: 'paid'
   - Email + WhatsApp confirmation sent

6. If Manual:
   - Booking status: 'pending_payment'
   - WhatsApp sent with bank details
   - "Please send payment screenshot to confirm"
   - Owner verifies payment → Approve in AUTOPILOT
```

#### D) Automated Confirmations
```javascript
// n8n workflow: WF-BOOKING-CONFIRMATION

// Trigger: New booking inserted in Supabase
// Actions:
1. Send Email confirmation (SendGrid/Resend):
   - Booking details (dates, amount, guests)
   - Payment receipt (if Stripe)
   - Check-in instructions preview
   - Contact info

2. Send WhatsApp confirmation (ChakraHQ/BANYU):
   - "✅ Booking confirmed! Nismara Uma Villa
     📅 15-18 March 2026 (3 nights)
     💰 IDR 3.9M - Paid
     👤 2 guests

     We'll send check-in details 24h before arrival.
     Questions? Reply here anytime!"

3. Update calendar sync (opcional: Airbnb/Booking iCal export)
```

### 1.2 Stripe Integration

#### Setup:
```javascript
// Install Stripe
npm install @stripe/stripe-js stripe

// Backend: Create Stripe checkout session
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (booking) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'idr',
        product_data: {
          name: 'Nismara Uma Villa',
          description: `${booking.check_in_date} - ${booking.check_out_date} (${booking.nights} nights)`
        },
        unit_amount: booking.total_amount, // IDR 3900000 (in cents)
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/booking-cancelled`,
    metadata: {
      booking_id: booking.id,
      guest_email: booking.guest_email
    }
  });

  return session.url; // Redirect user to this URL
};
```

**Ventaja Stripe:**
- ✅ Acepta tarjetas internacionales (Visa, Mastercard, Amex)
- ✅ Acepta transferencias bancarias (SEPA, ACH)
- ✅ Confirmación instantánea (no esperar screenshot)
- ✅ Owner recibe dinero en 2-7 días
- ✅ Comisión: ~3.4% + $0.30 (vs 15-18% Airbnb/Booking)

### 1.3 Base de Datos Inicial (FASE 1)

**Tablas necesarias:**

```sql
-- 1. properties (villas)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  address TEXT,
  max_guests INT,
  bedrooms INT,
  bathrooms INT,
  price_per_night DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'IDR',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),

  -- Guest info
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  guest_country VARCHAR(100),
  number_of_guests INT NOT NULL,

  -- Booking details
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_nights INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'IDR',

  -- Source & status
  channel VARCHAR(100) DEFAULT 'Direct', -- 'Direct', 'Bali Buntu', 'Airbnb', etc.
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'refunded'
  payment_method VARCHAR(50), -- 'stripe', 'bank_transfer', 'cash'

  -- Payment details (Stripe)
  stripe_session_id VARCHAR(255),
  stripe_payment_intent VARCHAR(255),

  -- Special requests
  special_requests TEXT,
  notes TEXT, -- Owner private notes

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. payments (tracking de pagos)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'IDR',
  payment_method VARCHAR(50), -- 'stripe', 'bank_transfer', 'cash'
  payment_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'

  -- Stripe details
  stripe_payment_intent VARCHAR(255),
  stripe_charge_id VARCHAR(255),

  -- Bank transfer details
  bank_screenshot_url TEXT,
  verified_by UUID, -- admin/owner who verified
  verified_at TIMESTAMP,

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. guests (base de datos de clientes)
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),

  -- Marketing
  email_subscribed BOOLEAN DEFAULT true,
  whatsapp_subscribed BOOLEAN DEFAULT true,

  -- Stats
  total_bookings INT DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_stay_date DATE,

  -- Tags
  tags TEXT[], -- ['VIP', 'Repeat', 'Corporate', etc.]

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 1.4 Checklist FASE 1

**Semana 1 (1-7 Feb):**
- [ ] Modify landing page BookingSection.tsx (calendar sync con Supabase)
- [ ] Modify BookingDialog.tsx (3-step form + Stripe integration)
- [ ] Create Supabase tables (properties, bookings, payments, guests)
- [ ] Setup Stripe account + API keys
- [ ] Create n8n workflow: WF-BOOKING-CONFIRMATION (email + WhatsApp)

**Semana 2 (8-14 Feb):**
- [ ] Testing end-to-end (booking flow completo)
- [ ] Test Stripe payment (sandbox)
- [ ] Test manual bank transfer flow
- [ ] Deploy to production
- [ ] First real booking! 🎉

**Milestone:** Landing page LIVE, accepting bookings with payments

---

## 🎛️ FASE 2: AUTOPILOT + DATABASE CORE

**Timeline:** Semana 3-4 (15 Febrero - 28 Febrero)
**Objetivo:** Owner puede gestionar TODO su negocio desde AUTOPILOT dashboard

### 2.1 Database Core Completo

Agregar a las 4 tablas de Fase 1:

```sql
-- 5. property_maintenance (mantenimiento/acciones de property)
CREATE TABLE property_maintenance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),

  -- Maintenance details
  type VARCHAR(100) NOT NULL, -- 'cleaning', 'repair', 'inspection', 'gardening', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'NORMAL', -- 'URGENT', 'HIGH', 'NORMAL', 'LOW'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'

  -- Scheduling
  scheduled_date DATE,
  completed_date DATE,

  -- Assignment
  assigned_to VARCHAR(255), -- Staff name or company
  assigned_phone VARCHAR(50),

  -- Cost
  estimated_cost DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'IDR',

  -- Photos (before/after)
  photos_before TEXT[], -- Array of image URLs
  photos_after TEXT[],

  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 AUTOPILOT Dashboard - Módulos Core

#### A) Properties Management
```jsx
<PropertiesModule>
  - List all properties (Nismara Uma + futuras)
  - Add new property
  - Edit property details
  - Upload photos
  - Set pricing (low/high/peak season)
  - Status: Active/Inactive/Maintenance
</PropertiesModule>
```

#### B) Bookings Management
```jsx
<BookingsModule>
  - List all bookings (filters: upcoming, past, cancelled)
  - Calendar view (visual)
  - Booking details (guest, dates, payment status)
  - Actions:
    - Edit booking
    - Cancel booking
    - Send message to guest
    - Mark as checked-in/checked-out
  - Payment tracking:
    - Pending payments (red alert)
    - Paid bookings (green)
    - Verify manual transfers
</BookingsModule>
```

#### C) Guests Database (CRM)
```jsx
<GuestsModule>
  - List all guests
  - Search (name, email, phone, country)
  - Guest profile:
    - Contact info
    - Booking history
    - Total spent
    - Special preferences/notes
    - Tags (VIP, Repeat, Corporate)
  - Actions:
    - Send email
    - Send WhatsApp
    - Add to marketing campaign
</GuestsModule>
```

#### D) Payments Tracking
```jsx
<PaymentsModule>
  - List all payments
  - Filters: Pending, Paid, Failed
  - Payment details:
    - Booking reference
    - Amount
    - Method (Stripe, bank transfer, cash)
    - Status
    - Date
  - Pending verifications:
    - Guest sent screenshot → Owner verify
    - Click "Confirm Payment" → Update status
  - Revenue reports:
    - Daily/Weekly/Monthly revenue
    - By channel (Direct, Bali Buntu, Airbnb, etc.)
    - By payment method
</PaymentsModule>
```

#### E) Property Maintenance
```jsx
<MaintenanceModule>
  - List all maintenance tasks
  - Calendar view (scheduled tasks)
  - Create new task:
    - Type (cleaning, repair, inspection, etc.)
    - Priority (URGENT, HIGH, NORMAL, LOW)
    - Scheduled date
    - Assign to staff/company
    - Estimated cost
  - Task details:
    - Status (pending, in_progress, completed)
    - Upload before/after photos
    - Actual cost
    - Notes
  - Alerts:
    - Overdue tasks (red)
    - Upcoming tasks (yellow)
</MaintenanceModule>
```

### 2.3 AUTOPILOT Dashboard - Layout

```jsx
// src/components/Autopilot/Autopilot.jsx

const Autopilot = ({ onBack }) => {
  const [activeView, setActiveView] = useState('overview');

  return (
    <div className="flex-1 h-screen bg-[#2a2f3a] overflow-auto">
      {/* Top Navigation Tabs */}
      <div className="bg-[#1f2937] border-b border-white/10 sticky top-0 z-10">
        <div className="flex gap-4 px-6">
          <Tab active={activeView === 'overview'} onClick={() => setActiveView('overview')}>
            Overview
          </Tab>
          <Tab active={activeView === 'properties'} onClick={() => setActiveView('properties')}>
            Properties
          </Tab>
          <Tab active={activeView === 'bookings'} onClick={() => setActiveView('bookings')}>
            Bookings
          </Tab>
          <Tab active={activeView === 'guests'} onClick={() => setActiveView('guests')}>
            Guests
          </Tab>
          <Tab active={activeView === 'payments'} onClick={() => setActiveView('payments')}>
            Payments
          </Tab>
          <Tab active={activeView === 'maintenance'} onClick={() => setActiveView('maintenance')}>
            Maintenance
          </Tab>
          <Tab active={activeView === 'decisions'} onClick={() => setActiveView('decisions')}>
            Owner Decisions {pendingCount > 0 && <Badge>{pendingCount}</Badge>}
          </Tab>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeView === 'overview' && <OverviewView />}
        {activeView === 'properties' && <PropertiesView />}
        {activeView === 'bookings' && <BookingsView />}
        {activeView === 'guests' && <GuestsView />}
        {activeView === 'payments' && <PaymentsView />}
        {activeView === 'maintenance' && <MaintenanceView />}
        {activeView === 'decisions' && <OwnerDecisionsView />}
      </div>
    </div>
  );
};
```

### 2.4 Owner Experience - FASE 2

**Día típico del owner CON AUTOPILOT:**

**9:00 AM - Morning Check**
- Login to AUTOPILOT
- Overview dashboard muestra:
  - "2 new bookings yesterday (IDR 7.8M)"
  - "1 payment pending verification"
  - "Check-in today: Michael Chen (2 PM)"
  - "Cleaning scheduled: 10 AM (Villa 1)"

**9:05 AM - Verify Payment**
- Click "Payments" tab
- Ve screenshot de transferencia de guest
- Clicks "Confirm Payment" ✅
- WhatsApp automático enviado a guest: "Payment confirmed!"

**9:10 AM - Check Maintenance**
- Click "Maintenance" tab
- Ve: "Pool cleaning - Completed" (with after photos)
- Ve: "Garden maintenance - Scheduled tomorrow"

**9:15 AM - Done!**
- Total time: 15 minutos (vs 1-2 horas antes)

### 2.5 Checklist FASE 2

**Semana 3 (15-21 Feb):**
- [ ] Create property_maintenance table
- [ ] Create AUTOPILOT modules (Properties, Bookings, Guests, Payments, Maintenance)
- [ ] Import 41 bookings históricos de Excel
- [ ] Create guests records de bookings
- [ ] Testing CRUD operations (create, read, update, delete)

**Semana 4 (22-28 Feb):**
- [ ] Owner training (1 hora video call)
- [ ] Owner creates first maintenance task
- [ ] Owner verifies first payment
- [ ] Owner edits booking
- [ ] Owner satisfaction survey (NPS)

**Milestone:** Owner managing 100% de su operación desde AUTOPILOT

---

## 🤖 FASE 3: ADVANCED FEATURES

**Timeline:** Mes 2+ (Marzo 2026 onwards)
**Objetivo:** Automatización avanzada + AI + Content Generation

### 3.1 WhatsApp AI Automation (BANYU)

**Setup ChakraHQ + n8n workflows:**

```yaml
Workflow: WF-WHATSAPP-INQUIRY-HANDLER

Trigger: Incoming WhatsApp message

Step 1: Intent Detection (Claude AI)
  - If: "available?" → Check availability
  - If: "price?" → Send pricing
  - If: "book" → Start booking flow
  - If: "payment?" → Payment status
  - If: "check-in?" → Check-in instructions
  - If: Other → Forward to owner

Step 2: Check Availability (if intent = "available")
  Query Supabase: bookings table
  Response:
    - "Yes available! [dates]. Price: IDR [amount]. Book now?"
    - "Sorry, [dates] booked. Available [alternative dates]?"

Step 3: Booking Flow (if intent = "book")
  - Capture: Name, email, phone, dates, guests
  - Create lead in Supabase
  - Send landing page link: "Complete booking here: [link]"
  - Or create AUTOPILOT action for owner approval

Step 4: Payment Status (if intent = "payment")
  Query payments table
  Response:
    - "Payment received ✅"
    - "Pending payment. Bank details: [account]"

Step 5: Check-in Instructions (if intent = "check-in")
  Check booking status
  Send:
    - Address & directions
    - Host contact
    - WiFi password
    - House rules
```

### 3.2 Content Generation (Template n8n + Claude AI)

**Ya tienes el template! Solo customizar para Nismara Uma:**

```yaml
Workflow: WF-CONTENT-GENERATION

Trigger: Manual or Schedule (Weekly)

Input from owner:
  - "Villa photo" (upload)
  - "Theme" (Romantic getaway, Family vacation, Wellness retreat, etc.)
  - "Target audience" (Couples, Families, Solo travelers, etc.)

Claude AI Prompt:
  "Generate Instagram post for Nismara Uma Villa in Ubud, Bali.
   Villa features: 4 guests, private pool, rice field views, traditional Balinese architecture.
   Theme: [theme]
   Target: [audience]

   Generate:
   1. Caption (150-200 words, engaging, with emojis, 5 hashtags)
   2. Suggested posting time
   3. Call-to-action"

Output:
  - Caption text
  - Hashtags
  - Best time to post
  - Save to content_calendar table

Actions:
  - Send to owner for approval via WhatsApp
  - If approved: Auto-post to Instagram (via Instagram API)
  - Or: Copy to clipboard for manual posting
```

**Content Calendar Module:**
```jsx
<ContentCalendarModule>
  - Calendar view (monthly)
  - Scheduled posts
  - Generate new content (AI button)
  - Edit content
  - Approve/Reject
  - Auto-post or manual
  - Analytics (likes, comments, reach)
</ContentCalendarModule>
```

### 3.3 OSIRIS Analytics & Insights (CRÍTICO!)

**El papel de OSIRIS: Business Intelligence para Owner**

```jsx
<OSIRISModule>
  // Dashboard principal

  {/* Key Metrics */}
  <MetricsRow>
    <Metric>
      <Label>Revenue MTD</Label>
      <Value>IDR 18.5M</Value>
      <Change>+12% vs last month</Change>
    </Metric>

    <Metric>
      <Label>Occupancy Rate</Label>
      <Value>78%</Value>
      <Change>+5% vs last month</Change>
    </Metric>

    <Metric>
      <Label>Avg Booking Value</Label>
      <Value>IDR 3.2M</Value>
      <Change>+8% vs last month</Change>
    </Metric>

    <Metric>
      <Label>Repeat Guests</Label>
      <Value>15%</Value>
      <Change>+3% vs last month</Change>
    </Metric>
  </MetricsRow>

  {/* AI Insights */}
  <InsightsPanel>
    <h3>OSIRIS Insights</h3>

    <Insight priority="HIGH">
      🎯 "March bookings are 20% below target. Consider:
      - 10% discount for weekdays (Mon-Thu)
      - Instagram campaign targeting couples
      - Email blast to past guests"
    </Insight>

    <Insight priority="MEDIUM">
      💡 "Your Direct bookings (landing page) have 0% commission vs
      Bali Buntu (15%). Focus on direct channel for higher profit."
    </Insight>

    <Insight priority="LOW">
      📊 "Japanese guests spend 25% more than average. Target Japan
      market with travel agents."
    </Insight>
  </InsightsPanel>

  {/* Revenue Breakdown */}
  <RevenueChart>
    - By channel (Direct, Bali Buntu, Airbnb, etc.)
    - By month (trend)
    - By guest country
    - Forecast next month
  </RevenueChart>

  {/* Benchmarking */}
  <BenchmarkingPanel>
    <h3>Market Comparison</h3>

    <Benchmark>
      Your occupancy: 78%
      Ubud average: 65%
      You're outperforming by +13% 🎉
    </Benchmark>

    <Benchmark>
      Your ADR: IDR 1.3M
      Ubud average: IDR 1.5M
      Consider increasing price by 10-15%
    </Benchmark>
  </BenchmarkingPanel>

  {/* Chat with OSIRIS */}
  <ChatPanel>
    <h3>Ask OSIRIS Anything</h3>

    <ChatInput placeholder="How many bookings from Japan this year?" />

    <ChatResponse>
      "You had 6 bookings from Japan in 2025 (15% of total).
       Total revenue from Japan: IDR 19.5M.
       Avg stay: 4.2 nights vs overall avg 3.2 nights.

       Japanese guests are high-value! Consider:
       - Partner with Japanese travel agents
       - Add Japanese amenities (tea, slippers)
       - Translate website to Japanese"
    </ChatResponse>
  </ChatPanel>
</OSIRISModule>
```

### 3.4 Other Advanced Features

**A) Guest Journey Automation**
- Pre-arrival (24h before): Check-in instructions
- During stay (day 1): Welcome message + WiFi + amenities
- Post-checkout (day after): Thank you + review request

**B) Voice AI (KORA) - Opcional**
- Phone calls automated
- "Call to book" button on landing page
- KORA handles inquiry → Creates booking

**C) Smart Pricing (Dynamic pricing)**
- AI adjusts price based on:
  - Demand (high/low season)
  - Competitor pricing
  - Events in Ubud
  - Days to check-in

### 3.5 Checklist FASE 3

**Mes 2 (Marzo):**
- [ ] Setup WhatsApp AI (ChakraHQ + workflows)
- [ ] Test WhatsApp inquiry → booking flow
- [ ] Setup content generation workflow
- [ ] Generate first 5 Instagram posts with AI
- [ ] Build OSIRIS analytics module
- [ ] Owner uses OSIRIS for first business decision

**Mes 3 (Abril):**
- [ ] Guest Journey automation live
- [ ] Smart pricing (optional)
- [ ] Voice AI (optional)
- [ ] Full marketing automation

**Milestone:** Nismara Uma operando 90% automatizado, owner solo toma decisiones estratégicas

---

## 💰 PRICING ACTUALIZADO

### Setup Fee: $250 USD (one-time)
**Incluye:**
- FASE 1: Landing page + Booking engine + Stripe
- FASE 2: Database setup + Import históricos + AUTOPILOT modules
- n8n workflows (5 workflows core)
- Owner training (2 horas total)
- Documentation

### Monthly Subscription: $49/mes
**Incluye:**
- AUTOPILOT Dashboard (Properties, Bookings, Guests, Payments, Maintenance)
- Landing page hosting
- Supabase database (1 property, unlimited bookings)
- Email confirmations (unlimited)
- WhatsApp confirmations (via ChakraHQ, 1,000 msgs/month)
- Support (WhatsApp + email, Mon-Fri 9-6 PM)

**Add-ons (Opcional):**
- **WhatsApp AI (BANYU):** +$29/mes (5,000 msgs/month)
- **Content Generation (AI):** +$19/mes (20 posts/month)
- **OSIRIS Analytics:** +$39/mes (advanced insights + benchmarking)
- **Multi-property:** +$29/mes per property adicional

**Full Package:** $49 + $29 + $19 + $39 = **$136/mes**

---

## 📊 ROI ESTIMADO

### Investment:
- Setup: $250
- Monthly: $49-136/mes (depending on add-ons)
- **Year 1 Total:** $250 + ($49 × 12) = **$838 USD**

### Return:
**Más Bookings:**
- Landing page captura 2 bookings/mes adicionales
- 2 × IDR 3M × 12 meses = **IDR 72M/año** (~$4,500 USD)

**Ahorro de Comisiones:**
- 50% bookings migran de Bali Buntu (15% commission) a Direct (0%)
- Revenue anual ~IDR 150M
- 25% via Direct ahora (vs 0% antes)
- Savings: IDR 37.5M × 15% = **IDR 5.6M/año** (~$350 USD)

**Ahorro de Tiempo:**
- 10 horas/semana ahorradas
- 10 × 52 semanas = **520 horas/año**
- Value: 520 × $10/hora = **$5,200 USD**

**TOTAL ROI:**
- Revenue increase: $4,500
- Commission savings: $350
- Time savings: $5,200
- **Total: $10,050/año**

**ROI = ($10,050 - $838) / $838 = 1,100%** 🚀

---

## 🎯 SUCCESS METRICS

### FASE 1 (Week 2):
- [ ] Landing page live ✅
- [ ] First online booking received ✅
- [ ] First Stripe payment processed ✅

### FASE 2 (Week 4):
- [ ] Owner using AUTOPILOT daily ✅
- [ ] 41 históricos bookings imported ✅
- [ ] Owner verifies 1 payment via dashboard ✅

### FASE 3 (Month 3):
- [ ] WhatsApp AI handling 80% inquiries ✅
- [ ] 10+ AI-generated Instagram posts ✅
- [ ] Owner making data-driven decisions with OSIRIS ✅

### Month 6:
- [ ] 20% revenue increase ✅
- [ ] 50% bookings via Direct channel ✅
- [ ] Owner NPS 9+ ✅

---

## 📞 NEXT STEPS INMEDIATOS

### HOY (1 Febrero):
1. [ ] Owner aprueba plan de 3 fases
2. [ ] Owner firma contrato + paga $250 setup
3. [ ] Owner provee:
   - Fotos villa (10-15 high-res)
   - Property details completos
   - Bank account para Stripe
   - WhatsApp number

### MAÑANA (2 Febrero):
1. [ ] Create Supabase tenant & property
2. [ ] Begin landing page modifications
3. [ ] Setup Stripe account

### PRÓXIMOS 7 DÍAS:
- [ ] FASE 1 complete (landing page live)
- [ ] First real booking! 🎉

---

**Plan creado: 1 Febrero 2026**
**BY: José Carrallo + Claude AI**
**MY HOST BizMate - ZENTARA LIVING**

*Este es el plan DEFINITIVO. Ejecutable. Realista. Game-changing.* 🚀
