# Conexión Frontend ↔ WF-D3 (Daily Summary)

## 📍 Estado Actual

### ✅ WF-D3 en n8n (YA EXISTE)
- **Nombre:** "WF-D3 Daily Owner Summary - AUTOPILOT v4"
- **Trigger:** CRON programado
- **Output actual:**
  ```
  Daily Summary - Izumi Hotel
  📅 2026-01-26
  📥 New inquiries: 1
  💳 Pending payments: 0
  ✅ Confirmed today: 0
  🛬 Check-ins: 0
  🛫 Check-outs: 0
  ⏰ Expired: 0
  ✨ Autopilot working!
  ```

### ✅ Frontend (RECIÉN IMPLEMENTADO)
- **Ubicación:** OPERATIONS → Autopilot → Autopilot Dashboard
- **Color:** Azul (blue-500 → blue-700)
- **Botón:** "Generate Summary" (ejecuta manualmente)
- **Endpoint esperado:** `POST /webhook/autopilot/daily-summary`

---

## 🔧 Pasos para Conectar

### 1️⃣ Modificar WF-D3 en n8n

Agregar un **Webhook node** al inicio del workflow:

```
Webhook Node:
- Method: POST
- Path: /webhook/autopilot/daily-summary
- Authentication: None (o Basic Auth según preferencia)
```

**Body esperado:**
```json
{
  "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
  "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
  "date": "2026-01-26"
}
```

### 2️⃣ Modificar Output de WF-D3

Cambiar el último nodo para devolver JSON en vez de texto:

**Actual (texto):**
```
Daily Summary - Izumi Hotel
📅 2026-01-26
📥 New inquiries: 1
...
```

**Necesario (JSON):**
```json
{
  "success": true,
  "date": "2026-01-26",
  "property_name": "Izumi Hotel",
  "new_inquiries": 1,
  "pending_payments": 0,
  "confirmed_today": 0,
  "checkins": 0,
  "checkouts": 0,
  "expired": 0,
  "message": "✨ Autopilot working!"
}
```

### 3️⃣ Copiar URL del Webhook

Una vez creado el webhook en n8n, copiar la URL completa:

```
https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary
```

### 4️⃣ Verificar en el Frontend

El código ya está listo en `Autopilot.jsx` línea 95:

```javascript
const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tenant_id: 'c24393db-d318-4d75-8bbf-0fa240b9c1db',
    property_id: '18711359-1378-4d12-9ea6-fb31c0b1bac2',
    date: new Date().toISOString().split('T')[0]
  })
});
```

---

## 🧪 Testing

### Prueba Manual:
1. Ir a: **OPERATIONS → Autopilot → Autopilot Dashboard**
2. Hacer clic en **"Generate Summary"**
3. Verificar:
   - Spinner aparece mientras carga
   - KPIs se actualizan con datos reales de Supabase
   - Mensaje de éxito
   - "Last updated: HH:MM:SS" aparece

### Prueba desde n8n:
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/autopilot/daily-summary \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "property_id": "18711359-1378-4d12-9ea6-fb31c0b1bac2",
    "date": "2026-01-26"
  }'
```

Debe devolver:
```json
{
  "success": true,
  "new_inquiries": 1,
  "pending_payments": 0,
  "confirmed_today": 0,
  "checkins": 0,
  "checkouts": 0,
  "expired": 0
}
```

---

## 📝 Notas Importantes

1. **Ejecución Manual vs CRON:**
   - CRON seguirá funcionando diariamente a las 18:00
   - El botón "Generate Summary" permite ejecutar **on-demand**
   - Ambos comparten la misma lógica del workflow

2. **Datos Demo:**
   - Si el webhook falla, el frontend muestra datos demo
   - No se rompe la experiencia del usuario

3. **Próximos Pasos:**
   - Guardar resultado en `daily_summary` table (Supabase)
   - Agregar histórico de summaries anteriores
   - Enviar WhatsApp al owner automáticamente (CRON)

---

**Fecha:** 26 Enero 2026
**Actualizado por:** Claude Code
