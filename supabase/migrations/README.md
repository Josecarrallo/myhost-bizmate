# Supabase Migrations - MYHOST BizMate

## Sales & Leads System - Database Schema

Este directorio contiene las migraciones para crear las tablas del sistema de Sales & Leads.

### Tablas Incluidas

1. **`leads`** - Lead/Contact management (CRM base)
2. **`lead_events`** - Event log para lifecycle tracking
3. **`transfers`** - Airport pickup y transfer management

---

## Cómo Ejecutar en Supabase

### Opción 1: SQL Editor (Recomendado)

1. Abre tu proyecto Supabase: https://supabase.com/dashboard
2. Ve a **SQL Editor** en el menú izquierdo
3. Crea una "New query"
4. Copia y pega el contenido completo de `create_leads_tables.sql`
5. Click en **Run** (o presiona `Ctrl + Enter`)
6. Verifica el mensaje de éxito en la consola

### Opción 2: Table Editor (Manual)

Si prefieres crear las tablas manualmente:

1. Ve a **Table Editor**
2. Click en **New table**
3. Crea cada tabla según el schema en `create_leads_tables.sql`
4. No olvides crear los índices y triggers

---

## Verificación Post-Migration

Ejecuta este query para verificar que todo se creó correctamente:

```sql
-- Verificar que las tablas existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('leads', 'lead_events', 'transfers');

-- Verificar índices creados
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('leads', 'lead_events', 'transfers')
ORDER BY tablename, indexname;

-- Contar triggers
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_schema = 'public'
AND event_object_table IN ('leads', 'transfers');
```

Deberías ver:
- ✅ 3 tablas creadas
- ✅ 13 índices creados
- ✅ 2 triggers de actualización de timestamps

---

## Estructura de Datos

### Tabla: `leads`

**Propósito:** Base del CRM, captura todos los contactos entrantes

**Campos clave:**
- `status`: NEW → ENGAGED → HOT → FOLLOWING_UP → WON/LOST
- `channel`: whatsapp, instagram, email, web, vapi
- `intent`: info, price, availability, booking
- `score`: 0-100 (AI lead scoring)

**Índices:** 7 índices para optimizar queries por tenant, status, channel, phone, email

**Constraints:**
- UNIQUE (phone, tenant_id)
- UNIQUE (email, tenant_id)
- CHECK constraints en status, channel, intent

---

### Tabla: `lead_events`

**Propósito:** Event log para tracking completo del lifecycle

**Event types:**
- `lead_created`, `lead_updated`
- `status_changed`, `followup_sent`
- `message_received`, `message_sent`
- `converted`, `lost`
- `ai_hot_lead_detected`, `ai_ready_to_book`

**Uso:** Analytics, debugging, workflow triggers

---

### Tabla: `transfers`

**Propósito:** Gestión de traslados (airport pickup/dropoff)

**Campos clave:**
- `type`: airport_pickup, airport_dropoff, custom
- `status`: pending → confirmed → assigned → in_progress → completed/cancelled
- `price`: Precio del servicio ($25-50 típico en Bali)

**Uso:** Upselling de servicios de transporte

---

## Próximos Pasos

Después de crear las tablas:

1. **Configurar RLS (Row Level Security)**
   ```sql
   ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
   ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

   -- Crear policies según tu modelo de seguridad
   ```

2. **Verificar relaciones con tablas existentes**
   - Asegúrate de que existen: `tenants`, `properties`, `bookings`
   - Si no existen, ajusta los REFERENCES

3. **Poblar con datos de prueba**
   ```sql
   INSERT INTO leads (tenant_id, property_id, name, phone, email, channel, status, intent)
   VALUES (
     '<tu-tenant-id>',
     '<tu-property-id>',
     'John Doe',
     '+1234567890',
     'john@example.com',
     'whatsapp',
     'NEW',
     'booking'
   );
   ```

4. **Conectar con n8n workflows**
   - WF-SP-01: Inbound Lead Handler
   - WF-SP-03: Follow-Up Engine

---

## Troubleshooting

### Error: "relation does not exist"

Si ves errores sobre `tenants`, `properties`, o `bookings`:

```sql
-- Opción 1: Crear tablas temporales
CREATE TABLE IF NOT EXISTS tenants (id UUID PRIMARY KEY);
CREATE TABLE IF NOT EXISTS properties (id UUID PRIMARY KEY);
CREATE TABLE IF NOT EXISTS bookings (id UUID PRIMARY KEY);

-- Opción 2: Modificar el script para eliminar REFERENCES temporalmente
```

### Error: "permission denied"

Verifica que tienes permisos de superuser o ejecuta:

```sql
GRANT ALL ON leads TO postgres;
GRANT ALL ON lead_events TO postgres;
GRANT ALL ON transfers TO postgres;
```

---

## Contacto

Para soporte: revisa la documentación completa en:
- `Claude AI and Code Update 04012026/MYHOST_BIZMATE_RESUMEN_COMPLETO_Y_PLAN_ACCION.md`
