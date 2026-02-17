# Plan Detallado: Migración AWS Lambda - Video Rendering

**Fecha de creación:** 16 Febrero 2026
**Fecha de implementación:** 17 Febrero 2026
**Tiempo estimado total:** 4-5 horas
**Objetivo:** Video generation funcionando en producción (Vercel → Railway → AWS Lambda)

---

## 📋 ÍNDICE

1. [Prerequisitos](#prerequisitos)
2. [Fase 1: Setup AWS Account](#fase-1-setup-aws-account-30-45-min)
3. [Fase 2: Deploy Remotion a Lambda](#fase-2-deploy-remotion-a-lambda-60-90-min)
4. [Fase 3: Modificar Backend Code](#fase-3-modificar-backend-code-90-120-min)
5. [Fase 4: Actualizar Railway](#fase-4-actualizar-railway-30-45-min)
6. [Fase 5: Testing Completo](#fase-5-testing-completo-45-60-min)
7. [Fase 6: Documentación Final](#fase-6-documentacion-final-30-min)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Plan](#rollback-plan)

---

## PREREQUISITOS

### Antes de Empezar

**Documentos a revisar:**
- ✅ `RESUMEN_EJECUTIVO_16FEB2026.md` (este directorio)
- ✅ `ANALISIS_TECNICO_RAILWAY_VS_LAMBDA.md` (este directorio)
- ✅ `DOCUMENTACION_COMPLETA_RAILWAY_FIX_16FEB2026.md` (raíz del proyecto)

**Herramientas necesarias:**
- ✅ Cuenta de email válida
- ✅ Tarjeta de crédito (para AWS signup - Free Tier disponible)
- ✅ Git instalado y configurado
- ✅ Node.js 18+ instalado
- ✅ Acceso a Railway dashboard
- ✅ Acceso a Vercel dashboard

**Información a tener a mano:**
- ✅ Supabase URL: `https://jjpscimtxrudtepzwhag.supabase.co`
- ✅ Supabase Service Key (de Railway variables)
- ✅ LTX API Key (de Railway variables)

---

## FASE 1: SETUP AWS ACCOUNT (30-45 min)

### Paso 1.1: Crear Cuenta AWS (15 min)

**URL:** https://aws.amazon.com

1. Click "Create an AWS Account"
2. Ingresar información:
   - Email address
   - Account name: "myhost-bizmate-production"
   - Password (guardar en password manager)
3. Seleccionar "Personal" account type
4. Ingresar información de contacto:
   - Full name
   - Phone number
   - Address
5. Ingresar tarjeta de crédito
   - **Nota:** AWS tiene Free Tier, no te cobrarán si te mantienes dentro de límites
   - Lambda Free Tier: 1M requests/mes gratis
   - S3 Free Tier: 5GB storage gratis
6. Verificar identidad (SMS o llamada telefónica)
7. Seleccionar "Basic Support - Free"
8. Completar signup

**Output esperado:**
```
✓ Account created successfully
✓ Welcome email received
✓ AWS Console accessible at: https://console.aws.amazon.com
```

---

### Paso 1.2: Configurar IAM User (15 min)

**Por qué:** No uses root account para operaciones diarias (seguridad)

**Pasos:**

1. Login a AWS Console: https://console.aws.amazon.com
2. Buscar "IAM" en la barra de búsqueda
3. Click "Users" → "Add users"
4. Configuración:
   - **User name:** `remotion-lambda-admin`
   - **Access type:** ✅ Access key - Programmatic access
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Buscar y seleccionar estas policies:
   - ✅ `AmazonS3FullAccess` (para guardar videos)
   - ✅ `AWSLambdaFullAccess` (para crear/ejecutar functions)
   - ✅ `CloudWatchLogsFullAccess` (para ver logs)
   - ✅ `IAMReadOnlyAccess` (para verificar permisos)
8. Click "Next: Tags" (skip)
9. Click "Next: Review"
10. Click "Create user"
11. **MUY IMPORTANTE:** Download credentials:
    - Click "Download .csv"
    - Guardar en: `C:\myhost-bizmate\AWS_CREDENTIALS_PRIVATE.csv`
    - **NO COMMITEAR ESTE ARCHIVO** (ya está en .gitignore)

**Output del CSV:**
```
User name,Access key ID,Secret access key
remotion-lambda-admin,AKIAIOSFODNN7EXAMPLE,wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

---

### Paso 1.3: Instalar y Configurar AWS CLI (15 min)

**Descargar AWS CLI:**

Windows: https://awscli.amazonaws.com/AWSCLIV2.msi

**Instalar:**
1. Ejecutar el instalador .msi
2. Seguir wizard (Next → Next → Install)
3. Cerrar y reabrir terminal/PowerShell

**Verificar instalación:**
```bash
aws --version
```

**Output esperado:**
```
aws-cli/2.15.10 Python/3.11.6 Windows/10 exe/AMD64
```

**Configurar credentials:**
```bash
aws configure
```

**Ingresar información del CSV descargado:**
```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

**Verificar configuración:**
```bash
aws sts get-caller-identity
```

**Output esperado:**
```json
{
    "UserId": "AIDAIOSFODNN7EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/remotion-lambda-admin"
}
```

**✅ FASE 1 COMPLETADA - Checklist:**
- [ ] Cuenta AWS creada
- [ ] IAM user `remotion-lambda-admin` creado
- [ ] Credentials CSV descargado y guardado de forma segura
- [ ] AWS CLI instalado
- [ ] AWS CLI configurado con credentials
- [ ] `aws sts get-caller-identity` funciona correctamente

---

## FASE 2: DEPLOY REMOTION A LAMBDA (60-90 min)

### Paso 2.1: Instalar @remotion/lambda (5 min)

```bash
cd /c/myhost-bizmate/video
npm install @remotion/lambda @remotion/cli
```

**Output esperado:**
```
added 24 packages, and audited 375 packages in 15s
```

**Verificar instalación:**
```bash
npx remotion lambda --version
```

**Output esperado:**
```
@remotion/lambda: 4.0.140
```

---

### Paso 2.2: Preparar Código Remotion para Lambda (15 min)

**Verificar estructura de archivos:**

```bash
# Confirmar que estos archivos existen:
ls -la src/
```

**Archivos requeridos:**
```
src/
  index.ts          # Entry point
  LtxPromo.tsx      # Composition
  Root.tsx          # Root component (si existe)
```

**Si `src/index.ts` NO existe, crearlo:**

```bash
# Crear archivo si no existe
cat > src/index.ts << 'EOF'
import { registerRoot } from 'remotion';
import { LtxPromo } from './LtxPromo';

registerRoot(() => {
  return (
    <>
      <LtxPromo />
    </>
  );
});
EOF
```

**Verificar que LtxPromo tiene composición registrada:**

```bash
# Revisar LtxPromo.tsx
grep -n "Composition" src/LtxPromo.tsx
```

**Debe tener algo como:**
```tsx
<Composition
  id="LtxPromo"
  component={LtxPromoComponent}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

---

### Paso 2.3: Deploy Site to Lambda (30 min)

**Comando:**
```bash
npx remotion lambda sites create src/index.ts --site-name=myhost-bizmate-video
```

**Qué hace este comando:**
1. Bundlea tu código de Remotion (Webpack)
2. Sube assets estáticos a S3 bucket
3. Crea infraestructura necesaria
4. Te da una Serve URL para usar en rendering

**Output esperado (tarda 3-5 minutos):**
```
Bundling video...
Uploading to S3...
✓ Site deployed successfully
✓ Site name: myhost-bizmate-video
✓ Bucket: remotion-lambda-us-east-1-abcdef123456
✓ Serve URL: https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video
✓ Site ID: myhost-bizmate-video
```

**IMPORTANTE:** Guardar este Serve URL, lo necesitarás en Paso 3.

---

### Paso 2.4: Deploy Lambda Function (30 min)

**Comando:**
```bash
npx remotion lambda functions deploy \
  --memory=3009 \
  --timeout=120 \
  --region=us-east-1
```

**Parámetros explicados:**
- `--memory=3009`: 3GB RAM (necesario para video rendering)
- `--timeout=120`: 120 segundos máximo (videos de 10 seg toman ~30-40 seg)
- `--region=us-east-1`: Virginia (más barato y rápido)

**Output esperado (tarda 5-8 minutos):**
```
Deploying Lambda function...
Creating function in us-east-1...
Uploading code...
Configuring permissions...
✓ Function deployed successfully
✓ Function name: remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
✓ Function ARN: arn:aws:lambda:us-east-1:123456789012:function:remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
✓ Region: us-east-1
✓ Memory: 3009 MB
✓ Timeout: 120 seconds
```

**IMPORTANTE:** Guardar este Function Name, lo necesitarás en Paso 3.

---

### Paso 2.5: Test Rendering (Opcional pero Recomendado) (15 min)

**Comando de prueba:**
```bash
npx remotion lambda render \
  --function-name=remotion-render-4-0-140-mem3009mb-disk2048mb-120sec \
  --serve-url=https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video \
  --composition=LtxPromo \
  --props='{"title":"Test Villa","subtitle":"Bali Paradise","musicFile":"bali-sunrise.mp3"}'
```

**Output esperado:**
```
Rendering video...
Progress: [====================================] 100%
✓ Video rendered successfully
✓ Output: https://remotion-lambda-us-east-1-abcdef123456.s3.amazonaws.com/renders/abc123/out.mp4
✓ Duration: 35 seconds
✓ Cost: $0.048
```

**Abrir el URL en navegador para verificar que el video se generó correctamente.**

---

**✅ FASE 2 COMPLETADA - Checklist:**
- [ ] @remotion/lambda instalado
- [ ] src/index.ts existe y está configurado
- [ ] Site deployed to S3 (Serve URL guardado)
- [ ] Lambda function deployed (Function Name guardado)
- [ ] Test render exitoso (opcional)

**Variables a guardar para Fase 3:**
```
LAMBDA_SERVE_URL=https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video
LAMBDA_FUNCTION_NAME=remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
AWS_REGION=us-east-1
```

---

## FASE 3: MODIFICAR BACKEND CODE (90-120 min)

### Paso 3.1: Crear Feature Branch (5 min)

```bash
cd /c/myhost-bizmate
git checkout -b feature/aws-lambda-migration
git status
```

**Output esperado:**
```
On branch feature/aws-lambda-migration
nothing to commit, working tree clean
```

---

### Paso 3.2: Crear lambda-render.js Module (45 min)

**Crear nuevo archivo:**
```bash
touch video/lambda-render.js
```

**Contenido del archivo `video/lambda-render.js`:**

```javascript
const { renderMediaOnLambda } = require("@remotion/lambda/client");
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = (process.env.SUPABASE_URL || 'https://jjpscimtxrudtepzwhag.supabase.co').trim();
const supabaseKey = (process.env.SUPABASE_KEY || 'your-service-key-here').trim();
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Renderiza video usando AWS Lambda + Remotion
 * @param {Object} params - Parámetros del video
 * @param {string} params.title - Título del video
 * @param {string} params.subtitle - Subtítulo del video
 * @param {string} params.imageUrl - URL de la imagen (Supabase public URL)
 * @param {string} params.musicFile - Nombre del archivo de música
 * @param {string} params.userId - ID del usuario (opcional)
 * @returns {Promise<Object>} - { videoUrl, renderId, bucketName, cost }
 */
async function renderVideoOnLambda({ title, subtitle, imageUrl, musicFile, userId }) {
  console.log('🚀 Starting AWS Lambda render...');
  console.log(`📝 Title: ${title}`);
  console.log(`📝 Subtitle: ${subtitle}`);
  console.log(`🖼️ Image URL: ${imageUrl}`);
  console.log(`🎵 Music: ${musicFile}`);

  const startTime = Date.now();

  try {
    // Configuración de Lambda desde variables de entorno
    const region = process.env.AWS_REGION || 'us-east-1';
    const functionName = process.env.LAMBDA_FUNCTION_NAME;
    const serveUrl = process.env.LAMBDA_SERVE_URL;

    if (!functionName || !serveUrl) {
      throw new Error('Missing Lambda configuration. Set LAMBDA_FUNCTION_NAME and LAMBDA_SERVE_URL');
    }

    console.log(`🔧 Lambda Function: ${functionName}`);
    console.log(`🔧 Serve URL: ${serveUrl}`);

    // Renderizar video en Lambda
    const { bucketName, renderId } = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl,
      composition: "LtxPromo",
      inputProps: {
        title,
        subtitle,
        imageUrl,
        musicFile: musicFile || 'bali-sunrise.mp3'
      },
      codec: "h264",
      imageFormat: "jpeg",
      maxRetries: 1,
      privacy: "public",
      forceHeight: 1080,
      forceWidth: 1920,
    });

    const renderTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Lambda render completed in ${renderTime}s`);
    console.log(`📹 Bucket: ${bucketName}`);
    console.log(`🆔 Render ID: ${renderId}`);

    // Construir URL del video
    const videoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${renderId}/out.mp4`;
    console.log(`🎬 Video URL: ${videoUrl}`);

    // Guardar metadata en Supabase
    console.log('💾 Saving metadata to Supabase...');
    const { data: videoData, error: dbError } = await supabase
      .from('generated_videos')
      .insert([{
        user_id: userId || null,
        title,
        subtitle,
        video_url: videoUrl,
        thumbnail_url: imageUrl, // Usar la imagen subida como thumbnail
        filename: `${renderId}-out.mp4`,
        file_size_mb: 0, // Se actualizará después si es necesario
        duration_seconds: 10,
        resolution: '1920x1080',
        camera_prompt: null, // LTX ya no se usa
        music_file: musicFile,
        status: 'completed',
        render_time_seconds: parseFloat(renderTime),
        created_at: new Date().toISOString()
      }])
      .select();

    if (dbError) {
      console.error('⚠️ Database save error:', dbError);
      // No lanzar error, el video se generó exitosamente
    } else {
      console.log('✅ Metadata saved to Supabase');
    }

    // Estimar costo (aproximado)
    // Lambda pricing: $0.0000166667 por GB-segundo
    // Con 3GB y ~35 segundos: ~$0.0017 + S3 storage
    const estimatedCost = 0.05; // Estimación conservadora

    return {
      videoUrl,
      renderId,
      bucketName,
      renderTime: parseFloat(renderTime),
      estimatedCost,
      success: true
    };

  } catch (error) {
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ Lambda render failed after ${errorTime}s:`, error.message);
    throw error;
  }
}

module.exports = { renderVideoOnLambda };
```

---

### Paso 3.3: Modificar server.cjs para usar Lambda (45 min)

**Backup del archivo original:**
```bash
cp video/server.cjs video/server.cjs.backup-before-lambda
```

**Modificar `video/server.cjs`:**

**1. Agregar import al inicio (después de línea 7):**
```javascript
const { renderVideoOnLambda } = require('./lambda-render.js');
```

**2. Reemplazar el endpoint /api/generate-video (líneas 50-179):**

```javascript
// Generate video endpoint
app.post('/api/generate-video', upload.single('image'), async (req, res) => {
  try {
    console.log('\n🎬 Video Generation Request Received');

    const { title, subtitle, cameraMovement, music, userId } = req.body;
    const imagePath = req.file.path;

    console.log(`📸 Image: ${req.file.filename}`);
    console.log(`🎨 Title: ${title}`);
    console.log(`📝 Subtitle: ${subtitle}`);
    console.log(`🎵 Music: ${music}`);

    // Step 1: Upload image to Supabase Storage
    console.log('📤 Step 1: Uploading image to Supabase Storage...');
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = `nismara-pool-${Date.now()}.jpeg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('Nismara Uma Villas')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('Nismara Uma Villas')
      .getPublicUrl(fileName);

    console.log(`✅ Image uploaded: ${publicUrl}`);

    // Step 2: Render video on AWS Lambda (replaces LTX + local Remotion)
    console.log('🚀 Step 2: Rendering video on AWS Lambda...');

    const lambdaResult = await renderVideoOnLambda({
      title,
      subtitle,
      imageUrl: publicUrl,
      musicFile: music || 'bali-sunrise.mp3',
      userId
    });

    console.log(`\n🎉 Video generation complete!`);
    console.log(`📹 Video URL: ${lambdaResult.videoUrl}`);
    console.log(`⏱️ Render time: ${lambdaResult.renderTime}s`);
    console.log(`💰 Estimated cost: $${lambdaResult.estimatedCost}\n`);

    res.json({
      success: true,
      videoUrl: lambdaResult.videoUrl,
      renderId: lambdaResult.renderId,
      renderTime: lambdaResult.renderTime,
      estimatedCost: lambdaResult.estimatedCost,
      message: 'Video generated successfully on AWS Lambda'
    });

    // Cleanup: Delete uploaded image from local filesystem
    fs.unlinkSync(imagePath);

  } catch (error) {
    console.error('❌ Error generating video:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

**3. Actualizar health check para mostrar Lambda status (línea 45):**
```javascript
app.get('/api/health', (req, res) => {
  const hasLambdaConfig = !!(process.env.LAMBDA_FUNCTION_NAME && process.env.LAMBDA_SERVE_URL);
  res.json({
    status: 'ok',
    message: 'Video generation server is running',
    mode: hasLambdaConfig ? 'AWS Lambda' : 'Local (Lambda not configured)',
    timestamp: new Date().toISOString()
  });
});
```

---

### Paso 3.4: Testing Local (30 min)

**Configurar variables de entorno locales:**

```bash
# Crear .env en video/ si no existe
cat > video/.env << 'EOF'
SUPABASE_URL=https://jjpscimtxrudtepzwhag.supabase.co
SUPABASE_KEY=your-service-key-here
LTX_API_KEY=ltxv_zHhMI... (mantener por si acaso)
FRONTEND_URL=http://localhost:5173
PORT=3001

# AWS Lambda Config
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
LAMBDA_FUNCTION_NAME=remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
LAMBDA_SERVE_URL=https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video
EOF
```

**Modificar server.cjs para cargar .env:**

Agregar al inicio del archivo (después de los requires):
```javascript
require('dotenv').config();
```

**Instalar dotenv:**
```bash
cd video
npm install dotenv
```

**Iniciar servidor local:**
```bash
cd video
node server.cjs
```

**Output esperado:**
```
🚀 Video Generation API Server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
🔑 LTX API Token: SET ✅
🔑 Lambda Function: remotion-render-4-0-140-mem3009mb-disk2048mb-120sec ✅
🔑 Lambda Serve URL: SET ✅
```

**Test con curl (en otra terminal):**
```bash
curl http://localhost:3001/api/health
```

**Output esperado:**
```json
{
  "status": "ok",
  "message": "Video generation server is running",
  "mode": "AWS Lambda",
  "timestamp": "2026-02-17T10:30:00.000Z"
}
```

**Test video generation (requiere imagen de prueba):**
```bash
curl -X POST http://localhost:3001/api/generate-video \
  -F "image=@/c/myhost-bizmate/test-images/villa1.jpg" \
  -F "title=Test Villa Lambda" \
  -F "subtitle=AWS Lambda Test" \
  -F "music=bali-sunrise.mp3"
```

**Output esperado (tarda ~40 segundos):**
```json
{
  "success": true,
  "videoUrl": "https://remotion-lambda-us-east-1-abcdef123456.s3.amazonaws.com/renders/xyz789/out.mp4",
  "renderId": "xyz789",
  "renderTime": 38.45,
  "estimatedCost": 0.05,
  "message": "Video generated successfully on AWS Lambda"
}
```

**Verificar video:**
- Abrir videoUrl en navegador
- Confirmar que el video se reproduce correctamente
- Verificar que tiene título, subtítulo y música

---

**✅ FASE 3 COMPLETADA - Checklist:**
- [ ] Feature branch creado
- [ ] lambda-render.js creado con toda la lógica
- [ ] server.cjs modificado para usar Lambda
- [ ] Health check actualizado
- [ ] dotenv instalado y .env configurado
- [ ] Test local exitoso (health check)
- [ ] Test local exitoso (video generation)
- [ ] Video URL accesible y reproducible

---

## FASE 4: ACTUALIZAR RAILWAY (30-45 min)

### Paso 4.1: Simplificar Dockerfile (15 min)

**Backup del Dockerfile actual:**
```bash
cp video/Dockerfile video/Dockerfile.backup-before-lambda
```

**Nuevo `video/Dockerfile` (MUCHO más simple):**

```dockerfile
FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (not just production)
# Remotion Lambda client needs some dev dependencies
RUN npm ci

# Copy application code
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server.cjs"]
```

**Cambios clave:**
- ❌ Eliminadas 36 librerías de Chrome (ya NO se necesitan)
- ❌ Eliminado `npx remotion browser ensure` (ya NO se necesita)
- ✅ Cambiado `npm ci --only=production` a `npm ci` (incluye devDependencies)
- ✅ Image base: `node:22-slim` (más ligera)

**Comparación de tamaños:**
- **Antes:** ~2.5GB (con Chrome + librerías)
- **Después:** ~400MB (solo Node.js)

---

### Paso 4.2: Configurar Variables de Entorno en Railway (15 min)

**Login a Railway:**
https://railway.app/project/perfect-tranquility

**Settings → Variables:**

**Agregar nuevas variables:**
```
AWS_REGION = us-east-1
AWS_ACCESS_KEY_ID = AKIAIOSFODNN7EXAMPLE (del CSV)
AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY (del CSV)
LAMBDA_FUNCTION_NAME = remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
LAMBDA_SERVE_URL = https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video
```

**Variables existentes (mantener):**
```
SUPABASE_URL = https://jjpscimtxrudtepzwhag.supabase.co
SUPABASE_KEY = [service_role key] (SIN newlines)
FRONTEND_URL = https://myhost-bizmate.vercel.app
PORT = 3001
LTX_API_KEY = ltxv_zHhMI... (mantener por si acaso)
```

**Verificar que NO hay variables con newlines o espacios extras**

---

### Paso 4.3: Commit y Push (15 min)

```bash
cd /c/myhost-bizmate

# Ver cambios
git status

# Agregar archivos modificados
git add video/lambda-render.js
git add video/server.cjs
git add video/Dockerfile
git add video/package.json
git add video/package-lock.json

# Commit
git commit -m "feat: Migrate video rendering from Railway local to AWS Lambda

- Add lambda-render.js module for AWS Lambda integration
- Modify server.cjs to use renderMediaOnLambda instead of local Remotion
- Simplify Dockerfile (remove Chrome dependencies, Railway only coordinates now)
- Install @remotion/lambda and dotenv packages
- Update health check to show Lambda status
- Video rendering now happens on AWS Lambda serverless
- Railway backend only uploads images and calls Lambda
- Estimated render cost: $0.05 per 10-second video

Fixes Railway Chrome dependency issues (libnspr4.so errors)
Implements official Remotion recommended architecture

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push a feature branch
git push origin feature/aws-lambda-migration
```

**NO hacer merge a main todavía, primero probar en Railway**

---

**✅ FASE 4 COMPLETADA - Checklist:**
- [ ] Dockerfile simplificado (sin Chrome)
- [ ] Variables AWS configuradas en Railway
- [ ] Código committed a feature branch
- [ ] Pushed a GitHub

---

## FASE 5: TESTING COMPLETO (45-60 min)

### Paso 5.1: Crear PR y Deploy Preview en Railway (15 min)

**Opción A: Railway auto-deploy desde feature branch**

Si Railway está configurado para deployar todas las branches:
1. Railway detectará el push automáticamente
2. Creará deployment preview
3. Esperar 5-10 minutos

**Opción B: Merge a main y deploy**

```bash
# Merge feature branch a main
git checkout main
git merge feature/aws-lambda-migration
git push origin main
```

Railway detectará el push y desplegará automáticamente.

**Monitorear Railway logs:**
https://railway.app/project/perfect-tranquility → View Logs

**Output esperado:**
```
Building...
[+] Building 45.2s
 => [1/4] FROM node:22-slim
 => [2/4] COPY package*.json ./
 => [3/4] RUN npm ci
 => [4/4] COPY . .
Build successful
Deploying...
Deployment successful
✓ Service is running on https://myhost-bizmate-production.up.railway.app
```

---

### Paso 5.2: Verificar Railway Health Check (5 min)

```bash
curl https://myhost-bizmate-production.up.railway.app/api/health
```

**Output esperado:**
```json
{
  "status": "ok",
  "message": "Video generation server is running",
  "mode": "AWS Lambda",
  "timestamp": "2026-02-17T15:45:00.000Z"
}
```

**✅ Si `mode: "AWS Lambda"` → Variables configuradas correctamente**
**❌ Si `mode: "Local (Lambda not configured)"` → Revisar variables en Railway**

---

### Paso 5.3: Test Video Generation desde Vercel Producción (30 min)

**URL:** https://myhost-bizmate.vercel.app

**Pasos:**
1. Login con usuario Gita:
   - Email: gita@example.com (o el email real de Gita)
   - Password: [su password]

2. Ir a Content Studio (AI Video)
   - Debería estar en sidebar o modules

3. Upload imagen de prueba:
   - Usar foto de villa (ej: villa1.jpg)
   - Tamaño recomendado: 1920x1080 o similar

4. Ingresar datos:
   - **Title:** "Nismara Uma Villa Sunset"
   - **Subtitle:** "Luxury Living in Bali"
   - **Music:** Seleccionar "bali-sunrise.mp3"

5. Click "Generate Video"

**Monitorear en paralelo:**
- **Vercel console:** Abrir DevTools → Console tab
- **Railway logs:** https://railway.app/project/perfect-tranquility → View Logs

**Output esperado en Railway logs:**
```
🎬 Video Generation Request Received
📸 Image: 1708185600000-villa1.jpg
🎨 Title: Nismara Uma Villa Sunset
📝 Subtitle: Luxury Living in Bali
🎵 Music: bali-sunrise.mp3
📤 Step 1: Uploading image to Supabase Storage...
✅ Image uploaded: https://jjpscimtxrudtepzwhag.supabase.co/storage/v1/object/public/Nismara%20Uma%20Villas/nismara-pool-1708185610000.jpeg
🚀 Step 2: Rendering video on AWS Lambda...
🔧 Lambda Function: remotion-render-4-0-140-mem3009mb-disk2048mb-120sec
🔧 Serve URL: https://remotion-lambda-abcdef123456.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video
✅ Lambda render completed in 38.5s
📹 Bucket: remotion-lambda-us-east-1-abcdef123456
🆔 Render ID: xyz789abc123
🎬 Video URL: https://remotion-lambda-us-east-1-abcdef123456.s3.amazonaws.com/renders/xyz789abc123/out.mp4
💾 Saving metadata to Supabase...
✅ Metadata saved to Supabase
🎉 Video generation complete!
📹 Video URL: https://remotion-lambda-us-east-1-abcdef123456.s3.amazonaws.com/renders/xyz789abc123/out.mp4
⏱️ Render time: 38.5s
💰 Estimated cost: $0.05
```

**Verificar en frontend:**
- Video URL debe aparecer
- Click en video URL → Se abre en nueva pestaña
- Video debe reproducirse correctamente
- Confirmar título, subtítulo, y música

---

### Paso 5.4: Verificar Supabase Database (10 min)

**Login a Supabase:**
https://supabase.com/dashboard/project/jjpscimtxrudtepzwhag

**Table Editor → generated_videos:**

**Verificar último registro:**
```sql
SELECT * FROM generated_videos
ORDER BY created_at DESC
LIMIT 1;
```

**Campos esperados:**
```
id: auto-generated UUID
user_id: [ID de Gita o NULL]
title: "Nismara Uma Villa Sunset"
subtitle: "Luxury Living in Bali"
video_url: https://remotion-lambda-us-east-1-abcdef123456.s3.amazonaws.com/renders/xyz789abc123/out.mp4
thumbnail_url: https://jjpscimtxrudtepzwhag.supabase.co/storage/v1/object/public/...
filename: xyz789abc123-out.mp4
duration_seconds: 10
resolution: 1920x1080
music_file: bali-sunrise.mp3
status: completed
render_time_seconds: 38.5
created_at: [timestamp]
```

---

### Paso 5.5: Test Múltiples Videos (Opcional) (15 min)

**Generar 3 videos más con diferentes configuraciones:**

**Video 2:**
- Title: "Ocean View Villa"
- Subtitle: "Wake up to paradise"
- Music: bali-sunrise.mp3

**Video 3:**
- Title: "Jungle Retreat"
- Subtitle: "Immerse in nature"
- Music: tropical-vibes.mp3 (si existe)

**Video 4:**
- Title: "Sunset Pool"
- Subtitle: "Relaxation redefined"
- Music: bali-sunrise.mp3

**Verificar:**
- Todos los videos se generan exitosamente
- URLs diferentes para cada video
- Render time consistente (~35-45 segundos)
- Todos guardados en Supabase

---

**✅ FASE 5 COMPLETADA - Checklist:**
- [ ] Railway deployed exitosamente
- [ ] Health check muestra "AWS Lambda" mode
- [ ] Video generation desde Vercel funciona
- [ ] Video URL accesible y reproducible
- [ ] Metadata guardada en Supabase correctamente
- [ ] Múltiples videos generados exitosamente (opcional)

---

## FASE 6: DOCUMENTACIÓN FINAL (30 min)

### Paso 6.1: Actualizar CLAUDE.md (10 min)

**Agregar sección al final de `C:\myhost-bizmate\CLAUDE.md`:**

```markdown
## Video Generation Architecture (Updated Feb 17, 2026)

**Current Implementation:** AWS Lambda + Remotion

### System Flow

1. User uploads image in Content Studio (Vercel frontend)
2. Request sent to Railway Express backend
3. Railway uploads image to Supabase Storage
4. Railway calls AWS Lambda with image URL + metadata
5. Lambda renders video using Remotion (Chrome included)
6. Video saved to S3, metadata to Supabase
7. User receives video URL

### Components

**Vercel (Frontend):**
- React app with Content Studio module
- Environment variables: VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

**Railway (Backend Coordinator):**
- Express server (server.cjs)
- Handles uploads, calls Lambda, saves metadata
- NO video rendering (done by Lambda)
- Environment variables: AWS credentials, Lambda config, Supabase config

**AWS Lambda (Video Renderer):**
- Serverless function with Remotion
- Renders videos on-demand
- Chrome Headless Shell included automatically
- Cost: ~$0.05 per 10-second video

**Supabase (Database + Storage):**
- Table: generated_videos (metadata)
- Bucket: Nismara Uma Villas (images)

### Key Files

- `video/server.cjs` - Express API server
- `video/lambda-render.js` - AWS Lambda integration
- `video/src/LtxPromo.tsx` - Remotion composition
- `video/Dockerfile` - Railway container config (simplified, no Chrome)

### Migration from Railway Local Rendering (Feb 16-17, 2026)

**Why migrated:**
- Railway couldn't install Chrome dependencies correctly
- Remotion officially recommends AWS Lambda
- 4+ hours of debugging Railway with no success

**What changed:**
- Video rendering: Railway local → AWS Lambda serverless
- Dockerfile: 2.5GB with Chrome → 400MB Node-only
- Cost model: $10/month fixed → $0.05 per video

**What stayed the same:**
- Railway Express server (just coordinates now)
- N8N workflows (still on Railway)
- Supabase configuration
- Vercel frontend

**Key commits:**
- `[commit hash]` - feat: Migrate video rendering to AWS Lambda

**Documentation:**
- `Claude AI and Code Update 16022026/RESUMEN_EJECUTIVO_16FEB2026.md`
- `Claude AI and Code Update 16022026/PLAN_DETALLADO_AWS_LAMBDA_MIGRATION.md`
- `Claude AI and Code Update 16022026/ANALISIS_TECNICO_RAILWAY_VS_LAMBDA.md`
```

---

### Paso 6.2: Crear Resumen Final (15 min)

**Crear archivo:**
`C:\myhost-bizmate\Claude AI and Code Update 16022026\RESUMEN_FINAL_AWS_LAMBDA_SUCCESS.md`

Ver contenido en siguiente paso...

---

### Paso 6.3: Cleanup y Commit Final (5 min)

```bash
cd /c/myhost-bizmate

# Eliminar archivos temporales
rm -f video/server.cjs.backup-*
rm -f video/Dockerfile.backup-*
rm -f AWS_CREDENTIALS_PRIVATE.csv  # Nunca commitear esto

# Verificar .gitignore incluye archivos sensibles
cat .gitignore | grep -E "(\.env|AWS_CREDENTIALS)"

# Si no están, agregarlos:
echo "AWS_CREDENTIALS_PRIVATE.csv" >> .gitignore
echo "video/.env" >> .gitignore

# Commit documentación
git add "Claude AI and Code Update 16022026/"
git add CLAUDE.md
git add .gitignore

git commit -m "docs: Complete AWS Lambda migration documentation

- Add executive summary (RESUMEN_EJECUTIVO_16FEB2026.md)
- Add detailed migration plan (PLAN_DETALLADO_AWS_LAMBDA_MIGRATION.md)
- Add technical analysis (ANALISIS_TECNICO_RAILWAY_VS_LAMBDA.md)
- Add final success summary
- Update CLAUDE.md with new architecture
- Update .gitignore for AWS credentials

Video generation now working in production via AWS Lambda.
Railway Chrome dependency issues resolved by using serverless architecture.

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

**✅ FASE 6 COMPLETADA - Checklist:**
- [ ] CLAUDE.md actualizado con nueva arquitectura
- [ ] Resumen final creado
- [ ] .gitignore actualizado
- [ ] Archivos temporales eliminados
- [ ] Documentación committed y pushed

---

## TROUBLESHOOTING

### Problema 1: AWS Lambda render timeout

**Síntoma:**
```
Error: Lambda function timed out after 120 seconds
```

**Soluciones:**
1. Incrementar timeout:
   ```bash
   npx remotion lambda functions deploy --timeout=180
   ```
2. Reducir resolución temporalmente:
   ```javascript
   forceWidth: 1280,
   forceHeight: 720,
   ```

---

### Problema 2: Access Denied en S3

**Síntoma:**
```
Error: Access Denied
```

**Soluciones:**
1. Verificar IAM permissions:
   ```bash
   aws iam get-user
   ```
2. Verificar que el policy `AmazonS3FullAccess` está attached al user

---

### Problema 3: Invalid AWS credentials

**Síntoma:**
```
Error: The security token included in the request is invalid
```

**Soluciones:**
1. Re-configurar AWS CLI:
   ```bash
   aws configure
   ```
2. Verificar credentials no tienen espacios o newlines
3. Regenerar IAM user access key si es necesario

---

### Problema 4: Railway no carga variables

**Síntoma:**
Health check muestra `"mode": "Local (Lambda not configured)"`

**Soluciones:**
1. Verificar variables en Railway dashboard
2. Trigger redeploy:
   ```bash
   git commit --allow-empty -m "chore: Trigger Railway redeploy"
   git push origin main
   ```
3. Verificar no hay typos en variable names

---

### Problema 5: Video no se reproduce

**Síntoma:**
Video URL retorna 403 Forbidden o video no carga

**Soluciones:**
1. Verificar privacy setting en renderMediaOnLambda:
   ```javascript
   privacy: "public",  // NO "private"
   ```
2. Verificar S3 bucket permissions
3. Esperar 1-2 minutos (S3 propagation delay)

---

## ROLLBACK PLAN

**Si algo sale mal y necesitas volver a la versión anterior:**

### Opción A: Revertir código (mantener Railway)

```bash
# Volver a commit antes de Lambda migration
git revert [commit-hash-de-migration]
git push origin main

# Railway auto-desplegará versión anterior
# (Nota: versión anterior tampoco funcionaba con Chrome)
```

---

### Opción B: Usar solo localhost temporalmente

1. En Vercel, cambiar variable:
   ```
   VITE_API_URL = http://localhost:3001
   ```

2. Correr backend localmente:
   ```bash
   cd /c/myhost-bizmate/video
   node server.cjs
   ```

3. Frontend también local:
   ```bash
   cd /c/myhost-bizmate
   npm run dev
   ```

4. Generar videos solo cuando estés en tu computadora

---

### Opción C: Desactivar Content Studio temporalmente

Si es crítico, comentar el módulo en frontend hasta que Lambda esté funcionando.

---

## COSTOS ESPERADOS

### AWS Lambda

**Free Tier (primer año):**
- 1M requests gratis/mes
- 400,000 GB-segundos gratis/mes

**Después de Free Tier:**
- $0.20 por 1M requests
- $0.0000166667 por GB-segundo
- Con 3GB y 40 seg: ~$0.002 por video
- + S3 storage: ~$0.023 por GB/mes

**Estimación para piloto (50 videos/mes):**
- Render: $0.10
- S3 storage: $0.50 (videos + assets)
- **Total: ~$0.60/mes**

**Estimación producción (500 videos/mes):**
- Render: $1.00
- S3 storage: $5.00
- **Total: ~$6.00/mes**

---

## SIGUIENTE PASOS (Post-Implementation)

### Optimizaciones Futuras

1. **Caching de assets:**
   - Almacenar música en S3 en vez de bundlear
   - Reducir tamaño del site deployed

2. **Webhooks:**
   - Lambda puede notificar cuando video está listo
   - Mejor UX (no bloquear request HTTP)

3. **Cost monitoring:**
   - Setup AWS Cost Explorer alerts
   - Dashboard de costos por usuario

4. **Thumbnails automáticos:**
   - Lambda puede generar thumbnail del video
   - Guardar en Supabase junto con video

5. **Multiple compositions:**
   - Templates diferentes para distintos tipos de propiedades
   - Selector en frontend

---

## RECURSOS ADICIONALES

### Documentación Oficial

- **Remotion Lambda:** https://www.remotion.dev/docs/lambda
- **AWS Lambda Pricing:** https://aws.amazon.com/lambda/pricing/
- **AWS S3 Pricing:** https://aws.amazon.com/s3/pricing/

### Community Resources

- **Remotion Discord:** https://remotion.dev/discord
- **AWS Lambda Limits:** https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html

### Contacto Soporte

- **Remotion Support:** support@remotion.dev
- **AWS Support:** Solo con paid plans (Basic = free pero limitado)

---

**FIN DEL PLAN DETALLADO**

**Última actualización:** 16 Febrero 2026, 21:00 PM
**Autor:** Claude Code
**Versión:** 1.0
**Status:** READY FOR IMPLEMENTATION
