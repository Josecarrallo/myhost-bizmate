# 📋 INSTRUCCIONES - Importar y Configurar Workflow n8n

## ✅ PASO 1 - Crear tabla audit_logs en Supabase

1. Ve a: https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag/editor
2. Click en **SQL Editor** (🗒️ en menú lateral)
3. Click **New query**
4. Pega esto:

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. Click **RUN** (o F5)
6. Confirma que la tabla aparece en **Table Editor**

---

## ✅ PASO 2 - Importar workflow a n8n

1. Abre tu n8n: https://n8n-production-bb2d.up.railway.app
2. Click en **Import from File** (o Workflows → Import)
3. Selecciona el archivo: `new_property_notification_workflow.json`
4. El workflow se importará con 7 nodos

---

## ✅ PASO 3 - Configurar credenciales SMTP (Email)

**Opción A - Gmail:**
1. En n8n, abre el nodo **Send Email**
2. Click en **Create New Credential**
3. Configura:
   - **User**: josecarrallodelafuente@gmail.com
   - **Password**: [Contraseña de aplicación de Gmail]*
   - **Host**: smtp.gmail.com
   - **Port**: 587
   - **SSL/TLS**: Activado

*Para generar contraseña de aplicación:
- https://myaccount.google.com/apppasswords

**Opción B - Otro servicio SMTP:**
- Usa tus credenciales SMTP actuales

---

## ✅ PASO 4 - Configurar WhatsApp Phone Number ID

**IMPORTANTE:** Meta te bloqueó temporalmente. Espera 1-2 horas.

**Después:**
1. Ve a: https://developers.facebook.com/apps
2. Selecciona tu app → **WhatsApp** → **API Setup**
3. Copia el **Phone Number ID** (número largo)
4. En n8n, edita el nodo **Send WhatsApp**
5. Reemplaza `PHONE_NUMBER_ID` en la URL por el número real:
   ```
   https://graph.facebook.com/v21.0/TU_PHONE_NUMBER_ID/messages
   ```

**Alternativa temporal:**
Si quieres probar YA sin WhatsApp:
- Elimina o desactiva el nodo **Send WhatsApp**
- Deja solo Email + Supabase Insert

---

## ✅ PASO 5 - Activar y obtener URL del Webhook

1. En n8n, abre el nodo **Webhook**
2. Click en **Execute Node** o **Listen for Test Event**
3. Copia la **Webhook URL** (aparecerá algo como):
   ```
   https://n8n-production-bb2d.up.railway.app/webhook/new_property
   ```
4. **Guarda** esta URL (la necesitaremos para App.jsx)

---

## ✅ PASO 6 - Probar el workflow manualmente

**Usa curl o Postman:**

```bash
curl -X POST https://n8n-production-bb2d.up.railway.app/webhook/new_property \
  -H "Content-Type: application/json" \
  -d @test_webhook_payload.json
```

**Verifica:**
- ✅ Recibes email en: josecarrallodelafuente@gmail.com
- ✅ (Opcional) Recibes WhatsApp en: +34619794604
- ✅ Se crea registro en tabla `audit_logs` de Supabase

---

## ✅ PASO 7 - Activar workflow en n8n

1. En n8n, activa el workflow (toggle ON)
2. Confirma que está **Active**

---

## 🔴 IMPORTANTE ANTES DE MODIFICAR APP.JSX

**NO modifiques App.jsx hasta que:**
- ✅ Hayas probado el workflow manualmente con curl
- ✅ Confirmes que recibes email
- ✅ Confirmes que se guarda en audit_logs
- ✅ (Opcional) Confirmes WhatsApp funcionando

**Después me confirmas:** "Workflow probado y funcionando"

---

## 📱 Datos configurados:

- **Email**: josecarrallodelafuente@gmail.com
- **WhatsApp**: +34619794604
- **Supabase**: jjpscimtxrudtepzwhag.supabase.co
- **Tabla logs**: audit_logs
- **WhatsApp Token**: Configurado en workflow
- **Phone Number ID**: PENDIENTE (Meta bloqueado temporalmente)

---

## ⚠️ Si algo falla:

1. Revisa logs en n8n (Executions)
2. Revisa credenciales SMTP
3. Confirma tabla audit_logs creada
4. No toques App.jsx todavía

**Avísame cuando hayas completado los pasos 1-7** ✅
