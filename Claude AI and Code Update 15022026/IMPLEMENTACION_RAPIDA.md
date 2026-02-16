# ⚡ GUÍA DE IMPLEMENTACIÓN RÁPIDA - Content Studio Fix

**Tiempo estimado**: 30-60 minutos
**Objetivo**: Restaurar funcionalidad de video generation

---

## 🎯 OPCIÓN A: Crear wrapper file (RECOMENDADO)

### Paso 1: Verificar pipeline-image.ts

```bash
cd C:\myhost-bizmate\video\scripts
cat pipeline-image.ts | grep "export"
```

**Debe mostrar**: `export async function runImageToVideo`

### Paso 2: Crear image-to-video-cli.mjs

**Archivo**: `C:\myhost-bizmate\video\scripts\image-to-video-cli.mjs`

**Contenido**:
```javascript
import { runImageToVideo } from './pipeline-image.ts';

const imageUrl = process.argv[2];
const cameraMovement = process.argv[3];

if (!imageUrl) {
  console.error('❌ Error: imageUrl is required');
  process.exit(1);
}

console.log('🎬 LTX-2 Video Generation Starting...');
console.log(`📸 Image URL: ${imageUrl}`);
console.log(`🎥 Camera Movement: ${cameraMovement || 'default'}`);

runImageToVideo(imageUrl, cameraMovement || undefined)
  .then((outputPath) => {
    console.log(`✅ Video generated successfully: ${outputPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`❌ Generation failed: ${error.message}`);
    process.exit(1);
  });
```

### Paso 3: Probar standalone

```bash
cd C:\myhost-bizmate\video\scripts
node image-to-video-cli.mjs "https://jjpscimtxrudtepzwhag.supabase.co/storage/v1/object/public/Nismara%20Uma%20Villas/test.jpg" "slow zoom"
```

**Resultado esperado**:
- ✅ No errores
- ✅ Archivo creado: `C:\myhost-bizmate\video\public\ltx-video.mp4`

### Paso 4: Iniciar backend

```bash
cd C:\myhost-bizmate\video
node server.cjs
```

**Verificar**:
- ✅ "Video Generation API Server running on http://localhost:3001"
- ✅ "LTX API Token: SET ✅"

### Paso 5: Probar desde UI

1. Abrir: http://localhost:5173
2. Navegar: Marketing → Content Studio
3. Upload imagen
4. Fill title, subtitle, camera movement
5. Click "Generate Video"
6. Esperar ~2 minutos

**Resultado esperado**:
- ✅ Video generado sin errores
- ✅ Aparece en "My Videos" tab
- ✅ Se puede descargar

### Paso 6: Commit VERIFICADO

```bash
cd C:\myhost-bizmate

# Agregar archivo
git add video/scripts/image-to-video-cli.mjs

# Commit
git commit -m "fix: Add missing image-to-video-cli wrapper for Content Studio

Critical fix for video generation:
- Add wrapper script that server.cjs depends on
- Enables image-to-video conversion via LTX-2 API
- Required for Content Studio functionality

Tested: Video generation working end-to-end

🤖 Generated with Claude Code"

# VERIFICAR que archivo está en commit
git ls-tree HEAD video/scripts/ | grep "image-to-video-cli"

# Si aparece → Push
git push origin backup-antes-de-automatizacion
```

### Paso 7: Verificación en GitHub

1. Ir a: https://github.com/Josecarrallo/myhost-bizmate
2. Navegar: video/scripts/
3. **CONFIRMAR VISUALMENTE** que `image-to-video-cli.mjs` existe

---

## 🎯 OPCIÓN B: Modificar server.cjs (ALTERNATIVA)

### Paso 1: Editar server.cjs

**Archivo**: `C:\myhost-bizmate\video\server.cjs`

**Buscar línea 85** (aproximadamente):
```javascript
`cd "${path.join(__dirname, 'scripts')}" && node image-to-video-cli.mjs "${publicUrl}" "${cameraMovement}"`,
```

**Reemplazar por**:
```javascript
`cd "${path.join(__dirname, 'scripts')}" && npx ts-node pipeline-image.ts "${publicUrl}" "${cameraMovement}"`,
```

### Paso 2: Verificar ts-node instalado

```bash
cd C:\myhost-bizmate\video
npm list ts-node
```

**Si NO está instalado**:
```bash
npm install --save-dev ts-node
```

### Paso 3: Probar backend

```bash
cd C:\myhost-bizmate\video
node server.cjs
```

### Paso 4: Probar desde UI

(Mismo que Opción A, Paso 5)

### Paso 5: Commit

```bash
git add video/server.cjs
git commit -m "fix: Use direct ts-node call for video generation

Changed from wrapper script to direct execution.
More reliable and maintainable."
git push origin backup-antes-de-automatizacion
```

---

## 🧪 TESTING COMPLETO

### Test 1: Backend health check

```bash
curl http://localhost:3001/api/health
```

**Esperado**: `{"status":"ok","message":"Video generation server is running"}`

### Test 2: Video generation con imagen real

1. Subir imagen desde UI
2. Title: "Luxury Pool Villa"
3. Subtitle: "Nismara Uma Villas"
4. Camera: "slow zoom in, cinematic"
5. Music: "bali-sunrise.mp3"
6. Generate

**Verificar**:
- Backend logs muestran progreso
- No errores en consola
- Video aparece después de ~2 min

### Test 3: Sin camera movement

1. Subir imagen
2. Dejar camera movement vacío
3. Generate

**Verificar**:
- No error "prompt required"
- Video se genera correctamente

### Test 4: Múltiples videos

1. Generar 3 videos diferentes
2. Verificar que todos aparecen en "My Videos"
3. Descargar cada uno

---

## 🚨 TROUBLESHOOTING

### Error: "Cannot find module"

**Causa**: Wrapper file no existe
**Solución**: Opción A, crear el archivo

### Error: "prompt is required"

**Causa**: Backend envía "undefined" como string
**Solución**: Verificar que wrapper filtra undefined correctamente

### Error: "LTX_API_TOKEN not found"

**Causa**: .env no cargado
**Solución**:
```bash
cd video
node -r dotenv/config server.cjs
```

### Error: "Upload failed"

**Causa**: Supabase bucket permissions
**Solución**: Verificar que bucket "Nismara Uma Villas" existe y es público

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Backend inicia sin errores
- [ ] LTX API Token reconocido
- [ ] UI puede subir imagen
- [ ] Video se genera en ~2 minutos
- [ ] Video aparece en "My Videos"
- [ ] Video se puede descargar
- [ ] Archivo wrapper en Git (si Opción A)
- [ ] Todo documentado
- [ ] Usuario satisfecho

---

**Preparado para**: Jose Carrallo
**Fecha**: 15 Febrero 2026
**Prioridad**: MÁXIMA
