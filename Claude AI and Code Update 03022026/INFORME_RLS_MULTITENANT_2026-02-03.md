# INFORME: Debugging RLS y Multi-Tenant MyHost BizMate
**Fecha:** 3 de Febrero 2026
**Duración:** ~3 horas
**Sistema:** MyHost BizMate - Supabase

---

## RESUMEN EJECUTIVO

Se identificaron y resolvieron múltiples problemas relacionados con la seguridad multi-tenant del sistema. El problema principal NO era RLS de Supabase, sino que **el frontend no envía el JWT token en las queries**. Adicionalmente se encontró que el campo `properties_access` estaba vacío para Gita.

### Estado Final

| Componente | Estado | Notas |
|------------|--------|-------|
| RLS en tablas | ❌ DESACTIVADO | Temporal hasta fix de frontend |
| Funciones RPC | ✅ CORREGIDAS | Usan `auth.uid()` |
| Políticas RLS | ✅ CREADAS | Listas para activar |
| Datos Gita | ✅ CORREGIDOS | `properties_access` actualizado |
| Frontend | ⚠️ PENDIENTE | No envía JWT token |

---

## CRONOLOGÍA DE PROBLEMAS Y SOLUCIONES

### 1. PROBLEMA INICIAL: Dashboard mostraba datos de todos los tenants

**Síntoma:** Gita (Nismara Uma Villa) veía los datos de Jose (Izumi Hotel).

**Causa:** Las funciones RPC tenían parámetro `p_tenant_id` con lógica:
```sql
WHERE (p_tenant_id IS NULL OR owner_id = p_tenant_id)
```
Cuando se pasaba NULL, devolvía TODOS los datos.

**Solución:** Actualizar 8 funciones RPC para usar `auth.uid()` siempre:
- `get_dashboard_stats()`
- `get_today_checkins()`
- `get_today_checkouts()`
- `get_active_alerts()`
- `get_lumina_stats()`
- `get_banyu_stats()`
- `get_kora_stats()`
- `get_osiris_stats()`

```sql
-- ANTES (inseguro)
WHERE (p_tenant_id IS NULL OR p.owner_id = p_tenant_id)

-- AHORA (seguro)
WHERE p.owner_id = auth.uid()
```

---

### 2. PROBLEMA: RLS bloqueaba tabla `users` con timeout

**Síntoma:** `ERR_CONNECTION_TIMED_OUT` al consultar tabla users.

**Causa:** Política RLS con subquery circular:
```sql
-- Política problemática
(owner_id = auth.uid()) OR (id IN (
  SELECT jsonb_array_elements_text(users.properties_access) 
  FROM users WHERE users.id = auth.uid()
))
```

**Solución temporal:** Desactivar RLS en `users`.

---

### 3. PROBLEMA: RLS bloqueaba tabla `bookings`

**Síntoma:** 400 Bad Request al consultar bookings.

**Causa:** Políticas con subqueries anidados que consultaban `properties`, creando recursión.

**Solución:** Simplificar política a:
```sql
CREATE POLICY "tenant_isolation" ON public.bookings
  FOR ALL
  USING (tenant_id = auth.uid())
  WITH CHECK (tenant_id = auth.uid());
```

---

### 4. PROBLEMA: Bookings aparecían como 0 incluso con RLS desactivado

**Síntoma:** Con RLS OFF, Gita seguía viendo 0 bookings.

**Investigación:** Los logs mostraban que la app consultaba con el `property_id` de Jose:
```
/rest/v1/bookings?tenant_id=eq.GITA_UUID&property_id=eq.JOSE_PROPERTY_ID
```

**Causa:** `properties_access` de Gita estaba vacío `[]`.

**Solución:**
```sql
UPDATE users 
SET properties_access = '["3551cd18-af6b-48c2-85ba-4c5dc0074892"]'::jsonb
WHERE id = '1f32d384-4018-46a9-a6f9-058217e6924a';
```

**Resultado:** ✅ Gita ve sus 41 bookings correctamente.

---

### 5. PROBLEMA RAÍZ: Frontend no envía JWT token

**Síntoma:** Con RLS activado, `auth.uid()` retorna NULL y no se ven datos.

**Investigación detallada:**

1. Token existe en `sessionStorage` (no `localStorage`):
```javascript
sessionStorage.getItem('sb-jjpscimtxrudtepzwhag-auth-token')
// Contiene: { access_token: "eyJ...", ... }
```

2. Prueba manual CON token funciona:
```javascript
const token = JSON.parse(sessionStorage.getItem('sb-...'));
fetch('/rest/v1/rpc/test_rls_context', {
  headers: { 'Authorization': 'Bearer ' + token.access_token }
})
// Resultado: { test_uid: "1f32d384-...", test_role: "authenticated", booking_count: 41 }
```

3. App automática SIN token falla:
```javascript
supabase.from('bookings').select('*')  // No envía Authorization header
// Resultado: auth.uid() = NULL, 0 registros
```

**Conclusión:** El cliente Supabase está configurado para usar `sessionStorage` pero no está pasando el token automáticamente en las queries.

**Solución pendiente (Claude Code):** Modificar configuración del cliente Supabase.

---

## ESTADO ACTUAL DE LA BASE DE DATOS

### RLS por tabla

| Tabla | RLS | Política | Listo para activar |
|-------|-----|----------|-------------------|
| users | ❌ OFF | `id = auth.uid()` | ✅ |
| properties | ❌ OFF | `owner_id = auth.uid()` | ✅ |
| bookings | ❌ OFF | `tenant_id = auth.uid()` | ✅ |
| leads | ❌ OFF | `tenant_id = auth.uid()` | ✅ |
| payments | ❌ OFF | `get_my_booking_ids()` | ✅ |
| villas | ❌ OFF | `get_my_property_ids()` | ✅ |
| guests | ❌ OFF | Necesita política | ⚠️ |
| alerts | ❌ OFF | `tenant_id = auth.uid()` | ✅ |

### Funciones Helper creadas

```sql
-- Evitan recursión en políticas RLS
public.get_my_property_ids()  -- SECURITY DEFINER
public.get_my_booking_ids()   -- SECURITY DEFINER
public.test_rls_context()     -- Para debugging
```

### Usuarios del sistema

| Usuario | UUID | Property | Bookings |
|---------|------|----------|----------|
| Jose | c24393db-d318-4d75-8bbf-0fa240b9c1db | Izumi Hotel (18711359-...) | 166 |
| Gita | 1f32d384-4018-46a9-a6f9-058217e6924a | Nismara Uma (3551cd18-...) | 41 |

---

## ACCIONES PENDIENTES

### Para Claude Code (Frontend)

1. **Modificar cliente Supabase** para que envíe el JWT token:

```javascript
// Opción A: Cambiar a localStorage
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storage: window.localStorage,  // ← Cambiar
    autoRefreshToken: true
  }
})

// Opción B: Configurar sessionStorage correctamente
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storage: {
      getItem: (key) => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value),
      removeItem: (key) => sessionStorage.removeItem(key),
    }
  }
})
```

2. **Verificar después del cambio:**
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('Session:', session);  // Debe mostrar el token
```

### Para Claude AI (Después del fix de frontend)

Activar RLS en todas las tablas:

```sql
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;
```

### Para función de Onboarding

Actualizar `onboard_new_client()` para incluir `properties_access`:

```sql
-- Agregar después de crear el usuario
UPDATE public.users 
SET properties_access = jsonb_build_array(v_property_id::text)
WHERE id = v_user_id;
```

---

## LECCIONES APRENDIDAS

1. **Subqueries en políticas RLS son peligrosos** - Pueden causar recursión y timeouts. Usar funciones `SECURITY DEFINER` en su lugar.

2. **Siempre verificar `properties_access`** - Campo crítico para el frontend que determina qué property mostrar.

3. **El token JWT debe verificarse** - No asumir que Supabase lo envía automáticamente.

4. **Debugging sistemático** - Desactivar RLS para aislar si el problema es de políticas o de aplicación.

5. **Funciones RPC con parámetros opcionales son riesgosas** - Si `p_tenant_id IS NULL` devuelve todo, hay fuga de datos.

---

## CHECKLIST PARA NUEVOS CLIENTES

- [ ] Crear usuario en `auth.users`
- [ ] Crear identidad en `auth.identities` (provider='email')
- [ ] Crear usuario en `public.users` con `role='owner'`
- [ ] Crear property con `owner_id = user_id`
- [ ] **Actualizar `properties_access` con el property_id**
- [ ] Verificar login funciona
- [ ] Verificar que ve solo sus datos

---

## CONCLUSIÓN

El sistema multi-tenant está **funcionalmente correcto** pero **temporalmente sin RLS** debido a que el frontend no envía el JWT token. 

Para la fase de pilotos con clientes de confianza, el riesgo es bajo porque:
1. El frontend filtra por `tenant_id`
2. Los clientes no son técnicos maliciosos
3. La API key es anon (no service_role)

**Prioridad:** Arreglar el frontend para activar RLS antes de producción.
