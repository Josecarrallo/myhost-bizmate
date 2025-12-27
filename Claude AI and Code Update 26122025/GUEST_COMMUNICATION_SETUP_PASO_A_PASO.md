# GUEST COMMUNICATION - SETUP PASO A PASO
## Para: José Carrallo
## Fecha: 27 de Diciembre 2025

---

## 🎯 OBJETIVO

Configurar completamente Guest Communication y enviar un email de prueba a tu propio correo (josecarrallodelafuente@gmail.com).

**Tiempo estimado:** 45 minutos

---

## 📋 CHECKLIST COMPLETO

- [ ] **PASO 1:** Ejecutar SQL en Supabase (tabla communications_log)
- [ ] **PASO 2:** Insertar tu guest en Supabase
- [ ] **PASO 3:** Verificar guest en la app
- [ ] **PASO 4:** Crear cuenta SendGrid (si no la tienes)
- [ ] **PASO 5:** Importar workflow Email en n8n
- [ ] **PASO 6:** Configurar credenciales SendGrid
- [ ] **PASO 7:** Configurar credenciales Supabase
- [ ] **PASO 8:** Activar workflow
- [ ] **PASO 9:** Enviar email de prueba
- [ ] **PASO 10:** Verificar email recibido

---

## 🚀 PASO 1: EJECUTAR SQL EN SUPABASE (5 min)

### 1.1 Abrir Supabase
1. Ve a: https://supabase.com
2. Login con tu cuenta
3. Selecciona tu proyecto: **jjpscimtxrudtepzwhag**

### 1.2 Abrir SQL Editor
1. En el sidebar izquierdo, click en **"SQL Editor"**
2. Click en **"New query"** (botón verde)

### 1.3 Ejecutar SQL de communications_log
1. Abre el archivo: `C:\myhost-bizmate\supabase\communications-log-schema.sql`
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. **Pega en Supabase SQL Editor** (Ctrl+V)
4. Click en **"Run"** (botón verde abajo a la derecha)
5. **Espera el resultado:** Debería decir "Success. No rows returned"

**Si da error:**
- Lee el error
- Si dice "relation already exists" → Está bien, continúa
- Si dice otro error → Avísame

### 1.4 Verificar tabla creada
1. En SQL Editor, ejecuta:
```sql
SELECT * FROM communications_log LIMIT 1;
```
2. Debería mostrar "0 rows" (tabla vacía pero creada)

✅ **PASO 1 COMPLETADO**

---

## 👤 PASO 2: INSERTAR TU GUEST EN SUPABASE (2 min)

### 2.1 Verificar si existe tabla guests
1. En SQL Editor, ejecuta:
```sql
SELECT * FROM guests LIMIT 1;
```

**Si da error "relation does not exist":**
- Primero crea la tabla:
```sql
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own guests"
  ON public.guests FOR SELECT
  USING (tenant_id = auth.uid());

CREATE POLICY "Users can insert own guests"
  ON public.guests FOR INSERT
  WITH CHECK (tenant_id = auth.uid());
```

### 2.2 Insertar tu guest
1. Abre el archivo: `C:\myhost-bizmate\supabase\insert-guest-jose.sql`
2. Copia TODO el contenido
3. Pega en SQL Editor
4. **IMPORTANTE:** Verifica que `tenant_id` sea tu ID:
   - Debería ser: `c24393db-d318-4d75-8bbf-0fa240b9c1db`
   - Si no es ese, cámbialo por el correcto
5. Click en **"Run"**

### 2.3 Verificar guest creado
1. Ejecuta:
```sql
SELECT
  id,
  name,
  email,
  phone,
  created_at
FROM public.guests
WHERE email = 'josecarrallodelafuente@gmail.com';
```

**Resultado esperado:**
```
id: [un UUID]
name: José Carrallo
email: josecarrallodelafuente@gmail.com
phone: +34 619 79 46 04
created_at: [fecha actual]
```

✅ **PASO 2 COMPLETADO**

---

## 🖥️ PASO 3: VERIFICAR GUEST EN LA APP (2 min)

### 3.1 Abrir la app
1. Ve a: http://localhost:5174/
2. Login si no estás logueado

### 3.2 Ver guest en Guests
1. Sidebar → **OPERATIONS & GUESTS** → **Guests**
2. Deberías ver **3 guests:**
   - John Doe (mock)
   - Jane Smith (mock)
   - **José Carrallo** ← TU GUEST

**Si NO ves José Carrallo:**
- Refresca la página (F5)
- Si sigue sin aparecer: Necesitamos actualizar `loadGuests()` en `Guests.jsx`

### 3.3 Abrir perfil de José
1. Click en **"View Profile"** en tu guest
2. Verás tu email y teléfono
3. Click en tab **"Communication"**
4. Verás 2 botones:
   - 🟠 Send Email
   - 🟢 Send WhatsApp

✅ **PASO 3 COMPLETADO** (si ves tu guest)
⚠️ **PASO 3 PENDIENTE** (si no ves tu guest - avísame)

---

## 📧 PASO 4: CREAR CUENTA SENDGRID (10 min)

### 4.1 Crear cuenta SendGrid (si no la tienes)
1. Ve a: https://sendgrid.com
2. Click en **"Start for Free"** o **"Sign Up"**
3. Completa el formulario:
   - Email: Tu email
   - Password: Crea una contraseña segura
4. Verifica tu email (revisa inbox)
5. Completa el onboarding:
   - ¿Qué vas a enviar? → **"Transactional Emails"**
   - ¿Cuántos emails al mes? → **"< 1,000"**
   - ¿Tienes dominio? → **"No"** (por ahora)

### 4.2 Verificar Single Sender
1. En SendGrid dashboard, ve a **"Settings"** → **"Sender Authentication"**
2. Click en **"Get Started"** en "Single Sender Verification"
3. Click en **"Create New Sender"**
4. Completa el formulario:
   - From Name: `MY HOST BizMate`
   - From Email Address: `josecarrallodelafuente@gmail.com` (tu email)
   - Reply To: `josecarrallodelafuente@gmail.com`
   - Company Address: Tu dirección
   - City, State, Zip, Country: Tu ubicación
5. Click **"Save"**
6. **IMPORTANTE:** Revisa tu email y verifica el sender
   - Recibirás un email de SendGrid
   - Click en el link de verificación
   - Espera confirmación

### 4.3 Crear API Key
1. En SendGrid, ve a **"Settings"** → **"API Keys"**
2. Click en **"Create API Key"**
3. Configuración:
   - API Key Name: `n8n-myhost-bizmate`
   - API Key Permissions: **"Full Access"**
4. Click **"Create & View"**
5. **COPIA LA API KEY** (solo se muestra una vez)
   - Ejemplo: `SG.xxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyy`
   - **Guárdala en un lugar seguro** (la necesitaremos en PASO 6)

✅ **PASO 4 COMPLETADO**

---

## 🔧 PASO 5: IMPORTAR WORKFLOW EMAIL EN N8N (5 min)

### 5.1 Acceder a n8n
1. Ve a: https://n8n-production-bb2d.up.railway.app
2. Login con tus credenciales

### 5.2 Importar workflow
1. En el sidebar, click en **"Workflows"**
2. Click en **"+ Add Workflow"** (botón arriba a la derecha)
3. Se abre el canvas vacío
4. Click en el menú **"..."** (tres puntos arriba a la derecha)
5. Click en **"Import from File..."**
6. Selecciona el archivo:
   ```
   C:\myhost-bizmate\n8n_worlkflow_claude\WF-COMM-01-Send-Email-Guest.json
   ```
7. Click **"Open"**
8. El workflow se carga con todos los nodos

### 5.3 Verificar nodos importados
Deberías ver estos nodos:
1. **Webhook - Send Email** (trigger)
2. **Validate Channel = Email** (IF)
3. **SendGrid - Send Email**
4. **Update Status - Sent**
5. **Response - Success**
6. **Update Status - Failed**
7. **Response - Error**
8. **Response - Invalid Channel**

### 5.4 Guardar workflow
1. Arriba a la izquierda, donde dice "My workflow", cambia el nombre a:
   ```
   WF-COMM-01 - Send Email to Guest
   ```
2. Click **"Save"** (Ctrl+S)

✅ **PASO 5 COMPLETADO**

---

## 🔑 PASO 6: CONFIGURAR CREDENCIALES SENDGRID (5 min)

### 6.1 Configurar SendGrid en el nodo
1. En el workflow, click en el nodo **"SendGrid - Send Email"**
2. Se abre el panel de configuración a la derecha
3. En **"Credentials"**, verás un dropdown
4. Click en **"- Select Credential -"**
5. Click en **"+ Create New Credential"**

### 6.2 Configurar credencial
1. Se abre un modal "SendGrid API"
2. Completa:
   - **Credential name:** `SendGrid MYHOST`
   - **API Key:** Pega la API Key que copiaste en PASO 4.3
     - Ejemplo: `SG.xxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyy`
3. Click **"Save"**

### 6.3 Actualizar email remitente
1. En el mismo nodo "SendGrid - Send Email"
2. Busca el campo **"From Email"**
3. Cambia de `noreply@myhost-bizmate.com` a:
   ```
   josecarrallodelafuente@gmail.com
   ```
   (debe ser el email que verificaste en SendGrid)
4. En **"Reply To"** (opcional), pon también:
   ```
   josecarrallodelafuente@gmail.com
   ```

### 6.4 Guardar cambios
1. Click **"Save"** (Ctrl+S)

✅ **PASO 6 COMPLETADO**

---

## 🗄️ PASO 7: CONFIGURAR CREDENCIALES SUPABASE (5 min)

### 7.1 Ir a Settings → Credentials
1. En n8n, click en **"Settings"** (icono engranaje, sidebar izquierdo)
2. Click en **"Credentials"**
3. Click en **"+ Add Credential"** (botón arriba a la derecha)

### 7.2 Crear credencial HTTP Header Auth
1. En el buscador, escribe: `http header`
2. Selecciona **"HTTP Header Auth"**
3. Configuración:
   - **Credential name:** `Supabase MYHOST`
   - **Name:** `apikey`
   - **Value:** Tu Supabase anon key:
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwODczOTcsImV4cCI6MjA0ODY2MzM5N30.2DxnLWdw6oGhNMKQM4THnpQD23vhxFGhz6rBXbdZPc0
     ```
4. Click **"Save"**

### 7.3 Volver al workflow
1. Click en **"Workflows"** (sidebar)
2. Abre el workflow **"WF-COMM-01 - Send Email to Guest"**

### 7.4 Configurar credencial en nodo "Update Status - Sent"
1. Click en el nodo **"Update Status - Sent"**
2. Scroll down hasta **"Authentication"**
3. En **"Authentication"**, selecciona: `Generic Credential Type`
4. En **"Generic Auth Type"**, selecciona: `HTTP Header Auth`
5. En **"Credential for HTTP Header Auth"**, selecciona: `Supabase MYHOST`
6. Click fuera del panel para cerrar

### 7.5 Configurar credencial en nodo "Update Status - Failed"
1. Click en el nodo **"Update Status - Failed"**
2. Repite el proceso del 7.4
3. Selecciona la misma credencial `Supabase MYHOST`

### 7.6 Guardar workflow
1. Click **"Save"** (Ctrl+S)

✅ **PASO 7 COMPLETADO**

---

## ⚡ PASO 8: ACTIVAR WORKFLOW (1 min)

### 8.1 Activar workflow
1. Arriba a la derecha, verás un toggle que dice **"Inactive"**
2. Click en el toggle
3. Cambia a **"Active"** ✅
4. El toggle se pone verde
5. Aparece un mensaje: "Workflow activated"

### 8.2 Copiar URL del webhook
1. Click en el nodo **"Webhook - Send Email"** (el primero)
2. Verás un campo **"Webhook URL"**
3. **Copia la URL completa:**
   ```
   https://n8n-production-bb2d.up.railway.app/webhook/communications/send-email
   ```
4. **Guárdala** (la necesitaremos para verificar en PASO 9)

✅ **PASO 8 COMPLETADO**

---

## 🧪 PASO 9: ENVIAR EMAIL DE PRUEBA (5 min)

### 9.1 Abrir la app
1. Ve a: http://localhost:5174/
2. Login si no estás logueado
3. Ve a **OPERATIONS & GUESTS** → **Guests**

### 9.2 Abrir tu perfil
1. Busca tu guest: **José Carrallo**
2. Click en **"View Profile"**
3. Click en tab **"Communication"**

### 9.3 Enviar email
1. Click en botón **"Send Email"** 🟠
2. Se abre el modal
3. Verifica:
   - **To:** `josecarrallodelafuente@gmail.com` ✅
4. En **"Template (Optional)"**, selecciona: **"Welcome Message"**
5. El subject y message se rellenan automáticamente
6. **Edita el message si quieres** (opcional)
7. Click en **"Send Message"**

### 9.4 Verificar en la app
1. El modal se cierra
2. En "Recent Communications", deberías ver el mensaje con:
   - **Channel:** email
   - **Template:** welcome
   - **Status:** ⚠️ Puede ser "queued" o "sent"
   - **Subject:** Welcome to Your Property!
   - **Fecha:** Hoy

### 9.5 Verificar en n8n
1. Ve a n8n: https://n8n-production-bb2d.up.railway.app
2. Click en **"Executions"** (sidebar)
3. Deberías ver una ejecución nueva:
   - **Workflow:** WF-COMM-01 - Send Email to Guest
   - **Status:** ✅ Success (verde) o 🔴 Error (rojo)
4. **Click en la ejecución** para ver detalles

**Si es Success ✅:**
- Verás todos los nodos en verde
- Significa que el email se envió correctamente
- ¡Continúa a PASO 10!

**Si es Error 🔴:**
- Click en el nodo rojo
- Lee el error
- **Errores comunes:**
  - "SendGrid authentication failed" → Verifica API key en PASO 6
  - "From email not verified" → Verifica que verificaste el sender en SendGrid
  - "Supabase update failed" → Verifica credencial Supabase en PASO 7

---

## 📬 PASO 10: VERIFICAR EMAIL RECIBIDO (2 min)

### 10.1 Revisar inbox
1. Abre tu email: josecarrallodelafuente@gmail.com
2. Revisa **Inbox** (bandeja de entrada)
3. Si no está, revisa **Spam/Junk**

### 10.2 Email esperado
Deberías recibir un email con:
- **From:** MY HOST BizMate <josecarrallodelafuente@gmail.com>
- **Subject:** Welcome to Your Property!
- **Body:**
  ```
  Dear José Carrallo,

  Welcome to Your Property! We're thrilled to have you stay with us.

  Your satisfaction is our priority. If you need anything during your stay,
  please don't hesitate to reach out.

  We hope you enjoy your time with us!

  Best regards,
  The MY HOST BizMate Team
  ```

### 10.3 Verificar status en Supabase
1. Ve a Supabase SQL Editor
2. Ejecuta:
```sql
SELECT
  id,
  channel,
  template_key,
  subject,
  status,
  sent_at,
  created_at
FROM communications_log
WHERE recipient_email = 'josecarrallodelafuente@gmail.com'
ORDER BY created_at DESC
LIMIT 1;
```

**Resultado esperado:**
- **channel:** email
- **template_key:** welcome
- **subject:** Welcome to Your Property!
- **status:** sent ✅
- **sent_at:** Fecha/hora actual
- **created_at:** Fecha/hora actual

✅ **PASO 10 COMPLETADO**

---

## 🎉 ¡FELICIDADES!

**Has completado exitosamente la configuración de Guest Communication!**

### ✅ Lo que funciona ahora:
1. ✅ Tabla `communications_log` creada
2. ✅ Guest José Carrallo añadido
3. ✅ SendGrid configurado y verificado
4. ✅ Workflow n8n Email activado
5. ✅ Email enviado y recibido correctamente
6. ✅ Status actualizado en Supabase

### 🚀 Próximos pasos (opcionales):
1. **WhatsApp:** Configurar workflow WF-COMM-02 (similar al de Email)
2. **Marketing & Growth:** Implementar nuevo módulo
3. **Más workflows:** 13 workflows pendientes de los 15 totales

---

## 🐛 TROUBLESHOOTING

### Problema: Guest no aparece en la app
**Solución:**
1. Verifica en Supabase SQL:
   ```sql
   SELECT * FROM guests WHERE email = 'josecarrallodelafuente@gmail.com';
   ```
2. Si existe en Supabase pero no en app:
   - Actualiza `loadGuests()` en `Guests.jsx` para fetch real desde Supabase
   - Por ahora usa mock data

### Problema: Email no se envía
**Solución:**
1. Revisa n8n Executions (debe estar en verde)
2. Si está rojo, lee el error:
   - **SendGrid auth failed:** Verifica API key
   - **From email not verified:** Verifica sender en SendGrid
   - **Supabase failed:** Verifica credencial Supabase

### Problema: Email no llega
**Solución:**
1. Revisa **Spam/Junk**
2. Espera 1-2 minutos (puede tardar)
3. Verifica en SendGrid dashboard → Activity
4. Si SendGrid muestra "Delivered" pero no ves email:
   - Verifica filtros de Gmail
   - Revisa "All Mail"

### Problema: Status queda en "queued"
**Solución:**
1. Verifica que workflow esté **Active** en n8n
2. Revisa n8n Executions (debe haber ejecución)
3. Si no hay ejecución:
   - Webhook URL incorrecta en `communicationsService.js`
   - Verifica: `https://n8n-production-bb2d.up.railway.app/webhook/communications/send-email`

---

**Autor:** Claude Code
**Fecha:** 27 de Diciembre 2025
**Para:** José Carrallo
**Tiempo estimado total:** 45 minutos

