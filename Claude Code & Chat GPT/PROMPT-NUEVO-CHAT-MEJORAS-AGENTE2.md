# PROMPT PARA NUEVO CHAT - MY HOST BizMate
## Continuar desarrollo WhatsApp AI Agent - Izumi Hotel

---

## CONTEXTO

Estoy desarrollando MY HOST BizMate, un SaaS para gestión de villas en Bali. Hoy completamos el **Agente 2: WhatsApp AI Agent** para Izumi Hotel.

### Estado actual:
- ✅ Agente 1: Booking Confirmation Flow (completado)
- ✅ Agente 2: WhatsApp AI Agent (completado y funcionando)

### El Agente 2 incluye:
- Workflow n8n ID: **ln2myAS3406D6F8W**
- WhatsApp via ChakraHQ
- 3 Tools conectados: Check Availability, Calculate Price, Create Booking
- Reservas se guardan en Supabase tabla bookings
- Memoria conversacional (5 mensajes)

---

## INFRAESTRUCTURA

### n8n
- URL: https://n8n-production-bb2d.up.railway.app
- Tengo MCP n8n configurado con herramientas: list_workflows, get_workflow, create_workflow, get_executions, trigger_workflow, update_workflow

### Supabase
- URL: https://jjpscimtxrudtepzwhag.supabase.co
- Property ID Izumi: 18711359-1378-4d12-9ea6-fb31c0b1bac2
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqcHNjaW10eHJ1ZHRlcHp3aGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NDMyMzIsImV4cCI6MjA3ODUxOTIzMn0._U_HwdF5-yT8-prJLzkdO_rGbNuu7Z3gpUQW0Q8zxa0

### ChakraHQ (WhatsApp Business API)
- Número: +62 813 2576 4867
- API: https://api.chakrahq.com/v1/ext/plugin/whatsapp/2e45a0bd-8600-41b4-ac92-599d59d6221c/api/v19.0/944855278702577/messages

---

## LO QUE QUIERO HACER

Añadir las siguientes mejoras al Agente 2:

1. **Notificación al staff cuando hay nueva reserva** (prioridad alta)
   - Enviar WhatsApp o email al equipo cuando se crea una reserva

2. **Transcripción de audios de WhatsApp**
   - El bot puede recibir audios y transcribirlos para responder

3. **Envío de imágenes del hotel**
   - Cuando el cliente pide ver fotos, enviar imágenes de las villas

4. **Integración con pagos**
   - Generar link de pago cuando confirman reserva

---

## NOTAS TÉCNICAS IMPORTANTES

- La tabla bookings tiene constraint en channel: solo acepta 'direct', 'airbnb', 'booking', 'expedia', 'agoda', 'vrbo'
- RLS está desactivado en tabla bookings (pendiente configurar correctamente)
- El workflow usa gpt-4.1-mini como modelo
- Simple Memory configurado con Context Window Length = 5

---

## PETICIÓN

Empecemos por la **notificación al staff cuando hay nueva reserva**. Es la más útil y debería ser rápida de implementar.

Primero verifica el estado actual del workflow con get_workflow antes de hacer cambios.
