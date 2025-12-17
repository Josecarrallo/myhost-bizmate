# 🔄 DOMUS Polling Workflow - Setup Guide

**Workflow:** DOMUS Polling - Reservations Sync
**Frecuencia:** Cada 5 minutos
**Objetivo:** Sincronizar reservas de DOMUS → Supabase → n8n confirmations

---

## 📋 REQUISITOS PREVIOS

### 1. Credenciales DOMUS API

Necesitas configurar en n8n:

**Tipo:** HTTP Basic Auth
**Nombre:** "DOMUS API Credentials"

```
Username: IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=
Password: J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=
```

### 2. Credenciales Supabase

Deben estar ya configuradas:

**Nombre:** "MY HOST Supabase"
**Project URL:** https://jjpscimtxrudtepzwhag.supabase.co
**API Key:** [tu anon key]

---

## 🚀 INSTALACIÓN

### Paso 1: Importar Workflow

1. Login en n8n: https://n8n-production-bb2d.up.railway.app
2. Click en "+ Workflow"
3. Click en los 3 puntos (⋮) → "Import from File"
4. Seleccionar: `DOMUS Polling - Reservations Sync.json`

### Paso 2: Configurar Credenciales DOMUS

1. Click en el nodo "DOMUS Get Reservations"
2. En "Credentials", click "Create New"
3. Seleccionar tipo: "HTTP Basic Auth"
4. Ingresar:
   - **Name:** DOMUS API Credentials
   - **User:** `IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=`
   - **Password:** `J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=`
5. Click "Save"

### Paso 3: Verificar Credenciales Supabase

1. Click en el nodo "Insert into Supabase"
2. Verificar que esté seleccionada la credential "MY HOST Supabase"
3. Si no existe, crearla con los datos de Supabase

### Paso 4: Activar Workflow

1. Click en el botón "Inactive" arriba a la derecha
2. Cambiar a "Active"
3. El workflow comenzará a ejecutarse cada 5 minutos

---

## 📊 FLUJO DEL WORKFLOW

```
┌──────────────────────┐
│  Every 5 Minutes     │  Schedule Trigger
│  (Cron: */5 * * * *) │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  DOMUS Get           │  GET /reservations-queue
│  Reservations        │  Channel ID: 1 (Booking.com)
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│  Has New             │  IF reservations.length > 0
│  Reservations?       │
└──────┬───────────────┘
       │
       ├─ YES ──────────────────────────┐
       │                                 ↓
       │                    ┌────────────────────────┐
       │                    │  Split Reservations    │
       │                    │  Loop each reservation │
       │                    └────────────┬───────────┘
       │                                 ↓
       │                    ┌────────────────────────┐
       │                    │  Map to Supabase       │
       │                    │  Format booking data   │
       │                    └────────────┬───────────┘
       │                                 ↓
       │                    ┌────────────────────────┐
       │                    │  Insert into Supabase  │
       │                    │  bookings table        │
       │                    └────────────┬───────────┘
       │                                 ↓
       │                    ┌────────────────────────┐
       │                    │  Trigger Booking       │
       │                    │  Confirmation          │
       │                    │  (Email + WhatsApp)    │
       │                    └────────────────────────┘
       │
       └─ NO ──────────────────────────┐
                                       ↓
                          ┌────────────────────────┐
                          │  No New Reservations   │
                          │  (Do nothing)          │
                          └────────────────────────┘
```

---

## 🔍 NODOS EXPLICADOS

### 1. Every 5 Minutes (Schedule Trigger)
**Tipo:** n8n-nodes-base.scheduleTrigger
**Configuración:**
- Interval: 5 minutes
- Cron: `*/5 * * * *`

**Qué hace:**
- Ejecuta el workflow automáticamente cada 5 minutos
- 288 ejecuciones por día (24h × 12 por hora)

### 2. DOMUS Get Reservations (HTTP Request)
**Tipo:** n8n-nodes-base.httpRequest
**Configuración:**
- Method: GET
- URL: `https://api.zodomus.com/reservations-queue`
- Auth: HTTP Basic Auth (DOMUS credentials)
- Query Params: `channelId=1`

**Qué hace:**
- Consulta la cola de reservas pendientes en DOMUS
- Channel ID 1 = Booking.com
- Retorna array de reservas nuevas

**Response esperado:**
```json
{
  "status": {
    "returnCode": 200,
    "returnMessage": "OK"
  },
  "reservations": [
    {
      "bookingId": "BK123456",
      "guestName": "John Doe",
      "guestEmail": "john@example.com",
      "guestPhone": "+1234567890",
      "checkIn": "2025-12-20",
      "checkOut": "2025-12-25",
      "numberOfGuests": 2,
      "totalPrice": 500,
      "nights": 5
    }
  ]
}
```

### 3. Has New Reservations? (IF)
**Tipo:** n8n-nodes-base.if
**Condición:**
- `{{ $json.reservations }}` is not empty

**Qué hace:**
- Verifica si hay reservas en la response
- Si SÍ → continúa al procesamiento
- Si NO → termina sin hacer nada

### 4. Split Reservations (Split Out)
**Tipo:** n8n-nodes-base.splitOut
**Configuración:**
- Field to Split: `reservations`

**Qué hace:**
- Convierte array de reservas en items individuales
- Cada reserva se procesa independientemente

### 5. Map to Supabase Format (Set)
**Tipo:** n8n-nodes-base.set
**Mapeo:**
```javascript
{
  guest_name: $json.guestName,
  guest_email: $json.guestEmail,
  guest_phone: $json.guestPhone,
  check_in: $json.checkIn,
  check_out: $json.checkOut,
  guests_count: $json.numberOfGuests,
  total_amount: $json.totalPrice,
  booking_reference: $json.bookingId,
  channel: "domus",
  status: "confirmed",
  property_id: "18711359-1378-4d12-9ea6-fb31c0b1bac2", // Izumi Hotel
  nights: $json.nights,
  payment_status: "pending",
  notes: "Imported from DOMUS (Booking.com)"
}
```

**Qué hace:**
- Transforma estructura DOMUS → estructura Supabase
- Agrega campos adicionales (channel, status, property_id)

### 6. Insert into Supabase (Supabase)
**Tipo:** n8n-nodes-base.supabase
**Configuración:**
- Operation: Insert
- Table: `bookings`
- Columns: Todos los campos mapeados

**Qué hace:**
- Inserta la reserva en Supabase
- Retorna el registro creado con ID

### 7. Trigger Booking Confirmation (HTTP Request)
**Tipo:** n8n-nodes-base.httpRequest
**Configuración:**
- Method: POST
- URL: `https://n8n-production-bb2d.up.railway.app/webhook/booking-created`
- Body: Datos de la reserva

**Qué hace:**
- Trigger el workflow de confirmación (Workflow VI)
- Envía email via SendGrid
- Envía WhatsApp via ChakraHQ

### 8. No New Reservations (No Op)
**Tipo:** n8n-nodes-base.noOp
**Qué hace:**
- Nada, termina el workflow
- Útil para debugging y logging

---

## 🧪 TESTING

### Test Manual

1. Click en "Execute Workflow" en n8n
2. Verificar en "Executions" si hay errores
3. Revisar Supabase tabla `bookings` para nuevas reservas

### Test con Reservation Simulada

Crear test reservation en DOMUS:

```bash
curl -X POST https://api.zodomus.com/reservations-createtest \
  -u "IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=:J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": 1,
    "propertyId": "5814990",
    "checkIn": "2025-12-20",
    "checkOut": "2025-12-25",
    "guestName": "Test User",
    "guestEmail": "test@example.com",
    "numberOfGuests": 2
  }'
```

Esperar 5 minutos o ejecutar workflow manualmente.

---

## ⚠️ IMPORTANTE

### Duplicados

El workflow NO verifica duplicados. Para evitarlos:

**Opción 1:** Agregar nodo "Supabase Query" antes de Insert:
```sql
SELECT id FROM bookings WHERE booking_reference = '{{ $json.booking_reference }}'
```
Solo insertar si no existe.

**Opción 2:** Constraint UNIQUE en Supabase:
```sql
ALTER TABLE bookings ADD CONSTRAINT unique_booking_reference
UNIQUE (booking_reference);
```

### Errores Comunes

**1. "Authorization failed"**
- Verificar credenciales DOMUS
- Regenerar API keys si es necesario

**2. "Table bookings does not exist"**
- Verificar conexión Supabase
- Verificar nombre de tabla

**3. "Channel not found"**
- Verificar channelId=1 en query params
- Verificar que channel esté activo en DOMUS

---

## 📊 MONITORING

### Executions Log

1. En n8n, ir a "Executions"
2. Ver historial de ejecuciones cada 5 min
3. Filtrar por "Error" para ver fallos

### Supabase Logs

```sql
-- Ver últimas reservas importadas
SELECT * FROM bookings
WHERE channel = 'domus'
ORDER BY created_at DESC
LIMIT 10;

-- Contar reservas por día
SELECT DATE(created_at), COUNT(*)
FROM bookings
WHERE channel = 'domus'
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;
```

---

## 🔧 TROUBLESHOOTING

### Workflow no se ejecuta

1. Verificar que esté "Active"
2. Ver "Executions" para errores
3. Verificar schedule trigger configurado correctamente

### No llegan reservas

1. Verificar que property esté "Active" en DOMUS (no "Evaluation OTA")
2. Crear test reservation con `/reservations-createtest`
3. Verificar logs de DOMUS API

### Reservas no se insertan en Supabase

1. Verificar credentials Supabase
2. Verificar permisos de la tabla bookings
3. Verificar que campos coincidan con schema

---

**Última actualización:** 17 Dic 2025
**Status:** Listo para usar (pending property activation)
