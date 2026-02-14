# 🔄 INSTRUCCIONES: Importar n8n Workflow DOMUS

**Fecha:** 18 Diciembre 2025
**Workflow:** DOMUS Polling - Reservations Sync
**Tiempo estimado:** 10-15 minutos

---

## 🎯 ¿QUÉ HACE ESTE WORKFLOW?

Automáticamente cada 5 minutos:
1. ✅ Consulta API de DOMUS por nuevas reservas
2. ✅ Si hay reservas, las transforma al formato de Supabase
3. ✅ Inserta en tabla `bookings` de Supabase
4. ✅ Trigger notificaciones (Email + WhatsApp)

**Resultado:** Reservas de Booking.com aparecen automáticamente en tu sistema

---

## 📋 ANTES DE EMPEZAR

### ✅ Prerequisitos:

1. **Supabase SQL ejecutado** ✓
   - Columnas agregadas a tabla `bookings`
   - Índices creados

2. **DOMUS property activa** ⏳
   - Esperando respuesta de soporte
   - NO importa, puedes importar y configurar ahora

3. **n8n Railway funcionando** ✓
   - URL: https://n8n-production-bb2d.up.railway.app

---

## 🚀 PASO A PASO

### 1. ABRIR n8n

1. Ve a: https://n8n-production-bb2d.up.railway.app
2. Login con tus credenciales
3. Deberías ver el dashboard de workflows

---

### 2. IMPORTAR EL WORKFLOW

1. **Click** en "+ New Workflow" (botón arriba a la derecha)
2. En el nuevo workflow vacío, **click** en el menú "..." (3 puntos arriba a la derecha)
3. **Seleccionar** "Import from File"
4. **Buscar** el archivo en tu computadora:
   ```
   C:\myhost-bizmate\n8n_worlkflow_claude\DOMUS Polling - Reservations Sync.json
   ```
   (O navega a la carpeta `n8n_worlkflow_claude` del proyecto)
5. **Click** "Open"
6. El workflow debería cargarse mostrando todos los nodos conectados

**Deberías ver estos nodos:**
- Schedule Trigger (reloj)
- DOMUS Get Reservations (HTTP Request)
- Has New Reservations? (IF)
- Split Out (loop)
- Map to Supabase (Set)
- Insert into Supabase (Supabase node)
- Trigger Confirmations (webhook o similar)

---

### 3. CONFIGURAR CREDENCIALES DOMUS

**En el nodo "DOMUS Get Reservations":**

1. **Click** en el nodo "DOMUS Get Reservations"
2. En el panel derecho, buscar sección "Credentials"
3. Si dice "Create New", hacer click
4. **Tipo de credential:** HTTP Basic Auth
5. **Completar:**
   ```
   Name: DOMUS API Credentials
   User: IfLKCinlg1KOK2BOVcQMjTUOdcD5teeuNFBVOQQ5Jno=
   Password: J9xiyR11I6iAF1yM6+QVmfhwULuxslmrmknziknsz0M=
   ```
6. **Click** "Save"
7. Debería aparecer como seleccionada en el nodo

---

### 4. VERIFICAR CREDENCIALES SUPABASE

**En el nodo "Insert into Supabase":**

1. **Click** en el nodo "Insert into Supabase"
2. Verificar que la credential esté seleccionada
3. Si NO existe "MY HOST Supabase", crearla:
   - **Name:** MY HOST Supabase
   - **Host:** jjpscimtxrudtepzwhag.supabase.co
   - **API Key (anon):** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0
4. **Click** "Save"

---

### 5. REVISAR CONFIGURACIÓN DEL WORKFLOW

**Schedule Trigger:**
- Debe estar en: `*/5 * * * *` (cada 5 minutos)
- ✅ Ya configurado

**DOMUS Get Reservations:**
- URL: `https://api.zodomus.com/reservations-queue`
- Method: GET
- Query Parameters:
  - `channelId`: 1
  - `propertyId`: 5814990
- ✅ Ya configurado

**Map to Supabase:**
- Transforma datos de DOMUS a formato Supabase
- ✅ Ya configurado

**Insert into Supabase:**
- Table: `bookings`
- Operation: Insert
- ✅ Ya configurado

---

### 6. GUARDAR EL WORKFLOW

1. **Cambiar nombre** del workflow:
   - Click en "My workflow" arriba
   - Renombrar a: "DOMUS Polling - Reservations Sync"
2. **Click** "Save" (botón arriba a la derecha)
3. Debería guardar sin errores

---

### 7. TESTING (ANTES DE ACTIVAR)

**NO activar todavía** si DOMUS property no está activa.

**Para probar:**
1. **Click** en "Execute Workflow" (botón arriba)
2. Debería ejecutarse y mostrar resultados
3. **Posibles resultados:**
   - ✅ Sin reservas: OK (significa API funciona)
   - ✅ Con reservas: Deberías ver datos en Supabase
   - ❌ Error 401: Revisar credenciales DOMUS
   - ❌ Error en Supabase: Revisar columnas existen

---

### 8. ACTIVAR WORKFLOW (Cuando DOMUS esté listo)

**SOLO cuando property esté Active:**

1. **Click** en el toggle "Inactive" arriba a la derecha
2. Cambiar a "Active"
3. Workflow comenzará a ejecutarse cada 5 minutos automáticamente

**Ver ejecuciones:**
- Click en "Executions" (panel izquierdo)
- Verás todas las ejecuciones cada 5 min
- Verde = Exitoso
- Rojo = Error (revisar)

---

## 🔍 VERIFICACIÓN

### Después de activar y esperar 5-10 minutos:

**1. Verificar en n8n:**
```
Executions → Ver últimas ejecuciones
- Deberían aparecer cada 5 minutos
- Status: Success (verde)
```

**2. Verificar en Supabase:**
```sql
SELECT * FROM bookings
WHERE source = 'domus'
ORDER BY created_at DESC
LIMIT 10;
```

Deberías ver reservas de DOMUS.

---

## 🛠️ TROUBLESHOOTING

### Error: "Invalid API key"
**Solución:**
- Revisar credenciales DOMUS estén correctas
- Copiar exactamente User y Password (con los = al final)

### Error: "Property status not Active"
**Solución:**
- Esperar a que soporte active property 5814990
- Workflow funcionará cuando property esté activa

### Error: "Column does not exist"
**Solución:**
- Ejecutar el SQL en Supabase Dashboard
- Archivo: `supabase/bookings-setup.sql`

### No aparecen reservas
**Posibles causas:**
1. Property no está activa aún
2. No hay reservas nuevas (normal en TEST mode)
3. Workflow no está activado

**Solución:**
- Crear reserva de test cuando DOMUS esté activo:
  ```bash
  node scripts/domus-complete-activation.cjs
  ```
  Incluye creación de reserva de test

---

## 📊 MONITOREO

### Queries útiles en Supabase:

**Ver últimas reservas:**
```sql
SELECT
  reservation_id,
  guest_name,
  check_in,
  check_out,
  total_price || ' ' || currency_code as price,
  source,
  created_at
FROM bookings
ORDER BY created_at DESC
LIMIT 20;
```

**Contar reservas por fuente:**
```sql
SELECT source, COUNT(*) as total
FROM bookings
GROUP BY source;
```

**Ver reservas de hoy:**
```sql
SELECT * FROM bookings
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

Más queries en: `supabase/bookings-queries.sql`

---

## 🎉 RESULTADO ESPERADO

Cuando todo esté funcionando:

```
Booking.com → Reserva creada
       ↓
DOMUS API → Detecta reserva
       ↓
n8n (cada 5 min) → GET /reservations-queue
       ↓
Supabase → INSERT INTO bookings
       ↓
Email (SendGrid) → Confirmación al huésped
       ↓
WhatsApp (ChakraHQ) → Mensaje al huésped
```

**100% Automático** ✅

---

## 📁 ARCHIVOS RELACIONADOS

```
n8n_worlkflow_claude/
├── DOMUS Polling - Reservations Sync.json  ← Importar este
├── DOMUS_POLLING_SETUP.md                  ← Documentación técnica
└── [otros workflows...]

supabase/
├── bookings-setup.sql          ← Ejecutar en Supabase Dashboard
└── bookings-queries.sql        ← Queries útiles

scripts/
├── supabase-setup-bookings.cjs ← Verificar estructura
└── domus-complete-activation.cjs ← Ejecutar cuando soporte responda
```

---

## ✅ CHECKLIST

- [ ] n8n abierto (Railway)
- [ ] Workflow importado
- [ ] Credenciales DOMUS configuradas
- [ ] Credenciales Supabase verificadas
- [ ] Workflow guardado con nombre correcto
- [ ] (Opcional) Test ejecutado manualmente
- [ ] **NO ACTIVAR** hasta que property esté Active
- [ ] Cuando property Active → Activar workflow
- [ ] Verificar ejecuciones en n8n
- [ ] Verificar inserts en Supabase

---

## 🚨 IMPORTANTE

**NO ACTIVAR EL WORKFLOW** hasta que:
1. ✅ SQL ejecutado en Supabase (columnas agregadas)
2. ✅ Soporte DOMUS active property 5814990
3. ✅ Script de activación ejecutado (domus-complete-activation.cjs)

**Puedes importar y configurar TODO ahora**, solo **NO activar** hasta estar listo.

---

**¿Necesitas ayuda?** Avísame en qué paso estás.

**Siguiente paso:** Cuando completes esto, avísame para continuar con testing + integración con la app React.
