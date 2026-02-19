# ARQUITECTURA AWS PROPUESTA — Migración Railway → AWS Lambda Function URLs

**Fecha:** 19 Febrero 2026
**Estado:** En implementación (código local listo, deploy AWS pendiente)

---

## DIAGRAMA DEL FLUJO FINAL

```
Vercel (React)
    │
    │ POST /api/start-video-job  (multipart: imagen + userId + prompt)
    ▼
server.cjs (Railway / futuro: Vercel API)
    │ 1. Sube imagen a S3  → images/job-{ts}.jpeg
    │ 2. INSERT Supabase videos (status: 'pending')
    │ 3. Llama callLtxLambda()
    ▼
Lambda 1 – LTX-2  (video/lambda-ltx2.cjs)
    │ 4. Llama API LTX-2 (image → video base ~80s)
    │ 5. Sube vídeo a S3  → ltx-videos/ltx-{jobId}.mp4
    │ devuelve: { jobId, userId, imageUrlS3, ltxVideoUrl }
    ▼
server.cjs
    │ 6. UPDATE Supabase videos (status: 'ltx_done', ltx_video_url_s3)
    │ devuelve: { jobId, ltxVideoUrl, imageUrl }
    │
    │ POST /api/render-final-video  (JSON: { jobId, ltxVideoUrl, title, ... })
    ▼
server.cjs
    │ 7. Llama callRemotionLambda()
    ▼
Lambda 2 – Remotion Render  (video/lambda-render.cjs)
    │ 8. Llama renderMediaOnLambda() → Remotion Lambda divide en chunks
    │ 9. Espera completion polling (~55s)
    │ devuelve: { jobId, userId, finalVideoUrl, renderId, renderTime }
    ▼
server.cjs
    │ 10. UPDATE Supabase videos (status: 'rendered', final_video_url_s3)
    │ devuelve: { jobId, finalVideoUrl }
    ▼
Vercel (React) — auto-scroll al player, muestra vídeo final
```

---

## ARCHIVOS CLAVE

| Archivo | Rol |
|---------|-----|
| `video/lambda-ltx2.cjs` | Handler Lambda 1 — LTX-2 (image → video base) |
| `video/lambda-render.cjs` | Handler Lambda 2 — Remotion render (video base → vídeo final) |
| `video/aws-lambdas.js` | Helpers `callLtxLambda` / `callRemotionLambda` (locales ahora, Function URLs en producción) |
| `video/server.cjs` | Express: endpoints `/api/start-video-job` + `/api/render-final-video` + updates Supabase |
| `src/components/ContentStudio/ContentStudio.jsx` | Frontend: dos llamadas en secuencia, maneja estados |

---

## INPUTS / OUTPUTS DE LAS LAMBDAS

### Lambda 1 — `lambda-ltx2.cjs`

**Input (event):**
```json
{
  "jobId": "string",
  "userId": "string",
  "imageUrl": "https://s3.amazonaws.com/...jpg",
  "prompt": "slow cinematic zoom, luxury villa"
}
```

**Output:**
```json
{
  "jobId": "string",
  "userId": "string",
  "imageUrlS3": "https://s3.amazonaws.com/...jpg",
  "ltxVideoUrl": "https://s3.amazonaws.com/ltx-videos/ltx-{jobId}.mp4"
}
```

### Lambda 2 — `lambda-render.cjs`

**Input (event):**
```json
{
  "jobId": "string",
  "userId": "string",
  "ltxVideoUrl": "https://s3.amazonaws.com/ltx-videos/ltx-{jobId}.mp4",
  "imageUrl": "https://s3.amazonaws.com/...jpg",
  "title": "NISMARA UMA VILLA",
  "subtitle": "Discover Your Balinese Sanctuary",
  "musicFile": "bali-sunrise.mp3"
}
```

**Output:**
```json
{
  "jobId": "string",
  "userId": "string",
  "finalVideoUrl": "https://s3.amazonaws.com/renders/{renderId}/out.mp4",
  "renderId": "string",
  "renderTime": 55.2
}
```

---

## HELPER `video/aws-lambdas.js`

```js
// FASE LOCAL (ahora): llama handlers directamente en proceso
callLtxLambda(event)      → require('./lambda-ltx2.cjs').handler(event)
callRemotionLambda(event) → require('./lambda-render.cjs').handler(event)

// FASE AWS (próxima sesión — despliegue real):
callLtxLambda(event)      → fetch(LTX_LAMBDA_URL,     { method:'POST', body: JSON.stringify(event) })
callRemotionLambda(event) → fetch(REMOTION_LAMBDA_URL, { method:'POST', body: JSON.stringify(event) })
```

Solo hay que cambiar estas dos funciones cuando se desplieguen las Function URLs. El resto del código no cambia.

---

## ENDPOINTS `video/server.cjs`

### POST /api/start-video-job

```
Input (multipart/form-data): { image (file), userId, prompt, jobId? }

1. Subir imagen a S3: images/job-{ts}.jpeg
2. INSERT Supabase videos: { id=jobId, user_id, photo_url_s3, status='pending' }
3. callLtxLambda({ jobId, userId, imageUrl, prompt })
4. UPDATE Supabase videos: { status='ltx_done', ltx_video_url_s3 }
5. Devolver: { success: true, jobId, ltxVideoUrl, imageUrl }
```

### POST /api/render-final-video

```
Input (JSON): { jobId, ltxVideoUrl, imageUrl, title, subtitle, musicFile, userId }

1. callRemotionLambda({ jobId, userId, ltxVideoUrl, imageUrl, title, subtitle, musicFile })
2. UPDATE Supabase videos: { status='rendered', final_video_url_s3 }
3. Devolver: { success: true, jobId, finalVideoUrl, renderId, renderTime }
```

---

## SUPABASE — TABLA `videos` (NUEVA)

```sql
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  property_id uuid,
  photo_url_s3 text not null,
  ltx_video_url_s3 text,
  final_video_url_s3 text,
  status text not null check (
    status in ('pending','ltx_done','rendered','failed')
  ) default 'pending',
  title text,
  subtitle text,
  music_file text,
  render_id text,
  render_time_seconds numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices
create index if not exists videos_user_id_idx on videos(user_id);
create index if not exists videos_status_idx on videos(status);
```

**Flujo de estados:**
- `pending` → job creado, imagen en S3, llamando a Lambda 1
- `ltx_done` → LTX-2 completado, video base en S3, llamando a Lambda 2
- `rendered` → video final completo, listo para mostrar
- `failed` → error en cualquier paso

---

## FRONTEND — ContentStudio.jsx

```
Al pulsar "Generar video":

  Step 1 — POST /api/start-video-job (multipart: imagen + prompt + userId)
     → Mostrar "Generando video base con IA (~80s)..."
     → Recibir { jobId, ltxVideoUrl, imageUrl }

  Step 2 — POST /api/render-final-video (JSON: jobId + ltxVideoUrl + title + ...)
     → Mostrar "Renderizando video final (~55s)..."
     → Recibir { jobId, finalVideoUrl }

  Step 3 — Mostrar resultado
     → Auto-scroll al player
     → Reproducir video desde finalVideoUrl
```

---

## HELPER `video/aws-lambdas.js` — Código actual

```js
const ltxHandler      = require('./lambda-ltx2.cjs');
const remotionHandler = require('./lambda-render.cjs');

async function callLtxLambda(event) {
  // FASE LOCAL: handler en proceso
  return await ltxHandler.handler(event);
  // FASE AWS: fetch(process.env.LTX_LAMBDA_URL, { method:'POST', body: JSON.stringify(event) })
}

async function callRemotionLambda(event) {
  // FASE LOCAL: handler en proceso
  return await remotionHandler.handler(event);
  // FASE AWS: fetch(process.env.REMOTION_LAMBDA_URL, { method:'POST', body: JSON.stringify(event) })
}

module.exports = { callLtxLambda, callRemotionLambda };
```

---

## POR QUÉ NO USAMOS API GATEWAY

**API Gateway timeout máximo: 29 segundos.**

Nuestro pipeline tarda:
- LTX-2: ~80 segundos
- Remotion render: ~55 segundos
- **Total: ~135 segundos**

API Gateway mataría la conexión antes de terminar.

**Solución: Lambda Function URLs**
- Endpoint HTTPS directo a Lambda
- Timeout hasta 15 minutos (suficiente)
- CORS configurado en la propia Function URL
- Sin API Gateway, sin intermediario

---

## PLAN DE DEPLOY AWS (PRÓXIMA SESIÓN)

1. **Crear tabla `videos`** en Supabase (SQL arriba)
2. **Empaquetar Lambda 1** (`lambda-ltx2.cjs` + dependencias: `axios`, `@aws-sdk/client-s3`) → ZIP
3. **Crear Lambda function** en AWS Console (Node.js 20, 512MB RAM, timeout 5min)
4. **Activar Function URL** con CORS para `https://myhost-bizmate.vercel.app`
5. **Empaquetar Lambda 2** (`lambda-render.cjs` + `@remotion/lambda/client`, `@supabase/supabase-js`) → ZIP o Layer
6. **Crear Lambda function** en AWS Console (timeout 10min)
7. **Activar Function URL** con CORS
8. **Actualizar `aws-lambdas.js`**: descomentar `fetch()` + comentar handlers locales
9. **Apagar Railway** (solo para video — mantener para n8n)

---

## RECURSOS AWS EXISTENTES

| Recurso | Valor |
|---------|-------|
| S3 Bucket | `remotionlambda-useast1-1w04idkkha` |
| Remotion Lambda | `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` |
| Remotion Serve URL | `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html` |
| Region | `us-east-1` |
| Cuota Lambda | 1000 concurrentes (aprobada caso #177130113800974) |
| IAM Role | `remotion-lambda-role` |

---

## RAMA DE TRABAJO

- **Rama activa:** `feature/aws-only-architecture`
- **Rama principal (no tocar):** `main` — arquitectura Railway funcionando (piloto Gita)
- Railway se mantiene operativo hasta que el deploy AWS esté validado

---

*Documento actualizado: 19 Feb 2026*
*Fuente: plan validado por Jose Carrallo (18-19 Feb 2026)*
