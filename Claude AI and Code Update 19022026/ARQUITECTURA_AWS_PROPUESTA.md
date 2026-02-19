# ARQUITECTURA AWS PROPUESTA — Migración Railway → AWS Lambda Function URLs

**Fecha:** 19 Febrero 2026
**Estado:** En implementación (código local listo, deploy AWS pendiente)

---

## DIAGRAMA DEL FLUJO FINAL

```
Vercel (React)
    │
    │ POST /api/start-video-job  (multipart: imagen)
    ▼
server.cjs / Lambda Orquestador
    │ 1. Sube imagen a S3  → images/xxx.jpg
    │ 2. Llama callLtxLambda()
    ▼
Lambda 1 – LTX-2  (video/lambda-ltx2.cjs)
    │ 3. Llama API LTX-2 (image → video base ~80s)
    │ 4. Sube vídeo a S3  → ltx-videos/ltx-{jobId}.mp4
    │ devuelve: { ltxVideoUrl }
    ▼
server.cjs
    │ devuelve: { jobId, ltxVideoUrl }
    │
    │ POST /api/render-final-video  (JSON: { jobId, ltxVideoUrl, title, ... })
    ▼
server.cjs / Lambda Orquestador
    │ Llama callRemotionLambda()
    ▼
Lambda 2 – Remotion Render  (video/lambda-render.cjs)
    │ 5. Llama renderMediaOnLambda() → Remotion Lambda divide en chunks
    │ 6. Espera completion polling (~55s)
    │ 7. Guarda metadata en Supabase (generated_videos)
    │ devuelve: { finalVideoUrl, renderId }
    ▼
server.cjs
    │ devuelve: { jobId, finalVideoUrl }
    ▼
Vercel (React) — muestra vídeo final
```

---

## ARCHIVOS CLAVE

| Archivo | Rol |
|---------|-----|
| `video/lambda-ltx2.cjs` | Handler Lambda 1 — LTX-2 (image → video base) |
| `video/lambda-render.cjs` | Handler Lambda 2 — Remotion render (video base → vídeo final) |
| `video/aws-lambdas.js` | Helpers `callLtxLambda` / `callRemotionLambda` (locales ahora, URLs en producción) |
| `video/server.cjs` | Express: endpoints `/api/start-video-job` + `/api/render-final-video` |
| `src/components/ContentStudio/ContentStudio.jsx` | Frontend: dos llamadas en secuencia |

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
  "musicFile": "background-music.mp3"
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
// Ahora: llama handlers locales
callLtxLambda(event)      → require('./lambda-ltx2').handler(event)
callRemotionLambda(event) → require('./lambda-render').handler(event)

// Después (cuando despleguemos en AWS):
callLtxLambda(event)      → fetch('https://xxx.lambda-url.us-east-1.on.aws/', { body: event })
callRemotionLambda(event) → fetch('https://yyy.lambda-url.us-east-1.on.aws/', { body: event })
```

---

## SUPABASE — TABLA `generated_videos` (sin cambios)

La tabla existente `generated_videos` se sigue usando. El registro se inserta al final del proceso (en `lambda-render.cjs`) cuando el vídeo final está listo.

```sql
-- Tabla existente (sin modificar)
generated_videos (
  id, user_id, title, subtitle, video_url, thumbnail_url,
  filename, file_size_mb, duration_seconds, resolution,
  camera_prompt, music_file, status, generation_time_seconds, created_at
)
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

1. **Empaquetar Lambda 1** (`lambda-ltx2.cjs` + dependencias) → ZIP
2. **Crear Lambda function** en AWS Console (Node.js 20, 512MB RAM, timeout 5min)
3. **Activar Function URL** con CORS para `https://myhost-bizmate.vercel.app`
4. **Empaquetar Lambda 2** (`lambda-render.cjs` + `@remotion/lambda/client`) → ZIP o Layer
5. **Crear Lambda function** en AWS Console (timeout 10min)
6. **Activar Function URL** con CORS
7. **Actualizar `aws-lambdas.js`**: reemplazar llamadas locales por `fetch` a las Function URLs
8. **Actualizar `VITE_API_URL`** en Vercel si aplica
9. **Apagar Railway**

---

## RECURSOS AWS EXISTENTES

| Recurso | Valor |
|---------|-------|
| S3 Bucket | `remotionlambda-useast1-1w04idkkha` |
| Remotion Lambda | `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` |
| Remotion Serve URL | `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html` |
| Region | `us-east-1` |
| Cuota Lambda | 1000 concurrentes (aprobada caso #177130113800974) |

---

*Documentación generada con Claude Code — 19 Feb 2026*
