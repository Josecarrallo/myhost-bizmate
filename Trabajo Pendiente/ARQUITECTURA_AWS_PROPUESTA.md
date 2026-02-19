# Propuesta: Nueva Arquitectura AWS Limpia
## Documento creado: 18 Febrero 2026

---

## PROBLEMA CON LA ARQUITECTURA ACTUAL

La arquitectura actual es funcional pero surgio de solucionar problemas uno a uno, no de un diseno planificado. Tiene 4 servicios para hacer una sola tarea:

```
ARQUITECTURA ACTUAL (funciona pero es una chapuza):

Navegador (Vercel)
    │
    ▼
RAILWAY (Express server) ← servidor 24/7, pagando siempre aunque no se use
    │
    ├─ Sube imagen a S3
    │
    ├─ Llama a LTX-2 API → guarda video en disco Railway
    │
    ├─ Sube video LTX-2 a S3
    │
    └─ Llama a AWS Lambda (Remotion)
              │
              ▼
         S3 (video final)
```

### Problemas identificados

| Problema | Impacto |
|----------|---------|
| Railway es un servidor 24/7 pagando aunque no se generen videos | Coste innecesario |
| Railway bloquea `AWS_ACCESS_KEY_ID` → workaround con `REMOTION_AWS_ACCESS_KEY_ID` | Complejidad artificial |
| 4 servicios distintos coordinandose → multiples puntos de fallo | Fragilidad |
| LTX-2 guarda video en disco de Railway → no escala | Limitacion arquitectural |
| Dependencia de Supabase Storage para imagenes (bucket con espacios, HTTP 400) | Bug ya corregido pero sintoma del problema |

---

## ARQUITECTURA PROPUESTA: TODO EN AWS

```
ARQUITECTURA OBJETIVO (limpia):

Navegador (Vercel)
    │
    │ 1. POST /api/generate-video (con foto adjunta)
    ▼
AWS LAMBDA "orchestrator" (nueva funcion)
    │
    │ 2. Sube foto a S3 → URL publica
    │    s3://remotionlambda.../images/foto.jpeg
    │
    │ 3. Llama a LTX-2 Pro API con URL de S3
    │    → Recibe video MP4 (~80s, ~11MB)
    │
    │ 4. Sube video LTX-2 a S3
    │    s3://remotionlambda.../ltx-videos/ltx.mp4
    │
    │ 5. Llama a Lambda Remotion con ltxVideoUrl
    │    → Renderiza video final con overlays (~55s)
    │
    │ 6. Guarda metadata en Supabase
    │
    └─> Devuelve URL del video final al navegador
              │
              ▼
         S3 (video final)
         s3://remotionlambda.../renders/{id}/out.mp4
```

---

## COMPARATIVA

| Aspecto | Arquitectura Actual | Arquitectura Propuesta |
|---------|--------------------|-----------------------|
| Servicios | 4 (Vercel + Railway + AWS + Supabase Storage) | 2 (Vercel + AWS) |
| Servidor 24/7 | Railway (siempre encendido) | No — Lambda paga solo cuando se usa |
| Coste mensual Railway | ~$5-20/mes | $0 (eliminado) |
| Puntos de fallo | 4 servicios | 2 servicios |
| Workarounds | `REMOTION_AWS_ACCESS_KEY_ID` | No necesarios |
| Escalabilidad | Limitada por disco Railway | Ilimitada (Lambda escala solo) |
| Tiempo total video | ~2.5 min | ~2.5 min (igual) |

---

## PLAN DE IMPLEMENTACION

### Requisitos previos
- La arquitectura actual funciona → NO tocar hasta tener la nueva probada
- Hacer en rama separada: `feature/aws-only-architecture`
- Railway se mantiene para n8n y otros servicios (solo se elimina del flujo de video)

### Paso 1: Crear Lambda "orchestrator"
Nueva funcion Lambda (distinta a la de Remotion) que:
- Recibe la foto via API Gateway (multipart/form-data o base64)
- Ejecuta los pasos 2-6 del flujo propuesto
- Timeout: 5 minutos (suficiente para LTX-2 + Remotion)
- Memoria: 1024 MB (no necesita Chrome, eso lo hace la Lambda de Remotion)

### Paso 2: Exponer via API Gateway
- Crear endpoint HTTP: `POST https://xxxxx.execute-api.us-east-1.amazonaws.com/generate-video`
- Cambiar `VITE_API_URL` en Vercel para apuntar a API Gateway en vez de Railway

### Paso 3: Actualizar ContentStudio.jsx
- Cambiar la llamada fetch para enviar la foto como base64 o via presigned S3 URL
- El resto del componente no cambia

### Paso 4: Pruebas
- Probar en local primero simulando la Lambda con el script `test-full-flow.cjs`
- Desplegar Lambda orchestrator
- Verificar en produccion

### Paso 5: Deprecar Railway del flujo de video
- Mantener Railway activo para n8n
- Eliminar las rutas de video de `server.cjs` de Railway

---

## PROBLEMA TECNICO A RESOLVER

**Lambda tiene limite de payload de 6MB** para peticiones HTTP directas via API Gateway.

Una foto de villa puede ser >6MB. Soluciones:

**Opcion A (recomendada): Presigned S3 URL**
1. Frontend pide a Lambda una URL de subida temporal (presigned URL)
2. Frontend sube la foto directamente a S3 desde el navegador
3. Frontend llama a Lambda con la S3 key (no con la foto)
4. Lambda procesa desde S3

**Opcion B: Base64 + chunking**
Mas complejo, no recomendada.

**Opcion C: Mantener Railway solo para recibir la foto**
Railway recibe la foto y la sube a S3, luego llama a Lambda orchestrator.
Reduce Railway a una responsabilidad minima (proxy de subida).

---

## CUANDO IMPLEMENTAR

**NO antes del piloto con Gita (19 Feb 2026).**

El sistema actual funciona. Este cambio es una mejora de arquitectura, no una correccion urgente.

**Momento recomendado:** Despues de recibir feedback del piloto, cuando el equipo este disponible para 2-3 dias de trabajo sin presion.

**Estimacion:** 2-3 dias de desarrollo + 1 dia de pruebas.

---

*Documento creado: 18 Febrero 2026*
*Autor: Claude Code*
