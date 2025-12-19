# 🧪 Importar Workflow de Testing

**Objetivo:** Crear un workflow que retorne respuestas al simulador de la app

---

## 📋 PASO 1: Importar en n8n

1. **Ir a n8n:**
   ```
   https://n8n-production-bb2d.up.railway.app
   ```

2. **Click "Add workflow" o "+"** (arriba a la derecha)

3. **Click "..." → "Import from File"**

4. **Seleccionar archivo:**
   ```
   C:\myhost-bizmate\n8n_worlkflow_claude\WhatsApp AI Agent - Testing Mode.json
   ```

5. **Click "Import"**

---

## 📋 PASO 2: Configurar Herramientas

El workflow tiene 3 herramientas que necesitan las URLs correctas:

### 1. Check Availability
**Nodo:** "Check Availability"
- **Method:** GET
- **URL:** (URL de tu API real o mock)
  ```
  https://api.example.com/rooms/availability?checkIn={{$json.checkIn}}&checkOut={{$json.checkOut}}
  ```

### 2. Calculate Price
**Nodo:** "Calculate Price"
- **Method:** GET
- **URL:**
  ```
  https://api.example.com/rooms/calculate-price?checkIn={{$json.checkIn}}&checkOut={{$json.checkOut}}&roomType={{$json.roomType}}
  ```

### 3. Create Booking
**Nodo:** "Create Booking"
- **Method:** POST
- **URL:**
  ```
  https://api.example.com/bookings
  ```
- **Body:** JSON
  ```json
  {
    "guestName": "={{$json.guestName}}",
    "guestEmail": "={{$json.guestEmail}}",
    "guestPhone": "={{$json.guestPhone}}",
    "checkIn": "={{$json.checkIn}}",
    "checkOut": "={{$json.checkOut}}",
    "roomType": "={{$json.roomType}}",
    "guests": "={{$json.guests}}"
  }
  ```

**⚠️ NOTA:** Si no tienes APIs reales aún, puedes usar:
- **Mockoon** (servidor mock local)
- **JSONPlaceholder** (https://jsonplaceholder.typicode.com)
- O simplemente dejar las URLs como están y el AI dirá "La herramienta no está disponible"

---

## 📋 PASO 3: Guardar y Activar

1. **Click "Save"** (arriba a la derecha)

2. **Nombrar:** "WhatsApp AI Agent - Testing Mode"

3. **Click toggle "Inactive" → "Active"**

---

## 📋 PASO 4: Obtener Webhook URL

1. **Click en el nodo "Webhook Test"**

2. **En el panel derecho**, verás:
   ```
   Test URL: https://n8n-production-bb2d.up.railway.app/webhook-test/whatsapp-testing
   Production URL: https://n8n-production-bb2d.up.railway.app/webhook/whatsapp-testing
   ```

3. **Copiar la Production URL**

---

## 📋 PASO 5: Actualizar el Simulador

Ahora necesitas actualizar el código del simulador para usar este nuevo webhook:

**Archivo:** `src/components/Workflows/WorkflowTester.jsx`

**Cambiar la línea 45:**

```javascript
// ANTES:
const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53', {

// DESPUÉS:
const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/whatsapp-testing', {
```

**Y cambiar el body (línea 50-73):**

```javascript
// ANTES (formato WhatsApp):
body: JSON.stringify({
  body: {
    entry: [ ... ]
  }
})

// DESPUÉS (formato simple):
body: JSON.stringify({
  text: userMessage.text
})
```

**Y ajustar la respuesta (línea 75-89):**

```javascript
// ANTES:
if (response.ok) {
  const botMessage = {
    text: '✅ Mensaje procesado...'
  };
}

// DESPUÉS:
const data = await response.json();

const botMessage = {
  id: Date.now() + 1,
  text: data.output || 'Sin respuesta',
  sender: 'bot',
  timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
};

setWhatsappMessages(prev => [...prev, botMessage]);
```

---

## 🎯 RESULTADO ESPERADO

Después de estos pasos:

✅ Simulador envía mensaje simple: `{ "text": "Hola" }`
✅ Workflow procesa con AI Agent
✅ Workflow retorna: `{ "output": "Respuesta del AI", "status": "success" }`
✅ Simulador muestra la respuesta en la interfaz

---

## 🚨 SI PREFIERES NO TOCAR EL CÓDIGO

**OPCIÓN ALTERNATIVA:** Úsalo como está.

El simulador actual:
- ✅ Envía el mensaje al workflow VIII
- ✅ Verifica que fue procesado
- ℹ️ Te indica que revises la respuesta en WhatsApp o n8n executions

**Pros:**
- No necesitas crear workflow adicional
- Pruebas el flujo exacto de producción
- Verificas que todo funciona end-to-end

**Cons:**
- No ves la respuesta del AI en el simulador
- Tienes que usar WhatsApp real o revisar n8n executions

---

## ❓ ¿QUÉ PREFIERES?

**Opción A:** Importar workflow de testing y actualizar código (10 min)
- Verás respuestas reales en el simulador

**Opción B:** Dejar como está y usar WhatsApp real
- Más simple, menos cambios

**Dime cuál prefieres y continuamos.**
