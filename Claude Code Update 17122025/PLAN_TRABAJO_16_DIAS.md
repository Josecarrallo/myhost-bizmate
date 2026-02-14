# 🚀 PLAN DE TRABAJO 16 DÍAS - MY HOST BIZMATE MVP

**Período:** 17 Diciembre 2025 → 2 Enero 2026
**Dedicación:** 7-8 horas diarias (112-128 horas totales)
**Objetivo:** MVP funcional completo en producción

---

## 📅 CALENDARIO GENERAL

| Bloque | Días | Horas | Objetivo |
|--------|------|-------|----------|
| **BLOQUE 1** - Crítico | 1-5 | 40h | Sistema estable end-to-end |
| **BLOQUE 2** - Core | 6-9 | 28h | Payments + Messages + Auth |
| **BLOQUE 3** - UX + IA | 10-13 | 28h | Dashboard + 2 Agentes IA |
| **BLOQUE 4** - Polish | 14-16 | 20h | Performance + Monitoring |

---

## 🔴 BLOQUE 1: CRÍTICO (Días 1-5) - 40 HORAS

### 📅 DÍA 1 - Martes 17 Dic (8h) - TESTING N8N PARTE 1

**Objetivo:** Primer workflow funcionando end-to-end

**Tareas:**
- [ ] **9:00-10:30** (1.5h) - Setup y preparación
  - Revisar credenciales n8n Railway
  - Verificar webhooks activos
  - Testear acceso a Supabase desde n8n
  - Verificar SendGrid configurado

- [ ] **10:30-13:00** (2.5h) - Workflow: Booking Confirmation
  - Crear endpoint webhook en app React
  - Implementar trigger desde Bookings.jsx
  - Payload correcto con tenant_id, booking_id, guest_email
  - Headers de autenticación

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:30** (2.5h) - Testing end-to-end
  - Crear booking en app → verificar webhook llamado
  - Verificar ejecución en n8n Railway dashboard
  - Confirmar email enviado (SendGrid logs)
  - Confirmar actualización en Supabase

- [ ] **16:30-18:00** (1.5h) - Logs y debugging
  - Crear tabla workflow_logs en Supabase
  - Implementar logging en app
  - Panel básico de logs en UI
  - Documentar flujo completo

**Entregables Día 1:**
- ✅ 1 workflow funcionando end-to-end
- ✅ Sistema de logs implementado
- ✅ Documentación del flujo

**Archivos a crear/modificar:**
```
src/api/webhooks.js (nuevo)
src/components/Bookings/Bookings.jsx (modificar)
src/utils/logger.js (nuevo)
src/components/Logs/WorkflowLogs.jsx (nuevo)
```

---

### 📅 DÍA 2 - Miércoles 18 Dic (8h) - TESTING N8N PARTE 2

**Objetivo:** 3+ workflows funcionando

**Tareas:**
- [ ] **9:00-11:00** (2h) - Workflow: WhatsApp Chatbot
  - Webhook para recibir mensajes WhatsApp
  - Integración ChakraHQ
  - Respuestas automáticas básicas
  - Guardar conversación en Supabase

- [ ] **11:00-13:00** (2h) - Workflow: Extraer Datos PDF
  - Upload PDF desde app
  - n8n procesa con IA
  - Extrae datos (fecha, monto, concepto)
  - Guarda en tabla payments

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Workflow: Staff Notifications
  - Trigger cuando nuevo booking
  - Envía email a staff
  - Envía WhatsApp a manager
  - Logs de notificaciones enviadas

- [ ] **16:00-18:00** (2h) - Testing y refinamiento
  - Probar los 4 workflows en secuencia
  - Verificar payloads correctos
  - Manejo de errores
  - Retry logic si falla

**Entregables Día 2:**
- ✅ 4 workflows funcionando (total acumulado)
- ✅ Sistema de errores y retry
- ✅ Testing documentado

---

### 📅 DÍA 3 - Jueves 19 Dic (7h) - SEGURIDAD + MULTITENANT PARTE 1

**Objetivo:** Headers de seguridad y validación básica

**Tareas:**
- [ ] **9:00-11:00** (2h) - Security Headers
  - Crear/actualizar vercel.json con headers
  - X-Frame-Options, CSP, HSTS, etc.
  - Testing con securityheaders.com
  - Deploy y verificación

- [ ] **11:00-13:00** (2h) - Validación de inputs
  - Crear src/utils/validation.js
  - Validar emails, fechas, montos
  - Sanitizar inputs (XSS prevention)
  - Implementar en todos los forms

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Auditoría Multitenant
  - Revisar TODAS las tablas en Supabase
  - Listar cuáles tienen tenant_id
  - Listar cuáles NO tienen tenant_id
  - Crear plan de corrección

**Entregables Día 3:**
- ✅ Headers de seguridad activos
- ✅ Validación en todos los forms
- ✅ Auditoría multitenant completa

---

### 📅 DÍA 4 - Viernes 20 Dic (8h) - MULTITENANT PARTE 2

**Objetivo:** RLS y aislamiento de datos funcionando

**Tareas:**
- [ ] **9:00-11:00** (2h) - Corregir schemas
  - Agregar tenant_id a tablas faltantes
  - Crear tabla tenants si no existe
  - Crear índices (idx_tablename_tenant)
  - Migración de datos existentes

- [ ] **11:00-13:00** (2h) - Row Level Security
  - Habilitar RLS en todas las tablas
  - Crear policies de tenant isolation
  - Testing de policies
  - Verificar que funciona correctamente

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Actualizar supabase.js
  - Modificar todos los métodos
  - Agregar filtro por tenant_id
  - Crear getSupabaseClient(tenantId)
  - Testing de cada método

- [ ] **16:00-18:00** (2h) - TenantContext
  - Crear src/context/TenantContext.jsx
  - Hook useTenant()
  - Integrar en App.jsx
  - Testing con 2 tenants diferentes

**Entregables Día 4:**
- ✅ RLS activo en todas las tablas
- ✅ Aislamiento de datos verificado
- ✅ TenantContext implementado

---

### 📅 DÍA 5 - Sábado 21 Dic (7h) - ROUTING + MONITORING

**Objetivo:** Routing multitenant y logs funcionando

**Tareas:**
- [ ] **9:00-11:00** (2h) - Detección de tenant
  - Implementar detección de subdomain
  - Validar tenant existe
  - Cargar configuración de tenant
  - Redirect si tenant no existe

- [ ] **11:00-13:00** (2h) - Sistema de logs completo
  - Tabla workflow_logs refinada
  - Panel de logs en admin
  - Filtros por workflow, status, fecha
  - Export de logs (CSV)

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Testing BLOQUE 1 completo
  - Crear 2 tenants de prueba
  - Testing de aislamiento total
  - Testing de workflows por tenant
  - Testing de logs y monitoring
  - Documentar resultados

**Entregables Día 5:**
- ✅ Routing multitenant funcionando
- ✅ Sistema de logs completo
- ✅ BLOQUE 1 100% COMPLETADO ✅

**🎯 CHECKPOINT BLOQUE 1:**
- Todos los workflows n8n funcionando end-to-end
- Seguridad básica implementada
- Multitenant con RLS activo
- Logs y monitoring operacional

---

## 🔵 BLOQUE 2: CORE FUNCIONAL (Días 6-9) - 28 HORAS

### 📅 DÍA 6 - Domingo 22 Dic (7h) - PAYMENTS PARTE 1

**Objetivo:** Stripe integrado y funcionando

**Tareas:**
- [ ] **9:00-10:30** (1.5h) - Setup Stripe
  - Crear cuenta Stripe (test mode)
  - Obtener API keys
  - npm install @stripe/stripe-js @stripe/react-stripe-js
  - Configurar env variables

- [ ] **10:30-13:00** (2.5h) - Backend Stripe
  - Crear api/create-payment-intent.js
  - Crear api/webhook-stripe.js (confirmaciones)
  - Testing con Stripe CLI
  - Logs de transacciones

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Tabla payments
  - Crear tabla en Supabase
  - Schema completo (amount, status, stripe_id, etc.)
  - RLS policies
  - Métodos en supabaseService
  - Testing CRUD

**Entregables Día 6:**
- ✅ Stripe configurado
- ✅ Backend funcionando
- ✅ Tabla payments lista

---

### 📅 DÍA 7 - Lunes 23 Dic (8h) - PAYMENTS PARTE 2 + MESSAGES PARTE 1

**Objetivo:** Payments UI + Messages backend

**Tareas:**
- [ ] **9:00-12:00** (3h) - Payments UI
  - Componente CheckoutForm
  - Stripe Elements integrado
  - Flow completo: select booking → pay → confirm
  - Feedback visual
  - Testing end-to-end

- [ ] **12:00-13:00** (1h) - Payments + n8n
  - Trigger workflow cuando payment successful
  - Enviar recibo por email
  - Actualizar booking status
  - Testing

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Messages backend
  - Tabla messages en Supabase
  - Schema (tenant_id, booking_id, sender, message, etc.)
  - RLS policies
  - Métodos CRUD en supabaseService
  - Testing

- [ ] **17:00-18:00** (1h) - Supabase Realtime setup
  - Configurar Realtime en tabla messages
  - Testing de subscriptions
  - Documentar uso

**Entregables Día 7:**
- ✅ Payments 100% funcional
- ✅ Messages backend listo
- ✅ Realtime configurado

---

### 📅 DÍA 8 - Martes 24 Dic (6h) - MESSAGES PARTE 2 + AUTH ROLES

**Objetivo:** Messages UI + Sistema de roles

**Tareas:**
- [ ] **9:00-12:00** (3h) - Messages UI
  - Componente MessageThread
  - Realtime updates funcionando
  - Send message
  - Mark as read
  - Testing con 2 usuarios simultáneos

- [ ] **12:00-13:00** BREAK

- [ ] **13:00-15:00** (2h) - Sistema de roles
  - Tabla user_roles en Supabase
  - Schema (user_id, tenant_id, role)
  - ROLES: owner, manager, staff, guest
  - RLS policies
  - Métodos en supabaseService

- [ ] **15:00-16:00** (1h) - Hook usePermissions
  - Crear src/utils/authorization.js
  - PERMISSIONS object
  - hasPermission function
  - Hook usePermissions()
  - Testing

**Entregables Día 8:**
- ✅ Messages 100% funcional
- ✅ Sistema de roles implementado

---

### 📅 DÍA 9 - Miércoles 25 Dic (7h) - AUTH AVANZADA + TESTING BLOQUE 2

**Objetivo:** Permisos funcionando + Testing

**Tareas:**
- [ ] **9:00-11:00** (2h) - Permisos en UI
  - Proteger botones por permiso
  - Proteger rutas por permiso
  - UI para gestionar roles (owners only)
  - Testing de permisos

- [ ] **11:00-13:00** (2h) - 2FA (opcional pero rápido)
  - Supabase MFA enrollment
  - QR code para Google Authenticator
  - Verify code
  - Testing
  - Si no da tiempo, skip

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Testing BLOQUE 2 completo
  - Testing de payments con diferentes montos
  - Testing de messages entre usuarios
  - Testing de roles y permisos
  - Testing de edge cases
  - Documentar bugs encontrados
  - Fix bugs críticos

**Entregables Día 9:**
- ✅ Permisos funcionando en toda la app
- ✅ 2FA implementado (o skip si no da tiempo)
- ✅ BLOQUE 2 100% COMPLETADO ✅

**🎯 CHECKPOINT BLOQUE 2:**
- Payments con Stripe funcional
- Messages con Realtime funcional
- Roles y permisos implementados
- Testing completo realizado

---

## 🟢 BLOQUE 3: UX + IA (Días 10-13) - 28 HORAS

### 📅 DÍA 10 - Jueves 26 Dic (8h) - DASHBOARD RENOVADO

**Objetivo:** Nuevo dashboard con mensaje claro y agentes

**Tareas:**
- [ ] **9:00-11:00** (2h) - Diseño y estructura
  - Layout 3 columnas (Agentes | Main | Opciones)
  - Componentes base (AIAgentCard, QuickAction)
  - Mensaje de bienvenida claro
  - Estructura HTML/CSS

- [ ] **11:00-13:00** (2h) - KPIs mejorados
  - Actualizar diseño de KPICard
  - Agregar más métricas (Revenue MTD, YTD, etc.)
  - Gráficos más claros (Recharts)
  - Datos reales desde Supabase

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Panel de Agentes IA
  - AIAgentCard con status (active/inactive)
  - Indicadores de última actividad
  - Botón para abrir chat
  - Diseño visual atractivo

- [ ] **16:00-18:00** (2h) - Panel de Opciones
  - QuickAction components
  - Links a Settings, Profile, Reports, etc.
  - Badges para notificaciones
  - Testing de navegación

**Entregables Día 10:**
- ✅ Dashboard renovado 100%
- ✅ Mensaje claro del producto
- ✅ UI preparada para agentes IA

---

### 📅 DÍA 11 - Viernes 27 Dic (7h) - AGENTE INTERNO PARTE 1

**Objetivo:** Agente Interno con Claude funcionando

**Tareas:**
- [ ] **9:00-10:30** (1.5h) - Setup Claude API
  - npm install @anthropic-ai/sdk
  - Crear cuenta Anthropic
  - Obtener API key
  - Configurar env variables
  - Testing básico

- [ ] **10:30-13:00** (2.5h) - InternalAgent class
  - Crear src/services/aiAgents/internalAgent.js
  - System prompt optimizado
  - Método chat(message, context)
  - Método generateReport(type)
  - Método suggestPricing(propertyId)
  - Testing con diferentes prompts

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - UI del Agente Interno
  - Componente InternalAgentChat.jsx
  - Interface de chat
  - Enviar mensaje
  - Recibir respuesta
  - Loading states
  - Error handling
  - Testing end-to-end

**Entregables Día 11:**
- ✅ Agente Interno funcionando
- ✅ UI de chat operacional
- ✅ System prompt optimizado

---

### 📅 DÍA 12 - Sábado 28 Dic (7h) - AGENTE EXTERNO

**Objetivo:** Agente Externo + WhatsApp

**Tareas:**
- [ ] **9:00-11:00** (2h) - ExternalAgent class
  - Crear src/services/aiAgents/externalAgent.js
  - System prompt para huéspedes
  - Método chat con contexto de booking
  - Respuestas en Español e Inglés
  - Testing

- [ ] **11:00-13:00** (2h) - UI del Agente Externo
  - Componente ExternalAgentChat.jsx
  - Similar a Internal pero tema diferente
  - Testing

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Integración WhatsApp
  - Webhook para recibir WhatsApp
  - api/whatsapp-webhook.js
  - Identificar booking por teléfono
  - Call ExternalAgent
  - Responder via n8n
  - Testing end-to-end con WhatsApp real

**Entregables Día 12:**
- ✅ Agente Externo funcionando
- ✅ WhatsApp integration completa
- ✅ Respuestas automáticas 24/7

---

### 📅 DÍA 13 - Domingo 29 Dic (6h) - TESTING + REFINAMIENTO AGENTES

**Objetivo:** Agentes pulidos y bien testeados

**Tareas:**
- [ ] **9:00-11:00** (2h) - Fine-tuning prompts
  - Mejorar system prompts basado en testing
  - Agregar más contexto de datos
  - Optimizar respuestas
  - Testing con casos reales

- [ ] **11:00-13:00** (2h) - Features adicionales agentes
  - Historial de conversaciones en Supabase
  - Analytics de uso de agentes
  - Feedback de respuestas
  - Rate limiting para evitar abuse

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Testing BLOQUE 3 completo
  - Testing de dashboard
  - Testing de ambos agentes
  - Testing de integración WhatsApp
  - Testing de edge cases
  - Documentar y fix bugs

**Entregables Día 13:**
- ✅ Agentes optimizados
- ✅ Historial y analytics
- ✅ BLOQUE 3 100% COMPLETADO ✅

**🎯 CHECKPOINT BLOQUE 3:**
- Dashboard renovado con mensaje claro
- Agente Interno funcionando
- Agente Externo + WhatsApp funcionando
- Ambos agentes bien testeados

---

## 🟣 BLOQUE 4: POLISH + PRODUCTION (Días 14-16) - 20 HORAS

### 📅 DÍA 14 - Lunes 30 Dic (7h) - PERFORMANCE

**Objetivo:** App rápida y optimizada

**Tareas:**
- [ ] **9:00-11:00** (2h) - Code splitting
  - Implementar React.lazy() en rutas
  - Suspense con loading states
  - Bundle analysis (vite-bundle-visualizer)
  - Identificar bundles grandes

- [ ] **11:00-13:00** (2h) - Optimizaciones
  - Image optimization (lazy load)
  - Memoization en componentes pesados (React.memo)
  - useMemo y useCallback donde aplique
  - Virtualización si hay listas largas

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-17:00** (3h) - Testing performance
  - Lighthouse audit
  - Web Vitals (LCP, FID, CLS)
  - Optimizar hasta LCP < 2.5s
  - Deploy y verificar en producción

**Entregables Día 14:**
- ✅ Code splitting implementado
- ✅ Performance optimizado
- ✅ LCP < 2.5s verificado

---

### 📅 DÍA 15 - Martes 31 Dic (6h) - MONITORING + DOCS

**Objetivo:** Sentry + documentación básica

**Tareas:**
- [ ] **9:00-11:00** (2h) - Sentry setup
  - Crear cuenta Sentry
  - npm install @sentry/react
  - Configurar en app
  - Testing error tracking
  - Verificar errors capturados

- [ ] **11:00-13:00** (2h) - Analytics básico
  - Google Analytics o Plausible
  - Tracking de eventos clave
  - Dashboard de métricas
  - Privacy compliance

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Documentación
  - README.md actualizado
  - Deployment guide
  - Environment variables guide
  - Troubleshooting guide
  - API documentation básica

**Entregables Día 15:**
- ✅ Sentry activo
- ✅ Analytics configurado
- ✅ Documentación completa

---

### 📅 DÍA 16 - Miércoles 1 Ene (7h) - TESTING FINAL + DEPLOY

**Objetivo:** MVP en producción, 100% funcional

**Tareas:**
- [ ] **9:00-11:00** (2h) - Testing end-to-end completo
  - User flow completo como Owner
  - User flow completo como Guest
  - Testing de todos los workflows n8n
  - Testing de pagos
  - Testing de mensajería
  - Testing de agentes IA

- [ ] **11:00-13:00** (2h) - Bug fixing final
  - Fix todos los bugs encontrados
  - Refinamiento de UI
  - Últimos ajustes

- [ ] **13:00-14:00** BREAK

- [ ] **14:00-16:00** (2h) - Deploy a producción
  - Verificar env variables en Vercel
  - Build final
  - Deploy
  - Testing en producción
  - Smoke tests

- [ ] **16:00-17:00** (1h) - Celebración 🎉
  - Backup final del proyecto
  - Commit final
  - Documentar logros
  - Plan para siguientes pasos
  - ¡MVP COMPLETADO!

**Entregables Día 16:**
- ✅ Testing completo realizado
- ✅ Bugs críticos resueltos
- ✅ MVP en producción ✅
- ✅ PROYECTO COMPLETADO 🎉

---

## ✅ CHECKLIST FINAL MVP

### Funcionalidades Core
- [x] Properties CRUD con Supabase
- [x] Bookings CRUD con Supabase
- [ ] Payments con Stripe funcionando
- [ ] Messages con Realtime funcionando
- [ ] 4+ workflows n8n end-to-end
- [ ] Agente Interno (IA) operacional
- [ ] Agente Externo + WhatsApp operacional

### Arquitectura
- [ ] Multitenant con RLS activo
- [ ] Routing por subdomain
- [ ] Sistema de roles y permisos
- [ ] Seguridad básica (headers, validation)

### Monitoring & Performance
- [ ] Logs de workflows
- [ ] Sentry error tracking
- [ ] Performance optimizado (LCP < 2.5s)
- [ ] Analytics configurado

### Deployment
- [ ] Deploy en Vercel funcionando
- [ ] n8n en Railway funcionando
- [ ] Supabase en producción
- [ ] Stripe en test mode (listo para prod)

---

## 📊 MÉTRICAS DE ÉXITO

**Al 2 de Enero 2026 deberías tener:**

✅ **Funcionalidad:**
- 100% de módulos con backend funcional
- 4+ workflows n8n integrados
- 2 agentes IA respondiendo
- Payments procesando transacciones
- Messages en tiempo real

✅ **Arquitectura:**
- Multitenant soportando 2+ tenants
- Datos aislados correctamente
- Roles y permisos funcionando

✅ **Calidad:**
- 0 bugs críticos
- Performance: LCP < 2.5s
- Error tracking activo
- Logs de debugging disponibles

✅ **Producción:**
- App desplegada en Vercel
- Workflows en Railway
- Base de datos en Supabase
- Todo funcionando end-to-end

---

## 💪 REGLAS DE TRABAJO

1. **Enfoque total:** 7-8 horas diarias, sin distracciones
2. **Claude Code activo:** Trabaja CONMIGO, usa mi ayuda al máximo
3. **Commits diarios:** Al final de cada día, commit de progreso
4. **Testing constante:** No avanzar sin probar lo anterior
5. **Decisiones rápidas:** MVP primero, perfección después
6. **No scope creep:** SOLO lo del plan, nada más
7. **Documentar problemas:** Log de bugs y soluciones
8. **Celebrar logros:** Cada bloque completado es un win

---

## 🚨 ESCALATION PLAN

**Si algo se atrasa:**
1. **Prioridad 1:** Bloques 1 y 2 (críticos)
2. **Prioridad 2:** Bloque 3 (IA puede ser más simple)
3. **Prioridad 3:** Bloque 4 (puede ser después)

**Días buffer:** Ninguno, pero si algo falla:
- Reducir scope de agentes IA
- Simplificar dashboard
- Posponer 2FA si es necesario

---

## 📞 SOPORTE DURANTE EL PROCESO

**Claude Code estará contigo:**
- Generando código
- Debuggeando errores
- Optimizando performance
- Creando tests
- Escribiendo documentación
- Resolviendo problemas

**No estás solo en esto.** Trabajamos juntos, día a día, hasta el MVP.

---

## 🎯 PRÓXIMO PASO INMEDIATO

**¿Listo para empezar HOY (Día 1)?**

Si dices "SÍ", empezamos AHORA con:
1. Revisar credenciales n8n Railway
2. Configurar primer webhook
3. Testing de Booking Confirmation workflow

**¿Arrancamos?** 💪🚀

---

**Creado:** 17 Diciembre 2025
**Por:** José Carrallo + Claude Code
**Objetivo:** MVP funcional en 16 días
**Deadline:** 2 Enero 2026

---

*¡VAMOS A LOGRARLO!* 🔥
