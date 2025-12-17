# 🔍 DOMUS API - EXPLORACIÓN COMPLETA

**Fecha:** 17 Diciembre 2025
**Status:** ✅ Exploración completa | ⏳ Pendiente respuesta soporte

---

## 📊 ESTADO ACTUAL

### Properties Creadas: 7
- Property ID principal: **5814990**
- Nombre: Izumi Hotel - Test
- Status: **"Evaluation OTA"** (en evaluación por Booking.com)
- Channel: Booking.com (channelId: 1)
- Mode: TEST

### Rooms Creados: 5
- 581499058
- 581499084
- 581499086
- 581499088
- 581499095

**Status:** Created pero **NO mapeados/activados**
**Rates:** `null` (no configurados)

---

## 🔌 ENDPOINTS EXPLORADOS (15 totales)

### ✅ FUNCIONANDO

#### Account APIs
- `GET /account` - ✅ Conexión verificada
- `GET /channels` - ✅ Canales obtenidos
- `GET /currencies` - ✅ Monedas disponibles
- `GET /price-model` - ✅ 5 modelos de precios

#### Content APIs
- `POST /property` - ✅ Crear properties
- `POST /room` - ✅ Crear rooms
- `GET /booking-property-types` - ✅ 50+ tipos
- `GET /booking-room-types` - ✅ Tipos de habitaciones

#### Mapping APIs
- `POST /property-check` - ✅ Verificar status de property
- `POST /property-activation` - ⚠️ Responde pero property ya existe
- `POST /rooms-activation` - ⚠️ Responde pero activa 0 rooms

#### Rates & Availability APIs
- `GET /room-rates` - ✅ Listar rooms y rates

### ❌ REQUIEREN PROPERTY ACTIVA

- `POST /rates` - ❌ "Property status not Active"
- `POST /availability` - ❌ "Property status not Active"
- `POST /rate` - ⚠️ Requiere campo "status"

### ❌ NO DISPONIBLES EN TEST MODE

- `GET /property/:id` - 404 (solo Expedia)
- `PUT /property/:id` - 404
- `PATCH /property/:id` - 404

---

## 🔍 DESCUBRIMIENTOS CLAVE

### 1. Property Status Lifecycle

```
Created → Evaluation OTA → Active
            ↑ ESTAMOS AQUÍ
```

**"Evaluation OTA"** significa:
- Property enviada a Booking.com ✅
- Booking.com está evaluando ⏳
- En TEST mode: requiere intervención de soporte
- En PRODUCTION: 24-72 horas automático

### 2. Room Activation Requirements

Para activar rooms necesitas:
1. ✅ Property creada
2. ✅ Rooms creados
3. ❌ Property status = "Active" (no "Evaluation OTA")
4. ❌ Rate plans configurados
5. ❌ Rooms mapeados con myRoomId

**Resultado actual:**
```json
{
  "returnMessage": "Number of rooms activated: 0"
}
```

### 3. Price Models Disponibles

```
1 = Maximum / Single occupancy
2 = Derived pricing
3 = Occupancy
4 = Per day
5 = Per Day Length of stay
```

### 4. Campo "status" Descubierto

Múltiples endpoints requieren campo `status`:
- `POST /room` → `status: "New"` o `"Overlay"`
- `POST /rate` → `status: ?` (no documentado)
- `POST /property-status` → Para cambiar status

### 5. Estructura room-rates

```json
{
  "rooms": [
    {
      "id": "581499084",
      "name": "",
      "rates": null  ← Sin rate plans
    }
  ]
}
```

---

## 📝 SCRIPTS CREADOS

### 1. `scripts/domus-test.js` (468 líneas)
**Funcionalidad:**
- Crear properties y rooms
- Configurar rates y availability
- Testing completo end-to-end

**Endpoints usados:**
- GET /account
- GET /booking-property-types
- GET /booking-room-types
- POST /property
- POST /room
- POST /rates
- POST /availability

### 2. `scripts/domus-activate-property.js`
**Funcionalidad:**
- 4 métodos diferentes para activar property
- Todos devuelven 404

### 3. `scripts/domus-explore-mapping-api.js`
**Funcionalidad:**
- 6 endpoints de Mapping API probados
- Todos devuelven 404

### 4. `scripts/domus-activate-correct.js`
**Funcionalidad:**
- Usar endpoints correctos de documentación
- POST /property-check ✅
- POST /property-activation ⚠️
- POST /rooms-activation ⚠️

### 5. `scripts/domus-create-rates.js`
**Funcionalidad:**
- GET /room-rates
- POST /rate (requiere campo status)
- POST /rooms-activation con rates

---

## 🔑 CREDENCIALES

### API Keys Actuales (17 Dic 2025)
```
API User: IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=
API Password: J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=
```

### Credenciales Anteriores (deprecadas)
```
API User: kVfLOhx6UDOJF+k0piBqggYrC5DUmhbmBRuUYktTOhA=
API Password: Pk5RHEEPn9sdZ27d+DKQWWgaYa35xbh0/B7d43gLGv4=
```

---

## 📧 SOPORTE CONTACTADO

**Email enviado a:** support@zodomus.com
**Fecha:** 17 Diciembre 2025
**Asunto:** Activar property 5814990 (TEST mode)

**Request:**
- Activar property ID 5814990
- Cambiar status de "Evaluation OTA" a "Active"
- Permitir configuración de rates y availability

---

## 🚫 LIMITACIONES CONFIRMADAS

### API Limitations en TEST Mode

1. **No hay endpoints para gestión de properties existentes**
   - No GET /property/:id (404)
   - No PUT /property/:id (404)
   - No PATCH /property/:id (404)

2. **No hay endpoint público para activación**
   - No PUT/POST /property/:id/activate (404)
   - Requiere panel web o intervención de soporte

3. **Mapping APIs limitados**
   - POST /property-activation: "Property already exists"
   - POST /rooms-activation: Activa 0 rooms
   - Requiere property status "Active"

4. **Content APIs limitados**
   - POST /property solo funciona con Booking y Expedia
   - GET /property solo funciona con Expedia
   - Campos "status" no documentados completamente

---

## ✅ LO QUE SÍ FUNCIONA

### Operaciones Exitosas

```javascript
// 1. Crear property
POST /property {
  channelId: 1,
  propertyName: "Izumi Hotel - Test",
  hotelContent: { ... },
  contactInfo: [ ... ],
  hotelInfo: {
    propertyType: 20, // Hotel
    guestRoomQuantity: 10
  }
}
// Response: propertyId

// 2. Crear room
POST /room {
  channelId: 1,
  propertyId: "5814990",
  status: "New", // OBLIGATORIO (string)
  roomContent: {
    roomName: "Deluxe Room",
    roomType: 17, // Double room
    maxOccupancy: 2,
    roomSize: 25,
    roomQuantity: 5
  }
}
// Response: roomId

// 3. Verificar property
POST /property-check {
  channelId: 1,
  propertyId: "5814990"
}
// Response: Property status, mapped rooms

// 4. Listar room-rates
GET /room-rates?channelId=1&propertyId=5814990
// Response: Lista de rooms con rates
```

---

## 🎯 PRÓXIMOS PASOS

### Bloqueantes (Requieren soporte DOMUS)

1. ⏳ **Activar property 5814990**
   - Cambiar status: "Evaluation OTA" → "Active"
   - Contacto: support@zodomus.com

2. ⏳ **Documentar campo "status" de POST /rate**
   - Valores posibles
   - Requisitos

### No Bloqueantes (Podemos hacer ahora)

3. ✅ **Crear n8n workflow de polling**
   - GET /reservations-queue cada 5 min
   - Mapeo a Supabase
   - Triggers de confirmación

4. ✅ **Crear src/services/domus.js**
   - Servicio centralizado
   - fetchReservations()
   - syncToSupabase()

---

## 📚 DOCUMENTACIÓN OFICIAL

**Archivo local:** `n8n_worlkflow_claude/A list of Zodomus API's.txt`

**Endpoints documentados:**
- Account APIs (4)
- Mapping APIs (5)
- Airbnb Mapping APIs (5)
- Rates and Availability APIs (5)
- Reservation APIs (5)
- Content APIs (8)
- Booking Content tables (1+)
- Expedia Content tables (1+)
- Opportunities (2)
- Reviews (3)
- Reporting (2)
- Promotions (5)

**Total:** 40+ endpoints documentados

---

## 🔬 TESTING REALIZADO

### Pruebas Exitosas
- ✅ Autenticación Basic Auth
- ✅ Crear 7 properties
- ✅ Crear 5 rooms
- ✅ Obtener property types
- ✅ Obtener room types
- ✅ Obtener price models
- ✅ Verificar property status

### Pruebas Fallidas (Esperadas)
- ❌ Activar property via API
- ❌ Activar rooms (0 activados)
- ❌ Configurar rates (property no activa)
- ❌ Configurar availability (property no activa)

### Errores Resueltos
- Room status: "New" vs 1 ✅
- Property types: código 20 = Hotel ✅
- Room types: código 17 = Double ✅
- Price model: ID 1 = Max/Single occupancy ✅

---

## 💻 CÓDIGO EJEMPLO

### Estructura Completa Property

```javascript
{
  channelId: 1,
  propertyName: "Izumi Hotel - Test",
  address: "Jl. Test, Bali",
  city: "Ubud",
  country: "Indonesia",
  postalCode: "80571",
  propertyType: "Hotel",
  currency: "USD",
  hotelContent: {
    propertyName: "Izumi Hotel - Test",
    address: "Jl. Test, Bali",
    city: "Ubud",
    zip: "80571",
    countrycode: "ID",
    checkin_from: "14:00",
    checkin_to: "23:00",
    checkout_from: "06:00",
    checkout_to: "12:00",
    latitude: -8.50926,
    longitude: 115.26278,
    star_rating: 4,
    description: "Beautiful boutique hotel"
  },
  contactInfo: [
    {
      type: "PhysicalLocation",
      email: "info@izumihotel.com",
      phone: "+62-361-123456"
    },
    {
      type: "general",
      email: "josecarrallodelafuente@gmail.com",
      phone: "+62-361-123456",
      url: "https://izumihotel.com"
    },
    {
      type: "invoices",
      email: "billing@izumihotel.com",
      phone: "+62-361-123456"
    }
  ],
  hotelInfo: {
    propertyType: 20,
    guestRoomQuantity: 10,
    number_of_floors: 2,
    year_built: 2020,
    year_renovated: 2023
  }
}
```

### Estructura Completa Room

```javascript
{
  channelId: 1,
  propertyId: "5814990",
  status: "New", // OBLIGATORIO
  roomContent: {
    roomName: "Deluxe Room - Test",
    roomType: 17, // Double room
    maxOccupancy: 2,
    roomSize: 25,
    roomSizeMeasurement: "squaremeters",
    roomQuantity: 5
  }
}
```

---

**Última actualización:** 17 Dic 2025 - 22:15 PM
**Status:** Esperando respuesta de soporte DOMUS
