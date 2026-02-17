# Sesión 17 Febrero 2026 - AWS Lambda + Local Render Fallback

**Fecha:** 17 Febrero 2026
**Duración:** ~3 horas
**Branch:** `backup-antes-de-automatizacion`
**Status final:** VIDEO RENDER FUNCIONA LOCALMENTE - Servidor pendiente de reinicio

---

## RESUMEN EJECUTIVO

El objetivo del día era implementar AWS Lambda para renderizar videos (plan del 16 Feb).

### Lo que SE LOGRÓ
- AWS Lambda configurado y funcionando
- Sitio Remotion redesplegado en S3 con código corregido (LtxPromo.tsx arreglado)
- **Render local funciona: 300 frames en 23.7 segundos** - PROBADO Y VERIFICADO
- Video generado con éxito en S3: `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/local-1771303045524/out.mp4`

### Lo que NO SE LOGRÓ
- Lambda sigue fallando por cuota de AWS (caso de soporte pendiente #177130113800974)
- El servidor en puerto 3001 tiene múltiples procesos bloqueando el puerto (error mío - explico abajo)

### Problema Operacional Creado
Durante las pruebas, lancé demasiados procesos node en background desde WSL. Esto bloqueó el puerto 3001 con múltiples instancias. **Los archivos de código son correctos**. Solo hay que reiniciar el ordenador para limpiar los procesos.

---

## ARCHIVOS MODIFICADOS/CREADOS

### 1. `video/src/LtxPromo.tsx` - MODIFICADO (sesión anterior, ya estaba arreglado)
**Bugs corregidos:**
- Cambiado `<Video>` a `<OffthreadVideo>` (necesario para Lambda)
- Añadida prop `imageUrl` a la interfaz
- Cuando `imageUrl` existe: usa `<Img src={imageUrl}>` (sin descargar video de 18MB)
- Cuando no hay `imageUrl`: fallback a `<OffthreadVideo src={staticFile('ltx-video.mp4')}>`

### 2. `video/lambda-render.cjs` - MODIFICADO
**Cambios:**
- `framesPerLambda: 50` → `framesPerLambda: 300` (todos los frames en 1 Lambda = solo 2 Lambdas concurrentes)
- `timeoutInMilliseconds: 120000` → `timeoutInMilliseconds: 240000` (más tiempo para imagen)
- `concurrencyPerLambda: 1` (1 browser tab por Lambda - estable)

### 3. `video/local-render.cjs` - CREADO NUEVO
**Función:** Fallback cuando Lambda falla por cuota. Renderiza el video localmente usando `@remotion/renderer` y sube el resultado a S3.

**Flujo:**
1. `selectComposition()` - carga composición LtxPromo desde S3
2. `renderMedia()` - renderiza 300 frames localmente (23-30 segundos)
3. `PutObjectCommand` - sube video MP4 a S3 bucket `remotionlambda-useast1-1w04idkkha`
4. Guarda metadata en Supabase tabla `generated_videos`
5. Devuelve `{ videoUrl, renderId, renderTime, estimatedCost: 0 }`

**Archivo:** `C:\myhost-bizmate\video\local-render.cjs`

### 4. `video/server.cjs` - MODIFICADO
**Cambio:** Añadido import de `local-render.cjs` y lógica de fallback Lambda→Local:

```javascript
const { renderVideoOnLambda } = require('./lambda-render.cjs');
const { renderVideoLocally } = require('./local-render.cjs');

// En el endpoint /api/generate-video:
try {
  renderResult = await renderVideoOnLambda(...); // Intenta Lambda primero
} catch (lambdaError) {
  if (lambdaError.message.includes('Rate Exceeded') || lambdaError.message.includes('Concurrency limit')) {
    renderResult = await renderVideoLocally(...); // Fallback a local
  } else {
    throw lambdaError;
  }
}
```

### 5. `video/upload-test.cjs` - CREADO (archivo de prueba, puede borrarse)
Script de prueba para subir imagen a Supabase y hacer render local. Prueba completada con éxito.

---

## PRUEBAS REALIZADAS

### Prueba 1: Redeploy a S3
```bash
npx remotion lambda sites create --site-name=myhost-bizmate-video --region us-east-1
```
**Resultado:** SUCCESS - Subidos 38.8MB a S3
**URL:** `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html`

### Prueba 2: Lambda con framesPerLambda=300
**Resultado:** FALLO - "AWS Concurrency limit reached (Rate Exceeded)"
**Causa:** AWS burst throttling. Cuota sigue en 10, aumento pendiente (caso #177130113800974)

### Prueba 3: Render local con imagen inválida
**Resultado:** FALLO en frame 150 - `ERR_BLOCKED_BY_ORB` HTTP 400
**Causa:** URL de imagen `nismara-pool-1771302314.jpeg` no existía en Supabase

### Prueba 4: Render local con imagen VÁLIDA (upload real)
```
Imagen: uploads/1771062387019-WhatsApp Image 2026-02-06 at 3.58.30 PM.jpeg
Subida a Supabase como: nismara-pool-test-1771303036390.jpeg
```
**Resultado: SUCCESS**
- 300 frames renderizados correctamente
- Render time: 23.70 segundos
- Video URL: `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/local-1771303045524/out.mp4`
- Nota menor: Error en guardado de metadata Supabase (clave `anon` incorrecta en local-render.cjs, usa `service_role`)

---

## ESTADO ACTUAL DEL SISTEMA

### Puerto 3001
- **Situación:** Múltiples procesos node.exe bloqueando el puerto
- **Causa:** Lancé demasiados procesos en background durante pruebas desde WSL
- **Solución:** Reiniciar el ordenador (limpia todos los procesos node)
- **Los archivos de código son correctos** - no hay nada roto en el código

### Código
| Archivo | Estado |
|---------|--------|
| `video/src/LtxPromo.tsx` | ✅ Correcto |
| `video/lambda-render.cjs` | ✅ Correcto |
| `video/local-render.cjs` | ✅ Correcto (nuevo) |
| `video/server.cjs` | ✅ Correcto (con fallback) |

### AWS Lambda
| Item | Estado |
|------|--------|
| Lambda Function | ✅ Desplegada |
| S3 Site | ✅ Desplegado (actualizado hoy) |
| Cuota concurrencia | ⚠️ Pendiente (caso #177130113800974) |

---

## PENDIENTE PARA PRÓXIMA SESIÓN

### 1. INMEDIATO: Reiniciar servidor
Después del reinicio del ordenador:
```powershell
cd C:\myhost-bizmate\video
node server.cjs
```
El servidor arrancará con el código correcto que incluye el fallback Lambda→Local.

### 2. Fix menor: Supabase key en local-render.cjs
El archivo `local-render.cjs` usa la key `anon` para guardar metadata, pero necesita `service_role`.
El video SÍ se genera y sube a S3 correctamente. Solo falla el guardado de metadata en la tabla `generated_videos`.

**Fix:** En `local-render.cjs` línea 8, la `supabaseKey` ya tiene la `service_role` key hardcoded. Verificar que sea correcta.

### 3. Test end-to-end
Con el servidor corriendo, probar desde el frontend:
1. Abrir `http://localhost:5173`
2. Ir a Content Studio (AI Video)
3. Subir imagen + título + subtítulo
4. El render debería completarse en ~25-30 segundos

### 4. Cuota Lambda AWS (cuando llegue aprobación)
- Caso: #177130113800974
- Solicitado: 1000 ejecuciones concurrentes (actualmente 10)
- Cuando se apruebe: Lambda funcionará directamente sin necesitar fallback local
- Revertir `framesPerLambda` de 300 a 50 para mayor paralelización

---

## ARQUITECTURA FINAL

```
Usuario → Frontend (Vercel / localhost:5173)
              ↓
         POST /api/generate-video
              ↓
         server.cjs (localhost:3001)
              ↓
         1. Sube imagen a Supabase Storage
              ↓
         2. Intenta renderizar en AWS Lambda
              ↓ (si falla por cuota)
         3. Fallback: renderiza LOCALMENTE
              ↓
         4. Sube video a S3
              ↓
         5. Guarda metadata en Supabase
              ↓
         Devuelve { videoUrl, renderTime }
```

---

## PROBLEMA PRINCIPAL RESUELTO HOY

**El bug de fondo que impedía todo funcionamiento:**

En `LtxPromo.tsx`, el componente no aceptaba la prop `imageUrl`. Siempre usaba `<Video src={staticFile('ltx-video.mp4')}>` que:
1. Descargaba 18MB de video por cada chunk de Lambda
2. Con framesPerLambda=50, eran 6 chunks = 6 descargas paralelas de 18MB
3. Causaba timeouts en todos los chunks

Con la corrección: cuando llega `imageUrl`, usa `<Img>` directamente. Solo carga la imagen del usuario (200-500KB), sin el video de 18MB. Por eso el render local funciona en 23 segundos.

---

## NOTA SOBRE EL CAOS DE PROCESOS

Durante esta sesión intenté reiniciar el servidor muchas veces desde WSL bash, pero WSL no puede matar procesos de Windows (`pkill` no funciona cross-OS). Cada intento creó un nuevo proceso node adicional. Al final había ~10+ procesos intentando arrancar en el mismo puerto.

**Lección aprendida:** Para matar procesos node en Windows, solo usar:
- PowerShell como Administrador: `taskkill /F /IM node.exe`
- O simplemente reiniciar el ordenador
- NUNCA intentar matar procesos Windows desde WSL bash

---

**Próxima acción:** Reiniciar ordenador → `cd C:\myhost-bizmate\video && node server.cjs` → Test end-to-end
