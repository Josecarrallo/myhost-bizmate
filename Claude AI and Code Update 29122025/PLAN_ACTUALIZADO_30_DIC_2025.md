# 🎯 PLAN ESTRATÉGICO ACTUALIZADO - MY HOST BIZMATE
**Fecha:** 30 Diciembre 2025 | **Versión:** 4.0 (Estrategia Opción A Confirmada)
**Estado Actual:** Voice AI ✅ | Marketing & Growth Phase 1 ✅ | Guest Communications ✅
**Progreso:** ~40% completado
**Estrategia:** Features primero → Multi-tenant cuando haya clientes confirmados

---

## 🚀 DECISIÓN ESTRATÉGICA: OPCIÓN A

### Por qué Opción A
✅ **Contexto:**
- Estás solo con carga de trabajo enorme
- Izumi Hotel aún no abre (verano 2026)
- Necesitas demos funcionales YA para captar clientes
- No hay clientes reales confirmados todavía

✅ **Estrategia confirmada:**
1. **Ahora (esta semana):** Completar features críticos para demo
2. **Enero semana 1-2:** Pulir Marketing & Growth existente
3. **Enero semana 3:** Implementar Multi-Tenant ANTES de onboard clientes reales

✅ **Ventajas:**
- Multi-tenant sin features = nada que vender
- Features sin multi-tenant = puedes hacer demos y conseguir feedback
- Cuando tengas clientes reales confirmados → pausa features y haz multi-tenant intensivo

---

## 📅 CALENDARIO SEMANA POR SEMANA

```
┌─────────────────────────────────────────────────────────────────────┐
│  SEMANA 1: 30-31 DIC 2025 (2 días - 10h)                           │
│  🔴 Features Críticos para Demo                                     │
│  → Guest Communications Backend                                     │
│  → WhatsApp Funnel Tracking                                         │
│  → Reviews Management Básico                                        │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  SEMANA 2: 2-5 ENE 2026 (4 días - 20h)                             │
│  🔴 Marketing & Growth - Backend Real                               │
│  → Content Planner con calendario funcional                         │
│  → Meta Ads Manager con métricas reales                             │
│  → Instagram/Facebook integración                                   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  SEMANA 3: 6-10 ENE 2026 (5 días - 25h)                            │
│  🟡 Internal Agent + Automation                                     │
│  → AI Assistant para staff (consultas internas)                     │
│  → Instagram Monitoring workflow                                    │
│  → Social Media Publisher                                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  SEMANA 4-5: 13-24 ENE 2026 (10 días - 35h)                        │
│  🏢 MULTI-TENANT ARCHITECTURE (CRÍTICO ANTES DE CLIENTES)          │
│  → Supabase migrations (tenant_id en todas las tablas)             │
│  → RLS Policies (aislamiento por tenant)                            │
│  → Update all services (pasar tenant_id)                            │
│  → Testing exhaustivo de aislamiento                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  SEMANA 6+: FEB 2026 onwards                                        │
│  🔴 Integraciones Críticas                                          │
│  → Stripe Payments                                                  │
│  → DOMUS Channel Manager                                            │
│  → Meta Ads OAuth Real                                              │
└─────────────────────────────────────────────────────────────────────┘
```

**TOTAL FASE 0-1:** ~90 horas | 18 días laborables | 4-5 semanas

---

## 🔴 SEMANA 1: 30-31 DIC 2025 (ESTA SEMANA)

### DÍA 1: Lunes 30 Diciembre (5 horas)

#### Tarea 1.1: Guest Communications Backend (3h)
**Prioridad:** 🔴 ALTA
**Estado:** Pendiente

**Subtareas:**
1. Crear tabla `guest_contacts` en Supabase (30min)
   ```sql
   CREATE TABLE guest_contacts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id),
     full_name TEXT NOT NULL,
     email TEXT,
     whatsapp TEXT,
     segment TEXT[], -- ['vip', 'longstay', 'recent', etc]
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. Crear tabla `email_drafts` en Supabase (20min)
   ```sql
   CREATE TABLE email_drafts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id),
     segment_id TEXT,
     subject TEXT,
     body TEXT,
     tone TEXT CHECK (tone IN ('formal', 'friendly', 'promo')),
     created_by UUID REFERENCES auth.users(id),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. Crear tabla `email_logs` en Supabase (20min)
   ```sql
   CREATE TABLE email_logs (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id),
     segment_id TEXT,
     subject TEXT,
     recipients_count INTEGER,
     sent_at TIMESTAMPTZ DEFAULT NOW(),
     status TEXT CHECK (status IN ('sent', 'failed', 'pending'))
   );
   ```

4. Crear `src/services/guestCommunicationsService.js` (1h)
   - getGuestStats()
   - getGuestSegments()
   - sendEmail() con SendGrid
   - saveDraft()
   - generateEmailDraft() con OpenAI

5. Actualizar `EmailCommunication.jsx` para usar servicio real (40min)
   - useEffect para cargar stats reales
   - handleSendEmail real
   - handleSaveDraft real
   - Loading states
   - Error handling

6. Testing y fixes (20min)

---

#### Tarea 1.2: WhatsApp Funnel Tracking (2h)
**Prioridad:** 🔴 ALTA
**Estado:** Pendiente

**Subtareas:**
1. Crear tabla `whatsapp_leads` en Supabase (30min)
   ```sql
   CREATE TABLE whatsapp_leads (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id),
     phone_number TEXT NOT NULL,
     guest_name TEXT,
     stage TEXT CHECK (stage IN ('nuevo', 'interesado', 'cotización', 'reserva_confirmada')),
     last_message TEXT,
     last_interaction TIMESTAMPTZ DEFAULT NOW(),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. Crear workflow n8n "WhatsApp Funnel Tracking" (1h)
   - Webhook trigger desde WhatsApp Concierge
   - Analizar mensaje para determinar etapa
   - Update o INSERT en whatsapp_leads
   - Log en tabla de eventos

3. Crear `src/components/WhatsAppFunnel/WhatsAppFunnel.jsx` (30min)
   - Dashboard visual con embudo
   - Stats: Total leads, por etapa, tasa de conversión
   - Tabla de leads recientes
   - Filtros por etapa

**Entregables:**
- Migration: `supabase/migrations/013_whatsapp_funnel.sql`
- Workflow n8n activo
- Componente UI funcional

---

### DÍA 2: Martes 31 Diciembre (5 horas - medio día)

#### Tarea 2.1: Reviews Management - UI Básico (2h)
**Prioridad:** 🔴 ALTA
**Estado:** Pendiente

**Subtareas:**
1. Leer archivo actual `ReviewsManagement.jsx` (10min)
2. Agregar mock data de reviews (30min)
   - Google Business Profile reviews
   - TripAdvisor reviews
   - Booking.com reviews (futuro)

3. Dashboard de reviews (1h)
   - KPIs: Total reviews, Average rating, Response rate, Sentiment
   - Gráfico de rating distribution (Recharts)
   - Lista de reviews recientes
   - Filtros por fuente (Google, TripAdvisor)

4. Sección "AI Auto-Reply" (20min)
   - Toggle para habilitar/deshabilitar
   - Preview de respuesta generada
   - Botón "Approve & Send"

---

#### Tarea 2.2: Reviews Management - Google Business API (2h)
**Prioridad:** 🔴 ALTA
**Estado:** Pendiente

**Subtareas:**
1. Research Google Business Profile API (30min)
   - Documentación oficial
   - Authentication (OAuth 2.0)
   - Endpoints disponibles

2. Crear `src/services/reviewsService.js` (1h)
   - fetchGoogleReviews()
   - replyToGoogleReview()
   - Integration con Google My Business API

3. Crear workflow n8n "Review Response AI" (30min)
   - Webhook trigger cuando llega nueva review
   - OpenAI genera respuesta personalizada
   - Envía notificación al propietario para aprobación
   - Si aprueba → POST reply a Google API

**Entregables:**
- reviewsService.js funcional
- Workflow n8n activo
- UI actualizada con reviews reales

---

#### Tarea 2.3: Testing & Bug Fixes (1h)
**Prioridad:** 🟡 MEDIA
**Estado:** Pendiente

**Checklist:**
- [ ] Guest Communications: Envío de email funciona
- [ ] Guest Communications: Drafts se guardan en Supabase
- [ ] WhatsApp Funnel: Dashboard muestra datos reales
- [ ] Reviews: Google API trae reviews reales
- [ ] Reviews: AI genera respuestas coherentes
- [ ] No hay errores en consola
- [ ] Performance es aceptable

---

## 📊 MÉTRICAS DE ÉXITO - SEMANA 1

**Al final de esta semana (31 DIC) debes tener:**
✅ Guest Communications con backend real (envío de emails funciona)
✅ WhatsApp Funnel Tracking dashboard activo
✅ Reviews Management con Google API conectada
✅ 3 nuevos workflows n8n activos
✅ 3 nuevas tablas Supabase creadas
✅ 0 bugs críticos

**KPI:**
- **Features completados:** 3/3
- **Backend integration:** 100%
- **Workflows n8n:** 6 activos (antes 3, ahora 6)
- **Tiempo invertido:** ~10 horas

---

## 🟡 SEMANA 2: 2-5 ENE 2026 (PRÓXIMA SEMANA)

### Objetivo: Marketing & Growth Backend Real

#### Tarea 3.1: Content Planner - Calendario Funcional (6h)
**Prioridad:** 🔴 ALTA

**Subtareas:**
1. Crear tabla `content_calendar` en Supabase
2. CRUD completo para posts programados
3. Integración con Meta Graph API (draft posts)
4. Vista de calendario (react-big-calendar o similar)
5. Preview de posts antes de publicar

---

#### Tarea 3.2: Meta Ads Manager - Métricas Reales (6h)
**Prioridad:** 🔴 ALTA

**Subtareas:**
1. Meta Ads API - OAuth flow
2. Fetch real campaigns data
3. Dashboard con métricas: Spend, Impressions, Clicks, CTR, CPC, Conversions
4. Gráficos con Recharts (spend over time, CTR trends)
5. Tabla de campañas activas con performance

---

#### Tarea 3.3: Instagram/Facebook Integration (8h)
**Prioridad:** 🔴 ALTA

**Subtareas:**
1. Meta Graph API - Posts endpoint
2. Publicar en Instagram desde app
3. Publicar en Facebook desde app
4. Preview antes de publicar
5. Scheduler para posts futuros
6. Analytics de posts (likes, comments, shares)

**Total Semana 2:** ~20 horas

---

## 🟢 SEMANA 3: 6-10 ENE 2026

### Objetivo: Internal Agent + Automation

#### Tarea 4.1: Internal Agent (AI Assistant Staff) (10h)
**Prioridad:** 🟡 MEDIA

**Features:**
- "¿Cuántas reservas tenemos en enero?"
- "¿Qué huéspedes llegan mañana?"
- "¿Cuál es la ocupación esta semana?"
- Chat interface en `AIAssistant.jsx`
- Workflow n8n con AI Agent + Tools

---

#### Tarea 4.2: Instagram Monitoring (8h)
**Prioridad:** 🟡 MEDIA

**Features:**
- Webhook desde Instagram (comentarios + DMs)
- AI genera respuesta
- Human approval flow
- Dashboard de interacciones

---

#### Tarea 4.3: Social Media Publisher (7h)
**Prioridad:** 🟡 MEDIA

**Features:**
- Crear post una vez
- Publicar en Instagram + Facebook simultáneamente
- Scheduler de contenido
- Vista preview

**Total Semana 3:** ~25 horas

---

## 🏢 SEMANA 4-5: 13-24 ENE 2026

### MULTI-TENANT ARCHITECTURE (CRÍTICO)

**⚠️ IMPORTANTE:** NO onboard clientes reales hasta completar esta fase

#### Tarea 5.1: Supabase Migrations (10h)
**Prioridad:** 🔴 CRÍTICA

**Subtareas:**
1. Crear tabla `tenants` (1h)
   ```sql
   CREATE TABLE tenants (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     slug TEXT UNIQUE NOT NULL,
     subscription_plan TEXT,
     status TEXT CHECK (status IN ('active', 'suspended', 'trial')),
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

2. Agregar `tenant_id` a TODAS las tablas (4h)
   - properties
   - bookings
   - guests
   - payments
   - messages
   - reviews
   - campaigns
   - workflows
   - ai_conversations
   - notifications
   - marketing_connections
   - marketing_campaigns
   - marketing_posts
   - marketing_reviews
   - sites
   - domains
   - site_settings
   - guest_contacts (nuevo)
   - email_drafts (nuevo)
   - email_logs (nuevo)
   - whatsapp_leads (nuevo)
   - content_calendar (nuevo)

3. Crear índices en tenant_id (1h)
4. Migrar datos existentes a tenant demo (2h)
5. Actualizar foreign keys (2h)

**Entregables:**
- `supabase/migrations/014_multi_tenant_base.sql`
- Todos los datos existentes migrados a tenant_id = "izumi-hotel"

---

#### Tarea 5.2: RLS Policies (12h)
**Prioridad:** 🔴 CRÍTICA

**Subtareas:**
1. Enable RLS en todas las tablas (1h)
2. Crear policies por tabla (8h)
   ```sql
   -- Ejemplo para properties
   CREATE POLICY "Users can view own tenant properties"
     ON properties FOR SELECT
     USING (tenant_id = current_setting('app.tenant_id')::uuid);

   CREATE POLICY "Users can insert own tenant properties"
     ON properties FOR INSERT
     WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

   CREATE POLICY "Users can update own tenant properties"
     ON properties FOR UPDATE
     USING (tenant_id = current_setting('app.tenant_id')::uuid);

   CREATE POLICY "Users can delete own tenant properties"
     ON properties FOR DELETE
     USING (tenant_id = current_setting('app.tenant_id')::uuid);
   ```

3. Testing de aislamiento (3h)
   - Crear 2 tenants de prueba
   - Insertar datos en cada uno
   - Verificar que tenant A NO ve datos de tenant B

**Entregables:**
- `supabase/migrations/015_rls_policies.sql`
- Documento de testing con resultados

---

#### Tarea 5.3: Update All Services (8h)
**Prioridad:** 🔴 CRÍTICA

**Archivos a modificar:**
1. `src/services/supabase.js` - Agregar tenant context (2h)
2. `src/services/dataService.js` - Pasar tenant_id en queries (2h)
3. `src/services/guestCommunicationsService.js` - tenant_id (1h)
4. `src/services/reviewsService.js` - tenant_id (1h)
5. `src/services/marketingService.js` - tenant_id (1h)
6. `src/services/mySiteService.js` - tenant_id (1h)

**Pattern:**
```javascript
// Antes
const { data } = await supabase
  .from('properties')
  .select('*');

// Después
const { data } = await supabase
  .from('properties')
  .select('*')
  .eq('tenant_id', getCurrentTenantId());
```

---

#### Tarea 5.4: Testing Exhaustivo (5h)
**Prioridad:** 🔴 CRÍTICA

**Checklist:**
- [ ] Crear 3 tenants de prueba
- [ ] Cada tenant tiene properties, bookings, guests separados
- [ ] Login como user de Tenant A → solo ve datos de A
- [ ] Login como user de Tenant B → solo ve datos de B
- [ ] Intentar acceder a data de otro tenant via API → falla con RLS
- [ ] Workflows n8n respetan tenant_id
- [ ] Emails solo se envían a guests del tenant correcto
- [ ] WhatsApp solo envía a números del tenant correcto
- [ ] No hay data leakage entre tenants

**Total Semana 4-5:** ~35 horas

---

## 📈 ROADMAP COMPLETO

```
DIC 30-31 (10h)  → Guest Comms + Funnel + Reviews
ENE 2-5 (20h)    → Marketing & Growth Backend
ENE 6-10 (25h)   → Internal Agent + Automation
ENE 13-24 (35h)  → 🏢 MULTI-TENANT (CRÍTICO)
───────────────────────────────────────────────
TOTAL: ~90 horas | 18 días laborables | 4-5 semanas
```

**Después de esto:**
- ✅ MVP demo completamente funcional
- ✅ Multi-tenant seguro y probado
- ✅ Listo para onboard clientes reales
- ✅ Marketing & Growth funcional
- ✅ Voice AI + WhatsApp funcionando
- ✅ Reviews + automation activa

---

## 🎯 CRITERIOS DE ÉXITO

### Para empezar a vender (después de Semana 3)
- ✅ Todas las features core funcionando
- ✅ Demos impresionantes para mostrar
- ✅ UI pulida y sin bugs críticos

### Para onboard clientes (después de Semana 5)
- ✅ Multi-tenant 100% funcional
- ✅ RLS testeado exhaustivamente
- ✅ Aislamiento de datos garantizado
- ✅ Documentación de onboarding

---

## 📝 NOTAS IMPORTANTES

### Sobre Multi-Tenant
⚠️ **NO skippear esta fase**
- Es tentador onboard clientes antes de tener multi-tenant
- PERO: Un data leak puede destruir tu reputación
- MEJOR: Esperar 2 semanas más y hacerlo bien

### Sobre Stress Management
💭 **Recordatorio para José:**
- Estás haciendo un trabajo increíble
- Es normal sentir presión cuando estás solo
- Toma breaks regulares
- Celebra cada milestone completado
- El progreso es real y visible

### Sobre Prioridades
📌 **Si surge algo urgente:**
1. Evalúa si es realmente blocker
2. Si sí → ajusta plan y comunica
3. Si no → agrega a backlog para después de multi-tenant

---

## ✅ PRÓXIMOS PASOS INMEDIATOS

**Mañana 30 DIC - Primera tarea:**
1. Abrir Supabase Dashboard
2. Crear migration `013_guest_communications.sql`
3. Crear tabla `guest_contacts`
4. Crear tabla `email_drafts`
5. Crear tabla `email_logs`
6. Empezar `guestCommunicationsService.js`

**Comando para empezar:**
```bash
# Crear nueva migration
touch supabase/migrations/013_guest_communications.sql

# Abrir para editar
code supabase/migrations/013_guest_communications.sql
```

---

**Última actualización:** 30 Diciembre 2025, 00:30
**Próxima revisión:** 5 Enero 2026 (después de Semana 2)
**Estrategia:** Opción A confirmada - Features primero, Multi-tenant antes de clientes
