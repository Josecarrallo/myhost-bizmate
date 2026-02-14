# MY HOST BizMate - BACKUP DE TRIGGERS Y FUNCIONES
## Supabase PostgreSQL - 23 Diciembre 2025

---

## 1. TRIGGERS

### 1.1 Trigger: calculate_nights_trigger (INSERT/UPDATE en bookings)
```sql
CREATE TRIGGER calculate_nights_trigger
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION calculate_nights();
```

### 1.2 Trigger: update_properties_updated_at
```sql
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 1.3 Trigger: update_bookings_updated_at
```sql
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 1.4 Trigger: update_alerts_updated_at
```sql
CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON alerts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### 1.5 Trigger: on_booking_insert
```sql
CREATE TRIGGER on_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION notify_booking_created();
```

### 1.6 Trigger: on_property_insert
```sql
CREATE TRIGGER on_property_insert
AFTER INSERT ON properties
FOR EACH ROW
EXECUTE FUNCTION notify_property_registered();
```

### 1.7 Trigger: new_booking_notification
```sql
CREATE TRIGGER new_booking_notification
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://n8n-production-bb2d.up.railway.app/webhook/new-booking-notification', 
  'POST', 
  '{"Content-type":"application/json"}', 
  '{}', 
  '5000'
);
```

---

## 2. FUNCIONES

### 2.1 notify_property_registered()
**Propósito**: Envía webhook a n8n cuando se registra una nueva propiedad
```sql
CREATE OR REPLACE FUNCTION notify_property_registered()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://n8n-production-bb2d.up.railway.app/webhook/new-property-notification',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'properties',
      'record', jsonb_build_object(
        'id', NEW.id,
        'property_id', NEW.id,
        'property_name', NEW.name,
        'city', NEW.city,
        'country', NEW.country,
        'bedrooms', NEW.bedrooms,
        'bathrooms', NEW.bathrooms,
        'max_guests', NEW.max_guests,
        'base_price', NEW.base_price,
        'currency', NEW.currency,
        'status', NEW.status,
        'owner_phone', NEW.owner_phone
      )
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.2 notify_booking_created()
**Propósito**: Envía webhook a n8n cuando se crea una reserva
```sql
CREATE OR REPLACE FUNCTION notify_booking_created()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;
```

### 2.3 calculate_nights()
**Propósito**: Calcula automáticamente el número de noches
```sql
CREATE OR REPLACE FUNCTION calculate_nights()
RETURNS TRIGGER AS $$
BEGIN
  NEW.nights = NEW.check_out - NEW.check_in;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.4 calculate_booking_price()
**Propósito**: Calcula el precio total de una reserva
```sql
CREATE OR REPLACE FUNCTION calculate_booking_price(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS DECIMAL AS $$
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
$$ LANGUAGE plpgsql;
```

### 2.5 check_availability()
**Propósito**: Verifica si una propiedad está disponible en fechas específicas
```sql
CREATE OR REPLACE FUNCTION check_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql;
```

### 2.6 update_booking_payment_status()
**Propósito**: Actualiza el estado de pago de una reserva
```sql
CREATE OR REPLACE FUNCTION update_booking_payment_status()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;
```

### 2.7 generate_confirmation_code()
**Propósito**: Genera código de confirmación automático
```sql
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confirmation_code IS NULL THEN
    NEW.confirmation_code := 'BK-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.8 update_updated_at_column()
**Propósito**: Actualiza timestamp updated_at automáticamente
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.9 get_dashboard_stats()
**Propósito**: Obtiene estadísticas del dashboard
```sql
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
  total_revenue DECIMAL,
  occupancy_rate DECIMAL,
  active_bookings BIGINT,
  total_properties BIGINT,
  guests_this_month BIGINT,
  confirmed_bookings BIGINT,
  pending_bookings BIGINT,
  avg_daily_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'checked_in', 'checked_out') THEN b.total_price ELSE 0 END), 0) as rev,
      COUNT(*) FILTER (WHERE b.status IN ('confirmed', 'checked_in')) as active,
      COUNT(*) FILTER (WHERE b.status = 'confirmed') as confirmed,
      COUNT(*) FILTER (WHERE b.status = 'pending') as pending,
      COALESCE(SUM(CASE WHEN DATE_TRUNC('month', b.created_at) = DATE_TRUNC('month', CURRENT_DATE)
                        AND b.status IN ('confirmed', 'checked_in', 'checked_out') THEN b.guests ELSE 0 END), 0) as guests_month,
      COALESCE(AVG(CASE WHEN b.status IN ('confirmed', 'checked_in', 'checked_out') AND (b.check_out - b.check_in) > 0
                   THEN b.total_price / (b.check_out - b.check_in) END), 0) as avg_rate
    FROM bookings b
  )
  SELECT
    stats.rev,
    ROUND((stats.active::NUMERIC / NULLIF((SELECT COUNT(*) FROM bookings), 0)) * 100, 2),
    stats.active,
    (SELECT COUNT(*) FROM properties WHERE status = 'active'),
    stats.guests_month,
    stats.confirmed,
    stats.pending,
    ROUND(stats.avg_rate, 2)
  FROM stats;
END;
$$ LANGUAGE plpgsql;
```

### 2.10 get_today_checkins()
**Propósito**: Obtiene los check-ins del día
```sql
CREATE OR REPLACE FUNCTION get_today_checkins()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  property_name TEXT,
  guests INTEGER,
  nights INTEGER,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    p.name as property_name,
    b.guests as guests,
    (b.check_out - b.check_in)::INTEGER as nights,
    b.check_in,
    b.check_out,
    b.total_price,
    b.status
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_in = CURRENT_DATE
    AND b.status IN ('confirmed', 'checked_in')
  ORDER BY b.check_in;
END;
$$ LANGUAGE plpgsql;
```

### 2.11 get_today_checkouts()
**Propósito**: Obtiene los check-outs del día
```sql
CREATE OR REPLACE FUNCTION get_today_checkouts()
RETURNS TABLE (
  booking_id UUID,
  guest_name TEXT,
  property_name TEXT,
  guests INTEGER,
  nights INTEGER,
  check_in DATE,
  check_out DATE,
  total_price DECIMAL,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id as booking_id,
    b.guest_name,
    p.name as property_name,
    b.guests as guests,
    (b.check_out - b.check_in)::INTEGER as nights,
    b.check_in,
    b.check_out,
    b.total_price,
    b.status
  FROM bookings b
  JOIN properties p ON b.property_id = p.id
  WHERE b.check_out = CURRENT_DATE
    AND b.status IN ('checked_in', 'checked_out')
  ORDER BY b.check_out;
END;
$$ LANGUAGE plpgsql;
```

### 2.12 get_total_revenue()
**Propósito**: Obtiene el revenue total
```sql
CREATE OR REPLACE FUNCTION get_total_revenue(p_property_id UUID DEFAULT NULL)
RETURNS DECIMAL AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'completed'), 0);
  ELSE
    RETURN COALESCE((SELECT SUM(amount) FROM payments WHERE property_id = p_property_id AND status = 'completed'), 0);
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2.13 get_pending_payments_total()
**Propósito**: Obtiene el total de pagos pendientes
```sql
CREATE OR REPLACE FUNCTION get_pending_payments_total(p_property_id UUID DEFAULT NULL)
RETURNS DECIMAL AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'pending'), 0);
  ELSE
    RETURN COALESCE((SELECT SUM(amount) FROM payments WHERE property_id = p_property_id AND status = 'pending'), 0);
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2.14 get_unread_messages_count()
**Propósito**: Cuenta mensajes sin leer
```sql
CREATE OR REPLACE FUNCTION get_unread_messages_count(p_property_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COUNT(*)::INTEGER FROM messages WHERE status = 'unread');
  ELSE
    RETURN (SELECT COUNT(*)::INTEGER FROM messages WHERE property_id = p_property_id AND status = 'unread');
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2.15 get_ai_handled_messages_count()
**Propósito**: Cuenta mensajes manejados por IA
```sql
CREATE OR REPLACE FUNCTION get_ai_handled_messages_count(p_property_id UUID DEFAULT NULL)
RETURNS INTEGER AS $$
BEGIN
  IF p_property_id IS NULL THEN
    RETURN (SELECT COUNT(*)::INTEGER FROM messages WHERE ai_handled = true);
  ELSE
    RETURN (SELECT COUNT(*)::INTEGER FROM messages WHERE property_id = p_property_id AND ai_handled = true);
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### 2.16 get_active_alerts()
**Propósito**: Obtiene alertas activas
```sql
CREATE OR REPLACE FUNCTION get_active_alerts()
RETURNS TABLE (
  alert_id UUID,
  message TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ,
  related_type TEXT,
  related_id UUID
) AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alerts') THEN
    RETURN QUERY
    SELECT
      a.id as alert_id,
      a.message,
      a.severity,
      a.created_at,
      a.related_type,
      a.related_id
    FROM alerts a
    WHERE a.status = 'active'
      AND a.dismissed = false
    ORDER BY
      CASE a.severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        WHEN 'info' THEN 3
        ELSE 4
      END,
      a.created_at DESC
    LIMIT 10;
  ELSE
    RETURN QUERY
    SELECT
      p.id as alert_id,
      ('Payment pending: ' || b.guest_name || ' - $' || p.amount::TEXT) as message,
      'warning'::TEXT as severity,
      p.created_at,
      'payment'::TEXT as related_type,
      p.id as related_id
    FROM payments p
    JOIN bookings b ON p.booking_id = b.id
    WHERE p.status = 'pending'
      AND p.due_date <= CURRENT_DATE + INTERVAL '3 days'
    ORDER BY p.due_date
    LIMIT 10;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## 3. RESUMEN

### Webhooks Configurados
| Función | URL n8n |
|---------|---------|
| notify_property_registered | /webhook/new-property-notification |
| notify_booking_created | /webhook/booking-created |
| (trigger directo) | /webhook/new-booking-notification |

### Orden de Recreación
Si necesitas recrear todo desde cero:
1. Crear funciones primero (en orden: utilidades → webhooks → dashboard)
2. Crear triggers después (dependen de las funciones)

---

*Documento generado: 23 Diciembre 2025*
*Proyecto: MY HOST BizMate*
