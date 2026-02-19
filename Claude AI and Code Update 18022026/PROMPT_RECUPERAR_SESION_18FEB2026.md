# Prompt para Recuperar Sesion - 18 Febrero 2026

Copia y pega este texto al inicio de una nueva sesion con Claude Code:

---

## CONTEXTO DE SESION - MYHOST BIZMATE

Estoy trabajando en `C:\myhost-bizmate` (branch `main`, ultimo commit `409f96e`).

### ESTADO ACTUAL DEL SISTEMA

El sistema de video funciona completamente con LTX-2 restaurado.
Ultimo piloto con Gita (Nismara Uma Villa) en progreso.

**URLs:**
- Frontend local: http://localhost:5173
- Vercel: https://myhost-bizmate.vercel.app
- Railway: https://myhost-bizmate-production.up.railway.app

### ARQUITECTURA DE VIDEO (FUNCIONANDO)

```
Foto → Railway → S3 (imagen) → LTX-2 Pro (video cinematico ~80s)
→ S3 (video LTX-2) → AWS Lambda/Remotion (titulo+musica ~55s)
→ S3 (video final) → ContentStudio muestra con auto-scroll
```

### COMO ARRANCAR ENTORNO LOCAL

Desde PowerShell (NO WSL):
```powershell
# Terminal 1 - Video server
cd C:\myhost-bizmate\video
node server.cjs

# Terminal 2 - Frontend
cd C:\myhost-bizmate
npm run dev
```

Si el puerto 3001 esta bloqueado:
```powershell
netstat -ano | findstr :3001
taskkill /F /PID [numero_del_pid]
```

### INFRAESTRUCTURA AWS

- Region: `us-east-1`
- Lambda: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec`
- S3 bucket: `remotionlambda-useast1-1w04idkkha`
- Concurrencia Lambda: 1000 (aprobada 18 Feb 2026)
- LTX-2 API: `https://api.ltx.video/v1/image-to-video` (model: `ltx-2-pro`)

### VARIABLES DE ENTORNO RAILWAY

| Variable | Estado |
|----------|--------|
| `REMOTION_AWS_ACCESS_KEY_ID` | SET (workaround Railway bloquea `AWS_ACCESS_KEY_ID`) |
| `AWS_SECRET_ACCESS_KEY` | SET |
| `AWS_REGION` | SET (us-east-1) |
| `LTX_API_KEY` | SET |
| `SUPABASE_URL` | SET |
| `SUPABASE_KEY` | SET (service_role) |

### ARCHIVOS CLAVE

| Archivo | Funcion |
|---------|---------|
| `video/server.cjs` | Express server Railway - orquesta todo el pipeline |
| `video/lambda-render.cjs` | Llama a AWS Lambda con Remotion |
| `video/src/LtxPromo.tsx` | Composicion Remotion - video LTX-2 + overlays |
| `src/components/ContentStudio/ContentStudio.jsx` | UI del generador de video |

### PENDIENTE POST-PILOTO (en orden)

1. Nueva arquitectura AWS (eliminar Railway del flujo de video)
2. Aspect ratio 9:16 (Instagram Reels/TikTok)
3. Biblioteca de musica (4 tracks de Gita)
4. Presets de duracion (10s/15s/30s)
5. Scene templates
6. Suma House (3ra villa de Gita)

### DOCUMENTACION DE REFERENCIA

- `Claude AI and Code Update 18022026/RESUMEN_EJECUTIVO_18FEB2026.md` - estado completo del dia
- `Claude AI and Code Update 18022026/ARQUITECTURA_AWS_PROPUESTA.md` - plan arquitectura AWS detallado:
  - Lambda 1: `video/lambda-ltx2.cjs` — LTX-2 orchestrator (foto → video cinematico)
  - Lambda 2: `video/lambda-render.cjs` — Remotion render (video LTX-2 → video final con overlays)
  - Endpoints: `POST /api/start-video-job` y `POST /api/render-final-video`
  - Helper: `video/aws-lambdas.js` con `callLtxLambda()` y `callRemotionLambda()`
  - Supabase tabla `videos` con estados: pending → ltx_done → rendered → failed
  - **IMPLEMENTAR POST-PILOTO (despues del 19 Feb 2026)**
