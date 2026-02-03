# PROMPT PARA CLAUDE AI - NISMARA UMA VILLA

**Usar este prompt con Claude AI para insertar datos en Supabase:**

---

## 🎯 QUÉ NECESITO QUE HAGAS

Insertar los datos de **Nismara Uma Villa** en Supabase para poder generar Business Reports.

---

## 📊 DATOS A INSERTAR

### **1. OWNER**
- Email: `nismaraumavilla@gmail.com`
- Full Name: `Gita Pradnyana`
- Phone: `+62 813 5351 5520`
- Role: `owner`

### **2. PROPERTY**
- Name: `Nismara Uma Villa`
- Owner: El UUID del owner creado en paso 1
- Tenant ID: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- Location: `Ubud, Bali, Indonesia`
- Max Guests: `4`
- Price per night: `1300000` IDR
- Commission Rate: `15%`
- Auto Reports: `enabled` (monthly)
- Status: `active`

### **3. BOOKINGS (41 total)**

Tengo los 41 bookings en este archivo JSON:
`C:\myhost-bizmate\nismara-report-data.json`

**Campos importantes de cada booking:**
- property_id: UUID de Nismara Uma Villa (del paso 2)
- tenant_id: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
- guest_name, check_in_date, check_out_date, number_of_nights
- total_amount (en IDR), currency (`IDR`)
- channel: `Bali Buntu` (OTA) o `Direct` (Gita)
- status: `confirmed`
- payment_status: `paid` o `pending`

---

## 🗄️ SUPABASE DATABASE

**URL:** https://jjpscimtxrudtepzwhag.supabase.co

**Tablas a usar:**
1. `users` - Para insertar owner
2. `properties` - Para insertar property
3. `bookings` - Para insertar 41 bookings

**IMPORTANTE sobre tabla users:**
- Tiene foreign key constraint con `auth.users`
- El campo `id` NO tiene DEFAULT
- Necesitas crear usuario correctamente respetando el constraint

---

## ⚠️ PROBLEMAS QUE TUVE

Claude Code (mi compañero) intentó insertar pero falló por:

1. **Error al crear owner:**
   ```
   ERROR: 23503: insert or update on table "users" violates foreign key constraint "users_id_fkey"
   ```
   Causa: La tabla users tiene constraint con auth.users

2. **No puede ejecutar SQL directamente:**
   Claude Code solo puede crear scripts, no ejecutarlos en Supabase.

**POR ESO TE NECESITO A TI** (Claude AI con MCP access a Supabase)

---

## ✅ LO QUE NECESITO QUE HAGAS (PASO A PASO)

### **PASO 1: Crear Owner**

Crea el usuario `Gita Pradnyana` en Supabase respetando el constraint de auth.users.

**Devuélveme:**
```
Owner ID: [el UUID generado]
```

---

### **PASO 2: Crear Property**

Usa el Owner ID del paso 1 para crear `Nismara Uma Villa`.

```sql
INSERT INTO properties (
  tenant_id,
  name,
  owner_id,
  owner_email,
  location,
  max_guests,
  price_per_night,
  currency,
  status,
  commission_rate,
  auto_reports_enabled,
  report_frequency
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  'Nismara Uma Villa',
  '[OWNER_ID del paso 1]',
  'nismaraumavilla@gmail.com',
  'Ubud, Bali, Indonesia',
  4,
  1300000,
  'IDR',
  'active',
  15.00,
  true,
  'monthly'
) RETURNING id;
```

**Devuélveme:**
```
Property ID: [el UUID generado]
```

---

### **PASO 3: Insertar 41 Bookings**

Lee el archivo `C:\myhost-bizmate\nismara-report-data.json` y usa el array de `bookings`.

**Para cada booking, inserta en tabla bookings:**

```sql
INSERT INTO bookings (
  property_id,
  tenant_id,
  guest_name,
  check_in_date,
  check_out_date,
  number_of_nights,
  total_amount,
  currency,
  channel,
  status,
  payment_status,
  number_of_guests
) VALUES (
  '[PROPERTY_ID del paso 2]',
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '[guest_name del JSON]',
  '[checkIn del JSON - formato YYYY-MM-DD]',
  '[checkOut del JSON - formato YYYY-MM-DD]',
  [roomNights del JSON],
  [price del JSON],
  'IDR',
  '[bookingSource del JSON - mapear: "Bali Buntu" → "Bali Buntu", "Gita" → "Direct"]',
  'confirmed',
  '[paymentStatus: "Done" → "paid", otros → "pending"]',
  [pax del JSON]
);
```

**Inserta los 41 bookings.**

**Devuélveme:**
```
✅ 41 bookings insertados correctamente
```

---

### **PASO 4: Verificar**

Ejecuta esta query para confirmar:

```sql
SELECT
  u.full_name as owner,
  u.email as owner_email,
  p.name as property,
  COUNT(b.id) as total_bookings,
  SUM(b.total_amount) as total_revenue
FROM users u
JOIN properties p ON p.owner_id = u.id
LEFT JOIN bookings b ON b.property_id = p.id
WHERE u.email = 'nismaraumavilla@gmail.com'
GROUP BY u.full_name, u.email, p.name;
```

**Resultado esperado:**
```
owner: Gita Pradnyana
owner_email: nismaraumavilla@gmail.com
property: Nismara Uma Villa
total_bookings: 41
total_revenue: 139909985 (IDR ~139.9M)
```

**Devuélveme este resultado.**

---

## 📝 RESUMEN DE LO QUE ESPERO

**Después de que termines, necesito:**

1. ✅ Owner ID (UUID de Gita Pradnyana)
2. ✅ Property ID (UUID de Nismara Uma Villa)
3. ✅ Confirmación de que los 41 bookings están insertados
4. ✅ Query de verificación mostrando: 41 bookings, IDR 139.9M revenue

**Con eso, Claude Code podrá:**
- Generar Business Reports HTML para Nismara Uma
- Mostrar métricas reales en AUTOPILOT dashboard
- Presentar al cliente mañana

---

## 🚀 POR QUÉ ES IMPORTANTE

**Cliente:** Nismara Uma Villa (primer cliente real piloto)
**Compromiso:** Presentar AUTOPILOT funcionando con datos reales
**Timeline:** Mañana (2 Febrero 2026)
**Valor:** Demostrar ahorro de IDR 18.7M/año en comisiones OTA

**Este es el MVP que cierra el deal con el cliente.**

---

**MUCHAS GRACIAS. ADELANTE!** 🙏
