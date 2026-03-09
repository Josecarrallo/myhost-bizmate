# Problema y Solución Técnica - Voice App

**Fecha:** 09 de Marzo 2026

---

## 🔴 Problema Original

### Contexto
El usuario necesitaba desplegar la funcionalidad de voz (KORA Voice Assistant) como aplicación independiente en Vercel, separada de la app principal.

### Requerimiento
- URL independiente: `voice-app-vert.vercel.app`
- Mismo código que `localhost:5174/voice` (que funciona perfectamente)
- Sin afectar la app principal
- Desplegable hoy para piloto

---

## ❌ Intentos Fallidos (2 horas)

### Intento 1: HTML Estático con CDN
```html
<!-- NO FUNCIONA -->
<script src="https://cdn.jsdelivr.net/npm/@vapi-ai/web@2.5.2/dist/index.js"></script>
```

**Problema:** `@vapi-ai/web` no exporta build UMD/browser. Solo archivos ESM individuales que requieren bundler.

**Error:** `window.Vapi` undefined

---

### Intento 2: ES Module Import desde CDN
```javascript
// NO FUNCIONA
import Vapi from 'https://unpkg.com/@vapi-ai/web@2.5.2/dist/index.mjs';
```

**Problema:** El SDK no se carga correctamente desde CDN. Dependencias faltantes.

**Error:** Módulo no se ejecuta, sin logs en consola

---

### Intento 3: Import Maps
```html
<!-- NO FUNCIONA BIEN -->
<script type="importmap">
  {
    "imports": {
      "@vapi-ai/web": "https://unpkg.com/@vapi-ai/web@2.5.2/dist/index.mjs"
    }
  }
</script>
```

**Problema:** Compatibilidad limitada en navegadores. Módulo no ejecuta correctamente.

---

### Intento 4: VAPI html-script-tag (SDK alternativo)
```javascript
// NO FUNCIONA PARA NUESTRO CASO
const vapi = window.vapiSDK.run({
  apiKey: "...",
  assistant: "56ca0b34-a9d3-43f6-a0ec-f0f4a49cf0ee"
});
```

**Problema:**
- SDK diferente (`html-script-tag` vs `@vapi-ai/web`)
- API diferente (no acepta squadId de la misma manera)
- Error 400 al intentar iniciar llamada

**Error:** `Failed to load resource: 400 (Bad Request)`

---

## ✅ Solución Final

### Análisis del Problema Raíz

**Descubrimiento clave:**

`@vapi-ai/web` (paquete npm) **requiere bundler** (Vite, Webpack, etc.) para funcionar. No está diseñado para uso directo en navegador via CDN.

**Evidencia:**
```bash
# Estructura del paquete en unpkg
@vapi-ai/web@2.5.2/dist/
├── api.js       # Archivos ESM individuales
├── api.d.ts
├── client.js
├── vapi.js
└── ...
# NO hay: index.umd.js, bundle.js, browser.js
```

**Comparación con app principal:**

| Aspecto | App Principal (✅ Funciona) | HTML Standalone (❌ No funciona) |
|---------|---------------------------|----------------------------------|
| **Carga SDK** | `import Vapi from '@vapi-ai/web'` (npm) | CDN URL |
| **Bundler** | Vite compila y empaqueta | Ninguno |
| **Build process** | `npm run build` → dist/ | Archivos crudos |
| **Dependencias** | Resueltas por npm/Vite | No resueltas |

---

### Solución Implementada

**Convertir voice-app/ en proyecto React + Vite mini**

Usar **exactamente el mismo stack** que la app principal:
- React 18.2
- Vite 4.3.9
- @vapi-ai/web 2.5.2 (instalado via npm)
- Tailwind CSS 3.3.2

**Proceso:**

1. **Crear estructura Vite:**
```bash
cd voice-app/
# Crear package.json con dependencies
# Crear vite.config.js
# Crear tailwind.config.js
```

2. **Crear src/ con código React:**
```javascript
// src/App.jsx - Página principal
import VoiceAssistant from './VoiceAssistant';

// src/VoiceAssistant.jsx - Copiado EXACTAMENTE de main app
import Vapi from '@vapi-ai/web';  // ← Funciona porque está instalado via npm
```

3. **Instalar dependencias:**
```bash
npm install
```

4. **Build y deploy:**
```bash
npm run build    # Genera dist/ con código compilado
vercel --prod    # Despliega dist/ a Vercel
```

---

## 📊 Comparación: Antes vs Después

### Antes (HTML Estático - NO FUNCIONÓ)
```
voice-app/
├── index.html (239 líneas HTML + JS inline)
└── images/lumina-avatar.jpg

Problemas:
❌ SDK no carga desde CDN
❌ window.Vapi = undefined
❌ No hay build process
❌ Dependencias no resueltas
```

### Después (React + Vite - FUNCIONA ✅)
```
voice-app/
├── src/
│   ├── App.jsx (99 líneas)
│   ├── VoiceAssistant.jsx (365 líneas - copia exacta)
│   ├── main.jsx (10 líneas)
│   └── index.css (43 líneas)
├── package.json (con @vapi-ai/web)
├── vite.config.js
└── vercel.json

npm run build → dist/ (457 KB)
Vercel deploy → https://voice-app-vert.vercel.app

Resultado:
✅ SDK carga correctamente
✅ Llamadas de voz funcionan
✅ UI idéntica a localhost:5174/voice
✅ Build automático en Vercel
```

---

## 🎯 Por Qué Funciona Ahora

### 1. **npm instala el paquete completo**
```json
{
  "dependencies": {
    "@vapi-ai/web": "^2.5.2"  // ← Incluye TODAS las dependencias
  }
}
```

### 2. **Vite resuelve imports**
```javascript
import Vapi from '@vapi-ai/web';
// Vite encuentra el paquete en node_modules/
// Compila todos los archivos necesarios
// Empaqueta en bundle optimizado
```

### 3. **Build process genera código browser-ready**
```bash
vite build
# Transforma: ESM modules → Bundle compatible navegador
# Minifica: 457 KB → 128 KB (gzip)
# Optimiza: Code splitting, tree shaking
```

### 4. **Vercel entiende Vite automáticamente**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
// Vercel detecta Vite y lo configura correctamente
```

---

## 📖 Lecciones Aprendidas

### ✅ LO QUE FUNCIONA:
1. **npm packages con bundler** (Vite, Webpack, Rollup)
2. **Mismo stack en proyectos independientes** (fácil de mantener)
3. **Copy-paste de componentes** (VoiceAssistant.jsx idéntico)
4. **Vercel CLI para deploys directos** (sin integración Git necesaria)

### ❌ LO QUE NO FUNCIONA:
1. **@vapi-ai/web desde CDN** (no tiene build para navegador)
2. **HTML estático con SDKs modernos** (mayoría requieren build)
3. **Asumir que npm package = CDN compatible** (no siempre cierto)
4. **Mezclar SDKs diferentes** (html-script-tag vs @vapi-ai/web)

### 💡 REGLA GENERAL:
**Si funciona con `npm install` + bundler → Usa el mismo approach en standalone**

No intentar "simplificar" a HTML estático si el SDK requiere bundler.

---

## ⏱️ Timeline

| Tiempo | Actividad | Resultado |
|--------|-----------|-----------|
| **2 horas** | Intentos con CDN/HTML estático | ❌ Todos fallaron |
| **10 min** | Análisis y decisión de usar Vite | ✅ Decisión correcta |
| **5 min** | Setup proyecto Vite | ✅ Estructura creada |
| **1 min** | npm install | ✅ Dependencies instaladas |
| **1 min** | npm run dev | ✅ Funciona en localhost:3000 |
| **3 seg** | npm run build | ✅ Build exitoso |
| **43 seg** | vercel --prod | ✅ Deploy exitoso |

**Total tiempo solución:** ~15 minutos
**Total tiempo intentos fallidos:** ~2 horas

**Ratio:** La solución correcta tomó **12.5% del tiempo** de los intentos incorrectos.

---

## 🔑 Conclusión

**Moraleja:** No intentar "hack" cuando el SDK está diseñado para bundler. Usar las herramientas correctas desde el principio.

**Resultado Final:** Aplicación voice-app/ funcionando perfectamente en producción, con mismo código que app principal, desplegada en 43 segundos.

---

**Documentado:** 09 de Marzo 2026
**Desarrollado con:** Claude Code
