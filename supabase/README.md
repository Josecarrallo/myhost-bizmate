# Supabase Database Setup

## 📋 Instrucciones para ejecutar el schema

### Paso 1: Ir al SQL Editor de Supabase

1. Abre tu proyecto en https://supabase.com
2. Ve a **SQL Editor** en el sidebar izquierdo
3. Click en **New Query**

### Paso 2: Ejecutar el Schema (Tablas)

1. Abre el archivo `schema-simple.sql`
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. Pégalo en el SQL Editor de Supabase
4. Click en **Run** (▶️ botón verde)
5. Verifica que diga "Success" y "Schema created successfully!"

### Paso 3: Ejecutar Triggers y Funciones

1. Click en **New Query** (para crear una nueva query)
2. Abre el archivo `schema-triggers.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Click en **Run** (▶️)
6. Verifica que diga "Success" y "Triggers and functions created successfully!"

### Paso 4: Ejecutar las RLS Policies

1. Click en **New Query** de nuevo
2. Abre el archivo `rls-policies.sql`
3. Copia TODO el contenido
4. Pégalo en el SQL Editor
5. Click en **Run** (▶️)
6. Verifica que no haya errores

### Paso 4: Verificar la instalación

Ve a **Table Editor** y deberías ver:
- ✅ users
- ✅ properties
- ✅ bookings
- ✅ payments
- ✅ guest_portal_access
- ✅ digital_checkins
- ✅ housekeeping_tasks
- ✅ maintenance_issues
- ✅ reviews
- ✅ pricing_rules
- ✅ cultural_events
- ✅ ai_chat_history

## 🔐 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas basadas en roles:
- **owner**: Acceso total
- **admin**: Acceso a propiedades asignadas
- **reception**: Solo bookings y guests
- **housekeeping**: Solo tareas de limpieza
- **maintenance**: Solo issues de mantenimiento

## 📊 Tablas Creadas

### PRIORIDAD 1: CRÍTICO
1. **users** - Usuarios del sistema
2. **properties** - Propiedades
3. **bookings** - Reservas
4. **payments** - Pagos
5. **guest_portal_access** - Acceso al portal de huéspedes

### PRIORIDAD 2: IMPORTANTE
6. **digital_checkins** - Check-ins digitales
7. **housekeeping_tasks** - Tareas de limpieza
8. **maintenance_issues** - Issues de mantenimiento
9. **reviews** - Reseñas

### PRIORIDAD 3: PUEDE ESPERAR
10. **pricing_rules** - Reglas de pricing
11. **cultural_events** - Eventos culturales
12. **ai_chat_history** - Historial de chat con IA

## 🛠️ Funciones SQL Disponibles

- `check_availability(property_id, check_in, check_out)` - Verificar disponibilidad
- `calculate_booking_price(property_id, check_in, check_out, guests)` - Calcular precio
- `update_booking_payment_status()` - Actualizar estado de pago automáticamente

## ⚡ Triggers Activos

- Auto-update de `updated_at` en todas las tablas
- Auto-update de `payment_status` en bookings cuando se registran pagos

## 📝 Próximos Pasos

Después de ejecutar el schema:
1. Crear un usuario de prueba en Authentication
2. Agregar el usuario a la tabla `users`
3. Crear propiedades de prueba
4. Crear bookings de prueba
5. Probar el frontend con datos reales
