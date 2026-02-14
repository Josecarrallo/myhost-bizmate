# PROMPT DE CONTINUACIÓN - MY HOST BIZMATE
## Fecha: 26 de Diciembre 2025

---

## CONTEXTO DEL PROYECTO

Soy José, founder de MY HOST BizMate, una plataforma SaaS de automatización con IA para hoteles boutique y villas en el sudeste asiático. Mi cliente piloto es Izumi Hotel, un hotel boutique 5 estrellas con 7 villas de lujo en Ubud, Bali, que abre en verano 2026.

---

## ESTADO ACTUAL (25 Diciembre 2025)

### ✅ COMPLETADO HOY

**VAPI + N8N Voice Assistant (Ayu - Izumi Hotel)**
- Flujo completo de reservas por voz funcionando
- VAPI llama correctamente al tool send_to_n8n
- N8N ejecuta las herramientas (Check Availability, Calculate Price, Create Booking)
- Reservas se guardan en Supabase
- Problema de fechas 2023 vs 2025 corregido con prompt

**Documentación actualizada:**
- `VAPI_N8N_Documentation_25122025.md` con todos los prompts y configuraciones

---

## CONFIGURACIÓN ACTUAL QUE FUNCIONA

### VAPI System Prompt (Ayu - Izumi Hotel)
```
You are Ayu from Izumi Hotel in Bali. Always respond in English only.

IMPORTANT: The current year is 2025. When users mention dates without a year, always assume 2025 or 2026. Never use 2023 or 2024.

IMPORTANT: When using the send_to_n8n tool, you MUST include ALL information collected from the user in the user_query parameter. This includes:
- Check-in and check-out dates (always use year 2025 or 2026)
- Number of guests
- Room type
- Guest full name
- Guest email
- Guest phone number with country code

CRITICAL: When the user says YES to confirm a reservation, you MUST send ALL the booking data to n8n in this format:
"CREATE BOOKING: guest_name=[name], guest_email=[email], guest_phone=[phone], check_in=[YYYY-MM-DD], check_out=[YYYY-MM-DD], guests=[number], room_type=[room], total_price=[amount]"

Always use the send_to_n8n tool for every user message. Never respond without using the tool first.
```

### N8N Workflow
- **URL**: https://n8n-production-bb2d.up.railway.app
- **Workflow**: Vapi Izumi Hotel - MYHOST Bizmate IX (ID: 3sU4RgV892az8nLZ)
- **Webhook**: /webhook/vapi-izumi-fix

### Supabase
- **URL**: https://jjpscimtxrudtepzwhag.supabase.co
- **Property ID**: 18711359-1378-4d12-9ea6-fb31c0b1bac2

---

## PENDIENTES PARA HOY (26 Diciembre)

### 1. MEJORAR PROMPTS DE VAPI Y N8N
**Problemas actuales:**
- La primera respuesta de Ayu pide demasiada información de golpe
- El flujo de conversación no es natural
- Debería ser más conversacional y pedir información paso a paso

**Objetivo:**
- Crear un flujo más natural: saludar → preguntar fechas → preguntar huéspedes → recomendar habitación → pedir datos personales → confirmar → crear reserva

### 2. OWNER DAILY INTELLIGENCE
**Estado:** Pendiente
**Descripción:** Sistema que genera resúmenes diarios automáticos para propietarios de hoteles
- Ocupación del día
- Reservas nuevas
- Check-ins/Check-outs del día
- Alertas importantes
- Recomendaciones de IA

### 3. WHATSAPP CHATBOT (ChakraHQ)
**Estado:** En desarrollo
**Pendientes:**
- Mejorar respuestas del chatbot
- Integrar con el flujo de reservas
- Manejar diferentes tipos de mensajes (texto, voz, imágenes)

### 4. EVALUAR ALTERNATIVAS A VAPI
**Opciones a investigar:**
- ElevenLabs Conversational AI
- Retell AI
- Bland AI

**Razón:** VAPI tuvo comportamiento inconsistente que costó 9 horas de debug

---

## ARQUITECTURA TÉCNICA

### Stack
- **Frontend**: React + Tailwind CSS (Vercel)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Workflows**: N8N (Railway)
- **Voice AI**: VAPI
- **WhatsApp**: ChakraHQ
- **AI**: OpenAI GPT-4o-mini

### Repositorios/URLs
- Frontend: https://my-host-bizmate.vercel.app
- N8N: https://n8n-production-bb2d.up.railway.app
- VAPI Dashboard: https://dashboard.vapi.ai
- Supabase: https://supabase.com/dashboard

---

## MODELO DE NEGOCIO

- **Target**: Hoteles boutique y villas pequeñas (1-3 propiedades) en SE Asia
- **Precio**: $50-70/mes (vs competidores $250-300+)
- **Objetivo**: 100-200 clientes para $3,000-6,000 MRR

---

## ARCHIVOS IMPORTANTES

- `VAPI_N8N_Documentation_25122025.md` - Documentación completa del sistema de voz
- `Vapi_Izumi_Hotel_-_MYHOST_Bizmate_IX__7_.json` - Backup del workflow N8N

---

## INSTRUCCIONES PARA CLAUDE

1. **Comunicación**: Responde en español, código y configuraciones en inglés
2. **Cambios de prompts**: No hagas cambios drásticos, solo ajustes puntuales
3. **Antes de cambiar algo**: Muéstrame el cambio exacto y espera confirmación
4. **Debug**: Sigue el orden: VAPI logs → N8N executions → Supabase
5. **Backups**: Siempre pide exportar antes de hacer cambios grandes

---

## PREGUNTAS PARA EMPEZAR

1. ¿Empezamos mejorando el flujo conversacional de Ayu?
2. ¿Prefieres trabajar en Owner Daily Intelligence?
3. ¿Quieres que investigue las alternativas a VAPI primero?

---

*Copia este prompt completo para empezar la sesión del 26 de diciembre*
