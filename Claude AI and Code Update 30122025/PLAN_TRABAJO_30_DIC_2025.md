# Plan de Trabajo - 30 Diciembre 2025
## MY HOST BizMate - Izumi Hotel

---

## 📋 TAREAS DE HOY

### ✅ Tarea 0: Prompt para Claude Code (COMPLETADA)
- Crear prompt detallado para módulo "Workflows & Automations"
- **Estado:** ✅ Completado
- **Archivo:** `PROMPT_CLAUDE_CODE_WORKFLOWS_AUTOMATIONS.md`

---

### ⏳ Tarea 1: WhatsApp Concierge a Inglés
**Workflow:** `WhatsApp AI Concierge - Izumi Hotel MYHOST Bizmate XXI`
**ID:** `ORTMMLk6qVKFhELp`

**Cambios a realizar:**
1. System Prompt del AI Agent → Inglés
2. Tool descriptions (3 tools) → Inglés
3. $fromAI descriptions en JSON body → Inglés

**System Prompt preparado:**
```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury 5-star boutique hotel in Ubud, Bali.

HOTEL INFO:
- Location: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 2:00 PM | Check-out: 12:00 PM
- Opening: Summer 2026

OUR VILLAS (present with enthusiasm):
🌴 *Tropical Room* - $450/night - Cozy room with tropical garden views
🌊 *River Villa* - $500/night - Villa with river views and sounds of nature
🪺 *Nest Villa* - $525/night - Unique nest-inspired design
🗿 *Cave Villa* - $550/night - Intimate cave-style ambiance
☁️ *Sky Villa* - $550/night - Panoramic sky views and rice terraces
🌸 *Blossom Villa* - $600/night - Surrounded by flower gardens
🏡 *5BR Villa* - $2,500/night - Complete 5-bedroom villa for groups

TOOLS - ALWAYS USE THEM:
1. Check Availability: When they ask about availability
2. Calculate Price: To calculate total price
3. Create Booking: ONLY when you have all guest details

CONVERSATION RULES:
1. Detect user language and respond accordingly
2. Friendly but concise responses (3-5 lines max)
3. When presenting villas, use emojis and highlight what makes each special
4. To book you need: dates, guests, preferred villa
5. Then ask for: full name, email, phone
6. Use *asterisks* for emphasis
7. Be warm and enthusiastic, you are selling a luxury experience
8. Never use double quotes in your responses
```

**Tool descriptions preparadas:**
- Check Availability: "Check villa availability at Izumi Hotel for specific dates..."
- Calculate Price: "Calculate the total price for a stay at Izumi Hotel..."
- Create Booking: "Create a booking at Izumi Hotel. Use this tool ONLY when..."

---

### ⏳ Tarea 2: Internal Agent (Staff)
**Prioridad:** Alta
**Complejidad:** Media

**Descripción:**
Crear un asistente IA para el staff del hotel que pueda:
- Consultar reservas del día/semana
- Buscar datos de huéspedes
- Ver ocupación actual
- Generar reportes rápidos

**Pendiente definir:**
- ¿Canal? (WhatsApp grupo staff, web interna, o ambos)
- ¿Qué consultas específicas necesita el staff?
- ¿Tools a crear en n8n?

---

### ⏳ Tarea 3: Cambiar SendGrid por nodo "Send Email"
**Workflows a modificar:**

| # | Workflow | ID |
|---|----------|-----|
| 1 | MCP Central - Izumi Hotel MYHOST Bizmate XX | `jyvFpkPes5DdoBRE` |
| 2 | (workflow adicional) | `GJ2oszq3y5vR0bQG` |
| 3 | New Property notification | (buscar ID) |
| 4 | New Booking notification | `F8YPuLhcNe6wGcCv` |

**Cambio:**
- Eliminar nodo SendGrid
- Añadir nodo "Send Email" nativo de n8n
- Configurar SMTP o usar credenciales existentes

---

### 🔜 Tarea 4: Daily Guest Recommendations (Próxima sesión)
**Descripción:**
Enviar recomendaciones personalizadas a huéspedes durante su estancia cada mañana.

---

### 🔜 Tarea 5: Social Media Publisher (Próxima sesión)
**Descripción:**
Publicación automática de contenido en Instagram/Facebook.

---

## 📊 RESUMEN

| # | Tarea | Estado | Tiempo estimado |
|---|-------|--------|-----------------|
| 0 | Prompt Claude Code | ✅ Completado | - |
| 1 | WhatsApp a inglés | ⏳ Pendiente | 15 min |
| 2 | Internal Agent | ⏳ Pendiente | 1-2 horas |
| 3 | Cambiar SendGrid | ⏳ Pendiente | 30 min |
| 4 | Daily Recommendations | 🔜 Próxima sesión | - |
| 5 | Social Media Publisher | 🔜 Próxima sesión | - |

---

## 🔧 RECURSOS

**n8n Dashboard:**
https://n8n-production-bb2d.up.railway.app

**Workflows activos:**
- MCP Central: `jyvFpkPes5DdoBRE`
- WhatsApp Concierge: `ORTMMLk6qVKFhELp`
- Booking Notification: `F8YPuLhcNe6wGcCv`

**IDs fijos:**
- Izumi Hotel Property: `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- ChakraHQ Plugin: `2e45a0bd-8600-41b4-ac92-599d59d6221c`

---

*Documento generado: 30 Diciembre 2025*
