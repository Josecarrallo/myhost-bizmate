# 🔴 PENDIENTE CRÍTICO: Row Level Security (RLS)

**Fecha:** 11 Febrero 2026
**Status:** PENDIENTE - No urgente para MVP
**Prioridad:** CRÍTICA antes de segundo cliente

---

## 📋 RESUMEN EJECUTIVO

**Situación actual:**
- ❌ RLS deshabilitado en Supabase
- ✅ Seguridad gestionada desde la APP (filtros manuales `tenant_id`)
- ⚠️ n8n usa ANON KEY (debería usar SERVICE_ROLE KEY)

**Por qué está así:**
- Decisión consciente de Enero 2026
- Activar RLS rompía workflows de n8n
- MVP con 1 solo cliente (no hay riesgo multi-tenant)

**Problema:**
- Error de arquitectura inicial: n8n debió usar SERVICE_ROLE_KEY desde el principio
- Ahora estamos "atrapados" sin RLS hasta hacer la migración

---

## ⚠️ RIESGO ACTUAL

**Si alguien hackea el frontend:**
```javascript
// Puede quitar este filtro:
.eq('tenant_id', currentTenant)

// Y ver datos de TODOS los clientes
```

**Para MVP con 1 cliente:** Riesgo aceptable
**Para producción con 2+ clientes:** Riesgo CRÍTICO

---

## 🔧 SOLUCIÓN REQUERIDA

### Cuando agregar 2do cliente (OBLIGATORIO):

**1. Migrar n8n a SERVICE_ROLE_KEY**
- Cambiar credenciales en todos los workflows (21 workflows)
- SERVICE_ROLE_KEY bypasea RLS (n8n seguirá funcionando)
- Testing completo de cada workflow

**2. Activar RLS en Supabase**
```sql
-- Habilitar RLS tabla por tabla
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- etc...
```

**3. Crear políticas RLS**
```sql
-- Solo puedes ver datos de tu tenant
CREATE POLICY "tenant_isolation" ON bookings
FOR ALL USING (tenant_id = auth.jwt()->>'tenant_id');
```

**Tiempo estimado:** 2-3 días de trabajo + testing

---

## 📊 ARQUITECTURA ACTUAL vs FUTURA

### ACTUAL (MVP - 1 cliente):
```
Frontend → ANON KEY → Supabase
  └─ Filtro manual: .eq('tenant_id', xxx)
  └─ ❌ Si hackean frontend, pueden ver todo

n8n → ANON KEY → Supabase
  └─ ⚠️ ERROR DE DISEÑO (debió usar SERVICE_ROLE)
  └─ Por eso RLS está deshabilitado
```

### FUTURA (Producción - 2+ clientes):
```
Frontend → ANON KEY → Supabase + RLS
  └─ Filtro manual: .eq('tenant_id', xxx)
  └─ ✅ RLS como segunda capa de seguridad
  └─ Aunque hackeen frontend, RLS bloquea

n8n → SERVICE_ROLE_KEY → Supabase
  └─ ✅ Bypasea RLS (tiene permisos totales)
  └─ Workflows funcionan sin cambios en código
```

---

## 🎯 TRIGGERS OBLIGATORIOS

**Debes migrar a RLS ANTES de:**

1. ✅ Agregar segundo hotel/cliente (CRÍTICO)
2. ✅ Hacer signup público
3. ✅ Manejar datos ultra-sensibles (tarjetas, pasaportes)
4. ✅ Buscar inversión/certificaciones de seguridad
5. ✅ Escalar a 100+ bookings de múltiples clientes

---

## 📅 TIMELINE RECOMENDADO

### Ahora (Feb 2026):
- ✅ Continuar con MVP
- ✅ Ignorar alertas de Supabase sobre RLS
- ✅ Sistema funciona correctamente

### Antes de 2do cliente:
- 🔴 OBLIGATORIO: Migrar n8n a SERVICE_ROLE_KEY
- 🔴 OBLIGATORIO: Activar RLS tabla por tabla
- 🔴 OBLIGATORIO: Testing exhaustivo

### Tiempo necesario:
- **Preparación:** 1 día (auditoría, documentación)
- **Migración n8n:** 1 día (cambiar credenciales, testing)
- **Activar RLS:** 1 día (tabla por tabla con testing)
- **TOTAL:** 3 días mínimo

---

## 📚 DOCUMENTACIÓN RELACIONADA

**Documentos existentes:**
- `DECISION_RLS_SUPABASE.md` (4 Enero 2026)
  - Decisión original de NO activar RLS
  - Contexto histórico completo
  - Problemas que causó RLS

- `ANALISIS_IMPACTO_RLS_SUPABASE_20_ENERO_2026.md` (20 Enero 2026)
  - Análisis técnico detallado
  - Plan de migración paso a paso (líneas 280-665)
  - Tests de regresión
  - Rollback plan

**Ubicación:**
- `Claude AI and Code Update 04012026/DECISION_RLS_SUPABASE.md`
- `MYHOST Bizmate_Documentos_Estrategicos 2025_2026/ANALISIS_IMPACTO_RLS_SUPABASE_20_ENERO_2026.md`

---

## ✅ CHECKLIST PRE-MIGRACIÓN

**Antes de activar RLS, verificar:**

```
□ Confirmar que hay 2+ clientes/tenants
□ Hacer backup completo de Supabase
□ Obtener SERVICE_ROLE_KEY de Supabase Dashboard
□ Inventariar todos los workflows n8n que tocan Supabase
□ Crear tests de regresión para cada workflow
□ Documentar plan de rollback
□ Reservar 3 días completos para migración + testing
□ Avisar a usuarios de posible downtime
```

---

## 🚨 NOTA IMPORTANTE

**Este es un ERROR DE ARQUITECTURA conocido y aceptado.**

La decisión de:
1. Usar ANON_KEY en n8n (debió ser SERVICE_ROLE)
2. Deshabilitar RLS para que n8n funcione
3. Gestionar seguridad desde la APP

Fue **pragmática para MVP**, pero requiere corrección antes de escalar.

**No es negligencia, es deuda técnica consciente.**

---

## 📞 PRÓXIMOS PASOS

**Al agregar 2do cliente:**

1. Re-leer `ANALISIS_IMPACTO_RLS_SUPABASE_20_ENERO_2026.md`
2. Seguir plan de migración (FASE 1, 2, 3)
3. Reservar 3 días completos para esta tarea
4. NO hacerlo justo antes de demos importantes

---

**Última actualización:** 11 Febrero 2026
**Próxima revisión:** Al confirmar 2do cliente
**Responsable:** Equipo Técnico MY HOST BizMate
