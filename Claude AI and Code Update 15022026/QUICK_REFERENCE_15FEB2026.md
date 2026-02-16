# 🚀 QUICK REFERENCE - 15 FEB 2026

**Para empezar mañana rápidamente**

---

## ✅ LO QUE FUNCIONA HOY

### Properties Module
- ✅ **Edit Property** - Actualiza villas en Supabase
- ✅ **Add Property** - Crea nuevas villas en Supabase
- ✅ **Delete Property** - Borra villas con confirmación profesional
- ✅ **Lista correcta** - Solo muestra las 3 villas de Gita (no las 11)
- ✅ **Modal scrollable** - Se puede hacer scroll si el contenido es largo
- ✅ **Sin Demo Mode** - Todo es real y operativo

---

## ⚠️ LO QUE FALTA

### 1. Upload de Fotos (Properties)
**Estado**: Campo existe pero no funciona

**Pasos para completar**:
1. Ir a Supabase Dashboard → Storage
2. Crear bucket: `villa-photos`
   - Público: ✅ Sí
   - Límite: 5MB
3. Implementar upload en `handleAddProperty()` (línea ~300 de Properties.jsx)

### 2. Vercel Deployment
**Comando**:
```bash
cd C:\myhost-bizmate
vercel --prod --yes
```

### 3. Video Server (mencionado pero no priorizado)

---

## 📊 COMMITS DE HOY

### Sesión 1 (mañana):
- `5825048` - fix: Change My Videos to table list
- `0f1ee93` - feat: Prepare backend for Railway deployment
- `7903cda` - Merge a main

### Sesión 2 (noche):
- `beb7df7` - feat: Complete Properties CRUD operations ⭐

---

## 🔑 DATOS CRÍTICOS

### Villas de Gita - Cómo identificarlas:
```javascript
property_id = '18711359-1378-4d12-9ea6-fb31c0b1bac2'
currency = 'IDR'  // ← CRÍTICO para diferenciar de Izumi Hotel
status = 'active'
```

### Las 3 villas reales:
```
b1000001-0001-4001-8001-000000000001  → Villa Nismara Uma
b1000001-0001-4001-8001-000000000002  → Villa Nismara Cempaka
b1000001-0001-4001-8001-000000000003  → Villa Nismara Lotus
```

### Tabla correcta: `villas` (NO `properties`)
- ❌ NO tiene columna `tenant_id`
- ✅ Usa `property_id` + `currency` para filtrar

---

## 📁 ARCHIVOS MODIFICADOS HOY (Sesión 2)

```
src/components/Properties/Properties.jsx  (+187, -73)
src/services/supabase.js                  (+24, -1)
src/services/data.js                      (+16, -0)
find-gita-villas.cjs                      (+26, -11)
```

**Total**: 253 inserciones, 85 eliminaciones

---

## 🎯 PRIORIDADES PARA MAÑANA

### 🔴 Crítico:
- Ninguno (Properties ya funciona)

### ⚠️ Importante:
1. Crear bucket "villa-photos" en Supabase
2. Implementar upload de fotos
3. Deploy a Vercel

### ✅ Opcional:
- Probar todo en producción
- Video server integration

---

## 🌐 URLS IMPORTANTES

### Producción:
- Frontend: https://myhost-bizmate.vercel.app
- Backend: https://myhost-bizmate-production.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

### Local:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## 💾 BACKUP

**Ubicación**: `C:\Claude Code - Update codigo [15-02-2026]`

**Contenido**:
- ✅ Carpeta `src/` completa
- ✅ Archivos config (package.json, vercel.json, vite.config.js, etc.)
- ✅ Scripts .cjs (todos los de verificación y limpieza)
- ✅ Documentación actualizada

---

## 🔍 SCRIPTS ÚTILES

### Verificar villas de Gita:
```bash
node find-gita-villas.cjs
```

### Listar todas las villas con property_id de Gita:
```bash
node list-gita-villas.cjs
```

### Borrar villas de prueba:
```bash
node delete-jose-villa.cjs
```

---

## 🐛 SI ALGO SALE MAL

### Properties muestra más de 3 villas:
**Verificar**: `src/services/data.js` línea ~140
**Fix**: Debe tener `.eq('currency', 'IDR')`

### Error "getVillas is not a function":
**Verificar**: `src/services/data.js` tiene método `getVillas()`
**Fix**: Ya está implementado en commit beb7df7

### Edit no funciona (Invalid UUID):
**Verificar**: `loadProperties()` usa `dataService.getVillas()` (NO mock data)
**Fix**: Ya está arreglado en commit beb7df7

### Modal no hace scroll:
**Verificar**: Contenedor tiene `max-h-[90vh] overflow-y-auto`
**Fix**: Ya está arreglado en commit beb7df7

---

## 📞 CONTEXTO

**Usuario**: Jose Carrallo (exhausto después de 12h de trabajo)
**Hora final**: 21:00 (Bali time)
**Estado**: Todo funcionando, necesita descansar
**Próxima sesión**: Mañana por la mañana

---

**Última actualización**: 15 Feb 2026, 21:30
**Versión**: 2.0 (post-CRUD completo)
