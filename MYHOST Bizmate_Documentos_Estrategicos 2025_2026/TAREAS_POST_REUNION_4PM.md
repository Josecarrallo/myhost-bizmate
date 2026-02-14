# TAREAS POST-REUNIÓN 4PM - 14 FEBRERO 2026

## 🔴 CRÍTICO: Deploy Backend Video Generation

### Problema Actual
- **En portátil**: Content Studio funciona ✅ (localhost:3001)
- **En móvil**: Content Studio da error ❌ "Failed to fetch - Backend server port 3001"
- **Razón**: server.cjs solo corre en localhost, no accesible desde red/producción

### Solución Necesaria
Desplegar backend (server.cjs) a producción para que funcione desde móvil y Vercel.

### Opciones de Deploy:

#### Opción 1: Railway (RECOMENDADA) ⭐
- Más fácil para Node.js backends
- Free tier generoso
- Deploy automático desde GitHub
- Soporta variables de entorno (LTX_API_TOKEN)

#### Opción 2: Vercel Serverless Functions
- Todo en un solo lugar (frontend + backend)
- Requiere convertir server.cjs a API Routes
- Limitaciones de tiempo de ejecución (10s en free tier, puede ser poco para video generation)

#### Opción 3: Render
- Similar a Railway
- Free tier disponible
- Buena opción alternativa

### Pasos a Realizar (DESPUÉS DE LA REUNIÓN):

1. **Preparar server.cjs para producción**
   - Configurar variables de entorno
   - Actualizar CORS para permitir dominio de Vercel
   - Añadir health checks

2. **Deploy a Railway/Render**
   - Crear cuenta
   - Conectar repositorio GitHub
   - Configurar variables de entorno:
     - `LTX_API_TOKEN`
     - Credenciales de Supabase
   - Deploy automático

3. **Actualizar ContentStudio.jsx**
   - Cambiar `http://localhost:3001` por URL de producción
   - Ejemplo: `https://myhost-bizmate-api.up.railway.app`

4. **Probar desde móvil**
   - Verificar que Content Studio funciona
   - Generar video de prueba
   - Confirmar que se guarda en Supabase

### Archivos Involucrados
- `server.cjs` - Backend Express API
- `src/components/ContentStudio/ContentStudio.jsx` - Frontend (cambiar URL)
- `video/scripts/pipeline-image.ts` - Script de generación LTX-2
- `video/scripts/upload-to-supabase.js` - Upload de imágenes

### Tiempo Estimado
- 30-45 minutos para setup completo
- 10 minutos para pruebas

---

## 📝 Otras Tareas Pendientes

De tu TODO list:
4. ⏳ Probar MyHost Bizmate AUTO PILOT
5. ⏳ Probar OSIRIS y obtener URL
6. ⏳ Deploy a Vercel del sistema actualizado (DESPUÉS de arreglar backend)
7. ⏳ Probar desde móvil después del deploy
8. ⏳ Implementar módulo Availability & Channels
9. ⏳ Implementar módulo Maintenance & Tasks

---

## 🎯 PRIORIDAD DESPUÉS DE REUNIÓN

1. **Deploy Backend** (crítico para que video generation funcione en producción)
2. **Deploy Frontend a Vercel** (solo después de tener backend funcionando)
3. **Probar desde móvil**
4. **Continuar con resto de tareas**

---

**Creado**: 14 Feb 2026, antes de reunión 4PM
**Estado**: Documentado para ejecución post-reunión
