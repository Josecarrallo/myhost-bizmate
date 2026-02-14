# GUEST COMMUNICATION - IMPLEMENTACIÓN COMPLETA
## Fecha: 26 de Diciembre 2025

---

## ✅ RESUMEN EJECUTIVO

Se completó la implementación del módulo Guest Communication (Email + WhatsApp) según especificación.

**Estado:** ✅ CÓDIGO COMPLETADO
**Pendiente:** Ejecutar SQL en Supabase + Crear webhook n8n

---

## 📦 ARCHIVOS CREADOS

### 1. Base de Datos
```
✅ supabase/communications-log-schema.sql
```

### 2. Servicio
```
✅ src/services/communicationsService.js (300+ líneas)
```

### 3. Componentes UI
```
✅ src/components/Guests/Guests.jsx (lista de guests)
✅ src/components/Guests/GuestProfile.jsx (perfil con tabs)
✅ src/components/Guests/SendCommunicationModal.jsx (modal de envío)
```

### 4. Integración
```
✅ src/App.jsx (routing actualizado)
```

---

## 🔧 PASOS PARA ACTIVAR

### PASO 1: Ejecutar SQL en Supabase ⚠️ OBLIGATORIO

1. Ve a tu proyecto de Supabase: https://jjpscimtxrudtepzwhag.supabase.co
2. Abre el SQL Editor
3. Copia y pega el contenido completo de:
   ```
   supabase/communications-log-schema.sql
   ```
4. Ejecuta el script
5. Verifica que se creó la tabla:
   ```sql
   SELECT * FROM communications_log LIMIT 1;
   ```

**Resultado esperado:**
```
✅ Communications Log schema created successfully!
```

### PASO 2: Verificar Tabla `guests` en Supabase

Si la tabla `guests` NO existe, crear con este schema mínimo:

```sql
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guests"
  ON public.guests FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can insert own guests"
  ON public.guests FOR INSERT
  WITH CHECK (tenant_id = auth.uid());
```

**Nota:** Por ahora, el componente usa datos mock. Cuando tengas datos reales en la tabla `guests`, actualiza `loadGuests()` en `Guests.jsx`.

### PASO 3: Probar en el Frontend

1. Asegúrate de que el servidor de desarrollo esté corriendo:
   ```bash
   npm run dev
   ```

2. Abre http://localhost:5174/

3. Haz login

4. En el sidebar, ve a:
   ```
   OPERATIONS & GUESTS → Guests
   ```
   o
   ```
   GUEST MANAGEMENT (External Agent) → Guest Database / CRM
   ```

5. Deberías ver:
   - Lista de guests (mock data: John Doe, Jane Smith)
   - Stats cards (Total Guests, Active This Month, Emails Sent)
   - Search bar

6. Haz click en "View Profile" de cualquier guest

7. Verás el perfil con 3 tabs:
   - Basic Info
   - Bookings
   - **Communication** ← La nueva funcionalidad

8. En la tab "Communication":
   - 2 botones: "Send Email" y "Send WhatsApp"
   - Sección "Recent Communications" (vacía inicialmente)

9. Haz click en "Send Email":
   - Se abre modal
   - "To" pre-rellenado con email del guest
   - Template selector (dropdown)
   - Subject (editable)
   - Message (editable)
   - Botón "Send Message"

10. Prueba seleccionar un template:
    - Selecciona "Welcome Message"
    - El subject y message se rellenan automáticamente
    - Puedes editar el mensaje

11. Haz click en "Send Message":
    - El mensaje se guarda en `communications_log`
    - Se dispara webhook n8n (fallará si no está configurado, pero el mensaje queda guardado)
    - Se cierra el modal
    - El mensaje aparece en "Recent Communications"

---

## 🧪 TESTING CHECKLIST

### UI Tests
- [ ] Guests list muestra datos mock
- [ ] Search bar filtra por nombre/email
- [ ] Stats cards muestran números correctos
- [ ] Click en "View Profile" abre perfil
- [ ] Tabs funcionan (Info, Bookings, Communication)
- [ ] Botones "Send Email" y "Send WhatsApp" abren modal
- [ ] Modal muestra información correcta
- [ ] Template selector funciona
- [ ] Variable replacement funciona en templates
- [ ] Modal se puede cerrar con X o Cancel
- [ ] Loading state mientras envía

### Data Tests
- [ ] Mensaje se guarda en `communications_log`
- [ ] `tenant_id` es correcto
- [ ] `guest_id` es correcto
- [ ] `channel` es 'email' o 'whatsapp'
- [ ] `status` inicia en 'queued'
- [ ] RLS funciona (solo ve sus propias communications)

### Integration Tests
- [ ] n8n webhook se dispara (si está configurado)
- [ ] Error handling si webhook falla
- [ ] Communications history se recarga después de enviar
- [ ] Multi-tenant isolation funciona

---

## 🔗 INTEGRACIÓN N8N (OPCIONAL - FASE 2)

Para que los emails/WhatsApp se envíen realmente, necesitas crear un workflow en n8n:

### Webhook URL
```
POST https://n8n-production-bb2d.up.railway.app/webhook/send-communication
```

### Payload Recibido
```json
{
  "communicationId": "uuid",
  "tenantId": "uuid",
  "propertyId": "uuid?",
  "guestId": "uuid",
  "bookingId": "uuid?",
  "channel": "email|whatsapp",
  "templateKey": "welcome|pre_checkin|...",
  "subject": "string", // solo para email
  "message": "string",
  "recipient": "email@example.com | +62123456789"
}
```

### N8N Workflow Estructura

```
1. Webhook Trigger
   ↓
2. IF channel === 'email'
   ↓
   SendGrid Node
   - To: payload.recipient
   - Subject: payload.subject
   - Body: payload.message
   ↓
   Update communications_log
   - SET status = 'sent'
   - SET provider_message_id = sendgrid_response.id
   - SET sent_at = NOW()

3. ELSE IF channel === 'whatsapp'
   ↓
   ChakraHQ Node (o Twilio)
   - To: payload.recipient
   - Body: payload.message
   ↓
   Update communications_log
   - SET status = 'sent'
   - SET provider_message_id = chakra_response.id
   - SET sent_at = NOW()

4. ELSE
   ↓
   Update communications_log
   - SET status = 'failed'
   - SET error_message = 'Unknown channel'
```

**Nota:** Por ahora, el sistema funciona sin n8n - los mensajes quedan guardados en la base de datos como 'queued'. Puedes crear el workflow n8n más adelante.

---

## 📊 TEMPLATES DISPONIBLES

El servicio incluye 5 templates predefinidos con reemplazo automático de variables:

### 1. Welcome Message
```
Subject: Welcome to {propertyName}!
Body: Dear {guestName}, Welcome to {propertyName}! We're thrilled to have you stay with us...
```

### 2. Pre Check-in
```
Subject: Your check-in is coming up!
Body: Hi {guestName}, We're excited to host you on {checkinDate}!...
```

### 3. Check-in Day
```
Subject: Welcome! Check-in instructions
Body: Hi {guestName}, Today is your check-in day! Here are your check-in instructions...
```

### 4. Payment Reminder
```
Subject: Payment reminder for booking #{bookingId}
Body: Hi {guestName}, This is a friendly reminder about the pending payment...
```

### 5. Review Request
```
Subject: How was your stay at {propertyName}?
Body: Hi {guestName}, Thank you for staying with us! We'd love to hear about your experience...
```

### Variables Soportadas
- `{guestName}` - Nombre del guest
- `{propertyName}` - Nombre de la propiedad
- `{checkinDate}` - Fecha de check-in
- `{checkoutDate}` - Fecha de check-out
- `{bookingId}` - ID de la reserva
- `{amountDue}` - Monto pendiente
- `{propertyAddress}` - Dirección de la propiedad

**Nota:** Por ahora algunas variables usan valores mock. Cuando integres con datos reales, actualiza `templateVariables` en `SendCommunicationModal.jsx`.

---

## 🛡️ SEGURIDAD IMPLEMENTADA

### Multi-tenant
- ✅ Todas las queries filtran por `tenant_id`
- ✅ RLS habilitado en `communications_log`
- ✅ Policies: SELECT, INSERT, UPDATE solo para tenant owner

### Data Validation
- ✅ Channel validation: solo 'email' o 'whatsapp'
- ✅ Status validation: queued|sent|failed|delivered|read
- ✅ Required fields enforced

### Error Handling
- ✅ Graceful degradation si n8n webhook falla
- ✅ Mensajes guardados incluso si envío falla
- ✅ Retry tracking con `retry_count`

---

## 📈 FUNCIONALIDADES FUTURAS (NO INCLUIDAS EN FASE 1)

Estas funcionalidades están fuera de scope inicial:

❌ AI writing assistance
❌ Email templates avanzados con HTML
❌ Personalización dinámica desde base de datos
❌ Scheduling/automation
❌ Bulk send (envío masivo)
❌ SMS channel
❌ Read receipts tracking
❌ Analytics dashboard

---

## 🐛 TROUBLESHOOTING

### Problema: "Cannot find module 'Guests'"
**Solución:** Verifica que los archivos estén en `src/components/Guests/`

### Problema: "Table communications_log does not exist"
**Solución:** Ejecuta `supabase/communications-log-schema.sql` en Supabase SQL Editor

### Problema: "Guests no aparece en sidebar"
**Solución:** Ya está incluido en 2 lugares:
- OPERATIONS & GUESTS → Guests
- GUEST MANAGEMENT → Guest Database / CRM

### Problema: "Error sending communication"
**Solución:**
1. Verifica que la tabla `communications_log` existe
2. Verifica RLS policies
3. Check console para ver error exacto
4. n8n webhook puede fallar (es normal si no está configurado)

### Problema: "No guests found"
**Solución:** Por ahora usa datos mock. Para conectar con Supabase real, actualiza `loadGuests()` en `Guests.jsx` línea 24:

```javascript
const loadGuests = async () => {
  setLoading(true);
  try {
    // Fetch real guests from Supabase
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/guests?tenant_id=eq.${user.id}`,
      { headers: supabaseHeaders }
    );
    const data = await response.json();
    setGuests(data);
  } catch (error) {
    console.error('Error loading guests:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 💰 COSTOS ESTIMADOS

### Almacenamiento (Supabase)
- `communications_log`: ~1KB por mensaje
- 10,000 mensajes/mes: ~10MB → Gratuito

### N8N Executions
- 1 execution por mensaje enviado
- Railway free tier: Suficiente para testing

### SendGrid (Email)
- Free tier: 100 emails/día
- $0.0010 por email después

### ChakraHQ (WhatsApp)
- Pricing: TBD (verificar con proveedor)

---

## 📝 PRÓXIMOS PASOS

1. ✅ Ejecutar SQL en Supabase (communications_log)
2. ⏳ Probar UI completa
3. ⏳ Crear webhook n8n (opcional)
4. ⏳ Conectar con guests reales en Supabase
5. ⏳ Configurar SendGrid para emails
6. ⏳ Configurar ChakraHQ para WhatsApp

---

**Autor:** Claude Code
**Fecha:** 26 de Diciembre 2025
**Branch:** backup-antes-de-automatizacion
**Commit:** Pendiente
