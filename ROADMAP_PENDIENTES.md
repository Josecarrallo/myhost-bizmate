# 🗺️ ROADMAP - TEMAS PENDIENTES MY HOST BIZMATE

**Fecha:** 16 Diciembre 2025
**Estado actual:** Frontend UI completado, integraciones backend pendientes

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
✅ Dashboard - UI actualizada
✅ Properties - UI + Supabase integrado
✅ Bookings - UI + Supabase integrado
⚠️ Multichannel - UI actualizada, sin backend
⚠️ AIAssistant - UI actualizada, sin backend
⚠️ Payments - UI actualizada, sin backend
⚠️ SmartPricing - UI actualizada, sin backend
⚠️ Reports - UI actualizada, sin backend
⚠️ PMSCalendar - UI actualizada, sin backend
⚠️ BookingEngine - UI actualizada, sin backend
⚠️ VoiceAI - UI actualizada, sin backend VAPI
⚠️ Reviews - UI actualizada, sin backend
⚠️ RMSIntegration - UI actualizada, sin backend
⚠️ DigitalCheckIn - UI actualizada, sin backend
⚠️ CulturalIntelligence - UI actualizada, sin backend
⚠️ Workflows - UI actualizada, sin n8n integración
⚠️ GuestPortal - UI actualizada, sin backend
```

---

### 2. 🔌 **INTEGRACIÓN SUPABASE - MÓDULOS RESTANTES**
**Estado:** Properties ✅ y Bookings ✅ completados, resto pendiente
**Prioridad:** 🔴 Alta

**Módulos pendientes de integración:**

#### A. **Payments** (Alta prioridad)
- [ ] Crear tabla `payments` en Supabase
- [ ] Schema: id, booking_id, amount, status, payment_date, method, property_id
- [ ] Integrar en `src/components/Payments/Payments.jsx`
- [ ] CRUD completo (crear, leer, actualizar pagos)
- [ ] Dashboard de métricas de pagos

#### B. **Messages** (Alta prioridad)
- [ ] Crear tabla `messages` en Supabase
- [ ] Schema: id, guest_id, property_id, message, timestamp, status, sender
- [ ] Integrar en componente Messages
- [ ] Sistema de conversaciones
- [ ] Notificaciones en tiempo real (Supabase Realtime)

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
**Estado:** 11+ workflows documentados en n8n_worlkflow_claude/, no integrados
**Prioridad:** 🔴 Alta

**Workflows pendientes de integración:**

#### Workflows existentes a integrar:
1. **Chatbot WhatsApp + Claude** (webhook manual)
2. **Extraer Datos Facturas PDF - Izumi Hotel**
3. **Recomendaciones IA Diarias**
4. **Booking Confirmation Flow (Email + WhatsApp)**
5. **Staff Notification - New Booking**
6. **WhatsApp AI Agent - Izumi Hotel (ChakraHQ)**
7. **Vapi Izumi Hotel**
8. **WhatsApp AI Chatbot**

#### Tareas de integración:
- [ ] Revisar y documentar cada workflow JSON
- [ ] Configurar webhooks desde React app a n8n
- [ ] Implementar triggers desde frontend (ej: nuevo booking → webhook n8n)
- [ ] Configurar credenciales en n8n Railway
  - SendGrid para emails
  - Supabase connection
  - Claude API key
  - WhatsApp/ChakraHQ API
  - Vapi API
- [ ] Testing de cada workflow end-to-end
- [ ] Manejo de errores y reintentos
- [ ] Logs y monitoreo de ejecuciones

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

### Sprint 1 (2 semanas) - Fundación Backend
1. 🔴 Integración Supabase - Payments
2. 🔴 Integración Supabase - Messages
3. 🔴 Testing básico (unit + integration)
4. 🔴 Seguridad básica (headers, validation)

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

**Última actualización:** 16 Diciembre 2025, 14:50
**Versión:** 1.0
**Mantenedor:** José Carrallo

---

*Generado con Claude Code*
