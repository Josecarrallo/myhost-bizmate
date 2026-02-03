# DIAGNÓSTICO COMPLETO: Problema RLS Multi-Tenant

**Fecha:** 03 Febrero 2026
**Reportado por:** Claude Code
**Para:** Claude AI

---

## 🔴 PROBLEMA CONFIRMADO

Las queries a Supabase **NO están enviando el JWT token del usuario autenticado**, causando que RLS bloquee o devuelva 0 resultados.

---

## ✅ LO QUE FUNCIONA

1. **Cliente Supabase singleton** (`src/lib/supabase.js`):
   - ✅ Usa `localStorage` correctamente
   - ✅ Tiene `autoRefreshToken: true`
   - ✅ Tiene `persistSession: true`
   - ✅ `supabase.auth.getSession()` devuelve el token correctamente
   - ✅ El token JWT está presente en localStorage

2. **Test manual** (ejecutado en `test-supabase-session.html`):
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   console.log('Session:', session); // ✅ Devuelve objeto con token

   const { data: bookings } = await supabase.from('bookings').select('*');
   console.log('Bookings:', bookings); // ✅ Devuelve 5 bookings
   ```

---

## ❌ LO QUE NO FUNCIONA

### Problema 1: `supabaseService` usa fetch manual sin JWT

**Archivo:** `src/services/supabase.js`

**Líneas 8-13:**
```javascript
const supabaseHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,  // ❌ USA ANON KEY, NO JWT
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};
```

**Todas las funciones usan este header hardcodeado:**
- `getBookings()` (línea 96)
- `createBooking()` (línea 116)
- `updateBooking()` (línea 135)
- `deleteBooking()` (línea 155)
- `getPayments()` (línea 175)
- `createPayment()` (línea 195)
- Y todas las demás...

**Resultado:**
```javascript
// En ManualDataEntry.jsx
const bookingsData = await supabaseService.getBookings(filters);
// → fetch con Authorization: Bearer ANON_KEY
// → RLS no puede identificar al usuario (auth.uid() = NULL)
// → Devuelve 0 resultados
```

---

### Problema 2: Componentes usando el servicio incorrecto

**Componentes afectados:**
1. ✅ `Autopilot.jsx` - **ARREGLADO** - Ahora usa `supabase` singleton
2. ❌ `ManualDataEntry.jsx` - Usa `supabaseService.getBookings()`
3. ❌ `Bookings.jsx` - Usa `supabaseService`
4. ❌ `Payments.jsx` - Usa `supabaseService`
5. ❌ `Messages.jsx` - Usa `supabaseService`
6. ❌ `Properties.jsx` - Usa `supabaseService`
7. ❌ `BookingEngine.jsx` - Usa `supabaseService`

---

## 🎯 SOLUCIÓN REQUERIDA

### Opción A: Refactorizar `supabaseService` para usar el cliente singleton

**Cambiar:** `src/services/supabase.js`

**DE:**
```javascript
const supabaseHeaders = {
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`  // ❌
};

async getBookings(filters = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    headers: supabaseHeaders  // ❌
  });
  return response.json();
}
```

**A:**
```javascript
import { supabase } from '../lib/supabase';  // ✅ Importar singleton

async getBookings(filters = {}) {
  let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.tenant_id) {
    query = query.eq('tenant_id', filters.tenant_id);
  }
  // ... etc

  const { data, error } = await query;

  if (error) throw error;
  return data;
}
```

**Ventajas:**
- ✅ El cliente singleton incluye automáticamente el JWT token del usuario autenticado
- ✅ RLS funcionará correctamente
- ✅ No hay que tocar los componentes que usan `supabaseService`

---

### Opción B: Obtener token de sesión y añadirlo manualmente a headers

**Cambiar:** `src/services/supabase.js`

```javascript
import { supabase as supabaseClient } from '../lib/supabase';

// Helper function to get current session token
async function getAuthHeaders() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  return {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': session?.access_token
      ? `Bearer ${session.access_token}`  // ✅ JWT del usuario
      : `Bearer ${SUPABASE_ANON_KEY}`,     // Fallback a anon key
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

async getBookings(filters = {}) {
  const headers = await getAuthHeaders();  // ✅ Obtener token dinámicamente

  const response = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
    headers  // ✅ Headers con JWT del usuario
  });
  return response.json();
}
```

---

## 📋 RECOMENDACIÓN

**Usar Opción A** - Refactorizar para usar el cliente singleton.

**Razones:**
1. Más limpio y mantenible
2. El cliente Supabase maneja automáticamente refresh tokens
3. Menos propenso a errores
4. Patrón estándar de Supabase

---

## 🔍 VERIFICACIÓN POST-FIX

Después de aplicar la solución, verificar:

1. **En la consola del navegador:**
   ```javascript
   // Probar query manual
   const { data, error } = await supabase.from('bookings').select('*');
   console.log('Bookings:', data);  // Debe devolver bookings del tenant
   ```

2. **En Network tab:**
   - Buscar request a `/rest/v1/bookings`
   - Verificar header `Authorization: Bearer eyJhbGci...` (JWT largo, no el anon key corto)

3. **En la app:**
   - Login como Gita → Debe ver **41 bookings**
   - Login como Jose → Debe ver **166 bookings**
   - Ambos usuarios en Manual Data Entry, All The Information, y Business Reports

---

## 📂 ARCHIVOS INVOLUCRADOS

### Para modificar:
- `src/services/supabase.js` - **CRÍTICO** - Refactorizar todo

### Ya correctos (no tocar):
- `src/lib/supabase.js` - ✅ Cliente singleton correcto
- `src/contexts/AuthContext.jsx` - ✅ Usa cliente singleton
- `src/components/Autopilot/Autopilot.jsx` - ✅ Ya arreglado por Claude Code

### Revisar después del fix:
- `src/components/ManualDataEntry/ManualDataEntry.jsx`
- `src/components/Bookings/Bookings.jsx`
- `src/components/Payments/Payments.jsx`
- `src/components/Properties/Properties.jsx`

---

## 🚨 ESTADO RLS

**Actualmente:** RLS está **DESHABILITADO** en todas las tablas (lo deshabilitaste para debugging)

**Después del fix:** Re-habilitar RLS con las políticas correctas:

```sql
-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;

-- Políticas ya creadas (verificar que existen)
-- DROP POLICY IF EXISTS ... ON ...;
-- CREATE POLICY ... ON ... FOR SELECT USING (tenant_id = auth.uid());
```

---

## ✅ CHECKLIST PARA CLAUDE AI

- [ ] Refactorizar `supabaseService` para usar cliente singleton
- [ ] Convertir todas las funciones fetch() a queries de Supabase client
- [ ] Mantener la misma firma de funciones (para no romper componentes)
- [ ] Probar getBookings() con filtros
- [ ] Probar createBooking(), updateBooking(), deleteBooking()
- [ ] Probar getPayments(), createPayment()
- [ ] Re-habilitar RLS en todas las tablas
- [ ] Verificar políticas RLS existen y son correctas
- [ ] Probar login como Gita → 41 bookings
- [ ] Probar login como Jose → 166 bookings

---

**Última actualización:** 03 Febrero 2026 - 18:30
**Preparado por:** Claude Code
**Estado:** LISTO PARA CLAUDE AI
