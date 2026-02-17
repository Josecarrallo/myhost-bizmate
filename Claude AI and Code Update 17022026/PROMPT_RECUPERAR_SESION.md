# Prompt para Recuperar Sesión - 17 Febrero 2026

Copia y pega este texto al inicio de una nueva sesión con Claude Code:

---

## CONTEXTO DE SESIÓN - MYHOST BIZMATE

Estoy trabajando en `C:\myhost-bizmate` (branch `main`, commit `338faa9`).

### ESTADO ACTUAL DEL SISTEMA

Todo el código está commiteado y desplegado en Vercel:
`https://myhost-bizmate-b0mqtyquc-jose-carrallos-projects.vercel.app`

El sistema de video funciona en local. Necesito verificar que funciona en producción (Vercel → Railway → AWS Lambda).

### ARQUITECTURA DE VIDEO

```
Owner en Vercel → Railway (server.cjs) → AWS Lambda → S3
```

- Railway ya está desplegado con el código actualizado (commit 338faa9)
- AWS Lambda: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` (us-east-1)
- S3 bucket: `remotionlambda-useast1-1w04idkkha`
- S3 path de salida: `renders/{renderId}/out.mp4` (IMPORTANTE: incluye prefijo `renders/`)

### BUGS CORREGIDOS HOY (ya en producción)

1. ContentStudio.jsx: URL del video ya no concatena `localhost:3001` delante de URL S3
2. lambda-render.cjs: URL S3 ahora incluye prefijo `renders/`
3. ManualDataEntry.jsx: filtro paid/pending ahora filtra correctamente
4. generateReportHTML.js + Autopilot.jsx: fechas del Business Report ahora son dinámicas

### PENDIENTE VERIFICAR

1. **TEST PRODUCCIÓN**: Abrir Vercel, ir a Content Studio, generar video → debe funcionar sin el portátil local
2. **Supabase service_role key**: en `video/lambda-render.cjs` la clave está expirada. Falla el guardado de metadata pero el video sí funciona. Cuando quieras arreglarlo: Supabase Dashboard → Settings → API → copiar service_role key → añadir a `video/.env` como `SUPABASE_SERVICE_KEY` y actualizar en Railway

### CÓMO ARRANCAR ENTORNO LOCAL (si es necesario)

Desde PowerShell (NO WSL):
```powershell
# Terminal 1
cd C:\myhost-bizmate\video
node server.cjs

# Terminal 2
cd C:\myhost-bizmate
npm run dev
```

Si el puerto 3001 está bloqueado:
```powershell
netstat -ano | findstr :3001
taskkill /F /PID [numero_del_pid]
```

### INFRAESTRUCTURA AWS

- Región: `us-east-1`
- Lambda: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec`
- S3: `remotionlambda-useast1-1w04idkkha`
- Remotion site: `https://remotionlambda-useast1-1w04idkkha.s3.us-east-1.amazonaws.com/sites/myhost-bizmate-video/index.html`
- Cuota Lambda: 10 (caso AWS #177130113800974 pendiente de aumento a 1000)

### DOCUMENTACIÓN DE REFERENCIA

- `Claude AI and Code Update 17022026/RESUMEN_EJECUTIVO_17FEB2026.md` - estado completo del día
