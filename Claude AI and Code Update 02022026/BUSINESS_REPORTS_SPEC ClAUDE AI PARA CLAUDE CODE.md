# AUTOPILOT Business Reports - Technical Specification
## For Claude Code Implementation
### Updated: 2 February 2026 (v2 — with villas hierarchy)

---

## 1. OBJECTIVE

Build a **Business Reports** feature in AUTOPILOT that generates monthly performance reports (like the reference PDF) for each property owner. Reports are generated from Supabase data and delivered automatically on the 1st of each month via n8n workflow.

---

## 2. SUPABASE CONNECTION

```
URL: https://jjpscimtxrudtepzwhag.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

> **Important**: For server-side operations (n8n, backend), use the **service_role** key (not included here for security — retrieve from Supabase dashboard > Settings > API).

---

## 3. DATABASE HIERARCHY

```
OWNER (users) → PROPERTY (properties) → VILLA (villas) → BOOKING (bookings)
```

Every booking has 3 mandatory foreign keys:
- `tenant_id` → Owner (who owns it)
- `property_id` → Property (which hotel/property)
- `villa_id` → Villa (which specific unit within the property)

---

## 4. DATABASE SCHEMA

### 4.1 Table: `users`
```sql
CREATE TABLE public.users (
  id              uuid PRIMARY KEY,  -- matches auth.users.id
  full_name       text NOT NULL,
  email           text NOT NULL,
  role            text NOT NULL DEFAULT 'owner',  -- 'owner' | 'staff' | 'admin'
  phone           text,
  properties_access jsonb DEFAULT '[]',
  avatar_url      text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

### 4.2 Table: `properties`
```sql
CREATE TABLE public.properties (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  text NOT NULL,
  description           text,
  address               text,
  city                  text,
  country               text,
  max_guests            integer DEFAULT 2,
  bedrooms              integer DEFAULT 1,
  bathrooms             numeric DEFAULT 1.0,
  base_price            numeric NOT NULL,        -- rack rate per night
  currency              text DEFAULT 'USD',      -- 'USD' or 'IDR'
  amenities             jsonb DEFAULT '[]',
  house_rules           jsonb DEFAULT '[]',
  photos                jsonb DEFAULT '[]',
  status                text DEFAULT 'active',
  owner_id              uuid REFERENCES users(id),
  owner_email           text,
  owner_phone           text,
  owner_phone_secondary text,
  slug                  text,
  whatsapp_number_id    uuid,
  commission_rate       numeric DEFAULT 15.00,   -- OTA commission %
  auto_reports_enabled  boolean DEFAULT false,   -- flag for auto-generation
  report_frequency      text DEFAULT 'monthly',  -- 'monthly' | 'weekly'
  report_day_of_month   integer DEFAULT 1,       -- day to generate
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);
```

### 4.3 Table: `villas` ← NEW
```sql
CREATE TABLE public.villas (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name          text NOT NULL,
  slug          text UNIQUE,
  description   text,
  base_price    numeric CHECK (base_price > 0),
  currency      text DEFAULT 'USD',
  max_guests    integer DEFAULT 2,
  bedrooms      integer DEFAULT 1,
  bathrooms     numeric DEFAULT 1.0,
  amenities     jsonb DEFAULT '[]',
  photos        jsonb DEFAULT '[]',
  status        text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
-- Indexes: idx_villas_property_id, idx_villas_status
```

### 4.4 Table: `bookings`
```sql
CREATE TABLE public.bookings (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id       uuid NOT NULL REFERENCES properties(id),
  villa_id          uuid REFERENCES villas(id),          -- ← NEW: specific villa/unit
  tenant_id         uuid,                                 -- owner's user id
  guest_name        text NOT NULL,
  guest_email       text,                                 -- nullable
  guest_phone       text,
  guest_country     text,
  check_in          date NOT NULL,
  check_out         date NOT NULL,
  guests            integer DEFAULT 1,
  nights            integer,
  status            text DEFAULT 'inquiry',
  -- status: inquiry, confirmed, checked_in, checked_out, cancelled, provisional, pending_payment, expired
  total_price       numeric NOT NULL,
  currency          text DEFAULT 'USD',
  payment_status    text DEFAULT 'pending',
  -- payment_status: pending, partial, paid, refunded, expired
  channel           text DEFAULT 'direct',
  -- channel: direct, airbnb, booking, expedia, agoda, vrbo, voice_ai, bali_buntu, instagram
  notes             text,
  source            text DEFAULT 'domus',
  reservation_id    text,
  room_id           text,                                 -- legacy field, villa name as string
  adults            integer DEFAULT 1,
  children          integer DEFAULT 0,
  raw_data          jsonb,
  journey_state     text DEFAULT 'booking_confirmed',
  payment_expiry_at timestamptz,
  payment_plan      jsonb,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
-- Index: idx_bookings_villa_id
```

### 4.5 Table: `generated_reports`
```sql
CREATE TABLE public.generated_reports (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id       uuid NOT NULL REFERENCES properties(id),
  report_type       text DEFAULT 'monthly',      -- 'monthly' | 'weekly' | 'annual'
  period_start      date NOT NULL,
  period_end        date NOT NULL,
  generated_at      timestamptz DEFAULT now(),
  generated_by      text,                        -- 'autopilot' | 'manual'
  report_url        text,                        -- URL to stored HTML/PDF
  report_html       text,                        -- full HTML content
  sent_to_owner     boolean DEFAULT false,
  sent_at           timestamptz,
  email_status      text,                        -- 'sent' | 'failed' | 'pending'
  email_error       text,
  -- Cached metrics for quick access:
  total_bookings    integer,
  total_revenue     numeric,
  occupancy_rate    numeric,
  ota_commission    numeric,
  avg_booking_value numeric,
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);
```

---

## 5. CURRENT DATA STATE

### 5.1 Owners

| Owner | owner_id | Phone | Email |
|-------|----------|-------|-------|
| **Jose Carrallo** | `c24393db-d318-4d75-8bbf-0fa240b9c1db` | +34619794604 | josecarrallodelafuente@gmail.com |
| **Gita Pradnyana** | `1f32d384-4018-46a9-a6f9-058217e6924a` | +62 813 5351 5520 | nismaraumavilla@gmail.com |

### 5.2 Properties (only 2 — clean, no duplicates)

| Property | property_id | Owner | Currency | Commission | Auto Reports |
|----------|-------------|-------|----------|------------|--------------|
| **Izumi Hotel & Villas** | `18711359-1378-4d12-9ea6-fb31c0b1bac2` | Jose Carrallo | USD | 15% | ❌ disabled |
| **Nismara Uma Villa** | `3551cd18-af6b-48c2-85ba-4c5dc0074892` | Gita Pradnyana | IDR | 15% | ✅ enabled |

### 5.3 Villas (9 total)

**Izumi Hotel & Villas** (8 villas):

| Villa | villa_id | Base Price | Max Guests | Bedrooms | Bookings | Revenue (USD) |
|-------|----------|------------|------------|----------|----------|---------------|
| River Villa | `b1000001-0001-4001-8001-000000000001` | $500 | 4 | 2 | 48 | $146,540 |
| Nest Villa | `b2000002-0002-4002-8002-000000000002` | $525 | 4 | 2 | 29 | $85,450 |
| Cave Villa | `b3000003-0003-4003-8003-000000000003` | $550 | 4 | 2 | 27 | $85,100 |
| 5BR Grand Villa | `b4000004-0004-4004-8004-000000000004` | $2,500 | 12 | 5 | 10 | $75,600 |
| Sky Villa | `b7000007-0007-4007-8007-000000000007` | $550 | 4 | 2 | 21 | $68,790 |
| Blossom Villa | `b6000006-0006-4006-8006-000000000006` | $600 | 4 | 2 | 16 | $34,980 |
| 5BR Villa | `b5000005-0005-4005-8005-000000000005` | $2,500 | 10 | 5 | 7 | $29,980 |
| Tropical Room | `b8000008-0008-4008-8008-000000000008` | $450 | 2 | 1 | 7 | $11,700 |

**Nismara Uma Villa** (1 villa):

| Villa | villa_id | Base Price | Max Guests | Bedrooms | Bookings | Revenue (IDR) |
|-------|----------|------------|------------|----------|----------|---------------|
| Nismara Uma Villa | `b9000009-0009-4009-8009-000000000009` | IDR 1,300,000 | 6 | 2 | 41 | IDR 139,909,985 |

### 5.4 Booking Totals

| Owner | Property | Total Bookings | Total Revenue |
|-------|----------|---------------|---------------|
| **Jose Carrallo** | Izumi Hotel & Villas | **165** | **$538,140 USD** |
| **Gita Pradnyana** | Nismara Uma Villa | **41** | **IDR 139,909,985** |
| | **TOTAL** | **206** | |

### 5.5 Channel Distribution

| Channel | DB Value | Izumi | Nismara | Total |
|---------|----------|-------|---------|-------|
| Direct booking | `direct` | varies | 3 | varies |
| Bali Buntu (OTA) | `bali_buntu` | 0 | 23 | 23 |
| Airbnb | `airbnb` | varies | 11 | varies |
| Booking.com | `booking` | varies | 3 | varies |
| Expedia | `expedia` | varies | 0 | varies |
| Agoda | `agoda` | varies | 0 | varies |
| Instagram | `instagram` | 0 | 1 | 1 |
| Voice AI (KORA) | `voice_ai` | varies | 0 | varies |
| VRBO | `vrbo` | varies | 0 | varies |

> **Scaling**: More owners will be added. The system must handle N owners × M properties × K villas dynamically.

---

## 6. SQL QUERIES FOR THE REPORT

### 6.1 Get all owners with auto_reports_enabled
```sql
SELECT DISTINCT
  u.id as owner_id,
  u.full_name as owner_name,
  u.email as owner_email,
  u.phone as owner_phone
FROM users u
JOIN properties p ON p.owner_id = u.id
WHERE u.role = 'owner'
  AND p.auto_reports_enabled = true;
```

### 6.2 Get properties for an owner
```sql
SELECT
  p.id as property_id,
  p.name,
  p.city,
  p.country,
  p.base_price,
  p.currency,
  p.commission_rate,
  (SELECT COUNT(*) FROM villas v WHERE v.property_id = p.id AND v.status = 'active') as villa_count
FROM properties p
WHERE p.owner_id = :owner_id
  AND p.status = 'active';
```

### 6.3 Get villas for a property
```sql
SELECT
  v.id as villa_id,
  v.name,
  v.base_price,
  v.currency,
  v.max_guests,
  v.bedrooms,
  v.bathrooms,
  v.status
FROM villas v
WHERE v.property_id = :property_id
  AND v.status = 'active'
ORDER BY v.name;
```

### 6.4 Monthly KPIs for a property (all villas aggregated)
```sql
-- Parameters: :property_id, :period_start, :period_end
SELECT
  COUNT(*) as total_bookings,
  COALESCE(SUM(total_price), 0) as total_revenue,
  COALESCE(AVG(total_price), 0) as avg_booking_value,
  COALESCE(AVG(nights), 0) as avg_length_of_stay,
  COALESCE(SUM(nights), 0) as total_room_nights,
  -- Occupancy: room_nights / (days_in_period * villa_count)
  ROUND(
    COALESCE(SUM(nights), 0)::numeric /
    NULLIF(
      (DATE_PART('day', :period_end::date - :period_start::date + INTERVAL '1 day'))::numeric
      * (SELECT COUNT(*) FROM villas WHERE property_id = :property_id AND status = 'active')::numeric
    , 0) * 100,
    1
  ) as occupancy_rate
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start
  AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired');
```

### 6.5 Monthly KPIs per villa (drill-down)
```sql
-- Parameters: :property_id, :period_start, :period_end
SELECT
  v.name as villa_name,
  v.id as villa_id,
  COUNT(b.id) as bookings,
  COALESCE(SUM(b.total_price), 0) as revenue,
  COALESCE(AVG(b.total_price), 0) as avg_booking_value,
  COALESCE(SUM(b.nights), 0) as room_nights,
  ROUND(
    COALESCE(SUM(b.nights), 0)::numeric /
    NULLIF(DATE_PART('day', :period_end::date - :period_start::date + INTERVAL '1 day')::numeric, 0) * 100,
    1
  ) as occupancy_rate
FROM villas v
LEFT JOIN bookings b ON b.villa_id = v.id
  AND b.check_in >= :period_start
  AND b.check_in <= :period_end
  AND b.status NOT IN ('cancelled', 'expired')
WHERE v.property_id = :property_id
  AND v.status = 'active'
GROUP BY v.id, v.name
ORDER BY revenue DESC;
```

### 6.6 Channel breakdown
```sql
SELECT
  channel,
  COUNT(*) as bookings,
  COALESCE(SUM(total_price), 0) as revenue,
  ROUND(COUNT(*)::numeric / NULLIF(
    (SELECT COUNT(*) FROM bookings
     WHERE property_id = :property_id
       AND check_in >= :period_start AND check_in <= :period_end
       AND status NOT IN ('cancelled','expired')),
    0) * 100, 1) as percentage
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start
  AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired')
GROUP BY channel
ORDER BY bookings DESC;
```

### 6.7 OTA Commission calculation
```sql
SELECT
  COALESCE(SUM(
    CASE WHEN channel NOT IN ('direct', 'voice_ai')
    THEN total_price * (SELECT commission_rate FROM properties WHERE id = :property_id) / 100
    ELSE 0 END
  ), 0) as ota_commission_cost,
  COALESCE(SUM(
    CASE WHEN channel IN ('direct', 'voice_ai')
    THEN total_price ELSE 0 END
  ), 0) as direct_revenue,
  COALESCE(SUM(
    CASE WHEN channel NOT IN ('direct', 'voice_ai')
    THEN total_price ELSE 0 END
  ), 0) as ota_revenue
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start
  AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired');
```

### 6.8 Payment status summary
```sql
SELECT
  payment_status,
  COUNT(*) as count,
  COALESCE(SUM(total_price), 0) as amount
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start
  AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired')
GROUP BY payment_status;
```

### 6.9 Revenue trend (last 6 months)
```sql
SELECT
  TO_CHAR(DATE_TRUNC('month', check_in), 'YYYY-MM') as month,
  COUNT(*) as bookings,
  COALESCE(SUM(total_price), 0) as revenue,
  COALESCE(SUM(nights), 0) as room_nights
FROM bookings
WHERE property_id = :property_id
  AND check_in >= (DATE_TRUNC('month', :report_date::date) - INTERVAL '6 months')
  AND check_in < DATE_TRUNC('month', :report_date::date)
  AND status NOT IN ('cancelled', 'expired')
GROUP BY DATE_TRUNC('month', check_in)
ORDER BY month;
```

### 6.10 Upcoming bookings (next 30 days)
```sql
SELECT
  b.guest_name,
  v.name as villa_name,
  b.check_in,
  b.check_out,
  b.nights,
  b.guests,
  b.total_price,
  b.channel,
  b.payment_status
FROM bookings b
LEFT JOIN villas v ON v.id = b.villa_id
WHERE b.property_id = :property_id
  AND b.check_in >= CURRENT_DATE
  AND b.check_in <= CURRENT_DATE + INTERVAL '30 days'
  AND b.status NOT IN ('cancelled', 'expired')
ORDER BY b.check_in;
```

### 6.11 Year-to-Date cumulative
```sql
SELECT
  EXTRACT(YEAR FROM check_in) as year,
  COUNT(*) as bookings,
  COALESCE(SUM(total_price), 0) as revenue,
  COALESCE(SUM(nights), 0) as room_nights
FROM bookings
WHERE property_id = :property_id
  AND status NOT IN ('cancelled', 'expired')
GROUP BY EXTRACT(YEAR FROM check_in)
ORDER BY year;
```

### 6.12 Save generated report
```sql
INSERT INTO generated_reports (
  property_id, report_type, period_start, period_end,
  generated_by, report_html, total_bookings, total_revenue,
  occupancy_rate, ota_commission, avg_booking_value
) VALUES (
  :property_id, 'monthly', :period_start, :period_end,
  'autopilot', :html_content, :total_bookings, :total_revenue,
  :occupancy_rate, :ota_commission, :avg_booking_value
) RETURNING id;
```

---

## 7. REPORT STRUCTURE (Based on Reference PDF)

The report should be generated as **HTML** (stored in `generated_reports.report_html`) and optionally convertible to PDF.

### Page 1: Executive Summary
- **Header**: Property Name + "Business Performance Analysis" + Period
- **4 KPI Cards**: Total Bookings, Total Revenue, Avg Booking Value, Avg Length of Stay
- **2 Charts**: Revenue Trend (bar chart), Occupancy Rate (line chart)
- **Performance Summary Table**: Period | Status | Bookings | Revenue | Occupancy | ADR
- **Full-Year Scenarios** (optional, for properties with enough data)

### Page 2: Villa Performance Breakdown ← NEW
- **Villa comparison table**: Villa Name | Bookings | Revenue | Occupancy | ADR
- **Villa occupancy chart**: Bar chart comparing occupancy across villas
- **Top performing villa highlight**
- **Underperforming villas**: Flag villas below average

### Page 3: Key Observations & Areas of Attention
- **6 Observation Cards** (generated dynamically):
  - Occupancy performance vs previous period
  - Guest database potential (captured vs missing contact info)
  - Channel distribution & OTA dependency %
  - Revenue trends (growth/decline)
  - Payment status overview
  - Operational efficiency metrics
- **Areas of Attention**:
  - OTA commission cost calculation
  - Guest database gaps
  - Upcoming booking pipeline

### Page 4: Recommended Actions (templated)
- Implementation roadmap
- Expected outcomes table

### Page 5: Detailed Booking List
- Table with all bookings in the period
- Guest name, **villa name**, dates, nights, pax, revenue, channel, payment status

---

## 8. MULTI-CURRENCY HANDLING

Properties use different currencies (USD and IDR). The report must:

1. **Display amounts in the property's native currency** (from `properties.currency`)
2. **Format correctly**:
   - IDR: `IDR 3,444,389` (no decimals)
   - USD: `$2,500.00` (2 decimals)
3. **For USD equivalent** (IDR properties): use approximate rate `1 USD = 16,000 IDR`
4. **Never mix currencies** in calculations — keep per-property

---

## 9. OCCUPANCY CALCULATION

**Updated formula using villas table:**

```
occupancy_rate = (total_room_nights / (days_in_period × villa_count)) × 100
```

- **villa_count** comes from: `SELECT COUNT(*) FROM villas WHERE property_id = :property_id AND status = 'active'`
- **Nismara Uma Villa**: 1 villa → `days_in_period × 1`
- **Izumi Hotel & Villas**: 8 villas → `days_in_period × 8`

**Per-villa occupancy** (for villa breakdown page):
```
villa_occupancy = (villa_room_nights / days_in_period) × 100
```

> No more guessing based on `max_guests`. The villas table provides the exact unit count.

---

## 10. N8N WORKFLOW SPECIFICATION

### Trigger
- **Schedule Trigger**: Runs on the 1st of each month at 08:00 WITA (Bali time, UTC+8)
- CRON: `0 0 1 * *` (adjust for timezone)

### Flow
```
Schedule Trigger (1st of month, 08:00 WITA)
    ↓
Query Supabase: Get owners with auto_reports_enabled=true
    ↓
For Each Owner:
    ↓
    Query Supabase: Get owner's properties
        ↓
        For Each Property:
            ↓
            Query Supabase: Get property's villas (query 6.3)
            ↓
            Query Supabase: Execute all report SQL queries (6.4-6.11)
            ↓
            Generate HTML Report (include villa breakdown page)
            ↓
            Save to generated_reports table (6.12)
            ↓
            Send WhatsApp notification to owner (via ChakraHQ)
                Message: "📊 Tu reporte mensual de {property_name} está listo.
                         Periodo: {month/year}
                         Bookings: {total_bookings}
                         Revenue: {total_revenue}
                         Occupancy: {occupancy_rate}%
                         Top villa: {top_villa_name}"
            ↓
            (Optional) Send email with HTML report attached
```

### n8n Instance
```
URL: https://n8n-production-bb2d.up.railway.app
```

### ChakraHQ WhatsApp Integration
- Owner phone (Gita): +62 813 5351 5520
- Owner phone (Jose): +34 619 794 604
- Automated sender: +62 813 2576 4867

---

## 11. API ENDPOINT (Optional — for manual trigger)

If building an API endpoint to trigger report generation on-demand:

```
POST /api/reports/generate
Body: {
  "owner_id": "uuid",           // optional, null = all owners
  "property_id": "uuid",        // optional, null = all properties for owner
  "period_start": "2026-01-01", // optional, defaults to previous month
  "period_end": "2026-01-31"    // optional, defaults to previous month
}
```

---

## 12. IMPLEMENTATION PRIORITY

1. **Phase 1 (NOW)**: Build the SQL query engine + HTML report generator
   - Input: owner_id + period
   - Output: HTML report matching the reference PDF design
   - Include villa breakdown page for multi-villa properties
   - Store in `generated_reports` table

2. **Phase 2**: n8n workflow for monthly automation
   - Schedule trigger
   - Loop through enabled owners/properties
   - Generate + store + notify

3. **Phase 3**: WhatsApp delivery + email PDF attachment

---

## 13. REFERENCE DESIGN

The attached PDF `Nismara_Uma_Villa_-_Business_Analysis_Report.pdf` is the **exact design** to replicate. Key design elements:

- **Color scheme**: Dark navy headers (#1e293b), light blue accents (#d5e8f0), grey cards (#f1f5f9)
- **Font**: Clean sans-serif (Inter or system)
- **Charts**: Bar chart for revenue trend, line chart for occupancy
- **Cards**: 4 KPI cards at top, 6 observation cards in grid
- **Tables**: Zebra-striped, clean borders
- **Footer**: "Confidential Business Analysis" + date

---

## 14. TESTING

### Verify with Nismara Uma Villa (real data):
```sql
-- Expected results for full period:
-- Total bookings: 41
-- Total revenue: IDR 139,909,985
-- Villas: 1 (Nismara Uma Villa)
-- Channels: bali_buntu(23), airbnb(11), booking(3), direct(3), instagram(1)

SELECT COUNT(*), SUM(total_price)
FROM bookings
WHERE property_id = '3551cd18-af6b-48c2-85ba-4c5dc0074892';
-- Expected: 41 | 139909985.00
```

### Verify with Izumi Hotel & Villas (consolidated data):
```sql
-- Expected results for full period:
-- Total bookings: 165
-- Total revenue: $538,140.00 USD
-- Villas: 8 (River, Nest, Cave, 5BR Grand, Sky, Blossom, 5BR, Tropical)

SELECT COUNT(*), SUM(total_price)
FROM bookings
WHERE property_id = '18711359-1378-4d12-9ea6-fb31c0b1bac2';
-- Expected: 165 | 538140.00
```

### Verify villa breakdown for Izumi:
```sql
SELECT v.name, COUNT(b.id) as bookings, SUM(b.total_price) as revenue
FROM villas v
LEFT JOIN bookings b ON b.villa_id = v.id
WHERE v.property_id = '18711359-1378-4d12-9ea6-fb31c0b1bac2'
GROUP BY v.name
ORDER BY revenue DESC;
-- Expected:
-- River Villa    | 48 | 146540.00
-- Nest Villa     | 29 | 85450.00
-- Cave Villa     | 27 | 85100.00
-- 5BR Grand Villa| 10 | 75600.00
-- Sky Villa      | 21 | 68790.00
-- Blossom Villa  | 16 | 34980.00
-- 5BR Villa      |  7 | 29980.00
-- Tropical Room  |  7 | 11700.00
```

### Verify all bookings have required FKs:
```sql
SELECT
  COUNT(*) as total,
  COUNT(villa_id) as with_villa,
  COUNT(tenant_id) as with_tenant,
  COUNT(*) - COUNT(villa_id) as missing_villa,
  COUNT(*) - COUNT(tenant_id) as missing_tenant
FROM bookings;
-- Expected: 206 | 206 | 206 | 0 | 0
```

---

## 15. CHANGELOG (v1 → v2)

| Change | v1 (Jan 2026) | v2 (Feb 2026) |
|--------|---------------|---------------|
| **Database hierarchy** | Owner → Property → Booking | Owner → Property → **Villa** → Booking |
| **New table** | — | `villas` (9 records) |
| **New column** | — | `bookings.villa_id` (FK to villas) |
| **Properties count** | 15 (with duplicates) | **2** (clean) |
| **Izumi bookings** | 45 (only tenant_id set) | **165** (all consolidated) |
| **Izumi revenue** | $50,140 | **$538,140** |
| **Missing tenant_id** | 120 bookings with NULL | **0** (all assigned) |
| **Occupancy calc** | Guessed from max_guests | **Exact from villas table** |
| **Report structure** | 4 pages | **5 pages** (added villa breakdown) |
| **Villa drill-down** | Not possible | **Full per-villa metrics** |
