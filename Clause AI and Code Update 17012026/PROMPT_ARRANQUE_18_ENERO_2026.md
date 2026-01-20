# PROMPT DE ARRANQUE - 18 ENERO 2026
## MY HOST BizMate - Continuar Desarrollo

---

# 🚀 CONTEXTO RÁPIDO

Estoy continuando el desarrollo de **MY HOST BizMate**, un sistema de gestión hotelera con IA integrada.

**Última sesión:** Viernes 17 Enero 2026
**Branch activo:** `backup-antes-de-automatizacion`
**Estado:** Todo commiteado y pusheado a GitHub ✅

---

# 📊 ESTADO ACTUAL DEL PROYECTO

## ✅ Completado (Sesión 17 ENE):

1. **Properties** - 100% con datos reales de Supabase
2. **Dashboard AI Agents** - LUMINA, BANYU, KORA, OSIRIS con stats reales
3. **Bookings** - Nombres reales de propiedades
4. **Payments** - Scroll arreglado + datos completos
5. **Messages** - Transformado en **Inbox Unificado Multi-Canal**
   - Tabs: All, WhatsApp, Email, Voice/VAPI, SMS
   - Filtrado funcional por canal
   - Badges visuales

## 📁 Documentación Actualizada:

Lee estos archivos ANTES de empezar:

1. **Estado completo del proyecto:**
   - `C:\myhost-bizmate\Clause AI and Code Update 17012026\ESTADO_PROYECTO_17_ENERO_2026.md`

2. **Schema de Supabase:**
   - `C:\myhost-bizmate\Clause AI and Code Update 17012026\SUPABASE_SCHEMA_DOCUMENTATION.md`

3. **CLAUDE.md principal:**
   - `C:\myhost-bizmate\CLAUDE.md`

---

# 🎯 TAREAS PRIORITARIAS PARA HOY

## 1️⃣ ALTA PRIORIDAD - Migrar Calendar

**Objetivo:** Mostrar bookings reales en vista de calendario

**Pasos:**
1. Leer `src/components/PMSCalendar/PMSCalendar.jsx`
2. Verificar si ya usa datos reales o mock
3. Si usa mock:
   - Crear función en `src/services/data.js` para cargar bookings por mes
   - Mapear bookings a eventos de calendario
   - Color-code por estado (confirmed, pending, checked-in, checked-out)
4. Mostrar nombres reales de propiedades
5. Agregar tooltips con detalles del booking

**Estimación:** 45-60 minutos

---

## 2️⃣ ALTA PRIORIDAD - Migrar Guests/CRM

**Objetivo:** Mostrar lista de huéspedes con historial

**Pasos:**
1. Leer `src/components/Guests/Guests.jsx`
2. Verificar tabla `guest_contacts` en Supabase
3. Si existe:
   - Crear función `dataService.getGuests()`
   - Mostrar lista con búsqueda/filtros
   - Agregar historial de bookings por huésped
4. Si NO existe:
   - Extraer guests únicos de `bookings.guest_name`
   - Mostrar lista consolidada

**Estimación:** 45-60 minutos

---

## 3️⃣ MEDIA PRIORIDAD - Testing Multi-Channel Inbox

**Objetivo:** Verificar funcionamiento con usuario final

**Pasos:**
1. Abrir Messages desde Sidebar
2. Verificar que se vean las 5 tabs (All, WhatsApp, Email, Voice, SMS)
3. Click en cada tab y verificar filtrado
4. Verificar badges de canal en conversaciones
5. Tomar screenshots para documentar

**Estimación:** 15 minutos

---

# ⚠️ REGLAS CRÍTICAS (NUNCA ROMPER)

## 🔴 SUPABASE:

1. **NO TOCAR TABLAS EXISTENTES** - Solo leer datos
2. **NO HABILITAR RLS** - Rompe workflows de n8n
3. **NO MODIFICAR CAMPOS ESCRITOS POR N8N** - Solo lectura
4. **USAR `SECURITY DEFINER`** - En nuevas RPC functions
5. **MANEJAR CASOS NULL** - COALESCE en queries

## 🔴 GIT:

1. **Branch:** Trabajar en `backup-antes-de-automatizacion`
2. **Commits:** Mensajes descriptivos con formato estándar
3. **Push:** Solo después de confirmar que funciona
4. **NO push a `main`** - Branch protegido

## 🔴 CÓDIGO:

1. **Leer antes de escribir** - Siempre usar Read tool primero
2. **Mock fallback** - Mantener datos mock como respaldo
3. **Error handling** - try/catch en todas las llamadas async
4. **Loading states** - Mostrar spinners mientras carga
5. **Console limpia** - No dejar console.logs innecesarios

---

# 📋 COMANDOS ÚTILES

## Verificar Estado:

```bash
# Ver branch actual
git branch

# Ver cambios sin commit
git status --short

# Ver últimos commits
git log --oneline -5

# Ver diff de un archivo
git diff src/components/Calendar/Calendar.jsx
```

## Desarrollo:

```bash
# Servidor dev (ya debería estar corriendo)
npm run dev
# URL: http://localhost:5173

# Build de producción (solo si necesitas)
npm run build
```

## Git Workflow:

```bash
# 1. Agregar cambios
git add src/components/Calendar/Calendar.jsx

# 2. Commit
git commit -m "feat: Migrate Calendar to real Supabase data"

# 3. Push
git push origin backup-antes-de-automatizacion
```

---

# 🔍 CÓMO EMPEZAR LA SESIÓN

## Paso 1: Verificar Estado

```bash
# ¿Qué branch estoy?
git branch

# ¿Hay cambios sin commit?
git status

# ¿Servidor dev corriendo?
# Debería ver: http://localhost:5173
```

## Paso 2: Leer Documentación

1. Lee `ESTADO_PROYECTO_17_ENERO_2026.md` (este directorio)
2. Identifica qué módulo vamos a migrar primero
3. Lee el componente actual para entender estructura

## Paso 3: Planificar

1. Usa TodoWrite para crear lista de tareas
2. Estima tiempos
3. Pregúntame si tienes dudas sobre prioridades

## Paso 4: Ejecutar

1. Lee archivo del componente con Read tool
2. Verifica si usa mock o datos reales
3. Si usa mock → migrar a `dataService`
4. Parallel loading con `Promise.all` cuando sea posible
5. Test en navegador
6. Commit + Push cuando funcione

---

# 💡 TIPS PARA TRABAJAR EFICIENTEMENTE

1. **Parallel Loading:** Usa `Promise.all` para cargar datos en paralelo
   ```javascript
   const [bookings, properties, guests] = await Promise.all([
     dataService.getBookings(),
     dataService.getProperties(),
     dataService.getGuests()
   ]);
   ```

2. **Property Name Mapping:** Crear propertyMap para performance
   ```javascript
   const propertyMap = {};
   properties.forEach(p => propertyMap[p.id] = p.name);
   // Lookup: propertyMap[booking.property_id]
   ```

3. **Error Handling:** Siempre con fallback a mock
   ```javascript
   try {
     const data = await dataService.getData();
     if (data && data.length > 0) {
       setData(data);
     } else {
       setData(mockData); // Fallback
     }
   } catch (error) {
     console.error('Error:', error);
     setData(mockData); // Fallback
   }
   ```

4. **Loading States:** Mejora UX
   ```javascript
   if (loading) {
     return <div>Loading...</div>;
   }
   ```

---

# 🎯 OBJETIVOS DE LA SESIÓN DE HOY

## Mínimos (Must Have):

- [ ] Calendar con datos reales
- [ ] Guests con datos reales
- [ ] Testing de Messages multi-canal
- [ ] Commit + Push de todos los cambios

## Deseables (Nice to Have):

- [ ] Reviews con datos reales
- [ ] Marketing con datos reales
- [ ] Performance audit
- [ ] Documentación actualizada

## Stretch Goals:

- [ ] Agregar más canales a Messages (Instagram, Facebook)
- [ ] Optimizar queries con paginación
- [ ] Mejorar métricas opcionales de AI Agents

---

# 📞 PREGUNTAS PARA ARRANCAR

Cuando empieces la sesión, pregúntame:

1. **¿Empezamos con Calendar o Guests?**
2. **¿Cuánto tiempo tenemos disponible?**
3. **¿Hay algo específico que quieras priorizar?**

Y yo te diré por dónde empezar.

---

# 🔗 ENLACES ÚTILES

**Supabase Dashboard:**
- URL: `https://jjpscimtxrudtepzwhag.supabase.co`
- Tenant ID: `c24393db-d318-4d75-8bbf-0fa240b9c1db`

**GitHub Repo:**
- `https://github.com/Josecarrallo/myhost-bizmate`
- Branch: `backup-antes-de-automatizacion`

**Live App:**
- `https://my-host-bizmate.vercel.app`

**n8n Instance:**
- `https://n8n-production-bb2d.up.railway.app`

---

# ✅ CHECKLIST PRE-INICIO

Antes de escribir código, verifica:

- [ ] Leí `ESTADO_PROYECTO_17_ENERO_2026.md`
- [ ] Entiendo qué módulos están migrados
- [ ] Sé qué voy a hacer primero (Calendar o Guests)
- [ ] Tengo claro las reglas críticas (no tocar Supabase schema)
- [ ] `npm run dev` está corriendo
- [ ] Estoy en branch `backup-antes-de-automatizacion`

---

**¡Listo para continuar donde lo dejamos!** 🚀

**Última actualización:** 17 Enero 2026 - 19:20 PM
**Próxima sesión:** 18 Enero 2026
