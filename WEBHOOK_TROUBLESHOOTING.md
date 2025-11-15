# Troubleshooting: Webhook n8n - MY HOST BizMate

## PROBLEMA

Al hacer POST request al webhook de n8n, siempre responde:
```
This webhook is not registered for GET requests. Did you mean to make a POST request?
```

## CAUSA RAÍZ

El workflow **NO ESTÁ ACTIVO** en n8n (`"active": false` en el JSON del workflow).

### Cómo funciona n8n:

n8n genera **DOS URLs diferentes** para cada webhook:

| URL | Ruta | Cuándo funciona |
|-----|------|-----------------|
| **Test URL** | `/webhook-test/new_property` | Solo cuando haces click en "Listen for Test Event" (120 seg) |
| **Production URL** | `/webhook/new_property` | Solo cuando el workflow está **ACTIVO** |

Si intentas usar la Production URL cuando el workflow está inactivo, n8n responde con el error confuso que estás viendo.

---

## SOLUCIÓN RÁPIDA

### Opción 1: Activar el Workflow (Recomendado para Producción)

1. Ve a: `http://n8n-production-bb2d.up.railway.app`
2. Abre el workflow "new_property_notification"
3. Haz click en el toggle **"Active"** (esquina superior derecha)
4. Verifica que esté en **ON** (azul)
5. Usa la URL de producción:
   ```
   POST http://n8n-production-bb2d.up.railway.app/webhook/new_property
   ```

### Opción 2: Usar Test URL (Solo para Debugging)

1. En n8n, abre el workflow
2. Click en el nodo "Webhook"
3. Click en "Listen for Test Event" (dura 120 segundos)
4. Usa la URL de TEST:
   ```
   POST http://n8n-production-bb2d.up.railway.app/webhook-test/new_property
   ```

---

## PROBLEMAS ADICIONALES ENCONTRADOS

### 1. Version Antigua del Webhook Node

**Archivo actual:** `typeVersion: 1`
**Recomendado:** `typeVersion: 2` o superior

### 2. Manejo Incorrecto de Respuestas

**Problema:** Tres nodos conectan directamente a "Respond to Webhook", causando múltiples respuestas.

**Estructura actual:**
```
IF Validation ─┬─> Send Email ────┐
               ├─> Send WhatsApp ──┼─> Respond to Webhook
               └─> Supabase Insert─┘
```

**Estructura correcta:**
```
IF Validation ─┬─> Send Email ────┐
               ├─> Send WhatsApp ──┼─> Merge ─> Respond to Webhook
               └─> Supabase Insert─┘
```

---

## ARCHIVOS GENERADOS

### 1. Workflow Corregido
**Archivo:** `/home/user/myhost-bizmate/new_property_notification_workflow_FIXED.json`

**Cambios:**
- ✅ `"active": true`
- ✅ `"typeVersion": 2` en Webhook node
- ✅ Nodo "Merge" añadido para manejar respuestas correctamente
- ✅ Mejor flujo de conexiones

**Cómo importar:**
1. Ve a n8n
2. Click en "Import from File"
3. Selecciona `new_property_notification_workflow_FIXED.json`
4. Guarda y activa el workflow

### 2. Script de Prueba
**Archivo:** `/home/user/myhost-bizmate/test_webhook.ps1`

**Uso:**
```powershell
# Ejecutar en PowerShell
./test_webhook.ps1
```

El script probará automáticamente ambas URLs y te dará feedback sobre qué está mal.

---

## VERIFICACIÓN POST-FIX

### 1. Verifica que el workflow esté activo:

```bash
# En n8n, el toggle "Active" debe estar ON (azul)
```

### 2. Prueba el webhook con PowerShell:

```powershell
$body = @{
    property_id = "TEST123"
    property_name = "Villa Test"
    location = "Marbella"
    price = 250000
    created_at = "2025-11-15 10:30:00"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://n8n-production-bb2d.up.railway.app/webhook/new_property" -Method POST -Body $body -ContentType "application/json"
```

### 3. Respuesta esperada:

```json
{
  "success": true,
  "message": "Notificaciones enviadas correctamente",
  "property_id": "TEST123"
}
```

---

## REFERENCIAS

### URLs del Proyecto

- **n8n Dashboard:** `http://n8n-production-bb2d.up.railway.app`
- **Webhook Production:** `http://n8n-production-bb2d.up.railway.app/webhook/new_property`
- **Webhook Test:** `http://n8n-production-bb2d.up.railway.app/webhook-test/new_property`

### Documentación n8n

- [Webhook Node Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Common Webhook Issues](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/common-issues/)
- [Respond to Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)

---

## CONOCIMIENTO ADICIONAL

### Diferencias Test vs Production

| Aspecto | Test URL | Production URL |
|---------|----------|----------------|
| **Path** | `/webhook-test/...` | `/webhook/...` |
| **Requiere** | "Listen for Test Event" | Workflow activo |
| **Duración** | 120 segundos | Permanente |
| **Uso** | Debugging | Producción |
| **Muestra datos** | Sí, en el editor | No, solo en Executions |

### Variables de Entorno n8n (Railway)

Si necesitas configurar webhooks customizados:

```bash
WEBHOOK_URL=https://n8n-production-bb2d.up.railway.app
N8N_EDITOR_BASE_URL=https://n8n-production-bb2d.up.railway.app
N8N_LISTEN_ADDRESS=::
PORT=5678
```

---

## CONTACTO

Si el problema persiste después de aplicar estos fixes:

1. Verifica los logs de n8n en Railway
2. Revisa la pestaña "Executions" en n8n para ver errores
3. Comprueba que las credenciales SMTP estén configuradas
4. Verifica el token de WhatsApp Business API

---

**Última actualización:** 2025-11-15
**Versión:** 1.0
