# LTX-2 — Plan de Restauración Post-Piloto
## Descubierto 18 Febrero 2026

---

## EL PROBLEMA

El commit `338faa9` (17 Feb 2026) eliminó sin autorización la llamada a la API LTX-2.

**Flujo ORIGINAL (correcto):**
```
Imagen → Supabase Storage → LTX-2 Pro API → video con movimiento de cámara → Remotion Lambda (overlays) → MP4 final
```

**Flujo ACTUAL (roto):**
```
Imagen → Supabase Storage → Remotion Lambda (imagen estática) → MP4 final
```

Lo que falta: el movimiento cinematográfico de cámara (slow zoom, paneo suave) que generaba LTX-2 Pro.

---

## ESTADO DE LOS ARCHIVOS

### Archivos LTX-2 — INTACTOS, no modificados
| Archivo | Estado | Descripción |
|---------|--------|-------------|
| `video/scripts/pipeline-image.ts` | ✅ Intacto | Llama a `api.ltx.video/v1/image-to-video` con modelo `ltx-2-pro` |
| `video/scripts/image-to-video-cli.mjs` | ✅ Intacto | CLI wrapper que ejecuta pipeline-image.ts |

### Archivos que hay que modificar para restaurar
| Archivo | Qué cambiar |
|---------|-------------|
| `video/server.cjs` | Reinsertar llamada LTX-2 como Step 2 (entre upload Supabase y Lambda) |
| `video/src/LtxPromo.tsx` | Añadir prop `videoUrl` para usar video LTX-2 como base layer |
| `video/lambda-render.cjs` | Aceptar y pasar `videoUrl` a Remotion composition |

### Variable Railway
| Variable | Estado |
|----------|--------|
| `LTX_API_KEY` | ✅ Configurada en Railway |

---

## FLUJO COMPLETO A RESTAURAR

```
1. Frontend (ContentStudio) → POST /api/generate-video (imagen + title + subtitle + cameraMovement + music)

2. server.cjs Step 1: Subir imagen a Supabase Storage → publicUrl

3. server.cjs Step 2 (RESTAURAR): Llamar LTX-2 Pro API
   exec(`node image-to-video-cli.mjs "${publicUrl}" "${cameraMovement}"`)
   → LTX-2 descarga video en: video/public/ltx-video.mp4

4. server.cjs Step 3: Subir ltx-video.mp4 a Supabase Storage → videoUrl pública

5. server.cjs Step 4: Llamar Lambda con videoUrl (no imageUrl)
   renderVideoOnLambda({ title, subtitle, videoUrl, musicFile, userId })

6. lambda-render.cjs: Pasa videoUrl a Remotion composition

7. LtxPromo.tsx: Usa <OffthreadVideo src={videoUrl}> como base layer (movimiento real)
   → en vez de <Img src={imageUrl}> (estático)

8. Lambda renderiza → S3 → URL final del MP4
```

---

## CÓDIGO DE server.cjs — LO QUE HABÍA ANTES (commit previo a 338faa9)

```javascript
// Step 2: Generate video with LTX-2
console.log('🚀 Step 2: Generating cinematic video with LTX-2...');

await new Promise((resolve, reject) => {
  exec(
    `cd "${path.join(__dirname, 'scripts')}" && node image-to-video-cli.mjs "${publicUrl}" "${cameraMovement}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error('❌ LTX-2 Error:', error);
        return reject(error);
      }
      console.log(stdout);
      console.log('✅ LTX-2 video generated');
      resolve();
    }
  );
});
```

---

## CÓDIGO DE LtxPromo.tsx — LO QUE HABÍA ANTES (base layer era video, no imagen)

```typescript
// Props antes (sin imageUrl)
interface LtxPromoProps {
  title?: string;
  subtitle?: string;
  musicFile?: string;
}

// Base layer era el video LTX-2 guardado localmente
<Video
  src={staticFile('ltx-video.mp4')}
  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: overallOpacity }}
/>
```

---

## PASOS DE IMPLEMENTACIÓN (post-piloto)

### Paso 1 — Modificar `server.cjs`
1. Reinsertar llamada a `image-to-video-cli.mjs` como Step 2
2. Añadir Step 3: subir el video LTX-2 generado (`video/public/ltx-video.mp4`) a Supabase Storage
3. Pasar `videoUrl` (en vez de `imageUrl`) a `renderVideoOnLambda`

### Paso 2 — Modificar `lambda-render.cjs`
1. Aceptar parámetro `videoUrl` además de `imageUrl`
2. Pasar `videoUrl` a la Remotion composition como prop

### Paso 3 — Modificar `video/src/LtxPromo.tsx`
1. Añadir prop `videoUrl?: string`
2. Cuando `videoUrl` esté presente: usar `<OffthreadVideo src={videoUrl}>` como base layer
3. Cuando no esté (fallback): usar `<Img src={imageUrl}>` (comportamiento actual)

### Paso 4 — Rebuild y deploy de la Remotion site a S3
```powershell
cd C:\myhost-bizmate\video
npx remotion lambda sites create --site-name=myhost-bizmate-video
```
(necesario porque LtxPromo.tsx cambia)

### Paso 5 — Testear en local antes de commit
1. Arrancar `node server.cjs` en local
2. Generar video de prueba desde ContentStudio en localhost:5173
3. Verificar que el video tiene movimiento de cámara LTX-2
4. Verificar que se graba en Supabase `generated_videos`
5. Solo entonces: commit + push + Railway redeploy

---

## CONSIDERACIONES TÉCNICAS

### Tiempo de generación estimado
- LTX-2 Pro API: ~60-90 segundos (genera 6 segundos de video)
- Remotion Lambda: ~45-60 segundos
- **Total: ~2-3 minutos por video** (vs ~60s actual sin LTX-2)

### Posible problema: LTX-2 guarda en disco local
El script `pipeline-image.ts` descarga el video en `video/public/ltx-video.mp4` — ruta local del servidor Railway.
Hay que subirlo a Supabase Storage para que Lambda (que corre en AWS) pueda acceder a él via URL pública.

### Variable de entorno LTX-2
`pipeline-image.ts` usa `process.env.LTX_API_TOKEN` (no `LTX_API_KEY`).
Verificar cuál es el nombre correcto en Railway antes de implementar.

---

## PRIORIDAD

Esta tarea es **prioritaria post-piloto** — es la funcionalidad core diferenciadora del producto.

Un video con movimiento cinematográfico de LTX-2 vs una imagen estática es la diferencia entre un producto premium y uno básico.

---

*Documento creado 18 Feb 2026 — pendiente de implementación post-piloto*
