# 🎬 MY HOST BIZMATE - VIDEO MARKETING

Este módulo contiene toda la infraestructura de Remotion para generar videos de marketing profesionales.

## 📁 ESTRUCTURA

```
video/
├── src/
│   ├── index.ts              # Entry point
│   ├── Root.tsx              # Compositions registry
│   ├── HelloWorld.tsx        # Demo video
│   ├── StatsVideo.tsx        # Statistics showcase
│   └── PropertyShowcase.tsx  # Property promotion
├── out/                      # Rendered videos (gitignored)
├── public/                   # Assets (images, fonts)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── remotion.config.ts        # Remotion settings
└── README.md                 # This file
```

---

## 🚀 INSTALACIÓN

### Paso 1: Instalar dependencias

```bash
cd video
npm install
```

Esto instalará:
- `remotion` - Framework core
- `@remotion/cli` - CLI tools
- `@remotion/bundler` - Build tools
- `react` & `react-dom` - UI framework
- `typescript` - Type safety

### Paso 2: Verificar instalación

```bash
npm run dev
```

Si todo está correcto, se abrirá el Remotion Studio en tu navegador.

---

## 🎥 VIDEOS DISPONIBLES

### 1. HelloWorld
**Descripción:** Video de bienvenida simple con animaciones
**Duración:** 5 segundos (150 frames @ 30fps)
**Resolución:** 1920x1080 (Full HD)

**Props personalizables:**
- `titleText`: Texto del título
- `titleColor`: Color del título

### 2. StatsVideo
**Descripción:** Muestra estadísticas de bookings con animaciones contadores
**Duración:** 10 segundos (300 frames @ 30fps)
**Resolución:** 1920x1080 (Full HD)

**Props personalizables:**
- `totalBookings`: Total de reservas
- `totalRevenue`: Revenue total
- `airbnbBookings`: Reservas de Airbnb
- `bookingComBookings`: Reservas de Booking.com
- `directBookings`: Reservas directas

**Datos actuales (GITA):**
```json
{
  "totalBookings": 41,
  "totalRevenue": 140709985,
  "airbnbBookings": 34,
  "bookingComBookings": 3,
  "directBookings": 3
}
```

### 3. PropertyShowcase
**Descripción:** Showcase de una propiedad con features
**Duración:** 15 segundos (450 frames @ 30fps)
**Resolución:** 1920x1080 (Full HD)

**Props personalizables:**
- `propertyName`: Nombre de la villa
- `location`: Ubicación
- `bedrooms`: Número de habitaciones
- `price`: Precio por noche

---

## 💻 COMANDOS

### Desarrollo

```bash
# Abrir Remotion Studio (preview en vivo)
npm run dev
```

**Esto abre:** http://localhost:3000
- Editor visual de videos
- Preview en tiempo real
- Ajuste de props
- Timeline interactivo

---

### Renderizar Videos

#### Renderizar video simple
```bash
npm run render
```
Output: `out/video.mp4`

#### Renderizar video de estadísticas
```bash
npm run render:stats
```
Output: `out/stats.mp4`

#### Renderizar showcase de propiedad
```bash
npm run render:property
```
Output: `out/property.mp4`

---

### Renderizado Avanzado

#### Renderizar con props personalizados
```bash
npx remotion render StatsVideo out/custom-stats.mp4 \
  --props='{"totalBookings":50,"totalRevenue":200000000}'
```

#### Renderizar en diferentes formatos
```bash
# MP4 (default)
npx remotion render HelloWorld out/video.mp4

# WebM
npx remotion render HelloWorld out/video.webm --codec=vp8

# GIF
npx remotion render HelloWorld out/video.gif --codec=gif

# PNG sequence
npx remotion render HelloWorld out/frames --codec=png
```

#### Renderizar con calidad custom
```bash
# Alta calidad (file size mayor)
npx remotion render HelloWorld out/hq.mp4 --crf=18

# Baja calidad (file size menor)
npx remotion render HelloWorld out/lq.mp4 --crf=28
```

**CRF values:**
- 18 = Excelente calidad (grande)
- 23 = Alta calidad (default)
- 28 = Buena calidad (pequeño)

#### Renderizar rango específico de frames
```bash
# Solo primeros 3 segundos (0-90 frames @ 30fps)
npx remotion render HelloWorld out/short.mp4 --frames=0-90
```

#### Renderizar con concurrencia
```bash
# Más rápido (usa más CPU)
npx remotion render StatsVideo out/fast.mp4 --concurrency=8
```

---

## 🎨 PERSONALIZACIÓN

### Cambiar datos del video de stats

Edita `src/Root.tsx`:

```tsx
<Composition
  id="StatsVideo"
  component={StatsVideo}
  defaultProps={{
    totalBookings: 41,        // ← Cambia aquí
    totalRevenue: 140709985,  // ← O aquí
    airbnbBookings: 34,
    bookingComBookings: 3,
    directBookings: 3,
  }}
/>
```

### Cambiar resolución

Edita `src/Root.tsx`:

```tsx
<Composition
  id="StatsVideo"
  width={1920}    // ← Ancho en px
  height={1080}   // ← Alto en px
  fps={30}        // ← Frames por segundo
  durationInFrames={300}  // ← Duración total
/>
```

**Resoluciones comunes:**
- 1920x1080 (Full HD) - YouTube, Facebook
- 1080x1920 (Vertical) - Instagram Stories, TikTok
- 1280x720 (HD) - Web
- 1080x1080 (Square) - Instagram Feed

### Cambiar duración

```tsx
durationInFrames={150}  // 5 segundos @ 30fps
durationInFrames={300}  // 10 segundos @ 30fps
durationInFrames={900}  // 30 segundos @ 30fps
```

**Fórmula:** `frames = segundos * fps`

---

## 🖼️ AGREGAR IMÁGENES

### Paso 1: Agregar imagen a carpeta public

```
video/public/
└── images/
    ├── villa1.jpg
    ├── villa2.jpg
    └── logo.png
```

### Paso 2: Usar en componente

```tsx
import { Img, staticFile } from "remotion";

<Img
  src={staticFile("images/villa1.jpg")}
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }}
/>
```

---

## 🎵 AGREGAR AUDIO

### Paso 1: Agregar audio a public

```
video/public/
└── audio/
    ├── background-music.mp3
    └── voice-over.wav
```

### Paso 2: Usar en componente

```tsx
import { Audio, staticFile } from "remotion";

<Audio
  src={staticFile("audio/background-music.mp3")}
  volume={0.5}
/>
```

---

## 🔧 CONFIGURACIÓN AVANZADA

### remotion.config.ts

```typescript
import { Config } from "@remotion/cli/config";

// Formato de imágenes temporales
Config.setVideoImageFormat("jpeg");  // o "png"

// Sobrescribir output sin preguntar
Config.setOverwriteOutput(true);

// Concurrencia (número de cores)
Config.setConcurrency(4);

// Formato de pixel (para compatibilidad)
Config.setPixelFormat("yuv420p");

// Codec por default
Config.setCodec("h264");
```

---

## 📊 INTEGRACIÓN CON SUPABASE

### Ejemplo: Video dinámico con datos de Supabase

Crea `src/DynamicStatsVideo.tsx`:

```tsx
import { useEffect, useState } from "react";
import { continueRender, delayRender } from "remotion";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jjpscimtxrudtepzwhag.supabase.co",
  "YOUR_ANON_KEY"
);

export const DynamicStatsVideo = () => {
  const [handle] = useState(() => delayRender());
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .eq("tenant_id", "TENANT_ID");

      // Calculate stats
      const stats = {
        totalBookings: bookings.length,
        totalRevenue: bookings.reduce((sum, b) => sum + b.total_price, 0),
      };

      setData(stats);
      continueRender(handle);
    };

    fetchData();
  }, [handle]);

  if (!data) {
    return null;
  }

  // Render with real data
  return <StatsVideo {...data} />;
};
```

---

## 🚨 TROUBLESHOOTING

### Error: "Cannot find module 'remotion'"
```bash
cd video
npm install
```

### Error: "Port 3000 is already in use"
```bash
# Usar otro puerto
npx remotion studio --port=3001
```

### Error: "ffmpeg not found"
Remotion requiere FFmpeg. Instalación:

**Windows:**
```bash
# Con Chocolatey
choco install ffmpeg

# O descargar de: https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Video se ve pixelado
Ajusta el CRF (menor = mejor calidad):
```bash
npx remotion render HelloWorld out/hq.mp4 --crf=18
```

### Renderizado muy lento
Reduce concurrencia:
```bash
npx remotion render HelloWorld out/video.mp4 --concurrency=2
```

O reduce resolución temporalmente:
```tsx
width={1280}   // En vez de 1920
height={720}   // En vez de 1080
```

---

## 📦 DEPLOYMENT

### Remotion Lambda (AWS)

Para renderizar en la nube:

```bash
# Instalar
npm i @remotion/lambda

# Deploy
npx remotion lambda sites create src/index.ts --site-name=myhost-videos

# Render en AWS
npx remotion lambda render <site-id> StatsVideo
```

**Ventajas:**
- Renderizado paralelo
- Muy rápido
- Sin bloquear tu computadora

**Costo:** ~$0.01-0.05 por video (depende de duración)

---

## 🎯 WORKFLOWS RECOMENDADOS

### Workflow 1: Preview rápido
```bash
# 1. Abrir studio
npm run dev

# 2. Ajustar props en UI
# 3. Ver cambios en tiempo real
# 4. Cuando esté listo, renderizar
```

### Workflow 2: Renderizado en batch
```bash
# Script: render-all.sh
npx remotion render HelloWorld out/hello.mp4
npx remotion render StatsVideo out/stats.mp4
npx remotion render PropertyShowcase out/showcase.mp4
```

### Workflow 3: Video mensual automatizado

Crea script `monthly-video.js`:

```javascript
import { execSync } from "child_process";

// Get month stats from Supabase
const stats = await getMonthlyStats();

// Render with stats
execSync(
  `npx remotion render StatsVideo out/monthly-${new Date().toISOString()}.mp4 --props='${JSON.stringify(stats)}'`
);
```

---

## 📖 RECURSOS

### Documentación oficial
- **Remotion Docs:** https://remotion.dev/docs
- **API Reference:** https://remotion.dev/docs/api
- **Examples:** https://github.com/remotion-dev/remotion/tree/main/packages/example

### Tutoriales
- **Getting Started:** https://remotion.dev/docs/
- **Animation Guide:** https://remotion.dev/docs/animating-properties
- **Audio Guide:** https://remotion.dev/docs/using-audio

### Community
- **Discord:** https://remotion.dev/discord
- **GitHub Discussions:** https://github.com/remotion-dev/remotion/discussions

---

## 🔄 PRÓXIMAS MEJORAS

### Corto plazo
- [ ] Agregar más templates de video
- [ ] Integrar imágenes reales de villas
- [ ] Agregar música de fondo
- [ ] Crear video de "Monthly Report"

### Mediano plazo
- [ ] Video de bienvenida para nuevos guests
- [ ] Video de instrucciones de check-in
- [ ] Timelapse de occupancy
- [ ] Video promocional multi-property

### Largo plazo
- [ ] Setup de Remotion Lambda para renderizado en la nube
- [ ] Generación automática de videos mensuales
- [ ] A/B testing de diferentes estilos
- [ ] Videos personalizados por cliente

---

## 📞 SOPORTE

**Desarrollado por:** Claude Code
**Fecha:** 8 de febrero de 2026
**Versión:** 1.0.0

**Preguntas:** Ver documentación principal en `C:\myhost-bizmate\Claude AI and Code Update 08022026\`

---

**¡Listo para crear videos de marketing profesionales! 🎬**
