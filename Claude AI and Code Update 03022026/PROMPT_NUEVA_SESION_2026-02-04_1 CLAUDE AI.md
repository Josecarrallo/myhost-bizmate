# PROMPT NUEVA SESIÓN - MY HOST BizMate
## Fecha: 4 de Febrero 2026

---

## CONTEXTO RÁPIDO

Desarrollando **MY HOST BizMate**, plataforma SaaS para boutique hotels en Bali.

**Clientes:**
- **Izumi Hotel** (Jose) - 7 villas en Ubud - 166 bookings
- **Nismara Uma Villa** (Gita) - Piloto nuevo - 41 bookings

**Infraestructura:**
- n8n: https://n8n-production-bb2d.up.railway.app
- Supabase: https://jjpscimtxrudtepzwhag.supabase.co

**IDs críticos:**
```
Jose (Izumi):
  - tenant_id: c24393db-d318-4d75-8bbf-0fa240b9c1db
  - property_id: 18711359-1378-4d12-9ea6-fb31c0b1bac2

Gita (Nismara):
  - tenant_id: 1f32d384-4018-46a9-a6f9-058217e6924a
  - property_id: 3551cd18-af6b-48c2-85ba-4c5dc0074892
```

---

## SESIÓN DE HOY (3 Feb) - RESUMEN

Pasamos ~3 horas debuggeando RLS y multi-tenant:

### Problemas resueltos:
1. ✅ Funciones RPC actualizadas para usar `auth.uid()` siempre
2. ✅ `properties_access` de Gita estaba vacío - corregido
3. ✅ Políticas RLS simplificadas (sin subqueries circulares)
4. ✅ Gita ahora ve sus 41 bookings correctamente

### Problema pendiente CRÍTICO:
❌ **Frontend NO envía JWT token en las queries**
- `auth.uid()` funciona perfectamente cuando se envía el token manualmente
- La app tiene el token en `sessionStorage` pero no lo incluye en las requests
- **RLS está DESACTIVADO** temporalmente en todas las tablas críticas

### Informe completo:
Ver archivo: `INFORME_RLS_MULTITENANT_2026-02-03.md`

---

## ESTADO ACTUAL DE MÓDULOS

| Módulo | Estado | Notas |
|--------|--------|-------|
| **KORA** (Voice) | ⏳ Pendiente probar | Workflow construido |
| **BANYU** (WhatsApp) | ✅ Funciona | Producción |
| **LUMINA** (Lead Intelligence) | ⚠️ 75% | Decision Router NO conecta a AUTOPILOT |
| **OSIRIS** (Dashboard) | ⏳ Pendiente Claude Code | RPC functions creadas |
| **AUTOPILOT** Fase 1 | ✅ Completo | 6 escenarios probados |
| **AUTOPILOT** Fases 2-3 | ⏳ Pendiente | Reportes semanales/mensuales |
| **Follow-Up Engine** | ⚠️ Problema | No envía notificaciones al owner |
| **Content Workflows** | ⏳ Sin conectar | IDs: 8S0LKqyc1r1oqLyH, 7lqwefjJaJDKui7F |

---

## PROBLEMAS CRÍTICOS A RESOLVER

### 1. Frontend no envía JWT token (para Claude Code)
```javascript
// El cliente Supabase debe configurarse así:
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storage: window.localStorage,  // ← Cambiar de sessionStorage
    autoRefreshToken: true
  }
})
```

### 2. LUMINA Decision Router mal conectado
- Las 5 rutas (AUTOPILOT, BOOKED, FOLLOWUP, REENGAGE, CLOSE) van todas a "Respond"
- La ruta AUTOPILOT NO crea registro en `autopilot_actions`
- Necesita añadir nodos para crear la acción cuando detecta OWNER_DECISION_REQUIRED

### 3. Follow-Up Engine (ID: 38dOdJ81bIg8d6qS)
- Procesa leads correctamente
- NO envía notificaciones al owner
- Verificar nodo de notificación

---

## WORKFLOWS IDs IMPORTANTES

| Workflow | ID | Estado |
|----------|-----|--------|
| LUMINA | EtrQnkgWqqbvRjEB | ⚠️ Router mal conectado |
| Follow-Up Engine | 38dOdJ81bIg8d6qS | ⚠️ No notifica |
| AUTOPILOT Actions | E6vXYR5Xm3SYVEnC | ⏳ Inactivo |
| Guest Journey | cQLiQnqR2AHkYOjd | ⏳ Por activar |
| Content WF 1 | 8S0LKqyc1r1oqLyH | ⏳ Sin conectar |
| Content WF 2 | 7lqwefjJaJDKui7F | ⏳ Sin conectar |
| KORA Post-Call | gsMMQrc9T2uZ7LVA | ⏳ Por probar |
| KORA MCP Tools | ydByDOQWq9kJACAe | ⏳ Por probar |

---

## PRIORIDADES PARA ESTA SESIÓN

### Inmediato:
1. **Verificar fix de frontend** (si Claude Code lo arregló)
   - Si funciona → Activar RLS en todas las tablas
2. **Arreglar LUMINA** → Conectar ruta AUTOPILOT correctamente
3. **Arreglar Follow-Up Engine** → Verificar notificaciones al owner

### Si hay tiempo:
4. Probar flujos completos de KORA
5. AUTOPILOT Fases 2-3 (reportes)
6. Limpiar workflows TEMP

---

## REGLAS CRÍTICAS

1. **NO crear tablas nuevas** sin aprobación
2. **NO modificar workflows** sin instrucción explícita
3. **Mostrar estado ACTUAL** antes de hacer cambios
4. **Verificar con API** después de cada cambio
5. **Una tarea a la vez**

---

## ARCHIVOS RELEVANTES

- `INFORME_RLS_MULTITENANT_2026-02-03.md` - Informe completo de la sesión de hoy
- `MYHOST_ONBOARDING_GUIDE.md` - Guía para nuevos clientes

---

## PARA ACTIVAR RLS (cuando frontend esté listo)

```sql
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;
```

Las políticas ya están creadas y funcionan (probado manualmente).

---

## CHECKLIST ONBOARDING NUEVOS CLIENTES

- [ ] Crear usuario en `auth.users`
- [ ] Crear identidad en `auth.identities`
- [ ] Crear usuario en `public.users` con `role='owner'`
- [ ] Crear property con `owner_id = user_id`
- [ ] **Actualizar `properties_access`** ← CRÍTICO, faltaba para Gita
- [ ] Verificar login y visualización de datos

---

*Listo para continuar. ¿Por dónde empezamos?*
