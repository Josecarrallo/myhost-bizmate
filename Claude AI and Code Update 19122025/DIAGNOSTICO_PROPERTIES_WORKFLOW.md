# Diagnóstico: Flujo de Properties No Envía Email

**Fecha:** 20 Diciembre 2025
**Workflow:** new_property_notification (ID: 6eqkTXvYQLdsazdC)
**URL:** https://n8n-production-bb2d.up.railway.app/workflow/6eqkTXvYQLdsazdC

## Problema

El webhook `/webhook/new_property` recibe los datos correctamente pero el email no se envía. El workflow se agota el tiempo (timeout) después de 2 minutos.

## Análisis de Ejecuciones

### Ejecución Exitosa (ID: 2795)
- **Fecha:** 2025-12-20 08:30:28
- **Estado:** ✅ SUCCESS
- **Duración:** 26ms
- **Resultado:** Email enviado correctamente

### Ejecuciones Fallidas (IDs: 2796, 2839)
- **Fechas:** 2025-12-20 08:34:10 y 08:56:09
- **Estado:** ❌ ERROR
- **Duración:** 120 segundos (timeout)
- **Error:** `Connection timeout - ETIMEDOUT`

## Causa Raíz

El nodo "Send Email" (ID: 272d443e-76f4-4d87-85dd-66aa4f70d9b5) está usando **SMTP** con credenciales que están fallando:

```json
{
  "type": "n8n-nodes-base.emailSend",
  "credentials": {
    "smtp": {
      "id": "K7jMEulzqk2LzdQp",
      "name": "SMTP account"
    }
  },
  "parameters": {
    "fromEmail": "noreply@mybizmate.com",
    "toEmail": "josecarrallodelafuente@gmail.com",
    "subject": "🏠 Nueva Propiedad Registrada - MY HOST BizMate",
    "emailFormat": "text",
    "text": ""  // ⚠️ CUERPO VACÍO
  }
}
```

**Errores Identificados:**
1. **SMTP Timeout:** La conexión SMTP se agota después de 120 segundos
2. **Cuerpo Vacío:** El email no tiene contenido en el campo `text`
3. **No Usa SendGrid:** El flujo de Bookings que SÍ funciona usa SendGrid HTTP API

## Estructura del Workflow Actual

```
Webhook (POST /new_property)
  ↓
IF Validation (verifica property_name y location)
  ↓ (true)
  ├── Send Email (SMTP) ❌ FALLA AQUÍ
  └── Supabase Insert (audit_logs)
      ↓
  Merge
      ↓
  Respond to Webhook
```

## Payload Recibido Correctamente

```json
{
  "body": {
    "property_name": "Test Villa Curl",
    "location": "Seminyak, Bali",
    "property_id": "test-123",
    "base_price": 200
  }
}
```

✅ El webhook recibe los datos correctamente
✅ La validación pasa
❌ El email falla por timeout SMTP

## Soluciones

### Solución 1: Arreglar Credenciales SMTP (Rápido pero no recomendado)

1. Ve a n8n → Credentials
2. Busca la credencial "SMTP account" (ID: K7jMEulzqk2LzdQp)
3. Verifica:
   - Host SMTP
   - Puerto (usualmente 587 o 465)
   - Usuario y contraseña
   - SSL/TLS habilitado
4. Prueba la conexión

### Solución 2: Cambiar a SendGrid HTTP API (RECOMENDADO) ⭐

**Por qué:** El flujo de Bookings funciona 100% y usa SendGrid HTTP API.

**Pasos:**

1. **Eliminar nodo SMTP:**
   - Abre el workflow: https://n8n-production-bb2d.up.railway.app/workflow/6eqkTXvYQLdsazdC
   - Elimina el nodo "Send Email" actual

2. **Agregar nodo HTTP Request:**
   ```
   Tipo: HTTP Request
   Method: POST
   URL: https://api.sendgrid.com/v3/mail/send
   Authentication: Header Auth
   Header Name: Authorization
   Header Value: Bearer [TU_SENDGRID_API_KEY]
   ```

3. **Configurar Body JSON:**
   ```json
   {
     "personalizations": [{
       "to": [{"email": "josecarrallodelafuente@gmail.com"}]
     }],
     "from": {"email": "noreply@mybizmate.com"},
     "subject": "🏠 Nueva Propiedad Registrada - MY HOST BizMate",
     "content": [{
       "type": "text/html",
       "value": "Se ha registrado una nueva propiedad: {{$json.body.property_name}} en {{$json.body.location}}"
     }]
   }
   ```

4. **Copiar del Flujo de Bookings:**
   - Abre el flujo de Bookings: https://n8n-production-bb2d.up.railway.app/workflow/OxNTDO0yitqV6MAL
   - Copia la configuración exacta del nodo de SendGrid
   - Pégala en el flujo de Properties
   - Modifica solo el subject y el contenido del email

### Solución 3: Agregar Template HTML al Email

El email actual tiene el cuerpo vacío. Deberías agregar contenido:

```html
<h1>🏠 Nueva Propiedad Registrada</h1>
<p>Se ha registrado una nueva propiedad en MY HOST BizMate:</p>
<ul>
  <li><strong>Nombre:</strong> {{$json.body.property_name}}</li>
  <li><strong>Ubicación:</strong> {{$json.body.location}}</li>
  <li><strong>Precio Base:</strong> ${{$json.body.base_price}}</li>
</ul>
<p>Revisa los detalles en el panel de administración.</p>
```

## Comparación con Flujo de Bookings

| Aspecto | Properties Workflow ❌ | Bookings Workflow ✅ |
|---------|----------------------|---------------------|
| Email Method | SMTP (timeout) | SendGrid HTTP API |
| Email Body | Vacío | HTML completo con datos |
| Tiempo de ejecución | 120s (timeout) | < 1s |
| Estado | Falla | Funciona perfectamente |

## Recomendación Final

**Usar la Solución 2** - Cambiar a SendGrid HTTP API copiando la configuración del flujo de Bookings que ya funciona.

Esto te garantiza:
- ✅ Emails rápidos (< 1 segundo vs 120s timeout)
- ✅ Configuración probada y funcionando
- ✅ Consistencia entre workflows
- ✅ Logs de SendGrid para debugging

## Próximos Pasos

1. Accede a n8n directamente
2. Implementa la Solución 2
3. Prueba el workflow con un POST a `/webhook/new_property`
4. Verifica que recibes el email
5. Documenta la SendGrid API Key usada

---

**Nota:** El código en `src/services/n8n.js` está enviando los datos correctamente. El problema está 100% en la configuración del workflow en n8n, no en el frontend.
