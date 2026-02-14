# Flujo B - Recomendaciones IA Diarias
## Guía de Instalación

### ✅ Prerequisitos

Antes de importar el workflow, necesitas:

1. **Claude API Key** (Anthropic)
   - Ve a: https://console.anthropic.com/
   - Crea una API key
   - Guárdala (la necesitarás en el paso 3)

2. **Tabla en Supabase** para guardar logs
   ```sql
   CREATE TABLE recommendation_logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     guest_id UUID,
     guest_name TEXT,
     sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     email_sent BOOLEAN DEFAULT false,
     whatsapp_sent BOOLEAN DEFAULT false,
     recommendations_count INTEGER,
     status TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **WhatsApp Business API** configurada (opcional, puedes desactivar este nodo)

---

### 📥 Paso 1: Importar el Workflow

1. Abre tu n8n: https://n8n-production-bb2d.up.railway.app
2. Click en **Workflows** → **Import from File**
3. Selecciona: `Flujo_B_Recomendaciones_IA_Diarias.json`
4. Click **Import**

---

### 🔑 Paso 2: Configurar Credenciales

El workflow necesita 3 credenciales:

#### A) Supabase
- **Nombre:** Supabase MY HOST
- **Host:** https://jjpscimtxrudtepzwhag.supabase.co
- **Service Role Key:** (tu key de Supabase)

#### B) SendGrid
- **Nombre:** SendGrid MY HOST
- **API Key:** (tu API key de SendGrid - ya la tienes configurada)

#### C) Anthropic API (NUEVA)
- Click en **Credentials** → **New**
- Tipo: **HTTP Header Auth**
- Nombre: **Anthropic API**
- Header Name: `x-api-key`
- Header Value: `tu_claude_api_key_aqui`

---

### 🛠️ Paso 3: Ajustar Nodos

#### Nodo: Claude AI
- Verifica que la credencial "Anthropic API" esté seleccionada
- El prompt ya está optimizado para Bali

#### Nodo: WhatsApp
Si NO tienes WhatsApp Business API:
- **Opción 1:** Desactiva este nodo (click derecho → Deactivate)
- **Opción 2:** Reemplaza con otro canal (Telegram, SMS, etc.)

Si SÍ tienes WhatsApp:
- Reemplaza `YOUR_PHONE_NUMBER_ID` con tu Phone Number ID
- Reemplaza `YOUR_WHATSAPP_TOKEN` con tu token

#### Nodo: Supabase Get Active Guests
Verifica que tu tabla `bookings` tenga estos campos:
- id
- name
- email
- phone
- property_id
- check_in_date
- check_out_date
- status
- preferences (opcional)

Si tu tabla es diferente, ajusta el query SQL.

---

### ✅ Paso 4: Probar el Workflow

#### Opción A: Ejecución Manual (Recomendado para probar)

1. Click en **Execute Workflow** (botón de play)
2. Si tienes huéspedes activos, verás el flujo completo
3. Si NO tienes huéspedes activos, no pasará del nodo IF

#### Opción B: Insertar Datos de Prueba

Crea un huésped de prueba en Supabase:

```sql
INSERT INTO bookings (name, email, phone, property_id, check_in_date, check_out_date, status, preferences)
VALUES (
  'Test Guest',
  'tu_email@gmail.com',
  '+1234567890',
  'villa-1',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 days',
  'active',
  'wellness, beaches, local cuisine'
);
```

Luego ejecuta el workflow manualmente.

---

### ⚙️ Paso 5: Activar el Schedule

Una vez que todo funcione:

1. Click en el toggle **Active** (arriba a la derecha)
2. El workflow se ejecutará automáticamente cada día a las 9 AM
3. Verás las ejecuciones en **Executions**

---

### 📊 Verificar Ejecuciones

Para ver si funcionó:

1. Ve a **Executions** en n8n
2. Verifica el status (Success ✅ o Error ❌)
3. Click en una ejecución para ver detalles de cada nodo
4. Revisa la tabla `recommendation_logs` en Supabase

---

### 🐛 Troubleshooting

#### Error: "No active guests found"
- Normal si no hay huéspedes con check-in activo hoy
- El workflow terminará sin enviar nada

#### Error en nodo Claude AI
- Verifica que tu API key de Anthropic sea válida
- Verifica que tengas créditos en tu cuenta Anthropic
- Modelo usado: `claude-3-5-sonnet-20241022`

#### Error en SendGrid
- Verifica que la API key sea válida
- El email "From" debe estar verificado en SendGrid

#### Error en Supabase Log
- Verifica que la tabla `recommendation_logs` exista
- Verifica que los campos coincidan

---

### 💰 Costos Estimados

Por ejecución (asumiendo 5 huéspedes activos):
- **Claude API:** ~$0.05 USD (5 llamadas × ~500 tokens c/u)
- **SendGrid:** Gratis (plan free hasta 100 emails/día)
- **WhatsApp:** Variable según proveedor

**Costo mensual aproximado:** $1.50 USD (30 días × $0.05)

---

### 🎯 Próximas Mejoras

Ideas para expandir el Flujo B:

1. **Personalización avanzada:**
   - Usar historial de reservas previas
   - Considerar clima del día
   - Filtrar por idioma del huésped

2. **Multi-idioma:**
   - Detectar idioma del huésped
   - Generar recomendaciones en su idioma

3. **Follow-up:**
   - Enviar recordatorios el día anterior al check-out
   - Pedir feedback sobre las recomendaciones

4. **Analytics:**
   - Trackear qué recomendaciones fueron útiles
   - A/B testing de prompts

---

### 📝 Notas Importantes

- ⏰ **Hora:** 9 AM (ajusta el cron si necesitas otra hora)
- 🔄 **Frecuencia:** Diario (ajusta si quieres cada 2-3 días)
- 📧 **Email From:** Usa un email verificado en SendGrid
- 🤖 **IA:** Claude 3.5 Sonnet (puedes cambiar a Haiku para ahorrar)

---

### ✅ Checklist de Instalación

- [ ] Claude API key obtenida
- [ ] Tabla `recommendation_logs` creada en Supabase
- [ ] Workflow importado en n8n
- [ ] Credencial "Anthropic API" creada
- [ ] Credencial "Supabase MY HOST" configurada
- [ ] Credencial "SendGrid MY HOST" configurada
- [ ] Nodo WhatsApp ajustado o desactivado
- [ ] Query SQL verificado con tu tabla bookings
- [ ] Huésped de prueba creado
- [ ] Workflow probado manualmente
- [ ] Ejecución exitosa ✅
- [ ] Workflow activado

---

**Tiempo estimado de instalación:** 15-20 minutos
**Dificultad:** Media
**Siguiente workflow:** Flujo C - Confirmación de Reservas Automática
