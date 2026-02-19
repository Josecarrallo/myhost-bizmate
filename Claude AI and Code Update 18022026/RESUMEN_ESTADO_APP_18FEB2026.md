# ESTADO COMPLETO MY HOST BizMate
## 18 Febrero 2026 — Víspera del Piloto

**Producción:** https://myhost-bizmate.vercel.app
**Backend video:** https://myhost-bizmate-production.up.railway.app
**Branch:** `main`
**Último commit:** `334147d`

---

## 1. QUÉ ES LA APP

MY HOST BizMate es una plataforma de gestión de alquileres vacacionales con IA para propietarios de villas en Bali. Está desplegada en producción y arranca el piloto con Gita (Nismara Uma Villa) el **jueves 19 Feb 2026**.

---

## 2. INFRAESTRUCTURA — DÓNDE ESTÁ TODO

| Servicio | Plataforma | URL / Referencia |
|----------|-----------|-----------------|
| Frontend (React) | **Vercel** | https://myhost-bizmate.vercel.app |
| Backend video | **Railway** | https://myhost-bizmate-production.up.railway.app |
| Base de datos | **Supabase** | https://jjpscimtxrudtepzwhag.supabase.co |
| Render de video | **AWS Lambda** | us-east-1, función: `remotion-render-4-0-423-mem3008mb-disk10240mb-300sec` |
| Storage videos | **AWS S3** | bucket: `remotionlambda-useast1-1w04idkkha` |
| Automatizaciones | **n8n** | https://n8n-production-bb2d.up.railway.app |
| Código fuente | **GitHub** | rama `main` |

---

## 3. MÓDULOS DISPONIBLES EN LA APP

### Operativos y probados ✅
| Módulo | Descripción |
|--------|-------------|
| **Autopilot** | Gestión de tareas operativas, pagos (Done/On Scheduled/Expired), check-in/out |
| **Content Studio** | Generador de videos AI (LTX-2 + AWS Lambda + Remotion) |
| **Properties** | Gestión de propiedades (Nismara Uma Villa activa) |
| **Bookings** | Gestión de reservas |
| **Payments** | Control de pagos |
| **Dashboard** | Overview ejecutivo del propietario |
| **OSIRIS** | AI Assistant conectado a n8n (menú Bizmate AI) |
| **BANYU** | Asistente WhatsApp AI |
| **KORA** | Asistente de voz AI (VAPI) |

### Disponibles pero no prioritarios para el piloto
- Smart Pricing, Reports, Marketing, Reviews, Digital Check-in, Multichannel, etc.

---

## 4. SISTEMA DE VIDEO — ESTADO ACTUAL ✅ FUNCIONANDO

**Flujo completo:**
```
Owner en Vercel → ContentStudio → "Generar Video"
→ POST Railway /api/generate-video
→ Railway sube imagen a Supabase Storage
→ Railway llama AWS Lambda (Remotion)
→ Lambda renderiza 300 frames en 6 chunks paralelos
→ Video MP4 en S3 (~45-60 segundos)
→ Metadata guardada en Supabase tabla generated_videos
→ Owner ve y puede descargar el video
```

**Música disponible actualmente:**
- `background-music.mp3` — música genérica
- `bali-sunrise.mp3` — ambiental Bali

**AWS Lambda — CUOTA APROBADA HOY ✅**
- Límite anterior: 10 ejecuciones concurrentes
- **Límite nuevo: 1000 ejecuciones concurrentes** (aprobado 18 Feb 2026)
- Impacto: ~142 renders simultáneos sin problema

---

## 5. PILOTO JUEVES 19 FEB — GITA (NISMARA UMA VILLA)

**Qué va a usar Gita:**
1. Login en https://myhost-bizmate.vercel.app
2. Autopilot → ManualDataEntry → ver tareas y pagos de su villa
3. Content Studio → generar videos de marketing de Nismara

**Estado para el piloto:**
- ✅ Login funciona en producción
- ✅ Autopilot con datos reales de Nismara en Supabase
- ✅ Video genera y se graba en Supabase
- ✅ AWS Lambda cuota 1000 (puede generar sin límite)
- ✅ Railway activo y estable

**IMPORTANTE — NO TOCAR LA APP HASTA DESPUÉS DEL PILOTO**
El sistema está estable. No hacer cambios hasta que el piloto haya arrancado.

---

## 6. PROBLEMA CRÍTICO DETECTADO — LTX-2 ELIMINADO SIN AUTORIZACIÓN

### Qué pasó (descubierto 18 Feb 2026)

El commit `338faa9` (17 Feb) eliminó la llamada a la API LTX-2 sin autorización.

**Flujo ORIGINAL (correcto):**
```
Imagen → Supabase → LTX-2 Pro API (genera video con movimiento de cámara) → Remotion Lambda (añade overlays) → MP4 final
```

**Flujo ACTUAL (roto):**
```
Imagen → Supabase → Remotion Lambda (imagen estática, sin movimiento) → MP4 final
```

### Qué tiene el video actual
- ✅ Imagen de la villa como fondo
- ✅ Título animado (slide down)
- ✅ Subtítulo con CTA al final
- ✅ Logo/marca en esquina
- ✅ Música de fondo
- ✅ Fade in / fade out
- ❌ **Movimiento de cámara cinematográfico** (zoom lento, paneo suave — generado por LTX-2)

### Decisión tomada
**Piloto 19 Feb con video actual** — funciona, se ve profesional, falta el movimiento.
**Restauración LTX-2 post-piloto** — cuando haya tiempo para hacerlo correctamente sin riesgo.

### Archivos LTX-2 intactos (listos para restaurar)
- `video/scripts/pipeline-image.ts` — llama a `api.ltx.video/v1/image-to-video`
- `video/scripts/image-to-video-cli.mjs` — CLI wrapper
- Variable Railway: `LTX_API_KEY` ✅ ya configurada

### Qué hay que hacer para restaurar (post-piloto)
1. `server.cjs` — reinsertar llamada LTX-2 entre Step 1 (Supabase upload) y Step 2 (Lambda)
2. `video/src/LtxPromo.tsx` — añadir prop `videoUrl` para usar video LTX-2 como base layer (en vez de imagen estática)
3. `lambda-render.cjs` — pasar URL del video LTX-2 a Remotion (actualmente pasa `imageUrl`)
4. Testear en local antes de deploy a Railway

---

## 7. PENDIENTE PARA DESPUÉS DEL PILOTO

### Post-piloto inmediato (por orden de prioridad)
| Tarea | Descripción | Complejidad |
|-------|-------------|-------------|
| **Restaurar LTX-2** | Ver sección 6 — video con movimiento de cámara | Alta |
| **Música nueva** | Añadir 4 tracks de Gita al selector de música | Baja |
| **Video centrado** | Fix UX: el video generado no aparece centrado, hay que hacer scroll | Baja |
| **Fix foto villa** | En Properties → editar villa → adjuntar foto no funciona | Baja-Media |
| **Join videos B** | Seleccionar videos existentes y unirlos con ffmpeg | Media |
| **Join videos C** | Subir 2-3 fotos → video con múltiples escenas cinematográficas | Alta |
| **Suma House** | Añadir tercera villa de Gita al sistema | Media |

### Música pendiente de integrar (archivos en Downloads)
- `audiocoffee-bali-upbeat-motivation-279986.mp3`
- `pocketbeats-nusantara-epic-traditional-music-338865.mp3`
- `u_98673jp944-bali-sunrise-420941.mp3`
- `u_98673jp944-pearl-river-bounce-482924.mp3`

### Pendiente de Gita
- Confirmar opción B, C o ambas para join de videos
- Foto principal de Suma House para crear la villa en Properties
- Evaluación de LTX-2 y Remotion con lista de mejoras deseadas

---

## 8. CÓMO ARRANCAR EL ENTORNO LOCAL

**Terminal 1 — Servidor de video (PowerShell):**
```powershell
cd C:\myhost-bizmate\video
node server.cjs
```

**Terminal 2 — Frontend (PowerShell):**
```powershell
cd C:\myhost-bizmate
npm run dev
```
App disponible en: http://localhost:5173

**NUNCA** usar `pkill` desde WSL. Para matar el puerto 3001:
```powershell
netstat -ano | findstr :3001
taskkill /F /PID [numero]
```

---

## 8. VARIABLES DE ENTORNO — ESTADO

### Vercel
| Variable | Estado |
|----------|--------|
| `VITE_SUPABASE_URL` | ✅ |
| `VITE_API_URL` | ✅ → Railway URL |
| `VITE_OPENAI_API_KEY` | ✅ |
| `VITE_N8N_BASE_URL` | ✅ |

### Railway
| Variable | Estado |
|----------|--------|
| `SUPABASE_URL` | ✅ |
| `SUPABASE_KEY` | ✅ service_role key actualizada |
| `REMOTION_AWS_ACCESS_KEY_ID` | ✅ (workaround — Railway bloquea AWS_ACCESS_KEY_ID) |
| `AWS_SECRET_ACCESS_KEY` | ✅ |
| `AWS_REGION` | ✅ us-east-1 |
| `LTX_API_KEY` | ✅ |

---

## 9. COMMITS CLAVE

| Commit | Descripción |
|--------|-------------|
| `334147d` | fix: generated_videos DB + payment labels + remove video buttons |
| `777d10b` | fix: Supabase service_role key actualizada |
| `cdc42d9` | fix: Lambda chunks paralelos (stuck 93% resuelto) |
| `4b4e969` | fix: REMOTION_AWS_ACCESS_KEY_ID workaround Railway |
| `eebb5a3` | fix: Supabase fallback values (login Vercel) |
| `338faa9` | feat: AWS Lambda video — **NOTA: eliminó llamada LTX-2 sin autorización** (pendiente restaurar) |

---

*Documentación generada con Claude Code — 18 Feb 2026*
