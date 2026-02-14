# 🎯 PLAN MAESTRO ACTUALIZADO - MY HOST BIZMATE
**Fecha:** 29 Diciembre 2025 | **Versión:** 3.0 (Prioridades Ajustadas)
**Estado Actual:** Voice AI ✅ | Marketing & Growth Phase 1 ✅ | MCP Architecture ✅
**Progreso:** ~35% completado
**Siguiente Fase:** Marketing & Growth Module + Create My Website (NUEVAS PRIORIDADES)

---

## 🚨 NUEVAS PRIORIDADES CRÍTICAS (29 DIC 2025)

### JUSTIFICACIÓN DEL CAMBIO
**Contexto de negocio:**
- Propietarios en Bali necesitan ver funcionalidad DEMO inmediatamente
- Marketing (Instagram/Meta Ads) es crítico para captación
- Public website es requisito mínimo para mostrar propiedades
- Sin estos dos módulos, no hay producto vendible

**Decisión estratégica:**
- Pausar multi-tenant infrastructure (puede hacerse después)
- Priorizar features visibles y demos funcionales
- Implementar Marketing + Public Sites PRIMERO
- Volver a infraestructura después del MVP visible

---

## 📊 NUEVO ORDEN DE PRIORIDADES

```
┌─────────────────────────────────────────────────────────────────┐
│  🔴 FASE 0: MVP DEMO FEATURES (NUEVO - 40-60h | 8-12 días)     │
│  → Marketing & Growth Module (UI + Backend)                     │
│  → Create My Website (Public Sites con Subdominios)            │
│  → Voice Assistant (YA COMPLETADO ✅)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  🔴 FASE 1: INFRAESTRUCTURA BASE (25-35h | 5-7 días)           │
│  → Multi-Tenant Architecture                                    │
│  → Supabase RLS & Schema Updates                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  🔴 FASE 2: INTEGRACIONES CRÍTICAS (55-80h | 11-16 días)       │
│  → Stripe Payments Integration                                  │
│  → DOMUS Channel Manager API                                    │
│  → Meta Ads OAuth (Real Integration)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  🟡 FASE 3: WORKFLOWS PENDIENTES (30-45h | 6-9 días)           │
│  → WhatsApp Concierge                                           │
│  → Marketing Automation Workflows                               │
│  → Content & Campaign Workflows                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  🟢 FASE 4: POLISH & OPTIMIZACIÓN (15-25h | 3-5 días)         │
│  → Dashboard Widgets                                            │
│  → Performance Optimization                                     │
│  → Testing & Bug Fixes                                          │
└─────────────────────────────────────────────────────────────────┘
```

**TOTAL REVISADO:** 165-245 horas | 33-49 días laborables | 7-10 semanas

---

# 🔴 FASE 0: MVP DEMO FEATURES (NUEVO)
**Prioridad:** CRÍTICA - DEMO BLOCKER
**Duración:** 40-60 horas | 8-12 días
**Objetivo:** Tener módulos visibles y funcionales para demostrar a propietarios

---

## 0.1 Marketing & Growth Module 🎯

### Contexto de Negocio
**Por qué es crítico:**
- Propietarios en Bali viven de Instagram y Meta Ads
- Sin esta funcionalidad, el producto no es relevante para ellos
- Debe estar presente en DEMO inicial

### Tarea 0.1.1: UI Setup - Left Menu + Routing
**Descripción:** Agregar sección "Marketing & Growth" al sidebar
**Complejidad:** 🟢 Baja
**Tiempo:** 2-3 horas

**Checklist:**
- [ ] Actualizar `Sidebar.jsx` con nueva sección "Marketing & Growth"
- [ ] Agregar 6 sub-items:
  - Overview
  - Meta Ads (Instagram/Facebook)
  - Content Planner
  - Creative Studio (Coming Soon)
  - Reviews & Reputation
  - Insights
- [ ] Crear archivos de componentes vacíos
- [ ] Configurar routing en `App.jsx`
- [ ] Aplicar estilo consistente (orange/white brand)

**Entregables:**
- `src/components/Layout/Sidebar.jsx` (modificado)
- `src/components/Marketing/MarketingOverview.jsx` (nuevo)
- `src/components/Marketing/MetaAds.jsx` (nuevo)
- `src/components/Marketing/ContentPlanner.jsx` (nuevo)
- `src/components/Marketing/Reviews.jsx` (nuevo)
- `src/components/Marketing/Insights.jsx` (nuevo)

---

### Tarea 0.1.2: Database Schema - Marketing Tables
**Descripción:** Crear tablas Supabase para almacenar datos de marketing
**Complejidad:** 🟡 Media
**Tiempo:** 3-4 horas

**Tablas a crear:**

```sql
-- Conexiones a plataformas (Meta, Google, etc.)
CREATE TABLE marketing_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id), -- Agregar después de multi-tenant
  provider TEXT NOT NULL CHECK (provider IN ('meta', 'google', 'tiktok')),
  status TEXT NOT NULL CHECK (status IN ('connected', 'disconnected', 'error')),
  account_name TEXT,
  account_id TEXT,
  access_token_encrypted TEXT, -- Encriptado
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campañas publicitarias
CREATE TABLE marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES properties(id),
  name TEXT NOT NULL,
  objective TEXT NOT NULL CHECK (objective IN ('leads', 'whatsapp_messages', 'website_visits', 'bookings')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok')),
  daily_budget DECIMAL(10,2),
  total_spend_mtd DECIMAL(10,2) DEFAULT 0,
  leads_count INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2), -- Click-through rate
  payload_json JSONB, -- Configuración completa de la campaña
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publicaciones programadas (Content Planner)
CREATE TABLE marketing_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES properties(id),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'all')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  caption TEXT,
  media_urls TEXT[], -- Array de URLs de imágenes/videos
  hashtags TEXT[],
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT, -- ID del post en la plataforma
  engagement_stats JSONB, -- likes, comments, shares
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews multi-plataforma
CREATE TABLE marketing_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  property_id UUID REFERENCES properties(id),
  source TEXT NOT NULL CHECK (source IN ('airbnb', 'booking', 'google', 'tripadvisor', 'manual')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  guest_name TEXT,
  stay_date DATE,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  response_text TEXT, -- Respuesta del owner
  response_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_marketing_campaigns_tenant_id ON marketing_campaigns(tenant_id);
CREATE INDEX idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX idx_marketing_posts_tenant_id ON marketing_posts(tenant_id);
CREATE INDEX idx_marketing_posts_scheduled_at ON marketing_posts(scheduled_at);
CREATE INDEX idx_marketing_reviews_tenant_id ON marketing_reviews(tenant_id);

-- RLS Policies (activar después de multi-tenant)
ALTER TABLE marketing_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_reviews ENABLE ROW LEVEL SECURITY;
```

**Checklist:**
- [ ] Ejecutar migración SQL en Supabase
- [ ] Verificar tablas creadas correctamente
- [ ] Insertar datos de prueba (mock campaigns, posts, reviews)
- [ ] Documentar schema en `docs/marketing-schema.md`

**Entregables:**
- `supabase/migrations/010_marketing_tables.sql`
- `docs/marketing-schema.md`

---

### Tarea 0.1.3: Marketing Overview Screen
**Descripción:** Dashboard de marketing con métricas principales
**Complejidad:** 🟡 Media
**Tiempo:** 4-5 horas

**Componentes:**
- Cards de métricas (7 días):
  - Leads generados
  - CTR promedio
  - Gasto total
  - Bookings from Ads
  - Top Channel (IG/FB)
  - Pending tasks
- CTAs principales:
  - "Connect Meta Account"
  - "Create Campaign"
  - "Publish Post"
  - "Review Alerts"

**Checklist:**
- [ ] Crear `MarketingOverview.jsx` con layout de cards
- [ ] Integrar con `marketing_campaigns` para datos reales
- [ ] Agregar gráficos (Recharts) para tendencias
- [ ] Implementar filtro por período (7d, 30d, 90d)
- [ ] CTAs con navegación a sub-módulos
- [ ] Responsive design (mobile-first)

**Entregables:**
- `src/components/Marketing/MarketingOverview.jsx`
- `src/services/marketingService.js` (API calls)

---

### Tarea 0.1.4: Meta Ads Screen - Connection + Campaigns Table
**Descripción:** Pantalla de gestión de campañas de Meta Ads
**Complejidad:** 🔴 Alta
**Tiempo:** 6-8 horas

**Secciones:**

#### A) Connection Status Card
- Estado: Connected / Not Connected
- Account name (si conectado)
- Botones: Connect / Reconnect / Disconnect
- Última sincronización

#### B) Campaigns Table
Columnas:
- Campaign name
- Objective (badge con color)
- Status (active/paused/draft)
- Daily Budget
- Spend (MTD)
- Leads
- CTR
- Last updated
- Actions: View / Pause/Resume / Edit / Delete

#### C) Create Campaign Wizard (6 pasos)
**Step 1:** Select Property
- Dropdown con propiedades desde Supabase

**Step 2:** Objective
- Radio buttons: Leads / WhatsApp Messages / Website Visits / Bookings

**Step 3:** Budget
- Daily budget (input)
- Campaign duration (date range picker)

**Step 4:** Audience
- Location (radius from property)
- Interests (chips multi-select)
- Age range (slider)
- Gender (all/male/female)

**Step 5:** Creative
- Image/video upload
- Primary text (textarea)
- Headline (input)
- CTA button (dropdown)

**Step 6:** Review & Save
- Summary de toda la configuración
- Botón "Save as Draft" / "Launch Campaign"

**Checklist:**
- [ ] Crear `MetaAds.jsx` con estructura de secciones
- [ ] Connection status card con datos de `marketing_connections`
- [ ] Campaigns table con CRUD completo
- [ ] Create Campaign wizard (multi-step modal)
- [ ] Guardar campañas en `marketing_campaigns` como draft
- [ ] Botón "Connect Meta" (stub por ahora, OAuth en Fase 2)

**Entregables:**
- `src/components/Marketing/MetaAds.jsx`
- `src/components/Marketing/CreateCampaignWizard.jsx`
- `src/components/Marketing/CampaignRow.jsx`

---

### Tarea 0.1.5: Content Planner Screen
**Descripción:** Calendario de contenido + creación de posts
**Complejidad:** 🟡 Media
**Tiempo:** 5-6 horas

**Características:**
- Vista de calendario mensual (react-big-calendar o similar)
- Lista de posts programados
- Modal "Create Post":
  - Platform selector (IG/FB/Both)
  - Property selector
  - Caption (textarea con contador de caracteres)
  - Media upload (imágenes/videos)
  - Hashtags (chips)
  - Publish date/time picker
  - Botón "Generate Caption with AI" (llamar a AI Assistant endpoint)
- Estados: Draft / Scheduled / Published / Failed

**Checklist:**
- [ ] Crear `ContentPlanner.jsx` con calendar view
- [ ] Integrar con `marketing_posts` table
- [ ] Create Post modal completo
- [ ] AI caption generation (endpoint existente o stub)
- [ ] Filtros: por plataforma, por propiedad, por estado
- [ ] Drag & drop para reordenar fechas (nice-to-have)

**Entregables:**
- `src/components/Marketing/ContentPlanner.jsx`
- `src/components/Marketing/CreatePostModal.jsx`

---

### Tarea 0.1.6: Reviews & Reputation Screen
**Descripción:** Gestión de reviews multi-plataforma
**Complejidad:** 🟡 Media
**Tiempo:** 3-4 horas

**Características:**
- Reviews table:
  - Source (badge: Airbnb/Booking/Google)
  - Rating (stars)
  - Guest name
  - Review text (truncated)
  - Stay date
  - Sentiment (badge: Positive/Neutral/Negative)
  - Response status (Replied / Pending)
- Botón "Import Reviews" (Coming Soon)
- Botón "Reply with AI" (genera sugerencia de respuesta)
- Filtros: por plataforma, por rating, por sentimiento

**Checklist:**
- [ ] Crear `Reviews.jsx` con table layout
- [ ] Integrar con `marketing_reviews` table
- [ ] Sentiment tags (manual por ahora, AI después)
- [ ] Reply modal con AI suggestion (stub)
- [ ] Insertar mock data para demo

**Entregables:**
- `src/components/Marketing/Reviews.jsx`

---

### Tarea 0.1.7: Insights Screen (Placeholder)
**Descripción:** Analytics avanzado (Coming Soon)
**Complejidad:** 🟢 Baja
**Tiempo:** 1 hora

**Checklist:**
- [ ] Crear `Insights.jsx` con mensaje "Coming Soon"
- [ ] Mostrar preview de gráficos (mockups)

**Entregables:**
- `src/components/Marketing/Insights.jsx`

---

### Resumen Fase 0.1: Marketing & Growth Module

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| 0.1.1: UI Setup + Routing | 2-3h | ⬜ Pendiente |
| 0.1.2: Database Schema | 3-4h | ⬜ Pendiente |
| 0.1.3: Marketing Overview | 4-5h | ⬜ Pendiente |
| 0.1.4: Meta Ads Screen | 6-8h | ⬜ Pendiente |
| 0.1.5: Content Planner | 5-6h | ⬜ Pendiente |
| 0.1.6: Reviews Screen | 3-4h | ⬜ Pendiente |
| 0.1.7: Insights Placeholder | 1h | ⬜ Pendiente |
| **TOTAL** | **24-31h** | **⬜ 0%** |

---

## 0.2 Create My Website (Public Sites) 🌐

### Contexto de Negocio
**Por qué es crítico:**
- Propietarios necesitan mostrar propiedades a huéspedes potenciales
- Sin website público, no hay forma de recibir bookings directos
- Subdominios `{slug}.myhostbizmate.com` deben ser REALES
- Esto es el "producto mínimo vendible"

### Tarea 0.2.1: Database Schema - Sites & Domains
**Descripción:** Crear tablas para almacenar sitios públicos
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Tablas a crear:**

```sql
-- Sitios web por tenant
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL, -- Ej: "Bali Tropical Villas"
  slug TEXT NOT NULL UNIQUE, -- Ej: "bali-tropical-villas"
  primary_locale TEXT DEFAULT 'en',
  theme_id TEXT NOT NULL CHECK (theme_id IN ('bali-minimal', 'tropical-luxury')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dominios (subdominio + custom domains)
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('subdomain', 'custom')),
  host TEXT NOT NULL UNIQUE, -- Ej: "bali-villas.myhostbizmate.com"
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración del sitio (colores, logos, etc.)
CREATE TABLE site_settings (
  site_id UUID PRIMARY KEY REFERENCES sites(id) ON DELETE CASCADE,
  primary_color TEXT DEFAULT '#f97316', -- Orange
  secondary_color TEXT DEFAULT '#ffffff',
  logo_url TEXT,
  hero_image_url TEXT,
  booking_mode TEXT NOT NULL CHECK (booking_mode IN ('request_only', 'enquiry')) DEFAULT 'request_only',
  contact_whatsapp TEXT,
  contact_email TEXT,
  about_title TEXT DEFAULT 'About Us',
  about_description TEXT,
  footer_text TEXT DEFAULT 'Powered by MY HOST BizMate',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Propiedades visibles en el sitio
CREATE TABLE site_properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(site_id, property_id)
);

-- Solicitudes de reserva desde sitio público
CREATE TABLE site_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  message TEXT,
  check_in DATE,
  check_out DATE,
  guests INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_sites_tenant_id ON sites(tenant_id);
CREATE INDEX idx_sites_slug ON sites(slug);
CREATE INDEX idx_domains_host ON domains(host);
CREATE INDEX idx_site_properties_site_id ON site_properties(site_id);
CREATE INDEX idx_site_enquiries_site_id ON site_enquiries(site_id);

-- RLS
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_enquiries ENABLE ROW LEVEL SECURITY;
```

**Checklist:**
- [ ] Ejecutar migración SQL
- [ ] Verificar relaciones entre tablas
- [ ] Insertar datos de prueba (1 site demo)
- [ ] Documentar schema

**Entregables:**
- `supabase/migrations/011_sites_tables.sql`
- `docs/sites-schema.md`

---

### Tarea 0.2.2: Wizard UI - 5 Steps
**Descripción:** Interface para crear sitio web en 5 pasos
**Complejidad:** 🟡 Media
**Tiempo:** 6-8 horas

**Step 1: Welcome**
- Benefits del sitio propio:
  - ✅ No pagas comisiones a OTAs
  - ✅ Control total de tu marca
  - ✅ Bookings directos vía WhatsApp
  - ✅ Listo en 5 minutos
- Botón "Start Creating"

**Step 2: Business Info**
- Site name (input)
- Location area (input, ej: "Ubud, Bali")
- Primary language (dropdown: EN/ES/ID)
- Botón "Next"

**Step 3: Select Properties**
- Checkbox list de propiedades desde Supabase
- Preview cards con foto + nombre
- Opción "Select All"
- Botón "Next"

**Step 4: Booking Mode**
- Radio buttons:
  - 🟢 Request via WhatsApp (requiere phone)
    - Input: WhatsApp number
  - 🔵 Enquiry Form (requiere email)
    - Input: Email address
- Botón "Next"

**Step 5: Publish**
- Generar slug automático (desde site name)
- Preview: `{slug}.myhostbizmate.com`
- Botón "Publish My Site"
- Loader durante creación
- Success screen:
  - ✅ Your site is live!
  - URL: https://{slug}.myhostbizmate.com
  - Botón "Open My Site"
  - Botón "Go to Dashboard"

**Checklist:**
- [ ] Crear `MySiteWizard.jsx` con multi-step state
- [ ] Progress indicator (1/5, 2/5...)
- [ ] Validación en cada step
- [ ] Guardar draft en localStorage
- [ ] Al publicar: crear records en `sites`, `domains`, `site_settings`, `site_properties`
- [ ] Generar slug único (check duplicates)
- [ ] Responsive design

**Entregables:**
- `src/components/MySite/MySiteWizard.jsx`
- `src/components/MySite/WizardStep1.jsx`
- `src/components/MySite/WizardStep2.jsx`
- `src/components/MySite/WizardStep3.jsx`
- `src/components/MySite/WizardStep4.jsx`
- `src/components/MySite/WizardStep5.jsx`

---

### Tarea 0.2.3: Public Site Routes (App Router)
**Descripción:** Crear rutas públicas para el sitio
**Complejidad:** 🔴 Alta
**Tiempo:** 8-10 horas

**Estructura de archivos:**

```
src/
  public-site/
    [slug]/
      layout.jsx         # Layout con header/footer
      page.jsx          # Home page
      properties/
        page.jsx        # Properties grid
        [propertySlug]/
          page.jsx      # Property detail
      about/
        page.jsx        # About page
      contact/
        page.jsx        # Contact page
    middleware.js       # Subdomain resolution
```

**Middleware (Subdomain Resolution):**
```javascript
// Leer host de request
const host = req.headers.get('host');

// Si es subdomain: {slug}.myhostbizmate.com
if (host.endsWith('.myhostbizmate.com')) {
  const slug = host.split('.')[0];

  // Lookup en Supabase: domains.host
  const site = await getSiteByHost(host);

  if (!site) {
    return new Response('Site not found', { status: 404 });
  }

  // Inyectar site config en request
  req.siteConfig = site;
}
```

**Pages a crear:**

#### A) Home Page (`/`)
- Hero section:
  - Background: hero_image_url
  - Title: site.name
  - Subtitle: "Discover your perfect stay in {location}"
  - CTA: "View Properties"
- Properties preview (primeros 3)
- About section (short)
- Contact CTA

#### B) Properties Grid (`/properties`)
- Grid de property cards
- Filtros: guests, check-in, check-out (UI only por ahora)
- Click → property detail

#### C) Property Detail (`/property/[slug]`)
- Hero gallery (images)
- Property info: name, description, capacity, amenities
- Pricing (desde Supabase)
- Availability calendar (mock por ahora)
- **Booking CTA:**
  - Si `booking_mode = 'request_only'`:
    - Botón WhatsApp con mensaje prefilled:
      ```
      Hi, I'd like to book {propertyName} from {checkIn} to {checkOut} for {guests} guests.
      ```
  - Si `booking_mode = 'enquiry'`:
    - Formulario: name, email, message, check-in, check-out, guests
    - Submit → guardar en `site_enquiries`

#### D) About Page (`/about`)
- Render `about_title` y `about_description`
- Contact info

#### E) Contact Page (`/contact`)
- WhatsApp button (si configurado)
- Email link (si configurado)
- Simple contact form

**Checklist:**
- [ ] Crear estructura de carpetas
- [ ] Middleware para subdomain resolution
- [ ] Home page con hero + properties preview
- [ ] Properties grid con filtros (UI)
- [ ] Property detail con booking CTA
- [ ] About + Contact pages
- [ ] Integrar con `site_settings` para colores/logos
- [ ] Responsive (mobile-first)
- [ ] Testing con subdomain local (usar hosts file)

**Entregables:**
- `src/public-site/middleware.js`
- `src/public-site/[slug]/layout.jsx`
- `src/public-site/[slug]/page.jsx`
- `src/public-site/[slug]/properties/page.jsx`
- `src/public-site/[slug]/properties/[propertySlug]/page.jsx`
- `src/public-site/[slug]/about/page.jsx`
- `src/public-site/[slug]/contact/page.jsx`
- `src/services/publicSiteService.js`

---

### Tarea 0.2.4: Templates (2 Themes)
**Descripción:** Estilos visuales para sitios públicos
**Complejidad:** 🟡 Media
**Tiempo:** 4-5 horas

**Theme 1: Bali Minimal**
- Colors: White + Beige + Soft Orange
- Typography: Clean, sans-serif (Inter)
- Style: Minimal, lots of white space
- Hero: Full-width image with centered text

**Theme 2: Tropical Luxury**
- Colors: Deep Green + Gold + White
- Typography: Elegant serif headers (Playfair Display)
- Style: Rich, luxurious
- Hero: Overlay gradient on image

**Implementación:**
```javascript
// themes.js
export const themes = {
  'bali-minimal': {
    colors: {
      primary: '#f97316',
      secondary: '#fef3c7',
      accent: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  'tropical-luxury': {
    colors: {
      primary: '#065f46',
      secondary: '#fbbf24',
      accent: '#ffffff',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
  },
};
```

**Checklist:**
- [ ] Crear `themes.js` con configuración de 2 themes
- [ ] Aplicar theme dinámicamente según `site.theme_id`
- [ ] CSS variables para colores
- [ ] Font loading (Google Fonts)
- [ ] Preview de ambos themes en wizard

**Entregables:**
- `src/public-site/themes.js`
- `src/public-site/ThemeProvider.jsx`

---

### Tarea 0.2.5: Local Testing + Subdomain Setup
**Descripción:** Configurar desarrollo local con subdomios
**Complejidad:** 🟡 Media
**Tiempo:** 2-3 horas

**Opciones:**

**Opción A: Hosts file (Simple)**
```
# /etc/hosts (Mac/Linux) o C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 test-villa.localhost
127.0.0.1 demo.localhost
```

**Opción B: Tunneling (Producción-like)**
- Usar ngrok o Cloudflare Tunnel
- Subdominios reales durante desarrollo

**Checklist:**
- [ ] Configurar hosts file con 2 subdomains de prueba
- [ ] Verificar middleware detecta correctamente el host
- [ ] Testing: crear site, abrir subdomain, ver propiedades
- [ ] Documentar proceso en README

**Entregables:**
- `docs/local-subdomain-setup.md`

---

### Tarea 0.2.6: Production Deploy (Vercel)
**Descripción:** Deploy con wildcard subdomain support
**Complejidad:** 🔴 Alta
**Tiempo:** 3-4 horas

**Configuración Vercel:**
1. Agregar wildcard domain: `*.myhostbizmate.com`
2. Configurar DNS:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   ```
3. Environment variables en Vercel
4. Deploy

**Checklist:**
- [ ] Configurar wildcard domain en Vercel
- [ ] Configurar DNS (Cloudflare/etc.)
- [ ] Verificar SSL automático
- [ ] Testing con subdomain real
- [ ] Documentar proceso de deploy

**Entregables:**
- `docs/vercel-subdomain-deploy.md`

---

### Resumen Fase 0.2: Create My Website

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| 0.2.1: Database Schema | 2-3h | ⬜ Pendiente |
| 0.2.2: Wizard UI (5 steps) | 6-8h | ⬜ Pendiente |
| 0.2.3: Public Site Routes | 8-10h | ⬜ Pendiente |
| 0.2.4: Templates (2 themes) | 4-5h | ⬜ Pendiente |
| 0.2.5: Local Testing Setup | 2-3h | ⬜ Pendiente |
| 0.2.6: Production Deploy | 3-4h | ⬜ Pendiente |
| **TOTAL** | **25-33h** | **⬜ 0%** |

---

## 📊 RESUMEN FASE 0: MVP DEMO FEATURES

| Módulo | Tiempo Estimado | Prioridad | Estado |
|--------|-----------------|-----------|--------|
| **0.1: Marketing & Growth** | 24-31h | 🔴 Crítico | ⬜ 0% |
| **0.2: Create My Website** | 25-33h | 🔴 Crítico | ⬜ 0% |
| **Total Fase 0** | **49-64h** | **🔴 Bloqueante** | **⬜ 0%** |

**Timeline:** 10-13 días laborables (5h/día promedio)

---

# 🔴 FASE 1: INFRAESTRUCTURA BASE
**Prioridad:** CRÍTICA (Después de FASE 0)
**Duración:** 25-35 horas | 5-7 días
**¿Por qué después?** Multi-tenancy puede esperar hasta tener MVP demo funcional

## 1.1 Multi-Tenant Architecture

### Tarea 1.1.1: Agregar tenant_id a Tablas
**Descripción:** Migración para multi-tenancy
**Complejidad:** 🔴 Alta
**Tiempo:** 8-10 horas

**Tablas a modificar:**
- `properties`
- `bookings`
- `guests`
- `payments`
- `messages`
- `reviews`
- `campaigns`
- `workflows`
- `ai_conversations`
- `notifications`
- `marketing_connections` (nueva)
- `marketing_campaigns` (nueva)
- `marketing_posts` (nueva)
- `marketing_reviews` (nueva)
- `sites` (nueva)
- `domains` (nueva)
- `site_settings` (nueva)
- `site_properties` (nueva)

**Checklist:**
- [ ] Crear tabla `tenants` (si no existe)
- [ ] Agregar `tenant_id` a todas las tablas
- [ ] Crear índices
- [ ] Migrar datos existentes a tenant demo
- [ ] Actualizar foreign keys

**Entregables:**
- `supabase/migrations/012_multi_tenant.sql`

---

### Tarea 1.1.2: RLS Policies
**Descripción:** Row Level Security por tenant
**Complejidad:** 🔴 Alta
**Tiempo:** 6-8 horas

**Policies a crear:**
```sql
-- Ejemplo para properties
CREATE POLICY "Users can only see their tenant's properties"
ON properties FOR SELECT
USING (tenant_id = auth.jwt() ->> 'tenant_id');

CREATE POLICY "Users can only insert their tenant's properties"
ON properties FOR INSERT
WITH CHECK (tenant_id = auth.jwt() ->> 'tenant_id');

-- Repetir para todas las tablas
```

**Checklist:**
- [ ] RLS policies para todas las tablas
- [ ] Testing: verificar aislamiento entre tenants
- [ ] Documentar políticas

**Entregables:**
- `supabase/migrations/013_rls_policies.sql`

---

### Tarea 1.1.3: Auth Context con tenant_id
**Descripción:** Inyectar tenant_id en JWT
**Complejidad:** 🟡 Media
**Tiempo:** 4-5 horas

**Checklist:**
- [ ] Modificar login para incluir tenant_id en JWT
- [ ] Actualizar frontend para leer tenant_id
- [ ] Verificar queries incluyen tenant_id

**Entregables:**
- `src/contexts/AuthContext.jsx` (modificado)

---

### Tarea 1.1.4: Testing Multi-Tenant
**Descripción:** Verificar aislamiento completo
**Complejidad:** 🟡 Media
**Tiempo:** 5-7 horas

**Checklist:**
- [ ] Crear 2 tenants de prueba
- [ ] Verificar no hay data leak entre tenants
- [ ] Testing de permisos

**Entregables:**
- `docs/multi-tenant-testing.md`

---

## Resumen Fase 1: Multi-Tenant

| Tarea | Tiempo | Estado |
|-------|--------|--------|
| 1.1.1: Agregar tenant_id | 8-10h | ⬜ Pendiente |
| 1.1.2: RLS Policies | 6-8h | ⬜ Pendiente |
| 1.1.3: Auth Context | 4-5h | ⬜ Pendiente |
| 1.1.4: Testing | 5-7h | ⬜ Pendiente |
| **TOTAL** | **23-30h** | **⬜ 0%** |

---

# 🔴 FASE 2: INTEGRACIONES CRÍTICAS
**Prioridad:** ALTA
**Duración:** 55-80 horas | 11-16 días

## 2.1 Stripe Payments
**Tiempo:** 20-30 horas

(Mantener plan original, no repetir aquí)

## 2.2 DOMUS Channel Manager
**Tiempo:** 35-50 horas

(Mantener plan original)

## 2.3 Meta Ads OAuth (NUEVO)
**Descripción:** Integración real con Meta Business Suite
**Complejidad:** 🔴 Alta
**Tiempo:** 15-20 horas

### Tarea 2.3.1: Meta App Setup
**Checklist:**
- [ ] Crear Meta App en developers.facebook.com
- [ ] Configurar OAuth redirect URLs
- [ ] Obtener App ID + Secret
- [ ] Configurar environment variables

### Tarea 2.3.2: OAuth Flow
**Checklist:**
- [ ] API route: `/api/marketing/meta/connect`
- [ ] Redirect a Meta OAuth
- [ ] Callback: `/api/marketing/meta/callback`
- [ ] Store access token (encrypted)
- [ ] Update `marketing_connections` status

### Tarea 2.3.3: Meta Ads API Integration
**Checklist:**
- [ ] Create Campaign API call
- [ ] Fetch Campaigns API call
- [ ] Sync metrics (spend, leads, CTR)
- [ ] Error handling

**Entregables:**
- `src/app/api/marketing/meta/connect/route.js`
- `src/app/api/marketing/meta/callback/route.js`
- `src/services/metaAdsService.js`

---

# 🟡 FASE 3: WORKFLOWS PENDIENTES
**Duración:** 30-45 horas

## 3.1 WhatsApp Concierge
**Tiempo:** 10-15 horas

(Plan original - implementar workflow n8n)

## 3.2 Marketing Automation Workflows
**Tiempo:** 20-30 horas

- Review Request Automation
- Social Post Automation
- Campaign Performance Reports
- Guest Re-engagement

---

# 🟢 FASE 4: POLISH & OPTIMIZACIÓN
**Duración:** 15-25 horas

## 4.1 Dashboard Widgets
**Tiempo:** 8-12 horas

## 4.2 Performance Optimization
**Tiempo:** 4-6 horas

## 4.3 Testing & Bug Fixes
**Tiempo:** 3-7 horas

---

# 📈 ESTIMACIÓN TOTAL ACTUALIZADA

| Fase | Horas | Días | Prioridad | Estado |
|------|-------|------|-----------|--------|
| **FASE 0: MVP Demo Features** | 49-64h | 10-13d | 🔴 | ⬜ 0% |
| FASE 1: Multi-Tenant | 23-30h | 5-7d | 🔴 | ⬜ 0% |
| FASE 2: Integraciones | 70-100h | 14-20d | 🔴 | ⬜ 0% |
| FASE 3: Workflows | 30-45h | 6-9d | 🟡 | ⬜ 0% |
| FASE 4: Polish | 15-25h | 3-5d | 🟢 | ⬜ 0% |
| **Buffer Imprevistos** | 30-40h | - | - | - |
| **TOTAL** | **217-304h** | **43-61d** | - | **⬜ 0%** |

**Timeline Realista:** 9-12 semanas (5h/día promedio)

---

# 🎯 CHECKLIST DEMO (FASE 0 Completa)

## Marketing & Growth Demo
- [ ] Abrir app en https://my-host-bizmate.vercel.app
- [ ] Login con usuario demo
- [ ] Navegar a "Marketing & Growth" → Overview
- [ ] Ver métricas de campañas (mock data)
- [ ] Click "Create Campaign"
- [ ] Completar wizard de campaña
- [ ] Guardar como draft
- [ ] Ver campaña en tabla
- [ ] Navegar a "Content Planner"
- [ ] Crear un post programado
- [ ] Ver post en calendario
- [ ] Navegar a "Reviews"
- [ ] Ver reviews multi-plataforma
- [ ] Click "Reply with AI" (stub)

## Create My Website Demo
- [ ] Click "Create My Website" en sidebar
- [ ] Completar wizard (5 pasos):
  - Step 1: Welcome → Start
  - Step 2: Business info (nombre, ubicación, idioma)
  - Step 3: Seleccionar propiedades (2-3)
  - Step 4: Booking mode (WhatsApp)
  - Step 5: Publish
- [ ] Ver mensaje "Your site is live"
- [ ] Click "Open My Site"
- [ ] Abrir `https://{slug}.myhostbizmate.com`
- [ ] Verificar hero page carga
- [ ] Navegar a "Properties"
- [ ] Click en una propiedad
- [ ] Ver detalle con galería
- [ ] Click botón WhatsApp
- [ ] Verificar mensaje prefilled correcto
- [ ] Navegar a "About"
- [ ] Navegar a "Contact"

---

# 📝 NOTAS FINALES

## Decisiones Estratégicas
1. **Priorizar MVP visible** sobre infraestructura
2. **Demo features primero** para validar producto
3. **Multi-tenant después** para evitar sobre-ingeniería prematura
4. **OAuth real en Fase 2** (después de UI funcional)

## Dependencias Críticas
- Marketing Module → Supabase tables
- Public Sites → Subdomain resolution + Vercel wildcard
- Meta Ads OAuth → Meta App approval (~1-2 semanas)

## Riesgos
- Wildcard subdomain en Vercel puede tener limitaciones
- Meta App review puede demorar aprobación
- Testing multi-tenant requiere tiempo adicional

---

**Preparado por:** Claude Code
**Fecha:** 29 Diciembre 2025
**Versión:** 3.0
**Estado:** ✅ Plan actualizado con nuevas prioridades
