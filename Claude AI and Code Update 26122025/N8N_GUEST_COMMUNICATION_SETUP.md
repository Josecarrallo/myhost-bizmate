# N8N GUEST COMMUNICATION - SETUP INSTRUCTIONS
## Fecha: 26 de Diciembre 2025

---

## 📦 WORKFLOWS CREADOS

### 1. WF-COMM-01 - Send Email to Guest
**Archivo:** `n8n_worlkflow_claude/WF-COMM-01-Send-Email-Guest.json`
**Webhook:** `POST https://n8n-production-bb2d.up.railway.app/webhook/communications/send-email`
**Provider:** SendGrid
**Estado:** ⏳ Pendiente importar

### 2. WF-COMM-02 - Send WhatsApp to Guest
**Archivo:** `n8n_worlkflow_claude/WF-COMM-02-Send-WhatsApp-Guest.json`
**Webhook:** `POST https://n8n-production-bb2d.up.railway.app/webhook/communications/send-whatsapp`
**Provider:** ChakraHQ
**Estado:** ⏳ Pendiente importar

---

## 🔧 PASO 1: IMPORTAR WORKFLOWS EN N8N

### 1.1 Acceder a n8n
1. Ve a: https://n8n-production-bb2d.up.railway.app
2. Login con tus credenciales

### 1.2 Importar WF-COMM-01 (Email)
1. Click en **"Workflows"** en el sidebar
2. Click en **"Add Workflow"** (botón +)
3. Click en el menú **"..." (tres puntos)** → **"Import from File"**
4. Selecciona `n8n_worlkflow_claude/WF-COMM-01-Send-Email-Guest.json`
5. Click **"Import"**
6. El workflow se carga con todos los nodos

### 1.3 Importar WF-COMM-02 (WhatsApp)
1. Repite el proceso anterior con `WF-COMM-02-Send-WhatsApp-Guest.json`

---

## 🔑 PASO 2: CONFIGURAR CREDENCIALES

### 2.1 SendGrid API (para Email)

**Si ya tienes credenciales de SendGrid:**
1. Abre el workflow WF-COMM-01
2. Click en el nodo "SendGrid - Send Email"
3. En "Credentials", selecciona tu credencial existente de SendGrid
4. Click "Save"

**Si NO tienes credenciales de SendGrid:**
1. Ve a https://sendgrid.com
2. Login o crea cuenta (Free tier: 100 emails/día)
3. Ve a **Settings → API Keys**
4. Click **"Create API Key"**
5. Name: `n8n-myhost-bizmate`
6. Permissions: **Full Access** (o solo "Mail Send")
7. Click **"Create & View"**
8. **COPIA LA API KEY** (solo se muestra una vez)
9. En n8n:
   - Abre el workflow WF-COMM-01
   - Click en nodo "SendGrid - Send Email"
   - Click **"+ Add Credential"**
   - Pega la API key
   - Name: `SendGrid MYHOST`
   - Click **"Save"**

**Verificar email remitente:**
1. En SendGrid, ve a **Settings → Sender Authentication**
2. Si no tienes dominio verificado, usa **Single Sender Verification**
3. Verifica el email `noreply@myhost-bizmate.com` (o el que uses)
4. **IMPORTANTE:** En el workflow, cambia `fromEmail` si usas otro dominio

### 2.2 ChakraHQ API (para WhatsApp)

**Si ya tienes cuenta ChakraHQ:**
1. Ve a https://chakrahq.com o tu dashboard
2. Ve a **Settings → API Keys**
3. Copia tu API key
4. En n8n:
   - Abre el workflow WF-COMM-02
   - Click en nodo "ChakraHQ - Send WhatsApp"
   - En "Credentials", click **"+ Add Credential"**
   - Type: **HTTP Header Auth**
   - Name: `ChakraHQ API`
   - Header Name: `Authorization`
   - Header Value: `Bearer TU_API_KEY_AQUI`
   - Click **"Save"**

**Si NO tienes cuenta ChakraHQ:**
- **Alternativa temporal:** Usa Twilio (requiere cambios en el nodo)
- **O espera:** Configura WhatsApp más adelante (el sistema funciona sin WhatsApp)

### 2.3 Supabase API (para ambos workflows)

Ambos workflows necesitan actualizar la tabla `communications_log` en Supabase.

1. En n8n, ve a **Settings → Credentials**
2. Click **"+ Add Credential"**
3. Busca **"HTTP Header Auth"**
4. Configura:
   - **Name:** `Supabase MYHOST`
   - **Header Name:** `apikey`
   - **Header Value:** Tu Supabase anon key
   - Click **"Save"**

**Tu Supabase anon key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwODczOTcsImV4cCI6MjA0ODY2MzM5N30.2DxnLWdw6oGhNMKQM4THnpQD23vhxFGhz6rBXbdZPc0
```

5. En **ambos workflows** (WF-COMM-01 y WF-COMM-02):
   - Click en nodo "Update Status - Sent"
   - En "Credentials", selecciona `Supabase MYHOST`
   - Click en nodo "Update Status - Failed"
   - En "Credentials", selecciona `Supabase MYHOST`
   - Click **"Save Workflow"**

---

## ✅ PASO 3: ACTIVAR WORKFLOWS

### 3.1 Activar WF-COMM-01 (Email)
1. Abre el workflow WF-COMM-01
2. Arriba a la derecha, verás un toggle **"Inactive"**
3. Click para cambiar a **"Active"** ✅
4. Confirma la activación

### 3.2 Activar WF-COMM-02 (WhatsApp)
1. Repite el proceso con WF-COMM-02
2. Activa el workflow

---

## 🧪 PASO 4: TESTING

### 4.1 Test Manual con Postman/cURL

**Test Email Workflow:**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/communications/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "communicationId": "test-123",
    "tenantId": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "guestId": "guest-test-123",
    "channel": "email",
    "templateKey": "welcome",
    "subject": "Welcome to MY HOST BizMate!",
    "message": "Dear Guest, welcome to our property!",
    "recipient": "tu-email@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "communicationId": "test-123",
  "status": "sent",
  "provider": "SendGrid",
  "messageId": "sendgrid-msg-id-123"
}
```

**Test WhatsApp Workflow:**
```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/communications/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "communicationId": "test-456",
    "tenantId": "c24393db-d318-4d75-8bbf-0fa240b9c1db",
    "guestId": "guest-test-456",
    "channel": "whatsapp",
    "templateKey": "pre_checkin",
    "message": "Hi! Your check-in is coming up soon!",
    "recipient": "+62812345678"
  }'
```

### 4.2 Test desde Frontend

1. Ve a http://localhost:5174/
2. Login
3. Ve a **Guests** (sidebar)
4. Click en **"View Profile"** de un guest
5. Ve a tab **"Communication"**
6. Click **"Send Email"**
7. Selecciona template "Welcome Message"
8. Click **"Send Message"**
9. Verifica:
   - Modal se cierra
   - Mensaje aparece en "Recent Communications" con status "sent"
   - Recibes el email en tu inbox
   - Revisa n8n executions (debe mostrar ejecución exitosa)

---

## 📊 PASO 5: MONITOREO

### 5.1 Ver Executions en n8n
1. En n8n, ve a **"Executions"** en el sidebar
2. Verás todas las ejecuciones de los workflows
3. Click en una ejecución para ver detalles
4. Verifica:
   - ✅ Verde = Success
   - 🔴 Rojo = Error (click para ver detalles)

### 5.2 Ver Communications Log en Supabase
1. Ve a Supabase SQL Editor
2. Ejecuta:
```sql
SELECT
  id,
  channel,
  template_key,
  subject,
  message_body,
  status,
  sent_at,
  created_at
FROM communications_log
ORDER BY created_at DESC
LIMIT 10;
```

3. Verifica que status sea `sent` (no `queued` ni `failed`)

---

## 🐛 TROUBLESHOOTING

### Error: "SendGrid authentication failed"
**Solución:**
1. Verifica que la API key sea correcta
2. Verifica que el email remitente esté verificado en SendGrid
3. Check SendGrid dashboard → Activity para ver errores

### Error: "ChakraHQ API error"
**Solución:**
1. Verifica que la API key sea correcta
2. Verifica formato del número (debe incluir código país: +62...)
3. Verifica que tu cuenta ChakraHQ tenga créditos

### Error: "communications_log update failed"
**Solución:**
1. Verifica que la tabla `communications_log` existe en Supabase
2. Ejecuta SQL: `SELECT * FROM communications_log LIMIT 1;`
3. Si da error, ejecuta `supabase/communications-log-schema.sql`

### Workflow no se activa
**Solución:**
1. Verifica que todas las credenciales estén configuradas
2. Click en cada nodo y verifica que no tenga warning rojo
3. Guarda el workflow antes de activar

### Mensajes quedan en status "queued"
**Solución:**
1. Verifica que los workflows estén **ACTIVE** en n8n
2. Revisa n8n Executions para ver si hay errores
3. Verifica webhook URL en `communicationsService.js`:
   - Debe ser: `https://n8n-production-bb2d.up.railway.app/webhook/communications/send-email`
   - Si tu n8n está en otra URL, actualiza el servicio

---

## 📝 CONFIGURACIÓN FINAL

### Actualizar Webhook URLs (si es necesario)

Si tu n8n está en una URL diferente, actualiza `src/services/communicationsService.js`:

```javascript
// Línea ~250
const N8N_BASE_URL = 'https://TU-N8N-URL.up.railway.app';
```

### Configurar Emails From/Reply-To

En el workflow WF-COMM-01, personaliza:
- **fromEmail:** Email verificado en SendGrid
- **replyTo:** Email de soporte (opcional)

---

## ✅ CHECKLIST FINAL

Antes de dar por completado:

- [ ] WF-COMM-01 importado en n8n
- [ ] WF-COMM-02 importado en n8n
- [ ] SendGrid API configurada
- [ ] ChakraHQ API configurada (o Twilio alternativa)
- [ ] Supabase API configurada en ambos workflows
- [ ] Ambos workflows **ACTIVE** ✅
- [ ] Test manual con cURL exitoso
- [ ] Test desde frontend exitoso
- [ ] Email recibido en inbox
- [ ] Communications log actualizado en Supabase
- [ ] n8n executions sin errores

---

## 🎯 PRÓXIMOS PASOS (OPCIONAL)

### Mejoras Futuras
1. **Error Retry Logic:** Reintento automático si falla
2. **Read Receipts:** Tracking de opens/clicks (email)
3. **WhatsApp Templates:** Templates aprobados por Meta
4. **Bulk Send:** Envío masivo a múltiples guests
5. **Scheduling:** Programar envíos para fecha/hora específica
6. **Analytics Dashboard:** Métricas de engagement

---

**Autor:** Claude Code
**Fecha:** 26 de Diciembre 2025
**Branch:** backup-antes-de-automatizacion
**Workflows:** 2/15 completados

