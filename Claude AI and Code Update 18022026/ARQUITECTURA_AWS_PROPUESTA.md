# Arquitectura AWS Propuesta — Pipeline de Video
## Documento actualizado: 18 Febrero 2026

---

## PROBLEMA CON LA ARQUITECTURA ACTUAL

La arquitectura actual funciona pero surgio de solucionar problemas uno a uno. Tiene 4 servicios para hacer una sola tarea y Railway actua como coordinador secuencial de dos procesos pesados dentro del mismo proceso — lo que no escala.

```
ARQUITECTURA ACTUAL (funcional pero con deuda tecnica):

Navegador (Vercel)
    │
    ▼
RAILWAY (Express server) ← servidor 24/7, pagando siempre
    │
    ├─ Step 1: Sube imagen a S3
    ├─ Step 2: Llama LTX-2 (~80s) → guarda en disco Railway → sube a S3
    └─ Step 3: Llama Lambda Remotion (~55s)
              ▼
         S3 (video final)
```

**Problema de los 15 minutos de Lambda resuelto:**
Con la arquitectura actual Railway coordina LTX-2 + Remotion en el mismo proceso (~2.5 min total).
Si se intentara hacer todo en UNA sola Lambda, habria que gestionar dos HTTP calls pesadas secuencialmente dentro de la misma ejecucion — fragil y dificil de mantener.

**La solucion: DOS Lambdas, cada una con una responsabilidad.**
- Lambda 1 (LTX-2): ~80s — muy por debajo del limite de 15 min
- Lambda 2 (Remotion): ~55s — ya existente y funcionando
- El "pegamento" lo hace el backend/frontend, no una Lambda haciendo dos cosas

---

## ARQUITECTURA PROPUESTA: TODO EN AWS

### Vision general

```
ARQUITECTURA OBJETIVO:

Navegador (Vercel)
    │
    │ POST /api/start-video-job
    ▼
BACKEND (Vercel API / Next / Node)
    │
    ├─ Crea job en Supabase (status: 'pending')
    │
    ├─ Llama a LAMBDA 1 (LTX-2 Orchestrator)
    │       │ Sube foto a S3
    │       │ Llama a LTX-2 Pro API (~80s)
    │       │ Sube video LTX-2 a S3
    │       └─ Devuelve { ltxVideoUrl }
    │
    ├─ Actualiza Supabase (status: 'ltx_done', ltx_video_url_s3)
    │
    ├─ Llama a LAMBDA 2 (Remotion Render)
    │       │ Recibe ltxVideoUrl + title + subtitle + music
    │       │ Renderiza video final con overlays (~55s)
    │       │ Guarda en S3 renders/{jobId}/out.mp4
    │       └─ Devuelve { finalVideoUrl }
    │
    └─ Actualiza Supabase (status: 'rendered', final_video_url_s3)
              │
              ▼
    Navegador muestra video final (auto-scroll)
```

### Componentes

| Componente | Tecnologia | Responsabilidad |
|-----------|-----------|----------------|
| **Frontend** | React + Vercel | UI upload, estado generacion, player |
| **Backend API** | Node/Express | Orquesta las dos Lambdas, actualiza Supabase |
| **Lambda 1** | AWS Lambda (Node) | LTX-2: foto → video cinematografico |
| **Lambda 2** | AWS Lambda (Remotion) | Remotion: video base → video final con overlays |
| **S3** | AWS S3 | Almacen unico de binarios (fotos + videos) |
| **Supabase** | PostgreSQL | Solo metadata y estado del job |

---

## LAMBDA 1 — ORQUESTADOR LTX-2

**Fichero:** `video/lambda-ltx2.cjs`

**Responsabilidad unica:** Encapsular todo lo relacionado con LTX-2. No sabe nada de Remotion ni de UI.

### Input
```json
{
  "jobId": "uuid",
  "userId": "uuid",
  "propertyId": "uuid",
  "imageUrl": "https://...s3.../images/foto.jpg",
  "prompt": "slow cinematic zoom, luxury villa ambiance",
  "options": {
    "duration": 6,
    "resolution": "1920x1080"
  }
}
```

### Output
```json
{
  "jobId": "uuid",
  "userId": "uuid",
  "propertyId": "uuid",
  "photoUrlS3": "https://...s3.../images/xxx.jpg",
  "ltxVideoUrl": "https://...s3.../ltx-videos/xxx.mp4",
  "meta": {
    "ltxJobId": "id-from-ltx",
    "duration": 6,
    "resolution": "1920x1080"
  }
}
```

### Tareas internas
1. Si `imageUrl` ya es S3 publica → usarla directamente
2. Llamar a LTX-2: `POST https://api.ltx.video/v1/image-to-video`
3. Esperar respuesta (~80s, responseType: arraybuffer)
4. Guardar video temporalmente en `/tmp/ltx-{jobId}.mp4` (disco Lambda)
5. Subir a S3: `ltx-videos/{jobId}.mp4`
6. Devolver JSON con `ltxVideoUrl`

### Handler
```javascript
exports.handler = async (event) => {
  // parse event
  // subir imagen a S3 si hace falta
  // llamar a LTX-2
  // subir video a S3
  // devolver JSON con ltxVideoUrl
};
```

---

## LAMBDA 2 — RENDER REMOTION

**Fichero:** `video/lambda-render.cjs` (refactorizar handler existente)

**Responsabilidad unica:** Tomar el video LTX-2 y producir el video final con overlays, textos, musica y branding.

### Input
```json
{
  "jobId": "uuid",
  "userId": "uuid",
  "propertyId": "uuid",
  "ltxVideoUrl": "https://...s3.../ltx-videos/xxx.mp4",
  "title": "NISMARA UMA VILLA",
  "subtitle": "Discover Your Balinese Sanctuary",
  "logoUrl": "https://...s3.../logos/nismara.png",
  "musicUrl": "https://...s3.../music/bali-sunrise.mp3",
  "theme": "default"
}
```

### Output
```json
{
  "jobId": "uuid",
  "userId": "uuid",
  "propertyId": "uuid",
  "finalVideoUrl": "https://...s3.../renders/jobId/out.mp4",
  "renderId": "remotion-render-id"
}
```

### Tareas internas
1. Preparar `inputProps` para composicion `LtxPromo.tsx`
2. Llamar a `renderMediaOnLambda()` con `ltxVideoUrl` + props
3. Esperar render (6 chunks paralelos, ~55s)
4. Devolver `finalVideoUrl`

---

## BACKEND API — ENDPOINTS

### POST /api/start-video-job
```
Input:  { userId, propertyId, imageUrl, prompt, options }

1. Crear registro Supabase: status = 'pending'
2. Llamar a callLtxLambda(event)
3. Recibir { ltxVideoUrl }
4. Actualizar Supabase: status = 'ltx_done', ltx_video_url_s3
5. Devolver { jobId, ltxVideoUrl }
```

### POST /api/render-final-video
```
Input:  { jobId, ltxVideoUrl, title, subtitle, logoUrl, musicUrl }

1. Llamar a callRemotionLambda(event)
2. Recibir { finalVideoUrl }
3. Actualizar Supabase: status = 'rendered', final_video_url_s3
4. Devolver { jobId, finalVideoUrl }
```

### Helpers
Crear `video/aws-lambdas.js` con:
- `callLtxLambda(event)` — en fase local llama al handler directamente. En AWS usara `Lambda().invoke('LtxLambda', event)`
- `callRemotionLambda(event)` — igual

---

## FRONTEND — ContentStudio.jsx

```
Al pulsar "Generar video":
  1. POST /api/start-video-job
     → Mostrar "Generando video base con LTX-2..." (~80s)
     → Guardar jobId y ltxVideoUrl

  2. POST /api/render-final-video (con ltxVideoUrl)
     → Mostrar "Renderizando video final..." (~55s)
     → Guardar finalVideoUrl

  3. Auto-scroll al player
     → Reproducir video desde finalVideoUrl
```

---

## ESQUEMA SUPABASE — tabla `videos`

```sql
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  property_id uuid not null,
  photo_url_s3 text not null,
  ltx_video_url_s3 text,
  final_video_url_s3 text,
  status text not null check (
    status in ('pending','ltx_done','rendered','failed')
  ) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## PLAN DE IMPLEMENTACION PARA CLAUDE CODE

**Orden de ejecucion:**

1. **Crear `video/lambda-ltx2.cjs`**
   - Extraer logica LTX-2 de `video/server.cjs`
   - Convertir a handler `exports.handler`
   - Input/output segun modelo anterior

2. **Refactorizar `video/lambda-render.cjs`**
   - Convertir a handler `exports.handler`
   - Input/output segun modelo anterior

3. **Crear `video/aws-lambdas.js`**
   - `callLtxLambda(event)` — llama al handler local (fase 1)
   - `callRemotionLambda(event)` — llama al handler local (fase 1)
   - Comentarios de como migrar a `AWS.Lambda().invoke()`

4. **Crear endpoints en backend**
   - `POST /api/start-video-job`
   - `POST /api/render-final-video`
   - Usando los helpers de `aws-lambdas.js`

5. **Actualizar `ContentStudio.jsx`**
   - Usar los dos nuevos endpoints
   - Manejar estados: pending → ltx_done → rendered

6. **Migracion Supabase**
   - Crear tabla `videos` con el schema anterior
   - Ajustar pantalla de historial de videos

7. **Documentar TODO para deploy AWS real**
   - Subir Lambda 1 a AWS
   - Configurar API Gateway
   - Actualizar `VITE_API_URL` en Vercel

---

## COMPARATIVA FINAL

| Aspecto | Actual (Railway) | Propuesta (AWS) |
|---------|-----------------|-----------------|
| Servicios | 4 | 2 |
| Coste Railway | ~$5-20/mes | $0 |
| Servidor 24/7 | Si (Railway) | No (Lambda pay-per-use) |
| Limite 15 min | No aplica | Lambda 1: ~80s / Lambda 2: ~55s ✅ |
| Puntos de fallo | 4 | 2 |
| Workarounds | REMOTION_AWS_ACCESS_KEY_ID | Ninguno |
| Escalabilidad | Limitada | Ilimitada |

---

## CUANDO IMPLEMENTAR

**NO antes del piloto con Gita (19 Feb 2026).**

Rama de trabajo: `feature/aws-only-architecture`
Railway se mantiene para n8n — solo se elimina del flujo de video.
Estimacion: 2-3 dias de desarrollo + 1 dia de pruebas.

---

*Documento creado: 18 Febrero 2026*
*Fuente: arquitectura propuesta y validada por Jose Carrallo*
