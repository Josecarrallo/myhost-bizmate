# 🗺️ ROADMAP COMPLETO ACTUALIZADO - MY HOST BIZMATE
**Fecha actualización:** 23 Febrero 2026
**Status:** Documento maestro consolidado
**Última sesión:** Enhanced Report - Property-Based Selection (23/FEB/2026)

---

## 🆕 ÚLTIMA ACTUALIZACIÓN - 23 FEBRERO 2026

### ✅ **Enhanced Report - Property-Based Selection**
**Commit:** `a924e04` | **Branch:** `backup-antes-de-automatizacion` | **Status:** COMPLETADO

**Cambios implementados:**
- ✅ Convertido Enhanced Report de owner-based a property-based selection
- ✅ Usuario logueado (Gita) selecciona entre All Properties, Nismara, Uma, o Santai
- ✅ Agregados date range selectors personalizados (matching Specialized Reports)
- ✅ Actualizado esquema de colores a corporate orange/purple
- ✅ Reducidos font sizes en Fee Structure section
- ✅ Service layer actualizado con filtro opcional por villa_id

**Documentación completa:** `Claude AI and Code Update 23022026/SESSION_SUMMARY_23FEB2026_ENHANCED_REPORT.md`

**Próximos pasos:**
1. Gita revisar todos los informes (Global, Enhanced, Specialized)
2. Optimizar OSIRIS AI prompts
3. Implementar Video Features

---

## 📋 ÍNDICE

1. [⚠️ ARCHITECTURE REINFORCEMENT (MUST READ)](#architecture-reinforcement)
2. [Temas Urgentes - Prioridad Crítica](#temas-urgentes)
3. [Video Features - Nueva Arquitectura](#video-features)
4. [Channel Sync - Booking.com & Airbnb](#channel-sync)
5. [Arquitectura Multitenant](#arquitectura-multitenant)
6. [Módulos Supabase Pendientes](#modulos-supabase-pendientes)
7. [n8n Workflows Adicionales](#n8n-workflows)
8. [VAPI Integration](#vapi-integration)
9. [Testing & Seguridad](#testing-seguridad)
10. [Otros Temas](#otros-temas)

---

## ⚠️ ARCHITECTURE REINFORCEMENT (MUST READ)

### 🔴 CRITICAL ARCHITECTURE ADDITIONS FOR WF-06 & WF-07

**Document:** `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md`
**Status:** 🔴 **MANDATORY before implementing Channel Sync**
**Impact:** Prevents double bookings, ensures legal compliance, enables AI automation

**7 Critical Enhancements:**

1. **Master Calendar - Source of Truth Rule**
   - Calendar must be authoritative (not OTAs)
   - Validate ALL incoming OTA bookings against Master Calendar
   - Update Calendar FIRST, then sync to channels

2. **Advanced Conflict Detection**
   - HARD_CONFLICT: Overlapping confirmed bookings
   - SOFT_CONFLICT: Overlaps with maintenance/owner blocks
   - CHANNEL_MISMATCH: OTA vs Master Calendar discrepancies
   - Auto-alert owner on ANY conflict

3. **Extended Bookings Table Schema**
   - Add: `overbooking_risk`, `conflict_type`, `conflict_details`
   - Add: `modification_count`, `modification_history`
   - Add: `sync_error_message`

4. **Task Dependencies (Maintenance Engine)**
   - Enable task sequencing: Checkout → Cleaning → Setup
   - Auto-trigger dependent tasks on parent completion
   - `parent_task_id`, `dependency_status` fields

5. **AI Issue Classification (BANYU/KORA)**
   - Auto-classify guest issues by category/urgency
   - Sentiment analysis for guest satisfaction
   - Track recurring issues per villa
   - Auto-assign to correct staff based on category

6. **Audit Trail System (Legal Protection)**
   - Log EVERY change to bookings/calendar/tasks
   - Track: who, what, when, previous state, new state
   - Required for legal disputes, debugging, compliance

7. **Automation Health Flags**
   - Real-time monitoring of sync/task/alert systems
   - Dashboard health indicators
   - Auto-alert if any system degrades or fails

**⚠️ DO NOT START WF-06/WF-07 WITHOUT READING THIS DOCUMENT**

See: `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md` for complete implementation specs.

---

## 🔴 TEMAS URGENTES - PRIORIDAD CRÍTICA

### 1. ✅ **KORA AVAILABILITY BUG**
**Estado:** ANÁLISIS COMPLETADO - Listo para Claude AI
**Documentación:** `C:\myhost-bizmate\Claude AI and Code Update 22022026\KORA-Availability-Issue-Analysis.md`

**Problema:** KORA reporta baja disponibilidad cuando accede a Supabase vía n8n
**Root Cause:** Función `check_availability` tiene filtro hardcoded:
```sql
WHERE p.address = 'Jl Raya Andong N. 18'  -- ❌ HARDCODED
```

**Solución lista para desplegar:**
- `C:\myhost-bizmate\fix-check-availability-function.sql`
- `C:\myhost-bizmate\CURRENT-BUGGY-FUNCTION.sql` (referencia)

**Próximos pasos (con Claude AI):**
- [ ] Ejecutar fix SQL en Supabase
- [ ] Probar función con test scripts
- [ ] Verificar n8n workflow funciona
- [ ] Probar KORA end-to-end

---

## 🎬 VIDEO FEATURES - NUEVA ARQUITECTURA

### Estado Actual:
- ✅ Video generation básico funcionando (LTX-2 + Remotion Lambda)
- ⚠️ **PENDIENTE:** Nueva arquitectura storage temporal + download
- ⚠️ **PENDIENTE:** Video merge/concatenation con FFmpeg

### 2. **NUEVA ARQUITECTURA VIDEO - STORAGE TEMPORAL**
**Documentación:** `C:\myhost-bizmate\Claude AI and Code Update 20022026\ARQUITECTURA_VIDEO_CLARIFICADA.md`

**Decisión de diseño:**
> Videos se guardan en S3 TEMPORALMENTE (7 días). Owner los descarga a su portátil. Supabase solo guarda metadata (NO URLs).

**Arquitectura:**
```
User genera video
  ↓
S3 almacena TEMPORALMENTE (7 días)
  ↓
Supabase guarda SOLO METADATA (sin URL permanente)
  ↓
User DESCARGA video inmediatamente a su portátil
  ↓
Owner tiene video LOCAL
  ↓
S3 borra video después de 7 días (lifecycle policy)
  ↓
Supabase mantiene REGISTRO de lo que se generó
```

**Tareas:**

#### FASE 1: Implementar Storage Temporal (3-4h)
- [ ] Actualizar schema Supabase:
  - Remover: `video_url`, `thumbnail_url`, `ltx_video_url`
  - Agregar: `downloaded_at`, `expires_at`
  - Agregar campo `status` para tracking

- [ ] Actualizar `video/server.cjs`:
  ```javascript
  // Guardar SOLO metadata (sin URLs)
  await supabase.from('generated_videos').insert([{
    user_id, villa_id, title, subtitle, filename,
    file_size_mb, duration_seconds, resolution,
    camera_prompt, music_file, render_mode,
    status: 'completed',
    created_at: NOW(),
    expires_at: NOW() + INTERVAL '7 days'
    // NO video_url
  }]);

  // Responder con URL TEMPORAL
  res.json({
    videoUrl: videoUrl,  // URL temporal de S3
    expiresIn: '7 days',
    message: 'Download now - deleted in 7 days'
  });
  ```

- [ ] Actualizar `ContentStudio.jsx`:
  ```jsx
  // Download button prominente con warning
  <div className="bg-yellow-50 border-2 border-yellow-400">
    <h3>Download Your Video Now!</h3>
    <p>This video will be deleted in 7 days.</p>
    <button onClick={handleDownload}>
      <Download /> Download Now
    </button>
  </div>
  ```

- [ ] Endpoint para tracking de descarga:
  ```javascript
  // POST /api/videos/:id/downloaded
  app.post('/api/videos/:id/downloaded', async (req, res) => {
    await supabase.from('generated_videos')
      .update({ downloaded_at: NOW() })
      .eq('id', req.params.id);
  });
  ```

- [ ] Configurar S3 Lifecycle Policy:
  ```json
  {
    "Rules": [
      {
        "Id": "DeleteTempVideosAfter7Days",
        "Prefix": "renders/",
        "Expiration": { "Days": 7 }
      },
      {
        "Id": "DeleteTempImagesAfter7Days",
        "Prefix": "images/",
        "Expiration": { "Days": 7 }
      },
      {
        "Id": "DeleteLTXVideosAfter7Days",
        "Prefix": "ltx-videos/",
        "Expiration": { "Days": 7 }
      }
    ]
  }
  ```

**Beneficios:**
- ✅ Owner tiene control total (videos locales)
- ✅ Costos de S3 controlados (~$0.00 vs $100-200 en 3 años)
- ✅ Privacy-friendly (GDPR compliant)
- ✅ No lock-in en la plataforma

---

### 3. **VIDEO MERGE/CONCATENATION CON FFMPEG**
**Documentación:** `C:\myhost-bizmate\Claude AI and Code Update 20022026\FEATURE_VIDEO_MERGE_CONCATENATION.md`

**Objetivo:** Unir 2-5 videos en uno solo con transiciones

**Casos de uso:**
1. Tour virtual de villa (3 videos de habitaciones → 1 video completo)
2. Portfolio de propiedades (video de cada villa → showreel)
3. Video mensual (mejores videos → compilación)

**Decisión técnica:** 2 opciones

#### Opción A: Remotion (RECOMENDADA - Calidad profesional)
**Pros:**
- ✅ Transiciones profesionales (fade, slide, zoom)
- ✅ Títulos animados entre segmentos
- ✅ Control total sobre timing
- ✅ Misma pipeline de render (Lambda)

**Cons:**
- ⚠️ Más complejo de implementar
- ⚠️ Mayor costo de Lambda (videos más largos)

**Implementación:**
```jsx
// video/src/VideoMerge.jsx
export const VideoMerge = ({
  videos,        // Array de videos con URLs
  transition,    // 'fade', 'slide', 'cut', 'zoom'
  showTitles,    // boolean
  musicUrl,      // Background music S3 URL
  musicMode      // 'continuous' o 'per-video'
}) => {
  // Usar @remotion/transitions
  return (
    <TransitionSeries>
      {videos.map(video => (
        <TransitionSeries.Sequence>
          {showTitles && <TitleCard title={video.title} />}
          <RemotionVideo src={video.url} />
        </TransitionSeries.Sequence>
      ))}
    </TransitionSeries>
  );
};
```

#### Opción B: FFmpeg (ALTERNATIVA - Rápida y económica)
**Pros:**
- ✅ Más rápido
- ✅ Menor costo
- ✅ Simple (solo concatenación)

**Cons:**
- ❌ Sin transiciones suaves (corte abrupto)
- ❌ Sin títulos animados
- ❌ Requiere FFmpeg en servidor

**Implementación:**
```javascript
// video/server.cjs
const ffmpeg = require('fluent-ffmpeg');

app.post('/api/merge-videos', async (req, res) => {
  const { videoUrls, outputName } = req.body;

  // Descargar videos de S3
  const localPaths = await downloadVideosFromS3(videoUrls);

  // Crear concat file
  const concatFile = localPaths.map(p => `file '${p}'`).join('\n');
  fs.writeFileSync('concat.txt', concatFile);

  // Merge con FFmpeg
  ffmpeg()
    .input('concat.txt')
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions(['-c copy'])  // Sin re-encode (rápido)
    .output(`merged-${outputName}.mp4`)
    .on('end', async () => {
      // Upload a S3
      const mergedUrl = await uploadToS3(`merged-${outputName}.mp4`);
      res.json({ success: true, videoUrl: mergedUrl });
    })
    .run();
});
```

**Tareas:**
- [ ] Decidir: Remotion (calidad) vs FFmpeg (velocidad)
- [ ] Implementar nueva tab "Merge Videos" en ContentStudio
- [ ] UI para seleccionar videos (checkboxes + reorder)
- [ ] UI para configurar transiciones
- [ ] Backend endpoint `/api/merge-videos`
- [ ] Guardar metadata del merge en Supabase
- [ ] Testing con 2-5 videos

**UI propuesto:**
```
┌────────────────────────────────────────┐
│  ContentStudio                         │
│  [ Create | My Videos | Merge Videos ] │
│                                        │
│  Step 1: Select Videos                 │
│  [x] Villa Pool View  (10s) [↑][↓]    │
│  [x] Villa Bedroom    (10s) [↑][↓]    │
│  [ ] Villa Sunset     (10s)            │
│                                        │
│  Step 2: Transition Style              │
│  ○ Cut  ● Fade  ○ Slide  ○ Zoom       │
│                                        │
│  Step 3: Title Cards (Optional)        │
│  [x] Show title before each video      │
│                                        │
│  Step 4: Music                         │
│  [bali-sunrise.mp3 ▼]                  │
│  ● Continuous  ○ Per video             │
│                                        │
│  [Preview Timeline] [Merge Videos →]   │
└────────────────────────────────────────┘
```

---

## 🔄 CHANNEL SYNC - BOOKING.COM & AIRBNB

### 4. **INTEGRACIÓN CON BOOKING.COM Y AIRBNB**
**Estado:** PENDIENTE - Alta prioridad para Gita
**Prioridad:** 🔴 CRÍTICA (Gita necesita esto)
**Architecture Reinforcement:** `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md` 🔴 **MUST READ**

**⚠️ CRITICAL REQUIREMENTS:**
Before implementing WF-06 and WF-07, **MUST** implement:
1. ✅ Master Calendar as Source of Truth
2. ✅ Advanced Conflict Detection (HARD/SOFT/CHANNEL_MISMATCH)
3. ✅ Extended Bookings Table Schema
4. ✅ Audit Trail System
5. ✅ Automation Health Monitoring

**See:** `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md` for complete specifications.

**Contexto:**
> Gita utiliza Booking.com y Airbnb. Necesito que cuando un cliente confirma un booking en estos canales:
> 1. La información llegue a MY HOST BizMate
> 2. Se actualice la base de datos (tabla bookings)
> 3. Se envíe mensaje de confirmación al huésped
> 4. **VALIDATE against Master Calendar (prevent double bookings)**
> 5. **DETECT and ALERT on conflicts**
> 6. **LOG all operations for audit trail**

**Solución: Workflows n8n (with Architecture Reinforcement)**

#### 4.1. Booking.com → MY HOST BizMate

**Arquitectura:**
```
Booking.com Webhook
  ↓
n8n workflow: "Booking.com Sync"
  ↓
1. Parse webhook data
  ↓
2. Create booking en Supabase
  ↓
3. Send confirmation email (SendGrid)
  ↓
4. Send WhatsApp message (Twilio)
  ↓
5. Update calendar (sync check-in/check-out)
```

**Tareas:**
- [ ] **Obtener credenciales API de Booking.com:**
  - Registrarse en Booking.com Partner Hub
  - Obtener API key y secret
  - Configurar webhook URL

- [ ] **Crear n8n workflow "WF-BOOKING-SYNC":**
  ```javascript
  // Nodos del workflow:
  1. Webhook Trigger (recibe data de Booking.com)
  2. HTTP Request (validar booking con API)
  3. Supabase Insert (crear booking en DB)
  4. SendGrid Email (confirmación al huésped)
  5. Twilio WhatsApp (mensaje al huésped)
  6. Supabase Update (marcar villa como ocupada)
  ```

- [ ] **Configurar webhook en Booking.com:**
  ```
  URL: https://n8n-production-bb2d.up.railway.app/webhook/booking-sync
  Events: reservation.created, reservation.modified, reservation.cancelled
  ```

- [ ] **Mapeo de datos Booking.com → Supabase:**
  ```javascript
  {
    // Booking.com → Supabase bookings
    reservation.id → external_booking_id
    reservation.guest.name → guest_name
    reservation.guest.email → guest_email
    reservation.check_in → check_in
    reservation.check_out → check_out
    reservation.room.id → villa_id (mapear)
    reservation.total_price → total_price
    reservation.currency → currency
    channel: 'booking.com' → channel
    status: 'confirmed' → status
  }
  ```

- [ ] **Testing:**
  - Crear booking de prueba en Booking.com
  - Verificar webhook trigger
  - Confirmar insert en Supabase
  - Validar email enviado
  - Validar WhatsApp enviado

#### 4.2. Airbnb → MY HOST BizMate

**Arquitectura:** Similar a Booking.com

**Tareas:**
- [ ] **Obtener credenciales API de Airbnb:**
  - Registrarse en Airbnb API program
  - OAuth setup
  - Configurar webhook

- [ ] **Crear n8n workflow "WF-AIRBNB-SYNC":**
  - Mismo flujo que Booking.com
  - Mapeo diferente de datos

- [ ] **Mapeo de datos Airbnb → Supabase:**
  ```javascript
  {
    // Airbnb → Supabase bookings
    reservation_code → external_booking_id
    guest.full_name → guest_name
    guest.email → guest_email
    checkin_date → check_in
    checkout_date → check_out
    listing.id → villa_id (mapear)
    pricing.total → total_price
    pricing.currency → currency
    channel: 'airbnb' → channel
    status: 'accepted' → status
  }
  ```

#### 4.3. Tabla `bookings` - Agregar Columnas (EXTENDED)

**Schema actualizado con Architecture Reinforcement:**
```sql
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS
  -- OTA Integration
  external_booking_id TEXT,           -- ID del booking en Booking.com/Airbnb
  external_channel_booking_id TEXT,   -- Código de confirmación del canal
  channel TEXT,                        -- 'booking.com', 'airbnb', 'direct'

  -- Sync Status
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'synced', 'error'
  last_synced_at TIMESTAMPTZ,
  sync_error_message TEXT,

  -- Conflict Detection (NEW - CRITICAL)
  overbooking_risk BOOLEAN DEFAULT false,
  conflict_type TEXT,                 -- 'HARD_CONFLICT', 'SOFT_CONFLICT', 'CHANNEL_MISMATCH', null
  conflict_details JSONB,

  -- Modification Tracking (NEW)
  modification_count INTEGER DEFAULT 0,
  last_modified_by TEXT,              -- 'guest', 'owner', 'system', 'ota'
  modification_history JSONB;
```

**See:** `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md` Section 3 for complete schema.

#### 4.4. Conflict Resolution (Doble Booking)

**Problema:** ¿Qué pasa si mismo periodo está en Booking.com Y Airbnb?

**Solución:**
- [ ] **Check de disponibilidad antes de confirmar:**
  ```javascript
  // En n8n workflow, antes de insert:
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('*')
    .eq('villa_id', villa_id)
    .overlaps('check_in', 'check_out', new_check_in, new_check_out);

  if (conflicts.length > 0) {
    // CONFLICTO DETECTADO
    // Enviar alerta a Gita
    // NO crear booking automáticamente
    // Marcar como 'pending_manual_review'
  }
  ```

- [ ] **Alert workflow:**
  - Email a Gita: "⚠️ Double booking detected"
  - WhatsApp a Gita con detalles
  - Dashboard alert (badge rojo)

#### 4.5. UI en MY HOST BizMate

**Módulo Bookings - Mostrar Canal:**
```jsx
// Bookings.jsx - Añadir columna "Channel"
<td>
  {booking.channel === 'booking.com' && (
    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
      Booking.com
    </span>
  )}
  {booking.channel === 'airbnb' && (
    <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
      Airbnb
    </span>
  )}
  {booking.channel === 'direct' && (
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
      Direct
    </span>
  )}
</td>
```

**Referencia:** Ver ROADMAP_PENDIENTES.md líneas 104-106 (Multichannel/RMSIntegration)

---

## 🏢 ARQUITECTURA MULTITENANT

### 5. **DISEÑO MULTITENANT - ROW LEVEL SECURITY**
**Estado:** Pendiente
**Prioridad:** 🔴 CRÍTICA para escalabilidad

**Contexto actual:**
- Actualmente funciona para 2 usuarios (Jose y Gita)
- Filtrado manual por `tenant_id` en queries
- NO hay RLS habilitado (problemas anteriores)

**Tareas:**

#### 5.1. Crear Tabla `tenants`
```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,  -- 1-to-1 con auth user
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,  -- 'izumi-hotel', 'nismara-villa'
  business_name TEXT,
  contact_email TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'Asia/Jakarta',
  currency TEXT DEFAULT 'USD',
  settings JSONB,  -- {theme, notifications, etc}
  status TEXT DEFAULT 'active',  -- 'active', 'suspended', 'trial'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5.2. Agregar `tenant_id` a TODAS las tablas
```sql
-- Lista de tablas que necesitan tenant_id:
ALTER TABLE properties ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE villas ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE bookings ADD COLUMN tenant_id UUID REFERENCES tenants(id);  -- ✅ Ya existe
ALTER TABLE payments ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE messages ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE generated_videos ADD COLUMN tenant_id UUID REFERENCES tenants(id);  -- Si usamos tabla
ALTER TABLE reviews ADD COLUMN tenant_id UUID REFERENCES tenants(id);  -- Cuando se cree
-- etc.
```

#### 5.3. Migrar Datos Existentes
```sql
-- Identificar tenant_ids actuales
-- Jose: 1f32d384-4018-46a9-a6f9-058217e6924a
-- Gita: c24393db-d318-4d75-8bbf-0fa240b9c1db

-- Crear tenants
INSERT INTO tenants (id, user_id, name, subdomain, currency) VALUES
  ('1f32d384-4018-46a9-a6f9-058217e6924a', '1f32d384-4018-46a9-a6f9-058217e6924a', 'Izumi Hotel', 'izumi-hotel', 'USD'),
  ('c24393db-d318-4d75-8bbf-0fa240b9c1db', 'c24393db-d318-4d75-8bbf-0fa240b9c1db', 'Nismara Uma Villa', 'nismara-villa', 'IDR');

-- Actualizar villas con tenant_id
UPDATE villas SET tenant_id = '1f32d384...' WHERE property_id = '3551cd18...';  -- Jose (5 USD)
UPDATE villas SET tenant_id = 'c24393db...' WHERE property_id = '18711359...';  -- Gita (3 IDR)

-- Actualizar properties
UPDATE properties SET tenant_id = '1f32d384...' WHERE id = '3551cd18...';
UPDATE properties SET tenant_id = 'c24393db...' WHERE id = '18711359...';

-- Bookings ya tiene tenant_id (verificar consistencia)
-- Payments, messages, etc. también necesitan update
```

#### 5.4. Implementar Row Level Security (RLS)
```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Crear policies
CREATE POLICY "Users see own tenant villas"
  ON villas FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users insert own tenant villas"
  ON villas FOR INSERT
  WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Users update own tenant villas"
  ON villas FOR UPDATE
  USING (tenant_id = auth.uid());

-- Repetir para todas las tablas
```

#### 5.5. Routing en Vercel (Subdomains)

**Objetivo:**
```
izumi-hotel.myhost-bizmate.com → Jose's dashboard
nismara-villa.myhost-bizmate.com → Gita's dashboard
demo.myhost-bizmate.com → Demo account
```

**Configuración en Vercel:**
- [ ] Configurar wildcard domain `*.myhost-bizmate.com`
- [ ] Crear middleware para detectar subdomain:

```javascript
// middleware.js
export function middleware(request) {
  const hostname = request.headers.get('host');
  const subdomain = hostname.split('.')[0];

  // Detectar tenant por subdomain
  const url = request.nextUrl.clone();
  url.searchParams.set('subdomain', subdomain);

  return NextResponse.rewrite(url);
}
```

- [ ] En App.jsx, leer subdomain y filtrar:

```javascript
// App.jsx
const searchParams = new URLSearchParams(window.location.search);
const subdomain = searchParams.get('subdomain');

// Fetch tenant por subdomain
const { data: tenant } = await supabase
  .from('tenants')
  .select('*')
  .eq('subdomain', subdomain)
  .single();

// Guardar en contexto
<TenantContext.Provider value={tenant}>
  {children}
</TenantContext.Provider>
```

#### 5.6. User Management por Tenant

**Objetivo:** Jose puede invitar staff (manager, receptionist)

```sql
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT,  -- 'owner', 'manager', 'staff', 'viewer'
  permissions JSONB,  -- {can_create_bookings: true, can_delete: false}
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',  -- 'pending', 'active', 'suspended'

  UNIQUE(tenant_id, user_id)
);
```

**Referencia:** ROADMAP_PENDIENTES.md líneas 205-273

---

## 📊 MÓDULOS SUPABASE PENDIENTES

### 6. **INTEGRACIÓN SUPABASE - MÓDULOS RESTANTES**

**Estado actual:**
- ✅ Properties (completado 21 Feb)
- ✅ Bookings (completado 21 Feb)
- ✅ Payments (completado 20 Dic)
- ✅ Messages (completado 20 Dic)

**Pendientes:**

#### 6.1. PMSCalendar (Media prioridad) + Master Calendar (CRÍTICA)
**⚠️ CRITICAL:** Must implement Master Calendar from Architecture Reinforcement first!

**Two-table approach:**

**Table 1: `calendar_blocks` (MASTER CALENDAR - Source of Truth)**
See: `ARCHITECTURE_REINFORCEMENT_ADDITIONS.md` Section 1
```sql
CREATE TABLE calendar_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  villa_id UUID REFERENCES villas(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  block_type TEXT NOT NULL,  -- 'booking', 'maintenance', 'owner_stay', 'manual_block'
  booking_id UUID REFERENCES bookings(id),
  task_id UUID REFERENCES tasks(id),
  source TEXT,  -- 'direct', 'booking.com', 'airbnb', 'manual'
  channel TEXT,
  notes TEXT,

  -- Prevent overlapping blocks
  CONSTRAINT no_overlap_blocks EXCLUDE USING gist (
    villa_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
);
```

**Table 2: `calendar_events` (UI/Display events)**
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES properties(id),
  villa_id UUID REFERENCES villas(id),
  booking_id UUID REFERENCES bookings(id),
  event_type TEXT,  -- 'check-in', 'check-out', 'cleaning', 'maintenance', 'blocked'
  event_date DATE NOT NULL,
  event_time TIME,
  title TEXT,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),  -- Staff member
  status TEXT DEFAULT 'pending',  -- 'pending', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tareas:**
- [ ] 🔴 CRITICAL: Crear tabla `calendar_blocks` (Master Calendar)
- [ ] 🔴 Implement Source of Truth validation logic
- [ ] Crear tabla `calendar_events` (UI events)
- [ ] Service methods en `data.js`
- [ ] Integrar con PMSCalendar.jsx
- [ ] Sincronizar con bookings (auto-create events)
- [ ] Add conflict detection UI indicators

#### 6.2. Reviews (Media prioridad)
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  booking_id UUID REFERENCES bookings(id),
  villa_id UUID REFERENCES villas(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  rating DECIMAL(2,1),  -- 4.5, 5.0, etc.
  comment TEXT,
  platform TEXT,  -- 'booking.com', 'airbnb', 'google', 'direct'
  external_review_id TEXT,  -- ID en plataforma externa
  review_date TIMESTAMPTZ DEFAULT NOW(),
  response TEXT,  -- Respuesta del owner
  response_date TIMESTAMPTZ,
  status TEXT DEFAULT 'published',  -- 'pending', 'published', 'hidden'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tareas:**
- [ ] Crear tabla `reviews`
- [ ] Service methods
- [ ] Integrar con Reviews.jsx
- [ ] Sistema de respuestas

#### 6.3. GuestPortal (Media prioridad)
```sql
CREATE TABLE guest_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  access_code TEXT UNIQUE,  -- Código único de acceso
  guest_email TEXT NOT NULL,
  expires_at TIMESTAMPTZ,  -- Después del check-out
  last_accessed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tareas:**
- [ ] Crear tabla
- [ ] Generar códigos únicos
- [ ] Guest portal public page
- [ ] Información de check-in, WiFi, recommendations

#### 6.4. DigitalCheckIn (Media prioridad)
```sql
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  guest_name TEXT,
  passport_number TEXT,
  passport_photo_url TEXT,  -- S3 upload
  nationality TEXT,
  arrival_time TIMESTAMPTZ,
  signature_url TEXT,  -- Digital signature
  terms_accepted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',  -- 'pending', 'completed'
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tareas:**
- [ ] Crear tabla
- [ ] Digital check-in form
- [ ] Document upload (S3)
- [ ] Email notification cuando complete

**Referencia:** ROADMAP_PENDIENTES.md líneas 71-107

---

## 🔄 N8N WORKFLOWS ADICIONALES

### 7. **WORKFLOWS N8N PENDIENTES DE INTEGRACIÓN**

**Estado actual:**
- ✅ 7 workflows integrados (Properties, Bookings, WhatsApp)
- ⏳ Más workflows disponibles pero no integrados

**Workflows pendientes:**

#### 7.1. Extraer Datos Facturas PDF - Izumi Hotel
**Objetivo:** Automatizar extracción de datos de facturas

**Tareas:**
- [ ] Workflow para procesar PDFs
- [ ] OCR con Tesseract o Google Vision API
- [ ] Parse de datos (importe, fecha, proveedor)
- [ ] Insert en tabla `expenses` (crear tabla)

#### 7.2. Staff Notification - New Booking
**Objetivo:** Notificar a staff cuando hay nuevo booking

**Tareas:**
- [ ] Trigger en `onBookingCreated()`
- [ ] Enviar email a staff
- [ ] Enviar WhatsApp a cleaning team
- [ ] Crear task en calendar_events

#### 7.3. VAPI Izumi Hotel (requiere VAPI integration)
Ver sección [VAPI Integration](#vapi-integration)

#### 7.4. Recomendaciones AI
**Objetivo:** Generar recomendaciones personalizadas para huéspedes

**Tareas:**
- [ ] Workflow con OpenAI/Claude
- [ ] Input: guest preferences, booking dates
- [ ] Output: Restaurantes, tours, activities
- [ ] Enviar por WhatsApp/Email

**Referencia:** ROADMAP_PENDIENTES.md líneas 126-175

---

## 🎙️ VAPI INTEGRATION

### 8. **VAPI - VOICE AI ASSISTANT**
**Estado:** Módulo VoiceAI existe pero sin integración real
**Prioridad:** 🟡 Media-Alta

**Problema actual:** KORA tiene baja availability (ver tema #1)

**Tareas:**

#### 8.1. Setup VAPI Account
- [ ] Crear cuenta en Vapi.ai
- [ ] Obtener API key
- [ ] Configurar asistente en VAPI dashboard

#### 8.2. Integrar VAPI Web SDK
```javascript
// VoiceAI.jsx
import Vapi from "@vapi-ai/web";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

const startCall = () => {
  vapi.start({
    name: "Izumi Hotel Assistant",
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "You are a helpful hotel assistant for Izumi Hotel..."
      }]
    },
    voice: {
      provider: "11labs",
      voiceId: "..."
    },
    functions: [
      {
        name: "check_availability",
        description: "Check villa availability",
        parameters: {
          check_in: "YYYY-MM-DD",
          check_out: "YYYY-MM-DD"
        }
      },
      {
        name: "create_booking",
        description: "Create a new booking",
        parameters: {...}
      }
    ]
  });
};
```

#### 8.3. Integrar con n8n Workflow
- [ ] VAPI llama a n8n tool `check_availability`
- [ ] n8n ejecuta Supabase RPC (después de fix)
- [ ] n8n devuelve resultados a VAPI
- [ ] VAPI responde al huésped por voz

#### 8.4. Testing
- [ ] Probar reconocimiento de voz (Español/Inglés)
- [ ] Verificar funciones ejecutan correctamente
- [ ] Optimizar prompts para mejor UX

**Referencia:** ROADMAP_PENDIENTES.md líneas 177-201

---

## 🔒 TESTING & SEGURIDAD

### 9. **TESTING & QUALITY ASSURANCE**
**Estado:** Pendiente
**Prioridad:** 🔴 Alta

**Tareas:**

#### 9.1. Unit Tests (Vitest)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

- [ ] Tests para `data.js` (all service methods)
- [ ] Tests para componentes (Properties, Bookings)
- [ ] Tests para utils (formatPrice, formatDate)
- [ ] Coverage > 70%

#### 9.2. Integration Tests
- [ ] Test Supabase queries
- [ ] Test n8n webhook triggers
- [ ] Test VAPI functions

#### 9.3. E2E Tests (Playwright)
```bash
npm install -D @playwright/test
```

- [ ] Test flujo completo: Login → Create Booking → Email sent
- [ ] Test multitenant: Jose ve sus villas, Gita ve las suyas
- [ ] Test video generation end-to-end

#### 9.4. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run build
      # Auto-deploy a Vercel
```

**Referencia:** ROADMAP_PENDIENTES.md líneas 330-341

---

### 10. **SEGURIDAD**
**Estado:** Pendiente
**Prioridad:** 🔴 Alta

**Tareas:**

#### 10.1. Security Headers en Vercel
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" }
      ]
    }
  ]
}
```

#### 10.2. Rate Limiting
- [ ] Limitar requests a `/api/generate-video` (1 por minuto)
- [ ] Limitar login attempts (5 intentos → block 15 min)
- [ ] Implementar con middleware

#### 10.3. Input Validation
- [ ] Validar todos los forms con Zod o Yup
- [ ] Sanitizar inputs antes de queries
- [ ] Prevenir SQL injection (Supabase ya protege, pero verificar)

#### 10.4. Security Audit
```bash
npm audit
npm audit fix
```

- [ ] Actualizar dependencias vulnerables
- [ ] Penetration testing
- [ ] OWASP Top 10 checklist

**Referencia:** ROADMAP_PENDIENTES.md líneas 379-403

---

## 📝 OTROS TEMAS

### 11. **PERFORMANCE OPTIMIZATION**
**Prioridad:** 🟡 Media

- [ ] Code splitting por rutas
- [ ] Image optimization (lazy loading, WebP)
- [ ] Bundle size analysis
- [ ] Memoización de componentes (React.memo)
- [ ] Virtualización para listas largas

### 12. **MONITOREO & ANALYTICS**
**Prioridad:** 🟡 Media

- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Performance monitoring (Web Vitals)
- [ ] Uptime monitoring (UptimeRobot)

### 13. **DOCUMENTACIÓN TÉCNICA**
**Prioridad:** 🟡 Media

- [ ] README.md completo
- [ ] API documentation
- [ ] Architecture Decision Records (ADR)
- [ ] Deployment guide

### 14. **DEVOPS & CI/CD**
**Prioridad:** 🟡 Media

- [ ] GitHub Actions para CI/CD
- [ ] Staging environment
- [ ] Database migrations automation
- [ ] Backup strategy para Supabase

### 15. **INTERNACIONALIZACIÓN (i18n)**
**Prioridad:** 🟢 Baja

- [ ] Soporte multi-idioma (Español/Inglés)
- [ ] react-i18next
- [ ] Detección automática de idioma

### 16. **PWA**
**Prioridad:** 🟢 Baja

- [ ] Service Worker
- [ ] Offline functionality
- [ ] Add to Home Screen
- [ ] Push notifications

---

## 📊 RESUMEN PRIORIDADES

### 🔴 URGENTE - HACER PRIMERO (Próximas 2 semanas)
1. ✅ KORA Availability Bug (desplegar fix con Claude AI)
2. Channel Sync - Booking.com & Airbnb integration
3. Nueva Arquitectura Video - Storage temporal
4. Arquitectura Multitenant - RLS y tenant_id
5. Testing básico (unit tests coverage > 50%)
6. Seguridad (headers, rate limiting, validation)

### 🟡 IMPORTANTE - HACER DESPUÉS (Próximas 4 semanas)
7. Video Merge/Concatenation (elegir Remotion vs FFmpeg)
8. VAPI Integration (después de fix availability)
9. Módulos Supabase restantes (PMSCalendar, Reviews, GuestPortal, DigitalCheckIn)
10. n8n workflows adicionales
11. Performance optimization
12. Monitoreo & Analytics

### 🟢 BACKLOG - FUTURO (Próximos 2-3 meses)
13. Documentación técnica completa
14. DevOps avanzado (staging, migrations)
15. i18n (multi-idioma)
16. PWA features

---

## 🎯 MÉTRICAS DE ÉXITO PARA MVP

**Para considerar MVP listo:**
- [ ] KORA availability funcionando al 100%
- [ ] Channel sync con Booking.com y Airbnb activo
- [ ] Videos: storage temporal implementado
- [ ] Videos: merge/concatenation funcional
- [ ] Multitenant funcionando (2+ tenants con RLS)
- [ ] Test coverage > 60%
- [ ] 0 security vulnerabilities críticas
- [ ] 5+ workflows n8n integrados ✅ (actualmente 7)
- [ ] Performance: LCP < 2.5s, FID < 100ms
- [ ] Uptime > 99.5%

---

## 📁 DOCUMENTOS DE REFERENCIA

### Sesión 22 Feb 2026:
- `KORA-Availability-Issue-Analysis.md` - Análisis completo bug KORA
- `CURRENT-BUGGY-FUNCTION.sql` - Función con bug
- `TEMAS-PENDIENTES-RESUMEN.md` - Resumen ejecutivo
- `ROADMAP_COMPLETO_ACTUALIZADO_22FEB2026.md` - Este documento

### Sesión 21 Feb 2026:
- `RESUMEN_EJECUTIVO_21FEB2026.md` - Corrección Properties/Villas
- `TECHNICAL_DEEP_DIVE_21FEB2026.md` - Deep dive técnico
- `PROTOCOLO_OBLIGATORIO_COMMIT_PUSH_V2.md` - Protocolo commit

### Sesión 20 Feb 2026:
- `ARQUITECTURA_VIDEO_CLARIFICADA.md` - Storage temporal video
- `FEATURE_VIDEO_MERGE_CONCATENATION.md` - Merge videos feature
- `TAREAS_PENDIENTES_20FEB2026.md` - Tareas pendientes

### Roadmap General:
- `MYHOST Bizmate_Documentos_Estrategicos 2025_2026\ROADMAP_PENDIENTES.md`
- `MYHOST Bizmate_Documentos_Estrategicos 2025_2026\ROADMAP_V1_18FEB_18APR_2026.md`

---

**Última actualización:** 22 Febrero 2026
**Generado por:** Claude Code
**Versión:** 3.0 (Consolidado completo)

---

*Este documento consolida TODOS los temas pendientes incluyendo: KORA bug, nueva arquitectura video, video merge/FFmpeg, channel sync (Booking.com/Airbnb), multitenant, módulos Supabase, n8n workflows, VAPI, testing, seguridad y más.*
