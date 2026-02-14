# 📝 ACTUALIZAR WORKFLOW VI - Mensaje de Confirmación

**Workflow:** MY HOST - Booking Confirmation Flow (Email+WhatsApp Chakra - MY HOST Bizmate VI)
**ID:** OxNTDO0yitqV6MAL

---

## 🎯 ACCIÓN REQUERIDA:

Necesitas actualizar manualmente el mensaje de WhatsApp en n8n con el nuevo texto.

---

## 📋 PASOS:

### 1. Ir a n8n:
```
https://n8n-production-bb2d.up.railway.app
```

### 2. Buscar el workflow:
- "MY HOST - Booking Confirmation Flow (Email=WhatsApp Chakra - MY HOST Bizmate VI)"
- Click para abrir

### 3. Encontrar el nodo "HTTP Request":
- Es el nodo que envía el mensaje de WhatsApp al cliente
- Click en ese nodo

### 4. Actualizar el campo "jsonBody":

**REEMPLAZAR el texto actual por este:**

```json
{
  "messaging_product": "whatsapp",
  "to": "{{ $node['Webhook'].json['body']['guest_phone'] }}",
  "type": "text",
  "text": {
    "body": "✓ *Reserva Confirmada - Izumi Hotel*\n\nHola {{ $node['Webhook'].json['body']['guest_name'] }},\n\n🏠 Izumi Hotel\n📍 Jl Raya Andong N. 18, Ubud, Bali\n📅 Check-in: {{ $node['Webhook'].json['body']['check_in'] }} a las 14:00\n📅 Check-out: {{ $node['Webhook'].json['body']['check_out'] }} a las 12:00\n👥 Huéspedes: {{ $node['Webhook'].json['body']['guests_count'] }}\n💰 Total: ${{ $node['Webhook'].json['body']['total_amount'] }}\n\n━━━━━━━━━━━━━━━━━\n\n🤖 *¿Tienes preguntas?*\n\nHabla con nuestro recepcionista virtual 24/7:\n\n📱 *WhatsApp:* +62 813-2576-4867\n\nEscribe cualquier consulta sobre tu reserva, el hotel, o actividades en Bali.\n\n━━━━━━━━━━━━━━━━━\n\n✨ ¡Te esperamos en el paraíso!\n\nSaludos,\nEquipo Izumi Hotel"
  }
}
```

### 5. Guardar:
- Click "Save" (arriba a la derecha)
- ✅ Listo

---

## 📧 TAMBIÉN: Actualizar Email (Opcional)

Si quieres agregar el mismo mensaje al email de confirmación:

**Nodo:** "Send an email"

**Agregar al final del HTML:**

```html
<hr style="border: 1px solid #e5e7eb; margin: 30px 0;">

<div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
  <h3 style="color: #6b7280; margin-top: 0;">🤖 ¿Tienes preguntas?</h3>
  <p style="color: #374151;">Habla con nuestro recepcionista virtual 24/7:</p>

  <p style="margin: 15px 0;">
    <strong>📱 WhatsApp:</strong>
    <a href="https://wa.me/6281325764867" style="color: #10b981; text-decoration: none;">
      +62 813-2576-4867
    </a>
  </p>

  <p style="color: #6b7280; font-size: 14px;">
    Escribe cualquier consulta sobre tu reserva, el hotel, o actividades en Bali.
  </p>
</div>
```

---

## ✅ VERIFICAR:

Después de actualizar:

1. En n8n, click "Execute Workflow" (test manual)
2. Revisar que el mensaje se ve bien
3. O hacer una reserva de prueba y ver el mensaje real

---

**¿Ya actualizaste el workflow?** Avísame para continuar con el widget de Vapi.
