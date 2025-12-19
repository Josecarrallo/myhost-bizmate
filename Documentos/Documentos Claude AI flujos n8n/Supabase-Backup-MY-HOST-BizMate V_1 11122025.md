# SUPABASE BACKUP - MY HOST BIZMATE
## Backup Completo de Base de Datos
**Fecha:** 11 Diciembre 2025
**Proyecto:** jjpscimtxrudtepzwhag

---

## ÍNDICE

1. [Resumen](#1-resumen)
2. [Tablas](#2-tablas)
3. [Estructura de Tablas](#3-estructura-de-tablas)
4. [Triggers](#4-triggers)
5. [Funciones](#5-funciones)
6. [Webhook a n8n](#6-webhook-a-n8n)

---

## 1. RESUMEN

| Elemento | Cantidad |
|----------|----------|
| Tablas | 19 |
| Triggers | 8 |
| Funciones | 8 |

---

## 2. TABLAS

```
ai_chat_history
analytics
audit_logs
bookings
campaigns
cultural_events
digital_checkins
guest_portal_access
guests
housekeeping_tasks
maintenance_issues
messages
payments
pricing_rules
properties
recommendation_logs
reviews
users
workflows
```

---

## 3. ESTRUCTURA DE TABLAS

### bookings (TABLA PRINCIPAL)
```sql
CREATE TABLE bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  property_id uuid NOT NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  guest_country text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer DEFAULT 1,
  nights integer,
  status text DEFAULT 'inquiry',
  total_price numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_status text DEFAULT 'pending',
  channel text DEFAULT 'direct',
  notes text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### properties
```sql
CREATE TABLE properties (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  -- ... base_price, owner_phone, etc.
  updated_at timestamp with time zone DEFAULT now()
);
```

### payments
```sql
CREATE TABLE payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL,
  amount numeric,
  status text,
  -- ...
  updated_at timestamp with time zone DEFAULT now()
);
```

### guests
```sql
CREATE TABLE guests (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text,
  phone text,
  nationality text,
  total_bookings integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  avg_rating numeric,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### ai_chat_history
```sql
CREATE TABLE ai_chat_history (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  message text NOT NULL,
  response text,
  created_at timestamp with time zone DEFAULT now()
);
```

### analytics
```sql
CREATE TABLE analytics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  property_id uuid,
  date date NOT NULL,
  revenue numeric DEFAULT 0,
  bookings_count integer DEFAULT 0,
  occupancy_rate numeric DEFAULT 0,
  avg_daily_rate numeric DEFAULT 0,
  guests_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
```

### digital_checkins
```sql
CREATE TABLE digital_checkins (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL,
  passport_number text,
  passport_photo_url text,
  arrival_time time,
  special_requests text,
  status text DEFAULT 'pending',
  access_code text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
```

### guest_portal_access
```sql
CREATE TABLE guest_portal_access (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  booking_id uuid NOT NULL,
  access_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval),
  created_at timestamp with time zone DEFAULT now()
);
```

### housekeeping_tasks
```sql
CREATE TABLE housekeeping_tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  property_id uuid NOT NULL,
  booking_id uuid,
  task_type text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time,
  status text DEFAULT 'pending',
  assigned_to uuid,
  priority text DEFAULT 'medium',
  notes text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### campaigns
```sql
CREATE TABLE campaigns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name text NOT NULL,
  platform text,
  status text DEFAULT 'draft',
  reach integer DEFAULT 0,
  engagement integer DEFAULT 0,
  clicks integer DEFAULT 0,
  budget numeric,
  start_date date,
  end_date date,
  content text,
  target_audience text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### cultural_events
```sql
CREATE TABLE cultural_events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  country text NOT NULL,
  impact text DEFAULT 'medium',
  event_date date NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

---

## 4. TRIGGERS

| Trigger | Tabla | Evento | Función |
|---------|-------|--------|---------|
| calculate_nights_trigger | bookings | BEFORE INSERT/UPDATE | calculate_nights() |
| update_payment_status_on_payment | payments | AFTER INSERT/UPDATE | update_booking_payment_status() |
| update_properties_updated_at | properties | BEFORE UPDATE | update_updated_at_column() |
| update_bookings_updated_at | bookings | BEFORE UPDATE | update_updated_at_column() |
| update_payments_updated_at | payments | BEFORE UPDATE | update_updated_at_column() |
| **on_booking_insert** | **bookings** | **AFTER INSERT** | **notify_booking_created()** |

### SQL para recrear triggers

```sql
-- Trigger: Calcular noches automáticamente
CREATE TRIGGER calculate_nights_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_nights();

-- Trigger: Actualizar estado de pago
CREATE TRIGGER update_payment_status_on_payment
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_payment_status();

-- Trigger: Updated_at automático
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 🔥 TRIGGER PRINCIPAL: Webhook a n8n
CREATE TRIGGER on_booking_insert
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_created();
```

---

## 5. FUNCIONES

### calculate_nights()
Calcula automáticamente las noches de una reserva.

```sql
CREATE OR REPLACE FUNCTION public.calculate_nights()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.nights = NEW.check_out - NEW.check_in;
  RETURN NEW;
END;
$function$;
```

---

### check_availability() ⭐ IMPORTANTE PARA AI AGENT
Verifica si una propiedad está disponible en fechas específicas.

```sql
CREATE OR REPLACE FUNCTION public.check_availability(
  p_property_id uuid, 
  p_check_in date, 
  p_check_out date
)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE property_id = p_property_id
      AND status NOT IN ('cancelled', 'inquiry')
      AND (
        (check_in <= p_check_in AND check_out > p_check_in) OR
        (check_in < p_check_out AND check_out >= p_check_out) OR
        (check_in >= p_check_in AND check_out <= p_check_out)
      )
  );
END;
$function$;
```

**Uso:**
```sql
SELECT check_availability(
  '18711359-1378-4d12-9ea6-fb31c0b1bac2', -- property_id Izumi
  '2026-07-15',  -- check_in
  '2026-07-20'   -- check_out
);
-- Devuelve: true (disponible) o false (no disponible)
```

---

### calculate_booking_price() ⭐ IMPORTANTE PARA AI AGENT
Calcula el precio total de una reserva.

```sql
CREATE OR REPLACE FUNCTION public.calculate_booking_price(
  p_property_id uuid, 
  p_check_in date, 
  p_check_out date, 
  p_guests integer
)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
  v_base_price DECIMAL;
  v_nights INTEGER;
  v_total DECIMAL;
BEGIN
  SELECT base_price INTO v_base_price
  FROM public.properties
  WHERE id = p_property_id;

  v_nights := p_check_out - p_check_in;
  v_total := v_base_price * v_nights;

  RETURN v_total;
END;
$function$;
```

**Uso:**
```sql
SELECT calculate_booking_price(
  '18711359-1378-4d12-9ea6-fb31c0b1bac2', -- property_id Izumi
  '2026-07-15',  -- check_in
  '2026-07-20',  -- check_out
  2              -- guests
);
-- Devuelve: precio total (ej: 2250.00)
```

---

### update_booking_payment_status()
Actualiza automáticamente el estado de pago de una reserva.

```sql
CREATE OR REPLACE FUNCTION public.update_booking_payment_status()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  v_total_paid DECIMAL;
  v_booking_total DECIMAL;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
  FROM public.payments
  WHERE booking_id = NEW.booking_id
    AND status = 'completed';

  SELECT total_price INTO v_booking_total
  FROM public.bookings
  WHERE id = NEW.booking_id;

  UPDATE public.bookings
  SET payment_status = CASE
    WHEN v_total_paid = 0 THEN 'pending'
    WHEN v_total_paid < v_booking_total THEN 'partial'
    WHEN v_total_paid >= v_booking_total THEN 'paid'
    ELSE payment_status
  END
  WHERE id = NEW.booking_id;

  RETURN NEW;
END;
$function$;
```

---

### notify_booking_created() 🔥 WEBHOOK A N8N
Envía notificación a n8n cuando se crea una reserva.

```sql
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n-production-bb2d.up.railway.app/webhook/booking-created',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'property_id', NEW.property_id,
      'guest_name', NEW.guest_name,
      'guest_email', NEW.guest_email,
      'guest_phone', NEW.guest_phone,
      'check_in', NEW.check_in,
      'check_out', NEW.check_out,
      'guests_count', NEW.guests,
      'total_amount', NEW.total_price,
      'nights', NEW.nights,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$function$;
```

---

### generate_confirmation_code()
Genera código de confirmación automático.

```sql
CREATE OR REPLACE FUNCTION public.generate_confirmation_code()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := 'BK-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8));
  END IF;
  RETURN NEW;
END;
$function$;
```

---

### update_updated_at_column()
Actualiza timestamp automáticamente.

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
```

---

### get_dashboard_stats()
Obtiene estadísticas para dashboard.

```sql
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE(total_properties bigint, total_bookings bigint, active_bookings bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM properties WHERE status = 'active'),
    (SELECT COUNT(*) FROM bookings),
    (SELECT COUNT(*) FROM bookings WHERE status IN ('confirmed', 'checked_in'));
END;
$function$;
```

---

## 6. WEBHOOK A N8N

### Configuración actual

| Campo | Valor |
|-------|-------|
| Trigger | on_booking_insert |
| Tabla | bookings |
| Evento | AFTER INSERT |
| URL Webhook | https://n8n-production-bb2d.up.railway.app/webhook/booking-created |

### Payload enviado a n8n

```json
{
  "property_id": "uuid",
  "guest_name": "string",
  "guest_email": "string",
  "guest_phone": "string",
  "check_in": "date",
  "check_out": "date",
  "guests_count": "integer",
  "total_amount": "numeric",
  "nights": "integer",
  "status": "string"
}
```

---

## DATOS DE CONEXIÓN

| Campo | Valor |
|-------|-------|
| URL | https://jjpscimtxrudtepzwhag.supabase.co |
| Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0 |
| Property ID Izumi | 18711359-1378-4d12-9ea6-fb31c0b1bac2 |

---

**Última actualización:** 11 Diciembre 2025
