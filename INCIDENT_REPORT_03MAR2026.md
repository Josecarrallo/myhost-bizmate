# INCIDENT REPORT - MULTI-TENANCY VIOLATION

**Fecha:** 03 de Marzo de 2026
**Severidad:** CRÍTICA
**Tipo:** Violación de aislamiento de datos entre tenants
**Status:** ✅ RESUELTO

---

## Executive Summary

Se detectó una violación crítica de multi-tenancy donde el usuario Jose (Izumi Hotel) podía ver las villas de la usuaria Gita al acceder a la sección Properties. Este bug exponía datos confidenciales de un tenant a otro, violando la arquitectura de aislamiento del sistema.

**Duración del incidente:** ~20 minutos (detección a resolución)
**Usuarios afectados:** Jose (Izumi Hotel)
**Datos expuestos:** Listado de 3 villas de Gita (nombres, precios, configuración)
**Impacto:** Alto - Violación de privacidad entre tenants

---

## Timeline

### Detección (10:00 AM)
- Usuario reporta: "Acabo de hacer login como Jose para Izumi Hotel y cuando voy a Operations/Guest Properties/Properties me aparecen las de Gita"
- Usuario confirma: "esto estaba bien tambien" (funcionaba correctamente antes)

### Investigación Inicial (10:05 AM)
- Revisión de código en `Properties.jsx` - correcto: `dataService.getVillas(tenantId)`
- Revisión de `data.js` línea 872-896 - **ENCONTRADO CÓDIGO INCORRECTO**
- Error identificado: Intento de filtrar por columna `tenant_id` que NO EXISTE en tabla `villas`

### Análisis de Base de Datos (10:10 AM)
- Ejecutado script `debug-tenant-villas.cjs`
- **DESCUBRIMIENTO CRÍTICO:** Todas las villas tienen `tenant_id: undefined`
- Causa raíz: Código de filtrado corrupto

### Comparación con Historial Git (10:12 AM)
- Commit `185d1bd` (21 Feb) tenía implementación **CORRECTA**
- Código actual tenía implementación **INCORRECTA**
- Conclusión: El código se corrompió en algún momento posterior

### Resolución (10:15 AM)
- Restaurado código correcto de commit `185d1bd`
- Implementación correcta:
  1. Lookup de `property_ids` en tabla `bookings`
  2. Filtrado de villas por esos `property_ids`

### Verificación (10:18 AM)
- Test manual: Jose ve solo sus 5 villas ✅
- Usuario confirma: "Ahora funciona" ✅

### Medidas Preventivas (10:20-10:40 AM)
- Creado test suite automatizado: `test-multi-tenancy.cjs`
- Creada documentación: `DATABASE_SCHEMA.md`
- Actualizado protocolo: `PROTOCOLO_OBLIGATORIO_COMMIT_PUSH_V2.md` → v3.0

---

## Root Cause Analysis

### Causa Técnica

**Código Incorrecto (actual):**
```javascript
async getVillas(tenantId) {
  const { data } = await supabase
    .from('villas')
    .select('*')
    .eq('tenant_id', tenantId);  // ❌ Columna NO EXISTE
  return data;
}
```

**Problema:**
- La tabla `villas` NO tiene columna `tenant_id`
- Supabase NO lanza error cuando filtras por columna inexistente
- Retorna TODAS las filas (sin filtrar)
- Resultado: Jose veía villas de Gita y viceversa

**Código Correcto (commit 185d1bd):**
```javascript
async getVillas(tenantId) {
  // 1. Get property_ids from bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('property_id')
    .eq('tenant_id', tenantId);

  const propertyIds = [...new Set(bookings.map(b => b.property_id))];

  // 2. Filter villas by those property_ids
  const { data } = await supabase
    .from('villas')
    .select('*')
    .in('property_id', propertyIds)
    .eq('status', 'active');

  return data;
}
```

### Causa Organizacional

**Por qué pasó:**
1. ❌ NO hay tests automáticos de multi-tenancy
2. ❌ NO hay documentación del esquema de base de datos
3. ❌ Claude Code asumió estructura sin verificar
4. ❌ NO hay validación de que el código no rompe funcionalidad existente

**Por qué NO se detectó antes:**
- Entre sesiones de Claude Code se pierde contexto
- NO hay verificación manual con múltiples usuarios antes de commit
- NO hay test suite que se ejecute automáticamente

---

## Impact Assessment

### Datos Expuestos

**Gita → Jose (cuando Jose inicia sesión):**
- ✅ Nombres de villas: Nismara 1BR, Graha Uma, NISMARA 2BR
- ✅ Precios por noche en IDR
- ✅ Configuración (bedrooms, bathrooms, amenities)
- ❌ NO expuso bookings de Gita
- ❌ NO expuso datos de huéspedes de Gita

**Jose → Gita (cuando Gita inicia sesión):**
- Probablemente también ocurrió pero no fue reportado

### Alcance del Bug

**Afectado:**
- ✅ Módulo Properties (listado de villas)
- ✅ Cualquier vista que use `dataService.getVillas()`

**NO Afectado:**
- ✅ Bookings (tienen su propio filtrado por tenant_id)
- ✅ Payments
- ✅ Dashboard
- ✅ Autenticación (cada usuario ve su propia sesión)

---

## Corrective Actions

### Inmediatas (Completadas)

1. ✅ **Código Restaurado**
   - Archivo: `src/services/data.js`
   - Función: `getVillas(tenantId)`
   - Commit referencia: `185d1bd`

2. ✅ **Test Suite Creado**
   - Archivo: `test-multi-tenancy.cjs`
   - 16 validaciones automáticas
   - Verifica aislamiento Gita/Jose
   - Exit code 0 = OK, 1 = FAIL

3. ✅ **Documentación Creada**
   - Archivo: `DATABASE_SCHEMA.md`
   - Esquema completo de tablas
   - Lógica correcta de multi-tenancy
   - Errores comunes y cómo evitarlos

4. ✅ **Protocolo Actualizado**
   - PROTOCOLO_OBLIGATORIO_COMMIT_PUSH_V2.md → v3.0
   - Nuevo Paso 1.5: Tests multi-tenancy obligatorios
   - Checklist actualizado

### Preventivas (Implementadas)

1. ✅ **Test Automático Obligatorio**
   - Ejecutar `test-multi-tenancy.cjs` ANTES de commit
   - SI modifica: data.js, queries de villas/bookings/properties
   - DEBE pasar 16/16 tests
   - SI FALLA → NO COMMIT

2. ✅ **Documentación de Referencia**
   - DATABASE_SCHEMA.md como fuente de verdad
   - LEER antes de modificar queries
   - Incluye commit de referencia (185d1bd)

3. ✅ **Protocolo de Commit Actualizado**
   - Versión 3.0 incluye paso de tests
   - NO se puede hacer commit si tests fallan
   - Checklist incluye verificación de tests

---

## Lessons Learned

### Lo que falló

1. **No verificar esquema antes de codificar**
   - Claude asumió que `villas` tiene `tenant_id`
   - No consultó Supabase para confirmar estructura

2. **No ejecutar tests antes de commit**
   - El bug pasó desapercibido
   - NO hay CI/CD que ejecute tests automáticamente

3. **Falta de documentación**
   - NO había documento que explicara arquitectura multi-tenancy
   - NO había guía de "cómo filtrar villas correctamente"

### Lo que funcionó

1. **Usuario reportó inmediatamente**
   - Detección rápida del problema
   - Usuario confirmó que "estaba bien antes"

2. **Git history como fuente de verdad**
   - Commit 185d1bd tenía implementación correcta
   - Pudo restaurarse rápidamente

3. **Scripts de debug**
   - `debug-tenant-villas.cjs` reveló el problema real
   - Confirmó que villas NO tienen tenant_id

### Mejoras Implementadas

1. ✅ **Tests Automáticos**
   - test-multi-tenancy.cjs con 16 validaciones
   - Ejecutable antes de cada commit
   - Clara indicación de PASS/FAIL

2. ✅ **Documentación Completa**
   - DATABASE_SCHEMA.md con esquema real
   - Ejemplos de código correcto vs incorrecto
   - Referencias a commits funcionales

3. ✅ **Protocolo Mejorado**
   - Paso obligatorio de tests
   - NO se puede saltear
   - Protocolo v3.0 más robusto

---

## Verification

### Tests Ejecutados Post-Fix

```bash
$ node test-multi-tenancy.cjs

✅ Tests Pasados: 16
❌ Tests Fallidos: 0
📈 Total Tests: 16

✅ TODOS LOS TESTS PASARON
```

### Verificación Manual

**Jose Login:**
- ✅ Ve solo 5 villas (USD)
- ✅ NO ve villas de Gita
- ✅ Filtrado correcto

**Gita Login:**
- ✅ Ve solo 3 villas (IDR)
- ✅ NO ve villas de Jose
- ✅ Filtrado correcto

---

## Files Modified

### Source Code
- `src/services/data.js` - Restaurada función `getVillas()`

### Tests
- `test-multi-tenancy.cjs` (NEW) - Test suite automatizado

### Documentation
- `DATABASE_SCHEMA.md` (NEW) - Esquema de BD y arquitectura
- `PROTOCOLO_OBLIGATORIO_COMMIT_PUSH_V2.md` - Actualizado a v3.0
- `INCIDENT_REPORT_03MAR2026.md` (THIS FILE) - Reporte del incidente

### Debug Scripts (Created during investigation)
- `debug-tenant-villas.cjs` - Reveló el problema
- `URGENT-restore-tenant-ids.cjs` - Intento fallido (columna no existe)

---

## Next Steps

### Para Desarrollo Futuro

1. **SIEMPRE ejecutar test-multi-tenancy.cjs antes de commit a data.js**
2. **SIEMPRE consultar DATABASE_SCHEMA.md antes de queries**
3. **SIEMPRE seguir protocolo v3.0 completo**
4. **CONSIDERAR:** CI/CD pipeline que ejecute tests automáticamente

### Monitoreo

- [ ] Verificar que Gita no reporta ver villas de Jose
- [ ] Verificar en producción (Vercel) después del próximo deploy
- [ ] Considerar agregar logging de "qué villas ve cada usuario"

---

## Responsible Parties

**Reportó el Bug:** Usuario (Jose)
**Investigó y Corrigió:** Claude Code
**Verificó la Solución:** Usuario confirmó "Ahora funciona"
**Creó Medidas Preventivas:** Claude Code
**Aprobó Medidas:** Usuario

---

## Attachments

1. `test-multi-tenancy.cjs` - Test suite
2. `DATABASE_SCHEMA.md` - Esquema de BD
3. Commit `185d1bd` - Implementación correcta de referencia

---

**Status Final:** ✅ RESUELTO
**Última Actualización:** 03 Mar 2026
**Próxima Revisión:** Antes del próximo commit a data.js
