# Plan de Integración - Workflows Restantes

**Fecha:** 20 Diciembre 2025
**Estado Actual:** Properties ✅ + Bookings ✅ integrados

## Workflows Disponibles

### 1. ✅ YA INTEGRADOS

| Workflow | ID | Estado | Integración |
|----------|-----|--------|-------------|
| **Properties** | `6eqkTXvYQLdsazdC` | ⚠️ Activo (SMTP timeout) | ✅ Frontend integrado |
| **Bookings Confirmation** | `OxNTDO0yitqV6MAL` | ✅ Activo y funcionando | ✅ Frontend integrado |
| **Bookings Confirmation 2** | `F8YPuLhcNe6wGcCv` | ✅ Activo (duplicado) | ✅ Frontend integrado |

### 2. 🔄 PENDIENTES DE INTEGRACIÓN

#### A) WhatsApp AI Agent - Reservations
- **ID:** `ln2myAS3406D6F8W`
- **Nombre:** "WhatsApp AI Agent - Izumi Hotel (ChakraHQ) - MY HOST Bizmate VIII"
- **Estado:** ✅ ACTIVO
- **Tipo:** Webhook
- **Path:** `894ed1af-89a5-44c9-a340-6e571eacbd53`
- **Tecnología:** AI Agent con OpenAI + LangChain + ChakraHQ WhatsApp
- **Propósito:** Bot de WhatsApp para consultas de huéspedes y reservas

**¿Integrar en Frontend?** 🟡 **OPCIONAL - No crítico ahora**

**Razón:**
- Este flujo se activa por mensajes de WhatsApp entrantes (webhook externo)
- NO necesita ser llamado desde el frontend
- Ya está funcionando automáticamente cuando llegan mensajes
- Es un flujo "pasivo" que responde a eventos externos

**Cuándo Integrarlo:**
- Cuando quieras un panel para ver conversaciones de WhatsApp
- Para monitorear métricas del chatbot (mensajes, respuestas, etc.)
- Para configurar respuestas predefinidas desde el UI

---

#### B) VAPI Voice Assistant
- **ID:** `3sU4RgV892az8nLZ`
- **Nombre:** "Vapi Izumi Hotel - MYHOST Bizmate IX"
- **Estado:** ❌ INACTIVO
- **Tipo:** Webhook
- **Path:** `vapi-izumi-fix`
- **Tecnología:** VAPI + OpenAI Chat Model + LangChain Memory
- **Propósito:** Asistente de voz por teléfono para consultas de hotel

**¿Integrar en Frontend?** ✅ **SÍ - ALTA PRIORIDAD**

**Razón:**
- Ya tienes un módulo "Voice AI Agent" en el frontend
- El flujo está INACTIVO - necesita ser activado
- VAPI requiere configuración de widget/número de teléfono
- Los huéspedes necesitan ver el botón/widget para llamar

**Qué Integrar:**
1. **Activar el workflow en n8n** primero
2. **Agregar VAPI Widget al frontend:**
   ```javascript
   // En VoiceAI component
   useEffect(() => {
     const script = document.createElement('script');
     script.src = 'https://cdn.vapi.ai/vapi-widget.js';
     script.async = true;
     document.body.appendChild(script);

     script.onload = () => {
       window.vapiSDK.run({
         apiKey: 'TU_VAPI_PUBLIC_KEY',
         assistant: 'TU_ASSISTANT_ID',
         config: {
           position: 'bottom-right',
           offset: '40px',
           width: '400px',
           height: '600px'
         }
       });
     };
   }, []);
   ```

3. **Dashboard de llamadas:**
   - Ver llamadas activas
   - Historial de conversaciones de voz
   - Transcripciones de llamadas
   - Métricas (duración, satisfacción, etc.)

**Documentación Existente:**
- `CONFIGURAR_VAPI_PUBLIC_KEY.md` - ya tienes instrucciones para esto

---

#### C) Channel Manager (DOMUS)
- **ID:** `hvXxsxJhU1cuq6q3`
- **Nombre:** "DOMUS Polling - Reservations Sync MYHOST Bizmate X"
- **Estado:** ❌ INACTIVO
- **Tipo:** Schedule Trigger (cada 5 minutos)
- **Tecnología:** DOMUS API + Supabase sync
- **Propósito:** Sincronizar reservas de DOMUS (RMS/Channel Manager) a Supabase

**¿Integrar en Frontend?** 🟢 **SÍ - PRIORIDAD MEDIA**

**Razón:**
- Este flujo sincroniza reservas automáticamente de canales externos (Booking.com, Airbnb, etc.)
- NO necesita llamadas desde frontend, pero SÍ necesita UI de configuración
- Se ejecuta automáticamente cada 5 minutos

**Qué Integrar:**
1. **NO llamar desde frontend** - es un cron job automático
2. **SÍ crear panel de configuración:**
   - Ver último sync (timestamp)
   - Ver reservas importadas
   - Configurar credenciales DOMUS
   - Habilitar/deshabilitar sync
   - Ver errores de sincronización
   - Mapeo de propiedades (DOMUS ID → Supabase ID)

3. **Dashboard:**
   ```javascript
   // En Multichannel component
   const syncStatus = {
     lastSync: '2025-12-20 17:00:00',
     status: 'success',
     reservationsImported: 5,
     errors: 0,
     nextSync: '2025-12-20 17:05:00'
   };
   ```

**Documentación Necesaria:**
- DOMUS API credentials
- Channel IDs y Property IDs
- Mapping de campos DOMUS → Supabase

---

#### D) Recomendaciones AI Diarias
- **ID:** `8xWqs3rlUZmSf8gc`
- **Nombre:** "Flujo B - Recomendaciones IA Diarias FINAL MY HOST Bizmate I"
- **Estado:** ❌ INACTIVO
- **Tipo:** Schedule Trigger (9 AM diario)
- **Tecnología:** Claude API + Supabase
- **Propósito:** Enviar recomendaciones personalizadas de actividades a huéspedes activos

**¿Integrar en Frontend?** 🟡 **OPCIONAL - PRIORIDAD BAJA**

**Razón:**
- Se ejecuta automáticamente a las 9 AM
- NO necesita llamadas manuales desde frontend
- Es un flujo completamente automático

**Qué Integrar (opcional):**
1. **Panel de recomendaciones enviadas:**
   - Ver historial de recomendaciones
   - Ver qué huéspedes recibieron qué
   - Métricas de engagement
   - Botón "Enviar Ahora" (forzar ejecución manual)

2. **Configuración:**
   - Hora de envío (9 AM por defecto)
   - Tipos de recomendaciones (cultura, comida, aventura, etc.)
   - Personalización por huésped

---

## Resumen de Recomendaciones

| Workflow | Integrar Frontend | Prioridad | Tipo de Integración |
|----------|-------------------|-----------|---------------------|
| WhatsApp AI Agent | 🟡 Opcional | Baja | Panel de monitoreo |
| **VAPI Voice Assistant** | ✅ **SÍ** | **ALTA** | Widget + Dashboard |
| Channel Manager | 🟢 Sí | Media | Panel de configuración |
| Recomendaciones AI | 🟡 Opcional | Baja | Panel de historial |

---

## Plan de Acción Recomendado

### Sprint 2: VAPI Voice Assistant (PRIORIDAD 1)

**Objetivo:** Integrar asistente de voz y hacerlo disponible para huéspedes

**Tareas:**
1. ✅ Activar workflow en n8n
2. ✅ Configurar VAPI Public Key
3. ✅ Agregar VAPI widget al frontend
4. ✅ Crear dashboard de llamadas en VoiceAI component
5. ✅ Probar llamada end-to-end
6. ✅ Documentar configuración

**Tiempo Estimado:** 2-3 horas
**Archivos a Modificar:**
- `src/components/VoiceAI/VoiceAI.jsx` - agregar widget + dashboard
- `src/services/n8n.js` - agregar función para logs de llamadas
- `public/index.html` - agregar VAPI script (opcional)

**Beneficio:** Los huéspedes pueden llamar por teléfono para consultas 24/7

---

### Sprint 3: Channel Manager Configuration (PRIORIDAD 2)

**Objetivo:** Panel para configurar y monitorear sync de reservas externas

**Tareas:**
1. ✅ Activar workflow en n8n
2. ✅ Configurar credenciales DOMUS
3. ✅ Crear panel de configuración en Multichannel component
4. ✅ Ver estado de último sync
5. ✅ Botón para forzar sync manual
6. ✅ Logs de errores de sincronización

**Tiempo Estimado:** 3-4 horas
**Archivos a Modificar:**
- `src/components/Multichannel/Multichannel.jsx` - agregar config panel
- `src/services/n8n.js` - agregar funciones de channel manager
- Crear tabla `channel_sync_logs` en Supabase

**Beneficio:** Sincronización automática de reservas de Booking, Airbnb, etc.

---

### Sprint 4: Dashboards Opcionales (PRIORIDAD 3)

**WhatsApp AI Agent:**
- Panel de conversaciones
- Métricas de chatbot
- Configuración de respuestas

**Recomendaciones AI:**
- Historial de recomendaciones enviadas
- Métricas de engagement
- Botón para enviar manualmente

**Tiempo Estimado:** 2-3 horas cada uno

---

## Decisión Final

**¿Qué hacer ahora?**

### Opción 1: VAPI Voice Assistant (RECOMENDADO) ⭐
- Alta prioridad
- Mejora experiencia del huésped
- Ya tienes módulo VoiceAI en el frontend
- 2-3 horas de trabajo

### Opción 2: Completar Dashboard con Datos Reales (ALTERNATIVA)
- Como mencionaste antes: "yo prefiero la opcion 2. Esto es lo mas importante de la app"
- Sprint 1.5: Owner Executive Summary con datos reales
- KPIs, gráficos, alertas dinámicas
- 3-4 horas de trabajo

### Opción 3: Channel Manager (MEDIO PLAZO)
- Importante para escalar
- Automatiza entrada de reservas
- Requiere configuración DOMUS primero

---

## Pregunta para Ti

¿Qué prefieres hacer mañana?

**A)** Integrar VAPI Voice Assistant (widget + dashboard de llamadas)
**B)** Completar Dashboard con datos reales de Supabase
**C)** Configurar Channel Manager (DOMUS sync)
**D)** Otra cosa

**Mi recomendación:** Opción B (Dashboard) porque:
1. Tú mismo lo marcaste como "lo mas importante"
2. Necesitas ver métricas reales para tomar decisiones
3. VAPI puede esperar hasta tener más huéspedes reales
4. Channel Manager necesita credenciales DOMUS que quizás no tienes aún

---

## Notas Adicionales

**WhatsApp AI Agent:**
- Ya está funcionando automáticamente
- Solo necesita que lleguen mensajes de WhatsApp
- No requiere integración urgente en frontend

**Todos los workflows INACTIVOS:**
- VAPI Voice Assistant ❌
- Channel Manager ❌
- Recomendaciones AI ❌

Necesitan ser **activados en n8n** antes de poder usarse.

**Webhooks disponibles:**
- `/webhook/new_property` - Properties ✅
- `/webhook/booking-created` - Bookings ✅
- `/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53` - WhatsApp ✅
- `/webhook/vapi-izumi-fix` - VAPI ❌ (inactivo)

---

**Siguiente Paso:** Decide qué Sprint quieres hacer mañana y lo preparo todo para ti.
