# 🔑 CONFIGURAR VAPI PUBLIC KEY

**Componente:** `src/components/VoiceAssistant/VoiceAssistant.jsx`
**Línea:** 14

---

## 🎯 ACCIÓN REQUERIDA:

El botón de voz "Hablar con Ayu" NO funcionará hasta que configures la Public Key de Vapi.

---

## 📋 PASO 1: Obtener Public Key de Vapi

1. **Ir a Vapi Dashboard:**
   ```
   https://dashboard.vapi.ai
   ```

2. **Login con tu cuenta**

3. **Ir a Settings → API Keys** (en el menú lateral izquierdo)

4. **Copiar tu "Public Key":**
   - Debería empezar con `pk_`
   - Ejemplo: `pk_1234567890abcdef...`
   - **IMPORTANTE:** Es la PUBLIC key, NO la private/secret key

---

## 📋 PASO 2: Configurar en el Código

### OPCIÓN A: Hardcoded (Más Rápido)

1. **Abrir archivo:**
   ```
   src/components/VoiceAssistant/VoiceAssistant.jsx
   ```

2. **Buscar línea 14:**
   ```javascript
   const publicKey = 'YOUR_VAPI_PUBLIC_KEY_HERE';
   ```

3. **Reemplazar con tu key:**
   ```javascript
   const publicKey = 'pk_1234567890abcdef...'; // TU KEY AQUÍ
   ```

4. **Guardar el archivo**

5. **El servidor de desarrollo se recargará automáticamente**

### OPCIÓN B: Variable de Entorno (Más Seguro)

1. **Crear archivo `.env.local` en la raíz del proyecto:**
   ```
   C:\myhost-bizmate\.env.local
   ```

2. **Agregar la variable:**
   ```env
   VITE_VAPI_PUBLIC_KEY=pk_1234567890abcdef...
   ```

3. **Actualizar el código (línea 14):**
   ```javascript
   const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY || 'YOUR_VAPI_PUBLIC_KEY_HERE';
   ```

4. **Reiniciar el servidor:**
   ```bash
   # Detener el servidor (Ctrl+C)
   npm run dev
   ```

---

## ✅ VERIFICAR:

Después de configurar:

1. **Recargar la app** en el navegador (http://localhost:5174)

2. **Deberías ver el botón flotante** en la esquina inferior derecha:
   ```
   🎤 Hablar con Ayu
   ```

3. **Click en el botón:**
   - Pedirá permiso para el micrófono
   - Estado cambiará a "Conectando..."
   - Luego "Conectado" con indicador verde

4. **Habla:** "Hola, quiero información sobre el hotel"

5. **Ayu debería responder** por voz

---

## 🚨 TROUBLESHOOTING:

### No veo el botón
- **Causa:** La key no está configurada
- **Solución:** Revisar que la key esté en la línea 14 del componente

### Botón aparece pero no conecta
- **Causa:** Key incorrecta o workflow IX inactivo
- **Solución 1:** Verificar que la key empieza con `pk_`
- **Solución 2:** Activar workflow IX en n8n:
  ```
  https://n8n-production-bb2d.up.railway.app
  → "Vapi Izumi Hotel - MYHOST Bizmate IX"
  → Toggle Inactive → Active
  ```

### "Permission denied" al iniciar llamada
- **Causa:** No diste permiso al micrófono
- **Solución:** Permitir acceso al micrófono en el navegador

### La llamada conecta pero no hay respuesta
- **Causa:** Workflow IX no está activo o tiene errores
- **Solución:**
  1. Ir a n8n → Executions
  2. Buscar ejecuciones del workflow IX
  3. Verificar si hay errores

---

## 🎨 PERSONALIZACIÓN (Opcional):

### Cambiar texto del botón:

**Línea 115:**
```javascript
text: 'Hablar con Ayu',
```

Cambiar por:
```javascript
text: 'Llamar Recepción',
// o
text: '☎️ Hablar Ahora',
// o lo que prefieras
```

### Cambiar color del botón:

**Línea 117:**
```javascript
color: 'bg-green-500 hover:bg-green-600'
```

Cambiar por:
```javascript
color: 'bg-blue-500 hover:bg-blue-600'  // Azul
// o
color: 'bg-purple-500 hover:bg-purple-600'  // Morado
// etc.
```

---

## 📸 RESULTADO ESPERADO:

```
┌────────────────────────────────┐
│                                │
│        Tu App MY HOST          │
│                                │
│                                │
│                                │
│                     ┌────────┐ │
│                     │  🎤    │ │
│                     │ Hablar │ │
│                     │con Ayu │ │
│                     └────────┘ │
└────────────────────────────────┘
          ↑
    Botón flotante
```

Cuando haces click:
- ✅ Pide permiso de micrófono
- ✅ Conecta con Vapi
- ✅ Puedes hablar con Ayu (recepcionista virtual)
- ✅ Ella responde por voz
- ✅ Panel muestra transcripción en tiempo real

---

**Después de configurar la key, avísame para continuar con el Dashboard AI Receptionist.** 🚀
