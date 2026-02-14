# 🏨 MyHost BizMate - Guía de Onboarding de Clientes

**Versión:** 1.0  
**Fecha:** 3 Febrero 2026  
**Autor:** Jose Carrallo / ZENTARA LIVING

---

## 📋 RESUMEN EJECUTIVO

Este documento explica el proceso completo para dar de alta nuevos clientes (owners) en la plataforma MyHost BizMate. El sistema está configurado con Row Level Security (RLS) para garantizar que cada cliente solo vea sus propios datos.

---

## 🔐 CLIENTES ACTUALES

### Cliente 1: Jose (Admin/Demo)
| Campo | Valor |
|-------|-------|
| **Nombre** | Jose Carrallo |
| **Email** | `jose@myhost.com` |
| **Password** | `Test123456` |
| **Property** | Izumi Hotel & Villas |
| **User ID** | `c24393db-d318-4d75-8bbf-0fa240b9c1db` |
| **Property ID** | `18711359-1378-4d12-9ea6-fb31c0b1bac2` |

### Cliente 2: Gita (Piloto)
| Campo | Valor |
|-------|-------|
| **Nombre** | Gita Pradnyana |
| **Email** | `nismaraumavilla@gmail.com` |
| **Password** | `NismaraUma2026!` |
| **Property** | Nismara Uma Villa |
| **User ID** | `1f32d384-4018-46a9-a6f9-058217e6924a` |
| **Property ID** | `3551cd18-af6b-48c2-85ba-4c5dc0074892` |

---

## 🚀 CREAR NUEVO CLIENTE (MÉTODO RÁPIDO)

### Opción 1: Usando la función SQL (RECOMENDADO)

Ejecuta este SQL en Supabase SQL Editor:

```sql
SELECT public.onboard_new_client(
  'Nombre Completo',           -- p_full_name
  'email@cliente.com',         -- p_email
  '+62 812 3456 7890',         -- p_phone
  'PasswordSeguro123!',        -- p_password
  'Nombre de la Villa/Hotel',  -- p_property_name
  'Bali',                      -- p_property_city (opcional)
  'Indonesia',                 -- p_property_country (opcional)
  150,                         -- p_base_price (opcional)
  'USD'                        -- p_currency (opcional)
);
```

**Ejemplo real:**
```sql
SELECT public.onboard_new_client(
  'Made Wijaya',
  'made@villaharmony.com',
  '+62 813 1234 5678',
  'VillaHarmony2026!',
  'Villa Harmony Ubud'
);
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "user_id": "abc123...",
  "property_id": "xyz789...",
  "credentials": {
    "email": "made@villaharmony.com",
    "password": "VillaHarmony2026!"
  },
  "message": "Client onboarded successfully: Made Wijaya"
}
```

### Opción 2: Desde el Dashboard de Supabase

1. Ve a **Authentication > Users > Add User**
2. Ingresa email y password
3. Copia el UUID generado
4. Ve a **Table Editor > users** y crea el registro con ese UUID
5. Ve a **Table Editor > properties** y crea la property con `owner_id` = UUID

---

## 📝 PROCESO MANUAL PASO A PASO

Si la función falla o necesitas más control:

### Paso 1: Crear usuario en auth.users

```sql
-- Generar UUID primero
DO $$
DECLARE
  v_user_id UUID := gen_random_uuid();
BEGIN
  RAISE NOTICE 'User ID: %', v_user_id;
  
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'NUEVO_EMAIL@cliente.com',
    crypt('PASSWORD_SEGURO', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"NOMBRE COMPLETO"}'::jsonb,
    now(),
    now(),
    '',
    ''
  );
END $$;
```

### Paso 2: Crear identity

```sql
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'UUID_DEL_PASO_1',
  'UUID_DEL_PASO_1',
  'email',
  jsonb_build_object(
    'sub', 'UUID_DEL_PASO_1',
    'email', 'NUEVO_EMAIL@cliente.com',
    'email_verified', true
  ),
  now(),
  now()
);
```

### Paso 3: Crear usuario público

```sql
INSERT INTO public.users (
  id,
  full_name,
  email,
  role,
  phone,
  created_at,
  updated_at
) VALUES (
  'UUID_DEL_PASO_1',
  'NOMBRE COMPLETO',
  'NUEVO_EMAIL@cliente.com',
  'owner',
  '+62 812 xxx xxxx',
  now(),
  now()
);
```

### Paso 4: Crear property

```sql
INSERT INTO public.properties (
  id,
  name,
  owner_id,
  city,
  country,
  base_price,
  currency,
  status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'NOMBRE DE LA PROPERTY',
  'UUID_DEL_PASO_1',
  'Bali',
  'Indonesia',
  100,
  'USD',
  'active',
  now(),
  now()
);
```

---

## ✅ CHECKLIST POST-ONBOARDING

Después de crear un nuevo cliente, verifica:

- [ ] **Login funciona** - El cliente puede hacer login en la app
- [ ] **Solo ve su property** - No ve datos de otros clientes
- [ ] **Bookings aislados** - Solo ve sus propios bookings
- [ ] **Datos vacíos OK** - Dashboard muestra 0 bookings correctamente

### Verificación SQL

```sql
-- Verificar que el cliente existe y está bien configurado
SELECT 
  u.id as user_id,
  u.full_name,
  u.email,
  p.id as property_id,
  p.name as property_name,
  (SELECT COUNT(*) FROM bookings b WHERE b.tenant_id = u.id) as bookings
FROM public.users u
LEFT JOIN public.properties p ON p.owner_id = u.id
WHERE u.email = 'EMAIL_DEL_CLIENTE';
```

---

## 🔧 CONFIGURACIÓN ADICIONAL (OPCIONAL)

### Agregar villas a una property

```sql
INSERT INTO public.villas (
  property_id,
  name,
  base_price,
  max_guests,
  bedrooms,
  bathrooms,
  status
) VALUES (
  'PROPERTY_ID',
  'Villa Sunrise',
  150,
  4,
  2,
  2,
  'active'
);
```

### Configurar WhatsApp para el cliente

```sql
INSERT INTO public.whatsapp_numbers (
  tenant_id,
  phone_number,
  phone_number_id,
  waba_id,
  display_name,
  status
) VALUES (
  'USER_ID',
  '+62 812 xxx xxxx',
  'META_PHONE_NUMBER_ID',
  'WABA_ID',
  'Nombre Villa',
  'active'
);
```

### Vincular property con WhatsApp

```sql
UPDATE public.properties
SET whatsapp_number_id = 'WHATSAPP_NUMBER_UUID'
WHERE id = 'PROPERTY_ID';
```

---

## 🛡️ SEGURIDAD (RLS)

El sistema tiene Row Level Security (RLS) configurado en todas las tablas críticas:

| Tabla | RLS | Regla |
|-------|-----|-------|
| `users` | ✅ | Solo ve su propio perfil |
| `properties` | ✅ | Solo ve properties donde es owner |
| `bookings` | ✅ | Solo ve bookings de su property |
| `villas` | ✅ | Solo ve villas de su property |
| `leads` | ✅ | Solo ve leads de su property |
| `payments` | ✅ | Solo ve pagos de su property |

**⚠️ IMPORTANTE:** Nunca deshabilites RLS en producción.

---

## 🔄 RESETEAR PASSWORD

Si un cliente olvida su contraseña:

```sql
UPDATE auth.users 
SET encrypted_password = crypt('NuevaPassword123!', gen_salt('bf')),
    updated_at = now()
WHERE email = 'email@cliente.com';
```

---

## 📊 LISTAR TODOS LOS CLIENTES

```sql
SELECT 
  u.full_name,
  u.email,
  u.phone,
  u.role,
  p.name as property,
  u.created_at
FROM public.users u
LEFT JOIN public.properties p ON p.owner_id = u.id
ORDER BY u.created_at DESC;
```

---

## ❓ TROUBLESHOOTING

### Error: "Email already exists"
El email ya está registrado. Usa otro email o resetea el password.

### Error: "Invalid login credentials"  
Verifica que:
1. El email esté confirmado (`email_confirmed_at` no sea NULL)
2. El password sea correcto
3. Exista el registro en `auth.identities`

### El cliente ve datos de otros
Verifica que RLS esté habilitado:
```sql
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname IN ('properties', 'bookings');
```

### El cliente no ve nada
Verifica que `owner_id` en properties y `tenant_id` en bookings coincidan con el user_id.

---

## 📞 SOPORTE

- **Supabase Dashboard:** https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag
- **n8n:** https://n8n-production-bb2d.up.railway.app

---

*Documento generado para ZENTARA LIVING - MyHost BizMate*
