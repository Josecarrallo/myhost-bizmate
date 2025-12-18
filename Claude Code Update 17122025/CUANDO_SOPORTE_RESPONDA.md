# 🚀 CUANDO SOPORTE RESPONDA - INSTRUCCIONES

**Fecha creación:** 18 Diciembre 2025
**Email enviado a:** support@zodomus.com
**Status:** ⏳ Esperando respuesta

---

## ⚡ ACCIÓN INMEDIATA (1 comando):

Cuando soporte responda confirmando que activaron la property, ejecuta:

```bash
node scripts/domus-complete-activation.cjs
```

Este script ejecuta **TODO** automáticamente:
1. ✅ Verifica property está activa
2. ✅ Mapea los 5 rooms
3. ✅ Configura rates (USD $100/noche, 365 días)
4. ✅ Configura availability (5 rooms, 365 días)
5. ✅ Crea reserva de test
6. ✅ Verifica todo funciona

**Tiempo estimado:** 2-3 minutos

---

## 📋 SI EL SCRIPT FALLA:

### Opción A: Ejecutar paso a paso

```bash
# Paso 1: Verificar property activa
node scripts/domus-activate-correct.js

# Paso 2: Ver rooms y rates
node -e "
const https = require('https');
const auth = 'Basic ' + Buffer.from('IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=:J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=').toString('base64');
const options = {
  hostname: 'api.zodomus.com',
  port: 443,
  path: '/room-rates?channelId=1&propertyId=5814990',
  method: 'GET',
  headers: { 'Authorization': auth }
};
const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(JSON.parse(body)));
});
req.end();
"

# Luego ejecutar script completo
node scripts/domus-complete-activation.cjs
```

### Opción B: Contactar a Claude

Dile: "El soporte respondió, ejecuté el script pero falló en [paso X]"

---

## 📊 OUTPUT ESPERADO:

```
╔════════════════════════════════════════════════════════════════════╗
║           DOMUS COMPLETE ACTIVATION - POST SUPPORT                ║
╚════════════════════════════════════════════════════════════════════╝

======================================================================
  PASO 1: Verificar Property Activa
======================================================================

Property Status: Active  ✅
Channel Status: OK
Product Status: OK
Room Status: OK
✅ Property está ACTIVA ✓

======================================================================
  PASO 2: Mapear Rooms
======================================================================

ℹ️  Mapeando 5 rooms...
✅ 5 rooms activados correctamente

======================================================================
  PASO 3: Configurar Rates
======================================================================

ℹ️  Configurando rates: USD $100/noche
✅ X rates configurados exitosamente

======================================================================
  PASO 4: Configurar Availability
======================================================================

ℹ️  Configurando availability: 5 rooms disponibles
✅ 5 rooms con availability configurada

======================================================================
  PASO 5: Crear Reserva de Test
======================================================================

✅ Reserva de test creada exitosamente
📋 Reservation ID: XXXXXX
📅 Check-in: 2025-12-19
📅 Check-out: 2025-12-20

======================================================================
  ✅ INTEGRACIÓN DOMUS COMPLETADA
======================================================================

🎉 DOMUS Integration 100% completada!
```

---

## ✅ DESPUÉS DE EJECUTAR EL SCRIPT:

### 1. Verificar en DOMUS Dashboard

Ve a: https://www.zodomus.com/
Login con tu cuenta
Verifica:
- ✅ Property 5814990 status "Active"
- ✅ 5 rooms visibles
- ✅ Rates configurados
- ✅ Availability configurado
- ✅ Reserva de test visible

### 2. Avísame que completaste

Dime: "Script ejecutado exitosamente, DOMUS 100% activo"

### 3. Continuamos con n8n

Próximos pasos:
- Importar workflow de polling
- Configurar conexión Supabase
- Testing end-to-end

---

## 🔧 SCRIPTS DISPONIBLES:

```bash
# SCRIPT PRINCIPAL (ejecutar cuando soporte responda)
node scripts/domus-complete-activation.cjs

# Scripts auxiliares (por si necesitas ejecutar pasos individuales)
node scripts/domus-test.js                    # Testing completo
node scripts/domus-activate-correct.js        # Verificar status
node scripts/domus-create-rates.js           # Solo rates
node scripts/domus-investigate-property.cjs  # Investigación

# Script del tutorial oficial (alternativa)
node scripts/domus-tutorial-flow.cjs
```

---

## 📞 SI SOPORTE NO RESPONDE:

### Timeline esperado:
- ✅ Mejor caso: 3 minutos (como la vez anterior)
- ✅ Normal: 1-2 horas (horario laboral)
- ⚠️  Lento: 24 horas (fin de semana)

### Si pasan más de 24 horas:

1. **Enviar follow-up email:**

```
Subject: Follow-up: Property Activation Request (ID: 5814990)

Hi DOMUS Support,

Following up on my previous email regarding property 5814990 activation.

Could you please confirm the status of my request?

Thank you!
Jose Carrallo
```

2. **Contactar a Claude:**

Dile: "Soporte no responde, ¿qué alternativas tenemos?"

---

## 💡 MIENTRAS ESPERAS:

Puedes trabajar en:

1. **Importar n8n workflow** (no requiere property activa):
   ```
   - Ir a n8n Railway: https://n8n-production-bb2d.up.railway.app
   - Workflows → Import from File
   - Seleccionar: n8n_worlkflow_claude/DOMUS Polling - Reservations Sync.json
   - NO activar todavía (esperar a que property esté activa)
   ```

2. **Revisar Supabase tables**:
   - Verificar tabla `bookings` existe
   - Verificar columnas necesarias
   - Preparar queries de testing

3. **Revisar otros módulos de MY HOST BizMate**:
   - Dashboard
   - Properties
   - Bookings
   - etc.

4. **Documentar progreso**:
   - Actualizar CONTINUAR_SESION.md
   - Revisar ROADMAP_PENDIENTES.md

---

## 🎯 CHECKLIST POST-ACTIVACIÓN:

- [ ] Soporte respondió confirmando activación
- [ ] Ejecutado: `node scripts/domus-complete-activation.cjs`
- [ ] Script completó exitosamente (sin errores)
- [ ] Verificado en DOMUS dashboard: property activa
- [ ] Verificado: 5 rooms visibles
- [ ] Verificado: rates configurados
- [ ] Verificado: availability configurado
- [ ] Verificado: reserva de test creada
- [ ] Notificado a Claude para continuar con n8n

---

## 📁 ARCHIVOS CREADOS HOY (18 DIC 2025):

```
scripts/
├── domus-complete-activation.cjs     ⭐ PRINCIPAL - Ejecutar cuando soporte responda
├── domus-tutorial-flow.cjs           📘 Basado en tutorial oficial
└── domus-investigate-property.cjs    🔍 Investigación y diagnóstico

Claude Code Update 17122025/
├── DOMUS_EMAIL_SOPORTE.md           📧 Email enviado a soporte
└── CUANDO_SOPORTE_RESPONDA.md       📋 Este archivo (instrucciones)
```

---

## 🚨 TROUBLESHOOTING:

### Error: "Property status: Evaluation OTA"
**Solución:** Soporte aún no activó. Espera confirmación.

### Error: "Number of rooms activated: 0"
**Solución:** Property no está activa o rates no existen.
Ejecuta: `node scripts/domus-investigate-property.cjs`

### Error: "Cannot configure rates - Property not Active"
**Solución:** Verifica property status:
`node scripts/domus-activate-correct.js`

### Error: "Connection refused / 401 Unauthorized"
**Solución:** Verifica credenciales en CONFIG del script.

### Cualquier otro error:
**Solución:** Contacta a Claude con el error completo.

---

**¡LISTO PARA CUANDO SOPORTE RESPONDA!** 🚀

Solo ejecuta: `node scripts/domus-complete-activation.cjs`
