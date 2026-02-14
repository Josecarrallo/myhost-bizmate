# PENDIENTES PRIORIZADOS - MY HOST BIZMATE
## Lista de Tareas Actualizadas - 30 Enero 2026

**Última Actualización:** 30 Enero 2026
**Status General:** 🟢 EN PROGRESO

---

## 🔴 PRIORIDAD CRÍTICA (ESTA SEMANA)

### 1. AUTOPILOT - Demo Preparation
**Status:** ⏳ EN PREPARACIÓN
**Deadline:** Por confirmar (originalmente 4PM hoy)
**Tiempo Estimado:** 3-4 horas

**Tareas:**
- [ ] **Verificar data en Supabase:**
  - Confirmar 3 pending actions (Emma Chen, Michael Brown Jr, Thomas Schmidt Jr)
  - Verificar bookings table (45 registros)
  - Confirmar daily_summary tiene data

- [ ] **Testing End-to-End:**
  - Probar APPROVE workflow completo (OSIRIS → n8n → WhatsApp)
  - Probar REJECT workflow
  - Verificar DB Visualization panel muestra logs correctamente
  - Probar en mobile/tablet/desktop

- [ ] **Scripts de Demo:**
  - Preparar talking points (basado en AUTOPILOT_DEMO_WALKTHROUGH_30ENE2026.md)
  - Rehearsal del flow completo (15 minutos)
  - Preparar respuestas a preguntas frecuentes

- [ ] **Backup Plan:**
  - Tener screenshots de fallback
  - Tener Supabase dashboard abierto en tab
  - Tener n8n dashboard abierto en tab

**Documentos de Referencia:**
- `AUTOPILOT_DEMO_WALKTHROUGH_30ENE2026.md`
- `INFORME_SUPABASE_IZUMI_HOTEL_29ENE2026.md`

---

### 2. AUTOPILOT - Weekly Summary Workflow (WF-W1)
**Status:** ❌ NO INICIADO
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 6-8 horas
**Deadline:** Esta semana

**Descripción:**
Crear workflow n8n que genere automáticamente un resumen semanal cada Lunes 6:00 AM con las métricas de la semana anterior.

**Tareas Técnicas:**
- [ ] **n8n Workflow Creation:**
  - Crear workflow "WF-W1 Weekly Summary"
  - Schedule trigger: CRON `0 6 * * 1` (Lunes 6AM)
  - Webhook trigger: Botón manual en OSIRIS

- [ ] **Data Aggregation:**
  - Query bookings (last 7 days, group by status)
  - Query leads (last 7 days, group by stage)
  - Query payments (last 7 days, sum amounts)
  - Query autopilot_actions (last 7 days, count by type)
  - Calculate week-over-week changes

- [ ] **AI Analysis (Claude):**
  - Send data to Claude 3.5 Sonnet
  - Prompt: "Analyze this week's performance, identify trends, provide 3 actionable recommendations"
  - Generate insights paragraph

- [ ] **Report Generation:**
  - Format data en Markdown/HTML
  - Include charts (opcional: usar QuickChart.io API)
  - Create PDF con Puppeteer o similar

- [ ] **Delivery:**
  - Store en Supabase: `autopilot_weekly_summaries` table
  - Send via WhatsApp (BANYU): "Your weekly summary is ready 📊"
  - Send via Email (SendGrid): Attach PDF

- [ ] **Frontend Display:**
  - Agregar sección "Weekly Summaries" en AUTOPILOT
  - List últimas 4 semanas
  - Download PDF button

**Supabase Table Schema:**
```sql
CREATE TABLE autopilot_weekly_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  bookings_count INT,
  revenue_amount DECIMAL(10,2),
  leads_count INT,
  actions_count INT,
  ai_insights TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**n8n Workflow ID:** Por asignar (usar GuHQkHb21GlowIZl como referencia)

---

### 3. AUTOPILOT - Monthly Summary Workflow (WF-M1)
**Status:** ❌ NO INICIADO
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 6-8 horas
**Deadline:** Antes de fin de mes (31 Enero)

**Descripción:**
Crear workflow n8n que genere automáticamente un resumen mensual el día 1 de cada mes con las métricas del mes anterior.

**Tareas:**
- [ ] **n8n Workflow Creation:**
  - Crear workflow "WF-M1 Monthly Summary"
  - Schedule trigger: CRON `0 7 1 * *` (Día 1 de cada mes, 7AM)
  - Webhook trigger: Botón manual en OSIRIS

- [ ] **Data Aggregation:**
  - Query bookings (last month, group by status/channel/country)
  - Query leads (last month, conversion rate)
  - Query payments (last month, payment completion rate)
  - Query autopilot_actions (last month, approve/reject ratio)
  - Calculate month-over-month changes
  - Calculate YoY changes (si hay data del año anterior)

- [ ] **Advanced AI Analysis (Claude):**
  - Compare con meses anteriores (trend analysis)
  - Identify seasonal patterns
  - Predict next month (forecasting)
  - Provide strategic recommendations (pricing, marketing)

- [ ] **Rich Report Generation:**
  - Executive summary (1 page)
  - Charts: Revenue by channel, Bookings timeline, Occupancy heatmap
  - Top performers: Best-performing villas, Top countries, Best channels
  - Bottom performers: Identify issues, suggest improvements
  - Action items for next month

- [ ] **Delivery:**
  - Store en Supabase: `autopilot_monthly_summaries` table
  - Send via WhatsApp (high-level summary + PDF link)
  - Send via Email (full PDF report + Excel export)
  - Optional: Schedule owner call (KORA voice summary)

**Similar a Weekly pero más comprehensive.**

---

### 4. Database Visualization - Error Handling
**Status:** ⚠️ PARCIAL (básico implementado, falta robust error handling)
**Prioridad:** 🔴 ALTA
**Tiempo Estimado:** 2-3 horas

**Problemas Actuales:**
- No maneja timeouts de Supabase
- No muestra errores de webhook failures
- No hay retry logic
- Loading states no son claros

**Tareas:**
- [ ] **Supabase Error Handling:**
  - Wrap todas las queries en try/catch
  - Mostrar error message amigable en DB panel
  - Ejemplo: "❌ Failed to fetch actions: Network timeout (retrying...)"
  - Auto-retry 3 veces con exponential backoff

- [ ] **Webhook Error Handling:**
  - Catch failed webhook POST requests
  - Show en DB panel: "❌ Webhook failed: 500 Internal Server Error"
  - Provide manual retry button
  - Log all failed webhooks en Supabase (para debugging)

- [ ] **Loading States:**
  - Show spinner en "Refresh Data" button cuando está fetching
  - Disable approve/reject buttons mientras está processing
  - Show "Processing..." overlay durante webhook calls

- [ ] **Success Feedback:**
  - Show ✅ checkmark cuando todo es exitoso
  - Auto-hide success messages después de 5 segundos
  - Mantener error messages hasta que user las cierre

**Código a Modificar:**
`src/components/Autopilot/Autopilot.jsx` - líneas ~900-1100 (DB panel section)

---

## 🟡 PRIORIDAD ALTA (PRÓXIMAS 2 SEMANAS)

### 5. Nismara Uma Villa - Onboarding Completo
**Status:** ❌ NO INICIADO
**Prioridad:** 🟡 ALTA
**Cliente:** Nismara Uma (próximo pilot después de Izumi Hotel)
**Tiempo Estimado:** 12-16 horas (full onboarding)

**Contexto:**
Nismara Uma es la segunda propiedad piloto. Necesitamos onboardearlos completamente para probar multi-tenant functionality.

**Tareas:**

#### A) Configuración Técnica (4-5 horas)
- [ ] **Supabase Setup:**
  - Crear nuevo tenant_id para Nismara Uma
  - Crear nuevo property_id
  - Configurar owner account (email, phone)
  - Insert property details (name, address, rooms, amenities)
  - Upload villa photos a Supabase Storage

- [ ] **AI Agents Configuration:**
  - Setup KORA (VAPI): Create new assistant "Nismara Uma Concierge"
  - Setup BANYU (ChakraHQ): Connect WhatsApp number
  - Setup LUMINA: Configure lead scoring rules
  - Setup OSIRIS: Customize dashboard branding

- [ ] **n8n Workflows:**
  - Clone existing workflows (WF-03, WF-04, WF-05)
  - Update tenant_id/property_id en todos los nodos
  - Test cada workflow end-to-end

#### B) Landing Page Improvements (3-4 horas)
- [ ] **Editable Dates:**
  - Implementar date picker en booking form
  - Show availability calendar (fetch from Supabase bookings)
  - Block out already booked dates
  - Calculate price based on selected dates

- [ ] **WhatsApp Direct Links:**
  - Add floating WhatsApp button (bottom-right)
  - "Chat with us on WhatsApp" CTA
  - Pre-fill message: "Hi, I'm interested in booking Nismara Uma Villa..."
  - Link directo a BANYU WhatsApp number

- [ ] **Booking Form Integration:**
  - Connect form submission to WF-03 Lead Handler
  - Test lead creation en Supabase
  - Verify LUMINA scoring
  - Verify auto-follow-up (WF-04)

#### C) Owner Training (2-3 horas)
- [ ] Create onboarding video (Loom)
- [ ] Schedule 1-on-1 training call
- [ ] Provide owner documentation:
  - How to use AUTOPILOT dashboard
  - How to approve/reject decisions
  - How to view reports
  - How to contact support

#### D) Testing & Go-Live (3-4 horas)
- [ ] End-to-end testing con real guest inquiry
- [ ] Verify all workflows trigger correctly
- [ ] Monitor first week closely
- [ ] Collect owner feedback

**Documentos de Referencia:**
- `MYHOST Bizmate_Documentos_Estrategicos 2025_2026/CHAKRAHQ_ONBOARDING_CHECKLIST.md`

---

### 6. Bookings Module - Supabase Integration
**Status:** ⚠️ DEMO DATA
**Prioridad:** 🟡 ALTA
**Tiempo Estimado:** 8-10 horas

**Descripción:**
Migrar el módulo Bookings de hardcoded demo data a real Supabase data, con full CRUD operations.

**Tareas:**
- [ ] **Service Layer (`supabaseService.js`):**
  - `getBookings(propertyId, filters)` - Fetch con filters (status, date range)
  - `getBookingById(id)` - Single booking details
  - `createBooking(data)` - Create new booking (from manual entry)
  - `updateBooking(id, data)` - Update existing booking
  - `deleteBooking(id)` - Soft delete (status = 'cancelled')

- [ ] **Component Update (`Bookings.jsx`):**
  - Remove hardcoded bookings array
  - Use `useEffect` to fetch from Supabase on mount
  - Add loading state (spinner)
  - Add error state (error message)
  - Implement pagination (50 bookings per page)

- [ ] **Filters Implementation:**
  - Status filter: All, Confirmed, Pending, Checked-in, Checked-out, Cancelled
  - Date range filter: This Week, This Month, Custom Range
  - Channel filter: All, Airbnb, Booking.com, Direct
  - Search: Guest name, booking ID

- [ ] **Detail View:**
  - Click booking card → Open detail modal
  - Show full guest info (name, email, phone, country)
  - Show booking details (dates, amount, channel, status)
  - Show payment history
  - Show message history (from BANYU)
  - Actions: Edit, Cancel, Send Message

- [ ] **Real-time Updates:**
  - Subscribe to Supabase realtime channel
  - Auto-refresh when new booking is created
  - Show notification: "New booking from Emma Chen"

**Supabase Query Example:**
```javascript
const { data, error } = await supabase
  .from('bookings')
  .select('*, guests(*), properties(*)')
  .eq('property_id', propertyId)
  .eq('status', 'confirmed')
  .gte('check_in_date', '2026-01-01')
  .order('check_in_date', { ascending: true })
  .range(0, 49); // Pagination
```

---

### 7. Payments Module - Supabase Integration
**Status:** ⚠️ DEMO DATA
**Prioridad:** 🟡 ALTA
**Tiempo Estimado:** 8-10 horas

**Similar a Bookings Module pero para payments.**

**Tareas:**
- [ ] Service layer methods (getPayments, createPayment, updatePayment)
- [ ] Component update (fetch from Supabase)
- [ ] Filters (status: paid/pending/overdue, date range)
- [ ] Integration con WF-D2 Payment Protection workflow
- [ ] Show payment reminders sent (from workflow)
- [ ] Manual payment verification button
- [ ] Payment history timeline

---

### 8. AUTOPILOT - Mobile Responsive Improvements
**Status:** ⚠️ PARCIAL (responsive existe pero puede mejorar)
**Prioridad:** 🟡 MEDIA
**Tiempo Estimado:** 4-6 horas

**Problemas Actuales:**
- Owner Decisions cards se ven apretadas en mobile
- DB Visualization panel difícil de leer en pantallas pequeñas
- Monthly performance metrics no se acomodan bien en mobile

**Tareas:**
- [ ] **Owner Decisions Cards:**
  - Cambiar de 2-column a 1-column layout en mobile
  - Aumentar font size de guest name en mobile
  - Hacer approve/reject buttons más grandes (touch-friendly)

- [ ] **DB Visualization Panel:**
  - Hacer scrollable horizontalmente en mobile
  - Reducir font size de queries
  - Agregar "Copy to clipboard" button para queries

- [ ] **Monthly Performance:**
  - Stack cards vertically en mobile
  - Reducir padding en mobile
  - Scroll horizontal para 3 meses

- [ ] **Navigation:**
  - Sticky tabs (Daily/Weekly/Monthly) en top
  - Swipe gestures para cambiar entre tabs

- [ ] **Testing:**
  - Test en iPhone SE (small screen)
  - Test en iPhone 14 Pro (notch)
  - Test en iPad (tablet)
  - Test en Android (Samsung Galaxy)

---

## 🟢 PRIORIDAD MEDIA (PRÓXIMO MES)

### 9. AUTOPILOT - Voice Commands (Phase 3)
**Status:** ❌ NO INICIADO
**Prioridad:** 🟢 MEDIA
**Tiempo Estimado:** 16-20 horas

**Descripción:**
Integrar OSIRIS con VAPI para permitir voice commands al owner.

**Use Cases:**
- "Hey OSIRIS, how many bookings this week?" → Voice response
- "Hey OSIRIS, what's my revenue this month?" → Voice response
- "Hey OSIRIS, approve Emma Chen discount" → Execute action + confirmation
- "Hey OSIRIS, show me pending payments" → Navigate to payments view

**Tareas:**
- [ ] VAPI Integration (create OSIRIS voice assistant)
- [ ] Voice-to-text transcription
- [ ] Intent detection (Claude AI)
- [ ] Execute actions (query Supabase, approve actions)
- [ ] Text-to-speech response
- [ ] Frontend: Voice command button en OSIRIS dashboard

---

### 10. Multi-Property Dashboard
**Status:** ❌ NO INICIADO
**Prioridad:** 🟢 MEDIA
**Tiempo Estimado:** 12-16 horas

**Descripción:**
Para owners con múltiples propiedades (ej: 3 villas), mostrar vista agregada.

**Tareas:**
- [ ] Property selector dropdown en sidebar
- [ ] "All Properties" aggregate view
- [ ] Compare performance (Villa A vs Villa B)
- [ ] Cross-property insights (which villa performs best?)
- [ ] Bulk actions (approve all pending decisions)

---

### 11-15. Otros Pendientes
- [ ] Marketing Module - Real Implementation
- [ ] Reviews Module - API Integration
- [ ] Smart Pricing - Dynamic pricing algorithm
- [ ] Channel Manager - Airbnb/Booking API sync
- [ ] Guest Portal - Self-service check-in

*Ver ESTADO_PROYECTO_MYHOST_30_ENERO_2026.md para detalles completos.*

---

## 🐛 BUGS A CORREGIR

### BUGS ACTIVOS

#### BUG-001: Sidebar mobile no cierra al logout
**Severidad:** 🟡 MEDIA
**Pasos para reproducir:**
1. Abrir app en mobile
2. Abrir sidebar
3. Click Logout
4. Sidebar queda abierto, user ve login screen con sidebar visible

**Solución:**
```javascript
// En Sidebar.jsx
const handleLogout = async () => {
  if (onClose) onClose(); // Cerrar sidebar primero
  await signOut();
};
```

**Archivo:** `src/components/Layout/Sidebar.jsx` - línea ~336

---

#### BUG-002: Manual Data Entry no persiste en Supabase
**Severidad:** 🟡 MEDIA
**Pasos para reproducir:**
1. Dashboard → Click "Data Entry"
2. Llenar formulario de booking
3. Click "Add Booking"
4. Alert muestra "Booking added successfully!"
5. Refresh page → Booking no aparece

**Solución:**
Implementar `supabaseService.createBooking()` y llamarlo en `handleAddBooking()`

**Archivo:** `src/components/ManualDataEntry/ManualDataEntry.jsx`

---

#### BUG-003: Properties upload photo no funciona
**Severidad:** 🟢 BAJA
**Descripción:** Botón "Upload Photo" en Properties module no hace nada

**Solución:**
Implementar upload a Supabase Storage

```javascript
const handlePhotoUpload = async (file, propertyId) => {
  const { data, error } = await supabase.storage
    .from('properties')
    .upload(`${propertyId}/${file.name}`, file);

  if (error) throw error;

  const publicUrl = supabase.storage
    .from('properties')
    .getPublicUrl(data.path).data.publicUrl;

  // Update property record with photo URL
  await supabase
    .from('properties')
    .update({ photo_url: publicUrl })
    .eq('id', propertyId);
};
```

**Archivo:** `src/components/Properties/Properties.jsx`

---

## 📊 MÉTRICAS DE PROGRESO

### Completado vs Pendiente
- ✅ **Completado:** 40% (AUTOPILOT Phase 1, AI Systems, Properties, Voice AI, Sidebar)
- ⏳ **En Progreso:** 20% (Demo prep, Weekly/Monthly summaries)
- ❌ **Pendiente:** 40% (Onboarding Nismara Uma, Bookings/Payments integration, Mobile improvements, Multi-property)

### Por Módulo
| Módulo | Progreso | Prioridad |
|--------|----------|-----------|
| AUTOPILOT | 70% | 🔴 CRÍTICA |
| AI Systems | 90% | 🔴 ALTA |
| Bookings | 30% | 🟡 ALTA |
| Payments | 30% | 🟡 ALTA |
| Properties | 80% | 🟡 MEDIA |
| Voice AI | 85% | 🔴 ALTA |
| Marketing | 20% | 🟢 BAJA |
| Reviews | 15% | 🟢 BAJA |

---

## 🎯 PRÓXIMOS HITOS

### Hito 1: AUTOPILOT Demo Ready
**Fecha Target:** Confirmar con cliente
**Criterios:**
- ✅ 3 pending actions visible
- ✅ Approve workflow funciona end-to-end
- ✅ WhatsApp confirmation enviado
- ✅ DB visualization muestra logs
- ✅ Responsive en todas las pantallas

**Status Actual:** 90% ready

---

### Hito 2: AUTOPILOT Phase 2 Complete
**Fecha Target:** 7 Febrero 2026
**Criterios:**
- ✅ Weekly summary workflow deployed
- ✅ Monthly summary workflow deployed
- ✅ PDF reports generados
- ✅ WhatsApp + Email delivery working
- ✅ Frontend UI para ver summaries

**Status Actual:** 0% (no iniciado)

---

### Hito 3: Nismara Uma Onboarded
**Fecha Target:** 14 Febrero 2026
**Criterios:**
- ✅ Property configurada en Supabase
- ✅ AI agents configurados
- ✅ Landing page live con editable dates
- ✅ Workflows tested end-to-end
- ✅ Owner trained

**Status Actual:** 0% (no iniciado)

---

## 📞 NECESITO AYUDA CON...

### Decisiones Pendientes del Owner
1. **Fecha Demo AUTOPILOT:** ¿Cuándo quieres presentar? (originalmente era hoy 4PM)
2. **Nismara Uma Timeline:** ¿Cuándo quieres onboardear la segunda property?
3. **Weekly/Monthly Summaries:** ¿Qué día/hora prefieres recibirlos?
4. **Priorización:** ¿Qué es más importante: Mobile app o Multi-property dashboard?

### Recursos Necesarios
- [ ] Nismara Uma villa photos (6-10 high-res images)
- [ ] Nismara Uma property details (rooms, amenities, pricing)
- [ ] WhatsApp number para BANYU
- [ ] VAPI credits para KORA (voice calls)
- [ ] SendGrid account para emails (opcional: usar Gmail SMTP por ahora)

---

*Documento generado: 30 Enero 2026 - 15:45h*
*MY HOST BizMate - ZENTARA LIVING*
*TODO List - Uso Interno*
