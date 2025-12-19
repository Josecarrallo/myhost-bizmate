# ✅ N8N WORKFLOW - Verificación Final

**Fecha:** 18 Diciembre 2025
**Workflow:** DOMUS Polling - Reservations Sync
**Status:** ✅ Importado - Verificación final

---

## 🎯 CHECKLIST DE VERIFICACIÓN

### 1. Credenciales DOMUS ✅

**En el nodo "DOMUS Get Reservations":**

- [ ] **Auth Type:** "Basic Auth" (NO "Select", NO "Generic Auth Type")
- [ ] **Credential Name:** "DOMUS API Credentials" (o similar)
- [ ] **User:** `IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=`
- [ ] **Password:** `J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=`
- [ ] **Sin alertas rojas** en el panel de credenciales

**Verificar:**
1. Click en nodo "DOMUS Get Reservations"
2. Panel derecho → sección "Authentication"
3. Debe mostrar credencial seleccionada (ícono verde)

---

### 2. Query Parameters ⚠️ CRÍTICO

**En el nodo "DOMUS Get Reservations":**

- [ ] **URL:** `https://api.zodomus.com/reservations-queue`
- [ ] **Method:** GET
- [ ] **Query Parameters** debe tener 2 parámetros:

```
channelId = 1
propertyId = 5814990
```

**Cómo verificar:**
1. Click en nodo "DOMUS Get Reservations"
2. Panel derecho → pestaña "Parameters"
3. Scroll down a "Query Parameters"
4. Debe mostrar:
   - Name: `channelId` → Value: `1`
   - Name: `propertyId` → Value: `5814990`

**Si falta `propertyId`:**
1. Click "+ Add Parameter"
2. Name: `propertyId`
3. Value: `5814990`
4. Click "Save" (arriba a la derecha)

---

### 3. Credenciales Supabase ✅

**En el nodo "Insert into Supabase":**

- [ ] **Credential:** "MY HOST Supabase" seleccionada
- [ ] **Table:** `bookings`
- [ ] **Operation:** "Insert"
- [ ] Sin errores de conexión

---

### 4. Schedule Trigger ✅

**En el nodo "Schedule Trigger":**

- [ ] **Trigger Interval:** "Minutes"
- [ ] **Minutes Between Triggers:** `5`
- [ ] O cron expression: `*/5 * * * *`

---

### 5. Data Mapping ✅

**En el nodo "Map to Supabase" o similar:**

Debe mapear estos campos:
- `reservation_id` → de DOMUS `id` o `reservationId`
- `guest_name` → de DOMUS `guestName`
- `check_in` → de DOMUS `checkIn`
- `check_out` → de DOMUS `checkOut`
- `total_price` → de DOMUS `totalPrice`
- `currency_code` → de DOMUS `currencyCode`
- `source` → valor fijo: `"domus"`
- `channel_id` → de DOMUS `channelId`
- `room_id` → de DOMUS `roomId`
- `adults` → de DOMUS `adults`
- `children` → de DOMUS `children`
- `raw_data` → objeto completo de DOMUS

---

### 6. Workflow Guardado ✅

- [ ] Nombre: "DOMUS Polling - Reservations Sync"
- [ ] Status: "Inactive" (por ahora)
- [ ] Sin errores de validación
- [ ] Botón "Save" presionado

---

## 🧪 TESTING MANUAL (Antes de activar)

**Ejecutar manualmente para verificar:**

1. Click en "Execute Workflow" (botón play arriba)
2. **Resultado esperado:**
   - ✅ Sin errores de autenticación
   - ✅ Puede retornar "No hay reservas" (normal en TEST mode)
   - ✅ Si hay error, debe ser claro qué falta

**Posibles errores y soluciones:**

| Error | Causa | Solución |
|-------|-------|----------|
| 401 Unauthorized | Credenciales incorrectas | Verificar User/Password DOMUS |
| 400 Bad Request | Falta propertyId | Agregar propertyId=5814990 |
| Property not Active | Property en "Evaluation OTA" | Esperar soporte (normal) |
| Column not found | Falta columna en Supabase | SQL ya ejecutado ✅ |

---

## 🚀 ACTIVACIÓN (Cuando DOMUS esté listo)

**SOLO cuando:**
1. ✅ Soporte DOMUS haya respondido
2. ✅ Property 5814990 status = "Active"
3. ✅ Script `domus-complete-activation.cjs` ejecutado exitosamente

**Pasos:**
1. Ir a n8n Railway: https://n8n-production-bb2d.up.railway.app
2. Abrir workflow "DOMUS Polling - Reservations Sync"
3. Toggle "Inactive" → "Active" (arriba a la derecha)
4. ✅ Workflow comenzará a ejecutarse cada 5 minutos

---

## 📊 MONITOREO POST-ACTIVACIÓN

**En n8n:**
- Ir a "Executions" (panel izquierdo)
- Ver últimas ejecuciones (cada 5 min)
- Verde = Success
- Rojo = Error (click para ver detalles)

**En Supabase:**
```sql
-- Ver últimas reservas de DOMUS
SELECT * FROM bookings
WHERE source = 'domus'
ORDER BY created_at DESC
LIMIT 10;

-- Contar total
SELECT COUNT(*) FROM bookings WHERE source = 'domus';
```

**En n8n - Ver datos de ejecución:**
1. Click en ejecución verde
2. Ver datos que pasaron por cada nodo
3. Verificar datos llegaron a Supabase

---

## ⚠️ IMPORTANTE: PropertyId

El parámetro `propertyId=5814990` es **CRÍTICO**.

**Sin propertyId:**
- API retorna reservas de TODAS las properties del account
- Puede mezclar datos de diferentes properties
- Puede fallar si hay conflictos

**Con propertyId:**
- API retorna solo reservas de property 5814990 (Izumi Hotel)
- Datos limpios y específicos
- Sin conflictos

**Verificar ahora:**
```
Nodo "DOMUS Get Reservations"
→ Parameters
→ Query Parameters
→ Debe tener propertyId = 5814990
```

---

## 📁 ARCHIVOS RELACIONADOS

```
n8n_worlkflow_claude/
└── DOMUS Polling - Reservations Sync.json  ← Workflow importado

INSTRUCCIONES_N8N_WORKFLOW.md               ← Guía completa de importación
N8N_WORKFLOW_VERIFICATION.md                ← ESTE ARCHIVO (checklist)
RESUMEN_PREPARACION_COMPLETA.md             ← Resumen ejecutivo general

scripts/
├── domus-complete-activation.cjs           ← Ejecutar cuando soporte responda
└── supabase-setup-bookings.cjs             ← Verificar estructura (ya ejecutado)

supabase/
├── bookings-setup.sql                      ← SQL ejecutado ✅
└── bookings-queries.sql                    ← Queries útiles
```

---

## ✅ RESUMEN DE ESTADO

| Componente | Status | Notas |
|------------|--------|-------|
| Workflow importado | ✅ | Confirmed por usuario |
| Credenciales DOMUS | ✅ | Basic Auth configurado |
| Credenciales Supabase | ✅ | Ya existía |
| Query Parameters | ⚠️ | **VERIFICAR propertyId existe** |
| Supabase DB | ✅ | SQL ejecutado, 8 columnas agregadas |
| DOMUS Property | ⏳ | Esperando soporte active |
| Workflow activo | ❌ | NO activar hasta DOMUS listo |

---

## 🎯 PRÓXIMOS PASOS

### Ahora (Hoy 18 Dic):
1. ✅ Verificar `propertyId=5814990` en Query Parameters
2. ✅ Guardar workflow si hiciste cambios
3. ⏳ Esperar respuesta de soporte DOMUS

### Cuando soporte responda:
1. Ejecutar:
   ```bash
   node scripts/domus-complete-activation.cjs
   ```
2. Verificar output: "🎉 DOMUS Integration 100% completada!"
3. Activar workflow n8n (Inactive → Active)
4. Monitorear primeras 2-3 ejecuciones (15 min)
5. Verificar datos en Supabase

### Después:
1. Testing end-to-end completo
2. Integración con app React (Bookings module)
3. Producción (cambiar credenciales TEST → PRODUCTION)

---

## 🆘 SI ALGO FALLA

**Workflow da error al ejecutar manualmente:**
- Ver sección "Posibles errores" arriba
- Revisar credenciales están guardadas
- Verificar propertyId existe en query params

**No aparecen reservas después de activar:**
- Normal si property recién activada (no hay reservas aún)
- Crear reserva de test con el script de activación
- Esperar 5 minutos (próximo polling)

**Datos no llegan a Supabase:**
- Verificar ejecución n8n fue exitosa (verde)
- Revisar nodo "Insert into Supabase" tiene datos
- Verificar columnas existen: `node scripts/supabase-setup-bookings.cjs`

---

**¿Listo para continuar?**

✅ Workflow configurado
✅ Supabase preparado
✅ Scripts listos
⏳ Esperando soporte DOMUS

**Próxima acción:** Ejecutar `domus-complete-activation.cjs` cuando soporte active la property.
