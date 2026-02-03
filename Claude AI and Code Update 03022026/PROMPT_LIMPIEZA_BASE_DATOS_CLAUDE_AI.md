# PROMPT PARA CLAUDE AI: Limpieza de Base de Datos

**Fecha:** 03 Febrero 2026
**Proyecto:** MY HOST BizMate
**Objetivo:** Limpiar y optimizar base de datos Supabase

---

## 📋 CONTEXTO

Después de implementar multi-tenant con RLS, necesitamos limpiar la base de datos para:

1. Eliminar datos de prueba obsoletos
2. Verificar integridad de datos
3. Corregir inconsistencias encontradas
4. Optimizar performance con índices

---

## 🎯 TAREAS REQUERIDAS

### TAREA 1: Análisis de Integridad de Datos

**Objetivo:** Identificar bookings con problemas.

Ejecuta estas queries y reporta resultados:

```sql
-- 1. Bookings sin tenant_id (huérfanos)
SELECT COUNT(*) as huerfanos, id, guest_name, check_in, check_out
FROM bookings
WHERE tenant_id IS NULL;

-- 2. Bookings sin fechas
SELECT COUNT(*) as sin_fechas, id, guest_name, tenant_id
FROM bookings
WHERE check_in IS NULL OR check_out IS NULL;

-- 3. Bookings con tenant_id que no existe en users
SELECT b.id, b.guest_name, b.tenant_id
FROM bookings b
LEFT JOIN users u ON b.tenant_id = u.id
WHERE u.id IS NULL;

-- 4. Bookings con property_id que no existe
SELECT b.id, b.guest_name, b.property_id
FROM bookings b
LEFT JOIN properties p ON b.property_id = p.id
WHERE p.id IS NULL;

-- 5. Verificar discrepancia: ¿Por qué Business Reports muestra 162-165 pero contador general 166?
SELECT
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN check_in IS NOT NULL AND check_out IS NOT NULL THEN 1 END) as with_dates,
  COUNT(CASE WHEN check_in IS NULL OR check_out IS NULL THEN 1 END) as without_dates
FROM bookings
WHERE tenant_id = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';  -- Jose's UUID

-- 6. Conteo por tenant
SELECT
  u.full_name,
  u.email,
  COUNT(b.id) as total_bookings
FROM users u
LEFT JOIN bookings b ON b.tenant_id = u.id
GROUP BY u.id, u.full_name, u.email
ORDER BY total_bookings DESC;
```

**Reporta:**
- Número de bookings huérfanos
- Número de bookings sin fechas
- Los 4 bookings que causan la discrepancia 166 vs 162

---

### TAREA 2: Limpieza de Datos Obsoletos

**Objetivo:** Eliminar datos de prueba que ya no son necesarios.

**IMPORTANTE:** Antes de eliminar, hacer backup:

```sql
-- BACKUP de bookings (por si acaso)
-- Ejecutar esto PRIMERO antes de cualquier DELETE
CREATE TABLE bookings_backup_03_feb_2026 AS
SELECT * FROM bookings;

-- BACKUP de payments
CREATE TABLE payments_backup_03_feb_2026 AS
SELECT * FROM payments;
```

**Luego, eliminar datos de prueba:**

```sql
-- 1. Eliminar bookings de prueba (sin tenant_id)
DELETE FROM bookings
WHERE tenant_id IS NULL;

-- 2. Eliminar bookings sin fechas (datos inválidos)
-- SOLO SI NO SON DATOS REALES - CONFIRMAR PRIMERO
DELETE FROM bookings
WHERE (check_in IS NULL OR check_out IS NULL)
  AND guest_name LIKE '%Test%';  -- Solo los claramente de prueba

-- 3. Eliminar payments huérfanos (sin booking asociado)
DELETE FROM payments
WHERE booking_id NOT IN (SELECT id FROM bookings);

-- 4. Eliminar messages huérfanos
DELETE FROM messages
WHERE booking_id IS NOT NULL
  AND booking_id NOT IN (SELECT id FROM bookings);
```

---

### TAREA 3: Corrección de tenant_id

**Objetivo:** Asegurar que todos los bookings tienen tenant_id correcto.

```sql
-- 1. Identificar bookings sin tenant_id pero con property_id válido
SELECT b.id, b.guest_name, b.property_id, p.owner_id
FROM bookings b
JOIN properties p ON b.property_id = p.id
WHERE b.tenant_id IS NULL;

-- 2. Actualizar tenant_id basado en property.owner_id
UPDATE bookings b
SET tenant_id = p.owner_id, updated_at = NOW()
FROM properties p
WHERE b.property_id = p.id
  AND b.tenant_id IS NULL;

-- 3. Verificar corrección
SELECT COUNT(*) as bookings_sin_tenant
FROM bookings
WHERE tenant_id IS NULL;
-- Debe ser 0
```

---

### TAREA 4: Optimización con Índices

**Objetivo:** Mejorar performance de queries con tenant_id.

```sql
-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_id
ON bookings(tenant_id);

CREATE INDEX IF NOT EXISTS idx_bookings_property_id
ON bookings(property_id);

CREATE INDEX IF NOT EXISTS idx_bookings_check_in
ON bookings(check_in);

CREATE INDEX IF NOT EXISTS idx_bookings_status
ON bookings(status);

CREATE INDEX IF NOT EXISTS idx_payments_tenant_id
ON payments(tenant_id);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id
ON payments(booking_id);

CREATE INDEX IF NOT EXISTS idx_messages_tenant_id
ON messages(tenant_id);

CREATE INDEX IF NOT EXISTS idx_leads_tenant_id
ON leads(tenant_id);

CREATE INDEX IF NOT EXISTS idx_properties_owner_id
ON properties(owner_id);

-- Verificar índices creados
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('bookings', 'payments', 'messages', 'properties', 'leads')
ORDER BY tablename, indexname;
```

---

### TAREA 5: Verificación Final

**Objetivo:** Confirmar que la limpieza fue exitosa.

```sql
-- 1. Conteo final de bookings por tenant
SELECT
  u.full_name,
  u.email,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.check_in IS NOT NULL AND b.check_out IS NOT NULL THEN 1 END) as with_dates
FROM users u
LEFT JOIN bookings b ON b.tenant_id = u.id
GROUP BY u.id, u.full_name, u.email;

-- Esperado:
-- Jose Carrallo: 166 bookings (todos con fechas)
-- Gita Pradnyana: 41 bookings (todos con fechas)

-- 2. Verificar integridad referencial
SELECT
  'Bookings sin tenant' as issue,
  COUNT(*) as count
FROM bookings
WHERE tenant_id IS NULL

UNION ALL

SELECT
  'Payments sin booking' as issue,
  COUNT(*) as count
FROM payments
WHERE booking_id NOT IN (SELECT id FROM bookings)

UNION ALL

SELECT
  'Messages sin booking' as issue,
  COUNT(*) as count
FROM messages
WHERE booking_id IS NOT NULL
  AND booking_id NOT IN (SELECT id FROM bookings);

-- Todos deben ser 0
```

---

## 📊 REPORTE ESPERADO

Después de ejecutar todas las tareas, proporciona un reporte con:

### Antes de la Limpieza:
- Total bookings: X
- Bookings sin tenant_id: X
- Bookings sin fechas: X
- Bookings huérfanos: X

### Después de la Limpieza:
- Total bookings: X
- Bookings sin tenant_id: 0 ✅
- Bookings sin fechas: 0 ✅
- Bookings huérfanos: 0 ✅

### Conteo Final por Tenant:
- Jose Carrallo (jose@myhost.com): **166 bookings** ✅
- Gita Pradnyana (nismaraumavilla@gmail.com): **41 bookings** ✅

### Índices Creados:
- ✅ idx_bookings_tenant_id
- ✅ idx_bookings_property_id
- ✅ idx_payments_tenant_id
- ✅ etc.

---

## ⚠️ IMPORTANTE: Precauciones

1. **SIEMPRE hacer backup antes de DELETE:**
   ```sql
   CREATE TABLE bookings_backup_03_feb_2026 AS SELECT * FROM bookings;
   ```

2. **Verificar datos antes de eliminar:**
   - Confirmar que los bookings "sin fechas" realmente son de prueba
   - No eliminar datos reales de clientes

3. **Ejecutar queries de verificación después de cada paso:**
   - Confirmar que los DELETE/UPDATE fueron correctos
   - Si algo sale mal, restaurar desde backup

4. **Documentar todo:**
   - Cuántos registros se eliminaron
   - Qué correcciones se aplicaron
   - Cualquier anomalía encontrada

---

## 🎯 OBJETIVO FINAL

Después de la limpieza, la base de datos debe cumplir:

✅ **Todos los bookings tienen tenant_id válido**
✅ **Todos los bookings tienen fechas (check_in, check_out)**
✅ **No hay datos huérfanos (foreign keys válidos)**
✅ **Índices optimizados para queries multi-tenant**
✅ **Conteos coinciden: Business Reports = Contador General**

---

## 📋 CHECKLIST DE EJECUCIÓN

Ejecuta en este orden:

- [ ] 1. BACKUP de tablas críticas
- [ ] 2. Análisis de integridad (queries de verificación)
- [ ] 3. Identificar los 4 bookings de discrepancia (166 vs 162)
- [ ] 4. Limpieza de datos obsoletos (DELETE)
- [ ] 5. Corrección de tenant_id (UPDATE)
- [ ] 6. Creación de índices
- [ ] 7. Verificación final (queries de conteo)
- [ ] 8. Reporte completo de cambios

---

**Preparado por:** Claude Code
**Para:** Claude AI
**Fecha:** 03 Febrero 2026
**Urgencia:** Media (puede ejecutarse mañana 04 Feb)
