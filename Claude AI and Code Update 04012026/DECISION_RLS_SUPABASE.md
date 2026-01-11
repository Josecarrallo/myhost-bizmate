# DECISIÓN TÉCNICA: Row Level Security (RLS) en Supabase

**Fecha:** 4 Enero 2026
**Autor:** Equipo MY HOST BizMate
**Status:** DECISIÓN FINAL - NO MODIFICAR

---

## 🔴 DECISIÓN: NO HABILITAR RLS

**Tablas afectadas:**
- `leads`
- `lead_events`
- `transfers`

**Estado actual:**
- ✅ Tablas creadas
- ❌ RLS NO habilitado
- ❌ No hay políticas de seguridad

---

## 📜 CONTEXTO HISTÓRICO

### Problemas Anteriores con RLS

Durante el desarrollo del proyecto, **habilitamos RLS en tablas de Supabase** y esto causó múltiples problemas:

1. **Workflows de n8n dejaron de funcionar**
   - n8n usa `anon key` (no `service_role`)
   - Las políticas RLS bloqueaban INSERT/UPDATE desde n8n
   - Los workflows fallaban silenciosamente

2. **Debugging complejo**
   - Los errores de RLS no eran claros
   - Tardamos horas en identificar el problema
   - Afectó múltiples workflows simultáneamente

3. **Compromiso del equipo**
   - Se decidió NO tocar políticas de seguridad
   - Priorizar funcionalidad sobre seguridad en fase piloto
   - Documentar claramente para futuro

---

## 🔍 ANÁLISIS TÉCNICO

### Por qué RLS bloqueaba n8n

**Arquitectura actual:**
```
┌─────────────────────────────────────────────────┐
│  n8n Workflows                                   │
│  - Usa: ANON KEY                                 │
│  - No tiene: JWT token con user_id              │
│  - Role: anon (no authenticated)                │
└─────────────────────────────────────────────────┘
                    ↓
        API Request a Supabase
                    ↓
┌─────────────────────────────────────────────────┐
│  Supabase RLS Check                              │
│  - Policy: "TO authenticated"                    │
│  - Request role: anon                            │
│  - Result: ❌ BLOCKED                            │
└─────────────────────────────────────────────────┘
```

**Solución intentada:**
```sql
-- Política permisiva
CREATE POLICY "Allow all for anon and authenticated"
ON leads FOR ALL
TO anon, authenticated
USING (true);
```

**Problema:**
- Funcionó para algunas operaciones
- Falló para otras de forma impredecible
- Generó más confusión que soluciones

---

## ✅ DECISIÓN TOMADA

### NO habilitar RLS por ahora

**Razones:**

1. **Fase piloto con 1 solo tenant**
   - Izumi Hotel es el único cliente
   - No hay riesgo de cross-tenant data leakage
   - No hay usuarios externos maliciosos

2. **n8n como orquestador principal**
   - 80% de las operaciones son desde n8n
   - n8n necesita acceso completo sin restricciones
   - Migrar a service_role requiere refactor masivo

3. **Prioridad: Validar producto**
   - Necesitamos funcionalidad primero
   - Seguridad se puede añadir después
   - MVP debe probar concepto, no seguridad enterprise

4. **Costo-beneficio**
   - RLS consume tiempo de desarrollo
   - Beneficio mínimo en fase actual
   - ROI negativo para piloto

---

## ⚠️ RIESGOS ACEPTADOS

### Implicaciones de NO tener RLS

**Riesgo 1: Exposición de anon key**
- **Qué significa:** El anon key está en código frontend (público)
- **Impacto:** Cualquiera con el key puede leer/escribir datos
- **Mitigación:** App no es pública, solo acceso interno
- **Severidad:** 🟡 BAJA (para piloto)

**Riesgo 2: No hay aislamiento multi-tenant**
- **Qué significa:** Si añadimos Hotel B, podría ver datos de Hotel A
- **Impacto:** Violación de privacidad entre clientes
- **Mitigación:** Solo 1 tenant actual, bloquear signup nuevos
- **Severidad:** 🟡 BAJA (solo 1 tenant)

**Riesgo 3: Modificación/borrado accidental**
- **Qué significa:** Cualquier request puede hacer DELETE FROM leads
- **Impacto:** Pérdida de datos críticos
- **Mitigación:**
  - No hay usuarios maliciosos internos
  - Backups regulares de Supabase
  - Logs de actividad habilitados
- **Severidad:** 🟠 MEDIA

**Riesgo 4: No cumple estándares enterprise**
- **Qué significa:** Auditoría de seguridad rechazaría esto
- **Impacto:** No podemos vender a corporaciones sin RLS
- **Mitigación:** Habilitar RLS antes de escalar
- **Severidad:** 🟢 NULA (piloto no requiere certificaciones)

---

## 🛡️ MITIGACIONES ACTUALES

### Medidas de seguridad implementadas

1. **App no pública**
   - Solo acceso con login
   - No hay signup abierto
   - Control de acceso a nivel app

2. **Supabase Auth habilitado**
   - Usuarios autenticados en frontend
   - JWT tokens para sesiones
   - (Pero RLS no habilitado en tablas)

3. **Backups automáticos**
   - Supabase hace snapshots diarios
   - Point-in-time recovery disponible
   - Retención 7 días

4. **Logs de actividad**
   - Supabase registra todas las queries
   - Podemos auditar operaciones sospechosas
   - Alertas configurables (futuro)

5. **Red privada n8n**
   - n8n en Railway (no público)
   - Solo webhooks expuestos (HTTPS)
   - Credenciales en variables de entorno

---

## 📅 PLAN DE MIGRACIÓN A RLS

### Cuándo HABILITAR RLS

**Triggers obligatorios:**
- ✅ Añadir un segundo hotel/tenant
- ✅ Hacer la app pública (signup abierto)
- ✅ Manejar datos sensibles (tarjetas, pasaportes)
- ✅ Buscar inversión/certificaciones
- ✅ Alcanzar 100+ leads en producción

**Timeline estimado:**
- Si todo va bien: Q2 2026 (Abril-Junio)
- Antes de escalar: Sí o sí

---

### Cómo migrar a RLS

**PASO 1: Habilitar RLS sin políticas (modo bloqueo total)**
```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
```

**Resultado:** TODO dejará de funcionar (esperado)

---

**PASO 2: Migrar n8n a service_role key**

**Cambio en n8n credentials:**
```javascript
// ANTES (actual)
SUPABASE_KEY = 'eyJhbGc...[anon key]'

// DESPUÉS
SUPABASE_KEY = 'eyJhbGc...[service_role key]'
```

**Obtener service_role key:**
1. Ir a Supabase Dashboard
2. Settings → API
3. Copiar `service_role` (secret)
4. Actualizar en n8n credentials

**Implicación:**
- service_role **bypassa RLS completamente**
- n8n tendrá acceso total (como ahora)
- Workflows no necesitan cambios

---

**PASO 3: Crear políticas para frontend**

```sql
-- Policy: Frontend solo ve su propio tenant
CREATE POLICY "Users see own tenant leads"
ON leads FOR SELECT
TO authenticated
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Policy: Frontend puede crear leads de su tenant
CREATE POLICY "Users insert own tenant leads"
ON leads FOR INSERT
TO authenticated
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);

-- Policy: Frontend puede actualizar leads de su tenant
CREATE POLICY "Users update own tenant leads"
ON leads FOR UPDATE
TO authenticated
USING (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid)
WITH CHECK (tenant_id = (auth.jwt() ->> 'tenant_id')::uuid);
```

---

**PASO 4: Actualizar JWT claims en Auth**

**Añadir tenant_id al JWT token:**

```sql
-- Supabase Function (trigger on auth.users)
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  user_tenant_id uuid;
BEGIN
  -- Get user's tenant_id from profiles table
  SELECT tenant_id INTO user_tenant_id
  FROM public.profiles
  WHERE id = (event->>'user_id')::uuid;

  -- Add tenant_id to JWT claims
  event := jsonb_set(
    event,
    '{claims,tenant_id}',
    to_jsonb(user_tenant_id)
  );

  RETURN event;
END;
$$;
```

**Configurar hook en Supabase:**
- Dashboard → Authentication → Hooks
- Select "Custom Access Token"
- Enable hook

---

**PASO 5: Testing exhaustivo**

**Test matrix:**
| Escenario | Actor | Acción | Resultado Esperado |
|-----------|-------|--------|-------------------|
| n8n INSERT lead | n8n (service_role) | POST /leads | ✅ Success (bypass RLS) |
| Frontend READ leads | User A (tenant X) | GET /leads | ✅ Solo leads de tenant X |
| Frontend READ leads | User B (tenant Y) | GET /leads | ✅ Solo leads de tenant Y |
| Frontend UPDATE lead | User A | PATCH /leads/uuid-tenant-X | ✅ Success |
| Frontend UPDATE lead | User A | PATCH /leads/uuid-tenant-Y | ❌ Blocked (diferente tenant) |
| Frontend DELETE lead | User A | DELETE /leads/uuid-tenant-X | ✅ Success |

**Herramienta de testing:**
```bash
# Test como anon (debe fallar)
curl -H "apikey: [anon-key]" \
     -H "Authorization: Bearer [anon-key]" \
     https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/leads

# Test como authenticated (debe ver solo su tenant)
curl -H "apikey: [anon-key]" \
     -H "Authorization: Bearer [jwt-token-user-A]" \
     https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/leads

# Test como service_role (debe ver todo)
curl -H "apikey: [service-role-key]" \
     -H "Authorization: Bearer [service-role-key]" \
     https://jjpscimtxrudtepzwhag.supabase.co/rest/v1/leads
```

---

**PASO 6: Rollback plan**

Si algo falla:
```sql
-- DISABLE RLS (volver a estado actual)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE transfers DISABLE ROW LEVEL SECURITY;

-- Volver n8n a anon key
SUPABASE_KEY = 'eyJhbGc...[anon key]'
```

---

## 📊 COMPARATIVA: Con vs Sin RLS

| Aspecto | Sin RLS (Actual) | Con RLS (Futuro) |
|---------|------------------|------------------|
| **n8n workflows** | ✅ Funciona con anon key | ✅ Funciona con service_role |
| **Frontend** | ✅ Acceso total | ✅ Acceso filtrado por tenant |
| **Multi-tenancy** | ❌ No hay aislamiento | ✅ Aislamiento completo |
| **Seguridad** | ⚠️ Baja (OK para piloto) | ✅ Alta (producción) |
| **Complejidad** | 🟢 Baja | 🟡 Media |
| **Debugging** | 🟢 Fácil | 🟠 Más complejo |
| **Tiempo desarrollo** | 🟢 Rápido | 🟡 +2-3 días |
| **Auditorías** | ❌ No pasa | ✅ Cumple estándares |

---

## 📝 DOCUMENTACIÓN DE REFERENCIA

### Archivos relacionados

- `supabase/migrations/configure_rls.sql` - Script RLS (NO ejecutar)
- `supabase/migrations/create_leads_tables_v2.sql` - Schema actual
- Este archivo - Decisión y plan de migración

### Links útiles

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Claims Custom](https://supabase.com/docs/guides/auth/auth-hooks)
- [Service Role vs Anon Key](https://supabase.com/docs/guides/api/api-keys)

---

## ✅ CHECKLIST DE MIGRACIÓN (Para futuro)

Cuando llegue el momento de habilitar RLS:

- [ ] Confirmar que hay 2+ tenants (multi-tenancy obligatorio)
- [ ] Crear tabla `profiles` con campo `tenant_id`
- [ ] Configurar JWT hook para añadir tenant_id a claims
- [ ] Obtener service_role key de Supabase
- [ ] Actualizar credenciales n8n con service_role key
- [ ] Testear workflows n8n con service_role (debe funcionar igual)
- [ ] Habilitar RLS en tablas (modo bloqueo)
- [ ] Crear políticas para leads
- [ ] Crear políticas para lead_events
- [ ] Crear políticas para transfers
- [ ] Testear frontend con User A (tenant X)
- [ ] Testear frontend con User B (tenant Y)
- [ ] Verificar aislamiento (A no ve datos de B)
- [ ] Testear n8n workflows (deben seguir funcionando)
- [ ] Monitorear logs 24h
- [ ] Documentar nueva arquitectura
- [ ] Actualizar este documento con lecciones aprendidas

---

## 🚨 ADVERTENCIA FINAL

**A TODO DESARROLLADOR QUE LEA ESTO:**

❌ **NO HABILITES RLS** en las tablas `leads`, `lead_events`, `transfers` hasta que:
1. Tengas 2 o más tenants en producción
2. Hayas leído completamente este documento
3. Hayas seguido el plan de migración paso a paso
4. Hayas hecho testing exhaustivo

**Si lo habilitas sin seguir el plan:**
- n8n workflows dejarán de funcionar
- Frontend puede dejar de funcionar
- Perderás horas debuggeando
- Nos comprometimos a NO hacerlo en fase piloto

**Si tienes dudas:**
- Re-lee este documento
- Consulta con el equipo
- Testea en staging primero

---

**Este es un documento VIVO. Actualizar cuando cambie la situación.**

---

*Creado: 4 Enero 2026*
*Última revisión: 4 Enero 2026*
*Próxima revisión: Cuando se añada segundo tenant*
