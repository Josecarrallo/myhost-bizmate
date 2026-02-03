# GUÍA PARA DAR DE ALTA NUEVOS USUARIOS EN MYHOST BIZMATE

**Fecha:** 03 Febrero 2026
**Proyecto:** MY HOST BizMate - Multi-tenant SaaS Platform

---

## 🎯 RESUMEN EJECUTIVO

Esta guía explica cómo dar de alta nuevos usuarios (property owners) en MY HOST BizMate para que puedan acceder solo a SUS datos de sus propiedades.

---

## 📋 PREREQUISITOS

Antes de crear un nuevo usuario, necesitas:

1. ✅ Acceso al Dashboard de Supabase (https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag)
2. ✅ Los datos de la propiedad del owner ya creados en la tabla `properties`
3. ✅ Email y nombre del nuevo usuario

---

## 🚀 PASO 1: CREAR USUARIO EN SUPABASE AUTH

### 1.1 Acceder a Supabase Dashboard

1. Ve a: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag
2. Click en **Authentication** → **Users**

### 1.2 Crear Nuevo Usuario

1. Click en **"Add User"** → **"Create new user"**
2. Completa el formulario:
   - **Email:** El email del owner (ej: `nismaraumavilla@gmail.com`)
   - **Password:** Crear contraseña segura (ej: `NismaraUma2026!`)
   - **Auto Confirm User:** ✅ **SÍ** (importante - marca esta opción)
3. Click en **"Create user"**
4. **IMPORTANTE:** Copia el **User UID** (UUID) que se genera

---

## 📊 PASO 2: CREAR/ACTUALIZAR REGISTRO EN TABLA USERS

### 2.1 Ir a Table Editor

1. En Supabase Dashboard → **Table Editor** → **users**

### 2.2 Insertar o Actualizar Usuario

**Si el usuario NO existe en la tabla `users`:**

```sql
INSERT INTO users (id, full_name, email, role, phone, created_at, updated_at)
VALUES (
  '1f32d384-4018-46a9-a6f9-058217e6924a', -- UUID del usuario (debe coincidir con el owner_id de properties)
  'Gita Pradnyana',                       -- Nombre completo
  'nismaraumavilla@gmail.com',            -- Email
  'owner',                                 -- Role
  '+62 813 5351 5520',                    -- Teléfono
  NOW(),                                   -- Fecha creación
  NOW()                                    -- Fecha actualización
);
```

**Si el usuario YA existe:**

```sql
UPDATE users
SET
  full_name = 'Gita Pradnyana',
  email = 'nismaraumavilla@gmail.com',
  role = 'owner',
  phone = '+62 813 5351 5520',
  updated_at = NOW()
WHERE id = '1f32d384-4018-46a9-a6f9-058217e6924a';
```

---

## 🏠 PASO 3: VERIFICAR PROPIEDAD ASOCIADA

### 3.1 Verificar que la propiedad tiene el owner_id correcto

```sql
SELECT
  id as property_id,
  name as property_name,
  owner_id,
  tenant_id
FROM properties
WHERE owner_id = '1f32d384-4018-46a9-a6f9-058217e6924a';
```

**Resultado esperado:**
- `property_id`: UUID de la propiedad
- `property_name`: Nismara Uma Villa
- `owner_id`: UUID del usuario (debe coincidir con el `id` de la tabla `users`)
- `tenant_id`: NULL o el mismo UUID

### 3.2 Si la propiedad NO tiene owner_id correcto

```sql
UPDATE properties
SET
  owner_id = '1f32d384-4018-46a9-a6f9-058217e6924a',
  updated_at = NOW()
WHERE id = '3551cd18-af6b-48c2-85ba-4c5dc0074892'; -- Property ID de Nismara Uma Villa
```

---

## 🔐 PASO 4: CREDENCIALES DEL USUARIO

Una vez creado, el usuario podrá acceder a MY HOST BizMate con:

### Ejemplo: Credenciales de Gita

| Campo    | Valor                      |
|----------|----------------------------|
| Email    | nismaraumavilla@gmail.com  |
| Password | NismaraUma2026!            |

---

## 🎯 PASO 5: PROBAR EL ACCESO

### 5.1 Hacer Login como el Nuevo Usuario

1. Ve a: https://my-host-bizmate.vercel.app
2. Haz **logout** si estás logueado con otro usuario
3. Ingresa las credenciales del nuevo usuario:
   - Email: `nismaraumavilla@gmail.com`
   - Password: `NismaraUma2026!`
4. Click en **"Sign In"**

### 5.2 Verificar Filtrado Multi-Tenant

**El usuario debe ver SOLO sus datos:**

1. Ve a **AUTOPILOT** → **Manual Data Entry** → **View/Edit Bookings**
   - ✅ Solo verá bookings de su propiedad (Nismara Uma Villa)
   - ❌ NO verá bookings de otras propiedades (Izumi Hotel)

2. Ve a **AUTOPILOT** → **Business Reports**
   - ✅ Solo verá estadísticas de su propiedad
   - ❌ NO verá datos de otras propiedades

3. Ve a **Properties**
   - ✅ Solo verá su propiedad
   - ❌ NO verá otras propiedades

---

## 🔍 CÓMO FUNCIONA EL FILTRADO AUTOMÁTICO

### Flujo de Autenticación y Filtrado

```
Usuario (Gita)
    ↓
Login en MY HOST BizMate (https://my-host-bizmate.vercel.app)
    ↓
La app se conecta a Supabase Auth
    ↓
Supabase autentica al usuario
    ↓
AuthContext carga userData.id (owner_id del usuario)
    ↓
Todas las consultas a Supabase incluyen filtro: tenant_id = userData.id
    ↓
RLS (Row Level Security) en Supabase aplica el filtro automáticamente
    ↓
El usuario solo ve datos de su propiedad
```

### Código de Filtrado (Ejemplo)

**Archivo:** `src/components/ManualDataEntry/ManualDataEntry.jsx`

```javascript
// Línea 218 - Filtro automático por tenant_id
const loadBookings = async () => {
  const filters = {
    tenant_id: userData.id // CRITICAL: Multi-tenant filtering
  };

  const bookingsData = await supabaseService.getBookings(filters);
  setBookings(bookingsData);
};
```

---

## 🛡️ SEGURIDAD: RLS (ROW LEVEL SECURITY)

### ¿Qué es RLS?

Row Level Security (RLS) es una capa de seguridad en Supabase que filtra automáticamente las filas de las tablas según el usuario autenticado.

### Ventajas:

- ✅ **Automático:** No depende del frontend
- ✅ **Seguro:** Imposible ver datos de otros tenants
- ✅ **Transparente:** El usuario no sabe que existe
- ✅ **Eficiente:** Se aplica a nivel de base de datos

### Políticas RLS Aplicadas:

```sql
-- Bookings: Solo ver bookings del propio tenant
CREATE POLICY "Users can only see their own bookings"
ON bookings
FOR SELECT
USING (tenant_id = auth.uid());

-- Properties: Solo ver propiedades propias
CREATE POLICY "Users can only see their own properties"
ON properties
FOR SELECT
USING (owner_id = auth.uid());
```

---

## 📝 PLANTILLA DE ALTA DE USUARIO

### Datos a Recopilar

| Campo              | Ejemplo                    | Obligatorio |
|--------------------|----------------------------|-------------|
| Nombre Completo    | Gita Pradnyana             | ✅          |
| Email              | nismaraumavilla@gmail.com  | ✅          |
| Teléfono           | +62 813 5351 5520          | ❌          |
| Propiedad(es)      | Nismara Uma Villa          | ✅          |
| Property ID        | 3551cd18-af6b-48c2-85ba... | ✅          |
| Contraseña         | NismaraUma2026!            | ✅          |

### Checklist de Alta

- [ ] **Paso 1:** Usuario creado en Supabase Auth
- [ ] **Paso 2:** Registro creado/actualizado en tabla `users`
- [ ] **Paso 3:** Propiedad asociada correctamente (owner_id)
- [ ] **Paso 4:** Credenciales entregadas al usuario
- [ ] **Paso 5:** Login probado exitosamente
- [ ] **Paso 6:** Filtrado multi-tenant verificado

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### Error 1: Usuario ve datos de otros tenants (UUID hardcodeado)

**Síntoma:** El usuario hace login correctamente pero ve datos de otro usuario.

**Causa:** Componentes con UUID hardcodeado en lugar de usar `userData.id` dinámicamente.

**Solución:**
```javascript
// ❌ MAL - UUID hardcodeado
const TENANT_ID = 'c24393db-d318-4d75-8bbf-0fa240b9c1db';

// ✅ BIEN - UUID dinámico del usuario logueado
import { useAuth } from '../../contexts/AuthContext';

const MyComponent = () => {
  const { userData } = useAuth();
  const TENANT_ID = userData?.id;
  // ...
};
```

**Componentes que DEBEN usar userData.id:**
- ✅ Autopilot.jsx (arreglado 03-Feb-2026)
- ✅ ManualDataEntry.jsx (ya correcto)
- ⚠️ Verificar otros componentes que hagan consultas

---

### Error 2: "Invalid email or password"

**Causa:** El usuario no existe en Supabase Auth o la contraseña es incorrecta.

**Solución:**
1. Ve a Supabase Dashboard → Authentication → Users
2. Busca el email del usuario
3. Si no existe, créalo (Paso 1)
4. Si existe, resetea la contraseña: Click en 3 puntos → "Reset Password"

---

### Error 2: Usuario ve datos de otros tenants

**Causa:** El `owner_id` en la tabla `properties` no coincide con el `id` del usuario en la tabla `users`.

**Solución:**
```sql
-- Verificar owner_id de la propiedad
SELECT id, name, owner_id FROM properties WHERE name = 'Nismara Uma Villa';

-- Verificar id del usuario
SELECT id, email FROM users WHERE email = 'nismaraumavilla@gmail.com';

-- Actualizar si no coinciden
UPDATE properties
SET owner_id = '<USER_ID_CORRECTO>'
WHERE id = '<PROPERTY_ID>';
```

---

### Error 3: Usuario no ve ningún dato

**Causa:** Las tablas (bookings, payments, etc.) no tienen el campo `tenant_id` correctamente asignado.

**Solución:**
```sql
-- Verificar que los bookings tengan tenant_id
SELECT id, guest_name, tenant_id FROM bookings WHERE property_id = '<PROPERTY_ID>';

-- Si tenant_id es NULL, actualizar
UPDATE bookings
SET tenant_id = '<OWNER_ID>'
WHERE property_id = '<PROPERTY_ID>';
```

---

## 📞 USUARIOS EXISTENTES

### Usuario 1: Jose Carrallo (Izumi Hotel)

| Campo     | Valor                                  |
|-----------|----------------------------------------|
| Email     | jose@myhost.com                        |
| Password  | [Configurada]                          |
| User ID   | c24393db-d318-4d75-8bbf-0fa240b9c1db   |
| Property  | Izumi Hotel & Villas                   |

### Usuario 2: Gita Pradnyana (Nismara Uma Villa)

| Campo     | Valor                                  |
|-----------|----------------------------------------|
| Email     | nismaraumavilla@gmail.com              |
| Password  | NismaraUma2026!                        |
| User ID   | 1f32d384-4018-46a9-a6f9-058217e6924a   |
| Property  | Nismara Uma Villa                      |

---

## 🎓 CONCEPTOS CLAVE

### ¿Qué ve el usuario final?

El usuario **NUNCA ve Supabase**. Solo ve MY HOST BizMate.

**Flujo del usuario:**
1. Abre navegador → `https://my-host-bizmate.vercel.app`
2. Ingresa email + password
3. Ve su dashboard personalizado con SOLO sus datos
4. Gestiona bookings, pagos, reportes de SU propiedad

**Lo que NO ve:**
- ❌ Dashboard de Supabase
- ❌ Datos de otras propiedades (Izumi Hotel)
- ❌ Usuarios de otros owners
- ❌ Configuraciones de backend

---

## 📚 DOCUMENTOS RELACIONADOS

- `MYHOST_ONBOARDING_GUIDE.md` - Guía completa de onboarding (documento fuente)
- `CLAUDE.md` - Arquitectura del proyecto
- `MYHOST_MULTITENANT_GUIA_IMPLEMENTACION_COMPLETA_26_ENERO_2026.md` - Implementación multi-tenant

---

## ✅ RESUMEN EJECUTIVO

**Para dar de alta un nuevo usuario:**

1. Crear en Supabase Auth (email + password)
2. Crear/actualizar en tabla `users` (id debe coincidir con owner_id)
3. Verificar que su propiedad tenga el owner_id correcto
4. Entregar credenciales al usuario
5. Probar login y verificar filtrado

**El sistema filtra automáticamente usando `tenant_id = userData.id` en todas las consultas.**

---

**Última actualización:** 03 Febrero 2026
**Creado por:** Claude Code
**Proyecto:** MY HOST BizMate v2.0
