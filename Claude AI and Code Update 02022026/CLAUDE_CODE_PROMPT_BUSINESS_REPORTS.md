# CLAUDE CODE — Business Reports Generator
## MY HOST BizMate / AUTOPILOT
### Fecha: 2 Febrero 2026

---

## 🎯 OBJETIVO

Construir un script Node.js que:
1. Conecte a Supabase
2. Consulte datos de bookings por property
3. Genere un informe HTML profesional (5 páginas)
4. Guarde el HTML en la tabla `generated_reports`
5. Opcionalmente exporte a PDF

El informe debe replicar el diseño del PDF de referencia adjunto: `Nismara_Uma_Villa_-_Business_Analysis_Report.pdf`

---

## 🔌 SUPABASE CONNECTION

```
URL: https://jjpscimtxrudtepzwhag.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

Para operaciones server-side usa el **service_role key** (obtener de Supabase Dashboard > Settings > API).

---

## 📊 DATABASE HIERARCHY

```
OWNER (users) → PROPERTY (properties) → VILLA (villas) → BOOKING (bookings)
```

Cada booking tiene 3 FKs obligatorios: `tenant_id`, `property_id`, `villa_id`

---

## 📋 SCHEMA DE TABLAS

### users
```sql
id              uuid PRIMARY KEY
full_name       text NOT NULL
email           text NOT NULL
role            text DEFAULT 'owner'    -- 'owner' | 'staff' | 'admin'
phone           text
```

### properties
```sql
id                    uuid PRIMARY KEY
name                  text NOT NULL
owner_id              uuid REFERENCES users(id)
currency              text DEFAULT 'USD'       -- 'USD' o 'IDR'
commission_rate       numeric DEFAULT 15.00    -- % comisión OTA
auto_reports_enabled  boolean DEFAULT false
report_frequency      text DEFAULT 'monthly'
report_day_of_month   integer DEFAULT 1
city                  text
country               text
status                text DEFAULT 'active'
owner_phone           text
owner_email           text
```

### villas
```sql
id            uuid PRIMARY KEY
property_id   uuid REFERENCES properties(id)
name          text NOT NULL
base_price    numeric
currency      text DEFAULT 'USD'
max_guests    integer DEFAULT 2
bedrooms      integer DEFAULT 1
bathrooms     numeric DEFAULT 1.0
status        text DEFAULT 'active'   -- 'active' | 'inactive' | 'maintenance'
```

### bookings
```sql
id                uuid PRIMARY KEY
property_id       uuid REFERENCES properties(id)
villa_id          uuid REFERENCES villas(id)
tenant_id         uuid                          -- owner's user id
guest_name        text NOT NULL
guest_email       text
guest_phone       text
guest_country     text
check_in          date NOT NULL
check_out         date NOT NULL
nights            integer
guests            integer DEFAULT 1
status            text DEFAULT 'inquiry'
-- status values: inquiry, confirmed, checked_in, checked_out, cancelled, provisional, pending_payment, expired
total_price       numeric NOT NULL
currency          text DEFAULT 'USD'
payment_status    text DEFAULT 'pending'
-- payment_status values: pending, partial, paid, refunded, expired
channel           text DEFAULT 'direct'
-- channel values: direct, airbnb, booking, expedia, agoda, vrbo, voice_ai, bali_buntu, instagram
adults            integer DEFAULT 1
children          integer DEFAULT 0
```

### generated_reports (donde guardar el output)
```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
property_id       uuid NOT NULL REFERENCES properties(id)
report_type       text DEFAULT 'monthly'      -- 'monthly' | 'weekly' | 'annual'
period_start      date NOT NULL
period_end        date NOT NULL
generated_at      timestamptz DEFAULT now()
generated_by      text                        -- 'autopilot' | 'manual'
report_url        text
report_html       text                        -- ← AQUÍ VA EL HTML COMPLETO
sent_to_owner     boolean DEFAULT false
-- Cached metrics:
total_bookings    integer
total_revenue     numeric
occupancy_rate    numeric
ota_commission    numeric
avg_booking_value numeric
```

---

## 🏨 DATOS ACTUALES (para testing)

### Owners
| Owner | owner_id | Currency |
|-------|----------|----------|
| Jose Carrallo | `c24393db-d318-4d75-8bbf-0fa240b9c1db` | USD |
| Gita Pradnyana | `1f32d384-4018-46a9-a6f9-058217e6924a` | IDR |

### Properties
| Property | property_id | Villas | Bookings | Revenue |
|----------|-------------|--------|----------|---------|
| Izumi Hotel & Villas | `18711359-1378-4d12-9ea6-fb31c0b1bac2` | 8 | 165 | $538,140 USD |
| Nismara Uma Villa | `3551cd18-af6b-48c2-85ba-4c5dc0074892` | 1 | 41 | IDR 139,909,985 |

### Villas Izumi (8)
| Villa | Bookings | Revenue USD |
|-------|----------|-------------|
| River Villa | 48 | $146,540 |
| Nest Villa | 29 | $85,450 |
| Cave Villa | 27 | $85,100 |
| 5BR Grand Villa | 10 | $75,600 |
| Sky Villa | 21 | $68,790 |
| Blossom Villa | 16 | $34,980 |
| 5BR Villa | 7 | $29,980 |
| Tropical Room | 7 | $11,700 |

**Total bookings en DB: 206 | Todos tienen villa_id y tenant_id (0 nulls)**

---

## 🔍 SQL QUERIES A EJECUTAR

### Q1: Owners con auto_reports habilitado
```sql
SELECT DISTINCT u.id as owner_id, u.full_name, u.email, u.phone
FROM users u
JOIN properties p ON p.owner_id = u.id
WHERE u.role = 'owner' AND p.auto_reports_enabled = true;
```

### Q2: Properties de un owner
```sql
SELECT p.id as property_id, p.name, p.city, p.country, p.currency, p.commission_rate,
  (SELECT COUNT(*) FROM villas v WHERE v.property_id = p.id AND v.status = 'active') as villa_count
FROM properties p
WHERE p.owner_id = :owner_id AND p.status = 'active';
```

### Q3: Villas de un property
```sql
SELECT v.id, v.name, v.base_price, v.currency, v.max_guests, v.bedrooms, v.status
FROM villas v
WHERE v.property_id = :property_id AND v.status = 'active'
ORDER BY v.name;
```

### Q4: KPIs mensuales (aggregated)
```sql
SELECT
  COUNT(*) as total_bookings,
  COALESCE(SUM(total_price), 0) as total_revenue,
  COALESCE(AVG(total_price), 0) as avg_booking_value,
  COALESCE(AVG(nights), 0) as avg_length_of_stay,
  COALESCE(SUM(nights), 0) as total_room_nights,
  ROUND(
    COALESCE(SUM(nights), 0)::numeric /
    NULLIF(
      (DATE_PART('day', :period_end::date - :period_start::date + INTERVAL '1 day'))::numeric
      * (SELECT COUNT(*) FROM villas WHERE property_id = :property_id AND status = 'active')::numeric
    , 0) * 100, 1
  ) as occupancy_rate
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired');
```

### Q5: KPIs por villa (drill-down)
```sql
SELECT
  v.name as villa_name, v.id as villa_id,
  COUNT(b.id) as bookings,
  COALESCE(SUM(b.total_price), 0) as revenue,
  COALESCE(AVG(b.total_price), 0) as avg_booking_value,
  COALESCE(SUM(b.nights), 0) as room_nights,
  ROUND(
    COALESCE(SUM(b.nights), 0)::numeric /
    NULLIF(DATE_PART('day', :period_end::date - :period_start::date + INTERVAL '1 day')::numeric, 0) * 100, 1
  ) as occupancy_rate
FROM villas v
LEFT JOIN bookings b ON b.villa_id = v.id
  AND b.check_in >= :period_start AND b.check_in <= :period_end
  AND b.status NOT IN ('cancelled', 'expired')
WHERE v.property_id = :property_id AND v.status = 'active'
GROUP BY v.id, v.name
ORDER BY revenue DESC;
```

### Q6: Channel breakdown
```sql
SELECT channel, COUNT(*) as bookings,
  COALESCE(SUM(total_price), 0) as revenue,
  ROUND(COUNT(*)::numeric / NULLIF(
    (SELECT COUNT(*) FROM bookings WHERE property_id = :property_id
     AND check_in >= :period_start AND check_in <= :period_end
     AND status NOT IN ('cancelled','expired')), 0) * 100, 1) as percentage
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired')
GROUP BY channel ORDER BY bookings DESC;
```

### Q7: Comisiones OTA
```sql
SELECT
  COALESCE(SUM(CASE WHEN channel NOT IN ('direct','voice_ai')
    THEN total_price * (SELECT commission_rate FROM properties WHERE id = :property_id) / 100
    ELSE 0 END), 0) as ota_commission_cost,
  COALESCE(SUM(CASE WHEN channel IN ('direct','voice_ai') THEN total_price ELSE 0 END), 0) as direct_revenue,
  COALESCE(SUM(CASE WHEN channel NOT IN ('direct','voice_ai') THEN total_price ELSE 0 END), 0) as ota_revenue
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired');
```

### Q8: Payment status
```sql
SELECT payment_status, COUNT(*) as count, COALESCE(SUM(total_price), 0) as amount
FROM bookings
WHERE property_id = :property_id
  AND check_in >= :period_start AND check_in <= :period_end
  AND status NOT IN ('cancelled', 'expired')
GROUP BY payment_status;
```

### Q9: Revenue trend (últimos 6 meses)
```sql
SELECT TO_CHAR(DATE_TRUNC('month', check_in), 'YYYY-MM') as month,
  COUNT(*) as bookings, COALESCE(SUM(total_price), 0) as revenue,
  COALESCE(SUM(nights), 0) as room_nights
FROM bookings
WHERE property_id = :property_id
  AND check_in >= (DATE_TRUNC('month', :report_date::date) - INTERVAL '6 months')
  AND check_in < DATE_TRUNC('month', :report_date::date)
  AND status NOT IN ('cancelled', 'expired')
GROUP BY DATE_TRUNC('month', check_in) ORDER BY month;
```

### Q10: Próximas reservas (30 días)
```sql
SELECT b.guest_name, v.name as villa_name, b.check_in, b.check_out,
  b.nights, b.guests, b.total_price, b.channel, b.payment_status
FROM bookings b LEFT JOIN villas v ON v.id = b.villa_id
WHERE b.property_id = :property_id
  AND b.check_in >= CURRENT_DATE AND b.check_in <= CURRENT_DATE + INTERVAL '30 days'
  AND b.status NOT IN ('cancelled', 'expired')
ORDER BY b.check_in;
```

### Q11: Year-to-Date
```sql
SELECT EXTRACT(YEAR FROM check_in) as year,
  COUNT(*) as bookings, COALESCE(SUM(total_price), 0) as revenue,
  COALESCE(SUM(nights), 0) as room_nights
FROM bookings
WHERE property_id = :property_id AND status NOT IN ('cancelled', 'expired')
GROUP BY EXTRACT(YEAR FROM check_in) ORDER BY year;
```

### Q12: Guardar reporte generado
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

## 📄 ESTRUCTURA DEL INFORME HTML (5 páginas)

### Página 1: Executive Summary
- Header: Nombre Property + "Business Performance Analysis" + Periodo
- 4 KPI Cards: Total Bookings, Total Revenue, Avg Booking Value, Avg Length of Stay
- 2 Charts: Revenue Trend (barras), Occupancy Rate (línea)
- Tabla resumen de performance

### Página 2: Villa Performance Breakdown
- Tabla comparativa: Villa | Bookings | Revenue | Occupancy | ADR
- Chart de barras comparando occupancy entre villas
- Highlight de top performing villa
- Flag villas con bajo rendimiento

### Página 3: Key Observations & Areas of Attention
- 6 Observation Cards (generados dinámicamente):
  - Occupancy vs periodo anterior
  - Guest database (emails capturados vs missing)
  - Channel distribution & OTA dependency %
  - Revenue trends
  - Payment status overview
  - Operational efficiency
- Areas de Atención: OTA commission cost, guest database gaps, booking pipeline

### Página 4: Recommended Actions
- Implementation roadmap
- Expected outcomes table

### Página 5: Detailed Booking List
- Tabla con todos los bookings del periodo
- Columnas: Guest, Villa, Check-in, Check-out, Nights, Pax, Revenue, Channel, Payment Status

---

## 🎨 DISEÑO (replicar del PDF de referencia)

```css
/* Color scheme */
--header-bg: #1e293b;       /* Dark navy headers */
--accent: #d5e8f0;          /* Light blue accents */
--card-bg: #f1f5f9;         /* Grey cards */
--text-primary: #1e293b;
--text-secondary: #64748b;
--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;

/* Font */
font-family: 'Inter', system-ui, sans-serif;

/* Tables */
zebra-striped, clean borders

/* Footer */
"Confidential Business Analysis" + fecha
```

---

## 💱 MONEDAS — CRÍTICO

1. **IDR**: Formato `IDR 3,444,389` (sin decimales)
2. **USD**: Formato `$2,500.00` (2 decimales)
3. **Para equivalente USD** (propiedades IDR): usar rate `1 USD = 16,000 IDR`
4. **NUNCA mezclar monedas** en cálculos — mantener por property

---

## 📐 OCCUPANCY — FÓRMULA EXACTA

```
occupancy_rate = (total_room_nights / (days_in_period × villa_count)) × 100
```

- `villa_count` viene de: `SELECT COUNT(*) FROM villas WHERE property_id = X AND status = 'active'`
- Nismara: 1 villa → `days × 1`
- Izumi: 8 villas → `days × 8`

**Per-villa occupancy:**
```
villa_occupancy = (villa_room_nights / days_in_period) × 100
```

---

## ✅ IMPLEMENTACIÓN PASO A PASO

### Paso 1: Setup proyecto
```bash
mkdir business-reports && cd business-reports
npm init -y
npm install @supabase/supabase-js
```

### Paso 2: Crear `generate-report.js`
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://jjpscimtxrudtepzwhag.supabase.co',
  'SERVICE_ROLE_KEY_AQUI'  // ← obtener de Supabase Dashboard
);

async function generateReport(propertyId, periodStart, periodEnd) {
  // 1. Ejecutar Q2-Q11 con los parámetros
  // 2. Construir HTML con los datos
  // 3. Guardar en generated_reports (Q12)
  // 4. Retornar el id del reporte
}
```

### Paso 3: Construir template HTML
- Usar los datos de las queries
- Charts con Chart.js CDN (dentro del HTML)
- CSS inline para que sea self-contained
- Print-friendly (page-break-after para cada sección)

### Paso 4: Guardar en Supabase
```javascript
const { data, error } = await supabase
  .from('generated_reports')
  .insert({
    property_id: propertyId,
    report_type: 'monthly',
    period_start: periodStart,
    period_end: periodEnd,
    generated_by: 'autopilot',
    report_html: htmlContent,
    total_bookings: kpis.total_bookings,
    total_revenue: kpis.total_revenue,
    occupancy_rate: kpis.occupancy_rate,
    ota_commission: commissions.ota_commission_cost,
    avg_booking_value: kpis.avg_booking_value
  })
  .select('id')
  .single();
```

### Paso 5: Test con datos reales
```bash
# Generar reporte de Nismara (tiene auto_reports=true)
node generate-report.js --property 3551cd18-af6b-48c2-85ba-4c5dc0074892 --start 2025-01-01 --end 2026-01-31

# Verificar resultado
# Expected: 41 bookings, IDR 139,909,985 revenue
```

---

## 🧪 VALIDACIÓN ESPERADA

### Test Nismara Uma Villa:
```
Total bookings: 41
Total revenue: IDR 139,909,985
Villas: 1
Top channels: bali_buntu(23), airbnb(11), booking(3), direct(3), instagram(1)
```

### Test Izumi Hotel & Villas:
```
Total bookings: 165
Total revenue: $538,140.00 USD
Villas: 8
Top villa: River Villa (48 bookings, $146,540)
```

---

## 📁 OUTPUT ESPERADO

1. **`generate-report.js`** — Script principal
2. **`report-template.js`** — Template HTML builder
3. **`package.json`** — Dependencias
4. **HTML guardado** en `generated_reports.report_html`
5. **Opcionalmente**: Exportar HTML a PDF con puppeteer

---

## ⚠️ REGLAS

- Conectar directamente a Supabase (no APIs intermedias)
- El HTML debe ser self-contained (CSS inline, charts con CDN)
- Respetar monedas por property (USD vs IDR)
- No inventar datos — solo lo que viene de las queries
- El informe debe escalar a N owners × M properties × K villas
- Usar las queries SQL exactas de este documento
- Replicar el diseño del PDF de referencia lo más cercano posible
