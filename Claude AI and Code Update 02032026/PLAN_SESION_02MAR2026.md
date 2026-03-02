# 📋 PLAN DE SESIÓN - 02 MARZO 2026
**Rama:** `backup-antes-de-automatizacion`
**Objetivo:** Ajustes mobile responsiveness + testing completo pre-deploy

---

## 🎯 OBJETIVO PRINCIPAL

**PRE-DEPLOY FINAL:** Hacer todos los ajustes mobile necesarios, testing completo, y si todo funciona correctamente hacer pull a main + deploy a Vercel.

**Prioridad:** ⚠️ **CERO ERRORES** - Ir despacio y con cuidado

---

## 🐛 ISSUES DETECTADOS EN MOBILE (Testing desde móvil)

### 1. OwnerExecutiveSummary (Overview)
**Archivo:** `src/components/Dashboard/OwnerExecutiveSummary.jsx`

**Problemas detectados:**
- ❌ **AI Agents box se monta sobre el texto del nombre de la app** (header overlap)
- ❌ **Revenue & Occupancy Timeline**: Cantidades aparecen en dos líneas (Rp en una línea, número en otra)

**Ubicación exacta:**
- Header: Líneas aproximadas al inicio del return
- Timeline table: Líneas 478-504 (tabla Revenue & Occupancy)
  - Específicamente línea 496-497: `formatCurrency(month.revenue)`

**Solución propuesta:**
```jsx
// ANTES (problemático en móvil):
<td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-white">
  {formatCurrency(month.revenue)}
</td>

// DESPUÉS (fix con whitespace-nowrap):
<td className="text-right py-2 md:py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-white whitespace-nowrap">
  {formatCurrency(month.revenue)}
</td>
```

**Impacto:** ✅ **SOLO CSS** - No afecta lógica ni funcionalidad

---

### 2. PMSCalendar (Calendar)
**Archivo:** `src/components/PMSCalendar/PMSCalendar.jsx`

**Problemas detectados:**
- ❌ **Se ve todo mal en móvil** (grid de calendario desktop-first)

**Ubicación exacta:**
- Grid del calendario mensual
- Navegación de fechas
- Event cards

**Solución propuesta:**
```jsx
// Vista móvil: Lista de eventos (vertical)
// Vista desktop: Grid calendario tradicional
<div className="block lg:hidden">
  {/* Lista de eventos para móvil */}
</div>
<div className="hidden lg:block">
  {/* Grid calendario para desktop */}
</div>
```

**Impacto:** ✅ **SOLO CSS + Conditional Rendering** - No afecta lógica ni funcionalidad

---

### 3. Multichannel (Channel Sync)
**Archivo:** `src/components/Multichannel/Multichannel.jsx`

**Problemas detectados:**
- ❌ **Detailed Report se ve mal**: cantidades montadas, layout roto

**Ubicación exacta:**
- Sección "Detailed Report" (probablemente una tabla o grid)
- Números/cantidades overlapping

**Solución propuesta:**
```jsx
// Wrapper con overflow-x-auto para tablas
<div className="overflow-x-auto">
  <table className="min-w-[600px] w-full">
    {/* contenido */}
  </table>
</div>

// Cantidades con whitespace-nowrap
<td className="text-right whitespace-nowrap">
  {formatCurrency(amount)}
</td>
```

**Impacto:** ✅ **SOLO CSS** - No afecta lógica ni funcionalidad

---

### 4. Autopilot (Maintenance & Tasks)
**Archivo:** `src/components/Autopilot/Autopilot.jsx` + `TaskModal.jsx`

**Problemas detectados:**
- ❌ **New Task modal demasiado grande** en pantalla móvil
- 🔴 **CRITICAL BUG**: Al intentar editar una tarea no funciona

**Ubicación exacta:**
- `TaskModal.jsx`: Modal container (probablemente `w-[90%]` o similar)
- Edit functionality: Event handlers en Autopilot.jsx (líneas ~3500+)

**Solución propuesta (Modal):**
```jsx
// ANTES (demasiado grande):
<div className="bg-[#2a2f3a] rounded-2xl w-[90%] max-w-3xl">

// DESPUÉS (más compacto en móvil):
<div className="bg-[#2a2f3a] rounded-2xl w-[95%] sm:w-[85%] max-w-2xl max-h-[85vh] overflow-y-auto">
```

**Solución propuesta (Edit Bug):**
- ⚠️ **REQUIERE INVESTIGACIÓN** - Este es un bug funcional, NO solo CSS
- Necesito revisar los event handlers de edit
- Posiblemente un problema con el click event en mobile (touch vs click)

**Impacto:**
- Modal size: ✅ **SOLO CSS**
- Edit bug: 🔴 **FUNCIONAL** - Requiere debugging cuidadoso

---

## 📝 PLAN DE EJECUCIÓN PASO A PASO

### FASE 1: Crear backup y documentación
- [x] Crear carpeta `Claude AI and Code Update 02032026`
- [x] Crear este documento de plan
- ✅ **NO COMMITS hasta el final** - Solo cuando todo funcione

### FASE 2: Fixes CSS (Safe - No impact functionality)
**Orden:**
1. [ ] **OwnerExecutiveSummary** - Revenue table whitespace-nowrap
2. [ ] **OwnerExecutiveSummary** - AI Agents header overlap fix
3. [ ] **Multichannel** - Detailed Report overflow fix
4. [ ] **Autopilot/TaskModal** - Modal size reduction

**Proceso para cada fix:**
- Leer archivo completo
- Localizar problema exacto
- Aplicar fix CSS específico
- Testing manual en localhost
- Screenshot before/after (si es posible)

### FASE 3: PMSCalendar Mobile (Medium complexity)
- [ ] Analizar estructura actual
- [ ] Implementar vista lista para móvil
- [ ] Mantener grid para desktop
- [ ] Testing exhaustivo en ambas vistas

### FASE 4: CRITICAL - Task Edit Bug Investigation
⚠️ **MÁXIMA PRECAUCIÓN** - Bug funcional

**Pasos de investigación:**
1. [ ] Leer código de Autopilot.jsx (handlers de edit)
2. [ ] Leer código de TaskModal.jsx (modal component)
3. [ ] Identificar event handlers relevantes
4. [ ] Verificar si es problema de touch events vs click events
5. [ ] Verificar si es problema de z-index / overlay
6. [ ] Testing en DevTools mobile emulator
7. [ ] Fix aplicado con testing exhaustivo

### FASE 5: Testing Completo
- [ ] Testing Overview en móvil (todas las breakpoints)
- [ ] Testing Calendar en móvil
- [ ] Testing Channel Sync en móvil
- [ ] Testing Maintenance & Tasks (CRUD completo) en móvil
- [ ] Testing en desktop (verificar que no se rompió nada)
- [ ] Verificar todas las funcionalidades principales:
  - [ ] Login/Logout
  - [ ] Navigation sidebar
  - [ ] Properties
  - [ ] Bookings
  - [ ] Tasks (Create/Edit/Delete)
  - [ ] Filters

### FASE 6: Pre-Deploy Checklist
- [ ] Todos los issues mobile resueltos
- [ ] Cero errores en consola
- [ ] Funcionalidad CRUD tasks funciona 100%
- [ ] Testing en múltiples dispositivos/breakpoints
- [ ] Documentación completa de cambios
- [ ] **UN SOLO COMMIT al final** con todos los cambios
- [ ] Push a rama `backup-antes-de-automatizacion`

### FASE 7: Deploy to Production
- [ ] Merge a `main` (si testing exitoso)
- [ ] Deploy a Vercel
- [ ] Testing en producción
- [ ] Rollback plan ready (por si acaso)

---

## ⚠️ REGLAS DE SEGURIDAD

1. **UN CAMBIO A LA VEZ** - No hacer múltiples fixes en paralelo
2. **TESTING DESPUÉS DE CADA CAMBIO** - Verificar que funciona antes de continuar
3. **COMMITS FRECUENTES** - Guardar progreso después de cada fix exitoso
4. **NO TOCAR LÓGICA DE NEGOCIO** - Solo CSS salvo el bug de edit (con cuidado)
5. **BACKUP ANTES DE CADA CAMBIO CRÍTICO** - Especialmente para el bug de edit
6. **COMUNICACIÓN CONSTANTE** - Confirmar con usuario antes de proceder

---

## 📊 ARCHIVOS AFECTADOS (Estimado)

1. `src/components/Dashboard/OwnerExecutiveSummary.jsx` - 2-3 líneas CSS
2. `src/components/PMSCalendar/PMSCalendar.jsx` - ~50-100 líneas (conditional rendering)
3. `src/components/Multichannel/Multichannel.jsx` - 2-3 líneas CSS
4. `src/components/Autopilot/TaskModal.jsx` - 1-2 líneas CSS
5. `src/components/Autopilot/Autopilot.jsx` - TBD (depende del bug)

**Total estimado:** 5 archivos, ~50-150 líneas modificadas

---

## ✅ CRITERIOS DE ÉXITO

### Funcionalidad
- ✅ Todos los módulos se ven correctamente en móvil (320px - 768px)
- ✅ Todos los módulos se ven correctamente en tablet (768px - 1024px)
- ✅ Todos los módulos se ven correctamente en desktop (1024px+)
- ✅ CRUD de tasks funciona 100% en móvil
- ✅ Cero errores en consola
- ✅ Cero warnings críticos

### Performance
- ✅ App carga rápido en móvil
- ✅ Transiciones suaves
- ✅ No lag en interactions

### UX
- ✅ Touch targets mínimo 44x44px
- ✅ Texto legible sin zoom
- ✅ Tablas scrollables horizontalmente si necesario
- ✅ Modals no ocupan >85% de altura en móvil

---

## 📅 TIEMPO ESTIMADO

- **Fase 1 (Backup/Docs):** 10 min - ✅ EN PROGRESO
- **Fase 2 (CSS Fixes):** 30-45 min
- **Fase 3 (Calendar Mobile):** 45-60 min
- **Fase 4 (Edit Bug):** 30-90 min (depende de complejidad)
- **Fase 5 (Testing):** 45-60 min
- **Fase 6 (Pre-Deploy):** 15-20 min
- **Fase 7 (Deploy):** 10-15 min

**TOTAL:** 3-5 horas (con testing exhaustivo y cero prisas)

---

## 🚀 PRÓXIMOS PASOS INMEDIATOS

1. ✅ Crear esta documentación
2. ⏭️ **ESPERAR CONFIRMACIÓN DEL USUARIO** antes de proceder
3. Commit del estado actual
4. Empezar con Fase 2 (CSS fixes simples)

---

**Creado por:** Claude Code
**Fecha:** 02 Marzo 2026
**Status:** 📝 PLAN CREADO - ESPERANDO APROBACIÓN
