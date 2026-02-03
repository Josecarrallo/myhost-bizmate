# AUTOPILOT PARA NISMARA UMA - PLAN REALISTA
## Basado en su Operación Real (WhatsApp + Excel + Transferencias)

**Fecha:** 1 Febrero 2026
**Cliente:** Nismara Uma Villa
**Realidad:** Sin channel manager, sin Stripe, 100% WhatsApp manual

---

## 📊 ANÁLISIS DE SU OPERACIÓN ACTUAL

### Data Real Disponible
**Excel: "NISMARA UMA VILLA OCCUPANCY.xlsx"**

#### Sheet 2025 (Sept-Dec):
- **26 bookings confirmados**
- **Revenue total:** IDR 81,477,179 (~$5,100 USD)
- **Avg booking:** IDR 3.1M (~$195 USD)
- **Avg stay:** 3.2 noches
- **Payment status:** 9 "Done", 17 "On Scheduled"

#### Sheet 2026 (Jan-Sep):
- **15 bookings ya confirmados**
- **Revenue estimado:** IDR 50M (~$3,150 USD)
- **Bookings hasta Septiembre 2026**

### Booking Sources Identificados:
1. **"Bali Buntu"** - Canal principal (90% bookings)
2. **"Gita"** - Referido/directo (5%)
3. **"Ibu Santi"** - Referido/directo (5%)

### Forma de Trabajo Actual:
- ❌ **Sin channel manager** (Airbnb/Booking directo manual)
- ❌ **Sin payment gateway** (todo transferencia bancaria)
- ✅ **100% WhatsApp** para comunicación
- ✅ **Excel manual** para tracking
- ✅ **Calendarios Airbnb/Booking** actualizados manual
- ✅ **Confirmación de pagos** manual (screenshot de transferencia)

---

## 🎯 AUTOPILOT SIMPLIFICADO - 3 NIVELES

### NIVEL 1: WEEK 1-2 (MANUAL CON VISIBILIDAD)
**Objetivo:** Meter toda la data en Supabase, owner sigue trabajando igual pero VE todo en AUTOPILOT

#### Setup:
1. **Importar Excel a Supabase:**
```sql
-- Script para importar los 41 bookings del Excel
INSERT INTO bookings (
  tenant_id,
  property_id,
  guest_name,
  check_in_date,
  check_out_date,
  number_of_guests,
  total_amount,
  currency,
  channel,
  status,
  payment_status,
  created_at
) VALUES
  -- Row 3 del Excel:
  ('NISMARA_TENANT_ID', 'NISMARA_PROPERTY_ID', 'Alison Bell', '2025-08-31', '2025-09-03', 2, 2950533, 'IDR', 'Bali Buntu', 'completed', 'paid', '2025-08-15'),
  -- Row 4:
  ('NISMARA_TENANT_ID', 'NISMARA_PROPERTY_ID', 'M. Hadi Ghanchi', '2025-09-01', '2025-09-02', 3, 1042088, 'IDR', 'Bali Buntu', 'completed', 'paid', '2025-08-20'),
  -- ... resto de bookings
;
```

2. **Owner Dashboard:**
   - AUTOPILOT muestra todos los bookings
   - Daily view: "Hoy tienes 0 check-ins, 0 check-outs"
   - Weekly view: "Esta semana tienes 2 check-ins"
   - Monthly view: "Febrero 2026: 1 booking confirmado (Chinese Name, 19-26 Feb)"

3. **Owner sigue usando:**
   - WhatsApp manual
   - Excel manual
   - AUTOPILOT solo para VISUALIZAR

**Tiempo:** 1 día (import script + setup dashboard)

---

### NIVEL 2: WEEK 3-4 (WHATSAPP AI BÁSICO)
**Objetivo:** BANYU responde automáticamente inquiries simples, owner aprueba bookings

#### Setup WhatsApp API (Ya lo tienes listo!):
```
WBA/Número nuevo → ChakraHQ → BANYU AI

Flujo:
1. Guest: "Hola, disponible 19-23 Marzo?"
2. BANYU AI:
   - Busca en Supabase bookings tabla
   - Ve que 20-23 Marzo ocupado (Johana Catharina)
   - Responde: "Hola! Lamentablemente 20-23 Marzo ya está reservado.
     Pero tenemos disponibilidad 17-19 Marzo o después del 3 Abril.
     ¿Te interesa alguna de esas fechas?"
3. Guest: "Sí, 17-19 Marzo, 2 personas"
4. BANYU AI:
   - Calcula: 2 noches × IDR 1.3M = IDR 2.6M
   - Responde: "Perfecto! 17-19 Marzo (2 noches) para 2 personas = IDR 2.6M.
     Te envío detalles de pago por WhatsApp. ¿Confirmas?"
5. Guest: "Sí confirmo"
6. BANYU AI → Crea AUTOPILOT ACTION:
   - Type: booking_request
   - Guest: [name from WhatsApp]
   - Dates: 17-19 Marzo
   - Amount: IDR 2.6M
   - Status: pending
7. Owner ve en AUTOPILOT Dashboard: "1 decisión pendiente"
8. Owner clicks APPROVE
9. BANYU AI envía a guest:
   - Confirmación de reserva
   - Detalles de pago (banco, cuenta, monto)
   - Instrucciones: "Por favor envía screenshot de transferencia"
```

#### Ventajas:
- ✅ Owner NO necesita responder inquiries 24/7
- ✅ BANYU AI maneja 80% de preguntas (disponibilidad, precio, amenities)
- ✅ Owner solo aprueba bookings finales
- ✅ Tiempo ahorrado: ~10 horas/semana

**Tiempo:** 3-4 días (configurar ChakraHQ flow + testing)

---

### NIVEL 3: WEEK 5-6 (PAYMENT TRACKING MANUAL)
**Objetivo:** Tracking de pagos sin payment gateway

#### Flow de Pagos:
```
1. Booking aprobado → Status: 'pending_payment'
2. BANYU envía detalles de pago:
   "Por favor transferir IDR 2.6M a:
   Bank: BCA
   Account: 1234567890
   Name: Nismara Uma Villa

   Después de transferir, envía screenshot aquí por WhatsApp."

3. Guest envía screenshot de transferencia
4. BANYU AI:
   - Detecta imagen
   - Intenta leer monto con OCR (opcional)
   - Crea AUTOPILOT ACTION:
     - Type: payment_verification
     - Guest: [name]
     - Amount claimed: IDR 2.6M
     - Screenshot: [attached]
     - Status: pending

5. Owner ve en AUTOPILOT:
   "1 pago por verificar - Chinese Name - IDR 2.6M"
   [View Screenshot]

6. Owner verifica en su banco:
   - Check si recibió transferencia
   - Clicks APPROVE en AUTOPILOT

7. BANYU AI envía confirmación:
   "✅ Pago confirmado! Tu reserva está garantizada.
   Te enviamos los detalles de check-in 24h antes."

8. Booking status: 'confirmed'
```

#### Ventajas:
- ✅ Owner NO necesita responder "¿Recibiste mi pago?"
- ✅ Tracking centralizado de pagos pendientes
- ✅ Automated reminders si no paga en 3 días
- ✅ Workflow: WF-D2 Payment Protection

**Tiempo:** 2-3 días (payment verification flow)

---

## 🛠️ IMPLEMENTACIÓN PRÁCTICA

### SEMANA 1: Import Data + Dashboard

#### Día 1-2: Supabase Setup
```bash
# 1. Create tenant & property
INSERT INTO tenants (id, name, email, phone)
VALUES ('NISMARA_TENANT_ID', 'Nismara Uma Villa', 'owner@nismarauma.com', '+62xxx');

INSERT INTO properties (id, tenant_id, name, location, max_guests, price_per_night, currency)
VALUES ('NISMARA_PROPERTY_ID', 'NISMARA_TENANT_ID', 'Nismara Uma Villa', 'Ubud, Bali', 4, 1300000, 'IDR');
```

#### Día 3-4: Import Bookings
Crear script Node.js que:
1. Lee el Excel
2. Parse cada row
3. Insert en Supabase bookings table
4. Handle fechas (Excel dates son números seriales)

**Script:**
```javascript
// import-nismara-bookings.cjs
const XLSX = require('xlsx');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const excelDateToJSDate = (serial) => {
  // Excel serial date to JS Date
  const utc_days  = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0]; // YYYY-MM-DD
};

const importBookings = async () => {
  const wb = XLSX.readFile('./NISMARA UMA VILLA OCCUPANCY.xlsx');

  // Sheet 2025
  const sheet2025 = XLSX.utils.sheet_to_json(wb.Sheets['2025'], { header: 1 });

  const bookings = [];

  // Skip header rows (0, 1)
  for (let i = 2; i < sheet2025.length; i++) {
    const row = sheet2025[i];
    if (!row[0]) break; // Empty row

    const checkIn = typeof row[3] === 'number' ? excelDateToJSDate(row[3]) : row[3];
    const checkOut = typeof row[4] === 'number' ? excelDateToJSDate(row[4]) : row[4];

    bookings.push({
      tenant_id: 'NISMARA_TENANT_ID',
      property_id: 'NISMARA_PROPERTY_ID',
      guest_name: row[2],
      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_guests: row[5],
      total_amount: row[7],
      currency: 'IDR',
      channel: row[8] === 'Bali Buntu' ? 'Booking.com' : 'Direct', // Mapping
      status: row[9] === 'Done' ? 'completed' : 'confirmed',
      payment_status: row[9] === 'Done' ? 'paid' : 'pending',
      created_at: new Date(checkIn).toISOString()
    });
  }

  // Sheet 2026 (similar)
  const sheet2026 = XLSX.utils.sheet_to_json(wb.Sheets['2026'], { header: 1 });
  // ... same logic

  // Insert to Supabase
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookings);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(`✅ Imported ${bookings.length} bookings`);
  }
};

importBookings();
```

#### Día 5: Verify Data
- [ ] Login to AUTOPILOT
- [ ] Navigate to Monthly view
- [ ] Verify Febrero 2026: "Chinese Name, 19-26 Feb, IDR 7.5M"
- [ ] Verify todos los 41 bookings están correctos

---

### SEMANA 2: WhatsApp AI Setup

#### Día 1-2: ChakraHQ Configuration
Ya tienes el número nuevo listo. Ahora configurar flow:

**ChakraHQ Flow:**
```yaml
name: "Nismara Uma - Inquiry Handler"
trigger: "Incoming message"

steps:
  - check_intent:
      if_contains: ["available", "disponible", "vacancy"]
      → action: check_availability

  - check_availability:
      query_supabase:
        table: bookings
        filter: property_id = 'NISMARA_PROPERTY_ID'
        filter: status IN ('confirmed', 'completed')

      response:
        if_available: "Hola! Sí tenemos disponibilidad para [dates]. El precio es IDR [price]. ¿Te gustaría reservar?"
        if_not_available: "Lamentablemente esas fechas ya están reservadas. Tenemos disponibilidad [alternative_dates]. ¿Te interesan?"

  - capture_booking_request:
      if_intent: "booking"
      extract:
        - guest_name
        - dates
        - number_of_guests

      create_autopilot_action:
        type: "booking_request"
        priority: "HIGH"
        data: {guest_name, dates, amount}

      notify_owner: "WhatsApp notification"

      response_to_guest: "Perfecto! Tu solicitud ha sido enviada al propietario. Te confirmamos en 2-4 horas."
```

#### Día 3-4: Testing
1. Envía mensaje de prueba al WhatsApp nuevo
2. "Hola, disponible 10-12 Marzo?"
3. Verifica que BANYU responde correctamente
4. Verifica que crea AUTOPILOT action
5. Owner aprueba en dashboard
6. Verifica confirmación a guest

---

### SEMANA 3: Payment Verification

#### Día 1-2: Payment Flow Setup
```javascript
// n8n workflow: WF-PAYMENT-VERIFICATION

// Trigger: ChakraHQ webhook cuando guest envía imagen
// 1. Receive image from WhatsApp
// 2. Extract metadata (guest phone, conversation ID)
// 3. Find pending booking for this guest
// 4. Create autopilot_action:
{
  type: 'payment_verification',
  guest_name: booking.guest_name,
  guest_phone: whatsapp_phone,
  amount: booking.total_amount,
  description: `Payment screenshot received for booking ${booking.check_in_date} - ${booking.check_out_date}`,
  priority: 'HIGH',
  status: 'pending',
  metadata: {
    image_url: whatsapp_image_url,
    booking_id: booking.id
  }
}
// 5. Send WhatsApp to owner: "Nuevo pago por verificar - [guest_name] - IDR [amount]"
```

#### Día 3-4: Owner Dashboard Update
Agregar sección en AUTOPILOT:
```jsx
{/* Payment Verifications Section */}
<div className="mb-6">
  <h3 className="text-xl font-black text-white mb-4">
    Payment Verifications ({paymentVerifications.length})
  </h3>

  {paymentVerifications.map(action => (
    <div key={action.id} className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4 mb-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-bold">{action.guest_name}</p>
          <p className="text-gray-300 text-sm">
            {formatCurrency(action.amount, 'IDR')} -
            {action.metadata.booking_dates}
          </p>
        </div>
        <button
          onClick={() => window.open(action.metadata.image_url, '_blank')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          View Screenshot
        </button>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => handleApprovePayment(action.id)}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          ✅ Confirm Payment
        </button>
        <button
          onClick={() => handleRejectPayment(action.id)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          ❌ Payment Not Received
        </button>
      </div>
    </div>
  ))}
</div>
```

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ANTES (Manual):
```
Guest WhatsApp → Owner responde (24h delay)
                → Guest pregunta precio
                → Owner calcula (5 min)
                → Owner responde
                → Guest dice "Ok reservo"
                → Owner envía detalles pago
                → Guest pregunta "¿A qué cuenta?"
                → Owner responde
                → Guest transfiere
                → Guest envía screenshot
                → Owner verifica banco
                → Owner confirma por WhatsApp
                → Owner actualiza Excel manual
                → Owner actualiza calendarios Airbnb/Booking manual

TIEMPO TOTAL: 2-3 horas
MENSAJES: 15-20
```

### DESPUÉS (AUTOPILOT):
```
Guest WhatsApp → BANYU AI responde (instant)
                → BANYU calcula precio
                → BANYU envía detalles pago
                → Guest transfiere
                → Guest envía screenshot
                → AUTOPILOT notifica owner (1 click)
                → Owner verifica banco → APPROVE
                → BANYU confirma automático
                → Supabase actualizado automático
                → Calendar sync automático

TIEMPO OWNER: 30 segundos (solo verificar banco + 1 click)
MENSAJES OWNER: 0
```

**AHORRO: 2.5 horas por booking × 4 bookings/mes = 10 horas/mes**

---

## 💰 PRICING REALISTA

### Setup Fee: $200 USD (Reducido de $300)
**Incluye:**
- Supabase setup (tenant + property)
- Import 41 bookings históricos del Excel
- WhatsApp AI setup (ChakraHQ flow)
- AUTOPILOT dashboard con payment verification
- 1 hora training (video + call)

### Monthly: $39/mes (Reducido de $49)
**Incluye:**
- AUTOPILOT Dashboard (Owner Decisions)
- BANYU WhatsApp AI (unlimited messages)
- Calendar sync automático
- Payment verification flow
- Workflows:
  - Lead Handler
  - Payment Protection
  - Booking Confirmations
- Support (WhatsApp Mon-Fri 9-6 PM WIB)

**Primer mes GRATIS** (14-day trial)

---

## 🎯 MÉTRICAS DE ÉXITO

### Week 1:
- [ ] 41 bookings importados en Supabase ✅
- [ ] Owner ve todos sus bookings en AUTOPILOT ✅
- [ ] Monthly view correcto (Febrero: 1 booking) ✅

### Week 2-3:
- [ ] WhatsApp AI respondiendo inquiries ✅
- [ ] First booking request via AUTOPILOT ✅
- [ ] Owner approve/reject working ✅

### Week 4:
- [ ] Payment verification flow working ✅
- [ ] Owner verifica 1 pago exitosamente ✅
- [ ] Time saved: 2+ hours ✅

### Month 1:
- [ ] 4+ bookings procesados via AUTOPILOT ✅
- [ ] Owner NPS: 8+ ✅
- [ ] Time saved: 10+ hours ✅

---

## 🚨 IMPORTANTE: LO QUE NO VAMOS A HACER (POR AHORA)

❌ **Channel Manager Integration** - Airbnb/Booking siguen manual (requiere API keys complejas)
❌ **Payment Gateway (Stripe/Wise)** - Pagos siguen siendo transferencia bancaria
❌ **Automated Calendar Sync con Airbnb/Booking** - Owner sigue actualizando manual
❌ **Landing Page Integration** - No urgente (90% bookings vienen de Bali Buntu)
❌ **Voice AI (KORA)** - No necesario (todo WhatsApp)

**Razón:** Queremos AUTOPILOT funcionando en 2 semanas, no en 2 meses.

---

## 📞 PRÓXIMOS PASOS HOY

### TU (José):
1. [ ] Confirmar con owner: "¿Apruebas plan de $200 setup + $39/mes?"
2. [ ] Conseguir WhatsApp Business number del owner
3. [ ] Conseguir bank account details (para incluir en mensajes de pago)
4. [ ] Run import script de bookings (ya tenemos el Excel)

### YO (Claude):
1. [ ] Crear import script completo (Node.js)
2. [ ] Crear ChakraHQ flow template
3. [ ] Crear Payment Verification component para AUTOPILOT
4. [ ] Documentación paso a paso

---

**DEADLINE:** AUTOPILOT live en 2 semanas (15 Febrero 2026)

*Plan creado: 1 Febrero 2026 - REALISTA y EJECUTABLE*
