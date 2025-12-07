# PLAN ULTRA SEGURO - INTEGRACIÓN SUPABASE
## Documento creado: 07 DIC 2025

---

## 🚨 ANÁLISIS DE RIESGOS IDENTIFICADOS

### ¿Qué problemas hubo antes?

Basándome en el documento de recuperación y los archivos de backup, identifico:

1. **Problema histórico:** Se tuvo que restaurar a una versión anterior
2. **Causa probable:** Cambios en AuthContext o integración de Supabase que rompieron la autenticación
3. **Archivos críticos actuales:**
   - `src/contexts/AuthContext.jsx` - YA TIENE TIMEOUTS (líneas 45-46, 100-101)
   - `src/lib/supabase.js` - Cliente de Supabase (NO LO HE LEÍDO AÚN)
   - `src/services/supabase.js` - API service (SIN USAR EN APP ACTUAL)

---

## ✅ ESTADO ACTUAL SEGURO

### Autenticación
- ✅ `AuthContext.jsx` **ESTÁ FUNCIONANDO PERFECTAMENTE**
- ✅ Tiene timeouts de 3s para session check
- ✅ Tiene timeout de 2s para sign out
- ✅ Maneja errores correctamente
- ✅ Login/Logout funciona 100%

### Datos Actuales
- ✅ Dashboard usa datos MOCK (hardcoded)
- ✅ Properties usa datos MOCK (hardcoded)
- ✅ Bookings usa datos MOCK (hardcoded)
- ✅ Todos los módulos funcionan sin tocar Supabase

### Supabase Service
- ⚠️ Existe `src/services/supabase.js` con funciones:
  - `createProperty()`
  - `getProperties()`
  - `checkAvailability()`
  - `calculateBookingPrice()`
  - `createBooking()`
- ⚠️ **ESTAS FUNCIONES NO SE USAN EN NINGÚN MÓDULO ACTUALMENTE**

---

## 🎯 PLAN DE INTEGRACIÓN SEGURA (3 FASES)

### FASE 2A: PREPARACIÓN (SIN TOCAR CÓDIGO ACTUAL)

**Objetivo:** Investigar y entender ANTES de cambiar nada

**Acciones:**
1. ✅ Leer `src/lib/supabase.js` para ver cómo se inicializa el cliente
2. ✅ Verificar estructura de base de datos Supabase
3. ✅ Hacer queries de prueba manualmente (sin modificar código)
4. ✅ Documentar esquema de tablas existente
5. ✅ Identificar qué datos existen vs qué necesitamos crear

**Reglas de oro:**
- ❌ NO modificar AuthContext.jsx (está funcionando)
- ❌ NO cambiar imports en App.jsx
- ❌ NO tocar archivos que funcionan
- ✅ Solo lectura y documentación

---

### FASE 2B: INTEGRACIÓN INCREMENTAL (1 MÓDULO A LA VEZ)

**Módulo piloto sugerido:** Properties (más simple)

**Por qué Properties primero:**
1. Solo lee datos (no crea/modifica)
2. Ya tiene `getProperties()` en supabase.js
3. Tiene datos mock bien definidos
4. No afecta autenticación

**Proceso paso a paso:**

#### Paso 1: Backup antes de tocar
```bash
git add .
git commit -m "checkpoint: Before Supabase integration"
cp src/components/Properties/Properties.jsx src/components/Properties/Properties.jsx.backup
```

#### Paso 2: Crear versión con toggle (híbrida)
```javascript
const USE_REAL_DATA = false; // 👈 Flag de seguridad

const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  if (USE_REAL_DATA) {
    loadPropertiesFromSupabase();
  } else {
    setProperties(mockProperties); // Datos actuales
  }
}, []);
```

#### Paso 3: Probar con flag en FALSE
- Verificar que todo sigue funcionando
- Commit: "refactor: Add data layer to Properties (mock mode)"

#### Paso 4: Probar con flag en TRUE
- Cambiar flag a `true`
- Ver si carga datos reales
- Si falla: revertir a FALSE
- Si funciona: commit separado

#### Paso 5: Limpieza (solo si TODO funciona)
- Remover flag
- Remover mock data
- Commit final

---

### FASE 2C: EXPANSIÓN CONTROLADA

**Orden sugerido de módulos:**
1. ✅ Properties (solo lectura)
2. Dashboard - Quick Stats (3 métricas simples)
3. Bookings (lectura de bookings)
4. Payments (lectura de payments)
5. Reports (cálculos basados en datos reales)

**Entre cada módulo:**
- ✅ Commit
- ✅ Probar en móvil
- ✅ Verificar que login/logout sigue funcionando
- ✅ Si algo falla: `git reset --hard` al commit anterior

---

## 🛡️ SISTEMA DE PROTECCIÓN

### Backups automáticos
Antes de cada cambio mayor:
```bash
# 1. Commit actual
git add .
git commit -m "checkpoint: [descripción]"

# 2. Backup del archivo
cp [archivo] [archivo].backup-[FECHA]

# 3. Tag de git (punto de restauración)
git tag -a safe-point-[NUMERO] -m "Safe restore point"
```

### Comandos de rescate
Si algo sale mal:
```bash
# Opción 1: Descartar cambios no commiteados
git restore [archivo]

# Opción 2: Volver al último commit
git reset --hard HEAD

# Opción 3: Volver a un commit específico
git reset --hard [commit-hash]

# Opción 4: Volver a un tag
git reset --hard safe-point-[NUMERO]
```

---

## 📋 CHECKLIST PRE-CAMBIO

Antes de modificar CUALQUIER archivo:

- [ ] ¿Hice commit del estado actual?
- [ ] ¿Hice backup del archivo que voy a modificar?
- [ ] ¿Entiendo qué hace el código actual?
- [ ] ¿Sé cómo revertir si falla?
- [ ] ¿El cambio es incremental (no todo a la vez)?
- [ ] ¿Tengo un flag de seguridad (toggle) para probar?
- [ ] ¿Probé que login/logout sigue funcionando?

---

## 🎓 LECCIONES APRENDIDAS (del problema anterior)

### Lo que NO hacer:
- ❌ Cambiar múltiples archivos a la vez
- ❌ Modificar AuthContext sin necesidad
- ❌ Integrar todo de golpe
- ❌ Confiar en que "debería funcionar"
- ❌ No hacer commits frecuentes

### Lo que SÍ hacer:
- ✅ Un cambio a la vez
- ✅ Commit después de cada éxito
- ✅ Flags de toggle para probar
- ✅ Mantener datos mock como fallback
- ✅ Probar en móvil frecuentemente
- ✅ Nunca tocar lo que funciona

---

## 🚀 PRÓXIMO PASO INMEDIATO

**DECISIÓN REQUERIDA:**

Antes de escribir código, necesito tu confirmación sobre:

### Opción A: Empezar con FASE 2A (Investigación)
- Leer estructura de Supabase
- Ver qué datos existen
- Documentar esquema
- NO tocar código

### Opción B: Empezar directo con Properties
- Hacer backup
- Agregar flag de toggle
- Probar con mock primero
- Luego probar con Supabase

### Opción C: Otro enfoque
- Tú dices qué prefieres

---

## ⚠️ REGLA DE ORO

**ANTE LA DUDA, NO HACER NADA.**

Si en algún momento no estoy 100% seguro de un cambio:
1. Paro
2. Hago commit del estado actual
3. Te consulto
4. Esperamos tu OK

---

**Documento listo para revisión.**
**Esperando tu decisión para proceder.**
