# Changelog - 16 Febrero 2026

## 🎯 Villa Tasks Management - Integración Supabase

### ✅ Cambios Implementados

#### 1. Nueva Tabla `tasks` en Supabase
- **Creada tabla `tasks`** para gestión de tareas de villas
- **Separada de `autopilot_actions`** (que se usa para workflows de Lumina)
- **Campos**:
  - `id` (UUID)
  - `tenant_id` (UUID) - Owner de las villas
  - `property_id` (UUID) - Propiedad principal
  - `villa_id` (UUID) - **NUEVO** - Villa específica
  - `title` (TEXT)
  - `description` (TEXT)
  - `task_type` (TEXT)
  - `priority` (TEXT)
  - `status` (TEXT)
  - `assignee` (TEXT)
  - `due_date` (TIMESTAMP)
  - `completed_at` (TIMESTAMP)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

#### 2. Datos Demo Insertados
- **10 tareas creadas** para las villas de Gita:
  - 5 tareas para **Nismara 2BR Villa**
  - 5 tareas para **Graha Uma 1BR Villa**
- Estados variados: `open`, `in_progress`, `completed`
- Prioridades: `high`, `medium`, `low`
- Tipos: `cleaning`, `maintenance`, `inventory`, `inspection`, `guest_communication`

#### 3. Actualización de Código

**`src/services/supabase.js`:**
- `getTasks()` ahora consulta tabla `tasks` (antes `autopilot_actions`)
- Añadido soporte para filtro `villa_id`
- `createTask()` inserta en tabla `tasks`
- `deleteTask()` borra de tabla `tasks`

**`src/components/ManualDataEntry/ManualDataEntry.jsx`:**
- Dropdown de filtro cambiado a **"Todas las villas"**
- Filtro por `villa_id` (antes `property_id`)
- Muestra lista de villas individuales (Nismara 2BR, Graha Uma 3BR, Graha Uma 1BR)
- Función `loadTasks()` actualizada para filtrar por `villa_id`

### 📊 Estructura de Datos

**Separación clara:**
- **`tasks` table** → Tareas de gestión de villas (limpieza, mantenimiento, etc.)
- **`autopilot_actions` table** → Acciones automatizadas de Lumina (payment monitors, custom plan requests, etc.)

**Relación villa-tarea:**
```
Owner (Gita)
  ├── Property (18711359-1378-4d12-9ea6-fb31c0b1bac2)
  │   ├── Villa 1: Nismara 2BR (b1000001-0001-4001-8001-000000000001)
  │   │   └── 5 tasks
  │   ├── Villa 2: Graha Uma 3BR (b2000002-0002-4002-8002-000000000002)
  │   │   └── 0 tasks
  │   └── Villa 3: Graha Uma 1BR (b3000003-0003-4003-8003-000000000003)
      │   └── 5 tasks
```

### 🔍 Funcionalidad Actual

**Manual Data Entry > View/Edit Tasks:**
- ✅ Filtro "Todas las villas" → Muestra 10 tareas
- ✅ Filtro "Nismara 2BR Villa" → Muestra 5 tareas
- ✅ Filtro "Graha Uma 1BR Villa" → Muestra 5 tareas
- ✅ Filtro "Graha Uma 3BR Villa" → Muestra 0 tareas
- ✅ Filtro por Status (All Status, Pending, In Progress, Completed)

### ⚠️ Datos Hardcodeados vs Reales

**En Autopilot module:**
- ❌ **Maintenance & Tasks** → Hardcodeado (5 tareas demo)
- ❌ **Customer Communications** → Hardcodeado (números de mensajes sin leer)
- ✅ **Channel Sync** → Datos reales de Supabase (`channelStats`)

### 🚀 Commits

**Commit principal:**
```
216ce01 - feat: Implement villa tasks management with Supabase integration
```

**Merge a main:**
```
e89cc05 - Merge backup-antes-de-automatizacion into main
```

### 📝 SQL Ejecutado

```sql
-- Añadir columna villa_id
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS villa_id UUID REFERENCES villas(id);

CREATE INDEX IF NOT EXISTS idx_tasks_villa ON tasks(villa_id);

-- Añadir columnas faltantes a autopilot_actions
ALTER TABLE autopilot_actions
ADD COLUMN IF NOT EXISTS assignee TEXT,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
```

### 📦 Archivos Modificados

1. `src/services/supabase.js` - Servicios Supabase
2. `src/components/ManualDataEntry/ManualDataEntry.jsx` - UI de tareas

### 🎯 Siguiente Paso

Continuar con **video/vercel/supabase** según lo solicitado.

---

**Fecha:** 16 Febrero 2026
**Branch:** `backup-antes-de-automatizacion` → `main`
**Status:** ✅ Completado y pusheado
