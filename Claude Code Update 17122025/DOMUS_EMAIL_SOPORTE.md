# 📧 EMAIL PARA SOPORTE DOMUS

**Fecha:** 18 Diciembre 2025
**Para:** support@zodomus.com
**Asunto:** Change Property Status from "Evaluation OTA" to "Active" - TEST Mode (Property ID: 5814990)

---

## 📝 EMAIL EN INGLÉS (Copiar y enviar):

```
Subject: Change Property Status from "Evaluation OTA" to "Active" - TEST Mode (Property ID: 5814990)

Hi DOMUS Support Team,

Thank you for the tutorial document you sent yesterday. I have followed all the steps in the
"Zodomus tutorial step by step tests only (basic channel manager operations)" document, but
the property is currently stuck in "Evaluation OTA" status in TEST mode.

PROPERTY DETAILS:
- Property ID: 5814990
- Property Name: Izumi Hotel - Test
- Channel: Booking.com (Channel ID: 1)
- Current Status: "Evaluation OTA"
- Account: IZUMI HOTEL BALI (josecarrallodelafuente@gmail.com)
- API Mode: Test API

CURRENT SITUATION:
- ✅ Property successfully created via POST /property API
- ✅ 5 Rooms created (IDs: 581499058, 581499084, 581499086, 581499088, 581499095)
- ✅ Property-check shows: Channel status "OK", Product status "OK"
- ⚠️ Property status: "Evaluation OTA" (blocking rates/availability configuration)
- ⚠️ Room status: "Error: Some rooms are not mapped" (cannot map until property is Active)

WHAT I NEED:
Could you please change the property status from "Evaluation OTA" to "Active" so I can
complete the integration testing?

Once the property is Active, I will:
1. Map the 5 rooms using POST /rooms-activation
2. Configure rates using POST /rates
3. Configure availability using POST /availability
4. Complete end-to-end testing with test reservations

TECHNICAL DETAILS (for your reference):
```json
POST /property-check response:
{
  "status": {
    "returnCode": "400",
    "returnMessage": {
      "Property status": "Evaluation OTA",
      "Channel status": "OK",
      "Product status": "OK",
      "Room status": "Error: Some rooms are not mapped with the channel rooms"
    }
  },
  "mappedRooms": [
    {"roomId": "581499058", "myRoomId": ""},
    {"roomId": "581499084", "myRoomId": ""},
    {"roomId": "581499086", "myRoomId": ""},
    {"roomId": "581499088", "myRoomId": ""},
    {"roomId": "581499095", "myRoomId": ""}
  ]
}
```

I understand that in PRODUCTION mode, Booking.com would approve the property automatically
in 24-72 hours, but since I'm in TEST mode, I need your assistance to activate it manually.

Thank you very much for your help!

Best regards,
Jose Carrallo
IZUMI HOTEL BALI
josecarrallodelafuente@gmail.com
```

---

## 📋 RESUMEN DE LA SITUACIÓN:

### ✅ COMPLETADO:

1. **Property creada** via API:
   - Property ID: 5814990
   - Nombre: Izumi Hotel - Test
   - Channel: Booking.com (ID: 1)
   - Tipo: Hotel (código 20)

2. **5 Rooms creados** via API:
   - 581499058
   - 581499084
   - 581499086
   - 581499088
   - 581499095
   - Tipo: Double room (código 17)
   - Max Occupancy: 2
   - Size: 25 sqm

3. **Tutorial oficial** leído y entendido

4. **Investigación completa** realizada:
   - GET /channels ✅
   - GET /room-rates ✅
   - GET /property ✅ (devuelve template)
   - GET /account ✅
   - POST /property-check ✅

### ⏳ BLOQUEADO POR:

**Property Status: "Evaluation OTA"**

Este status impide:
- ❌ Mapear rooms (POST /rooms-activation devuelve 0 rooms activados)
- ❌ Configurar rates (POST /rates requiere status "Active")
- ❌ Configurar availability (POST /availability requiere status "Active")
- ❌ Crear reservas de test

### 🎯 SOLUCIÓN:

**DOMUS soporte** debe cambiar manualmente el status en TEST mode:
- **De:** "Evaluation OTA"
- **A:** "Active"

En PRODUCTION mode, este cambio es automático (24-72 horas), pero en TEST mode
requiere intervención manual.

---

## 📞 INFORMACIÓN DE CONTACTO:

- **Email soporte:** support@zodomus.com
- **Experiencia anterior:** Respondieron en 3 minutos el 17 Dic 2025 (20:22 PM)
- **Calidad soporte:** Excelente - enviaron tutorial oficial

---

## 🚀 PRÓXIMOS PASOS (después de activación):

### 1. Verificar property activa (5 min)
```bash
node scripts/domus-activate-correct.js
```
Verificar que devuelva: `"Property status": "Active"`

### 2. Mapear rooms (10 min)
```bash
POST /rooms-activation
```
Mapear los 5 rooms con myRoomId

### 3. Configurar rates (15 min)
```bash
POST /rates
```
- Precio: USD $100/noche
- Período: 365 días
- Currency: USD

### 4. Configurar availability (15 min)
```bash
POST /availability
```
- Availability: 5 rooms
- Período: 365 días
- Todos los días de la semana

### 5. Crear reserva de test (10 min)
```bash
POST /reservations-createtest
```
Crear reserva de prueba

### 6. Importar n8n workflow (20 min)
- Importar: `n8n_worlkflow_claude/DOMUS Polling - Reservations Sync.json`
- Configurar credenciales DOMUS
- Activar polling cada 5 minutos

### 7. Testing end-to-end (30 min)
- Verificar polling detecta reserva
- Confirmar insert en Supabase
- Probar Email confirmation
- Probar WhatsApp confirmation

**Tiempo total estimado post-activación:** 2 horas

---

## ⏱️ TIMELINE ESPERADO:

| Evento | Tiempo estimado |
|--------|-----------------|
| Enviar email a soporte | Ahora |
| Respuesta de soporte | 30 min - 24 horas |
| Activación de property | Inmediato (por soporte) |
| Completar integración | 2 horas |
| **DOMUS 100% funcionando** | **Hoy o mañana** |

---

## 💡 ALTERNATIVAS (si soporte demora):

### OPCIÓN 1: Crear property en Booking.com manualmente
1. Ir a Booking.com Extranet
2. Crear property manualmente
3. Obtener Property ID de Booking.com
4. Usar ese ID en el flujo del tutorial

**Ventaja:** No dependes de soporte
**Desventaja:** Requiere cuenta activa en Booking.com

### OPCIÓN 2: Cambiar a Channel Manager de Indonesia
Según investigación del 17 Dic 2025, hay un channel manager de Indonesia
que podría ser más sencillo.

**Ventaja:** Más control
**Desventaja:** Pierdes DOMUS (único que no vende PMS)

### OPCIÓN 3: Esperar modo PRODUCTION
Cuando pases a PRODUCTION mode, la aprobación será automática (24-72 horas).

**Ventaja:** Automático
**Desventaja:** No puedes completar testing ahora

---

## 🎯 RECOMENDACIÓN FINAL:

**Enviar email a soporte ahora mismo.**

Razones:
1. ✅ Ya respondieron en 3 minutos antes
2. ✅ Soporte de DOMUS es excelente
3. ✅ Es la forma más rápida de continuar
4. ✅ DOMUS es la mejor opción (no vende PMS)
5. ✅ Todo lo demás está listo (solo falta este paso)

---

## 📋 CHECKLIST ANTES DE ENVIAR:

- [ ] Copiar el email en inglés de arriba
- [ ] Pegar en tu cliente de email
- [ ] Verificar que el destinatario sea: support@zodomus.com
- [ ] Asunto: Change Property Status from "Evaluation OTA" to "Active" - TEST Mode (Property ID: 5814990)
- [ ] Enviar
- [ ] Esperar respuesta (pueden responder muy rápido)
- [ ] Notificarme cuando respondan para continuar

---

**¿Listo para enviar el email?** 🚀
