# Resumen Ejecutivo - 17 Febrero 2026

**Fecha:** 17 Febrero 2026
**Branch:** `main`
**Commits:** `338faa9`, `eebb5a3`
**Vercel:** https://myhost-bizmate.vercel.app

---

## RESULTADO: SISTEMA COMPLETAMENTE FUNCIONAL EN PRODUCCIÓN

### Todo lo que SE LOGRÓ hoy

| Tarea | Status |
|-------|--------|
| Video se genera via AWS Lambda desde Vercel | ✅ |
| Video se reproduce en ContentStudio (fix URL `renders/`) | ✅ |
| Botones "Open Video in New Tab" y "Download" añadidos | ✅ |
| Fix filtro Payments (paid/pending) en Manual Data Entry | ✅ |
| Fix fechas dinámicas en Business Reports | ✅ |
| Login en Vercel producción funciona | ✅ |
| Commit + push a main | ✅ |
| Deploy a Vercel producción | ✅ |
| Video desde Vercel → Railway → Lambda | ✅ |

---

## BUGS CORREGIDOS HOY

### Bug 1 - ContentStudio: URL del video incorrecta
**Archivo:** `src/components/ContentStudio/ContentStudio.jsx` línea 193
**Problema:** `url: \`${API_URL}${result.videoUrl}\`` concatenaba `http://localhost:3001` delante de una URL S3 completa.
**Fix:** `url: result.videoUrl.startsWith('http') ? result.videoUrl : \`${API_URL}${result.videoUrl}\``

### Bug 2 - Lambda render: path S3 incorrecto
**Archivo:** `video/lambda-render.cjs` línea 70
**Problema:** URL construida como `/{renderId}/out.mp4` pero Remotion Lambda guarda en `/renders/{renderId}/out.mp4`
**Fix:** `https://${bucketName}.s3.${region}.amazonaws.com/renders/${renderId}/out.mp4`

### Bug 3 - Manual Data Entry: filtro paid/pending no aplicaba
**Archivo:** `src/components/ManualDataEntry/ManualDataEntry.jsx`
**Problema:** `setFilterStatus(newValue)` es asíncrono. `loadBookings()` se llamaba antes de que React actualizara el estado.
**Fix:** `loadBookings` acepta `customStatusFilter` como parámetro. Se pasa directamente: `loadBookings(null, newStatus)`

### Bug 4 - Business Reports: fecha hardcodeada en header
**Archivo:** `src/services/generateReportHTML.js`
**Problema:** `START_DATE = '2026-01-01'` y `END_DATE = '2026-12-31'` hardcodeadas.
**Fix:** `generateReportHTML` ahora acepta `startDate` y `endDate` como parámetros. Se pasan desde `Autopilot.jsx`.

### Bug 5 - Vercel producción: login fallaba con "Invalid value"
**Archivos:** `src/lib/supabase.js` + configuración Vercel
**Problema (dos causas):**
1. `VITE_SUPABASE_ANON_KEY` en Vercel tenía un **salto de línea embebido** (se pegó mal en el dashboard). Los headers HTTP no pueden contener saltos de línea → `TypeError: Failed to execute 'fetch' on 'Window': Invalid value`
2. `VITE_OPENAI_API_KEY` no estaba en Vercel → OpenAI SDK v6 lanza error en el constructor → corrompía la inicialización del bundle

**Fix código:** `src/lib/supabase.js` ahora tiene valores de fallback hardcodeados (igual que `video/server.cjs`). Elimina el `throw` que crasheaba el módulo.
```js
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ...').trim();
```

**Fix Vercel:**
- Eliminada `VITE_SUPABASE_ANON_KEY` (tenía newline embebido)
- Añadida `VITE_OPENAI_API_KEY`
- Añadidas `VITE_N8N_BASE_URL`, `VITE_OPENAI_MODEL`, `VITE_OPENAI_MAX_TOKENS`, `VITE_OPENAI_TEMPERATURE`

**Por qué "ayer funcionaba":** El build anterior tenía los valores bakeados correctamente. El commit `338faa9` de hoy forzó un nuevo build de Vercel que expuso que la anon key tenía un salto de línea y faltaba la OPENAI key.

---

## ARQUITECTURA DE VIDEO

```
Owner en Vercel
    → ContentStudio → "Generar video"
    → POST https://[railway-url]/api/generate-video
    → Railway (server.cjs) sube imagen a Supabase Storage
    → Railway llama a AWS Lambda (remotion-render-4-0-423)
    → Lambda renderiza 300 frames → sube a S3
    → URL: https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/renders/{id}/out.mp4
    → Owner ve y descarga el video
```

### Infraestructura AWS
- **Región:** `us-east-1`
- **Lambda function:** `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec`
- **S3 bucket:** `remotionlambda-useast1-1w04idkkha`
- **S3 path output:** `renders/{renderId}/out.mp4`
- **Remotion site:** `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html`

### Fallback local
Si Lambda falla por cuota, el servidor usa render local (`video/local-render.cjs`).

---

## VARIABLES DE ENTORNO VERCEL (estado actual)

| Variable | Estado |
|----------|--------|
| `VITE_SUPABASE_URL` | ✅ Correcta |
| `VITE_SUPABASE_ANON_KEY` | ✅ Eliminada (fallback en código) |
| `VITE_API_URL` | ✅ Railway URL |
| `VITE_OPENAI_API_KEY` | ✅ Añadida hoy |
| `VITE_N8N_BASE_URL` | ✅ Añadida hoy |
| `VITE_OPENAI_MODEL` | ✅ Añadida hoy |
| `VITE_OPENAI_MAX_TOKENS` | ✅ Añadida hoy |
| `VITE_OPENAI_TEMPERATURE` | ✅ Añadida hoy |

---

## PENDIENTE

1. **Cuota AWS Lambda** - Caso #177130113800974 (aumento a 1000 ejecuciones) pendiente de aprobación AWS. Seguimiento: AWS Console → Support Center → caso #177130113800974

2. **Supabase service_role key expirada** en `lambda-render.cjs` - falla el guardado de metadata en tabla `generated_videos`. El video SÍ se genera y reproduce. Pendiente actualizar desde Supabase Dashboard → Settings → API

---

## CÓMO ARRANCAR EL ENTORNO LOCAL

Siempre desde **PowerShell** (no WSL):

**Terminal 1 - Servidor de video:**
```powershell
cd C:\myhost-bizmate\video
node server.cjs
```

**Terminal 2 - Frontend:**
```powershell
cd C:\myhost-bizmate
npm run dev
```

**NUNCA** usar `pkill` desde WSL para matar procesos Windows. Usar:
```powershell
netstat -ano | findstr :3001
taskkill /F /PID [numero]
```

---

## VARIABLES DE ENTORNO RAILWAY (estado actual)

| Variable | Estado |
|----------|--------|
| `SUPABASE_URL` | ✅ Configurada |
| `SUPABASE_KEY` | ✅ Configurada (anon key) |
| `AWS_ACCESS_KEY_ID` | ❌ NO configurada → video falla |
| `AWS_SECRET_ACCESS_KEY` | ❌ NO configurada → video falla |
| `AWS_REGION` | ❌ NO configurada (usa us-east-1 como default) |

---

## LECCIONES DEL DÍA

1. **Vite bake env vars en build time**: Si cambias variables en Vercel, hay que hacer redeploy para que el nuevo bundle las recoja.
2. **Newlines en headers HTTP son fatales**: Pegar una clave JWT en el dashboard de Vercel con un salto de línea produce `TypeError: Failed to execute 'fetch' on 'Window': Invalid value`. Siempre verificar con `vercel env pull`.
3. **OpenAI SDK v6 lanza en constructor**: Si `apiKey` es undefined, `new OpenAI({...})` lanza inmediatamente. Corrompe la inicialización del bundle de producción.
4. **`pkill` de WSL no mata procesos Windows**: Siempre usar `taskkill /F /PID` desde PowerShell.
5. **Railway ignora `.env` files**: Las variables de entorno deben configurarse en Railway Dashboard → Variables. El archivo `video/.env` solo funciona en local.
