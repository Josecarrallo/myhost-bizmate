# PROMPT PARA CLAUDE CODE
## Feature: Workflows & Automations Module

---

## CONTEXTO

Estoy construyendo MY HOST BizMate, una SaaS de gestión hotelera. Tengo workflows de automatización corriendo en n8n (Railway) que quiero exponer al usuario desde el frontend React.

El módulo "Workflows & Automations" ya existe en el sidebar bajo "PMS CORE (INTERNAL AGENT)". Necesito que construyas la funcionalidad completa.

---

## OBJETIVO

Crear una interfaz donde el usuario pueda:
1. Ver sus automatizaciones activas y su estado
2. Activar/desactivar workflows automáticos
3. Ejecutar acciones manuales (Quick Actions) que disparan webhooks de n8n
4. Ver el historial de ejecuciones recientes

---

## ARQUITECTURA TÉCNICA

### Conexión con n8n
Los workflows se ejecutan llamando webhooks de n8n:

```
Base URL: https://n8n-production-bb2d.up.railway.app/webhook/
```

Cada workflow tiene su propio endpoint webhook. Para ejecutar un workflow:
```javascript
// Ejemplo: Ejecutar un workflow
const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/[webhook-path]', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    // datos opcionales que el workflow necesite
    property_id: "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    triggered_by: "manual",
    user_id: currentUser.id
  })
});
```

### Base de datos (Supabase)
Crear tabla para guardar configuración de workflows del usuario:

```sql
CREATE TABLE workflow_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
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
  property_id UUID REFERENCES properties(id),
  workflow_key VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'error', 'pending'
  trigger_type VARCHAR(20) NOT NULL, -- 'manual', 'automatic', 'scheduled'
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMP DEFAULT NOW()
);
```

---

## WORKFLOWS A INCLUIR

### Categoría 1: AUTOMATED WORKFLOWS (Toggle on/off)
Estos corren automáticamente cuando se activan:

```javascript
const automatedWorkflows = [
  {
    key: "whatsapp_concierge",
    name: "WhatsApp AI Concierge",
    description: "AI assistant responds to WhatsApp messages 24/7",
    icon: "MessageSquare", // lucide-react icon
    color: "green",
    webhook: null, // No webhook - se activa/desactiva en n8n directamente
    isExternal: true, // Indica que el estado real está en n8n
  },
  {
    key: "voice_receptionist",
    name: "Voice AI Receptionist", 
    description: "AI handles phone calls and takes reservations",
    icon: "Phone",
    color: "blue",
    webhook: null,
    isExternal: true,
  },
  {
    key: "booking_confirmation",
    name: "Booking Confirmation",
    description: "Automatically sends email & WhatsApp when booking is created",
    icon: "CheckCircle",
    color: "emerald",
    webhook: null,
    isExternal: true,
  },
  {
    key: "daily_recommendations",
    name: "Daily Guest Recommendations",
    description: "Sends personalized recommendations to in-house guests every morning",
    icon: "Sparkles",
    color: "purple",
    webhook: null,
    isExternal: true,
    comingSoon: true, // Mostrar como "Coming Soon"
  }
];
```

### Categoría 2: QUICK ACTIONS (Ejecutar manualmente)
Estos se ejecutan cuando el usuario hace click:

```javascript
const quickActions = [
  {
    key: "send_welcome_email",
    name: "Send Welcome Email",
    description: "Send welcome email to a specific guest",
    icon: "Mail",
    color: "orange",
    webhook: "send-welcome-email",
    requiresInput: true,
    inputFields: [
      { name: "booking_id", label: "Select Booking", type: "booking_select" }
    ]
  },
  {
    key: "generate_occupancy_report",
    name: "Generate Occupancy Report",
    description: "Generate PDF report of occupancy for selected dates",
    icon: "BarChart3",
    color: "blue",
    webhook: "generate-occupancy-report",
    requiresInput: true,
    inputFields: [
      { name: "start_date", label: "Start Date", type: "date" },
      { name: "end_date", label: "End Date", type: "date" }
    ]
  },
  {
    key: "sync_availability",
    name: "Sync Availability",
    description: "Manually sync room availability across all channels",
    icon: "RefreshCw",
    color: "teal",
    webhook: "sync-availability",
    requiresInput: false
  },
  {
    key: "send_promo_campaign",
    name: "Send Promo Campaign",
    description: "Send promotional offer to past guests",
    icon: "Megaphone",
    color: "pink",
    webhook: "send-promo-campaign",
    requiresInput: true,
    inputFields: [
      { name: "campaign_type", label: "Campaign Type", type: "select", options: ["Last 30 days guests", "Last 90 days guests", "VIP guests"] },
      { name: "discount_percent", label: "Discount %", type: "number" }
    ],
    comingSoon: true
  }
];
```

### Categoría 3: SCHEDULED TASKS (Mostrar info, no editable por ahora)
Solo mostrar información de tareas programadas:

```javascript
const scheduledTasks = [
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

---

## DISEÑO UI/UX

### Layout principal
```
┌─────────────────────────────────────────────────────────────────┐
│  Workflows & Automations                                        │
│  Manage your hotel's automated processes                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 STATS CARDS (4 cards en fila)                       │   │
│  │  [Active: 3] [Executions: 348] [Time Saved: 24h] [98%]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🟣 WORKFLOW TESTER (Card destacado)                    │   │
│  │  Test WhatsApp AI and Vapi Voice AI directly            │   │
│  │  [WhatsApp AI Ready 🟢] [Vapi Voice Ready 🟢]           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚡ QUICK ACTIONS                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ 📧 Send    │ │ 📊 Report  │ │ 🔄 Sync    │ │ 📢 Promo   │   │
│  │ Welcome    │ │ Occupancy  │ │ Channels   │ │ Campaign   │   │
│  │  [Run →]   │ │  [Run →]   │ │  [Run →]   │ │ [Soon]     │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│                                                                 │
│  🤖 AUTOMATED WORKFLOWS                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 💬 WhatsApp AI Concierge                    [====🟢]    │   │
│  │    AI responds to WhatsApp 24/7              Active     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ 📞 Voice AI Receptionist                    [====🟢]    │   │
│  │    Handles calls automatically               Active     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ✅ Booking Confirmation                     [====🟢]    │   │
│  │    Sends email & WhatsApp on new booking    Active     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ✨ Daily Recommendations                    [Coming Soon]│   │
│  │    Personalized tips for in-house guests               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📅 SCHEDULED TASKS                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📈 Weekly Revenue Report     Mon 9AM     [Coming Soon]  │   │
│  │ 📱 Social Media Post         Daily 10AM  [Coming Soon]  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📜 RECENT ACTIVITY                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✅ Booking Confirmation sent    2 min ago    Success    │   │
│  │ ✅ WhatsApp reply sent          5 min ago    Success    │   │
│  │ ✅ Voice call handled           1 hour ago   Success    │   │
│  │ [View All Activity →]                                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes necesarios

1. **StatsCards** - 4 tarjetas con métricas
2. **WorkflowTester** - Card destacado para probar AI (ya existe parcialmente)
3. **QuickActionsGrid** - Grid de acciones manuales con botón "Run"
4. **AutomatedWorkflowsList** - Lista con toggles on/off
5. **ScheduledTasksList** - Lista informativa
6. **RecentActivityFeed** - Últimas ejecuciones
7. **ExecutionModal** - Modal para quick actions que requieren input

### Modal para Quick Actions con input
```
┌─────────────────────────────────────────┐
│  📧 Send Welcome Email                  │
│  ─────────────────────────────────────  │
│                                         │
│  Select Booking:                        │
│  ┌─────────────────────────────────┐   │
│  │ [Dropdown con bookings]     ▼   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Preview:                               │
│  Guest: John Smith                      │
│  Email: john@email.com                  │
│  Check-in: Jan 15, 2026                 │
│                                         │
│  ┌─────────┐ ┌─────────────────────┐   │
│  │ Cancel  │ │ 📧 Send Email      │   │
│  └─────────┘ └─────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## ESTILOS

Seguir el estilo actual de la app:
- Glassmorphism con backdrop-blur
- Gradientes sutiles (naranja/coral para acentos)
- Cards con bordes redondeados (rounded-xl)
- Sombras suaves
- Iconos de lucide-react
- Toggle switches estilizados
- Estados: Active (verde), Paused (gris), Coming Soon (badge morado)

### Colores por tipo de workflow
```javascript
const workflowColors = {
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  pink: "bg-pink-500/10 text-pink-500 border-pink-500/20",
  teal: "bg-teal-500/10 text-teal-500 border-teal-500/20",
};
```

---

## FUNCIONALIDAD PASO A PASO

### 1. Cargar estado inicial
```javascript
// Al montar el componente:
// 1. Cargar workflow_settings del usuario desde Supabase
// 2. Cargar últimas 10 ejecuciones de workflow_executions
// 3. Mostrar UI con estados actuales
```

### 2. Toggle de Automated Workflow
```javascript
// Cuando el usuario hace toggle:
// 1. Actualizar workflow_settings en Supabase (is_active)
// 2. Mostrar toast de confirmación
// 3. (Futuro: llamar API de n8n para activar/desactivar)
```

### 3. Ejecutar Quick Action
```javascript
// Cuando el usuario hace click en "Run":
// 1. Si requiresInput=true, abrir modal para pedir datos
// 2. Mostrar loading state en el botón
// 3. Llamar webhook de n8n con los datos
// 4. Guardar ejecución en workflow_executions
// 5. Mostrar toast de éxito/error
// 6. Actualizar Recent Activity
```

### 4. Webhook call helper
```javascript
const executeWorkflow = async (webhookPath, data = {}) => {
  const baseUrl = "https://n8n-production-bb2d.up.railway.app/webhook";
  
  try {
    const response = await fetch(`${baseUrl}/${webhookPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: currentPropertyId,
        triggered_by: 'manual',
        timestamp: new Date().toISOString(),
        ...data
      })
    });
    
    if (!response.ok) throw new Error('Workflow execution failed');
    
    const result = await response.json();
    
    // Log execution to Supabase
    await supabase.from('workflow_executions').insert({
      property_id: currentPropertyId,
      workflow_key: webhookPath,
      status: 'success',
      trigger_type: 'manual',
      input_data: data,
      output_data: result
    });
    
    return { success: true, data: result };
  } catch (error) {
    // Log failed execution
    await supabase.from('workflow_executions').insert({
      property_id: currentPropertyId,
      workflow_key: webhookPath,
      status: 'error',
      trigger_type: 'manual',
      input_data: data,
      error_message: error.message
    });
    
    return { success: false, error: error.message };
  }
};
```

---

## ARCHIVOS A CREAR/MODIFICAR

```
src/
├── pages/
│   └── WorkflowsAutomations.jsx    # Página principal (crear/reemplazar)
├── components/
│   └── workflows/
│       ├── StatsCards.jsx           # Cards de estadísticas
│       ├── WorkflowTester.jsx       # Card de prueba AI (ya existe?)
│       ├── QuickActionsGrid.jsx     # Grid de quick actions
│       ├── AutomatedWorkflows.jsx   # Lista de workflows automáticos
│       ├── ScheduledTasks.jsx       # Lista de tareas programadas
│       ├── RecentActivity.jsx       # Feed de actividad reciente
│       └── ExecutionModal.jsx       # Modal para ejecutar con input
├── hooks/
│   └── useWorkflows.js              # Hook para manejar estado y API calls
└── lib/
    └── workflowsConfig.js           # Configuración de workflows (arrays de arriba)
```

---

## DATOS MOCK INICIALES

Para desarrollo, usar estos datos mock:

```javascript
const mockRecentActivity = [
  { id: 1, workflow: "Booking Confirmation", status: "success", time: "2 min ago", details: "Email sent to john@email.com" },
  { id: 2, workflow: "WhatsApp Concierge", status: "success", time: "5 min ago", details: "Replied to +1234567890" },
  { id: 3, workflow: "Voice AI", status: "success", time: "1 hour ago", details: "Call handled - New booking inquiry" },
  { id: 4, workflow: "Sync Availability", status: "error", time: "2 hours ago", details: "Channel manager timeout" },
];

const mockStats = {
  activeWorkflows: 3,
  totalExecutions: 348,
  timeSaved: "24h",
  successRate: 98
};
```

---

## NOTAS IMPORTANTES

1. **Property ID fijo por ahora**: Usar `18711359-1378-4d12-9ea6-fb31c0b1bac2` (Izumi Hotel)

2. **Webhooks aún no creados**: Los Quick Actions mostrarán "Coming Soon" hasta que se creen los webhooks en n8n. Solo el Workflow Tester funciona realmente.

3. **Toggles son visuales por ahora**: Los toggles de Automated Workflows guardan estado en Supabase pero no activan/desactivan n8n directamente (eso requiere API de n8n).

4. **Mobile responsive**: Asegurar que funciona bien en móvil (cards apilados, scroll horizontal si necesario).

5. **El Workflow Tester ya existe**: Reusar el componente existente que tiene los botones "WhatsApp AI Ready" y "Vapi Voice Ready".

---

## ENTREGABLE

Una página completa y funcional de "Workflows & Automations" que:
- ✅ Muestra estadísticas del sistema
- ✅ Permite probar WhatsApp AI y Voice AI
- ✅ Muestra Quick Actions (algunas como "Coming Soon")
- ✅ Lista Automated Workflows con toggles
- ✅ Lista Scheduled Tasks (informativo)
- ✅ Muestra Recent Activity feed
- ✅ Guarda configuración en Supabase
- ✅ Es visualmente consistente con el resto de la app
