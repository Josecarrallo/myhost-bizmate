# MY HOST BIZMATE - SUPABASE SCHEMA DOCUMENTATION
## Para Claude Code - Frontend Migration
## Fecha: 17 Enero 2026

---

# ÍNDICE
1. Configuración de Conexión
2. IDs Importantes (Izumi Hotel)
3. Tablas Principales con Schemas
4. RPC Functions Disponibles
5. Conteo de Registros por Tabla
6. Campos Escritos por n8n (NO TOCAR desde frontend)
7. Enums y CHECK Constraints
8. Ejemplos de Queries

---

# 1. CONFIGURACIÓN DE CONEXIÓN

```typescript
// Supabase Config
const supabaseUrl = 'https://jjpscimtxrudtepzwhag.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY'; // Obtener de Supabase Dashboard

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

# 2. IDs IMPORTANTES (IZUMI HOTEL - CLIENTE PILOTO)

```typescript
// Constantes para Izumi Hotel
const IZUMI_TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';
const IZUMI_PROPERTY_ID = '18711359-1378-4d12-9ea6-fb31c0b1bac2'; // Tropical Room (slug: izumi-hotel)

// Otras properties de prueba (Izumi Hotel Villas)
const IZUMI_VILLAS = {
  'River Villa': 'a1111111-1111-1111-1111-111111111111',
  'Nest Villa': 'a2222222-2222-2222-2222-222222222222',
  'Cave Villa': 'a3333333-3333-3333-3333-333333333333',
  '5BR Grand Villa': 'a4444444-4444-4444-4444-444444444444',
  'Blossom Villa': 'a5555555-5555-5555-5555-555555555555',
  'Sky Villa': 'a6666666-6666-6666-6666-666666666666',
  'Tropical Room': 'a7777777-7777-7777-7777-777777777777',
};
```

---

# 3. TABLAS PRINCIPALES CON SCHEMAS

## 3.1 USERS (Tenants/Owners)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,                    -- ⚠️ Viene de auth.users
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'owner',     -- CHECK: owner|admin|reception|housekeeping|maintenance
  properties_access JSONB DEFAULT '[]',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 1 | **Frontend:** READ ONLY (el usuario se crea desde auth)

---

## 3.2 PROPERTIES (Villas/Rooms)
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  max_guests INTEGER DEFAULT 2,
  bedrooms INTEGER DEFAULT 1,
  bathrooms NUMERIC DEFAULT 1.0,
  base_price NUMERIC NOT NULL,           -- CHECK: > 0
  currency TEXT DEFAULT 'USD',
  amenities JSONB DEFAULT '[]',
  house_rules JSONB DEFAULT '[]',
  photos JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',           -- CHECK: active|inactive|maintenance
  owner_id UUID REFERENCES users(id),
  owner_phone TEXT,
  slug TEXT UNIQUE,                       -- Para URLs amigables
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 14 | **Frontend:** READ/WRITE

---

## 3.3 BOOKINGS ⭐ (Tabla más importante)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  guest_country TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,                -- CHECK: check_out > check_in
  guests INTEGER DEFAULT 1,               -- CHECK: > 0
  nights INTEGER,                         -- ⚠️ AUTO-CALCULADO por trigger
  status TEXT DEFAULT 'inquiry',          -- CHECK: inquiry|confirmed|checked_in|checked_out|cancelled
  total_price NUMERIC NOT NULL,           -- CHECK: >= 0
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending',  -- CHECK: pending|partial|paid|refunded
  channel TEXT DEFAULT 'direct',          -- CHECK: direct|airbnb|booking|expedia|agoda|vrbo|voice_ai
  notes TEXT,
  created_by UUID REFERENCES users(id),
  reservation_id TEXT,                    -- ID externo (Domus, etc)
  room_id TEXT,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  currency_code TEXT DEFAULT 'USD',
  source TEXT DEFAULT 'domus',
  channel_id INTEGER,
  raw_data JSONB,                         -- ⚠️ ESCRITO POR N8N
  journey_state TEXT DEFAULT 'booking_confirmed',  -- ⚠️ ESCRITO POR N8N
  last_journey_event_at TIMESTAMPTZ,      -- ⚠️ ESCRITO POR N8N
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 144 | **Frontend:** READ/WRITE (excepto campos marcados ⚠️)

---

## 3.4 LEADS ⭐ (CRM Unificado)
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  property_id UUID,
  name TEXT,
  phone TEXT,                             -- UNIQUE con tenant_id
  email TEXT,                             -- UNIQUE con tenant_id
  channel TEXT,                           -- CHECK: whatsapp|instagram|email|web|vapi
  state TEXT DEFAULT 'NEW',               -- CHECK: NEW|ENGAGED|HOT|FOLLOWING_UP|WON|LOST
  intent TEXT DEFAULT 'info',             -- CHECK: info|price|availability|booking (nullable)
  score INTEGER DEFAULT 0,                -- 0-100, AI calculated
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  message_history JSONB DEFAULT '[]',     -- ⚠️ ESCRITO POR N8N
  source_url TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  
  -- Follow-up tracking (⚠️ ESCRITO POR N8N)
  followup_step INTEGER DEFAULT 1,
  next_followup_at TIMESTAMPTZ,
  last_inbound_at TIMESTAMPTZ,
  last_outbound_at TIMESTAMPTZ,
  stay_nights INTEGER,
  villas_count INTEGER,
  requested_discount BOOLEAN DEFAULT false,
  last_owner_notified_at TIMESTAMPTZ,
  
  -- Preferences
  language TEXT DEFAULT 'en',
  brand_tone TEXT DEFAULT 'luxury',
  
  -- Closure
  closed_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  lost_reason TEXT,
  
  -- New fields
  source TEXT DEFAULT 'web',
  current_phase TEXT DEFAULT 'sales',     -- sales|booked|in_stay|post_stay
  last_event TEXT,                        -- ⚠️ ESCRITO POR N8N
  ai_control BOOLEAN DEFAULT true,
  standard_model JSONB,                   -- Master Event v1.0 completo
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_contacted_at TIMESTAMPTZ
);
```
**Rows:** 19 | **Frontend:** READ + LIMITED WRITE (ver sección 6)

---

## 3.5 LEAD_EVENTS (Event Log)
```sql
CREATE TABLE lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  event_type TEXT NOT NULL,               -- CHECK: lead_created|lead_updated|status_changed|
                                          --        followup_sent|message_received|message_sent|
                                          --        converted|lost|owner_notified|
                                          --        ai_hot_lead_detected|ai_ready_to_book
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT                         -- 'n8n'|'frontend'|'api'
);
```
**Rows:** 41 | **Frontend:** READ ONLY (n8n escribe los eventos)

---

## 3.6 GUESTS
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  nationality TEXT,
  total_bookings INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  avg_rating NUMERIC,
  notes TEXT,
  language TEXT DEFAULT 'en',
  tenant_id UUID,
  last_booking_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 16 | **Frontend:** READ/WRITE

---

## 3.7 PAYMENTS
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID,
  property_id UUID,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  transaction_id TEXT UNIQUE,
  transaction_date TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 14 | **Frontend:** READ/WRITE

---

## 3.8 WHATSAPP_MESSAGES
```sql
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  guest_contact_id UUID REFERENCES guest_contacts(id),
  phone_number TEXT NOT NULL,
  message TEXT,
  message_type TEXT DEFAULT 'manual',     -- CHECK: manual|automated|campaign|conversation
  status TEXT DEFAULT 'pending',          -- CHECK: pending|sent|delivered|read|failed|completed
  whatsapp_message_id TEXT,               -- ⚠️ ESCRITO POR N8N (ChakraHQ ID)
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT now(),
  delivered_at TIMESTAMPTZ,               -- ⚠️ ESCRITO POR N8N
  read_at TIMESTAMPTZ,                    -- ⚠️ ESCRITO POR N8N
  inbound_text TEXT,                      -- ⚠️ ESCRITO POR N8N
  outbound_text TEXT,                     -- ⚠️ ESCRITO POR N8N
  created_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 38 | **Frontend:** READ + LIMITED WRITE

---

## 3.9 COMMUNICATIONS_LOG
```sql
CREATE TABLE communications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  guest_id UUID NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  channel TEXT NOT NULL,                  -- CHECK: email|whatsapp
  template_key TEXT,
  recipient_email TEXT,
  recipient_phone TEXT,
  subject TEXT,
  message_body TEXT NOT NULL,
  status TEXT DEFAULT 'queued',           -- CHECK: queued|sent|failed|delivered|read
  provider_message_id TEXT,               -- ⚠️ ESCRITO POR N8N
  provider_response JSONB,                -- ⚠️ ESCRITO POR N8N
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  sent_by_user_id UUID REFERENCES users(id),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 31 | **Frontend:** READ ONLY (n8n escribe)

---

## 3.10 ALERTS
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES users(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_resource_type TEXT,
  related_resource_id UUID,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 0 | **Frontend:** READ/WRITE (marcar como leído/dismissed)

---

## 3.11 AI_CHAT_HISTORY_V2 (OSIRIS Chat)
```sql
CREATE TABLE ai_chat_history_v2 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES users(id),
  session_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context_mode TEXT DEFAULT 'overview',   -- CHECK: overview|bookings|revenue|operations
  date_range_from DATE,
  date_range_to DATE,
  kpis_snapshot JSONB DEFAULT '{}',
  actions_suggested JSONB DEFAULT '[]',
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 49 | **Frontend:** READ/WRITE

---

## 3.12 MARKETING TABLES

### marketing_campaigns
```sql
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  name TEXT NOT NULL,
  objective TEXT NOT NULL,                -- CHECK: leads|whatsapp_messages|website_visits|bookings
  status TEXT NOT NULL DEFAULT 'draft',   -- CHECK: draft|active|paused|completed
  platform TEXT NOT NULL,                 -- CHECK: meta|google|tiktok
  daily_budget NUMERIC,
  total_spend_mtd NUMERIC DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC,
  payload_json JSONB,
  external_campaign_id TEXT,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 4

### marketing_posts
```sql
CREATE TABLE marketing_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  platform TEXT NOT NULL,                 -- CHECK: instagram|facebook|tiktok|all
  status TEXT NOT NULL DEFAULT 'draft',   -- CHECK: draft|scheduled|published|failed
  caption TEXT,
  media_urls TEXT[],
  hashtags TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT,
  engagement_stats JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 3

### marketing_reviews
```sql
CREATE TABLE marketing_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  source TEXT NOT NULL,                   -- CHECK: airbnb|booking|google|tripadvisor|manual
  rating INTEGER,                         -- CHECK: 1-5
  review_text TEXT,
  guest_name TEXT,
  stay_date DATE,
  sentiment TEXT,                         -- CHECK: positive|neutral|negative
  response_text TEXT,
  response_date TIMESTAMPTZ,
  external_review_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 5

---

## 3.13 OPERATIONS TABLES

### housekeeping_tasks
```sql
CREATE TABLE housekeeping_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  booking_id UUID REFERENCES bookings(id),
  task_type TEXT NOT NULL,                -- CHECK: cleaning|inspection|restocking
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status TEXT DEFAULT 'pending',          -- CHECK: pending|in_progress|completed|cancelled
  assigned_to UUID REFERENCES users(id),
  priority TEXT DEFAULT 'medium',         -- CHECK: low|medium|high|urgent
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 0

### maintenance_issues
```sql
CREATE TABLE maintenance_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  issue_type TEXT NOT NULL,               -- CHECK: hvac|plumbing|electrical|pool|tech|security|preventive
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',         -- CHECK: low|medium|high|urgent
  status TEXT DEFAULT 'open',             -- CHECK: open|in_progress|resolved|closed
  assigned_to UUID REFERENCES users(id),
  reported_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 0

---

## 3.14 GUEST JOURNEY TABLES

### journey_settings
```sql
CREATE TABLE journey_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  property_id UUID REFERENCES properties(id),
  step_key TEXT NOT NULL,                 -- e.g., 'pre_arrival', 'welcome', 'checkout'
  enabled BOOLEAN DEFAULT true,
  channel TEXT,                           -- 'whatsapp'|'email'
  template_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 5

### journey_events
```sql
CREATE TABLE journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  booking_id UUID REFERENCES bookings(id),
  journey_state TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 1

---

## 3.15 WORKFLOW TABLES

### workflow_settings
```sql
CREATE TABLE workflow_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  workflow_key VARCHAR NOT NULL,          -- e.g., 'whatsapp_concierge', 'booking_notifications'
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMP,
  execution_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```
**Rows:** 4

### workflow_executions
```sql
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL,
  workflow_key VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  trigger_type VARCHAR NOT NULL,          -- manual|automatic|scheduled
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT now()
);
```
**Rows:** 4

---

## 3.16 OTHER TABLES

### guest_contacts (Marketing CRM)
```sql
CREATE TABLE guest_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  phone TEXT,
  segment TEXT[] DEFAULT '{}',            -- vip, recent, longstay, returning
  last_stay_date DATE,
  total_stays INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 5

### guest_tags
```sql
CREATE TABLE guest_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_id UUID NOT NULL,
  tag_type TEXT NOT NULL,                 -- CHECK: VIP|Repeat Guest|High Value|First Time|At Risk|Win Back|Loyal|Recent Booking|No Show
  tag_value TEXT,
  auto_assigned BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```
**Rows:** 29

### transfers (Airport Pickup)
```sql
CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  property_id UUID,
  type TEXT DEFAULT 'airport_pickup',     -- CHECK: airport_pickup|airport_dropoff|custom
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_datetime TIMESTAMPTZ NOT NULL,
  flight_number TEXT,
  passengers INTEGER NOT NULL DEFAULT 1,
  luggage INTEGER DEFAULT 0,
  price NUMERIC,
  currency TEXT DEFAULT 'USD',
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  status TEXT DEFAULT 'pending',          -- CHECK: pending|confirmed|assigned|in_progress|completed|cancelled
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_type TEXT,
  vehicle_plate TEXT,
  special_requests TEXT,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT
);
```
**Rows:** 0

---

# 4. RPC FUNCTIONS DISPONIBLES

## 4.1 Dashboard & Statistics

### get_dashboard_stats()
```typescript
// Returns main dashboard KPIs
const { data } = await supabase.rpc('get_dashboard_stats');
// Returns: { total_revenue, occupancy_rate, active_bookings, total_properties, 
//            guests_this_month, confirmed_bookings, pending_bookings, avg_daily_rate }
```

### get_today_checkins()
```typescript
// Returns today's check-ins
const { data } = await supabase.rpc('get_today_checkins');
// Returns: [{ booking_id, guest_name, property_name, guests, nights, check_in, check_out, total_price, status }]
```

### get_today_checkouts()
```typescript
// Returns today's check-outs
const { data } = await supabase.rpc('get_today_checkouts');
// Same structure as get_today_checkins
```

### get_active_alerts()
```typescript
const { data } = await supabase.rpc('get_active_alerts');
// Returns: [{ alert_id, message, severity, created_at, related_type, related_id }]
```

---

## 4.2 Revenue & Analytics

### calculate_total_revenue(p_tenant_id, p_date_from, p_date_to)
```typescript
const { data } = await supabase.rpc('calculate_total_revenue', {
  p_tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  p_date_from: '2026-01-01',
  p_date_to: '2026-01-31'
});
// Returns: numeric (total revenue)
```

### calculate_occupancy_rate(p_tenant_id, p_date_from, p_date_to)
```typescript
const { data } = await supabase.rpc('calculate_occupancy_rate', {
  p_tenant_id: 'uuid',
  p_date_from: '2026-01-01',
  p_date_to: '2026-01-31'
});
// Returns: numeric (0-100)
```

### calculate_adr(p_tenant_id, p_date_from, p_date_to)
```typescript
// Average Daily Rate
const { data } = await supabase.rpc('calculate_adr', { ... });
// Returns: numeric
```

### get_total_revenue(p_property_id?)
```typescript
const { data } = await supabase.rpc('get_total_revenue', {
  p_property_id: 'uuid' // optional
});
```

### get_pending_payments_total(p_property_id?)
```typescript
const { data } = await supabase.rpc('get_pending_payments_total');
```

---

## 4.3 Availability & Booking

### check_availability(p_property_id, p_check_in, p_check_out)
```typescript
const { data } = await supabase.rpc('check_availability', {
  p_property_id: 'a1111111-1111-1111-1111-111111111111',
  p_check_in: '2026-05-01',
  p_check_out: '2026-05-05'
});
// Returns: { property_id, name, description, base_price, currency, max_guests, available: boolean }
```

### calculate_booking_price(p_property_id, p_check_in, p_check_out, p_guests)
```typescript
const { data } = await supabase.rpc('calculate_booking_price', {
  p_property_id: 'uuid',
  p_check_in: '2026-05-01',
  p_check_out: '2026-05-05',
  p_guests: 2
});
// Returns: numeric (total price)
```

---

## 4.4 Leads & CRM

### find_lead_by_contact(p_phone?, p_email?, p_tenant_id?)
```typescript
const { data } = await supabase.rpc('find_lead_by_contact', {
  p_phone: '+6281234567890',
  p_tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
});
// Returns: [{ id, name, phone, email, channel, state, intent, score, created_at, last_contacted_at }]
```

### get_due_followup_leads(p_limit?)
```typescript
// ⚠️ USADO POR N8N - Frontend solo lectura
const { data } = await supabase.rpc('get_due_followup_leads', { p_limit: 100 });
// Returns leads que necesitan follow-up
```

### update_lead_after_followup(p_lead_id, p_new_step, p_next_followup_at, p_new_state, p_is_closure?)
```typescript
// ⚠️ USADO POR N8N - NO LLAMAR DESDE FRONTEND
```

### update_owner_notified(p_lead_id)
```typescript
// ⚠️ USADO POR N8N
```

### log_followup_event(p_lead_id, p_property_id, p_event_type, p_channel, p_step, p_intent)
```typescript
// ⚠️ USADO POR N8N
```

---

## 4.5 Property Lookup

### find_property_by_slug(p_slug)
```typescript
const { data } = await supabase.rpc('find_property_by_slug', {
  p_slug: 'izumi-hotel'
});
// Returns: { property_id, tenant_id, property_name, whatsapp_number }
```

---

## 4.6 Messages & Communications

### get_unread_messages_count(p_property_id?)
```typescript
const { data } = await supabase.rpc('get_unread_messages_count');
// Returns: integer
```

### get_ai_handled_messages_count(p_property_id?)
```typescript
const { data } = await supabase.rpc('get_ai_handled_messages_count');
// Returns: integer
```

### get_whatsapp_leads_without_booking(hours_back?)
```typescript
// ⚠️ USADO POR N8N
const { data } = await supabase.rpc('get_whatsapp_leads_without_booking', { hours_back: 24 });
```

---

## 4.7 AI Usage

### increment_ai_usage(p_tenant_id)
```typescript
// Incrementa contador de uso de AI (límite mensual)
const { data } = await supabase.rpc('increment_ai_usage', {
  p_tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db'
});
// Returns: boolean (true si tiene créditos, false si excedió límite)
```

---

# 5. CONTEO DE REGISTROS POR TABLA

| Tabla | Rows | Estado |
|-------|------|--------|
| bookings | 144 | ✅ Con datos |
| leads | 19 | ✅ Con datos |
| lead_events | 41 | ✅ Con datos |
| ai_chat_history_v2 | 49 | ✅ Con datos |
| ai_runs | 54 | ✅ Con datos |
| audit_logs | 49 | ✅ Con datos |
| whatsapp_messages | 38 | ✅ Con datos |
| communications_log | 31 | ✅ Con datos |
| guest_tags | 29 | ✅ Con datos |
| guests | 16 | ✅ Con datos |
| properties | 14 | ✅ Con datos |
| payments | 14 | ✅ Con datos |
| action_requests | 12 | ✅ Con datos |
| recommendation_logs | 10 | ✅ Con datos |
| workflow_logs | 13 | ✅ Con datos |
| messages | 8 | ✅ Con datos |
| owner_insights | 5 | ✅ Con datos |
| guest_contacts | 5 | ✅ Con datos |
| journey_settings | 5 | ✅ Con datos |
| marketing_reviews | 5 | ✅ Con datos |
| marketing_campaigns | 4 | ✅ Con datos |
| workflow_settings | 4 | ✅ Con datos |
| workflow_executions | 4 | ✅ Con datos |
| marketing_posts | 3 | ✅ Con datos |
| users | 1 | ✅ Con datos |
| marketing_connections | 1 | ✅ Con datos |
| ai_usage_tracking | 1 | ✅ Con datos |
| journey_events | 1 | ✅ Con datos |
| alerts | 0 | ⚪ Vacío |
| analytics | 0 | ⚪ Vacío |
| campaigns | 0 | ⚪ Vacío |
| cultural_events | 0 | ⚪ Vacío |
| digital_checkins | 0 | ⚪ Vacío |
| email_drafts | 0 | ⚪ Vacío |
| email_logs | 0 | ⚪ Vacío |
| escalations | 0 | ⚪ Vacío |
| guest_portal_access | 0 | ⚪ Vacío |
| guest_segments | 0 | ⚪ Vacío |
| housekeeping_tasks | 0 | ⚪ Vacío |
| journey_queue | 0 | ⚪ Vacío |
| maintenance_issues | 0 | ⚪ Vacío |
| messages_log | 0 | ⚪ Vacío |
| ops_tasks | 0 | ⚪ Vacío |
| pricing_rules | 0 | ⚪ Vacío |
| reviews | 0 | ⚪ Vacío |
| segment_guests | 0 | ⚪ Vacío |
| transfers | 0 | ⚪ Vacío |
| workflows | 0 | ⚪ Vacío |

---

# 6. CAMPOS ESCRITOS POR N8N (⚠️ NO TOCAR DESDE FRONTEND)

## 6.1 Tabla: leads
| Campo | Workflow que Escribe |
|-------|---------------------|
| message_history | WF-SP-01, BANYU |
| followup_step | WF-02 Follow-Up Engine |
| next_followup_at | WF-02 Follow-Up Engine |
| last_inbound_at | WF-SP-01, BANYU, KORA |
| last_outbound_at | WF-02, BANYU |
| last_owner_notified_at | WF-02 |
| last_event | WF-SP-01 |
| standard_model | WF-SP-01 |
| score | WF-SP-01 (AI calculated) |
| state | WF-02 (automático) |

**Frontend PUEDE escribir:**
- name, phone, email (creación manual)
- check_in, check_out, guests (actualización manual)
- notes, language (preferencias)

---

## 6.2 Tabla: bookings
| Campo | Workflow que Escribe |
|-------|---------------------|
| journey_state | GuestJourney-Scheduler |
| last_journey_event_at | GuestJourney-Scheduler |
| raw_data | DOMUS Polling, VAPI |

**Frontend PUEDE escribir:** Todos los demás campos

---

## 6.3 Tabla: whatsapp_messages
| Campo | Workflow que Escribe |
|-------|---------------------|
| whatsapp_message_id | BANYU (ChakraHQ) |
| delivered_at | BANYU (webhook status) |
| read_at | BANYU (webhook status) |
| inbound_text | BANYU |
| outbound_text | BANYU |
| status | BANYU |

**Frontend PUEDE:** Leer todo, escribir mensajes manuales

---

## 6.4 Tabla: lead_events
**Frontend:** READ ONLY
**Escribe:** WF-SP-01, WF-02, BANYU, KORA

---

## 6.5 Tabla: communications_log
**Frontend:** READ ONLY
**Escribe:** WF-BOOKING-NOTIFICATIONS, GuestJourney

---

## 6.6 Workflows → Tablas

| Workflow | Tablas que Escribe |
|----------|-------------------|
| WF-SP-01 Inbound Lead Handler | leads, lead_events |
| WF-02 Follow-Up Engine | leads, lead_events, whatsapp_messages |
| BANYU WhatsApp Concierge | whatsapp_messages, leads |
| WF-KORA-POST-CALL | leads, lead_events |
| WF-BOOKING-NOTIFICATIONS | communications_log, bookings |
| GuestJourney-Scheduler | journey_events, bookings, communications_log |
| Owner Daily Intelligence | owner_insights |
| WF-IA-01 Owner AI Assistant | ai_chat_history_v2, ai_runs |

---

# 7. ENUMS Y CHECK CONSTRAINTS

## bookings.status
```typescript
type BookingStatus = 'inquiry' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
```

## bookings.payment_status
```typescript
type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
```

## bookings.channel
```typescript
type BookingChannel = 'direct' | 'airbnb' | 'booking' | 'expedia' | 'agoda' | 'vrbo' | 'voice_ai';
```

## leads.state
```typescript
type LeadState = 'NEW' | 'ENGAGED' | 'HOT' | 'FOLLOWING_UP' | 'WON' | 'LOST';
```

## leads.intent
```typescript
type LeadIntent = 'info' | 'price' | 'availability' | 'booking' | null;
```

## leads.channel
```typescript
type LeadChannel = 'whatsapp' | 'instagram' | 'email' | 'web' | 'vapi';
```

## properties.status
```typescript
type PropertyStatus = 'active' | 'inactive' | 'maintenance';
```

## users.role
```typescript
type UserRole = 'owner' | 'admin' | 'reception' | 'housekeeping' | 'maintenance';
```

## guest_tags.tag_type
```typescript
type GuestTagType = 'VIP' | 'Repeat Guest' | 'High Value' | 'First Time' | 'At Risk' | 'Win Back' | 'Loyal' | 'Recent Booking' | 'No Show';
```

## housekeeping_tasks.task_type
```typescript
type TaskType = 'cleaning' | 'inspection' | 'restocking';
```

## housekeeping_tasks.priority / maintenance_issues.priority
```typescript
type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

## marketing_campaigns.platform
```typescript
type MarketingPlatform = 'meta' | 'google' | 'tiktok';
```

## marketing_posts.platform
```typescript
type PostPlatform = 'instagram' | 'facebook' | 'tiktok' | 'all';
```

---

# 8. EJEMPLOS DE QUERIES PARA FRONTEND

## 8.1 Dashboard - Get All Stats
```typescript
// Get dashboard stats
const { data: stats } = await supabase.rpc('get_dashboard_stats');

// Get today's check-ins/outs
const { data: checkins } = await supabase.rpc('get_today_checkins');
const { data: checkouts } = await supabase.rpc('get_today_checkouts');

// Get active alerts
const { data: alerts } = await supabase.rpc('get_active_alerts');
```

## 8.2 Bookings List
```typescript
const { data: bookings } = await supabase
  .from('bookings')
  .select(`
    *,
    properties!inner(name, city)
  `)
  .order('check_in', { ascending: true })
  .limit(50);
```

## 8.3 Leads Pipeline
```typescript
const { data: leads } = await supabase
  .from('leads')
  .select('*')
  .eq('tenant_id', IZUMI_TENANT_ID)
  .order('created_at', { ascending: false });

// Group by state for pipeline view
const pipeline = {
  NEW: leads?.filter(l => l.state === 'NEW') || [],
  ENGAGED: leads?.filter(l => l.state === 'ENGAGED') || [],
  HOT: leads?.filter(l => l.state === 'HOT') || [],
  FOLLOWING_UP: leads?.filter(l => l.state === 'FOLLOWING_UP') || [],
};
```

## 8.4 WhatsApp Inbox
```typescript
const { data: messages } = await supabase
  .from('whatsapp_messages')
  .select(`
    *,
    guest_contacts(full_name)
  `)
  .order('created_at', { ascending: false })
  .limit(100);
```

## 8.5 Properties List
```typescript
const { data: properties } = await supabase
  .from('properties')
  .select('*')
  .eq('status', 'active')
  .order('name');
```

## 8.6 Create New Booking (Frontend)
```typescript
const { data, error } = await supabase
  .from('bookings')
  .insert({
    property_id: 'a1111111-1111-1111-1111-111111111111',
    guest_name: 'John Doe',
    guest_email: 'john@example.com',
    guest_phone: '+1234567890',
    check_in: '2026-05-01',
    check_out: '2026-05-05',
    guests: 2,
    total_price: 2000,
    status: 'confirmed',
    channel: 'direct'
    // nights se calcula automáticamente por trigger
  })
  .select()
  .single();
```

## 8.7 Update Lead (Frontend - campos permitidos)
```typescript
const { data, error } = await supabase
  .from('leads')
  .update({
    name: 'Updated Name',
    check_in: '2026-06-01',
    check_out: '2026-06-05',
    guests: 4,
    language: 'es'
    // NO tocar: state, followup_step, message_history, etc.
  })
  .eq('id', leadId);
```

---

# FIN DEL DOCUMENTO

Para cualquier duda, contactar con Jose o revisar los workflows en n8n.

*Generado: 17 Enero 2026*
