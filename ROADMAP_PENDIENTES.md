# 🗺️ ROADMAP - TEMAS PENDIENTES MY HOST BIZMATE

**Fecha:** 20 Diciembre 2025
**Estado actual:** Frontend UI completado, n8n integrado, Supabase parcialmente integrado

---

## 📋 TEMAS PRINCIPALES PENDIENTES

### 1. 🎨 **REVISIÓN FRONTEND**
**Estado:** UI actualizada, necesita revisión de funcionalidad
**Prioridad:** 🟡 Media

**Subtareas:**
- [ ] Revisar responsividad en móviles (todas las pantallas)
- [ ] Verificar navegación entre módulos
- [ ] Probar flujos de usuario completos
- [ ] Validar formularios y campos de entrada
- [ ] Revisar estados de loading/error en todas las pantallas
- [ ] Confirmar que todos los botones tienen funcionalidad
- [ ] Verificar accesibilidad (a11y)
- [ ] Testing cross-browser (Chrome, Firefox, Safari, Edge)

**Módulos a revisar:**
```
⚠️ Dashboard - UI actualizada, PENDIENTE datos reales (Opción 2 en progreso)
✅ Properties - UI + Supabase integrado + n8n workflow
✅ Bookings - UI + Supabase integrado + n8n workflow
✅ Payments - UI + Supabase integrado
✅ Messages - UI + Supabase integrado
⚠️ Multichannel - UI actualizada, sin backend
⚠️ AIAssistant - UI actualizada, sin backend
⚠️ SmartPricing - UI actualizada, sin backend
⚠️ Reports - UI actualizada, sin backend
⚠️ PMSCalendar - UI actualizada, sin backend
⚠️ BookingEngine - UI actualizada, sin backend
⚠️ VoiceAI - UI actualizada, sin backend VAPI
⚠️ Reviews - UI actualizada, sin backend
⚠️ RMSIntegration - UI actualizada, sin backend
⚠️ DigitalCheckIn - UI actualizada, sin backend
⚠️ CulturalIntelligence - UI actualizada, sin backend
✅ Workflows - UI actualizada, n8n integrado (7 workflows)
⚠️ GuestPortal - UI actualizada, sin backend
```

---

### 2. 🔌 **INTEGRACIÓN SUPABASE - MÓDULOS RESTANTES**
**Estado:** Properties ✅, Bookings ✅, Payments ✅, Messages ✅ completados
**Prioridad:** 🔴 Alta

**Módulos COMPLETADOS:**

#### A. **Payments** ✅ COMPLETADO (20 Dic 2025)
- [x] Crear tabla `payments` en Supabase
- [x] Schema: id, booking_id, amount, status, payment_date, method, property_id
- [x] Integrar en `src/components/Payments/Payments.jsx`
- [x] CRUD completo en supabaseService.js (7 métodos)
- [x] Dashboard de métricas de pagos (stats calculadas)
- [x] Migración SQL: `supabase-migrations/02_payments_messages_tables_v2.sql`

#### B. **Messages** ✅ COMPLETADO (20 Dic 2025)
- [x] Crear tabla `messages` en Supabase
- [x] Schema: id, guest_id, property_id, message, timestamp, status, sender
- [x] Integrar en componente Messages
- [x] Sistema de conversaciones con transformación de datos
- [x] CRUD completo en supabaseService.js (11 métodos)
- [x] Stats: unread, AI handled, voice/photo messages
- [ ] Notificaciones en tiempo real (Supabase Realtime) - PENDIENTE

**Módulos pendientes de integración:**

#### C. **PMSCalendar** (Media prioridad)
- [ ] Crear tabla `calendar_events` en Supabase
- [ ] Schema: id, property_id, booking_id, event_type, date, notes
- [ ] Integrar calendario con datos reales
- [ ] Sincronización con bookings

#### D. **Reviews** (Media prioridad)
- [ ] Crear tabla `reviews` en Supabase
- [ ] Schema: id, booking_id, guest_name, rating, comment, platform, date
- [ ] Integrar lectura/escritura de reviews
- [ ] Sistema de respuestas a reviews

#### E. **Reports** (Media prioridad)
- [ ] Queries complejas para reportes
- [ ] Vistas materializadas en Supabase para performance
- [ ] Exportación a PDF/Excel

#### F. **GuestPortal** (Media prioridad)
- [ ] Crear tabla `guest_portal_access` en Supabase
- [ ] Vincular con bookings existentes
- [ ] Sistema de acceso único por booking

#### G. **DigitalCheckIn** (Media prioridad)
- [ ] Crear tabla `check_ins` en Supabase
- [ ] Schema: id, booking_id, status, documents, arrival_time
- [ ] Formulario de check-in digital

#### H. **SmartPricing** (Baja prioridad - puede usar APIs externas)
- [ ] Tabla para almacenar reglas de pricing
- [ ] Histórico de precios

#### I. **Multichannel/RMSIntegration** (Baja prioridad - APIs externas)
- [ ] Tabla para credenciales de canales
- [ ] Logs de sincronización

**Patrón a seguir (ejemplo Properties):**
```javascript
// src/services/supabase.js
export const supabaseService = {
  // Payments
  async getPayments() { ... },
  async createPayment(paymentData) { ... },
  async updatePayment(id, updates) { ... },

  // Messages
  async getMessages() { ... },
  async sendMessage(messageData) { ... },
  // etc...
}
```

---

### 3. 🔄 **N8N INTEGRACIÓN DE FLUJOS**
**Estado:** ✅ INTEGRADO - Servicio n8n REST API creado, 7 workflows conectados
**Prioridad:** 🟡 Media (core completado, faltan workflows adicionales)

**Workflows INTEGRADOS:** ✅

#### Servicio n8n creado: `src/services/n8n.js`
- [x] REST API integration con n8n Railway
- [x] JWT API Key authentication
- [x] Logging automático (console + Supabase)
- [x] Error handling completo

#### Workflows activos:
1. ✅ **New Property** (`6eqkTXvYQLdsazdC`) - Trigger: onCreate property
2. ✅ **Booking Confirmation** (`OxNTDO0yitqV6MAL`) - Trigger: onCreate booking
3. ✅ **Booking Confirmation 2** (`F8YPuLhcNe6wGcCv`) - Trigger: onUpdate/onCancel
4. ✅ **WhatsApp AI Agent** (`ln2myAS3406D6F8W`) - Trigger: onWhatsAppMessage
5. ✅ **Channel Manager** (`hvXxsxJhU1cuq6q3`) - Trigger: onUpdate/onDelete property
6. 🟡 **VAPI Voice Assistant** (`3sU4RgV892az8nLZ`) - Disponible, no integrado
7. 🟡 **Recomendaciones AI** (`8xWqs3rlUZmSf8gc`) - Disponible, no integrado

#### Funciones implementadas:
- [x] `onPropertyCreated()` - Properties.jsx integrado
- [x] `onPropertyUpdated()` - Listo para usar
- [x] `onPropertyDeleted()` - Listo para usar
- [x] `onBookingCreated()` - Bookings.jsx integrado
- [x] `onBookingUpdated()` - Listo para usar
- [x] `onBookingCancelled()` - Listo para usar
- [x] `onWhatsAppMessage()` - Listo para usar

#### Testing completado:
- [x] Test button en Bookings funcional
- [x] Envío de email (SendGrid)
- [x] Envío de WhatsApp
- [x] Console logs detallados
- [x] Workflow execution tracking

**Workflows pendientes de integración:**
- [ ] Extraer Datos Facturas PDF - Izumi Hotel
- [ ] Staff Notification - New Booking (puede usar onBookingCreated)
- [ ] Vapi Izumi Hotel (requiere VAPI module integration)

#### MCP Server n8n (opcional - avanzado):
- [ ] Configurar MCP server para gestionar workflows desde Claude Code
- [ ] Ver `.claude/mcp/n8n/` para instrucciones
- [ ] Comandos: list_workflows, create_workflow, trigger_workflow, etc.

**Ubicación workflows:** `C:\myhost-bizmate\n8n_worlkflow_claude\`

---

### 4. 🎙️ **VAPI - VOICE AI INTEGRATION**
**Estado:** Módulo VoiceAI existe pero sin integración real
**Prioridad:** 🟡 Media-Alta

**Tareas:**
- [ ] Crear cuenta en Vapi.ai
- [ ] Obtener API key de Vapi
- [ ] Configurar asistente de voz en Vapi dashboard
- [ ] Integrar Vapi Web SDK en VoiceAI.jsx
  ```javascript
  import Vapi from "@vapi-ai/web";
  const vapi = new Vapi("YOUR_PUBLIC_KEY");
  ```
- [ ] Configurar voice assistant para:
  - Responder preguntas sobre propiedades
  - Gestionar bookings por voz
  - Consultas de disponibilidad
  - Soporte al huésped
- [ ] Integrar con n8n workflow "Vapi Izumi Hotel"
- [ ] Testing de reconocimiento de voz
- [ ] Configurar idiomas (Español/Inglés)
- [ ] Implementar transcripciones en tiempo real

**Documentación Vapi:** https://docs.vapi.ai

---

### 5. 🏢 **ARQUITECTURA MULTITENANT / VERCEL**
**Estado:** Actualmente single-tenant
**Prioridad:** 🔴 Crítica para escalabilidad

#### A. **Diseño Multitenant en Supabase**

**Opción 1: Row Level Security (RLS) - Recomendada**
```sql
-- Agregar tenant_id a todas las tablas
ALTER TABLE properties ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE bookings ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- etc...

-- Crear tabla de tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  settings JSONB
);

-- RLS policies
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only see their tenant's properties"
  ON properties FOR SELECT
  USING (tenant_id = auth.jwt() ->> 'tenant_id');
```

**Opción 2: Schema per tenant** (más complejo, mayor aislamiento)
- Cada tenant tiene su propio schema en Supabase
- Mayor seguridad pero más difícil de gestionar

#### B. **Routing en Vercel**

**Estrategia de subdomains:**
```
- izumi-hotel.myhost-bizmate.com
- villa-sunset.myhost-bizmate.com
- demo.myhost-bizmate.com
```

**Configuración en Vercel:**
- [ ] Configurar wildcard domain `*.myhost-bizmate.com`
- [ ] Middleware para detectar subdomain
  ```javascript
  // middleware.js
  export function middleware(request) {
    const hostname = request.headers.get('host');
    const subdomain = hostname.split('.')[0];
    // Pasar subdomain a la app
    const url = request.nextUrl.clone();
    url.pathname = `/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  }
  ```
- [ ] Almacenar tenant_id en sesión/contexto
- [ ] Filtrar todas las queries por tenant_id

#### C. **User Management Multitenant**
- [ ] Tabla `users` con relación a `tenants`
- [ ] Roles por tenant (owner, manager, staff)
- [ ] Supabase Auth policies para multitenant
- [ ] Invitaciones de usuarios por tenant

#### D. **Data Isolation**
- [ ] Todas las queries filtradas por tenant_id
- [ ] Verificación de permisos en backend
- [ ] Testing de aislamiento de datos

---

### 6. 🚀 **MIGRACIÓN N8N: RAILWAY → VERCEL**
**Estado:** n8n actualmente en Railway
**Prioridad:** 🟡 Media (evaluar pros/cons)

#### Opciones a evaluar:

**Opción A: Mantener n8n en Railway**
**Pros:**
- ✅ Ya configurado y funcionando
- ✅ n8n está diseñado para correr en servidores dedicados
- ✅ Railway ofrece persistencia y base de datos
- ✅ Más fácil gestionar workflows visualmente
- ✅ No hay límites de ejecución serverless

**Contras:**
- ❌ Costo adicional de Railway ($5-20/mes)
- ❌ Otro servicio que mantener

**Opción B: Migrar a Vercel Serverless Functions**
**Pros:**
- ✅ Todo en una plataforma (Vercel)
- ✅ Potencialmente más barato (free tier generoso)
- ✅ Escalabilidad automática
- ✅ Deploy integrado con git

**Contras:**
- ❌ Perder interfaz visual de n8n
- ❌ Límite de 10s ejecución en hobby plan
- ❌ Límite de 60s en Pro plan
- ❌ Necesitarías reescribir workflows en código
- ❌ Más complejo para usuarios no técnicos

**Opción C: Híbrido**
- n8n en Railway para workflows complejos/largos
- Vercel Functions para webhooks simples y rápidos
- Mejor de ambos mundos

#### Recomendación:
**Mantener n8n en Railway** por ahora, evaluar migración cuando:
1. Costos de Railway sean prohibitivos
2. Necesites mayor integración con Vercel
3. Workflows sean suficientemente simples para serverless

**Si decides migrar:**
- [ ] Identificar workflows críticos vs opcionales
- [ ] Reescribir workflows como Vercel Functions
- [ ] Configurar cron jobs en Vercel
- [ ] Migrar credenciales a Vercel Environment Variables
- [ ] Testing exhaustivo de cada workflow migrado

---

### 7. 📝 **OTROS TEMAS PENDIENTES**

#### A. **Testing & Quality Assurance** 🔴 Alta prioridad
- [ ] Unit tests (Vitest recomendado para Vite)
  ```bash
  npm install -D vitest @testing-library/react @testing-library/jest-dom
  ```
- [ ] Integration tests para Supabase
- [ ] E2E tests (Playwright/Cypress)
  ```bash
  npm install -D @playwright/test
  ```
- [ ] Test coverage > 70%
- [ ] CI/CD pipeline con tests automáticos

#### B. **Autenticación & Autorización Avanzada** 🟡 Media
- [ ] Sistema de roles (Owner, Manager, Staff, Guest)
- [ ] Permisos granulares por módulo
- [ ] 2FA (Two-Factor Authentication)
- [ ] Session management mejorado
- [ ] Password recovery flow
- [ ] Email verification
- [ ] Social login (Google, Facebook)

#### C. **Performance Optimization** 🟡 Media
- [ ] Code splitting por rutas
  ```javascript
  const Dashboard = lazy(() => import('./components/Dashboard'));
  ```
- [ ] Image optimization (lazy loading, WebP)
- [ ] Bundle size analysis
  ```bash
  npm run build
  npm install -D vite-bundle-visualizer
  ```
- [ ] Memoización de componentes pesados (React.memo)
- [ ] Virtualización para listas largas (react-window)
- [ ] Service Worker para caching
- [ ] CDN para assets estáticos

#### D. **Monitoreo & Analytics** 🟡 Media
- [ ] Error tracking (Sentry)
  ```bash
  npm install @sentry/react
  ```
- [ ] Analytics (Google Analytics / Plausible)
- [ ] Performance monitoring (Web Vitals)
- [ ] User behavior tracking (Hotjar/Mixpanel)
- [ ] Logs centralizados (Datadog/LogRocket)
- [ ] Uptime monitoring (UptimeRobot)

#### E. **Seguridad** 🔴 Alta prioridad
- [ ] Security headers en Vercel
  ```javascript
  // vercel.json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  }
  ```
- [ ] Rate limiting en API endpoints
- [ ] Input validation en todos los forms
- [ ] SQL injection prevention (usar Supabase queries)
- [ ] XSS prevention (React lo hace por defecto, verificar)
- [ ] CSRF tokens donde aplique
- [ ] Secure cookie settings
- [ ] Audit de dependencias (npm audit)
- [ ] Penetration testing

#### F. **Documentación Técnica** 🟡 Media
- [ ] README.md completo
- [ ] API documentation (si expones APIs)
- [ ] Component Storybook
  ```bash
  npx storybook@latest init
  ```
- [ ] Architecture Decision Records (ADR)
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Contribution guidelines

#### G. **DevOps & CI/CD** 🟡 Media
- [ ] GitHub Actions para CI/CD
  ```yaml
  # .github/workflows/deploy.yml
  name: Deploy
  on:
    push:
      branches: [main]
  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - run: npm install
        - run: npm run build
        - run: npm test
  ```
- [ ] Automated deployments (ya con Vercel)
- [ ] Staging environment
- [ ] Database migrations automation
- [ ] Environment variables management
- [ ] Backup strategy para Supabase

#### H. **Internacionalización (i18n)** 🟢 Baja
- [ ] Soporte multi-idioma (Español/Inglés)
- [ ] react-i18next
  ```bash
  npm install i18next react-i18next
  ```
- [ ] Detección automática de idioma
- [ ] Fechas/monedas localizadas

#### I. **PWA (Progressive Web App)** 🟢 Baja
- [ ] Service Worker
- [ ] Offline functionality
- [ ] Add to Home Screen
- [ ] Push notifications (web push)
- [ ] manifest.json configurado

#### J. **Compliance & Legal** 🟡 Media
- [ ] GDPR compliance (si opera en EU)
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Cookie consent banner
- [ ] Data export functionality
- [ ] Right to deletion (GDPR)

---

## 🎯 PRIORIZACIÓN RECOMENDADA

### ✅ Sprint 1 (COMPLETADO - 20 Dic 2025) - Fundación Backend
1. ✅ Integración Supabase - Payments
2. ✅ Integración Supabase - Messages
3. ✅ Integración Supabase - Properties
4. ✅ Integración Supabase - Bookings
5. ✅ n8n Service Layer creado
6. ✅ n8n workflows integrados (7 workflows)
7. 🟡 Testing básico - PENDIENTE
8. 🟡 Seguridad básica - PENDIENTE

### Sprint 1.5 (EN CURSO - 20 Dic 2025) - Dashboard Real Data
**PRIORIDAD ACTUAL:** Opción 2 - Dashboard completo con datos reales
1. 🔄 SQL Functions para KPIs
2. 🔄 SQL Functions para Check-ins/Check-outs
3. 🔄 SQL Functions para Alertas
4. 🔄 SQL Functions para Revenue por mes
5. 🔄 Integración OwnerExecutiveSummary.jsx con Supabase
6. 🔄 Gráficas con Recharts

### Sprint 2 (2 semanas) - Integraciones Core
1. 🔴 n8n - Booking Confirmation Flow
2. 🔴 n8n - WhatsApp Notifications
3. 🔴 Arquitectura Multitenant - Diseño y RLS
4. 🟡 Autenticación avanzada (roles)

### Sprint 3 (2 semanas) - Features Avanzadas
1. 🟡 VAPI integration
2. 🟡 Reviews + Supabase
3. 🟡 PMSCalendar + Supabase
4. 🟡 Performance optimization

### Sprint 4 (2 semanas) - Polish & Deploy
1. 🟡 Multitenant routing en Vercel
2. 🟡 Monitoreo (Sentry)
3. 🟡 Documentación técnica
4. 🟢 i18n si hay tiempo

### Backlog (futuro)
- 🟢 PWA
- 🟢 SmartPricing + Supabase
- 🟢 Storybook
- 🟢 E2E testing completo

---

## 📊 MÉTRICAS DE ÉXITO

**Para considerar MVP listo:**
- [ ] 80% de módulos con backend funcional
- [ ] Test coverage > 60%
- [ ] 0 security vulnerabilities críticas
- [ ] Multitenant funcionando para 2+ tenants
- [ ] 3+ workflows n8n integrados y probados
- [ ] VAPI respondiendo llamadas básicas
- [ ] Performance: LCP < 2.5s, FID < 100ms
- [ ] Uptime > 99.5%

---

**Última actualización:** 20 Diciembre 2025, 14:10
**Versión:** 2.0
**Mantenedor:** José Carrallo

---

## 📝 CHANGELOG

### v2.0 - 20 Diciembre 2025
- ✅ Completado Sprint 1: Supabase integration (Properties, Bookings, Payments, Messages)
- ✅ Completado n8n integration: 7 workflows activos
- 🔄 Sprint 1.5 iniciado: Dashboard con datos reales (Opción 2)
- 📄 Documentación completa en `N8N_INTEGRATION_COMPLETED.md`
- 📄 Migraciones SQL en `supabase-migrations/`

### v1.0 - 16 Diciembre 2025
- Versión inicial del roadmap

---

*Generado con Claude Code*
