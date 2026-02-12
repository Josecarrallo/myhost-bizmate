# Pasos para Corregir la Sección de Properties en All Information

## Problema
El informe de impresión muestra "Location: Not specified Type: Not specified" para las villas porque:
1. El código carga desde la tabla `properties` (que está vacía)
2. La tabla `villas` no tiene los campos `location`, `property_type` ni `address`

## Solución en 3 Pasos

### PASO 1: Agregar Columnas a la Tabla Villas en Supabase

1. Ve a Supabase: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag
2. Abre el **SQL Editor** (icono en el menú izquierdo)
3. Crea una nueva query y pega este código:

```sql
-- Add location, property_type, and address columns to villas table
ALTER TABLE villas
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS property_type TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'villas'
  AND column_name IN ('location', 'property_type', 'address')
ORDER BY column_name;
```

4. Ejecuta la query (botón **Run**)
5. Deberías ver 3 filas confirmando que las columnas `address`, `location` y `property_type` fueron creadas

### PASO 2: Actualizar los Datos de las Villas

Después de agregar las columnas, ejecuta este comando en la terminal:

```bash
node update_villas_with_location_type.cjs
```

Esto actualizará las 3 villas de Gita con:
- **Nismara 2BR Villa**: Ubud, Bali | Luxury Two Bedroom Pool Villa
- **Graha Uma 1BR Villa**: Ubud, Bali | Deluxe One Bedroom Villa
- **Nismara 1BR Villa (Monthly)**: Ubud, Bali | One Bedroom Villa - Long Stay

### PASO 3: Actualizar el Código de Autopilot.jsx

Cambiar el código para que cargue desde la tabla `villas` en lugar de `properties`.

**Líneas 306-316** en `Autopilot.jsx`:

**ANTES:**
```javascript
// Load properties
const { data: properties, error: propertiesError } = await supabase
  .from('properties')
  .select('*')
  .eq('owner_id', TENANT_ID);
```

**DESPUÉS:**
```javascript
// Load villas (properties) by getting unique property_ids from bookings first
const propertyIds = [...new Set((allBookings || []).map(b => b.property_id).filter(Boolean))];

let properties = [];
if (propertyIds.length > 0) {
  const { data: villas, error: propertiesError } = await supabase
    .from('villas')
    .select('*')
    .in('property_id', propertyIds);

  if (propertiesError) {
    console.error('Error loading villas:', propertiesError);
  } else {
    properties = villas || [];
  }
}
```

Y en las **líneas 904-912** (donde se genera el HTML), cambiar `property.location` y `property.property_type` a usar los nuevos campos.

## Verificación

Después de completar los 3 pasos:
1. Ve a All Information en Autopilot
2. Haz clic en "Print Summary"
3. El informe debería mostrar:
   - Nismara 2BR Villa - Location: Ubud, Bali - Type: Luxury Two Bedroom Pool Villa
   - Graha Uma 1BR Villa - Location: Ubud, Bali - Type: Deluxe One Bedroom Villa
   - Nismara 1BR Villa (Monthly) - Location: Ubud, Bali - Type: One Bedroom Villa - Long Stay

---

**Archivos Creados:**
- `add_villa_columns.sql` - SQL para agregar columnas
- `update_villas_with_location_type.cjs` - Script para actualizar datos
- Este archivo con instrucciones

**Estado:** Esperando que ejecutes el PASO 1 en Supabase para continuar.
