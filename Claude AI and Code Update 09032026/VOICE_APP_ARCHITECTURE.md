# Voice App - Arquitectura del Proyecto

**Proyecto:** KORA Voice Assistant - Standalone App
**Fecha:** 09 de Marzo 2026
**URL Producción:** https://voice-app-vert.vercel.app

---

## 📁 Estructura del Proyecto

```
voice-app/
├── src/
│   ├── App.jsx                  # Componente principal (99 líneas)
│   ├── VoiceAssistant.jsx       # Integración VAPI (365 líneas)
│   ├── main.jsx                 # Entry point React (10 líneas)
│   └── index.css                # Styles + Tailwind (43 líneas)
├── public/
│   └── images/
│       └── lumina-avatar.jpg    # Avatar KORA (6.9 MB)
├── images/
│   └── lumina-avatar.jpg        # (duplicado legacy)
├── index.html                   # HTML entry point (12 líneas)
├── package.json                 # Dependencies
├── package-lock.json            # Lock file (2,362 líneas)
├── vite.config.js               # Vite config (14 líneas)
├── tailwind.config.js           # Tailwind config (11 líneas)
├── postcss.config.js            # PostCSS config (6 líneas)
├── vercel.json                  # Vercel deployment (10 líneas)
├── .gitignore                   # Git ignore (5 líneas)
└── README.md                    # Documentation (107 líneas)

# Build outputs (ignorados por git)
├── node_modules/               # 139 packages
├── dist/                       # Build de producción
│   ├── index.html
│   └── assets/
│       ├── index-[hash].css   # 15.23 KB
│       └── index-[hash].js    # 457.06 KB
└── .vercel/                    # Config Vercel
```

**Total archivos rastreados:** 15
**Total líneas de código:** 3,068
**Tamaño node_modules:** ~50 MB
**Tamaño dist/:** 457 KB (128 KB gzipped)

---

## 🏗️ Arquitectura de Componentes

```
┌─────────────────────────────────────────────┐
│           index.html (root)                 │
│            <div id="root">                  │
└───────────────────┬─────────────────────────┘
                    │
                    │ ReactDOM.render
                    ▼
┌─────────────────────────────────────────────┐
│          main.jsx (Entry Point)             │
│   - ReactDOM.createRoot()                   │
│   - Imports App.jsx                         │
│   - Imports index.css                       │
└───────────────────┬─────────────────────────┘
                    │
                    │ <App />
                    ▼
┌─────────────────────────────────────────────┐
│              App.jsx                        │
│   ┌───────────────────────────────────┐    │
│   │  <VoiceAssistant /> (floating)    │    │
│   └───────────────────────────────────┘    │
│                                             │
│   ┌───────────────────────────────────┐    │
│   │  Main Content Container           │    │
│   │  - Logo + Avatar                  │    │
│   │  - Trilingual Titles              │    │
│   │  - Features Grid (3 cards)        │    │
│   │  - CTA Section                    │    │
│   │  - Footer                         │    │
│   └───────────────────────────────────┘    │
└───────────────────┬─────────────────────────┘
                    │
                    │ Component
                    ▼
┌─────────────────────────────────────────────┐
│         VoiceAssistant.jsx                  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  useEffect(() => {                  │  │
│   │    vapiRef.current = new Vapi(key)  │  │
│   │    Setup event listeners            │  │
│   │  })                                 │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Floating Button (idle state)      │  │
│   │  - KORA avatar                      │  │
│   │  - "KORA Voice Assistant" label     │  │
│   │  - Phone icon button                │  │
│   │  - onClick: handleStartCall()       │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Active Call UI (call state)       │  │
│   │  - Transcript panel                 │  │
│   │  - "Listening..." indicator         │  │
│   │  - End Call button (red)            │  │
│   └─────────────────────────────────────┘  │
│                                             │
│   ┌─────────────────────────────────────┐  │
│   │  Loading UI (connecting state)     │  │
│   │  - "Connecting to KORA..." message  │  │
│   │  - Spinner animation                │  │
│   └─────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    │
                    │ VAPI SDK
                    ▼
┌─────────────────────────────────────────────┐
│         @vapi-ai/web (npm package)          │
│   - WebRTC connection                       │
│   - Audio streaming                         │
│   - Event system                            │
│   - Squad management                        │
└───────────────────┬─────────────────────────┘
                    │
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────┐
│         VAPI Cloud (api.vapi.ai)            │
│   - Squad: 56ca0b34-a9d3-43f6-a0ec-f0f4    │
│   - 3 Assistants: KORA_EN/ES/ID            │
│   - Model: Claude Sonnet 4                 │
│   - MCP Server: n8n integration            │
└─────────────────────────────────────────────┘
```

---

## 🔌 Flujo de Datos

### 1. Inicialización (Mount)
```javascript
useEffect(() => {
  // 1. Crear instancia VAPI
  vapiRef.current = new Vapi('3716bc62-40e8-4f3b-bfa2-9e934db6b51d');

  // 2. Setup event listeners
  vapiRef.current.on('call-start', handleCallStart);
  vapiRef.current.on('call-end', handleCallEnd);
  vapiRef.current.on('speech-start', handleSpeechStart);
  vapiRef.current.on('speech-end', handleSpeechEnd);
  vapiRef.current.on('message', handleMessage);
  vapiRef.current.on('error', handleError);

  // 3. Cleanup on unmount
  return () => vapiRef.current?.stop();
}, []);
```

### 2. Inicio de Llamada (User Click)
```javascript
handleStartCall() {
  setIsLoading(true);

  // Llamar VAPI con Squad ID
  await vapiRef.current.start(
    null,                                      // assistant config (null = use squad)
    null,                                      // metadata
    '56ca0b34-a9d3-43f6-a0ec-f0f4a49cf0ee'   // squad ID
  );
}

// VAPI internamente:
// 1. Establece WebRTC connection
// 2. Solicita permisos de micrófono
// 3. Conecta con VAPI backend
// 4. Squad router selecciona asistente (EN/ES/ID)
// 5. Inicia conversación con primer mensaje
```

### 3. Durante Llamada (Events)
```javascript
// Event: call-start
on('call-start') → {
  isCallActive = true
  Hide floating button
  Show end call button
  Initialize callDataRef
}

// Event: speech-start (usuario habla)
on('speech-start') → {
  isSpeaking = true
  Clear interim transcript
}

// Event: message (transcripción)
on('message', { type: 'transcript', transcriptType: 'partial' }) → {
  setInterimTranscript(message.transcript)  // Mostrar en tiempo real
}

on('message', { type: 'transcript', transcriptType: 'final' }) → {
  setTranscript(message.transcript)         // Transcript confirmado
  Guardar en callDataRef
}

// Event: speech-end (usuario deja de hablar)
on('speech-end') → {
  isSpeaking = false
  Clear interim transcript
}
```

### 4. Fin de Llamada
```javascript
// User clicks "End Call" OR VAPI cierra
on('call-end', callData) → {
  // 1. Guardar datos de llamada
  callDataRef.current.endTime = new Date()

  // 2. Calcular métricas
  const duration = endTime - startTime

  // 3. Enviar a n8n webhook
  await fetch('https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2', {
    method: 'POST',
    body: JSON.stringify({
      message: {
        type: 'end-of-call-report',
        call: accumulatedData
      }
    })
  })

  // 4. Reset UI
  isCallActive = false
  Show floating button
  Hide end call button
}
```

---

## 🎨 Estilos y Theming

### Colores Corporativos
```css
--color-primary: #d85a2a      /* Naranja */
--color-secondary: #f5a524    /* Amarillo/dorado */
--color-gradient: linear-gradient(to right, #d85a2a, #f5a524)
```

### Animaciones Personalizadas
```css
/* Glow pulsante del botón */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 140, 66, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 140, 66, 0.8);
  }
}

/* Fade in suave */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Responsive Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

---

## 🔐 Configuración y Secrets

### Variables VAPI (hardcoded en código)
```javascript
// src/VoiceAssistant.jsx línea 25
const publicKey = '3716bc62-40e8-4f3b-bfa2-9e934db6b51d';

// src/VoiceAssistant.jsx línea 219
const squadId = '56ca0b34-a9d3-43f6-a0ec-f0f4a49cf0ee';
```

**Nota:** Public Key puede estar en frontend. Squad ID también es público.

### n8n Webhook (hardcoded)
```javascript
// src/VoiceAssistant.jsx línea 101
const webhookUrl = 'https://n8n-production-bb2d.up.railway.app/webhook/kora-post-call-v2';
```

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "@vapi-ai/web": "^2.5.2",      // VAPI SDK
  "lucide-react": "^0.263.1",    // Iconos (Phone, PhoneOff, Loader2)
  "react": "^18.2.0",             // React core
  "react-dom": "^18.2.0"          // React DOM
}
```

### Dev Dependencies
```json
{
  "@vitejs/plugin-react": "^4.0.0",  // Vite plugin para React
  "autoprefixer": "^10.4.14",        // PostCSS autoprefixer
  "postcss": "^8.4.24",              // PostCSS
  "tailwindcss": "^3.3.2",           // Tailwind CSS
  "vite": "^4.3.9"                   // Bundler
}
```

**Total packages:** 139 (including transitive dependencies)

---

## 🚀 Build Process

### Development (npm run dev)
```bash
vite --port 3000
# ↓
# 1. Vite dev server starts on port 3000
# 2. Hot Module Replacement (HMR) enabled
# 3. Fast refresh on code changes
# 4. Source maps enabled
```

### Production Build (npm run build)
```bash
vite build
# ↓
# 1. Bundle all source files
# 2. Minify JavaScript (Terser)
# 3. Optimize CSS (PostCSS + Autoprefixer)
# 4. Generate hashed filenames for cache busting
# 5. Output to dist/
#
# Result:
# dist/index.html                   0.40 kB
# dist/assets/index-[hash].css     15.23 kB  (gzip: 3.83 kB)
# dist/assets/index-[hash].js     457.06 kB  (gzip: 128.45 kB)
```

### Deployment (vercel --prod)
```bash
vercel --prod --yes
# ↓
# 1. Vercel detects Vite project
# 2. Runs: npm install
# 3. Runs: npm run build
# 4. Uploads dist/ to Vercel CDN
# 5. Configures routing (vercel.json)
# 6. Assigns URL: voice-app-vert.vercel.app
#
# Time: ~43 seconds total
```

---

## 🌐 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│          GitHub Repository                      │
│   josecarrallo/myhost-bizmate                   │
│   /voice-app/ folder                            │
└────────────────┬────────────────────────────────┘
                 │
                 │ (Manual: vercel CLI)
                 ▼
┌─────────────────────────────────────────────────┐
│          Vercel Build Process                   │
│   1. npm install                                │
│   2. npm run build                              │
│   3. Upload dist/ to CDN                        │
└────────────────┬────────────────────────────────┘
                 │
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Vercel CDN (Edge Network)              │
│   https://voice-app-vert.vercel.app            │
│                                                 │
│   - Global CDN distribution                     │
│   - HTTPS automatic                             │
│   - HTTP/2 enabled                              │
│   - Gzip compression                            │
│   - Cache headers configured                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ User visits
                 ▼
┌─────────────────────────────────────────────────┐
│          User Browser                           │
│   1. Downloads HTML (0.4 KB)                    │
│   2. Downloads CSS (15 KB)                      │
│   3. Downloads JS bundle (457 KB)               │
│   4. React app hydrates                         │
│   5. User clicks "Call KORA"                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ WebRTC + HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│          VAPI Cloud (api.vapi.ai)               │
│   - WebRTC signaling                            │
│   - Audio processing                            │
│   - Claude Sonnet 4 inference                   │
│   - Squad routing (EN/ES/ID)                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ Webhook POST
                 ▼
┌─────────────────────────────────────────────────┐
│          n8n Automation (Railway)               │
│   https://n8n-production-bb2d.up.railway.app   │
│   - Receives call data                          │
│   - Processes transcripts                       │
│   - Triggers workflows                          │
└─────────────────────────────────────────────────┘
```

---

## 📊 Performance Metrics

### Bundle Size Analysis
```
Original (uncompressed):
├── JavaScript: 457.06 KB
├── CSS: 15.23 KB
└── HTML: 0.40 KB
Total: 472.69 KB

Compressed (gzip):
├── JavaScript: 128.45 KB  (72% reduction)
├── CSS: 3.83 KB          (75% reduction)
└── HTML: 0.29 KB         (28% reduction)
Total: 132.57 KB  (72% reduction overall)
```

### Load Time (3G Connection ~750 KB/s)
```
HTML: 0.4 KB    → 0.01s
CSS: 15 KB      → 0.02s
JS: 457 KB      → 0.61s
Avatar: 6.9 MB  → 9.20s
─────────────────────────
Total First Paint: ~0.64s (sin avatar)
Total Full Load: ~9.84s (con avatar)
```

### Optimization Opportunities
1. **Optimizar imagen avatar:** 6.9 MB → ~100 KB (WebP)
2. **Code splitting:** Separar VAPI SDK del bundle principal
3. **Lazy load avatar:** Cargar después del First Paint

---

## 🔒 Security Considerations

### ✅ Safe (Public)
- VAPI Public Key (diseñado para frontend)
- Squad ID (público)
- n8n webhook URL (sin autenticación sensible)

### ⚠️ Protections Needed
- Rate limiting en VAPI (configurado en dashboard)
- CORS headers (manejado por VAPI)
- Abuse prevention (monitoreo manual)

### 🔐 Best Practices Applied
- HTTPS only (Vercel default)
- No API secrets en frontend
- No localStorage de datos sensibles
- CSP headers (Vercel default)

---

## 📈 Monitoring y Analytics

### Actualmente NO implementado (futuro)
- [ ] Call volume tracking
- [ ] Error rate monitoring
- [ ] Response time metrics
- [ ] User geography
- [ ] Browser analytics

### Donde agregar
```javascript
// src/VoiceAssistant.jsx
vapiRef.current.on('call-start', () => {
  // TODO: Track con Google Analytics / Mixpanel
  // analytics.track('call_started')
});
```

---

**Documentado:** 09 de Marzo 2026
**Autor:** Claude Code
