# BRIEF: Landing Page Izumi Hotel + Formulario de Leads
**Para:** Claude Code
**Proyecto:** MY HOST BizMate
**Fecha:** 24 Enero 2026

---

## OBJETIVO

Crear una landing page para **Izumi Hotel** (boutique hotel en Ubud, Bali) con un formulario de contacto que envíe leads al sistema de automatización.

---

## CONTEXTO TÉCNICO

### Stack del proyecto
- **Frontend:** [A DEFINIR - puede ser Next.js, React, o static HTML]
- **Backend:** n8n (workflows) + Supabase (base de datos)
- **Hosting:** [A DEFINIR - Vercel, Netlify, Railway]

### Webhook de destino
```
POST https://n8n-production-bb2d.up.railway.app/webhook/inbound-lead-v3

Content-Type: application/json

Body (Master Event v1.0):
{
  "schema_version": "1.0",
  "source": "web",
  "event_type": "lead_created",
  "tenant": {
    "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2"
  },
  "contact": {
    "name": "[nombre del formulario]",
    "phone": "[teléfono del formulario]",
    "email": "[email del formulario]"
  },
  "message": {
    "text": "[mensaje o interés del formulario]",
    "channel": "web"
  },
  "booking_interest": {
    "check_in": "[fecha si la proporcionó]",
    "check_out": "[fecha si la proporcionó]",
    "guests": [número si lo proporcionó]
  },
  "utm": {
    "source": "[utm_source de URL]",
    "medium": "[utm_medium de URL]",
    "campaign": "[utm_campaign de URL]"
  }
}
```

---

## REQUISITOS DE LA LANDING PAGE

### 1. Diseño
- **Estilo:** Luxury boutique hotel, minimalista, tropical
- **Colores:** Tonos tierra, verdes, blancos
- **Fotos:** Necesitaré proporcionarlas o usar placeholders de Unsplash
- **Mobile-first:** Responsive obligatorio

### 2. Secciones sugeridas
```
1. HERO
   - Imagen/video de la villa
   - Headline: "Your Private Paradise in Ubud"
   - CTA: "Check Availability" (scroll a formulario)

2. ABOUT
   - Breve descripción de Izumi
   - Ubicación (Ubud, Bali)
   - 7 villas privadas

3. VILLAS
   - Grid o carousel con las villas
   - Nombre, capacidad, precio desde
   - Fotos

4. AMENITIES
   - Private pool
   - Breakfast included
   - Rice field views
   - Etc.

5. REVIEWS/TESTIMONIALS
   - Citas de huéspedes anteriores

6. FORMULARIO DE CONTACTO ← CRÍTICO
   - Campos obligatorios: Nombre, Email, Teléfono
   - Campos opcionales: Fechas, Nº huéspedes, Mensaje
   - Submit → Webhook n8n
   - Mensaje de confirmación

7. FOOTER
   - Ubicación
   - Contacto directo (WhatsApp a BANYU)
   - Redes sociales
```

### 3. Formulario de contacto (DETALLE)
```
CAMPOS:
┌─────────────────────────────────────────┐
│ Full Name *            [____________]   │
│ Email *                [____________]   │
│ Phone (WhatsApp) *     [____________]   │
│ Check-in date          [  📅  ]         │
│ Check-out date         [  📅  ]         │
│ Number of guests       [ 2 ▼ ]          │
│ Message                [____________]   │
│                        [____________]   │
│                                         │
│         [ Send Inquiry ]                │
└─────────────────────────────────────────┘

VALIDACIONES:
- Email: formato válido
- Phone: permitir formato internacional (+62, +34, etc.)
- Fechas: check_out > check_in

ON SUBMIT:
1. Mostrar spinner/loading
2. POST al webhook de n8n
3. Si éxito: Mostrar mensaje "Thank you! We'll contact you within 2 hours"
4. Si error: Mostrar mensaje genérico + opción de WhatsApp directo

TRACKING UTM:
- Leer de URL: ?utm_source=xxx&utm_medium=xxx&utm_campaign=xxx
- Incluir en el payload del webhook
```

### 4. Integración WhatsApp directo
```
Botón flotante o en sección de contacto:
"Chat with us on WhatsApp"
→ https://wa.me/6281325764867?text=Hi!%20I'm%20interested%20in%20Izumi%20Hotel

Este es el número de BANYU: +62 813 2576 4867
```

### 5. SEO básico
```
- Title: Izumi Hotel Ubud | Private Villas with Pool in Bali
- Meta description
- Open Graph tags para compartir
- Schema markup (LocalBusiness + Hotel)
```

---

## ENTREGABLES ESPERADOS

1. **Código fuente** de la landing page
2. **Instrucciones de despliegue**
3. **Variables de entorno** necesarias (webhook URL, etc.)
4. **README** con cómo modificar contenido

---

## INFORMACIÓN DE IZUMI HOTEL (para contenido)

```
Nombre: Izumi Hotel
Ubicación: Ubud, Bali, Indonesia
Tipo: Boutique hotel / Private villas
Villas: 7 villas privadas

Características:
- Private pool en cada villa
- Vistas a arrozales
- Desayuno incluido
- A 10 minutos del centro de Ubud
- WiFi gratuito
- Servicio de transfer aeropuerto

Precio desde: ~$150/noche (aproximado)

Contacto:
- WhatsApp: +62 813 2576 4867
- (Sin email público por ahora)
```

---

## PASOS SUGERIDOS PARA CLAUDE CODE

```
1. Preguntar qué framework/stack prefieres (Next.js, Astro, HTML puro)
2. Crear estructura del proyecto
3. Implementar diseño responsive
4. Crear formulario con validación
5. Implementar envío al webhook
6. Añadir tracking UTM
7. Probar localmente
8. Instrucciones de deploy
```

---

## PRUEBA DE INTEGRACIÓN

Una vez desplegada, probar:

1. Abrir landing page
2. Llenar formulario con datos de prueba
3. Submit
4. Verificar en Supabase:
   ```sql
   SELECT * FROM leads 
   WHERE channel = 'web' 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
5. Verificar que next_followup_at = created_at + 2h
6. El lead debe entrar en secuencia de WF-04 Follow-Up Engine

---

## NOTAS ADICIONALES

- El webhook de n8n (WF-SP-01) puede estar INACTIVO. Verificar antes de probar.
- Si el webhook no responde, la landing debe mostrar fallback a WhatsApp.
- Considerar añadir Google Analytics / Meta Pixel para tracking de conversiones.
