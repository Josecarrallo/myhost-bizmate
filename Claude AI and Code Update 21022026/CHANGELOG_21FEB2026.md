# CHANGELOG - 21 Febrero 2026

## [1.0.0] - 2026-02-21

### 🔥 BREAKING CHANGES
- **Multi-tenant filtering**: `getVillas()` ahora requiere `tenantId` como parámetro obligatorio
- Villas sin property_id válido no serán visibles

### ✨ Added
- **Delete Villa functionality**
  - Botón Delete en columna Actions de tabla
  - Modal de confirmación personalizado (reemplaza `confirm()` nativo)
  - Modal de éxito con auto-dismiss (reemplaza `alert()` nativo)
  - Icono Trash2 de Lucide React

- **Edit Villa modal completo**
  - Todos los campos editables: name, location, bedrooms, bathrooms, maxGuests, basePrice
  - Upload de foto dentro del modal
  - Guardado a Supabase con validación

- **Multi-tenant filtering implementation**
  - Filtrado por tenant_id → bookings.property_id → villas.property_id
  - Cada usuario ve solo sus villas
  - Soporte para múltiples properties por usuario

### 🐛 Fixed
- **Error #1: Price display split**
  - ANTES: "Rp 1.200.000 \n /night" (dos líneas)
  - AHORA: "Rp 1.200.000/night" (una línea)
  - Solución: `text-lg` + `whitespace-nowrap`

- **Error #2: Edit Property button**
  - ANTES: Solo cambiaba a tab de fotos, no mostraba información
  - AHORA: Modal completo con todos los datos de la villa

- **Error #3: Table view overflow**
  - ANTES: 7 columnas, scroll horizontal, no cabía en pantalla
  - AHORA: 6 columnas, `table-fixed`, anchos específicos, no scroll
  - Eliminadas columnas Rating y Type

- **Error #4: Add Property modal no scroll**
  - ANTES: Modal demasiado largo, botón submit no visible
  - AHORA: `max-h-[70vh] overflow-y-auto`, scroll interno

- **Error #5: Create Property variable error**
  - ANTES: `ReferenceError: createdProperty is not defined`
  - AHORA: Variable correcta `createdVilla` usada

- **CRITICAL: Multi-tenant filtering broken**
  - ANTES: Todos los usuarios veían las mismas villas (hardcoded)
  - AHORA: Cada usuario ve solo sus villas basado en tenant_id

### 🔧 Changed
- **src/components/Properties/Properties.jsx**
  - Añadido import `Trash2` icon
  - Añadidos estados `deleteConfirm` y `successMessage`
  - Price display: `text-2xl` → `text-lg`, añadido `whitespace-nowrap`
  - Table: Añadido `table-fixed`, columnas con anchos específicos
  - Table padding: `px-6` → `px-3` para compactar
  - Capacity text: "2 beds · 2 baths" → "2BR · 2BA"
  - Modal Add Property: Añadido `max-h-[70vh] overflow-y-auto`
  - Variable fix: `createdProperty` → `createdVilla`
  - Funciones nuevas: `handleDeleteVilla()`, `confirmDelete()`, `cancelDelete()`
  - Modales JSX: Delete Confirmation Modal, Success Message Modal

- **src/services/data.js**
  - `getVillas()` reescrito completamente:
    - Acepta parámetro `tenantId`
    - Obtiene property_ids desde bookings table
    - Filtra villas por esos property_ids
    - Elimina filtros hardcodeados de property_id y currency
  - Añadidos console.log para debugging

### 🗄️ Database Changes
- **villas table**: property_id field actualizado para 8 villas
  - 3 villas IDR → property_id: `3551cd18-af6b-48c2-85ba-4c5dc0074892`
  - 5 villas USD → property_id: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
  - Scripts ejecutados: `fix-jose-villas-property-id.cjs`, `swap-villas-fix.cjs`

### 📦 Dependencies
- No changes (todas las dependencias ya existían)

### 🧪 Testing
- ✅ Tested con usuario Gita: Ve 3 villas IDR
- ✅ Tested con usuario Jose: Ve 5 villas USD
- ✅ Create villa: Funciona con property_id correcto
- ✅ Edit villa: Todos los campos editables y guardan
- ✅ Delete villa: Modales personalizados funcionan
- ✅ Table view: Se ve completa sin scroll en desktop
- ✅ Mobile responsive: Cards en lugar de tabla

### 📝 Documentation
- Creado RESUMEN_EJECUTIVO_21FEB2026.md
- Creado TECHNICAL_DEEP_DIVE_21FEB2026.md
- Creado CHANGELOG_21FEB2026.md
- Creado SESSION_PROMPT_21FEB2026.md

### 🚀 Deployment
- **Branch**: `backup-antes-de-automatizacion`
- **Commit**: `185d1bd` - "fix: Complete Properties/Villas module fixes + multi-tenant filtering"
- **Status**: ✅ Pushed to GitHub
- **Production**: ⏳ Pending PR to main

### ⚠️ Breaking Changes Impact
Si tienes código que llama a `getVillas()` sin pasar `tenantId`, necesitas actualizar:

```javascript
// ANTES (YA NO FUNCIONA)
const villas = await dataService.getVillas();

// AHORA (CORRECTO)
const tenantId = user?.id;
const villas = await dataService.getVillas(tenantId);
```

### 🔮 Future Improvements
- [ ] Implementar auto-creación de property al registrarse nuevo owner
- [ ] Añadir confirmación en Edit modal antes de guardar
- [ ] Validación de formularios más robusta
- [ ] Mensajes de error más descriptivos
- [ ] Migrar de bookings a properties.owner_id para filtrado

### 👥 Contributors
- Claude (Anthropic) - Development
- Jose Carrallo - Testing & Validation

---

## Detailed Change Log

### Properties.jsx Changes

**Line 1-27**: Import Changes
```diff
+ import { Trash2 } from 'lucide-react';
```

**Line 40-50**: State Additions
```diff
+ const [deleteConfirm, setDeleteConfirm] = useState({
+   show: false, villaId: null, villaName: ''
+ });
+ const [successMessage, setSuccessMessage] = useState({
+   show: false, message: ''
+ });
```

**Line 494-555**: New Functions
```diff
+ const handleDeleteVilla = (villaId, villaName) => { ... };
+ const confirmDelete = async () => { ... };
+ const cancelDelete = () => { ... };
```

**Line 708**: Price Display Fix
```diff
- <p className="text-2xl font-black text-[#FF8C42]">
+ <p className="text-lg font-black text-[#FF8C42] whitespace-nowrap">
    {formatPrice(property.basePrice, property.currency)}
-   <span className="text-sm font-medium">/night</span>
+   <span className="text-xs font-medium">/night</span>
  </p>
```

**Line 857-866**: Table Structure Changes
```diff
- <table className="w-full">
+ <table className="w-full table-fixed">
    <thead>
      <tr>
-       <th className="px-6 py-3">Property</th>
+       <th className="px-3 py-3 w-[20%]">Property</th>
-       <th className="px-6 py-3">Location</th>
+       <th className="px-3 py-3 w-[18%]">Location</th>
-       <th className="px-6 py-3">Type</th>
-       <th className="px-6 py-3">Capacity</th>
+       <th className="px-3 py-3 w-[15%]">Capacity</th>
-       <th className="px-6 py-3">Price</th>
+       <th className="px-3 py-3 w-[17%]">Price</th>
-       <th className="px-6 py-3">Rating</th>
-       <th className="px-6 py-3">Status</th>
+       <th className="px-3 py-3 w-[12%]">Status</th>
-       <th className="px-6 py-3">Actions</th>
+       <th className="px-3 py-3 w-[18%]">Actions</th>
      </tr>
    </thead>
```

**Line 896-910**: Delete Button Addition
```diff
  <td className="px-3 py-3">
+   <div className="flex gap-2">
      <button onClick={() => setSelectedProperty(property)}
-       className="w-full px-3 py-2 ...">
+       className="flex-1 px-2 py-2 ...">
        <Eye className="w-4 h-4 inline mr-1" />
        View
      </button>
+     <button
+       onClick={() => handleDeleteVilla(property.id, property.name)}
+       className="px-2 py-2 bg-red-500 text-white rounded-xl ...">
+       <Trash2 className="w-4 h-4" />
+     </button>
+   </div>
  </td>
```

**Line 1200-1350**: Edit Modal Addition
```diff
+ {showEditModal && (
+   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
+     <div className="bg-[#1f2937] rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
+       {/* Complete edit form with all villa fields */}
+     </div>
+   </div>
+ )}
```

**Line 1603-1650**: Custom Modals Addition
```diff
+ {deleteConfirm.show && (
+   <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
+     {/* Delete confirmation modal */}
+   </div>
+ )}
+
+ {successMessage.show && (
+   <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
+     {/* Success message modal */}
+   </div>
+ )}
```

### data.js Changes

**Line 870-911**: getVillas() Complete Rewrite
```diff
- async getVillas() {
+ async getVillas(tenantId) {
+   try {
+     if (!tenantId) {
+       console.error('getVillas: tenantId is required');
+       return [];
+     }
+
+     // 1. Get ALL user's property_ids from their bookings
+     const { data: bookings } = await supabase
+       .from('bookings')
+       .select('property_id')
+       .eq('tenant_id', tenantId);
+
+     if (!bookings || bookings.length === 0) {
+       console.log('[getVillas] No bookings found for tenant');
+       return [];
+     }
+
+     // Get unique property_ids for this user
+     const propertyIds = [...new Set(bookings.map(b => b.property_id))];
+     console.log(`[getVillas] User has ${propertyIds.length} property_id(s):`, propertyIds);
+
+     // 2. Get villas for ALL user's property_ids
      const { data, error } = await supabase
        .from('villas')
        .select('*')
-       .eq('property_id', '18711359-1378-4d12-9ea6-fb31c0b1bac2')
-       .eq('currency', 'IDR')
+       .in('property_id', propertyIds)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching villas:', error);
        return [];
      }

+     console.log(`[getVillas] Found ${data?.length || 0} villas for tenant ${tenantId}`);
      return data || [];
+   } catch (error) {
+     console.error('Error in getVillas:', error);
+     return [];
+   }
  }
```

---

## Git Diff Summary

```
Files changed: 2
Insertions: 486
Deletions: 82
Net change: +404 lines
```

**Modified Files:**
- `src/components/Properties/Properties.jsx` (+404, -78)
- `src/services/data.js` (+82, -4)

**Commit Hash:** `185d1bd`
**Branch:** `backup-antes-de-automatizacion`
**Date:** 2026-02-21

---

## Version History

### v1.0.0 (2026-02-21)
- Initial release of Properties/Villas multi-tenant fixes
- All 5 UI errors corrected
- Multi-tenant filtering implemented
- Delete functionality with custom modals
- Ready for production deployment

---

**Maintained by:** MY HOST BizMate Development Team
**Last Updated:** 21 de Febrero de 2026
