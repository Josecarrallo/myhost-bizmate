# NISMARA UMA VILLA - INTEGRACIÓN LANDING PAGE
## Feedback del Owner + Plan de Mejoras

**Fecha:** 29 Enero 2026
**URL actual:** https://nismarauma.lovable.app/
**Cliente:** Nismara Uma Villa (Primer cliente piloto)
**Estado:** ✅ Owner alucinado - quieren usarla

---

## 📧 FEEDBACK DEL OWNER

### Quote original:
> "I have reviewed all the website details. Below are some perspectives from my side on areas we could improve:
>
> 1. The Check-in and Check-out date buttons are still not editable.
> 2. It would be better if the phone number is linked to WhatsApp instead of direct calls, as guests usually prefer to start communication via chat first.
> 3. The menu can be further improved, for example by adding an Experience section that highlights the surrounding area, such as jogging tracks, nearby points of interest, and others.
> 4. The photo gallery could be presented in more detail. I will prepare proper images first.
>
> Overall, everything looks good, Pak"

---

## 🎯 MEJORAS SOLICITADAS (PRIORIDAD)

### 🔴 CRÍTICO (Para que funcione como booking engine)

#### 1. **Check-in / Check-out dates editables**
**Problema actual:** Botones de fecha no son editables

**Solución:**
```jsx
// Componente PublicSite.jsx o BookingForm
import { DatePicker } from '@/components/ui/date-picker';

const [checkIn, setCheckIn] = useState(null);
const [checkOut, setCheckOut] = useState(null);

<DatePicker
  selected={checkIn}
  onChange={(date) => setCheckIn(date)}
  minDate={new Date()}
  placeholderText="Check-in date"
  dateFormat="dd/MM/yyyy"
/>

<DatePicker
  selected={checkOut}
  onChange={(date) => setCheckOut(date)}
  minDate={checkIn || new Date()}
  placeholderText="Check-out date"
  dateFormat="dd/MM/yyyy"
/>
```

**Archivo a modificar:**
- `src/components/PublicSite/PublicSite.jsx`
- Integrar `react-datepicker` o shadcn/ui Calendar

**Estimación:** 1-2 horas

---

#### 2. **Phone number → WhatsApp link (NO direct call)**
**Problema actual:** Click en teléfono hace llamada directa

**Solución:**
```jsx
// ANTES (direct call):
<a href="tel:+6281234567890">+62 812 3456 7890</a>

// DESPUÉS (WhatsApp):
<a
  href="https://wa.me/6281234567890?text=Hi%2C%20I%27m%20interested%20in%20booking%20Nismara%20Uma%20Villa"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 hover:text-orange-500"
>
  <MessageCircle className="w-5 h-5" />
  WhatsApp: +62 812 3456 7890
</a>
```

**Archivo a modificar:**
- `src/components/PublicSite/PublicSite.jsx`
- Sección Contact / CTA buttons

**Estimación:** 30 min

---

### 🟡 ALTA (Mejoras de contenido)

#### 3. **Experience section - Alrededores / POI**
**Solicitud:** Añadir sección Experience con:
- Jogging tracks
- Points of interest cercanos
- Actividades en el área

**Solución:**
```jsx
// Nueva sección en PublicSite.jsx
<section id="experience" className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">
      Explore the Area
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Jogging Track */}
      <div className="text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-500" />
        <h3 className="font-semibold mb-2">Jogging Track</h3>
        <p className="text-gray-600">
          Scenic 2km track through rice fields, 5 min walk
        </p>
      </div>

      {/* Sacred Monkey Forest */}
      <div className="text-center">
        <Compass className="w-12 h-12 mx-auto mb-4 text-orange-500" />
        <h3 className="font-semibold mb-2">Sacred Monkey Forest</h3>
        <p className="text-gray-600">
          10 minutes by scooter, must-visit cultural site
        </p>
      </div>

      {/* Tegallalang Rice Terraces */}
      <div className="text-center">
        <Palmtree className="w-12 h-12 mx-auto mb-4 text-orange-500" />
        <h3 className="font-semibold mb-2">Tegallalang Rice Terraces</h3>
        <p className="text-gray-600">
          15 minutes drive, iconic Instagram spot
        </p>
      </div>
    </div>
  </div>
</section>
```

**Datos a solicitar del owner:**
- Lista de POI con distancias
- Actividades recomendadas
- Fotos del área (si tiene)

**Archivo a modificar:**
- `src/components/PublicSite/PublicSite.jsx`
- Añadir nueva sección antes de Contact

**Estimación:** 2-3 horas

---

#### 4. **Photo gallery mejorada**
**Solicitud:** Galería más detallada (owner va a preparar fotos propias)

**Solución:**
```jsx
// Galería mejorada con lightbox
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const [lightboxOpen, setLightboxOpen] = useState(false);
const [photoIndex, setPhotoIndex] = useState(0);

const galleryImages = [
  { src: '/images/nismara/villa-exterior.jpg', caption: 'Villa Exterior' },
  { src: '/images/nismara/bedroom.jpg', caption: 'Master Bedroom' },
  { src: '/images/nismara/pool.jpg', caption: 'Private Pool' },
  { src: '/images/nismara/living-room.jpg', caption: 'Living Area' },
  { src: '/images/nismara/bathroom.jpg', caption: 'Bathroom' },
  { src: '/images/nismara/kitchen.jpg', caption: 'Kitchen' },
  { src: '/images/nismara/garden.jpg', caption: 'Garden View' },
  { src: '/images/nismara/sunset.jpg', caption: 'Sunset from Villa' },
];

<section id="gallery" className="py-16 bg-gray-50">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Gallery</h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {galleryImages.map((image, index) => (
        <div
          key={index}
          className="relative cursor-pointer overflow-hidden rounded-lg aspect-square"
          onClick={() => {
            setPhotoIndex(index);
            setLightboxOpen(true);
          }}
        >
          <img
            src={image.src}
            alt={image.caption}
            className="w-full h-full object-cover hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity" />
        </div>
      ))}
    </div>
  </div>

  {lightboxOpen && (
    <Lightbox
      mainSrc={galleryImages[photoIndex].src}
      nextSrc={galleryImages[(photoIndex + 1) % galleryImages.length].src}
      prevSrc={galleryImages[(photoIndex + galleryImages.length - 1) % galleryImages.length].src}
      onCloseRequest={() => setLightboxOpen(false)}
      onMovePrevRequest={() => setPhotoIndex((photoIndex + galleryImages.length - 1) % galleryImages.length)}
      onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % galleryImages.length)}
      imageCaption={galleryImages[photoIndex].caption}
    />
  )}
</section>
```

**Pendiente del owner:**
- Envío de fotos profesionales
- Captions para cada foto

**Archivo a modificar:**
- `src/components/PublicSite/PublicSite.jsx`
- Instalar: `npm install react-image-lightbox`

**Estimación:** 2-3 horas

---

## 🔗 INTEGRACIÓN CON MYHOST BIZMATE

### Módulo MY WEB (Ya existe)

**Estado actual:**
- ✅ Wizard de 5 pasos implementado (Diciembre 2025)
- ✅ 5 temas visuales disponibles
- ✅ `PublicSite.jsx` component
- ✅ React Router (`/site/:slug`)
- ✅ Service layer con localStorage

**Archivos relevantes:**
```
src/components/MySite/MySite.jsx        - Wizard creación
src/components/PublicSite/PublicSite.jsx - Landing page
src/services/mySiteService.js           - Persistencia
```

---

### Plan de integración Nismara Uma:

#### **PASO 1: Clonar landing actual**
```bash
# Copiar diseño de nismarauma.lovable.app
# Integrar en PublicSite.jsx como nuevo theme "Nismara"
```

#### **PASO 2: Aplicar mejoras solicitadas**
```
1. DatePicker editable ✅
2. WhatsApp links ✅
3. Experience section ✅
4. Gallery mejorada ✅
```

#### **PASO 3: Migrar a MYHOST Bizmate**
```javascript
// Crear site en Supabase
INSERT INTO sites (
  tenant_id,
  property_id,
  slug,
  name,
  theme,
  content,
  published,
  custom_domain
) VALUES (
  'c24393db-d318-4d75-8bbf-0fa240b9c1db',
  '18711359-1378-4d12-9ea6-fb31c0b1bac2',
  'nismarauma',
  'Nismara Uma Villa',
  'nismara-luxury',
  '{...}',  -- JSON con content
  true,
  'nismarauma.com'  -- Cuando tengan dominio propio
);

// URL resultante:
https://my-host-bizmate.vercel.app/site/nismarauma
```

#### **PASO 4: Conectar booking con AUTOPILOT**
```javascript
// Cuando guest completa booking form en landing:
const handleBookingSubmit = async (formData) => {
  // 1. Crear lead en Supabase
  const lead = await supabaseService.createLead({
    tenant_id: 'c24393db...',
    property_id: '18711359...',
    source: 'web',
    guest_name: formData.name,
    guest_email: formData.email,
    guest_phone: formData.phone,
    check_in: formData.checkIn,
    check_out: formData.checkOut,
    guests: formData.guests,
    message: formData.message,
  });

  // 2. Trigger WF-03 Lead Handler (webhook)
  await fetch('https://n8n-production-bb2d.up.railway.app/webhook/lead/web', {
    method: 'POST',
    body: JSON.stringify({
      lead_id: lead.id,
      source: 'web',
      ...formData,
    }),
  });

  // 3. LUMINA analiza → Follow-Up → BANYU responde por WhatsApp
  // (automático después del webhook)
};
```

---

## 📋 PLAN DE TRABAJO

### 🔴 FASE 1: Mejoras Críticas (2-3 horas)
**Para que Nismara Uma pueda empezar a recibir bookings:**
1. ✅ DatePicker editable (1-2h)
2. ✅ WhatsApp links en vez de llamadas (30 min)

### 🟡 FASE 2: Mejoras de Contenido (4-6 horas)
**Para mejor experiencia del guest:**
3. ✅ Experience section con POI (2-3h)
4. ✅ Gallery mejorada con lightbox (2-3h)

### 🟢 FASE 3: Integración MYHOST Bizmate (3-4 horas)
**Para tener Nismara Uma en la plataforma:**
5. Migrar de Lovable.app a MYHOST Bizmate
6. Crear tabla `sites` en Supabase
7. Conectar booking form con WF-03 Lead Handler
8. Testing end-to-end (web → lead → LUMINA → BANYU)

**TOTAL: 9-13 horas**

---

## 🎯 PRIORIDADES SEGÚN PRESENTACIÓN MAÑANA

### Para la presentación mañana tarde:

**OPCIÓN A (Solo AUTOPILOT + OSIRIS):**
- No tocar landing page todavía
- Focus 100% en OSIRIS Dashboard funcionando
- Mencionar landing page como "caso de éxito real"

**OPCIÓN B (AUTOPILOT + Landing preview):**
- OSIRIS Dashboard (prioridad #1)
- Mostrar https://nismarauma.lovable.app/ como ejemplo
- Explicar plan de mejoras y roadmap

**Recomendación:** **OPCIÓN A**
- Mañana = OSIRIS perfecto
- Landing page mejoras = después de presentación
- No mezclar demasiadas cosas en una demo

---

## 📧 RESPUESTA SUGERIDA AL OWNER

**Para enviar a Nismara Uma:**

> Hi!
>
> Thank you for the detailed feedback! I'm glad you like the overall design.
>
> Your points are very clear:
>
> 1. ✅ **Editable dates** - We'll implement a date picker so guests can select their check-in/check-out dates easily
> 2. ✅ **WhatsApp instead of direct call** - Great point! We'll change all phone links to open WhatsApp directly
> 3. ✅ **Experience section** - Love this idea! Please send me a list of nearby points of interest (jogging tracks, attractions, restaurants) with approximate distances, and we'll create a beautiful section
> 4. ✅ **Photo gallery** - Once you have the proper images ready, we'll upgrade the gallery to showcase them in full detail
>
> **Timeline:**
> - Critical improvements (dates + WhatsApp): 2-3 days
> - Experience section + Gallery: 1 week (once you send the content)
>
> We're also integrating your landing page with the MY HOST BizMate platform so bookings flow automatically into AUTOPILOT. This means when a guest books through your website, the system will:
> 1. Capture the lead automatically
> 2. Send immediate confirmation via WhatsApp
> 3. Manage follow-ups and payment reminders
> 4. Show everything in your OSIRIS dashboard
>
> Looking forward to working together!
>
> Regards,
> Jose

---

## 🗂️ ARCHIVOS DE REFERENCIA

**Documentos ya creados:**
- `NISMARA_UMA_VILLA_REFERENCE.md` - Referencia inicial landing page
- `NISMARA_UMA_ONBOARDING_PLAN.md` - Plan onboarding cliente

**Nuevo documento:**
- `NISMARA_UMA_INTEGRACION_LANDING_PAGE.md` - Este documento

---

## ✅ CHECKLIST COMPLETO

### Landing Page Mejoras:
- [ ] DatePicker editable (check-in/check-out)
- [ ] WhatsApp links (no direct call)
- [ ] Experience section (POI, jogging tracks)
- [ ] Gallery mejorada (lightbox)
- [ ] Owner envía fotos profesionales
- [ ] Owner envía lista POI del área

### Integración MYHOST Bizmate:
- [ ] Tabla `sites` creada en Supabase
- [ ] Nismara Uma site migrado a plataforma
- [ ] Booking form conectado con WF-03
- [ ] Testing: web → lead → LUMINA → BANYU → WhatsApp
- [ ] URL custom domain (nismarauma.com) configurado

### Testing:
- [ ] Guest puede seleccionar fechas
- [ ] Guest puede enviar booking request
- [ ] Lead se crea en Supabase
- [ ] LUMINA analiza el lead
- [ ] BANYU responde por WhatsApp
- [ ] Owner ve el lead en OSIRIS Dashboard

---

*Documento generado: 29 Enero 2026*
*Feedback del owner incorporado*
*Plan de mejoras e integración definido*
