# Workflows & Automations - Plan Aprobado
**Fecha:** 30 de Diciembre, 2025
**Complejidad:** MEDIA ✅
**Tiempo estimado:** 4-5 horas
**Estado:** ✅ APROBADO POR JOSÉ

---

## 🎯 ESTRATEGIA: Implementación Gradual

### ✅ FASE 1 (HOY): UI Completa + Base Funcional
**Lo que vamos a hacer:**
- UI 100% completa y visual
- Toggles funcionan (guardan en Supabase)
- WorkflowTester llama a n8n (reusar existente)
- Quick Actions abren modal pero son "Coming Soon"
- Stats y Activity con mock data
- Todo listo para agregar webhooks después

### ⏳ FASE 2 (FUTURO): Webhooks Reales
**Para después:**
- Conectar Quick Actions con webhooks reales
- Auto-refresh de activity
- Sincronización con n8n API
- Stats reales desde ejecuciones

---

## 📋 PLAN DE IMPLEMENTACIÓN

### Paso 1: Base de Datos (30 min)
**Archivos:**
- `supabase/migrations/013_workflows_tables.sql`

**Contenido:**
```sql
CREATE TABLE workflow_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  workflow_key VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_executed_at TIMESTAMP,
  execution_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, workflow_key)
);

CREATE TABLE workflow_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL,
  workflow_key VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  trigger_type VARCHAR(20) NOT NULL,
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_settings_property ON workflow_settings(property_id);
CREATE INDEX idx_workflow_executions_property ON workflow_executions(property_id);
CREATE INDEX idx_workflow_executions_executed ON workflow_executions(executed_at DESC);
```

**Acción:** Ejecutar en Supabase

---

### Paso 2: Configuración Base (20 min)
**Archivos:**
1. `src/lib/workflowsConfig.js` - Arrays de workflows
2. `src/services/workflowsMocks.js` - Mock data

**workflowsConfig.js:**
```javascript
export const automatedWorkflows = [
  {
    key: "whatsapp_concierge",
    name: "WhatsApp AI Concierge",
    description: "AI assistant responds to WhatsApp messages 24/7",
    icon: "MessageSquare",
    color: "green",
  },
  {
    key: "voice_receptionist",
    name: "Voice AI Receptionist",
    description: "AI handles phone calls and takes reservations",
    icon: "Phone",
    color: "blue",
  },
  {
    key: "booking_confirmation",
    name: "Booking Confirmation",
    description: "Automatically sends email & WhatsApp when booking is created",
    icon: "CheckCircle",
    color: "emerald",
  },
  {
    key: "daily_recommendations",
    name: "Daily Guest Recommendations",
    description: "Sends personalized recommendations to in-house guests every morning",
    icon: "Sparkles",
    color: "purple",
    comingSoon: true,
  }
];

export const quickActions = [
  {
    key: "send_welcome_email",
    name: "Send Welcome Email",
    description: "Send welcome email to a specific guest",
    icon: "Mail",
    color: "orange",
    comingSoon: true, // Por ahora
  },
  {
    key: "generate_occupancy_report",
    name: "Generate Occupancy Report",
    description: "Generate PDF report of occupancy for selected dates",
    icon: "BarChart3",
    color: "blue",
    comingSoon: true,
  },
  {
    key: "sync_availability",
    name: "Sync Availability",
    description: "Manually sync room availability across all channels",
    icon: "RefreshCw",
    color: "teal",
    comingSoon: true,
  },
  {
    key: "send_promo_campaign",
    name: "Send Promo Campaign",
    description: "Send promotional offer to past guests",
    icon: "Megaphone",
    color: "pink",
    comingSoon: true,
  }
];

export const scheduledTasks = [
  {
    key: "weekly_revenue_report",
    name: "Weekly Revenue Report",
    description: "Sends revenue summary every Monday at 9:00 AM",
    icon: "Calendar",
    color: "indigo",
    schedule: "Every Monday, 9:00 AM",
    nextRun: "2025-01-06 09:00",
    comingSoon: true
  },
  {
    key: "social_media_post",
    name: "Social Media Auto-Post",
    description: "Publishes scheduled content to Instagram/Facebook",
    icon: "Share2",
    color: "rose",
    schedule: "Daily, 10:00 AM",
    nextRun: "2025-12-31 10:00",
    comingSoon: true
  }
];
```

**workflowsMocks.js:**
```javascript
export const mockStats = {
  activeWorkflows: 3,
  totalExecutions: 348,
  timeSaved: "24h",
  successRate: 98
};

export const mockRecentActivity = [
  {
    id: 1,
    workflow: "Booking Confirmation",
    status: "success",
    time: "2 min ago",
    details: "Email sent to john@email.com"
  },
  {
    id: 2,
    workflow: "WhatsApp Concierge",
    status: "success",
    time: "5 min ago",
    details: "Replied to +1234567890"
  },
  {
    id: 3,
    workflow: "Voice AI",
    status: "success",
    time: "1 hour ago",
    details: "Call handled - New booking inquiry"
  },
  {
    id: 4,
    workflow: "Sync Availability",
    status: "error",
    time: "2 hours ago",
    details: "Channel manager timeout"
  }
];
```

---

### Paso 3: Servicio (30 min)
**Archivo:** `src/services/workflowsService.js`

**Funcionalidad:**
```javascript
// Solo 3 métodos por ahora:
1. getWorkflowSettings(propertyId) - Leer de Supabase
2. toggleWorkflow(propertyId, workflowKey, isActive) - Update Supabase
3. getRecentActivity(propertyId) - Mock data por ahora
```

---

### Paso 4: Componentes (2.5 horas)

#### 4.1 StatsCards.jsx (20 min)
**Propósito:** 4 KPI cards
**Mock data:** mockStats
**Layout:** Grid 4 columnas, stack en mobile

#### 4.2 WorkflowTester.jsx (10 min)
**Propósito:** Reusar existente o crear card simple
**Funcionalidad:** Botones para WhatsApp AI y Voice AI

#### 4.3 QuickActionsGrid.jsx (30 min)
**Propósito:** Grid de 4 acciones
**Funcionalidad:** Todos muestran badge "Coming Soon"
**Layout:** 4 cards en grid

#### 4.4 AutomatedWorkflows.jsx (40 min)
**Propósito:** Lista con toggles
**Funcionalidad:**
- Toggle ON/OFF
- Llama a workflowsService.toggleWorkflow()
- Toast de confirmación
- 3 activos, 1 "Coming Soon"

#### 4.5 ScheduledTasks.jsx (15 min)
**Propósito:** Lista informativa
**Funcionalidad:** Solo mostrar, ambas "Coming Soon"

#### 4.6 RecentActivity.jsx (25 min)
**Propósito:** Feed de últimas ejecuciones
**Funcionalidad:** Mostrar mockRecentActivity
**Layout:** Lista con iconos de status

#### 4.7 ExecutionModal.jsx (20 min - SIMPLIFICADO)
**Propósito:** Modal genérico (pero no se usa aún)
**Funcionalidad:** Preparado para fase 2, por ahora solo estructura

---

### Paso 5: Página Principal (40 min)
**Archivo:** `src/components/Workflows/Workflows.jsx`

**Estructura:**
```jsx
<div className="workflows-page">
  {/* Header */}
  <Header title="Workflows & Automations" />

  {/* Stats Cards */}
  <StatsCards stats={mockStats} />

  {/* Workflow Tester */}
  <WorkflowTester />

  {/* Quick Actions */}
  <Section title="⚡ Quick Actions">
    <QuickActionsGrid actions={quickActions} />
  </Section>

  {/* Automated Workflows */}
  <Section title="🤖 Automated Workflows">
    <AutomatedWorkflows
      workflows={automatedWorkflows}
      onToggle={handleToggle}
    />
  </Section>

  {/* Scheduled Tasks */}
  <Section title="📅 Scheduled Tasks">
    <ScheduledTasks tasks={scheduledTasks} />
  </Section>

  {/* Recent Activity */}
  <Section title="📜 Recent Activity">
    <RecentActivity activity={mockRecentActivity} />
  </Section>
</div>
```

---

### Paso 6: Testing & Ajustes (30 min)
1. Testing visual en localhost
2. Testing de toggles (Supabase)
3. Responsive testing
4. Corrección de bugs menores

---

## 📊 RESUMEN DE LO QUE FUNCIONA

### ✅ Funcional (Real)
- UI completa y profesional
- Toggles de Automated Workflows → Guardan en Supabase
- WorkflowTester → Llama a n8n (si existe)
- Stats cards → Muestran datos
- Recent Activity → Muestra historial

### 🔜 Coming Soon (Preparado pero no activo)
- Quick Actions → Modal preparado, webhooks en fase 2
- Stats reales → Calculados desde executions table
- Activity real → Poll desde Supabase cada 30 seg
- Scheduled Tasks → Edición en fase 2

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/
├── components/
│   └── Workflows/
│       ├── Workflows.jsx                 # Página principal
│       ├── StatsCards.jsx                # 4 KPI cards
│       ├── WorkflowTester.jsx            # Test AI
│       ├── QuickActionsGrid.jsx          # Grid de acciones
│       ├── AutomatedWorkflows.jsx        # Lista con toggles
│       ├── ScheduledTasks.jsx            # Lista informativa
│       ├── RecentActivity.jsx            # Feed de actividad
│       └── ExecutionModal.jsx            # Modal (preparado)
├── services/
│   ├── workflowsService.js               # Service layer
│   └── workflowsMocks.js                 # Mock data
├── lib/
│   └── workflowsConfig.js                # Config de workflows
└── supabase/
    └── migrations/
        └── 013_workflows_tables.sql      # DB schema
```

**Total:** 11 archivos nuevos

---

## 🎨 ESTILOS

### Paleta de Colores
```javascript
const workflowColors = {
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  teal: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  indigo: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};
```

### Badges
- **Active:** `bg-green-500/20 text-green-400 border-green-500/30`
- **Coming Soon:** `bg-purple-500/20 text-purple-400 border-purple-500/30`
- **Success:** `bg-green-500/20 text-green-300`
- **Error:** `bg-red-500/20 text-red-300`

---

## ⏱️ CRONOGRAMA

| Fase | Tarea | Tiempo |
|------|-------|--------|
| 1 | Migration SQL | 30 min |
| 2 | Configuración base | 20 min |
| 3 | Servicio | 30 min |
| 4 | Componentes (7) | 2.5 h |
| 5 | Página principal | 40 min |
| 6 | Testing | 30 min |
| **TOTAL** | | **~5 horas** |

---

## 🎯 CRITERIOS DE ÉXITO

### Al finalizar HOY:
✅ Usuario ve página completa de Workflows & Automations
✅ 4 KPI cards funcionando
✅ WorkflowTester funcional
✅ 4 Quick Actions visibles (Coming Soon)
✅ 4 Automated Workflows con toggles funcionales
✅ 2 Scheduled Tasks visibles (Coming Soon)
✅ Recent Activity feed funcionando
✅ Todo responsive
✅ Cero errores en consola
✅ Datos guardándose en Supabase

### Para DESPUÉS (Fase 2):
⏳ Quick Actions ejecutan webhooks reales
⏳ Stats calculados desde executions table
⏳ Activity auto-refresh cada 30 seg
⏳ ExecutionModal con inputs dinámicos

---

## 🚀 LISTO PARA EMPEZAR

**José, con tu aprobación empiezo:**

**Orden de ejecución:**
1. Migration SQL → Ejecuto en Supabase
2. workflowsConfig.js → Arrays de workflows
3. workflowsMocks.js → Mock data
4. workflowsService.js → Service layer
5. Componentes (7) → Uno por uno
6. Workflows.jsx → Página principal
7. Testing completo

**¿Comenzamos?** 🎯

---

**PLAN APROBADO - COMPLEJIDAD MEDIA**
