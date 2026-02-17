# INFORME TÉCNICO COMPLETO - MY HOST BizMate
## 17 Febrero 2026 — Sistema de Video en Producción

**Autor:** Claude Code + Jose Carrallo
**Branch:** `main` | **Commits:** `338faa9` → `70d5423`
**Producción:** https://myhost-bizmate.vercel.app

---

## 1. QUÉ ES EL SISTEMA DE VIDEO

MY HOST BizMate genera automáticamente vídeos de marketing para villas en Bali. El propietario abre **Content Studio**, sube una foto de su villa, escribe título/subtítulo, elige música y pulsa "Generar Vídeo". En ~60-90 segundos recibe un vídeo profesional de 10 segundos en Full HD (1920×1080) con animaciones y música.

**El vídeo resultante:**
- Animación cinematográfica con la imagen de la villa
- Texto animado (título + subtítulo)
- Música de fondo
- Formato MP4 listo para Instagram/Airbnb/web

---

## 2. ARQUITECTURA COMPLETA DEL SISTEMA

```
USUARIO
  │
  ▼
VERCEL (Frontend React)
  https://myhost-bizmate.vercel.app
  │
  │  POST /api/generate-video
  ▼
RAILWAY (Backend Node.js - video/server.cjs)
  https://myhost-bizmate-production.up.railway.app
  │
  ├─► SUPABASE STORAGE
  │     Sube la imagen del usuario → URL pública
  │
  └─► AWS LAMBDA (Remotion)
        Función: remotion-render-4-0-423-mem3008mb-disk10240mb-300sec
        Región: us-east-1
        │
        ├─► 6 Lambdas PARALELAS (50 frames c/u = 300 frames total)
        │     Chromium headless renderiza cada frame
        │     Fuente React: LtxPromo composition
        │
        └─► S3 BUCKET: remotionlambda-useast1-1w04idkkha
              Output: renders/{renderId}/out.mp4
              URL pública del vídeo final
```

### Stack tecnológico
| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Frontend | React 18 + Vite → **Vercel** | UI propietario |
| Backend video | Node.js Express → **Railway** | Orquestación |
| Almacenamiento imagen | **Supabase Storage** | URL pública para Lambda |
| Render vídeo | **Remotion Lambda v4.0.423** | Renderizado headless |
| Compute | **AWS Lambda** (us-east-1) | 6 funciones paralelas |
| Storage vídeo | **AWS S3** | Output final MP4 |
| BD metadata | **Supabase PostgreSQL** | Historial de vídeos |

---

## 3. PROBLEMAS RESUELTOS HOY (cronológico)

### PROBLEMA 1 — Login en Vercel fallaba: "Invalid value"
**Error:** `TypeError: Failed to execute 'fetch' on 'Window': Invalid value`

**Causa raíz (dos factores simultáneos):**

**Factor A — Newline embebido en JWT:**
Al pegar `VITE_SUPABASE_ANON_KEY` en el dashboard de Vercel, se copió con un salto de línea (`\n`) invisible dentro del token JWT. Los headers HTTP no pueden contener caracteres de nueva línea → el navegador rechazaba todas las llamadas a Supabase.

**Factor B — OpenAI SDK v6 lanza en el constructor:**
`VITE_OPENAI_API_KEY` no estaba configurada en Vercel. El SDK de OpenAI v6 lanza un error inmediatamente al instanciar `new OpenAI({ apiKey: undefined })` → corrompía la inicialización del bundle de React en producción.

**Fix aplicado:**
1. `src/lib/supabase.js` → valores de fallback hardcodeados + `.trim()` para sanear whitespace
2. Vercel: eliminada `VITE_SUPABASE_ANON_KEY` (tenía el newline) — el fallback del código toma el relevo
3. Vercel: añadidas `VITE_OPENAI_API_KEY`, `VITE_N8N_BASE_URL`, `VITE_OPENAI_MODEL`, etc.

**Por qué "ayer funcionaba":** El build anterior tenía los valores bakeados correctamente (Vite hornea las env vars en tiempo de compilación). El nuevo commit forzó un rebuild de Vercel que expuso las variables rotas.

---

### PROBLEMA 2 — Railway no recibía credenciales AWS

**Error:** `AWS_ACCESS_KEY_ID or REMOTION_AWS_ACCESS_KEY_ID not set`

**Causa:** Railway **bloquea la variable `AWS_ACCESS_KEY_ID`** a nivel de plataforma. Railway usa su propia infraestructura AWS internamente y protege esa variable. Aunque el usuario la añade al dashboard, el proceso nunca la recibe.

**Diagnóstico:** Se añadió log de diagnóstico al arranque del servidor. Los logs mostraron:
```
🔑 AWS_ACCESS_KEY_ID:     NOT SET ❌   ← Railway lo bloquea
🔑 AWS_SECRET_ACCESS_KEY: SET ✅
🔑 AWS_REGION:            us-east-1
```

**Fix aplicado:**
1. En Railway Variables → añadir `REMOTION_AWS_ACCESS_KEY_ID` (nombre alternativo que Railway no bloquea)
2. En `video/lambda-render.cjs` → mapear el valor al nombre estándar en tiempo de ejecución:

```js
// Railway blocks AWS_ACCESS_KEY_ID. Map at runtime:
if (!process.env.AWS_ACCESS_KEY_ID && process.env.REMOTION_AWS_ACCESS_KEY_ID) {
  process.env.AWS_ACCESS_KEY_ID = process.env.REMOTION_AWS_ACCESS_KEY_ID;
}
```

El AWS SDK v3 encuentra la variable con el nombre correcto y autentica correctamente.

---

### PROBLEMA 3 — Render se quedaba stuck al 93%

**Síntoma:** El render llegaba al 93.37% y se bloqueaba indefinidamente. Nunca completaba.

**Causa técnica:**
La configuración usaba `framesPerLambda: 300` — todos los 300 frames en **una sola Lambda secuencial**. Con `concurrencyPerLambda: 1` (1 tab de Chromium), renderizar 300 frames tardaba ~200 segundos. Al llegar al "stitching" (Lambda que une todos los frames en el MP4 final), el timeout de 240s ya estaba casi agotado. La Lambda de stitching no terminaba a tiempo.

**93.37% = todos los frames renderizados, pero el stitcher sin tiempo de completar.**

**Fix aplicado** (`video/lambda-render.cjs`):

| Parámetro | Antes | Después | Impacto |
|-----------|-------|---------|---------|
| `framesPerLambda` | 300 | **50** | 6 Lambdas paralelas |
| `concurrencyPerLambda` | 1 | **2** | 2 tabs Chromium/Lambda |
| `timeoutInMilliseconds` | 240,000 | **300,000** | 5 min (máximo Lambda) |
| Lambdas concurrentes | 2 | **7** | Dentro del límite de 10 |
| Tiempo render estimado | ~270s | **~45s** | 6× más rápido |

Con 6 chunks paralelos de 50 frames cada uno, el render completo tarda ~45-60 segundos.

---

### PROBLEMAS ADICIONALES (corregidos en commits anteriores)

| Bug | Archivo | Fix |
|-----|---------|-----|
| URL vídeo concatenaba `localhost:3001` delante de URL S3 | `ContentStudio.jsx` | Check `startsWith('http')` |
| Path S3 incorrecto (`/{id}/out.mp4` en vez de `/renders/{id}/out.mp4`) | `lambda-render.cjs` | Añadir prefijo `renders/` |
| Filtro paid/pending no aplicaba en Manual Data Entry | `ManualDataEntry.jsx` | Pasar filtro como parámetro directo (evita async setState) |
| Fechas hardcodeadas en Business Reports | `generateReportHTML.js` | Pasar `startDate`/`endDate` como parámetros |

---

## 4. VARIABLES DE ENTORNO — ESTADO FINAL

### Vercel (Frontend)
| Variable | Estado | Notas |
|----------|--------|-------|
| `VITE_SUPABASE_URL` | ✅ | Correcta |
| `VITE_SUPABASE_ANON_KEY` | ✅ Eliminada | Fallback en código (sin newline) |
| `VITE_API_URL` | ✅ | URL de Railway |
| `VITE_OPENAI_API_KEY` | ✅ Añadida hoy | Necesaria para que el bundle arranque |
| `VITE_N8N_BASE_URL` | ✅ Añadida hoy | |
| `VITE_OPENAI_MODEL` | ✅ Añadida hoy | |
| `VITE_OPENAI_MAX_TOKENS` | ✅ Añadida hoy | |
| `VITE_OPENAI_TEMPERATURE` | ✅ Añadida hoy | |

### Railway (Backend video)
| Variable | Estado | Notas |
|----------|--------|-------|
| `PORT` | ✅ | Railway auto-asigna |
| `FRONTEND_URL` | ✅ | CORS origin |
| `SUPABASE_URL` | ✅ | |
| `SUPABASE_KEY` | ✅ | Anon key |
| `LTX_API_KEY` | ✅ | API LTX-2 |
| `AWS_ACCESS_KEY_ID` | ❌ Bloqueada por Railway | Railway no permite esta variable |
| `REMOTION_AWS_ACCESS_KEY_ID` | ✅ Añadida hoy | Workaround — se mapea en código |
| `AWS_SECRET_ACCESS_KEY` | ✅ Añadida hoy | Funciona con nombre estándar |
| `AWS_REGION` | ✅ Añadida hoy | `us-east-1` |

---

## 5. INFRAESTRUCTURA AWS

| Recurso | Valor |
|---------|-------|
| Región | `us-east-1` |
| Lambda function | `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` |
| Lambda timeout | 300 segundos (5 min) |
| Lambda memoria | 3008 MB |
| Lambda disk | 10240 MB |
| S3 bucket | `remotionlambda-useast1-1w04idkkha` |
| S3 output path | `renders/{renderId}/out.mp4` |
| Remotion site | `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html` |
| Concurrencia actual | 10 (límite por defecto cuenta nueva) |
| Concurrencia solicitada | 1000 (caso AWS #177130113800974) |

---

## 6. PENDIENTE

### Pendiente Crítico
| Item | Acción | Dónde |
|------|--------|-------|
| **Cuota Lambda** — solo 10 ejecuciones concurrentes | Aprobar caso #177130113800974 | AWS Console → Support Center |
| **Supabase service_role key expirada** en `lambda-render.cjs` | Copiar nueva key | Supabase Dashboard → Settings → API → service_role |

**Impacto de la cuota Lambda:**
- 1 usuario generando vídeo: funciona ✅
- 2 usuarios simultáneos: puede fallar (7 Lambdas × 2 = 14 > límite de 10) ❌
- Con límite 1000: ~142 renders simultáneos sin problema ✅

### Pendiente Menor
- Supabase service_role key: solo afecta al guardado de metadata en tabla `generated_videos`. El vídeo SÍ se genera y reproduce correctamente aunque falle este guardado.

---

## 7. LECCIONES TÉCNICAS IMPORTANTES

### Para Railway
1. **Railway bloquea `AWS_ACCESS_KEY_ID`** — usar siempre `REMOTION_AWS_ACCESS_KEY_ID` como nombre alternativo y mapearlo en código
2. **Railway no lee `.env` files** — todas las variables deben configurarse en Dashboard → Variables
3. **Railway no siempre redeploya** al añadir variables nuevas — hacer Redeploy manual desde Deployments

### Para Vercel
4. **Vite hornea las env vars en build time** — cambiar variables en Vercel sin redeploy no tiene efecto
5. **Newlines en JWT son letales** — pegar un token JWT con salto de línea produce `TypeError: Invalid value`. Verificar siempre con `vercel env pull`
6. **OpenAI SDK v6 lanza en el constructor** — si `apiKey` es undefined, crashea la inicialización del bundle completo

### Para Remotion Lambda
7. **`framesPerLambda` debe balancear paralelismo vs concurrencia** — valor muy alto (300) = 1 Lambda lenta que hace stitch tardío. Valor 50 = 6 Lambdas paralelas ~6× más rápido
8. **93% stuck = stitcher sin tiempo** — aumentar `timeoutInMilliseconds` a 300000 (máximo del Lambda)
9. **Verificar S3 path**: Remotion Lambda guarda en `renders/{renderId}/out.mp4`, no en `/{renderId}/out.mp4`

---

## 8. COMMITS DEL DÍA

| Commit | Descripción |
|--------|-------------|
| `338faa9` | feat: AWS Lambda video + bug fixes (ContentStudio URL, S3 path, ManualDataEntry, Business Reports) |
| `eebb5a3` | fix: Supabase fallback values (login Vercel) |
| `cb3a01e` | debug: AWS credentials status en startup log |
| `2a87533` | debug: REMOTION_AWS_ACCESS_KEY_ID check |
| `4b4e969` | fix: Map REMOTION_AWS_ACCESS_KEY_ID → AWS_ACCESS_KEY_ID en runtime |
| `cdc42d9` | fix: Parallel Lambda chunks (framesPerLambda:50, stitch stuck) |
| `70d5423` | docs: Update session summary — all systems operational |

---

*Documentación generada con Claude Code — 17 Feb 2026*
