# MÓDULO DE ENTRADA MANUAL DE DATOS - NISMARA UMA
## Análisis de Campos del Excel + Componente para AUTOPILOT

**Fecha:** 1 Febrero 2026
**Objetivo:** Permitir al owner meter bookings manualmente (como lo hace en Excel)

---

## 📊 CAMPOS DEL EXCEL (Análisis Completo)

### Sheet 2025 & 2026 - Columnas Identificadas:

| # | Columna | Tipo | Ejemplo | Notas |
|---|---------|------|---------|-------|
| 1 | **NO** | Number | 1, 2, 3... | Número secuencial del booking |
| 2 | **MONTH** | Text | "September", "October" | Mes del check-in |
| 3 | **GUEST NAME** | Text | "Alison Bell", "M. Hadi Ghanchi" | Nombre del huésped |
| 4 | **CHECK IN** | Date | "31 August", 45903 (Excel serial) | Fecha de entrada |
| 5 | **CHECK OUT** | Date | "3 September", 45906 | Fecha de salida |
| 6 | **PAX** | Number | 2, 3, 4 | Número de personas |
| 7 | **ROOM NIGHT** | Number | 3, 1, 5 | Número de noches |
| 8 | **PRICE** | Number | 2950533, 1042088 | Precio total en IDR |
| 9 | **BOOKING SOURCE** | Text | "Bali Buntu", "Gita", "Ibu Santi" | Canal/agente |
| 10 | **PAYMENT STATUS** | Text | "Done", "On Scheduled" | Estado del pago |
| 11 | **SPECIAL REQUEST** | Text | "-", "[request]" | Peticiones especiales |
| 12 | **TOTAL REVENUE ON HAND** | Number | 27310218, 23999637 | Revenue acumulado del mes |

---

## 🎯 MAPPING A SUPABASE

### Tabla `bookings` - Campos Requeridos:

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Multi-tenant
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  property_id UUID NOT NULL REFERENCES properties(id),

  -- Guest Info (desde Excel col 3, 6)
  guest_name VARCHAR(255) NOT NULL,           -- "Alison Bell"
  guest_email VARCHAR(255),                   -- No está en Excel ❌
  guest_phone VARCHAR(50),                    -- No está en Excel ❌
  guest_country VARCHAR(100),                 -- No está en Excel ❌
  number_of_guests INT NOT NULL,              -- PAX column (col 6)

  -- Booking Dates (desde Excel col 4, 5, 7)
  check_in_date DATE NOT NULL,                -- CHECK IN (col 4)
  check_out_date DATE NOT NULL,               -- CHECK OUT (col 5)
  number_of_nights INT NOT NULL,              -- ROOM NIGHT (col 7) o calculated

  -- Pricing (desde Excel col 8)
  total_amount DECIMAL(10,2) NOT NULL,        -- PRICE (col 8)
  currency VARCHAR(10) DEFAULT 'IDR',         -- Always IDR
  price_per_night DECIMAL(10,2),              -- Calculated: total / nights

  -- Channel (desde Excel col 9)
  channel VARCHAR(100) NOT NULL,              -- BOOKING SOURCE (col 9)
  booking_reference VARCHAR(100),             -- No está en Excel ❌

  -- Status
  status VARCHAR(50) DEFAULT 'confirmed',     -- Derived from PAYMENT STATUS
  payment_status VARCHAR(50) NOT NULL,        -- PAYMENT STATUS (col 10)

  -- Special Requests (desde Excel col 11)
  special_requests TEXT,                      -- SPECIAL REQUEST (col 11)
  notes TEXT,                                 -- Owner private notes

  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),

  -- Constraints
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT positive_amount CHECK (total_amount > 0),
  CONSTRAINT positive_guests CHECK (number_of_guests > 0)
);
```

### ❌ CAMPOS QUE FALTAN EN EXCEL:
1. **guest_email** - No está → Owner tendrá que meter manual
2. **guest_phone** - No está → Owner tendrá que meter manual
3. **guest_country** - No está → Owner tendrá que meter manual
4. **booking_reference** - No está → Opcional

---

## 🖥️ COMPONENTE: MANUAL DATA ENTRY

### Ubicación:
`src/components/ManualDataEntry/ManualDataEntry.jsx` (ya existe, actualizar)

### Form Fields (En orden de importancia):

#### **SECCIÓN 1: Guest Information** ⭐ CRÍTICO
```jsx
<div className="space-y-4">
  <h3>Guest Information</h3>

  {/* Guest Name - FROM EXCEL */}
  <Input
    label="Guest Name *"
    name="guest_name"
    placeholder="Alison Bell"
    required
  />

  {/* Guest Phone - NUEVO (no en Excel) */}
  <Input
    label="Guest Phone"
    name="guest_phone"
    placeholder="+62 812 3456 7890"
    type="tel"
  />

  {/* Guest Email - NUEVO (no en Excel) */}
  <Input
    label="Guest Email"
    name="guest_email"
    placeholder="guest@example.com"
    type="email"
  />

  {/* Guest Country - NUEVO (no en Excel) */}
  <Select
    label="Guest Country"
    name="guest_country"
    options={COUNTRIES} // Lista de países
  />

  {/* Number of Guests - FROM EXCEL (PAX) */}
  <Input
    label="Number of Guests (PAX) *"
    name="number_of_guests"
    placeholder="2"
    type="number"
    min="1"
    max="10"
    required
  />
</div>
```

#### **SECCIÓN 2: Booking Dates** ⭐ CRÍTICO
```jsx
<div className="grid grid-cols-2 gap-4">
  {/* Check-in Date - FROM EXCEL */}
  <DatePicker
    label="Check-in Date *"
    name="check_in_date"
    required
  />

  {/* Check-out Date - FROM EXCEL */}
  <DatePicker
    label="Check-out Date *"
    name="check_out_date"
    required
  />

  {/* Number of Nights - FROM EXCEL (ROOM NIGHT) */}
  {/* Auto-calculated pero editable */}
  <Input
    label="Number of Nights"
    name="number_of_nights"
    value={calculateNights(checkIn, checkOut)}
    type="number"
    disabled
  />
</div>
```

#### **SECCIÓN 3: Pricing** ⭐ CRÍTICO
```jsx
<div className="space-y-4">
  <h3>Pricing</h3>

  {/* Total Amount - FROM EXCEL (PRICE) */}
  <Input
    label="Total Amount (IDR) *"
    name="total_amount"
    placeholder="2950533"
    type="number"
    min="0"
    required
  />

  {/* Price per Night - Auto-calculated */}
  <Input
    label="Price per Night (IDR)"
    value={totalAmount / numberOfNights}
    disabled
  />

  {/* Currency - Fixed to IDR */}
  <Input
    label="Currency"
    value="IDR"
    disabled
  />
</div>
```

#### **SECCIÓN 4: Booking Source & Status** ⭐ CRÍTICO
```jsx
<div className="space-y-4">
  <h3>Booking Source & Status</h3>

  {/* Booking Source - FROM EXCEL */}
  <Select
    label="Booking Source *"
    name="channel"
    options={[
      { value: 'Bali Buntu', label: 'Bali Buntu' },
      { value: 'Gita', label: 'Gita' },
      { value: 'Ibu Santi', label: 'Ibu Santi' },
      { value: 'Airbnb', label: 'Airbnb' },
      { value: 'Booking.com', label: 'Booking.com' },
      { value: 'Direct', label: 'Direct (Website/WhatsApp)' },
      { value: 'Other', label: 'Other' }
    ]}
    required
  />

  {/* If "Other" selected, show text input */}
  {channel === 'Other' && (
    <Input
      label="Other Source Name"
      name="channel_other"
      placeholder="Enter source name"
    />
  )}

  {/* Payment Status - FROM EXCEL */}
  <Select
    label="Payment Status *"
    name="payment_status"
    options={[
      { value: 'paid', label: 'Paid (Done)' },
      { value: 'pending', label: 'Pending (On Scheduled)' },
      { value: 'partial', label: 'Partial Payment' },
      { value: 'overdue', label: 'Overdue' }
    ]}
    defaultValue="pending"
    required
  />

  {/* Booking Status - Derived */}
  <Select
    label="Booking Status *"
    name="status"
    options={[
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'pending', label: 'Pending Confirmation' },
      { value: 'checked_in', label: 'Checked In' },
      { value: 'checked_out', label: 'Checked Out (Completed)' },
      { value: 'cancelled', label: 'Cancelled' }
    ]}
    defaultValue="confirmed"
    required
  />
</div>
```

#### **SECCIÓN 5: Additional Info** (Opcional)
```jsx
<div className="space-y-4">
  <h3>Additional Information (Optional)</h3>

  {/* Special Requests - FROM EXCEL */}
  <Textarea
    label="Special Requests"
    name="special_requests"
    placeholder="Early check-in, baby cot, dietary restrictions..."
    rows={3}
  />

  {/* Booking Reference */}
  <Input
    label="Booking Reference #"
    name="booking_reference"
    placeholder="BKG-2025-001"
  />

  {/* Private Notes (owner only) */}
  <Textarea
    label="Private Notes (Owner Only)"
    name="notes"
    placeholder="Internal notes..."
    rows={2}
  />
</div>
```

---

## 🎨 UI/UX COMPLETO

### Layout del Form:
```jsx
const ManualDataEntry = ({ onBack }) => {
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_phone: '',
    guest_email: '',
    guest_country: '',
    number_of_guests: 2,
    check_in_date: null,
    check_out_date: null,
    total_amount: '',
    channel: 'Bali Buntu',
    payment_status: 'pending',
    status: 'confirmed',
    special_requests: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.guest_name) {
      toast.error('Guest name is required');
      return;
    }

    if (!formData.check_in_date || !formData.check_out_date) {
      toast.error('Check-in and check-out dates are required');
      return;
    }

    if (!formData.total_amount) {
      toast.error('Total amount is required');
      return;
    }

    try {
      // Calculate number_of_nights
      const nights = differenceInDays(
        new Date(formData.check_out_date),
        new Date(formData.check_in_date)
      );

      const bookingData = {
        tenant_id: userData.tenant_id,
        property_id: PROPERTY_ID,
        ...formData,
        number_of_nights: nights,
        price_per_night: formData.total_amount / nights,
        currency: 'IDR',
        created_by: userData.id
      };

      // Insert to Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select();

      if (error) throw error;

      toast.success('Booking added successfully!');

      // Reset form
      setFormData({ /* initial values */ });

      // Optionally go back to dashboard
      // onBack();

    } catch (error) {
      console.error('Error adding booking:', error);
      toast.error('Failed to add booking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Add New Booking</h2>
        <button onClick={onBack} className="...">
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fields... */}
          </CardContent>
        </Card>

        {/* SECTION 2: Booking Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Dates</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fields... */}
          </CardContent>
        </Card>

        {/* SECTION 3: Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fields... */}
          </CardContent>
        </Card>

        {/* SECTION 4: Booking Source & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Source & Status</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fields... */}
          </CardContent>
        </Card>

        {/* SECTION 5: Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Fields... */}
          </CardContent>
        </CardContent>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Booking
          </button>
          <button
            type="button"
            onClick={() => setFormData({/* reset */})}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};
```

---

## 📋 VALIDACIONES

### Client-Side Validation:
```javascript
const validateForm = (data) => {
  const errors = {};

  // Required fields
  if (!data.guest_name?.trim()) {
    errors.guest_name = 'Guest name is required';
  }

  if (!data.check_in_date) {
    errors.check_in_date = 'Check-in date is required';
  }

  if (!data.check_out_date) {
    errors.check_out_date = 'Check-out date is required';
  }

  // Check-out must be after check-in
  if (data.check_in_date && data.check_out_date) {
    if (new Date(data.check_out_date) <= new Date(data.check_in_date)) {
      errors.check_out_date = 'Check-out must be after check-in';
    }
  }

  // Positive amount
  if (!data.total_amount || data.total_amount <= 0) {
    errors.total_amount = 'Total amount must be greater than 0';
  }

  // Positive guests
  if (!data.number_of_guests || data.number_of_guests < 1) {
    errors.number_of_guests = 'At least 1 guest required';
  }

  if (!data.channel) {
    errors.channel = 'Booking source is required';
  }

  return errors;
};
```

---

## 🔄 FLUJO COMPLETO

### Owner Experience:

1. **Owner logs in → AUTOPILOT Dashboard**

2. **Clicks "Add Booking" button**
   ```jsx
   <button className="..." onClick={() => navigate('/manual-entry')}>
     + Add New Booking
   </button>
   ```

3. **Fill form:**
   - Guest name: "Michael Chen"
   - Phone: "+65 9123 4567"
   - Email: "michael@example.com"
   - Country: "Singapore"
   - PAX: 2
   - Check-in: "15 March 2026"
   - Check-out: "18 March 2026" (3 nights auto-calc)
   - Total: IDR 3,900,000 (per night auto-calc: IDR 1,300,000)
   - Source: "Bali Buntu"
   - Payment: "Pending"
   - Status: "Confirmed"

4. **Click "Add Booking"**

5. **System:**
   - Validates form ✅
   - Calculates nights & price per night ✅
   - Inserts to Supabase ✅
   - Shows success toast ✅
   - Clears form ready for next ✅

6. **Owner sees in AUTOPILOT:**
   - Monthly view: "March 2026: 2 bookings" (previous + new)
   - Calendar: 15-18 March blocked
   - Revenue updated

---

## 📊 COMPATIBILIDAD CON EXCEL IMPORT

### Dual Entry System:

**Option A: Manual Entry** (via form UI)
- Owner usa el form para nuevos bookings
- Lento pero completo (con email, phone, country)

**Option B: Bulk Import** (via Excel)
- Owner sigue actualizando su Excel
- Script import automático cada semana
- Rápido pero incompleto (falta email, phone, country)

### Import Script Enhancement:
```javascript
// import-nismara-bookings.cjs (enhanced)

// Check for duplicates before insert
const isDuplicate = (newBooking, existingBookings) => {
  return existingBookings.some(b =>
    b.guest_name === newBooking.guest_name &&
    b.check_in_date === newBooking.check_in_date &&
    b.check_out_date === newBooking.check_out_date
  );
};

// Smart import: Only add new bookings
const importBookings = async () => {
  // 1. Fetch existing bookings from Supabase
  const { data: existing } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', PROPERTY_ID);

  // 2. Read Excel
  const excelBookings = parseExcel('NISMARA UMA VILLA OCCUPANCY.xlsx');

  // 3. Filter out duplicates
  const newBookings = excelBookings.filter(b => !isDuplicate(b, existing));

  if (newBookings.length === 0) {
    console.log('✅ No new bookings to import');
    return;
  }

  // 4. Insert only new ones
  const { data, error } = await supabase
    .from('bookings')
    .insert(newBookings);

  console.log(`✅ Imported ${newBookings.length} new bookings`);
};
```

---

## ✅ ACCIÓN INMEDIATA

### Para discutir ahora:

1. **¿Qué es "Bali Buntu"?**
   - ¿Agencia de viajes?
   - ¿Tour operator?
   - ¿Website/plataforma?

2. **¿"Gita" e "Ibu Santi"?**
   - ¿Son personas que refieren clientes?
   - ¿Comisionistas?
   - ¿Staff de Nismara Uma?

3. **Campos faltantes (email, phone, country):**
   - ¿Son importantes para el owner?
   - ¿O podemos dejarlos opcionales?
   - ¿El owner quiere capturarlos going forward?

4. **Preferencia de entrada:**
   - ¿Owner prefiere form UI o seguir con Excel?
   - ¿O los dos (dual system)?

---

**Listo para discutir!** 🚀
