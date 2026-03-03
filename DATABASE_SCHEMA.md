# MYHOST BIZMATE - DATABASE SCHEMA

**CRÍTICO: Lee este documento ANTES de modificar cualquier query a Supabase**

## Multi-Tenancy Architecture

El sistema usa **property-based multi-tenancy**:
- Cada usuario (tenant) tiene uno o más `property_id`
- Las villas se filtran por `property_id`, NO por `tenant_id`
- Los bookings tienen `tenant_id` y `property_id`

## Tables Schema

### 1. `villas` table

```sql
villas {
  id: uuid (PK)
  name: text
  property_id: uuid (FK → properties.id) ⚠️ EXISTE
  status: text ('active', 'inactive')
  currency: text ('IDR', 'USD')
  price_per_night: decimal
  bedrooms: integer
  bathrooms: integer
  max_guests: integer
  amenities: jsonb
  description: text
  images: text[]
  created_at: timestamptz
  updated_at: timestamptz
}
```

**⚠️ IMPORTANTE:**
- ❌ NO tiene columna `tenant_id`
- ✅ SÍ tiene columna `property_id`
- Para filtrar villas de un tenant, debes hacer lookup en bookings

### 2. `bookings` table

```sql
bookings {
  id: uuid (PK)
  tenant_id: uuid (FK → auth.users.id) ⚠️ EXISTE
  property_id: uuid (FK → properties.id) ⚠️ EXISTE
  villa_id: uuid (FK → villas.id)
  guest_name: text
  guest_email: text
  check_in: date
  check_out: date
  nights: integer
  total_price: decimal
  currency: text
  status: text
  source: text
  channel: text
  created_at: timestamptz
  updated_at: timestamptz
}
```

**⚠️ IMPORTANTE:**
- ✅ Tiene `tenant_id` (usuario propietario)
- ✅ Tiene `property_id` (propiedad específica)
- ✅ Tiene `villa_id` (villa específica)

### 3. `properties` table

```sql
properties {
  id: uuid (PK)
  owner_id: uuid (FK → auth.users.id) ⚠️ EXISTE
  name: text
  address: text
  city: text
  country: text
  type: text
  created_at: timestamptz
  updated_at: timestamptz
}
```

**⚠️ IMPORTANTE:**
- ✅ Tiene `owner_id` (tenant que es dueño)
- Un tenant puede tener múltiples properties

### 4. `auth.users` table (Supabase Auth)

```sql
auth.users {
  id: uuid (PK) -- Este es el tenant_id
  email: text
  created_at: timestamptz
  ...
}
```

## Tenant Data Distribution

### Gita (tenant_id: `1f32d384-4018-46a9-a6f9-058217e6924a`)

- **Property ID**: `3551cd18-af6b-48c2-85ba-4c5dc0074892`
- **Email**: gitaum88@gmail.com
- **Villas**: 3 (IDR currency)
  - Nismara 1BR Villa (`b1000001-0001-4001-8001-000000000001`)
  - Graha Uma 1 Bedroom Pool Villa (`b2000002-0002-4002-8002-000000000002`)
  - NISMARA 2 BEDROOM POOL VILLA (`b3000003-0003-4003-8003-000000000003`)
- **Bookings**: ~67

### Jose (tenant_id: `c24393db-d318-4d75-8bbf-0fa240b9c1db`)

- **Property ID**: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- **Email**: josecarrallodelafuente@gmail.com
- **Villas**: 5 (USD currency)
  - 5BR Grand Villa (`b4000004-0004-4004-8004-000000000004`)
  - 5BR Villa (`b5000005-0005-4005-8005-000000000005`)
  - Blossom Villa (`b6000006-0006-4006-8006-000000000006`)
  - Sky Villa (`b7000007-0007-4007-8007-000000000007`)
  - Tropical Room (`b8000008-0008-4008-8008-000000000008`)
- **Bookings**: ~22

## Critical Filtering Logic

### ❌ INCORRECTO - NO HACER ESTO:

```javascript
// ❌ Esto NO funciona porque villas NO tiene tenant_id
async getVillas(tenantId) {
  const { data } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', tenantId);  // ❌ Columna no existe
  return data;
}
```

### ✅ CORRECTO - HACER ESTO:

```javascript
// ✅ Correcto: lookup en bookings para obtener property_ids
async getVillas(tenantId) {
  // 1. Get user's property_ids from bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('property_id')
    .eq('tenant_id', tenantId);

  if (!bookings || bookings.length === 0) {
    return [];
  }

  // 2. Get unique property_ids
  const propertyIds = [...new Set(bookings.map(b => b.property_id))];

  // 3. Get villas for those properties
  const { data } = await supabase
    .from('villas')
    .select('*')
    .in('property_id', propertyIds)
    .eq('status', 'active');

  return data || [];
}
```

## Testing Multi-Tenancy

**ANTES de commit cuando modifiques:**
- `src/services/data.js`
- Queries a bookings, villas, properties
- Lógica de filtrado por tenant

**Ejecutar:**
```bash
node test-multi-tenancy.cjs
```

**Debe pasar 16/16 tests:**
- ✅ Gita ve exactamente 3 villas (IDR)
- ✅ Jose ve exactamente 5 villas (USD)
- ✅ NO hay contaminación entre tenants
- ✅ Property ownership correcto

Si algún test falla: **NO HACER COMMIT**

## Common Mistakes

### 1. Asumir que villas tiene tenant_id
**Error**: Intentar filtrar villas directamente por tenant_id
**Solución**: Hacer lookup en bookings primero

### 2. Olvidar verificar múltiples properties
**Error**: Asumir que un tenant tiene solo un property_id
**Solución**: Usar `.in(property_id, propertyIds)` no `.eq()`

### 3. No filtrar por status
**Error**: Retornar villas inactivas
**Solución**: Siempre incluir `.eq('status', 'active')`

### 4. No verificar resultados vacíos
**Error**: No manejar el caso cuando un tenant no tiene bookings
**Solución**: Retornar array vacío, no error

## Referencias de Código

### Implementación Correcta
- Commit: `185d1bd87f94580c1fe098caed66c0d8f91e068b`
- Archivo: `src/services/data.js`
- Función: `getVillas(tenantId)`
- Fecha: 21 Feb 2026

### Test Suite
- Archivo: `test-multi-tenancy.cjs`
- Tests: 16 validaciones de aislamiento
- Exit code: 0 = OK, 1 = FAIL

## Supabase Direct Access

```bash
# Service role key (full access, bypass RLS)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjk0MzIzMiwiZXhwIjoyMDc4NTE5MjMyfQ.RBD16xjgQB__nj5DtLrK2w55uQ4WFJiaa0mfZT2BeJg

# Anon key (respects RLS)
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
```

## Last Updated

- **Date**: 03 March 2026
- **Reason**: Fixed multi-tenancy bug - villas were not filtering by tenant
- **Changed By**: Claude Code
- **Verified By**: test-multi-tenancy.cjs (16/16 tests passed)
