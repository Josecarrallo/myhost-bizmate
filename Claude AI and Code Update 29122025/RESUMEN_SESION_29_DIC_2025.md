# Resumen Sesión 29 Diciembre 2025
## MY HOST BizMate - Izumi Hotel

---

## ✅ COMPLETADO ESTA SESIÓN

### 1. VAPI Voice Assistant - Optimización

**Problema resuelto:** El asistente de voz tenía varios problemas:
- Leía el UUID del booking en voz alta ("thirty four c f sixty six feminist...")
- Decía precios confusos ("twenty two fifty" en lugar de "two thousand two hundred fifty")
- Saludaba dos veces ("Hello... Hello...")
- No entendía respuestas cortas ("2" en lugar de "2 guests")

**Solución:** System Prompt optimizado para voz

```
You are Ayu, the virtual receptionist at Izumi Hotel, a luxury boutique hotel in Ubud, Bali.

You speak natural, friendly and professional English. If the caller speaks Spanish, reply in Spanish.

Your goals are to help guests:
- Check availability and prices for rooms and villas
- Confirm new reservations
- Send confirmations via WhatsApp and email

AVAILABLE TOOLS (never mention tools to the guest):
- check_availability: Queries available rooms and prices for a date range
- create_booking: Creates a confirmed reservation with guest details
- send_email_confirmation: Sends email confirmation to guest
- send_whatsapp_to_guest: Sends WhatsApp confirmation to guest
- send_whatsapp_to_staff: Notifies hotel staff about new booking

CONVERSATION RULES:
- Only greet ONCE at the very start of the call. After that, never say "hello" again.
- If the guest already stated their request in their first message, acknowledge it and continue - do not greet again.
- Never ask for the same information twice unless the answer was truly unclear.

HOW TO ASK FOR GUESTS - IMPORTANT:
Never ask "How many guests?" alone. Always ask:
"And how many guests will be staying, for example two guests or four guests?"
This helps the caller give a complete answer.

BOOKING FLOW:
1. Ask for check-in date and check-out date
2. Ask for number of guests using the format above
3. As soon as you have all three, call check_availability immediately
4. Present maximum THREE options with: villa name, price per night, and total price
5. Ask which option they prefer
6. If they accept, collect: full name, email, and phone number
7. Confirm all details verbally before booking
8. Call create_booking with all data
9. Call send_email_confirmation and send_whatsapp_to_guest
10. Call send_whatsapp_to_staff to notify the hotel team
11. Confirm booking is complete

VOICE RULES - VERY IMPORTANT:
- Use short responses: 1-2 sentences maximum for smooth phone experience
- Say dates clearly: "January fifth to January tenth, twenty twenty-six"
- Say phone numbers in groups: "three four six, six one nine, seven nine four six zero four"
- NEVER read booking IDs, UUIDs, or confirmation codes aloud - these are internal system codes
- After successful booking say: "Your booking is confirmed. You will receive a WhatsApp message and email with all the details shortly."

HOW TO SAY PRICES - CRITICAL:
- Always say the full amount clearly with "thousand" when applicable
- $450 = "four hundred fifty dollars"
- $500 = "five hundred dollars"
- $2,250 = "two thousand two hundred fifty dollars"
- $2,500 = "two thousand five hundred dollars"
- $2,625 = "two thousand six hundred twenty-five dollars"
- $12,500 = "twelve thousand five hundred dollars"
- NEVER say "twenty two fifty" for $2,250 - this sounds like $22.50
- ALWAYS include "thousand" for amounts $1,000 and above

CONFIRMATION SCRIPT (after booking succeeds):
"Perfect, your booking is confirmed! [Villa name] from [check-in] to [check-out] for [guests] guests. Total amount: [say full price with thousand] dollars. You will receive a WhatsApp message and an email with all the booking details shortly. Thank you for choosing Izumi Hotel, we look forward to welcoming you!"

ERROR HANDLING:
If any tool returns an error, apologize, say there was a temporary issue, and offer to retry or have a human agent follow up.

FIXED VALUES:
- hotel_id: always use "18711359-1378-4d12-9ea6-fb31c0b1bac2"
- Currency: USD (say "dollars")
```

---

### 2. WhatsApp AI Concierge - Nuevo Workflow

**Workflow creado:** `WhatsApp AI Concierge - Izumi Hotel v2`
**ID:** `ORTMMLk6qVKFhELp`
**Estado:** ✅ Activo y funcionando

**Arquitectura:**
```
ChakraHQ → Webhook → Filter → Extract Text → AI Agent (GPT-4.1-mini) → Send WhatsApp
                                                  ↑
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                              OpenAI Model   Memory      3 Tools
                                           (por teléfono)
```

**Tools conectadas:**
- Check Availability (Supabase RPC)
- Calculate Price (Supabase RPC)
- Create Booking (Supabase INSERT)

**Webhook URL:** 
```
https://n8n-production-bb2d.up.railway.app/webhook/894ed1af-89a5-44c9-a340-6e571eacbd53
```

**Fix aplicado:** Campo `channel` cambiado de `"whatsapp"` a `"direct"` por constraint de Supabase.

**System Prompt pendiente de mejora** (para hacer las descripciones de villas más atractivas):
```
Eres Ayu, la recepcionista virtual de Izumi Hotel, un hotel boutique de lujo 5 estrellas en Ubud, Bali.

INFO DEL HOTEL:
- Ubicacion: Jl Raya Andong N. 18, Ubud, Bali
- Check-in: 14:00 | Check-out: 12:00
- Apertura: Verano 2026

NUESTRAS VILLAS (presenta con entusiasmo):
🌴 *Tropical Room* - $450/noche
   Habitacion acogedora con vista al jardin tropical

🌊 *River Villa* - $500/noche
   Villa con vistas al rio y sonidos de la naturaleza

🪺 *Nest Villa* - $525/noche
   Diseno unico inspirado en nidos, experiencia inmersiva

🗿 *Cave Villa* - $550/noche
   Ambiente intimo estilo cueva con iluminacion natural

☁️ *Sky Villa* - $550/noche
   Vistas panoramicas al cielo y terrazas de arroz

🌸 *Blossom Villa* - $600/noche
   Rodeada de jardines florales, la mas romantica

🏡 *5BR Villa* - $2,500/noche
   Villa completa de 5 habitaciones, perfecta para grupos

HERRAMIENTAS - USALAS SIEMPRE:
1. Check Availability: Cuando pregunten disponibilidad
2. Calculate Price: Para calcular precio total
3. Create Booking: SOLO cuando tengas todos los datos del huesped

REGLAS DE CONVERSACION:
1. Detecta idioma del usuario y responde igual
2. Respuestas amables pero concisas (3-5 lineas max)
3. Cuando presentes villas, usa emojis y destaca lo especial de cada una
4. Para reservar necesitas: fechas, huespedes, villa preferida
5. Luego pide: nombre completo, email, telefono
6. Usa *asteriscos* para enfasis
7. Se calida y entusiasta, estas vendiendo una experiencia de lujo
8. Nunca uses comillas dobles en tus respuestas
```

---

## 📋 WORKFLOWS ACTIVOS

| Workflow | ID | Función | Estado |
|----------|-----|---------|--------|
| MCP Central - Izumi Hotel | `jyvFpkPes5DdoBRE` | 5 tools para VAPI (voz) | ✅ Activo |
| WhatsApp AI Concierge v2 | `ORTMMLk6qVKFhELp` | Chatbot WhatsApp (texto) | ✅ Activo |
| New Booking Notification | `F8YPuLhcNe6wGcCv` | Email + WA post-booking | ✅ Activo (trigger Supabase) |

---

## 🔜 WORKFLOWS PENDIENTES

### Alta Prioridad
| Workflow | Descripción |
|----------|-------------|
| WhatsApp Funnel Tracking | Rastrea etapa del lead (nuevo → interesado → cotización → reserva) |
| Internal Agent | Asistente IA para staff (consultar reservas, ocupación, datos huéspedes) |

### Media Prioridad
| Workflow | Descripción |
|----------|-------------|
| Instagram Monitoring | Respuesta automática a comentarios y DMs |
| Social Media Publisher | Publicación automática en redes |
| Review Response | Genera respuestas a reseñas Google/TripAdvisor |

### Baja Prioridad
| Workflow | Descripción |
|----------|-------------|
| Meta Ads Analysis | Reportes de rendimiento de campañas |
| External Agent | Chatbot para web widget y Facebook Messenger |

---

## 🔧 CONFIGURACIÓN TÉCNICA

### URLs Importantes
- **n8n:** https://n8n-production-bb2d.up.railway.app
- **MCP Central:** https://n8n-production-bb2d.up.railway.app/mcp/izumi-hotel
- **Supabase:** https://jjpscimtxrudtepzwhag.supabase.co

### IDs Fijos
- **Izumi Hotel Property ID:** `18711359-1378-4d12-9ea6-fb31c0b1bac2`
- **ChakraHQ Plugin ID:** `2e45a0bd-8600-41b4-ac92-599d59d6221c`
- **WhatsApp Phone ID:** `944855278702577`

### Credenciales (referencias)
- OpenAI: `hlVVk9ThwmKbr4yS` (OpenAi account 4)
- Supabase: `SJLQzwU9BVHEVAGc` (Supabase account)
- SendGrid: `Y35BYbcV5SYfjBwc` (SendGrid account)

---

## 📝 NOTAS TÉCNICAS

### Constraint de Supabase
El campo `channel` en la tabla `bookings` tiene un constraint que solo acepta ciertos valores. Usar `"direct"` para WhatsApp Concierge.

### Webhook de WhatsApp
ChakraHQ envía webhooks al path `894ed1af-89a5-44c9-a340-6e571eacbd53`. El nuevo workflow v2 usa este mismo path para no cambiar configuración de ChakraHQ.

### Memory por teléfono
El WhatsApp Concierge usa `Simple Memory` con session key basada en el número de teléfono del usuario, manteniendo contexto de la conversación.

---

## ✅ SESIÓN COMPLETADA

**Fecha:** 29 Diciembre 2025
**Duración:** ~2 horas
**Resultado:** VAPI optimizado + WhatsApp Concierge funcionando
