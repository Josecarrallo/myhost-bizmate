# Sesión 21 Diciembre 2025 - Auth Fixes & n8n Properties Workflow

**Fecha:** 21 de diciembre de 2025
**Duración:** Sesión extensa (varias horas)
**Commits:** e5e6359
**Estado:** ✅ Auth funcionando, ⏸️ n8n Properties pendiente con Claude AI

---

## 🎯 Objetivos de la Sesión

1. ✅ Arreglar problemas de autenticación (loading infinito)
2. ✅ Implementar logout visible en la app
3. ✅ Configurar sesión que expire al cerrar navegador
4. ⏸️ Activar workflow n8n para New Property (continuará con Claude AI)

---

## 🔧 Cambios Implementados

### 1. Session Management (sessionStorage)

**Archivo:** `src/lib/supabase.js`

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.sessionStorage // ← Cambio clave: sessionStorage en vez de localStorage
  }
});
```

**Resultado:**
- ✅ Sesión persiste mientras la pestaña está abierta
- ✅ Cerrar navegador → Sesión se borra automáticamente
- ✅ Abrir navegador de nuevo → Login obligatorio

### 2. Logout Button en Sidebar

**Archivo:** `src/components/Layout/Sidebar.jsx`

**Cambios:**
- Importado `LogOut` icon y `useAuth` hook
- Agregado botón de logout al final del sidebar (después de todos los menús)
- Estilo: Rojo para que destaque, con hover effect

```jsx
{/* Logout Button */}
<div className="mt-6 pt-6 border-t border-gray-200">
  <button
    onClick={signOut}
    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
  >
    <LogOut className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1 text-left">Logout</span>
  </button>
</div>
```

**Resultado:**
- ✅ Usuario puede hacer logout cuando quiera
- ✅ Botón visible en rojo al final del sidebar
- ✅ Click en Logout → Limpia sesión y recarga

### 3. Fix AuthContext - Prevenir Loading Infinito

**Archivo:** `src/contexts/AuthContext.jsx`

**Problema Original:**
- `fetchUserData()` se quedaba colgado esperando respuesta de Supabase
- Después de 5 min de inactividad, sesión expiraba pero no se manejaba
- Resultado: Loading infinito

**Solución Implementada:**

```javascript
const fetchUserData = async (userId) => {
  try {
    // Add timeout to prevent hanging
    const dataPromise = supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('User data fetch timeout')), 3000)
    );

    const { data, error } = await Promise.race([dataPromise, timeoutPromise]);

    if (error) {
      console.warn('User data not found, continuing without it');
      return; // Continue without user data - not critical
    }
    setUserData(data);
  } catch (error) {
    console.warn('Error fetching user data (skipping):', error.message);
    // Don't fail auth just because userData is missing
  }
};
```

**También agregado en initAuth:**

```javascript
if (session?.user) {
  setUser(session.user);
  await fetchUserData(session.user.id);
} else {
  // No session - clear everything
  setUser(null);
  setUserData(null);
}
```

**Resultado:**
- ✅ `fetchUserData` con timeout de 3s
- ✅ Si no hay `userData`, la app funciona igual (usa solo `user.email`)
- ✅ Sesión expirada → Limpia user/userData → Muestra login
- ✅ NO más loading infinito después de inactividad

### 4. Fix Bookings Component

**Archivo:** `src/components/Bookings/Bookings.jsx`

**Problema:**
```javascript
const data = await supabaseService.getBookings(); // ❌ No existe
```

**Solución:**
```javascript
const data = await dataService.getBookings(); // ✅ Existe
```

**Resultado:**
- ✅ Bookings carga correctamente desde Supabase

### 5. Utilidad de Limpieza de Sesión

**Archivo:** `clear_session.html`

HTML simple para limpiar sesión manualmente (útil durante debugging):

```html
<!DOCTYPE html>
<html>
<body>
    <h1>Clearing session...</h1>
    <script>
        localStorage.clear();
        sessionStorage.clear();
        alert('Session cleared!');
    </script>
</body>
</html>
```

**Uso:**
- Navegar a `http://localhost:5175/clear_session.html`
- Limpia todo y muestra alert
- Útil para debugging

---

## 📋 n8n Workflow - New Property

### Workflow JSON Creado

**Archivo:** `n8n_worlkflow_claude/MY HOST - New Property Notification (Email+WhatsApp).json`

**Estructura:**
1. **Webhook** (POST `/webhook/new_property`)
2. **Send Email to Owner** (SendGrid)
3. **WhatsApp to Owner** (Chakra API)

**Status:** ⏸️ Pendiente de configuración final

**Problema Identificado:**
- Email llega pero sin datos (campos vacíos)
- WhatsApp no llega
- **Causa:** Formato de payload no coincide entre app y workflow

**Formato Actual (App):**
```javascript
{
  property_id: "...",
  property_name: "...",
  city: "...",
  // etc
}
```

**Formato Esperado (Workflow n8n):**
```javascript
{
  body: {
    property_name: "...",
    city: "...",
    // etc
  }
}
```

**Referencia Funcionando:**
- Workflow de Booking Confirmation: https://n8n-production-bb2d.up.railway.app/workflow/OxNTDO0yitqV6MAL
- Usa formato: `$node["Webhook"].json["body"]["campo"]`

**Siguiente Paso:**
- ✅ Continuar con Claude AI (tiene MCP n8n configurado)
- Claude AI puede acceder directamente al workflow en n8n
- Ajustar formato de payload en `src/services/n8n.js` → `onPropertyCreated()`

---

## 🧪 Testing Realizado

### Auth & Session
- ✅ Login funciona
- ✅ Dashboard carga correctamente
- ✅ Navegar entre módulos funciona
- ✅ Inactividad 5 min → App sigue funcionando (no hace logout automático)
- ✅ Navegar después de inactividad → No se queda en loading
- ✅ Logout button → Funciona correctamente
- ✅ Cerrar navegador → Sesión se borra (sessionStorage)
- ✅ Abrir navegador → Login obligatorio

### Properties Module
- ✅ Listar properties desde Supabase
- ✅ Crear property en Supabase
- ⚠️ Workflow n8n se ejecuta pero payload vacío
- ❌ WhatsApp no llega
- ⚠️ Email llega sin datos

### Bookings Module
- ✅ Listar bookings desde Supabase
- ✅ Usa `dataService.getBookings()` correctamente

---

## 📊 Estado del Proyecto

### ✅ Completado
- Session management con sessionStorage
- Logout button visible
- AuthContext sin loading infinito
- Bookings usando dataService
- Documentación de sesión

### ⏸️ En Progreso (Continuar con Claude AI)
- n8n Properties workflow (ajustar payload format)
- Configurar MCP n8n server en Claude Code

### 📝 Pendiente
- WhatsApp delivery para Properties
- Validar formato de datos en workflow
- Testing end-to-end: Create Property → Email + WhatsApp

---

## 🔑 Commits

**Commit Principal:** `e5e6359`

```
feat: Session management and stability improvements

Changes:
- Use sessionStorage instead of localStorage (forces login on browser close)
- Add Logout button in sidebar (red button at bottom with icon)
- Add timeout to fetchUserData to prevent infinite loading
- Clear session on auth errors to force re-login
- Fix Bookings component to use dataService.getBookings()
- Add New Property n8n workflow JSON (ready to import)
- Add clear_session.html utility for manual session clearing

Fixes:
- No more infinite loading after inactivity
- Session expires properly on browser close
- User data fetch doesn't hang the app
```

---

## 💡 Lecciones Aprendidas

### 1. sessionStorage vs localStorage
- `localStorage` persiste entre sesiones del navegador
- `sessionStorage` se borra al cerrar la pestaña/navegador
- Para apps que requieren login obligatorio → usar `sessionStorage`

### 2. Timeouts en Async Operations
- SIEMPRE agregar timeouts a llamadas de red
- Usar `Promise.race()` para implementar timeouts
- No asumir que Supabase responderá rápido

### 3. Graceful Degradation
- Si `userData` falla, la app debe funcionar con solo `user`
- No hacer crítico algo que es opcional
- `user.email` es suficiente para la mayoría de casos

### 4. n8n Payload Format
- Consistencia es clave entre workflows
- Usar mismo formato que workflows existentes (Booking)
- Formato estándar: `{ body: { ...data } }`
- Variables en n8n: `$node["Webhook"].json["body"]["campo"]`

---

## 🚀 Próximos Pasos (Para Claude AI)

1. **Configurar MCP n8n Server:**
   - Generar API Key en n8n
   - Configurar `claude_desktop_config.json`
   - Instalar dependencias: `cd .claude/mcp/n8n && npm install`
   - Reiniciar Claude Code

2. **Ajustar Payload Format:**
   - Acceder al workflow via MCP
   - Verificar formato exacto esperado
   - Modificar `src/services/n8n.js` → `onPropertyCreated()`
   - Cambiar de:
     ```javascript
     { property_id, property_name, ... }
     ```
   - A:
     ```javascript
     { body: { property_name, city, ... } }
     ```

3. **Testing End-to-End:**
   - Crear property desde app
   - Verificar email con datos completos
   - Verificar WhatsApp delivery
   - Verificar datos en Supabase

---

## 📂 Archivos Modificados

```
src/
├── lib/
│   └── supabase.js                    ← sessionStorage config
├── contexts/
│   └── AuthContext.jsx                ← Timeouts + session handling
├── components/
│   ├── Layout/
│   │   └── Sidebar.jsx                ← Logout button
│   └── Bookings/
│       └── Bookings.jsx               ← dataService.getBookings()

n8n_worlkflow_claude/
└── MY HOST - New Property Notification (Email+WhatsApp).json

clear_session.html                      ← Utility for debugging
```

---

## 🎓 Notas para el Equipo

- ✅ La app funciona establemente ahora
- ✅ Sesión se maneja correctamente (sessionStorage)
- ✅ No más loading infinito
- ⏸️ Workflow n8n Properties necesita ajuste de formato
- 🤝 Continuar con Claude AI que tiene MCP configurado

---

**Fin de Sesión - 21 Diciembre 2025**
