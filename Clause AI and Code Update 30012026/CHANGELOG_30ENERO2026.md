# CHANGELOG - 30 ENERO 2026
## MY HOST BizMate - Technical Changes Log

**Fecha:** 30 Enero 2026
**Rama:** backup-antes-de-automatizacion
**Versión:** v0.8.1 (AUTOPILOT Layout Fixes)

---

## [0.8.1] - 2026-01-30

### 🐛 Fixed

#### AUTOPILOT Dashboard - Font Size Overflow Issue
**Commit:** `0521b89`
**Archivo:** `src/components/Autopilot/Autopilot.jsx`
**Problema:** Los números de revenue ($15,820) se desbordaban de sus contenedores, se partían en 2 líneas, o el último dígito "0" se cortaba.

**Cambios Realizados:**

##### 1. Monthly View (Líneas 1858-1886)
```diff
- <p className="text-2xl lg:text-3xl font-black text-white mb-1">
+ <p className="text-xl font-black text-white mb-1">
```

**Afectó 4 cards:**
- Total Revenue
- Bookings
- Occupancy
- Cancellations

##### 2. Daily View - Main KPIs (Líneas 1536-1576)
```diff
- <span className="text-3xl font-bold text-gray-900">
+ <span className="text-xl font-bold text-gray-900">
```

**Afectó 5 cards:**
- New Inquiries
- Pending Payments
- Confirmed Today
- Check-ins Today
- Expired Holds

##### 3. Daily View - Additional Metrics (Líneas 1579-1606)
```diff
- <p className="text-3xl font-black text-white mb-1">
+ <p className="text-xl font-black text-white mb-1">
```

**Afectó 3 cards:**
- Revenue Today ($5,280)
- Bookings Confirmed (12 bookings)
- Payments Received ($4,120)

##### 4. Weekly View (Líneas 1744-1793)
```diff
- <p className="text-3xl font-black text-white mb-1">
+ <p className="text-xl font-black text-white mb-1">
```

**Afectó 6 cards:**
- Bookings This Week
- Revenue This Week
- Payments Collected
- Open Actions
- New Leads
- vs Last Week (trend)

**Total Elementos Modificados:** 18 tarjetas de métricas

**Resultado:**
- ✅ Todos los números ahora caben dentro de sus contenedores
- ✅ No hay line breaks en números
- ✅ El último dígito "0" es completamente visible
- ✅ Layout consistente en las 3 vistas (Daily, Weekly, Monthly)
- ✅ Responsive design mantenido

**Testing:**
- [x] Vista Daily en desktop (1920x1080)
- [x] Vista Weekly en desktop
- [x] Vista Monthly en desktop
- [x] Vite HMR compilation success
- [x] No console errors
- [x] Git commit + push exitoso

---

## [0.8.0] - 2026-01-29

### ✨ Added

#### AUTOPILOT Dashboard - Database Visualization Panel
**Commit:** `8c9a9b2`
**Descripción:** Agregado panel de visualización de queries en tiempo real para transparencia y debugging.

**Características:**
- Toggle "Show/Hide DB" en Owner Decisions section
- Real-time query log display
- Shows SQL-like queries executed
- Displays results preview
- Timestamps para cada query
- Styled como terminal/console view
- Buttons: "Clear Log", "Refresh Data"

**Logs Automáticos:**
- Data fetches de Supabase (autopilot_actions, bookings, daily_summary)
- Webhook POST requests (approve/reject)
- API responses
- Errors con stack traces

**Código:**
```javascript
const addDbLog = (query, result) => {
  setDbActivityLog(prev => [...prev, {
    timestamp: new Date().toISOString(),
    query,
    result: JSON.stringify(result, null, 2),
    success: !result.error
  }]);
};
```

---

#### AUTOPILOT Dashboard - 3-Month Performance Metrics
**Commit:** `8c9a9b2`
**Descripción:** Agregado breakdown mensual (Nov/Dec/Jan) en Monthly view.

**Características:**
- Monthly breakdown cards con revenue, bookings, occupancy
- Color-coded por mes (Blue/Green/Orange)
- Total summary row
- Reads real data de bookings table
- Trend indicators (vs previous month)

**Data Shown:**
- November 2025: $11,220 revenue, 12 bookings, 65% occupancy
- December 2025: $23,100 revenue, 18 bookings, 85% occupancy
- January 2026: $15,820 revenue, 15 bookings, 72% occupancy

---

### 🔧 Changed

#### OSIRIS AI Assistant - Real n8n Integration
**Commit:** `8c9a9b2`
**Archivo:** `src/components/AISystems/AISystems.jsx`

**Cambios:**
- Conectado a n8n workflow WF-IA-01 (real endpoint)
- Structured message rendering (markdown support)
- Loading state improvements
- Error handling robusto

**Endpoint:**
```javascript
const OSIRIS_ENDPOINT = 'https://n8n-production-bb2d.up.railway.app/webhook/osiris-chat';
```

---

#### Voice AI - Branding Update
**Commit:** `44ec57c`
**Archivo:** `src/components/VoiceAI/VoiceAI.jsx`

**Cambios:**
- Renamed de "LUMINA" a "KORA" (corrección de naming)
- Updated hero image (Balinese woman photo)
- Improved real-time transcript display
- Better WebSocket connection handling

---

### 🗄️ Database

#### Supabase Data Population - Izumi Hotel
**Fecha:** 29 Enero 2026
**Referencia:** `INFORME_SUPABASE_IZUMI_HOTEL_29ENE2026.md`

**Data Insertada:**
- 45 bookings (Nov 2025 - Ene 2026)
- 8 active leads
- 9 autopilot_actions (3 pending, 6 resolved)
- Daily summary records
- Guest records (45 unique guests)

**Revenue Total:** $50,140 USD

---

## [0.7.5] - 2026-01-25

### 📚 Documentation

#### Strategic Documentation Update
**Commits:** Multiple
**Directorio:** `MYHOST Bizmate_Documentos_Estrategicos 2025_2026/`

**Documentos Agregados:**
- `AUTOPILOT_MODULE_INTRODUCTION.txt` - Intro to AUTOPILOT concept
- `PLAN_H126_MYHOST_Bizmate.txt` - Strategic plan H126
- `MYHOST_MULTITENANT_GUIA_IMPLEMENTACION_COMPLETA_26_ENERO_2026.md` - Multi-tenant guide
- `CHAKRAHQ_ONBOARDING_CHECKLIST.md` - WhatsApp onboarding steps
- `Survey Summary Villa Owner Perspective.pdf` - User research (50+ owners)

---

## [0.7.0] - 2025-12-21

### 🔐 Security & Stability

#### Authentication Fixes
**Commit:** `dd77f6f`
**Archivos:**
- `src/contexts/AuthContext.jsx`
- `src/components/Auth/LoginPage.jsx`

**Problemas Resueltos:**
- ✅ Infinite loading screen on login/logout
- ✅ Corrupted localStorage after logout
- ✅ Race conditions en signOut()
- ✅ State updates after component unmount

**Cambios Técnicos:**
1. **Promise.race con timeout:**
```javascript
const result = await Promise.race([
  supabase.auth.signInWithPassword({ email, password }),
  new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
]);
```

2. **sessionStorage en lugar de localStorage:**
```javascript
// Antes: localStorage.setItem('userData', ...)
// Después: sessionStorage.setItem('userData', ...)
```

3. **Optimistic UI updates:**
```javascript
// Clear state FIRST, then call Supabase
setUser(null);
setUserData(null);
sessionStorage.clear();
await supabase.auth.signOut();
```

4. **Mounted flag:**
```javascript
let mounted = true;
// ... fetch user data ...
if (mounted) setUser(data);
return () => { mounted = false; };
```

**Resultado:**
- ✅ Login/logout seamless (no manual localStorage.clear needed)
- ✅ No más pantalla blanca infinita
- ✅ Logout visible en sidebar (red button)

---

### 🔄 Workflows

#### n8n Workflow - New Property Notifications
**Commit:** `dd77f6f`
**Workflow:** WF-PROPERTY-CREATED

**Triggers:**
- Webhook: `/webhook/property-created`
- Event: New property inserted en Supabase

**Actions:**
1. Send email notification (SendGrid)
2. Send WhatsApp notification (BANYU)
3. Log activity

**Payload Example:**
```json
{
  "property_id": "...",
  "property_name": "Villa Serenity",
  "owner_name": "John Doe",
  "owner_email": "john@example.com"
}
```

---

## [0.6.0] - 2025-12-20

### ✨ New Module

#### My Site - Website Builder
**Commit:** `0fac888`
**Archivos:**
- `src/components/MySite/MySite.jsx`
- `src/components/PublicSite/PublicSite.jsx`
- `src/services/mySiteService.js`

**Características:**
- 5-step wizard para crear landing page en 5 minutos
- 5 visual themes (Bali Minimal, Tropical Luxury, Ocean Breeze, Sunset Warmth, Jungle Modern)
- WhatsApp booking integration
- Public URLs: `/site/:slug`
- React Router integration

**Themes:**
```javascript
const themes = {
  'bali-minimal': { primary: '#D4A574', secondary: '#8B7355' },
  'tropical-luxury': { primary: '#2ECC71', secondary: '#27AE60' },
  'ocean-breeze': { primary: '#3498DB', secondary: '#2980B9' },
  'sunset-warmth': { primary: '#E74C3C', secondary: '#C0392B' },
  'jungle-modern': { primary: '#16A085', secondary: '#1ABC9C' }
};
```

**Service Layer:**
- `saveSite(data)` - localStorage (ready for Supabase migration)
- `getSites()` - fetch all sites
- `getSiteBySlug(slug)` - public site lookup
- `publishSite(siteId)` - toggle published status

---

#### Enhanced Login Page
**Commit:** `0fac888`
**Archivo:** `src/components/Auth/LoginPage.jsx`

**Cambios:**
- Split layout con large branding display
- Hero text: "AI Operating System for Your Vacation Rental Business"
- Gradient background
- Improved visual hierarchy

---

### 🐛 Fixed

#### Text Input Bugs
**Commit:** `0fac888`
**Problema:** Uncontrolled → Controlled component warnings

**Solución:**
```javascript
// Antes: value={siteData.propertyName}
// Después: value={siteData.propertyName || ''}

// Usamos onBlur en lugar de onChange para evitar re-renders constantes
onBlur={(e) => handleInputChange('propertyName', e.target.value)}
```

---

### 📦 Dependencies

#### shadcn/ui Components Added
**Commit:** `0fac888`

**Componentes:**
- Dialog (modals)
- Input (form fields)
- Checkbox
- Progress
- RadioGroup
- Textarea

**Installation:**
```bash
npx shadcn-ui@latest add dialog input checkbox progress radio-group textarea
```

---

### 🚀 Deployment

#### Vercel SPA Routing
**Commit:** `0fac888`
**Archivo:** `vercel.json`

**Configuración:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Problema Resuelto:**
- ✅ Public URLs como `/site/villa-serenity` ahora funcionan en producción
- ✅ No más 404 en refresh

---

## [0.5.0] - 2025-12-19

### 🎨 UI/UX Improvements

#### Professional Collapsible Sidebar
**Commit:** `8c264b4`
**Archivo:** `src/components/Layout/Sidebar.jsx`

**Características:**
- 6 main sections con expand/collapse functionality
- Chevron icons (ChevronRight → ChevronDown)
- All sections start collapsed por defecto
- Direct link buttons (OVERVIEW, SETTINGS)
- Active state highlighting (orange-50 background)
- Mobile responsive drawer con backdrop

**Secciones:**
1. OVERVIEW (direct link)
2. OPERATIONS (collapsible, 12 items)
3. SALES & LEADS (collapsible, 6 items)
4. CUSTOMER COMMUNICATIONS (collapsible, 13 items)
5. MARKETING & GROWTH (collapsible, 10 items)
6. REVENUE & PRICING (collapsible, 4 items)
7. MARKET INTELLIGENCE (collapsible, 4 items)
8. AI SYSTEMS (direct link)
9. SETTINGS (direct link)

---

#### AI Agents Reorganization
**Commit:** `8c264b4`

**Cambios:**
- Renamed: `AIReceptionist` → `AIAgentsMonitor`
- Moved: AI Agents Monitor a "OPERATIONS" section
- Clear separation: PMS CORE (staff tools) vs GUEST MANAGEMENT (guest experience)

**Rationale:**
- "AI Receptionist" sonaba como guest-facing
- "AI Agents Monitor" clarifica que es para staff monitoring (KORA calls, BANYU chats)

---

#### Villa Photos Integration
**Commit:** `8c264b4`
**Archivos:** `src/assets/villa1.jpg` - `villa6.jpg`

**Uso:**
- Properties module muestra real villa photos
- PropertyCard component updated con images

---

## [0.4.0] - 2025-12-16

### 🏗️ Architecture Refactor

#### Dashboard Restructure con Sidebar
**Commit:** `a54b99d`

**Major Changes:**
1. **Eliminated splash screen** - Direct to dashboard post-login
2. **Persistent sidebar navigation** - Always visible (except mobile)
3. **Default view:** Owner Executive Summary
4. **Simplified routing:** 2 state variables → 1 (`currentView`)

**New Components:**
- `Sidebar.jsx` - Navigation component
- `OwnerExecutiveSummary.jsx` - Default dashboard view

**App.jsx Changes:**
```javascript
// ANTES
const [showModules, setShowModules] = useState(false);
const [currentModule, setCurrentModule] = useState(null);

// DESPUÉS
const [currentView, setCurrentView] = useState('overview');
```

**Layout Pattern:**
```jsx
<div className="flex h-screen overflow-hidden bg-gray-50">
  <Sidebar currentView={currentView} onNavigate={setCurrentView} />
  {renderContent()}
</div>
```

---

#### Module Layout Standardization
**Commit:** `a54b99d`

**Pattern Applied:**
```jsx
const MyModule = ({ onBack }) => {
  return (
    <div className="flex-1 h-screen ... overflow-auto">
      {/* Content */}
    </div>
  );
};
```

**Modules Updated:**
- Properties
- Bookings
- Multichannel
- AIAssistant
- Dashboard

---

#### Data Reload Bug Fix
**Commit:** `a54b99d`
**Problema:** Properties module no refreshaba data después de crear property

**Solución:**
```jsx
// Add key prop to force remount
<Properties key="properties" onBack={() => setCurrentView('overview')} />
```

---

## [0.3.0] - 2025-12-09

### 📄 Documentation

#### Complete Session Documentation
**Commits:** `4c61585`, `d2a3088`

**Documentos Agregados:**
- Comprehensive session logs (09 DIC 2025)
- Architecture diagrams
- API documentation
- Workflow specifications

---

## [0.2.0] - 2025-11-XX

### 🔨 Major Refactor

#### Extract 21 Modules from App.jsx Monolith
**Commit:** `e149395`

**Stats:**
- **Antes:** 4,019 lines en App.jsx
- **Después:** 214 lines en App.jsx
- **Reducción:** 94.7%

**Módulos Extraídos:**
1. Dashboard
2. Properties
3. Bookings
4. Payments
5. Messages
6. AIAssistant
7. Multichannel
8. Marketing
9. SocialPublisher
10. SmartPricing
11. Reports
12. PMSCalendar
13. BookingEngine
14. VoiceAI
15. Operations
16. Reviews
17. RMSIntegration
18. DigitalCheckIn
19. CulturalIntelligence
20. Workflows
21. AITripPlanner

**Benefits:**
- ✅ Better maintainability
- ✅ Easier to navigate codebase
- ✅ Faster development
- ✅ Reusable components

---

#### Common Components Extraction
**Commit:** `e149395`
**Directorio:** `src/components/common/`

**Components:**
1. ModuleCard
2. ModuleGridCard
3. StatCard
4. PaymentCard
5. BookingCard
6. MessageCard
7. PropertyCard
8. PricingCard
9. CampaignCard
10. WorkflowCard

**Barrel Export:**
```javascript
// src/components/common/index.js
export { default as StatCard } from './StatCard';
export { default as BookingCard } from './BookingCard';
// ... etc
```

**Usage:**
```javascript
import { StatCard, BookingCard } from '../common';
```

---

## [0.1.0] - 2025-11-XX

### 🎉 Initial Setup

#### Project Initialization
**Commits:** `f663601`, `7d32967`, `26a6ae1`

**Stack:**
- React 18.2
- Vite
- Tailwind CSS 3.3
- Supabase
- Recharts
- Lucide React

**Initial Modules:**
- Login/Auth
- Dashboard (basic)
- Properties (basic)
- Bookings (demo data)

---

## Dependencies

### Current Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.26.2",
  "@supabase/supabase-js": "^2.45.0",
  "recharts": "^2.12.7",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-checkbox": "^1.0.4"
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.0.3",
  "vite": "^4.4.5",
  "autoprefixer": "^10.4.14",
  "postcss": "^8.4.27"
}
```

---

## Breaking Changes

### v0.8.0 → v0.8.1
- **None** - Only CSS changes (font sizes)

### v0.7.0 → v0.8.0
- **Storage Migration:** localStorage → sessionStorage
  - Users will need to re-login after update
  - No data loss (userData synced from Supabase)

### v0.6.0 → v0.7.0
- **React Router:** Navigation changed to React Router
  - Old URLs may break
  - Need to update bookmarks

### v0.5.0 → v0.6.0
- **Sidebar Collapse State:** New state management
  - May need to clear localStorage for clean state

---

## Migration Guide

### Migrating from v0.7.x to v0.8.x

**No breaking changes.** Just pull latest code:

```bash
git checkout backup-antes-de-automatizacion
git pull origin backup-antes-de-automatizacion
npm install  # Update dependencies if any
npm run dev  # Start dev server
```

---

## Known Issues

### Current Bugs
See `PENDIENTES_PRIORIZADOS_30ENE2026.md` section "BUGS A CORREGIR"

**Summary:**
- BUG-001: Sidebar mobile no cierra al logout (MEDIA)
- BUG-002: Manual Data Entry no persiste en Supabase (MEDIA)
- BUG-003: Properties upload photo no funciona (BAJA)

---

## Upcoming Changes

### Next Release (v0.9.0 - Week of Feb 5)
- ✨ Weekly Summary workflow (WF-W1)
- ✨ Monthly Summary workflow (WF-M1)
- 🐛 Fix BUG-001, BUG-002
- 🔧 Mobile responsive improvements

### Future Releases
- v0.10.0: Nismara Uma onboarding
- v0.11.0: Bookings/Payments Supabase integration
- v0.12.0: Multi-property dashboard
- v1.0.0: Public beta launch

---

*Changelog mantenido por: Claude Code*
*Última actualización: 30 Enero 2026*
