# Prompt para Recuperar Sesión - 19 Febrero 2026 (Actualizado noche)

Copia y pega este texto al inicio de una nueva sesión con Claude Code:

---

## CONTEXTO DE SESIÓN - MYHOST BIZMATE

Estoy trabajando en `C:\myhost-bizmate` (branch `main`, commit `c92ce15`).

### ESTADO ACTUAL DEL SISTEMA

Todo el código está commiteado y desplegado. Último commit: `c92ce15`.

**Producción:** https://myhost-bizmate.vercel.app

### LO QUE SE HIZO HOY (19 Feb 2026)

#### SESIÓN MAÑANA (commits `afd72b1` → `1f9b953`)
1. **Tasks (Manual Data Entry)** — fix `action_type`→`task_type`, tabla `table-fixed`, Edit + Delete task
2. **Payments** — botón delete móvil y desktop
3. **My Data Export** — HTML Print, Excel (.xlsx 5 hojas), CSV (5 ficheros), currency auto IDR/USD
4. **Bali Booking Sheet** — Excel automático con formato exacto de Gita, selector año/villa

#### SESIÓN TARDE (commit `69402ac`)
5. **Tasks móvil** — cards en móvil (`block md:hidden`) + tabla en desktop (`hidden md:block`), Load More
6. **Autopilot Maintenance & Tasks** — datos reales de Supabase (antes hardcodeados 5,2,3,1)
7. **video/server.cjs** — CORS acepta cualquier `localhost:*` (antes solo 5173, rompía en 5174)
8. **video/lambda-render.cjs** — timeout 8 min en polling loop (antes infinito); progress display correcto

#### SESIÓN NOCHE — FIXES CRÍTICOS VIDEO (commits `e4f84c5`, `c92ce15`)
9. **Fix cameraPrompt** — cliente enviaba `cameraPrompt`, servidor leía `cameraMovement` → ahora acepta ambos
10. **Fix video sin movimiento desde Vercel** — `LTX_API_KEY` en Railway tenía whitespace embebido → `process.env.LTX_API_KEY?.replace(/\s+/g, '')` ✅ CONFIRMADO FUNCIONANDO

### PRÓXIMA SESIÓN — PRIORITARIO (PILOTO GITA EMPIEZA MAÑANA)

**TAREA CRÍTICA: Migración Railway → AWS API Gateway**

Arquitectura actual (problemática):
```
Vercel → Railway (server.cjs) → Lambda → S3
```

Arquitectura objetivo:
```
Vercel → API Gateway (AWS) → Lambda → S3
```

**Por qué es urgente:**
- Gita es la primera usuaria del piloto (creadora de contenido)
- La arquitectura Railway tiene demasiados puntos de fallo (env vars corrompidas, CORS, bloqueó AWS_ACCESS_KEY_ID)
- Hoy perdimos horas por un whitespace en una variable de Railway

**Plan de migración:**
1. Crear Lambda function nueva que reciba la imagen + parámetros directamente
2. Configurar API Gateway con endpoint POST + CORS
3. Actualizar `ContentStudio.jsx` para llamar a API Gateway en vez de Railway
4. Eliminar Railway del flujo

### HALLAZGOS TÉCNICOS IMPORTANTES

- **Tabla `villas`**: NO tiene `tenant_id`. Filtrar por `currency`: IDR=Gita, USD=Jose
- **Tabla `bookings`**: campo precio = `total_price`. PAX = `guests`
- **Tabla `payments`**: Vacía. Datos de pago en `bookings.payment_status` y `bookings.total_price`
- **Tabla `tasks`**: Categoría = `task_type` (no `action_type`)
- **Gita tenant_id**: `1f32d384-4018-46a9-a6f9-058217e6924a`
- **Gita villas IDR**: b1=Nismara 1BR, b2=Graha Uma 3BR, b3=NISMARA 2BR POOL (b2 sin bookings)

### ARQUITECTURA DE VIDEO ACTUAL (Railway — migrar a AWS pronto)

```
Vercel (React) → Railway (server.cjs) → LTX-2 API → S3 → AWS Lambda (Remotion) → S3
```

- Railway URL: https://myhost-bizmate-production.up.railway.app
- Lambda: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` (us-east-1)
- S3: `remotionlambda-useast1-1w04idkkha` → `renders/{renderId}/out.mp4`
- LTX-2 video → S3: `ltx-videos/ltx-{ts}.mp4`
- Cuota Lambda: aprobada (caso AWS #177130113800974, aumento a 1000 concurrente)
- `VITE_API_URL` en Vercel = `https://myhost-bizmate-production.up.railway.app`

### REGLA IMPORTANTE
NO hacer commit sin aprobación explícita del usuario. Mostrar siempre el diff/cambio primero, esperar "sí" antes de commitear.

### CÓMO ARRANCAR ENTORNO LOCAL

```powershell
# Terminal 1 — Frontend
cd C:\myhost-bizmate
npm run dev
# → http://localhost:5173 (o 5174 si 5173 ocupado)

# Terminal 2 — Video server (solo para ContentStudio)
cd C:\myhost-bizmate\video
node server.cjs
# IMPORTANTE: arrancar SIEMPRE desde video/ para cargar el .env correcto
```

### DOCUMENTACIÓN DE REFERENCIA

- `Claude AI and Code Update 19022026/RESUMEN_EJECUTIVO_19FEB2026.md`
- `Claude AI and Code Update 19022026/INFORME_TECNICO_COMPLETO_19FEB2026.md`
