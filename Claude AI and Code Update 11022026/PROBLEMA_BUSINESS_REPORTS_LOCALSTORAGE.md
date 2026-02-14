# Problema Técnico: Business Reports localStorage Persistence

**Fecha:** 11 Febrero 2026
**Archivo:** `src/components/Autopilot/Autopilot.jsx`
**Status:** ⚠️ NO RESUELTO

---

## 🔴 DESCRIPCIÓN DEL PROBLEMA

El informe generado en Business Reports no persiste al salir y volver a entrar en la sección, a pesar de estar guardado correctamente en localStorage.

---

## 📊 COMPORTAMIENTO ACTUAL vs ESPERADO

### Comportamiento Actual (INCORRECTO)
1. Usuario entra a Business Reports → **Pantalla en blanco**
2. Usuario hace clic en "Generate Report" → **Informe se genera PERFECTO**
3. Usuario sale de la sección → (informe guardado en localStorage)
4. Usuario vuelve a entrar → **Pantalla en blanco de nuevo** ❌

### Comportamiento Esperado (CORRECTO)
1. Usuario entra a Business Reports → Muestra mensaje "Click Generate" (si no hay report guardado)
2. Usuario hace clic en "Generate Report" → Informe se genera y guarda
3. Usuario sale de la sección → (informe guardado en localStorage)
4. Usuario vuelve a entrar → **Informe se carga automáticamente desde localStorage** ✅

---

## 🔍 ANÁLISIS TÉCNICO

### Código Actual (No funciona)

**Autopilot.jsx - Líneas 56-77:**
```javascript
const iframeRef = React.useRef(null);

useEffect(() => {
  if (activeSection === 'businessReports' && iframeRef.current) {
    setTimeout(() => {
      if (!iframeRef.current) {
        console.log('⚠️  Iframe not ready');
        return;
      }

      const savedReport = localStorage.getItem(`business-report-${selectedProperty}`);

      if (savedReport) {
        console.log(`📄 Loading saved report for ${selectedProperty}`);
        iframeRef.current.srcdoc = savedReport;
      } else {
        console.log(`📝 No saved report for ${selectedProperty}`);
        iframeRef.current.srcdoc = '<html><body>Click Generate</body></html>';
      }
    }, 100);
  }
}, [activeSection, selectedProperty]);
```

**Autopilot.jsx - Líneas 2107-2118:**
```javascript
<iframe
  ref={iframeRef}
  id="business-report-frame"
  style={{
    width: '100%',
    height: '3500px',
    border: 'none',
    display: 'block'
  }}
  title="Business Report"
/>
```

### Por qué NO funciona

**Problema 1: Timing**
- El useEffect corre pero el iframe podría no estar completamente montado
- El setTimeout de 100ms no es suficiente o el ref no está disponible

**Problema 2: React Reconciliation**
- React podría estar bloqueando la actualización del srcdoc
- El iframe sin srcDoc inicial queda completamente vacío

**Problema 3: Browser Behavior**
- Los iframes tienen comportamiento especial con srcdoc
- El navegador móvil podría tener reglas de seguridad adicionales

---

## 🔧 INTENTOS REALIZADOS (TODOS FALLARON)

### Intento 1: getElementById
```javascript
const iframe = document.getElementById('business-report-frame');
iframe.srcdoc = savedReport;
```
**Resultado:** Pantalla en blanco

### Intento 2: useRef
```javascript
const iframeRef = React.useRef(null);
iframeRef.current.srcdoc = savedReport;
```
**Resultado:** Pantalla en blanco

### Intento 3: setTimeout con delays variables
```javascript
setTimeout(() => { /* ... */ }, 100);  // No funciona
setTimeout(() => { /* ... */ }, 500);  // No funciona
setTimeout(() => { /* ... */ }, 1000); // No funciona
```
**Resultado:** Pantalla en blanco

### Intento 4: key prop para forzar re-render
```javascript
<iframe key={selectedProperty} />
```
**Resultado:** Destroza el iframe completamente en cada cambio

### Intento 5: srcDoc inicial
```javascript
<iframe srcDoc="Loading..." />
```
**Resultado:** React bloquea la actualización posterior del srcdoc

### Intento 6: Limpiar cache de Vite
```bash
rm -rf node_modules/.vite dist
```
**Resultado:** Sin cambio

---

## ✅ QUÉ SÍ FUNCIONA

1. **localStorage.setItem()** - El guardado funciona correctamente
2. **localStorage.getItem()** - La lectura devuelve el HTML correcto
3. **console.log()** - Los logs muestran que el código se ejecuta
4. **Generación del report** - El report se genera perfectamente con todos los cambios CSS mobile

**Confirmado:**
- El HTML está en localStorage: ✅
- El useEffect se ejecuta: ✅
- El ref existe: ✅
- El código de actualización corre: ✅
- Pero el iframe NO muestra el contenido: ❌

---

## 💡 SOLUCIONES PROPUESTAS PARA MAÑANA

### Solución 1: State de React (RECOMENDADA)
**Simplicidad:** ⭐⭐⭐⭐⭐
**Probabilidad de éxito:** 90%

```javascript
const [reportHTML, setReportHTML] = useState('');

// Al entrar, cargar de localStorage
useEffect(() => {
  if (activeSection === 'businessReports') {
    const saved = localStorage.getItem(`business-report-${selectedProperty}`);
    if (saved) {
      setReportHTML(saved);
    } else {
      setReportHTML('<html><body>Click Generate</body></html>');
    }
  }
}, [activeSection, selectedProperty]);

// Al generar
const handleGenerate = async () => {
  const html = await generateReport();
  setReportHTML(html);
  localStorage.setItem(`business-report-${selectedProperty}`, html);
};

// Render
<iframe srcDoc={reportHTML} />
```

**Ventajas:**
- Simple y directo
- React maneja toda la reconciliation
- No hay problemas de timing
- srcDoc se actualiza automáticamente cuando cambia el state

**Desventajas:**
- Ninguna

---

### Solución 2: useLayoutEffect
**Simplicidad:** ⭐⭐⭐
**Probabilidad de éxito:** 60%

```javascript
useLayoutEffect(() => {
  if (activeSection === 'businessReports' && iframeRef.current) {
    const saved = localStorage.getItem(`business-report-${selectedProperty}`);
    if (saved) {
      iframeRef.current.srcdoc = saved;
    }
  }
}, [activeSection, selectedProperty]);
```

**Ventajas:**
- Ejecuta ANTES de que el browser pinte
- Mejor timing que useEffect

**Desventajas:**
- Podría seguir teniendo el mismo problema

---

### Solución 3: Key prop forzado
**Simplicidad:** ⭐⭐⭐⭐
**Probabilidad de éxito:** 70%

```javascript
const [iframeKey, setIframeKey] = useState(0);
const [reportHTML, setReportHTML] = useState('');

useEffect(() => {
  if (activeSection === 'businessReports') {
    const saved = localStorage.getItem(`business-report-${selectedProperty}`);
    if (saved) {
      setReportHTML(saved);
      setIframeKey(prev => prev + 1); // Fuerza re-mount
    }
  }
}, [activeSection, selectedProperty]);

<iframe key={iframeKey} srcDoc={reportHTML} />
```

**Ventajas:**
- Fuerza completamente el re-mount del iframe
- Garantiza que React actualice

**Desventajas:**
- Re-montar el iframe es costoso
- Podría causar flicker visual

---

### Solución 4: Eliminar localStorage (FALLBACK)
**Simplicidad:** ⭐⭐⭐⭐⭐
**Probabilidad de éxito:** 100%

Simplemente no cachear. Siempre generar fresh.

```javascript
// No localStorage, solo:
<iframe srcDoc={reportHTML} />

// Usuario SIEMPRE debe hacer clic en Generate
```

**Ventajas:**
- Funciona 100%
- Código más simple

**Desventajas:**
- Usuario debe generar cada vez (tarda 3-5 segundos)
- Mala UX si el usuario entra/sale frecuentemente

---

## 📋 PLAN DE ACCIÓN PARA MAÑANA

### Paso 1: Probar Solución 1 (State de React)
1. Agregar `const [reportHTML, setReportHTML] = useState('')`
2. Mover lógica de localStorage a useEffect que actualiza state
3. Actualizar handleGenerate para usar setReportHTML
4. Probar en móvil real

**Tiempo estimado:** 15 minutos
**Si funciona:** ✅ Problema resuelto, continuar con otros módulos

### Paso 2: Si falla, probar Solución 3 (Key prop)
1. Agregar `const [iframeKey, setIframeKey] = useState(0)`
2. Incrementar key cuando se carga de localStorage
3. Probar en móvil real

**Tiempo estimado:** 10 minutos
**Si funciona:** ✅ Problema resuelto (aunque no es ideal)

### Paso 3: Si falla, usar Solución 4 (Eliminar cache)
1. Eliminar toda lógica de localStorage
2. Simplificar a generación on-demand
3. Probar en móvil real

**Tiempo estimado:** 5 minutos
**Si funciona:** ✅ Problema resuelto (pero peor UX)

---

## 🔬 DEBUGGING ADICIONAL

Si ninguna solución funciona, verificar:

1. **localStorage existe?**
   ```javascript
   console.log('Keys:', Object.keys(localStorage));
   console.log('Report:', localStorage.getItem('business-report-gita')?.length);
   ```

2. **El HTML es válido?**
   ```javascript
   const html = localStorage.getItem('business-report-gita');
   console.log('Valid HTML?', html.startsWith('<!DOCTYPE html>'));
   ```

3. **El iframe acepta srcdoc?**
   ```javascript
   const iframe = document.createElement('iframe');
   iframe.srcdoc = '<html><body>Test</body></html>';
   document.body.appendChild(iframe);
   ```

4. **Probar en desktop primero**
   - Si funciona en desktop pero no en móvil → Problema de browser móvil
   - Si no funciona en ninguno → Problema de código

---

## 📚 REFERENCIAS

- React useEffect: https://react.dev/reference/react/useEffect
- React useLayoutEffect: https://react.dev/reference/react/useLayoutEffect
- iframe srcdoc: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-srcdoc
- localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Última actualización:** 11 Febrero 2026, 10:00 PM
**Próxima revisión:** 12 Febrero 2026, mañana
**Prioridad:** ALTA (bloquea deploy de Business Reports)
