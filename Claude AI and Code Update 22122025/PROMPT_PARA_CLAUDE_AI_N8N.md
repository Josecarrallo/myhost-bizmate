# 🤖 Prompt para Claude AI - n8n Workflows

**Fecha:** 21 Diciembre 2025
**Propósito:** Configurar y debuggear workflow "New Property Notification" en n8n
**Contexto:** MY HOST BizMate - Property Management Platform

---

## 📋 Prompt Completo (Copiar y pegar en Claude AI)

```
Hola Claude! Necesito tu ayuda con n8n workflows para mi proyecto MY HOST BizMate.

## CONTEXTO DEL PROYECTO

MY HOST BizMate es una plataforma de gestión de propiedades vacacionales con:
- **Frontend:** React + Vite + Supabase
- **Backend:** Supabase (PostgreSQL + Auth)
- **Automatización:** n8n workflows
- **n8n URL:** https://n8n-production-bb2d.up.railway.app

## OBJETIVO

Tengo todos estos flujos que debemos de probar y hacer los nuevos para integrarlos en la app MYHOST Bizmate

New Property
https://n8n-production-bb2d.up.railway.app/workflow/6eqkTXvYQLdsazdC
Funciona, pero no llega bien la información por email y WhatsApp (mira comentarios debajo)
Booking confirmation
Lo temenos duplicado.
Este es el que quiero: le falta envío de email que lo podemos copiar del segundo
https://n8n-production-bb2d.up.railway.app/workflow/F8YPuLhcNe6wGcCv
Segundo.
https://n8n-production-bb2d.up.railway.app/workflow/OxNTDO0yitqV6MAL

WhatsApp AI agent (reservations)
https://n8n-production-bb2d.up.railway.app/workflow/ln2myAS3406D6F8W
Probarlo

VAPI Voice asistant
https://n8n-production-bb2d.up.railway.app/workflow/3sU4RgV892az8nLZ
El assistant habla en inglés, pero el flujo está en español y en las conversaciones mezcal idiomas, por ejemplo, los números te los da en ingles
Lo quiero todo en ingles. Cambis propuestos debajo

Chanel Manger
https://n8n-production-bb2d.up.railway.app/workflow/hvXxsxJhU1cuq6q3
Pendiente integración DOMUS

Recomendaciones AI
https://n8n-production-bb2d.up.railway.app/workflow/8xWqs3rlUZmSf8gc
Probarlo

Nuevos flujos: Mira descripción debajo)
Owner Internal Agent – MYHOST Bizmate
Workflow 1 - Owner Daily Intelligence
Workflow 2 – Owner Alert & Recomentation
Workflow 3 – Owner ask MyHost
Workflow 4   WF-IA-01 — Owner AI Assistant (Executive Summary


FLUJO NEW PROPERTIES:
Necesito debuggear y activar el workflow "New Property Notification" que envía Email + WhatsApp cuando se crea una nueva propiedad.

## PROBLEMA ACTUAL

New Property
https://n8n-production-bb2d.up.railway.app/workflow/nugSQu7acB0cE939
llegan mensajes a email y whatsapp pero incompletos.
Tiene que llegar esta información (esta bien en nodo email) .No llegan valores
DETALLES DE LA PROPIEDAD:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Nombre:
📍 Ubicación: ,
🛏️ Habitaciones:
👥 Huéspedes máx:
💰 Precio base: $
📋 Estado:
Próximos pasos:
✅ Configurar fotos de la propiedad
✅ Completar amenidades
Booking confirmation


## ESTADO DEL WORKFLOW

**Nombre:** MY HOST - New Property Notification (Email+WhatsApp)
**Archivo JSON:** Tengo el workflow exportado en `n8n_worlkflow_claude/MY HOST - New Property Notification (Email+WhatsApp).json`

**Estructura:**
1. Webhook (POST `/webhook/new_property`)
2. SendGrid Email → Owner
3. Chakra WhatsApp → Owner

## CAUSA IDENTIFICADA

**Mismatch en formato de payload:**

**App envía:**
```json
{
  "property_id": "abc123",
  "property_name": "Villa Sunrise",
  "city": "Canggu",
  "country": "Indonesia",
  ...
}
```

**n8n espera (según workflow de Booking que SÍ funciona):**
```json
{
  "body": {
    "data": {
      "property": {
        "name": "Villa Sunrise",
        "city": "Canggu",
        "country": "Indonesia",
        ...
      }
    }
  }
}
```

## WORKFLOW DE REFERENCIA (FUNCIONANDO)

Tengo un workflow que SÍ funciona: **"Booking Confirmation Flow"**
- Webhook path: `/webhook/booking_confirmation`
- Usa formato: `{{ $node["Webhook"].json["body"]["data"]["booking"]["field"] }}`
- Email y WhatsApp se entregan correctamente

## LO QUE NECESITO QUE HAGAS

### Opción A: Si tienes acceso al MCP de n8n

1. **Listar workflows:**
   ```
   list_workflows
   ```
   Busca: "MY HOST - New Property Notification"

2. **Inspeccionar workflow:**
   ```
   get_workflow [workflow_id]
   ```

3. **Verificar el formato de variables** en los nodos SendGrid y Chakra:
   - ¿Qué estructura de datos están esperando?
   - ¿Coincide con el workflow de Booking?

4. **Modificar el workflow** para que use el formato correcto:
   ```
   update_workflow [workflow_id] [modificaciones]
   ```

5. **Probar con datos de prueba:**
   ```
   trigger_workflow [workflow_id] con payload de prueba
   ```

### Opción B: Si NO tienes MCP configurado

Te voy a compartir:
1. El JSON completo del workflow
2. El JSON del workflow de Booking (que funciona)
3. El código del frontend que envía el payload

**Necesito que:**
1. Compares ambos workflows
2. Identifiques las diferencias en variables
3. Me des el JSON corregido del workflow
4. Me indiques qué cambiar en el código del frontend (`src/services/n8n.js`)

## ARCHIVOS DE REFERENCIA

Tengo disponible:
- `n8n_worlkflow_claude/MY HOST - New Property Notification (Email+WhatsApp).json` ← Workflow a arreglar
- `n8n_worlkflow_claude/MY HOST - Booking Confirmation Flow (Emial=WhatsApp Meta) FINAL.json` ← Workflow funcionando
- `src/services/n8n.js` ← Código frontend que envía payload

## PAYLOAD DE PRUEBA

Cuando crees una property en la app, se envía:

```json
{
  "property_id": "prop-test-001",
  "property_name": "Villa Sunrise Bali",
  "city": "Canggu",
  "country": "Indonesia",
  "bedrooms": 4,
  "max_guests": 8,
  "base_price": 250,
  "currency": "USD",
  "status": "active"
}
```

## RESULTADO ESPERADO

**Email debe mostrar:**
```
🏠 Nueva Propiedad Creada - Villa Sunrise Bali

DETALLES DE LA PROPIEDAD:
━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 Nombre: Villa Sunrise Bali
📍 Ubicación: Canggu, Indonesia
🛏️ Habitaciones: 4
👥 Huéspedes máx: 8
💰 Precio base: $250 USD
📋 Estado: active
```

**WhatsApp debe enviar:**
```
🏠 *Nueva Propiedad Creada*

*Nombre:* Villa Sunrise Bali
*Ubicación:* Canggu
*Habitaciones:* 4
*Precio:* $250

Revisa los detalles en MY HOST BizMate! 🌺
```

## CREDENCIALES

- **SendGrid:** Ya configurado, email `josecarrallodelafuente@gmail.com`
- **Chakra WhatsApp:** Phone ID `944855278702577`, API token configurado
- **n8n API:** Puedo generar API key si necesitas MCP

## SIGUIENTE PASO

Una vez arreglado el workflow, necesito actualizar el código en:
- `src/services/n8n.js` → función `onPropertyCreated()`

Para que envíe el formato correcto de payload.

NUEVOS FLUJOS:
WORKFLOW 1 — Owner Daily Intelligence (CRÍTICO)
Objetivo
Todos los días, generar un resumen diario del negocio del owner:
KPIs (ocupación, revenue aproximado, check-ins, check-outs, in-house, cancelaciones)
Eventos del día (quién entra/sale, en qué propiedad)
Outlook (7/30 días)
Alertas simples (huecos o baja ocupación) Además:
Guardarlo como “memoria” en Supabase (owner_insights)
Enviarlo al owner por WhatsApp (texto corto)
Trigger
Debe poder ejecutarse en 2 modos:
Manual (para pruebas)
Programado (daily 09:00)
Inputs mínimos
tenant_id (obligatorio)
opcional: date (default hoy)
opcional: property_id (si quiero 1 propiedad)
Ventanas de tiempo
Hoy: today
Próximos 7 días: today..today+7
Próximos 30 días: today..today+30
Semana pasada: today-7..today-1
Métricas a calcular (SIN IA)
checkins_today
checkouts_today
in_house (check_in <= today < check_out)
revenue_next_7d (sum total_amount próximo 7d, si existe)
occupancy_next_7d
si hay inventario/rooms, usarlo
si no, usar heurística por noches ocupadas / noches totales por propiedad
cancellations_last_7d
alerts:
“gap” simple (2+ noches vacías detectadas en próximos 14 días) si es posible
si es complejo, primera versión: detectar días con 0 check-ins 3 días seguidos
Output estructurado (JSON obligatorio)
Generar este objeto final:
Copiar código
Json
{
  "tenant_id": "uuid",
  "date": "YYYY-MM-DD",
  "kpis": {
    "checkins_today": 0,
    "checkouts_today": 0,
    "in_house": 0,
    "occupancy_next_7d": 0.0,
    "revenue_next_7d": 0,
    "cancellations_last_7d": 0
  },
  "events": [],
  "alerts": [],
  "outlook": {
    "next_7d_bookings": 0,
    "next_30d_bookings": 0
  }
}
IA (texto WhatsApp final)
Usar IA SOLO para convertir el JSON en un texto breve WhatsApp: Estructura obligatoria:
Saludo + fecha
KPIs en 3 bullets
Eventos de hoy (si existen)
Alertas (si existen)
1 acción light (NO recomendaciones profundas; eso es workflow 2)
Persistencia (Memoria)
Crear tabla owner_insights si no existe:
id (uuid)
tenant_id
date
payload_json (jsonb)
summary_text (text)
created_at
Guardar 1 registro por día.
Envío WhatsApp
Enviar summary_text al teléfono del owner.
Si no hay tabla owner/tenant con phone, crea mapeo simple o define variable placeholder y deja claro dónde se configura.
Si falla: registrar error y STOP.
WORKFLOW 2 — Owner Alert & Recommendation
Objetivo
Generar recomendaciones SOLO cuando hay señales (baja ocupación, gaps, cancelaciones).
Trigger
Se dispara al final del Workflow 1 si:
occupancy_next_7d < 0.55 OR
cancellations_last_7d >= 2 OR
existe alert severity medium/high
Input
Reutilizar el objeto del Workflow 1. NO recalcular todo.
IA (recomendación)
Debe devolver:
3 hipótesis del “por qué”
3 acciones concretas (quick wins)
1 acción condicional (“solo si…”)
1 pregunta para el owner (para mejorar contexto)
Persistir en tabla owner_recommendations:
id, tenant_id, date, recommendation_text, actions_json, created_at
Enviar por WhatsApp.
WORKFLOW 3 — Owner Ask MyHost (Chat interno)
Objetivo
Chat interno del owner con:
datos en vivo (Supabase)
memoria (últimos owner_insights + owner_recommendations)
estilo “co-manager” (no chatbot genérico)
Trigger
Webhook/WhatsApp inbound: Input: tenant_id + owner_phone + message_text
Retrieval
Traer últimos 7 owner_insights + últimos 7 owner_recommendations
Si pregunta requiere datos en vivo, consultar Supabase (ej: “check-ins hoy”)
IA respuesta
Reglas:
Nunca inventar datos
Citar cifras concretas si existen
Si falta un dato, pedir 1 sola aclaración
Persistir conversación: Tabla owner_conversations:
tenant_id, timestamp, question, answer, sources_json
Responder por WhatsApp.
PRIORIDAD Y EJECUCIÓN
Tu prioridad es:
Construir y dejar perfecto el Workflow 1 (con pruebas reales).
Luego STOP y me pides GO. No avances a Workflow 2 ni 3 sin mi GO.
IMPORTANTE (NO TOCAR)
No modificar frontend actual de Properties/Bookings
No cambiar tablas existentes salvo añadir columnas si es imprescindible
No romper workflows ya existentes que crean bookings

VAPI VOICE ASISTANT 
Workflow IX - 3 cambios en Tool Descriptions:
1. Check Availability:
Check room availability at Izumi Hotel for specific dates. Use this tool when the user asks about availability, if they can book, or wants to know if rooms are available. Requires check-in and check-out dates in YYYY-MM-DD format.
2. Calculate Price:
Calculate the total price for a stay at Izumi Hotel. Use this tool when the user asks how much it costs, the total price, or wants a quote.
3. Create Booking:
Create a pre-booking at Izumi Hotel. Use this tool when the user confirms they want to book and you have collected: full name, email, phone, check-in/check-out dates, and number of guests.


## 📎 Archivos a Compartir con Claude AI

Si Claude AI pide los archivos, compartir:

### 1. Workflow a Arreglar
**Archivo:** `C:\myhost-bizmate\n8n_worlkflow_claude\MY HOST - New Property Notification (Email+WhatsApp).json`

### 2. Workflow de Referencia (Funcionando)
**Archivo:** `C:\myhost-bizmate\n8n_worlkflow_claude\MY HOST - Booking Confirmation Flow (Emial=WhatsApp Meta) FINAL.json`

### 3. Código Frontend
**Archivo:** `C:\myhost-bizmate\src\services\n8n.js`
**Función específica:** `onPropertyCreated()`

---

## 🔑 Configuración MCP (Si Claude AI lo necesita)

**Para configurar MCP de n8n:**

1. **Generar API Key:**
   - Login: https://n8n-production-bb2d.up.railway.app
   - Settings → API → Create API Key
   - Copiar key (empieza con `n8n_api_...`)

2. **Compartir con Claude AI:**
   ```
   N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxx
   N8N_BASE_URL=https://n8n-production-bb2d.up.railway.app
   ```

3. **Claude AI configurará MCP automáticamente**

---

## ✅ Criterios de Éxito

Workflow funcionando cuando:

- [x] Email llega con todos los campos completos
- [x] WhatsApp se entrega correctamente
- [x] Variables se reemplazan con datos reales
- [x] Formato consistente con workflow de Booking
- [x] Testing end-to-end exitoso

---

## 📚 Documentación Adicional

**Documentación completa disponible en:**
- `Claude AI and Code Update 21122025/N8N_WORKFLOWS_DOCUMENTATION.md`
- `Claude AI and Code Update 21122025/TECHNICAL_DEEP_DIVE_AUTH_SESSION.md`
- `Claude AI and Code Update 21122025/RESUMEN_EJECUTIVO_21DIC2025.md`

---

**Preparado por:** Claude Code
**Fecha:** 21 Diciembre 2025
**Para:** Claude AI (claude.ai)


WORKFLOW 1 — Owner Daily Intelligence (CRÍTICO)
Objetivo
Todos los días, generar un resumen diario del negocio del owner:
KPIs (ocupación, revenue aproximado, check-ins, check-outs, in-house, cancelaciones)
Eventos del día (quién entra/sale, en qué propiedad)
Outlook (7/30 días)
Alertas simples (huecos o baja ocupación) Además:
Guardarlo como “memoria” en Supabase (owner_insights)
Enviarlo al owner por WhatsApp (texto corto)
Trigger
Debe poder ejecutarse en 2 modos:
Manual (para pruebas)
Programado (daily 09:00)
Inputs mínimos
tenant_id (obligatorio)
opcional: date (default hoy)
opcional: property_id (si quiero 1 propiedad)
Ventanas de tiempo
Hoy: today
Próximos 7 días: today..today+7
Próximos 30 días: today..today+30
Semana pasada: today-7..today-1
Métricas a calcular (SIN IA)
checkins_today
checkouts_today
in_house (check_in <= today < check_out)
revenue_next_7d (sum total_amount próximo 7d, si existe)
occupancy_next_7d
si hay inventario/rooms, usarlo
si no, usar heurística por noches ocupadas / noches totales por propiedad
cancellations_last_7d
alerts:
“gap” simple (2+ noches vacías detectadas en próximos 14 días) si es posible
si es complejo, primera versión: detectar días con 0 check-ins 3 días seguidos
Output estructurado (JSON obligatorio)
Generar este objeto final:
Copiar código
Json
{
  "tenant_id": "uuid",
  "date": "YYYY-MM-DD",
  "kpis": {
    "checkins_today": 0,
    "checkouts_today": 0,
    "in_house": 0,
    "occupancy_next_7d": 0.0,
    "revenue_next_7d": 0,
    "cancellations_last_7d": 0
  },
  "events": [],
  "alerts": [],
  "outlook": {
    "next_7d_bookings": 0,
    "next_30d_bookings": 0
  }
}
IA (texto WhatsApp final)
Usar IA SOLO para convertir el JSON en un texto breve WhatsApp: Estructura obligatoria:
Saludo + fecha
KPIs en 3 bullets
Eventos de hoy (si existen)
Alertas (si existen)
1 acción light (NO recomendaciones profundas; eso es workflow 2)
Persistencia (Memoria)
Crear tabla owner_insights si no existe:
id (uuid)
tenant_id
date
payload_json (jsonb)
summary_text (text)
created_at
Guardar 1 registro por día.
Envío WhatsApp
Enviar summary_text al teléfono del owner.
Si no hay tabla owner/tenant con phone, crea mapeo simple o define variable placeholder y deja claro dónde se configura.
Si falla: registrar error y STOP.
WORKFLOW 2 — Owner Alert & Recommendation
Objetivo
Generar recomendaciones SOLO cuando hay señales (baja ocupación, gaps, cancelaciones).
Trigger
Se dispara al final del Workflow 1 si:
occupancy_next_7d < 0.55 OR
cancellations_last_7d >= 2 OR
existe alert severity medium/high
Input
Reutilizar el objeto del Workflow 1. NO recalcular todo.
IA (recomendación)
Debe devolver:
3 hipótesis del “por qué”
3 acciones concretas (quick wins)
1 acción condicional (“solo si…”)
1 pregunta para el owner (para mejorar contexto)
Persistir en tabla owner_recommendations:
id, tenant_id, date, recommendation_text, actions_json, created_at
Enviar por WhatsApp.
WORKFLOW 3 — Owner Ask MyHost (Chat interno)
Objetivo
Chat interno del owner con:
datos en vivo (Supabase)
memoria (últimos owner_insights + owner_recommendations)
estilo “co-manager” (no chatbot genérico)
Trigger
Webhook/WhatsApp inbound: Input: tenant_id + owner_phone + message_text
Retrieval
Traer últimos 7 owner_insights + últimos 7 owner_recommendations
Si pregunta requiere datos en vivo, consultar Supabase (ej: “check-ins hoy”)
IA respuesta
Reglas:
Nunca inventar datos
Citar cifras concretas si existen
Si falta un dato, pedir 1 sola aclaración
Persistir conversación: Tabla owner_conversations:
tenant_id, timestamp, question, answer, sources_json
Responder por WhatsApp.
PRIORIDAD Y EJECUCIÓN
Tu prioridad es:
Construir y dejar perfecto el Workflow 1 (con pruebas reales).
Luego STOP y me pides GO. No avances a Workflow 2 ni 3 sin mi GO.
IMPORTANTE (NO TOCAR)
No modificar frontend actual de Properties/Bookings
No cambiar tablas existentes salvo añadir columnas si es imprescindible
No romper workflows ya existentes que crean bookings